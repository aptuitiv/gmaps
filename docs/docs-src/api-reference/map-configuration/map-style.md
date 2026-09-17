---
---

# MapStyle

The MapStyle object is used to set styles for the different map features, like roads, water, and points of interest. See the [Style the map guide](/guides/map/styles) for more examples.

:::tip
To hide businesses, all points of interest, or transit you can use the [hideBusinesses](/api-reference/map#hidebusinesses), [hidePointsOfInterest](/api-reference/map#hidepointsofinterest), and [hideTransit](/api-reference/map#hidetransit) map options instead of creating a MapStyle.
:::

:::info
This is based on the [Google Maps MapTypeStyle](https://developers.google.com/maps/documentation/javascript/reference/map#MapTypeStyle) interface, but is a little different.
For example, we use `styles` instead of `stylers`. The `stylers` name is also accepted as an alias so that Google's style JSON can be used as is.
:::

## Example usage

```js
// Set the roads to be a different color
const styles = G.mapStyle({
    featureType: "road.arterial",
    elementType: "geometry",
    styles: [
        { color: "#9E006F" }
    ]
});

const map = G.map('map', {
    center: [40.7128, -74.0060],
    styles: styles
});
```

## Creating the MapStyle object

`G.mapStyle(options?: MapStyleValue): MapStyle`

There are a few ways to setup the `MapStyle` object.

**Pass no value.**

`G.mapStyle(): MapStyle`

In this case you will need to set the `styles` value after you create the object or use [addStyle](#addstyle) to add a style.

```js
const style = G.mapStyle();
style.styles = [{color: '#4447E8'}];
```

**Pass an object of options.**

`G.mapStyle(options: MapStyleOptions): MapStyle`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [MapStyleOptions](#mapstyle-options) | Yes | The configuration options. |

```js
const mapStyle = G.mapStyle({
    featureType: "road.arterial",
    elementType: "geometry",
    styles: [
        { color: "#9E006F" }
    ]
});
```

**Pass a single style.**

`G.mapStyle(value: Style): MapStyle`

The style is applied to all features and elements.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | [Style](#mapstyle-style-value-type) | Yes | A single style object. |

```js
const style = G.mapStyle({ saturation: -100 });
```

**Pass an array of styles.**

`G.mapStyle(value: Style[]): MapStyle`

The styles are applied to all features and elements.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | [Style](#mapstyle-style-value-type)[] | Yes | An array of style objects. |

```js
const style = G.mapStyle([
    { saturation: -100 },
    { lightness: 20 }
]);
```

**Pass an existing MapStyle object.**

`G.mapStyle(value: MapStyle): MapStyle`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | MapStyle | Yes | The existing MapStyle object. |

```js
const style = G.mapStyle(existingMapStyleObject);
```

## MapStyle Style value type

The individual styles follow this format:

```js
{ [key: string]: string | number }
```

For example:

```js
{color: '#ff0000'}

{ "saturation": -100 }

{ "visibility": "off" }
```

## MapStyle value type

The `MapStyleValue` can be one of the following values:

- A [Style](#mapstyle-style-value-type) value.
- A array of [Style](#mapstyle-style-value-type) values.
- A [MapStyleOptions](#mapstyle-options) value.
- A MapStyle object.

## MapStyle options

Type `MapStyleOptions`.

MapStyleOptions is an object containing the configuration options for the MapStyle object.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| elementType | string | 'all' | The element type to which the styles should be applied to. If not set then the styles are applied to all elements. [More information](https://developers.google.com/maps/documentation/javascript/style-reference#style-elements) |
| featureType | string | 'all' | The feature type to which the styles should be applied to. If not set then the styles are applied to all features. [More information](https://developers.google.com/maps/documentation/javascript/style-reference#style-features) |
| styles | [Style](#mapstyle-style-value-type)[] |  | An array of [Style](#mapstyle-style-value-type) values. |
| stylers | [Style](#mapstyle-style-value-type)[] |  | An alias of `styles` that matches the Google Maps `MapTypeStyle` property name. It's only used if `styles` isn't set. |

```js
// Google's style JSON can be used as is
const style = G.mapStyle({
    featureType: "water",
    elementType: "geometry",
    stylers: [
        { color: "#1A3A5C" }
    ]
});
```

## Using MapStyle with the map

Set map styles with the `styles` [map option](/api-reference/map#map-options). The option accepts a single `MapStyle` object, or an array where each value is a `MapStyle` object, a [MapStyleOptions](#mapstyle-options) object, or a [Style](#mapstyle-style-value-type) object.

```js
const map = G.map('map', {
    center: [40.7128, -74.0060],
    styles: [
        G.mapStyle({ featureType: 'poi', styles: [{ visibility: 'off' }] }),
        { featureType: 'water', elementType: 'geometry', styles: [{ color: '#1A3A5C' }] },
    ]
});
```

:::warning
A single plain object that isn't in an array is ignored. Wrap it in an array or pass it to `G.mapStyle()` first.
:::

## Properties

| Property  | Type   | Description                             |
|-----------|--------|-----------------------------------------|
| elementType | string | The element type to which the styles should be applied to. If not set then the styles are applied to all elements. [More information](https://developers.google.com/maps/documentation/javascript/style-reference#style-elements) |
| featureType | string | The feature type to which the styles should be applied to. If not set then the styles are applied to all features. [More information](https://developers.google.com/maps/documentation/javascript/style-reference#style-features) |
| styles | [Style](#mapstyle-style-value-type)[] | An array of [Style](#mapstyle-style-value-type) values. |

### elementType

Get and set the element type to apply the styles to.

```js
// Get the element type
const elementType = style.elementType;
```

Set the `elementType` value.

```js
// Set the element type
style.elementType = 'labels';
```

### featureType

Get and set the feature type to apply the styles to.

```js
// Get the feature type
const featureType = style.featureType;
```

Set the `featureType` value.

```js
// Set the feature type
style.featureType = 'administrative.neighborhood';
```

### styles

Get and set the styles.

When getting the styles an array is always returned.

```js
// Get the styles
const styles = style.styles;
```

Set the `styles` value.

```js
style.styles = [
    { color: "#9E006F" },
    { saturation: -100 }
];
```

You can also set a single style. It will be converted to an array.

```js
style.styles = { color: "#9E006F" };
```

## Methods

### addStyle

`addStyle(property: string, value: string | number): MapStyle`

Add a single style to the list of styles. The style is only added if `property` is a non-empty string and `value` is a string or number.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| property | string | Yes | The style property. For example, `color` or `saturation`. |
| value | string \| number | Yes | The style value. |

```js
style.addStyle('color', '#ff0000');
```

### setElementType

`setElementType(value: string): MapStyle`

Set the element type that the styles should apply to.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | string | Yes | The element type. [More information](https://developers.google.com/maps/documentation/javascript/style-reference#style-elements) |

```js
style.setElementType('labels');
```

### setFeatureType

`setFeatureType(value: string): MapStyle`

Set the feature type that the styles should apply to.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | string | Yes | The feature type. [More information](https://developers.google.com/maps/documentation/javascript/style-reference#style-features) |

```js
style.setFeatureType('road.local');
```

### setStyles

`setStyles(value: Style | Style[]): MapStyle`

Set one or more styles. This will replace any existing styles in the object.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | [Style](#mapstyle-style-value-type) or [Style](#mapstyle-style-value-type)[] | Yes | A single style object or an array of style objects. |

```js
// Set a single style
style.setStyles({color: 'red'});

// Set multiple styles.
style.setStyles([
    { color: "#9E006F" },
    { saturation: -100 }
]);
```

### toGoogle

`toGoogle(): google.maps.MapTypeStyle`

Get the object to use to pass the MapStyle options to the Google Map instance. The styles are returned in the `stylers` property.

```js
const googleStyles = style.toGoogle();
```
