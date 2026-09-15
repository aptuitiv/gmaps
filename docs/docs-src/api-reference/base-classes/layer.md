---
---

# Layer

The `Layer` object is used with objects that get added to a layer on the map.

For example, the [DataFeature](/api-reference/data-feature), [DataLayer](/api-reference/data-layer), [InfoWindow](/api-reference/infowindow), [Marker](/api-reference/marker), [Overlay](/api-reference/overlay), and [Polyline](/api-reference/polyline) classes extend this. The [Popup](/api-reference/popup), [Tooltip](/api-reference/tooltip), and [ImageOverlay](/api-reference/image-overlay) classes extend it through `Overlay`.

`Layer` extends [Evented](/api-reference/base-classes/evented).

:::info
The example code below uses variables to reference a Marker or Polyline object because you never set up a Layer object directly. This object contains shared methods between the classes that extend it.
:::

## Events

Below are the available layer events.

You can use the plain text name for the event, or you can use the [event constant](/api-reference/constants#layerevents).

| Event    | Description |
|----------|-------------|
| ready | The layer is loaded and ready for use. |

### ready

```js
marker.on('ready', () => {
    // Do something
});

// You can use the event constant
marker.on(G.MarkerEvents.READY, () => {
    // Do something
});

// Or, use the onReady method
marker.onReady(() => {
    // Do something
});
```

## Properties

| Property  | Type   | Description                             |
|-----------|--------|-----------------------------------------|
| isVisible | boolean | Whether the layer is visible. This only holds a true/false value. Changing this doesn't make the layer visible. It only sets that it's visible and the element that extends Layer needs to handle displaying itself. An error is thrown if the value set isn't a boolean. |

## Methods

- Methods inherited from [Evented](/api-reference/base-classes/evented#methods).

### attachInfoWindow

`attachInfoWindow(infoWindowValue: InfoWindowValue, event?: string): InfoWindow`

Attach an [InfoWindow](/api-reference/infowindow) to the layer. The layer could be a [Marker](/api-reference/marker) or a [Polyline](/api-reference/polyline). This makes it easy to have an InfoWindow show when the element is clicked.

| Parameter | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| infoWindowValue | [InfoWindowValue](/api-reference/infowindow#infowindow-type) | | Yes | The InfoWindow, InfoWindow options, or content for the InfoWindow |
| event | string  | 'click' | | The event to trigger displaying the InfoWindow. |

Allowed `event` values include:

- `click` - Toggle the display of the InfoWindow when clicking on the element.
- `clickon` - Show the InfoWindow when clicking on the element. It will always be shown and can't be hidden once the element is clicked. This may be useful if you want to show a popup each time you click on the map.
- `hover` - Show the InfoWindow when hovering over the element. Hide the InfoWindow when the element is no longer hovered.

```js
marker.attachInfoWindow('My content for the info window');
```

```js
polyline.attachInfoWindow('My content for the info window');
```

### attachPopup

`attachPopup(popupValue: AttachPopupValue, event?: string): Popup`

Attach a [popup](/api-reference/popup) to the layer. The layer could be a [Marker](/api-reference/marker) or a [Polyline](/api-reference/polyline). This makes it easy to have a popup show when the element is clicked.

| Parameter | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| popupValue | [PopupValue](/api-reference/popup#popup-type) or [PopupCallback](/api-reference/popup#popup-callback-type) | | Yes | The Popup, Popup options, or content for the Popup, or a function that returns one of those. |
| event | string  | 'click' | | The event to trigger displaying the popup. |

Allowed `event` values include:

- `click` - Toggle the display of the popup when clicking on the element.
- `clickon` - Show the popup when clicking on the element. It will always be shown and can't be hidden once the element is clicked. This may be useful if you want to show a popup each time you click on the map.
- `hover` - Show the popup when hovering over the element. Hide the popup when the element is no longer hovered.

```js
marker.attachPopup('My content for the popup');
```

```js
polyline.attachPopup('My content for the polyline popup');
```

Pass a function to work out the popup when it's shown rather than up front. It's called with the layer and can return the content, a [PopupOptions](/api-reference/popup#popup-options) object, or a [Popup](/api-reference/popup) object to show instead. See [PopupCallback](/api-reference/popup#popup-callback-type).

```js
marker.attachPopup((marker) => `<h3>${marker.getData('name')}</h3>`);
```

This is useful when the content depends on something that isn't known when the popup is set up, such as data that's loaded later.

```js
marker.attachPopup(() => ({
    className: 'detailPopup',
    content: buildContentFromCurrentState(),
}));
```

### attachTooltip

`attachTooltip(tooltipValue: AttachTooltipValue, event?: string): Tooltip`

Attach a [Tooltip](/api-reference/tooltip) to the layer. This makes it easy to show a tooltip when the element is hovered.

An example usage is attaching a tooltip to a marker.

| Parameter | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| tooltipValue | [TooltipValue](/api-reference/tooltip#tooltipvalue-type) or [TooltipCallback](/api-reference/tooltip#tooltip-callback-type) | | Yes | The tooltip value, or a function that returns one. |
| event | string | 'hover' | | The event to trigger the tooltip. |

Allowed `event` values include:

- `click` - Toggle the display of the tooltip when clicking on the element.
- `clickon` - Show the tooltip when clicking on the element. It will always be shown and can't be hidden once the element is clicked. This may be useful if you want to show a tooltip each time you click on the map.
- `hover` - Show the tooltip when hovering over the element. Hide the tooltip when the element is no longer hovered.

This is an alternate way to set a tooltip on an element compared to the [Tooltip attachTo() method](/api-reference/tooltip#attachto).

```js
marker.attachTooltip({
    className: 'MapTooltip',
    content: 'Marker tooltip here' 
});
```

```js
polyline.attachTooltip({
    className: 'MapTooltip',
    content: 'Polyline tooltip here' 
});
```

Pass a function to work out the tooltip when it's shown rather than up front. It's called with the layer and can return the content, a [TooltipOptions](/api-reference/tooltip#tooltip-options) object, or a [Tooltip](/api-reference/tooltip) object to show instead. See [TooltipCallback](/api-reference/tooltip#tooltip-callback-type).

```js
marker.attachTooltip((marker) => marker.getData('name'));
```

### closePopup

`closePopup(): void`

Closes the popup attached to the element. If no popup is attached then nothing happens.

```js
marker.closePopup();
```

### getMap

`getMap(): Map | null`

 Return the Map object or null if the Map object is not set.

 ```js
 const map = marker.getMap();
 ```

### getPopup

`getPopup(): Popup | undefined`

Return the popup object that was attached to this element. If there isn't a popup element attached then `undefined` is returned.

A popup object would be attached to this element with the [attachPopup](#attachpopup) method.

```js
const popup = marker.getPopup();
```

### hasMap

 `hasMap(): boolean`

 Returns whether the layer has been assgined to a map.

 ```js
 if (marker.hasMap()) {
    // Do something
 }
 ```

### hasPopup

`hasPopup(): boolean`

Returns whether a popup has been attached to the layer.

```js
if (marker.hasPopup()) {
// Do something
}
```

### init

`init(): Promise<void>`

Initializes the layer. The base `Layer` version does nothing and resolves right away. Classes that extend `Layer` override it to do any setup they need.

Other objects call this to wait for the layer to be set up before doing their thing. For example, attaching a tooltip to a marker waits for the marker to be initialized before attaching the tooltip.

:::info
This is used internally and in plugins. It's not intended to be called outside of this library.
:::

### onReady

`onReady(callback: EventCallback): void`

Callback for when the layer is loaded and ready for use.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
marker.onReady(() => {
    // Do something
})
```

### openPopup

`openPopup(): void`

Opens the popup attached to the element. If no popup is attached then nothing happens.

```js
marker.openPopup();
```

### removeMap

 `removeMap(): void`

 Clears the map object that the object is added to. This does not remove the object from the map and hide it.

### setMap

`setMap(map: Map | null): void`

Sets the map object that the layer is added to. This does not display the layer on the map. It only sets the map object for the layer.

It also sets the [isVisible](#properties) property to `true` if a map is passed, or `false` if `null` is passed.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| map | [Map](/api-reference/map) \| null | Yes | The map object, or `null` to clear it. |

```js
marker.setMap(mapObject);
```

### setPopup

`setPopup(popup: Popup | null): void`

Sets the [Popup](/api-reference/popup) object that is attached to the layer. This is what [getPopup](#getpopup) returns and what [openPopup](#openpopup), [closePopup](#closepopup), and [togglePopup](#togglepopup) work with.

:::info
This is called by the Popup object when it's attached to the layer. It's not intended to be called outside of this library.
:::

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| popup | [Popup](/api-reference/popup) \| null | Yes | The Popup object. |

### togglePopup

`togglePopup(): void`

Toggle displaying or hiding the attached popup depending on it's current state. If the popup is currently open, then it will be closed. If it is currently closed then it will be opened.

If there is no popup attached then nothing will happen.

```js
marker.togglePopup();
```
