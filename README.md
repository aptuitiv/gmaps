# @aptuitiv/gmaps library

Library to help with displaying a Google map with markers, overlays, and custom buttons.

Inspired by [Leaflet](https://leafletjs.com/).

## Install

Download from NPM.

```bash
npm install @aptuitiv/gmaps
```

You will find a copy of the files in `node_modules/@aptuitiv/gmaps/dist`.

The minified Javascript file is at `node_modules/@aptuitiv/gmaps/dist/index.js`;

## Documentation

[View the documentation](https://aptuitiv.github.io/gmaps-docs/).

## Quick start

Add the script tag to load the library.

```html
<script src="/google-map-display/index.js">
```

Or you can bundle it with your other Javascript code using Gulp, Webpack or some other build process. Add the script tag to load your code.

```html
<script src="/my-bundled-code.js">
```

Add a div to hold the map. You can use any id value, we're using a value of "map".

```html
<!-- The map will be displayed here -->
<div id="map" style="aspect-ratio: 3/2"></div>
```

Display the map

```html
<script>
G.loader({ apiKey: 'Your-Api-Key', }).load().then(() => {
    const map = G.map('map', { center: { latitude: 48.864716, longitude: 2.3522 } });
    map.show();
});
</script>
```

[See the documentation for more information](https://aptuitiv.github.io/gmaps-docs).
