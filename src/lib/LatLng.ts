/* ===========================================================================
    LatLng - A class for representing a latitude/longitude pair
=========================================================================== */

import { isNumber, isNumberString, isObject } from './test-types';

// The object literal for a latitude/longitude pair.
// Example: `{lat: 32.33, lng: -64.45}`
type LatLngLiteral = {
    lat: number | string;
    lng: number | string;
};

// The possible types of latitude values
export type Latitude = number | number[] | string | string[] | LatLngLiteral;

/**
 * The LatLng class to set up and manage latitude/longitude pairs
 */
export class LatLng {
    /**
     * Holds the Google maps LatLng object
     * @type {google.maps.LatLng}
     */
    latLngObject: google.maps.LatLng;

    /**
     * Holds the latitude
     * @type {number}
     */
    latitude: number;

    /**
     * Holds the longitude
     * @type {number}
     */
    longitude: number;

    /**
     * Constructor
     *
     * @param {Latitude} latitude The latitude value or the latitude/longitude pair
     * @param {number|string} [longitude] The longitude value
     */
    constructor(latitude: Latitude, longitude?: number | string) {
        if (Array.isArray(latitude)) {
            if (
                (isNumber(latitude[0]) || isNumberString(latitude[0])) &&
                (isNumber(latitude[1]) || isNumberString(latitude[1]))
            ) {
                if (isNumberString(latitude[0])) {
                    this.latitude = Number(latitude[0]);
                } else {
                    [this.latitude] = latitude;
                }
                if (isNumberString(latitude[1])) {
                    this.longitude = Number(latitude[1]);
                } else {
                    this.longitude = latitude.pop() as number;
                }
            } else {
                throw new Error('Invalid latitude/longitude pair');
            }
        } else if (isObject(latitude)) {
            const latObject: LatLngLiteral = latitude as unknown as LatLngLiteral;
            if (
                typeof latObject.lat === 'undefined' ||
                !isNumber(latObject.lat) ||
                !isNumberString(latObject.lat) ||
                typeof latObject.lng === 'undefined' ||
                !isNumber(latObject.lng) ||
                !isNumberString(latObject.lng)
            ) {
                throw new Error('Invalid latitude/longitude pair');
            }
            if (isNumberString(latObject.lat)) {
                this.latitude = Number(latObject.lat);
            } else {
                this.latitude = latObject.lat;
            }
            if (isNumberString(latObject.lng)) {
                this.longitude = Number(latObject.lng);
            } else {
                this.longitude = latObject.lng;
            }
        } else {
            if (isNumberString(latitude)) {
                this.latitude = Number(latitude);
            } else {
                this.latitude = latitude;
            }
            if (isNumberString(longitude)) {
                this.longitude = Number(longitude);
            } else {
                this.longitude = longitude;
            }
        }
        this.latLngObject = new google.maps.LatLng(this.latitude, this.longitude);
    }

    /**
     * Returns the longitude value
     *
     * @returns {number}
     */
    lat(): number {
        return this.latitude;
    }

    /**
     * Returns the latitude value
     *
     * @returns {number}
     */
    lng(): number {
        return this.longitude;
    }

    /**
     * Get the Google maps LatLng object
     *
     * @returns {google.maps.LatLng}
     */
    get(): google.maps.LatLng {
        return this.latLngObject;
    }

    /**
     * Converts the latitude/longitude pair to a JSON object
     *
     * @returns {google.maps.LatLngLiteral}
     */
    toJson(): google.maps.LatLngLiteral {
        return {
            lat: this.latitude,
            lng: this.longitude,
        };
    }
}

// The possible types of latitude/longitude pair values
export type LatLngValue = Latitude | LatLng;

/**
 * Helper function to set up a new LatLng object value
 *
 * @param {LatLngValue} latitude The latitude value or the latitude/longitude pair
 * @param {number|string} [longitude] The longitude value
 * @returns {LatLng}
 */
export const latLng = (latitude: LatLngValue, longitude?: number | string): LatLng => {
    if (latitude instanceof LatLng) {
        return latitude;
    }
    return new LatLng(latitude, longitude);
};
