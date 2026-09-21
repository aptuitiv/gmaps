# Plan: `LocationControl` — show the user where they are

Status: **Step 3 complete (2026-09-21).**

**Built as planned, with three notes:**

- It extends `Button`, and `enabled` was not needed after all — `showWhenLocated` keeps the control
  off the map entirely until there is a location, which is simpler than adding it disabled. A
  control that is never added can't be clicked, so the enabled state stays available for
  implementors rather than being spent here.
- `setMap()` rather than `addTo()` is the entry point, because the control has to listen to the map
  before it can decide whether to go on it.
- Found and fixed a documentation bug on the way: `locate()`'s docblock said the position arrives on
  `event.detail`. `dispatch()` merges event data onto the event object, so it's `event.latitude` and
  friends. The control reads it that way and the docblock is corrected.
Created: 2026-09-17 · Rewritten 2026-09-18 for the plugin architecture
Target: a first-party plugin, built on `Control` / `Button`

Related: `../active/plugin-architecture.md`, `control.md`, `button.md`

---

## 1. Goal

**Show the user's location on the map as a marker that keeps up with them, and give them a control
that returns the map to it.**

The library already does the hard half of this. `map.locate()` (`src/lib/Map.ts:1484`) watches the
Geolocation API, normalises the result into a `LocationPosition`, and dispatches `locationfound` and
`locationerror`. What it does not do is *show* anything — so every project that wants the familiar
blue dot writes the same twenty lines: create a marker, move it on each fix, add a button, pan to the
marker when it is clicked, and only show the button once a fix has actually arrived.

That is a gap in a feature the library already ships half of, which makes it worth closing here
rather than leaving to each project.

It is also a good third thing to build on the new architecture: it exercises what a button does not —
asynchronous state, map events, and a control that owns a map object as well as an element.

---

## 2. What the library already provides

| Piece | Where |
|---|---|
| `map.locate(options?, onSuccess?)` — watches by default, dispatches `locationfound` | `src/lib/Map.ts:1484` |
| `LocationPosition` — latitude, longitude, `latLng`, timestamp, and accuracy/altitude/heading/speed when the device supplies them | `src/lib/Map/types.ts:226` |
| `map.onLocationFound()` / `map.onLocationError()` | `src/lib/Map.ts:1702`, `:1711` |
| `map.stopLocate()` | `src/lib/Map.ts:2385` |
| `Marker` with `svgIcon`, `setPositionSync()`, `show(map)` | `src/lib/Marker.ts` |

### Two bugs to fix on the way

Both become reachable as soon as a control calls `locate()` on a map where the implementor may also
call it:

1. **`locate()` is not idempotent.** It assigns `#watchId` unconditionally, so a second call starts a
   second `watchPosition()` and leaks the first watch.
2. **`stopLocate()` never clears `#watchId`.** A second call passes a dead id to `clearWatch()`, and
   nothing can tell whether a watch is running.

---

## 3. Shape

`LocationControl extends Button`. The button is the control's element; the marker is a `Marker` the
control owns. Extending `Button` rather than `Control` means click handling and the enabled state
come for free — and `enabled` turns out to be exactly the right mechanism for "there is no location
yet", so the state machine is used rather than bypassed.

---

## 4. The headless contract

Stated in `../active/plugin-architecture.md` §4. Two consequences specific to this control:

- **No default CSS, and no default inline styles.** A control with no `className` renders unstyled.
  The documentation shows the CSS to copy; the library does not ship it.
- **The default marker stays.** It is a `Marker` with an `svgIcon` — both library primitives — and a
  blue dot is the platform convention rather than a design decision. `marker: false` opts out, and
  passing marker options overrides any part of it.

---

## 5. Public interface

```ts
export type LocationControlOptions = ButtonOptions & {
    // What clicking does. Default 'pan'.
    action?: 'pan' | 'center';
    // Whether the control calls map.locate() itself. Default true.
    autoLocate?: boolean;
    // Whether to move the map to the user on the first fix. Default false, so that later
    // updates never fight the user panning the map.
    centerOnFirstFind?: boolean;
    // Options passed through to map.locate()
    locateOptions?: LocateOptions;
    // false for no marker, a Marker to use as-is, or options merged over the default blue dot
    marker?: boolean | Marker | MarkerOptions;
    // Whether the control is only added to the map after the first successful fix. Default true.
    showWhenLocated?: boolean;
    // Zoom level to set when clicked. Not set by default, so the zoom is left alone.
    zoom?: number;
};
```

Members: `location` (the last `LocationPosition`), `isLocated`, `marker`.
Methods: `panToLocation()`, `stop()` (stop watching, leave everything in place), plus everything from
`Button` and `Control`.
Events: `located` (each fix), plus `click` and `change` from `Button`.

```js
// The whole feature
locationControl({ map, className: 'MyBtn', content: '<svg>...</svg>' });

// A marker only, no control
locationControl({ map, button: false });

// Where the implementor already calls locate() themselves
locationControl({ map, autoLocate: false, className: 'MyBtn' });
```

Anything project-specific — filling in a "search near me" field, revealing UI when a location is
known — stays with the implementor, through the `locationfound` event that already exists.

---

## 6. Behaviour

1. On construction, if `autoLocate`, call `map.locate(locateOptions)`. Either way, subscribe to
   `locationfound` and `locationerror`, so `autoLocate: false` behaves identically once something
   else starts locating.
2. **First fix:** create and show the marker; move the map if `centerOnFirstFind`; attach the control
   if `showWhenLocated`; dispatch `located`.
3. **Later fixes:** move the marker only. Never move the map — otherwise it yanks itself back while
   the user is panning.
4. **`locationerror`:** nothing visible. With `showWhenLocated` the control was never attached, so a
   denied permission leaves no dead button on the map.
5. **Click:** pan or centre on the last known position, applying `zoom` when set.
6. **`remove()`:** detach the control, hide the marker, and stop watching only if this control started
   the watch.
7. Works before the map has rendered: `Control` already queues, and a marker can be created and shown
   on a map that has not rendered yet. This matters when a map starts hidden — a location request
   often needs to start before the map is visible.

---

## 7. Edge cases

- **Double watch** — fixed by making `locate()` idempotent and having `stopLocate()` clear the watch
  id.
- **Geolocation unavailable or an insecure origin** — `locate()` already logs; the control simply
  never appears.
- **Attached twice** on repeated fixes — guarded by a flag, not only by a one-shot listener, because
  `showWhenLocated: false` attaches it up front.
- **Marker ownership** — a marker passed in by the implementor is hidden by `remove()`, not destroyed.
  Only a marker the control created is torn down.
- **Click before any fix** — only reachable with `showWhenLocated: false`; it is a no-op.

---

## 8. Phases

### Phase 1 — Prerequisites
- [x] `control.md` and `button.md` complete and published.
- [x] Make `locate()` idempotent; clear `#watchId` in `stopLocate()`; tests for both.

### Phase 2 — The control
- [x] `LocationControl` on `Button`, `locationControl()` factory, option types.
- [x] Default marker options and the default SVG icon.
- [x] Location handling, click behaviour, `remove()` / `stop()`.
- [x] Exports. **No `map.addLocationControl()` sugar** — decided in
      `../active/plugin-architecture.md` step 1: a plugin adding a method to a core class has to
      register itself, which means the method silently doesn't exist unless the plugin was imported.
      The factory takes the map instead: `locationControl({ map })`.

### Phase 3 — Tests
- [x] Nothing is attached before the first fix.
- [x] The first fix shows the marker and attaches the control; a second fix only moves the marker,
      attaches nothing more, and does not move the map.
- [x] `locationerror` attaches nothing.
- [x] `button: false` gives a marker only; `marker: false` gives a control only.
- [x] Click pans by default, centres with `action: 'center'`, applies `zoom` when set.
- [x] `remove()` stops the watch only when `autoLocate` was true.
- [x] `autoLocate: false` doesn't call `locate()` but still reacts to the event.
- [x] Map-level: `locate()` twice starts one watch; `stopLocate()` twice is safe.

### Phase 4 — Docs and demo
- [x] API reference page, including the CSS to copy for a plain button.
- [x] Rewrite the existing geolocation demo page (`site-src/js/geolocation.js`) on top of the control
      — it currently hand-rolls the marker half and is a good before/after.
- [x] CHANGELOG.

---

## 9. Deferred

| Left out | Why |
|---|---|
| Accuracy circle | Needs a `Circle` wrapper the library does not have. Add `accuracy: true` when it does |
| Heading cone / compass | Device orientation permission on iOS makes it a feature of its own |
| "Follow me" mode, where the map keeps recentring | Easy to add later as `follow: true`; it fights user panning, so it should be opt-in and deliberate |
| Translated strings | Tooltip and label content are already options; the library keeps English defaults |
