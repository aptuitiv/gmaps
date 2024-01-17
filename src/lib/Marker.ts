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

        this.marker = new google.maps.Marker({
            position: this.latLng.toJson(),
            title: options?.title,
        });
        console.log('Marker options', options);
        if (options?.icon) {
            this.marker.setIcon(icon(options.icon).get());
        }
    }

    /**
     * Adds the marker to the Google map object
     *
     * @param {Map} map The map object
     */
    addTo(map: Map): void {
        this.marker.setMap(map.get());
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
