/* ===========================================================================
    Aids id setting up a tooltip for markers and other elements.

    See https://aptuitiv.github.io/gmaps/api-reference/tooltip for documentation
=========================================================================== */

/* global google, HTMLElement, Text */
/* eslint-disable no-use-before-define -- Done because the tooltip adapter and the value types are defined below the class */

import { READY_EVENT } from './constants';
import { DataFeature } from './DataFeature';
import { DataLayer } from './DataLayer';
import { isFunction, isObject, isString, isStringWithValue, objectHasValue } from './helpers';
import { LatLngValue } from './LatLng';
import Layer from './Layer';
import { Map } from './Map';
import {
    AttachEventValue,
    attachToDataFeature,
    attachToDataLayer,
    overlayFromCallback,
    OverlayAttachmentAdapter,
} from './OverlayAttachment';
import { Overlay } from './Overlay';
import { PointValue } from './Point';

export type TooltipOptions = {
    // Whether to center the tooltip horizontally on the element. Useful if the tooltip is on a marker. Defaults to true.
    center?: boolean;
    // A class name to add to the tooltip element
    className?: string;
    // The content for the tooltip
    content?: string | HTMLElement | Text;
    // The event to trigger the tooltip. Defaults to 'hover'
    // Allowed values are: 'click',  'clickon', and 'hover'
    event?: string;
    // The map to attach the tooltip to
    map?: Map;
    // The offset for the tooltip. This is applied to the tooltip container.
    offset?: PointValue;
    // The latitude/longitude position for the tooltip
    position?: LatLngValue;
    // Styles that will be set on the tooltip container div.
    styles?: object;
    // A build-in theme to assign to the tooltip. By default the tooltip has a default theme. Set to 'none' to remove the theme.
    // 'default' | 'none'
    theme?: string;
};

/**
 * The one Tooltip that everything shares when sharing is turned on.
 *
 * Built the first time it's needed, so importing this file doesn't create a div. Only one
 * tooltip is ever visible - you can only hover one thing at a time - so one object and one div
 * is enough for a whole map. A page with a tooltip on each of 2,595 polyline segments used to
 * build 2,595 Tooltip objects and 2,595 detached divs.
 */
let sharedTooltipInstance: Tooltip | undefined;

/**
 * What each thing shows in the shared tooltip.
 *
 * The shared tooltip has one content at a time, so each thing's own value is kept here and put
 * back every time that thing is about to show it. Without this, whatever was attached last would
 * be left showing for everything else.
 *
 * A WeakMap so that a marker or polyline that's dropped doesn't keep its tooltip value alive.
 */
const sharedTooltipValues: WeakMap<Map | Layer, AttachTooltipValue> = new WeakMap();

/**
 * Tooltip class
 */
export class Tooltip extends Overlay {
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
    static useShared: boolean = true;

    /**
     * Holds the tooltip that this one last showed for the object it's attached to.
     *
     * This is only used when a callback function returns a different Tooltip object for each
     * thing that the tooltip is shown for, so that the previous one can be hidden.
     *
     * @private
     * @type {Tooltip|undefined}
     */
    #activeTooltip: Tooltip | undefined;

    /**
     * Holds the callback function that works out what to show, if one was given.
     *
     * @private
     * @type {TooltipCallback|undefined}
     */
    #callback: TooltipCallback | undefined;

    /**
     * Whether to center the tooltip on the element. Useful if the tooltip is on a marker.
     *
     * @private
     * @type {boolean}
     */
    #center: boolean = true;

    /**
     * Holds the tooltip content.
     * This can be a simple string of text, string of HTML code, or an HTMLElement.
     *
     * @private
     * @type {string|HTMLElement|Text|undefined}
     */
    #content: string | HTMLElement | Text | undefined;

    /**
     * Whether the content still needs to be written into the overlay element
     *
     * @private
     * @type {boolean}
     */
    #isContentDirty: boolean = false;

    /**
     * The event to trigger the tooltip
     *
     * @private
     * @type {'click' | 'clickon' | 'hover'}
     */
    #event: string = 'hover';

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
    #attachedTo: WeakSet<Map | Layer> | undefined;

    /**
     * Whether the default theme styles have been set on the tooltip element
     *
     * @private
     * @type {boolean}
     */
    #isThemeApplied: boolean = false;

    /**
     * The theme to use for the tooltip.
     *
     * @private
     * @type {string}
     */
    #theme: string = 'default';

    /**
     * Constructor
     *
     * @param {TooltipOptions | string | HTMLElement | Text} [options] Tooltip options
     */
    constructor(options?: TooltipOptions | string | HTMLElement | Text) {
        super('tooltip', 'Tooltip');

        this.setOffset([0, 4]);
        // isObject() only matches a plain object, so an HTMLElement or Text never reached this
        // branch. There used to be a test for them here that could never run. Element content
        // goes through the else branch below, which handles it. The element types are named in
        // the check so that Typescript narrows the value the same way that isObject() does.
        if (isObject(options) && !(options instanceof HTMLElement) && !(options instanceof Text)) {
            this.setOptions(options);
        } else {
            // The tooltip contents were passed
            if (typeof options !== 'undefined') {
                this.content = options;
            }
            this.setClassName('tooltip');
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
    static getShared(): Tooltip {
        if (!sharedTooltipInstance) {
            sharedTooltipInstance = new Tooltip();
        }
        return sharedTooltipInstance;
    }

    /**
     * Throw away the shared tooltip, hiding it first if it's showing.
     *
     * The next thing that needs it builds a new one. Each thing keeps its own value, so they
     * carry on working after this.
     */
    static clearShared(): void {
        if (sharedTooltipInstance) {
            sharedTooltipInstance.hide();
            sharedTooltipInstance = undefined;
        }
    }

    /**
     * Returns whether to center the tooltip horizontally on the element.
     *
     * @returns {boolean}
     */
    get center(): boolean {
        return this.#center;
    }

    /**
     * Set whether to center the tooltip horizontally on the element. Useful if the tooltip is on a marker.
     *
     * @param {boolean} center Whether to center the tooltip on the element
     */
    set center(center: boolean) {
        if (typeof center === 'boolean') {
            this.#center = center;
        }
    }

    /**
     * Returns the content for the tooltip
     *
     * @returns {string|HTMLElement|Text|undefined}
     */
    get content(): string | HTMLElement | Text | undefined {
        return this.#content;
    }

    /**
     * Set the content for the tooltip
     *
     * @param {string|HTMLElement|Text} content The content for the tooltip
     */
    set content(content: string | HTMLElement | Text) {
        if (isStringWithValue(content) || content instanceof HTMLElement || content instanceof Text) {
            this.#content = content;
            // The content isn't written into the element here. Parsing it is the expensive part,
            // and a tooltip attached to a layer that is never hovered would pay for it for
            // nothing. On a page with a tooltip on every one of 2,595 segments that's 2,595
            // innerHTML parses before anything is shown. #flushContent() writes it the first
            // time the element is actually used.
            this.#isContentDirty = true;
        }
    }

    /**
     * Write the content into the overlay element if it hasn't been written yet
     *
     * @private
     */
    #flushContent(): void {
        if (!this.#isContentDirty) {
            return;
        }
        this.#isContentDirty = false;
        const element = super.getOverlayElement();
        const content = this.#content;
        if (isStringWithValue(content)) {
            element.innerHTML = content;
        } else if (content instanceof HTMLElement || content instanceof Text) {
            element.innerHTML = '';
            element.appendChild(content);
        } else {
            // No content to write. This is how the shared tooltip empties itself between the
            // things it's shown for - without it the last thing's text would be left in the
            // element for the next one, which has none of its own.
            element.innerHTML = '';
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
    getOverlayElement(): HTMLElement {
        this.#flushContent();
        return super.getOverlayElement();
    }

    /**
     * Returns the event to trigger the tooltip
     *
     * @returns {string}
     */
    get event(): string {
        return this.#event;
    }

    /**
     * Set the event to trigger the tooltip
     *
     * @param {string} event The event to trigger the tooltip
     */
    set event(event: string) {
        if (isStringWithValue(event) && ['click', 'clickon', 'hover'].includes(event.toLowerCase())) {
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
    get theme(): string {
        return this.#theme;
    }

    /**
     * Set the theme to use for the tooltip
     *
     * @param {string} theme The theme to use for the tooltip
     */
    set theme(theme: string) {
        this.#theme = theme;
        // Apply the theme styles again the next time the tooltip is drawn
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
    async attachTo(
        element: Map | Layer,
        event?: 'click' | 'clickon' | 'hover',
        callback?: TooltipCallback,
    ): Promise<Tooltip> {
        // Which elements this tooltip is attached to, rather than a single "am I attached" flag.
        // The shared tooltip is attached to every marker and polyline on the map and each one
        // needs its own listeners, so a flag would have wired up the first element and silently
        // skipped every one after it.
        const attachedTo = (this.#attachedTo ??= new WeakSet());
        if (!attachedTo.has(element)) {
            // Attaching to the same element twice would give it a second set of listeners, and
            // the tooltip would then be shown twice for one hover.
            attachedTo.add(element);
            if (isFunction(callback)) {
                this.#callback = callback;
            }
            await element.init().then(() => {
                element.onceImmediate(READY_EVENT, () => {
                    const triggerEvent = event || this.#event;
                    // The map that the tooltip is shown on
                    const elementMap = () => (element instanceof Map ? element : element.getMap());

                    // Show the tooltip when hovering over the element
                    if (triggerEvent === 'click') {
                        // Show the tooltip when clicking on the element
                        element.on('click', (e) => {
                            const tooltipObject = this.#tooltipFor(element);
                            tooltipObject.setPosition(e.latLng);
                            const map = elementMap();
                            if (map) {
                                tooltipObject.toggle(map);
                            }
                        });
                    } else if (triggerEvent === 'clickon') {
                        // Show the tooltip when clicking on the element
                        element.on('click', (e) => {
                            const tooltipObject = this.#tooltipFor(element);
                            tooltipObject.setPosition(e.latLng);
                            const map = elementMap();
                            if (map) {
                                tooltipObject.show(map);
                            }
                        });
                    } else {
                        // Default to hover
                        element.on('mouseover', (e) => {
                            const tooltipObject = this.#tooltipFor(element);
                            tooltipObject.setPosition(e.latLng);
                            const map = elementMap();
                            if (map) {
                                tooltipObject.show(map);
                            }
                        });
                        if (element instanceof Map) {
                            element.on('mousemove', (e) => {
                                // The callback isn't called again while the mouse moves. The
                                // tooltip that's already showing just follows the cursor.
                                const tooltipObject = this.#activeTooltip || this;
                                tooltipObject.setPosition(e.latLng);
                                tooltipObject.show(element);
                            });
                        }
                        element.on('mouseout', () => {
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
    #tooltipFor(target: Map | Layer): Tooltip {
        // The shared tooltip keeps each thing's own value, so the right one is put back every
        // time it's about to be shown.
        const sharedValue = sharedTooltipValues.get(target);
        if (typeof sharedValue !== 'undefined') {
            // Everything shares this one object, so whatever the last thing left on it is put
            // back to the built state before this thing's value goes on.
            this.#resetToBaseline();
            return this.#resolveFor(target, sharedValue);
        }
        // Not shared and no callback. This is a tooltip with fixed content, which is always
        // itself - nothing has to be worked out before it's shown.
        if (!isFunction(this.#callback)) {
            return this;
        }
        // Not shared, but a callback was given, so it decides what to show each time
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
    #resetToBaseline(): void {
        this.center = true;
        this.theme = 'default';
        this.setOffset([0, 4]);
        // Class names add to each other rather than replacing, so the current ones are taken off
        // before the default goes back on. removeClassName('') would ask the element to remove an
        // empty class, which throws, so there's nothing to do when there aren't any.
        const current = this.className;
        if (current.length > 0) {
            this.removeClassName(current);
        }
        this.setClassName('tooltip');
        // The content setter ignores an empty value on purpose, so this is set directly. Marking
        // it dirty is what gets the old content out of the element - #flushContent() clears the
        // element when there's nothing to put in it.
        this.#content = undefined;
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
    #resolveFor(target: Map | Layer, value: AttachTooltipValue): Tooltip {
        // The value is either a callback to run now, or the content, options or Tooltip to use
        // as it is. A callback is only called at this point, when the tooltip is about to be
        // shown, which is what lets it return something different each time.
        const resolved = isFunction(value) ? (value as TooltipCallback)(target) : value;
        // This is where the tooltip's content actually changes. overlayFromCallback() sets the
        // content when it's given a string or an element, or applies the options when it's given
        // an options object, onto the tooltip passed as the first argument - this one. That's how
        // the shared tooltip ends up holding this object's value rather than the last one's.
        //
        // A Tooltip object is handed straight back instead of being applied, which is how a
        // callback can return a completely different tooltip to show.
        const tooltipObject = overlayFromCallback(this, resolved, tooltipAdapter) as Tooltip;
        // If a different tooltip than the one that's showing was worked out then the old one is
        // hidden. Otherwise it would be left open on the map with nothing referring to it.
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
    #applyTheme(): void {
        const themeStyles: { [key: string]: string } = {
            backgroundColor: '#fff',
            color: '#333',
            padding: '3px 6px',
            borderRadius: '4px',
            boxShadow: '0 0 5px rgba(0,0,0,0.3)',
        };
        const styles = this.styles as { [key: string]: string };
        Object.keys(themeStyles).forEach((key) => {
            if (typeof styles[key] === 'undefined') {
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
    hasContent(): boolean {
        return (
            isStringWithValue(this.#content) || this.#content instanceof HTMLElement || this.#content instanceof Text
        );
    }

    /**
     * Set the content for the tooltip
     *
     * @param {string|HTMLElement} content The content for the tooltip
     * @returns {Tooltip}
     */
    setContent(content: string | HTMLElement): Tooltip {
        this.content = content;
        return this;
    }

    /**
     * Sets the options for the tooltip
     *
     * @param {TooltipOptions} options Tooltip options
     * @returns {Tooltip}
     */
    setOptions(options: TooltipOptions): Tooltip {
        if (typeof options.center === 'boolean') {
            this.center = options.center;
        }
        if (options.content) {
            this.content = options.content;
        }
        if (isString(options.className)) {
            this.removeClassName('tooltip');
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
    add(panes: google.maps.MapPanes) {
        panes.floatPane.appendChild(this.getOverlayElement());
    }

    /**
     * Draw the overlay. Called when the overlay is being drawn or updated.
     *
     * @internal
     * @param {google.maps.MapCanvasProjection} projection The Google maps projection object
     */
    draw(projection: google.maps.MapCanvasProjection) {
        // projection could be undefined if this is being displayed on a hover event. Sometimes the initial
        // hover events are triggered faster than the overlay can be set up on the map. It'll eventually catch
        // up and the tooltip will be displayed.
        const position = this.getPosition();
        // The position has to be a real latitude/longitude pair, not just present. The pixel to
        // lat/lng conversions on Overlay hand back an empty LatLng when there's no projection to
        // work with, and toGoogle() throws for one of those - inside draw(), which Google calls
        // on every frame while the map moves.
        if (position && position.isValid() && typeof projection !== 'undefined') {
            const divPosition = projection.fromLatLngToDivPixel(position.toGoogle());
            if (!divPosition) {
                // The position couldn't be converted to pixel coordinates so the tooltip can't
                // be placed. Popup.draw() has always checked this; this used to assert that it
                // was never null and read x and y off it regardless.
                return;
            }

            // Hide the tooltip when it is far out of view.
            const display = Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ? 'block' : 'none';

            if (display === 'block') {
                // Only the position changes from one draw to the next. draw() is called on every
                // frame while the map is zoomed or panned, so the other styles are only set when needed.
                const offset = this.getOffset();
                this.style('left', `${divPosition.x + offset.getX()}px`);
                this.style('top', `${divPosition.y + offset.getY()}px`);
                if (this.center && this.getOverlayElement().style.transform !== 'translate(-50%, 0)') {
                    // Center the tooltip horizontally on the element
                    this.style('transform', 'translate(-50%, 0)');
                }
                if (this.#theme === 'default' && !this.#isThemeApplied) {
                    this.#applyTheme();
                }
            }

            if (this.getOverlayElement().style.display !== display) {
                this.style('display', display);
            }
        }
    }
}

// The possible values for the options parameter
export type TooltipValue = Tooltip | TooltipOptions | string | HTMLElement | Text;

/**
 * A function that works out what tooltip to show.
 *
 * It's called every time the tooltip is about to be shown and is passed the object that the
 * tooltip is attached to. It can return the content for the tooltip, a TooltipOptions object,
 * or a Tooltip object to show instead.
 */
export type TooltipCallback = (target?: Map | Layer) => TooltipValue;

// The value that can be passed to attachTooltip()
export type AttachTooltipValue = TooltipValue | TooltipCallback;

/**
 * Helper function to set up the tooltip object
 *
 * @param {TooltipValue} [options] The tooltip options or the tooltip class
 * @returns {Tooltip}
 */
export const tooltip = (options?: TooltipValue): Tooltip => {
    if (options instanceof Tooltip) {
        return options;
    }
    return new Tooltip(options);
};

export type TooltipConfig = {
    attachConfig: AttachTooltipValue;
    attachEvent?: 'click' | 'clickon' | 'hover';
};

// Options for a single attachTooltip() call
export type AttachTooltipOptions = {
    // Whether this one call uses the shared tooltip. Defaults to Tooltip.useShared, which is
    // true. Set it to false for something that needs a Tooltip of its own, for example one with
    // its own class name or offset.
    shared?: boolean;
};

/**
 * The objects that the tooltip mixin is added to.
 *
 * The mixin saves the tooltip configuration on the object so that it can be used when cloning the object.
 */
type TooltipMixinHost = (Map | Layer) & { tooltipConfig: TooltipConfig | null };

/**
 * Mixin to add the attachTooltip method to the Marker and Map classes
 */
const tooltipMixin = {
    /**
     * Holds the configuration to recreate the tooltip.
     *
     * This is useful when cloning an object.
     *
     * @type {TooltipConfig|null}
     */
    tooltipConfig: null as TooltipConfig | null,

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
    attachTooltip(
        this: TooltipMixinHost,
        tooltipValue: AttachTooltipValue | TooltipConfig,
        event?: 'click' | 'clickon' | 'hover',
        attachOptions?: AttachTooltipOptions,
    ): Tooltip {
        let tooltipVal = tooltipValue;
        let tooltipEvent = event;
        if (
            isObject(tooltipValue) &&
            objectHasValue(tooltipValue, 'attachConfig') &&
            objectHasValue(tooltipValue, 'attachEvent')
        ) {
            // The tooltipValue is a TooltipConfig object
            tooltipVal = (tooltipValue as TooltipConfig).attachConfig;
            tooltipEvent = (tooltipValue as TooltipConfig).attachEvent;
            // Save the tooltip configuration so that it could be used to recreate the tooltip when cloning the object.
            this.tooltipConfig = tooltipValue as TooltipConfig;
        } else {
            // Save the tooltip configuration so that it could be used to recreate the tooltip when cloning the object.
            this.tooltipConfig = {
                attachConfig: tooltipVal as AttachTooltipValue,
                attachEvent: tooltipEvent,
            };
        }

        // Passing an actual Tooltip object means that object is wanted, so it's never replaced
        // by the shared one however the sharing option is set.
        const isOwnTooltip = tooltipVal instanceof Tooltip;
        // The "shared" option for this one call wins over the Tooltip.useShared default, so a
        // single object can be given its own tooltip while everything else shares one, or can
        // share one while everything else has its own.
        const useShared =
            !isOwnTooltip && (typeof attachOptions?.shared === 'boolean' ? attachOptions.shared : Tooltip.useShared);

        if (useShared) {
            const sharedTooltip = Tooltip.getShared();
            // Each thing keeps its own value so that the shared tooltip can put the right one
            // back every time it's shown.
            sharedTooltipValues.set(this, tooltipVal as AttachTooltipValue);
            // Applied now as well as on every show, so that the tooltip handed back already
            // holds the value that was just passed. A caller attaching one tooltip and then
            // reading or changing it straight away sees what it expects.
            if (!isFunction(tooltipVal)) {
                overlayFromCallback(sharedTooltip, tooltipVal, tooltipAdapter);
            }
            // No callback is passed on, even when the value is one. This object's value is
            // already in sharedTooltipValues, and #tooltipFor() reads it from there every time
            // the tooltip is shown. Passing it as the tooltip's own callback would replace the
            // callback belonging to whichever object attached before this one.
            sharedTooltip.attachTo(this, tooltipEvent);
            return sharedTooltip;
        }

        let t: Tooltip;
        let callback: TooltipCallback | undefined;
        if (isFunction(tooltipVal)) {
            // The tooltip is worked out each time it's shown, so it starts out with no content
            callback = tooltipVal as TooltipCallback;
            t = tooltip({ content: '' });
        } else {
            t = tooltip(tooltipVal as TooltipValue);
        }
        t.attachTo(this, tooltipEvent, callback);
        return t;
    },
};

/**
 * To avoid circular dependencies we need to add the attachTooltip method to the Layer and Map classes here
 */
Layer.include(tooltipMixin);
Map.include(tooltipMixin);

/* ===========================================================================
    Attaching a tooltip to a data layer or to one of its features.

    The wiring lives in OverlayAttachment because the Popup is attached in exactly the same way.
    Only the parts that are specific to the tooltip are here.
=========================================================================== */

/**
 * A function that works out the tooltip to show for a data layer feature.
 *
 * It's the data layer version of TooltipCallback. It's called every time the tooltip is about to
 * be shown and is passed the feature that the event happened on. It can return the content for
 * the tooltip, a TooltipOptions object, or a Tooltip object to show instead.
 */
export type DataTooltipCallback = (feature: DataFeature) => TooltipValue;

// The value that can be passed when attaching a tooltip to a data layer or a feature.
// A string, or the content in a TooltipOptions object, can hold {property} placeholders, which
// are replaced with the properties of the feature that the tooltip is being shown for.
export type DataTooltipValue = TooltipValue | DataTooltipCallback;

// What OverlayAttachment needs to know to attach a tooltip
const tooltipAdapter: OverlayAttachmentAdapter = {
    create: (value) => tooltip(value as TooltipValue),
    defaultEvent: 'hover',
    isOverlay: (value) => value instanceof Tooltip,
    kind: 'tooltip',
    // Unlike the popup, the tooltip doesn't pan the map to bring itself into view, so there's
    // nothing to reset and hiding it first would only make it flicker.
    resetBeforeShow: false,
};

// Set up the mixin for attaching a tooltip to every feature in a data layer
const dataLayerTooltipMixin = {
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
    attachTooltip(this: DataLayer, tooltipValue: DataTooltipValue, event?: AttachEventValue): Tooltip {
        return attachToDataLayer(this, tooltipValue, event, tooltipAdapter) as Tooltip;
    },
};

// Set up the mixin for attaching a tooltip to one feature within a data layer
const dataFeatureTooltipMixin = {
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
    attachTooltip(this: DataFeature, tooltipValue: DataTooltipValue, event?: AttachEventValue): Tooltip {
        return attachToDataFeature(this, tooltipValue, event, tooltipAdapter) as Tooltip;
    },
};

/**
 * The data layer and its features need their own attachTooltip, so they replace the one that
 * they would otherwise get from Layer.
 */
DataLayer.include(dataLayerTooltipMixin);
DataFeature.include(dataFeatureTooltipMixin);
