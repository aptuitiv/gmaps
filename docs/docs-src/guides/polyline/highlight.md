---
---

# Highlighting polylines

You can add a "highlight" version of the polyline that will show when you're hovering over the polyline with a mouse. The intention is to show a slightly wider version of the polyline to make it more clear that it's being hovered over.

Think of it as a hover style for polylines.

To do this you pass information for another polyline to the main polyline object. You don't have to set up all of the data for the polyline. The hover polyline will automatically inherit some data from the main polyline.

- `clickable` set to `true`
- `map`
- `path`

The `visible` property will be initially set to `false`.

The `zIndex` value will be automatically set or adjusted.

- If the `zIndex` value is not set then it's set to be one level lower than the primary polyline's `zIndex` value.
- If the primary polyline doesn't have a `zIndex` but the highlight one does, then the primary polyline's `zIndex` is set to be one level higher than the highlight polyline.
- If both the primary and highlight polyline have the same `zIndex` value then the highlight polyline's `zIndex` value is set to be one level lower.
- If both the primary and the highlight polyline do not have a `zIndex` value then the highlight polyline is set to `1` and the primary polyline is set to `2`.
- If the highlight polyline `zIndex` is greater than the primary polyline's `zIndex` then nothing is done because we assume that you had a reason to do that. (Although you may get unexpected results as it's intended for the highlight polyline to be below the primary one.)

The mouse hover events are automatically set upon the primary polyline to show the highlight polyline when the primary one is hovered.

## Set up the highlight polyline

To set up the highlight polyline you either pass a [Polyline](/api-reference/polyline) object or a [PolylineOptions](/api-reference/polyline#polyline-options) object.

There are a few ways that you can do this.

### Use the `highlightPolyline` option

When you are creating the primary polyline you can pass the highlight [Polyline](/api-reference/polyline) object or a [PolylineOptions](/api-reference/polyline#polyline-options) object through the [`highlightPolyline` option](/api-reference/polyline/#polyline-options).

```js
const polyline = G.polyline({
    path: path,
    map: map,
    highlightPolyline: {
        strokeColor: 'purple',
        strokeOpacity: 0.5,
        strokeWeight: 4,
    }
});
```

```js
const highlightPolyline = G.polyline({
    strokeColor: '#412387',
    strokeOpacity: 0.5,
    strokeWeight: 4,
});
const polyline = G.polyline({
    path: path,
    map: map,
    highlightPolyline: highlightPolyline
});
```

### Use the `highlightPolyline` property

After you create the primary polyline you can set up the highlight polyline using the [`highlightPolyline` property](/api-reference/polyline/#properties).

```js
const polyline = G.polyline({
    path: path,
    map: map,
});
polyline.highlightPolyline = {
    strokeColor: 'purple',
    strokeOpacity: 0.5,
    strokeWeight: 4,
};
```

```js
const polyline = G.polyline({
    path: path,
    map: map,
});
const highlightPolyline = G.polyline({
    strokeColor: '#412387',
    strokeOpacity: 0.5,
    strokeWeight: 4,
});
polyline.highlightPolyline = highlightPolyline;
```

### Use the `setHighlightPolyline` method

After you create the primary polyline you can set up the highlight polyline using the [setHighlightPolyline() method](/api-reference/polyline/#sethighlightpolyline).

```js
const polyline = G.polyline({
    path: path,
    map: map,
});
polyline.setHighlightPolyline({
    strokeColor: 'purple',
    strokeOpacity: 0.5,
    strokeWeight: 4,
});
```

```js
const polyline = G.polyline({
    path: path,
    map: map,
});
const highlightPolyline = G.polyline({
    strokeColor: '#412387',
    strokeOpacity: 0.5,
    strokeWeight: 4,
});
polyline.setHighlightPolyline(highlightPolyline);
```

## Display the highlight polyline

By default the highlight polyline is displayed when you hover your mouse over the primary polyline.

You can, however, manually show the highlight polyline with the [highlight() method](/api-reference/polyline#highlight).

```js
polyline.highlight();
```

:::info
If you manually highlight a polyline then the hover effects to show/hide the highlight polyline are disabled until the highlight polyline is manually hidden.
:::

## Hide the highlight polyline

By default the highlight polyline is hidden when you move your mouse off the primary polyline.

You can, however, manually hide the highlight polyline with the [unhighlight() method](/api-reference/polyline#unhighlight). This is typically done if you used the [highlight() method](/api-reference/polyline#highlight).

```js
polyline.unhighlight();
```
