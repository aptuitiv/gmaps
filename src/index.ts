/* ===========================================================================
    Main file for the Google Map Display library for importing into other projects.
=========================================================================== */

// The classes are exported so that developers can use them at types within their own code.
// It's not intended that they used directly.
// For example, the marker() function should be used to create a new Marker object
// rather than using the Marker class directly.

export { default as Base } from './lib/Base';
export * from './lib/constants';
export { Event, EventCallback, EventConfig, EventListenerOptions, Evented } from './lib/Evented';
export { geocode, Geocode, GeocodeComponentRestrictions, GeocodeOptions, GeocodeResult } from './lib/Geocode';
export * from './lib/helpers';
export {
    autocompleteSearchBox,
    AutocompleteSearchBox,
    AutocompleteSearchBoxOptions,
    AutocompleteSearchBoxValue,
} from './lib/AutocompleteSearchBox';
export { icon, Icon, IconOptions, IconValue } from './lib/Icon';
export { infoWindow, InfoWindow, InfoWindowOptions, InfoWindowValue } from './lib/InfoWindow';
export { latLng, LatLng, LatLngLiteral, LatLngLiteralExpanded, LatLngValue } from './lib/LatLng';
export {
    latLngBounds,
    LatLngBounds,
    LatLngBoundsValue,
    LatLngBoundsEdges,
    LatLngBoundsLiteral,
} from './lib/LatLngBounds';
export { default as Layer } from './lib/Layer';
export { loader, Loader, LoaderOptions } from './lib/Loader';
export { map, Map, MapType } from './lib/Map';
export { fullscreenControl, FullscreenControl, FullscreenControlOptions } from './lib/Map/FullscreenControl';
export { mapRestriction, MapRestriction, MapRestrictionOptions } from './lib/Map/MapRestriction';
export { mapStyle, MapStyle, MapStyleOptions } from './lib/Map/MapStyle';
export { mapTypeControl, MapTypeControl, MapTypeControlOptions } from './lib/Map/MapTypeControl';
export { rotateControl, RotateControl, RotateControlOptions } from './lib/Map/RotateControl';
export { scaleControl, ScaleControl, ScaleControlOptions } from './lib/Map/ScaleControl';
export { streetViewControl, StreetViewControl, StreetViewControlOptions } from './lib/Map/StreetViewControl';
export { zoomControl, ZoomControl, ZoomControlOptions } from './lib/Map/ZoomControl';
export { LocationOnSuccess, LocateOptions, LocationPosition, MapOptions } from './lib/Map/types';
export { marker, Marker, MarkerLabel, MarkerOptions, MarkerValue } from './lib/Marker';
export {
    markerCluster,
    DefaultRenderOptions,
    ImageRendererOptions,
    MarkerCluster,
    MarkerClusterOptions,
} from './lib/MarkerCluster';
export { markerCollection, MarkerCollection } from './lib/MarkerCollection';
export { overlay, Overlay } from './lib/Overlay';
export { placesSearchBox, PlacesSearchBox, PlacesSearchBoxOptions, PlacesSearchBoxValue } from './lib/PlacesSearchBox';
export { point, Point, PointObject, PointValue } from './lib/Point';
export { polyline, Polyline, PolylineOptions, PolylineValue } from './lib/Polyline';
export { polylineCollection, PolylineCollection } from './lib/PolylineCollection';
export { closeAllPopups, popup, Popup, PopupOptions, PopupValue } from './lib/Popup';
export { size, Size, SizeObject, SizeValue } from './lib/Size';
export { svgSymbol, SvgSymbol, SvgSymbolOptions, SvgSymbolValue } from './lib/SvgSymbol';
export { tooltip, Tooltip, TooltipOptions, TooltipValue } from './lib/Tooltip';
