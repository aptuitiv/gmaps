/* ===========================================================================
    Google Maps Loader
    See https://aptuitiv.github.io/gmaps-docs/api-reference/loader for documentation
=========================================================================== */

import { Loader as GoogleLoader, Libraries } from '@googlemaps/js-api-loader';
import { LoaderEvents } from './constants';
import { callCallback, isFunction, isObject, isObjectWithValues, isString, isStringWithValue } from './helpers';

// Loader Options
export type LoaderOptions = {
    // The Google Maps API key
    apiKey?: string;
    // An array of additional Maps JavaScript API libraries to load. By default no extra libraries are loaded.
    // The "places" library is a common one to load. https://developers.google.com/maps/documentation/javascript/places
    // https://developers.google.com/maps/documentation/javascript/libraries
    libraries?: Libraries;
    // The version of the Google Maps API to load.
    // https://developers.google.com/maps/documentation/javascript/versions
    version?: string;
};

/**
 * Class to load the Google maps API
 *
 * This should be a singleton object and prevent multiple loader objects on the page.
 */
export class Loader extends EventTarget {
    /**
     * Holds the Google Maps API key
     *
     * @private
     * @type {string}
     */
    #apiKey: string;

    /**
     * Holds the loading state
     *
     * @private
     * @type {boolean}
     */
    #isLoading: boolean = false;

    /**
     * Holds the loaded state
     *
     * @private
     * @type {boolean}
     */
    #isLoaded: boolean = false;

    /**
     * Holds the libraries to load with Google maps
     *
     * @private
     * @type {Libraries}
     */
    #libraries: Libraries = [];

    /**
     * Holds the Google maps loader object
     *
     * @private
     * @type {GoogleLoader}
     */
    #loader: GoogleLoader;

    /**
     * Holds the version of the Google Maps API to load
     *
     * @private
     * @type {string}
     */
    #version: string = 'weekly';

    /**
     * Class constructor
     *
     * @param {LoaderOptions} [options] The loader options object
     */
    constructor(options?: LoaderOptions) {
        super();
        if (isObject(options)) {
            this.setOptions(options);
        }
    }

    /**
     * Get the Google Maps API key
     *
     * @returns {string}
     */
    get apiKey(): string {
        return this.#apiKey;
    }

    /**
     * Set the Google Maps API key
     *
     * @param {string} apiKey The Google Maps API key
     */
    set apiKey(apiKey: string) {
        if (isString(apiKey)) {
            this.#apiKey = apiKey;
        }
    }

    /**
     * Get the libraries to load with Google maps
     *
     * @returns {Libraries}
     */
    get libraries(): Libraries {
        return this.#libraries;
    }

    /**
     * Set the libraries to load with Google maps
     * The "places" library is a common one to load.
     * https://developers.google.com/maps/documentation/javascript/places
     *
     * @param {Libraries} libraries The libraries to load with Google maps
     */
    set libraries(libraries: Libraries) {
        if (Array.isArray(libraries)) {
            this.#libraries = libraries;
        } else if (isStringWithValue(libraries)) {
            this.#libraries = [libraries];
        }
    }

    /**
     * Get the version of the Google Maps API to load
     *
     * @returns {string}
     */
    get version(): string {
        return this.#version;
    }

    /**
     * Set the version of the Google Maps API to load
     * https://developers.google.com/maps/documentation/javascript/versions
     *
     * @param {string} version The version of the Google Maps API to load
     */
    set version(version: string) {
        if (isString(version)) {
            this.#version = version;
        }
    }

    /**
     * Set the loader options
     *
     * @param {LoaderOptions} options The loader options object
     * @returns {Loader}
     */
    setOptions(options: LoaderOptions): Loader {
        if (isObjectWithValues(options)) {
            if (isString(options.apiKey)) {
                this.apiKey = options.apiKey;
            }
            if (Array.isArray(options.libraries)) {
                this.libraries = options.libraries;
            }
            if (isString(options.version)) {
                this.version = options.version;
            }
        }
        return this;
    }

    /**
     * Set the Google Maps API key
     *
     * @param {string} apiKey The Google Maps API key
     * @returns {Loader}
     */
    setApiKey(apiKey: string): Loader {
        this.apiKey = apiKey;
        return this;
    }

    /**
     * Set the libraries to load with Google maps
     * The "places" library is a common one to load.
     * https://developers.google.com/maps/documentation/javascript/places
     *
     * @param {Libraries} libraries The libraries to load with Google maps
     * @returns {Loader}
     */
    setLibraries(libraries: Libraries): Loader {
        this.libraries = libraries;
        return this;
    }

    /**
     * Set the version of the Google Maps API to load
     * https://developers.google.com/maps/documentation/javascript/versions
     *
     * @param {string} version The version of the Google Maps API to load
     * @returns {Loader}
     */
    setVersion(version: string): Loader {
        this.version = version;
        return this;
    }

    /**
     * Load the Google maps API
     *
     * @param {Function} callback A callback function to run when the Google maps API has loaded
     * @returns {Promise<void>}
     */
    load(callback?: () => void): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.#isLoaded) {
                if (!this.#isLoading) {
                    this.#isLoading = true;
                    if (isStringWithValue(this.#apiKey)) {
                        // Set up the Google maps loader
                        // https://www.npmjs.com/package/@googlemaps/js-api-loader
                        if (typeof this.#loader === 'undefined') {
                            this.#loader = new GoogleLoader({
                                apiKey: this.#apiKey,
                                version: this.#version,
                                libraries: this.#libraries,
                            });
                        }
                        this.#loader
                            .importLibrary('maps')
                            .then(async () => {
                                // Make sure that the advanced marker library is loaded. If its set in the libraries array, it will be loaded by the
                                // Google maps loader. But, it may not be loaded by the time we need it. So, we will load it here.
                                // It would be better if the Google maps loader could load multiple libraries at once or there was a way to wait for multiple libraries to load.
                                if (this.#libraries.includes('marker')) {
                                    await google.maps.importLibrary('marker');
                                }
                                this.#isLoaded = true;
                                callCallback(callback);
                                this.dispatch(LoaderEvents.LOAD);
                                resolve();
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    } else {
                        reject(new Error('The Google Maps API key is not set'));
                    }
                } else {
                    // Wait for the Google maps API to load
                    this.once(LoaderEvents.LOAD, () => {
                        callCallback(callback);
                        resolve();
                    });
                }
            } else {
                // The Google maps API has already loaded
                callCallback(callback);
                resolve();
            }
        });
    }

    /**
     * Dispatch an event
     *
     * @param {string} event The event to dispatch
     */
    dispatch(event: string) {
        super.dispatchEvent(new CustomEvent(event));
    }

    /**
     * Add an event listener to the object.
     *
     * All events on the loader object are set up as "once" events because the
     * load event is only dispatched one time when the Google maps API is loaded.
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener function
     */
    on(type: string, callback: EventListenerOrEventListenerObject): void {
        if (isFunction(callback)) {
            this.addEventListener(type, callback, { once: true });
            if (this.#isLoaded) {
                this.dispatch(LoaderEvents.LOAD);
            }
        } else {
            throw new Error('the event handler needs a callback function');
        }
    }

    /**
     * Sets up an event listener for the "load" event.
     *
     * All events on the loader object are set up as "once" events because the
     * load event is only dispatched one time when the Google maps API is loaded.
     *
     * @param {Function} callback A callback function to run when the Google maps API has loaded
     */
    onLoad(callback: EventListenerOrEventListenerObject): void {
        this.on(LoaderEvents.LOAD, callback);
    }

    /**
     * Sets up an event listener for the "map_load" event.
     *
     * All events on the loader object are set up as "once" events because the
     * load event is only dispatched one time when the Google maps API is loaded.
     *
     * @param {Function} callback A callback function to run when the Google maps API has loaded
     */
    onMapLoad(callback: EventListenerOrEventListenerObject): void {
        this.on(LoaderEvents.MAP_LOAD, callback);
    }

    /**
     * Sets up an event listener that will only be called once
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener function
     */
    once(type: string, callback: EventListenerOrEventListenerObject | null): void {
        this.on(type, callback);
    }

    /**
     * Sets up an event listener for the "load" event that will only be called once.
     *
     * @param {Function} callback A callback function to run when the Google maps API has loaded
     */
    onceLoad(callback: EventListenerOrEventListenerObject | null): void {
        this.on(LoaderEvents.LOAD, callback);
    }

    /**
     * Sets up an event listener for the "map_load" event that will only be called once.
     *
     * @param {Function} callback A callback function to run when the Google maps API has loaded
     */
    onceMapLoad(callback: EventListenerOrEventListenerObject | null): void {
        this.on(LoaderEvents.MAP_LOAD, callback);
    }
}

/**
 * Holds the loader instance.
 * This is used to a singleton object and prevent multiple loader objects on the page.
 */
let loaderInstance: Loader;

/**
 * Helper function to set up the loader object.
 *
 * Only one loader object can be created on a page.
 * This prevents trying to load the Google maps library multiple times.
 * It also allows us to internally handle when the Google maps library is loaded.
 *
 * @param {LoaderOptions} [config] The loader options
 * @returns {Loader}
 */
export const loader = (config?: LoaderOptions): Loader => {
    if (!loaderInstance) {
        loaderInstance = new Loader(config);
    } else {
        loaderInstance.setOptions(config);
    }
    return loaderInstance;
};
