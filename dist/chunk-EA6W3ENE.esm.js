import {
  Overlay,
  attachToDataFeature,
  attachToDataLayer,
  overlayFromCallback
} from "./chunk-3COSOCQS.esm.js";
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
  objectHasValue
} from "./chunk-7O6XY2MX.esm.js";

// src/lib/Tooltip.ts
var sharedTooltipInstance;
var sharedTooltipValues = /* @__PURE__ */ new WeakMap();
var Tooltip = class _Tooltip extends Overlay {
  static {
    /**
     * Whether attachTooltip() gives everything one shared Tooltip instead of one each.
     *
     * Defaults to true. Set it to false to go back to a Tooltip per layer, or pass
     * { shared: false } to a single attachTooltip() call to opt just that one out.
     *
     * Passing an actual Tooltip object to attachTooltip() always uses that object, whatever
     * this is set to.
     *
     * @type {boolean}
     */
    this.useShared = true;
  }
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
   * Whether the content still needs to be written into the overlay element
   *
   * @private
   * @type {boolean}
   */
  #isContentDirty = false;
  /**
   * The event to trigger the tooltip
   *
   * @private
   * @type {'click' | 'clickon' | 'hover'}
   */
  #event = "hover";
  /**
   * The things that this tooltip is attached to.
   *
   * This used to be a single boolean, which was right while every layer had its own tooltip.
   * The shared tooltip is attached to many things, and a boolean would have let it wire up its
   * listeners for the first one and silently do nothing for all the rest.
   *
   * Built on first use, and a WeakSet so that it doesn't keep a layer alive.
   *
   * @private
   * @type {WeakSet<Map|Layer>|undefined}
   */
  #attachedTo;
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
    if (isObject(options) && !(options instanceof HTMLElement) && !(options instanceof Text)) {
      this.setOptions(options);
    } else {
      if (typeof options !== "undefined") {
        this.content = options;
      }
      this.setClassName("tooltip");
    }
  }
  /**
   * Get the one Tooltip that everything shares, building it the first time it's needed.
   *
   * It's built with no options on purpose. A Tooltip built from an options object doesn't get
   * the "tooltip" class name, only one built from a string or from nothing does, and the shared
   * tooltip has to look like the per-layer ones it replaces.
   *
   * @returns {Tooltip}
   */
  static getShared() {
    if (!sharedTooltipInstance) {
      sharedTooltipInstance = new _Tooltip();
    }
    return sharedTooltipInstance;
  }
  /**
   * Throw away the shared tooltip, hiding it first if it's showing.
   *
   * The next thing that needs it builds a new one. Each thing keeps its own value, so they
   * carry on working after this.
   */
  static clearShared() {
    if (sharedTooltipInstance) {
      sharedTooltipInstance.hide();
      sharedTooltipInstance = void 0;
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
    if (isStringWithValue(content) || content instanceof HTMLElement || content instanceof Text) {
      this.#content = content;
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
      element.innerHTML = "";
      element.appendChild(content);
    } else {
      element.innerHTML = "";
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
    const attachedTo = this.#attachedTo ??= /* @__PURE__ */ new WeakSet();
    if (!attachedTo.has(element)) {
      attachedTo.add(element);
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
              const map = elementMap();
              if (map) {
                tooltipObject.toggle(map);
              }
            });
          } else if (triggerEvent === "clickon") {
            element.on("click", (e) => {
              const tooltipObject = this.#tooltipFor(element);
              tooltipObject.setPosition(e.latLng);
              const map = elementMap();
              if (map) {
                tooltipObject.show(map);
              }
            });
          } else {
            element.on("mouseover", (e) => {
              const tooltipObject = this.#tooltipFor(element);
              tooltipObject.setPosition(e.latLng);
              const map = elementMap();
              if (map) {
                tooltipObject.show(map);
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
    const sharedValue = sharedTooltipValues.get(target);
    if (typeof sharedValue !== "undefined") {
      this.#resetToBaseline();
      return this.#resolveFor(target, sharedValue);
    }
    if (!isFunction(this.#callback)) {
      return this;
    }
    return this.#resolveFor(target, this.#callback);
  }
  /**
   * Put the shared tooltip back to how it was built, before another object's value is applied.
   *
   * setOptions() only applies the options that are actually given, so anything it isn't told
   * about is left as the last object set it. That's fine for a tooltip that belongs to one
   * layer, but the shared tooltip is the same object for everything on the map: a marker that
   * attached {content, className, theme} left its class name and theme on the tooltip, and the
   * next marker along - whose value is only {content} - was then shown wearing them.
   *
   * The class name is the worst of it. setOptions() takes the "tooltip" class off before adding
   * the one it was given, so once any object passed a className, every object after it lost the
   * default class for good.
   *
   * Only the shared tooltip is reset, and only the values that a tooltip is built with. Styles
   * are deliberately left alone: they're only carried over when an object passes a styles
   * object of its own, and clearing them would mean reaching into Overlay's style record.
   * The theme puts its own styles back, because setting the theme marks it for reapplying.
   *
   * @private
   */
  #resetToBaseline() {
    this.center = true;
    this.theme = "default";
    this.setOffset([0, 4]);
    const current = this.className;
    if (current.length > 0) {
      this.removeClassName(current);
    }
    this.setClassName("tooltip");
    this.#content = void 0;
    this.#isContentDirty = true;
  }
  /**
   * Work out the tooltip to show for a value, calling it first if it's a callback.
   *
   * @private
   * @param {Map|Layer} target The object that the tooltip is being shown for
   * @param {AttachTooltipValue} value The value attached for that object
   * @returns {Tooltip}
   */
  #resolveFor(target, value) {
    const resolved = isFunction(value) ? value(target) : value;
    const tooltipObject = overlayFromCallback(this, resolved, tooltipAdapter);
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
   * Hide the tooltip
   *
   * A callback can return a different Tooltip to show, which is held in #activeTooltip. Hiding
   * this one used to leave that one on the map with nothing referring to it. Only the hover
   * wiring took it down, by hiding `#activeTooltip || this` on mouseout, so a tooltip shown by
   * a click and then hidden directly stayed on the map. It's hidden and forgotten here instead,
   * which is what Popup.hide() does for the same reason.
   *
   * The check against this one matters rather than being tidiness: a callback that returns
   * content or an options object is applied to this tooltip and #activeTooltip is then set to
   * this tooltip, so calling hide() on it without the check would call this method again and
   * never stop.
   *
   * @returns {Tooltip}
   */
  hide() {
    const active = this.#activeTooltip;
    this.#activeTooltip = void 0;
    if (active && active !== this) {
      active.hide();
    }
    super.hide();
    return this;
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
    if (position && position.isValid() && typeof projection !== "undefined") {
      const divPosition = projection.fromLatLngToDivPixel(position.toGoogle());
      if (!divPosition) {
        return;
      }
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
   * @param {AttachTooltipOptions} [attachOptions] Options for this call. Set "shared" to false
   *      to give this object its own Tooltip instead of the shared one.
   * @returns {Tooltip}
   */
  attachTooltip(tooltipValue, event, attachOptions) {
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
    const isOwnTooltip = tooltipVal instanceof Tooltip;
    const useShared = !isOwnTooltip && (typeof attachOptions?.shared === "boolean" ? attachOptions.shared : Tooltip.useShared);
    if (useShared) {
      const sharedTooltip = Tooltip.getShared();
      sharedTooltipValues.set(this, tooltipVal);
      if (!isFunction(tooltipVal)) {
        overlayFromCallback(sharedTooltip, tooltipVal, tooltipAdapter);
      }
      sharedTooltip.attachTo(this, tooltipEvent);
      return sharedTooltip;
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

export {
  Tooltip,
  tooltip
};
