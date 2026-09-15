---
---

# MapTypeControl

The MapTypeControl object is used to configure the [Map Type control](https://developers.google.com/maps/documentation/javascript/controls) on the map.

You can change the position, the map types to use, and the display of the map type control.

[See the Map Controls guide page for more information](/guides/map/controls).

## Example usage

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

## Creating the MapTypeControl object

`G.mapTypeControl(options?: MapTypeControlValue): MapTypeControl`

There are a few ways to setup the `MapTypeControl` object.

**Pass no value.**

`G.mapTypeControl(): MapTypeControl`

```js
const control = G.mapTypeControl();
control.satellite = false;
control.position = G.ControlPosition.TOP_CENTER;
```

**Pass a boolean value to disable the Map Type control.**

`G.mapTypeControl(value: boolean): MapTypeControl`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | boolean | Yes | Whether to enable the Map Type control. |

If you pass a `false` value to the `mapTypeControl` method then that will disable and hide the Map Type control when this is associated with a map.

```js
const control = G.mapTypeControl(false);
```

**Pass an object of options.**

`G.mapTypeControl(options: MapTypeControlOptions): MapTypeControl`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [MapTypeControlOptions](#map-type-control-options) | Yes | The configuration options. |

```js
const mapTypeControl = G.mapTypeControl({
    mapTypeIds: [G.MapTypeId.ROADMAP, G.MapTypeId.TERRAIN],
    position: G.ControlPosition.TOP_CENTER,
    style: G.MapTypeControlStyle.DROPDOWN_MENU,
});
```

**Pass an existing MapTypeControl object.**

`G.mapTypeControl(value: MapTypeControl): MapTypeControl`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | MapTypeControl | Yes | The existing MapTypeControl object. |

```js
const control = G.mapTypeControl(existingMapTypeControlObject);
```

## Map Type Control options

Type `MapTypeControlOptions`.

MapTypeControlOptions is an object containing the configuration options for the MapTypeControl object.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| enabled | boolean | true | Whether the Map Type control is enabled and will display on the map. |
| mapTypeIds | [MapTypeId](/api-reference/constants#maptypeid)[] | [ROADMAP, SATELLITE, HYBRID, TERRAIN] | The map types to use. |
| position | [ControlPosition](/api-reference/constants#controlposition) | `BLOCK_START_INLINE_START` | The display position of the control. |
| style | [MapTypeControlStyle](/api-reference/constants#maptypecontrolstyle) | `DEFAULT` | The style of the control. |

## Properties

| Property  | Type   | Description                             |
|-----------|--------|-----------------------------------------|
| enabled | boolean | Whether the Map Type control is enabled and will display on the map. |
| hybrid | boolean | Whether the hybrid map type is used. |
| position | [ControlPosition](/api-reference/constants#controlposition) | The display position of the control. |
| roadmap | boolean | Whether the roadmap map type is used. |
| satellite | boolean | Whether the satellite map type is used. |
| style | [MapTypeControlStyle](/api-reference/constants#maptypecontrolstyle) | The style of the control. |
| terrain | boolean | Whether the terrain map type is used. |

The `hybrid`, `roadmap`, `satellite`, and `terrain` properties give you an alternate way to turn on and off individual map types.

```js
// Turn the roadmap map type off
control.roadmap = false;
```

## Methods

### disable

`disable(): MapTypeControl`

Disables and hides the Map Type control.

```js
control.disable();
```

### enable

`enable(): MapTypeControl`

Enables and shows the Map Type control.

```js
control.enable();
```

### hasMapType

`hasMapType(mapTypeId: MapTypeIdValue): boolean`

Returns whether the passed map type is one of the map types that are enabled for the Map Type control.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| mapTypeId | [MapTypeId](/api-reference/constants#maptypeid) | Yes | One of the map type ids to test. |

```js
if (control.hasMapType(G.MapTypeId.HYBRID)) {
    // Do something
}
```

### setMapTypeIds

`setMapTypeIds(mapTypeIds: MapTypeId[]): MapTypeControl`

Set the map type ids to include in the control. This replaces the existing map type ids and updates the `hybrid`, `roadmap`, `satellite`, and `terrain` properties to match.

Invalid map type ids are ignored. If none of the values are valid then the existing map type ids are kept.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| mapTypeIds | [MapTypeId](/api-reference/constants#maptypeid)[]| Yes | The map types to use. |

```js
control.setMapTypeIds([
    G.MapTypeId.HYBRID,
    G.MapTypeId.TERRAIN
]);
```

### setPosition

`setPosition(position: ControlPosition): MapTypeControl`

Set the display position of the control on the map.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| position | [ControlPosition](/api-reference/constants#controlposition) | Yes | The display position of the control. |

```js
control.setPosition(G.ControlPosition.BLOCK_END_INLINE_START)
```

### setStyle

`setStyle(style: MapTypeControlStyleValue): MapTypeControl`

Set the style of the control.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| style | [MapTypeControlStyle](/api-reference/constants#maptypecontrolstyle) | Yes | The style of the control. |

```js
control.setStyle(G.MapTypeControlStyle.DROPDOWN_MENU);
```

### toGoogle

`toGoogle(): Promise<google.maps.MapTypeControlOptions>`

Get the object to use to pass the MapTypeControl options to the Google Map instance.

```js
control.toGoogle().then((options) => {
    // Do something with the options
});
```
