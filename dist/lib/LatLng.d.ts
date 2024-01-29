/// <reference types="google.maps" />
export type LatLngLiteral = {
    lat: number | string;
    lng: number | string;
};
export type LatLngLiteralExpanded = {
    latitude: number | string;
    longitude: number | string;
};
export type Latitude = number | number[] | string | string[] | LatLngLiteral | LatLngLiteralExpanded;
/**
 * The LatLng class to set up and manage latitude/longitude pairs
 */
export declare class LatLng {
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
     * The type of object. For this class it will always be "latlng"
     *
     * You can use this in your logic to determine what type of object you're dealing with.
     * if (thing.objectType === 'latlng') {}
     */
    objectType: string;
    /**
     * Constructor
     *
     * @param {Latitude} latitude The latitude value or the latitude/longitude pair
     * @param {number|string} [longitude] The longitude value
     */
    constructor(latitude: Latitude, longitude?: number | string);
    /**
     * Returns the longitude value
     *
     * @returns {number}
     */
    getLat(): number;
    /**
     * Returns the latitude value
     *
     * @returns {number}
     */
    getLng(): number;
    /**
     * Get the Google maps LatLng object
     *
     * @link https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
     * @returns {google.maps.LatLng}
     */
    get(): google.maps.LatLng;
    /**
     * Converts the latitude/longitude pair to a JSON object
     *
     * @returns {google.maps.LatLngLiteral}
     */
    toJson(): google.maps.LatLngLiteral;
}
export type LatLngValue = number[] | string[] | LatLngLiteral | LatLngLiteralExpanded | LatLng;
/**
 * Helper function to set up a new LatLng object value
 *
 * @param {LatLngValue} latitude The latitude value or the latitude/longitude pair
 * @param {number|string} [longitude] The longitude value
 * @returns {LatLng}
 */
export declare const latLng: (latitude: LatLngValue | string | number, longitude?: number | string) => LatLng;
