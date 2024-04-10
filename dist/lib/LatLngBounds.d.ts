/// <reference types="google.maps" />
import Base from './Base';
import { LatLng, LatLngValue } from './LatLng';
/**
 * The LatLngBounds class to set up and manage latitude/longitude bounds
 */
export declare class LatLngBounds extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {LatLngValue | LatLngValue[]} [latLngValue] The latitude/longitude value(s). If not set then add points with the extend method.
     *      See comments on the extended method for the types of values that latLngValue can be.
     */
    constructor(latLngValue?: LatLngValue | LatLngValue[]);
    /**
     * Returns whether the the given LatLng value is within this bounds
     *
     * @param {LatLngValue} latLngValue The LatLng value to test
     * @returns {boolean}
     */
    contains(latLngValue: LatLngValue): boolean;
    /**
     * Returns whether this bounds approximately equals the given bounds
     *
     * @param {LatLngBounds} other The LatLngBounds object to compare
     * @returns {boolean}
     */
    equals(other: LatLngBounds): boolean;
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
    extend(latLngValue: LatLngValue | LatLngValue[]): LatLngBounds;
    /**
     * Get the center of the LatLngBounds
     *
     * @returns {LatLng}
     */
    getCenter(): LatLng;
    /**
     * Get the north-east corner of the LatLngBounds
     *
     * @returns {LatLng}
     */
    getNorthEast(): LatLng;
    /**
     * Get the south-west corner of the LatLngBounds
     *
     * @returns {LatLng}
     */
    getSouthWest(): LatLng;
    /**
     * Returns whether this bounds shares any points with the other bounds
     *
     * @param {LatLngBounds} other The LatLngBounds object to compare
     * @returns {boolean}
     */
    intersects(other: LatLngBounds): boolean;
    /**
     * Returns whether this bounds is empty
     *
     * @returns {boolean}
     */
    isEmpty(): boolean;
    /**
     * Get the Google maps LatLngBounds object
     *
     * @returns {google.maps.LatLngBounds}
     */
    toGoogle(): google.maps.LatLngBounds;
    /**
     * Converts the LatLngBounds object to a JSON object
     *
     * @returns {google.maps.LatLngBoundsLiteral}
     */
    toJson(): google.maps.LatLngBoundsLiteral;
    /**
     * Converts the LatLngBounds object to a lat/lng span
     *
     * @returns {LatLng}
     */
    toSpan(): LatLng;
    /**
     * Converts the LatLngBounds object to a string
     *
     * @returns {string}
     */
    toString(): string;
    /**
     * Returns the LatLngBounds object as a string that can be used in a URL
     *
     * @param {number} [precision] The number of decimal places to round the lat/lng values to
     * @returns {string}
     */
    toUrlValue(precision?: number): string;
    /**
     * Extends this bounds to contain the union of this and the given bounds
     *
     * @param {LatLngBounds} other The LatLngBounds object to join with
     * @returns {LatLngBounds}
     */
    union(other: LatLngBounds): LatLngBounds;
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
export declare const latLngBounds: (latLngValue?: LatLngBoundsValue) => LatLngBounds;
