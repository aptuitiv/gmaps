/* ===========================================================================
    Main file for the Google Map Display library for use in the browser
    when using the library as a standalone script.
=========================================================================== */

/* global globalThis, NodeJS, Window */

// Import the class helpers
import { icon, Icon } from './lib/Icon';
import { infoWindow, InfoWindow } from './lib/InfoWindow';
import { latLng, LatLng } from './lib/LatLng';
import { latLngBounds, LatLngBounds } from './lib/LatLngBounds';
import { loader, Loader } from './lib/Loader';
import { map, Map } from './lib/Map';
import { marker, Marker } from './lib/Marker';
import { markerCluster, MarkerCluster } from './lib/MarkerCluster';
import { point, Point } from './lib/Point';
import { polyline, Polyline } from './lib/Polyline';
import { popup, Popup } from './lib/Popup';
import { size, Size } from './lib/Size';
import { svgSymbol, SvgSymbol } from './lib/SvgSymbol';
import { tooltip, Tooltip } from './lib/Tooltip';

// Types
import GlobalObj from './types';

// Set up the global namespace object
const G: GlobalObj = {
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
    marker,
    Marker,
    markerCluster,
    MarkerCluster,
    point,
    Point,
    polyline,
    Polyline,
    popup,
    Popup,
    size,
    Size,
    svgSymbol,
    SvgSymbol,
    tooltip,
    Tooltip,
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
