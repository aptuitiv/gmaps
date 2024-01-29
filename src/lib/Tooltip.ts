/* ===========================================================================
    Aids id setting up a tooltip for markers and other elements.

    Usage:
    const tooltip = G.tooltip({
        className: 'MapTooltip',
        container: '#map'
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
            container: '#map'
        }
    });

    By default, the component title will be used for the to tooltip. (i.e. the marker tooltip).
    But, you can also set custom content. This could be useful if the component doesn't have a title (like polylines).
    const tooltip = G.tooltip({
        className: 'MapTooltip',
        container: '#map',
        content: 'Some tooltip content here'
    });
=========================================================================== */

import { getPixelsFromLatLng, isObject, isString, isStringWithValue } from './helpers';

type TooltipOptions = {
    className?: string;
    container?: HTMLElement | string;
    content?: string;
};

/**
 * Tooltip class
 */
export class Tooltip {
    /**
     * Holds the container that the tooltip will display in
     *
     * @type {HTMLElement}
     */
    private container: HTMLElement;

    /**
     * Holds the tooltip content.
     * This can be a simple string of text, or string of HTML code.
     *
     * @type {string}
     */
    private content: string;

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
        this.tooltip = document.createElement('div');
        this.tooltip.style.position = 'absolute';

        if (isObject(options)) {
            this.setOptions(options);
        } else {
            this.tooltip.classList.add('tooltip');
            this.container = document.body;
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
            this.setClassName(options.className);
        }
        if (options.container) {
            this.setContainer(options.container);
        }
    }

    /**
     * Set the class name(s) for the tooltip
     *
     * If you need multiple class names then separate them with a space.
     *
     * @param className The class name(s) to add to the tooltip.
     *    This can be a space separated list of class names.
     */
    setClassName(className: string) {
        this.tooltip.classList.remove('tooltip');
        const classes = className.split(' ');
        classes.forEach((cn) => {
            this.tooltip.classList.add(cn.trim());
        });
    }

    /**
     * Sets the container for the tooltip
     *
     * @param {HTMLElement|string} container The container for the tooltip
     */
    setContainer(container: HTMLElement | string) {
        if (isString(container)) {
            this.container = document.querySelector(container);
        } else if (container instanceof HTMLElement) {
            this.container = container;
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
        this.tooltip.innerHTML = content;
    }

    /**
     * Show the tooltip at the specified position
     *
     * @param map The Google map object
     * @param position The Google maps lat/lng position of where the tooltip should show
     */
    show(map: google.maps.Map, position: google.maps.LatLng) {
        const pixels = getPixelsFromLatLng(map, position);
        this.tooltip.style.left = `${pixels.x}px`;
        this.tooltip.style.top = `${pixels.y}px`;
        this.container.appendChild(this.tooltip);
    }

    /**
     * Hide the tooltip
     */
    hide() {
        this.container.removeChild(this.tooltip);
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
