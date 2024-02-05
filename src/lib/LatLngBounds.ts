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

/* global google */

import Base from './Base';
import { checkForGoogleMaps, isObject } from './helpers';
import { latLng, LatLng, LatLngValue } from './LatLng';

/**
 * The LatLngBounds class to set up and manage latitude/longitude bounds
 */
export class LatLngBounds extends Base {
    /**
     * Holds the Google maps LatLngBounds object
     */
    #bounds: google.maps.LatLngBounds;

    /**
     * Constructor
     *
     * @param {LatLngValue | LatLngValue[]} [latLngValue] The latitude/longitude value(s). If not set then add points with the extend method.
     *      See comments on the extended method for the types of values that latLngValue can be.
     */
    constructor(latLngValue?: LatLngValue | LatLngValue[]) {
        super('latlngbounds');
        checkForGoogleMaps('LatLngBounds', 'LatLngBounds');
        this.#bounds = new google.maps.LatLngBounds();
        if (latLngValue) {
            this.extend(latLngValue);
        }
    }

    /**
     * Returns whether the the given LatLng value is within this bounds
     *
     * @param latLngValue The LatLng value to test
     * @returns {boolean}
     */
    contains(latLngValue: LatLngValue): boolean {
        const latLngObject = latLng(latLngValue);
        if (!latLngObject.isValid()) {
            throw new Error(
                `Invalid latitude/longitude data passed to LatLngBounds.contains. You passed: ${JSON.stringify(
                    latLngValue
                )}`
            );
        }
        return this.#bounds.contains(latLng(latLngValue).toGoogle());
    }

    /**
     * Returns whether this bounds approximately equals the given bounds
     *
     * @param other The LatLngBounds object to compare
     * @returns {boolean}
     */
    equals(other: LatLngBounds): boolean {
        if (other instanceof LatLngBounds) {
            return this.#bounds.equals(other.toGoogle());
        }
        return false;
    }

    /**
     * Extends this bounds to contain the given point
     *
     * https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds.extend
     *
     * The latLngValue parameter can be:
     * - an array of [lat, lng] pairs: [[lat, lng], [lat, lng], ...]
     * - an array of {lat, lng} objects (LatLngLiteral[]): [{lat, lng}, {lat, lng}, ...]
     * - an array of LatLng objects: [LatLng, LatLng, ...]
     * - a [lat, lng] pair
     * - a {lat, lng} object (LatLngLiteral)
     *
     * @param {LatLngValue | LatLngValue[]} latLngValue The latitude/longitude value(s)
     * @returns {LatLngBounds}
     */
    extend(latLngValue: LatLngValue | LatLngValue[]): LatLngBounds {
        if (Array.isArray(latLngValue)) {
            // Don't throw an error if the array is empty
            if (latLngValue.length > 0) {
                if (Array.isArray(latLngValue[0])) {
                    // The value is likely an array of LatLngValues.
                    const value = latLngValue as LatLngValue[];
                    value.forEach((latLngVal: LatLngValue) => {
                        this.extend(latLngVal);
                    });
                } else {
                    // This is likely the array version of a LatLngValue.
                    const latLngObject = latLng(latLngValue as LatLngValue);
                    if (latLngObject.isValid()) {
                        this.#bounds.extend(latLngObject.toGoogle());
                    } else {
                        throw new Error(
                            `Invalid latitude/longitude data passed to LatLngBounds. You passed: ${JSON.stringify(
                                latLngValue
                            )}`
                        );
                    }
                }
            } else {
                // eslint-disable-next-line no-console
                console.warn('The array passed to LatLngBounds.extend is empty. Nothing to extend.');
            }
        } else {
            // This is likely a LatLngValue.
            const latLngObject = latLng(latLngValue);
            if (latLngObject.isValid()) {
                this.#bounds.extend(latLngObject.toGoogle());
            } else {
                throw new Error(
                    `Invalid latitude/longitude data passed to LatLngBounds. You passed: ${JSON.stringify(latLngValue)}`
                );
            }
        }

        return this;
    }

    /**
     * Get the center of the LatLngBounds
     *
     * @returns {LatLng}
     */
    getCenter(): LatLng {
        const center = this.#bounds.getCenter();
        // Convert the center to a LatLngValue
        return latLng([center.lat(), center.lng()]);
    }

    /**
     * Get the Google maps LatLngBounds object
     *
     * @returns {google.maps.LatLngBounds}
     */
    toGoogle(): google.maps.LatLngBounds {
        return this.#bounds;
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
    return new LatLngBounds(latLngValue as LatLngValue);
};
