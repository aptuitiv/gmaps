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

/* global google, HTMLElement */

import { isObject, isString, isStringWithValue } from './helpers';
import { LatLngValue } from './LatLng';
import { Map } from './Map';
import { Marker } from './Marker';
import Overlay from './Overlay';
import { PointValue } from './Point';

type TooltipOptions = {
    className?: string;
    content?: string | HTMLElement;
    map?: Map;
    offset?: PointValue;
    position?: LatLngValue;
};

/**
 * Tooltip class
 */
export class Tooltip extends Overlay {
    /**
     * Holds the tooltip content.
     * This can be a simple string of text, string of HTML code, or an HTMLElement.
     *
     * @private
     * @type {string|HTMLElement}
     */
    #content: string | HTMLElement;

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
     * Returns the content for the tooltip
     *
     * @returns {string|HTMLElement}
     */
    get content(): string | HTMLElement {
        return this.#content;
    }

    /**
     * Set the content for the tooltip
     *
     * @param {string|HTMLElement} content The content for the tooltip
     */
    set content(content: string | HTMLElement) {
        if (isStringWithValue(content)) {
            this.#content = content;
            this.getOverlayElement().innerHTML = content;
        } else if (content instanceof HTMLElement) {
            this.#content = content;
            this.getOverlayElement().innerHTML = '';
            this.getOverlayElement().appendChild(content);
        }
    }

    /**
     * Attach the tooltip to a map or marker
     *
     * The tooltip will be shown when hovering over the map or marker.
     *
     * @param {Map | Marker} element The element to attach the tooltip to
     * @returns {Tooltip}
     */
    attachTo(element: Map | Marker): Tooltip {
        if (element instanceof Map) {
            // Show the tooltip when hovering over the map
            element.on('mouseover', (e) => {
                this.setPosition(e.latLng);
                this.show(element);
            });
            element.on('mousemove', (e) => {
                this.setPosition(e.latLng);
                this.show(element);
            });
            element.on('mouseout', () => {
                this.hide();
            });
        } else if (element instanceof Marker) {
            // Show the tooltip when hovering over the marker
            element.setTooltip(this);
        }
        return this;
    }

    /**
     * Sets the options for the tooltip
     *
     * @param {TooltipOptions} options Tooltip options
     */
    setOptions(options: TooltipOptions) {
        if (options.content) {
            this.content = options.content;
        }
        if (isString(options.className)) {
            this.removeClassName('tooltip');
            this.setClassName(options.className);
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
    }

    /**
     * Returns whether the tooltip already has content
     *
     * @returns {boolean}
     */
    hasContent(): boolean {
        return isStringWithValue(this.#content) || this.#content instanceof HTMLElement;
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
        if (this.hasPosition()) {
            const divPosition = projection.fromLatLngToDivPixel(this.position.toGoogle())!;

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
