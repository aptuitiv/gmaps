---
---

# StreetViewControl

The StreetViewControl object is used to configure the [Street View control](https://developers.google.com/maps/documentation/javascript/controls) on the map.

The StreetViewControl object lets you change the position and the sources of the Street View control.

[See the Map Controls guide page for more information](/guides/map/controls).

## Example usage

```js
const streetViewControl = G.streetViewControl({
    position: G.ControlPosition.LEFT_CENTER,
});

const map = G.map('map', {
    center: [40.7128, -74.0060],
    streetViewControl: streetViewControl,
});
```

## Creating the StreetViewControl object

`G.streetViewControl(options?: StreetViewControlValue): StreetViewControl`

There are a few ways to setup the `StreetViewControl` object.

**Pass no value.**

`G.streetViewControl(): StreetViewControl`

```js
const control = G.streetViewControl();
control.position = G.ControlPosition.LEFT_CENTER;
```

**Pass a boolean value to disable the Street View control.**

`G.streetViewControl(value: boolean): StreetViewControl`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | boolean | Yes | Whether to enable the Street View control. |

If you pass a `false` value to the `streetViewControl` method then that will disable and hide the Street View control when this is associated with a map.

```js
const control = G.streetViewControl(false);
```

**Pass an object of options.**

`G.streetViewControl(options: StreetViewControlOptions): StreetViewControl`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [StreetViewControlOptions](#street-view-control-options) | Yes | The configuration options. |

```js
const streetViewControl = G.streetViewControl({
    position: G.ControlPosition.LEFT_CENTER,
});
```

**Pass an existing StreetViewControl object.**

`G.streetViewControl(value: StreetViewControl): StreetViewControl`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | StreetViewControl | Yes | The existing StreetViewControl object. |

```js
const control = G.streetViewControl(existingStreetViewControlObject);
```

## Street View Control options

Type `StreetViewControlOptions`.

StreetViewControlOptions is an object containing the configuration options for the StreetViewControl object.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| enabled | boolean | true | Whether the Street View control is enabled and will display on the map. |
| position | [ControlPosition](/api-reference/constants#controlposition) | `INLINE_END_BLOCK_END` | The display position of the control. |
| sources | [StreetViewSource](/api-reference/constants#streetviewsource) \| [StreetViewSource](/api-reference/constants#streetviewsource)[] | `[StreetViewSource.DEFAULT]`| The sources for the street view. |

## Properties

| Property  | Type   | Description                             |
|-----------|--------|-----------------------------------------|
| enabled | boolean | Whether the Street View control is enabled and will display on the map. |
| position | [ControlPosition](/api-reference/constants#controlposition) | The display position of the control. |
| sources | [StreetViewSource](/api-reference/constants#streetviewsource)[] | The sources for the street view. |

## Methods

### disable

`disable(): StreetViewControl`

Disables and hides the Street View control.

```js
control.disable();
```

### enable

`enable(): StreetViewControl`

Enables and shows the Street View control.

```js
control.enable();
```

### setPosition

`setPosition(position: ControlPosition): StreetViewControl`

Set the display position of the control on the map.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| position | [ControlPosition](/api-reference/constants#controlposition) | Yes | The display position of the control. |

```js
control.setPosition(G.ControlPosition.BLOCK_END_INLINE_START)
```

### setSources

`setSources(sources: StreetViewSourceValue | StreetViewSourceValue[]): StreetViewControl`

Set the sources for the street view control. A single source is converted to an array.

Invalid sources are ignored. If none of the values are valid then the existing sources are kept and a warning is logged to the console.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| sources | [StreetViewSource](/api-reference/constants#streetviewsource) \| [StreetViewSource](/api-reference/constants#streetviewsource)[] | Yes | The sources of the control. |

```js
// The following are equivalent
control.setSources(G.StreetViewSource.GOOGLE);
control.setSources([G.StreetViewSource.GOOGLE]);
```

### toGoogle

`toGoogle(): Promise<google.maps.StreetViewControlOptions>`

Get the object to use to pass the StreetViewControl options to the Google Map instance.

```js
control.toGoogle().then((options) => {
    // Do something with the options
});
```
