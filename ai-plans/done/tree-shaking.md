# Plan: Make the library tree-shakeable

Status: **Phases 1-3 and 5 done. Phase 4 (the breaking root-barrel change) is 1.0.**
Created: 2026-09-18
Target: `src/index.ts`, `package.json`, `tsup.config.js`, `src/lib/Popup.ts`, `src/lib/Tooltip.ts`,
`src/lib/InfoWindow.ts`

Related: `../active/plugin-architecture.md` (its delivery section depends on the outcome)

---

## 1. The finding

**Today every consumer gets the entire library regardless of what they import.** Measured with
esbuild, bundled and minified:

| Imported | Bundle |
|---|---|
| `latLng` only, from `dist/index.esm.js` | 112,741 |
| `map` only | 112,759 |
| `map`, `marker`, `popup`, `tooltip` | 112,804 |
| `latLng` only, from `src/index.ts` (source) | 112,722 |

An 82-byte spread across all four.

**The cause is three export statements.** `src/index.ts` re-exports `Popup`, `Tooltip` and
`InfoWindow`; each of those modules runs `Layer.include(...)` / `Map.include(...)` at the top level
(`Popup.ts:1137-1138, 1211-1212`, `Tooltip.ts:852-853, 926-927`, `InfoWindow.ts:878-879`); a bundler
must keep a module with top-level side effects; and keeping them retains `Layer`, `Map`, `Overlay`
and most of the graph behind them.

Removing only those three statements from the barrel, changing nothing else:

| Imported | Before | After |
|---|---|---|
| `latLng` | 112,722 | **3,221** |
| `map` + `marker` | 112,740 | **70,049** |

The rest of the module graph already shakes perfectly. Nothing in the core imports Popup, Tooltip or
InfoWindow at runtime — `Layer.ts:11` and the `TooltipValue` imports in `Marker`, `Polyline` and
`AdvancedMarker` are all type-only positions, which the compiler already elides.

---

## 2. What a shakeable library would cost consumers

Measured by importing modules directly, which is what a fixed barrel would give:

| What is used | Size | vs. today |
|---|---|---|
| `latLng` | 3,221 | −97% |
| `map` | 60,974 | −46% |
| `map` + `marker` | 70,049 | −38% |
| `map` + `marker` + `tooltip` | 86,336 | −23% |
| `map` + `marker` + `popup` | 102,774 | −9% |
| `map` + `marker` + `popup` + `tooltip` | 107,063 | −5% |
| + `polyline` | 107,100 | −5% |
| Everything | 112,740 | — |

Marginal costs over a `map` + `marker` baseline: **tooltip +16.3 KB, popup +32.7 KB, both together
+37.0 KB** — they share `Overlay` and `OverlayAttachment`, so the second one is nearly free.

**The decisive number: on top of `map` + `marker` + `polyline` + `popup` + `tooltip`, everything else
in the library combined costs 5,640 bytes.** Geocode, DataLayer, MarkerCluster, ImageOverlay,
InfoWindow, AutocompleteSearchBox, PlacesSearchBox, AdvancedMarker — all of it, 5.6 KB, because
almost all of their weight is `Map`, `Layer` and `Overlay`, which are already there.

---

## 3. What this means for "move optional components into plugins"

**It removes the reason to.** The proposal was to make components like `AutocompleteSearchBox`,
`ImageOverlay`, `PlacesSearchBox` and `InfoWindow` opt-in so the base library could be smaller. The
numbers say:

- Those components are not what is big. Together they are a rounding error next to `Popup` and
  `Tooltip`.
- The genuinely expensive modules are the two that nearly everybody uses, so making them opt-in
  moves cost onto almost every consumer's import list to save the few who use neither.
- **Once the barrel is fixed, a root-exported module that nobody imports costs nothing.** There is no
  size argument left for relocating anything.

So: fix tree-shaking, and leave the component layout alone. The core-vs-plugin question then rests
entirely on the headless contract — does it decide what things look like — which is where it belongs,
rather than on bundle size.

Two caveats:

- **The browser build is unaffected.** `dist/browser.js` is an IIFE and is all-or-nothing by nature.
  If standalone-script users need a smaller file, that needs separate browser bundles, which is a
  real argument for shipping some things as separately loadable files — but it is an argument about
  the *browser build only*, not about where the source lives.
- **New plugins are still better off as subpath imports**, because anything that registers itself by
  side effect re-creates exactly the problem described here if it is re-exported from the barrel.

---

## 4. What it would take

### The two options can, and should, both be done — in sequence

They are not alternatives. **B is the migration on-ramp to A.**

| | What | Breaking? | When |
|---|---|---|---|
| **B** | Add a narrow entry, `@aptuitiv/gmaps/core`, that excludes the three side-effect modules, plus `@aptuitiv/gmaps/popup`, `/tooltip` and `/infowindow` to import them from. Root unchanged | No | Before 1.0 |
| **A** | The root barrel stops re-exporting the three. It becomes what `/core` was | Yes | 1.0 |

Doing B first means anyone who wants the saving can take it immediately, and — more importantly —
**they are already writing the explicit `popup` / `tooltip` imports that A will later require.** Their
1.0 upgrade is then a one-line change: `/core` back to the root. Without B, every consumer meets that
migration for the first time on upgrade day.

End state for `/core` after A lands: it becomes an alias of the root, documented as deprecated, and
removed at 2.0. That is the cost of doing both — one redundant entry point to carry for a major
version. Worth it for a migration people can take at their own pace.

Note that B needs the per-feature subpaths (`/popup`, `/tooltip`, `/infowindow`) to exist. Importing
`popup` from the root while importing everything else from `/core` would pull the whole library back
in and defeat the point.

### Correction: B is not the cheap option

**B cannot be built with the current `splitting: false`, one-bundle-per-entry configuration.** Each
subpath entry would inline its own complete copy of the core — two copies of `Map`, `Layer` and
`Overlay`, which breaks the `instanceof Map` checks the library relies on (`Marker.#setMap()`) and
gives the consumer two `loader()` singletons.

So the build work below is a **prerequisite for B**, not an optional follow-up as previously written.

Verified with esbuild: building `core` and `popup` as two entries with `--splitting --format=esm`
produces one shared chunk rather than two copies —

```
chunk-JXVUQA54.js   70,694   <- Map, Layer, Overlay and everything shared
core.js                 77
popup.js            32,542
```

A consumer importing only `/core` loads ~70.7 KB; one importing both loads ~103 KB. Both match the
direct-import measurements in section 2, which is the confirmation that nothing is duplicated.

### Build changes required

- [x] **ESM: code splitting with shared chunks** (`splitting: true`), or unbundled per-module output.
      esbuild supports splitting for ESM only.
- [x] **CommonJS: point every subpath's `require` condition at the existing full `index.cjs`.**
      Splitting is not available for CJS, and CJS cannot be tree-shaken meaningfully anyway. A
      `require('@aptuitiv/gmaps/popup')` then resolves to the whole bundle: the named export is
      present and behaviour is correct, there is no duplication, and there is no size win. Document
      that plainly rather than leaving people to measure it.
- [x] **Browser build is unaffected.** `dist/browser.js` is an IIFE and all-or-nothing by nature.
      A smaller browser build means separate bundles — a core script plus optional feature scripts
      that register onto `G` — which is the same mechanism as the plugin work, and a separate decision.
- [x] **`exports` map** in `package.json` for each new subpath, with `types` for both conditions.
- [x] **`sideEffects`** corrected. It currently lists patterns (`**/Popup.*`) that match **no shipped
      file**, because everything is bundled into `dist/index.esm.js` — so today the field does nothing
      for consumers. It starts mattering the moment files ship unbundled or split, and must then list
      exactly the modules that register something.
- [x] **`.d.ts` generation** checked against the new output layout. Verified with `tsc`: types
      resolve for the main entry point and for all four subpaths.
- [x] **A size test** that pins the bundled size of a minimal import, so this cannot silently regress
      again.

### Making A kinder

The breakage is real rather than theoretical: code in the wild calls `marker.attachTooltip()`,
`dataLayer.attachPopup()` and passes `tooltip:` options to markers **without importing anything
popup- or tooltip-related**. Those calls become undefined.

Keep stub `attachPopup()` / `attachTooltip()` methods on `Layer` and `Map` that throw a clear error —
*"attachPopup() requires the popup module. Add `import '@aptuitiv/gmaps/popup'`"*. They cost almost
nothing, they live in modules that are always loaded, and they turn a silent undefined into a message
that says exactly what to do.

---

## 5. Documentation

The installation documentation has to carry this, and it is currently one short section on the
Introduction page (`docs/docs-src/intro.md`) that lists the three files in `dist/` and moves on.
Once there are multiple entry points, and once what you import determines what you pay, that is not
enough. Some of this is worth doing regardless of the tree-shaking work.

### Structure

Introduction keeps a short Install paragraph that links to a new **Installation** section, one page
per way of consuming the library:

| Page | Covers |
|---|---|
| `installation/index.md` | Choosing a method: a table of bundler / standalone script / CommonJS, what each supports, and which to pick |
| `installation/bundler.md` | npm plus a bundler (ESM). The entry points, what each costs, which features need their own import, and a worked `import` block |
| `installation/browser.md` | The standalone script. `dist/browser.js`, the `G` namespace, loading additional feature or plugin scripts, and why script order matters |
| `installation/commonjs.md` | `require()`. What is different, and why subpaths resolve to the full bundle |

### Content the new pages need

- [x] **What each entry point costs**, with the numbers from section 2, so the choice is visible
      rather than guessed at. State the measurement method and bundler, since results vary.
- [x] **Which features require their own import** — popup, tooltip, InfoWindow — and what the error
      looks like if you forget.
- [ ] **A migration note** for the 1.0 root-barrel change, written once and linked from the changelog. **Phase 4 — not needed until the breaking change.**
- [x] **Script order** for the browser build, including feature and plugin scripts.
- [x] Update `docs/docs-src/guides/load.md`, which currently mixes *loading the Google Maps API* with
      *including this library* ("copy `node_modules/@aptuitiv/gmaps/dist/browser.js`", "bundle it with
      Gulp, Webpack..."). It should keep the first and hand the second to the Installation pages.
- [x] Add the Installation category to `docs/sidebars.ts`, above Guides.
- [x] Keep the "Available objects" list on the Introduction page in step with which entry point each
      object comes from. Nothing to change: that list describes the `G` namespace in the browser
      build, which contains everything regardless of entry point.

---

## 6. Phases

### Phase 1 — Build — **done**
- [x] ESM splitting, verified to produce shared chunks rather than copies. `tsup.config.js` is now
      three builds: browser (IIFE), ESM (multi-entry, `splitting: true`), CommonJS (single entry,
      no splitting, because esbuild can't split that format).
- [x] `exports` map, `sideEffects`, `.d.ts`, CJS subpath aliasing.
- [x] Size regression test — `test/entry-points.test.ts` bundles a consumer with esbuild and pins
      the size, building from `src` so it needs no prior build. `esbuild` added as an explicit
      devDependency for it.
- [x] `npm run build` now removes `dist` first. Content-hashed chunks were accumulating with every
      build.

### Phase 2 — Option B — **done**
- [x] `src/core.ts`, `src/popup.ts`, `src/tooltip.ts`, `src/infowindow.ts` entry points.
      `src/index.ts` is now `export * from './core'` plus the three feature modules, so there is one
      list of exports rather than two barrels to keep in step.
- [x] Root unchanged and verified non-breaking.
- [x] Measured and published in the installation documentation.

### Phase 3 — Documentation — **done**
- [x] `docs/docs-src/installation/` — `index.md` (choosing an entry point), `bundler.md`,
      `browser.md`, `commonjs.md`.
- [x] `intro.md`'s Install section replaced with a pointer. It also listed `dist/index.cjs.js`,
      which has never been the name of a shipped file.
- [x] `guides/load.md` hands the "how to include the library" part to the installation pages.
- [x] Added to `docs/sidebars.ts`. All internal links verified to resolve (`onBrokenLinks: 'throw'`).
- [x] CHANGELOG.

### Phase 4 — Option A, at 1.0
- [x] **Stub methods with actionable errors — done early**, in `Layer`. They are as useful to a
      `/core` user now as they will be to anyone upgrading at 1.0.
- [x] **Placeholders on `Map` — done, with real signatures.** An earlier note here said they would
      have to be typed `(...args: any[]): any`. That was wrong. The placeholder declares exactly the
      signature the feature module installs, so the types are identical either way and only the body
      differs:

      ```ts
      attachPopup(popupValue: AttachPopupValue, event?: 'click' | 'clickon' | 'hover'): Popup
      ```

      The types it needs come in through `import type`, which is erased at build time, so no runtime
      dependency on the feature modules is created and tree-shaking is unaffected — verified: a
      `latLng`-only import from `/core` is still 8,048 bytes. The whole addition costs about 200
      bytes.

      This also fixes a pre-existing bug. `Map` extends `Evented`, not `Layer`, so it never had the
      `[x: string]: any` index signature that made these calls type-check on markers and polylines.
      `map.attachPopup()`, `map.attachTooltip()` and `map.attachInfoWindow()` all failed with
      `TS2339 — Property does not exist on type 'Map'`, despite working at runtime and being
      documented. They now type-check, with the arguments checked: passing an event other than
      `'click' | 'clickon' | 'hover'` is rejected.

      `DataLayer` and `DataFeature` both extend `Layer`, so they were already covered by the index
      signature and by the `Layer` placeholders. Nothing to do for them.

      The one thing the placeholders cannot do is reflect *availability*: the types say the method
      exists whether or not the feature module was imported, and the runtime error is what catches
      it. Declaration merging from the feature modules would make the types track the imports
      exactly, and is the better answer if it ever proves worth the machinery — but it is no longer
      needed to get correct signatures, only to get correct availability.

### Phase 5 — **done (2026-09-21)**
- [x] Re-measured with webpack 5.97.1 in production mode, driven through its Node API against the
      same consumer snippets. Webpack was the right second bundler to pick: it honours `exports`
      maps and `sideEffects` natively and treats them quite differently from esbuild.

      | What is imported | esbuild | webpack |
      |---|---|---|
      | `latLng` from `/core` | 8,094 | 7,835 |
      | `map` + `marker` from `/core` | 71,401 | 72,089 |
      | `map` + `marker` + `/button` | 75,418 | 76,182 |
      | `map` + `marker` + `/popup` + `/tooltip` | 108,358 | 109,930 |
      | Anything from the main entry point | 114,018 | 122,567 |

      **The split behaves the same in both.** The two agree within about 1% on every case except the
      full bundle, where webpack's module wrapping and runtime add roughly 8 KB. Nothing suggests the
      esbuild figures were flattering — if anything webpack is slightly kinder on the minimal case.

      The installation documentation now publishes both columns rather than one bundler's numbers.

---

## 8. Results

Measured through real package resolution against the built `dist`:

| What is imported | Before | After |
|---|---|---|
| `latLng` from `/core` | 112,741 | **8,048** |
| `map` + `marker` from `/core` | 112,740 | **70,687** |
| `map` + `marker` + `polyline` + `/popup` + `/tooltip` | 112,740 | 107,680 |
| Anything from `@aptuitiv/gmaps` | 112,740 | 113,364 |

The main entry point grew by about 600 bytes, from the re-export indirection and the placeholder
methods. Everything else is opt-in.

Verified as well as measured:

- `Map` and `Marker` imported from `/core` are the *same objects* as those from the main entry point
  — one copy, so `instanceof` still holds across entry points.
- The main entry point still has real `attachPopup()` / `attachTooltip()` / `attachInfoWindow()`.
- `/core` on its own does not, and calling one throws the message telling you what to import.
- A bare `import '@aptuitiv/gmaps/popup'` registers the methods, so the `sideEffects` list is doing
  its job.
- `require()` works for the main entry point and for every subpath, all resolving to one copy.

### Worth knowing for phase 4

`src/index.ts` no longer keeps the feature modules alive when something *bundles from source* rather
than from `dist` — a consumer importing `latLng` from `src/index.ts` now shakes down to 3,221 bytes.
It doesn't affect anything shipped, because the entry points' exports are all preserved when tsup
builds them, and both the browser build and `dist/index.esm.js` were verified to include the
features. It does mean the `sideEffects` patterns for the source files are no longer what holds this
together, which is worth remembering when the root barrel changes at 1.0.

---

## 7. Method

All figures: `esbuild <entry> --bundle --format=esm --minify`, byte counts of the output, against the
current working tree. The "unbundled source" rows import directly from `src/lib/*.ts`; the barrel rows
import from `src/index.ts` or `dist/index.esm.js`. The pruned-barrel rows were produced by removing
the three `export ... from './lib/{Popup,Tooltip,InfoWindow}'` statements and changing nothing else.
The splitting check used two entry points with `--bundle --splitting --format=esm --outdir --minify`.
