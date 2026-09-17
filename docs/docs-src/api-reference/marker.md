---
---

# Marker

The Marker object displays a single marker on the map.

`Marker` extends [Layer](/api-reference/base-classes/layer).

## Example usage

```js
const map = G.map('map', { apiKey: 'my-api-key', center: { latitude: 48.864716, longitude: 2.3522 } });
map.load().then(() => {
    const marker = G.marker({
        latitude: 48.9,
        longitude: 2.4,
        map: map,
        title: 'My Marker',
    });
});
```

## Creating the Marker object

`G.marker(options?: MarkerOptions): Marker`

There are a few ways that you can setup the `Marker` object.

**No parameters.**

`G.marker(): Marker`

```js
const marker = G.marker();
```

**Pass the marker options.**

`G.marker(options: MarkerOptions): Marker`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [MarkerOptions](#marker-options) | Yes | The options. |

```js
const marker = G.marker({position: [48.9, 2.4]});
```

**Set the location only.**

`G.marker(position: LatLngValue): Marker`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| position | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) | Yes | The latitude/longitude value. |

```js
const marker = G.marker([48.9, 2.4]);
```

**Set the location and the options.**

`G.marker(position: LatLngValue, options: MarkerOptions): Marker`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| position | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) | Yes | The latitude/longitude value. |
| options | [MarkerOptions](#marker-options) | Yes | The options. |

```js
const marker = G.marker([48.9, 2.4], {title: 'Marker title'});
```

**Pass an existing Marker object.**

`G.marker(object: Marker): Marker`

In this case the `Marker` object is simply returned.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| object | Marker | Yes | A Marker object. |

```js
const marker = G.marker(markerObject);
```

## MarkerLabel type

The `MarkerLabel` type is an object that represents the label value for the marker. You can either pass a string for the label value, or an object.

The MarkerLabel type is the same as the [Google Maps MarkerLabel interface](https://developers.google.com/maps/documentation/javascript/reference/marker#MarkerLabel).

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| className | string | | The class attribute value for the label. |
| color | string | black | The label text color |
| fontFamily | string | | The label text font family |
| fontSize | string or number | 14px | The label text font size. If it's a number then "px" is added to the end of it. |
| fontWeight | string | | The label text font weight |
| text | string or number | | The label text. A number is converted to a string. |

## Custom data type

You can attach an object of data to the marker object to hold some custom data. An example usage would be to include some content that you want to show in a popup when a marker is clicked.

The `CustomData` type represents this data. Essentially it's an object that can hold any type of data

```js
type CustomData = {
    [key: string]: any;
}
```

## Marker options

Type `MarkerOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| anchorPoint | [PointValue](/api-reference/utilities/point#pointvalue-type) |  | The offset from the marker's position to the tip of an InfoWindow that has been opened with the marker as anchor. |
| cursor | string | pointer | The cursor type to show on hover. |
| data | [CustomData](#custom-data-type) | | An optional object to hold custom data to attach to the marker object. |
| drag | boolean | false | Whether the marker can be dragged on the map. |
| icon | [IconValue](/api-reference/utilities/icon#iconvalue-type) | | The icon value for the marker. If both `icon` and `svgIcon` are set, `icon` is used. |
| label | string or [MarkerLabel](#markerlabel-type) | | The label for the marker. |
| lat | number or string | |  The latitude for the marker. This is an alternate option to `position` and `latitude`. You should set this if you are setting `longitude` or `lng`. |
| latitude | number or string | |  The latitude for the marker. This is an alternate option to `position` and `lat`. You should set this if you are setting `longitude` or `lng`. |
| lng | number or string | |  The longitude for the marker. This is an alternate option to `position` and `longitude`. You should set this if you are setting `latitude` or `lat`. |
| longitude | number or string | |  The longitude for the marker. This is an alternate option to `position` and `lng`. You should set this if you are setting `latitude` or `lat`. |
| map | [Map](/api-reference/map) | | The map that the marker should show on. |
| optimized | boolean | | Whether to optimize the rendering of the marker. Optimization renders many markers as a single static element, which helps when there are a large number of markers. If not set then Google decides. Optimization has no effect on vector maps. |
| position | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) | | The Marker position |
| svgIcon | string or [SvgSymbolOptions](/api-reference/utilities/svgsymbol#svgsymbol-options) or [SvgSymbol](/api-reference/utilities/svgsymbol) | | An SVG icon for the marker. A string is the full SVG markup (the whole `<svg>` element, not just the path code). An object is passed to [G.svgSymbol()](/api-reference/utilities/svgsymbol). This is ignored if `icon` is set. See [SVG icons](#svg-icons). |
| title | string | | The title for the marker. If a custom [tooltip](/api-reference/tooltip) is not used, this will show as a default tooltip on the marker. |
| tooltip | [TooltipValue](/api-reference/tooltip#tooltipvalue-type) | | The tooltip for the marker. This will show when hovering over the marker. If `title` is also set, it's used as the tooltip content when the tooltip options don't set `content`, and the default title tooltip isn't shown. |

## SVG icons

The `svgIcon` option lets you use SVG for the marker icon. It can be set in two ways.

**Pass the full SVG markup as a string.**

The string must be the complete `<svg>` element, not only the path code. The markup is base64 encoded into a `data:image/svg+xml;base64,...` URL, and that URL is used as the marker icon image. Because it's shown as an image, include the `xmlns` attribute and set a `width` and `height`.

```js
const marker = G.marker({
    position: [48.9, 2.4],
    map: map,
    svgIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#5284ed" stroke="#ffffff" stroke-width="2" />
    </svg>`,
});
```

The markup is encoded with the browser's `btoa()` function, so it can only contain Latin-1 characters.

**Pass an SvgSymbol options object or an SvgSymbol object.**

The value is passed to [G.svgSymbol()](/api-reference/utilities/svgsymbol) and the resulting [SvgSymbol](/api-reference/utilities/svgsymbol) is used as the icon. With this form you only set the SVG `path` value, not the full SVG markup. See the [SvgSymbol options](/api-reference/utilities/svgsymbol#svgsymbol-options).

```js
const marker = G.marker({
    position: [48.9, 2.4],
    map: map,
    svgIcon: {
        path: 'M0,6a6,6 0 1,0 12,0a6,6 0 1,0 -12,0',
        anchor: [6, 6],
        fillColor: '#5284ed',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
    },
});
```

To change the icon after the marker is created, use [setIcon()](#seticon).

## Events

The [Google Map marker events](https://developers.google.com/maps/documentation/javascript/reference/marker#Marker-Events) can be used, along with the `ready` event that is specific to this library.

You can use the plain text name for the event, or you can use the [event constant](/api-reference/constants#markerevents). Most events also have a helper method to add a listener.

| Event | Constant | Helper method | Description |
|-------|----------|---------------|-------------|
| animation_changed | ANIMATION_CHANGED | [onAnimationChanged](#onanimationchanged) | The marker's animation changes. |
| click | CLICK | [onClick](#onclick) | The marker icon is clicked. |
| clickable_changed | CLICKABLE_CHANGED | [onClickableChanged](#onclickablechanged) | The marker's clickable property changes. |
| contextmenu | CONTEXT_MENU | [onContextMenu](#oncontextmenu) | The DOM contextmenu event is fired on the marker. |
| cursor_changed | CURSOR_CHANGED | [onCursorChanged](#oncursorchanged) | The marker's cursor property changes. |
| dblclick | DBLCLICK | [onDblClick](#ondblclick) | The marker is double clicked. |
| drag | DRAG | [onDrag](#ondrag) | The user drags the marker. |
| dragend | DRAG_END | [onDragEnd](#ondragend) | The user stops dragging the marker. |
| draggable_changed | DRAGGABLE_CHANGED | [onDraggableChanged](#ondraggablechanged) | The marker's draggable property changes. |
| dragstart | DRAG_START | [onDragStart](#ondragstart) | The user starts dragging the marker. |
| flat_changed | FLAT_CHANGED | [onFlatChanged](#onflatchanged) | The marker's flat property changes. |
| icon_changed | ICON_CHANGED | [onIconChanged](#oniconchanged) | The marker's icon property changes. |
| mousedown | MOUSE_DOWN | [onMouseDown](#onmousedown) | The user's mouse is pressed down on the marker. |
| mouseout | MOUSE_OUT | [onMouseOut](#onmouseout) | The user's mouse leaves the marker icon. |
| mouseover | MOUSE_OVER | [onMouseOver](#onmouseover) | The user's mouse enters the marker icon. |
| mouseup | MOUSE_UP | [onMouseUp](#onmouseup) | The mouseup event is fired on the marker. |
| position_changed | POSITION_CHANGED | [onPositionChanged](#onpositionchanged) | The marker's position property changes. |
| ready | READY | [onReady](#onready) | The marker is loaded and ready for use. This event is specific to this library. |
| shape_changed | SHAPE_CHANGED | [onShapeChanged](#onshapechanged) | The marker's shape property changes. |
| title_changed | TITLE_CHANGED | [onTitleChanged](#ontitlechanged) | The marker's title property changes. |
| visible_changed | VISIBLE_CHANGED | [onVisibleChanged](#onvisiblechanged) | The marker's visible property changes. |
| zindex_changed | ZINDEX_CHANGED | [onZIndexChanged](#onzindexchanged) | The marker's zIndex property changes. |

```js
marker.on('click', (e) => {
    // Do something
});

// Or, use the event constant
marker.on(G.MarkerEvents.CLICK, (e) => {
    // Do something
});

// Or, use the helper method
marker.onClick((e) => {
    // Do something
});
```

### ready

```js
marker.on('ready', () => {
    // Do something - the marker is ready
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

- Properties inherited from [Layer](/api-reference/base-classes/layer#properties).

| Property  | Type   | Description                                   |
|-----------|--------|-----------------------------------------------|
| anchorPoint | [Point](/api-reference/utilities/point) | The offset from the marker's position to the tip of an InfoWindow that has been opened with the marker as anchor. It can be set with a [PointValue](/api-reference/utilities/point#pointvalue-type). |
| cursor | string | The cursor type to show on hover. |
| data | [CustomData](#custom-data-type) | An object that holds custom data to attach to the marker object. |
| drag | boolean | Whether the marker can be dragged on the map. Setting it calls [enableDrag()](#enabledrag) or [disableDrag()](#disabledrag). |
| icon | [Icon](/api-reference/utilities/icon), [SvgSymbol](/api-reference/utilities/svgsymbol), or string | The icon value for the marker. A string is an image URL. If the `svgIcon` option was set with SVG markup, this is the `data:image/svg+xml` URL. Setting it calls [setIcon()](#seticon). |
| label | string, number, or [MarkerLabel](#markerlabel-type) | The label for the marker. |
| map | [Map](/api-reference/map) | The map that the marker should show on. Set it to `null` to remove the marker from the map. |
| optimized | boolean or undefined | Whether the marker rendering is optimized. It's `undefined` if it hasn't been set, in which case Google decides. Setting it calls [setOptimized()](#setoptimized). |
| position | [LatLng](/api-reference/utilities/latlng) | The Marker position. If the marker was dragged, this is its current position. It can be set with a [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type). |
| title | string | The title for the marker. If a custom [tooltip](/api-reference/tooltip) is not used, this will show as a default tooltip on the marker. |

## Methods

- Methods inherited from [Layer](/api-reference/base-classes/layer#methods).
- Methods inherited from [Evented](/api-reference/base-classes/evented#methods).
- Methods inherited from [Base](/api-reference/base-classes/base#methods)
  
### disableDrag

`disableDrag(): Promise<Marker>`

Disable the ability to drag the marker on the map

```js
marker.disableDrag();
```

### display

`display(map: Map): Marker`

Add the marker to the map and display it. This is an alias to [show()](#show).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| map | [Map](/api-reference/map) | Yes | The map object |

```js
marker.display(map);
```

### enableDrag

`enableDrag(): Promise<Marker>`

Enable the ability to drag the marker on the map

```js
marker.enableDrag();
```

### getData

`getData(key?: string): any`

Gets either all the custom data attached to the marker object or the value for a specific data key from the custom data object.

If the `key` is specified but the value doesn't exist in the custom data object, then `null` is returned.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| key | string | No | The object key to get a specific piece of data from the custom data obect. If this is not set then the entire custom data object is returned. |

Get the entire data object.

```js
const customData = marker.getData();
```

Get a specific value from the custom data object.

```js
const customValue = marker.getData('dataKey');
```

### getPosition

`getPosition(): LatLng`

Get the marker position

```js
const position = marker.getPosition();
```

### hide

`hide(): Marker`

Remove the marker from the map to hide it.

```js
marker.hide();
```

### isDraggable

`isDraggable(): boolean`

Returns whether the marker is draggable.

```js
if (marker.isDraggable()) {
    // Do something
}
```

### onAnimationChanged

`onAnimationChanged(callback: EventCallback): void`

Callback for when the marker's animation changes.

This is a convenience function for `marker.on(G.MarkerEvents.ANIMATION_CHANGED, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
marker.onAnimationChanged(() => {
    // Do something
})
```

### onClick

`onClick(callback: EventCallback): void`

Callback for when the marker icon is clicked.

This is a convenience function for `marker.on(G.MarkerEvents.CLICK, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
marker.onClick(() => {
    // Do something
})
```

### onClickableChanged

`onClickableChanged(callback: EventCallback): void`

Callback for when the marker clickable property changes.

This is a convenience function for `marker.on(G.MarkerEvents.CLICKABLE_CHANGED, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
marker.onClickableChanged(() => {
    // Do something
})
```

### onContextMenu

`onContextMenu(callback: EventCallback): void`

Callback for when the DOM contextmenu is fired on the marker.

This is a convenience function for `marker.on(G.MarkerEvents.CONTEXT_MENU, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
marker.onContextMenu(() => {
    // Do something
})
```

### onCursorChanged

`onCursorChanged(callback: EventCallback): void`

Callback for when the marker cursor property changes.

This is a convenience function for `marker.on(G.MarkerEvents.CURSOR_CHANGED, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
marker.onCursorChanged(() => {
    // Do something
})
```

### onDblClick

`onDblClick(callback: EventCallback): void`

Callback for when the marker is double clicked.

This is a convenience function for `marker.on(G.MarkerEvents.DBLCLICK, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
marker.onDblClick(() => {
    // Do something
})
```

### onDrag

`onDrag(callback: EventCallback): void`

Callback for when the user drags the marker.

This is a convenience function for `marker.on(G.MarkerEvents.DRAG, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
marker.onDrag(() => {
    // Do something
})
```

The callback function has one parameter and that's the event object. It contains the following values:

| Property | Type | Description |
|-----------|------|----------|
| domEvent | [Google Maps domEvent](https://developers.google.com/maps/documentation/javascript/reference/map#MapMouseEvent.domEvent) | The corresponding navigation DOM event. |
| latLng | [LatLng](/api-reference/utilities/latlng) | The position of the marker |
| type | string | The event type. In this case, `drag`. |

See [onDragEnd](#ondragend) for more information about getting the marker location when this event is called.

### onDragEnd

`onDragEnd(callback: EventCallback): void`

Callback for when the user stops dragging the marker.

This is a convenience function for `marker.on(G.MarkerEvents.DRAG_END, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
marker.onDragEnd(() => {
    // Do something
})
```

The callback function has one parameter and that's the event object. It contains the following values:

| Property | Type | Description |
|-----------|------|----------|
| domEvent | [Google Maps domEvent](https://developers.google.com/maps/documentation/javascript/reference/map#MapMouseEvent.domEvent) | The corresponding navigation DOM event. |
| latLng | [LatLng](/api-reference/utilities/latlng) | The position of the marker |
| type | string | The event type. In this case, `dragend`. |

Typically you want to get the location of the marker. There are two ways to do this.

Option 1: Get it from the event object.

```js
marker.onDragEnd((e) => {
    const lat = e.latLng.lat;
    const lng = e.latLng.lng;
})
```

Option 2: Get it from the marker object.

```js
marker.onDragEnd(() => {
    const position = marker.getPosition();
    const lat = position.lat;
    const lng = position.lng;
})
```

Or, get it from the marker `position` property, which is a [LatLng](/api-reference/utilities/latlng) object.

```js
marker.onDragEnd(() => {
    const lat = marker.position.lat;
    const lng = marker.position.lng;
})
```

### onDraggableChanged

`onDraggableChanged(callback: EventCallback): void`

Callback for when the marker draggable property changes.

This is a convenience function for `marker.on(G.MarkerEvents.DRAGGABLE_CHANGED, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
marker.onDraggableChanged(() => {
    // Do something
})
```

### onDragStart

`onDragStart(callback: EventCallback): void`

Callback for when the user starts dragging the marker.

This is a convenience function for `marker.on(G.MarkerEvents.DRAG_START, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
marker.onDragStart(() => {
    // Do something
})
```

The callback function has one parameter and that's the event object. It contains the following values:

| Property | Type | Description |
|-----------|------|----------|
| domEvent | [Google Maps domEvent](https://developers.google.com/maps/documentation/javascript/reference/map#MapMouseEvent.domEvent) | The corresponding navigation DOM event. |
| latLng | [LatLng](/api-reference/utilities/latlng) | The position of the marker |
| type | string | The event type. In this case, `dragstart`. |

See [onDragEnd](#ondragend) for more information about getting the marker location when this event is called.

### onFlatChanged

`onFlatChanged(callback: EventCallback): void`

Callback for when the marker flat property changes.

This is a convenience function for `marker.on(G.MarkerEvents.FLAT_CHANGED, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
marker.onFlatChanged(() => {
    // Do something
})
```

### onIconChanged

`onIconChanged(callback: EventCallback): void`

Callback for when the marker icon property changes.

This is a convenience function for `marker.on(G.MarkerEvents.ICON_CHANGED, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
marker.onIconChanged(() => {
    // Do something
})
```

### onMouseDown

`onMouseDown(callback: EventCallback): void`

Callback for when the when the user's mouse is pressed down on the marker.

This is a convenience function for `marker.on(G.MarkerEvents.MOUSE_DOWN, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
marker.onMouseDown(() => {
    // Do something
})
```

### onMouseOut

`onMouseOut(callback: EventCallback): void`

Callback for when the when the user's mouse exits the marker icon.

This is a convenience function for `marker.on(G.MarkerEvents.MOUSE_OUT, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
marker.onMouseOut(() => {
    // Do something
})
```

### onMouseOver

`onMouseOver(callback: EventCallback): void`

Callback for when the when the user's mouse enters the marker icon.

This is a convenience function for `marker.on(G.MarkerEvents.MOUSE_OVER, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
marker.onMouseOver(() => {
    // Do something
})
```

### onMouseUp

`onMouseUp(callback: EventCallback): void`

Callback for the mouseup event on the marker.

This is a convenience function for `marker.on(G.MarkerEvents.MOUSE_UP, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
marker.onMouseUp(() => {
    // Do something
})
```

### onPositionChanged

`onPositionChanged(callback: EventCallback): void`

Callback for when the marker's position property changes.

This is a convenience function for `marker.on(G.MarkerEvents.POSITION_CHANGED, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
marker.onPositionChanged(() => {
    // Do something
})
```

### onReady

`onReady(callback: EventCallback): void`

Callback for when the  marker is loaded and ready for use.

This is a convenience function for `marker.on(G.MarkerEvents.READY, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
marker.onReady(() => {
    // Do something
})
```

### onShapeChanged

`onShapeChanged(callback: EventCallback): void`

Callback for when the marker's shape property changes.

This is a convenience function for `marker.on(G.MarkerEvents.SHAPE_CHANGED, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
marker.onShapeChanged(() => {
    // Do something
})
```

### onTitleChanged

`onTitleChanged(callback: EventCallback): void`

Callback for when the marker's title property changes.

This is a convenience function for `marker.on(G.MarkerEvents.TITLE_CHANGED, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
marker.onTitleChanged(() => {
    // Do something
})
```

### onVisibleChanged

`onVisibleChanged(callback: EventCallback): void`

Callback for when the marker's visible property changes.

This is a convenience function for `marker.on(G.MarkerEvents.VISIBLE_CHANGED, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
marker.onVisibleChanged(() => {
    // Do something
})
```

### onZIndexChanged

`onZIndexChanged(callback: EventCallback): void`

Callback for when the marker's zindex property changes.

This is a convenience function for `marker.on(G.MarkerEvents.ZINDEX_CHANGED, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
marker.onZIndexChanged(() => {
    // Do something
})
```

### setAnchorPoint

`setAnchorPoint(value: PointValue): Promise<Marker>`

Set the anchor point for the marker.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | [PointValue](/api-reference/utilities/point#pointvalue-type) | Yes | The offset from the marker's position to the tip of an InfoWindow that has been opened with the marker as anchor. |

```js
marker.setAnchorPoint([3, 10]);
```

### setAnchorPointSync

`setAnchorPointSync(value: PointValue): Marker`

Set the anchor point for the marker syncronously.

Only use this if you know that the Google Maps library is already loaded and you have to set up the marker syncronously. If you don't have to set up the marker syncronously, then use [setAnchorPoint()](#setanchorpoint) instead or pass the `anchorPoint` option to the constructor or [setOptions()](#setoptions).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | [PointValue](/api-reference/utilities/point#pointvalue-type) | Yes | The offset from the marker's position to the tip of an InfoWindow that has been opened with the marker as anchor. |

```js
marker.setAnchorPointSync([3, 10]);
```

### setCursor

`setCursor(value: string): Promise<Marker>`

Set the mouse cursor type to show when hovering over the marker.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | string | Yes | The mouse cursor type. |

```js
marker.setCursor('help');
```

### setCursorSync

`setCursorSync(value: string): Marker`

Syncronously set the mouse cursor type to show when hovering over the marker.

Only use this if you know that the Google Maps library is already loaded and you have to set up the marker syncronously. If you don't have to set up the marker syncronously, then use [setCursor()](#setcursor) instead or pass the `cursor` option to the constructor or [setOptions()](#setoptions).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | string | Yes | The mouse cursor type. |

```js
marker.setCursorSync('help');
```

### setIcon

`setIcon(value: Icon | SvgSymbol | string): Promise<Marker>`

Set the icon value for the marker.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | [Icon](/api-reference/utilities/icon), [SvgSymbol](/api-reference/utilities/svgsymbol), or string | Yes | The icon for the marker. Pass `null` to clear the value. |

If `value` is a string then it's used as the image URL for the icon. It's not passed through [G.icon()](/api-reference/utilities/icon), and SVG markup is not converted like it is with the [svgIcon](#svg-icons) option.

Unlike the `icon` and `svgIcon` options, this method does not accept an options object. Use [G.icon()](/api-reference/utilities/icon) or [G.svgSymbol()](/api-reference/utilities/svgsymbol) to create the object first.

Set the icon using an [Icon](/api-reference/utilities/icon) object:

```js
const icon = G.icon({
    url: 'https://mywebsite.com/images/marker.png',
    size: [20, 32]
});
marker.setIcon(icon);
```

Set the icon using an [SvgSymbol](/api-reference/utilities/svgsymbol) object:

```js
const icon = G.svgSymbol({
    path: 'M0,6a6,6 0 1,0 12,0a6,6 0 1,0 -12,0',
    fillColor: '#5284ed',
    fillOpacity: 1,
    scale: 1,
    strokeColor: '#5284ed',
    strokeOpacity: 0.5,
    strokeWeight: 4,
});
marker.setIcon(icon);
```

Set the icon value using a URL string:

```js
marker.setIcon('https://mywebsite.com/images/marker.png');
```

Set the icon to SVG markup by converting it to a data URL yourself. This is what the [svgIcon](#svg-icons) option does with a string.

```js
const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="10" fill="#5284ed" /></svg>';
marker.setIcon(`data:image/svg+xml;base64,${btoa(svg)}`);
```

### setIconSync

`setIconSync(value: Icon | SvgSymbol | string): Marker`

Syncronously set the icon value for the marker.

Only use this if you know that the Google Maps library is already loaded and you have to set up the marker syncronously. If you don't have to set up the marker syncronously, then use [setIcon()](#seticon) instead or pass the `icon` option to the constructor or [setOptions()](#setoptions).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | [Icon](/api-reference/utilities/icon), [SvgSymbol](/api-reference/utilities/svgsymbol), or string | Yes | The icon for the marker. Pass `null` to clear the value. |

The value is handled the same way as [setIcon()](#seticon). If `value` is a string then it's used as the image URL for the icon.

Set the icon using an [Icon](/api-reference/utilities/icon) object:

```js
const icon = G.icon({
    url: 'https://mywebsite.com/images/marker.png',
    size: [20, 32]
});
marker.setIconSync(icon);
```

Set the icon using an [SvgSymbol](/api-reference/utilities/svgsymbol) object:

```js
const icon = G.svgSymbol({
    path: 'M0,6a6,6 0 1,0 12,0a6,6 0 1,0 -12,0',
    fillColor: '#5284ed',
    fillOpacity: 1,
    scale: 1,
    strokeColor: '#5284ed',
    strokeOpacity: 0.5,
    strokeWeight: 4,
});
marker.setIconSync(icon);
```

Set the icon value using a URL string:

```js
marker.setIconSync('https://mywebsite.com/images/marker.png');
```

### setLabel

`setLabel(value: string | number | MarkerLabel): Promise<Marker>`

Set the label value for the marker.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | string, number, or [MarkerLabel](#markerlabel-type) | Yes | The label for the marker. |

Set the label as a string:

```js
marker.setLabel('Marker label');
```

Set the label as a number:

```js
marker.setLabel(15);
```

Set the label as a MarkerLabel object:

```js
marker.setLabel({
    className: 'myLabelClass',
    fontSize: '18px',
    text: 'Label text here'
});
```

### setLabelSync

`setLabelSync(value: string | number | MarkerLabel): Marker`

Syncronously set the label value for the marker.

Only use this if you know that the Google Maps library is already loaded and you have to set up the marker syncronously. If you don't have to set up the marker syncronously, then use [setLabel()](#setlabel) instead or pass the `label` option to the constructor or [setOptions()](#setoptions).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | string, number, or [MarkerLabel](#markerlabel-type) | Yes | The label for the marker. |

Set the label as a string:

```js
marker.setLabelSync('Marker label');
```

Set the label as a number:

```js
marker.setLabelSync(15);
```

Set the label as a MarkerLabel object:

```js
marker.setLabelSync({
    className: 'myLabelClass',
    fontSize: '18px',
    text: 'Label text here'
});
```

### setMap

`setMap(map: Map | null): Promise<Marker>`

Add the marker to the map and display it. This is an alias to [show()](#show). Pass `null` to remove the marker from the map.

If the map hasn't been rendered yet, for example because its element is hidden, the marker is added once the map is ready.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| map | [Map](/api-reference/map) or null | Yes | The map object, or `null` to remove the marker from the map. |

```js
marker.setMap(map);

// Remove the marker from the map
marker.setMap(null);
```

### setMapSync

`setMapSync(map: Map | null): Marker`

Syncronously add the marker to the map and display it. Pass `null` to remove the marker from the map.

Only use this if you know that the Google Maps library is already loaded and you have to set up the marker syncronously. If you don't have to set up the marker syncronously, then use [setMap()](#setmap) instead or pass the `map` option to the constructor or [setOptions()](#setoptions).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| map | [Map](/api-reference/map) or null | Yes | The map object, or `null` to remove the marker from the map. |

```js
marker.setMapSync(map);
```

### setOptimized

`setOptimized(value: boolean): Promise<Marker>`

Set whether the marker rendering is optimized. Optimization renders many markers as a single static element, which helps when there are a large number of markers. If it's not set then Google decides. Optimization has no effect on vector maps.

It's best to set this with the `optimized` option so that it's used when the marker is created.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | boolean | Yes | Whether the marker rendering is optimized. Pass `undefined` to let Google decide. |

```js
marker.setOptimized(true);
```

### setOptimizedSync

`setOptimizedSync(value: boolean): Marker`

Syncronously set whether the marker rendering is optimized.

Only use this if you know that the Google Maps library is already loaded and you have to set up the marker syncronously. If you don't have to set up the marker syncronously, then use [setOptimized()](#setoptimized) instead or pass the `optimized` option to the constructor or [setOptions()](#setoptions).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | boolean | Yes | Whether the marker rendering is optimized. Pass `undefined` to let Google decide. |

```js
marker.setOptimizedSync(true);
```

### setOptions

`setOptions(options: MarkerOptions): Marker`

Set the options for the marker.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [MarkerOptions](#marker-options) | Yes | The marker options. |

```js
marker.setOptions({position: [38.6270, 90.1994]});
```

### setPosition

`setPosition(value: LatLngValue): Promise<Marker>`

Set the position of the marker.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) | Yes  | The marker position. |

```js
marker.setPosition([49.864716, 2.6522]);
```

### setPositionSync

`setPositionSync(value: LatLngValue): Marker`

Syncronously set the position of the marker.

Only use this if you know that the Google Maps library is already loaded and you have to set up the marker syncronously. If you don't have to set up the marker syncronously, then use [setPosition()](#setposition) instead or pass the `position` option to the constructor or [setOptions()](#setoptions).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) | Yes  | The marker position. |

```js
marker.setPositionSync([49.864716, 2.6522]);
```

### setTitle

`setTitle(value: string): Promise<Marker>`

Set the title for the marker.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | string | Yes  | The marker title. |

```js
marker.setTitle('Marker title');
```

### setTitleSync

`setTitleSync(value: string): Marker`

Syncronously set the title of the marker.

Only use this if you know that the Google Maps library is already loaded and you have to set up the marker syncronously. If you don't have to set up the marker syncronously, then use [setTitle()](#settitle) instead or pass the `title` option to the constructor or [setOptions()](#setoptions).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | string | Yes  | The marker title. |

```js
marker.setTitleSync('Marker title');
```

### show

 `show(map: Map): Promise<Marker>`

Add the marker to the map and display it. This is an alias to [setMap](#setmap).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| map | [Map](/api-reference/map) | Yes | The map object |

```js
marker.show(map);
```

### toGoogle

`toGoogle(): Promise<google.maps.Marker>`

Returns the Google Maps Marker object. It will be a promise value.

```js
marker.toGoogle().then((googleMarker) => {
    // Do something with the Google marker object
});
```

### toGoogleSync

`toGoogleSync(): google.maps.Marker`

Syncronously returns the Google Maps Marker object.

This is different from toGoogle() because it will throw an error if the Google Maps library is not available, whereas toGoogle() will wait for the Google Maps library to load. (This is the same with all of the `Sync` versions of the marker methods.)

 Only use this when you have to get the Google Maps object synchronously and you know that the Google Maps library is already loaded. If you don't have to get the Google Maps object synchronously, then use [toGoogle()](#togoogle) instead.

```js
const googleMarker = marker.toGoogleSync();
```
