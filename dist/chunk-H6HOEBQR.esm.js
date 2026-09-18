import {
  DataFeature,
  LatLng,
  LatLngBounds,
  Layer_default,
  Map,
  OverlayEvents,
  calculateDimensions,
  checkForGoogleMaps,
  isBoolean,
  isFunction,
  isNullOrUndefined,
  isNumber,
  isObject,
  isString,
  latLng,
  loader,
  point,
  renderTemplate
} from "./chunk-IDBS76XJ.esm.js";

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
     * The class names for the overlay element, held here until the element is built.
     *
     * The element used to be the only place this lived, so reading className meant reading the
     * DOM. Keeping it here as well means asking for the class name doesn't build an element.
     *
     * @private
     * @type {string}
     */
    this.#className = "";
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
      const element = this.#element();
      this.#overlayStart = point(parseInt(element.style.left, 10) || 0, parseInt(element.style.top, 10) || 0);
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
      const element = this.#element();
      element.style.left = `${newLeft}px`;
      element.style.top = `${newTop}px`;
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
      const element = this.#element();
      const currentSize = element.getBoundingClientRect();
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
        left: parseInt(element.style.left, 10) || 0,
        // Current top position within the overlay container
        top: parseInt(element.style.top, 10) || 0,
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
      const start = this.resizeStart;
      if (projection && mapContainer && start) {
        const containerRect = mapContainer.getBoundingClientRect();
        const eventX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        const eventY = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        const mouseX = eventX - containerRect.left;
        const mouseY = eventY - containerRect.top;
        const neGoogle = start.neBounds.toGoogle();
        const topRight = neGoogle ? projection.fromLatLngToContainerPixel(neGoogle) : null;
        const swGoogle = start.swBounds.toGoogle();
        const bottomLeft = swGoogle ? projection.fromLatLngToContainerPixel(swGoogle) : null;
        let newWidth;
        let newHeight;
        let newLeft;
        let newTop;
        if (this.resizeCorner === "nw") {
          if (!bottomLeft || !topRight || mouseY > bottomLeft.y || mouseX > topRight.x) {
            return;
          }
          const diffX = start.nwPos.x - mouseX;
          const diffY = start.nwPos.y - mouseY;
          newWidth = start.width + diffX;
          newHeight = start.height + diffY;
          newLeft = start.left - diffX;
          newTop = start.top - diffY;
        } else if (this.resizeCorner === "ne") {
          if (!bottomLeft || !topRight || mouseY > bottomLeft.y || mouseX < bottomLeft.x) {
            return;
          }
          const diffX = topRight.x - mouseX;
          const diffY = topRight.y - mouseY;
          newWidth = start.width - diffX;
          newHeight = start.height + diffY;
          newLeft = start.left;
          newTop = start.top - diffY;
        } else if (this.resizeCorner === "sw") {
          if (!bottomLeft || !topRight || mouseY < start.top || mouseX > topRight.x) {
            return;
          }
          const diffX = bottomLeft.x - mouseX;
          const diffY = bottomLeft.y - mouseY;
          newWidth = start.width + diffX;
          newHeight = start.height - diffY;
          newLeft = start.left - diffX;
          newTop = start.top;
        } else if (this.resizeCorner === "se") {
          if (mouseY < start.top || mouseX < start.left) {
            return;
          }
          const diffX = start.sePos.x - mouseX;
          const diffY = start.sePos.y - mouseY;
          newWidth = start.width - diffX;
          newHeight = start.height - diffY;
          newLeft = start.left;
          newTop = start.top;
        } else {
          return;
        }
        const constrained = calculateDimensions(this.#resizeAspectRatio, newWidth, newHeight);
        const element = this.#element();
        element.style.width = `${constrained.width}px`;
        element.style.height = `${constrained.height}px`;
        element.style.left = `${newLeft}px`;
        element.style.top = `${newTop}px`;
        if (this.#resizeAspectRatio > 0) {
          const newContainerRect = element.getBoundingClientRect();
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
   * Holds the offset for the overlay.
   *
   * This is undefined until an offset is set or read. The constructor used to set a 0,0
   * offset, which allocated a Point for every overlay - and Tooltip and Popup both replace it
   * with their own straight afterwards, so it was thrown away immediately.
   *
   * @private
   * @type {Point|undefined}
   */
  #offset;
  /**
   * Holds the overlay HTML element. This is the container element that the
   * content for the overlay will get displayed in.
   * That could be a tooltip, a custom info window (popup), or a map overlay.
   *
   * It is built the first time something actually needs it, not in the constructor. A popup
   * attached to every one of 2,595 trail segments used to build 2,595 detached divs before
   * anything was shown, and popups open on a click, so almost none of them are ever needed.
   * Read it through #element() or getOverlayElement(), never directly, so that it exists by
   * the time it's used.
   *
   * private
   *
   * @type {HTMLElement|undefined}
   */
  #overlay;
  #className;
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
   * Get the overlay element, building it the first time it's asked for.
   *
   * Everything inside this class reads the element through here. Anything set before the
   * element existed - class names and styles - is written onto it as it's built, so the
   * element ends up in the same state it would have been in if it had been built up front.
   *
   * @private
   * @returns {HTMLElement}
   */
  #element() {
    if (!this.#overlay) {
      const element = document.createElement("div");
      element.style.position = "absolute";
      element.style.pointerEvents = "auto";
      element.style.zIndex = "1000";
      if (this.#className.length > 0) {
        this.#className.split(" ").forEach((cn) => {
          const name = cn.trim();
          if (name.length > 0) {
            element.classList.add(name);
          }
        });
      }
      Object.keys(this.#styles).forEach((name) => {
        element.style[name] = this.#styles[name];
      });
      this.#overlay = element;
    }
    return this.#overlay;
  }
  /**
   * Whether the overlay element has been built yet.
   *
   * Used by the few places that shouldn't build one just to look at it - removing a class
   * name that was never added, or taking an element off a parent it was never on.
   *
   * @private
   * @returns {boolean}
   */
  #hasElement() {
    return typeof this.#overlay !== "undefined";
  }
  /**
   * Get the class name for the overlay element
   *
   * @returns {string}
   */
  get className() {
    return this.#className;
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
      const current = this.#className.length > 0 ? this.#className.split(" ") : [];
      className.split(" ").forEach((cn) => {
        const name = cn.trim();
        if (name.length > 0 && !current.includes(name)) {
          current.push(name);
        }
      });
      this.#className = current.join(" ");
      if (this.#hasElement()) {
        current.forEach((name) => {
          this.#element().classList.add(name);
        });
      }
    } else if (isNullOrUndefined(className)) {
      this.#className = "";
      if (this.#hasElement()) {
        this.#element().className = "";
      }
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
  display(map) {
    return this.show(map);
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
    const pixel = point(x, y);
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
    const pixel = point(x, y);
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
    if (this.#offset === void 0) {
      this.#offset = point(0, 0);
    }
    return this.#offset;
  }
  /**
   * Get the overlay HTML element
   *
   * @returns {HTMLElement}
   */
  getOverlayElement() {
    return this.#element();
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
  move(position, map) {
    return new Promise((resolve, reject) => {
      let mapObject = map;
      if (typeof mapObject === "undefined") {
        mapObject = this.getMap() ?? void 0;
      }
      this.position = position;
      if (mapObject instanceof Map) {
        if (this.#overlayView) {
          this.#attachToGoogleMap(mapObject);
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
    const classes = className.split(" ").map((cn) => cn.trim());
    if (this.#className.length > 0) {
      this.#className = this.#className.split(" ").filter((name) => !classes.includes(name)).join(" ");
    }
    if (this.#hasElement()) {
      const element = this.#element();
      classes.forEach((cn) => {
        element.classList.remove(cn);
      });
    }
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
  setMap(map) {
    return this.show(map);
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
  show(map) {
    return new Promise((resolve) => {
      if (map instanceof Map) {
        this.#setupGoogleOverlay();
        if (this.#overlayView) {
          super.setMap(map);
          this.#attachToGoogleMap(map);
          this.isVisible = true;
          this.dispatch(OverlayEvents.OPEN);
          resolve(this);
        } else {
          loader().onMapLoad(() => {
            this.#setupGoogleOverlay();
            super.setMap(map);
            if (this.#overlayView) {
              this.#attachToGoogleMap(map);
              this.isVisible = true;
            }
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
      if (this.#styles[name] === value) {
        return this;
      }
      this.#styles[name] = value;
      if (this.#hasElement()) {
        this.#element().style[name] = value;
      }
    }
    return this;
  }
  /**
   * Toggle the display of the overlay on the map
   *
   * @param {Map} map The map object
   * @returns {void}
   */
  toggle(map) {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show(map);
    }
  }
  /**
   * Set up drag event handlers
   *
   * @private
   */
  #setupDragHandlers() {
    const element = this.#element();
    if (this.#drag) {
      element.style.cursor = "move";
      element.style.pointerEvents = "auto";
      element.style.border = "2px solid #007bff";
      element.addEventListener("mousedown", this.#handleDragStart);
      element.addEventListener("touchstart", this.#handleDragStart);
      if (checkForGoogleMaps("Overlay", "OverlayView", false)) {
        google.maps.OverlayView.preventMapHitsAndGesturesFrom(element);
      }
    } else {
      element.style.cursor = "";
      element.style.pointerEvents = "";
      if (!this.#resize) {
        element.style.border = "none";
      }
      element.removeEventListener("mousedown", this.#handleDragStart);
      element.removeEventListener("touchstart", this.#handleDragStart);
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
    const element = this.#element();
    element.style.border = "2px solid #007bff";
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
      element.appendChild(handle);
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
    if (!this.#drag && this.#hasElement()) {
      this.#element().style.border = "none";
    }
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
  /**
   * Attach the overlay to the Google map object.
   *
   * The Google map object doesn't exist until the map has been initialized, so toGoogle()
   * returns undefined until then. Passing that on as null attached the overlay to nothing,
   * which left it silently off the map even though it reported itself as visible.
   *
   * When the map isn't set up yet it's told to initialize and the overlay is attached once
   * it's ready. The promise that show() and move() return is deliberately not tied to
   * init(): the map waits on an IntersectionObserver when its element is hidden, so init()
   * can take a long time to settle, or never settle at all. Marker and Polyline trigger the
   * map the same way.
   *
   * @private
   * @param {Map} map The map to attach the overlay to
   */
  #attachToGoogleMap(map) {
    const overlayView = this.#overlayView;
    if (!overlayView) {
      return;
    }
    const googleMap = map.toGoogle();
    if (googleMap) {
      overlayView.setMap(googleMap);
    } else {
      map.init();
      map.onReady(() => {
        if (this.getMap() === map) {
          const readyMap = map.toGoogle();
          if (readyMap) {
            overlayView.setMap(readyMap);
          }
        }
      });
    }
  }
  #setupGoogleOverlay() {
    if (!isObject(this.#overlayView)) {
      if (checkForGoogleMaps("Overlay", "OverlayView", false)) {
        this.#overlayView = getOverlayViewClass(this);
        google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.#element());
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
    if (!this.#hasElement()) {
      return;
    }
    const element = this.#element();
    if (element.parentElement) {
      element.parentElement.removeChild(element);
    }
  }
};
var OverlayViewClass;
var buildOverlayViewClass = () => {
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
  return OverlayView;
};
var getOverlayViewClass = (classObject) => {
  if (!OverlayViewClass) {
    OverlayViewClass = buildOverlayViewClass();
  }
  return new OverlayViewClass(classObject);
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
  const { map } = feature.getLayer();
  if (!(map instanceof Map) || !position) {
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
  overlay2.show(map);
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

export {
  Overlay,
  overlay,
  overlayFromCallback,
  attachToDataLayer,
  attachToDataFeature
};
