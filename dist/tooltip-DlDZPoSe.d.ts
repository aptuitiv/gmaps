import { Libraries } from '@googlemaps/js-api-loader';

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
     * The mixin's own properties are copied onto the class prototype with their descriptors, so
     * that getters and setters arrive as getters and setters. Object.assign() was used here before,
     * which reads the value a getter returns and copies that instead, leaving a static value on the
     * prototype and no accessor - and it did so silently, so a mixin written with a getter appeared
     * to work until the value needed to change.
     *
     * Note that a property holding a mutable value is still shared by every instance, because it
     * lives on the prototype rather than on each object. That is how prototypes work and isn't
     * something this can fix. Assign in a method (this.thing = []) to give each object its own.
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

declare const READY_EVENT = "ready";
/**
 * The events that this library dispatches itself, which the Google Maps API knows nothing about.
 *
 * Evented wires each event type it's asked to listen for through to the Google object, so that a
 * Google event reaches the library's own listeners. Google never fires these types, so that wiring
 * is dead weight: a native listener that can't ever be called, held for as long as the object
 * lives. Every marker, polyline, overlay and data layer that waits for "ready" registered one.
 *
 * Only names that no Google object uses belong here. The overlay drag and resize events are
 * deliberately left out, even though the overlay dispatches them itself, because "drag",
 * "dragstart" and "dragend" are real Google events on Marker and Map and this list can't tell
 * which kind of object it's being asked about. Leaving them out costs a dead listener on overlays;
 * putting them in would stop markers being draggable. The data layer's "load" is left out for the
 * same reason.
 *
 * The type is widened to string[] so that includes() can be called with any event type.
 */
declare const INTERNAL_EVENTS: readonly string[];
/**
 * Events that can be fired by the Autocomplete search box.
 *
 * https://aptuitiv.github.io/gmaps/api-reference/autocomplete-search-box#events
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
 * Events that can be fired by the DataLayer.
 */
declare const DataLayerEvents: Readonly<{
    ADD_FEATURE: "addfeature";
    CLICK: "click";
    CONTEXT_MENU: "contextmenu";
    DBLCLICK: "dblclick";
    MOUSE_DOWN: "mousedown";
    MOUSE_OUT: "mouseout";
    MOUSE_OVER: "mouseover";
    MOUSE_UP: "mouseup";
    REMOVE_FEATURE: "removefeature";
    REMOVE_PROPERTY: "removeproperty";
    RIGHT_CLICK: "rightclick";
    SET_GEOMETRY: "setgeometry";
    SET_PROPERTY: "setproperty";
    READY: "ready";
    LOAD: "load";
}>;
/**
 * The GeoJson geometry types that the data layer supports.
 *
 * https://developers.google.com/maps/documentation/javascript/reference/data#Data.Geometry
 */
declare const GeometryType: Readonly<{
    GEOMETRY_COLLECTION: "GeometryCollection";
    LINE_STRING: "LineString";
    LINEAR_RING: "LinearRing";
    MULTI_LINE_STRING: "MultiLineString";
    MULTI_POINT: "MultiPoint";
    MULTI_POLYGON: "MultiPolygon";
    POINT: "Point";
    POLYGON: "Polygon";
}>;
type GeometryTypeValue = (typeof GeometryType)[keyof typeof GeometryType];
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
 * Events that can be fired by the ImageOverlay.
 */
declare const ImageOverlayEvents: Readonly<{
    ROTATE_START: "rotatestart";
    ROTATE: "rotate";
    ROTATE_END: "rotateend";
}>;
/**
 * Events that can be fired by the InfoWindow.
 */
declare const InfoWindowEvents: Readonly<{
    CLOSE: "close";
    CLOSECLICK: "closeclick";
    CONTENT_CHANGED: "content_changed";
    DOMREADY: "domready";
    HEADER_CONTENT_CHANGED: "headercontent_changed";
    HEADER_DISABLED_CHANGED: "headerdisabled_changed";
    POSITION_CHANGED: "position_changed";
    VISIBLE: "visible";
    ZINDEX_CHANGED: "zindex_changed";
    READY: "ready";
}>;
/**
 * Events that can be fired by the Layer.
 */
declare const LayerEvents: Readonly<{
    READY: "ready";
}>;
/**
 * Events that can be fired by the Loader.
 *
 * https://aptuitiv.github.io/gmaps/api-reference/loader#events
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
    DRAG_START: "dragstart";
    DRAG: "drag";
    DRAGGABLE_CHANGED: "draggable_changed";
    DRAG_END: "dragend";
    OPEN: "open";
    RESIZE_START: "resizestart";
    RESIZE: "resize";
    RESIZE_END: "resizeend";
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
declare const PolylineEvents: Readonly<{
    CLICK: "click";
    CONTEXT_MENU: "contextmenu";
    DBLCLICK: "dblclick";
    DRAG: "drag";
    DRAG_END: "dragend";
    DRAG_START: "dragstart";
    MOUSE_DOWN: "mousedown";
    MOUSE_MOVE: "mousemove";
    MOUSE_OUT: "mouseout";
    MOUSE_OVER: "mouseover";
    MOUSE_UP: "mouseup";
    READY: "ready";
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
     * This throws an error if the latitude/longitude pair is not valid, or if the Google Maps library is not loaded.
     *
     * @returns {google.maps.LatLng}
     */
    toGoogle(): google.maps.LatLng;
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
     * This throws an error if the Google Maps library is not loaded.
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

type Event = {
    domEvent?: MouseEvent | TouchEvent | PointerEvent | KeyboardEvent | Event;
    feature?: any;
    latLng?: LatLng;
    placeId?: string;
    pixel?: Point;
    stop?: () => void;
    type: string;
};
type EventCallback = (event: Event) => void;
type EventConfig = {
    callImmediate?: boolean;
    context?: object;
    once?: boolean;
    only?: boolean;
};
type EventListenerOptions = {
    once?: boolean;
};
type EventListenerData = {
    callback: EventCallback;
    context?: object;
    options: EventListenerOptions;
};
/**
 * Evented class to add syntactic sugar to handling events
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
     * Remove the "once" event listeners that were just called for an event.
     *
     * They're all removed in a single pass. Calling off() for each one would search the whole
     * list of listeners each time, which gets slow when there are a lot of them. For example,
     * every marker that is added before the map is ready waits for the map's "ready" event.
     *
     * Subclasses can override this to remove the listeners from other objects as well.
     * This is not intended to be called outside of this library.
     *
     * @internal
     * @param {string} type The event type
     * @param {EventListenerData[]} listeners The listeners that were called
     */
    removeCalledOnceListeners(type: string, listeners: EventListenerData[]): void;
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
     * Get the north-east corner of the LatLngBounds.
     *
     * If the bounds is empty then this returns undefined. Use isEmpty() to check first.
     *
     * @returns {LatLng|undefined}
     */
    getNorthEast(): LatLng | undefined;
    /**
     * Get the south-west corner of the LatLngBounds.
     *
     * If the bounds is empty then this returns undefined. Use isEmpty() to check first.
     *
     * @returns {LatLng|undefined}
     */
    getSouthWest(): LatLng | undefined;
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
    get latLngBounds(): LatLngBounds | undefined;
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
    stylers?: Style[];
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
    hideBusinesses?: boolean;
    hidePointsOfInterest?: boolean;
    hideTransit?: boolean;
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
    preventPageZoom?: boolean;
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

type ResizeStart = {
    neBounds: LatLng;
    nwPos: {
        x: number;
        y: number;
    };
    swBounds: LatLng;
    sePos: {
        x: number;
        y: number;
    };
    left: number;
    top: number;
    width: number;
    height: number;
};
/**
 * Base class to help with drawing overlays on the map.
 *
 * The methods are purposely left blank so you can override them in your own class.
 * The methods are called from the OverlayView class in the draw(), onAdd(), and onRemove() methods.
 */
declare class Overlay extends Layer {
    #private;
    /**
     * The corner being resized (nw, ne, sw, se)
     *
     * @protected
     * @type {string}
     */
    resizeCorner: string;
    /**
     * The starting bounds when resizing begins
     *
     * @protected
     * @type {object}
     */
    resizeStart?: ResizeStart;
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
     * Returns whether dragging is enabled
     *
     * @returns {boolean}
     */
    get drag(): boolean;
    /**
     * Set whether dragging is enabled
     *
     * @param {boolean} drag Whether dragging is enabled
     */
    set drag(drag: boolean);
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
     * @returns {LatLng|undefined}
     */
    get position(): LatLng | undefined;
    /**
     * Set the position of the overlay
     *
     * @param {LatLngValue|undefined} value The position of the overlay. Pass undefined to clear the position.
     */
    set position(value: LatLngValue | undefined);
    /**
     * Returns whether resizing is enabled
     *
     * @returns {boolean}
     */
    get resize(): boolean;
    /**
     * Set whether resizing is enabled
     *
     * @param {boolean} resize Whether resizing is enabled
     */
    set resize(resize: boolean);
    /**
     * Returns the styles for the overlay element
     *
     * @returns {object}
     */
    get styles(): object;
    /**
     * Set multiple styles for the overlay element
     *
     * @param {object} styles The styles to apply to the overlay element
     */
    set styles(styles: object);
    /**
     * Disable dragging for this overlay
     *
     * @returns {Overlay}
     */
    disableDrag(): Overlay;
    /**
     * Disable resizing for this overlay
     *
     * @returns {Overlay}
     */
    disableResize(): Overlay;
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
     * Enable dragging for this overlay
     *
     * @returns {Overlay}
     */
    enableDrag(): Overlay;
    /**
     * Enable resizing for this overlay
     *
     * @returns {Overlay}
     */
    enableResize(): Overlay;
    /**
     * Get the bounds where the overlay should be displayed
     *
     * This method should be overridden by subclasses and not called directly.
     *
     * @returns {LatLngBounds|undefined}
     */
    getBounds(): LatLngBounds | undefined;
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
     * @returns {LatLng|undefined}
     */
    getPosition(): LatLng | undefined;
    /**
     * Returns the MapCanvasProjection object associated with this OverlayView.
     *
     * The projection is not initialized until onAdd is called by the API.
     * This returns undefined if the Google maps overlay view hasn't been set up yet.
     *
     * https://developers.google.com/maps/documentation/javascript/reference/overlay-view#MapCanvasProjection
     *
     * @returns {google.maps.MapCanvasProjection|undefined}
     */
    getProjection(): google.maps.MapCanvasProjection | undefined;
    /**
     * Get the current aspect ratio for resizing
     *
     * @returns {number}
     */
    getResizeAspectRatio(): number;
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
     * Returns whether the overlay is draggable
     *
     * @returns {boolean}
     */
    isDraggable(): boolean;
    /**
     * Moves the overlay to a new position.
     *
     * If the overlay is not visible, it will be shown.
     * If it's already visible on the map, it will be moved to the new position.
     *
     * @param {LatLngValue|undefined} position The latitude/longitude position of where the overlay should show
     * @param {Map} [map] The Map object
     * @returns {Promise<Overlay>}
     */
    move(position: LatLngValue | undefined, map?: Map): Promise<Overlay>;
    /**
     * Add an event listener for when dragging ends
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDragEnd(callback: EventCallback): void;
    /**
     * Add an event listener for when dragging updates the overlay position
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDrag(callback: EventCallback): void;
    /**
     * Add an event listener for when the overlay draggable property changes
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDraggableChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when dragging the overlay starts
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDragStart(callback: EventCallback): void;
    /**
     * Add an event listener for when the overlay is opened.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onOpen(callback: EventCallback): void;
    /**
     * Add an event listener for when resizing ends
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onResizeEnd(callback: EventCallback): void;
    /**
     * Add an event listener for when resizing updates the overlay position
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onResize(callback: EventCallback): void;
    /**
     * Add an event listener for when resizing the overlay starts
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onResizeStart(callback: EventCallback): void;
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
     * @param {LatLngValue|undefined} position The latitude/longitude position of where the overlay should show.
     *    Pass undefined to clear the position.
     * @returns {Overlay}
     */
    setPosition(position: LatLngValue | undefined): Overlay;
    /**
     * Set the aspect ratio to maintain during resizing
     *
     * @param {number} aspectRatio The aspect ratio (width / height)
     * @returns {Overlay}
     */
    setResizeAspectRatio(aspectRatio: number): Overlay;
    /**
     * Set one more styles for the overlay element. This will merge styles with an existing ones.
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
     * Update bounds from current position
     *
     * @protected
     */
    updateBoundsFromPosition(): void;
    /**
     * Update bounds from resize
     *
     * @protected
     * @param {LatLng} neLatLng The new lat/lng position for the northeast corner
     * @param {LatLng} swLatLng The new lat/lng position for the southwest corner
     */
    setBoundsFromResize(neLatLng: LatLng, swLatLng: LatLng): void;
    /**
     * Update bounds from resize
     *
     * @protected
     * @param {LatLng} newLatLng The new lat/lng position
     */
    updateBoundsFromResize(newLatLng: LatLng): void;
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
    constructor(options?: PopupOptions | string | HTMLElement | Text);
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
     * @returns {HTMLElement|string|undefined}
     */
    get closeElement(): HTMLElement | string | undefined;
    /**
     * Set the element to close the popup. This can be a CSS selector or an HTMLElement.
     *
     * @param {HTMLElement|string} closeElement The element to close the popup
     */
    set closeElement(closeElement: HTMLElement | string);
    /**
     * Returns the content for the popup
     *
     * @returns {string|HTMLElement|Text|undefined}
     */
    get content(): string | HTMLElement | Text | undefined;
    /**
     * Set the content for the popup
     *
     * @param {string|HTMLElement|Text} content The content for the popup
     */
    set content(content: string | HTMLElement | Text);
    /**
     * Get the overlay HTML element, writing any content that is waiting into it first.
     *
     * Everything that uses the element goes through here - add(), draw(), and anything outside
     * the library - so the content is always there by the time it's looked at.
     *
     * @returns {HTMLElement}
     */
    getOverlayElement(): HTMLElement;
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
     * @param {PopupCallback} [callback] A function that is called every time the popup is about to be shown.
     *      It's passed the element that the popup is attached to and returns the content for the popup,
     *      a PopupOptions object, or a Popup object to show instead.
     * @returns {Promise<Popup>}
     */
    attachTo(element: Map | Layer, event?: 'click' | 'clickon' | 'hover', callback?: PopupCallback): Promise<Popup>;
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
 * A function that works out what popup to show.
 *
 * It's called every time the popup is about to be shown and is passed the object that the popup
 * is attached to. It can return the content for the popup, a PopupOptions object, or a Popup
 * object to show instead.
 */
type PopupCallback = (target?: Map | Layer) => PopupValue;
type AttachPopupValue = PopupValue | PopupCallback;
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
/**
 * A function that works out the popup to show for a data layer feature.
 *
 * It's the data layer version of PopupCallback. It's called every time the popup is about to be
 * shown and is passed the feature that the event happened on. It can return the content for the
 * popup, a PopupOptions object, or a Popup object to show instead.
 */
type DataPopupCallback = (feature: DataFeature) => PopupValue;
type DataPopupValue = PopupValue | DataPopupCallback;

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
     * Whether attachTooltip() gives everything one shared Tooltip instead of one each.
     *
     * Defaults to true. Set it to false to go back to a Tooltip per layer, or pass
     * { shared: false } to a single attachTooltip() call to opt just that one out.
     *
     * Passing an actual Tooltip object to attachTooltip() always uses that object, whatever
     * this is set to.
     *
     * @type {boolean}
     */
    static useShared: boolean;
    /**
     * Constructor
     *
     * @param {TooltipOptions | string | HTMLElement | Text} [options] Tooltip options
     */
    constructor(options?: TooltipOptions | string | HTMLElement | Text);
    /**
     * Get the one Tooltip that everything shares, building it the first time it's needed.
     *
     * It's built with no options on purpose. A Tooltip built from an options object doesn't get
     * the "tooltip" class name, only one built from a string or from nothing does, and the shared
     * tooltip has to look like the per-layer ones it replaces.
     *
     * @returns {Tooltip}
     */
    static getShared(): Tooltip;
    /**
     * Throw away the shared tooltip, hiding it first if it's showing.
     *
     * The next thing that needs it builds a new one. Each thing keeps its own value, so they
     * carry on working after this.
     */
    static clearShared(): void;
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
     * @returns {string|HTMLElement|Text|undefined}
     */
    get content(): string | HTMLElement | Text | undefined;
    /**
     * Set the content for the tooltip
     *
     * @param {string|HTMLElement|Text} content The content for the tooltip
     */
    set content(content: string | HTMLElement | Text);
    /**
     * Get the overlay HTML element, writing any content that is waiting into it first.
     *
     * Everything that uses the element goes through here - add(), draw(), and anything outside
     * the library - so the content is always there by the time it's looked at.
     *
     * @returns {HTMLElement}
     */
    getOverlayElement(): HTMLElement;
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
     * @param {TooltipCallback} [callback] A function that is called every time the tooltip is about to be shown.
     *      It's passed the element that the tooltip is attached to and returns the content for the tooltip,
     *      a TooltipOptions object, or a Tooltip object to show instead.
     * @returns {Promise<Tooltip>}
     */
    attachTo(element: Map | Layer, event?: 'click' | 'clickon' | 'hover', callback?: TooltipCallback): Promise<Tooltip>;
    /**
     * Hide the tooltip
     *
     * A callback can return a different Tooltip to show, which is held in #activeTooltip. Hiding
     * this one used to leave that one on the map with nothing referring to it. Only the hover
     * wiring took it down, by hiding `#activeTooltip || this` on mouseout, so a tooltip shown by
     * a click and then hidden directly stayed on the map. It's hidden and forgotten here instead,
     * which is what Popup.hide() does for the same reason.
     *
     * The check against this one matters rather than being tidiness: a callback that returns
     * content or an options object is applied to this tooltip and #activeTooltip is then set to
     * this tooltip, so calling hide() on it without the check would call this method again and
     * never stop.
     *
     * @returns {Tooltip}
     */
    hide(): Tooltip;
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
 * A function that works out what tooltip to show.
 *
 * It's called every time the tooltip is about to be shown and is passed the object that the
 * tooltip is attached to. It can return the content for the tooltip, a TooltipOptions object,
 * or a Tooltip object to show instead.
 */
type TooltipCallback = (target?: Map | Layer) => TooltipValue;
type AttachTooltipValue = TooltipValue | TooltipCallback;
/**
 * Helper function to set up the tooltip object
 *
 * @param {TooltipValue} [options] The tooltip options or the tooltip class
 * @returns {Tooltip}
 */
declare const tooltip: (options?: TooltipValue) => Tooltip;
type TooltipConfig = {
    attachConfig: AttachTooltipValue;
    attachEvent?: 'click' | 'clickon' | 'hover';
};
/**
 * A function that works out the tooltip to show for a data layer feature.
 *
 * It's the data layer version of TooltipCallback. It's called every time the tooltip is about to
 * be shown and is passed the feature that the event happened on. It can return the content for
 * the tooltip, a TooltipOptions object, or a Tooltip object to show instead.
 */
type DataTooltipCallback = (feature: DataFeature) => TooltipValue;
type DataTooltipValue = TooltipValue | DataTooltipCallback;

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
type InfoWindowEvent = 'close' | 'closeclick' | 'content_changed' | 'domready' | 'headercontent_changed' | 'headerdisabled_changed' | 'position_changed' | 'ready' | 'visible' | 'zindex_changed';
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
     * @returns {string|undefined}
     */
    get ariaLabel(): string | undefined;
    /**
     * Set the aria label for the InfoWindow
     *
     * @param {string|number} ariaLabel The aria label for the InfoWindow
     */
    set ariaLabel(ariaLabel: string | number);
    /**
     * Get the content for the InfoWindow
     *
     * @returns {string|HTMLElement|Text|undefined}
     */
    get content(): string | HTMLElement | Text | undefined;
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
     * @returns {number|undefined}
     */
    get maxWidth(): number | undefined;
    /**
     * Set the maxWidth option for the InfoWindow
     *
     * @param {number|string} maxWidth The maxWidth option for the InfoWindow
     */
    set maxWidth(maxWidth: number | string);
    /**
     * Get the minWidth option for the InfoWindow
     *
     * @returns {number|undefined}
     */
    get minWidth(): number | undefined;
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
     * @returns {LatLng|undefined}
     */
    get position(): LatLng | undefined;
    /**
     * Set the position option for the InfoWindow
     *
     * @param {LatLngValue} position The position option for the InfoWindow
     */
    set position(position: LatLngValue);
    /**
     * Get the zIndex option for the InfoWindow
     *
     * @returns {number|undefined}
     */
    get zIndex(): number | undefined;
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
     * Add an event listener for when the info window is loaded and ready for use.
     *
     * @param {EventCallback} [callback] The callback function to call when the event is dispatched.
     */
    onReady(callback: EventCallback): void;
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
     * @returns {google.maps.InfoWindow|undefined} The Google maps InfoWindow object, or undefined if the Google Maps library isn't loaded.
     */
    toGoogle(): google.maps.InfoWindow | undefined;
}
type InfoWindowValue = InfoWindow | InfoWindowOptions | string | HTMLElement | Text;
/**
 * Helper function to set up the InfoWindow class
 *
 * @param {InfoWindowValue} [options] The InfoWindow options
 * @returns {InfoWindow}
 */
declare const infoWindow: (options?: InfoWindowValue) => InfoWindow;

type MapType = 'hybrid' | 'roadmap' | 'satellite' | 'terrain';
type InternalEvent = 'locationerror' | 'locationfound' | 'ready';
type InitHook = (map: Map) => void;
type GMEvent = 'bounds_changed' | 'center_changed' | 'click' | 'contextmenu' | 'dblclick' | 'drag' | 'dragend' | 'dragstart' | 'heading_changed' | 'idle' | 'isfractionalzoomenabled_changed' | 'mapcapabilities_changed' | 'maptypeid_changed' | 'mousemove' | 'mouseout' | 'mouseover' | 'projection_changed' | 'renderingtype_changed' | 'tilesloaded' | 'tilt_changed' | 'zoom_changed';
type MapEvent = GMEvent | InternalEvent;
/**
 * The map class
 */
declare class Map extends Evented {
    #private;
    /**
     * Placeholders for the methods that the optional feature modules add to this class.
     *
     * Importing the popup, tooltip or InfoWindow module runs an include() that replaces each of
     * these with the real method. The signatures here match the ones those modules install, so the
     * types are the same either way. Only the body differs, and it only ever runs when the matching
     * module hasn't been imported - which is possible when importing from '@aptuitiv/gmaps/core'
     * rather than '@aptuitiv/gmaps'. Without these the call fails with "attachPopup is not a
     * function", which doesn't say what to do about it.
     *
     * @param {AttachPopupValue} popupValue The content for the Popup, or the Popup options object, or
     *      the Popup object, or a function that returns one of those.
     * @param {'click' | 'clickon' | 'hover'} [event] The event to trigger the popup.
     * @returns {Popup}
     */
    attachPopup(popupValue: AttachPopupValue, event?: 'click' | 'clickon' | 'hover'): Popup;
    /**
     * @inheritdoc
     * @param {AttachTooltipValue|TooltipConfig} tooltipValue The content for the Tooltip, or the
     *      Tooltip options object, or the Tooltip object, or a function that returns one of those.
     * @param {'click' | 'clickon' | 'hover'} [event] The event to trigger the tooltip.
     * @returns {Tooltip}
     */
    attachTooltip(tooltipValue: AttachTooltipValue | TooltipConfig, event?: 'click' | 'clickon' | 'hover'): Tooltip;
    /**
     * @inheritdoc
     * @param {InfoWindowValue} infoWindowValue The content for the InfoWindow, or the InfoWindow
     *      options object, or the InfoWindow object.
     * @param {'click' | 'clickon' | 'hover'} [event] The event to trigger the InfoWindow.
     * @returns {InfoWindow}
     */
    attachInfoWindow(infoWindowValue: InfoWindowValue, event?: 'click' | 'clickon' | 'hover'): InfoWindow;
    /**
     * Add a function to run against every map that is created from now on.
     *
     * This is how a plugin attaches itself to every map on a page without the site having to call
     * it for each one. The function is called as the map is constructed, after its options have
     * been set and before it has been rendered, with the map as both "this" and its first argument.
     *
     * Two things to know about it:
     *
     * 1. It only applies to maps created after the hook is added, not to ones that already exist.
     *    A plugin therefore has to be loaded before the maps it means to attach to. In the browser
     *    that means its script tag comes before the code that creates the map.
     * 2. The map isn't rendered yet when the hook runs, so toGoogle() returns undefined. Anything
     *    that needs the Google map object should wait for the "ready" event.
     *
     * A hook that throws is logged and the rest still run, so that one plugin can't stop a map
     * from being created.
     *
     * @param {InitHook} callback The function to call for each new map
     */
    static addInitHook(callback: InitHook): void;
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
     * Get the data layer for the map.
     *
     * This is the map's own data layer, which every map has. Use the dataLayer() function if
     * you need a separate layer that only holds your own data.
     *
     * The layer is created the first time that this is used, and the same layer object is
     * returned after that.
     *
     * https://developers.google.com/maps/documentation/javascript/datalayer
     *
     * @returns {DataLayer}
     */
    get data(): DataLayer;
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
     * Get whether businesses are hidden on the map
     *
     * @returns {boolean}
     */
    get hideBusinesses(): boolean;
    /**
     * Set whether to hide businesses on the map.
     *
     * This hides the "poi.business" feature type, which includes things like stores, restaurants, and hotels.
     * If the map has already been rendered then it's updated right away.
     *
     * @param {boolean} value Whether to hide businesses
     */
    set hideBusinesses(value: boolean);
    /**
     * Get whether all points of interest are hidden on the map
     *
     * @returns {boolean}
     */
    get hidePointsOfInterest(): boolean;
    /**
     * Set whether to hide all points of interest on the map.
     *
     * This hides the "poi" feature type, which includes businesses, parks, schools, attractions, and places of worship.
     * If the map has already been rendered then it's updated right away.
     *
     * @param {boolean} value Whether to hide all points of interest
     */
    set hidePointsOfInterest(value: boolean);
    /**
     * Get whether transit lines and stations are hidden on the map
     *
     * @returns {boolean}
     */
    get hideTransit(): boolean;
    /**
     * Set whether to hide transit lines and stations on the map.
     *
     * This hides the "transit" feature type, which includes things like bus stops, train stations, and rail lines.
     * If the map has already been rendered then it's updated right away.
     *
     * @param {boolean} value Whether to hide transit lines and stations
     */
    set hideTransit(value: boolean);
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
     * Get whether a pinch on the map is kept from zooming the whole page on iOS
     *
     * @returns {boolean}
     */
    get preventPageZoom(): boolean;
    /**
     * Set whether a pinch on the map is kept from zooming the whole page on iOS
     *
     * @param {boolean} value Whether to keep a pinch on the map from zooming the page
     */
    set preventPageZoom(value: boolean);
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
     * Add GeoJson data to the map's data layer.
     *
     * This is the same as calling map.data.addGeoJson().
     *
     * @param {object} geoJson The GeoJson object to add
     * @param {LoadOptions} [options] The options for adding the data
     * @returns {Promise<DataFeature[]>}
     */
    addGeoJson(geoJson: object, options?: LoadOptions): Promise<DataFeature[]>;
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
     * Load GeoJson data into the map's data layer from a url.
     *
     * This is the same as calling map.data.loadGeoJson(). More than one url can be passed.
     *
     * @param {string|string[]} url The url to load the GeoJson from, or an array of urls
     * @param {LoadOptions} [options] The options for loading the data
     * @returns {Promise<DataFeature[]>}
     */
    loadGeoJson(url: string | string[], options?: LoadOptions): Promise<DataFeature[]>;
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
     * Set whether to hide businesses on the map.
     *
     * This can be called after the map has been rendered.
     *
     * @param {boolean} [value] Whether to hide businesses. Defaults to true.
     * @returns {Map}
     */
    setHideBusinesses(value?: boolean): Map;
    /**
     * Set whether to hide all points of interest on the map.
     *
     * This can be called after the map has been rendered.
     *
     * @param {boolean} [value] Whether to hide all points of interest. Defaults to true.
     * @returns {Map}
     */
    setHidePointsOfInterest(value?: boolean): Map;
    /**
     * Set whether to hide transit lines and stations on the map.
     *
     * This can be called after the map has been rendered.
     *
     * @param {boolean} [value] Whether to hide transit lines and stations. Defaults to true.
     * @returns {Map}
     */
    setHideTransit(value?: boolean): Map;
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
     * Returns the Google map object.
     *
     * The Google map object is set up when the map is shown. Before that this returns undefined.
     * Use init(), load(), or show() and wait for them to resolve before calling this.
     *
     * @returns {google.maps.Map|undefined}
     */
    toGoogle(): google.maps.Map | undefined;
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
     * This is an index signature so that Typescript doesn't complain about adding properties
     * to the class via mixins.
     *
     * For example, this lets us use attachTooltip() in the Marker class even though attachTooltip()
     * is applied to the layer via the Tooltip mixin.
     */
    [x: string]: any;
    /**
     * Placeholders for the methods that the optional feature modules add to this class.
     *
     * Importing the popup, tooltip or InfoWindow module runs an include() that replaces these with
     * the real methods. They only ever run when the matching module hasn't been imported, which is
     * possible when importing from '@aptuitiv/gmaps/core' rather than '@aptuitiv/gmaps'. Without
     * them the call fails with "attachPopup is not a function", which doesn't say what to do about
     * it.
     *
     * @param {...any} args Ignored. The signature is permissive so that it doesn't narrow the real
     *      method's signature for anyone calling it.
     * @returns {any}
     */
    attachPopup(...args: any[]): any;
    /**
     * @inheritdoc
     * @param {...any} args Ignored. See attachPopup().
     * @returns {any}
     */
    attachTooltip(...args: any[]): any;
    /**
     * @inheritdoc
     * @param {...any} args Ignored. See attachPopup().
     * @returns {any}
     */
    attachInfoWindow(...args: any[]): any;
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
     * Set the Popup object that the layer is added to
     *
     * @internal
     * @param {Popup} popup The Popup object to add the layer to
     */
    setPopup(popup: Popup | null): void;
    /**
     * Close the popup for the layer
     *
     * @returns {void}
     */
    closePopup(): void;
    /**
     * Get the Popup object that the layer is added to
     *
     * @returns {Popup|undefined}
     */
    getPopup(): Popup | undefined;
    /**
     * Check if the layer has a Popup object set
     *
     * @returns {boolean}
     */
    hasPopup(): boolean;
    /**
     * Add an event listener for when the layer is loaded and ready for use.
     *
     * @param {EventCallback} [callback] The callback function to call when the event is dispatched.
     */
    onReady(callback: EventCallback): void;
    /**
     * Open the popup for the layer
     *
     * @returns {void}
     */
    openPopup(): void;
    /**
     * Toggle the popup for the layer
     *
     * @returns {void}
     */
    togglePopup(): void;
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
     * @returns {string|null|undefined}
     */
    get fillColor(): string | null | undefined;
    /**
     * Set the SVG fill color.
     *
     * @param {string} fillColor The SVG fill color.
     */
    set fillColor(fillColor: string);
    /**
     * Get the opacity for the fill
     *
     * @returns {number|null|undefined}
     */
    get fillOpacity(): number | null | undefined;
    /**
     * Set the opacity for the fill
     *
     * @param {number|string} fillOpacity The opacity for the fill
     */
    set fillOpacity(fillOpacity: number | string);
    /**
     * Get the origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
     *
     * @returns {PointValue|null|undefined}
     */
    get labelOrigin(): PointValue | null | undefined;
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
     * @returns {number|null|undefined}
     */
    get rotation(): number | null | undefined;
    /**
     * Set the rotation of the icon in degrees clockwise about the anchor point.
     *
     * @param {number|string} rotation The rotation of the icon in degrees clockwise about the anchor point.
     */
    set rotation(rotation: number | string);
    /**
     * Get the amount by which the icon is scaled.
     *
     * @returns {number|null|undefined}
     */
    get scale(): number | null | undefined;
    /**
     * Set the amount by which the icon is scaled.
     *
     * @param {number|string} scale The amount by which the icon is scaled.
     */
    set scale(scale: number | string);
    /**
     * Get the SVG stroke color
     *
     * @returns {string|null|undefined}
     */
    get strokeColor(): string | null | undefined;
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
     * @returns {number|null|undefined}
     */
    get strokeOpacity(): number | null | undefined;
    /**
     * Set the opacity of the stroke.
     *
     * @param {number|string} strokeOpacity The opacity of the stroke.
     */
    set strokeOpacity(strokeOpacity: number | string);
    /**
     * Get the weight of the stroke in pixels.
     *
     * @returns {number|null|undefined}
     */
    get strokeWeight(): number | null | undefined;
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

type DataLayerEvent = 'addfeature' | 'click' | 'contextmenu' | 'dblclick' | 'load' | 'mousedown' | 'mouseout' | 'mouseover' | 'mouseup' | 'ready' | 'removefeature' | 'removeproperty' | 'rightclick' | 'setgeometry' | 'setproperty';
type DataLayerEventObject = Event & {
    feature?: DataFeature;
};
type DataLayerEventCallback = (event: DataLayerEventObject) => void;
/**
 * The style to apply to a feature.
 *
 * These use this library's option names, which match the Polyline options, rather than the
 * Google maps names.
 */
type DataStyleOptions = {
    clickable?: boolean;
    cursor?: string;
    draggable?: boolean;
    editable?: boolean;
    fillColor?: string;
    fillOpacity?: number | string;
    icon?: Icon | SvgSymbol | string | google.maps.Icon | google.maps.Symbol;
    strokeColor?: string;
    strokeOpacity?: number | string;
    strokeWeight?: number | string;
    title?: string;
    visible?: boolean;
    zIndex?: number | string;
};
type DataStyleValue = DataStyleOptions | ((feature: DataFeature) => DataStyleOptions);
type LoadOptions = {
    fitBounds?: boolean;
    idProperty?: string;
    replace?: boolean;
};
type FeatureOptions = {
    id?: string | number;
    properties?: FeatureProperties;
    style?: DataStyleOptions;
};
type DataLayerOptions = {
    fitBounds?: boolean;
    geoJson?: string | string[] | object;
    idProperty?: string;
    map?: Map;
    style?: DataStyleValue;
    visible?: boolean;
};
/**
 * The data layer class
 */
declare class DataLayer extends Layer {
    #private;
    /**
     * Constructor
     *
     * @param {DataLayerOptions} [options] The data layer options
     * @param {Map} [defaultLayerMap] The map to wrap the default data layer for.
     *      This is only used within this library by the Map class for the map.data value.
     * @internal
     */
    constructor(options?: DataLayerOptions, defaultLayerMap?: Map);
    /**
     * Get the map that the layer is attached to
     *
     * @returns {Map|null}
     */
    get map(): Map | null;
    /**
     * Set the map that the layer is attached to
     *
     * @param {Map|null} value The map object. Set to null to remove the layer from the map.
     */
    set map(value: Map | null);
    /**
     * Get the style for the layer
     *
     * @returns {DataStyleValue | undefined}
     */
    get style(): DataStyleValue | undefined;
    /**
     * Set the style for the layer
     *
     * @param {DataStyleValue} value The style to apply to the features in the layer
     */
    set style(value: DataStyleValue);
    /**
     * Get whether the layer is visible on the map
     *
     * @returns {boolean}
     */
    get visible(): boolean;
    /**
     * Set whether the layer is visible on the map
     *
     * @param {boolean} value Whether the layer is visible on the map
     */
    set visible(value: boolean);
    /**
     * Add GeoJson data to the layer.
     *
     * https://developers.google.com/maps/documentation/javascript/reference/data#Data.addGeoJson
     *
     * @param {object} geoJson The GeoJson object to add
     * @param {LoadOptions} [options] The options for adding the data
     * @returns {Promise<DataFeature[]>}
     */
    addGeoJson(geoJson: object, options?: LoadOptions): Promise<DataFeature[]>;
    /**
     * Add a single point to the layer.
     *
     * @param {LatLngValue} position The position for the point
     * @param {FeatureOptions} [options] The options for the feature
     * @returns {Promise<DataFeature>}
     */
    addPoint(position: LatLngValue, options?: FeatureOptions): Promise<DataFeature>;
    /**
     * Add a polygon to the layer.
     *
     * The paths value can either be a single array of positions for a polygon without any
     * holes in it, or an array of arrays of positions. When it's an array of arrays the first
     * one is the outer edge of the polygon and each one after that is a hole within it.
     *
     * A ring doesn't need to repeat its first position at the end to close it. If it does,
     * as GeoJson data does, then the repeated position is dropped.
     *
     * @param {LatLngValue[]|LatLngValue[][]} paths The path for the polygon, or an array of paths
     * @param {FeatureOptions} [options] The options for the feature
     * @returns {Promise<DataFeature>}
     */
    addPolygon(paths: LatLngValue[] | LatLngValue[][], options?: FeatureOptions): Promise<DataFeature>;
    /**
     * Add a line to the layer.
     *
     * @param {LatLngValue[]} path The path for the line
     * @param {FeatureOptions} [options] The options for the feature
     * @returns {Promise<DataFeature>}
     */
    addPolyline(path: LatLngValue[], options?: FeatureOptions): Promise<DataFeature>;
    /**
     * Remove every feature from the layer.
     *
     * The Google maps API doesn't have a way to do this so each feature is removed in turn.
     *
     * Take care when calling this on the map's own data layer (map.data). Google gives each map
     * one shared data layer, so this removes every feature on it, including any that another part
     * of the application added. Use dataLayer() to create a layer that only holds your own data.
     *
     * @returns {DataLayer}
     */
    clear(): DataLayer;
    /**
     * Returns whether the feature is in this layer.
     *
     * @param {DataFeature} feature The feature to test for
     * @returns {Promise<boolean>}
     */
    contains(feature: DataFeature): Promise<boolean>;
    /**
     * @inheritdoc
     */
    dispatch(event: string, data?: any): Evented;
    /**
     * Fit the map to the bounds of the data in the layer.
     *
     * Nothing happens if the layer has no features, or if it isn't attached to a map.
     *
     * @returns {Promise<DataLayer>}
     */
    fitBounds(): Promise<DataLayer>;
    /**
     * Call the callback function for each feature in the layer.
     *
     * @param {Function} callback The function to call for each feature
     * @returns {Promise<DataLayer>}
     */
    forEach(callback: (feature: DataFeature) => void): Promise<DataLayer>;
    /**
     * Get the bounds of all of the features in the layer.
     *
     * @returns {Promise<LatLngBounds>}
     */
    getBounds(): Promise<LatLngBounds>;
    /**
     * Get a feature by its id.
     *
     * https://developers.google.com/maps/documentation/javascript/reference/data#Data.getFeatureById
     *
     * @param {string|number} id The feature id
     * @returns {Promise<DataFeature|undefined>}
     */
    getFeature(id: string | number): Promise<DataFeature | undefined>;
    /**
     * Get every feature in the layer.
     *
     * The Google maps API only provides forEach() so this collects the features into an array.
     * That gives you the array methods, so filtering is done with filter():
     *
     * const parks = (await layer.getFeatures()).filter((feature) => feature.getProperty('type') === 'park');
     *
     * @returns {Promise<DataFeature[]>}
     */
    getFeatures(): Promise<DataFeature[]>;
    /**
     * Hide the layer on the map.
     *
     * The features stay in the layer. Use show() to display them again.
     *
     * @returns {DataLayer}
     */
    hide(): DataLayer;
    /**
     * Initialize the data layer
     *
     * This is used when another element, like a tooltip, needs to be attached to the layer
     * but needs to make sure that the layer exists first.
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
    hasListener(type: DataLayerEvent, callback?: EventCallback): boolean;
    /**
     * Load GeoJson data into the layer from a url.
     *
     * The Google maps API method is callback based. This returns a promise that resolves with
     * the features that were loaded.
     *
     * More than one url can be passed. The promise then resolves once every file has loaded,
     * with all of the features from all of the files.
     *
     * https://developers.google.com/maps/documentation/javascript/reference/data#Data.loadGeoJson
     *
     * @param {string|string[]} url The url to load the GeoJson from, or an array of urls
     * @param {LoadOptions} [options] The options for loading the data
     * @returns {Promise<DataFeature[]>}
     */
    loadGeoJson(url: string | string[], options?: LoadOptions): Promise<DataFeature[]>;
    /**
     * @inheritdoc
     */
    off(type?: DataLayerEvent, callback?: EventCallback, options?: EventListenerOptions): void;
    /**
     * @inheritdoc
     */
    on(type: DataLayerEvent, callback: DataLayerEventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onImmediate(type: DataLayerEvent, callback: DataLayerEventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    once(type: DataLayerEvent, callback?: DataLayerEventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onceImmediate(type: DataLayerEvent, callback?: DataLayerEventCallback, config?: EventConfig): void;
    /**
     * Add an event listener for when a feature is added to the layer.
     *
     * @param {DataLayerEventCallback} callback The callback function to call when the event is dispatched.
     */
    onAddFeature(callback: DataLayerEventCallback): void;
    /**
     * Add an event listener for when a feature is clicked.
     *
     * The feature that was clicked is on the event object.
     *
     * layer.onClick((event) => { console.log(event.feature.getProperty('name')); });
     *
     * @param {DataLayerEventCallback} callback The callback function to call when the event is dispatched.
     */
    onClick(callback: DataLayerEventCallback): void;
    /**
     * Add an event listener for when a feature is double clicked.
     *
     * @param {DataLayerEventCallback} callback The callback function to call when the event is dispatched.
     */
    onDblClick(callback: DataLayerEventCallback): void;
    /**
     * Add an event listener for when GeoJson data has finished loading.
     *
     * This is dispatched by loadGeoJson() and addGeoJson().
     *
     * @param {DataLayerEventCallback} callback The callback function to call when the event is dispatched.
     */
    onLoad(callback: DataLayerEventCallback): void;
    /**
     * Add an event listener for when the mouse leaves a feature.
     *
     * @param {DataLayerEventCallback} callback The callback function to call when the event is dispatched.
     */
    onMouseOut(callback: DataLayerEventCallback): void;
    /**
     * Add an event listener for when the mouse moves over a feature.
     *
     * @param {DataLayerEventCallback} callback The callback function to call when the event is dispatched.
     */
    onMouseOver(callback: DataLayerEventCallback): void;
    /**
     * Add an event listener for when a feature is removed from the layer.
     *
     * @param {DataLayerEventCallback} callback The callback function to call when the event is dispatched.
     */
    onRemoveFeature(callback: DataLayerEventCallback): void;
    /**
     * Add an event listener for when a feature is right clicked.
     *
     * @param {DataLayerEventCallback} callback The callback function to call when the event is dispatched.
     */
    onRightClick(callback: DataLayerEventCallback): void;
    /**
     * Set the style for one feature, overriding the layer style.
     *
     * https://developers.google.com/maps/documentation/javascript/reference/data#Data.overrideStyle
     *
     * @param {DataFeatureValue} feature The feature, or the feature id, to set the style on
     * @param {DataStyleOptions} style The style to set on the feature
     * @returns {DataLayer}
     */
    overrideStyle(feature: DataFeatureValue, style: DataStyleOptions): DataLayer;
    /**
     * Remove a feature from the layer.
     *
     * @param {DataFeatureValue} feature The feature, or the feature id, to remove
     * @returns {DataLayer}
     */
    remove(feature: DataFeatureValue): DataLayer;
    /**
     * Remove the style override for a feature so that it uses the layer style again.
     *
     * If no feature is passed then the override is removed from every feature.
     *
     * @param {DataFeatureValue} [feature] The feature, or the feature id, to revert the style for
     * @returns {DataLayer}
     */
    revertStyle(feature?: DataFeatureValue): DataLayer;
    /**
     * Add the data layer to the map object.
     *
     * @param {Map|null} value The map object. Set to null to remove the layer from the map.
     * @returns {Promise<DataLayer>}
     */
    setMap(value: Map | null): Promise<DataLayer>;
    /**
     * Set the data layer options
     *
     * @param {DataLayerOptions} options The data layer options
     * @returns {DataLayer}
     */
    setOptions(options: DataLayerOptions): DataLayer;
    /**
     * Set the style to apply to the features in the layer.
     *
     * The style can either be a single style object that is applied to every feature, or a
     * function that is called for each feature and returns the style for it.
     *
     * This replaces the existing style rather than merging with it, which matches the
     * Google maps API. Set every value that you need each time.
     *
     * layer.setStyle({ fillColor: '#4caf50' });
     * layer.setStyle((feature) => ({ fillColor: feature.getProperty('color') }));
     *
     * https://developers.google.com/maps/documentation/javascript/reference/data#Data.setStyle
     *
     * @param {DataStyleValue} style The style to apply to the features in the layer
     * @returns {DataLayer}
     */
    setStyle(style: DataStyleValue): DataLayer;
    /**
     * Show the layer on the map.
     *
     * This will also set the map object if it's passed.
     *
     * @param {Map} [map] The map object to add the layer to
     * @returns {Promise<DataLayer>}
     */
    show(map?: Map): Promise<DataLayer>;
    /**
     * Export every feature in the layer as a GeoJson object.
     *
     * The Google maps API method is callback based. This returns a promise instead.
     *
     * @returns {Promise<object>}
     */
    toGeoJson(): Promise<object>;
    /**
     * Returns the Google maps Data object.
     *
     * The Data object may not exist yet so this returns a promise that resolves once it does.
     *
     * This waits for any calls that were already made on the layer, so the Data object that it
     * resolves with has had all of them applied to it.
     *
     * @returns {Promise<google.maps.Data>}
     */
    toGoogle(): Promise<google.maps.Data>;
}
type DataLayerValue = DataLayer | DataLayerOptions;
/**
 * Helper function to set up the data layer object
 *
 * @param {DataLayerValue} [options] The data layer options or the data layer class
 * @returns {DataLayer}
 */
declare const dataLayer: (options?: DataLayerValue) => DataLayer;

type FeatureProperties = {
    [key: string]: any;
};
/**
 * A single feature within a data layer.
 *
 * This is not intended to be created directly. Features are returned by the DataLayer
 * methods that load or add data.
 */
declare class DataFeature extends Layer {
    #private;
    /**
     * Constructor
     *
     * @param {google.maps.Data.Feature} feature The Google maps Data.Feature object
     * @param {DataLayer} layer The data layer that the feature belongs to
     */
    constructor(feature: google.maps.Data.Feature, layer: DataLayer);
    /**
     * Get the feature id.
     *
     * The id is only set if the GeoJson data included one, or if it was set when the
     * feature was added to the data layer.
     *
     * @returns {string|number|undefined}
     */
    get id(): string | number | undefined;
    /**
     * Get the data layer that the feature belongs to.
     *
     * @returns {DataLayer}
     */
    get layer(): DataLayer;
    /**
     * Get the geometry type for the feature.
     *
     * This is the GeoJson geometry type. For example "Point", "LineString" or "Polygon".
     *
     * @returns {GeometryTypeValue|undefined}
     */
    get geometryType(): GeometryTypeValue | undefined;
    /**
     * Get all of the properties for the feature as a plain object.
     *
     * The Google maps API only lets you get one property at a time, so this collects them all.
     *
     * @returns {FeatureProperties}
     */
    get properties(): FeatureProperties;
    /**
     * Get the bounds of the feature.
     *
     * Every Google maps geometry object supports forEachLatLng(), which walks nested
     * geometries, so this works for every geometry type without needing to handle each one.
     *
     * @returns {LatLngBounds}
     */
    getBounds(): LatLngBounds;
    /**
     * Get the feature id.
     *
     * Alternate of the id getter.
     *
     * @returns {string|number|undefined}
     */
    getId(): string | number | undefined;
    /**
     * Get the geometry type for the feature.
     *
     * Alternate of the geometryType getter.
     *
     * @returns {GeometryTypeValue|undefined}
     */
    getGeometryType(): GeometryTypeValue | undefined;
    /**
     * Get the data layer that the feature belongs to.
     *
     * Alternate of the layer getter.
     *
     * @returns {DataLayer}
     */
    getLayer(): DataLayer;
    /**
     * Get the first path of coordinates for the feature.
     *
     * For a LineString this is the line. For a Polygon this is the outer ring.
     * Use getPaths() to also get the holes in a polygon.
     *
     * @returns {LatLng[]}
     */
    getPath(): LatLng[];
    /**
     * Get all of the paths of coordinates for the feature.
     *
     * For a Polygon the first path is the outer ring and any additional paths are the
     * holes within it.
     *
     * @returns {LatLng[][]}
     */
    getPaths(): LatLng[][];
    /**
     * Get the position of the feature if it's a Point geometry.
     *
     * @returns {LatLng|undefined}
     */
    getPosition(): LatLng | undefined;
    /**
     * Get a single property value for the feature.
     *
     * @param {string} key The property name to get the value for
     * @returns {any}
     */
    getProperty(key: string): any;
    /**
     * Get all of the properties for the feature as a plain object.
     *
     * Alternate of the properties getter.
     *
     * @returns {FeatureProperties}
     */
    getProperties(): FeatureProperties;
    /**
     * Returns whether the feature has the given property set.
     *
     * @param {string} key The property name to test for
     * @returns {boolean}
     */
    hasProperty(key: string): boolean;
    /**
     * Initialize the feature
     *
     * The feature always wraps an existing Google feature object, so there is nothing to
     * wait for. This exists so that objects that attach to a layer, like tooltips, work.
     *
     * @internal
     * @returns {Promise<void>}
     */
    init(): Promise<void>;
    /**
     * Remove the feature from the data layer that it belongs to.
     *
     * @returns {DataFeature}
     */
    remove(): DataFeature;
    /**
     * Remove a property from the feature.
     *
     * @param {string} key The property name to remove
     * @returns {DataFeature}
     */
    removeProperty(key: string): DataFeature;
    /**
     * Reset the style for this feature back to the data layer style.
     *
     * This undoes setStyle().
     *
     * @returns {DataFeature}
     */
    resetStyle(): DataFeature;
    /**
     * Set the style for this one feature, overriding the data layer style.
     *
     * Use resetStyle() to go back to the data layer style.
     *
     * @param {DataStyleOptions} style The style to set on this feature
     * @returns {DataFeature}
     */
    setStyle(style: DataStyleOptions): DataFeature;
    /**
     * Set a property value on the feature.
     *
     * @param {string} key The property name to set
     * @param {any} value The value to set
     * @returns {DataFeature}
     */
    setProperty(key: string, value: any): DataFeature;
    /**
     * Set multiple property values on the feature.
     *
     * @param {FeatureProperties} properties The properties to set
     * @returns {DataFeature}
     */
    setProperties(properties: FeatureProperties): DataFeature;
    /**
     * Export the feature as a GeoJson object.
     *
     * The Google maps API method is callback based. This returns a promise instead.
     *
     * @returns {Promise<object>}
     */
    toGeoJson(): Promise<object>;
    /**
     * Returns the Google maps Data.Feature object
     *
     * @returns {google.maps.Data.Feature}
     */
    toGoogle(): google.maps.Data.Feature;
}
type DataFeatureValue = DataFeature | string | number;

export { MapStyle as $, latLng as A, Base as B, type LatLngLiteral as C, DataFeature as D, Evented as E, type FeatureProperties as F, type LatLngLiteralExpanded as G, latLngBounds as H, Icon as I, type LatLngBoundsEdges as J, type LatLngBoundsLiteral as K, LatLngBounds as L, Map as M, type InitHook as N, Overlay as O, Point as P, map as Q, type MapType as R, SvgSymbol as S, type TooltipValue as T, fullscreenControl as U, FullscreenControl as V, type FullscreenControlOptions as W, mapRestriction as X, MapRestriction as Y, type MapRestrictionOptions as Z, mapStyle as _, LatLng as a, infoWindow as a$, type MapStyleOptions as a0, mapTypeControl as a1, MapTypeControl as a2, type MapTypeControlOptions as a3, rotateControl as a4, RotateControl as a5, type RotateControlOptions as a6, scaleControl as a7, ScaleControl as a8, type ScaleControlOptions as a9, type GeometryTypeValue as aA, GeocoderErrorStatus as aB, type GeocoderErrorStatusValue as aC, GeocoderLocationType as aD, type GeocoderLocationTypeValue as aE, ImageOverlayEvents as aF, InfoWindowEvents as aG, LayerEvents as aH, LoaderEvents as aI, MapEvents as aJ, MapTypeControlStyle as aK, type MapTypeControlStyleValue as aL, convertMapTypeControlStyle as aM, MapTypeId as aN, type MapTypeIdValue as aO, MarkerEvents as aP, OverlayEvents as aQ, PlacesSearchBoxEvents as aR, PolylineEvents as aS, PopupEvents as aT, RenderingType as aU, type RenderingTypeValue as aV, StreetViewSource as aW, type StreetViewSourceValue as aX, SymbolPath as aY, type SymbolPathValue as aZ, convertSymbolPath as a_, streetViewControl as aa, StreetViewControl as ab, type StreetViewControlOptions as ac, zoomControl as ad, ZoomControl as ae, type ZoomControlOptions as af, type LocationOnSuccess as ag, type LocateOptions as ah, type LocationPosition as ai, type MapOptions as aj, overlay as ak, point as al, type PointObject as am, size as an, Size as ao, type SizeObject as ap, svgSymbol as aq, type SvgSymbolOptions as ar, READY_EVENT as as, INTERNAL_EVENTS as at, AutocompleteSearchBoxEvents as au, ControlPosition as av, type ControlPositionValue as aw, convertControlPosition as ax, DataLayerEvents as ay, GeometryType as az, type LatLngBoundsValue as b, InfoWindow as b0, type InfoWindowOptions as b1, type InfoWindowValue as b2, type AttachPopupValue as b3, closeAllPopups as b4, type DataPopupCallback as b5, type DataPopupValue as b6, popup as b7, Popup as b8, type PopupCallback as b9, type PopupOptions as ba, type PopupValue as bb, type AttachTooltipValue as bc, type DataTooltipCallback as bd, type DataTooltipValue as be, tooltip as bf, Tooltip as bg, type TooltipCallback as bh, type TooltipOptions as bi, type LatLngValue as c, type Event as d, type EventListenerOptions as e, type EventConfig as f, Layer as g, type PointValue as h, type IconValue as i, type SvgSymbolValue as j, type EventCallback as k, type SizeValue as l, type EventListenerData as m, type DataFeatureValue as n, dataLayer as o, DataLayer as p, type DataLayerEventCallback as q, type DataLayerEventObject as r, type DataLayerOptions as s, type DataLayerValue as t, type DataStyleOptions as u, type DataStyleValue as v, type FeatureOptions as w, type LoadOptions as x, icon as y, type IconOptions as z };
