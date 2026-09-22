/* ===========================================================================
    Google Maps Loader
    See https://aptuitiv.github.io/gmaps/api-reference/loader for documentation
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
     * @type {string | undefined}
     */
    #apiKey: string | undefined;

    /**
     * Holds the loading state
     *
     * @private
     * @type {boolean}
     */
    #isLoading: boolean = false;

    /**
     * The load that is currently running, so that callers arriving while it is in flight share it.
     *
     * They used to wait on the "load" event instead, which only ever fires on success - so a failed
     * load left every one of them waiting for something that was never coming.
     *
     * @private
     * @type {Promise<void>|undefined}
     */
    #loadPromise: Promise<void> | undefined;

    /**
     * The error from a load that failed, if one has.
     *
     * Kept so that anything asking to wait for the map afterwards is told straight away instead of
     * waiting for a "map_load" that is never coming.
     *
     * @private
     * @type {Error|undefined}
     */
    #loadError: Error | undefined;

    /** Anything waiting for a map to be displayed */
    #mapLoadedPromise: Promise<void> | undefined;

    /**
     * Holds the loaded state
     *
     * @private
     * @type {boolean}
     */
    #isLoaded: boolean = false;

    /**
     * Holds whether the map has finished loading.
     *
     * This is set when the "map_load" event is dispatched so that a listener added after that
     * point can still be called.
     *
     * @private
     * @type {boolean}
     */
    #isMapLoaded: boolean = false;

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
     * @type {GoogleLoader | undefined}
     */
    #loader: GoogleLoader | undefined;

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
     * @returns {string | undefined}
     */
    get apiKey(): string | undefined {
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
        if (this.#isLoaded) {
            // The Google maps API has already loaded
            callCallback(callback);
            return Promise.resolve();
        }

        if (!this.#loadPromise) {
            this.#loadPromise = this.#startLoad();
            // Forgotten once it settles. On success the check above takes over, and on failure a
            // later load() starts again rather than handing back the load that already failed.
            this.#loadPromise.then(
                () => {
                    this.#loadPromise = undefined;
                },
                (error) => {
                    this.#isLoading = false;
                    this.#loadPromise = undefined;
                    this.loadFailed(error instanceof Error ? error : new Error(String(error)));
                },
            );
        }

        // Every caller hangs off the same load, so they are all told about a failure rather than
        // only the one that started it
        return this.#loadPromise.then(() => {
            callCallback(callback);
        });
    }

    /**
     * Start loading the Google maps API
     *
     * @private
     * @returns {Promise<void>}
     */
    #startLoad(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!isStringWithValue(this.#apiKey)) {
                reject(new Error('The Google Maps API key is not set'));
                return;
            }

            this.#isLoading = true;

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
                    this.#loadError = undefined;
                    this.dispatch(LoaderEvents.LOAD);
                    resolve();
                })
                .catch(reject);
        });
    }

    /**
     * Wait for a map to be displayed.
     *
     * This is what anything needing the Google Maps objects waits on - markers, polylines,
     * overlays, geocoding. It resolves once a map has been displayed, and rejects if the library
     * can't be loaded or a map can't be displayed.
     *
     * The rejection is the point of it. Listening for the "map_load" event alone means waiting for
     * something that is only ever dispatched on success, so a failed load left every one of those
     * objects waiting forever with nothing reported.
     *
     * @returns {Promise<void>}
     */
    whenMapLoaded(): Promise<void> {
        if (this.#isMapLoaded) {
            return Promise.resolve();
        }
        if (this.#loadError) {
            return Promise.reject(this.#loadError);
        }
        if (!this.#mapLoadedPromise) {
            this.#mapLoadedPromise = new Promise((resolve, reject) => {
                this.on(LoaderEvents.MAP_LOAD, () => {
                    resolve();
                });
                this.on(LoaderEvents.LOAD_ERROR, () => {
                    reject(this.#loadError ?? new Error('The map could not be loaded'));
                });
            });
        }
        return this.#mapLoadedPromise;
    }

    /**
     * Say that the library or a map failed to load, so that anything waiting for a map stops
     * waiting.
     *
     * Called by the Loader itself when a load fails, and by the Map when it can't be displayed.
     *
     * @internal
     * @param {Error} error The error that stopped it
     */
    loadFailed(error: Error): void {
        this.#loadError = error;
        // Let go of the waiting promise so that a later attempt gets a fresh one rather than the
        // one that already rejected
        this.#mapLoadedPromise = undefined;
        this.dispatch(LoaderEvents.LOAD_ERROR);
    }

    /**
     * Dispatch an event
     *
     * @param {string} event The event to dispatch
     */
    dispatch(event: string) {
        // Remember that the map has loaded so that a listener added later can still be called
        if (event === LoaderEvents.MAP_LOAD) {
            this.#isMapLoaded = true;
        }
        super.dispatchEvent(new CustomEvent(event));
    }

    /**
     * Add an event listener to the object.
     *
     * All events on the loader object are set up as "once" events because the
     * load event is only dispatched one time when the Google maps API is loaded.
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener function. An error is thrown if this isn't a function.
     */
    on(type: string, callback: EventListenerOrEventListenerObject | null): void {
        if (isFunction(callback)) {
            this.addEventListener(type, callback, { once: true });
            // If the event being listened for has already happened then dispatch it now so that
            // the new listener is called.
            //
            // This used to dispatch the "load" event whatever type was asked for. A "map_load"
            // listener added after the map had loaded was therefore never called, and anything
            // waiting on it - Marker, Polyline and MarkerCluster all do - never finished.
            if (type === LoaderEvents.LOAD && this.#isLoaded) {
                this.dispatch(LoaderEvents.LOAD);
            } else if (type === LoaderEvents.MAP_LOAD && this.#isMapLoaded) {
                this.dispatch(LoaderEvents.MAP_LOAD);
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
    } else if (config) {
        loaderInstance.setOptions(config);
    }
    return loaderInstance;
};
