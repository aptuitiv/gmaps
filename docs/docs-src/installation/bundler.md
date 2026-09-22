---
---

# Bundler (ESM)

Use this if your site's Javascript is built with Vite, esbuild, Webpack, Rollup, or a build tool that
wraps one of them.

```bash
npm install @aptuitiv/gmaps
```

```js
import { map, marker } from '@aptuitiv/gmaps';

const myMap = map('#map', { latitude: 40.73061, longitude: -73.935242, zoom: 12 });
myMap.show();
```

That's all that's needed. The rest of this page is about keeping the parts you don't use out of your
bundle.

## Leaving out what you don't use

`@aptuitiv/gmaps` contains everything, including popups, tooltips and InfoWindows. If you don't use
those, import from `@aptuitiv/gmaps/core` instead and add back only the ones you want.

```js
// Everything except popups, tooltips and InfoWindows
import { map, marker } from '@aptuitiv/gmaps/core';

// Add the ones you need
import { popup } from '@aptuitiv/gmaps/popup';
import { tooltip } from '@aptuitiv/gmaps/tooltip';
import { infoWindow } from '@aptuitiv/gmaps/infowindow';
```

Two controls have their own entry points as well, and are the things that aren't in
`@aptuitiv/gmaps` at all — import them when you want them:

```js
import { button } from '@aptuitiv/gmaps/button';
import { locationControl } from '@aptuitiv/gmaps/location-control';
```

Both are in the standalone browser script as `G.button()` and `G.locationControl()`, because that
build contains everything.

Importing a feature anywhere in your code is enough — it doesn't have to be in the file that uses it,
and you don't have to use what you imported. If you only want `attachPopup()` on your markers and
never call `popup()` yourself, import it for its effect alone:

```js
import '@aptuitiv/gmaps/popup';
```

### What each one costs

Approximate sizes of a bundle containing only the library, minified and not compressed. Measured two
ways, because results vary by bundler and it's worth knowing by how much.

| What you import | esbuild | webpack |
|---|---|---|
| `latLng` from `/core` | 8 KB | 8 KB |
| `map` and `marker` from `/core` | 70 KB | 70 KB |
| `map` and `marker` from `/core`, plus `/button` | 74 KB | 74 KB |
| `map` and `marker` from `/core`, plus `/popup` and `/tooltip` | 106 KB | 107 KB |
| Anything from `@aptuitiv/gmaps` | 111 KB | 120 KB |

The two agree closely on everything except the full bundle, where webpack's module wrapping and
runtime add a few kilobytes. Your own figures will differ again once the rest of your code is in the
bundle and compression is applied — treat these as the shape of the difference rather than exact
numbers.

Three things worth reading off that table. Most of the library's size is the map itself, so the
saving is largest for pages that use very little. Popups and tooltips are the expensive part — if you
use both, `/core` saves you almost nothing and you may as well import from `@aptuitiv/gmaps`. And
everything else in the library put together costs a few kilobytes on top of a map, so leaving out
things like geocoding or the data layer isn't where the wins are.

## When a feature hasn't been imported

Calling a method that belongs to a module you haven't imported throws an error that says what to add:

```text
attachPopup() is added by the "popup" module, which hasn't been imported. Import it once,
anywhere in your code, to add attachPopup() to this object:
    import '@aptuitiv/gmaps/popup';
Importing from '@aptuitiv/gmaps' instead of '@aptuitiv/gmaps/core' includes it as well.
```

The methods this applies to are `attachPopup()`, `attachTooltip()` and `attachInfoWindow()`, and the
`tooltip` option that markers and polylines accept.

## Mixing entry points

Mixing `@aptuitiv/gmaps` and `@aptuitiv/gmaps/core` in one project is safe — they share the same code
rather than each carrying a copy, so an object made by one works with the other. It does mean you get
everything, though, which defeats the point. Pick one and use it throughout.

## Typescript

Types come with every entry point and need no extra setup.
