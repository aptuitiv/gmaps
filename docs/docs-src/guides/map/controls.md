---
---

# Map controls

There are multiple map controls that you can configure for Google Maps. You can also add your own with [Button](/api-reference/map-controls/button), [Control](/api-reference/map-controls/control), or [addCustomControl()](/api-reference/map#addcustomcontrol) — see [custom controls](#custom-controls).

See the [Google maps controls documentation](https://developers.google.com/maps/documentation/javascript/controls) for more information about the built-in map controls.

## Fullscreen control

The Fullscreen control lets the user display the map in fullscreen mode.

You can do the following with the Fullscreen control:

- [Disable or enable the Fullscreen control](#disable-or-enable-the-fullscreen-control).
- [Configure the Fullscreen control](#configure-the-fullscreen-control).

### Disable or enable the Fullscreen control

You can disable the Fullscreen control by setting the `fullscreenControl` value to `false`.

You can do this when you create the map object.

```js
const map = G.map('map', {
    center: [40.7128, -74.0060],
    fullscreenControl: false,
});
```

Or you can do it with the `fullscreenControl` property. This can be set before or after the map has been displayed.

```js
map.fullscreenControl = false.
```

By default the Fullscreen control is enabled, but you can explicity set it as enabled if you want. You can set this when the map object is first created.

```js
const map = G.map('map', {
    center: [40.7128, -74.0060],
    fullscreenControl: true,
});
```

Or you can do it with the `fullscreenControl` property. You would typically do this if the Fullscreen control was previously disabled. This can be set before or after the map has been displayed.

```js
map.fullscreenControl = true.
```

### Configure the Fullscreen control

To configure the Fullscreen control you'll use the [FullscreenControl](/api-reference/map-controls/fullscreen-control) object. This is typically passed in the options when creating the map object.

```js
const fullscreenControl = G.fullscreenControl({
    position: G.ControlPosition.TOP_CENTER,
});

const map = G.map('map', {
    center: [40.7128, -74.0060],
    fullscreenControl: fullscreenControl,
});
```

You can also set the `fullscreenControl` property to set or update the configuration.

```js
map.fullscreenControl = G.fullscreenControl({
    position: G.ControlPosition.TOP_CENTER,
});
```

You can also get the existing object and then update it.

```js
const existingControl = map.fullscreenControl.
existingControl.position = [G.ControlPosition.BLOCK_START_INLINE_CENTER];
map.fullscreenControl = existingControl.
```

## Map Type control

The Map Type control lets the user change the map type.

You can do the following with the Map Type control:

- [Disable or enable the Map Type control](#disable-or-enable-the-map-type-control).
- [Configure the Map Type control](#configure-the-map-type-control).

### Disable or enable the Map Type control

You can disable the Map Type control by setting the `mapTypeControl` value to `false`.

You can do this when you create the map object.

```js
const map = G.map('map', {
    center: [40.7128, -74.0060],
    mapTypeControl: false,
});
```

Or you can do it with the `mapTypeControl` property. This can be set before or after the map has been displayed.

```js
map.mapTypeControl = false.
```

By default the MapType is enabled, but you can explicity set it as enabled if you want. You can set this when the map object is first created.

```js
const map = G.map('map', {
    center: [40.7128, -74.0060],
    mapTypeControl: true,
});
```

Or you can do it with the `mapTypeControl` property. You would typically do this if the Map Type control was previously disabled. This can be set before or after the map has been displayed.

```js
map.mapTypeControl = true.
```

### Configure the Map Type control

To configure the Map Type control you'll use the [MapTypeControl](/api-reference/map-controls/map-type-control) object. This is typically passed in the options when creating the map object.

```js
const mapTypeControl = G.mapTypeControl({
    mapTypeIds: [G.MapTypeId.ROADMAP, G.MapTypeId.TERRAIN],
    position: G.ControlPosition.TOP_CENTER,
    style: G.MapTypeControlStyle.DROPDOWN_MENU,
});

const map = G.map('map', {
    center: [40.7128, -74.0060],
    mapTypeControl: mapTypeControl,
});
```

You can also set the `mapTypeControl` property to set or update the configuration.

```js
map.mapTypeControl = G.mapTypeControl({
    mapTypeIds: [G.MapTypeId.ROADMAP, G.MapTypeId.TERRAIN],
    position: G.ControlPosition.TOP_CENTER,
    style: G.MapTypeControlStyle.DROPDOWN_MENU,
});
```

If you aren't going to update all of the options for the Map Type control then it's best to first get the existing object and then update it.

```js
const existingMapTypeControl = map.mapTypeControl.
existingMapTypeControl.mapTypeIds = [G.MapTypeId.TERRAIN];
map.mapTypeControl = existingMapTypeControl.
```

## Rotate control

The Rotate control lets the user display the map in rotate mode.

You can do the following with the Rotate control:

- [Disable or enable the Rotate control](#disable-or-enable-the-rotate-control).
- [Configure the Rotate control](#configure-the-rotate-control).

### Disable or enable the Rotate control

You can disable the Rotate control by setting the `rotateControl` value to `false`.

You can do this when you create the map object.

```js
const map = G.map('map', {
    center: [40.7128, -74.0060],
    rotateControl: false,
});
```

Or you can do it with the `rotateControl` property. This can be set before or after the map has been displayed.

```js
map.rotateControl = false.
```

By default the Rotate control is enabled, but you can explicity set it as enabled if you want. You can set this when the map object is first created.

```js
const map = G.map('map', {
    center: [40.7128, -74.0060],
    rotateControl: true,
});
```

Or you can do it with the `rotateControl` property. You would typically do this if the Rotate control was previously disabled. This can be set before or after the map has been displayed.

```js
map.rotateControl = true.
```

### Configure the Rotate control

To configure the Rotate control you'll use the [RotateControl](/api-reference/map-controls/rotate-control) object. This is typically passed in the options when creating the map object.

```js
const rotateControl = G.rotateControl({
    position: G.ControlPosition.LEFT_CENTER,
});

const map = G.map('map', {
    center: [40.7128, -74.0060],
    rotateControl: rotateControl,
});
```

You can also set the `rotateControl` property to set or update the configuration.

```js
map.rotateControl = G.rotateControl({
    position: G.ControlPosition.LEFT_CENTER,
});
```

You can also get the existing object and then update it.

```js
const existingControl = map.rotateControl.
existingControl.position = [G.ControlPosition.BLOCK_START_INLINE_CENTER];
map.rotateControl = existingControl.
```

## Scale control

The Scale control lets the user display the map in scale mode.

You can do the following with the Scale control:

- [Disable or enable the Scale control](#disable-or-enable-the-scale-control).
- [Configure the Scale control](#configure-the-scale-control).

### Disable or enable the Scale control

You can enable the Scale control by setting the `scaleControl` value to `true`.

You can do this when you create the map object.

```js
const map = G.map('map', {
    center: [40.7128, -74.0060],
    scaleControl: true,
});
```

Or you can do it with the `scaleControl` property. This can be set before or after the map has been displayed.

```js
map.scaleControl = true.
```

By default the Scale control is disabled, but you can explicity set it as disabled if you want. You can set this when the map object is first created.

```js
const map = G.map('map', {
    center: [40.7128, -74.0060],
    scaleControl: false,
});
```

Or you can do it with the `scaleControl` property. You would typically do this if the Scale control was previously enabled. This can be set before or after the map has been displayed.

```js
map.scaleControl = false.
```

### Configure the Scale control

To configure the Scale control you'll use the [ScaleControl](/api-reference/map-controls/scale-control) object. This is typically passed in the options when creating the map object.

```js
const scaleControl = G.scaleControl({
    enabled: true
});

const map = G.map('map', {
    center: [40.7128, -74.0060],
    scaleControl: scaleControl,
});
```

You can also set the `scaleControl` property to set or update the configuration.

```js
map.scaleControl = G.scaleControl({
    enabled: true
});
```

You can also get the existing object and then update it.

```js
const existingControl = map.scaleControl.
existingControl.enabled = false;
map.scaleControl = existingControl.
```

## Street View control

The Street View control lets the user display the map in scale mode.

You can do the following with the Street View control:

- [Disable or enable the Street View control](#disable-or-enable-the-scale-control).
- [Configure the Street View control](#configure-the-scale-control).

### Disable or enable the Street View control

You can disable the Street View control by setting the `streetViewControl` value to `false`.

You can do this when you create the map object.

```js
const map = G.map('map', {
    center: [40.7128, -74.0060],
    streetViewControl: false,
});
```

Or you can do it with the `streetViewControl` property. This can be set before or after the map has been displayed.

```js
map.streetViewControl = false.
```

By default the Street View control is enabled, but you can explicity set it as enabled if you want. You can set this when the map object is first created.

```js
const map = G.map('map', {
    center: [40.7128, -74.0060],
    streetViewControl: true,
});
```

Or you can do it with the `streetViewControl` property. You would typically do this if the Street View control was previously disabled. This can be set before or after the map has been displayed.

```js
map.streetViewControl = true.
```

### Configure the Street View control

To configure the Street View control you'll use the [StreetViewControl](/api-reference/map-controls/scale-control) object. This is typically passed in the options when creating the map object.

```js
const streetViewControl = G.streetViewControl({
    enabled: true,
    position: G.ControlPosition.LEFT_CENTER,
    sources: G.StreetViewSource.GOOGLE
});

const map = G.map('map', {
    center: [40.7128, -74.0060],
    streetViewControl: streetViewControl,
});
```

You can also set the `streetViewControl` property to set or update the configuration.

```js
map.streetViewControl = G.streetViewControl({
    enabled: true
});
```

You can also get the existing object and then update it.

```js
const existingControl = map.streetViewControl.
existingControl.enabled = false;
map.streetViewControl = existingControl.
```

## Zoom control

The Zoom control lets the user display the map in zoom mode.

You can do the following with the Zoom control:

- [Disable or enable the Zoom control](#disable-or-enable-the-zoom-control).
- [Configure the Zoom control](#configure-the-zoom-control).

### Disable or enable the Zoom control

You can disable the Zoom control by setting the `zoomControl` value to `false`.

You can do this when you create the map object.

```js
const map = G.map('map', {
    center: [40.7128, -74.0060],
    zoomControl: false,
});
```

Or you can do it with the `zoomControl` property. This can be set before or after the map has been displayed.

```js
map.zoomControl = false.
```

By default the Zoom control is enabled, but you can explicity set it as enabled if you want. You can set this when the map object is first created.

```js
const map = G.map('map', {
    center: [40.7128, -74.0060],
    zoomControl: true,
});
```

Or you can do it with the `zoomControl` property. You would typically do this if the Zoom control was previously disabled. This can be set before or after the map has been displayed.

```js
map.zoomControl = true.
```

### Configure the Zoom control

To configure the Zoom control you'll use the [ZoomControl](/api-reference/map-controls/zoom-control) object. This is typically passed in the options when creating the map object.

```js
const zoomControl = G.zoomControl({
    position: G.ControlPosition.LEFT_CENTER,
});

const map = G.map('map', {
    center: [40.7128, -74.0060],
    zoomControl: zoomControl,
});
```

You can also set the `zoomControl` property to set or update the configuration.

```js
map.zoomControl = G.zoomControl({
    position: G.ControlPosition.LEFT_CENTER,
});
```

You can also get the existing object and then update it.

```js
const existingControl = map.zoomControl.
existingControl.position = [G.ControlPosition.BLOCK_START_INLINE_CENTER];
map.zoomControl = existingControl.
```

## Custom controls

A custom control is any element you put on the map: a button, a legend, a logo, a message. There are
three ways to add one, and which to use comes down to how much of its lifecycle you need to manage.

| | Use it for |
|---|---|
| [Button](/api-reference/map-controls/button) | Anything clickable. Handles the click, and optionally an enabled state and an active state |
| [Control](/api-reference/map-controls/control) | Anything else on the map, and as the base class when writing your own control |
| [addCustomControl()](/api-reference/map#addcustomcontrol) | A one-off element you'll never need to move or remove |

None of them decide how a control looks. Every class name, every piece of content and every attribute
comes from you, and the library ships no CSS for controls.

### A button

[Button](/api-reference/map-controls/button) is in its own entry point, so import it separately, or
use `G.button()` with the standalone browser script.

```js
import { button } from '@aptuitiv/gmaps/button';

button({
    className: 'customButton',
    content: 'Custom Control',
    map: map,
    position: G.ControlPosition.BLOCK_START_INLINE_CENTER,
    onClick: () => {
        console.log('Custom Control clicked');
    },
});
```

A button that toggles something needs to show which state it's in. You describe what each state looks
like and the library applies it at the right time:

```js
const toggle = button({
    className: 'customButton',
    content: 'Traffic',
    map: map,
    position: G.ControlPosition.BLOCK_START_INLINE_CENTER,
    toggle: true,
    states: {
        active: { attributes: { 'data-visible': 'yes' }, tooltip: 'Hide traffic' },
        inactive: { attributes: { 'data-visible': 'no' }, tooltip: 'Show traffic' },
    },
});

toggle.onChange((active) => (active ? trafficLayer.show() : trafficLayer.hide()));
```

Two things that could go wrong when using [addCustomControl()](/api-reference/map#addcustomcontrol) that can't happen with Button.

1. A disabled button ignores clicks, so a button styled to look absent isn't still firing.
2. Disabling a button also clears its active state, so it can't be left looking switched on while the thing it controls has gone.

### A control that isn't a button

[Control](/api-reference/map-controls/control) is the same lifecycle without the click handling. It
can wrap markup that's already on the page. Example usage would be showing a logo on the map or some component that handles its own interactivity.

```js
const legend = G.control({
    element: '.js-mapLegend',
    map: map,
    position: G.ControlPosition.RIGHT_TOP,
});
```

Because you're given the control back, it can be moved or taken off again later:

```js
legend.position = G.ControlPosition.BLOCK_END_INLINE_START;
legend.remove();
legend.addTo(map);
```

`Control` is also the class to extend when writing a control of your own. See the
[plugin guide](/plugin).

### Adding an element directly

[addCustomControl()](/api-reference/map#addcustomcontrol) is the low-level call the other two are
built on. It puts an element on the map and that's all — you get no handle on what was added.

```js
const customBtn = document.createElement('button');
customBtn.textContent = 'Custom Control 2';
customBtn.className = 'customButton';
customBtn.style.backgroundColor = '#fff';
customBtn.style.border = '2px solid #ff0000';
customBtn.style.padding = '5px';
customBtn.style.display = 'inline-block';
customBtn.addEventListener('click', () => {
    console.log('Custom Control clicked');
});
map.addCustomControl(G.ControlPosition.BLOCK_START_INLINE_CENTER, customBtn);
```

That's fine for something you add once and leave alone. To move it, take it off, or keep its state in
step with what it controls, use `Control` or `Button` instead — or pass the element to
[removeCustomControl()](/api-reference/map#removecustomcontrol) to take it off again.

### Ready-made controls

The library ships one control that does a job rather than just being a shape: the
[location control](/api-reference/map-controls/location-control) shows the user's position and takes
the map back to it.

```js
import { locationControl } from '@aptuitiv/gmaps/location-control';

locationControl({ className: 'customButton', map: map });
```

### Ordering controls at the same position

Google puts the controls at a position in the order of an `index` property it reads off each element.
Lower numbers come first. `Control` and `Button` take it as an option:

```js
button({ content: 'First', index: 1, map: map, position: G.ControlPosition.LEFT_CENTER });
button({ content: 'Second', index: 2, map: map, position: G.ControlPosition.LEFT_CENTER });
```
