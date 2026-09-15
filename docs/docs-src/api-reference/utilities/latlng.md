---
---

# LatLng

The `LatLng` object represents a latitude and longitude pair.

This is used internally such as when setting the center point for a map, or a marker location.

`LatLng` extends [Base](/api-reference/base-classes/base).

## Usage example

```js
const latLng = G.latLng(41.3874, 2.1686)
```

## Creating the LatLng object

`G.latLng(latitude?: LatLngValue | number | string, longitude?: number | string): LatLng`

There are a few ways to setup the `LatLng` object.

**No parameters.**

`G.latLng(): LatLng`

```js
const latLng = G.latLng();
```

**Pass the latitude and longitude values.**

`G.latLng(latitude: number, longitude: number): LatLng`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| latitude | number | Yes | The latitude value. |
| longitude | number | Yes | The longitude value. |

```js
const latLng = G.latLng(41.3874, 2.1686);
```

**Pass the latitude and lontitude values as an array.**

`G.latLng([latitude: number, longitude: number]): LatLng`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | Array | Yes | An array containing the latitude and longitude values |

```js
const latLng = G.latLng([41.3874, 2.1686]);
```

**Pass the latitude and lontitude values as an object.**

`G.latLng({lat: latitude: number, lng: longitude: number}): LatLng`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | object | Yes | An object containing the latitude and longitude values |

```js
const latLng = G.latLng({lat: 41.3874, lng: 2.1686});
```

`G.latLng({latitude: latitude: number, longitude: longitude: number}): LatLng`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | object | Yes | An object containing the latitude and longitude values |

```js
const latLng = G.latLng({latitude: 41.3874, longitude: 2.1686});
```

**Pass an existing LatLng object.**

`G.latLng(latLngObject: LatLng): LatLng`

In this case a new `LatLng` object with the same latitude and longitude values is returned.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| latLngObject | LatLng | Yes | A LatLng object. |

```js
const latLng = G.latLng(latLngObject);
```

**Pass a  `google.maps.LatLng` object.**

`G.latLng(latLngObject: google.maps.LatLng): LatLng`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| latLngObject | google.maps.LatLng | Yes | A google.maps.LatLng object. |

```js
const latLng = G.latLng(googleMapsLatLngObject);
```

## LatLngValue type

The `G.latLng()` function and other methods that accept the latitude/longitude values accept a `LatLngValue` as the `latitude` value.

The `LatLngValue` can be one of the following values:

- An array where the first value is the `latitude` value and the second value is the `longitude` value. For example:
  - Numbers: `[41.3874, 2.1686]`
  - Strings: `['41.3874', '2.1686']`
  - Mixed values: `['41.3874', 2.1686]`
- An object setting the `latitude` and `longitude` values. For example:
  - Short form numbers: `{lat: 41.3874, lng: 2.1686}`
  - Short forms strings: `{lat: '41.3874', lng: '2.168610'}`
  - Short forms mixed values: `{lat: '41.3874', lng: 2.168610}`
  - Long form numbers: `{latitude: 41.3874, longitude: 2.1686}`
  - Long forms strings: `{latitude: '41.3874', longitude: '2.168610'}`
  - Long forms mixed values: `{latitude: '41.3874', longitude: 2.168610}`
  - Mixed keys: `{latitude: 41.3874, lng: 2.1686}`
  - Mixed keys: `{lat: 41.3874, longitude: '2.1686'}`
- A LatLng object.
- A `google.maps.LatLng` object.

## LatLngLiteral type

The short form object for a latitude/longitude pair. For example: `{lat: 41.3874, lng: 2.1686}`.

| Property | Type | Description |
|----------|------|-------------|
| lat | number \| string | The latitude value. |
| lng | number \| string | The longitude value. |

## LatLngLiteralExpanded type

The long form object for a latitude/longitude pair. For example: `{latitude: 41.3874, longitude: 2.1686}`.

| Property | Type | Description |
|----------|------|-------------|
| latitude | number \| string | The latitude value. |
| longitude | number \| string | The longitude value. |

## Properties

| Property  | Type   | Description                                   |
|-----------|--------|-----------------------------------------------|
| latitude  | number | The latitude value                            |
| lat       | number | Short form to get and set the latitude value  |
| longitude | number | The longitude value                           |
| lng       | number | Short form to get and set the longitude value |

```js
latlng.lat = 41.3874;
const lat = latlng.lat;

latlng.latitude = 41.3874;
const lat = latlng.latitude;

latlng.lng = '2.1686';
const lng = latlng.lng;

latlng.longitude = 2.1686;
const lng = latlng.longitude;
```

## Methods

- Methods inherited from [Base](/api-reference/base-classes/base#methods).

### clone

`clone(): LatLng`

Clones the LatLng object and returns a new one.

```js
const clone = latLng.clone();
```

### equals

`equals(other: LatLngValue): boolean`

Tests to see if the given latitude/longitude pair is equal to this latitude/longitude pair.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| other | [LatLngValue](#latlngvalue-type) | Yes | The latitude/longitude value to compare. |

```js
if (latLng.equals(otherLatLngObject)) {
    // Do something
}
```

### getLat

`getLat(): number`

Get the latitude value.

```js
const lat = latLng.getLat();
```

### getLng

`getLng(): number`

Get the longitude value.

```js
const lng = latLng.getLng();
```

### isValid

`isValid(): boolean`

Returns whether the latitude/longitude pair is a valid value.

```js
if (latLng.isValid()) {
    // Do something here
}
```

### set

`set(latitude: LatLngValue | number | string, longitude?: number | string): LatLng`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| latitude | [LatLngValue](#latlngvalue-type) \| number \| string | Yes | The latitude value, an array with the latitude/longitude values, or an object containing the latitude/longitude values. |
| longitude | number \| string |  | The longitude value. Only set if `latitude` is the latitude and not an object or array. |

Set the latitude and longitude values. This accepts the values in the following ways:

`latLng.set(latitude: number, longitude: number)`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| latitude | number | Yes | The latitude value. |
| longitude | number | Yes | The longitude value. |

```js
latLng.set(41.3874, 2.1686);
```

`latLng.set([latitude: number, longitude: number])`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | Array | Yes | An array containing the latitude and longitude values |

```js
latLng.set([41.3874, 2.1686]);
```

`latLng.set({lat: latitude: number, lng: longitude: number})`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | object | Yes | An object containing the latitude and longitude values |

```js
latLng.set({lat: 41.3874, lng: 2.1686});
```

`latLng.set({latitude: latitude: number, longitude: longitude: number})`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | object | Yes | An object containing the latitude and longitude values |

```js
latLng.set({latitude: 41.3874, longitude: 2.1686});
```

`latLng.set(latLngObject: LatLng)`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| latLngObject | LatLng | Yes | A LatLng object. In this case the latitude and longitude from the object are used. |

```js
latLng.set(latLngObject);
```

### setLat

`setLat(lat: number | string): LatLng`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| lat | number \| string | Yes | The latitude value. Ideally it's a number, but it can be a number string. |

Set the latitude value. Use this if you want to change the latitude value after the object is created.

```js
latLng.setLat(41.3874);
```

Or, you can use chain methods together to create the initial object.

```js
const latLng = G.latLng().setLat(41.3874).setLng(2.1686);
```

### setLng

`setLng(lng: number | string): LatLng`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| lng | number \| string | Yes | The longitude value. Ideally it's a number, but it can be a number string. |

Set the longitude value. Use this if you want to change the longitude value after the object is created.

```js
latLng.setLng(2.1686);
```

Or, you can use chain methods together to create the initial object.

```js
const latLng = G.latLng().setLat(41.3874).setLng(2.1686);
```

### toGoogle

`toGoogle(): google.maps.LatLng|null`

Get the Google Maps LatLng object. `null` is only returned if the Google maps library has not been loaded.

An error is thrown if the latitude or longitude value is missing. Use [isValid](#isvalid) to check first.

```js
const gmLatLng = latLng.toGoogle();
```

### toJson

`toJson(): google.maps.LatLngLiteral`

Get the latLng JSON literal value.

```json
{
    lat: 41.3874,
    lng: 2.1686
}
```

```js
const latLngJson = latLng.toJson();
```
