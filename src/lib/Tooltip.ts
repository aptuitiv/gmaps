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
 * Tooltip class
 */
export class Tooltip extends Overlay {
    /**
     * Holds the tooltip that this one last showed for the object it's attached to.
     *
     * This is only used when a callback function returns a different Tooltip object for each
     * thing that the tooltip is shown for, so that the previous one can be hidden.
     *
     * @private
     * @type {Tooltip}
     */
    #activeTooltip: Tooltip;

    /**
     * Holds the callback function that works out what to show, if one was given.
     *
     * @private
     * @type {TooltipCallback}
     */
    #callback: TooltipCallback;

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
     * @type {string|HTMLElement}
     */
    #content: string | HTMLElement | Text;

    /**
     * The event to trigger the tooltip
     *
     * @private
     * @type {'click' | 'clickon' | 'hover'}
     */
    #event: string = 'hover';

    /**
     * Whether the tooltip is attached to an element
     *
     * @private
     * @type {boolean}
     */
    #isAttached: boolean = false;

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
        if (isObject(options)) {
            if (options instanceof HTMLElement || options instanceof Text) {
                this.content = options;
            } else {
                this.setOptions(options);
            }
        } else {
            // The tooltip contents were passed
            this.content = options;
            this.setClassName('tooltip');
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
     * @returns {string|HTMLElement|Text}
     */
    get content(): string | HTMLElement | Text {
        return this.#content;
    }

    /**
     * Set the content for the tooltip
     *
     * @param {string|HTMLElement|Text} content The content for the tooltip
     */
    set content(content: string | HTMLElement | Text) {
        if (isStringWithValue(content)) {
            this.#content = content;
            this.getOverlayElement().innerHTML = content;
        } else if (content instanceof HTMLElement || content instanceof Text) {
            this.#content = content;
            this.getOverlayElement().innerHTML = '';
            this.getOverlayElement().appendChild(content);
        }
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
        if (!this.#isAttached) {
            this.#isAttached = true;
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
                            tooltipObject.toggle(elementMap());
                        });
                    } else if (triggerEvent === 'clickon') {
                        // Show the tooltip when clicking on the element
                        element.on('click', (e) => {
                            const tooltipObject = this.#tooltipFor(element);
                            tooltipObject.setPosition(e.latLng);
                            tooltipObject.show(elementMap());
                        });
                    } else {
                        // Default to hover
                        element.on('mouseover', (e) => {
                            const tooltipObject = this.#tooltipFor(element);
                            tooltipObject.setPosition(e.latLng);
                            tooltipObject.show(elementMap());
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
        if (!isFunction(this.#callback)) {
            return this;
        }
        const tooltipObject = overlayFromCallback(this, this.#callback(target), tooltipAdapter) as Tooltip;
        // If the callback returned a different tooltip than the one that's showing then the old
        // one is hidden. Otherwise it would be left open on the map with nothing referring to it.
        if (this.#activeTooltip && this.#activeTooltip !== tooltipObject) {
            this.#activeTooltip.hide();
        }
        this.#activeTooltip = tooltipObject;
        return tooltipObject;
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
        if (this.hasPosition() && typeof projection !== 'undefined') {
            const divPosition = projection.fromLatLngToDivPixel(this.position.toGoogle())!;

            // Hide the tooltip when it is far out of view.
            const display = Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ? 'block' : 'none';

            if (display === 'block') {
                const offset = this.getOffset();
                this.style('left', `${divPosition.x + offset.getX()}px`);
                this.style('top', `${divPosition.y + offset.getY()}px`);
                if (this.center) {
                    // Center the tooltip horizontally on the element
                    this.style('transform', 'translate(-50%, 0)');
                }
                if (this.#theme === 'default') {
                    const styles = this.styles || {};
                    const themeStyles = {
                        backgroundColor: '#fff',
                        color: '#333',
                        padding: '3px 6px',
                        borderRadius: '4px',
                        boxShadow: '0 0 5px rgba(0,0,0,0.3)',
                    };
                    this.styles = { ...themeStyles, ...styles };
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
    attachConfig: TooltipValue;
    attachEvent?: 'click' | 'clickon' | 'hover';
};

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
     * @returns {Tooltip}
     */
    attachTooltip(tooltipValue: AttachTooltipValue | TooltipConfig, event?: 'click' | 'clickon' | 'hover'): Tooltip {
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
            this.tooltipConfig = tooltipValue;
        } else {
            // Save the tooltip configuration so that it could be used to recreate the tooltip when cloning the object.
            this.tooltipConfig = {
                attachConfig: tooltipVal,
                attachEvent: tooltipEvent,
            };
        }

        let t: Tooltip;
        let callback: TooltipCallback;
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
    attachTooltip(tooltipValue: DataTooltipValue, event?: AttachEventValue): Tooltip {
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
    attachTooltip(tooltipValue: DataTooltipValue, event?: AttachEventValue): Tooltip {
        return attachToDataFeature(this, tooltipValue, event, tooltipAdapter) as Tooltip;
    },
};

/**
 * The data layer and its features need their own attachTooltip, so they replace the one that
 * they would otherwise get from Layer.
 */
DataLayer.include(dataLayerTooltipMixin);
DataFeature.include(dataFeatureTooltipMixin);
