---
---

# Display the map

First, include the map library Javascript on your page. We recommend that you copy the `node_modules/@aptuitiv/gmaps/dist/index.js` file to your website files and upload it to your website.

```html
<script src="/gmaps/index.js">
```

Put a `div` element with a certain id where you want your map to be.

```html
<div id="map"></div>
```

Make sure that the div has a defined size, otherwise the map won't be visible. You can do this by adding a height or using `aspect-ratio`.

```css
#map {
  height: 400px;
}

// OR

#map {
  aspect-ratio: 7/3;
}
```

Now you're ready to initialize your map.

Either in some inline Javscript, or in another file you can then set up your map.

```javascript
// Set up the map object
const map = G.map('map', {
    apiKey: 'myMapApiKey',
    latitude: 40.730610,
    longitude: -73.935242,
    zoom: 8
});
// Load the map
map.load(() => {
    // Do something after the map loads.
    // For example, set up your map markers.
    const marker = G.marker({
        latitude: 40.730610,
        longitude: -73.935242,
        title: 'My Marker'
    });
    marker.addTo(map);
});
```

Alternately you can use the [G.Loader](/api-reference/loader) object to load the Google Maps API library.

:::info
This also shows that you don't have to use the promises that `Loader.load()`, `Map.load()`, or `Map.show(()` returns.
We recommend that you use the promises to avoid any potential errors, but we've set up the library to defer events and adding elements to the map until the Google Maps library is loaded and the map has been initialized.
:::

```js
G.loader().setApiKey('My-Api-Key').load();

const map = G.map('map', {
    latitude: 40.730610,
    longitude: -73.935242,
    zoom: 8
});
map.show(();
const marker = G.marker({
    latitude: 40.730610,
    longitude: -73.935242,
    map: map,
    title: 'My Marker'
});
```
