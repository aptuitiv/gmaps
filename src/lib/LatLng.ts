/* ===========================================================================
    LatLng - A class for representing a latitude/longitude pair

    All methods and options of other classes that take a Size object as a parameter
    also support the size value as an array of [x, y] pairs, or a {x, y} object.
    The following are equivalent:

    marker(new LatLng(40.730610, -73.935242));
    marker([40.730610, -73.935242]);
    marker({lat: 40.730610, lng: -73.935242});
    marker({latitude: 40.730610, longitude: -73.935242});

    The following are valid ways to set up a size object:

    latLng(40.730610, -73.935242);
    latLng([40.730610, -73.935242]);
    latLng({lat: 40.730610, lng: -73.935242});
    latLng({latitude: 40.730610, longitude: -73.935242});
    latLng(latLngClassInstance);
=========================================================================== */

import { isNumber, isNumberString, isObject } from './test-types';

// The object literal for a latitude/longitude pair.
// Example: `{lat: 32.33, lng: -64.45}`
export type LatLngLiteral = {
    lat: number | string;
    lng: number | string;
};

// The object literal for a latitude/longitude pair with expanded property names.
// Example: `{latitude: 32.33, longitude: -64.45}`
export type LatLngLiteralExpanded = {
    latitude: number | string;
    longitude: number | string;
};

// The possible types of latitude values
export type Latitude = number | number[] | string | string[] | LatLngLiteral | LatLngLiteralExpanded;

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
            if (
                typeof (latitude as LatLngLiteral).lat !== 'undefined' &&
                typeof (latitude as LatLngLiteral).lng !== 'undefined'
            ) {
                const latObject: LatLngLiteral = latitude as unknown as LatLngLiteral;
                if (
                    !isNumber(latObject.lat) ||
                    !isNumberString(latObject.lat) ||
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
            } else if (
                typeof (latitude as LatLngLiteralExpanded).latitude !== 'undefined' &&
                typeof (latitude as LatLngLiteralExpanded).longitude !== 'undefined'
            ) {
                const latObject: LatLngLiteralExpanded = latitude as unknown as LatLngLiteralExpanded;
                if (
                    !isNumber(latObject.latitude) ||
                    !isNumberString(latObject.latitude) ||
                    !isNumber(latObject.longitude) ||
                    !isNumberString(latObject.longitude)
                ) {
                    throw new Error('Invalid latitude/longitude pair');
                }
                if (isNumberString(latObject.latitude)) {
                    this.latitude = Number(latObject.latitude);
                } else {
                    this.latitude = latObject.latitude;
                }
                if (isNumberString(latObject.longitude)) {
                    this.longitude = Number(latObject.longitude);
                } else {
                    this.longitude = latObject.longitude;
                }
            } else {
                throw new Error('Invalid latitude/longitude object pair');
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
     * @link https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
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
export type LatLngValue = number[] | string[] | LatLngLiteral | LatLngLiteralExpanded | LatLng;

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
