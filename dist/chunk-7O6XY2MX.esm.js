// src/lib/Base.ts
var Base = class {
  /**
   * Holds the object type
   *
   * @private
   * @type {string}
   */
  #objectType;
  /**
   * Constructor
   *
   * @param {string} objectType The object type for the class
   */
  constructor(objectType) {
    this.#objectType = objectType;
  }
  /**
   * Returns the object type
   *
   * @returns {string}
   */
  getObjectType() {
    return this.#objectType;
  }
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
  static include(mixin) {
    Object.defineProperties(this.prototype, Object.getOwnPropertyDescriptors(mixin));
  }
  /**
   * Returns if the object is an Icon object
   *
   * @returns {boolean}
   */
  isIcon() {
    return this.getObjectType() === "icon";
  }
  /**
   * Returns if the object is an InfoWindow object
   *
   * @returns {boolean}
   */
  isInfoWindow() {
    return this.getObjectType() === "infowindow";
  }
  /**
   * Returns if the object is an LatLng object
   *
   * @returns {boolean}
   */
  isLatLng() {
    return this.getObjectType() === "latlng";
  }
  /**
   * Returns if the object is an LatLngBounds object
   *
   * @returns {boolean}
   */
  isLatLngBounds() {
    return this.getObjectType() === "latlngbounds";
  }
  /**
   * Returns if the object is a Map object
   *
   * @returns {boolean}
   */
  isMap() {
    return this.getObjectType() === "map";
  }
  /**
   * Returns if the object is a Marker object
   *
   * @returns {boolean}
   */
  isMarker() {
    return this.getObjectType() === "marker";
  }
  /**
   * Returns if the object is a MarkerCluster object
   *
   * @returns {boolean}
   */
  isMarkerCluster() {
    return this.getObjectType() === "markercluster";
  }
  /**
   * Returns if the object is a Point object
   *
   * @returns {boolean}
   */
  isPoint() {
    return this.getObjectType() === "point";
  }
  /**
   * Returns if the object is a Polyline object
   *
   * @returns {boolean}
   */
  isPolyline() {
    return this.getObjectType() === "polyline";
  }
  /**
   * Returns if the object is a Popup object
   *
   * @returns {boolean}
   */
  isPopup() {
    return this.getObjectType() === "popup";
  }
  /**
   * Returns if the object is a Size object
   *
   * @returns {boolean}
   */
  isSize() {
    return this.getObjectType() === "size";
  }
  /**
   * Returns if the object is a SvgSymbol object
   *
   * @returns {boolean}
   */
  isSvgSymbol() {
    return this.getObjectType() === "svgsymbol";
  }
};
var Base_default = Base;

// src/lib/constants.ts
var READY_EVENT = "ready";
var INTERNAL_EVENTS = Object.freeze([
  READY_EVENT,
  "locationfound",
  "locationerror",
  "initialized"
]);
var AutocompleteSearchBoxEvents = Object.freeze({
  // Called when the user selects a Place.
  PLACE_CHANGED: "place_changed"
});
var ControlPosition = Object.freeze({
  /**
   * Equivalent to BOTTOM_CENTER in both LTR and RTL.
   */
  BLOCK_END_INLINE_CENTER: "0.0",
  /**
   * Equivalent to BOTTOM_RIGHT in LTR, or BOTTOM_LEFT in RTL.
   */
  BLOCK_END_INLINE_END: "1.0",
  /**
   * Equivalent to BOTTOM_LEFT in LTR, or BOTTOM_RIGHT in RTL.
   */
  BLOCK_END_INLINE_START: "2.0",
  /**
   * Equivalent to TOP_CENTER in both LTR and RTL.
   */
  BLOCK_START_INLINE_CENTER: "3.0",
  /**
   * Equivalent to TOP_RIGHT in LTR, or TOP_LEFT in RTL.
   */
  BLOCK_START_INLINE_END: "4.0",
  /**
   * Equivalent to TOP_LEFT in LTR, or TOP_RIGHT in RTL.
   */
  BLOCK_START_INLINE_START: "5.0",
  /**
   * Elements are positioned in the center of the bottom row. Consider using
   * BLOCK_END_INLINE_CENTER instead.
   */
  BOTTOM_CENTER: "6.0",
  /**
   * Elements are positioned in the bottom left and flow towards the middle.
   * Elements are positioned to the right of the Google logo. Consider using
   * BLOCK_END_INLINE_START instead.
   */
  BOTTOM_LEFT: "7.0",
  /**
   * Elements are positioned in the bottom right and flow towards the middle.
   * Elements are positioned to the left of the copyrights. Consider using
   * BLOCK_END_INLINE_END instead.
   */
  BOTTOM_RIGHT: "8.0",
  /**
   * Equivalent to RIGHT_CENTER in LTR, or LEFT_CENTER in RTL.
   */
  INLINE_END_BLOCK_CENTER: "9.0",
  /**
   * Equivalent to RIGHT_BOTTOM in LTR, or LEFT_BOTTOM in RTL.
   */
  INLINE_END_BLOCK_END: "10.0",
  /**
   * Equivalent to RIGHT_TOP in LTR, or LEFT_TOP in RTL.
   */
  INLINE_END_BLOCK_START: "11.0",
  /**
   * Equivalent to LEFT_CENTER in LTR, or RIGHT_CENTER in RTL.
   */
  INLINE_START_BLOCK_CENTER: "12.0",
  /**
   * Equivalent to LEFT_BOTTOM in LTR, or RIGHT_BOTTOM in RTL.
   */
  INLINE_START_BLOCK_END: "13.0",
  /**
   * Equivalent to LEFT_TOP in LTR, or RIGHT_TOP in RTL.
   */
  INLINE_START_BLOCK_START: "14.0",
  /**
   * Elements are positioned on the left, above bottom-left elements, and flow
   * upwards. Consider using INLINE_START_BLOCK_END instead.
   */
  LEFT_BOTTOM: "15.0",
  /**
   * Elements are positioned in the center of the left side. Consider using
   * INLINE_START_BLOCK_CENTER instead.
   */
  LEFT_CENTER: "16.0",
  /**
   * Elements are positioned on the left, below top-left elements, and flow
   * downwards. Consider using INLINE_START_BLOCK_START instead.
   */
  LEFT_TOP: "17.0",
  /**
   * Elements are positioned on the right, above bottom-right elements, and
   * flow upwards. Consider using INLINE_END_BLOCK_END instead.
   */
  RIGHT_BOTTOM: "18.0",
  /**
   * Elements are positioned in the center of the right side. Consider using
   * INLINE_END_BLOCK_CENTER instead.
   */
  RIGHT_CENTER: "19.0",
  /**
   * Elements are positioned on the right, below top-right elements, and flow
   * downwards. Consider using INLINE_END_BLOCK_START instead.
   */
  RIGHT_TOP: "20.0",
  /**
   * Elements are positioned in the center of the top row. Consider using
   * BLOCK_START_INLINE_CENTER instead.
   */
  TOP_CENTER: "21.0",
  /**
   * Elements are positioned in the top left and flow towards the middle.
   * Consider using BLOCK_START_INLINE_START instead.
   */
  TOP_LEFT: "22.0",
  /**
   * Elements are positioned in the top right and flow towards the middle.
   * Consider using BLOCK_START_INLINE_END instead.
   */
  TOP_RIGHT: "23.0"
});
var convertControlPosition = (value) => {
  let returnValue = google.maps.ControlPosition.BLOCK_START_INLINE_START;
  Object.entries(ControlPosition).forEach((item) => {
    if (item[1] === value) {
      returnValue = google.maps.ControlPosition[item[0]];
    }
  });
  return returnValue;
};
var DataLayerEvents = Object.freeze({
  // Google Maps events
  // https://developers.google.com/maps/documentation/javascript/reference/data#Data-Events
  ADD_FEATURE: "addfeature",
  CLICK: "click",
  CONTEXT_MENU: "contextmenu",
  DBLCLICK: "dblclick",
  MOUSE_DOWN: "mousedown",
  MOUSE_OUT: "mouseout",
  MOUSE_OVER: "mouseover",
  MOUSE_UP: "mouseup",
  REMOVE_FEATURE: "removefeature",
  REMOVE_PROPERTY: "removeproperty",
  RIGHT_CLICK: "rightclick",
  SET_GEOMETRY: "setgeometry",
  SET_PROPERTY: "setproperty",
  // Custom events for this library
  // Called when the data layer is ready
  READY: READY_EVENT,
  // Called when a loadGeoJson() or addGeoJson() call has finished loading its features
  LOAD: "load"
});
var GeometryType = Object.freeze({
  GEOMETRY_COLLECTION: "GeometryCollection",
  LINE_STRING: "LineString",
  LINEAR_RING: "LinearRing",
  MULTI_LINE_STRING: "MultiLineString",
  MULTI_POINT: "MultiPoint",
  MULTI_POLYGON: "MultiPolygon",
  POINT: "Point",
  POLYGON: "Polygon"
});
var GeocoderErrorStatus = Object.freeze({
  ERROR: "ERROR",
  INVALID_REQUEST: "INVALID_REQUEST",
  OVER_QUERY_LIMIT: "OVER_QUERY_LIMIT",
  REQUEST_DENIED: "REQUEST_DENIED",
  UNKNOWN_ERROR: "UNKNOWN_ERROR"
});
var GeocoderLocationType = Object.freeze({
  APPROXIMATE: "APPROXIMATE",
  GEOMETRIC_CENTER: "GEOMETRIC_CENTER",
  RANGE_INTERPOLATED: "RANGE_INTERPOLATED",
  ROOFTOP: "ROOFTOP"
});
var ImageOverlayEvents = Object.freeze({
  // Called when the overlay is starting to be rotated
  ROTATE_START: "rotatestart",
  // Called when the overlay is rotated
  ROTATE: "rotate",
  // Called when the overlay is done being rotated
  ROTATE_END: "rotateend"
});
var InfoWindowEvents = Object.freeze({
  // Google Maps events
  // https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow-Events
  CLOSE: "close",
  CLOSECLICK: "closeclick",
  CONTENT_CHANGED: "content_changed",
  DOMREADY: "domready",
  HEADER_CONTENT_CHANGED: "headercontent_changed",
  HEADER_DISABLED_CHANGED: "headerdisabled_changed",
  POSITION_CHANGED: "position_changed",
  VISIBLE: "visible",
  ZINDEX_CHANGED: "zindex_changed",
  // Custom events for this library
  // Called when the info window is ready
  READY: READY_EVENT
});
var LayerEvents = Object.freeze({
  // Called when the layer is ready
  READY: READY_EVENT
});
var LoaderEvents = Object.freeze({
  // The API library is loaded.
  LOAD: "load",
  // The API library is loaded and the map is loaded and visible.
  MAP_LOAD: "map_load"
});
var MapEvents = Object.freeze({
  // Google Maps events
  // https://developers.google.com/maps/documentation/javascript/reference/map#Map-Events
  BOUNDS_CHANGED: "bounds_changed",
  CENTER_CHANGED: "center_changed",
  CLICK: "click",
  CONTEXT_MENU: "contextmenu",
  DBLCLICK: "dblclick",
  DRAG: "drag",
  DRAG_END: "dragend",
  DRAG_START: "dragstart",
  HEADING_CHANGED: "heading_changed",
  IDLE: "idle",
  IS_FRACTIONAL_ZOOM_ENABLED_CHANGED: "isfractionalzoomenabled_changed",
  MAP_CAPABILITIES_CHANGED: "mapcapabilities_changed",
  MAP_TYPE_ID_CHANGED: "maptypeid_changed",
  MOUSE_MOVE: "mousemove",
  MOUSE_OUT: "mouseout",
  MOUSE_OVER: "mouseover",
  PROJECTION_CHANGED: "projection_changed",
  RENDERING_TYPE_CHANGED: "renderingtype_changed",
  TILES_LOADED: "tilesloaded",
  TILT_CHANGED: "tilt_changed",
  ZOOM_CHANGED: "zoom_changed",
  // Custom events for this library
  // https://aptuitiv.github.io/gmaps/api-reference/map#events
  // There was an error getting the user's location.
  LOCATION_ERROR: "locationerror",
  // The user's location has been found.
  LOCATION_FOUND: "locationfound",
  // The map is loaded, visible, and ready for use.
  READY: READY_EVENT
});
var MapTypeControlStyle = Object.freeze({
  /**
   * Uses the default map type control. When the <code>DEFAULT</code> control
   * is shown, it will vary according to window size and other factors. The
   * <code>DEFAULT</code> control may change in future versions of the API.
   */
  DEFAULT: "0.0",
  /**
   * A dropdown menu for the screen realestate conscious.
   */
  DROPDOWN_MENU: "1.0",
  /**
   * The standard horizontal radio buttons bar.
   */
  HORIZONTAL_BAR: "2.0"
});
var convertMapTypeControlStyle = (value) => {
  let returnValue = google.maps.MapTypeControlStyle.DEFAULT;
  Object.entries(MapTypeControlStyle).forEach((item) => {
    if (item[1] === value) {
      returnValue = google.maps.MapTypeControlStyle[item[0]];
    }
  });
  return returnValue;
};
var MapTypeId = Object.freeze({
  /**
   * This map type displays a transparent layer of major streets on satellite
   * images.
   */
  HYBRID: "hybrid",
  /**
   * This map type displays a normal street map.
   */
  ROADMAP: "roadmap",
  /**
   * This map type displays satellite images.
   */
  SATELLITE: "satellite",
  /**
   * This map type displays maps with physical features such as terrain and
   * vegetation.
   */
  TERRAIN: "terrain"
});
var MarkerEvents = Object.freeze({
  // Google Maps events
  // https://developers.google.com/maps/documentation/javascript/reference/marker#Marker-Events
  ANIMATION_CHANGED: "animation_changed",
  CLICK: "click",
  CLICKABLE_CHANGED: "clickable_changed",
  CONTEXT_MENU: "contextmenu",
  CURSOR_CHANGED: "cursor_changed",
  DBLCLICK: "dblclick",
  DRAG: "drag",
  DRAG_END: "dragend",
  DRAGGABLE_CHANGED: "draggable_changed",
  DRAG_START: "dragstart",
  FLAT_CHANGED: "flat_changed",
  ICON_CHANGED: "icon_changed",
  MOUSE_DOWN: "mousedown",
  MOUSE_OUT: "mouseout",
  MOUSE_OVER: "mouseover",
  MOUSE_UP: "mouseup",
  POSITION_CHANGED: "position_changed",
  SHAPE_CHANGED: "shape_changed",
  TITLE_CHANGED: "title_changed",
  VISIBLE_CHANGED: "visible_changed",
  ZINDEX_CHANGED: "zindex_changed",
  // Custom events for this library
  // https://aptuitiv.github.io/gmaps/api-reference/marker#events
  // The marker is loaded and ready for use.
  READY: READY_EVENT
});
var OverlayEvents = Object.freeze({
  // Called when the overlay is starting to be dragged
  DRAG_START: "dragstart",
  // Called when the overlay is dragged
  DRAG: "drag",
  // Called when the overlay drag status changes
  DRAGGABLE_CHANGED: "draggable_changed",
  // Called when the overlay is done being dragged
  DRAG_END: "dragend",
  // Called when the overlay opens
  OPEN: "open",
  // Called when the overlay is starting to be resized
  RESIZE_START: "resizestart",
  // Called when the overlay is resized
  RESIZE: "resize",
  // Called when the overlay is done being resized
  RESIZE_END: "resizeend"
});
var PlacesSearchBoxEvents = Object.freeze({
  // Called when the user selects a Place.
  PLACES_CHANGED: "places_changed"
});
var PolylineEvents = Object.freeze({
  // Google Maps events
  // https://developers.google.com/maps/documentation/javascript/reference/polygon#Polyline-Events
  CLICK: "click",
  CONTEXT_MENU: "contextmenu",
  DBLCLICK: "dblclick",
  DRAG: "drag",
  DRAG_END: "dragend",
  DRAG_START: "dragstart",
  MOUSE_DOWN: "mousedown",
  MOUSE_MOVE: "mousemove",
  MOUSE_OUT: "mouseout",
  MOUSE_OVER: "mouseover",
  MOUSE_UP: "mouseup",
  // Custom events for this library
  // Called when the polyline is ready
  READY: READY_EVENT
});
var PopupEvents = Object.freeze({
  // Called when the popup opens
  OPEN: "open"
});
var RenderingType = Object.freeze({
  // 	Indicates that the map is a raster map.
  RASTER: "RASTER",
  // Indicates that it is unknown yet whether the map is vector or raster, because the map has not finished initializing yet.
  UNINITIALIZED: "UNINITIALIZED",
  // Indicates that the map is a vector map.
  VECTOR: "VECTOR"
});
var StreetViewSource = Object.freeze({
  // Uses the default sources of Street View, searches will not be limited to
  // specific sources.
  DEFAULT: "default",
  // Limits Street View searches to official Google collections.
  GOOGLE: "google",
  // Limits Street View searches to outdoor collections. Indoor collections
  // are not included in search results. According to Google's documentation,
  // this is not supported.
  OUTDOOR: "outdoor"
});
var SymbolPath = Object.freeze({
  // A backward-pointing closed arrow.
  BACKWARD_CLOSED_ARROW: "BACKWARD_CLOSED_ARROW",
  // A backward-pointing open arrow.
  BACKWARD_OPEN_ARROW: "BACKWARD_OPEN_ARROW",
  // A circle with a radius of 1.
  CIRCLE: "CIRCLE",
  // A forward-pointing closed arrow.
  FORWARD_CLOSED_ARROW: "FORWARD_CLOSED_ARROW",
  // A forward-pointing open arrow.
  FORWARD_OPEN_ARROW: "FORWARD_OPEN_ARROW"
});
var convertSymbolPath = (value) => {
  let returnValue = "";
  Object.entries(SymbolPath).forEach((item) => {
    if (item[1] === value) {
      returnValue = String(google.maps.SymbolPath[item[0]]);
    }
  });
  return returnValue;
};

// src/lib/helpers.ts
var isBoolean = (thing) => typeof thing === "boolean";
var isDefined = (thing) => typeof thing !== "undefined";
var isFunction = (thing) => typeof thing === "function";
var isNull = (thing) => thing === null;
var isNumber = (thing) => !Number.isNaN(thing) && typeof thing === "number" && thing !== Infinity;
var isNumberString = (thing) => typeof thing === "string" && !Number.isNaN(Number(thing)) && thing !== "Infinity";
var isNumberOrNumberString = (thing) => isNumber(thing) || isNumberString(thing);
var isString = (thing) => typeof thing === "string";
var isStringWithValue = (thing) => isString(thing) && thing.trim().length > 0;
var isStringOrNumber = (thing) => isStringWithValue(thing) || isNumber(thing);
var isUndefined = (thing) => thing === void 0 || typeof thing === "undefined";
var isNullOrUndefined = (thing) => isNull(thing) || isUndefined(thing);
var getNumber = (thing) => {
  if (isNumber(thing)) {
    return thing;
  }
  if (isNumberString(thing)) {
    return Number(thing);
  }
  return NaN;
};
var getBoolean = (thing) => {
  if (typeof thing === "boolean") {
    return thing;
  }
  if (typeof thing === "string") {
    const val = thing.toLowerCase();
    if (val === "true" || val === "yes" || val === "1") {
      return true;
    }
  }
  if (isNumber(thing)) {
    return thing === 1;
  }
  return false;
};
var isObject = (thing) => (
  // The typeof test costs almost nothing and rules out every primitive, which is most of what
  // this is called with - option arguments that weren't passed, strings, numbers, functions.
  // Only a value that could actually be an object reaches the slower toString call.
  //
  // The answers are exactly the same as before. Arrays, null, Date, Map and Set are all still
  // not objects by this test, which a plain typeof check would have got wrong.
  typeof thing === "object" && thing !== null && Object.prototype.toString.call(thing) === "[object Object]"
);
var isObjectWithValues = (thing) => (
  // Reuses isObject so that the cheap typeof test runs first and the keys are only listed for
  // something that is actually an object
  isObject(thing) && Object.keys(thing).length > 0
);
var isPromise = (thing) => !!thing && isFunction(thing.then);
var getPixelsFromLatLng = (map2, position) => {
  const projection = map2.getProjection();
  const bounds = map2.getBounds();
  const zoom = map2.getZoom();
  if (!projection || !bounds || typeof zoom === "undefined") {
    throw new Error("The map must be initialized before getting the pixel location.");
  }
  const topRight = projection.fromLatLngToPoint(bounds.getNorthEast());
  const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest());
  const worldPoint = projection.fromLatLngToPoint(position);
  if (!topRight || !bottomLeft || !worldPoint) {
    throw new Error("Unable to get the pixel location from the map projection.");
  }
  const scale = 2 ** zoom;
  return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
};
var checkForGoogleMaps = (object, library, throwError) => {
  let passed = false;
  const doError = typeof throwError === "boolean" ? throwError : true;
  if (typeof google !== "undefined" && isObject(google) && isObject(google.maps)) {
    if (library) {
      passed = typeof google.maps[library] !== "undefined";
    } else {
      passed = true;
    }
  }
  if (!passed) {
    let msg = "The Google Maps Javascript API library must be loaded.";
    if (library) {
      msg = ` The google.maps.${library} class is not available. Did you load the Google Maps Javascript API?`;
    }
    msg += ` You must wait to run the ${object} code until the Google map library is loaded.`;
    msg += " See https://aptuitiv.github.io/gmaps/guides/load for more information.";
    if (doError) {
      throw new Error(msg);
    }
  }
  return passed;
};
var getSizeWithUnit = (value, defaultUnit = "px", allowedUnits = ["%", "px"], allowNegative = false) => {
  let returnValue = false;
  if (isNumber(value)) {
    if (value >= 0) {
      returnValue = `${value}${defaultUnit}`;
    }
  } else if (isNumberString(value)) {
    const val = Number(value);
    if (allowNegative || val >= 0) {
      returnValue = `${val}${defaultUnit}`;
    }
  } else if (isStringWithValue(value)) {
    let pass = false;
    for (const unit of allowedUnits) {
      if (value.endsWith(unit)) {
        pass = true;
        break;
      }
    }
    if (pass) {
      const val = parseFloat(value);
      if (val >= 0) {
        returnValue = value;
      }
    }
  }
  return returnValue;
};
var objectEquals = (a, b) => {
  if (a === b) {
    return true;
  }
  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }
  if (!a || !b || typeof a !== "object" && typeof b !== "object") {
    return a === b;
  }
  if (a === null || a === void 0 || b === null || b === void 0) {
    return false;
  }
  if (a.prototype !== b.prototype) {
    return false;
  }
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) {
    return false;
  }
  return keys.every((k) => objectEquals(a[k], b[k]));
};
var objectHasValue = (obj, key) => isObject(obj) && key in obj;
var renderTemplate = (template, getValue) => template.replace(/\{\s*([^{}\s]+)\s*\}/g, (match, key) => {
  const value = getValue(key);
  return isNullOrUndefined(value) ? "" : String(value);
});
var callCallback = (callback, ...args) => {
  if (isFunction(callback)) {
    callback(...args);
  }
};
var calculateDimensions = (aspectRatio, width, height) => {
  let newWidth = width;
  let newHeight = height;
  if (aspectRatio > 0) {
    const widthBasedHeight = width / aspectRatio;
    const heightBasedWidth = height * aspectRatio;
    if (widthBasedHeight <= height) {
      newHeight = widthBasedHeight;
    } else {
      newWidth = heightBasedWidth;
    }
  }
  return {
    width: newWidth,
    height: newHeight
  };
};

// src/lib/LatLng.ts
var LatLng = class _LatLng extends Base_default {
  /**
   * Holds the Google maps LatLng object.
   *
   * This is created the first time that toGoogle() is called.
   *
   * @private
   * @type {google.maps.LatLng|undefined}
   */
  #latLngObject;
  /**
   * Holds the latitude.
   *
   * This is undefined until a valid latitude value is set.
   *
   * @private
   * @type {number|undefined}
   */
  #latitude;
  /**
   * Holds the longitude.
   *
   * This is undefined until a valid longitude value is set.
   *
   * @private
   * @type {number|undefined}
   */
  #longitude;
  /**
   * Constructor
   *
   * @param {Latitude|LatLng|google.maps.LatLng} latitude The latitude value or the latitude/longitude pair
   * @param {number|string} [longitude] The longitude value
   */
  constructor(latitude, longitude) {
    super("latlng");
    if (isNumber(latitude) && isNumber(longitude)) {
      this.#latitude = latitude;
      this.#longitude = longitude;
    } else if (typeof latitude !== "undefined") {
      this.set(latitude, longitude);
    }
  }
  /**
   * Get the latitude value
   *
   * @returns {number}
   */
  get latitude() {
    return this.#latitude ?? 0;
  }
  /**
   * Set the latitude value
   *
   * @param {number|string} latitude The latitude value. Ideally it's a number but it could be a number string
   */
  set latitude(latitude) {
    if (isNumberString(latitude)) {
      this.#latitude = Number(latitude);
    } else if (isNumber(latitude)) {
      this.#latitude = latitude;
    }
    this.#latLngObject = void 0;
  }
  /**
   * Get the latitude value (shortened version of the latitude property)
   *
   * @returns {number}
   */
  get lat() {
    return this.#latitude ?? 0;
  }
  /**
   * Set the latitude value
   *
   * @param {number|string} latitude The latitude value. Ideally it's a number but it could be a number string
   */
  set lat(latitude) {
    this.latitude = latitude;
  }
  /**
   * Get the longitude value
   *
   * @returns {number}
   */
  get longitude() {
    return this.#longitude ?? 0;
  }
  /**
   * Set the longitude value
   *
   * @param {number|string} longitude The longitude value. Ideally it's a number but it could be a number string
   */
  set longitude(longitude) {
    if (isNumberString(longitude)) {
      this.#longitude = Number(longitude);
    } else if (isNumber(longitude)) {
      this.#longitude = longitude;
    }
    this.#latLngObject = void 0;
  }
  /**
   * Get the longitude value (shortened version of the longitude property)
   *
   * @returns {number}
   */
  get lng() {
    return this.#longitude ?? 0;
  }
  /**
   * Set the longitude value
   *
   * @param {number|string} longitude The longitude value. Ideally it's a number but it could be a number string
   */
  set lng(longitude) {
    this.longitude = longitude;
  }
  /**
   * Returns a new copy of the latitude/longitude pair
   *
   * @returns {LatLng}
   */
  clone() {
    return new _LatLng(this.#latitude, this.#longitude);
  }
  /**
   * Tests to see if the given latitude/longitude pair is equal to this latitude/longitude pair
   *
   * @param {number[] | string[] | LatLngLiteral | LatLngLiteralExpanded | LatLng} other The latitude/longitude pair to compare to
   * @returns {boolean}
   */
  equals(other) {
    if (other instanceof _LatLng) {
      return other.isValid() && this.latitude === other.latitude && this.longitude === other.longitude;
    }
    let isEqual = false;
    const otherLatLng = new _LatLng(other);
    if (otherLatLng.isValid()) {
      isEqual = this.latitude === otherLatLng.latitude && this.longitude === otherLatLng.longitude;
    }
    return isEqual;
  }
  /**
   * Set the latitude/longitude pair
   *
   * @param {Latitude|LatLng} latitude The latitude value or the latitude/longitude pair
   * @param {number|string} longitude The longitude value
   * @returns {LatLng}
   */
  set(latitude, longitude) {
    if (Array.isArray(latitude)) {
      const [lat, lng] = latitude;
      this.latitude = lat;
      this.longitude = lng;
    } else if (isObject(latitude)) {
      const literal = latitude;
      if (isFunction(latitude.lat)) {
        this.latitude = latitude.lat();
      } else if (typeof literal.lat !== "undefined") {
        this.latitude = literal.lat;
      } else if (typeof latitude.latitude !== "undefined") {
        this.latitude = latitude.latitude;
      }
      if (isFunction(latitude.lng)) {
        this.longitude = latitude.lng();
      } else if (typeof literal.lng !== "undefined") {
        this.longitude = literal.lng;
      } else if (typeof latitude.longitude !== "undefined") {
        this.longitude = latitude.longitude;
      }
    } else if (latitude instanceof _LatLng) {
      this.latitude = latitude.getLat();
      this.longitude = latitude.getLng();
    } else {
      this.latitude = latitude;
      if (typeof longitude !== "undefined") {
        this.longitude = longitude;
      }
    }
    return this;
  }
  /**
   * Sets the latitude value
   *
   * @param {number|string} lat The latitude value. Ideally it's a number, but it could be a number string
   * @returns {LatLng}
   */
  setLat(lat) {
    this.latitude = lat;
    return this;
  }
  /**
   * Returns the longitude value
   *
   * @returns {number}
   */
  getLat() {
    return this.latitude;
  }
  /**
   * Sets the longitude value
   *
   * @param {number|string} lng The longitude value. Ideally it's a number, but it could be a number string
   * @returns {LatLng}
   */
  setLng(lng) {
    this.longitude = lng;
    return this;
  }
  /**
   * Returns the latitude value
   *
   * @returns {number}
   */
  getLng() {
    return this.longitude;
  }
  /**
   * Get the Google maps LatLng object
   *
   * https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
   *
   * This throws an error if the latitude/longitude pair is not valid, or if the Google Maps library is not loaded.
   *
   * @returns {google.maps.LatLng}
   */
  toGoogle() {
    if (!this.isValid()) {
      throw new Error(
        `Invalid latitude/longitude pair. One or both values are missing. Latitude: ${this.latitude}, Longitude: ${this.longitude}`
      );
    }
    checkForGoogleMaps("LatLng", "LatLng");
    if (this.#latLngObject === void 0) {
      this.#latLngObject = new google.maps.LatLng(this.latitude, this.longitude);
    }
    return this.#latLngObject;
  }
  /**
   * Returns whether the latitude/longitude pair are valid values
   *
   * @returns {boolean}
   */
  isValid() {
    return isNumber(this.#latitude) && isNumber(this.#longitude);
  }
  /**
   * Converts the latitude/longitude pair to a JSON object
   *
   * @returns {google.maps.LatLngLiteral}
   */
  toJson() {
    return {
      lat: this.latitude,
      lng: this.longitude
    };
  }
};
var latLng = (latitude, longitude) => new LatLng(latitude, longitude);
var latLngConvert = (googleLatLng) => new LatLng(googleLatLng.lat(), googleLatLng.lng());

// src/lib/Point.ts
var Point = class _Point extends Base_default {
  /**
   * Holds the Google maps point object.
   *
   * This is created the first time that toGoogle() is called.
   */
  #pointObject;
  /**
   * The X value.
   *
   * This is set by the constructor when an x value is passed. It's only undefined for a Point
   * created without values, which isValid() reports as invalid.
   */
  #x;
  /**
   * The Y value.
   *
   * This is set by the constructor when a y value is passed. It's only undefined for a Point
   * created without values, which isValid() reports as invalid.
   */
  #y;
  /**
   * Constructor
   *
   * @param {XPoint|Point} [x] The X value
   * @param {number|string} [y] The Y value
   */
  constructor(x, y) {
    super("point");
    if (isNumber(x) && isNumber(y)) {
      this.#x = x;
      this.#y = y;
    } else if (typeof x !== "undefined") {
      this.set(x, y);
    }
  }
  /**
   * Get the x value
   *
   * @returns {number}
   */
  get x() {
    return this.#x;
  }
  /**
   * Set the x value
   *
   * @param {number|string} x The x value. Ideally it's a number but it could be a number string
   */
  set x(x) {
    if (isNumberString(x)) {
      this.#x = Number(x);
    } else if (isNumber(x)) {
      this.#x = x;
    }
    if (this.#pointObject !== void 0) {
      this.#pointObject.x = this.#x;
    }
  }
  /**
   * Get the y value
   *
   * @returns {number}
   */
  get y() {
    return this.#y;
  }
  /**
   * Set the y value
   *
   * @param {number|string} y The y value. Ideally it's a number but it could be a number string
   */
  set y(y) {
    if (isNumberString(y)) {
      this.#y = Number(y);
    } else if (isNumber(y)) {
      this.#y = y;
    }
    if (this.#pointObject !== void 0) {
      this.#pointObject.y = this.#y;
    }
  }
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
  add(x, y) {
    const p2 = point(x, y);
    return new _Point(this.x + p2.x, this.y + p2.y);
  }
  /**
   * Rounds the x/y values up to the nearest integer.
   * If the value is already an integer, it will return the same value.
   *
   * @returns {Point}
   */
  ceil() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);
    return this;
  }
  /**
   * Returns a new copy of the point
   *
   * @returns {Point}
   */
  clone() {
    return new _Point(this.x, this.y);
  }
  /**
   * Divides the x/y values by a number.
   *
   * @param {number|string} num The number to divide the x and y values by
   * @returns {Point}
   */
  divide(num) {
    if (isNumber(num) && num !== 0) {
      this.x /= num;
      this.y /= num;
    }
    if (isNumberString(num) && Number(num) !== 0) {
      const n = Number(num);
      this.x /= n;
      this.y /= n;
    }
    return this;
  }
  /**
   * This returns the cartesian distance between this point and the given point.
   *
   * @param {PointValue} p The point to compare to
   * @returns {number}
   */
  distanceTo(p) {
    const p2 = point(p);
    const dx = this.x - p2.x;
    const dy = this.y - p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  /**
   * Returns whether the current point is equal to the given point
   *
   * @param {PointValue} p The point value to compare
   * @returns {boolean}
   */
  equals(p) {
    const p2 = point(p);
    return this.x === p2.x && this.y === p2.y;
  }
  /**
   * Returns a copy of the curent point with the x/y values rounded down to the nearest integer.
   * If the value is already an integer, it will return the same value.
   *
   * @returns {Point}
   */
  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    return this;
  }
  /**
   * Get the x value
   *
   * @returns {number}
   */
  getX() {
    return this.x;
  }
  /**
   * Get the y value
   *
   * @returns {number}
   */
  getY() {
    return this.y;
  }
  /**
   * Returns whether the x/y pair are valid values
   *
   * @returns {boolean}
   */
  isValid() {
    return isNumber(this.x) && isNumber(this.y);
  }
  /**
   * Multiplies the x/y values by a number
   *
   * @param {number|string} num The number to multiply the x and y values by
   * @returns {Point}
   */
  multiply(num) {
    if (isNumber(num) && num !== 0) {
      this.x *= num;
      this.y *= num;
    }
    if (isNumberString(num) && Number(num) !== 0) {
      const n = Number(num);
      this.x *= n;
      this.y *= n;
    }
    return this;
  }
  /**
   * Rounds the x/y values to the nearest integer.
   *
   * @returns {Point}
   */
  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }
  /**
   * Set the x/y values
   *
   * @param {XPoint|Point} x The x value, or the Point object, or an array of [x, y] pairs, or a {x, y} object
   * @param {number|string} y The y value
   * @returns {Point}
   */
  set(x, y) {
    if (Array.isArray(x)) {
      const [xValue, yValue] = x;
      this.x = xValue;
      this.y = yValue;
    } else if (isObject(x)) {
      const xObject = x;
      if (typeof xObject.x !== "undefined") {
        this.x = xObject.x;
      }
      if (typeof xObject.y !== "undefined") {
        this.y = xObject.y;
      }
    } else if (x instanceof _Point) {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x;
      if (typeof y !== "undefined") {
        this.y = y;
      }
    }
    return this;
  }
  /**
   * Set the x value
   *
   * @param {number|string} x The x value. Ideally it's a number but it could be a number string
   * @returns {Point}
   */
  setX(x) {
    this.x = x;
    return this;
  }
  /**
   * Set the y value
   *
   * @param {number|string} y The y value. Ideally it's a number but it could be a number string
   * @returns {Point}
   */
  setY(y) {
    this.y = y;
    return this;
  }
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
  subtract(x, y) {
    const p2 = point(x, y);
    this.x -= p2.x;
    this.y -= p2.y;
    return this;
  }
  /**
   * Returns the Google maps point object
   *
   * https://developers.google.com/maps/documentation/javascript/reference/coordinates#Point
   *
   * This throws an error if the Google Maps library is not loaded.
   *
   * @returns {google.maps.Point}
   */
  toGoogle() {
    checkForGoogleMaps("Point", "Point");
    if (this.#pointObject === void 0) {
      this.#pointObject = new google.maps.Point(this.x, this.y);
    }
    return this.#pointObject;
  }
  /**
   * Change the x/y values to the integer part of a number by removing any fractional digits.
   *
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc
   *
   * @returns {Point}
   */
  trunc() {
    this.x = Math.trunc(this.x);
    this.y = Math.trunc(this.y);
    return this;
  }
};
var point = (x, y) => new Point(x, y);

// src/lib/Evented.ts
var Evented = class extends Base_default {
  /*
   * The containers below are only created when something is actually put in them.
   *
   * Every Marker, Polyline, Overlay, Popup, Tooltip, InfoWindow, DataFeature, Map and
   * DataLayer extends this class. Creating these up front meant four objects per instance
   * whether or not it ever had a listener, which is around 80,000 objects for a map with
   * 20,000 markers, most of them empty for the life of the page.
   *
   * Reads use optional chaining and writes create the container first, so an object that
   * never has a listener never allocates any of them.
   */
  /**
   * Holds the events that have been called
   *
   * @private
   * @type {object|undefined}
   */
  #eventsCalled;
  /**
   * Holds the event listeners
   *
   * @private
   * @type {EventListeners|undefined}
   */
  #eventListeners;
  /**
   * Holds the event listeners that are set to only be called once
   *
   * @private
   * @type {string[]|undefined}
   */
  #onlyEventListeners;
  /**
   * Holds the Google maps object that events are set up on
   *
   * @private
   * @type {google.maps.MVCObject| google.maps.marker.AdvancedMarkerElement}
   */
  // Definitely assigned because it's only used after #isGoogleObjectSet() confirms that it's set.
  #googleObject;
  /**
   * Holds the listeners that this object added to the Google maps object, by event type.
   *
   * They're held so that only the listeners this object added are removed. Removing them with
   * google.maps.event.clearListeners() takes away every listener of that type on the object,
   * including ones added by other libraries - the marker clusterer listens for "idle" on the
   * map, for example, and would stop re-clustering.
   *
   * @private
   * @type {object}
   */
  #googleListeners;
  /**
   * Holds the event listeners that are waiting to be added once the Google Maps object is set
   *
   * @private
   * @type {PendingEvents}
   */
  #pendingMapObjectEventListeners;
  /**
   * The object that needs Google maps. This should be the name of the object that extends this class.
   *
   * This is used with checkForGoogleMaps() to check if the Google Maps library is loaded.
   *
   * @private
   * @type {string}
   */
  #testObject;
  /**
   * An optional Google maps library class to check for. This needs to be part of the google.maps object.
   *
   * This is used with checkForGoogleMaps() to check if the Google Maps library is loaded.
   *
   * @private
   * @type {string}
   */
  #testLibrary;
  /**
   * Constructor
   *
   * @param {string} objectType The object type for the class
   * @param {string} testObject The object that needs Google maps. This should be the name of the object that calls this method.
   * @param {string} [testLibrary] An optional Google maps library class to check for. This needs to be part of the google.maps object.
   */
  constructor(objectType, testObject, testLibrary) {
    super(objectType);
    this.#testObject = testObject;
    if (isString(testLibrary)) {
      this.#testLibrary = testLibrary;
    } else {
      this.#testLibrary = testObject;
    }
  }
  /**
   * Dispatch an event
   *
   * @param {string} event The event to dispatch
   * @param {Event} [data] The data to pass to the event listener callback function.
   * @returns {Evented}
   */
  dispatch(event, data) {
    (this.#eventsCalled ??= {})[event] = true;
    const listeners = this.#eventListeners?.[event];
    if (listeners && listeners.length > 0) {
      let eventData = {
        type: event
      };
      if (isObject(data)) {
        if (typeof data.domEvent !== "undefined") {
          const googleData = data;
          eventData.domEvent = googleData.domEvent;
          if (isFunction(googleData.stop)) {
            eventData.stop = googleData.stop;
          }
          if (googleData.latLng) {
            eventData.latLng = latLng(googleData.latLng.lat(), googleData.latLng.lng());
          }
          const { placeId } = data;
          if (isString(placeId)) {
            eventData.placeId = placeId;
          }
          if (typeof data.feature !== "undefined") {
            eventData.feature = data.feature;
          }
          if (typeof data.pixel !== "undefined") {
            eventData.pixel = new Point(data.pixel.x, data.pixel.y);
          }
        } else {
          eventData = { ...eventData, ...data };
        }
      }
      let listenersToRemove;
      listeners.forEach((listener) => {
        listener.callback.call(listener.context || this, eventData);
        if (listener.options.once === true) {
          if (!listenersToRemove) {
            listenersToRemove = [];
          }
          listenersToRemove.push(listener);
        }
      });
      if (listenersToRemove) {
        this.removeCalledOnceListeners(event, listenersToRemove);
      }
    }
    return this;
  }
  /**
   * Test if there are any listeners for the given event type
   *
   * Optionally you can test if there are any listeners for the given event type and callback
   *
   * @param {string} type The event type to test for
   * @param {EventCallback} callback Optional callback function to include in the test
   * @returns {boolean}
   */
  hasListener(type, callback) {
    const listeners = this.#eventListeners?.[type];
    if (!listeners || listeners.length === 0) {
      return false;
    }
    if (typeof callback === "function") {
      return listeners.some((event) => event.callback === callback);
    }
    return true;
  }
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
  off(type, callback, options) {
    if (isString(type)) {
      const eventListeners = this.#eventListeners;
      if (eventListeners && eventListeners[type]) {
        if (isFunction(callback)) {
          eventListeners[type] = eventListeners[type].filter((listener) => {
            let keep = true;
            if (isObject(options)) {
              keep = listener.callback !== callback || !objectEquals(options, listener.options);
            } else {
              keep = listener.callback !== callback;
            }
            return keep;
          });
        } else {
          eventListeners[type] = [];
        }
        this.#afterListenersRemoved(type);
      }
    } else {
      this.offAll();
    }
  }
  /**
   * Clean up after event listeners for an event type have been removed
   *
   * @private
   * @param {string} type The event type
   */
  #afterListenersRemoved(type) {
    if ((this.#eventListeners?.[type]?.length ?? 0) > 0) {
      return;
    }
    const onlyEventListeners = this.#onlyEventListeners;
    if (onlyEventListeners) {
      const index = onlyEventListeners.indexOf(type);
      if (index > -1) {
        onlyEventListeners.splice(index, 1);
      }
    }
    const pending = this.#pendingMapObjectEventListeners;
    if (pending && pending[type]) {
      delete pending[type];
      if (Object.keys(pending).length === 0) {
        this.#pendingMapObjectEventListeners = void 0;
      }
    }
    const googleListeners = this.#googleListeners;
    if (googleListeners && googleListeners[type]) {
      googleListeners[type].remove();
      delete googleListeners[type];
    }
  }
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
  removeCalledOnceListeners(type, listeners) {
    const eventListeners = this.#eventListeners;
    if (eventListeners && eventListeners[type]) {
      const toRemove = new Set(listeners);
      eventListeners[type] = eventListeners[type].filter((listener) => !toRemove.has(listener));
      this.#afterListenersRemoved(type);
    }
  }
  /**
   * Removes all event listeners
   */
  offAll() {
    this.#eventListeners = void 0;
    this.#onlyEventListeners = void 0;
    this.#pendingMapObjectEventListeners = void 0;
    const googleListeners = this.#googleListeners;
    if (googleListeners) {
      Object.keys(googleListeners).forEach((type) => {
        googleListeners[type].remove();
      });
      this.#googleListeners = void 0;
    }
  }
  /**
   * Add an event listener to the object
   *
   * @param {string} type The event type
   * @param {Function} callback The event listener callback function
   * @param {EventConfig} [config] Configuration for the event.
   */
  on(type, callback, config) {
    this.#on(type, callback, config);
  }
  /**
   * Add an event listener to the object. It will be called immediately if the event has already been dispatched.
   *
   * @param {string} type The event type
   * @param {Function} callback The event listener callback function
   * @param {EventConfig} [config] Configuration for the event.
   */
  onImmediate(type, callback, config) {
    const eventConfig = isObject(config) ? config : {};
    eventConfig.callImmediate = true;
    this.on(type, callback, eventConfig);
  }
  /**
   * Sets up an event listener that will only be called once
   *
   * @param {string} type The event type
   * @param {EventCallback} [callback] The event listener callback function
   * @param {EventConfig} [config] Configuration for the event.
   */
  once(type, callback, config) {
    const eventConfig = isObject(config) ? config : {};
    eventConfig.once = true;
    this.on(type, callback, eventConfig);
  }
  /**
   * Sets up an event listener that will only be called once. It will be called immediately if the event has already been dispatched.
   *
   * @param {string} type The event type
   * @param {EventCallback} [callback] The event listener callback function
   * @param {EventConfig} [config] Configuration for the event.
   */
  onceImmediate(type, callback, config) {
    const eventConfig = isObject(config) ? config : {};
    eventConfig.once = true;
    eventConfig.callImmediate = true;
    this.on(type, callback, eventConfig);
  }
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
  only(type, callback, config) {
    const eventConfig = isObject(config) ? config : {};
    eventConfig.only = true;
    eventConfig.callImmediate = true;
    this.on(type, callback, eventConfig);
  }
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
  onlyOnce(type, callback, config) {
    const eventConfig = isObject(config) ? config : {};
    eventConfig.once = true;
    eventConfig.only = true;
    eventConfig.callImmediate = true;
    this.on(type, callback, eventConfig);
  }
  /**
   * Add an event listener to the object
   *
   * config:
   * - context: object - The context to bind the callback function to
   * - once: boolean - If true then the event listener will only be called once
   * - onlyOnce: boolean - If true then the event listener will only be called once and only one listener will be added for this event type.
   * - callImmediate: boolean - If true then the event listener will be called immediately if the event has already been dispatched
   *
   * @param {string} type The event type
   * @param {Function} callback The event listener callback function
   * @param {EventConfig} [config] Configuration for the event.
   */
  #on(type, callback, config) {
    if (isFunction(callback)) {
      const existingListeners = this.#eventListeners?.[type];
      if ((!existingListeners || existingListeners.length === 0) && !INTERNAL_EVENTS.includes(type)) {
        let setupPending = false;
        if (checkForGoogleMaps(this.#testObject, this.#testLibrary, false)) {
          if (this.#isGoogleObjectSet()) {
            const googleListeners = this.#googleListeners ??= {};
            const googleObject = this.#googleObject;
            if (googleObject && !googleListeners[type]) {
              googleListeners[type] = googleObject.addListener(type, (e) => {
                this.dispatch(type, e);
              });
            }
          } else {
            setupPending = true;
          }
        } else {
          setupPending = true;
        }
        if (setupPending) {
          const pending = this.#pendingMapObjectEventListeners ??= {};
          pending[type] ??= [];
          pending[type].push({ callback, config });
        }
      }
      let addListener = true;
      const listenerOptions = {};
      let context;
      if (this.#onlyEventListeners?.includes(type)) {
        addListener = false;
      }
      if (addListener && isObjectWithValues(config)) {
        if (typeof config.once === "boolean" && config.once === true) {
          listenerOptions.once = true;
        }
        if (typeof config.only === "boolean" && config.only === true) {
          (this.#onlyEventListeners ??= []).push(type);
          if (this.hasListener(type)) {
            addListener = false;
          }
        }
        if (config.context) {
          context = config.context;
          if (context === this) {
            context = void 0;
          }
        }
        if (typeof config.callImmediate === "boolean" && config.callImmediate === true) {
          if (typeof this.#eventsCalled?.[type] !== "undefined") {
            if (typeof config.once === "boolean" && config.once === true) {
              addListener = false;
            }
            if (isFunction(callback)) {
              callback.call(context || this, { type });
            }
          }
        }
      }
      if (addListener) {
        const eventListeners = this.#eventListeners ??= {};
        eventListeners[type] ??= [];
        eventListeners[type].push({ callback, context, options: listenerOptions });
      }
    } else {
      throw new Error(`The "${type}" event handler needs a callback function`);
    }
  }
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
  setEventGoogleObject(googleObject) {
    this.#googleObject = googleObject;
    const pending = this.#pendingMapObjectEventListeners;
    if (pending) {
      const googleListeners = this.#googleListeners ??= {};
      Object.keys(pending).forEach((type) => {
        if (googleObject && !googleListeners[type]) {
          googleListeners[type] = googleObject.addListener(type, (e) => {
            this.dispatch(type, e);
          });
        }
      });
      this.#pendingMapObjectEventListeners = void 0;
    }
  }
  /**
   * Returns if the Google object is set and ready to work with events
   *
   * @returns {boolean}
   */
  #isGoogleObjectSet() {
    if (typeof google === "undefined" || typeof google.maps === "undefined") {
      return false;
    }
    let isSet = this.#googleObject instanceof google.maps.MVCObject;
    if (!isSet && typeof google.maps.marker !== "undefined" && typeof google.maps.marker.AdvancedMarkerElement !== "undefined") {
      isSet = this.#googleObject instanceof google.maps.marker.AdvancedMarkerElement;
    }
    return isSet;
  }
  /**
   * Triggers an event
   *
   * Alias to dispatch()
   *
   * @param {string} event The event to dispatch
   * @param {Event} [data] The data to pass to the event listener callback function.
   * @returns {Evented}
   */
  trigger(event, data) {
    return this.dispatch(event, data);
  }
};

// src/lib/Loader.ts
import { Loader as GoogleLoader } from "@googlemaps/js-api-loader";
var Loader = class extends EventTarget {
  /**
   * Holds the Google Maps API key
   *
   * @private
   * @type {string | undefined}
   */
  #apiKey;
  /**
   * Holds the loading state
   *
   * @private
   * @type {boolean}
   */
  #isLoading = false;
  /**
   * Holds the loaded state
   *
   * @private
   * @type {boolean}
   */
  #isLoaded = false;
  /**
   * Holds whether the map has finished loading.
   *
   * This is set when the "map_load" event is dispatched so that a listener added after that
   * point can still be called.
   *
   * @private
   * @type {boolean}
   */
  #isMapLoaded = false;
  /**
   * Holds the libraries to load with Google maps
   *
   * @private
   * @type {Libraries}
   */
  #libraries = [];
  /**
   * Holds the Google maps loader object
   *
   * @private
   * @type {GoogleLoader | undefined}
   */
  #loader;
  /**
   * Holds the version of the Google Maps API to load
   *
   * @private
   * @type {string}
   */
  #version = "weekly";
  /**
   * Class constructor
   *
   * @param {LoaderOptions} [options] The loader options object
   */
  constructor(options) {
    super();
    if (isObject(options)) {
      this.setOptions(options);
    }
  }
  /**
   * Get the Google Maps API key
   *
   * @returns {string | undefined}
   */
  get apiKey() {
    return this.#apiKey;
  }
  /**
   * Set the Google Maps API key
   *
   * @param {string} apiKey The Google Maps API key
   */
  set apiKey(apiKey) {
    if (isString(apiKey)) {
      this.#apiKey = apiKey;
    }
  }
  /**
   * Get the libraries to load with Google maps
   *
   * @returns {Libraries}
   */
  get libraries() {
    return this.#libraries;
  }
  /**
   * Set the libraries to load with Google maps
   * The "places" library is a common one to load.
   * https://developers.google.com/maps/documentation/javascript/places
   *
   * @param {Libraries} libraries The libraries to load with Google maps
   */
  set libraries(libraries) {
    if (Array.isArray(libraries)) {
      this.#libraries = libraries;
    } else if (isStringWithValue(libraries)) {
      this.#libraries = [libraries];
    }
  }
  /**
   * Get the version of the Google Maps API to load
   *
   * @returns {string}
   */
  get version() {
    return this.#version;
  }
  /**
   * Set the version of the Google Maps API to load
   * https://developers.google.com/maps/documentation/javascript/versions
   *
   * @param {string} version The version of the Google Maps API to load
   */
  set version(version) {
    if (isString(version)) {
      this.#version = version;
    }
  }
  /**
   * Set the loader options
   *
   * @param {LoaderOptions} options The loader options object
   * @returns {Loader}
   */
  setOptions(options) {
    if (isObjectWithValues(options)) {
      if (isString(options.apiKey)) {
        this.apiKey = options.apiKey;
      }
      if (Array.isArray(options.libraries)) {
        this.libraries = options.libraries;
      }
      if (isString(options.version)) {
        this.version = options.version;
      }
    }
    return this;
  }
  /**
   * Set the Google Maps API key
   *
   * @param {string} apiKey The Google Maps API key
   * @returns {Loader}
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
    return this;
  }
  /**
   * Set the libraries to load with Google maps
   * The "places" library is a common one to load.
   * https://developers.google.com/maps/documentation/javascript/places
   *
   * @param {Libraries} libraries The libraries to load with Google maps
   * @returns {Loader}
   */
  setLibraries(libraries) {
    this.libraries = libraries;
    return this;
  }
  /**
   * Set the version of the Google Maps API to load
   * https://developers.google.com/maps/documentation/javascript/versions
   *
   * @param {string} version The version of the Google Maps API to load
   * @returns {Loader}
   */
  setVersion(version) {
    this.version = version;
    return this;
  }
  /**
   * Load the Google maps API
   *
   * @param {Function} callback A callback function to run when the Google maps API has loaded
   * @returns {Promise<void>}
   */
  load(callback) {
    return new Promise((resolve, reject) => {
      if (!this.#isLoaded) {
        if (!this.#isLoading) {
          this.#isLoading = true;
          if (isStringWithValue(this.#apiKey)) {
            if (typeof this.#loader === "undefined") {
              this.#loader = new GoogleLoader({
                apiKey: this.#apiKey,
                version: this.#version,
                libraries: this.#libraries
              });
            }
            this.#loader.importLibrary("maps").then(async () => {
              if (this.#libraries.includes("marker")) {
                await google.maps.importLibrary("marker");
              }
              this.#isLoaded = true;
              callCallback(callback);
              this.dispatch(LoaderEvents.LOAD);
              resolve();
            }).catch((err) => {
              reject(err);
            });
          } else {
            reject(new Error("The Google Maps API key is not set"));
          }
        } else {
          this.once(LoaderEvents.LOAD, () => {
            callCallback(callback);
            resolve();
          });
        }
      } else {
        callCallback(callback);
        resolve();
      }
    });
  }
  /**
   * Dispatch an event
   *
   * @param {string} event The event to dispatch
   */
  dispatch(event) {
    if (event === LoaderEvents.MAP_LOAD) {
      this.#isMapLoaded = true;
    }
    super.dispatchEvent(new CustomEvent(event));
  }
  /**
   * Add an event listener to the object.
   *
   * All events on the loader object are set up as "once" events because the
   * load event is only dispatched one time when the Google maps API is loaded.
   *
   * @param {string} type The event type
   * @param {Function} callback The event listener function. An error is thrown if this isn't a function.
   */
  on(type, callback) {
    if (isFunction(callback)) {
      this.addEventListener(type, callback, { once: true });
      if (type === LoaderEvents.LOAD && this.#isLoaded) {
        this.dispatch(LoaderEvents.LOAD);
      } else if (type === LoaderEvents.MAP_LOAD && this.#isMapLoaded) {
        this.dispatch(LoaderEvents.MAP_LOAD);
      }
    } else {
      throw new Error("the event handler needs a callback function");
    }
  }
  /**
   * Sets up an event listener for the "load" event.
   *
   * All events on the loader object are set up as "once" events because the
   * load event is only dispatched one time when the Google maps API is loaded.
   *
   * @param {Function} callback A callback function to run when the Google maps API has loaded
   */
  onLoad(callback) {
    this.on(LoaderEvents.LOAD, callback);
  }
  /**
   * Sets up an event listener for the "map_load" event.
   *
   * All events on the loader object are set up as "once" events because the
   * load event is only dispatched one time when the Google maps API is loaded.
   *
   * @param {Function} callback A callback function to run when the Google maps API has loaded
   */
  onMapLoad(callback) {
    this.on(LoaderEvents.MAP_LOAD, callback);
  }
  /**
   * Sets up an event listener that will only be called once
   *
   * @param {string} type The event type
   * @param {Function} callback The event listener function
   */
  once(type, callback) {
    this.on(type, callback);
  }
  /**
   * Sets up an event listener for the "load" event that will only be called once.
   *
   * @param {Function} callback A callback function to run when the Google maps API has loaded
   */
  onceLoad(callback) {
    this.on(LoaderEvents.LOAD, callback);
  }
  /**
   * Sets up an event listener for the "map_load" event that will only be called once.
   *
   * @param {Function} callback A callback function to run when the Google maps API has loaded
   */
  onceMapLoad(callback) {
    this.on(LoaderEvents.MAP_LOAD, callback);
  }
};
var loaderInstance;
var loader = (config) => {
  if (!loaderInstance) {
    loaderInstance = new Loader(config);
  } else if (config) {
    loaderInstance.setOptions(config);
  }
  return loaderInstance;
};

// src/lib/LatLngBounds.ts
var LatLngBounds = class _LatLngBounds extends Base_default {
  /**
   * Holds the Google maps LatLngBounds object.
   *
   * This is created when the Google Maps library is available and the Google object is needed.
   */
  #bounds;
  /**
   * Holds the values to extend the bounds with
   *
   * This is used to set up the Google Maps LatLngBounds object when the Google Maps object is loaded.
   *
   * @private
   * @type {LatLng[]}
   */
  #boundValues = [];
  /**
   * Holds the north-east corner of the LatLngBounds.
   *
   * This is undefined until a point is added to the bounds.
   *
   * @private
   * @type {LatLng|undefined}
   */
  #northEast;
  /**
   * Holds the south-west corner of the LatLngBounds.
   *
   * This is undefined until a point is added to the bounds.
   *
   * @private
   * @type {LatLng|undefined}
   */
  #southWest;
  /**
   * Holds the corners that the bounds was created with, if it was created from corner values.
   *
   * The Google Maps LatLngBounds object is created from these corners. Extending from the two
   * corner points instead would lose a bounds that crosses the 180 degree meridian or is more
   * than 180 degrees wide, because extend() always picks the smaller box.
   *
   * @private
   * @type {{ne: google.maps.LatLngLiteral, sw: google.maps.LatLngLiteral}|undefined}
   */
  #initialCorners;
  /**
   * Constructor
   *
   * @param {LatLngValue | LatLngValue[]} [latLngValue] The latitude/longitude value(s). If not set then add points with the extend method.
   *      See comments on the extended method for the types of values that latLngValue can be.
   */
  constructor(latLngValue) {
    super("latlngbounds");
    if (latLngValue) {
      if (isObjectWithValues(latLngValue)) {
        if (typeof latLngValue.ne !== "undefined" && typeof latLngValue.sw !== "undefined") {
          this.#setCorners(
            latLng(latLngValue.ne),
            latLng(latLngValue.sw)
          );
        } else if (typeof latLngValue.north !== "undefined" && typeof latLngValue.south !== "undefined" && typeof latLngValue.east !== "undefined" && typeof latLngValue.west !== "undefined") {
          this.#setCorners(
            latLng([latLngValue.north, latLngValue.east]),
            latLng([latLngValue.south, latLngValue.west])
          );
        } else {
          this.extend(latLngValue);
        }
      } else {
        this.extend(latLngValue);
      }
    }
  }
  /**
   * Returns whether the the given LatLng value is within this bounds
   *
   * @param {LatLngValue} latLngValue The LatLng value to test
   * @returns {boolean}
   */
  contains(latLngValue) {
    const latLngObject = latLng(latLngValue);
    if (!latLngObject.isValid()) {
      throw new Error(
        `Invalid latitude/longitude data passed to LatLngBounds.contains. You passed: ${JSON.stringify(
          latLngValue
        )}`
      );
    }
    if (this.#bounds) {
      return this.#bounds.contains(latLngObject.toGoogle());
    }
    if (this.#southWest && this.#northEast) {
      return latLngObject.latitude >= this.#southWest.latitude && latLngObject.latitude <= this.#northEast.latitude && this.#containsLongitude(latLngObject.longitude, this.#southWest, this.#northEast);
    }
    return false;
  }
  /**
   * Returns whether this bounds approximately equals the given bounds
   *
   * @param {LatLngBounds} other The LatLngBounds object to compare
   * @returns {Promise<boolean>}
   */
  equals(other) {
    return new Promise((resolve) => {
      if (other instanceof _LatLngBounds) {
        const bounds = this.#bounds;
        if (bounds) {
          other.toGoogle().then((googleLatLngBounds) => {
            resolve(bounds.equals(googleLatLngBounds));
          });
        } else {
          const isThisEmpty = this.isEmpty();
          const isOtherEmpty = other.isEmpty();
          if (isThisEmpty || isOtherEmpty) {
            resolve(isThisEmpty && isOtherEmpty);
            return;
          }
          const { northEast, southWest } = this.#getCorners();
          const otherNorthEast = other.getNorthEast();
          const otherSouthWest = other.getSouthWest();
          resolve(
            typeof otherNorthEast !== "undefined" && typeof otherSouthWest !== "undefined" && northEast.latitude === otherNorthEast.latitude && northEast.longitude === otherNorthEast.longitude && southWest.latitude === otherSouthWest.latitude && southWest.longitude === otherSouthWest.longitude
          );
        }
      } else {
        resolve(false);
      }
    });
  }
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
  extend(latLngValue) {
    if (Array.isArray(latLngValue)) {
      if (latLngValue.length > 0) {
        if (latLng(latLngValue[0]).isValid()) {
          const value = latLngValue;
          value.forEach((latLngVal) => {
            this.extend(latLngVal);
          });
        } else {
          const latLngObject = latLng(latLngValue);
          if (latLngObject.isValid()) {
            this.extend(latLngObject);
          } else {
            throw new Error(
              `Invalid latitude/longitude data passed to LatLngBounds. You passed: ${JSON.stringify(
                latLngValue
              )}`
            );
          }
        }
      } else {
        console.warn("The array passed to LatLngBounds.extend is empty. Nothing to extend.");
      }
    } else {
      const latLngObject = latLng(latLngValue);
      if (latLngObject.isValid()) {
        if (this.#bounds) {
          this.#bounds.extend(latLngObject.toGoogle());
        } else {
          this.#extend(latLngObject);
        }
      } else {
        throw new Error(
          `Invalid latitude/longitude data passed to LatLngBounds. You passed: ${JSON.stringify(latLngValue)}`
        );
      }
    }
    return this;
  }
  /**
   * Extends this bounds using the internal method
   *
   * Based on the Leaflet library
   *
   * @param {LatLng} latLngObject The LatLng object
   * @returns {void}
   */
  #extend(latLngObject) {
    this.#boundValues.push({ lat: latLngObject.latitude, lng: latLngObject.longitude });
    if (this.#northEast && this.#southWest) {
      const { latitude, longitude } = latLngObject;
      this.#northEast.latitude = Math.max(latitude, this.#northEast.latitude);
      this.#southWest.latitude = Math.min(latitude, this.#southWest.latitude);
      if (!this.#containsLongitude(longitude, this.#southWest, this.#northEast)) {
        const westDistance = (this.#southWest.longitude - longitude + 360) % 360;
        const eastDistance = (longitude - this.#northEast.longitude + 360) % 360;
        if (westDistance < eastDistance) {
          this.#southWest.longitude = longitude;
        } else {
          this.#northEast.longitude = longitude;
        }
      }
    } else {
      this.#northEast = latLngObject.clone();
      this.#southWest = latLngObject.clone();
    }
  }
  /**
   * Returns whether the longitude is within the longitude span of the corners.
   *
   * If the west longitude is greater than the east longitude then the bounds crosses the
   * 180 degree meridian, and the span wraps around it.
   *
   * @private
   * @param {number} longitude The longitude to test
   * @param {LatLng} southWest The south-west corner
   * @param {LatLng} northEast The north-east corner
   * @returns {boolean}
   */
  // eslint-disable-next-line class-methods-use-this -- Kept with the other bounds calculations
  #containsLongitude(longitude, southWest, northEast) {
    if (southWest.longitude <= northEast.longitude) {
      return longitude >= southWest.longitude && longitude <= northEast.longitude;
    }
    return longitude >= southWest.longitude || longitude <= northEast.longitude;
  }
  /**
   * Returns whether the longitude spans of two bounds share any points.
   *
   * A bounds whose west longitude is greater than its east longitude crosses the 180 degree
   * meridian, so its span is the two arms either side of the meridian rather than the numbers
   * in between. Comparing those numbers directly says a bounds running 170 to -170 starts to
   * the east of one running -175 to -160 and misses it, when in fact they overlap across the
   * meridian. This is the same wrap that #containsLongitude() handles for a single longitude.
   *
   * Two wrapped spans always share points, because both of them contain the meridian itself.
   * A wrapped span and an ordinary one share points when the ordinary one reaches either arm
   * of the wrapped one.
   *
   * @private
   * @param {LatLng} southWest This bounds' south-west corner
   * @param {LatLng} northEast This bounds' north-east corner
   * @param {LatLng} otherSouthWest The other bounds' south-west corner
   * @param {LatLng} otherNorthEast The other bounds' north-east corner
   * @returns {boolean}
   */
  // eslint-disable-next-line class-methods-use-this -- Kept with the other bounds calculations
  #longitudesOverlap(southWest, northEast, otherSouthWest, otherNorthEast) {
    const wraps = southWest.longitude > northEast.longitude;
    const otherWraps = otherSouthWest.longitude > otherNorthEast.longitude;
    if (wraps && otherWraps) {
      return true;
    }
    if (wraps) {
      return otherSouthWest.longitude <= northEast.longitude || otherNorthEast.longitude >= southWest.longitude;
    }
    if (otherWraps) {
      return southWest.longitude <= otherNorthEast.longitude || northEast.longitude >= otherSouthWest.longitude;
    }
    return southWest.longitude <= otherNorthEast.longitude && northEast.longitude >= otherSouthWest.longitude;
  }
  /**
   * Set the bounds from its north-east and south-west corners.
   *
   * Nothing is set unless both corners are valid.
   *
   * @private
   * @param {LatLng} northEast The north-east corner
   * @param {LatLng} southWest The south-west corner
   */
  #setCorners(northEast, southWest) {
    if (northEast.isValid() && southWest.isValid()) {
      this.#northEast = northEast.clone();
      this.#southWest = southWest.clone();
      this.#initialCorners = {
        ne: { lat: northEast.latitude, lng: northEast.longitude },
        sw: { lat: southWest.latitude, lng: southWest.longitude }
      };
    }
  }
  /**
   * Get the center of the LatLngBounds
   *
   * @returns {LatLng}
   */
  getCenter() {
    this.#throwIfEmpty("getCenter");
    if (this.#bounds) {
      return latLngConvert(this.#bounds.getCenter());
    }
    const { northEast, southWest } = this.#getCorners();
    const lat = (northEast.latitude + southWest.latitude) / 2;
    let lng;
    if (northEast.longitude < southWest.longitude) {
      lng = (southWest.longitude + northEast.longitude + 360) / 2;
      if (lng > 180) {
        lng -= 360;
      }
    } else {
      lng = (northEast.longitude + southWest.longitude) / 2;
    }
    return latLng([lat, lng]);
  }
  /**
   * Get the north-east corner of the LatLngBounds.
   *
   * If the bounds is empty then this returns undefined. Use isEmpty() to check first.
   *
   * @returns {LatLng|undefined}
   */
  getNorthEast() {
    if (this.#bounds) {
      return latLngConvert(this.#bounds.getNorthEast());
    }
    return this.#northEast;
  }
  /**
   * Get the south-west corner of the LatLngBounds.
   *
   * If the bounds is empty then this returns undefined. Use isEmpty() to check first.
   *
   * @returns {LatLng|undefined}
   */
  getSouthWest() {
    if (this.#bounds) {
      return latLngConvert(this.#bounds.getSouthWest());
    }
    return this.#southWest;
  }
  /**
   * Get the north-east and south-west corners for calculating values manually
   * when the Google Maps LatLngBounds object isn't set up.
   *
   * This throws an error if either corner is not set, which happens if the bounds is empty.
   *
   * @private
   * @returns {{northEast: LatLng, southWest: LatLng}}
   */
  /**
   * Throw if the bounds has no points in it.
   *
   * The methods that describe a bounds - its middle, or its value as a string or an object -
   * have nothing to describe when it's empty, so they say so rather than handing back a value
   * that looks real. This is checked separately from #getCorners() because those methods ask
   * Google for the answer when the Google object exists, and Google answers for an empty
   * bounds instead of complaining, which made the behaviour depend on load timing.
   *
   * @private
   * @param {string} method The method name, so that the error says what was called
   */
  #throwIfEmpty(method) {
    if (this.isEmpty()) {
      throw new Error(
        `The LatLngBounds object is empty so LatLngBounds.${method}() has nothing to return. Add a latitude/longitude value to it first.`
      );
    }
  }
  #getCorners() {
    if (!this.#northEast || !this.#southWest) {
      throw new Error("The LatLngBounds object is empty. Add a latitude/longitude value to it first.");
    }
    return { northEast: this.#northEast, southWest: this.#southWest };
  }
  /**
   * Initialize the lat/lng bounds object so that the Google maps library is available
   *
   * This is not intended to be called outside of this library.
   *
   * @internal
   * @returns {Promise<void>}
   */
  init() {
    return new Promise((resolve) => {
      this.#setupGoogleLatLngBounds().then(() => {
        resolve();
      });
    });
  }
  /**
   * Returns whether this bounds shares any points with the other bounds
   *
   * @param {LatLngBounds} other The LatLngBounds object to compare
   * @returns {Promise<boolean>}
   */
  intersects(other) {
    return new Promise((resolve, reject) => {
      if (other instanceof _LatLngBounds) {
        const bounds = this.#bounds;
        if (bounds) {
          other.toGoogle().then((googleLatLngBounds) => {
            resolve(bounds.intersects(googleLatLngBounds));
          });
        } else {
          const sw = this.getSouthWest();
          const ne = this.getNorthEast();
          const otherSw = other.getSouthWest();
          const otherNe = other.getNorthEast();
          if (!sw || !ne || !otherSw || !otherNe) {
            resolve(false);
            return;
          }
          resolve(
            // Latitude doesn't wrap, so this is the ordinary overlap test
            sw.latitude <= otherNe.latitude && ne.latitude >= otherSw.latitude && // Longitude does wrap, so it needs the meridian-aware test below
            this.#longitudesOverlap(sw, ne, otherSw, otherNe)
          );
        }
      } else {
        reject(
          new Error(
            `Invalid LatLngBounds object passed to LatLngBounds.intersects. You passed: ${JSON.stringify(
              other
            )}`
          )
        );
      }
    });
  }
  /**
   * Returns whether this bounds is empty
   *
   * @returns {boolean}
   */
  isEmpty() {
    if (this.#bounds) {
      return this.#bounds.isEmpty();
    }
    return !this.#northEast || !this.#southWest;
  }
  /**
   * Get the Google maps LatLngBounds object
   *
   * https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds
   *
   * @returns {Promise<google.maps.LatLngBounds>}
   */
  toGoogle() {
    return new Promise((resolve) => {
      this.#setupGoogleLatLngBounds().then((bounds) => {
        resolve(bounds);
      });
    });
  }
  /**
   * Set up the Google maps LatLngBounds object if necessary
   *
   * @private
   * @returns {Promise<google.maps.LatLngBounds>}
   */
  #setupGoogleLatLngBounds() {
    return new Promise((resolve) => {
      if (!isObject(this.#bounds)) {
        if (checkForGoogleMaps("LatLngBounds", "LatLngBounds", false)) {
          resolve(this.#createLatLngBoundsObject());
        } else {
          loader().onMapLoad(() => {
            resolve(this.#createLatLngBoundsObject());
          });
        }
      } else {
        resolve(this.#bounds);
      }
    });
  }
  /**
   * Create the LatLngBounds object if it hasn't been created yet
   *
   * @private
   * @returns {google.maps.LatLngBounds}
   */
  #createLatLngBoundsObject() {
    if (!this.#bounds) {
      const bounds = this.#initialCorners ? new google.maps.LatLngBounds(this.#initialCorners.sw, this.#initialCorners.ne) : new google.maps.LatLngBounds();
      this.#bounds = bounds;
      this.#initialCorners = void 0;
      if (this.#boundValues) {
        this.#boundValues.forEach((latLngLiteral) => {
          bounds.extend(latLngLiteral);
        });
        this.#boundValues = [];
      }
    }
    return this.#bounds;
  }
  /**
   * Converts the LatLngBounds object to a JSON object
   *
   * @returns {google.maps.LatLngBoundsLiteral}
   */
  toJson() {
    this.#throwIfEmpty("toJson");
    if (this.#bounds) {
      return this.#bounds.toJSON();
    }
    const { northEast, southWest } = this.#getCorners();
    return {
      east: northEast.longitude,
      north: northEast.latitude,
      south: southWest.latitude,
      west: southWest.longitude
    };
  }
  /**
   * Converts the LatLngBounds object to a string
   *
   * @returns {string}
   */
  toString() {
    this.#throwIfEmpty("toString");
    if (this.#bounds) {
      return this.#bounds.toString();
    }
    const { northEast, southWest } = this.#getCorners();
    return `(${southWest.latitude}, ${southWest.longitude}) (${northEast.latitude}, ${northEast.longitude})`;
  }
  /**
   * Returns the LatLngBounds object as a string that can be used in a URL
   *
   * @param {number} [precision] The number of decimal places to round the lat/lng values to
   * @returns {string}
   */
  toUrlValue(precision) {
    const prec = isNumber(precision) ? precision : 3;
    this.#throwIfEmpty("toUrlValue");
    if (this.#bounds) {
      return this.#bounds.toUrlValue(prec);
    }
    const { northEast, southWest } = this.#getCorners();
    return `${southWest.latitude.toFixed(prec)},${southWest.longitude.toFixed(
      prec
    )},${northEast.latitude.toFixed(prec)},${northEast.longitude.toFixed(prec)}`;
  }
  /**
   * Extends this bounds to contain the union of this and the given bounds
   *
   * @param {LatLngBounds} other The LatLngBounds object to join with
   * @returns {Promise<void>}
   */
  union(other) {
    return new Promise((resolve) => {
      if (this.#bounds) {
        this.#union(other).then(() => {
          resolve();
        });
      } else {
        this.#setupGoogleLatLngBounds().then(() => {
          this.#union(other).then(() => {
            resolve();
          });
        });
      }
    });
  }
  /**
   * Extends this bounds to contain the union of this and the given bounds
   *
   * This is only called after the Google Maps LatLngBounds object is set up.
   *
   * @param {LatLngBounds} other The LatLngBounds object to join with
   * @returns {Promise<void>}
   */
  #union(other) {
    return new Promise((resolve) => {
      const bounds = this.#createLatLngBoundsObject();
      if (other instanceof _LatLngBounds) {
        other.toGoogle().then((googleLatLngBounds) => {
          bounds.union(googleLatLngBounds);
          resolve();
        });
      } else {
        bounds.union(other);
        resolve();
      }
    });
  }
};
var latLngBounds = (latLngValue) => {
  if (latLngValue instanceof LatLngBounds) {
    return latLngValue;
  }
  return new LatLngBounds(latLngValue);
};

// src/lib/missingFeature.ts
var missingFeatureMessage = (method, entryPoint) => `${method}() is added by the "${entryPoint}" module, which hasn't been imported. Import it once, anywhere in your code, to add ${method}() to this object:
    import '@aptuitiv/gmaps/${entryPoint}';
Importing from '@aptuitiv/gmaps' instead of '@aptuitiv/gmaps/core' includes it as well.`;

// src/lib/Layer.ts
var Layer = class extends Evented {
  // eslint-disable-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, class-methods-use-this
  attachPopup(...args) {
    throw new Error(missingFeatureMessage("attachPopup", "popup"));
  }
  /**
   * @inheritdoc
   * @param {...any} args Ignored. See attachPopup().
   * @returns {any}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, class-methods-use-this
  attachTooltip(...args) {
    throw new Error(missingFeatureMessage("attachTooltip", "tooltip"));
  }
  /**
   * @inheritdoc
   * @param {...any} args Ignored. See attachPopup().
   * @returns {any}
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, class-methods-use-this
  attachInfoWindow(...args) {
    throw new Error(missingFeatureMessage("attachInfoWindow", "infowindow"));
  }
  /**
   * Holds if the layer is visible or not
   *
   * @private
   * @type {boolean}
   */
  #isVisible = false;
  /**
   * Holds the Map object that the layer is added to
   *
   * @private
   * @type {Map|null}
   */
  #map = null;
  /**
   * Holds the Popup object that the layer is added to
   *
   * @private
   * @type {Popup|null}
   */
  #popup;
  /**
   * Get if the layer is visible or not
   *
   * @returns {boolean}
   */
  get isVisible() {
    return this.#isVisible;
  }
  /**
   * Set if the layer is visible or not
   *
   * @param {boolean} value Whether the layer is visible or not
   */
  set isVisible(value) {
    if (typeof value === "boolean") {
      this.#isVisible = value;
    } else {
      throw new Error("isVisible must be a boolean");
    }
  }
  /**
   * Return the Map object or null if the Map object is not set
   *
   * @returns {Map|null}
   */
  getMap() {
    return this.#map;
  }
  /**
   * Return if the layer has a Map object set
   *
   * @returns {boolean}
   */
  hasMap() {
    return this.#map !== null;
  }
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
  // eslint-disable-next-line class-methods-use-this -- This is intended to be overridden by subclasses
  init() {
    return Promise.resolve();
  }
  /**
   * Set the Popup object that the layer is added to
   *
   * @internal
   * @param {Popup} popup The Popup object to add the layer to
   */
  setPopup(popup) {
    this.#popup = popup ?? void 0;
  }
  /**
   * Close the popup for the layer
   *
   * @returns {void}
   */
  closePopup() {
    if (this.#popup) {
      this.#popup.close();
    }
  }
  /**
   * Get the Popup object that the layer is added to
   *
   * @returns {Popup|undefined}
   */
  getPopup() {
    return this.#popup;
  }
  /**
   * Check if the layer has a Popup object set
   *
   * @returns {boolean}
   */
  hasPopup() {
    return this.#popup !== void 0;
  }
  /**
   * Add an event listener for when the layer is loaded and ready for use.
   *
   * @param {EventCallback} [callback] The callback function to call when the event is dispatched.
   */
  onReady(callback) {
    this.on(LayerEvents.READY, callback);
  }
  /**
   * Open the popup for the layer
   *
   * @returns {void}
   */
  openPopup() {
    if (this.#popup) {
      this.#popup.show(this);
    }
  }
  /**
   * Toggle the popup for the layer
   *
   * @returns {void}
   */
  togglePopup() {
    if (this.#popup) {
      this.#popup.toggle(this);
    }
  }
  /**
   * Clears the map object that the layer is added to
   *
   * Note, this does not remove the layer from the map, it just clears the map object from the layer.
   */
  removeMap() {
    this.#map = null;
  }
  /**
   * Sets the map object that the layer is added to
   *
   * This does not display the layer on the map, it only sets the map object for the layer.
   *
   * @param {Map} map The map object to add the layer to
   */
  setMap(map2) {
    this.#map = map2;
    if (map2) {
      this.isVisible = true;
    } else {
      this.isVisible = false;
    }
  }
};
var Layer_default = Layer;

// src/lib/DataFeature.ts
var DataFeature = class _DataFeature extends Layer_default {
  /**
   * Holds the Google maps Data.Feature object
   *
   * @private
   * @type {google.maps.Data.Feature}
   */
  #feature;
  /**
   * Holds the data layer that the feature belongs to
   *
   * @private
   * @type {DataLayer}
   */
  #layer;
  /**
   * Constructor
   *
   * @param {google.maps.Data.Feature} feature The Google maps Data.Feature object
   * @param {DataLayer} layer The data layer that the feature belongs to
   */
  constructor(feature, layer) {
    super("datafeature", "Data");
    this.#feature = feature;
    this.#layer = layer;
  }
  /**
   * Get the feature id.
   *
   * The id is only set if the GeoJson data included one, or if it was set when the
   * feature was added to the data layer.
   *
   * @returns {string|number|undefined}
   */
  get id() {
    return this.#feature.getId();
  }
  /**
   * Get the data layer that the feature belongs to.
   *
   * @returns {DataLayer}
   */
  get layer() {
    return this.#layer;
  }
  /**
   * Get the geometry type for the feature.
   *
   * This is the GeoJson geometry type. For example "Point", "LineString" or "Polygon".
   *
   * @returns {GeometryTypeValue|undefined}
   */
  get geometryType() {
    const geometry = this.#feature.getGeometry();
    if (geometry) {
      return geometry.getType();
    }
    return void 0;
  }
  /**
   * Get all of the properties for the feature as a plain object.
   *
   * The Google maps API only lets you get one property at a time, so this collects them all.
   *
   * @returns {FeatureProperties}
   */
  get properties() {
    const properties = {};
    this.#feature.forEachProperty((value, name) => {
      properties[name] = value;
    });
    return properties;
  }
  /**
   * Get the bounds of the feature.
   *
   * Every Google maps geometry object supports forEachLatLng(), which walks nested
   * geometries, so this works for every geometry type without needing to handle each one.
   *
   * @returns {LatLngBounds}
   */
  getBounds() {
    const bounds = latLngBounds();
    const geometry = this.#feature.getGeometry();
    if (geometry) {
      geometry.forEachLatLng((googleLatLng) => {
        bounds.extend(latLngConvert(googleLatLng));
      });
    }
    return bounds;
  }
  /**
   * Get the feature id.
   *
   * Alternate of the id getter.
   *
   * @returns {string|number|undefined}
   */
  getId() {
    return this.id;
  }
  /**
   * Get the geometry type for the feature.
   *
   * Alternate of the geometryType getter.
   *
   * @returns {GeometryTypeValue|undefined}
   */
  getGeometryType() {
    return this.geometryType;
  }
  /**
   * Get the data layer that the feature belongs to.
   *
   * Alternate of the layer getter.
   *
   * @returns {DataLayer}
   */
  getLayer() {
    return this.#layer;
  }
  /**
   * Get the first path of coordinates for the feature.
   *
   * For a LineString this is the line. For a Polygon this is the outer ring.
   * Use getPaths() to also get the holes in a polygon.
   *
   * @returns {LatLng[]}
   */
  getPath() {
    const paths = this.getPaths();
    return paths.length > 0 ? paths[0] : [];
  }
  /**
   * Get all of the paths of coordinates for the feature.
   *
   * For a Polygon the first path is the outer ring and any additional paths are the
   * holes within it.
   *
   * @returns {LatLng[][]}
   */
  getPaths() {
    return _DataFeature.#geometryPaths(this.#feature.getGeometry());
  }
  /**
   * Get the position of the feature if it's a Point geometry.
   *
   * @returns {LatLng|undefined}
   */
  getPosition() {
    const geometry = this.#feature.getGeometry();
    if (geometry && geometry.getType() === GeometryType.POINT) {
      return latLngConvert(geometry.get());
    }
    return void 0;
  }
  /**
   * Get a single property value for the feature.
   *
   * @param {string} key The property name to get the value for
   * @returns {any}
   */
  getProperty(key) {
    return this.#feature.getProperty(key);
  }
  /**
   * Get all of the properties for the feature as a plain object.
   *
   * Alternate of the properties getter.
   *
   * @returns {FeatureProperties}
   */
  getProperties() {
    return this.properties;
  }
  /**
   * Returns whether the feature has the given property set.
   *
   * @param {string} key The property name to test for
   * @returns {boolean}
   */
  hasProperty(key) {
    return !isNullOrUndefined(this.#feature.getProperty(key));
  }
  /**
   * Initialize the feature
   *
   * The feature always wraps an existing Google feature object, so there is nothing to
   * wait for. This exists so that objects that attach to a layer, like tooltips, work.
   *
   * @internal
   * @returns {Promise<void>}
   */
  // eslint-disable-next-line class-methods-use-this -- This overrides the Layer method
  init() {
    return Promise.resolve();
  }
  /**
   * Remove the feature from the data layer that it belongs to.
   *
   * @returns {DataFeature}
   */
  remove() {
    this.#layer.remove(this);
    return this;
  }
  /**
   * Remove a property from the feature.
   *
   * @param {string} key The property name to remove
   * @returns {DataFeature}
   */
  removeProperty(key) {
    this.#feature.removeProperty(key);
    return this;
  }
  /**
   * Reset the style for this feature back to the data layer style.
   *
   * This undoes setStyle().
   *
   * @returns {DataFeature}
   */
  resetStyle() {
    this.#layer.revertStyle(this);
    return this;
  }
  /**
   * Set the style for this one feature, overriding the data layer style.
   *
   * Use resetStyle() to go back to the data layer style.
   *
   * @param {DataStyleOptions} style The style to set on this feature
   * @returns {DataFeature}
   */
  setStyle(style) {
    this.#layer.overrideStyle(this, style);
    return this;
  }
  /**
   * Set a property value on the feature.
   *
   * @param {string} key The property name to set
   * @param {any} value The value to set
   * @returns {DataFeature}
   */
  setProperty(key, value) {
    this.#feature.setProperty(key, value);
    return this;
  }
  /**
   * Set multiple property values on the feature.
   *
   * @param {FeatureProperties} properties The properties to set
   * @returns {DataFeature}
   */
  setProperties(properties) {
    Object.keys(properties).forEach((key) => {
      this.#feature.setProperty(key, properties[key]);
    });
    return this;
  }
  /**
   * Export the feature as a GeoJson object.
   *
   * The Google maps API method is callback based. This returns a promise instead.
   *
   * @returns {Promise<object>}
   */
  toGeoJson() {
    return new Promise((resolve) => {
      this.#feature.toGeoJson((geoJson) => {
        resolve(geoJson);
      });
    });
  }
  /**
   * Returns the Google maps Data.Feature object
   *
   * @returns {google.maps.Data.Feature}
   */
  toGoogle() {
    return this.#feature;
  }
  /**
   * Get the paths of coordinates for a Google maps geometry object.
   *
   * Each geometry type holds its coordinates differently so each one is handled separately.
   * Collections are walked so that all of their paths are returned.
   *
   * @private
   * @param {google.maps.Data.Geometry} geometry The geometry object to get the paths for
   * @returns {LatLng[][]}
   */
  static #geometryPaths(geometry) {
    if (!geometry) {
      return [];
    }
    switch (geometry.getType()) {
      case GeometryType.POINT:
        return [[latLngConvert(geometry.get())]];
      case GeometryType.MULTI_POINT:
      case GeometryType.LINE_STRING:
      case GeometryType.LINEAR_RING:
        return [geometry.getArray().map((value) => latLngConvert(value))];
      case GeometryType.POLYGON:
        return geometry.getArray().map((ring) => ring.getArray().map((value) => latLngConvert(value)));
      case GeometryType.MULTI_LINE_STRING:
        return geometry.getArray().map((line) => line.getArray().map((value) => latLngConvert(value)));
      case GeometryType.MULTI_POLYGON:
        return geometry.getArray().reduce((paths, polygon) => paths.concat(_DataFeature.#geometryPaths(polygon)), []);
      case GeometryType.GEOMETRY_COLLECTION:
        return geometry.getArray().reduce((paths, value) => paths.concat(_DataFeature.#geometryPaths(value)), []);
      default:
        return [];
    }
  }
};

// src/lib/Size.ts
var Size = class _Size extends Base_default {
  /**
   * Holds the Google maps size object.
   *
   * This is created the first time that toGoogle() is called.
   *
   * @private
   * @type {google.maps.Size|undefined}
   */
  #sizeObject;
  /**
   * The width value
   *
   * @private
   * @type {number}
   */
  #width;
  /**
   * The height value
   *
   * @type {number}
   */
  #height;
  /**
   * Constructor
   *
   * @param {WidthSize|Size} [width] The X value
   * @param {number|string} [height] The Y value
   */
  constructor(width, height) {
    super("size");
    this.#height = 0;
    this.#width = 0;
    if (isNumber(width) && isNumber(height)) {
      this.#width = width;
      this.#height = height;
    } else if (typeof width !== "undefined") {
      this.set(width, height);
    }
  }
  /**
   * Get the height value
   *
   * @returns {number}
   */
  get height() {
    return this.#height;
  }
  /**
   * Set the height value
   *
   * @param {number|string} height The height value. Ideally it's a number but it could be a number string
   */
  set height(height) {
    if (isNumberString(height)) {
      this.#height = Number(height);
    } else if (isNumber(height)) {
      this.#height = height;
    }
    if (this.#sizeObject !== void 0) {
      this.#sizeObject.height = this.#height;
    }
  }
  /**
   * Get the width value
   *
   * @returns {number}
   */
  get width() {
    return this.#width;
  }
  /**
   * Set the width value
   *
   * @param {number|string} width The width value. Ideally it's a number but it could be a number string
   */
  set width(width) {
    if (isNumberString(width)) {
      this.#width = Number(width);
    } else if (isNumber(width)) {
      this.#width = width;
    }
    if (this.#sizeObject !== void 0) {
      this.#sizeObject.width = this.#width;
    }
  }
  /**
   * Returns a new copy of the size
   *
   * @returns {Size}
   */
  clone() {
    return new _Size(this.#width, this.#height);
  }
  /**
   * Get the height value
   *
   * @returns {number}
   */
  getHeight() {
    return this.#height;
  }
  /**
   * Get the width value
   *
   * @returns {number}
   */
  getWidth() {
    return this.#width;
  }
  /**
   * Returns whether the width/height pair are valid values
   *
   * @returns {boolean}
   */
  isValid() {
    return isNumber(this.#width) && isNumber(this.#height);
  }
  /**
   * Set the width/height values
   *
   * @param {WidthSize|Size} width The width value, or the Size object, or an arraheight of [width, height] pairs, or a {width, height} object
   * @param {number|string} height The height value
   * @returns {Size}
   */
  set(width, height) {
    if (Array.isArray(width)) {
      const [widthValue, heightValue] = width;
      this.width = widthValue;
      this.height = heightValue;
    } else if (isObject(width)) {
      const widthObject = width;
      if (typeof widthObject.width !== "undefined") {
        this.width = widthObject.width;
      }
      if (typeof widthObject.height !== "undefined") {
        this.height = widthObject.height;
      }
    } else if (width instanceof _Size) {
      this.width = width.getWidth();
      this.height = width.getHeight();
    } else {
      this.width = width;
      if (typeof height !== "undefined") {
        this.height = height;
      }
    }
    return this;
  }
  /**
   * Set the height value
   *
   * @param {number|string} height The height value. Ideally it's a number but it could be a number string
   * @returns {Size}
   */
  setHeight(height) {
    this.height = height;
    return this;
  }
  /**
   * Set the width value
   *
   * @param {number|string} width The width value. Ideally it's a number but it could be a number string
   * @returns {Size}
   */
  setWidth(width) {
    this.width = width;
    return this;
  }
  /**
   * Returns the Google maps size object
   *
   * https://developers.google.com/maps/documentation/javascript/reference/coordinates#Size
   *
   * @returns {google.maps.Size|null}
   */
  toGoogle() {
    if (checkForGoogleMaps("Size", "Size")) {
      if (this.#sizeObject === void 0) {
        this.#sizeObject = new google.maps.Size(this.#width, this.#height);
      }
      return this.#sizeObject;
    }
    return null;
  }
};
var size = (width, height) => new Size(width, height);

// src/lib/Icon.ts
var POINT_OPTIONS = ["anchor", "labelOrigin", "origin"];
var SIZE_OPTIONS = ["scaledSize", "size"];
var STRING_OPTIONS = ["url"];
var Icon = class extends Base_default {
  /**
   * Holds the Google maps icon options
   */
  #options;
  /**
   * Constructor
   *
   * @param {string | IconOptions} [url] The URL for the icon or the icon options
   * @param {IconOptions} [options] The icon options
   */
  constructor(url, options) {
    super("icon");
    this.#options = { url: "" };
    if (typeof url === "string") {
      this.#options = {
        url
      };
      if (options) {
        this.setOptions(options);
      }
    } else if (isObject(url)) {
      this.setOptions(url);
    }
  }
  /**
   * Set the icon options
   *
   * @param {IconOptions} options The icon options
   * @returns {Icon}
   */
  setOptions(options) {
    if (isObject(options)) {
      POINT_OPTIONS.forEach((key) => {
        const value = options[key];
        if (value) {
          this.#options[key] = point(value).toGoogle();
        }
      });
      SIZE_OPTIONS.forEach((key) => {
        const value = options[key];
        if (value) {
          this.#options[key] = size(value).toGoogle();
        }
      });
      STRING_OPTIONS.forEach((key) => {
        const value = options[key];
        if (value && isStringWithValue(value)) {
          this.#options[key] = value;
        }
      });
    }
    return this;
  }
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
  setAnchor(anchor) {
    this.#options.anchor = point(anchor).toGoogle();
    return this;
  }
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
  setLabelOrigin(origin) {
    this.#options.labelOrigin = point(origin).toGoogle();
    return this;
  }
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
  setOrigin(origin) {
    this.#options.origin = point(origin).toGoogle();
    return this;
  }
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
  setScaledSize(sizeValue) {
    this.#options.scaledSize = size(sizeValue).toGoogle();
    return this;
  }
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
  setSize(sizeValue) {
    this.#options.size = size(sizeValue).toGoogle();
    return this;
  }
  /**
   * Set the icon URL
   *
   * @param {string} url The icon URL
   * @returns {Icon}
   */
  setUrl(url) {
    this.#options.url = url;
    return this;
  }
  /**
   * Get the icon options
   *
   * @returns {google.maps.Icon}
   */
  toGoogle() {
    return this.#options;
  }
};
var icon = (url, options) => {
  if (url instanceof Icon) {
    return url;
  }
  return new Icon(url, options);
};

// src/lib/Map/FullscreenControl.ts
var FullscreenControl = class {
  /**
   * Holds whether the Fullscreen control is enabled or not
   *
   * @private
   * @type {boolean}
   */
  #enabled = true;
  /**
   * The position of the control on the map
   *
   * https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
   *
   * @private
   * @type {ControlPosition}
   */
  #position = ControlPosition.INLINE_END_BLOCK_START;
  /**
   * Class constructor
   *
   * @param {FullscreenControlOptions | boolean} [options] Either the FullscreenControl options or a boolean value to disable the control.
   */
  constructor(options) {
    if (isBoolean(options)) {
      this.#enabled = options;
    }
    if (isObject(options)) {
      if (isBoolean(options.enabled)) {
        this.enabled = options.enabled;
      }
      if (options.position) {
        this.position = options.position;
      }
    }
  }
  /**
   * Get whether the Fullscreen control is enabled.
   *
   * @returns {boolean}
   */
  get enabled() {
    return this.#enabled;
  }
  /**
   * Set whether the Fullscreen control is enabled.
   *
   * @param {boolean} value The enabled/disabled state
   */
  set enabled(value) {
    if (isBoolean(value)) {
      this.#enabled = value;
    }
  }
  /**
   * Get the fullscreen control position
   *
   * @returns {ControlPosition}
   */
  get position() {
    return this.#position;
  }
  /**
   * Set the fullscreen control position
   *
   * @param {ControlPosition} value The position of the control
   */
  set position(value) {
    if (Object.values(ControlPosition).includes(value)) {
      this.#position = value;
    } else {
      console.warn("The Fullscreen position that you provided is not valid. You provided: ", value);
    }
  }
  /**
   * Disable the Fullscreen control
   *
   * @returns {FullscreenControl}
   */
  disable() {
    this.#enabled = false;
    return this;
  }
  /**
   * Enable the Fullscreen control
   *
   * @returns {FullscreenControl}
   */
  enable() {
    this.#enabled = true;
    return this;
  }
  /**
   * Set the position of the control
   * https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
   *
   * @param {ControlPositionValue} position The position of the control
   * @returns {FullscreenControl}
   */
  setPosition(position) {
    this.#position = position;
    return this;
  }
  /**
   * Get the Fullscreen Control options Google Maps object
   *
   * @returns {Promise<google.maps.FullscreenControlOptions>}
   */
  toGoogle() {
    return new Promise((resolve) => {
      loader().onLoad(() => {
        resolve({
          position: convertControlPosition(this.#position)
        });
      });
    });
  }
};
var fullscreenControl = (options) => {
  if (options instanceof FullscreenControl) {
    return options;
  }
  return new FullscreenControl(options);
};

// src/lib/Map/MapRestriction.ts
var MapRestriction = class {
  /**
   * Whether the MapRestriction object is enabled
   *
   * @private
   * @type {boolean}
   */
  #enabled = true;
  /**
   * The latitude/longitude bounds that a user is restricted to.
   *
   * @private
   * @type {LatLngBounds|undefined}
   */
  #latLngBounds;
  /**
   * If true, anything outside of the latLngBounds will be hidden when zooming. This can restrict how much the user can zoom out.
   *
   * @private
   * @type {boolean}
   */
  #strictBounds = false;
  /**
   * Class constructor
   *
   * @param {MapRestrictionOptions | LatLngBoundsValue | boolean} [options] Either the MapRestriction options just the LatLng bounds value.
   */
  constructor(options) {
    if (isBoolean(options)) {
      this.enabled = options;
    } else if (options instanceof LatLngBounds) {
      this.latLngBounds = options;
    } else if (isObject(options)) {
      const opts = options;
      if (typeof opts.enabled !== "undefined" || typeof opts.latLngBounds !== "undefined" || typeof opts.strictBounds !== "undefined") {
        if (isBoolean(opts.enabled)) {
          this.enabled = opts.enabled;
        }
        if (typeof opts.latLngBounds !== "undefined") {
          this.latLngBounds = opts.latLngBounds;
        }
        if (isBoolean(opts.strictBounds)) {
          this.strictBounds = opts.strictBounds;
        }
      } else {
        this.latLngBounds = options;
      }
    } else if (Array.isArray(options)) {
      this.latLngBounds = options;
    }
  }
  /**
   * Get whether the MapRestriction object is enabled
   *
   * @returns {boolean}
   */
  get enabled() {
    return this.#enabled;
  }
  /**
   * Set whether the MapRestriction object is enabled
   *
   * @param {boolean} value Whether the MapRestriction object is enabled
   */
  set enabled(value) {
    if (isBoolean(value)) {
      this.#enabled = value;
    }
  }
  /**
   * Get the existing latitude/longitude bounds
   *
   * @returns {LatLngBounds | undefined}
   */
  get latLngBounds() {
    return this.#latLngBounds;
  }
  /**
   * Set the latitude/longitude bounds
   *
   * @param {LatLngBoundsValue} value The lat/lng bounds value
   */
  set latLngBounds(value) {
    this.#latLngBounds = latLngBounds(value);
  }
  /**
   * Get whether the bounds are strict
   *
   * @returns {boolean}
   */
  get strictBounds() {
    return this.#strictBounds;
  }
  /**
   * Set whether the bounds are strict
   *
   * @param {boolean} value Whether the bounds are strict
   */
  set strictBounds(value) {
    if (isBoolean(value)) {
      this.#strictBounds = value;
    }
  }
  /**
   * Disable the map restriction
   *
   * @returns {MapRestriction}
   */
  disable() {
    this.#enabled = false;
    return this;
  }
  /**
   * Enable the map restriction
   *
   * @returns {MapRestriction}
   */
  enable() {
    this.#enabled = true;
    return this;
  }
  /**
   * Returns whether the MapRestriction object is enabled
   *
   * @returns {boolean}
   */
  isEnabled() {
    return this.#enabled;
  }
  /**
   * Returns if the MapRestriction object is valid
   *
   * @returns {boolean}
   */
  isValid() {
    let valid = false;
    if (this.#latLngBounds) {
      const json = this.#latLngBounds.toJson();
      if (json.east !== json.west && json.north !== json.south) {
        valid = true;
      } else {
        console.error("The MapRestrictions latLngBounds value must have at least two different LatLng values.");
      }
    }
    return valid;
  }
  /**
   * Set the latitude/longitude bounds
   *
   * @param {LatLngBoundsValue} value The lat/lng bounds value
   * @returns {MapRestriction}
   */
  setLatLngBounds(value) {
    this.latLngBounds = value;
    return this;
  }
  /**
   * Set whether the bounds are strict
   *
   * @param {boolean} value Whether the bounds are strict
   * @returns {MapRestriction}
   */
  setStrictBounds(value) {
    this.strictBounds = value;
    return this;
  }
  /**
   * Get the MapRestriction Google Maps object
   *
   * @returns {Promise<google.maps.MapRestriction>}
   */
  toGoogle() {
    return new Promise((resolve, reject) => {
      if (!this.#latLngBounds) {
        reject(new Error("The MapRestriction latLngBounds value must be set before it can be used."));
        return;
      }
      this.#latLngBounds.toGoogle().then((bounds) => {
        resolve({
          latLngBounds: bounds,
          strictBounds: this.#strictBounds
        });
      });
    });
  }
};
var mapRestriction = (options) => {
  if (options instanceof MapRestriction) {
    return options;
  }
  return new MapRestriction(options);
};

// src/lib/Map/MapTypeControl.ts
var MapTypeControl = class {
  /**
   * Holds whether the Map Type control is enabled or not
   *
   * @private
   * @type {boolean}
   */
  #enabled = true;
  /**
   * The map type ids to include in the control
   *
   * https://developers.google.com/maps/documentation/javascript/reference/map#MapTypeId
   *
   * @private
   * @type {MapTypeId[]}
   */
  #mapTypeIds;
  /**
   * The position of the control on the map
   *
   * https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
   *
   * @private
   * @type {ControlPosition}
   */
  #position = ControlPosition.BLOCK_START_INLINE_START;
  /**
   * The style of the control
   *
   * https://developers.google.com/maps/documentation/javascript/reference/control#MapTypeControlStyle
   *
   * @private
   * @type {MapTypeControlStyle}
   */
  #style = MapTypeControlStyle.DEFAULT;
  /**
   * Holds whether the hybrid map type is enabled
   *
   * @private
   * @type {boolean}
   */
  #typeHybrid = true;
  /**
   * Holds whether the roadmap map type is enabled
   *
   * @private
   * @type {boolean}
   */
  #typeRoadmap = true;
  /**
   * Holds whether the satellite map type is enabled
   *
   * @private
   * @type {boolean}
   */
  #typeSatellite = true;
  /**
   * Holds whether the terrain map type is enabled
   *
   * @private
   * @type {boolean}
   */
  #typeTerrain = true;
  /**
   * Class constructor
   *
   * @param {MapTypeControlOptions | boolean} [options] Either the MapTypeControl options or a boolean value to disable the control.
   */
  constructor(options) {
    if (isBoolean(options)) {
      this.#enabled = options;
    }
    this.#mapTypeIds = [];
    this.#mapTypeIds.push(MapTypeId.HYBRID);
    this.#mapTypeIds.push(MapTypeId.ROADMAP);
    this.#mapTypeIds.push(MapTypeId.SATELLITE);
    this.#mapTypeIds.push(MapTypeId.TERRAIN);
    if (isObject(options)) {
      if (isBoolean(options.enabled)) {
        this.enabled = options.enabled;
      }
      if (options.mapTypeIds) {
        this.setMapTypeIds(options.mapTypeIds);
      }
      if (options.position) {
        this.position = options.position;
      }
      if (options.style) {
        this.style = options.style;
      }
    }
  }
  /**
   * Get whether the Map Type control is enabled.
   *
   * @returns {boolean}
   */
  get enabled() {
    return this.#enabled;
  }
  /**
   * Set whether the Map Type control is enabled.
   *
   * @param {boolean} value The enabled/disabled state
   */
  set enabled(value) {
    if (isBoolean(value)) {
      this.#enabled = value;
    }
  }
  /**
   * Get whether the hybrid map type is enabled
   *
   * @returns {boolean}
   */
  get hybrid() {
    return this.#typeHybrid;
  }
  /**
   * Set whether the hybrid map type is enabled
   *
   * @param {boolean} value The enabled/disabled state
   */
  set hybrid(value) {
    if (isBoolean(value)) {
      this.#typeHybrid = value;
      this.#setMapType(MapTypeId.HYBRID, value);
    }
  }
  /**
   * Get the map type control position
   *
   * @returns {ControlPosition}
   */
  get position() {
    return this.#position;
  }
  /**
   * Set the map type control position
   *
   * @param {ControlPosition} value The position of the control
   */
  set position(value) {
    if (Object.values(ControlPosition).includes(value)) {
      this.#position = value;
    } else {
      console.warn("The MapType position that you provided is not valid. You provided: ", value);
    }
  }
  /**
   * Get whether the roadmap map type is enabled
   *
   * @returns {boolean}
   */
  get roadmap() {
    return this.#typeRoadmap;
  }
  /**
   * Set whether the roadmap map type is enabled
   *
   * @param {boolean} value The enabled/disabled state
   */
  set roadmap(value) {
    if (isBoolean(value)) {
      this.#typeRoadmap = value;
      this.#setMapType(MapTypeId.ROADMAP, value);
    }
  }
  /**
   * Get whether the satellite map type is enabled
   *
   * @returns {boolean}
   */
  get satellite() {
    return this.#typeSatellite;
  }
  /**
   * Set whether the satellite map type is enabled
   *
   * @param {boolean} value The enabled/disabled state
   */
  set satellite(value) {
    if (isBoolean(value)) {
      this.#typeSatellite = value;
      this.#setMapType(MapTypeId.SATELLITE, value);
    }
  }
  /**
   * Get the map type control style
   *
   * @returns {MapTypeControlStyle}
   */
  get style() {
    return this.#style;
  }
  /**
   * Set the map type control style
   *
   * @param {MapTypeControlStyleValue} value The style of the control
   */
  set style(value) {
    this.#style = value;
  }
  /**
   * Get whether the terrain map type is enabled
   *
   * @returns {boolean}
   */
  get terrain() {
    return this.#typeTerrain;
  }
  /**
   * Set whether the terrain map type is enabled
   *
   * @param {boolean} value The enabled/disabled state
   */
  set terrain(value) {
    if (isBoolean(value)) {
      this.#typeTerrain = value;
      this.#setMapType(MapTypeId.TERRAIN, value);
    }
  }
  /**
   * Disable the Map Type control
   *
   * @returns {MapTypeControl}
   */
  disable() {
    this.#enabled = false;
    return this;
  }
  /**
   * Enable the Map Type control
   *
   * @returns {MapTypeControl}
   */
  enable() {
    this.#enabled = true;
    return this;
  }
  /**
   * Returns whether the Map Type control is using the map type id
   *
   * @param {MapTypeIdValue} mapTypeId The map type id to check
   * @returns {boolean}
   */
  hasMapType(mapTypeId) {
    return this.#mapTypeIds.includes(mapTypeId);
  }
  /**
   * Add or remove a map type from the map types included in the control.
   *
   * This keeps the map type ids that are sent to Google in sync with the hybrid, roadmap, satellite,
   * and terrain properties.
   *
   * @private
   * @param {MapTypeIdValue} mapTypeId The map type id to add or remove
   * @param {boolean} enabled Whether to include the map type in the control
   */
  #setMapType(mapTypeId, enabled) {
    if (enabled) {
      if (!this.#mapTypeIds.includes(mapTypeId)) {
        this.#mapTypeIds.push(mapTypeId);
      }
    } else {
      this.#mapTypeIds = this.#mapTypeIds.filter((id) => id !== mapTypeId);
    }
  }
  /**
   * Set the map type ids to include in the control
   *
   * @param {MapTypeIdValue[]} mapTypeIds The map type ids to include in the control
   * @returns {MapTypeControl}
   */
  setMapTypeIds(mapTypeIds) {
    if (Array.isArray(mapTypeIds) && mapTypeIds.length > 0) {
      const validMapTypeIds = mapTypeIds.filter((mapTypeId) => Object.values(MapTypeId).includes(mapTypeId));
      if (validMapTypeIds.length > 0) {
        this.#mapTypeIds = validMapTypeIds;
        this.#typeHybrid = validMapTypeIds.includes(MapTypeId.HYBRID);
        this.#typeRoadmap = validMapTypeIds.includes(MapTypeId.ROADMAP);
        this.#typeSatellite = validMapTypeIds.includes(MapTypeId.SATELLITE);
        this.#typeTerrain = validMapTypeIds.includes(MapTypeId.TERRAIN);
      }
    }
    return this;
  }
  /**
   * Set the position of the control
   * https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
   *
   * @param {ControlPositionValue} position The position of the control
   * @returns {MapTypeControl}
   */
  setPosition(position) {
    this.#position = position;
    return this;
  }
  /**
   * Set the style of the control
   * https://developers.google.com/maps/documentation/javascript/reference/control#MapTypeControlStyle
   *
   * @param {MapTypeControlStyleValue} style The style of the control
   * @returns {MapTypeControl}
   */
  setStyle(style) {
    this.#style = style;
    return this;
  }
  /**
   * Get the MapTypeControl options Google Maps object
   *
   * @returns {Promise<google.maps.MapTypeControlOptions>}
   */
  toGoogle() {
    return new Promise((resolve) => {
      loader().onLoad(() => {
        resolve({
          mapTypeIds: this.#mapTypeIds,
          position: convertControlPosition(this.#position),
          // position: 21,
          // style: this.#style,
          // style: 2,
          style: convertMapTypeControlStyle(this.#style)
        });
      });
    });
  }
};
var mapTypeControl = (options) => {
  if (options instanceof MapTypeControl) {
    return options;
  }
  return new MapTypeControl(options);
};

// src/lib/Map/MapStyle.ts
var MapStyle = class {
  /**
   * he element type to which the styles should be applied to. If not set then the styles are applied to all elements.
   *
   * @private
   * @type {string}
   */
  #elementType = "all";
  /**
   * The feature type to which the styles should be applied to. If not set then the styles are applied to all features.
   *
   * @private
   * @type {string}
   */
  #featureType = "all";
  /**
   * The styles to apply to the map
   *
   * @private
   * @type {Style[]}
   */
  #styles = [];
  /**
   * Class constructor
   *
   * @param {MapStyleOptions | Style | Style[]} [options] Either the MapStyle options, a single style, or an array of styles
   */
  constructor(options) {
    if (isObject(options)) {
      if (isDefined(options.elementType) || isDefined(options.featureType) || isDefined(options.styles) || isDefined(options.stylers)) {
        const opts = options;
        if (opts.elementType) {
          this.elementType = opts.elementType;
        }
        if (opts.featureType) {
          this.featureType = opts.featureType;
        }
        if (opts.styles) {
          this.styles = opts.styles;
        } else if (opts.stylers) {
          this.styles = opts.stylers;
        }
      } else {
        this.styles = options;
      }
    } else if (Array.isArray(options)) {
      this.styles = options;
    }
  }
  /**
   * Get the element type to apply styles to
   *
   * @returns {string}
   */
  get elementType() {
    return this.#elementType;
  }
  /**
   * Set the element type to apply styles to
   *
   * @param {string} value The element type to apply values to
   */
  set elementType(value) {
    if (isStringWithValue(value)) {
      this.#elementType = value;
    }
  }
  /**
   * Get the feature type to apply styles to
   *
   * @returns {string}
   */
  get featureType() {
    return this.#featureType;
  }
  /**
   * Set the feature type to apply styles to
   *
   * @param {string} value The feature type to apply values to
   */
  set featureType(value) {
    if (isStringWithValue(value)) {
      this.#featureType = value;
    }
  }
  /**
   * Get the styles to apply to the map
   *
   * @returns {Style[]}
   */
  get styles() {
    return this.#styles;
  }
  /**
   * Set the styles to apply to the map
   *
   * @param {Style | Style[]} value The style or styles to apply to the map
   */
  set styles(value) {
    if (Array.isArray(value)) {
      this.#styles = value;
    } else if (isObject(value)) {
      this.#styles = [value];
    }
  }
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
  addStyle(property, value) {
    if (isStringWithValue(property) && isStringOrNumber(value)) {
      this.#styles.push({ [property]: value });
    }
    return this;
  }
  /**
   * Set the element type to apply styles to
   *
   * @param {string} value The element type to apply values to
   * @returns {MapStyle}
   */
  setElementType(value) {
    this.elementType = value;
    return this;
  }
  /**
   * Set the feature type to apply styles to
   *
   * @param {string} value The feature type to apply values to
   * @returns {MapStyle}
   */
  setFeatureType(value) {
    this.featureType = value;
    return this;
  }
  /**
   * Set the styles to apply to the map
   *
   * @param { Style|Style[]} value The style or styles to apply to the map
   * @returns {MapStyle}
   */
  setStyles(value) {
    this.styles = value;
    return this;
  }
  /**
   * Get the MapTypeStyle Google Maps object
   *
   * @returns {google.maps.MapTypeStyle}
   */
  toGoogle() {
    return {
      elementType: this.#elementType,
      featureType: this.#featureType,
      stylers: this.#styles
    };
  }
};
var mapStyle = (options) => {
  if (options instanceof MapStyle) {
    return options;
  }
  return new MapStyle(options);
};

// src/lib/Map/RotateControl.ts
var RotateControl = class {
  /**
   * Holds whether the Rotate control is enabled or not
   *
   * @private
   * @type {boolean}
   */
  #enabled = true;
  /**
   * The position of the control on the map
   *
   * https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
   *
   * @private
   * @type {ControlPosition}
   */
  #position = ControlPosition.INLINE_END_BLOCK_START;
  /**
   * Class constructor
   *
   * @param {RotateControlOptions | boolean} [options] Either the RotateControl options or a boolean value to disable the control.
   */
  constructor(options) {
    if (isBoolean(options)) {
      this.#enabled = options;
    }
    if (isObject(options)) {
      if (isBoolean(options.enabled)) {
        this.enabled = options.enabled;
      }
      if (options.position) {
        this.position = options.position;
      }
    }
  }
  /**
   * Get whether the Rotate control is enabled.
   *
   * @returns {boolean}
   */
  get enabled() {
    return this.#enabled;
  }
  /**
   * Set whether the Rotate control is enabled.
   *
   * @param {boolean} value The enabled/disabled state
   */
  set enabled(value) {
    if (isBoolean(value)) {
      this.#enabled = value;
    }
  }
  /**
   * Get the rotate control position
   *
   * @returns {ControlPosition}
   */
  get position() {
    return this.#position;
  }
  /**
   * Set the rotate control position
   *
   * @param {ControlPosition} value The position of the control
   */
  set position(value) {
    if (Object.values(ControlPosition).includes(value)) {
      this.#position = value;
    } else {
      console.warn("The Rotate position that you provided is not valid. You provided: ", value);
    }
  }
  /**
   * Disable the Rotate control
   *
   * @returns {RotateControl}
   */
  disable() {
    this.#enabled = false;
    return this;
  }
  /**
   * Enable the Rotate control
   *
   * @returns {RotateControl}
   */
  enable() {
    this.#enabled = true;
    return this;
  }
  /**
   * Set the position of the control
   * https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
   *
   * @param {ControlPositionValue} position The position of the control
   * @returns {RotateControl}
   */
  setPosition(position) {
    this.#position = position;
    return this;
  }
  /**
   * Get the Rotate Control options Google Maps object
   *
   * @returns {Promise<google.maps.RotateControlOptions>}
   */
  toGoogle() {
    return new Promise((resolve) => {
      loader().onLoad(() => {
        resolve({
          position: convertControlPosition(this.#position)
        });
      });
    });
  }
};
var rotateControl = (options) => {
  if (options instanceof RotateControl) {
    return options;
  }
  return new RotateControl(options);
};

// src/lib/Map/ScaleControl.ts
var ScaleControl = class {
  /**
   * Holds whether the Scale control is enabled or not
   *
   * @private
   * @type {boolean}
   */
  #enabled = false;
  /**
   * Class constructor
   *
   * @param {ScaleControlOptions | boolean} [options] Either the ScaleControl options or a boolean value to disable the control.
   */
  constructor(options) {
    if (isBoolean(options)) {
      this.#enabled = options;
    }
    if (isObject(options)) {
      if (isBoolean(options.enabled)) {
        this.#enabled = options.enabled;
      }
    }
  }
  /**
   * Get whether the Scale control is enabled.
   *
   * @returns {boolean}
   */
  get enabled() {
    return this.#enabled;
  }
  /**
   * Set whether the Scale control is enabled.
   *
   * @param {boolean} value The enabled/disabled state
   */
  set enabled(value) {
    if (isBoolean(value)) {
      this.#enabled = value;
    }
  }
  /**
   * Disable the Scale control
   *
   * @returns {ScaleControl}
   */
  disable() {
    this.#enabled = false;
    return this;
  }
  /**
   * Enable the Scale control
   *
   * @returns {ScaleControl}
   */
  enable() {
    this.#enabled = true;
    return this;
  }
  /**
   * Get the Scale Control options Google Maps object
   *
   * @returns {Promise<google.maps.ScaleControlOptions>}
   */
  // eslint-disable-next-line class-methods-use-this
  toGoogle() {
    return new Promise((resolve) => {
      loader().onLoad(() => {
        resolve({
          style: google.maps.ScaleControlStyle.DEFAULT
        });
      });
    });
  }
};
var scaleControl = (options) => {
  if (options instanceof ScaleControl) {
    return options;
  }
  return new ScaleControl(options);
};

// src/lib/Map/StreetViewControl.ts
var StreetViewControl = class {
  /**
   * Holds whether the StreetView control is enabled or not
   *
   * @private
   * @type {boolean}
   */
  #enabled = true;
  /**
   * The position of the control on the map
   *
   * https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
   *
   * @private
   * @type {ControlPosition}
   */
  #position = ControlPosition.INLINE_END_BLOCK_END;
  /**
   * The sources of the street view control
   *
   * @private
   * @type {StreetViewSourceValue[]}
   */
  #sources = [StreetViewSource.DEFAULT];
  /**
   * Class constructor
   *
   * @param {StreetViewControlOptions | boolean} [options] Either the StreetViewControl options or a boolean value to disable the control.
   */
  constructor(options) {
    if (isBoolean(options)) {
      this.#enabled = options;
    }
    if (isObject(options)) {
      if (isBoolean(options.enabled)) {
        this.enabled = options.enabled;
      }
      if (options.position) {
        this.position = options.position;
      }
      if (options.sources) {
        this.sources = options.sources;
      }
    }
  }
  /**
   * Get whether the StreetView control is enabled.
   *
   * @returns {boolean}
   */
  get enabled() {
    return this.#enabled;
  }
  /**
   * Set whether the StreetView control is enabled.
   *
   * @param {boolean} value The enabled/disabled state
   */
  set enabled(value) {
    if (isBoolean(value)) {
      this.#enabled = value;
    }
  }
  /**
   * Get the street view control position
   *
   * @returns {ControlPosition}
   */
  get position() {
    return this.#position;
  }
  /**
   * Set the street view control position
   *
   * @param {ControlPosition} value The position of the control
   */
  set position(value) {
    if (Object.values(ControlPosition).includes(value)) {
      this.#position = value;
    } else {
      console.warn("The Street View position that you provided is not valid. You provided: ", value);
    }
  }
  /**
   * Get the sources of the street view control
   *
   * @returns {StreetViewSourceValue[]}
   */
  get sources() {
    return this.#sources;
  }
  /**
   * Set the sources of the street view control
   *
   * @param {StreetViewSourceValue | StreetViewSourceValue[]} value The source or sources of the street view control
   */
  set sources(value) {
    const sources = Array.isArray(value) ? value : [value];
    const validSources = sources.filter((source) => Object.values(StreetViewSource).includes(source));
    if (validSources.length > 0) {
      this.#sources = validSources;
    } else {
      console.warn("The Street View sources that you provided are not valid. You provided: ", value);
    }
  }
  /**
   * Disable the StreetView control
   *
   * @returns {StreetViewControl}
   */
  disable() {
    this.#enabled = false;
    return this;
  }
  /**
   * Enable the StreetView control
   *
   * @returns {StreetViewControl}
   */
  enable() {
    this.#enabled = true;
    return this;
  }
  /**
   * Set the position of the control
   * https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
   *
   * @param {ControlPositionValue} position The position of the control
   * @returns {StreetViewControl}
   */
  setPosition(position) {
    this.position = position;
    return this;
  }
  /**
   * Set the sources of the street view control
   *
   * @param {StreetViewSourceValue | StreetViewSourceValue[]} sources The source or sources of the street view control
   * @returns {StreetViewControl}
   */
  setSources(sources) {
    this.sources = sources;
    return this;
  }
  /**
   * Get the StreetView Control options Google Maps object
   *
   * @returns {Promise<google.maps.StreetViewControlOptions>}
   */
  toGoogle() {
    return new Promise((resolve) => {
      loader().onLoad(() => {
        resolve({
          position: convertControlPosition(this.#position),
          // The StreetViewSource values are the same strings that Google's StreetViewSource enum uses
          sources: this.#sources
        });
      });
    });
  }
};
var streetViewControl = (options) => {
  if (options instanceof StreetViewControl) {
    return options;
  }
  return new StreetViewControl(options);
};

// src/lib/Map/ZoomControl.ts
var ZoomControl = class {
  /**
   * Holds whether the Zoom control is enabled or not
   *
   * @private
   * @type {boolean}
   */
  #enabled = true;
  /**
   * The position of the control on the map
   *
   * https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
   *
   * @private
   * @type {ControlPosition}
   */
  #position = ControlPosition.INLINE_END_BLOCK_END;
  /**
   * Class constructor
   *
   * @param {ZoomControlOptions | boolean} [options] Either the ZoomControl options or a boolean value to disable the control.
   */
  constructor(options) {
    if (isBoolean(options)) {
      this.#enabled = options;
    }
    if (isObject(options)) {
      if (isBoolean(options.enabled)) {
        this.enabled = options.enabled;
      }
      if (options.position) {
        this.position = options.position;
      }
    }
  }
  /**
   * Get whether the Zoom control is enabled.
   *
   * @returns {boolean}
   */
  get enabled() {
    return this.#enabled;
  }
  /**
   * Set whether the Zoom control is enabled.
   *
   * @param {boolean} value The enabled/disabled state
   */
  set enabled(value) {
    if (isBoolean(value)) {
      this.#enabled = value;
    }
  }
  /**
   * Get the zoom control position
   *
   * @returns {ControlPosition}
   */
  get position() {
    return this.#position;
  }
  /**
   * Set the zoom control position
   *
   * @param {ControlPosition} value The position of the control
   */
  set position(value) {
    if (Object.values(ControlPosition).includes(value)) {
      this.#position = value;
    } else {
      console.warn("The Zoom position that you provided is not valid. You provided: ", value);
    }
  }
  /**
   * Disable the Zoom control
   *
   * @returns {ZoomControl}
   */
  disable() {
    this.#enabled = false;
    return this;
  }
  /**
   * Enable the Zoom control
   *
   * @returns {ZoomControl}
   */
  enable() {
    this.#enabled = true;
    return this;
  }
  /**
   * Set the position of the control
   * https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
   *
   * @param {ControlPositionValue} position The position of the control
   * @returns {ZoomControl}
   */
  setPosition(position) {
    this.#position = position;
    return this;
  }
  /**
   * Get the Zoom Control options Google Maps object
   *
   * @returns {Promise<google.maps.ZoomControlOptions>}
   */
  toGoogle() {
    return new Promise((resolve) => {
      loader().onLoad(() => {
        resolve({
          position: convertControlPosition(this.#position)
        });
      });
    });
  }
};
var zoomControl = (options) => {
  if (options instanceof ZoomControl) {
    return options;
  }
  return new ZoomControl(options);
};

// src/lib/SvgSymbol.ts
var NUMBER_OPTIONS = [
  "fillOpacity",
  "rotation",
  "scale",
  "strokeOpacity",
  "strokeWeight"
];
var POINT_OPTIONS2 = ["anchor", "labelOrigin"];
var STRING_OPTIONS2 = ["fillColor", "path", "strokeColor"];
var SvgSymbol = class extends Base_default {
  /**
   * Holds the icon options
   *
   * @private
   * @type {SymbolOptions}
   */
  #options;
  /**
   * Constructor
   *
   * @param {string | SvgSymbolOptions} [path] The SVG path for the icon or the icon options
   * @param {SvgSymbolOptions} [options] The options for the icon
   */
  constructor(path, options) {
    super("svgsymbol");
    this.#options = {
      path: ""
    };
    if (typeof path === "string") {
      this.#options.path = path;
      if (options) {
        this.setOptions(options);
      }
    } else if (isObject(path)) {
      this.setOptions(path);
    }
  }
  /**
   * Get the anchor point
   *
   * @returns {PointValue}
   */
  get anchor() {
    return point(this.#options.anchor ?? void 0);
  }
  /**
   * Set the position at which to anchor an image in correspondence to the location of the marker on the map.
   *
   * @param {PointValue} anchor The anchor point value
   */
  set anchor(anchor) {
    this.#options.anchor = point(anchor).toGoogle();
  }
  /**
   * Get the SVG fill color
   *
   * @returns {string|null|undefined}
   */
  get fillColor() {
    return this.#options.fillColor;
  }
  /**
   * Set the SVG fill color.
   *
   * @param {string} fillColor The SVG fill color.
   */
  set fillColor(fillColor) {
    if (isStringWithValue(fillColor)) {
      this.#options.fillColor = fillColor;
    }
  }
  /**
   * Get the opacity for the fill
   *
   * @returns {number|null|undefined}
   */
  get fillOpacity() {
    return this.#options.fillOpacity;
  }
  /**
   * Set the opacity for the fill
   *
   * @param {number|string} fillOpacity The opacity for the fill
   */
  set fillOpacity(fillOpacity) {
    if (isNumber(fillOpacity)) {
      this.#options.fillOpacity = fillOpacity;
    } else if (isNumberString(fillOpacity)) {
      this.#options.fillOpacity = Number(fillOpacity);
    }
  }
  /**
   * Get the origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
   *
   * @returns {PointValue|null|undefined}
   */
  get labelOrigin() {
    return this.#options.labelOrigin;
  }
  /**
   * Set the origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
   *
   * @param {PointValue} labelOrigin The origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
   */
  set labelOrigin(labelOrigin) {
    this.#options.labelOrigin = point(labelOrigin).toGoogle();
  }
  /**
   * Get the SVG path for the icon
   *
   * @returns {string}
   */
  get path() {
    return this.#options.path;
  }
  /**
   * Set the SVG path for the icon
   *
   * @param {path} path The SVG path for the icon
   */
  set path(path) {
    if (isStringWithValue(path)) {
      this.#options.path = path;
    }
  }
  /**
   * Get the rotation of the icon in degrees clockwise about the anchor point.
   *
   * @returns {number|null|undefined}
   */
  get rotation() {
    return this.#options.rotation;
  }
  /**
   * Set the rotation of the icon in degrees clockwise about the anchor point.
   *
   * @param {number|string} rotation The rotation of the icon in degrees clockwise about the anchor point.
   */
  set rotation(rotation) {
    if (isNumber(rotation)) {
      this.#options.rotation = rotation;
    } else if (isNumberString(rotation)) {
      this.#options.rotation = Number(rotation);
    }
  }
  /**
   * Get the amount by which the icon is scaled.
   *
   * @returns {number|null|undefined}
   */
  get scale() {
    return this.#options.scale;
  }
  /**
   * Set the amount by which the icon is scaled.
   *
   * @param {number|string} scale The amount by which the icon is scaled.
   */
  set scale(scale) {
    if (isNumber(scale)) {
      this.#options.scale = scale;
    } else if (isNumberString(scale)) {
      this.#options.scale = Number(scale);
    }
  }
  /**
   * Get the SVG stroke color
   *
   * @returns {string|null|undefined}
   */
  get strokeColor() {
    return this.#options.strokeColor;
  }
  /**
   * Set the SVG stroke color.
   *
   * @param {string} strokeColor The SVG stroke color.
   */
  set strokeColor(strokeColor) {
    if (isStringWithValue(strokeColor)) {
      this.#options.strokeColor = strokeColor;
    }
  }
  /**
   * Get the opacity of the stroke.
   * The opacity of the stroke, where 0 is fully transparent and 1 is fully opaque.
   *
   * @returns {number|null|undefined}
   */
  get strokeOpacity() {
    return this.#options.strokeOpacity;
  }
  /**
   * Set the opacity of the stroke.
   *
   * @param {number|string} strokeOpacity The opacity of the stroke.
   */
  set strokeOpacity(strokeOpacity) {
    if (isNumber(strokeOpacity)) {
      this.#options.strokeOpacity = strokeOpacity;
    } else if (isNumberString(strokeOpacity)) {
      this.#options.strokeOpacity = Number(strokeOpacity);
    }
  }
  /**
   * Get the weight of the stroke in pixels.
   *
   * @returns {number|null|undefined}
   */
  get strokeWeight() {
    return this.#options.strokeWeight;
  }
  /**
   * Set the weight of the stroke.
   *
   * @param {number|string} strokeWeight The weight of the stroke.
   */
  set strokeWeight(strokeWeight) {
    if (isNumber(strokeWeight)) {
      this.#options.strokeWeight = strokeWeight;
    } else if (isNumberString(strokeWeight)) {
      this.#options.strokeWeight = Number(strokeWeight);
    }
  }
  /**
   * Set the icon options
   *
   * @param {SvgSymbolOptions} options The icon options
   * @returns {SvgSymbol}
   */
  setOptions(options) {
    if (isObject(options)) {
      NUMBER_OPTIONS.forEach((key) => {
        if (typeof options[key] !== "undefined" && isNumber(options[key]) || isNumberString(options[key])) {
          if (isNumberString(options[key])) {
            this.#options[key] = Number(options[key]);
          } else {
            this.#options[key] = options[key];
          }
        }
      });
      POINT_OPTIONS2.forEach((key) => {
        if (options[key]) {
          this.#options[key] = point(options[key]);
        }
      });
      STRING_OPTIONS2.forEach((key) => {
        if (options[key] && isStringWithValue(options[key])) {
          this.#options[key] = options[key];
        }
      });
    }
    return this;
  }
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
  setAnchor(anchor) {
    this.anchor = anchor;
    return this;
  }
  /**
   * Set the SVG fill color.
   *
   * @param {string} fillColor The SVG fill color.
   * @returns {SvgSymbol}
   */
  setFillColor(fillColor) {
    this.fillColor = fillColor;
    return this;
  }
  /**
   * Set the opacity for the fill
   *
   * @param {number|string} fillOpacity The opacity for the fill
   * @returns {SvgSymbol}
   */
  setFillOpacity(fillOpacity) {
    this.fillOpacity = fillOpacity;
    return this;
  }
  /**
   * Set the origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
   *
   * @param {PointValue} labelOrigin The origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
   * @returns {SvgSymbol}
   */
  setLabelOrigin(labelOrigin) {
    this.labelOrigin = labelOrigin;
    return this;
  }
  /**
   * Set the SVG path for the icon
   *
   * @param {path} path The SVG path for the icon
   * @returns {SvgSymbol}
   */
  setPath(path) {
    this.path = path;
    return this;
  }
  /**
   * Set the rotation of the icon in degrees clockwise about the anchor point.
   *
   * @param {number|string} rotation The rotation of the icon in degrees clockwise about the anchor point.
   * @returns {SvgSymbol}
   */
  setRotation(rotation) {
    this.rotation = rotation;
    return this;
  }
  /**
   * Set the amount by which the icon is scaled.
   *
   * @param {number|string} scale The amount by which the icon is scaled.
   * @returns {SvgSymbol}
   */
  setScale(scale) {
    this.scale = scale;
    return this;
  }
  /**
   * Set the SVG stroke color.
   *
   * @param {string} strokeColor The SVG stroke color.
   * @returns {SvgSymbol}
   */
  setStrokeColor(strokeColor) {
    this.strokeColor = strokeColor;
    return this;
  }
  /**
   * Set the opacity of the stroke.
   *
   * @param {number|string} strokeOpacity The opacity of the stroke.
   * @returns {SvgSymbol}
   */
  setStrokeOpacity(strokeOpacity) {
    this.strokeOpacity = strokeOpacity;
    return this;
  }
  /**
   * Set the weight of the stroke.
   *
   * @param {number|string} strokeWeight The weight of the stroke.
   * @returns {SvgSymbol}
   */
  setStrokeWeight(strokeWeight) {
    this.strokeWeight = strokeWeight;
    return this;
  }
  /**
   * Get the icon options
   *
   * @returns {Promise<google.maps.Symbol>}
   */
  toGoogle() {
    return new Promise((resolve) => {
      loader().onLoad(() => {
        const { anchor, labelOrigin, ...rest } = this.#options;
        const options = { ...rest };
        if (typeof anchor !== "undefined") {
          options.anchor = anchor instanceof Point ? anchor.toGoogle() : anchor;
        }
        if (typeof labelOrigin !== "undefined") {
          options.labelOrigin = labelOrigin instanceof Point ? labelOrigin.toGoogle() : labelOrigin;
        }
        if (isStringWithValue(options.path) && Object.keys(SymbolPath).includes(options.path)) {
          options.path = convertSymbolPath(options.path);
        }
        resolve(options);
      });
    });
  }
};
var svgSymbol = (path, options) => {
  if (path instanceof SvgSymbol) {
    return path;
  }
  return new SvgSymbol(path, options);
};

// src/lib/DataLayer.ts
var DataLayer = class _DataLayer extends Layer_default {
  /**
   * Holds the Google maps Data object
   *
   * @private
   * @type {google.maps.Data | undefined}
   */
  #data;
  /**
   * Holds the map that this layer is the default data layer for.
   *
   * This is only set when the layer wraps a map's own data layer (map.data).
   * It's kept separate from the Layer map value so that the layer can still be
   * shown again after hide() sets the map to null.
   *
   * @private
   * @type {Map | undefined}
   */
  #defaultLayerMap;
  /**
   * Holds the DataFeature object for each Google maps feature.
   *
   * This makes sure that the same Google feature always gets the same DataFeature
   * object back, which matters for things like attached tooltips and style overrides.
   *
   * @private
   * @type {WeakMap}
   */
  #features = /* @__PURE__ */ new WeakMap();
  /**
   * Holds the data layer options
   *
   * @private
   * @type {DataLayerOptions}
   */
  #options = {};
  /**
   * Holds the chain of calls that are waiting for the Google maps Data object.
   *
   * Every public call is added to the end of this chain so that calls are always run in
   * the order that they were made, however long the map takes to be ready.
   *
   * @private
   * @type {Promise<void>}
   */
  #pendingChain = Promise.resolve();
  /**
   * Holds the promise for setting up the Google maps Data object.
   *
   * This is memoized so that the Data object is only ever created once.
   *
   * @private
   * @type {Promise<google.maps.Data> | undefined}
   */
  #setupPromise;
  /**
   * Holds the style for the layer
   *
   * @private
   * @type {DataStyleValue | undefined}
   */
  #style;
  /**
   * Holds the Google symbol for each SvgSymbol used in a style.
   *
   * The Google maps API calls the style function for each feature and uses the value that
   * it returns straight away, so the style function has to be synchronous. SvgSymbol.toGoogle()
   * is not, so resolved symbols are cached here and the style is applied again once one resolves.
   *
   * @private
   * @type {WeakMap}
   */
  #svgSymbols = /* @__PURE__ */ new WeakMap();
  /**
   * Constructor
   *
   * @param {DataLayerOptions} [options] The data layer options
   * @param {Map} [defaultLayerMap] The map to wrap the default data layer for.
   *      This is only used within this library by the Map class for the map.data value.
   * @internal
   */
  constructor(options, defaultLayerMap) {
    super("datalayer", "Data");
    if (defaultLayerMap instanceof Map) {
      this.#defaultLayerMap = defaultLayerMap;
      super.setMap(defaultLayerMap);
    }
    if (isObject(options)) {
      this.setOptions(options);
    }
  }
  /**
   * Get the map that the layer is attached to
   *
   * @returns {Map|null}
   */
  get map() {
    return this.#mapObject();
  }
  /**
   * Set the map that the layer is attached to
   *
   * @param {Map|null} value The map object. Set to null to remove the layer from the map.
   */
  set map(value) {
    this.setMap(value);
  }
  /**
   * Get the style for the layer
   *
   * @returns {DataStyleValue | undefined}
   */
  get style() {
    return this.#style;
  }
  /**
   * Set the style for the layer
   *
   * @param {DataStyleValue} value The style to apply to the features in the layer
   */
  set style(value) {
    this.setStyle(value);
  }
  /**
   * Get whether the layer is visible on the map
   *
   * @returns {boolean}
   */
  get visible() {
    return this.isVisible;
  }
  /**
   * Set whether the layer is visible on the map
   *
   * @param {boolean} value Whether the layer is visible on the map
   */
  set visible(value) {
    if (isBoolean(value)) {
      if (value) {
        this.show();
      } else {
        this.hide();
      }
    }
  }
  /**
   * Add GeoJson data to the layer.
   *
   * https://developers.google.com/maps/documentation/javascript/reference/data#Data.addGeoJson
   *
   * @param {object} geoJson The GeoJson object to add
   * @param {LoadOptions} [options] The options for adding the data
   * @returns {Promise<DataFeature[]>}
   */
  addGeoJson(geoJson, options) {
    return this.#enqueue((data) => {
      this.#handleReplace(data, options);
      const features = data.addGeoJson(geoJson, this.#geoJsonOptions(options));
      return this.#afterLoad(data, features, options);
    });
  }
  /**
   * Add a single point to the layer.
   *
   * @param {LatLngValue} position The position for the point
   * @param {FeatureOptions} [options] The options for the feature
   * @returns {Promise<DataFeature>}
   */
  addPoint(position, options) {
    return this.#enqueue((data) => {
      const point2 = latLng(position);
      if (!point2.isValid()) {
        throw new Error(
          `Invalid latitude/longitude data passed to DataLayer.addPoint. You passed: ${JSON.stringify(position)}`
        );
      }
      return this.#addFeature(data, new google.maps.Data.Point(point2.toGoogle()), options);
    });
  }
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
  addPolygon(paths, options) {
    return this.#enqueue((data) => {
      const rings = _DataLayer.#toRings(paths).map((ring) => _DataLayer.#toRingPositions(ring));
      if (rings.length === 0 || rings[0].length < 3) {
        throw new Error("A polygon needs at least three positions in its first path");
      }
      return this.#addFeature(data, new google.maps.Data.Polygon(rings), options);
    });
  }
  /**
   * Add a line to the layer.
   *
   * @param {LatLngValue[]} path The path for the line
   * @param {FeatureOptions} [options] The options for the feature
   * @returns {Promise<DataFeature>}
   */
  addPolyline(path, options) {
    return this.#enqueue((data) => {
      const positions = _DataLayer.#toPositions(path);
      if (positions.length < 2) {
        throw new Error("A line needs at least two positions in its path");
      }
      return this.#addFeature(data, new google.maps.Data.LineString(positions), options);
    });
  }
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
  clear() {
    return this.#queue((data) => {
      _DataLayer.#googleFeatures(data).forEach((feature) => {
        data.remove(feature);
      });
    });
  }
  /**
   * Returns whether the feature is in this layer.
   *
   * @param {DataFeature} feature The feature to test for
   * @returns {Promise<boolean>}
   */
  contains(feature) {
    return this.#enqueue((data) => feature instanceof DataFeature && data.contains(feature.toGoogle()));
  }
  /**
   * @inheritdoc
   */
  dispatch(event, data) {
    if (isObject(data) && !isNullOrUndefined(data.feature)) {
      const googleEvent = data;
      const eventData = {
        feature: googleEvent.feature ? this.#featureFor(googleEvent.feature) : void 0
      };
      if (typeof googleEvent.domEvent !== "undefined") {
        eventData.domEvent = googleEvent.domEvent;
        eventData.latLng = googleEvent.latLng;
        eventData.stop = googleEvent.stop;
      }
      return super.dispatch(event, eventData);
    }
    return super.dispatch(event, data);
  }
  /**
   * Fit the map to the bounds of the data in the layer.
   *
   * Nothing happens if the layer has no features, or if it isn't attached to a map.
   *
   * @returns {Promise<DataLayer>}
   */
  fitBounds() {
    return this.#enqueue((data) => this.#fitBounds(data));
  }
  /**
   * Call the callback function for each feature in the layer.
   *
   * @param {Function} callback The function to call for each feature
   * @returns {Promise<DataLayer>}
   */
  forEach(callback) {
    return this.#enqueue((data) => {
      _DataLayer.#googleFeatures(data).forEach((feature) => {
        callback(this.#featureFor(feature));
      });
      return this;
    });
  }
  /**
   * Get the bounds of all of the features in the layer.
   *
   * @returns {Promise<LatLngBounds>}
   */
  getBounds() {
    return this.#enqueue((data) => _DataLayer.#bounds(data).bounds);
  }
  /**
   * Get a feature by its id.
   *
   * https://developers.google.com/maps/documentation/javascript/reference/data#Data.getFeatureById
   *
   * @param {string|number} id The feature id
   * @returns {Promise<DataFeature|undefined>}
   */
  getFeature(id) {
    return this.#enqueue((data) => {
      const feature = data.getFeatureById(id);
      return feature ? this.#featureFor(feature) : void 0;
    });
  }
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
  getFeatures() {
    return this.#enqueue((data) => _DataLayer.#googleFeatures(data).map((feature) => this.#featureFor(feature)));
  }
  /**
   * Hide the layer on the map.
   *
   * The features stay in the layer. Use show() to display them again.
   *
   * @returns {DataLayer}
   */
  hide() {
    this.isVisible = false;
    return this.#queue((data) => {
      data.setMap(null);
    });
  }
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
  init() {
    return this.#getGoogleData().then(() => {
    });
  }
  /**
   * @inheritdoc
   */
  hasListener(type, callback) {
    return super.hasListener(type, callback);
  }
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
  loadGeoJson(url, options) {
    return this.#enqueue((data) => {
      const urls = (Array.isArray(url) ? url : [url]).filter((value) => isStringWithValue(value));
      if (urls.length === 0) {
        throw new Error("A url is required to load GeoJson data");
      }
      this.#handleReplace(data, options);
      const geoJsonOptions = this.#geoJsonOptions(options);
      return Promise.all(
        urls.map(
          (value) => new Promise((resolve) => {
            data.loadGeoJson(value, geoJsonOptions, (features) => {
              resolve(features);
            });
          })
        )
      ).then((results) => {
        const features = [];
        results.forEach((value) => {
          features.push(...value);
        });
        return this.#afterLoad(data, features, options);
      });
    });
  }
  /**
   * @inheritdoc
   */
  off(type, callback, options) {
    super.off(type, callback, options);
  }
  /**
   * @inheritdoc
   */
  on(type, callback, config) {
    this.#setup();
    super.on(type, callback, config);
  }
  /**
   * @inheritdoc
   */
  onImmediate(type, callback, config) {
    this.#setup();
    super.onImmediate(type, callback, config);
  }
  /**
   * @inheritdoc
   */
  once(type, callback, config) {
    this.#setup();
    super.once(type, callback, config);
  }
  /**
   * @inheritdoc
   */
  onceImmediate(type, callback, config) {
    this.#setup();
    super.onceImmediate(type, callback, config);
  }
  /**
   * Add an event listener for when a feature is added to the layer.
   *
   * @param {DataLayerEventCallback} callback The callback function to call when the event is dispatched.
   */
  onAddFeature(callback) {
    this.on(DataLayerEvents.ADD_FEATURE, callback);
  }
  /**
   * Add an event listener for when a feature is clicked.
   *
   * The feature that was clicked is on the event object.
   *
   * layer.onClick((event) => { console.log(event.feature.getProperty('name')); });
   *
   * @param {DataLayerEventCallback} callback The callback function to call when the event is dispatched.
   */
  onClick(callback) {
    this.on(DataLayerEvents.CLICK, callback);
  }
  /**
   * Add an event listener for when a feature is double clicked.
   *
   * @param {DataLayerEventCallback} callback The callback function to call when the event is dispatched.
   */
  onDblClick(callback) {
    this.on(DataLayerEvents.DBLCLICK, callback);
  }
  /**
   * Add an event listener for when GeoJson data has finished loading.
   *
   * This is dispatched by loadGeoJson() and addGeoJson().
   *
   * @param {DataLayerEventCallback} callback The callback function to call when the event is dispatched.
   */
  onLoad(callback) {
    this.on(DataLayerEvents.LOAD, callback);
  }
  /**
   * Add an event listener for when the mouse leaves a feature.
   *
   * @param {DataLayerEventCallback} callback The callback function to call when the event is dispatched.
   */
  onMouseOut(callback) {
    this.on(DataLayerEvents.MOUSE_OUT, callback);
  }
  /**
   * Add an event listener for when the mouse moves over a feature.
   *
   * @param {DataLayerEventCallback} callback The callback function to call when the event is dispatched.
   */
  onMouseOver(callback) {
    this.on(DataLayerEvents.MOUSE_OVER, callback);
  }
  /**
   * Add an event listener for when a feature is removed from the layer.
   *
   * @param {DataLayerEventCallback} callback The callback function to call when the event is dispatched.
   */
  onRemoveFeature(callback) {
    this.on(DataLayerEvents.REMOVE_FEATURE, callback);
  }
  /**
   * Add an event listener for when a feature is right clicked.
   *
   * @param {DataLayerEventCallback} callback The callback function to call when the event is dispatched.
   */
  onRightClick(callback) {
    this.on(DataLayerEvents.RIGHT_CLICK, callback);
  }
  /**
   * Set the style for one feature, overriding the layer style.
   *
   * https://developers.google.com/maps/documentation/javascript/reference/data#Data.overrideStyle
   *
   * @param {DataFeatureValue} feature The feature, or the feature id, to set the style on
   * @param {DataStyleOptions} style The style to set on the feature
   * @returns {DataLayer}
   */
  overrideStyle(feature, style) {
    return this.#queue((data) => {
      const googleFeature = this.#googleFeatureFor(data, feature);
      if (googleFeature) {
        data.overrideStyle(googleFeature, this.#convertStyle(style));
      }
    });
  }
  /**
   * Remove a feature from the layer.
   *
   * @param {DataFeatureValue} feature The feature, or the feature id, to remove
   * @returns {DataLayer}
   */
  remove(feature) {
    return this.#queue((data) => {
      const googleFeature = this.#googleFeatureFor(data, feature);
      if (googleFeature) {
        data.remove(googleFeature);
      }
    });
  }
  /**
   * Remove the style override for a feature so that it uses the layer style again.
   *
   * If no feature is passed then the override is removed from every feature.
   *
   * @param {DataFeatureValue} [feature] The feature, or the feature id, to revert the style for
   * @returns {DataLayer}
   */
  revertStyle(feature) {
    return this.#queue((data) => {
      if (isNullOrUndefined(feature)) {
        data.revertStyle();
      } else {
        const googleFeature = this.#googleFeatureFor(data, feature);
        if (googleFeature) {
          data.revertStyle(googleFeature);
        }
      }
    });
  }
  /**
   * Add the data layer to the map object.
   *
   * @param {Map|null} value The map object. Set to null to remove the layer from the map.
   * @returns {Promise<DataLayer>}
   */
  async setMap(value) {
    if (value instanceof Map) {
      super.setMap(value);
      this.#options.map = value;
      value.init();
      await this.#enqueue(async (data) => {
        await value.init();
        data.setMap(value.toGoogle() ?? null);
      });
    } else if (isNullOrUndefined(value)) {
      super.setMap(null);
      this.#options.map = void 0;
      await this.#enqueue((data) => {
        data.setMap(null);
      });
    }
    return this;
  }
  /**
   * Set the data layer options
   *
   * @param {DataLayerOptions} options The data layer options
   * @returns {DataLayer}
   */
  setOptions(options) {
    if (isObject(options)) {
      if (isStringWithValue(options.idProperty)) {
        this.#options.idProperty = options.idProperty;
      }
      if (isBoolean(options.fitBounds)) {
        this.#options.fitBounds = options.fitBounds;
      }
      if (options.style) {
        this.setStyle(options.style);
      }
      if (options.map) {
        this.setMap(options.map);
      }
      if (options.geoJson) {
        if (isString(options.geoJson) || Array.isArray(options.geoJson)) {
          this.loadGeoJson(options.geoJson);
        } else {
          this.addGeoJson(options.geoJson);
        }
      }
      if (isBoolean(options.visible)) {
        this.visible = options.visible;
      }
    }
    return this;
  }
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
  setStyle(style) {
    this.#style = style;
    return this.#queue(() => {
      this.#applyStyle();
    });
  }
  /**
   * Show the layer on the map.
   *
   * This will also set the map object if it's passed.
   *
   * @param {Map} [map] The map object to add the layer to
   * @returns {Promise<DataLayer>}
   */
  async show(map2) {
    this.isVisible = true;
    if (map2 instanceof Map) {
      return this.setMap(map2);
    }
    const mapObject = this.#mapObject();
    await this.#enqueue(async (data) => {
      if (mapObject) {
        await mapObject.init();
        data.setMap(mapObject.toGoogle() ?? null);
      }
    });
    return this;
  }
  /**
   * Export every feature in the layer as a GeoJson object.
   *
   * The Google maps API method is callback based. This returns a promise instead.
   *
   * @returns {Promise<object>}
   */
  toGeoJson() {
    return this.#enqueue(
      (data) => new Promise((resolve) => {
        data.toGeoJson((geoJson) => {
          resolve(geoJson);
        });
      })
    );
  }
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
  toGoogle() {
    return this.#enqueue((data) => data);
  }
  /**
   * Add a feature with the given geometry to the layer
   *
   * @private
   * @param {google.maps.Data} data The Google maps Data object
   * @param {google.maps.Data.Geometry} geometry The geometry for the feature
   * @param {FeatureOptions} [options] The options for the feature
   * @returns {DataFeature}
   */
  #addFeature(data, geometry, options) {
    const featureOptions = { geometry };
    if (isObject(options)) {
      if (isStringOrNumber(options.id)) {
        featureOptions.id = options.id;
      }
      if (isObject(options.properties)) {
        featureOptions.properties = options.properties;
      }
    }
    const googleFeature = data.add(featureOptions);
    if (isObject(options) && isObject(options.style)) {
      data.overrideStyle(googleFeature, this.#convertStyle(options.style));
    }
    return this.#featureFor(googleFeature);
  }
  /**
   * Handle the work that needs to happen after GeoJson data has been loaded
   *
   * @private
   * @param {google.maps.Data} data The Google maps Data object
   * @param {google.maps.Data.Feature[]} googleFeatures The features that were loaded
   * @param {LoadOptions} [options] The options that the data was loaded with
   * @returns {Promise<DataFeature[]>}
   */
  #afterLoad(data, googleFeatures, options) {
    const features = googleFeatures.map((feature) => this.#featureFor(feature));
    this.dispatch(DataLayerEvents.LOAD);
    const fit = isObject(options) && isBoolean(options.fitBounds) ? options.fitBounds : this.#options.fitBounds;
    if (fit === true) {
      return this.#fitBounds(data).then(() => features);
    }
    return Promise.resolve(features);
  }
  /**
   * Apply the layer style to the Google maps Data object
   *
   * @private
   */
  #applyStyle() {
    if (!this.#data) {
      return;
    }
    const style = this.#style;
    if (isFunction(style)) {
      this.#data.setStyle(
        (googleFeature) => this.#convertStyle(
          style(this.#featureFor(googleFeature))
        )
      );
    } else if (isObject(style)) {
      this.#data.setStyle(this.#convertStyle(style));
    } else {
      this.#data.setStyle(null);
    }
  }
  /**
   * Convert an icon value to the value that the Google maps API needs.
   *
   * This has to be synchronous because the Google maps API uses the value that the style
   * function returns straight away. SvgSymbol.toGoogle() returns a promise, so a symbol that
   * hasn't resolved yet is left off the style and the style is applied again once it resolves.
   *
   * @private
   * @param {any} value The icon value from the style
   * @returns {any}
   */
  #convertIcon(value) {
    if (value instanceof Icon) {
      return value.toGoogle();
    }
    if (value instanceof SvgSymbol) {
      const symbol = this.#svgSymbols.get(value);
      if (symbol) {
        return symbol;
      }
      value.toGoogle().then((resolved) => {
        this.#svgSymbols.set(value, resolved);
        this.#applyStyle();
      });
      return void 0;
    }
    return value;
  }
  /**
   * Convert this library's style options to the Google maps style options
   *
   * @private
   * @param {DataStyleOptions} style The style options
   * @returns {google.maps.Data.StyleOptions}
   */
  #convertStyle(style) {
    const styleOptions = {};
    if (!isObject(style)) {
      return styleOptions;
    }
    ["cursor", "fillColor", "strokeColor", "title"].forEach((key) => {
      const value = style[key];
      if (isStringWithValue(value)) {
        styleOptions[key] = value;
      }
    });
    ["clickable", "draggable", "editable", "visible"].forEach((key) => {
      const value = style[key];
      if (isBoolean(value)) {
        styleOptions[key] = value;
      }
    });
    ["fillOpacity", "strokeOpacity", "strokeWeight", "zIndex"].forEach((key) => {
      if (isNumberOrNumberString(style[key])) {
        styleOptions[key] = Number(style[key]);
      }
    });
    if (!isNullOrUndefined(style.icon)) {
      const icon2 = this.#convertIcon(style.icon);
      if (!isNullOrUndefined(icon2)) {
        styleOptions.icon = icon2;
      }
    }
    return styleOptions;
  }
  /**
   * Add a call to the end of the chain of calls waiting for the Google maps Data object.
   *
   * Calls are always run in the order that they were made, however long the map takes to
   * be ready. A call that fails doesn't stop the calls after it from running.
   *
   * @private
   * @param {Function} callback The function to call with the Google maps Data object
   * @returns {Promise}
   */
  #enqueue(callback) {
    const result = this.#pendingChain.then(() => this.#getGoogleData()).then((data) => callback(data));
    this.#pendingChain = result.then(
      () => void 0,
      () => void 0
    );
    return result;
  }
  /**
   * Get the DataFeature object for a Google maps feature.
   *
   * The same Google feature always gets the same DataFeature object back.
   *
   * Callers must pass a Google feature. The one caller that can receive an empty value, dispatch(), checks for it first.
   *
   * @private
   * @param {google.maps.Data.Feature} googleFeature The Google maps feature
   * @returns {DataFeature}
   */
  #featureFor(googleFeature) {
    let feature = this.#features.get(googleFeature);
    if (!feature) {
      feature = new DataFeature(googleFeature, this);
      this.#features.set(googleFeature, feature);
    }
    return feature;
  }
  /**
   * Fit the map to the bounds of the data in the layer.
   *
   * This is the internal version that already has the Google maps Data object, so that it
   * can be called from within a queued call without waiting on the queue again.
   *
   * @private
   * @param {google.maps.Data} data The Google maps Data object
   * @returns {Promise<DataLayer>}
   */
  #fitBounds(data) {
    const mapObject = this.#mapObject();
    const { bounds, hasPositions } = _DataLayer.#bounds(data);
    if (mapObject && hasPositions) {
      return mapObject.fitBounds(bounds).then(() => this);
    }
    return Promise.resolve(this);
  }
  /**
   * Get the GeoJson options to pass to the Google maps API
   *
   * @private
   * @param {LoadOptions} [options] The load options
   * @returns {google.maps.Data.GeoJsonOptions | null}
   */
  #geoJsonOptions(options) {
    const idProperty = isObject(options) && isStringWithValue(options.idProperty) ? options.idProperty : this.#options.idProperty;
    if (isStringWithValue(idProperty)) {
      return { idPropertyName: idProperty };
    }
    return null;
  }
  /**
   * Set up the Google maps Data object if necessary.
   *
   * The map's own data layer needs the map to be set up first. Any other layer only needs the
   * Google maps library to be loaded, so data can be loaded into it before there's a map.
   *
   * The promise is held so that the Data object is only ever created once.
   *
   * @private
   * @returns {Promise<google.maps.Data>}
   */
  #getGoogleData() {
    if (!this.#setupPromise) {
      this.#setupPromise = new Promise((resolve, reject) => {
        const defaultLayerMap = this.#defaultLayerMap;
        if (defaultLayerMap instanceof Map) {
          defaultLayerMap.init().then(() => {
            const googleMap = defaultLayerMap.toGoogle();
            if (!googleMap) {
              reject(new Error("The map must be set up before its data layer can be used."));
              return;
            }
            const { data } = googleMap;
            this.#setDataObject(data);
            resolve(data);
          });
        } else if (checkForGoogleMaps("DataLayer", "Data", false)) {
          const data = new google.maps.Data();
          this.#setDataObject(data);
          resolve(data);
        } else {
          loader().onLoad(() => {
            const data = new google.maps.Data();
            this.#setDataObject(data);
            resolve(data);
          });
        }
      });
    }
    return this.#setupPromise;
  }
  /**
   * Get the Google maps feature for a feature value
   *
   * @private
   * @param {google.maps.Data} data The Google maps Data object
   * @param {DataFeatureValue} feature The feature, or the feature id
   * @returns {google.maps.Data.Feature|undefined}
   */
  // eslint-disable-next-line class-methods-use-this -- This is grouped with the other private methods
  #googleFeatureFor(data, feature) {
    if (feature instanceof DataFeature) {
      return feature.toGoogle();
    }
    if (isStringOrNumber(feature)) {
      return data.getFeatureById(feature);
    }
    return void 0;
  }
  /**
   * Remove the existing features if the load options ask for it
   *
   * @private
   * @param {google.maps.Data} data The Google maps Data object
   * @param {LoadOptions} [options] The load options
   */
  // eslint-disable-next-line class-methods-use-this -- This is grouped with the other private methods
  #handleReplace(data, options) {
    if (isObject(options) && options.replace === true) {
      _DataLayer.#googleFeatures(data).forEach((feature) => {
        data.remove(feature);
      });
    }
  }
  /**
   * Get the map that the layer belongs to.
   *
   * For the map's own data layer this is still the map even after hide() has set the map
   * on the Google object to null.
   *
   * @private
   * @returns {Map|null}
   */
  #mapObject() {
    const map2 = this.getMap();
    if (map2 instanceof Map) {
      return map2;
    }
    return this.#defaultLayerMap ?? null;
  }
  /**
   * Add a call that doesn't return a value to the queue and return the layer so that
   * calls can be chained.
   *
   * @private
   * @param {Function} callback The function to call with the Google maps Data object
   * @returns {DataLayer}
   */
  #queue(callback) {
    this.#enqueue(callback).catch((error) => {
      console.error(error);
    });
    return this;
  }
  /**
   * Set the Google maps Data object and everything that depends on it
   *
   * @private
   * @param {google.maps.Data} data The Google maps Data object
   */
  #setDataObject(data) {
    this.#data = data;
    this.setEventGoogleObject(data);
    this.#applyStyle();
    this.dispatch(DataLayerEvents.READY);
  }
  /**
   * Start setting up the Google maps Data object without waiting for it
   *
   * @private
   */
  #setup() {
    this.#getGoogleData().catch((error) => {
      console.error(error);
    });
  }
  /**
   * Get the bounds of every feature in the Google maps Data object.
   *
   * Every Google geometry object supports forEachLatLng(), which walks nested geometries,
   * so this works for every geometry type without needing to handle each one.
   *
   * @private
   * @param {google.maps.Data} data The Google maps Data object
   * @returns {object} The bounds and whether any positions were found
   */
  static #bounds(data) {
    const bounds = latLngBounds();
    let hasPositions = false;
    data.forEach((feature) => {
      const geometry = feature.getGeometry();
      if (geometry) {
        geometry.forEachLatLng((googleLatLng) => {
          hasPositions = true;
          bounds.extend(latLngConvert(googleLatLng));
        });
      }
    });
    return { bounds, hasPositions };
  }
  /**
   * Get every feature in the Google maps Data object as an array.
   *
   * The features are collected before they're worked on so that the collection isn't
   * being changed while forEach() is walking it.
   *
   * @private
   * @param {google.maps.Data} data The Google maps Data object
   * @returns {google.maps.Data.Feature[]}
   */
  static #googleFeatures(data) {
    const features = [];
    data.forEach((feature) => {
      features.push(feature);
    });
    return features;
  }
  /**
   * Convert an array of positions to plain latitude/longitude literals.
   *
   * Google's Data.LineString, Data.LinearRing and Data.Polygon all take either LatLng objects
   * or LatLngLiteral objects, so the literals are handed straight over. This used to be
   * map(latLng).filter(isValid).map(toGoogle), which built three intermediate arrays and two
   * objects per point - a LatLng wrapper and then a google.maps.LatLng - on paths that can
   * hold tens of thousands of points.
   *
   * @private
   * @param {LatLngValue[]} path The positions to convert
   * @returns {google.maps.LatLngLiteral[]}
   */
  static #toPositions(path) {
    if (!Array.isArray(path)) {
      return [];
    }
    const positions = [];
    for (let i = 0; i < path.length; i += 1) {
      const value = latLng(path[i]);
      if (value.isValid()) {
        positions.push({ lat: value.latitude, lng: value.longitude });
      }
    }
    return positions;
  }
  /**
   * Convert the positions for one ring of a polygon to plain latitude/longitude literals.
   *
   * GeoJson repeats the first position at the end of a ring to close it. Google's LinearRing
   * closes itself, so the repeated position is dropped to avoid a duplicate corner.
   *
   * @private
   * @param {LatLngValue[]} ring The positions for the ring
   * @returns {google.maps.LatLngLiteral[]}
   */
  static #toRingPositions(ring) {
    const positions = _DataLayer.#toPositions(ring);
    const last = positions.length - 1;
    if (positions.length > 2 && positions[0].lat === positions[last].lat && positions[0].lng === positions[last].lng) {
      positions.pop();
    }
    return positions;
  }
  /**
   * Work out whether the paths value is one ring of positions or an array of rings.
   *
   * A single position can itself be an array ([lat, lng]), so the first value is checked to
   * see whether it looks like a position rather than like another ring.
   *
   * This used to build a throwaway LatLng purely to ask that question, which ran the whole of
   * LatLng's type dispatch on every call to addPolygon().
   *
   * @private
   * @param {LatLngValue[]|LatLngValue[][]} paths The path, or array of paths, for a polygon
   * @returns {LatLngValue[][]}
   */
  static #toRings(paths) {
    if (!Array.isArray(paths) || paths.length === 0) {
      return [];
    }
    const first = paths[0];
    if (Array.isArray(first)) {
      if (first.length === 2 && isNumberOrNumberString(first[0]) && isNumberOrNumberString(first[1])) {
        return [paths];
      }
      return paths;
    }
    return [paths];
  }
};
var dataLayer = (options) => {
  if (options instanceof DataLayer) {
    return options;
  }
  return new DataLayer(options);
};

// src/lib/Map.ts
var hideFeatureTypes = {
  hideBusinesses: "poi.business",
  hidePointsOfInterest: "poi",
  hideTransit: "transit"
};
var Map = class _Map extends Evented {
  constructor(selector, options) {
    super("map", "Map");
    /**
     * Holds the custom controls that need to be added to the map
     *
     * @private
     * @type {CustomControl[]}
     */
    this.#customControls = [];
    /**
     * Holds the HTML element that the map will be rendered in.
     *
     * @private
     * @type {null|HTMLElement}
     */
    this.#element = null;
    /**
     * Holds whether each of the shortcut options to hide features on the map is enabled
     *
     * @private
     * @type {Record<HideFeatureOption, boolean>}
     */
    this.#hiddenFeatures = {
      hideBusinesses: false,
      hidePointsOfInterest: false,
      hideTransit: false
    };
    /**
     * Holds the latitude portion of the center point for the map
     *
     * @private
     * @type {number}
     */
    this.#latitude = 0;
    /**
     * Holds the longitude portion of the center point for the map
     *
     * @private
     * @type {number}
     */
    this.#longitude = 0;
    /**
     * Holds if the map is getting the map options
     *
     * @private
     * @type {boolean}
     */
    this.#isGettingMapOptions = false;
    /**
     * Holds if the map is initialized or not
     *
     * @private
     * @type {boolean}
     */
    this.#isInitialized = false;
    /**
     * Holds if the map is initializing
     *
     * @private
     * @type {boolean}
     */
    this.#isInitializing = false;
    /**
     * Holds if the map is loaded and ready for use
     *
     * @private
     * @type {boolean}
     */
    this.#isReady = false;
    /**
     * Holds the maximum zoom level for the map when fitting to bounds
     *
     * @private
     * @type {number|null}
     */
    this.#maxFitBoundsZoom = null;
    /**
     * Holds the minimum zoom level for the map when fitting to bounds
     *
     * @private
     * @type {number|null}
     */
    this.#minFitBoundsZoom = null;
    /**
     * Holds the map options
     *
     * The center, mapTypeId, and zoom options are set to their default values.
     *
     * @private
     * @type {MapOptionsWithDefaults}
     */
    this.#options = {
      center: latLng(0, 0),
      mapTypeId: MapTypeId.ROADMAP,
      zoom: 6
    };
    /**
     * Holds the listener that cancels the gesture events, or null if it hasn't been added.
     * It's held so that it can be removed if the preventPageZoom option is turned off.
     *
     * @private
     * @type {null|((event: Event) => void)}
     */
    this.#pageZoomHandler = null;
    /**
     * Holds whether a pinch on the map is kept from zooming the whole page on iOS
     *
     * @private
     * @type {boolean}
     */
    this.#preventPageZoom = true;
    /**
     * Holds the styles to apply to the map
     *
     * @private
     * @type {MapStyle[]}
     */
    this.#styles = [];
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
    this.resize = (element) => {
      let el;
      if (typeof element === "string") {
        el = document.querySelector(element);
      } else if (element instanceof HTMLElement) {
        el = element;
      } else {
        el = this.#element;
      }
      if (el) {
        const currentHeight = el.getBoundingClientRect().height;
        el.style.height = `${currentHeight + 1}px`;
        setTimeout(() => {
          el.style.height = `${currentHeight}px`;
        }, 100);
      }
    };
    /**
     * Keep a pinch on the map from zooming the whole page on iOS.
     *
     * iOS ignores "user-scalable=no" in the viewport tag, so the gesture events that Safari fires
     * are canceled instead. The map still zooms because the Google Maps API handles the pinch
     * itself. Only the map element is covered so that the rest of the page can still be zoomed by
     * people who need to. Other browsers don't fire these events, so this does nothing in them.
     *
     * @private
     */
    this.#setupPreventPageZoom = () => {
      const element = this.#element;
      if (!this.#preventPageZoom || !element || this.#pageZoomHandler) {
        return;
      }
      const handler = (event) => {
        event.preventDefault();
      };
      this.#pageZoomHandler = handler;
      ["gesturestart", "gesturechange", "gestureend"].forEach((eventName) => {
        element.addEventListener(eventName, handler, { passive: false });
      });
    };
    /**
     * Stop keeping a pinch on the map from zooming the whole page
     *
     * @private
     */
    this.#removePreventPageZoom = () => {
      const element = this.#element;
      const handler = this.#pageZoomHandler;
      if (!element || !handler) {
        return;
      }
      ["gesturestart", "gesturechange", "gestureend"].forEach((eventName) => {
        element.removeEventListener(eventName, handler);
      });
      this.#pageZoomHandler = null;
    };
    /**
     * Set up the map object
     *
     * @param {HTMLElement} element THe HTML elemen to attach the map to
     * @returns {Promise<void>}
     */
    this.#setupMapObject = (element) => new Promise((resolve) => {
      this.#getMapOptions().then((mapOptions) => {
        const map2 = new google.maps.Map(element, mapOptions);
        this.#map = map2;
        this.setEventGoogleObject(map2);
        this.#setupPreventPageZoom();
        if (this.#customControls.length > 0) {
          this.#customControls.forEach((control) => {
            map2.controls[convertControlPosition(control.position)].push(control.element);
          });
        }
        this.#customControls = [];
        resolve();
      });
    });
    /**
     * Set the map as ready
     */
    this.#setMapAsReady = () => {
      this.#isInitialized = true;
      this.#isReady = true;
      this.#isGettingMapOptions = false;
      this.dispatch(MapEvents.READY);
      loader().dispatch(LoaderEvents.MAP_LOAD);
    };
    this.#fullscreenControl = fullscreenControl();
    this.#mapTypeControl = mapTypeControl();
    this.#rotateControl = rotateControl();
    this.#scaleControl = scaleControl();
    this.#streetViewControl = streetViewControl();
    this.#zoomControl = zoomControl();
    if (typeof selector === "string") {
      this.#element = document.querySelector(selector);
    } else if (selector instanceof HTMLElement) {
      this.#element = selector;
    }
    if (isObject(options)) {
      this.setOptions(options);
    }
    this.#runInitHooks();
  }
  /* eslint-disable jsdoc/require-returns-check -- These placeholders throw rather than return. See below. */
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  attachPopup(popupValue, event) {
    throw new Error(missingFeatureMessage("attachPopup", "popup"));
  }
  /**
   * @inheritdoc
   * @param {AttachTooltipValue|TooltipConfig} tooltipValue The content for the Tooltip, or the
   *      Tooltip options object, or the Tooltip object, or a function that returns one of those.
   * @param {'click' | 'clickon' | 'hover'} [event] The event to trigger the tooltip.
   * @returns {Tooltip}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  attachTooltip(tooltipValue, event) {
    throw new Error(missingFeatureMessage("attachTooltip", "tooltip"));
  }
  /**
   * @inheritdoc
   * @param {InfoWindowValue} infoWindowValue The content for the InfoWindow, or the InfoWindow
   *      options object, or the InfoWindow object.
   * @param {'click' | 'clickon' | 'hover'} [event] The event to trigger the InfoWindow.
   * @returns {InfoWindow}
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  attachInfoWindow(infoWindowValue, event) {
    throw new Error(missingFeatureMessage("attachInfoWindow", "infowindow"));
  }
  /* eslint-enable jsdoc/require-returns-check */
  /**
   * The bounds to fit the map to
   *
   * @private
   * @type {LatLngBounds|undefined}
   */
  #bounds;
  #customControls;
  /**
   * Holds the data layer for the map.
   *
   * This is created the first time that the data getter is used so that maps that don't
   * use the data layer don't pay for it. It's then held so that map.data is always the
   * same object.
   *
   * @private
   * @type {DataLayer|undefined}
   */
  #data;
  #element;
  /**
   * Holds the fullscreen control object
   *
   * @private
   * @type {FullscreenControl}
   */
  #fullscreenControl;
  #hiddenFeatures;
  #latitude;
  #longitude;
  #isGettingMapOptions;
  #isInitialized;
  #isInitializing;
  #isReady;
  /**
   * Holds the Google map object.
   *
   * This is undefined until the map is set up when it's shown.
   *
   * @private
   * @type {google.maps.Map|undefined}
   */
  #map;
  /**
   * Holds the map type control object
   *
   * @private
   * @type {MapTypeControl}
   */
  #mapTypeControl;
  #maxFitBoundsZoom;
  #minFitBoundsZoom;
  #options;
  #pageZoomHandler;
  #preventPageZoom;
  /**
   * Holds the map restriction object to restrict the map to a certain area
   *
   * @private
   * @type {MapRestriction|undefined}
   */
  #restriction;
  /**
   * Holds the rotate control object
   *
   * @private
   * @type {RotateControl}
   */
  #rotateControl;
  /**
   * Holds the scale control object
   *
   * @private
   * @type {ScaleControl}
   */
  #scaleControl;
  /**
   * Holds the street view control object
   *
   * @private
   * @type {StreetViewControl}
   */
  #streetViewControl;
  #styles;
  /**
   * Holds the watchId for the watchPosition() function
   *
   * This is undefined until locate() starts watching the user's location.
   *
   * @private
   * @type {number|undefined}
   */
  #watchId;
  /**
   * Holds the zoom control object
   *
   * @private
   * @type {ZoomControl}
   */
  #zoomControl;
  /**
   * Class constructor
   *
   * @param {string|HTMLElement} selector The selector of the element that the map will be rendered in. Or the HTMLElement that the map will be rendered in.
   *      The selector can be any valid selector for document.querySelector() can be used. Or, it can be an HTML element
   * @param {MapOptions} [options] The options object for the map
   */
  /**
   * Holds the functions to run against every map as it is created.
   *
   * Static, so that a plugin can add one without a reference to any particular map.
   *
   * @private
   * @type {InitHook[]}
   */
  static #initHooks = [];
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
  static addInitHook(callback) {
    if (isFunction(callback)) {
      _Map.#initHooks.push(callback);
    }
  }
  /**
   * Run the functions that were registered with addInitHook()
   *
   * @private
   */
  #runInitHooks() {
    _Map.#initHooks.forEach((hook) => {
      try {
        hook.call(this, this);
      } catch (error) {
        console.error("A map init hook threw an error. The map was still created.", error);
      }
    });
  }
  /**
   * Get the center point for the map
   *
   * @returns {LatLng}
   */
  get center() {
    let { center } = this.#options;
    if (this.#map) {
      const mapCenter = this.#map.getCenter();
      if (mapCenter) {
        center = latLng(mapCenter.lat(), mapCenter.lng());
      }
    }
    if (!center.equals(this.#options.center)) {
      this.#options.center = center;
    }
    return this.#options.center;
  }
  /**
   * Set the center point for the map
   *
   * @param {LatLngValue} value The center point for the map
   */
  set center(value) {
    const center = latLng(value);
    if (center.isValid()) {
      this.#options.center = center;
      this.#latitude = center.lat;
      this.#longitude = center.lng;
      if (isObject(this.#map)) {
        this.#map.setCenter(this.#options.center.toGoogle());
      }
    }
  }
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
  get data() {
    if (!this.#data) {
      this.#data = new DataLayer(void 0, this);
    }
    return this.#data;
  }
  /**
   * Get whether the default UI is disabled
   *
   * @returns {boolean}
   */
  get disableDefaultUI() {
    return this.#options.disableDefaultUI ?? false;
  }
  /**
   * Set whether the default UI is disabled
   *
   * @param {boolean} value Whether the default UI is disabled
   */
  set disableDefaultUI(value) {
    if (isBoolean(value)) {
      this.#options.disableDefaultUI = value;
      if (this.#map) {
        this.#map.setOptions({ disableDefaultUI: value });
      }
    }
  }
  /**
   * Get the fullscreen control object
   *
   * @returns {FullscreenControl}
   */
  get fullscreenControl() {
    return this.#fullscreenControl;
  }
  /**
   * Set the fullscreen control object, or whether to display the fullscreen control
   *
   * @param {boolean|FullscreenControl} value The fullscreen control option
   */
  set fullscreenControl(value) {
    if (isBoolean(value)) {
      this.#fullscreenControl.enabled = value;
    } else if (value instanceof FullscreenControl) {
      this.#fullscreenControl = value;
    }
    const map2 = this.#map;
    if (map2) {
      this.#fullscreenControl.toGoogle().then((fullscreenControlOptions) => {
        map2.setOptions({
          fullscreenControl: this.#fullscreenControl.enabled,
          fullscreenControlOptions
        });
      });
    }
  }
  /**
   * Get whether businesses are hidden on the map
   *
   * @returns {boolean}
   */
  get hideBusinesses() {
    return this.#hiddenFeatures.hideBusinesses;
  }
  /**
   * Set whether to hide businesses on the map.
   *
   * This hides the "poi.business" feature type, which includes things like stores, restaurants, and hotels.
   * If the map has already been rendered then it's updated right away.
   *
   * @param {boolean} value Whether to hide businesses
   */
  set hideBusinesses(value) {
    this.#setHideFeature("hideBusinesses", value);
  }
  /**
   * Get whether all points of interest are hidden on the map
   *
   * @returns {boolean}
   */
  get hidePointsOfInterest() {
    return this.#hiddenFeatures.hidePointsOfInterest;
  }
  /**
   * Set whether to hide all points of interest on the map.
   *
   * This hides the "poi" feature type, which includes businesses, parks, schools, attractions, and places of worship.
   * If the map has already been rendered then it's updated right away.
   *
   * @param {boolean} value Whether to hide all points of interest
   */
  set hidePointsOfInterest(value) {
    this.#setHideFeature("hidePointsOfInterest", value);
  }
  /**
   * Get whether transit lines and stations are hidden on the map
   *
   * @returns {boolean}
   */
  get hideTransit() {
    return this.#hiddenFeatures.hideTransit;
  }
  /**
   * Set whether to hide transit lines and stations on the map.
   *
   * This hides the "transit" feature type, which includes things like bus stops, train stations, and rail lines.
   * If the map has already been rendered then it's updated right away.
   *
   * @param {boolean} value Whether to hide transit lines and stations
   */
  set hideTransit(value) {
    this.#setHideFeature("hideTransit", value);
  }
  /**
   * Get the latitude value for the center point
   *
   * @returns {number}
   */
  get latitude() {
    return this.#latitude;
  }
  /**
   * Set the latitude value for the center point
   *
   * @param {string|number} value The latitude value
   */
  set latitude(value) {
    if (isNumberOrNumberString(value)) {
      if (isNumber(value)) {
        this.#latitude = value;
      } else {
        this.#latitude = Number(value);
      }
      this.center = { lat: this.#latitude, lng: this.#longitude };
    }
  }
  /**
   * Get the longitude value for the center point
   *
   * @returns {number}
   */
  get longitude() {
    return this.#longitude;
  }
  /**
   * Set the longitude value for the center point
   *
   * @param {string|number} value The longitude value
   */
  set longitude(value) {
    if (isNumberOrNumberString(value)) {
      if (isNumber(value)) {
        this.#longitude = value;
      } else {
        this.#longitude = Number(value);
      }
      this.center = { lat: this.#latitude, lng: this.#longitude };
    }
  }
  /**
   * Get the map type control object
   *
   * @returns {MapTypeControl}
   */
  get mapTypeControl() {
    return this.#mapTypeControl;
  }
  /**
   * Set the map type control object, or whether to display the map type control
   *
   * @param {boolean|MapTypeControl} value The map type control option
   */
  set mapTypeControl(value) {
    if (isBoolean(value)) {
      this.#mapTypeControl.enabled = value;
    } else if (value instanceof MapTypeControl) {
      this.#mapTypeControl = value;
    }
    const map2 = this.#map;
    if (map2) {
      this.#mapTypeControl.toGoogle().then((mapTypeControlOptions) => {
        map2.setOptions({
          mapTypeControl: this.#mapTypeControl.enabled,
          mapTypeControlOptions
        });
      });
    }
  }
  /**
   * Get the map type ID
   *
   * @returns {string}
   */
  get mapTypeId() {
    const mapTypeId = this.#map ? this.#map.getMapTypeId() : this.#options.mapTypeId;
    if (isStringWithValue(mapTypeId) && mapTypeId !== this.#options.mapTypeId) {
      this.#options.mapTypeId = mapTypeId;
    }
    return this.#options.mapTypeId;
  }
  /**
   * Set the map type ID
   *
   * @param {string} value The map type ID
   */
  set mapTypeId(value) {
    if (isStringWithValue(value)) {
      this.#options.mapTypeId = value;
      if (this.#map) {
        this.#map.setMapTypeId(value);
      }
    }
  }
  /**
   * Get the maximum zoom level for the map when fitting to bounds
   *
   * @returns {null|number}
   */
  get maxFitBoundsZoom() {
    return this.#maxFitBoundsZoom ?? null;
  }
  /**
   * Set the maximum zoom level for the map when fitting to bounds
   *
   * @param {null|number} value The maximum zoom level
   */
  set maxFitBoundsZoom(value) {
    if (isNumber(value) || isNull(value)) {
      this.#maxFitBoundsZoom = value;
    }
  }
  /**
   * Get the maximum zoom level for the map
   *
   * @returns {null|number}
   */
  get maxZoom() {
    return this.#options.maxZoom ?? null;
  }
  /**
   * Set the maximum zoom level for the map
   *
   * @param {null|number} value The maximum zoom level
   */
  set maxZoom(value) {
    if (isNumber(value) || isNull(value)) {
      this.#options.maxZoom = value ?? void 0;
      if (this.#map) {
        this.#map.setOptions({ maxZoom: value });
      }
    }
  }
  /**
   * Get the minimum zoom level for the map when fitting to bounds
   *
   * @returns {null|number}
   */
  get minFitBoundsZoom() {
    return this.#minFitBoundsZoom ?? null;
  }
  /**
   * Set the minimum zoom level for the map when fitting to bounds
   *
   * @param {null|number} value The minimum zoom level
   */
  set minFitBoundsZoom(value) {
    if (isNumber(value) || isNull(value)) {
      this.#minFitBoundsZoom = value;
    }
  }
  /**
   * Get the minimum zoom level for the map
   *
   * @returns {null|number}
   */
  get minZoom() {
    return this.#options.minZoom ?? null;
  }
  /**
   * Set the minimum zoom level for the map
   *
   * @param {null|number} value The minimum zoom level
   */
  set minZoom(value) {
    if (isNumber(value) || isNull(value)) {
      this.#options.minZoom = value ?? void 0;
      if (this.#map) {
        this.#map.setOptions({ minZoom: value });
      }
    }
  }
  /**
   * Get whether a pinch on the map is kept from zooming the whole page on iOS
   *
   * @returns {boolean}
   */
  get preventPageZoom() {
    return this.#preventPageZoom;
  }
  /**
   * Set whether a pinch on the map is kept from zooming the whole page on iOS
   *
   * @param {boolean} value Whether to keep a pinch on the map from zooming the page
   */
  set preventPageZoom(value) {
    if (isBoolean(value)) {
      this.#preventPageZoom = value;
      if (value) {
        this.#setupPreventPageZoom();
      } else {
        this.#removePreventPageZoom();
      }
    }
  }
  /**
   * Get the MapRestriction object if it's been set
   *
   * @returns {MapRestriction|undefined}
   */
  get restriction() {
    return this.#restriction;
  }
  /**
   * Set the MapRestriction value
   *
   * @param {MapRestrictionValue} value The MapRestriction value
   */
  set restriction(value) {
    this.#restriction = mapRestriction(value);
    const map2 = this.#map;
    if (map2 && this.#restriction.isValid() && this.#restriction.isEnabled()) {
      this.#restriction.toGoogle().then((restriction) => {
        map2.setOptions({ restriction });
      });
    }
  }
  /**
   * Get the rotate control object
   *
   * @returns {RotateControl}
   */
  get rotateControl() {
    return this.#rotateControl;
  }
  /**
   * Set the rotate control object, or whether to display the rotate control
   *
   * @param {boolean|RotateControl} value The rotate control option
   */
  set rotateControl(value) {
    if (isBoolean(value)) {
      this.#rotateControl.enabled = value;
    } else if (value instanceof RotateControl) {
      this.#rotateControl = value;
    }
    const map2 = this.#map;
    if (map2) {
      this.#rotateControl.toGoogle().then((rotateControlOptions) => {
        map2.setOptions({
          rotateControl: this.#rotateControl.enabled,
          rotateControlOptions
        });
      });
    }
  }
  /**
   * Get the scale control object
   *
   * @returns {ScaleControl}
   */
  get scaleControl() {
    return this.#scaleControl;
  }
  /**
   * Set the scale control object, or whether to display the scale control
   *
   * @param {boolean|ScaleControl} value The scale control option
   */
  set scaleControl(value) {
    if (isBoolean(value)) {
      this.#scaleControl.enabled = value;
    } else if (value instanceof ScaleControl) {
      this.#scaleControl = value;
    }
    const map2 = this.#map;
    if (map2) {
      this.#scaleControl.toGoogle().then((scaleControlOptions) => {
        map2.setOptions({
          scaleControl: this.#scaleControl.enabled,
          scaleControlOptions
        });
      });
    }
  }
  /**
   * Get the street view control object
   *
   * @returns {StreetViewControl}
   */
  get streetViewControl() {
    return this.#streetViewControl;
  }
  /**
   * Set the street view control object, or whether to display the scale control
   *
   * @param {boolean|StreetViewControl} value The scale control option
   */
  set streetViewControl(value) {
    if (isBoolean(value)) {
      this.#streetViewControl.enabled = value;
    } else if (value instanceof StreetViewControl) {
      this.#streetViewControl = value;
    }
    const map2 = this.#map;
    if (map2) {
      this.#streetViewControl.toGoogle().then((streetViewControlOptions) => {
        map2.setOptions({
          streetViewControl: this.#streetViewControl.enabled,
          streetViewControlOptions
        });
      });
    }
  }
  /**
   * Get the zoom level for the map
   *
   * @returns {number}
   */
  get zoom() {
    const zoom = this.#map ? this.#map.getZoom() : this.#options.zoom;
    if (isNumber(zoom) && zoom !== this.#options.zoom) {
      this.#options.zoom = zoom;
    }
    return this.#options.zoom;
  }
  /**
   * Set the zoom level for the map
   *
   * @param {number|string} value The zoom level
   */
  set zoom(value) {
    if (isNumber(value)) {
      this.#options.zoom = value;
    } else if (isNumberString(value)) {
      this.#options.zoom = Number(value);
    }
    if (this.#map) {
      this.#map.setZoom(Number(value));
    }
  }
  /**
   * Get the zoom control object
   *
   * @returns {ZoomControl}
   */
  get zoomControl() {
    return this.#zoomControl;
  }
  /**
   * Set the zoom control object, or whether to display the zoom control
   *
   * @param {boolean|ZoomControl} value The zoom control option
   */
  set zoomControl(value) {
    if (isBoolean(value)) {
      this.#zoomControl.enabled = value;
    } else if (value instanceof ZoomControl) {
      this.#zoomControl = value;
    }
    const map2 = this.#map;
    if (map2) {
      this.#zoomControl.toGoogle().then((zoomControlOptions) => {
        map2.setOptions({
          zoomControl: this.#zoomControl.enabled,
          zoomControlOptions
        });
      });
    }
  }
  /**
   * Adds a custom control to the map
   *
   * @param {ControlPositionValue} position The position to add the custom control
   * @param {HTMLElement} element The HTML element for the custom control
   * @returns {Map}
   */
  addCustomControl(position, element) {
    if (this.#map) {
      this.#map.controls[convertControlPosition(position)].push(element);
    } else {
      this.#customControls.push({ position, element });
    }
    return this;
  }
  /**
   * Add GeoJson data to the map's data layer.
   *
   * This is the same as calling map.data.addGeoJson().
   *
   * @param {object} geoJson The GeoJson object to add
   * @param {LoadOptions} [options] The options for adding the data
   * @returns {Promise<DataFeature[]>}
   */
  addGeoJson(geoJson, options) {
    return this.data.addGeoJson(geoJson, options);
  }
  /**
   * Add a value to the map bounds
   *
   * @param {LatLngValue | LatLngValue[]} value The latitude/longitude value to add to the bounds
   * @returns {Map}
   */
  addToBounds(value) {
    if (!this.#bounds) {
      this.#bounds = latLngBounds();
    }
    this.#bounds.extend(value);
    return this;
  }
  /**
   * Clear the existing bounds
   *
   * @returns {Map}
   */
  clearBounds() {
    this.#bounds = latLngBounds();
    return this;
  }
  /**
   * Enable the default UI
   *
   * @returns {Map}
   */
  enableDefaultUI() {
    this.disableDefaultUI = false;
    return this;
  }
  /**
   * Disable the default UI
   *
   * @returns {Map}
   */
  doDisableDefaultUI() {
    this.disableDefaultUI = true;
    return this;
  }
  /**
   * Show the map
   *
   * Alias to show()
   *
   * @param {Function} callback The callback function to call after the map loads
   * @returns {Promise<Map>}
   */
  display(callback) {
    return this.show(callback);
  }
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
  fitBounds(bounds, maxZoom, minZoom) {
    return new Promise((resolve) => {
      if (this.#map) {
        this.#fitBounds(bounds, maxZoom, minZoom).then(() => {
          resolve(this);
        });
      } else {
        this.init().then(() => {
          this.#fitBounds(bounds, maxZoom, minZoom).then(() => {
            resolve(this);
          });
        });
      }
    });
  }
  /**
   * Do the actual fitting of the bounds
   *
   * @param {LatLngBoundsValue} bounds The bounds to fit
   * @param {number} [maxZoom] The maximum zoom level to zoom to when fitting the bounds. Higher numbers will zoom in more.
   * @param {number} [minZoom] The minimum zoom level to zoom to when fitting the bounds. Lower numbers will zoom out more.
   * @returns {Promise<void>}
   */
  #fitBounds(bounds, maxZoom, minZoom) {
    return new Promise((resolve) => {
      if (bounds) {
        latLngBounds(bounds).toGoogle().then((googleBounds) => {
          this.#handleZoomAfterFitBounds(maxZoom, minZoom);
          this.#map.fitBounds(googleBounds);
          resolve();
        });
      } else if (this.#bounds) {
        this.#bounds.toGoogle().then((googleBounds) => {
          this.#handleZoomAfterFitBounds(maxZoom, minZoom);
          this.#map.fitBounds(googleBounds);
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
  /**
   * Alias to fitBounds
   *
   * @param {LatLngBoundsValue} bounds The bounds to fit
   * @param {number} [maxZoom] The maximum zoom level to zoom to when fitting the bounds. Higher numbers will zoom in more.
   * @param {number} [minZoom] The minimum zoom level to zoom to when fitting the bounds. Lower numbers will zoom out more.
   * @returns {Promise<Map>}
   */
  fitToBounds(bounds, maxZoom, minZoom) {
    return this.fitBounds(bounds, maxZoom, minZoom);
  }
  /**
   * Make sure that the zoom level doesn't exceed the maxZoom value
   *
   * @param {number} [maxZoom] The maximum zoom level to zoom to when fitting the bounds. Higher numbers will zoom in more.
   * @param {number} [minZoom] The minimum zoom level to zoom to when fitting the bounds. Lower numbers will zoom out more.
   */
  #handleZoomAfterFitBounds(maxZoom, minZoom) {
    let max = this.maxFitBoundsZoom ?? this.maxZoom;
    let min = this.minFitBoundsZoom ?? this.minZoom;
    if (isNumberOrNumberString(maxZoom)) {
      max = Number(maxZoom);
    }
    if (isNumberOrNumberString(minZoom)) {
      min = Number(minZoom);
    }
    if (isNumber(max) && max >= 0) {
      this.once(MapEvents.BOUNDS_CHANGED, () => {
        let { zoom } = this;
        if (isNumber(min) && min >= 0) {
          if (zoom < min) {
            zoom = min;
          }
        }
        this.zoom = Math.min(zoom, max);
      });
    }
  }
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
  init(callback) {
    return new Promise((resolve) => {
      if (!this.#isInitialized && !this.#isReady) {
        if (!this.#isInitializing) {
          this.#isInitializing = true;
          this.#load().then(() => {
            callCallback(callback);
            resolve(this);
          });
        } else {
          this.onceImmediate(MapEvents.READY, () => {
            callCallback(callback);
            resolve(this);
          });
        }
      } else {
        callCallback(callback);
        resolve(this);
      }
    });
  }
  /**
   * Get the map options for showing the map
   *
   * @private
   * @returns {google.maps.MapOptions}
   */
  #getMapOptions() {
    return new Promise((resolve) => {
      const mapOptions = {};
      const booleanOptions = [
        "clickableIcons",
        "disableDefaultUI",
        "headingInteractionEnabled",
        "isFractionalZoomEnabled",
        "keyboardShortcuts",
        "noClear",
        "scrollwheel",
        "tiltInteractionEnabled"
      ];
      const options = this.#options;
      const googleOptions = mapOptions;
      booleanOptions.forEach((key) => {
        if (isBoolean(options[key])) {
          googleOptions[key] = options[key];
        }
      });
      const numberOptions = ["controlSize", "heading", "maxZoom", "minZoom", "tilt", "zoom"];
      numberOptions.forEach((key) => {
        if (isNumberOrNumberString(options[key])) {
          googleOptions[key] = options[key];
        }
      });
      const stringOptions = ["backgroundColor", "draggableCursor", "draggingCursor", "gestureHandling", "mapId"];
      stringOptions.forEach((key) => {
        if (isStringWithValue(options[key])) {
          googleOptions[key] = options[key];
        }
      });
      const optionsToSet = ["renderingType", "streetView"];
      optionsToSet.forEach((key) => {
        if (typeof options[key] !== "undefined") {
          googleOptions[key] = options[key];
        }
      });
      if (isStringWithValue(this.#options.mapTypeId)) {
        if (this.#mapTypeControl.hasMapType(this.#options.mapTypeId)) {
          mapOptions.mapTypeId = this.#options.mapTypeId;
        } else {
          console.warn(
            "The selected mapTypeId is not one of the allowed types set for the MapType Control.",
            this.#options.mapTypeId
          );
        }
      }
      mapOptions.center = this.#options.center.toGoogle();
      (async () => {
        mapOptions.fullscreenControl = this.#fullscreenControl.enabled;
        const fullscreenControlOptions = await this.#fullscreenControl.toGoogle();
        mapOptions.fullscreenControlOptions = fullscreenControlOptions;
        mapOptions.mapTypeControl = this.#mapTypeControl.enabled;
        const mapTypeControlOptions = await this.#mapTypeControl.toGoogle();
        mapOptions.mapTypeControlOptions = mapTypeControlOptions;
        if (this.#restriction && this.#restriction.isValid() && this.#restriction.isEnabled()) {
          const restriction = await this.#restriction.toGoogle();
          mapOptions.restriction = restriction;
        }
        mapOptions.rotateControl = this.#rotateControl.enabled;
        const rotateControlOptions = await this.#rotateControl.toGoogle();
        mapOptions.rotateControlOptions = rotateControlOptions;
        mapOptions.scaleControl = this.#scaleControl.enabled;
        const scaleControlOptions = await this.#scaleControl.toGoogle();
        mapOptions.scaleControlOptions = scaleControlOptions;
        mapOptions.streetViewControl = this.#streetViewControl.enabled;
        const streetViewControlOptions = await this.#streetViewControl.toGoogle();
        mapOptions.streetViewControlOptions = streetViewControlOptions;
        mapOptions.zoomControl = this.#zoomControl.enabled;
        const zoomControlOptions = await this.#zoomControl.toGoogle();
        mapOptions.zoomControlOptions = zoomControlOptions;
        const styles = this.#getGoogleStyles();
        if (styles.length > 0) {
          mapOptions.styles = styles;
        }
        resolve(mapOptions);
      })();
    });
  }
  /**
   * Get the styles to send to Google Maps.
   *
   * This combines the styles set with the "styles" option with the styles for the shortcut options
   * to hide features, like hideBusinesses. The shortcut styles are added last so that they take
   * precedence over any other styles for the same feature type.
   *
   * @private
   * @returns {google.maps.MapTypeStyle[]}
   */
  #getGoogleStyles() {
    const styles = this.#styles.map((style) => style.toGoogle());
    Object.keys(hideFeatureTypes).forEach((key) => {
      if (this.#hiddenFeatures[key]) {
        styles.push(
          mapStyle({ featureType: hideFeatureTypes[key], stylers: [{ visibility: "off" }] }).toGoogle()
        );
      }
    });
    return styles;
  }
  /**
   * Set whether a feature type is hidden by one of the shortcut options, like hideBusinesses.
   *
   * If the map has already been rendered then the styles are updated on it right away.
   *
   * @private
   * @param {HideFeatureOption} key The shortcut option
   * @param {boolean} value Whether to hide the feature type
   */
  #setHideFeature(key, value) {
    if (isBoolean(value)) {
      this.#hiddenFeatures[key] = value;
      if (this.#map) {
        this.#map.setOptions({ styles: this.#getGoogleStyles() });
      }
    }
  }
  /**
   * Gets the lat/lng bounds of the current map viewport
   *
   * If the map is not yet initialized, this will return undefined.
   *
   * @returns {Promise<LatLngBounds | undefined>}
   */
  getBounds() {
    return new Promise((resolve) => {
      const googleBounds = this.#map?.getBounds();
      if (googleBounds) {
        const bounds = new LatLngBounds();
        bounds.union(googleBounds).then(() => {
          resolve(bounds);
        });
      } else {
        resolve(void 0);
      }
    });
  }
  /**
   * Get the center point for the map
   *
   * @returns {LatLng}
   */
  getCenter() {
    return this.center;
  }
  /**
   * Get the div element that the map is rendered in.
   * If the map is not yet initialized, this will return undefined.
   *
   * @returns {HTMLElement|undefined}
   */
  getDiv() {
    if (this.#map) {
      return this.#map.getDiv();
    }
    return void 0;
  }
  /**
   * Gets whether the map is ready for use. This also means that the map library is loaded and the map is visible.
   *
   * @returns {boolean}
   */
  getIsReady() {
    return this.#isReady;
  }
  /**
   * Gets the current projection for the map.
   *
   * If the map is not yet initialized, this will return undefined.
   *
   * @returns {google.maps.Projection|undefined}
   */
  getProjection() {
    if (this.#map) {
      return this.#map.getProjection();
    }
    return void 0;
  }
  /**
   * Get the zoom level
   *
   * @returns {number}
   */
  getZoom() {
    return this.zoom;
  }
  /**
   * Load GeoJson data into the map's data layer from a url.
   *
   * This is the same as calling map.data.loadGeoJson(). More than one url can be passed.
   *
   * @param {string|string[]} url The url to load the GeoJson from, or an array of urls
   * @param {LoadOptions} [options] The options for loading the data
   * @returns {Promise<DataFeature[]>}
   */
  loadGeoJson(url, options) {
    return this.data.loadGeoJson(url, options);
  }
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
  load(callback) {
    return this.init(callback);
  }
  /**
   * Load and show the map
   *
   * @param {Function} callback The callback function to call after the map loads
   * @returns {Promise<void>}
   */
  #load(callback) {
    return new Promise((resolve, reject) => {
      loader().load().then(() => {
        this.#showMap().then(() => {
          callCallback(callback);
          resolve();
        });
      }).catch((err) => {
        reject(err);
      });
    });
  }
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
  locate(options, onSuccess) {
    if (navigator.geolocation) {
      const defaultOptions = {
        watch: true
      };
      let config = defaultOptions;
      if (isObject(options)) {
        config = { ...defaultOptions, ...options };
      }
      const positionOptions = {
        enableHighAccuracy: false,
        maximumAge: 0,
        timeout: Infinity,
        ...config
      };
      const success = (position) => {
        const { latitude, longitude } = position.coords;
        const data = {
          latitude,
          longitude,
          latLng: latLng(latitude, longitude),
          timestamp: position.timestamp
        };
        const coordinateKeys = ["accuracy", "altitude", "altitudeAccuracy", "heading", "speed"];
        coordinateKeys.forEach((key) => {
          const value = position.coords[key];
          if (typeof value === "number") {
            data[key] = value;
          }
        });
        this.dispatch("locationfound", data);
        if (isFunction(onSuccess)) {
          onSuccess(data);
        } else if (isFunction(options)) {
          options(data);
        }
      };
      const error = (err) => {
        this.dispatch("locationerror", { code: err.code, message: err.message });
        console.error(err);
      };
      if (config.watch) {
        this.#watchId = navigator.geolocation.watchPosition(success, error, positionOptions);
      } else {
        navigator.geolocation.getCurrentPosition(success, error, positionOptions);
      }
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
    return this;
  }
  /**
   * @inheritdoc
   */
  hasListener(type, callback) {
    return super.hasListener(type, callback);
  }
  /**
   * @inheritdoc
   */
  off(type, callback, options) {
    super.off(type, callback, options);
  }
  /**
   * @inheritdoc
   */
  on(type, callback, config) {
    super.on(type, callback, config);
  }
  /**
   * @inheritdoc
   */
  onImmediate(type, callback, config) {
    super.onImmediate(type, callback, config);
  }
  /**
   * @inheritdoc
   */
  once(type, callback, config) {
    super.once(type, callback, config);
  }
  /**
   * @inheritdoc
   */
  onceImmediate(type, callback, config) {
    super.onceImmediate(type, callback, config);
  }
  /**
   * @inheritdoc
   */
  only(type, callback, config) {
    super.only(type, callback, config);
  }
  /**
   * @inheritdoc
   */
  onlyOnce(type, callback, config) {
    super.onlyOnce(type, callback, config);
  }
  /**
   * Add event listener for when the viewport bounds have changed.
   *
   * @param {EventCallback} callback The callback function to call when the map bounds change
   */
  onBoundsChanged(callback) {
    this.on(MapEvents.BOUNDS_CHANGED, callback);
  }
  /**
   * Add event listener for when the map center property changes.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onCenterChanged(callback) {
    this.on(MapEvents.CENTER_CHANGED, callback);
  }
  /**
   * Add an event listener for when the map is clicked.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onClick(callback) {
    this.on(MapEvents.CLICK, callback);
  }
  /**
   * Add an event listener for when the DOM contextmenu is fired on the map container.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onContextMenu(callback) {
    this.on(MapEvents.CONTEXT_MENU, callback);
  }
  /**
   * Add an event listener for when the map is double clicked.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onDblClick(callback) {
    this.on(MapEvents.DBLCLICK, callback);
  }
  /**
   * Add an event listener for when the user drags the map.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onDrag(callback) {
    this.on(MapEvents.DRAG, callback);
  }
  /**
   * Add an event listener for when the user stops dragging the map.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onDragEnd(callback) {
    this.on(MapEvents.DRAG_END, callback);
  }
  /**
   * Add an event listener for when the user starts draging the map.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onDragStart(callback) {
    this.on(MapEvents.DRAG_START, callback);
  }
  /**
   * Add an event listener for when the map heading value changes.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onHeadingChanged(callback) {
    this.on(MapEvents.HEADING_CHANGED, callback);
  }
  /**
   * Add an event listener for when the map becomes idle after panning or zooming.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onIdle(callback) {
    this.on(MapEvents.IDLE, callback);
  }
  /**
   * Add an event listener for when the isFractionalZoomEnabled property has changed.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onIsFractionalZoomEnabledChanged(callback) {
    this.on(MapEvents.IS_FRACTIONAL_ZOOM_ENABLED_CHANGED, callback);
  }
  /**
   * Add an event listener for when there is an error getting the user's location.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onLocationError(callback) {
    this.on(MapEvents.LOCATION_ERROR, callback);
  }
  /**
   * Add an event listener for when the user's location has been found.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onLocationFound(callback) {
    this.on(MapEvents.LOCATION_FOUND, callback);
  }
  /**
   * Add an event listener for when the map capabilities change.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onMapCapabilitiesChanged(callback) {
    this.on(MapEvents.MAP_CAPABILITIES_CHANGED, callback);
  }
  /**
   * Add an event listener for when the mapTypeId property changes.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onMapTypeIdChanged(callback) {
    this.on(MapEvents.MAP_TYPE_ID_CHANGED, callback);
  }
  /**
   * Add an event listener for when the user's mouse moves over the map container.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onMouseMove(callback) {
    this.on(MapEvents.MOUSE_MOVE, callback);
  }
  /**
   * Add an event listener for when the user's mouse exits the map container.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onMouseOut(callback) {
    this.on(MapEvents.MOUSE_OUT, callback);
  }
  /**
   * Add an event listener for when the user's mouse enters the map container.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onMouseOver(callback) {
    this.on(MapEvents.MOUSE_OVER, callback);
  }
  /**
   * Add an event listener for when the map projection has changed.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onProjectionChanged(callback) {
    this.on(MapEvents.PROJECTION_CHANGED, callback);
  }
  /**
   * Add an event listener for when the map is ready and visible
   *
   * This is a "shortcut" to "on('ready', callback)"
   *
   * @param {EventCallback} [callback] The callback function to call when the event is dispatched.
   */
  onReady(callback) {
    this.onceImmediate(MapEvents.READY, callback);
  }
  /**
   * Add an event listener for when the map renderingType has changed.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onRenderingTypeChanged(callback) {
    this.on(MapEvents.RENDERING_TYPE_CHANGED, callback);
  }
  /**
   * Add an event listener for when the visible tiles have finished loading.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onTilesLoaded(callback) {
    this.on(MapEvents.TILES_LOADED, callback);
  }
  /**
   * Add an event listener for when the map tilt property changes.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onTiltChanged(callback) {
    this.on(MapEvents.TILT_CHANGED, callback);
  }
  /**
   * Add an event listener for when the map zoom property changes
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onZoomChanged(callback) {
    this.on(MapEvents.ZOOM_CHANGED, callback);
  }
  /**
   * Changes the center of the map by the given distance in pixels.
   *
   * @param {number} x The number of pixels to move the map in the x direction
   * @param {number} y The number of pixels to move the map in the y direction
   */
  panBy(x, y) {
    if (this.#map) {
      this.#map.panBy(x, y);
    } else {
      this.init().then(() => {
        this.#map.panBy(x, y);
      });
    }
  }
  /**
   * Changes the center of the map to the lat/lng value.
   *
   * If the change is less than both the width and height of the map, the transition will be smoothly animated.
   *
   * @param {LatLngValue} value The latitude/longitude value to pan to
   */
  panTo(value) {
    if (this.#map) {
      this.#map.panTo(latLng(value).toGoogle());
    } else {
      this.init().then(() => {
        this.#map.panTo(latLng(value).toGoogle());
      });
    }
  }
  /**
   * Set the API key
   *
   * @param {string} key The API key
   * @returns {Map}
   */
  setApiKey(key) {
    if (isStringWithValue(key)) {
      loader().apiKey = key;
    } else {
      throw new Error("You must pass a valid API key");
    }
    return this;
  }
  /**
   * Set the center point for the map
   *
   * @param {number|LatLngValue} latitude The latitude value or the latitude/longitude pair
   * @param {number} [longitude] The longitude value
   * @returns {Map}
   */
  setCenter(latitude, longitude) {
    const center = latLng(latitude, longitude);
    if (center.isValid()) {
      this.#options.center = center;
      this.#latitude = center.lat;
      this.#longitude = center.lng;
      if (isObject(this.#map)) {
        this.#map.setCenter(this.#options.center.toGoogle());
      }
    }
    return this;
  }
  /**
   * Set whether to hide businesses on the map.
   *
   * This can be called after the map has been rendered.
   *
   * @param {boolean} [value] Whether to hide businesses. Defaults to true.
   * @returns {Map}
   */
  setHideBusinesses(value = true) {
    this.hideBusinesses = value;
    return this;
  }
  /**
   * Set whether to hide all points of interest on the map.
   *
   * This can be called after the map has been rendered.
   *
   * @param {boolean} [value] Whether to hide all points of interest. Defaults to true.
   * @returns {Map}
   */
  setHidePointsOfInterest(value = true) {
    this.hidePointsOfInterest = value;
    return this;
  }
  /**
   * Set whether to hide transit lines and stations on the map.
   *
   * This can be called after the map has been rendered.
   *
   * @param {boolean} [value] Whether to hide transit lines and stations. Defaults to true.
   * @returns {Map}
   */
  setHideTransit(value = true) {
    this.hideTransit = value;
    return this;
  }
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
  setLatitudeLongitude(latitude, longitude, updateCenter = true) {
    if (isNumberOrNumberString(latitude) && isNumberOrNumberString(longitude)) {
      this.#latitude = Number(latitude);
      this.#longitude = Number(longitude);
      if (updateCenter) {
        this.setCenter(this.#latitude, this.#longitude);
      }
    }
    return this;
  }
  /**
   * Set the map type ID
   *
   * @param {string} mapTypeId The map type ID to use for the map.
   * @returns {Map}
   */
  setMapTypeId(mapTypeId) {
    this.mapTypeId = mapTypeId;
    return this;
  }
  /**
   * Set the map options
   *
   * @param {MapOptions} options The map options
   * @returns {Map}
   */
  setOptions(options) {
    if (isObject(options)) {
      if (options.apiKey || options.libraries || options.version) {
        loader(options);
      }
      let center = latLng();
      if (options.center) {
        center = latLng(options.center);
      } else {
        if (isNumberOrNumberString(options.lat)) {
          center.setLat(options.lat);
          this.latitude = options.lat;
        } else if (isNumberOrNumberString(options.latitude)) {
          center.setLat(options.latitude);
          this.latitude = options.latitude;
        }
        if (isNumberOrNumberString(options.lng)) {
          center.setLng(options.lng);
          this.longitude = options.lng;
        } else if (isNumberOrNumberString(options.longitude)) {
          center.setLng(options.longitude);
          this.longitude = options.longitude;
        }
      }
      if (center.isValid()) {
        this.#options.center = center;
      }
      if (isBoolean(options.disableDefaultUI)) {
        this.disableDefaultUI = options.disableDefaultUI;
      }
      if (typeof options.fullscreenControl !== "undefined") {
        if (isBoolean(options.fullscreenControl)) {
          this.#fullscreenControl.enabled = options.fullscreenControl;
        } else if (options.fullscreenControl instanceof FullscreenControl) {
          this.#fullscreenControl = options.fullscreenControl;
        }
      }
      if (isStringWithValue(options.mapId)) {
        this.#options.mapId = options.mapId;
      }
      if (typeof options.mapTypeControl !== "undefined") {
        if (isBoolean(options.mapTypeControl)) {
          this.#mapTypeControl.enabled = options.mapTypeControl;
        } else if (options.mapTypeControl instanceof MapTypeControl) {
          this.#mapTypeControl = options.mapTypeControl;
        }
      }
      if (options.mapTypeId) {
        this.mapTypeId = options.mapTypeId;
      }
      if (typeof options.maxFitBoundsZoom !== "undefined") {
        this.maxFitBoundsZoom = options.maxFitBoundsZoom;
      }
      if (typeof options.minFitBoundsZoom !== "undefined") {
        this.minFitBoundsZoom = options.minFitBoundsZoom;
      }
      if (typeof options.maxZoom !== "undefined") {
        this.maxZoom = options.maxZoom;
      }
      if (typeof options.minZoom !== "undefined") {
        this.minZoom = options.minZoom;
      }
      if (isBoolean(options.preventPageZoom)) {
        this.preventPageZoom = options.preventPageZoom;
      }
      if (typeof options.restriction !== "undefined") {
        this.restriction = options.restriction;
      }
      if (isDefined(options.rotateControl)) {
        if (isBoolean(options.rotateControl)) {
          this.#rotateControl.enabled = options.rotateControl;
        } else if (options.rotateControl instanceof RotateControl) {
          this.#rotateControl = options.rotateControl;
        }
      }
      if (isDefined(options.scaleControl)) {
        if (isBoolean(options.scaleControl)) {
          this.#scaleControl.enabled = options.scaleControl;
        } else if (options.scaleControl instanceof ScaleControl) {
          this.#scaleControl = options.scaleControl;
        }
      }
      if (isDefined(options.streetViewControl)) {
        if (isBoolean(options.streetViewControl)) {
          this.#streetViewControl.enabled = options.streetViewControl;
        } else if (options.streetViewControl instanceof StreetViewControl) {
          this.#streetViewControl = options.streetViewControl;
        }
      }
      if (isDefined(options.zoomControl)) {
        if (isBoolean(options.zoomControl)) {
          this.#zoomControl.enabled = options.zoomControl;
        } else if (options.zoomControl instanceof ZoomControl) {
          this.#zoomControl = options.zoomControl;
        }
      }
      if (Array.isArray(options.styles)) {
        this.#styles = options.styles.map((style) => mapStyle(style));
      } else if (options.styles instanceof MapStyle) {
        this.#styles = [options.styles];
      }
      Object.keys(hideFeatureTypes).forEach((key) => {
        if (isBoolean(options[key])) {
          this.#setHideFeature(key, options[key]);
        }
      });
      if (options.zoom) {
        this.zoom = options.zoom;
      }
      const booleanOptions = [
        "clickableIcons",
        "headingInteractionEnabled",
        "isFractionalZoomEnabled",
        "keyboardShortcuts",
        "noClear",
        "scrollwheel",
        "tiltInteractionEnabled"
      ];
      const newOptions = options;
      const currentOptions = this.#options;
      booleanOptions.forEach((key) => {
        if (isBoolean(newOptions[key])) {
          currentOptions[key] = newOptions[key];
        }
      });
      const numberOptions = ["controlSize", "heading", "tilt"];
      numberOptions.forEach((key) => {
        if (isNumberOrNumberString(newOptions[key])) {
          currentOptions[key] = newOptions[key];
        }
      });
      const stringOptions = ["backgroundColor", "draggableCursor", "draggingCursor", "gestureHandling"];
      stringOptions.forEach((key) => {
        if (isStringWithValue(newOptions[key])) {
          currentOptions[key] = newOptions[key];
        }
      });
      const otherOptions = ["mapTypeId", "renderingType", "streetView"];
      otherOptions.forEach((key) => {
        if (typeof newOptions[key] !== "undefined") {
          currentOptions[key] = newOptions[key];
        }
      });
      const map2 = this.#map;
      if (map2) {
        this.#getMapOptions().then((mapOptions) => {
          map2.setOptions(mapOptions);
        });
      }
    }
    return this;
  }
  /**
   * Set the zoom value
   *
   * @param {number|string} zoom The zoom value
   * @returns {Map}
   */
  setZoom(zoom) {
    this.zoom = zoom;
    return this;
  }
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
  show(callback) {
    return new Promise((resolve) => {
      if (checkForGoogleMaps("Map", "Map", false)) {
        this.#showMap().then(() => {
          callCallback(callback);
          resolve(this);
        });
      } else {
        loader().onceLoad(() => {
          this.#showMap().then(() => {
            callCallback(callback);
            resolve(this);
          });
        });
      }
    });
  }
  /**
   * Show the map
   *
   * This also dispatches the "visible" and "map_load" events,
   * and calls the callback function.
   *
   * @returns {Promise<void>}
   */
  #showMap() {
    return new Promise((resolve) => {
      if (!this.#isReady && !this.#isGettingMapOptions) {
        this.#isGettingMapOptions = true;
        const element = this.#element;
        if (element === null) {
          throw new Error(
            "The map element could not be found. Make sure the map selector is correct and the element exists."
          );
        }
        const elementDisplay = getComputedStyle(element).getPropertyValue("display");
        if (elementDisplay === "none" || element.offsetHeight === 1 || element.offsetWidth === 0) {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  observer.disconnect();
                  this.#setupMapObject(element).then(() => {
                    setTimeout(() => {
                      this.#setMapAsReady();
                      resolve();
                    }, 100);
                  });
                }
              });
            },
            {
              root: document.documentElement
            }
          );
          observer.observe(element);
        } else {
          this.#setupMapObject(element).then(() => {
            this.#setMapAsReady();
            resolve();
          });
        }
      } else if (!this.#isReady) {
        this.onceImmediate(MapEvents.READY, () => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
  #setupPreventPageZoom;
  #removePreventPageZoom;
  #setupMapObject;
  #setMapAsReady;
  /**
   * Stop watching for the user's location
   *
   * @returns {Map}
   */
  stopLocate() {
    if (navigator.geolocation && typeof this.#watchId !== "undefined") {
      navigator.geolocation.clearWatch(this.#watchId);
    }
    return this;
  }
  /**
   * Returns the Google map object.
   *
   * The Google map object is set up when the map is shown. Before that this returns undefined.
   * Use init(), load(), or show() and wait for them to resolve before calling this.
   *
   * @returns {google.maps.Map|undefined}
   */
  toGoogle() {
    return this.#map;
  }
};
var map = (selector, config) => new Map(selector, config);

export {
  Base_default,
  READY_EVENT,
  INTERNAL_EVENTS,
  AutocompleteSearchBoxEvents,
  ControlPosition,
  convertControlPosition,
  DataLayerEvents,
  GeometryType,
  GeocoderErrorStatus,
  GeocoderLocationType,
  ImageOverlayEvents,
  InfoWindowEvents,
  LayerEvents,
  LoaderEvents,
  MapEvents,
  MapTypeControlStyle,
  convertMapTypeControlStyle,
  MapTypeId,
  MarkerEvents,
  OverlayEvents,
  PlacesSearchBoxEvents,
  PolylineEvents,
  PopupEvents,
  RenderingType,
  StreetViewSource,
  SymbolPath,
  convertSymbolPath,
  isBoolean,
  isDefined,
  isFunction,
  isNull,
  isNumber,
  isNumberString,
  isNumberOrNumberString,
  isString,
  isStringWithValue,
  isStringOrNumber,
  isUndefined,
  isNullOrUndefined,
  getNumber,
  getBoolean,
  isObject,
  isObjectWithValues,
  isPromise,
  getPixelsFromLatLng,
  checkForGoogleMaps,
  getSizeWithUnit,
  objectEquals,
  objectHasValue,
  renderTemplate,
  callCallback,
  calculateDimensions,
  LatLng,
  latLng,
  Point,
  point,
  Evented,
  Loader,
  loader,
  LatLngBounds,
  latLngBounds,
  Layer_default,
  DataFeature,
  Size,
  size,
  Icon,
  icon,
  FullscreenControl,
  fullscreenControl,
  MapRestriction,
  mapRestriction,
  MapTypeControl,
  mapTypeControl,
  MapStyle,
  mapStyle,
  RotateControl,
  rotateControl,
  ScaleControl,
  scaleControl,
  StreetViewControl,
  streetViewControl,
  ZoomControl,
  zoomControl,
  Map,
  map,
  SvgSymbol,
  svgSymbol,
  DataLayer,
  dataLayer
};
