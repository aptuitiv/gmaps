---
---

# PolylineIcon

The `PolylineIcon` object sets up an icon to display on a [polyline](/api-reference/polyline).

`PolylineIcon` extends [Base](/api-reference/base-classes/base).

## Usage example

```js
// Create the icon
const icon = G.polylineIcon({
    icon: {
        path: "M -2,-2 2,2 M 2,-2 -2,2",
        strokeColor: "#22229B",
        strokeWeight: 4,
    }, 
    offset: '100%'
});
const circleIcon = G.polylineIcon({
    icon: {
        path: G.SymbolPath.CIRCLE,
        strokeColor: '#000000',
        scale: 2
    }, 
    offset: '10%'
});
// Create the polyline and set the icon
const polyline = G.polyline({
    icons: [icon, circleIcon],
    map: map,
    path: [
        { "latitude": 48.5, "longitude": 7 },
        { "latitude": 48.6, "longitude": 7.1 },
        { "latitude": 48.7, "longitude": 7.2 },
        { "latitude": 48.8, "longitude": 7.3 },
        { "latitude": 48.9, "longitude": 7.4 },
        { "latitude": 49, "longitude": 7.5 },
        { "latitude": 49.1, "longitude": 7.6 },
        { "latitude": 49.2, "longitude": 7.7 },
        { "latitude": 49.3, "longitude": 7.8 },
        { "latitude": 49.4, "longitude": 7.9 }
    ],
    strokeColor: '#22229B',
    strokeWeight: 3
});
```

## Creating the PolylineIcon object

`G.polylineIcon(options: PolylineIconValue): PolylineIcon`

There are a few ways to setup the `PolylineIcon` object.

**No parameters.**

`G.polylineIcon(): PolylineIcon`

```js
const icon = G.polylineIcon();
```

**Pass the options.**

`G.polylineIcon(options: PolylineIconOptions): PolylineIcon`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [PolylineIconOptions](#polylineicon-options)| Yes | The icon options. |

```js
const icon = G.polylineIcon({
    icon: {
        path: "M -2,-2 2,2 M 2,-2 -2,2",
        strokeColor: "#22229B",
        strokeWeight: 4,
    }, 
    offset: '100%'
});
```

**Pass an existing PolylineIcon object.**

`G.polylineIcon(object: PolylineIcon): PolylineIcon`

In this case the `PolylineIcon` object is simply returned.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| object | PolylineIcon | Yes | An PolylineIcon object. |

```js
const icon = G.polylineIcon(iconObject);
```

## PolylineIconValue type

When other objects accept an PolylineIcon value the value type that they accept is an `PolylineIconValue`.

The `PolylineIconValue` can be one of the following values:

- An PolylineIcon object.
- An [PolylineIconOptions](#polylineicon-options) object.

## PolylineIcon options

Type `PolylineIconOptions`.

PolylineIconOptions is an object containing the configuration options for the PolylineIcon object.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| fixedRotation | boolean | false | If true, each icon in the sequence has the same fixed rotation regardless of the angle of the edge on which it lies. If false, case each icon in the sequence is rotated to align with its edge. |
| icon | [SvgSymbolValue](/api-reference/utilities/svgsymbol#svgsymbolvalue-type) |  | The SVG icon to render. |
| offset | number\|string | '0%' | The distance from the start of the line at which an icon is to be rendered. This distance may be expressed as a percentage of line's length (e.g. '50%') or in pixels (e.g. '50px'). If you pass a number then it will be converted to a pixel value. |
| repeat  | number\|string | 0 | The distance between consecutive icons on the line. This distance may be expressed as a percentage of the line's length (e.g. '50%') or in pixels (e.g. '50px'). To disable repeating of the icon, specify '0'. If you pass a number then it will be converted to a pixel value. |

## Properties
  
| Property | Type | Description |
|----------|------|-------------|
| fixedRotation | boolean | If true, each icon in the sequence has the same fixed rotation regardless of the angle of the edge on which it lies. If false, case each icon in the sequence is rotated to align with its edge. Returns `false` if it hasn't been set. |
| icon | [SvgSymbolValue](/api-reference/utilities/svgsymbol#svgsymbolvalue-type) |  The SVG icon to render. It can be set with any `SvgSymbolValue`, but it's always returned as a [SvgSymbol](/api-reference/utilities/svgsymbol) object, or `undefined` if it hasn't been set. |
| offset | number\|string | The distance from the start of the line at which an icon is to be rendered. This distance may be expressed as a percentage of line's length (e.g. '50%') or in pixels (e.g. '50px'). If you pass a number then it will be converted to a pixel value. The value is returned as a string, or `undefined` if it hasn't been set. |
| repeat  | number\|string | The distance between consecutive icons on the line. This distance may be expressed as a percentage of the line's length (e.g. '50%') or in pixels (e.g. '50px'). To disable repeating of the icon, specify '0'. If you pass a number then it will be converted to a pixel value. The value is returned as a string, or `undefined` if it hasn't been set. |

### fixedRotation

Get and set the fixed rotation value.

```js
// Get the fixed rotation value
const fixedRotation = polyIcon.fixedRotation;
```

```js
// Set the fixed rotation
polyIcon.fixedRotation = true;
polyIcon.fixedRotation = false;
```

### icon

Get and set the SVG icon.

```js
// Get the icon value
const icon = polyIcon.icon;
```

```js
// Set the icon
polyIcon.icon = {
    path: "M -2,-2 2,2 M 2,-2 -2,2",
    strokeColor: "#22229B",
    strokeWeight: 4,
};
// Set as a SvgSymbol object
const svg = G.svgSymbol({
    path: "M -2,-2 2,2 M 2,-2 -2,2",
    strokeColor: "#22229B",
    strokeWeight: 4,
});
polyIcon.icon = svg;
```

### offset

Get and set the offset value.

```js
// Get the offset value
const offset = polyIcon.offset;
```

```js
// Set the offset
// The following are the same - they all are set to 10px
polyIcon.offset = 10;
polyIcon.offset = '10';
polyIcon.offset = '10px';
// Set as a percentage
polyIcon.offset = '30%';
```

### repeat

Get and set the repeat value.

```js
// Get the repeat value
const repeat = polyIcon.repeat;
```

```js
// Set the repeat
// The following are the same - they all are set to 10px
polyIcon.repeat = 5;
polyIcon.repeat = '5';
polyIcon.repeat = '5px';
// Set as a percentage
polyIcon.repeat = '10%';
```

## Methods

- Methods inherited from [Base](/api-reference/base-classes/base#methods).

### setFixedRotation

`setFixedRotation(fixedRotation: boolean): PolylineIcon`

Set the fixed rotation value. If the value is true then each icon in the sequence has the same fixed rotation regardless of the angle of the edge on which it lies. If false, case each icon in the sequence is rotated to align with its edge.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| fixedRotation | boolean | Yes |  The fixed rotation value. |

```js
polyIcon.setFixedRotation(true);
```

### setIcon

`setIcon(icon: SvgSymbolValue): PolylineIcon`

Set the icon value

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| icon | [SvgSymbolValue](/api-reference/utilities/svgsymbol#svgsymbolvalue-type) | Yes | The SVG icon to render. |

```js
polyIcon.setIcon({
    path: "M -2,-2 2,2 M 2,-2 -2,2",
    strokeColor: "#22229B",
    strokeWeight: 4,
});
// Set as a SvgSymbol object
const svg = G.svgSymbol({
    path: "M -2,-2 2,2 M 2,-2 -2,2",
    strokeColor: "#22229B",
    strokeWeight: 4,
});
polyIcon.setIcon(svg);
```

### setOffset

`setOffset(value: number|string): PolylineIcon`

Set the distance from the start of the line at which an icon is to be rendered.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | number\|string | Yes | The distance from the start of the line at which an icon is to be rendered. This distance may be expressed as a percentage of line's length (e.g. '50%') or in pixels (e.g. '50px'). If you pass a number then it will be converted to a pixel value.  |

```js
icon.setOffset(10);
icon.setOffset('10');
icon.setOffset('10px');
icon.setOffset('10%');
```

### setOptions

`setOptions(options: PolylineIconOptions): PolylineIcon`

This is an alternate way to set the icon options.

See the [icon options](#polylineicon-options) section for the available options.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [PolylineIconOptions](#polylineicon-options) | Yes | The options to set. |

```js
icon.setOptions({offset: '100%'});
```

### setRepeat

`setRepeat(value: number|string): PolylineIcon`

Set the repeat value. This sets the distance between consecutive icons along the polyline.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | number\|string | Yes | The distance between consecutive icons on the line. This distance may be expressed as a percentage of the line's length (e.g. '50%') or in pixels (e.g. '50px'). To disable repeating of the icon, specify '0'. If you pass a number then it will be converted to a pixel value. |

```js
icon.setRepeat(5);
icon.setRepeat('5');
icon.setRepeat('5px');
icon.setRepeat('5%');
```

### toGoogle()

`toGoogle(): Promise<google.maps.IconSequence>`

Returns the icon options as the [google.maps.IconSequence](https://developers.google.com/maps/documentation/javascript/reference/polygon#IconSequence) interface. It will be a promise value because the icon's [SvgSymbol](/api-reference/utilities/svgsymbol#togoogle) waits for the Google Maps library to load.

```js
polyIcon.toGoogle().then((icon) => {
    const googleIconSequence = icon;    
});
```
