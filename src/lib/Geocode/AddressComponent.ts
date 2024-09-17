/* ===========================================================================
    Represents a single address component.
=========================================================================== */

/* global google */

import Base from '../Base';
import { isObjectWithValues } from '../helpers';
import GeocodeAddressTypes from './AddressTypes';

/**
 * The geocode address component class
 */
class GeocodeAddressComponent extends Base {
    /**
     * Holds the original GeocoderAddressComponent object
     *
     * @private
     * @type {google.maps.GeocoderAddressComponent}
     */
    #component: google.maps.GeocoderAddressComponent;

    /**
     * Holds the types for the address component
     *
     * @private
     * @type {GeocodeAddressTypes}
     */
    #types: GeocodeAddressTypes;

    /**
     * Constructor
     *
     * @param {google.maps.GeocoderAddressComponent} component The Google Maps GeocoderAddressComponent object
     */
    constructor(component: google.maps.GeocoderAddressComponent) {
        super('addressComponent');
        this.#component = component;
        if (isObjectWithValues(component) && Array.isArray(component.types)) {
            this.#types = new GeocodeAddressTypes(component.types);
        } else {
            this.#types = new GeocodeAddressTypes();
        }
    }

    /**
     * Gets the full name of the address component
     *
     * @returns {string}
     */
    getLongName(): string {
        return this.#component.long_name;
    }

    /**
     * Gets the abbreviated name of the address component
     *
     * @returns {string}
     */
    getShortName(): string {
        return this.#component.short_name;
    }

    /**
     * Gets the array of types objects for the address component
     *
     * @returns {GeocodeAddressTypes}
     */
    getTypes(): GeocodeAddressTypes {
        return this.#types;
    }

    /**
     * Gets the array of types for the address component
     *
     * https://developers.google.com/maps/documentation/javascript/geocoding?hl=en#GeocodingAddressTypes
     *
     * @returns {string[]}
     */
    getTypesArray(): string[] {
        return this.#types.getTypes();
    }

    /**
     * Get the original Google Maps GeocoderAddressComponent object
     *
     * @returns {google.maps.GeocoderAddressComponent}
     */
    toGoogle(): google.maps.GeocoderAddressComponent {
        return this.#component;
    }
}

export default GeocodeAddressComponent;
