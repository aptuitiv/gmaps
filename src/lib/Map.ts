/* ===========================================================================
    Main class to hold the map object and set it up.

    https://developers.google.com/maps/documentation/javascript/reference/map
    https://developers.google.com/maps/documentation/javascript/load-maps-js-api

    Example usage:
    const map = G.map('map', {
        apiKey: 'myMapApiKey',
        latitude: 40.730610
        longitude: -73.935242,
        zoom: 8
    });
    map.load(() => {
        // Do something after the map loads
    });
=========================================================================== */

import { Loader, Libraries } from '@googlemaps/js-api-loader';
import { LatLngBounds, latLngBounds, LatLngBoundsValue } from './LatLngBounds';
import { isObject } from './helpers';

export type MapOptions = {
    // The Google Maps API key
    apiKey: string;
    // The latitude for the center point of the map
    latitude: number;
    // An array of additional Maps JavaScript API libraries to load. By default "places" is loaded.
    // https://developers.google.com/maps/documentation/javascript/libraries
    libraries?: Libraries;
    // The longitude for the center point of the map
    longitude: number;
    // The version of the Google Maps API to load.
    // https://developers.google.com/maps/documentation/javascript/versions
    version?: string;
    // The default zoom for the map. Defaults to 8.
    zoom?: number;
};

/**
 * The map class
 */
export class Map {
    /**
     * Holds the Google Maps API key
     */
    private apiKey: string;

    /**
     * Holds the id of the element that the map will be rendered in
     */
    private id: string;

    /**
     * Holds the libraries to load with Google maps
     */
    private libraries: Libraries;

    /**
     * Holds the Google map object
     */
    private map: google.maps.Map;

    /**
     * Holds the options object for the Google maps object
     */
    private mapOptions: google.maps.MapOptions;

    /**
     * Holds the version of the Google Maps API to load
     */
    private version: string;

    /**
     * Class constructor
     *
     * @param {string} id The id of the element that the map will be rendered in
     * @param {MapOptions} options The options object for the map
     */
    constructor(id: string, options: MapOptions) {
        if (!isObject(options) || typeof options.apiKey !== 'string') {
            throw new Error('Invalid map options');
        }
        this.id = id;
        this.apiKey = options.apiKey;
        this.libraries = options.libraries ?? ['places'];
        this.version = options.version ?? 'weekly';

        // Default map options
        const defaultConfig = {
            zoom: 8,
        };
        const config = { ...defaultConfig, ...options };
        delete config.apiKey;
        delete config.libraries;
        delete config.version;

        this.mapOptions = {
            center: {
                lat: config.latitude,
                lng: config.longitude,
            },
            rotateControl: true,
            zoom: config.zoom,
        };
    }

    /**
     * Load and display the map
     */
    load(callback?: () => void) {
        // Set up the Google maps loader
        // https://www.npmjs.com/package/@googlemaps/js-api-loader
        const loader = new Loader({
            apiKey: this.apiKey,
            libraries: this.libraries,
            version: this.version,
        });

        loader
            .importLibrary('maps')
            .then((google) => {
                this.map = new google.Map(document.getElementById(this.id) as HTMLElement, this.mapOptions);
                if (typeof callback === 'function') {
                    callback();
                }
            })
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.error(err);
            });
    }

    /**
     * Returns the Google map object
     *
     * @returns {google.maps.Map}
     */
    get(): google.maps.Map {
        return this.map;
    }

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
     */
    fitBounds(bounds: LatLngBoundsValue): void {
        if (bounds instanceof LatLngBounds) {
            this.map.fitBounds(bounds.get());
        }
        this.map.fitBounds(latLngBounds(bounds).get());
    }
}

/**
 * Helper function to set up the map object
 *
 * @param {string} id The id of the element that the map will be rendered in
 * @param {MapOptions} config The map options
 * @returns {Map}
 */
export const map = (id: string, config: MapOptions): Map => new Map(id, config);
