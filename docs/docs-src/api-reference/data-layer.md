---
---

# DataLayer

The DataLayer object displays GeoJson data, polygons, lines and points on the map. It wraps the Google maps [data layer](https://developers.google.com/maps/documentation/javascript/datalayer).

`DataLayer` extends [Layer](/api-reference/base-classes/layer).

There are two kinds of data layer.

- **The map's own data layer.** Every map has one and it's available as [`map.data`](/api-reference/map#data).
- **A separate layer** that you create with `G.dataLayer()`. Use this when you want a layer that only holds your own data.

They're the same object and support the same methods. The only difference is where the underlying Google object comes from.

## Example usage

```js
// The map's own data layer
map.data.setStyle({ fillColor: '#4caf50', fillOpacity: 0.4 });
map.loadGeoJson('/parcels.json');

// A separate layer
const parcels = G.dataLayer({
    geoJson: '/parcels.json',
    style: { fillColor: '#4caf50' },
});
parcels.setMap(map);
```

## Creating the DataLayer object

`G.dataLayer(options?: DataLayerValue): DataLayer`

There are a few ways that you can set up the `DataLayer` object.

**No parameters.**

`G.dataLayer(): DataLayer`

```js
const layer = G.dataLayer();
```

**Pass the data layer options.**

`G.dataLayer(options: DataLayerOptions): DataLayer`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [DataLayerOptions](#data-layer-options) | Yes | The options. |

```js
const layer = G.dataLayer({
    map: map,
    geoJson: '/parcels.json',
    style: { fillColor: '#4caf50' },
});
```

**Pass an existing DataLayer object.**

`G.dataLayer(object: DataLayer): DataLayer`

In this case the `DataLayer` object is simply returned.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| object | DataLayer | Yes | A DataLayer object. |

```js
const layer = G.dataLayer(layerObject);
```

## You don't have to wait for the map

A separate data layer only needs the Google maps library to be loaded, not a map. Because of that you can create a layer and load data into it before there's a map to show it on, and then attach the whole thing to the map later.

```js
// This can run before the map exists
const layer = G.dataLayer();
layer.loadGeoJson('/parcels.json');

// The features are already in the layer by the time it's attached
layer.setMap(map);
```

Every call is run in the order that you made it, however long the map takes to be ready. So this always applies the style after the data has loaded, even though neither call waited for the other.

```js
layer.loadGeoJson('/parcels.json');
layer.setStyle({ fillColor: '#4caf50' });
```

## Data layer value type

Any methods that accept a data layer value accept `DataLayerValue` as the value type.

The `DataLayerValue` can be one of the following values:

- `DataLayer` object
- [DataLayerOptions](#data-layer-options) object

## Data layer options

Type `DataLayerOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| fitBounds | boolean | false | Whether to fit the map to the bounds of the data once it's loaded. |
| geoJson | string\|string[]\|object | | GeoJson to load into the layer. This can be a url, an array of urls, or a GeoJson object. |
| idProperty | string | | The name of the GeoJson property to use as the feature id. |
| map | [Map](/api-reference/map) | | The map to add the data layer to. |
| style | [DataStyleValue](#data-style-value-type) | | The style to apply to the features in the layer. |
| visible | boolean | true | Whether the layer is visible on the map. |

## Load options

Type `LoadOptions`

The options for [loadGeoJson](#loadgeojson) and [addGeoJson](#addgeojson).

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| fitBounds | boolean | false | Whether to fit the map to the bounds of the data once it's loaded. This overrides the layer option of the same name. |
| idProperty | string | | The name of the GeoJson property to use as the feature id. This overrides the layer option of the same name. |
| replace | boolean | false | Whether to remove the existing features before loading the new ones. See the [warning on clear()](#clear) as this has the same effect. |

## Feature options

Type `FeatureOptions`

The options for [addPolygon](#addpolygon), [addPolyline](#addpolyline) and [addPoint](#addpoint).

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| id | string\|number | | The id to give the feature. |
| properties | [FeatureProperties](/api-reference/data-feature#feature-properties-type) | | The GeoJson properties to attach to the feature. |
| style | [DataStyleOptions](#data-style-options) | | The style to set on this one feature, overriding the layer style. |

## Data style options

Type `DataStyleOptions`

These use this library's option names, which match the [Polyline](/api-reference/polyline#polyline-options) options, rather than the Google maps names.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| clickable | boolean | true | Whether the feature handles mouse events. |
| cursor | string | | The CSS cursor to show when hovering over the feature. |
| draggable | boolean | false | Whether the feature can be dragged. |
| editable | boolean | false | Whether the feature's geometry can be edited. |
| fillColor | string | | The fill color for polygons. All CSS3 colors are supported except for extended named colors. |
| fillOpacity | number | | The fill opacity for polygons. The value should be between 0 and 1.0. |
| icon | [Icon](/api-reference/utilities/icon)\|[SvgSymbol](/api-reference/utilities/svgsymbol)\|string\|google.maps.Icon\|google.maps.Symbol | | The icon to use for point geometry. This can be an [Icon](/api-reference/utilities/icon) object, a [SvgSymbol](/api-reference/utilities/svgsymbol) object, or a url. A Google maps icon or symbol object is passed through as it is. |
| strokeColor | string | | The stroke color. All CSS3 colors are supported except for extended named colors. |
| strokeOpacity | number | | The stroke opacity. The value should be between 0 and 1.0. |
| strokeWeight | number | | The stroke width in pixels. |
| title | string | | The hover text for point geometry. |
| visible | boolean | true | Whether the feature is visible. |
| zIndex | number | | The zIndex compared to other features. |

## Data style value type

Any methods that accept a style value accept `DataStyleValue` as the value type.

The `DataStyleValue` can be one of the following values:

- A [DataStyleOptions](#data-style-options) object, which is applied to every feature in the layer.
- A function that is called for each feature and returns a [DataStyleOptions](#data-style-options) object for it. The function is passed the [DataFeature](/api-reference/data-feature) object.

```js
// One style for everything
layer.setStyle({ fillColor: '#4caf50' });

// A style for each feature
layer.setStyle((feature) => ({
    fillColor: feature.getProperty('type') === 'park' ? '#4caf50' : '#2196f3',
}));
```

## Tooltip callback type

Type `DataTooltipCallback`

The data layer version of [TooltipCallback](/api-reference/tooltip#tooltip-callback-type). It's passed a [DataFeature](/api-reference/data-feature) rather than the layer.

`(feature: DataFeature) => TooltipValue`

```js
layer.attachTooltip((feature) => feature.getProperty('name'));
```

## Tooltip value type

Type `DataTooltipValue`

Any method that attaches a tooltip accepts `DataTooltipValue`. It takes the same shapes as [DataPopupValue](#popup-value-type): a string with `{property}` placeholders, an `HTMLElement` or `Text` node, a [TooltipOptions](/api-reference/tooltip#tooltip-options) object, a [Tooltip](/api-reference/tooltip) object, or a [DataTooltipCallback](#tooltip-callback-type) function.

## Popup callback type

Type `DataPopupCallback`

This is the data layer version of [PopupCallback](/api-reference/popup#popup-callback-type). The only difference is what it's passed: a [DataFeature](/api-reference/data-feature) rather than the layer, because one data layer holds many features.

`(feature: DataFeature) => PopupValue`

Like the core callback it can return any [PopupValue](/api-reference/popup#popup-type).

```js
// The content for the feature
layer.attachPopup((feature) => `<h3>${feature.getProperty('name')}</h3>`);

// Options, when more than the content changes
layer.attachPopup((feature) => ({
    className: feature.getProperty('type'),
    content: feature.getProperty('name'),
}));

// A different popup for the feature
layer.attachPopup((feature) => popups[feature.id]);
```

## Popup value type

Type `DataPopupValue`

Any method that attaches a popup accepts `DataPopupValue`. It can be one of the following.

- A string. Any `{property}` placeholders in it are replaced with the properties of the feature the popup is being shown for. A property the feature doesn't have becomes an empty string.
- An `HTMLElement` or `Text` node
- A [PopupOptions](/api-reference/popup#popup-options) object, whose `content` can hold placeholders
- A [Popup](/api-reference/popup) object
- A [DataPopupCallback](#popup-callback-type) function

:::note

The `{property}` placeholders are only replaced in content that you set up front. A value returned by a callback is used as it is, because the callback already has the feature and can build whatever it needs.

:::

## Events

Below are the available data layer events.

You can use the plain text name for the event, or you can use the [event constant](/api-reference/constants#datalayerevents).

The event object holds the [DataFeature](/api-reference/data-feature) that the event happened on in its `feature` value.

| Event    | Description |
|----------|-------------|
| addfeature | A feature was added to the layer. |
| click | A feature was clicked. |
| contextmenu | The DOM contextmenu event was fired on a feature. |
| dblclick | A feature was double clicked. |
| load | GeoJson data has finished loading. Dispatched by `loadGeoJson()` and `addGeoJson()`. |
| mousedown | The DOM mousedown event was fired on a feature. |
| mouseout | The mouse left a feature. |
| mouseover | The mouse moved over a feature. |
| mouseup | The DOM mouseup event was fired on a feature. |
| ready | The data layer is loaded and ready for use. |
| removefeature | A feature was removed from the layer. |
| removeproperty | A property was removed from a feature. |
| rightclick | A feature was right clicked. |
| setgeometry | The geometry of a feature was changed. |
| setproperty | A property was set on a feature. |

### click

```js
layer.on('click', (event) => {
    console.log(event.feature.getProperty('name'));
});

// You can use the event constant
layer.on(G.DataLayerEvents.CLICK, (event) => {
    // Do something
});

// Or, use the onClick method
layer.onClick((event) => {
    // Do something
});
```

## Data layer event object

Type `DataLayerEventObject`

The callback function for a data layer event has one parameter and that's the event object. It's the standard [event object](/api-reference/base-classes/evented#event-return-data) with the feature that the event happened on.

| Property | Type | Description |
|----------|------|-------------|
| domEvent | MouseEvent\|TouchEvent\|PointerEvent\|KeyboardEvent\|Event | The corresponding native DOM event. Only set for mouse events like `click` and `mouseover`. |
| feature | [DataFeature](/api-reference/data-feature) | The feature that the event happened on. Not set for the `load` and `ready` events. |
| latLng | [LatLng](/api-reference/utilities/latlng) | The latitude/longitude that was below the cursor. Only set for mouse events. |
| stop | Function | Call this function to stop the event from propagating further. Only set for mouse events. |
| type | string | The event type. |

The callback function type is `DataLayerEventCallback`.

`(event: DataLayerEventObject) => void`

## Properties

- Properties inherited from [Layer](/api-reference/base-classes/layer#properties).

| Property | Type | Description |
|----------|------|-------------|
| map | [Map](/api-reference/map)\|null | The map that the layer is attached to. Setting it is the same as calling [setMap()](#setmap). |
| style | [DataStyleValue](#data-style-value-type) | The style applied to the features in the layer. |
| visible | boolean | Whether the layer is visible on the map. |

## Methods

- Methods inherited from [Layer](/api-reference/base-classes/layer#methods).
- Methods inherited from [Evented](/api-reference/base-classes/evented#methods).
- Methods inherited from [Base](/api-reference/base-classes/base#methods).

Methods that change the layer return the `DataLayer` object so that they can be chained. They're applied as soon as the layer is ready, so you don't have to wait for them.

Methods that give you something back return a promise.

### addGeoJson

`addGeoJson(geoJson: object, options?: LoadOptions): Promise<DataFeature[]>`

Add a GeoJson object to the layer. Resolves with the features that were added.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| geoJson | object | Yes | The GeoJson object to add. |
| options | [LoadOptions](#load-options) | No | The options for adding the data. |

```js
const features = await layer.addGeoJson(geoJson);
```

### addPoint

`addPoint(position: LatLngValue, options?: FeatureOptions): Promise<DataFeature>`

Add a single point to the layer. The promise is rejected if the position isn't valid.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| position | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) | Yes | The position for the point. |
| options | [FeatureOptions](#feature-options) | No | The options for the feature. |

```js
layer.addPoint({ lat: 48.8, lng: 2.3 }, { properties: { name: 'Paris' } });
```

### addPolygon

`addPolygon(paths: LatLngValue[]|LatLngValue[][], options?: FeatureOptions): Promise<DataFeature>`

Add a polygon to the layer.

The `paths` value is either a single array of positions, for a polygon without any holes in it, or an array of arrays of positions. When it's an array of arrays the first one is the outer edge of the polygon and each one after that is a hole within it.

A path doesn't need to repeat its first position at the end to close it. If it does, as GeoJson data does, then the repeated position is dropped for you.

The promise is rejected if the first path has fewer than three valid positions.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| paths | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type)[]\|[LatLngValue](/api-reference/utilities/latlng#latlngvalue-type)[][] | Yes | The path for the polygon, or an array of paths. |
| options | [FeatureOptions](#feature-options) | No | The options for the feature. |

A polygon without any holes.

```js
layer.addPolygon([
    { lat: -32.364, lng: 153.207 },
    { lat: -35.364, lng: 153.207 },
    { lat: -35.364, lng: 158.207 },
    { lat: -32.364, lng: 158.207 },
]);
```

A polygon with two holes in it. See [Polygons with holes](/guides/data-layer/polygons) for more information.

```js
layer.addPolygon([outerPath, holePath1, holePath2]);
```

### addPolyline

`addPolyline(path: LatLngValue[], options?: FeatureOptions): Promise<DataFeature>`

Add a line to the layer. The promise is rejected if the path has fewer than two valid positions.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| path | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type)[] | Yes | The path for the line. |
| options | [FeatureOptions](#feature-options) | No | The options for the feature. |

```js
layer.addPolyline([
    { lat: 48.1, lng: 2 },
    { lat: 48.4, lng: 2.1 },
    { lat: 48.6, lng: 1.8 },
]);
```

### attachPopup

`attachPopup(popupValue: DataPopupValue, event?: 'click' | 'clickon' | 'hover'): Popup`

Attach a [popup](/api-reference/popup) to every feature in the layer, including features loaded after this is called.

The content is worked out for each feature, so one popup covers the whole layer. See [Popups on data layer features](/guides/data-layer/popups) for the full picture.

A popup attached to a single feature with [DataFeature.attachPopup()](/api-reference/data-feature#attachpopup) takes precedence over this one.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| popupValue | [DataPopupValue](#popup-value-type) | Yes | The content for the popup, the popup options, or a Popup object. |
| event | string |  | The event that shows the popup. One of `click`, `clickon` or `hover`. Defaults to `click`. |

```js
layer.attachPopup('<h3>{name}</h3><p>{address}</p>');
```

Build the content with a function.

```js
layer.attachPopup((feature) => `<h3>${feature.getProperty('name')}</h3>`);
```

Show it on hover instead of a click.

```js
layer.attachPopup('<h3>{name}</h3>', 'hover');
```

The popup opens at the point on the feature that was clicked, and the map is panned so that the popup is fully in view. A `hover` popup doesn't pan the map, because moving the map would take the feature out from under the cursor.

### attachTooltip

`attachTooltip(tooltipValue: DataTooltipValue, event?: 'click' | 'clickon' | 'hover'): Tooltip`

Attach a [tooltip](/api-reference/tooltip) to every feature in the layer, including features loaded after this is called. It shows on hover by default.

This works exactly like [attachPopup()](#attachpopup) — the content can hold `{property}` placeholders or be a function — so see [Popups on data layer features](/guides/data-layer/popups) for the detail, and [Tooltips on data layer features](/guides/data-layer/tooltips) for what differs.

A tooltip attached to a single feature with [DataFeature.attachTooltip()](/api-reference/data-feature#attachtooltip) takes precedence over this one.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| tooltipValue | [DataTooltipValue](#tooltip-value-type) | Yes | The content for the tooltip, the tooltip options, or a Tooltip object. |
| event | string |  | The event that shows the tooltip. One of `click`, `clickon` or `hover`. Defaults to `hover`. |

```js
layer.attachTooltip('{name}');
```

A layer can have both a tooltip and a popup attached at the same time.

```js
layer.attachTooltip('{name}');
layer.attachPopup('<h3>{name}</h3><p>{address}</p>');
```

### clear

`clear(): DataLayer`

Remove every feature from the layer. The Google maps API doesn't have a way to do this so each feature is removed in turn.

:::warning

Take care when calling this on the map's own data layer (`map.data`). Google gives each map one shared data layer, so this removes **every** feature on it, including any that another part of your application added.

If you need a layer that only holds your own data, and that you can clear without affecting anything else, create one with `G.dataLayer()`.

The same applies to the `replace` [load option](#load-options), which clears the layer before loading.

:::

```js
layer.clear();
```

### contains

`contains(feature: DataFeature): Promise<boolean>`

Returns whether the feature is in this layer.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| feature | [DataFeature](/api-reference/data-feature) | Yes | The feature to test for. |

```js
if (await layer.contains(feature)) {
    // Do something
}
```

### fitBounds

`fitBounds(): Promise<DataLayer>`

Fit the map to the bounds of the data in the layer.

Nothing happens if the layer has no features, or if it isn't attached to a map.

```js
await layer.loadGeoJson('/parcels.json');
layer.fitBounds();
```

You can also do this as part of loading the data.

```js
layer.loadGeoJson('/parcels.json', { fitBounds: true });
```

### forEach

`forEach(callback: (feature: DataFeature) => void): Promise<DataLayer>`

Call the callback function for each feature in the layer.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The function to call for each feature. It's passed the [DataFeature](/api-reference/data-feature) object. |

```js
layer.forEach((feature) => {
    console.log(feature.getProperty('name'));
});
```

### getBounds

`getBounds(): Promise<LatLngBounds>`

Get the bounds of all of the features in the layer.

```js
const bounds = await layer.getBounds();
```

### getFeature

`getFeature(id: string|number): Promise<DataFeature|undefined>`

Get a feature by its id. Resolves with `undefined` if no feature has that id.

The id comes from the GeoJson data, the `idProperty` option, or the `id` [feature option](#feature-options).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string\|number | Yes | The feature id. |

```js
const feature = await layer.getFeature('parcel-12');
```

### getFeatures

`getFeatures(): Promise<DataFeature[]>`

Get every feature in the layer as an array.

The Google maps API only provides `forEach()`, so this collects the features for you. Because it's an array you have all of the array methods available, so there's no separate filter method.

```js
const features = await layer.getFeatures();

const parks = features.filter((feature) => feature.getProperty('type') === 'park');
```

### hide

`hide(): DataLayer`

Hide the layer on the map. The features stay in the layer, so use [show()](#show) to display them again.

```js
layer.hide();
```

### loadGeoJson

`loadGeoJson(url: string|string[], options?: LoadOptions): Promise<DataFeature[]>`

Load GeoJson data into the layer from a url. Resolves with the features that were loaded.

More than one url can be passed. The promise then resolves once every file has loaded, with all of the features from all of the files.

The promise is rejected if no url is passed.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| url | string\|string[] | Yes | The url to load the GeoJson from, or an array of urls. |
| options | [LoadOptions](#load-options) | No | The options for loading the data. |

```js
const features = await layer.loadGeoJson('/parcels.json');
```

Load more than one file into the same layer.

```js
const features = await layer.loadGeoJson(['/parcels.json', '/zoning.json']);
```

Replace what's already in the layer, and fit the map to the new data.

```js
layer.loadGeoJson('/parcels.json', { replace: true, fitBounds: true });
```

### onAddFeature

`onAddFeature(callback: DataLayerEventCallback): void`

Add an event listener for when a feature is added to the layer.

```js
layer.onAddFeature((event) => {
    console.log(event.feature.id);
});
```

### onClick

`onClick(callback: DataLayerEventCallback): void`

Add an event listener for when a feature is clicked.

```js
layer.onClick((event) => {
    console.log(event.feature.getProperty('name'), event.latLng);
});
```

### onDblClick

`onDblClick(callback: DataLayerEventCallback): void`

Add an event listener for when a feature is double clicked.

### onLoad

`onLoad(callback: DataLayerEventCallback): void`

Add an event listener for when GeoJson data has finished loading. This is dispatched by [loadGeoJson](#loadgeojson) and [addGeoJson](#addgeojson).

```js
layer.onLoad(() => {
    // Do something
});
```

### onMouseOut

`onMouseOut(callback: DataLayerEventCallback): void`

Add an event listener for when the mouse leaves a feature.

### onMouseOver

`onMouseOver(callback: DataLayerEventCallback): void`

Add an event listener for when the mouse moves over a feature.

Together with [onMouseOut](#onmouseout) this is how you set up a hover style.

```js
layer.onMouseOver((event) => {
    event.feature.setStyle({ fillOpacity: 1, strokeWeight: 3 });
});
layer.onMouseOut((event) => {
    event.feature.resetStyle();
});
```

### onRemoveFeature

`onRemoveFeature(callback: DataLayerEventCallback): void`

Add an event listener for when a feature is removed from the layer.

### onRightClick

`onRightClick(callback: DataLayerEventCallback): void`

Add an event listener for when a feature is right clicked.

### overrideStyle

`overrideStyle(feature: DataFeatureValue, style: DataStyleOptions): DataLayer`

Set the style for one feature, overriding the layer style. Use [revertStyle](#revertstyle) to undo it.

[DataFeature.setStyle()](/api-reference/data-feature#setstyle) does the same thing from the feature itself.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| feature | [DataFeature](/api-reference/data-feature)\|string\|number | Yes | The feature, or the feature id, to set the style on. |
| style | [DataStyleOptions](#data-style-options) | Yes | The style to set on the feature. |

```js
layer.overrideStyle(feature, { fillColor: '#ff0000' });
```

### remove

`remove(feature: DataFeatureValue): DataLayer`

Remove a feature from the layer.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| feature | [DataFeature](/api-reference/data-feature)\|string\|number | Yes | The feature, or the feature id, to remove. |

```js
layer.remove(feature);

// Or by id
layer.remove('parcel-12');
```

### revertStyle

`revertStyle(feature?: DataFeatureValue): DataLayer`

Remove the style override for a feature so that it uses the layer style again.

If no feature is passed then the override is removed from every feature.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| feature | [DataFeature](/api-reference/data-feature)\|string\|number | No | The feature, or the feature id, to revert the style for. If this is not set then every feature is reverted. |

```js
layer.revertStyle(feature);

// Revert everything
layer.revertStyle();
```

### setMap

`setMap(map: Map|null): Promise<DataLayer>`

Add the data layer to the map.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| map | [Map](/api-reference/map) | Yes | The map object. Set to `null` to remove the layer from the map. |

```js
layer.setMap(map);

// Remove it from the map
layer.setMap(null);
```

### setOptions

`setOptions(options: DataLayerOptions): DataLayer`

Set the options for the data layer.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [DataLayerOptions](#data-layer-options) | Yes | The data layer options. |

```js
layer.setOptions({
    map: map,
    geoJson: '/parcels.json',
    style: { fillColor: '#4caf50' },
});
```

### setStyle

`setStyle(style: DataStyleValue): DataLayer`

Set the style to apply to the features in the layer.

The style is either a single style object that is applied to every feature, or a function that is called for each feature and returns the style for it.

:::note

This replaces the existing style rather than merging with it, which matches the Google maps API. Set every value that you need each time.

:::

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| style | [DataStyleValue](#data-style-value-type) | Yes | The style to apply to the features in the layer. |

```js
layer.setStyle({ fillColor: '#4caf50', fillOpacity: 0.5, strokeWeight: 1 });
```

Style each feature based on one of its properties.

```js
const colors = { park: '#4caf50', water: '#2196f3' };

layer.setStyle((feature) => ({
    fillColor: colors[feature.getProperty('type')] || '#999999',
    fillOpacity: 0.5,
}));
```

### show

`show(map?: Map): Promise<DataLayer>`

Show the layer on the map. This will also set the map object if it's passed.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| map | [Map](/api-reference/map) | No | The map object to add the layer to. |

```js
layer.show();

// Set the map and show the layer
layer.show(map);
```

### toGeoJson

`toGeoJson(): Promise<object>`

Export every feature in the layer as a GeoJson object.

```js
const geoJson = await layer.toGeoJson();
```

### toGoogle

`toGoogle(): Promise<google.maps.Data>`

Returns the [Google maps Data object](https://developers.google.com/maps/documentation/javascript/reference/data).

The Data object may not exist yet, so this returns a promise. It also waits for any calls that you've already made on the layer, so the object it resolves with has had all of them applied to it.

```js
const data = await layer.toGoogle();
```
