---
---

# Size

The `Size` object represents the height and width of an element.

`Size` extends [Base](/api-reference/base-classes/base).

Some example usages include:

- Setting the size of a [marker icon](/api-reference/utilities/icon).
- Setting the offset for an InfoWindow.

## Usage example

```js
const size = G.size(15, 30)
```

## Creating the Size object

`G.size(width?: SizeValue, height?: number | string): Size`

There are a few ways to setup the `Size` object.

**No parameters.**

`G.size(): Size`

The width and height values are set to `0`.

```js
const size = G.size();
```

**Pass the width and height values.**

`G.size(width: number, height: number): Size`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| width | number | Yes | The width value. |
| height | number | Yes | The height value. |

```js
const size = G.size(15, 30);
```

**Pass the width and height values as an array.**

`G.size([width: number, height: number]): Size`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | Array | Yes | An array containing the width and height values |

```js
const size = G.size([15, 30]);
```

**Pass the width and height values as an object.**

`G.size({width: width: number, height: height: number}): Size`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | object | Yes | An object containing the width and height values |

```js
const size = G.size({width: 15, height: 30});
```

**Pass an existing Size object.**

`G.size(sizeObj: Size): Size`

In this case a new `Size` object with the same width and height values is returned.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| sizeObj | Size | Yes | A Size object. |

```js
const size = G.size(sizeObject);
```

## SizeValue type

The `G.size()` function and other methods that accept the width/height size values accept a `SizeValue` as the `width` value.

The `SizeValue` can be one of the following values:

- A number for the `width` value. In this case, the `height` value should also be set. For example: `3`.
- A string for the `width` value that is a number. In this case, the `height` value should also be set. For example: `'3'`.
- An array where the first value is the `width` value and the second value is the `height` value. For example:
  - Numbers: `[3, 10]`
  - Strings: `['3', '10']`
  - Mixed values: `[3, '10']`
- An object setting the `width` and `height` values. This is the `SizeObject` type. For example:
  - Numbers: `{width: 3, height: 10}`
  - Strings: `{width: '3', height: '10'}`
  - Mixed: `{width: '3', height: 10}`
- A Size object.

## Properties

| Property | Type   | Description      |
|----------|--------|------------------|
| height   | number | The height value |
| width    | number | The width value  |

```js
size.height = 30;
const height = size.height;

size.width = '45';
const width = size.width;
```

## Methods

- Methods inherited from [Base](/api-reference/base-classes/base#methods).

### clone

`clone(): Size`

Clones the Size object and returns a new one.

```js
const clone = size.clone();
```

### getHeight

`getHeight(): number`

Get the height value.

```js
const height = size.getHeight();
```

### getWidth

`getWidth(): number`

Get the width value.

```js
const width = size.getWidth();
```

### isValid

`isValid(): boolean`

Returns whether the width/height pair is a valid value.

```js
if (size.isValid()) {
    // Do something here
}
```

### set

`set(width: SizeValue, height?: number | string): Size`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| width | [SizeValue](#sizevalue-type) | Yes | The width value, array of width/height values, or an object containing the width/height values |
| height | number \| string | | The height value. Only set if the width value is set as a number. |

Set the width and height values. This accepts the values in the following ways:

`size.set(width: number, height: number)`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| width | number | Yes | The width value. |
| height | number | Yes | The height value. |

```js
size.set(15, 30);
```

`size.set([width: number, height: number])`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | Array | Yes | An array containing the width and height values |

```js
size.set([15, 30]);
```

`size.set({width: width: number, height: height: number})`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | object | Yes | An object containing the width and height values |

```js
size.set({width: 15, height: 30});
```

`size.set(sizeObj: Size)`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| sizeObj | Size | Yes | A Size object. In this case the width and height values from the object are used. |

```js
size.set(sizeObject);
```

### setHeight

`setHeight(height: number | string): Size`

Set the height value. Use this if you want to change the height value after the object is created.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| height | number \| string | Yes | The height value. Ideally it's a number, but it can be a number string. |

```js
size.setHeight(30);
```

### setWidth

`setWidth(width: number | string): Size`

Set the width value. Use this if you want to change the width value after the object is created.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| width | number \| string | Yes | The width value. Ideally it's a number, but it can be a number string. |

```js
size.setWidth(15);
```

### toGoogle

`toGoogle(): google.maps.Size|null`

Get the Google Maps Size object. `null` is only returned if the Google maps library hasn't loaded yet.

```js
const gmSize = size.toGoogle();
```
