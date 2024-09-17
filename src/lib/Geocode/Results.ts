/* ===========================================================================
    Object to hold the Geocode results
=========================================================================== */

/* global google */

import Base from '../Base';
import GeocodeResult from './Result';

/**
 * The geocode result class
 *
 * This is intended to be an internal class and not instantiated directly outside this library.
 * It is used to wrap the array of Google Maps GeocoderResult objects and hold them as GeocodeResult objects.
 */
class GeocodeResults extends Base {
    /**
     * Holds the original GeocoderResult objects
     *
     * @private
     * @type {GeocodeResult[]}
     */
    #results: GeocodeResult[] = [];

    /**
     * Constructor
     *
     * @param {google.maps.GeocoderResult[]} [results] The Google Maps GeocoderResult objects
     */
    constructor(results?: google.maps.GeocoderResult[]) {
        super('geocodeResults');
        if (Array.isArray(results)) {
            results.forEach((result) => {
                this.#results.push(new GeocodeResult(result));
            });
        }
    }

    /**
     * Gets the first result
     *
     * @returns {GeocodeResult}
     */
    getFirst(): GeocodeResult {
        let returnValue: GeocodeResult;
        if (this.#results.length > 0) {
            [returnValue] = this.#results;
        } else {
            returnValue = new GeocodeResult();
        }

        return returnValue;
    }

    /**
     * Returns the results
     *
     * @returns {GeocodeResult[]}
     */
    getResults(): GeocodeResult[] {
        return this.#results;
    }

    /**
     * Returns whether any results were found
     *
     * @returns {boolean}
     */
    hasResults(): boolean {
        return this.#results.length > 0;
    }
}

export default GeocodeResults;
