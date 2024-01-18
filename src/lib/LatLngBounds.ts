/* ===========================================================================
    A LatLngBounds instance represents a rectangle in geographical coordinates,
    including one that crosses the 180 degrees longitudinal meridian.
    https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds
=========================================================================== */

import { latLng, LatLng, LatLngValue } from './LatLng';

/**
 * The LatLngBounds class to set up and manage latitude/longitude bounds
 */
export class LatLngBounds {
    /**
     * Holds the Google maps LatLngBounds object
     */
    private bounds: google.maps.LatLngBounds;

    constructor(latLngValue?: LatLngValue) {
        this.bounds = new google.maps.LatLngBounds();
        if (latLngValue) {
            this.extend(latLngValue);
        }
    }

    /**
     * Extends this bounds to contain the given point
     *
     * @param {LatLngValue} latLngValue The latitude/longitude value
     */
    extend(latLngValue: LatLngValue): void {
        if (latLngValue instanceof LatLng) {
            this.bounds.extend(latLngValue.get());
        } else if (Array.isArray(latLngValue) && latLngValue.length === 2) {
            this.bounds.extend(latLng(latLngValue).get());
        } else {
            throw new Error('Invalid latitude/longitude pair');
        }
    }

    /**
     * Get the Google maps LatLngBounds object
     *
     * @returns {google.maps.LatLngBounds}
     */
    get(): google.maps.LatLngBounds {
        return this.bounds;
    }
}

export type LatLngBoundsValue = LatLngValue | LatLngValue[] | LatLngBounds;

/**
 * Helper function to set up the LatLngBounds object
 *
 * The latLngValue parameter can be:
 * - a LatLngBounds object
 * - an array of [lat, lng] pairs: [[lat, lng], [lat, lng], ...]
 * - an array of {lat, lng} objects (LatLngLiteral[]): [{lat, lng}, {lat, lng}, ...]
 * - an array of LatLng objects: [LatLng, LatLng, ...]
 * - a LatLng object
 * - a [lat, lng] pair
 * - a {lat, lng} object (LatLngLiteral)
 *
 * @param {LatLngBoundsValue} latLngValue The latitude/longitude bounds value
 * @returns {LatLngBounds}
 */
export const latLngBounds = (latLngValue?: LatLngBoundsValue): LatLngBounds => {
    if (latLngValue instanceof LatLngBounds) {
        return latLngValue;
    }
    if (Array.isArray(latLngValue) && Array.isArray(latLngValue[0]) && latLngValue[0].length === 2) {
        // The value is an array of LatLngValue values.
        // This could be an array of [lat, lng] pairs, an aray of {lat, lng} objects,
        // or an array of LatLng objects.
        const bounds = new LatLngBounds();
        const value = latLngValue as LatLngValue[];
        value.forEach((latLngVal: LatLngValue) => {
            bounds.extend(latLngVal);
        });
        return bounds;
    }
    return new LatLngBounds(latLngValue as LatLngValue);
};
