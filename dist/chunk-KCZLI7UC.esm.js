import {
  Marker
} from "./chunk-YWN76M3A.esm.js";
import {
  InfoWindowEvents,
  Layer_default,
  Map,
  READY_EVENT,
  checkForGoogleMaps,
  isNumber,
  isNumberString,
  isObject,
  isStringWithValue,
  latLng,
  size
} from "./chunk-7O6XY2MX.esm.js";

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
        reject(
          new Error(
            "The Google Maps InfoWindow could not be set up. Make sure the Google Maps library is loaded."
          )
        );
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
          element.toGoogle().then((marker) => {
            googleInfoWindow.open({
              anchor: marker,
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

export {
  InfoWindow,
  infoWindow
};
