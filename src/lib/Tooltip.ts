/* ===========================================================================
    Aids id setting up a tooltip for markers and other elements.

    See https://aptuitiv.github.io/gmaps-docs/api-reference/tooltip for documentation
=========================================================================== */

/* global google, HTMLElement, Text */

import { isObject, isString, isStringWithValue, objectHasValue } from './helpers';
import { LatLngValue } from './LatLng';
import Layer from './Layer';
import { Map } from './Map';
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
     * @returns {Promise<Tooltip>}
     */
    async attachTo(element: Map | Layer, event?: 'click' | 'clickon' | 'hover'): Promise<Tooltip> {
        if (!this.#isAttached) {
            this.#isAttached = true;
            await element.init().then(() => {
                const triggerEvent = event || this.#event;
                // Show the tooltip when hovering over the element
                if (triggerEvent === 'click') {
                    // Show the tooltip when clicking on the element
                    element.on('click', (e) => {
                        this.setPosition(e.latLng);
                        if (element instanceof Map) {
                            this.toggle(element);
                        } else {
                            this.toggle(element.getMap());
                        }
                    });
                } else if (triggerEvent === 'clickon') {
                    // Show the tooltip when clicking on the element
                    element.on('click', (e) => {
                        this.setPosition(e.latLng);
                        if (element instanceof Map) {
                            this.show(element);
                        } else {
                            this.show(element.getMap());
                        }
                    });
                } else {
                    // Default to hover
                    element.on('mouseover', (e) => {
                        this.setPosition(e.latLng);
                        if (element instanceof Map) {
                            this.show(element);
                        } else {
                            this.show(element.getMap());
                        }
                    });
                    if (element instanceof Map) {
                        element.on('mousemove', (e) => {
                            this.setPosition(e.latLng);
                            this.show(element);
                        });
                    }
                    element.on('mouseout', () => {
                        this.hide();
                    });
                }
            });
        }

        return this;
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
}

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
     * @param {TooltipValue} tooltipValue The content for the Tooltip, or the Tooltip options object, or the Tooltip object
     * @param {'click' | 'clickon' | 'hover'} [event] The event to trigger the tooltip. Defaults to 'hover'. See Tooltip.attachTo() for more information.
     */
    attachTooltip(tooltipValue: TooltipValue|TooltipConfig, event?: 'click' | 'clickon' | 'hover') {
        let tooltipVal = tooltipValue;
        let tooltipEvent = event;
        if (isObject(tooltipValue) && objectHasValue(tooltipValue, 'attachConfig') && objectHasValue(tooltipValue, 'attachEvent')) {
            // The tooltipValue is a TooltipConfig object
            tooltipVal = (tooltipValue as TooltipConfig).attachConfig;
            tooltipEvent = (tooltipValue as TooltipConfig).attachEvent;
            // Save the tooltip configuration so that it could be used to recreate the tooltip when cloning the object.
            this.tooltipConfig = tooltipValue;
        } else {
            // Save the tooltip configuration so that it could be used to recreate the tooltip when cloning the object.
            this.tooltipConfig = {
                attachConfig: tooltipVal,
                attachEvent: tooltipEvent
            }
        }

        tooltip(tooltipVal as TooltipValue).attachTo(this, tooltipEvent);
    },
};

/**
 * To avoid circular dependencies we need to add the attachTooltip method to the Layer and Map classes here
 */
Layer.include(tooltipMixin);
Map.include(tooltipMixin);
