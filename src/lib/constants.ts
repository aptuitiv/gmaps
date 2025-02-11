/* ===========================================================================
    Replications of Google Maps constants so that they are available to a
    developer even if they don't have the Google Maps library loaded.

    The values come from node_modules/@types/google.maps/index.d.ts

    Object.freeze() is a method to simulate enum values. It is used to freeze an object, which means that after
    the object is frozen, no changes can be made to it. It is a way to make sure that the object will not be
    changed in the future.
=========================================================================== */

/* global google */

/**
 * Events that can be fired by the Autocomplete search box.
 *
 * https://aptuitiv.github.io/gmaps-docs/api-reference/autocomplete-search-box#events
 */
export const AutocompleteSearchBoxEvents = Object.freeze({
    // Called when the user selects a Place.
    PLACE_CHANGED: 'place_changed',
});

/**
 * Identifiers used to specify the placement of controls on the map.
 * See https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
 */
export const ControlPosition = Object.freeze({
    /**
     * Equivalent to BOTTOM_CENTER in both LTR and RTL.
     */
    BLOCK_END_INLINE_CENTER: '0.0',
    /**
     * Equivalent to BOTTOM_RIGHT in LTR, or BOTTOM_LEFT in RTL.
     */
    BLOCK_END_INLINE_END: '1.0',
    /**
     * Equivalent to BOTTOM_LEFT in LTR, or BOTTOM_RIGHT in RTL.
     */
    BLOCK_END_INLINE_START: '2.0',
    /**
     * Equivalent to TOP_CENTER in both LTR and RTL.
     */
    BLOCK_START_INLINE_CENTER: '3.0',
    /**
     * Equivalent to TOP_RIGHT in LTR, or TOP_LEFT in RTL.
     */
    BLOCK_START_INLINE_END: '4.0',
    /**
     * Equivalent to TOP_LEFT in LTR, or TOP_RIGHT in RTL.
     */
    BLOCK_START_INLINE_START: '5.0',
    /**
     * Elements are positioned in the center of the bottom row. Consider using
     * BLOCK_END_INLINE_CENTER instead.
     */
    BOTTOM_CENTER: '6.0',
    /**
     * Elements are positioned in the bottom left and flow towards the middle.
     * Elements are positioned to the right of the Google logo. Consider using
     * BLOCK_END_INLINE_START instead.
     */
    BOTTOM_LEFT: '7.0',
    /**
     * Elements are positioned in the bottom right and flow towards the middle.
     * Elements are positioned to the left of the copyrights. Consider using
     * BLOCK_END_INLINE_END instead.
     */
    BOTTOM_RIGHT: '8.0',
    /**
     * Equivalent to RIGHT_CENTER in LTR, or LEFT_CENTER in RTL.
     */
    INLINE_END_BLOCK_CENTER: '9.0',
    /**
     * Equivalent to RIGHT_BOTTOM in LTR, or LEFT_BOTTOM in RTL.
     */
    INLINE_END_BLOCK_END: '10.0',
    /**
     * Equivalent to RIGHT_TOP in LTR, or LEFT_TOP in RTL.
     */
    INLINE_END_BLOCK_START: '11.0',
    /**
     * Equivalent to LEFT_CENTER in LTR, or RIGHT_CENTER in RTL.
     */
    INLINE_START_BLOCK_CENTER: '12.0',
    /**
     * Equivalent to LEFT_BOTTOM in LTR, or RIGHT_BOTTOM in RTL.
     */
    INLINE_START_BLOCK_END: '13.0',
    /**
     * Equivalent to LEFT_TOP in LTR, or RIGHT_TOP in RTL.
     */
    INLINE_START_BLOCK_START: '14.0',
    /**
     * Elements are positioned on the left, above bottom-left elements, and flow
     * upwards. Consider using INLINE_START_BLOCK_END instead.
     */
    LEFT_BOTTOM: '15.0',
    /**
     * Elements are positioned in the center of the left side. Consider using
     * INLINE_START_BLOCK_CENTER instead.
     */
    LEFT_CENTER: '16.0',
    /**
     * Elements are positioned on the left, below top-left elements, and flow
     * downwards. Consider using INLINE_START_BLOCK_START instead.
     */
    LEFT_TOP: '17.0',
    /**
     * Elements are positioned on the right, above bottom-right elements, and
     * flow upwards. Consider using INLINE_END_BLOCK_END instead.
     */
    RIGHT_BOTTOM: '18.0',
    /**
     * Elements are positioned in the center of the right side. Consider using
     * INLINE_END_BLOCK_CENTER instead.
     */
    RIGHT_CENTER: '19.0',
    /**
     * Elements are positioned on the right, below top-right elements, and flow
     * downwards. Consider using INLINE_END_BLOCK_START instead.
     */
    RIGHT_TOP: '20.0',
    /**
     * Elements are positioned in the center of the top row. Consider using
     * BLOCK_START_INLINE_CENTER instead.
     */
    TOP_CENTER: '21.0',
    /**
     * Elements are positioned in the top left and flow towards the middle.
     * Consider using BLOCK_START_INLINE_START instead.
     */
    TOP_LEFT: '22.0',
    /**
     * Elements are positioned in the top right and flow towards the middle.
     * Consider using BLOCK_START_INLINE_END instead.
     */
    TOP_RIGHT: '23.0',
});

// Type for the ControlPosition values
export type ControlPositionValue = (typeof ControlPosition)[keyof typeof ControlPosition];

/**
 * Converts a ControlPosition string value to a google.maps.ControlPosition value.
 *
 * This is only necessary because the Google Maps API uses a float value for the
 * ControlPosition.
 *
 * @param {string} value The ControlPosition value to convert
 * @returns {google.maps.ControlPosition}
 */
export const convertControlPosition = (value: string): google.maps.ControlPosition => {
    let returnValue = google.maps.ControlPosition.BLOCK_START_INLINE_START;
    Object.entries(ControlPosition).forEach((item) => {
        if (item[1] === value) {
            returnValue = google.maps.ControlPosition[item[0]];
        }
    });
    return returnValue;
};

/**
 * Error status value for the Geocode object.
 *
 * https://developers.google.com/maps/documentation/javascript/reference/3.56/geocoder?hl=en#GeocoderStatus
 */
export const GeocoderErrorStatus = Object.freeze({
    ERROR: 'ERROR',
    INVALID_REQUEST: 'INVALID_REQUEST',
    OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
    REQUEST_DENIED: 'REQUEST_DENIED',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
});

// Type for the GeocoderErrorStatus values
export type GeocoderErrorStatusValue = (typeof GeocoderErrorStatus)[keyof typeof GeocoderErrorStatus];

/**
 * The type of location returned by the Geocoder.
 *
 * https://developers.google.com/maps/documentation/javascript/reference/3.56/geocoder?hl=en#GeocoderLocationType
 */
export const GeocoderLocationType = Object.freeze({
    APPROXIMATE: 'APPROXIMATE',
    GEOMETRIC_CENTER: 'GEOMETRIC_CENTER',
    RANGE_INTERPOLATED: 'RANGE_INTERPOLATED',
    ROOFTOP: 'ROOFTOP',
});

// Type for the GeocoderLocationType values
export type GeocoderLocationTypeValue = (typeof GeocoderLocationType)[keyof typeof GeocoderLocationType];

/**
 * Events that can be fired by the Loader.
 *
 * https://aptuitiv.github.io/gmaps-docs/api-reference/loader#events
 */
export const LoaderEvents = Object.freeze({
    // The API library is loaded.
    LOAD: 'load',
    // The API library is loaded and the map is loaded and visible.
    MAP_LOAD: 'map_load',
});

/**
 * Events that can be fired by the Map.
 *
 * This includes references to Google Maps events https://developers.google.com/maps/documentation/javascript/reference/map#Map-Events
 * and this library's custom events.
 */
export const MapEvents = Object.freeze({
    // Google Maps events
    // https://developers.google.com/maps/documentation/javascript/reference/map#Map-Events
    BOUNDS_CHANGED: 'bounds_changed',
    CENTER_CHANGED: 'center_changed',
    CLICK: 'click',
    CONTEXT_MENU: 'contextmenu',
    DBLCLICK: 'dblclick',
    DRAG: 'drag',
    DRAG_END: 'dragend',
    DRAG_START: 'dragstart',
    HEADING_CHANGED: 'heading_changed',
    IDLE: 'idle',
    IS_FRACTIONAL_ZOOM_ENABLED_CHANGED: 'isfractionalzoomenabled_changed',
    MAP_CAPABILITIES_CHANGED: 'mapcapabilities_changed',
    MAP_TYPE_ID_CHANGED: 'maptypeid_changed',
    MOUSE_MOVE: 'mousemove',
    MOUSE_OUT: 'mouseout',
    MOUSE_OVER: 'mouseover',
    PROJECTION_CHANGED: 'projection_changed',
    RENDERING_TYPE_CHANGED: 'renderingtype_changed',
    TILES_LOADED: 'tilesloaded',
    TILT_CHANGED: 'tilt_changed',
    ZOOM_CHANGED: 'zoom_changed',

    // Custom events for this library
    // https://aptuitiv.github.io/gmaps-docs/api-reference/map#events

    // There was an error getting the user's location.
    LOCATION_ERROR: 'locationerror',
    // The user's location has been found.
    LOCATION_FOUND: 'locationfound',
    // The map is loaded, visible, and ready for use.
    READY: 'ready',
});

/**
 * Style values for common MapTypesControls.
 *
 * https://developers.google.com/maps/documentation/javascript/reference/control#MapTypeControlStyle
 */
export const MapTypeControlStyle = Object.freeze({
    /**
     * Uses the default map type control. When the <code>DEFAULT</code> control
     * is shown, it will vary according to window size and other factors. The
     * <code>DEFAULT</code> control may change in future versions of the API.
     */
    DEFAULT: '0.0',
    /**
     * A dropdown menu for the screen realestate conscious.
     */
    DROPDOWN_MENU: '1.0',
    /**
     * The standard horizontal radio buttons bar.
     */
    HORIZONTAL_BAR: '2.0',
});

// Type for the MapTypeControlStyle values
export type MapTypeControlStyleValue = (typeof MapTypeControlStyle)[keyof typeof MapTypeControlStyle];

/**
 * Converts a MapTypeControlStyle string value to a google.maps.ControlPosition value.
 *
 * This is only necessary because the Google Maps API uses a float value for the
 * MapTypeControlStyle.
 *
 * @param {string} value The MapTypeControlStyle value to convert
 * @returns {google.maps.ControlPosition}
 */
export const convertMapTypeControlStyle = (value: string): google.maps.MapTypeControlStyle => {
    let returnValue = google.maps.MapTypeControlStyle.DEFAULT;
    Object.entries(MapTypeControlStyle).forEach((item) => {
        if (item[1] === value) {
            returnValue = google.maps.MapTypeControlStyle[item[0]];
        }
    });
    return returnValue;
};

/**
 * Identifiers for common MapTypes.
 *
 * https://developers.google.com/maps/documentation/javascript/reference/map#MapTypeId
 */
export const MapTypeId = Object.freeze({
    /**
     * This map type displays a transparent layer of major streets on satellite
     * images.
     */
    HYBRID: 'hybrid',
    /**
     * This map type displays a normal street map.
     */
    ROADMAP: 'roadmap',
    /**
     * This map type displays satellite images.
     */
    SATELLITE: 'satellite',
    /**
     * This map type displays maps with physical features such as terrain and
     * vegetation.
     */
    TERRAIN: 'terrain',
});

// Type for the MapTypeId values
export type MapTypeIdValue = (typeof MapTypeId)[keyof typeof MapTypeId];

/**
 * Events that can be fired by the Marker.
 *
 * This includes references to Google Maps marker events https://developers.google.com/maps/documentation/javascript/reference/marker#Marker-Events
 * and this library's custom events.
 */
export const MarkerEvents = Object.freeze({
    // Google Maps events
    // https://developers.google.com/maps/documentation/javascript/reference/marker#Marker-Events
    ANIMATION_CHANGED: 'animation_changed',
    CLICK: 'click',
    CLICKABLE_CHANGED: 'clickable_changed',
    CONTEXT_MENU: 'contextmenu',
    CURSOR_CHANGED: 'cursor_changed',
    DBLCLICK: 'dblclick',
    DRAG: 'drag',
    DRAG_END: 'dragend',
    DRAGGABLE_CHANGED: 'draggable_changed',
    DRAG_START: 'dragstart',
    FLAT_CHANGED: 'flat_changed',
    ICON_CHANGED: 'icon_changed',
    MOUSE_DOWN: 'mousedown',
    MOUSE_OUT: 'mouseout',
    MOUSE_OVER: 'mouseover',
    MOUSE_UP: 'mouseup',
    POSITION_CHANGED: 'position_changed',
    SHAPE_CHANGED: 'shape_changed',
    TITLE_CHANGED: 'title_changed',
    VISIBLE_CHANGED: 'visible_changed',
    ZINDEX_CHANGED: 'zindex_changed',

    // Custom events for this library
    // https://aptuitiv.github.io/gmaps-docs/api-reference/marker#events

    // The marker is loaded and ready for use.
    READY: 'ready',
});

/**
 * Events that can be fired by the PlacesSearchBox.
 */
export const PlacesSearchBoxEvents = Object.freeze({
    // Called when the user selects a Place.
    PLACES_CHANGED: 'places_changed',
});

/**
 * The rendering type of the map.
 *
 * https://developers.google.com/maps/documentation/javascript/reference/map#RenderingType
 */
export const RenderingType = Object.freeze({
    // 	Indicates that the map is a raster map.
    RASTER: 'RASTER',
    // Indicates that it is unknown yet whether the map is vector or raster, because the map has not finished initializing yet.
    UNINITIALIZED: 'UNINITIALIZED',
    // Indicates that the map is a vector map.
    VECTOR: 'VECTOR',
});

// Type for the RenderingType values
export type RenderingTypeValue = (typeof RenderingType)[keyof typeof RenderingType];

/**
 * Street view sources
 * https://developers.google.com/maps/documentation/javascript/reference/street-view-service#StreetViewSource
 */
export const StreetViewSource = Object.freeze({
    // Uses the default sources of Street View, searches will not be limited to
    // specific sources.
    DEFAULT: 'default',
    // Limits Street View searches to official Google collections.
    GOOGLE: 'google',
    // Limits Street View searches to outdoor collections. Indoor collections
    // are not included in search results. According to Google's documentation,
    // this is not supported.
    OUTDOOR: 'outdoor',
});

// Type for the StreetViewSource values
export type StreetViewSourceValue = (typeof StreetViewSource)[keyof typeof StreetViewSource];
