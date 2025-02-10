/* ===========================================================================
    Helps to set up a Places Autocomplete Search Box for Google Maps
    https://developers.google.com/maps/documentation/javascript/place-autocomplete
=========================================================================== */

/* global google, HTMLInputElement */

import { AutocompleteSearchBoxEvents } from './constants';
import { Evented, EventConfig, EventListenerOptions } from './Evented';
import { checkForGoogleMaps, isBoolean, isObject, isObjectWithValues, isString } from './helpers';
import { latLng } from './LatLng';
import { latLngBounds, LatLngBounds, LatLngBoundsValue } from './LatLngBounds';
import { loader } from './Loader';

// Options that can be passed to the AutocompleteSearchBox class
export type AutocompleteSearchBoxOptions = {
    // The area in which to search for places. Results are biased towards, but not restricted to, places within these bounds unless strictBounds is set to true.
    bounds?: LatLngBoundsValue;
    // THe input element reference. Either a string for the selector or an HTMLInputElement.
    input: string | HTMLInputElement;
    // Restricts predictions to the specified country (ISO 3166-1 Alpha-2 country code, case insensitive).
    // For example, 'us', 'br', or 'au'.
    // You can provide a single one, or an array of up to five country code strings.
    // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#ComponentRestrictions
    countryRestriction?: string | string[];
    // Fields to be included for the Place in the details response when the details are successfully retrieved, which will be billed for by Google.
    // If ['ALL'] is passed in, all available fields will be returned and billed for (this is not recommended for production deployments).
    // For a list of fields see PlaceResult (https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceResult).
    // Nested fields can be specified with dot-paths (for example, "geometry.location"). The default is ['ALL'].
    fields?: string[];
    // A boolean value, indicating that the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.
    // Setting strictBounds to false (which is the default) will make the results biased towards, but not restricted to, places contained within the bounds.
    strictBounds?: boolean;
    // The types of predictions to be returned.
    // Documentation: https://developers.google.com/maps/documentation/javascript/place-autocomplete#constrain-place-types
    // You can set either up to five values from Table 1 (https://developers.google.com/maps/documentation/javascript/supported_types#table1)
    // or Table 2 (https://developers.google.com/maps/documentation/javascript/supported_types#table2),
    // or a single type from Table 3 (https://developers.google.com/maps/documentation/javascript/supported_types#table3).
    types?: string[];
};

// Event types for the AutocompleteSearchBox class
type AutocompleteSearchBoxEvent = 'place_changed';

// The event data object for the AutocompleteSearchBox class events
type AutocompleteSearchBoxEventObject = Event & {
    place: google.maps.places.PlaceResult;
    bounds: LatLngBounds;
};
// The callback function for the AutocompleteSearchBox class events
type AutocompleteSearchBoxEventCallback = (event: AutocompleteSearchBoxEventObject) => void;

/**
 * The AutocompleteSearchBox class
 */
export class AutocompleteSearchBox extends Evented {
    /**
     * Holds the bounds to restrict the search to
     *
     * @private
     * @type {LatLngBounds | undefined}
     */
    #bounds: LatLngBounds | undefined;

    /**
     * Holds the region to use for biasing query predictions.
     *
     * https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#ComponentRestrictions
     *
     * @private
     * @type {string|Array<string>|null}
     */
    #countryRestriction: string | string[] | null = null;

    /**
     * Holds the fields to be included for the Place in the details response when the details are successfully retrieved.
     *
     * @private
     * @type {string[]}
     */
    #fields: string[] = ['ALL'];

    /**
     * Holds the reference to the input element
     *
     * @private
     * @type {HTMLInputElement}
     */
    #input: HTMLInputElement;

    /**
     * Holds the place that has been found.
     *
     * @private
     * @type {google.maps.places.PlaceResult}
     */
    #place: google.maps.places.PlaceResult;

    /**
     * Holds the map bounds based on the place that has been found
     *
     * @private
     * @type {LatLngBounds}
     */
    #placeBounds: LatLngBounds;

    /**
     * Holds the reference to the Google Maps SearchBox object
     *
     * @private
     * @type {google.maps.places.Autocomplete}
     */
    #searchBox: google.maps.places.Autocomplete;

    /**
     * Sets whether the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.
     *
     * @private
     * @type {boolean}
     */
    #strictBounds: boolean = false;

    /**
     * Holds the types of predictions to be returned.
     *
     * @private
     * @type {string[]}
     */
    #types: string[];

    /**
     * Constructor
     *
     * @param {string | HTMLInputElement | AutocompleteSearchBoxOptions} input The input reference or the options
     * @param {AutocompleteSearchBoxOptions} [options] The places autocomplete search box options if the input is reference to the input element
     */
    constructor(
        input: string | HTMLInputElement | AutocompleteSearchBoxOptions,
        options?: AutocompleteSearchBoxOptions
    ) {
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
        return this.#bounds ?? undefined;
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
        this.#bounds = boundsValue;
        if (this.#searchBox) {
            boundsValue.toGoogle().then((bounds) => {
                this.#searchBox.setBounds(bounds);
            });
        }
    }

    /**
     * Sets the country or countries to use for biasing query predictions.
     *
     * @param {string | string[] | null} value The country restriction to set
     */
    set countryRestriction(value: string | string[] | null) {
        if (isString(value) || Array.isArray(value) || value === null) {
            this.#countryRestriction = value;
            if (this.#searchBox) {
                this.#searchBox.setComponentRestrictions({ country: value });
            }
        }
    }

    /**
     * Get the country or countries to use for biasing query predictions.
     *
     * @returns {string | string[] | null}
     */
    get countryRestriction(): string | string[] | null {
        return this.#countryRestriction;
    }

    /**
     * Set the fields to be included for the Place in the details response when the details are successfully retrieved.
     *
     * @param {string | string[]} value The fields to set
     */
    set fields(value: string | string[]) {
        if (isString(value)) {
            this.#fields = [value];
        } else if (Array.isArray(value)) {
            this.#fields = value;
        }
        if (this.#searchBox) {
            this.#searchBox.setFields(this.#fields);
        }
    }

    /**
     * Get the fields to be included for the Place in the details response when the details are successfully retrieved.
     *
     * @returns {string[]}
     */
    get fields(): string[] {
        return this.#fields;
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
     * Get whether the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.
     *
     * @returns {boolean}
     */
    get strictBounds(): boolean {
        return this.#strictBounds;
    }

    /**
     * Set that the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.
     *
     * Setting strictBounds to false (which is the default) will make the results biased towards, but not restricted to, places contained within the bounds.
     *
     * @param {boolean} value The value to set
     */
    set strictBounds(value: boolean) {
        if (isBoolean(value)) {
            this.#strictBounds = value;
            if (this.#searchBox) {
                this.#searchBox.setOptions({ strictBounds: value });
            }
        }
    }

    /**
     * Get the types of predictions to be returned.
     *
     * @returns {string[] | undefined}
     */
    get types(): string[] | undefined {
        return this.#types;
    }

    /**
     * Set the types of predictions to be returned.
     *
     * To clear the types set it to null.
     *
     * @param {string | string[] | null} value The types to set
     */
    set types(value: null | string | string[]) {
        if (Array.isArray(value)) {
            this.#types = value;
        } else if (isString(value)) {
            this.#types = [value];
        } else {
            this.#types = [];
        }
        if (this.#searchBox) {
            this.#searchBox.setTypes(this.#types);
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
     * Get the country or countries to use for biasing query predictions.
     *
     * @returns {string | string[] | null}
     */
    getCountryRestriction(): string | string[] | null {
        return this.#countryRestriction;
    }

    /**
     * Get the fields to be included for the Place in the details response when the details are successfully retrieved.
     *
     * @returns {string[]}
     */
    getFields(): string[] {
        return this.fields;
    }

    /**
     * Get the HTML input element reference
     *
     * @returns {HTMLInputElement | undefined}
     */
    getInput(): HTMLInputElement | undefined {
        return this.#input;
    }

    /**
     * Gets the place that has been found
     *
     * The results from the place_changed event is one place and it's the place that the user clicked on.
     *
     * @returns {google.maps.places.PlaceResult | undefined}
     */
    getPlace(): google.maps.places.PlaceResult | undefined {
        return this.#place;
    }

    /**
     * Get the map bounds based on the place that has been found.
     *
     * @returns {LatLngBounds|undefined}
     */
    getPlaceBounds(): LatLngBounds | undefined {
        return this.#placeBounds;
    }

    /**
     * Get whether the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.
     *
     * @returns {boolean}
     */
    getStrictBounds(): boolean {
        return this.strictBounds;
    }

    /**
     * Get the types of predictions to be returned.
     *
     * @returns {string[] | undefined}
     */
    getTypes(): string[] | undefined {
        return this.#types;
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
                if (checkForGoogleMaps('AutocompleteSearchBox', 'places', false)) {
                    this.#createAutocompleteSearchBox().then(() => {
                        resolve();
                    });
                } else {
                    // The Google maps object isn't available yet. Wait for it to load.
                    // The developer may have set the map on the marker before the Google maps object was available.
                    loader().once('map_loaded', () => {
                        this.#createAutocompleteSearchBox().then(() => {
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
    #createAutocompleteSearchBox = async () => {
        if (!this.#searchBox) {
            const options: google.maps.places.AutocompleteOptions = {
                strictBounds: this.#strictBounds,
            };
            if (this.#bounds) {
                options.bounds = await this.#bounds.toGoogle();
            }
            if (this.#countryRestriction) {
                options.componentRestrictions = { country: this.#countryRestriction };
            }
            if (this.#fields) {
                options.fields = this.#fields;
            }
            if (this.#types) {
                options.types = this.#types;
            }
            this.#searchBox = new google.maps.places.Autocomplete(this.#input, options);
            // Add the listener for when the user selects a place
            this.#searchBox.addListener(AutocompleteSearchBoxEvents.PLACE_CHANGED, () => {
                const place = this.#searchBox.getPlace();
                const bounds = latLngBounds();
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
                this.#place = place;
                this.#placeBounds = bounds;
                this.dispatch(AutocompleteSearchBoxEvents.PLACE_CHANGED, { place, bounds });
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
    hasListener(type: AutocompleteSearchBoxEvent, callback?: AutocompleteSearchBoxEventCallback): boolean {
        return super.hasListener(type, callback);
    }

    /**
     * @inheritdoc
     */
    off(
        type?: AutocompleteSearchBoxEvent,
        callback?: AutocompleteSearchBoxEventCallback,
        options?: EventListenerOptions
    ): void {
        super.off(type, callback, options);
    }

    /**
     * @inheritdoc
     */
    on(type: AutocompleteSearchBoxEvent, callback: AutocompleteSearchBoxEventCallback, config?: EventConfig): void {
        super.on(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    onImmediate(
        type: AutocompleteSearchBoxEvent,
        callback: AutocompleteSearchBoxEventCallback,
        config?: EventConfig
    ): void {
        super.onImmediate(type, callback, config);
    }

    /**
     * Listen for the place changed event
     *
     * @example
     * autocompleteSearchBox.onPlaceChanged((place, bounds) => {
     *    console.log('Place: ', place);
     *   console.log('Bounds: ', bounds);
     * });
     * @param {(place: google.maps.places.PlaceResult, bounds: LatLngBounds) => void} callback The callback function
     * @returns {void}
     */
    onPlaceChanged(callback: (place: google.maps.places.PlaceResult, bounds: LatLngBounds) => void): void {
        this.on(AutocompleteSearchBoxEvents.PLACE_CHANGED, (data) => {
            callback(data.place, data.bounds);
        });
    }

    /**
     * @inheritdoc
     */
    once(type: AutocompleteSearchBoxEvent, callback?: AutocompleteSearchBoxEventCallback, config?: EventConfig): void {
        super.once(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    onceImmediate(
        type: AutocompleteSearchBoxEvent,
        callback?: AutocompleteSearchBoxEventCallback,
        config?: EventConfig
    ): void {
        super.onceImmediate(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    only(type: AutocompleteSearchBoxEvent, callback: AutocompleteSearchBoxEventCallback, config?: EventConfig): void {
        super.only(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    onlyOnce(
        type: AutocompleteSearchBoxEvent,
        callback: AutocompleteSearchBoxEventCallback,
        config?: EventConfig
    ): void {
        super.onlyOnce(type, callback, config);
    }

    /**
     * Sets the region to use for biasing query predictions.
     *
     * Results will only be biased towards this area and not be completely restricted to it.
     *
     * @param {LatLngBoundsValue} value The bounds to set
     * @returns {AutocompleteSearchBox}
     */
    setBounds(value: LatLngBoundsValue): AutocompleteSearchBox {
        this.bounds = value;
        return this;
    }

    /**
     * Sets the country or countries to use for biasing query predictions.
     *
     * @param {string|string[]|null} value The country restriction to set
     * @returns {AutocompleteSearchBox}
     */
    setCountryRestriction(value: string | string[] | null): AutocompleteSearchBox {
        this.countryRestriction = value;
        return this;
    }

    /**
     * Set the fields to be included for the Place in the details response when the details are successfully retrieved.
     *
     * @param {string|string[]} value The fields to set
     * @returns {AutocompleteSearchBox}
     */
    setFields(value: string | string[]): AutocompleteSearchBox {
        this.fields = value;
        return this;
    }

    /**
     * Set the input reference
     *
     * @param {string|HTMLInputElement} input The input HTMLInputElement or the selector for the input element
     * @returns {AutocompleteSearchBox}
     */
    setInput(input: string | HTMLInputElement): AutocompleteSearchBox {
        this.input = input;
        return this;
    }

    /**
     * Set the places search box options
     *
     * @param {AutocompleteSearchBoxOptions} options The options to set
     * @returns {AutocompleteSearchBox}
     */
    setOptions(options: AutocompleteSearchBoxOptions): AutocompleteSearchBox {
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
            if (options.countryRestriction) {
                this.countryRestriction = options.countryRestriction;
            }
            if (options.fields) {
                this.fields = options.fields;
            }
            if (isBoolean(options.strictBounds)) {
                this.strictBounds = options.strictBounds;
            }
            if (options.types) {
                this.types = options.types;
            }
        }
        return this;
    }

    /**
     * Set whether the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.
     *
     * Setting strictBounds to false (which is the default) will make the results biased towards, but not restricted to, places contained within the bounds.
     *
     * @param {boolean} value The value to set
     * @returns {AutocompleteSearchBox}
     */
    setStrictBounds(value: boolean): AutocompleteSearchBox {
        this.strictBounds = value;
        return this;
    }

    /**
     * Set the types of predictions to be returned.
     *
     * To clear the types set it to null.
     *
     * @param {string | string[] | null} value The types to set
     * @returns {AutocompleteSearchBox}
     */
    setTypes(value: null | string | string[]): AutocompleteSearchBox {
        this.types = value;
        return this;
    }
}

// The possible values for the input parameter
export type AutocompleteSearchBoxValue =
    | HTMLInputElement
    | string
    | AutocompleteSearchBox
    | AutocompleteSearchBoxOptions;

/**
 * Helper function to set up the places search box object
 *
 * @param {AutocompleteSearchBoxValue} [input] The input reference or the options
 * @param {AutocompleteSearchBoxOptions} [options] The places search box options
 * @returns {AutocompleteSearchBox}
 */
export const autocompleteSearchBox = (
    input?: AutocompleteSearchBoxValue,
    options?: AutocompleteSearchBoxOptions
): AutocompleteSearchBox => {
    if (input instanceof AutocompleteSearchBox) {
        return input;
    }
    return new AutocompleteSearchBox(input, options);
};
