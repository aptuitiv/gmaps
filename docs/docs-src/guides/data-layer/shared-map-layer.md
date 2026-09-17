---
---

# The map's data layer is shared

Every map has one data layer of its own, which you get with [`map.data`](/api-reference/map#data). Google gives each map exactly one, so everything that uses `map.data` is putting its features into the same place.

That's fine most of the time. It matters when you want to remove things.

## The problem

These all affect **every** feature on the layer, not just the ones you added:

- [`clear()`](/api-reference/data-layer#clear) removes every feature.
- The `replace` [load option](/api-reference/data-layer#load-options) clears the layer before loading.
- [`setStyle()`](/api-reference/data-layer#setstyle) replaces the style for every feature.

So if one part of your application does this:

```js
map.loadGeoJson('/parcels.json');
```

and another part later does this:

```js
map.data.clear();
map.loadGeoJson('/zoning.json');
```

then the parcels are gone as well, even though nothing referred to them.

## Use your own layer

Create a separate layer with `G.dataLayer()` when you want data that you own outright. It works the same way, and clearing it or restyling it only affects your own features.

```js
const parcels = G.dataLayer({ map: map });
parcels.loadGeoJson('/parcels.json');

const zoning = G.dataLayer({ map: map });
zoning.loadGeoJson('/zoning.json');

// Only the zoning features are removed
zoning.clear();
```

This also means each layer can have its own style, which isn't possible when everything shares `map.data`.

```js
parcels.setStyle({ fillColor: '#4caf50' });
zoning.setStyle({ fillColor: '#2196f3' });
```

## Redrawing a layer from new data

When you do want to replace what's in a layer, `replace` does the clearing for you in one call.

```js
zoning.loadGeoJson('/zoning-2026.json', { replace: true });
```

## When to use `map.data`

`map.data` is the right choice when your map only has the one set of data on it. It's less to set up, and `map.loadGeoJson()` and `map.addGeoJson()` are shortcuts to it.

```js
map.data.setStyle({ fillColor: '#4caf50' });
map.loadGeoJson('/parcels.json');
```

The layer is created the first time you use `map.data` and you get the same object back every time after that, so it's safe to reach for it wherever you need it.

```js
map.data === map.data; // true
```
