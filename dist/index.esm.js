var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __reflectGet = Reflect.get;
var __pow = Math.pow;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var __superGet = (cls, obj, key) => __reflectGet(__getProtoOf(cls), key, obj);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/lib/Base.ts
var _objectType;
var Base = class {
  /**
   * Constructor
   *
   * @param {string} objectType The object type for the class
   */
  constructor(objectType) {
    /**
     * Holds the object type
     *
     * @private
     * @type {string}
     */
    __privateAdd(this, _objectType, void 0);
    __privateSet(this, _objectType, objectType);
  }
  /**
   * Returns the object type
   *
   * @returns {string}
   */
  getObjectType() {
    return __privateGet(this, _objectType);
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
_objectType = new WeakMap();
var Base_default = Base;

// src/lib/constants.ts
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
  const topRight = projection.fromLatLngToPoint(bounds.getNorthEast());
  const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest());
  const scale = __pow(2, map2.getZoom());
  const worldPoint = projection.fromLatLngToPoint(position);
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
    msg += " See https://developers.google.com/maps/documentation/javascript for more information.";
    if (doError) {
      throw new Error(msg);
    }
  }
  return passed;
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
var callCallback = (callback, ...args) => {
  if (isFunction(callback)) {
    callback(...args);
  }
};

// src/lib/LatLng.ts
var _latLngObject, _latitude, _longitude, _valuesChanged;
var _LatLng = class _LatLng extends Base_default {
  /**
   * Constructor
   *
   * @param {Latitude|LatLng|google.maps.LatLng} latitude The latitude value or the latitude/longitude pair
   * @param {number|string} [longitude] The longitude value
   */
  constructor(latitude, longitude) {
    super("latlng");
    /**
     * Holds the Google maps LatLng object
     *
     * @private
     * @type {google.maps.LatLng}
     */
    __privateAdd(this, _latLngObject, void 0);
    /**
     * Holds the latitude
     *
     * @private
     * @type {number}
     */
    __privateAdd(this, _latitude, void 0);
    /**
     * Holds the longitude
     *
     * @private
     * @type {number}
     */
    __privateAdd(this, _longitude, void 0);
    /**
     * Whether the latitude/longitude pair values have changed since the last time they were set
     *
     * @type {boolean}
     */
    __privateAdd(this, _valuesChanged, false);
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
    var _a;
    return (_a = __privateGet(this, _latitude)) != null ? _a : 0;
  }
  /**
   * Set the latitude value
   *
   * @param {number|string} latitude The latitude value. Ideally it's a number but it could be a number string
   */
  set latitude(latitude) {
    if (isNumberString(latitude)) {
      __privateSet(this, _latitude, Number(latitude));
    } else if (isNumber(latitude)) {
      __privateSet(this, _latitude, latitude);
    }
    __privateSet(this, _valuesChanged, true);
  }
  /**
   * Get the latitude value (shortened version of the latitude property)
   *
   * @returns {number}
   */
  get lat() {
    var _a;
    return (_a = __privateGet(this, _latitude)) != null ? _a : 0;
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
    var _a;
    return (_a = __privateGet(this, _longitude)) != null ? _a : 0;
  }
  /**
   * Set the longitude value
   *
   * @param {number|string} longitude The longitude value. Ideally it's a number but it could be a number string
   */
  set longitude(longitude) {
    if (isNumberString(longitude)) {
      __privateSet(this, _longitude, Number(longitude));
    } else if (isNumber(longitude)) {
      __privateSet(this, _longitude, longitude);
    }
    __privateSet(this, _valuesChanged, true);
  }
  /**
   * Get the longitude value (shortened version of the longitude property)
   *
   * @returns {number}
   */
  get lng() {
    var _a;
    return (_a = __privateGet(this, _longitude)) != null ? _a : 0;
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
    return new _LatLng(__privateGet(this, _latitude), __privateGet(this, _longitude));
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
      if (isFunction(latitude.lat)) {
        this.latitude = latitude.lat();
      } else if (typeof latitude.lat !== "undefined") {
        this.latitude = latitude.lat;
      } else if (typeof latitude.latitude !== "undefined") {
        this.latitude = latitude.latitude;
      }
      if (isFunction(latitude.lng)) {
        this.longitude = latitude.lng();
      } else if (typeof latitude.lng !== "undefined") {
        this.longitude = latitude.lng;
      } else if (typeof latitude.longitude !== "undefined") {
        this.longitude = latitude.longitude;
      }
    } else if (latitude instanceof _LatLng) {
      this.latitude = latitude.getLat();
      this.longitude = latitude.getLng();
    } else {
      this.latitude = latitude;
      this.longitude = longitude;
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
   * @returns {google.maps.LatLng|null}
   */
  toGoogle() {
    if (!this.isValid()) {
      throw new Error(
        `Invalid latitude/longitude pair. One or both values are missing. Latitude: ${this.latitude}, Longitude: ${this.longitude}`
      );
    }
    if (checkForGoogleMaps("LatLng", "LatLng")) {
      if (!isObject(__privateGet(this, _latLngObject)) || __privateGet(this, _valuesChanged)) {
        __privateSet(this, _latLngObject, new google.maps.LatLng(this.latitude, this.longitude));
        __privateSet(this, _valuesChanged, false);
      }
      return __privateGet(this, _latLngObject);
    }
    return null;
  }
  /**
   * Returns whether the latitude/longitude pair are valid values
   *
   * @returns {boolean}
   */
  isValid() {
    return isNumber(__privateGet(this, _latitude)) && isNumber(__privateGet(this, _longitude));
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
_latLngObject = new WeakMap();
_latitude = new WeakMap();
_longitude = new WeakMap();
_valuesChanged = new WeakMap();
var LatLng = _LatLng;
var latLng = (latitude, longitude) => new LatLng(latitude, longitude);
var latLngConvert = (googleLatLng) => new LatLng(googleLatLng.lat(), googleLatLng.lng());

// src/lib/Point.ts
var _pointObject, _x, _y;
var _Point = class _Point extends Base_default {
  /**
   * Constructor
   *
   * @param {XPoint|Point} [x] The X value
   * @param {number|string} [y] The Y value
   */
  constructor(x, y) {
    super("point");
    /**
     * Holds the Google maps point object
     */
    __privateAdd(this, _pointObject, void 0);
    /**
     * The X value
     */
    __privateAdd(this, _x, void 0);
    /**
     * The Y value
     */
    __privateAdd(this, _y, void 0);
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
    return __privateGet(this, _x);
  }
  /**
   * Set the x value
   *
   * @param {number|string} x The x value. Ideally it's a number but it could be a number string
   */
  set x(x) {
    if (isNumberString(x)) {
      __privateSet(this, _x, Number(x));
    } else if (isNumber(x)) {
      __privateSet(this, _x, x);
    }
    if (isObject(__privateGet(this, _pointObject))) {
      __privateGet(this, _pointObject).x = __privateGet(this, _x);
    }
  }
  /**
   * Get the y value
   *
   * @returns {number}
   */
  get y() {
    return __privateGet(this, _y);
  }
  /**
   * Set the y value
   *
   * @param {number|string} y The y value. Ideally it's a number but it could be a number string
   */
  set y(y) {
    if (isNumberString(y)) {
      __privateSet(this, _y, Number(y));
    } else if (isNumber(y)) {
      __privateSet(this, _y, y);
    }
    if (isObject(__privateGet(this, _pointObject))) {
      __privateGet(this, _pointObject).y = __privateGet(this, _y);
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
      this.y = y;
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
   * @returns {google.maps.Point}
   */
  toGoogle() {
    if (checkForGoogleMaps("Point", "Point")) {
      if (!isObject(__privateGet(this, _pointObject))) {
        __privateSet(this, _pointObject, new google.maps.Point(this.x, this.y));
      }
      return __privateGet(this, _pointObject);
    }
    return null;
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
_pointObject = new WeakMap();
_x = new WeakMap();
_y = new WeakMap();
var Point = _Point;
var point = (x, y) => new Point(x, y);

// src/lib/Evented.ts
var _eventsCalled, _eventListeners, _onlyEventListeners, _googleObject, _isOnLoadEventSet, _pendingLoadEventListeners, _pendingMapObjectEventListeners, _testObject, _testLibrary, _on, on_fn, _isGoogleObjectSet, isGoogleObjectSet_fn;
var Evented = class extends Base_default {
  /**
   * Constructor
   *
   * @param {string} objectType The object type for the class
   * @param {string} testObject The object that needs Google maps. This should be the name of the object that calls this method.
   * @param {string} [testLibrary] An optional Google maps library class to check for. This needs to be part of the google.maps object.
   */
  constructor(objectType, testObject, testLibrary) {
    super(objectType);
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
    __privateAdd(this, _on);
    /**
     * Returns if the Google object is set and ready to work with events
     *
     * @returns {boolean}
     */
    __privateAdd(this, _isGoogleObjectSet);
    /**
     * Holds the events that have been called
     */
    __privateAdd(this, _eventsCalled, {});
    /**
     * Holds the event listeners
     *
     * @private
     * @type {EventListeners}
     */
    __privateAdd(this, _eventListeners, {});
    /**
     * Holds the event listeners that are set to only be called once
     *
     * @private
     * @type {string[]}
     */
    __privateAdd(this, _onlyEventListeners, []);
    /**
     * Holds the Google maps object that events are set up on
     *
     * @private
     * @type {google.maps.MVCObject| google.maps.marker.AdvancedMarkerElement}
     */
    __privateAdd(this, _googleObject, void 0);
    /**
     * Holds whether the onload event was set on the Loader class to
     * set up the pending event listeners after the Google Maps API library is loaded.
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _isOnLoadEventSet, false);
    /**
     * Holds the event listeners that are waiting to be added once the Google Maps API is loaded
     *
     * @private
     * @type {PendingEvents}
     */
    __privateAdd(this, _pendingLoadEventListeners, {});
    /**
     * Holds the event listeners that are waiting to be added once the Google Maps object is set
     *
     * @private
     * @type {PendingEvents}
     */
    __privateAdd(this, _pendingMapObjectEventListeners, {});
    /**
     * The object that needs Google maps. This should be the name of the object that extends this class.
     *
     * This is used with checkForGoogleMaps() to check if the Google Maps library is loaded.
     *
     * @private
     * @type {string}
     */
    __privateAdd(this, _testObject, void 0);
    /**
     * An optional Google maps library class to check for. This needs to be part of the google.maps object.
     *
     * This is used with checkForGoogleMaps() to check if the Google Maps library is loaded.
     *
     * @private
     * @type {string}
     */
    __privateAdd(this, _testLibrary, void 0);
    __privateSet(this, _testObject, testObject);
    if (isString(testLibrary)) {
      __privateSet(this, _testLibrary, testLibrary);
    } else {
      __privateSet(this, _testLibrary, testObject);
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
    __privateGet(this, _eventsCalled)[event] = true;
    if (!this.hasListener(event)) {
      return this;
    }
    const listeners = __privateGet(this, _eventListeners)[event];
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
          if (typeof googleData.latLng !== "undefined") {
            eventData.latLng = latLng(googleData.latLng.lat(), googleData.latLng.lng());
          }
          if (typeof data.placeId !== "undefined") {
            eventData.placeId = data.placeId;
          }
          if (typeof data.pixel !== "undefined") {
            eventData.pixel = new Point(data.pixel.x, data.pixel.y);
          }
        } else {
          eventData = __spreadValues(__spreadValues({}, eventData), data);
        }
      }
      const listenersToRemove = [];
      listeners.forEach((listener) => {
        listener.callback.call(listener.context || this, eventData);
        if (typeof listener.options !== "undefined" && isObject(listener.options) && typeof listener.options.once === "boolean" && listener.options.once === true) {
          listenersToRemove.push(listener);
        }
      });
      listenersToRemove.forEach((listener) => {
        this.off(event, listener.callback, listener.options);
      });
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
    if (!__privateGet(this, _eventListeners)[type]) {
      return false;
    }
    if (typeof callback === "function") {
      return __privateGet(this, _eventListeners)[type].filter((event) => event.callback === callback).length > 0;
    }
    return __privateGet(this, _eventListeners)[type] && __privateGet(this, _eventListeners)[type].length > 0;
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
      if (__privateGet(this, _eventListeners)[type]) {
        if (isFunction(callback)) {
          __privateGet(this, _eventListeners)[type] = __privateGet(this, _eventListeners)[type].filter((listener) => {
            let keep = true;
            if (isObject(options)) {
              keep = listener.callback !== callback || !objectEquals(options, listener.options);
            } else {
              keep = listener.callback !== callback;
            }
            return keep;
          });
        } else {
          __privateGet(this, _eventListeners)[type] = [];
        }
        const index = __privateGet(this, _onlyEventListeners).indexOf(type);
        if (index > -1) {
          __privateGet(this, _onlyEventListeners).splice(index, 1);
        }
      }
      if (__privateGet(this, _eventListeners)[type].length === 0 && __privateMethod(this, _isGoogleObjectSet, isGoogleObjectSet_fn).call(this)) {
        google.maps.event.clearListeners(__privateGet(this, _googleObject), type);
      }
    } else {
      this.offAll();
    }
  }
  /**
   * Removes all event listeners
   */
  offAll() {
    __privateSet(this, _eventListeners, {});
    __privateSet(this, _onlyEventListeners, []);
    if (__privateMethod(this, _isGoogleObjectSet, isGoogleObjectSet_fn).call(this)) {
      google.maps.event.clearInstanceListeners(__privateGet(this, _googleObject));
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
    __privateMethod(this, _on, on_fn).call(this, type, callback, config);
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
    __privateSet(this, _googleObject, googleObject);
    if (isObject(__privateGet(this, _pendingMapObjectEventListeners))) {
      Object.keys(__privateGet(this, _pendingMapObjectEventListeners)).forEach((type) => {
        __privateGet(this, _pendingMapObjectEventListeners)[type].forEach(() => {
          __privateGet(this, _googleObject).addListener(type, (e) => {
            this.dispatch(type, e);
          });
        });
      });
      __privateSet(this, _pendingMapObjectEventListeners, {});
    }
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
_eventsCalled = new WeakMap();
_eventListeners = new WeakMap();
_onlyEventListeners = new WeakMap();
_googleObject = new WeakMap();
_isOnLoadEventSet = new WeakMap();
_pendingLoadEventListeners = new WeakMap();
_pendingMapObjectEventListeners = new WeakMap();
_testObject = new WeakMap();
_testLibrary = new WeakMap();
_on = new WeakSet();
on_fn = function(type, callback, config) {
  if (isFunction(callback)) {
    if (!Array.isArray(__privateGet(this, _eventListeners)[type])) {
      let setupPending = false;
      if (checkForGoogleMaps(__privateGet(this, _testObject), __privateGet(this, _testLibrary), false)) {
        if (__privateMethod(this, _isGoogleObjectSet, isGoogleObjectSet_fn).call(this)) {
          __privateGet(this, _googleObject).addListener(type, (e) => {
            this.dispatch(type, e);
          });
        } else {
          setupPending = true;
        }
      } else {
        setupPending = true;
      }
      if (setupPending) {
        if (!__privateGet(this, _pendingMapObjectEventListeners)[type]) {
          __privateGet(this, _pendingMapObjectEventListeners)[type] = [];
        }
        __privateGet(this, _pendingMapObjectEventListeners)[type].push({ callback, config });
      }
    }
    let addListener = true;
    const listenerOptions = {};
    let context;
    if (__privateGet(this, _onlyEventListeners).includes(type)) {
      addListener = false;
    }
    if (addListener && isObjectWithValues(config)) {
      if (typeof config.once === "boolean" && config.once === true) {
        listenerOptions.once = true;
      }
      if (typeof config.only === "boolean" && config.only === true) {
        __privateGet(this, _onlyEventListeners).push(type);
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
        if (typeof __privateGet(this, _eventsCalled)[type] !== "undefined") {
          if (typeof config.once === "boolean" && config.once === true) {
            addListener = false;
          }
          if (isFunction(callback)) {
            callback.call(context || this);
          }
        }
      }
    }
    if (addListener) {
      if (!__privateGet(this, _eventListeners)[type]) {
        __privateGet(this, _eventListeners)[type] = [];
      }
      __privateGet(this, _eventListeners)[type].push({ callback, context, options: listenerOptions });
    }
  } else {
    throw new Error(`The "${type}" event handler needs a callback function`);
  }
};
_isGoogleObjectSet = new WeakSet();
isGoogleObjectSet_fn = function() {
  let isSet = __privateGet(this, _googleObject) instanceof google.maps.MVCObject;
  if (!isSet && typeof google.maps.marker !== "undefined" && typeof google.maps.marker.AdvancedMarkerElement !== "undefined") {
    isSet = __privateGet(this, _googleObject) instanceof google.maps.marker.AdvancedMarkerElement;
  }
  return isSet;
};

// src/lib/Loader.ts
import { Loader as GoogleLoader } from "@googlemaps/js-api-loader";
var _apiKey, _isLoading, _isLoaded, _libraries, _loader, _version;
var Loader = class extends EventTarget {
  /**
   * Class constructor
   *
   * @param {LoaderOptions} [options] The loader options object
   */
  constructor(options) {
    super();
    /**
     * Holds the Google Maps API key
     *
     * @private
     * @type {string}
     */
    __privateAdd(this, _apiKey, void 0);
    /**
     * Holds the loading state
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _isLoading, false);
    /**
     * Holds the loaded state
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _isLoaded, false);
    /**
     * Holds the libraries to load with Google maps
     *
     * @private
     * @type {Libraries}
     */
    __privateAdd(this, _libraries, []);
    /**
     * Holds the Google maps loader object
     *
     * @private
     * @type {GoogleLoader}
     */
    __privateAdd(this, _loader, void 0);
    /**
     * Holds the version of the Google Maps API to load
     *
     * @private
     * @type {string}
     */
    __privateAdd(this, _version, "weekly");
    if (isObject(options)) {
      this.setOptions(options);
    }
  }
  /**
   * Get the Google Maps API key
   *
   * @returns {string}
   */
  get apiKey() {
    return __privateGet(this, _apiKey);
  }
  /**
   * Set the Google Maps API key
   *
   * @param {string} apiKey The Google Maps API key
   */
  set apiKey(apiKey) {
    if (isString(apiKey)) {
      __privateSet(this, _apiKey, apiKey);
    }
  }
  /**
   * Get the libraries to load with Google maps
   *
   * @returns {Libraries}
   */
  get libraries() {
    return __privateGet(this, _libraries);
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
      __privateSet(this, _libraries, libraries);
    } else if (isStringWithValue(libraries)) {
      __privateSet(this, _libraries, [libraries]);
    }
  }
  /**
   * Get the version of the Google Maps API to load
   *
   * @returns {string}
   */
  get version() {
    return __privateGet(this, _version);
  }
  /**
   * Set the version of the Google Maps API to load
   * https://developers.google.com/maps/documentation/javascript/versions
   *
   * @param {string} version The version of the Google Maps API to load
   */
  set version(version) {
    if (isString(version)) {
      __privateSet(this, _version, version);
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
      if (!__privateGet(this, _isLoaded)) {
        if (!__privateGet(this, _isLoading)) {
          __privateSet(this, _isLoading, true);
          if (isStringWithValue(__privateGet(this, _apiKey))) {
            if (typeof __privateGet(this, _loader) === "undefined") {
              __privateSet(this, _loader, new GoogleLoader({
                apiKey: __privateGet(this, _apiKey),
                version: __privateGet(this, _version),
                libraries: __privateGet(this, _libraries)
              }));
            }
            __privateGet(this, _loader).importLibrary("maps").then(() => __async(this, null, function* () {
              if (__privateGet(this, _libraries).includes("marker")) {
                yield google.maps.importLibrary("marker");
              }
              __privateSet(this, _isLoaded, true);
              callCallback(callback);
              this.dispatch("load");
              resolve();
            })).catch((err) => {
              reject(err);
            });
          } else {
            reject(new Error("The Google Maps API key is not set"));
          }
        } else {
          this.once("load", () => {
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
   * @param {Function} callback The event listener function
   */
  on(type, callback) {
    if (isFunction(callback)) {
      this.addEventListener(type, callback, { once: true });
      if (__privateGet(this, _isLoaded)) {
        this.dispatch("load");
      }
    } else {
      throw new Error("the event handler needs a callback function");
    }
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
};
_apiKey = new WeakMap();
_isLoading = new WeakMap();
_isLoaded = new WeakMap();
_libraries = new WeakMap();
_loader = new WeakMap();
_version = new WeakMap();
var loaderInstance;
var loader = (config) => {
  if (!loaderInstance) {
    loaderInstance = new Loader(config);
  } else {
    loaderInstance.setOptions(config);
  }
  return loaderInstance;
};

// src/lib/LatLngBounds.ts
var _bounds, _boundValues, _northEast, _southWest, _extendGoogle, extendGoogle_fn, _extend, extend_fn, _setupGoogleLatLngBounds, setupGoogleLatLngBounds_fn, _createLatLngBoundsObject, createLatLngBoundsObject_fn, _union, union_fn;
var _LatLngBounds = class _LatLngBounds extends Base_default {
  /**
   * Constructor
   *
   * @param {LatLngValue | LatLngValue[]} [latLngValue] The latitude/longitude value(s). If not set then add points with the extend method.
   *      See comments on the extended method for the types of values that latLngValue can be.
   */
  constructor(latLngValue) {
    super("latlngbounds");
    /**
     * Extends this bounds using the Google Maps LatLngBounds object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds.extend
     *
     * @param {LatLng} latLngObject The LatLng object
     * @returns {void}
     */
    __privateAdd(this, _extendGoogle);
    /**
     * Extends this bounds using the internal method
     *
     * Based on the Leaflet library
     *
     * @param {LatLng} latLngObject The LatLng object
     * @returns {void}
     */
    __privateAdd(this, _extend);
    /**
     * Set up the Google maps LatLngBounds object if necessary
     *
     * @private
     * @returns {Promise<void>}
     */
    __privateAdd(this, _setupGoogleLatLngBounds);
    /**
     * Create the LatLngBounds object
     *
     * @private
     */
    __privateAdd(this, _createLatLngBoundsObject);
    /**
     * Extends this bounds to contain the union of this and the given bounds
     *
     * @param {LatLngBounds} other The LatLngBounds object to join with
     * @returns {Promise<void>}
     */
    __privateAdd(this, _union);
    /**
     * Holds the Google maps LatLngBounds object
     */
    __privateAdd(this, _bounds, void 0);
    /**
     * Holds the values to extend the bounds with
     *
     * This is used to set up the Google Maps LatLngBounds object when the Google Maps object is loaded.
     *
     * @private
     * @type {LatLng[]}
     */
    __privateAdd(this, _boundValues, []);
    /**
     * Holds the north-east corner of the LatLngBounds
     *
     * @private
     * @type {LatLng}
     */
    __privateAdd(this, _northEast, void 0);
    /**
     * Holds the south-west corner of the LatLngBounds
     *
     * @private
     * @type {LatLng}
     */
    __privateAdd(this, _southWest, void 0);
    if (latLngValue) {
      this.extend(latLngValue);
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
    if (__privateGet(this, _bounds)) {
      return __privateGet(this, _bounds).contains(latLngObject.toGoogle());
    }
    if (__privateGet(this, _southWest) && __privateGet(this, _northEast)) {
      return latLngObject.latitude >= __privateGet(this, _southWest).latitude && latLngObject.latitude <= __privateGet(this, _northEast).latitude && latLngObject.longitude >= __privateGet(this, _southWest).longitude && latLngObject.longitude <= __privateGet(this, _northEast).longitude;
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
        if (__privateGet(this, _bounds)) {
          other.toGoogle().then((googleLatLngBounds) => {
            resolve(__privateGet(this, _bounds).equals(googleLatLngBounds));
          });
        } else {
          resolve(
            __privateGet(this, _northEast).latitude === other.getNorthEast().latitude && __privateGet(this, _northEast).longitude === other.getNorthEast().longitude && __privateGet(this, _southWest).latitude === other.getSouthWest().latitude && __privateGet(this, _southWest).longitude === other.getSouthWest().longitude
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
        if (__privateGet(this, _bounds)) {
          __privateMethod(this, _extendGoogle, extendGoogle_fn).call(this, latLngObject);
        } else {
          __privateMethod(this, _extend, extend_fn).call(this, latLngObject);
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
   * Get the center of the LatLngBounds
   *
   * @returns {LatLng}
   */
  getCenter() {
    if (__privateGet(this, _bounds)) {
      return latLngConvert(__privateGet(this, _bounds).getCenter());
    }
    const lat = (__privateGet(this, _northEast).latitude + __privateGet(this, _southWest).latitude) / 2;
    let lng = (__privateGet(this, _northEast).longitude + __privateGet(this, _southWest).longitude) / 2;
    if (__privateGet(this, _northEast).longitude < __privateGet(this, _southWest).longitude) {
      lng = (lng + 180) % 360 - 180;
    }
    return latLng([lat, lng]);
  }
  /**
   * Get the north-east corner of the LatLngBounds
   *
   * @returns {LatLng}
   */
  getNorthEast() {
    if (__privateGet(this, _bounds)) {
      return latLngConvert(__privateGet(this, _bounds).getNorthEast());
    }
    return __privateGet(this, _northEast);
  }
  /**
   * Get the south-west corner of the LatLngBounds
   *
   * @returns {LatLng}
   */
  getSouthWest() {
    if (__privateGet(this, _bounds)) {
      return latLngConvert(__privateGet(this, _bounds).getSouthWest());
    }
    return __privateGet(this, _southWest);
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
      __privateMethod(this, _setupGoogleLatLngBounds, setupGoogleLatLngBounds_fn).call(this).then(() => {
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
        if (__privateGet(this, _bounds)) {
          other.toGoogle().then((googleLatLngBounds) => {
            resolve(__privateGet(this, _bounds).intersects(googleLatLngBounds));
          });
        } else {
          const sw = this.getSouthWest();
          const ne = this.getNorthEast();
          const otherSw = other.getSouthWest();
          const otherNe = other.getNorthEast();
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
    if (__privateGet(this, _bounds)) {
      return __privateGet(this, _bounds).isEmpty();
    }
    return !__privateGet(this, _northEast) || !__privateGet(this, _southWest);
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
      __privateMethod(this, _setupGoogleLatLngBounds, setupGoogleLatLngBounds_fn).call(this).then(() => {
        resolve(__privateGet(this, _bounds));
      });
    });
  }
  /**
   * Converts the LatLngBounds object to a JSON object
   *
   * @returns {google.maps.LatLngBoundsLiteral}
   */
  toJson() {
    if (__privateGet(this, _bounds)) {
      return __privateGet(this, _bounds).toJSON();
    }
    return {
      east: __privateGet(this, _northEast).longitude,
      north: __privateGet(this, _northEast).latitude,
      south: __privateGet(this, _southWest).latitude,
      west: __privateGet(this, _southWest).longitude
    };
  }
  /**
   * Converts the LatLngBounds object to a string
   *
   * @returns {string}
   */
  toString() {
    if (__privateGet(this, _bounds)) {
      return __privateGet(this, _bounds).toString();
    }
    return `(${__privateGet(this, _southWest).latitude}, ${__privateGet(this, _southWest).longitude}) (${__privateGet(this, _northEast).latitude}, ${__privateGet(this, _northEast).longitude})`;
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
    if (__privateGet(this, _bounds)) {
      return __privateGet(this, _bounds).toUrlValue(prec);
    }
    return `${__privateGet(this, _southWest).latitude.toFixed(prec)},${__privateGet(this, _southWest).longitude.toFixed(
      prec
    )},${__privateGet(this, _northEast).latitude.toFixed(prec)},${__privateGet(this, _northEast).longitude.toFixed(prec)}`;
  }
  /**
   * Extends this bounds to contain the union of this and the given bounds
   *
   * @param {LatLngBounds} other The LatLngBounds object to join with
   * @returns {Promise<void>}
   */
  union(other) {
    return new Promise((resolve) => {
      if (__privateGet(this, _bounds)) {
        __privateMethod(this, _union, union_fn).call(this, other).then(() => {
          resolve();
        });
      } else {
        __privateMethod(this, _setupGoogleLatLngBounds, setupGoogleLatLngBounds_fn).call(this).then(() => {
          __privateMethod(this, _union, union_fn).call(this, other).then(() => {
            resolve();
          });
        });
      }
    });
  }
};
_bounds = new WeakMap();
_boundValues = new WeakMap();
_northEast = new WeakMap();
_southWest = new WeakMap();
_extendGoogle = new WeakSet();
extendGoogle_fn = function(latLngObject) {
  __privateGet(this, _bounds).extend(latLngObject.toGoogle());
};
_extend = new WeakSet();
extend_fn = function(latLngObject) {
  __privateGet(this, _boundValues).push(latLngObject.clone());
  if (__privateGet(this, _northEast) && __privateGet(this, _southWest)) {
    __privateGet(this, _northEast).latitude = Math.max(latLngObject.latitude, __privateGet(this, _northEast).latitude);
    __privateGet(this, _northEast).longitude = Math.max(latLngObject.longitude, __privateGet(this, _northEast).longitude);
    __privateGet(this, _southWest).latitude = Math.min(latLngObject.latitude, __privateGet(this, _southWest).latitude);
    __privateGet(this, _southWest).longitude = Math.min(latLngObject.longitude, __privateGet(this, _southWest).longitude);
  } else {
    __privateSet(this, _northEast, latLngObject.clone());
    __privateSet(this, _southWest, latLngObject.clone());
  }
};
_setupGoogleLatLngBounds = new WeakSet();
setupGoogleLatLngBounds_fn = function() {
  return new Promise((resolve) => {
    if (!isObject(__privateGet(this, _bounds))) {
      if (checkForGoogleMaps("LatLngBounds", "LatLngBounds", false)) {
        __privateMethod(this, _createLatLngBoundsObject, createLatLngBoundsObject_fn).call(this);
        resolve();
      } else {
        loader().once("map_loaded", () => {
          __privateMethod(this, _createLatLngBoundsObject, createLatLngBoundsObject_fn).call(this);
          resolve();
        });
      }
    } else {
      resolve();
    }
  });
};
_createLatLngBoundsObject = new WeakSet();
createLatLngBoundsObject_fn = function() {
  if (!__privateGet(this, _bounds)) {
    __privateSet(this, _bounds, new google.maps.LatLngBounds());
    if (__privateGet(this, _boundValues)) {
      __privateGet(this, _boundValues).forEach((latLngObject) => {
        __privateGet(this, _bounds).extend(latLngObject.toGoogle());
      });
    }
  }
};
_union = new WeakSet();
union_fn = function(other) {
  return new Promise((resolve) => {
    if (other instanceof _LatLngBounds) {
      other.toGoogle().then((googleLatLngBounds) => {
        __privateGet(this, _bounds).union(googleLatLngBounds);
        resolve();
      });
    } else {
      __privateGet(this, _bounds).union(other);
      resolve();
    }
  });
};
var LatLngBounds = _LatLngBounds;
var latLngBounds = (latLngValue) => {
  if (latLngValue instanceof LatLngBounds) {
    return latLngValue;
  }
  return new LatLngBounds(latLngValue);
};

// src/lib/AutocompleteSearchBox.ts
var _bounds2, _countryRestriction, _fields, _input, _place, _placeBounds, _searchBox, _strictBounds, _types, _createAutocompleteSearchBox;
var AutocompleteSearchBox = class extends Evented {
  /**
   * Constructor
   *
   * @param {string | HTMLInputElement | AutocompleteSearchBoxOptions} input The input reference or the options
   * @param {AutocompleteSearchBoxOptions} [options] The places autocomplete search box options if the input is reference to the input element
   */
  constructor(input, options) {
    super("placesSearchBox", "places");
    /**
     * Holds the bounds to restrict the search to
     *
     * @private
     * @type {LatLngBounds | undefined}
     */
    __privateAdd(this, _bounds2, void 0);
    /**
     * Holds the region to use for biasing query predictions.
     *
     * https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#ComponentRestrictions
     *
     * @private
     * @type {string|Array<string>|null}
     */
    __privateAdd(this, _countryRestriction, null);
    /**
     * Holds the fields to be included for the Place in the details response when the details are successfully retrieved.
     *
     * @private
     * @type {string[]}
     */
    __privateAdd(this, _fields, ["ALL"]);
    /**
     * Holds the reference to the input element
     *
     * @private
     * @type {HTMLInputElement}
     */
    __privateAdd(this, _input, void 0);
    /**
     * Holds the place that has been found.
     *
     * @private
     * @type {google.maps.places.PlaceResult}
     */
    __privateAdd(this, _place, void 0);
    /**
     * Holds the map bounds based on the place that has been found
     *
     * @private
     * @type {LatLngBounds}
     */
    __privateAdd(this, _placeBounds, void 0);
    /**
     * Holds the reference to the Google Maps SearchBox object
     *
     * @private
     * @type {google.maps.places.Autocomplete}
     */
    __privateAdd(this, _searchBox, void 0);
    /**
     * Sets whether the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _strictBounds, false);
    /**
     * Holds the types of predictions to be returned.
     *
     * @private
     * @type {string[]}
     */
    __privateAdd(this, _types, void 0);
    /**
     * Create the places search box object
     *
     * @private
     */
    __privateAdd(this, _createAutocompleteSearchBox, () => __async(this, null, function* () {
      if (!__privateGet(this, _searchBox)) {
        const options = {
          strictBounds: __privateGet(this, _strictBounds)
        };
        if (__privateGet(this, _bounds2)) {
          options.bounds = yield __privateGet(this, _bounds2).toGoogle();
        }
        if (__privateGet(this, _countryRestriction)) {
          options.componentRestrictions = { country: __privateGet(this, _countryRestriction) };
        }
        if (__privateGet(this, _fields)) {
          options.fields = __privateGet(this, _fields);
        }
        if (__privateGet(this, _types)) {
          options.types = __privateGet(this, _types);
        }
        __privateSet(this, _searchBox, new google.maps.places.Autocomplete(__privateGet(this, _input), options));
        __privateGet(this, _searchBox).addListener("place_changed", () => {
          const place = __privateGet(this, _searchBox).getPlace();
          const bounds = latLngBounds();
          if (place.geometry) {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport);
            }
          } else if (place.geometry.location) {
            bounds.extend(latLng(place.geometry.location));
          }
          __privateSet(this, _place, place);
          __privateSet(this, _placeBounds, bounds);
          this.dispatch("place_changed", { place, bounds });
        });
      }
    }));
    if (input instanceof HTMLInputElement) {
      __privateSet(this, _input, input);
      this.setOptions(options);
    } else if (isString(input)) {
      __privateSet(this, _input, document.querySelector(input));
      if (!__privateGet(this, _input)) {
        throw new Error(`The input element with the selector "${input}" was not found.`);
      }
      this.setOptions(options);
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
    var _a;
    return (_a = __privateGet(this, _bounds2)) != null ? _a : void 0;
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
    __privateSet(this, _bounds2, boundsValue);
    if (__privateGet(this, _searchBox)) {
      boundsValue.toGoogle().then((bounds) => {
        __privateGet(this, _searchBox).setBounds(bounds);
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
      __privateSet(this, _countryRestriction, value);
      if (__privateGet(this, _searchBox)) {
        __privateGet(this, _searchBox).setComponentRestrictions({ country: value });
      }
    }
  }
  /**
   * Get the country or countries to use for biasing query predictions.
   *
   * @returns {string | string[] | null}
   */
  get countryRestriction() {
    return __privateGet(this, _countryRestriction);
  }
  /**
   * Set the fields to be included for the Place in the details response when the details are successfully retrieved.
   *
   * @param {string | string[]} value The fields to set
   */
  set fields(value) {
    if (isString(value)) {
      __privateSet(this, _fields, [value]);
    } else if (Array.isArray(value)) {
      __privateSet(this, _fields, value);
    }
    if (__privateGet(this, _searchBox)) {
      __privateGet(this, _searchBox).setFields(__privateGet(this, _fields));
    }
  }
  /**
   * Get the fields to be included for the Place in the details response when the details are successfully retrieved.
   *
   * @returns {string[]}
   */
  get fields() {
    return __privateGet(this, _fields);
  }
  /**
   * Get the input reference
   *
   * @returns {HTMLInputElement | undefined}
   */
  get input() {
    return __privateGet(this, _input);
  }
  /**
   * Set the input reference
   *
   * @param {string | HTMLInputElement} value The input HTMLInputElement or the selector for the input element
   */
  set input(value) {
    if (value instanceof HTMLInputElement) {
      __privateSet(this, _input, value);
    } else if (isString(value)) {
      __privateSet(this, _input, document.querySelector(value));
      if (!__privateGet(this, _input)) {
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
    return __privateGet(this, _strictBounds);
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
      __privateSet(this, _strictBounds, value);
      if (__privateGet(this, _searchBox)) {
        __privateGet(this, _searchBox).setOptions({ strictBounds: value });
      }
    }
  }
  /**
   * Get the types of predictions to be returned.
   *
   * @returns {string[] | undefined}
   */
  get types() {
    return __privateGet(this, _types);
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
      __privateSet(this, _types, value);
    } else if (isString(value)) {
      __privateSet(this, _types, [value]);
    } else {
      __privateSet(this, _types, []);
    }
    if (__privateGet(this, _searchBox)) {
      __privateGet(this, _searchBox).setTypes(__privateGet(this, _types));
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
    return __privateGet(this, _countryRestriction);
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
    return __privateGet(this, _input);
  }
  /**
   * Gets the place that has been found
   *
   * The results from the place_changed event is one place and it's the place that the user clicked on.
   *
   * @returns {google.maps.places.PlaceResult | undefined}
   */
  getPlace() {
    return __privateGet(this, _place);
  }
  /**
   * Get the map bounds based on the place that has been found.
   *
   * @returns {LatLngBounds|undefined}
   */
  getPlaceBounds() {
    return __privateGet(this, _placeBounds);
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
    return __privateGet(this, _types);
  }
  /**
   * Initialize the places search box object
   *
   * This must be called in order for the places search box to work.
   *
   * @returns {Promise<void>}
   */
  init() {
    return __async(this, null, function* () {
      return new Promise((resolve) => {
        if (!isObject(__privateGet(this, _searchBox))) {
          if (checkForGoogleMaps("AutocompleteSearchBox", "places", false)) {
            __privateGet(this, _createAutocompleteSearchBox).call(this).then(() => {
              resolve();
            });
          } else {
            loader().once("map_loaded", () => {
              __privateGet(this, _createAutocompleteSearchBox).call(this).then(() => {
                resolve();
              });
            });
          }
        } else {
          resolve();
        }
      });
    });
  }
  /**
   * Returns whether the places search box object has been initialized
   *
   * @returns {boolean}
   */
  isInitialized() {
    return isObject(__privateGet(this, _searchBox));
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
    this.on("place_changed", (data) => {
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
          __privateSet(this, _input, options.input);
        } else if (isString(options.input)) {
          __privateSet(this, _input, document.querySelector(options.input));
          if (!__privateGet(this, _input)) {
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
_bounds2 = new WeakMap();
_countryRestriction = new WeakMap();
_fields = new WeakMap();
_input = new WeakMap();
_place = new WeakMap();
_placeBounds = new WeakMap();
_searchBox = new WeakMap();
_strictBounds = new WeakMap();
_types = new WeakMap();
_createAutocompleteSearchBox = new WeakMap();
var autocompleteSearchBox = (input, options) => {
  if (input instanceof AutocompleteSearchBox) {
    return input;
  }
  return new AutocompleteSearchBox(input, options);
};

// src/lib/Size.ts
var _sizeObject, _width, _height;
var _Size = class _Size extends Base_default {
  /**
   * Constructor
   *
   * @param {WidthSize|Size} [width] The X value
   * @param {number|string} [height] The Y value
   */
  constructor(width, height) {
    super("size");
    /**
     * Holds the Google maps size object
     *
     * @private
     * @type {google.maps.Size}
     */
    __privateAdd(this, _sizeObject, void 0);
    /**
     * The width value
     *
     * @private
     * @type {number}
     */
    __privateAdd(this, _width, void 0);
    /**
     * The height value
     *
     * @type {number}
     */
    __privateAdd(this, _height, void 0);
    __privateSet(this, _height, 0);
    __privateSet(this, _width, 0);
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
    return __privateGet(this, _height);
  }
  /**
   * Set the height value
   *
   * @param {number|string} height The height value. Ideally it's a number but it could be a number string
   */
  set height(height) {
    if (isNumberString(height)) {
      __privateSet(this, _height, Number(height));
    } else if (isNumber(height)) {
      __privateSet(this, _height, height);
    }
    if (isObject(__privateGet(this, _sizeObject))) {
      __privateGet(this, _sizeObject).height = __privateGet(this, _height);
    }
  }
  /**
   * Get the width value
   *
   * @returns {number}
   */
  get width() {
    return __privateGet(this, _width);
  }
  /**
   * Set the width value
   *
   * @param {number|string} width The width value. Ideally it's a number but it could be a number string
   */
  set width(width) {
    if (isNumberString(width)) {
      __privateSet(this, _width, Number(width));
    } else if (isNumber(width)) {
      __privateSet(this, _width, width);
    }
    if (isObject(__privateGet(this, _sizeObject))) {
      __privateGet(this, _sizeObject).width = __privateGet(this, _width);
    }
  }
  /**
   * Returns a new copy of the size
   *
   * @returns {Size}
   */
  clone() {
    return new _Size(__privateGet(this, _width), __privateGet(this, _height));
  }
  /**
   * Get the height value
   *
   * @returns {number}
   */
  getHeight() {
    return __privateGet(this, _height);
  }
  /**
   * Get the width value
   *
   * @returns {number}
   */
  getWidth() {
    return __privateGet(this, _width);
  }
  /**
   * Returns whether the width/height pair are valid values
   *
   * @returns {boolean}
   */
  isValid() {
    return isNumber(__privateGet(this, _width)) && isNumber(__privateGet(this, _height));
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
      this.height = height;
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
      if (!isObject(__privateGet(this, _sizeObject))) {
        __privateSet(this, _sizeObject, new google.maps.Size(__privateGet(this, _width), __privateGet(this, _height)));
      }
      return __privateGet(this, _sizeObject);
    }
    return null;
  }
};
_sizeObject = new WeakMap();
_width = new WeakMap();
_height = new WeakMap();
var Size = _Size;
var size = (width, height) => new Size(width, height);

// src/lib/Icon.ts
var _options;
var Icon = class extends Base_default {
  /**
   * Constructor
   *
   * @param {string | IconOptions} [url] The URL for the icon or the icon options
   * @param {IconOptions} [options] The icon options
   */
  constructor(url, options) {
    super("icon");
    /**
     * Holds the Google maps icon options
     */
    __privateAdd(this, _options, void 0);
    __privateSet(this, _options, { url: "" });
    if (typeof url === "string") {
      __privateSet(this, _options, {
        url
      });
      this.setOptions(options);
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
        if (options[key]) {
          __privateGet(this, _options)[key] = point(options[key]).toGoogle();
        }
      });
      sizeValues.forEach((key) => {
        if (options[key]) {
          __privateGet(this, _options)[key] = size(options[key]).toGoogle();
        }
      });
      stringValues.forEach((key) => {
        if (options[key] && isStringWithValue(options[key])) {
          __privateGet(this, _options)[key] = options[key];
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
    __privateGet(this, _options).anchor = point(anchor).toGoogle();
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
    __privateGet(this, _options).labelOrigin = point(origin).toGoogle();
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
    __privateGet(this, _options).origin = point(origin).toGoogle();
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
    __privateGet(this, _options).scaledSize = size(sizeValue).toGoogle();
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
    __privateGet(this, _options).size = size(sizeValue).toGoogle();
    return this;
  }
  /**
   * Set the icon URL
   *
   * @param {string} url The icon URL
   * @returns {Icon}
   */
  setUrl(url) {
    __privateGet(this, _options).url = url;
    return this;
  }
  /**
   * Get the icon options
   *
   * @returns {google.maps.Icon}
   */
  toGoogle() {
    return __privateGet(this, _options);
  }
};
_options = new WeakMap();
var icon = (url, options) => {
  if (url instanceof Icon) {
    return url;
  }
  return new Icon(url, options);
};

// src/lib/Layer.ts
var _isVisible, _map;
var Layer = class extends Evented {
  constructor() {
    super(...arguments);
    // eslint-disable-line @typescript-eslint/no-explicit-any
    /**
     * Holds if the layer is visible or not
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _isVisible, false);
    /**
     * Holds the Map object that the layer is added to
     *
     * @private
     * @type {Map|null}
     */
    __privateAdd(this, _map, null);
  }
  /**
   * Get if the layer is visible or not
   *
   * @returns {boolean}
   */
  get isVisible() {
    return __privateGet(this, _isVisible);
  }
  /**
   * Set if the layer is visible or not
   *
   * @param {boolean} value Whether the layer is visible or not
   */
  set isVisible(value) {
    if (typeof value === "boolean") {
      __privateSet(this, _isVisible, value);
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
    return __privateGet(this, _map);
  }
  /**
   * Return if the layer has a Map object set
   *
   * @returns {boolean}
   */
  hasMap() {
    return __privateGet(this, _map) !== null;
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
   * Clears the map object that the layer is added to
   *
   * Note, this does not remove the layer from the map, it just clears the map object from the layer.
   */
  removeMap() {
    __privateSet(this, _map, null);
  }
  /**
   * Sets the map object that the layer is added to
   *
   * This does not display the layer on the map, it only sets the map object for the layer.
   *
   * @param {Map} map The map object to add the layer to
   */
  setMap(map2) {
    __privateSet(this, _map, map2);
    if (map2) {
      this.isVisible = true;
    } else {
      this.isVisible = false;
    }
  }
};
_isVisible = new WeakMap();
_map = new WeakMap();
var Layer_default = Layer;

// src/lib/Map/FullscreenControl.ts
var _enabled, _position;
var FullscreenControl = class {
  /**
   * Class constructor
   *
   * @param {FullscreenControlOptions | boolean} [options] Either the FullscreenControl options or a boolean value to disable the control.
   */
  constructor(options) {
    /**
     * Holds whether the Fullscreen control is enabled or not
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _enabled, true);
    /**
     * The position of the control on the map
     *
     * https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
     *
     * @private
     * @type {ControlPosition}
     */
    __privateAdd(this, _position, void 0);
    if (isBoolean(options)) {
      __privateSet(this, _enabled, options);
    }
    __privateSet(this, _position, ControlPosition.INLINE_END_BLOCK_START);
    if (isObject(options)) {
      if (isBoolean(options.enabled)) {
        __privateSet(this, _enabled, options.enabled);
      }
      if (options.position) {
        this.setPosition(options.position);
      }
    }
  }
  /**
   * Get whether the Fullscreen control is enabled.
   *
   * @returns {boolean}
   */
  get enabled() {
    return __privateGet(this, _enabled);
  }
  /**
   * Set whether the Fullscreen control is enabled.
   *
   * @param {boolean} value The enabled/disabled state
   */
  set enabled(value) {
    if (isBoolean(value)) {
      __privateSet(this, _enabled, value);
    }
  }
  /**
   * Get the map type control position
   *
   * @returns {ControlPosition}
   */
  get position() {
    return __privateGet(this, _position);
  }
  /**
   * Set the map type control position
   *
   * @param {ControlPosition} value The position of the control
   */
  set position(value) {
    __privateSet(this, _position, value);
  }
  /**
   * Disable the Fullscreen control
   *
   * @returns {FullscreenControl}
   */
  disable() {
    __privateSet(this, _enabled, false);
    return this;
  }
  /**
   * Enable the Fullscreen control
   *
   * @returns {FullscreenControl}
   */
  enable() {
    __privateSet(this, _enabled, true);
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
    __privateSet(this, _position, position);
    return this;
  }
  /**
   * Get the Fullscreen Control options Google Maps object
   *
   * @returns {Promise<google.maps.FullscreenControlOptions>}
   */
  toGoogle() {
    return new Promise((resolve) => {
      loader().on("load", () => {
        resolve({
          position: convertControlPosition(__privateGet(this, _position))
        });
      });
    });
  }
};
_enabled = new WeakMap();
_position = new WeakMap();
var fullscreenControl = (options) => {
  if (options instanceof FullscreenControl) {
    return options;
  }
  return new FullscreenControl(options);
};

// src/lib/Map/MapRestriction.ts
var _enabled2, _latLngBounds, _strictBounds2;
var MapRestriction = class {
  /**
   * Class constructor
   *
   * @param {MapRestrictionOptions | LatLngBoundsValue | boolean} [options] Either the MapRestriction options just the LatLng bounds value.
   */
  constructor(options) {
    /**
     * Whether the MapRestriction object is enabled
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _enabled2, true);
    /**
     * The latitude/longitude bounds that a user is restricted to.
     *
     * @private
     * @type {LatLngBounds}
     */
    __privateAdd(this, _latLngBounds, void 0);
    /**
     * If true, anything outside of the latLngBounds will be hidden when zooming. This can restrict how much the user can zoom out.
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _strictBounds2, false);
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
    return __privateGet(this, _enabled2);
  }
  /**
   * Set whether the MapRestriction object is enabled
   *
   * @param {boolean} value Whether the MapRestriction object is enabled
   */
  set enabled(value) {
    if (isBoolean(value)) {
      __privateSet(this, _enabled2, value);
    }
  }
  /**
   * Get the existing latitude/longitude bounds
   *
   * @returns {LatLngBounds | undefined}
   */
  get latLngBounds() {
    return __privateGet(this, _latLngBounds);
  }
  /**
   * Set the latitude/longitude bounds
   *
   * @param {LatLngBoundsValue} value The lat/lng bounds value
   */
  set latLngBounds(value) {
    __privateSet(this, _latLngBounds, latLngBounds(value));
  }
  /**
   * Get whether the bounds are strict
   *
   * @returns {boolean}
   */
  get strictBounds() {
    return __privateGet(this, _strictBounds2);
  }
  /**
   * Set whether the bounds are strict
   *
   * @param {boolean} value Whether the bounds are strict
   */
  set strictBounds(value) {
    if (isBoolean(value)) {
      __privateSet(this, _strictBounds2, value);
    }
  }
  /**
   * Disable the map restriction
   *
   * @returns {MapRestriction}
   */
  disable() {
    __privateSet(this, _enabled2, false);
    return this;
  }
  /**
   * Enable the map restriction
   *
   * @returns {MapRestriction}
   */
  enable() {
    __privateSet(this, _enabled2, true);
    return this;
  }
  /**
   * Returns whether the MapRestriction object is enabled
   *
   * @returns {boolean}
   */
  isEnabled() {
    return __privateGet(this, _enabled2);
  }
  /**
   * Returns if the MapRestriction object is valid
   *
   * @returns {boolean}
   */
  isValid() {
    let valid = false;
    if (__privateGet(this, _latLngBounds)) {
      const json = __privateGet(this, _latLngBounds).toJson();
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
    return new Promise((resolve) => {
      __privateGet(this, _latLngBounds).toGoogle().then((bounds) => {
        resolve({
          latLngBounds: bounds,
          strictBounds: __privateGet(this, _strictBounds2)
        });
      });
    });
  }
};
_enabled2 = new WeakMap();
_latLngBounds = new WeakMap();
_strictBounds2 = new WeakMap();
var mapRestriction = (options) => {
  if (options instanceof MapRestriction) {
    return options;
  }
  return new MapRestriction(options);
};

// src/lib/Map/MapTypeControl.ts
var _enabled3, _mapTypeIds, _position2, _style, _typeHybrid, _typeRoadmap, _typeSatellite, _typeTerrain;
var MapTypeControl = class {
  /**
   * Class constructor
   *
   * @param {MapTypeControlOptions | boolean} [options] Either the MapTypeControl options or a boolean value to disable the control.
   */
  constructor(options) {
    /**
     * Holds whether the Map Type control is enabled or not
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _enabled3, true);
    /**
     * The map type ids to include in the control
     *
     * https://developers.google.com/maps/documentation/javascript/reference/map#MapTypeId
     *
     * @private
     * @type {MapTypeId[]}
     */
    __privateAdd(this, _mapTypeIds, void 0);
    /**
     * The position of the control on the map
     *
     * https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
     *
     * @private
     * @type {ControlPosition}
     */
    __privateAdd(this, _position2, void 0);
    /**
     * The style of the control
     *
     * https://developers.google.com/maps/documentation/javascript/reference/control#MapTypeControlStyle
     *
     * @private
     * @type {MapTypeControlStyle}
     */
    __privateAdd(this, _style, void 0);
    /**
     * Holds whether the hybrid map type is enabled
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _typeHybrid, true);
    /**
     * Holds whether the roadmap map type is enabled
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _typeRoadmap, true);
    /**
     * Holds whether the satellite map type is enabled
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _typeSatellite, true);
    /**
     * Holds whether the terrain map type is enabled
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _typeTerrain, true);
    if (isBoolean(options)) {
      __privateSet(this, _enabled3, options);
    }
    __privateSet(this, _mapTypeIds, []);
    __privateGet(this, _mapTypeIds).push(MapTypeId.HYBRID);
    __privateGet(this, _mapTypeIds).push(MapTypeId.ROADMAP);
    __privateGet(this, _mapTypeIds).push(MapTypeId.SATELLITE);
    __privateGet(this, _mapTypeIds).push(MapTypeId.TERRAIN);
    __privateSet(this, _position2, ControlPosition.BLOCK_START_INLINE_START);
    __privateSet(this, _style, MapTypeControlStyle.DEFAULT);
    if (isObject(options)) {
      if (isBoolean(options.enabled)) {
        __privateSet(this, _enabled3, options.enabled);
      }
      if (options.mapTypeIds) {
        this.setMapTypeIds(options.mapTypeIds);
      }
      if (options.position) {
        this.setPosition(options.position);
      }
      if (options.style) {
        this.setStyle(options.style);
      }
    }
  }
  /**
   * Get whether the Map Type control is enabled.
   *
   * @returns {boolean}
   */
  get enabled() {
    return __privateGet(this, _enabled3);
  }
  /**
   * Set whether the Map Type control is enabled.
   *
   * @param {boolean} value The enabled/disabled state
   */
  set enabled(value) {
    if (isBoolean(value)) {
      __privateSet(this, _enabled3, value);
    }
  }
  /**
   * Get whether the hybrid map type is enabled
   *
   * @returns {boolean}
   */
  get hybrid() {
    return __privateGet(this, _typeHybrid);
  }
  /**
   * Set whether the hybrid map type is enabled
   *
   * @param {boolean} value The enabled/disabled state
   */
  set hybrid(value) {
    if (isBoolean(value)) {
      __privateSet(this, _typeHybrid, value);
    }
  }
  /**
   * Get the map type control position
   *
   * @returns {ControlPosition}
   */
  get position() {
    return __privateGet(this, _position2);
  }
  /**
   * Set the map type control position
   *
   * @param {ControlPosition} value The position of the control
   */
  set position(value) {
    __privateSet(this, _position2, value);
  }
  /**
   * Get whether the roadmap map type is enabled
   *
   * @returns {boolean}
   */
  get roadmap() {
    return __privateGet(this, _typeRoadmap);
  }
  /**
   * Set whether the roadmap map type is enabled
   *
   * @param {boolean} value The enabled/disabled state
   */
  set roadmap(value) {
    if (isBoolean(value)) {
      __privateSet(this, _typeRoadmap, value);
    }
  }
  /**
   * Get whether the satellite map type is enabled
   *
   * @returns {boolean}
   */
  get satellite() {
    return __privateGet(this, _typeSatellite);
  }
  /**
   * Set whether the satellite map type is enabled
   *
   * @param {boolean} value The enabled/disabled state
   */
  set satellite(value) {
    if (isBoolean(value)) {
      __privateSet(this, _typeSatellite, value);
    }
  }
  /**
   * Get the map type control style
   *
   * @returns {MapTypeControlStyle}
   */
  get style() {
    return __privateGet(this, _style);
  }
  /**
   * Set the map type control style
   *
   * @param {MapTypeControlStyleValue} value The style of the control
   */
  set style(value) {
    __privateSet(this, _style, value);
  }
  /**
   * Get whether the terrain map type is enabled
   *
   * @returns {boolean}
   */
  get terrain() {
    return __privateGet(this, _typeTerrain);
  }
  /**
   * Set whether the terrain map type is enabled
   *
   * @param {boolean} value The enabled/disabled state
   */
  set terrain(value) {
    if (isBoolean(value)) {
      __privateSet(this, _typeTerrain, value);
    }
  }
  /**
   * Disable the Map Type control
   *
   * @returns {MapTypeControl}
   */
  disable() {
    __privateSet(this, _enabled3, false);
    return this;
  }
  /**
   * Enable the Map Type control
   *
   * @returns {MapTypeControl}
   */
  enable() {
    __privateSet(this, _enabled3, true);
    return this;
  }
  /**
   * Returns whether the Map Type control is using the map type id
   *
   * @param {MapTypeIdValue} mapTypeId The map type id to check
   * @returns {boolean}
   */
  hasMapType(mapTypeId) {
    return __privateGet(this, _mapTypeIds).includes(mapTypeId);
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
        __privateSet(this, _mapTypeIds, validMapTypeIds);
        __privateSet(this, _typeHybrid, validMapTypeIds.includes(MapTypeId.HYBRID));
        __privateSet(this, _typeRoadmap, validMapTypeIds.includes(MapTypeId.ROADMAP));
        __privateSet(this, _typeSatellite, validMapTypeIds.includes(MapTypeId.SATELLITE));
        __privateSet(this, _typeTerrain, validMapTypeIds.includes(MapTypeId.TERRAIN));
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
    __privateSet(this, _position2, position);
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
    __privateSet(this, _style, style);
    return this;
  }
  /**
   * Get the MapTypeControl options Google Maps object
   *
   * @returns {Promise<google.maps.MapTypeControlOptions>}
   */
  toGoogle() {
    return new Promise((resolve) => {
      loader().on("load", () => {
        resolve({
          mapTypeIds: __privateGet(this, _mapTypeIds),
          position: convertControlPosition(__privateGet(this, _position2)),
          // position: 21,
          // style: this.#style,
          // style: 2,
          style: convertMapTypeControlStyle(__privateGet(this, _style))
        });
      });
    });
  }
};
_enabled3 = new WeakMap();
_mapTypeIds = new WeakMap();
_position2 = new WeakMap();
_style = new WeakMap();
_typeHybrid = new WeakMap();
_typeRoadmap = new WeakMap();
_typeSatellite = new WeakMap();
_typeTerrain = new WeakMap();
var mapTypeControl = (options) => {
  if (options instanceof MapTypeControl) {
    return options;
  }
  return new MapTypeControl(options);
};

// src/lib/Map/MapStyle.ts
var _elementType, _featureType, _styles;
var MapStyle = class {
  /**
   * Class constructor
   *
   * @param {MapStyleOptions | Style | Style[]} [options] Either the MapStyle options, a single style, or an array of styles
   */
  constructor(options) {
    /**
     * he element type to which the styles should be applied to. If not set then the styles are applied to all elements.
     *
     * @private
     * @type {string}
     */
    __privateAdd(this, _elementType, "all");
    /**
     * The feature type to which the styles should be applied to. If not set then the styles are applied to all features.
     *
     * @private
     * @type {string}
     */
    __privateAdd(this, _featureType, "all");
    /**
     * The styles to apply to the map
     *
     * @private
     * @type {Style[]}
     */
    __privateAdd(this, _styles, []);
    if (isObject(options)) {
      if (isDefined(options.elementType) || isDefined(options.featureType) || isDefined(options.styles)) {
        const opts = options;
        if (opts.elementType) {
          this.elementType = opts.elementType;
        }
        if (opts.featureType) {
          this.featureType = opts.featureType;
        }
        if (opts.styles) {
          __privateSet(this, _styles, opts.styles);
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
    return __privateGet(this, _elementType);
  }
  /**
   * Set the element type to apply styles to
   *
   * @param {string} value The element type to apply values to
   */
  set elementType(value) {
    if (isStringWithValue(value)) {
      __privateSet(this, _elementType, value);
    }
  }
  /**
   * Get the feature type to apply styles to
   *
   * @returns {string}
   */
  get featureType() {
    return __privateGet(this, _featureType);
  }
  /**
   * Set the feature type to apply styles to
   *
   * @param {string} value The feature type to apply values to
   */
  set featureType(value) {
    if (isStringWithValue(value)) {
      __privateSet(this, _featureType, value);
    }
  }
  /**
   * Get the styles to apply to the map
   *
   * @returns {Style[]}
   */
  get styles() {
    return __privateGet(this, _styles);
  }
  /**
   * Set the styles to apply to the map
   *
   * @param {Style | Style[]} value The style or styles to apply to the map
   */
  set styles(value) {
    if (Array.isArray(value)) {
      __privateSet(this, _styles, value);
    } else if (isObject(value)) {
      __privateSet(this, _styles, [value]);
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
      __privateGet(this, _styles).push({ [property]: value });
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
      elementType: __privateGet(this, _elementType),
      featureType: __privateGet(this, _featureType),
      stylers: __privateGet(this, _styles)
    };
  }
};
_elementType = new WeakMap();
_featureType = new WeakMap();
_styles = new WeakMap();
var mapStyle = (options) => {
  if (options instanceof MapStyle) {
    return options;
  }
  return new MapStyle(options);
};

// src/lib/Map/RotateControl.ts
var _enabled4, _position3;
var RotateControl = class {
  /**
   * Class constructor
   *
   * @param {RotateControlOptions | boolean} [options] Either the RotateControl options or a boolean value to disable the control.
   */
  constructor(options) {
    /**
     * Holds whether the Rotate control is enabled or not
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _enabled4, true);
    /**
     * The position of the control on the map
     *
     * https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
     *
     * @private
     * @type {ControlPosition}
     */
    __privateAdd(this, _position3, void 0);
    if (isBoolean(options)) {
      __privateSet(this, _enabled4, options);
    }
    if (!__privateGet(this, _position3)) {
      __privateSet(this, _position3, ControlPosition.INLINE_END_BLOCK_START);
    }
    if (isObject(options)) {
      if (isBoolean(options.enabled)) {
        __privateSet(this, _enabled4, options.enabled);
      }
      if (options.position) {
        this.setPosition(options.position);
      }
    }
  }
  /**
   * Get whether the Rotate control is enabled.
   *
   * @returns {boolean}
   */
  get enabled() {
    return __privateGet(this, _enabled4);
  }
  /**
   * Set whether the Rotate control is enabled.
   *
   * @param {boolean} value The enabled/disabled state
   */
  set enabled(value) {
    if (isBoolean(value)) {
      __privateSet(this, _enabled4, value);
    }
  }
  /**
   * Get the map type control position
   *
   * @returns {ControlPosition}
   */
  get position() {
    return __privateGet(this, _position3);
  }
  /**
   * Set the map type control position
   *
   * @param {ControlPosition} value The position of the control
   */
  set position(value) {
    __privateSet(this, _position3, value);
  }
  /**
   * Disable the Rotate control
   *
   * @returns {RotateControl}
   */
  disable() {
    __privateSet(this, _enabled4, false);
    return this;
  }
  /**
   * Enable the Rotate control
   *
   * @returns {RotateControl}
   */
  enable() {
    __privateSet(this, _enabled4, true);
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
    __privateSet(this, _position3, position);
    return this;
  }
  /**
   * Get the Rotate Control options Google Maps object
   *
   * @returns {Promise<google.maps.RotateControlOptions>}
   */
  toGoogle() {
    return new Promise((resolve) => {
      loader().on("load", () => {
        resolve({
          position: convertControlPosition(__privateGet(this, _position3))
        });
      });
    });
  }
};
_enabled4 = new WeakMap();
_position3 = new WeakMap();
var rotateControl = (options) => {
  if (options instanceof RotateControl) {
    return options;
  }
  return new RotateControl(options);
};

// src/lib/Map/ScaleControl.ts
var _enabled5;
var ScaleControl = class {
  /**
   * Class constructor
   *
   * @param {ScaleControlOptions | boolean} [options] Either the ScaleControl options or a boolean value to disable the control.
   */
  constructor(options) {
    /**
     * Holds whether the Scale control is enabled or not
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _enabled5, false);
    if (isBoolean(options)) {
      __privateSet(this, _enabled5, options);
    }
    if (isObject(options)) {
      if (isBoolean(options.enabled)) {
        __privateSet(this, _enabled5, options.enabled);
      }
    }
  }
  /**
   * Get whether the Scale control is enabled.
   *
   * @returns {boolean}
   */
  get enabled() {
    return __privateGet(this, _enabled5);
  }
  /**
   * Set whether the Scale control is enabled.
   *
   * @param {boolean} value The enabled/disabled state
   */
  set enabled(value) {
    if (isBoolean(value)) {
      __privateSet(this, _enabled5, value);
    }
  }
  /**
   * Disable the Scale control
   *
   * @returns {ScaleControl}
   */
  disable() {
    __privateSet(this, _enabled5, false);
    return this;
  }
  /**
   * Enable the Scale control
   *
   * @returns {ScaleControl}
   */
  enable() {
    __privateSet(this, _enabled5, true);
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
      loader().on("load", () => {
        resolve({
          style: google.maps.ScaleControlStyle.DEFAULT
        });
      });
    });
  }
};
_enabled5 = new WeakMap();
var scaleControl = (options) => {
  if (options instanceof ScaleControl) {
    return options;
  }
  return new ScaleControl(options);
};

// src/lib/Map/StreetViewControl.ts
var _enabled6, _position4, _sources;
var StreetViewControl = class {
  /**
   * Class constructor
   *
   * @param {StreetViewControlOptions | boolean} [options] Either the StreetViewControl options or a boolean value to disable the control.
   */
  constructor(options) {
    /**
     * Holds whether the StreetView control is enabled or not
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _enabled6, true);
    /**
     * The position of the control on the map
     *
     * https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
     *
     * @private
     * @type {ControlPosition}
     */
    __privateAdd(this, _position4, ControlPosition.INLINE_END_BLOCK_END);
    /**
     * The sources of the street view control
     *
     * @private
     * @type {StreetViewSourceValue[]}
     */
    __privateAdd(this, _sources, [StreetViewSource.DEFAULT]);
    if (isBoolean(options)) {
      __privateSet(this, _enabled6, options);
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
    return __privateGet(this, _enabled6);
  }
  /**
   * Set whether the StreetView control is enabled.
   *
   * @param {boolean} value The enabled/disabled state
   */
  set enabled(value) {
    if (isBoolean(value)) {
      __privateSet(this, _enabled6, value);
    }
  }
  /**
   * Get the map type control position
   *
   * @returns {ControlPosition}
   */
  get position() {
    return __privateGet(this, _position4);
  }
  /**
   * Set the map type control position
   *
   * @param {ControlPosition} value The position of the control
   */
  set position(value) {
    if (Object.values(ControlPosition).includes(value)) {
      __privateSet(this, _position4, value);
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
    return __privateGet(this, _sources);
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
      __privateSet(this, _sources, validSources);
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
    __privateSet(this, _enabled6, false);
    return this;
  }
  /**
   * Enable the StreetView control
   *
   * @returns {StreetViewControl}
   */
  enable() {
    __privateSet(this, _enabled6, true);
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
      loader().on("load", () => {
        resolve({
          position: convertControlPosition(__privateGet(this, _position4))
        });
      });
    });
  }
};
_enabled6 = new WeakMap();
_position4 = new WeakMap();
_sources = new WeakMap();
var streetViewControl = (options) => {
  if (options instanceof StreetViewControl) {
    return options;
  }
  return new StreetViewControl(options);
};

// src/lib/Map.ts
var _bounds3, _customControls, _fullscreenControl, _latitude2, _longitude2, _isGettingMapOptions, _isInitialized, _isInitializing, _isVisible2, _map2, _mapTypeControl, _options2, _restriction, _rotateControl, _scaleControl, _selector, _streetViewControl, _styles2, _watchId, _getMapOptions, getMapOptions_fn, _load, load_fn, _showMap, showMap_fn;
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
     * Get the map options for showing the map
     *
     * @private
     * @returns {google.maps.MapOptions}
     */
    __privateAdd(this, _getMapOptions);
    /**
     * Load and show the map
     *
     * @param {Function} callback The callback function to call after the map loads
     * @returns {Promise<void>}
     */
    __privateAdd(this, _load);
    /**
     * Show the map
     *
     * This also dispatches the "visible" and "map_loaded" events,
     * and calls the callback function.
     *
     * @returns {Promise<void>}
     */
    __privateAdd(this, _showMap);
    /**
     * The bounds to fit the map to
     *
     * @private
     * @type {LatLngBounds}
     */
    __privateAdd(this, _bounds3, void 0);
    /**
     * Holds the custom controls that need to be added to the map
     *
     * @private
     * @type {CustomControl[]}
     */
    __privateAdd(this, _customControls, []);
    /**
     * Holds the fullscreen control object
     *
     * @private
     * @type {FullscreenControl}
     */
    __privateAdd(this, _fullscreenControl, void 0);
    /**
     * Holds the latitude portion of the center point for the map
     *
     * @private
     * @type {number}
     */
    __privateAdd(this, _latitude2, 0);
    /**
     * Holds the longitude portion of the center point for the map
     *
     * @private
     * @type {number}
     */
    __privateAdd(this, _longitude2, 0);
    /**
     * Holds if the map is getting the map options
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _isGettingMapOptions, false);
    /**
     * Holds if the map is initialized or not
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _isInitialized, false);
    /**
     * Holds if the map is initializing
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _isInitializing, false);
    /**
     * Holds if the layer is visible or not
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _isVisible2, false);
    /**
     * Holds the Google map object
     *
     * @private
     * @type {google.maps.Map}
     */
    __privateAdd(this, _map2, void 0);
    /**
     * Holds the map type control object
     *
     * @private
     * @type {MapTypeControl}
     */
    __privateAdd(this, _mapTypeControl, void 0);
    /**
     * Holds the map options
     *
     * @private
     * @type {GMMapOptions}
     */
    __privateAdd(this, _options2, {});
    /**
     * Holds the map restriction object to restrict the map to a certain area
     *
     * @private
     * @type {MapRestriction}
     */
    __privateAdd(this, _restriction, void 0);
    /**
     * Holds the rotate control object
     *
     * @private
     * @type {RotateControl}
     */
    __privateAdd(this, _rotateControl, void 0);
    /**
     * Holds the scale control object
     *
     * @private
     * @type {ScaleControl}
     */
    __privateAdd(this, _scaleControl, void 0);
    /**
     * Holds the selector of the element that the map will be rendered in. Or the HTMLElement that the map will be rendered in.
     *
     * @private
     * @type {string|HTMLElement}
     */
    __privateAdd(this, _selector, void 0);
    /**
     * Holds the street view control object
     *
     * @private
     * @type {StreetViewControl}
     */
    __privateAdd(this, _streetViewControl, void 0);
    /**
     * Holds the styles to apply to the map
     *
     * @private
     * @type {MapStyle[]}
     */
    __privateAdd(this, _styles2, []);
    /**
     * Holds the watchId for the watchPosition() function
     *
     * @private
     * @type {number}
     */
    __privateAdd(this, _watchId, void 0);
    __privateGet(this, _options2).mapTypeId = MapTypeId.ROADMAP;
    __privateGet(this, _options2).center = latLng(0, 0);
    __privateGet(this, _options2).zoom = 6;
    __privateSet(this, _fullscreenControl, fullscreenControl());
    __privateSet(this, _mapTypeControl, mapTypeControl());
    __privateSet(this, _rotateControl, rotateControl());
    __privateSet(this, _scaleControl, scaleControl());
    __privateSet(this, _streetViewControl, streetViewControl());
    __privateSet(this, _selector, selector);
    if (isObject(options)) {
      this.setOptions(options);
    }
  }
  /**
   * Get the center point for the map
   *
   * @returns {LatLng}
   */
  get center() {
    let { center } = __privateGet(this, _options2);
    if (__privateGet(this, _map2)) {
      const mapCenter = __privateGet(this, _map2).getCenter();
      center = latLng(mapCenter.lat(), mapCenter.lng());
    }
    if (!center.equals(__privateGet(this, _options2).center)) {
      __privateGet(this, _options2).center = center;
    }
    return __privateGet(this, _options2).center;
  }
  /**
   * Set the center point for the map
   *
   * @param {LatLngValue} value The center point for the map
   */
  set center(value) {
    const center = latLng(value);
    if (center.isValid()) {
      __privateGet(this, _options2).center = center;
      __privateSet(this, _latitude2, center.lat);
      __privateSet(this, _longitude2, center.lng);
      if (isObject(__privateGet(this, _map2))) {
        __privateGet(this, _map2).setCenter(__privateGet(this, _options2).center.toGoogle());
      }
    }
  }
  /**
   * Get whether the default UI is disabled
   *
   * @returns {boolean}
   */
  get disableDefaultUI() {
    var _a;
    return (_a = __privateGet(this, _options2).disableDefaultUI) != null ? _a : false;
  }
  /**
   * Set whether the default UI is disabled
   *
   * @param {boolean} value Whether the default UI is disabled
   */
  set disableDefaultUI(value) {
    if (isBoolean(value)) {
      __privateGet(this, _options2).disableDefaultUI = value;
      if (__privateGet(this, _map2)) {
        __privateGet(this, _map2).setOptions({ disableDefaultUI: value });
      }
    }
  }
  /**
   * Get the fullscreen control object
   *
   * @returns {FullscreenControl}
   */
  get fullscreenControl() {
    return __privateGet(this, _fullscreenControl);
  }
  /**
   * Set the fullscreen control object, or whether to display the fullscreen control
   *
   * @param {boolean|FullscreenControl} value The fullscreen control option
   */
  set fullscreenControl(value) {
    if (isBoolean(value)) {
      __privateGet(this, _fullscreenControl).enabled = value;
    } else if (value instanceof FullscreenControl) {
      __privateSet(this, _fullscreenControl, value);
    }
    if (__privateGet(this, _map2)) {
      __privateGet(this, _fullscreenControl).toGoogle().then((fullscreenControlOptions) => {
        __privateGet(this, _map2).setOptions({
          fullscreenControl: __privateGet(this, _fullscreenControl).enabled,
          fullscreenControlOptions
        });
      });
    }
  }
  /**
   * Get the latitude value for the center point
   *
   * @returns {number}
   */
  get latitude() {
    return __privateGet(this, _latitude2);
  }
  /**
   * Set the latitude value for the center point
   *
   * @param {string|number} value The latitude value
   */
  set latitude(value) {
    if (isNumberOrNumberString(value)) {
      if (isNumber(value)) {
        __privateSet(this, _latitude2, value);
      } else {
        __privateSet(this, _latitude2, Number(value));
      }
      this.center = { lat: __privateGet(this, _latitude2), lng: __privateGet(this, _longitude2) };
    }
  }
  /**
   * Get the longitude value for the center point
   *
   * @returns {number}
   */
  get longitude() {
    return __privateGet(this, _longitude2);
  }
  /**
   * Set the longitude value for the center point
   *
   * @param {string|number} value The longitude value
   */
  set longitude(value) {
    if (isNumberOrNumberString(value)) {
      if (isNumber(value)) {
        __privateSet(this, _longitude2, value);
      } else {
        __privateSet(this, _longitude2, Number(value));
      }
      this.center = { lat: __privateGet(this, _latitude2), lng: __privateGet(this, _longitude2) };
    }
  }
  /**
   * Get the map type control object
   *
   * @returns {MapTypeControl}
   */
  get mapTypeControl() {
    return __privateGet(this, _mapTypeControl);
  }
  /**
   * Set the map type control object, or whether to display the map type control
   *
   * @param {boolean|MapTypeControl} value The map type control option
   */
  set mapTypeControl(value) {
    if (isBoolean(value)) {
      __privateGet(this, _mapTypeControl).enabled = value;
    } else if (value instanceof MapTypeControl) {
      __privateSet(this, _mapTypeControl, value);
    }
    if (__privateGet(this, _map2)) {
      __privateGet(this, _mapTypeControl).toGoogle().then((mapTypeControlOptions) => {
        __privateGet(this, _map2).setOptions({
          mapTypeControl: __privateGet(this, _mapTypeControl).enabled,
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
    let { mapTypeId } = __privateGet(this, _options2);
    if (__privateGet(this, _map2)) {
      mapTypeId = __privateGet(this, _map2).getMapTypeId();
    }
    if (isStringWithValue(mapTypeId) && mapTypeId !== __privateGet(this, _options2).mapTypeId) {
      __privateGet(this, _options2).mapTypeId = mapTypeId;
    }
    return __privateGet(this, _options2).mapTypeId;
  }
  /**
   * Set the map type ID
   *
   * @param {string} value The map type ID
   */
  set mapTypeId(value) {
    if (isStringWithValue(value)) {
      __privateGet(this, _options2).mapTypeId = value;
      if (__privateGet(this, _map2)) {
        __privateGet(this, _map2).setMapTypeId(value);
      }
    }
  }
  /**
   * Get the maximum zoom level for the map
   *
   * @returns {null|number}
   */
  get maxZoom() {
    var _a;
    return (_a = __privateGet(this, _options2).maxZoom) != null ? _a : null;
  }
  /**
   * Set the maximum zoom level for the map
   *
   * @param {null|number} value The maximum zoom level
   */
  set maxZoom(value) {
    if (isNumber(value) || isNull(value)) {
      __privateGet(this, _options2).maxZoom = value;
      if (__privateGet(this, _map2)) {
        __privateGet(this, _map2).setOptions({ maxZoom: value });
      }
    }
  }
  /**
   * Get the minimum zoom level for the map
   *
   * @returns {null|number}
   */
  get minZoom() {
    var _a;
    return (_a = __privateGet(this, _options2).minZoom) != null ? _a : null;
  }
  /**
   * Set the minimum zoom level for the map
   *
   * @param {null|number} value The minimum zoom level
   */
  set minZoom(value) {
    if (isNumber(value) || isNull(value)) {
      __privateGet(this, _options2).minZoom = value;
      if (__privateGet(this, _map2)) {
        __privateGet(this, _map2).setOptions({ minZoom: value });
      }
    }
  }
  /**
   * Get the MapRestriction object if it's been set
   *
   * @returns {MapRestriction|undefined}
   */
  get restriction() {
    return __privateGet(this, _restriction);
  }
  /**
   * Set the MapRestriction value
   *
   * @param {MapRestrictionValue} value The MapRestriction value
   */
  set restriction(value) {
    __privateSet(this, _restriction, mapRestriction(value));
    if (__privateGet(this, _map2) && __privateGet(this, _restriction).isValid() && __privateGet(this, _restriction).isEnabled()) {
      __privateGet(this, _restriction).toGoogle().then((restriction) => {
        __privateGet(this, _map2).setOptions({ restriction });
      });
    }
  }
  /**
   * Get the rotate control object
   *
   * @returns {RotateControl}
   */
  get rotateControl() {
    return __privateGet(this, _rotateControl);
  }
  /**
   * Set the rotate control object, or whether to display the rotate control
   *
   * @param {boolean|RotateControl} value The rotate control option
   */
  set rotateControl(value) {
    if (isBoolean(value)) {
      __privateGet(this, _rotateControl).enabled = value;
    } else if (value instanceof RotateControl) {
      __privateSet(this, _rotateControl, value);
    }
    if (__privateGet(this, _map2)) {
      __privateGet(this, _rotateControl).toGoogle().then((rotateControlOptions) => {
        __privateGet(this, _map2).setOptions({
          rotateControl: __privateGet(this, _rotateControl).enabled,
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
    return __privateGet(this, _scaleControl);
  }
  /**
   * Set the scale control object, or whether to display the scale control
   *
   * @param {boolean|ScaleControl} value The scale control option
   */
  set scaleControl(value) {
    if (isBoolean(value)) {
      __privateGet(this, _scaleControl).enabled = value;
    } else if (value instanceof ScaleControl) {
      __privateSet(this, _scaleControl, value);
    }
    if (__privateGet(this, _map2)) {
      __privateGet(this, _scaleControl).toGoogle().then((scaleControlOptions) => {
        __privateGet(this, _map2).setOptions({
          scaleControl: __privateGet(this, _scaleControl).enabled,
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
    return __privateGet(this, _streetViewControl);
  }
  /**
   * Set the street view control object, or whether to display the scale control
   *
   * @param {boolean|StreetViewControl} value The scale control option
   */
  set streetViewControl(value) {
    if (isBoolean(value)) {
      __privateGet(this, _streetViewControl).enabled = value;
    } else if (value instanceof StreetViewControl) {
      __privateSet(this, _streetViewControl, value);
    }
    if (__privateGet(this, _map2)) {
      __privateGet(this, _streetViewControl).toGoogle().then((streetViewControlOptions) => {
        __privateGet(this, _map2).setOptions({
          streetViewControl: __privateGet(this, _streetViewControl).enabled,
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
    let { zoom } = __privateGet(this, _options2);
    if (__privateGet(this, _map2)) {
      zoom = __privateGet(this, _map2).getZoom();
    }
    if (isNumber(zoom) && zoom !== __privateGet(this, _options2).zoom) {
      __privateGet(this, _options2).zoom = zoom;
    }
    return __privateGet(this, _options2).zoom;
  }
  /**
   * Set the zoom level for the map
   *
   * @param {number|string} value The zoom level
   */
  set zoom(value) {
    if (isNumber(value)) {
      __privateGet(this, _options2).zoom = value;
    } else if (isNumberString(value)) {
      __privateGet(this, _options2).zoom = Number(value);
    }
    if (__privateGet(this, _map2)) {
      __privateGet(this, _map2).setZoom(Number(value));
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
    if (__privateGet(this, _map2)) {
      __privateGet(this, _map2).controls[convertControlPosition(position)].push(element);
    } else {
      __privateGet(this, _customControls).push({ position, element });
    }
    return this;
  }
  /**
   * Add a value to the map bounds
   *
   * @param {LatLngValue | LatLngValue[]} value The latitude/longitude value to add to the bounds
   * @returns {Map}
   */
  addToBounds(value) {
    if (!__privateGet(this, _bounds3)) {
      __privateSet(this, _bounds3, latLngBounds());
    }
    __privateGet(this, _bounds3).extend(value);
    return this;
  }
  /**
   * Clear the existing bounds
   *
   * @returns {Map}
   */
  clearBounds() {
    __privateSet(this, _bounds3, latLngBounds());
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
   * @returns {Map}
   */
  fitBounds(bounds) {
    if (bounds) {
      latLngBounds(bounds).toGoogle().then((googleBounds) => {
        __privateGet(this, _map2).fitBounds(googleBounds);
      });
    } else if (__privateGet(this, _bounds3)) {
      __privateGet(this, _bounds3).toGoogle().then((googleBounds) => {
        __privateGet(this, _map2).fitBounds(googleBounds);
      });
    }
    return this;
  }
  /**
   * Alias to fitBounds
   *
   * @param {LatLngBoundsValue} bounds The bounds to fit
   * @returns {Map}
   */
  fitToBounds(bounds) {
    return this.fitBounds(bounds);
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
      if (!__privateGet(this, _isInitialized) && !__privateGet(this, _isVisible2)) {
        if (!__privateGet(this, _isInitializing)) {
          __privateSet(this, _isInitializing, true);
          __privateMethod(this, _load, load_fn).call(this, () => {
            callCallback(callback);
            resolve(this);
          });
        } else {
          this.onceImmediate("visible", () => {
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
   * Gets the lat/lng bounds of the current map viewport
   *
   * If the map is not yet initialized, this will return undefined.
   *
   * @returns {Promise<LatLngBounds | undefined>}
   */
  getBounds() {
    return new Promise((resolve) => {
      if (__privateGet(this, _map2)) {
        const bounds = new LatLngBounds();
        bounds.union(__privateGet(this, _map2).getBounds()).then(() => {
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
    if (__privateGet(this, _map2)) {
      return __privateGet(this, _map2).getDiv();
    }
    return void 0;
  }
  /**
   * Gets whether the map is visible. This also means that the map library is loaded.
   *
   * @returns {boolean}
   */
  getIsVisible() {
    return __privateGet(this, _isVisible2);
  }
  /**
   * Gets the current projection for the map.
   *
   * If the map is not yet initialized, this will return undefined.
   *
   * @returns {google.maps.Projection|undefined}
   */
  getProjection() {
    if (__privateGet(this, _map2)) {
      return __privateGet(this, _map2).getProjection();
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
   * Load and show the map
   *
   * There are two ways to respond when the map loads:
   * 1. Pass a callback function to the load() function
   *   map.load(() => {
   *     // Do something after the map loads
   *   });
   * 2. Listen for the 'visible' event
   *   map.on('visible', () => {
   *      // Do something after the map loads
   *   });
   * 2a. Use the once() function to listen for the 'visible' event only once. The event
   *     listener will be removed after the event is dispatched.
   *   map.once('visible', () => {
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
        config = __spreadValues(__spreadValues({}, defaultOptions), options);
      }
      const positionOptions = __spreadValues({
        enableHighAccuracy: false,
        maximumAge: 0,
        timeout: Infinity
      }, config);
      const success = (position) => {
        const { latitude, longitude } = position.coords;
        const data = {
          latitude,
          longitude,
          latLng: latLng(latitude, longitude),
          timestamp: position.timestamp
        };
        Object.keys(position.coords).forEach((key) => {
          if (typeof position.coords[key] === "number") {
            data[key] = position.coords[key];
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
        this.dispatch("locationerror", err);
        console.error(err);
      };
      if (config.watch) {
        __privateSet(this, _watchId, navigator.geolocation.watchPosition(success, error, positionOptions));
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
   * Changes the center of the map by the given distance in pixels.
   *
   * @param {number} x The number of pixels to move the map in the x direction
   * @param {number} y The number of pixels to move the map in the y direction
   */
  panBy(x, y) {
    if (__privateGet(this, _map2)) {
      __privateGet(this, _map2).panBy(x, y);
    } else {
      this.init().then(() => {
        __privateGet(this, _map2).panBy(x, y);
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
    if (__privateGet(this, _map2)) {
      __privateGet(this, _map2).panTo(latLng(value).toGoogle());
    } else {
      this.init().then(() => {
        __privateGet(this, _map2).panTo(latLng(value).toGoogle());
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
      __privateGet(this, _options2).center = center;
      __privateSet(this, _latitude2, center.lat);
      __privateSet(this, _longitude2, center.lng);
      if (isObject(__privateGet(this, _map2))) {
        __privateGet(this, _map2).setCenter(__privateGet(this, _options2).center.toGoogle());
      }
    }
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
      __privateSet(this, _latitude2, Number(latitude));
      __privateSet(this, _longitude2, Number(longitude));
      if (updateCenter) {
        this.setCenter(__privateGet(this, _latitude2), __privateGet(this, _longitude2));
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
        __privateGet(this, _options2).center = center;
      }
      if (isBoolean(options.disableDefaultUI)) {
        this.disableDefaultUI = options.disableDefaultUI;
      }
      if (typeof options.fullscreenControl !== "undefined") {
        if (isBoolean(options.fullscreenControl)) {
          __privateGet(this, _fullscreenControl).enabled = options.fullscreenControl;
        } else if (options.fullscreenControl instanceof FullscreenControl) {
          __privateSet(this, _fullscreenControl, options.fullscreenControl);
        }
      }
      if (isStringWithValue(options.mapId)) {
        __privateGet(this, _options2).mapId = options.mapId;
      }
      if (typeof options.mapTypeControl !== "undefined") {
        if (isBoolean(options.mapTypeControl)) {
          __privateGet(this, _mapTypeControl).enabled = options.mapTypeControl;
        } else if (options.mapTypeControl instanceof MapTypeControl) {
          __privateSet(this, _mapTypeControl, options.mapTypeControl);
        }
      }
      if (options.mapTypeId) {
        this.mapTypeId = options.mapTypeId;
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
          __privateGet(this, _rotateControl).enabled = options.rotateControl;
        } else if (options.rotateControl instanceof RotateControl) {
          __privateSet(this, _rotateControl, options.rotateControl);
        }
      }
      if (isDefined(options.scaleControl)) {
        if (isBoolean(options.scaleControl)) {
          __privateGet(this, _scaleControl).enabled = options.scaleControl;
        } else if (options.scaleControl instanceof ScaleControl) {
          __privateSet(this, _scaleControl, options.scaleControl);
        }
      }
      if (isDefined(options.streetViewControl)) {
        if (isBoolean(options.streetViewControl)) {
          __privateGet(this, _streetViewControl).enabled = options.streetViewControl;
        } else if (options.streetViewControl instanceof StreetViewControl) {
          __privateSet(this, _streetViewControl, options.streetViewControl);
        }
      }
      if (Array.isArray(options.styles)) {
        __privateSet(this, _styles2, options.styles.map((style) => mapStyle(style)));
      } else if (options.styles instanceof MapStyle) {
        __privateSet(this, _styles2, [options.styles]);
      }
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
      booleanOptions.forEach((key) => {
        if (isBoolean(options[key])) {
          __privateGet(this, _options2)[key] = options[key];
        }
      });
      const numberOptions = ["controlSize", "heading", "tilt"];
      numberOptions.forEach((key) => {
        if (isNumberOrNumberString(options[key])) {
          __privateGet(this, _options2)[key] = options[key];
        }
      });
      const stringOptions = ["backgroundColor", "draggableCursor", "draggingCursor", "gestureHandling"];
      stringOptions.forEach((key) => {
        if (isStringWithValue(options[key])) {
          __privateGet(this, _options2)[key] = options[key];
        }
      });
      const otherOptions = ["mapTypeId", "renderingType", "streetView"];
      otherOptions.forEach((key) => {
        if (typeof options[key] !== "undefined") {
          __privateGet(this, _options2)[key] = options[key];
        }
      });
      if (__privateGet(this, _map2)) {
        __privateMethod(this, _getMapOptions, getMapOptions_fn).call(this).then((mapOptions) => {
          __privateGet(this, _map2).setOptions(mapOptions);
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
        __privateMethod(this, _showMap, showMap_fn).call(this).then(() => {
          callCallback(callback);
          resolve(this);
        });
      } else {
        loader().once("load", () => {
          __privateMethod(this, _showMap, showMap_fn).call(this).then(() => {
            callCallback(callback);
            resolve(this);
          });
        });
      }
    });
  }
  /**
   * Stop watching for the user's location
   *
   * @returns {Map}
   */
  stopLocate() {
    if (navigator.geolocation) {
      navigator.geolocation.clearWatch(__privateGet(this, _watchId));
    }
    return this;
  }
  /**
   * Returns the Google map object
   *
   * @returns {google.maps.Map}
   */
  toGoogle() {
    return __privateGet(this, _map2);
  }
};
_bounds3 = new WeakMap();
_customControls = new WeakMap();
_fullscreenControl = new WeakMap();
_latitude2 = new WeakMap();
_longitude2 = new WeakMap();
_isGettingMapOptions = new WeakMap();
_isInitialized = new WeakMap();
_isInitializing = new WeakMap();
_isVisible2 = new WeakMap();
_map2 = new WeakMap();
_mapTypeControl = new WeakMap();
_options2 = new WeakMap();
_restriction = new WeakMap();
_rotateControl = new WeakMap();
_scaleControl = new WeakMap();
_selector = new WeakMap();
_streetViewControl = new WeakMap();
_styles2 = new WeakMap();
_watchId = new WeakMap();
_getMapOptions = new WeakSet();
getMapOptions_fn = function() {
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
    booleanOptions.forEach((key) => {
      if (isBoolean(__privateGet(this, _options2)[key])) {
        mapOptions[key] = __privateGet(this, _options2)[key];
      }
    });
    const numberOptions = ["controlSize", "heading", "maxZoom", "minZoom", "tilt", "zoom"];
    numberOptions.forEach((key) => {
      if (isNumberOrNumberString(__privateGet(this, _options2)[key])) {
        mapOptions[key] = __privateGet(this, _options2)[key];
      }
    });
    const stringOptions = ["backgroundColor", "draggableCursor", "draggingCursor", "gestureHandling", "mapId"];
    stringOptions.forEach((key) => {
      if (isStringWithValue(__privateGet(this, _options2)[key])) {
        mapOptions[key] = __privateGet(this, _options2)[key];
      }
    });
    const optionsToSet = ["renderingType", "streetView"];
    optionsToSet.forEach((key) => {
      if (typeof __privateGet(this, _options2)[key] !== "undefined") {
        mapOptions[key] = __privateGet(this, _options2)[key];
      }
    });
    if (isStringWithValue(__privateGet(this, _options2).mapTypeId)) {
      if (__privateGet(this, _mapTypeControl).hasMapType(__privateGet(this, _options2).mapTypeId)) {
        mapOptions.mapTypeId = __privateGet(this, _options2).mapTypeId;
      } else {
        console.warn(
          "The selected mapTypeId is not one of the allowed types set for the MapType Control.",
          __privateGet(this, _options2).mapTypeId
        );
      }
    }
    mapOptions.center = __privateGet(this, _options2).center.toGoogle();
    (() => __async(this, null, function* () {
      mapOptions.fullscreenControl = __privateGet(this, _fullscreenControl).enabled;
      const fullscreenControlOptions = yield __privateGet(this, _fullscreenControl).toGoogle();
      mapOptions.fullscreenControlOptions = fullscreenControlOptions;
      mapOptions.mapTypeControl = __privateGet(this, _mapTypeControl).enabled;
      const mapTypeControlOptions = yield __privateGet(this, _mapTypeControl).toGoogle();
      mapOptions.mapTypeControlOptions = mapTypeControlOptions;
      if (__privateGet(this, _restriction) && __privateGet(this, _restriction).isValid() && __privateGet(this, _restriction).isEnabled()) {
        const restriction = yield __privateGet(this, _restriction).toGoogle();
        mapOptions.restriction = restriction;
      }
      mapOptions.rotateControl = __privateGet(this, _rotateControl).enabled;
      const rotateControlOptions = yield __privateGet(this, _rotateControl).toGoogle();
      mapOptions.rotateControlOptions = rotateControlOptions;
      mapOptions.scaleControl = __privateGet(this, _scaleControl).enabled;
      const scaleControlOptions = yield __privateGet(this, _scaleControl).toGoogle();
      mapOptions.scaleControlOptions = scaleControlOptions;
      mapOptions.streetViewControl = __privateGet(this, _streetViewControl).enabled;
      const streetViewControlOptions = yield __privateGet(this, _streetViewControl).toGoogle();
      mapOptions.streetViewControlOptions = streetViewControlOptions;
      if (__privateGet(this, _styles2).length > 0) {
        mapOptions.styles = __privateGet(this, _styles2).map((style) => style.toGoogle());
      }
      resolve(mapOptions);
    }))();
  });
};
_load = new WeakSet();
load_fn = function(callback) {
  return new Promise((resolve, reject) => {
    loader().load().then(() => {
      __privateMethod(this, _showMap, showMap_fn).call(this).then(() => {
        callCallback(callback);
        resolve();
      });
    }).catch((err) => {
      reject(err);
    });
  });
};
_showMap = new WeakSet();
showMap_fn = function() {
  return new Promise((resolve) => {
    if (!__privateGet(this, _isVisible2) && !__privateGet(this, _isGettingMapOptions)) {
      __privateSet(this, _isGettingMapOptions, true);
      let element = null;
      if (typeof __privateGet(this, _selector) === "string") {
        element = document.querySelector(__privateGet(this, _selector));
      } else if (__privateGet(this, _selector) instanceof HTMLElement) {
        element = __privateGet(this, _selector);
      }
      if (element === null) {
        throw new Error(
          "The map element could not be found. Make sure the map selector is correct and the element exists."
        );
      }
      __privateMethod(this, _getMapOptions, getMapOptions_fn).call(this).then((mapOptions) => {
        __privateSet(this, _map2, new google.maps.Map(element, mapOptions));
        this.setEventGoogleObject(__privateGet(this, _map2));
        if (__privateGet(this, _customControls).length > 0) {
          __privateGet(this, _customControls).forEach((control) => {
            __privateGet(this, _map2).controls[convertControlPosition(control.position)].push(control.element);
          });
        }
        __privateSet(this, _customControls, []);
        this.dispatch("visible");
        loader().dispatch("map_loaded");
        __privateSet(this, _isInitialized, true);
        __privateSet(this, _isVisible2, true);
        resolve();
      });
    } else {
      resolve();
    }
  });
};
var map = (selector, config) => new Map(selector, config);

// src/lib/SvgSymbol.ts
var _options3;
var SvgSymbol = class extends Base_default {
  /**
   * Constructor
   *
   * @param {string | SvgSymbolOptions} [path] The SVG path for the icon or the icon options
   * @param {SvgSymbolOptions} [options] The options for the icon
   */
  constructor(path, options) {
    super("svgsymbol");
    /**
     * Holds the icon options
     *
     * @private
     * @type {google.maps.Symbol}
     */
    __privateAdd(this, _options3, void 0);
    __privateSet(this, _options3, {
      anchor: point([0, 0]),
      fillColor: "#000000",
      fillOpacity: 1,
      labelOrigin: point([0, 0]),
      path: "",
      rotation: 0,
      scale: 1,
      strokeColor: "#000000",
      strokeOpacity: 1,
      strokeWeight: void 0
    });
    if (typeof path === "string") {
      __privateGet(this, _options3).path = path;
      this.setOptions(options);
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
    return point(__privateGet(this, _options3).anchor);
  }
  /**
   * Set the position at which to anchor an image in correspondence to the location of the marker on the map.
   *
   * @param {PointValue} anchor The anchor point value
   */
  set anchor(anchor) {
    __privateGet(this, _options3).anchor = point(anchor).toGoogle();
  }
  /**
   * Get the SVG fill color
   *
   * @returns {string}
   */
  get fillColor() {
    return __privateGet(this, _options3).fillColor;
  }
  /**
   * Set the SVG fill color.
   *
   * @param {string} fillColor The SVG fill color.
   */
  set fillColor(fillColor) {
    if (isStringWithValue(fillColor)) {
      __privateGet(this, _options3).fillColor = fillColor;
    }
  }
  /**
   * Get the opacity for the fill
   *
   * @returns {number}
   */
  get fillOpacity() {
    return __privateGet(this, _options3).fillOpacity;
  }
  /**
   * Set the opacity for the fill
   *
   * @param {number|string} fillOpacity The opacity for the fill
   */
  set fillOpacity(fillOpacity) {
    if (isNumber(fillOpacity)) {
      __privateGet(this, _options3).fillOpacity = fillOpacity;
    } else if (isNumberString(fillOpacity)) {
      __privateGet(this, _options3).fillOpacity = Number(fillOpacity);
    }
  }
  /**
   * Get the origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
   *
   * @returns {PointValue}
   */
  get labelOrigin() {
    return __privateGet(this, _options3).labelOrigin;
  }
  /**
   * Set the origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
   *
   * @param {PointValue} labelOrigin The origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
   */
  set labelOrigin(labelOrigin) {
    __privateGet(this, _options3).labelOrigin = point(labelOrigin).toGoogle();
  }
  /**
   * Get the SVG path for the icon
   *
   * @returns {string}
   */
  get path() {
    return __privateGet(this, _options3).path;
  }
  /**
   * Set the SVG path for the icon
   *
   * @param {path} path The SVG path for the icon
   */
  set path(path) {
    if (isStringWithValue(path)) {
      __privateGet(this, _options3).path = path;
    }
  }
  /**
   * Get the rotation of the icon in degrees clockwise about the anchor point.
   *
   * @returns {number}
   */
  get rotation() {
    return __privateGet(this, _options3).rotation;
  }
  /**
   * Set the rotation of the icon in degrees clockwise about the anchor point.
   *
   * @param {number|string} rotation The rotation of the icon in degrees clockwise about the anchor point.
   */
  set rotation(rotation) {
    if (isNumber(rotation)) {
      __privateGet(this, _options3).rotation = rotation;
    } else if (isNumberString(rotation)) {
      __privateGet(this, _options3).rotation = Number(rotation);
    }
  }
  /**
   * Get the amount by which the icon is scaled.
   *
   * @returns {number}
   */
  get scale() {
    return __privateGet(this, _options3).scale;
  }
  /**
   * Set the amount by which the icon is scaled.
   *
   * @param {number|string} scale The amount by which the icon is scaled.
   */
  set scale(scale) {
    if (isNumber(scale)) {
      __privateGet(this, _options3).scale = scale;
    } else if (isNumberString(scale)) {
      __privateGet(this, _options3).scale = Number(scale);
    }
  }
  /**
   * Get the SVG stroke color
   *
   * @returns {string}
   */
  get strokeColor() {
    return __privateGet(this, _options3).strokeColor;
  }
  /**
   * Set the SVG stroke color.
   *
   * @param {string} strokeColor The SVG stroke color.
   */
  set strokeColor(strokeColor) {
    if (isStringWithValue(strokeColor)) {
      __privateGet(this, _options3).strokeColor = strokeColor;
    }
  }
  /**
   * Get the opacity of the stroke.
   * The opacity of the stroke, where 0 is fully transparent and 1 is fully opaque.
   *
   * @returns {number}
   */
  get strokeOpacity() {
    return __privateGet(this, _options3).strokeOpacity;
  }
  /**
   * Set the opacity of the stroke.
   *
   * @param {number|string} strokeOpacity The opacity of the stroke.
   */
  set strokeOpacity(strokeOpacity) {
    if (isNumber(strokeOpacity)) {
      __privateGet(this, _options3).strokeOpacity = strokeOpacity;
    } else if (isNumberString(strokeOpacity)) {
      __privateGet(this, _options3).strokeOpacity = Number(strokeOpacity);
    }
  }
  /**
   * Get the weight of the stroke in pixels.
   *
   * @returns {number}
   */
  get strokeWeight() {
    return __privateGet(this, _options3).strokeWeight;
  }
  /**
   * Set the weight of the stroke.
   *
   * @param {number|string} strokeWeight The weight of the stroke.
   */
  set strokeWeight(strokeWeight) {
    if (isNumber(strokeWeight)) {
      __privateGet(this, _options3).strokeWeight = strokeWeight;
    } else if (isNumberString(strokeWeight)) {
      __privateGet(this, _options3).strokeWeight = Number(strokeWeight);
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
      const numberValues = ["fillOpacity", "rotation", "scale", "strokeOpacity", "strokeWeight"];
      const pointValues = ["anchor", "labelOrigin"];
      const stringValues = ["fillColor", "path", "strokeColor"];
      numberValues.forEach((key) => {
        if (typeof options[key] !== "undefined" && isNumber(options[key]) || isNumberString(options[key])) {
          if (isNumberString(options[key])) {
            __privateGet(this, _options3)[key] = Number(options[key]);
          } else {
            __privateGet(this, _options3)[key] = options[key];
          }
        }
      });
      pointValues.forEach((key) => {
        if (options[key]) {
          __privateGet(this, _options3)[key] = point(options[key]);
        }
      });
      stringValues.forEach((key) => {
        if (options[key] && isStringWithValue(options[key])) {
          __privateGet(this, _options3)[key] = options[key];
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
   * @returns {google.maps.Symbol}
   */
  toGoogle() {
    const options = __spreadValues({}, __privateGet(this, _options3));
    if (options.anchor instanceof Point) {
      options.anchor = options.anchor.toGoogle();
    }
    if (options.labelOrigin instanceof Point) {
      options.labelOrigin = options.labelOrigin.toGoogle();
    }
    return options;
  }
};
_options3 = new WeakMap();
var svgSymbol = (path, options) => {
  if (path instanceof SvgSymbol) {
    return path;
  }
  return new SvgSymbol(path, options);
};

// src/lib/Marker.ts
var _marker, _options4, _setAnchorPoint, setAnchorPoint_fn, _setCursor, setCursor_fn, _setDraggable, setDraggable_fn, _setIcon, setIcon_fn, _setLabel, setLabel_fn, _setMap, setMap_fn, _setPosition, setPosition_fn, _setTitle, setTitle_fn, _setupGoogleMarker, setupGoogleMarker_fn, _setupGoogleMarkerSync, setupGoogleMarkerSync_fn, _createMarkerObject, createMarkerObject_fn;
var _Marker = class _Marker extends Layer_default {
  /**
   * Constructor
   *
   * @param {LatLngValue|MarkerOptions} [position] The latitude longitude pair
   * @param {MarkerOptions} [options] The marker options
   */
  constructor(position, options) {
    super("marker", "Marker");
    /**
     * Set the anchor point for the marker
     *
     * @param {PointValue} value The anchor point for the marker
     */
    __privateAdd(this, _setAnchorPoint);
    /**
     * Set the cursor for the marker
     *
     * @param {string} value The cursor type to show on hover
     */
    __privateAdd(this, _setCursor);
    /**
     * Set whether the marker can be dragged on the map
     *
     * @param {boolean} value Whether the marker can be dragged on the map
     */
    __privateAdd(this, _setDraggable);
    /**
     * Set the latitude and longitude value for the marker
     *
     * @param {Icon | SvgSymbol | string} value The icon for the marker
     */
    __privateAdd(this, _setIcon);
    /**
     * Set the latitude and longitude value for the marker
     *
     * @param {string | number | MarkerLabel} value The latitude/longitude position for the marker
     */
    __privateAdd(this, _setLabel);
    /**
     * Set the map object
     *
     * @param {Map|null} value The map object. Set to null if you want to remove the marker from the map.
     */
    __privateAdd(this, _setMap);
    /**
     * Set the latitude and longitude value for the marker
     *
     * @param {LatLngValue} value The latitude/longitude position for the marker
     */
    __privateAdd(this, _setPosition);
    /**
     * Set the title for the marker
     *
     * @param {string} value The title to show on hover
     */
    __privateAdd(this, _setTitle);
    /**
     * Set up the Google maps marker object if necessary
     *
     * @private
     * @param {Map} [map] The map object. If it's set then it will be initialized if the Google maps object isn't available yet.
     * @returns {Promise<void>}
     */
    __privateAdd(this, _setupGoogleMarker);
    /**
     * Set up the Google maps marker object syncronously.
     */
    __privateAdd(this, _setupGoogleMarkerSync);
    /**
     * Create the marker object
     *
     * @private
     */
    __privateAdd(this, _createMarkerObject);
    /**
     * Holds the Google maps marker object
     *
     * @private
     * @type {google.maps.Marker}
     */
    __privateAdd(this, _marker, void 0);
    /**
     * Holds the marker options
     *
     * @private
     * @type {GMMarkerOptions}
     */
    __privateAdd(this, _options4, {});
    __privateGet(this, _options4).position = latLng([0, 0]);
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
   * @returns {Point}
   */
  get anchorPoint() {
    return __privateGet(this, _options4).anchorPoint;
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
   * @returns {string}
   */
  get cursor() {
    return __privateGet(this, _options4).cursor;
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
   * Get whether the marker can be dragged on the map
   *
   * @returns {boolean}
   */
  get draggable() {
    var _a;
    return (_a = __privateGet(this, _options4).draggable) != null ? _a : false;
  }
  /**
   * Set whether the marker can be dragged on the map
   *
   * @param {boolean} value Whether the marker can be dragged on the map
   */
  set draggable(value) {
    this.setDraggable(value);
  }
  /**
   * Get the icon for the marker
   *
   * @returns {Icon | SvgSymbol | string}
   */
  get icon() {
    return __privateGet(this, _options4).icon;
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
   * @returns {string | number | MarkerLabel}
   */
  get label() {
    return __privateGet(this, _options4).label;
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
   * @returns {Map}
   */
  get map() {
    return __privateGet(this, _options4).map;
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
   * Get the marker position
   *
   * @returns {LatLng}
   */
  get position() {
    return __privateGet(this, _options4).position;
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
   * @returns {string}
   */
  get title() {
    return __privateGet(this, _options4).title;
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
   * Returns whether the marker can be dragged on the map
   *
   * @returns {boolean}
   */
  getDraggable() {
    return this.draggable;
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
      __privateMethod(this, _setupGoogleMarker, setupGoogleMarker_fn).call(this).then(() => {
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
   * Set the anchor point for the marker
   *
   * @param {PointValue} value The anchor point for the marker
   * @returns {Promise<Marker>}
   */
  setAnchorPoint(value) {
    return __async(this, null, function* () {
      yield __privateMethod(this, _setupGoogleMarker, setupGoogleMarker_fn).call(this);
      __privateMethod(this, _setAnchorPoint, setAnchorPoint_fn).call(this, value);
      return this;
    });
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
    __privateMethod(this, _setupGoogleMarkerSync, setupGoogleMarkerSync_fn).call(this);
    __privateMethod(this, _setAnchorPoint, setAnchorPoint_fn).call(this, value);
    return this;
  }
  /**
   * Set the cursor type to show on hover
   *
   * @param {string} value The cursor type to show on hover
   * @returns {Promise<Marker>}
   */
  setCursor(value) {
    return __async(this, null, function* () {
      yield __privateMethod(this, _setupGoogleMarker, setupGoogleMarker_fn).call(this);
      __privateMethod(this, _setCursor, setCursor_fn).call(this, value);
      return this;
    });
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
    __privateMethod(this, _setupGoogleMarkerSync, setupGoogleMarkerSync_fn).call(this);
    __privateMethod(this, _setCursor, setCursor_fn).call(this, value);
    return this;
  }
  /**
   * Set whether the marker can be dragged on the map
   *
   * @param {boolean} value Whether the marker can be dragged on the map
   * @returns {Promise<Marker>}
   */
  setDraggable(value) {
    return __async(this, null, function* () {
      yield __privateMethod(this, _setupGoogleMarker, setupGoogleMarker_fn).call(this);
      __privateMethod(this, _setDraggable, setDraggable_fn).call(this, value);
      return this;
    });
  }
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
  setDraggableSync(value) {
    __privateMethod(this, _setupGoogleMarkerSync, setupGoogleMarkerSync_fn).call(this);
    __privateMethod(this, _setDraggable, setDraggable_fn).call(this, value);
    return this;
  }
  /**
   * Set the icon value for the marker
   *
   * @param {Icon | SvgSymbol | string} value The icon for the marker
   * @returns {Marker}
   */
  setIcon(value) {
    return __async(this, null, function* () {
      yield __privateMethod(this, _setupGoogleMarker, setupGoogleMarker_fn).call(this);
      __privateMethod(this, _setIcon, setIcon_fn).call(this, value);
      return this;
    });
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
    __privateMethod(this, _setupGoogleMarkerSync, setupGoogleMarkerSync_fn).call(this);
    __privateMethod(this, _setIcon, setIcon_fn).call(this, value);
    return this;
  }
  /**
   * Set the label value for the marker
   *
   * @param {string | number | MarkerLabel} value The label for the marker
   * @returns {Marker}
   */
  setLabel(value) {
    return __async(this, null, function* () {
      yield __privateMethod(this, _setupGoogleMarker, setupGoogleMarker_fn).call(this);
      __privateMethod(this, _setLabel, setLabel_fn).call(this, value);
      return this;
    });
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
    __privateMethod(this, _setupGoogleMarkerSync, setupGoogleMarkerSync_fn).call(this);
    __privateMethod(this, _setLabel, setLabel_fn).call(this, value);
    return this;
  }
  /**
   * Adds the marker to the map object
   *
   * Alternate of show()
   *
   * @param {Map} map The map object. Set to null if you want to remove the marker from the map.
   * @returns {Promise<Marker>}
   */
  setMap(map2) {
    return __async(this, null, function* () {
      yield __privateMethod(this, _setupGoogleMarker, setupGoogleMarker_fn).call(this, map2);
      __privateMethod(this, _setMap, setMap_fn).call(this, map2);
      return this;
    });
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
    __privateMethod(this, _setupGoogleMarkerSync, setupGoogleMarkerSync_fn).call(this);
    __privateMethod(this, _setMap, setMap_fn).call(this, map2);
    return this;
  }
  /**
   * Set the marker options
   *
   * @param {MarkerOptions} options The marker options
   * @returns {Marker}
   */
  setOptions(options) {
    if (options.anchorPoint) {
      this.anchorPoint = options.anchorPoint;
    }
    if (typeof options.draggable === "boolean") {
      this.draggable = options.draggable;
    }
    if (options.icon) {
      this.icon = icon(options.icon);
    } else if (options.svgIcon) {
      if (isString(options.svgIcon)) {
        this.icon = `data:image/svg+xml;base64,${btoa(options.svgIcon)}`;
      } else {
        this.icon = svgSymbol(options.svgIcon);
      }
    }
    if (isStringWithValue(options.label) || isObject(options.label) && isStringOrNumber(options.label.text)) {
      this.label = options.label;
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
      this.position = latLngValue;
    } else if (options.position) {
      this.position = options.position;
    }
    if (options.tooltip) {
      let { tooltip: tooltip2 } = options;
      if (options.title && isObject(tooltip2) && !(tooltip2 instanceof HTMLElement || tooltip2 instanceof Text)) {
        tooltip2 = __spreadValues(__spreadValues({}, { content: options.title }), tooltip2);
      }
      this.attachTooltip(tooltip2);
    } else if (options.title) {
      this.title = options.title;
    }
    const stringOptions = ["cursor"];
    stringOptions.forEach((key) => {
      if (options[key] && isStringWithValue(options[key])) {
        __privateGet(this, _options4)[key] = options[key];
      }
    });
    if (options.map) {
      this.setMap(options.map);
    }
    return this;
  }
  /**
   * Set the latitude and longitude value for the marker
   *
   * @param {LatLngValue} value The latitude/longitude position for the marker
   * @returns {Promise<Marker>}
   */
  setPosition(value) {
    return __async(this, null, function* () {
      yield __privateMethod(this, _setupGoogleMarker, setupGoogleMarker_fn).call(this);
      __privateMethod(this, _setPosition, setPosition_fn).call(this, value);
      return this;
    });
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
    __privateMethod(this, _setupGoogleMarkerSync, setupGoogleMarkerSync_fn).call(this);
    __privateMethod(this, _setPosition, setPosition_fn).call(this, value);
    return this;
  }
  /**
   *Set the title for the marker
   *
   * @param {string} value The title to show on hover
   * @returns {Promise<Marker>}
   */
  setTitle(value) {
    return __async(this, null, function* () {
      yield __privateMethod(this, _setupGoogleMarker, setupGoogleMarker_fn).call(this);
      __privateMethod(this, _setTitle, setTitle_fn).call(this, value);
      return this;
    });
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
    __privateMethod(this, _setupGoogleMarkerSync, setupGoogleMarkerSync_fn).call(this);
    __privateMethod(this, _setTitle, setTitle_fn).call(this, value);
    return this;
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
      __privateMethod(this, _setupGoogleMarker, setupGoogleMarker_fn).call(this).then(() => {
        resolve(__privateGet(this, _marker));
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
    __privateMethod(this, _setupGoogleMarkerSync, setupGoogleMarkerSync_fn).call(this);
    return __privateGet(this, _marker);
  }
};
_marker = new WeakMap();
_options4 = new WeakMap();
_setAnchorPoint = new WeakSet();
setAnchorPoint_fn = function(value) {
  const anchor = point(value);
  if (anchor.isValid()) {
    __privateGet(this, _options4).anchorPoint = anchor;
  } else {
    __privateGet(this, _options4).anchorPoint = void 0;
  }
  __privateGet(this, _marker).setOptions({ anchorPoint: __privateGet(this, _options4).anchorPoint.toGoogle() });
};
_setCursor = new WeakSet();
setCursor_fn = function(value) {
  if (isStringWithValue(value)) {
    __privateGet(this, _options4).cursor = value;
  } else if (isNullOrUndefined(value)) {
    __privateGet(this, _options4).cursor = void 0;
  }
  __privateGet(this, _marker).setCursor(__privateGet(this, _options4).cursor);
};
_setDraggable = new WeakSet();
setDraggable_fn = function(value) {
  if (isBoolean(value)) {
    __privateGet(this, _options4).draggable = value;
    __privateGet(this, _marker).setDraggable(value);
  }
};
_setIcon = new WeakSet();
setIcon_fn = function(value) {
  if (isString(value) || value instanceof Icon || value instanceof SvgSymbol) {
    __privateGet(this, _options4).icon = value;
  } else if (isNullOrUndefined(value)) {
    __privateGet(this, _options4).icon = void 0;
  }
  if (isString(__privateGet(this, _options4).icon)) {
    __privateGet(this, _marker).setIcon(__privateGet(this, _options4).icon);
  } else {
    __privateGet(this, _marker).setIcon(__privateGet(this, _options4).icon.toGoogle());
  }
};
_setLabel = new WeakSet();
setLabel_fn = function(value) {
  if (isStringWithValue(value)) {
    __privateGet(this, _options4).label = value;
  } else if (isObject(value) && isStringOrNumber(value.text)) {
    __privateGet(this, _options4).label = {
      text: value.text.toString(),
      className: isStringWithValue(value.className) ? value.className : void 0,
      color: isStringWithValue(value.color) ? value.color : void 0,
      fontFamily: isStringWithValue(value.fontFamily) ? value.fontFamily : void 0,
      fontWeight: isStringWithValue(value.fontWeight) ? value.fontWeight : void 0
    };
    if (isStringWithValue(value.fontSize) || isNumber(value.fontSize)) {
      if (isNumber(value.fontSize)) {
        __privateGet(this, _options4).label.fontSize = `${value.fontSize}px`;
      } else {
        __privateGet(this, _options4).label.fontSize = value.fontSize.toString();
      }
    }
  } else if (isNullOrUndefined(value)) {
    __privateGet(this, _options4).label = void 0;
  }
  __privateGet(this, _marker).setLabel(__privateGet(this, _options4).label);
};
_setMap = new WeakSet();
setMap_fn = function(value) {
  if (value instanceof Map) {
    __privateGet(this, _options4).map = value;
    __superGet(_Marker.prototype, this, "setMap").call(this, value);
    __privateGet(this, _marker).setMap(value.toGoogle());
  } else if (isNullOrUndefined(value)) {
    __privateGet(this, _options4).map = null;
    __superGet(_Marker.prototype, this, "setMap").call(this, null);
    if (__privateGet(this, _marker)) {
      __privateGet(this, _marker).setMap(null);
    }
  }
};
_setPosition = new WeakSet();
setPosition_fn = function(value) {
  const position = latLng(value);
  if (position.isValid()) {
    __privateGet(this, _options4).position = position;
    __privateGet(this, _marker).setPosition(__privateGet(this, _options4).position.toGoogle());
  }
};
_setTitle = new WeakSet();
setTitle_fn = function(value) {
  if (isStringWithValue(value)) {
    __privateGet(this, _options4).title = value;
  } else if (isNullOrUndefined(value)) {
    __privateGet(this, _options4).title = void 0;
  }
  __privateGet(this, _marker).setTitle(__privateGet(this, _options4).title);
};
_setupGoogleMarker = new WeakSet();
setupGoogleMarker_fn = function(map2) {
  return new Promise((resolve) => {
    if (!isObject(__privateGet(this, _marker))) {
      if (checkForGoogleMaps("Marker", "Marker", false)) {
        __privateMethod(this, _createMarkerObject, createMarkerObject_fn).call(this);
        resolve();
      } else {
        loader().once("map_loaded", () => {
          __privateMethod(this, _createMarkerObject, createMarkerObject_fn).call(this);
          const thisMap = this.getMap();
          if (__privateGet(this, _marker) && thisMap) {
            __privateGet(this, _marker).setMap(thisMap.toGoogle());
          }
          resolve();
        });
        if (map2 instanceof Map) {
          map2.init();
        }
      }
    } else {
      resolve();
    }
  });
};
_setupGoogleMarkerSync = new WeakSet();
setupGoogleMarkerSync_fn = function() {
  if (!isObject(__privateGet(this, _marker))) {
    if (checkForGoogleMaps("Marker", "Marker", false)) {
      __privateMethod(this, _createMarkerObject, createMarkerObject_fn).call(this);
    } else {
      throw new Error(
        "The Google maps libray is not available so the marker object cannot be created. Load the Google maps library first."
      );
    }
  }
};
_createMarkerObject = new WeakSet();
createMarkerObject_fn = function() {
  if (!__privateGet(this, _marker)) {
    const markerOptions = {};
    const optionsToSet = ["cursor", "title"];
    optionsToSet.forEach((key) => {
      if (typeof __privateGet(this, _options4)[key] !== "undefined") {
        markerOptions[key] = __privateGet(this, _options4)[key];
      }
    });
    if (__privateGet(this, _options4).anchorPoint) {
      markerOptions.anchorPoint = __privateGet(this, _options4).anchorPoint.toGoogle();
    }
    if (__privateGet(this, _options4).icon) {
      if (isString(__privateGet(this, _options4).icon)) {
        markerOptions.icon = __privateGet(this, _options4).icon;
      } else if (__privateGet(this, _options4).icon instanceof Icon || __privateGet(this, _options4).icon instanceof SvgSymbol) {
        markerOptions.icon = __privateGet(this, _options4).icon.toGoogle();
      }
    }
    if (__privateGet(this, _options4).map) {
      markerOptions.map = __privateGet(this, _options4).map.toGoogle();
    }
    if (__privateGet(this, _options4).position) {
      markerOptions.position = __privateGet(this, _options4).position.toGoogle();
    }
    __privateSet(this, _marker, new google.maps.Marker(markerOptions));
    this.setEventGoogleObject(__privateGet(this, _marker));
  }
};
var Marker = _Marker;
var marker = (position, options) => {
  if (position instanceof Marker) {
    return position;
  }
  return new Marker(position, options);
};

// src/lib/InfoWindow.ts
var _autoClose, _event, _focus, _isAttached, _isOpen, _options5, _toggleDisplay, _infoWindow, _setupGoogleInfoWindow, setupGoogleInfoWindow_fn;
var InfoWindow = class extends Layer_default {
  /**
   * Constructor
   *
   * @param {InfoWindowOptions | string | HTMLElement | Text} [options] The InfoWindow options
   */
  constructor(options) {
    super("infowindow", "InfoWindow");
    /**
     * Set up the Google maps InfoWindow object if necessary
     *
     * @private
     */
    __privateAdd(this, _setupGoogleInfoWindow);
    /**
     * Whether to automatically close other open InfoWindows when opening this one
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _autoClose, true);
    /**
     * The event to trigger the popup
     *
     * @private
     * @type {'click' | 'clickon' | 'hover'}
     */
    __privateAdd(this, _event, "click");
    /**
     * Whether focus should be moved to the InfoWindow when it is opened
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _focus, false);
    /**
     * Whether the InfoWindow is attached to an element
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _isAttached, false);
    /**
     * Holds if the InfoWindow is open or not
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _isOpen, false);
    /**
     * Holds the InfoWindow options
     *
     * @private
     * @type {InfoWindowOptions}
     */
    __privateAdd(this, _options5, {});
    /**
     * Whether clicking the thing that triggered the info window to open should also close the info window
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _toggleDisplay, true);
    /**
     * Holds the Google maps InfoWindow object
     *
     * @private
     * @type {google.maps.InfoWindow}
     */
    __privateAdd(this, _infoWindow, void 0);
    __privateGet(this, _options5).pixelOffset = size(0, -4);
    if (isObject(options)) {
      if (options instanceof HTMLElement || options instanceof Text) {
        this.content = options;
      } else {
        this.setOptions(options);
      }
    } else {
      this.content = options;
    }
  }
  /**
   * Get the aria label for the InfoWindow
   *
   * @returns {string}
   */
  get ariaLabel() {
    return __privateGet(this, _options5).ariaLabel;
  }
  /**
   * Set the aria label for the InfoWindow
   *
   * @param {string|number} ariaLabel The aria label for the InfoWindow
   */
  set ariaLabel(ariaLabel) {
    if (isStringWithValue(ariaLabel) || isNumber(ariaLabel)) {
      __privateGet(this, _options5).ariaLabel = ariaLabel.toString();
      __privateMethod(this, _setupGoogleInfoWindow, setupGoogleInfoWindow_fn).call(this);
      if (__privateGet(this, _infoWindow)) {
        __privateGet(this, _infoWindow).setOptions({ ariaLabel: __privateGet(this, _options5).ariaLabel });
      }
    }
  }
  /**
   * Get the content for the InfoWindow
   *
   * @returns {string|HTMLElement|Text}
   */
  get content() {
    return __privateGet(this, _options5).content;
  }
  /**
   * Set the content for the InfoWindow
   *
   * @param {string|HTMLElement|Text} content The content for the InfoWindow
   */
  set content(content) {
    if (isStringWithValue(content) || content instanceof HTMLElement || content instanceof Text) {
      __privateGet(this, _options5).content = content;
      __privateMethod(this, _setupGoogleInfoWindow, setupGoogleInfoWindow_fn).call(this);
      if (__privateGet(this, _infoWindow)) {
        __privateGet(this, _infoWindow).setContent(content);
      }
    }
  }
  /**
   * Get the disableAutoPan option for the InfoWindow
   *
   * @returns {boolean}
   */
  get disableAutoPan() {
    return typeof __privateGet(this, _options5).disableAutoPan === "boolean" && __privateGet(this, _options5).disableAutoPan === true;
  }
  /**
   * Set the disableAutoPan option for the InfoWindow
   *
   * @param {boolean} disableAutoPan The disableAutoPan option for the InfoWindow
   */
  set disableAutoPan(disableAutoPan) {
    if (typeof disableAutoPan !== "boolean") {
      __privateGet(this, _options5).disableAutoPan = disableAutoPan;
      __privateMethod(this, _setupGoogleInfoWindow, setupGoogleInfoWindow_fn).call(this);
      if (__privateGet(this, _infoWindow)) {
        __privateGet(this, _infoWindow).setOptions({ disableAutoPan: __privateGet(this, _options5).disableAutoPan });
      }
    }
  }
  /**
   * Returns the event to trigger the popup
   *
   * @returns {string}
   */
  get event() {
    return __privateGet(this, _event);
  }
  /**
   * Set the event to trigger the popup
   *
   * @param {string} event The event to trigger the popup
   */
  set event(event) {
    if (isStringWithValue(event) && ["click", "clickon", "hover"].includes(event.toLowerCase())) {
      __privateSet(this, _event, event.toLowerCase());
    } else {
      throw new Error('Invalid event value. Allowed values are: "click", "clickon", and "hover"');
    }
  }
  /**
   * Get the maxWidth option for the InfoWindow
   *
   * @returns {number}
   */
  get maxWidth() {
    return __privateGet(this, _options5).maxWidth;
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
      __privateGet(this, _options5).maxWidth = width;
      __privateMethod(this, _setupGoogleInfoWindow, setupGoogleInfoWindow_fn).call(this);
      if (__privateGet(this, _infoWindow)) {
        __privateGet(this, _infoWindow).setOptions({ maxWidth: __privateGet(this, _options5).maxWidth });
      }
    }
  }
  /**
   * Get the minWidth option for the InfoWindow
   *
   * @returns {number}
   */
  get minWidth() {
    return __privateGet(this, _options5).minWidth;
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
      __privateGet(this, _options5).minWidth = width;
      __privateMethod(this, _setupGoogleInfoWindow, setupGoogleInfoWindow_fn).call(this);
      if (__privateGet(this, _infoWindow)) {
        __privateGet(this, _infoWindow).setOptions({ minWidth: __privateGet(this, _options5).minWidth });
      }
    }
  }
  /**
   * Get the pixelOffset option for the InfoWindow
   *
   * @returns {Size}
   */
  get pixelOffset() {
    return __privateGet(this, _options5).pixelOffset;
  }
  /**
   * Set the pixelOffset option for the InfoWindow
   *
   * @param {SizeValue} pixelOffset The pixelOffset option for the InfoWindow
   */
  set pixelOffset(pixelOffset) {
    const sizeValue = size(pixelOffset);
    if (sizeValue.isValid()) {
      __privateMethod(this, _setupGoogleInfoWindow, setupGoogleInfoWindow_fn).call(this);
      __privateGet(this, _options5).pixelOffset = sizeValue;
      if (__privateGet(this, _infoWindow)) {
        __privateGet(this, _infoWindow).setOptions({ pixelOffset: __privateGet(this, _options5).pixelOffset.toGoogle() });
      }
    }
  }
  /**
   * Get the position option for the InfoWindow
   *
   * @returns {LatLng}
   */
  get position() {
    return __privateGet(this, _options5).position;
  }
  /**
   * Set the position option for the InfoWindow
   *
   * @param {LatLngValue} position The position option for the InfoWindow
   */
  set position(position) {
    const latLngValue = latLng(position);
    if (latLngValue.isValid()) {
      __privateMethod(this, _setupGoogleInfoWindow, setupGoogleInfoWindow_fn).call(this);
      __privateGet(this, _options5).position = latLngValue;
      if (__privateGet(this, _infoWindow)) {
        __privateGet(this, _infoWindow).setPosition(__privateGet(this, _options5).position.toGoogle());
      }
    }
  }
  /**
   * Get the zIndex option for the InfoWindow
   *
   * @returns {number}
   */
  get zIndex() {
    return __privateGet(this, _options5).zIndex;
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
      __privateGet(this, _options5).zIndex = zIndexValue;
      __privateMethod(this, _setupGoogleInfoWindow, setupGoogleInfoWindow_fn).call(this);
      if (__privateGet(this, _infoWindow)) {
        __privateGet(this, _infoWindow).setOptions({ zIndex: __privateGet(this, _options5).zIndex });
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
  attachTo(element, event) {
    return __async(this, null, function* () {
      if (!__privateGet(this, _isAttached)) {
        __privateSet(this, _isAttached, true);
        yield element.init().then(() => {
          const triggerEvent = event || __privateGet(this, _event);
          if (triggerEvent === "clickon" || triggerEvent === "hover") {
            __privateSet(this, _toggleDisplay, false);
          }
          if (triggerEvent === "hover") {
            element.on("mouseover", (e) => {
              this.position = e.latLng;
              this.show(element);
            });
            if (element instanceof Map) {
              element.on("mousemove", (e) => {
                this.position = e.latLng;
                this.show(element);
              });
            }
            element.on("mouseout", () => {
              this.hide();
            });
          } else if (triggerEvent === "clickon") {
            element.on("click", (e) => {
              if (element instanceof Map) {
                this.position = e.latLng;
              }
              this.show(element);
            });
          } else {
            element.on("click", (e) => {
              if (element instanceof Map) {
                this.position = e.latLng;
              }
              this.show(element);
            });
          }
        });
      }
      return this;
    });
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
    return typeof __privateGet(this, _options5).content !== "undefined" && (isStringWithValue(__privateGet(this, _options5).content) || __privateGet(this, _options5).content instanceof HTMLElement || __privateGet(this, _options5).content instanceof Text);
  }
  /**
   * Hide the info window
   *
   * @returns {InfoWindow}
   */
  hide() {
    if (__privateGet(this, _infoWindow)) {
      __privateGet(this, _infoWindow).close();
    }
    __privateSet(this, _isOpen, false);
    InfoWindowCollection.getInstance().remove(this);
    return this;
  }
  /**
   * Returns whether the InfoWindow is open or not
   *
   * @returns {boolean}
   */
  isOpen() {
    return __privateGet(this, _isOpen);
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
    if (options.disableAutoPan) {
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
      __privateSet(this, _autoClose, options.autoClose);
    }
    if (typeof options.focus === "boolean") {
      __privateSet(this, _focus, options.focus);
    }
    if (typeof options.toggleDisplay === "boolean") {
      __privateSet(this, _toggleDisplay, options.toggleDisplay);
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
    return new Promise((resolve) => {
      __privateMethod(this, _setupGoogleInfoWindow, setupGoogleInfoWindow_fn).call(this);
      const collection = InfoWindowCollection.getInstance();
      if (collection.has(this) && __privateGet(this, _isOpen)) {
        if (__privateGet(this, _toggleDisplay)) {
          this.hide();
        }
        resolve(this);
      } else {
        if (__privateGet(this, _autoClose)) {
          collection.hideOthers(this);
        }
        __privateSet(this, _isOpen, true);
        collection.add(this);
        if (element instanceof Map) {
          __privateGet(this, _infoWindow).open({
            map: element.toGoogle(),
            shouldFocus: __privateGet(this, _focus)
          });
          this.setMap(element);
          resolve(this);
        } else if (element instanceof Marker) {
          element.toGoogle().then((marker2) => {
            __privateGet(this, _infoWindow).open({
              anchor: marker2,
              shouldFocus: __privateGet(this, _focus)
            });
            this.setMap(element.getMap());
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
    if (this.isVisible) {
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
   * @returns {google.maps.InfoWindow}
   */
  toGoogle() {
    __privateMethod(this, _setupGoogleInfoWindow, setupGoogleInfoWindow_fn).call(this);
    return __privateGet(this, _infoWindow);
  }
};
_autoClose = new WeakMap();
_event = new WeakMap();
_focus = new WeakMap();
_isAttached = new WeakMap();
_isOpen = new WeakMap();
_options5 = new WeakMap();
_toggleDisplay = new WeakMap();
_infoWindow = new WeakMap();
_setupGoogleInfoWindow = new WeakSet();
setupGoogleInfoWindow_fn = function() {
  if (!isObject(__privateGet(this, _infoWindow))) {
    if (checkForGoogleMaps("InfoWindow", "InfoWindow", false)) {
      const infoWindowOptions = {};
      const optionsToSet = ["ariaLabel", "content", "disableAutoPan", "maxWidth", "minWidth", "zIndex"];
      optionsToSet.forEach((key) => {
        if (typeof __privateGet(this, _options5)[key] !== "undefined") {
          infoWindowOptions[key] = __privateGet(this, _options5)[key];
        }
      });
      if (__privateGet(this, _options5).pixelOffset) {
        infoWindowOptions.pixelOffset = __privateGet(this, _options5).pixelOffset.toGoogle();
      }
      if (__privateGet(this, _options5).position) {
        infoWindowOptions.position = __privateGet(this, _options5).position.toGoogle();
      }
      __privateSet(this, _infoWindow, new google.maps.InfoWindow(infoWindowOptions));
      __privateGet(this, _infoWindow).addListener("closeclick", () => {
        InfoWindowCollection.getInstance().remove(this);
      });
      __privateGet(this, _infoWindow).addListener("map_changed", () => {
        if (__privateGet(this, _infoWindow).get("map") === null) {
          __privateSet(this, _isOpen, false);
          InfoWindowCollection.getInstance().remove(this);
        }
      });
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
   * @type {InfoWindow}
   */
  layerInfoWindow: null,
  /**
   * Attach an InfoWindow to the layer
   *
   * @param {InfoWindowValue} infoWindowValue The content for the InfoWindow, or the InfoWindow options object, or the InfoWindow object
   * @param {'click' | 'clickon' | 'hover'} [event] The event to trigger the popup. Defaults to 'hover'. See Popup.attachTo() for more information.
   */
  attachInfoWindow(infoWindowValue, event) {
    infoWindow(infoWindowValue).attachTo(this, event);
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
import {
  GridAlgorithm,
  MarkerClusterer,
  NoopAlgorithm,
  SuperClusterAlgorithm
} from "@googlemaps/markerclusterer";

// src/lib/MarkerCluster/DefaultRender.ts
import { MarkerUtils } from "@googlemaps/markerclusterer";
var _colors, _colorRangeBottom, _colorRangeTop, _centerOpacity, _middleOpacity, _outerOpacity, _labelFontFamily, _labelFontSize, _showNumber, _getColor, getColor_fn;
var DefaultRenderer = class {
  constructor() {
    /**
     * Get the color for the cluster.
     *
     * @param {number} count The number of markers in the cluster.
     * @param {number} mean The average number of markers in a cluster.
     * @returns {ClusterColor}
     */
    __privateAdd(this, _getColor);
    /**
     * The colors to use for the clusters.
     */
    __privateAdd(this, _colors, {});
    /**
     * The color to use for the cluster if it has less than the average number of markers in a cluster.
     *
     * @type {string|ClusterColor}
     */
    __privateAdd(this, _colorRangeBottom, "#ff0000");
    /**
     * The color to use for the cluster if it has more than the average number of markers in a cluster.
     *
     * @type {string|ClusterColor}
     */
    __privateAdd(this, _colorRangeTop, "#0000ff");
    /**
     * The opacity to use for the center of the marker
     *
     * @type {number}
     */
    __privateAdd(this, _centerOpacity, 0.7);
    /**
     * The opacity to use for the middle ring of the marker
     *
     * @type {number}
     */
    __privateAdd(this, _middleOpacity, 0.4);
    /**
     * The opacity to use for the outer ring of the marker
     *
     * @type {number}
     */
    __privateAdd(this, _outerOpacity, 0.2);
    /**
     * Holds the font family for the cluster marker label
     *
     * @type {string}
     */
    __privateAdd(this, _labelFontFamily, "roboto,arial,sans-serif");
    /**
     * Holds the font size for the cluster marker
     *
     * @type {string}
     */
    __privateAdd(this, _labelFontSize, "12px");
    /**
     * Holds if the number of markers in the cluster should be displayed
     *
     * @type {boolean}
     */
    __privateAdd(this, _showNumber, true);
  }
  /**
   * Set the color to use for the cluster if it has less than the average number of markers in a cluster.
   *
   * @param {string|ClusterColor} color The color to use if the cluster has less than the average number of markers in a cluster.
   */
  setColorRangeBottom(color) {
    if (isStringWithValue(color)) {
      __privateSet(this, _colorRangeBottom, color);
    } else if (isObject(color) && isStringWithValue(color.bgColor)) {
      __privateSet(this, _colorRangeBottom, color);
    }
  }
  /**
   * Set the color to use for the cluster if it has more than the average number of markers in a cluster.
   *
   * @param {string|ClusterColor} color The color to use if the cluster has more than the average number of markers in a cluster.
   */
  setColorRangeTop(color) {
    if (isStringWithValue(color)) {
      __privateSet(this, _colorRangeTop, color);
    } else if (isObject(color) && isStringWithValue(color.bgColor)) {
      __privateSet(this, _colorRangeBottom, color);
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
        __privateSet(this, _colors, sortedColors);
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
      __privateSet(this, _centerOpacity, opacity);
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
      __privateSet(this, _middleOpacity, opacity);
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
      __privateSet(this, _outerOpacity, opacity);
    }
  }
  /**
   * Set the font family to use for the cluster marker
   *
   * @param {string} fontFamily The font family to use for the cluster marker
   */
  setFontFamily(fontFamily) {
    __privateSet(this, _labelFontFamily, fontFamily);
  }
  /**
   * Set the font size to use for the cluster marker
   *
   * @param {number} fontSize The font size to use for the cluster marker
   */
  setFontSize(fontSize) {
    if (isString(fontSize)) {
      __privateSet(this, _labelFontSize, fontSize);
    } else if (isNumber(fontSize)) {
      __privateSet(this, _labelFontSize, `${fontSize}px`);
    }
  }
  /**
   * Sets if the number of markers in the cluster should be displayed
   *
   * @param {boolean} showNumber Whether to show the number of markers in the cluster
   */
  setShowNumber(showNumber) {
    __privateSet(this, _showNumber, getBoolean(showNumber));
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
    const color = __privateMethod(this, _getColor, getColor_fn).call(this, count, stats.clusters.markers.mean);
    const svg = `<svg fill="${color.bgColor}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50" height="50">
                <circle cx="25" cy="25" opacity="${__privateGet(this, _centerOpacity)}" r="16" />
                <circle cx="25" cy="25" opacity="${__privateGet(this, _middleOpacity)}" r="22" />
                <circle cx="25" cy="25" opacity="${__privateGet(this, _outerOpacity)}" r="25" />
                <text x="50%" y="50%" style="fill:${color.textColor}" text-anchor="middle" font-size="${__privateGet(this, _labelFontSize)}" dominant-baseline="middle" font-family="${__privateGet(this, _labelFontFamily)}">${__privateGet(this, _showNumber) ? count : ""}</text>
            </svg>`;
    const title = `Cluster of ${count} markers`;
    const zIndex = Number(google.maps.Marker.MAX_ZINDEX) + count;
    if (MarkerUtils.isAdvancedMarkerAvailable(map2)) {
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
_colors = new WeakMap();
_colorRangeBottom = new WeakMap();
_colorRangeTop = new WeakMap();
_centerOpacity = new WeakMap();
_middleOpacity = new WeakMap();
_outerOpacity = new WeakMap();
_labelFontFamily = new WeakMap();
_labelFontSize = new WeakMap();
_showNumber = new WeakMap();
_getColor = new WeakSet();
getColor_fn = function(count, mean) {
  const keys = Object.keys(__privateGet(this, _colors));
  let color = __privateGet(this, _colorRangeBottom);
  if (Object.keys(__privateGet(this, _colors)).length > 0) {
    for (let i = 0; i < keys.length; i += 1) {
      const k = keys[i];
      if (count >= parseInt(k, 10)) {
        color = __privateGet(this, _colors)[k];
      } else {
        break;
      }
    }
  } else {
    color = count > mean ? __privateGet(this, _colorRangeTop) : __privateGet(this, _colorRangeBottom);
  }
  let bgColor;
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
};

// src/lib/MarkerCluster/ImageRenderer.ts
var _images, _labelClassName, _labelColor, _labelFontFamily2, _labelFontSize2, _labelFontWeight, _map3, _showNumber2;
var ImageRenderer = class {
  constructor() {
    /**
     * Holds the images that can be used for the marker cluster icons
     *
     * @private
     * @type {ClusterImages}
     */
    __privateAdd(this, _images, {});
    /**
     * A CSS class name to be added to the label element
     *
     * @private
     * @type {string}
     */
    __privateAdd(this, _labelClassName, void 0);
    /**
     * The color of the label text. Default color is black.
     *
     * @private
     * @type {string}
     */
    __privateAdd(this, _labelColor, void 0);
    /**
     * Holds the font family for the cluster marker label.
     *
     * @private
     * @type {string}
     */
    __privateAdd(this, _labelFontFamily2, void 0);
    /**
     * Holds the font size for the cluster marker
     *
     * @private
     * @type {number}
     */
    __privateAdd(this, _labelFontSize2, "12px");
    /**
     * The font weight of the label text (equivalent to the CSS font-weight property).
     *
     * @private
     * @type {string}
     */
    __privateAdd(this, _labelFontWeight, void 0);
    /**
     * The map object
     *
     * @private
     * @type {Map}
     */
    __privateAdd(this, _map3, void 0);
    /**
     * Holds if the number of markers in the cluster should be displayed
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _showNumber2, true);
  }
  /**
   * Set the map object to use for the cluster marker
   *
   * @param {Map} map The map object
   */
  setMap(map2) {
    __privateSet(this, _map3, map2);
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
        __privateSet(this, _images, sortedImages);
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
      __privateSet(this, _images, { 0: image });
    }
  }
  /**
   * Set the class name to use for the label
   *
   * @param {string} labelClassName The class name to use for the label
   */
  setLabelClassName(labelClassName) {
    __privateSet(this, _labelClassName, labelClassName);
  }
  /**
   * Set the color of the label text
   *
   * @param {string} labelColor The color of the label text. Default color is black.
   */
  setLabelColor(labelColor) {
    __privateSet(this, _labelColor, labelColor);
  }
  /**
   * Set the font family to use for the cluster marker
   *
   * @param {string} fontFamily The font family to use for the cluster marker
   */
  setLabelFontFamily(fontFamily) {
    __privateSet(this, _labelFontFamily2, fontFamily);
  }
  /**
   * Set the font size to use for the cluster marker
   *
   * @param {string|number} fontSize The font size to use for the cluster marker
   */
  setLabelFontSize(fontSize) {
    if (isStringOrNumber(fontSize)) {
      __privateSet(this, _labelFontSize2, fontSize);
    }
  }
  /**
   * Set the font weight to use for the cluster marker
   *
   * @param {string} labelFontWeight The font weight to use for the cluster marker
   */
  setLabelFontWeight(labelFontWeight) {
    __privateSet(this, _labelFontWeight, labelFontWeight);
  }
  /**
   * Sets if the number of markers in the cluster should be displayed
   *
   * @param {boolean} showNumber Whether to show the number of markers in the cluster
   */
  setShowNumber(showNumber) {
    __privateSet(this, _showNumber2, getBoolean(showNumber));
  }
  /**
   * Get the image for the cluster.
   *
   * @param {number} count The number of markers in the cluster.
   * @returns {ClusterImage}
   */
  getImage(count) {
    const keys = Object.keys(__privateGet(this, _images));
    let image = __privateGet(this, _images)[keys[0]];
    for (let i = 0; i < keys.length; i += 1) {
      const k = keys[i];
      if (count >= parseInt(k, 10)) {
        image = __privateGet(this, _images)[k];
      } else {
        break;
      }
    }
    return image;
  }
  /**
   * Renders the cluster marker
   *
   * @param {Cluster} cluster The cluster information
   * @returns {google.maps.Marker}
   */
  render(cluster) {
    const { count, position } = cluster;
    const image = this.getImage(count);
    const markerImage = icon(typeof image === "string" ? image : image.url);
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
    if (__privateGet(this, _labelClassName)) {
      label.className = __privateGet(this, _labelClassName);
    } else if (image.labelClassName) {
      label.className = image.labelClassName;
    }
    if (__privateGet(this, _labelColor)) {
      label.color = __privateGet(this, _labelColor);
    } else if (image.labelColor) {
      label.color = image.labelColor;
    }
    if (__privateGet(this, _labelFontFamily2)) {
      label.fontFamily = __privateGet(this, _labelFontFamily2);
    } else if (image.labelFontFamily) {
      label.fontFamily = image.labelFontFamily;
    }
    if (__privateGet(this, _labelFontSize2)) {
      label.fontSize = __privateGet(this, _labelFontSize2).toString();
    } else if (image.labelFontSize) {
      label.fontSize = image.labelFontSize;
    }
    if (__privateGet(this, _labelFontWeight)) {
      label.fontWeight = __privateGet(this, _labelFontWeight);
    } else if (image.labelFontWeight) {
      label.fontWeight = image.labelFontWeight;
    }
    const clusterMarker = marker();
    clusterMarker.setPositionSync({ lat: position.lat(), lng: position.lng() });
    clusterMarker.setIconSync(markerImage);
    clusterMarker.setLabelSync(__privateGet(this, _showNumber2) ? label : void 0);
    return clusterMarker.toGoogleSync();
  }
};
_images = new WeakMap();
_labelClassName = new WeakMap();
_labelColor = new WeakMap();
_labelFontFamily2 = new WeakMap();
_labelFontSize2 = new WeakMap();
_labelFontWeight = new WeakMap();
_map3 = new WeakMap();
_showNumber2 = new WeakMap();

// src/lib/MarkerCluster.ts
var _clusterer, _pendingMarkers, _setupCluster, setupCluster_fn;
var MarkerCluster = class extends Base_default {
  /**
   * The constructor for the MarkerCluster class
   *
   * @param {Map} map The map object
   * @param {Marker[]|MarkerClusterOptions} [markers] Markers to cluster. You can also use addMarker() instead of adding the markers here.
   * @param {MarkerClusterOptions} [options] Options for the marker clusterer
   */
  constructor(map2, markers, options) {
    super("markercluster");
    /**
     * Set up the marker cluster
     *
     * @param {Map} map The map object
     * @param {Marker[]|MarkerClusterOptions} [markers] Markers to cluster. You can also use addMarker() instead of adding the markers here.
     * @param {MarkerClusterOptions} [options] Options for the marker clusterer
     */
    __privateAdd(this, _setupCluster);
    /**
     * The MarkerClusterer object
     *
     * @private
     * @type {MarkerClusterer}
     */
    __privateAdd(this, _clusterer, void 0);
    /**
     * Holds any markers to add to the cluster once the map is loaded
     *
     * @private
     * @type {Marker[]}
     */
    __privateAdd(this, _pendingMarkers, []);
    if (!(map2 instanceof Map)) {
      throw new Error("You must pass a valid map object to the MarkerCluster object.");
    }
    if (checkForGoogleMaps("MarkerCluster", "Marker", false)) {
      __privateMethod(this, _setupCluster, setupCluster_fn).call(this, map2, markers, options);
    } else {
      loader().on("map_loaded", () => {
        __privateMethod(this, _setupCluster, setupCluster_fn).call(this, map2, markers, options);
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
        __privateGet(this, _clusterer).addMarker(m, !draw);
      });
    } else {
      __privateGet(this, _pendingMarkers).push(marker2);
      loader().on("map_loaded", () => {
        this.addMarkers(__privateGet(this, _pendingMarkers), draw);
        __privateSet(this, _pendingMarkers, []);
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
        __privateGet(this, _clusterer).addMarkers(googleMarkerObjects, !drw);
      });
    };
    if (checkForGoogleMaps("MarkerCluster", "Marker", false)) {
      add(markers, draw);
    } else {
      markers.forEach((marker2) => {
        __privateGet(this, _pendingMarkers).push(marker2);
      });
      loader().on("map_loaded", () => {
        add(__privateGet(this, _pendingMarkers), draw);
        __privateSet(this, _pendingMarkers, []);
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
    __privateGet(this, _clusterer).clearMarkers(!draw);
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
    __privateGet(this, _clusterer).removeMarker(marker2.toGoogleSync(), !draw);
    return this;
  }
  /**
   * Force a recalculation and redraw of all the marker clusters.
   *
   * @returns {MarkerCluster}
   */
  render() {
    __privateGet(this, _clusterer).render();
    return this;
  }
};
_clusterer = new WeakMap();
_pendingMarkers = new WeakMap();
_setupCluster = new WeakSet();
setupCluster_fn = function(map2, markers, options) {
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
          clusterOptions.algorithm = new GridAlgorithm(algorithmOptions);
          break;
        case "supercluster":
          clusterOptions.algorithm = new SuperClusterAlgorithm(algorithmOptions);
          break;
        case "noop":
          clusterOptions.algorithm = new NoopAlgorithm(algorithmOptions);
          break;
        default:
          if (Object.keys(algorithmOptions).length > 0) {
            clusterOptions.algorithm = new SuperClusterAlgorithm(algorithmOptions);
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
  __privateSet(this, _clusterer, new MarkerClusterer(clusterOptions));
  if (Array.isArray(markers)) {
    markers.forEach((marker2) => {
      if (marker2 instanceof Marker) {
        __privateGet(this, _clusterer).addMarker(marker2.toGoogleSync(), true);
      }
    });
  }
};
var markerCluster = (map2, markers, options) => new MarkerCluster(map2, markers, options);

// src/lib/MarkerCollection.ts
var defaultTag = "__default__";
var MarkerCollection = class {
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
   * @param {string[]} tags The tag(s) to assign the marker to
   */
  add(marker2, ...tags) {
    if (tags.length > 0) {
      tags.forEach((tag) => {
        if (!this.markers[tag]) {
          this.markers[tag] = /* @__PURE__ */ new Set();
        }
        this.markers[tag].add(marker2);
      });
    } else {
      if (!this.markers[defaultTag]) {
        this.markers[defaultTag] = /* @__PURE__ */ new Set();
      }
      this.markers[defaultTag].add(marker2);
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
   * Hide the Markers in the collection that have the tag(s) passed
   *
   * @param {string[]} tags The tag(s) to hide markers for
   */
  hide(...tags) {
    tags.forEach((tag) => {
      if (this.markers[tag]) {
        this.markers[tag].forEach((marker2) => {
          marker2.hide();
        });
      }
    });
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
   * Remove the marker from the collection, optionally by tag.
   *
   * @param {Marker} marker The marker object to remove
   * @param {string[]} [tags] The tag(s) to remove the marker from. If not set then the marker is removed from all tags.
   */
  remove(marker2, ...tags) {
    if (tags.length > 0) {
      tags.forEach((tag) => {
        if (this.markers[tag]) {
          this.markers[tag].delete(marker2);
        }
      });
    } else {
      Object.keys(this.markers).forEach((tag) => {
        this.markers[tag].delete(marker2);
      });
    }
  }
  /**
   * Show the Markers in the collection that have the tag(s) passed
   *
   * @param {Map} map The map object
   * @param {string[]} tags The tag(s) to show markers for
   */
  show(map2, ...tags) {
    tags.forEach((tag) => {
      if (this.markers[tag]) {
        this.markers[tag].forEach((marker2) => {
          marker2.show(map2);
        });
      }
    });
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
var _offset, _overlay, _overlayView, _position5, _styles3, _setupGoogleOverlay, setupGoogleOverlay_fn;
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
     * Set up the Google maps overlay object if necessary
     *
     * @private
     */
    __privateAdd(this, _setupGoogleOverlay);
    /**
     * Holds the offset for the overlay
     *
     * @private
     * @type {Point}
     */
    __privateAdd(this, _offset, void 0);
    /**
     * Holds the overlay HTML element. This is the container element that the
     * content for the overlay will get displayed in.
     * That could be a tooltip, a custom info window (popup), or a map overlay.
     *
     * private
     *
     * @type {HTMLElement}
     */
    __privateAdd(this, _overlay, void 0);
    /**
     * Holds the overlay view class instance
     *
     * @private
     * @type {google.maps.OverlayView}
     */
    __privateAdd(this, _overlayView, void 0);
    /**
     * Holds the position of the overlay
     *
     * @private
     * @type {LatLng}
     */
    __privateAdd(this, _position5, void 0);
    /**
     * Holds the styles for the tooltip. These are applied to the tooltip container (i.e. the overlay element).
     *
     * @private
     * @type {object}
     */
    __privateAdd(this, _styles3, {});
    __privateSet(this, _overlay, document.createElement("div"));
    __privateGet(this, _overlay).style.position = "absolute";
    this.setOffset([0, 0]);
  }
  /**
   * Get the class name for the overlay element
   *
   * @returns {string}
   */
  get className() {
    return __privateGet(this, _overlay).className;
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
        __privateGet(this, _overlay).classList.add(cn.trim());
      });
    } else if (isNullOrUndefined(className)) {
      __privateGet(this, _overlay).className = "";
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
      __privateSet(this, _offset, pointValue);
    }
  }
  /**
   * Returns the position of the overlay
   *
   * @returns {LatLng}
   */
  get position() {
    return __privateGet(this, _position5);
  }
  /**
   * Set the position of the overlay
   *
   * @param {LatLngValue} value The position of the overlay
   */
  set position(value) {
    const position = latLng(value);
    if (position.isValid()) {
      __privateSet(this, _position5, position);
    } else if (isNullOrUndefined(value)) {
      __privateSet(this, _position5, void 0);
    }
  }
  /**
   * Returns the styles for the overlay element
   *
   * @returns {object}
   */
  get styles() {
    return __privateGet(this, _styles3);
  }
  /**
   * Set the styles for the overlay element
   *
   * @param {object} styles The styles to apply to the overlay element
   */
  set styles(styles) {
    if (isObject(styles)) {
      __privateSet(this, _styles3, styles);
      Object.keys(styles).forEach((key) => {
        __privateGet(this, _overlay).style[key] = styles[key];
      });
    }
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
      return latLng(projection.fromContainerPixelToLatLng(pixel.toGoogle()));
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
      return latLng(projection.fromDivPixelToLatLng(pixel.toGoogle()));
    }
    return latLng();
  }
  /**
   * Get the offset value
   *
   * @returns {Point}
   */
  getOffset() {
    return __privateGet(this, _offset);
  }
  /**
   * Get the overlay HTML element
   *
   * @returns {HTMLElement}
   */
  getOverlayElement() {
    return __privateGet(this, _overlay);
  }
  /**
   * Get the position of the overlay
   *
   * @returns {LatLng}
   */
  getPosition() {
    return this.position;
  }
  /**
   * Returns the MapCanvasProjection object associated with this OverlayView.
   *
   * The projection is not initialized until onAdd is called by the API.
   *
   * https://developers.google.com/maps/documentation/javascript/reference/overlay-view#MapCanvasProjection
   *
   * @returns {google.maps.MapCanvasProjection}
   */
  getProjection() {
    return __privateGet(this, _overlayView).getProjection();
  }
  /**
   * Returns whether the overlay has a position
   *
   * @returns {boolean}
   */
  hasPosition() {
    return __privateGet(this, _position5) instanceof LatLng;
  }
  /**
   * Hide the overlay
   *
   * @returns {Overlay}
   */
  hide() {
    if (__privateGet(this, _overlayView)) {
      __privateGet(this, _overlayView).setMap(null);
      this.removeMap();
      this.isVisible = false;
    }
    return this;
  }
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
  move(position, map2) {
    return new Promise((resolve, reject) => {
      let mapObject = map2;
      if (typeof mapObject === "undefined") {
        mapObject = this.getMap();
      }
      this.position = position;
      if (mapObject instanceof Map) {
        if (__privateGet(this, _overlayView)) {
          __privateGet(this, _overlayView).setMap(mapObject.toGoogle());
          this.isVisible = true;
          super.setMap(mapObject);
          this.dispatch("open");
          resolve(this);
        } else {
          this.show(mapObject).then(() => {
            this.dispatch("open");
            resolve(this);
          });
        }
      } else {
        reject(new Error("Map object is not set"));
      }
    });
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
      __privateGet(this, _overlay).classList.remove(cn.trim());
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
   * @param {LatLngValue} position The latitude/longitude position of where the overlay should show
   * @returns {Overlay}
   */
  setPosition(position) {
    this.position = position;
    return this;
  }
  /**
   * Set the styles for the overlay element
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
        __privateMethod(this, _setupGoogleOverlay, setupGoogleOverlay_fn).call(this);
        if (__privateGet(this, _overlayView)) {
          __privateGet(this, _overlayView).setMap(map2.toGoogle());
          this.isVisible = true;
          super.setMap(map2);
          this.dispatch("open");
          resolve(this);
        } else {
          loader().once("map_loaded", () => {
            __privateMethod(this, _setupGoogleOverlay, setupGoogleOverlay_fn).call(this);
            if (__privateGet(this, _overlayView)) {
              __privateGet(this, _overlayView).setMap(map2.toGoogle());
              this.isVisible = true;
            }
            super.setMap(map2);
            this.dispatch("open");
            resolve(this);
          });
        }
      } else {
        this.dispatch("open");
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
      __privateGet(this, _styles3)[name] = value;
      __privateGet(this, _overlay).style[name] = value;
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
    if (__privateGet(this, _overlay).parentElement) {
      __privateGet(this, _overlay).parentElement.removeChild(__privateGet(this, _overlay));
    }
  }
};
_offset = new WeakMap();
_overlay = new WeakMap();
_overlayView = new WeakMap();
_position5 = new WeakMap();
_styles3 = new WeakMap();
_setupGoogleOverlay = new WeakSet();
setupGoogleOverlay_fn = function() {
  if (!isObject(__privateGet(this, _overlayView))) {
    if (checkForGoogleMaps("Overlay", "OverlayView", false)) {
      __privateSet(this, _overlayView, getOverlayViewClass(this));
      google.maps.OverlayView.preventMapHitsAndGesturesFrom(__privateGet(this, _overlay));
    }
  }
};
var getOverlayViewClass = (classObject) => {
  var _overlay2;
  class OverlayView extends google.maps.OverlayView {
    /**
     * Constructor
     *
     * @param {Overlay} overlay The overlay class instance
     */
    constructor(overlay2) {
      super();
      /**
       * Holds the class instance for this overlay
       *
       * @private
       * @type {Overlay}
       */
      __privateAdd(this, _overlay2, void 0);
      __privateSet(this, _overlay2, overlay2);
    }
    /**
     * Called when the overlay is being drawn or updated. Use the position
     * from projection.fromLatLngToDivPixel() to correctly position the overlay
     * relative to the MapPanes. This method is called after onAdd(), and is
     * called on change of zoom or center.
     */
    draw() {
      __privateGet(this, _overlay2).draw(this.getProjection());
    }
    /**
     * Called once after setMap() is called with a valid map. At this point,
     * panes and projection will have been initialized. Used to initialize the overlay DOM elements.
     */
    onAdd() {
      __privateGet(this, _overlay2).add(this.getPanes());
    }
    /**
     * This method is called once following a call to setMap(null).
     * Used to remove the overlay from the map.
     */
    onRemove() {
      __privateGet(this, _overlay2).remove();
    }
  }
  _overlay2 = new WeakMap();
  return new OverlayView(classObject);
};
var overlay = () => new Overlay("overlay", "OverlayView");

// src/lib/PlacesSearchBox.ts
var _input2, _places, _placesBounds, _searchBox2, _options6, _createPlacesSearchBox;
var PlacesSearchBox = class extends Evented {
  /**
   * Constructor
   *
   * @param {string | HTMLInputElement | PlacesSearchBoxOptions} input The input reference or the options
   * @param {PlacesSearchBoxOptions} [options] The places search box options if the input is reference to the input element
   */
  constructor(input, options) {
    super("placesSearchBox", "places");
    /**
     * Holds the reference to the input element
     *
     * @private
     * @type {HTMLInputElement}
     */
    __privateAdd(this, _input2, void 0);
    /**
     * Holds the array of places that have been found.
     *
     * This is typically one place and it's the place that the user clicked on.
     *
     * @private
     * @type {google.maps.places.PlaceResult[]}
     */
    __privateAdd(this, _places, []);
    /**
     * Holds the map bounds based on the places that have been found
     *
     * @private
     * @type {LatLngBounds}
     */
    __privateAdd(this, _placesBounds, void 0);
    /**
     * Holds the reference to the Google Maps SearchBox object
     *
     * @private
     * @type {google.maps.places.SearchBox}
     */
    __privateAdd(this, _searchBox2, void 0);
    /**
     * Holds the options for the places search box
     *
     * @private
     * @type {GMPlacesSearchBoxOptions}
     */
    __privateAdd(this, _options6, {});
    /**
     * Create the places search box object
     *
     * @private
     */
    __privateAdd(this, _createPlacesSearchBox, () => __async(this, null, function* () {
      if (!__privateGet(this, _searchBox2)) {
        const options = {};
        if (options.bounds) {
          options.bounds = yield __privateGet(this, _options6).bounds.toGoogle();
        }
        __privateSet(this, _searchBox2, new google.maps.places.SearchBox(__privateGet(this, _input2), options));
        __privateGet(this, _searchBox2).addListener("places_changed", () => {
          const places = __privateGet(this, _searchBox2).getPlaces();
          const bounds = latLngBounds();
          places.forEach((place) => {
            if (place.geometry) {
              if (place.geometry.viewport) {
                bounds.union(place.geometry.viewport);
              }
            } else if (place.geometry.location) {
              bounds.extend(latLng(place.geometry.location));
            }
          });
          __privateSet(this, _places, places);
          __privateSet(this, _placesBounds, bounds);
          this.dispatch("places_changed", { places, bounds });
        });
      }
    }));
    if (input instanceof HTMLInputElement) {
      __privateSet(this, _input2, input);
      this.setOptions(options);
    } else if (isString(input)) {
      __privateSet(this, _input2, document.querySelector(input));
      if (!__privateGet(this, _input2)) {
        throw new Error(`The input element with the selector "${input}" was not found.`);
      }
      this.setOptions(options);
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
    var _a;
    return (_a = __privateGet(this, _options6).bounds) != null ? _a : void 0;
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
    __privateGet(this, _options6).bounds = boundsValue;
    if (__privateGet(this, _searchBox2)) {
      boundsValue.toGoogle().then((bounds) => {
        __privateGet(this, _searchBox2).setBounds(bounds);
      });
    }
  }
  /**
   * Get the input reference
   *
   * @returns {HTMLInputElement | undefined}
   */
  get input() {
    return __privateGet(this, _input2);
  }
  /**
   * Set the input reference
   *
   * @param {string | HTMLInputElement} value The input HTMLInputElement or the selector for the input element
   */
  set input(value) {
    if (value instanceof HTMLInputElement) {
      __privateSet(this, _input2, value);
    } else if (isString(value)) {
      __privateSet(this, _input2, document.querySelector(value));
      if (!__privateGet(this, _input2)) {
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
    return __privateGet(this, _places)[0];
  }
  /**
   * Get the places that have been found
   *
   * This is typically one place and it's the place that the user clicked on.
   *
   * @returns {google.maps.places.PlaceResult[]}
   */
  getPlaces() {
    return __privateGet(this, _places);
  }
  /**
   * Get the map bounds based on the places that have been found.
   *
   * @returns {LatLngBounds|undefined}
   */
  getPlacesBounds() {
    return __privateGet(this, _placesBounds);
  }
  /**
   * Initialize the places search box object
   *
   * This must be called in order for the places search box to work.
   *
   * @returns {Promise<void>}
   */
  init() {
    return __async(this, null, function* () {
      return new Promise((resolve) => {
        if (!isObject(__privateGet(this, _searchBox2))) {
          if (checkForGoogleMaps("PlacesSearchBox", "places", false)) {
            __privateGet(this, _createPlacesSearchBox).call(this).then(() => {
              resolve();
            });
          } else {
            loader().once("map_loaded", () => {
              __privateGet(this, _createPlacesSearchBox).call(this).then(() => {
                resolve();
              });
            });
          }
        } else {
          resolve();
        }
      });
    });
  }
  /**
   * Returns whether the places search box object has been initialized
   *
   * @returns {boolean}
   */
  isInitialized() {
    return isObject(__privateGet(this, _searchBox2));
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
    this.on("places_changed", (data) => {
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
          __privateSet(this, _input2, options.input);
        } else if (isString(options.input)) {
          __privateSet(this, _input2, document.querySelector(options.input));
          if (!__privateGet(this, _input2)) {
            throw new Error(`The input element with the selector "${options.input}" was not found.`);
          }
        }
      }
    }
    return this;
  }
};
_input2 = new WeakMap();
_places = new WeakMap();
_placesBounds = new WeakMap();
_searchBox2 = new WeakMap();
_options6 = new WeakMap();
_createPlacesSearchBox = new WeakMap();
var placesSearchBox = (input, options) => {
  if (input instanceof PlacesSearchBox) {
    return input;
  }
  return new PlacesSearchBox(input, options);
};

// src/lib/Polyline.ts
var _highlightPolyline, _isHighlighted, _options7, _polyline, _setupGooglePolyline, setupGooglePolyline_fn, _setupGooglePolylineSync, setupGooglePolylineSync_fn, _createPolylineObject, createPolylineObject_fn;
var _Polyline = class _Polyline extends Layer_default {
  /**
   * Constructor
   *
   * @param {PolylineOptions} [options] The polyline options
   */
  constructor(options) {
    super("polyline", "Polyline");
    /**
     * Set up the Google maps Polyline object if necessary
     *
     * @param {Map} [map] The map object. If it's set then it will be initialized if the Google maps object isn't available yet.
     * @private
     */
    __privateAdd(this, _setupGooglePolyline);
    /**
     * Set up the Google maps polyline object syncronously.
     */
    __privateAdd(this, _setupGooglePolylineSync);
    /**
     * Create the polyline object
     *
     * @private
     */
    __privateAdd(this, _createPolylineObject);
    /**
     * Holds a polyline to show below the existing one to create a "highlight" effect
     * when the mouse hovers over this polyline.
     *
     * @private
     * @type {Polyline}
     */
    __privateAdd(this, _highlightPolyline, void 0);
    // eslint-disable-line no-use-before-define
    /**
     * Holds whether the polyline is manually highlighted (i.e. if the highlightPolyline is displayed)
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _isHighlighted, false);
    /**
     * Holds the Polyline options
     *
     * @private
     * @type {PolylineOptions}
     */
    __privateAdd(this, _options7, {});
    /**
     * Holds the Google maps Polyline object
     *
     * @private
     * @type {google.maps.Polyline}
     */
    __privateAdd(this, _polyline, void 0);
    if (isObject(options)) {
      this.setOptions(options);
    }
  }
  /**
   * Get whether the polyline handles click events.
   *
   * @returns {boolean}
   */
  get clickable() {
    return __privateGet(this, _options7).clickable;
  }
  /**
   * Set whether the polyline handles click events.
   *
   * @param {boolean} value Whether the polyline handles click events.
   */
  set clickable(value) {
    if (typeof value === "boolean") {
      __privateGet(this, _options7).clickable = value;
      if (__privateGet(this, _polyline)) {
        __privateGet(this, _polyline).setOptions({ clickable: value });
      }
    }
  }
  /**
   * Get the highlight polyline
   *
   * @returns {Polyline}
   */
  get highlightPolyline() {
    return __privateGet(this, _highlightPolyline);
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
    if (value instanceof _Polyline) {
      __privateSet(this, _highlightPolyline, value);
    } else if (isObject(value)) {
      __privateSet(this, _highlightPolyline, new _Polyline(__spreadValues(__spreadValues({}, __privateGet(this, _options7)), value)));
    }
    __privateGet(this, _highlightPolyline).clickable = true;
    __privateGet(this, _highlightPolyline).path = this.path;
    __privateGet(this, _highlightPolyline).visible = false;
    __privateGet(this, _highlightPolyline).init().then(() => {
      this.init().then(() => {
        __privateGet(this, _highlightPolyline).setMap(this.getMap());
        super.on("mouseover", () => {
          if (!__privateGet(this, _isHighlighted)) {
            __privateGet(this, _highlightPolyline).visible = true;
          }
        });
        super.on("mousemove", () => {
          if (!__privateGet(this, _isHighlighted)) {
            __privateGet(this, _highlightPolyline).visible = true;
          }
        });
        super.on("mouseout", () => {
          if (!__privateGet(this, _isHighlighted)) {
            __privateGet(this, _highlightPolyline).visible = false;
          }
        });
      });
    });
    if (__privateGet(this, _highlightPolyline).hasZIndex() && this.hasZIndex()) {
      const highlightZIndex = __privateGet(this, _highlightPolyline).zIndex;
      const thisZIndex = this.zIndex;
      if (highlightZIndex >= thisZIndex) {
        __privateGet(this, _highlightPolyline).zIndex = thisZIndex - 1;
      }
    } else if (this.hasZIndex()) {
      __privateGet(this, _highlightPolyline).zIndex = this.zIndex - 1;
    } else if (__privateGet(this, _highlightPolyline).hasZIndex()) {
      this.zIndex = __privateGet(this, _highlightPolyline).zIndex + 1;
    } else {
      __privateGet(this, _highlightPolyline).zIndex = 1;
      this.zIndex = 2;
    }
  }
  /**
   * Get the map object
   *
   * @returns {Map}
   */
  get map() {
    return __privateGet(this, _options7).map;
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
   * The path is an array of LatLng values defining the path of the polyline.
   *
   * @returns {LatLngValue[]}
   */
  get path() {
    return __privateGet(this, _options7).path;
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
      const paths = [];
      value.forEach((pathValue) => {
        const position = latLng(pathValue);
        if (position.isValid()) {
          paths.push(position);
        }
      });
      __privateGet(this, _options7).path = paths;
      if (__privateGet(this, _polyline)) {
        __privateGet(this, _polyline).setPath(paths.map((path) => path.toGoogle()));
      }
    }
  }
  /**
   * Get the SVG stroke color
   *
   * @returns {string}
   */
  get strokeColor() {
    return __privateGet(this, _options7).strokeColor;
  }
  /**
   * Set the SVG stroke color.
   *
   * @param {string} value The SVG stroke color.
   */
  set strokeColor(value) {
    if (isStringWithValue(value)) {
      __privateGet(this, _options7).strokeColor = value;
      if (__privateGet(this, _polyline)) {
        __privateGet(this, _polyline).setOptions({ strokeColor: value });
      }
    }
  }
  /**
   * Get the opacity of the stroke.
   * The opacity of the stroke, where 0 is fully transparent and 1 is fully opaque.
   *
   * @returns {number}
   */
  get strokeOpacity() {
    return __privateGet(this, _options7).strokeOpacity;
  }
  /**
   * Set the opacity of the stroke.
   *
   * @param {number|string} value The opacity of the stroke.
   */
  set strokeOpacity(value) {
    if (isNumberOrNumberString(value)) {
      if (isNumber(value)) {
        __privateGet(this, _options7).strokeOpacity = value;
      } else if (isNumberString(value)) {
        __privateGet(this, _options7).strokeOpacity = Number(value);
      }
      if (__privateGet(this, _polyline)) {
        __privateGet(this, _polyline).setOptions({ strokeOpacity: Number(value) });
      }
    }
  }
  /**
   * Get the weight of the stroke in pixels.
   *
   * @returns {number}
   */
  get strokeWeight() {
    return __privateGet(this, _options7).strokeWeight;
  }
  /**
   * Set the weight of the stroke.
   *
   * @param {number|string} value The weight of the stroke.
   */
  set strokeWeight(value) {
    if (isNumberOrNumberString(value)) {
      if (isNumber(value)) {
        __privateGet(this, _options7).strokeWeight = value;
      } else if (isNumberString(value)) {
        __privateGet(this, _options7).strokeWeight = Number(value);
      }
      if (__privateGet(this, _polyline)) {
        __privateGet(this, _polyline).setOptions({ strokeWeight: Number(value) });
      }
    }
  }
  /**
   * Get whether the polyline is visible on the map.
   *
   * @returns {boolean}
   */
  get visible() {
    return __privateGet(this, _options7).visible;
  }
  /**
   * Set whether the polyline is visible on the map.
   *
   * @param {boolean} value Whether the polyline is visible on the map.
   */
  set visible(value) {
    if (typeof value === "boolean") {
      __privateGet(this, _options7).visible = value;
      this.isVisible = value;
      if (__privateGet(this, _polyline)) {
        __privateGet(this, _polyline).setVisible(value);
      }
    }
  }
  /**
   * Get the zIndex of the polyline.
   *
   * @returns {number}
   */
  get zIndex() {
    return __privateGet(this, _options7).zIndex;
  }
  /**
   * Set the zIndex of the polyline.
   *
   * @param {number|string} value The zIndex of the polyline.
   */
  set zIndex(value) {
    if (isNumberOrNumberString(value)) {
      if (isNumber(value)) {
        __privateGet(this, _options7).zIndex = value;
      } else if (isNumberString(value)) {
        __privateGet(this, _options7).zIndex = Number(value);
      }
      if (__privateGet(this, _polyline)) {
        __privateGet(this, _polyline).setOptions({ zIndex: Number(value) });
      }
    }
  }
  /**
   * Returns whether the polyline has a zIndex set.
   *
   * @returns {boolean}
   */
  hasZIndex() {
    return typeof __privateGet(this, _options7).zIndex !== "undefined";
  }
  /**
   * Hide the polyline
   *
   * @returns {Polyline}
   */
  hide() {
    this.visible = false;
    if (__privateGet(this, _highlightPolyline)) {
      __privateGet(this, _highlightPolyline).visible = false;
    }
    return this;
  }
  /**
   * Display the highlight polyline if it exists
   *
   * @returns {Polyline}
   */
  highlight() {
    if (this.visible !== false && __privateGet(this, _highlightPolyline)) {
      __privateSet(this, _isHighlighted, true);
      __privateGet(this, _highlightPolyline).visible = true;
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
      __privateMethod(this, _setupGooglePolyline, setupGooglePolyline_fn).call(this).then(() => {
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
    super.off(type, callback, options);
  }
  /**
   * @inheritdoc
   */
  on(type, callback, config) {
    if (__privateGet(this, _highlightPolyline)) {
      __privateGet(this, _highlightPolyline).on(type, callback, config);
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
   * Adds the polyline to the map object
   *
   * Alternate of show()
   *
   * @param {Map} value The map object. Set to null if you want to remove the polyline from the map.
   * @returns {Promise<Polyline>}
   */
  setMap(value) {
    return __async(this, null, function* () {
      if (__privateGet(this, _highlightPolyline)) {
        __privateGet(this, _highlightPolyline).setMap(value);
      }
      yield __privateMethod(this, _setupGooglePolyline, setupGooglePolyline_fn).call(this, value);
      if (value instanceof Map) {
        this.visible = true;
        __privateGet(this, _options7).map = value;
        __superGet(_Polyline.prototype, this, "setMap").call(this, value);
        __privateGet(this, _polyline).setMap(value.toGoogle());
      } else if (isNullOrUndefined(value)) {
        __privateGet(this, _options7).map = null;
        __superGet(_Polyline.prototype, this, "setMap").call(this, null);
        if (__privateGet(this, _polyline)) {
          __privateGet(this, _polyline).setMap(null);
        }
      }
      return this;
    });
  }
  /**
   * Set the Polyline options
   *
   * @param {PolylineOptions} options The Polyline options
   * @returns {Polyline}
   */
  setOptions(options) {
    if (isObject(options)) {
      if (typeof options.clickable === "boolean") {
        this.clickable = options.clickable;
      }
      if (options.map) {
        this.setMap(options.map);
      }
      if (options.path) {
        this.path = options.path;
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
    }
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
      __privateMethod(this, _setupGooglePolyline, setupGooglePolyline_fn).call(this).then(() => {
        resolve(__privateGet(this, _polyline));
      });
    });
  }
  /**
   * Hide the highlight polyline if it exists
   *
   * @returns {Polyline}
   */
  unhighlight() {
    if (__privateGet(this, _highlightPolyline)) {
      __privateSet(this, _isHighlighted, false);
      __privateGet(this, _highlightPolyline).visible = false;
    }
    return this;
  }
};
_highlightPolyline = new WeakMap();
_isHighlighted = new WeakMap();
_options7 = new WeakMap();
_polyline = new WeakMap();
_setupGooglePolyline = new WeakSet();
setupGooglePolyline_fn = function(map2) {
  return new Promise((resolve) => {
    if (!isObject(__privateGet(this, _polyline))) {
      if (checkForGoogleMaps("Polyline", "Polyline", false)) {
        __privateMethod(this, _createPolylineObject, createPolylineObject_fn).call(this);
        resolve();
      } else {
        loader().once("map_loaded", () => {
          __privateMethod(this, _createPolylineObject, createPolylineObject_fn).call(this);
          const thisMap = this.getMap();
          if (__privateGet(this, _polyline) && thisMap) {
            __privateGet(this, _polyline).setMap(thisMap.toGoogle());
            if (__privateGet(this, _highlightPolyline)) {
              __privateGet(this, _highlightPolyline).setMap(thisMap);
            }
          }
          resolve();
        });
        if (map2 instanceof Map) {
          map2.init();
        }
      }
    } else {
      resolve();
    }
  });
};
_setupGooglePolylineSync = new WeakSet();
setupGooglePolylineSync_fn = function() {
  if (!isObject(__privateGet(this, _polyline))) {
    if (checkForGoogleMaps("Polyline", "Polyline", false)) {
      __privateMethod(this, _createPolylineObject, createPolylineObject_fn).call(this);
    } else {
      throw new Error(
        "The Google maps libray is not available so the polyline object cannot be created. Load the Google maps library first."
      );
    }
  }
};
_createPolylineObject = new WeakSet();
createPolylineObject_fn = function() {
  if (!__privateGet(this, _polyline)) {
    const polylineOptions = {};
    const optionsToSet = [
      "clickable",
      "map",
      "strokeColor",
      "stokeOpacity",
      "strokeWeight",
      "visible",
      "zIndex"
    ];
    optionsToSet.forEach((key) => {
      if (typeof __privateGet(this, _options7)[key] !== "undefined") {
        polylineOptions[key] = __privateGet(this, _options7)[key];
      }
    });
    if (Array.isArray(__privateGet(this, _options7).path)) {
      polylineOptions.path = __privateGet(this, _options7).path.map((path) => latLng(path).toGoogle());
    }
    __privateSet(this, _polyline, new google.maps.Polyline(polylineOptions));
    this.setEventGoogleObject(__privateGet(this, _polyline));
  }
};
var Polyline = _Polyline;
var polyline = (options) => {
  if (options instanceof Polyline) {
    return options;
  }
  return new Polyline(options);
};

// src/lib/PolylineCollection.ts
var defaultTag2 = "__default__";
var PolylineCollection = class {
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
   * @param {string[]} tags The tag(s) to assign the polyline to
   */
  add(p, ...tags) {
    if (tags.length > 0) {
      tags.forEach((tag) => {
        if (!this.polylines[tag]) {
          this.polylines[tag] = /* @__PURE__ */ new Set();
        }
        this.polylines[tag].add(p);
      });
    } else {
      if (!this.polylines[defaultTag2]) {
        this.polylines[defaultTag2] = /* @__PURE__ */ new Set();
      }
      this.polylines[defaultTag2].add(p);
    }
  }
  /**
   * Clears the collection
   *
   * This also hides all the polylines in the collection.
   */
  clear() {
    this.hideAll();
    this.polylines = {};
  }
  /**
   * Hide the Polylines in the collection that have the tag(s) passed
   *
   * @param {string[]} tags The tag(s) to hide polylines for
   */
  hide(...tags) {
    tags.forEach((tag) => {
      if (this.polylines[tag]) {
        this.polylines[tag].forEach((p) => {
          p.hide();
        });
      }
    });
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
   * @param {string[]} tags The tag(s) to highlight polylines for
   */
  highlight(...tags) {
    tags.forEach((tag) => {
      if (this.polylines[tag]) {
        this.polylines[tag].forEach((p) => {
          p.highlight();
        });
      }
    });
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
   * Remove the polyline from the collection, optionally by tag.
   *
   * @param {Polyline} p The polyline object to remove
   * @param {string[]} [tags] The tag(s) to remove the polyline from. If not set then the polyline is removed from all tags.
   */
  remove(p, ...tags) {
    if (tags.length > 0) {
      tags.forEach((tag) => {
        if (this.polylines[tag]) {
          this.polylines[tag].delete(p);
        }
      });
    } else {
      Object.keys(this.polylines).forEach((tag) => {
        this.polylines[tag].delete(p);
      });
    }
  }
  /**
   * Show the Polylines in the collection that have the tag(s) passed
   *
   * @param {Map} map The map object
   * @param {string[]} tags The tag(s) to show polylines for
   */
  show(map2, ...tags) {
    tags.forEach((tag) => {
      if (this.polylines[tag]) {
        this.polylines[tag].forEach((p) => {
          p.show(map2);
        });
      }
    });
  }
  /**
   * Show all the Polylines in the collection
   *
   * @param {Map} map The map object
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
   * @param {string[]} tags The tag(s) to hide the highlighted polylines
   */
  unhighlight(...tags) {
    tags.forEach((tag) => {
      if (this.polylines[tag]) {
        this.polylines[tag].forEach((p) => {
          p.unhighlight();
        });
      }
    });
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
var _autoClose2, _center, _clearance, _closeElement, _content, _event2, _firstDraw, _fit, _isAttached2, _isOpen2, _popupOffset, _theme, _toggleDisplay2, _fitPopup, fitPopup_fn, _handleCloseClick, _setupCloseClick;
var Popup = class extends Overlay {
  /**
   * Constructor
   *
   * @param {PopupOptions | string | HTMLElement | Text} [options] The Popup options or content
   */
  constructor(options) {
    super("popup", "Popup");
    /**
     * Fit the popup within the map viewport when it's displayed
     *
     * @returns {void}
     */
    __privateAdd(this, _fitPopup);
    /**
     * Whether to automatically close other open popups when opening this one
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _autoClose2, true);
    /**
     * Whether to center the popup on the element. Useful if the popup is on a marker.
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _center, true);
    /**
     * The amount of space between the popup and the map viewport edge
     *
     * This is used when the map is panned to bring the popup into view.
     *
     * @private
     * @type {Size}
     */
    __privateAdd(this, _clearance, void 0);
    /**
     * The element to close the popup. This can be a CSS selector or an HTMLElement.
     *
     * @private
     * @type {HTMLElement|string}
     */
    __privateAdd(this, _closeElement, void 0);
    /**
     * Holds the popup content.
     * This can be a simple string of text, string of HTML code, or an HTMLElement.
     *
     * @private
     * @type {string|HTMLElement}
     */
    __privateAdd(this, _content, void 0);
    /**
     * The event to trigger the popup
     *
     * @private
     * @type {'click' | 'clickon' | 'hover'}
     */
    __privateAdd(this, _event2, "click");
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
    __privateAdd(this, _firstDraw, false);
    /**
     * Whether to fit the popup within the map viewport when it's displayed
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _fit, true);
    /**
     * Whether the popup is attached to an element
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _isAttached2, false);
    /**
     * Holds if the Popup is open or not
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _isOpen2, false);
    /**
     * The total offset from the element that includes the anchor point of the element (if it exists) and the overlay offset.
     * Markers have an anchor point, but polygons and polylines do not.
     *
     * @private
     * @type {Point}
     */
    __privateAdd(this, _popupOffset, void 0);
    /**
     * The theme to use for the popup.
     *
     * @private
     * @type {string}
     */
    __privateAdd(this, _theme, "none");
    /**
     * Whether clicking the thing that triggered the popup to show should also hide the popup
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _toggleDisplay2, true);
    /**
     * Handle the close click event
     *
     * This is here so that any previous click event listeners are removed before adding the new one.
     */
    __privateAdd(this, _handleCloseClick, () => {
      this.hide();
    });
    /**
     * Set up the close click event listenter on the element
     *
     * @param {HTMLElement} element The element that will close the popup when clicked.
     */
    __privateAdd(this, _setupCloseClick, (element) => {
      element.removeEventListener("click", __privateGet(this, _handleCloseClick));
      element.addEventListener("click", __privateGet(this, _handleCloseClick));
    });
    __privateSet(this, _clearance, size(0, 0));
    __privateSet(this, _popupOffset, point(0, 0));
    if (isObject(options)) {
      if (options instanceof HTMLElement || options instanceof Text) {
        this.content = options;
      } else {
        this.setOptions(options);
      }
    } else {
      this.content = options;
    }
  }
  /**
   * Get the autoClose value
   *
   * @returns {boolean}
   */
  get autoClose() {
    return __privateGet(this, _autoClose2);
  }
  /**
   * Set the autoClose value
   *
   * @param {boolean} autoClose Whether to automatically hide other open popups when opening this one
   */
  set autoClose(autoClose) {
    if (typeof autoClose === "boolean") {
      __privateSet(this, _autoClose2, autoClose);
    }
  }
  /**
   * Returns whether to center the popup horizontally on the element.
   *
   * @returns {boolean}
   */
  get center() {
    return __privateGet(this, _center);
  }
  /**
   * Set whether to center the popup horizontally on the element. Useful if the popup is on a marker.
   *
   * @param {boolean} center Whether to center the popup on the element
   */
  set center(center) {
    if (typeof center === "boolean") {
      __privateSet(this, _center, center);
    }
  }
  /**
   * Returns the amount of space between the popup and the map viewport edge.
   * This is used when the map is panned to bring the popup into view.
   *
   * @returns {Size}
   */
  get clearance() {
    return __privateGet(this, _clearance);
  }
  /**
   * Set the amount of space between the popup and the map viewport edge
   * This is used when the map is panned to bring the popup into view.
   *
   * @param {SizeValue} clearance The amount of space between the popup and the map viewport edge
   */
  set clearance(clearance) {
    __privateSet(this, _clearance, size(clearance));
  }
  /**
   * Returns the element to close the popup. This can be a CSS selector or an HTMLElement.
   *
   * @returns {HTMLElement|string}
   */
  get closeElement() {
    return __privateGet(this, _closeElement);
  }
  /**
   * Set the element to close the popup. This can be a CSS selector or an HTMLElement.
   *
   * @param {HTMLElement|string} closeElement The element to close the popup
   */
  set closeElement(closeElement) {
    if (typeof closeElement === "string" || closeElement instanceof HTMLElement) {
      __privateSet(this, _closeElement, closeElement);
    }
  }
  /**
   * Returns the content for the popup
   *
   * @returns {string|HTMLElement|Text}
   */
  get content() {
    return __privateGet(this, _content);
  }
  /**
   * Set the content for the popup
   *
   * @param {string|HTMLElement|Text} content The content for the popup
   */
  set content(content) {
    if (isStringWithValue(content)) {
      __privateSet(this, _content, content);
      this.getOverlayElement().innerHTML = content;
    } else if (content instanceof HTMLElement || content instanceof Text) {
      __privateSet(this, _content, content);
      while (this.getOverlayElement().firstChild) {
        this.getOverlayElement().removeChild(this.getOverlayElement().firstChild);
      }
      this.getOverlayElement().appendChild(content);
    }
  }
  /**
   * Returns the event to trigger the popup
   *
   * @returns {string}
   */
  get event() {
    return __privateGet(this, _event2);
  }
  /**
   * Set the event to trigger the popup
   *
   * @param {string} event The event to trigger the popup
   */
  set event(event) {
    if (isStringWithValue(event) && ["click", "clickon", "hover"].includes(event.toLowerCase())) {
      __privateSet(this, _event2, event.toLowerCase());
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
    return __privateGet(this, _fit);
  }
  /**
   * Set whether to fit the popup within the map viewport when it's displayed
   *
   * @param {boolean} fit Whether to fit the popup within the map viewport when it's displayed
   */
  set fit(fit) {
    if (typeof fit === "boolean") {
      __privateSet(this, _fit, fit);
    }
  }
  /**
   * Returns the theme to use for the popup
   *
   * @returns {string}
   */
  get theme() {
    return __privateGet(this, _theme);
  }
  /**
   * Set the theme to use for the popup
   *
   * @param {string} theme The theme to use for the popup
   */
  set theme(theme) {
    __privateSet(this, _theme, theme);
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
   * @returns {Promise<Popup>}
   */
  attachTo(element, event) {
    return __async(this, null, function* () {
      if (!__privateGet(this, _isAttached2)) {
        __privateSet(this, _isAttached2, true);
        yield element.init().then(() => {
          if (event === "clickon" || event === "hover") {
            __privateSet(this, _toggleDisplay2, false);
          }
          const triggerEvent = event || __privateGet(this, _event2);
          this.event = triggerEvent;
          if (triggerEvent === "hover") {
            element.on("mouseover", (e) => {
              if (element instanceof Map) {
                this.move(e.latLng, element);
              } else {
                this.move(e.latLng, element.getMap());
              }
            });
            if (element instanceof Map) {
              element.on("mousemove", (e) => {
                this.move(e.latLng, element);
              });
            }
            element.on("mouseout", () => {
              this.hide();
            });
          } else if (triggerEvent === "clickon") {
            element.on("click", (e) => {
              __privateSet(this, _firstDraw, false);
              const collection = PopupCollection.getInstance();
              if (!collection.has(this)) {
                collection.add(this);
              }
              if (__privateGet(this, _autoClose2)) {
                collection.hideOthers(this);
              }
              if (element instanceof Map) {
                this.move(e.latLng, element);
              } else {
                this.move(e.latLng, element.getMap());
              }
            });
          } else {
            element.on("click", (e) => {
              if (element instanceof Map || element instanceof Polyline) {
                this.position = e.latLng;
              }
              this.toggle(element);
            });
          }
        });
      }
      return this;
    });
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
    return isStringWithValue(__privateGet(this, _content)) || __privateGet(this, _content) instanceof HTMLElement || __privateGet(this, _content) instanceof Text;
  }
  /**
   * Hide the popup
   *
   * @returns {Popup}
   */
  hide() {
    super.hide();
    __privateSet(this, _firstDraw, false);
    __privateSet(this, _isOpen2, false);
    PopupCollection.getInstance().remove(this);
    return this;
  }
  /**
   * Returns whether the popup is open or not
   *
   * @returns {boolean}
   */
  isOpen() {
    return __privateGet(this, _isOpen2);
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
      __privateSet(this, _clearance, size(options.clearance));
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
      __privateSet(this, _fit, options.fit);
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
      if (collection.has(this) && __privateGet(this, _isOpen2)) {
        if (__privateGet(this, _toggleDisplay2)) {
          this.hide();
        }
        resolve(this);
      } else {
        if (__privateGet(this, _autoClose2)) {
          collection.hideOthers(this);
        }
        __privateSet(this, _isOpen2, true);
        collection.add(this);
        if (element instanceof Map) {
          __privateSet(this, _popupOffset, this.getOffset().clone());
          super.show(element).then(() => {
            resolve(this);
          });
        } else if (element instanceof Marker) {
          this.position = element.getPosition();
          element.toGoogle().then((marker2) => {
            const anchorPoint = marker2.get("anchorPoint");
            if (anchorPoint instanceof google.maps.Point) {
              __privateSet(this, _popupOffset, this.getOffset().add(anchorPoint.x, anchorPoint.y));
            } else {
              __privateSet(this, _popupOffset, this.getOffset().clone());
            }
            super.show(element.getMap()).then(() => {
              resolve(this);
            });
          });
        } else {
          __privateSet(this, _popupOffset, this.getOffset().clone());
          super.show(element.getMap()).then(() => {
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
      const divPosition = projection.fromLatLngToDivPixel(this.position.toGoogle());
      const display = Math.abs(divPosition.x) < 4e3 && Math.abs(divPosition.y) < 4e3 ? "block" : "none";
      if (display === "block") {
        this.style("left", `${divPosition.x + __privateGet(this, _popupOffset).getX()}px`);
        this.style("top", `${divPosition.y + __privateGet(this, _popupOffset).getY()}px`);
      }
      if (this.center) {
        this.style("transform", "translate(-50%, -100%)");
      } else {
        this.style("transform", "translate(0, -100%)");
      }
      if (__privateGet(this, _theme) === "default") {
        const styles = this.styles || {};
        const themeStyles = {
          backgroundColor: "#fff",
          color: "#333",
          padding: "3px 6px",
          borderRadius: "4px",
          boxShadow: "0 0 5px rgba(0,0,0,0.3)"
        };
        this.styles = __spreadValues(__spreadValues({}, themeStyles), styles);
      }
      if (this.getOverlayElement().style.display !== display) {
        this.style("display", display);
      }
      if (__privateGet(this, _closeElement)) {
        if (__privateGet(this, _closeElement) instanceof HTMLElement) {
          __privateGet(this, _setupCloseClick).call(this, __privateGet(this, _closeElement));
        } else if (isStringWithValue(__privateGet(this, _closeElement))) {
          const matches = this.getOverlayElement().querySelectorAll(__privateGet(this, _closeElement));
          matches.forEach((element) => {
            __privateGet(this, _setupCloseClick).call(this, element);
          });
        }
      }
      if (!__privateGet(this, _firstDraw)) {
        __privateSet(this, _firstDraw, true);
        __privateMethod(this, _fitPopup, fitPopup_fn).call(this);
      }
    }
  }
};
_autoClose2 = new WeakMap();
_center = new WeakMap();
_clearance = new WeakMap();
_closeElement = new WeakMap();
_content = new WeakMap();
_event2 = new WeakMap();
_firstDraw = new WeakMap();
_fit = new WeakMap();
_isAttached2 = new WeakMap();
_isOpen2 = new WeakMap();
_popupOffset = new WeakMap();
_theme = new WeakMap();
_toggleDisplay2 = new WeakMap();
_fitPopup = new WeakSet();
fitPopup_fn = function() {
  if (this.event !== "hover") {
    const map2 = this.getMap();
    let offsetY = 0;
    let offsetX = 0;
    const mapPosition = map2.getDiv().getBoundingClientRect();
    const popupPosition = this.getOverlayElement().getBoundingClientRect();
    if (popupPosition.height < mapPosition.height) {
      if (mapPosition.top > popupPosition.top || mapPosition.top > popupPosition.top - __privateGet(this, _clearance).height) {
        offsetY = popupPosition.top - mapPosition.top - __privateGet(this, _clearance).height;
      }
    } else if (popupPosition.bottom < mapPosition.bottom) {
      offsetY = (mapPosition.bottom - popupPosition.bottom) * -1;
      if (__privateGet(this, _popupOffset).y !== 0) {
        offsetY += Math.abs(__privateGet(this, _popupOffset).y);
      } else if (__privateGet(this, _clearance).height > 40) {
        offsetY += __privateGet(this, _clearance).height;
      } else {
        offsetY += 40;
      }
    }
    if (popupPosition.width < mapPosition.width) {
      if (mapPosition.left > popupPosition.left || mapPosition.left > popupPosition.left - __privateGet(this, _clearance).width) {
        offsetX = popupPosition.left - mapPosition.left - __privateGet(this, _clearance).width;
      } else if (mapPosition.right < popupPosition.right || mapPosition.right < popupPosition.right + __privateGet(this, _clearance).width) {
        offsetX = (mapPosition.right - popupPosition.right - __privateGet(this, _clearance).width) * -1;
      }
    } else {
      offsetX = popupPosition.left - mapPosition.left;
      if (__privateGet(this, _popupOffset).x !== 0) {
        offsetX -= Math.abs(__privateGet(this, _popupOffset).x);
      } else if (__privateGet(this, _clearance).width > 40) {
        offsetX -= __privateGet(this, _clearance).width;
      } else {
        offsetX -= 40;
      }
    }
    if (offsetX !== 0 || offsetY !== 0) {
      map2.panBy(offsetX, offsetY);
    }
  }
};
_handleCloseClick = new WeakMap();
_setupCloseClick = new WeakMap();
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
   *
   * @param { PopupValue} popupValue The content for the Popup, or the Popup options object, or the Popup object
   * @param {'click' | 'clickon' | 'hover'} [event] The event to trigger the popup. Defaults to 'hover'. See Popup.attachTo() for more information.
   * @returns {Popup}
   */
  attachPopup(popupValue, event) {
    const p = popup(popupValue);
    p.attachTo(this, event);
    return p;
  }
};
Layer_default.include(popupMixin);
Map.include(popupMixin);
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
var _center2, _content2, _event3, _isAttached3, _theme2;
var Tooltip = class extends Overlay {
  /**
   * Constructor
   *
   * @param {TooltipOptions | string | HTMLElement | Text} [options] Tooltip options
   */
  constructor(options) {
    super("tooltip", "Tooltip");
    /**
     * Whether to center the tooltip on the element. Useful if the tooltip is on a marker.
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _center2, true);
    /**
     * Holds the tooltip content.
     * This can be a simple string of text, string of HTML code, or an HTMLElement.
     *
     * @private
     * @type {string|HTMLElement}
     */
    __privateAdd(this, _content2, void 0);
    /**
     * The event to trigger the tooltip
     *
     * @private
     * @type {'click' | 'clickon' | 'hover'}
     */
    __privateAdd(this, _event3, "hover");
    /**
     * Whether the tooltip is attached to an element
     *
     * @private
     * @type {boolean}
     */
    __privateAdd(this, _isAttached3, false);
    /**
     * The theme to use for the tooltip.
     *
     * @private
     * @type {string}
     */
    __privateAdd(this, _theme2, "default");
    this.setOffset([0, 4]);
    if (isObject(options)) {
      if (options instanceof HTMLElement || options instanceof Text) {
        this.content = options;
      } else {
        this.setOptions(options);
      }
    } else {
      this.content = options;
      this.setClassName("tooltip");
    }
  }
  /**
   * Returns whether to center the tooltip horizontally on the element.
   *
   * @returns {boolean}
   */
  get center() {
    return __privateGet(this, _center2);
  }
  /**
   * Set whether to center the tooltip horizontally on the element. Useful if the tooltip is on a marker.
   *
   * @param {boolean} center Whether to center the tooltip on the element
   */
  set center(center) {
    if (typeof center === "boolean") {
      __privateSet(this, _center2, center);
    }
  }
  /**
   * Returns the content for the tooltip
   *
   * @returns {string|HTMLElement|Text}
   */
  get content() {
    return __privateGet(this, _content2);
  }
  /**
   * Set the content for the tooltip
   *
   * @param {string|HTMLElement|Text} content The content for the tooltip
   */
  set content(content) {
    if (isStringWithValue(content)) {
      __privateSet(this, _content2, content);
      this.getOverlayElement().innerHTML = content;
    } else if (content instanceof HTMLElement || content instanceof Text) {
      __privateSet(this, _content2, content);
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
    return __privateGet(this, _event3);
  }
  /**
   * Set the event to trigger the tooltip
   *
   * @param {string} event The event to trigger the tooltip
   */
  set event(event) {
    if (isStringWithValue(event) && ["click", "clickon", "hover"].includes(event.toLowerCase())) {
      __privateSet(this, _event3, event.toLowerCase());
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
    return __privateGet(this, _theme2);
  }
  /**
   * Set the theme to use for the tooltip
   *
   * @param {string} theme The theme to use for the tooltip
   */
  set theme(theme) {
    __privateSet(this, _theme2, theme);
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
   * @returns {Promise<Tooltip>}
   */
  attachTo(element, event) {
    return __async(this, null, function* () {
      if (!__privateGet(this, _isAttached3)) {
        __privateSet(this, _isAttached3, true);
        yield element.init().then(() => {
          const triggerEvent = event || __privateGet(this, _event3);
          if (triggerEvent === "click") {
            element.on("click", (e) => {
              this.setPosition(e.latLng);
              if (element instanceof Map) {
                this.toggle(element);
              } else {
                this.toggle(element.getMap());
              }
            });
          } else if (triggerEvent === "clickon") {
            element.on("click", (e) => {
              this.setPosition(e.latLng);
              if (element instanceof Map) {
                this.show(element);
              } else {
                this.show(element.getMap());
              }
            });
          } else {
            element.on("mouseover", (e) => {
              this.setPosition(e.latLng);
              if (element instanceof Map) {
                this.show(element);
              } else {
                this.show(element.getMap());
              }
            });
            if (element instanceof Map) {
              element.on("mousemove", (e) => {
                this.setPosition(e.latLng);
                this.show(element);
              });
            }
            element.on("mouseout", () => {
              this.hide();
            });
          }
        });
      }
      return this;
    });
  }
  /**
   * Returns whether the tooltip already has content
   *
   * @returns {boolean}
   */
  hasContent() {
    return isStringWithValue(__privateGet(this, _content2)) || __privateGet(this, _content2) instanceof HTMLElement || __privateGet(this, _content2) instanceof Text;
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
    if (this.hasPosition() && typeof projection !== "undefined") {
      const divPosition = projection.fromLatLngToDivPixel(this.position.toGoogle());
      const display = Math.abs(divPosition.x) < 4e3 && Math.abs(divPosition.y) < 4e3 ? "block" : "none";
      if (display === "block") {
        const offset = this.getOffset();
        this.style("left", `${divPosition.x + offset.getX()}px`);
        this.style("top", `${divPosition.y + offset.getY()}px`);
        if (this.center) {
          this.style("transform", "translate(-50%, 0)");
        }
        if (__privateGet(this, _theme2) === "default") {
          const styles = this.styles || {};
          const themeStyles = {
            backgroundColor: "#fff",
            color: "#333",
            padding: "3px 6px",
            borderRadius: "4px",
            boxShadow: "0 0 5px rgba(0,0,0,0.3)"
          };
          this.styles = __spreadValues(__spreadValues({}, themeStyles), styles);
        }
      }
      if (this.getOverlayElement().style.display !== display) {
        this.style("display", display);
      }
    }
  }
};
_center2 = new WeakMap();
_content2 = new WeakMap();
_event3 = new WeakMap();
_isAttached3 = new WeakMap();
_theme2 = new WeakMap();
var tooltip = (options) => {
  if (options instanceof Tooltip) {
    return options;
  }
  return new Tooltip(options);
};
var tooltipMixin = {
  /**
   * Attach an Tooltip to the layer
   *
   * @param {TooltipValue} tooltipValue The content for the Tooltip, or the Tooltip options object, or the Tooltip object
   * @param {'click' | 'clickon' | 'hover'} [event] The event to trigger the tooltip. Defaults to 'hover'. See Tooltip.attachTo() for more information.
   */
  attachTooltip(tooltipValue, event) {
    tooltip(tooltipValue).attachTo(this, event);
  }
};
Layer_default.include(tooltipMixin);
Map.include(tooltipMixin);
export {
  AutocompleteSearchBox,
  Base_default as Base,
  ControlPosition,
  Evented,
  FullscreenControl,
  Icon,
  InfoWindow,
  LatLng,
  LatLngBounds,
  Layer_default as Layer,
  Loader,
  Map,
  MapRestriction,
  MapStyle,
  MapTypeControl,
  MapTypeControlStyle,
  MapTypeId,
  Marker,
  MarkerCluster,
  MarkerCollection,
  Overlay,
  PlacesSearchBox,
  Point,
  Polyline,
  PolylineCollection,
  Popup,
  RenderingType,
  RotateControl,
  ScaleControl,
  Size,
  StreetViewSource,
  SvgSymbol,
  Tooltip,
  autocompleteSearchBox,
  callCallback,
  checkForGoogleMaps,
  closeAllPopups,
  convertControlPosition,
  convertMapTypeControlStyle,
  fullscreenControl,
  getBoolean,
  getNumber,
  getPixelsFromLatLng,
  icon,
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
  overlay,
  placesSearchBox,
  point,
  polyline,
  polylineCollection,
  popup,
  rotateControl,
  scaleControl,
  size,
  svgSymbol,
  tooltip
};
