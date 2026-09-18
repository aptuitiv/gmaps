import {
  Icon,
  LatLng,
  Layer_default,
  Map,
  MarkerEvents,
  SvgSymbol,
  checkForGoogleMaps,
  icon,
  isBoolean,
  isNullOrUndefined,
  isNumber,
  isNumberOrNumberString,
  isObject,
  isString,
  isStringOrNumber,
  isStringWithValue,
  latLng,
  loader,
  objectHasValue,
  point,
  svgSymbol
} from "./chunk-IDBS76XJ.esm.js";

// src/lib/Marker.ts
var STRING_OPTIONS = ["cursor"];
var GOOGLE_OPTIONS_TO_SET = ["cursor", "title"];
var RESOLVED = Promise.resolve();
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
   * Holds whether the marker was hidden when it was added to the map, so the Google marker
   * hasn't been created yet.
   *
   * A marker that isn't visible isn't drawn, so nothing is created for it until it's first
   * shown. This saves the work for markers that start out hidden, like ones a filter leaves out.
   *
   * @private
   * @type {boolean}
   */
  #isCreationDeferred = false;
  /**
   * Holds if the marker is setting up
   *
   * @private
   * @type {boolean}
   */
  #isSettingUp = false;
  /**
   * The marker creation that is currently running, if there is one.
   *
   * Anything that has to wait for the marker waits on this rather than on the "ready" event.
   * They aren't the same thing: init() dispatches "ready" without creating a marker, so that a
   * tooltip or popup can set up its events without forcing one to be built. A waiter that
   * listened for "ready" could therefore be woken by that early event and carry on to use
   * #marker while it was still undefined.
   *
   * Cleared once creation settles, so that a later call takes the normal path.
   *
   * @private
   * @type {Promise<void>|undefined}
   */
  #creationPromise;
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
   * The position is only set once there is a real one. It used to default to a 0,0 LatLng,
   * which meant every marker built a LatLng object that was thrown away as soon as a position
   * was set - and almost every marker has one. The position getter creates the 0,0 default if
   * something asks for a position that was never set.
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
    if (this.#drag && this.#marker) {
      return latLng(this.#marker.getPosition() ?? void 0);
    }
    if (isNullOrUndefined(this.#options.position)) {
      this.#options.position = latLng([0, 0]);
    }
    return this.#options.position;
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
   * Get whether the marker is visible on the map
   *
   * @returns {boolean | undefined} Undefined if it hasn't been set, which means visible
   */
  get visible() {
    return this.#options.visible;
  }
  /**
   * Set whether the marker is visible on the map
   *
   * @param {boolean} value Whether the marker is visible on the map
   */
  set visible(value) {
    this.setVisible(value);
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
  display(map) {
    this.setMap(map);
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
   * Returns whether the Google maps marker object has been created yet.
   *
   * This lets other parts of the library avoid building the Google marker just to find out
   * that there isn't one, which toGoogleSync() would otherwise do.
   *
   * This is not intended to be called outside of this library.
   *
   * @internal
   * @returns {boolean}
   */
  hasGoogleMarker() {
    return isObject(this.#marker);
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
      if (isObject(this.#marker)) {
        resolve();
        return;
      }
      this.#dispatchReady();
      resolve();
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
  async setMap(map) {
    if (isNullOrUndefined(map) && !isObject(this.#marker)) {
      this.#isCreationDeferred = false;
      this.#options.map = null;
      super.setMap(null);
      return this;
    }
    await this.#setupGoogleMarker(map ?? void 0);
    this.#setMap(map);
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
  setMapSync(map) {
    this.#setupGoogleMarkerSync();
    this.#setMap(map);
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
      let { tooltip } = options;
      if (options.title && isObject(tooltip) && !(tooltip instanceof HTMLElement || tooltip instanceof Text)) {
        tooltip = { ...{ content: options.title }, ...tooltip };
      }
      this.attachTooltip(tooltip);
    } else if (options.title) {
      this.#options.title = options.title;
      if (this.#marker) {
        this.title = options.title;
      }
    }
    STRING_OPTIONS.forEach((key) => {
      if (options[key] && isStringWithValue(options[key])) {
        this.#options[key] = options[key];
      }
    });
    if (isBoolean(options.visible)) {
      this.#options.visible = options.visible;
      this.isVisible = options.visible;
    }
    if (options.map) {
      this.#options.map = options.map;
      super.setMap(options.map);
      if (this.#options.visible === false) {
        this.isVisible = false;
        this.#isCreationDeferred = true;
        this.#dispatchReady();
      } else {
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
    this.#marker.setPosition(this.position.toGoogle());
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
   * Set whether the marker is visible on the map.
   *
   * A marker that isn't visible isn't drawn, so nothing is created on the Google map for it
   * until it's shown. Setting it to visible draws it if it was waiting to be drawn.
   *
   * @param {boolean} visible Whether the marker is visible on the map
   * @returns {Marker}
   */
  setVisible(visible) {
    if (isBoolean(visible)) {
      this.#options.visible = visible;
      this.isVisible = visible;
      if (visible && this.#isCreationDeferred) {
        this.#isCreationDeferred = false;
        const { map } = this.#options;
        this.#setupGoogleMarker(map ?? void 0).then(() => {
          if (map && this.#options.map === map && this.#marker) {
            this.#marker.setMap(map.toGoogle() ?? null);
          }
        });
      } else if (this.#marker) {
        this.#marker.setVisible(visible);
      }
    }
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
  show(map) {
    return this.setMap(map);
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
  #setupGoogleMarker(map) {
    if (isObject(this.#marker)) {
      return RESOLVED;
    }
    const creation = this.#startGoogleMarkerSetup(map);
    this.#creationPromise = creation;
    creation.then(
      () => {
        this.#creationPromise = void 0;
      },
      () => {
        this.#creationPromise = void 0;
      }
    );
    return creation;
  }
  /**
   * Start setting up the Google maps marker object
   *
   * @private
   * @param {Map} [map] The map object. If it's set then it will be initialized if the Google maps object isn't available yet.
   * @returns {Promise<void>}
   */
  #startGoogleMarkerSetup(map) {
    if (this.#creationPromise) {
      return this.#creationPromise;
    }
    return new Promise((resolve) => {
      if (!this.#isSettingUp && !isObject(this.#marker)) {
        this.#isSettingUp = true;
        if (checkForGoogleMaps("Marker", "Marker", false)) {
          this.#createMarkerObject().then(() => {
            this.#isSettingUp = false;
            this.#dispatchReady();
            resolve();
          });
        } else {
          if (map instanceof Map) {
            map.init();
          }
          loader().onMapLoad(() => {
            this.#createMarkerObject().then(() => {
              const thisMap = this.getMap();
              if (this.#marker && thisMap) {
                this.#marker.setMap(thisMap.toGoogle() ?? null);
              } else if (this.#marker && map) {
                this.#marker.setMap(map.toGoogle() ?? null);
              }
              this.#dispatchReady();
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
   * Set up the Google maps marker object syncronously.
   */
  #setupGoogleMarkerSync() {
    if (!isObject(this.#marker)) {
      if (checkForGoogleMaps("Marker", "Marker", false)) {
        const creation = this.#createMarkerObject(true).then(() => {
          this.#dispatchReady();
        });
        this.#creationPromise = creation;
        creation.then(
          () => {
            this.#creationPromise = void 0;
          },
          () => {
            this.#creationPromise = void 0;
          }
        );
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
   * @param {boolean} [createNow] Whether to build the marker straight away instead of waiting
   *      for the map to be ready. Used by the synchronous methods, which have to hand back a
   *      marker by the time they return. The marker is put on the map once the map is ready.
   * @returns {Promise<void>}
   */
  #createMarkerObject(createNow = false) {
    return new Promise((resolve) => {
      if (!this.#marker) {
        (async () => {
          const markerOptions = {};
          GOOGLE_OPTIONS_TO_SET.forEach((key) => {
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
          if (this.#options.map && !createNow) {
            this.#options.map.onReady(() => {
              if (this.#options.map) {
                markerOptions.map = this.#options.map.toGoogle();
              }
              if (this.#marker) {
                this.#marker.setMap(markerOptions.map ?? null);
              } else {
                this.#marker = new google.maps.Marker(markerOptions);
                this.setEventGoogleObject(this.#marker);
              }
              resolve();
            });
          } else if (this.#options.map) {
            this.#marker = new google.maps.Marker(markerOptions);
            this.setEventGoogleObject(this.#marker);
            resolve();
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

export {
  Marker,
  marker
};
