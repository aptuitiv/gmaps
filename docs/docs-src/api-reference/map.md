---
---

# Map

The Map object is used to display the Google map.

`Map` extends [Evented](/api-reference/base-classes/evented).

## Example usage

See the [Display the map](/guides/map/display) tutorial page for more information.

```html
<div id="map"></div>
<script>
    const map = G.map('map', { center: [40.7128, -74.0060] });
    map.show();
</script>
```

## Creating the Map object

`G.map(selector: string|HTMLElement, options?: MapOptions): Map`

There are a few ways to setup the `Map` object.

**Only set the selector.**

`G.map(selector: string|HTMLElement)`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| selector | A string or an HTML element | Yes | The HTMLElement to display the map in, or any valid selector for `document.querySelector`. |

In this case you should either use [setOptions](#setoptions), one of the other `set...` methods to set the configuration.

```js
const map = G.map('#mapSelector');
map.setOptions({ center: [40.7128, -74.0060] });
```

**Pass the selector and the map options.**

`G.map(selector: string|HTMLElement, options: MapOptions)`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| selector | A string or an HTML element | Yes | The HTMLElement to display the map in, or any valid selector for `document.querySelector`. |
| options | [MapOptions](#map-options) | Yes | The configuration options. |

```js
const map = G.map('.myMapSelector', {apiKey: 'my-api-key', libraries: 'places'});
```

## Map selector

The map selector parameter can be one of the following two values:

- The HTML element to display the map in.
- A string CSS selector for the HTML element to display the map in. Any valid selector for `document.querySelector` can be used.

**The HTML element to display the map in.**

```html
<div class="myMap" style="aspect-ratio: 3/2"></div>

<script>
    const mapEl = document.querySelector('.myMap');
    const map = G.map(mapEl);
</script>
```

**The id selector for the HTML element to display the map in.**

```html
<div id="map" style="aspect-ratio: 3/2"></div>

<script>
    const map = G.map('#map');
</script>
```

**The class selector for the HTML element to display the map in.**

```html
<div class="mapElement" style="aspect-ratio: 3/2"></div>

<script>
    const map = G.map('.mapElement');
</script>
```

## Map options

Type `MapOptions`.

MapOptions is an object containing the configuration options for the Map object.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| apiKey | string |  | The Google Maps API key. Only pass this if you're not using [G.loader](/api-reference/loader). |
| backgroundColor | string | | The background color of the map. This can be any valid CSS color value. The color will be visible when the tiiles have not yet loaded as the user pans. This option can only be set when the map is initialized. [Details](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.backgroundColor) |
| center | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) | [0, 0] | The center point for the map. |
| clickableIcons | boolean | true | Whether the map icons are clickable or not. [Details](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.clickableIcons) |
| colorScheme | string | | The initial Map color scheme. This option can only be set when the map is initialized. [Details](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.colorScheme) |
| controlSize | number | | The size in pixels of the controls on the map that are made by the Maps JavaScript API. This does not apply to custom controls. This can only be set when the map is initialized. [Details](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.controlSize) |
| disableDefaultUI | boolean | false | Whether to disable the default UI. [Details](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.disableDefaultUI) |
| draggableCursor | string |  | The name or url of the cursor to display when mousing over a draggable map. [Details](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.draggableCursor) |
| draggingCursor | string |  | The name or url of the cursor to display when the map is being dragged. [Details](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.draggingCursor) |
| fullscreenControl | boolean \| [FullscreenControl](/api-reference/map-controls/fullscreen-control) | true | Whether to display the [Fullscreen control](https://developers.google.com/maps/documentation/javascript/controls) on the map, or the FullscreenControl object to configure the Fullscreen control. |
| gestureHandling | string | | This controls how the API handles gestures on the map. [Details](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.gestureHandling) |
| heading | number | | Sets the heading for aerial imagery in degrees measured clockwise from cardinal direction North. [Details](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.heading) |
| headingInteractionEnabled | boolean | false | Whether the map should allow user control of the camera heading (rotation). [Details](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.headingInteractionEnabled) |
| hideBusinesses | boolean | false | Whether to hide businesses, like stores, restaurants, and hotels. This hides the `poi.business` feature type. Has no effect if `mapId` is set. See [hideBusinesses](#hidebusinesses). |
| hidePointsOfInterest | boolean | false | Whether to hide all points of interest, like businesses, parks, schools, and attractions. This hides the `poi` feature type. Has no effect if `mapId` is set. See [hidePointsOfInterest](#hidepointsofinterest). |
| hideTransit | boolean | false | Whether to hide transit lines and stations, like bus stops, train stations, and rail lines. This hides the `transit` feature type. Has no effect if `mapId` is set. See [hideTransit](#hidetransit). |
| isFractionalZoomEnabled | boolean | | Whether the map should allow fractional zoom levels. [Details](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.isFractionalZoomEnabled) |
| keyboardShortcuts | boolean | true | Whether to allow the map to be controlled by the keyboard. [Details](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.keyboardShortcuts) |
| lat    | number \| string | | The latitude for the map center point. This is an alternate option to `center` and `latitude`. If you set this then you must also set `lng` or `longitude`. |
| latitude | number \| string | | The latitude for the map center point. This is an alternate option to `center` and `lat`. If you set this then you must also set `lng` or `longitude`. |
| libraries | Array \| string |  | An array of [Google Maps libraries](https://developers.google.com/maps/documentation/javascript/libraries#libraries-for-dynamic-library-import) to load. You can also pass a single string value for one library. Only pass this if you're not using [G.loader](/api-reference/loader). |
| lng    | number \| string | | The longitude for the map center point. This is an alternate option to `center` and `longitude`. If you set this then you must also set `lat` or `latitude`. |
| longitude | number \| string | | The longitude for the map center point. This is an alternate option to `center` and `lng`. If you set this then you must also set `lat` or `latitude`. |
| mapId | string | | The [Google Maps map id](https://developers.google.com/maps/documentation/get-map-id). |
| mapTypeControl | boolean \| [MapTypeControl](/api-reference/map-controls/map-type-control) | true | Whether to display the [Map Type control](https://developers.google.com/maps/documentation/javascript/controls) on the map, or the MapTypeControl object to configure the Map Type control. |
| mapTypeId | string \| [MapTypeId](/api-reference/constants#maptypeid) | MapTypeId.ROADMAP | The map type id to use for the map. |
| maxFitBoundsZoom | number \| null | | The maximum zoom level to use when fitting the map to a set of bounds. |
| maxZoom | number \| null | | The maximum zoom level for the map. |
| minFitBoundsZoom | number \| null | | The minimum zoom level to use when fitting the map to a set of bounds. |
| minZoom | number \| null | | The minimum zoom level for the map. |
| noClear | boolean | false | Whether to clear the contents of the map div. If true, then the map div contents will not be cleared. [Details](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.noClear) |
| renderingType | [G.RenderingType](/api-reference/constants#renderingtype) | G.RenderingType.RASTER | The rendering type for the map. This sets if it should be a raster or vector map. |
| restriction | [MapRestrictionValue](/api-reference/map-configuration/map-restriction#maprestriction-value-type) | | The boundry to restrict the map to. When set the user can only pan and zoom within this latitude/longitude bounds. |
| rotateControl | boolean \| [RotateControl](/api-reference/map-controls/rotate-control) | true | Whether to display the [Rotate control](https://developers.google.com/maps/documentation/javascript/controls) on the map, or the RotateControl object to configure the Rotate control. |
| scaleControl | boolean \| [ScaleControl](/api-reference/map-controls/scale-control) | true | Whether to display the [Scale control](https://developers.google.com/maps/documentation/javascript/controls) on the map, or the ScaleControl object to configure the Scale control. |
| scrollwheel | boolean | true | Whether to enable or disable zooming with the mouse scroll wheel. [Details](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.scrollwheel) |
| streetView | [StreetViewPanorama](https://developers.google.com/maps/documentation/javascript/reference/street-view#StreetViewPanorama) | | A StreetViewPanorama to display when the Street View pegman is dropped on the map. [Details](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.streetView) |
| streetViewControl | boolean \| [StreetViewControl](/api-reference/map-controls/street-view-control) | true | Whether to display the [Street View control](https://developers.google.com/maps/documentation/javascript/controls) on the map, or the StreetViewControl object to configure the Street View control. |
| styles | [MapStyle](/api-reference/map-configuration/map-style) \| [MapStyleValue](/api-reference/map-configuration/map-style#mapstyle-value-type)[] | | The styles to apply to the map types. This allows you to style elements like roads or points of interest. Pass a single MapStyle object or an array of style rules. Ignored by Google if `mapId` is set. See the [Style the map guide](/guides/map/styles). |
| tilt | number | | For vector maps, this sets the angle of incidence of the map. [Details](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.tilt) |
| tiltInteractionEnabled | boolean | | Whether the map should allow user control of the camera tilt. [Details](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.tiltInteractionEnabled) |
| version | string | weekly | The [version](https://developers.google.com/maps/documentation/javascript/versions) of the Google Maps library to load. Only pass this if you're not using [G.loader](/api-reference/loader). |
| zoom | number \| string | 6 | The initial zoom level for the map. |
| zoomControl | boolean \| [ZoomControl](/api-reference/map-controls/zoom-control) | true | Whether to display the [Zoom control](https://developers.google.com/maps/documentation/javascript/controls) on the map, or the ZoomControl object to configure the Zoom control. |

## Locate options

Type `LocateOptions`.

These are the options for the [locate](#locate) method.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| enableHighAccuracy | boolean | false | Indicates if the application would like to receive the best possible results. If true and if the device is able to provide a more accurate position, it will do so. This can result in slower response times or increased power consumption on a mobile device. If false then the device can save resources by responding more quickly. |
| maximumAge | number | 0 | The maximum age in milliseconds of a possible cached position that is acceptable to return. If set to 0, it means that the device cannot use a cached position and must attempt to retrieve the real current position. If set to Infinity the device must return a cached position regardless of its age. |
| timeout | number | Infinity | The maximum time in milliseconds the device is allowed to take in order to return a position. |
| watch | boolean | true | Whether to use watchPosition to track the user's location. If set to false, the user's location will only be retrieved once. |

## Locate position data

Type `LocationPosition`.

This is the object data returned from the Geolocation API and sent to the 'locationfound' event. It's also passed to the `onSuccess` callback for [locate](#locate). That callback has the type `LocationOnSuccess`, which is `(position: LocationPosition) => void`.

The values come from [GeolocationPosition](https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPosition) and [GeolocationCoordinates](https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates).

The only guaranteed values are `latitude`, `longitude`, `latLng`, and `timestamp`. Test for other values before using them.

| Value | Type | Description |
|-------|------|-------------|
| accuracy | number | The accuracy of the latitude and longitude values, expressed in meters. |
| altitude | number | The position's altitude in meters. |
| altitudeAccuracy | number | The accuracy of the altitude expressed in meters. |
| heading | number | The direction in which the device is facing. |
| latitude | number | The user's latitude. |
| latLng | [LatLng](/api-reference/utilities/latlng) | A LatLng value holding the user's latitude and longitude. |
| longitude | number | The user's longitude. |
| speed | number | The velocity that the device is moving, expressed in meters per second. |
| timestamp | number | The timestamp in milliseconds representing when the location was retrieved. |

## MapType type

Type `MapType`.

A TypeScript type for the basic Google map types. It's one of `'hybrid'`, `'roadmap'`, `'satellite'`, or `'terrain'`. It's based on `google.maps.MapTypeId`. Use the [MapTypeId](/api-reference/constants#maptypeid) constants for the `mapTypeId` option.

## Events

All of the [Google Map events](https://developers.google.com/maps/documentation/javascript/reference/map#Map.bounds_changed) can used. Below are the map events specific to this library.

You can use the plain text name for the event, or you can use the [event constant](/api-reference/constants#mapevents).

| Event    | Description |
|----------|-------------|
| locationerror | There was an error getting the user's location. The event includes the error `code` and `message` from the [GeolocationPositionError](https://developer.mozilla.org/en-US/docs/Web/API/GeolocationPositionError). |
| locationfound | The user's location has been found. The event includes the [location position data](#locate-position-data). |
| ready | The map is loaded, visible, and ready for use. |

## Properties

| Property  | Type   | Description                                   |
|-----------|--------|-----------------------------------------------|
| center  | [LatLng](/api-reference/utilities/latlng) | The latitude and longitude center of the map. When setting, any [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) can be used. |
| data | [DataLayer](/api-reference/data-layer) | The map's own data layer. Read only. |
| disableDefaultUI | boolean | Whether to disable the default UI. [Details](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.disableDefaultUI) |
| fullscreenControl | boolean \| [FullscreenControl](/api-reference/map-controls/fullscreen-control) | Whether to display the [Fullscreen control](https://developers.google.com/maps/documentation/javascript/controls) on the map, or the FullscreenControl object to configure the Fullscreen control. |
| hideBusinesses | boolean | Whether businesses are hidden on the map. |
| hidePointsOfInterest | boolean | Whether all points of interest are hidden on the map. |
| hideTransit | boolean | Whether transit lines and stations are hidden on the map. |
| latitude | number | The latitude value for the center point. When setting, the value can be a number or a string. |
| longitude | number | The longitude value for the center point. When setting, the value can be a number or a string. |
| mapTypeControl | boolean \| [MapTypeControl](/api-reference/map-controls/map-type-control) | Whether to display the [Map Type control](https://developers.google.com/maps/documentation/javascript/controls) on the map, or the MapTypeControl object to configure the Map Type control. |
| mapTypeId | string \| [MapTypeId](/api-reference/constants#maptypeid) | The map type id to use for the map. |
| maxFitBoundsZoom | number \| null | The maximum zoom level to use when fitting the map to a set of bounds. |
| maxZoom | number \| null | The maximum zoom level for the map. |
| minFitBoundsZoom | number \| null | The minimum zoom level to use when fitting the map to a set of bounds. |
| minZoom | number \| null | The minimum zoom level for the map. |
| restriction | [MapRestriction](/api-reference/map-configuration/map-restriction) \| undefined | The boundry to restrict the map to. When set the user can only pan and zoom within this latitude/longitude bounds. When setting, any [MapRestrictionValue](/api-reference/map-configuration/map-restriction#maprestriction-value-type) can be used. |
| rotateControl | boolean \| [RotateControl](/api-reference/map-controls/rotate-control) | Whether to display the [Rotate control](https://developers.google.com/maps/documentation/javascript/controls) on the map, or the RotateControl object to configure the Rotate control. |
| scaleControl | boolean \| [ScaleControl](/api-reference/map-controls/scale-control) | Whether to display the [Scale control](https://developers.google.com/maps/documentation/javascript/controls) on the map, or the ScaleControl object to configure the Scale control. |
| streetViewControl | boolean \| [StreetViewControl](/api-reference/map-controls/street-view-control) | Whether to display the [Street View control](https://developers.google.com/maps/documentation/javascript/controls) on the map, or the StreetViewControl object to configure the Street View control. |
| zoom  | number | The zoom level of the map. When setting, the value can be a number or a string. |
| zoomControl | boolean \| [ZoomControl](/api-reference/map-controls/zoom-control) | Whether to display the [Zoom control](https://developers.google.com/maps/documentation/javascript/controls) on the map, or the ZoomControl object to configure the Zoom control. |

### center

Get and set the center point of the map. The value returned is the same as [getCenter](#getcenter);

```js
// Get the center point. A LatLng value is returned.
const center = map.center;
```

```js
// Set the center point as a lat/lng object
map.center = {lat: 48.86, lng: 2.35}
// Set the center point as a LatLng object
map.center = G.latLng(48.86, 2.35);
```

### data

Get the map's own [data layer](/api-reference/data-layer). Every map has one.

The layer is created the first time that you use this and you get the same object back every time after that.

```js
map.data.setStyle({ fillColor: '#4caf50' });
map.data.addPolygon(path);
```

Because Google gives each map one shared data layer, everything that uses `map.data` puts its features in the same place. See [The map's data layer is shared](/guides/data-layer/shared-map-layer) for when that matters and how to use a layer of your own instead.

### disableDefaultUI

Get and set whether to disable the default UI. [Details](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions.disableDefaultUI).

```js
// Get whether the default UI is disabled
const isDisabled = map.disableDefaultUI;
```

```js
// Disable the default UI
map.disableDefaultUI = true;

// Enable the default UI
map.disableDefaultUI = false;
```

### fullscreenControl

Get the [FullscreenControl](/api-reference/map-controls/fullscreen-control) configuration, or set whether to display the [Fullscreen control](https://developers.google.com/maps/documentation/javascript/controls) on the map, or set the [FullscreenControl](/api-reference/map-controls/fullscreen-control) configuration.

```js
// Get the current FullscreenControl configuration
const control = map.fullscreenControl;
```

```js
// Disable the fullscreen control
map.fullscreenControl = false;
```

```js
// Set the fullscreen control configuration with a FullscreenControl object
map.fullscreenControl = G.fullscreenControl({
    position: G.ControlPosition.LEFT_CENTER,
});
```

### hideBusinesses

Get and set whether businesses are hidden on the map. This hides the `poi.business` [feature type](https://developers.google.com/maps/documentation/javascript/style-reference#style-features), which includes things like stores, restaurants, and hotels. Other points of interest, like parks and schools, are still shown.

This can be set before or after the map has been displayed. If the map is already displayed then it's updated right away.

```js
// Get whether businesses are hidden
const hidden = map.hideBusinesses;
```

```js
// Hide businesses
map.hideBusinesses = true;

// Show businesses again
map.hideBusinesses = false;
```

:::note
This works by adding a map style, so it has no effect when the map has a `mapId`. See the [Style the map guide](/guides/map/styles#hide-businesses-points-of-interest-or-transit).
:::

### hidePointsOfInterest

Get and set whether all points of interest are hidden on the map. This hides the `poi` [feature type](https://developers.google.com/maps/documentation/javascript/style-reference#style-features), which includes businesses, parks, schools, attractions, and places of worship.

Because businesses are a type of point of interest, they stay hidden while this is `true`, even if [hideBusinesses](#hidebusinesses) is `false`.

This can be set before or after the map has been displayed. If the map is already displayed then it's updated right away.

```js
// Get whether points of interest are hidden
const hidden = map.hidePointsOfInterest;
```

```js
// Hide all points of interest
map.hidePointsOfInterest = true;

// Show points of interest again
map.hidePointsOfInterest = false;
```

:::note
This works by adding a map style, so it has no effect when the map has a `mapId`. See the [Style the map guide](/guides/map/styles#hide-businesses-points-of-interest-or-transit).
:::

### hideTransit

Get and set whether transit lines and stations are hidden on the map. This hides the `transit` [feature type](https://developers.google.com/maps/documentation/javascript/style-reference#style-features), which includes things like bus stops, train stations, and rail lines.

This can be set before or after the map has been displayed. If the map is already displayed then it's updated right away.

```js
// Get whether transit is hidden
const hidden = map.hideTransit;
```

```js
// Hide transit lines and stations
map.hideTransit = true;

// Show transit again
map.hideTransit = false;
```

:::note
This works by adding a map style, so it has no effect when the map has a `mapId`. See the [Style the map guide](/guides/map/styles#hide-businesses-points-of-interest-or-transit).
:::

### latitude

Get and set the latitude part of the center point. This allows you to update the center point when you only need to update the latitude value.

```js
// A number is returned
const latitude = map.latitude;
```

```js
// When setting, the value can be a number or a string
map.latitude = 48.86;
map.latitude = '48.86';
```

### longitude

Get and set the longitude part of the center point. This allows you to update the center point when you only need to update the longitude value.

```js
// A number is returned
const longitude = map.longitude;
```

```js
// When setting, the value can be a number or a string
map.longitude = 2.35;
map.longitude = '2.35';
```

### mapTypeControl

Get the [MapTypeControl](/api-reference/map-controls/map-type-control) configuration, or set whether to display the [Map Type control](https://developers.google.com/maps/documentation/javascript/controls) on the map, or set the [MapTypeControl](/api-reference/map-controls/map-type-control) configuration.

```js
// Get the MapTypeControl object
const control = map.mapTypeControl;
```

```js
// Disable the map type control
map.mapTypeControl = false;
```

```js
// Set the map type control configuration with a MapTypeControl object
map.mapTypeControl = G.mapTypeControl({
    mapTypeIds: [G.MapTypeId.ROADMAP, G.MapTypeId.TERRAIN],
    position: G.ControlPosition.LEFT_CENTER,
    style: G.MapTypeControlStyle.DROPDOWN_MENU,
});
```

### maxFitBoundsZoom

Get and set the maximum zoom level when fitting the map to a set of bounds. This allows you to not have to pass a maximum zoom value to the [fitBounds](#fitbounds) method. If it's not set, or set to `null` then `maxZoom` will be used when fitting to bounds. If both `maxFitBoundsZoom` and `maxZoom` are not set then you will want to pass a maximum zoom value to `fitBounds`. Valid zoom values are numbers from zero up to the supported [maximum zoom level](https://developers.google.com/maps/documentation/javascript/maxzoom).

:::info
Zoom levels go from 0, the most zoomed out, to 22, the most zoomed in.
:::

A higher zoom number means that the map will be more zoomed in.

A lower zoom number means that the map will be more zoomed out.

```js
const maxFitBoundsZoom = map.maxFitBoundsZoom;
```

```js
map.maxFitBoundsZoom = 12;
```

### maxZoom

Get and set the maximum zoom level on the map. If it's set to `null` then the maximum zoom from the current map type is used instead. Valid zoom values are numbers from zero up to the supported [maximum zoom level](https://developers.google.com/maps/documentation/javascript/maxzoom).

:::info
Zoom levels go from 0, the most zoomed out, to 22, the most zoomed in.
:::

A higher zoom number means that the map will be more zoomed in.

A lower zoom number means that the map will be more zoomed out.

```js
const maxZoom = map.maxZoom;
```

```js
map.maxZoom = 12;
```

### minFitBoundsZoom

Get and set the minimum zoom level when fitting the map to a set of bounds. This allows you to not have to pass a minimum zoom value to the [fitBounds](#fitbounds) method. If it's not set, or set to `null` then `minZoom` will be used when fitting to bounds. If both `minFitBoundsZoom` and `minZoom` are not set then you may want to pass a minimum zoom value to `fitBounds`. Valid zoom values are numbers from zero up to the supported [maximum zoom level](https://developers.google.com/maps/documentation/javascript/maxzoom).

:::info
Zoom levels go from 0, the most zoomed out, to 22, the most zoomed in.
:::

A higher zoom number means that the map will be more zoomed in.

A lower zoom number means that the map will be more zoomed out.

```js
const minFitBoundsZoom = map.minFitBoundsZoom;
```

```js
map.minFitBoundsZoom = 12;
```

### minZoom

Get and set the minimum zoom level on the map. If it's set to `null` then the minimum zoom from the current map type is used instead. Valid zoom values are numbers from zero up to the supported [maximum zoom level](https://developers.google.com/maps/documentation/javascript/maxzoom).

:::info
Zoom levels go from 0, the most zoomed out, to 22, the most zoomed in.
:::

A higher zoom number means that the map will be more zoomed in.

A lower zoom number means that the map will be more zoomed out.

```js
const minZoom = map.minZoom;
```

```js
map.minZoom = 12;
```

### restriction

Get and set the bounds restriction on the map.

Get the bounds restriction value. If the `restriction` value has been set then a [MapRestriction](/api-reference/map-configuration/map-restriction) object will be returned.

```js
// Get the MapRestriction restriction object if it's set
const restriction = map.restriction;
```

Set the bounds restriction value.

```js
map.restriction = G.mapRestriction({
    latLngBounds: [
        [40.712, -74.227],
        [40.774, -74.125]
    ],
    strictBounds: true
});
```

### rotateControl

Get the [RotateControl](/api-reference/map-controls/rotate-control) configuration, or set whether to display the [Rotate control](https://developers.google.com/maps/documentation/javascript/controls) on the map, or set the [RotateControl](/api-reference/map-controls/rotate-control) configuration.

```js
// Get the current RotateControl configuration
const control = map.rotateControl;
```

```js
// Disable the rotate control
map.rotateControl = false;
```

```js
// Set the rotate control configuration with a RotateControl object
map.rotateControl = G.rotateControl({
    position: G.ControlPosition.LEFT_CENTER,
});
```

### scaleControl

Get the [ScaleControl](/api-reference/map-controls/scale-control) configuration, or set whether to display the [Scale control](https://developers.google.com/maps/documentation/javascript/controls) on the map, or set the [ScaleControl](/api-reference/map-controls/scale-control) configuration.

```js
// Get the current ScaleControl configuration
const control = map.scaleControl;
```

```js
// Enable the scale control
map.scaleControl = true;
```

```js
// Set the scale control configuration with a ScaleControl object
map.scaleControl = G.scaleControl({
    enabled: true
});
```

### streetViewControl

Get the [StreetViewControl](/api-reference/map-controls/street-view-control) configuration, or set whether to display the [Street View control](https://developers.google.com/maps/documentation/javascript/controls) on the map, or set the [StreetViewControl](/api-reference/map-controls/street-view-control) configuration.

```js
// Get the current StreetViewControl configuration
const control = map.streetViewControl;
```

```js
// Enable the street view control
map.streetViewControl = true;
```

```js
// Set the street view control configuration with a StreetViewControl object
map.streetViewControl = G.streetViewControl({
    enabled: true,
    position: G.ControlPosition.LEFT_CENTER
});
```

### zoom

Get and set the zoom level on the map.

:::info
Zoom levels go from 0, the most zoomed out, to 22, the most zoomed in.
:::

```js
const zoom = map.zoom;
```

```js
// When setting, the value can be a number or a string
map.zoom = 11;
map.zoom = '11';
```

### zoomControl

Get the [ZoomControl](/api-reference/map-controls/zoom-control) configuration, or set whether to display the [Zoom control](https://developers.google.com/maps/documentation/javascript/controls) on the map, or set the [ZoomControl](/api-reference/map-controls/zoom-control) configuration.

```js
// Get the current ZoomControl configuration
const control = map.zoomControl;
```

```js
// Disable the zoom control
map.zoomControl = false;
```

```js
// Set the zoom control configuration with a ZoomControl object
map.zoomControl = G.zoomControl({
    position: G.ControlPosition.LEFT_CENTER,
});
```

## Methods

- Methods inherited from [Evented](/api-reference/base-classes/evented#methods).
- Methods inherited from [Base](/api-reference/base-classes/base#methods)

### addCustomControl

`addCustomControl(position: ControlPositionValue, element: HTMLElement): Map`

Add a custom control to the map. Custom controls are often buttons that do something when clicked. For example, you could have a button that toggles the display of something on the map.

The custom control is positioned on the map with the [ControlPosition values](/api-reference/constants#controlposition).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| position | [ControlPosition](/api-reference/constants#controlposition)  | Yes | The position on the map to display the control. |
| element | [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) | Yes | The HTML element for the custom control. This is often a `div` or `button`. |

```js
const customBtn = document.createElement('button');
customBtn.textContent = 'Custom Control';
customBtn.className = 'myCustomBtn';
customBtn.addEventListener('click', () => {
    console.log('Custom Control clicked');
});
map.addCustomControl(G.ControlPosition.BLOCK_START_INLINE_CENTER, customBtn);
```

### addGeoJson

`addGeoJson(geoJson: object, options?: LoadOptions): Promise<DataFeature[]>`

Add a GeoJson object to the map's [data layer](/api-reference/data-layer). This is a shortcut for [`map.data.addGeoJson()`](/api-reference/data-layer#addgeojson).

Resolves with the [DataFeature](/api-reference/data-feature) objects that were added.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| geoJson | object | Yes | The GeoJson object to add. |
| options | [LoadOptions](/api-reference/data-layer#load-options) |  | The options for adding the data. |

```js
const features = await map.addGeoJson(geoJson);
```

### addToBounds

`addToBounds(value: LatLngValue | LatLngValue[]): Map`

Adds a latitude/longitude value to the internal map bounds object. This is an alternate way to set up map bounds instead of using a separate [LatLngBounds object](/api-reference/utilities/latlng-bounds).

Once you've added at least one value to the bounds you can call the [fitBounds](#fitbounds) method with no parameter. That will tell the map object to use the internal bounds value.

This does the same as the [extend](/api-reference/utilities/latlng-bounds#extend) method in the [LatLngBounds](/api-reference/utilities/latlng-bounds) object except that it does it on an internal LatLngBounds object in the map object.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| latLngValue | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) or array of LatLngValue values  | Yes | The latitude and longitude value(s). |

```js
map.addToBounds([40.712, -74.227]);
```

You can pass the `LatLngValue` in a few ways.

Pass a single LatLng value:

```js
map.addToBounds(latLngObject);
map.addToBounds([40.712, -74.227]);
map.addToBounds({lat: 40.712, lng: -74.227});
map.addToBounds({latitude: 40.712, longitude: -74.227});
```

Pass an array of LatLng values:

```js
map.addToBounds([
    latLngObject, 
    latLngObject2
]);
map.addToBounds([
    [40.712, -74.227], 
    [40.774, -74.125]
]);
map.addToBounds([
    {lat: 40.712, lng: -74.227}, 
    {lat: 40.774, lng:  -74.125}
]);
map.addToBounds([
    {latitude: 40.712, longitude: -74.227},
    {latitude: 40.774, longitude:  -74.125}
]);
```

### attachInfoWindow

`attachInfoWindow(infoWindowValue: InfoWindowValue, event?: string): InfoWindow`

Attach an [InfoWindow](/api-reference/infowindow) to the map. This makes it easy to have an InfoWindow show when the map is clicked.

| Parameter | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| infoWindowValue | [InfoWindowValue](/api-reference/infowindow#infowindow-type) | | Yes | The InfoWindow, InfoWindow options, or content for the InfoWindow |
| event | string  | 'click' | | The event to trigger displaying the InfoWindow. |

Allowed `event` values include:

- `click` - Toggle the display of the InfoWindow when clicking on the map.
- `clickon` - Show the InfoWindow when clicking on the map. It will always be shown and can't be hidden once the map is clicked. This may be useful if you want to show a popup each time you click on the map.
- `hover` - Show the InfoWindow when hovering over the map. Hide the InfoWindow when the map is no longer hovered.

```js
map.attachInfoWindow('My content for the info window');
```

### attachPopup

`attachPopup(popupValue: AttachPopupValue, event?: string): Popup`

Attach a [popup](/api-reference/popup) to the map. This makes it easy to have a popup show when the map is clicked.

| Parameter | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| popupValue | [PopupValue](/api-reference/popup#popup-type) or [PopupCallback](/api-reference/popup#popup-callback-type) | | Yes | The Popup, Popup options, or content for the Popup, or a function that returns one of those. |
| event | string  | 'click' | | The event to trigger displaying the popup. |

Allowed `event` values include:

- `click` - Toggle the display of the popup when clicking on the map.
- `clickon` - Show the popup when clicking on the map. It will always be shown and can't be hidden once the map is clicked. This may be useful if you want to show a popup each time you click on the map.
- `hover` - Show the popup when hovering over the map. Hide the popup when the map is no longer hovered.

```js
map.attachPopup('My content for the popup', 'clickon');
```

Pass a function to work out the popup when it's shown rather than up front. It's called with the map and can return the content, a [PopupOptions](/api-reference/popup#popup-options) object, or a [Popup](/api-reference/popup) object to show instead. See [PopupCallback](/api-reference/popup#popup-callback-type).

```js
map.attachPopup((map) => `The zoom level is ${map.getZoom()}`, 'clickon');
```

### attachTooltip

`attachTooltip(tooltipValue: AttachTooltipValue, event?: string): Tooltip`

Attach a [Tooltip](/api-reference/tooltip) to the map. This makes it easy to show a tooltip when the map is hovered or clicked.

| Parameter | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| tooltipValue | [TooltipValue](/api-reference/tooltip#tooltipvalue-type) or [TooltipCallback](/api-reference/tooltip#tooltip-callback-type) | | Yes | The tooltip value, or a function that returns one. |
| event | string | 'hover' | | The event to trigger the tooltip. |

Allowed `event` values include:

- `click` - Toggle the display of the tooltip when clicking on the map.
- `clickon` - Show the tooltip when clicking on the map. It will always be shown and can't be hidden once the map is clicked. This may be useful if you want to show a tooltip each time you click on the map.
- `hover` - Show the tooltip when hovering over the map. Hide the tooltip when the map is no longer hovered.

This is an alternate way to set a tooltip on a map compared to the [Tooltip attachTo() method](/api-reference/tooltip#attachto).

```js
map.attachTooltip({
    className: 'MapTooltip',
    content: 'Map tooltip here' 
});
```

```js
map.attachTooltip({
    className: 'MapTooltip',
    content: 'Shown when map is clicked' 
}, 'clickon');
```

Pass a function to work out the tooltip when it's shown rather than up front. It's called with the map. See [TooltipCallback](/api-reference/tooltip#tooltip-callback-type).

```js
map.attachTooltip((map) => `The zoom level is ${map.getZoom()}`);
```

### clearBounds

`clearBounds(): Map`

Clear the existing bounds. Internally this just replaces the internal bounds object with a new one. It does not change anything on the Google Maps object.

```js
map.clearBounds();
```

### display

`display(callback?: () => void): Promise<Map>`

Display the map. Alias to [show()](#show).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function |  | A function to call after the map is displayed. |

```js
map.display();
```

### doDisableDefaultUI

`doDisableDefaultUI(): Map`

Disable the default UI.

```js
map.doDisableDefaultUI();
```

### enableDefaultUI

`enableDefaultUI(): Map`

Enable the default UI.

```js
map.enableDefaultUI();
```

### fitBounds

`fitBounds(bounds?: LatLngBoundsValue, maxZoom?: number, minZoom?: number): Promise<Map>`

Sets the viewport to contain the given bounds.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| bounds | [LatLngBoundsValue](/api-reference/utilities/latlng-bounds#latlngbounds-value-type) |  | The bounds to fit the map to. |
| maxZoom | number | | The maximum zoom level to zoom to when fitting the bounds. Higher numbers will zoom in more. |
| minZoom | number | | The minimum zoom level to zoom to when fitting the bounds. Lower numbers will zoom out more. |

:::tip
If you are having an issue where the map tiles aren't loading after calling `fitBounds()` then try these options:

Call `fitBounds()` after the map has been displayed.

```js
map.show(() => {
    map.fitBounds();
});
```

Add a brief timeout with `setTimeout` before calling `fitBounds`.

```js
map.show(() => {
    setTimeout(() => {
        map.fitBounds();
    }, 100);
});
```

:::

If the bounds value is not set then the internal map bounds data will be used. The internal map bounds data is setup with [addToBounds](#addtobounds).

The bounds parameter can be:

**A [LatLngBounds](/api-reference/utilities/latlng-bounds) object.**

```js
map.fitBounds(latLngBoundsObject);
```

**An array of [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) values.**

```js
map.fitBounds([
    [51.5074, -0.1278], 
    [50.024, -1.324]
]);
```

```js
map.fitBounds([
    {lat: 51.5074, lng: -0.1278}, 
    {lat: 50.024, lng: -1.324}
]);
```

```js
map.fitBounds([
    latLngObject1, 
    latLngObject2
]);
```

**A [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) value.**

This isn't that useful because it only sets one point. But, it's supported.

```js
map.fitBounds([51.5074, -0.1278]);
```

```js
map.fitBounds({lat: 51.5074, lng: -0.1278});
```

```js
map.fitBounds(latLngObject);
```

You can also set the maximum zoom level.

```js
map.fitBounds(latLngObject, 16);
```

**No value.**

If you set up one or more latitude/longitude values with [addToBounds](#addtobounds) then you can call `fitBounds()` with no parameter. This will tell the map object to use the internal bounds value.

```js
map.addToBounds([40.712, -74.227]);
map.addToBounds([41.324, -74.952]);
map.fitBounds();
// Or set the maxiumum zoom level
map.fitBounds(null, 15);
```

### fitToBounds

`fitToBounds(bounds?: LatLngBoundsValue, maxZoom?: number, minZoom?: number): Promise<Map>`

Sets the viewport to contain the given bounds. Alias to [fitBounds](#fitbounds).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| bounds | [LatLngBoundsValue](/api-reference/utilities/latlng-bounds#latlngbounds-value-type) |  | The bounds to fit the map to. |
| maxZoom | number | | The maximum zoom level to zoom to when fitting the bounds. Higher numbers will zoom in more. |
| minZoom | number | | The minimum zoom level to zoom to when fitting the bounds. Lower numbers will zoom out more. |

[See fitBounds for examples and more information](#fitbounds)

### getBounds

`getBounds(): Promise<LatLngBounds | undefined>`

Get the bounds for the map viewport. If the map hasn't been set up yet then `undefined` is returned.

```js
map.getBounds().then((bounds) => {
    // Do something with the bounds
});
```

### getCenter

`getCenter(): LatLng`

Returns the current center point for the map.

```js
const center = map.getCenter();
```

### getDiv

`getDiv(): HTMLElement | undefined`

Returns the map container div. If the map hasn't been set up yet then `undefined` is returned.

```js
const div = map.getDiv();
```

### getIsReady

`getIsReady(): boolean`

Gets whether the map is ready and visible. This also means that the map library is loaded.

```js
if (map.getIsReady()) {
    // Do something
}
```

### getProjection

`getProjection(): google.maps.Projection | undefined`

Returns the Google Maps [Projection](https://developers.google.com/maps/documentation/javascript/reference/image-overlay#Projection) object for the map.

 If the map hasn't been set up yet then `undefined` is returned.

```js
const projection = map.getProjection();
```

### getZoom

`getZoom(): number`

Get the current zoom level for the map.

```js
const zoom = map.getZoom();
```

You can get the same value from the `zoom` property.

```js
const zoom = map.zoom;
```

### load

`load(callback?: () => void): Promise<Map>`

Loads the Google Maps API library and displays the map.

The `ready` event is triggered after the map is loaded and displayed. This also triggers the `map_load` [Loader event](/api-reference/loader#events).

This is different from the [`show()`](#show) method because this will load the map and show the map. The `show()` method will only show the map and depends on [G.loader](/api-reference/loader) to load the map.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function |  | A function to call after the map is loaded and displayed. |

#### load usage

Just load and show the map:

```js
map.load();
```

Use the Promise:

```js
map.load().then(() => {
    // Do something
});
```

Await the promise:

```js
async loadAndDisplayTheMap() {
    await map.load();
    // Do something next
}
```

Use the callback:

```js
map.load(() => {
    // Do something
});
```

While it's an odd choice, you can do both the callback and handle the promise. They will be executed at the same time.

```js
map.load(() => {
    // Do something
}).then(() => {
    // Also do something
});
```

### loadGeoJson

`loadGeoJson(url: string | string[], options?: LoadOptions): Promise<DataFeature[]>`

Load GeoJson data into the map's [data layer](/api-reference/data-layer) from a url. This is a shortcut for [`map.data.loadGeoJson()`](/api-reference/data-layer#loadgeojson).

More than one url can be passed. The promise then resolves once every file has loaded, with all of the [DataFeature](/api-reference/data-feature) objects from all of the files.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| url | string \| string[] | Yes | The url to load the GeoJson from, or an array of urls. |
| options | [LoadOptions](/api-reference/data-layer#load-options) |  | The options for loading the data. |

```js
const features = await map.loadGeoJson('/parcels.json');
```

Fit the map to the data once it's loaded.

```js
map.loadGeoJson('/parcels.json', { fitBounds: true });
```

### locate

`locate(options?: LocateOptions | (position: LocationPosition) => void, onSuccess?: (position: LocationPosition) => void): Map`

Try to locate the user using the [GeoLocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [LocateOptions](#locate-options) or function |  | The [locate options](#locate-options) or a callback function for when the location is found. |
| onSuccess | function | | The callback function for when the location is found. Only pass this if `options` is passed as the options object. |

There are a few ways to handle when the user's location is found:

 **Pass a callback function to the `locate()` function.**

 ```js
map.locate({watch: false}, (position) => {
    // Do something with the position
});
```

 ```js
map.locate((position) => {
    // Do something with the position
});
```

**Listen for the 'locationfound' event.**

```js
map.on('locationfound', (position) => {
    // Do something with the position
});

// or

map.on(G.MapEvents.LOCATION_FOUND, (position) => {
    // Do something with the position
});

// or

map.onLocationFound((position) => {
    // Do something with the position
});
```

### onBoundsChanged

`onBoundsChanged(callback: EventCallback): void`

Callback for when the viewport bounds have changed.

This is a convenience function for `map.on(G.MapEvents.BOUNDS_CHANGED, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
map.onBoundsChanged(() => {
    // Do something
})
```

### onCenterChanged

`onCenterChanged(callback: EventCallback): void`

Callback for when the map center property changes.

This is a convenience function for `map.on(G.MapEvents.CENTER_CHANGED, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
map.onCenterChanged(() => {
    // Do something
})
```

### onClick

`onClick(callback: EventCallback): void`

Callback for when the map is clicked.

This is a convenience function for `map.on(G.MapEvents.CLICK, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
map.onClick(() => {
    // Do something
})
```

### onContextMenu

`onContextMenu(callback: EventCallback): void`

Callback for when the DOM contextmenu is fired on the map container.

This is a convenience function for `map.on(G.MapEvents.CONTEXT_MENU, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
map.onContextMenu(() => {
    // Do something
})
```

### onDblClick

`onDblClick(callback: EventCallback): void`

Callback for when the map is double clicked.

This is a convenience function for `map.on(G.MapEvents.DBLCLICK, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
map.onDblClick(() => {
    // Do something
})
```

### onDrag

`onDrag(callback: EventCallback): void`

Callback for when the user drags the map.

This is a convenience function for `map.on(G.MapEvents.DRAG, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
map.onDrag(() => {
    // Do something
})
```

### onDragEnd

`onDragEnd(callback: EventCallback): void`

Callback for when the user stops dragging the map.

This is a convenience function for `map.on(G.MapEvents.DRAG_END, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
map.onDragEnd(() => {
    // Do something
})
```

### onDragStart

`onDragStart(callback: EventCallback): void`

Callback for when the user starts dragging the map.

This is a convenience function for `map.on(G.MapEvents.DRAG_START, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
map.onDragStart(() => {
    // Do something
})
```

### onHeadingChanged

`onHeadingChanged(callback: EventCallback): void`

Callback for when the map heading value changes.

This is a convenience function for `map.on(G.MapEvents.HEADING_CHANGED, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
map.onHeadingChanged(() => {
    // Do something
})
```

### onIdle

`onIdle(callback: EventCallback): void`

Callback for when the map becomes idle after panning or zooming.

This is a convenience function for `map.on(G.MapEvents.IDLE, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
map.onIdle(() => {
    // Do something
})
```

### onIsFractionalZoomEnabledChanged

`onIsFractionalZoomEnabledChanged(callback: EventCallback): void`

Callback for when the isFractionalZoomEnabled property has changed.

This is a convenience function for `map.on(G.MapEvents.IS_FRACTIONAL_ZOOM_ENABLED_CHANGED, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
map.onIsFractionalZoomEnabledChanged(() => {
    // Do something
})
```

### onLocationError

`onLocationError(callback: EventCallback): void`

Callback for when there is an error getting the user's location.

This is a convenience function for `map.on(G.MapEvents.LOCATION_ERROR, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
map.onLocationError(() => {
    // Do something
})
```

### onLocationFound

`onLocationFound(callback: EventCallback): void`

Callback for when the user's location has been found.

This is a convenience function for `map.on(G.MapEvents.LOCATION_FOUND, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
map.onLocationFound(() => {
    // Do something
})
```

### onMapCapabilitiesChanged

`onMapCapabilitiesChanged(callback: EventCallback): void`

Callback for when the map capabilities change.

This is a convenience function for `map.on(G.MapEvents.MAP_CAPABILITIES_CHANGED, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
map.onMapCapabilitiesChanged(() => {
    // Do something
})
```

### onMapTypeIdChanged

`onMapTypeIdChanged(callback: EventCallback): void`

Callback for when the mapTypeId property changes.

This is a convenience function for `map.on(G.MapEvents.MAP_TYPE_ID_CHANGED, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
map.onMapTypeIdChanged(() => {
    // Do something
})
```

### onMouseMove

`onMouseMove(callback: EventCallback): void`

Callback for when the user's mouse moves over the map container.

This is a convenience function for `map.on(G.MapEvents.MOUSE_MOVE, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
map.onMouseMove(() => {
    // Do something
})
```

### onMouseOut

`onMouseOut(callback: EventCallback): void`

Callback for when the user's mouse exits the map container.

This is a convenience function for `map.on(G.MapEvents.MOUSE_OUT, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
map.onMouseOut(() => {
    // Do something
})
```

### onMouseOver

`onMouseOver(callback: EventCallback): void`

Callback for when the user's mouse enters the map container.

This is a convenience function for `map.on(G.MapEvents.MOUSE_OVER, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
map.onMouseOver(() => {
    // Do something
})
```

### onProjectionChanged

`onProjectionChanged(callback: EventCallback): void`

Callback for when the map projection has changed.

This is a convenience function for `map.on(G.MapEvents.PROJECTION_CHANGED, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
map.onProjectionChanged(() => {
    // Do something
})
```

### onReady

`onReady(callback: EventCallback): void`

Callback for when the map is ready and visible.

This is a convenience function for `map.onceImmediate(G.MapEvents.READY, callback)`. The callback is only called once. If the map is already ready then the callback is called right away.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
map.onReady(() => {
    // Do something
})
```

### onRenderingTypeChanged

`onRenderingTypeChanged(callback: EventCallback): void`

Callback for when the map renderingType has changed.

This is a convenience function for `map.on(G.MapEvents.RENDERING_TYPE_CHANGED, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
map.onRenderingTypeChanged(() => {
    // Do something
})
```

### onTilesLoaded

`onTilesLoaded(callback: EventCallback): void`

Callback for when the visible tiles have finished loading.

This is a convenience function for `map.on(G.MapEvents.TILES_LOADED, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
map.onTilesLoaded(() => {
    // Do something
})
```

### onTiltChanged

`onTiltChanged(callback: EventCallback): void`

Callback for when the map tilt property changes.

This is a convenience function for `map.on(G.MapEvents.TILT_CHANGED, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
map.onTiltChanged(() => {
    // Do something
})
```

### onZoomChanged

`onZoomChanged(callback: EventCallback): void`

Callback for when the map zoom property changes.

This is a convenience function for `map.on(G.MapEvents.ZOOM_CHANGED, callback)`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |

```js
map.onZoomChanged(() => {
    // Do something
})
```

### panBy

`panBy(x: number, y: number): void`

Changes the center of the map by the given distance in pixels.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| x | number | Yes  | The number of pixels to move the map in the x direction. |
| y | number | Yes  | The number of pixels to move the map in the y direction. |

```js
map.panBy(100, 32);
```

### panTo

`panTo(value: LatLngValue): void`

Changes the center of the map to the lat/lng value. If the change is less than both the width and height of the map, the transition will be smoothly animated.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) | Yes  | The latitude/longitude value to pan to. |

```js
map.panTo([34.0522, -118.2437]);
```

### resize

`resize(element?: HTMLElement | string): void`

Resize the the map container to force the map to redraw itself. This is useful when the map is not displaying correctly, such as when the map is hidden and then shown.

This will resize the element that the map is rendered in by default. If you need to resize a different element, pass that element as the first argument.

The element will have it's height adjusted by 1 pixel and then 100ms later the height will be set back to it's original value. This will trigger the Google map to resize itself and it should fix any layout issues.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| element | HTMLElement \| string |   | The element to resize if you don't want to resize the map container. This can be an HTMLElement or a CSS selector. |

Resize the map element.

```js
map.resize();
```

Resize another element around the map. You may need to do this if another element around the map has a set height and the map container is set to be `100%` height.

```js
map.resize(mapWrapperElement);
```

Resize another element by passing a selector instead of an HTML element.

```js
map.resize('#someSelector');
// or
map.resize('.someOtherSelector');
```

### setApiKey

`setApiKey(key: string): Map`

Set the Google Maps API key. You would only use this if you are not using the [G.loader](/api-reference/loader) object to load the Google Maps API library.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| key | string | Yes  | The API key. |

An error is thrown if the key is not a string with a value.

```js
map.setApiKey('my-api-key');
```

### setCenter

`setCenter(latitude: number | LatLngValue, longitude?: number): Map`

Set the center point for the map.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| latitude | number or [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) | Yes  | The latitude value or the latitude/longitude value. |
| longitude | number | | The longitude value. Set this if `latitude` is a number. |

```js
map.setCenter(34.0522, -118.2437);
```

```js
map.setCenter([34.0522, -118.2437]);
```

```js
map.setCenter({lat: 34.0522, lng: -118.2437});
```

```js
map.setCenter({latitude: 34.0522, longitude: -118.2437});
```

```js
map.setCenter(latLngObject);
```

### setHideBusinesses

`setHideBusinesses(value: boolean = true): Map`

Set whether to hide businesses on the map. This is the same as setting the [hideBusinesses](#hidebusinesses) property, but it returns the map so it can be chained.

This can be called before or after the map has been displayed.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| value | boolean | | true | Whether to hide businesses. |

```js
// Hide businesses
map.setHideBusinesses();

// Show businesses again
map.setHideBusinesses(false);
```

### setHidePointsOfInterest

`setHidePointsOfInterest(value: boolean = true): Map`

Set whether to hide all points of interest on the map. This is the same as setting the [hidePointsOfInterest](#hidepointsofinterest) property, but it returns the map so it can be chained.

This can be called before or after the map has been displayed.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| value | boolean | | true | Whether to hide all points of interest. |

```js
// Hide all points of interest
map.setHidePointsOfInterest();

// Show points of interest again
map.setHidePointsOfInterest(false);
```

### setHideTransit

`setHideTransit(value: boolean = true): Map`

Set whether to hide transit lines and stations on the map. This is the same as setting the [hideTransit](#hidetransit) property, but it returns the map so it can be chained.

This can be called before or after the map has been displayed.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| value | boolean | | true | Whether to hide transit lines and stations. |

```js
// Hide transit and businesses
map.setHideTransit().setHideBusinesses();

// Show transit again
map.setHideTransit(false);
```

### setLatitudeLongitude

`setLatitudeLongitude(latitude: number | string, longitude: number | string, updateCenter: boolean = true): Map`

Set the latitude and longitude values and optionally update the center point.

This is an alternate method to setting the latitude and longitude values individually, or using [setCenter()](#setcenter).

You can choose to not update the center point with this method and only update the internal latitude and longitude values. If `updateCenter` is false then the map's center point is not changed.

The times when you would not want to update the center point are when you are setting the latitude and longitude and you don't want to recenter the map, but you want the latitude and longitude values to be available for future times when the map may be centered.

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| latitude | number \| string | Yes | | The latitude value. |
| longitude | number \| string | Yes | | The longitude value. |
| updateCenter | boolean |  | true | Whether to also update the map center point. |

```js
map.setLatitudeLongitude('34.0522', '-118.2437');
```

### setMapTypeId

`setMapTypeId(mapTypeId: string): Map`

Set the map type id to use for the map.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| mapTypeId | string \| [MapTypeId](/api-reference/constants#maptypeid) | Yes | The map type id to use for the map. |

```js
map.setMapTypeId(G.MapTypeId.TERRAIN);
```

### setOptions

`setOptions(options: MapOptions): Map`

Set the map options. You can use this to set the initial options for the map or to change the options after the map has loaded.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [MapOptions](#map-options) | Yes  | The map options. |

```js
map.setOptions({
    center: [34.0522, -118.2437],
    zoom: 10
});
```

### setZoom

`setZoom(zoom: number | string): Map`

Set the zoom level for the map.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| zoom | number \| string | Yes  | The zoom level. |

:::info
Zoom levels go from 0, the most zoomed out, to 22, the most zoomed in.
:::

```js
map.setZoom(10);
```

### show

`show(callback?: () => void): Promise<Map>`

Display the map.

The `ready` event is triggered after the map is loaded and displayed. This also triggers the `map_load` [Loader event](/api-reference/loader#events).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function |  | A function to call after the map is displayed. |

:::warning
This method does not load the Google Maps API library. You must use [G.loader](/api-reference/loader) to load the map.
:::

The [`load()`](#load) method will load and show the map. This will only show the map and depends on [G.loader](/api-reference/loader) to load the map.

**Display usage.**

Just show the map:

```js
G.loader().setApiKey(apiKey).load();
map.show();
```

Use the Promise:

```js
G.loader().setApiKey(apiKey).load(() => {
    map.show().then(() => {
        // Do something
    });
});
```

Await the promise:

```js
async showTheMap() {
    await map.show();
    // Do something after loading
}
```

Use the callback:

```js
map.show(() => {
    // Do something
});
```

While it's an odd choice, you can do both the callback and handle the promise. They will be executed at the same time.

```js
map.show(() => {
    // Do something
}).then(() => {
    // Also do something
});
```

### stopLocate

`stopLocate(): Map`

Stop watching for the user's location.

```js
map.stopLocate();
```

### toGoogle

`toGoogle(): google.maps.Map`

Returns the Google Maps Map object.

```js
const googleObject = map.toGoogle();
```
