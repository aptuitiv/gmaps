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

/* global google */

import Base from './Base';
import { checkForGoogleMaps, isNumber, isNumberString, isObject } from './helpers';

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
     *
     * @private
     * @type {google.maps.LatLng}
     */
    latLngObject: google.maps.LatLng;

    /**
     * Holds the latitude
     *
     * @private
     * @type {number}
     */
    latitude: number;

    /**
     * Holds the longitude
     *
     * @private
     * @type {number}
     */
    longitude: number;

    /**
     * Constructor
     *
     * @param {Latitude} latitude The latitude value or the latitude/longitude pair
     * @param {number|string} [longitude] The longitude value
     */
    constructor(latitude?: Latitude, longitude?: number | string) {
        super('latlng');
        if (Array.isArray(latitude)) {
            const [lat, lng] = latitude;
            this.setLat(lat);
            this.setLng(lng);
        } else if (isObject(latitude)) {
            if (typeof (latitude as LatLngLiteral).lat !== 'undefined') {
                this.setLat((latitude as LatLngLiteral).lat);
            } else if (typeof (latitude as LatLngLiteralExpanded).latitude !== 'undefined') {
                this.setLat((latitude as LatLngLiteralExpanded).latitude);
            }
            if (typeof (latitude as LatLngLiteral).lng !== 'undefined') {
                this.setLng((latitude as LatLngLiteral).lng);
            } else if (typeof (latitude as LatLngLiteralExpanded).longitude !== 'undefined') {
                this.setLng((latitude as LatLngLiteralExpanded).longitude);
            }
        } else {
            this.setLat(latitude);
            this.setLng(longitude);
        }
    }

    /**
     * Sets the latitude value
     *
     * @param {number|string} lat The latitude value. Ideally it's a number, but it could be a number string
     * @returns {LatLng}
     */
    setLat(lat: number | string): LatLng {
        if (isNumberString(lat)) {
            this.latitude = Number(lat);
        } else if (isNumber(lat)) {
            this.latitude = lat;
        }
        return this;
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
     * Sets the longitude value
     *
     * @param {number|string} lng The longitude value. Ideally it's a number, but it could be a number string
     * @returns {LatLng}
     */
    setLng(lng: number | string): LatLng {
        if (isNumberString(lng)) {
            this.longitude = Number(lng);
        } else if (isNumber(lng)) {
            this.longitude = lng;
        }
        return this;
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
     * https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
     *
     * @returns {google.maps.LatLng|null}
     */
    get(): google.maps.LatLng | null {
        if (!this.isValid()) {
            throw new Error(
                `Invalid latitude/longitude pair. One or both values are missing. Latitude: ${this.latitude}, Longitude: ${this.longitude}`
            );
        }
        if (checkForGoogleMaps('LatLng', 'LatLng')) {
            if (!isObject(this.latLngObject)) {
                this.latLngObject = new google.maps.LatLng(this.latitude, this.longitude);
            }
            return this.latLngObject;
        }
        return null;
    }

    /**
     * Returns whether the latitude/longitude pair is a valid value
     *
     * @returns {boolean}
     */
    isValid(): boolean {
        return isNumber(this.latitude) && isNumber(this.longitude);
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
 * @param {LatLngValue} [latitude] The latitude value or the latitude/longitude pair
 * @param {number|string} [longitude] The longitude value
 * @returns {LatLng}
 */
export const latLng = (latitude?: LatLngValue | string | number, longitude?: number | string): LatLng => {
    if (latitude instanceof LatLng) {
        return latitude;
    }
    return new LatLng(latitude, longitude);
};
