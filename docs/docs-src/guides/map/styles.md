---
---

# Style the map

You can change how the map itself looks, like the color of roads and water, or whether points of interest are shown, by setting the `styles` option on the map.

Each style rule is a [MapStyle](/api-reference/map-configuration/map-style) object. A rule selects part of the map with a `featureType` (like roads or parks) and an `elementType` (like the geometry or the labels), and then applies one or more styles to it.

See the [Google Maps style reference](https://developers.google.com/maps/documentation/javascript/style-reference) for the full list of feature types, element types, and style values.

:::warning
Google ignores the `styles` option when the map has a `mapId`. Maps with a map id are styled with [cloud-based maps styling](https://developers.google.com/maps/documentation/javascript/cloud-customization) in the Google Cloud console instead.
:::

## Hide businesses, points of interest, or transit

Hiding businesses, points of interest, or transit is common enough that there are shortcut options for it. You don't need to write any style rules.

| Option | What it hides |
|--------|---------------|
| [hideBusinesses](/api-reference/map#hidebusinesses) | Businesses, like stores, restaurants, and hotels (the `poi.business` feature type). Other points of interest, like parks, are still shown. |
| [hidePointsOfInterest](/api-reference/map#hidepointsofinterest) | All points of interest, including businesses, parks, schools, attractions, and places of worship (the `poi` feature type). |
| [hideTransit](/api-reference/map#hidetransit) | Transit lines and stations, like bus stops, train stations, and rail lines (the `transit` feature type). |

Set them when you create the map.

```js
const map = G.map('map', {
    center: [40.7128, -74.0060],
    hideBusinesses: true,
    hideTransit: true,
});
```

Or change them at any time with the properties or the chainable `setHide` methods. If the map is already displayed then it's updated right away.

```js
// With the properties
map.hideBusinesses = true;
map.hideTransit = false;

// With the methods. The value defaults to true.
map.setHideBusinesses().setHideTransit(false);
```

The shortcut options work together with the `styles` option. Their styles are added after your own styles, so they take precedence for the feature types that they hide.

```js
const map = G.map('map', {
    center: [40.7128, -74.0060],
    // Make the whole map grayscale and also hide businesses
    styles: G.mapStyle({ styles: [{ saturation: -100 }] }),
    hideBusinesses: true,
});
```

:::note
Because businesses are a type of point of interest, they stay hidden while `hidePointsOfInterest` is `true`, even if `hideBusinesses` is `false`.
:::

## Set a single style rule

Use `G.mapStyle()` to create the style rule and pass it as the `styles` option when you create the map.

```js
// Make the arterial roads purple
const roadStyle = G.mapStyle({
    featureType: 'road.arterial',
    elementType: 'geometry',
    styles: [
        { color: '#9E006F' }
    ]
});

const map = G.map('map', {
    center: [40.7128, -74.0060],
    styles: roadStyle,
});
```

If you don't set `featureType` or `elementType` then the styles are applied to everything on the map.

```js
// Make the whole map grayscale
const map = G.map('map', {
    center: [40.7128, -74.0060],
    styles: G.mapStyle({ styles: [{ saturation: -100 }] }),
});
```

## Set multiple style rules

Pass an array to set more than one style rule. Each value in the array can be a `MapStyle` object or a plain object of [MapStyle options](/api-reference/map-configuration/map-style#mapstyle-options).

```js
const map = G.map('map', {
    center: [40.7128, -74.0060],
    styles: [
        // Hide all points of interest
        {
            featureType: 'poi',
            styles: [{ visibility: 'off' }]
        },
        // Make the water dark blue
        {
            featureType: 'water',
            elementType: 'geometry',
            styles: [{ color: '#1A3A5C' }]
        },
        // A MapStyle object works too
        G.mapStyle({
            featureType: 'road',
            elementType: 'labels',
            styles: [{ visibility: 'off' }]
        }),
    ],
});
```

:::tip
A single style rule must be a `MapStyle` object. If you pass a single plain object, wrap it in an array or pass it to `G.mapStyle()` first.
:::

## Use styles from Google's Styling Wizard

Google's style JSON, for example from the [Map Style Wizard](https://mapstyle.withgoogle.com/) or [Snazzy Maps](https://snazzymaps.com/), uses `stylers` instead of `styles`. The `stylers` name is accepted as an alias, so you can paste that JSON in as is.

```js
const map = G.map('map', {
    center: [40.7128, -74.0060],
    styles: [
        {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{ "color": "#444444" }]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{ "color": "#f2f2f2" }]
        }
    ],
});
```

## Build a style rule with methods

The `MapStyle` methods can be chained, which is useful when you build the rule up in steps.

```js
const labelStyle = G.mapStyle()
    .setFeatureType('administrative.locality')
    .setElementType('labels.text.fill')
    .addStyle('color', '#D4541E')
    .addStyle('weight', 2);

const map = G.map('map', {
    center: [40.7128, -74.0060],
    styles: [labelStyle],
});
```

## Change the styles after the map is displayed

Use [setOptions](/api-reference/map#setoptions) to replace the map styles. This can be done before or after the map has been displayed.

```js
map.setOptions({
    styles: [
        {
            featureType: 'all',
            styles: [{ saturation: -100 }]
        }
    ]
});
```

The new styles replace all of the existing styles set with the `styles` option. The [shortcut options](#hide-businesses-points-of-interest-or-transit), like `hideBusinesses`, are kept.
