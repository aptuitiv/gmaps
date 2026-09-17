---
---

# Overlay
<!-- markdownlint-disable MD024 -->

The `Overlay` object is used to help with drawing overlays on the map.

`Overlay` extends [Layer](/api-reference/base-classes/layer).

Examples of overlays include [Popups](/api-reference/popup) and [Tooltips](/api-reference/tooltip).

The Overlay object creates a `div` element that is then populated with content and displayed on the map.

## Creating the overlay

You can use the `G.overlay()` function to get your own overlay object.

`G.overlay(): Overlay`

```js
const overlay = G.overlay();
```

## Events

Below are the available overlay events.

You can use the plain text name for the event, or you can use the [event constant](/api-reference/constants#overlayevents).

| Event    | Description |
|----------|-------------|
| dragend | The event fired each time the dragging ends. |
| drag | The event fired each time the dragging updates the overlay position. This is called multiple times while the overlay is being dragged. |
| draggable_changed | The event fired when dragging is enabled or disabled with [enableDrag()](#enabledrag) or [disableDrag()](#disabledrag). |
| dragstart | The event fired when dragging the overlay starts. |
| open | The event fired when the overlay is opened. |
| resizeend | The event fired each time the resizing ends. |
| resize | The event fired each time the resizing updates the overlay size and position. This is called multiple times while the overlay is being resized. |
| resizestart | The event fired when resizing the overlay starts. |

### dragend

Called when the dragging the overlay ends.

```js
overlay.on('dragend', () => {
    // Do something here
});

// You can also use the event constant
overlay.on(G.OverlayEvents.DRAG_END, () => {
    // Do something here
});

// Or, use the callback method
overlay.onDragEnd(() => {
    // Do something here
});
```

### drag

Called when the dragging updates the overlay position.

```js
overlay.on('drag', () => {
    // Do something here
});

// You can also use the event constant
overlay.on(G.OverlayEvents.DRAG, () => {
    // Do something here
});

// Or, use the callback method
overlay.onDrag(() => {
    // Do something here
});
```

### draggable_changed

Called when dragging is enabled or disabled with [enableDrag()](#enabledrag) or [disableDrag()](#disabledrag). The event data has a `draggable` property with the new value.

```js
overlay.on('draggable_changed', (data) => {
    // data.draggable is true or false
});

// You can also use the event constant
overlay.on(G.OverlayEvents.DRAGGABLE_CHANGED, (data) => {
    // Do something here
});

// Or, use the callback method
overlay.onDraggableChanged((data) => {
    // Do something here
});
```

### dragstart

Called when the overlay is starting to be dragged.

```js
overlay.on('dragstart', () => {
    // Do something here
});

// You can also use the event constant
overlay.on(G.OverlayEvents.DRAG_START, () => {
    // Do something here
});

// Or, use the callback method
overlay.onDragStart(() => {
    // Do something here
});
```

### open

Called when the overlay is opened.

```js
overlay.on('open', () => {
    // Do something here
});

// You can also use the event constant
overlay.on(G.OverlayEvents.OPEN, () => {
    // Do something here
});

// Or, use the onOpen method
overlay.onOpen(() => {
    // Do something here
});
```

### resizeend

Called when the resizing the overlay ends.

```js
overlay.on('resizeend', () => {
    // Do something here
});

// You can also use the event constant
overlay.on(G.OverlayEvents.RESIZE_END, () => {
    // Do something here
});

// Or, use the callback method
overlay.onResizeEnd(() => {
    // Do something here
});
```

### resize

Called when the resizing updates the overlay position.

```js
overlay.on('resize', () => {
    // Do something here
});

// You can also use the event constant
overlay.on(G.OverlayEvents.RESIZE, () => {
    // Do something here
});

// Or, use the callback method
overlay.onResize(() => {
    // Do something here
});
```

### resizestart

Called when the overlay is starting to be resized.

```js
overlay.on('resizestart', () => {
    // Do something here
});

// You can also use the event constant
overlay.on(G.OverlayEvents.RESIZE_START, () => {
    // Do something here
});

// Or, use the callback method
overlay.onResizeStart(() => {
    // Do something here
});
```

## Dragging the overlay

You can configure that the overlay can be dragged around the map by clicking on it and moving the mouse. If this is enabled then a border will be added to the overlay to make it easier to see the dimensions.

In order for the mouse events to apply to the overlay, the overlay will be added to a different [layer on the Google map](https://developers.google.com/maps/documentation/javascript/customoverlays#intitialize). By default the overlay is added to the `overlayLayer` pane. If dragging is enabled then it will be added to the `float` pane. This means that it will be above markers and polylines.

## Resizing the overlay

You can configure that the overlay can be resized by dragging the corners. If this is enabled then resize handles will be added to the corners and a border will be added to the overlay.

In order for the mouse events to apply to the overlay, the overlay will be added to a different [layer on the Google map](https://developers.google.com/maps/documentation/javascript/customoverlays#intitialize). By default the overlay is added to the `overlayLayer` pane. If resizing is enabled then it will be added to the `float` pane. This means that it will be above markers and polylines.

## Properties

| Property  | Type   | Description                             |
|-----------|--------|-----------------------------------------|
| className | string | The class name for the overlay element. |
| drag | boolean | Whether the overlay can be dragged around the map. |
| offset    | [Point](/api-reference/utilities/point) | The x/y offset for the overlay. It can be set with a [PointValue](/api-reference/utilities/point#pointvalue-type). |
| position  | [LatLng](/api-reference/utilities/latlng) | The latitude/longitude position of the overlay. It can be set with a [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type). Setting it to `null` or `undefined` removes the position. |
| resize | boolean | Whether the overlay can be resized. |
| styles | object | An object of CSS styles that will be applied to the overlay element. This is for setting or retrieving all styles. If you need to set an individual style then use the [style()](#style) method. This will merge the styles with the existing styles. |

### className

Get and set the class name of the overlay. If you need multiple class names then separate them with a space.

```js
// Get the class name
const className = overlay.className;
```

```js
// Set the class name
overlay.className = 'my-class-name';
// Set multiple class names
overlay.className = 'my-class-name another-class';
```

### drag

Get or set whether the overlay can be dragged around the map.

```js
// Get the drag value
const canDrag = overlay.drag;
```

```js
// Set that the overlay is draggable
overlay.drag = true;
overlay.drag = false;
```

### offset

Get and set the x/y offset for the overlay.

```js
// Get the offset
const offset = overlay.offset;
```

```js
// Set the offset
overlay.offset = G.point([0, 10]);
// Or
overlay.offset = [0, 10];
```

### position

Get and set the latitude/longitude position of the overlay.

```js
// Get the position
const position = overlay.position;
```

```js
// Set the position
overlay.position = G.latLng({ lat: 42.7, lng: -72.9 });
// Or
overlay.position = { lat: 42.7, lng: -72.9 };
```

### resize

Get or set whether the overlay can be resized by dragging the corners.

```js
// Get the resize value
const canResize = overlay.resize;
```

```js
// Set that the overlay is resizable
overlay.resize = true;
overlay.resize = false;
```

### styles

Get the inline styles for the overlay or bulk set multiple styles.

```js
// Get the styles
const styles = overlay.styles;
```

```js
// Set multiple styles
overlay.styles = {backgroundColor: '#ff0000', color: '#fff'}
```

## Methods

- Methods inherited from [Layer](/api-reference/base-classes/layer#methods).

### constructor

`constructor(objectType: string, testObject: string, testLibrary?: string)`

The class object constructor.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| objectType | string | Yes | The object type. i.e. "map", "marker", "tooltip". Used with the object type tests in [Base](/api-reference/base-classes/base). |
| testObject | string | Yes | The camel case object name that is used when testing for the existance of the Google Map library. This should be the name of the object that calls this method. |
| testLibrary | string | | An optional Google maps library class to check for. This needs to be part of the google.maps object. If not set then it's set to `testObject`. |

### disableDrag

`disableDrag(): Overlay`

Disable dragging for this overlay.

```js
overlay.disableDrag();
```

### disableResize

`disableResize(): Overlay`

Disable resizing for this overlay.

```js
overlay.disableResize();
```

### display

 `display(map: Map): Promise<Overlay>`

Add the overlay to the map and display it. This is an alias to [show()](#show).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| map | [Map](/api-reference/map) | Yes | The map object |

```js
overlay.display(map);
```

### enableDrag

`enableDrag(): Overlay`

Enable dragging for this overlay.

```js
overlay.enableDrag();
```

### enableResize

`enableResize(): Overlay`

Enable resizing for this overlay.

```js
overlay.enableResize();
```

### getBounds

`getBounds(): LatLngBounds`

Get the bounds where the overlay should be displayed. The base `Overlay` returns an empty [LatLngBounds](/api-reference/utilities/latlng-bounds) object. It's meant to be overridden by classes that extend `Overlay` and cover an area, like [ImageOverlay](/api-reference/image-overlay).

```js
const bounds = overlay.getBounds();
```

### getContainerLatLngFromPixel

`getContainerLatLngFromPixel(x: PointValue, y?: number): LatLng`

Computes the geographical coordinates from pixel coordinates in the map's container.

This is a shortcut to getting the projection from the overlay and then calling `fromContainerPixelToLatLng` on the projection with the pixel value.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| x | number \| [PointValue](/api-reference/utilities/point#pointvalue-type) | Yes | The `x` pixel value, or a [PointValue](/api-reference/utilities/point#pointvalue-type). |
| y | number | | The `y` pixel value if `x` is a number. |

```js
const latLng = overlay.getContainerLatLngFromPixel(xValue, yValue);
const latLng = overlay.getContainerLatLngFromPixel({x: xValue, y: yValue});
const latLng = overlay.getContainerLatLngFromPixel(G.point({x: xValue, y: yValue}));
```

### getDivLatLngFromPixel

`getDivLatLngFromPixel(x: PointValue, y?: number): LatLng`

Computes the geographical coordinates from pixel coordinates in the div that holds the draggable map.

This is a shortcut to getting the projection from the overlay and then calling `fromDivPixelToLatLng` on the projection with the pixel value.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| x | number \| [PointValue](/api-reference/utilities/point#pointvalue-type) | Yes | The `x` pixel value, or a [PointValue](/api-reference/utilities/point#pointvalue-type). |
| y | number | | The `y` pixel value if `x` is a number. |

```js
const latLng = overlay.getDivLatLngFromPixel(xValue, yValue);
const latLng = overlay.getDivLatLngFromPixel({x: xValue, y: yValue});
const latLng = overlay.getDivLatLngFromPixel(G.point({x: xValue, y: yValue}));
```

### getOffset

`getOffset(): Point`

Get the offset value for the overlay. It returns a [Point](/api-reference/utilities/point) object.

```js
const offset = overlay.getOffset();
```

### getOverlayElement

`getOverlayElement(): HTMLElement`

Gets the overlay HTML element that was created in the constructor. The element is a `div`. This is the container for the content in the overlay.

```js
const overlayElement = overlay.getOverlayElement();
```

### getPosition

`getPosition(): LatLng`

Get the latitude/longitude position of the overlay. This is for when the overlay has a single latitude and longitude value for it's position and does not use latitude and longitude bounds.

```js
const position = overlay.getPosition();
```

### getProjection

`getProjection(): google.maps.MapCanvasProjection`

Gets the MapCanvasProjection object associated with this OverlayView.

The projection is not available until the overlay has been added to the map with [setMap](#setmap) or [show](#show).

```js
const projection = overlay.getProjection();
```

### getResizeAspectRatio

`getResizeAspectRatio(): number`

Get the current aspect ratio for resizing

```js
const ratio = overlay.getResizeAspectRatio();
```

### hasPosition

`hasPosition(): boolean`

Returns whether the overlay has a latitude/longitude position set.

```js
if (overlay.hasPosition()) {
    // Do something
}
```

### hide

`hide(): Overlay`

Hide the overlay.

```js
overlay.hide();
```

### isDraggable

`isDraggable(): boolean`

Returns if the overlay is draggable.

```js
marker.isDraggable();
overlay.isDraggable();
```

### move

`move(position: LatLngValue, map?: Map): Promise<Overlay>`

Move the overlay to a new position. If the overlay has not been displayed yet then this will display it. The promise is rejected if no map is passed and the overlay doesn't already have a map.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| position | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) | Yes | The latitude/longitude position value. |
| map | [Map](/api-reference/map) |  | The map object. If not set then an attempt is made to get the map object already assigned to the overlay. |

```js
overlay.move({ lat: 40.7, lng: -73.9 });
```

```js
overlay.move({ lat: 40.7, lng: -73.9 }, map);
```

### onDragEnd

`onDragEnd(callback: EventCallback): void`

Callback for when the dragging the overlay ends.

This is a convenience function for `overlay.on(G.OverlayEvents.DRAG_END, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

Callback function parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| event | MouseEvent\|TouchEvent | The browser mouse or touch event |

```js
overlay.onDragEnd((event, change) => {
    // Do something
    const newBounds = overlay.getBounds()
})
```

### onDrag

`onDrag(callback: EventCallback): void`

Callback for when the dragging the overlay updates the overlay position. This is called multiple times while the overlay is being dragged.

This is a convenience function for `overlay.on(G.OverlayEvents.DRAG, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

Callback function parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| event | MouseEvent\|TouchEvent | The browser mouse or touch event |
| change | [Point](/api-reference/utilities/point) | The difference between the starting mouse position and the new mouse position. |

```js
overlay.onDrag((event, change) => {
    // Do something
})
```

### onDraggableChanged

`onDraggableChanged(callback: EventCallback): void`

Callback for when dragging is enabled or disabled with [enableDrag()](#enabledrag) or [disableDrag()](#disabledrag).

This is a convenience function for `overlay.on(G.OverlayEvents.DRAGGABLE_CHANGED, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

The callback is passed the event data, which has a `draggable` property.

| Property | Type | Description |
|-----------|------|-------------|
| draggable | boolean | Whether the overlay can now be dragged. |

```js
overlay.onDraggableChanged((data) => {
    if (data.draggable) {
        // Do something
    }
})
```

### onDragStart

`onDragStart(callback: EventCallback): void`

Callback for when the dragging the overlay starts.

This is a convenience function for `overlay.on(G.OverlayEvents.DRAG_START, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

Callback function parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| event | MouseEvent\|TouchEvent | The browser mouse or touch event |

```js
overlay.onDragStart((event) => {
    // Do something
})
```

### onOpen

`onOpen(callback: EventCallback): void`

Callback for when the overlay is opened.

This is a convenience function for `overlay.on(G.OverlayEvents.OPEN, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

There are no callback function parameters.

```js
overlay.onOpen(() => {
    // Do something
})
```

### onResizeEnd

`onResizeEnd(callback: EventCallback): void`

Callback for when the resizing the overlay ends.

This is a convenience function for `overlay.on(G.OverlayEvents.RESIZE_END, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

Callback function parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| event | MouseEvent\|TouchEvent | The browser mouse or touch event |

```js
overlay.onResizeEnd((event, change) => {
    // Do something
    const newBounds = overlay.getBounds()
})
```

### onResize

`onResize(callback: EventCallback): void`

Callback for when the resizing the overlay updates the overlay position. This is called multiple times while the overlay is being resized.

This is a convenience function for `overlay.on(G.OverlayEvents.RESIZE, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

Callback function parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| event | MouseEvent\|TouchEvent | The browser mouse or touch event |
| corner | string | The corner that is the resizing is happening at. `ne`, `nw`, `se`, or `sw`. |

```js
overlay.onResize((event, corner) => {
    // Do something
})
```

### onResizeStart

`onResizeStart(callback: EventCallback): void`

Callback for when the resizing the overlay starts.

This is a convenience function for `overlay.on(G.OverlayEvents.RESIZE_START, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

Callback function parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| event | MouseEvent\|TouchEvent | The browser mouse or touch event |
| corner | string | The corner that is the resizing is happening at. `ne`, `nw`, `se`, or `sw`. |

```js
overlay.onResizeStart((event, corner) => {
    // Do something
})
```

### removeClassName

`removeClassName(className: string): Overlay`

Removes a class name from the overlay element.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| className | string | Yes | The class name(s) to remove from the overlay element. |

 ```js
 overlay.removeClassName('my-class');
 ```

If you need to remove multiple class names then separate them with a space.

 ```js
 overlay.removeClassName('my-class another-class');
 ```

### setClassName

`setClassName(className: string): Overlay`

Set the class name(s) for the overlay element.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| className | string | Yes | The class name(s) to set on the overlay element. |

 ```js
 overlay.setClassName('my-class');
 ```

If you need to add multiple class names then separate them with a space.

 ```js
 overlay.setClassName('my-class another-class');
 ```

### setMap

 `setMap(map: Map): Promise<Overlay>`

Add the overlay to the map and display it. This is an alias to [show()](#show).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| map | [Map](/api-reference/map) | Yes | The map object |

```js
overlay.setMap(map);
```

### setOffset

`setOffset(offset: PointValue): Overlay`

Set the x,y offset for the overlay. This lets you have the offset show a certain number of pixels from it's latitude/longitude position.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| offset | [PointValue](/api-reference/utilities/point#pointvalue-type) | Yes | The x/y offset value. |

```js
overlay.setOffset([2, -3]);
```

### setPosition

`setPosition(position: LatLngValue): Overlay`

Set the position of the overlay.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| position | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) | Yes | The latitude/longitude position value. |

```js
overlay.setPosition({ lat: 40.7, lng: -73.9 });
```

### setResizeAspectRatio

`setResizeAspectRatio(aspectRatio: number): Overlay`

Set the aspect ratio to maintain during resizing. If this is set then when the overlay is resized it will stay in that aspect ratio.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| aspectRatio | number | Yes | The number after dividing width / height. |

```js
const aspectRatio = elementWidth / elementHeight;
overlay.setResizeAspectRatio(aspectRatio);
```

### setStyles

`setStyles(styles: object): Overlay`

Set one more styles for thes overlay element. This will merge styles with an existing ones.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| styles | object | Yes | Object of key => value pairs of CSS styles to set on the element. |

```js
overlay.setStyles({ backgroundColor: '#333', border: '2px solid #ff0000' });
```

### show

`show(map: Map): Promise<Overlay>`

Add the overlay to the map and display it. This is an alias to [setMap](#setmap).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| map | [Map](/api-reference/map) | Yes | The map object |

```js
overlay.show(map);
```

### style

`style(name: string, value: string): Overlay`

Add a single style to the overlay wrapper div.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string| Yes | The style name. For example, `color` or `backgroundColor`. |
| value | string | Yes | The style value. |

```js
overlay.style('padding', '3px 6px');
```

### toggle

`toggle(map: Map): void`

Toggle the display of the overlay on the map.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| map | [Map](/api-reference/map) | Yes | The map object |

```js
overlay.toggle(map);
```
