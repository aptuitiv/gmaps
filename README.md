# @aptuitiv/gmaps

Gmaps makes it easier to display a Google map on a page and add markers, overlays, and other elements to it.

## Install

Download from NPM.

```bash
npm install @aptuitiv/gmaps
```

## Browser support

The library is built for ES2022 so that it can use private class fields, which are much faster and use less memory than the WeakMaps that older builds needed to replace them with. This matters most on phones and on maps with a lot of markers or polylines.

This needs one of the following, all released in 2021 or earlier.

| Browser | Version |
|---------|---------|
| Safari (including iOS) | 15 |
| Chrome | 84 |
| Edge | 84 |
| Firefox | 90 |

If you need to support older browsers, the library can be converted for them with your own build tools.

## Documentation

[View the documentation](https://aptuitiv.github.io/gmaps-docs/).

## Credit

Inspired by [Leaflet](https://leafletjs.com/).

## Development

TLDR: run this to build and watch the code

```bash
npm run watch-all
```

Building and watching the code involves three parts.

1. The Javascript code
2. The CSS code
3. The local server to test the code

Run the Javascript code only with `npm run watch`.

Run the CSS code only with `npm run css-watch`.

Run the local server with `npm run site-serve`.

Run all of them at once with `npm run watch-all`. This is our recommended method of working on the code as it'll watch the Javascript, the CSS, run the local site.
