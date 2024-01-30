/// <reference types="google.maps" />
import { Libraries } from '@googlemaps/js-api-loader';
import { LatLngBoundsValue } from './LatLngBounds';
import { LatLng } from './LatLng';
import { Evented } from './Evented';
export type MapOptions = {
    apiKey: string;
    latitude: number;
    libraries?: Libraries;
    longitude: number;
    version?: string;
    zoom?: number;
};
type LocateOptions = {
    enableHighAccuracy?: boolean;
    maximumAge?: number;
    timeout?: number;
    watch?: boolean;
};
type LocationPosition = {
    accuracy?: number;
    altitude?: number;
    altitudeAccuracy?: number;
    heading?: number;
    latitude: number;
    latLng: LatLng;
    longitude: number;
    speed?: number;
    timestamp: number;
};
type LocationOnSuccess = (position: LocationPosition) => void;
/**
 * The map class
 */
export declare class Map extends Evented {
    /**
     * Holds the Google Maps API key
     */
    private apiKey;
    /**
     * Holds the id of the element that the map will be rendered in
     */
    private id;
    /**
     * Holds the libraries to load with Google maps
     */
    private libraries;
    /**
     * Holds the Google map object
     */
    private map;
    /**
     * Holds the options object for the Google maps object
     */
    private mapOptions;
    /**
     * The type of object. For this class it will always be "map"
     *
     * You can use this in your logic to determine what type of object you're dealing with.
     * if (thing.objectType === 'map') {}
     */
    objectType: string;
    /**
     * Holds the version of the Google Maps API to load
     */
    private version;
    /**
     * Holds the watchId for the watchPosition() function
     */
    private watchId;
    /**
     * Class constructor
     *
     * @param {string} id The id of the element that the map will be rendered in
     * @param {MapOptions} options The options object for the map
     */
    constructor(id: string, options: MapOptions);
    /**
     * Load and display the map
     *
     * There are two ways to respond when the map loads:
     * 1. Pass a callback function to the load() function
     *   map.load(() => {
     *     // Do something after the map loads
     *   });
     * 2. Listen for the 'load' event
     *   map.on('load', () => {
     *      // Do something after the map loads
     *   });
     * 2a. Use the once() function to listen for the 'load' event only once. The event
     *     listener will be removed after the event is dispatched.
     *   map.once('load', () => {
     *     // Do something after the map loads
     *   });
     *
     * @param {function} callback The callback function to call after the map loads
     */
    load(callback?: () => void): void;
    /**
     * Returns the Google map object
     *
     * @returns {google.maps.Map}
     */
    get(): google.maps.Map;
    /**
     * Sets the viewport to contain the given bounds.
     *
     * The bounds parameter can be:
     * - a LatLngBounds object
     * - an array of [lat, lng] pairs: [[lat, lng], [lat, lng], ...]
     * - an array of {lat, lng} objects (LatLngLiteral[]): [{lat, lng}, {lat, lng}, ...]
     * - an array of LatLng objects: [LatLng, LatLng, ...]
     * - a LatLng object
     * - a [lat, lng] pair
     * - a {lat, lng} object (LatLngLiteral)
     *
     * @see https://developers.google.com/maps/documentation/javascript/reference/map#Map.fitBounds
     *
     * Usage:
     * Add marks to the map.
     * Then call map.fitBounds() to set the viewport to contain the markers.
     *
     * @param {LatLngBoundsValue} bounds The bounds to fit
     * @return {Map}
     */
    fitBounds(bounds: LatLngBoundsValue): Map;
    /**
     * Try to locate the user usin gthe GeoLocation API
     *
     * There are two ways to handle when the user's location is found:
     * 1. Pass a callback function to the locate() function
     *  map.locate({}, (position) => {
     *    // Do something with the position
     *  });
     * 2. Listen for the 'locationfound' event
     *  map.on('locationfound', (event) => {
     *   // Do something with the position
     *   // event is an instance of CustomEvent.
     *   // event.detail contains the position data
     *  });
     *
     * @param {LocateOptions|LocationOnSuccess} [options] The options for the locate() function. Or the callback function.
     * @param {function} [onSuccess] The callback function for when the user's location is found.
     *
     * @returns {Map}
     */
    locate(options?: LocateOptions | LocationOnSuccess, onSuccess?: LocationOnSuccess): Map;
    /**
     * Stop watching for the user's location
     *
     * @returns {Map}
     */
    stopLocate(): Map;
}
/**
 * Helper function to set up the map object
 *
 * @param {string} id The id of the element that the map will be rendered in
 * @param {MapOptions} config The map options
 * @returns {Map}
 */
export declare const map: (id: string, config: MapOptions) => Map;
export {};
