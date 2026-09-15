---
---

# InfoWindow

The InfoWindow object displays an InfoWindow on the map.

`InfoWindow` extends [Layer](/api-reference/base-classes/layer).

## Example usage

The easiest way to display an InfoWindow is to use the [attachInfoWindow()](/api-reference/base-classes/layer#attachinfowindow) method.

```js
const map = G.map('map1', { apiKey: 'my-api-key', center: { latitude: 48.864716, longitude: 2.3522 } });
map.load().then(() => {
    const marker = G.marker({
        latitude: 48.9,
        longitude: 2.4,
        map: map,
        title: 'My Marker',
    });

    marker.attachInfoWindow('Testing');
});
```

Alternately, you can display the InfoWindow when the marker is clicked.

```js
const map = G.map('map1', { apiKey: 'my-api-key', center: { latitude: 48.864716, longitude: 2.3522 } });
map.load();
const marker = G.marker({
    latitude: 48.9,
    longitude: 2.4,
    map: map,
    title: 'My Marker',
});
const infoWindow = G.infoWindow({
    content: 'This is a test',
});
marker.on('click', () => {
    infoWindow.show(marker);
});
```

## Creating the InfoWindow object

`G.infoWindow(options?: InfoWindowValue): InfoWindow`

There are a few ways that you can setup the InfoWindow object.

**No parameters.**

`G.infoWindow(): InfoWindow`

```js
const infoWindow = G.infoWindow();
```

**Pass the options.**

`G.infoWindow(options: InfoWindowOptions): InfoWindow`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [InfoWindowOptions](#infowindow-options) | Yes | The options. |

```js
const infoWindow = G.infoWindow({content: 'Hello!'});
```

**Pass an existing InfoWindow object.**

`G.infoWindow(object: InfoWindow): InfoWindow`

In this case the `InfoWindow` object is simply returned.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| object | InfoWindow | Yes | A InfoWindow object. |

```js
const infoWindow = G.infoWindow(infoWindowObject);
```

**Pass the InfoWindow content.**

`G.infoWindow(content: string|HTMLElement|Text): InfoWindow`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| content | string, HTMLElement, or Text | Yes | The InfoWindow content. |

```js
const infoWindow = G.infoWindow('My InfoWindow content');
```

```js
const content = document.createElement('div');
content.classList.add('myInfoWindowClass');
content.innerHTML = 'This is my InfoWindow';
const infoWindow = G.infoWindow(content);
```

## InfoWindow type

The [`attachInfoWindow()`](/api-reference/base-classes/layer#attachinfowindow) function and other methods that accept an InfoWindow value accept `InfoWindowValue` as the value type.

The `InfoWindowValue` can be one of the following values:

- `InfoWindow` object
- [InfoWindowOptions](#infowindow-options) object
- A string containing the content for the InfoWindow
- An HTMLElement that will be the content for the InfoWindow.
- A [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) node that will be the content for the InfoWindow.

## InfoWindow options

Type `InfoWindowOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| ariaLabel | string |  | The aria label for the InfoWindow. |
| autoClose | boolean | true | Whether to automatically close other open InfoWindows when opening another one. |
| content | string or [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) or [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text)  | | The content for the InfoWindow. |
| disableAutoPan | boolean | | Whether to disable panning the map to make the InfoWindow fully visible when it shows. |
| event | string | 'click' | The event to trigger the display of the InfoWindow. Allowed values are `click`, `clickon`, and `hover`. This is an alternate way of setting the trigger event than passing the event to [attachTo](#attachto) or [attachInfoWindow](/api-reference/base-classes/layer#attachinfowindow). |
| focus | boolean | false | Whether focus should be moved to the InfoWindow when it's opened. |
| maxWidth | number | | The maximum width of the InfoWindow, regardless of content's width |
| minWidth | number | | The minimum width of the InfoWindow, regardless of content's width |
| pixelOffset | [SizeValue](/api-reference/utilities/size#sizevalue-type) | [0, -4] | The offset, in pixels, of the tip of the info window from the point on the map at whose geographical coordinates the info window is anchored. If an InfoWindow is opened from an anchor, the pixelOffset will be calculated from the anchor's anchorPoint property. |
| position | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) | | The InfoWindow position. You don't need to set this if you're attaching the InfoWindow to a [Marker](/api-reference/marker). |
| toggleDisplay | boolean | true | Whether clicking the thing that opened the InfoWindow should also close it. This is set to `false` when the InfoWindow is attached with the `clickon` or `hover` event. |
| zIndex | number |  | The zIndex of the InfoWindow |

## Events

All of the [Google Map InfoWindow events](https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow-Events) can used. Below are the InfoWindow events specific to this library.

You can use the plain text name for the event, or you can use the [event constant](/api-reference/constants#infowindowevents).

| Event    | Description |
|----------|-------------|
| ready | The InfoWindow is loaded and ready for use. |

### ready

```js
infoWindow.on('ready', () => {
    // Do something
});

// You can use the event constant
infoWindow.on(G.InfoWindowEvents.READY, () => {
    // Do something
});

// Or, use the onReady method
infoWindow.onReady(() => {
    // Do something
});
```

## Properties

- Properties inherited from [Layer](/api-reference/base-classes/layer#properties).

| Property | Type | Description |
|--------|------|-------------|
| ariaLabel  | string | The aria label for the InfoWindow. It can be set with a string or a number. |
| content | string or [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) or [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) | The content for the InfoWindow. |
| disableAutoPan | boolean | Whether to disable panning the map to make the InfoWindow fully visible when it shows. |
| event | string | The event to trigger the display of the InfoWindow. Allowed values are `click`, `clickon`, and `hover`. This is an alternate way of setting the trigger event than passing the event to [attachTo](#attachto) or [attachInfoWindow](/api-reference/base-classes/layer#attachinfowindow). An error is thrown if any other value is set. |
| maxWidth | number | The maximum width of the InfoWindow, regardless of content's width. It can be set with a number or a numeric string. |
| minWidth | number | The minimum width of the InfoWindow, regardless of content's width. It can be set with a number or a numeric string. |
| pixelOffset | [Size](/api-reference/utilities/size) | The offset, in pixels, of the tip of the info window from the point on the map at whose geographical coordinates the info window is anchored. If an InfoWindow is opened from an anchor, the pixelOffset will be calculated from the anchor's anchorPoint property. It can be set with a [SizeValue](/api-reference/utilities/size#sizevalue-type). |
| position | [LatLng](/api-reference/utilities/latlng) | The InfoWindow position. It can be set with a [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type). |
| zIndex | number | The zIndex of the InfoWindow. It can be set with a number or a numeric string. |

## Methods

- Methods inherited from [Layer](/api-reference/base-classes/layer#methods).
- Methods inherited from [Evented](/api-reference/base-classes/evented#methods).
- Methods inherited from [Base](/api-reference/base-classes/base#methods)
  
### attachTo

`attachTo(element: Map | Layer, event?: 'click' | 'clickon' | 'hover'): Promise<InfoWindow>`

Attach the InfoWindow to a map or an element that extends the [Layer object](/api-reference/base-classes/layer). By default the InfoWindow is shown when the element is clicked.

Elements that extend [Layer](/api-reference/base-classes/layer) include [Marker](/api-reference/marker), [InfoWindow](/api-reference/infowindow), and [Popup](/api-reference/popup). See [show()](#show) for the elements that the InfoWindow can be shown on.

An InfoWindow can only be attached once. Calling `attachTo()` again on the same InfoWindow does nothing.

| Parameter | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| element | [Map](/api-reference/map) or [Layer](/api-reference/base-classes/layer) | | Yes | The element to attach the InfoWindow to. |
| event | 'click', 'clickon', or 'hover' | 'click' | | The event to trigger the InfoWindow. If it's not set then the `event` [option](#infowindow-options) is used. |

Allowed `event` values include:

- `click` - Toggle the display of the InfoWindow when clicking on the element.
- `clickon` - Show the InfoWindow when clicking on the element. It will always be shown and can't be hidden once the element is clicked. This may be useful if you want to show a InfoWindow each time you click on the map.
- `hover` - Show the InfoWindow when hovering over the element. Hide the InfoWindow when the element is no longer hovered.

```js
const infoWindow = G.infoWindow({
    content: 'This is a info window on a marker',
});
infoWindow.attachTo(marker);
```

```js
const infoWindow = G.infoWindow({
    content: 'This is a info window on a map',
});
infoWindow.attachTo(map, 'clickon');
```

### close

`close(): InfoWindow`

Hides the InfoWindow. Alias to [hide()](#hide).

```js
infoWindow.close();
```
  
### hasContent

`hasContent(): boolean`

Returns whether the InfoWindow has any content set.

```js
if (infoWindow.hasContent()) {
    // Do something
}
```

### hide

`hide(): InfoWindow`

Hides the InfoWindow.

```js
infoWindow.hide();
```

### isOpen

`isOpen(): boolean`

Returns whether the InfoWindow is open.

```js
if (infoWindow.isOpen()) {
    // Do something
}
```

### onReady

`onReady(callback: EventCallback): void`

Callback for when the InfoWindow is loaded and ready for use.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
infoWindow.onReady(() => {
    // Do something
})
```

### open

`open(element: Map | Layer): Promise<InfoWindow>`

Show the InfoWindow for the `element`. Alias to [show()](#show).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| element | [Map](/api-reference/map) or [Layer](/api-reference/base-classes/layer)  | Yes  | The element to show the InfoWindow on. |

```js
infoWindow.open(markerObj);
```

```js
infoWindow.open(mapObj);
```

### setContent

`setContent(content: string | HTMLElement | Text): InfoWindow`

Set the InfoWindow content.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| content | string or [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) or [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) | Yes  | The InfoWindow content. |

```js
infoWindow.setContent('This is the content');
```

### setOptions

`setOptions(options: InfoWindowOptions): InfoWindow`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [InfoWindowOptions](#infowindow-options) | Yes  | The InfoWindow options. |

```js
infoWindow.setOptions({content: 'Hi!'});
```

### setPosition

`setPosition(position: LatLngValue): InfoWindow`

Set the position of the InfoWindow.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| position | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) | Yes  | The InfoWindow position. |

```js
infoWindow.setPosition([49.864716, 2.6522]);
```

### setZIndex

`setZIndex(zIndex: number | string): InfoWindow`

Set the zIndex for the InfoWindow.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| zIndex | number or string | Yes  | The InfoWindow zIndex. A numeric string is converted to a number. |

```js
infoWindow.setZIndex(3);
```

### show

`show(element: Map | Layer): Promise<InfoWindow>`

Shows the InfoWindow for the `element`. The element needs to be a [Map](/api-reference/map) or a [Marker](/api-reference/marker).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| element | [Map](/api-reference/map) or [Layer](/api-reference/base-classes/layer)  | Yes  | The element to show the InfoWindow on. |

```js
infoWindow.show(markerObj);
```

```js
infoWindow.show(mapObj);
```

If a [Marker](/api-reference/marker) is passed as the element then the marker's position is automatically used to position the InfoWindow about the marker.

```js
marker.on('click', () => {
    infoWindow.show(marker);
});
```

If a [Map](/api-reference/map) is passed as the element then you also need to call [setPosition()](#setposition) to set the latitude/longitude position of the InfoWindow.

```js
map.on('click', (e) => {
    infoWindow.setPosition(e.latLng);
    infoWindow.show(map);
});
```

By default if an InfoWindow is already shown then it'll be hidden automatically. This is controlled by the `toggleDisplay` [option](#infowindow-options). If you want the InfoWindow to show on the map where you click then you'll need to hide it first.

```js
map.on('click', (e) => {
    infoWindow.setPosition(e.latLng);
    infoWindow.hide();
    infoWindow.show(map);
});
```

If you attach the InfoWindow to the Map or Marker object then the positioning and showing/hiding is handled automatically.

```js
map.attachInfoWindow(infoWindow);
```

```js
marker.attachInfoWindow(infoWindow);
```

### toggle

`toggle(element: Map | Layer): void`

Toggle the display of the InfoWindow on the map.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| element | [Map](/api-reference/map) or [Layer](/api-reference/base-classes/layer) | Yes | The element to show the InfoWindow on. |

```js
infoWindow.toggle(map);
```

### toGoogle

`toGoogle(): google.maps.InfoWindow`

Returns the Google Maps InfoWindow object.

```js
const googleObject = infoWindow.toGoogle();
```
