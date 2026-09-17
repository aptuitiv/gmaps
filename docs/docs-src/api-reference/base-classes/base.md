---
---

# Base

The `Base` class is used by objects that don't extend the [Evented](./evented) class.

```js
class MyThing extends Base {}
```

:::info
This is used internally and in plugins. It is not intended to be used to display objects on the map.
:::

## Methods

### constructor

`constructor(objectType: string)`

The class object constructor.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| objectType | string | Yes | The object type. i.e. "latlng", "point", "size". Used with [getObjectType](#getobjecttype) and the object type tests below. |

```js
class MyThing extends Base {
    constructor() {
        super('mything');
    }
}
```

### getObjectType

`getObjectType(): string`

Each object in the library has a specific type. This gets that value.

For example, the [Map](/api-reference/map) object has a type of `map`. And the [Marker](/api-reference/marker) object has a type of `marker`.

You can use this if you need to test what type of object you're working with.

```js
if (thing.getObjectType() === 'marker') {
    // Do something
}
```

### include

`static include(mixin: object)`

This allows you to include a [mixin](https://javascript.info/mixins) into a class.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| mixin | object| Yes | The object to merge into this object. |

```js
Base.include({
    someFunction() {}
})
```

### isIcon

`isIcon(): boolean`

Returns whether the object is an [Icon](/api-reference/utilities/icon) object.

This is a simpler test than using [getObjectType](#getobjecttype).

```js
if (thing.isIcon()) {
    // Do something
}
```

### isInfoWindow

`isInfoWindow(): boolean`

Returns whether the object is an [InfoWindow](/api-reference/infowindow) object.

This is a simpler test than using [getObjectType](#getobjecttype).

```js
if (thing.isInfoWindow()) {
    // Do something
}
```

### isLatLng

`isLatLng(): boolean`

Returns whether the object is a [LatLng](/api-reference/utilities/latlng) object.

This is a simpler test than using [getObjectType](#getobjecttype).

```js
if (thing.isLatLng()) {
    // Do something
}
```

### isLatLngBounds

`isLatLngBounds(): boolean`

Returns whether the object is a [LatLngBounds](/api-reference/utilities/latlng-bounds) object.

This is a simpler test than using [getObjectType](#getobjecttype).

```js
if (thing.isLatLngBounds()) {
    // Do something
}
```

### isMap

`isMap(): boolean`

Returns whether the object is a [Map](/api-reference/map) object.

This is a simpler test than using [getObjectType](#getobjecttype).

```js
if (thing.isMap()) {
    // Do something
}
```

### isMarker

`isMarker(): boolean`

Returns whether the object is a [Marker](/api-reference/marker) object.

This is a simpler test than using [getObjectType](#getobjecttype).

```js
if (thing.isMarker()) {
    // Do something
}
```

### isMarkerCluster

`isMarkerCluster(): boolean`

Returns whether the object is a [MarkerCluster](/api-reference/marker-cluster) object.

This is a simpler test than using [getObjectType](#getobjecttype).

```js
if (thing.isMarkerCluster()) {
    // Do something
}
```

### isPoint

`isPoint(): boolean`

Returns whether the object is a [Point](/api-reference/utilities/point) object.

This is a simpler test than using [getObjectType](#getobjecttype).

```js
if (thing.isPoint()) {
    // Do something
}
```

### isPolyline

`isPolyline(): boolean`

Returns whether the object is a [Polyline](/api-reference/polyline) object.

This is a simpler test than using [getObjectType](#getobjecttype).

```js
if (thing.isPolyline()) {
    // Do something
}
```

### isPopup

`isPopup(): boolean`

Returns whether the object is a [Popup](/api-reference/popup) object.

This is a simpler test than using [getObjectType](#getobjecttype).

```js
if (thing.isPopup()) {
    // Do something
}
```

### isSize

`isSize(): boolean`

Returns whether the object is a [Size](/api-reference/utilities/size) object.

This is a simpler test than using [getObjectType](#getobjecttype).

```js
if (thing.isSize()) {
    // Do something
}
```

### isSvgSymbol

`isSvgSymbol(): boolean`

Returns whether the object is a [SvgSymbol](/api-reference/utilities/svgsymbol) object.

This is a simpler test than using [getObjectType](#getobjecttype).

```js
if (thing.isSvgSymbol()) {
    // Do something
}
```
