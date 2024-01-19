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

  // src/lib/helpers.ts
  var isNumber = (thing) => !Number.isNaN(thing) && typeof thing === "number" && thing !== Infinity;
  var isNumberString = (thing) => typeof thing === "string" && !Number.isNaN(Number(thing)) && thing !== "Infinity";
  var isString = (thing) => typeof thing === "string";
  var isStringWithValue = (thing) => isString(thing) && thing.trim().length > 0;
  var isStringOrNumber = (thing) => isStringWithValue(thing) || isNumber(thing);
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
  var getPixelsFromLatLng = (map2, position) => {
    const projection = map2.getProjection();
    const bounds = map2.getBounds();
    const topRight = projection.fromLatLngToPoint(bounds.getNorthEast());
    const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest());
    const scale = 2 ** map2.getZoom();
    const worldPoint = projection.fromLatLngToPoint(position);
    return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
  };

  // src/lib/Point.ts
  var Point = class {
    /**
     * Constructor
     *
     * @param {XPoint} x The X value
     * @param {number|string} y The Y value
     */
    constructor(x, y) {
      if (Array.isArray(x)) {
        if ((isNumber(x[0]) || isNumberString(x[0])) && (isNumber(x[1]) || isNumberString(x[1]))) {
          if (isNumberString(x[0])) {
            this.x = Number(x[0]);
          } else {
            [this.x] = x;
          }
          if (isNumberString(x[1])) {
            this.y = Number(x[1]);
          } else {
            this.y = x.pop();
          }
        } else {
          throw new Error("Invalid x/y pair");
        }
      } else if (isObject(x)) {
        const xObject = x;
        if (typeof xObject.x === "undefined" || !isNumber(xObject.x) || !isNumberString(xObject.x) || typeof xObject.y === "undefined" || !isNumber(xObject.y) || !isNumberString(xObject.y)) {
          throw new Error("Invalid x/y pair");
        }
        if (isNumberString(xObject.x)) {
          this.x = Number(xObject.x);
        } else {
          this.x = xObject.x;
        }
        if (isNumberString(xObject.y)) {
          this.y = Number(xObject.y);
        } else {
          this.y = xObject.y;
        }
      } else {
        if (isNumberString(x)) {
          this.x = Number(x);
        } else {
          this.x = x;
        }
        if (isNumberString(y)) {
          this.y = Number(y);
        } else {
          this.y = y;
        }
      }
      this.pointObject = new google.maps.Point(this.x, this.y);
    }
    /**
     * Returns the Google maps point object
     *
     * @link https://developers.google.com/maps/documentation/javascript/reference/coordinates#Point
     * @returns {google.maps.Point}
     */
    get() {
      return this.pointObject;
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
  };
  var point = (x, y) => {
    if (x instanceof Point) {
      return x;
    }
    return new Point(x, y);
  };

  // src/lib/Size.ts
  var Size = class {
    /**
     * Constructor
     *
     * @param {WidthSize} width The X value
     * @param {number|string} height The Y value
     */
    constructor(width, height) {
      if (Array.isArray(width)) {
        const [w, h] = width;
        if ((isNumber(w) || isNumberString(w)) && (isNumber(h) || isNumberString(h))) {
          if (isNumberString(w)) {
            this.width = Number(w);
          } else {
            this.width = w;
          }
          if (isNumberString(h)) {
            this.height = Number(h);
          } else {
            this.height = h;
          }
        } else {
          throw new Error("Invalid width/height pair");
        }
      } else if (isObject(width)) {
        const widthObject = width;
        if (typeof widthObject.width === "undefined" || !isNumber(widthObject.width) && !isNumberString(widthObject.width) || typeof widthObject.height === "undefined" || !isNumber(widthObject.height) && !isNumberString(widthObject.height)) {
          throw new Error("Invalid width/height pair");
        }
        if (isNumberString(widthObject.width)) {
          this.width = Number(widthObject.width);
        } else {
          this.width = widthObject.width;
        }
        if (isNumberString(widthObject.height)) {
          this.height = Number(widthObject.height);
        } else {
          this.height = widthObject.height;
        }
      } else {
        if (isNumberString(width)) {
          this.width = Number(width);
        } else {
          this.width = width;
        }
        if (isNumberString(height)) {
          this.height = Number(height);
        } else {
          this.height = height;
        }
      }
      this.sizeObject = new google.maps.Size(this.width, this.height);
    }
    /**
     * Returns the size object
     *
     * @link https://developers.google.com/maps/documentation/javascript/reference/coordinates#Size
     * @returns {google.maps.Size}
     */
    get() {
      return this.sizeObject;
    }
    /**
     * Get the height value
     *
     * @returns {number}
     */
    getHeight() {
      return this.height;
    }
    /**
     * Get the width value
     *
     * @returns {number}
     */
    getWidth() {
      return this.width;
    }
  };
  var size = (width, height) => {
    if (width instanceof Size) {
      return width;
    }
    return new Size(width, height);
  };

  // src/lib/Icon.ts
  var Icon = class {
    /**
     * Constructor
     *
     * @param {string | IconOptions} url The URL for the icon or the icon options
     * @param {IconOptions} [options] The icon options
     */
    constructor(url, options) {
      if (typeof url === "string") {
        this.options = {
          url
        };
        if (isObject(options)) {
          this.setOptions(options);
        }
      } else if (isObject(url) && typeof url.url === "string") {
        this.options = { url: url.url };
        this.setOptions(url);
      }
    }
    /**
     * Set the icon options
     *
     * @param {IconOptions} options The icon options
     */
    setOptions(options) {
      if (options?.anchor) {
        this.options.anchor = point(options.anchor).get();
      }
      if (options?.labelOrigin) {
        this.options.labelOrigin = point(options.labelOrigin).get();
      }
      if (options?.origin) {
        this.options.origin = point(options.origin).get();
      }
      if (options?.scaledSize) {
        this.options.scaledSize = size(options.scaledSize).get();
      }
      if (options?.size) {
        this.options.size = size(options.size).get();
      }
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
     * icon.anchor([10, 32]);
     *
     * Valid values are:
     * icon.anchor([10, 32]);
     * icon.anchor({x: 10, y: 32});
     * icon.anchor(pointClassInstance);
     *
     * @param {PointValue} anchor The anchor point value
     * @returns {Icon}
     */
    anchor(anchor) {
      this.options.anchor = point(anchor).get();
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
     * icon.labelOrigin([10, 32]);
     *
     * Valid values are:
     * icon.labelOrigin([10, 32]);
     * icon.labelOrigin({x: 10, y: 32});
     * icon.labelOrigin(pointClassInstance);
     *
     * @param {PointValue} origin The label origin point value
     * @returns {Icon}
     */
    labelOrigin(origin) {
      this.options.labelOrigin = point(origin).get();
      return this;
    }
    /**
     * Set the position of the image within a sprite, if any. By default, the origin is located at the top left corner of the image (0, 0).
     * Use this if for some reason you didn't pass the origin in the icon options.
     *
     * const icon = G.icon({
     *    url: 'https://mywebsite.com/images/marker.png',
     * });
     * icon.origin([10, 32]);
     *
     * Valid values are:
     * icon.origin([10, 32]);
     * icon.origin({x: 10, y: 32});
     * icon.origin(pointClassInstance);
     *
     * @param {PointValue} origin The origin point value
     * @returns {Icon}
     */
    origin(origin) {
      this.options.origin = point(origin).get();
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
     * icon.scaledSize([40, 64]).scaledSize([20, 32]));
     *
     * Valid values are:
     * icon.scaledSize([10, 32]);
     * icon.scaledSize({x: 10, y: 32});
     * icon.scaledSize(sizeClassInstance);
     *
     * @param {SizeValue} sizeValue The size value
     * @returns {Icon}
     */
    scaledSize(sizeValue) {
      this.options.scaledSize = size(sizeValue).get();
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
     * icon.size([20, 32]);
     *
     * Valid values are:
     * icon.size([10, 32]);
     * icon.size({x: 10, y: 32});
     * icon.size(sizeClassInstance);
     *
     * If you're using an SVG you should set a size if the desired size is different from the height and width attributes of the SVG.
     *
     * @param {SizeValue} sizeValue The size value
     * @returns {Icon}
     */
    size(sizeValue) {
      this.options.size = size(sizeValue).get();
      return this;
    }
    /**
     * Get the icon options
     *
     * @returns {google.maps.Icon}
     */
    get() {
      return this.options;
    }
  };
  var icon = (url, options) => {
    if (url instanceof Icon) {
      return url;
    }
    return new Icon(url, options);
  };

  // src/lib/LatLng.ts
  var LatLng = class {
    /**
     * Constructor
     *
     * @param {Latitude} latitude The latitude value or the latitude/longitude pair
     * @param {number|string} [longitude] The longitude value
     */
    constructor(latitude, longitude) {
      if (Array.isArray(latitude)) {
        const [lat, lng] = latitude;
        if ((isNumber(lat) || isNumberString(lat)) && (isNumber(lng) || isNumberString(lng))) {
          if (isNumberString(lat)) {
            this.latitude = Number(lat);
          } else {
            this.latitude = lat;
          }
          if (isNumberString(lng)) {
            this.longitude = Number(lng);
          } else {
            this.longitude = lng;
          }
        } else {
          throw new Error("Invalid latitude/longitude pair");
        }
      } else if (isObject(latitude)) {
        if (typeof latitude.lat !== "undefined" && typeof latitude.lng !== "undefined") {
          const latObject = latitude;
          if (!isNumber(latObject.lat) && !isNumberString(latObject.lat) && !isNumber(latObject.lng) && !isNumberString(latObject.lng)) {
            throw new Error("Invalid latitude/longitude pair");
          }
          if (isNumberString(latObject.lat)) {
            this.latitude = Number(latObject.lat);
          } else {
            this.latitude = latObject.lat;
          }
          if (isNumberString(latObject.lng)) {
            this.longitude = Number(latObject.lng);
          } else {
            this.longitude = latObject.lng;
          }
        } else if (typeof latitude.latitude !== "undefined" && typeof latitude.longitude !== "undefined") {
          const latObject = latitude;
          if (!isNumber(latObject.latitude) || !isNumberString(latObject.latitude) || !isNumber(latObject.longitude) || !isNumberString(latObject.longitude)) {
            throw new Error("Invalid latitude/longitude pair");
          }
          if (isNumberString(latObject.latitude)) {
            this.latitude = Number(latObject.latitude);
          } else {
            this.latitude = latObject.latitude;
          }
          if (isNumberString(latObject.longitude)) {
            this.longitude = Number(latObject.longitude);
          } else {
            this.longitude = latObject.longitude;
          }
        } else {
          throw new Error("Invalid latitude/longitude object pair");
        }
      } else {
        if (isNumberString(latitude)) {
          this.latitude = Number(latitude);
        } else {
          this.latitude = latitude;
        }
        if (isNumberString(longitude)) {
          this.longitude = Number(longitude);
        } else {
          this.longitude = longitude;
        }
      }
      this.latLngObject = new google.maps.LatLng(this.latitude, this.longitude);
    }
    /**
     * Returns the longitude value
     *
     * @returns {number}
     */
    lat() {
      return this.latitude;
    }
    /**
     * Returns the latitude value
     *
     * @returns {number}
     */
    lng() {
      return this.longitude;
    }
    /**
     * Get the Google maps LatLng object
     *
     * @link https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
     * @returns {google.maps.LatLng}
     */
    get() {
      return this.latLngObject;
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
  var latLng = (latitude, longitude) => {
    if (latitude instanceof LatLng) {
      return latitude;
    }
    return new LatLng(latitude, longitude);
  };

  // src/lib/LatLngBounds.ts
  var LatLngBounds = class {
    /**
     * Constructor
     *
     * @param {LatLngValue} [latLngValue] The latitude/longitude value. If not set then add points with the extend method.
     *      See comments on the extended method for the types of values that latLngValue can be.
     */
    constructor(latLngValue) {
      this.bounds = new google.maps.LatLngBounds();
      if (latLngValue) {
        this.extend(latLngValue);
      }
    }
    /**
     * Extends this bounds to contain the given point
     *
     * @link https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds.extend
     *
     * The latLngValue parameter can be:
     * - a LatLngBounds object
     * - an array of [lat, lng] pairs: [[lat, lng], [lat, lng], ...]
     * - an array of {lat, lng} objects (LatLngLiteral[]): [{lat, lng}, {lat, lng}, ...]
     * - an array of LatLng objects: [LatLng, LatLng, ...]
     * - a LatLng object
     * - a [lat, lng] pair
     * - a {lat, lng} object (LatLngLiteral)
     *
     * @param {LatLngValue} latLngValue The latitude/longitude value
     */
    extend(latLngValue) {
      if (latLngValue instanceof LatLng) {
        this.bounds.extend(latLngValue.get());
      } else if (Array.isArray(latLngValue) && latLngValue.length === 2) {
        this.bounds.extend(latLng(latLngValue).get());
      } else {
        throw new Error("Invalid latitude/longitude pair");
      }
    }
    /**
     * Get the Google maps LatLngBounds object
     *
     * @returns {google.maps.LatLngBounds}
     */
    get() {
      return this.bounds;
    }
  };
  var latLngBounds = (latLngValue) => {
    if (latLngValue instanceof LatLngBounds) {
      return latLngValue;
    }
    if (Array.isArray(latLngValue) && Array.isArray(latLngValue[0]) && latLngValue[0].length === 2) {
      const bounds = new LatLngBounds();
      const value = latLngValue;
      value.forEach((latLngVal) => {
        bounds.extend(latLngVal);
      });
      return bounds;
    }
    return new LatLngBounds(latLngValue);
  };

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

  // src/lib/Map.ts
  var Map = class {
    /**
     * Class constructor
     *
     * @param {string} id The id of the element that the map will be rendered in
     * @param {MapOptions} options The options object for the map
     */
    constructor(id, options) {
      if (!isObject(options) || typeof options.apiKey !== "string") {
        throw new Error("Invalid map options");
      }
      this.id = id;
      this.apiKey = options.apiKey;
      this.libraries = options.libraries ?? [];
      this.version = options.version ?? "weekly";
      const defaultConfig = {
        zoom: 8
      };
      const config = { ...defaultConfig, ...options };
      delete config.apiKey;
      delete config.libraries;
      delete config.version;
      this.mapOptions = {
        center: {
          lat: config.latitude,
          lng: config.longitude
        },
        rotateControl: true,
        zoom: config.zoom
      };
    }
    /**
     * Load and display the map
     */
    load(callback) {
      const loader = new Loader({
        apiKey: this.apiKey,
        libraries: this.libraries,
        version: this.version
      });
      loader.importLibrary("maps").then((google2) => {
        this.map = new google2.Map(document.getElementById(this.id), this.mapOptions);
        if (typeof callback === "function") {
          callback();
        }
      }).catch((err) => {
        console.error(err);
      });
    }
    /**
     * Returns the Google map object
     *
     * @returns {google.maps.Map}
     */
    get() {
      return this.map;
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
     *
     * @param {LatLngBoundsValue} bounds The bounds to fit
     */
    fitBounds(bounds) {
      if (bounds instanceof LatLngBounds) {
        this.map.fitBounds(bounds.get());
      }
      this.map.fitBounds(latLngBounds(bounds).get());
    }
  };
  var map = (id, config) => new Map(id, config);

  // src/lib/Marker.ts
  var Marker = class {
    /**
     * Constructor
     *
     * @param {LatLngValue|MarkerOptions} latLngValue The latitude longitude pair
     * @param {MarkerOptions} [options] The marker options
     */
    constructor(latLngValue, options) {
      /**
       * The class name for the tooltip element
       * @type {string}
       */
      this.tooltipClass = "tooltip";
      if (latLngValue instanceof LatLng) {
        this.latLng = latLngValue;
      } else if (Array.isArray(latLngValue)) {
        this.latLng = latLng(latLngValue);
      } else if (isObject(latLngValue) && typeof latLngValue.lat !== "undefined" && typeof latLngValue.lng !== "undefined") {
        this.latLng = latLng(latLngValue);
      } else if (isObject(latLngValue) && typeof latLngValue.latitude !== "undefined" && typeof latLngValue.longitude !== "undefined") {
        this.latLng = latLng(latLngValue);
      } else {
        throw new Error("Invalid latitude/longitude value for the marker");
      }
      const markerOptions = {
        position: this.latLng.toJson()
      };
      let opts = {};
      if (isObject(latLngValue)) {
        opts = latLngValue;
      } else if (isObject(options)) {
        opts = options;
      }
      if (opts.title && opts.tooltipContainer) {
        this.title = opts.title;
        const container = document.querySelector(opts.tooltipContainer);
        if (container) {
          this.tooltipContainer = container;
        } else {
          throw new Error("Invalid tool tip container selector");
        }
        if (opts.tooltipClass) {
          this.tooltipClass = opts.tooltipClass;
        }
      } else if (opts.title) {
        markerOptions.title = opts.title;
      }
      if (opts.icon) {
        markerOptions.icon = icon(opts.icon).get();
      }
      if (isStringWithValue(opts.label)) {
        markerOptions.label = opts.label;
      } else if (isObject(opts.label) && isStringOrNumber(opts.label.text)) {
        markerOptions.label = {
          text: opts.label.text.toString(),
          className: isStringWithValue(opts.label.className) ? opts.label.className : void 0,
          color: isStringWithValue(opts.label.color) ? opts.label.color : void 0,
          fontFamily: isStringWithValue(opts.label.fontFamily) ? opts.label.fontFamily : void 0,
          fontWeight: isStringWithValue(opts.label.fontWeight) ? opts.label.fontWeight : void 0
        };
        if (isStringWithValue(opts.label.fontSize) || isNumber(opts.label.fontSize)) {
          if (isNumber(opts.label.fontSize)) {
            markerOptions.label.fontSize = `${opts.label.fontSize}px`;
          } else {
            markerOptions.label.fontSize = opts.label.fontSize.toString();
          }
        }
      }
      if (opts.map) {
        if (opts.map instanceof Map) {
          markerOptions.map = opts.map.get();
        } else if (opts.map instanceof google.maps.Map) {
          markerOptions.map = opts.map;
        }
      }
      this.marker = new google.maps.Marker(markerOptions);
      if (this.tooltipContainer) {
        this.tooltip = document.createElement("div");
        this.tooltip.classList.add(this.tooltipClass);
        this.tooltip.innerHTML = this.title;
        this.tooltip.style.position = "absolute";
        this.marker.addListener("mouseover", () => {
          const pixels = getPixelsFromLatLng(this.marker.getMap(), this.marker.getPosition());
          this.tooltip.style.left = `${pixels.x}px`;
          this.tooltip.style.top = `${pixels.y}px`;
          this.tooltipContainer.appendChild(this.tooltip);
        });
        this.marker.addListener("mouseout", () => {
          this.tooltipContainer.removeChild(this.tooltip);
        });
      }
    }
    /**
     * Adds the marker to the Google map object
     *
     * @param {Map|google.maps.Map} map The map object
     */
    addTo(map2) {
      if (map2 instanceof Map) {
        this.marker.setMap(map2.get());
      } else if (map2 instanceof google.maps.Map) {
        this.marker.setMap(map2);
      }
    }
    /**
     * Get the LatLng object
     *
     * @link https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
     * @returns {LatLng}
     */
    getLatLng() {
      return this.latLng;
    }
    /**
     * Get the Google maps marker object
     *
     * @link https://developers.google.com/maps/documentation/javascript/reference/marker#Marker
     * @returns {google.maps.Marker}
     */
    get() {
      return this.marker;
    }
  };
  var marker = (latLngValue, options) => {
    if (latLngValue instanceof Marker) {
      return latLngValue;
    }
    return new Marker(latLngValue, options);
  };

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
    constructor() {
      /**
       * The colors to use for the clusters.
       */
      this.colors = {
        0: "#0000ff"
      };
      /**
       * The color to use for the cluster if it has more than the average number of markers in a cluster.
       */
      this.averageColor = "#ff0000";
      /**
       * The opacity to use for the center of the marker
       *
       * @type {number}
       */
      this.centerOpacity = 0.7;
      /**
       * The opacity to use for the middle ring of the marker
       *
       * @type {number}
       */
      this.middleOpacity = 0.4;
      /**
       * The opacity to use for the outer ring of the marker
       *
       * @type {number}
       */
      this.outerOpacity = 0.2;
      /**
       * Holds the font family for the cluster marker label
       *
       * @type {string}
       */
      this.labelFontFamily = "roboto,arial,sans-serif";
      /**
       * Holds the font size for the cluster marker
       *
       * @type {string}
       */
      this.labelFontSize = "12px";
      /**
       * Holds if the number of markers in the cluster should be displayed
       *
       * @type {boolean}
       */
      this.showNumber = true;
    }
    /**
     * Set the color to use for the cluster if it has more than the average number of markers in a cluster,
     * and the fallback color to use if it has less than the average number of markers in a cluster.
     *
     * @param {string} color The color to use if the cluster has more than the average number of markers in a cluster.
     * @param {string} fallback The color to use if the cluster has less than the average number of markers in a cluster.
     */
    setAverageColor(color, fallback) {
      this.averageColor = color;
      this.colors = { 0: fallback };
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
          this.colors = sortedColors;
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
        this.centerOpacity = opacity;
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
        this.middleOpacity = opacity;
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
        this.outerOpacity = opacity;
      }
    }
    /**
     * Set the font family to use for the cluster marker
     *
     * @param {string} fontFamily The font family to use for the cluster marker
     */
    setFontFamily(fontFamily) {
      this.labelFontFamily = fontFamily;
    }
    /**
     * Set the font size to use for the cluster marker
     *
     * @param {number} fontSize The font size to use for the cluster marker
     */
    setFontSize(fontSize) {
      if (isString(fontSize)) {
        this.labelFontSize = fontSize;
      } else if (isNumber(fontSize)) {
        this.labelFontSize = `${fontSize}px`;
      }
    }
    /**
     * Sets if the number of markers in the cluster should be displayed
     *
     * @param {boolean} showNumber Whether to show the number of markers in the cluster
     */
    setShowNumber(showNumber) {
      this.showNumber = getBoolean(showNumber);
    }
    /**
     * Get the color for the cluster.
     *
     * @param {number} count The number of markers in the cluster.
     * @returns {ClusterColor}
     */
    getColor(count, mean) {
      const keys = Object.keys(this.colors);
      let color = this.colors[keys[0]];
      let bgColor = typeof color === "string" ? color : color.bgColor;
      let textColor = color.textColor ?? "#ffffff";
      if (typeof this.averageColor === "string" && count >= Math.max(parseInt(keys[keys.length - 1], 10), mean)) {
        bgColor = this.averageColor;
      } else {
        for (let i = 0; i < keys.length; i += 1) {
          const k = keys[i];
          if (count >= parseInt(k, 10)) {
            color = this.colors[k];
            if (typeof color === "string") {
              bgColor = color;
            } else {
              bgColor = color.bgColor;
              if (color.textColor) {
                textColor = color.textColor;
              }
            }
          } else {
            break;
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
     * @param {ClusterStatus} stats The status for all of the clusters
     * @param {google.maps.Map} map The map object
     * @returns {google.maps.Marker | google.maps.marker.AdvancedMarkerElement}
     */
    render(cluster, stats, map2) {
      const { count, position } = cluster;
      const color = this.getColor(count, stats.clusters.markers.mean);
      const svg = `<svg fill="${color.bgColor}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50" height="50">
                <circle cx="25" cy="25" opacity="${this.centerOpacity}" r="16" />
                <circle cx="25" cy="25" opacity="${this.middleOpacity}" r="22" />
                <circle cx="25" cy="25" opacity="${this.outerOpacity}" r="25" />
                <text x="50%" y="50%" style="fill:${color.textColor}" text-anchor="middle" font-size="${this.labelFontSize}" dominant-baseline="middle" font-family="${this.labelFontFamily}">${this.showNumber ? count : ""}</text>
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
    constructor() {
      /**
       * Holds the images that can be used for the marker cluster icons
       *
       * @type {ClusterImages}
       */
      this.images = {};
      /**
       * Holds if the number of markers in the cluster should be displayed
       *
       * @type {boolean}
       */
      this.showNumber = true;
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
          this.images = sortedImages;
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
        this.images = { 0: image };
      }
    }
    /**
     * Set the class name to use for the label
     *
     * @param {string} labelClassName The class name to use for the label
     */
    setLabelClassName(labelClassName) {
      this.labelClassName = labelClassName;
    }
    /**
     * Set the color of the label text
     *
     * @param {string} labelColor The color of the label text. Default color is black.
     */
    setLabelColor(labelColor) {
      this.labelColor = labelColor;
    }
    /**
     * Set the font family to use for the cluster marker
     *
     * @param {string} fontFamily The font family to use for the cluster marker
     */
    setLabelFontFamily(fontFamily) {
      this.labelFontFamily = fontFamily;
    }
    /**
     * Set the font size to use for the cluster marker
     *
     * @param {string|number} fontSize The font size to use for the cluster marker
     */
    setLabelFontSize(fontSize) {
      if (isStringOrNumber(fontSize)) {
        this.labelFontSize = fontSize;
      }
    }
    /**
     * Set the font weight to use for the cluster marker
     *
     * @param {string} labelFontWeight The font weight to use for the cluster marker
     */
    setLabelFontWeight(labelFontWeight) {
      this.labelFontWeight = labelFontWeight;
    }
    /**
     * Sets if the number of markers in the cluster should be displayed
     *
     * @param {boolean} showNumber Whether to show the number of markers in the cluster
     */
    setShowNumber(showNumber) {
      this.showNumber = getBoolean(showNumber);
    }
    /**
     * Get the image for the cluster.
     *
     * @param {number} count The number of markers in the cluster.
     * @returns {ClusterImage}
     */
    getImage(count) {
      const keys = Object.keys(this.images);
      let image = this.images[keys[0]];
      for (let i = 0; i < keys.length; i += 1) {
        const k = keys[i];
        if (count >= parseInt(k, 10)) {
          image = this.images[k];
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
     * @param {ClusterStatus} stats The status for all of the clusters
     * @param {google.maps.Map} map The map object
     * @returns {google.maps.Marker}
     */
    render(cluster, stats, map2) {
      const { count, position } = cluster;
      const image = this.getImage(count);
      const markerImage = icon(typeof image === "string" ? image : image.url);
      if (image.width && image.height) {
        markerImage.size([image.width, image.height]);
      } else if (image.size) {
        markerImage.size(image.size);
      }
      if (image.scaledWidth && image.scaledHeight) {
        markerImage.scaledSize([image.scaledWidth, image.scaledHeight]);
      } else if (image.scaledSize) {
        markerImage.scaledSize(image.scaledSize);
      }
      const label = { text: count.toString() };
      if (this.labelClassName) {
        label.className = this.labelClassName;
      } else if (image.labelClassName) {
        label.className = image.labelClassName;
      }
      if (this.labelColor) {
        label.color = this.labelColor;
      } else if (image.labelColor) {
        label.color = image.labelColor;
      }
      if (this.labelFontFamily) {
        label.fontFamily = this.labelFontFamily;
      } else if (image.labelFontFamily) {
        label.fontFamily = image.labelFontFamily;
      }
      if (this.labelFontSize) {
        label.fontSize = this.labelFontSize.toString();
      } else if (image.labelFontSize) {
        label.fontSize = image.labelFontSize;
      }
      if (this.labelFontWeight) {
        label.fontWeight = this.labelFontWeight;
      } else if (image.labelFontWeight) {
        label.fontWeight = image.labelFontWeight;
      }
      const clusterMarker = marker({
        lat: position.lat(),
        lng: position.lng(),
        icon: markerImage,
        map: map2,
        label: this.showNumber ? label : void 0
      });
      return clusterMarker.get();
    }
  };

  // src/lib/MarkerCluster.ts
  var MarkerCluster = class {
    /**
     * The constructor for the MarkerCluster class
     *
     * @param {Map} map The map object
     * @param {Marker[]|MarkerClusterOptions} [markers] Markers to cluster. You can also use addMarker() instead of adding the markers here.
     * @param {MarkerClusterOptions} [options] Options for the marker clusterer
     */
    constructor(map2, markers, options) {
      const clusterOptions = {
        map: map2.get()
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
        if (Object.keys(algorithmOptions).length > 0) {
          clusterOptions.onClusterClick = optionsToUse.onClusterClick;
        }
        if (typeof optionsToUse.renderer !== "undefined") {
          clusterOptions.renderer = optionsToUse.renderer;
        } else if (isObject(optionsToUse.defaultRenderOptions)) {
          const renderer = new DefaultRenderer2();
          const renderOptions = optionsToUse.defaultRenderOptions;
          if (isObject(renderOptions.colors)) {
            renderer.setColors(renderOptions.colors);
          } else if (typeof renderOptions.averageColor === "string" && typeof renderOptions.averageFallbackColor === "string") {
            renderer.setAverageColor(renderOptions.averageColor, renderOptions.averageFallbackColor);
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
      this.clusterer = new MarkerClusterer(clusterOptions);
      if (Array.isArray(markers)) {
        markers.forEach((marker2) => {
          if (marker2 instanceof Marker) {
            this.clusterer.addMarker(marker2.get(), true);
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
     */
    addMarker(marker2, draw = true) {
      this.clusterer.addMarker(marker2.get(), !draw);
    }
    /**
     * Add multiple markers to the cluster
     *
     * @param {Marker[]} markers The array of markers to add
     * @param {boolean} draw Whether to redraw the clusters after adding the marker.
     *      Default is true. Note, this is opposite of the MarkerClusterer library.
     */
    addMarkers(markers, draw = true) {
      const markersToAdd = [];
      markers.forEach((marker2) => {
        if (marker2 instanceof Marker) {
          markersToAdd.push(marker2.get());
        }
      });
      this.clusterer.addMarkers(markersToAdd, !draw);
    }
    /**
     *
     * @param marker The marker to remove
     * @param {boolean} draw Whether to redraw the clusters after removing the marker.
     *      Default is true. Note, this is opposite of the MarkerClusterer library.
     */
    removeMarker(marker2, draw = false) {
      this.clusterer.removeMarker(marker2.get(), !draw);
    }
    /**
     * Clears all of the markers
     *
     * @param {boolean} draw Whether to redraw the clusters after removing all the markers.
     *      Default is true. Note, this is opposite of the MarkerClusterer library.
     */
    clearMarkers(draw = true) {
      this.clusterer.clearMarkers(!draw);
    }
    /**
     * Force a recalculation and redraw of all the marker clusters.
     */
    render() {
      this.clusterer.render();
    }
  };
  var markerCluster = (map2, markers, options) => new MarkerCluster(map2, markers, options);

  // src/index.ts
  var G = {
    icon,
    latLng,
    latLngBounds,
    map,
    marker,
    markerCluster,
    point,
    size
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
