/* ===========================================================================
    Aids id setting up a tooltip for markers and other elements.

    Usage:
    const tooltip = G.tooltip({
        className: 'MapTooltip',
    });
    const marker = G.marker({
        latitude: 40.730610,
        longitude: -73.935242,
        title: 'My Marker',
        tooltip
    });

    Alternately, you can pass an object containing the tooltip options instead of the tooltip object.
    G.marker({
        latitude: 40.730610,
        longitude: -73.935242,
        title: 'My Marker',
        tooltip: {
            className: 'MapTooltip',
        }
    });

    By default, the component title will be used for the to tooltip. (i.e. the marker tooltip).
    But, you can also set custom content. This could be useful if the component doesn't have a title (like polylines).
    const tooltip = G.tooltip({
        className: 'MapTooltip',
        content: 'Some tooltip content here'
    });
=========================================================================== */

import { isObject, isString, isStringWithValue } from './helpers';
import { Overlay } from './Overlay';

type TooltipOptions = {
    className?: string;
    container?: HTMLElement | string;
    content?: string;
};

/**
 * Tooltip class
 */
class Tooltip extends Overlay {
    /**
     * Holds the tooltip content.
     * This can be a simple string of text, or string of HTML code.
     *
     * @type {string}
     */
    private content: string;

    /**
     * Holds the position of the tooltip
     *
     * @type {google.maps.LatLng}
     */
    private position: google.maps.LatLng;

    /**
     * Holds the tooltip HTML element
     *
     * @type {HTMLElement}
     */
    private tooltip: HTMLElement;

    /**
     * Constructor
     *
     * @param {TooltipOptions} [options] Tooltip options
     */
    constructor(options?: TooltipOptions) {
        super();

        if (isObject(options)) {
            this.setOptions(options);
        } else {
            this.setClassName('tooltip');
        }
    }

    /**
     * Sets the options for the tooltip
     *
     * @param {TooltipOptions} options Tooltip options
     */
    setOptions(options: TooltipOptions) {
        if (isString(options.content)) {
            this.setContent(options.content);
        }
        if (isString(options.className)) {
            this.removeClassName('tooltip');
            this.setClassName(options.className);
        }
    }

    /**
     * Returns whether the tooltip already has content
     *
     * @returns {boolean}
     */
    hasContent(): boolean {
        return isStringWithValue(this.content);
    }

    /**
     * Set the content for the tooltip
     *
     * @param content The content for the tooltip
     */
    setContent(content: string) {
        this.content = content;
        this.overlay.innerHTML = content;
    }

    /**
     * Show the tooltip at the specified position
     *
     * @internal Intended to be called only by internal classes
     * @param map The Google map object
     * @param position The Google maps lat/lng position of where the tooltip should show
     */
    show(map: google.maps.Map, position: google.maps.LatLng) {
        this.position = position;
        this.setMap(map);
    }

    /**
     * Add the overlay to the map. Called once after setMap() is called on the overlay with a valid map.
     *
     * @param panes The Google maps panes object
     */
    add(panes: google.maps.MapPanes) {
        panes.floatPane.appendChild(this.overlay);
    }

    /**
     * Draw the overlay. Called when the overlay is being drawn or updated.
     *
     * @param projection The Google maps projection object
     */
    draw(projection: google.maps.MapCanvasProjection) {
        const divPosition = projection.fromLatLngToDivPixel(this.position)!;

        // Hide the tooltip when it is far out of view.
        const display = Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ? 'block' : 'none';

        if (display === 'block') {
            this.overlay.style.left = `${divPosition.x}px`;
            this.overlay.style.top = `${divPosition.y}px`;
        }

        if (this.overlay.style.display !== display) {
            this.overlay.style.display = display;
        }
    }
}

// The possible values for the options parameter
export type TooltipValue = Tooltip | TooltipOptions;

/**
 * Helper function to set up the tooltip object
 *
 * @param {TooltipOptions} [options] The tooltip options or the tooltip class
 * @returns {Tooltip}
 */
export const tooltip = (options?: TooltipValue): Tooltip => {
    if (options instanceof Tooltip) {
        return options;
    }
    return new Tooltip(options);
};
