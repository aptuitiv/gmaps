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
import GeocodeResults from './Geocode/Results';

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
    // Whether to use the shared cache of results. Defaults to true. Set it to false for a
    // request that has to reach Google, for example when a result is expected to have changed.
    cache?: boolean;
    componentRestrictions?: GeocodeComponentRestrictions;
    language?: string; // See https://developers.google.com/maps/faq#languagesupport for the list of supported languages
    location?: LatLngValue;
    placeId?: string;
    region?: string;
};

/**
 * The shared Geocoder, built the first time one is needed.
 *
 * A new google.maps.Geocoder used to be built for every request. One is enough - it holds no
 * per-request state - and building it lazily means that simply importing this file doesn't
 * reach for the Google library.
 */
let sharedGeocoder: google.maps.Geocoder | undefined;

/**
 * The cache of geocode requests, keyed on the request.
 *
 * The value is the *promise*, not the result. That is what makes this dedupe concurrent calls
 * as well as repeat ones: the second of two identical requests made before the first comes back
 * gets the same promise, so Google is called - and billed - once instead of twice.
 */
const geocodeCache: Map<string, Promise<GeocodeResults>> = new Map();

// How many entries the cache holds before the oldest is dropped. Geocode results can
// legitimately change, so this is a cap rather than a permanent store.
// Reassigned by the Geocode.cacheSize setter.
let geocodeCacheSize = 50;

/**
 * Drop the oldest entries until the cache is within its cap.
 *
 * Map iterates in insertion order, so the first key is the oldest.
 */
const trimGeocodeCache = (): void => {
    while (geocodeCache.size > geocodeCacheSize) {
        const oldest = geocodeCache.keys().next();
        if (oldest.done) {
            return;
        }
        geocodeCache.delete(oldest.value);
    }
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
    #address?: string;

    /**
     * The bounds within which to bias geocode results more prominently
     *
     * @type {LatLngBounds}
     * @private
     */
    #bounds?: LatLngBounds;

    /**
     * Whether this object uses the shared cache of results
     *
     * @type {boolean}
     * @private
     */
    #cache: boolean = true;

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
    constructor(options?: GeocodeOptions) {
        super('geocode');

        if (isObject(options)) {
            this.setOptions(options);
        }
    }

    /**
     * Empty the cache of geocode results.
     *
     * The shared Geocoder is dropped as well, so the next request builds a new one. Call this if
     * the results for an address may have changed.
     */
    static clearCache(): void {
        geocodeCache.clear();
        sharedGeocoder = undefined;
    }

    /**
     * How many results the cache holds before the oldest is dropped
     *
     * @returns {number}
     */
    static get cacheSize(): number {
        return geocodeCacheSize;
    }

    /**
     * Set how many results the cache holds. Set it to 0 to turn caching off everywhere.
     *
     * @param {number} size The number of results to hold
     */
    static set cacheSize(size: number) {
        if (typeof size === 'number' && Number.isFinite(size) && size >= 0) {
            geocodeCacheSize = Math.floor(size);
            trimGeocodeCache();
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
            const keys: (keyof GeocodeComponentRestrictions)[] = [
                'administrativeArea',
                'country',
                'locality',
                'postalCode',
                'route',
            ];
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
     * Alias for the geocode method
     *
     * @param {GeocodeOptions} [options] The Geocode options
     * @returns {Promise<GeocodeResults>}
     */
    fetch(options?: GeocodeOptions): Promise<GeocodeResults> {
        return this.geocode(options);
    }

    /**
     * Call the Google Maps Geocoder service
     *
     * @param {GeocodeOptions} [options] The Geocode options
     * @returns {Promise<GeocodeResults>}
     */
    geocode(options?: GeocodeOptions): Promise<GeocodeResults> {
        if (isObject(options)) {
            this.setOptions(options);
        }

        // A cache size of 0 turns caching off for everyone; the "cache" option turns it off for
        // this object alone.
        const useCache = this.#cache && geocodeCacheSize > 0;
        const key = useCache ? this.#cacheKey() : '';
        if (useCache) {
            const cached = geocodeCache.get(key);
            if (cached) {
                return cached;
            }
        }

        const request = this.#requestResults();
        if (useCache) {
            geocodeCache.set(key, request);
            // A failed lookup must not stay cached, or one bad response would be remembered for
            // the life of the page. The caller still gets the rejection from the promise it was
            // handed, so nothing is swallowed here.
            request.catch(() => {
                geocodeCache.delete(key);
            });
            trimGeocodeCache();
        }
        return request;
    }

    /**
     * Build the key that this request is cached under.
     *
     * The key is built from this object's own values rather than from the Google request, because
     * the Google request holds LatLng and LatLngBounds objects that don't serialise usefully. The
     * bounds are read through getNorthEast()/getSouthWest(), which work before the Google library
     * has loaded.
     *
     * @private
     * @returns {string}
     */
    #cacheKey(): string {
        const ne = this.#bounds?.getNorthEast();
        const sw = this.#bounds?.getSouthWest();
        return JSON.stringify({
            address: this.#address,
            bounds: ne && sw ? [ne.latitude, ne.longitude, sw.latitude, sw.longitude] : undefined,
            componentRestrictions: this.#componentRestrictions,
            language: this.#language,
            location: this.#location ? [this.#location.latitude, this.#location.longitude] : undefined,
            placeId: this.#placeId,
            region: this.#region,
        });
    }

    /**
     * Send the request, waiting for the Google library first if it isn't loaded yet
     *
     * @private
     * @returns {Promise<GeocodeResults>}
     */
    #requestResults(): Promise<GeocodeResults> {
        return new Promise((resolve, reject) => {
            if (checkForGoogleMaps('Geocoder', 'Geocoder', false)) {
                this.#runGeocode()
                    .then((results) => {
                        resolve(results);
                    })
                    .catch((status) => {
                        // https://developers.google.com/maps/documentation/javascript/reference/3.56/geocoder?hl=en#GeocoderStatus
                        if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
                            resolve(new GeocodeResults());
                        } else {
                            reject(status);
                        }
                    });
            } else {
                // The Google maps object isn't available yet. Wait for it to load.
                // The developer may have set the map on the marker before the Google maps object was available.
                // whenMapLoaded() rather than the "map_load" event, which is only dispatched on
                // success - waiting on it alone left this promise unsettled when the load failed,
                // so the geocode never came back either way.
                loader()
                    .whenMapLoaded()
                    .then(() => {
                        this.#runGeocode()
                            .then((results) => {
                                resolve(results);
                            })
                            .catch((status) => {
                                // https://developers.google.com/maps/documentation/javascript/reference/3.56/geocoder?hl=en#GeocoderStatus
                                if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
                                    resolve(new GeocodeResults());
                                } else {
                                    reject(status);
                                }
                            });
                    })
                    .catch(reject);
            }
        });
    }

    /**
     * Runs the geocode request
     *
     * @returns {Promise<GeocodeResults>}
     */
    #runGeocode = async (): Promise<GeocodeResults> => {
        const options: google.maps.GeocoderRequest = {};
        if (this.#address) {
            options.address = this.#address;
        } else if (this.#location) {
            options.location = this.#location.toGoogle();
        } else if (this.#placeId) {
            options.placeId = this.#placeId;
        }

        // Wait for the bounds so that they're set before the request is sent
        if (this.#bounds) {
            options.bounds = await this.#bounds.toGoogle();
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

        return new Promise((resolve, reject) => {
            // One shared Geocoder instead of one per request. It holds no per-request state.
            sharedGeocoder ??= new google.maps.Geocoder();
            sharedGeocoder.geocode(options, (results, status) => {
                if (status === google.maps.GeocoderStatus.OK) {
                    const resultsObj = new GeocodeResults(results ?? undefined);
                    resolve(resultsObj);
                } else {
                    reject(status);
                }
            });
        });
    };

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

    /**
     * Set the language to use for the geocode
     * See https://developers.google.com/maps/faq#languagesupport for the list of supported languages
     *
     * @param {string} language The language to use for the geocode
     * @returns {Geocode}
     */
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
        if (typeof options.cache === 'boolean') {
            this.#cache = options.cache;
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
