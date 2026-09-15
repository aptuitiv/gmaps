---
---

# Display multiple maps on one page

There isn't anything special that you need to do to display multiple Google Maps on one page.

There are a few best practices though:

1. Only use one Google Maps API key for all maps on the page. (We can't imagine a scenario where you would use multiple API keys, but, we want to be super clear.)
2. Load the Google Maps API library with [G.Loader](/api-reference/loader) and then display the maps with [G.Maps.show(()](/api-reference/map).

## Example code

First, set the `div` tags where the maps will display. Note that they have a different value for the `id` attribute.

```html
<h2>Map 1</h2>
<div id="map1" style="aspect-ratio: 3/2"></div>

<h2>Map 2</h2>
<div id="map2" style="aspect-ratio: 3/2"></div>
```

Now, load the map library and then display the map.

```js
G.loader({ apiKey: 'Your-Api-Key', }).load();

const map1 = G.map('map1', {center: [40.7128, -74.0060]});
map1.show(();

const map2 = G.map('map2', {center: [35.6764, 139.6500]});
map2.show(();
```
