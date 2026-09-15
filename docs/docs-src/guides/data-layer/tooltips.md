---
---

# Tooltips on data layer features

Tooltips work the same way as popups on a data layer, so [Popups on data layer features](/guides/data-layer/popups) covers most of what you need. This page is what's different.

```js
// Every feature in the layer
layer.attachTooltip('{name}');

// One feature only, which wins over the layer's
const feature = await layer.getFeature('parcel-12');
feature.attachTooltip('{name} — {type}');
```

Everything from the popups guide applies: `{property}` placeholders, functions that return the content, a [TooltipOptions](/api-reference/tooltip#tooltip-options) object or a whole [Tooltip](/api-reference/tooltip) object, and a tooltip on a feature taking precedence over one on the layer.

```js
layer.attachTooltip((feature) => `${feature.getProperty('name')} (${feature.getPaths().length - 1} holes)`);
```

## What's different from popups

**It shows on hover.** A tooltip defaults to the `hover` event where a popup defaults to `click`. That's the same difference as everywhere else in the library.

```js
// Show the tooltip on click instead
layer.attachTooltip('{name}', 'click');
```

**The map isn't panned.** A popup pans the map so that it's fully in view when it opens. A tooltip doesn't, because it follows the mouse and moving the map would pull the feature out from under the cursor.

## Both at once

A layer can have a tooltip and a popup attached at the same time. They're tracked separately, so the tooltip on hover and the popup on click don't interfere with each other.

```js
layer.attachTooltip('{name}');
layer.attachPopup('<h3>{name}</h3><p>{address}</p>');
```

## A tooltip on the whole layer without the data layer methods

If every feature should show the same fixed text then the tooltip inherited from [Layer](/api-reference/base-classes/layer#attachtooltip) would do it, since a data layer is a layer. But `attachTooltip()` on the data layer covers that case too and gives you per-feature content, so there's no reason to reach past it.
