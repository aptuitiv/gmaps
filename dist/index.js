(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/fast-deep-equal/index.js
  var require_fast_deep_equal = __commonJS({
    "node_modules/fast-deep-equal/index.js"(exports, module) {
      "use strict";
      module.exports = function equal3(a, b) {
        if (a === b)
          return true;
        if (a && b && typeof a == "object" && typeof b == "object") {
          if (a.constructor !== b.constructor)
            return false;
          var length, i, keys;
          if (Array.isArray(a)) {
            length = a.length;
            if (length != b.length)
              return false;
            for (i = length; i-- !== 0; )
              if (!equal3(a[i], b[i]))
                return false;
            return true;
          }
          if (a.constructor === RegExp)
            return a.source === b.source && a.flags === b.flags;
          if (a.valueOf !== Object.prototype.valueOf)
            return a.valueOf() === b.valueOf();
          if (a.toString !== Object.prototype.toString)
            return a.toString() === b.toString();
          keys = Object.keys(a);
          length = keys.length;
          if (length !== Object.keys(b).length)
            return false;
          for (i = length; i-- !== 0; )
            if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
              return false;
          for (i = length; i-- !== 0; ) {
            var key = keys[i];
            if (!equal3(a[key], b[key]))
              return false;
          }
          return true;
        }
        return a !== a && b !== b;
      };
    }
  });

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

  // src/lib/helpers.ts
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

  // src/lib/Point.ts
  var Point = class _Point extends Base_default {
    /**
     * Holds the Google maps point object
     */
    #pointObject;
    /**
     * The X value
     */
    #x;
    /**
     * The Y value
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
        if (!isObject(this.#pointObject)) {
          this.#pointObject = new google.maps.Point(this.x, this.y);
        }
        return this.#pointObject;
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
  var point = (x, y) => new Point(x, y);

  // src/lib/Size.ts
  var Size = class _Size extends Base_default {
    /**
     * Holds the Google maps size object
     *
     * @private
     * @type {google.maps.Size}
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
            this.#options[key] = point(options[key]).toGoogle();
          }
        });
        sizeValues.forEach((key) => {
          if (options[key]) {
            this.#options[key] = size(options[key]).toGoogle();
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

  // src/lib/LatLng.ts
  var LatLng = class _LatLng extends Base_default {
    /**
     * Holds the Google maps LatLng object
     *
     * @private
     * @type {google.maps.LatLng}
     */
    #latLngObject;
    /**
     * Holds the latitude
     *
     * @private
     * @type {number}
     */
    #latitude;
    /**
     * Holds the longitude
     *
     * @private
     * @type {number}
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
     * @param {Latitude|LatLng} latitude The latitude value or the latitude/longitude pair
     * @param {number|string} [longitude] The longitude value
     */
    constructor(latitude, longitude) {
      super("latlng");
      if (latitude) {
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
        if (typeof latitude.lat !== "undefined") {
          this.latitude = latitude.lat;
        } else if (typeof latitude.latitude !== "undefined") {
          this.latitude = latitude.latitude;
        }
        if (typeof latitude.lng !== "undefined") {
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
        if (!isObject(this.#latLngObject) || this.#valuesChanged) {
          this.#latLngObject = new google.maps.LatLng(this.latitude, this.longitude);
          this.#valuesChanged = false;
        }
        return this.#latLngObject;
      }
      return null;
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

  // node_modules/@googlemaps/js-api-loader/dist/index.esm.js
  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }
  var fastDeepEqual = function equal(a, b) {
    if (a === b)
      return true;
    if (a && b && typeof a == "object" && typeof b == "object") {
      if (a.constructor !== b.constructor)
        return false;
      var length, i, keys;
      if (Array.isArray(a)) {
        length = a.length;
        if (length != b.length)
          return false;
        for (i = length; i-- !== 0; )
          if (!equal(a[i], b[i]))
            return false;
        return true;
      }
      if (a.constructor === RegExp)
        return a.source === b.source && a.flags === b.flags;
      if (a.valueOf !== Object.prototype.valueOf)
        return a.valueOf() === b.valueOf();
      if (a.toString !== Object.prototype.toString)
        return a.toString() === b.toString();
      keys = Object.keys(a);
      length = keys.length;
      if (length !== Object.keys(b).length)
        return false;
      for (i = length; i-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
          return false;
      for (i = length; i-- !== 0; ) {
        var key = keys[i];
        if (!equal(a[key], b[key]))
          return false;
      }
      return true;
    }
    return a !== a && b !== b;
  };
  var DEFAULT_ID = "__googleMapsScriptId";
  var LoaderStatus;
  (function(LoaderStatus2) {
    LoaderStatus2[LoaderStatus2["INITIALIZED"] = 0] = "INITIALIZED";
    LoaderStatus2[LoaderStatus2["LOADING"] = 1] = "LOADING";
    LoaderStatus2[LoaderStatus2["SUCCESS"] = 2] = "SUCCESS";
    LoaderStatus2[LoaderStatus2["FAILURE"] = 3] = "FAILURE";
  })(LoaderStatus || (LoaderStatus = {}));
  var Loader = class _Loader {
    /**
     * Creates an instance of Loader using [[LoaderOptions]]. No defaults are set
     * using this library, instead the defaults are set by the Google Maps
     * JavaScript API server.
     *
     * ```
     * const loader = Loader({apiKey, version: 'weekly', libraries: ['places']});
     * ```
     */
    constructor({ apiKey, authReferrerPolicy, channel, client, id = DEFAULT_ID, language, libraries = [], mapIds, nonce, region, retries = 3, url = "https://maps.googleapis.com/maps/api/js", version }) {
      this.callbacks = [];
      this.done = false;
      this.loading = false;
      this.errors = [];
      this.apiKey = apiKey;
      this.authReferrerPolicy = authReferrerPolicy;
      this.channel = channel;
      this.client = client;
      this.id = id || DEFAULT_ID;
      this.language = language;
      this.libraries = libraries;
      this.mapIds = mapIds;
      this.nonce = nonce;
      this.region = region;
      this.retries = retries;
      this.url = url;
      this.version = version;
      if (_Loader.instance) {
        if (!fastDeepEqual(this.options, _Loader.instance.options)) {
          throw new Error(`Loader must not be called again with different options. ${JSON.stringify(this.options)} !== ${JSON.stringify(_Loader.instance.options)}`);
        }
        return _Loader.instance;
      }
      _Loader.instance = this;
    }
    get options() {
      return {
        version: this.version,
        apiKey: this.apiKey,
        channel: this.channel,
        client: this.client,
        id: this.id,
        libraries: this.libraries,
        language: this.language,
        region: this.region,
        mapIds: this.mapIds,
        nonce: this.nonce,
        url: this.url,
        authReferrerPolicy: this.authReferrerPolicy
      };
    }
    get status() {
      if (this.errors.length) {
        return LoaderStatus.FAILURE;
      }
      if (this.done) {
        return LoaderStatus.SUCCESS;
      }
      if (this.loading) {
        return LoaderStatus.LOADING;
      }
      return LoaderStatus.INITIALIZED;
    }
    get failed() {
      return this.done && !this.loading && this.errors.length >= this.retries + 1;
    }
    /**
     * CreateUrl returns the Google Maps JavaScript API script url given the [[LoaderOptions]].
     *
     * @ignore
     * @deprecated
     */
    createUrl() {
      let url = this.url;
      url += `?callback=__googleMapsCallback`;
      if (this.apiKey) {
        url += `&key=${this.apiKey}`;
      }
      if (this.channel) {
        url += `&channel=${this.channel}`;
      }
      if (this.client) {
        url += `&client=${this.client}`;
      }
      if (this.libraries.length > 0) {
        url += `&libraries=${this.libraries.join(",")}`;
      }
      if (this.language) {
        url += `&language=${this.language}`;
      }
      if (this.region) {
        url += `&region=${this.region}`;
      }
      if (this.version) {
        url += `&v=${this.version}`;
      }
      if (this.mapIds) {
        url += `&map_ids=${this.mapIds.join(",")}`;
      }
      if (this.authReferrerPolicy) {
        url += `&auth_referrer_policy=${this.authReferrerPolicy}`;
      }
      return url;
    }
    deleteScript() {
      const script = document.getElementById(this.id);
      if (script) {
        script.remove();
      }
    }
    /**
     * Load the Google Maps JavaScript API script and return a Promise.
     * @deprecated, use importLibrary() instead.
     */
    load() {
      return this.loadPromise();
    }
    /**
     * Load the Google Maps JavaScript API script and return a Promise.
     *
     * @ignore
     * @deprecated, use importLibrary() instead.
     */
    loadPromise() {
      return new Promise((resolve, reject) => {
        this.loadCallback((err) => {
          if (!err) {
            resolve(window.google);
          } else {
            reject(err.error);
          }
        });
      });
    }
    importLibrary(name) {
      this.execute();
      return google.maps.importLibrary(name);
    }
    /**
     * Load the Google Maps JavaScript API script with a callback.
     * @deprecated, use importLibrary() instead.
     */
    loadCallback(fn) {
      this.callbacks.push(fn);
      this.execute();
    }
    /**
     * Set the script on document.
     */
    setScript() {
      var _a, _b;
      if (document.getElementById(this.id)) {
        this.callback();
        return;
      }
      const params = {
        key: this.apiKey,
        channel: this.channel,
        client: this.client,
        libraries: this.libraries.length && this.libraries,
        v: this.version,
        mapIds: this.mapIds,
        language: this.language,
        region: this.region,
        authReferrerPolicy: this.authReferrerPolicy
      };
      Object.keys(params).forEach(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (key) => !params[key] && delete params[key]
      );
      if (!((_b = (_a = window === null || window === void 0 ? void 0 : window.google) === null || _a === void 0 ? void 0 : _a.maps) === null || _b === void 0 ? void 0 : _b.importLibrary)) {
        ((g) => {
          let h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window;
          b = b[c] || (b[c] = {});
          const d = b.maps || (b.maps = {}), r = /* @__PURE__ */ new Set(), e = new URLSearchParams(), u = () => (
            // @ts-ignore
            h || (h = new Promise((f, n) => __awaiter(this, void 0, void 0, function* () {
              var _a2;
              yield a = m.createElement("script");
              a.id = this.id;
              e.set("libraries", [...r] + "");
              for (k in g)
                e.set(k.replace(/[A-Z]/g, (t) => "_" + t[0].toLowerCase()), g[k]);
              e.set("callback", c + ".maps." + q);
              a.src = this.url + `?` + e;
              d[q] = f;
              a.onerror = () => h = n(Error(p + " could not load."));
              a.nonce = this.nonce || ((_a2 = m.querySelector("script[nonce]")) === null || _a2 === void 0 ? void 0 : _a2.nonce) || "";
              m.head.append(a);
            })))
          );
          d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n));
        })(params);
      }
      const libraryPromises = this.libraries.map((library) => this.importLibrary(library));
      if (!libraryPromises.length) {
        libraryPromises.push(this.importLibrary("core"));
      }
      Promise.all(libraryPromises).then(() => this.callback(), (error) => {
        const event = new ErrorEvent("error", { error });
        this.loadErrorCallback(event);
      });
    }
    /**
     * Reset the loader state.
     */
    reset() {
      this.deleteScript();
      this.done = false;
      this.loading = false;
      this.errors = [];
      this.onerrorEvent = null;
    }
    resetIfRetryingFailed() {
      if (this.failed) {
        this.reset();
      }
    }
    loadErrorCallback(e) {
      this.errors.push(e);
      if (this.errors.length <= this.retries) {
        const delay = this.errors.length * Math.pow(2, this.errors.length);
        console.error(`Failed to load Google Maps script, retrying in ${delay} ms.`);
        setTimeout(() => {
          this.deleteScript();
          this.setScript();
        }, delay);
      } else {
        this.onerrorEvent = e;
        this.callback();
      }
    }
    callback() {
      this.done = true;
      this.loading = false;
      this.callbacks.forEach((cb) => {
        cb(this.onerrorEvent);
      });
      this.callbacks = [];
    }
    execute() {
      this.resetIfRetryingFailed();
      if (this.done) {
        this.callback();
      } else {
        if (window.google && window.google.maps && window.google.maps.version) {
          console.warn("Google Maps already loaded outside @googlemaps/js-api-loader.This may result in undesirable behavior as options and script parameters may not match.");
          this.callback();
          return;
        }
        if (this.loading)
          ;
        else {
          this.loading = true;
          this.setScript();
        }
      }
    }
  };

  // src/lib/Loader.ts
  var Loader2 = class extends EventTarget {
    /**
     * Holds the Google Maps API key
     *
     * @private
     * @type {string}
     */
    #apiKey;
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
     * @returns {string}
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
        if (isStringWithValue(this.#apiKey)) {
          const loader2 = new Loader({
            apiKey: this.#apiKey,
            version: this.#version,
            libraries: this.#libraries
          });
          loader2.importLibrary("maps").then(() => {
            this.#isLoaded = true;
            if (isFunction(callback)) {
              callback();
            }
            this.dispatch("load");
            resolve();
          }).catch((err) => {
            reject(err);
          });
        } else {
          reject(new Error("The Google Maps API key is not set"));
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
        if (this.#isLoaded) {
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
  var loaderInstance;
  var loader = (config) => {
    if (!loaderInstance) {
      loaderInstance = new Loader2(config);
    } else {
      loaderInstance.setOptions(config);
    }
    return loaderInstance;
  };

  // src/lib/Evented.ts
  var Evented = class extends Base_default {
    /**
     * Holds the event listeners
     *
     * @private
     * @type {Events}
     */
    #eventListeners = {};
    /**
     * Holds the Google maps object that events are set up on
     *
     * @private
     * @type {google.maps.MVCObject}
     */
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
     * @type {Events}
     */
    #pendingEventListeners = {};
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
     * Add an event listener that will be set up after the Google Maps API is loaded
     *
     * @param {string} [event] The event type
     * @param {EventCallback} [callback] The event listener function
     * @param {EventOptions} [options] The options object or a boolean to indicate if the event should be captured
     * @param {object} [context] The context to bind the callback function to
     */
    #addPendingEventListener(event, callback, options, context) {
      if (!this.#pendingEventListeners[event]) {
        this.#pendingEventListeners[event] = [];
      }
      this.#pendingEventListeners[event].push({ callback, options, context });
      if (!this.#isOnLoadEventSet) {
        loader().once("map_loaded", () => {
          Object.keys(this.#pendingEventListeners).forEach((type) => {
            this.#pendingEventListeners[type].forEach((evt) => {
              this.on(type, evt.callback, evt.options, evt.context);
            });
          });
          this.#pendingEventListeners = {};
        });
        this.#isOnLoadEventSet = true;
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
     * @param {EventOptions} [options] The options to use when finding the event to remove
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
        }
        if (this.#eventListeners[type].length === 0 && this.#googleObject instanceof google.maps.MVCObject) {
          google.maps.event.clearListeners(this.#googleObject, type);
        }
      } else {
        this.offAll();
      }
    }
    /**
     * Removes all event listeners
     */
    offAll() {
      this.#eventListeners = {};
      if (this.#googleObject instanceof google.maps.MVCObject) {
        google.maps.event.clearInstanceListeners(this.#googleObject);
      }
    }
    /**
     * Add an event listener to the object
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener callback function
     * @param {EventOptions} [options] The options object
     * @param {object} [context] The context to bind the callback function to
     */
    on(type, callback, options, context) {
      this.#on(type, callback, options, context);
    }
    /**
     * Add an event listener to the object
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener callback function
     * @param {EventOptions} [options] The options object
     * @param {object} [context] The context to bind the callback function to
     */
    #on(type, callback, options, context) {
      if (!this.#eventListeners[type]) {
        this.#eventListeners[type] = [];
      }
      let callbackContext = context;
      if (callbackContext === this) {
        callbackContext = void 0;
      }
      this.#eventListeners[type].push({ callback, context: callbackContext, options });
    }
    /**
     * Sets up an event listener that will only be called once
     *
     * @param {string} type The event type
     * @param {EventCallback} [callback] The event listener callback function
     * @param {object} [context] The context to bind the callback function to
     */
    once(type, callback, context) {
      this.on(type, callback, { once: true }, context);
    }
    /**
     * Sets up the event listener on the Google maps object.
     *
     * This also handles setting up the pending events if the Google Maps library isn't loaded already.
     *
     * This should be called from an "on()" function in the class that extends this class.
     * It is not intended to be called from outside of this library.
     *
     * @internal
     * @param {string} type The event type
     * @param {EventCallback} callback The event listener callback function
     * @param {EventOptions} options The options for the event listener
     * @param {object} context The context to bind the callback function to
     */
    setupEventListener(type, callback, options, context) {
      if (isFunction(callback)) {
        if (checkForGoogleMaps(this.#testObject, this.#testLibrary, false)) {
          const hasEvent = Array.isArray(this.#eventListeners[type]);
          this.#on(type, callback, options, context);
          if (!hasEvent && this.#googleObject instanceof google.maps.MVCObject) {
            this.#googleObject.addListener(type, (e) => {
              this.dispatch(type, e);
            });
          }
        } else {
          this.#addPendingEventListener(type, callback, options, context);
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
     * @param {google.maps.MVCObject} googleObject The Google maps MVC object
     */
    setEventGoogleObject(googleObject) {
      this.#googleObject = googleObject;
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

  // src/lib/Layer.ts
  var Layer = class extends Evented {
    /**
     * Holds the Map object that the layer is added to
     *
     * @private
     * @type {Map|null}
     */
    #map = null;
    /**
     * Return the Map object or null if the Map object is not set
     *
     * @returns {Map|null}
     */
    getMap() {
      return this.#map;
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
    }
  };
  var Layer_default = Layer;

  // src/lib/LatLngBounds.ts
  var LatLngBounds = class _LatLngBounds extends Base_default {
    /**
     * Holds the Google maps LatLngBounds object
     */
    #bounds;
    /**
     * Constructor
     *
     * @param {LatLngValue | LatLngValue[]} [latLngValue] The latitude/longitude value(s). If not set then add points with the extend method.
     *      See comments on the extended method for the types of values that latLngValue can be.
     */
    constructor(latLngValue) {
      super("latlngbounds");
      checkForGoogleMaps("LatLngBounds", "LatLngBounds");
      this.#bounds = new google.maps.LatLngBounds();
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
      return this.#bounds.contains(latLng(latLngValue).toGoogle());
    }
    /**
     * Returns whether this bounds approximately equals the given bounds
     *
     * @param {LatLngBounds} other The LatLngBounds object to compare
     * @returns {boolean}
     */
    equals(other) {
      if (other instanceof _LatLngBounds) {
        return this.#bounds.equals(other.toGoogle());
      }
      return false;
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
          if (Array.isArray(latLngValue[0])) {
            const value = latLngValue;
            value.forEach((latLngVal) => {
              this.extend(latLngVal);
            });
          } else {
            const latLngObject = latLng(latLngValue);
            if (latLngObject.isValid()) {
              this.#bounds.extend(latLngObject.toGoogle());
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
          this.#bounds.extend(latLngObject.toGoogle());
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
      return latLngConvert(this.#bounds.getCenter());
    }
    /**
     * Get the north-east corner of the LatLngBounds
     *
     * @returns {LatLng}
     */
    getNorthEast() {
      return latLngConvert(this.#bounds.getNorthEast());
    }
    /**
     * Get the south-west corner of the LatLngBounds
     *
     * @returns {LatLng}
     */
    getSouthWest() {
      return latLngConvert(this.#bounds.getSouthWest());
    }
    /**
     * Returns whether this bounds shares any points with the other bounds
     *
     * @param {LatLngBounds} other The LatLngBounds object to compare
     * @returns {boolean}
     */
    intersects(other) {
      if (!(other instanceof _LatLngBounds)) {
        throw new Error(
          `Invalid LatLngBounds object passed to LatLngBounds.intersects. You passed: ${JSON.stringify(other)}`
        );
      }
      return this.#bounds.intersects(other.toGoogle());
    }
    /**
     * Returns whether this bounds is empty
     *
     * @returns {boolean}
     */
    isEmpty() {
      return this.#bounds.isEmpty();
    }
    /**
     * Get the Google maps LatLngBounds object
     *
     * @returns {google.maps.LatLngBounds}
     */
    toGoogle() {
      return this.#bounds;
    }
    /**
     * Converts the LatLngBounds object to a JSON object
     *
     * @returns {google.maps.LatLngBoundsLiteral}
     */
    toJson() {
      return this.#bounds.toJSON();
    }
    /**
     * Converts the LatLngBounds object to a lat/lng span
     *
     * @returns {LatLng}
     */
    toSpan() {
      return latLngConvert(this.#bounds.toSpan());
    }
    /**
     * Converts the LatLngBounds object to a string
     *
     * @returns {string}
     */
    toString() {
      return this.#bounds.toString();
    }
    /**
     * Returns the LatLngBounds object as a string that can be used in a URL
     *
     * @param {number} [precision] The number of decimal places to round the lat/lng values to
     * @returns {string}
     */
    toUrlValue(precision) {
      return this.#bounds.toUrlValue(precision);
    }
    /**
     * Extends this bounds to contain the union of this and the given bounds
     *
     * @param {LatLngBounds} other The LatLngBounds object to join with
     * @returns {LatLngBounds}
     */
    union(other) {
      this.#bounds.union(other.toGoogle());
      return this;
    }
  };
  var latLngBounds = (latLngValue) => {
    if (latLngValue instanceof LatLngBounds) {
      return latLngValue;
    }
    return new LatLngBounds(latLngValue);
  };

  // src/lib/Map.ts
  var Map = class extends Evented {
    /**
     * Holds the Google map object
     *
     * @private
     * @type {google.maps.Map}
     */
    #map;
    /**
     * Holds the map options
     *
     * @private
     * @type {GMMapOptions}
     */
    #options = {};
    /**
     * Holds the selector of the element that the map will be rendered in. Or the HTMLElement that the map will be rendered in.
     *
     * @private
     * @type {string|HTMLElement}
     */
    #selector;
    /**
     * Holds the watchId for the watchPosition() function
     *
     * @private
     * @type {number}
     */
    #watchId;
    /**
     * Class constructor
     *
     * @param {string|HTMLElement} selector The selector of the element that the map will be rendered in. Or the HTMLElement that the map will be rendered in.
     *      The selector can be a class name, an id, or an HTML element. If you need something beyond an id or class name as the selector then pass the element itself.
     * @param {MapOptions} [options] The options object for the map
     */
    constructor(selector, options) {
      super("map", "Map");
      this.#options.center = latLng(0, 0);
      this.#options.zoom = 6;
      this.#selector = selector;
      if (isObject(options)) {
        this.setOptions(options);
      }
    }
    /**
     * Get the zoom level for the map
     *
     * @returns {number}
     */
    get zoom() {
      let { zoom } = this.#options;
      if (this.#map) {
        zoom = this.#map.getZoom();
      }
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
        this.#map.setZoom(value);
      }
    }
    /**
     * Show the map
     *
     * Alias to show()
     *
     * @param {Function} callback The callback function to call after the map loads
     * @returns {Promise<void>}
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
      if (bounds instanceof LatLngBounds) {
        this.#map.fitBounds(bounds.toGoogle());
      }
      this.#map.fitBounds(latLngBounds(bounds).toGoogle());
      return this;
    }
    /**
     * Get the map options for showing the map
     *
     * @private
     * @returns {google.maps.MapOptions}
     */
    #getMapOptions() {
      const mapOptions = {};
      const optionsToSet = ["zoom"];
      optionsToSet.forEach((key) => {
        if (typeof this.#options[key] !== "undefined") {
          mapOptions[key] = this.#options[key];
        }
      });
      mapOptions.center = this.#options.center.toGoogle();
      return mapOptions;
    }
    /**
     * Get the center point for the map
     *
     * @returns {LatLng}
     */
    getCenter() {
      let { center } = this.#options;
      if (this.#map) {
        const mapCenter = this.#map.getCenter();
        center = latLng(mapCenter.lat(), mapCenter.lng());
      }
      if (!center.equals(this.#options.center)) {
        this.#options.center = center;
      }
      return this.#options.center;
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
     * @param {Function} callback The callback function to call after the map loads
     * @returns {Promise<void>}
     */
    load(callback) {
      return new Promise((resolve, reject) => {
        loader().load().then(() => {
          this.#showMap(callback);
          resolve();
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
        const defaultOptions2 = {
          watch: true
        };
        let config = defaultOptions2;
        if (isObject(options)) {
          config = { ...defaultOptions2, ...options };
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
     * Add an event listener to the object
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener function
     * @param {EventOptions} [options] The event listener options
     * @param {object} [context] The context to bind the callback function to
     */
    on(type, callback, options, context) {
      this.setupEventListener(type, callback, options, context);
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
        if (isObject(this.#map)) {
          this.#map.setCenter(this.#options.center.toGoogle());
        }
      }
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
          } else if (isNumberOrNumberString(options.latitude)) {
            center.setLat(options.latitude);
          }
          if (isNumberOrNumberString(options.lng)) {
            center.setLng(options.lng);
          } else if (isNumberOrNumberString(options.longitude)) {
            center.setLng(options.longitude);
          }
        }
        if (center.isValid()) {
          this.#options.center = center;
        }
        if (options.zoom) {
          this.zoom = options.zoom;
        }
        if (this.#map) {
          this.#map.setOptions(this.#getMapOptions());
        }
      }
      return this;
    }
    /**
     * Set the zoom value
     *
     * @param {number} zoom The zoom value
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
     * @param {Function} callback The callback function to call after the map loads
     * @returns {Promise<void>}
     */
    show(callback) {
      return new Promise((resolve) => {
        if (checkForGoogleMaps("Map", "Map", false)) {
          this.#showMap(callback);
          resolve();
        } else {
          loader().once("load", () => {
            this.#showMap(callback);
            resolve();
          });
        }
      });
    }
    /**
     * Show the map
     *
     * This also dispatches the "visible" and "map_loaded" events,
     * and calls the callback function.
     *
     * @param {Function} callback The callback function to call after the map loads
     */
    #showMap(callback) {
      let element = null;
      if (typeof this.#selector === "string") {
        if (this.#selector.startsWith(".")) {
          element = document.querySelector(this.#selector);
        } else {
          element = document.getElementById(this.#selector.replace("#", ""));
        }
      } else if (this.#selector instanceof HTMLElement) {
        element = this.#selector;
      }
      if (element === null) {
        throw new Error(
          "The map element could not be found. Make sure the map selector is correct and the element exists."
        );
      }
      this.#map = new google.maps.Map(element, this.#getMapOptions());
      this.setEventGoogleObject(this.#map);
      this.dispatch("visible");
      loader().dispatch("map_loaded");
      if (isFunction(callback)) {
        callback();
      }
    }
    /**
     * Stop watching for the user's location
     *
     * @returns {Map}
     */
    stopLocate() {
      if (navigator.geolocation) {
        navigator.geolocation.clearWatch(this.#watchId);
      }
      return this;
    }
    /**
     * Returns the Google map object
     *
     * @returns {google.maps.Map}
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
     * @type {google.maps.Symbol}
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
        anchor: point([0, 0]),
        fillColor: "#000000",
        fillOpacity: 0,
        labelOrigin: point([0, 0]),
        path: "",
        rotation: 0,
        scale: 1,
        strokeColor: "#000000",
        strokeOpacity: 1,
        strokeWeight: void 0
      };
      if (typeof path === "string") {
        this.#options.path = path;
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
      return point(this.#options.anchor);
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
     * @returns {string}
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
     * @returns {number}
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
     * @returns {PointValue}
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
     * @returns {number}
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
     * @returns {number}
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
     * @returns {string}
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
     * @returns {number}
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
     * @returns {number}
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
        const numberValues = ["fillOpacity", "rotation", "scale", "strokeOpacity", "strokeWeight"];
        const pointValues = ["anchor", "labelOrigin"];
        const stringValues = ["fillColor", "path", "strokeColor"];
        numberValues.forEach((key) => {
          if (options[key] && isNumber(options[key]) || isNumberString(options[key])) {
            if (isNumberString(options[key])) {
              this.#options[key] = Number(options[key]);
            } else {
              this.#options[key] = options[key];
            }
          }
        });
        pointValues.forEach((key) => {
          if (options[key]) {
            this.#options[key] = point(options[key]).toGoogle();
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
     * @returns {google.maps.Symbol}
     */
    toGoogle() {
      const options = { ...this.#options };
      if (options.anchor instanceof Point) {
        options.anchor = options.anchor.toGoogle();
      }
      if (options.labelOrigin instanceof Point) {
        options.labelOrigin = options.labelOrigin.toGoogle();
      }
      return options;
    }
  };
  var svgSymbol = (path, options) => {
    if (path instanceof SvgSymbol) {
      return path;
    }
    return new SvgSymbol(path, options);
  };

  // src/lib/Overlay.ts
  var Overlay = class extends Layer_default {
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
     * Holds the overlay view class instance
     *
     * @private
     * @type {google.maps.OverlayView}
     */
    #overlayView;
    /**
     * Holds the position of the overlay
     *
     * @private
     * @type {LatLng}
     */
    #position;
    /**
     * Constructor
     *
     * @param {string} objectType The object type for the class
     * @param {string} testObject The object that needs Google maps. This should be the name of the object that calls this method.
     * @param {string} [testLibrary] An optional Google maps library class to check for. This needs to be part of the google.maps object.
     */
    constructor(objectType, testObject, testLibrary) {
      super(objectType, testObject, testLibrary || "OverlayView");
      this.#overlay = document.createElement("div");
      this.#overlay.style.position = "absolute";
      this.setOffset([0, 0]);
    }
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
     * @returns {LatLng}
     */
    get position() {
      return this.#position;
    }
    /**
     * Set the position of the overlay
     *
     * @param {LatLngValue} value The position of the overlay
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
     * Display the overlay on the map
     *
     * Alias to show()
     *
     * @param {Map} map The Map object
     * @returns {Overlay}
     */
    display(map2) {
      return this.show(map2);
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
     * @returns {LatLng}
     */
    getPosition() {
      return this.position;
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
      }
      return this;
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
     * @returns {Overlay}
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
     * Add the overlay to the map.
     *
     * Alias for setMap()
     *
     * @param {Map} map The Map object
     * @returns {Overlay}
     */
    show(map2) {
      if (map2 instanceof Map) {
        this.#setupGoogleOverlay();
        if (this.#overlayView) {
          this.#overlayView.setMap(map2.toGoogle());
        } else {
          loader().once("map_loaded", () => {
            this.#setupGoogleOverlay();
            if (this.#overlayView) {
              this.#overlayView.setMap(map2.toGoogle());
            }
          });
        }
        super.setMap(map2);
      }
      return this;
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
      constructor(overlay) {
        super();
        this.#overlay = overlay;
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
  var Overlay_default = Overlay;

  // src/lib/Tooltip.ts
  var Tooltip = class extends Overlay_default {
    /**
     * Holds the tooltip content.
     * This can be a simple string of text, string of HTML code, or an HTMLElement.
     *
     * @private
     * @type {string|HTMLElement}
     */
    #content;
    /**
     * Constructor
     *
     * @param {TooltipOptions} [options] Tooltip options
     */
    constructor(options) {
      super("tooltip", "Tooltip");
      if (isObject(options)) {
        this.setOptions(options);
      } else {
        this.setClassName("tooltip");
      }
    }
    /**
     * Returns the content for the tooltip
     *
     * @returns {string|HTMLElement}
     */
    get content() {
      return this.#content;
    }
    /**
     * Set the content for the tooltip
     *
     * @param {string|HTMLElement} content The content for the tooltip
     */
    set content(content) {
      if (isStringWithValue(content)) {
        this.#content = content;
        this.getOverlayElement().innerHTML = content;
      } else if (content instanceof HTMLElement) {
        this.#content = content;
        this.getOverlayElement().innerHTML = "";
        this.getOverlayElement().appendChild(content);
      }
    }
    /**
     * Attach the tooltip to a map or marker
     *
     * The tooltip will be shown when hovering over the map or marker.
     *
     * @param {Map | Marker} element The element to attach the tooltip to
     * @returns {Tooltip}
     */
    attachTo(element) {
      if (element instanceof Map) {
        element.on("mouseover", (e) => {
          this.setPosition(e.latLng);
          this.show(element);
        });
        element.on("mousemove", (e) => {
          this.setPosition(e.latLng);
          this.show(element);
        });
        element.on("mouseout", () => {
          this.hide();
        });
      } else if (element instanceof Marker) {
        element.setTooltip(this);
      }
      return this;
    }
    /**
     * Sets the options for the tooltip
     *
     * @param {TooltipOptions} options Tooltip options
     */
    setOptions(options) {
      if (options.content) {
        this.content = options.content;
      }
      if (isString(options.className)) {
        this.removeClassName("tooltip");
        this.setClassName(options.className);
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
    }
    /**
     * Returns whether the tooltip already has content
     *
     * @returns {boolean}
     */
    hasContent() {
      return isStringWithValue(this.#content);
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
      if (this.hasPosition()) {
        const divPosition = projection.fromLatLngToDivPixel(this.position.toGoogle());
        const display = Math.abs(divPosition.x) < 4e3 && Math.abs(divPosition.y) < 4e3 ? "block" : "none";
        if (display === "block") {
          const offset = this.getOffset();
          this.getOverlayElement().style.left = `${divPosition.x + offset.getX()}px`;
          this.getOverlayElement().style.top = `${divPosition.y + offset.getY()}px`;
        }
        if (this.getOverlayElement().style.display !== display) {
          this.getOverlayElement().style.display = display;
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

  // src/lib/Marker.ts
  var Marker = class extends Layer_default {
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
     * @private
     * @type {GMMarkerOptions}
     */
    #options = {};
    /**
     * Constructor
     *
     * @param {LatLngValue|MarkerOptions} [position] The latitude longitude pair
     * @param {MarkerOptions} [options] The marker options
     */
    constructor(position, options) {
      super("marker", "Marker");
      this.#options.position = latLng([0, 0]);
      if (position instanceof LatLng || Array.isArray(position)) {
        this.position = position;
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
      return this.#options.anchorPoint;
    }
    /**
     * Set the anchor point for the marker
     *
     * @param {PointValue} value The anchor point for the marker
     */
    set anchorPoint(value) {
      const anchor = point(value);
      if (anchor.isValid()) {
        this.#options.anchorPoint = anchor;
      } else {
        this.#options.anchorPoint = void 0;
      }
      this.#setupGoogleMarker();
      if (this.#marker) {
        this.#marker.setOptions({ anchorPoint: this.#options.anchorPoint.toGoogle() });
      }
    }
    /**
     * Get the cursor type to show on hover
     *
     * @returns {string}
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
      if (isStringWithValue(value)) {
        this.#options.cursor = value;
      } else if (isNullOrUndefined(value)) {
        this.#options.cursor = void 0;
      }
      this.#setupGoogleMarker();
      if (this.#marker) {
        this.#marker.setCursor(this.#options.cursor);
      }
    }
    /**
     * Get the icon for the marker
     *
     * @returns {Icon | SvgSymbol | string}
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
      if (isString(value) || value instanceof Icon || value instanceof SvgSymbol) {
        this.#options.icon = value;
      } else if (isNullOrUndefined(value)) {
        this.#options.icon = void 0;
      }
      this.#setupGoogleMarker();
      if (this.#marker) {
        if (isString(this.#options.icon)) {
          this.#marker.setIcon(this.#options.icon);
        } else {
          this.#marker.setIcon(this.#options.icon.toGoogle());
        }
      }
    }
    /**
     * Get the label for the marker
     *
     * @returns {string | number | MarkerLabel}
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
      if (isStringWithValue(value)) {
        this.#options.label = value;
      } else if (isObject(value) && isStringOrNumber(value.text)) {
        this.#options.label = {
          text: value.text.toString(),
          className: isStringWithValue(value.className) ? value.className : void 0,
          color: isStringWithValue(value.color) ? value.color : void 0,
          fontFamily: isStringWithValue(value.fontFamily) ? value.fontFamily : void 0,
          fontWeight: isStringWithValue(value.fontWeight) ? value.fontWeight : void 0
        };
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
      this.#setupGoogleMarker();
      if (this.#marker) {
        this.#marker.setLabel(this.#options.label);
      }
    }
    /**
     * Get the map object
     *
     * @returns {Map}
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
      if (value instanceof Map) {
        this.#options.map = value;
        super.setMap(value);
        this.#setupGoogleMarker();
        if (this.#marker) {
          this.#marker.setMap(value.toGoogle());
        } else {
          loader().once("map_loaded", () => {
            this.#setupGoogleMarker();
            const map2 = this.getMap();
            if (this.#marker && map2) {
              this.#marker.setMap(map2.toGoogle());
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
     * Get the marker position
     *
     * @returns {LatLng}
     */
    get position() {
      return this.#options.position;
    }
    /**
     * Set the latitude and longitude value for the marker
     *
     * @param {LatLngValue} value The latitude/longitude position for the marker
     */
    set position(value) {
      const position = latLng(value);
      if (position.isValid()) {
        this.#options.position = position;
        this.#setupGoogleMarker();
        if (this.#marker) {
          this.#marker.setPosition(this.#options.position.toGoogle());
        }
      }
    }
    /**
     * Get the title for the marker
     *
     * @returns {string}
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
      if (isStringOrNumber(value)) {
        this.#options.title = value.toString();
      } else if (isNullOrUndefined(value)) {
        this.#options.title = void 0;
      }
      this.#setupGoogleMarker();
      if (this.#marker) {
        this.#marker.setTitle(this.#options.title);
      }
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
      return this.show(map2);
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
     * Add an event listener to the object
     *
     * @param {string} type The event type
     * @param {EventCallback} callback The event listener function
     * @param {EventOptions} [options] The event listener options
     * @param {object} [context] The context to bind the callback function to
     */
    on(type, callback, options, context) {
      this.setupEventListener(type, callback, options, context);
    }
    /**
     * Adds the marker to the map object
     *
     * Alternate of show()
     *
     * @param {Map} map The map object
     * @returns {Marker}
     */
    setMap(map2) {
      return this.show(map2);
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
      if (options.title && options.tooltip) {
        this.setTooltip(options.tooltip, options.title);
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
        this.map = options.map;
      }
      return this;
    }
    /**
     * Set up a custom tooltip for the marker instead of relying on the default browser tooltip
     *
     * @param {TooltipValue} tooltipValue The tooltip value
     * @param {string} title The tooltip title
     * @returns {Marker}
     */
    setTooltip(tooltipValue, title) {
      const tt = tooltip(tooltipValue);
      if (!tt.hasContent()) {
        tt.setContent(title);
      }
      if (tt.hasContent()) {
        this.#setupGoogleMarker();
        if (this.#marker) {
          this.#marker.addListener("mouseover", () => {
            tt.setPosition(this.#options.position).show(this.getMap());
          });
          this.#marker.addListener("mouseout", () => {
            tt.hide();
          });
        } else {
          loader().once("map_loaded", () => {
            this.#setupGoogleMarker();
            if (this.#marker) {
              this.#marker.addListener("mouseover", () => {
                tt.setPosition(this.#options.position).show(this.getMap());
              });
              this.#marker.addListener("mouseout", () => {
                tt.hide();
              });
            }
          });
        }
      }
      this.title = void 0;
      return this;
    }
    /**
     * Set the latitude and longitude value for the marker
     *
     * @param {LatLngValue} value The latitude/longitude position for the marker
     * @returns {Marker}
     */
    setPosition(value) {
      this.position = value;
      return this;
    }
    /**
     * Adds the marker to the map object
     *
     * Alternate of setMap()
     *
     * @param {Map} map The map object
     * @returns {Marker}
     */
    show(map2) {
      this.map = map2;
      return this;
    }
    /**
     * Get the Google maps marker object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker
     *
     * @returns {google.maps.Marker}
     */
    toGoogle() {
      this.#setupGoogleMarker();
      return this.#marker;
    }
    /**
     * Set up the Google maps marker object if necessary
     *
     * @private
     */
    #setupGoogleMarker() {
      if (!isObject(this.#marker)) {
        if (checkForGoogleMaps("Marker", "Marker", false)) {
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
          if (this.#options.icon) {
            if (isString(this.#options.icon)) {
              markerOptions.icon = this.#options.icon;
            } else if (this.#options.icon instanceof Icon || this.#options.icon instanceof SvgSymbol) {
              markerOptions.icon = this.#options.icon.toGoogle();
            }
          }
          if (this.#options.map) {
            markerOptions.map = this.#options.map.toGoogle();
          }
          if (this.#options.position) {
            markerOptions.position = this.#options.position.toGoogle();
          }
          this.#marker = new google.maps.Marker(markerOptions);
          this.setEventGoogleObject(this.#marker);
        }
      }
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
     * Whether focus should be moved to the InfoWindow when it is opened
     *
     * @private
     * @type {boolean}
     */
    #focus = false;
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
     * @private
     * @type {google.maps.InfoWindow}
     */
    #infoWindow;
    /**
     * Constructor
     *
     * @param {InfoWindowOptions} [options] The InfoWindow options
     */
    constructor(options) {
      super("infowindow", "InfoWindow");
      this.#options.pixelOffset = size(0, -4);
      if (isObject(options)) {
        this.setOptions(options);
      }
    }
    /**
     * Get the aria label for the InfoWindow
     *
     * @returns {string}
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
     * @returns {string|HTMLElement|Text}
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
      if (typeof disableAutoPan !== "boolean") {
        this.#options.disableAutoPan = disableAutoPan;
        this.#setupGoogleInfoWindow();
        if (this.#infoWindow) {
          this.#infoWindow.setOptions({ disableAutoPan: this.#options.disableAutoPan });
        }
      }
    }
    /**
     * Get the maxWidth option for the InfoWindow
     *
     * @returns {number}
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
     * @returns {number}
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
     * @returns {LatLng}
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
     * @returns {number}
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
     * Returns whether the InfoWindow is open or not
     *
     * @returns {boolean}
     */
    isOpen() {
      return this.#isOpen;
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
     * Open the info window
     *
     * You need to pass in either an anchor object or a map object.
     * If an anchor object is passed in then the info window will be displayed at the anchor's position.
     * If a map object is passed in then the info window will be displayed at the position of the info window.
     *
     * https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.open
     *
     * @param {Map | Marker} anchorOrMap The anchor object or map object.
     *      This should ideally be the Map or Marker object.
     * @returns {InfoWindow}
     */
    open(anchorOrMap) {
      this.#setupGoogleInfoWindow();
      const collection = InfoWindowCollection.getInstance();
      if (collection.has(this) && this.#isOpen) {
        if (this.#toggleDisplay) {
          this.close();
        }
      } else {
        if (this.#autoClose) {
          collection.closeOthers(this);
        }
        if (anchorOrMap instanceof Map) {
          this.#infoWindow.open({
            map: anchorOrMap.toGoogle(),
            shouldFocus: this.#focus
          });
          this.setMap(anchorOrMap);
        } else if (anchorOrMap instanceof Marker) {
          this.#infoWindow.open({
            anchor: anchorOrMap.toGoogle(),
            shouldFocus: this.#focus
          });
          this.setMap(anchorOrMap.getMap());
        }
        this.#isOpen = true;
        collection.add(this);
      }
      return this;
    }
    /**
     * Close the info window
     */
    close() {
      if (this.#infoWindow) {
        this.#infoWindow.close();
      }
      this.#isOpen = false;
      InfoWindowCollection.getInstance().remove(this);
    }
    /**
     * Get the Google maps InfoWindow object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow
     *
     * @returns {google.maps.InfoWindow}
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
          const optionsToSet = ["ariaLabel", "content", "disableAutoPan", "maxWidth", "minWidth", "zIndex"];
          optionsToSet.forEach((key) => {
            if (typeof this.#options[key] !== "undefined") {
              infoWindowOptions[key] = this.#options[key];
            }
          });
          if (this.#options.pixelOffset) {
            infoWindowOptions.pixelOffset = this.#options.pixelOffset.toGoogle();
          }
          if (this.#options.position) {
            infoWindowOptions.position = this.#options.position.toGoogle();
          }
          this.#infoWindow = new google.maps.InfoWindow(infoWindowOptions);
          this.#infoWindow.addListener("closeclick", () => {
            InfoWindowCollection.getInstance().remove(this);
          });
          this.#infoWindow.addListener("map_changed", () => {
            if (this.#infoWindow.get("map") === null) {
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
     * @type {InfoWindow}
     */
    layerInfoWindow: null,
    /**
     * Bind an InfoWindow to the layer
     *
     * @param {string | HTMLElement | Text | InfoWindowValue} content The content for the InfoWindow, or the InfoWindow options object, or the InfoWindow object
     * @param {InfoWindowOptions} [options] The InfoWindow options object
     */
    bindInfoWindow(content, options) {
      if (content instanceof InfoWindow) {
        this.layerInfoWindow = content;
      } else if (isString(content) || content instanceof HTMLElement || content instanceof Text) {
        this.layerInfoWindow = infoWindow();
        this.layerInfoWindow.setContent(content);
      } else if (isObjectWithValues(content)) {
        this.layerInfoWindow = infoWindow(content);
      }
      if (isObjectWithValues(options)) {
        this.layerInfoWindow.setOptions(options);
      }
      this.on("click", (e) => {
        if (this.layerInfoWindow) {
          if (this.isMap() && e.latLng) {
            this.layerInfoWindow.position = e.latLng;
            this.layerInfoWindow.close();
          }
          this.layerInfoWindow.open(this);
        }
      });
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
        closeAll() {
          this.infoWindows.forEach((iw) => {
            iw.close();
          });
        },
        /**
         * Close all the InfoWindows in the collection except for the one passed in
         *
         * @param {InfoWindow} iw The InfoWindow object to keep open
         */
        closeOthers(iw) {
          this.infoWindows.forEach((infoW) => {
            if (infoW !== iw) {
              infoW.close();
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

  // node_modules/@googlemaps/markerclusterer/dist/index.esm.js
  var import_fast_deep_equal = __toESM(require_fast_deep_equal());

  // node_modules/kdbush/index.js
  var ARRAY_TYPES = [
    Int8Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Uint16Array,
    Int32Array,
    Uint32Array,
    Float32Array,
    Float64Array
  ];
  var VERSION = 1;
  var HEADER_SIZE = 8;
  var KDBush = class _KDBush {
    /**
     * Creates an index from raw `ArrayBuffer` data.
     * @param {ArrayBuffer} data
     */
    static from(data) {
      if (!(data instanceof ArrayBuffer)) {
        throw new Error("Data must be an instance of ArrayBuffer.");
      }
      const [magic, versionAndType] = new Uint8Array(data, 0, 2);
      if (magic !== 219) {
        throw new Error("Data does not appear to be in a KDBush format.");
      }
      const version = versionAndType >> 4;
      if (version !== VERSION) {
        throw new Error(`Got v${version} data when expected v${VERSION}.`);
      }
      const ArrayType = ARRAY_TYPES[versionAndType & 15];
      if (!ArrayType) {
        throw new Error("Unrecognized array type.");
      }
      const [nodeSize] = new Uint16Array(data, 2, 1);
      const [numItems] = new Uint32Array(data, 4, 1);
      return new _KDBush(numItems, nodeSize, ArrayType, data);
    }
    /**
     * Creates an index that will hold a given number of items.
     * @param {number} numItems
     * @param {number} [nodeSize=64] Size of the KD-tree node (64 by default).
     * @param {TypedArrayConstructor} [ArrayType=Float64Array] The array type used for coordinates storage (`Float64Array` by default).
     * @param {ArrayBuffer} [data] (For internal use only)
     */
    constructor(numItems, nodeSize = 64, ArrayType = Float64Array, data) {
      if (isNaN(numItems) || numItems < 0)
        throw new Error(`Unpexpected numItems value: ${numItems}.`);
      this.numItems = +numItems;
      this.nodeSize = Math.min(Math.max(+nodeSize, 2), 65535);
      this.ArrayType = ArrayType;
      this.IndexArrayType = numItems < 65536 ? Uint16Array : Uint32Array;
      const arrayTypeIndex = ARRAY_TYPES.indexOf(this.ArrayType);
      const coordsByteSize = numItems * 2 * this.ArrayType.BYTES_PER_ELEMENT;
      const idsByteSize = numItems * this.IndexArrayType.BYTES_PER_ELEMENT;
      const padCoords = (8 - idsByteSize % 8) % 8;
      if (arrayTypeIndex < 0) {
        throw new Error(`Unexpected typed array class: ${ArrayType}.`);
      }
      if (data && data instanceof ArrayBuffer) {
        this.data = data;
        this.ids = new this.IndexArrayType(this.data, HEADER_SIZE, numItems);
        this.coords = new this.ArrayType(this.data, HEADER_SIZE + idsByteSize + padCoords, numItems * 2);
        this._pos = numItems * 2;
        this._finished = true;
      } else {
        this.data = new ArrayBuffer(HEADER_SIZE + coordsByteSize + idsByteSize + padCoords);
        this.ids = new this.IndexArrayType(this.data, HEADER_SIZE, numItems);
        this.coords = new this.ArrayType(this.data, HEADER_SIZE + idsByteSize + padCoords, numItems * 2);
        this._pos = 0;
        this._finished = false;
        new Uint8Array(this.data, 0, 2).set([219, (VERSION << 4) + arrayTypeIndex]);
        new Uint16Array(this.data, 2, 1)[0] = nodeSize;
        new Uint32Array(this.data, 4, 1)[0] = numItems;
      }
    }
    /**
     * Add a point to the index.
     * @param {number} x
     * @param {number} y
     * @returns {number} An incremental index associated with the added item (starting from `0`).
     */
    add(x, y) {
      const index = this._pos >> 1;
      this.ids[index] = index;
      this.coords[this._pos++] = x;
      this.coords[this._pos++] = y;
      return index;
    }
    /**
     * Perform indexing of the added points.
     */
    finish() {
      const numAdded = this._pos >> 1;
      if (numAdded !== this.numItems) {
        throw new Error(`Added ${numAdded} items when expected ${this.numItems}.`);
      }
      sort(this.ids, this.coords, this.nodeSize, 0, this.numItems - 1, 0);
      this._finished = true;
      return this;
    }
    /**
     * Search the index for items within a given bounding box.
     * @param {number} minX
     * @param {number} minY
     * @param {number} maxX
     * @param {number} maxY
     * @returns {number[]} An array of indices correponding to the found items.
     */
    range(minX, minY, maxX, maxY) {
      if (!this._finished)
        throw new Error("Data not yet indexed - call index.finish().");
      const { ids, coords, nodeSize } = this;
      const stack = [0, ids.length - 1, 0];
      const result = [];
      while (stack.length) {
        const axis = stack.pop() || 0;
        const right = stack.pop() || 0;
        const left = stack.pop() || 0;
        if (right - left <= nodeSize) {
          for (let i = left; i <= right; i++) {
            const x2 = coords[2 * i];
            const y2 = coords[2 * i + 1];
            if (x2 >= minX && x2 <= maxX && y2 >= minY && y2 <= maxY)
              result.push(ids[i]);
          }
          continue;
        }
        const m = left + right >> 1;
        const x = coords[2 * m];
        const y = coords[2 * m + 1];
        if (x >= minX && x <= maxX && y >= minY && y <= maxY)
          result.push(ids[m]);
        if (axis === 0 ? minX <= x : minY <= y) {
          stack.push(left);
          stack.push(m - 1);
          stack.push(1 - axis);
        }
        if (axis === 0 ? maxX >= x : maxY >= y) {
          stack.push(m + 1);
          stack.push(right);
          stack.push(1 - axis);
        }
      }
      return result;
    }
    /**
     * Search the index for items within a given radius.
     * @param {number} qx
     * @param {number} qy
     * @param {number} r Query radius.
     * @returns {number[]} An array of indices correponding to the found items.
     */
    within(qx, qy, r) {
      if (!this._finished)
        throw new Error("Data not yet indexed - call index.finish().");
      const { ids, coords, nodeSize } = this;
      const stack = [0, ids.length - 1, 0];
      const result = [];
      const r2 = r * r;
      while (stack.length) {
        const axis = stack.pop() || 0;
        const right = stack.pop() || 0;
        const left = stack.pop() || 0;
        if (right - left <= nodeSize) {
          for (let i = left; i <= right; i++) {
            if (sqDist(coords[2 * i], coords[2 * i + 1], qx, qy) <= r2)
              result.push(ids[i]);
          }
          continue;
        }
        const m = left + right >> 1;
        const x = coords[2 * m];
        const y = coords[2 * m + 1];
        if (sqDist(x, y, qx, qy) <= r2)
          result.push(ids[m]);
        if (axis === 0 ? qx - r <= x : qy - r <= y) {
          stack.push(left);
          stack.push(m - 1);
          stack.push(1 - axis);
        }
        if (axis === 0 ? qx + r >= x : qy + r >= y) {
          stack.push(m + 1);
          stack.push(right);
          stack.push(1 - axis);
        }
      }
      return result;
    }
  };
  function sort(ids, coords, nodeSize, left, right, axis) {
    if (right - left <= nodeSize)
      return;
    const m = left + right >> 1;
    select(ids, coords, m, left, right, axis);
    sort(ids, coords, nodeSize, left, m - 1, 1 - axis);
    sort(ids, coords, nodeSize, m + 1, right, 1 - axis);
  }
  function select(ids, coords, k, left, right, axis) {
    while (right > left) {
      if (right - left > 600) {
        const n = right - left + 1;
        const m = k - left + 1;
        const z = Math.log(n);
        const s = 0.5 * Math.exp(2 * z / 3);
        const sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
        const newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
        const newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
        select(ids, coords, k, newLeft, newRight, axis);
      }
      const t = coords[2 * k + axis];
      let i = left;
      let j = right;
      swapItem(ids, coords, left, k);
      if (coords[2 * right + axis] > t)
        swapItem(ids, coords, left, right);
      while (i < j) {
        swapItem(ids, coords, i, j);
        i++;
        j--;
        while (coords[2 * i + axis] < t)
          i++;
        while (coords[2 * j + axis] > t)
          j--;
      }
      if (coords[2 * left + axis] === t)
        swapItem(ids, coords, left, j);
      else {
        j++;
        swapItem(ids, coords, j, right);
      }
      if (j <= k)
        left = j + 1;
      if (k <= j)
        right = j - 1;
    }
  }
  function swapItem(ids, coords, i, j) {
    swap(ids, i, j);
    swap(coords, 2 * i, 2 * j);
    swap(coords, 2 * i + 1, 2 * j + 1);
  }
  function swap(arr, i, j) {
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  function sqDist(ax, ay, bx, by) {
    const dx = ax - bx;
    const dy = ay - by;
    return dx * dx + dy * dy;
  }

  // node_modules/supercluster/index.js
  var defaultOptions = {
    minZoom: 0,
    // min zoom to generate clusters on
    maxZoom: 16,
    // max zoom level to cluster the points on
    minPoints: 2,
    // minimum points to form a cluster
    radius: 40,
    // cluster radius in pixels
    extent: 512,
    // tile extent (radius is calculated relative to it)
    nodeSize: 64,
    // size of the KD-tree leaf node, affects performance
    log: false,
    // whether to log timing info
    // whether to generate numeric ids for input features (in vector tiles)
    generateId: false,
    // a reduce function for calculating custom cluster properties
    reduce: null,
    // (accumulated, props) => { accumulated.sum += props.sum; }
    // properties to use for individual points when running the reducer
    map: (props) => props
    // props => ({sum: props.my_value})
  };
  var fround = Math.fround || /* @__PURE__ */ ((tmp) => (x) => {
    tmp[0] = +x;
    return tmp[0];
  })(new Float32Array(1));
  var OFFSET_ZOOM = 2;
  var OFFSET_ID = 3;
  var OFFSET_PARENT = 4;
  var OFFSET_NUM = 5;
  var OFFSET_PROP = 6;
  var Supercluster = class {
    constructor(options) {
      this.options = Object.assign(Object.create(defaultOptions), options);
      this.trees = new Array(this.options.maxZoom + 1);
      this.stride = this.options.reduce ? 7 : 6;
      this.clusterProps = [];
    }
    load(points) {
      const { log, minZoom, maxZoom } = this.options;
      if (log)
        console.time("total time");
      const timerId = `prepare ${points.length} points`;
      if (log)
        console.time(timerId);
      this.points = points;
      const data = [];
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        if (!p.geometry)
          continue;
        const [lng, lat] = p.geometry.coordinates;
        const x = fround(lngX(lng));
        const y = fround(latY(lat));
        data.push(
          x,
          y,
          // projected point coordinates
          Infinity,
          // the last zoom the point was processed at
          i,
          // index of the source feature in the original input array
          -1,
          // parent cluster id
          1
          // number of points in a cluster
        );
        if (this.options.reduce)
          data.push(0);
      }
      let tree = this.trees[maxZoom + 1] = this._createTree(data);
      if (log)
        console.timeEnd(timerId);
      for (let z = maxZoom; z >= minZoom; z--) {
        const now = +Date.now();
        tree = this.trees[z] = this._createTree(this._cluster(tree, z));
        if (log)
          console.log("z%d: %d clusters in %dms", z, tree.numItems, +Date.now() - now);
      }
      if (log)
        console.timeEnd("total time");
      return this;
    }
    getClusters(bbox, zoom) {
      let minLng = ((bbox[0] + 180) % 360 + 360) % 360 - 180;
      const minLat = Math.max(-90, Math.min(90, bbox[1]));
      let maxLng = bbox[2] === 180 ? 180 : ((bbox[2] + 180) % 360 + 360) % 360 - 180;
      const maxLat = Math.max(-90, Math.min(90, bbox[3]));
      if (bbox[2] - bbox[0] >= 360) {
        minLng = -180;
        maxLng = 180;
      } else if (minLng > maxLng) {
        const easternHem = this.getClusters([minLng, minLat, 180, maxLat], zoom);
        const westernHem = this.getClusters([-180, minLat, maxLng, maxLat], zoom);
        return easternHem.concat(westernHem);
      }
      const tree = this.trees[this._limitZoom(zoom)];
      const ids = tree.range(lngX(minLng), latY(maxLat), lngX(maxLng), latY(minLat));
      const data = tree.data;
      const clusters = [];
      for (const id of ids) {
        const k = this.stride * id;
        clusters.push(data[k + OFFSET_NUM] > 1 ? getClusterJSON(data, k, this.clusterProps) : this.points[data[k + OFFSET_ID]]);
      }
      return clusters;
    }
    getChildren(clusterId) {
      const originId = this._getOriginId(clusterId);
      const originZoom = this._getOriginZoom(clusterId);
      const errorMsg = "No cluster with the specified id.";
      const tree = this.trees[originZoom];
      if (!tree)
        throw new Error(errorMsg);
      const data = tree.data;
      if (originId * this.stride >= data.length)
        throw new Error(errorMsg);
      const r = this.options.radius / (this.options.extent * Math.pow(2, originZoom - 1));
      const x = data[originId * this.stride];
      const y = data[originId * this.stride + 1];
      const ids = tree.within(x, y, r);
      const children = [];
      for (const id of ids) {
        const k = id * this.stride;
        if (data[k + OFFSET_PARENT] === clusterId) {
          children.push(data[k + OFFSET_NUM] > 1 ? getClusterJSON(data, k, this.clusterProps) : this.points[data[k + OFFSET_ID]]);
        }
      }
      if (children.length === 0)
        throw new Error(errorMsg);
      return children;
    }
    getLeaves(clusterId, limit, offset) {
      limit = limit || 10;
      offset = offset || 0;
      const leaves = [];
      this._appendLeaves(leaves, clusterId, limit, offset, 0);
      return leaves;
    }
    getTile(z, x, y) {
      const tree = this.trees[this._limitZoom(z)];
      const z2 = Math.pow(2, z);
      const { extent, radius } = this.options;
      const p = radius / extent;
      const top = (y - p) / z2;
      const bottom = (y + 1 + p) / z2;
      const tile = {
        features: []
      };
      this._addTileFeatures(
        tree.range((x - p) / z2, top, (x + 1 + p) / z2, bottom),
        tree.data,
        x,
        y,
        z2,
        tile
      );
      if (x === 0) {
        this._addTileFeatures(
          tree.range(1 - p / z2, top, 1, bottom),
          tree.data,
          z2,
          y,
          z2,
          tile
        );
      }
      if (x === z2 - 1) {
        this._addTileFeatures(
          tree.range(0, top, p / z2, bottom),
          tree.data,
          -1,
          y,
          z2,
          tile
        );
      }
      return tile.features.length ? tile : null;
    }
    getClusterExpansionZoom(clusterId) {
      let expansionZoom = this._getOriginZoom(clusterId) - 1;
      while (expansionZoom <= this.options.maxZoom) {
        const children = this.getChildren(clusterId);
        expansionZoom++;
        if (children.length !== 1)
          break;
        clusterId = children[0].properties.cluster_id;
      }
      return expansionZoom;
    }
    _appendLeaves(result, clusterId, limit, offset, skipped) {
      const children = this.getChildren(clusterId);
      for (const child of children) {
        const props = child.properties;
        if (props && props.cluster) {
          if (skipped + props.point_count <= offset) {
            skipped += props.point_count;
          } else {
            skipped = this._appendLeaves(result, props.cluster_id, limit, offset, skipped);
          }
        } else if (skipped < offset) {
          skipped++;
        } else {
          result.push(child);
        }
        if (result.length === limit)
          break;
      }
      return skipped;
    }
    _createTree(data) {
      const tree = new KDBush(data.length / this.stride | 0, this.options.nodeSize, Float32Array);
      for (let i = 0; i < data.length; i += this.stride)
        tree.add(data[i], data[i + 1]);
      tree.finish();
      tree.data = data;
      return tree;
    }
    _addTileFeatures(ids, data, x, y, z2, tile) {
      for (const i of ids) {
        const k = i * this.stride;
        const isCluster = data[k + OFFSET_NUM] > 1;
        let tags, px, py;
        if (isCluster) {
          tags = getClusterProperties(data, k, this.clusterProps);
          px = data[k];
          py = data[k + 1];
        } else {
          const p = this.points[data[k + OFFSET_ID]];
          tags = p.properties;
          const [lng, lat] = p.geometry.coordinates;
          px = lngX(lng);
          py = latY(lat);
        }
        const f = {
          type: 1,
          geometry: [[
            Math.round(this.options.extent * (px * z2 - x)),
            Math.round(this.options.extent * (py * z2 - y))
          ]],
          tags
        };
        let id;
        if (isCluster || this.options.generateId) {
          id = data[k + OFFSET_ID];
        } else {
          id = this.points[data[k + OFFSET_ID]].id;
        }
        if (id !== void 0)
          f.id = id;
        tile.features.push(f);
      }
    }
    _limitZoom(z) {
      return Math.max(this.options.minZoom, Math.min(Math.floor(+z), this.options.maxZoom + 1));
    }
    _cluster(tree, zoom) {
      const { radius, extent, reduce, minPoints } = this.options;
      const r = radius / (extent * Math.pow(2, zoom));
      const data = tree.data;
      const nextData = [];
      const stride = this.stride;
      for (let i = 0; i < data.length; i += stride) {
        if (data[i + OFFSET_ZOOM] <= zoom)
          continue;
        data[i + OFFSET_ZOOM] = zoom;
        const x = data[i];
        const y = data[i + 1];
        const neighborIds = tree.within(data[i], data[i + 1], r);
        const numPointsOrigin = data[i + OFFSET_NUM];
        let numPoints = numPointsOrigin;
        for (const neighborId of neighborIds) {
          const k = neighborId * stride;
          if (data[k + OFFSET_ZOOM] > zoom)
            numPoints += data[k + OFFSET_NUM];
        }
        if (numPoints > numPointsOrigin && numPoints >= minPoints) {
          let wx = x * numPointsOrigin;
          let wy = y * numPointsOrigin;
          let clusterProperties;
          let clusterPropIndex = -1;
          const id = ((i / stride | 0) << 5) + (zoom + 1) + this.points.length;
          for (const neighborId of neighborIds) {
            const k = neighborId * stride;
            if (data[k + OFFSET_ZOOM] <= zoom)
              continue;
            data[k + OFFSET_ZOOM] = zoom;
            const numPoints2 = data[k + OFFSET_NUM];
            wx += data[k] * numPoints2;
            wy += data[k + 1] * numPoints2;
            data[k + OFFSET_PARENT] = id;
            if (reduce) {
              if (!clusterProperties) {
                clusterProperties = this._map(data, i, true);
                clusterPropIndex = this.clusterProps.length;
                this.clusterProps.push(clusterProperties);
              }
              reduce(clusterProperties, this._map(data, k));
            }
          }
          data[i + OFFSET_PARENT] = id;
          nextData.push(wx / numPoints, wy / numPoints, Infinity, id, -1, numPoints);
          if (reduce)
            nextData.push(clusterPropIndex);
        } else {
          for (let j = 0; j < stride; j++)
            nextData.push(data[i + j]);
          if (numPoints > 1) {
            for (const neighborId of neighborIds) {
              const k = neighborId * stride;
              if (data[k + OFFSET_ZOOM] <= zoom)
                continue;
              data[k + OFFSET_ZOOM] = zoom;
              for (let j = 0; j < stride; j++)
                nextData.push(data[k + j]);
            }
          }
        }
      }
      return nextData;
    }
    // get index of the point from which the cluster originated
    _getOriginId(clusterId) {
      return clusterId - this.points.length >> 5;
    }
    // get zoom of the point from which the cluster originated
    _getOriginZoom(clusterId) {
      return (clusterId - this.points.length) % 32;
    }
    _map(data, i, clone) {
      if (data[i + OFFSET_NUM] > 1) {
        const props = this.clusterProps[data[i + OFFSET_PROP]];
        return clone ? Object.assign({}, props) : props;
      }
      const original = this.points[data[i + OFFSET_ID]].properties;
      const result = this.options.map(original);
      return clone && result === original ? Object.assign({}, result) : result;
    }
  };
  function getClusterJSON(data, i, clusterProps) {
    return {
      type: "Feature",
      id: data[i + OFFSET_ID],
      properties: getClusterProperties(data, i, clusterProps),
      geometry: {
        type: "Point",
        coordinates: [xLng(data[i]), yLat(data[i + 1])]
      }
    };
  }
  function getClusterProperties(data, i, clusterProps) {
    const count = data[i + OFFSET_NUM];
    const abbrev = count >= 1e4 ? `${Math.round(count / 1e3)}k` : count >= 1e3 ? `${Math.round(count / 100) / 10}k` : count;
    const propIndex = data[i + OFFSET_PROP];
    const properties = propIndex === -1 ? {} : Object.assign({}, clusterProps[propIndex]);
    return Object.assign(properties, {
      cluster: true,
      cluster_id: data[i + OFFSET_ID],
      point_count: count,
      point_count_abbreviated: abbrev
    });
  }
  function lngX(lng) {
    return lng / 360 + 0.5;
  }
  function latY(lat) {
    const sin = Math.sin(lat * Math.PI / 180);
    const y = 0.5 - 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI;
    return y < 0 ? 0 : y > 1 ? 1 : y;
  }
  function xLng(x) {
    return (x - 0.5) * 360;
  }
  function yLat(y) {
    const y2 = (180 - y * 360) * Math.PI / 180;
    return 360 * Math.atan(Math.exp(y2)) / Math.PI - 90;
  }

  // node_modules/@googlemaps/markerclusterer/dist/index.esm.js
  function __rest(s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
          t[p[i]] = s[p[i]];
      }
    return t;
  }
  var MarkerUtils = class {
    static isAdvancedMarkerAvailable(map2) {
      return google.maps.marker && map2.getMapCapabilities().isAdvancedMarkersAvailable === true;
    }
    static isAdvancedMarker(marker2) {
      return google.maps.marker && marker2 instanceof google.maps.marker.AdvancedMarkerElement;
    }
    static setMap(marker2, map2) {
      if (this.isAdvancedMarker(marker2)) {
        marker2.map = map2;
      } else {
        marker2.setMap(map2);
      }
    }
    static getPosition(marker2) {
      if (this.isAdvancedMarker(marker2)) {
        if (marker2.position) {
          if (marker2.position instanceof google.maps.LatLng) {
            return marker2.position;
          }
          if (marker2.position.lat && marker2.position.lng) {
            return new google.maps.LatLng(marker2.position.lat, marker2.position.lng);
          }
        }
        return new google.maps.LatLng(null);
      }
      return marker2.getPosition();
    }
    static getVisible(marker2) {
      if (this.isAdvancedMarker(marker2)) {
        return true;
      }
      return marker2.getVisible();
    }
  };
  var Cluster = class {
    constructor({ markers, position }) {
      this.markers = markers;
      if (position) {
        if (position instanceof google.maps.LatLng) {
          this._position = position;
        } else {
          this._position = new google.maps.LatLng(position);
        }
      }
    }
    get bounds() {
      if (this.markers.length === 0 && !this._position) {
        return;
      }
      const bounds = new google.maps.LatLngBounds(this._position, this._position);
      for (const marker2 of this.markers) {
        bounds.extend(MarkerUtils.getPosition(marker2));
      }
      return bounds;
    }
    get position() {
      return this._position || this.bounds.getCenter();
    }
    /**
     * Get the count of **visible** markers.
     */
    get count() {
      return this.markers.filter((m) => MarkerUtils.getVisible(m)).length;
    }
    /**
     * Add a marker to the cluster.
     */
    push(marker2) {
      this.markers.push(marker2);
    }
    /**
     * Cleanup references and remove marker from map.
     */
    delete() {
      if (this.marker) {
        MarkerUtils.setMap(this.marker, null);
        this.marker = void 0;
      }
      this.markers.length = 0;
    }
  };
  var filterMarkersToPaddedViewport = (map2, mapCanvasProjection, markers, viewportPaddingPixels) => {
    const extendedMapBounds = extendBoundsToPaddedViewport(map2.getBounds(), mapCanvasProjection, viewportPaddingPixels);
    return markers.filter((marker2) => extendedMapBounds.contains(MarkerUtils.getPosition(marker2)));
  };
  var extendBoundsToPaddedViewport = (bounds, projection, numPixels) => {
    const { northEast, southWest } = latLngBoundsToPixelBounds(bounds, projection);
    const extendedPixelBounds = extendPixelBounds({ northEast, southWest }, numPixels);
    return pixelBoundsToLatLngBounds(extendedPixelBounds, projection);
  };
  var distanceBetweenPoints = (p1, p2) => {
    const R = 6371;
    const dLat = (p2.lat - p1.lat) * Math.PI / 180;
    const dLon = (p2.lng - p1.lng) * Math.PI / 180;
    const sinDLat = Math.sin(dLat / 2);
    const sinDLon = Math.sin(dLon / 2);
    const a = sinDLat * sinDLat + Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) * sinDLon * sinDLon;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };
  var latLngBoundsToPixelBounds = (bounds, projection) => {
    return {
      northEast: projection.fromLatLngToDivPixel(bounds.getNorthEast()),
      southWest: projection.fromLatLngToDivPixel(bounds.getSouthWest())
    };
  };
  var extendPixelBounds = ({ northEast, southWest }, numPixels) => {
    northEast.x += numPixels;
    northEast.y -= numPixels;
    southWest.x -= numPixels;
    southWest.y += numPixels;
    return { northEast, southWest };
  };
  var pixelBoundsToLatLngBounds = ({ northEast, southWest }, projection) => {
    const sw = projection.fromDivPixelToLatLng(southWest);
    const ne = projection.fromDivPixelToLatLng(northEast);
    return new google.maps.LatLngBounds(sw, ne);
  };
  var AbstractAlgorithm = class {
    constructor({ maxZoom = 16 }) {
      this.maxZoom = maxZoom;
    }
    /**
     * Helper function to bypass clustering based upon some map state such as
     * zoom, number of markers, etc.
     *
     * ```typescript
     *  cluster({markers, map}: AlgorithmInput): Cluster[] {
     *    if (shouldBypassClustering(map)) {
     *      return this.noop({markers})
     *    }
     * }
     * ```
     */
    noop({ markers }) {
      return noop(markers);
    }
  };
  var AbstractViewportAlgorithm = class extends AbstractAlgorithm {
    constructor(_a) {
      var { viewportPadding = 60 } = _a, options = __rest(_a, ["viewportPadding"]);
      super(options);
      this.viewportPadding = 60;
      this.viewportPadding = viewportPadding;
    }
    calculate({ markers, map: map2, mapCanvasProjection }) {
      if (map2.getZoom() >= this.maxZoom) {
        return {
          clusters: this.noop({
            markers
          }),
          changed: false
        };
      }
      return {
        clusters: this.cluster({
          markers: filterMarkersToPaddedViewport(map2, mapCanvasProjection, markers, this.viewportPadding),
          map: map2,
          mapCanvasProjection
        })
      };
    }
  };
  var noop = (markers) => {
    const clusters = markers.map((marker2) => new Cluster({
      position: MarkerUtils.getPosition(marker2),
      markers: [marker2]
    }));
    return clusters;
  };
  var GridAlgorithm = class extends AbstractViewportAlgorithm {
    constructor(_a) {
      var { maxDistance = 4e4, gridSize = 40 } = _a, options = __rest(_a, ["maxDistance", "gridSize"]);
      super(options);
      this.clusters = [];
      this.state = { zoom: -1 };
      this.maxDistance = maxDistance;
      this.gridSize = gridSize;
    }
    calculate({ markers, map: map2, mapCanvasProjection }) {
      const state = { zoom: map2.getZoom() };
      let changed = false;
      if (this.state.zoom >= this.maxZoom && state.zoom >= this.maxZoom)
        ;
      else {
        changed = !(0, import_fast_deep_equal.default)(this.state, state);
      }
      this.state = state;
      if (map2.getZoom() >= this.maxZoom) {
        return {
          clusters: this.noop({
            markers
          }),
          changed
        };
      }
      return {
        clusters: this.cluster({
          markers: filterMarkersToPaddedViewport(map2, mapCanvasProjection, markers, this.viewportPadding),
          map: map2,
          mapCanvasProjection
        })
      };
    }
    cluster({ markers, map: map2, mapCanvasProjection }) {
      this.clusters = [];
      markers.forEach((marker2) => {
        this.addToClosestCluster(marker2, map2, mapCanvasProjection);
      });
      return this.clusters;
    }
    addToClosestCluster(marker2, map2, projection) {
      let maxDistance = this.maxDistance;
      let cluster = null;
      for (let i = 0; i < this.clusters.length; i++) {
        const candidate = this.clusters[i];
        const distance = distanceBetweenPoints(candidate.bounds.getCenter().toJSON(), MarkerUtils.getPosition(marker2).toJSON());
        if (distance < maxDistance) {
          maxDistance = distance;
          cluster = candidate;
        }
      }
      if (cluster && extendBoundsToPaddedViewport(cluster.bounds, projection, this.gridSize).contains(MarkerUtils.getPosition(marker2))) {
        cluster.push(marker2);
      } else {
        const cluster2 = new Cluster({ markers: [marker2] });
        this.clusters.push(cluster2);
      }
    }
  };
  var NoopAlgorithm = class extends AbstractAlgorithm {
    constructor(_a) {
      var options = __rest(_a, []);
      super(options);
    }
    calculate({ markers, map: map2, mapCanvasProjection }) {
      return {
        clusters: this.cluster({ markers, map: map2, mapCanvasProjection }),
        changed: false
      };
    }
    cluster(input) {
      return this.noop(input);
    }
  };
  var SuperClusterAlgorithm = class extends AbstractAlgorithm {
    constructor(_a) {
      var { maxZoom, radius = 60 } = _a, options = __rest(_a, ["maxZoom", "radius"]);
      super({ maxZoom });
      this.state = { zoom: -1 };
      this.superCluster = new Supercluster(Object.assign({ maxZoom: this.maxZoom, radius }, options));
    }
    calculate(input) {
      let changed = false;
      const state = { zoom: input.map.getZoom() };
      if (!(0, import_fast_deep_equal.default)(input.markers, this.markers)) {
        changed = true;
        this.markers = [...input.markers];
        const points = this.markers.map((marker2) => {
          const position = MarkerUtils.getPosition(marker2);
          const coordinates = [position.lng(), position.lat()];
          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates
            },
            properties: { marker: marker2 }
          };
        });
        this.superCluster.load(points);
      }
      if (!changed) {
        if (this.state.zoom <= this.maxZoom || state.zoom <= this.maxZoom) {
          changed = !(0, import_fast_deep_equal.default)(this.state, state);
        }
      }
      this.state = state;
      if (changed) {
        this.clusters = this.cluster(input);
      }
      return { clusters: this.clusters, changed };
    }
    cluster({ map: map2 }) {
      return this.superCluster.getClusters([-180, -90, 180, 90], Math.round(map2.getZoom())).map((feature) => this.transformCluster(feature));
    }
    transformCluster({ geometry: { coordinates: [lng, lat] }, properties }) {
      if (properties.cluster) {
        return new Cluster({
          markers: this.superCluster.getLeaves(properties.cluster_id, Infinity).map((leaf) => leaf.properties.marker),
          position: { lat, lng }
        });
      }
      const marker2 = properties.marker;
      return new Cluster({
        markers: [marker2],
        position: MarkerUtils.getPosition(marker2)
      });
    }
  };
  var ClusterStats = class {
    constructor(markers, clusters) {
      this.markers = { sum: markers.length };
      const clusterMarkerCounts = clusters.map((a) => a.count);
      const clusterMarkerSum = clusterMarkerCounts.reduce((a, b) => a + b, 0);
      this.clusters = {
        count: clusters.length,
        markers: {
          mean: clusterMarkerSum / clusters.length,
          sum: clusterMarkerSum,
          min: Math.min(...clusterMarkerCounts),
          max: Math.max(...clusterMarkerCounts)
        }
      };
    }
  };
  var DefaultRenderer = class {
    /**
     * The default render function for the library used by {@link MarkerClusterer}.
     *
     * Currently set to use the following:
     *
     * ```typescript
     * // change color if this cluster has more markers than the mean cluster
     * const color =
     *   count > Math.max(10, stats.clusters.markers.mean)
     *     ? "#ff0000"
     *     : "#0000ff";
     *
     * // create svg url with fill color
     * const svg = window.btoa(`
     * <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
     *   <circle cx="120" cy="120" opacity=".6" r="70" />
     *   <circle cx="120" cy="120" opacity=".3" r="90" />
     *   <circle cx="120" cy="120" opacity=".2" r="110" />
     *   <circle cx="120" cy="120" opacity=".1" r="130" />
     * </svg>`);
     *
     * // create marker using svg icon
     * return new google.maps.Marker({
     *   position,
     *   icon: {
     *     url: `data:image/svg+xml;base64,${svg}`,
     *     scaledSize: new google.maps.Size(45, 45),
     *   },
     *   label: {
     *     text: String(count),
     *     color: "rgba(255,255,255,0.9)",
     *     fontSize: "12px",
     *   },
     *   // adjust zIndex to be above other markers
     *   zIndex: 1000 + count,
     * });
     * ```
     */
    render({ count, position }, stats, map2) {
      const color = count > Math.max(10, stats.clusters.markers.mean) ? "#ff0000" : "#0000ff";
      const svg = `<svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="50" height="50">
<circle cx="120" cy="120" opacity=".6" r="70" />
<circle cx="120" cy="120" opacity=".3" r="90" />
<circle cx="120" cy="120" opacity=".2" r="110" />
<text x="50%" y="50%" style="fill:#fff" text-anchor="middle" font-size="50" dominant-baseline="middle" font-family="roboto,arial,sans-serif">${count}</text>
</svg>`;
      const title = `Cluster of ${count} markers`, zIndex = Number(google.maps.Marker.MAX_ZINDEX) + count;
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
  function extend(type1, type2) {
    for (let property in type2.prototype) {
      type1.prototype[property] = type2.prototype[property];
    }
  }
  var OverlayViewSafe = class _OverlayViewSafe {
    constructor() {
      extend(_OverlayViewSafe, google.maps.OverlayView);
    }
  };
  var MarkerClustererEvents;
  (function(MarkerClustererEvents2) {
    MarkerClustererEvents2["CLUSTERING_BEGIN"] = "clusteringbegin";
    MarkerClustererEvents2["CLUSTERING_END"] = "clusteringend";
    MarkerClustererEvents2["CLUSTER_CLICK"] = "click";
  })(MarkerClustererEvents || (MarkerClustererEvents = {}));
  var defaultOnClusterClickHandler = (_, cluster, map2) => {
    map2.fitBounds(cluster.bounds);
  };
  var MarkerClusterer = class extends OverlayViewSafe {
    constructor({ map: map2, markers = [], algorithmOptions = {}, algorithm = new SuperClusterAlgorithm(algorithmOptions), renderer = new DefaultRenderer(), onClusterClick = defaultOnClusterClickHandler }) {
      super();
      this.markers = [...markers];
      this.clusters = [];
      this.algorithm = algorithm;
      this.renderer = renderer;
      this.onClusterClick = onClusterClick;
      if (map2) {
        this.setMap(map2);
      }
    }
    addMarker(marker2, noDraw) {
      if (this.markers.includes(marker2)) {
        return;
      }
      this.markers.push(marker2);
      if (!noDraw) {
        this.render();
      }
    }
    addMarkers(markers, noDraw) {
      markers.forEach((marker2) => {
        this.addMarker(marker2, true);
      });
      if (!noDraw) {
        this.render();
      }
    }
    removeMarker(marker2, noDraw) {
      const index = this.markers.indexOf(marker2);
      if (index === -1) {
        return false;
      }
      MarkerUtils.setMap(marker2, null);
      this.markers.splice(index, 1);
      if (!noDraw) {
        this.render();
      }
      return true;
    }
    removeMarkers(markers, noDraw) {
      let removed = false;
      markers.forEach((marker2) => {
        removed = this.removeMarker(marker2, true) || removed;
      });
      if (removed && !noDraw) {
        this.render();
      }
      return removed;
    }
    clearMarkers(noDraw) {
      this.markers.length = 0;
      if (!noDraw) {
        this.render();
      }
    }
    /**
     * Recalculates and draws all the marker clusters.
     */
    render() {
      const map2 = this.getMap();
      if (map2 instanceof google.maps.Map && map2.getProjection()) {
        google.maps.event.trigger(this, MarkerClustererEvents.CLUSTERING_BEGIN, this);
        const { clusters, changed } = this.algorithm.calculate({
          markers: this.markers,
          map: map2,
          mapCanvasProjection: this.getProjection()
        });
        if (changed || changed == void 0) {
          const singleMarker = /* @__PURE__ */ new Set();
          for (const cluster of clusters) {
            if (cluster.markers.length == 1) {
              singleMarker.add(cluster.markers[0]);
            }
          }
          const groupMarkers = [];
          for (const cluster of this.clusters) {
            if (cluster.marker == null) {
              continue;
            }
            if (cluster.markers.length == 1) {
              if (!singleMarker.has(cluster.marker)) {
                MarkerUtils.setMap(cluster.marker, null);
              }
            } else {
              groupMarkers.push(cluster.marker);
            }
          }
          this.clusters = clusters;
          this.renderClusters();
          requestAnimationFrame(() => groupMarkers.forEach((marker2) => MarkerUtils.setMap(marker2, null)));
        }
        google.maps.event.trigger(this, MarkerClustererEvents.CLUSTERING_END, this);
      }
    }
    onAdd() {
      this.idleListener = this.getMap().addListener("idle", this.render.bind(this));
      this.render();
    }
    onRemove() {
      google.maps.event.removeListener(this.idleListener);
      this.reset();
    }
    reset() {
      this.markers.forEach((marker2) => MarkerUtils.setMap(marker2, null));
      this.clusters.forEach((cluster) => cluster.delete());
      this.clusters = [];
    }
    renderClusters() {
      const stats = new ClusterStats(this.markers, this.clusters);
      const map2 = this.getMap();
      this.clusters.forEach((cluster) => {
        if (cluster.markers.length === 1) {
          cluster.marker = cluster.markers[0];
        } else {
          cluster.marker = this.renderer.render(cluster, stats, map2);
          cluster.markers.forEach((marker2) => MarkerUtils.setMap(marker2, null));
          if (this.onClusterClick) {
            cluster.marker.addListener(
              "click",
              /* istanbul ignore next */
              (event) => {
                google.maps.event.trigger(this, MarkerClustererEvents.CLUSTER_CLICK, cluster);
                this.onClusterClick(event, cluster, map2);
              }
            );
          }
        }
        MarkerUtils.setMap(cluster.marker, map2);
      });
    }
  };

  // src/lib/MarkerCluster/DefaultRender.ts
  var DefaultRenderer2 = class {
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
        this.#colorRangeBottom = color;
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
          const k = keys[i];
          if (count >= parseInt(k, 10)) {
            color = this.#colors[k];
          } else {
            break;
          }
        }
      } else {
        color = count > mean ? this.#colorRangeTop : this.#colorRangeBottom;
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

  // src/lib/MarkerCluster/ImageRenderer.ts
  var ImageRenderer = class {
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
     * @type {string}
     */
    #labelClassName;
    /**
     * The color of the label text. Default color is black.
     *
     * @private
     * @type {string}
     */
    #labelColor;
    /**
     * Holds the font family for the cluster marker label.
     *
     * @private
     * @type {string}
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
     * @type {string}
     */
    #labelFontWeight;
    /**
     * The map object
     *
     * @private
     * @type {Map}
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
     * @param {number} count The number of markers in the cluster.
     * @returns {ClusterImage}
     */
    getImage(count) {
      const keys = Object.keys(this.#images);
      let image = this.#images[keys[0]];
      for (let i = 0; i < keys.length; i += 1) {
        const k = keys[i];
        if (count >= parseInt(k, 10)) {
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
      if (this.#labelClassName) {
        label.className = this.#labelClassName;
      } else if (image.labelClassName) {
        label.className = image.labelClassName;
      }
      if (this.#labelColor) {
        label.color = this.#labelColor;
      } else if (image.labelColor) {
        label.color = image.labelColor;
      }
      if (this.#labelFontFamily) {
        label.fontFamily = this.#labelFontFamily;
      } else if (image.labelFontFamily) {
        label.fontFamily = image.labelFontFamily;
      }
      if (this.#labelFontSize) {
        label.fontSize = this.#labelFontSize.toString();
      } else if (image.labelFontSize) {
        label.fontSize = image.labelFontSize;
      }
      if (this.#labelFontWeight) {
        label.fontWeight = this.#labelFontWeight;
      } else if (image.labelFontWeight) {
        label.fontWeight = image.labelFontWeight;
      }
      const clusterMarker = marker({
        lat: position.lat(),
        lng: position.lng(),
        icon: markerImage,
        map: this.#map,
        label: this.#showNumber ? label : void 0
      });
      return clusterMarker.toGoogle();
    }
  };

  // src/lib/MarkerCluster.ts
  var MarkerCluster = class extends Base_default {
    /**
     * The MarkerClusterer object
     *
     * @private
     * @type {MarkerClusterer}
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
        loader().on("map_loaded", () => {
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
          const renderer = new DefaultRenderer2();
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
        clusterOptions.renderer = new DefaultRenderer2();
      }
      this.#clusterer = new MarkerClusterer(clusterOptions);
      if (Array.isArray(markers)) {
        markers.forEach((marker2) => {
          if (marker2 instanceof Marker) {
            this.#clusterer.addMarker(marker2.toGoogle(), true);
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
        this.#clusterer.addMarker(marker2.toGoogle(), !draw);
      } else {
        this.#pendingMarkers.push(marker2);
        loader().on("map_loaded", () => {
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
        const markersToAdd = [];
        mks.forEach((marker2) => {
          if (marker2 instanceof Marker) {
            markersToAdd.push(marker2.toGoogle());
          }
        });
        this.#clusterer.addMarkers(markersToAdd, !drw);
      };
      if (checkForGoogleMaps("MarkerCluster", "Marker", false)) {
        add(markers, draw);
      } else {
        markers.forEach((marker2) => {
          this.#pendingMarkers.push(marker2);
        });
        loader().on("map_loaded", () => {
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
      this.#clusterer.clearMarkers(!draw);
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
      this.#clusterer.removeMarker(marker2.toGoogle(), !draw);
      return this;
    }
    /**
     * Force a recalculation and redraw of all the marker clusters.
     *
     * @returns {MarkerCluster}
     */
    render() {
      this.#clusterer.render();
      return this;
    }
  };
  var markerCluster = (map2, markers, options) => new MarkerCluster(map2, markers, options);

  // src/lib/Popup.ts
  var Popup = class extends Overlay_default {
    /**
     * Whether to automatically close other open InfoWindows when opening this one
     *
     * @private
     * @type {boolean}
     */
    #autoClose = true;
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
     * Whether clicking the thing that triggered the popup to open should also close the popup
     *
     * @private
     * @type {boolean}
     */
    #toggleDisplay = true;
    /**
     * Constructor
     *
     * @param {PopupOptions} [options] The Popup options
     */
    constructor(options) {
      super("popup", "Popup");
      this.#popupOffset = point(0, 0);
      if (isObject(options)) {
        this.setOptions(options);
      }
    }
    /**
     * Sets the options for the popup
     *
     * @param {PopupOptions} options Popup options
     * @returns {Popup}
     */
    setOptions(options) {
      if (isString(options.className)) {
        this.setClassName(options.className);
      }
      if (typeof options.offset !== "undefined") {
        this.setOffset(options.offset);
      }
      this.setContent(options.content);
      return this;
    }
    /**
     * Set the Popup content
     *
     * @param {string | HTMLElement | Text} content The Popup content
     * @returns {Popup}
     */
    setContent(content) {
      if (isStringWithValue(content)) {
        this.getOverlayElement().innerHTML = content;
      } else if (content instanceof HTMLElement || content instanceof Text) {
        while (this.getOverlayElement().firstChild) {
          this.getOverlayElement().removeChild(this.getOverlayElement().firstChild);
        }
        this.getOverlayElement().appendChild(content);
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
     * @param {Map | Marker} anchorOrMap The anchor object or map object.
     *      This should ideally be the Map or Marker object and not the Google maps object.
     *      If this is used internally then the Google maps object can be used.
     * @returns {Popup}
     */
    open(anchorOrMap) {
      const collection = PopupCollection.getInstance();
      if (collection.has(this) && this.#isOpen) {
        if (this.#toggleDisplay) {
          this.close();
        }
      } else {
        if (this.#autoClose) {
          collection.closeOthers(this);
        }
        if (anchorOrMap instanceof Map) {
          this.#popupOffset = this.getOffset().clone();
          this.setMap(anchorOrMap);
        } else if (anchorOrMap instanceof Marker) {
          this.position = anchorOrMap.getPosition();
          const m = anchorOrMap.toGoogle();
          const anchorPoint = m.get("anchorPoint");
          if (anchorPoint instanceof google.maps.Point) {
            this.#popupOffset = this.getOffset().add(anchorPoint.x, anchorPoint.y);
          } else {
            this.#popupOffset = this.getOffset().clone();
          }
          this.setMap(anchorOrMap.getMap());
        }
        this.#isOpen = true;
        collection.add(this);
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
      const divPosition = projection.fromLatLngToDivPixel(this.position.toGoogle());
      const display = Math.abs(divPosition.x) < 4e3 && Math.abs(divPosition.y) < 4e3 ? "block" : "none";
      if (display === "block") {
        this.getOverlayElement().style.left = `${divPosition.x + this.#popupOffset.getX()}px`;
        this.getOverlayElement().style.top = `${divPosition.y + this.#popupOffset.getY()}px`;
      }
      if (this.getOverlayElement().style.display !== display) {
        this.getOverlayElement().style.display = display;
      }
    }
    /**
     * Close the popup
     *
     * @returns {Popup}
     */
    close() {
      this.hide();
      this.#isOpen = false;
      PopupCollection.getInstance().remove(this);
      return this;
    }
  };
  var popup = (options) => {
    if (options instanceof Popup) {
      return options;
    }
    return new Popup(options);
  };
  Layer_default.include({
    /**
     * Holds the Popup object
     *
     * @type {Popup}
     */
    layerPopup: null,
    /**
     *
     * @param {string | HTMLElement | Text | PopupValue} content The content for the Popup, or the Popup options object, or the Popup object
     * @param {PopupOptions} [options] The Popup options object
     */
    bindPopup(content, options) {
      if (content instanceof Popup) {
        this.layerPopup = content;
      } else if (isString(content) || content instanceof HTMLElement || content instanceof Text) {
        this.layerPopup = popup();
        this.layerPopup.setContent(content);
      } else if (isObjectWithValues(content)) {
        this.layerPopup = popup(content);
      }
      if (isObjectWithValues(options)) {
        this.layerPopup.setOptions(options);
      }
      this.on("click", () => {
        if (this.layerPopup) {
          this.layerPopup.open(this);
        }
      });
    }
  });
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
         * Closes all the Popups in the collection
         */
        closeAll() {
          this.popups.forEach((p) => {
            p.close();
          });
        },
        /**
         * Close all the Popups in the collection except for the one passed in
         *
         * @param {Popup} p The Popup object to keep open
         */
        closeOthers(p) {
          this.popups.forEach((infoW) => {
            if (infoW !== p) {
              infoW.close();
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

  // src/index.ts
  var G = {
    icon,
    Icon,
    infoWindow,
    InfoWindow,
    latLng,
    LatLng,
    latLngBounds,
    LatLngBounds,
    loader,
    Loader: Loader2,
    map,
    Map,
    marker,
    Marker,
    markerCluster,
    MarkerCluster,
    point,
    Point,
    popup,
    Popup,
    size,
    Size,
    svgSymbol,
    SvgSymbol,
    tooltip,
    Tooltip
  };
  function getGlobalObject() {
    if (typeof globalThis !== "undefined") {
      return globalThis;
    }
    if (typeof window !== "undefined") {
      return window;
    }
    if (typeof global !== "undefined") {
      return global;
    }
    throw new Error("Unable to locate global object.");
  }
  getGlobalObject().G = G;
})();
/*! Bundled license information:

@googlemaps/js-api-loader/dist/index.esm.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)

@googlemaps/markerclusterer/dist/index.esm.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)
*/
