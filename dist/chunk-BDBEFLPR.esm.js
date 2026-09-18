import {
  Polyline
} from "./chunk-H63Q3KLW.esm.js";
import {
  Marker
} from "./chunk-YLGNAECT.esm.js";
import {
  Overlay,
  attachToDataFeature,
  attachToDataLayer,
  overlayFromCallback
} from "./chunk-H6HOEBQR.esm.js";
import {
  DataFeature,
  DataLayer,
  Layer_default,
  Map,
  READY_EVENT,
  isFunction,
  isObject,
  isString,
  isStringWithValue,
  point,
  size
} from "./chunk-IDBS76XJ.esm.js";

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
   * Whether the content still needs to be written into the overlay element
   *
   * @private
   * @type {boolean}
   */
  #isContentDirty = false;
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
   * Whether the close handlers have been bound to the elements inside the popup
   *
   * They're bound the first time the popup is drawn rather than on every draw. Setting the
   * content replaces the element's children, so the content setter sets this back to false.
   *
   * @private
   * @type {boolean}
   */
  #areCloseHandlersBound = false;
  /**
   * Whether the popup is attached to an element
   *
   * @private
   * @type {boolean}
   */
  #isAttached = false;
  /**
   * Whether the default theme styles have been set on the popup element
   *
   * @private
   * @type {boolean}
   */
  #isThemeApplied = false;
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
    if (isObject(options) && !(options instanceof HTMLElement) && !(options instanceof Text)) {
      this.setOptions(options);
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
    if (isStringWithValue(content) || content instanceof HTMLElement || content instanceof Text) {
      this.#content = content;
      this.#areCloseHandlersBound = false;
      this.#isContentDirty = true;
    }
  }
  /**
   * Write the content into the overlay element if it hasn't been written yet
   *
   * @private
   */
  #flushContent() {
    if (!this.#isContentDirty) {
      return;
    }
    this.#isContentDirty = false;
    const element = super.getOverlayElement();
    const content = this.#content;
    if (isStringWithValue(content)) {
      element.innerHTML = content;
    } else if (content instanceof HTMLElement || content instanceof Text) {
      while (element.firstChild) {
        element.removeChild(element.firstChild);
      }
      element.appendChild(content);
    }
  }
  /**
   * Get the overlay HTML element, writing any content that is waiting into it first.
   *
   * Everything that uses the element goes through here - add(), draw(), and anything outside
   * the library - so the content is always there by the time it's looked at.
   *
   * @returns {HTMLElement}
   */
  getOverlayElement() {
    this.#flushContent();
    return super.getOverlayElement();
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
    this.#isThemeApplied = false;
  }
  /**
   * Set the default theme styles on the popup element.
   *
   * Any style that has already been set on the popup is kept so that custom styles win over
   * the theme. This is the same as Tooltip.#applyTheme().
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
              const map = elementMap();
              if (map) {
                popupObject.move(e.latLng, map);
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
              const map = elementMap();
              if (map) {
                popupObject.move(e.latLng, map);
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
    const active = this.#activePopup;
    this.#activePopup = void 0;
    if (active && active !== this) {
      active.hide();
    }
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
          element.toGoogle().then((marker) => {
            const tryGetAnchorPoint = (attempt = 0) => {
              const anchorPoint = marker.get("anchorPoint");
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
              const map = element.getMap();
              if (map) {
                super.show(map).then(() => {
                  resolve(this);
                });
              } else {
                this.#isOpen = false;
                collection.remove(this);
                resolve(this);
              }
            };
            tryGetAnchorPoint();
          });
        } else {
          this.#popupOffset = this.getOffset().clone();
          const map = element.getMap();
          if (map) {
            super.show(map).then(() => {
              resolve(this);
            });
          } else {
            this.#isOpen = false;
            collection.remove(this);
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
      if (this.#theme === "default" && !this.#isThemeApplied) {
        this.#applyTheme();
      }
      if (this.getOverlayElement().style.display !== display) {
        this.style("display", display);
      }
      if (this.#closeElement && !this.#areCloseHandlersBound) {
        this.#areCloseHandlersBound = true;
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
      const map = this.getMap();
      const mapDiv = map?.getDiv();
      if (!map || !mapDiv) {
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
        map.panBy(offsetX, offsetY);
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

export {
  Popup,
  popup,
  closeAllPopups
};
