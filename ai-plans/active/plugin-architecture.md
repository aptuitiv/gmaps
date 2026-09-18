# Plan: Expand the plugin architecture

Status: **Step 1 — revised 2026-09-18 after the tree-shaking work shipped. Smaller than it was:
the delivery question it set out to answer is now largely settled.**
Created: 2026-09-18
Target: `docs/docs-src/plugin.md`, `src/lib/Base.ts`, `src/lib/Map.ts`, `src/index.ts`, `src/browser.ts`

Reference: [Leaflet plugin authoring guide](https://github.com/Leaflet/Leaflet/blob/main/PLUGIN-GUIDE.md)
Depends on: `../done/tree-shaking.md`, which built and proved most of the machinery this needed.

### What the tree-shaking work changed about this plan

1. **The size argument for separate plugin entry points is gone.** Unused exports are now dropped:
   importing `latLng` alone from `/core` bundles 8 KB where the whole library is 111 KB. A plugin
   that only exports a class and a factory can live in the main barrel and cost nothing to anyone
   who doesn't import it. Section 6 is rewritten around what's actually left.
2. **The entry-point machinery exists and is proven.** Adding one is a line in the `entry` array in
   `tsup.config.js` plus an `exports` entry. That was the expensive-looking part of this plan.
3. **There is now a worked pattern for a feature that registers methods on core classes**, with a
   placeholder that tells you what to import when you haven't. It should become the documented
   convention rather than something each plugin invents.
4. **Some of the documentation is already written** — the installation pages cover entry points and
   the script order plugins depend on in the browser.

---

## 1. Goal

Give the library a plugin architecture good enough that UI built on top of a map can live outside the
core — written by us or by anyone else — while the core keeps doing what it has always done:
primitives, Google Maps integration, and behaviour that decides nothing about appearance.

The immediate motivation is that a handful of UI patterns get hand-rolled on essentially every
project that uses this library: a button on the map, a "my location" control, a styled replacement
for a Google control that can't be styled, a legend. Each is rebuilt per project, each drifts, and
each fixes its own bugs. They are worth sharing. Most of them are **not** worth putting in the core,
because they make decisions about markup and CSS that the core has no business making.

A plugin system is how both of those are true at once.

---

## 2. What already exists

More than it appears:

| Piece | Where | State |
|---|---|---|
| Mixin into an existing class | `Base.include()` — `src/lib/Base.ts:49` | Exists, documented in `docs/docs-src/plugin.md` |
| `G` global namespace for browser plugins | `src/browser.ts` | Exists, documented |
| Subclassing a library class | `class MyThing extends G.Marker` | Exists, documented |
| **The library using its own plugin system** | `Layer.include(popupMixin)` / `Map.include(popupMixin)` — `src/lib/Popup.ts:1137-1138`; the same for `Tooltip.ts:852-853` and `InfoWindow.ts:878-879`, with `sideEffects` in `package.json:25-29` so bundlers keep the registration | Exists, **not documented as the pattern it is** |

| **Separate entry points, with types and a browser story** | `src/core.ts`, `src/popup.ts`, `src/tooltip.ts`, `src/infowindow.ts`; splitting in `tsup.config.js`; `exports` and `sideEffects` in `package.json` | Exists, shipped |
| **A placeholder for a method a feature module installs** | `src/lib/missingFeature.ts`, used by `Layer` and `Map` | Exists, shipped |
| **Installation documentation** | `docs/docs-src/installation/` | Exists, covers entry points and browser script order |

Two rows matter most.

Popups, tooltips and InfoWindows already register themselves into `Layer` and `Map` at module load —
three of the library's largest features are plugins in all but name. Since the tree-shaking work they
are also *shipped* as optional modules with their own entry points, so they are no longer only a
pattern to point at: they are a working example of the whole lifecycle, from source layout to build
to `exports` map to documentation.

And the placeholder pattern answers a question every registering plugin has: what happens when
someone calls a method whose module they never imported. The answer is an error naming the import to
add, rather than "attachPopup is not a function".

---

## 3. What's missing

Leaflet's *technical* plugin surface is small — its guide is mostly conventions, and the actual
extension points are `L.Class.extend` / `include`, `L.Map.addInitHook`, `L.Handler` and `L.Control`.
Measured against that:

| Leaflet | This library | Gap |
|---|---|---|
| `L.Class.include` | `Base.include()` | None |
| `L.Class.extend` | ES `class X extends G.Marker` | None — and better: `include()` is `Object.assign` on a prototype, so it can't add `#private` fields or hook a constructor, while `extends` can |
| **`L.Control`** | — | **The big one.** Nearly every Leaflet control plugin is `L.Control.extend({...})`. This library has no base class for "a thing attached to the map" |
| `L.Map.addInitHook` | — | No way for a plugin to attach itself to every map without the site wiring it up |
| `L.Handler` | — | No base for map interaction behaviours. No demand; out of scope |
| Conventions + a plugin list | `plugin.md` covers mechanics only | Nothing on naming, packaging, peer dependencies, publishing, or accessibility expectations |
| Types for plugin authors | `dist/index.d.ts` is published | No documented module augmentation for extending `MapOptions` |

So the work is **one base class, one init hook, and a conventions document.** Small code, and most of
the value is in the writing.

---

## 4. The headless contract

This is the rule that decides what goes in the core and what becomes a plugin. It should be stated in
the plugin documentation so it binds future work rather than being re-argued per feature.

> **The library owns *when*. The implementor owns *what it looks like*.**

| The core owns | The implementor owns |
|---|---|
| Lifecycle: attach, detach, reposition, reorder | The element itself, or the tag / class / content used to build one |
| State: what state a thing is in, and when it changes | What each state *looks like* — class names, attributes, icons, labels |
| Integration: map render timing, queuing work before the map exists, events, Google Maps API calls | Every side effect of an interaction |
| State-reflecting ARIA (`aria-pressed`, `aria-expanded`, `aria-disabled`, `aria-checked`) — these *are* state | Roles, labels and other semantics, when they supply the element |
| Nothing else | CSS. **The core ships no stylesheet, ever, not even defaults.** |

### Two clarifications the rule needs

**Building an element can still be headless**, as long as every value comes from the implementor. A
class that calls `document.createElement(tag)` and applies the caller's `className` and `content` has
chosen nothing. It stops being headless the moment it invents a default class name, ships an icon, or
writes a stylesheet.

**State reflection uses the implementor's vocabulary, never the library's.** The core must not decide
that "active" means `data-visible="yes"`. The implementor declares the mapping:

```js
states: { active: { attributes: { 'data-visible': 'yes' } } }
```

and the library decides only *when* to apply it. The state machine lives where its bugs get fixed
once; the vocabulary lives where the CSS is. This is also what keeps the configuration from turning
into a private DSL — the library defines no terms of its own.

### The test for core vs plugin

Two questions, both of which have to pass for something to be core:

1. **Does it wrap a Google Maps capability**, or does it wrap UI that happens to sit on a map?
2. **Is it headless** by the contract above?

Applied to what is planned:

| Piece | Wraps a Maps capability? | Headless? | Home |
|---|---|---|---|
| `Control` — lifecycle of an element attached to a map | Yes. Part of it (removal, reordering) cannot be written from outside the library at all | Yes | **Core** |
| `Button` — a control that responds to clicks, optionally with state | Only its placement | Yes, under the vocabulary rule | **Core plugin**, shipped with the library |
| `LocationControl` — the user's position as a marker, plus a control to return to it | Yes — the Geolocation API and `map.locate()`, which the core already half-ships: it gives you the position and leaves displaying it to you | Yes, once it ships no styles | **Core plugin** |
| A custom map type switcher | No — `map.mapTypeId` and the `maptypeid_changed` event already cover the capability. What's left is markup and a flyout | No | **Plugin** (see `map-type-control-ui.md`) |
| A legend | No | Not achievable as one component — see `legend.md` | **Third-party plugin** |

---

## 5. Sequence

Each step is reviewed and published before the next starts, so the conventions are proven by the
things built on them rather than asserted up front.

### Step 1 — this plan: the remaining extension points

`Map.addInitHook()`, and confirming the limits of `Base.include()`. Small, and nothing in the core
changes behaviour.

**The conventions documentation has moved to step 2a.** Writing it first was the original plan, on
the reasoning that conventions should guide the implementation. That is backwards here: the main
thing a plugin author will extend is `Control`, and a guide to an extension point that doesn't exist
yet can't carry a worked example or be checked against anything. Building `Control` and `Button`
first gives the documentation two real examples to be written from, and they are small enough that
little is at risk if the conventions turn out to want changing.

### Step 2 — `Control` and `Button`

`Control` is the `L.Control` equivalent and the first thing the new documentation has to be able to
describe. `Button` is the proof that `Control` is a usable base — if writing a button on top of it is
awkward, the base is wrong, and it is much cheaper to learn that now than after publishing.

### Step 2a — the plugin documentation

Written once `Control` and `Button` exist, with them as the worked examples. See section 6.

### Step 3 — `LocationControl`

A headless control with real behaviour behind it (geolocation, a marker that follows the user, a
control that returns to it). It exercises the parts of the architecture that a button does not:
asynchronous state, map events, and a control that owns a map object rather than just an element.

### Later

Everything else — the map type switcher UI, legends, product-specific button sets — is built on the
published foundation as plugins, in this repository or outside it.

---

## 6. Scope of this step

### Extension points

- [ ] **`Map.addInitHook(fn)`** — run for every map as it initialises, so a plugin can attach itself
      without the site calling it. Hooks receive the map, must be cheap, and must not assume options.
- [ ] Confirm `Base.include()` handles everything the documentation is about to claim for it, and
      document its limits: methods only; anything holding state uses `extends`.
- [ ] Decide and document how a plugin extends `MapOptions` in TypeScript (module augmentation).
- [x] **A pattern for a plugin that installs methods on core classes** — done as part of the
      tree-shaking work and now the convention to document: register with `include()`, declare a
      placeholder on the target class with the *same signature* the real method has, and throw from
      it with the import to add. The types come in through `import type`, so they cost nothing at
      runtime and the signature is identical whether or not the plugin is loaded. `src/lib/Layer.ts`
      and `src/lib/Map.ts` are the examples.

### First-party plugin delivery

The original question here was subpath exports versus separate npm packages, and it was argued on
bundle size: anything re-exported from the barrel was paid for by every consumer, so a plugin had to
be a separate entry point to be optional at all.

**That argument no longer applies.** Unused exports are dropped now — `latLng` alone from `/core` is
8 KB against 111 KB for the whole library. A plugin that exports a class and a factory and registers
nothing costs nothing to anyone who doesn't import it, wherever it lives.

So the decision is now made on narrower grounds. A separate entry point is worth it when one of these
is true:

| Reason | Applies to |
|---|---|
| **The plugin registers something** — it adds methods to core classes, so a bundler can never drop it, exactly as with popups and tooltips | A plugin adding `map.addLocationControl()` sugar, or anything using `include()` |
| **The browser build** — `dist/browser.js` is an IIFE and all-or-nothing, so anything in the main barrel grows it for every standalone-script user, tree-shaking or not | Any plugin, if standalone-script users matter |
| **It should be publishable on its own schedule** | Third-party plugins, and first-party ones that outgrow this repo |

None of those apply to `Control`, which is core anyway. For `Button`, only the browser-build reason
applies, and it is a judgement call about how much `browser.js` (currently ~172 KB) should carry.

**Recommendation:** ship first-party plugins as subpath entry points (`@aptuitiv/gmaps/button`),
because the machinery now exists and costs a line in the `entry` array plus an `exports` entry, and
because it keeps the core/plugin boundary visible in the imports rather than only in the
documentation. Do **not** start separate npm packages for our own plugins: the peer-dependency
version matching is real work and buys nothing while they move at the library's pace.

Two rules learned the hard way in the tree-shaking work, both of which belong in the plugin
documentation:

1. **A plugin that registers something must be listed in `sideEffects`**, or a bundler may drop a
   bare `import '@aptuitiv/gmaps/<plugin>'` and leave a method the documentation promises and the
   runtime doesn't have. Watch that the patterns match the *shipped* file names — patterns written
   for the source files silently stop matching once the build renames them.
2. **A plugin's browser build must not bundle the core.** It reads what it needs off `G` at load
   time. Bundling its own copy would give the page two of every class and break the `instanceof`
   checks the library relies on.

### Consuming a plugin

**Bundler / npm (ESM):**

```js
import { map, marker, ControlPosition } from '@aptuitiv/gmaps';
import { button } from '@aptuitiv/gmaps/button';
```

Both resolve to the same core instance as long as rule 1 above holds.

**Standalone browser script:** an IIFE cannot import, so a plugin's browser build reads the global
that `src/browser.ts` already sets up, and registers itself onto it:

```html
<script src="/js/gmaps.js"></script>
<script src="/js/gmaps-button.js"></script>
```

```js
G.button({ map: myMap, content: '...', onClick: () => {} });
```

The plugin's browser entry must not bundle the core — it reads `Control` and the rest off `globalThis.G`
at load time, which also means script order matters and must be documented. This is exactly the
pattern `docs/docs-src/plugin.md` already describes for third-party plugins, so first-party and
third-party plugins end up being consumed the same way. That consistency is worth preserving
deliberately.

**Registration and `sideEffects`:** any plugin file that registers something at import time has to be
listed in `package.json`'s `sideEffects` array, or a bundler may drop the registration and leave a
method that the documentation promises and the runtime does not have.

### What this does not change

**Popup, Tooltip and InfoWindow keep their place in the main entry point.** This paragraph used to
say they would stay root exports only, and that making them optional was a 1.0 conversation. The
tree-shaking work did it sooner and without breaking anything: they are still exported from
`@aptuitiv/gmaps`, exactly as before, and are *additionally* importable from their own entry points
by anyone who starts from `/core`.

So nothing here is a plugin that used to be core. They remain core by the library's stated goals,
which list custom styled popups and tooltips among the things the library is for. What changed is
only that not importing them is now possible — which is what makes them a complete worked example
for a plugin author rather than only a pattern to point at.

The one genuinely breaking version of this — the main entry point dropping them, so that
`@aptuitiv/gmaps` means what `/core` means today — is still a 1.0 conversation, and is recorded in
`../done/tree-shaking.md` rather than here.

### Documentation — most of the value of this step

- [ ] Rewrite `docs/docs-src/plugin.md`:
      - What belongs in the core and what belongs in a plugin (the headless contract and the test).
      - The extension points: `extends`, `include()`, init hooks, and `Control` once it exists.
      - Conventions: `gmaps-<name>` npm naming, `@aptuitiv/gmaps` as a `peerDependency`, a lowercase
        factory function beside a `CapitalizedClass`, a single options object rather than positional
        arguments, events through `Evented`, ESM plus a browser build, and no global variables other
        than registering on `G`.
      - Accessibility expectations for anything that renders UI: keyboard operation and screen reader
        support, since a plugin that renders a control is the only one who can get that right.
      - How to publish types.
- [ ] Document Popup, Tooltip and InfoWindow as the in-tree examples of the mixin pattern — now a
      stronger example than when this was written, since they ship as optional entry points with
      their own documentation.
- [ ] Add a plugin list page to the documentation site.
- [x] Entry points, what each costs, and browser script order — covered by
      `docs/docs-src/installation/`. The plugin documentation should link to those rather than
      repeat them.

---

## 7. Risks

| Risk | Mitigation |
|---|---|
| "Everything is a plugin" makes the library feel unfinished | Ship the first-party plugins alongside the library and list them in the documentation. The line is *headless vs. opinionated*, not *important vs. unimportant* |
| `include()` gets used for things it cannot do — private state, constructors | Say so plainly in the documentation. The library's own mixins are method-only, which is the example to point at |
| Published extension points become API that is expensive to change | Keep the surface small. `Control` in particular is specified deliberately minimally |
| Init hooks running for maps a plugin shouldn't touch | Hooks receive the map and opt in themselves; document that they must be cheap and must not assume any option is set |
| A registering plugin's registration is silently dropped by a bundler | The `sideEffects` rule above, plus a test that imports the plugin for its effect alone and asserts the method exists — the shape `test/entry-points-core.test.ts` already uses |
| Conventions written before anything uses them | That is what the sequence in section 5 is for — `Control`, `Button` and `LocationControl` are the first three users, and the conventions get corrected by them before anyone else depends on them |

---

## 8. Definition of done

Split across the resequencing in section 5.

**Step 1 — before `Control` begins:**

- `Map.addInitHook()` exists, is tested and is documented.
- The limits of `Base.include()` are confirmed and written down: methods only, `extends` for anything
  holding state.
- The delivery mechanism is decided — section 6 recommends subpath entry points, so it needs a yes or
  a no, not more analysis.

**Step 2a — after `Control` and `Button` exist:**

- `docs/docs-src/plugin.md` is rewritten and covers the contract, the extension points, the
  conventions and accessibility, with `Control` and `Button` as the worked examples.
- Popup / Tooltip / InfoWindow are documented as the registering-plugin example, including the
  placeholder pattern and the `sideEffects` rule.
- A plugin list page exists.
- Reviewed and published before `LocationControl` begins.
