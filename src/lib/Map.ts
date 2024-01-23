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
import { isFunction, isObject } from './helpers';
import { LatLng, latLng } from './LatLng';
import Evented from './Evented';

export type MapOptions = {
    // The Google Maps API key
    apiKey: string;
    // The latitude for the center point of the map
    latitude: number;
    // An array of additional Maps JavaScript API libraries to load. By default no extra libraries are loaded.
    // The "places" library is a common one to load. https://developers.google.com/maps/documentation/javascript/places
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

// The options for the Map.locate() function
interface LocateOptions {
    // Indicates if the application would like to receive the best possible results.
    // If true and if the device is able to provide a more accurate position, it will do so.
    // This can result in slower response times or increased power consumption on a mobile device.
    // If false then the device can save resources by responding more quickly.
    // Default: false.
    enableHighAccuracy?: boolean;
    // The maximum age in milliseconds of a possible cached position that is acceptable to return.
    // If set to 0, it means that the device cannot use a cached position and must attempt to retrieve the real
    // current position. If set to Infinity the device must return a cached position regardless of its age.
    // Default: 0
    maximumAge?: number;
    // The maximum time in milliseconds the device is allowed to take in order to return a position.
    // The default value is Infinity, meaning that getCurrentPosition() won't return until the position is available.
    // Default: Infinity
    timeout?: number;
    // Whether ot use watchPosition to track the user's location. It set to false, the user's location will only be
    // retrieved once.
    // Default true
    watch?: boolean;
}

// The data returned from the Geolocation API and sent to the 'locationfound' event
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

/**
 * The map class
 */
export class Map extends Evented {
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
     * Holds the watchId for the watchPosition() function
     */
    private watchId: number;

    /**
     * Class constructor
     *
     * @param {string} id The id of the element that the map will be rendered in
     * @param {MapOptions} options The options object for the map
     */
    constructor(id: string, options: MapOptions) {
        super();
        if (!isObject(options) || typeof options.apiKey !== 'string') {
            throw new Error('Invalid map options');
        }
        this.id = id;
        this.apiKey = options.apiKey;
        // If we want to use google.maps.marker.AdvancedMarkerElementOptions, we need to load the "marker" library.
        // When we add support for Advanced Markers, make sure that "marker" in included in the libraries array.
        // If there are code examples that use await google.maps.importLibrary(), the library that is loaded
        // should be included in the libraries array to properly load.
        // https://developers.google.com/maps/documentation/javascript/places
        this.libraries = options.libraries ?? [];
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
                this.dispatch('load');

                // Call the callback function if necessary
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
     * @return {Map}
     */
    fitBounds(bounds: LatLngBoundsValue): Map {
        if (bounds instanceof LatLngBounds) {
            this.map.fitBounds(bounds.get());
        }
        this.map.fitBounds(latLngBounds(bounds).get());
        return this;
    }

    /**
     * Try to locate the user usin gthe GeoLocation API
     *
     * There are two ways to handle when the user's location is found:
     * 1. Pass a callback function to the locate() function
     *  map.locate({}, (position) => {
     *    // Do something with the position
     *  });
     * 2. Listen for the 'locationfound' event
     *  map.on('locationfound', (position) => {
     *   // Do something with the position
     *  });
     *
     * @param {LocateOptions} [options] The options for the locate() function
     * @param {function} [onSuccess] The callback function for when the user's location is found.
     *
     * @returns {Map}
     */
    locate(options?: LocateOptions, onSuccess?: (position: LocationPosition) => void): Map {
        if (navigator.geolocation) {
            const defaultOptions = {
                watch: true,
            };
            let config = defaultOptions;
            if (isObject(options)) {
                config = { ...defaultOptions, ...options };
            }
            const positionOptions: PositionOptions = {
                enableHighAccuracy: false,
                maximumAge: 0,
                timeout: Infinity,
                ...config,
            };
            const success = (position: GeolocationPosition) => {
                const { latitude, longitude } = position.coords;
                const data: LocationPosition = {
                    latitude,
                    longitude,
                    latLng: latLng(latitude, longitude),
                    timestamp: position.timestamp,
                };
                Object.keys(position.coords).forEach((key) => {
                    if (typeof position.coords[key] === 'number') {
                        data[key] = position.coords[key];
                    }
                });
                this.dispatch('locationfound', data);
                if (isFunction(onSuccess)) {
                    onSuccess(data);
                }
            };
            const error = (err: GeolocationPositionError) => {
                this.dispatch('locationerror', err);
                // eslint-disable-next-line no-console
                console.error(err);
            };
            if (config.watch) {
                this.watchId = navigator.geolocation.watchPosition(success, error, positionOptions);
            } else {
                navigator.geolocation.getCurrentPosition(success, error, positionOptions);
            }
        } else {
            // eslint-disable-next-line no-console
            console.error('Geolocation is not supported by this browser.');
        }
        return this;
    }

    /**
     * Stop watching for the user's location
     *
     * @returns {Map}
     */
    stopLocate(): Map {
        if (navigator.geolocation) {
            navigator.geolocation.clearWatch(this.watchId);
        }
        return this;
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
