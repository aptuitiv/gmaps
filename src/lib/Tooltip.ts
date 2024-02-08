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

/* global google */

import { isObject, isString, isStringWithValue } from './helpers';
import { LatLng } from './LatLng';
import Overlay from './Overlay';
import { PointValue } from './Point';

type TooltipOptions = {
    className?: string;
    content?: string;
    offset?: PointValue;
};

/**
 * Tooltip class
 */
export class Tooltip extends Overlay {
    /**
     * Holds the tooltip content.
     * This can be a simple string of text, or string of HTML code.
     *
     * @private
     * @type {string}
     */
    #content: string;

    /**
     * Holds the position of the tooltip
     *
     * @private
     * @type {LatLng}
     */
    #position: LatLng;

    /**
     * Constructor
     *
     * @param {TooltipOptions} [options] Tooltip options
     */
    constructor(options?: TooltipOptions) {
        super('tooltip', 'Tooltip');

        if (isObject(options)) {
            this.setOptions(options);
        } else {
            this.setClassName('tooltip');
        }
    }

    /**
     * Returns the position of the tooltip
     *
     * @returns {LatLng}
     */
    get position(): LatLng {
        return this.#position;
    }

    /**
     * Set the position of the tooltip
     *
     * @param {LatLngValue} value The position of the tooltip
     */
    set position(value: LatLngValue) {
        const position = latLng(value);
        if (position.isValid()) {
            this.#position = position;
        } else if (isNullOrUndefined(value)) {
            this.#position = undefined;
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
        if (options.offset) {
            this.setOffset(options.offset);
        }
        if (options.position) {
            this.position = options.position;
        }
    }

    /**
     * Returns whether the tooltip already has content
     *
     * @returns {boolean}
     */
    hasContent(): boolean {
        return isStringWithValue(this.#content);
    }

    /**
     * Set the content for the tooltip
     *
     * @param {string} content The content for the tooltip
     */
    setContent(content: string) {
        if (isStringWithValue(content)) {
            this.#content = content;
            this.getOverlayElement().innerHTML = content;
        }
    }

    /**
     * Set the position of the tooltip
     *
     * @param {LatLngValue} position The latitude/longitude position of where the tooltip should show
     * @returns {Tooltip}
     */
    setPosition(position: LatLngValue): Tooltip {
        this.position = position;
        return this;
    }

    /**
     * Add the overlay to the map. Called once after setMap() is called on the overlay with a valid map.
     *
     * @param {google.maps.MapPanes} panes The Google maps panes object
     */
    add(panes: google.maps.MapPanes) {
        panes.floatPane.appendChild(this.getOverlayElement());
    }

    /**
     * Draw the overlay. Called when the overlay is being drawn or updated.
     *
     * @param {google.maps.MapCanvasProjection} projection The Google maps projection object
     */
    draw(projection: google.maps.MapCanvasProjection) {
        const divPosition = projection.fromLatLngToDivPixel(this.#position.toGoogle())!;

        // Hide the tooltip when it is far out of view.
        const display = Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ? 'block' : 'none';

        if (display === 'block') {
            const offset = this.getOffset();
            this.getOverlayElement().style.left = `${divPosition.x + offset.getX()}px`;
            this.getOverlayElement().style.top = `${divPosition.y + offset.getY()}px`;
        }

        if (this.getOverlayElement().style.display !== display) {
            this.getOverlayElement().style.display = display;
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
