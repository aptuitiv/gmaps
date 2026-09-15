---
---

# Tooltip

The `Tooltip` object displays a tooltip element when hovering over a marker or polyline.

`Tooltip` extends [Overlay](/api-reference/overlay).

## Example usage

```js
const map = G.map('map1', {
    latitude: 40.730610,
    longitude: -73.935242,
    zoom: 8
});
map.show();
const marker = G.marker({
    latitude: 40.730610,
    longitude: -73.935242,
    map: map,
    title: 'My Marker',
    tooltip: 'This is a tooltip'
});
```

The `tooltip` parameter on the [Marker](/api-reference/marker) creates the Tooltip object with the content specified. It's then displayed when hovering over the marker.

Tooltips are typically attached to a marker or polyline and show when hovering that element. What makes them different from a popop or other overlay object is that they automatically show when hovering on something else.

However, you can also manually display the tooltip. In the example below we show the tooltip at a specific location on the map. This isn't the common use case, but it is possible.

```js
const tooltip = G.tooltip({
    className: 'my-tooltip',
    content: 'This is a tooltip',
    map: map,
    position: { lat: 40.7, lng: -73.9 }
});
```

Instead of passing the `tooltip` parameter on the [Marker](/api-reference/marker), you can use the [attachTo](#attachto) method to attach the tooltip to a marker. It will show when the marker is hovered.

```js
const marker = G.marker({
    latitude: 40.730610,
    longitude: -73.935242,
    map: map,
    title: 'My Marker',
});
const tooltip = G.tooltip({
    className: 'my-tooltip',
    content: 'This is a tooltip',
});
tooltip.attachTo(marker);
```

You can also attach the tooltip to a map to show when hovering over the map. The tooltip will follow the mouse as it moves around over the map.

```js
const map = G.map('map', { center: [40.7128, -74.0060] });
map.show();
const tooltip = G.tooltip({
    className: 'my-tooltip',
    content: 'This is a tooltip',
});
tooltip.attachTo(map);
```

## Creating the Tooltip object

`G.tooltip(options?: TooltipValue): Tooltip`

The following are equivalent ways to set up the `Tooltip` object.

**No parameters.**

`G.tooltip(): Tooltip`

```js
const tooltip = G.tooltip();
```

**Pass the tooltip options.**

`G.tooltip(options: TooltipOptions): Tooltip`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [TooltipOptions](#tooltip-options) | Yes | The tooltip options. |

```js
const tooltip = G.tooltip({
    className: 'my-tooltip',
    content: 'This is a tooltip',
});
```

**Pass a tooltip object.**

`G.tooltip(object: Tooltip): Tooltip`

In this case the `Tooltip` object is simply returned.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| object | Tooltip | Yes | The existing tooltip object. |

```js
const tooltip = G.tooltip(existingTooltipObject);
```

**Pass the tooltip content.**

`G.tooltip(content: string|HTMLElement|Text): Tooltip`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| content | string, HTMLElement, or Text | Yes | The tooltip content. |

When a string of content is passed, the `tooltip` class name is added to the tooltip container.

```js
const tooltip = G.tooltip('My tooltip content');
```

```js
const content = document.createElement('div');
content.classList.add('myTooltipClass');
content.innerHTML = 'This is my tooltip';
const tooltip = G.tooltip(content);
```

## TooltipValue type

The [`attachTooltip()`](/api-reference/base-classes/layer#attachtooltip) function and other methods that accept a tooltip value accept `TooltipValue` as the value type.

The `TooltipValue` can be one of the following values:

- `Tooltip` object
- [TooltipOptions](#tooltip-options) object
- A string containing the content for the tooltip
- An HTMLElement that will be the content for the tooltip.
- A [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) node that will be the content for the tooltip.

## Tooltip callback type

Type `TooltipCallback`

Anywhere a tooltip value is accepted you can pass a function instead of a fixed value. It's called every time the tooltip is about to be shown and is passed the object that the tooltip is attached to.

`(target?: Map | Layer) => TooltipValue`

It returns a [TooltipValue](#tooltipvalue-type), so it can return any of the following.

- A string, `HTMLElement` or `Text` node, which becomes the content of the tooltip.
- A [TooltipOptions](#tooltip-options) object, which is set on the tooltip. Use this when more than the content changes.
- A [Tooltip](#tooltipvalue-type) object, which is shown instead.

```js
marker.attachTooltip((marker) => marker.getData('name'));
```

This is the same idea as [PopupCallback](/api-reference/popup#popup-callback-type), and works the same way.

The type that combines the two is `AttachTooltipValue`, which is `TooltipValue | TooltipCallback`. That's what [attachTooltip()](/api-reference/base-classes/layer#attachtooltip) accepts.

When the callback returns a `Tooltip` object, that tooltip is the one shown and the tooltip that `attachTooltip()` returned is never displayed. If the callback returns a different tooltip than the one currently showing, the one showing is hidden first.

When a `hover` tooltip is attached to the map, the callback is called when the mouse moves over the map. It isn't called again as the mouse moves around. The tooltip that is showing just follows the cursor.

A data layer uses its own version of the callback, [DataTooltipCallback](/api-reference/data-layer#tooltip-callback-type), which is passed the [DataFeature](/api-reference/data-feature) that the mouse is over. See [Attaching to a data layer](#attaching-to-a-data-layer).

## Attach event type

Type `AttachEventValue`

The events that can show an attached tooltip. This is the same type that popups use. See [AttachEventValue](/api-reference/popup#attach-event-type).

`'click' | 'clickon' | 'hover'`

The default for a tooltip is `hover`.

## Attaching to a data layer

A tooltip can be attached to every feature in a [DataLayer](/api-reference/data-layer#attachtooltip), or to a single [DataFeature](/api-reference/data-feature#attachtooltip). The value is a `DataTooltipValue`, which accepts the same things as a [TooltipValue](#tooltipvalue-type) plus a [DataTooltipCallback](/api-reference/data-layer#tooltip-callback-type) function. A string of content can hold `{property}` placeholders, which are replaced with the properties of the feature that the tooltip is shown for. See [Tooltip value type](/api-reference/data-layer#tooltip-value-type) for more details.

```js
map.data.attachTooltip('{name}');
```

A tooltip attached to a single feature takes precedence over one attached to the whole layer. A data layer can have both a tooltip and a popup attached at the same time.

## Tooltip options

Type `TooltipOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| center | boolean | true | Whether to center the tooltip horizontally on the element. Useful if the tooltip is on a marker. If this is `true` then `transform: translate(-50%, 0)` is added to the tooltip container `div`. |
| className | string | | The class name(s) for the tooltip container. This replaces the `tooltip` class name that is added when the tooltip is created with a string of content. |
| content | string, [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement), or [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) | | The content for the tooltip. |
| event | string | 'hover' | The event to trigger the display of the tooltip. Allowed values are `click`, `clickon`, and `hover`. This is an alternate way of setting the trigger event than passing the event to [attachTo](#attachto) or [attachTooltip](/api-reference/base-classes/layer#attachtooltip). |
| map | [Map](/api-reference/map) | | The map to display the tooltip on. Setting this shows the tooltip on the map. |
| offset | [PointValue](/api-reference/utilities/point#pointvalue-type) | [0, 4] | The x/y pixel offset for the tooltip. |
| position | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) |  | The tooltip position. |
| styles | object | | An object of styles to apply to the tooltip. |
| theme | string | 'default' | The theme to use for the tooltip. Set to 'none' to not have any default styles and to use your own. Note, if `center` is `true` then `transform: translate(-50%, 0)` will still be set to horizontally center the tooltip on the element. |

## Properties

- Properties inherited from [Overlay](/api-reference/overlay#properties).
- Properties inherited from [Layer](/api-reference/base-classes/layer#properties).
  
| Property  | Type   | Description                             |
|-----------|--------|-----------------------------------------|
| center | boolean | Whether to center the tooltip horizontally on the element. This does the same as the `center` [option](#tooltip-options). |
| content | string, [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement), or [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) | The content for the tooltip. This does the same as the `content` [option](#tooltip-options).|
| event | string | The event to trigger the display of the tooltip. Allowed values are `click`, `clickon`, and `hover`. This is an alternate way of setting the trigger event than passing the event to [attachTo](#attachto) or [attachTooltip](/api-reference/base-classes/layer#attachtooltip). An error is thrown if any other value is set. |
| theme | string | The theme to use for the tooltip. This does the same as the `theme` [option](#tooltip-options). |

## Methods

- Methods inherited from [Overlay](/api-reference/overlay#methods).
- Methods inherited from [Layer](/api-reference/base-classes/layer#methods).
- Methods inherited from [Evented](/api-reference/base-classes/evented#methods).
- Methods inherited from [Base](/api-reference/base-classes/base#methods).

### attachTo

`attachTo(element: Map | Layer, event?: 'click' | 'clickon' | 'hover', callback?: TooltipCallback): Promise<Tooltip>`

Attach the tooltip to a map or an element that extends the [Layer object](/api-reference/base-classes/layer). By default the tooltip is shown when hovering the mouse over the element.

Elements that extend [Layer](/api-reference/base-classes/layer) include [Marker](/api-reference/marker), [Polyline](/api-reference/polyline), [InfoWindow](/api-reference/infowindow), and [Popup](/api-reference/popup).

A tooltip can only be attached once. Calling `attachTo()` again on the same tooltip does nothing.

| Parameter | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| element | [Map](/api-reference/map) or [Layer](/api-reference/base-classes/layer) | | Yes | The element to attach the tooltip to. |
| event | [AttachEventValue](#attach-event-type) | 'hover' | | The event to trigger the tooltip. If it's not set then the `event` [option](#tooltip-options) is used. |
| callback | [TooltipCallback](#tooltip-callback-type) | | | A function that works out what to show each time the tooltip is displayed. Usually you'd pass the function to [attachTooltip()](/api-reference/base-classes/layer#attachtooltip) instead of using this directly. |

Allowed `event` values include:

- `click` - Toggle the display of the tooltip when clicking on the element.
- `clickon` - Show the tooltip when clicking on the element. It will always be shown and can't be hidden once the element is clicked. This may be useful if you want to show a tooltip each time you click on the map.
- `hover` - Show the tooltip when hovering over the element. Hide the tooltip when the element is no longer hovered.

```js
const tooltip = G.tooltip({
    className: 'my-tooltip',
    content: 'This is a tooltip on a marker',
});
tooltip.attachTo(marker);
```

```js
const tooltip = G.tooltip({
    className: 'my-tooltip',
    content: 'This is a tooltip on a map',
});
tooltip.attachTo(map, 'clickon');
```

### hasContent

`hasContent(): boolean`

Returns whether the tooltip has any content set.

```js
if (tooltip.hasContent()) {
    // Do something
}
```

### setContent

`setContent(content: string | HTMLElement): Tooltip`

Set the content for the tooltip.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| content | string or HTMLElement| Yes | The tooltip content. |

```js
tooltip.setContent('My Tooltip');
```

```js
tooltip.setContent('<b>Some bold HTML</b>');
```

```js
const div = document.createElement('div');
div.style.background = '#fff';
div.style.color = '#ff0000';
div.style.padding = '2px';
div.innerHTML = 'HTMLElement tooltip';

tooltip.setContent(div);
```

### setOptions

`setOptions(options: TooltipOptions): Tooltip`

Set the options for the tooltip.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [TooltipOptions](#tooltip-options) | Yes | The tooltip options. |

```js
tooltip.setOptions({className: 'my-class', position: [38.6270, 90.1994]});
```
