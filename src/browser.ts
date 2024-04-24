/* ===========================================================================
    Main file for the Google Map Display library for use in the browser
    when using the library as a standalone script.
=========================================================================== */

/* global globalThis, NodeJS, Window */

// Import the class helpers
import { ControlPosition, MapTypeControlStyle, MapTypeId } from './lib/constants';
import { icon } from './lib/Icon';
import { infoWindow } from './lib/InfoWindow';
import { latLng } from './lib/LatLng';
import { latLngBounds } from './lib/LatLngBounds';
import { loader } from './lib/Loader';
import { map } from './lib/Map';
import { mapTypeControl } from './lib/Map/MapTypeControl';
import { marker } from './lib/Marker';
import { markerCluster } from './lib/MarkerCluster';
import { markerCollection } from './lib/MarkerCollection';
import { overlay } from './lib/Overlay';
import { point } from './lib/Point';
import { polyline } from './lib/Polyline';
import { polylineCollection } from './lib/PolylineCollection';
import { popup } from './lib/Popup';
import { size } from './lib/Size';
import { svgSymbol } from './lib/SvgSymbol';
import { tooltip } from './lib/Tooltip';

// Types
type GlobalObj = {
    ControlPosition: typeof ControlPosition;
    MapTypeControlStyle: typeof MapTypeControlStyle;
    MapTypeId: typeof MapTypeId;
    icon: typeof icon;
    infoWindow: typeof infoWindow;
    latLng: typeof latLng;
    latLngBounds: typeof latLngBounds;
    loader: typeof loader;
    map: typeof map;
    mapTypeControl: typeof mapTypeControl;
    marker: typeof marker;
    markerCluster: typeof markerCluster;
    markerCollection: typeof markerCollection;
    overlay: typeof overlay;
    point: typeof point;
    polyline: typeof polyline;
    polylineCollection: typeof polylineCollection;
    popup: typeof popup;
    size: typeof size;
    svgSymbol: typeof svgSymbol;
    tooltip: typeof tooltip;
};

// Set up the global namespace object
const G: GlobalObj = {
    ControlPosition,
    MapTypeControlStyle,
    MapTypeId,
    icon,
    infoWindow,
    latLng,
    latLngBounds,
    loader,
    map,
    mapTypeControl,
    marker,
    markerCluster,
    markerCollection,
    overlay,
    point,
    polyline,
    polylineCollection,
    popup,
    size,
    svgSymbol,
    tooltip,
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
