---
---

# Load the Google Maps Javascript API

Before a Google map can be displayed on your website you must first load the Google Maps Javascript API.

There are five options on how to load the Google Maps Javascript API. Two use this library, and the other three are [options that Google provides](ttps://developers.google.com/maps/documentation/javascript/load-maps-js-api).

1. [Use the `G.loader` object to load the API code](#use-gloader).
2. [Use `G.map` object and the `load()` function to load the API code and display the map after the code is loaded](#use-gmap).
3. [Use Google's Dynamic Library Import method](#use-googles-dynamic-library-import-method)
4. Use the [NPM js-api-loader package](#use-the-npm-js-api-loader-package).
5. Use the [direct script loading tag](#use-the-direct-script-loading-tag).

Regardless of the method you use, you will need to include the map library Javascript on your page.
[See the installation pages](/installation) for how to do that with a bundler, a standalone browser
script, or CommonJS.

The examples below use the standalone browser script, where everything is on the global `G` object.
With a bundler, import what you need instead — `import { loader, map } from '@aptuitiv/gmaps'` — and
the code is otherwise the same.

For each example below we're displaying the map in a `div` with an id value of "map".

```html
<!-- The map will be displayed here -->
<div id="map" style="aspect-ratio: 3/2"></div>
```

## Use `G.loader`

[See the Loader page for more information](/api-reference/loader).

```javascript
G.loader({ apiKey: 'Your-Api-Key'}).load().then(() => {
    const map = G.map('map', { center: { latitude: 48.864716, longitude: 2.3522 } });
    map.show(();
});
```

:::info
You can set up the map object and even call `show()` before the `G.loader.load()` method.
The `G.loader` and `G.map` objects handle waiting for the map library to be loaded before displaying the map and elements on the map. They allow the `show()` function on the map object to be called, elements like markers to be assigned to the map, and events to be watched before the Google Maps API is loaded. This is done with some internal event watchers.
:::

It's not recommended to set your map objects up in this order, but this shows the flexibility of the library.

```js
const map = G.map('map', { center: { latitude: 48.864716, longitude: 2.3522 } });
map.show(();
const marker = G.marker({
    latitude: 48.9,
    longitude: 2.4,
    map: map,
    title: 'My Marker',
});
G.loader({ apiKey: apiKey }).load();
```

## Use `G.map`

You can pass the API key and the other "load" information to the map object and avoid using the `G.loader` object all together. You would then use the [load](/api-reference/map#load) object on the map to load the Google Maps library and then display the map.

[See the Map page for more information](/api-reference/map).

```javascript
G.map('#map', { apiKey: 'Your-Api-Key', lat: 48.864716, lng: 2.3522 }).load().then(() => {
   // Do something after loading and displaying the map
});
```

You could also set the API key in the `G.loader` object and then call `load()` on the map object.

```js
G.loader({ apiKey: 'Your-Api-Key', , libraries: ['places']});
G.map('#mapSelector', { center: [40.7128, -74.0060] }).load();
```

## Use Google's Dynamic Library Import method

[View the full details on Google's documentation page](https://developers.google.com/maps/documentation/javascript/load-maps-js-api#dynamic-library-import).

:::warning
The `G.loader` and `G.map` objects handle waiting for the map library to be loaded before displaying the map and elements on the map. They allow the `show()` function on the map object to be called,  elements like markers to be assigned to the map, and events to be watched before the Google Maps API is loaded. This is done with some internal event watchers. You don't have that option with this method. You **must** completely load the Google Maps API and the maps library before doing anything with the `G` library.
:::

```javascript
(g => { var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window; b = b[c] || (b[c] = {}); var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams, u = () => h || (h = new Promise(async (f, n) => { await (a = m.createElement("script")); e.set("libraries", [...r] + ""); for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]); e.set("callback", c + ".maps." + q); a.src = `https://maps.${c}apis.com/maps/api/js?` + e; d[q] = f; a.onerror = () => h = n(Error(p + " could not load.")); a.nonce = m.querySelector("script[nonce]")?.nonce || ""; m.head.append(a) })); d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n)) })({
    key: "YOUR-API-KEY",
    v: "weekly",
});

async function initMap() {
    // Load the Google maps library.
    await google.maps.importLibrary("maps")
    // Display the map
    const map = G.map('map', { center: [48.864716, 2.3522] });
    map.show(();
    // Do stuff with the map
}
initMap();
```

## Use the NPM js-api-loader package

[View the full details on Google's documentation page](https://developers.google.com/maps/documentation/javascript/load-maps-js-api#js-api-loader).

:::warning
The `G.loader` and `G.map` objects handle waiting for the map library to be loaded before displaying the map and elements on the map. They allow the `show()` function on the map object to be called,  elements like markers to be assigned to the map, and events to be watched before the Google Maps API is loaded. This is done with some internal event watchers. You don't have that option with this method. You **must** completely load the Google Maps API and the maps library before doing anything with the `G` library.
:::

```js
const loader = new Loader({
  apiKey: "YOUR_API_KEY",
  version: "weekly",
  ...additionalOptions,
});

loader.importLibrary('maps').then(() => {
    // Display the map
    const map = G.map('map', { center: [48.864716, 2.3522] });
    map.show(();
    // Do stuff with the map
});
```

## Use the direct script loading tag

[View the full details on Google's documentation page](https://developers.google.com/maps/documentation/javascript/load-maps-js-api#use-legacy-tag).

:::warning
The `G.loader` and `G.map` objects handle waiting for the map library to be loaded before displaying the map and elements on the map. They allow the `show()` function on the map object to be called,  elements like markers to be assigned to the map, and events to be watched before the Google Maps API is loaded. This is done with some internal event watchers. You don't have that option with this method. You **must** completely load the Google Maps API and the maps library before doing anything with the `G` library.
:::

Load the Google Maps Javascript API:

```html
<!-- The map will be displayed here -->
<div id="map" style="aspect-ratio: 3/2"></div>

<script>
// Callback function for when the Google Maps library loads
function initMap() {
    const map = G.map('map', {center: {lat: 48.864716, lng: 2.3522}});
    map.show(();
}
</script>
<script async src="https://maps.googleapis.com/maps/api/js?key=YOUR-API-KEY&loading=async&callback=initMap">
```
