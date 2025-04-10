/* ===========================================================================
    Main file for the Google Map Display library for use in the browser
    when using the library as a standalone script.
=========================================================================== */

/* global globalThis, NodeJS, Window */

// Import the class helpers
// The classes (i.e. Marker, Polyline, etc.) are imported here so that they can be used
// to add plugins to the classes for custom functionality.
// For example:
// G.Marker.include({
//     myCustomFunction: function() {
//         console.log('Hello from my custom function');
//     }
// });
// The classes should not be used for other purposes. For all other functionality
// the lowercase objects should be used (i.e. marker, polyline, etc.).
import { autocompleteSearchBox, AutocompleteSearchBox } from './lib/AutocompleteSearchBox';
import {
    AutocompleteSearchBoxEvents,
    ControlPosition,
    GeocoderErrorStatus,
    GeocoderLocationType,
    LoaderEvents,
    MapEvents,
    MapTypeControlStyle,
    MapTypeId,
    MarkerEvents,
    OverlayEvents,
    PlacesSearchBoxEvents,
    PopupEvents,
    RenderingType,
    StreetViewSource,
    SymbolPath,
} from './lib/constants';
import { geocode, Geocode } from './lib/Geocode';
import { icon, Icon } from './lib/Icon';
import { infoWindow, InfoWindow } from './lib/InfoWindow';
import { latLng, LatLng } from './lib/LatLng';
import { latLngBounds, LatLngBounds } from './lib/LatLngBounds';
import { loader, Loader } from './lib/Loader';
import { map, Map } from './lib/Map';
import { fullscreenControl, FullscreenControl } from './lib/Map/FullscreenControl';
import { mapRestriction, MapRestriction } from './lib/Map/MapRestriction';
import { mapStyle, MapStyle } from './lib/Map/MapStyle';
import { mapTypeControl, MapTypeControl } from './lib/Map/MapTypeControl';
import { rotateControl, RotateControl } from './lib/Map/RotateControl';
import { scaleControl, ScaleControl } from './lib/Map/ScaleControl';
import { streetViewControl, StreetViewControl } from './lib/Map/StreetViewControl';
import { zoomControl, ZoomControl } from './lib/Map/ZoomControl';
import { marker, Marker } from './lib/Marker';
import { markerCluster, MarkerCluster } from './lib/MarkerCluster';
import { markerCollection, MarkerCollection } from './lib/MarkerCollection';
import { overlay, Overlay } from './lib/Overlay';
import { placesSearchBox, PlacesSearchBox } from './lib/PlacesSearchBox';
import { point, Point } from './lib/Point';
import { polyline, Polyline } from './lib/Polyline';
import { polylineCollection, PolylineCollection } from './lib/PolylineCollection';
import { polylineIcon, PolylineIcon } from './lib/PolylineIcon';
import { closeAllPopups, popup, Popup } from './lib/Popup';
import { size, Size } from './lib/Size';
import { svgSymbol, SvgSymbol } from './lib/SvgSymbol';
import { tooltip, Tooltip } from './lib/Tooltip';

// Types
type GlobalObj = {
    AutocompleteSearchBoxEvents: typeof AutocompleteSearchBoxEvents;
    ControlPosition: typeof ControlPosition;
    GeocoderErrorStatus: typeof GeocoderErrorStatus;
    GeocoderLocationType: typeof GeocoderLocationType;
    LoaderEvents: typeof LoaderEvents;
    MapEvents: typeof MapEvents;
    MapTypeControlStyle: typeof MapTypeControlStyle;
    MapTypeId: typeof MapTypeId;
    MarkerEvents: typeof MarkerEvents;
    OverlayEvents: typeof OverlayEvents;
    PlacesSearchBoxEvents: typeof PlacesSearchBoxEvents;
    PopupEvents: typeof PopupEvents;
    RenderingType: typeof RenderingType;
    StreetViewSource: typeof StreetViewSource;
    SymbolPath: typeof SymbolPath;
    autocompleteSearchBox: typeof autocompleteSearchBox;
    AutocompleteSearchBox: typeof AutocompleteSearchBox;
    fullscreenControl: typeof fullscreenControl;
    FullscreenControl: typeof FullscreenControl;
    geocode: typeof geocode;
    Geocode: typeof Geocode;
    icon: typeof icon;
    Icon: typeof Icon;
    infoWindow: typeof infoWindow;
    InfoWindow: typeof InfoWindow;
    latLng: typeof latLng;
    LatLng: typeof LatLng;
    latLngBounds: typeof latLngBounds;
    LatLngBounds: typeof LatLngBounds;
    loader: typeof loader;
    Loader: typeof Loader;
    map: typeof map;
    Map: typeof Map;
    mapRestriction: typeof mapRestriction;
    MapRestriction: typeof MapRestriction;
    mapStyle: typeof mapStyle;
    MapStyle: typeof MapStyle;
    mapTypeControl: typeof mapTypeControl;
    MapTypeControl: typeof MapTypeControl;
    marker: typeof marker;
    Marker: typeof Marker;
    markerCluster: typeof markerCluster;
    MarkerCluster: typeof MarkerCluster;
    markerCollection: typeof markerCollection;
    MarkerCollection: typeof MarkerCollection;
    overlay: typeof overlay;
    Overlay: typeof Overlay;
    placesSearchBox: typeof placesSearchBox;
    PlacesSearchBox: typeof PlacesSearchBox;
    point: typeof point;
    Point: typeof Point;
    polyline: typeof polyline;
    Polyline: typeof Polyline;
    polylineCollection: typeof polylineCollection;
    PolylineCollection: typeof PolylineCollection;
    polylineIcon: typeof polylineIcon;
    PolylineIcon: typeof PolylineIcon;
    popup: typeof popup;
    Popup: typeof Popup;
    closeAllPopups: typeof closeAllPopups;
    rotateControl: typeof rotateControl;
    RotateControl: typeof RotateControl;
    scaleControl: typeof scaleControl;
    ScaleControl: typeof ScaleControl;
    size: typeof size;
    Size: typeof Size;
    streetViewControl: typeof streetViewControl;
    StreetViewControl: typeof StreetViewControl;
    svgSymbol: typeof svgSymbol;
    SvgSymbol: typeof SvgSymbol;
    tooltip: typeof tooltip;
    Tooltip: typeof Tooltip;
    zoomControl: typeof zoomControl;
    ZoomControl: typeof ZoomControl;
};

// Set up the global namespace object
const G: GlobalObj = {
    AutocompleteSearchBoxEvents,
    ControlPosition,
    GeocoderErrorStatus,
    GeocoderLocationType,
    LoaderEvents,
    MapEvents,
    MapTypeControlStyle,
    MapTypeId,
    MarkerEvents,
    OverlayEvents,
    PlacesSearchBoxEvents,
    PopupEvents,
    RenderingType,
    StreetViewSource,
    SymbolPath,
    autocompleteSearchBox,
    AutocompleteSearchBox,
    fullscreenControl,
    FullscreenControl,
    geocode,
    Geocode,
    icon,
    Icon,
    infoWindow,
    InfoWindow,
    latLng,
    LatLng,
    latLngBounds,
    LatLngBounds,
    loader,
    Loader,
    map,
    Map,
    mapRestriction,
    MapRestriction,
    mapStyle,
    MapStyle,
    mapTypeControl,
    MapTypeControl,
    marker,
    Marker,
    markerCluster,
    MarkerCluster,
    markerCollection,
    MarkerCollection,
    overlay,
    Overlay,
    placesSearchBox,
    PlacesSearchBox,
    point,
    Point,
    polyline,
    Polyline,
    polylineCollection,
    PolylineCollection,
    polylineIcon,
    PolylineIcon,
    popup,
    Popup,
    closeAllPopups,
    rotateControl,
    RotateControl,
    scaleControl,
    ScaleControl,
    size,
    Size,
    streetViewControl,
    StreetViewControl,
    svgSymbol,
    SvgSymbol,
    tooltip,
    Tooltip,
    zoomControl,
    ZoomControl,
};

/**
 * Get the global object for the environment
 *
 * globalThis is a global variable in JavaScript that provides a standard way to access the global object
 * across different environments.
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
 * In a browser, globalThis refers to the window object. In Node.js, it refers to the global object.
 * Before globalThis was introduced, accessing the global object in a way that works across different
 * environments could be tricky.
 * For example, in a browser you could use window, but in Node.js you would need to use global.
 * globalThis was introduced to solve this problem and provide a consistent way to access the global object.
 *
 * @returns {Window | NodeJS.Global | globalThis}
 */
function getGlobalObject() {
    if (typeof globalThis !== 'undefined') {
        return globalThis;
    }
    if (typeof window !== 'undefined') {
        return window;
    }
    if (typeof global !== 'undefined') {
        return global;
    }

    throw new Error('Unable to locate global object.');
}

// Set up the global namespace object for the library.
// All functions are available via the G object.
getGlobalObject().G = G;
