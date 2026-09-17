---
---

# Point

The `Point` object represents a set of x and y pixel coordinates within the map view.

`Point` extends [Base](/api-reference/base-classes/base).

## Usage example

```js
const point = G.point(15, -100)
```

## Creating the Point object

`G.point(x?: PointValue, y?: number | string): Point`

There are a few ways to setup the `Point` object.

**No parameters.**

`G.point(): Point`

```js
const point = G.point();
```

**Pass the x and y values.**

`G.point(x: number, y: number): Point`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| x | number | Yes | The "x" value. |
| y | number | Yes | The "y" value. |

```js
const point = G.point(15, -100);
```

**Pass the x and y values as an array.**

`G.point([x: number, y: number]): Point`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | Array | Yes | An array containing the x and y values |

```js
const point = G.point([15, -100]);
```

**Pass the x and y values as an object.**

`G.point({x: x: number, y: y: number}): Point`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | object | Yes | An object containing the x and y values |

```js
const point = G.point({x: 15, y: -100});
```

**Pass an existing Point object.**

`G.point(pointObj: Point): Point`

In this case a new `Point` object with the same x and y values is returned.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| pointObj | Point | Yes | A Point object. |

```js
const point = G.point(pointObject);
```

## PointValue type

The `G.point()` function and other methods that accept the x/y point values accept a `PointValue` as the `x` value.

The `PointValue` can be one of the following values:

- A number for the `x` value. In this case, the `y` value should also be set. For example: `3`.
- A string for the `x` value that is a number. In this case, the `y` value should also be set. For example: `'3'`.
- An array where the first value is the `x` value and the second value is the `y` value. For example:
  - Numbers: `[3, 10]`
  - Strings: `['3', '10']`
  - Mixed values: `[3, '10']`
- An object setting the `x` and `y` values. This is the `PointObject` type. For example:
  - Numbers: `{x: 3, y: 10}`
  - Strings: `{x: '3', y: '10'}`
  - Mixed: `{x: '3', y: 10}`
- A Point object.

## Properties

| Property | Type   | Description                   |
|----------|--------|-------------------------------|
| x        | number | The x coordinate of the point |
| y        | number | The y coordinate of the point |

```js
point.x = 30;
const x = point.x;

point.y = '45';
const y = point.y;
```

## Methods

- Methods inherited from [Base](/api-reference/base-classes/base#methods).

### add

`add(x: PointValue, y?: number | string): Point`

Adds the x/y values to this point and returns the result as a new `Point` object. The original point isn't changed.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| x | [PointValue](#pointvalue-type) | Yes | The "x" value, array of x/y values, or an object containing the x/y value |
| y | number \| string | | The "y" value. Only set if the "x" value is set as a number. |

```js
const point2 = point.add(3, 2);
const point2 = point.add([3, 2]);
const point2 = point.add({x: 3, y: 2});
const point2 = point.add(anotherPointObject);
```

### ceil

`ceil(): Point`

Rounds the `x` and `y` values up to the next integer.

```js
point.ceil();
```

### clone

`clone(): Point`

Clones the Point object and returns a new one.

```js
const clone = point.clone();
```

### distanceTo

`distanceTo(value: PointValue): number`

This returns the cartesian distance between the point and the given point.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | PointValue | Yes | An array of x/y values, or an object containing the x/y value |

```js
const distance = point.distanceTo(G.point(56, 240));
```

### divide

`divide(num: number | string): Point`

Divides the x/y values by a number. This changes this point and returns it. If `num` is `0` then the point isn't changed.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| num | number \| string | Yes | The value to divide by. It can be a number string. |

```js
point.divide(3);
```

### equals

`equals(value: PointValue): boolean`

Returns whether the current point is equal to the given point.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | PointValue | Yes | An array of x/y values, or an object containing the x/y value |

```js
if (point.equals(anotherPointObject)) {
    // do something
}
```

### floor

`floor(): Point`

Rounds the x/y values down to the nearest integer.

```js
point.floor();
```

### getX

`getX(): number`

Get the x value.

```js
const x = point.getX();
```

### getY

`getY(): number`

Get the y value.

```js
const y = point.getY();
```

### isValid

`isValid(): boolean`

Returns whether the x/y pair is a valid value.

```js
if (point.isValid()) {
    // Do something here
}
```

### multiply

`multiply(num: number | string): Point`

Multiplies the x/y values by a number. This changes this point and returns it. If `num` is `0` then the point isn't changed.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| num | number \| string | Yes | The value to multiply by. It can be a number string. |

```js
point.multiply(3);
```

### round

`round(): Point`

Rounds the x/y values to the nearest integer.

```js
point.round();
```

### set

`set(x: PointValue, y?: number): Point`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| x | PointValue | Yes | The "x" value, array of x/y values, or an object containing the x/y values |
| y | number | | The "y" value. Only set if the "x" value is set as a number. |

Set the x and y values. This accepts the values in the following ways:

`point.set(x: number, y: number)`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| x | number | Yes | The "x" value. |
| y | number | Yes | The "y" value. |

```js
point.set(15, -100);
```

`point.set([x: number, y: number])`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | Array | Yes | An array containing the x and y values |

```js
point.set([15, -100]);
```

`point.set({x: x: number, y: y: number})`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | object | Yes | An object containing the x and y values |

```js
point.set({x: 15, y: -100});
```

`point.set(pointObj: Point)`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| pointObj | Point | Yes | A Point object. In this case the x and y values from the object are used. |

```js
point.set(pointObject);
```

### setX

`setX(x: number | string): Point`

Set the x value. Use this if you want to change the x value after the object is created.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| x | number \| string | Yes | The "x" value. Ideally it's a number, but it can be a number string. |

```js
point.setX(15);
```

Or, you can use chain methods together to create the initial object.

```js
const point = G.point().setX(15).setY(-100);
```

### setY

`setY(y: number | string): Point`

Set the y value. Use this if you want to change the y value after the object is created.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| y | number \| string | Yes | The "y" value. Ideally it's a number, but it can be a number string. |

```js
point.setY(-100);
```

Or, you can use chain methods together to create the initial object.

```js
const point = G.point().setX(15).setY(-100);
```

### subtract

`subtract(x: PointValue, y?: number | string): Point`

Subtracts the x/y values from this point. Unlike [add](#add), this changes this point and returns it rather than returning a new `Point` object.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| x | [PointValue](#pointvalue-type) | Yes | The "x" value, array of x/y values, or an object containing the x/y value |
| y | number \| string | | The "y" value. Only set if the "x" value is set as a number. |

```js
point.subtract(3, 2);
point.subtract([3, 2]);
point.subtract({x: 3, y: 2});
point.subtract(anotherPointObject);
```

Use [clone](#clone) first if you need to keep the original point.

```js
const point2 = point.clone().subtract(3, 2);
```

### toGoogle

`toGoogle(): google.maps.Point|null`

Get the Google Maps Point object. `null` is only returned if the Google maps library has not been loaded.

```js
const gmPoint = point.toGoogle();
```

### trunc

`trunc(): Point`

Change the x/y values to the integer part of a number by removing any fractional digits.

```js
point.trunc();
```
