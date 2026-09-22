---
---

# CommonJS

Use this for Node code that loads the library with `require()`.

```bash
npm install @aptuitiv/gmaps
```

```js
const { map, marker } = require('@aptuitiv/gmaps');
```

## The subpath entry points

The `/core`, `/popup`, `/tooltip`, `/infowindow`, `/button` and `/location-control` entry points
described on the [bundler page](/installation/bundler) can all be required, and the exports you'd
expect are there:

```js
const { map } = require('@aptuitiv/gmaps/core');
const { button } = require('@aptuitiv/gmaps/button');
```

They all resolve to the same file, though, so requiring any of them gives you the whole library
rather than a smaller subset. `require('@aptuitiv/gmaps')` includes `button` and `locationControl`
too, even though the matching ESM entry point doesn't.

Two reasons it works this way. The code splitting that makes the separate ESM entry points possible
isn't available for CommonJS, so building them separately would mean each one carrying its own copy
of the library — and two copies of a class makes `instanceof` false for an object created by the
other one, which the library relies on internally. And `require()` can't be analysed well enough to
drop unused code in the first place, so there would be nothing to gain from it.

The practical version: on CommonJS, require `@aptuitiv/gmaps` and don't think about entry points.
Everything is on it.

## Browser code

If you're writing code for a browser rather than for Node, use the
[bundler](/installation/bundler) or [standalone script](/installation/browser) instead.
