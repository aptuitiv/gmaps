---
---

# DataFeature

The DataFeature object is a single feature within a [DataLayer](/api-reference/data-layer). It wraps the Google maps [Data.Feature](https://developers.google.com/maps/documentation/javascript/reference/data#Data.Feature) object.

`DataFeature` extends [Layer](/api-reference/base-classes/layer), so you can attach a [tooltip](/api-reference/tooltip) or a [popup](/api-reference/popup) to a single feature.

You don't create these yourself. They're returned by the [DataLayer](/api-reference/data-layer) methods that load or add data, and they're on the event object for data layer events.

## Example usage

```js
const features = await layer.loadGeoJson('/parcels.json');

features.forEach((feature) => {
    console.log(feature.id, feature.getProperty('name'), feature.geometryType);
});

layer.onClick((event) => {
    event.feature.setStyle({ fillColor: '#ff0000' });
});
```

## Feature properties type

The GeoJson properties attached to a feature. The `FeatureProperties` type is an object that can hold any type of data.

```js
type FeatureProperties = {
    [key: string]: any;
}
```

## Data feature value type

Type `DataFeatureValue`

Any [DataLayer](/api-reference/data-layer) method that takes a feature, like [remove()](/api-reference/data-layer#remove) or [overrideStyle()](/api-reference/data-layer#overridestyle), accepts `DataFeatureValue` as the value type.

The `DataFeatureValue` can be one of the following values:

- `DataFeature` object
- string or number. The id of the feature.

## Properties

- Properties inherited from [Layer](/api-reference/base-classes/layer#properties).

| Property | Type | Description |
|----------|------|-------------|
| geometryType | string\|undefined | The GeoJson geometry type for the feature. One of the [GeometryType](/api-reference/constants#geometrytype) values. This is `undefined` if the feature has no geometry. |
| id | string\|number\|undefined | The feature id. This is only set if the GeoJson data included one, or if it was set when the feature was added. |
| layer | [DataLayer](/api-reference/data-layer) | The data layer that the feature belongs to. |
| properties | [FeatureProperties](#feature-properties-type) | All of the GeoJson properties for the feature as a plain object. |

## Methods

- Methods inherited from [Layer](/api-reference/base-classes/layer#methods).
- Methods inherited from [Evented](/api-reference/base-classes/evented#methods).
- Methods inherited from [Base](/api-reference/base-classes/base#methods).

### attachPopup

`attachPopup(popupValue: DataPopupValue, event?: 'click' | 'clickon' | 'hover'): Popup`

Attach a [popup](/api-reference/popup) to this one feature.

This takes precedence over a popup attached to the whole layer with [DataLayer.attachPopup()](/api-reference/data-layer#attachpopup), so you can set a default for the layer and override it for the features that need something different.

See [Popups on data layer features](/guides/data-layer/popups) for the full picture.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| popupValue | [DataPopupValue](/api-reference/data-layer#popup-value-type) | Yes | The content for the popup, the popup options, or a Popup object. |
| event | string |  | The event that shows the popup. One of `click`, `clickon` or `hover`. Defaults to `click`. |

```js
const feature = await layer.getFeature('parcel-12');

feature.attachPopup('<h3>{name}</h3><p>{address}</p>');
```

A function works here too, and can return the content, a [PopupOptions](/api-reference/popup#popup-options) object, or a [Popup](/api-reference/popup) object.

```js
feature.attachPopup((f) => `<h3>${f.getProperty('name')}</h3>`);
```

### attachTooltip

`attachTooltip(tooltipValue: DataTooltipValue, event?: 'click' | 'clickon' | 'hover'): Tooltip`

Attach a [tooltip](/api-reference/tooltip) to this one feature. It shows on hover by default.

This takes precedence over a tooltip attached to the whole layer with [DataLayer.attachTooltip()](/api-reference/data-layer#attachtooltip).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| tooltipValue | [DataTooltipValue](/api-reference/data-layer#tooltip-value-type) | Yes | The content for the tooltip, the tooltip options, or a Tooltip object. |
| event | string |  | The event that shows the tooltip. One of `click`, `clickon` or `hover`. Defaults to `hover`. |

```js
const feature = await layer.getFeature('parcel-12');

feature.attachTooltip('{name}');
```

### getBounds

`getBounds(): LatLngBounds`

Get the bounds of the feature. This works for every geometry type.

```js
const bounds = feature.getBounds();
map.fitBounds(bounds);
```

### getGeometryType

`getGeometryType(): string|undefined`

Get the GeoJson geometry type for the feature. This is the same as the `geometryType` property. Returns `undefined` if the feature has no geometry.

```js
if (feature.getGeometryType() === G.GeometryType.POLYGON) {
    // Do something
}
```

### getId

`getId(): string|number|undefined`

Get the feature id. This is the same as the `id` property.

```js
const id = feature.getId();
```

### getLayer

`getLayer(): DataLayer`

Get the [data layer](/api-reference/data-layer) that the feature belongs to. This is the same as the `layer` property.

```js
const layer = feature.getLayer();
```

### getPath

`getPath(): LatLng[]`

Get the first path of positions for the feature.

For a line this is the line itself. For a polygon this is the outer edge. Use [getPaths()](#getpaths) if you also need the holes in a polygon. Returns an empty array if the feature has no geometry.

```js
const path = feature.getPath();
```

### getPaths

`getPaths(): LatLng[][]`

Get all of the paths of positions for the feature.

For a polygon the first path is the outer edge and any paths after that are the holes within it.

- A point returns one path holding its one position.
- A multi point returns one path holding all of its positions.
- A multi line string returns one path for each line.
- A multi polygon or a geometry collection returns the paths for each of its parts, one after another.
- A feature without any geometry returns an empty array.

```js
const paths = feature.getPaths();

console.log('Number of holes: ', paths.length - 1);
```

### getPosition

`getPosition(): LatLng|undefined`

Get the position of the feature if it's a point. Returns `undefined` for any other geometry type.

```js
const position = feature.getPosition();
```

### getProperties

`getProperties(): FeatureProperties`

Get all of the GeoJson properties for the feature as a plain object. This is the same as the `properties` property.

The Google maps API only lets you get one property at a time, so this collects them for you.

```js
const properties = feature.getProperties();
```

### getProperty

`getProperty(key: string): any`

Get a single property value for the feature.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| key | string | Yes | The property name to get the value for. |

```js
const name = feature.getProperty('name');
```

### hasProperty

`hasProperty(key: string): boolean`

Returns whether the feature has the given property set. A property set to `null` counts as not set.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| key | string | Yes | The property name to test for. |

```js
if (feature.hasProperty('name')) {
    // Do something
}
```

### remove

`remove(): DataFeature`

Remove the feature from the data layer that it belongs to.

```js
feature.remove();
```

### removeProperty

`removeProperty(key: string): DataFeature`

Remove a property from the feature.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| key | string | Yes | The property name to remove. |

```js
feature.removeProperty('name');
```

### resetStyle

`resetStyle(): DataFeature`

Reset the style for this feature back to the data layer style. This undoes [setStyle()](#setstyle).

```js
feature.resetStyle();
```

### setProperties

`setProperties(properties: FeatureProperties): DataFeature`

Set more than one property value on the feature at once.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| properties | [FeatureProperties](#feature-properties-type) | Yes | The properties to set. |

```js
feature.setProperties({ name: 'A park', type: 'park' });
```

### setProperty

`setProperty(key: string, value: any): DataFeature`

Set a property value on the feature.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| key | string | Yes | The property name to set. |
| value | any | Yes | The value to set. |

```js
feature.setProperty('name', 'A park');
```

### setStyle

`setStyle(style: DataStyleOptions): DataFeature`

Set the style for this one feature, overriding the data layer style. Use [resetStyle()](#resetstyle) to go back to the layer style.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| style | [DataStyleOptions](/api-reference/data-layer#data-style-options) | Yes | The style to set on this feature. |

```js
feature.setStyle({ fillColor: '#ff0000', strokeWeight: 3 });
```

### toGeoJson

`toGeoJson(): Promise<object>`

Export the feature as a GeoJson object.

```js
const geoJson = await feature.toGeoJson();
```

### toGoogle

`toGoogle(): google.maps.Data.Feature`

Returns the [Google maps Data.Feature object](https://developers.google.com/maps/documentation/javascript/reference/data#Data.Feature).

```js
const googleFeature = feature.toGoogle();
```
