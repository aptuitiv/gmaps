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
| C-4 | ~~`#boundValues` retains one literal per point~~ — **dropped**, see Phase 4 | `LatLngBounds.ts:71, 286` | Struck |
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
| B-2 | `@googlemaps/markerclusterer` is unconditionally in the browser bundle — **re-measured 2026-09-16: 24,226 B (14.3%)**, not the 29,835 B (18%) first recorded | re-measured by bundling with and without it | High — **skipped by decision** |
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

**Resolved in Phase 3 Slice C (2026-09-16): `Marker` now has a `visible` option**, so the rule
above is expressible and implemented. `setOptions({ map })` displays the marker;
`{ map, visible: false }` creates nothing until it is shown. The original blocker note follows.

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

**Tempered, from the Phase 0 tests (2026-09-16).** Popup's theme defaults to **`'none'`**
(`Popup.ts:187`), where Tooltip's defaults to `'default'` (`Tooltip.ts:120`). The `if (this.#theme
=== 'default')` block in `Popup.draw()` therefore does nothing at all unless the caller opts into
the default theme, so this costs nothing for the common case. Still worth fixing — the guard is
four lines and `Tooltip` already shows the shape — but it is not the per-frame tax it first looks
like, and it should be ranked below O-5's sibling problems.

Two things in `Popup.draw()` are *not* tempered and do run on every frame regardless of theme:
the unconditional `transform` write (`Popup.ts:781-788`, which `Tooltip.ts:457` guards by
comparing against the current value), and the `querySelectorAll` plus listener rebind for
`closeElement` (`Popup.ts:805-814`). Those are the parts worth fixing first.

Covered by `test/Popup.test.ts`, which calls `draw()` directly with a fake projection and records
which styles each frame writes.

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

  **Narrowed by the Phase 0 tests (2026-09-16).** The race is conditional, which is why it has
  survived. `#createPlacesSearchBox()` has exactly one `await` before it assigns `#searchBox`:

  ```js
  if (this.#options.bounds) { options.bounds = await this.#options.bounds.toGoogle(); }
  ```

  So it only opens when a **`bounds` option is set**. With bounds, two concurrent `init()` calls
  both yield at that await and both construct a widget. Without bounds there is no await before
  the assignment, the first call assigns synchronously, and the second call's guard catches it —
  so the common case looks perfectly correct. Verified both ways in
  `test/PlacesSearchBox.test.ts`: three concurrent `init()` calls build three `SearchBox` objects
  with bounds set, and one without.

  `AutocompleteSearchBox` awaits its bounds the same way, so one fix covers both. Memoize the
  creation promise — `DataLayer.#getGoogleData()` (`DataLayer.ts:1123-1156`) already does exactly
  this correctly and is the pattern to copy.

- **`PlacesSearchBox.init()` never settles when it fails.** Found by the Phase 0 tests
  (2026-09-16), not by the audits. `init()` (`PlacesSearchBox.ts:216-236`) wraps its work in
  `new Promise((resolve) => ...)` with **no reject path**, and calls
  `this.#createPlacesSearchBox().then(() => { resolve(); })` with **no `.catch`**.

  `#createPlacesSearchBox()` throws when there is no input element (`PlacesSearchBox.ts:250`).
  That rejection has no handler, so it escapes as an unhandled promise rejection and `resolve()`
  is never reached — meaning **`await box.init()` hangs forever** rather than throwing. A caller
  gets neither a working search box nor an error, just a promise that never settles.

  The fix is to take the `reject` parameter and `.catch(reject)`, which should land with the
  memoization above since both are in the same few lines.
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

### 6.7 ✅ `getCenter()` returns the wrong longitude for a bounds that crosses the meridian

**Found by the Phase 0 tests on 2026-09-16 and proven by a passing test.** Not in any audit.

`getCenter()` (`LatLngBounds.ts:360-377`) averages the two longitudes, then normalises the
result into `[-180, 180)`. For a bounds that wraps the 180th meridian the average is taken the
wrong way round and the normalisation never recovers the missing half-turn:

```js
lng = (northEast.longitude + southWest.longitude) / 2;   // (-170 + 170) / 2 = 0
if (northEast.longitude < southWest.longitude) {
    lng = ((lng + 180) % 360) - 180;                     // ((0 + 180) % 360) - 180 = 0
}
```

For a bounds running west 170° → east −170° (a 20° span across the meridian) the true centre is
**180°**. It returns **0°** — the opposite side of the globe. Latitude is computed correctly; only
longitude is wrong, and only in the wrapped case.

**Fix:** in the wrapped branch, average across the wrap before normalising — add 360 to the east
longitude first (`(sw + (ne + 360)) / 2`), or equivalently add 180 to the naive average, then
normalise.

**Why it matters here.** It is a plain correctness bug, but it also sits directly on Phase 4's
path: `getCenter()` is one of the methods that reads the maintained corners rather than
`#boundValues`, so the corner arithmetic has to be right before that array can be dropped. It
should be fixed in Phase 2 with the other correctness work, not left for Phase 4.

Covered by `test/LatLngBounds.test.ts`, which asserts the current wrong answer with a QUIRK
comment, so fixing it turns that test red and forces a deliberate update.

---

## 7. Decisions

| Decision | Choice | Reason |
|---|---|---|
| Order of work | Non-breaking allocation wins first, architecture last | Phases 1–3 can ship as a patch release with no API discussion |
| `Evented` containers | Lazy via `??=`, fields `\| undefined` | All `#private`; nothing outside can observe it. Biggest win per unit of effort |
| `isObject()` fast path | New name for the strict version; audit the ~40 call sites | `typeof` returns `true` for `Date`/`Map`/`Set` where `toString` returns `false` — a real semantic change |
| `latLng()` returning its argument | **No** — add a private internal helper instead | The exported factory must keep copying; `LatLngBounds.#extend` already hit this aliasing bug once |
| Primitive immutability / interning | **Not now** — major version | `LatLng`, `Point`, `Size` are all mutable today; making them immutable unlocks interning but breaks `setLat()`/`ceil()`/`subtract()` callers |
| Shared tooltip instance (O-3) | **On by default** — changed 2026-09-16, was opt-in | Each object keeps its own value and it's put back on every show, so one layer's content can't be left showing for another. `Tooltip.useShared = false` or `{ shared: false }` opts out |
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

**Corrected 2026-09-16.** This section named five call sites. There are **ten**, all inside the
same three files, so the recommended globs still cover them — but the count matters if anyone ever
tries to enumerate them by hand:

- `InfoWindow.ts:874` `Layer.include`, `:875` `Map.include`
- `Popup.ts:1112` `Layer.include`, `:1113` `Map.include`, `:1186` `DataLayer.include`,
  `:1187` `DataFeature.include`
- `Tooltip.ts:622` `Layer.include`, `:623` `Map.include`, `:696` `DataLayer.include`,
  `:697` `DataFeature.include`

These are load-bearing prototype mutations. With `"sideEffects": false`, a bundler that sees
`Popup` as unused will drop the module, and `attachPopup()` / `attachTooltip()` /
`attachInfoWindow()` will silently vanish from `Layer`, `Map`, `DataLayer` and `DataFeature` at
runtime — **with no build error**.

Use the explicit array form: `"sideEffects": ["**/Popup.*", "**/Tooltip.*", "**/InfoWindow.*"]`.
It was added on 2026-09-16.

**Second correction: the claimed benefit does not exist in this build.** The array does *not* let
bundlers drop `Geocode`, `AutocompleteSearchBox`, `ImageOverlay` or `MarkerCluster`. Measured in
Phase 7: the published ESM is a single bundled module, so `sideEffects` — which works at module
granularity — has no effect at all, and `false`, the array, and no field at all produce
byte-identical output. `false` is therefore harmless *today*, which makes it a worse trap, not a
better idea: it would look correct right up until the build emits separate modules.

### 8.2 Behavior changes to raise with the user

| Item | Change | Notes |
|---|---|---|
| M-1 | `ready` may fire before the Google marker exists | Precedent already set and documented for `Polyline`. `toGoogleSync()` in a `ready` handler must become `toGoogle()` |
| 6.3 | `setOptions({ map })` semantics | **Settled:** the map option displays the object unless a hide option is also passed. Fixing this is a bug fix, and it is user-visible for anyone relying on the current broken behavior |
| M-4 | `position` returns a cached `LatLng` | Object identity becomes stable; a caller mutating the result would now affect cached state |
| P-5 | Map setters batch into one microtask | Set-then-immediately-read-back through `map.toGoogle().get(...)` would see the old value |
| L-3 | `simplifyPath()` output may differ by a point or two at coarse tolerances | Public exported helper; same signature, same tolerance guarantee |
| L-8 | `polyline.highlightPolyline` would return `undefined` before first hover | Mitigate by keeping the getter eager-constructing while the internal path stays lazy |
| O-3 | Shared tooltip changes `attachTooltip()`'s return value | **Shipped on by default 2026-09-16** at the user's direction. Three changes, listed in Phase 7. Appropriate for a 0.x minor bump |
| C-6 | `latLng()` returning its argument | Rejected above — internal helper instead |
| B-2 | Making `markerCluster()` lazy-load would change its signature | **Skipped 2026-09-16.** A separate add-on bundle does *not* avoid this — see Phase 7 |

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

**Status: 2026-09-16. 419 passing, 2 expected-fail, 1 todo, across 16 files.**

| Item | State |
|---|---|
| 0.1 Setup — vitest 5.0.1 + jsdom, `vitest.config.ts`, `test/`, npm scripts, `coverage` ignored | **Done** |
| 0.2 Instrumented `google.maps` stub — `test/support/googleMaps.ts` | **Done** |
| 0.3 Priority 1, core primitives — `helpers`, `LatLng`, `Point`, `Size`, `Evented` | **Done** |
| 0.3 Priority 1, `Marker` | **Done**, including the map paths |
| 0.3 Priority 1, `Polyline` | **Done** |
| 0.3 Priority 1, `Tooltip`, `Popup`, `Overlay` | **Done** (jsdom) |
| 0.3 Priority 1, `Loader`, both collections, `simplifyPath`, `PlacesSearchBox`, `LatLngBounds` | **Done** |
| 0.3 Priority 1, `Map` | **Done** apart from the render path — see the note below |
| 0.3 Priority 2, §6 regressions | 6.1, 6.3, 6.4, 6.5 and 6.6 covered; 6.2 blocked on the render path |
| 0.3 Priority 3, absence assertions — markers | **Done** (M-1, M-2, M-4, M-13) |
| 0.3 Priority 3, absence assertions — polylines | **Done** (L-4, L-5, L-7, deferred drawing) |
| 0.3 Priority 3, absence assertions — overlays | **Done** (O-1, O-2, O-11, M-1 both halves) |
| 0.3 Priority 4, §8.2 behaviour-change rows | Mostly covered as a side effect of the absence assertions (M-1, M-2, M-4, L-4, 6.3). No dedicated pass yet |
| 0.3 Priority 5, allocation shape | **Done** — `LatLng` construction counts, the path staying as plain numbers, `Point`/`Size` cache reuse, and the bounds corner arithmetic that gates Phase 4 (`test/LatLngBounds.test.ts`) |
| 0.3 Priority 6, simplify correctness | **Done** — a geometric tolerance property, not a point count |
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

**Status: in progress, started 2026-09-16.** Done so far:

| Item | State |
|---|---|
| C-1 delete the dead `Evented` fields | **Was already done** before Phase 1 started — nothing to do |
| C-9 `hasListener()` → `.some()` | **Done** |
| C-10 simplify the per-listener `once` check | **Done** — `#on()` always sets `options`, so the `undefined`/`isObject` tests were dead |
| C-11 lazy `listenersToRemove` | **Done** |
| Hoist constant option arrays | **Done** — `Icon`, `SvgSymbol`, `Marker` (×2), `AdvancedMarker` |
| O-5 Popup theme guard | **Done** — `#isThemeApplied` + `#applyTheme()`, mirroring `Tooltip`, with the theme setter resetting it |
| O-6 bind Popup close handlers once | **Done** — `#areCloseHandlersBound`, reset by the content setter since new content replaces the children |
| O-4 hoist the `OverlayView` class | **Done** — built once into a module-level variable, still lazily after Google loads |
| O-8 dirty check in `Overlay.style()` | **Done** |
| Polyline `performance.now()` behind the debug guard, `EMPTY_COORDS` hoisted | **Done** |
| M-12 remove `console.log` from hot paths | **Done** — and see below |
| Build: drop the eslint plugin from the second entry | **Done** |
| Build: raise `lib` to `es2022` | **Done**, with a note that some ES2022 built-ins need newer browsers than the target |

**More logging than the audits found.** M-12 listed `AdvancedMarker` only. `Map` also had four
live `console.log` calls in the `preventPageZoom` path (`#setupPreventPageZoom` and
`setOptions`), which ran on every map setup. Those are removed too.

**A dead branch removed with it.** `AdvancedMarker.on()` had a `mouseenter` branch that added two
listeners which only logged and **never called the callback that was passed in**, so
`on('mouseenter', fn)` silently did nothing. Removing the logging would have left a branch that
swallows the callback, so `mouseenter` now goes through the normal `super.on()` path.

Still to do in this phase: nothing — but re-verify with `npm test`, `tsc --noEmit` and
`npx eslint ./src` before moving on, and note that two Popup tests were updated because the
§6.4 fix deliberately turned them red.

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

**Status: complete, 2026-09-16.** 427 tests passing, `tsc --noEmit` clean, `eslint ./src` clean.

Every §6 bug is fixed except 6.3, which belongs with M-1 in Phase 3. The suite now has **no
`it.fails()` and no `it.todo` left** — all three existed to pin bugs that are now gone.

| Item | State |
|---|---|
| 6.1 scope `clearListeners` to this library's own listeners | **Done** — each Google listener is kept by handle in `#googleListeners` and removed on its own |
| 6.2 reorder `#setMapAsReady()` | **Done** |
| 6.5 guard `#isGoogleObjectSet()` against a missing `google` | **Done** — and `#afterListenersRemoved()` no longer calls it at all |
| 6.6 `Loader.on()` dispatching the wrong event type | **Done** — plus an `#isMapLoaded` flag |
| 6.6 one Google listener per type in `setEventGoogleObject()` | **Done** |
| 6.6 `offAll()` leaving pending listeners behind | **Done** |
| 6.6 memoize the searchbox `init()` promise | **Done** — both search box classes |
| 6.6 `PlacesSearchBox.init()` never settling on failure | **Done** — it rejects now |
| 6.6 guard `MarkerCluster.removeMarker()` | **Done** — needed a new `Marker.hasGoogleMarker()` |
| 6.6 `helpers.ts` broken `replace()` pattern | **Done** |
| 6.6 `LatLngBounds.toUrlValue()` precision of 0 | **Done** |
| 6.6 the dead `isObject` branches | **Done** |
| 6.6 the stuck `#isSettingUp` / `#isGettingMapOptions` flags | **Done** |
| 6.7 `getCenter()` across the meridian | **Done** |

**Two things worth knowing for later phases.**

Removing the dead `isObject` branches broke the **types**, though not the runtime. The
`instanceof HTMLElement` arm could never execute, but Typescript was using it to narrow the
union, so `setOptions()` started receiving `HTMLElement | Text | Options`. The element types are
now named in the guard so the narrowing matches what `isObject()` does at runtime. Dead to the
engine is not the same as dead to the compiler.

`init()` on both search boxes is `async`, so it wraps the memoized promise in a fresh one each
call and the returned objects are never identical. The memoization is still correct — the work
happens once — but a test cannot assert it with `toBe` on the promise.

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

The core of the plan. It's big enough that it's being done in **slices**, each verified against
`npm test`, `tsc --noEmit` and `eslint ./src` before the next one starts. The slices are ordered
so that the ones with no API risk land first: a fault in the primitives would otherwise be
misattributed once the later work sat on top of them.

**Status: 2026-09-16. A, B and C done. D done apart from O-1 and O-10.**
448 tests passing, `tsc --noEmit` clean, `eslint ./src` clean.

| Slice | Covers | State |
|---|---|---|
| A — core primitives | C-3, C-7, C-12, C-13, M11 | **Done** |
| B — lazy `Evented` containers | C-2, C-8 | **Done** |
| C — Marker and DataFeature laziness | M-1…M-4, M-6, M-13, §6.3 | **Done** |
| D — Overlay, Tooltip, Popup | O-2, O-11 | **Done**. O-1 and O-10 deferred |

**Left in Phase 3:** O-1 (the full lazy DOM conversion) and O-10 (`InfoWindow` deferring its
setup). Neither blocks a later phase, and both are bigger than the audit made them look — see
the notes at the end of Slice D.

#### Slice A — core primitives (done)

- **C-3 `isObject()`**. A `typeof`/`null` pre-filter now runs in front of the `toString` call, so
  primitives exit cheaply. The plan originally suggested replacing the check with `typeof`, which
  would have been **wrong**: `typeof` reports `true` for `Date`, `Map` and `Set` where this check
  reports `false`, and around 40 call sites depend on that. The answers are unchanged.
  `isObjectWithValues()` reuses it so the keys are only listed for something that is an object.
- **C-7** `(number, number)` fast paths on `LatLng`, `Point` and `Size`, skipping `set()`'s
  `Array.isArray → isObject → instanceof` dispatch. `isNumber()` is used rather than a bare
  `typeof` so the values accepted are exactly the ones the setters would have accepted.
- **C-12** `#valuesChanged` deleted from `LatLng`. The setters clear the cached Google object
  instead, which removes a field and a write per coordinate from every instance.
- **C-13** `LatLng.equals()` no longer builds a third `LatLng` to compare two.
- **M11** `isObject(this.#pointObject)` cache checks in `Point`/`Size` replaced with
  `!== undefined`. That was a `toString` call on every coordinate write.

**C-14 was deliberately skipped.** Caching "Google Maps has loaded" in a module-level boolean is
unsafe here: the library supports creating objects before the library loads, and the test suite
installs and removes the stub between tests, so a cached `true` would go stale and report the
wrong answer. Not worth the correctness risk for one `typeof` check.

#### Slice B — lazy `Evented` containers (done)

All five containers (`#eventsCalled`, `#eventListeners`, `#onlyEventListeners`,
`#pendingMapObjectEventListeners`, `#googleListeners`) are now `| undefined`, created on first
write with `??=` and read with `?.`. Every class in the library extends `Evented`, so at 20,000
markers this is roughly 80,000 objects that are no longer allocated and were empty for the life
of the page.

`offAll()` clears them back to `undefined` rather than leaving empty containers behind, so an
object whose listeners have all been removed holds no more than one that never had any.

**C-8** came with it: `dispatch()` now does a single lookup held in a local. It used to call
`hasListener()`, which looked the list up twice more, and then look it up again itself — three
lookups per dispatch, on a method that runs for every event on every object including per-frame
ones like `bounds_changed`.

One semantic point that had to be preserved: `#eventsCalled` is still written **even when nothing
is listening**. A listener added later with `callImmediate` depends on knowing the event already
fired, so that write cannot move behind the early-out. There's a test for exactly this.

**On testing the laziness.** The containers are `#private`, so no test can read them or count
allocations directly. `test/Evented.test.ts` exercises every container path on an object that has
never had a listener, so a missed lazy-init shows up as a `TypeError` rather than passing
silently — but the real proof that the allocation is gone is a heap snapshot in a browser, per
section 10. An earlier attempt at a test that claimed to measure allocation was removed for
overstating what it checked.

#### Slice C — Marker and DataFeature laziness (done)

**Done 2026-09-16.** 438 tests passing, `tsc --noEmit` clean, `eslint ./src` clean.

**M-1 and §6.3 had to land together.** They looked separable and are not. Today
`marker({ position, map, tooltip })` only appeared on the map because `attachTooltip()` awaits
`init()` and `init()` created the Google marker as a side effect — `setOptions({ map })` created
nothing of its own. Making `init()` lazy on its own would have silently stopped that marker
appearing. Both changed in one go, with the new `visible` option that §6.3's rule needs.

| Item | What changed |
|---|---|
| M-1 | `init()` dispatches `ready` and creates nothing, matching `Polyline.init()` |
| §6.3 | `setOptions({ map })` now displays the marker. The old guard was `if (this.#marker)`, never true for a new marker |
| `visible` | **New public option**, plus `setVisible()` and a `visible` property. `{ map, visible: false }` creates nothing until shown |
| M-2 | `setMap(null)` on a marker that was never drawn returns early instead of building one to detach |
| M-6 | `#setupGoogleMarker()` returns a shared resolved promise when the marker already exists |
| M-13 | `title` is held on the options instead of assigned through the public setter |

**Decided: option A for the timing.** `setOptions({ map })` calls the async `setMap()`, so the
Google marker is created on a later microtask rather than synchronously. This matches the shipped
`Polyline` contract, and `setMapSync()` is there for callers who need it to exist on return.

**`DataFeature` needs no change.** Its `init()` is already `return Promise.resolve()` and it holds
only `#feature` and `#layer`, both passed into the constructor — the Google feature always exists,
so there is nothing to defer. The parity item in this plan was based on the shared `Layer.init()`
contract, but `DataFeature` already satisfies it. D-4's eager-construction half is a `DataLayer`
problem (`#afterLoad` materialising a wrapper per feature), not a `DataFeature` one, and stays in
Phase 7.

**M-3 and M-4 followed after the creation semantics were settled.**

- **M-3.** `#options` no longer starts with a `latLng([0, 0])`. Almost every marker replaced it
  immediately, so it was built and thrown away once per marker. The `position` getter creates the
  0,0 default if something asks for a position that was never set, and
  `#setGoogleMarkerPosition()` reads through the getter rather than the field.
- **M-4.** The `position` getter no longer calls into Google and builds a new `LatLng` on every
  read. **Only a draggable marker can move without the library being told**, so only that case
  still asks Google; for every other marker the stored position is authoritative, because
  `setPosition()` keeps both sides in step. Any loop over markers — fitting bounds, filtering,
  sorting by distance — used to allocate one object per marker per pass.

  This is the behaviour change §8.2 flagged: the returned `LatLng` now has **stable identity** for
  a non-draggable marker, so a caller that mutates what `position` hands back is mutating the
  marker's own state rather than a private copy. The draggable carve-out has its own test, because
  removing that branch as a "simplification" would silently break dragging.

**Two bugs in the new code, both caught by the tests:**

1. `Layer.setMap()` sets `isVisible = true` for any non-null map (`Layer.ts:197`), which
   overwrote the `isVisible = false` that `setOptions` had just set from the `visible` option one
   line earlier. The deferred branch now restores it after `super.setMap()`.
2. A test of mine registered `onReady()` *after* `marker()` had already dispatched `ready`
   synchronously. `Marker.onReady()` uses plain `on()`, so it never fired. This is worth knowing
   beyond the test: **`ready` firing before anyone can subscribe is only safe because the real
   consumers use `onceImmediate`** — `Tooltip.attachTo()` and `Popup.attachTo()` both do
   (`Tooltip.ts:259`, `Popup.ts:471`), which is exactly what lets them attach to a marker that is
   never drawn.

**Background — the original notes for this slice, kept for the reasoning behind it:**

Marker parity with Polyline: lazy `init()`, short-circuit `setMap(null)`, drop the throwaway
position `LatLng`, cache the `position` getter, resolved-promise fast path (M-1…M-6), plus
**M-13** — routing `title` through the private `#setTitle()` is the same mistake as M-1 in a
different place, and `test/Marker.test.ts` already holds the expectations that flip when it's
fixed.

**`DataFeature` gets the same treatment.** `Marker`, `DataFeature` and `Polyline` all share the
`Layer.init()` contract and only `Polyline` was changed in the previous pass. Doing all three
together keeps them consistent and covers the eager-construction half of D-4.

**Why this needs a decision first:** §6.3 cannot be expressed without **adding a public `visible`
option to `Marker`**, which has none (see the blocker note in 6.3). That is an API addition, and
M-1 changes when the Google marker is created — a documented behaviour change. Both belong in
§8.2 territory, which says to raise them before building.

The `Polyline` half is **already shipped and confirmed working in the browser** — the
2,595-segment page went from creating 2,595 Google polylines at load to zero. That is the
existence proof for M-1: the same contract, applied to markers and data features, on a page that
creates far more of them.

#### Slice D — Overlay, Tooltip, Popup (O-2 and O-11 done)

**Done 2026-09-16.** Split as recommended below: O-2 and O-11 landed, O-1 deferred.

| Item | What changed |
|---|---|
| O-2 | `Tooltip` and `Popup` hold their content and write it into the element the first time the element is used, instead of parsing it in the setter |
| O-11 | `Overlay` no longer allocates a default 0,0 `Point` in its constructor. `getOffset()` builds one on first read |

**O-2 flushes on access, so the public contract is unchanged.** `getOverlayElement()` is
overridden in both classes to write any waiting content before handing the element back, so
anything reading the element — inside the library or outside it — still sees the content.
`add()` and `draw()` both go through that accessor, so the flush happens when the overlay is
first shown.

At the 2,595-segment scale in section 1, that is 2,595 `innerHTML` parses that no longer happen
before anything is displayed. A tooltip attached to a layer that is never hovered now costs the
`Tooltip` object and nothing else.

**O-11 does not use a shared zero Point, and the plan's suggestion to freeze one would not have
worked.** `Object.freeze` cannot protect a `Point`: its values live in `#private` fields, not
properties, so a frozen instance is still mutable through `setLat`-style setters and two
overlays would end up sharing one offset. Building it lazily per overlay gets the same saving
with no aliasing risk — `Tooltip` and `Popup` each go from two `Point` allocations to one,
because both replaced the base default immediately.

**On testing the deferral.** Most of the existing O-2 tests read `getOverlayElement()`, which
triggers the flush, so they verify the access contract rather than the laziness. The one thing
observable without touching the overlay is **element** content: the node is only `appendChild`-ed
during the flush, so `element.parentElement` stays `null` until then. `test/Tooltip.test.ts` uses
that, including across 100 tooltips. String content has no equivalent observable, which is worth
knowing if these are ever rewritten.

**O-1 was deferred for the reason given below:** 42 `this.#overlay` references, most of the
form `this.#overlay.style.x = …`, so a missed one fails at runtime rather than at compile time,
and the drag and resize paths have no test cover.

**Both halves of that reason were addressed on 2026-09-16, at the user's direction, as groundwork.
O-1 itself is still not done — but it is no longer blocked for the stated reason.**

1. **`strictNullChecks` is on** (`tsconfig.json`). Turning it on produced **zero errors** — the
   code was already written with optional fields and optional chaining throughout. This is the
   part that changes the calculus: typing `#overlay` as `HTMLElement | undefined` now turns every
   unchecked use into a **compile error**, so the compiler enumerates all 42 sites and proves the
   conversion is complete. The original objection — "fails at runtime rather than at compile
   time" — was correct when it was written and is no longer true.
2. **Drag and resize have tests** (`test/Overlay.test.ts`, 19 added). Drag is covered end to end:
   enable/disable, the styles written to the element, press/move/release, the movement maths, and
   that a release detaches the document listeners. Resize is covered for its handle lifecycle:
   four handles with the right classes and cursors, the outline, removal, and that enabling twice
   doesn't double them.

**The resize-movement gap was closed on 2026-09-16**, so every one of the 42 references now has
both a compiler check and test cover — which is what O-1 was waiting for.

It had been the one part of the drag and resize code tests couldn't reach: `#handleResizeStart`
returns early without `getMap()?.getDiv()` (`Overlay.ts:1025`) and `#handleResize` does nothing
without `getProjection()` (`Overlay.ts:1080`), and neither `fakeMap` nor the stub `OverlayView`
provided those — so a test written against the old harness would have passed **without running
the code it claimed to test**. Three additions closed it:

- **`fakeMap.getDiv()`**, building its element on first use, because 13 of the 19 test files run
  without a DOM and building it up front would break them.
- **`getProjection()` on the stub `OverlayView`**, returning a stand-in `MapCanvasProjection`.
  The mapping is deliberately linear — `PIXELS_PER_DEGREE` pixels to the degree, latitude
  increasing upwards — so a test can work out the numbers it expects rather than copying them
  from a run. It's exported for that reason.
- **`test/ImageOverlay.test.ts`**, 20 tests for a class that had none. `ImageOverlay` is the only
  sensible subject: base `Overlay.getBounds()` builds its bounds from two empty `latLng()` values,
  so a plain `overlay()` can never clear the early return, while `ImageOverlay` returns the bounds
  it was given and is the only class overriding `setBoundsFromResize()` and
  `updateBoundsFromResize()`.

**One harness detail to keep in mind before adding more overlay tests.** jsdom's
`getBoundingClientRect()` returns zeros for everything, and `#handleResizeStart` measures both the
overlay and the map div with it. The tests stub it on both. Without that the resize maths still
runs, but every input is 0 — a test that executes the code and proves nothing.

Note also that adding `getProjection()` changed what the *existing* tests exercise: overlays that
previously found no projection now find one, so `draw()` paths that used to return early are now
running. Nothing broke, but it means the suite covers more than it did.

**Re-sized estimate for O-1 itself, measured 2026-09-16:**

- **All 42 references are in `Overlay.ts` alone.** Every subclass already goes through
  `getOverlayElement()` — Popup 7, Tooltip 6, ImageOverlay 9, InfoWindow 0. **No subclass
  changes at all.**
- **~28 are a mechanical rename** inside the drag and resize internals (`#setupDragHandlers`
  through the resize movement handlers). They only run after `enableDrag()`/`enableResize()` and
  all want the element to exist.
- **~10 need judgement:** the 4 constructor lines move into the lazy creator; `get`/`set
  className` (3) need a `#className` backing field, because `get className()` currently reads the
  DOM; `removeClassName`, `style()` and `remove()` need to work without an element.
- **`style()` is nearly free** — `#styles` (`Overlay.ts:173`) already records the value before
  writing to the DOM, so the buffer exists.
- **It applies to every `Overlay` subclass**, not just `Popup`, because the element is built in
  the base constructor. The benefit is lopsided: Popup wins big (thousands per page, opened
  rarely), InfoWindow gets a free win (0 element uses), ImageOverlay materialises immediately
  anyway, and Tooltip saves exactly one div now that O-3 shares a single instance.

**O-10 is also bigger than the audit implied, and was left alone deliberately.** The audit
described it as the `content` setter calling `#setupGoogleInfoWindow()` eagerly. In fact **nine**
setters call it — `InfoWindow.ts:185, 209, 233, 283, 311, 336, 361, 390` and `690` — and each one
follows the same shape:

```js
this.#setupGoogleInfoWindow();
if (this.#infoWindow) { this.#infoWindow.setX(value); }
```

The setup call is what makes the guard on the next line true. Removing it from one setter without
the others gives a class where some options reach Google and some silently don't, depending on
which was set first. Doing this properly means auditing all nine together and deciding where the
deferred values get flushed — the same shape of change as O-1, not a one-liner.

**Background — the original notes for this slice, kept for the reasoning behind the split:**

Lazy DOM (O-1), lazy content (O-2), defer `InfoWindow` setup (O-10), shared zero-offset (O-11).

**Bigger than the audit made it look.** `Overlay.ts` has **42** `this.#overlay` references, not
the handful implied by "build the element lazily". Four are the constructor, one is the public
`getOverlayElement()`, and the rest are spread through `className`, `removeClassName`, `style()`,
the drag setup, resize-handle creation and teardown, the drag and resize handlers, `remove()` and
`#setupGoogleOverlay`. Most are of the form `this.#overlay.style.x = …`, so **a missed call site
fails at runtime with `undefined.style`, not at compile time**, and the jsdom tests only cover a
fraction of the drag and resize paths.

Note also that lines ~1338-1364 use `#overlay` for something else entirely — the private field
inside the hoisted `OverlayView` class, which holds the `Overlay` instance rather than the
element. Worth not conflating when converting.

**Suggested split:** do O-2 and O-11 first. Lazy content is most of the attach-time win at 2,595
segments (it's an `innerHTML` parse per overlay) and both are small and low-risk. Leave the full
lazy-DOM conversion (O-1) until the drag and resize paths have test cover, so a missed reference
is caught by something other than a user.

**Expected:** the headline win. Attach cost for thousands of tooltips/popups drops to near zero,
and per-object allocation falls across the whole library.

---

### What is left, in one table

Phases 0-3 are done. From Phase 4, D-2 landed on 2026-09-16 and **the rest of Phase 4 was skipped
by decision on the same day** — see the Phase 4 section. P-1 from Phase 5 landed on 2026-09-16,
and L-4 and L-7 from Phase 6 landed on 2026-09-16. O-3 from Phase 7 landed on 2026-09-16 and is
**on by default**, which is a change from the opt-in-only decision recorded in section 7.
From Phase 7, D-8 landed on 2026-09-16, and B-1 was **measured and found to buy nothing in this
build** — the declaration was added as a safeguard, but the tree-shaking win it promised is not
available without a build change. **B-2 was skipped by decision on 2026-09-16**, but only after its
measurement was corrected and a flaw in its prescribed approach was found. See the Phase 7 section.
Phases 4-7 were re-examined on 2026-09-16 after Phases 0-3 landed, and each item was re-tested
against one question: **is this worth doing, and what is the evidence?** The phase numbers are
unchanged so that references elsewhere in this plan still resolve.

| Do now — no measurement needed | Phase | Why |
|---|---|---|
| ~~D-8 geocode caching and dedupe~~ **done 2026-09-16** | 7 | Costs **money**, not milliseconds |
| ~~D-2 data-layer coordinate conversion~~ **done 2026-09-16** | 4 | Bad code, not slow code |
| ~~B-1 `sideEffects` array (never `false`)~~ **added 2026-09-16, buys 0 bytes** | 7 | Re-measured: the field changes nothing in a single-file build |
| ~~P-1 skip Google wiring for internal events~~ **done 2026-09-16** | 5 | Pure waste; a five-line guard |

| Worth doing, moderate effort | Phase | Why |
|---|---|---|
| ~~L-4 skip redundant `setPath`~~ **done 2026-09-16** | 6 | `setPath` is the expensive half of a tolerance change |
| ~~L-7 skip the dashed/icon pass~~ **done 2026-09-16** | 6 | A promise, a microtask and a no-op Google call per polyline |
| ~~O-3 shared tooltip~~ **done 2026-09-16, on by default** | 7 | 2,595 divs to one, and it largely obviates O-1 |
| ~~B-2 split out `markerclusterer`~~ **skipped 2026-09-16** | 7 | Re-measured: 14.3% of the browser bundle |

| Struck, with reasons | Phase |
|---|---|
| C-4 drop `#boundValues` | 4 |
| P-4 `Promise.all` control conversions, P-5 setter batching | 5 |
| L-2 chunked scheduler, L-6 O(n²) teardown, L-12 cache cap | 6 |
| O-1 lazy overlay DOM (**groundwork done 2026-09-16 — ready to reconsider, see Phase 3**), O-10 `InfoWindow` deferral | 3 |
| L-1 viewport culling | 6 |

Everything not listed above is **gated on a real-device profile**. Section 10.1 is the reason:
nothing in this plan has been measured on the iPhone that motivated it, and the harness
structurally cannot measure the things that matter most.

**Three items were invalidated by work already done**, which is the main argument for
re-examining a plan rather than working through it: P-1's headline cost was removed by Phase 2,
L-6's path was changed by Phases 2 and 3, and L-12 is pre-empted by L-3.

---

### Phase 4 — Bounds and numeric paths

**C-4 is dropped. Do not reinstate it.** The plan was to stop keeping `#boundValues` and build
the Google bounds from the maintained corners instead. That is the wrong trade, for three reasons:

1. **It makes a known-shaky calculation authoritative.** `LatLngBounds` delegates to Google at
   **twelve** points once `#bounds` exists — `contains`, `equals`, `extend`, `getCenter`,
   `getNorthEast`, `getSouthWest`, `intersects`, `isEmpty`, `toJson`, `toString`, `toUrlValue`,
   `union`. The manual corner arithmetic is only a fallback for questions asked *before* the
   Google library loads, and once the Google object is built from the replayed points, any error
   in our maths is discarded. Dropping the point list flips that: our corners become the only
   input Google ever sees, so every error becomes permanent.
2. **That arithmetic has already produced two bugs.** `getCenter()` returned the antipodal
   longitude for a wrapped bounds (§6.7, shipping until Phase 2), and `#extend()` still collapses
   any span wider than 180 degrees because it always takes the smaller extension. The second one
   is harmless today *because* the point list exists. C-4 would promote it to load-bearing.
3. **The win is unmeasured and may be zero.** It saves one literal per point, which only matters
   if something extends a bounds over a very large number of points. Nothing has shown that
   happens outside `polyline-simplify.js`, which is a test page.

Paying a correctness risk on shaky code for an unmeasured win fails on all three axes.

**Follow-up worth considering instead (not scheduled):** shrink the fallback rather than grow it.
Two bounds engines live in this class and the harder one barely runs. If a bounds is only ever
*queried* after Google loads — the normal flow, since `Map.fitBounds` and `DataLayer.#bounds` both
run post-load — most of those twelve manual branches could go. That is a simplification with a
correctness upside, which is the opposite trade from C-4. It touches public synchronous methods,
so it needs its own decision.

**D-2 — DONE 2026-09-16, on clarity grounds. Not measured, and not claimed to be faster.**

The problem as written: `DataLayer.#toPositions` was `path.map(latLng).filter(isValid).map(toGoogle)`
— three intermediate arrays and two objects per point, when `google.maps.Data.LineString` accepts
plain `{lat, lng}` literals and needs neither. `#toRings` built a throwaway `LatLng` purely to
*test* whether `paths[0]` is a position. This was bad code rather than slow code.

**The load-bearing check, done before any edit.** Dropping `toGoogle()` is only safe if Google
takes literals. Verified in `node_modules/@types/google.maps/index.d.ts`: `Data.LinearRing` (7019)
and `Data.LineString` (7048) both take `(google.maps.LatLng | google.maps.LatLngLiteral)[]`, and
`Data.Polygon` (7194) takes `(LinearRing | (LatLng | LatLngLiteral)[])[]`.

**What changed** (`src/lib/DataLayer.ts`):

- `#toPositions` is a single `for` loop pushing `{lat: value.latitude, lng: value.longitude}`.
  Returns `google.maps.LatLngLiteral[]`.
- `#toRingPositions` now delegates to `#toPositions` and compares the first and last positions as
  plain numbers instead of going through `LatLng.equals()`. The GeoJson closing-position drop is
  unchanged in behavior.
- `#toRings` replaces the throwaway-`LatLng` probe with a shape test: an array first element of
  length 2 whose two values are numbers is a position, so the value is one ring; any other array
  is an array of rings; a non-array can only be a position. Same answers as the old probe,
  including for garbage input, without running `LatLng`'s type dispatch.

**Two deliberate deviations from the item as written:**

1. **`addPoint` still uses `toGoogle()`.** It converts one position per call, so there is nothing
   to save, and changing it would only widen the diff. D-2's value is entirely in the per-point
   loops.
2. **`#toRingPositions` keeps its own identity** rather than being folded into `#toPositions`,
   because only rings drop a repeated closing position.

**Testing — this was untested code before this change.** `DataLayer` had no tests at all, and the
stub had no `Data` namespace, so the change could not have been caught by anything. Both were
fixed:

- `test/support/googleMaps.ts` gained a `Data` stub extending `MVCObject` (required — `#setDataObject`
  hands it to `setEventGoogleObject`), with `add`/`remove`/`contains`/`forEach`/`getFeatureById`/
  `setStyle`/`overrideStyle`/`revertStyle`/`addGeoJson`/`loadGeoJson`/`toGeoJson`, a
  `DataFeatureStub` with the property and geometry methods, and the geometry classes `Data.Point`,
  `Data.LineString`, `Data.LinearRing` and `Data.Polygon` as recording statics. Adding the `Data`
  key is also what makes `checkForGoogleMaps('DataLayer', 'Data', false)` pass, so a `dataLayer()`
  with no options builds its Data object immediately and the tests need neither a map nor the loader.
- `test/DataLayer.test.ts` — 15 tests asserting the *shape* handed to Google: literals not `LatLng`
  objects, every accepted position form, invalid positions filtered, the GeoJson closing-position
  drop, a ring that legitimately ends elsewhere, single-ring vs array-of-rings discrimination, and
  both minimum-position errors. Two of them assert `mapsStats.countOf('LatLng') === 0` over 500-
  and 300-point inputs, which is the actual regression guard: it goes red the moment anything
  reintroduces a `google.maps.LatLng` per point.

**Gates:** 463 tests pass (448 before, +15), `tsc --noEmit` exit 0, `eslint ./src` exit 0.
Per §10.1 this proves work was *avoided*, not that anything got faster.

**Gated on the profile — everything else in this phase.**

**Correction, 2026-09-16.** This section previously said the only known large bounds call was in
`polyline-simplify.js`, a test page. **That was wrong**, and it was the sole reason C-5 and D-3 were
gated. Two real callers exist:

1. **`DataLayer.#bounds()`** (`DataLayer.ts:1263`) walks *every coordinate of every feature* through
   `bounds.extend(latLngConvert(googleLatLng))`. It runs on `getBounds()`, on `fitBounds()`, and on
   any `addGeoJson()`/`loadGeoJson()` with `fitBounds: true`. A detailed boundary or trail GeoJson is
   tens of thousands of coordinates, and this is ordinary usage, not a test page.
2. **`Map.addToBounds()`** (`Map.ts:979`) is public API taking `LatLngValue | LatLngValue[]`, and
   `extend()` builds a `LatLng` per entry. An application fitting the map to its marker positions
   goes through here.

So the question is no longer "does a large caller exist" — it does — but "is the saving large enough
to be worth the code". `site-src/bounds-bench.njk` was built to answer exactly that.

| Item | What it buys | Status |
|---|---|---|
| C-5 `extendNumeric()` | One `LatLng` per point | **Measurable now.** Scenarios A and B on the benchmark page |
| D-3 numeric `#bounds()` | A `LatLng` per coordinate of every feature | **Measurable now.** Scenario A. The largest real caller |
| C-15 memoize corner getters | One `LatLng` per `getNorthEast`/`getSouthWest` call | **No caller.** Only `intersects()` reads them repeatedly — four times in one call, which is not a loop |
| C-17 `containsCoords()` | One `LatLng` per `contains()` call | **No caller.** The justifying loop was viewport culling, struck in 5.4.1. Applies only to *application* code that loops `contains()` |

**C-15 and C-17 cannot be rescued by a benchmark**, and the page says so on its face. Manufacturing a
loop to measure them would be measuring code nobody runs. They stay struck unless a real caller
appears — for C-17, that means the user's own application code, which is why the page offers scenario
C while stating plainly that the library itself no longer does this.

**How the page avoids justifying work that isn't worth doing.** Two deliberate constraints:

- It times **library operations** (`dataLayer.getBounds()`, `map.addToBounds()`), never
  `bounds.extend()` in a tight loop. A primitive micro-benchmark over millions of points produces an
  impressive number regardless of whether any real path does that, which is precisely the trap that
  produced C-4.
- Since the optimizations don't exist, there is nothing to A/B. Each scenario instead runs a
  **numeric floor** — the same coordinates reduced with `Math.min`/`Math.max` over a `Float64Array`,
  allocating nothing — and reports the gap as a **ceiling** on the possible saving. **That ceiling is
  unreachable:** Google's `forEachLatLng()` hands back a `google.maps.LatLng` per coordinate whatever
  this library does, so D-3 can drop the `latLngConvert()` wrapper and the stored literal but not
  Google's object. The real change lands below the number shown.

**The decision rule the page applies**, stated in terms of the saving rather than the total, because
a 400 ms operation is irrelevant if only 3 ms of it is recoverable:

| Ceiling on the saving | Verdict |
|---|---|
| Under 5 ms | Not worth doing. Leave struck |
| 5–50 ms | Only if it also simplifies the code. Judge on the code, not the clock |
| Over 50 ms | Worth doing |

**Run it on the iPhone, not the Mac.** Per §10.1, a desktop number decides nothing for the device
that motivated this plan.

**Decision, 2026-09-16: the rest of Phase 4 is skipped.** C-5, C-15, C-17 and D-3 are not being
done. The benchmark page stays in the repository, so if a data layer ever feels slow on a real
device the measurement is one page load away rather than a fresh investigation. Nothing else in
the plan depends on these items.

### Phase 5 — Map ready/init machinery

**This phase shrank the most on re-examination.** Its headline finding was already fixed as a side
effect of Phase 2, and several items turned out to be per-*map* costs rather than per-object ones
— and there is only ever one map.

**P-1 — DONE 2026-09-16.**

P-1's main claim was that every `onReady()` re-runs `google.maps.event.hasListeners`, a real call
across the Google API boundary, once per marker. **That call no longer exists.** Phase 2 removed
it when scoping `clearListeners`: `#on()` now checks its own `#googleListeners[type]` instead.

What survived, and what shipped: **skip the Google-wiring block for the library's own event types.**

**What changed:**

- `constants.ts` gained `INTERNAL_EVENTS`, a frozen list of the event names this library dispatches
  itself: `ready`, `locationfound`, `locationerror`, `initialized`.
- `Evented.#on()` skips the whole Google/pending block for those types — one added condition.

**Three corrections to the item as written:**

1. **`Map.ts:59` could not be reused.** The plan said it "already declares exactly that list". It
   declares `type InternalEvent = 'locationerror' | 'locationfound' | 'ready'` — a **TypeScript
   type, with no runtime value**. A real constant had to be added. It lives in `constants.ts` beside
   `READY_EVENT`, which imports nothing, so there is no cycle.
2. **`initialized` was missing from the list.** `AdvancedMarker.ts:916` dispatches it and line 852
   listens for it. It is not a Google event, so it belongs with the other three.
3. **The waste was usually worse than a dead listener.** Objects listen for `ready` *before* their
   Google object exists, so the entry went into `#pendingMapObjectEventListeners` and
   `setEventGoogleObject()` later turned it into the dead native listener. The guard removes both
   the queue entry and the listener.

**The scoping hazard, and why the list is short.** It is tempting to add every event the library
dispatches itself — the overlay's `dragstart`, `drag`, `dragend`, `resize*`, `open`, and the data
layer's `load`. **That would be a correctness bug.** `INTERNAL_EVENTS` is consulted by `Evented`,
which has no idea what kind of object it belongs to, and `dragstart`/`drag`/`dragend` are *real
Google events on Marker and Map*. Excluding them globally would stop markers being draggable. The
list therefore holds only names that no Google object fires. The cost of that choice is a dead
listener on overlays; the cost of the alternative is broken marker dragging.

**Also checked:** `Loader` is out of scope entirely — it extends `EventTarget`, not `Evented`
(`Loader.ts:28`), so `LoaderEvents.LOAD`/`MAP_LOAD` never reach this code path.

**Testing.** Seven tests added to `test/Evented.test.ts`, covering: no Google listener for `ready`
when the Google object is already set; nothing queued when it is not, and none appearing when it
arrives; `ready` still reaching its callback through `dispatch()`; all four internal types skipped;
and — the regression guard for the hazard above — `click`, `dragstart`, `drag`, `dragend` and
`bounds_changed` still wiring, with a Google event still reaching its listener.

**Gates:** 470 tests pass (463 before, +7), `tsc --noEmit` exit 0, `eslint ./src` exit 0.
Per §10.1 this proves work was *avoided*, not that anything got faster.

**Gated on the profile.**

| Item | Why it is gated |
|---|---|
| P-2 shared `#readyPromise` | Cheap and safe, but the cost is one promise per waiter and nothing has shown that list is long now that markers create lazily |
| P-6/P-7 loader singleton promise | `Loader.on()` was fixed in Phase 2 to dispatch the requested type. What remains is that registering a load listener after load still dispatches to everyone. Worth a shared promise, unproven |
| P-8 `convertControlPosition` lookup tables | Six `Object.entries()` scans per map options build |
| P-9 cache `center`/`zoom`/`mapTypeId` | Real per-read cost, but the known hot caller was per-polyline `idle` handling, which L-5 addresses more directly |
| P-10 styles caching | Only bites when the hide-feature shortcuts are toggled |

**Struck — P-4 and P-5.**

- **P-4** (`Promise.all` the six control conversions) is a per-map cost. Six promises, once. Micro.
- **P-5** (setter batching) was approved earlier and should not be done. There is **one** map
  object. Batching saves a handful of `setOptions` calls in exchange for making every map setter
  land at end-of-microtask — a real, user-visible timing change for a negligible win. If async
  control setters landing out of order relative to synchronous ones is a genuine bug, fix that
  directly rather than by changing when every setter applies.

### Phase 6 — Polyline leftovers

**L-4 and L-7 — DONE 2026-09-16.** Both were small, self-contained, and had no API surface.

**L-4 — skip `setPath` when the drawn path is unchanged** (`Polyline.#applySimplify`).

`setPath` used to run on every tolerance change, and the only skip was when the tolerance itself
was unchanged. A different tolerance very often draws the same points: a short segment simplifies
to its two end points at every tolerance, so a map full of short segments re-sent identical paths
on every zoom bucket change.

`Polyline.#isSamePath()` compares the point count first and only then goes point by point, as the
plan called for.

**The part worth recording is what it compares against.** The obvious approach — keep the path
last handed to Google in a field — would retain an extra array of references for the life of every
polyline. At roughly 8 bytes per point across a 1,400-polyline trail map that is real memory spent
to save a call. It isn't needed: when tolerances vary by zoom, `#simplifiedPaths` **already** holds
the path for every tolerance visited, so the currently drawn path is `#simplifiedPaths[oldTolerance]`.
The comparison uses that and stores **nothing new**.

Where there is no kept path for the old tolerance — it was 0, or zoom buckets aren't in use —
`drawnPath` is `undefined` and the path is sent exactly as before. `#simplifiedPaths` is also
cleared whenever the path itself changes (`#setPathCoords`) or the `simplify` setting changes, so
a genuine path change always sends. `#applySimplify()` still returns `true` whenever the tolerance
changed, so its one caller that reads the return value is unaffected.

**L-7 — skip the dashed/icon pass for a plain polyline** (`Polyline.#createPolylineObject`).

Every polyline used to run `#setupIconsAndDashedPolylineOptions()`, which for a plain polyline
resolves to the `strokeOpacity` the constructor had already set plus an empty `icons` array — then
called `setOptions` with it. It cost a promise, a microtask hop and a Google call that changed
nothing, and held up `setEventGoogleObject` for a tick. A polyline that is neither dashed nor
carrying icons now skips it and wires its events up immediately.

The one behaviour difference: when `strokeOpacity` isn't set, the skipped pass used to send `1`
explicitly, which is what Google uses anyway, so the drawn result is identical.

**Testing.** The two Phase 0 tests that documented this waste were rewritten to lock in the skips,
plus cases that must still send so the skips can't get greedy: a long path whose geometry really
does differ between buckets, a path change, a polyline with icons, and a dashed polyline.

**A harness gap found while doing this, worth knowing before writing more polyline tests.** The
dashed pass **cannot complete under the test stub**. It builds an `SvgSymbol`, and
`SvgSymbol.toGoogle()` (`SvgSymbol.ts:471`) waits on `loader().onLoad()`, which nothing drives in
the tests — so the promise never settles and `setOptions` is never reached. This is not new and is
not caused by L-7; it means any assertion about what a dashed polyline sends to Google will fail
for the wrong reason. The dashed test therefore asserts the *branch taken* (events deferred rather
than immediate), which is what L-7 actually controls. Driving the loader in the stub would be a
genuine improvement to the harness.

**Gates:** 499 tests pass (492 before, +7), `tsc --noEmit` exit 0, `eslint ./src` exit 0.

**Gated on the profile.**

- **L-5** — one shared zoom broadcaster per map instead of an `idle` listener per polyline. Every
  polyline currently calls `getZoom()` across the Google boundary on every **pan**, not just
  every zoom. Good change, but it needs a profile to confirm panning is actually where the cost
  lands.
- **L-10** — additive `getPathCoords()`/`pathLength`, so counting points doesn't materialise
  millions of `LatLng` objects. Purely additive, but it only matters if consumer code reads
  `.path` for its length, which is a trap nobody has confirmed is being hit.
- **L-11** — faster `coordsFromPath`. Real per-point cost on ingest, unmeasured.

**Downgraded — L-3.** The plan treated the significance array as this phase's headline, and that
overstates it. The measured 200-230 ms is the cost of the **first** crossing of each zoom bucket;
`#simplifiedPaths` already caches per tolerance and there are four buckets, so the real exposure
is roughly four hitches per session, not one per zoom. It is also the only change here that can
alter `simplifyPath()`'s public output (see 8.2). Still worth doing eventually — it removes the
per-tolerance cache along with the recomputation — but it is not the top of this list.

**Struck — L-2, L-6 and L-12 as written.**

- **L-2** (chunked scheduler) was built in another session and forced non-opt-in async semantics:
  zoom-tolerance updates became a beat after `idle`, which broke existing expectations. See 5.4.1.
- **L-6** (O(n²) teardown) described `Evented.off()` rescanning the listener array per removal.
  Phase 2's per-handle `#googleListeners` and Phase 3's lazy containers changed that path; the
  finding needs re-measuring before it means anything.
- **L-12** (cap the tolerance cache) is pre-empted by L-3, which deletes the cache outright.
  Scheduling both double-counts the same memory.

### Phase 7 — Structural, plan deliberately

**D-8 — DONE 2026-09-16.**

`Geocode` built a new `google.maps.Geocoder` per request, cached nothing, and did not dedupe
identical concurrent lookups. Geocoding a list with duplicates billed for every one of them. This
is the only item in the plan that costs **money** rather than milliseconds, and it needed no
profile to justify.

**What changed** (`src/lib/Geocode.ts`):

- **One shared `Geocoder`**, built lazily at module scope. It holds no per-request state, and
  building it lazily means importing the file doesn't reach for the Google library.
- **A cache holding the promise, not the result.** That single choice covers both halves of the
  item: a repeat request gets the settled promise, and a request made while an identical one is
  still in flight gets that same pending promise. Google is called once either way.
- **`cache: false`** per request, **`Geocode.cacheSize`** (default 50, `0` disables caching
  everywhere) and **`Geocode.clearCache()`**, which also drops the shared `Geocoder`.
- **Failed lookups are evicted.** `request.catch()` removes the entry, so one bad response isn't
  remembered for the life of the page. The caller still receives the rejection from the promise it
  was handed, so nothing is swallowed. `ZERO_RESULTS` is *not* treated as a failure — it is a real
  answer and stays cached.

**The cache key** is built from the object's own values, not from the Google request, because the
Google request holds `LatLng` and `LatLngBounds` objects that don't serialise usefully. Bounds are
read through `getNorthEast()`/`getSouthWest()`, which work before the Google library has loaded.
The key distinguishes address, place id, location, language, region, component restrictions and
bounds; the same location written `[1, 2]` and `{lat: 1, lng: 2}` produces one key, which is the
intended behaviour.

**Known sharp edge, not fixed:** cached callers receive the *same* `GeocodeResults` object, and
`getResults()` returns its internal array by reference. A caller that mutates it affects everyone.
Results are read-only in practice, so this is recorded rather than defended against.

**Testing.** `test/Geocode.test.ts` — 22 tests, none of which measure time. Every assertion on
`callsTo('Geocoder', 'geocode')` is an assertion about a bill: one `Geocoder` across many
requests; repeat and concurrent dedupe; separate `Geocode` objects sharing one lookup; the key
discriminating language, region, restrictions and bounds; `cache: false`; `cacheSize = 0`; cap
eviction and lowering the cap; `clearCache()`; and a rejected lookup not staying cached while
`ZERO_RESULTS` does. The stub gained a `Geocoder` that answers on a microtask, because a
synchronous answer would not exercise the in-flight case, plus `GeocoderStatus` and a settable
response handler that resets on install.

**Gates:** 492 tests pass (470 before, +22), `tsc --noEmit` exit 0, `eslint ./src` exit 0.

**B-1 — the declaration was added on 2026-09-16, and it buys nothing. The original claim was
wrong.**

`"sideEffects": ["**/Popup.*", "**/Tooltip.*", "**/InfoWindow.*"]` is now in `package.json`. It
does **not** recover the 100.6 KB, and the plan was wrong to say it would.

**The measurement.** An entry importing only `latLng` from `dist/index.esm.js`, bundled with
esbuild under three variants:

| `sideEffects` | bundle | `attachPopup` present | `MarkerClusterer` present |
|---|---|---|---|
| absent | 105,021 B | yes | yes |
| the array above | 105,021 B | yes | yes |
| `false` | 105,021 B | yes | yes |

**Byte-identical.** The reason is the build, not the field: `tsup.config.js` uses `splitting: false`
with a single entry, so the published ESM is **one module**. `sideEffects` works at *module*
granularity — it tells a bundler which modules are safe to drop whole. There is only one module
and it is imported, so nothing is dropped and the field is never consulted meaningfully. The
100.6 KB is a consequence of single-file bundling.

**Why the declaration was added anyway.** It is free, it is forward-correct (the globs match
`dist/lib/Popup.js` if per-module output ever lands), and it makes the §8.1 hazard explicit in the
file where someone would otherwise type `"sideEffects": false`.

**The real fix, not done:** emit per-module ESM (tsup `splitting` with multiple entries, or
`preserveModules`) so the field has something to act on. That is a structural build change with
its own risks — `dist/` shape, `exports` map, and the §8.1 breakage becoming live rather than
theoretical — and it should be decided on its own, not smuggled in under B-1.

**Never `"sideEffects": false`** — see 8.1. Note the measurement above shows `false` is harmless
*today*, which makes it more dangerous rather than less: it would sit in the file looking correct
until the day the build starts emitting separate modules.

**O-3 — DONE 2026-09-16, and on by default. B-2 skipped.**

- **O-3 shared tooltip. Not for popups.** Every `Tooltip` still builds a div in its constructor, so
  2,595 segments meant 2,595 detached divs plus objects and offsets. One shared tooltip collapses
  that to one. **O-3 largely obviates O-1** — but note what it does and doesn't do: it does *not*
  make the element lazy, it makes there be **one element instead of 2,595**. O-1 would still be
  needed to build that one element lazily, and is worth much less now.

  **What changed** (`src/lib/Tooltip.ts`):

  - A module-scope shared `Tooltip`, built on first use by `Tooltip.getShared()`, with
    `Tooltip.clearShared()` to drop it.
  - `Tooltip.useShared` (**default true**) and a third `attachTooltip()` parameter,
    `{ shared: false }`, to opt a single call out. Both, not one or the other — see the settled
    question in section 13. The global is what makes it usable, since the common call form is a
    bare string with nowhere to put a flag.
  - A `WeakMap` of per-object values, applied on **every show** through `#tooltipFor()`. This is
    what answers the hazard recorded in section 7: one object's content can't be left showing for
    another, because each object's own value is put back before it's shown.
  - **`#isAttached` became a per-target `WeakSet`.** This was the load-bearing change. It was a
    single boolean, so one shared tooltip attached to 2,595 polylines would have wired its
    listeners for the **first one only** and silently done nothing for the rest — a runtime-only
    failure with no error. There is a dedicated test for it.
  - Passing an actual `Tooltip` object to `attachTooltip()` bypasses sharing entirely, whatever
    `useShared` says. The caller clearly meant that object.

  **The default flip, and why it broke less than section 8.2 expected.** The value is applied at
  *attach* time as well as on every show, so `attachTooltip('Marker 1').content` is still
  `'Marker 1'` and the documented single-object contract survives — the existing test asserting it
  passes unchanged. Three real behaviour changes remain:

  1. **`clickon` can only keep one tooltip open at a time.** Previously each object held its own
     open. This is a functional change, not just a return-value one, and is the one most likely to
     surprise someone.
  2. `attachTooltip()` returns the shared tooltip, so changing it changes every sharer.
  3. Option stickiness: `setOptions` only replaces the keys it's given, so a `className` set by one
     object persists for the next. This is inherent to sharing and is **not** fixed by keeping a
     separate tooltip per type — it happens between two markers just as readily as between a marker
     and a polyline, which is why sharing is global rather than per type.

  **Testing.** 11 tests, including the per-target listener guard above, markers and polylines
  sharing one instance, both opt-out routes, the `Tooltip`-object bypass, and lazy construction.
  One harness note: the shared instance lives at module scope, so `Tooltip.clearShared()` belongs
  in `afterEach` or one test's content bleeds into the next.

  **Gates:** 510 tests pass (499 before, +11), `tsc --noEmit` exit 0, `eslint ./src` exit 0.
- **B-2 — SKIPPED by decision on 2026-09-16.** Two things were established before it was dropped,
  and both should be read before anyone reopens it.

  **The size was overstated.** Re-measured by bundling `src/browser.ts` with esbuild exactly as
  `tsup` does, once normally and once with `@googlemaps/markerclusterer` left out:

  | bundle | bytes |
  |---|---|
  | full, as shipped | 169,946 |
  | without `markerclusterer` | 145,720 |

  That is **24,226 bytes, 14.3%** of the browser bundle — not the 29,835 bytes / 18% recorded
  earlier, which came from counting minified string literals and could not be reproduced (the
  bundle is minified, so `MarkerClusterer`, `GridAlgorithm` and `markerclusterer` appear zero
  times in it). The item was still real: 24 KB is genuine weight on every consumer who never
  clusters.

  **The prescribed approach does not work.** "A second bundle avoids changing `markerCluster()`'s
  signature" is true only for a bundle that *replaces* `browser.js`, not one loaded alongside it.
  `MarkerCluster.ts` uses `Map`, `Marker`, `Base` and `loader` at runtime, so an add-on IIFE would
  bundle its own copies of them. The page would then hold **two different `Map` classes**, and
  every `instanceof` check across the boundary would fail. Any future attempt needs one of:

  1. **Two alternative full bundles** sharing a common `browserGlobal.ts`, so only one is ever
     loaded. Works, but changes which file clustering consumers load.
  2. **A registration hook**, where `MarkerCluster.ts` stops importing `markerclusterer`
     statically and a second script injects it. This keeps one bundle but leaks into the ESM
     build, where npm consumers would have to register it too — a breaking change for them.
  3. **Dynamic `import()`**, which makes `markerCluster()` async. That is the signature change the
     original note was trying to avoid.

  The blocker was never technical. It is that every workable shape moves a cost onto somebody:
  existing clustering consumers, npm consumers, or the API. That is a packaging decision, not a
  performance one.

**Gated on the profile — D-4 to D-7.** Feature-array caching, the `#enqueue` fast path and chunked
post-load all scale with feature count, and no data-layer workload has been profiled. D-4's
eager-`DataFeature` half is also already partly addressed by Phase 3 Slice B, since most of what a
`DataFeature` allocated was `Evented` containers.

**Gated — O-9 listener delegation.** The largest design change in the plan and the least evidenced.

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
- **There is no way to read back the element a `Map` was built with.** `#element`
  (`Map.ts:145`) has no public accessor — it is only used internally at `:1868`, `:2230`,
  `:2299` and `:2322`. `getDiv()` (`Map.ts:1363-1368`) looks like the accessor but is not: it
  returns the **Google** map's div, and `undefined` until the map has actually rendered. So
  `map.getDiv()` on a configured-but-unrendered map returns nothing, and the element/selector
  forms are indistinguishable from outside. Noted because it cost a wrong assumption while
  writing `test/Map.test.ts`, and an `getElement()` accessor would be additive and cheap.
- ~~**`disableDrag()` leaves the drag outline on the element.**~~ **Fixed 2026-09-16.** Enabling
  dragging set `cursor`, `pointerEvents` and a `2px solid #007bff` border, but the disabled branch
  only reset the first two, so an overlay kept a blue outline after `disableDrag()`. The fix turned
  out to be two changes rather than one, because **resizing draws the same outline**:
  `#setupDragHandlers` now clears the border only when resizing isn't using it, and
  `#removeResizeHandles` only when dragging isn't. The second half was a mirror of the same bug
  that nobody had noticed — `disableResize()` used to take the outline off an overlay that could
  still be dragged. Both directions have tests.
- ~~**The test harness can't reach resize movement.**~~ **Fixed 2026-09-16** — see the O-1 notes
  in Phase 3.

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

3. **Shared tooltip (O-3) — ~~opt-in flag~~ on by default.** Revised 2026-09-16 when the work was
   done: the default was flipped to shared at the user's direction, with `Tooltip.useShared` and a
   per-call `{ shared: false }` to opt out. See Phase 7 for what that changes.

4. **Viewport culling (L-1) — dropped.** Attempted in a separate session the same day and
   abandoned; that conclusion is correct and the plan now agrees with it rather than
   re-proposing the work. Full reasoning in 5.4.1. Opt-in only if it is ever revisited.

### Still worth deciding, but not blocking

- ~~**Where the shared-tooltip opt-in lives**~~ — **settled 2026-09-16: both.** A global
  `Tooltip.useShared` (default true) plus a per-call `{ shared: false }` override. The global is
  what makes it usable, because the common call form is a bare string — `attachTooltip('Trail 12')`
  — which has nowhere to put a per-call flag, so a per-call-only option would have meant editing
  every call site to get the win.
- **Whether `polyline.path` should keep caching forever** (L-10). The additive
  `getPathCoords()`/`pathLength` accessors are safe and planned; changing the caching behavior of
  `.path` itself is the part that needs a call.
