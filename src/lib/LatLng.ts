/* ===========================================================================
    LatLng - A class for representing a latitude/longitude pair

    See https://aptuitiv.github.io/gmaps-docs/api-reference/utilities/latlng for documentation.
=========================================================================== */

/* global google */

import Base from './Base';
import { checkForGoogleMaps, isFunction, isNumber, isNumberString, isObject } from './helpers';

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
    #latLngObject: google.maps.LatLng;

    /**
     * Holds the latitude
     *
     * @private
     * @type {number}
     */
    #latitude: number;

    /**
     * Holds the longitude
     *
     * @private
     * @type {number}
     */
    #longitude: number;

    /**
     * Whether the latitude/longitude pair values have changed since the last time they were set
     *
     * @type {boolean}
     */
    #valuesChanged: boolean = false;

    /**
     * Constructor
     *
     * @param {Latitude|LatLng|google.maps.LatLng} latitude The latitude value or the latitude/longitude pair
     * @param {number|string} [longitude] The longitude value
     */
    constructor(latitude?: Latitude | LatLng | google.maps.LatLng, longitude?: number | string) {
        super('latlng');
        if (typeof latitude !== 'undefined') {
            this.set(latitude, longitude);
        }
    }

    /**
     * Get the latitude value
     *
     * @returns {number}
     */
    get latitude(): number {
        return this.#latitude ?? 0;
    }

    /**
     * Set the latitude value
     *
     * @param {number|string} latitude The latitude value. Ideally it's a number but it could be a number string
     */
    set latitude(latitude: number | string) {
        if (isNumberString(latitude)) {
            this.#latitude = Number(latitude);
        } else if (isNumber(latitude)) {
            this.#latitude = latitude;
        }
        this.#valuesChanged = true;
    }

    /**
     * Get the latitude value (shortened version of the latitude property)
     *
     * @returns {number}
     */
    get lat(): number {
        return this.#latitude ?? 0;
    }

    /**
     * Set the latitude value
     *
     * @param {number|string} latitude The latitude value. Ideally it's a number but it could be a number string
     */
    set lat(latitude: number | string) {
        this.latitude = latitude;
    }

    /**
     * Get the longitude value
     *
     * @returns {number}
     */
    get longitude(): number {
        return this.#longitude ?? 0;
    }

    /**
     * Set the longitude value
     *
     * @param {number|string} longitude The longitude value. Ideally it's a number but it could be a number string
     */
    set longitude(longitude: number | string) {
        if (isNumberString(longitude)) {
            this.#longitude = Number(longitude);
        } else if (isNumber(longitude)) {
            this.#longitude = longitude;
        }
        this.#valuesChanged = true;
    }

    /**
     * Get the longitude value (shortened version of the longitude property)
     *
     * @returns {number}
     */
    get lng(): number {
        return this.#longitude ?? 0;
    }

    /**
     * Set the longitude value
     *
     * @param {number|string} longitude The longitude value. Ideally it's a number but it could be a number string
     */
    set lng(longitude: number | string) {
        this.longitude = longitude;
    }

    /**
     * Returns a new copy of the latitude/longitude pair
     *
     * @returns {LatLng}
     */
    clone(): LatLng {
        return new LatLng(this.#latitude, this.#longitude);
    }

    /**
     * Tests to see if the given latitude/longitude pair is equal to this latitude/longitude pair
     *
     * @param {number[] | string[] | LatLngLiteral | LatLngLiteralExpanded | LatLng} other The latitude/longitude pair to compare to
     * @returns {boolean}
     */
    equals(other: number[] | string[] | LatLngLiteral | LatLngLiteralExpanded | LatLng): boolean {
        let isEqual = false;
        const otherLatLng = new LatLng(other);
        if (otherLatLng.isValid()) {
            isEqual = this.latitude === otherLatLng.latitude && this.longitude === otherLatLng.longitude;
        }
        return isEqual;
    }

    /**
     * Set the latitude/longitude pair
     *
     * @param {Latitude|LatLng} latitude The latitude value or the latitude/longitude pair
     * @param {number|string} longitude The longitude value
     * @returns {LatLng}
     */
    set(latitude: Latitude | LatLng | google.maps.LatLng, longitude?: number | string): LatLng {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        if (Array.isArray(latitude)) {
            const [lat, lng] = latitude;
            this.latitude = lat;
            this.longitude = lng;
        } else if (isObject(latitude)) {
            if (isFunction((latitude as google.maps.LatLng).lat)) {
                this.latitude = (latitude as google.maps.LatLng).lat();
            } else if (typeof (latitude as LatLngLiteral).lat !== 'undefined') {
                this.latitude = (latitude as LatLngLiteral).lat;
            } else if (typeof (latitude as LatLngLiteralExpanded).latitude !== 'undefined') {
                this.latitude = (latitude as LatLngLiteralExpanded).latitude;
            }
            if (isFunction((latitude as google.maps.LatLng).lng)) {
                this.longitude = (latitude as google.maps.LatLng).lng();
            } else if (typeof (latitude as LatLngLiteral).lng !== 'undefined') {
                this.longitude = (latitude as LatLngLiteral).lng;
            } else if (typeof (latitude as LatLngLiteralExpanded).longitude !== 'undefined') {
                this.longitude = (latitude as LatLngLiteralExpanded).longitude;
            }
        } else if ((latitude as any) instanceof LatLng) {
            this.latitude = (latitude as any).getLat();
            this.longitude = (latitude as any).getLng();
        } else {
            this.latitude = latitude;
            this.longitude = longitude;
        }
        /* eslint-enable @typescript-eslint/no-explicit-any */
        return this;
    }

    /**
     * Sets the latitude value
     *
     * @param {number|string} lat The latitude value. Ideally it's a number, but it could be a number string
     * @returns {LatLng}
     */
    setLat(lat: number | string): LatLng {
        this.latitude = lat;
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
        this.longitude = lng;
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
    toGoogle(): google.maps.LatLng | null {
        if (!this.isValid()) {
            throw new Error(
                `Invalid latitude/longitude pair. One or both values are missing. Latitude: ${this.latitude}, Longitude: ${this.longitude}`
            );
        }
        if (checkForGoogleMaps('LatLng', 'LatLng')) {
            if (!isObject(this.#latLngObject) || this.#valuesChanged) {
                this.#latLngObject = new google.maps.LatLng(this.latitude, this.longitude);
                this.#valuesChanged = false;
            }
            return this.#latLngObject;
        }
        return null;
    }

    /**
     * Returns whether the latitude/longitude pair are valid values
     *
     * @returns {boolean}
     */
    isValid(): boolean {
        return isNumber(this.#latitude) && isNumber(this.#longitude);
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
export type LatLngValue = number[] | string[] | LatLngLiteral | LatLngLiteralExpanded | LatLng | google.maps.LatLng;

/**
 * Helper function to set up a new LatLng object value
 *
 * @param {LatLngValue} [latitude] The latitude value or the latitude/longitude pair
 * @param {number|string} [longitude] The longitude value
 * @returns {LatLng}
 */
export const latLng = (latitude?: LatLngValue | string | number, longitude?: number | string): LatLng =>
    new LatLng(latitude, longitude);

/**
 * Converts the Google maps LatLng object to a LatLng object
 *
 * @param {google.maps.LatLng} googleLatLng The Google maps LatLng object
 * @returns {LatLng}
 */
export const latLngConvert = (googleLatLng: google.maps.LatLng): LatLng =>
    new LatLng(googleLatLng.lat(), googleLatLng.lng());
