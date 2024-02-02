/* ===========================================================================
    A LatLngBounds instance represents a rectangle in geographical coordinates,
    including one that crosses the 180 degrees longitudinal meridian.
    https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds

    Example usage:
    const bounds = G.latLngBounds({
        latitude: 40.712,
        longitude: -74.227
    });
    bounds.extend([40.712, -74.227]);
    map.fitBounds(bounds);

    Or, you can call map fitBounds directly:
    map.fitBounds([
        [40.712, -74.227],
        [40.774, -74.125]
    ]);

    Or:
    map.fitBounds([
        {lat: 40.712, lng: -74.227},
        {lat: 40.774, lng: -74.125}
    ]);

    Or:
    map.fitBounds([
        G.latLng(40.712, -74.227),
        G.latLng(40.774, -74.125)
    ]);

    Or you can get the bounds from a marker:
    const marker = G.marker({
        latitude: 40.712,
        longitude: -74.227
    });
    marker.addTo(map);
    const bounds = G.latLngBounds();
    bounds.extend(marker.getPosition());
    map.fitBounds(bounds);
=========================================================================== */

import Base from './Base';
import { checkForGoogleMaps } from './helpers';
import { latLng, LatLng, LatLngValue } from './LatLng';

/**
 * The LatLngBounds class to set up and manage latitude/longitude bounds
 */
export class LatLngBounds extends Base {
    /**
     * Holds the Google maps LatLngBounds object
     */
    private bounds: google.maps.LatLngBounds;

    /**
     * Constructor
     *
     * @param {LatLngValue} [latLngValue] The latitude/longitude value. If not set then add points with the extend method.
     *      See comments on the extended method for the types of values that latLngValue can be.
     */
    constructor(latLngValue?: LatLngValue) {
        super('latlngbounds');
        checkForGoogleMaps('LatLngBounds', 'LatLngBounds');
        this.bounds = new google.maps.LatLngBounds();
        if (latLngValue) {
            this.extend(latLngValue);
        }
    }

    /**
     * Extends this bounds to contain the given point
     *
     * @link https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds.extend
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
 * See comments on the extended method in the LatLngBounds class for the types of values
 * that latLngValue can be.
 *
 * @param {LatLngBoundsValue} [latLngValue] The latitude/longitude bounds value
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
