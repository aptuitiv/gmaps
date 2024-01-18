/* ===========================================================================
    Enables building and managing markers
=========================================================================== */

import { icon, IconValue } from './Icon';
import { LatLng, LatLngValue } from './LatLng';
import { Map } from './Map';

// Marker options
export type MarkerOptions = {
    icon?: IconValue;
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
     * @param {LatLngValue} latLng The latitude longitude pair
     * @param {MarkerOptions} options The marker options
     */
    constructor(latLng: LatLngValue, options?: MarkerOptions) {
        if (latLng instanceof LatLng) {
            this.latLng = latLng;
        } else {
            this.latLng = new LatLng(latLng);
        }

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

        this.marker = new google.maps.Marker(markerOptions);

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

    private getPixelsFromLocation() {
        const map = this.marker.getMap() as google.maps.Map;
        console.log('MAP: ', map);
        const latLng = this.marker.getPosition();
        const projection = map.getProjection();
        const bounds = map.getBounds();
        const topRight = projection.fromLatLngToPoint(bounds.getNorthEast());
        const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest());
        const scale = 2 ** map.getZoom();
        const worldPoint = projection.fromLatLngToPoint(latLng);
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
     * @returns {LatLng}
     */
    getLatLng(): LatLng {
        return this.latLng;
    }

    /**
     * Get the Google maps marker object
     *
     * @returns {google.maps.Marker}
     */
    get(): google.maps.Marker {
        return this.marker;
    }
}

/**
 * Helper function to set up the marker object
 *
 * @param {LatLngValue} latLng The latitude/longitude pair
 * @param {MarkerOptions} options The marker options
 * @returns {Marker}
 */
export const marker = (latLng: LatLngValue, options: MarkerOptions): Marker => new Marker(latLng, options);