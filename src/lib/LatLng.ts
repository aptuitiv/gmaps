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

import Base from './Base';
import { checkForGoogleMaps, isNumber, isNumberOrNumberString, isNumberString, isObject } from './helpers';

// The object literal for a latitude/longitude pair.
// The values are optional so that this type can be used when building a lat/lng object pair.
// In reality, both values are required.
// Example: `{lat: 32.33, lng: -64.45}`
export type LatLngLiteral = {
    lat?: number | string;
    lng?: number | string;
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
export class LatLng extends Base {
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
        super('latlng');
        if (Array.isArray(latitude)) {
            const [lat, lng] = latitude;
            if ((isNumber(lat) || isNumberString(lat)) && (isNumber(lng) || isNumberString(lng))) {
                if (isNumberString(lat)) {
                    this.latitude = Number(lat);
                } else {
                    this.latitude = lat;
                }
                if (isNumberString(lng)) {
                    this.longitude = Number(lng);
                } else {
                    this.longitude = lng;
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
                if (!isNumberOrNumberString(latObject.lat) || !isNumberOrNumberString(latObject.lng)) {
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
                if (!isNumberOrNumberString(latObject.latitude) || !isNumberOrNumberString(latObject.latitude)) {
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
    }

    /**
     * Returns the longitude value
     *
     * @returns {number}
     */
    getLat(): number {
        return this.latitude;
    }

    /**
     * Returns the latitude value
     *
     * @returns {number}
     */
    getLng(): number {
        return this.longitude;
    }

    /**
     * Get the Google maps LatLng object
     *
     * @link https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
     * @returns {google.maps.LatLng|null}
     */
    get(): google.maps.LatLng | null {
        if (checkForGoogleMaps('LatLng', 'LatLng')) {
            if (!isObject(this.latLngObject)) {
                this.latLngObject = new google.maps.LatLng(this.latitude, this.longitude);
            }
            return this.latLngObject;
        }
        return null;
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
export const latLng = (latitude: LatLngValue | string | number, longitude?: number | string): LatLng => {
    if (latitude instanceof LatLng) {
        return latitude;
    }
    return new LatLng(latitude, longitude);
};
