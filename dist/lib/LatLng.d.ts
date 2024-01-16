type LatLngLiteral = {
    lat: number;
    lng: number;
};
export type Latitude = number | number[] | LatLngLiteral;
/**
 * The LatLng class to set up and manage latitude/longitude pairs
 */
export declare class LatLng {
    /**
     * Holds the latitude
     */
    latitude: number;
    /**
     * Holds the longitude
     */
    longitude: number;
    /**
     * Constructor
     *
     * @param {Latitude} latitude The latitude value or the latitude/longitude pair
     * @param {number} [longitude] The longitude value
     */
    constructor(latitude: Latitude, longitude?: number);
    /**
     * Returns the longitude value
     *
     * @returns {number}
     */
    lat(): number;
    /**
     * Returns the latitude value
     *
     * @returns {number}
     */
    lng(): number;
    /**
     * Converts the latitude/longitude pair to a JSON object
     *
     * @returns {LatLngLiteral}
     */
    toJson(): LatLngLiteral;
}
export type LatLngValue = number[] | LatLngLiteral | LatLng;
/**
 * Helper function to set up a new LatLng object value
 *
 * @param {Latitude} latitude The latitude value or the latitude/longitude pair
 * @param {number} [longitude] The longitude value
 * @returns {LatLng}
 */
export declare const latLng: (latitude: Latitude, longitude?: number) => LatLng;
export {};
