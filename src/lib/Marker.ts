/* ===========================================================================
    Enables building and managing markers on the map.

    https://developers.google.com/maps/documentation/javascript/reference/marker

    Example usage:
    const marker = G.marker({
        latitude: 40.730610,
        longitude: -73.935242,
        title: 'My Marker'
    });
    marker.addTo(map);

    // Or, with a custom tooltip
    const marker = G.marker({
        latitude: 40.730610,
        longitude: -73.935242,
        title: 'My Marker',
        tooltipContainer: '#map',
        tooltipClass: 'my-tooltip'
    });
    marker.addTo(map);
=========================================================================== */

import { icon, IconValue } from './Icon';
import { latLng, LatLng, LatLngValue } from './LatLng';
import { Map } from './Map';
import { isObject } from './test-types';

// Marker options
export type MarkerOptions = {
    // The icon value for the marker
    icon?: IconValue;
    // The title for the marker. If a custom tooltip is not used, this will show as a default tooltip on the marker
    // that shows when you hover over a link with a title.
    title?: string;
    // The selector for the parent element that tooltips are added to.
    // Ideally this is the map container, but it can be any element.
    tooltipContainer?: string;
    // The class name for the tooltip element. Defaults to "tooltip" if not set
    tooltipClass?: string;
};

/**
 * Marker class to set up a single marker and add it to the map
 */
export class Marker {
    /**
     * Holds the latitude/longitude pair
     */
    private latLng: LatLng;

    /**
     * Holds the Google maps marker object
     */
    private marker: google.maps.Marker;

    /**
     * Holds the title for the marker
     * @type {string}
     */
    private title: string;

    /**
     * Holds the tooltip element
     *
     * @type {HTMLElement}
     */
    private tooltip: HTMLElement;

    /**
     * Holds the element that tooltips are added to
     * @type {Element}
     */
    private tooltipContainer: Element;

    /**
     * The class name for the tooltip element
     * @type {string}
     */
    private tooltipClass: string = 'tooltip';

    /**
     * Constructor
     *
     * @param {LatLngValue} latLngValue The latitude longitude pair
     * @param {MarkerOptions} [options] The marker options
     */
    constructor(latLngValue: LatLngValue, options?: MarkerOptions) {
        this.latLng = latLng(latLngValue);

        // Set up the marker options
        const markerOptions: google.maps.MarkerOptions = {
            position: this.latLng.toJson(),
        };
        if (options.title && options.tooltipContainer) {
            // The title will be a custom tooltip that is added to the map container
            this.title = options.title;
            // Get the tooltip container and make sure it exists
            const container = document.querySelector(options.tooltipContainer);
            if (container) {
                this.tooltipContainer = container;
            } else {
                throw new Error('Invalid tool tip container selector');
            }
            // Set the tooltip element class name if necessary
            if (options.tooltipClass) {
                this.tooltipClass = options.tooltipClass;
            }
        } else if (options.title) {
            markerOptions.title = options.title;
        }
        if (options?.icon) {
            markerOptions.icon = icon(options.icon).get();
        }

        // Create the Google marker object
        this.marker = new google.maps.Marker(markerOptions);

        // If a custom tooltip is being used then create the tooltip element
        // and add the hover listeners on the marker
        if (this.tooltipContainer) {
            this.tooltip = document.createElement('div');
            this.tooltip.classList.add(this.tooltipClass);
            this.tooltip.innerHTML = this.title;
            this.tooltip.style.position = 'absolute';
            this.marker.addListener('mouseover', () => {
                const pixels = this.getPixelsFromLocation();
                this.tooltip.style.left = `${pixels.x}px`;
                this.tooltip.style.top = `${pixels.y}px`;
                this.tooltipContainer.appendChild(this.tooltip);
            });

            this.marker.addListener('mouseout', () => {
                this.tooltipContainer.removeChild(this.tooltip);
            });
        }
    }

    /**
     * Get the pixel location of the marker
     *
     * @returns {google.maps.Point}
     */
    private getPixelsFromLocation(): google.maps.Point {
        const map = this.marker.getMap() as google.maps.Map;
        const latLngPosition = this.marker.getPosition();
        const projection = map.getProjection();
        const bounds = map.getBounds();
        const topRight = projection.fromLatLngToPoint(bounds.getNorthEast());
        const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest());
        const scale = 2 ** map.getZoom();
        const worldPoint = projection.fromLatLngToPoint(latLngPosition);
        return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
    }

    /**
     * Adds the marker to the Google map object
     *
     * @param {Map} map The map object
     */
    addTo(map: Map): void {
        this.marker.setMap(map.get());
    }

    /**
     * Get the LatLng object
     *
     * @link https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
     * @returns {LatLng}
     */
    getLatLng(): LatLng {
        return this.latLng;
    }

    /**
     * Get the Google maps marker object
     *
     * @link https://developers.google.com/maps/documentation/javascript/reference/marker#Marker
     * @returns {google.maps.Marker}
     */
    get(): google.maps.Marker {
        return this.marker;
    }
}

// The possible values for the latLngValue parameter
export type MarkerValue = Marker | LatLngValue;

/**
 * Helper function to set up the marker object
 *
 * @param {MarkerValue} latLngValue The latitude/longitude pair
 * @param {MarkerOptions} [options] The marker options
 * @returns {Marker}
 */
export const marker = (latLngValue: MarkerValue, options?: MarkerOptions): Marker => {
    if (latLngValue instanceof Marker) {
        return latLngValue;
    }
    return new Marker(latLngValue, options);
};
