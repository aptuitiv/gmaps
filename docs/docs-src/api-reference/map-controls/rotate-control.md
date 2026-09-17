---
---

# RotateControl

The RotateControl object is used to configure the [Rotate control](https://developers.google.com/maps/documentation/javascript/controls) on the map.

The RotateControl object lets you change the position of the rotate control.

[See the Map Controls guide page for more information](/guides/map/controls).

## Example usage

```js
const rotateControl = G.rotateControl({
    position: G.ControlPosition.LEFT_CENTER,
});

const map = G.map('map', {
    center: [40.7128, -74.0060],
    rotateControl: rotateControl,
});
```

## Creating the RotateControl object

`G.rotateControl(options?: RotateControlValue): RotateControl`

There are a few ways to setup the `RotateControl` object.

**Pass no value.**

`G.rotateControl(): RotateControl`

```js
const control = G.rotateControl();
control.position = G.ControlPosition.LEFT_CENTER;
```

**Pass a boolean value to disable the Rotate control.**

`G.rotateControl(value: boolean): RotateControl`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | boolean | Yes | Whether to enable the Rotate control. |

If you pass a `false` value to the `rotateControl` method then that will disable and hide the Rotate control when this is associated with a map.

```js
const control = G.rotateControl(false);
```

**Pass an object of options.**

`G.rotateControl(options: RotateControlOptions): RotateControl`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [RotateControlOptions](#rotate-control-options) | Yes | The configuration options. |

```js
const rotateControl = G.rotateControl({
    position: G.ControlPosition.LEFT_CENTER,
});
```

**Pass an existing RotateControl object.**

`G.rotateControl(value: RotateControl): RotateControl`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | RotateControl | Yes | The existing RotateControl object. |

```js
const control = G.rotateControl(existingRotateControlObject);
```

## Rotate Control options

Type `RotateControlOptions`.

RotateControlOptions is an object containing the configuration options for the RotateControl object.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| enabled | boolean | true | Whether the Rotate control is enabled and will display on the map. |
| position | [ControlPosition](/api-reference/constants#controlposition) | `INLINE_END_BLOCK_START` | The display position of the control. |

## Properties

| Property  | Type   | Description                             |
|-----------|--------|-----------------------------------------|
| enabled | boolean | Whether the Rotate control is enabled and will display on the map. |
| position | [ControlPosition](/api-reference/constants#controlposition) | The display position of the control. |

## Methods

### disable

`disable(): RotateControl`

Disables and hides the Rotate control.

```js
control.disable();
```

### enable

`enable(): RotateControl`

Enables and shows the Rotate control.

```js
control.enable();
```

### setPosition

`setPosition(position: ControlPosition): RotateControl`

Set the display position of the control on the map.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| position | [ControlPosition](/api-reference/constants#controlposition) | Yes | The display position of the control. |

```js
control.setPosition(G.ControlPosition.BLOCK_END_INLINE_START)
```

### toGoogle

`toGoogle(): Promise<google.maps.RotateControlOptions>`

Get the object to use to pass the RotateControl options to the Google Map instance.

```js
control.toGoogle().then((options) => {
    // Do something with the options
});
```
