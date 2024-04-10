import { Libraries } from '@googlemaps/js-api-loader';
export type LoaderOptions = {
    apiKey?: string;
    libraries?: Libraries;
    version?: string;
};
/**
 * Class to load the Google maps API
 *
 * This should be a singleton object and prevent multiple loader objects on the page.
 */
export declare class Loader extends EventTarget {
    #private;
    /**
     * Class constructor
     *
     * @param {LoaderOptions} [options] The loader options object
     */
    constructor(options?: LoaderOptions);
    /**
     * Get the Google Maps API key
     *
     * @returns {string}
     */
    get apiKey(): string;
    /**
     * Set the Google Maps API key
     *
     * @param {string} apiKey The Google Maps API key
     */
    set apiKey(apiKey: string);
    /**
     * Get the libraries to load with Google maps
     *
     * @returns {Libraries}
     */
    get libraries(): Libraries;
    /**
     * Set the libraries to load with Google maps
     * The "places" library is a common one to load.
     * https://developers.google.com/maps/documentation/javascript/places
     *
     * @param {Libraries} libraries The libraries to load with Google maps
     */
    set libraries(libraries: Libraries);
    /**
     * Get the version of the Google Maps API to load
     *
     * @returns {string}
     */
    get version(): string;
    /**
     * Set the version of the Google Maps API to load
     * https://developers.google.com/maps/documentation/javascript/versions
     *
     * @param {string} version The version of the Google Maps API to load
     */
    set version(version: string);
    /**
     * Set the loader options
     *
     * @param {LoaderOptions} options The loader options object
     * @returns {Loader}
     */
    setOptions(options: LoaderOptions): Loader;
    /**
     * Set the Google Maps API key
     *
     * @param {string} apiKey The Google Maps API key
     * @returns {Loader}
     */
    setApiKey(apiKey: string): Loader;
    /**
     * Set the libraries to load with Google maps
     * The "places" library is a common one to load.
     * https://developers.google.com/maps/documentation/javascript/places
     *
     * @param {Libraries} libraries The libraries to load with Google maps
     * @returns {Loader}
     */
    setLibraries(libraries: Libraries): Loader;
    /**
     * Set the version of the Google Maps API to load
     * https://developers.google.com/maps/documentation/javascript/versions
     *
     * @param {string} version The version of the Google Maps API to load
     * @returns {Loader}
     */
    setVersion(version: string): Loader;
    /**
     * Load the Google maps API
     *
     * @param {Function} callback A callback function to run when the Google maps API has loaded
     * @returns {Promise<void>}
     */
    load(callback?: () => void): Promise<void>;
    /**
     * Dispatch an event
     *
     * @param {string} event The event to dispatch
     */
    dispatch(event: string): void;
    /**
     * Add an event listener to the object.
     *
     * All events on the loader object are set up as "once" events because the
     * load event is only dispatched one time when the Google maps API is loaded.
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener function
     */
    on(type: string, callback: EventListenerOrEventListenerObject): void;
    /**
     * Sets up an event listener that will only be called once
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener function
     */
    once(type: string, callback: EventListenerOrEventListenerObject | null): void;
}
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
export declare const loader: (config?: LoaderOptions) => Loader;
