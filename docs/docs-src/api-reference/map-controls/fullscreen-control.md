---
---

# FullscreenControl

The FullscreenControl object is used to configure the [Fullscreen control](https://developers.google.com/maps/documentation/javascript/controls) on the map.

The FullscreenControl object lets you change the position of the fullscreen control.

[See the Map Controls guide page for more information](/guides/map/controls).

## Example usage

```js
const fullscreenControl = G.fullscreenControl({
    position: G.ControlPosition.TOP_CENTER,
});

const map = G.map('map', {
    center: [40.7128, -74.0060],
    fullscreenControl: fullscreenControl,
});
```

## Creating the FullscreenControl object

`G.fullscreenControl(options?: FullscreenControlValue): FullscreenControl`

There are a few ways to setup the `FullscreenControl` object.

**Pass no value.**

`G.fullscreenControl(): FullscreenControl`

```js
const control = G.fullscreenControl();
control.position = G.ControlPosition.TOP_CENTER;
```

**Pass a boolean value to disable the Fullscreen control.**

`G.fullscreenControl(value: boolean): FullscreenControl`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | boolean | Yes | Whether to enable the Fullscreen control. |

If you pass a `false` value to the `fullscreenControl` method then that will disable and hide the Fullscreen control when this is associated with a map.

```js
const control = G.fullscreenControl(false);
```

**Pass an object of options.**

`G.fullscreenControl(options: FullscreenControlOptions): FullscreenControl`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [FullscreenControlOptions](#fullscreen-control-options) | Yes | The configuration options. |

```js
const fullscreenControl = G.fullscreenControl({
    position: G.ControlPosition.TOP_CENTER,
});
```

**Pass an existing FullscreenControl object.**

`G.fullscreenControl(value: FullscreenControl): FullscreenControl`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | FullscreenControl | Yes | The existing FullscreenControl object. |

```js
const control = G.fullscreenControl(existingFullscreenControlObject);
```

## Fullscreen Control options

Type `FullscreenControlOptions`.

FullscreenControlOptions is an object containing the configuration options for the FullscreenControl object.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| enabled | boolean | true | Whether the Fullscreen control is enabled and will display on the map. |
| position | [ControlPosition](/api-reference/constants#controlposition) | `INLINE_END_BLOCK_START` | The display position of the control. |

## Properties

| Property  | Type   | Description                             |
|-----------|--------|-----------------------------------------|
| enabled | boolean | Whether the Fullscreen control is enabled and will display on the map. |
| position | [ControlPosition](/api-reference/constants#controlposition) | The display position of the control. |

## Methods

### disable

`disable(): FullscreenControl`

Disables and hides the Fullscreen control.

```js
control.disable();
```

### enable

`enable(): FullscreenControl`

Enables and shows the Fullscreen control.

```js
control.enable();
```

### setPosition

`setPosition(position: ControlPosition): FullscreenControl`

Set the display position of the control on the map.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| position | [ControlPosition](/api-reference/constants#controlposition) | Yes | The display position of the control. |

```js
control.setPosition(G.ControlPosition.BLOCK_END_INLINE_START)
```

### toGoogle

`toGoogle(): Promise<google.maps.FullscreenControlOptions>`

Get the object to use to pass the FullscreenControl options to the Google Map instance.

```js
control.toGoogle().then((options) => {
    // Do something with the options
});
```
