---
---

# ScaleControl

The ScaleControl object is used to configure the [Scale control](https://developers.google.com/maps/documentation/javascript/controls) on the map.

The ScaleControl object lets you enable or disable the Scale control. By default it is disabled.

[See the Map Controls guide page for more information](/guides/map/controls).

## Example usage

```js
const scaleControl = G.scaleControl({
    enabled: true
});

const map = G.map('map', {
    center: [40.7128, -74.0060],
    scaleControl: scaleControl,
});
```

## Creating the ScaleControl object

`G.scaleControl(options?: ScaleControlValue): ScaleControl`

There are a few ways to setup the `ScaleControl` object.

**Pass no value.**

`G.scaleControl(): ScaleControl`

```js
const control = G.scaleControl();
control.enabled = true;
```

**Pass a boolean value to enable or disable the Scale control.**

`G.scaleControl(value: boolean): ScaleControl`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | boolean | Yes | Whether to enable the Scale control. |

If you pass a `false` value to the `scaleControl` method then that will disable and hide the Scale control when this is associated with a map.

Passing `true` will enable it and show the Scale control.

```js
const control = G.scaleControl(true);
```

**Pass an object of options.**

`G.scaleControl(options: ScaleControlOptions): ScaleControl`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [ScaleControlOptions](#scale-control-options) | Yes | The configuration options. |

```js
const scaleControl = G.scaleControl({
    enabled: true,
});
```

**Pass an existing ScaleControl object.**

`G.scaleControl(value: ScaleControl): ScaleControl`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | ScaleControl | Yes | The existing ScaleControl object. |

```js
const control = G.scaleControl(existingScaleControlObject);
```

## Scale Control options

Type `ScaleControlOptions`.

ScaleControlOptions is an object containing the configuration options for the ScaleControl object.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| enabled | boolean | false | Whether the Scale control is enabled and will display on the map. |

## Properties

| Property  | Type   | Description                             |
|-----------|--------|-----------------------------------------|
| enabled | boolean | Whether the Scale control is enabled and will display on the map. |

## Methods

### disable

`disable(): ScaleControl`

Disables and hides the Scale control.

```js
control.disable();
```

### enable

`enable(): ScaleControl`

Enables and shows the Scale control.

```js
control.enable();
```

### toGoogle

`toGoogle(): Promise<google.maps.ScaleControlOptions>`

Get the object to use to pass the ScaleControl options to the Google Map instance.

```js
control.toGoogle().then((options) => {
    // Do something with the options
});
```
