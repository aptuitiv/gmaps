---
---

# Standalone browser script

Use this if your site has no build step and loads Javascript with `<script>` tags.

## Get the file

The file to use is `node_modules/@aptuitiv/gmaps/dist/browser.js`. Install the package and copy that
one file into your site's Javascript folder.

```bash
npm install @aptuitiv/gmaps
```

It's a single self-contained file. Nothing else from `dist` is needed.

## Load it

```html
<script src="/js/gmaps.js"></script>
```

Everything in the library is available on the global `G` object.

```html
<div id="map" style="aspect-ratio: 3/2"></div>

<script src="/js/gmaps.js"></script>
<script>
    const myMap = G.map('#map', {
        apiKey: 'YOUR-API-KEY',
        latitude: 40.73061,
        longitude: -73.935242,
        zoom: 12,
    });
    myMap.show();
</script>
```

The [Introduction](/) lists the objects available on `G`, and
[Load the Google Maps library](/guides/load) covers the ways to load the Google Maps Javascript API
itself.

## Script order

Anything that uses `G` has to load after `gmaps.js`. That includes your own code and any plugin
scripts — a plugin registers itself on `G` when it loads, so a plugin script that loads first has
nothing to register onto.

```html
<script src="/js/gmaps.js"></script>
<script src="/js/some-gmaps-plugin.js"></script>
<script src="/js/my-map-code.js"></script>
```

## Everything is included

`browser.js` contains the whole library, including popups, tooltips and InfoWindows. The separate
entry points described on the [bundler page](/installation/bundler) don't apply here: a standalone
script can't be trimmed down to the parts a page uses, because there's no build step to work out
what those are.

If the file size matters for your site, that's the reason to use a bundler instead.
