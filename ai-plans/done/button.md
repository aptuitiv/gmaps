# Plan: `Button` — a control that responds to clicks

Status: **Step 2b complete (2026-09-18).**

**Reviewed against completed work, 2026-09-18.** Three things settled since this was written:

- **Delivery is decided:** a subpath entry point in this repository, `@aptuitiv/gmaps/button`. The
  machinery exists — an entry in `tsup.config.js` and an `exports` entry — and the ESM build already
  shares its code through chunks, so no copy of the core is duplicated.
- **It is deliberately *not* in the root barrel** (`@aptuitiv/gmaps`), which is what makes it opt-in
  for bundler users. It *is* in the browser build, because that is an IIFE and all-or-nothing by
  nature, so `G.button()` works for standalone-script users without a second script to load. That
  asymmetry is intentional and is documented.
- **It registers nothing**, so it must stay out of `sideEffects`. That is what lets a bundler drop it
  when it's imported but unused.
Created: 2026-09-18
Target: `src/lib/Button.ts` with `src/button.ts` as its entry point, published as
`@aptuitiv/gmaps/button`. Built on `src/lib/Control.ts`.

Related: `../active/plugin-architecture.md`, `control.md`, `location-control.md`

---

## 1. Goal

**A control that does something when clicked — and, when it needs to, remembers what state it is in.**

Two cases, one class:

1. **An action button.** Click it, something happens. Reset the map, open a search field, close all
   popups. No state.
2. **A stateful button.** It can be on or off, available or not, and the DOM has to show which. A
   layer toggle is the canonical example: it is unavailable until data loads, then it is off, then it
   is on, and each of those looks different.

The second case is where hand-rolled implementations go wrong, and it is the reason this is worth
shipping rather than leaving to each project.

`Button` is also the proof that `Control` is a usable base class. If writing a button on top of
`Control` is awkward, `Control` is wrong — and that is much cheaper to learn before the base class is
published than after.

---

## 2. Why this isn't left to the implementor

The action-button case saves only a few lines: create an element, set a class, set contents, attach a
click listener, add it to the map. Worth having, not worth an API on its own.

The stateful case is different. Written by hand it is four methods — set up, enable, disable, toggle
— reimplemented per button, and it goes wrong in two ways that recur:

1. **A disabled button is still clickable.** The usual approach is to style the disabled state so
   that the button appears to be gone — no background, no shadow, transparent contents — while the
   click listener attached at setup is still bound. Clicking where the button would be still fires
   the action, on a layer that may not have loaded.
2. **Disabling doesn't reset the active state.** The "disable" path sets an internal flag and clears
   a tooltip but leaves the active attribute on the element and doesn't hide what the button
   controls. The button and the thing it controls end up disagreeing.

Both disappear when one object owns `enabled` and `active` and is the only thing that writes them to
the DOM.

---

## 3. The headless contract

Stated in `../active/plugin-architecture.md` §4. The part that matters most here:

**State reflection uses the implementor's vocabulary, never the library's.** `Button` must not decide
that "active" means `data-visible="yes"`, or `.is-active`, or `aria-pressed` alone. The implementor
declares what each state looks like and `Button` decides only *when* to apply it:

```js
states: {
    enabled:  { attributes: { 'data-loaded': 'yes' } },
    disabled: { attributes: { 'data-loaded': 'no' }, tooltip: null },
    active:   { attributes: { 'data-visible': 'yes' }, tooltip: 'Hide' },
    inactive: { attributes: { 'data-visible': 'no' },  tooltip: 'Show' },
}
```

The state machine lives where its bugs get fixed once. The vocabulary lives where the CSS is.

The one exception, and it is not really an exception: `Button` sets `aria-pressed` on a toggle and
`aria-disabled` when disabled, because those *are* the state rather than a presentation of it.

---

## 4. Public interface

```ts
export type ButtonStateStyle = {
    // Attributes to set for this state. null removes the attribute.
    attributes?: { [key: string]: string | null };
    // Class name(s) to add for this state, removed when the state ends
    className?: string;
    // Text for the button, or for a child element of it
    text?: string | { selector: string; text: string };
    // Tooltip text, written to `tooltipAttribute`, or to title/aria-label by default.
    // null removes it.
    tooltip?: string | null;
};

export type ButtonOptions = ControlOptions & {
    // Start active. Default false.
    active?: boolean;
    // Start enabled. Default true.
    enabled?: boolean;
    // Called on click, only when enabled
    onClick?: (button: Button, event: MouseEvent) => void;
    // How each state is reflected in the DOM. Optional - a button with no states is an
    // action button.
    states?: {
        active?: ButtonStateStyle;
        disabled?: ButtonStateStyle;
        enabled?: ButtonStateStyle;
        inactive?: ButtonStateStyle;
    };
    // The attribute a state's `tooltip` is written to. Defaults to title + aria-label.
    tooltipAttribute?: string;
    // Whether a click flips `active`. Default false.
    toggle?: boolean;
};
```

`ButtonOptions` extends `ControlOptions`, so `element`, `className`, `content`, `attributes`, `tag`,
`index`, `position` and `map` all come from `Control` and behave identically. `tag` defaults to
`'button'` here rather than `'div'`.

```ts
class Button extends Control {
    get active(): boolean;   set active(value: boolean);
    get enabled(): boolean;  set enabled(value: boolean);

    activate(): this;
    deactivate(): this;
    toggle(): this;
    enable(): this;
    disable(): this;
    onClick(callback): void;
    onChange(callback): void;
}
```

Factory: `button(options)`. Events: `click`, `change` (active changed), `enabledchange`.

### The two cases

```js
// An action button
button({
    className: 'MyBtn',
    content: '<svg>...</svg>',
    map: map,
    position: ControlPosition.LEFT_CENTER,
    onClick: () => { map.setZoom(8); map.setCenter(home); },
});

// A layer toggle: unavailable until data loads, then off, then on
const toggle = button({
    className: 'MyBtn MyBtn-layer',
    content: '<svg>...</svg>',
    enabled: false,
    map: map,
    position: ControlPosition.LEFT_CENTER,
    toggle: true,
    tooltipAttribute: 'data-tip-right',
    states: {
        enabled:  { attributes: { 'data-loaded': 'yes' } },
        disabled: { attributes: { 'data-loaded': 'no' }, tooltip: null },
        active:   { attributes: { 'data-visible': 'yes' }, tooltip: 'Hide the layer' },
        inactive: { attributes: { 'data-visible': 'no' },  tooltip: 'Show the layer' },
    },
});

toggle.onChange((active) => (active ? layer.show() : layer.hide()));
layer.onLoad(() => toggle.enable());
```

The second example replaces what is typically four methods and a separate `visible` flag. The flag
disappears — the button owns it — and neither bug in section 2 is reachable.

### Wrapping an element the implementor already rendered

Server-rendered markup is common, and `element` covers it: nothing is built, the element is used as
it is, and the state mapping still applies.

```js
button({
    element: '.js-toggle',
    map: map,
    position: ControlPosition.TOP_CENTER,
    toggle: true,
    states: {
        active:   { className: 'is-active', text: { selector: '.js-toggleText', text: 'Hide' } },
        inactive: { text: { selector: '.js-toggleText', text: 'Show' } },
    },
});
```

---

## 5. Building on this

`Button` is meant to be extended. A downstream package can ship a set of ready-made buttons for a
product family — a reset button, a layer toggle, a search trigger — each a small subclass that fixes
the class names, icon and behaviour for that product while the state machine and lifecycle stay here.
That is the intended end state: the core stays headless, `Button` stays generic, and opinionated
button sets live in packages that can move at their own pace.

---

## 6. Phases

### Phase 1 — Prerequisite
- [x] `control.md` Phases 1-2: `Control`, `map.removeCustomControl()`, typed `index`.

### Phase 2 — Button
- [x] `Button` class, `button()` factory, option types, on `Control`.
- [x] `tag` defaulting to `'button'`; `type="button"` when built.
- [x] Click handling gated on `enabled`; `toggle` flips `active`.
- [x] State reflection — attributes, class names, text, tooltip — applied on every change and once on
      creation.
- [x] `aria-pressed` for toggles, `aria-disabled` when disabled.

### Phase 3 — Tests
- [x] An action button with no `states` works and fires `onClick`.
- [x] Initial state is applied at creation, not only on the first change.
- [x] Click toggles when `toggle: true`, dispatches `change`, applies the active state.
- [x] **A disabled button does not fire click.**
- [x] **Disabling applies the inactive state.**
- [x] A wrapped element is used untouched and still receives state.
- [x] Everything inherited from `Control` still holds: remove, reposition, before/after render.

### Phase 4 — Docs
- [x] API reference page with both cases and the wrap-an-element case.
- [x] A "extend Button for your own buttons" section, since that is the intended use.
- [x] CHANGELOG.

---

## 7. Deferred

| Left out | Why |
|---|---|
| Button groups / toolbars | A group is a `Control` whose element contains buttons. No need for a type of its own yet |
| Radio / exclusive behaviour across buttons | Wait for a real case rather than guessing at the API |
| Any default CSS or icons | The headless contract. A button with no `className` renders unstyled, which is correct and obvious |
| Declarative responsive positioning | Inherited concern; see `control.md` |
