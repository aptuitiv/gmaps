/* ===========================================================================
    Main file for the Google Map Display library for importing into other projects.
=========================================================================== */

// The classes are exported so that developers can use them at types within their own code.
// It's not intended that they used directly.
// For example, the marker() function should be used to create a new Marker object
// rather than using the Marker class directly.

export { default as Base } from './lib/Base';
export { Event, EventCallback, EventConfig, EventListenerOptions, Evented } from './lib/Evented';
export * from './lib/helpers';
export { icon, Icon, IconOptions, IconValue } from './lib/Icon';
export { infoWindow, InfoWindow, InfoWindowOptions, InfoWindowValue } from './lib/InfoWindow';
export { latLng, LatLng, LatLngValue } from './lib/LatLng';
export { latLngBounds, LatLngBounds, LatLngBoundsValue } from './lib/LatLngBounds';
export { default as Layer } from './lib/Layer';
export { loader, Loader, LoaderOptions } from './lib/Loader';
export { map, LocationOnSuccess, LocateOptions, LocationPosition, Map, MapOptions } from './lib/Map';
export { marker, Marker, MarkerLabel, MarkerOptions, MarkerValue } from './lib/Marker';
export {
    markerCluster,
    DefaultRenderOptions,
    ImageRendererOptions,
    MarkerCluster,
    MarkerClusterOptions,
} from './lib/MarkerCluster';
export { markerCollection, MarkerCollection } from './lib/MarkerCollection';
export { point, Point, PointObject, PointValue } from './lib/Point';
export { polyline, Polyline, PolylineOptions, PolylineValue } from './lib/Polyline';
export { polylineCollection, PolylineCollection } from './lib/PolylineCollection';
export { popup, Popup, PopupOptions, PopupValue } from './lib/Popup';
export { size, Size, SizeObject, SizeValue } from './lib/Size';
export { svgSymbol, SvgSymbol, SvgSymbolOptions, SvgSymbolValue } from './lib/SvgSymbol';
export { tooltip, Tooltip, TooltipOptions, TooltipValue } from './lib/Tooltip';
