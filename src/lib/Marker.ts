/* ===========================================================================
    Enables building and managing markers
=========================================================================== */

import { LatLng, LatLngValue } from './LatLng';
import { Map } from './Map';

// Marker configuration
export type MarkerConfig = {
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
     * @param {MarkerConfig} config The marker configuration
     */
    constructor(latLng: LatLngValue, config?: MarkerConfig) {
        if (latLng instanceof LatLng) {
            this.latLng = latLng;
        } else {
            this.latLng = new LatLng(latLng);
        }

        this.marker = new google.maps.Marker({
            position: this.latLng.toJson(),
            title: config?.title,
        });
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
 * @param {MarkerConfig} config The marker configuration
 * @returns {Marker}
 */
export const marker = (latLng: LatLngValue, config: MarkerConfig): Marker => new Marker(latLng, config);
