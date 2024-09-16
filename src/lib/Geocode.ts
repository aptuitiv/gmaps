/* ===========================================================================
    Provides access to the Google Maps Geocoding API
    https://developers.google.com/maps/documentation/javascript/geocoding
=========================================================================== */

/* global google */

import Base from './Base';
import { latLng, LatLng, LatLngValue } from './LatLng';
import { latLngBounds, LatLngBounds, LatLngBoundsValue } from './LatLngBounds';
import { loader } from './Loader';
import { checkForGoogleMaps, isObject, isObjectWithValues, isString, isStringWithValue } from './helpers';

// Component restriction options
// https://developers.google.com/maps/documentation/javascript/reference/geocoder#GeocoderComponentRestrictions
export type GeocodeComponentRestrictions = {
    administrativeArea?: string;
    country?: string;
    locality?: string;
    postalCode?: string;
    route?: string;
};

// Options to pass the Geocode constructor
export type GeocodeOptions = {
    address?: string;
    bounds?: LatLngBoundsValue;
    componentRestrictions?: GeocodeComponentRestrictions;
    language?: string; // See https://developers.google.com/maps/faq#languagesupport for the list of supported languages
    location?: LatLngValue;
    placeId?: string;
    region?: string;
};

/**
 * The Geocode class
 */
export class Geocode extends Base {
    /**
     * The address to geocode
     *
     * @type {string}
     * @private
     */
    #address: string;

    /**
     * The bounds within which to bias geocode results more prominently
     *
     * @type {LatLngBounds}
     * @private
     */
    #bounds?: LatLngBounds;

    /**
     * Holds the component restrictions
     *
     * @type {GeocodeComponentRestrictions}
     * @private
     */
    #componentRestrictions?: GeocodeComponentRestrictions;

    /**
     * The language to use for the geocode
     *
     * See https://developers.google.com/maps/faq#languagesupport for the list of supported languages
     *
     * @type {string}
     * @private
     */
    #language?: string;

    /**
     * The location to geocode
     *
     * @type {LatLng}
     * @private
     */
    #location?: LatLng;

    /**
     * Holds the id of the place to geocode
     *
     * @type {string}
     * @private
     */
    #placeId?: string;

    /**
     * The region code to influence the geocoding
     *
     * @type {string}
     * @private
     */
    #region?: string;

    /**
     * Constructor
     *
     * @param {GeocodeOptions} [options] The Geocode options
     */
    constructor(options: GeocodeOptions) {
        super('geocode');

        if (isObject(options)) {
            this.setOptions(options);
        }
    }

    /**
     * Returns the address
     *
     * @returns {string|undefined}
     */
    get address(): string | undefined {
        return this.#address;
    }

    /**
     * Sets the address to geocode
     *
     * @param {string} address The address to geocode
     */
    set address(address: string) {
        if (isString(address)) {
            this.#address = address;
        }
    }

    /**
     * Returns the bounds
     *
     * @returns {LatLngBounds|undefined}
     */
    get bounds(): LatLngBounds | undefined {
        return this.#bounds;
    }

    /**
     * Sets the bounds within which to bias geocode results more prominently
     *
     * @param {LatLngBoundsValue} bounds The bounds within which to bias geocode results more prominently
     */
    set bounds(bounds: LatLngBoundsValue) {
        this.#bounds = latLngBounds(bounds);
    }

    /**
     * Get the component restrictions
     *
     * @returns {GeocodeComponentRestrictions|undefined}
     */
    get componentRestrictions(): GeocodeComponentRestrictions | undefined {
        return this.#componentRestrictions;
    }

    /**
     * Set the component restrictions
     *
     * @param {GeocodeComponentRestrictions} componentRestrictions The component restrictions
     */
    set componentRestrictions(componentRestrictions: GeocodeComponentRestrictions) {
        if (isObjectWithValues(componentRestrictions)) {
            const restrictions: GeocodeComponentRestrictions = {};
            const keys = ['administrativeArea', 'country', 'locality', 'postalCode', 'route'];
            keys.forEach((key) => {
                if (isStringWithValue(componentRestrictions[key])) {
                    restrictions[key] = componentRestrictions[key];
                }
            });
            this.#componentRestrictions = restrictions;
        }
    }

    /**
     * Get the language to use for the geocode
     *
     * @returns {string|undefined}
     */
    get language(): string | undefined {
        return this.#language;
    }

    /**
     * Set the language to use for the geocode
     *
     * See https://developers.google.com/maps/faq#languagesupport for the list of supported languages
     *
     * @param {string} language The language to use for the geocode
     */
    set language(language: string) {
        if (isStringWithValue(language)) {
            this.#language = language;
        }
    }

    /**
     * Get the location to geocode
     *
     * @returns {LatLng|undefined}
     */
    get location(): LatLng | undefined {
        return this.#location;
    }

    /**
     * Set the location to geocode
     *
     * @param {LatLngValue} location The location to geocode
     */
    set location(location: LatLngValue) {
        const value = latLng(location);
        if (value.isValid()) {
            this.#location = value;
        }
    }

    /**
     * Get the place id
     *
     * @returns {string|undefined}
     */
    get placeId(): string | undefined {
        return this.#placeId;
    }

    /**
     * Set the place id
     *
     * @param {string} placeId The place id
     */
    set placeId(placeId: string) {
        if (isStringWithValue(placeId)) {
            this.#placeId = placeId;
        }
    }

    /**
     * Get the region code
     *
     * @returns {string|undefined}
     */
    get region(): string | undefined {
        return this.#region;
    }

    /**
     * Set the region code
     *
     * @param {string} region The region code
     */
    set region(region: string) {
        if (isStringWithValue(region)) {
            this.#region = region;
        }
    }

    /**
     * Call the Google Maps Geocoder service
     *
     * @param {GeocodeOptions} [options] The Geocode options
     * @returns {Promise<google.maps.GeocoderResult[]>}
     */
    geocode(options?: GeocodeOptions): Promise<google.maps.GeocoderResult[]> {
        return new Promise((resolve, reject) => {
            if (isObject(options)) {
                this.setOptions(options);
            }
            if (checkForGoogleMaps('Geocoder', 'Geocoder', false)) {
                this.#runGeocode()
                    .then((results) => {
                        resolve(results);
                    })
                    .catch((status) => {
                        reject(status);
                    });
            } else {
                // The Google maps object isn't available yet. Wait for it to load.
                // The developer may have set the map on the marker before the Google maps object was available.
                loader().once('map_loaded', () => {
                    this.#runGeocode()
                        .then((results) => {
                            resolve(results);
                        })
                        .catch((status) => {
                            reject(status);
                        });
                });
            }
        });
    }

    /**
     * Call the Google Maps Geocoder service
     *
     * Alias for the geocode method
     *
     * @param {GeocodeOptions} [options] The Geocode options
     * @returns {Promise<google.maps.GeocoderResult[]>}
     */
    run(options?: GeocodeOptions): Promise<google.maps.GeocoderResult[]> {
        return this.geocode(options);
    }

    /**
     * Runs the geocode request
     *
     * @returns {Promise<google.maps.GeocoderResult[]>}
     */
    #runGeocode = (): Promise<google.maps.GeocoderResult[]> =>
        new Promise((resolve, reject) => {
            const options: google.maps.GeocoderRequest = {};
            if (this.#address) {
                options.address = this.#address;
            } else if (this.#location) {
                options.location = this.#location.toGoogle();
            } else if (this.#placeId) {
                options.placeId = this.#placeId;
            }

            if (this.#bounds) {
                (async () => {
                    options.bounds = await this.#bounds.toGoogle();
                })();
            }
            if (this.#componentRestrictions) {
                options.componentRestrictions = this.#componentRestrictions;
            }
            if (this.#language) {
                options.language = this.#language;
            }
            if (this.#region) {
                options.region = this.#region;
            }

            const geocoder = new google.maps.Geocoder();
            geocoder.geocode(options, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    resolve(results);
                } else {
                    reject(status);
                }
            });
        });

    /**
     * Set the address to geocode
     *
     * @param {string} address The address to geocode
     * @returns {Geocode}
     */
    setAddress(address: string): Geocode {
        this.address = address;
        return this;
    }

    /**
     * Set the bounds within which to bias geocode results more prominently
     *
     * @param {LatLngBoundsValue} bounds The bounds within which to bias geocode results more prominently
     * @returns {Geocode}
     */
    setBounds(bounds: LatLngBoundsValue): Geocode {
        this.bounds = bounds;
        return this;
    }

    /**
     * Set the component restrictions
     *
     * @param {GeocodeComponentRestrictions} componentRestrictions The component restrictions
     * @returns {Geocode}
     */
    setComponentRestrictions(componentRestrictions: GeocodeComponentRestrictions): Geocode {
        this.componentRestrictions = componentRestrictions;
        return this;
    }

    setLanguage(language: string): Geocode {
        this.language = language;
        return this;
    }

    /**
     * Set the location to geocode
     *
     * @param {LatLngValue} location The location to geocode
     * @returns {Geocode}
     */
    setLocation(location: LatLngValue): Geocode {
        this.location = location;
        return this;
    }

    /**
     * Set the place id
     *
     * @param {string} placeId The place id
     * @returns {Geocode}
     */
    setPlaceId(placeId: string): Geocode {
        this.placeId = placeId;
        return this;
    }

    /**
     * Set the region code
     *
     * @param {string} region The region code
     * @returns {Geocode}
     */
    setRegion(region: string): Geocode {
        this.region = region;
        return this;
    }

    /**
     * Sets the options for the popup
     *
     * @param {GeocodeOptions} options Geocode options
     * @returns {Geocode}
     */
    setOptions(options: GeocodeOptions): Geocode {
        if (options.address) {
            this.address = options.address;
        }
        if (options.bounds) {
            this.bounds = options.bounds;
        }
        if (options.componentRestrictions) {
            this.componentRestrictions = options.componentRestrictions;
        }
        if (options.language) {
            this.language = options.language;
        }
        if (options.location) {
            this.location = options.location;
        }
        if (options.placeId) {
            this.placeId = options.placeId;
        }
        if (options.region) {
            this.region = options.region;
        }

        return this;
    }
}

// The Geocode value type
export type GeocodeValue = Geocode | GeocodeOptions;

/**
 * Helper function to set up a new Geocode object value
 *
 * @param {GeocodeValue} [options] The options for the Geocode object
 * @returns {Geocode}
 */
export const geocode = (options?: GeocodeValue): Geocode => {
    if (options instanceof Geocode) {
        return options;
    }
    return new Geocode(options);
};
