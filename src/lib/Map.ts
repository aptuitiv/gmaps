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

/* global google, HTMLElement */

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
import { Evented, EventCallback, EventOptions } from './Evented';

// The options that will be passed to the Google Maps map object
type GMMapOptions = {
    center?: LatLng;
    zoom?: number;
};

// The options that are passed to map() and setOptions()
export type MapOptions = GMMapOptions & {
    // The Google Maps API key
    apiKey: string;
    // The center point for the map.
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
     * Holds the Google map object
     *
     * @private
     * @type {google.maps.Map}
     */
    #map: google.maps.Map;

    /**
     * Holds the map options
     *
     * @private
     * @type {GMMapOptions}
     */
    #options: GMMapOptions = {};

    /**
     * Holds the selector of the element that the map will be rendered in. Or the HTMLElement that the map will be rendered in.
     *
     * @private
     * @type {string|HTMLElement}
     */
    #selector: string | HTMLElement;

    /**
     * Holds the watchId for the watchPosition() function
     *
     * @private
     * @type {number}
     */
    #watchId: number;

    /**
     * Class constructor
     *
     * @param {string|HTMLElement} selector The selector of the element that the map will be rendered in. Or the HTMLElement that the map will be rendered in.
     *      The selector can be a class name, an id, or an HTML element. If you need something beyond an id or class name as the selector then pass the element itself.
     * @param {MapOptions} [options] The options object for the map
     */
    constructor(selector: string | HTMLElement, options?: MapOptions) {
        super('map', 'Map');

        // Set some default values
        this.#options.center = latLng(0, 0);
        this.#options.zoom = 6;

        this.#selector = selector;
        if (isObject(options)) {
            this.setOptions(options);
        }
    }

    /**
     * Get the zoom level for the map
     *
     * @returns {number}
     */
    get zoom(): number {
        let { zoom } = this.#options;
        if (this.#map) {
            zoom = this.#map.getZoom();
        }
        if (isNumber(zoom) && zoom !== this.#options.zoom) {
            this.#options.zoom = zoom;
        }
        return this.#options.zoom;
    }

    /**
     * Set the zoom level for the map
     *
     * @param {number|string} value The zoom level
     */
    set zoom(value: number) {
        if (isNumber(value)) {
            this.#options.zoom = value;
        } else if (isNumberString(value)) {
            this.#options.zoom = Number(value);
        }

        if (this.#map) {
            this.#map.setZoom(value);
        }
    }

    /**
     * Display the map
     *
     * If the Google Maps API hasn't loaded yet then this will wait for the "load" event to be dispatched.
     *
     * @param {Function} callback The callback function to call after the map loads
     * @returns {Promise<void>}
     */
    display(callback?: () => void): Promise<void> {
        return new Promise((resolve) => {
            if (checkForGoogleMaps('Map', 'Map', false)) {
                // The map library is loaded and this can be displayed
                this.#displayMap(callback);
                resolve();
            } else {
                // Wait for the loader to dispatch it's "load" event
                loader().once('load', () => {
                    this.#displayMap(callback);
                    resolve();
                });
            }
        });
    }

    /**
     * Display the map
     *
     * This also dispatches the "display" and "map_loaded" events,
     * and calls the callback function.
     *
     * @param {Function} callback The callback function to call after the map loads
     */
    #displayMap(callback?: () => void) {
        let element: HTMLElement = null;
        if (typeof this.#selector === 'string') {
            if (this.#selector.startsWith('.')) {
                element = document.querySelector(this.#selector);
            } else {
                element = document.getElementById(this.#selector.replace('#', ''));
            }
        } else if (this.#selector instanceof HTMLElement) {
            element = this.#selector;
        }
        if (element === null) {
            throw new Error(
                'The map element could not be found. Make sure the map selector is correct and the element exists.'
            );
        }
        this.#map = new google.maps.Map(element, this.#getMapOptions());
        this.setEventGoogleObject(this.#map);
        // Dispatch the event to say that the map is displayed
        this.dispatch('display');
        // Dispatch the event on the loader to say that the map is fully loaded.
        // This is done because the map is loaded after the loader's "load" event is dispatched
        // and some objects depend on the map being loaded before they can be set up.
        loader().dispatch('map_loaded');

        // Call the callback function if necessary
        if (isFunction(callback)) {
            callback();
        }
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
     * Get the map options for displaying the map
     *
     * @private
     * @returns {google.maps.MapOptions}
     */
    #getMapOptions(): google.maps.MapOptions {
        const mapOptions: google.maps.MapOptions = {};
        // Options that can be set on the marker without any modification
        const optionsToSet = ['zoom'];
        optionsToSet.forEach((key) => {
            if (this.#options[key]) {
                mapOptions[key] = this.#options[key];
            }
        });

        // Options that have to be converted to Google Maps objects
        mapOptions.center = this.#options.center.toGoogle();

        return mapOptions;
    }

    /**
     * Get the center point for the map
     *
     * @returns {LatLng}
     */
    getCenter(): LatLng {
        let { center } = this.#options;
        if (this.#map) {
            const mapCenter = this.#map.getCenter();
            center = latLng(mapCenter.lat(), mapCenter.lng());
        }
        if (!center.equals(this.#options.center)) {
            this.#options.center = center;
        }
        return this.#options.center;
    }

    /**
     * Get the zoom level
     *
     * @returns {number}
     */
    getZoom(): number {
        return this.zoom;
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
     * @returns {Promise<void>}
     */
    load(callback?: () => void): Promise<void> {
        return new Promise((resolve, reject) => {
            loader()
                .load()
                .then(() => {
                    this.#displayMap(callback);
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * Try to locate the user using the GeoLocation API
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
     * @param {EventOptions} [options] The event listener options
     * @param {object} [context] The context to bind the callback function to
     */
    on(type: string, callback: EventCallback, options?: EventOptions, context?: object): void {
        this.setupEventListener(type, callback, options, context);
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
     * Set the center point for the map
     *
     * @param {number|LatLngValue} latitude The latitude value or the latitude/longitude pair
     * @param {number} [longitude] The longitude value
     * @returns {Map}
     */
    setCenter(latitude: number | LatLngValue, longitude?: number): Map {
        const center = latLng(latitude, longitude);
        if (center.isValid()) {
            this.#options.center = center;
            if (isObject(this.#map)) {
                this.#map.setCenter(this.#options.center.toGoogle());
            }
        }
        return this;
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
                this.#options.center = center;
            }

            // Set the zoom level for the map
            if (options.zoom) {
                this.zoom = options.zoom;
            }

            if (this.#map) {
                this.#map.setOptions(this.#getMapOptions());
            }
        }
        return this;
    }

    /**
     * Set the zoom value
     *
     * @param {number} zoom The zoom value
     * @returns {Map}
     */
    setZoom(zoom: number): Map {
        this.zoom = zoom;
        return this;
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
 * @param {string|HTMLElement} selector The selector of the element that the map will be rendered in. Or the HTMLElement that the map will be rendered in.
 *      The selector can be a class name, an id, or an HTML element. If you need something beyond an id or class name as the selector then pass the element itself.
 * @param {MapOptions} [config] The map options
 * @returns {Map}
 */
export const map = (selector: string | HTMLElement, config?: MapOptions): Map => new Map(selector, config);
