---
---

# Popups on data layer features

There are three ways to show a [popup](/api-reference/popup) for a feature in a [data layer](/api-reference/data-layer). Which one you want depends on whether the popup is the same for every feature.

1. [Attach a popup to the whole layer](#attach-a-popup-to-the-whole-layer). Every feature gets it, with the content built from each feature's properties. This is usually what you want for GeoJson data.
2. [Attach a popup to one feature](#attach-a-popup-to-one-feature). For when a particular feature needs something different.
3. [Show the popup yourself](#show-the-popup-yourself). For when you need to do more than set the content.

## Attach a popup to the whole layer

`layer.attachPopup(content, event?)`

Every feature in the layer gets a popup, including features loaded later. You only set it up once, so this is the one to reach for with GeoJson data where you don't have the features to hand.

The content can hold `{property}` placeholders. They're replaced with the properties of whichever feature was clicked.

```js
const layer = G.dataLayer({ map: map });

layer.attachPopup('<h3>{name}</h3><p>{address}</p>');

layer.loadGeoJson('/parcels.json');
```

A property that a feature doesn't have is replaced with an empty string, so you don't get `undefined` showing up in the popup.

### Building the popup with a function

Pass a function when the popup needs more than the property values. It's called with the [DataFeature](/api-reference/data-feature) every time the popup is about to be shown.

```js
layer.attachPopup((feature) => `<h3>${feature.getProperty('name')}</h3><p>${feature.getPaths().length - 1} holes</p>`);
```

The function can return more than a string. It returns a [PopupValue](/api-reference/popup#popup-type), so any of these work.

Return an `HTMLElement` or `Text` node.

```js
layer.attachPopup((feature) => {
    const div = document.createElement('div');
    div.textContent = feature.getProperty('name');
    return div;
});
```

Return a [PopupOptions](/api-reference/popup#popup-options) object when more than the content changes from one feature to the next.

```js
layer.attachPopup((feature) => ({
    className: `popup-${feature.getProperty('type')}`,
    content: `<h3>${feature.getProperty('name')}</h3>`,
    theme: 'default',
}));
```

Return a [Popup](/api-reference/popup) object to show a completely different popup. The popup that's currently showing is hidden first, so you don't end up with two on the map.

```js
const popups = {
    park: G.popup({ className: 'parkPopup', content: 'A park' }),
    water: G.popup({ className: 'waterPopup', content: 'Water' }),
};

layer.attachPopup((feature) => popups[feature.getProperty('type')]);
```

:::note

The `{property}` placeholders are only replaced in content you set up front. A value the function returns is used as it is, since the function already has the feature and can build whatever it needs.

:::

This is the same [PopupCallback](/api-reference/popup#popup-callback-type) that any popup accepts. A popup on a marker or a polyline takes a function in the same way, and gets passed that layer instead of a feature.

```js
marker.attachPopup((marker) => `<h3>${marker.getData('name')}</h3>`);
```

### Setting the popup options

Pass the [popup options](/api-reference/popup#popup-options) to set anything else about the popup. The `content` value can still hold placeholders.

```js
layer.attachPopup({
    autoClose: true,
    className: 'parcelPopup',
    clearance: [20, 20],
    content: '<h3>{name}</h3>',
    theme: 'default',
});
```

`attachPopup()` returns the [Popup](/api-reference/popup) object, so you can also change it afterwards.

```js
const popup = layer.attachPopup('<h3>{name}</h3>');
popup.theme = 'default';
```

### Choosing the event

The second parameter is the event that shows the popup. It's `click` by default.

| Event | Description |
|-------|-------------|
| click | Show the popup when a feature is clicked. Clicking the same feature again hides it. |
| clickon | Show the popup when a feature is clicked. It stays open when the feature is clicked again. |
| hover | Show the popup while the mouse is over a feature. |

```js
layer.attachPopup('<h3>{name}</h3>', 'hover');
```

:::note

A `hover` popup doesn't pan the map to bring the popup into view. Moving the map would take the feature out from under the cursor, which would immediately close the popup again.

:::

## Attach a popup to one feature

`feature.attachPopup(content, event?)`

A popup on a single feature takes precedence over one attached to the whole layer, so you can set a default for the layer and then override it for the features that need it.

```js
layer.attachPopup('<h3>{name}</h3>');

const feature = await layer.getFeature('parcel-12');
feature.attachPopup('<h3>{name}</h3><p>This one is different.</p>');
```

The content works the same way, so a function works here too.

```js
feature.attachPopup((f) => `<h3>${f.getProperty('name')}</h3>`);
```

To do this for some of the features after loading, pick them out of what the load resolves with.

```js
const features = await layer.loadGeoJson('/parcels.json');

features
    .filter((feature) => feature.getProperty('type') === 'park')
    .forEach((feature) => {
        feature.attachPopup('<h3>{name}</h3><p>A park</p>');
    });
```

That said, if the content is the same shape for every feature then attaching one popup to the layer does the same job with less work, and one popup object instead of one per feature.

## Show the popup yourself

Use the layer's [click event](/api-reference/data-layer#onclick) when you need to do more than set the content. Loading the popup content from somewhere before showing it is the usual reason.

```js
const popup = G.popup({ autoClose: true, theme: 'default' });

layer.onClick(async (event) => {
    const details = await fetch(`/parcels/${event.feature.id}`).then((r) => r.text());

    popup.setContent(details);

    // Hide the popup before showing it again. See below.
    popup.hide();
    popup.position = event.latLng;
    popup.show(map);
});
```

Reuse one popup object rather than creating one per click. The popup keeps an element on the map, so creating a new one each time leaves the old ones behind.

### Panning the map so that the popup is in view

The popup pans the map to bring itself fully into view when it's shown, so a popup near the edge of the map doesn't get cut off. `attachPopup()` does this automatically.

When you show the popup yourself there's one thing to know: **the map is only panned on the first draw after the popup is shown**. That's deliberate, because the popup is redrawn every time the map is moved or zoomed and you don't want the map to keep pulling itself back.

So this only pans the map for the first popup:

```js
// Don't do this
layer.onClick((event) => {
    popup.setContent(event.feature.getProperty('name'));
    popup.position = event.latLng;
    popup.show(map);
});
```

Calling [`hide()`](/api-reference/popup#hide) first resets the popup. The popup is then repositioned and [`show()`](/api-reference/popup#show) displays the popup and pans the map to bring it into view.

```js
layer.onClick((event) => {
    popup.setContent(event.feature.getProperty('name'));

    popup.hide();
    popup.position = event.latLng;
    popup.show(map);
});
```

[`move()`](/api-reference/overlay#move) is a shorthand for setting the position and showing the popup, so this does the same thing.

```js
popup.hide();
popup.move(event.latLng, map);
```

Use the popup's `clearance` option to leave a gap between the popup and the edge of the map when it's panned into view.

```js
const popup = G.popup({ clearance: [20, 20], content: '' });
```

Set `fit` to `false` if you don't want the map panned at all.

```js
const popup = G.popup({ fit: false, content: '' });
```

## Where the popup appears

The popup opens at the point on the feature that was clicked, which the event gives you as `event.latLng`. For a long line that's better than opening at one end of it.

To open it somewhere else, use the feature's geometry. This opens the popup at the middle of a line:

```js
layer.onClick((event) => {
    const path = event.feature.getPath();

    popup.setContent(event.feature.getProperty('name'));
    popup.hide();
    popup.position = path[Math.floor(path.length / 2)];
    popup.show(map);
});
```
