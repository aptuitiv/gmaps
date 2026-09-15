---
---

# ZoomControl

The ZoomControl object is used to configure the [Zoom control](https://developers.google.com/maps/documentation/javascript/controls) on the map.

The ZoomControl object lets you change the position of the zoom control.

[See the Map Controls guide page for more information](/guides/map/controls).

## Example usage

```js
const zoomControl = G.zoomControl({
    position: G.ControlPosition.LEFT_CENTER,
});

const map = G.map('map', {
    center: [40.7128, -74.0060],
    zoomControl: zoomControl,
});
```

## Creating the ZoomControl object

`G.zoomControl(options?: ZoomControlValue): ZoomControl`

There are a few ways to setup the `ZoomControl` object.

**Pass no value.**

`G.zoomControl(): ZoomControl`

```js
const control = G.zoomControl();
control.position = G.ControlPosition.LEFT_CENTER;
```

**Pass a boolean value to disable the Zoom control.**

`G.zoomControl(value: boolean): ZoomControl`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | boolean | Yes | Whether to enable the Zoom control. |

If you pass a `false` value to the `zoomControl` method then that will disable and hide the Zoom control when this is associated with a map.

```js
const control = G.zoomControl(false);
```

**Pass an object of options.**

`G.zoomControl(options: ZoomControlOptions): ZoomControl`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [ZoomControlOptions](#zoom-control-options) | Yes | The configuration options. |

```js
const zoomControl = G.zoomControl({
    position: G.ControlPosition.LEFT_CENTER,
});
```

**Pass an existing ZoomControl object.**

`G.zoomControl(value: ZoomControl): ZoomControl`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | ZoomControl | Yes | The existing ZoomControl object. |

```js
const control = G.zoomControl(existingZoomControlObject);
```

## Zoom Control options

Type `ZoomControlOptions`.

ZoomControlOptions is an object containing the configuration options for the ZoomControl object.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| enabled | boolean | true | Whether the Zoom control is enabled and will display on the map. |
| position | [ControlPosition](/api-reference/constants#controlposition) | `INLINE_END_BLOCK_END` | The display position of the control. |

## Properties

| Property  | Type   | Description                             |
|-----------|--------|-----------------------------------------|
| enabled | boolean | Whether the Zoom control is enabled and will display on the map. |
| position | [ControlPosition](/api-reference/constants#controlposition) | The display position of the control. |

## Methods

### disable

`disable(): ZoomControl`

Disables and hides the Zoom control.

```js
control.disable();
```

### enable

`enable(): ZoomControl`

Enables and shows the Zoom control.

```js
control.enable();
```

### setPosition

`setPosition(position: ControlPosition): ZoomControl`

Set the display position of the control on the map.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| position | [ControlPosition](/api-reference/constants#controlposition) | Yes | The display position of the control. |

```js
control.setPosition(G.ControlPosition.BLOCK_END_INLINE_START)
```

### toGoogle

`toGoogle(): Promise<google.maps.ZoomControlOptions>`

Get the object to use to pass the ZoomControl options to the Google Map instance.

```js
control.toGoogle().then((options) => {
    // Do something with the options
});
```
