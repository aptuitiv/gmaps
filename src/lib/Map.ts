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

/* global google */

import { Libraries } from '@googlemaps/js-api-loader';
import { loader } from './Loader';
import { LatLngBounds, latLngBounds, LatLngBoundsValue } from './LatLngBounds';
import {
    checkForGoogleMaps,
    isFunction,
    isNumber,
    isNumberOrNumberString,
    isNumberString,
    isObject,
    isStringWithValue,
} from './helpers';
import { LatLng, latLng, LatLngValue } from './LatLng';
import { Evented } from './Evented';

export type MapOptions = {
    // The Google Maps API key
    apiKey: string;
    // The position for the marker.
    // This is an alternate to setting the latitude and longitude separately.
    center?: LatLngValue;
    // The latitude for the center point of the map
    lat: number | string;
    latitude: number | string;
    // An array of additional Maps JavaScript API libraries to load. By default no extra libraries are loaded.
    // The "places" library is a common one to load. https://developers.google.com/maps/documentation/javascript/places
    // https://developers.google.com/maps/documentation/javascript/libraries
    libraries?: Libraries;
    // The longitude for the center point of the map
    lng: number | string;
    longitude: number | string;
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
     * Holds the center point for the map
     *
     * @private
     * @type {LatLng}
     */
    #center: LatLng;

    /**
     * Holds the id of the element that the map will be rendered in
     *
     * @private
     * @type {string}
     */
    #id: string;

    /**
     * Holds the Google map object
     *
     * @private
     * @type {google.maps.Map}
     */
    #map: google.maps.Map;

    /**
     * Holds the watchId for the watchPosition() function
     *
     * @private
     * @type {number}
     */
    #watchId: number;

    /**
     * Holds the map zoom value
     *
     * @private
     * @type {number}
     */
    #zoom: number = 6;

    /**
     * Class constructor
     *
     * @param {string} id The id of the element that the map will be rendered in
     * @param {MapOptions} [options] The options object for the map
     */
    constructor(id: string, options?: MapOptions) {
        super('map');

        // Set some default values
        this.#center = latLng(0, 0);

        this.#id = id;
        if (isObject(options)) {
            this.setOptions(options);
        }
    }

    /**
     * Set the map options
     *
     * @param {MapOptions} options The map options
     * @returns {Map}
     */
    setOptions(options: MapOptions): Map {
        if (isObject(options)) {
            // Set the loader options if necessary
            if (options.apiKey || options.libraries || options.version) {
                loader(options);
            }

            // Set the center point for the map
            let center = latLng();
            if (options.center) {
                center = latLng(options.center);
            } else {
                if (isNumberOrNumberString(options.lat)) {
                    center.setLat(options.lat);
                } else if (isNumberOrNumberString(options.latitude)) {
                    center.setLat(options.latitude);
                }
                if (isNumberOrNumberString(options.lng)) {
                    center.setLng(options.lng);
                } else if (isNumberOrNumberString(options.longitude)) {
                    center.setLng(options.longitude);
                }
            }
            if (center.isValid()) {
                this.#center = center;
            }

            // Set the zoom level for the map
            if (isNumber(options.zoom)) {
                this.#zoom = options.zoom;
            } else if (isNumberString(options.zoom)) {
                this.#zoom = Number(options.zoom);
            }
        } else {
            throw new Error('Invalid map options. You must pass an object of options');
        }
        return this;
    }

    /**
     * Set the API key
     *
     * @param {string} key The API key
     * @returns {Map}
     */
    setApiKey(key: string): Map {
        if (isStringWithValue(key)) {
            loader().apiKey = key;
        } else {
            throw new Error('You must pass a valid API key');
        }
        return this;
    }

    /**
     * Get the map options for displaying the map
     *
     * @private
     * @returns {google.maps.MapOptions}
     */
    #getMapOptions(): google.maps.MapOptions {
        const options: google.maps.MapOptions = {
            center: this.#center.toJson(),
            zoom: this.#zoom,
        };
        return options;
    }

    /**
     * Load and display the map
     *
     * There are two ways to respond when the map loads:
     * 1. Pass a callback function to the load() function
     *   map.load(() => {
     *     // Do something after the map loads
     *   });
     * 2. Listen for the 'display' event
     *   map.on('display', () => {
     *      // Do something after the map loads
     *   });
     * 2a. Use the once() function to listen for the 'display' event only once. The event
     *     listener will be removed after the event is dispatched.
     *   map.once('display', () => {
     *     // Do something after the map loads
     *   });
     *
     * @param {Function} callback The callback function to call after the map loads
     */
    load(callback?: (map: Map) => void) {
        return new Promise((resolve, reject) => {
            loader()
                .load()
                .then(() => {
                    this.#map = new google.maps.Map(
                        document.getElementById(this.#id) as HTMLElement,
                        this.#getMapOptions()
                    );
                    this.dispatch('display');

                    this.setupPendingEventListeners();

                    // Call the callback function if necessary
                    if (isFunction(callback)) {
                        callback(this);
                    }
                    resolve(this);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * Display the map
     *
     * This assumes that the Google Maps API has already been loaded.
     * If the google.maps.Map class is not available yet, but the google object is, then
     * this will try to display the map up to 10 times.
     *
     * @param {Function} callback The callback function to call after the map loads
     * @returns {Promise<Map>}
     */
    display(callback?: (map: Map) => void): Promise<Map> {
        return new Promise((resolve, reject) => {
            let attempts = 0;

            // Internal function to display the map
            const displayMap = () => {
                attempts += 1;

                if (checkForGoogleMaps('Map', 'Map', false)) {
                    // The Google maps library has successfully loaded
                    this.#map = new google.maps.Map(
                        document.getElementById(this.#id) as HTMLElement,
                        this.#getMapOptions()
                    );
                    // Call the callback function if necessary
                    if (isFunction(callback)) {
                        callback(this);
                    }
                    this.dispatch('display');
                    resolve(this);
                } else if (typeof google !== 'undefined' && attempts <= 10) {
                    // It's possible that the Google maps library is loaded but the Map class is not available yet.
                    // Try again in a few milliseconds
                    setTimeout(displayMap, 200);
                } else {
                    reject(
                        new Error(
                            'Failed to display the map. The Google Maps API library must be fully loaded before the map can be displayed.'
                        )
                    );
                }
            };

            displayMap();
        });
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
     * @param {LatLngBoundsValue} bounds The bounds to fit
     * @returns {Map}
     */
    fitBounds(bounds: LatLngBoundsValue): Map {
        if (bounds instanceof LatLngBounds) {
            this.#map.fitBounds(bounds.toGoogle());
        }
        this.#map.fitBounds(latLngBounds(bounds).toGoogle());
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
     * @param {Function} [onSuccess] The callback function for when the user's location is found.
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
                this.#watchId = navigator.geolocation.watchPosition(success, error, positionOptions);
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
            navigator.geolocation.clearWatch(this.#watchId);
        }
        return this;
    }

    /**
     * Add an event listener to the object
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener function
     * @param {object|boolean} [options] The options object or a boolean to indicate if the event should be captured
     */
    on(type: string, callback: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean): void {
        if (isFunction(callback)) {
            if (checkForGoogleMaps('Map', 'Map', false)) {
                if (isObject(this.#map) && this.#map instanceof google.maps.Map) {
                    super.on(type, callback, options);
                    if (isObject(options) && typeof options.once === 'boolean' && options.once) {
                        google.maps.event.addListenerOnce(this.#map, type, () => {
                            this.dispatch(type);
                            this.off(type, callback);
                        });
                    } else {
                        this.#map.addListener(type, () => {
                            this.dispatch(type);
                        });
                    }
                } else if (type === 'display') {
                    super.on(type, callback, options);
                } else {
                    this.addPendingEventListener(type, callback, options);
                }
            } else if (type === 'display') {
                super.on(type, callback, options);
            } else {
                this.addPendingEventListener(type, callback, options);
            }
        } else {
            throw new Error('the event handler needs a callback function');
        }
    }

    /**
     * Returns the Google map object
     *
     * @returns {google.maps.Map}
     */
    toGoogle(): google.maps.Map {
        return this.#map;
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
