# Plan: `Control` — the base class for anything attached to a map

Status: **Step 2a complete (2026-09-18).**

**Reviewed against completed work, 2026-09-18.** The design stands as written. Notes:

- `Control` is **core**: exported from `src/core.ts`, so it reaches both `@aptuitiv/gmaps/core` and
  the main entry point. It registers nothing, so it stays out of `sideEffects` and is dropped by a
  bundler when unused.
- The `index` expando cast, called out below as a thing to own in one place, is the same kind of
  problem the `missingFeature` placeholders solved for the feature modules: a small typed shim in the
  library instead of a cast repeated in every project.
- `map.addControl()` / `getControls()` are listed as optional sugar. Leaving them out for now —
  `control.addTo(map)` is the primary form and a second way to do it earns nothing yet.
Created: 2026-09-18
Target: `src/lib/Control.ts` (new), `src/lib/Map.ts`

Related: `../active/plugin-architecture.md` (the contract and the sequence), `button.md`,
`location-control.md`

---

## 1. Goal

**Own the lifecycle of a DOM element attached to a map: add it, order it, move it, remove it — and
give the implementor an object to hold onto instead of a bare `HTMLElement`.**

A control is not necessarily a button. Anything positioned on a map through
`map.controls` is one: a logo, a legend, a message that appears when a search returns nothing, a
panel, a group of buttons. What they share is not interactivity — it is that each is *an element the
implementor owns, positioned on the map, whose lifecycle nobody currently manages.*

`Button` (its own plan) is the first subclass, and the most common case. It is not the definition.

**Non-goals:** looking like anything, and interactivity. See sections 4 and 5.

---

## 2. Is this just a wrapper around `addCustomControl()`?

For attaching, yes. For everything else, no — and the everything else is the reason to build it.

`Map.addCustomControl()` (`src/lib/Map.ts:951`) is nine lines:

```ts
addCustomControl(position, element) {
    if (this.#map) { this.#map.controls[convertControlPosition(position)].push(element); }
    else { this.#customControls.push({ position, element }); }
    return this;
}
```

| What it does | What it leaves to every caller |
|---|---|
| Pushes the element into the right `map.controls` array | — |
| Queues it when the map hasn't rendered yet | The queue is flushed and **cleared** at render (`Map.ts:2347`) and is one-way: an element queued and then abandoned is still added |
| — | **Removal.** `map.controls[position]` is a `google.maps.MVCArray`; taking something out means walking `getArray()` for an identity match and calling `removeAt()` |
| — | **Repositioning.** Remove from one array, push to another |
| — | **Ordering.** Google orders custom controls by an untyped `index` expando set on the element |
| — | **A handle.** The caller is left holding a raw `HTMLElement` and reaches for it from wherever it happens to be in scope |

Roughly 40% wrapper, 60% the parts that are missing.

---

## 3. Why not leave this to the implementor

| Hand-rolled | What it costs |
|---|---|
| Push an element, keep no handle | **Nothing can be removed or moved.** Controls that shouldn't apply to a given view have to be conditionally *never added*, which pushes the conditional up into page setup and makes anything dynamic awkward |
| `element.index = 1` | An untyped expando on `HTMLElement`, undocumented by the library, and a type error waiting to happen in TypeScript |
| State kept on the element with `setAttribute()` from several places | A "disabled" control that is still clickable, and state that drifts out of sync with the thing it controls. Both are common in hand-rolled implementations |
| Each control finding its own parts with global `document` queries | Only one instance per page works — a bug that only shows up when a second map is added, long after the code was written |
| Placement logic repeated per control | Every control re-derives position, ordering and attach timing |

Two of those — removal and reordering — **cannot be fixed from outside the library at all** without
reaching into `map.toGoogle().controls` and reimplementing `MVCArray` handling. That is the strongest
argument here. It is not that hand-rolling is tedious; it is that part of this is unreachable.

---

## 4. The headless contract

Stated in full in `../active/plugin-architecture.md` §4. In short: **the library owns *when*, the
implementor owns *what it looks like*.** `Control` ships no CSS, no icons and no class names, and
invents no attribute vocabulary.

Building an element from a caller-supplied `tag`, `className`, `content` and `attributes` is still
headless, because every value came from the caller. It would stop being headless the moment a default
class name or a stylesheet appeared.

---

## 5. Public interface

Deliberately small. This is a primitive; interesting behaviour belongs in subclasses.

```ts
export type ControlOptions = {
    // Attributes to set when building the element
    attributes?: { [key: string]: string };
    // Class name(s) when building the element
    className?: string;
    // Contents when building: an HTML string, an element, or a function returning either
    content?: string | HTMLElement | (() => string | HTMLElement);
    // An existing element, or a selector for one. When set, nothing is built and the element is
    // left exactly as it is.
    element?: HTMLElement | string;
    // Ordering among the controls at the same position. Default 0.
    index?: number;
    // The map to attach to. Can be done later with addTo().
    map?: Map;
    // Where the control goes on the map
    position?: ControlPositionValue;
    // The tag to build. Default 'div'.
    tag?: string;
};
```

```ts
class Control extends Evented {
    get element(): HTMLElement;
    get isAttached(): boolean;
    get map(): Map | undefined;
    get index(): number;                   set index(value: number);
    get position(): ControlPositionValue;  set position(value);  // moves an attached control

    addTo(map: Map): this;
    remove(): this;                        // works before or after the map has rendered
}
```

Factory: `control(options)`. Events: `add`, `remove`.

**No `enabled`, no `active`, no click handling.** Those belong to `Button`, because they are
meaningless for a logo or a static message. Keeping this class to lifecycle is what makes it a
defensible core primitive rather than a half-built button.

### Map additions

| Member | Notes |
|---|---|
| `map.removeCustomControl(element)` | Finds the element in the rendered `MVCArray` by identity and calls `removeAt()`, and removes it from the pre-render queue. Missing today, and not implementable from outside |
| `map.addControl(control)` / `map.getControls()` | Optional sugar. `control.addTo(map)` is the primary form |

`addCustomControl()` is unchanged. It is the right low-level primitive, it is public API, and
`Control` is built on top of it rather than replacing it.

### File location

`src/lib/Control.ts`, not `src/lib/Map/Control.ts`. Everything in `src/lib/Map/` is map
*configuration* — objects that convert to Google map options. A control is a thing attached to the
map, so it belongs beside `Polyline` and `DataLayer`. This follows the precedent set for `DataLayer`
in `ai-plans/done/map-data-layer.md`.

---

## 6. Why this is also the plugin story

Leaflet's plugin surface is small, and the piece nearly every control plugin uses is `L.Control` — a
documented base class third parties extend. This library already has the mixin half
(`Base.include()`, used on itself by Popup, Tooltip and InfoWindow). `Control` is the other half.

So this class does double duty: it removes work that every implementor currently repeats, and it is
the extension point that makes a third-party control plugin writable at all.

---

## 7. Phases

### Phase 1 — The class
- [x] `src/lib/Control.ts`: class on `Evented`, options type, `control()` factory.
- [x] Build-or-wrap element handling (`element` wins over `tag` / `className` / `content`).
- [x] Typed `index` handling in one place — the expando cast lives here and nowhere else.
- [x] `addTo()` / `remove()` working both before and after the map renders.
- [x] A `position` setter that moves an attached control.

### Phase 2 — Map plumbing
- [x] `map.removeCustomControl(element)`.
- [x] Fix the one-way queue: a control removed before render is dropped from `#customControls`.
- [x] Exports in `src/index.ts` and `src/browser.ts`.

### Phase 3 — Tests (`test/Control.test.ts`)
- [x] Builds from `tag` / `className` / `content` / `attributes`; uses a passed element untouched.
- [x] `addTo()` queues before render and pushes after.
- [x] `remove()` works in both states, **including remove-before-render**.
- [x] A `position` change moves it between arrays.
- [x] `index` reaches the element.
- [x] Two controls on one map stay independent.

### Phase 4 — Docs
- [x] `docs/docs-src/api-reference/map-controls/control.md`, written as much for plugin authors as
      for site developers, with a "write your own control" example.
- [x] `map.md`: `removeCustomControl()`, and a pointer from `addCustomControl()` saying when to reach
      for `Control` instead.
- [x] CHANGELOG.

---

## 8. Deferred

| Left out | Why |
|---|---|
| `enabled` / `active` / click | `Button`'s job. A logo has no enabled state |
| Control groups and toolbars | No demonstrated need; a group is a `Control` whose element contains others |
| Declarative responsive positions | The `position` setter makes it possible. A declarative API can wait for a real need |
| Replacing `addCustomControl()` | It is public API and the right low-level primitive |
