---
---

# MapRestriction

The MapRestriction object is used restrict the Google map bounds. It allows you to prevent the map from panning or zooming beyond the constrains that are set.

This is done by setting [Latitude/Longitude bounds](/api-reference/utilities/latlng-bounds).

:::warning
If a LatLngBounds value is not set then the restriction is not used.
:::

## Example usage

```js
const restriction = G.mapRestriction({
    latLngBounds: [
        [40.712, -74.227],
        [40.774, -74.125]
    ]
});

const map = G.map('map', {
    center: [40.7128, -74.0060],
    restriction: restriction,
});
```

## Creating the MapRestriction object

`G.mapRestriction(options?: MapRestrictionValue): MapRestriction`

There are a few ways to setup the `MapRestriction` object.

**Pass no value.**

`G.mapRestriction(): MapRestriction`

In this case you will need to set the `latLngBounds` value after you create the object.

```js
const restriction = G.mapRestriction();
restriction.latLngBounds = [{lat: 40.712, lng: -74.227}, {lat: 40.774, lng: -74.124}];
```

**Pass a boolean value to disable the MapRestriction object.**

`G.mapRestriction(value: boolean): MapRestriction`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | boolean | Yes | Whether to enable the MapRestriction object. |

If you pass a `false` value to the `mapRestriction` method then the `restriction` value will not be set in the [Map options](/api-reference/map#map-options).

```js
const restriction = G.mapRestriction(false);
```

**Pass a LatLngBounds value.**

`G.mapRestriction(value: LatLngBoundsValue): MapRestriction`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | [LatLngBoundsValue](/api-reference/utilities/latlng-bounds#latlngbounds-value-type) | Yes | The LatLngBounds value to restrict the map to. |

```js
const restriction = G.mapRestriction([
    [40.712, -74.227],
    [40.774, -74.125]
]);
```

**Pass an object of options.**

`G.mapRestriction(options: MapRestrictionOptions): MapRestriction`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [MapRestrictionOptions](#maprestriction-options) | Yes | The configuration options. |

```js
const mapRestriction = G.mapRestriction({
    latLngBounds: [
        [40.712, -74.227],
        [40.774, -74.125]
    ],
});
```

**Pass an existing MapRestriction object.**

`G.mapRestriction(value: MapRestriction): MapRestriction`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | MapRestriction | Yes | The existing MapRestriction object. |

```js
const restriction = G.mapRestriction(existingMapRestrictionObject);
```

## MapRestriction value type

The `MapRestrictionValue` can be one of the following values:

- boolean
- A [LatLngBoundsValue](/api-reference/utilities/latlng-bounds#latlngbounds-value-type) value.
- A [MapRestrictionOptions](#maprestriction-options) value.
- A MapRestriction object.

## MapRestriction options

Type `MapRestrictionOptions`.

MapRestrictionOptions is an object containing the configuration options for the MapRestriction object.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| enabled | boolean | true | Whether the MapRestriction object is enabled. |
| latLngBounds | [LatLngBoundsValue](/api-reference/utilities/latlng-bounds#latlngbounds-value-type) | | The value for the [LatLngBounds object](/api-reference/utilities/latlng-bounds). |
| strictBounds | boolean | false | If `true`, anything outside of the `latLngBounds` will be hidden when zooming. This can restrict how much the user can zoom out. |

## Properties

| Property  | Type   | Description                             |
|-----------|--------|-----------------------------------------|
| enabled | boolean | Whether the MapRestriction object is enabled. |
| latLngBounds | [LatLngBounds](/api-reference/utilities/latlng-bounds) | The [LatLngBounds object](/api-reference/utilities/latlng-bounds) for the restriction. Any [LatLngBoundsValue](/api-reference/utilities/latlng-bounds#latlngbounds-value-type) can be used to set it. |
| strictBounds | boolean | If `true`, anything outside of the `latLngBounds` will be hidden when zooming. This can restrict how much the user can zoom out. |

### enabled

Get and set whether the MapRestriction object is enabled.

```js
// Get whether the MapRestriction object is enabled
const isEnabled = restriction.enabled;
```

Set the `enabled` value.

```js
// Set that the MapRestriction object is disabled
restriction.enabled = false;

// Set that the MapRestriction object is enabled
restriction.enabled = true;
```

### latLngBounds

Get and set the LatLngBounds for the restriction.

:::info
The LatLngBounds needs to have at least two unique latitude/longitude values, otherwise the restriction is considered invalid.
:::

The value is returned as a [LatLngBounds object](/api-reference/utilities/latlng-bounds). If the LatLngBounds value has not been set yet, then `undefined` is returned.

```js
// Get the existing LatLngBounds value
const bounds = restriction.latLngBounds;
```

Set the `latLngBounds` value. Any valid [LatLngBoundsValue](/api-reference/utilities/latlng-bounds#latlngbounds-value-type) value can be used.

```js
restriction.latLngBounds = [
    [40.712, -74.227],
    [40.774, -74.125]
];
```

### strictBounds

Get and set whether the bounds are strict.

```js
// Get the value
const strict = restriction.strictBounds;
```

```js
// Set that the restriction is strict
restriction.strictBounds = true;

// Set that the restriction is not strict
restriction.strictBounds = false;
```

## Methods

### disable

`disable(): MapRestriction`

Disables the MapRestriction object.

If the MapRestriction object is disabled then the `restriction` value will not be set in the [Map options](/api-reference/map#map-options).

```js
restriction.disable();
```

### enable

`enable(): MapRestriction`

Enables the MapRestriction object.

```js
restriction.enable();
```

### isEnabled

`isEnabled(): boolean`

Get whether the MapRestriction object is enabled. This is the same as using the [enabled](#enabled) property.

```js
if (restriction.isEnabled()) {
    // Do something
}
```

### isValid

`isValid(): boolean`

Get whether the MapRestriction object is valid. The object is valid if the `latLngBounds` value has at least two different LatLng values.

```js
if (restriction.isValid()) {
    // Do something
}
```

### setLatLngBounds

`setLatLngBounds(value: LatLngBoundsValue): MapRestriction`

Set the `latLngBounds` value.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | [LatLngBoundsValue](/api-reference/utilities/latlng-bounds#latlngbounds-value-type) | Yes | The LatLngBounds value. |

```js
restriction.setLatLngBounds([
    { lat: 40.712, lng: -74.227 }, 
    { lat: 40.774, lng: -74.124 }
]);
```

### setStrictBounds

`setStrictBounds(value: boolean): MapRestriction`

Set the `strictBounds` value.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | boolean | Yes | Whether the bounds are strict. |

```js
// Set the bounds as strict
restriction.setStrictBounds(true);
// Set the bounds as not strict
restriction.setStrictBounds(false);
```

### toGoogle

`toGoogle(): Promise<google.maps.MapRestriction>`

Get the object to use to pass the MapRestriction options to the Google Map instance.

```js
restriction.toGoogle().then((mapRestriction) => {
    // Do something with the mapRestriction value
});
```
