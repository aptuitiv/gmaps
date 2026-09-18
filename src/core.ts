/* ===========================================================================
    Core entry point for the Google Map Display library.

    This is everything except the features that add themselves to other classes when they are
    imported: popups, tooltips and InfoWindows. Importing those attaches methods like
    attachPopup() to the Map and Layer classes, so they can't be left out of a bundle that
    imports them. Keeping them out of this entry point is what lets a bundler drop the code for
    features that aren't used.

    Import the ones you need alongside this:
        import { map, marker } from '@aptuitiv/gmaps/core';
        import { popup } from '@aptuitiv/gmaps/popup';

    The main '@aptuitiv/gmaps' entry point includes everything, and is what to use if you'd
    rather not think about it.
=========================================================================== */

// The classes are exported so that developers can use them at types within their own code.
// It's not intended that they used directly.
// For example, the marker() function should be used to create a new Marker object
// rather than using the Marker class directly.

export { default as Base } from './lib/Base';
export * from './lib/constants';
export { Event, EventCallback, EventConfig, EventListenerOptions, Evented } from './lib/Evented';
export { geocode, Geocode, GeocodeComponentRestrictions, GeocodeOptions } from './lib/Geocode';
export { default as GeocodeResult } from './lib/Geocode/Result';
export { default as GeocodeResults } from './lib/Geocode/Results';
export * from './lib/helpers';
export {
    autocompleteSearchBox,
    AutocompleteSearchBox,
    AutocompleteSearchBoxOptions,
    AutocompleteSearchBoxValue,
} from './lib/AutocompleteSearchBox';
export { DataFeature, DataFeatureValue, FeatureProperties } from './lib/DataFeature';
export {
    dataLayer,
    DataLayer,
    DataLayerEventCallback,
    DataLayerEventObject,
    DataLayerOptions,
    DataLayerValue,
    DataStyleOptions,
    DataStyleValue,
    FeatureOptions,
    LoadOptions,
} from './lib/DataLayer';
export { icon, Icon, IconOptions, IconValue } from './lib/Icon';
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
export { AttachEventValue } from './lib/OverlayAttachment';
export { imageOverlay, ImageOverlay, ImageOverlayOptions, ImageOverlayValue } from './lib/ImageOverlay';
export { placesSearchBox, PlacesSearchBox, PlacesSearchBoxOptions, PlacesSearchBoxValue } from './lib/PlacesSearchBox';
export { point, Point, PointObject, PointValue } from './lib/Point';
export { polyline, Polyline, PolylineOptions, PolylineSimplifyOptions, PolylineValue } from './lib/Polyline';
export { polylineCollection, PolylineCollection } from './lib/PolylineCollection';
export { polylineIcon, PolylineIcon, PolylineIconOptions, PolylineIconValue } from './lib/PolylineIcon';
export { DEFAULT_SIMPLIFY_TOLERANCE, DEFAULT_SIMPLIFY_ZOOM, simplifyPath } from './lib/simplifyPath';
export { size, Size, SizeObject, SizeValue } from './lib/Size';
export { svgSymbol, SvgSymbol, SvgSymbolOptions, SvgSymbolValue } from './lib/SvgSymbol';
