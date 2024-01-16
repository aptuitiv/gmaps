/// <reference types="google.maps" />
import { Libraries } from '@googlemaps/js-api-loader';
export type MapConfig = {
    apiKey: string;
    latitude: number;
    libraries?: Libraries;
    longitude: number;
    version?: string;
    zoom?: number;
};
/**
 * The map class
 */
export declare class Map {
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
     * Holds the configuration object for the Google maps object
     */
    private mapConfig;
    /**
     * Holds the version of the Google Maps API to load
     */
    private version;
    /**
     * Class constructor
     *
     * @param {string} id The id of the element that the map will be rendered in
     * @param {MapConfig} configuration The configuration object for the map
     */
    constructor(id: string, configuration: MapConfig);
    /**
     * Load and display the map
     */
    load(callback?: () => void): void;
    /**
     * Returns the Google map object
     *
     * @returns {google.maps.Map}
     */
    get(): google.maps.Map;
}
/**
 * Helper function to set up the map object
 *
 * @param {string} id The id of the element that the map will be rendered in
 * @param {MapConfig} config The map configuration
 * @returns {Map}
 */
export declare const map: (id: string, config: MapConfig) => Map;
