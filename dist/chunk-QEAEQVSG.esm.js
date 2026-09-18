import {
  Base_default,
  LatLng,
  Layer_default,
  Map,
  PolylineEvents,
  checkForGoogleMaps,
  getSizeWithUnit,
  isBoolean,
  isDefined,
  isNullOrUndefined,
  isNumber,
  isNumberOrNumberString,
  isNumberString,
  isObject,
  isObjectWithValues,
  isStringWithValue,
  latLng,
  loader,
  objectHasValue,
  svgSymbol
} from "./chunk-7O6XY2MX.esm.js";

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
  set icon(icon) {
    this.#options.icon = svgSymbol(icon);
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
  setIcon(icon) {
    this.icon = icon;
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
        const point = latLng(value);
        if (point.isValid()) {
          latitude = point.latitude;
          longitude = point.longitude;
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
var EMPTY_COORDS = new Float64Array(0);
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
   * Holds whether the polyline was hidden when it was added to the map, so the Google polyline
   * hasn't been created yet.
   *
   * A polyline that is hidden isn't drawn, so nothing is created for it until it's first shown.
   * This saves the work for polylines that start out hidden, like ones that a filter leaves out.
   *
   * @private
   * @type {boolean}
   */
  #isCreationDeferred = false;
  /**
   * Holds whether the "ready" event has been dispatched
   *
   * @private
   * @type {boolean}
   */
  #isReadyDispatched = false;
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
        this.#options.icons.map((icon) => icon.toGoogle())
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
      if (value && this.#isCreationDeferred) {
        this.#isCreationDeferred = false;
        const map = this.#requestedMap;
        this.#setupGooglePolyline(map ?? void 0).then((googlePolyline) => {
          if (map && this.#options.map === map) {
            googlePolyline.setMap(map.toGoogle() ?? null);
          }
        });
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
      if (this.#polyline) {
        resolve();
        return;
      }
      this.#dispatchReady();
      resolve();
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
    if (value instanceof Map) {
      if (!this.#polyline && isVisible === false) {
        this.visible = isVisible;
        this.#options.map = value;
        super.setMap(value);
        this.#isCreationDeferred = true;
        this.#dispatchReady();
        return this;
      }
      const googlePolyline = await this.#setupGooglePolyline(value);
      this.visible = isVisible;
      this.#options.map = value;
      super.setMap(value);
      googlePolyline.setMap(value.toGoogle() ?? null);
    } else if (isNullOrUndefined(value)) {
      this.#isCreationDeferred = false;
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
      if (typeof options.visible === "boolean") {
        this.visible = options.visible;
      }
      if (options.map) {
        this.setMap(options.map, this.#options.visible !== false);
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
  show(map) {
    return new Promise((resolve) => {
      this.visible = true;
      if (map) {
        this.setMap(map).then(() => {
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
    const isDebug = this.#isSimplifyDebug();
    const start = isDebug ? performance.now() : 0;
    const coords = this.#pathCoords ?? EMPTY_COORDS;
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
    if (isDebug) {
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
   * Whether two drawn paths hold the same points.
   *
   * The point count is checked first because that alone separates most paths for almost
   * nothing. Only paths that are the same length are compared point by point.
   *
   * @private
   * @param {google.maps.LatLng[]} a The first path
   * @param {google.maps.LatLng[]} b The second path
   * @returns {boolean}
   */
  static #isSamePath(a, b) {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i += 1) {
      if (a[i].lat() !== b[i].lat() || a[i].lng() !== b[i].lng()) {
        return false;
      }
    }
    return true;
  }
  /**
   * Update the path drawn on the map if the simplify tolerance to use has changed.
   *
   * If the polyline is hidden then the path isn't updated until the polyline is shown again.
   * This saves simplifying the paths of hidden polylines, for example ones hidden with PolylineCollection.hide(),
   * each time the zoom level changes.
   *
   * A different tolerance often draws the same points. A short segment simplifies to its two
   * end points at every tolerance, so moving between zoom buckets used to hand Google an
   * identical path over and over. setPath is the expensive half of a tolerance change, so it's
   * skipped when the path that would be drawn matches the one already drawn.
   *
   * @private
   * @returns {boolean} Whether the tolerance changed and was applied. The path may not have
   *      been sent to Google, if the new tolerance draws the same points as the old one.
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
    const drawnPath = this.#simplifiedPaths[this.#simplifyTolerance];
    this.#simplifyTolerance = tolerance;
    if (this.#polyline) {
      const googlePath = this.#getGooglePath();
      if (!drawnPath || !_Polyline.#isSamePath(drawnPath, googlePath)) {
        this.#polyline.setPath(googlePath);
      }
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
    const map = this.#simplifyConfig && this.#simplifyConfig.zoom.length > 0 ? this.#requestedMap : null;
    if (map === this.#zoomListenerMap) {
      return;
    }
    if (this.#zoomListenerMap) {
      this.#zoomListenerMap.off("idle", this.#handleMapIdle);
    }
    if (map) {
      map.on("idle", this.#handleMapIdle);
    }
    this.#zoomListenerMap = map;
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
      const map = this.getMap();
      const setup = map ? highlight.setMap(map, false) : Promise.resolve();
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
          const icon = polylineIcon({
            icon: lineSymbol,
            offset: "0",
            repeat: this.#dashGap
          });
          options.icons = [await icon.toGoogle()];
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
  #setupGooglePolyline(map) {
    return new Promise((resolve) => {
      if (!isObject(this.#polyline)) {
        if (checkForGoogleMaps("Polyline", "Polyline", false)) {
          const googlePolyline = this.#createPolylineObject();
          this.#dispatchReady();
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
            this.#dispatchReady();
            resolve(googlePolyline);
          });
          if (map instanceof Map) {
            map.init();
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
   * Dispatch the event to say that the polyline is ready.
   *
   * It's only dispatched once. A polyline that is hidden when it's added to the map says that it's
   * ready before the Google polyline is created, so that tooltips and popups can set up their events.
   *
   * @private
   */
  #dispatchReady() {
    if (!this.#isReadyDispatched) {
      this.#isReadyDispatched = true;
      this.dispatch(PolylineEvents.READY);
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
      this.#isCreationDeferred = false;
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
      const hasIcons = Array.isArray(this.#options.icons) && this.#options.icons.length > 0;
      if (this.#dashed || hasIcons) {
        this.#setupIconsAndDashedPolylineOptions().then((opts) => {
          googlePolyline.setOptions(opts);
          this.setEventGoogleObject(googlePolyline);
        });
      } else {
        this.setEventGoogleObject(googlePolyline);
      }
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

export {
  PolylineIcon,
  polylineIcon,
  DEFAULT_SIMPLIFY_TOLERANCE,
  DEFAULT_SIMPLIFY_ZOOM,
  simplifyPath,
  Polyline,
  polyline
};
