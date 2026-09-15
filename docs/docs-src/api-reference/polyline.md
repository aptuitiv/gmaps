---
---

# Polyline

The Polyline object displays a single [polyline](https://developers.google.com/maps/documentation/javascript/shapes#polylines) on the map.

`Polyline` extends [Layer](/api-reference/base-classes/layer).

## Example usage

```js
const polyline = G.polyline({
    map: map,
    path: [
        {lat: 48.1, lng: 2},
        {lat: 48.4, lng: 2.1},
        {lat: 48.6, lng: 1.8},
    ]
});
```

## Creating the Polyline object

`G.polyline(options?: PolylineValue): Polyline`

There are a few ways that you can setup the `Polyline` object.

**No parameters.**

`G.polyline(): Polyline`

```js
const polyline = G.polyline();
```

**Pass the polyline options.**

`G.polyline(options: PolylineOptions): Polyline`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [PolylineOptions](#polyline-options) | Yes | The options. |

```js
const polyline = G.polyline({
    map: map,
    path: [
        {lat: 48.1, lng: 2},
        {lat: 48.4, lng: 2.1},
        {lat: 48.6, lng: 1.8},
    ]
});
```

**Pass an existing Polyline object.**

`G.polyline(object: Polyline): Polyline`

In this case the `Polyline` object is simply returned.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| object | Polyline | Yes | A Polyline object. |

```js
const polyline = G.polyline(polylineObject);
```

## Polyline value type

Any methods that accept a polyline value accepts `PolylineValue` as the value type.

The `PolylineValue` can be one of the following values:

- `Polyline` object
- [PolylineOptions](#polyline-options) object

## Custom data type

You can attach an object of data to the polyline object to hold some custom data. An example usage would be to include some content that you want to show in a popup when a polyline is clicked.

The `CustomData` type represents this data. Essentially it's an object that can hold any type of data

```js
type CustomData = {
    [key: string]: any;
}
```

## Polyline options

Type `PolylineOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| clickable | boolean | true | Whether the polyline handles click events. |
| dashed | boolean | false | Whether the polyline should display as a dashed line. |
| dashGap | string\|number | 15px | The gap between each dash if the polyline is dispayed as a dashed line. The gap can be in pixels or a percentage of the dashed line's length. If only a number is passed then it's converted to pixels. |
| data | [CustomData](#custom-data-type) | | An optional object to hold custom data to attach to the polyline object. |
| highlightPolyline | [PolylineValue](#polyline-value-type) | | The polyline to show below the existing one to create a "highlight" effect when the mouse hovers over this polyline. If an options object is passed then it's merged with this polyline's options, so you only need to set the options that are different. See [Highlighting polylines](/guides/polyline/highlight) for more information. |
| icons | [PolylineIconValue](/api-reference/polyline-icon#polylineiconvalue-type)\|[PolylineIconValue](/api-reference/polyline-icon#polylineiconvalue-type)[] | | Any icons to show on the polyline. |
| map | [Map](/api-reference/map) | | The map to add the polyline to. |
| path | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type)[] | | An array of LatLng values defining the path of the polyline on the map. Invalid values are ignored. |
| simplify | boolean\|number\|[PolylineSimplifyOptions](#polyline-simplify-options) | false | Simplify the path that is drawn on the map so that it has fewer points but keeps the same shape. Set a number for how far, in meters, the drawn line can be from the original path, or `true` to use 2 meters. Use an object to set a tolerance for different zoom levels or to log debug information. The `path` property still holds every point. See [Simplifying the path](#simplifying-the-path). |
| strokeColor | string | | The polyline stroke color. All CSS3 colors are supported except for extended named colors. |
| strokeOpacity | number\|string | 1 | The polyline stroke opacity. The value should be between 0 and 1.0. A number string is converted to a number. |
| strokeWeight | number\|string | 1 | The polyline stroke width in pixels. A number string is converted to a number. |
| tooltip | [TooltipValue](/api-reference/tooltip#tooltipvalue-type) | | The tooltip for the polyline. This will show when hovering over the polyline. |
| visible | boolean | true | Whether the polyline is visible. |
| zIndex | number\|string | | The zIndex compared to other polylines. A number string is converted to a number. |

## Simplifying the path

Paths with a lot of points, like GPS tracks, often have far more points than can be seen on the map. Every point uses memory and has to be processed each time the map is drawn, which can slow down or even crash the map on phones.

The `simplify` option gives the map fewer points to draw but keeps the same shape. Points are only dropped if the line without them stays within the tolerance of the original path. The first and last points and every turn bigger than the tolerance are kept.

```js
// Keep the drawn line within 2 meters of the original path
const trail = G.polyline({ path: gpsPoints, simplify: true, map: map });

// Or set the tolerance in meters
trail.setSimplify(5);
```

Things to know:

- It's off unless you turn it on.
- The `path` property always holds every point. Only the line drawn on the map is simplified, and it's worked out again whenever the path or the tolerance changes.
- The highlight polyline, if there is one, draws the same simplified path.
- 2 meters can't be seen at most zoom levels. When zoomed in very close, a larger tolerance can make small zigzags look smoother. GPS points are usually only accurate to a few meters anyway.
- If you measure the length of the line drawn on the map, the simplified line is slightly shorter than the original.

### Polyline simplify options

Pass an object to the `simplify` option to set a tolerance for different zoom levels or to log debug information.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| debug | boolean | false | Log to the console how many points are drawn each time the path is simplified. See [Checking if it helps](#checking-if-it-helps). |
| tolerance | number | 2 | How far, in meters, the drawn line can be from the original path. This is used at zoom levels that don't have their own tolerance in the `zoom` option. |
| zoom | object | | A tolerance for different zoom levels. Each key is a zoom level and its value is the tolerance, in meters, to use at that zoom level and higher, up to the next zoom level that is set. `0` means every point is drawn. |

### Different tolerances for zoom levels

When the map is zoomed out, a larger tolerance can't be seen and removes more points. When it's zoomed in close, a smaller tolerance keeps more detail. Use the `zoom` option to set the tolerance for each range of zoom levels.

```js
const trail = G.polyline({
    path: gpsPoints,
    map: map,
    simplify: {
        // 10 meters below zoom 14, 5 meters from zoom 14, 2 meters from zoom 16, and 1 meter from zoom 18
        zoom: { 0: 10, 14: 5, 16: 2, 18: 1 },
    },
});
```

- The tolerance is updated after the map finishes zooming, not during the zoom, so that the work isn't done while the map is moving. When zooming in, the extra detail shows once the map stops.
- The path is only simplified again when the zoom moves into a range with a different tolerance.
- Each simplified path is kept after it's worked out, so zooming back to a range doesn't simplify the path again. This uses a little more memory, but each simplified path is much smaller than the original.
- Closer zoom levels with smaller tolerances draw more points, but still far fewer than the whole path.
- If the map is at a zoom level below the lowest zoom level that is set, the `tolerance` option is used.

### Checking if it helps

Set `debug` to `true` to log to the console what happens each time the path is simplified.

```js
const trail = G.polyline({ path: gpsPoints, map: map, simplify: { tolerance: 2, debug: true } });
// [Polyline simplify] 20,000 points in the path, 2,068 drawn (89.7% fewer) with a 2 m tolerance. Took 5.5 ms.
```

With the `zoom` option, the message also includes the zoom level, and it says when a path that was already simplified is used again. The polyline object is logged with the message so that you can tell which polyline it's about.

To compare against no simplifying, set the tolerance to `0` with debug on: `simplify: { tolerance: 0, debug: true }`.

### Simplifying points yourself

To simplify points yourself, for example before saving them, use `G.simplifyPath()`. It returns an array of [LatLng](/api-reference/utilities/latlng) objects.

`G.simplifyPath(path: LatLngValue[], tolerance?: number): LatLng[]`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| path | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type)[] | Yes | The points to simplify. Invalid values are ignored. |
| tolerance | number | | How far, in meters, the simplified line can be from the original line. Defaults to 2. If it isn't a number greater than 0 then every valid point is returned. |

```js
const fewerPoints = G.simplifyPath(gpsPoints, 5);
```

## Events

Below are the available polyline events. All of the [Google Maps polyline events](https://developers.google.com/maps/documentation/javascript/reference/polygon#Polyline-Events) can be used, along with the `ready` event from this library.

You can use the plain text name for the event, or you can use the [event constant](/api-reference/constants#polylineevents).

If the polyline has a [highlight polyline](#sethighlightpolyline), any event listener added with `on()` is also added to the highlight polyline so that mouse events on it behave the same as on this polyline. The `ready` event is not added to the highlight polyline. Removing a listener with `off()` also removes it from the highlight polyline.

| Event    | Description |
|----------|-------------|
| click | The DOM click event is fired on the polyline. |
| contextmenu | The DOM contextmenu event is fired on the polyline. |
| dblclick | The DOM dblclick event is fired on the polyline. |
| drag | Fired repeatedly while the user drags the polyline. |
| dragend | The user stops dragging the polyline. |
| dragstart | The user starts dragging the polyline. |
| mousedown | The DOM mousedown event is fired on the polyline. |
| mousemove | The DOM mousemove event is fired on the polyline. |
| mouseout | The mouse leaves the polyline. |
| mouseover | The mouse enters the polyline. |
| mouseup | The DOM mouseup event is fired on the polyline. |
| ready | The polyline is loaded and ready for use. |

```js
polyline.on('click', (e) => {
    // Do something when the polyline is clicked
});

// You can use the event constant
polyline.on(G.PolylineEvents.MOUSE_OVER, (e) => {
    // Do something
});
```

### ready

```js
polyline.on('ready', () => {
    // Do something
});

// You can use the event constant
polyline.on(G.PolylineEvents.READY, () => {
    // Do something
});

// Or, use the onReady method
polyline.onReady(() => {
    // Do something
});
```

## Properties

- Properties inherited from [Layer](/api-reference/base-classes/layer#properties).
  
| Property | Type | Description |
|----------|------|-------------|
| clickable | boolean | Whether the polyline handles click events. |
| data | [CustomData](#custom-data-type) | An object that holds custom data to attach to the polyline object. |
| dashed | boolean | Whether the polyline should display as a dashed line. |
| dashGap | string\|number | The gap between each dash if the polyline is dispayed as a dashed line. The gap can be in pixels or a percentage of the dashed line's length. If only a number is passed then it's converted to pixels. The value is always returned as a string, like `'15px'`. |
| highlightPolyline | [PolylineValue](#polyline-value-type) | The polyline to show below the existing one to create a "highlight" effect when the mouse hovers over this polyline. It can be set with a `Polyline` object or with polyline options, but it's always returned as a `Polyline` object. See [Highlighting polylines](/guides/polyline/highlight) for more information. |
| icons | [PolylineIconValue](/api-reference/polyline-icon#polylineiconvalue-type)\|[PolylineIconValue](/api-reference/polyline-icon#polylineiconvalue-type)[] | Any icons to show on the polyline. The value is always returned as an array of [PolylineIcon](/api-reference/polyline-icon) objects. |
| map | [Map](/api-reference/map)\|null | The map to add the polyline to. Set to `null` to remove the polyline from the map. |
| path | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type)[] | An array of LatLng values defining the path of the polyline on the map. This always holds every point, even when the path is simplified. |
| simplify | number | How far, in meters, the line drawn on the map can be from the original path. If the tolerance changes with the zoom level, this is the tolerance for the current zoom level. It's `0` if the path isn't simplified. It can be set with `true` (2 meters), `false` (off), a number, or a [PolylineSimplifyOptions](#polyline-simplify-options) object. Setting it calls [setSimplify()](#setsimplify). |
| strokeColor | string | The polyline stroke color. All CSS3 colors are supported except for extended named colors. |
| strokeOpacity | number\|string | The polyline stroke opacity. The value should be between 0 and 1.0. The value is always returned as a number. |
| strokeWeight | number\|string | The polyline stroke width in pixels. The value is always returned as a number. |
| visible | boolean | Whether the polyline is visible. |
| zIndex | number\|string | The zIndex compared to other polylines. The value is always returned as a number. |

## Methods

- Methods inherited from [Layer](/api-reference/base-classes/layer#methods).
- Methods inherited from [Evented](/api-reference/base-classes/evented#methods).
- Methods inherited from [Base](/api-reference/base-classes/base#methods).

### clone

`clone(): Polyline`

Clones the polyline object. The clone includes the polyline options, the custom data, the map, any attached tooltip, and a clone of the highlight polyline if one is set.

```js
const copy = polyline.clone();
```

### getData

`getData(key?: string): any`

Gets either all the custom data attached to the polyline object or the value for a specific data key from the custom data object.

If the `key` is specified but the value doesn't exist in the custom data object, then `null` is returned.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| key | string | No | The object key to get a specific piece of data from the custom data obect. If this is not set then the entire custom data object is returned. |

Get the entire data object.

```js
const customData = polyline.getData();
```

Get a specific value from the custom data object.

```js
const customValue = polyline.getData('dataKey');
```

### hasZIndex

`hasZIndex(): boolean`

Returns whether the polyline has a zIndex set.

```js
if (polyline.hasZIndex()) {
    // Do something
}
```

### hide

`hide(): Polyline`

Hide the polyline. If a "highlight polyline" is set then that is also hidden.

This sets the `visible` property to false. It does not remove the polyline from the map.

```js
polyline.hide();
```

### highlight

`highlight(options?: PolylineOptions): Polyline`

Display the highlight polyline if it exists. See [Highlighting polylines](/guides/polyline/highlight) for more information.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [PolylineOptions](#polyline-options) | | The polyline options to override the existing highlight polyline options. |

Nothing happens if the polyline doesn't have a highlight polyline or if the polyline is hidden.

```js
polyline.highlight();
```

You can override the current highlight options by passing in the options parameter.
This allows you to override one or more of the following options:

- clickable
- dashed
- dashGap
- icons
- strokeColor
- strokeOpacity
- strokeWeight
- zIndex

When the polyline is unhighlighted, the original options will be restored.

```js
polyline.highlight({strokeColor: 'blue'});
```

### onReady

`onReady(callback: EventCallback): void`

Callback for when the polyline is loaded and ready for use.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
polyline.onReady(() => {
    // Do something
})
```

### setDashed

`setDashed(dashed: boolean, dashGap?: string|number): Polyline`

Sets whether the polyline should be a dashed line.

This also lets you set the dash gap at the same time. The dash gap is only set if `dashed` is `true`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| dashed | boolean | Yes | Whether the polyline should display as a dashed line. |
| dashGap | string\|number | | The gap between each dash if the polyline is dispayed as a dashed line. The gap can be in pixels or a percentage of the dashed line's length. If only a number is passed then it's converted to pixels. |

```js
// Change a dashed line to a solid line.
polyline.setDashed(false);

// Set a polyline to be dashed
polyline.setDashed(true);

// Set a polyline to be dashed and set the dash gap to 20px
polyline.setDashed(true, 20);
```

### setDashGap

`setDashGap(gap: string|number): Polyline`

Set the gap between dashes when a polyline is displayed as dashes.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| gap | string\|number | Yes | The gap between each dash if the polyline is dispayed as a dashed line. The gap can be in pixels or a percentage of the dashed line's length. If only a number is passed then it's converted to pixels. |

```js
// Pass a number only. This is the same as passing '20px'
polyline.setDashGap(20);

// Set a specific pixel value
polyline.setDashGap('18px');

// Set a percentage of the dashed line's length
polyline.setDashGap('10%');
```

### setHighlightPolyline

`setHighlightPolyline(value: PolylineOptions | Polyline): Polyline`

Set up a version of the polyline to show when hovering over the polyline to give it a "highlight" effect. See [Highlighting polylines](/guides/polyline/highlight) for more information.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | [PolylineValue](#polyline-value-type) | Yes | The highlight polyline options or the highlight polyline object. If options are passed then they are merged with this polyline's options, so you only need to set the options that are different. |

```js
polyline.setHighlightPolyline({
    strokeColor: 'purple',
    strokeOpacity: 0.5,
    strokeWeight: 4,
});
```

### setIcons

`setIcons(value: PolylineIconValue|PolylineIconValue[]): Polyline`

Set the icons for the polyline.

You can pass a single icon value or an array of icon values. Each icon value can be an object containing the icon options or a SvgSymbol object.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | [PolylineIconValue](/api-reference/polyline-icon#polylineiconvalue-type)\|[PolylineIconValue](/api-reference/polyline-icon#polylineiconvalue-type)[] | Yes | Any icons to show on the polyline. |

```js
polyline.setIcons([
    G.svgSymbol({
        path: G.SymbolPath.CIRCLE,
        strokeColor: '#000000',
        scale: 2
    }),
    {
        icon: {
            path: "M -2,-2 2,2 M 2,-2 -2,2",
            strokeColor: "#22229B",
            strokeWeight: 4,
        }, 
        offset: '100%'
    }
]);
```

### setMap

`setMap(value: Map|null, isVisible?: boolean): Promise<Polyline>`

Add the polyline to the map and display it. Pass `null` to remove the polyline from the map.

If the polyline has a highlight polyline then the map is set on it as well.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | [Map](/api-reference/map)\|null | Yes | The map object. Set to `null` to remove the polyline from the map. |
| isVisible | boolean |  | Whether the polyline is visible on the map. Defaults to `true`. |

```js
polyline.setMap(map);

// Set the map but don't show the polyline
polyline.setMap(map, false);

// Remove the polyline from the map
polyline.setMap(null);
```

### setOptions

`setOptions(options: PolylineOptions): Polyline`

Set the options for the polyline.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [PolylineOptions](#polyline-options) | Yes | The polyline options. |

```js
polyline.setOptions({
    path: path,
    map: map,
    strokeColor: 'red',
    strokeWeight: 3,
    zIndex: 2,
});
```

### setPath

`setPath(path: LatLngValue[]): Polyline`

Set the path of the polyline.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| path | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type)[] | Yes | An array of LatLng values defining the path of the polyline on the map. |

```js
polyline.setPath([
    {lat: 48.1, lng: 2},
    {lat: 48.4, lng: 2.1},
    {lat: 48.6, lng: 1.8},
]);
```

### setSimplify

`setSimplify(value: boolean|number|PolylineSimplifyOptions): Polyline`

Set whether to simplify the path that is drawn on the map. The `path` property still holds every point. See [Simplifying the path](#simplifying-the-path).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | boolean\|number\|[PolylineSimplifyOptions](#polyline-simplify-options) | Yes | How far, in meters, the drawn line can be from the original path. `true` uses 2 meters. `false` or `0` turns simplifying off. Use an object to set a tolerance for different zoom levels or to log debug information. |

```js
polyline.setSimplify(5);
```

### setStrokeColor

`setStrokeColor(strokeColor: string): Polyline`

Set the SVG stroke color. All CSS3 colors are supported except for extended named colors.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| strokeColor | string | Yes | The color value. All CSS3 colors are supported except for extended named colors. |

```js
polyline.setStrokeColor('#ff0000');
```

### setStrokeOpacity

`setStrokeOpacity(strokeOpacity: number|string): Polyline`

Set the opacity of the stroke.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| strokeOpacity | number\|string | Yes | The stroke opacity value between 0 and 1.0. A number string is converted to a number. |

```js
polyline.setStrokeOpacity(0.5);
```

### setStrokeWeight

`setStrokeWeight(strokeWeight: number|string): Polyline`

Set the weight of the stroke in pixels.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| strokeWeight | number\|string | Yes | The stroke weight value. A number string is converted to a number. |

```js
polyline.setStrokeWeight(2);
```

### setVisible

`setVisible(visible: boolean): Polyline`

Set whether the polyline is visible on the map.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| visible | boolean | Yes | Whether the polyline is visible on the map. |

```js
polyline.setVisible(true);
```

```js
polyline.setVisible(false);
```

### show

`show(map?: Map): Promise<Polyline>`

Show the polyline on the map. This will also set the map object if it's passed.

You don't need to pass the `map` object if the polyline has already been assigned to the map.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| map | [Map](/api-reference/map) |  | The map object. |

```js
polyline.show();
```

```js
polyline.show(map);
```

### toGoogle

`toGoogle(): Promise<google.maps.Polyline>`

Returns the Google Maps Polyline object. It will be a promise value.

```js
polyline.toGoogle().then((googlePolyline) => {
    // Do something with the Google polyline object
});
```

### unhighlight

`unhighlight(): Polyline`

Hide the highlight polyline if it exists. See [Highlighting polylines](/guides/polyline/highlight) for more information.

```js
polyline.unhighlight();
```
