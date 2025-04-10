import { Libraries } from '@googlemaps/js-api-loader';
import { Algorithm, SuperClusterOptions, onClusterClickHandler, Renderer } from '@googlemaps/markerclusterer';

/**
 * Base class that all other classes extend.
 */
declare class Base {
    #private;
    /**
     * Constructor
     *
     * @param {string} objectType The object type for the class
     */
    constructor(objectType: string);
    /**
     * Returns the object type
     *
     * @returns {string}
     */
    getObjectType(): string;
    /**
     * Include the mixin into the class
     *
     * https://javascript.info/mixins
     * https://www.digitalocean.com/community/tutorials/js-using-js-mixins
     *
     * @param {any} mixin The mixin to include
     */
    static include(mixin: any): void;
    /**
     * Returns if the object is an Icon object
     *
     * @returns {boolean}
     */
    isIcon(): boolean;
    /**
     * Returns if the object is an InfoWindow object
     *
     * @returns {boolean}
     */
    isInfoWindow(): boolean;
    /**
     * Returns if the object is an LatLng object
     *
     * @returns {boolean}
     */
    isLatLng(): boolean;
    /**
     * Returns if the object is an LatLngBounds object
     *
     * @returns {boolean}
     */
    isLatLngBounds(): boolean;
    /**
     * Returns if the object is a Map object
     *
     * @returns {boolean}
     */
    isMap(): boolean;
    /**
     * Returns if the object is a Marker object
     *
     * @returns {boolean}
     */
    isMarker(): boolean;
    /**
     * Returns if the object is a MarkerCluster object
     *
     * @returns {boolean}
     */
    isMarkerCluster(): boolean;
    /**
     * Returns if the object is a Point object
     *
     * @returns {boolean}
     */
    isPoint(): boolean;
    /**
     * Returns if the object is a Polyline object
     *
     * @returns {boolean}
     */
    isPolyline(): boolean;
    /**
     * Returns if the object is a Popup object
     *
     * @returns {boolean}
     */
    isPopup(): boolean;
    /**
     * Returns if the object is a Size object
     *
     * @returns {boolean}
     */
    isSize(): boolean;
    /**
     * Returns if the object is a SvgSymbol object
     *
     * @returns {boolean}
     */
    isSvgSymbol(): boolean;
}

/**
 * Events that can be fired by the Autocomplete search box.
 *
 * https://aptuitiv.github.io/gmaps-docs/api-reference/autocomplete-search-box#events
 */
declare const AutocompleteSearchBoxEvents: Readonly<{
    PLACE_CHANGED: "place_changed";
}>;
/**
 * Identifiers used to specify the placement of controls on the map.
 * See https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
 */
declare const ControlPosition: Readonly<{
    /**
     * Equivalent to BOTTOM_CENTER in both LTR and RTL.
     */
    BLOCK_END_INLINE_CENTER: "0.0";
    /**
     * Equivalent to BOTTOM_RIGHT in LTR, or BOTTOM_LEFT in RTL.
     */
    BLOCK_END_INLINE_END: "1.0";
    /**
     * Equivalent to BOTTOM_LEFT in LTR, or BOTTOM_RIGHT in RTL.
     */
    BLOCK_END_INLINE_START: "2.0";
    /**
     * Equivalent to TOP_CENTER in both LTR and RTL.
     */
    BLOCK_START_INLINE_CENTER: "3.0";
    /**
     * Equivalent to TOP_RIGHT in LTR, or TOP_LEFT in RTL.
     */
    BLOCK_START_INLINE_END: "4.0";
    /**
     * Equivalent to TOP_LEFT in LTR, or TOP_RIGHT in RTL.
     */
    BLOCK_START_INLINE_START: "5.0";
    /**
     * Elements are positioned in the center of the bottom row. Consider using
     * BLOCK_END_INLINE_CENTER instead.
     */
    BOTTOM_CENTER: "6.0";
    /**
     * Elements are positioned in the bottom left and flow towards the middle.
     * Elements are positioned to the right of the Google logo. Consider using
     * BLOCK_END_INLINE_START instead.
     */
    BOTTOM_LEFT: "7.0";
    /**
     * Elements are positioned in the bottom right and flow towards the middle.
     * Elements are positioned to the left of the copyrights. Consider using
     * BLOCK_END_INLINE_END instead.
     */
    BOTTOM_RIGHT: "8.0";
    /**
     * Equivalent to RIGHT_CENTER in LTR, or LEFT_CENTER in RTL.
     */
    INLINE_END_BLOCK_CENTER: "9.0";
    /**
     * Equivalent to RIGHT_BOTTOM in LTR, or LEFT_BOTTOM in RTL.
     */
    INLINE_END_BLOCK_END: "10.0";
    /**
     * Equivalent to RIGHT_TOP in LTR, or LEFT_TOP in RTL.
     */
    INLINE_END_BLOCK_START: "11.0";
    /**
     * Equivalent to LEFT_CENTER in LTR, or RIGHT_CENTER in RTL.
     */
    INLINE_START_BLOCK_CENTER: "12.0";
    /**
     * Equivalent to LEFT_BOTTOM in LTR, or RIGHT_BOTTOM in RTL.
     */
    INLINE_START_BLOCK_END: "13.0";
    /**
     * Equivalent to LEFT_TOP in LTR, or RIGHT_TOP in RTL.
     */
    INLINE_START_BLOCK_START: "14.0";
    /**
     * Elements are positioned on the left, above bottom-left elements, and flow
     * upwards. Consider using INLINE_START_BLOCK_END instead.
     */
    LEFT_BOTTOM: "15.0";
    /**
     * Elements are positioned in the center of the left side. Consider using
     * INLINE_START_BLOCK_CENTER instead.
     */
    LEFT_CENTER: "16.0";
    /**
     * Elements are positioned on the left, below top-left elements, and flow
     * downwards. Consider using INLINE_START_BLOCK_START instead.
     */
    LEFT_TOP: "17.0";
    /**
     * Elements are positioned on the right, above bottom-right elements, and
     * flow upwards. Consider using INLINE_END_BLOCK_END instead.
     */
    RIGHT_BOTTOM: "18.0";
    /**
     * Elements are positioned in the center of the right side. Consider using
     * INLINE_END_BLOCK_CENTER instead.
     */
    RIGHT_CENTER: "19.0";
    /**
     * Elements are positioned on the right, below top-right elements, and flow
     * downwards. Consider using INLINE_END_BLOCK_START instead.
     */
    RIGHT_TOP: "20.0";
    /**
     * Elements are positioned in the center of the top row. Consider using
     * BLOCK_START_INLINE_CENTER instead.
     */
    TOP_CENTER: "21.0";
    /**
     * Elements are positioned in the top left and flow towards the middle.
     * Consider using BLOCK_START_INLINE_START instead.
     */
    TOP_LEFT: "22.0";
    /**
     * Elements are positioned in the top right and flow towards the middle.
     * Consider using BLOCK_START_INLINE_END instead.
     */
    TOP_RIGHT: "23.0";
}>;
type ControlPositionValue = (typeof ControlPosition)[keyof typeof ControlPosition];
/**
 * Converts a ControlPosition string value to a google.maps.ControlPosition value.
 *
 * This is only necessary because the Google Maps API uses a float value for the
 * ControlPosition.
 *
 * @param {string} value The ControlPosition value to convert
 * @returns {google.maps.ControlPosition}
 */
declare const convertControlPosition: (value: string) => google.maps.ControlPosition;
/**
 * Error status value for the Geocode object.
 *
 * https://developers.google.com/maps/documentation/javascript/reference/3.56/geocoder?hl=en#GeocoderStatus
 */
declare const GeocoderErrorStatus: Readonly<{
    ERROR: "ERROR";
    INVALID_REQUEST: "INVALID_REQUEST";
    OVER_QUERY_LIMIT: "OVER_QUERY_LIMIT";
    REQUEST_DENIED: "REQUEST_DENIED";
    UNKNOWN_ERROR: "UNKNOWN_ERROR";
}>;
type GeocoderErrorStatusValue = (typeof GeocoderErrorStatus)[keyof typeof GeocoderErrorStatus];
/**
 * The type of location returned by the Geocoder.
 *
 * https://developers.google.com/maps/documentation/javascript/reference/3.56/geocoder?hl=en#GeocoderLocationType
 */
declare const GeocoderLocationType: Readonly<{
    APPROXIMATE: "APPROXIMATE";
    GEOMETRIC_CENTER: "GEOMETRIC_CENTER";
    RANGE_INTERPOLATED: "RANGE_INTERPOLATED";
    ROOFTOP: "ROOFTOP";
}>;
type GeocoderLocationTypeValue = (typeof GeocoderLocationType)[keyof typeof GeocoderLocationType];
/**
 * Events that can be fired by the Loader.
 *
 * https://aptuitiv.github.io/gmaps-docs/api-reference/loader#events
 */
declare const LoaderEvents: Readonly<{
    LOAD: "load";
    MAP_LOAD: "map_load";
}>;
/**
 * Events that can be fired by the Map.
 *
 * This includes references to Google Maps events https://developers.google.com/maps/documentation/javascript/reference/map#Map-Events
 * and this library's custom events.
 */
declare const MapEvents: Readonly<{
    BOUNDS_CHANGED: "bounds_changed";
    CENTER_CHANGED: "center_changed";
    CLICK: "click";
    CONTEXT_MENU: "contextmenu";
    DBLCLICK: "dblclick";
    DRAG: "drag";
    DRAG_END: "dragend";
    DRAG_START: "dragstart";
    HEADING_CHANGED: "heading_changed";
    IDLE: "idle";
    IS_FRACTIONAL_ZOOM_ENABLED_CHANGED: "isfractionalzoomenabled_changed";
    MAP_CAPABILITIES_CHANGED: "mapcapabilities_changed";
    MAP_TYPE_ID_CHANGED: "maptypeid_changed";
    MOUSE_MOVE: "mousemove";
    MOUSE_OUT: "mouseout";
    MOUSE_OVER: "mouseover";
    PROJECTION_CHANGED: "projection_changed";
    RENDERING_TYPE_CHANGED: "renderingtype_changed";
    TILES_LOADED: "tilesloaded";
    TILT_CHANGED: "tilt_changed";
    ZOOM_CHANGED: "zoom_changed";
    LOCATION_ERROR: "locationerror";
    LOCATION_FOUND: "locationfound";
    READY: "ready";
}>;
/**
 * Style values for common MapTypesControls.
 *
 * https://developers.google.com/maps/documentation/javascript/reference/control#MapTypeControlStyle
 */
declare const MapTypeControlStyle: Readonly<{
    /**
     * Uses the default map type control. When the <code>DEFAULT</code> control
     * is shown, it will vary according to window size and other factors. The
     * <code>DEFAULT</code> control may change in future versions of the API.
     */
    DEFAULT: "0.0";
    /**
     * A dropdown menu for the screen realestate conscious.
     */
    DROPDOWN_MENU: "1.0";
    /**
     * The standard horizontal radio buttons bar.
     */
    HORIZONTAL_BAR: "2.0";
}>;
type MapTypeControlStyleValue = (typeof MapTypeControlStyle)[keyof typeof MapTypeControlStyle];
/**
 * Converts a MapTypeControlStyle string value to a google.maps.ControlPosition value.
 *
 * This is only necessary because the Google Maps API uses a float value for the
 * MapTypeControlStyle.
 *
 * @param {string} value The MapTypeControlStyle value to convert
 * @returns {google.maps.ControlPosition}
 */
declare const convertMapTypeControlStyle: (value: string) => google.maps.MapTypeControlStyle;
/**
 * Identifiers for common MapTypes.
 *
 * https://developers.google.com/maps/documentation/javascript/reference/map#MapTypeId
 */
declare const MapTypeId: Readonly<{
    /**
     * This map type displays a transparent layer of major streets on satellite
     * images.
     */
    HYBRID: "hybrid";
    /**
     * This map type displays a normal street map.
     */
    ROADMAP: "roadmap";
    /**
     * This map type displays satellite images.
     */
    SATELLITE: "satellite";
    /**
     * This map type displays maps with physical features such as terrain and
     * vegetation.
     */
    TERRAIN: "terrain";
}>;
type MapTypeIdValue = (typeof MapTypeId)[keyof typeof MapTypeId];
/**
 * Events that can be fired by the Marker.
 *
 * This includes references to Google Maps marker events https://developers.google.com/maps/documentation/javascript/reference/marker#Marker-Events
 * and this library's custom events.
 */
declare const MarkerEvents: Readonly<{
    ANIMATION_CHANGED: "animation_changed";
    CLICK: "click";
    CLICKABLE_CHANGED: "clickable_changed";
    CONTEXT_MENU: "contextmenu";
    CURSOR_CHANGED: "cursor_changed";
    DBLCLICK: "dblclick";
    DRAG: "drag";
    DRAG_END: "dragend";
    DRAGGABLE_CHANGED: "draggable_changed";
    DRAG_START: "dragstart";
    FLAT_CHANGED: "flat_changed";
    ICON_CHANGED: "icon_changed";
    MOUSE_DOWN: "mousedown";
    MOUSE_OUT: "mouseout";
    MOUSE_OVER: "mouseover";
    MOUSE_UP: "mouseup";
    POSITION_CHANGED: "position_changed";
    SHAPE_CHANGED: "shape_changed";
    TITLE_CHANGED: "title_changed";
    VISIBLE_CHANGED: "visible_changed";
    ZINDEX_CHANGED: "zindex_changed";
    READY: "ready";
}>;
/**
 * Events that can be fired by the Overlay.
 */
declare const OverlayEvents: Readonly<{
    OPEN: "open";
}>;
/**
 * Events that can be fired by the PlacesSearchBox.
 */
declare const PlacesSearchBoxEvents: Readonly<{
    PLACES_CHANGED: "places_changed";
}>;
/**
 * Events that can be fired by the Popup.
 */
declare const PopupEvents: Readonly<{
    OPEN: "open";
}>;
/**
 * The rendering type of the map.
 *
 * https://developers.google.com/maps/documentation/javascript/reference/map#RenderingType
 */
declare const RenderingType: Readonly<{
    RASTER: "RASTER";
    UNINITIALIZED: "UNINITIALIZED";
    VECTOR: "VECTOR";
}>;
type RenderingTypeValue = (typeof RenderingType)[keyof typeof RenderingType];
/**
 * Street view sources
 * https://developers.google.com/maps/documentation/javascript/reference/street-view-service#StreetViewSource
 */
declare const StreetViewSource: Readonly<{
    DEFAULT: "default";
    GOOGLE: "google";
    OUTDOOR: "outdoor";
}>;
type StreetViewSourceValue = (typeof StreetViewSource)[keyof typeof StreetViewSource];
/**
 * Build in symbols
 * https://developers.google.com/maps/documentation/javascript/symbols#predefined
 */
declare const SymbolPath: Readonly<{
    BACKWARD_CLOSED_ARROW: "BACKWARD_CLOSED_ARROW";
    BACKWARD_OPEN_ARROW: "BACKWARD_OPEN_ARROW";
    CIRCLE: "CIRCLE";
    FORWARD_CLOSED_ARROW: "FORWARD_CLOSED_ARROW";
    FORWARD_OPEN_ARROW: "FORWARD_OPEN_ARROW";
}>;
type SymbolPathValue = (typeof SymbolPath)[keyof typeof SymbolPath];
/**
 * Converts a SymbolPath string value to a google.maps.SymbolPath value.
 *
 * @param {string} value The SymbolPath value to convert
 * @returns {google.maps.SymbolPath}
 */
declare const convertSymbolPath: (value: string) => string;

type LatLngLiteral = {
    lat?: number | string;
    lng?: number | string;
};
type LatLngLiteralExpanded = {
    latitude: number | string;
    longitude: number | string;
};
type Latitude = number | number[] | string | string[] | LatLngLiteral | LatLngLiteralExpanded;
/**
 * The LatLng class to set up and manage latitude/longitude pairs
 */
declare class LatLng extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {Latitude|LatLng|google.maps.LatLng} latitude The latitude value or the latitude/longitude pair
     * @param {number|string} [longitude] The longitude value
     */
    constructor(latitude?: Latitude | LatLng | google.maps.LatLng, longitude?: number | string);
    /**
     * Get the latitude value
     *
     * @returns {number}
     */
    get latitude(): number;
    /**
     * Set the latitude value
     *
     * @param {number|string} latitude The latitude value. Ideally it's a number but it could be a number string
     */
    set latitude(latitude: number | string);
    /**
     * Get the latitude value (shortened version of the latitude property)
     *
     * @returns {number}
     */
    get lat(): number;
    /**
     * Set the latitude value
     *
     * @param {number|string} latitude The latitude value. Ideally it's a number but it could be a number string
     */
    set lat(latitude: number | string);
    /**
     * Get the longitude value
     *
     * @returns {number}
     */
    get longitude(): number;
    /**
     * Set the longitude value
     *
     * @param {number|string} longitude The longitude value. Ideally it's a number but it could be a number string
     */
    set longitude(longitude: number | string);
    /**
     * Get the longitude value (shortened version of the longitude property)
     *
     * @returns {number}
     */
    get lng(): number;
    /**
     * Set the longitude value
     *
     * @param {number|string} longitude The longitude value. Ideally it's a number but it could be a number string
     */
    set lng(longitude: number | string);
    /**
     * Returns a new copy of the latitude/longitude pair
     *
     * @returns {LatLng}
     */
    clone(): LatLng;
    /**
     * Tests to see if the given latitude/longitude pair is equal to this latitude/longitude pair
     *
     * @param {number[] | string[] | LatLngLiteral | LatLngLiteralExpanded | LatLng} other The latitude/longitude pair to compare to
     * @returns {boolean}
     */
    equals(other: number[] | string[] | LatLngLiteral | LatLngLiteralExpanded | LatLng): boolean;
    /**
     * Set the latitude/longitude pair
     *
     * @param {Latitude|LatLng} latitude The latitude value or the latitude/longitude pair
     * @param {number|string} longitude The longitude value
     * @returns {LatLng}
     */
    set(latitude: Latitude | LatLng | google.maps.LatLng, longitude?: number | string): LatLng;
    /**
     * Sets the latitude value
     *
     * @param {number|string} lat The latitude value. Ideally it's a number, but it could be a number string
     * @returns {LatLng}
     */
    setLat(lat: number | string): LatLng;
    /**
     * Returns the longitude value
     *
     * @returns {number}
     */
    getLat(): number;
    /**
     * Sets the longitude value
     *
     * @param {number|string} lng The longitude value. Ideally it's a number, but it could be a number string
     * @returns {LatLng}
     */
    setLng(lng: number | string): LatLng;
    /**
     * Returns the latitude value
     *
     * @returns {number}
     */
    getLng(): number;
    /**
     * Get the Google maps LatLng object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
     *
     * @returns {google.maps.LatLng|null}
     */
    toGoogle(): google.maps.LatLng | null;
    /**
     * Returns whether the latitude/longitude pair are valid values
     *
     * @returns {boolean}
     */
    isValid(): boolean;
    /**
     * Converts the latitude/longitude pair to a JSON object
     *
     * @returns {google.maps.LatLngLiteral}
     */
    toJson(): google.maps.LatLngLiteral;
}
type LatLngValue = number[] | string[] | LatLngLiteral | LatLngLiteralExpanded | LatLng | google.maps.LatLng;
/**
 * Helper function to set up a new LatLng object value
 *
 * @param {LatLngValue} [latitude] The latitude value or the latitude/longitude pair
 * @param {number|string} [longitude] The longitude value
 * @returns {LatLng}
 */
declare const latLng: (latitude?: LatLngValue | string | number, longitude?: number | string) => LatLng;

type PointObject = {
    x: number | string;
    y: number | string;
};
type XPoint = number | number[] | string | string[] | PointObject;
/**
 * The Point class to set up and manage x/y coordinates
 */
declare class Point extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {XPoint|Point} [x] The X value
     * @param {number|string} [y] The Y value
     */
    constructor(x?: XPoint | Point, y?: number | string);
    /**
     * Get the x value
     *
     * @returns {number}
     */
    get x(): number;
    /**
     * Set the x value
     *
     * @param {number|string} x The x value. Ideally it's a number but it could be a number string
     */
    set x(x: number | string);
    /**
     * Get the y value
     *
     * @returns {number}
     */
    get y(): number;
    /**
     * Set the y value
     *
     * @param {number|string} y The y value. Ideally it's a number but it could be a number string
     */
    set y(y: number | string);
    /**
     * Adds the x/y values to this point.
     *
     * This is the best way to either explicitly add an absolute x/y position, or to combine
     * two points together. The other point could include negative values.
     *
     * @param {PointValue} x The x value, or the Point object, or an array of [x, y] pairs, or a {x, y} object
     * @param {number|string} [y] The y value
     * @returns {Point}
     */
    add(x: PointValue, y?: number | string): Point;
    /**
     * Rounds the x/y values up to the nearest integer.
     * If the value is already an integer, it will return the same value.
     *
     * @returns {Point}
     */
    ceil(): Point;
    /**
     * Returns a new copy of the point
     *
     * @returns {Point}
     */
    clone(): Point;
    /**
     * Divides the x/y values by a number.
     *
     * @param {number|string} num The number to divide the x and y values by
     * @returns {Point}
     */
    divide(num: number | string): Point;
    /**
     * This returns the cartesian distance between this point and the given point.
     *
     * @param {PointValue} p The point to compare to
     * @returns {number}
     */
    distanceTo(p: PointValue): number;
    /**
     * Returns whether the current point is equal to the given point
     *
     * @param {PointValue} p The point value to compare
     * @returns {boolean}
     */
    equals(p: PointValue): boolean;
    /**
     * Returns a copy of the curent point with the x/y values rounded down to the nearest integer.
     * If the value is already an integer, it will return the same value.
     *
     * @returns {Point}
     */
    floor(): Point;
    /**
     * Get the x value
     *
     * @returns {number}
     */
    getX(): number;
    /**
     * Get the y value
     *
     * @returns {number}
     */
    getY(): number;
    /**
     * Returns whether the x/y pair are valid values
     *
     * @returns {boolean}
     */
    isValid(): boolean;
    /**
     * Multiplies the x/y values by a number
     *
     * @param {number|string} num The number to multiply the x and y values by
     * @returns {Point}
     */
    multiply(num: number | string): Point;
    /**
     * Rounds the x/y values to the nearest integer.
     *
     * @returns {Point}
     */
    round(): Point;
    /**
     * Set the x/y values
     *
     * @param {XPoint|Point} x The x value, or the Point object, or an array of [x, y] pairs, or a {x, y} object
     * @param {number|string} y The y value
     * @returns {Point}
     */
    set(x: XPoint | Point, y?: number | string): Point;
    /**
     * Set the x value
     *
     * @param {number|string} x The x value. Ideally it's a number but it could be a number string
     * @returns {Point}
     */
    setX(x: number | string): Point;
    /**
     * Set the y value
     *
     * @param {number|string} y The y value. Ideally it's a number but it could be a number string
     * @returns {Point}
     */
    setY(y: number | string): Point;
    /**
     * Subtract the x/y values to this point.
     *
     * The x/y values to subtract should ideally be absolute values to avoid confusion.
     * While they can include negative numbers, that may return unexpected results.
     *
     * @param {PointValue} x The x value, or the Point object, or an array of [x, y] pairs, or a {x, y} object
     * @param {number|string} [y] The y value
     * @returns {Point}
     */
    subtract(x: PointValue, y?: number | string): Point;
    /**
     * Returns the Google maps point object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/coordinates#Point
     *
     * @returns {google.maps.Point}
     */
    toGoogle(): google.maps.Point;
    /**
     * Change the x/y values to the integer part of a number by removing any fractional digits.
     *
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc
     *
     * @returns {Point}
     */
    trunc(): Point;
}
type PointValue = Point | number | number[] | string | string[] | PointObject;
/**
 * Helper function to set up the point object
 *
 * @param {PointValue} [x] The x value, or the Point object, or an array of [x, y] pairs, or a {x, y} object
 * @param {number|string} [y] The y value
 * @returns {Point}
 */
declare const point: (x?: PointValue, y?: number | string) => Point;

type Event$1 = {
    domEvent?: MouseEvent | TouchEvent | PointerEvent | KeyboardEvent | Event$1;
    latLng?: LatLng;
    placeId?: string;
    pixel?: Point;
    stop?: () => void;
    type: string;
};
type EventCallback = (event: Event$1) => void;
type EventConfig = {
    callImmediate?: boolean;
    context?: object;
    once?: boolean;
    only?: boolean;
};
type EventListenerOptions = {
    once?: boolean;
};
/**
 * Evented class to add syntatic sugar to handling events
 */
declare class Evented extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {string} objectType The object type for the class
     * @param {string} testObject The object that needs Google maps. This should be the name of the object that calls this method.
     * @param {string} [testLibrary] An optional Google maps library class to check for. This needs to be part of the google.maps object.
     */
    constructor(objectType: string, testObject: string, testLibrary?: string);
    /**
     * Dispatch an event
     *
     * @param {string} event The event to dispatch
     * @param {Event} [data] The data to pass to the event listener callback function.
     * @returns {Evented}
     */
    dispatch(event: string, data?: any): Evented;
    /**
     * Test if there are any listeners for the given event type
     *
     * Optionally you can test if there are any listeners for the given event type and callback
     *
     * @param {string} type The event type to test for
     * @param {EventCallback} callback Optional callback function to include in the test
     * @returns {boolean}
     */
    hasListener(type: string, callback?: EventCallback): boolean;
    /**
     * Removes the event listener
     *
     * There are three ways to remove event listeners:
     * 1. Remove a specific event listener
     *      this.off('click', onClickFunction);
     *      this.off('click', onClickFunction, options);
     * 2. Remove all listeners for a given event type
     *      this.off('click');
     * 3. Remove all listeners for all event types
     *     this.off();
     *     this.offAll();
     *
     * @param {string} [type] The event type
     * @param {EventCallback} [callback] The callback function to include when finding the event to remove
     * @param {EventListenerOptions} [options] The options to use when finding the event to remove
     */
    off(type?: string, callback?: EventCallback, options?: EventListenerOptions): void;
    /**
     * Removes all event listeners
     */
    offAll(): void;
    /**
     * Add an event listener to the object
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener callback function
     * @param {EventConfig} [config] Configuration for the event.
     */
    on(type: string, callback: EventCallback, config?: EventConfig): void;
    /**
     * Add an event listener to the object. It will be called immediately if the event has already been dispatched.
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener callback function
     * @param {EventConfig} [config] Configuration for the event.
     */
    onImmediate(type: string, callback: EventCallback, config?: EventConfig): void;
    /**
     * Sets up an event listener that will only be called once
     *
     * @param {string} type The event type
     * @param {EventCallback} [callback] The event listener callback function
     * @param {EventConfig} [config] Configuration for the event.
     */
    once(type: string, callback?: EventCallback, config?: EventConfig): void;
    /**
     * Sets up an event listener that will only be called once. It will be called immediately if the event has already been dispatched.
     *
     * @param {string} type The event type
     * @param {EventCallback} [callback] The event listener callback function
     * @param {EventConfig} [config] Configuration for the event.
     */
    onceImmediate(type: string, callback?: EventCallback, config?: EventConfig): void;
    /**
     * Sets up an event listener that will have only one event listener for this type.
     *
     * It will be called immediately if the event has already been dispatched.
     *
     * The difference between this and on() is that only() will only set up one event listener for this type.
     *
     * @param {string} type The event type
     * @param {EventCallback} [callback] The event listener callback function
     * @param {EventConfig} [config] Configuration for the event.
     */
    only(type: string, callback: EventCallback, config?: EventConfig): void;
    /**
     * Sets up an event listener that will only be called once and only one event listener for this type will be set up.
     *
     * It will be called immediately if the event has already been dispatched.
     *
     * The difference between this and once() is that onlyOnce() will only set up one event listener for this type.
     *
     * @param {string} type The event type
     * @param {EventCallback} [callback] The event listener callback function
     * @param {EventConfig} [config] Configuration for the event.
     */
    onlyOnce(type: string, callback: EventCallback, config?: EventConfig): void;
    /**
     * Set the Google maps MVC object
     *
     * This is the Google object that the object represents. Event listeners will be added to it.
     *
     * This should only be called from the class that extends this class.
     * This is not intended to be called from outside of this library.
     *
     * @internal
     * @param {google.maps.MVCObject| google.maps.marker.AdvancedMarkerElement} googleObject The Google maps MVC object
     */
    setEventGoogleObject(googleObject: google.maps.MVCObject | google.maps.marker.AdvancedMarkerElement): void;
    /**
     * Triggers an event
     *
     * Alias to dispatch()
     *
     * @param {string} event The event to dispatch
     * @param {Event} [data] The data to pass to the event listener callback function.
     * @returns {Evented}
     */
    trigger(event: string, data?: any): Evented;
}

type LatLngBoundsLiteral = {
    /**
     * East longitude in degrees. Values outside the range [-180, 180] will be
     * wrapped to the range [-180, 180). For example, a value of -190 will be
     * converted to 170. A value of 190 will be converted to -170. This reflects
     * the fact that longitudes wrap around the globe.
     */
    east: number;
    /**
     * North latitude in degrees. Values will be clamped to the range [-90, 90].
     * This means that if the value specified is less than -90, it will be set
     * to -90. And if the value is greater than 90, it will be set to 90.
     */
    north: number;
    /**
     * South latitude in degrees. Values will be clamped to the range [-90, 90].
     * This means that if the value specified is less than -90, it will be set
     * to -90. And if the value is greater than 90, it will be set to 90.
     */
    south: number;
    /**
     * West longitude in degrees. Values outside the range [-180, 180] will be
     * wrapped to the range [-180, 180). For example, a value of -190 will be
     * converted to 170. A value of 190 will be converted to -170. This reflects
     * the fact that longitudes wrap around the globe.
     */
    west: number;
};
type LatLngBoundsEdges = {
    ne: LatLngValue;
    sw: LatLngValue;
};
/**
 * The LatLngBounds class to set up and manage latitude/longitude bounds
 */
declare class LatLngBounds extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {LatLngValue | LatLngValue[]} [latLngValue] The latitude/longitude value(s). If not set then add points with the extend method.
     *      See comments on the extended method for the types of values that latLngValue can be.
     */
    constructor(latLngValue?: LatLngValue | LatLngValue[] | LatLngBoundsEdges | LatLngBoundsLiteral);
    /**
     * Returns whether the the given LatLng value is within this bounds
     *
     * @param {LatLngValue} latLngValue The LatLng value to test
     * @returns {boolean}
     */
    contains(latLngValue: LatLngValue): boolean;
    /**
     * Returns whether this bounds approximately equals the given bounds
     *
     * @param {LatLngBounds} other The LatLngBounds object to compare
     * @returns {Promise<boolean>}
     */
    equals(other: LatLngBounds): Promise<boolean>;
    /**
     * Extends this bounds to contain the given point
     *
     * https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds.extend
     *
     * The latLngValue parameter can be:
     * - an array of [lat, lng] pairs: [[lat, lng], [lat, lng], ...]
     * - an array of {lat, lng} objects (LatLngLiteral[]): [{lat, lng}, {lat, lng}, ...]
     * - an array of LatLng objects: [LatLng, LatLng, ...]
     * - a [lat, lng] pair
     * - a {lat, lng} object (LatLngLiteral)
     *
     * @param {LatLngValue | LatLngValue[]} latLngValue The latitude/longitude value(s)
     * @returns {LatLngBounds}
     */
    extend(latLngValue: LatLngValue | LatLngValue[]): LatLngBounds;
    /**
     * Get the center of the LatLngBounds
     *
     * @returns {LatLng}
     */
    getCenter(): LatLng;
    /**
     * Get the north-east corner of the LatLngBounds
     *
     * @returns {LatLng}
     */
    getNorthEast(): LatLng;
    /**
     * Get the south-west corner of the LatLngBounds
     *
     * @returns {LatLng}
     */
    getSouthWest(): LatLng;
    /**
     * Initialize the lat/lng bounds object so that the Google maps library is available
     *
     * This is not intended to be called outside of this library.
     *
     * @internal
     * @returns {Promise<void>}
     */
    init(): Promise<void>;
    /**
     * Returns whether this bounds shares any points with the other bounds
     *
     * @param {LatLngBounds} other The LatLngBounds object to compare
     * @returns {Promise<boolean>}
     */
    intersects(other: LatLngBounds): Promise<boolean>;
    /**
     * Returns whether this bounds is empty
     *
     * @returns {boolean}
     */
    isEmpty(): boolean;
    /**
     * Get the Google maps LatLngBounds object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds
     *
     * @returns {Promise<google.maps.LatLngBounds>}
     */
    toGoogle(): Promise<google.maps.LatLngBounds>;
    /**
     * Converts the LatLngBounds object to a JSON object
     *
     * @returns {google.maps.LatLngBoundsLiteral}
     */
    toJson(): google.maps.LatLngBoundsLiteral;
    /**
     * Converts the LatLngBounds object to a string
     *
     * @returns {string}
     */
    toString(): string;
    /**
     * Returns the LatLngBounds object as a string that can be used in a URL
     *
     * @param {number} [precision] The number of decimal places to round the lat/lng values to
     * @returns {string}
     */
    toUrlValue(precision?: number): string;
    /**
     * Extends this bounds to contain the union of this and the given bounds
     *
     * @param {LatLngBounds} other The LatLngBounds object to join with
     * @returns {Promise<void>}
     */
    union(other: LatLngBounds | google.maps.LatLngBounds): Promise<void>;
}
type LatLngBoundsValue = LatLngValue | LatLngValue[] | LatLngBoundsEdges | LatLngBoundsLiteral | LatLngBounds;
/**
 * Helper function to set up the LatLngBounds object
 *
 * See comments on the extended method in the LatLngBounds class for the types of values
 * that latLngValue can be.
 *
 * @param {LatLngBoundsValue} [latLngValue] The latitude/longitude bounds value
 * @returns {LatLngBounds}
 */
declare const latLngBounds: (latLngValue?: LatLngBoundsValue) => LatLngBounds;

declare class GeocodeAddressTypes {
    #private;
    /**
     * Constructor
     *
     * @param {string[]} [types] The types for the address
     */
    constructor(types?: string[]);
    /**
     * Gets the address types
     *
     * @returns {string[]}
     */
    getTypes(): string[];
    /**
     * Returns if the address is an administrative area level 1.
     *
     * This is the highest level of administrative area below the country level.
     * In the United States, these administrative levels are states.
     *
     * @returns {boolean}
     */
    isAdministrativeAreaLevel1(): boolean;
    /**
     * Returns if the address is an administrative area level 2.
     *
     * Within the United States this would be a county.
     *
     * @returns {boolean}
     */
    isAdministrativeAreaLevel2(): boolean;
    /**
     * Returns if the address is an administrative area level 3.
     *
     * This is a minor civil division.
     *
     * @returns {boolean}
     */
    isAdministrativeAreaLevel3(): boolean;
    /**
     * Returns if the address is an administrative area level 4.
     *
     * This is a minor civil division.
     *
     * @returns {boolean}
     */
    isAdministrativeAreaLevel4(): boolean;
    /**
     * Returns if the address is an administrative area level 5.
     *
     * This is a minor civil division.
     *
     * @returns {boolean}
     */
    isAdministrativeAreaLevel5(): boolean;
    /**
     * Returns if the address is an administrative area level 6.
     *
     * This is a minor civil division.
     *
     * @returns {boolean}
     */
    isAdministrativeAreaLevel6(): boolean;
    /**
     * Returns if the address is an administrative area level 7.
     *
     * This is a minor civil division.
     *
     * @returns {boolean}
     */
    isAdministrativeAreaLevel7(): boolean;
    /**
     * Returns if the address is an airport.
     *
     * @returns {boolean}
     */
    isAirport(): boolean;
    /**
     * Returns if the address is a bus station or bus stop.
     *
     * @returns {boolean}
     */
    isBusStation(): boolean;
    /**
     * Returns if the address is a city.
     *
     * This is an alias for isLocality()
     *
     * @returns {boolean}
     */
    isCity(): boolean;
    /**
     * Returns if the address is a commonly used alternative name for the entity.
     *
     * @returns {boolean}
     */
    isColloquialArea(): boolean;
    /**
     * Returns if the address is a country.
     *
     * @returns {boolean}
     */
    isCountry(): boolean;
    /**
     * Returns if the address is a county.
     *
     * This is an alias for isAdministrativeAreaLevel2()
     *
     * @returns {boolean}
     */
    isCounty(): boolean;
    /**
     * Returns if the address is a place that hasn't yet been categorized.
     *
     * @returns {boolean}
     */
    isEstablishment(): boolean;
    /**
     * Returns if the address is a floor in a building.
     *
     * @returns {boolean}
     */
    isFloor(): boolean;
    /**
     * Returns if the address is a major intersection, usually of two major roads.
     *
     * @returns {boolean}
     */
    isIntersection(): boolean;
    /**
     * Returns if the address is a landmark.
     *
     * @returns {boolean}
     */
    isLandmark(): boolean;
    /**
     * Returns if the address is a locality.
     *
     * @returns {boolean}
     */
    isLocality(): boolean;
    /**
     * Returns if the address is a prominent natural feature.
     *
     * @returns {boolean}
     */
    isNaturalFeature(): boolean;
    /**
     * Returns if the address is a neighborhood.
     *
     * @returns {boolean}
     */
    isNeighborhood(): boolean;
    /**
     * Returns if the address is a plus code.
     *
     * See https://plus.codes/ for more information.
     *
     * @returns {boolean}
     */
    isPlusCode(): boolean;
    /**
     * Returns if the address is a named park.
     *
     * @returns {boolean}
     */
    isPark(): boolean;
    /**
     * Returns if the address is a parking lot.
     *
     * @returns {boolean}
     */
    isParking(): boolean;
    /**
     * Returns if the address is a point of interest.
     *
     * @returns {boolean}
     */
    isPointOfInterest(): boolean;
    /**
     * Returns if the address is a political entity. This would usually be some type of civil administration.
     *
     * @returns {boolean}
     */
    isPolitical(): boolean;
    /**
     * Returns if the address is a specific post box.
     *
     * @returns {boolean}
     */
    isPostBox(): boolean;
    /**
     * Returns if the address is a postal code.
     *
     * @returns {boolean}
     */
    isPostalCode(): boolean;
    /**
     * Returns if the address is a grouping of geographic areas.
     *
     * @returns {boolean}
     */
    isPostalTown(): boolean;
    /**
     * Returns if the location is a named location, usually a building or collection of buildings with a common name.
     *
     * @returns {boolean}
     */
    isPremise(): boolean;
    /**
     * Returns if the address is a room of a building.
     *
     * @returns {boolean}
     */
    isRoom(): boolean;
    /**
     * Returns if the address is a named route (such as "US 101").
     *
     * @returns {boolean}
     */
    isRoute(): boolean;
    /**
     * Returns if the address is a state or province.
     *
     * This is an alias for isAdministrativeAreaLevel1()
     *
     * @returns {boolean}
     */
    isState(): boolean;
    /**
     * Returns if the address is a street address
     *
     * @returns {boolean}
     */
    isStreetAddress(): boolean;
    /**
     * Returns if the address indicates a precise street number.
     *
     * @returns {boolean}
     */
    isStreetNumber(): boolean;
    /**
     * Returns if the address is a sublocality.
     *
     * @returns {boolean}
     */
    isSubLocality(): boolean;
    /**
     * Returns if the address is a sublocality level 1.
     *
     * @returns {boolean}
     */
    isSubLocalityLevel1(): boolean;
    /**
     * Returns if the address is a sublocality level 2.
     *
     * @returns {boolean}
     */
    isSubLocalityLevel2(): boolean;
    /**
     * Returns if the address is a sublocality level 3.
     *
     * @returns {boolean}
     */
    isSubLocalityLevel3(): boolean;
    /**
     * Returns if the address is a sublocality level 4.
     *
     * @returns {boolean}
     */
    isSubLocalityLevel4(): boolean;
    /**
     * Returns if the address is a sublocality level 5.
     *
     * @returns {boolean}
     */
    isSubLocalityLevel5(): boolean;
    /**
     * Returns if the location is a subpremise.
     *
     * This is the next level below a premise, usually a single building in a collection of buildings with a common name.
     *
     * @returns {boolean}
     */
    isSubPremise(): boolean;
    /**
     * Returns if the address is a town.
     *
     * This is an alias for isLocality()
     *
     * @returns {boolean}
     */
    isTown(): boolean;
    /**
     * Returns if the address is a train station.
     *
     * @returns {boolean}
     */
    isTrainStation(): boolean;
    /**
     * Returns if the address is a transit station.
     *
     * @returns {boolean}
     */
    isTransitStation(): boolean;
}

/**
 * The geocode address component class
 */
declare class GeocodeAddressComponent extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {google.maps.GeocoderAddressComponent} component The Google Maps GeocoderAddressComponent object
     */
    constructor(component: google.maps.GeocoderAddressComponent);
    /**
     * Gets the full name of the address component
     *
     * @returns {string}
     */
    getLongName(): string;
    /**
     * Gets the abbreviated name of the address component
     *
     * @returns {string}
     */
    getShortName(): string;
    /**
     * Gets the array of types objects for the address component
     *
     * @returns {GeocodeAddressTypes}
     */
    getTypes(): GeocodeAddressTypes;
    /**
     * Gets the array of types for the address component
     *
     * https://developers.google.com/maps/documentation/javascript/geocoding?hl=en#GeocodingAddressTypes
     *
     * @returns {string[]}
     */
    getTypesArray(): string[];
    /**
     * Get the original Google Maps GeocoderAddressComponent object
     *
     * @returns {google.maps.GeocoderAddressComponent}
     */
    toGoogle(): google.maps.GeocoderAddressComponent;
}

/**
 * The geocode result class
 *
 * This is intended to be an internal class and not instantiated directly outside this library.
 * It is used to wrap the Google Maps GeocoderResult object.
 */
declare class GeocodeResult extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {google.maps.GeocoderResult} [result] The Google Maps GeocoderResult object
     */
    constructor(result?: google.maps.GeocoderResult);
    /**
     * Get the address component objects
     *
     * @returns {GeocodeAddressComponent[]}
     */
    getAddressComponents(): GeocodeAddressComponent[];
    /**
     * Get the precise bounds of the result, if available
     *
     * @returns {LatLngBounds|undefined}
     */
    getBounds(): LatLngBounds | undefined;
    /**
     * Get the compound plus code associated with the location
     *
     * @returns {string}
     */
    getCompoundPlusCode(): string;
    /**
     * Gets the formatted address for the location.
     *
     * @returns {string}
     */
    getFormattedAddress(): string;
    /**
     * Get the latitude of the location.
     *
     * This is a shorcut to getting the geometry location latitude.
     *
     * @returns {number|undefined}
     */
    getLatitude(): number;
    /**
     * Gets the LatLng object for the result
     *
     * @returns {LatLng|undefined}
     */
    getLocation(): LatLng | undefined;
    /**
     * Gets the location type
     *
     * @returns {string}
     */
    getLocationType(): string;
    /**
     * Get the longitude of the location.
     *
     * This is a shorcut to getting the geometry location longitude.
     *
     * @returns {number|undefined}
     */
    getLongitude(): number;
    /**
     * Get the place id for the location.
     *
     * @returns {string}
     */
    getPlaceId(): string;
    /**
     * Get the plus code associated with the location
     *
     * @returns {string}
     */
    getPlusCode(): string;
    /**
     * Gets the postal code localities for the location.
     *
     * This is only populated when the result is a postal code that contains multiple localities.
     *
     * @returns {string[]}
     */
    getPostalCodeLocalities(): string[];
    /**
     * Gets the types object for the returned geocoded element.
     *
     * https://developers.google.com/maps/documentation/javascript/geocoding?hl=en#GeocodingAddressTypes
     *
     * @returns {GeocodeAddressTypes}
     */
    getTypes(): GeocodeAddressTypes;
    /**
     * Gets the types for the returned geocoded element.
     *
     * https://developers.google.com/maps/documentation/javascript/geocoding?hl=en#GeocodingAddressTypes
     *
     * @returns {string[]}
     */
    getTypesArray(): string[];
    /**
     * Returns if the location is an approximate location.
     *
     * @returns {boolean}
     */
    isLocationApproximate(): boolean;
    /**
     * Returns if the location is a geometic center of a result.
     *
     * @returns {boolean}
     */
    isLocationGeometricCenter(): boolean;
    /**
     * Returns if the location is an approximation interpolated between two precise locations.
     *
     * @returns {boolean}
     */
    isLocationRangeInterpolated(): boolean;
    /**
     * Returns if the location is a rooftop location, which is the most precise location available.
     *
     * @returns {boolean}
     */
    isLocationRooftop(): boolean;
    /**
     * Returns if the location is a partial match for the original request.
     *
     * @returns {boolean}
     */
    isPartialMatch(): boolean;
    /**
     * Get the original Google Maps GeocoderResult object
     *
     * If the result is empty, an empty object is returned.
     *
     * @returns {google.maps.GeocoderResult | object}
     */
    toGoogle(): google.maps.GeocoderResult | object;
}

/**
 * The geocode result class
 *
 * This is intended to be an internal class and not instantiated directly outside this library.
 * It is used to wrap the array of Google Maps GeocoderResult objects and hold them as GeocodeResult objects.
 */
declare class GeocodeResults extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {google.maps.GeocoderResult[]} [results] The Google Maps GeocoderResult objects
     */
    constructor(results?: google.maps.GeocoderResult[]);
    /**
     * Gets the first result
     *
     * @returns {GeocodeResult}
     */
    getFirst(): GeocodeResult;
    /**
     * Returns the results
     *
     * @returns {GeocodeResult[]}
     */
    getResults(): GeocodeResult[];
    /**
     * Returns whether any results were found
     *
     * @returns {boolean}
     */
    hasResults(): boolean;
}

type GeocodeComponentRestrictions = {
    administrativeArea?: string;
    country?: string;
    locality?: string;
    postalCode?: string;
    route?: string;
};
type GeocodeOptions = {
    address?: string;
    bounds?: LatLngBoundsValue;
    componentRestrictions?: GeocodeComponentRestrictions;
    language?: string;
    location?: LatLngValue;
    placeId?: string;
    region?: string;
};
/**
 * The Geocode class
 */
declare class Geocode extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {GeocodeOptions} [options] The Geocode options
     */
    constructor(options: GeocodeOptions);
    /**
     * Returns the address
     *
     * @returns {string|undefined}
     */
    get address(): string | undefined;
    /**
     * Sets the address to geocode
     *
     * @param {string} address The address to geocode
     */
    set address(address: string);
    /**
     * Returns the bounds
     *
     * @returns {LatLngBounds|undefined}
     */
    get bounds(): LatLngBounds | undefined;
    /**
     * Sets the bounds within which to bias geocode results more prominently
     *
     * @param {LatLngBoundsValue} bounds The bounds within which to bias geocode results more prominently
     */
    set bounds(bounds: LatLngBoundsValue);
    /**
     * Get the component restrictions
     *
     * @returns {GeocodeComponentRestrictions|undefined}
     */
    get componentRestrictions(): GeocodeComponentRestrictions | undefined;
    /**
     * Set the component restrictions
     *
     * @param {GeocodeComponentRestrictions} componentRestrictions The component restrictions
     */
    set componentRestrictions(componentRestrictions: GeocodeComponentRestrictions);
    /**
     * Get the language to use for the geocode
     *
     * @returns {string|undefined}
     */
    get language(): string | undefined;
    /**
     * Set the language to use for the geocode
     *
     * See https://developers.google.com/maps/faq#languagesupport for the list of supported languages
     *
     * @param {string} language The language to use for the geocode
     */
    set language(language: string);
    /**
     * Get the location to geocode
     *
     * @returns {LatLng|undefined}
     */
    get location(): LatLng | undefined;
    /**
     * Set the location to geocode
     *
     * @param {LatLngValue} location The location to geocode
     */
    set location(location: LatLngValue);
    /**
     * Get the place id
     *
     * @returns {string|undefined}
     */
    get placeId(): string | undefined;
    /**
     * Set the place id
     *
     * @param {string} placeId The place id
     */
    set placeId(placeId: string);
    /**
     * Get the region code
     *
     * @returns {string|undefined}
     */
    get region(): string | undefined;
    /**
     * Set the region code
     *
     * @param {string} region The region code
     */
    set region(region: string);
    /**
     * Call the Google Maps Geocoder service
     *
     * Alias for the geocode method
     *
     * @param {GeocodeOptions} [options] The Geocode options
     * @returns {Promise<GeocodeResults>}
     */
    fetch(options?: GeocodeOptions): Promise<GeocodeResults>;
    /**
     * Call the Google Maps Geocoder service
     *
     * @param {GeocodeOptions} [options] The Geocode options
     * @returns {Promise<GeocodeResults>}
     */
    geocode(options?: GeocodeOptions): Promise<GeocodeResults>;
    /**
     * Set the address to geocode
     *
     * @param {string} address The address to geocode
     * @returns {Geocode}
     */
    setAddress(address: string): Geocode;
    /**
     * Set the bounds within which to bias geocode results more prominently
     *
     * @param {LatLngBoundsValue} bounds The bounds within which to bias geocode results more prominently
     * @returns {Geocode}
     */
    setBounds(bounds: LatLngBoundsValue): Geocode;
    /**
     * Set the component restrictions
     *
     * @param {GeocodeComponentRestrictions} componentRestrictions The component restrictions
     * @returns {Geocode}
     */
    setComponentRestrictions(componentRestrictions: GeocodeComponentRestrictions): Geocode;
    /**
     * Set the language to use for the geocode
     * See https://developers.google.com/maps/faq#languagesupport for the list of supported languages
     *
     * @param {string} language The language to use for the geocode
     * @returns {Geocode}
     */
    setLanguage(language: string): Geocode;
    /**
     * Set the location to geocode
     *
     * @param {LatLngValue} location The location to geocode
     * @returns {Geocode}
     */
    setLocation(location: LatLngValue): Geocode;
    /**
     * Set the place id
     *
     * @param {string} placeId The place id
     * @returns {Geocode}
     */
    setPlaceId(placeId: string): Geocode;
    /**
     * Set the region code
     *
     * @param {string} region The region code
     * @returns {Geocode}
     */
    setRegion(region: string): Geocode;
    /**
     * Sets the options for the popup
     *
     * @param {GeocodeOptions} options Geocode options
     * @returns {Geocode}
     */
    setOptions(options: GeocodeOptions): Geocode;
}
type GeocodeValue = Geocode | GeocodeOptions;
/**
 * Helper function to set up a new Geocode object value
 *
 * @param {GeocodeValue} [options] The options for the Geocode object
 * @returns {Geocode}
 */
declare const geocode: (options?: GeocodeValue) => Geocode;

/**
 * Returns if the value is boolean
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
declare const isBoolean: (thing: any) => thing is boolean;
/**
 * Tests to see if the value is defined
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
declare const isDefined: <T>(thing: any) => thing is T;
/**
 * Returns if the thing is a function
 *
 * @param {any} thing The thing to test
 * @returns {boolean}
 */
declare const isFunction: (thing: any) => thing is Function;
/**
 * Returns if the value is null.
 *
 * @param {any} thing The thing to test
 * @returns {boolean}
 */
declare const isNull: (thing: any) => thing is null;
/**
 * Returns if the value is a valid number
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
declare const isNumber: (thing: any) => thing is number;
/**
 * Returns if the given value is a string that represents a numerical value
 *   e.g. returns true for `"34"` and false for `"text34"` and `34`
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
declare const isNumberString: (thing: any) => thing is string;
/**
 * Returns if the given value is a number or string that represents a numerical value
 *   e.g. returns true for 34 or "34" and false for "text34" and "text"
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
declare const isNumberOrNumberString: (thing: any) => thing is number | string;
/**
 * Returns if the value is a string
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
declare const isString: (thing: any) => thing is string;
/**
 * Returns if the value is string and has a length greater than 0
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
declare const isStringWithValue: (thing: any) => thing is string;
/**
 * Returns if the value is a valid string or number
 *
 * @param {unknown} thing The value to test against
 * @returns {boolean}
 */
declare const isStringOrNumber: (thing: unknown) => thing is string | number;
/**
 * Returns if the value is undefined
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
declare const isUndefined: (thing: any) => thing is undefined;
/**
 * Returns if the value is null or undefined
 *
 * @param {any} thing The thing to test
 * @returns {boolean}
 */
declare const isNullOrUndefined: (thing: any) => thing is null | undefined;
/**
 * Get the number value for the given thing
 * If the thing is a number, return it
 * If the thing is a string that represents a number, return the number
 * Otherwise, return NaN
 *
 * @param {any} thing The value to convert to a number
 * @returns {number|typeof NaN}
 */
declare const getNumber: (thing: any) => number | typeof NaN;
/**
 * Converts a value to a boolean
 *
 * The following values are considered true:
 * - true (boolean)
 * - 'true' (string)
 * - 'yes'
 * - 1 (number)
 * - '1' (string)
 *
 * @param {any} thing The value to convert to a boolean
 * @returns {boolean}
 */
declare const getBoolean: (thing: any) => boolean;
/**
 * Returns if the value is an object
 *
 * https://attacomsian.com/blog/javascript-check-variable-is-object
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
declare const isObject: <T = object>(thing: any) => thing is T;
/**
 * Returns if the value is an object
 *
 * https://attacomsian.com/blog/javascript-check-variable-is-object
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
declare const isObjectWithValues: <T = object>(thing: any) => thing is T;
/**
 * Returns if the thing is a Promise function
 *
 * It's assumed to be a promise if the thing exists and "thing.then" is a function
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
declare const isPromise: <T = any>(thing: any) => thing is Promise<T>;
/**
 * Get the pixel location of the element from the LagLng value
 *
 * @param {google.maps.Map} map The Google map object
 * @param {google.maps.LatLng} position The Google maps LatLng object
 * @returns {google.maps.Point}
 */
declare const getPixelsFromLatLng: (map: google.maps.Map, position: google.maps.LatLng) => google.maps.Point;
/**
 * Checks to see if Google maps has been loaded
 *
 * @param {string} object The object that needs Google maps
 * @param {string} [library] An optional Google maps library class to check for. This needs to be part of the google.maps object
 * @param {boolean} [throwError] An optional flag to throw an error if the Google maps library is not loaded
 * @returns {boolean}
 */
declare const checkForGoogleMaps: (object: string, library?: string, throwError?: boolean) => boolean;
/**
 * Get the size value with a unit
 *
 * @param {number|string} value The value to check
 * @param {string} defaultUnit The unit to use if the value is a number or a string that does not have a unit
 * @param {string[]} allowedUnits The allowed unites.
 * @param {boolean} allowNegative If the number can be negative
 * @returns {string|boolean} The value with the unit or false if the value is invalid
 */
declare const getSizeWithUnit: (value: string | number, defaultUnit?: string, allowedUnits?: string[], allowNegative?: boolean) => boolean | string;
/**
 * Compare two objects to see if they are equal
 *
 * @param {any} a The first object to compare
 * @param {any} b The second object to compare
 * @returns {boolean}
 */
declare const objectEquals: (a: any, b: any) => boolean;
/**
 * Tests to see if the object is a valid object and if the key is a valid key
 *
 * @param {any} obj The object to test
 * @param {string} key The object key to test
 * @returns {boolean}
 */
declare const objectHasValue: (obj: any, key: string) => boolean;
/**
 * Call the callback function if it is a function
 *
 * @param {Function|undefined} callback The callback function to call
 * @param {any[]} args The arguments to pass to the callback function
 */
declare const callCallback: (callback: Function | undefined, ...args: any[]) => void;

type AutocompleteSearchBoxOptions = {
    bounds?: LatLngBoundsValue;
    input: string | HTMLInputElement;
    countryRestriction?: string | string[];
    fields?: string[];
    strictBounds?: boolean;
    types?: string[];
};
type AutocompleteSearchBoxEvent = 'place_changed';
type AutocompleteSearchBoxEventObject = Event & {
    place: google.maps.places.PlaceResult;
    bounds: LatLngBounds;
};
type AutocompleteSearchBoxEventCallback = (event: AutocompleteSearchBoxEventObject) => void;
/**
 * The AutocompleteSearchBox class
 */
declare class AutocompleteSearchBox extends Evented {
    #private;
    /**
     * Constructor
     *
     * @param {string | HTMLInputElement | AutocompleteSearchBoxOptions} input The input reference or the options
     * @param {AutocompleteSearchBoxOptions} [options] The places autocomplete search box options if the input is reference to the input element
     */
    constructor(input: string | HTMLInputElement | AutocompleteSearchBoxOptions, options?: AutocompleteSearchBoxOptions);
    /**
     * Get the bounds to which query predictions are biased.
     *
     * @returns {LatLngBounds | undefined}
     */
    get bounds(): LatLngBounds | undefined;
    /**
     * Sets the region to use for biasing query predictions.
     *
     * Results will only be biased towards this area and not be completely restricted to it.
     *
     * @param {LatLngBoundsValue} value The bounds to set
     */
    set bounds(value: LatLngBoundsValue);
    /**
     * Sets the country or countries to use for biasing query predictions.
     *
     * @param {string | string[] | null} value The country restriction to set
     */
    set countryRestriction(value: string | string[] | null);
    /**
     * Get the country or countries to use for biasing query predictions.
     *
     * @returns {string | string[] | null}
     */
    get countryRestriction(): string | string[] | null;
    /**
     * Set the fields to be included for the Place in the details response when the details are successfully retrieved.
     *
     * @param {string | string[]} value The fields to set
     */
    set fields(value: string | string[]);
    /**
     * Get the fields to be included for the Place in the details response when the details are successfully retrieved.
     *
     * @returns {string[]}
     */
    get fields(): string[];
    /**
     * Get the input reference
     *
     * @returns {HTMLInputElement | undefined}
     */
    get input(): HTMLInputElement | undefined;
    /**
     * Set the input reference
     *
     * @param {string | HTMLInputElement} value The input HTMLInputElement or the selector for the input element
     */
    set input(value: string | HTMLInputElement);
    /**
     * Get whether the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.
     *
     * @returns {boolean}
     */
    get strictBounds(): boolean;
    /**
     * Set that the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.
     *
     * Setting strictBounds to false (which is the default) will make the results biased towards, but not restricted to, places contained within the bounds.
     *
     * @param {boolean} value The value to set
     */
    set strictBounds(value: boolean);
    /**
     * Get the types of predictions to be returned.
     *
     * @returns {string[] | undefined}
     */
    get types(): string[] | undefined;
    /**
     * Set the types of predictions to be returned.
     *
     * To clear the types set it to null.
     *
     * @param {string | string[] | null} value The types to set
     */
    set types(value: null | string | string[]);
    /**
     * Get the bounds to which query predictions are biased.
     *
     * @returns {LatLngBounds | undefined}
     */
    getBounds(): LatLngBounds | undefined;
    /**
     * Get the country or countries to use for biasing query predictions.
     *
     * @returns {string | string[] | null}
     */
    getCountryRestriction(): string | string[] | null;
    /**
     * Get the fields to be included for the Place in the details response when the details are successfully retrieved.
     *
     * @returns {string[]}
     */
    getFields(): string[];
    /**
     * Get the HTML input element reference
     *
     * @returns {HTMLInputElement | undefined}
     */
    getInput(): HTMLInputElement | undefined;
    /**
     * Gets the place that has been found
     *
     * The results from the place_changed event is one place and it's the place that the user clicked on.
     *
     * @returns {google.maps.places.PlaceResult | undefined}
     */
    getPlace(): google.maps.places.PlaceResult | undefined;
    /**
     * Get the map bounds based on the place that has been found.
     *
     * @returns {LatLngBounds|undefined}
     */
    getPlaceBounds(): LatLngBounds | undefined;
    /**
     * Get whether the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.
     *
     * @returns {boolean}
     */
    getStrictBounds(): boolean;
    /**
     * Get the types of predictions to be returned.
     *
     * @returns {string[] | undefined}
     */
    getTypes(): string[] | undefined;
    /**
     * Initialize the places search box object
     *
     * This must be called in order for the places search box to work.
     *
     * @returns {Promise<void>}
     */
    init(): Promise<void>;
    /**
     * Returns whether the places search box object has been initialized
     *
     * @returns {boolean}
     */
    isInitialized(): boolean;
    /**
     * @inheritdoc
     */
    hasListener(type: AutocompleteSearchBoxEvent, callback?: AutocompleteSearchBoxEventCallback): boolean;
    /**
     * @inheritdoc
     */
    off(type?: AutocompleteSearchBoxEvent, callback?: AutocompleteSearchBoxEventCallback, options?: EventListenerOptions): void;
    /**
     * @inheritdoc
     */
    on(type: AutocompleteSearchBoxEvent, callback: AutocompleteSearchBoxEventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onImmediate(type: AutocompleteSearchBoxEvent, callback: AutocompleteSearchBoxEventCallback, config?: EventConfig): void;
    /**
     * Listen for the place changed event
     *
     * @example
     * autocompleteSearchBox.onPlaceChanged((place, bounds) => {
     *    console.log('Place: ', place);
     *   console.log('Bounds: ', bounds);
     * });
     * @param {(place: google.maps.places.PlaceResult, bounds: LatLngBounds) => void} callback The callback function
     * @returns {void}
     */
    onPlaceChanged(callback: (place: google.maps.places.PlaceResult, bounds: LatLngBounds) => void): void;
    /**
     * @inheritdoc
     */
    once(type: AutocompleteSearchBoxEvent, callback?: AutocompleteSearchBoxEventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onceImmediate(type: AutocompleteSearchBoxEvent, callback?: AutocompleteSearchBoxEventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    only(type: AutocompleteSearchBoxEvent, callback: AutocompleteSearchBoxEventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onlyOnce(type: AutocompleteSearchBoxEvent, callback: AutocompleteSearchBoxEventCallback, config?: EventConfig): void;
    /**
     * Sets the region to use for biasing query predictions.
     *
     * Results will only be biased towards this area and not be completely restricted to it.
     *
     * @param {LatLngBoundsValue} value The bounds to set
     * @returns {AutocompleteSearchBox}
     */
    setBounds(value: LatLngBoundsValue): AutocompleteSearchBox;
    /**
     * Sets the country or countries to use for biasing query predictions.
     *
     * @param {string|string[]|null} value The country restriction to set
     * @returns {AutocompleteSearchBox}
     */
    setCountryRestriction(value: string | string[] | null): AutocompleteSearchBox;
    /**
     * Set the fields to be included for the Place in the details response when the details are successfully retrieved.
     *
     * @param {string|string[]} value The fields to set
     * @returns {AutocompleteSearchBox}
     */
    setFields(value: string | string[]): AutocompleteSearchBox;
    /**
     * Set the input reference
     *
     * @param {string|HTMLInputElement} input The input HTMLInputElement or the selector for the input element
     * @returns {AutocompleteSearchBox}
     */
    setInput(input: string | HTMLInputElement): AutocompleteSearchBox;
    /**
     * Set the places search box options
     *
     * @param {AutocompleteSearchBoxOptions} options The options to set
     * @returns {AutocompleteSearchBox}
     */
    setOptions(options: AutocompleteSearchBoxOptions): AutocompleteSearchBox;
    /**
     * Set whether the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.
     *
     * Setting strictBounds to false (which is the default) will make the results biased towards, but not restricted to, places contained within the bounds.
     *
     * @param {boolean} value The value to set
     * @returns {AutocompleteSearchBox}
     */
    setStrictBounds(value: boolean): AutocompleteSearchBox;
    /**
     * Set the types of predictions to be returned.
     *
     * To clear the types set it to null.
     *
     * @param {string | string[] | null} value The types to set
     * @returns {AutocompleteSearchBox}
     */
    setTypes(value: null | string | string[]): AutocompleteSearchBox;
}
type AutocompleteSearchBoxValue = HTMLInputElement | string | AutocompleteSearchBox | AutocompleteSearchBoxOptions;
/**
 * Helper function to set up the places search box object
 *
 * @param {AutocompleteSearchBoxValue} [input] The input reference or the options
 * @param {AutocompleteSearchBoxOptions} [options] The places search box options
 * @returns {AutocompleteSearchBox}
 */
declare const autocompleteSearchBox: (input?: AutocompleteSearchBoxValue, options?: AutocompleteSearchBoxOptions) => AutocompleteSearchBox;

type SizeObject = {
    height: number | string;
    width: number | string;
};
type WidthSize = number | number[] | string | string[] | SizeObject;
/**
 * The Size class to set up and manage width and height values for an element
 */
declare class Size extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {WidthSize|Size} [width] The X value
     * @param {number|string} [height] The Y value
     */
    constructor(width?: WidthSize | Size, height?: number | string);
    /**
     * Get the height value
     *
     * @returns {number}
     */
    get height(): number;
    /**
     * Set the height value
     *
     * @param {number|string} height The height value. Ideally it's a number but it could be a number string
     */
    set height(height: number | string);
    /**
     * Get the width value
     *
     * @returns {number}
     */
    get width(): number;
    /**
     * Set the width value
     *
     * @param {number|string} width The width value. Ideally it's a number but it could be a number string
     */
    set width(width: number | string);
    /**
     * Returns a new copy of the size
     *
     * @returns {Size}
     */
    clone(): Size;
    /**
     * Get the height value
     *
     * @returns {number}
     */
    getHeight(): number;
    /**
     * Get the width value
     *
     * @returns {number}
     */
    getWidth(): number;
    /**
     * Returns whether the width/height pair are valid values
     *
     * @returns {boolean}
     */
    isValid(): boolean;
    /**
     * Set the width/height values
     *
     * @param {WidthSize|Size} width The width value, or the Size object, or an arraheight of [width, height] pairs, or a {width, height} object
     * @param {number|string} height The height value
     * @returns {Size}
     */
    set(width: WidthSize | Size, height?: number | string): Size;
    /**
     * Set the height value
     *
     * @param {number|string} height The height value. Ideally it's a number but it could be a number string
     * @returns {Size}
     */
    setHeight(height: number | string): Size;
    /**
     * Set the width value
     *
     * @param {number|string} width The width value. Ideally it's a number but it could be a number string
     * @returns {Size}
     */
    setWidth(width: number | string): Size;
    /**
     * Returns the Google maps size object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/coordinates#Size
     *
     * @returns {google.maps.Size|null}
     */
    toGoogle(): google.maps.Size | null;
}
type SizeValue = Size | number | number[] | string | string[] | SizeObject;
/**
 * Helper function to set up the size object
 *
 * @param {WidthSize} [width] The width value
 * @param {number|string} [height] The height value
 * @returns {Size}
 */
declare const size: (width?: SizeValue, height?: number | string) => Size;

type IconOptions = {
    anchor?: PointValue;
    labelOrigin?: PointValue;
    origin?: PointValue;
    scaledSize?: SizeValue;
    size?: SizeValue;
    url?: string;
};
/**
 * Icon class to set up an icon options for a marker
 */
declare class Icon extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {string | IconOptions} [url] The URL for the icon or the icon options
     * @param {IconOptions} [options] The icon options
     */
    constructor(url?: string | IconOptions, options?: IconOptions);
    /**
     * Set the icon options
     *
     * @param {IconOptions} options The icon options
     * @returns {Icon}
     */
    setOptions(options: IconOptions): Icon;
    /**
     * Set the position at which to anchor an image in correspondence to the location of the marker on the map.
     * Use this if for some reason you didn't pass the anchor in the icon options.
     *
     * By default, the anchor is located along the center point of the bottom of the image.
     *
     * const icon = G.icon({
     *    url: 'https://mywebsite.com/images/marker.png',
     * });
     * icon.setAnchor([10, 32]);
     *
     * Valid values are:
     * icon.setAnchor([10, 32]);
     * icon.setAnchor({x: 10, y: 32});
     * icon.setAnchor(pointClassInstance);
     *
     * @param {PointValue} anchor The anchor point value
     * @returns {Icon}
     */
    setAnchor(anchor: PointValue): Icon;
    /**
     * Set the origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
     * Use this if for some reason you didn't pass the label origin in the icon options.
     *
     * By default, the origin is located in the center point of the image.
     *
     * const icon = G.icon({
     *    url: 'https://mywebsite.com/images/marker.png',
     * });
     * icon.setLabelOrigin([10, 32]);
     *
     * Valid values are:
     * icon.setLabelOrigin([10, 32]);
     * icon.setLabelOrigin({x: 10, y: 32});
     * icon.setLabelOrigin(pointClassInstance);
     *
     * @param {PointValue} origin The label origin point value
     * @returns {Icon}
     */
    setLabelOrigin(origin: PointValue): Icon;
    /**
     * Set the position of the image within a sprite, if any. By default, the origin is located at the top left corner of the image (0, 0).
     * Use this if for some reason you didn't pass the origin in the icon options.
     *
     * const icon = G.icon({
     *    url: 'https://mywebsite.com/images/marker.png',
     * });
     * icon.setOrigin([10, 32]);
     *
     * Valid values are:
     * icon.setOrigin([10, 32]);
     * icon.setOrigin({x: 10, y: 32});
     * icon.setOrigin(pointClassInstance);
     *
     * @param {PointValue} origin The origin point value
     * @returns {Icon}
     */
    setOrigin(origin: PointValue): Icon;
    /**
     * Set the scaled size of the icon. Use this if for some reason you didn't pass the scaled size in the icon options.
     *
     * The size of the entire image after scaling, if any. Use this property to stretch/shrink an image or a sprite.
     *
     * const icon = G.icon({
     *    url: 'https://mywebsite.com/images/marker.png',
     * });
     * icon.setSize([40, 64]).setScaledSize([20, 32]));
     *
     * Valid values are:
     * icon.setScaledSize([10, 32]);
     * icon.setScaledSize({x: 10, y: 32});
     * icon.setScaledSize(sizeClassInstance);
     *
     * @param {SizeValue} sizeValue The size value
     * @returns {Icon}
     */
    setScaledSize(sizeValue: SizeValue): Icon;
    /**
     * Set the size of the icon. Use this if for some reason you didn't pass the size in the icon options.
     *
     * When using sprites, you must specify the sprite size. If the size is not provided, it will be set when the image loads.
     *
     * const icon = G.icon({
     *    url: 'https://mywebsite.com/images/marker.png',
     * });
     * icon.setSize([20, 32]);
     *
     * Valid values are:
     * icon.setSize([10, 32]);
     * icon.setSize({x: 10, y: 32});
     * icon.setSize(sizeClassInstance);
     *
     * If you're using an SVG you should set a size if the desired size is different from the height and width attributes of the SVG.
     *
     * @param {SizeValue} sizeValue The size value
     * @returns {Icon}
     */
    setSize(sizeValue: SizeValue): Icon;
    /**
     * Set the icon URL
     *
     * @param {string} url The icon URL
     * @returns {Icon}
     */
    setUrl(url: string): Icon;
    /**
     * Get the icon options
     *
     * @returns {google.maps.Icon}
     */
    toGoogle(): google.maps.Icon;
}
type IconValue = Icon | string | IconOptions;
/**
 * Helper function to set up the icon object
 *
 * @param {IconValue} [url] The URL for the icon, the icon object, or the icon options
 * @param {IconOptions} [options] The options for the icon
 * @returns {Icon}
 */
declare const icon: (url?: IconValue, options?: IconOptions) => Icon;

type FullscreenControlOptions = {
    enabled?: boolean;
    position?: ControlPositionValue;
};
/**
 * Fullscreen control class
 */
declare class FullscreenControl {
    #private;
    /**
     * Class constructor
     *
     * @param {FullscreenControlOptions | boolean} [options] Either the FullscreenControl options or a boolean value to disable the control.
     */
    constructor(options?: FullscreenControlOptions | boolean);
    /**
     * Get whether the Fullscreen control is enabled.
     *
     * @returns {boolean}
     */
    get enabled(): boolean;
    /**
     * Set whether the Fullscreen control is enabled.
     *
     * @param {boolean} value The enabled/disabled state
     */
    set enabled(value: boolean);
    /**
     * Get the fullscreen control position
     *
     * @returns {ControlPosition}
     */
    get position(): ControlPositionValue;
    /**
     * Set the fullscreen control position
     *
     * @param {ControlPosition} value The position of the control
     */
    set position(value: ControlPositionValue);
    /**
     * Disable the Fullscreen control
     *
     * @returns {FullscreenControl}
     */
    disable(): FullscreenControl;
    /**
     * Enable the Fullscreen control
     *
     * @returns {FullscreenControl}
     */
    enable(): FullscreenControl;
    /**
     * Set the position of the control
     * https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
     *
     * @param {ControlPositionValue} position The position of the control
     * @returns {FullscreenControl}
     */
    setPosition(position: ControlPositionValue): FullscreenControl;
    /**
     * Get the Fullscreen Control options Google Maps object
     *
     * @returns {Promise<google.maps.FullscreenControlOptions>}
     */
    toGoogle(): Promise<google.maps.FullscreenControlOptions>;
}
type FullscreenControlValue = FullscreenControlOptions | boolean | FullscreenControl;
/**
 * Helper function to set up the FullscreenControl object
 *
 * @param {FullscreenControlValue} options The FullscreenControl options, a boolean value to disable the control, or a FullscreenControl object.
 * @returns {FullscreenControl}
 */
declare const fullscreenControl: (options?: FullscreenControlValue) => FullscreenControl;

type MapRestrictionOptions = {
    enabled?: boolean;
    latLngBounds?: LatLngBoundsValue;
    strictBounds?: boolean;
};
/**
 * MapRestriction class
 */
declare class MapRestriction {
    #private;
    /**
     * Class constructor
     *
     * @param {MapRestrictionOptions | LatLngBoundsValue | boolean} [options] Either the MapRestriction options just the LatLng bounds value.
     */
    constructor(options?: MapRestrictionOptions | LatLngBoundsValue | boolean);
    /**
     * Get whether the MapRestriction object is enabled
     *
     * @returns {boolean}
     */
    get enabled(): boolean;
    /**
     * Set whether the MapRestriction object is enabled
     *
     * @param {boolean} value Whether the MapRestriction object is enabled
     */
    set enabled(value: boolean);
    /**
     * Get the existing latitude/longitude bounds
     *
     * @returns {LatLngBounds | undefined}
     */
    get latLngBounds(): LatLngBounds;
    /**
     * Set the latitude/longitude bounds
     *
     * @param {LatLngBoundsValue} value The lat/lng bounds value
     */
    set latLngBounds(value: LatLngBoundsValue);
    /**
     * Get whether the bounds are strict
     *
     * @returns {boolean}
     */
    get strictBounds(): boolean;
    /**
     * Set whether the bounds are strict
     *
     * @param {boolean} value Whether the bounds are strict
     */
    set strictBounds(value: boolean);
    /**
     * Disable the map restriction
     *
     * @returns {MapRestriction}
     */
    disable(): MapRestriction;
    /**
     * Enable the map restriction
     *
     * @returns {MapRestriction}
     */
    enable(): MapRestriction;
    /**
     * Returns whether the MapRestriction object is enabled
     *
     * @returns {boolean}
     */
    isEnabled(): boolean;
    /**
     * Returns if the MapRestriction object is valid
     *
     * @returns {boolean}
     */
    isValid(): boolean;
    /**
     * Set the latitude/longitude bounds
     *
     * @param {LatLngBoundsValue} value The lat/lng bounds value
     * @returns {MapRestriction}
     */
    setLatLngBounds(value: LatLngBoundsValue): MapRestriction;
    /**
     * Set whether the bounds are strict
     *
     * @param {boolean} value Whether the bounds are strict
     * @returns {MapRestriction}
     */
    setStrictBounds(value: boolean): MapRestriction;
    /**
     * Get the MapRestriction Google Maps object
     *
     * @returns {Promise<google.maps.MapRestriction>}
     */
    toGoogle(): Promise<google.maps.MapRestriction>;
}
type MapRestrictionValue = MapRestrictionOptions | LatLngBoundsValue | MapRestriction | boolean;
/**
 * Helper function to set up the MapRestriction object
 *
 * @param {MapRestrictionValue} options The MapRestriction options, a LatLngBounds value, or a MapRestriction object.
 * @returns {MapRestriction}
 */
declare const mapRestriction: (options?: MapRestrictionValue) => MapRestriction;

type MapTypeControlOptions = {
    enabled?: boolean;
    mapTypeIds?: MapTypeIdValue[];
    position?: ControlPositionValue;
    style?: MapTypeControlStyleValue;
};
/**
 * Map Type control class
 */
declare class MapTypeControl {
    #private;
    /**
     * Class constructor
     *
     * @param {MapTypeControlOptions | boolean} [options] Either the MapTypeControl options or a boolean value to disable the control.
     */
    constructor(options?: MapTypeControlOptions | boolean);
    /**
     * Get whether the Map Type control is enabled.
     *
     * @returns {boolean}
     */
    get enabled(): boolean;
    /**
     * Set whether the Map Type control is enabled.
     *
     * @param {boolean} value The enabled/disabled state
     */
    set enabled(value: boolean);
    /**
     * Get whether the hybrid map type is enabled
     *
     * @returns {boolean}
     */
    get hybrid(): boolean;
    /**
     * Set whether the hybrid map type is enabled
     *
     * @param {boolean} value The enabled/disabled state
     */
    set hybrid(value: boolean);
    /**
     * Get the map type control position
     *
     * @returns {ControlPosition}
     */
    get position(): ControlPositionValue;
    /**
     * Set the map type control position
     *
     * @param {ControlPosition} value The position of the control
     */
    set position(value: ControlPositionValue);
    /**
     * Get whether the roadmap map type is enabled
     *
     * @returns {boolean}
     */
    get roadmap(): boolean;
    /**
     * Set whether the roadmap map type is enabled
     *
     * @param {boolean} value The enabled/disabled state
     */
    set roadmap(value: boolean);
    /**
     * Get whether the satellite map type is enabled
     *
     * @returns {boolean}
     */
    get satellite(): boolean;
    /**
     * Set whether the satellite map type is enabled
     *
     * @param {boolean} value The enabled/disabled state
     */
    set satellite(value: boolean);
    /**
     * Get the map type control style
     *
     * @returns {MapTypeControlStyle}
     */
    get style(): MapTypeControlStyleValue;
    /**
     * Set the map type control style
     *
     * @param {MapTypeControlStyleValue} value The style of the control
     */
    set style(value: MapTypeControlStyleValue);
    /**
     * Get whether the terrain map type is enabled
     *
     * @returns {boolean}
     */
    get terrain(): boolean;
    /**
     * Set whether the terrain map type is enabled
     *
     * @param {boolean} value The enabled/disabled state
     */
    set terrain(value: boolean);
    /**
     * Disable the Map Type control
     *
     * @returns {MapTypeControl}
     */
    disable(): MapTypeControl;
    /**
     * Enable the Map Type control
     *
     * @returns {MapTypeControl}
     */
    enable(): MapTypeControl;
    /**
     * Returns whether the Map Type control is using the map type id
     *
     * @param {MapTypeIdValue} mapTypeId The map type id to check
     * @returns {boolean}
     */
    hasMapType(mapTypeId: MapTypeIdValue): boolean;
    /**
     * Set the map type ids to include in the control
     *
     * @param {MapTypeIdValue[]} mapTypeIds The map type ids to include in the control
     * @returns {MapTypeControl}
     */
    setMapTypeIds(mapTypeIds: MapTypeIdValue[]): MapTypeControl;
    /**
     * Set the position of the control
     * https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
     *
     * @param {ControlPositionValue} position The position of the control
     * @returns {MapTypeControl}
     */
    setPosition(position: ControlPositionValue): MapTypeControl;
    /**
     * Set the style of the control
     * https://developers.google.com/maps/documentation/javascript/reference/control#MapTypeControlStyle
     *
     * @param {MapTypeControlStyleValue} style The style of the control
     * @returns {MapTypeControl}
     */
    setStyle(style: MapTypeControlStyleValue): MapTypeControl;
    /**
     * Get the MapTypeControl options Google Maps object
     *
     * @returns {Promise<google.maps.MapTypeControlOptions>}
     */
    toGoogle(): Promise<google.maps.MapTypeControlOptions>;
}
type MapTypeControlValue = MapTypeControlOptions | boolean | MapTypeControl;
/**
 * Helper function to set up the MapTypeControl object
 *
 * @param {MapTypeControlValue} options The MapTypeControl options, a boolean value to disable the control, or a MapTypeControl object.
 * @returns {MapTypeControl}
 */
declare const mapTypeControl: (options?: MapTypeControlValue) => MapTypeControl;

type Style = {
    [key: string]: string | number;
};
type MapStyleOptions = {
    elementType?: string;
    featureType?: string;
    styles?: Style[];
};
/**
 * MapStyle class
 */
declare class MapStyle {
    #private;
    /**
     * Class constructor
     *
     * @param {MapStyleOptions | Style | Style[]} [options] Either the MapStyle options, a single style, or an array of styles
     */
    constructor(options?: MapStyleOptions | Style | Style[]);
    /**
     * Get the element type to apply styles to
     *
     * @returns {string}
     */
    get elementType(): string;
    /**
     * Set the element type to apply styles to
     *
     * @param {string} value The element type to apply values to
     */
    set elementType(value: string);
    /**
     * Get the feature type to apply styles to
     *
     * @returns {string}
     */
    get featureType(): string;
    /**
     * Set the feature type to apply styles to
     *
     * @param {string} value The feature type to apply values to
     */
    set featureType(value: string);
    /**
     * Get the styles to apply to the map
     *
     * @returns {Style[]}
     */
    get styles(): Style[];
    /**
     * Set the styles to apply to the map
     *
     * @param {Style | Style[]} value The style or styles to apply to the map
     */
    set styles(value: Style | Style[]);
    /**
     * Add a style to the list of styles to apply
     *
     * Example:
     * styles.addStyle('color', 'red');
     * styles.addStyle('weight', 2);
     *
     * @param {string} property The style property.
     * @param {string | number} value The style value.
     * @returns {MapStyle}
     */
    addStyle(property: string, value: string | number): MapStyle;
    /**
     * Set the element type to apply styles to
     *
     * @param {string} value The element type to apply values to
     * @returns {MapStyle}
     */
    setElementType(value: string): MapStyle;
    /**
     * Set the feature type to apply styles to
     *
     * @param {string} value The feature type to apply values to
     * @returns {MapStyle}
     */
    setFeatureType(value: string): MapStyle;
    /**
     * Set the styles to apply to the map
     *
     * @param { Style|Style[]} value The style or styles to apply to the map
     * @returns {MapStyle}
     */
    setStyles(value: Style | Style[]): MapStyle;
    /**
     * Get the MapTypeStyle Google Maps object
     *
     * @returns {google.maps.MapTypeStyle}
     */
    toGoogle(): google.maps.MapTypeStyle;
}
type MapStyleValue = MapStyleOptions | Style | Style[] | MapStyle;
/**
 * Helper function to set up the MapStyle object
 *
 * @param {MapStyleValue} options The MapStyle options, a single style object, an array of styles, or a MapStyle object.
 * @returns {MapStyle}
 */
declare const mapStyle: (options?: MapStyleValue) => MapStyle;

type RotateControlOptions = {
    enabled?: boolean;
    position?: ControlPositionValue;
};
/**
 * Rotate control class
 */
declare class RotateControl {
    #private;
    /**
     * Class constructor
     *
     * @param {RotateControlOptions | boolean} [options] Either the RotateControl options or a boolean value to disable the control.
     */
    constructor(options?: RotateControlOptions | boolean);
    /**
     * Get whether the Rotate control is enabled.
     *
     * @returns {boolean}
     */
    get enabled(): boolean;
    /**
     * Set whether the Rotate control is enabled.
     *
     * @param {boolean} value The enabled/disabled state
     */
    set enabled(value: boolean);
    /**
     * Get the rotate control position
     *
     * @returns {ControlPosition}
     */
    get position(): ControlPositionValue;
    /**
     * Set the rotate control position
     *
     * @param {ControlPosition} value The position of the control
     */
    set position(value: ControlPositionValue);
    /**
     * Disable the Rotate control
     *
     * @returns {RotateControl}
     */
    disable(): RotateControl;
    /**
     * Enable the Rotate control
     *
     * @returns {RotateControl}
     */
    enable(): RotateControl;
    /**
     * Set the position of the control
     * https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
     *
     * @param {ControlPositionValue} position The position of the control
     * @returns {RotateControl}
     */
    setPosition(position: ControlPositionValue): RotateControl;
    /**
     * Get the Rotate Control options Google Maps object
     *
     * @returns {Promise<google.maps.RotateControlOptions>}
     */
    toGoogle(): Promise<google.maps.RotateControlOptions>;
}
type RotateControlValue = RotateControlOptions | boolean | RotateControl;
/**
 * Helper function to set up the RotateControl object
 *
 * @param {RotateControlValue} options The RotateControl options, a boolean value to disable the control, or a RotateControl object.
 * @returns {RotateControl}
 */
declare const rotateControl: (options?: RotateControlValue) => RotateControl;

type ScaleControlOptions = {
    enabled?: boolean;
};
/**
 * Scale control class
 */
declare class ScaleControl {
    #private;
    /**
     * Class constructor
     *
     * @param {ScaleControlOptions | boolean} [options] Either the ScaleControl options or a boolean value to disable the control.
     */
    constructor(options?: ScaleControlOptions | boolean);
    /**
     * Get whether the Scale control is enabled.
     *
     * @returns {boolean}
     */
    get enabled(): boolean;
    /**
     * Set whether the Scale control is enabled.
     *
     * @param {boolean} value The enabled/disabled state
     */
    set enabled(value: boolean);
    /**
     * Disable the Scale control
     *
     * @returns {ScaleControl}
     */
    disable(): ScaleControl;
    /**
     * Enable the Scale control
     *
     * @returns {ScaleControl}
     */
    enable(): ScaleControl;
    /**
     * Get the Scale Control options Google Maps object
     *
     * @returns {Promise<google.maps.ScaleControlOptions>}
     */
    toGoogle(): Promise<google.maps.ScaleControlOptions>;
}
type ScaleControlValue = ScaleControlOptions | boolean | ScaleControl;
/**
 * Helper function to set up the ScaleControl object
 *
 * @param {ScaleControlValue} options The ScaleControl options, a boolean value to disable the control, or a ScaleControl object.
 * @returns {ScaleControl}
 */
declare const scaleControl: (options?: ScaleControlValue) => ScaleControl;

type StreetViewControlOptions = {
    enabled?: boolean;
    position?: ControlPositionValue;
    sources?: StreetViewSourceValue | StreetViewSourceValue[];
};
/**
 * StreetView control class
 */
declare class StreetViewControl {
    #private;
    /**
     * Class constructor
     *
     * @param {StreetViewControlOptions | boolean} [options] Either the StreetViewControl options or a boolean value to disable the control.
     */
    constructor(options?: StreetViewControlOptions | boolean);
    /**
     * Get whether the StreetView control is enabled.
     *
     * @returns {boolean}
     */
    get enabled(): boolean;
    /**
     * Set whether the StreetView control is enabled.
     *
     * @param {boolean} value The enabled/disabled state
     */
    set enabled(value: boolean);
    /**
     * Get the street view control position
     *
     * @returns {ControlPosition}
     */
    get position(): ControlPositionValue;
    /**
     * Set the street view control position
     *
     * @param {ControlPosition} value The position of the control
     */
    set position(value: ControlPositionValue);
    /**
     * Get the sources of the street view control
     *
     * @returns {StreetViewSourceValue[]}
     */
    get sources(): StreetViewSourceValue[];
    /**
     * Set the sources of the street view control
     *
     * @param {StreetViewSourceValue | StreetViewSourceValue[]} value The source or sources of the street view control
     */
    set sources(value: StreetViewSourceValue | StreetViewSourceValue[]);
    /**
     * Disable the StreetView control
     *
     * @returns {StreetViewControl}
     */
    disable(): StreetViewControl;
    /**
     * Enable the StreetView control
     *
     * @returns {StreetViewControl}
     */
    enable(): StreetViewControl;
    /**
     * Set the position of the control
     * https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
     *
     * @param {ControlPositionValue} position The position of the control
     * @returns {StreetViewControl}
     */
    setPosition(position: ControlPositionValue): StreetViewControl;
    /**
     * Set the sources of the street view control
     *
     * @param {StreetViewSourceValue | StreetViewSourceValue[]} sources The source or sources of the street view control
     * @returns {StreetViewControl}
     */
    setSources(sources: StreetViewSourceValue | StreetViewSourceValue[]): StreetViewControl;
    /**
     * Get the StreetView Control options Google Maps object
     *
     * @returns {Promise<google.maps.StreetViewControlOptions>}
     */
    toGoogle(): Promise<google.maps.StreetViewControlOptions>;
}
type StreetViewControlValue = StreetViewControlOptions | boolean | StreetViewControl;
/**
 * Helper function to set up the StreetViewControl object
 *
 * @param {StreetViewControlValue} options The StreetViewControl options, a boolean value to disable the control, or a StreetViewControl object.
 * @returns {StreetViewControl}
 */
declare const streetViewControl: (options?: StreetViewControlValue) => StreetViewControl;

type ZoomControlOptions = {
    enabled?: boolean;
    position?: ControlPositionValue;
};
/**
 * Zoom control class
 */
declare class ZoomControl {
    #private;
    /**
     * Class constructor
     *
     * @param {ZoomControlOptions | boolean} [options] Either the ZoomControl options or a boolean value to disable the control.
     */
    constructor(options?: ZoomControlOptions | boolean);
    /**
     * Get whether the Zoom control is enabled.
     *
     * @returns {boolean}
     */
    get enabled(): boolean;
    /**
     * Set whether the Zoom control is enabled.
     *
     * @param {boolean} value The enabled/disabled state
     */
    set enabled(value: boolean);
    /**
     * Get the zoom control position
     *
     * @returns {ControlPosition}
     */
    get position(): ControlPositionValue;
    /**
     * Set the zoom control position
     *
     * @param {ControlPosition} value The position of the control
     */
    set position(value: ControlPositionValue);
    /**
     * Disable the Zoom control
     *
     * @returns {ZoomControl}
     */
    disable(): ZoomControl;
    /**
     * Enable the Zoom control
     *
     * @returns {ZoomControl}
     */
    enable(): ZoomControl;
    /**
     * Set the position of the control
     * https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
     *
     * @param {ControlPositionValue} position The position of the control
     * @returns {ZoomControl}
     */
    setPosition(position: ControlPositionValue): ZoomControl;
    /**
     * Get the Zoom Control options Google Maps object
     *
     * @returns {Promise<google.maps.ZoomControlOptions>}
     */
    toGoogle(): Promise<google.maps.ZoomControlOptions>;
}
type ZoomControlValue = ZoomControlOptions | boolean | ZoomControl;
/**
 * Helper function to set up the ZoomControl object
 *
 * @param {ZoomControlValue} options The ZoomControl options, a boolean value to disable the control, or a ZoomControl object.
 * @returns {ZoomControl}
 */
declare const zoomControl: (options?: ZoomControlValue) => ZoomControl;

type MapOptions = {
    apiKey?: string;
    backgroundColor?: string;
    center?: LatLngValue;
    clickableIcons?: boolean;
    colorScheme?: string;
    controlSize?: number;
    disableDefaultUI?: boolean;
    draggableCursor?: string;
    draggingCursor?: string;
    fullscreenControl?: boolean | FullscreenControl;
    gestureHandling?: string;
    heading?: number;
    headingInteractionEnabled?: boolean;
    isFractionalZoomEnabled?: boolean;
    keyboardShortcuts?: boolean;
    lat?: number | string;
    latitude?: number | string;
    libraries?: Libraries;
    lng?: number | string;
    longitude?: number | string;
    mapId?: string;
    mapTypeControl?: boolean | MapTypeControl;
    mapTypeId?: MapTypeIdValue | string;
    maxFitBoundsZoom?: number;
    maxZoom?: number;
    minFitBoundsZoom?: number;
    minZoom?: number;
    noClear?: boolean;
    renderingType?: RenderingTypeValue;
    restriction?: MapRestrictionValue;
    rotateControl?: boolean | RotateControlValue;
    scaleControl?: boolean | ScaleControlValue;
    scrollwheel?: boolean;
    streetView?: google.maps.StreetViewPanorama;
    streetViewControl?: boolean | StreetViewControl;
    styles?: MapStyleValue;
    tilt?: number;
    tiltInteractionEnabled?: boolean;
    version?: string;
    zoom?: number | string;
    zoomControl?: boolean | ZoomControl;
};
type LocateOptions = {
    enableHighAccuracy?: boolean;
    maximumAge?: number;
    timeout?: number;
    watch?: boolean;
};
type LocationPosition = {
    accuracy?: number;
    altitude?: number;
    altitudeAccuracy?: number;
    heading?: number;
    latitude: number;
    latLng: LatLng;
    longitude: number;
    speed?: number;
    timestamp: number;
};
type LocationOnSuccess = (position: LocationPosition) => void;

type MapType = 'hybrid' | 'roadmap' | 'satellite' | 'terrain';
type InternalEvent = 'locationerror' | 'locationfound' | 'ready';
type GMEvent = 'bounds_changed' | 'center_changed' | 'click' | 'contextmenu' | 'dblclick' | 'drag' | 'dragend' | 'dragstart' | 'heading_changed' | 'idle' | 'isfractionalzoomenabled_changed' | 'mapcapabilities_changed' | 'maptypeid_changed' | 'mousemove' | 'mouseout' | 'mouseover' | 'projection_changed' | 'renderingtype_changed' | 'tilesloaded' | 'tilt_changed' | 'zoom_changed';
type MapEvent = GMEvent | InternalEvent;
/**
 * The map class
 */
declare class Map extends Evented {
    #private;
    /**
     * Class constructor
     *
     * @param {string|HTMLElement} selector The selector of the element that the map will be rendered in. Or the HTMLElement that the map will be rendered in.
     *      The selector can be any valid selector for document.querySelector() can be used. Or, it can be an HTML element
     * @param {MapOptions} [options] The options object for the map
     */
    constructor(selector: string | HTMLElement, options?: MapOptions);
    /**
     * Get the center point for the map
     *
     * @returns {LatLng}
     */
    get center(): LatLng;
    /**
     * Set the center point for the map
     *
     * @param {LatLngValue} value The center point for the map
     */
    set center(value: LatLngValue);
    /**
     * Get whether the default UI is disabled
     *
     * @returns {boolean}
     */
    get disableDefaultUI(): boolean;
    /**
     * Set whether the default UI is disabled
     *
     * @param {boolean} value Whether the default UI is disabled
     */
    set disableDefaultUI(value: boolean);
    /**
     * Get the fullscreen control object
     *
     * @returns {FullscreenControl}
     */
    get fullscreenControl(): FullscreenControl;
    /**
     * Set the fullscreen control object, or whether to display the fullscreen control
     *
     * @param {boolean|FullscreenControl} value The fullscreen control option
     */
    set fullscreenControl(value: boolean | FullscreenControl);
    /**
     * Get the latitude value for the center point
     *
     * @returns {number}
     */
    get latitude(): number;
    /**
     * Set the latitude value for the center point
     *
     * @param {string|number} value The latitude value
     */
    set latitude(value: string | number);
    /**
     * Get the longitude value for the center point
     *
     * @returns {number}
     */
    get longitude(): number;
    /**
     * Set the longitude value for the center point
     *
     * @param {string|number} value The longitude value
     */
    set longitude(value: string | number);
    /**
     * Get the map type control object
     *
     * @returns {MapTypeControl}
     */
    get mapTypeControl(): MapTypeControl;
    /**
     * Set the map type control object, or whether to display the map type control
     *
     * @param {boolean|MapTypeControl} value The map type control option
     */
    set mapTypeControl(value: boolean | MapTypeControl);
    /**
     * Get the map type ID
     *
     * @returns {string}
     */
    get mapTypeId(): string;
    /**
     * Set the map type ID
     *
     * @param {string} value The map type ID
     */
    set mapTypeId(value: string);
    /**
     * Get the maximum zoom level for the map when fitting to bounds
     *
     * @returns {null|number}
     */
    get maxFitBoundsZoom(): null | number;
    /**
     * Set the maximum zoom level for the map when fitting to bounds
     *
     * @param {null|number} value The maximum zoom level
     */
    set maxFitBoundsZoom(value: null | number);
    /**
     * Get the maximum zoom level for the map
     *
     * @returns {null|number}
     */
    get maxZoom(): null | number;
    /**
     * Set the maximum zoom level for the map
     *
     * @param {null|number} value The maximum zoom level
     */
    set maxZoom(value: null | number);
    /**
     * Get the minimum zoom level for the map when fitting to bounds
     *
     * @returns {null|number}
     */
    get minFitBoundsZoom(): null | number;
    /**
     * Set the minimum zoom level for the map when fitting to bounds
     *
     * @param {null|number} value The minimum zoom level
     */
    set minFitBoundsZoom(value: null | number);
    /**
     * Get the minimum zoom level for the map
     *
     * @returns {null|number}
     */
    get minZoom(): null | number;
    /**
     * Set the minimum zoom level for the map
     *
     * @param {null|number} value The minimum zoom level
     */
    set minZoom(value: null | number);
    /**
     * Get the MapRestriction object if it's been set
     *
     * @returns {MapRestriction|undefined}
     */
    get restriction(): MapRestriction | undefined;
    /**
     * Set the MapRestriction value
     *
     * @param {MapRestrictionValue} value The MapRestriction value
     */
    set restriction(value: MapRestrictionValue);
    /**
     * Get the rotate control object
     *
     * @returns {RotateControl}
     */
    get rotateControl(): RotateControl;
    /**
     * Set the rotate control object, or whether to display the rotate control
     *
     * @param {boolean|RotateControl} value The rotate control option
     */
    set rotateControl(value: boolean | RotateControl);
    /**
     * Get the scale control object
     *
     * @returns {ScaleControl}
     */
    get scaleControl(): ScaleControl;
    /**
     * Set the scale control object, or whether to display the scale control
     *
     * @param {boolean|ScaleControl} value The scale control option
     */
    set scaleControl(value: boolean | ScaleControl);
    /**
     * Get the street view control object
     *
     * @returns {StreetViewControl}
     */
    get streetViewControl(): StreetViewControl;
    /**
     * Set the street view control object, or whether to display the scale control
     *
     * @param {boolean|StreetViewControl} value The scale control option
     */
    set streetViewControl(value: boolean | StreetViewControl);
    /**
     * Get the zoom level for the map
     *
     * @returns {number}
     */
    get zoom(): number;
    /**
     * Set the zoom level for the map
     *
     * @param {number|string} value The zoom level
     */
    set zoom(value: number | string);
    /**
     * Get the zoom control object
     *
     * @returns {ZoomControl}
     */
    get zoomControl(): ZoomControl;
    /**
     * Set the zoom control object, or whether to display the zoom control
     *
     * @param {boolean|ZoomControl} value The zoom control option
     */
    set zoomControl(value: boolean | ZoomControl);
    /**
     * Adds a custom control to the map
     *
     * @param {ControlPositionValue} position The position to add the custom control
     * @param {HTMLElement} element The HTML element for the custom control
     * @returns {Map}
     */
    addCustomControl(position: ControlPositionValue, element: HTMLElement): Map;
    /**
     * Add a value to the map bounds
     *
     * @param {LatLngValue | LatLngValue[]} value The latitude/longitude value to add to the bounds
     * @returns {Map}
     */
    addToBounds(value: LatLngValue | LatLngValue[]): Map;
    /**
     * Clear the existing bounds
     *
     * @returns {Map}
     */
    clearBounds(): Map;
    /**
     * Enable the default UI
     *
     * @returns {Map}
     */
    enableDefaultUI(): Map;
    /**
     * Disable the default UI
     *
     * @returns {Map}
     */
    doDisableDefaultUI(): Map;
    /**
     * Show the map
     *
     * Alias to show()
     *
     * @param {Function} callback The callback function to call after the map loads
     * @returns {Promise<Map>}
     */
    display(callback?: () => void): Promise<Map>;
    /**
     * Sets the viewport to contain the given bounds.
     *
     * The bounds parameter can be:
     * - a LatLngBounds object
     * - an array of [lat, lng] pairs: [[lat, lng], [lat, lng], ...]
     * - an array of {lat, lng} objects (LatLngLiteral[]): [{lat, lng}, {lat, lng}, ...]
     * - an array of LatLng objects: [LatLng, LatLng, ...]
     * - a LatLng object
     * - a [lat, lng] pair
     * - a {lat, lng} object (LatLngLiteral)
     *
     * @see https://developers.google.com/maps/documentation/javascript/reference/map#Map.fitBounds
     *
     * Usage:
     * Add marks to the map.
     * Then call map.fitBounds() to set the viewport to contain the markers.
     * @param {LatLngBoundsValue} bounds The bounds to fit
     * @param {number} [maxZoom] The maximum zoom level to zoom to when fitting the bounds. Higher numbers will zoom in more.
     * @param {number} [minZoom] The minimum zoom level to zoom to when fitting the bounds. Lower numbers will zoom out more.
     * @returns {Promise<Map>}
     */
    fitBounds(bounds?: LatLngBoundsValue, maxZoom?: number, minZoom?: number): Promise<Map>;
    /**
     * Alias to fitBounds
     *
     * @param {LatLngBoundsValue} bounds The bounds to fit
     * @param {number} [maxZoom] The maximum zoom level to zoom to when fitting the bounds. Higher numbers will zoom in more.
     * @param {number} [minZoom] The minimum zoom level to zoom to when fitting the bounds. Lower numbers will zoom out more.
     * @returns {Promise<Map>}
     */
    fitToBounds(bounds?: LatLngBoundsValue, maxZoom?: number, minZoom?: number): Promise<Map>;
    /**
     * Initialize the map if necessary
     *
     * This is not intended to be called outside of this library.
     *
     * This is called by other objects that depend on the map being initialized before doing their thing.
     * For example, attaching a tooltip to a map will wait for the map to be initialized before attaching the tooltip.
     *
     * @internal
     * @param {Function} callback The callback function to call after the map loads
     * @returns {Promise<void>}
     */
    init(callback?: () => void): Promise<Map>;
    /**
     * Gets the lat/lng bounds of the current map viewport
     *
     * If the map is not yet initialized, this will return undefined.
     *
     * @returns {Promise<LatLngBounds | undefined>}
     */
    getBounds(): Promise<LatLngBounds | undefined>;
    /**
     * Get the center point for the map
     *
     * @returns {LatLng}
     */
    getCenter(): LatLng;
    /**
     * Get the div element that the map is rendered in.
     * If the map is not yet initialized, this will return undefined.
     *
     * @returns {HTMLElement|undefined}
     */
    getDiv(): HTMLElement | undefined;
    /**
     * Gets whether the map is ready for use. This also means that the map library is loaded and the map is visible.
     *
     * @returns {boolean}
     */
    getIsReady(): boolean;
    /**
     * Gets the current projection for the map.
     *
     * If the map is not yet initialized, this will return undefined.
     *
     * @returns {google.maps.Projection|undefined}
     */
    getProjection(): google.maps.Projection | undefined;
    /**
     * Get the zoom level
     *
     * @returns {number}
     */
    getZoom(): number;
    /**
     * Load and show the map
     *
     * There are two ways to respond when the map loads:
     * 1. Pass a callback function to the load() function
     *   map.load(() => {
     *     // Do something after the map loads
     *   });
     * 2. Listen for the 'ready' event
     *   map.on('ready', () => {
     *      // Do something after the map loads
     *   });
     * 2a. Use the once() function to listen for the 'ready' event only once. The event
     *     listener will be removed after the event is dispatched.
     *   map.once('ready', () => {
     *     // Do something after the map loads
     *   });
     *
     * This is different from show() in that it loads the Google Maps API if it hasn't been loaded yet,
     * and then it will show the map. The show() function depends on G.loader to load the map first.
     *
     * @param {Function} callback The callback function to call after the map loads
     * @returns {Promise<void>}
     */
    load(callback?: () => void): Promise<Map>;
    /**
     * Try to locate the user using the GeoLocation API
     *
     * There are two ways to handle when the user's location is found:
     * 1. Pass a callback function to the locate() function
     *  map.locate({}, (position) => {
     *    // Do something with the position
     *  });
     * 2. Listen for the 'locationfound' event
     *  map.on('locationfound', (event) => {
     *   // Do something with the position
     *   // event is an instance of CustomEvent.
     *   // event.detail contains the position data
     *  });
     *
     * @param {LocateOptions|LocationOnSuccess} [options] The options for the locate() function. Or the callback function.
     * @param {Function} [onSuccess] The callback function for when the user's location is found.
     * @returns {Map}
     */
    locate(options?: LocateOptions | LocationOnSuccess, onSuccess?: LocationOnSuccess): Map;
    /**
     * @inheritdoc
     */
    hasListener(type: MapEvent, callback?: EventCallback): boolean;
    /**
     * @inheritdoc
     */
    off(type?: MapEvent, callback?: EventCallback, options?: EventListenerOptions): void;
    /**
     * @inheritdoc
     */
    on(type: MapEvent, callback: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onImmediate(type: MapEvent, callback: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    once(type: MapEvent, callback?: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onceImmediate(type: MapEvent, callback?: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    only(type: MapEvent, callback: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onlyOnce(type: MapEvent, callback: EventCallback, config?: EventConfig): void;
    /**
     * Add event listener for when the viewport bounds have changed.
     *
     * @param {EventCallback} callback The callback function to call when the map bounds change
     */
    onBoundsChanged(callback: EventCallback): void;
    /**
     * Add event listener for when the map center property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onCenterChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the map is clicked.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onClick(callback: EventCallback): void;
    /**
     * Add an event listener for when the DOM contextmenu is fired on the map container.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onContextMenu(callback: EventCallback): void;
    /**
     * Add an event listener for when the map is double clicked.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDblClick(callback: EventCallback): void;
    /**
     * Add an event listener for when the user drags the map.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDrag(callback: EventCallback): void;
    /**
     * Add an event listener for when the user stops dragging the map.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDragEnd(callback: EventCallback): void;
    /**
     * Add an event listener for when the user starts draging the map.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDragStart(callback: EventCallback): void;
    /**
     * Add an event listener for when the map heading value changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onHeadingChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the map becomes idle after panning or zooming.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onIdle(callback: EventCallback): void;
    /**
     * Add an event listener for when the isFractionalZoomEnabled property has changed.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onIsFractionalZoomEnabledChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when there is an error getting the user's location.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onLocationError(callback: EventCallback): void;
    /**
     * Add an event listener for when the user's location has been found.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onLocationFound(callback: EventCallback): void;
    /**
     * Add an event listener for when the map capabilities change.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onMapCapabilitiesChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the mapTypeId property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onMapTypeIdChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the user's mouse moves over the map container.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onMouseMove(callback: EventCallback): void;
    /**
     * Add an event listener for when the user's mouse exits the map container.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onMouseOut(callback: EventCallback): void;
    /**
     * Add an event listener for when the user's mouse enters the map container.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onMouseOver(callback: EventCallback): void;
    /**
     * Add an event listener for when the map projection has changed.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onProjectionChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the map is ready and visible
     *
     * This is a "shortcut" to "on('ready', callback)"
     *
     * @param {EventCallback} [callback] The callback function to call when the event is dispatched.
     */
    onReady(callback: EventCallback): void;
    /**
     * Add an event listener for when the map renderingType has changed.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onRenderingTypeChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the visible tiles have finished loading.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onTilesLoaded(callback: EventCallback): void;
    /**
     * Add an event listener for when the map tilt property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onTiltChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the map zoom property changes
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onZoomChanged(callback: EventCallback): void;
    /**
     * Changes the center of the map by the given distance in pixels.
     *
     * @param {number} x The number of pixels to move the map in the x direction
     * @param {number} y The number of pixels to move the map in the y direction
     */
    panBy(x: number, y: number): void;
    /**
     * Changes the center of the map to the lat/lng value.
     *
     * If the change is less than both the width and height of the map, the transition will be smoothly animated.
     *
     * @param {LatLngValue} value The latitude/longitude value to pan to
     */
    panTo(value: LatLngValue): void;
    /**
     * Resize the the map container to force the map to redraw itself.
     *
     * This is useful when the map is not displaying correctly, such as when the map is hidden and then shown.
     *
     * This will resize the element that the map is rendered in by default. If you need to resize a different element,
     * pass that element as the first argument.
     *
     * @param {HTMLElement|string} [element] The HTML element to resize if it needs to be different from the map element. This can be an HTMLElement or a CSS selector.
     */
    resize: (element?: HTMLElement | string) => void;
    /**
     * Set the API key
     *
     * @param {string} key The API key
     * @returns {Map}
     */
    setApiKey(key: string): Map;
    /**
     * Set the center point for the map
     *
     * @param {number|LatLngValue} latitude The latitude value or the latitude/longitude pair
     * @param {number} [longitude] The longitude value
     * @returns {Map}
     */
    setCenter(latitude: number | LatLngValue, longitude?: number): Map;
    /**
     * Set the latitude and longitude values and optionally update the center point.
     *
     * The times when you would not want to update the center point are when you are setting the latitude and longitude
     * and you don't want to recenter the map, but you want the latitude and longitude values to be available for future
     * times when the map may be centered.
     *
     * @param {number|string} latitude The latitude value
     * @param {number|string} longitude The longitude value
     * @param {boolean} [updateCenter] Whether to update the map center point. Defaults to true.
     * @returns {Map}
     */
    setLatitudeLongitude(latitude: number | string, longitude: number | string, updateCenter?: boolean): Map;
    /**
     * Set the map type ID
     *
     * @param {string} mapTypeId The map type ID to use for the map.
     * @returns {Map}
     */
    setMapTypeId(mapTypeId: string): Map;
    /**
     * Set the map options
     *
     * @param {MapOptions} options The map options
     * @returns {Map}
     */
    setOptions(options: MapOptions): Map;
    /**
     * Set the zoom value
     *
     * @param {number|string} zoom The zoom value
     * @returns {Map}
     */
    setZoom(zoom: number | string): Map;
    /**
     * Show the map
     *
     * If the Google Maps API hasn't loaded yet then this will wait for the "load" event to be dispatched.
     *
     * Unlike load(), this does not load the Google Maps API, it only shows the map.
     * You must load the map with G.loader before calling this function.
     *
     * @param {Function} callback The callback function to call after the map loads
     * @returns {Promise<void>}
     */
    show(callback?: () => void): Promise<Map>;
    /**
     * Stop watching for the user's location
     *
     * @returns {Map}
     */
    stopLocate(): Map;
    /**
     * Returns the Google map object
     *
     * @returns {google.maps.Map}
     */
    toGoogle(): google.maps.Map;
}
/**
 * Helper function to set up the map object
 *
 * @param {string|HTMLElement} selector The selector of the element that the map will be rendered in. Or the HTMLElement that the map will be rendered in.
 *      The selector can be a class name, an id, or an HTML element. If you need something beyond an id or class name as the selector then pass the element itself.
 * @param {MapOptions} [config] The map options
 * @returns {Map}
 */
declare const map: (selector: string | HTMLElement, config?: MapOptions) => Map;

/**
 * Base class to help with drawing stuff on the map.
 *
 * Other classes, like InfoWindow add functionality to this class with the include() method.
 */
declare class Layer extends Evented {
    #private;
    /**
     * This is an index signature so that Typescript does't complain about adding properties
     * to the class via mixins.
     *
     * For example, this lets us use attachTooltip() in the Marker class even though attachTooltip()
     * is applied to the layer via the Tooltip mixin.
     */
    [x: string]: any;
    /**
     * Get if the layer is visible or not
     *
     * @returns {boolean}
     */
    get isVisible(): boolean;
    /**
     * Set if the layer is visible or not
     *
     * @param {boolean} value Whether the layer is visible or not
     */
    set isVisible(value: boolean);
    /**
     * Return the Map object or null if the Map object is not set
     *
     * @returns {Map|null}
     */
    getMap(): Map | null;
    /**
     * Return if the layer has a Map object set
     *
     * @returns {boolean}
     */
    hasMap(): boolean;
    /**
     * Initialize the layer
     *
     * This is intended to be overridden by subclasses to perform any initialization that is needed.
     * This is not intended to be called outside of this library.
     *
     * This is called by other objects that depend on the element being initialized before doing their thing.
     * For example, attaching a tooltip to a marker will wait for the marker to be initialized before attaching the tooltip.
     *
     * @internal
     * @returns {Promise<void>}
     */
    init(): Promise<void>;
    /**
     * Clears the map object that the layer is added to
     *
     * Note, this does not remove the layer from the map, it just clears the map object from the layer.
     */
    removeMap(): void;
    /**
     * Sets the map object that the layer is added to
     *
     * This does not display the layer on the map, it only sets the map object for the layer.
     *
     * @param {Map} map The map object to add the layer to
     */
    setMap(map: Map | null): void;
}

type GMInfoWindowOptions = {
    ariaLabel?: string;
    content?: string | HTMLElement | Text;
    disableAutoPan?: boolean;
    event?: string;
    maxWidth?: number;
    minWidth?: number;
    pixelOffset?: Size;
    position?: LatLng;
    zIndex?: number;
};
type InfoWindowOptions = GMInfoWindowOptions & {
    autoClose?: boolean;
    focus?: boolean;
    pixelOffset?: SizeValue;
    position?: LatLngValue;
    toggleDisplay?: boolean;
};
type InfoWindowEvent = 'close' | 'closeclick' | 'content_changed' | 'domready' | 'position_changed' | 'visible' | 'zindex_changed';
/**
 * InfoWindow class
 */
declare class InfoWindow extends Layer {
    #private;
    /**
     * Constructor
     *
     * @param {InfoWindowOptions | string | HTMLElement | Text} [options] The InfoWindow options
     */
    constructor(options?: InfoWindowOptions | string | HTMLElement | Text);
    /**
     * Get the aria label for the InfoWindow
     *
     * @returns {string}
     */
    get ariaLabel(): string;
    /**
     * Set the aria label for the InfoWindow
     *
     * @param {string|number} ariaLabel The aria label for the InfoWindow
     */
    set ariaLabel(ariaLabel: string | number);
    /**
     * Get the content for the InfoWindow
     *
     * @returns {string|HTMLElement|Text}
     */
    get content(): string | HTMLElement | Text;
    /**
     * Set the content for the InfoWindow
     *
     * @param {string|HTMLElement|Text} content The content for the InfoWindow
     */
    set content(content: string | HTMLElement | Text);
    /**
     * Get the disableAutoPan option for the InfoWindow
     *
     * @returns {boolean}
     */
    get disableAutoPan(): boolean;
    /**
     * Set the disableAutoPan option for the InfoWindow
     *
     * @param {boolean} disableAutoPan The disableAutoPan option for the InfoWindow
     */
    set disableAutoPan(disableAutoPan: boolean);
    /**
     * Returns the event to trigger the popup
     *
     * @returns {string}
     */
    get event(): string;
    /**
     * Set the event to trigger the popup
     *
     * @param {string} event The event to trigger the popup
     */
    set event(event: string);
    /**
     * Get the maxWidth option for the InfoWindow
     *
     * @returns {number}
     */
    get maxWidth(): number;
    /**
     * Set the maxWidth option for the InfoWindow
     *
     * @param {number|string} maxWidth The maxWidth option for the InfoWindow
     */
    set maxWidth(maxWidth: number | string);
    /**
     * Get the minWidth option for the InfoWindow
     *
     * @returns {number}
     */
    get minWidth(): number;
    /**
     * Set the minWidth option for the InfoWindow
     *
     * @param {number|string} minWidth The minWidth option for the InfoWindow
     */
    set minWidth(minWidth: number | string);
    /**
     * Get the pixelOffset option for the InfoWindow
     *
     * @returns {Size}
     */
    get pixelOffset(): Size;
    /**
     * Set the pixelOffset option for the InfoWindow
     *
     * @param {SizeValue} pixelOffset The pixelOffset option for the InfoWindow
     */
    set pixelOffset(pixelOffset: SizeValue);
    /**
     * Get the position option for the InfoWindow
     *
     * @returns {LatLng}
     */
    get position(): LatLng;
    /**
     * Set the position option for the InfoWindow
     *
     * @param {LatLngValue} position The position option for the InfoWindow
     */
    set position(position: LatLngValue);
    /**
     * Get the zIndex option for the InfoWindow
     *
     * @returns {number}
     */
    get zIndex(): number;
    /**
     * Set the zIndex option for the InfoWindow
     *
     * @param {number|string} zIndex The zIndex option for the InfoWindow
     */
    set zIndex(zIndex: number | string);
    /**
     * Attach the InfoWindow to a element
     *
     * By default the InfoWindow will be shown when the element is clicked on.
     *
     * @param {Map | Layer} element The element to attach the InfoWindow to
     * @param {'click'|'clickon'|'hover'} [event] The event to trigger the InfoWindow. Defaults to 'click'
     *   - 'click' - Toggle the display of the InfoWindow when clicking on the element
     *   - 'clickon' - Show the InfoWindow when clicking on the element. It will always be shown and can't be hidden once the element is clicked.
     *   - 'hover' - Show the InfoWindow when hovering over the element. Hide the InfoWindow when the element is no longer hovered.
     * @returns {Promise<InfoWindow>}
     */
    attachTo(element: Map | Layer, event?: 'click' | 'clickon' | 'hover'): Promise<InfoWindow>;
    /**
     * Hide the info window
     *
     * Alias to hide()
     *
     * @returns {InfoWindow}
     */
    close(): InfoWindow;
    /**
     * Returns whether the InfoWindow already has content
     *
     * @returns {boolean}
     */
    hasContent(): boolean;
    /**
     * Hide the info window
     *
     * @returns {InfoWindow}
     */
    hide(): InfoWindow;
    /**
     * Returns whether the InfoWindow is open or not
     *
     * @returns {boolean}
     */
    isOpen(): boolean;
    /**
     * @inheritdoc
     */
    hasListener(type: InfoWindowEvent, callback?: EventCallback): boolean;
    /**
     * @inheritdoc
     */
    off(type?: InfoWindowEvent, callback?: EventCallback, options?: EventListenerOptions): void;
    /**
     * @inheritdoc
     */
    on(type: InfoWindowEvent, callback: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onImmediate(type: InfoWindowEvent, callback: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    once(type: InfoWindowEvent, callback?: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onceImmediate(type: InfoWindowEvent, callback?: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    only(type: InfoWindowEvent, callback: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onlyOnce(type: InfoWindowEvent, callback: EventCallback, config?: EventConfig): void;
    /**
     * Show the info window
     *
     * Alias to show()
     *
     * @param {Map | Layer} element The anchor object or map object.
     * @returns {Promise<InfoWindow>}
     */
    open(element: Map | Layer): Promise<InfoWindow>;
    /**
     * Set the InfoWindow options
     *
     * @param {InfoWindowOptions} options The InfoWindow options
     * @returns {InfoWindow}
     */
    setOptions(options: InfoWindowOptions): InfoWindow;
    /**
     * Set the InfoWindow content
     *
     * @param {string | HTMLElement | Text} content The InfoWindow content
     * @returns {InfoWindow}
     */
    setContent(content: string | HTMLElement | Text): InfoWindow;
    /**
     * Set the InfoWindow position
     *
     * @param {LatLngValue} position The position for the InfoWindow
     * @returns {InfoWindow}
     */
    setPosition(position: LatLngValue): InfoWindow;
    /**
     * Sets the zIndex value for the InfoWindow
     *
     * https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.setZIndex
     *
     * @param {number|string} zIndex The zindex value
     * @returns {InfoWindow}
     */
    setZIndex(zIndex: number | string): InfoWindow;
    /**
     * Show the info window
     *
     * You need to pass in either an anchor object or a map object.
     * If an anchor object is passed in then the info window will be displayed at the anchor's position.
     * If a map object is passed in then the info window will be displayed at the position of the info window.
     *
     * https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.open
     *
     * @param {Map | Layer} element The anchor object or map object.
     *      This should ideally be the Map or Marker object.
     * @returns {Promise<InfoWindow>}
     */
    show(element: Map | Layer): Promise<InfoWindow>;
    /**
     * Toggle the display of the overlay on the map
     *
     * @param {Map | Layer} element The anchor object or map object.
     * @returns {void}
     */
    toggle(element: Map | Layer): void;
    /**
     * Get the Google maps InfoWindow object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow
     *
     * @returns {google.maps.InfoWindow}
     */
    toGoogle(): google.maps.InfoWindow;
}
type InfoWindowValue = InfoWindow | InfoWindowOptions | string | HTMLElement | Text;
/**
 * Helper function to set up the InfoWindow class
 *
 * @param {InfoWindowValue} [options] The InfoWindow options
 * @returns {InfoWindow}
 */
declare const infoWindow: (options?: InfoWindowValue) => InfoWindow;

type LoaderOptions = {
    apiKey?: string;
    libraries?: Libraries;
    version?: string;
};
/**
 * Class to load the Google maps API
 *
 * This should be a singleton object and prevent multiple loader objects on the page.
 */
declare class Loader extends EventTarget {
    #private;
    /**
     * Class constructor
     *
     * @param {LoaderOptions} [options] The loader options object
     */
    constructor(options?: LoaderOptions);
    /**
     * Get the Google Maps API key
     *
     * @returns {string}
     */
    get apiKey(): string;
    /**
     * Set the Google Maps API key
     *
     * @param {string} apiKey The Google Maps API key
     */
    set apiKey(apiKey: string);
    /**
     * Get the libraries to load with Google maps
     *
     * @returns {Libraries}
     */
    get libraries(): Libraries;
    /**
     * Set the libraries to load with Google maps
     * The "places" library is a common one to load.
     * https://developers.google.com/maps/documentation/javascript/places
     *
     * @param {Libraries} libraries The libraries to load with Google maps
     */
    set libraries(libraries: Libraries);
    /**
     * Get the version of the Google Maps API to load
     *
     * @returns {string}
     */
    get version(): string;
    /**
     * Set the version of the Google Maps API to load
     * https://developers.google.com/maps/documentation/javascript/versions
     *
     * @param {string} version The version of the Google Maps API to load
     */
    set version(version: string);
    /**
     * Set the loader options
     *
     * @param {LoaderOptions} options The loader options object
     * @returns {Loader}
     */
    setOptions(options: LoaderOptions): Loader;
    /**
     * Set the Google Maps API key
     *
     * @param {string} apiKey The Google Maps API key
     * @returns {Loader}
     */
    setApiKey(apiKey: string): Loader;
    /**
     * Set the libraries to load with Google maps
     * The "places" library is a common one to load.
     * https://developers.google.com/maps/documentation/javascript/places
     *
     * @param {Libraries} libraries The libraries to load with Google maps
     * @returns {Loader}
     */
    setLibraries(libraries: Libraries): Loader;
    /**
     * Set the version of the Google Maps API to load
     * https://developers.google.com/maps/documentation/javascript/versions
     *
     * @param {string} version The version of the Google Maps API to load
     * @returns {Loader}
     */
    setVersion(version: string): Loader;
    /**
     * Load the Google maps API
     *
     * @param {Function} callback A callback function to run when the Google maps API has loaded
     * @returns {Promise<void>}
     */
    load(callback?: () => void): Promise<void>;
    /**
     * Dispatch an event
     *
     * @param {string} event The event to dispatch
     */
    dispatch(event: string): void;
    /**
     * Add an event listener to the object.
     *
     * All events on the loader object are set up as "once" events because the
     * load event is only dispatched one time when the Google maps API is loaded.
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener function
     */
    on(type: string, callback: EventListenerOrEventListenerObject): void;
    /**
     * Sets up an event listener for the "load" event.
     *
     * All events on the loader object are set up as "once" events because the
     * load event is only dispatched one time when the Google maps API is loaded.
     *
     * @param {Function} callback A callback function to run when the Google maps API has loaded
     */
    onLoad(callback: EventListenerOrEventListenerObject): void;
    /**
     * Sets up an event listener for the "map_load" event.
     *
     * All events on the loader object are set up as "once" events because the
     * load event is only dispatched one time when the Google maps API is loaded.
     *
     * @param {Function} callback A callback function to run when the Google maps API has loaded
     */
    onMapLoad(callback: EventListenerOrEventListenerObject): void;
    /**
     * Sets up an event listener that will only be called once
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener function
     */
    once(type: string, callback: EventListenerOrEventListenerObject | null): void;
    /**
     * Sets up an event listener for the "load" event that will only be called once.
     *
     * @param {Function} callback A callback function to run when the Google maps API has loaded
     */
    onceLoad(callback: EventListenerOrEventListenerObject | null): void;
    /**
     * Sets up an event listener for the "map_load" event that will only be called once.
     *
     * @param {Function} callback A callback function to run when the Google maps API has loaded
     */
    onceMapLoad(callback: EventListenerOrEventListenerObject | null): void;
}
/**
 * Helper function to set up the loader object.
 *
 * Only one loader object can be created on a page.
 * This prevents trying to load the Google maps library multiple times.
 * It also allows us to internally handle when the Google maps library is loaded.
 *
 * @param {LoaderOptions} [config] The loader options
 * @returns {Loader}
 */
declare const loader: (config?: LoaderOptions) => Loader;

type SvgSymbolOptions = {
    anchor?: PointValue;
    fillColor?: string;
    fillOpacity?: number;
    labelOrigin?: PointValue;
    path: string;
    rotation?: number;
    scale?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
};
/**
 * Class to set up an SVG icon for a marker
 */
declare class SvgSymbol extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {string | SvgSymbolOptions} [path] The SVG path for the icon or the icon options
     * @param {SvgSymbolOptions} [options] The options for the icon
     */
    constructor(path?: string | SvgSymbolOptions, options?: SvgSymbolOptions);
    /**
     * Get the anchor point
     *
     * @returns {PointValue}
     */
    get anchor(): PointValue;
    /**
     * Set the position at which to anchor an image in correspondence to the location of the marker on the map.
     *
     * @param {PointValue} anchor The anchor point value
     */
    set anchor(anchor: PointValue);
    /**
     * Get the SVG fill color
     *
     * @returns {string}
     */
    get fillColor(): string;
    /**
     * Set the SVG fill color.
     *
     * @param {string} fillColor The SVG fill color.
     */
    set fillColor(fillColor: string);
    /**
     * Get the opacity for the fill
     *
     * @returns {number}
     */
    get fillOpacity(): number;
    /**
     * Set the opacity for the fill
     *
     * @param {number|string} fillOpacity The opacity for the fill
     */
    set fillOpacity(fillOpacity: number | string);
    /**
     * Get the origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
     *
     * @returns {PointValue}
     */
    get labelOrigin(): PointValue;
    /**
     * Set the origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
     *
     * @param {PointValue} labelOrigin The origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
     */
    set labelOrigin(labelOrigin: PointValue);
    /**
     * Get the SVG path for the icon
     *
     * @returns {string}
     */
    get path(): string;
    /**
     * Set the SVG path for the icon
     *
     * @param {path} path The SVG path for the icon
     */
    set path(path: string);
    /**
     * Get the rotation of the icon in degrees clockwise about the anchor point.
     *
     * @returns {number}
     */
    get rotation(): number;
    /**
     * Set the rotation of the icon in degrees clockwise about the anchor point.
     *
     * @param {number|string} rotation The rotation of the icon in degrees clockwise about the anchor point.
     */
    set rotation(rotation: number | string);
    /**
     * Get the amount by which the icon is scaled.
     *
     * @returns {number}
     */
    get scale(): number;
    /**
     * Set the amount by which the icon is scaled.
     *
     * @param {number|string} scale The amount by which the icon is scaled.
     */
    set scale(scale: number | string);
    /**
     * Get the SVG stroke color
     *
     * @returns {string}
     */
    get strokeColor(): string;
    /**
     * Set the SVG stroke color.
     *
     * @param {string} strokeColor The SVG stroke color.
     */
    set strokeColor(strokeColor: string);
    /**
     * Get the opacity of the stroke.
     * The opacity of the stroke, where 0 is fully transparent and 1 is fully opaque.
     *
     * @returns {number}
     */
    get strokeOpacity(): number;
    /**
     * Set the opacity of the stroke.
     *
     * @param {number|string} strokeOpacity The opacity of the stroke.
     */
    set strokeOpacity(strokeOpacity: number | string);
    /**
     * Get the weight of the stroke in pixels.
     *
     * @returns {number}
     */
    get strokeWeight(): number;
    /**
     * Set the weight of the stroke.
     *
     * @param {number|string} strokeWeight The weight of the stroke.
     */
    set strokeWeight(strokeWeight: number | string);
    /**
     * Set the icon options
     *
     * @param {SvgSymbolOptions} options The icon options
     * @returns {SvgSymbol}
     */
    setOptions(options: SvgSymbolOptions): SvgSymbol;
    /**
     * Set the position at which to anchor an image in correspondence to the location of the marker on the map.
     * Use this if for some reason you didn't pass the anchor in the icon options.
     *
     * By default, the anchor is located along the center point of the bottom of the image.
     *
     * const symbol = G.icon({
     *    url: 'https://mywebsite.com/images/marker.png',
     * });
     * symbol.setAnchor([10, 32]);
     *
     * Valid values are:
     * symbol.setAnchor([10, 32]);
     * symbol.setAnchor({x: 10, y: 32});
     * symbol.setAnchor(pointClassInstance);
     *
     * @param {PointValue} anchor The anchor point value
     * @returns {SvgSymbol}
     */
    setAnchor(anchor: PointValue): SvgSymbol;
    /**
     * Set the SVG fill color.
     *
     * @param {string} fillColor The SVG fill color.
     * @returns {SvgSymbol}
     */
    setFillColor(fillColor: string): SvgSymbol;
    /**
     * Set the opacity for the fill
     *
     * @param {number|string} fillOpacity The opacity for the fill
     * @returns {SvgSymbol}
     */
    setFillOpacity(fillOpacity: number | string): SvgSymbol;
    /**
     * Set the origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
     *
     * @param {PointValue} labelOrigin The origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
     * @returns {SvgSymbol}
     */
    setLabelOrigin(labelOrigin: PointValue): SvgSymbol;
    /**
     * Set the SVG path for the icon
     *
     * @param {path} path The SVG path for the icon
     * @returns {SvgSymbol}
     */
    setPath(path: string): SvgSymbol;
    /**
     * Set the rotation of the icon in degrees clockwise about the anchor point.
     *
     * @param {number|string} rotation The rotation of the icon in degrees clockwise about the anchor point.
     * @returns {SvgSymbol}
     */
    setRotation(rotation: number | string): SvgSymbol;
    /**
     * Set the amount by which the icon is scaled.
     *
     * @param {number|string} scale The amount by which the icon is scaled.
     * @returns {SvgSymbol}
     */
    setScale(scale: number | string): SvgSymbol;
    /**
     * Set the SVG stroke color.
     *
     * @param {string} strokeColor The SVG stroke color.
     * @returns {SvgSymbol}
     */
    setStrokeColor(strokeColor: string): SvgSymbol;
    /**
     * Set the opacity of the stroke.
     *
     * @param {number|string} strokeOpacity The opacity of the stroke.
     * @returns {SvgSymbol}
     */
    setStrokeOpacity(strokeOpacity: number | string): SvgSymbol;
    /**
     * Set the weight of the stroke.
     *
     * @param {number|string} strokeWeight The weight of the stroke.
     * @returns {SvgSymbol}
     */
    setStrokeWeight(strokeWeight: number | string): SvgSymbol;
    /**
     * Get the icon options
     *
     * @returns {Promise<google.maps.Symbol>}
     */
    toGoogle(): Promise<google.maps.Symbol>;
}
type SvgSymbolValue = SvgSymbol | string | SvgSymbolOptions;
/**
 * Helper function to set up the icon object
 *
 * @param {SvgSymbolValue} [path] The SVG path for the icon, the icon object, or the icon options
 * @param {SvgSymbolOptions} [options] The options for the icon
 * @returns {SvgSymbol}
 */
declare const svgSymbol: (path?: SvgSymbolValue, options?: SvgSymbolOptions) => SvgSymbol;

/**
 * Base class to help with drawing overlays on the map.
 *
 * The methods are purposely left blank so you can override them in your own class.
 * The methods are called from the OverlayView class in the draw(), onAdd(), and onRemove() methods.
 */
declare class Overlay extends Layer {
    #private;
    /**
     * Constructor
     *
     * @param {string} objectType The object type for the class
     * @param {string} testObject The object that needs Google maps. This should be the name of the object that calls this method.
     * @param {string} [testLibrary] An optional Google maps library class to check for. This needs to be part of the google.maps object.
     */
    constructor(objectType: string, testObject: string, testLibrary?: string);
    /**
     * Get the class name for the overlay element
     *
     * @returns {string}
     */
    get className(): string;
    /**
     * Set the class name(s) for the overlay element
     *
     * If you need multiple class names then separate them with a space.
     *
     * @param {string} className The class name(s) to add to the overlay.
     *    This can be a space separated list of class names.
     */
    set className(className: string);
    /**
     * Returns the offset value
     *
     * @returns {Point}
     */
    get offset(): Point;
    /**
     * Set the x,y offset for the overlay
     *
     * This lets you have the offset show a certain number of pixels from it's lat/lng position.
     *
     * @param {PointValue} value The offset value
     */
    set offset(value: PointValue);
    /**
     * Returns the position of the overlay
     *
     * @returns {LatLng}
     */
    get position(): LatLng;
    /**
     * Set the position of the overlay
     *
     * @param {LatLngValue} value The position of the overlay
     */
    set position(value: LatLngValue);
    /**
     * Returns the styles for the overlay element
     *
     * @returns {object}
     */
    get styles(): object;
    /**
     * Set the styles for the overlay element
     *
     * @param {object} styles The styles to apply to the overlay element
     */
    set styles(styles: object);
    /**
     * Display the overlay on the map
     *
     * Alias to show()
     *
     * @param {Map} map The Map object
     * @returns {Promise<Overlay>}
     */
    display(map: Map): Promise<Overlay>;
    /**
     * Computes the geographical coordinates from pixel coordinates in the map's container.
     *
     * This is a shortcut to getting the projection from the overlay and then calling
     * fromContainerPixelToLatLng on the projection with the pixel value.
     *
     * @param {PointValue} x The Point value or the x numeric point value.
     * @param {number} [y] The y value if x is a number.
     * @returns {LatLng}
     */
    getContainerLatLngFromPixel(x: PointValue, y?: number): LatLng;
    /**
     * Computes the geographical coordinates from pixel coordinates in the div that holds the draggable map.
     *
     * This is a shortcut to getting the projection from the overlay and then calling
     * fromDivPixelToLatLng on the projection with the pixel value.
     *
     * @param {PointValue} x The Point value or the x numeric point value.
     * @param {number} [y] The y value if x is a number.
     * @returns {LatLng}
     */
    getDivLatLngFromPixel(x: PointValue, y?: number): LatLng;
    /**
     * Get the offset value
     *
     * @returns {Point}
     */
    getOffset(): Point;
    /**
     * Get the overlay HTML element
     *
     * @returns {HTMLElement}
     */
    getOverlayElement(): HTMLElement;
    /**
     * Get the position of the overlay
     *
     * @returns {LatLng}
     */
    getPosition(): LatLng;
    /**
     * Returns the MapCanvasProjection object associated with this OverlayView.
     *
     * The projection is not initialized until onAdd is called by the API.
     *
     * https://developers.google.com/maps/documentation/javascript/reference/overlay-view#MapCanvasProjection
     *
     * @returns {google.maps.MapCanvasProjection}
     */
    getProjection(): google.maps.MapCanvasProjection;
    /**
     * Returns whether the overlay has a position
     *
     * @returns {boolean}
     */
    hasPosition(): boolean;
    /**
     * Hide the overlay
     *
     * @returns {Overlay}
     */
    hide(): Overlay;
    /**
     * Moves the overlay to a new position.
     *
     * If the overlay is not visible, it will be shown.
     * If it's already visible on the map, it will be moved to the new position.
     *
     * @param {LatLngValue} position The latitude/longitude position of where the overlay should show
     * @param {Map} [map] The Map object
     * @returns {Promise<Overlay>}
     */
    move(position: LatLngValue, map?: Map): Promise<Overlay>;
    /**
     * Add an event listener for when the overlay is opened.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onOpen(callback: EventCallback): void;
    /**
     * Removes a class name from the overlay element
     *
     * @param {string} className The class name to remove from the overlay element
     * @returns {Overlay}
     */
    removeClassName(className: string): Overlay;
    /**
     * Set the class name(s) for the overlay element
     *
     * If you need multiple class names then separate them with a space.
     *
     * @param {string} className The class name(s) to add to the overlay.
     *    This can be a space separated list of class names.
     * @returns {Overlay}
     */
    setClassName(className: string): Overlay;
    /**
     * Set the map object to display the overlay in
     *
     * Alias to show()
     *
     * @param {Map} map The Map object
     * @returns {Promise<Overlay>}
     */
    setMap(map: Map): Promise<Overlay>;
    /**
     * Set the x,y offset for the overlay
     *
     * This lets you have the offset show a certain number of pixels from it's lat/lng position.
     *
     * @param {PointValue} offset The offset value
     * @returns {Overlay}
     */
    setOffset(offset: PointValue): Overlay;
    /**
     * Set the position of the overlay
     *
     * @param {LatLngValue} position The latitude/longitude position of where the overlay should show
     * @returns {Overlay}
     */
    setPosition(position: LatLngValue): Overlay;
    /**
     * Set the styles for the overlay element
     *
     * @param {object} styles The styles to apply to the overlay element
     * @returns {Overlay}
     */
    setStyles(styles: object): Overlay;
    /**
     * Add the overlay to the map.
     *
     * Alias for setMap()
     *
     * @param {Map} map The Map object
     * @returns {Promise<Overlay>}
     */
    show(map: Map): Promise<Overlay>;
    /**
     * Set a single style on the overlay element
     *
     * @param {string} name The style name
     * @param {string} value The style value
     * @returns {Overlay}
     */
    style(name: string, value: string): Overlay;
    /**
     * Toggle the display of the overlay on the map
     *
     * @param {Map} map The map object
     * @returns {void}
     */
    toggle(map: Map): void;
    /**
     * Add the overlay to the map. Called once after setMap() is called on the overlay with a valid map.
     *
     * This is called by the internal OverlayView class. It should not be called directly.
     *
     * @internal
     * @param {google.maps.MapPanes} panes The Google maps panes object
     */
    add(panes: google.maps.MapPanes): void;
    /**
     * Draw the overlay. Called when the overlay is being drawn or updated.
     *
     * This is called by the internal OverlayView class. It should not be called directly.
     *
     * @internal
     * @param {google.maps.MapCanvasProjection} projection The Google maps projection object
     */
    draw(projection: google.maps.MapCanvasProjection): void;
    /**
     * Remove the overlay from the map.
     * This method is called once following a call to setMap(null).
     *
     * This is called by the internal OverlayView class. It should not be called directly.
     *
     * @internal
     */
    remove(): void;
}
/**
 * Helper function to set up the overlay object
 *
 * @returns {Overlay}
 */
declare const overlay: () => Overlay;

type TooltipOptions = {
    center?: boolean;
    className?: string;
    content?: string | HTMLElement | Text;
    event?: string;
    map?: Map;
    offset?: PointValue;
    position?: LatLngValue;
    styles?: object;
    theme?: string;
};
/**
 * Tooltip class
 */
declare class Tooltip extends Overlay {
    #private;
    /**
     * Constructor
     *
     * @param {TooltipOptions | string | HTMLElement | Text} [options] Tooltip options
     */
    constructor(options?: TooltipOptions | string | HTMLElement | Text);
    /**
     * Returns whether to center the tooltip horizontally on the element.
     *
     * @returns {boolean}
     */
    get center(): boolean;
    /**
     * Set whether to center the tooltip horizontally on the element. Useful if the tooltip is on a marker.
     *
     * @param {boolean} center Whether to center the tooltip on the element
     */
    set center(center: boolean);
    /**
     * Returns the content for the tooltip
     *
     * @returns {string|HTMLElement|Text}
     */
    get content(): string | HTMLElement | Text;
    /**
     * Set the content for the tooltip
     *
     * @param {string|HTMLElement|Text} content The content for the tooltip
     */
    set content(content: string | HTMLElement | Text);
    /**
     * Returns the event to trigger the tooltip
     *
     * @returns {string}
     */
    get event(): string;
    /**
     * Set the event to trigger the tooltip
     *
     * @param {string} event The event to trigger the tooltip
     */
    set event(event: string);
    /**
     * Returns the theme to use for the tooltip
     *
     * @returns {string}
     */
    get theme(): string;
    /**
     * Set the theme to use for the tooltip
     *
     * @param {string} theme The theme to use for the tooltip
     */
    set theme(theme: string);
    /**
     * Attach the tooltip to a element
     *
     * By default the tooltip will be shown when hovering over the element.
     *
     * @param {Map | Layer} element The element to attach the tooltip to
     * @param {'click'|'clickon'|'hover'} [event] The event to trigger the tooltip. Defaults to 'hover'
     *   - 'click' - Toggle the display of the tooltip when clicking on the element
     *   - 'clickon' - Show the tooltip when clicking on the element. It will always be shown and can't be hidden once the element is clicked.
     *   - 'hover' - Show the tooltip when hovering over the element. Hide the tooltip when the element is no longer hovered.
     * @returns {Promise<Tooltip>}
     */
    attachTo(element: Map | Layer, event?: 'click' | 'clickon' | 'hover'): Promise<Tooltip>;
    /**
     * Returns whether the tooltip already has content
     *
     * @returns {boolean}
     */
    hasContent(): boolean;
    /**
     * Set the content for the tooltip
     *
     * @param {string|HTMLElement} content The content for the tooltip
     * @returns {Tooltip}
     */
    setContent(content: string | HTMLElement): Tooltip;
    /**
     * Sets the options for the tooltip
     *
     * @param {TooltipOptions} options Tooltip options
     * @returns {Tooltip}
     */
    setOptions(options: TooltipOptions): Tooltip;
    /**
     * Add the overlay to the map. Called once after setMap() is called on the overlay with a valid map.
     *
     * @internal
     * @param {google.maps.MapPanes} panes The Google maps panes object
     */
    add(panes: google.maps.MapPanes): void;
    /**
     * Draw the overlay. Called when the overlay is being drawn or updated.
     *
     * @internal
     * @param {google.maps.MapCanvasProjection} projection The Google maps projection object
     */
    draw(projection: google.maps.MapCanvasProjection): void;
}
type TooltipValue = Tooltip | TooltipOptions | string | HTMLElement | Text;
/**
 * Helper function to set up the tooltip object
 *
 * @param {TooltipValue} [options] The tooltip options or the tooltip class
 * @returns {Tooltip}
 */
declare const tooltip: (options?: TooltipValue) => Tooltip;

type MarkerLabel = google.maps.MarkerLabel;
type CustomData$1 = {
    [key: string]: any;
};
type GMMarkerOptions = {
    anchorPoint?: Point;
    cursor?: string;
    draggable?: boolean;
    icon?: Icon | SvgSymbol | string;
    label?: string | MarkerLabel;
    map?: Map;
    position?: LatLng;
    title?: string;
};
type MarkerOptions = GMMarkerOptions & {
    anchorPoint?: PointValue;
    data?: CustomData$1;
    icon?: IconValue;
    lat?: number | string;
    latitude?: number | string;
    lng?: number | string;
    longitude?: number | string;
    position?: LatLngValue;
    svgIcon?: SvgSymbolValue | string;
    tooltip?: TooltipValue;
};
type MarkerEvent = 'animation_changed' | 'click' | 'clickable_changed' | 'contextmenu' | 'cursor_changed' | 'dblclick' | 'drag' | 'dragend' | 'draggable_changed' | 'dragstart' | 'flat_changed' | 'icon_changed' | 'mousedown' | 'mouseout' | 'mouseover' | 'mouseup' | 'position_changed' | 'ready' | 'shape_changed' | 'title_changed' | 'visible_changed' | 'zindex_changed';
/**
 * Marker class to set up a single marker and add it to the map
 */
declare class Marker extends Layer {
    #private;
    /**
     * Constructor
     *
     * @param {LatLngValue|MarkerOptions} [position] The latitude longitude pair
     * @param {MarkerOptions} [options] The marker options
     */
    constructor(position?: LatLngValue | MarkerOptions, options?: MarkerOptions);
    /**
     * Get the anchor point for the marker
     *
     * @returns {Point}
     */
    get anchorPoint(): Point;
    /**
     * Set the anchor point for the marker
     *
     * @param {PointValue} value The anchor point for the marker
     */
    set anchorPoint(value: PointValue);
    /**
     * Get the cursor type to show on hover
     *
     * @returns {string}
     */
    get cursor(): string;
    /**
     * Set the cursor type to show on hover
     *
     * @param {string} value The cursor type to show on hover
     */
    set cursor(value: string);
    /**
     * Get the custom data attached to the marker object
     *
     * @returns {CustomData}
     */
    get data(): CustomData$1;
    /**
     * Set custom data to attach to the marker object
     *
     * @param {CustomData} value The custom data to attach to the marker object
     */
    set data(value: CustomData$1);
    /**
     * Get whether the marker can be dragged on the map
     *
     * @returns {boolean}
     */
    get draggable(): boolean;
    /**
     * Set whether the marker can be dragged on the map
     *
     * @param {boolean} value Whether the marker can be dragged on the map
     */
    set draggable(value: boolean);
    /**
     * Get the icon for the marker
     *
     * @returns {Icon | SvgSymbol | string}
     */
    get icon(): Icon | SvgSymbol | string;
    /**
     * Set the icon for the marker
     *
     * @param {Icon | SvgSymbol | string} value The icon value for the marker
     */
    set icon(value: Icon | SvgSymbol | string);
    /**
     * Get the label for the marker
     *
     * @returns {string | number | MarkerLabel}
     */
    get label(): string | number | MarkerLabel;
    /**
     * Set the label for the marker
     *
     * @param {string | number | MarkerLabel} value The label value for the marker
     */
    set label(value: string | number | MarkerLabel);
    /**
     * Get the map object
     *
     * @returns {Map}
     */
    get map(): Map;
    /**
     * Set the map object
     *
     * @param {Map|null} value The map object. Set to null if you want to remove the marker from the map.
     */
    set map(value: Map | null);
    /**
     * Get the marker position
     *
     * @returns {LatLng}
     */
    get position(): LatLng;
    /**
     * Set the latitude and longitude value for the marker
     *
     * @param {LatLngValue} value The latitude/longitude position for the marker
     */
    set position(value: LatLngValue);
    /**
     * Get the title for the marker
     *
     * @returns {string}
     */
    get title(): string;
    /**
     * Set the title for the marker
     *
     * @param {string} value The title for the marker
     */
    set title(value: string);
    /**
     * Adds the marker to the map object
     *
     * Alternate of show()
     *
     * @param {Map} map The map object
     * @returns {Marker}
     */
    display(map: Map): Marker;
    /**
     * Get any custom data attached to the marker object.
     *
     * Optionally pass a data key to get the value for that key.
     *
     * @param {string} [key] The object key to get data for. If not set then all data is returned.
     * @returns {any}
     */
    getData(key?: string): CustomData$1;
    /**
     * Returns whether the marker can be dragged on the map
     *
     * @returns {boolean}
     */
    getDraggable(): boolean;
    /**
     * Get the marker position (i.e. the LatLng object)
     *
     * https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
     *
     * @returns {LatLng}
     */
    getPosition(): LatLng;
    /**
     * Hide the marker
     *
     * @returns {Marker}
     */
    hide(): Marker;
    /**
     * Initialize the marker
     *
     * This is used when another element (like a tooltip) needs to be attached to the marker,
     * but needs to make sure that the marker exists first.
     *
     * This is not intended to be called outside of this library.
     *
     * @internal
     * @returns {Promise<void>}
     */
    init(): Promise<void>;
    /**
     * @inheritdoc
     */
    hasListener(type: MarkerEvent, callback?: EventCallback): boolean;
    /**
     * @inheritdoc
     */
    off(type?: MarkerEvent, callback?: EventCallback, options?: EventListenerOptions): void;
    /**
     * @inheritdoc
     */
    on(type: MarkerEvent, callback: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onImmediate(type: MarkerEvent, callback: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    once(type: MarkerEvent, callback?: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onceImmediate(type: MarkerEvent, callback?: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    only(type: MarkerEvent, callback: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onlyOnce(type: MarkerEvent, callback: EventCallback, config?: EventConfig): void;
    /**
     * Add an event listener for when the marker's animation changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onAnimationChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the marker icon is clicked.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onClick(callback: EventCallback): void;
    /**
     * Add an event listener for when the marker clickable property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onClickableChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the DOM context menu is triggered on the marker.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onContextMenu(callback: EventCallback): void;
    /**
     * Add an event listener for when the marker cursor property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onCursorChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the marker is double clicked.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDblClick(callback: EventCallback): void;
    /**
     * Add an event listener for when the user drags the marker.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDrag(callback: EventCallback): void;
    /**
     * Add an event listener for when the user stops dragging the marker.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDragEnd(callback: EventCallback): void;
    /**
     * Add an event listener for when the marker draggable property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDraggableChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the user starts dragging the marker.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDragStart(callback: EventCallback): void;
    /**
     * Add an event listener for when the marker flat property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onFlatChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the marker icon property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onIconChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the user's mouse is pressed down on the marker.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onMouseDown(callback: EventCallback): void;
    /**
     * Add an event listener for when the user's mouse leaves the marker icon.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onMouseOut(callback: EventCallback): void;
    /**
     * Add an event listener for when the user's mouse enters the marker icon.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onMouseOver(callback: EventCallback): void;
    /**
     * Add an event listener for the mouseup event on the marker.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onMouseUp(callback: EventCallback): void;
    /**
     * Add an event listener for when the marker's position property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onPositionChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the marker is loaded and ready for use.
     *
     * @param {EventCallback} [callback] The callback function to call when the event is dispatched.
     */
    onReady(callback: EventCallback): void;
    /**
     * Add an event listener for when the marker's shape property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onShapeChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the marker's title property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onTitleChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the marker's visible property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onVisibleChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the marker's zindex property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onZIndexChanged(callback: EventCallback): void;
    /**
     * Set the anchor point for the marker
     *
     * @param {PointValue} value The anchor point for the marker
     * @returns {Promise<Marker>}
     */
    setAnchorPoint(value: PointValue): Promise<Marker>;
    /**
     * Set the anchor point for the marker syncronously.
     *
     * Only use this if you know that the Google Maps library is already loaded and you have to set up the marker
     * syncronously. If you don't have to set up the marker syncronously, then use setAnchorPoint() instead or pass the
     * anchor point to the constructor or setOptions().
     *
     * @param {PointValue} value The anchor point for the marker
     * @returns {Marker}
     */
    setAnchorPointSync(value: PointValue): Marker;
    /**
     * Set the cursor type to show on hover
     *
     * @param {string} value The cursor type to show on hover
     * @returns {Promise<Marker>}
     */
    setCursor(value: string): Promise<Marker>;
    /**
     *  Set the cursor type to show on hover
     *
     * Only use this if you know that the Google Maps library is already loaded and you have to set up the marker
     * syncronously. If you don't have to set up the marker syncronously, then use setCursor() instead or pass the
     * cursor to the constructor or setOptions().
     *
     * @param {string} value The cursor type to show on hover
     * @returns {Marker}
     */
    setCursorSync(value: string): Marker;
    /**
     * Set whether the marker can be dragged on the map
     *
     * @param {boolean} value Whether the marker can be dragged on the map
     * @returns {Promise<Marker>}
     */
    setDraggable(value: boolean): Promise<Marker>;
    /**
     * Set whether the marker can be dragged on the map
     *
     * Only use this if you know that the Google Maps library is already loaded and you have to set up the marker
     * syncronously. If you don't have to set up the marker syncronously, then use setDraggable() instead or pass the
     * draggable option to the constructor or setOptions().
     *
     * @param {boolean} value Whether the marker can be dragged on the map
     * @returns {Marker}
     */
    setDraggableSync(value: boolean): Marker;
    /**
     * Set the icon value for the marker
     *
     * @param {Icon | SvgSymbol | string} value The icon for the marker
     * @returns {Marker}
     */
    setIcon(value: Icon | SvgSymbol | string): Promise<Marker>;
    /**
     * Set the icon value for the marker syncronously.
     *
     * Only use this if you know that the Google Maps library is already loaded and you have to set up the marker
     * syncronously. If you don't have to set up the marker syncronously, then use setIcon() instead or pass the
     * icon to the constructor or setOptions().
     *
     * @param {Icon | SvgSymbol | string} value The icon for the marker
     * @returns {Marker}
     */
    setIconSync(value: Icon | SvgSymbol | string): Marker;
    /**
     * Set the label value for the marker
     *
     * @param {string | number | MarkerLabel} value The label for the marker
     * @returns {Marker}
     */
    setLabel(value: string | number | MarkerLabel): Promise<Marker>;
    /**
     * Set the label value for the marker syncronously.
     *
     * Only use this if you know that the Google Maps library is already loaded and you have to set up the marker
     * syncronously. If you don't have to set up the marker syncronously, then use setLabel() instead or pass the
     * label to the constructor or setOptions().
     *
     * @param {string | number | MarkerLabel} value The label for the marker
     * @returns {Marker}
     */
    setLabelSync(value: string | number | MarkerLabel): Marker;
    /**
     * Adds the marker to the map object
     *
     * Alternate of show()
     *
     * @param {Map} map The map object. Set to null if you want to remove the marker from the map.
     * @returns {Promise<Marker>}
     */
    setMap(map: Map | null): Promise<Marker>;
    /**
     * Set the map object
     *
     * Only use this if you know that the Google Maps library is already loaded and you have to set up the marker
     * syncronously. If you don't have to set up the marker syncronously, then use setMap() instead or pass the
     * map to the constructor or setOptions().
     *
     * @param {Map|null} map The map object. Set to null if you want to remove the marker from the map.
     * @returns {Marker}
     */
    setMapSync(map: Map | null): Marker;
    /**
     * Set the marker options
     *
     * @param {MarkerOptions} options The marker options
     * @returns {Marker}
     */
    setOptions(options: MarkerOptions): Marker;
    /**
     * Set the latitude and longitude value for the marker
     *
     * @param {LatLngValue} value The latitude/longitude position for the marker
     * @returns {Promise<Marker>}
     */
    setPosition(value: LatLngValue): Promise<Marker>;
    /**
     * Set the latitude and longitude value for the marker syncronously.
     *
     * Only use this if you know that the Google Maps library is already loaded and you have to set up the marker
     * syncronously. If you don't have to set up the marker syncronously, then use setPosition() instead or pass the
     * position to the constructor or setOptions().
     *
     * @param {LatLngValue} value The latitude/longitude position for the marker
     * @returns {Marker}
     */
    setPositionSync(value: LatLngValue): Marker;
    /**
     *Set the title for the marker
     *
     * @param {string} value The title to show on hover
     * @returns {Promise<Marker>}
     */
    setTitle(value: string): Promise<Marker>;
    /**
     * Set the title for the marker
     *
     * Only use this if you know that the Google Maps library is already loaded and you have to set up the marker
     * syncronously. If you don't have to set up the marker syncronously, then use setTitle() instead or pass the
     * title to the constructor or setOptions().
     *
     * @param {string} value The title to show on hover
     * @returns {Marker}
     */
    setTitleSync(value: string): Marker;
    /**
     * Adds the marker to the map object
     *
     * Alternate of setMap()
     *
     * @param {Map} map The map object
     * @returns {Promise<Marker>}
     */
    show(map: Map): Promise<Marker>;
    /**
     * Get the Google maps marker object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker
     *
     * @returns {Promise<google.maps.Marker>}
     */
    toGoogle(): Promise<google.maps.Marker>;
    /**
     * Get the Google maps marker object synchronously. Throw an error if the Google Maps library is not available.
     *
     * This is different from toGoogle() because it will throw an error if the Google Maps library is not available,
     * whereas toGoogle() will wait for the Google Maps library to load.
     *
     * Only use this when you have to get the Google Maps object synchronously and you know that the Google Maps library is already loaded.
     * If you don't have to get the Google Maps object synchronously, then use toGoogle() instead.
     *
     * @returns {google.maps.Marker}
     */
    toGoogleSync(): google.maps.Marker;
}
type MarkerValue = Marker | MarkerOptions | LatLngValue;
/**
 * Helper function to set up the marker object
 *
 * @param {MarkerValue} [position] The latitude/longitude pair or the marker options
 * @param {MarkerOptions} [options] The marker options
 * @returns {Marker}
 */
declare const marker: (position?: MarkerValue, options?: MarkerOptions) => Marker;

type ClusterColor = {
    bgColor: string;
    textColor: string;
};
type ClusterColors = {
    [key: number]: string | ClusterColor;
};

type ClusterImage = {
    height?: number;
    labelClassName?: string;
    labelColor?: string;
    labelFontFamily?: string;
    labelFontSize?: string | number;
    labelFontWeight?: string;
    scaledHeight?: number;
    scaledSize?: SizeValue;
    scaledWidth?: number;
    size?: SizeValue;
    url: string;
    width?: number;
};
type ClusterImageValue = string | ClusterImage;
type ClusterImages = {
    [key: number]: ClusterImageValue;
};

type DefaultRenderOptions = {
    colorRangeBottom?: string | ClusterColor;
    colorRangeTop?: string | ClusterColor;
    /**
     * An object that holds the colors for the clusters. This is used to configure the default renderer for the clusters.
     * Use this instead of the greaterThanAverageColor and lessThanAverageColor options if you want more control over the colors.
     * The key should either be a number and the value should be a string color.
     * If the number of markers in the clsuter is greater or equal to the than the key, the color will be used.
     * The first color should have a key of 0 or 1 to handle clusters with 1 or more markers.
     */
    colors?: ClusterColors;
    labelFontFamily?: string;
    labelFontSize?: string | number;
    centerOpacity?: number;
    middleOpacity?: number;
    outerOpacity?: number;
    showNumber?: boolean;
};
type ImageRendererOptions = {
    /**
     * An object that holds the images for the clusters. This is used to configure the image renderer for the clusters.
     * The key should either be a number and the value should be an object containing the image URL, the width, and height of the image.
     * If the number of markers in the clsuter is greater or equal to the than the key, the image will be used.
     * The first image should have a key of 0 or 1 to handle clusters with 1 or more markers.
     */
    images?: ClusterImages;
    image?: ClusterImageValue;
    labelClassName?: string;
    labelColor?: string;
    labelFontFamily?: string;
    labelFontSize?: string | number;
    labelFontWeight?: string;
    showNumber?: boolean;
};
type MarkerClusterOptions = {
    /**
     * A simple string to set the algorithm. Default is "supercluster" for SuperClusterAlgorithm.
     * This is an alternate way to set the algorithm if you don't want to use the algorithmClass.
     * You can still set algorithmOptions if you use this method.
     */
    algorithm?: 'grid' | 'supercluster' | 'noop';
    /**
     * An algorithm to cluster markers. This determines how many markers are clustered together.
     * Default is SuperClusterAlgorithm. Must provide a `calculate` method accepting AlgorithmInput and returning
     * an array of Cluster.
     *
     * https://googlemaps.github.io/js-markerclusterer/classes/GridAlgorithm.html
     */
    algorithmClass?: Algorithm;
    /**
     * The options for the different algorithms.
     * You can set them in this object, or you can set the individual options with the radius and maxZoom options.
     * - radius
     * - maxZoom
     * - minPoints
     *
     * https://googlemaps.github.io/js-markerclusterer/interfaces/AlgorithmOptions.html
     * https://googlemaps.github.io/js-markerclusterer/interfaces/GridOptions.html
     * https://www.npmjs.com/package/supercluster - This is what the SueprClusterAlgorithm uses
     */
    algorithmOptions?: SuperClusterOptions;
    /**
     * The options for the default renderer.
     */
    defaultRenderOptions?: DefaultRenderOptions;
    /**
     * The options for the image renderer.
     */
    imageRendererOptions?: ImageRendererOptions;
    /**
     * The callback function for when a cluster is clicked.
     * The function will be passed the event, the cluster, and the map.
     */
    onClusterClick?: onClusterClickHandler;
    maxZoom?: number;
    minPoints?: number;
    radius?: number;
    /**
     * An object that converts a cluster into a `google.maps.Marker`.
     * Default is DefaultRenderer.
     * It must provide a `render` method accepting Cluster, ClusterStatus, and `google.maps.Map` and returning a `google.maps.Marker`.
     *
     * https://github.com/googlemaps/js-markerclusterer/blob/main/src/renderer.ts
     * https://googlemaps.github.io/js-markerclusterer/classes/DefaultRenderer.html
     */
    renderer?: Renderer;
};
/**
 * The MarkerCluster class to handle clusting of markers on a map
 */
declare class MarkerCluster extends Base {
    #private;
    /**
     * The constructor for the MarkerCluster class
     *
     * @param {Map} map The map object
     * @param {Marker[]|MarkerClusterOptions} [markers] Markers to cluster. You can also use addMarker() instead of adding the markers here.
     * @param {MarkerClusterOptions} [options] Options for the marker clusterer
     */
    constructor(map: Map, markers?: Marker[] | MarkerClusterOptions, options?: MarkerClusterOptions);
    /**
     * Adds a marker to the cluster
     *
     * @param {Marker} marker The marker to add to the cluster
     * @param {boolean} draw Whether to redraw the clusters after adding the marker.
     *      Default is true. Note, this is opposite of the MarkerClusterer library.
     * @returns {MarkerCluster}
     */
    addMarker(marker: Marker, draw?: boolean): MarkerCluster;
    /**
     * Add multiple markers to the cluster
     *
     * @param {Marker[]} markers The array of markers to add
     * @param {boolean} draw Whether to redraw the clusters after adding the marker.
     *      Default is true. Note, this is opposite of the MarkerClusterer library.
     * @returns {MarkerCluster}
     */
    addMarkers(markers: Marker[], draw?: boolean): MarkerCluster;
    /**
     * Clears all of the markers
     *
     * @param {boolean} draw Whether to redraw the clusters after removing all the markers.
     *      Default is true. Note, this is opposite of the MarkerClusterer library.
     * @returns {MarkerCluster}
     */
    clearMarkers(draw?: boolean): MarkerCluster;
    /**
     * Removes a single marker from the cluster.
     *
     * @param {Marker} marker The marker to remove
     * @param {boolean} draw Whether to redraw the clusters after removing the marker.
     *      Default is true. Note, this is opposite of the MarkerClusterer library.
     * @returns {MarkerCluster}
     */
    removeMarker(marker: Marker, draw?: boolean): MarkerCluster;
    /**
     * Force a recalculation and redraw of all the marker clusters.
     *
     * @returns {MarkerCluster}
     */
    render(): MarkerCluster;
}
/**
 * Helper function to set up the marker cluster object
 *
 * @param {Map} map The map object
 * @param {Marker[]|MarkerClusterOptions} [markers] Markers to cluster. You can also use addMarker() instead of adding the markers here.
 *      Alternately, you can pass the cluster options here.
 * @param {MarkerClusterOptions} [options] Options for the marker clusterer
 * @returns {MarkerCluster}
 */
declare const markerCluster: (map: Map, markers?: MarkerClusterOptions | Marker[], options?: MarkerClusterOptions) => MarkerCluster;

type MarkersByTag = {
    [key: string]: Set<Marker>;
};
/**
 * The collection of markers that enable doing bulk actions on markers.
 * Some of the bulk actions can be filtered by the marker tag.
 */
declare class MarkerCollection {
    #private;
    /**
     * Holds the Marker objects by tag
     */
    markers: MarkersByTag;
    /**
     * Adds an Marker to the collection
     *
     * @param {Marker} marker The Marker object to add
     * @param {string|string[]} [tag] The tag(s) to assign the marker to. Either a single tag or an array of tags can be passed.
     */
    add(marker: Marker, tag?: string | string[]): void;
    /**
     * Clears the collection
     *
     * This also hides all the markers in the collection.
     */
    clear(): void;
    /**
     * Clone the collection
     *
     * @returns {MarkerCollection}
     */
    clone(): MarkerCollection;
    /**
     * Returns true if the collection has any markers
     *
     * @returns {boolean}
     */
    hasData(): boolean;
    /**
     * Hide the Markers in the collection that have the tag(s) passed
     *
     * @param {string|string[]} tag The tag(s) to hide markers for. Either a single tag string or an array of tag strings can be passed.
     */
    hide(tag: string | string[]): void;
    /**
     * Hides all the Markers in the collection
     */
    hideAll(): void;
    /**
     * Returns true if the collection has no markers
     *
     * @returns {boolean}
     */
    isEmpty(): boolean;
    /**
     * Remove the marker from the collection, optionally by tag.
     *
     * @param {Marker} marker The marker object to remove
     * @param {string|string[]} [tag] The tag(s) to remove the marker from. If not set then the marker is removed from all tags.
     *      Either a single tag string or an array of tag strings can be passed.
     */
    remove(marker: Marker, tag?: string | string[]): void;
    /**
     * Show the Markers in the collection that have the tag(s) passed
     *
     * @param {string|string[]} tag The tag(s) to show markers for. Either a single tag string or an array of tag strings can be passed.
     * @param {Map} [map] The map object
     */
    show(tag: string | string[], map: Map): void;
    /**
     * Show all the Markers in the collection
     *
     * @param {Map} map The map object
     */
    showAll(map: Map): void;
}
/**
 * Helper function to set up the marker collection object
 *
 * @returns {MarkerCollection}
 */
declare const markerCollection: () => MarkerCollection;

type PlacesSearchBoxOptions = {
    bounds?: LatLngBoundsValue;
    input: HTMLInputElement;
};
type PlacesSearchBoxEvent = 'places_changed';
type PlacesSearchBoxEventObject = Event & {
    places: google.maps.places.PlaceResult[];
    bounds: LatLngBounds;
};
type PlacesSearchBoxEventCallback = (event: PlacesSearchBoxEventObject) => void;
/**
 * The PlacesSearchBox class
 */
declare class PlacesSearchBox extends Evented {
    #private;
    /**
     * Constructor
     *
     * @param {string | HTMLInputElement | PlacesSearchBoxOptions} input The input reference or the options
     * @param {PlacesSearchBoxOptions} [options] The places search box options if the input is reference to the input element
     */
    constructor(input: string | HTMLInputElement | PlacesSearchBoxOptions, options?: PlacesSearchBoxOptions);
    /**
     * Get the bounds to which query predictions are biased.
     *
     * @returns {LatLngBounds | undefined}
     */
    get bounds(): LatLngBounds | undefined;
    /**
     * Sets the region to use for biasing query predictions.
     *
     * Results will only be biased towards this area and not be completely restricted to it.
     *
     * @param {LatLngBoundsValue} value The bounds to set
     */
    set bounds(value: LatLngBoundsValue);
    /**
     * Get the input reference
     *
     * @returns {HTMLInputElement | undefined}
     */
    get input(): HTMLInputElement | undefined;
    /**
     * Set the input reference
     *
     * @param {string | HTMLInputElement} value The input HTMLInputElement or the selector for the input element
     */
    set input(value: string | HTMLInputElement);
    /**
     * Get the bounds to which query predictions are biased.
     *
     * @returns {LatLngBounds | undefined}
     */
    getBounds(): LatLngBounds | undefined;
    /**
     * Gets the first place that has been found
     *
     * The results from the places_changed event is typically one place and it's the place that the user clicked on.
     *
     * @returns {google.maps.places.PlaceResult | undefined}
     */
    getPlace(): google.maps.places.PlaceResult | undefined;
    /**
     * Get the places that have been found
     *
     * This is typically one place and it's the place that the user clicked on.
     *
     * @returns {google.maps.places.PlaceResult[]}
     */
    getPlaces(): google.maps.places.PlaceResult[];
    /**
     * Get the map bounds based on the places that have been found.
     *
     * @returns {LatLngBounds|undefined}
     */
    getPlacesBounds(): LatLngBounds | undefined;
    /**
     * Initialize the places search box object
     *
     * This must be called in order for the places search box to work.
     *
     * @returns {Promise<void>}
     */
    init(): Promise<void>;
    /**
     * Returns whether the places search box object has been initialized
     *
     * @returns {boolean}
     */
    isInitialized(): boolean;
    /**
     * @inheritdoc
     */
    hasListener(type: PlacesSearchBoxEvent, callback?: PlacesSearchBoxEventCallback): boolean;
    /**
     * @inheritdoc
     */
    off(type?: PlacesSearchBoxEvent, callback?: PlacesSearchBoxEventCallback, options?: EventListenerOptions): void;
    /**
     * @inheritdoc
     */
    on(type: PlacesSearchBoxEvent, callback: PlacesSearchBoxEventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onImmediate(type: PlacesSearchBoxEvent, callback: PlacesSearchBoxEventCallback, config?: EventConfig): void;
    /**
     * Listen for the place changed event
     *
     * @example
     * placesSearchBox.onPlacesChanged((places, bounds) => {
     *    console.log('Places: ', places);
     *   console.log('Bounds: ', bounds);
     * });
     * @param {(place: google.maps.places.PlaceResult, bounds: LatLngBounds) => void} callback The callback function
     * @returns {void}
     */
    onPlacesChanged(callback: (places: google.maps.places.PlaceResult[], bounds: LatLngBounds) => void): void;
    /**
     * @inheritdoc
     */
    once(type: PlacesSearchBoxEvent, callback?: PlacesSearchBoxEventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onceImmediate(type: PlacesSearchBoxEvent, callback?: PlacesSearchBoxEventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    only(type: PlacesSearchBoxEvent, callback: PlacesSearchBoxEventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onlyOnce(type: PlacesSearchBoxEvent, callback: PlacesSearchBoxEventCallback, config?: EventConfig): void;
    /**
     * Sets the region to use for biasing query predictions.
     *
     * Results will only be biased towards this area and not be completely restricted to it.
     *
     * @param {LatLngBoundsValue} value The bounds to set
     * @returns {PlacesSearchBox}
     */
    setBounds(value: LatLngBoundsValue): PlacesSearchBox;
    /**
     * Set the input reference
     *
     * @param {string|HTMLInputElement} input The input HTMLInputElement or the selector for the input element
     * @returns {PlacesSearchBox}
     */
    setInput(input: string | HTMLInputElement): PlacesSearchBox;
    /**
     * Set the places search box options
     *
     * @param {PlacesSearchBoxOptions} options The options to set
     * @returns {PlacesSearchBox}
     */
    setOptions(options: PlacesSearchBoxOptions): PlacesSearchBox;
}
type PlacesSearchBoxValue = HTMLInputElement | string | PlacesSearchBox | PlacesSearchBoxOptions;
/**
 * Helper function to set up the places search box object
 *
 * @param {PlacesSearchBoxValue} [input] The input reference or the options
 * @param {PlacesSearchBoxOptions} [options] The places search box options
 * @returns {PlacesSearchBox}
 */
declare const placesSearchBox: (input?: PlacesSearchBoxValue, options?: PlacesSearchBoxOptions) => PlacesSearchBox;

type PolylineIconOptions = {
    fixedRotation?: boolean;
    icon?: SvgSymbolValue;
    offset?: string;
    repeat?: string;
};
declare class PolylineIcon extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {PolylineIconOptions} [options] The polyline icon options
     */
    constructor(options?: PolylineIconOptions);
    /**
     * Get the fixed rotation setting for the icon
     *
     * @returns {boolean} True if the icon has a fixed rotation, false otherwise
     */
    get fixedRotation(): boolean;
    /**
     * Set the fixed rotation setting for the icon
     *
     * @param {boolean} fixedRotation If true, each icon in the sequence has the same fixed rotation
     *      regardless of the angle of the edge on which it lies. If false, case each icon in the
     *      sequence is rotated to align with its edge.
     */
    set fixedRotation(fixedRotation: boolean);
    /**
     * Get the icon value
     *
     * @returns {SvgSymbol|undefined} The icon value or undefined if not set
     */
    get icon(): SvgSymbol | undefined;
    /**
     * Set the icon value
     *
     * @param {SvgSymbolValue} icon The icon value to set. It can be a string, an object, or an instance of SvgSymbol.
     * @see {@link SvgSymbol} for more details on the icon value
     */
    set icon(icon: SvgSymbolValue);
    /**
     * Get the offset value
     *
     * @returns {string|undefined} The offset value or undefined if not set
     */
    get offset(): string | undefined;
    /**
     * Set the distance from the start of the line at which an icon is to be rendered.
     *
     * @param {number|string} value The distance from the start of the line at which an icon is to be rendered.
     *      is distance may be expressed as a percentage of line's length (e.g. '50%') or in pixels (e.g. '50px').
     */
    set offset(value: number | string);
    /**
     * Get the repeat value
     *
     * @returns {string|undefined} The repeat value or undefined if not set
     */
    get repeat(): string | undefined;
    /**
     * Set the repeat value. This sets the distance between consecutive icons along the polyline.
     * The repeat value can be expressed in pixels (e.g. '20px') or as a percentage of the polyline's length (e.g. '10%').
     * If the value is a number, it is treated as pixels (e.g. 20 becomes '20px').
     * To disable repeating icons, set the repeat value to 0, '0px' or '0%'.
     *
     * @param {number|string} value The repeat value. It can be a number, a number string, or a string with 'px' or '%' suffix.
     */
    set repeat(value: number | string);
    /**
     * Set the fixed rotation value
     *
     * @param {boolean} fixedRotation If true, each icon in the sequence has the same fixed rotation
     *      regardless of the angle of the edge on which it lies. If false, case each icon in the
     *      sequence is rotated to align with its edge.
     * @returns {PolylineIcon}
     */
    setFixedRotation(fixedRotation: boolean): PolylineIcon;
    /**
     * Set the icon value
     *
     * @param {SvgSymbolValue} icon The icon value to set. It can be a string, an object, or an instance of SvgSymbol.
     * @returns {PolylineIcon} The PolylineIcon instance for method chaining
     */
    setIcon(icon: SvgSymbolValue): PolylineIcon;
    /**
     * Set the distance from the start of the line at which an icon is to be rendered.
     *
     * @param {number|string} value The distance from the start of the line at which an icon is to be rendered.
     *      This distance may be expressed as a percentage of line's length (e.g. '50%') or in pixels (e.g. '50px').
     * @returns {PolylineIcon} The PolylineIcon instance for method chaining
     */
    setOffset(value: number | string): PolylineIcon;
    /**
     * Set the repeat value. This sets the distance between consecutive icons along the polyline.
     * The repeat value can be expressed in pixels (e.g. '20px') or as a percentage of the polyline's length (e.g. '10%').
     * If the value is a number, it is treated as pixels (e.g. 20 becomes '20px').
     * To disable repeating icons, set the repeat value to 0, '0px' or '0%'.
     *
     * @param {number|string} value The repeat value. It can be a number, a number string, or a string with 'px' or '%' suffix.
     * @returns {PolylineIcon} The PolylineIcon instance for method chaining
     */
    setRepeat(value: number | string): PolylineIcon;
    /**
     * Set the icon options
     *
     * @param {PolylineIconOptions} options The polyline icon options
     * @returns {PolylineIcon}
     */
    setOptions(options: PolylineIconOptions): PolylineIcon;
    /**
     * Get the polyline icon options
     *
     * @returns {Promise<google.maps.IconSequence>}
     */
    toGoogle(): Promise<google.maps.IconSequence>;
}
type PolylineIconValue = PolylineIcon | PolylineIconOptions;
/**
 * Helper function to set up the polyline icon object
 *
 * @param {PolylineIconValue} options The polyline icon options or the icon object
 * @returns {PolylineIcon} A PolylineIcon instance
 */
declare const polylineIcon: (options: PolylineIconValue) => PolylineIcon;

type PolylineEvent = 'click' | 'contextmenu' | 'dblclick' | 'drag' | 'dragend' | 'dragstart' | 'mousedown' | 'mousemove' | 'mouseout' | 'mouseover' | 'mouseup';
type CustomData = {
    [key: string]: any;
};
type PolylineOptions = {
    clickable?: boolean;
    data?: CustomData;
    dashed?: boolean;
    dashGap?: string | number;
    highlightPolyline?: PolylineOptions | Polyline;
    icons?: PolylineIcon[];
    map?: Map;
    path?: LatLngValue[];
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
    tooltip?: TooltipValue;
    visible?: boolean;
    zIndex?: number;
};
/**
 * Polyline class
 */
declare class Polyline extends Layer {
    #private;
    /**
     * Constructor
     *
     * @param {PolylineOptions} [options] The polyline options
     */
    constructor(options?: PolylineOptions);
    /**
     * Get whether the polyline handles click events.
     *
     * @returns {boolean}
     */
    get clickable(): boolean;
    /**
     * Set whether the polyline handles click events.
     *
     * @param {boolean} value Whether the polyline handles click events.
     */
    set clickable(value: boolean);
    /**
     * Get whether the polyline is drawn as a dashed line.
     *
     * @returns {boolean}
     */
    get dashed(): boolean;
    /**
     * Set whether the polyline is drawn as a dashed line.
     *
     * @param {boolean} value Whether the polyline is drawn as a dashed line.
     */
    set dashed(value: boolean);
    /**
     * Get the gap between the dashes in pixels or percentage.
     *
     * @returns {string}
     */
    get dashGap(): string;
    /**
     * Set the gap between the dashes in pixels or percentage.
     *
     * If a number is set them it will be converted to a string with "px" appended.
     *
     * @param {string|number} value The gap between the dashes in pixels.
     */
    set dashGap(value: string | number);
    /**
     * Get the custom data attached to the polyline object
     *
     * @returns {CustomData}
     */
    get data(): CustomData;
    /**
     * Set custom data to attach to the polyline object
     *
     * @param {CustomData} value The custom data to attach to the polyline object
     */
    set data(value: CustomData);
    /**
     * Get the highlight polyline
     *
     * @returns {Polyline}
     */
    get highlightPolyline(): Polyline;
    /**
     * Set the highlight polyline
     *
     * The highlight polyline is a polyline that is shown below the existing polyline to create a "highlight" effect.
     * This is useful when you want to show a highlight effect when the mouse hovers over the polyline.
     *
     * @param {PolylineOptions|Polyline} value The highlight polyline options or the highlight polyline class.
     */
    set highlightPolyline(value: PolylineOptions | Polyline);
    /**
     * Get the icons for the polyline
     *
     * @returns {PolylineIcon[]}
     */
    get icons(): PolylineIcon[];
    /**
     * Set the icons for the polyline
     *
     * You can pass a single icon value or an array of icon values.
     * Each icon value can be an object containing the icon options or a SvgSymbol object.
     *
     * @param {PolylineIconValue|PolylineIconValue[]} value The icon value or an array of icon values.
     */
    set icons(value: PolylineIconValue | PolylineIconValue[]);
    /**
     * Get the map object
     *
     * @returns {Map}
     */
    get map(): Map;
    /**
     * Set the map object
     *
     * @param {Map|null} value The map object. Set to null if you want to remove the polyline from the map.
     */
    set map(value: Map | null);
    /**
     * Get the path of the polyline.
     *
     * The path is an array of LatLng values defining the path of the polyline.
     *
     * @returns {LatLngValue[]}
     */
    get path(): LatLngValue[];
    /**
     * Set the path of the polyline.
     * The path is an array of LatLng values defining the path of the polyline.
     * You can pass an array of LatLng objects or an array of LatLngLiteral objects.
     *
     * @param {LatLngValue[]} value The path of the polyline.
     */
    set path(value: LatLngValue[]);
    /**
     * Get the SVG stroke color
     *
     * @returns {string}
     */
    get strokeColor(): string;
    /**
     * Set the SVG stroke color.
     *
     * @param {string} value The SVG stroke color.
     */
    set strokeColor(value: string);
    /**
     * Get the opacity of the stroke.
     * The opacity of the stroke, where 0 is fully transparent and 1 is fully opaque.
     *
     * @returns {number}
     */
    get strokeOpacity(): number;
    /**
     * Set the opacity of the stroke.
     *
     * @param {number|string} value The opacity of the stroke.
     */
    set strokeOpacity(value: number | string);
    /**
     * Get the weight of the stroke in pixels.
     *
     * @returns {number}
     */
    get strokeWeight(): number;
    /**
     * Set the weight of the stroke.
     *
     * @param {number|string} value The weight of the stroke.
     */
    set strokeWeight(value: number | string);
    /**
     * Get whether the polyline is visible on the map.
     *
     * @returns {boolean}
     */
    get visible(): boolean;
    /**
     * Set whether the polyline is visible on the map.
     *
     * @param {boolean} value Whether the polyline is visible on the map.
     */
    set visible(value: boolean);
    /**
     * Get the zIndex of the polyline.
     *
     * @returns {number}
     */
    get zIndex(): number;
    /**
     * Set the zIndex of the polyline.
     *
     * @param {number|string} value The zIndex of the polyline.
     */
    set zIndex(value: number | string);
    /**
     * Clones the polyline
     *
     * @returns {Polyline}
     */
    clone(): Polyline;
    /**
     * Get any custom data attached to the marker object.
     *
     * Optionally pass a data key to get the value for that key.
     *
     * @param {string} [key] The object key to get data for. If not set then all data is returned.
     * @returns {any}
     */
    getData(key?: string): CustomData;
    /**
     * Returns whether the polyline has a zIndex set.
     *
     * @returns {boolean}
     */
    hasZIndex(): boolean;
    /**
     * Hide the polyline
     *
     * @returns {Polyline}
     */
    hide(): Polyline;
    /**
     * Display the highlight polyline if it exists
     *
     * You can override the current highlight options by passing in the options parameter.
     * This allows you to override one or more of the following options:
     * - clickable
     * - dashed
     * - dashGap
     * - icons
     * - strokeColor
     * - strokeOpacity
     * - strokeWeight
     * - zIndex
     *
     * When the polyline is unhighlighted, the original options will be restored.
     *
     * @param {PolylineOptions} [options] The polyline options to override the existing highlight polyline options.
     * @returns {Polyline}
     */
    highlight(options?: PolylineOptions): Polyline;
    /**
     * Initialize the polyline
     *
     * This is used when another element (like a tooltip) needs to be attached to the polyline,
     * but needs to make sure that the polyline exists first.
     *
     * This is not intended to be called outside of this library.
     *
     * @internal
     * @returns {Promise<void>}
     */
    init(): Promise<void>;
    /**
     * @inheritdoc
     */
    hasListener(type: PolylineEvent, callback?: EventCallback): boolean;
    /**
     * @inheritdoc
     */
    off(type?: PolylineEvent, callback?: EventCallback, options?: EventListenerOptions): void;
    /**
     * @inheritdoc
     */
    on(type: PolylineEvent, callback: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onImmediate(type: PolylineEvent, callback: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    once(type: PolylineEvent, callback?: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onceImmediate(type: PolylineEvent, callback?: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    only(type: PolylineEvent, callback: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onlyOnce(type: PolylineEvent, callback: EventCallback, config?: EventConfig): void;
    /**
     * Sets the polyline to be drawn as a dashed line
     *
     * @param {boolean} dashed Whether the polyline is drawn as a dashed line
     * @param {string|number} [dashGap] The gap between the dashes in pixels or percentage.
     * @returns {Polyline} The polyline object
     */
    setDashed(dashed: boolean, dashGap?: string | number): Polyline;
    /**
     * Set the gap between the dashes in pixels.
     *
     * @param {string|number} gap The gap between the dashes in pixels or percentage. This is only used if the polyline is drawn as a dashed line.
     * @returns {Polyline} The polyline object
     */
    setDashGap(gap: string | number): Polyline;
    /**
     * Set the highlight polyline
     *
     * The highlight polyline is a polyline that is shown below the existing polyline to create a "highlight" effect.
     * This is useful when you want to show a highlight effect when the mouse hovers over the polyline.
     *
     * @param {PolylineOptions|Polyline} value The highlight polyline options or the highlight polyline class.
     * @returns {Polyline}
     */
    setHighlightPolyline(value: PolylineOptions | Polyline): Polyline;
    /**
     * Set the icons for the polyline
     *
     * You can pass a single icon value or an array of icon values.
     * Each icon value can be an object containing the icon options or a SvgSymbol object.
     *
     * @param {PolylineIconValue|PolylineIconValue[]} value The icon value or an array of icon values.
     * @returns {Polyline} The polyline object
     */
    setIcons(value: PolylineIconValue | PolylineIconValue[]): Polyline;
    /**
     * Adds the polyline to the map object
     *
     * Alternate of show()
     *
     * @param {Map} value The map object. Set to null if you want to remove the polyline from the map.
     * @param {boolean} [isVisible] Whether the polyline as visible on the map.
     * @returns {Promise<Polyline>}
     */
    setMap(value: Map | null, isVisible?: boolean): Promise<Polyline>;
    /**
     * Set the Polyline options
     *
     * @param {PolylineOptions} options The Polyline options
     * @returns {Polyline}
     */
    setOptions(options: PolylineOptions): Polyline;
    /**
     * Se the path of the polyline.
     *
     * @param {LatLngValue[]} path The path of the polyline.
     * @returns {Polyline}
     */
    setPath(path: LatLngValue[]): Polyline;
    /**
     * Set the SVG stroke color.
     *
     * @param {string} strokeColor The SVG stroke color.
     * @returns {Polyline}
     */
    setStrokeColor(strokeColor: string): Polyline;
    /**
     * Set the opacity of the stroke.
     *
     * @param {number|string} strokeOpacity The opacity of the stroke.
     * @returns {Polyline}
     */
    setStrokeOpacity(strokeOpacity: number | string): Polyline;
    /**
     * Set the weight of the stroke.
     *
     * @param {number|string} strokeWeight The weight of the stroke.
     * @returns {Polyline}
     */
    setStrokeWeight(strokeWeight: number | string): Polyline;
    /**
     * Set whether the polyline is visible on the map.
     *
     * @param {boolean} visible Whether the polyline is visible on the map.
     * @returns {Polyline}
     */
    setVisible(visible: boolean): Polyline;
    /**
     * Show the polyline on the map
     *
     * This will also set the map object if it's passed
     *
     * @param {Map} [map] The map object. Don't need to pass this if the map is already set on the polyline.
     * @returns {Promise<Polyline>}
     */
    show(map?: Map): Promise<Polyline>;
    /**
     * Get the Google maps Polyline object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/info-window#Polyline
     *
     * @returns {Promise<google.maps.Polyline>}
     */
    toGoogle(): Promise<google.maps.Polyline>;
    /**
     * Hide the highlight polyline if it exists
     *
     * @returns {Polyline}
     */
    unhighlight(): Polyline;
}
type PolylineValue = Polyline | PolylineOptions;
/**
 * Helper function to set up the polyline object
 *
 * @param {PolylineValue} [options] The polyline options or the polyline class
 * @returns {Polyline}
 */
declare const polyline: (options?: PolylineValue) => Polyline;

type PolylinesByTag = {
    [key: string]: Set<Polyline>;
};
/**
 * The collection of polylines that enable doing bulk actions on polylines.
 * Some of the bulk actions can be filtered by the polyline tag.
 */
declare class PolylineCollection {
    #private;
    /**
     * Holds the Polyline objects by tag
     */
    polylines: PolylinesByTag;
    /**
     * Adds an Polyline to the collection
     *
     * @param {Polyline} p The Polyline object to add
     * @param {string|string[]} [tag] The tag(s) to assign the polyline to. Either a single tag or an array of tags can be passed.
     */
    add(p: Polyline, tag?: string | string[]): void;
    /**
     * Clears the collection
     *
     * This also hides all the polylines in the collection.
     */
    clear(): void;
    /**
     * Clones the collection
     *
     * @returns {PolylineCollection}
     */
    clone(): PolylineCollection;
    /**
     * Returns true if the collection has any polylines
     *
     * @returns {boolean}
     */
    hasData(): boolean;
    /**
     * Hide the Polylines in the collection that have the tag(s) passed
     *
     * @param {string|string[]} tag The tag(s) to hide polylines for. Either a single tag string or an array of tag strings can be passed.
     */
    hide(tag: string | string[]): void;
    /**
     * Hides all the Polylines in the collection
     */
    hideAll(): void;
    /**
     * Highlight the Polylines in the collection that have the tag(s) passed
     *
     * You can override the current highlight options by passing in the highlightOptions parameter.
     * This allows you to override one or more of the following options:
     * - clickable
     * - dashed
     * - dashGap
     * - icons
     * - strokeColor
     * - strokeOpacity
     * - strokeWeight
     * - zIndex
     *
     * When the polyline is unhighlighted, the original options will be restored.
     *
     * @param {string|string[]} tag The tag(s) to highlight polylines for. Either a single tag string or an array of tag strings can be passed.
     * @param {PolylineOptions} [highlightOptions] The options to use for highlighting the polylines. This will override the current options for the highlight polyline.
     */
    highlight(tag: string | string[], highlightOptions?: PolylineOptions): void;
    /**
     * Highlight all the Polylines in the collection
     */
    highlightAll(): void;
    /**
     * Returns true if the collection has no polylines
     *
     * @returns {boolean}
     */
    isEmtpy(): boolean;
    /**
     * Remove the polyline from the collection, optionally by tag.
     *
     * @param {Polyline} p The polyline object to remove
     * @param {string|string[]} [tag] The tag(s) to remove the polyline from. If not set then the polyline is removed from all tags.
     *      Either a single tag string or an array of tag strings can be passed.
     */
    remove(p: Polyline, tag?: string | string[]): void;
    /**
     * Set options for either all polylines in the collection or for the polylines that have the tag(s) passed.
     *
     * @param {PolylineOptions} options The options to set for the polylines.
     * @param {string|string[]} [tag] The tag(s) to show polylines for. Either a single tag string or an array of tag strings can be passed.
     */
    setOptions(options: PolylineOptions, tag?: string | string[]): void;
    /**
     * Show the Polylines in the collection that have the tag(s) passed
     *
     * @param {string|string[]} tag The tag(s) to show polylines for. Either a single tag string or an array of tag strings can be passed.
     * @param {Map} [map] The map object
     */
    show(tag: string | string[], map: Map): void;
    /**
     * Show all the Polylines in the collection
     *
     * @param {Map} [map] The map object
     */
    showAll(map: Map): void;
    /**
     * Hide the hightlight for the Polylines in the collection that have the tag(s) passed
     *
     * @param {string|string[]} tag The tag(s) to hide the highlighted polylines. Either a single tag string or an array of tag strings can be passed.
     */
    unhighlight(tag: string | string[]): void;
    /**
     * Hide the hightlight for all the Polylines in the collection
     */
    unhighlightAll(): void;
}
/**
 * Helper function to set up the polyline collection object
 *
 * @returns {PolylineCollection}
 */
declare const polylineCollection: () => PolylineCollection;

type PopupOptions = {
    autoClose?: boolean;
    center?: boolean;
    className?: string;
    clearance?: SizeValue;
    closeElement?: HTMLElement | string;
    content: string | HTMLElement | Text;
    event?: string;
    fit?: boolean;
    offset?: PointValue;
    styles?: object;
    theme?: string;
};
/**
 * Popup class
 */
declare class Popup extends Overlay {
    #private;
    /**
     * Constructor
     *
     * @param {PopupOptions | string | HTMLElement | Text} [options] The Popup options or content
     */
    constructor(options: PopupOptions | string | HTMLElement | Text);
    /**
     * Get the autoClose value
     *
     * @returns {boolean}
     */
    get autoClose(): boolean;
    /**
     * Set the autoClose value
     *
     * @param {boolean} autoClose Whether to automatically hide other open popups when opening this one
     */
    set autoClose(autoClose: boolean);
    /**
     * Returns whether to center the popup horizontally on the element.
     *
     * @returns {boolean}
     */
    get center(): boolean;
    /**
     * Set whether to center the popup horizontally on the element. Useful if the popup is on a marker.
     *
     * @param {boolean} center Whether to center the popup on the element
     */
    set center(center: boolean);
    /**
     * Returns the amount of space between the popup and the map viewport edge.
     * This is used when the map is panned to bring the popup into view.
     *
     * @returns {Size}
     */
    get clearance(): Size;
    /**
     * Set the amount of space between the popup and the map viewport edge
     * This is used when the map is panned to bring the popup into view.
     *
     * @param {SizeValue} clearance The amount of space between the popup and the map viewport edge
     */
    set clearance(clearance: SizeValue);
    /**
     * Returns the element to close the popup. This can be a CSS selector or an HTMLElement.
     *
     * @returns {HTMLElement|string}
     */
    get closeElement(): HTMLElement | string;
    /**
     * Set the element to close the popup. This can be a CSS selector or an HTMLElement.
     *
     * @param {HTMLElement|string} closeElement The element to close the popup
     */
    set closeElement(closeElement: HTMLElement | string);
    /**
     * Returns the content for the popup
     *
     * @returns {string|HTMLElement|Text}
     */
    get content(): string | HTMLElement | Text;
    /**
     * Set the content for the popup
     *
     * @param {string|HTMLElement|Text} content The content for the popup
     */
    set content(content: string | HTMLElement | Text);
    /**
     * Returns the event to trigger the popup
     *
     * @returns {string}
     */
    get event(): string;
    /**
     * Set the event to trigger the popup
     *
     * @param {string} event The event to trigger the popup
     */
    set event(event: string);
    /**
     * Returns whether to fit the popup within the map viewport when it's displayed
     *
     * @returns {boolean}
     */
    get fit(): boolean;
    /**
     * Set whether to fit the popup within the map viewport when it's displayed
     *
     * @param {boolean} fit Whether to fit the popup within the map viewport when it's displayed
     */
    set fit(fit: boolean);
    /**
     * Returns the theme to use for the popup
     *
     * @returns {string}
     */
    get theme(): string;
    /**
     * Set the theme to use for the popup
     *
     * @param {string} theme The theme to use for the popup
     */
    set theme(theme: string);
    /**
     * Attach the popup to a element
     *
     * By default the popup will be shown when the element is clicked on.
     *
     * @param {Map | Layer} element The element to attach the popup to
     * @param {'click'|'clickon'|'hover'} [event] The event to trigger the popup. Defaults to 'click'
     *   - 'click' - Toggle the display of the popup when clicking on the element
     *   - 'clickon' - Show the popup when clicking on the element. It will always be shown and can't be hidden once the element is clicked.
     *   - 'hover' - Show the popup when hovering over the element. Hide the popup when the element is no longer hovered.
     * @returns {Promise<Popup>}
     */
    attachTo(element: Map | Layer, event?: 'click' | 'clickon' | 'hover'): Promise<Popup>;
    /**
     * Hide the popup
     *
     * Alias to hide()
     *
     * @returns {Popup}
     */
    close(): Popup;
    /**
     * Returns whether the popup already has content
     *
     * @returns {boolean}
     */
    hasContent(): boolean;
    /**
     * Hide the popup
     *
     * @returns {Popup}
     */
    hide(): Popup;
    /**
     * Returns whether the popup is open or not
     *
     * @returns {boolean}
     */
    isOpen(): boolean;
    /**
     * Open the popup
     *
     * Alias to show()
     *
     * @param {Map | Layer} element The anchor object or map object.
     * @returns {Promise<Popup>}
     */
    open(element: Map | Layer): Promise<Popup>;
    /**
     * Set the element to close the popup. This can be a CSS selector or an HTMLElement.
     * The popup will be hidden when this element is clicked on.
     *
     * @param {HTMLElement|string} element The element to close the popup. This can be a CSS selector or an HTMLElement.
     * @returns {Popup}
     */
    setCloseElement(element: HTMLElement | string): Popup;
    /**
     * Set the Popup content
     *
     * @param {string | HTMLElement | Text} content The Popup content
     * @returns {Popup}
     */
    setContent(content: string | HTMLElement | Text): Popup;
    /**
     * Sets the options for the popup
     *
     * @param {PopupOptions} options Popup options
     * @returns {Popup}
     */
    setOptions(options: PopupOptions): Popup;
    /**
     * Open the popup
     *
     * You need to pass in either an anchor object or a map object.
     * If an anchor object is passed in then the popup will be displayed at the anchor's position.
     * If a map object is passed in then the popup will be displayed at the position of the popup.
     *
     * https://developers.google.com/maps/documentation/javascript/reference/info-window#Popup.open
     *
     * @param {Map | Layer} element The anchor object or map object.
     *      This should ideally be the Map or Marker object and not the Google maps object.
     *      If this is used internally then the Google maps object can be used.
     * @returns {Promise<Popup>}
     */
    show(element: Map | Layer): Promise<Popup>;
    /**
     * Toggle the display of the overlay on the map
     *
     * @param {Map | Layer} element The anchor object or map object.
     */
    toggle(element: Map | Layer): void;
    /**
     * Add the overlay to the element. Called once after setMap() is called on the overlay with a valid map.
     *
     * @internal
     * @param {google.maps.MapPanes} panes The Google maps panes object
     */
    add(panes: google.maps.MapPanes): void;
    /**
     * Draw the overlay. Called when the overlay is being drawn or updated.
     *
     * @internal
     * @param {google.maps.MapCanvasProjection} projection The Google maps projection object
     */
    draw(projection: google.maps.MapCanvasProjection): void;
}
type PopupValue = Popup | PopupOptions | string | HTMLElement | Text;
/**
 * Helper function to set up the Popup class
 *
 * @param {PopupValue} [options] The Popup options
 * @returns {Popup}
 */
declare const popup: (options?: PopupValue) => Popup;
/**
 * Helper function to close all open popups
 *
 * Usage:
 * G.closeAllPopups();
 *
 * @returns {void}
 */
declare const closeAllPopups: () => void;

export { AutocompleteSearchBox, AutocompleteSearchBoxEvents, type AutocompleteSearchBoxOptions, type AutocompleteSearchBoxValue, Base, ControlPosition, type ControlPositionValue, type DefaultRenderOptions, type Event$1 as Event, type EventCallback, type EventConfig, type EventListenerOptions, Evented, FullscreenControl, type FullscreenControlOptions, Geocode, type GeocodeComponentRestrictions, type GeocodeOptions, GeocodeResult, GeocodeResults, GeocoderErrorStatus, type GeocoderErrorStatusValue, GeocoderLocationType, type GeocoderLocationTypeValue, Icon, type IconOptions, type IconValue, type ImageRendererOptions, InfoWindow, type InfoWindowOptions, type InfoWindowValue, LatLng, LatLngBounds, type LatLngBoundsEdges, type LatLngBoundsLiteral, type LatLngBoundsValue, type LatLngLiteral, type LatLngLiteralExpanded, type LatLngValue, Layer, Loader, LoaderEvents, type LoaderOptions, type LocateOptions, type LocationOnSuccess, type LocationPosition, Map, MapEvents, type MapOptions, MapRestriction, type MapRestrictionOptions, MapStyle, type MapStyleOptions, type MapType, MapTypeControl, type MapTypeControlOptions, MapTypeControlStyle, type MapTypeControlStyleValue, MapTypeId, type MapTypeIdValue, Marker, MarkerCluster, type MarkerClusterOptions, MarkerCollection, MarkerEvents, type MarkerLabel, type MarkerOptions, type MarkerValue, Overlay, OverlayEvents, PlacesSearchBox, PlacesSearchBoxEvents, type PlacesSearchBoxOptions, type PlacesSearchBoxValue, Point, type PointObject, type PointValue, Polyline, PolylineCollection, PolylineIcon, type PolylineIconOptions, type PolylineIconValue, type PolylineOptions, type PolylineValue, Popup, PopupEvents, type PopupOptions, type PopupValue, RenderingType, type RenderingTypeValue, RotateControl, type RotateControlOptions, ScaleControl, type ScaleControlOptions, Size, type SizeObject, type SizeValue, StreetViewControl, type StreetViewControlOptions, StreetViewSource, type StreetViewSourceValue, SvgSymbol, type SvgSymbolOptions, type SvgSymbolValue, SymbolPath, type SymbolPathValue, Tooltip, type TooltipOptions, type TooltipValue, ZoomControl, type ZoomControlOptions, autocompleteSearchBox, callCallback, checkForGoogleMaps, closeAllPopups, convertControlPosition, convertMapTypeControlStyle, convertSymbolPath, fullscreenControl, geocode, getBoolean, getNumber, getPixelsFromLatLng, getSizeWithUnit, icon, infoWindow, isBoolean, isDefined, isFunction, isNull, isNullOrUndefined, isNumber, isNumberOrNumberString, isNumberString, isObject, isObjectWithValues, isPromise, isString, isStringOrNumber, isStringWithValue, isUndefined, latLng, latLngBounds, loader, map, mapRestriction, mapStyle, mapTypeControl, marker, markerCluster, markerCollection, objectEquals, objectHasValue, overlay, placesSearchBox, point, polyline, polylineCollection, polylineIcon, popup, rotateControl, scaleControl, size, streetViewControl, svgSymbol, tooltip, zoomControl };
