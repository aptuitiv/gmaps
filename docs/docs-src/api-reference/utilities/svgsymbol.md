---
---

# SvgSymbol

The `SvgSymbol` object represents an SVG symbol that can be used for a marker's icon or display on a polyline.

`SvgSymbol` extends [Base](/api-reference/base-classes/base).

## Usage example

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
```

## Creating the SvgSymbol object

`G.svgSymbol(path?: SvgSymbolValue, options?: SvgSymbolOptions): SvgSymbol`

There are a few ways to setup the `SvgSymbol` object.

**No parameters.**

`G.svgSymbol()`

```js
const symbol = G.svgSymbol();
```

**Pass the path only.**

`G.svgSymbol(path: string)`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| path | string | Yes | The SVG path for the icon. |

```js
const symbol = G.svgSymbol('M0,6a6,6 0 1,0 12,0a6,6 0 1,0 -12,0');
```

**Pass the path and the options.**

`G.svgSymbol(path: string, options: SvgSymbolOptions)`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| path | string | Yes | The SVG path for the icon. |
| options | [SvgSymbolOptions](#svgsymbol-options) | Yes | The options for the SvgSymbol object. |

```js
const symbol = G.svgSymbol('M0,6a6,6 0 1,0 12,0a6,6 0 1,0 -12,0', {
    fillColor: '#5284ed',
    fillOpacity: 1,
    scale: 1,
    strokeColor: '#5284ed',
    strokeOpacity: 0.5,
    strokeWeight: 4,
});
```

**Pass the options only.**

`G.svgSymbol(options: SvgSymbolOptions)`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [SvgSymbolOptions](#svgsymbol-options) | Yes | The options for the SvgSymbol object. |

```js
const symbol = G.svgSymbol({
    path: 'M0,6a6,6 0 1,0 12,0a6,6 0 1,0 -12,0',
    fillColor: '#5284ed',
    fillOpacity: 1,
    scale: 1,
    strokeColor: '#5284ed',
    strokeOpacity: 0.5,
    strokeWeight: 4,
});
```

**Pass an existing SvgSymbol object.**

`G.svgSymbol(object: SvgSymbol): SvgSymbol`

In this case the `SvgSymbol` object is simply returned.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| object | SvgSymbol | Yes | A SvgSymbol object. |

```js
const symbol = G.svgSymbol(symbolObject);
```

## SvgSymbolValue type

When other objects accept a SvgSymbol value the value type that they accept is a `SvgSymbolValue`.

The `SvgSymbolValue` can be one of the following values:

- An SvgSymbol object.
- A string (The SVG path value, or one of the [SymbolPath](/api-reference/constants#symbolpath) constants).
- An [SvgSymbolOptions](#svgsymbol-options) object.

The `SvgSymbolValue` type is used by the [PolylineIcon](/api-reference/polyline-icon) `icon` option and the [Marker](/api-reference/marker) `svgIcon` option. Note that the Marker `svgIcon` option treats a string value as the full SVG code rather than a path, so use an `SvgSymbol` object or an `SvgSymbolOptions` object if you only have the path.

```js
// SvgSymbol object
const symbolObject = G.svgSymbol({path: 'M0,6a6,6 0 1,0 12,0a6,6 0 1,0 -12,0', fillColor: '#5284ed'});

// String path value
const pathString = 'M0,6a6,6 0 1,0 12,0a6,6 0 1,0 -12,0';

// SvgSymbolOptions object
const symbolOptions = {
    path: G.SymbolPath.CIRCLE,
    fillColor: '#5284ed',
    fillOpacity: 1,
    scale: 6,
};
```

## SvgSymbol options

Type `SvgSymbolOptions`.

SvgSymbolOptions is an object containing the configuration options for the SvgSymbol object.

The `path` option is required when passing an `SvgSymbolOptions` object. All other options are optional.

The number options (`fillOpacity`, `rotation`, `scale`, `strokeOpacity`, and `strokeWeight`) also accept a number string, like `'0.5'`. It's converted to a number.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| anchor | [PointValue](/api-reference/utilities/point#pointvalue-type) | [0, 0] | The position of the symbol relative to the marker or polyline. By default, the anchor is located along the center point of the bottom of the image. This causes the SVG to appear off of the bottom right of the marker. Often you want to adjust the anchor so that the SVG is centered on the marker. The `x` value should be half the SVG width and the `y` value should be half the SVG height. |
| fillColor | string | #000000 | The SVG fill color. |
| fillOpacity | number | 1 | The opacity of the fill. |
| labelOrigin | [PointValue](/api-reference/utilities/point#pointvalue-type) | [0, 0] | The origin of the label relative to the origin of the path, if label is supplied by the marker. By default, the origin is located in the center point of the image. |
| path | string |  | Required. The SVG path for the icon. You cannot set the entire SVG code. Only use the `path` value of the SVG. You can also use one of the [SymbolPath](/api-reference/constants#symbolpath) constants, like `G.SymbolPath.CIRCLE`. |
| rotation | number | 0 | The rotation of the icon in degrees clockwise about the anchor point. |
| scale | number | 1 | The amount by which the icon is scaled. |
| strokeColor | string | #000000 | The SVG stroke color. All CSS3 colors are supported except for extended named colors. |
| strokeOpacity | number | 1 | The opacity of the stroke, where 0 is fully transparent and 1 is fully opaque. |
| strokeWeight | number |  | The weight of the stroke in pixels. |

## Properties

All the properties can be read and set. The number properties (`fillOpacity`, `rotation`, `scale`, `strokeOpacity`, and `strokeWeight`) can be set with a number or a number string, and are always returned as a number.

| Property | Type   | Description      |
|----------|--------|------------------|
| anchor   | [PointValue](/api-reference/utilities/point#pointvalue-type) | The position of the symbol relative to the marker or polyline. It's returned as a [Point](/api-reference/utilities/point) object. |
| fillColor | string | The SVG fill color. |
| fillOpacity | number\|string | The opacity of the fill. |
| labelOrigin | [PointValue](/api-reference/utilities/point#pointvalue-type) | The origin of the label relative to the origin of the path, if label is supplied by the marker.|
| path | string | The SVG path, or one of the [SymbolPath](/api-reference/constants#symbolpath) constants. |
| rotation | number\|string | The rotation of the icon in degrees clockwise about the anchor point. |
| scale | number\|string | The amount by which the icon is scaled. |
| strokeColor | string | The SVG stroke color. |
| strokeOpacity | number\|string | The opacity of the stroke. |
| strokeWeight | number\|string | The weight of the stroke. |

Examples:

```js
symbol.anchor = [0, -10];
const anchor = symbol.anchor;

symbol.strokeColor = '#9E008B';
```

## Methods

- Methods inherited from [Base](/api-reference/base-classes/base#methods).

### setAnchor

`setAnchor(anchor: PointValue): SvgSymbol`

Set the position at which to anchor an image in correspondence to the location of the marker on the map.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| anchor | [PointValue](/api-reference/utilities/point#pointvalue-type) | Yes | The anchor value. |

```js
symbol.setAnchor([10, 32]);
```

### setFillColor

`setFillColor(fillColor: string): SvgSymbol`

Set the SVG fill color.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| fillColor | string | Yes | The fill color value. |

```js
symbol.setFillColor('#5284ed');
```

### setFillOpacity

`setFillOpacity(fillOpacity: number|string): SvgSymbol`

Set the opacity of the fill.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| fillOpacity | number\|string | Yes | The fill opacity value. A number string is converted to a number. |

```js
symbol.setFillOpacity(0.5);
```

### setLabelOrigin

`setLabelOrigin(labelOrigin: PointValue): SvgSymbol`

Set the origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| labelOrigin | [PointValue](/api-reference/utilities/point#pointvalue-type) | Yes | The label origin value. |

```js
symbol.setLabelOrigin([0, -2]);
```

### setOptions

`setOptions(options: SvgSymbolOptions): SvgSymbol`

An alternate way to set one or more options.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [SvgSymbolOptions](#svgsymbol-options) | Yes | The options for the SvgSymbol object. |

```js
const symbol = G.svgSymbol('M0,6a6,6 0 1,0 12,0a6,6 0 1,0 -12,0').setOptions({
    path: 'M0,6a6,6 0 1,0 12,0a6,6 0 1,0 -12,0',
    fillColor: '#5284ed',
    fillOpacity: 1,
    scale: 1,
    strokeColor: '#5284ed',
    strokeOpacity: 0.5,
    strokeWeight: 4,
});
```

### setPath

`setPath(path: string): SvgSymbol`

Set the SVG path for the symbol.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| path | string | Yes | The SVG path, or one of the [SymbolPath](/api-reference/constants#symbolpath) constants. |

```js
symbol.setPath('M0,6a6,6 0 1,0 12,0a6,6 0 1,0 -12,0');
symbol.setPath(G.SymbolPath.CIRCLE);
```

### setRotation

`setRotation(rotation: number|string): SvgSymbol`

Set the rotation of the icon in degrees clockwise about the anchor point.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| rotation | number\|string | Yes | The rotation value. A number string is converted to a number. |

```js
symbol.setRotation(45);
```

### setScale

`setScale(scale: number|string): SvgSymbol`

Set the amount by which the icon is scaled.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| scale | number\|string | Yes | The scale value. A number string is converted to a number. |

```js
symbol.setScale(3);
```

### setStrokeColor

`setStrokeColor(strokeColor: string): SvgSymbol`

Set the SVG stroke color. All CSS3 colors are supported except for extended named colors.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| strokeColor | string | Yes | The color value. All CSS3 colors are supported except for extended named colors. |

```js
symbol.setStrokeColor('#ff0000');
```

### setStrokeOpacity

`setStrokeOpacity(strokeOpacity: number|string): SvgSymbol`

Set the opacity of the stroke.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| strokeOpacity | number\|string | Yes | The stroke opacity value. A number string is converted to a number. |

```js
symbol.setStrokeOpacity(0.5);
```

### setStrokeWeight

`setStrokeWeight(strokeWeight: number|string): SvgSymbol`

Set the weight of the stroke.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| strokeWeight | number\|string | Yes | The stroke weight value. A number string is converted to a number. |

```js
symbol.setStrokeWeight(2);
```

### toGoogle

`toGoogle(): Promise<google.maps.Symbol>`

Get the symbol in the [format that Google expects](https://developers.google.com/maps/documentation/javascript/reference/marker#Symbol). It will be a promise value because it waits for the Google Maps library to load. If the path is one of the [SymbolPath](/api-reference/constants#symbolpath) constants then it's converted to the matching `google.maps.SymbolPath` value.

```js
symbol.toGoogle().then((symbol) => {
    const gmSymbol = symbol;    
});

```
