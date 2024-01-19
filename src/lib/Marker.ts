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
import { latLng, LatLng, LatLngValue, LatLngLiteral, LatLngLiteralExpanded } from './LatLng';
import { Map } from './Map';
import { getPixelsFromLatLng, isObject } from './helpers';

// Marker options
export type MarkerOptions = {
    // The icon value for the marker
    icon?: IconValue;
    // The map to add the marker to.
    map?: Map | google.maps.Map;
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
     * @param {LatLngValue|MarkerOptions} latLngValue The latitude longitude pair
     * @param {MarkerOptions} [options] The marker options
     */
    constructor(latLngValue: LatLngValue | MarkerOptions, options?: MarkerOptions) {
        // Set the marker latitude and longitude value
        if (latLngValue instanceof LatLng) {
            // The value passed is a LatLng class object
            this.latLng = latLngValue;
        } else if (Array.isArray(latLngValue)) {
            // The value passed is likely an array of [lat, lng] pairs
            this.latLng = latLng(latLngValue);
        } else if (
            isObject(latLngValue) &&
            typeof (latLngValue as LatLngLiteral).lat !== 'undefined' &&
            typeof (latLngValue as LatLngLiteral).lng !== 'undefined'
        ) {
            // The value passed is an object with lat/lng properties
            this.latLng = latLng(latLngValue as LatLngLiteral);
        } else if (
            isObject(latLngValue) &&
            typeof (latLngValue as LatLngLiteralExpanded).latitude !== 'undefined' &&
            typeof (latLngValue as LatLngLiteralExpanded).longitude !== 'undefined'
        ) {
            // The value passed is an object with latitude/longitude properties or its
            // the marker options with latitude and longitude set
            this.latLng = latLng(latLngValue as LatLngLiteralExpanded);
        } else {
            throw new Error('Invalid latitude/longitude value for the marker');
        }

        // Set up the marker options
        const markerOptions: google.maps.MarkerOptions = {
            position: this.latLng.toJson(),
        };
        let opts: MarkerOptions = {};
        if (isObject(latLngValue)) {
            opts = latLngValue as MarkerOptions;
        } else if (isObject(options)) {
            opts = options;
        }

        if (opts.title && opts.tooltipContainer) {
            // The title will be a custom tooltip that is added to the map container
            this.title = opts.title;
            // Get the tooltip container and make sure it exists
            const container = document.querySelector(opts.tooltipContainer);
            if (container) {
                this.tooltipContainer = container;
            } else {
                throw new Error('Invalid tool tip container selector');
            }
            // Set the tooltip element class name if necessary
            if (opts.tooltipClass) {
                this.tooltipClass = opts.tooltipClass;
            }
        } else if (opts.title) {
            markerOptions.title = opts.title;
        }
        if (opts.icon) {
            markerOptions.icon = icon(opts.icon).get();
        }
        if (opts.map) {
            if (opts.map instanceof Map) {
                markerOptions.map = opts.map.get();
            } else if (opts.map instanceof google.maps.Map) {
                markerOptions.map = opts.map as google.maps.Map;
            }
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
                const pixels = getPixelsFromLatLng(this.marker.getMap() as google.maps.Map, this.marker.getPosition());
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
     * Adds the marker to the Google map object
     *
     * @param {Map|google.maps.Map} map The map object
     */
    addTo(map: Map | google.maps.Map): void {
        if (map instanceof Map) {
            this.marker.setMap(map.get());
        } else if (map instanceof google.maps.Map) {
            this.marker.setMap(map);
        }
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
export type MarkerValue = Marker | MarkerOptions | LatLngValue;

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
