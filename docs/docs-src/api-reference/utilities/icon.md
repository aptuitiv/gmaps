---
---

# Icon

The `Icon` object sets up the icon for a marker.

`Icon` extends [Base](/api-reference/base-classes/base).

## Usage example

```js
const icon = G.icon({
    url: 'https://mywebsite.com/images/marker.png',
    size: [20, 32]
});
const marker = G.marker({
    latitude: 40.730610,
    longitude: -73.935242,
    icon
});
```

## Creating the Icon object

`G.icon(url?: IconValue, options?: IconOptions): Icon`

There are a few ways to setup the `Icon` object.

**No parameters.**

`G.icon(): Icon`

```js
const icon = G.icon();
```

**Pass the url and options.**

`G.icon(url: string, options?: IconOptions): Icon`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| url | string | Yes | The URL for the icon image. |
| options | [IconOptions](#icon-options)| | The icon options. |

```js
const icon = G.icon('https://mywebsite.com/images/marker.svg');
const icon = G.icon('https://mywebsite.com/images/marker.svg', {size: [20, 32]});
```

**Pass only the options.**

`G.icon(options: IconOptions): Icon`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [IconOptions](#icon-options)| Yes | The icon options. |

```js
const icon = G.icon({
    url: 'https://mywebsite.com/images/marker.png',
    size: [20, 32]
});
```

**Pass an existing Icon object.**

`G.icon(object: Icon): Icon`

In this case the `Icon` object is simply returned.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| object | Icon | Yes | An Icon object. |

```js
const icon = G.icon(iconObject);
```

## IconValue type

When other objects accept an Icon value the value type that they accept is an `IconValue`.

The `IconValue` can be one of the following values:

- An Icon object.
- A string (The URL for the icon graphic).
- An [IconOptions](#icon-options) object.

## Icon options

Type `IconOptions`.

IconOptions is an object containing the configuration options for the Icon object.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| anchor      | [PointValue](/api-reference/utilities/point#pointvalue-type) |  | The position at which to anchor an image in correspondence to the location of the marker on the map. By default, the anchor is located along the center point of the bottom of the image.                                                                |
| labelOrigin | [PointValue](/api-reference/utilities/point#pointvalue-type) |  | The origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker. By default, the origin is located in the center point of the image.                                                                     |
| origin      | [PointValue](/api-reference/utilities/point#pointvalue-type) |  | The position of the image within a sprite, if any. By default, the origin is located at the top left corner of the image (0, 0).                                                                                                                         |
| scaledSize  | [SizeValue](/api-reference/utilities/size#sizevalue-type)    |  | The size of the entire image after scaling, if any. Use this property to stretch/shrink an image or a sprite. |
| size        | [SizeValue](/api-reference/utilities/size#sizevalue-type)    |  | The display size of the sprite or image. When using sprites, you must specify the sprite size. If the size is not provided, it will be set when the image loads. If you're using an SVG you should set a size if the desired size is different from the height and width attributes of the SVG. |
| url         | string                                                       | ''        | The URL to the icon image (or sprite sheet) itself. All browsers support GIF, JPEG, SVG, and PNG formats. If an SVG is used, the height and width attributtes in the SVG HTML are required. If they are not set then the SVG will not display correctly. |

## Methods

- Methods inherited from [Base](/api-reference/base-classes/base#methods).

### setAnchor

`setAnchor(anchor: PointValue): Icon`

Set the position at which to anchor an image in correspondence to the location of the marker on the map.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| anchor | [PointValue](/api-reference/utilities/point#pointvalue-type) | Yes |  The anchor point value. |

```js
const icon = G.icon({
    url: 'https://mywebsite.com/images/marker.png',
 });
 icon.setAnchor([10, 32]);
```

Valid value types include:

```js
icon.setAnchor([10, 32]);
icon.setAnchor({x: 10, y: 32});
icon.setAnchor(pointObject);
```

### setLabelOrigin

`setLabelOrigin(origin: PointValue): Icon`

Set the origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| origin | [PointValue](/api-reference/utilities/point#pointvalue-type) | Yes |  The label origin value. |

```js
icon.setLabelOrigin([10, 32]);
icon.setLabelOrigin({x: 10, y: 32});
icon.setLabelOrigin(pointObject);
```

### setOptions

`setOptions(options: IconOptions): Icon`

This is an alternate way to set the icon options.

See the [icon options](#icon-options) section for the available options.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [IconOptions](#icon-options) | Yes | The options to set. |

```js
icon.setOptions({anchor: [0, -10]});
```

### setOrigin

`setOrigin(origin: PointValue): Icon`

Set the position of the image within a sprite, if any. By default, the origin is located at the top left corner of the image (0, 0).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| origin | [PointValue](/api-reference/utilities/point#pointvalue-type) | Yes |  The origin point value. |

```js
icon.setOrigin([10, 32]);
icon.setOrigin({x: 10, y: 32});
icon.setOrigin(pointObject);
```

### setScaledSize

`setScaledSize(sizeValue: SizeValue): Icon`

Set the scaled size of the icon. This is the size of the entire image after scaling. Use it to stretch or shrink an image or a sprite. Use this if for some reason you didn't pass the scaled size in the icon options.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| sizeValue | [SizeValue](/api-reference/utilities/size#sizevalue-type) | Yes |  The size value. |

```js
icon.setScaledSize([10, 32]);
icon.setScaledSize({width: 10, height: 32});
icon.setScaledSize(sizeObject);

// Shrink a 40x64 image to 20x32
icon.setSize([40, 64]).setScaledSize([20, 32]);
```

### setSize

`setSize(sizeValue: SizeValue): Icon`

Set the display size of the sprite or image. Use this if for some reason you didn't pass the size in the icon options.

When using sprites, you must specify the sprite size. If you're using an SVG you should set a size if the desired size is different from the height and width attributes of the SVG.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| sizeValue | [SizeValue](/api-reference/utilities/size#sizevalue-type) | Yes |  The size value. |

```js
icon.setSize([10, 32]);
icon.setSize({width: 10, height: 32});
icon.setSize(sizeObject);
```

### setUrl

`setUrl(url: string): Icon`

Set the icon URL.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| url | string | Yes |  The icon URL. |

```js
icon.setUrl('https://mywebsite.com/images/marker.png');
```

### toGoogle()

`toGoogle(): google.maps.Icon`

Returns the icon options as the [google.maps.Icon](https://developers.google.com/maps/documentation/javascript/reference/marker#Icon) interface.

```js
const googleIcon = icon.toGoogle();
```
