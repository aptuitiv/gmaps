---
---

# ImageOverlay
<!-- markdownlint-disable MD024 -->

The `ImageOverlay` object is used to help with displaying an image overlay on the map.

`ImageOverlay` extends [Overlay](/api-reference/overlay).

The ImageOverlay has the following characteristics:

- The image is added into an [Overlay](/api-reference/overlay) div.
- The Overlay div is the element that is positioned on the map.
- You can rotate the image within the Overlay div.
- The image will be aligned to the top left of the Overlay div.

## Creating the image overlay

`G.imageOverlay(options?: ImageOverlayValue, bounds?: LatLngBoundsValue): ImageOverlay`

There are a few ways that you can set up the `ImageOverlay` object.

**No parameters.**

`G.imageOverlay(): ImageOverlay`

```js
const image = G.imageOverlay();
```

**Pass the image overlay options.**

`G.imageOverlay(options: ImageOverlayOptions): ImageOverlay`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [ImageOverlayOptions](#imageoverlay-options) | Yes | The image overlay options. |

```js
const image = G.imageOverlay({
    bounds: {
        ne: [44.36877953646439, -68.31675122855835],
        sw: [44.361063461552426, -68.32760881065063],
    },
    imageUrl: 'https://www.image.com/path/to/image.jpg',
    map: map,
});
```

**Pass the image URL and the bounds.**

`G.imageOverlay(imageUrl: string, bounds?: LatLngBoundsValue): ImageOverlay`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| imageUrl | string | Yes | The URL for the image to display. |
| bounds | [LatLngBoundsValue](/api-reference/utilities/latlng-bounds#latlngbounds-value-type) | No | The latitude and longitude bounds where the image should be displayed. |

```js
const image = G.imageOverlay('https://www.image.com/path/to/image.jpg', {
    ne: [44.36877953646439, -68.31675122855835],
    sw: [44.361063461552426, -68.32760881065063],
});
```

**Pass an existing ImageOverlay object.**

`G.imageOverlay(object: ImageOverlay): ImageOverlay`

In this case the `ImageOverlay` object is simply returned.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| object | ImageOverlay | Yes | An ImageOverlay object. |

```js
const image = G.imageOverlay(imageOverlayObject);
```

## Image overlay value type

Any methods that accept an image overlay value accept `ImageOverlayValue` as the value type.

The `ImageOverlayValue` can be one of the following values:

- `ImageOverlay` object
- [ImageOverlayOptions](#imageoverlay-options) object
- string. The URL for the image to display.

## Positioning the image on the map

It can be a little tedious to get precise positioning on a map, especially if you also need to rotate the image. To help with this you can use the drag and resize features of the Overlay and the rotate feature of the Image Overlay to get the image in the right spot. Using the event callbacks you can console log the image rotate and the latitude longitude bounds of the overlay. You can then use that to set your final position and rotation.

```js
// Set up your map
const map = G.map('#map1', {
    center: { latitude: 44.3644077301405, longitude: -68.32022737144165 },
    zoom: 16,
});
map.show();

// Create the image object
const imageOverlay = G.imageOverlay({
    bounds: {
        ne: [44.36877953646439, -68.31675122855835], // Northeast corner
        sw: [44.361063461552426, -68.32760881065063], // Southwest corner
    },
    imageUrl: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/talkeetna.png',
    drag: true,
    resize: true,
    rotate: true,
    map: map,
    opacity: 0.5 // So that we can see the map through the image
});

// Make sure that the Overlay is the same shape as the image
imageOverlay.fitToImage();

/**
 * Get the debug information for the image overlay
 *
 * @returns {object} The debug information
 */
const getDebugInfo = () => {
    const bounds = imageOverlay.getBounds();
    return {
        angle: imageOverlay.getRotation(),
        bounds: {
            ne: bounds.getNorthEast().toJson(),
            sw: bounds.getSouthWest().toJson(),
        }
    };
};

// Console log the information we need when dragging ends
imageOverlay.on('dragend', () => {
    console.log('Drag End: ', getDebugInfo());
});
// Console log the information we need when resizing ends
imageOverlay.on('resizeend', () => {
    console.log('Resize End: ', getDebugInfo());
});
// Console log the information when the rotation ends
imageOverlay.on('rotateend', () => {
    console.log('Rotation End:', getDebugInfo());
});
```

## Rotating the image overlay

You can configure that the image overlay can be rotated by clicking on a rotate handle and moving the mouse. If this is enabled then a rotation handle will be added to the image.

In order for the mouse events to apply to the overlay, the image overlay will be added to a different [layer on the Google map](https://developers.google.com/maps/documentation/javascript/customoverlays#intitialize). By default the overlay is added to the `overlayLayer` pane. If dragging, resizing, or rotating is enabled then it will be added to the `floatPane` pane. This means that it will be above markers and polylines.

## ImageOverlay options

Type `ImageOverlayOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| bounds | [LatLngBoundsValue](/api-reference/utilities/latlng-bounds#latlngbounds-value-type) | | The latitude and longitude bounds where the image should be displayed. |
| className | string | | The class name for the image element. |
| debug | boolean |  false | Whether to set a background and border on the overlay div that the image is in to help show where the image is being displayed. When adding an image sometimes you want to see the overlay container that it is in. This will add a semi-transparent red background and red border to the overlay div to make it visible. |
| drag | boolean | false | Whether the image overlay can be dragged around the map. |
| imageUrl | string |  | The URL for the image to display. |
| map | [Map](/api-reference/map) | | The map to add the image overlay to. |
| opacity | number | 1 | The opacity of the image (0.0 to 1.0). |
| resize | boolean | false | Whether the overlay can be resized. |
| rotate | boolean | false | Whether the image can be rotated with a rotation handle. |
| rotation | number | 0 | The initial rotation angle in degrees (0 to 360). |
| styles | object |  | An object of CSS styles that will be applied to the image element. This will merge the styles with the existing styles. If you need to set an individual style then use the [style()](#style) method. |

## Events

Below are the available image overlay events.

- Events inherited from [Overlay](/api-reference/overlay#events).

You can use the plain text name for the event, or you can use the [event constant](/api-reference/constants#imageoverlayevents).

| Event    | Description |
|----------|-------------|
| rotateend | The event fired when the rotating finishes. |
| rotate | The event fired each time the rotating updates the image overlay rotation. |
| rotatestart | The event fired when rotating the image overlay starts. |

### rotateend

Called when the rotating the overlay ends.

```js
imageOverlay.on('rotateend', () => {
    // Do something here
});

// You can also use the event constant
imageOverlay.on(G.ImageOverlayEvents.ROTATE_END, () => {
    // Do something here
});

// Or, use the callback method
imageOverlay.onRotateEnd(() => {
    // Do something here
});
```

### rotate

Called when the rotating updates the overlay rotation.

```js
imageOverlay.on('rotate', () => {
    // Do something here
});

// You can also use the event constant
imageOverlay.on(G.ImageOverlayEvents.ROTATE, () => {
    // Do something here
});

// Or, use the callback method
imageOverlay.onRotate(() => {
    // Do something here
});
```

### rotatestart

Called when the overlay is starting to be rotated.

```js
imageOverlay.on('rotatestart', () => {
    // Do something here
});

// You can also use the event constant
imageOverlay.on(G.ImageOverlayEvents.ROTATE_START, () => {
    // Do something here
});

// Or, use the callback method
imageOverlay.onRotateStart(() => {
    // Do something here
});
```

## Properties

- Properties inherited from [Overlay](/api-reference/overlay#properties).

| Property  | Type   | Description                             |
|-----------|--------|-----------------------------------------|
| bounds | [LatLngBounds](/api-reference/utilities/latlng-bounds) | The latitude and longitude bounds where the image should be displayed. It can be set with any [LatLngBoundsValue](/api-reference/utilities/latlng-bounds#latlngbounds-value-type). |
| className | string | The class name for the image element. |
| imageUrl | string | The URL for the image to display. |
| opacity | number | The opacity of the image (0.0 to 1.0). |
| rotate | boolean | Whether the image can be rotated. |
| rotation | number | The rotation angle in degrees (0 to 360). |
| styles | object | An object of CSS styles that will be applied to the image element. This is for setting or retrieving all styles. If you need to set an individual style then use the [style()](#style) method. This will merge the styles with the existing styles. |

### bounds

Get and set the latitude and longitude bounds where the image should be displayed. The value is a valid [LatLngBounds](/api-reference/utilities/latlng-bounds#latlngbounds-value-type) value.

```js
// Get the value
const bounds = imageOverlay.bounds;
```

```js
// Set the bounds
imageOverlay.bounds = {
    ne: [44.36877953646439, -68.31675122855835], // Northeast corner
    sw: [44.361063461552426, -68.32760881065063], // Southwest corner
}
// Or
imageOverlay.bounds = G.latLngBounds({
    ne: G.latLng(44.7, -70.8),
    sw: G.latLng(44, -68),
});
// Or any of the other LatLngBounds value types
```

### className

Get and set the class name of the image element. If you need multiple class names then separate them with a space.

Setting the class name adds the class names to the ones already on the image element. Set it to `null` to remove all of the class names.

```js
// Get the class name
const className = imageOverlay.className;
```

```js
// Set the class name
imageOverlay.className = 'my-class-name';
// Set multiple class names
imageOverlay.className = 'my-class-name another-class';
```

### imageUrl

Get and set the URL of the image to display.

```js
// Get the image URL
const url = imageOverlay.imageUrl;
```

```js
// Set the image url
imageOverlay.imageUrl = 'https://www.image.com/path/to/image.jpg';
```

### opacity

Get and set the opacity of the image. The value must be a number between 0 and 1. Any other value is ignored.

```js
// Get the opacity
const opacity = imageOverlay.opacity;
```

```js
// Set the opacity
imageOverlay.opacity = 0.5;
imageOverlay.opacity = 1;
```

### rotate

Get or set whether the overlay can be rotated by dragging the rotate handle.

```js
// Get the rotate value
const canRotate = imageOverlay.rotate;
```

```js
// Set that the image can be rotated
imageOverlay.rotate = true;
imageOverlay.rotate = false;
```

### rotation

Get or set the rotation angle in degrees for the image.

```js
// Get the rotation value
const rotation = imageOverlay.rotation;
```

```js
// Set the rotation value
imageOverlay.rotation = 45;
imageOverlay.rotation = 325;
```

### styles

Get the inline styles for the image element or bulk set multiple styles.

```js
// Get the styles
const styles = imageOverlay.styles;
```

```js
// Set multiple styles
imageOverlay.styles = {backgroundColor: '#ff0000', color: '#fff'}
```

## Methods

- Methods inherited from [Overlay](/api-reference/overlay#methods).

### constructor

`constructor(options: ImageOverlayOptions | string, bounds?: LatLngBoundsValue)`

The class object constructor. You would normally use [G.imageOverlay()](#creating-the-image-overlay) instead.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [ImageOverlayOptions](#imageoverlay-options)\|string | Yes | The image overlay options, or the URL for the image to display. |
| bounds | [LatLngBoundsValue](/api-reference/utilities/latlng-bounds#latlngbounds-value-type) | | The bounds where the image should be displayed. Only used if `options` is the image URL. |

### disableRotation

`disableRotation(): ImageOverlay`

Set that the image can not be rotated with a rotation handle.

```js
imageOverlay.disableRotation();
```

### display

`display(map: Map): Promise<ImageOverlay>`

Add the image overlay to the map and display it. This is an alias to [show()](/api-reference/overlay#show).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| map | [Map](/api-reference/map) | Yes | The map object |

```js
imageOverlay.display(map);
```

### enableRotation

`enableRotation(): ImageOverlay`

Set that the image can be rotated with a rotation handle. This is useful for figuring out the final rotation value.

```js
imageOverlay.enableRotation();
```

### fitToImage

`fitToImage(): Promise<ImageOverlay>`

Adjust the overlay div that the image is in to match the current dimensions of the image. If resizing is enabled then this will also constrain the resizing to match the aspect ratio of the image.

If the image hasn't loaded yet then this waits for it to load.

```js
imageOverlay.fitToImage();
```

### getBounds

`getBounds(): LatLngBounds`

Get the latitude/longitude bounds for where the image will be displayed.

```js
const bounds = imageOverlay.getBounds();
```

### getContainerLatLngFromPixel

`getContainerLatLngFromPixel(x: number|PointValue, y?: number): LatLng`

Computes the geographical coordinates from pixel coordinates in the map's container.

This is a shortcut to getting the projection from the overlay and then calling `fromContainerPixelToLatLng` on the projection with the pixel value.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| x | number \| [PointValue](/api-reference/utilities/point#pointvalue-type) | Yes | The `x` pixel value, or a [PointValue](/api-reference/utilities/point#pointvalue-type). |
| y | number | | The `y` pixel value if `x` is a number. |

```js
const latLng = imageOverlay.getContainerLatLngFromPixel(xValue, yValue);
const latLng = imageOverlay.getContainerLatLngFromPixel({x: xValue, y: yValue});
const latLng = imageOverlay.getContainerLatLngFromPixel(G.point({x: xValue, y: yValue}));
```

### getDivLatLngFromPixel

`getDivLatLngFromPixel(x: number|PointValue, y?: number): LatLng`

Computes the geographical coordinates from pixel coordinates in the div that holds the draggable map.

This is a shortcut to getting the projection from the overlay and then calling `fromDivPixelToLatLng` on the projection with the pixel value.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| x | number \| [PointValue](/api-reference/utilities/point#pointvalue-type) | Yes | The `x` pixel value, or a [PointValue](/api-reference/utilities/point#pointvalue-type). |
| y | number | | The `y` pixel value if `x` is a number. |

```js
const latLng = imageOverlay.getDivLatLngFromPixel(xValue, yValue);
const latLng = imageOverlay.getDivLatLngFromPixel({x: xValue, y: yValue});
const latLng = imageOverlay.getDivLatLngFromPixel(G.point({x: xValue, y: yValue}));
```

### getImageUrl

`getImageUrl(): string`

Get the URL of the image that is being displayed.

```js
const url = imageOverlay.getImageUrl();
```

### getOpacity

`getOpacity(): number`

Get the opacity of the image.

```js
const opacity = imageOverlay.getOpacity();
```

### getRotation

`getRotation(): number`

Get the rotation angle in degrees.

```js
const rotation = imageOverlay.getRotation();
```

### onRotateEnd

`onRotateEnd(callback: EventCallback): void`

Callback for when the rotating the image ends.

This is a convenience function for `imageOverlay.on(G.ImageOverlayEvents.ROTATE_END, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

The callback function has one parameter and that's the event object. It contains the following values:

| Property | Type | Description |
|----------|------|-------------|
| angle | number | The rotation angle in degrees. |
| event | MouseEvent\|TouchEvent | The browser mouse or touch event. |
| type | string | The event type. In this case, `rotateend`. |

```js
imageOverlay.onRotateEnd((e) => {
    console.log('The new rotation is', e.angle);
});
```

### onRotate

`onRotate(callback: EventCallback): void`

Callback for when the rotating the overlay updates the overlay rotation. This is called multiple times while the overlay is being rotated.

This is a convenience function for `imageOverlay.on(G.ImageOverlayEvents.ROTATE, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

The callback function has one parameter and that's the event object. It contains the following values:

| Property | Type | Description |
|----------|------|-------------|
| angle | number | The rotation angle in degrees. |
| event | MouseEvent\|TouchEvent | The browser mouse or touch event. |
| type | string | The event type. In this case, `rotate`. |

```js
imageOverlay.onRotate((e) => {
    // Do something
});
```

### onRotateStart

`onRotateStart(callback: EventCallback): void`

Callback for when the rotating the overlay starts.

This is a convenience function for `imageOverlay.on(G.ImageOverlayEvents.ROTATE_START, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

The callback function has one parameter and that's the event object. It contains the following values:

| Property | Type | Description |
|----------|------|-------------|
| event | MouseEvent\|TouchEvent | The browser mouse or touch event. |
| type | string | The event type. In this case, `rotatestart`. |

```js
imageOverlay.onRotateStart((e) => {
    // Do something
});
```

### removeClassName

`removeClassName(className: string): Overlay`

Removes a class name from the image element.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| className | string | Yes | The class name(s) to remove from the image element. |

```js
imageOverlay.removeClassName('my-class');
```

If you need to remove multiple class names then separate them with a space.

```js
imageOverlay.removeClassName('my-class another-class');
```

### setBounds

`setBounds(bounds: LatLngBoundsValue): ImageOverlay`

Set the bounds where the image should be displayed.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| bounds | [LatLngBoundsValue](/api-reference/utilities/latlng-bounds#latlngbounds-value-type) | Yes | The latitude and longitude bounds where the image should be displayed. |

```js
// Set the bounds
imageOverlay.setBounds({
    ne: [44.36877953646439, -68.31675122855835], // Northeast corner
    sw: [44.361063461552426, -68.32760881065063], // Southwest corner
});
// Or
imageOverlay.setBounds(G.latLngBounds({
    ne: G.latLng(44.7, -70.8),
    sw: G.latLng(44, -68),
}));
// Or any of the other LatLngBounds value types
```

### setClassName

`setClassName(className: string): Overlay`

Add the class name(s) to the image element.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| className | string | Yes | The class name(s) to add to the image element. |

```js
imageOverlay.setClassName('my-class');
```

If you need to add multiple class names then separate them with a space.

```js
imageOverlay.setClassName('my-class another-class');
```

### setImageUrl

`setImageUrl(imageUrl: string): ImageOverlay`

Set the URL of the image to display.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| imageUrl | string | Yes | The URL of the image to display. |

```js
imageOverlay.setImageUrl('https://developers.google.com/maps/documentation/javascript/examples/full/images/talkeetna.png');
```

### setOpacity

`setOpacity(opacity: number): ImageOverlay`

Set the opacity of the image.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| opacity | number | Yes | The opacity number between 0 and 1. |

```js
imageOverlay.setOpacity(0.5);
```

### setOptions

`setOptions(options: ImageOverlayOptions): ImageOverlay`

Set the options for the image overlay.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [ImageOverlayOptions](#imageoverlay-options) | Yes | The image overlay options. |

```js
imageOverlay.setOptions({opacity: 0.5, className: 'image-class'});
```

### setRotation

`setRotation(rotation: number): ImageOverlay`

Set the rotation angle in degrees.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| rotation | number | Yes | The rotation angle in degrees. |

```js
imageOverlay.setRotation(34);
```

### setStyles

`setStyles(styles: object): Overlay`

Set one or more styles for the image element. This will merge styles with the existing ones.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| styles | object | Yes | Object of key => value pairs of CSS styles to set on the element. |

```js
imageOverlay.setStyles({ backgroundColor: '#333', border: '2px solid #ff0000' });
```

### style

`style(name: string, value: string): Overlay`

Set a single style on the image element.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | Yes | The style name. For example, `color` or `backgroundColor`. |
| value | string | Yes | The style value. |

```js
imageOverlay.style('border', '3px solid #ff0000');
```

### toggle

`toggle(map: Map): void`

Toggle the display of the image overlay on the map.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| map | [Map](/api-reference/map) | Yes | The map object |

```js
imageOverlay.toggle(map);
```
