# Plan: Expand the plugin architecture

Status: **Step 1 — in progress**
Created: 2026-09-18
Target: `docs/docs-src/plugin.md`, `src/lib/Base.ts`, `src/lib/Map.ts`, `src/index.ts`, `src/browser.ts`

Reference: [Leaflet plugin authoring guide](https://github.com/Leaflet/Leaflet/blob/main/PLUGIN-GUIDE.md)

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

That last row is the important one. Popups, tooltips and InfoWindows are already optional features
that register themselves into `Layer` and `Map` at module load. Three of the library's largest
features are plugins in all but name. The architecture proposed here is not new to this codebase —
it is what the codebase already does, written down and made available to everyone else.

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

### Step 1 — this plan: the plugin system

Expand the extension points and write the conventions. Nothing in the core changes behaviour.

### Step 2 — `Control` and `Button`

`Control` is the `L.Control` equivalent and the first thing the new documentation has to be able to
describe. `Button` is the proof that `Control` is a usable base — if writing a button on top of it is
awkward, the base is wrong, and it is much cheaper to learn that now than after publishing.

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

### First-party plugin delivery

Decide between:

- **Separate npm packages** (`gmaps-<name>`) — matches Leaflet, and makes our own plugins the first
  users of the published conventions, which is the fastest way to find out whether those conventions
  are any good.
- **Subpath exports from this package** (`@aptuitiv/gmaps/plugins/<name>`) — one release cycle, one
  documentation site, and no peer-dependency version matching. Still costs nothing to anyone who
  doesn't import them.

Recommendation: **subpath exports** for plugins we ship, because it is reversible and avoids
version-matching a peer dependency against a library still on 0.x. A plugin that needs its own
release pace can move out later; moving in is harder.

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
- [ ] Document Popup, Tooltip and InfoWindow as the in-tree examples of the mixin pattern.
- [ ] Add a plugin list page to the documentation site.

---

## 7. Risks

| Risk | Mitigation |
|---|---|
| "Everything is a plugin" makes the library feel unfinished | Ship the first-party plugins alongside the library and list them in the documentation. The line is *headless vs. opinionated*, not *important vs. unimportant* |
| `include()` gets used for things it cannot do — private state, constructors | Say so plainly in the documentation. The library's own mixins are method-only, which is the example to point at |
| Published extension points become API that is expensive to change | Keep the surface small. `Control` in particular is specified deliberately minimally |
| Init hooks running for maps a plugin shouldn't touch | Hooks receive the map and opt in themselves; document that they must be cheap and must not assume any option is set |
| Conventions written before anything uses them | That is what the sequence in section 5 is for — `Control`, `Button` and `LocationControl` are the first three users, and the conventions get corrected by them before anyone else depends on them |

---

## 8. Definition of done for this step

- `Map.addInitHook()` exists, is tested and is documented.
- `docs/docs-src/plugin.md` is rewritten and covers the contract, the extension points, the
  conventions and accessibility.
- The delivery mechanism for first-party plugins is decided and documented.
- Popup / Tooltip / InfoWindow are described as worked examples.
- Reviewed and published before `Control` and `Button` begin.
