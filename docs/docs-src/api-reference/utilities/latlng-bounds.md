---
---

# LatLngBounds

The `LatLngBounds` object represents the bounding area of one or more latitude/longitude points.

`LatLngBounds` extends [Base](/api-reference/base-classes/base).

## Usage example

```js
const bounds = G.latLngBounds({
    latitude: 40.712,
    longitude: -74.227
});
bounds.extend([40.712, -74.227]);
map.fitBounds(bounds);
```

Or you can get the bounds from a marker:

```js
const marker = G.marker({
    latitude: 40.712,
    longitude: -74.227
});
marker.addTo(map);
const bounds = G.latLngBounds();
bounds.extend(marker.getPosition());
map.fitBounds(bounds);
```

## Creating the LatLngBounds object

`G.latLngBounds(latLngValue?: LatLngBoundsValue): LatLngBounds`

The `G.latLngBounds()` function takes a [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) as the parameter.

There are a few ways to setup the `LatLngBounds` object.

**No parameters.**

`G.latLngBounds(): LatLngBounds`

In this case it's expected that you'll use the [extend](#extend) method to set each LatLng value.

```js
const bounds = G.latLngBounds();
bounds.extend([40.712, -74.227]);
```

**Pass a single LatLng value.**

`G.latLngBounds(latLngValue: LatLngValue): LatLngBounds`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| latLngValue | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) | Yes  | A latitude/longitude value. |

```js
const bounds = G.latLngBounds(latLngObject);
const bounds = G.latLngBounds([40.712, -74.227]);
const bounds = G.latLngBounds({lat: 40.712, lng: -74.227});
const bounds = G.latLngBounds({latitude: 40.712, longitude: -74.227});
```

**Pass an array of LatLng values.**

`G.latLngBounds(latLngValue: LatLngValue[]): LatLngBounds`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| latLngValue | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type)[] | Yes  | The array of latitude/longitude values. |

```js
const bounds = G.latLngBounds([
    latLngObject, 
    latLngObject2
]);
const bounds = G.latLngBounds([
    [40.712, -74.227], 
    [40.774, -74.125]
]);
const bounds = G.latLngBounds([
    {lat: 40.712, lng: -74.227}, 
    {lat: 40.774, lng:  -74.125}
]);
const bounds = G.latLngBounds([
    {latitude: 40.712, longitude: -74.227},
    {latitude: 40.774, longitude:  -74.125}
]);
```

**Pass an object containing the northeast and southwest LatLng values.**

`G.latLngBounds(object: LatLngBoundsEdges): LatLngBounds`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| object | [LatLngBoundsEdges](#latlngboundsedges-value-type) | Yes | An object containing the northeast and southwest values. |

```js
const bounds3 = G.latLngBounds({
    ne: G.latLng(44.7, -70.8),
    sw: G.latLng(44, -68),
});
```

**Pass an object containing the separate north, east, south, west values.**

`G.latLngBounds(object: LatLngBoundsLiteral): LatLngBounds`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| object | [LatLngBoundsLiteral](#latlngboundsliteral-value-type) | Yes | An object containing the north, east, south, and west values. |

```js
const bounds3 = G.latLngBounds({
    north: 44.7,
    east: -70.8,
    south: 44,
    west: -68
});
```

**Pass an existing LatLngBounds object.**

`G.latLngBounds(object: LatLngBounds): LatLngBounds`

In this case the `LatLngBounds` object is simply returned.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| object | LatLngBounds | Yes | A LatLngBounds object. |

```js
const bounds = G.latLngBounds(boundsObject);
```

## LatLngBounds value type

The `LatLngBoundsValue` can be one of the following values:

- `LatLngBounds` object
- A single [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) value.
- An array of [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) values.
- A [LatLngBoundsEdges](#latlngboundsedges-value-type) object.
- A [LatLngBoundsLiteral](#latlngboundsliteral-value-type) object.

## LatLngBoundsEdges value type

This is an object containing the northeast and southwest values.

| Property | Type | Description |
|----------|------|-------------|
| ne | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) | The northeast value. |
| sw | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) | The southwest value. |

## LatLngBoundsLiteral value type

This is an object contianing the east, north, south, and west values. 

This is identical to the [google.maps.LatLngBoundsLiteral](https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBoundsLiteral) object.

| Property | Type | Description |
|----------|------|-------------|
| east | number | The east longitude value. |
| north | number | The north latitude value. |
| south | number | The south latitude value. |
| west | number | The west longitude value. |


## Methods

- Methods inherited from [Base](/api-reference/base-classes/base#methods).

### contains

`contains(latLngValue: LatLngValue): boolean`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| latLngValue | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) | Yes | The latitude and longitude value. |

Returns whether the given LatLng value is within this bounds.

An error is thrown if the value isn't a valid latitude/longitude value.

```js
if (bounds.contains([40.712, -75.227])) {
    // do something
}
```

### equals

`equals(other: LatLngBounds): Promise<boolean>`

Returns whether this bounds approximately equals the given bounds.

You must pass another `LatLngBounds` object to test. If something else is passed then the promise resolves with `false`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| other | LatLngBounds | Yes | The other LatLngBounds object to test. |

```js
const equals = await bounds.equals(bounds);
```

### extend

`extend(latLngValue: LatLngValue | LatLngValue[]): LatLngBounds`

Extends this bounds to contain the given point. The `LatLngBounds` object is returned so that you can chain methods.

An error is thrown if a value isn't a valid latitude/longitude value. If an empty array is passed then a warning is logged to the console and nothing is changed.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| latLngValue | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) or array of LatLngValue values  | Yes | The latitude and longitude value(s). |

```js
bounds.extend([40.712, -74.227]);
```

You can pass the `LatLngValue` in a few ways.

Pass a single LatLng value:

```js
bounds.extend(latLngObject);
bounds.extend([40.712, -74.227]);
bounds.extend({lat: 40.712, lng: -74.227});
bounds.extend({latitude: 40.712, longitude: -74.227});
```

Pass an array of LatLng values:

```js
bounds.extend([
    latLngObject, 
    latLngObject2
]);
bounds.extend([
    [40.712, -74.227], 
    [40.774, -74.125]
]);
bounds.extend([
    {lat: 40.712, lng: -74.227}, 
    {lat: 40.774, lng:  -74.125}
]);
bounds.extend([
    {latitude: 40.712, longitude: -74.227},
    {latitude: 40.774, longitude:  -74.125}
]);
```

### getCenter

`getCenter(): LatLng`

Gets the center of the LatLngBounds.

If the bounds has no lat/lng values then there isn't a real center, so check [isEmpty](#isempty) first.

If the bounds only has one lat/lng value then the center will be that lat/lng value.

```js
const center = bounds.getCenter();
```

### getNorthEast

`getNorthEast(): LatLng`

Get the north-east corner of the LatLngBounds.

If the bounds has no lat/lng values then there isn't a real north-east corner, so check [isEmpty](#isempty) first.

If the bounds only has one lat/lng value then the north-east value will be that lat/lng value.

```js
const ne = bounds.getNorthEast();
```

### getSouthWest

`getSouthWest(): LatLng`

Get the south-west corner of the LatLngBounds.

If the bounds has no lat/lng values then there isn't a real south-west corner, so check [isEmpty](#isempty) first.

If the bounds only has one lat/lng value then the south-west value will be that lat/lng value.

```js
const sw = bounds.getSouthWest();
```

### intersects

`intersects(other: LatLngBounds): Promise<boolean>`

Returns whether this bounds shares any points with the other bounds.

The promise is rejected if `other` isn't a `LatLngBounds` object.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| other | LatLngBounds | Yes | The other LatLngBounds object to test. |

```js
const intersects = await bounds.intersects(bounds2);
```

### isEmpty

`isEmpty(): boolean`

Returns whether this bounds is empty.

```js
if (bounds.isEmpty()) {
    // Do something
}
```

### toGoogle

`toGoogle(): Promise<google.maps.LatLngBounds>`

Returns the Google Maps LatLngBounds object.

```js
bounds.toGoogle().then((gmLatLngBounds) => {
    // Do something
});
```

### toJson

`toJson(): google.maps.LatLngBoundsLiteral`

Converts the LatLngBounds object to a [JSON object](https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBoundsLiteral).

Example:

`{south: 40.774, west: -76.227, north: 42.715, east: -74.125}`

```js
const json = bounds.toJson();
```

### toString

`toString(): string`

Converts the LatLngBounds object to a string.

It will be in this format:

`((SW.lat, SW.lng), (NE.lat, NE.lng))`

For example:

`((40.774, -76.227), (42.715, -74.125))`

If the Google Maps LatLngBounds object hasn't been set up yet, then the format is slightly different:

`(SW.lat, SW.lng) (NE.lat, NE.lng)`

```js
const string = bounds.toString();
```

### toUrlValue

`toUrlValue(precision?: number): string`

Returns the LatLngBounds object as a string that can be used in a URL.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| precision | number | | The number of decimal places to round the lat/lng values to. Defaults to `3`. |

The value will be in this format:

`SW.lat,SW.lng,NE.lat,NE.lng`

For example:

`40.774,-76.227,42.715,-74.125`

```js
const urlValue = bounds.toUrlValue();
```

### union

`union(other: LatLngBounds | google.maps.LatLngBounds): Promise<void>`

Extends the bounds of the current LatLngBounds object to contain the union of it and the given bounds.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| other | LatLngBounds \| google.maps.LatLngBounds | Yes | The other LatLngBounds object to include. |

```js
bounds.union(otherLatLngBoundsObject)
    .then(() => {
        // Do something here
    });
```
