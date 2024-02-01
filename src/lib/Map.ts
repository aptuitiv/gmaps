/* ===========================================================================
    Main class to hold the map object and set it up.

    https://developers.google.com/maps/documentation/javascript/reference/map
    https://developers.google.com/maps/documentation/javascript/load-maps-js-api

    If we want to use google.maps.marker.AdvancedMarkerElementOptions, we need to load the "marker" library.
    When we add support for Advanced Markers, make sure that "marker" in included in the libraries array.
    If there are code examples that use await google.maps.importLibrary(), the library that is loaded
    should be included in the libraries array to properly load.
    https://developers.google.com/maps/documentation/javascript/places

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
import { isFunction, isObject, isObjectWithValues, isString, isStringWithValue } from './helpers';
import { LatLng, latLng } from './LatLng';
import { Evented } from './Evented';

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
type LocateOptions = {
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
};

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

// The callback function for the Map.locate() function
type LocationOnSuccess = (position: LocationPosition) => void;

/**
 * The map class
 */
export class Map extends Evented {
    /**
     * Holds the Google Maps API key
     */
    private mapApiKey: string;

    /**
     * Holds the id of the element that the map will be rendered in
     */
    private id: string;

    /**
     * Holds the libraries to load with Google maps
     */
    private libraries: Libraries = [];

    /**
     * Holds the Google map object
     */
    private map: google.maps.Map;

    /**
     * Holds the options object for the Google maps object
     */
    private mapOptions: google.maps.MapOptions = {};

    /**
     * The type of object. For this class it will always be "map"
     *
     * You can use this in your logic to determine what type of object you're dealing with.
     * if (thing.objectType === 'map') {}
     */
    objectType: string = 'map';

    /**
     * Holds the version of the Google Maps API to load
     */
    private version: string = 'weekly';

    /**
     * Holds the watchId for the watchPosition() function
     */
    private watchId: number;

    /**
     * Class constructor
     *
     * @param {string} id The id of the element that the map will be rendered in
     * @param {MapOptions} [options] The options object for the map
     */
    constructor(id: string, options?: MapOptions) {
        super();

        // Set some default values
        this.libraries = [];
        this.version = 'weekly';

        this.id = id;
        if (isObject(options)) {
            this.setOptions(options);
        }
    }

    /**
     * Set the map options
     * @param {MapOptions} options The map options
     * @returns {Map}
     */
    setOptions(options: MapOptions): Map {
        if (isObjectWithValues(options)) {
            if (options.apiKey) {
                this.setApiKey(options.apiKey);
            }
            if (Array.isArray(options.libraries)) {
                this.libraries = options.libraries;
            }
            if (isString(options.version)) {
                this.version = options.version;
            }
            // Default map options
            const defaultConfig = {
                zoom: 8,
            };
            const config = { ...defaultConfig, ...options };
            const deleteKeys = ['apiKey', 'libraries', 'version'];
            deleteKeys.forEach((key) => {
                delete config[key];
            });

            this.mapOptions = {
                center: {
                    lat: config.latitude,
                    lng: config.longitude,
                },
                rotateControl: true,
                zoom: config.zoom,
            };
        } else {
            throw new Error('Invalid map options. You must pass an object of options');
        }
        return this;
    }

    /**
     * Set the API key
     * @param key The API key
     * @returns
     */
    setApiKey(key: string): Map {
        if (isStringWithValue(key)) {
            this.mapApiKey = key;
        } else {
            throw new Error('You must pass a valid API key');
        }
        return this;
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
    load(callback?: (map?: Map) => void) {
        if (isStringWithValue(this.mapApiKey)) {
            // Set up the Google maps loader
            // https://www.npmjs.com/package/@googlemaps/js-api-loader
            const loader = new Loader({
                apiKey: this.mapApiKey,
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
                        callback(this);
                    }
                })
                .catch((err) => {
                    // eslint-disable-next-line no-console
                    console.error(err);
                });
        } else {
            throw new Error('The Google Maps API key is not set');
        }
        return this;
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
    locate(options?: LocateOptions | LocationOnSuccess, onSuccess?: LocationOnSuccess): Map {
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
                } else if (isFunction(options)) {
                    options(data);
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

    /**
     * Add an event listener to the object
     *
     * @param {string} type The event type
     * @param {function} callback The event listener function
     * @param {object|boolean} [options] The options object or a boolean to indicate if the event should be captured
     */
    on(type: string, callback: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean): void {
        if (isFunction(callback)) {
            if (isObject(google) && isObject(google.maps)) {
                if (isObject(this.map) && this.map instanceof google.maps.Map) {
                    super.on(type, callback, options);
                    if (isObject(options) && typeof options.once === 'boolean' && options.once) {
                        google.maps.event.addListenerOnce(this.map, type, () => {
                            this.dispatch(type);
                            this.off(type, callback);
                        });
                    } else {
                        this.map.addListener(type, () => {
                            this.dispatch(type);
                        });
                    }
                } else if (type === 'load') {
                    super.on(type, callback, options);
                } else {
                    throw new Error('The map object is not available yet');
                }
            } else if (type === 'load') {
                super.on(type, callback, options);
            } else {
                throw new Error(
                    'Google maps not loaded. You must wait to set the event until the Google map library is loaded.'
                );
            }
        } else {
            throw new Error('the event handler needs a callback function');
        }
    }
}

/**
 * Helper function to set up the map object
 *
 * @param {string} id The id of the element that the map will be rendered in
 * @param {MapOptions} [config] The map options
 * @returns {Map}
 */
export const map = (id: string, config?: MapOptions): Map => new Map(id, config);
