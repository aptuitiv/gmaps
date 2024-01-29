/// <reference types="google.maps" />
import { LatLngValue } from './LatLng';
/**
 * The LatLngBounds class to set up and manage latitude/longitude bounds
 */
export declare class LatLngBounds {
    /**
     * Holds the Google maps LatLngBounds object
     */
    private bounds;
    /**
     * The type of object. For this class it will always be "latlngbounds"
     *
     * You can use this in your logic to determine what type of object you're dealing with.
     * if (thing.objectType === 'latlngbounds') {}
     */
    objectType: string;
    /**
     * Constructor
     *
     * @param {LatLngValue} [latLngValue] The latitude/longitude value. If not set then add points with the extend method.
     *      See comments on the extended method for the types of values that latLngValue can be.
     */
    constructor(latLngValue?: LatLngValue);
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
    extend(latLngValue: LatLngValue): void;
    /**
     * Get the Google maps LatLngBounds object
     *
     * @returns {google.maps.LatLngBounds}
     */
    get(): google.maps.LatLngBounds;
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
