/* ===========================================================================
    Helps to set up a Places Autocomplete Search Box for Google Maps
    https://developers.google.com/maps/documentation/javascript/place-autocomplete
=========================================================================== */

/* global google, HTMLInputElement */

import { AutocompleteSearchBoxEvents } from './constants';
import { Event, Evented, EventCallback, EventConfig, EventListenerOptions } from './Evented';
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
// The callback function for the AutocompleteSearchBox class events.
// The base Evented class types callbacks with the generic Event object, so the event listener methods
// below cast this callback to EventCallback when passing it on. That's safe because this class
// dispatches the place_changed event with the place and bounds values added to the event object.
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
     * @type {HTMLInputElement | undefined}
     */
    #input: HTMLInputElement | undefined;

    /**
     * Holds the promise for setting up the search box.
     *
     * Every call to init() waits on this same promise so that the search box is only built once,
     * however many times init() is called and whenever those calls are made.
     *
     * @private
     * @type {Promise<void>|undefined}
     */
    #initPromise: Promise<void> | undefined;

    /**
     * Holds the place that has been found.
     *
     * @private
     * @type {google.maps.places.PlaceResult | undefined}
     */
    #place: google.maps.places.PlaceResult | undefined;

    /**
     * Holds the map bounds based on the place that has been found
     *
     * @private
     * @type {LatLngBounds | undefined}
     */
    #placeBounds: LatLngBounds | undefined;

    /**
     * Holds the reference to the Google Maps SearchBox object
     *
     * @private
     * @type {google.maps.places.Autocomplete | undefined}
     */
    #searchBox: google.maps.places.Autocomplete | undefined;

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
     * @type {string[] | undefined}
     */
    #types: string[] | undefined;

    /**
     * Constructor
     *
     * @param {string | HTMLInputElement | AutocompleteSearchBoxOptions} [input] The input reference or the options
     * @param {AutocompleteSearchBoxOptions} [options] The places autocomplete search box options if the input is reference to the input element
     */
    constructor(
        input?: string | HTMLInputElement | AutocompleteSearchBoxOptions,
        options?: AutocompleteSearchBoxOptions,
    ) {
        super('placesSearchBox', 'places');

        if (input instanceof HTMLInputElement) {
            // An HTMLInputElement was passed
            this.#input = input;
            if (options) {
                this.setOptions(options);
            }
        } else if (isString(input)) {
            // A string selector for the HTMLInputElement was passed
            this.#input = document.querySelector<HTMLInputElement>(input) ?? undefined;
            if (!this.#input) {
                throw new Error(`The input element with the selector "${input}" was not found.`);
            }
            if (options) {
                this.setOptions(options);
            }
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
        const searchBox = this.#searchBox;
        if (searchBox) {
            boundsValue.toGoogle().then((bounds) => {
                searchBox.setBounds(bounds);
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
            this.#input = document.querySelector<HTMLInputElement>(value) ?? undefined;
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
        // The work is only started once and every caller waits on the same promise. See the
        // comment on PlacesSearchBox.init() - this class had the same problem, because it also
        // awaits the bounds before assigning #searchBox.
        if (!this.#initPromise) {
            const initPromise = new Promise<void>((resolve, reject) => {
                if (checkForGoogleMaps('AutocompleteSearchBox', 'places', false)) {
                    this.#createAutocompleteSearchBox().then(resolve).catch(reject);
                } else {
                    // The Google maps object isn't available yet. Wait for it to load.
                    // The developer may have set the map on the marker before the Google maps object was available.
                    // whenMapLoaded() rather than the "map_load" event, which is only dispatched
                    // on success - waiting on it alone left this promise unsettled when the load
                    // failed.
                    loader()
                        .whenMapLoaded()
                        .then(() => {
                            this.#createAutocompleteSearchBox().then(resolve).catch(reject);
                        })
                        .catch(reject);
                }
            });
            // A failure is not remembered. Initializing throws when there's no input element, and
            // holding on to the rejected promise meant every later init() got that same failure
            // back - so setting the input afterwards and calling init() again could never work.
            // Clearing it lets a later call start again. The promise is only forgotten once it
            // has actually failed, so calls made while it's still running share it as before.
            //
            // Nothing is built twice by this: #createAutocompleteSearchBox() returns early when
            // #searchBox is already set, so a retry after a successful init still creates nothing.
            // The check is against the promise that gets stored below, not the one being
            // wrapped, so that a call which has already started a new attempt isn't undone.
            // The callback only runs once the promise has rejected, which is always after the
            // assignment below it.
            const tracked: Promise<void> = initPromise.catch((error) => {
                if (this.#initPromise === tracked) {
                    this.#initPromise = undefined;
                }
                throw error;
            });
            this.#initPromise = tracked;
        }
        return this.#initPromise;
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
            if (!this.#input) {
                throw new Error('The input element must be set before the autocomplete search box can be initialized.');
            }
            const searchBox = new google.maps.places.Autocomplete(this.#input, options);
            this.#searchBox = searchBox;
            // Add the listener for when the user selects a place
            searchBox.addListener(AutocompleteSearchBoxEvents.PLACE_CHANGED, () => {
                const place = searchBox.getPlace();
                const bounds = latLngBounds();
                // Set up the map bounds based on the place
                // https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceGeometry
                // A place may not have geometry, for example if the user pressed Enter without picking a suggestion.
                if (place.geometry) {
                    if (place.geometry.viewport) {
                        // Only geocodes have viewport.
                        bounds.union(place.geometry.viewport);
                    } else if (place.geometry.location) {
                        bounds.extend(latLng(place.geometry.location));
                    }
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
        return super.hasListener(type, callback as EventCallback | undefined);
    }

    /**
     * @inheritdoc
     */
    off(
        type?: AutocompleteSearchBoxEvent,
        callback?: AutocompleteSearchBoxEventCallback,
        options?: EventListenerOptions,
    ): void {
        super.off(type, callback as EventCallback | undefined, options);
    }

    /**
     * @inheritdoc
     */
    on(type: AutocompleteSearchBoxEvent, callback: AutocompleteSearchBoxEventCallback, config?: EventConfig): void {
        super.on(type, callback as EventCallback, config);
    }

    /**
     * @inheritdoc
     */
    onImmediate(
        type: AutocompleteSearchBoxEvent,
        callback: AutocompleteSearchBoxEventCallback,
        config?: EventConfig,
    ): void {
        super.onImmediate(type, callback as EventCallback, config);
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
        super.once(type, callback as EventCallback | undefined, config);
    }

    /**
     * @inheritdoc
     */
    onceImmediate(
        type: AutocompleteSearchBoxEvent,
        callback?: AutocompleteSearchBoxEventCallback,
        config?: EventConfig,
    ): void {
        super.onceImmediate(type, callback as EventCallback | undefined, config);
    }

    /**
     * @inheritdoc
     */
    only(type: AutocompleteSearchBoxEvent, callback: AutocompleteSearchBoxEventCallback, config?: EventConfig): void {
        super.only(type, callback as EventCallback, config);
    }

    /**
     * @inheritdoc
     */
    onlyOnce(
        type: AutocompleteSearchBoxEvent,
        callback: AutocompleteSearchBoxEventCallback,
        config?: EventConfig,
    ): void {
        super.onlyOnce(type, callback as EventCallback, config);
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
                    this.#input = document.querySelector<HTMLInputElement>(options.input) ?? undefined;
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
    options?: AutocompleteSearchBoxOptions,
): AutocompleteSearchBox => {
    if (input instanceof AutocompleteSearchBox) {
        return input;
    }
    return new AutocompleteSearchBox(input, options);
};
