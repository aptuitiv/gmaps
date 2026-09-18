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

The `/core`, `/popup`, `/tooltip` and `/infowindow` entry points described on the
[bundler page](/installation/bundler) can be required, and the exports you'd expect are there:

```js
const { map } = require('@aptuitiv/gmaps/core');
```

They all resolve to the same full build, though, so requiring `/core` gives you everything rather
than a smaller subset. Two reasons for that: the code splitting that makes the separate ESM entry
points possible isn't available for CommonJS, so building them separately would mean each one
carrying its own copy of the library — and two copies of a class would break the `instanceof` checks
the library relies on. And `require()` can't be analysed well enough to drop unused code in the first
place, so there would be nothing to gain from it.

The practical version: on CommonJS, use `@aptuitiv/gmaps` and don't think about entry points.
`attachPopup()`, `attachTooltip()` and `attachInfoWindow()` are always available.

## Browser code

If you're writing code for a browser rather than for Node, use the
[bundler](/installation/bundler) or [standalone script](/installation/browser) instead.
