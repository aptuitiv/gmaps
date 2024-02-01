# Google Map Display library

Library to help with displaying a Google map with markers, overlays, and custom buttons.

Inspired by [Leaflet](https://leafletjs.com/).

- [Google Map Display library](#google-map-display-library)
  - [Install](#install)
  - [Documentation](#documentation)
    - [Map](#map)
      - [Example Usage](#example-usage)
  - [Testing while developing local](#testing-while-developing-local)
    - [Unlink the project](#unlink-the-project)
    - [Resources](#resources)

## Install

Download from NPM.

```bash
npm install @aptuitiv/google-maps-display
```

You will find a copy of the files in `node_modules/@aptuitiv/google-maps-display/dist`.

The minified Javascript file is at `node_modules/@aptuitiv/google-maps-display/dist/index.js`;

## Documentation

The different objects in the library are available under the global `G` variable.

You use one of the following functions to set up the object that you need.

- Icon:  `G.icon()`
- InfoWindow: `G.infoWindow()`
- Latitude/Longitude: `G.latLng()`
- Latitude/Longitude Bounds: `G.latLngBounds()`
- [Map](#map): `G.map()`
- Marker: `G.marker()`
- Marker Cluster: `G.markerCluster()`
- Point: `G.point()`
- Popup: `G.popup()`
- Size: `G.size()`
- Svg Symbol: `G.svgSymbol()`
- Tooltip: `G.tooltip()`

### Map

This is the primary object that you'll create. It's used to create and display the Google map on the page. It also loads the Google Map API library.

**You must load the map before setting up other objects for the map (i.e load the map before setting up a map marker).** Some of the other objects depend on the Google maps library being available.

#### Example Usage

```javascript
// Set up the map object
const map = G.map('map', {
    apiKey: 'myMapApiKey',
    latitude: 40.730610
    longitude: -73.935242,
    zoom: 8
});
// Load the map
map.load(() => {
    // Do something after the map loads.
    // For example, set up your map markers.
});
```

You must call the `load()` function on the map object before doing anything else. That function is what actually loads the Google Maps library and sets up the map.

## Testing while developing local

In the `google-maps-display` library path use `npm link` to add the project to the local npm registry.

```bash
cd ./route-to-library
npm link
```

In the project's folder that you want to use this library, use `npm link @aptuitiv/google-maps-display` to install the package locally.

If you need to update the rets-client library do the following.

### Unlink the project

You should unlink the local project for any of these situations:

- You are switching branches.
- You are adding or removing node modules in this project. (This doesn't apply if you're adding or removing node modules in the project that uses this library.)
- You want to use the live version of this package from NPM.

First, in the project that uses this library:

```bash
npm unlink @aptuitiv/google-maps-display --no-save
```

The `--no-save` flag keeps the original live version of this package from NPM.

Then, in this package:

```bash
npm unlink
```

### Resources

- [NPM Linking and Unlinking](https://dev.to/erinbush/npm-linking-and-unlinking-2h1g).
- [Understanding npm-link](https://medium.com/dailyjs/how-to-use-npm-link-7375b6219557).
- [How to Test a Node (npm) Package Locally](https://javascript.plainenglish.io/how-to-test-a-node-package-locally-8dde33e642df).
- Other option wth tarballs [Use npm pack to test your packages locally](https://dev.to/scooperdev/use-npm-pack-to-test-your-packages-locally-486e).
