---
---

# Button

A [control](/api-reference/map-controls/control) that responds to clicks, and optionally remembers what state it's in.

:::info
`Button` is in its own entry point. Import it from `@aptuitiv/gmaps/button`, or use `G.button()` with the standalone browser script, which contains everything. See [installation](/installation/bundler).
:::

```js
import { button } from '@aptuitiv/gmaps/button';
```

Two things in one class.

An **action button** does something when clicked and has no state:

```js
button({
    className: 'MapBtn MapBtn-reset',
    content: '<svg class="Icon"><use xlink:href="#icon-repeat" /></svg>',
    map: myMap,
    onClick: () => myMap.fitBounds(),
    position: ControlPosition.LEFT_CENTER,
});
```

A **stateful button** can be on or off and available or not, and the DOM has to show which:

```js
const toggle = button({
    className: 'MapBtn MapBtn-layer',
    content: '<svg class="Icon"><use xlink:href="#icon-layer" /></svg>',
    enabled: false, // until the data loads
    map: myMap,
    position: ControlPosition.LEFT_CENTER,
    toggle: true,
    tooltipAttribute: 'data-tip-right',
    states: {
        enabled: { attributes: { 'data-loaded': 'yes' } },
        disabled: { attributes: { 'data-loaded': 'no' }, tooltip: null },
        active: { attributes: { 'data-visible': 'yes' }, tooltip: 'Hide the layer' },
        inactive: { attributes: { 'data-visible': 'no' }, tooltip: 'Show the layer' },
    },
});

toggle.onChange((active) => (active ? layer.show() : layer.hide()));
layer.onLoad(() => toggle.enable());
```

## You decide what each state looks like

The library never picks an attribute or a class name. You give it a mapping and it decides only *when* to apply it, so the state machine lives here and the vocabulary stays in your CSS.

Two bugs that hand-written versions of this tend to have are not reachable here:

- **A disabled button is still clickable.** The disabled state is usually styled so the button looks like it isn't there, while the click listener is still bound. A disabled `Button` ignores clicks.
- **Disabling leaves the active state behind.** Disabling also clears `active`, so the button can't be left looking switched on while the thing it controls has gone.

## Button options

Type `ButtonOptions`. Everything from [ControlOptions](/api-reference/map-controls/control#control-options) as well, except that `tag` defaults to `button`.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| active | boolean | `false` | Whether the button starts active. |
| enabled | boolean | `true` | Whether the button starts enabled. |
| onClick | Function | | Called when the button is clicked, only while it's enabled. Passed the button and the DOM event. |
| states | `ButtonStates` | | How each state shows up in the DOM. Leave it out for a button with no state. |
| tooltipAttribute | string | | The attribute a state's `tooltip` is written to. Defaults to `title` and `aria-label`. |
| toggle | boolean | `false` | Whether a click flips the active state. |

### Button states

Type `ButtonStates`, with a `ButtonStateStyle` for each of `active`, `inactive`, `enabled` and `disabled`.

| Value | Type | Description |
|-------|------|-------------|
| attributes | object | Attributes to set while this state holds. A `null` value removes the attribute. |
| className | string | Class name(s) to add while this state holds. Removed when the state ends, so the active and inactive class names don't accumulate. |
| text | string \| object | Text for the button, or `{ selector, text }` for an element inside it. |
| tooltip | string \| null | Tooltip text, written to `tooltipAttribute`. `null` removes it. |

### Accessibility

A built button gets `type="button"`, so it can't submit a form it happens to be inside. A toggle gets `aria-pressed`, and any button gets `aria-disabled` when it's disabled.

`aria-disabled` is used rather than the `disabled` property because the element isn't necessarily a `button`, and a disabled control is often still meant to be reachable by keyboard.

If you pass in an element that isn't a native button — a `div`, a `span`, an `a` with no `href` — it's given `role="button"` and `tabindex="0"`, and it activates on Enter and Space as well as on click. A click listener is attached to whatever element you provide, so something that wasn't interactive before is now, and it has to be reachable and operable with a keyboard.

Nothing is changed on an element that already carries that: a real `button`, a link with an `href`, a form control. Nor is a `role` or `tabindex` you set yourself overwritten — if you've said what the element is, that stands.

```js
// This div can be tabbed to, and Enter or Space activates it
button({ element: '.js-myControl', onClick: () => { /* ... */ } });
```

Space would otherwise scroll the page, so it's prevented on activation.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| active | boolean | Whether the button is active. Setting it applies the matching state and dispatches `change`. |
| enabled | boolean | Whether the button is enabled. Setting it to `false` also clears `active`. |

Plus everything from [Control](/api-reference/map-controls/control#properties).

## Events

| Event | Description |
|-------|-------------|
| click | The button was clicked while enabled. |
| change | The active state changed. |
| enabledchange | The enabled state changed. |

Plus `add` and `remove` from [Control](/api-reference/map-controls/control#events).

## Methods

| Method | Description |
|--------|-------------|
| activate() | Make the button active. |
| deactivate() | Make the button inactive. |
| disable() | Disable the button. |
| enable() | Enable the button. |
| onChange(callback) | Add a callback for when the active state changes. It's passed the new active value and the button. |
| onClick(callback) | Set the callback for a click. |
| toggle() | Flip the active state. |
| remove() | Take the button off the map and stop listening for clicks. |

Plus [addTo()](/api-reference/map-controls/control#addto) from `Control`.

## Wrapping markup you already rendered

Pass `element` and nothing is built. The state mapping still applies to it:

```js
button({
    element: '.js-showAccessible',
    map: myMap,
    position: ControlPosition.TOP_CENTER,
    toggle: true,
    states: {
        active: { className: 'is-active', text: { selector: '.js-text', text: 'Hide' } },
        inactive: { text: { selector: '.js-text', text: 'Show' } },
    },
}).onChange((active) => { /* ... */ });
```

## Building on it

`Button` is meant to be extended. A package can ship a set of ready-made buttons for a family of sites — a reset button, a layer toggle, a search trigger — each a small subclass that fixes the class names, icon and behaviour, while the state machine and lifecycle stay here.

```js
class ResetButton extends Button {
    constructor(options) {
        super({
            className: 'MapBtn MapBtn-reset',
            content: '<svg class="Icon"><use xlink:href="#icon-repeat" /></svg>',
            ...options,
        });
    }
}
```
