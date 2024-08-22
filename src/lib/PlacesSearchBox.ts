/* ===========================================================================
    Helps to set up a Places Search Box for Google Maps
=========================================================================== */

/* global google, HTMLInputElement */

import { Evented, EventCallback, EventConfig, EventListenerOptions } from './Evented';
import { checkForGoogleMaps, isObject, isObjectWithValues, isString } from './helpers';
import { latLng } from './LatLng';
import { latLngBounds, LatLngBounds, LatLngBoundsValue } from './LatLngBounds';
import { loader } from './Loader';

// Options that can be passed to the PlacesSearchBox class
export type PlacesSearchBoxOptions = {
    bounds?: LatLngBoundsValue;
    input: HTMLInputElement;
};

// Options for the Google Maps Places Search Box
type GMPlacesSearchBoxOptions = {
    bounds?: LatLngBounds;
};

// Event types for the PlacesSearchBox class
type PlacesSearchBoxEvent = 'places_changed';

/**
 * The PlacesSearchBox class
 */
export class PlacesSearchBox extends Evented {
    /**
     * Holds the reference to the input element
     *
     * @private
     * @type {HTMLInputElement}
     */
    #input: HTMLInputElement;

    /**
     * Holds the array of places that have been found.
     *
     * This is typically one place and it's the place that the user clicked on.
     *
     * @private
     * @type {google.maps.places.PlaceResult[]}
     */
    #places: google.maps.places.PlaceResult[] = [];

    /**
     * Holds the map bounds based on the places that have been found
     *
     * @private
     * @type {LatLngBounds}
     */
    #placesBounds: LatLngBounds;

    /**
     * Holds the reference to the Google Maps SearchBox object
     *
     * @private
     * @type {google.maps.places.SearchBox}
     */
    #searchBox: google.maps.places.SearchBox;

    /**
     * Holds the options for the places search box
     *
     * @private
     * @type {GMPlacesSearchBoxOptions}
     */
    #options: GMPlacesSearchBoxOptions = {};

    /**
     * Constructor
     *
     * @param {string | HTMLInputElement | PlacesSearchBoxOptions} input The input reference or the options
     * @param {PlacesSearchBoxOptions} [options] The places search box options if the input is reference to the input element
     */
    constructor(input: string | HTMLInputElement | PlacesSearchBoxOptions, options?: PlacesSearchBoxOptions) {
        super('placesSearchBox', 'places');

        if (input instanceof HTMLInputElement) {
            // An HTMLInputElement was passed
            this.#input = input;
            this.setOptions(options);
        } else if (isString(input)) {
            // A string selector for the HTMLInputElement was passed
            this.#input = document.querySelector(input);
            if (!this.#input) {
                throw new Error(`The input element with the selector "${input}" was not found.`);
            }
            this.setOptions(options);
        } else if (isObjectWithValues(input)) {
            // An object of options was passed.
            this.setOptions(input);
        }
    }

    /**
     * Get the bounds to which query predictions are biased.
     *
     * @returns {LatLngBounds | undefined}
     */
    get bounds(): LatLngBounds | undefined {
        return this.#options.bounds ?? undefined;
    }

    /**
     * Sets the region to use for biasing query predictions.
     *
     * Results will only be biased towards this area and not be completely restricted to it.
     *
     * @param {LatLngBoundsValue} value The bounds to set
     */
    set bounds(value: LatLngBoundsValue) {
        const boundsValue = latLngBounds(value);
        this.#options.bounds = boundsValue;
        if (this.#searchBox) {
            boundsValue.toGoogle().then((bounds) => {
                this.#searchBox.setBounds(bounds);
            });
        }
    }

    /**
     * Get the input reference
     *
     * @returns {HTMLInputElement | undefined}
     */
    get input(): HTMLInputElement | undefined {
        return this.#input;
    }

    /**
     * Set the input reference
     *
     * @param {string | HTMLInputElement} value The input HTMLInputElement or the selector for the input element
     */
    set input(value: string | HTMLInputElement) {
        if (value instanceof HTMLInputElement) {
            this.#input = value;
        } else if (isString(value)) {
            this.#input = document.querySelector(value);
            if (!this.#input) {
                throw new Error(`The input element with the selector "${value}" was not found.`);
            }
        }
    }

    /**
     * Get the bounds to which query predictions are biased.
     *
     * @returns {LatLngBounds | undefined}
     */
    getBounds(): LatLngBounds | undefined {
        return this.bounds;
    }

    /**
     * Gets the first place that has been found
     *
     * The results from the places_changed event is typically one place and it's the place that the user clicked on.
     *
     * @returns {google.maps.places.PlaceResult | undefined}
     */
    getPlace(): google.maps.places.PlaceResult | undefined {
        return this.#places[0];
    }

    /**
     * Get the places that have been found
     *
     * This is typically one place and it's the place that the user clicked on.
     *
     * @returns {google.maps.places.PlaceResult[]}
     */
    getPlaces(): google.maps.places.PlaceResult[] {
        return this.#places;
    }

    /**
     * Get the map bounds based on the places that have been found.
     *
     * @returns {LatLngBounds|undefined}
     */
    getPlacesBounds(): LatLngBounds | undefined {
        return this.#placesBounds;
    }

    /**
     * Initialize the places search box object
     *
     * This must be called in order for the places search box to work.
     *
     * @returns {Promise<void>}
     */
    async init(): Promise<void> {
        return new Promise((resolve) => {
            if (!isObject(this.#searchBox)) {
                if (checkForGoogleMaps('PlacesSearchBox', 'places', false)) {
                    this.#createPlacesSearchBox().then(() => {
                        resolve();
                    });
                } else {
                    // The Google maps object isn't available yet. Wait for it to load.
                    // The developer may have set the map on the marker before the Google maps object was available.
                    loader().once('map_loaded', () => {
                        this.#createPlacesSearchBox().then(() => {
                            resolve();
                        });
                    });
                }
            } else {
                resolve();
            }
        });
    }

    /**
     * Create the places search box object
     *
     * @private
     */
    #createPlacesSearchBox = async () => {
        if (!this.#searchBox) {
            const options: google.maps.places.SearchBoxOptions = {};
            if (options.bounds) {
                options.bounds = await this.#options.bounds.toGoogle();
            }
            this.#searchBox = new google.maps.places.SearchBox(this.#input, options);
            // Add the listener for when the user selects a place
            this.#searchBox.addListener('places_changed', () => {
                const places = this.#searchBox.getPlaces();
                const bounds = latLngBounds();
                places.forEach((place) => {
                    // Set up the map bounds based on the place
                    // https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceGeometry
                    if (place.geometry) {
                        if (place.geometry.viewport) {
                            // Only geocodes have viewport.
                            bounds.union(place.geometry.viewport);
                        }
                    } else if (place.geometry.location) {
                        bounds.extend(latLng(place.geometry.location));
                    }
                });
                this.#places = places;
                this.#placesBounds = bounds;
                this.dispatch('places_changed', { places, bounds });
            });
        }
    };

    /**
     * Returns whether the places search box object has been initialized
     *
     * @returns {boolean}
     */
    isInitialized(): boolean {
        return isObject(this.#searchBox);
    }

    /**
     * @inheritdoc
     */
    hasListener(type: PlacesSearchBoxEvent, callback?: EventCallback): boolean {
        return super.hasListener(type, callback);
    }

    /**
     * @inheritdoc
     */
    off(type?: PlacesSearchBoxEvent, callback?: EventCallback, options?: EventListenerOptions): void {
        super.off(type, callback, options);
    }

    /**
     * @inheritdoc
     */
    on(type: PlacesSearchBoxEvent, callback: EventCallback, config?: EventConfig): void {
        super.on(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    onImmediate(type: PlacesSearchBoxEvent, callback: EventCallback, config?: EventConfig): void {
        super.onImmediate(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    once(type: PlacesSearchBoxEvent, callback?: EventCallback, config?: EventConfig): void {
        super.once(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    onceImmediate(type: PlacesSearchBoxEvent, callback?: EventCallback, config?: EventConfig): void {
        super.onceImmediate(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    only(type: PlacesSearchBoxEvent, callback: EventCallback, config?: EventConfig): void {
        super.only(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    onlyOnce(type: PlacesSearchBoxEvent, callback: EventCallback, config?: EventConfig): void {
        super.onlyOnce(type, callback, config);
    }

    /**
     * Sets the region to use for biasing query predictions.
     *
     * Results will only be biased towards this area and not be completely restricted to it.
     *
     * @param {LatLngBoundsValue} value The bounds to set
     * @returns {PlacesSearchBox}
     */
    setBounds(value: LatLngBoundsValue): PlacesSearchBox {
        this.bounds = value;
        return this;
    }

    /**
     * Set the input reference
     *
     * @param {string|HTMLInputElement} input The input HTMLInputElement or the selector for the input element
     * @returns {PlacesSearchBox}
     */
    setInput(input: string | HTMLInputElement): PlacesSearchBox {
        this.input = input;
        return this;
    }

    /**
     * Set the places search box options
     *
     * @param {PlacesSearchBoxOptions} options The options to set
     * @returns {PlacesSearchBox}
     */
    setOptions(options: PlacesSearchBoxOptions): PlacesSearchBox {
        if (isObjectWithValues(options)) {
            if (options.bounds) {
                this.bounds = options.bounds;
            }
            if (typeof options.input !== 'undefined') {
                if (options.input instanceof HTMLInputElement) {
                    this.#input = options.input;
                } else if (isString(options.input)) {
                    this.#input = document.querySelector(options.input);
                    if (!this.#input) {
                        throw new Error(`The input element with the selector "${options.input}" was not found.`);
                    }
                }
            }
        }
        return this;
    }
}

// The possible values for the input parameter
export type PlacesSearchBoxValue = HTMLInputElement | string | PlacesSearchBox | PlacesSearchBoxOptions;

/**
 * Helper function to set up the places search box object
 *
 * @param {PlacesSearchBoxValue} [input] The input reference or the options
 * @param {PlacesSearchBoxOptions} [options] The places search box options
 * @returns {PlacesSearchBox}
 */
export const placesSearchBox = (input?: PlacesSearchBoxValue, options?: PlacesSearchBoxOptions): PlacesSearchBox => {
    if (input instanceof PlacesSearchBox) {
        return input;
    }
    return new PlacesSearchBox(input, options);
};
