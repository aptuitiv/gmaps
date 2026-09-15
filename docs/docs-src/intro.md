---
slug: /
---

# Introduction

The `@aptuitiv/gmaps` library helps you add a Google map to your website and show markers, popups, tooltips, InfoWindows, polylines and other map components.

Inspired by [Leaflet](https://leafletjs.com/).

## Goals

Some of the goals of this library include:

- Streamline the process of loading the Google Maps Javascript API to display maps.
- Absract away some of the boilerplate code to display the map and elements on the map.
- Make it easier to configure the elements on the map.
- Provide built-in functionality for advanced functionality like marker clustering and bulk management of markers and polylines.
- Make it easier to display a custom styled popup when clicking on markers or other elements.
- Make it easier to show a custom styled tooltip when overing a mouse on markers or other elements.

## Install

Download from NPM.

```bash
npm install @aptuitiv/gmaps
```

You will find a copy of the files in `node_modules/@aptuitiv/gmaps/dist`.

The files that you'd use are:

- `node_modules/@aptuitiv/gmaps/dist/index.esm.js` - This is the ESM version of the library and it is used when you use `include` in your node Javascript code to include this package.
- `node_modules/@aptuitiv/gmaps/dist/index.cjs.js` - This is the CommonJS version of the library and it is used when you use `require` in your node Javascript code to include this package.
- `node_modules/@aptuitiv/gmaps/dist/browser.js` - This is the minified version that you should use if you are including this library for use in the browser as a stand-alone script file.

## Available objects

The different objects in the library are available under the global `G` variable.

You use one of the following functions to set up the object that you need.

- [AutocompleteSearchBox](/api-reference/autocomplete-search-box): `G.autocompleteSearchBox()`
- [FullscreenControl](/api-reference/map-controls/fullscreen-control): `G.fullscreenControl()`
- [Geocode](/api-reference/geocoding/geocode): `G.geocode()`
- [Icon](/api-reference/utilities/icon): `G.icon()`
- [ImageOverlay](/api-reference/image-overlay): `G.imageOverlay()`
- [InfoWindow](/api-reference/infowindow): `G.infoWindow()`
- [Latitude/Longitude](/api-reference/utilities/latlng): `G.latLng()`
- [Latitude/Longitude Bounds](/api-reference/utilities/latlng-bounds): `G.latLngBounds()`
- [Loader](/api-reference/loader): `G.loader()`
- [Map](/api-reference/map): `G.map()`
- [MapRestriction](/api-reference/map-configuration/map-restriction): `G.mapRestriction()`
- [MapStyle](/api-reference/map-configuration/map-style): `G.mapStyle()`
- [MapTypeControl](/api-reference/map-controls/map-type-control): `G.mapTypeControl()`
- [Marker](/api-reference/marker): `G.marker()`
- [MarkerCluster](/api-reference/marker-cluster): `G.markerCluster()`
- [MarkerCollection](/api-reference/marker-collection): `G.markerCollection()`
- [Overlay](/api-reference/overlay): `G.overlay()`
- [PlacesSearchBox](/api-reference/places-search-box): `G.placesSearchBox()`
- [Point](/api-reference/utilities/point): `G.point()`
- [Polyline](/api-reference/polyline): `G.polyline()`
- [PolylineCollection](/api-reference/polyline-collection): `G.polylineCollection()`
- [PolylineIcon](/api-reference/polyline-icon): `G.polylineIcon()`
- [Popup](/api-reference/popup): `G.popup()`
- [RotateControl](/api-reference/map-controls/rotate-control): `G.rotateControl()`
- [ScaleControl](/api-reference/map-controls/scale-control): `G.scaleControl()`
- [Size](/api-reference/utilities/size): `G.size()`
- [StreetViewControl](/api-reference/map-controls/street-view-control): `G.streetViewControl()`
- [Svg Symbol](/api-reference/utilities/svgsymbol): `G.svgSymbol()`
- [Tooltip](/api-reference/tooltip): `G.tooltip()`
- [ZoomControl](/api-reference/map-controls/zoom-control): `G.zoomControl()`

## Chainable methods

If an object's method returns an instance of that method, then the method is chainable.

For example:

```js
const icon = G.icon()
    .setUrl('https://mywebsite.com/images/marker.png')
    .setSize([10, 32])
    .setScaledSize([5, 16]);
```
