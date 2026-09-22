---
---

# Control

A thing attached to the map. Anything positioned on a map is a control: a button, a logo, a legend, a message that appears when a search finds nothing.

[addCustomControl()](/api-reference/map#addcustomcontrol) puts an element on the map and that is all it does — it gives you back no handle on what it added, so nothing can be moved or taken off again. `Control` owns that lifecycle, and is the base class to extend when writing a control of your own.

It decides nothing about how a control looks. Every class name, every piece of content and every attribute comes from you, and no stylesheet ships with the library.

```js
const legend = G.control({
    element: '.js-mapLegend',
    map: myMap,
    position: G.ControlPosition.RIGHT_TOP,
});

// Later
legend.remove();
```

Use [Button](/api-reference/map-controls/button) instead if the control responds to clicks.

## Control options

Type `ControlOptions`.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| attributes | object | | Attributes to set on the element when it's built. `{ 'data-tip': 'Go home' }` |
| className | string | | Class name(s) for the element when it's built. |
| content | string \| HTMLElement \| Function | | The contents when the element is built. An HTML string, an element to append, or a function returning either. |
| element | HTMLElement \| string | | An existing element, or a selector for one. When this is set nothing is built and the element is used exactly as it is, so the other building options are ignored. |
| index | number | 0 | The order among the controls at the same position. Lower numbers come first. |
| map | [Map](/api-reference/map) | | The map to attach to. It can be attached later with [addTo()](#addto) instead. |
| position | [ControlPosition](/api-reference/constants#controlposition) | `BLOCK_START_INLINE_START` | Where the control goes on the map. |
| tag | string | `div` | The tag to build the element from. |

### Building or wrapping

Two ways to get the element. Either the library builds one from `tag`, `className`, `content` and `attributes`:

```js
G.control({
    className: 'MapBtn MapBtn-geo',
    content: '<svg class="Icon"><use xlink:href="#icon-location" /></svg>',
    tag: 'button',
});
```

Or you pass one that already exists, which is usually what you want for markup rendered by the server:

```js
G.control({ element: '.js-mapLegend' });
```

An element you pass is used as it is. Nothing is added to it and nothing is taken off.

## Properties

| Property | Type | Description |
|----------|------|-------------|
| element | [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) | The element for the control. Read only. |
| index | number | The order among the controls at the same position. Google reads this when it lays the controls out, so changing it only takes effect for a control that hasn't been added yet, or one that's removed and added again. |
| isAttached | boolean | Whether the control is on a map. Read only. |
| map | [Map](/api-reference/map) \| undefined | The map the control is attached to. Read only. |
| position | [ControlPosition](/api-reference/constants#controlposition) | Where the control is displayed. Setting it moves a control that's already attached. |

## Events

| Event | Description |
|-------|-------------|
| add | The control was attached to a map. |
| remove | The control was taken off a map. |

## Methods

### addTo

`addTo(map: Map): Control`

Attach the control to a map. This works before the map has been rendered — the map holds the control until it renders and then adds it.

A control that is already on another map is taken off that one first, so the same control can't end up on two maps.

### remove

`remove(): Control`

Take the control off the map. The element is left in place rather than destroyed, so the control can be added again, and so that an element you supplied is still yours afterwards.

## Writing your own control

Extend it. The subclass gets the element, the position, the ordering and the attach/remove lifecycle, and adds whatever it's for.

```js
class ZoomToHome extends G.Control {
    constructor(options) {
        super({ tag: 'button', ...options });
        this.element.addEventListener('click', () => {
            this.map.setCenter(options.home);
        });
    }
}
```

[Button](/api-reference/map-controls/button) is the worked example — it adds click handling and state on top of this class and nothing else.

See the [plugin guide](/plugin) for how to publish one.
