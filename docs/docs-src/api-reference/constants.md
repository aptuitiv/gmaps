---
---

# Constants

In order to ensure that configuration values are available to your code even if the Google Maps library isn't loaded, we duplicate some of the Google Map configuration values.

They can be accessed under the `G` variable if you're using this in your browser. Or, you can include them in your import statement.

The values are the same as the Google Maps objects that we reference.

:::warning
Do not use these constants if you are working directly with `google.maps` objects. In some cases the values are slightly different from the Google Maps counterpart. Only use these constants when you're working with the `@aptuitiv/gmaps` library objects.
:::

## AutocompleteSearchBoxEvents

Events that can be fired by the [Autocomplete search box](/api-reference/autocomplete-search-box#events).

```js
G.AutocompleteSearchBoxEvents.PLACE_CHANGED
```

| Constant | Description |
|----------|-------------|
| PLACE_CHANGED | The event fired when the user selects a Place. |

## ControlPosition

Identifiers used to specify the placement of controls on the map.

See the [Google Maps ControlPosition documentation](https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition) for more information.

Instead of using `google.maps.ControlPosition` you can use `G.ControlPosition` with the `@aptuitiv/gmaps` library.

```js
G.ControlPosition.BLOCK_END_INLINE_CENTER
G.ControlPosition.BLOCK_END_INLINE_END
G.ControlPosition.BLOCK_END_INLINE_START
G.ControlPosition.BLOCK_START_INLINE_CENTER
G.ControlPosition.BLOCK_START_INLINE_END
G.ControlPosition.BLOCK_START_INLINE_START
G.ControlPosition.BOTTOM_CENTER
G.ControlPosition.BOTTOM_LEFT
G.ControlPosition.BOTTOM_RIGHT
G.ControlPosition.INLINE_END_BLOCK_CENTER
G.ControlPosition.INLINE_END_BLOCK_END
G.ControlPosition.INLINE_END_BLOCK_START
G.ControlPosition.INLINE_START_BLOCK_CENTER
G.ControlPosition.INLINE_START_BLOCK_END
G.ControlPosition.INLINE_START_BLOCK_START
G.ControlPosition.LEFT_BOTTOM
G.ControlPosition.LEFT_CENTER
G.ControlPosition.LEFT_TOP
G.ControlPosition.RIGHT_BOTTOM
G.ControlPosition.RIGHT_CENTER
G.ControlPosition.RIGHT_TOP
G.ControlPosition.TOP_CENTER
G.ControlPosition.TOP_LEFT
G.ControlPosition.TOP_RIGHT
```

## DataLayerEvents

Events that can be fired by the [DataLayer](/api-reference/data-layer#events).

```js
G.DataLayerEvents.ADD_FEATURE
G.DataLayerEvents.CLICK
G.DataLayerEvents.CONTEXT_MENU
G.DataLayerEvents.DBLCLICK
G.DataLayerEvents.LOAD
G.DataLayerEvents.MOUSE_DOWN
G.DataLayerEvents.MOUSE_OUT
G.DataLayerEvents.MOUSE_OVER
G.DataLayerEvents.MOUSE_UP
G.DataLayerEvents.READY
G.DataLayerEvents.REMOVE_FEATURE
G.DataLayerEvents.REMOVE_PROPERTY
G.DataLayerEvents.RIGHT_CLICK
G.DataLayerEvents.SET_GEOMETRY
G.DataLayerEvents.SET_PROPERTY
```

| Constant | Description |
|----------|-------------|
| ADD_FEATURE | The event fired when a feature is added to the data layer. |
| CLICK | The event fired when the DOM click event is fired on a feature. |
| CONTEXT_MENU | The event fired when the DOM contextmenu event is fired on a feature. |
| DBLCLICK | The event fired when the DOM dblclick event is fired on a feature. |
| LOAD | The event fired when GeoJson data has finished loading. This is a custom event for this library. |
| MOUSE_DOWN | The event fired when the DOM mousedown event is fired on a feature. |
| MOUSE_OUT | The event fired when the mouse leaves a feature. |
| MOUSE_OVER | The event fired when the mouse moves over a feature. |
| MOUSE_UP | The event fired when the DOM mouseup event is fired on a feature. |
| READY | The data layer is loaded and ready for use. This is a custom event for this library. |
| REMOVE_FEATURE | The event fired when a feature is removed from the data layer. |
| REMOVE_PROPERTY | The event fired when a property is removed from a feature. |
| RIGHT_CLICK | The event fired when a feature is right clicked. |
| SET_GEOMETRY | The event fired when the geometry of a feature is changed. |
| SET_PROPERTY | The event fired when a property is set on a feature. |

## GeocoderErrorStatus

The error status value to identify an error when making a [Geocode](/api-reference/geocoding/geocode) call.

```js
G.GeocoderErrorStatus.ERROR
G.GeocoderErrorStatus.INVALID_REQUEST
G.GeocoderErrorStatus.OVER_QUERY_LIMIT
G.GeocoderErrorStatus.REQUEST_DENIED
G.GeocoderErrorStatus.UNKNOWN_ERROR
```

| Constant | Description |
|----------|-------------|
| ERROR | There was a problem contacting the Google servers. |
| INVALID_REQUEST | The geocode request was invalid. Most likely a required parameter was missing or an invalid parameter value was used. |
| OVER_QUERY_LIMIT | The webpage has gone over the requests limit in too short a period of time. |
| REQUEST_DENIED | The webpage is not allowed to use the Google Maps Geocoding API. |
| UNKNOWN_ERROR | A geocoding request could not be processed due to a server error. The request may succeed if you try again. |

## GeocoderLocationType

The type of location returned when making a [Geocode](/api-reference/geocoding/geocode) call.

```js
G.GeocoderLocationType.APPROXIMATE
G.GeocoderLocationType.GEOMETRIC_CENTER
G.GeocoderLocationType.RANGE_INTERPOLATED
G.GeocoderLocationType.ROOFTOP
```

| Constant | Description |
|----------|-------------|
| APPROXIMATE | The returned result is an approximate location. |
| GEOMETRIC_CENTER | The returned result is the geometric center of a result. The result could be something like a line (i.e. a street) or a polygon (i.e. a region). |
| RANGE_INTERPOLATED | The returned result is an approximation interpolated between two precise points. This is usually along an road and the precicse points are often intersections. This type of result is returned when a rooftop geocode is unavaiable for a street address. |
| ROOFTOP | This is the most precise geocode result type. |

## GeometryType

The GeoJson geometry types that the [data layer](/api-reference/data-layer) supports. This is the value of the [DataFeature](/api-reference/data-feature) `geometryType` property.

```js
G.GeometryType.GEOMETRY_COLLECTION
G.GeometryType.LINE_STRING
G.GeometryType.LINEAR_RING
G.GeometryType.MULTI_LINE_STRING
G.GeometryType.MULTI_POINT
G.GeometryType.MULTI_POLYGON
G.GeometryType.POINT
G.GeometryType.POLYGON
```

| Constant | Value | Description |
|----------|-------|-------------|
| GEOMETRY_COLLECTION | GeometryCollection | A group of other geometry objects. |
| LINE_STRING | LineString | A line. |
| LINEAR_RING | LinearRing | A closed line. These make up the edges and holes of a polygon. |
| MULTI_LINE_STRING | MultiLineString | A group of lines. |
| MULTI_POINT | MultiPoint | A group of points. |
| MULTI_POLYGON | MultiPolygon | A group of polygons. |
| POINT | Point | A single position. |
| POLYGON | Polygon | A polygon, made up of an outer edge and any holes within it. |

## ImageOverlayEvents

Events that can be fired by the [ImageOverlay](/api-reference/image-overlay#events).

```js
G.ImageOverlayEvents.ROTATE
G.ImageOverlayEvents.ROTATE_END
G.ImageOverlayEvents.ROTATE_START
```

| Constant | Description |
|----------|-------------|
| ROTATE | The event fired each time the rotating updates the image overlay rotation. |
| ROTATE_END | The event fired when the rotating finishes. |
| ROTATE_START | The event fired when rotating the image overlay starts. |

## InfoWindowEvents

Events that can be fired by the [InfoWindow](/api-reference/infowindow#events).

```js
G.InfoWindowEvents.CLOSE
G.InfoWindowEvents.CLOSECLICK
G.InfoWindowEvents.CONTENT_CHANGED
G.InfoWindowEvents.DOMREADY
G.InfoWindowEvents.HEADER_CONTENT_CHANGED
G.InfoWindowEvents.HEADER_DISABLED_CHANGED
G.InfoWindowEvents.POSITION_CHANGED
G.InfoWindowEvents.READY
G.InfoWindowEvents.VISIBLE
G.InfoWindowEvents.ZINDEX_CHANGED
```

| Constant | Description |
|----------|-------------|
| CLOSE | The event fired when the InfoWindow closes. |
| CLOSECLICK | The event fired when the InfoWindow close button is clicked. |
| CONTENT_CHANGED | The event fired when the InfoWindow content property changes. |
| DOMREADY | The eventfired when the `<div>` containing the InfoWindow's content is attached to the DOM. |
| HEADER_CONTENT_CHANGED | The event fired when the InfoWindow headerContent property changes. |
| HEADER_DISABLED_CHANGED | The event fired when the InfoWindow headerDisabled property changes. |
| POSITION_CHANGED | The event fired when the InfoWindow position property changes. |
| READY | The event fired when the InfoWindow is ready. |
| VISIBLE | The event fired when the InfoWindow is fully visible. |
| ZINDEX_CHANGED | The event fired when the InfoWindow zIndex changes. |

## LayerEvents

Events that can be fired by the [Layer](/api-reference/base-classes/layer#events).

```js
G.LayerEvents.READY
```

| Constant | Description |
|----------|-------------|
| READY | The event fired when the layer is ready. |

## LoaderEvents

Events that can be fired by the [Loader](/api-reference/loader#events).

```js
G.LoaderEvents.LOAD
G.LoaderEvents.MAP_LOAD
```

| Constant | Description |
|----------|-------------|
| LOAD | The event fired when the API library is loaded. |
| MAP_LOAD | The event fired when the API library is loaded and the map is loaded and visible. |

## MapEvents

Events that can be fired by the [Map](/api-reference/map#events).

```js
G.MapEvents.BOUNDS_CHANGED
G.MapEvents.CENTER_CHANGED
G.MapEvents.CLICK
G.MapEvents.CONTEXT_MENU
G.MapEvents.DBLCLICK
G.MapEvents.DRAG
G.MapEvents.DRAG_END
G.MapEvents.DRAG_START
G.MapEvents.HEADING_CHANGED
G.MapEvents.IDLE
G.MapEvents.IS_FRACTIONAL_ZOOM_ENABLED_CHANGED
G.MapEvents.LOCATION_ERROR
G.MapEvents.LOCATION_FOUND
G.MapEvents.MAP_CAPABILITIES_CHANGED
G.MapEvents.MAP_TYPE_ID_CHANGED
G.MapEvents.MOUSE_MOVE
G.MapEvents.MOUSE_OVER
G.MapEvents.MOUSE_OUT
G.MapEvents.PROJECTION_CHANGED
G.MapEvents.READY
G.MapEvents.RENDERING_TYPE_CHANGED
G.MapEvents.TILES_LOADED
G.MapEvents.TILT_CHANGED
G.MapEvents.ZOOM_CHANGED
```

| Constant | Description |
|----------|-------------|
| BOUNDS_CHANGED | The event fired when the viewport bounds have changed. |
| CENTER_CHANGED | The event fired when the map center property changes. |
| CLICK | The event fired when the map is clicked. |
| CONTEXT_MENU | The event fired when the map DOM contextmenu is fired on the map container. |
| DBLCLICK | The event fired when the map is double clicked. |
| DRAG | The event fired when the user drags the map. |
| DRAG_END | The event fired when the user stops dragging the map. |
| DRAG_START | The event fired when the user starts dragging the map. |
| HEADING_CHANGED | The event fired when the map heading value changes. |
| IDLE | The event fired when the map becomes idle after panning or zooming. |
| IS_FRACTIONAL_ZOOM_ENABLED_CHANGED | The event fired when the isFractionalZoomEnabled property has changed. |
| LOCATION_ERROR | The event fired when there is an error getting the user's location. |
| LOCATION_FOUND | The event fired when the user's location has been found. |
| MAP_CAPABILITIES_CHANGED | The event fired when the map capabilities change. |
| MAP_TYPE_ID_CHANGED | The event fired when the mapTypeId property changes. |
| MOUSE_MOVE | The event fired when the user's mouse moves over the map. |
| MOUSE_OVER | The event fired when the user's mouse enters the map. |
| MOUSE_OUT | The event fired when the user's mouse exits the map. |
| PROJECTION_CHANGED | The event fired when the map projection has changed. |
| READY | The event fired when the map is ready and visible.|
| RENDERING_TYPE_CHANGED | The event fired when the map renderingType has changed. |
| TILES_LOADED | The event fired when the visible tiles have finished loading. |
| TILT_CHANGED | The event fired when the map tilt property changes. |
| ZOOM_CHANGED | The event fired when the map zoom property changes |

## MapTypeControlStyle

Style values for common MapTypesControls.

See the [Google Maps MapTypeControlStyle documentation](https://developers.google.com/maps/documentation/javascript/reference/control#MapTypeControlStyle) for more information.

```js
G.MapTypeControlStyle.DEFAULT
G.MapTypeControlStyle.DROPDOWN_MENU
G.MapTypeControlStyle.HORIZONTAL_BAR
```

## MapTypeId

Identifiers for common MapTypes.

See the [Google Maps MapTypeId documentation](https://developers.google.com/maps/documentation/javascript/reference/map#MapTypeId) for more information.

```js
G.MapTypeId.HYBRID;
G.MapTypeId.ROADMAP;
G.MapTypeId.SATELLITE;
G.MapTypeId.TERRAIN;
```

## MarkerEvents

Events that can be fired by the [Marker](/api-reference/marker#events).

```js
G.MarkerEvents.ANIMATION_CHANGED
G.MarkerEvents.CLICK
G.MarkerEvents.CLICKABLE_CHANGED
G.MarkerEvents.CONTEXT_MENU
G.MarkerEvents.CURSOR_CHANGED
G.MarkerEvents.DBLCLICK
G.MarkerEvents.DRAG
G.MarkerEvents.DRAG_END
G.MarkerEvents.DRAGGABLE_CHANGED
G.MarkerEvents.DRAG_START
G.MarkerEvents.FLAT_CHANGED
G.MarkerEvents.ICON_CHANGED
G.MarkerEvents.MOUSE_DOWN
G.MarkerEvents.MOUSE_OUT
G.MarkerEvents.MOUSE_OVER
G.MarkerEvents.MOUSE_UP
G.MarkerEvents.POSITION_CHANGED
G.MarkerEvents.READY
G.MarkerEvents.SHAPE_CHANGED
G.MarkerEvents.TITLE_CHANGED
G.MarkerEvents.VISIBLE_CHANGED
G.MarkerEvents.ZINDEX_CHANGED
```

| Constant | Description |
|----------|-------------|
| ANIMATION_CHANGED | The event fired when the marker's animation changes. |
| CLICK | The event fired when the marker is clicked. |
| CLICKABLE_CHANGED | The event fired when the marker clickable property changes. |
| CONTEXT_MENU | The event fired when the DOM contextmenu is fired on the marker. |
| CURSOR_CHANGED | The event fired when the marker cursor property changes. |
| DBLCLICK | The event fired when the marker is double clicked. |
| DRAG | The event fired when the user drags the marker. |
| DRAG_END | The event fired when the user stops dragging the marker. |
| DRAGGABLE_CHANGED | The event fired when the marker draggable property changes. |
| DRAG_START | The event fired when the user starts dragging the marker. |
| FLAT_CHANGED | The event fired when themarker flat property changes. |
| ICON_CHANGED | The event fired when the marker icon property changes. |
| MOUSE_DOWN | The event fired when the user's mouse is pressed down on the marker. |
| MOUSE_OUT | The event fired when the user's mouse exits the marker. |
| MOUSE_OVER | The event fired when the user's mouse enters the marker. |
| MOUSE_UP | The event fired for the mouseup event on the marker. |
| POSITION_CHANGED | The event fired when the marker's position property has changed. |
| READY | The event fired when the marker is loaded and ready for use. |
| SHAPE_CHANGED | The event fired when the marker's shape property changes. |
| TITLE_CHANGED | The event fired when the marker's title property changes. |
| VISIBLE_CHANGED | The event fired when the marker's visible property changes. |
| ZINDEX_CHANGED | The event fired when the marker's zindex property changes. |

## OverlayEvents

Events that can be fired by the [Overlay](/api-reference/overlay#events).

```js
G.OverlayEvents.DRAG_END
G.OverlayEvents.DRAG
G.OverlayEvents.DRAGGABLE_CHANGED
G.OverlayEvents.DRAG_START
G.OverlayEvents.OPEN
G.OverlayEvents.RESIZE_END
G.OverlayEvents.RESIZE
G.OverlayEvents.RESIZE_START
```

| Constant | Description |
|----------|-------------|
| DRAG_END | The event fired whene the dragging ends. |
| DRAG | The event fired each time the dragging updates the overlay position. |
| DRAGGABLE_CHANGED | The event fired when the overlay `drag` property changes. |
| DRAG_START | The event fired when dragging the overlay starts. |
| OPEN | The event fired when the overlay is opened. |
| RESIZE_END | The event fired when the resizing ends. |
| RESIZE | The event fired each time the resizing updates the overlay size and position. |
| RESIZE_START | The event fired when resizing the overlay starts. |

## PlacesSearchBoxEvents

Events that can be fired by the [PlacesSearchBox](/api-reference/places-search-box#events).

```js
G.PlacesSearchBoxEvents.PLACES_CHANGED
```

| Constant | Description |
|----------|-------------|
| PLACES_CHANGED | The event fired when the user selects a place. |

## PolylineEvents

Events that can be fired by the [Polyline](/api-reference/polyline#events).

```js
G.PolylineEvents.CLICK
G.PolylineEvents.CONTEXT_MENU
G.PolylineEvents.DBLCLICK
G.PolylineEvents.DRAG
G.PolylineEvents.DRAG_END
G.PolylineEvents.DRAG_START
G.PolylineEvents.MOUSE_DOWN
G.PolylineEvents.MOUSE_MOVE
G.PolylineEvents.MOUSE_OUT
G.PolylineEvents.MOUSE_OVER
G.PolylineEvents.MOUSE_UP
G.PolylineEvents.READY
```

| Constant | Description |
|----------|-------------|
| CLICK | The event fired when the DOM click event is fired on the Polyline. |
| CONTEXT_MENU | The event fired when the DOM contextmenu event is fired on the Polyline. |
| DBLCLICK | The event fired when the DOM dblclick event is fired on the Polyline. |
| DRAG | The event fired repeatedly while the Polyline is dragged. |
| DRAG_END | The event fired when the user stops dragging the Polyline. |
| DRAG_START | The event fired when the user starts dragging the Polyline. |
| MOUSE_DOWN | The event fired when the DOM mousedown event is fired on the Polyline. |
| MOUSE_MOVE | The event fired when the DOM mousemove event is fired on the Polyline. |
| MOUSE_OUT | The event fired when the DOM mouseout event is fired on the Polyline. |
| MOUSE_OVER | The event fired when the DOM mouseover event is fired on the Polyline. |
| MOUSE_UP | The event fired when the DOM mouseup event is fired on the Polyline. |
| READY | The event fired when Polyline is ready for use. |

## PopupEvents

Events that can be fired by the [Popup](/api-reference/popup#events). (Where the popup object extends the overlay object, these are the same events that the overlay object has.)

```js
G.PopupEvents.OPEN
```

| Constant | Description |
|----------|-------------|
| OPEN | The event fired when the popup is opened. |

## Ready Event

Because the same "ready" event is used in multiple places, for consistency we use a constant for that event. Its value is `ready`.

```js
G.READY_EVENT
```

## RenderingType

The rendering type of the map.

See the [Google Maps RenderingType documentation](https://developers.google.com/maps/documentation/javascript/reference/map#RenderingType) for more information.

```js
G.RenderingType.RASTER
G.RenderingType.UNINITIALIZED
G.RenderingType.VECTOR
```

## StreetViewSource

The source for the street view.

See the [Google Maps StreetViewSource documentation](https://developers.google.com/maps/documentation/javascript/reference/street-view-service#StreetViewSource) for more information.

```js
G.StreetViewSource.DEFAULT
G.StreetViewSource.GOOGLE
G.StreetViewSource.OUTDOOR
```

## SymbolPath

Built-in symbol paths for certain shapes. These can be used as the icon for a [PolylineIcon](/api-reference/polyline-icon).

See the [Google maps SymbolPath documentation](https://developers.google.com/maps/documentation/javascript/reference/marker#SymbolPath) for more information.

```js
// A backward-pointing closed arrow.
G.SymbolPath.BACKWARD_CLOSED_ARROW;
// A backward-pointing open arrow.
G.SymbolPath.BACKWARD_OPEN_ARROW;
// A circle with a radius of 1.
G.SymbolPath.CIRCLE;
// A forward-pointing closed arrow.
G.SymbolPath.FORWARD_CLOSED_ARROW;
// A forward-pointing open arrow.
G.SymbolPath.FORWARD_OPEN_ARROW;
```
