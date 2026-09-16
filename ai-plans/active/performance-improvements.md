# Plan: Library-wide performance improvements

Status: **Not started — plan only, nothing built**
Created: 2026-09-16
Target: the whole library, with the heaviest work in `src/lib/Evented.ts`, `Marker.ts`, `Map.ts`, `Overlay.ts`, `LatLngBounds.ts`, `Polyline.ts`, `DataLayer.ts`

Follows the polyline/ES2022 performance push recorded in the Unreleased section of `CHANGELOG.md`.

---

## 1. Goal

Apply the wins from the polyline push to the rest of the library, and finish the polyline
work that pass left behind.

The reference workloads throughout are the ones the library is actually used with:

- 20,000 markers, many with a tooltip and a popup attached
- 1,400 polylines holding 2.4 million points
- a page with 2,595 trail segments, each with a tooltip and a popup
- 500,000 `LatLng` objects
- GeoJSON data layers with tens of thousands of features

**Scope discipline:** this plan is ordered so that the cheap, non-breaking, high-yield work
comes first and can ship on its own. The breaking and architectural items are deliberately
parked at the end, and section 11 records what was consciously left out.

---

## 2. What is already done — do not redo

Recorded so that this plan does not re-propose work that has already landed.

- **ES2022 native `#private` fields.** `tsconfig.json` targets `es2022` with
  `useDefineForClassFields: false`. This is genuinely in effect end to end — see section 3.
- Polyline path points stored as a `Float64Array` of plain numbers, not a `LatLng` per point.
- Polylines are not drawn until shown; highlight polylines are not built until first hover.
- The polyline `ready` event can dispatch before the Google polyline exists.
- One-time event listeners are removed in a single pass.
- Simplify results are cached per tolerance and skipped when the tolerance bucket is unchanged.
- The RDP implementation is already iterative, already avoids `sqrt`, and already hoists the
  `Math.cos` projection out of the per-point loop.
- The data layer already has a `WeakMap` index from Google feature to `DataFeature`, already
  parallelizes multi-URL `loadGeoJson`, and already renders `{property}` templates lazily at
  show time. That subsystem's overlay attachment design is good and is not changed here.

---

## 3. The ES2022 target reaches every build — verified, no action needed

This was the biggest open risk going in: whether tsup passes the tsconfig `target` through to
esbuild for *both* entries, or whether the ESM/CJS build silently re-introduced the WeakMap
private-field emulation the team just escaped.

**It does not. The win is intact.** Evidence:

1. `node_modules/tsup/dist/index.js:1478` falls back to
   `tsconfig.data.compilerOptions.target` when no explicit target is set, and applies it per
   config entry.
2. `dist/browser.js`, `dist/index.cjs` and `dist/index.esm.js` contain **zero** occurrences of
   `__privateGet`, `__privateSet` or `__classPrivateFieldGet`. `dist/index.esm.js` opens with
   `var Base = class { #objectType; ... }`.
3. The handful of `WeakMap` hits in dist are the library's own (`DataLayer` `#features` and
   `#svgSymbols`, `OverlayAttachment` state), not downleveling.
4. A direct `esbuild --target=es2022` browser build is byte-identical (166,725 B, same md5) to
   the committed `dist/browser.js`.

**One piece of insurance is still worth adding. — DONE 2026-09-16.** The target was inherited
*implicitly*; tsup's fallback when it cannot find one is `node16`. If `target` were ever removed
from `tsconfig.json`, or a build ran against a different tsconfig, the browser bundle would have
started downleveling silently with no error. An explicit `target: 'es2022'` is now set on both
entries in `tsup.config.js`. Verified to produce zero output change, so `dist/` does not need
rebuilding for this on its own.

---

## 4. The four root causes

Six independent audits converged on the same small set of causes. This is the useful framing —
most of the individual findings are instances of one of these four.

### 4.1 `Evented` allocates for every object before anyone subscribes

Every `Marker`, `Polyline`, `Overlay`, `Popup`, `Tooltip`, `InfoWindow`, `DataFeature`, `Map`
and `DataLayer` extends `Evented`. It eagerly allocates five containers per instance
(`Evented.ts:90, 98, 106, 132, 140`), and **two of them are dead code** —
`#pendingLoadEventListeners` and `#isOnLoadEventSet` appear exactly twice in all of `src/`, both
times as their own declarations. *(Verified directly.)*

At 20,000 markers that is 100,000 heap objects, most of them permanently empty.

`Evented` is the single highest-leverage file in the library. Three separate audits landed on it
independently.

### 4.2 Google objects are built before anything needs them

The polyline fix — don't create the `google.maps` object until the thing is actually shown — is
unapplied in at least five places:

- `Marker.init()` (`Marker.ts:478`) calls `#setupGoogleMarker()` eagerly, where
  `Polyline.init()` (`Polyline.ts:1073`) dispatches `ready` and creates nothing. Since both
  `Tooltip.attachTo()` and `Popup.attachTo()` await `init()`, **every marker with a tooltip or
  popup gets its Google object built immediately**. *(Verified: the asymmetry is real.)*
- `Overlay`'s constructor unconditionally runs `document.createElement('div')`
  (`Overlay.ts:182`) — 5,190 detached divs for the 2,595-segment page.
- `Tooltip` and `Popup` parse content into the DOM via `innerHTML` at attach time
  (`Tooltip.ts:183`, `Popup.ts:318`), not at show time.
- `InfoWindow`'s `content` setter builds the `google.maps.InfoWindow` immediately
  (`InfoWindow.ts:206`).
- And the mirror image: `MarkerCollection.hide()`/`hideAll()`/`clear()` **create** Google
  markers in order to remove them (`MarkerCollection.ts:100` → `Marker.ts:462` → `:988`).

### 4.3 Coordinates are wrapped in objects on paths that only need numbers

`Polyline` moved to a `Float64Array`; nothing else did.

- `LatLngBounds.#extend()` pushes a `{lat, lng}` literal per point into `#boundValues`
  (`LatLngBounds.ts:286`) *in addition to* maintaining the NE/SW corners incrementally — so a
  1M-point path retains 1M objects until the first `fitBounds()`.
- `DataLayer.#toPositions` (`DataLayer.ts:1302`) does `.map(latLng).filter().map(toGoogle)` —
  three intermediate arrays plus two objects per point.
- `DataLayer.#bounds()` (`DataLayer.ts:1270`) allocates a `LatLng` per coordinate of every
  feature, discarded immediately after `extend()`.
- `latLng()` always allocates even when handed a `LatLng` (`LatLng.ts:330`), where
  `latLngBounds()` correctly returns its argument unchanged (`LatLngBounds.ts:671`).

### 4.4 Constant data is rebuilt inside hot functions

Array literals, key tables and option objects declared inside per-instance or per-frame
functions. Individually trivial, collectively large, and uniformly free to fix:
`DataLayer.ts:1012/1018/1024` (three arrays per feature per restyle), `Marker.ts:1201/1456`,
`Map.ts:1144/1163/1170/1177`, `Icon.ts:73`, `SvgSymbol.ts:305`, `Popup.ts:791` (a fresh theme
object **every frame** — see 6.4).

---

## 5. Findings by subsystem

Impact ratings are relative to the reference workloads in section 1. Items marked ✅ were
verified directly against the source rather than taken from the audit.

### 5.1 Core — `Evented`, `LatLng`, `Point`, `Size`, `LatLngBounds`, `helpers`

| # | Finding | Location | Impact |
|---|---|---|---|
| C-1 ✅ | Two dead fields, never read or written | `Evented.ts:124, 132` | Free |
| C-2 | Five containers allocated per instance before any listener | `Evented.ts:90, 98, 106, 132, 140` | High |
| C-3 | `isObject()` is `Object.prototype.toString.call` — probably the most-executed function in the library | `helpers.ts:162` | High |
| C-4 | `#boundValues` retains one literal per point | `LatLngBounds.ts:71, 286` | High |
| C-5 | `extend()` allocates ~2 objects per point | `LatLngBounds.ts:250, 286, 309` | High |
| C-6 | `latLng()`/`point()`/`size()` always allocate, even given the right type | `LatLng.ts:330`, `Point.ts:384`, `Size.ts:245` | High |
| C-7 | The common `(number, number)` case is checked *last*, after the most expensive test | `LatLng.ts:198`, `Point.ts:275`, `Size.ts:167` | High |
| C-8 | `dispatch()` writes `#eventsCalled` before the no-listener early-out; 4 redundant lookups | `Evented.ts:186` | Medium |
| C-9 | `hasListener()` builds an array to answer a boolean (`.filter().length > 0`) | `Evented.ts:267` | Medium |
| C-10 | Per-listener `once` check runs 4 tests including an `isObject()` | `Evented.ts:235` | Medium |
| C-11 | `listenersToRemove` array allocated on every dispatch | `Evented.ts:230` | Medium |
| C-12 | `#valuesChanged` exists only to invalidate a cache `= undefined` would handle | `LatLng.ts:70` | Medium |
| C-13 | `equals()` constructs a `LatLng` to compare two numbers | `LatLng.ts:182`, `Point.ts:194` | Medium |
| C-14 | `toGoogle()` re-validates Google Maps on every call | `LatLng.ts:290`, `Point.ts:353` | Medium |
| C-15 | Bounds getters allocate a new `LatLng` per read; `intersects()` calls them 4× | `LatLngBounds.ts:386, 455` | Medium |
| C-16 | `extend()` allocates a throwaway `LatLng` just to sniff array shape, then recurses per element | `LatLngBounds.ts:222` | Medium |
| C-17 | `contains()` allocates 1–2 objects per call — 40k to filter 20k markers | `LatLngBounds.ts:148` | Medium |
| C-18 | `Base` stores an object-type string slot on all 500k instances | `Base.ts:21` | Low |
| C-19 | `isNumber` orders its checks backwards; `-Infinity` passes as valid | `helpers.ts:43` | Low |
| C-20 | `renderTemplate` compiles its regex per call | `helpers.ts:342` | Low |

### 5.2 Markers

| # | Finding | Location | Impact |
|---|---|---|---|
| M-1 ✅ | `init()` builds the Google marker eagerly — so attaching a tooltip/popup forces creation | `Marker.ts:478` | High |
| M-2 | `hide()`/`hideAll()`/`clear()` create Google markers in order to remove them | `MarkerCollection.ts:100`, `Marker.ts:462` | High |
| M-3 | A throwaway `LatLng` allocated per marker at construction | `Marker.ts:171`, `AdvancedMarker.ts:121` | High |
| M-4 | The `position` getter allocates a new `LatLng` **and** calls into Google on every read | `Marker.ts:353` | High |
| M-5 | Every marker registers its own `onReady` on the map — up to two each | `Marker.ts:1499, 1025` | High |
| M-6 | Every setter allocates a Promise chain even on the already-created fast path | `Marker.ts:1367` | High |
| M-7 | `SvgSymbol.toGoogle()` redoes all its work per call, per marker | `SvgSymbol.ts:465` | Medium |
| M-8 | `btoa()` runs per marker on identical SVG strings | `Marker.ts:1134`, `AdvancedMarker.ts:639` | Medium |
| M-9 | `ImageRenderer.render()` builds a full library `Marker` per cluster, per render | `MarkerCluster/ImageRenderer.ts:367` | Medium |
| M-10 | `DefaultRenderer` rebuilds and base64-encodes the cluster SVG every render | `MarkerCluster/DefaultRender.ts:297` | Medium |
| M-11 | `addMarker()` re-renders after **every** add, and stacks one loader listener per marker | `MarkerCluster.ts:356` | Medium |
| M-12 | `console.log` on `AdvancedMarker` hot paths | `AdvancedMarker.ts:628, 668, 738` | Medium |
| M-13 ✅ | **`setOptions` forces eager creation via `title`.** Found by the Phase 0 tests 2026-09-16 | `Marker.ts:1197` | High |

**M-13, in full.** `setOptions()` documents itself as deliberately *not* setting up the Google
marker (`Marker.ts:1091`), and for almost every option that holds: each one writes to `#options`
directly and only pushes to Google inside an `if (this.#marker)` guard. Two break the rule:

- `title` — `Marker.ts:1197` does `this.title = options.title`, which is the **public setter** →
  `setTitle()` → `await this.#setupGoogleMarker()` → builds the `google.maps.Marker`.
- `tooltip` — `Marker.ts:1195` calls `attachTooltip()`, which awaits `init()`. That is M-1.

So `marker({ position, title })` — an ordinary, documented call — builds a Google marker
immediately. Verified: 1,000 markers created that way produce 1,000 `google.maps.Marker`
objects, where the same call without `title` produces none.

There is a second-order bug in it. Because `#setTitle()` runs *after* the `await`, the marker is
constructed **without** the title and then patched with `setTitle()` immediately after — an extra
Google call per marker, and the constructor options are missing a value that was known up front.

**Fix:** route `title` through the private `#setTitle()` and sync to Google only when `#marker`
already exists, exactly like every neighbouring option. Small, self-contained, and it should land
with M-1 in Phase 3 since they are the same mistake.

### 5.3 Map

| # | Finding | Location | Impact |
|---|---|---|---|
| P-1 | Every `onReady()` re-runs the Google-listener probe — and registers a permanently dead native `'ready'` listener | `Map.ts:1734`, `Evented.ts:471` | High |
| P-2 | `init()` has no resolved-promise fast path — a Promise + closure per waiter, ×10k | `Map.ts:1109` | High |
| P-3 | `fitBounds()` is 4 promises deep | `Map.ts:1009` | High |
| P-4 | `setOptions()` awaits 6 control conversions **sequentially**, each with a loader dispatch | `Map.ts:1140` | High |
| P-5 | Every individual setter pushes its own `setOptions()` to Google — no batching | `Map.ts:419, 442, 587, …` | High |
| P-6 | `Loader.on()` re-dispatches LOAD to *all* listeners on every registration | `Loader.ts:285` | Medium |
| P-7 | `Loader.load()` has no shared singleton promise | `Loader.ts:217` | Medium |
| P-8 | `convertControlPosition()` does a full `Object.entries()` scan, no early exit, ×6 per build | `constants.ts:156, 372` | Medium |
| P-9 | `center` getter allocates two `LatLng` per read; `zoom` calls into Google per read | `Map.ts:354, 845` | Medium |
| P-10 | Styles array fully rebuilt on every change; `#setHideFeature` has no change check | `Map.ts:1252, 1273` | Medium |
| P-11 | `resize()` forces two sync reflows and uses a magic 100ms timeout | `Map.ts:1819` | Low |
| P-12 | Fixed 100ms delay before `ready` on the hidden-map path only — delays all 10k waiters | `Map.ts:2209` | Low |

### 5.4 Polylines — what the last pass left

| # | Finding | Location | Impact |
|---|---|---|---|
| L-1 | ~~No viewport culling~~ — **dropped, see 5.4.1.** Tried and abandoned 2026-09-16 | `Polyline.ts` | Dropped |
| L-2 | A zoom-bucket change rebuilds every drawn path synchronously in one `idle` handler — no batching, no frame budget | `Polyline.ts:1701, 1648` | High |
| L-3 | RDP is recomputed per tolerance; a per-point significance array would make any tolerance an O(n) filter | `simplifyPath.ts:114` | High |
| L-4 | `setPath` is called even when the resulting path is identical — `setPath` is the expensive half | `Polyline.ts:1661` | High |
| L-5 | 1,400 `idle` listeners each calling `getZoom()` across the Google boundary, on every **pan** | `Polyline.ts:1618, 1679` | Medium |
| L-6 | `Evented.off()` is O(n) per removal, so tearing down a collection is O(n²) | `Evented.ts:295`, `Polyline.ts:1685` | Medium |
| L-7 | Every polyline pays for a dashed/icon setup pass it almost never needs — a promise, a microtask, and a no-op Google `setOptions` | `Polyline.ts:1944, 1767` | Medium |
| L-8 | Highlight `Polyline` **objects** are constructed eagerly — 2,800 objects for 1,400 lines | `Polyline.ts:531` | Medium |
| L-9 | `mousemove` on highlights allocates a `LatLng` per mouse move | `Polyline.ts:566` | Medium |
| L-10 | The `path` getter caches `LatLng` objects forever — one read brings the 220MB straight back | `Polyline.ts:665` | Medium |
| L-11 | `coordsFromPath` runs `isObject()` per point across 2.4M points | `simplifyPath.ts:70` | Medium |
| L-12 | Per-tolerance `google.maps.LatLng[]` caches retained indefinitely, plus a defensive `.slice()` | `Polyline.ts:353, 1530` | Medium |

#### 5.4.1 Why viewport culling was dropped

The audit flagged the absence of viewport culling as high impact. **It is out of this plan** —
but for a more precise reason than "it didn't work", and the distinction matters if anyone
revisits it.

**It was built, on 2026-09-16, and it worked.** Two pieces: an opt-in `onlyInView` that detached
offscreen lines with `setMap(null)` and reattached on re-entry, and a per-map `PolylineManager`
that computed bounds once per idle, ordered in-view work first, and time-sliced it across frames
on an 8ms budget. 12/12 checks passed, including three pan-away/pan-back cycles. The things that
were expected to break did not: bbox math, restore-on-re-entry, and boundary thrash were all
fine, and offscreen hit-testing did **not** go dead, because tooltip and popup listeners live on
the library object and `Evented` queues them until the Google object exists. It was reverted.

**It was dropped because its benefit was never demonstrated, and it cost a semantic change.**
Three findings, in order of weight:

1. **It forced a non-opt-in behavior change.** Zoom-tolerance updates became *asynchronous* — a
   beat after `idle` rather than synchronous — because the manager awaits `getBounds()` and then
   slices. That broke existing test expectations and changes behavior for anyone reading
   `polyline.simplify` after a zoom. An opt-in feature that silently changes timing for people
   who did not opt in is the wrong trade.
2. **The ceiling is small, for two independent reasons.** `simplify: 'zoom'` already cuts what
   Google holds by **97%** — 70,278 points against 2,297,462 across 1,400 lines — so the
   renderer is no longer the bottleneck culling would relieve. And detaching frees no memory: a
   detached line keeps both its path and its `google.maps.Polyline`. Culling also does nothing
   for initial load, because lines are added before the view is known, so everything is drawn
   once and trimmed on the first idle.
3. **L-3 and L-4 are better targets for the same problem.** Precomputing a per-point significance
   array makes any tolerance an O(n) filter with no re-simplification and no scratch allocation;
   skipping `setPath` when the drawn path is unchanged removes the expensive half. Both attack
   the measured cost — first-time zoom-bucket crossings ran ~200-230ms for 1,400 visible lines —
   without touching timing semantics.

**Stated honestly: the upside is unmeasured, not disproven.** The test harness stubs
`google.maps.Polyline` as a trivial class, so `setMap(null)` costs nothing there and the harness
*structurally cannot* measure what culling is for. The numbers that exist are counts (70 attached
/ 1,330 detached), not savings. FPS and heap were never measured in a real browser with it on
versus off. If someone wants to revisit this, that is the experiment to run first — and it should
be run **before** writing any code, not after.

**What survives:** nothing as a culling feature. A cached per-polyline bbox may still earn its
place on its own merits — `PolylineCollection.fitBounds()` currently walks every point of every
polyline, and a cached bbox makes that O(polylines) instead of O(points). That is a bounds
optimization, and it belongs in Phase 4.

If it is ever revisited it must be **opt-in**, per Eric's instruction — including its timing
behavior, which the first attempt was not.

### 5.5 Overlays, tooltips, popups

At 2,595 layers × (1 tooltip + 1 popup), attaching currently costs roughly **5,190 detached
divs, up to 5,190 `innerHTML` parses, ~13,000 coordinate objects, ~15–20k promises, and
~10,000 listener closures** — none of it needed until something is shown.

| # | Finding | Location | Impact |
|---|---|---|---|
| O-1 | Every `Overlay` builds its DOM element in the constructor | `Overlay.ts:182` | High |
| O-2 | Content is parsed via `innerHTML` at attach time, not show time | `Tooltip.ts:183`, `Popup.ts:318` | High |
| O-3 | One `Tooltip` **and one div** per layer, where only one is ever visible at a time | `Tooltip.ts:538` | High |
| O-4 ✅ | A brand-new `OverlayView` **class** is declared per overlay — own prototype, and it makes `draw()` megamorphic | `Overlay.ts:1301` | High |
| O-5 ✅ | `Popup.draw()` rebuilds its theme object and re-applies styles **every frame**. `Tooltip` already has the `#isThemeApplied` guard; `Popup` never got it | `Popup.ts:781` | High |
| O-6 | `Popup.draw()` re-runs `querySelectorAll` and rebinds close listeners every frame | `Popup.ts:805` | High |
| O-7 | `attachTo()` builds a promise chain per attachment | `Tooltip.ts:248`, `Popup.ts:406` | Medium |
| O-8 | `style()` has no dirty check, so every call writes to the DOM | `Overlay.ts:769` | Medium |
| O-9 | Hide/show does a full Google overlay add/remove plus DOM detach/attach per hover | `Overlay.ts:508` | Medium |
| O-10 | `InfoWindow` builds its Google object as soon as content is set | `InfoWindow.ts:206` | Medium |
| O-11 | Redundant coordinate objects per overlay (base sets `[0,0]`, subclass immediately overwrites) | `Overlay.ts:188`, `Tooltip.ts:130` | Medium |

### 5.6 Data layer and services

| # | Finding | Location | Impact |
|---|---|---|---|
| D-1 | `#convertStyle` allocates three array literals **per feature, per restyle** | `DataLayer.ts:1012, 1018, 1024` | High |
| D-2 | `addPolygon`/`addPolyline`/`addPoint` allocate 2 objects + 3 array slots per point | `DataLayer.ts:1302, 1322, 1346` | High |
| D-3 | `#bounds()` allocates a `LatLng` per coordinate of every feature | `DataLayer.ts:1262`, `DataFeature.ts:121` | High |
| D-4 | Eager `DataFeature` construction for every feature on load, even when the result is discarded | `DataLayer.ts:935` | High |
| D-5 | GeoJSON post-load work is synchronous and unchunked | `DataLayer.ts:322` | High |
| D-6 | `getFeatures()`/`forEach()` rebuild the full array every call — and the docs recommend that as the filter idiom | `DataLayer.ts:497, 454` | Medium |
| D-7 | `#enqueue` forces a microtask + 2–3 promises on every public call, and **serializes** them | `DataLayer.ts:1048` | Medium |
| D-8 | Geocode: no cache, no in-flight dedupe, a new `Geocoder` per request — this is **billed** | `Geocode.ts:352` | Medium |
| D-9 | Double event-object allocation on every data-layer mouse event | `DataLayer.ts:419` | Medium |

### 5.7 Build and bundle

| # | Finding | Evidence | Impact |
|---|---|---|---|
| B-1 | **Tree-shaking is effectively broken.** Importing only `latLng` pulls 100.6 KB (75% of the library), including `MarkerClusterer`, `DataLayer`, `Tooltip`, `Popup` | measured with esbuild | High |
| B-2 | `@googlemaps/markerclusterer` is unconditionally in the browser bundle — 29,835 B (18%) for consumers who never cluster | measured; string-literal proof | High |
| B-3 | The eslint plugin runs on **both** entries, linting every file twice — ~9.6s of lint against ~2.7s of build, roughly 4× the build time. It also has `fix: true`, so the build mutates source on disk | measured | Medium |
| B-4 | `lib: ["es2017"]` while `target: es2022` — blocks `Object.hasOwn`, `.at()`, `.flat()`. Nothing uses them today, but it is why `DataFeature.ts:375` cannot drop its O(n²) `reduce(concat)` | grepped: 0 usages | Medium |
| B-5 | `minify: false` on ESM/CJS is **correct for a library** — keep it. gzip already takes 529 KB → 91 KB | — | Keep |

**Current sizes:** `browser.js` 163 KB (47 KB gzip), `index.esm.js` 529 KB (91 KB gzip),
`index.cjs` 534 KB, declarations 569 KB across two identical-size files, `dist/` total 1.8 MB.

---

## 6. Correctness bugs found on the way

These are not performance issues, but they live on the paths this plan touches and several
should be fixed regardless. The first four were verified directly.

### 6.1 ✅ `clearListeners` wipes third-party listeners — the worst of these

`Evented.#afterListenersRemoved()` (`Evented.ts:328`) calls
`google.maps.event.clearListeners(this.#googleObject, type)` whenever the internal list for a
type empties. That removes **every** native listener of that type on the Google map, including
ones this library did not add.

Two live paths reach it: `Map.ts:1085` registers `this.once(BOUNDS_CHANGED, …)` inside
`fitBounds`, and `Polyline.ts:1685` calls `map.off('idle', …)`. Since
`@googlemaps/markerclusterer` drives re-clustering off `idle`, **a polyline detaching from the
map can silently stop clustering from working.** The comment at `Evented.ts:487` shows the
authors were already aware third-party libraries share these events.

Fix: track the native listeners this library itself added and remove only those.

### 6.2 ✅ `ready` is dispatched before `#isReady` is set

`Map.#setMapAsReady()` (`Map.ts:2269`) dispatches `READY` on its first line but sets
`#isInitialized` and `#isReady` on its last two. Anything calling `map.getIsReady()` inside a
`ready` handler gets `false`. `Marker.#setMap()` branches on exactly that (`Marker.ts:1020`), so
markers created during ready dispatch take the slow path for no reason.

Fix: move both assignments above the dispatch. One-line reorder, and it is a precondition for
the P-1/P-2 fast paths actually being reachable.

### 6.3 ✅ `Marker.setOptions({ map })` never creates the marker — confirmed bug, fix it

`Marker.ts:1209-1216` guards the real work with `if (this.#marker)`, which is never true for a
freshly constructed marker. The library's own demo appears to work only because a later
`marker.label = …` assignment routes through `setLabel()` → `#setupGoogleMarker()` and creates
it as a side effect.

**Decided (2026-09-16):** passing `map` in the options **displays** the thing — marker, polyline,
or anything else — *unless* another option that hides it is passed in the same call. So this is a
straightforward bug, not accidental-but-desirable laziness, and it is fixed rather than embraced.

This constrains M-1 rather than blocking it. The rule is:

- Attaching a tooltip or popup must **not** create the Google object. (This is the M-1 win, and
  it is the case that actually matters at scale.)
- Setting `map` **must** create and display it, immediately.
- Setting `map` together with `visible: false` (or any equivalent hide option) must **not**
  create it — this is the existing "don't draw hidden polylines" behavior, generalized.

So the laziness is driven by *visibility*, not by *whether a map is set*. Every class this is
applied to must follow the same rule so the behavior is consistent across the library.

**Blocker found while building the stress page: `Marker` has no `visible` option.** `Polyline` has
one (`Polyline.ts:107-108`, getter/setter at `:864-879`), and it is what drives the deferred
drawing — `Polyline.ts:1252` states outright that "a hidden polyline isn't drawn, so nothing is
created for it yet". On `Marker`, the only matches for `visible` are the `visible_changed` event
name and its listener helper; there is no option, no getter and no setter. `Layer` has
`isVisible`, but it is not settable through marker options.

This means the rule decided above **cannot currently be expressed for markers** — there is no hide
option to pass alongside `map`. Implementing 6.3 uniformly therefore requires **adding a `visible`
option to `Marker`** (and to any other class this is applied to), mirroring `Polyline`'s. That is
an additive, non-breaking API change, but it is real scope and it belongs in Phase 3 alongside the
marker laziness work rather than being discovered mid-implementation.

**Documentation is part of this change**, not a follow-up: the map option's behavior must be
stated explicitly in the API reference for each class, along with the performance note that
passing `map` on something intended to start hidden forces work that setting `visible: false`
(or deferring `setMap()`) avoids.

### 6.4 ✅ `Popup` never received the `Tooltip` theme fix

`Tooltip` has `#isThemeApplied` (`Tooltip.ts:112, 230, 361, 461`); `Popup` has no equivalent and
rebuilds `themeStyles` plus a spread object every frame (`Popup.ts:791`). The CHANGELOG records
the tooltip half of this work as done; the popup half was missed.

### 6.5 ✅ Removing the last listener throws before Google Maps loads

**Found by the Phase 0 tests on 2026-09-16, confirmed by running them.** Not in any of the six
audits.

`#afterListenersRemoved()` (`Evented.ts:311`) and `offAll()` (`Evented.ts:346`) both call
`#isGoogleObjectSet()`, which does:

```js
this.#googleObject instanceof google.maps.MVCObject
```

against the **bare `google` global**. When the Google Maps library has not loaded, that is a
`ReferenceError`, not a `false`.

This matters because the library deliberately supports creating objects and attaching listeners
*before* Google Maps loads — that is the entire purpose of the pending-listener mechanism at
`Evented.ts:489-494`. Anything that empties a listener list before the library loads throws:

- **dispatching a `once` listener** — it is removed immediately after being called, which empties
  the list and triggers the check
- **`off()`** and **`offAll()`**

Note the short-circuit detail: `#afterListenersRemoved` only reaches `#isGoogleObjectSet()` when
`this.#eventListeners[type].length === 0`, so removing one of several listeners is safe and only
removing the *last* one throws. That makes it intermittent and easy to miss.

**Fix:** guard with `typeof google !== 'undefined'` (as `checkForGoogleMaps` already does at
`helpers.ts:221`) before touching `google.maps`. Cheap, and it should land in Phase 2 with the
other correctness work.

Covered by `test/Evented.test.ts` with `it.fails()`, so the tests pass while the bug exists and
go red the moment it is fixed — which is the signal to convert them to ordinary expectations.

### 6.6 Others, from the audits

- `loader().onMapLoad()` registered after the map has loaded **never fires** and its promise
  never settles — `Loader.on()` always re-dispatches `LOAD`, never the requested type
  (`Loader.ts:285`). Reachable from `Marker.ts:1384`, `Polyline.ts:1846`, `MarkerCluster.ts:187`.
- `Evented.setEventGoogleObject()` adds one Google listener **per pending entry** rather than one
  per type (`Evented.ts:594`), so duplicates cause a full extra dispatch to every callback.
  `offAll()` also never clears `#pendingMapObjectEventListeners`.
- `AutocompleteSearchBox.init()` and `PlacesSearchBox.init()` await before assigning
  `#searchBox`, so two concurrent calls both pass the `if (!this.#searchBox)` guard and build two
  widgets on one input — duplicate listeners and **duplicate billed Places requests**
  (`AutocompleteSearchBox.ts:429`, `PlacesSearchBox.ts:243`).
- `MarkerCluster.removeMarker()` calls `toGoogleSync()`, which can return `undefined` because
  `#createMarkerObject()` resolves asynchronously when a map is set (`MarkerCluster.ts:438`).
- `helpers.ts:278` passes the **string** `"%|px/g"` to `replace()` instead of a RegExp, so it
  does nothing; `parseFloat` happens to mask it.
- `LatLngBounds.ts:598` — `precision || 3` turns a legitimate precision of `0` into `3`.
- Dead branch in `Tooltip.ts:131` / `Popup.ts:208`: `isObject()` is false for `HTMLElement` and
  `Text`, so the inner branch can never run. This is why `setOptions()` has to call
  `removeClassName('tooltip')` at `Tooltip.ts:400`.
- `Map.ts:2198` — `element.offsetHeight === 1` reads like a typo for `=== 0`.
- `Map.ts:2180` — `#isGettingMapOptions` is set but never reset.
- `Marker.ts:145` — `#isSettingUp` is set true and never reset to false.

---

## 7. Decisions

| Decision | Choice | Reason |
|---|---|---|
| Order of work | Non-breaking allocation wins first, architecture last | Phases 1–3 can ship as a patch release with no API discussion |
| `Evented` containers | Lazy via `??=`, fields `\| undefined` | All `#private`; nothing outside can observe it. Biggest win per unit of effort |
| `isObject()` fast path | New name for the strict version; audit the ~40 call sites | `typeof` returns `true` for `Date`/`Map`/`Set` where `toString` returns `false` — a real semantic change |
| `latLng()` returning its argument | **No** — add a private internal helper instead | The exported factory must keep copying; `LatLngBounds.#extend` already hit this aliasing bug once |
| Primitive immutability / interning | **Not now** — major version | `LatLng`, `Point`, `Size` are all mutable today; making them immutable unlocks interning but breaks `setLat()`/`ceil()`/`subtract()` callers |
| Shared tooltip instance (O-3) | **Opt-in flag** — confirmed 2026-09-16 | `attachTooltip()` returns a `Tooltip`; sharing it by default would let one layer's `setContent` change every layer's |
| Shared **popup** instance | **No** | `Layer.setPopup`/`getPopup`/`openPopup`/`togglePopup` all assume a per-layer instance |
| `package.json` `"sideEffects"` | Explicit **array**, never `false` | See 8.1 — `false` would be silently breaking |
| `getBounds()` | Add `getBoundsSync()`, do not change the existing signature | Changing async → sync is a public break |
| Map setter batching (P-5) | **Approved** — batch into one microtask | Confirmed acceptable 2026-09-16. Changes *when* values reach Google, from synchronous to end-of-microtask |
| `map` in options | **Displays** the object unless a hide option is also passed | Confirmed 2026-09-16. Laziness keys off visibility, not off whether a map is set. See 6.3 |
| `minify: false` for ESM/CJS | Keep | Correct for a distributed library; consumers minify |
| `Float32Array` for paths | **No** | ~7 significant digits puts longitude precision at ~1m, the same order as the 1–2m tolerances. It would corrupt simplification |
| Test framework | **vitest**, in `test/` at the repo root | Eric's preference. `test/` is already in `eslint.config.js`'s `globalIgnores`, so the convention was anticipated. There is no existing suite to migrate |
| Where tests sit in the order | **Phase 0 — before any refactoring** | The plan rewrites `Evented`, which every class extends. A safety net after the fact is not a safety net |
| What the stub can prove | Correctness and *absence of work* — never speed | A stubbed `google.maps` cannot measure Google's renderer. Speed claims come from 10.3/10.4 only |

---

## 8. Breaking-change register

Nothing in phases 1–5 breaks the public API. These are the items that need a decision.

### 8.1 `"sideEffects": false` would be a silent breakage — do not do it

This is the most dangerous single line anyone could add to this repo while "fixing
tree-shaking".

`Popup.ts:1029`, `Popup.ts:1103`, `Tooltip.ts:580`, `Tooltip.ts:654` and `InfoWindow.ts:874`
call `Layer.include(...)` / `Map.include(...)` / `DataLayer.include(...)` at **module scope**.
These are load-bearing prototype mutations. With `"sideEffects": false`, a bundler that sees
`Popup` as unused will drop the module, and `attachPopup()` / `attachTooltip()` /
`attachInfoWindow()` will silently vanish from `Layer`, `Map`, `DataLayer` and `DataFeature` at
runtime — **with no build error**.

Use the explicit array form: `"sideEffects": ["**/Popup.*", "**/Tooltip.*", "**/InfoWindow.*"]`.
That still lets bundlers drop `Geocode`, `AutocompleteSearchBox`, `ImageOverlay` and
`MarkerCluster`, which were confirmed droppable.

### 8.2 Behavior changes to raise with the user

| Item | Change | Notes |
|---|---|---|
| M-1 | `ready` may fire before the Google marker exists | Precedent already set and documented for `Polyline`. `toGoogleSync()` in a `ready` handler must become `toGoogle()` |
| 6.3 | `setOptions({ map })` semantics | **Settled:** the map option displays the object unless a hide option is also passed. Fixing this is a bug fix, and it is user-visible for anyone relying on the current broken behavior |
| M-4 | `position` returns a cached `LatLng` | Object identity becomes stable; a caller mutating the result would now affect cached state |
| P-5 | Map setters batch into one microtask | Set-then-immediately-read-back through `map.toGoogle().get(...)` would see the old value |
| L-3 | `simplifyPath()` output may differ by a point or two at coarse tolerances | Public exported helper; same signature, same tolerance guarantee |
| L-8 | `polyline.highlightPolyline` would return `undefined` before first hover | Mitigate by keeping the getter eager-constructing while the internal path stays lazy |
| O-3 | Shared tooltip changes `attachTooltip()`'s return value | Opt-in only; default change is a major version |
| C-6 | `latLng()` returning its argument | Rejected above — internal helper instead |
| B-2 | Making `markerCluster()` lazy-load would change its signature | A separate `browser-cluster.js` bundle avoids this |

---

## 9. Implementation phases

Each phase is independently shippable and independently measurable.

**Every phase includes its documentation and CHANGELOG updates as part of the phase, not as a
cleanup pass afterwards.** Specifically, each phase must land with:

- **CHANGELOG entries** under Unreleased, written in the style already established by the
  polyline work — state the measured before/after numbers, not just what changed. The existing
  entries ("went from about 1,250ms to about 55ms", "260MB to about 40MB") are the model.
- **API reference updates** in `docs/docs-src/api-reference/` for any option, method, property,
  or behavior that changed, including new opt-in options.
- **Performance notes in the docs** wherever a choice the caller makes has a cost — the `map`
  option on something intended to start hidden (6.3), reading `polyline.path` materializing
  `LatLng` objects (L-10), per-layer vs shared tooltips (O-3). These are the traps that are
  invisible from the API surface, and documenting them is part of the fix.
- **Behavior changes called out explicitly**, even the non-breaking ones, so upgraders can find
  them. Section 8.2 is the list.
- **Tests.** Every phase lands with the tests that lock in what it changed — both the behavior
  and, where it is the point of the change, the *absence* of work. See Phase 0.

### Phase 0 — Test suite (vitest), and a real-device baseline

**Status: 2026-09-16. 148 passing, 2 expected-fail, across 6 files.**

| Item | State |
|---|---|
| 0.1 Setup — vitest 5.0.1 + jsdom, `vitest.config.ts`, `test/`, npm scripts, `coverage` ignored | **Done** |
| 0.2 Instrumented `google.maps` stub — `test/support/googleMaps.ts` | **Done** |
| 0.3 Priority 1, core primitives — `helpers`, `LatLng`, `Point`, `Size`, `Evented` | **Done** |
| 0.3 Priority 1, `Marker` | **Done**, including the map paths |
| 0.3 Priority 1, `Polyline` | **Done** |
| 0.3 Priority 1, `Map`, `Tooltip`, `Popup`, collections | Not started |
| 0.3 Priority 2, §6 regressions | 6.3 and 6.5 covered; 6.1, 6.2, 6.4 and 6.6 not started |
| 0.3 Priority 3, absence assertions — markers | **Done** (M-1, M-2, M-4, M-13) |
| 0.3 Priority 3, absence assertions — polylines | **Done** (L-4, L-5, L-7, deferred drawing) |
| 0.3 Priority 3, absence assertions — overlays | Not started, needs jsdom |
| 0.3 Priorities 4-6 — §8.2 rows, allocation shape, simplify correctness | Not started |
| 0.4 Stress page for the absence assertions | **Done** — `site-src/stress.njk` |
| 0.5 Real-device baseline | **In progress — Eric, testing on iOS** |
| CI wiring of `npm test` | **Done** — `.github/workflows/test.yml` |

**The `Map` blocker is solved** — `test/support/fakeMap.ts`. It does **not** extend `Map`, which
would run the real constructor; instead its prototype is pointed at `Map.prototype` with
`Object.setPrototypeOf` after the class is defined. That makes `instanceof Map` true while every
method defined on the double shadows the real one, so no `#private` field is ever touched. It
covers `getIsReady`, `toGoogle`, `onReady`, `init`, `on`/`off`, `zoom`, plus `makeReady()`,
`zoomTo()`, `listenerCount()` and `readyCallbackCount()` for driving and inspecting tests.

The failure mode is deliberately loud: a method that isn't defined on the double falls through to
the real `Map` and throws on a private field, which names exactly what needs adding rather than
silently doing the wrong thing.

**Two bugs found by writing the tests**, neither of which came out of the six audits: §6.5 (the
`ReferenceError` before Google Maps loads) and M-13 (`title` forcing eager marker creation).
That is the case for Phase 0 going first, made concretely.

Nothing user-facing changed, so there is no CHANGELOG entry for this phase. Phase 1 onward does
change behavior and gets entries per the rule above.

**This comes first and is not optional.** The rest of this plan rewrites `Evented`, which every
other class extends, and changes when Google objects get created across five subsystems. There is
currently **no test suite at all** — `package.json`'s `test` script is
`echo "Error: no test specified" && exit 1`. Doing phases 1-7 without tests is how a performance
push becomes a regression hunt.

There is also a second reason, specific to this plan: **most of these wins are the absence of
something.** "The Google marker was not constructed", "`setPath` was not called", "no DOM element
was created". Those are not observable by eye, they are trivially re-broken by a later change, and
they are *exactly* what a counting stub can assert. The test suite is how the performance work
stays done.

#### 0.1 Setup

- **vitest** (not installed yet; nothing else is either). Node 20+ is already required, so any
  current version is fine.
- `test/` at the repo root, mirroring `src/lib/`. This directory is **already in
  `eslint.config.js`'s `globalIgnores`**, so the convention was anticipated — follow it.
- Two environments: `node` for the vast majority, and `jsdom` (or `happy-dom`) only for the
  overlay/tooltip/popup DOM tests in Phase 3.
- Scripts: `test`, `test:watch`, `test:coverage`. Replace the current failing `test` script.
- Add `coverage/` to `.gitignore`.
- `.github/` already exists — wire `npm test` into CI. This also pairs with the Phase 1 change of
  removing the eslint plugin from the build: lint and test both move to CI, where they belong.

#### 0.2 The `google.maps` stub is the core of this

The previous session's harness stubbed `google.maps.Polyline` as a trivial class. That is the
right approach, but it needs to be **shared, faithful in shape, and instrumented**:

- One stub module covering `Map`, `Marker`, `Polyline`, `OverlayView`, `InfoWindow`, `LatLng`,
  `LatLngBounds`, `Point`, `Size`, `Data`, `event`, and the `SymbolPath`/enum objects.
- Every constructor and every mutating method **records its calls** — construction counts,
  `setMap` / `setPath` / `setOptions` arguments, listener add/remove. Assertions are then things
  like `expect(stub.Polyline.constructed).toBe(0)`.
- `google.maps.event.clearListeners` must be recorded too, because 6.1 is specifically about it
  removing more than it should.
- Be explicit in the stub's own comments that it **cannot** measure renderer cost — see 10.1 —
  so nobody later mistakes a green test for a performance measurement.

#### 0.3 What to test, in priority order

1. **Lock current behavior before changing it.** The public surface of `Marker`, `Polyline`,
   `Map`, `LatLng`, `LatLngBounds`, `Evented`, `Tooltip`, `Popup`: constructors, option handling,
   getters/setters, factory functions, chainable returns. This is the safety net for everything
   after, and most of it can be written without deciding anything.
2. **Regression tests for the §6 bugs — written first, failing.** Each one is a precise, cheap
   test: `getIsReady()` inside a `ready` handler (6.2); a marker created with `map` in the options
   appears (6.3); `clearListeners` not wiping a listener the library did not add (6.1); popup
   theme applied once across repeated `draw()` calls (6.4); `onMapLoad` after load still firing;
   two concurrent `init()` calls producing one searchbox.
3. **The absence assertions** — the heart of it. Attaching a tooltip or popup constructs **zero**
   Google objects. `hideAll()` on never-shown markers constructs zero. A hidden polyline draws
   nothing. `setPath` is not called when the simplified path is unchanged. No DOM element is
   created until first show.
4. **Every row of §8.2 gets a test**, so the intended behavior changes are deliberate and
   documented in code, not discovered later.
5. **Allocation-shape assertions where they are cheap and stable**: `LatLng` count after building
   a path, `path` returning `LatLng` objects while `getPathCoords()` allocates none, bounds built
   from corners matching bounds built by replay (the meridian case that gates Phase 4).
6. **Simplify correctness** — the significance-array rewrite (L-3) must produce paths within
   tolerance of the current implementation. Property-style tests over generated tracks are worth
   it here, since L-3 is the one algorithmic change in the plan.

#### 0.4 What this suite will not do

It will not tell you anything about frame rate, real memory, or how long Google takes to draw.
That is what 10.3 and 10.4 are for. Keep the two honest and separate: **vitest proves correctness
and proves work was avoided; only a real browser proves it got faster.**

#### 0.5 Baseline

Before Phase 1 changes anything, record a real-device baseline per 10.3/10.4 and write the
numbers into this plan. Every later "X% faster" claim is measured against it.

### Phase 1 — Free wins, zero API risk

Mechanical, no behavior change, no discussion needed.

1. Delete the two dead `Evented` fields (C-1).
2. Hoist every constant array/table out of its hot function (C-4.4 group: D-1, `Marker.ts:1201/1456`, `Map.ts:1144…`, `Icon.ts:73`, `SvgSymbol.ts:305`).
3. `hasListener()` → `.some()` (C-9); lazy `listenersToRemove` (C-11); simplify the `once` check (C-10).
4. Give `Popup` the `Tooltip` theme guard and bind close handlers once (O-5, O-6).
5. Hoist the `OverlayView` class to module scope, still lazily created after Google loads (O-4).
6. Dirty check in `Overlay.style()` (O-8) — this subsumes several existing call-site guards.
7. `performance.now()` behind the debug guard; hoist `EMPTY_COORDS` (Polyline low items).
8. Remove `console.log` from `AdvancedMarker` hot paths (M-12).
9. Build: drop the eslint plugin from the second entry, add explicit `target: 'es2022'` to both, raise `lib` to `es2022` (B-3, B-4, section 3).

**Expected:** ~4× faster builds, no more per-frame work in open popups, and a large cut in
steady-state allocation. **Risk: none.**

### Phase 2 — Correctness

Do these before the laziness work, because Phase 3's fast paths depend on 6.2 being right.

1. Reorder `#setMapAsReady()` (6.2).
2. Scope `clearListeners` to this library's own listeners (6.1).
3. Guard `#isGoogleObjectSet()` against a missing `google` global (6.5). **Already covered by
   tests** — `test/Evented.test.ts` has two `it.fails()` cases that go red the moment this is
   fixed, which is the signal to convert them to ordinary expectations.
4. Fix `Loader.on()` so `onMapLoad` after load fires (6.6).
5. One Google listener per type in `setEventGoogleObject()`; clear pending in `offAll()` (6.6).
6. Memoize the searchbox init promise (6.6).
7. Guard `MarkerCluster.removeMarker()` (6.6).
8. The small ones: `helpers.ts:278`, `LatLngBounds.ts:598`, the dead `isObject` branches, the stuck flags.

**Decide 6.3 (`setOptions({map})`) here** — it gates Phase 3.

### Phase 3 — Lazy allocation and lazy creation

The core of the plan.

1. Lazy `Evented` containers (C-2).
2. `isObject()` fast path, with the call-site audit (C-3).
3. `LatLng`/`Point`/`Size`: `(number, number)` fast path, drop `#valuesChanged`, `!== undefined` cache checks, cheap `equals` (C-7, C-12, C-13, C-14).
4. Marker parity with Polyline: lazy `init()`, short-circuit `setMap(null)`, drop the throwaway
   position `LatLng`, cache the `position` getter, resolved-promise fast path (M-1…M-6).
   **Include M-13 here** — routing `title` through the private `#setTitle()` is the same mistake
   as M-1 in a different place, and `test/Marker.test.ts` already has the expectations that flip
   when it is fixed.
5. **`DataFeature` parity too.** `Marker`, `DataFeature` and `Polyline` all share the same
   `Layer.init()` contract, and only `Polyline` was changed in the previous pass. Whatever shape
   the marker fix takes, apply it to `DataFeature` in the same phase so the three stay
   consistent — this also addresses the eager-construction half of D-4.
6. Overlay/Tooltip/Popup: lazy DOM, lazy content, defer `InfoWindow` setup, shared zero-offset
   (O-1, O-2, O-10, O-11).

The `Polyline` half of this is **already shipped and confirmed working in the browser** — Eric's
2,595-segment page went from creating 2,595 Google polylines at load to zero. That is the
existence proof for M-1: the same contract, applied to markers and data features, on a page that
creates far more of them.

**Expected:** the headline win. Attach cost for thousands of tooltips/popups drops to near zero,
and per-object allocation falls across the whole library.

### Phase 4 — Bounds and numeric paths

1. Internal `extendNumeric(lat, lng)` on `LatLngBounds`; funnel the public `extend()` into it (C-5).
2. Drop `#boundValues`, building the Google bounds from the maintained corners (C-4).
   **Needs a meridian-crossing test first** — the comment at `LatLngBounds.ts:94` explains why
   the point list exists.
3. `containsCoords(lat, lng)` fast path; memoize the corner getters (C-15, C-17).
4. Data layer: single-pass coordinate conversion emitting `LatLngLiteral`, and numeric `#bounds()` (D-2, D-3).

### Phase 5 — Map ready/init machinery

1. Early-out in `Evented.#on()` for already-dispatched fire-once-immediate listeners, and skip
   the Google-wiring block for internal event types (P-1).
2. Shared `#readyPromise` on the map (P-2).
3. Loader singleton promise (P-6, P-7).
4. `Promise.all` the control conversions; cache converted control options; lookup tables for
   `convertControlPosition` (P-4, P-8).
5. Cache `center`/`zoom`/`mapTypeId`, invalidated from Google's change events (P-9).
6. Styles caching and a change check in `#setHideFeature` (P-10).
7. P-5 setter batching — accumulate into `#pendingOptions` and flush once via `queueMicrotask()`.
   Approved; this also fixes the current inconsistency where async control setters land out of
   order relative to synchronous ones.

### Phase 6 — Polyline leftovers

1. Skip `setPath` when the resulting path is unchanged (L-4) and skip the dashed/icon pass for
   plain polylines (L-7). Both are small, self-contained, and immediate. For L-4, compare the
   **point count first** — that alone catches most short segments across adjacent buckets for
   almost nothing, before any element-wise comparison. Today the only skip is when the tolerance
   itself is unchanged.
2. Precomputed per-point significance array, making any tolerance an O(n) filter (L-3). This is
   the change that carries the weight previously assigned to L-1 — see 5.4.1. The current layout
   suits it directly: paths are already a `Float64Array` of `[lat, lng, …]` pairs and RDP already
   runs on that, projected to local metres around the path's mean latitude, so a parallel
   `Float64Array` of drop-distances drops straight in alongside it. It also removes the current
   per-tolerance `google.maps.LatLng[]` cache (L-12), which costs memory *and* still re-simplifies
   on first visit to each bucket. Note the `simplifyPath()` output caveat in 8.2.
4. One shared zoom broadcaster per map instead of 1,400 `idle` listeners — this also removes
   L-6's O(n²) teardown (L-5, L-6).
5. Chunked scheduler with a frame budget for the initial build (L-2).
6. Additive `getPathCoords()`/`pathLength` so counting points doesn't materialize 2.5M objects
   (L-10); faster `coordsFromPath` (L-11); cap the tolerance cache (L-12).

### Phase 7 — Structural, plan deliberately

1. Opt-in shared tooltip (O-3). **Not for popups.**
2. Data layer: feature-array caching, `#enqueue` fast path, chunked post-load (D-4…D-7).
3. Geocode caching and in-flight dedupe — reduces **billed** API calls (D-8).
4. Bundle: explicit `sideEffects` array (never `false`), then subpath exports, then splitting
   `markerclusterer` out of the browser build (B-1, B-2).
5. Listener delegation at the collection level (O-9 and the polyline equivalent).

---

## 10. How to measure

### 10.1 The measurement gap — read this first

**Every performance number in this plan, and every number in the CHANGELOG's Unreleased section,
came from Node with `google.maps` stubbed.** The test harness replaces `google.maps.Polyline`
with a trivial class. That is fine for counting allocations and timing our own code, and it is
what produced the solid wins already banked (ES2022, `Float64Array` paths). But it means:

- Anything whose cost is **inside Google's renderer** is invisible to it. `setMap()`, `setPath()`
  and marker drawing all cost approximately zero in the harness. This is exactly why viewport
  culling could never be shown to help (5.4.1) — the harness structurally cannot measure it.
- **Nothing has been verified on the iPhone that motivated this work.** Every figure is desktop
  Node. Mobile Safari is where the memory ceiling and the frame budget actually bite, and it is
  the platform the ES2022 target was chosen for.

Two consequences for how this plan is executed:

1. Any finding whose payoff is "Google does less work" — L-4, the marker laziness in M-1/M-2, the
   overlay DOM work in O-1/O-2 — **must be measured in a real browser**, not in the harness. A
   harness number for those is not evidence.
2. **Before starting Phase 1, establish a real-device baseline** on the iPhone using the existing
   pages, and record it here — this is Phase 0.5. Without it, none of the phases below can be
   honestly claimed as an improvement on the platform that prompted them. Instructions in 10.3
   and 10.4.

**On automating this (decided 2026-09-16: not for now).** Driving the pages with Playwright or
Puppeteer was considered and deliberately deferred. Measurement is done by hand per 10.3/10.4.
Two things to know if it is ever revisited:

- **Headless cannot measure frame rate.** There is no real compositor or GPU pipeline, so the FPS
  and lowest-FPS columns — the most user-visible numbers on these pages — would be misleading
  rather than merely imprecise. Automation must drive a **headed** browser to produce a frame-rate
  number worth reading.
- **It belongs in the same tier as vitest, not above it.** Automation can reliably capture build
  time, heap, and element counts — that is, *work avoided*. It cannot tell you whether anything
  got faster for a person on a phone. It would complement Phase 0, never replace 10.4.

There is also a running cost: every page load is a real, billed Maps JS API load, so a scripted
matrix multiplies API usage.

### 10.2 The harness that exists

The repo already has the right pages, and they already anticipate two of the findings.

- `site-src/polyline-simplify.njk` + `js/polyline-simplify.js` — point counts, simplify time,
  live FPS, and a scripted zoom test recording the lowest frame rate. Use for Phase 6.
- `site-src/marker-optimized.njk` + `js/marker-optimized.js` — marker count, creation time, DOM
  element/canvas/image counts, JS heap via `performance.memory`, and the same zoom test. Use for
  Phases 1–5.

  Note this page **already has a "separate per marker" vs "shared" overlay toggle**
  (`marker-optimized.js:183-189`), where the shared path uses one `G.tooltip()` and one
  `G.popup()` for every marker and just repositions them. That is O-3 already half-built and
  measurable today — worth running before writing any code, to size the win.

New pages worth adding, following the same pattern:

- **A data-layer page** — feature count, load time, heap, restyle time. Covers D-1…D-5.
- **A bounds page** — time and heap for `fitBounds` over 1M points. Covers Phase 4.

For each phase, record before/after in the results table the pages already build: creation time,
heap, element counts, and lowest FPS during the zoom test. The CHANGELOG entries for the polyline
work are the model for how to write these up.

### 10.2.1 Which page to record on — the real trail page first

**Start with the real trail site, not a library test page — and treat the first recording as a
*profile*, not a benchmark.**

The reason is specific. Nothing in this plan has been measured on the iPhone, so nobody knows yet
where the time actually goes on that device. The synthetic pages can only confirm what was already
suspected: they contain exactly the objects someone chose to put in them. A profile of the real
page can show that the bottleneck is somewhere this plan does not even cover — tile loading, app
code outside the library, layout, image decoding — and that is worth knowing **before** committing
to seven phases of work.

So the order is:

1. **Profile the real trail page on the iPhone.** Safari Web Inspector, Timelines, during load and
   during a pan/zoom. The question is "what is the main thread actually doing", not "what is the
   number". Write down the three biggest costs.
2. **Check them against this plan.** If the top cost is polyline simplify work or Google object
   creation, the plan is aimed correctly and Phase order stands. If it is something else, re-order
   the phases — or add a finding — before writing code.
3. **Then switch to the library pages** to iterate. They are the instrument: controlled, seeded,
   one variable at a time. Attributing a win to a specific change on the real page is not possible,
   because too much varies at once.
4. **Return to the real page at the end of each phase** as the acceptance test. It is the reason
   the work exists, and it is the number worth putting in the CHANGELOG.

**Which library page for which phase.**

| Phase | Page | Why |
|---|---|---|
| 1-5 | `marker-optimized` | The most instrumented page: creation ms, element/canvas/image counts, heap, FPS and lowest FPS, plus the shared-vs-per-marker overlay toggle that previews O-3 |
| 6 | `polyline-simplify` | Point counts, simplify time, and the scripted zoom test |
| 4 | a new bounds page | Does not exist. Needed for `fitBounds` over ~1M points |
| 3, 7 | `stress` — **built 2026-09-16** | Many polylines and many markers together, each with a tooltip and a popup. See below |

**The gap that was closed — the `stress` page (built 2026-09-16).** No existing page matched the
trail site's shape. `polyline.js` creates seven polylines as a feature demo (it does use
`attachTooltip`/`attachPopup`, but at single-digit scale) and `polyline-simplify.js` creates two
with no overlays at all. Nothing created **N polylines each carrying a tooltip and a popup** —
precisely the 2,595-segment workload the CHANGELOG cites, and precisely what M-1, O-1, O-2 and
O-3 are aimed at.

`site-src/stress.njk` + `site-src/js/stress.js` now covers it:

- Polylines (0-2,000) × points each (10-1,000), with the `simplify` options from the polyline page.
- Markers (0-5,000), with the `optimized` and `svgIcon` options from the marker page.
- Independent tooltip/popup mode for each — **none / separate / shared** — so the per-object cost
  can be measured against the one-shared-object baseline on both at once. This is the controlled
  instrument for O-3.
- **"Polylines start hidden"**, using `visible: false`, plus a *Show hidden polylines* button that
  times drawing them afterwards. This measures directly what deferring creation saves, and is the
  page to use when verifying M-1 and the 6.3 rule.
- **A seed field.** Everything is generated from a seeded PRNG, so two runs with the same settings
  build identical geometry. This is the fix for the `Math.random()` problem noted in 10.3, and it
  is what makes a before/after pair meaningful.
- Separate build timings for polylines and markers, plus the standard element/canvas/image counts,
  heap, FPS, lowest-FPS zoom test and results table.

It fits the map to the fixed generation area rather than to the points, deliberately — extending
bounds over ~400k points would make the page a measurement of `fitBounds` (D-3/C-4) instead of
what it is for.

**Pointing the trail site at a local build.** The test pages load `dist/browser.js` via eleventy's
passthrough copy, but the trail site will be loading a published copy. To measure a change there,
serve the locally built `dist/browser.js` in place of the published one — `npm link`, a local file
swap, or overriding the script URL. Confirm which build is actually loaded before recording;
measuring the published bundle while believing you are measuring a local change is the exact
failure mode that cost an earlier session an afternoon.

### 10.3 Measuring in a real browser on the Mac

**Setup, every time.** The test pages load `/map/browser.js`, which eleventy copies from
`dist/browser.js` — so **the pages test the built bundle, not `src/`**. Always `npm run build`
before measuring, or you will measure stale code. (This already bit an earlier session: a stale
bundle was the leading suspect for a bug that could never be reproduced.) Then `npm run site-serve`
and open `http://localhost:9090`. `npm run watch-all` does all three at once and is the normal
working mode.

**Fix the randomness first — small change, large payoff.** `gpsTrack()` in
`site-src/js/polyline-simplify.js` and `randomPosition()` in `site-src/js/marker-optimized.js`
both use `Math.random()`, so no two runs use the same data. That is fine for a demo and useless
for an A/B comparison. Add a seeded PRNG with the seed in the form, so a before/after pair is the
same geometry. Do this as part of Phase 0.

**Chrome — the primary tool, for allocation and memory.**
- Performance panel → record → run the page's built-in zoom test → stop. Read long tasks, scripting
  time, and the frame-rate track. Long yellow scripting blocks during zoom are the L-2/L-3 target.
- Performance Monitor (⋮ → More tools) gives a live read of JS heap size, DOM node count and
  listener count while you interact — the fastest way to see a per-object leak.
- Memory panel → Heap snapshot, before and after building objects. Compare snapshots to see
  retained size per class. This is where "5,190 detached divs" or "1M `{lat,lng}` literals" show up
  concretely. Take the snapshot *after* a manual GC (the bin icon).
- `performance.memory` is Chrome-only and the marker page already reports it in its results table.
- **Use CPU throttling (4× or 6×)** in the Performance panel to approximate phone-class hardware
  before you go near the phone. Run in a clean profile or Incognito so extensions do not pollute
  the numbers.

**Safari — the one that matters for parity with iOS.** Same engine family as the iPhone, so it is
the best desktop proxy. Enable Settings → Advanced → "Show features for web developers". Use
Timelines (JavaScript & Events, plus the Memory timeline) rather than Chrome-style heap diffing —
Safari's memory tooling is thinner. Note `performance.memory` does **not** exist here, so the
pages' heap column will read `n/a`; rely on the Memory timeline and the pages' own FPS counters.

**Firefox — a sanity check, not a primary.** Its Performance panel is good for confirming a win is
not Chrome-specific. No `performance.memory` here either.

**Method.**
- Change one thing at a time; keep the seed, the object count and the zoom-test script identical.
- Run each configuration **three times and take the median** — single runs on a laptop are noisy.
- Record in the results table the pages already build: creation time, heap, element/canvas/image
  counts, and lowest FPS during the zoom test.
- Keep the baseline row. A phase that improves creation time but halves frame rate is not a win,
  and only a side-by-side table will show that.

### 10.4 Measuring on the iPhone

This is the platform that motivated the work and the one with no numbers yet, so treat it as the
real verdict rather than a confirmation step.

**One-time setup.**
1. iPhone: Settings → Apps → Safari → Advanced → **Web Inspector** on. (On older iOS this is
   Settings → Safari → Advanced.)
2. Mac: Safari → Settings → Advanced → **Show features for web developers**, which reveals the
   Develop menu.
3. Connect the iPhone by USB and tap **Trust** on the phone.
4. The page must be reachable *from the phone*: eleventy is configured for port 9090 in
   `eleventy.config.cjs` but binds to localhost, so add `host: '0.0.0.0'` to `setServerOptions`,
   put both devices on the same Wi-Fi, and browse to `http://<mac-lan-ip>:9090`.
5. **Check the API key restrictions.** The key comes from `.env` via `GOOGLE_MAPS_API_KEY` and is
   injected into the page. If it has HTTP-referrer restrictions, a bare LAN IP will be rejected and
   the map will silently fail to load. Allow the IP, or use a key without restrictions for testing.
6. On the Mac: Safari → Develop → *[iPhone name]* → the page. You now have a full Web Inspector
   attached to the phone.

**What to measure.**
- The pages' own instrumentation is the primary record here — creation time, lowest FPS during the
  zoom test, element counts. It works identically on the phone and writes to the same results
  table, which is why it is worth more than the Inspector's own tooling on iOS.
- Web Inspector Timelines for JavaScript & Events and Memory. Expect less detail than Chrome;
  `performance.memory` is absent, so heap reads `n/a`.
- Watch for the failure mode desktop hides: long main-thread blocks that are tolerable at 3GHz and
  are a visible freeze on a phone. The 200-230ms zoom-bucket figure is a desktop number.

**Discipline that actually matters on a phone.**
- Disable Low Power Mode, keep the device plugged in, and let it cool between runs — thermal
  throttling will invent regressions that are not there.
- Close other apps and other Safari tabs.
- Three runs, median, same as desktop.
- **Record the device model and iOS version** next to every number. A figure from one iPhone is not
  comparable to a figure from another, and the browser-support floor in the README is tied to
  iOS 15.

---

## 11. Deliberately left out

- **Viewport culling of polylines (L-1).** Tried and abandoned 2026-09-16; full reasoning in
  5.4.1. It changes what is visible, not what is allocated, and L-3/L-4 remove most of the
  motivation. Opt-in only if ever revisited.
- **Web Workers for simplification.** Feasible — `Float64Array` is transferable — but the
  dominant main-thread cost is allocating `google.maps.LatLng` objects and calling `setPath`,
  and neither can move off-thread. After L-3 lands, a worker would be optimizing an
  already-cheap step. Revisit only for the initial 2.4M-point load.
- **`Float32Array` for path storage.** Rejected in section 7 — precision loss is the same order
  as the simplify tolerances.
- **Making `LatLng`/`Point`/`Size` immutable, and interning/pooling.** The prize is real
  (removes every defensive `clone()`, makes C-6 safe) but it breaks anyone calling `setLat()` or
  `ceil()` for their side effect. Major version.
- **Replacing import-time `include()` with explicit registration.** The clean fix for B-1, and a
  breaking API change. Major version.
- **Restructuring `MarkerCollection.markers`** — it is a public mutable field.
- **Changing `getBounds()` to synchronous, or `LatLngBounds.equals()`/`intersects()`** — public
  async signatures.
- **Changing the `draw` default on `MarkerCluster.addMarker()`** — coalescing preserves the
  semantics; changing the default would not.
- **Debouncing autocomplete** — not needed. Both searchbox classes hand the input to Google's
  own widget, which throttles internally. The library never issues per-keystroke requests.

---

## 12. Follow-ups, out of scope

- `Base` stores an object-type string on every instance (C-18). Moving it to the prototype is
  mechanical but touches every subclass `super()` call. Keep the string tag — it survives two
  copies of the library where `instanceof` would not.
- `dist/` is committed to git; the two declaration files are the same size (284,519 B each) and
  are likely near-duplicates. 569 KB of the published package.
- No `unpkg`/`jsdelivr` field pointing at `dist/browser.js`.
- `"types": ["google.maps", "node"]` pulls Node types into a browser library.
- `DataFeature.#geometryPaths` uses O(n²) `reduce(concat)` (`DataFeature.ts:375`) — becomes
  `.flat()` once `lib` is raised in Phase 1.

---

## 13. Answers and decisions

All four open questions were answered on 2026-09-16. Recorded here so the reasoning isn't lost.

1. **`setOptions({ map })` (6.3) — the map option displays the object.** Passing `map` displays
   the thing — marker, polyline, anything — *unless* another option that hides it is passed in
   the same call. So the current behavior is a bug and gets fixed. Laziness keys off
   **visibility**, not off whether a map is set, and the rule applies uniformly across every
   class. Documentation must state this and note the performance cost of passing `map` on
   something intended to start hidden. Details in 6.3.

2. **Map setter batching (P-5) — approved.** End-of-microtask application is acceptable. This
   also fixes the existing inconsistency where the async control setters land out of order
   relative to the synchronous ones.

3. **Shared tooltip (O-3) — opt-in flag.** Not the default. `attachTooltip()` keeps returning a
   per-layer `Tooltip` unless the caller opts in.

4. **Viewport culling (L-1) — dropped.** Attempted in a separate session the same day and
   abandoned; that conclusion is correct and the plan now agrees with it rather than
   re-proposing the work. Full reasoning in 5.4.1. Opt-in only if it is ever revisited.

### Still worth deciding, but not blocking

- **Where the shared-tooltip opt-in lives** — a per-call option on `attachTooltip()`, a global
  default, or both. Worth settling when Phase 7 starts, not now.
- **Whether `polyline.path` should keep caching forever** (L-10). The additive
  `getPathCoords()`/`pathLength` accessors are safe and planned; changing the caching behavior of
  `.path` itself is the part that needs a call.
