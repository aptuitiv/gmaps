---
---

# LocationControl

Shows the user's position on the map as a marker that keeps up with them, and gives them a control that takes the map back to it.

:::info
The location control is in its own entry point. Import it from `@aptuitiv/gmaps/location-control`, or use `G.locationControl()` with the standalone browser script, which contains everything. See [installation](/installation/bundler).
:::

```js
import { locationControl } from '@aptuitiv/gmaps/location-control';

locationControl({
    className: 'MapBtn MapBtn-geo',
    content: '<svg class="Icon"><use xlink:href="#icon-location" /></svg>',
    map: map,
    position: ControlPosition.LEFT_BOTTOM,
});
```

That's the whole feature. The map starts watching, a marker appears where the user is and follows them, the control appears once there's somewhere to go, and clicking it pans the map there.

[map.locate()](/api-reference/map#locate) does the locating on its own if all you want is the position data. This control is the part that shows it.

## What it does, in order

1. Starts the map watching with [locate()](/api-reference/map#locate), unless `autoLocate` is off.
2. On the **first** fix: shows the marker, puts the control on the map, and moves the map if `centerOnFirstFind` is set.
3. On **later** fixes: moves the marker only. The map is deliberately left alone, so it doesn't yank itself back while the user is panning.
4. On an **error**: nothing appears. With the default `showWhenLocated` the control was never added, so a denied permission leaves no dead button on the map.

## Location control options

Type `LocationControlOptions`. Everything from [ButtonOptions](/api-reference/map-controls/button#button-options) as well.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| action | `'pan'` \| `'center'` | `pan` | What clicking does with the map. |
| autoLocate | boolean | `true` | Whether the control calls [locate()](/api-reference/map#locate) itself. Set it to `false` if something else on the page already does. |
| centerOnFirstFind | boolean | `false` | Whether to move the map to the user the first time a location is found. |
| locateOptions | [LocateOptions](/api-reference/map#locate-options) | | Passed through to `locate()`. |
| marker | boolean \| [Marker](/api-reference/marker) \| [MarkerOptions](/api-reference/marker#marker-options) | | `false` for no marker, a `Marker` to use as it is, or options merged over the default. |
| showWhenLocated | boolean | `true` | Whether the control is only put on the map once a location has been found. |
| zoom | number | | The zoom level to set when the control is clicked. Left alone if not set. |

### The marker

The default is the blue dot that maps conventionally use for the user's position. It's a [Marker](/api-reference/marker) with an [SvgSymbol](/api-reference/utilities/svgsymbol), so anything you can do to a marker you can do to it.

Pass marker options to change part of it — they're merged over the default, so you can change just the colour:

```js
locationControl({ map: map, marker: { svgIcon: { fillColor: '#c0392b' } } });
```

Pass `marker: false` for a control with no marker, or your own `Marker` to use instead. A marker you pass in is yours: the control hides it when it's removed rather than destroying it.

### Styling

No CSS ships with the library and no class names are chosen for you. A control with no `className` renders as an unstyled button. Something like this is a reasonable starting point:

```css
.MapBtn {
    background-color: #fff;
    border: none;
    border-radius: 2px;
    box-shadow: 0 1px 4px -1px rgb(0 0 0 / 30%);
    cursor: pointer;
    margin: 10px;
    padding: 8px;
}
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| isLocated | boolean | Whether a location has been found yet. Read only. |
| location | [LocationPosition](/api-reference/map#locate-position-data) \| undefined | The last position that was found. Read only. |
| marker | [Marker](/api-reference/marker) \| undefined | The marker showing where the user is. Read only. |

Plus everything from [Button](/api-reference/map-controls/button#properties) and [Control](/api-reference/map-controls/control#properties).

## Events

| Event | Description |
|-------|-------------|
| located | A location was found. Fires on every fix, not just the first. The event includes the `position`. |

Plus `click` and `change` from [Button](/api-reference/map-controls/button#events), and `add` and `remove` from [Control](/api-reference/map-controls/control#events).

For the raw position data, listen to [locationfound](/api-reference/map#events) on the map instead — that's the right place for anything that isn't about this control, like filling in a "search near me" field.

```js
map.onLocationFound((position) => {
    document.querySelector('#lat').value = position.latitude;
    document.querySelector('#lng').value = position.longitude;
});
```

## Methods

| Method | Description |
|--------|-------------|
| panToLocation() | Move the map to the last known location. This is what clicking does, exposed so the same behaviour can go on your own UI. |
| setMap(map) | Start watching on a map and show the control on it. The `map` option does this for you. |
| stop() | Stop watching, leaving the control and marker where they are. |
| remove() | Take the control off the map, hide the marker and stop watching. |

### Stopping

`stop()` and `remove()` only stop the watch if this control started it. If something else on the page called [locate()](/api-reference/map#locate) first, its updates keep coming.

## Using it with something else that locates

If the page already calls `locate()` — often to get the position before the map is even shown — turn `autoLocate` off. The control still reacts to every fix:

```js
map.locate();

locationControl({ autoLocate: false, className: 'MapBtn', map: map });
```

Calling `locate()` more than once is safe either way: the map only ever keeps one watch.
