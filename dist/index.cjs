var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AutocompleteSearchBox: () => AutocompleteSearchBox,
  AutocompleteSearchBoxEvents: () => AutocompleteSearchBoxEvents,
  Base: () => Base_default,
  ControlPosition: () => ControlPosition,
  DEFAULT_SIMPLIFY_TOLERANCE: () => DEFAULT_SIMPLIFY_TOLERANCE,
  DEFAULT_SIMPLIFY_ZOOM: () => DEFAULT_SIMPLIFY_ZOOM,
  DataFeature: () => DataFeature,
  DataLayer: () => DataLayer,
  DataLayerEvents: () => DataLayerEvents,
  Evented: () => Evented,
  FullscreenControl: () => FullscreenControl,
  Geocode: () => Geocode,
  GeocodeResult: () => Result_default,
  GeocodeResults: () => Results_default,
  GeocoderErrorStatus: () => GeocoderErrorStatus,
  GeocoderLocationType: () => GeocoderLocationType,
  GeometryType: () => GeometryType,
  Icon: () => Icon,
  ImageOverlay: () => ImageOverlay,
  ImageOverlayEvents: () => ImageOverlayEvents,
  InfoWindow: () => InfoWindow,
  InfoWindowEvents: () => InfoWindowEvents,
  LatLng: () => LatLng,
  LatLngBounds: () => LatLngBounds,
  Layer: () => Layer_default,
  LayerEvents: () => LayerEvents,
  Loader: () => Loader,
  LoaderEvents: () => LoaderEvents,
  Map: () => Map,
  MapEvents: () => MapEvents,
  MapRestriction: () => MapRestriction,
  MapStyle: () => MapStyle,
  MapTypeControl: () => MapTypeControl,
  MapTypeControlStyle: () => MapTypeControlStyle,
  MapTypeId: () => MapTypeId,
  Marker: () => Marker,
  MarkerCluster: () => MarkerCluster,
  MarkerCollection: () => MarkerCollection,
  MarkerEvents: () => MarkerEvents,
  Overlay: () => Overlay,
  OverlayEvents: () => OverlayEvents,
  PlacesSearchBox: () => PlacesSearchBox,
  PlacesSearchBoxEvents: () => PlacesSearchBoxEvents,
  Point: () => Point,
  Polyline: () => Polyline,
  PolylineCollection: () => PolylineCollection,
  PolylineEvents: () => PolylineEvents,
  PolylineIcon: () => PolylineIcon,
  Popup: () => Popup,
  PopupEvents: () => PopupEvents,
  READY_EVENT: () => READY_EVENT,
  RenderingType: () => RenderingType,
  RotateControl: () => RotateControl,
  ScaleControl: () => ScaleControl,
  Size: () => Size,
  StreetViewControl: () => StreetViewControl,
  StreetViewSource: () => StreetViewSource,
  SvgSymbol: () => SvgSymbol,
  SymbolPath: () => SymbolPath,
  Tooltip: () => Tooltip,
  ZoomControl: () => ZoomControl,
  autocompleteSearchBox: () => autocompleteSearchBox,
  calculateDimensions: () => calculateDimensions,
  callCallback: () => callCallback,
  checkForGoogleMaps: () => checkForGoogleMaps,
  closeAllPopups: () => closeAllPopups,
  convertControlPosition: () => convertControlPosition,
  convertMapTypeControlStyle: () => convertMapTypeControlStyle,
  convertSymbolPath: () => convertSymbolPath,
  dataLayer: () => dataLayer,
  fullscreenControl: () => fullscreenControl,
  geocode: () => geocode,
  getBoolean: () => getBoolean,
  getNumber: () => getNumber,
  getPixelsFromLatLng: () => getPixelsFromLatLng,
  getSizeWithUnit: () => getSizeWithUnit,
  icon: () => icon,
  imageOverlay: () => imageOverlay,
  infoWindow: () => infoWindow,
  isBoolean: () => isBoolean,
  isDefined: () => isDefined,
  isFunction: () => isFunction,
  isNull: () => isNull,
  isNullOrUndefined: () => isNullOrUndefined,
  isNumber: () => isNumber,
  isNumberOrNumberString: () => isNumberOrNumberString,
  isNumberString: () => isNumberString,
  isObject: () => isObject,
  isObjectWithValues: () => isObjectWithValues,
  isPromise: () => isPromise,
  isString: () => isString,
  isStringOrNumber: () => isStringOrNumber,
  isStringWithValue: () => isStringWithValue,
  isUndefined: () => isUndefined,
  latLng: () => latLng,
  latLngBounds: () => latLngBounds,
  loader: () => loader,
  map: () => map,
  mapRestriction: () => mapRestriction,
  mapStyle: () => mapStyle,
  mapTypeControl: () => mapTypeControl,
  marker: () => marker,
  markerCluster: () => markerCluster,
  markerCollection: () => markerCollection,
  objectEquals: () => objectEquals,
  objectHasValue: () => objectHasValue,
  overlay: () => overlay,
  placesSearchBox: () => placesSearchBox,
  point: () => point,
  polyline: () => polyline,
  polylineCollection: () => polylineCollection,
  polylineIcon: () => polylineIcon,
  popup: () => popup,
  renderTemplate: () => renderTemplate,
  rotateControl: () => rotateControl,
  scaleControl: () => scaleControl,
  simplifyPath: () => simplifyPath,
  size: () => size,
  streetViewControl: () => streetViewControl,
  svgSymbol: () => svgSymbol,
  tooltip: () => tooltip,
  zoomControl: () => zoomControl
});
module.exports = __toCommonJS(index_exports);

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
   * https://javascript.info/mixins
   * https://www.digitalocean.com/community/tutorials/js-using-js-mixins
   *
   * @param {any} mixin The mixin to include
   */
  static include(mixin) {
    Object.assign(this.prototype, mixin);
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
var isObject = (thing) => Object.prototype.toString.call(thing) === "[object Object]";
var isObjectWithValues = (thing) => Object.prototype.toString.call(thing) === "[object Object]" && Object.keys(thing).length > 0;
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
      const val = parseFloat(value.replace(`${allowedUnits.join("|")}/g`, ""));
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
   * Whether the latitude/longitude pair values have changed since the last time they were set
   *
   * @type {boolean}
   */
  #valuesChanged = false;
  /**
   * Constructor
   *
   * @param {Latitude|LatLng|google.maps.LatLng} latitude The latitude value or the latitude/longitude pair
   * @param {number|string} [longitude] The longitude value
   */
  constructor(latitude, longitude) {
    super("latlng");
    if (typeof latitude !== "undefined") {
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
    this.#valuesChanged = true;
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
    this.#valuesChanged = true;
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
    if (!isObject(this.#latLngObject) || this.#valuesChanged) {
      this.#latLngObject = new google.maps.LatLng(this.latitude, this.longitude);
      this.#valuesChanged = false;
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
    if (typeof x !== "undefined") {
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
    if (isObject(this.#pointObject)) {
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
    if (isObject(this.#pointObject)) {
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
    if (!isObject(this.#pointObject)) {
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
  /**
   * Holds the events that have been called
   */
  #eventsCalled = {};
  /**
   * Holds the event listeners
   *
   * @private
   * @type {EventListeners}
   */
  #eventListeners = {};
  /**
   * Holds the event listeners that are set to only be called once
   *
   * @private
   * @type {string[]}
   */
  #onlyEventListeners = [];
  /**
   * Holds the Google maps object that events are set up on
   *
   * @private
   * @type {google.maps.MVCObject| google.maps.marker.AdvancedMarkerElement}
   */
  // Definitely assigned because it's only used after #isGoogleObjectSet() confirms that it's set.
  #googleObject;
  /**
   * Holds whether the onload event was set on the Loader class to
   * set up the pending event listeners after the Google Maps API library is loaded.
   *
   * @private
   * @type {boolean}
   */
  #isOnLoadEventSet = false;
  /**
   * Holds the event listeners that are waiting to be added once the Google Maps API is loaded
   *
   * @private
   * @type {PendingEvents}
   */
  #pendingLoadEventListeners = {};
  /**
   * Holds the event listeners that are waiting to be added once the Google Maps object is set
   *
   * @private
   * @type {PendingEvents}
   */
  #pendingMapObjectEventListeners = {};
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
    this.#eventsCalled[event] = true;
    if (!this.hasListener(event)) {
      return this;
    }
    const listeners = this.#eventListeners[event];
    if (listeners) {
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
      const listenersToRemove = [];
      listeners.forEach((listener) => {
        listener.callback.call(listener.context || this, eventData);
        if (typeof listener.options !== "undefined" && isObject(listener.options) && typeof listener.options.once === "boolean" && listener.options.once === true) {
          listenersToRemove.push(listener);
        }
      });
      if (listenersToRemove.length > 0) {
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
    if (!this.#eventListeners[type]) {
      return false;
    }
    if (typeof callback === "function") {
      return this.#eventListeners[type].filter((event) => event.callback === callback).length > 0;
    }
    return this.#eventListeners[type] && this.#eventListeners[type].length > 0;
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
      if (this.#eventListeners[type]) {
        if (isFunction(callback)) {
          this.#eventListeners[type] = this.#eventListeners[type].filter((listener) => {
            let keep = true;
            if (isObject(options)) {
              keep = listener.callback !== callback || !objectEquals(options, listener.options);
            } else {
              keep = listener.callback !== callback;
            }
            return keep;
          });
        } else {
          this.#eventListeners[type] = [];
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
    const index = this.#onlyEventListeners.indexOf(type);
    if (index > -1) {
      this.#onlyEventListeners.splice(index, 1);
    }
    if (this.#eventListeners[type].length === 0 && this.#isGoogleObjectSet()) {
      google.maps.event.clearListeners(this.#googleObject, type);
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
    if (this.#eventListeners[type]) {
      const toRemove = new Set(listeners);
      this.#eventListeners[type] = this.#eventListeners[type].filter((listener) => !toRemove.has(listener));
      this.#afterListenersRemoved(type);
    }
  }
  /**
   * Removes all event listeners
   */
  offAll() {
    this.#eventListeners = {};
    this.#onlyEventListeners = [];
    if (this.#isGoogleObjectSet()) {
      google.maps.event.clearInstanceListeners(this.#googleObject);
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
      if (!Array.isArray(this.#eventListeners[type]) || this.#eventListeners[type].length === 0) {
        let setupPending = false;
        if (checkForGoogleMaps(this.#testObject, this.#testLibrary, false)) {
          if (this.#isGoogleObjectSet()) {
            if (!google.maps.event.hasListeners(this.#googleObject, type)) {
              this.#googleObject.addListener(type, (e) => {
                this.dispatch(type, e);
              });
            } else if (["bounds_changed", "zoom_changed"].includes(type)) {
              this.#googleObject.addListener(type, (e) => {
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
          if (!this.#pendingMapObjectEventListeners[type]) {
            this.#pendingMapObjectEventListeners[type] = [];
          }
          this.#pendingMapObjectEventListeners[type].push({ callback, config });
        }
      }
      let addListener = true;
      const listenerOptions = {};
      let context;
      if (this.#onlyEventListeners.includes(type)) {
        addListener = false;
      }
      if (addListener && isObjectWithValues(config)) {
        if (typeof config.once === "boolean" && config.once === true) {
          listenerOptions.once = true;
        }
        if (typeof config.only === "boolean" && config.only === true) {
          this.#onlyEventListeners.push(type);
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
          if (typeof this.#eventsCalled[type] !== "undefined") {
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
        if (!this.#eventListeners[type]) {
          this.#eventListeners[type] = [];
        }
        this.#eventListeners[type].push({ callback, context, options: listenerOptions });
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
    if (isObject(this.#pendingMapObjectEventListeners)) {
      Object.keys(this.#pendingMapObjectEventListeners).forEach((type) => {
        this.#pendingMapObjectEventListeners[type].forEach(() => {
          this.#googleObject.addListener(type, (e) => {
            this.dispatch(type, e);
          });
        });
      });
      this.#pendingMapObjectEventListeners = {};
    }
  }
  /**
   * Returns if the Google object is set and ready to work with events
   *
   * @returns {boolean}
   */
  #isGoogleObjectSet() {
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
var import_js_api_loader = require("@googlemaps/js-api-loader");
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
              this.#loader = new import_js_api_loader.Loader({
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
      if (this.#isLoaded) {
        this.dispatch(LoaderEvents.LOAD);
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
    if (this.#bounds) {
      return latLngConvert(this.#bounds.getCenter());
    }
    const { northEast, southWest } = this.#getCorners();
    const lat = (northEast.latitude + southWest.latitude) / 2;
    let lng = (northEast.longitude + southWest.longitude) / 2;
    if (northEast.longitude < southWest.longitude) {
      lng = (lng + 180) % 360 - 180;
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
            sw.latitude <= otherNe.latitude && ne.latitude >= otherSw.latitude && sw.longitude <= otherNe.longitude && ne.longitude >= otherSw.longitude
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
    let prec = precision || 3;
    if (!isNumber(prec)) {
      prec = 3;
    }
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

// src/lib/Geocode/AddressTypes.ts
var GeocodeAddressTypes = class {
  /**
   * Holds the types for the address
   *
   * @private
   * @type {string[]}
   */
  #types = [];
  /**
   * Constructor
   *
   * @param {string[]} [types] The types for the address
   */
  constructor(types) {
    if (Array.isArray(types)) {
      this.#types = types;
    }
  }
  /**
   * Gets the address types
   *
   * @returns {string[]}
   */
  getTypes() {
    return this.#types;
  }
  /**
   * Returns if the address is an administrative area level 1.
   *
   * This is the highest level of administrative area below the country level.
   * In the United States, these administrative levels are states.
   *
   * @returns {boolean}
   */
  isAdministrativeAreaLevel1() {
    return this.#types.includes("administrative_area_level_1");
  }
  /**
   * Returns if the address is an administrative area level 2.
   *
   * Within the United States this would be a county.
   *
   * @returns {boolean}
   */
  isAdministrativeAreaLevel2() {
    return this.#types.includes("administrative_area_level_2");
  }
  /**
   * Returns if the address is an administrative area level 3.
   *
   * This is a minor civil division.
   *
   * @returns {boolean}
   */
  isAdministrativeAreaLevel3() {
    return this.#types.includes("administrative_area_level_3");
  }
  /**
   * Returns if the address is an administrative area level 4.
   *
   * This is a minor civil division.
   *
   * @returns {boolean}
   */
  isAdministrativeAreaLevel4() {
    return this.#types.includes("administrative_area_level_4");
  }
  /**
   * Returns if the address is an administrative area level 5.
   *
   * This is a minor civil division.
   *
   * @returns {boolean}
   */
  isAdministrativeAreaLevel5() {
    return this.#types.includes("administrative_area_level_5");
  }
  /**
   * Returns if the address is an administrative area level 6.
   *
   * This is a minor civil division.
   *
   * @returns {boolean}
   */
  isAdministrativeAreaLevel6() {
    return this.#types.includes("administrative_area_level_6");
  }
  /**
   * Returns if the address is an administrative area level 7.
   *
   * This is a minor civil division.
   *
   * @returns {boolean}
   */
  isAdministrativeAreaLevel7() {
    return this.#types.includes("administrative_area_level_7");
  }
  /**
   * Returns if the address is an airport.
   *
   * @returns {boolean}
   */
  isAirport() {
    return this.#types.includes("airport");
  }
  /**
   * Returns if the address is a bus station or bus stop.
   *
   * @returns {boolean}
   */
  isBusStation() {
    return this.#types.includes("bus_station");
  }
  /**
   * Returns if the address is a city.
   *
   * This is an alias for isLocality()
   *
   * @returns {boolean}
   */
  isCity() {
    return this.isLocality();
  }
  /**
   * Returns if the address is a commonly used alternative name for the entity.
   *
   * @returns {boolean}
   */
  isColloquialArea() {
    return this.#types.includes("colloquial_area");
  }
  /**
   * Returns if the address is a country.
   *
   * @returns {boolean}
   */
  isCountry() {
    return this.#types.includes("country");
  }
  /**
   * Returns if the address is a county.
   *
   * This is an alias for isAdministrativeAreaLevel2()
   *
   * @returns {boolean}
   */
  isCounty() {
    return this.#types.includes("administrative_area_level_2");
  }
  /**
   * Returns if the address is a place that hasn't yet been categorized.
   *
   * @returns {boolean}
   */
  isEstablishment() {
    return this.#types.includes("establishment");
  }
  /**
   * Returns if the address is a floor in a building.
   *
   * @returns {boolean}
   */
  isFloor() {
    return this.#types.includes("floor");
  }
  /**
   * Returns if the address is a major intersection, usually of two major roads.
   *
   * @returns {boolean}
   */
  isIntersection() {
    return this.#types.includes("intersection");
  }
  /**
   * Returns if the address is a landmark.
   *
   * @returns {boolean}
   */
  isLandmark() {
    return this.#types.includes("landmark");
  }
  /**
   * Returns if the address is a locality.
   *
   * @returns {boolean}
   */
  isLocality() {
    return this.#types.includes("locality");
  }
  /**
   * Returns if the address is a prominent natural feature.
   *
   * @returns {boolean}
   */
  isNaturalFeature() {
    return this.#types.includes("natural_feature");
  }
  /**
   * Returns if the address is a neighborhood.
   *
   * @returns {boolean}
   */
  isNeighborhood() {
    return this.#types.includes("neighborhood");
  }
  /**
   * Returns if the address is a plus code.
   *
   * See https://plus.codes/ for more information.
   *
   * @returns {boolean}
   */
  isPlusCode() {
    return this.#types.includes("plus_code");
  }
  /**
   * Returns if the address is a named park.
   *
   * @returns {boolean}
   */
  isPark() {
    return this.#types.includes("park");
  }
  /**
   * Returns if the address is a parking lot.
   *
   * @returns {boolean}
   */
  isParking() {
    return this.#types.includes("parking");
  }
  /**
   * Returns if the address is a point of interest.
   *
   * @returns {boolean}
   */
  isPointOfInterest() {
    return this.#types.includes("point_of_interest");
  }
  /**
   * Returns if the address is a political entity. This would usually be some type of civil administration.
   *
   * @returns {boolean}
   */
  isPolitical() {
    return this.#types.includes("political");
  }
  /**
   * Returns if the address is a specific post box.
   *
   * @returns {boolean}
   */
  isPostBox() {
    return this.#types.includes("post_box");
  }
  /**
   * Returns if the address is a postal code.
   *
   * @returns {boolean}
   */
  isPostalCode() {
    return this.#types.includes("postal_code");
  }
  /**
   * Returns if the address is a grouping of geographic areas.
   *
   * @returns {boolean}
   */
  isPostalTown() {
    return this.#types.includes("postal_town");
  }
  /**
   * Returns if the location is a named location, usually a building or collection of buildings with a common name.
   *
   * @returns {boolean}
   */
  isPremise() {
    return this.#types.includes("premise");
  }
  /**
   * Returns if the address is a room of a building.
   *
   * @returns {boolean}
   */
  isRoom() {
    return this.#types.includes("room");
  }
  /**
   * Returns if the address is a named route (such as "US 101").
   *
   * @returns {boolean}
   */
  isRoute() {
    return this.#types.includes("route");
  }
  /**
   * Returns if the address is a state or province.
   *
   * This is an alias for isAdministrativeAreaLevel1()
   *
   * @returns {boolean}
   */
  isState() {
    return this.isAdministrativeAreaLevel1();
  }
  /**
   * Returns if the address is a street address
   *
   * @returns {boolean}
   */
  isStreetAddress() {
    return this.#types.includes("street_address");
  }
  /**
   * Returns if the address indicates a precise street number.
   *
   * @returns {boolean}
   */
  isStreetNumber() {
    return this.#types.includes("street_number");
  }
  /**
   * Returns if the address is a sublocality.
   *
   * @returns {boolean}
   */
  isSubLocality() {
    return this.#types.includes("sublocality");
  }
  /**
   * Returns if the address is a sublocality level 1.
   *
   * @returns {boolean}
   */
  isSubLocalityLevel1() {
    return this.#types.includes("sublocality_level_1");
  }
  /**
   * Returns if the address is a sublocality level 2.
   *
   * @returns {boolean}
   */
  isSubLocalityLevel2() {
    return this.#types.includes("sublocality_level_2");
  }
  /**
   * Returns if the address is a sublocality level 3.
   *
   * @returns {boolean}
   */
  isSubLocalityLevel3() {
    return this.#types.includes("sublocality_level_3");
  }
  /**
   * Returns if the address is a sublocality level 4.
   *
   * @returns {boolean}
   */
  isSubLocalityLevel4() {
    return this.#types.includes("sublocality_level_4");
  }
  /**
   * Returns if the address is a sublocality level 5.
   *
   * @returns {boolean}
   */
  isSubLocalityLevel5() {
    return this.#types.includes("sublocality_level_5");
  }
  /**
   * Returns if the location is a subpremise.
   *
   * This is the next level below a premise, usually a single building in a collection of buildings with a common name.
   *
   * @returns {boolean}
   */
  isSubPremise() {
    return this.#types.includes("subpremise");
  }
  /**
   * Returns if the address is a town.
   *
   * This is an alias for isLocality()
   *
   * @returns {boolean}
   */
  isTown() {
    return this.isLocality();
  }
  /**
   * Returns if the address is a train station.
   *
   * @returns {boolean}
   */
  isTrainStation() {
    return this.#types.includes("train_station");
  }
  /**
   * Returns if the address is a transit station.
   *
   * @returns {boolean}
   */
  isTransitStation() {
    return this.#types.includes("transit_station");
  }
};
var AddressTypes_default = GeocodeAddressTypes;

// src/lib/Geocode/AddressComponent.ts
var GeocodeAddressComponent = class extends Base_default {
  /**
   * Holds the original GeocoderAddressComponent object
   *
   * @private
   * @type {google.maps.GeocoderAddressComponent}
   */
  #component;
  /**
   * Holds the types for the address component
   *
   * @private
   * @type {GeocodeAddressTypes}
   */
  #types;
  /**
   * Constructor
   *
   * @param {google.maps.GeocoderAddressComponent} component The Google Maps GeocoderAddressComponent object
   */
  constructor(component) {
    super("addressComponent");
    this.#component = component;
    if (isObjectWithValues(component) && Array.isArray(component.types)) {
      this.#types = new AddressTypes_default(component.types);
    } else {
      this.#types = new AddressTypes_default();
    }
  }
  /**
   * Gets the full name of the address component
   *
   * @returns {string}
   */
  getLongName() {
    return this.#component.long_name;
  }
  /**
   * Gets the abbreviated name of the address component
   *
   * @returns {string}
   */
  getShortName() {
    return this.#component.short_name;
  }
  /**
   * Gets the array of types objects for the address component
   *
   * @returns {GeocodeAddressTypes}
   */
  getTypes() {
    return this.#types;
  }
  /**
   * Gets the array of types for the address component
   *
   * https://developers.google.com/maps/documentation/javascript/geocoding?hl=en#GeocodingAddressTypes
   *
   * @returns {string[]}
   */
  getTypesArray() {
    return this.#types.getTypes();
  }
  /**
   * Get the original Google Maps GeocoderAddressComponent object
   *
   * @returns {google.maps.GeocoderAddressComponent}
   */
  toGoogle() {
    return this.#component;
  }
};
var AddressComponent_default = GeocodeAddressComponent;

// src/lib/Geocode/Result.ts
var GeocodeResult = class extends Base_default {
  /**
   * Holds the address components
   *
   * @private
   * @type {GeocodeAddressComponent[]}
   */
  #addressComponents = [];
  /**
   * Holds the formatted address
   *
   * @private
   * @type {string}
   */
  #formattedAddress = "";
  /**
   * Holds the bounds of the location
   *
   * @private
   * @type {LatLngBounds | undefined}
   */
  #geometryLocationBounds;
  /**
   * Holds the latitude and longitude of the location
   *
   * @private
   * @type {LatLng | undefined}
   */
  #geometryLocation;
  /**
   * Holds the type of location
   *
   * @private
   * @type {string}
   */
  #geometryLocationType = "";
  /**
   * Holds the bounds of the recommended viewport for displaying the returned result
   *
   * @private
   * @type {LatLngBounds | undefined}
   */
  #geometryLocationViewport;
  /**
   * Holds whether the geocode result is a partial match
   *
   * @private
   * @type {boolean}
   */
  #partialMatch = false;
  /**
   * Holds the place id associated with the location
   *
   * @private
   * @type {string}
   */
  #placeId = "";
  /**
   * Holds the plus code associated with the location
   *
   * https://developers.google.com/maps/documentation/javascript/reference/3.56/places-service?hl=en#PlacePlusCode
   *
   * @private
   * @type {string}
   */
  #plusCode = "";
  /**
   * Holds the compund plus code associated with the location
   *
   * https://developers.google.com/maps/documentation/javascript/reference/3.56/places-service?hl=en#PlacePlusCode
   *
   * @private
   * @type {string}
   */
  #plusCodeCompound = "";
  /**
   * Holds the postcode localities for the location. This is only populated when the result is a postal code
   * that contains multiple localities.
   *
   * @private
   * @type {string[]}
   */
  #postalCodeLocalities = [];
  /**
   * Holds the original GeocoderResult object
   *
   * @private
   * @type {google.maps.GeocoderResult | object}
   */
  #result;
  /**
   * Holds the types for the returned geocoded element
   *
   * https://developers.google.com/maps/documentation/javascript/geocoding?hl=en#GeocodingAddressTypes
   *
   * @private
   * @type {GeocodeAddressTypes}
   */
  #types;
  /**
   * Constructor
   *
   * @param {google.maps.GeocoderResult} [result] The Google Maps GeocoderResult object
   */
  constructor(result) {
    super("geocodeResult");
    if (isObjectWithValues(result)) {
      this.#result = result;
      if (Array.isArray(result.address_components)) {
        result.address_components.forEach((component) => {
          this.#addressComponents.push(new AddressComponent_default(component));
        });
      }
      if (isStringWithValue(result.formatted_address)) {
        this.#formattedAddress = result.formatted_address;
      }
      if (isObjectWithValues(result.geometry)) {
        if (result.geometry.bounds) {
          this.#geometryLocationBounds = latLngBounds();
          this.#geometryLocationBounds.union(result.geometry.bounds);
        }
        if (result.geometry.location) {
          this.#geometryLocation = latLng(result.geometry.location);
        }
        if (isStringWithValue(result.geometry.location_type)) {
          this.#geometryLocationType = result.geometry.location_type;
        }
        if (result.geometry.viewport) {
          this.#geometryLocationViewport = latLngBounds();
          this.#geometryLocationViewport.union(result.geometry.viewport);
        }
      }
      if (isBoolean(result.partial_match)) {
        this.#partialMatch = result.partial_match;
      }
      if (isStringWithValue(result.place_id)) {
        this.#placeId = result.place_id;
      }
      if (isObjectWithValues(result.plus_code)) {
        if (isStringWithValue(result.plus_code.global_code)) {
          this.#plusCode = result.plus_code.global_code;
        }
        if (isStringWithValue(result.plus_code.compound_code)) {
          this.#plusCodeCompound = result.plus_code.compound_code;
        }
      }
      if (Array.isArray(result.postcode_localities)) {
        this.#postalCodeLocalities = result.postcode_localities;
      }
      if (Array.isArray(result.types)) {
        this.#types = new AddressTypes_default(result.types);
      } else {
        this.#types = new AddressTypes_default();
      }
    } else {
      this.#result = {};
      this.#types = new AddressTypes_default();
    }
  }
  /**
   * Get the address component objects
   *
   * @returns {GeocodeAddressComponent[]}
   */
  getAddressComponents() {
    return this.#addressComponents;
  }
  /**
   * Get the precise bounds of the result, if available
   *
   * @returns {LatLngBounds|undefined}
   */
  getBounds() {
    return this.#geometryLocationBounds;
  }
  /**
   * Get the compound plus code associated with the location
   *
   * @returns {string}
   */
  getCompoundPlusCode() {
    return this.#plusCodeCompound;
  }
  /**
   * Gets the formatted address for the location.
   *
   * @returns {string}
   */
  getFormattedAddress() {
    return this.#formattedAddress;
  }
  /**
   * Get the latitude of the location.
   *
   * This is a shorcut to getting the geometry location latitude.
   *
   * @returns {number|undefined}
   */
  getLatitude() {
    let returnValue;
    if (typeof this.#geometryLocation !== "undefined" && this.#geometryLocation.isValid()) {
      returnValue = this.#geometryLocation.lat;
    }
    return returnValue;
  }
  /**
   * Gets the LatLng object for the result
   *
   * @returns {LatLng|undefined}
   */
  getLocation() {
    return this.#geometryLocation;
  }
  /**
   * Gets the location type
   *
   * @returns {string}
   */
  getLocationType() {
    return this.#geometryLocationType;
  }
  /**
   * Get the longitude of the location.
   *
   * This is a shorcut to getting the geometry location longitude.
   *
   * @returns {number|undefined}
   */
  getLongitude() {
    let returnValue;
    if (typeof this.#geometryLocation !== "undefined" && this.#geometryLocation.isValid()) {
      returnValue = this.#geometryLocation.lng;
    }
    return returnValue;
  }
  /**
   * Get the place id for the location.
   *
   * @returns {string}
   */
  getPlaceId() {
    return this.#placeId;
  }
  /**
   * Get the plus code associated with the location
   *
   * @returns {string}
   */
  getPlusCode() {
    return this.#plusCode;
  }
  /**
   * Gets the postal code localities for the location.
   *
   * This is only populated when the result is a postal code that contains multiple localities.
   *
   * @returns {string[]}
   */
  getPostalCodeLocalities() {
    return this.#postalCodeLocalities;
  }
  /**
   * Gets the types object for the returned geocoded element.
   *
   * https://developers.google.com/maps/documentation/javascript/geocoding?hl=en#GeocodingAddressTypes
   *
   * @returns {GeocodeAddressTypes}
   */
  getTypes() {
    return this.#types;
  }
  /**
   * Gets the types for the returned geocoded element.
   *
   * https://developers.google.com/maps/documentation/javascript/geocoding?hl=en#GeocodingAddressTypes
   *
   * @returns {string[]}
   */
  getTypesArray() {
    return this.#types.getTypes();
  }
  /**
   * Returns if the location is an approximate location.
   *
   * @returns {boolean}
   */
  isLocationApproximate() {
    return this.#geometryLocationType === GeocoderLocationType.APPROXIMATE;
  }
  /**
   * Returns if the location is a geometic center of a result.
   *
   * @returns {boolean}
   */
  isLocationGeometricCenter() {
    return this.#geometryLocationType === GeocoderLocationType.GEOMETRIC_CENTER;
  }
  /**
   * Returns if the location is an approximation interpolated between two precise locations.
   *
   * @returns {boolean}
   */
  isLocationRangeInterpolated() {
    return this.#geometryLocationType === GeocoderLocationType.RANGE_INTERPOLATED;
  }
  /**
   * Returns if the location is a rooftop location, which is the most precise location available.
   *
   * @returns {boolean}
   */
  isLocationRooftop() {
    return this.#geometryLocationType === GeocoderLocationType.ROOFTOP;
  }
  /**
   * Returns if the location is a partial match for the original request.
   *
   * @returns {boolean}
   */
  isPartialMatch() {
    return this.#partialMatch;
  }
  /**
   * Get the original Google Maps GeocoderResult object
   *
   * If the result is empty, an empty object is returned.
   *
   * @returns {google.maps.GeocoderResult | object}
   */
  toGoogle() {
    return this.#result;
  }
};
var Result_default = GeocodeResult;

// src/lib/Geocode/Results.ts
var GeocodeResults = class extends Base_default {
  /**
   * Holds the original GeocoderResult objects
   *
   * @private
   * @type {GeocodeResult[]}
   */
  #results = [];
  /**
   * Constructor
   *
   * @param {google.maps.GeocoderResult[]} [results] The Google Maps GeocoderResult objects
   */
  constructor(results) {
    super("geocodeResults");
    if (Array.isArray(results)) {
      results.forEach((result) => {
        this.#results.push(new Result_default(result));
      });
    }
  }
  /**
   * Gets the first result
   *
   * @returns {GeocodeResult}
   */
  getFirst() {
    let returnValue;
    if (this.#results.length > 0) {
      [returnValue] = this.#results;
    } else {
      returnValue = new Result_default();
    }
    return returnValue;
  }
  /**
   * Returns the results
   *
   * @returns {GeocodeResult[]}
   */
  getResults() {
    return this.#results;
  }
  /**
   * Returns whether any results were found
   *
   * @returns {boolean}
   */
  hasResults() {
    return this.#results.length > 0;
  }
};
var Results_default = GeocodeResults;

// src/lib/Geocode.ts
var Geocode = class extends Base_default {
  /**
   * The address to geocode
   *
   * @type {string}
   * @private
   */
  #address;
  /**
   * The bounds within which to bias geocode results more prominently
   *
   * @type {LatLngBounds}
   * @private
   */
  #bounds;
  /**
   * Holds the component restrictions
   *
   * @type {GeocodeComponentRestrictions}
   * @private
   */
  #componentRestrictions;
  /**
   * The language to use for the geocode
   *
   * See https://developers.google.com/maps/faq#languagesupport for the list of supported languages
   *
   * @type {string}
   * @private
   */
  #language;
  /**
   * The location to geocode
   *
   * @type {LatLng}
   * @private
   */
  #location;
  /**
   * Holds the id of the place to geocode
   *
   * @type {string}
   * @private
   */
  #placeId;
  /**
   * The region code to influence the geocoding
   *
   * @type {string}
   * @private
   */
  #region;
  /**
   * Constructor
   *
   * @param {GeocodeOptions} [options] The Geocode options
   */
  constructor(options) {
    super("geocode");
    if (isObject(options)) {
      this.setOptions(options);
    }
  }
  /**
   * Returns the address
   *
   * @returns {string|undefined}
   */
  get address() {
    return this.#address;
  }
  /**
   * Sets the address to geocode
   *
   * @param {string} address The address to geocode
   */
  set address(address) {
    if (isString(address)) {
      this.#address = address;
    }
  }
  /**
   * Returns the bounds
   *
   * @returns {LatLngBounds|undefined}
   */
  get bounds() {
    return this.#bounds;
  }
  /**
   * Sets the bounds within which to bias geocode results more prominently
   *
   * @param {LatLngBoundsValue} bounds The bounds within which to bias geocode results more prominently
   */
  set bounds(bounds) {
    this.#bounds = latLngBounds(bounds);
  }
  /**
   * Get the component restrictions
   *
   * @returns {GeocodeComponentRestrictions|undefined}
   */
  get componentRestrictions() {
    return this.#componentRestrictions;
  }
  /**
   * Set the component restrictions
   *
   * @param {GeocodeComponentRestrictions} componentRestrictions The component restrictions
   */
  set componentRestrictions(componentRestrictions) {
    if (isObjectWithValues(componentRestrictions)) {
      const restrictions = {};
      const keys = [
        "administrativeArea",
        "country",
        "locality",
        "postalCode",
        "route"
      ];
      keys.forEach((key) => {
        if (isStringWithValue(componentRestrictions[key])) {
          restrictions[key] = componentRestrictions[key];
        }
      });
      this.#componentRestrictions = restrictions;
    }
  }
  /**
   * Get the language to use for the geocode
   *
   * @returns {string|undefined}
   */
  get language() {
    return this.#language;
  }
  /**
   * Set the language to use for the geocode
   *
   * See https://developers.google.com/maps/faq#languagesupport for the list of supported languages
   *
   * @param {string} language The language to use for the geocode
   */
  set language(language) {
    if (isStringWithValue(language)) {
      this.#language = language;
    }
  }
  /**
   * Get the location to geocode
   *
   * @returns {LatLng|undefined}
   */
  get location() {
    return this.#location;
  }
  /**
   * Set the location to geocode
   *
   * @param {LatLngValue} location The location to geocode
   */
  set location(location) {
    const value = latLng(location);
    if (value.isValid()) {
      this.#location = value;
    }
  }
  /**
   * Get the place id
   *
   * @returns {string|undefined}
   */
  get placeId() {
    return this.#placeId;
  }
  /**
   * Set the place id
   *
   * @param {string} placeId The place id
   */
  set placeId(placeId) {
    if (isStringWithValue(placeId)) {
      this.#placeId = placeId;
    }
  }
  /**
   * Get the region code
   *
   * @returns {string|undefined}
   */
  get region() {
    return this.#region;
  }
  /**
   * Set the region code
   *
   * @param {string} region The region code
   */
  set region(region) {
    if (isStringWithValue(region)) {
      this.#region = region;
    }
  }
  /**
   * Call the Google Maps Geocoder service
   *
   * Alias for the geocode method
   *
   * @param {GeocodeOptions} [options] The Geocode options
   * @returns {Promise<GeocodeResults>}
   */
  fetch(options) {
    return this.geocode(options);
  }
  /**
   * Call the Google Maps Geocoder service
   *
   * @param {GeocodeOptions} [options] The Geocode options
   * @returns {Promise<GeocodeResults>}
   */
  geocode(options) {
    return new Promise((resolve, reject) => {
      if (isObject(options)) {
        this.setOptions(options);
      }
      if (checkForGoogleMaps("Geocoder", "Geocoder", false)) {
        this.#runGeocode().then((results) => {
          resolve(results);
        }).catch((status) => {
          if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
            resolve(new Results_default());
          } else {
            reject(status);
          }
        });
      } else {
        loader().onMapLoad(() => {
          this.#runGeocode().then((results) => {
            resolve(results);
          }).catch((status) => {
            if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
              resolve(new Results_default());
            } else {
              reject(status);
            }
          });
        });
      }
    });
  }
  /**
   * Runs the geocode request
   *
   * @returns {Promise<GeocodeResults>}
   */
  #runGeocode = async () => {
    const options = {};
    if (this.#address) {
      options.address = this.#address;
    } else if (this.#location) {
      options.location = this.#location.toGoogle();
    } else if (this.#placeId) {
      options.placeId = this.#placeId;
    }
    if (this.#bounds) {
      options.bounds = await this.#bounds.toGoogle();
    }
    if (this.#componentRestrictions) {
      options.componentRestrictions = this.#componentRestrictions;
    }
    if (this.#language) {
      options.language = this.#language;
    }
    if (this.#region) {
      options.region = this.#region;
    }
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(options, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const resultsObj = new Results_default(results ?? void 0);
          resolve(resultsObj);
        } else {
          reject(status);
        }
      });
    });
  };
  /**
   * Set the address to geocode
   *
   * @param {string} address The address to geocode
   * @returns {Geocode}
   */
  setAddress(address) {
    this.address = address;
    return this;
  }
  /**
   * Set the bounds within which to bias geocode results more prominently
   *
   * @param {LatLngBoundsValue} bounds The bounds within which to bias geocode results more prominently
   * @returns {Geocode}
   */
  setBounds(bounds) {
    this.bounds = bounds;
    return this;
  }
  /**
   * Set the component restrictions
   *
   * @param {GeocodeComponentRestrictions} componentRestrictions The component restrictions
   * @returns {Geocode}
   */
  setComponentRestrictions(componentRestrictions) {
    this.componentRestrictions = componentRestrictions;
    return this;
  }
  /**
   * Set the language to use for the geocode
   * See https://developers.google.com/maps/faq#languagesupport for the list of supported languages
   *
   * @param {string} language The language to use for the geocode
   * @returns {Geocode}
   */
  setLanguage(language) {
    this.language = language;
    return this;
  }
  /**
   * Set the location to geocode
   *
   * @param {LatLngValue} location The location to geocode
   * @returns {Geocode}
   */
  setLocation(location) {
    this.location = location;
    return this;
  }
  /**
   * Set the place id
   *
   * @param {string} placeId The place id
   * @returns {Geocode}
   */
  setPlaceId(placeId) {
    this.placeId = placeId;
    return this;
  }
  /**
   * Set the region code
   *
   * @param {string} region The region code
   * @returns {Geocode}
   */
  setRegion(region) {
    this.region = region;
    return this;
  }
  /**
   * Sets the options for the popup
   *
   * @param {GeocodeOptions} options Geocode options
   * @returns {Geocode}
   */
  setOptions(options) {
    if (options.address) {
      this.address = options.address;
    }
    if (options.bounds) {
      this.bounds = options.bounds;
    }
    if (options.componentRestrictions) {
      this.componentRestrictions = options.componentRestrictions;
    }
    if (options.language) {
      this.language = options.language;
    }
    if (options.location) {
      this.location = options.location;
    }
    if (options.placeId) {
      this.placeId = options.placeId;
    }
    if (options.region) {
      this.region = options.region;
    }
    return this;
  }
};
var geocode = (options) => {
  if (options instanceof Geocode) {
    return options;
  }
  return new Geocode(options);
};

// src/lib/AutocompleteSearchBox.ts
var AutocompleteSearchBox = class extends Evented {
  /**
   * Holds the bounds to restrict the search to
   *
   * @private
   * @type {LatLngBounds | undefined}
   */
  #bounds;
  /**
   * Holds the region to use for biasing query predictions.
   *
   * https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#ComponentRestrictions
   *
   * @private
   * @type {string|Array<string>|null}
   */
  #countryRestriction = null;
  /**
   * Holds the fields to be included for the Place in the details response when the details are successfully retrieved.
   *
   * @private
   * @type {string[]}
   */
  #fields = ["ALL"];
  /**
   * Holds the reference to the input element
   *
   * @private
   * @type {HTMLInputElement | undefined}
   */
  #input;
  /**
   * Holds the place that has been found.
   *
   * @private
   * @type {google.maps.places.PlaceResult | undefined}
   */
  #place;
  /**
   * Holds the map bounds based on the place that has been found
   *
   * @private
   * @type {LatLngBounds | undefined}
   */
  #placeBounds;
  /**
   * Holds the reference to the Google Maps SearchBox object
   *
   * @private
   * @type {google.maps.places.Autocomplete | undefined}
   */
  #searchBox;
  /**
   * Sets whether the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.
   *
   * @private
   * @type {boolean}
   */
  #strictBounds = false;
  /**
   * Holds the types of predictions to be returned.
   *
   * @private
   * @type {string[] | undefined}
   */
  #types;
  /**
   * Constructor
   *
   * @param {string | HTMLInputElement | AutocompleteSearchBoxOptions} [input] The input reference or the options
   * @param {AutocompleteSearchBoxOptions} [options] The places autocomplete search box options if the input is reference to the input element
   */
  constructor(input, options) {
    super("placesSearchBox", "places");
    if (input instanceof HTMLInputElement) {
      this.#input = input;
      if (options) {
        this.setOptions(options);
      }
    } else if (isString(input)) {
      this.#input = document.querySelector(input) ?? void 0;
      if (!this.#input) {
        throw new Error(`The input element with the selector "${input}" was not found.`);
      }
      if (options) {
        this.setOptions(options);
      }
    } else if (isObjectWithValues(input)) {
      this.setOptions(input);
    }
  }
  /**
   * Get the bounds to which query predictions are biased.
   *
   * @returns {LatLngBounds | undefined}
   */
  get bounds() {
    return this.#bounds ?? void 0;
  }
  /**
   * Sets the region to use for biasing query predictions.
   *
   * Results will only be biased towards this area and not be completely restricted to it.
   *
   * @param {LatLngBoundsValue} value The bounds to set
   */
  set bounds(value) {
    const boundsValue = latLngBounds(value);
    this.#bounds = boundsValue;
    const searchBox = this.#searchBox;
    if (searchBox) {
      boundsValue.toGoogle().then((bounds) => {
        searchBox.setBounds(bounds);
      });
    }
  }
  /**
   * Sets the country or countries to use for biasing query predictions.
   *
   * @param {string | string[] | null} value The country restriction to set
   */
  set countryRestriction(value) {
    if (isString(value) || Array.isArray(value) || value === null) {
      this.#countryRestriction = value;
      if (this.#searchBox) {
        this.#searchBox.setComponentRestrictions({ country: value });
      }
    }
  }
  /**
   * Get the country or countries to use for biasing query predictions.
   *
   * @returns {string | string[] | null}
   */
  get countryRestriction() {
    return this.#countryRestriction;
  }
  /**
   * Set the fields to be included for the Place in the details response when the details are successfully retrieved.
   *
   * @param {string | string[]} value The fields to set
   */
  set fields(value) {
    if (isString(value)) {
      this.#fields = [value];
    } else if (Array.isArray(value)) {
      this.#fields = value;
    }
    if (this.#searchBox) {
      this.#searchBox.setFields(this.#fields);
    }
  }
  /**
   * Get the fields to be included for the Place in the details response when the details are successfully retrieved.
   *
   * @returns {string[]}
   */
  get fields() {
    return this.#fields;
  }
  /**
   * Get the input reference
   *
   * @returns {HTMLInputElement | undefined}
   */
  get input() {
    return this.#input;
  }
  /**
   * Set the input reference
   *
   * @param {string | HTMLInputElement} value The input HTMLInputElement or the selector for the input element
   */
  set input(value) {
    if (value instanceof HTMLInputElement) {
      this.#input = value;
    } else if (isString(value)) {
      this.#input = document.querySelector(value) ?? void 0;
      if (!this.#input) {
        throw new Error(`The input element with the selector "${value}" was not found.`);
      }
    }
  }
  /**
   * Get whether the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.
   *
   * @returns {boolean}
   */
  get strictBounds() {
    return this.#strictBounds;
  }
  /**
   * Set that the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.
   *
   * Setting strictBounds to false (which is the default) will make the results biased towards, but not restricted to, places contained within the bounds.
   *
   * @param {boolean} value The value to set
   */
  set strictBounds(value) {
    if (isBoolean(value)) {
      this.#strictBounds = value;
      if (this.#searchBox) {
        this.#searchBox.setOptions({ strictBounds: value });
      }
    }
  }
  /**
   * Get the types of predictions to be returned.
   *
   * @returns {string[] | undefined}
   */
  get types() {
    return this.#types;
  }
  /**
   * Set the types of predictions to be returned.
   *
   * To clear the types set it to null.
   *
   * @param {string | string[] | null} value The types to set
   */
  set types(value) {
    if (Array.isArray(value)) {
      this.#types = value;
    } else if (isString(value)) {
      this.#types = [value];
    } else {
      this.#types = [];
    }
    if (this.#searchBox) {
      this.#searchBox.setTypes(this.#types);
    }
  }
  /**
   * Get the bounds to which query predictions are biased.
   *
   * @returns {LatLngBounds | undefined}
   */
  getBounds() {
    return this.bounds;
  }
  /**
   * Get the country or countries to use for biasing query predictions.
   *
   * @returns {string | string[] | null}
   */
  getCountryRestriction() {
    return this.#countryRestriction;
  }
  /**
   * Get the fields to be included for the Place in the details response when the details are successfully retrieved.
   *
   * @returns {string[]}
   */
  getFields() {
    return this.fields;
  }
  /**
   * Get the HTML input element reference
   *
   * @returns {HTMLInputElement | undefined}
   */
  getInput() {
    return this.#input;
  }
  /**
   * Gets the place that has been found
   *
   * The results from the place_changed event is one place and it's the place that the user clicked on.
   *
   * @returns {google.maps.places.PlaceResult | undefined}
   */
  getPlace() {
    return this.#place;
  }
  /**
   * Get the map bounds based on the place that has been found.
   *
   * @returns {LatLngBounds|undefined}
   */
  getPlaceBounds() {
    return this.#placeBounds;
  }
  /**
   * Get whether the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.
   *
   * @returns {boolean}
   */
  getStrictBounds() {
    return this.strictBounds;
  }
  /**
   * Get the types of predictions to be returned.
   *
   * @returns {string[] | undefined}
   */
  getTypes() {
    return this.#types;
  }
  /**
   * Initialize the places search box object
   *
   * This must be called in order for the places search box to work.
   *
   * @returns {Promise<void>}
   */
  async init() {
    return new Promise((resolve) => {
      if (!isObject(this.#searchBox)) {
        if (checkForGoogleMaps("AutocompleteSearchBox", "places", false)) {
          this.#createAutocompleteSearchBox().then(() => {
            resolve();
          });
        } else {
          loader().onMapLoad(() => {
            this.#createAutocompleteSearchBox().then(() => {
              resolve();
            });
          });
        }
      } else {
        resolve();
      }
    });
  }
  /**
   * Create the places search box object
   *
   * @private
   */
  #createAutocompleteSearchBox = async () => {
    if (!this.#searchBox) {
      const options = {
        strictBounds: this.#strictBounds
      };
      if (this.#bounds) {
        options.bounds = await this.#bounds.toGoogle();
      }
      if (this.#countryRestriction) {
        options.componentRestrictions = { country: this.#countryRestriction };
      }
      if (this.#fields) {
        options.fields = this.#fields;
      }
      if (this.#types) {
        options.types = this.#types;
      }
      if (!this.#input) {
        throw new Error("The input element must be set before the autocomplete search box can be initialized.");
      }
      const searchBox = new google.maps.places.Autocomplete(this.#input, options);
      this.#searchBox = searchBox;
      searchBox.addListener(AutocompleteSearchBoxEvents.PLACE_CHANGED, () => {
        const place = searchBox.getPlace();
        const bounds = latLngBounds();
        if (place.geometry) {
          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else if (place.geometry.location) {
            bounds.extend(latLng(place.geometry.location));
          }
        }
        this.#place = place;
        this.#placeBounds = bounds;
        this.dispatch(AutocompleteSearchBoxEvents.PLACE_CHANGED, { place, bounds });
      });
    }
  };
  /**
   * Returns whether the places search box object has been initialized
   *
   * @returns {boolean}
   */
  isInitialized() {
    return isObject(this.#searchBox);
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
  onPlaceChanged(callback) {
    this.on(AutocompleteSearchBoxEvents.PLACE_CHANGED, (data) => {
      callback(data.place, data.bounds);
    });
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
   * Sets the region to use for biasing query predictions.
   *
   * Results will only be biased towards this area and not be completely restricted to it.
   *
   * @param {LatLngBoundsValue} value The bounds to set
   * @returns {AutocompleteSearchBox}
   */
  setBounds(value) {
    this.bounds = value;
    return this;
  }
  /**
   * Sets the country or countries to use for biasing query predictions.
   *
   * @param {string|string[]|null} value The country restriction to set
   * @returns {AutocompleteSearchBox}
   */
  setCountryRestriction(value) {
    this.countryRestriction = value;
    return this;
  }
  /**
   * Set the fields to be included for the Place in the details response when the details are successfully retrieved.
   *
   * @param {string|string[]} value The fields to set
   * @returns {AutocompleteSearchBox}
   */
  setFields(value) {
    this.fields = value;
    return this;
  }
  /**
   * Set the input reference
   *
   * @param {string|HTMLInputElement} input The input HTMLInputElement or the selector for the input element
   * @returns {AutocompleteSearchBox}
   */
  setInput(input) {
    this.input = input;
    return this;
  }
  /**
   * Set the places search box options
   *
   * @param {AutocompleteSearchBoxOptions} options The options to set
   * @returns {AutocompleteSearchBox}
   */
  setOptions(options) {
    if (isObjectWithValues(options)) {
      if (options.bounds) {
        this.bounds = options.bounds;
      }
      if (typeof options.input !== "undefined") {
        if (options.input instanceof HTMLInputElement) {
          this.#input = options.input;
        } else if (isString(options.input)) {
          this.#input = document.querySelector(options.input) ?? void 0;
          if (!this.#input) {
            throw new Error(`The input element with the selector "${options.input}" was not found.`);
          }
        }
      }
      if (options.countryRestriction) {
        this.countryRestriction = options.countryRestriction;
      }
      if (options.fields) {
        this.fields = options.fields;
      }
      if (isBoolean(options.strictBounds)) {
        this.strictBounds = options.strictBounds;
      }
      if (options.types) {
        this.types = options.types;
      }
    }
    return this;
  }
  /**
   * Set whether the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.
   *
   * Setting strictBounds to false (which is the default) will make the results biased towards, but not restricted to, places contained within the bounds.
   *
   * @param {boolean} value The value to set
   * @returns {AutocompleteSearchBox}
   */
  setStrictBounds(value) {
    this.strictBounds = value;
    return this;
  }
  /**
   * Set the types of predictions to be returned.
   *
   * To clear the types set it to null.
   *
   * @param {string | string[] | null} value The types to set
   * @returns {AutocompleteSearchBox}
   */
  setTypes(value) {
    this.types = value;
    return this;
  }
};
var autocompleteSearchBox = (input, options) => {
  if (input instanceof AutocompleteSearchBox) {
    return input;
  }
  return new AutocompleteSearchBox(input, options);
};

// src/lib/Layer.ts
var Layer = class extends Evented {
  // eslint-disable-line @typescript-eslint/no-explicit-any
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
  setPopup(popup2) {
    this.#popup = popup2 ?? void 0;
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
    if (typeof width !== "undefined") {
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
    if (isObject(this.#sizeObject)) {
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
    if (isObject(this.#sizeObject)) {
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
      if (!isObject(this.#sizeObject)) {
        this.#sizeObject = new google.maps.Size(this.#width, this.#height);
      }
      return this.#sizeObject;
    }
    return null;
  }
};
var size = (width, height) => new Size(width, height);

// src/lib/Icon.ts
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
      const pointValues = ["anchor", "labelOrigin", "origin"];
      const sizeValues = ["scaledSize", "size"];
      const stringValues = ["url"];
      pointValues.forEach((key) => {
        const value = options[key];
        if (value) {
          this.#options[key] = point(value).toGoogle();
        }
      });
      sizeValues.forEach((key) => {
        const value = options[key];
        if (value) {
          this.#options[key] = size(value).toGoogle();
        }
      });
      stringValues.forEach((key) => {
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

// src/lib/Map.ts
var hideFeatureTypes = {
  hideBusinesses: "poi.business",
  hidePointsOfInterest: "poi",
  hideTransit: "transit"
};
var Map = class extends Evented {
  /**
   * Class constructor
   *
   * @param {string|HTMLElement} selector The selector of the element that the map will be rendered in. Or the HTMLElement that the map will be rendered in.
   *      The selector can be any valid selector for document.querySelector() can be used. Or, it can be an HTML element
   * @param {MapOptions} [options] The options object for the map
   */
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
      this.dispatch(MapEvents.READY);
      loader().dispatch(LoaderEvents.MAP_LOAD);
      this.#isInitialized = true;
      this.#isReady = true;
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
  }
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

// src/lib/SvgSymbol.ts
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
      const numberValues = [
        "fillOpacity",
        "rotation",
        "scale",
        "strokeOpacity",
        "strokeWeight"
      ];
      const pointValues = ["anchor", "labelOrigin"];
      const stringValues = ["fillColor", "path", "strokeColor"];
      numberValues.forEach((key) => {
        if (typeof options[key] !== "undefined" && isNumber(options[key]) || isNumberString(options[key])) {
          if (isNumberString(options[key])) {
            this.#options[key] = Number(options[key]);
          } else {
            this.#options[key] = options[key];
          }
        }
      });
      pointValues.forEach((key) => {
        if (options[key]) {
          this.#options[key] = point(options[key]);
        }
      });
      stringValues.forEach((key) => {
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
   * Convert an array of positions to Google maps LatLng objects
   *
   * @private
   * @param {LatLngValue[]} path The positions to convert
   * @returns {google.maps.LatLng[]}
   */
  static #toPositions(path) {
    if (!Array.isArray(path)) {
      return [];
    }
    return path.map((value) => latLng(value)).filter((value) => value.isValid()).map((value) => value.toGoogle());
  }
  /**
   * Convert the positions for one ring of a polygon to Google maps LatLng objects.
   *
   * GeoJson repeats the first position at the end of a ring to close it. Google's LinearRing
   * closes itself, so the repeated position is dropped to avoid a duplicate corner.
   *
   * @private
   * @param {LatLngValue[]} ring The positions for the ring
   * @returns {google.maps.LatLng[]}
   */
  static #toRingPositions(ring) {
    const positions = Array.isArray(ring) ? ring.map((value) => latLng(value)).filter((value) => value.isValid()) : [];
    if (positions.length > 2 && positions[0].equals(positions[positions.length - 1])) {
      positions.pop();
    }
    return positions.map((value) => value.toGoogle());
  }
  /**
   * Work out whether the paths value is one ring of positions or an array of rings.
   *
   * A single position can itself be an array ([lat, lng]) so the first value is tested to
   * see if it's a valid position. If it is then this is one ring of positions.
   *
   * @private
   * @param {LatLngValue[]|LatLngValue[][]} paths The path, or array of paths, for a polygon
   * @returns {LatLngValue[][]}
   */
  static #toRings(paths) {
    if (!Array.isArray(paths) || paths.length === 0) {
      return [];
    }
    if (latLng(paths[0]).isValid()) {
      return [paths];
    }
    return paths;
  }
};
var dataLayer = (options) => {
  if (options instanceof DataLayer) {
    return options;
  }
  return new DataLayer(options);
};

// src/lib/Marker.ts
var Marker = class extends Layer_default {
  /**
   * Holds any custom data to attach to the marker object
   *
   * @private
   * @type {CustomData}
   */
  #customData = {};
  /**
   * Whether dragging is enabled for this marker
   *
   * @private
   * @type {boolean}
   */
  #drag = false;
  /**
   * Holds if the marker is setting up
   *
   * @private
   * @type {boolean}
   */
  #isSettingUp = false;
  /**
   * Holds if the "ready" event has been dispatched
   *
   * @private
   * @type {boolean}
   */
  #isReady = false;
  /**
   * Holds the Google maps marker object
   *
   * @private
   * @type {google.maps.Marker}
   */
  #marker;
  /**
   * Holds the marker options
   *
   * The position always has a value. It defaults to 0,0 and is only replaced with a valid position.
   *
   * @private
   * @type {GMMarkerOptions & { position: LatLng }}
   */
  #options = { position: latLng([0, 0]) };
  /**
   * Constructor
   *
   * @param {LatLngValue|MarkerOptions} [position] The latitude longitude pair
   * @param {MarkerOptions} [options] The marker options
   */
  constructor(position, options) {
    super("marker", "Marker");
    if (position instanceof LatLng || Array.isArray(position)) {
      this.setPosition(position);
      if (isObject(options)) {
        this.setOptions(options);
      }
    } else if (isObject(position)) {
      this.setOptions(position);
    }
  }
  /**
   * Get the anchor point for the marker
   *
   * @returns {Point | undefined}
   */
  get anchorPoint() {
    return this.#options.anchorPoint;
  }
  /**
   * Set the anchor point for the marker
   *
   * @param {PointValue} value The anchor point for the marker
   */
  set anchorPoint(value) {
    this.setAnchorPoint(value);
  }
  /**
   * Get the cursor type to show on hover
   *
   * @returns {string | undefined}
   */
  get cursor() {
    return this.#options.cursor;
  }
  /**
   * Set the cursor type to show on hover
   *
   * @param {string} value The cursor type to show on hover
   */
  set cursor(value) {
    this.setCursor(value);
  }
  /**
   * Get the custom data attached to the marker object
   *
   * @returns {CustomData}
   */
  get data() {
    return this.#customData;
  }
  /**
   * Set custom data to attach to the marker object
   *
   * @param {CustomData} value The custom data to attach to the marker object
   */
  set data(value) {
    if (isObject(value)) {
      this.#customData = value;
    }
  }
  /**
   * Returns whether dragging is enabled
   *
   * @returns {boolean}
   */
  get drag() {
    return this.#drag;
  }
  /**
   * Set whether the marker can be dragged on the map.
   *
   * @param {boolean} value Whether the marker can be dragged on the map
   */
  set drag(value) {
    if (isBoolean(value)) {
      if (value) {
        this.enableDrag();
      } else {
        this.disableDrag();
      }
    }
  }
  /**
   * Get the icon for the marker
   *
   * @returns {Icon | SvgSymbol | string | undefined}
   */
  get icon() {
    return this.#options.icon;
  }
  /**
   * Set the icon for the marker
   *
   * @param {Icon | SvgSymbol | string} value The icon value for the marker
   */
  set icon(value) {
    this.setIcon(value);
  }
  /**
   * Get the label for the marker
   *
   * @returns {string | number | MarkerLabel | undefined}
   */
  get label() {
    return this.#options.label;
  }
  /**
   * Set the label for the marker
   *
   * @param {string | number | MarkerLabel} value The label value for the marker
   */
  set label(value) {
    this.setLabel(value);
  }
  /**
   * Get the map object
   *
   * @returns {Map | null | undefined}
   */
  get map() {
    return this.#options.map;
  }
  /**
   * Set the map object
   *
   * @param {Map|null} value The map object. Set to null if you want to remove the marker from the map.
   */
  set map(value) {
    this.setMap(value);
  }
  /**
   * Get whether the marker rendering is optimized
   *
   * @returns {boolean | undefined} Undefined if it's not set, in which case Google decides.
   */
  get optimized() {
    return this.#options.optimized;
  }
  /**
   * Set whether the marker rendering is optimized
   *
   * @param {boolean} value Whether the marker rendering is optimized
   */
  set optimized(value) {
    this.setOptimized(value);
  }
  /**
   * Get the marker position
   *
   * @returns {LatLng}
   */
  get position() {
    let returnValue = this.#options.position;
    if (this.#marker) {
      returnValue = latLng(this.#marker.getPosition() ?? void 0);
    }
    if (isNullOrUndefined(returnValue)) {
      returnValue = latLng([0, 0]);
    }
    return returnValue;
  }
  /**
   * Set the latitude and longitude value for the marker
   *
   * @param {LatLngValue} value The latitude/longitude position for the marker
   */
  set position(value) {
    this.setPosition(value);
  }
  /**
   * Get the title for the marker
   *
   * @returns {string | undefined}
   */
  get title() {
    return this.#options.title;
  }
  /**
   * Set the title for the marker
   *
   * @param {string} value The title for the marker
   */
  set title(value) {
    this.setTitle(value);
  }
  /**
   * Disable dragging for this marker
   *
   * @returns {Promise<Marker>}
   */
  async disableDrag() {
    await this.#setupGoogleMarker();
    this.#setDraggable(false);
    return this;
  }
  /**
   * Adds the marker to the map object
   *
   * Alternate of show()
   *
   * @param {Map} map The map object
   * @returns {Marker}
   */
  display(map2) {
    this.setMap(map2);
    return this;
  }
  /**
   * Enable dragging for this marker
   *
   * @returns {Promise<Marker>}
   */
  async enableDrag() {
    await this.#setupGoogleMarker();
    this.#setDraggable(true);
    return this;
  }
  /**
   * Get any custom data attached to the marker object.
   *
   * Optionally pass a data key to get the value for that key.
   *
   * @param {string} [key] The object key to get data for. If not set then all data is returned.
   * @returns {any}
   */
  getData(key) {
    if (isStringWithValue(key)) {
      if (objectHasValue(this.#customData, key)) {
        return this.#customData[key];
      }
      return null;
    }
    return this.#customData;
  }
  /**
   * Get the marker position (i.e. the LatLng object)
   *
   * https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
   *
   * @returns {LatLng}
   */
  getPosition() {
    return this.position;
  }
  /**
   * Hide the marker
   *
   * @returns {Marker}
   */
  hide() {
    this.map = null;
    return this;
  }
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
  init() {
    return new Promise((resolve) => {
      this.#setupGoogleMarker().then(() => {
        resolve();
      });
    });
  }
  /**
   * Returns whether the marker is draggable
   *
   * @returns {boolean}
   */
  isDraggable() {
    return this.drag;
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
   * Add an event listener for when the marker's animation changes.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onAnimationChanged(callback) {
    this.on(MarkerEvents.ANIMATION_CHANGED, callback);
  }
  /**
   * Add an event listener for when the marker icon is clicked.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onClick(callback) {
    this.on(MarkerEvents.CLICK, callback);
  }
  /**
   * Add an event listener for when the marker clickable property changes.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onClickableChanged(callback) {
    this.on(MarkerEvents.CLICKABLE_CHANGED, callback);
  }
  /**
   * Add an event listener for when the DOM context menu is triggered on the marker.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onContextMenu(callback) {
    this.on(MarkerEvents.CONTEXT_MENU, callback);
  }
  /**
   * Add an event listener for when the marker cursor property changes.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onCursorChanged(callback) {
    this.on(MarkerEvents.CURSOR_CHANGED, callback);
  }
  /**
   * Add an event listener for when the marker is double clicked.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onDblClick(callback) {
    this.on(MarkerEvents.DBLCLICK, callback);
  }
  /**
   * Add an event listener for when the user drags the marker.
   *
   * This uses the Google Maps marker drag event
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onDrag(callback) {
    this.on(MarkerEvents.DRAG, callback);
  }
  /**
   * Add an event listener for when the user stops dragging the marker.
   *
   * This uses the Google Maps marker dragend event
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onDragEnd(callback) {
    this.on(MarkerEvents.DRAG_END, callback);
  }
  /**
   * Add an event listener for when the marker draggable property changes.
   *
   * This uses the Google Maps marker draggable_changed event
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onDraggableChanged(callback) {
    this.on(MarkerEvents.DRAGGABLE_CHANGED, callback);
  }
  /**
   * Add an event listener for when the user starts dragging the marker.
   *
   * This uses the Google Maps marker dragstart event
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onDragStart(callback) {
    this.on(MarkerEvents.DRAG_START, callback);
  }
  /**
   * Add an event listener for when the marker flat property changes.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onFlatChanged(callback) {
    this.on(MarkerEvents.FLAT_CHANGED, callback);
  }
  /**
   * Add an event listener for when the marker icon property changes.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onIconChanged(callback) {
    this.on(MarkerEvents.ICON_CHANGED, callback);
  }
  /**
   * Add an event listener for when the user's mouse is pressed down on the marker.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onMouseDown(callback) {
    this.on(MarkerEvents.MOUSE_DOWN, callback);
  }
  /**
   * Add an event listener for when the user's mouse leaves the marker icon.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onMouseOut(callback) {
    this.on(MarkerEvents.MOUSE_OUT, callback);
  }
  /**
   * Add an event listener for when the user's mouse enters the marker icon.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onMouseOver(callback) {
    this.on(MarkerEvents.MOUSE_OVER, callback);
  }
  /**
   * Add an event listener for the mouseup event on the marker.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onMouseUp(callback) {
    this.on(MarkerEvents.MOUSE_UP, callback);
  }
  /**
   * Add an event listener for when the marker's position property changes.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onPositionChanged(callback) {
    this.on(MarkerEvents.POSITION_CHANGED, callback);
  }
  /**
   * Add an event listener for when the marker is loaded and ready for use.
   *
   * @param {EventCallback} [callback] The callback function to call when the event is dispatched.
   */
  onReady(callback) {
    this.on(MarkerEvents.READY, callback);
  }
  /**
   * Add an event listener for when the marker's shape property changes.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onShapeChanged(callback) {
    this.on(MarkerEvents.SHAPE_CHANGED, callback);
  }
  /**
   * Add an event listener for when the marker's title property changes.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onTitleChanged(callback) {
    this.on(MarkerEvents.TITLE_CHANGED, callback);
  }
  /**
   * Add an event listener for when the marker's visible property changes.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onVisibleChanged(callback) {
    this.on(MarkerEvents.VISIBLE_CHANGED, callback);
  }
  /**
   * Add an event listener for when the marker's zindex property changes.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onZIndexChanged(callback) {
    this.on(MarkerEvents.ZINDEX_CHANGED, callback);
  }
  /**
   * Set the anchor point for the marker
   *
   * @param {PointValue} value The anchor point for the marker
   * @returns {Promise<Marker>}
   */
  async setAnchorPoint(value) {
    await this.#setupGoogleMarker();
    this.#setAnchorPoint(value);
    return this;
  }
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
  setAnchorPointSync(value) {
    this.#setupGoogleMarkerSync();
    this.#setAnchorPoint(value);
    return this;
  }
  /**
   * Set the anchor point for the marker
   *
   * @param {PointValue} value The anchor point for the marker
   */
  #setAnchorPoint(value) {
    const anchor = point(value);
    if (anchor.isValid()) {
      this.#options.anchorPoint = anchor;
    } else {
      this.#options.anchorPoint = void 0;
    }
    this.#marker.setOptions({ anchorPoint: this.#options.anchorPoint?.toGoogle() });
  }
  /**
   * Set the cursor type to show on hover
   *
   * @param {string} value The cursor type to show on hover
   * @returns {Promise<Marker>}
   */
  async setCursor(value) {
    await this.#setupGoogleMarker();
    this.#setCursor(value);
    return this;
  }
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
  setCursorSync(value) {
    this.#setupGoogleMarkerSync();
    this.#setCursor(value);
    return this;
  }
  /**
   * Set the cursor for the marker
   *
   * @param {string} value The cursor type to show on hover
   */
  #setCursor(value) {
    if (isStringWithValue(value)) {
      this.#options.cursor = value;
    } else if (isNullOrUndefined(value)) {
      this.#options.cursor = void 0;
    }
    this.#marker.setCursor(this.#options.cursor);
  }
  /**
   * Set whether the marker can be dragged on the map
   *
   * @param {boolean} value Whether the marker can be dragged on the map
   */
  #setDraggable(value) {
    if (isBoolean(value)) {
      this.#drag = value;
      this.#marker.setDraggable(value);
    }
  }
  /**
   * Set the icon value for the marker
   *
   * @param {Icon | SvgSymbol | string} value The icon for the marker
   * @returns {Marker}
   */
  async setIcon(value) {
    await this.#setupGoogleMarker();
    this.#setIcon(value);
    return this;
  }
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
  setIconSync(value) {
    this.#setupGoogleMarkerSync();
    this.#setIcon(value);
    return this;
  }
  /**
   * Set the latitude and longitude value for the marker
   *
   * @param {Icon | SvgSymbol | string} value The icon for the marker
   */
  #setIcon(value) {
    if (isString(value) || value instanceof Icon || value instanceof SvgSymbol) {
      this.#options.icon = value;
    } else if (isNullOrUndefined(value)) {
      this.#options.icon = void 0;
    }
    if (isString(this.#options.icon)) {
      this.#marker.setIcon(this.#options.icon);
    } else {
      if (this.#options.icon instanceof SvgSymbol) {
        this.#options.icon.toGoogle().then((markerIcon) => {
          this.#marker.setIcon(markerIcon);
        });
      } else if (this.#options.icon instanceof Icon) {
        this.#marker.setIcon(this.#options.icon.toGoogle());
      } else {
        this.#marker.setIcon(null);
      }
    }
  }
  /**
   * Set the label value for the marker
   *
   * @param {string | number | MarkerLabel} value The label for the marker
   * @returns {Marker}
   */
  async setLabel(value) {
    await this.#setupGoogleMarker();
    this.#setLabel(value);
    this.#marker.setLabel(this.#options.label);
    return this;
  }
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
  setLabelSync(value) {
    this.#setupGoogleMarkerSync();
    this.#setLabel(value);
    this.#marker.setLabel(this.#options.label);
    return this;
  }
  /**
   * Set the label value for the marker
   *
   * @param {string | number | MarkerLabel} value The label for the marker
   */
  #setLabel(value) {
    if (isStringWithValue(value)) {
      this.#options.label = value;
    } else if (isNumber(value)) {
      this.#options.label = value.toString();
    } else if (isObject(value) && isStringOrNumber(value.text)) {
      this.#options.label = {
        text: value.text.toString()
      };
      if (isStringWithValue(value.className)) {
        this.#options.label.className = value.className;
      }
      if (isStringWithValue(value.color)) {
        this.#options.label.color = value.color;
      }
      if (isStringWithValue(value.fontFamily)) {
        this.#options.label.fontFamily = value.fontFamily;
      }
      if (isStringWithValue(value.fontWeight)) {
        this.#options.label.fontWeight = value.fontWeight;
      }
      if (isStringWithValue(value.fontSize) || isNumber(value.fontSize)) {
        if (isNumber(value.fontSize)) {
          this.#options.label.fontSize = `${value.fontSize}px`;
        } else {
          this.#options.label.fontSize = value.fontSize.toString();
        }
      }
    } else if (isNullOrUndefined(value)) {
      this.#options.label = void 0;
    }
  }
  /**
   * Adds the marker to the map object
   *
   * Alternate of show()
   *
   * @param {Map} map The map object. Set to null if you want to remove the marker from the map.
   * @returns {Promise<Marker>}
   */
  async setMap(map2) {
    await this.#setupGoogleMarker(map2 ?? void 0);
    this.#setMap(map2);
    return this;
  }
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
  setMapSync(map2) {
    this.#setupGoogleMarkerSync();
    this.#setMap(map2);
    return this;
  }
  /**
   * Set the map object
   *
   * @param {Map|null} value The map object. Set to null if you want to remove the marker from the map.
   */
  #setMap(value) {
    if (value instanceof Map) {
      this.#options.map = value;
      super.setMap(value);
      if (value.getIsReady()) {
        this.#marker.setMap(value.toGoogle() ?? null);
      } else {
        value.onReady(() => {
          if (this.#options.map === value && this.#marker) {
            this.#marker.setMap(value.toGoogle() ?? null);
          }
        });
      }
    } else if (isNullOrUndefined(value)) {
      this.#options.map = null;
      super.setMap(null);
      if (this.#marker) {
        this.#marker.setMap(null);
      }
    }
  }
  /**
   * Set whether the marker rendering is optimized
   *
   * Optimization renders many markers as a single static element, which helps when there are a large
   * number of markers. If it's not set then Google decides. Optimization has no effect on vector maps.
   *
   * It's best to set this in the marker options so that it's used when the marker is created.
   *
   * @param {boolean} value Whether the marker rendering is optimized. Pass undefined to let Google decide.
   * @returns {Promise<Marker>}
   */
  async setOptimized(value) {
    await this.#setupGoogleMarker();
    this.#setOptimized(value);
    return this;
  }
  /**
   * Set whether the marker rendering is optimized syncronously.
   *
   * Only use this if you know that the Google Maps library is already loaded and you have to set up the marker
   * syncronously. If you don't have to set up the marker syncronously, then use setOptimized() instead or pass the
   * optimized value to the constructor or setOptions().
   *
   * @param {boolean} value Whether the marker rendering is optimized. Pass undefined to let Google decide.
   * @returns {Marker}
   */
  setOptimizedSync(value) {
    this.#setupGoogleMarkerSync();
    this.#setOptimized(value);
    return this;
  }
  /**
   * Set whether the marker rendering is optimized
   *
   * @param {boolean} value Whether the marker rendering is optimized
   */
  #setOptimized(value) {
    if (isBoolean(value)) {
      this.#options.optimized = value;
    } else if (isNullOrUndefined(value)) {
      this.#options.optimized = void 0;
    }
    this.#marker.setOptions({ optimized: this.#options.optimized });
  }
  /**
   * Set the marker options
   *
   * This intentionally does not set up the Google Maps marker object. This is so that when the
   * marker option is created all the options are set one time.
   *
   * @param {MarkerOptions} options The marker options
   * @returns {Marker}
   */
  setOptions(options) {
    if (options.anchorPoint) {
      this.#options.anchorPoint = options.anchorPoint;
      if (this.#marker) {
        this.anchorPoint = options.anchorPoint;
      }
    }
    if (isBoolean(options.drag)) {
      this.#drag = options.drag;
      if (this.#marker) {
        this.drag = options.drag;
      }
    }
    if (isBoolean(options.optimized)) {
      this.#options.optimized = options.optimized;
      if (this.#marker) {
        this.optimized = options.optimized;
      }
    }
    if (options.icon) {
      this.#options.icon = icon(options.icon);
      if (this.#marker) {
        this.icon = options.icon;
      }
    } else if (options.svgIcon) {
      if (isString(options.svgIcon)) {
        this.#options.icon = `data:image/svg+xml;base64,${btoa(options.svgIcon)}`;
      } else {
        this.#options.icon = svgSymbol(options.svgIcon);
      }
      if (this.#marker) {
        this.icon = this.#options.icon;
      }
    }
    if (isStringWithValue(options.label) || isNumber(options.label) || isObject(options.label) && isStringOrNumber(options.label.text)) {
      this.#setLabel(options.label);
      if (this.#marker) {
        this.label = options.label;
      }
    }
    if (isNumberOrNumberString(options.lat) || isNumberOrNumberString(options.latitude) || isNumberOrNumberString(options.lng) || isNumberOrNumberString(options.longitude)) {
      const latLngValue = latLng();
      if (isNumberOrNumberString(options.lat)) {
        latLngValue.lat = options.lat;
      } else if (isNumberOrNumberString(options.latitude)) {
        latLngValue.lat = options.latitude;
      }
      if (isNumberOrNumberString(options.lng)) {
        latLngValue.lng = options.lng;
      } else if (isNumberOrNumberString(options.longitude)) {
        latLngValue.lng = options.longitude;
      }
      this.#setPosition(latLngValue);
      if (this.#marker) {
        this.position = latLngValue;
      }
    } else if (options.position) {
      this.#setPosition(options.position);
      if (this.#marker) {
        this.position = options.position;
      }
    }
    if (options.tooltip) {
      let { tooltip: tooltip2 } = options;
      if (options.title && isObject(tooltip2) && !(tooltip2 instanceof HTMLElement || tooltip2 instanceof Text)) {
        tooltip2 = { ...{ content: options.title }, ...tooltip2 };
      }
      this.attachTooltip(tooltip2);
    } else if (options.title) {
      this.title = options.title;
    }
    const stringOptions = ["cursor"];
    stringOptions.forEach((key) => {
      if (options[key] && isStringWithValue(options[key])) {
        this.#options[key] = options[key];
      }
    });
    if (options.map) {
      this.#options.map = options.map;
      super.setMap(options.map);
      if (this.#marker) {
        this.setMap(options.map);
      }
    }
    if (options.data) {
      this.data = options.data;
    }
    return this;
  }
  /**
   * Set the latitude and longitude value for the marker
   *
   * @param {LatLngValue} value The latitude/longitude position for the marker
   * @returns {Promise<Marker>}
   */
  async setPosition(value) {
    this.#setPosition(value);
    await this.#setupGoogleMarker();
    this.#setGoogleMarkerPosition();
    return this;
  }
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
  setPositionSync(value) {
    this.#setPosition(value);
    this.#setupGoogleMarkerSync();
    this.#setGoogleMarkerPosition();
    return this;
  }
  /**
   * Set the latitude and longitude value for the marker
   *
   * @param {LatLngValue} value The latitude/longitude position for the marker
   */
  #setPosition(value) {
    const position = latLng(value);
    if (position.isValid()) {
      this.#options.position = position;
    }
  }
  /**
   * Set the position for the marker on the Google marker object
   */
  #setGoogleMarkerPosition() {
    this.#marker.setPosition(this.#options.position.toGoogle());
  }
  /**
   *Set the title for the marker
   *
   * @param {string} value The title to show on hover
   * @returns {Promise<Marker>}
   */
  async setTitle(value) {
    await this.#setupGoogleMarker();
    this.#setTitle(value);
    return this;
  }
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
  setTitleSync(value) {
    this.#setupGoogleMarkerSync();
    this.#setTitle(value);
    return this;
  }
  /**
   * Set the title for the marker
   *
   * @param {string} value The title to show on hover
   */
  #setTitle(value) {
    if (isStringWithValue(value)) {
      this.#options.title = value;
    } else if (isNullOrUndefined(value)) {
      this.#options.title = void 0;
    }
    this.#marker.setTitle(this.#options.title);
  }
  /**
   * Adds the marker to the map object
   *
   * Alternate of setMap()
   *
   * @param {Map} map The map object
   * @returns {Promise<Marker>}
   */
  show(map2) {
    return this.setMap(map2);
  }
  /**
   * Get the Google maps marker object
   *
   * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker
   *
   * @returns {Promise<google.maps.Marker>}
   */
  toGoogle() {
    return new Promise((resolve) => {
      this.#setupGoogleMarker().then(() => {
        resolve(this.#marker);
      });
    });
  }
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
  toGoogleSync() {
    this.#setupGoogleMarkerSync();
    return this.#marker;
  }
  /**
   * Set up the Google maps marker object if necessary
   *
   * @private
   * @param {Map} [map] The map object. If it's set then it will be initialized if the Google maps object isn't available yet.
   * @returns {Promise<void>}
   */
  #setupGoogleMarker(map2) {
    return new Promise((resolve) => {
      if (!this.#isSettingUp && !isObject(this.#marker)) {
        this.#isSettingUp = true;
        if (checkForGoogleMaps("Marker", "Marker", false)) {
          this.#createMarkerObject().then(() => {
            this.#dispatchReady();
            resolve();
          });
        } else {
          if (map2 instanceof Map) {
            map2.init();
          }
          loader().onMapLoad(() => {
            this.#createMarkerObject().then(() => {
              const thisMap = this.getMap();
              if (this.#marker && thisMap) {
                this.#marker.setMap(thisMap.toGoogle() ?? null);
              } else if (this.#marker && map2) {
                this.#marker.setMap(map2.toGoogle() ?? null);
              }
              this.#dispatchReady();
              resolve();
            });
          });
        }
      } else if (this.#isSettingUp && !isObject(this.#marker)) {
        this.onceImmediate(MarkerEvents.READY, () => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
  /**
   * Set up the Google maps marker object syncronously.
   */
  #setupGoogleMarkerSync() {
    if (!isObject(this.#marker)) {
      if (checkForGoogleMaps("Marker", "Marker", false)) {
        this.#createMarkerObject().then(() => {
          this.#dispatchReady();
        });
      } else {
        throw new Error(
          "The Google maps libray is not available so the marker object cannot be created. Load the Google maps library first."
        );
      }
    }
  }
  /**
   * Dispatch the event to say that the marker is ready.
   *
   * It's only dispatched once, even if the marker is set up both syncronously and asyncronously.
   *
   * @private
   */
  #dispatchReady() {
    if (!this.#isReady) {
      this.#isReady = true;
      this.dispatch(MarkerEvents.READY);
    }
  }
  /**
   * Create the marker object
   *
   * @private
   * @returns {Promise<void>}
   */
  #createMarkerObject() {
    return new Promise((resolve) => {
      if (!this.#marker) {
        (async () => {
          const markerOptions = {};
          const optionsToSet = ["cursor", "title"];
          optionsToSet.forEach((key) => {
            if (typeof this.#options[key] !== "undefined") {
              markerOptions[key] = this.#options[key];
            }
          });
          if (this.#options.anchorPoint) {
            markerOptions.anchorPoint = this.#options.anchorPoint.toGoogle();
          }
          if (this.#drag) {
            markerOptions.draggable = true;
          }
          if (isBoolean(this.#options.optimized)) {
            markerOptions.optimized = this.#options.optimized;
          }
          if (this.#options.icon) {
            if (isString(this.#options.icon)) {
              markerOptions.icon = this.#options.icon;
            } else if (this.#options.icon instanceof SvgSymbol) {
              this.#options.icon.toGoogle().then((markerIcon) => {
                if (this.#marker) {
                  this.#marker.setIcon(markerIcon);
                } else {
                  markerOptions.icon = markerIcon;
                }
              });
            } else if (this.#options.icon instanceof Icon) {
              markerOptions.icon = this.#options.icon.toGoogle();
            }
          }
          if (this.#options.position) {
            markerOptions.position = this.#options.position.toGoogle();
          }
          if (this.#options.label) {
            markerOptions.label = this.#options.label;
          }
          if (this.#options.map) {
            this.#options.map.onReady(() => {
              if (this.#options.map) {
                markerOptions.map = this.#options.map.toGoogle();
              }
              this.#marker = new google.maps.Marker(markerOptions);
              this.setEventGoogleObject(this.#marker);
              resolve();
            });
          } else {
            this.#marker = new google.maps.Marker(markerOptions);
            this.setEventGoogleObject(this.#marker);
            resolve();
          }
        })();
      } else {
        resolve();
      }
    });
  }
};
var marker = (position, options) => {
  if (position instanceof Marker) {
    return position;
  }
  return new Marker(position, options);
};

// src/lib/InfoWindow.ts
var InfoWindow = class extends Layer_default {
  /**
   * Whether to automatically close other open InfoWindows when opening this one
   *
   * @private
   * @type {boolean}
   */
  #autoClose = true;
  /**
   * The event to trigger the popup
   *
   * @private
   * @type {'click' | 'clickon' | 'hover'}
   */
  #event = "click";
  /**
   * Whether focus should be moved to the InfoWindow when it is opened
   *
   * @private
   * @type {boolean}
   */
  #focus = false;
  /**
   * Whether the InfoWindow is attached to an element
   *
   * @private
   * @type {boolean}
   */
  #isAttached = false;
  /**
   * Holds if the InfoWindow is open or not
   *
   * @private
   * @type {boolean}
   */
  #isOpen = false;
  /**
   * Holds the InfoWindow options
   *
   * @private
   * @type {InfoWindowOptions}
   */
  #options = {};
  /**
   * Whether clicking the thing that triggered the info window to open should also close the info window
   *
   * @private
   * @type {boolean}
   */
  #toggleDisplay = true;
  /**
   * Holds the Google maps InfoWindow object
   *
   * This is only set once the Google Maps library is loaded.
   *
   * @private
   * @type {google.maps.InfoWindow|undefined}
   */
  #infoWindow;
  /**
   * Constructor
   *
   * @param {InfoWindowOptions | string | HTMLElement | Text} [options] The InfoWindow options
   */
  constructor(options) {
    super("infowindow", "InfoWindow");
    this.#options.pixelOffset = size(0, -4);
    if (isObject(options)) {
      if (options instanceof HTMLElement || options instanceof Text) {
        this.content = options;
      } else {
        this.setOptions(options);
      }
    } else if (typeof options !== "undefined") {
      this.content = options;
    }
  }
  /**
   * Get the aria label for the InfoWindow
   *
   * @returns {string|undefined}
   */
  get ariaLabel() {
    return this.#options.ariaLabel;
  }
  /**
   * Set the aria label for the InfoWindow
   *
   * @param {string|number} ariaLabel The aria label for the InfoWindow
   */
  set ariaLabel(ariaLabel) {
    if (isStringWithValue(ariaLabel) || isNumber(ariaLabel)) {
      this.#options.ariaLabel = ariaLabel.toString();
      this.#setupGoogleInfoWindow();
      if (this.#infoWindow) {
        this.#infoWindow.setOptions({ ariaLabel: this.#options.ariaLabel });
      }
    }
  }
  /**
   * Get the content for the InfoWindow
   *
   * @returns {string|HTMLElement|Text|undefined}
   */
  get content() {
    return this.#options.content;
  }
  /**
   * Set the content for the InfoWindow
   *
   * @param {string|HTMLElement|Text} content The content for the InfoWindow
   */
  set content(content) {
    if (isStringWithValue(content) || content instanceof HTMLElement || content instanceof Text) {
      this.#options.content = content;
      this.#setupGoogleInfoWindow();
      if (this.#infoWindow) {
        this.#infoWindow.setContent(content);
      }
    }
  }
  /**
   * Get the disableAutoPan option for the InfoWindow
   *
   * @returns {boolean}
   */
  get disableAutoPan() {
    return typeof this.#options.disableAutoPan === "boolean" && this.#options.disableAutoPan === true;
  }
  /**
   * Set the disableAutoPan option for the InfoWindow
   *
   * @param {boolean} disableAutoPan The disableAutoPan option for the InfoWindow
   */
  set disableAutoPan(disableAutoPan) {
    if (typeof disableAutoPan === "boolean") {
      this.#options.disableAutoPan = disableAutoPan;
      this.#setupGoogleInfoWindow();
      if (this.#infoWindow) {
        this.#infoWindow.setOptions({ disableAutoPan: this.#options.disableAutoPan });
      }
    }
  }
  /**
   * Returns the event to trigger the popup
   *
   * @returns {string}
   */
  get event() {
    return this.#event;
  }
  /**
   * Set the event to trigger the popup
   *
   * @param {string} event The event to trigger the popup
   */
  set event(event) {
    if (isStringWithValue(event) && ["click", "clickon", "hover"].includes(event.toLowerCase())) {
      this.#event = event.toLowerCase();
    } else {
      throw new Error('Invalid event value. Allowed values are: "click", "clickon", and "hover"');
    }
  }
  /**
   * Get the maxWidth option for the InfoWindow
   *
   * @returns {number|undefined}
   */
  get maxWidth() {
    return this.#options.maxWidth;
  }
  /**
   * Set the maxWidth option for the InfoWindow
   *
   * @param {number|string} maxWidth The maxWidth option for the InfoWindow
   */
  set maxWidth(maxWidth) {
    if (isNumber(maxWidth) || isNumberString(maxWidth)) {
      let width = maxWidth;
      if (isNumberString(width)) {
        width = Number(width);
      }
      this.#options.maxWidth = width;
      this.#setupGoogleInfoWindow();
      if (this.#infoWindow) {
        this.#infoWindow.setOptions({ maxWidth: this.#options.maxWidth });
      }
    }
  }
  /**
   * Get the minWidth option for the InfoWindow
   *
   * @returns {number|undefined}
   */
  get minWidth() {
    return this.#options.minWidth;
  }
  /**
   * Set the minWidth option for the InfoWindow
   *
   * @param {number|string} minWidth The minWidth option for the InfoWindow
   */
  set minWidth(minWidth) {
    if (isNumber(minWidth) || isNumberString(minWidth)) {
      let width = minWidth;
      if (isNumberString(width)) {
        width = Number(width);
      }
      this.#options.minWidth = width;
      this.#setupGoogleInfoWindow();
      if (this.#infoWindow) {
        this.#infoWindow.setOptions({ minWidth: this.#options.minWidth });
      }
    }
  }
  /**
   * Get the pixelOffset option for the InfoWindow
   *
   * @returns {Size}
   */
  get pixelOffset() {
    return this.#options.pixelOffset;
  }
  /**
   * Set the pixelOffset option for the InfoWindow
   *
   * @param {SizeValue} pixelOffset The pixelOffset option for the InfoWindow
   */
  set pixelOffset(pixelOffset) {
    const sizeValue = size(pixelOffset);
    if (sizeValue.isValid()) {
      this.#setupGoogleInfoWindow();
      this.#options.pixelOffset = sizeValue;
      if (this.#infoWindow) {
        this.#infoWindow.setOptions({ pixelOffset: this.#options.pixelOffset.toGoogle() });
      }
    }
  }
  /**
   * Get the position option for the InfoWindow
   *
   * @returns {LatLng|undefined}
   */
  get position() {
    return this.#options.position;
  }
  /**
   * Set the position option for the InfoWindow
   *
   * @param {LatLngValue} position The position option for the InfoWindow
   */
  set position(position) {
    const latLngValue = latLng(position);
    if (latLngValue.isValid()) {
      this.#setupGoogleInfoWindow();
      this.#options.position = latLngValue;
      if (this.#infoWindow) {
        this.#infoWindow.setPosition(this.#options.position.toGoogle());
      }
    }
  }
  /**
   * Get the zIndex option for the InfoWindow
   *
   * @returns {number|undefined}
   */
  get zIndex() {
    return this.#options.zIndex;
  }
  /**
   * Set the zIndex option for the InfoWindow
   *
   * @param {number|string} zIndex The zIndex option for the InfoWindow
   */
  set zIndex(zIndex) {
    if (isNumber(zIndex) || isNumberString(zIndex)) {
      let zIndexValue = zIndex;
      if (isNumberString(zIndexValue)) {
        zIndexValue = Number(zIndexValue);
      }
      this.#options.zIndex = zIndexValue;
      this.#setupGoogleInfoWindow();
      if (this.#infoWindow) {
        this.#infoWindow.setOptions({ zIndex: this.#options.zIndex });
      }
    }
  }
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
  async attachTo(element, event) {
    if (!this.#isAttached) {
      this.#isAttached = true;
      await element.init().then(() => {
        element.onceImmediate(READY_EVENT, () => {
          const triggerEvent = event || this.#event;
          if (triggerEvent === "clickon" || triggerEvent === "hover") {
            this.#toggleDisplay = false;
          }
          if (triggerEvent === "hover") {
            element.on("mouseover", (e) => {
              if (e.latLng) {
                this.position = e.latLng;
              }
              this.show(element);
            });
            if (element instanceof Map) {
              element.on("mousemove", (e) => {
                if (e.latLng) {
                  this.position = e.latLng;
                }
                this.show(element);
              });
            }
            element.on("mouseout", () => {
              this.hide();
            });
          } else if (triggerEvent === "clickon") {
            element.on("click", (e) => {
              if (element instanceof Map && e.latLng) {
                this.position = e.latLng;
              }
              this.show(element);
            });
          } else {
            element.on("click", (e) => {
              if (element instanceof Map && e.latLng) {
                this.position = e.latLng;
              }
              this.show(element);
            });
          }
        });
      });
    }
    return this;
  }
  /**
   * Hide the info window
   *
   * Alias to hide()
   *
   * @returns {InfoWindow}
   */
  close() {
    return this.hide();
  }
  /**
   * Returns whether the InfoWindow already has content
   *
   * @returns {boolean}
   */
  hasContent() {
    return typeof this.#options.content !== "undefined" && (isStringWithValue(this.#options.content) || this.#options.content instanceof HTMLElement || this.#options.content instanceof Text);
  }
  /**
   * Hide the info window
   *
   * @returns {InfoWindow}
   */
  hide() {
    if (this.#infoWindow) {
      this.#infoWindow.close();
    }
    this.#isOpen = false;
    InfoWindowCollection.getInstance().remove(this);
    return this;
  }
  /**
   * Returns whether the InfoWindow is open or not
   *
   * @returns {boolean}
   */
  isOpen() {
    return this.#isOpen;
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
   * Add an event listener for when the info window is loaded and ready for use.
   *
   * @param {EventCallback} [callback] The callback function to call when the event is dispatched.
   */
  onReady(callback) {
    this.on(InfoWindowEvents.READY, callback);
  }
  /**
   * Show the info window
   *
   * Alias to show()
   *
   * @param {Map | Layer} element The anchor object or map object.
   * @returns {Promise<InfoWindow>}
   */
  open(element) {
    return this.show(element);
  }
  /**
   * Set the InfoWindow options
   *
   * @param {InfoWindowOptions} options The InfoWindow options
   * @returns {InfoWindow}
   */
  setOptions(options) {
    if (options.ariaLabel) {
      this.ariaLabel = options.ariaLabel;
    }
    if (options.content) {
      this.content = options.content;
    }
    if (typeof options.disableAutoPan === "boolean") {
      this.disableAutoPan = options.disableAutoPan;
    }
    if (options.event) {
      this.event = options.event;
    }
    if (options.maxWidth) {
      this.maxWidth = options.maxWidth;
    }
    if (options.minWidth) {
      this.minWidth = options.minWidth;
    }
    if (options.pixelOffset) {
      this.pixelOffset = options.pixelOffset;
    }
    if (options.position) {
      this.position = options.position;
    }
    if (options.zIndex) {
      this.zIndex = options.zIndex;
    }
    if (typeof options.autoClose === "boolean") {
      this.#autoClose = options.autoClose;
    }
    if (typeof options.focus === "boolean") {
      this.#focus = options.focus;
    }
    if (typeof options.toggleDisplay === "boolean") {
      this.#toggleDisplay = options.toggleDisplay;
    }
    return this;
  }
  /**
   * Set the InfoWindow content
   *
   * @param {string | HTMLElement | Text} content The InfoWindow content
   * @returns {InfoWindow}
   */
  setContent(content) {
    this.content = content;
    return this;
  }
  /**
   * Set the InfoWindow position
   *
   * @param {LatLngValue} position The position for the InfoWindow
   * @returns {InfoWindow}
   */
  setPosition(position) {
    this.position = position;
    return this;
  }
  /**
   * Sets the zIndex value for the InfoWindow
   *
   * https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.setZIndex
   *
   * @param {number|string} zIndex The zindex value
   * @returns {InfoWindow}
   */
  setZIndex(zIndex) {
    this.zIndex = zIndex;
    return this;
  }
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
  show(element) {
    return new Promise((resolve, reject) => {
      this.#setupGoogleInfoWindow();
      const googleInfoWindow = this.#infoWindow;
      if (!googleInfoWindow) {
        reject(new Error("The Google Maps InfoWindow could not be set up. Make sure the Google Maps library is loaded."));
        return;
      }
      const collection = InfoWindowCollection.getInstance();
      if (collection.has(this) && this.#isOpen) {
        if (this.#toggleDisplay) {
          this.hide();
        }
        this.dispatch(InfoWindowEvents.READY);
        resolve(this);
      } else {
        if (this.#autoClose) {
          collection.hideOthers(this);
        }
        this.#isOpen = true;
        collection.add(this);
        if (element instanceof Map) {
          googleInfoWindow.open({
            map: element.toGoogle(),
            shouldFocus: this.#focus
          });
          this.setMap(element);
          this.dispatch(InfoWindowEvents.READY);
          resolve(this);
        } else if (element instanceof Marker) {
          element.toGoogle().then((marker2) => {
            googleInfoWindow.open({
              anchor: marker2,
              shouldFocus: this.#focus
            });
            this.setMap(element.getMap());
            this.dispatch(InfoWindowEvents.READY);
            resolve(this);
          });
        }
      }
    });
  }
  /**
   * Toggle the display of the overlay on the map
   *
   * @param {Map | Layer} element The anchor object or map object.
   * @returns {void}
   */
  toggle(element) {
    if (this.#isOpen) {
      this.hide();
    } else {
      this.show(element);
    }
  }
  /**
   * Get the Google maps InfoWindow object
   *
   * https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow
   *
   * @returns {google.maps.InfoWindow|undefined} The Google maps InfoWindow object, or undefined if the Google Maps library isn't loaded.
   */
  toGoogle() {
    this.#setupGoogleInfoWindow();
    return this.#infoWindow;
  }
  /**
   * Set up the Google maps InfoWindow object if necessary
   *
   * @private
   */
  #setupGoogleInfoWindow() {
    if (!isObject(this.#infoWindow)) {
      if (checkForGoogleMaps("InfoWindow", "InfoWindow", false)) {
        const infoWindowOptions = {};
        const { ariaLabel, content, disableAutoPan, maxWidth, minWidth, zIndex } = this.#options;
        if (typeof ariaLabel !== "undefined") {
          infoWindowOptions.ariaLabel = ariaLabel;
        }
        if (typeof content !== "undefined") {
          infoWindowOptions.content = content;
        }
        if (typeof disableAutoPan !== "undefined") {
          infoWindowOptions.disableAutoPan = disableAutoPan;
        }
        if (typeof maxWidth !== "undefined") {
          infoWindowOptions.maxWidth = maxWidth;
        }
        if (typeof minWidth !== "undefined") {
          infoWindowOptions.minWidth = minWidth;
        }
        if (typeof zIndex !== "undefined") {
          infoWindowOptions.zIndex = zIndex;
        }
        if (this.#options.pixelOffset) {
          infoWindowOptions.pixelOffset = this.#options.pixelOffset.toGoogle();
        }
        if (this.#options.position) {
          infoWindowOptions.position = this.#options.position.toGoogle();
        }
        const googleInfoWindow = new google.maps.InfoWindow(infoWindowOptions);
        this.#infoWindow = googleInfoWindow;
        googleInfoWindow.addListener("closeclick", () => {
          InfoWindowCollection.getInstance().remove(this);
        });
        googleInfoWindow.addListener("map_changed", () => {
          if (googleInfoWindow.get("map") === null) {
            this.#isOpen = false;
            InfoWindowCollection.getInstance().remove(this);
          }
        });
      }
    }
  }
};
var infoWindow = (options) => {
  if (options instanceof InfoWindow) {
    return options;
  }
  return new InfoWindow(options);
};
var infoWindowMixin = {
  /**
   * Holds the InfoWindow object
   *
   * @type {InfoWindow|null}
   */
  layerInfoWindow: null,
  /**
   * Attach an InfoWindow to the layer
   *
   * @param {Map | Layer} this The object that the mixin is added to
   * @param {InfoWindowValue} infoWindowValue The content for the InfoWindow, or the InfoWindow options object, or the InfoWindow object
   * @param {'click' | 'clickon' | 'hover'} [event] The event to trigger the popup. Defaults to 'hover'. See Popup.attachTo() for more information.
   * @returns {InfoWindow}
   */
  attachInfoWindow(infoWindowValue, event) {
    const i = infoWindow(infoWindowValue);
    i.attachTo(this, event);
    return i;
  }
};
Layer_default.include(infoWindowMixin);
Map.include(infoWindowMixin);
var InfoWindowCollection = /* @__PURE__ */ (() => {
  let instance;
  function createInstance() {
    return {
      /**
       * Holds the InfoWindow objects
       */
      infoWindows: [],
      /**
       * Adds an InfoWindow to the collection
       *
       * @param {InfoWindow} iw The InfoWindow object to add
       */
      add(iw) {
        this.infoWindows.push(iw);
      },
      /**
       * Clears the collection
       */
      clear() {
        this.infoWindows = [];
      },
      /**
       * Closes all the InfoWindows in the collection
       */
      hideAll() {
        this.infoWindows.forEach((iw) => {
          iw.hide();
        });
      },
      /**
       * Close all the InfoWindows in the collection except for the one passed in
       *
       * @param {InfoWindow} iw The InfoWindow object to keep open
       */
      hideOthers(iw) {
        this.infoWindows.forEach((infoW) => {
          if (infoW !== iw) {
            infoW.hide();
          }
        });
      },
      /**
       * Returns whether the collection has the InfoWindow object
       *
       * @param {InfoWindow} iw The InfoWindow object to check for
       * @returns {boolean}
       */
      has(iw) {
        return this.infoWindows.indexOf(iw) > -1;
      },
      /**
       * Removes an InfoWindow from the collection
       *
       * @param {InfoWindow} iw The InfoWindow object to remove
       */
      remove(iw) {
        const index = this.infoWindows.indexOf(iw);
        if (index > -1) {
          this.infoWindows.splice(index, 1);
        }
      }
    };
  }
  return {
    /**
     * Get the singleton instance of the object
     *
     * @returns {InfoWindowCollectionObject}
     */
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

// src/lib/MarkerCluster.ts
var import_markerclusterer2 = require("@googlemaps/markerclusterer");

// src/lib/MarkerCluster/DefaultRender.ts
var import_markerclusterer = require("@googlemaps/markerclusterer");
var DefaultRenderer = class {
  /**
   * The colors to use for the clusters.
   */
  #colors = {};
  /**
   * The color to use for the cluster if it has less than the average number of markers in a cluster.
   *
   * @type {string|ClusterColor}
   */
  #colorRangeBottom = "#ff0000";
  /**
   * The color to use for the cluster if it has more than the average number of markers in a cluster.
   *
   * @type {string|ClusterColor}
   */
  #colorRangeTop = "#0000ff";
  /**
   * The opacity to use for the center of the marker
   *
   * @type {number}
   */
  #centerOpacity = 0.7;
  /**
   * The opacity to use for the middle ring of the marker
   *
   * @type {number}
   */
  #middleOpacity = 0.4;
  /**
   * The opacity to use for the outer ring of the marker
   *
   * @type {number}
   */
  #outerOpacity = 0.2;
  /**
   * Holds the font family for the cluster marker label
   *
   * @type {string}
   */
  #labelFontFamily = "roboto,arial,sans-serif";
  /**
   * Holds the font size for the cluster marker
   *
   * @type {string}
   */
  #labelFontSize = "12px";
  /**
   * Holds if the number of markers in the cluster should be displayed
   *
   * @type {boolean}
   */
  #showNumber = true;
  /**
   * Set the color to use for the cluster if it has less than the average number of markers in a cluster.
   *
   * @param {string|ClusterColor} color The color to use if the cluster has less than the average number of markers in a cluster.
   */
  setColorRangeBottom(color) {
    if (isStringWithValue(color)) {
      this.#colorRangeBottom = color;
    } else if (isObject(color) && isStringWithValue(color.bgColor)) {
      this.#colorRangeBottom = color;
    }
  }
  /**
   * Set the color to use for the cluster if it has more than the average number of markers in a cluster.
   *
   * @param {string|ClusterColor} color The color to use if the cluster has more than the average number of markers in a cluster.
   */
  setColorRangeTop(color) {
    if (isStringWithValue(color)) {
      this.#colorRangeTop = color;
    } else if (isObject(color) && isStringWithValue(color.bgColor)) {
      this.#colorRangeTop = color;
    }
  }
  /**
   * Set custom colors to use for the cluster markers.
   *
   * @param {ClusterColors} colors The custom colors to use for the cluster markers.
   */
  setColors(colors) {
    if (isObject(colors)) {
      const sortedColors = Object.keys(colors).map((k) => parseInt(k, 10)).filter(
        (k) => !Number.isNaN(k) && k >= 0 && (typeof colors[k] === "string" || isObject(colors[k]) && typeof colors[k].bgColor === "string")
      ).sort((a, b) => a - b).reduce((acc, k) => {
        acc[k] = colors[k];
        return acc;
      }, {});
      if (Object.keys(sortedColors).length > 0) {
        this.#colors = sortedColors;
      }
    }
  }
  /**
   * Set the opacity for the center of the marker
   *
   * @param {number} center The opacity to use for the center of the marker
   */
  setCenterOpacity(center) {
    const opacity = getNumber(center);
    if (!Number.isNaN(opacity) && opacity >= 0 && opacity <= 1) {
      this.#centerOpacity = opacity;
    }
  }
  /**
   * Set the opacity for the middle ring of the marker
   *
   * @param {number} middle The opacity to use for the middle ring of the marker
   */
  setMiddleOpacity(middle) {
    const opacity = getNumber(middle);
    if (!Number.isNaN(opacity) && opacity >= 0 && opacity <= 1) {
      this.#middleOpacity = opacity;
    }
  }
  /**
   * Set the opacity for the outer ring of the marker
   *
   * @param {number} outer The opacity to use for the outer ring of the marker
   */
  setOuterOpacity(outer) {
    const opacity = getNumber(outer);
    if (!Number.isNaN(opacity) && opacity >= 0 && opacity <= 1) {
      this.#outerOpacity = opacity;
    }
  }
  /**
   * Set the font family to use for the cluster marker
   *
   * @param {string} fontFamily The font family to use for the cluster marker
   */
  setFontFamily(fontFamily) {
    this.#labelFontFamily = fontFamily;
  }
  /**
   * Set the font size to use for the cluster marker
   *
   * @param {number} fontSize The font size to use for the cluster marker
   */
  setFontSize(fontSize) {
    if (isString(fontSize)) {
      this.#labelFontSize = fontSize;
    } else if (isNumber(fontSize)) {
      this.#labelFontSize = `${fontSize}px`;
    }
  }
  /**
   * Sets if the number of markers in the cluster should be displayed
   *
   * @param {boolean} showNumber Whether to show the number of markers in the cluster
   */
  setShowNumber(showNumber) {
    this.#showNumber = getBoolean(showNumber);
  }
  /**
   * Get the color for the cluster.
   *
   * @param {number} count The number of markers in the cluster.
   * @param {number} mean The average number of markers in a cluster.
   * @returns {ClusterColor}
   */
  #getColor(count, mean) {
    const keys = Object.keys(this.#colors);
    let color = this.#colorRangeBottom;
    if (Object.keys(this.#colors).length > 0) {
      for (let i = 0; i < keys.length; i += 1) {
        const k = parseInt(keys[i], 10);
        if (count >= k) {
          color = this.#colors[k];
        } else {
          break;
        }
      }
    } else {
      color = count > mean ? this.#colorRangeTop : this.#colorRangeBottom;
    }
    let bgColor = "";
    let textColor = "#ffffff";
    if (typeof color === "string") {
      bgColor = color;
    } else if (isObject(color)) {
      const colorObject = color;
      if (isStringWithValue(colorObject.bgColor)) {
        bgColor = colorObject.bgColor;
        if (isStringWithValue(colorObject.textColor)) {
          textColor = colorObject.textColor;
        }
      }
    }
    return {
      bgColor,
      textColor
    };
  }
  /**
   * Renders the cluster marker
   *
   * @param {Cluster} cluster The cluster information
   * @param {ClusterStats} stats The status for all of the clusters
   * @param {google.maps.Map} map The map object
   * @returns {google.maps.Marker | google.maps.marker.AdvancedMarkerElement}
   */
  render(cluster, stats, map2) {
    const { count, position } = cluster;
    const color = this.#getColor(count, stats.clusters.markers.mean);
    const svg = `<svg fill="${color.bgColor}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50" height="50">
                <circle cx="25" cy="25" opacity="${this.#centerOpacity}" r="16" />
                <circle cx="25" cy="25" opacity="${this.#middleOpacity}" r="22" />
                <circle cx="25" cy="25" opacity="${this.#outerOpacity}" r="25" />
                <text x="50%" y="50%" style="fill:${color.textColor}" text-anchor="middle" font-size="${this.#labelFontSize}" dominant-baseline="middle" font-family="${this.#labelFontFamily}">${this.#showNumber ? count : ""}</text>
            </svg>`;
    const title = `Cluster of ${count} markers`;
    const zIndex = Number(google.maps.Marker.MAX_ZINDEX) + count;
    if (import_markerclusterer.MarkerUtils.isAdvancedMarkerAvailable(map2)) {
      const parser = new DOMParser();
      const svgEl = parser.parseFromString(svg, "image/svg+xml").documentElement;
      svgEl.setAttribute("transform", "translate(0 25)");
      const clusterOptions2 = {
        map: map2,
        position,
        zIndex,
        title,
        content: svgEl
      };
      return new google.maps.marker.AdvancedMarkerElement(clusterOptions2);
    }
    const clusterOptions = {
      position,
      zIndex,
      title,
      icon: {
        url: `data:image/svg+xml;base64,${btoa(svg)}`,
        anchor: new google.maps.Point(25, 25)
      }
    };
    return new google.maps.Marker(clusterOptions);
  }
};

// src/lib/MarkerCluster/ImageRenderer.ts
var ImageRenderer = class {
  /**
   * Holds the renderer that's used if no valid images were set.
   *
   * This is created the first time that a cluster is rendered without an image.
   *
   * @private
   * @type {DefaultRenderer|undefined}
   */
  #fallbackRenderer;
  /**
   * Holds the images that can be used for the marker cluster icons
   *
   * @private
   * @type {ClusterImages}
   */
  #images = {};
  /**
   * A CSS class name to be added to the label element
   *
   * @private
   * @type {string|undefined}
   */
  #labelClassName;
  /**
   * The color of the label text. Default color is black.
   *
   * @private
   * @type {string|undefined}
   */
  #labelColor;
  /**
   * Holds the font family for the cluster marker label.
   *
   * @private
   * @type {string|undefined}
   */
  #labelFontFamily;
  /**
   * Holds the font size for the cluster marker
   *
   * @private
   * @type {number}
   */
  #labelFontSize = "12px";
  /**
   * The font weight of the label text (equivalent to the CSS font-weight property).
   *
   * @private
   * @type {string|undefined}
   */
  #labelFontWeight;
  /**
   * The map object
   *
   * @private
   * @type {Map|undefined}
   */
  #map;
  /**
   * Holds if the number of markers in the cluster should be displayed
   *
   * @private
   * @type {boolean}
   */
  #showNumber = true;
  /**
   * Set the map object to use for the cluster marker
   *
   * @param {Map} map The map object
   */
  setMap(map2) {
    this.#map = map2;
  }
  /**
   * Set custom images to use for the cluster markers.
   *
   * @param {ClusterImages} images The custom images to use for the cluster markers.
   */
  setImages(images) {
    if (isObject(images)) {
      const sortedImages = Object.keys(images).map((k) => parseInt(k, 10)).filter(
        (k) => !Number.isNaN(k) && k >= 0 && (typeof images[k] === "string" || isObject(images[k]) && typeof images[k].url === "string")
      ).sort((a, b) => a - b).reduce((acc, k) => {
        acc[k] = images[k];
        return acc;
      }, {});
      if (Object.keys(sortedImages).length > 0) {
        this.#images = sortedImages;
      }
    }
  }
  /**
   * Set a single image to use for the cluster markers.
   * This will replace any existing images.
   * The image will be used for all clusters.
   * To set different images for different cluster sizes, use the setImages method.
   *
   * @param {ClusterImageValue} image The image URL or image object to use for the cluster markers.
   */
  setImage(image) {
    if (typeof image === "string" || isObject(image) && typeof image.url === "string") {
      this.#images = { 0: image };
    }
  }
  /**
   * Set the class name to use for the label
   *
   * @param {string} labelClassName The class name to use for the label
   */
  setLabelClassName(labelClassName) {
    this.#labelClassName = labelClassName;
  }
  /**
   * Set the color of the label text
   *
   * @param {string} labelColor The color of the label text. Default color is black.
   */
  setLabelColor(labelColor) {
    this.#labelColor = labelColor;
  }
  /**
   * Set the font family to use for the cluster marker
   *
   * @param {string} fontFamily The font family to use for the cluster marker
   */
  setLabelFontFamily(fontFamily) {
    this.#labelFontFamily = fontFamily;
  }
  /**
   * Set the font size to use for the cluster marker
   *
   * @param {string|number} fontSize The font size to use for the cluster marker
   */
  setLabelFontSize(fontSize) {
    if (isStringOrNumber(fontSize)) {
      this.#labelFontSize = fontSize;
    }
  }
  /**
   * Set the font weight to use for the cluster marker
   *
   * @param {string} labelFontWeight The font weight to use for the cluster marker
   */
  setLabelFontWeight(labelFontWeight) {
    this.#labelFontWeight = labelFontWeight;
  }
  /**
   * Sets if the number of markers in the cluster should be displayed
   *
   * @param {boolean} showNumber Whether to show the number of markers in the cluster
   */
  setShowNumber(showNumber) {
    this.#showNumber = getBoolean(showNumber);
  }
  /**
   * Get the image for the cluster.
   *
   * This returns undefined if no valid images were set.
   *
   * @param {number} count The number of markers in the cluster.
   * @returns {ClusterImageValue|undefined}
   */
  getImage(count) {
    const keys = Object.keys(this.#images).map((k) => parseInt(k, 10));
    let image = this.#images[keys[0]];
    for (let i = 0; i < keys.length; i += 1) {
      const k = keys[i];
      if (count >= k) {
        image = this.#images[k];
      } else {
        break;
      }
    }
    return image;
  }
  /**
   * Renders the cluster marker
   *
   * If no valid images were set then the cluster is rendered with the default renderer instead.
   *
   * @param {Cluster} cluster The cluster information
   * @param {ClusterStats} stats The stats for all of the clusters
   * @param {google.maps.Map} map The map object
   * @returns {google.maps.Marker | google.maps.marker.AdvancedMarkerElement}
   */
  render(cluster, stats, map2) {
    const { count, position } = cluster;
    const imageValue = this.getImage(count);
    if (!imageValue) {
      return this.#getFallbackRenderer().render(cluster, stats, map2);
    }
    const image = typeof imageValue === "string" ? { url: imageValue } : imageValue;
    const markerImage = icon(image.url);
    if (image.width && image.height) {
      markerImage.setSize([image.width, image.height]);
    } else if (image.size) {
      markerImage.setSize(image.size);
    }
    if (image.scaledWidth && image.scaledHeight) {
      markerImage.setScaledSize([image.scaledWidth, image.scaledHeight]);
    } else if (image.scaledSize) {
      markerImage.setScaledSize(image.scaledSize);
    }
    const label = { text: count.toString() };
    if (image.labelClassName) {
      label.className = image.labelClassName;
    } else if (this.#labelClassName) {
      label.className = this.#labelClassName;
    }
    if (image.labelColor) {
      label.color = image.labelColor;
    } else if (this.#labelColor) {
      label.color = this.#labelColor;
    }
    if (image.labelFontFamily) {
      label.fontFamily = image.labelFontFamily;
    } else if (this.#labelFontFamily) {
      label.fontFamily = this.#labelFontFamily;
    }
    if (image.labelFontSize) {
      label.fontSize = image.labelFontSize;
    } else if (this.#labelFontSize) {
      label.fontSize = this.#labelFontSize.toString();
    }
    if (image.labelFontWeight) {
      label.fontWeight = image.labelFontWeight;
    } else if (this.#labelFontWeight) {
      label.fontWeight = this.#labelFontWeight;
    }
    const clusterMarker = marker();
    clusterMarker.setPositionSync({ lat: position.lat(), lng: position.lng() });
    clusterMarker.setIconSync(markerImage);
    if (this.#showNumber) {
      clusterMarker.setLabelSync(label);
    }
    return clusterMarker.toGoogleSync();
  }
  /**
   * Get the renderer to use when no valid images were set.
   *
   * The label settings that apply to both renderers are passed on to it.
   *
   * @private
   * @returns {DefaultRenderer}
   */
  #getFallbackRenderer() {
    if (!this.#fallbackRenderer) {
      console.warn(
        "No valid images were set for the marker cluster image renderer. The default cluster marker is being used instead."
      );
      const renderer = new DefaultRenderer();
      renderer.setShowNumber(this.#showNumber);
      if (this.#labelFontFamily) {
        renderer.setFontFamily(this.#labelFontFamily);
      }
      renderer.setFontSize(this.#labelFontSize);
      this.#fallbackRenderer = renderer;
    }
    return this.#fallbackRenderer;
  }
};

// src/lib/MarkerCluster.ts
var MarkerCluster = class extends Base_default {
  /**
   * The MarkerClusterer object
   *
   * This is undefined until the cluster is set up, which may be delayed until the map is loaded.
   *
   * @private
   * @type {MarkerClusterer|undefined}
   */
  #clusterer;
  /**
   * Holds any markers to add to the cluster once the map is loaded
   *
   * @private
   * @type {Marker[]}
   */
  #pendingMarkers = [];
  /**
   * The constructor for the MarkerCluster class
   *
   * @param {Map} map The map object
   * @param {Marker[]|MarkerClusterOptions} [markers] Markers to cluster. You can also use addMarker() instead of adding the markers here.
   * @param {MarkerClusterOptions} [options] Options for the marker clusterer
   */
  constructor(map2, markers, options) {
    super("markercluster");
    if (!(map2 instanceof Map)) {
      throw new Error("You must pass a valid map object to the MarkerCluster object.");
    }
    if (checkForGoogleMaps("MarkerCluster", "Marker", false)) {
      this.#setupCluster(map2, markers, options);
    } else {
      loader().onMapLoad(() => {
        this.#setupCluster(map2, markers, options);
      });
    }
  }
  /**
   * Set up the marker cluster
   *
   * @param {Map} map The map object
   * @param {Marker[]|MarkerClusterOptions} [markers] Markers to cluster. You can also use addMarker() instead of adding the markers here.
   * @param {MarkerClusterOptions} [options] Options for the marker clusterer
   */
  #setupCluster(map2, markers, options) {
    const clusterOptions = {
      map: map2.toGoogle()
    };
    let optionsToUse = options;
    if (isObject(markers) && typeof options === "undefined") {
      optionsToUse = markers;
    }
    if (isObject(optionsToUse)) {
      const algorithmOptions = isObject(optionsToUse.algorithmOptions) ? optionsToUse.algorithmOptions : {};
      if (isNumber(optionsToUse.maxZoom) || isNumberString(optionsToUse.maxZoom)) {
        algorithmOptions.maxZoom = getNumber(optionsToUse.maxZoom);
      }
      if (typeof algorithmOptions.maxZoom === "undefined") {
        algorithmOptions.maxZoom = 13;
      }
      if (isNumber(optionsToUse.radius) || isNumberString(optionsToUse.radius)) {
        algorithmOptions.radius = getNumber(optionsToUse.radius);
      }
      if (isNumber(optionsToUse.minPoints) || isNumberString(optionsToUse.minPoints)) {
        algorithmOptions.minPoints = getNumber(optionsToUse.minPoints);
      }
      if (typeof algorithmOptions.minPoints === "undefined") {
        algorithmOptions.minPoints = 3;
      }
      if (typeof optionsToUse.algorithm === "string") {
        switch (optionsToUse.algorithm) {
          case "grid":
            clusterOptions.algorithm = new import_markerclusterer2.GridAlgorithm(algorithmOptions);
            break;
          case "supercluster":
            clusterOptions.algorithm = new import_markerclusterer2.SuperClusterAlgorithm(algorithmOptions);
            break;
          case "noop":
            clusterOptions.algorithm = new import_markerclusterer2.NoopAlgorithm(algorithmOptions);
            break;
          default:
            if (Object.keys(algorithmOptions).length > 0) {
              clusterOptions.algorithm = new import_markerclusterer2.SuperClusterAlgorithm(algorithmOptions);
            }
            break;
        }
      } else if (typeof optionsToUse.algorithmClass !== "undefined") {
        clusterOptions.algorithm = optionsToUse.algorithmClass;
      }
      if (Object.keys(algorithmOptions).length > 0) {
        clusterOptions.algorithmOptions = algorithmOptions;
      }
      if (isFunction(optionsToUse.onClusterClick)) {
        clusterOptions.onClusterClick = optionsToUse.onClusterClick;
      }
      if (typeof optionsToUse.renderer !== "undefined") {
        clusterOptions.renderer = optionsToUse.renderer;
      } else if (isObject(optionsToUse.defaultRenderOptions)) {
        const renderer = new DefaultRenderer();
        const renderOptions = optionsToUse.defaultRenderOptions;
        if (isObject(renderOptions.colors)) {
          renderer.setColors(renderOptions.colors);
        }
        if (renderOptions.colorRangeTop) {
          renderer.setColorRangeTop(renderOptions.colorRangeTop);
        }
        if (renderOptions.colorRangeBottom) {
          renderer.setColorRangeBottom(renderOptions.colorRangeBottom);
        }
        if (typeof renderOptions.labelFontFamily === "string") {
          renderer.setFontFamily(renderOptions.labelFontFamily);
        }
        if (typeof renderOptions.labelFontSize !== "undefined") {
          renderer.setFontSize(renderOptions.labelFontSize);
        }
        if (typeof renderOptions.centerOpacity !== "undefined") {
          renderer.setCenterOpacity(renderOptions.centerOpacity);
        }
        if (typeof renderOptions.middleOpacity !== "undefined") {
          renderer.setMiddleOpacity(renderOptions.middleOpacity);
        }
        if (typeof renderOptions.outerOpacity !== "undefined") {
          renderer.setOuterOpacity(renderOptions.outerOpacity);
        }
        if (typeof renderOptions.showNumber !== "undefined") {
          renderer.setShowNumber(renderOptions.showNumber);
        }
        clusterOptions.renderer = renderer;
      } else if (isObject(optionsToUse.imageRendererOptions)) {
        const renderer = new ImageRenderer();
        renderer.setMap(map2);
        const renderOptions = optionsToUse.imageRendererOptions;
        if (typeof renderOptions.images !== "undefined") {
          renderer.setImages(renderOptions.images);
        } else if (typeof renderOptions.image !== "undefined") {
          renderer.setImage(renderOptions.image);
        }
        if (typeof renderOptions.labelClassName === "string") {
          renderer.setLabelClassName(renderOptions.labelClassName);
        }
        if (typeof renderOptions.labelColor === "string") {
          renderer.setLabelColor(renderOptions.labelColor);
        }
        if (typeof renderOptions.labelFontFamily === "string") {
          renderer.setLabelFontFamily(renderOptions.labelFontFamily);
        }
        if (typeof renderOptions.labelFontSize !== "undefined") {
          renderer.setLabelFontSize(renderOptions.labelFontSize);
        }
        if (typeof renderOptions.labelFontWeight === "string") {
          renderer.setLabelFontWeight(renderOptions.labelFontWeight);
        }
        if (typeof renderOptions.showNumber !== "undefined") {
          renderer.setShowNumber(renderOptions.showNumber);
        }
        clusterOptions.renderer = renderer;
      }
    } else {
      clusterOptions.renderer = new DefaultRenderer();
    }
    const clusterer = new import_markerclusterer2.MarkerClusterer(clusterOptions);
    this.#clusterer = clusterer;
    if (Array.isArray(markers)) {
      markers.forEach((marker2) => {
        if (marker2 instanceof Marker) {
          clusterer.addMarker(marker2.toGoogleSync(), true);
        }
      });
    }
  }
  /**
   * Adds a marker to the cluster
   *
   * @param {Marker} marker The marker to add to the cluster
   * @param {boolean} draw Whether to redraw the clusters after adding the marker.
   *      Default is true. Note, this is opposite of the MarkerClusterer library.
   * @returns {MarkerCluster}
   */
  addMarker(marker2, draw = true) {
    if (checkForGoogleMaps("MarkerCluster", "Marker", false)) {
      marker2.toGoogle().then((m) => {
        this.#clusterer?.addMarker(m, !draw);
      });
    } else {
      this.#pendingMarkers.push(marker2);
      loader().onMapLoad(() => {
        this.addMarkers(this.#pendingMarkers, draw);
        this.#pendingMarkers = [];
      });
    }
    return this;
  }
  /**
   * Add multiple markers to the cluster
   *
   * @param {Marker[]} markers The array of markers to add
   * @param {boolean} draw Whether to redraw the clusters after adding the marker.
   *      Default is true. Note, this is opposite of the MarkerClusterer library.
   * @returns {MarkerCluster}
   */
  addMarkers(markers, draw = true) {
    const add = (mks, drw = true) => {
      const markerPromises = [];
      mks.forEach((marker2) => {
        if (marker2 instanceof Marker) {
          markerPromises.push(marker2.toGoogle());
        }
      });
      Promise.all(markerPromises).then((googleMarkerObjects) => {
        this.#clusterer?.addMarkers(googleMarkerObjects, !drw);
      });
    };
    if (checkForGoogleMaps("MarkerCluster", "Marker", false)) {
      add(markers, draw);
    } else {
      markers.forEach((marker2) => {
        this.#pendingMarkers.push(marker2);
      });
      loader().onMapLoad(() => {
        add(this.#pendingMarkers, draw);
        this.#pendingMarkers = [];
      });
    }
    return this;
  }
  /**
   * Clears all of the markers
   *
   * @param {boolean} draw Whether to redraw the clusters after removing all the markers.
   *      Default is true. Note, this is opposite of the MarkerClusterer library.
   * @returns {MarkerCluster}
   */
  clearMarkers(draw = true) {
    this.#clusterer?.clearMarkers(!draw);
    return this;
  }
  /**
   * Removes a single marker from the cluster.
   *
   * @param {Marker} marker The marker to remove
   * @param {boolean} draw Whether to redraw the clusters after removing the marker.
   *      Default is true. Note, this is opposite of the MarkerClusterer library.
   * @returns {MarkerCluster}
   */
  removeMarker(marker2, draw = false) {
    this.#clusterer?.removeMarker(marker2.toGoogleSync(), !draw);
    return this;
  }
  /**
   * Force a recalculation and redraw of all the marker clusters.
   *
   * @returns {MarkerCluster}
   */
  render() {
    this.#clusterer?.render();
    return this;
  }
};
var markerCluster = (map2, markers, options) => new MarkerCluster(map2, markers, options);

// src/lib/MarkerCollection.ts
var defaultTag = "__default__";
var MarkerCollection = class _MarkerCollection {
  constructor() {
    /**
     * Holds the Marker objects by tag
     */
    this.markers = {};
  }
  /**
   * Adds an Marker to the collection
   *
   * @param {Marker} marker The Marker object to add
   * @param {string} tag The tag to assign the marker to.
   */
  #add(marker2, tag) {
    if (!this.markers[tag]) {
      this.markers[tag] = /* @__PURE__ */ new Set();
    }
    this.markers[tag].add(marker2);
  }
  /**
   * Adds an Marker to the collection
   *
   * @param {Marker} marker The Marker object to add
   * @param {string|string[]} [tag] The tag(s) to assign the marker to. Either a single tag or an array of tags can be passed.
   */
  add(marker2, tag) {
    if (isString(tag)) {
      this.#add(marker2, tag);
    } else if (Array.isArray(tag) && tag.length > 0) {
      tag.forEach((t) => {
        if (isString(t)) {
          this.#add(marker2, t);
        }
      });
    } else {
      this.#add(marker2, defaultTag);
    }
  }
  /**
   * Clears the collection
   *
   * This also hides all the markers in the collection.
   */
  clear() {
    this.hideAll();
    this.markers = {};
  }
  /**
   * Clone the collection
   *
   * @returns {MarkerCollection}
   */
  clone() {
    const clone = new _MarkerCollection();
    Object.keys(this.markers).forEach((tag) => {
      this.markers[tag].forEach((m) => {
        clone.add(m, tag);
      });
    });
    return clone;
  }
  /**
   * Returns true if the collection has any markers
   *
   * @returns {boolean}
   */
  hasData() {
    return Object.keys(this.markers).length > 0;
  }
  /**
   * Hide the Markers in the collection that have the tag passed
   *
   * @param {string} tag The tag to hide markers for.
   */
  #hide(tag) {
    if (this.markers[tag]) {
      this.markers[tag].forEach((marker2) => {
        marker2.hide();
      });
    }
  }
  /**
   * Hide the Markers in the collection that have the tag(s) passed
   *
   * @param {string|string[]} tag The tag(s) to hide markers for. Either a single tag string or an array of tag strings can be passed.
   */
  hide(tag) {
    if (isString(tag)) {
      this.#hide(tag);
    } else if (Array.isArray(tag)) {
      tag.forEach((t) => {
        if (isString(t)) {
          this.#hide(t);
        }
      });
    }
  }
  /**
   * Hides all the Markers in the collection
   */
  hideAll() {
    Object.keys(this.markers).forEach((tag) => {
      this.markers[tag].forEach((marker2) => {
        marker2.hide();
      });
    });
  }
  /**
   * Returns true if the collection has no markers
   *
   * @returns {boolean}
   */
  isEmpty() {
    return Object.keys(this.markers).length === 0;
  }
  /**
   * Remove the marker from the collection by tag.
   *
   * @param {Marker} marker The marker object to remove
   * @param {string} tag The tag to remove the marker from.
   */
  #removeByTag(marker2, tag) {
    if (this.markers[tag]) {
      this.markers[tag].delete(marker2);
    }
  }
  /**
   * Remove the marker from the collection, optionally by tag.
   *
   * @param {Marker} marker The marker object to remove
   * @param {string|string[]} [tag] The tag(s) to remove the marker from. If not set then the marker is removed from all tags.
   *      Either a single tag string or an array of tag strings can be passed.
   */
  remove(marker2, tag) {
    if (isString(tag)) {
      this.#removeByTag(marker2, tag);
    } else if (Array.isArray(tag) && tag.length > 0) {
      tag.forEach((t) => {
        if (isString(t)) {
          this.#removeByTag(marker2, t);
        }
      });
    } else {
      Object.keys(this.markers).forEach((t) => {
        this.markers[t].delete(marker2);
      });
    }
  }
  /**
   * Show the Markers in the collection that have the tag(s) passed
   *
   * @param {string} tag The tag to show markers for.
   * @param {Map} map The map object
   */
  #show(tag, map2) {
    if (this.markers[tag]) {
      this.markers[tag].forEach((marker2) => {
        marker2.show(map2);
      });
    }
  }
  /**
   * Show the Markers in the collection that have the tag(s) passed
   *
   * @param {string|string[]} tag The tag(s) to show markers for. Either a single tag string or an array of tag strings can be passed.
   * @param {Map} [map] The map object
   */
  show(tag, map2) {
    if (isString(tag)) {
      this.#show(tag, map2);
    } else if (Array.isArray(tag)) {
      tag.forEach((t) => {
        if (isString(t)) {
          this.#show(t, map2);
        }
      });
    }
  }
  /**
   * Show all the Markers in the collection
   *
   * @param {Map} map The map object
   */
  showAll(map2) {
    Object.keys(this.markers).forEach((tag) => {
      this.markers[tag].forEach((marker2) => {
        marker2.show(map2);
      });
    });
  }
};
var markerCollection = () => new MarkerCollection();

// src/lib/Overlay.ts
var Overlay = class extends Layer_default {
  /**
   * Constructor
   *
   * @param {string} objectType The object type for the class
   * @param {string} testObject The object that needs Google maps. This should be the name of the object that calls this method.
   * @param {string} [testLibrary] An optional Google maps library class to check for. This needs to be part of the google.maps object.
   */
  constructor(objectType, testObject, testLibrary) {
    super(objectType, testObject, testLibrary || "OverlayView");
    /**
     * Whether dragging is enabled for this overlay
     *
     * @private
     * @type {boolean}
     */
    this.#drag = false;
    /**
     * Whether the overlay is currently being dragged
     *
     * @private
     * @type {boolean}
     */
    this.#isDragging = false;
    /**
     * Whether the overlay is currently being resized
     *
     * @private
     * @type {boolean}
     */
    this.#isResizing = false;
    /**
     * Whether resizing is enabled for this overlay
     *
     * @private
     * @type {boolean}
     */
    this.#resize = false;
    /**
     * The aspect ratio to maintain during resizing (width / height)
     *
     * @private
     * @type {number}
     */
    this.#resizeAspectRatio = 0;
    /**
     * The corner being resized (nw, ne, sw, se)
     *
     * @protected
     * @type {string}
     */
    this.resizeCorner = "";
    /**
     * The resize handles
     *
     * @private
     * @type {HTMLElement[]}
     */
    this.#resizeHandles = [];
    /**
     * Holds the styles for the overlay.
     *
     * @private
     * @type {object}
     */
    this.#styles = {};
    /**
     * Handle drag start
     *
     * @private
     * @param {MouseEvent | TouchEvent} e The event
     */
    this.#handleDragStart = (e) => {
      if (!this.#drag || this.#isResizing) return;
      e.preventDefault();
      e.stopPropagation();
      this.#isDragging = true;
      this.#dragStart = point(
        e instanceof MouseEvent ? [e.clientX, e.clientY] : [e.touches[0].clientX, e.touches[0].clientY]
      );
      this.#overlayStart = point(
        parseInt(this.#overlay.style.left, 10) || 0,
        parseInt(this.#overlay.style.top, 10) || 0
      );
      document.addEventListener("mousemove", this.#handleDrag);
      document.addEventListener("mouseup", this.#handleDragEnd);
      document.addEventListener("touchmove", this.#handleDrag);
      document.addEventListener("touchend", this.#handleDragEnd);
      this.dispatch(OverlayEvents.DRAG_START, { event: e });
    };
    /**
     * Handle drag
     *
     * @private
     * @param {MouseEvent | TouchEvent} e The event
     */
    this.#handleDrag = (e) => {
      if (!this.#isDragging) return;
      e.preventDefault();
      const currentPos = point(
        e instanceof MouseEvent ? [e.clientX, e.clientY] : [e.touches[0].clientX, e.touches[0].clientY]
      );
      const delta = currentPos.subtract(this.#dragStart);
      const newLeft = this.#overlayStart.getX() + delta.getX();
      const newTop = this.#overlayStart.getY() + delta.getY();
      this.#overlay.style.left = `${newLeft}px`;
      this.#overlay.style.top = `${newTop}px`;
      this.updateBoundsFromPosition();
      this.dispatch(OverlayEvents.DRAG, { event: e, delta });
    };
    /**
     * Handle drag end
     *
     * @private
     * @param {MouseEvent | TouchEvent} e The event
     */
    this.#handleDragEnd = (e) => {
      if (!this.#isDragging) return;
      this.#isDragging = false;
      document.removeEventListener("mousemove", this.#handleDrag);
      document.removeEventListener("mouseup", this.#handleDragEnd);
      document.removeEventListener("touchmove", this.#handleDrag);
      document.removeEventListener("touchend", this.#handleDragEnd);
      this.dispatch(OverlayEvents.DRAG_END, { event: e });
    };
    /**
     * Handle resize start
     *
     * @private
     * @param {MouseEvent | TouchEvent} e The event
     * @param {string} corner The corner being resized
     */
    this.#handleResizeStart = (e, corner) => {
      if (!this.#resize || this.#isDragging) return;
      e.preventDefault();
      e.stopPropagation();
      const mapContainer = this.getMap()?.getDiv();
      const currentBounds = this.getBounds();
      const neBounds = currentBounds?.getNorthEast();
      const swBounds = currentBounds?.getSouthWest();
      if (!mapContainer || !neBounds || !swBounds) return;
      this.#isResizing = true;
      this.resizeCorner = corner;
      const containerRect = mapContainer.getBoundingClientRect();
      const currentSize = this.#overlay.getBoundingClientRect();
      this.resizeStart = {
        // Northeast lat/lng
        neBounds,
        // Current top left position of the overlay within the map container.
        // This is used to calculate the new position of the overlay after resizing from the top left.
        nwPos: { x: currentSize.left - containerRect.left, y: currentSize.top - containerRect.top },
        // Southwest lat/lng
        swBounds,
        // Current bottom right position of the overlay within the map container.
        // This is used to calculate the new position of the overlay after resizing from the bottom right.
        sePos: { x: currentSize.right - containerRect.left, y: currentSize.bottom - containerRect.top },
        // Current left position within the overlay container
        left: parseInt(this.#overlay.style.left, 10) || 0,
        // Current top position within the overlay container
        top: parseInt(this.#overlay.style.top, 10) || 0,
        // Current width of the overlay container
        width: currentSize.width,
        // Current height of the overlay container
        height: currentSize.height
      };
      document.addEventListener("mousemove", this.#handleResize);
      document.addEventListener("mouseup", this.#handleResizeEnd);
      document.addEventListener("touchmove", this.#handleResize);
      document.addEventListener("touchend", this.#handleResizeEnd);
      this.dispatch(OverlayEvents.RESIZE_START, { event: e, corner });
    };
    /**
     * Handle resize
     *
     * @private
     * @param {MouseEvent | TouchEvent} e The event
     */
    this.#handleResize = (e) => {
      if (!this.#isResizing) return;
      e.preventDefault();
      const projection = this.getProjection();
      const mapContainer = this.getMap()?.getDiv();
      if (projection && mapContainer) {
        const containerRect = mapContainer.getBoundingClientRect();
        const eventX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        const eventY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        const mouseX = eventX - containerRect.left;
        const mouseY = eventY - containerRect.top;
        const neGoogle = this.resizeStart.neBounds.toGoogle();
        const topRight = neGoogle ? projection.fromLatLngToContainerPixel(neGoogle) : null;
        const swGoogle = this.resizeStart.swBounds.toGoogle();
        const bottomLeft = swGoogle ? projection.fromLatLngToContainerPixel(swGoogle) : null;
        let newWidth;
        let newHeight;
        let newLeft;
        let newTop;
        if (this.resizeCorner === "nw") {
          if (!bottomLeft || !topRight || mouseY > bottomLeft.y || mouseX > topRight.x) {
            return;
          }
          const diffX = this.resizeStart.nwPos.x - mouseX;
          const diffY = this.resizeStart.nwPos.y - mouseY;
          newWidth = this.resizeStart.width + diffX;
          newHeight = this.resizeStart.height + diffY;
          newLeft = this.resizeStart.left - diffX;
          newTop = this.resizeStart.top - diffY;
        } else if (this.resizeCorner === "ne") {
          if (!bottomLeft || !topRight || mouseY > bottomLeft.y || mouseX < bottomLeft.x) {
            return;
          }
          const diffX = topRight.x - mouseX;
          const diffY = topRight.y - mouseY;
          newWidth = this.resizeStart.width - diffX;
          newHeight = this.resizeStart.height + diffY;
          newLeft = this.resizeStart.left;
          newTop = this.resizeStart.top - diffY;
        } else if (this.resizeCorner === "sw") {
          if (!bottomLeft || !topRight || mouseY < this.resizeStart.top || mouseX > topRight.x) {
            return;
          }
          const diffX = bottomLeft.x - mouseX;
          const diffY = bottomLeft.y - mouseY;
          newWidth = this.resizeStart.width + diffX;
          newHeight = this.resizeStart.height - diffY;
          newLeft = this.resizeStart.left - diffX;
          newTop = this.resizeStart.top;
        } else if (this.resizeCorner === "se") {
          if (mouseY < this.resizeStart.top || mouseX < this.resizeStart.left) {
            return;
          }
          const diffX = this.resizeStart.sePos.x - mouseX;
          const diffY = this.resizeStart.sePos.y - mouseY;
          newWidth = this.resizeStart.width - diffX;
          newHeight = this.resizeStart.height - diffY;
          newLeft = this.resizeStart.left;
          newTop = this.resizeStart.top;
        } else {
          return;
        }
        const constrained = calculateDimensions(this.#resizeAspectRatio, newWidth, newHeight);
        this.#overlay.style.width = `${constrained.width}px`;
        this.#overlay.style.height = `${constrained.height}px`;
        this.#overlay.style.left = `${newLeft}px`;
        this.#overlay.style.top = `${newTop}px`;
        if (this.#resizeAspectRatio > 0) {
          const newContainerRect = this.#overlay.getBoundingClientRect();
          const mapContainerRect = mapContainer.getBoundingClientRect();
          const nePos = {
            x: newContainerRect.right - mapContainerRect.left,
            y: newContainerRect.top - mapContainerRect.top
          };
          const swPos = {
            x: newContainerRect.left - mapContainerRect.left,
            y: newContainerRect.bottom - mapContainerRect.top
          };
          const neLatLng = this.getContainerLatLngFromPixel(nePos.x, nePos.y);
          const swLatLng = this.getContainerLatLngFromPixel(swPos.x, swPos.y);
          this.setBoundsFromResize(neLatLng, swLatLng);
        } else {
          const newLatLng = this.getContainerLatLngFromPixel(mouseX, mouseY);
          this.updateBoundsFromResize(newLatLng);
        }
        this.dispatch(OverlayEvents.RESIZE, { event: e, corner: this.resizeCorner });
      }
    };
    /**
     * Handle resize end
     *
     * @private
     * @param {MouseEvent | TouchEvent} e The event
     */
    this.#handleResizeEnd = (e) => {
      if (!this.#isResizing) return;
      this.#isResizing = false;
      this.resizeCorner = "";
      document.removeEventListener("mousemove", this.#handleResize);
      document.removeEventListener("mouseup", this.#handleResizeEnd);
      document.removeEventListener("touchmove", this.#handleResize);
      document.removeEventListener("touchend", this.#handleResizeEnd);
      this.dispatch(OverlayEvents.RESIZE_END, { event: e });
    };
    this.#overlay = document.createElement("div");
    this.#overlay.style.position = "absolute";
    this.#overlay.style.pointerEvents = "auto";
    this.#overlay.style.zIndex = "1000";
    this.setOffset([0, 0]);
  }
  #drag;
  /**
   * The starting position when dragging begins
   *
   * @private
   * @type {Point}
   */
  #dragStart;
  #isDragging;
  #isResizing;
  /**
   * Holds the offset for the overlay
   *
   * @private
   * @type {Point}
   */
  #offset;
  /**
   * Holds the overlay HTML element. This is the container element that the
   * content for the overlay will get displayed in.
   * That could be a tooltip, a custom info window (popup), or a map overlay.
   *
   * private
   *
   * @type {HTMLElement}
   */
  #overlay;
  /**
   * The starting overlay position when dragging begins
   *
   * @private
   * @type {Point}
   */
  #overlayStart;
  /**
   * Holds the overlay view class instance
   *
   * @private
   * @type {google.maps.OverlayView|undefined}
   */
  #overlayView;
  /**
   * Holds the position of the overlay
   *
   * @private
   * @type {LatLng|undefined}
   */
  #position;
  #resize;
  #resizeAspectRatio;
  #resizeHandles;
  #styles;
  /**
   * Get the class name for the overlay element
   *
   * @returns {string}
   */
  get className() {
    return this.#overlay.className;
  }
  /**
   * Set the class name(s) for the overlay element
   *
   * If you need multiple class names then separate them with a space.
   *
   * @param {string} className The class name(s) to add to the overlay.
   *    This can be a space separated list of class names.
   */
  set className(className) {
    if (isString(className)) {
      const classes = className.split(" ");
      classes.forEach((cn) => {
        this.#overlay.classList.add(cn.trim());
      });
    } else if (isNullOrUndefined(className)) {
      this.#overlay.className = "";
    }
  }
  /**
   * Returns whether dragging is enabled
   *
   * @returns {boolean}
   */
  get drag() {
    return this.#drag;
  }
  /**
   * Set whether dragging is enabled
   *
   * @param {boolean} drag Whether dragging is enabled
   */
  set drag(drag) {
    if (isBoolean(drag)) {
      this.#drag = drag;
      this.#setupDragHandlers();
    }
  }
  /**
   * Returns the offset value
   *
   * @returns {Point}
   */
  get offset() {
    return this.getOffset();
  }
  /**
   * Set the x,y offset for the overlay
   *
   * This lets you have the offset show a certain number of pixels from it's lat/lng position.
   *
   * @param {PointValue} value The offset value
   */
  set offset(value) {
    const pointValue = point(value);
    if (pointValue.isValid()) {
      this.#offset = pointValue;
    }
  }
  /**
   * Returns the position of the overlay
   *
   * @returns {LatLng|undefined}
   */
  get position() {
    return this.#position;
  }
  /**
   * Set the position of the overlay
   *
   * @param {LatLngValue|undefined} value The position of the overlay. Pass undefined to clear the position.
   */
  set position(value) {
    const position = latLng(value);
    if (position.isValid()) {
      this.#position = position;
    } else if (isNullOrUndefined(value)) {
      this.#position = void 0;
    }
  }
  /**
   * Returns whether resizing is enabled
   *
   * @returns {boolean}
   */
  get resize() {
    return this.#resize;
  }
  /**
   * Set whether resizing is enabled
   *
   * @param {boolean} resize Whether resizing is enabled
   */
  set resize(resize) {
    if (isBoolean(resize)) {
      this.#resize = resize;
      this.#setupResizeHandlers();
    }
  }
  /**
   * Returns the styles for the overlay element
   *
   * @returns {object}
   */
  get styles() {
    return this.#styles;
  }
  /**
   * Set multiple styles for the overlay element
   *
   * @param {object} styles The styles to apply to the overlay element
   */
  set styles(styles) {
    if (isObject(styles)) {
      Object.keys(styles).forEach((key) => {
        this.style(key, styles[key]);
      });
    }
  }
  /**
   * Disable dragging for this overlay
   *
   * @returns {Overlay}
   */
  disableDrag() {
    this.drag = false;
    this.trigger(OverlayEvents.DRAGGABLE_CHANGED, {
      draggable: this.drag
    });
    return this;
  }
  /**
   * Disable resizing for this overlay
   *
   * @returns {Overlay}
   */
  disableResize() {
    this.resize = false;
    return this;
  }
  /**
   * Display the overlay on the map
   *
   * Alias to show()
   *
   * @param {Map} map The Map object
   * @returns {Promise<Overlay>}
   */
  display(map2) {
    return this.show(map2);
  }
  /**
   * Enable dragging for this overlay
   *
   * @returns {Overlay}
   */
  enableDrag() {
    this.drag = true;
    this.trigger(OverlayEvents.DRAGGABLE_CHANGED, {
      draggable: this.drag
    });
    return this;
  }
  /**
   * Enable resizing for this overlay
   *
   * @returns {Overlay}
   */
  enableResize() {
    this.resize = true;
    return this;
  }
  /**
   * Get the bounds where the overlay should be displayed
   *
   * This method should be overridden by subclasses and not called directly.
   *
   * @returns {LatLngBounds|undefined}
   */
  // eslint-disable-next-line class-methods-use-this
  getBounds() {
    return new LatLngBounds({
      ne: latLng(),
      sw: latLng()
    });
  }
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
  getContainerLatLngFromPixel(x, y) {
    const gp = new google.maps.Point(x, y);
    const pixel = point(gp);
    const projection = this.getProjection();
    if (projection) {
      return latLng(projection.fromContainerPixelToLatLng(pixel.toGoogle()) ?? void 0);
    }
    return latLng();
  }
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
  getDivLatLngFromPixel(x, y) {
    const gp = new google.maps.Point(x, y);
    const pixel = point(gp);
    const projection = this.getProjection();
    if (projection) {
      return latLng(projection.fromDivPixelToLatLng(pixel.toGoogle()) ?? void 0);
    }
    return latLng();
  }
  /**
   * Get the offset value
   *
   * @returns {Point}
   */
  getOffset() {
    return this.#offset;
  }
  /**
   * Get the overlay HTML element
   *
   * @returns {HTMLElement}
   */
  getOverlayElement() {
    return this.#overlay;
  }
  /**
   * Get the position of the overlay
   *
   * @returns {LatLng|undefined}
   */
  getPosition() {
    return this.position;
  }
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
  getProjection() {
    return this.#overlayView?.getProjection();
  }
  /**
   * Get the current aspect ratio for resizing
   *
   * @returns {number}
   */
  getResizeAspectRatio() {
    return this.#resizeAspectRatio;
  }
  /**
   * Returns whether the overlay has a position
   *
   * @returns {boolean}
   */
  hasPosition() {
    return this.#position instanceof LatLng;
  }
  /**
   * Hide the overlay
   *
   * @returns {Overlay}
   */
  hide() {
    if (this.#overlayView) {
      this.#overlayView.setMap(null);
      this.removeMap();
      this.isVisible = false;
    }
    return this;
  }
  /**
   * Returns whether the overlay is draggable
   *
   * @returns {boolean}
   */
  isDraggable() {
    return this.drag;
  }
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
  move(position, map2) {
    return new Promise((resolve, reject) => {
      let mapObject = map2;
      if (typeof mapObject === "undefined") {
        mapObject = this.getMap() ?? void 0;
      }
      this.position = position;
      if (mapObject instanceof Map) {
        if (this.#overlayView) {
          this.#overlayView.setMap(mapObject.toGoogle() ?? null);
          this.isVisible = true;
          super.setMap(mapObject);
          this.dispatch(OverlayEvents.OPEN);
          resolve(this);
        } else {
          this.show(mapObject).then(() => {
            this.dispatch(OverlayEvents.OPEN);
            resolve(this);
          });
        }
      } else {
        reject(new Error("Map object is not set"));
      }
    });
  }
  /**
   * Add an event listener for when dragging ends
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onDragEnd(callback) {
    this.on(OverlayEvents.DRAG_END, callback);
  }
  /**
   * Add an event listener for when dragging updates the overlay position
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onDrag(callback) {
    this.on(OverlayEvents.DRAG, callback);
  }
  /**
   * Add an event listener for when the overlay draggable property changes
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onDraggableChanged(callback) {
    this.on(OverlayEvents.DRAGGABLE_CHANGED, callback);
  }
  /**
   * Add an event listener for when dragging the overlay starts
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onDragStart(callback) {
    this.on(OverlayEvents.DRAG_START, callback);
  }
  /**
   * Add an event listener for when the overlay is opened.
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onOpen(callback) {
    this.on(OverlayEvents.OPEN, callback);
  }
  /**
   * Add an event listener for when resizing ends
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onResizeEnd(callback) {
    this.on(OverlayEvents.RESIZE_END, callback);
  }
  /**
   * Add an event listener for when resizing updates the overlay position
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onResize(callback) {
    this.on(OverlayEvents.RESIZE, callback);
  }
  /**
   * Add an event listener for when resizing the overlay starts
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onResizeStart(callback) {
    this.on(OverlayEvents.RESIZE_START, callback);
  }
  /**
   * Removes a class name from the overlay element
   *
   * @param {string} className The class name to remove from the overlay element
   * @returns {Overlay}
   */
  removeClassName(className) {
    const classes = className.split(" ");
    classes.forEach((cn) => {
      this.#overlay.classList.remove(cn.trim());
    });
    return this;
  }
  /**
   * Set the class name(s) for the overlay element
   *
   * If you need multiple class names then separate them with a space.
   *
   * @param {string} className The class name(s) to add to the overlay.
   *    This can be a space separated list of class names.
   * @returns {Overlay}
   */
  setClassName(className) {
    this.className = className;
    return this;
  }
  /**
   * Set the map object to display the overlay in
   *
   * Alias to show()
   *
   * @param {Map} map The Map object
   * @returns {Promise<Overlay>}
   */
  setMap(map2) {
    return this.show(map2);
  }
  /**
   * Set the x,y offset for the overlay
   *
   * This lets you have the offset show a certain number of pixels from it's lat/lng position.
   *
   * @param {PointValue} offset The offset value
   * @returns {Overlay}
   */
  setOffset(offset) {
    this.offset = offset;
    return this;
  }
  /**
   * Set the position of the overlay
   *
   * @param {LatLngValue|undefined} position The latitude/longitude position of where the overlay should show.
   *    Pass undefined to clear the position.
   * @returns {Overlay}
   */
  setPosition(position) {
    this.position = position;
    return this;
  }
  /**
   * Set the aspect ratio to maintain during resizing
   *
   * @param {number} aspectRatio The aspect ratio (width / height)
   * @returns {Overlay}
   */
  setResizeAspectRatio(aspectRatio) {
    if (isNumber(aspectRatio) && aspectRatio > 0) {
      this.#resizeAspectRatio = aspectRatio;
    }
    return this;
  }
  /**
   * Set one more styles for the overlay element. This will merge styles with an existing ones.
   *
   * @param {object} styles The styles to apply to the overlay element
   * @returns {Overlay}
   */
  setStyles(styles) {
    this.styles = styles;
    return this;
  }
  /**
   * Add the overlay to the map.
   *
   * Alias for setMap()
   *
   * @param {Map} map The Map object
   * @returns {Promise<Overlay>}
   */
  show(map2) {
    return new Promise((resolve) => {
      if (map2 instanceof Map) {
        this.#setupGoogleOverlay();
        if (this.#overlayView) {
          this.#overlayView.setMap(map2.toGoogle() ?? null);
          this.isVisible = true;
          super.setMap(map2);
          this.dispatch(OverlayEvents.OPEN);
          resolve(this);
        } else {
          loader().onMapLoad(() => {
            this.#setupGoogleOverlay();
            if (this.#overlayView) {
              this.#overlayView.setMap(map2.toGoogle() ?? null);
              this.isVisible = true;
            }
            super.setMap(map2);
            this.dispatch(OverlayEvents.OPEN);
            resolve(this);
          });
        }
      } else {
        this.dispatch(OverlayEvents.OPEN);
        resolve(this);
      }
    });
  }
  /**
   * Set a single style on the overlay element
   *
   * @param {string} name The style name
   * @param {string} value The style value
   * @returns {Overlay}
   */
  style(name, value) {
    if (isString(name) && isString(value)) {
      this.#styles[name] = value;
      this.#overlay.style[name] = value;
    }
    return this;
  }
  /**
   * Toggle the display of the overlay on the map
   *
   * @param {Map} map The map object
   * @returns {void}
   */
  toggle(map2) {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show(map2);
    }
  }
  /**
   * Set up drag event handlers
   *
   * @private
   */
  #setupDragHandlers() {
    if (this.#drag) {
      this.#overlay.style.cursor = "move";
      this.#overlay.style.pointerEvents = "auto";
      this.#overlay.style.border = "2px solid #007bff";
      this.#overlay.addEventListener("mousedown", this.#handleDragStart);
      this.#overlay.addEventListener("touchstart", this.#handleDragStart);
      if (checkForGoogleMaps("Overlay", "OverlayView", false)) {
        google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.#overlay);
      }
    } else {
      this.#overlay.style.cursor = "";
      this.#overlay.style.pointerEvents = "";
      this.#overlay.removeEventListener("mousedown", this.#handleDragStart);
      this.#overlay.removeEventListener("touchstart", this.#handleDragStart);
    }
  }
  /**
   * Set up resize event handlers
   *
   * @private
   */
  #setupResizeHandlers() {
    if (this.#resize) {
      this.#createResizeHandles();
    } else {
      this.#removeResizeHandles();
    }
  }
  /**
   * Create resize handles
   *
   * @private
   */
  #createResizeHandles() {
    this.#removeResizeHandles();
    this.#overlay.style.border = "2px solid #007bff";
    const corners = ["nw", "ne", "sw", "se"];
    const cursors = {
      nw: "nwse-resize",
      ne: "nesw-resize",
      sw: "nesw-resize",
      se: "nwse-resize"
    };
    corners.forEach((corner) => {
      const handle = document.createElement("div");
      handle.className = `resize-handle resize-${corner}`;
      handle.style.cssText = `
                position: absolute;
                width: 12px;
                height: 12px;
                background: #fff;
                border: 2px solid #007bff;
                border-radius: 50%;
                cursor: ${cursors[corner]};
                z-index: 1000;
                pointer-events: auto;
            `;
      switch (corner) {
        case "nw":
          handle.style.top = "-6px";
          handle.style.left = "-6px";
          break;
        case "ne":
          handle.style.top = "-6px";
          handle.style.right = "-6px";
          break;
        case "sw":
          handle.style.bottom = "-6px";
          handle.style.left = "-6px";
          break;
        case "se":
          handle.style.bottom = "-6px";
          handle.style.right = "-6px";
          break;
        default:
          handle.style.top = "-6px";
          handle.style.left = "-6px";
          break;
      }
      handle.addEventListener("mousedown", (e) => this.#handleResizeStart(e, corner));
      handle.addEventListener("touchstart", (e) => this.#handleResizeStart(e, corner));
      if (checkForGoogleMaps("Overlay", "OverlayView", false)) {
        google.maps.OverlayView.preventMapHitsAndGesturesFrom(handle);
      }
      this.#overlay.appendChild(handle);
      this.#resizeHandles.push(handle);
    });
  }
  /**
   * Remove resize handles
   *
   * @private
   */
  #removeResizeHandles() {
    this.#resizeHandles.forEach((handle) => {
      if (handle.parentNode) {
        handle.parentNode.removeChild(handle);
      }
    });
    this.#resizeHandles = [];
    this.#overlay.style.border = "none";
  }
  #handleDragStart;
  #handleDrag;
  #handleDragEnd;
  #handleResizeStart;
  #handleResize;
  #handleResizeEnd;
  /**
   * Update bounds from current position
   *
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  updateBoundsFromPosition() {
  }
  /**
   * Update bounds from resize
   *
   * @protected
   * @param {LatLng} neLatLng The new lat/lng position for the northeast corner
   * @param {LatLng} swLatLng The new lat/lng position for the southwest corner
   */
  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  setBoundsFromResize(neLatLng, swLatLng) {
  }
  /**
   * Update bounds from resize
   *
   * @protected
   * @param {LatLng} newLatLng The new lat/lng position
   */
  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-unused-vars
  updateBoundsFromResize(newLatLng) {
  }
  /**
   * Set up the Google maps overlay object if necessary
   *
   * @private
   */
  #setupGoogleOverlay() {
    if (!isObject(this.#overlayView)) {
      if (checkForGoogleMaps("Overlay", "OverlayView", false)) {
        this.#overlayView = getOverlayViewClass(this);
        google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.#overlay);
      }
    }
  }
  /**
   * Add the overlay to the map. Called once after setMap() is called on the overlay with a valid map.
   *
   * This is called by the internal OverlayView class. It should not be called directly.
   *
   * @internal
   * @param {google.maps.MapPanes} panes The Google maps panes object
   */
  add(panes) {
  }
  // eslint-disable-line class-methods-use-this, @typescript-eslint/no-unused-vars
  /**
   * Draw the overlay. Called when the overlay is being drawn or updated.
   *
   * This is called by the internal OverlayView class. It should not be called directly.
   *
   * @internal
   * @param {google.maps.MapCanvasProjection} projection The Google maps projection object
   */
  draw(projection) {
  }
  // eslint-disable-line class-methods-use-this, @typescript-eslint/no-unused-vars
  /**
   * Remove the overlay from the map.
   * This method is called once following a call to setMap(null).
   *
   * This is called by the internal OverlayView class. It should not be called directly.
   *
   * @internal
   */
  remove() {
    if (this.#overlay.parentElement) {
      this.#overlay.parentElement.removeChild(this.#overlay);
    }
  }
};
var getOverlayViewClass = (classObject) => {
  class OverlayView extends google.maps.OverlayView {
    /**
     * Holds the class instance for this overlay
     *
     * @private
     * @type {Overlay}
     */
    #overlay;
    /**
     * Constructor
     *
     * @param {Overlay} overlay The overlay class instance
     */
    constructor(overlay2) {
      super();
      this.#overlay = overlay2;
    }
    /**
     * Called when the overlay is being drawn or updated. Use the position
     * from projection.fromLatLngToDivPixel() to correctly position the overlay
     * relative to the MapPanes. This method is called after onAdd(), and is
     * called on change of zoom or center.
     */
    draw() {
      this.#overlay.draw(this.getProjection());
    }
    /**
     * Called once after setMap() is called with a valid map. At this point,
     * panes and projection will have been initialized. Used to initialize the overlay DOM elements.
     */
    onAdd() {
      this.#overlay.add(this.getPanes());
    }
    /**
     * This method is called once following a call to setMap(null).
     * Used to remove the overlay from the map.
     */
    onRemove() {
      this.#overlay.remove();
    }
  }
  return new OverlayView(classObject);
};
var overlay = () => new Overlay("overlay", "OverlayView");

// src/lib/OverlayAttachment.ts
var attachmentStates = {};
var getState = (layer, adapter) => {
  if (!attachmentStates[adapter.kind]) {
    attachmentStates[adapter.kind] = /* @__PURE__ */ new WeakMap();
  }
  const states = attachmentStates[adapter.kind];
  let state = states.get(layer);
  if (!state) {
    state = { features: /* @__PURE__ */ new WeakMap(), listeners: {} };
    states.set(layer, state);
  }
  return state;
};
var overlayFromCallback = (base, value, adapter) => {
  if (adapter.isOverlay(value)) {
    return value;
  }
  if (isString(value) || value instanceof HTMLElement || value instanceof Text) {
    base.setContent(value);
  } else if (isObject(value)) {
    base.setOptions(value);
  }
  return base;
};
var buildConfig = (value, event, adapter) => {
  let callback;
  let template;
  let overlay2;
  if (isFunction(value)) {
    overlay2 = adapter.create({ content: "" });
    callback = value;
  } else {
    overlay2 = adapter.create(value);
    const { content } = overlay2;
    if (isString(content)) {
      template = content;
    }
  }
  overlay2.event = event;
  return { callback, event, overlay: overlay2, template };
};
var getOverlay = (config, feature, adapter) => {
  if (isFunction(config.callback)) {
    return overlayFromCallback(config.overlay, config.callback(feature), adapter);
  }
  if (isString(config.template)) {
    config.overlay.setContent(renderTemplate(config.template, (key) => feature.getProperty(key)));
  }
  return config.overlay;
};
var showOverlay = (config, feature, position, adapter, openOverlay) => {
  const { map: map2 } = feature.getLayer();
  if (!(map2 instanceof Map) || !position) {
    return void 0;
  }
  const overlay2 = getOverlay(config, feature, adapter);
  if (openOverlay && openOverlay !== overlay2) {
    openOverlay.hide();
  }
  if (adapter.resetBeforeShow) {
    overlay2.hide();
  }
  overlay2.setPosition(position);
  overlay2.show(map2);
  return overlay2;
};
var handleEvent = (layer, type, event, adapter) => {
  const state = attachmentStates[adapter.kind]?.get(layer);
  const { feature } = event;
  if (!state || !(feature instanceof DataFeature)) {
    return;
  }
  const config = state.features.get(feature) || state.layerConfig;
  if (!config) {
    return;
  }
  if (type === "mouseover") {
    if (config.event === "hover") {
      const shown = showOverlay(config, feature, event.latLng, adapter, state.openOverlay);
      if (shown) {
        state.openFeature = feature;
        state.openOverlay = shown;
      }
    }
  } else if (type === "mouseout") {
    if (config.event === "hover" && state.openOverlay) {
      state.openOverlay.hide();
      state.openFeature = void 0;
      state.openOverlay = void 0;
    }
  } else if (config.event !== "hover") {
    if (config.event === "click" && state.openOverlay?.isVisible && state.openFeature === feature) {
      state.openOverlay.hide();
      state.openFeature = void 0;
      state.openOverlay = void 0;
      return;
    }
    const shown = showOverlay(config, feature, event.latLng, adapter, state.openOverlay);
    if (shown) {
      state.openFeature = feature;
      state.openOverlay = shown;
    }
  }
};
var setupListeners = (layer, event, adapter) => {
  const state = getState(layer, adapter);
  if (event !== "hover" && !state.listeners.click) {
    state.listeners.click = true;
    layer.onClick((e) => {
      handleEvent(layer, "click", e, adapter);
    });
  }
  if (event === "hover" && !state.listeners.hover) {
    state.listeners.hover = true;
    layer.onMouseOver((e) => {
      handleEvent(layer, "mouseover", e, adapter);
    });
    layer.onMouseOut((e) => {
      handleEvent(layer, "mouseout", e, adapter);
    });
  }
};
var attachToDataLayer = (layer, value, event, adapter) => {
  const triggerEvent = event || adapter.defaultEvent;
  const config = buildConfig(value, triggerEvent, adapter);
  getState(layer, adapter).layerConfig = config;
  setupListeners(layer, triggerEvent, adapter);
  return config.overlay;
};
var attachToDataFeature = (feature, value, event, adapter) => {
  const triggerEvent = event || adapter.defaultEvent;
  const config = buildConfig(value, triggerEvent, adapter);
  const layer = feature.getLayer();
  getState(layer, adapter).features.set(feature, config);
  setupListeners(layer, triggerEvent, adapter);
  return config.overlay;
};

// src/lib/ImageOverlay.ts
var ImageOverlay = class extends Overlay {
  /**
   * Holds the bounds where the image should be displayed
   *
   * @private
   * @type {LatLngBounds|undefined}
   */
  #bounds;
  /**
   * Holds the image element
   *
   * @private
   * @type {HTMLImageElement}
   */
  #imageElement;
  /**
   * Holds the image URL
   *
   * @private
   * @type {string|undefined}
   */
  #imageUrl;
  /**
   * Whether the overlay is currently being rotated
   *
   * @private
   * @type {boolean}
   */
  #isRotating = false;
  /**
   * Holds the opacity of the image
   *
   * @private
   * @type {number}
   */
  #opacity = 1;
  /**
   * Whether rotation is enabled
   *
   * @private
   * @type {boolean}
   */
  #rotate = false;
  /**
   * Holds the rotation angle in degrees
   *
   * @private
   * @type {number}
   */
  #rotation = 0;
  /**
   * The starting center point when rotation begins
   *
   * @private
   * @type {Point}
   */
  #rotationCenter;
  /**
   * The rotation container element (wraps the image when rotation is enabled)
   *
   * @private
   * @type {HTMLElement|null}
   */
  #rotationContainer = null;
  /**
   * The rotation handle element
   *
   * @private
   * @type {HTMLElement|null}
   */
  #rotationHandle = null;
  /**
   * Holds the styles for the image element
   *
   * This overrides the styles property of the Overlay class.
   *
   * @private
   * @type {object}
   */
  #styles = {};
  /**
   * Constructor
   *
   * @param {ImageOverlayOptions | string} [options] The ImageOverlay options or image URL
   * @param {LatLngBoundsValue} [bounds] The bounds where the image should be displayed (if options is a string)
   */
  constructor(options, bounds) {
    super("imageoverlay", "ImageOverlay");
    this.#imageElement = document.createElement("img");
    this.styles = {
      height: "100%",
      width: "100%"
    };
    if (isObject(options)) {
      this.setOptions(options);
    } else {
      if (isString(options)) {
        this.imageUrl = options;
      }
      if (bounds) {
        this.bounds = bounds;
      }
    }
  }
  /**
   * Returns the bounds where the image should be displayed
   *
   * @returns {LatLngBounds|undefined}
   */
  get bounds() {
    return this.#bounds;
  }
  /**
   * Set the bounds where the image should be displayed
   *
   * @param {LatLngBoundsValue} bounds The bounds where the image should be displayed
   */
  set bounds(bounds) {
    if (bounds) {
      if (bounds instanceof LatLngBounds) {
        this.#bounds = bounds;
      } else {
        this.#bounds = new LatLngBounds(bounds);
      }
    }
  }
  /**
   * Get the class name for the image element
   *
   * This overrides the className property of the Overlay class.
   *
   * @returns {string}
   */
  get className() {
    return this.#imageElement.className;
  }
  /**
   * Set the class name(s) for the image element
   *
   * This overrides the className property of the Overlay class.
   *
   * If you need multiple class names then separate them with a space.
   *
   * @param {string} className The class name(s) to add to the image element.
   *    This can be a space separated list of class names.
   */
  set className(className) {
    if (isString(className)) {
      const classes = className.split(" ");
      classes.forEach((cn) => {
        this.#imageElement.classList.add(cn.trim());
      });
    } else if (isNullOrUndefined(className)) {
      this.#imageElement.className = "";
    }
  }
  /**
   * Returns the image URL
   *
   * @returns {string|undefined}
   */
  get imageUrl() {
    return this.#imageUrl;
  }
  /**
   * Set the image URL
   *
   * @param {string} imageUrl The image URL to display
   */
  set imageUrl(imageUrl) {
    if (isStringWithValue(imageUrl)) {
      this.#imageUrl = imageUrl;
      this.#imageElement.src = imageUrl;
    }
  }
  /**
   * Returns the opacity of the image
   *
   * @returns {number}
   */
  get opacity() {
    return this.#opacity;
  }
  /**
   * Set the opacity of the image
   *
   * @param {number} opacity The opacity value (0.0 to 1.0)
   */
  set opacity(opacity) {
    if (isNumber(opacity) && opacity >= 0 && opacity <= 1) {
      this.#opacity = opacity;
      this.style("opacity", opacity.toString());
    }
  }
  /**
   * Returns whether rotation is enabled
   *
   * @returns {boolean}
   */
  get rotate() {
    return this.#rotate;
  }
  /**
   * Set whether rotation is enabled
   *
   * @param {boolean} rotate Whether rotation is enabled
   */
  set rotate(rotate) {
    if (isBoolean(rotate)) {
      this.#rotate = rotate;
      this.#setupRotationHandlers();
    }
  }
  /**
   * Returns the rotation angle in degrees
   *
   * @returns {number}
   */
  get rotation() {
    return this.#rotation;
  }
  /**
   * Set the rotation angle in degrees
   *
   * @param {number} rotation The rotation angle in degrees (0 to 360)
   */
  set rotation(rotation) {
    if (isNumber(rotation)) {
      this.#rotation = rotation;
      this.#updateImageRotation();
    }
  }
  /**
   * Returns the styles for the overlay element
   *
   * @returns {object}
   */
  get styles() {
    return this.#styles;
  }
  /**
   * Set multiple styles for the image overlay element
   *
   * @param {object} styles The styles to apply to the image overlay element
   */
  set styles(styles) {
    if (isObject(styles)) {
      Object.keys(styles).forEach((key) => {
        this.style(key, styles[key]);
      });
    }
  }
  /**
   * Disable rotation for this overlay
   *
   * @returns {ImageOverlay}
   */
  disableRotation() {
    this.rotate = false;
    return this;
  }
  /**
   * Display the image overlay on the map
   *
   * Alias to show()
   *
   * @param {Map} map The Map object
   * @returns {Promise<ImageOverlay>}
   */
  display(map2) {
    return this.show(map2);
  }
  /**
   * Enable rotation for this overlay
   *
   * @returns {ImageOverlay}
   */
  enableRotation() {
    this.rotate = true;
    return this;
  }
  /**
   * Get the rotation angle in degrees
   *
   * @returns {number}
   */
  getRotation() {
    return this.#rotation;
  }
  /**
   * Fit the overlay to the exact dimensions of the image
   *
   * @returns {Promise<ImageOverlay>}
   */
  fitToImage() {
    return new Promise((resolve) => {
      if (!this.#imageElement.complete) {
        this.#imageElement.onload = () => {
          this.#performFitToImage();
          resolve(this);
        };
      } else {
        this.#performFitToImage();
        resolve(this);
      }
    });
  }
  /**
   * Get the bounds where the image should be displayed
   *
   * @returns {LatLngBounds|undefined}
   */
  getBounds() {
    return this.#bounds;
  }
  /**
   * Get the image URL
   *
   * @returns {string|undefined}
   */
  getImageUrl() {
    return this.#imageUrl;
  }
  /**
   * Get the opacity of the image
   *
   * @returns {number}
   */
  getOpacity() {
    return this.#opacity;
  }
  /**
   * Add an event listener for when rotating ends
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onRotateEnd(callback) {
    this.on(ImageOverlayEvents.ROTATE_END, callback);
  }
  /**
   * Add an event listener for when rotating updates the overlay rotation
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onRotate(callback) {
    this.on(ImageOverlayEvents.ROTATE, callback);
  }
  /**
   * Add an event listener for when rotating the overlay starts
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onRotateStart(callback) {
    this.on(ImageOverlayEvents.ROTATE_START, callback);
  }
  /**
   * Removes a class name from the overlay element
   *
   * @param {string} className The class name to remove from the overlay element
   * @returns {Overlay}
   */
  removeClassName(className) {
    const classes = className.split(" ");
    classes.forEach((cn) => {
      this.#imageElement.classList.remove(cn.trim());
    });
    return this;
  }
  /**
   * Set the bounds where the image should be displayed
   *
   * @param {LatLngBoundsValue} bounds The bounds where the image should be displayed
   * @returns {ImageOverlay}
   */
  setBounds(bounds) {
    this.bounds = bounds;
    return this;
  }
  /**
   * Update bounds from resize
   *
   * @protected
   * @param {LatLng} neLatLng The new lat/lng position for the northeast corner
   * @param {LatLng} swLatLng The new lat/lng position for the southwest corner
   */
  setBoundsFromResize(neLatLng, swLatLng) {
    this.#bounds = new LatLngBounds({
      ne: neLatLng,
      sw: swLatLng
    });
  }
  /**
   * Set the class name(s) for the image element
   *
   * If you need multiple class names then separate them with a space.
   *
   * @param {string} className The class name(s) to add to the image element.
   *    This can be a space separated list of class names.
   * @returns {Overlay}
   */
  setClassName(className) {
    this.className = className;
    return this;
  }
  /**
   * Set the image URL
   *
   * @param {string} imageUrl The image URL to display
   * @returns {ImageOverlay}
   */
  setImageUrl(imageUrl) {
    this.imageUrl = imageUrl;
    return this;
  }
  /**
   * Set the opacity of the image
   *
   * @param {number} opacity The opacity value (0.0 to 1.0)
   * @returns {ImageOverlay}
   */
  setOpacity(opacity) {
    this.opacity = opacity;
    return this;
  }
  /**
   * Sets the options for the image overlay
   *
   * @param {ImageOverlayOptions} options ImageOverlay options
   * @returns {ImageOverlay}
   */
  setOptions(options) {
    if (options.bounds) {
      this.bounds = options.bounds;
    }
    if (isBoolean(options.debug) && options.debug) {
      super.style("background-color", "#ff000080");
      super.style("outline", "2px solid #ff0000");
    }
    if (options.className) {
      this.setClassName(options.className);
    }
    if (isBoolean(options.drag)) {
      this.drag = options.drag;
    }
    if (options.imageUrl) {
      this.imageUrl = options.imageUrl;
    }
    if (options.opacity !== void 0) {
      this.opacity = options.opacity;
    }
    if (isBoolean(options.resize)) {
      this.resize = options.resize;
    }
    if (options.rotation !== void 0) {
      this.rotation = options.rotation;
    }
    if (options.rotate !== void 0) {
      this.rotate = options.rotate;
    }
    if (options.styles) {
      this.styles = options.styles;
    }
    if (options.map) {
      this.setMap(options.map);
    }
    return this;
  }
  /**
   * Set the rotation angle in degrees
   *
   * @param {number} rotation The rotation angle in degrees (0 to 360)
   * @returns {ImageOverlay}
   */
  setRotation(rotation) {
    this.rotation = rotation;
    return this;
  }
  /**
   * Set one more styles for the image overlay element. This will merge styles with an existing ones.
   *
   * @param {object} styles The styles to apply to the overlay element
   * @returns {Overlay}
   */
  setStyles(styles) {
    this.styles = styles;
    return this;
  }
  /**
   * Set a single style on the image element
   *
   * @param {string} name The style name
   * @param {string} value The style value
   * @returns {Overlay}
   */
  style(name, value) {
    if (isString(name) && isString(value)) {
      this.#styles[name] = value;
      this.#imageElement.style[name] = value;
    }
    return this;
  }
  /**
   * Toggle the display of the image overlay on the map
   *
   * @param {Map} map The map object
   * @returns {void}
   */
  toggle(map2) {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show(map2);
    }
  }
  /**
   * Override the updateBoundsFromPosition method to handle dragging
   *
   * @protected
   */
  updateBoundsFromPosition() {
    if (!this.#bounds) return;
    const projection = this.getProjection();
    if (!projection) return;
    const overlayRect = this.getOverlayElement().getBoundingClientRect();
    const mapDiv = this.getMap()?.getDiv();
    if (!mapDiv) return;
    const mapRect = mapDiv.getBoundingClientRect();
    const overlayLeft = overlayRect.left - mapRect.left;
    const overlayTop = overlayRect.top - mapRect.top;
    const nePixel = point(overlayLeft + overlayRect.width, overlayTop);
    const swPixel = point(overlayLeft, overlayTop + overlayRect.height);
    const neLatLng = this.getContainerLatLngFromPixel(nePixel.getX(), nePixel.getY());
    const swLatLng = this.getContainerLatLngFromPixel(swPixel.getX(), swPixel.getY());
    this.#bounds = new LatLngBounds({
      ne: neLatLng,
      sw: swLatLng
    });
  }
  /**
   * Override the updateBoundsFromResize method to handle resizing
   *
   * @protected
   * @param {LatLng} newLatLng The new lat/lng position
   */
  updateBoundsFromResize(newLatLng) {
    if (!this.#bounds || !this.resizeStart) return;
    let newNe = this.resizeStart.neBounds;
    let newSw = this.resizeStart.swBounds;
    switch (this.resizeCorner) {
      case "nw":
        newNe = latLng(newLatLng.latitude, newNe.longitude);
        newSw = latLng(newSw.latitude, newLatLng.longitude);
        break;
      case "ne":
        newNe = latLng(newLatLng.latitude, newLatLng.longitude);
        newSw = latLng(newSw.latitude, newSw.longitude);
        break;
      case "sw":
        newNe = latLng(newNe.latitude, newNe.longitude);
        newSw = latLng(newLatLng.latitude, newLatLng.longitude);
        break;
      case "se":
        newNe = latLng(newNe.latitude, newLatLng.longitude);
        newSw = latLng(newLatLng.latitude, newSw.longitude);
        break;
      default:
        break;
    }
    const north = Math.max(newNe.latitude, newSw.latitude);
    const south = Math.min(newNe.latitude, newSw.latitude);
    const east = Math.max(newNe.longitude, newSw.longitude);
    const west = Math.min(newNe.longitude, newSw.longitude);
    this.#bounds = new LatLngBounds({
      ne: latLng(north, east),
      sw: latLng(south, west)
    });
  }
  /**
   * Perform the fit to image operation
   *
   * @private
   */
  #performFitToImage() {
    const imageWidth = this.#imageElement.naturalWidth;
    const imageHeight = this.#imageElement.naturalHeight;
    if (imageWidth === 0 || imageHeight === 0) {
      console.warn("Image dimensions are not available");
      return;
    }
    const aspectRatio = imageWidth / imageHeight;
    const overlayElement = this.getOverlayElement();
    const containerRect = overlayElement.getBoundingClientRect();
    const { width: newContainerWidth, height: newContainerHeight } = calculateDimensions(
      aspectRatio,
      containerRect.width,
      containerRect.height
    );
    super.style("width", `${newContainerWidth}px`);
    super.style("height", `${newContainerHeight}px`);
    const leftDelta = (containerRect.width - newContainerWidth) / 2;
    const topDelta = (containerRect.height - newContainerHeight) / 2;
    const currentLeft = parseInt(overlayElement.style.left, 10) || 0;
    const currentTop = parseInt(overlayElement.style.top, 10) || 0;
    super.style("left", `${currentLeft + leftDelta}px`);
    super.style("top", `${currentTop + topDelta}px`);
    this.setResizeAspectRatio(aspectRatio);
    const mapDiv = this.getMap()?.getDiv();
    if (!mapDiv) return;
    const newContainerRect = overlayElement.getBoundingClientRect();
    const mapContainerRect = mapDiv.getBoundingClientRect();
    const nePos = {
      x: newContainerRect.right - mapContainerRect.left,
      y: newContainerRect.top - mapContainerRect.top
    };
    const swPos = {
      x: newContainerRect.left - mapContainerRect.left,
      y: newContainerRect.bottom - mapContainerRect.top
    };
    const neLatLng = this.getContainerLatLngFromPixel(nePos.x, nePos.y);
    const swLatLng = this.getContainerLatLngFromPixel(swPos.x, swPos.y);
    this.bounds = new LatLngBounds({
      ne: neLatLng,
      sw: swLatLng
    });
  }
  /**
   * Update the image rotation transform
   *
   * @private
   */
  #updateImageRotation() {
    if (this.#rotationContainer) {
      this.#rotationContainer.style.transform = `rotate(${this.#rotation}deg)`;
    } else {
      if (this.#rotation !== 0) {
        this.style("transform", `rotate(${this.#rotation}deg)`);
      } else {
        this.style("transform", "");
      }
    }
  }
  /**
   * Set up rotation event handlers
   *
   * @private
   */
  #setupRotationHandlers() {
    if (this.rotate) {
      this.#createRotationContainer();
      this.#createRotationHandle();
    } else {
      this.#removeRotationHandle();
      this.#removeRotationContainer();
    }
  }
  /**
   * Create rotation container
   *
   * @private
   */
  #createRotationContainer() {
    this.#removeRotationContainer();
    this.#rotationContainer = document.createElement("div");
    this.#rotationContainer.className = "rotation-container";
    this.#rotationContainer.style.cssText = `
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: rotate(${this.#rotation}deg);
        `;
    this.style("transform", "");
    if (this.#imageElement.parentNode) {
      this.#imageElement.parentNode.insertBefore(this.#rotationContainer, this.#imageElement);
    }
    this.#rotationContainer.appendChild(this.#imageElement);
    this.#updateImageRotation();
  }
  /**
   * Remove rotation container
   *
   * @private
   */
  #removeRotationContainer() {
    if (this.#rotationContainer) {
      this.getOverlayElement().appendChild(this.#imageElement);
      if (this.#rotationContainer.parentNode) {
        this.#rotationContainer.parentNode.removeChild(this.#rotationContainer);
      }
      this.#rotationContainer = null;
    }
  }
  /**
   * Create rotation handle
   *
   * @private
   */
  #createRotationHandle() {
    this.#removeRotationHandle();
    this.#rotationHandle = document.createElement("div");
    this.#rotationHandle.className = "rotation-handle";
    this.#rotationHandle.style.cssText = `
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            width: 4px;
            height: 40px;
            background: #007bff;
            border-radius: 2px;
            cursor: grab;
            z-index: 1001;
            pointer-events: auto;
        `;
    const handleCircle = document.createElement("div");
    handleCircle.style.cssText = `
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 16px;
            height: 16px;
            background: #007bff;
            border: 2px solid #fff;
            border-radius: 50%;
            cursor: grab;
        `;
    this.#rotationHandle.appendChild(handleCircle);
    this.#rotationHandle.addEventListener("mousedown", this.#handleRotationStart);
    this.#rotationHandle.addEventListener("touchstart", this.#handleRotationStart);
    if (checkForGoogleMaps("ImageOverlay", "OverlayView", false)) {
      google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.#rotationHandle);
    }
    const parentElement = this.#rotationContainer || this.getOverlayElement();
    parentElement.appendChild(this.#rotationHandle);
  }
  /**
   * Remove rotation handle
   *
   * @private
   */
  #removeRotationHandle() {
    if (this.#rotationHandle && this.#rotationHandle.parentNode) {
      this.#rotationHandle.parentNode.removeChild(this.#rotationHandle);
      this.#rotationHandle = null;
    }
  }
  /**
   * Handle rotation start
   *
   * @private
   * @param {MouseEvent | TouchEvent} e The event
   */
  #handleRotationStart = (e) => {
    if (!this.rotate || this.#isRotating) return;
    e.preventDefault();
    e.stopPropagation();
    this.#isRotating = true;
    const overlayRect = this.getOverlayElement().getBoundingClientRect();
    this.#rotationCenter = point(
      overlayRect.left + overlayRect.width / 2,
      overlayRect.top + overlayRect.height / 2
    );
    document.addEventListener("mousemove", this.#handleRotation);
    document.addEventListener("mouseup", this.#handleRotationEnd);
    document.addEventListener("touchmove", this.#handleRotation);
    document.addEventListener("touchend", this.#handleRotationEnd);
    this.dispatch(ImageOverlayEvents.ROTATE_START, { event: e });
  };
  /**
   * Handle rotation
   *
   * @private
   * @param {MouseEvent | TouchEvent} e The event
   */
  #handleRotation = (e) => {
    if (!this.#isRotating) return;
    e.preventDefault();
    const currentPos = point(
      e instanceof MouseEvent ? [e.clientX, e.clientY] : [e.touches[0].clientX, e.touches[0].clientY]
    );
    const deltaX = currentPos.getX() - this.#rotationCenter.getX();
    const deltaY = currentPos.getY() - this.#rotationCenter.getY();
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    let newRotation = (angle + 90) % 360;
    if (newRotation < 0) newRotation += 360;
    this.#rotation = newRotation;
    this.#updateImageRotation();
    this.dispatch(ImageOverlayEvents.ROTATE, { event: e, angle: newRotation });
  };
  /**
   * Handle rotation end
   *
   * @private
   * @param {MouseEvent | TouchEvent} e The event
   */
  #handleRotationEnd = (e) => {
    if (!this.#isRotating) return;
    this.#isRotating = false;
    document.removeEventListener("mousemove", this.#handleRotation);
    document.removeEventListener("mouseup", this.#handleRotationEnd);
    document.removeEventListener("touchmove", this.#handleRotation);
    document.removeEventListener("touchend", this.#handleRotationEnd);
    this.dispatch(ImageOverlayEvents.ROTATE_END, { event: e, angle: this.#rotation });
  };
  /**
   * Add the overlay to the element. Called once after setMap() is called on the overlay with a valid map.
   *
   * @internal
   * @param {google.maps.MapPanes} panes The Google maps panes object
   */
  add(panes) {
    if (this.rotate) {
      this.#setupRotationHandlers();
    }
    if (this.#rotationContainer) {
      this.getOverlayElement().appendChild(this.#rotationContainer);
    } else {
      this.getOverlayElement().appendChild(this.#imageElement);
    }
    if (this.resize || this.drag || this.rotate) {
      panes.floatPane.appendChild(this.getOverlayElement());
    } else {
      panes.overlayLayer.appendChild(this.getOverlayElement());
    }
  }
  /**
   * Draw the overlay. Called when the overlay is being drawn or updated.
   *
   * @internal
   * @param {google.maps.MapCanvasProjection} projection The Google maps projection object
   */
  draw(projection) {
    if (this.#bounds && projection) {
      const ne = this.#bounds.getNorthEast();
      const sw = this.#bounds.getSouthWest();
      if (ne && sw) {
        const nePixel = projection.fromLatLngToDivPixel(ne.toGoogle());
        const swPixel = projection.fromLatLngToDivPixel(sw.toGoogle());
        if (nePixel && swPixel) {
          const left = swPixel.x;
          const top = nePixel.y;
          const width = nePixel.x - swPixel.x;
          const height = swPixel.y - nePixel.y;
          super.style("left", `${left}px`);
          super.style("top", `${top}px`);
          super.style("width", `${width}px`);
          super.style("height", `${height}px`);
          super.style("display", "block");
        }
      }
    }
  }
};
var imageOverlay = (options, bounds) => {
  if (options instanceof ImageOverlay) {
    return options;
  }
  return new ImageOverlay(options, bounds);
};

// src/lib/PlacesSearchBox.ts
var PlacesSearchBox = class extends Evented {
  /**
   * Holds the reference to the input element
   *
   * @private
   * @type {HTMLInputElement | undefined}
   */
  #input;
  /**
   * Holds the array of places that have been found.
   *
   * This is typically one place and it's the place that the user clicked on.
   *
   * @private
   * @type {google.maps.places.PlaceResult[]}
   */
  #places = [];
  /**
   * Holds the map bounds based on the places that have been found
   *
   * @private
   * @type {LatLngBounds | undefined}
   */
  #placesBounds;
  /**
   * Holds the reference to the Google Maps SearchBox object
   *
   * @private
   * @type {google.maps.places.SearchBox | undefined}
   */
  #searchBox;
  /**
   * Holds the options for the places search box
   *
   * @private
   * @type {GMPlacesSearchBoxOptions}
   */
  #options = {};
  /**
   * Constructor
   *
   * @param {string | HTMLInputElement | PlacesSearchBoxOptions} [input] The input reference or the options
   * @param {PlacesSearchBoxOptions} [options] The places search box options if the input is reference to the input element
   */
  constructor(input, options) {
    super("placesSearchBox", "places");
    if (input instanceof HTMLInputElement) {
      this.#input = input;
      if (options) {
        this.setOptions(options);
      }
    } else if (isString(input)) {
      this.#input = document.querySelector(input) ?? void 0;
      if (!this.#input) {
        throw new Error(`The input element with the selector "${input}" was not found.`);
      }
      if (options) {
        this.setOptions(options);
      }
    } else if (isObjectWithValues(input)) {
      this.setOptions(input);
    }
  }
  /**
   * Get the bounds to which query predictions are biased.
   *
   * @returns {LatLngBounds | undefined}
   */
  get bounds() {
    return this.#options.bounds ?? void 0;
  }
  /**
   * Sets the region to use for biasing query predictions.
   *
   * Results will only be biased towards this area and not be completely restricted to it.
   *
   * @param {LatLngBoundsValue} value The bounds to set
   */
  set bounds(value) {
    const boundsValue = latLngBounds(value);
    this.#options.bounds = boundsValue;
    const searchBox = this.#searchBox;
    if (searchBox) {
      boundsValue.toGoogle().then((bounds) => {
        searchBox.setBounds(bounds);
      });
    }
  }
  /**
   * Get the input reference
   *
   * @returns {HTMLInputElement | undefined}
   */
  get input() {
    return this.#input;
  }
  /**
   * Set the input reference
   *
   * @param {string | HTMLInputElement} value The input HTMLInputElement or the selector for the input element
   */
  set input(value) {
    if (value instanceof HTMLInputElement) {
      this.#input = value;
    } else if (isString(value)) {
      this.#input = document.querySelector(value) ?? void 0;
      if (!this.#input) {
        throw new Error(`The input element with the selector "${value}" was not found.`);
      }
    }
  }
  /**
   * Get the bounds to which query predictions are biased.
   *
   * @returns {LatLngBounds | undefined}
   */
  getBounds() {
    return this.bounds;
  }
  /**
   * Gets the first place that has been found
   *
   * The results from the places_changed event is typically one place and it's the place that the user clicked on.
   *
   * @returns {google.maps.places.PlaceResult | undefined}
   */
  getPlace() {
    return this.#places[0];
  }
  /**
   * Get the places that have been found
   *
   * This is typically one place and it's the place that the user clicked on.
   *
   * @returns {google.maps.places.PlaceResult[]}
   */
  getPlaces() {
    return this.#places;
  }
  /**
   * Get the map bounds based on the places that have been found.
   *
   * @returns {LatLngBounds|undefined}
   */
  getPlacesBounds() {
    return this.#placesBounds;
  }
  /**
   * Initialize the places search box object
   *
   * This must be called in order for the places search box to work.
   *
   * @returns {Promise<void>}
   */
  async init() {
    return new Promise((resolve) => {
      if (!isObject(this.#searchBox)) {
        if (checkForGoogleMaps("PlacesSearchBox", "places", false)) {
          this.#createPlacesSearchBox().then(() => {
            resolve();
          });
        } else {
          loader().onMapLoad(() => {
            this.#createPlacesSearchBox().then(() => {
              resolve();
            });
          });
        }
      } else {
        resolve();
      }
    });
  }
  /**
   * Create the places search box object
   *
   * @private
   */
  #createPlacesSearchBox = async () => {
    if (!this.#searchBox) {
      const options = {};
      if (this.#options.bounds) {
        options.bounds = await this.#options.bounds.toGoogle();
      }
      if (!this.#input) {
        throw new Error("The input element must be set before the places search box can be initialized.");
      }
      const searchBox = new google.maps.places.SearchBox(this.#input, options);
      this.#searchBox = searchBox;
      searchBox.addListener(PlacesSearchBoxEvents.PLACES_CHANGED, () => {
        const places = searchBox.getPlaces();
        if (!Array.isArray(places) || places.length === 0) {
          this.#places = [];
          this.#placesBounds = void 0;
          return;
        }
        const bounds = latLngBounds();
        places.forEach((place) => {
          if (place.geometry) {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport);
            } else if (place.geometry.location) {
              bounds.extend(latLng(place.geometry.location));
            }
          }
        });
        this.#places = places;
        this.#placesBounds = bounds;
        this.dispatch(PlacesSearchBoxEvents.PLACES_CHANGED, { places, bounds });
      });
    }
  };
  /**
   * Returns whether the places search box object has been initialized
   *
   * @returns {boolean}
   */
  isInitialized() {
    return isObject(this.#searchBox);
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
  onPlacesChanged(callback) {
    this.on(PlacesSearchBoxEvents.PLACES_CHANGED, (data) => {
      callback(data.places, data.bounds);
    });
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
   * Sets the region to use for biasing query predictions.
   *
   * Results will only be biased towards this area and not be completely restricted to it.
   *
   * @param {LatLngBoundsValue} value The bounds to set
   * @returns {PlacesSearchBox}
   */
  setBounds(value) {
    this.bounds = value;
    return this;
  }
  /**
   * Set the input reference
   *
   * @param {string|HTMLInputElement} input The input HTMLInputElement or the selector for the input element
   * @returns {PlacesSearchBox}
   */
  setInput(input) {
    this.input = input;
    return this;
  }
  /**
   * Set the places search box options
   *
   * @param {PlacesSearchBoxOptions} options The options to set
   * @returns {PlacesSearchBox}
   */
  setOptions(options) {
    if (isObjectWithValues(options)) {
      if (options.bounds) {
        this.bounds = options.bounds;
      }
      if (typeof options.input !== "undefined") {
        if (options.input instanceof HTMLInputElement) {
          this.#input = options.input;
        } else if (isString(options.input)) {
          this.#input = document.querySelector(options.input) ?? void 0;
          if (!this.#input) {
            throw new Error(`The input element with the selector "${options.input}" was not found.`);
          }
        }
      }
    }
    return this;
  }
};
var placesSearchBox = (input, options) => {
  if (input instanceof PlacesSearchBox) {
    return input;
  }
  return new PlacesSearchBox(input, options);
};

// src/lib/PolylineIcon.ts
var PolylineIcon = class extends Base_default {
  /**
   * Holds the options for the Google maps polyline icon
   *
   * @private
   * @type {PolylineGoogleOptions}
   */
  #options;
  /**
   * Constructor
   *
   * @param {PolylineIconOptions} [options] The polyline icon options
   */
  constructor(options) {
    super("polylineIcon");
    this.#options = {};
    if (isObject(options)) {
      this.setOptions(options);
    }
  }
  /**
   * Get the fixed rotation setting for the icon
   *
   * @returns {boolean} True if the icon has a fixed rotation, false otherwise
   */
  get fixedRotation() {
    return !!this.#options.fixedRotation;
  }
  /**
   * Set the fixed rotation setting for the icon
   *
   * @param {boolean} fixedRotation If true, each icon in the sequence has the same fixed rotation
   *      regardless of the angle of the edge on which it lies. If false, case each icon in the
   *      sequence is rotated to align with its edge.
   */
  set fixedRotation(fixedRotation) {
    if (isBoolean(fixedRotation)) {
      this.#options.fixedRotation = fixedRotation;
    }
  }
  /**
   * Get the icon value
   *
   * @returns {SvgSymbol|undefined} The icon value or undefined if not set
   */
  get icon() {
    return this.#options.icon;
  }
  /**
   * Set the icon value
   *
   * @param {SvgSymbolValue} icon The icon value to set. It can be a string, an object, or an instance of SvgSymbol.
   * @see {@link SvgSymbol} for more details on the icon value
   */
  set icon(icon2) {
    this.#options.icon = svgSymbol(icon2);
  }
  /**
   * Get the offset value
   *
   * @returns {string|undefined} The offset value or undefined if not set
   */
  get offset() {
    return this.#options.offset;
  }
  /**
   * Set the distance from the start of the line at which an icon is to be rendered.
   *
   * @param {number|string} value The distance from the start of the line at which an icon is to be rendered.
   *      is distance may be expressed as a percentage of line's length (e.g. '50%') or in pixels (e.g. '50px').
   */
  set offset(value) {
    const val = getSizeWithUnit(value);
    if (isStringWithValue(val)) {
      this.#options.offset = val;
    }
  }
  /**
   * Get the repeat value
   *
   * @returns {string|undefined} The repeat value or undefined if not set
   */
  get repeat() {
    return this.#options.repeat;
  }
  /**
   * Set the repeat value. This sets the distance between consecutive icons along the polyline.
   * The repeat value can be expressed in pixels (e.g. '20px') or as a percentage of the polyline's length (e.g. '10%').
   * If the value is a number, it is treated as pixels (e.g. 20 becomes '20px').
   * To disable repeating icons, set the repeat value to 0, '0px' or '0%'.
   *
   * @param {number|string} value The repeat value. It can be a number, a number string, or a string with 'px' or '%' suffix.
   */
  set repeat(value) {
    const val = getSizeWithUnit(value);
    if (isStringWithValue(val)) {
      this.#options.repeat = val;
    }
  }
  /**
   * Set the fixed rotation value
   *
   * @param {boolean} fixedRotation If true, each icon in the sequence has the same fixed rotation
   *      regardless of the angle of the edge on which it lies. If false, case each icon in the
   *      sequence is rotated to align with its edge.
   * @returns {PolylineIcon}
   */
  setFixedRotation(fixedRotation) {
    this.fixedRotation = fixedRotation;
    return this;
  }
  /**
   * Set the icon value
   *
   * @param {SvgSymbolValue} icon The icon value to set. It can be a string, an object, or an instance of SvgSymbol.
   * @returns {PolylineIcon} The PolylineIcon instance for method chaining
   */
  setIcon(icon2) {
    this.icon = icon2;
    return this;
  }
  /**
   * Set the distance from the start of the line at which an icon is to be rendered.
   *
   * @param {number|string} value The distance from the start of the line at which an icon is to be rendered.
   *      This distance may be expressed as a percentage of line's length (e.g. '50%') or in pixels (e.g. '50px').
   * @returns {PolylineIcon} The PolylineIcon instance for method chaining
   */
  setOffset(value) {
    this.offset = value;
    return this;
  }
  /**
   * Set the repeat value. This sets the distance between consecutive icons along the polyline.
   * The repeat value can be expressed in pixels (e.g. '20px') or as a percentage of the polyline's length (e.g. '10%').
   * If the value is a number, it is treated as pixels (e.g. 20 becomes '20px').
   * To disable repeating icons, set the repeat value to 0, '0px' or '0%'.
   *
   * @param {number|string} value The repeat value. It can be a number, a number string, or a string with 'px' or '%' suffix.
   * @returns {PolylineIcon} The PolylineIcon instance for method chaining
   */
  setRepeat(value) {
    this.repeat = value;
    return this;
  }
  /**
   * Set the icon options
   *
   * @param {PolylineIconOptions} options The polyline icon options
   * @returns {PolylineIcon}
   */
  setOptions(options) {
    if (isObject(options)) {
      if (isDefined(options.fixedRotation)) {
        this.fixedRotation = options.fixedRotation;
      }
      if (isDefined(options.icon)) {
        this.icon = options.icon;
      }
      if (isDefined(options.offset)) {
        this.offset = options.offset;
      }
      if (isDefined(options.repeat)) {
        this.repeat = options.repeat;
      }
    }
    return this;
  }
  /**
   * Get the polyline icon options
   *
   * @returns {Promise<google.maps.IconSequence>}
   */
  toGoogle() {
    return new Promise((resolve) => {
      (async () => {
        const options = {};
        if (isDefined(this.#options.fixedRotation)) {
          options.fixedRotation = this.#options.fixedRotation;
        }
        if (isDefined(this.#options.offset)) {
          options.offset = this.#options.offset;
        }
        if (isDefined(this.#options.repeat)) {
          options.repeat = this.#options.repeat;
        }
        if (this.#options.icon) {
          options.icon = await this.#options.icon.toGoogle();
        }
        resolve(options);
      })();
    });
  }
};
var polylineIcon = (options) => {
  if (options instanceof PolylineIcon) {
    return options;
  }
  return new PolylineIcon(options);
};

// src/lib/simplifyPath.ts
var DEFAULT_SIMPLIFY_TOLERANCE = 2;
var DEFAULT_SIMPLIFY_ZOOM = Object.freeze({ 0: 10, 14: 5, 16: 2, 18: 1 });
var EARTH_RADIUS = 6378137;
var getNumberValue = (value) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : void 0;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const num = Number(value);
    return Number.isFinite(num) ? num : void 0;
  }
  return void 0;
};
var coordsFromPath = (path) => {
  if (!Array.isArray(path)) {
    return new Float64Array(0);
  }
  const coords = new Float64Array(path.length * 2);
  let count = 0;
  path.forEach((value) => {
    let latitude;
    let longitude;
    if (value instanceof LatLng) {
      if (value.isValid()) {
        latitude = value.latitude;
        longitude = value.longitude;
      }
    } else if (Array.isArray(value)) {
      latitude = getNumberValue(value[0]);
      longitude = getNumberValue(value[1]);
    } else if (isObject(value)) {
      const object = value;
      latitude = getNumberValue(object.lat) ?? getNumberValue(object.latitude);
      longitude = getNumberValue(object.lng) ?? getNumberValue(object.longitude);
      if (typeof latitude === "undefined" || typeof longitude === "undefined") {
        const point2 = latLng(value);
        if (point2.isValid()) {
          latitude = point2.latitude;
          longitude = point2.longitude;
        }
      }
    }
    if (typeof latitude === "number" && typeof longitude === "number") {
      coords[count * 2] = latitude;
      coords[count * 2 + 1] = longitude;
      count += 1;
    }
  });
  return count * 2 === coords.length ? coords : coords.slice(0, count * 2);
};
var simplifyCoords = (coords, tolerance = DEFAULT_SIMPLIFY_TOLERANCE) => {
  const count = coords.length / 2;
  if (count <= 2 || !isNumber(tolerance) || tolerance <= 0) {
    return coords;
  }
  let latitudeTotal = 0;
  for (let i = 0; i < count; i += 1) {
    latitudeTotal += coords[i * 2];
  }
  const metersPerLatDegree = Math.PI / 180 * EARTH_RADIUS;
  const metersPerLngDegree = metersPerLatDegree * Math.cos(latitudeTotal / count * Math.PI / 180);
  const xs = new Float64Array(count);
  const ys = new Float64Array(count);
  for (let i = 0; i < count; i += 1) {
    xs[i] = coords[i * 2 + 1] * metersPerLngDegree;
    ys[i] = coords[i * 2] * metersPerLatDegree;
  }
  const segmentDistanceSquared = (index2, first, last) => {
    let x = xs[first];
    let y = ys[first];
    let dx = xs[last] - x;
    let dy = ys[last] - y;
    if (dx !== 0 || dy !== 0) {
      const t = ((xs[index2] - x) * dx + (ys[index2] - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) {
        x = xs[last];
        y = ys[last];
      } else if (t > 0) {
        x += dx * t;
        y += dy * t;
      }
    }
    dx = xs[index2] - x;
    dy = ys[index2] - y;
    return dx * dx + dy * dy;
  };
  const keep = new Uint8Array(count);
  keep[0] = 1;
  keep[count - 1] = 1;
  const toleranceSquared = tolerance * tolerance;
  const stack = [0, count - 1];
  while (stack.length > 0) {
    const last = stack.pop();
    const first = stack.pop();
    let maxDistance = 0;
    let furthest = -1;
    for (let i = first + 1; i < last; i += 1) {
      const distance = segmentDistanceSquared(i, first, last);
      if (distance > maxDistance) {
        maxDistance = distance;
        furthest = i;
      }
    }
    if (furthest !== -1 && maxDistance > toleranceSquared) {
      keep[furthest] = 1;
      stack.push(first, furthest, furthest, last);
    }
  }
  let keptCount = 0;
  for (let i = 0; i < count; i += 1) {
    keptCount += keep[i];
  }
  const simplified = new Float64Array(keptCount * 2);
  let index = 0;
  for (let i = 0; i < count; i += 1) {
    if (keep[i] === 1) {
      simplified[index * 2] = coords[i * 2];
      simplified[index * 2 + 1] = coords[i * 2 + 1];
      index += 1;
    }
  }
  return simplified;
};
var simplifyPath = (path, tolerance = DEFAULT_SIMPLIFY_TOLERANCE) => {
  const coords = simplifyCoords(coordsFromPath(path), tolerance);
  const points = [];
  for (let i = 0; i < coords.length; i += 2) {
    points.push(latLng(coords[i], coords[i + 1]));
  }
  return points;
};

// src/lib/Polyline.ts
var getSimplifyConfig = (value) => {
  const getZoomTolerances = (zoom) => Object.entries(zoom).map(([level, zoomTolerance]) => ({ level: Number(level), tolerance: Number(zoomTolerance) })).filter((z) => Number.isFinite(z.level) && Number.isFinite(z.tolerance) && z.tolerance >= 0).sort((a, b) => a.level - b.level);
  if (value === true) {
    return { debug: false, tolerance: DEFAULT_SIMPLIFY_TOLERANCE, zoom: [] };
  }
  if (value === "zoom") {
    return { debug: false, tolerance: DEFAULT_SIMPLIFY_TOLERANCE, zoom: getZoomTolerances(DEFAULT_SIMPLIFY_ZOOM) };
  }
  if (isNumberOrNumberString(value)) {
    const tolerance = Number(value);
    return tolerance > 0 ? { debug: false, tolerance, zoom: [] } : void 0;
  }
  if (isObject(value)) {
    const options = value;
    const tolerance = isNumberOrNumberString(options.tolerance) && Number(options.tolerance) >= 0 ? Number(options.tolerance) : DEFAULT_SIMPLIFY_TOLERANCE;
    let zoom = [];
    if (options.zoom === true) {
      zoom = getZoomTolerances(DEFAULT_SIMPLIFY_ZOOM);
    } else if (isObject(options.zoom)) {
      zoom = getZoomTolerances(options.zoom);
    }
    return { debug: options.debug === true, tolerance, zoom };
  }
  return void 0;
};
var Polyline = class _Polyline extends Layer_default {
  /**
   * Holds any custom data to attach to the polyline object
   *
   * @private
   * @type {CustomData}
   */
  #customData = {};
  /**
   * Holds whether the polyline is drawn as a dashed line
   *
   * @private
   * @type {boolean}
   */
  #dashed = false;
  /**
   * Holds the gap between the dashes in pixels or percentage
   *
   * https://developers.google.com/maps/documentation/javascript/symbols#add_to_polyline
   *
   * @private
   * @type {string}
   */
  #dashGap = "15px";
  /**
   * Holds the original polyline options for the highlight polyline
   * before they were overriden by custom options.
   *
   * The custom options are set in the highlight() method.
   *
   * @private
   * @type {PolylineOptions}
   */
  #highlightOriginalOptions = {};
  /**
   * Holds a polyline to show below the existing one to create a "highlight" effect
   * when the mouse hovers over this polyline.
   *
   * @private
   * @type {Polyline|undefined}
   */
  #highlightPolyline;
  /**
   * Holds the promise for setting up the highlight polyline on the map.
   *
   * The highlight polyline isn't given the path or added to the map until it's first shown.
   * On a touch screen there is no hover, so most polylines are never highlighted and this
   * saves holding a second copy of every path on the map.
   * This is undefined until the highlight polyline is first shown.
   *
   * @private
   * @type {Promise<void>|undefined}
   */
  #highlightSetup;
  /**
   * Holds whether the hover events that show and hide the highlight polyline have been set up
   *
   * @private
   * @type {boolean}
   */
  #hasHighlightListeners = false;
  /**
   * Holds whether the polyline is manually highlighted (i.e. if the highlightPolyline is displayed)
   *
   * @private
   * @type {boolean}
   */
  #isHighlighted = false;
  /**
   * Holds whether the highlight polyline has finished being set up on the map
   *
   * @private
   * @type {boolean}
   */
  #isHighlightReady = false;
  /**
   * Holds whether the mouse is over the polyline
   *
   * @private
   * @type {boolean}
   */
  #isHovered = false;
  /**
   * Holds the Polyline options
   *
   * @private
   * @type {PolylineOptions}
   */
  #options = {};
  /**
   * Holds the path as the latitude and longitude of each point, one after the other.
   *
   * Plain numbers are held instead of LatLng objects because a path can have a lot of points.
   * Two numbers use a small fraction of the memory that a LatLng object does, and the points that
   * are drawn are created straight from these numbers.
   *
   * This array is never changed once it's set. It's replaced when the path changes, so it can be
   * shared with the highlight polyline and with clones.
   *
   * @private
   * @type {Float64Array|undefined}
   */
  #pathCoords;
  /**
   * Holds the LatLng objects for the path.
   *
   * These are only created if the path property is read, and they're thrown away when the path changes.
   *
   * @private
   * @type {LatLng[]|undefined}
   */
  #pathObjects;
  /**
   * Holds how far, in meters, the line drawn on the map can be from the original path when it's simplified.
   *
   * 0 means that the path isn't simplified.
   *
   * @private
   * @type {number}
   */
  #simplifyTolerance = 0;
  /**
   * Holds the simplify settings. This is undefined if the path isn't simplified.
   *
   * @private
   * @type {SimplifyConfig|undefined}
   */
  #simplifyConfig;
  /**
   * Holds the simplifyDebug option. If it's set, it's used instead of the "debug" simplify option.
   *
   * @private
   * @type {boolean|undefined}
   */
  #simplifyDebug;
  /**
   * Holds whether the simplify tolerance changed while the polyline was hidden.
   *
   * Hidden polylines don't update the path drawn on the map until they're shown again.
   *
   * @private
   * @type {boolean}
   */
  #isSimplifyOutOfDate = false;
  /**
   * Holds the simplified Google Maps path for each tolerance when the tolerance changes with the zoom level.
   * They're kept so that the path doesn't have to be simplified again when zooming back to the same zoom levels.
   *
   * @private
   * @type {object}
   */
  #simplifiedPaths = {};
  /**
   * Holds the map most recently passed to setMap().
   *
   * It's set right away, before the Google polyline is set up, so that the tolerance
   * for the map's zoom level can be used when the polyline is first drawn.
   *
   * @private
   * @type {Map|null}
   */
  #requestedMap = null;
  /**
   * Holds the map that has the "idle" event listener to update the tolerance for the zoom level
   *
   * @private
   * @type {Map|null}
   */
  #zoomListenerMap = null;
  /**
   * Holds the Google maps Polyline object
   *
   * This is undefined until the Google Maps library is loaded and the polyline object is created.
   *
   * @private
   * @type {google.maps.Polyline|undefined}
   */
  #polyline;
  /**
   * Constructor
   *
   * @param {PolylineOptions} [options] The polyline options
   */
  constructor(options) {
    super("polyline", "Polyline");
    if (isObject(options)) {
      this.setOptions(options);
    }
  }
  /**
   * Get whether the polyline handles click events.
   *
   * @returns {boolean|undefined}
   */
  get clickable() {
    return this.#options.clickable;
  }
  /**
   * Set whether the polyline handles click events.
   *
   * @param {boolean} value Whether the polyline handles click events.
   */
  set clickable(value) {
    if (typeof value === "boolean") {
      this.#options.clickable = value;
      if (this.#polyline) {
        this.#polyline.setOptions({ clickable: value });
      }
    }
  }
  /**
   * Get whether the polyline is drawn as a dashed line.
   *
   * @returns {boolean}
   */
  get dashed() {
    return this.#dashed;
  }
  /**
   * Set whether the polyline is drawn as a dashed line.
   *
   * @param {boolean} value Whether the polyline is drawn as a dashed line.
   */
  set dashed(value) {
    if (isBoolean(value)) {
      this.#dashed = value;
      this.#options.dashed = value;
    }
    if (this.#polyline) {
      this.#setupIconsAndDashedPolylineOptions().then((opts) => {
        this.#polyline?.setOptions(opts);
      });
    }
  }
  /**
   * Get the gap between the dashes in pixels or percentage.
   *
   * @returns {string}
   */
  get dashGap() {
    return this.#dashGap;
  }
  /**
   * Set the gap between the dashes in pixels or percentage.
   *
   * If a number is set them it will be converted to a string with "px" appended.
   *
   * @param {string|number} value The gap between the dashes in pixels.
   */
  set dashGap(value) {
    const gap = getSizeWithUnit(value);
    if (isStringWithValue(gap)) {
      this.#dashGap = gap;
      this.#options.dashGap = gap;
      if (this.#polyline) {
        this.#setupIconsAndDashedPolylineOptions().then((opts) => {
          this.#polyline?.setOptions(opts);
        });
      }
    }
  }
  /**
   * Get the custom data attached to the polyline object
   *
   * @returns {CustomData}
   */
  get data() {
    return this.#customData;
  }
  /**
   * Set custom data to attach to the polyline object
   *
   * @param {CustomData} value The custom data to attach to the polyline object
   */
  set data(value) {
    if (isObject(value)) {
      this.#customData = value;
    }
  }
  /**
   * Get the highlight polyline
   *
   * @returns {Polyline|undefined}
   */
  get highlightPolyline() {
    return this.#highlightPolyline;
  }
  /**
   * Set the highlight polyline
   *
   * The highlight polyline is a polyline that is shown below the existing polyline to create a "highlight" effect.
   * This is useful when you want to show a highlight effect when the mouse hovers over the polyline.
   *
   * @param {PolylineOptions|Polyline} value The highlight polyline options or the highlight polyline class.
   */
  set highlightPolyline(value) {
    let highlight;
    if (value instanceof _Polyline) {
      highlight = value;
    } else if (isObject(value)) {
      const options = { ...this.#options, ...value };
      delete options.map;
      delete options.path;
      delete options.simplify;
      delete options.simplifyDebug;
      highlight = new _Polyline(options);
    }
    if (!highlight) {
      return;
    }
    if (highlight !== this.#highlightPolyline) {
      if (this.#highlightPolyline && this.#highlightSetup) {
        this.#highlightPolyline.setMap(null);
      }
      this.#highlightPolyline = highlight;
      this.#highlightSetup = void 0;
      this.#isHighlightReady = false;
    }
    highlight.clickable = true;
    highlight.visible = false;
    if (!this.#hasHighlightListeners) {
      this.#hasHighlightListeners = true;
      const showOnHover = () => {
        this.#isHovered = true;
        if (!this.#isHighlighted && this.#highlightPolyline && !this.#highlightPolyline.visible) {
          this.#showHighlightPolyline(() => this.#isHovered && !this.#isHighlighted);
        }
      };
      super.on("mouseover", showOnHover);
      super.on("mousemove", showOnHover);
      super.on("mouseout", () => {
        this.#isHovered = false;
        if (!this.#isHighlighted && this.#highlightPolyline) {
          this.#highlightPolyline.visible = false;
        }
      });
    }
    const highlightZIndex = highlight.zIndex;
    const thisZIndex = this.zIndex;
    if (typeof highlightZIndex !== "undefined" && typeof thisZIndex !== "undefined") {
      if (highlightZIndex >= thisZIndex) {
        highlight.zIndex = thisZIndex - 1;
      }
    } else if (typeof thisZIndex !== "undefined") {
      highlight.zIndex = thisZIndex - 1;
    } else if (typeof highlightZIndex !== "undefined") {
      this.zIndex = highlightZIndex + 1;
    } else {
      highlight.zIndex = 1;
      this.zIndex = 2;
    }
  }
  /**
   * Get the icons for the polyline
   *
   * @returns {PolylineIcon[]}
   */
  get icons() {
    return this.#options.icons || [];
  }
  /**
   * Set the icons for the polyline
   *
   * You can pass a single icon value or an array of icon values.
   * Each icon value can be an object containing the icon options or a SvgSymbol object.
   *
   * @param {PolylineIconValue|PolylineIconValue[]} value The icon value or an array of icon values.
   */
  set icons(value) {
    let setValue = false;
    if (Array.isArray(value)) {
      setValue = true;
      this.#options.icons = value.map((iconValue) => polylineIcon(iconValue));
    } else {
      this.#options.icons = [polylineIcon(value)];
      setValue = true;
    }
    if (setValue && this.#polyline) {
      this.#polyline.set(
        "icons",
        this.#options.icons.map((icon2) => icon2.toGoogle())
      );
    }
  }
  /**
   * Get the map object
   *
   * @returns {Map|null|undefined}
   */
  get map() {
    return this.#options.map;
  }
  /**
   * Set the map object
   *
   * @param {Map|null} value The map object. Set to null if you want to remove the polyline from the map.
   */
  set map(value) {
    this.setMap(value);
  }
  /**
   * Get the path of the polyline.
   *
   * The path is an array of LatLng objects defining the path of the polyline.
   *
   * The path is held as plain numbers, so the LatLng objects are created the first time that this
   * is read. Changing the returned array doesn't change the polyline. Use the path property or
   * setPath() to change the path.
   *
   * @returns {LatLngValue[]|undefined}
   */
  get path() {
    if (!this.#pathCoords) {
      return void 0;
    }
    if (!this.#pathObjects) {
      const coords = this.#pathCoords;
      const points = [];
      for (let i = 0; i < coords.length; i += 2) {
        points.push(latLng(coords[i], coords[i + 1]));
      }
      this.#pathObjects = points;
    }
    return this.#pathObjects;
  }
  /**
   * Set the path of the polyline.
   * The path is an array of LatLng values defining the path of the polyline.
   * You can pass an array of LatLng objects or an array of LatLngLiteral objects.
   *
   * @param {LatLngValue[]} value The path of the polyline.
   */
  set path(value) {
    if (Array.isArray(value)) {
      this.#setPathCoords(coordsFromPath(value));
    }
  }
  /**
   * Get how far, in meters, the line drawn on the map is allowed to be from the original path.
   *
   * If the tolerance changes with the zoom level, this is the tolerance for the current zoom level.
   *
   * @returns {number} 0 if the path isn't simplified.
   */
  get simplify() {
    return this.#simplifyTolerance;
  }
  /**
   * Set whether to simplify the path that is drawn on the map.
   *
   * Simplifying gives the map fewer points to draw but keeps the same shape.
   * The path property still holds every point.
   *
   * @param {boolean|number|string|PolylineSimplifyOptions} value How far, in meters, the drawn line can be from the
   *      original path. true uses 2 meters. 'zoom' uses the default tolerances for different zoom levels. false or 0
   *      turns simplifying off. Use an object to set your own tolerances for different zoom levels or to log debug information.
   */
  set simplify(value) {
    const config = getSimplifyConfig(value);
    const isOff = value === false || isNumberOrNumberString(value) && Number(value) === 0;
    if (!config && !isOff) {
      return;
    }
    const wasDebug = this.#isSimplifyDebug();
    this.#simplifyConfig = config;
    if (!config) {
      this.#options.simplify = false;
    } else if (value === "zoom") {
      this.#options.simplify = "zoom";
    } else {
      this.#options.simplify = isObject(value) ? value : config.tolerance;
    }
    this.#simplifiedPaths = {};
    this.#updateZoomListener();
    const hasChanged = this.#applySimplify();
    if (!hasChanged && !wasDebug) {
      this.#logCurrentSimplify();
    }
  }
  /**
   * Get whether debug information is logged to the console each time the path is simplified
   *
   * @returns {boolean}
   */
  get simplifyDebug() {
    return this.#isSimplifyDebug();
  }
  /**
   * Set whether to log debug information to the console each time the path is simplified.
   *
   * This is the same as the "debug" simplify option. If it's set, it's used instead of the "debug" simplify option.
   *
   * @param {boolean} value Whether to log debug information
   */
  set simplifyDebug(value) {
    if (isBoolean(value)) {
      const wasDebug = this.#isSimplifyDebug();
      this.#simplifyDebug = value;
      this.#options.simplifyDebug = value;
      if (!wasDebug) {
        this.#logCurrentSimplify();
      }
    }
  }
  /**
   * Get the SVG stroke color
   *
   * @returns {string|undefined}
   */
  get strokeColor() {
    return this.#options.strokeColor;
  }
  /**
   * Set the SVG stroke color.
   *
   * @param {string} value The SVG stroke color.
   */
  set strokeColor(value) {
    if (isStringWithValue(value)) {
      this.#options.strokeColor = value;
      if (this.#polyline) {
        this.#polyline.setOptions({ strokeColor: value });
      }
    }
  }
  /**
   * Get the opacity of the stroke.
   * The opacity of the stroke, where 0 is fully transparent and 1 is fully opaque.
   *
   * @returns {number|undefined}
   */
  get strokeOpacity() {
    return this.#options.strokeOpacity;
  }
  /**
   * Set the opacity of the stroke.
   *
   * @param {number|string} value The opacity of the stroke.
   */
  set strokeOpacity(value) {
    if (isNumberOrNumberString(value)) {
      if (isNumber(value)) {
        this.#options.strokeOpacity = value;
      } else if (isNumberString(value)) {
        this.#options.strokeOpacity = Number(value);
      }
      if (this.#polyline) {
        if (this.#dashed) {
          this.#setupIconsAndDashedPolylineOptions().then((opts) => {
            this.#polyline?.setOptions(opts);
          });
        } else {
          this.#polyline.setOptions({ strokeOpacity: this.#options.strokeOpacity });
        }
      }
    }
  }
  /**
   * Get the weight of the stroke in pixels.
   *
   * @returns {number|undefined}
   */
  get strokeWeight() {
    return this.#options.strokeWeight;
  }
  /**
   * Set the weight of the stroke.
   *
   * @param {number|string} value The weight of the stroke.
   */
  set strokeWeight(value) {
    if (isNumberOrNumberString(value)) {
      if (isNumber(value)) {
        this.#options.strokeWeight = value;
      } else if (isNumberString(value)) {
        this.#options.strokeWeight = Number(value);
      }
      if (this.#polyline) {
        if (this.#dashed) {
          this.#setupIconsAndDashedPolylineOptions().then((opts) => {
            this.#polyline?.setOptions(opts);
          });
        } else {
          this.#polyline.setOptions({ strokeWeight: Number(value) });
        }
      }
    }
  }
  /**
   * Get whether the polyline is visible on the map.
   *
   * @returns {boolean|undefined}
   */
  get visible() {
    return this.#options.visible;
  }
  /**
   * Set whether the polyline is visible on the map.
   *
   * @param {boolean} value Whether the polyline is visible on the map.
   */
  set visible(value) {
    if (typeof value === "boolean") {
      this.#options.visible = value;
      this.isVisible = value;
      if (value && this.#isSimplifyOutOfDate) {
        this.#applySimplify();
      }
      if (this.#polyline) {
        this.#polyline.setVisible(value);
      }
    }
  }
  /**
   * Get the zIndex of the polyline.
   *
   * @returns {number|undefined}
   */
  get zIndex() {
    return this.#options.zIndex;
  }
  /**
   * Set the zIndex of the polyline.
   *
   * @param {number|string} value The zIndex of the polyline.
   */
  set zIndex(value) {
    if (isNumberOrNumberString(value)) {
      if (isNumber(value)) {
        this.#options.zIndex = value;
      } else if (isNumberString(value)) {
        this.#options.zIndex = Number(value);
      }
      if (this.#polyline) {
        this.#polyline.setOptions({ zIndex: Number(value) });
      }
    }
  }
  /**
   * Clones the polyline
   *
   * @returns {Polyline}
   */
  clone() {
    const clone = new _Polyline();
    if (this.#highlightPolyline) {
      clone.setHighlightPolyline(this.#highlightPolyline.clone());
    }
    clone.setOptions(this.#options);
    if (this.#pathCoords) {
      clone.#setPathCoords(this.#pathCoords);
    }
    clone.data = this.#customData;
    clone.setMap(this.getMap());
    if (isObjectWithValues(this.tooltipConfig)) {
      clone.attachTooltip(this.tooltipConfig);
    }
    return clone;
  }
  /**
   * Get any custom data attached to the marker object.
   *
   * Optionally pass a data key to get the value for that key.
   *
   * @param {string} [key] The object key to get data for. If not set then all data is returned.
   * @returns {any}
   */
  getData(key) {
    if (isStringWithValue(key)) {
      if (objectHasValue(this.#customData, key)) {
        return this.#customData[key];
      }
      return null;
    }
    return this.#customData;
  }
  /**
   * Returns whether the polyline has a zIndex set.
   *
   * @returns {boolean}
   */
  hasZIndex() {
    return typeof this.#options.zIndex !== "undefined";
  }
  /**
   * Hide the polyline
   *
   * @returns {Polyline}
   */
  hide() {
    this.visible = false;
    if (this.#highlightPolyline) {
      this.#highlightPolyline.visible = false;
    }
    return this;
  }
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
  highlight(options) {
    if (this.visible !== false && this.#highlightPolyline) {
      if (isObject(options)) {
        this.#highlightOriginalOptions = {
          clickable: this.#highlightPolyline.clickable,
          dashed: this.#highlightPolyline.dashed,
          dashGap: this.#highlightPolyline.dashGap,
          icons: this.#highlightPolyline.icons,
          strokeColor: this.#highlightPolyline.strokeColor,
          strokeOpacity: this.#highlightPolyline.strokeOpacity,
          strokeWeight: this.#highlightPolyline.strokeWeight,
          zIndex: this.#highlightPolyline.zIndex
        };
        const allowedOptions = [
          "clickable",
          "dashed",
          "dashGap",
          "icons",
          "strokeColor",
          "strokeOpacity",
          "strokeWeight",
          "zIndex"
        ];
        const highlightOptions = {};
        allowedOptions.forEach((option) => {
          if (isDefined(options[option])) {
            highlightOptions[option] = options[option];
          }
        });
        if (Object.keys(highlightOptions).length > 0) {
          this.#highlightPolyline.setOptions(highlightOptions);
        }
      }
      this.#isHighlighted = true;
      this.#showHighlightPolyline(() => this.#isHighlighted);
    }
    return this;
  }
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
  init() {
    return new Promise((resolve) => {
      this.#setupGooglePolyline().then(() => {
        resolve();
      });
    });
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
    if (this.#highlightPolyline && type !== PolylineEvents.READY) {
      this.#highlightPolyline.off(type, callback, options);
    }
    super.off(type, callback, options);
  }
  /**
   * @inheritdoc
   */
  removeCalledOnceListeners(type, listeners) {
    if (this.#highlightPolyline && type !== PolylineEvents.READY) {
      listeners.forEach((listener) => {
        this.#highlightPolyline?.off(type, listener.callback, listener.options);
      });
    }
    super.removeCalledOnceListeners(type, listeners);
  }
  /**
   * @inheritdoc
   */
  on(type, callback, config) {
    if (this.#highlightPolyline && type !== PolylineEvents.READY) {
      this.#highlightPolyline.on(type, callback, config);
    }
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
   * Add an event listener for when the polyline is loaded and ready for use.
   *
   * @param {EventCallback} [callback] The callback function to call when the event is dispatched.
   */
  onReady(callback) {
    this.on(PolylineEvents.READY, callback);
  }
  /**
   * Sets the polyline to be drawn as a dashed line
   *
   * @param {boolean} dashed Whether the polyline is drawn as a dashed line
   * @param {string|number} [dashGap] The gap between the dashes in pixels or percentage.
   * @returns {Polyline} The polyline object
   */
  setDashed(dashed, dashGap) {
    this.dashed = dashed;
    if (dashed && isDefined(dashGap)) {
      this.dashGap = dashGap;
    }
    return this;
  }
  /**
   * Set the gap between the dashes in pixels.
   *
   * @param {string|number} gap The gap between the dashes in pixels or percentage. This is only used if the polyline is drawn as a dashed line.
   * @returns {Polyline} The polyline object
   */
  setDashGap(gap) {
    this.dashGap = gap;
    return this;
  }
  /**
   * Set the highlight polyline
   *
   * The highlight polyline is a polyline that is shown below the existing polyline to create a "highlight" effect.
   * This is useful when you want to show a highlight effect when the mouse hovers over the polyline.
   *
   * @param {PolylineOptions|Polyline} value The highlight polyline options or the highlight polyline class.
   * @returns {Polyline}
   */
  setHighlightPolyline(value) {
    this.highlightPolyline = value;
    return this;
  }
  /**
   * Set the icons for the polyline
   *
   * You can pass a single icon value or an array of icon values.
   * Each icon value can be an object containing the icon options or a SvgSymbol object.
   *
   * @param {PolylineIconValue|PolylineIconValue[]} value The icon value or an array of icon values.
   * @returns {Polyline} The polyline object
   */
  setIcons(value) {
    this.icons = value;
    return this;
  }
  /**
   * Adds the polyline to the map object
   *
   * Alternate of show()
   *
   * @param {Map} value The map object. Set to null if you want to remove the polyline from the map.
   * @param {boolean} [isVisible] Whether the polyline as visible on the map.
   * @returns {Promise<Polyline>}
   */
  async setMap(value, isVisible = true) {
    this.#requestedMap = value instanceof Map ? value : null;
    this.#updateZoomListener();
    this.#applySimplify();
    if (this.#highlightPolyline && this.#highlightSetup) {
      this.#highlightPolyline.setMap(value, false);
    }
    const googlePolyline = await this.#setupGooglePolyline(value ?? void 0);
    if (value instanceof Map) {
      this.visible = isVisible;
      this.#options.map = value;
      super.setMap(value);
      googlePolyline.setMap(value.toGoogle() ?? null);
    } else if (isNullOrUndefined(value)) {
      this.#options.map = null;
      super.setMap(null);
      if (this.#polyline) {
        this.#polyline.setMap(null);
      }
    }
    return this;
  }
  /**
   * Set the Polyline options
   *
   * @param {PolylineOptions} options The Polyline options
   * @returns {Polyline}
   */
  setOptions(options) {
    if (isObject(options)) {
      if (isBoolean(options.simplifyDebug)) {
        this.simplifyDebug = options.simplifyDebug;
      }
      if (isDefined(options.simplify)) {
        this.simplify = options.simplify;
      }
      if (typeof options.clickable === "boolean") {
        this.clickable = options.clickable;
      }
      if (isBoolean(options.dashed)) {
        this.dashed = options.dashed;
      }
      if (isDefined(options.dashGap)) {
        this.dashGap = options.dashGap;
      }
      if (options.icons) {
        this.icons = options.icons;
      }
      if (options.path) {
        this.path = options.path;
      }
      if (options.map) {
        this.setMap(options.map);
      }
      if (isStringWithValue(options.strokeColor)) {
        this.strokeColor = options.strokeColor;
      }
      if (isNumberOrNumberString(options.strokeOpacity)) {
        this.strokeOpacity = options.strokeOpacity;
      }
      if (isNumberOrNumberString(options.strokeWeight)) {
        this.strokeWeight = options.strokeWeight;
      }
      if (typeof options.visible === "boolean") {
        this.visible = options.visible;
      }
      if (isNumberOrNumberString(options.zIndex)) {
        this.zIndex = options.zIndex;
      }
      if (options.tooltip) {
        this.attachTooltip(options.tooltip);
      }
      if (options.highlightPolyline) {
        this.setHighlightPolyline(options.highlightPolyline);
      }
      if (options.data) {
        this.data = options.data;
      }
    }
    return this;
  }
  /**
   * Set whether to simplify the path that is drawn on the map.
   *
   * Simplifying gives the map fewer points to draw but keeps the same shape.
   * The path property still holds every point.
   *
   * @param {boolean|number|string|PolylineSimplifyOptions} value How far, in meters, the drawn line can be from the
   *      original path. true uses 2 meters. 'zoom' uses the default tolerances for different zoom levels. false or 0
   *      turns simplifying off. Use an object to set your own tolerances for different zoom levels or to log debug information.
   * @returns {Polyline}
   */
  setSimplify(value) {
    this.simplify = value;
    return this;
  }
  /**
   * Set whether to log debug information to the console each time the path is simplified.
   *
   * This is the same as the "debug" simplify option. If it's set, it's used instead of the "debug" simplify option.
   *
   * @param {boolean} value Whether to log debug information
   * @returns {Polyline}
   */
  setSimplifyDebug(value) {
    this.simplifyDebug = value;
    return this;
  }
  /**
   * Se the path of the polyline.
   *
   * @param {LatLngValue[]} path The path of the polyline.
   * @returns {Polyline}
   */
  setPath(path) {
    this.path = path;
    return this;
  }
  /**
   * Set the SVG stroke color.
   *
   * @param {string} strokeColor The SVG stroke color.
   * @returns {Polyline}
   */
  setStrokeColor(strokeColor) {
    this.strokeColor = strokeColor;
    return this;
  }
  /**
   * Set the opacity of the stroke.
   *
   * @param {number|string} strokeOpacity The opacity of the stroke.
   * @returns {Polyline}
   */
  setStrokeOpacity(strokeOpacity) {
    this.strokeOpacity = strokeOpacity;
    return this;
  }
  /**
   * Set the weight of the stroke.
   *
   * @param {number|string} strokeWeight The weight of the stroke.
   * @returns {Polyline}
   */
  setStrokeWeight(strokeWeight) {
    this.strokeWeight = strokeWeight;
    return this;
  }
  /**
   * Set whether the polyline is visible on the map.
   *
   * @param {boolean} visible Whether the polyline is visible on the map.
   * @returns {Polyline}
   */
  setVisible(visible) {
    this.visible = visible;
    return this;
  }
  /**
   * Show the polyline on the map
   *
   * This will also set the map object if it's passed
   *
   * @param {Map} [map] The map object. Don't need to pass this if the map is already set on the polyline.
   * @returns {Promise<Polyline>}
   */
  show(map2) {
    return new Promise((resolve) => {
      this.visible = true;
      if (map2) {
        this.setMap(map2).then(() => {
          resolve(this);
        });
      } else {
        resolve(this);
      }
    });
  }
  /**
   * Get the Google maps Polyline object
   *
   * https://developers.google.com/maps/documentation/javascript/reference/info-window#Polyline
   *
   * @returns {Promise<google.maps.Polyline>}
   */
  toGoogle() {
    return new Promise((resolve) => {
      this.#setupGooglePolyline().then((googlePolyline) => {
        resolve(googlePolyline);
      });
    });
  }
  /**
   * Hide the highlight polyline if it exists
   *
   * @returns {Polyline}
   */
  unhighlight() {
    if (this.#highlightPolyline) {
      this.#isHighlighted = false;
      if (Object.keys(this.#highlightOriginalOptions).length > 0) {
        this.#highlightPolyline.setOptions(this.#highlightOriginalOptions);
        this.#highlightOriginalOptions = {};
      }
      this.#highlightPolyline.visible = false;
    }
    return this;
  }
  /**
   * Get the path to give to the Google Maps polyline.
   *
   * The path is simplified if a simplify tolerance is set. Otherwise it has every point.
   *
   * @private
   * @returns {google.maps.LatLng[]}
   */
  #getGooglePath() {
    const start = performance.now();
    const coords = this.#pathCoords ?? new Float64Array(0);
    const tolerance = this.#simplifyTolerance;
    const useKeptPaths = tolerance > 0 && (this.#simplifyConfig?.zoom.length ?? 0) > 0;
    let googlePath = useKeptPaths ? this.#simplifiedPaths[tolerance] : void 0;
    const isKeptPath = typeof googlePath !== "undefined";
    if (!googlePath) {
      const drawCoords = tolerance > 0 ? simplifyCoords(coords, tolerance) : coords;
      googlePath = [];
      for (let i = 0; i < drawCoords.length; i += 2) {
        googlePath.push(new google.maps.LatLng(drawCoords[i], drawCoords[i + 1]));
      }
      if (useKeptPaths) {
        this.#simplifiedPaths[tolerance] = googlePath;
      }
    }
    if (this.#isSimplifyDebug()) {
      let detail = "";
      if (isKeptPath) {
        detail = "Used the path that was already simplified.";
      } else if (tolerance > 0) {
        detail = `Took ${(performance.now() - start).toFixed(1)} ms.`;
      }
      this.#logSimplify(googlePath.length, detail);
    }
    return isKeptPath || useKeptPaths ? googlePath.slice() : googlePath;
  }
  /**
   * Set the path from the latitude and longitude of each point, one after the other.
   *
   * The array is used as it is and is never changed, so it can be shared with the highlight
   * polyline and with clones.
   *
   * @private
   * @param {Float64Array} coords The path as the latitude and longitude of each point
   */
  #setPathCoords(coords) {
    this.#pathCoords = coords;
    this.#pathObjects = void 0;
    this.#simplifiedPaths = {};
    if (this.#polyline) {
      this.#polyline.setPath(this.#getGooglePath());
    }
    if (this.#highlightPolyline && this.#highlightSetup) {
      this.#highlightPolyline.#setPathCoords(coords);
    }
  }
  /**
   * Returns whether debug information about simplifying is logged to the console.
   *
   * The simplifyDebug option is used if it's set. Otherwise the "debug" simplify option is used.
   *
   * @private
   * @returns {boolean}
   */
  #isSimplifyDebug() {
    return this.#simplifyDebug ?? this.#simplifyConfig?.debug ?? false;
  }
  /**
   * Log to the console how many points are drawn, if debug is on.
   *
   * @private
   * @param {number} drawnCount The number of points in the path drawn on the map
   * @param {string} detail Extra information to add to the end of the message
   */
  #logSimplify(drawnCount, detail) {
    const pathCount = this.#pathCoords ? this.#pathCoords.length / 2 : 0;
    if (!this.#isSimplifyDebug() || pathCount === 0) {
      return;
    }
    const tolerance = this.#simplifyTolerance;
    const zoomText = (this.#simplifyConfig?.zoom.length ?? 0) > 0 && this.#requestedMap ? ` at zoom ${this.#requestedMap.zoom}` : "";
    let message = `[Polyline simplify] ${pathCount.toLocaleString()} points in the path, `;
    if (tolerance > 0) {
      const fewer = (100 - drawnCount / pathCount * 100).toFixed(1);
      message += `${drawnCount.toLocaleString()} drawn (${fewer}% fewer) with a ${tolerance} m tolerance${zoomText}.`;
    } else {
      message += `all drawn (not simplified${zoomText}).`;
    }
    if (detail) {
      message += ` ${detail}`;
    }
    console.log(message, this);
  }
  /**
   * Log what is drawn on the map now, if debug is on and the Google polyline exists.
   *
   * @private
   */
  #logCurrentSimplify() {
    if (this.#polyline) {
      this.#logSimplify(this.#polyline.getPath().getLength(), "");
    }
  }
  /**
   * Get the simplify tolerance to use now.
   *
   * If there are tolerances for different zoom levels then the one for the map's current zoom level is used.
   *
   * @private
   * @returns {number} 0 if the path shouldn't be simplified
   */
  #getCurrentTolerance() {
    const config = this.#simplifyConfig;
    if (!config) {
      return 0;
    }
    if (config.zoom.length > 0 && this.#requestedMap) {
      const { zoom } = this.#requestedMap;
      let tolerance;
      config.zoom.forEach((z) => {
        if (zoom >= z.level) {
          tolerance = z.tolerance;
        }
      });
      if (typeof tolerance !== "undefined") {
        return tolerance;
      }
    }
    return config.tolerance;
  }
  /**
   * Update the path drawn on the map if the simplify tolerance to use has changed.
   *
   * If the polyline is hidden then the path isn't updated until the polyline is shown again.
   * This saves simplifying the paths of hidden polylines, for example ones hidden with PolylineCollection.hide(),
   * each time the zoom level changes.
   *
   * @private
   * @returns {boolean} Whether the path drawn on the map was updated
   */
  #applySimplify() {
    const tolerance = this.#getCurrentTolerance();
    if (tolerance === this.#simplifyTolerance) {
      this.#isSimplifyOutOfDate = false;
      return false;
    }
    if (this.#polyline && this.#options.visible === false) {
      this.#isSimplifyOutOfDate = true;
      return false;
    }
    this.#isSimplifyOutOfDate = false;
    this.#simplifyTolerance = tolerance;
    if (this.#polyline) {
      this.#polyline.setPath(this.#getGooglePath());
    }
    if (this.#highlightPolyline && this.#highlightSetup) {
      this.#highlightPolyline.simplify = tolerance;
    }
    return true;
  }
  /**
   * Listen for the map to finish moving so that the tolerance can be updated for the zoom level.
   *
   * The listener is only needed when there are tolerances for different zoom levels and the polyline is on a map.
   * It's removed otherwise so that the map doesn't hold on to the polyline.
   *
   * @private
   */
  #updateZoomListener() {
    const map2 = this.#simplifyConfig && this.#simplifyConfig.zoom.length > 0 ? this.#requestedMap : null;
    if (map2 === this.#zoomListenerMap) {
      return;
    }
    if (this.#zoomListenerMap) {
      this.#zoomListenerMap.off("idle", this.#handleMapIdle);
    }
    if (map2) {
      map2.on("idle", this.#handleMapIdle);
    }
    this.#zoomListenerMap = map2;
  }
  /**
   * Update the tolerance after the map finishes moving, in case the zoom level changed.
   *
   * This uses the "idle" event instead of "zoom_changed" so that the path isn't simplified
   * while the map is still zooming.
   *
   * @private
   */
  #handleMapIdle = () => {
    this.#applySimplify();
  };
  /**
   * Set up the highlight polyline on the map if it hasn't been already.
   *
   * This gives the highlight polyline this polyline's path and adds it to the map, hidden.
   * It's done the first time the highlight polyline is shown rather than when it's set.
   *
   * @private
   * @returns {Promise<void>}
   */
  #setupHighlightPolyline() {
    const highlight = this.#highlightPolyline;
    if (!highlight) {
      return Promise.resolve();
    }
    if (!this.#highlightSetup) {
      highlight.simplify = this.#simplifyTolerance;
      if (this.#pathCoords) {
        highlight.#setPathCoords(this.#pathCoords);
      }
      const map2 = this.getMap();
      const setup = map2 ? highlight.setMap(map2, false) : Promise.resolve();
      this.#highlightSetup = setup.then(() => {
        if (this.#highlightPolyline === highlight) {
          this.#isHighlightReady = true;
        }
      });
    }
    return this.#highlightSetup;
  }
  /**
   * Show the highlight polyline, setting it up first if necessary.
   *
   * The highlight polyline is shown right away if it's already set up. Otherwise it's shown
   * once it's set up, as long as it should still be shown.
   *
   * @private
   * @param {() => boolean} shouldShow Returns whether the highlight polyline should still be shown
   */
  #showHighlightPolyline(shouldShow) {
    const show = () => {
      if (this.#highlightPolyline && shouldShow()) {
        this.#highlightPolyline.visible = true;
      }
    };
    if (this.#isHighlightReady) {
      show();
    } else {
      this.#setupHighlightPolyline().then(show);
    }
  }
  /**
   * Set up the options for a dashed polyline and icons
   *
   * See https://developers.google.com/maps/documentation/javascript/examples/overlay-symbol-dashed for details
   *
   * @returns {Promise<google.maps.PolylineOptions>} The Google maps Polyline options
   */
  #setupIconsAndDashedPolylineOptions() {
    return new Promise((resolve) => {
      (async () => {
        const options = {};
        if (this.#dashed) {
          const lineSymbol = svgSymbol({
            path: "M 0,-1 0,1",
            strokeOpacity: 1,
            scale: 3
          });
          if (isDefined(this.#options.strokeOpacity)) {
            lineSymbol.strokeOpacity = this.#options.strokeOpacity;
          }
          if (isDefined(this.#options.strokeWeight)) {
            lineSymbol.scale = this.#options.strokeWeight;
          }
          options.strokeOpacity = 0;
          const icon2 = polylineIcon({
            icon: lineSymbol,
            offset: "0",
            repeat: this.#dashGap
          });
          options.icons = [await icon2.toGoogle()];
          if (Array.isArray(this.#options.icons) && this.#options.icons.length > 0) {
            const additionalIcons = await Promise.all(
              this.#options.icons.map((icn) => {
                const returnIcon = polylineIcon(icn);
                const iconIcn = returnIcon.icon;
                if (iconIcn) {
                  if (isDefined(this.#options.strokeOpacity)) {
                    iconIcn.strokeOpacity = this.#options.strokeOpacity;
                  } else {
                    iconIcn.strokeOpacity = 1;
                  }
                }
                return returnIcon.toGoogle();
              })
            );
            options.icons = options.icons.concat(additionalIcons);
          }
        } else {
          options.strokeOpacity = isNumberOrNumberString(this.#options.strokeOpacity) ? this.#options.strokeOpacity : 1;
          options.icons = [];
          if (Array.isArray(this.#options.icons) && this.#options.icons.length > 0) {
            options.icons = await Promise.all(this.#options.icons.map((icn) => icn.toGoogle()));
          }
        }
        resolve(options);
      })();
    });
  }
  /**
   * Set up the Google maps Polyline object if necessary
   *
   * @param {Map} [map] The map object. If it's set then it will be initialized if the Google maps object isn't available yet.
   * @private
   * @returns {Promise<google.maps.Polyline>} The Google maps Polyline object once it's set up
   */
  #setupGooglePolyline(map2) {
    return new Promise((resolve) => {
      if (!isObject(this.#polyline)) {
        if (checkForGoogleMaps("Polyline", "Polyline", false)) {
          const googlePolyline = this.#createPolylineObject();
          this.dispatch(PolylineEvents.READY);
          resolve(googlePolyline);
        } else {
          loader().onMapLoad(() => {
            const googlePolyline = this.#createPolylineObject();
            const thisMap = this.getMap();
            if (thisMap) {
              googlePolyline.setMap(thisMap.toGoogle() ?? null);
              if (this.#highlightPolyline && this.#highlightSetup) {
                this.#highlightPolyline.setMap(thisMap, false);
              }
            }
            this.dispatch(PolylineEvents.READY);
            resolve(googlePolyline);
          });
          if (map2 instanceof Map) {
            map2.init();
          }
        }
      } else {
        resolve(this.#polyline);
      }
    });
  }
  /**
   * Set up the Google maps polyline object syncronously.
   */
  #setupGooglePolylineSync() {
    if (!isObject(this.#polyline)) {
      if (checkForGoogleMaps("Polyline", "Polyline", false)) {
        this.#createPolylineObject();
      } else {
        throw new Error(
          "The Google maps libray is not available so the polyline object cannot be created. Load the Google maps library first."
        );
      }
    }
  }
  /**
   * Create the polyline object if it doesn't already exist
   *
   * @private
   * @returns {google.maps.Polyline} The Google maps Polyline object
   */
  #createPolylineObject() {
    if (!this.#polyline) {
      const polylineOptions = {};
      const optionsToSet = [
        "clickable",
        "strokeColor",
        "strokeOpacity",
        "strokeWeight",
        "visible",
        "zIndex"
      ];
      optionsToSet.forEach((key) => {
        if (typeof this.#options[key] !== "undefined") {
          polylineOptions[key] = this.#options[key];
        }
      });
      if (this.#options.map) {
        polylineOptions.map = this.#options.map.toGoogle();
      }
      polylineOptions.path = this.#getGooglePath();
      const googlePolyline = new google.maps.Polyline(polylineOptions);
      this.#polyline = googlePolyline;
      this.#setupIconsAndDashedPolylineOptions().then((opts) => {
        googlePolyline.setOptions(opts);
        this.setEventGoogleObject(googlePolyline);
      });
      return googlePolyline;
    }
    return this.#polyline;
  }
};
var polyline = (options) => {
  if (options instanceof Polyline) {
    return options;
  }
  return new Polyline(options);
};

// src/lib/PolylineCollection.ts
var defaultTag2 = "__default__";
var PolylineCollection = class _PolylineCollection {
  constructor() {
    /**
     * Holds the Polyline objects by tag
     */
    this.polylines = {};
  }
  /**
   * Adds an Polyline to the collection
   *
   * @param {Polyline} p The Polyline object to add
   * @param {string} tag The tag to assign the polyline to.
   */
  #add(p, tag) {
    if (!this.polylines[tag]) {
      this.polylines[tag] = /* @__PURE__ */ new Set();
    }
    this.polylines[tag].add(p);
  }
  /**
   * Adds an Polyline to the collection
   *
   * @param {Polyline} p The Polyline object to add
   * @param {string|string[]} [tag] The tag(s) to assign the polyline to. Either a single tag or an array of tags can be passed.
   */
  add(p, tag) {
    if (isString(tag)) {
      this.#add(p, tag);
    } else if (Array.isArray(tag) && tag.length > 0) {
      tag.forEach((t) => {
        if (isString(t)) {
          this.#add(p, t);
        }
      });
    } else {
      this.#add(p, defaultTag2);
    }
  }
  /**
   * Clears the collection
   *
   * This also hides all the polylines in the collection.
   */
  clear() {
    Object.keys(this.polylines).forEach((tag) => {
      this.polylines[tag].forEach((p) => {
        p.setMap(null);
      });
    });
    this.polylines = {};
  }
  /**
   * Clones the collection
   *
   * @returns {PolylineCollection}
   */
  clone() {
    const clone = new _PolylineCollection();
    Object.keys(this.polylines).forEach((tag) => {
      this.polylines[tag].forEach((p) => {
        clone.add(p, tag);
      });
    });
    return clone;
  }
  /**
   * Returns true if the collection has any polylines
   *
   * @returns {boolean}
   */
  hasData() {
    return Object.keys(this.polylines).length > 0;
  }
  /**
   * Hide the Polylines in the collection that have the tag passed
   *
   * @param {string} tag The tag to hide polylines for.
   */
  #hide(tag) {
    if (this.polylines[tag]) {
      this.polylines[tag].forEach((p) => {
        p.hide();
      });
    }
  }
  /**
   * Hide the Polylines in the collection that have the tag(s) passed
   *
   * @param {string|string[]} tag The tag(s) to hide polylines for. Either a single tag string or an array of tag strings can be passed.
   */
  hide(tag) {
    if (isString(tag)) {
      this.#hide(tag);
    } else if (Array.isArray(tag)) {
      tag.forEach((t) => {
        if (isString(t)) {
          this.#hide(t);
        }
      });
    }
  }
  /**
   * Hides all the Polylines in the collection
   */
  hideAll() {
    Object.keys(this.polylines).forEach((tag) => {
      this.polylines[tag].forEach((p) => {
        p.hide();
      });
    });
  }
  /**
   * Highlight the Polylines in the collection that have the tag(s) passed
   *
   * @param {string} tag The tag to highlight polylines for.
   * @param {PolylineOptions} [highlightOptions] The options to use for highlighting the polylines. This will override the current options for the highlight polyline.
   */
  #highlight(tag, highlightOptions) {
    if (this.polylines[tag]) {
      this.polylines[tag].forEach((p) => {
        p.highlight(highlightOptions);
      });
    }
  }
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
  highlight(tag, highlightOptions) {
    if (isString(tag)) {
      this.#highlight(tag, highlightOptions);
    } else if (Array.isArray(tag)) {
      tag.forEach((t) => {
        if (isString(t)) {
          this.#highlight(t, highlightOptions);
        }
      });
    }
  }
  /**
   * Highlight all the Polylines in the collection
   */
  highlightAll() {
    Object.keys(this.polylines).forEach((tag) => {
      this.polylines[tag].forEach((p) => {
        p.highlight();
      });
    });
  }
  /**
   * Returns true if the collection has no polylines
   *
   * @returns {boolean}
   */
  isEmpty() {
    return Object.keys(this.polylines).length === 0;
  }
  /**
   * Remove the polyline from the collection by tag.
   *
   * @param {Polyline} p The polyline object to remove
   * @param {string} tag The tag to remove the polyline from.
   */
  #removeByTag(p, tag) {
    if (this.polylines[tag]) {
      this.polylines[tag].delete(p);
    }
  }
  /**
   * Remove the polyline from the collection, optionally by tag.
   *
   * @param {Polyline} p The polyline object to remove
   * @param {string|string[]} [tag] The tag(s) to remove the polyline from. If not set then the polyline is removed from all tags.
   *      Either a single tag string or an array of tag strings can be passed.
   */
  remove(p, tag) {
    if (isString(tag)) {
      this.#removeByTag(p, tag);
    } else if (Array.isArray(tag) && tag.length > 0) {
      tag.forEach((t) => {
        if (isString(t)) {
          this.#removeByTag(p, t);
        }
      });
    } else {
      Object.keys(this.polylines).forEach((t) => {
        this.polylines[t].delete(p);
      });
    }
  }
  /**
   * Set options for the Polylines in the collection that have the tag(s) passed
   *
   * @param {PolylineOptions} options The options to set for the polylines.
   * @param {string} tag The tag to show polylines for.
   */
  #setOptions(options, tag) {
    if (this.polylines[tag]) {
      this.polylines[tag].forEach((p) => {
        p.setOptions(options);
      });
    }
  }
  /**
   * Set options for either all polylines in the collection or for the polylines that have the tag(s) passed.
   *
   * @param {PolylineOptions} options The options to set for the polylines.
   * @param {string|string[]} [tag] The tag(s) to show polylines for. Either a single tag string or an array of tag strings can be passed.
   */
  setOptions(options, tag) {
    if (isString(tag)) {
      this.#setOptions(options, tag);
    } else if (Array.isArray(tag)) {
      tag.forEach((t) => {
        if (isString(t)) {
          this.#setOptions(options, t);
        }
      });
    } else {
      Object.keys(this.polylines).forEach((t) => {
        this.polylines[t].forEach((p) => {
          p.setOptions(options);
        });
      });
    }
  }
  /**
   * Show the Polylines in the collection that have the tag(s) passed
   *
   * @param {string} tag The tag to show polylines for.
   * @param {Map} [map] The map object
   */
  #show(tag, map2) {
    if (this.polylines[tag]) {
      this.polylines[tag].forEach((p) => {
        p.show(map2);
      });
    }
  }
  /**
   * Show the Polylines in the collection that have the tag(s) passed
   *
   * @param {string|string[]} tag The tag(s) to show polylines for. Either a single tag string or an array of tag strings can be passed.
   * @param {Map} [map] The map object
   */
  show(tag, map2) {
    if (isString(tag)) {
      this.#show(tag, map2);
    } else if (Array.isArray(tag)) {
      tag.forEach((t) => {
        if (isString(t)) {
          this.#show(t, map2);
        }
      });
    }
  }
  /**
   * Show all the Polylines in the collection
   *
   * @param {Map} [map] The map object
   */
  showAll(map2) {
    Object.keys(this.polylines).forEach((tag) => {
      this.polylines[tag].forEach((p) => {
        p.show(map2);
      });
    });
  }
  /**
   * Hide the hightlight for the Polylines in the collection that have the tag(s) passed
   *
   * @param {string} tag The tag to hide the highlighted polylines.
   */
  #unhighlight(tag) {
    if (this.polylines[tag]) {
      this.polylines[tag].forEach((p) => {
        p.unhighlight();
      });
    }
  }
  /**
   * Hide the hightlight for the Polylines in the collection that have the tag(s) passed
   *
   * @param {string|string[]} tag The tag(s) to hide the highlighted polylines. Either a single tag string or an array of tag strings can be passed.
   */
  unhighlight(tag) {
    if (isString(tag)) {
      this.#unhighlight(tag);
    } else if (Array.isArray(tag)) {
      tag.forEach((t) => {
        if (isString(t)) {
          this.#unhighlight(t);
        }
      });
    }
  }
  /**
   * Hide the hightlight for all the Polylines in the collection
   */
  unhighlightAll() {
    Object.keys(this.polylines).forEach((tag) => {
      this.polylines[tag].forEach((p) => {
        p.unhighlight();
      });
    });
  }
};
var polylineCollection = () => new PolylineCollection();

// src/lib/Popup.ts
var Popup = class extends Overlay {
  /**
   * Whether to automatically close other open popups when opening this one
   *
   * @private
   * @type {boolean}
   */
  #autoClose = true;
  /**
   * Whether to center the popup on the element. Useful if the popup is on a marker.
   *
   * @private
   * @type {boolean}
   */
  #center = true;
  /**
   * The amount of space between the popup and the map viewport edge
   *
   * This is used when the map is panned to bring the popup into view.
   *
   * @private
   * @type {Size}
   */
  #clearance;
  /**
   * The element to close the popup. This can be a CSS selector or an HTMLElement.
   *
   * @private
   * @type {HTMLElement|string|undefined}
   */
  #closeElement;
  /**
   * Holds the popup content.
   * This can be a simple string of text, string of HTML code, or an HTMLElement.
   *
   * @private
   * @type {string|HTMLElement|Text|undefined}
   */
  #content;
  /**
   * The event to trigger the popup
   *
   * @private
   * @type {'click' | 'clickon' | 'hover'}
   */
  #event = "click";
  /**
   * Whether the popup has been drawn on the map for the first time
   *
   * The popup overlay is redrawn anytime the map is moved or zoomed. This is used to determine if the popup
   * has been drawn on the map for the first time. This is used to determine if the popup should be fit within
   * the map viewport when it's displayed.
   *
   * @private
   * @type {boolean}
   */
  #firstDraw = false;
  /**
   * Whether to fit the popup within the map viewport when it's displayed
   *
   * @private
   * @type {boolean}
   */
  #fit = true;
  /**
   * Holds the popup that this one last showed for the object it's attached to.
   *
   * This is only used when a callback function returns a different Popup object for each
   * thing that the popup is shown for, so that the previous one can be hidden.
   *
   * @private
   * @type {Popup|undefined}
   */
  #activePopup;
  /**
   * Holds the callback function that works out what to show, if one was given.
   *
   * @private
   * @type {PopupCallback|undefined}
   */
  #callback;
  /**
   * Whether the popup is attached to an element
   *
   * @private
   * @type {boolean}
   */
  #isAttached = false;
  /**
   * Holds if the Popup is open or not
   *
   * @private
   * @type {boolean}
   */
  #isOpen = false;
  /**
   * The total offset from the element that includes the anchor point of the element (if it exists) and the overlay offset.
   * Markers have an anchor point, but polygons and polylines do not.
   *
   * @private
   * @type {Point}
   */
  #popupOffset;
  /**
   * The theme to use for the popup.
   *
   * @private
   * @type {string}
   */
  #theme = "none";
  /**
   * Whether clicking the thing that triggered the popup to show should also hide the popup
   *
   * @private
   * @type {boolean}
   */
  #toggleDisplay = true;
  /**
   * Constructor
   *
   * @param {PopupOptions | string | HTMLElement | Text} [options] The Popup options or content
   */
  constructor(options) {
    super("popup", "Popup");
    this.#clearance = size(0, 0);
    this.#popupOffset = point(0, 0);
    if (isObject(options)) {
      if (options instanceof HTMLElement || options instanceof Text) {
        this.content = options;
      } else {
        this.setOptions(options);
      }
    } else if (typeof options !== "undefined") {
      this.content = options;
    }
  }
  /**
   * Get the autoClose value
   *
   * @returns {boolean}
   */
  get autoClose() {
    return this.#autoClose;
  }
  /**
   * Set the autoClose value
   *
   * @param {boolean} autoClose Whether to automatically hide other open popups when opening this one
   */
  set autoClose(autoClose) {
    if (typeof autoClose === "boolean") {
      this.#autoClose = autoClose;
    }
  }
  /**
   * Returns whether to center the popup horizontally on the element.
   *
   * @returns {boolean}
   */
  get center() {
    return this.#center;
  }
  /**
   * Set whether to center the popup horizontally on the element. Useful if the popup is on a marker.
   *
   * @param {boolean} center Whether to center the popup on the element
   */
  set center(center) {
    if (typeof center === "boolean") {
      this.#center = center;
    }
  }
  /**
   * Returns the amount of space between the popup and the map viewport edge.
   * This is used when the map is panned to bring the popup into view.
   *
   * @returns {Size}
   */
  get clearance() {
    return this.#clearance;
  }
  /**
   * Set the amount of space between the popup and the map viewport edge
   * This is used when the map is panned to bring the popup into view.
   *
   * @param {SizeValue} clearance The amount of space between the popup and the map viewport edge
   */
  set clearance(clearance) {
    this.#clearance = size(clearance);
  }
  /**
   * Returns the element to close the popup. This can be a CSS selector or an HTMLElement.
   *
   * @returns {HTMLElement|string|undefined}
   */
  get closeElement() {
    return this.#closeElement;
  }
  /**
   * Set the element to close the popup. This can be a CSS selector or an HTMLElement.
   *
   * @param {HTMLElement|string} closeElement The element to close the popup
   */
  set closeElement(closeElement) {
    if (typeof closeElement === "string" || closeElement instanceof HTMLElement) {
      this.#closeElement = closeElement;
    }
  }
  /**
   * Returns the content for the popup
   *
   * @returns {string|HTMLElement|Text|undefined}
   */
  get content() {
    return this.#content;
  }
  /**
   * Set the content for the popup
   *
   * @param {string|HTMLElement|Text} content The content for the popup
   */
  set content(content) {
    if (isStringWithValue(content)) {
      this.#content = content;
      this.getOverlayElement().innerHTML = content;
    } else if (content instanceof HTMLElement || content instanceof Text) {
      this.#content = content;
      const overlayElement = this.getOverlayElement();
      while (overlayElement.firstChild) {
        overlayElement.removeChild(overlayElement.firstChild);
      }
      overlayElement.appendChild(content);
    }
  }
  /**
   * Returns the event to trigger the popup
   *
   * @returns {string}
   */
  get event() {
    return this.#event;
  }
  /**
   * Set the event to trigger the popup
   *
   * @param {string} event The event to trigger the popup
   */
  set event(event) {
    if (isStringWithValue(event) && ["click", "clickon", "hover"].includes(event.toLowerCase())) {
      this.#event = event.toLowerCase();
    } else {
      throw new Error('Invalid event value. Allowed values are: "click", "clickon", and "hover"');
    }
  }
  /**
   * Returns whether to fit the popup within the map viewport when it's displayed
   *
   * @returns {boolean}
   */
  get fit() {
    return this.#fit;
  }
  /**
   * Set whether to fit the popup within the map viewport when it's displayed
   *
   * @param {boolean} fit Whether to fit the popup within the map viewport when it's displayed
   */
  set fit(fit) {
    if (typeof fit === "boolean") {
      this.#fit = fit;
    }
  }
  /**
   * Returns the theme to use for the popup
   *
   * @returns {string}
   */
  get theme() {
    return this.#theme;
  }
  /**
   * Set the theme to use for the popup
   *
   * @param {string} theme The theme to use for the popup
   */
  set theme(theme) {
    this.#theme = theme;
  }
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
  async attachTo(element, event, callback) {
    if (!this.#isAttached) {
      this.#isAttached = true;
      if (isFunction(callback)) {
        this.#callback = callback;
      }
      if (element instanceof Layer_default) {
        element.setPopup(this);
      }
      await element.init().then(() => {
        element.onceImmediate(READY_EVENT, () => {
          if (event === "clickon" || event === "hover") {
            this.#toggleDisplay = false;
          }
          const triggerEvent = event || this.#event;
          this.event = triggerEvent;
          const elementMap = () => element instanceof Map ? element : element.getMap();
          if (triggerEvent === "hover") {
            element.on("mouseover", (e) => {
              const popupObject = this.#popupFor(element);
              const map2 = elementMap();
              if (map2) {
                popupObject.move(e.latLng, map2);
              }
            });
            if (element instanceof Map) {
              element.on("mousemove", (e) => {
                (this.#activePopup || this).move(e.latLng, element);
              });
            }
            element.on("mouseout", () => {
              (this.#activePopup || this).hide();
            });
          } else if (triggerEvent === "clickon") {
            element.on("click", (e) => {
              const popupObject = this.#popupFor(element);
              popupObject.#firstDraw = false;
              const collection = PopupCollection.getInstance();
              if (!collection.has(popupObject)) {
                collection.add(popupObject);
              }
              if (popupObject.#autoClose) {
                collection.hideOthers(popupObject);
              }
              const map2 = elementMap();
              if (map2) {
                popupObject.move(e.latLng, map2);
              }
            });
          } else {
            element.on("click", (e) => {
              const popupObject = this.#popupFor(element);
              if (element instanceof Map || element instanceof Polyline) {
                popupObject.position = e.latLng;
              }
              popupObject.toggle(element);
            });
          }
        });
      });
    }
    return this;
  }
  /**
   * Hide the popup
   *
   * Alias to hide()
   *
   * @returns {Popup}
   */
  close() {
    return this.hide();
  }
  /**
   * Returns whether the popup already has content
   *
   * @returns {boolean}
   */
  hasContent() {
    return isStringWithValue(this.#content) || this.#content instanceof HTMLElement || this.#content instanceof Text;
  }
  /**
   * Hide the popup
   *
   * @returns {Popup}
   */
  hide() {
    super.hide();
    this.#firstDraw = false;
    this.#isOpen = false;
    PopupCollection.getInstance().remove(this);
    return this;
  }
  /**
   * Returns whether the popup is open or not
   *
   * @returns {boolean}
   */
  isOpen() {
    return this.#isOpen;
  }
  /**
   * Open the popup
   *
   * Alias to show()
   *
   * @param {Map | Layer} element The anchor object or map object.
   * @returns {Promise<Popup>}
   */
  open(element) {
    return this.show(element);
  }
  /**
   * Set the element to close the popup. This can be a CSS selector or an HTMLElement.
   * The popup will be hidden when this element is clicked on.
   *
   * @param {HTMLElement|string} element The element to close the popup. This can be a CSS selector or an HTMLElement.
   * @returns {Popup}
   */
  setCloseElement(element) {
    this.closeElement = element;
    return this;
  }
  /**
   * Set the Popup content
   *
   * @param {string | HTMLElement | Text} content The Popup content
   * @returns {Popup}
   */
  setContent(content) {
    this.content = content;
    return this;
  }
  /**
   * Sets the options for the popup
   *
   * @param {PopupOptions} options Popup options
   * @returns {Popup}
   */
  setOptions(options) {
    if (typeof options.autoClose === "boolean") {
      this.autoClose = options.autoClose;
    }
    if (typeof options.center === "boolean") {
      this.center = options.center;
    }
    if (isString(options.className)) {
      this.setClassName(options.className);
    }
    if (options.clearance) {
      this.#clearance = size(options.clearance);
    }
    if (options.closeElement) {
      this.closeElement = options.closeElement;
    }
    if (options.content) {
      this.content = options.content;
    }
    if (options.event) {
      this.event = options.event;
    }
    if (typeof options.fit === "boolean") {
      this.#fit = options.fit;
    }
    if (typeof options.offset !== "undefined") {
      this.setOffset(options.offset);
    }
    if (options.styles) {
      this.styles = options.styles;
    }
    if (options.theme) {
      this.theme = options.theme;
    }
    return this;
  }
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
  show(element) {
    return new Promise((resolve) => {
      const collection = PopupCollection.getInstance();
      if (collection.has(this) && this.#isOpen) {
        if (this.#toggleDisplay) {
          this.hide();
        }
        resolve(this);
      } else {
        if (this.#autoClose) {
          collection.hideOthers(this);
        }
        this.#isOpen = true;
        collection.add(this);
        if (element instanceof Map) {
          this.#popupOffset = this.getOffset().clone();
          super.show(element).then(() => {
            resolve(this);
          });
        } else if (element instanceof Marker) {
          element.toGoogle().then((marker2) => {
            const tryGetAnchorPoint = (attempt = 0) => {
              const anchorPoint = marker2.get("anchorPoint");
              this.position = element.getPosition();
              if (anchorPoint === void 0 && attempt < 5) {
                const timeouts = [100, 200, 400, 600, 1e3];
                const timeout = timeouts[attempt];
                setTimeout(() => {
                  tryGetAnchorPoint(attempt + 1);
                }, timeout);
                return;
              }
              if (anchorPoint instanceof google.maps.Point) {
                this.#popupOffset = this.getOffset().add(anchorPoint.x, anchorPoint.y);
              } else {
                this.#popupOffset = this.getOffset().clone();
              }
              const map2 = element.getMap();
              if (map2) {
                super.show(map2).then(() => {
                  resolve(this);
                });
              } else {
                resolve(this);
              }
            };
            tryGetAnchorPoint();
          });
        } else {
          this.#popupOffset = this.getOffset().clone();
          const map2 = element.getMap();
          if (map2) {
            super.show(map2).then(() => {
              resolve(this);
            });
          } else {
            resolve(this);
          }
        }
      }
    });
  }
  /**
   * Toggle the display of the overlay on the map
   *
   * @param {Map | Layer} element The anchor object or map object.
   */
  toggle(element) {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show(element);
    }
  }
  /**
   * Add the overlay to the element. Called once after setMap() is called on the overlay with a valid map.
   *
   * @internal
   * @param {google.maps.MapPanes} panes The Google maps panes object
   */
  add(panes) {
    panes.floatPane.appendChild(this.getOverlayElement());
  }
  /**
   * Draw the overlay. Called when the overlay is being drawn or updated.
   *
   * @internal
   * @param {google.maps.MapCanvasProjection} projection The Google maps projection object
   */
  draw(projection) {
    if (typeof projection !== "undefined") {
      const position = this.getPosition();
      if (!position) {
        return;
      }
      const divPosition = projection.fromLatLngToDivPixel(position.toGoogle());
      if (!divPosition) {
        return;
      }
      const display = Math.abs(divPosition.x) < 4e3 && Math.abs(divPosition.y) < 4e3 ? "block" : "none";
      if (display === "block") {
        this.style("left", `${divPosition.x + this.#popupOffset.getX()}px`);
        this.style("top", `${divPosition.y + this.#popupOffset.getY()}px`);
      }
      if (this.center) {
        this.style("transform", "translate(-50%, -100%)");
      } else {
        this.style("transform", "translate(0, -100%)");
      }
      if (this.#theme === "default") {
        const styles = this.styles || {};
        const themeStyles = {
          backgroundColor: "#fff",
          color: "#333",
          padding: "3px 6px",
          borderRadius: "4px",
          boxShadow: "0 0 5px rgba(0,0,0,0.3)"
        };
        this.styles = { ...themeStyles, ...styles };
      }
      if (this.getOverlayElement().style.display !== display) {
        this.style("display", display);
      }
      if (this.#closeElement) {
        if (this.#closeElement instanceof HTMLElement) {
          this.#setupCloseClick(this.#closeElement);
        } else if (isStringWithValue(this.#closeElement)) {
          const matches = this.getOverlayElement().querySelectorAll(this.#closeElement);
          matches.forEach((element) => {
            this.#setupCloseClick(element);
          });
        }
      }
      if (!this.#firstDraw) {
        this.#firstDraw = true;
        this.#fitPopup();
      }
    }
  }
  /**
   * Fit the popup within the map viewport when it's displayed
   *
   * @returns {void}
   */
  #fitPopup() {
    if (this.#fit && this.event !== "hover") {
      const map2 = this.getMap();
      const mapDiv = map2?.getDiv();
      if (!map2 || !mapDiv) {
        return;
      }
      let offsetY = 0;
      let offsetX = 0;
      const mapPosition = mapDiv.getBoundingClientRect();
      const popupPosition = this.getOverlayElement().getBoundingClientRect();
      if (popupPosition.height < mapPosition.height) {
        if (mapPosition.top > popupPosition.top || mapPosition.top > popupPosition.top - this.#clearance.height) {
          offsetY = popupPosition.top - mapPosition.top - this.#clearance.height;
        }
      } else if (popupPosition.bottom < mapPosition.bottom) {
        offsetY = (mapPosition.bottom - popupPosition.bottom) * -1;
        if (this.#popupOffset.y !== 0) {
          offsetY += Math.abs(this.#popupOffset.y);
        } else if (this.#clearance.height > 40) {
          offsetY += this.#clearance.height;
        } else {
          offsetY += 40;
        }
      }
      if (popupPosition.width < mapPosition.width) {
        if (mapPosition.left > popupPosition.left || mapPosition.left > popupPosition.left - this.#clearance.width) {
          offsetX = popupPosition.left - mapPosition.left - this.#clearance.width;
        } else if (mapPosition.right < popupPosition.right || mapPosition.right < popupPosition.right + this.#clearance.width) {
          offsetX = (mapPosition.right - popupPosition.right - this.#clearance.width) * -1;
        }
      } else {
        offsetX = popupPosition.left - mapPosition.left;
        if (this.#popupOffset.x !== 0) {
          offsetX -= Math.abs(this.#popupOffset.x);
        } else if (this.#clearance.width > 40) {
          offsetX -= this.#clearance.width;
        } else {
          offsetX -= 40;
        }
      }
      if (offsetX !== 0 || offsetY !== 0) {
        map2.panBy(offsetX, offsetY);
      }
    }
  }
  /**
   * Work out the popup to show for the thing that the event happened on.
   *
   * Without a callback function this is always the popup itself, which is how a popup with
   * fixed content works. With one, the callback is called every time the popup is about to be
   * shown so that the content, the options, or the whole popup can be different each time.
   *
   * @private
   * @param {Map|Layer} target The object that the popup is attached to
   * @returns {Popup}
   */
  #popupFor(target) {
    if (!isFunction(this.#callback)) {
      return this;
    }
    const popupObject = overlayFromCallback(this, this.#callback(target), popupAdapter);
    if (this.#activePopup && this.#activePopup !== popupObject) {
      this.#activePopup.hide();
    }
    this.#activePopup = popupObject;
    return popupObject;
  }
  /**
   * Handle the close click event
   *
   * This is here so that any previous click event listeners are removed before adding the new one.
   */
  #handleCloseClick = () => {
    this.hide();
  };
  /**
   * Set up the close click event listenter on the element
   *
   * @param {HTMLElement} element The element that will close the popup when clicked.
   */
  #setupCloseClick = (element) => {
    element.removeEventListener("click", this.#handleCloseClick);
    element.addEventListener("click", this.#handleCloseClick);
  };
};
var popup = (options) => {
  if (options instanceof Popup) {
    return options;
  }
  return new Popup(options);
};
var closeAllPopups = () => {
  PopupCollection.getInstance().hideAll();
};
var popupMixin = {
  /**
   * Attach a popup to this object.
   *
   * A function can be passed instead of a fixed value. It's called every time the popup is
   * about to be shown, is passed this object, and returns the content for the popup, a
   * PopupOptions object, or a Popup object to show instead.
   *
   * @param {AttachPopupValue} popupValue The content for the Popup, or the Popup options object, or the Popup
   *      object, or a function that returns one of those.
   * @param {'click' | 'clickon' | 'hover'} [event] The event to trigger the popup. Defaults to 'hover'. See Popup.attachTo() for more information.
   * @returns {Popup}
   */
  attachPopup(popupValue, event) {
    let p;
    let callback;
    if (isFunction(popupValue)) {
      callback = popupValue;
      p = popup({ content: "" });
    } else {
      p = popup(popupValue);
    }
    p.attachTo(this, event, callback);
    return p;
  }
};
Layer_default.include(popupMixin);
Map.include(popupMixin);
var popupAdapter = {
  create: (value) => popup(value),
  defaultEvent: "click",
  isOverlay: (value) => value instanceof Popup,
  kind: "popup",
  // The popup only pans the map to bring itself into view on the first draw after it's shown.
  // Hiding it first resets that so that every popup is brought into view, not just the first.
  resetBeforeShow: true
};
var dataLayerPopupMixin = {
  /**
   * Attach a popup to every feature in the data layer.
   *
   * The content can hold {property} placeholders, which are replaced with the properties of
   * whichever feature was clicked. It can also be a function that is called with the feature.
   *
   * @param {DataPopupValue} popupValue The content for the popup, or the Popup options object, or the Popup object,
   *      or a function that returns one of those.
   * @param {'click' | 'clickon' | 'hover'} [event] The event to trigger the popup. Defaults to 'click'.
   * @returns {Popup}
   */
  attachPopup(popupValue, event) {
    return attachToDataLayer(this, popupValue, event, popupAdapter);
  }
};
var dataFeaturePopupMixin = {
  /**
   * Attach a popup to this one feature.
   *
   * This takes precedence over a popup attached to the whole data layer.
   *
   * @param {DataPopupValue} popupValue The content for the popup, or the Popup options object, or the Popup object,
   *      or a function that returns one of those.
   * @param {'click' | 'clickon' | 'hover'} [event] The event to trigger the popup. Defaults to 'click'.
   * @returns {Popup}
   */
  attachPopup(popupValue, event) {
    return attachToDataFeature(this, popupValue, event, popupAdapter);
  }
};
DataLayer.include(dataLayerPopupMixin);
DataFeature.include(dataFeaturePopupMixin);
var PopupCollection = /* @__PURE__ */ (() => {
  let instance;
  function createInstance() {
    return {
      /**
       * Holds the Popup objects
       */
      popups: [],
      /**
       * Adds an Popup to the collection
       *
       * @param {Popup} p The Popup object to add
       */
      add(p) {
        this.popups.push(p);
      },
      /**
       * Clears the collection
       */
      clear() {
        this.popups = [];
      },
      /**
       * Hides all the Popups in the collection
       */
      hideAll() {
        this.popups.forEach((p) => {
          p.hide();
        });
      },
      /**
       * Hide all the Popups in the collection except for the one passed in
       *
       * @param {Popup} p The Popup object to keep open
       */
      hideOthers(p) {
        const popups = [...this.popups];
        popups.forEach((infoW) => {
          if (infoW !== p) {
            infoW.hide();
          }
        });
      },
      /**
       * Returns whether the collection has the Popup object
       *
       * @param {Popup} p The Popup object to check for
       * @returns {boolean}
       */
      has(p) {
        return this.popups.indexOf(p) > -1;
      },
      /**
       * Removes an Popup from the collection
       *
       * @param {Popup} p The Popup object to remove
       */
      remove(p) {
        const index = this.popups.indexOf(p);
        if (index > -1) {
          this.popups.splice(index, 1);
        }
      }
    };
  }
  return {
    /**
     * Get the singleton instance of the object
     *
     * @returns {PopupCollectionObject}
     */
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

// src/lib/Tooltip.ts
var Tooltip = class extends Overlay {
  /**
   * Holds the tooltip that this one last showed for the object it's attached to.
   *
   * This is only used when a callback function returns a different Tooltip object for each
   * thing that the tooltip is shown for, so that the previous one can be hidden.
   *
   * @private
   * @type {Tooltip|undefined}
   */
  #activeTooltip;
  /**
   * Holds the callback function that works out what to show, if one was given.
   *
   * @private
   * @type {TooltipCallback|undefined}
   */
  #callback;
  /**
   * Whether to center the tooltip on the element. Useful if the tooltip is on a marker.
   *
   * @private
   * @type {boolean}
   */
  #center = true;
  /**
   * Holds the tooltip content.
   * This can be a simple string of text, string of HTML code, or an HTMLElement.
   *
   * @private
   * @type {string|HTMLElement|Text|undefined}
   */
  #content;
  /**
   * The event to trigger the tooltip
   *
   * @private
   * @type {'click' | 'clickon' | 'hover'}
   */
  #event = "hover";
  /**
   * Whether the tooltip is attached to an element
   *
   * @private
   * @type {boolean}
   */
  #isAttached = false;
  /**
   * Whether the default theme styles have been set on the tooltip element
   *
   * @private
   * @type {boolean}
   */
  #isThemeApplied = false;
  /**
   * The theme to use for the tooltip.
   *
   * @private
   * @type {string}
   */
  #theme = "default";
  /**
   * Constructor
   *
   * @param {TooltipOptions | string | HTMLElement | Text} [options] Tooltip options
   */
  constructor(options) {
    super("tooltip", "Tooltip");
    this.setOffset([0, 4]);
    if (isObject(options)) {
      if (options instanceof HTMLElement || options instanceof Text) {
        this.content = options;
      } else {
        this.setOptions(options);
      }
    } else {
      if (typeof options !== "undefined") {
        this.content = options;
      }
      this.setClassName("tooltip");
    }
  }
  /**
   * Returns whether to center the tooltip horizontally on the element.
   *
   * @returns {boolean}
   */
  get center() {
    return this.#center;
  }
  /**
   * Set whether to center the tooltip horizontally on the element. Useful if the tooltip is on a marker.
   *
   * @param {boolean} center Whether to center the tooltip on the element
   */
  set center(center) {
    if (typeof center === "boolean") {
      this.#center = center;
    }
  }
  /**
   * Returns the content for the tooltip
   *
   * @returns {string|HTMLElement|Text|undefined}
   */
  get content() {
    return this.#content;
  }
  /**
   * Set the content for the tooltip
   *
   * @param {string|HTMLElement|Text} content The content for the tooltip
   */
  set content(content) {
    if (isStringWithValue(content)) {
      this.#content = content;
      this.getOverlayElement().innerHTML = content;
    } else if (content instanceof HTMLElement || content instanceof Text) {
      this.#content = content;
      this.getOverlayElement().innerHTML = "";
      this.getOverlayElement().appendChild(content);
    }
  }
  /**
   * Returns the event to trigger the tooltip
   *
   * @returns {string}
   */
  get event() {
    return this.#event;
  }
  /**
   * Set the event to trigger the tooltip
   *
   * @param {string} event The event to trigger the tooltip
   */
  set event(event) {
    if (isStringWithValue(event) && ["click", "clickon", "hover"].includes(event.toLowerCase())) {
      this.#event = event.toLowerCase();
    } else {
      throw new Error('Invalid event value. Allowed values are: "click", "clickon", and "hover"');
    }
  }
  /**
   * Returns the theme to use for the tooltip
   *
   * @returns {string}
   */
  get theme() {
    return this.#theme;
  }
  /**
   * Set the theme to use for the tooltip
   *
   * @param {string} theme The theme to use for the tooltip
   */
  set theme(theme) {
    this.#theme = theme;
    this.#isThemeApplied = false;
  }
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
  async attachTo(element, event, callback) {
    if (!this.#isAttached) {
      this.#isAttached = true;
      if (isFunction(callback)) {
        this.#callback = callback;
      }
      await element.init().then(() => {
        element.onceImmediate(READY_EVENT, () => {
          const triggerEvent = event || this.#event;
          const elementMap = () => element instanceof Map ? element : element.getMap();
          if (triggerEvent === "click") {
            element.on("click", (e) => {
              const tooltipObject = this.#tooltipFor(element);
              tooltipObject.setPosition(e.latLng);
              const map2 = elementMap();
              if (map2) {
                tooltipObject.toggle(map2);
              }
            });
          } else if (triggerEvent === "clickon") {
            element.on("click", (e) => {
              const tooltipObject = this.#tooltipFor(element);
              tooltipObject.setPosition(e.latLng);
              const map2 = elementMap();
              if (map2) {
                tooltipObject.show(map2);
              }
            });
          } else {
            element.on("mouseover", (e) => {
              const tooltipObject = this.#tooltipFor(element);
              tooltipObject.setPosition(e.latLng);
              const map2 = elementMap();
              if (map2) {
                tooltipObject.show(map2);
              }
            });
            if (element instanceof Map) {
              element.on("mousemove", (e) => {
                const tooltipObject = this.#activeTooltip || this;
                tooltipObject.setPosition(e.latLng);
                tooltipObject.show(element);
              });
            }
            element.on("mouseout", () => {
              (this.#activeTooltip || this).hide();
            });
          }
        });
      });
    }
    return this;
  }
  /**
   * Work out the tooltip to show for the thing that the event happened on.
   *
   * Without a callback function this is always the tooltip itself, which is how a tooltip with
   * fixed content works. With one, the callback is called every time the tooltip is about to
   * be shown so that the content, the options, or the whole tooltip can be different each time.
   *
   * @private
   * @param {Map|Layer} target The object that the tooltip is attached to
   * @returns {Tooltip}
   */
  #tooltipFor(target) {
    if (!isFunction(this.#callback)) {
      return this;
    }
    const tooltipObject = overlayFromCallback(this, this.#callback(target), tooltipAdapter);
    if (this.#activeTooltip && this.#activeTooltip !== tooltipObject) {
      this.#activeTooltip.hide();
    }
    this.#activeTooltip = tooltipObject;
    return tooltipObject;
  }
  /**
   * Set the default theme styles on the tooltip element.
   *
   * Any style that has already been set on the tooltip is kept so that custom styles win over the theme.
   *
   * @private
   */
  #applyTheme() {
    const themeStyles = {
      backgroundColor: "#fff",
      color: "#333",
      padding: "3px 6px",
      borderRadius: "4px",
      boxShadow: "0 0 5px rgba(0,0,0,0.3)"
    };
    const styles = this.styles;
    Object.keys(themeStyles).forEach((key) => {
      if (typeof styles[key] === "undefined") {
        this.style(key, themeStyles[key]);
      }
    });
    this.#isThemeApplied = true;
  }
  /**
   * Returns whether the tooltip already has content
   *
   * @returns {boolean}
   */
  hasContent() {
    return isStringWithValue(this.#content) || this.#content instanceof HTMLElement || this.#content instanceof Text;
  }
  /**
   * Set the content for the tooltip
   *
   * @param {string|HTMLElement} content The content for the tooltip
   * @returns {Tooltip}
   */
  setContent(content) {
    this.content = content;
    return this;
  }
  /**
   * Sets the options for the tooltip
   *
   * @param {TooltipOptions} options Tooltip options
   * @returns {Tooltip}
   */
  setOptions(options) {
    if (typeof options.center === "boolean") {
      this.center = options.center;
    }
    if (options.content) {
      this.content = options.content;
    }
    if (isString(options.className)) {
      this.removeClassName("tooltip");
      this.setClassName(options.className);
    }
    if (options.event) {
      this.event = options.event;
    }
    if (options.map) {
      this.setMap(options.map);
    }
    if (options.offset) {
      this.setOffset(options.offset);
    }
    if (options.position) {
      this.position = options.position;
    }
    if (options.styles) {
      this.styles = options.styles;
    }
    if (options.theme) {
      this.theme = options.theme;
    }
    return this;
  }
  /**
   * Add the overlay to the map. Called once after setMap() is called on the overlay with a valid map.
   *
   * @internal
   * @param {google.maps.MapPanes} panes The Google maps panes object
   */
  add(panes) {
    panes.floatPane.appendChild(this.getOverlayElement());
  }
  /**
   * Draw the overlay. Called when the overlay is being drawn or updated.
   *
   * @internal
   * @param {google.maps.MapCanvasProjection} projection The Google maps projection object
   */
  draw(projection) {
    const position = this.getPosition();
    if (position && typeof projection !== "undefined") {
      const divPosition = projection.fromLatLngToDivPixel(position.toGoogle());
      const display = Math.abs(divPosition.x) < 4e3 && Math.abs(divPosition.y) < 4e3 ? "block" : "none";
      if (display === "block") {
        const offset = this.getOffset();
        this.style("left", `${divPosition.x + offset.getX()}px`);
        this.style("top", `${divPosition.y + offset.getY()}px`);
        if (this.center && this.getOverlayElement().style.transform !== "translate(-50%, 0)") {
          this.style("transform", "translate(-50%, 0)");
        }
        if (this.#theme === "default" && !this.#isThemeApplied) {
          this.#applyTheme();
        }
      }
      if (this.getOverlayElement().style.display !== display) {
        this.style("display", display);
      }
    }
  }
};
var tooltip = (options) => {
  if (options instanceof Tooltip) {
    return options;
  }
  return new Tooltip(options);
};
var tooltipMixin = {
  /**
   * Holds the configuration to recreate the tooltip.
   *
   * This is useful when cloning an object.
   *
   * @type {TooltipConfig|null}
   */
  tooltipConfig: null,
  /**
   * Attach an Tooltip to the layer
   *
   * A function can be passed instead of a fixed value. It's called every time the tooltip is
   * about to be shown, is passed this object, and returns the content for the tooltip, a
   * TooltipOptions object, or a Tooltip object to show instead.
   *
   * @param {AttachTooltipValue} tooltipValue The content for the Tooltip, or the Tooltip options object, or the
   *      Tooltip object, or a function that returns one of those.
   * @param {'click' | 'clickon' | 'hover'} [event] The event to trigger the tooltip. Defaults to 'hover'. See Tooltip.attachTo() for more information.
   * @returns {Tooltip}
   */
  attachTooltip(tooltipValue, event) {
    let tooltipVal = tooltipValue;
    let tooltipEvent = event;
    if (isObject(tooltipValue) && objectHasValue(tooltipValue, "attachConfig") && objectHasValue(tooltipValue, "attachEvent")) {
      tooltipVal = tooltipValue.attachConfig;
      tooltipEvent = tooltipValue.attachEvent;
      this.tooltipConfig = tooltipValue;
    } else {
      this.tooltipConfig = {
        attachConfig: tooltipVal,
        attachEvent: tooltipEvent
      };
    }
    let t;
    let callback;
    if (isFunction(tooltipVal)) {
      callback = tooltipVal;
      t = tooltip({ content: "" });
    } else {
      t = tooltip(tooltipVal);
    }
    t.attachTo(this, tooltipEvent, callback);
    return t;
  }
};
Layer_default.include(tooltipMixin);
Map.include(tooltipMixin);
var tooltipAdapter = {
  create: (value) => tooltip(value),
  defaultEvent: "hover",
  isOverlay: (value) => value instanceof Tooltip,
  kind: "tooltip",
  // Unlike the popup, the tooltip doesn't pan the map to bring itself into view, so there's
  // nothing to reset and hiding it first would only make it flicker.
  resetBeforeShow: false
};
var dataLayerTooltipMixin = {
  /**
   * Attach a tooltip to every feature in the data layer.
   *
   * The content can hold {property} placeholders, which are replaced with the properties of
   * whichever feature the mouse is over. It can also be a function that is called with the feature.
   *
   * @param {DataTooltipValue} tooltipValue The content for the tooltip, or the Tooltip options object, or the
   *      Tooltip object, or a function that returns one of those.
   * @param {'click' | 'clickon' | 'hover'} [event] The event to trigger the tooltip. Defaults to 'hover'.
   * @returns {Tooltip}
   */
  attachTooltip(tooltipValue, event) {
    return attachToDataLayer(this, tooltipValue, event, tooltipAdapter);
  }
};
var dataFeatureTooltipMixin = {
  /**
   * Attach a tooltip to this one feature.
   *
   * This takes precedence over a tooltip attached to the whole data layer.
   *
   * @param {DataTooltipValue} tooltipValue The content for the tooltip, or the Tooltip options object, or the
   *      Tooltip object, or a function that returns one of those.
   * @param {'click' | 'clickon' | 'hover'} [event] The event to trigger the tooltip. Defaults to 'hover'.
   * @returns {Tooltip}
   */
  attachTooltip(tooltipValue, event) {
    return attachToDataFeature(this, tooltipValue, event, tooltipAdapter);
  }
};
DataLayer.include(dataLayerTooltipMixin);
DataFeature.include(dataFeatureTooltipMixin);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AutocompleteSearchBox,
  AutocompleteSearchBoxEvents,
  Base,
  ControlPosition,
  DEFAULT_SIMPLIFY_TOLERANCE,
  DEFAULT_SIMPLIFY_ZOOM,
  DataFeature,
  DataLayer,
  DataLayerEvents,
  Evented,
  FullscreenControl,
  Geocode,
  GeocodeResult,
  GeocodeResults,
  GeocoderErrorStatus,
  GeocoderLocationType,
  GeometryType,
  Icon,
  ImageOverlay,
  ImageOverlayEvents,
  InfoWindow,
  InfoWindowEvents,
  LatLng,
  LatLngBounds,
  Layer,
  LayerEvents,
  Loader,
  LoaderEvents,
  Map,
  MapEvents,
  MapRestriction,
  MapStyle,
  MapTypeControl,
  MapTypeControlStyle,
  MapTypeId,
  Marker,
  MarkerCluster,
  MarkerCollection,
  MarkerEvents,
  Overlay,
  OverlayEvents,
  PlacesSearchBox,
  PlacesSearchBoxEvents,
  Point,
  Polyline,
  PolylineCollection,
  PolylineEvents,
  PolylineIcon,
  Popup,
  PopupEvents,
  READY_EVENT,
  RenderingType,
  RotateControl,
  ScaleControl,
  Size,
  StreetViewControl,
  StreetViewSource,
  SvgSymbol,
  SymbolPath,
  Tooltip,
  ZoomControl,
  autocompleteSearchBox,
  calculateDimensions,
  callCallback,
  checkForGoogleMaps,
  closeAllPopups,
  convertControlPosition,
  convertMapTypeControlStyle,
  convertSymbolPath,
  dataLayer,
  fullscreenControl,
  geocode,
  getBoolean,
  getNumber,
  getPixelsFromLatLng,
  getSizeWithUnit,
  icon,
  imageOverlay,
  infoWindow,
  isBoolean,
  isDefined,
  isFunction,
  isNull,
  isNullOrUndefined,
  isNumber,
  isNumberOrNumberString,
  isNumberString,
  isObject,
  isObjectWithValues,
  isPromise,
  isString,
  isStringOrNumber,
  isStringWithValue,
  isUndefined,
  latLng,
  latLngBounds,
  loader,
  map,
  mapRestriction,
  mapStyle,
  mapTypeControl,
  marker,
  markerCluster,
  markerCollection,
  objectEquals,
  objectHasValue,
  overlay,
  placesSearchBox,
  point,
  polyline,
  polylineCollection,
  polylineIcon,
  popup,
  renderTemplate,
  rotateControl,
  scaleControl,
  simplifyPath,
  size,
  streetViewControl,
  svgSymbol,
  tooltip,
  zoomControl
});
