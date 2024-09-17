/* ===========================================================================
    Geocode Result class

    This provides a wrapper class arround the Google Maps GeocoderResult object.
    https://developers.google.com/maps/documentation/javascript/geocoding#GeocodingResults
    https://developers.google.com/maps/documentation/javascript/reference/3.56/geocoder?hl=en#GeocoderResult
=========================================================================== */

/* global google */

import Base from '../Base';
import { GeocoderLocationType } from '../constants';
import { isBoolean, isObjectWithValues, isStringWithValue } from '../helpers';
import { latLng, LatLng } from '../LatLng';
import { latLngBounds, LatLngBounds } from '../LatLngBounds';
import GeocodeAddressComponent from './AddressComponent';
import GeocodeAddressTypes from './AddressTypes';

/**
 * The geocode result class
 *
 * This is intended to be an internal class and not instantiated directly outside this library.
 * It is used to wrap the Google Maps GeocoderResult object.
 */
class GeocodeResult extends Base {
    /**
     * Holds the address components
     *
     * @private
     * @type {GeocodeAddressComponent[]}
     */
    #addressComponents: GeocodeAddressComponent[] = [];

    /**
     * Holds the formatted address
     *
     * @private
     * @type {string}
     */
    #formattedAddress: string = '';

    /**
     * Holds the bounds of the location
     *
     * @private
     * @type {LatLngBounds}
     */
    #geometryLocationBounds: LatLngBounds;

    /**
     * Holds the latitude and longitude of the location
     *
     * @private
     * @type {LatLng}
     */
    #geometryLocation: LatLng;

    /**
     * Holds the type of location
     *
     * @private
     * @type {string}
     */
    #geometryLocationType: string = '';

    /**
     * Holds the bounds of the recommended viewport for displaying the returned result
     *
     * @private
     * @type {LatLngBounds}
     */
    #geometryLocationViewport: LatLngBounds;

    /**
     * Holds whether the geocode result is a partial match
     *
     * @private
     * @type {boolean}
     */
    #partialMatch: boolean = false;

    /**
     * Holds the place id associated with the location
     *
     * @private
     * @type {string}
     */
    #placeId: string = '';

    /**
     * Holds the plus code associated with the location
     *
     * https://developers.google.com/maps/documentation/javascript/reference/3.56/places-service?hl=en#PlacePlusCode
     *
     * @private
     * @type {string}
     */
    #plusCode: string = '';

    /**
     * Holds the compund plus code associated with the location
     *
     * https://developers.google.com/maps/documentation/javascript/reference/3.56/places-service?hl=en#PlacePlusCode
     *
     * @private
     * @type {string}
     */
    #plusCodeCompound: string = '';

    /**
     * Holds the postcode localities for the location. This is only populated when the result is a postal code
     * that contains multiple localities.
     *
     * @private
     * @type {string[]}
     */
    #postalCodeLocalities: string[] = [];

    /**
     * Holds the original GeocoderResult object
     *
     * @private
     * @type {google.maps.GeocoderResult | object}
     */
    #result: google.maps.GeocoderResult | object;

    /**
     * Holds the types for the returned geocoded element
     *
     * https://developers.google.com/maps/documentation/javascript/geocoding?hl=en#GeocodingAddressTypes
     *
     * @private
     * @type {GeocodeAddressTypes}
     */
    #types: GeocodeAddressTypes;

    /**
     * Constructor
     *
     * @param {google.maps.GeocoderResult} [result] The Google Maps GeocoderResult object
     */
    constructor(result?: google.maps.GeocoderResult) {
        super('geocodeResult');
        if (isObjectWithValues(result)) {
            this.#result = result;

            if (Array.isArray(result.address_components)) {
                result.address_components.forEach((component) => {
                    this.#addressComponents.push(new GeocodeAddressComponent(component));
                });
            }
            if (isStringWithValue(result.formatted_address)) {
                this.#formattedAddress = result.formatted_address;
            }
            if (isObjectWithValues(result.geometry)) {
                if (result.geometry.bounds) {
                    this.#geometryLocationBounds = latLngBounds();
                    this.#geometryLocationBounds.union(result.geometry.bounds);
                }
                if (result.geometry.location) {
                    this.#geometryLocation = latLng(result.geometry.location);
                }
                if (isStringWithValue(result.geometry.location_type)) {
                    this.#geometryLocationType = result.geometry.location_type;
                }
                if (result.geometry.viewport) {
                    this.#geometryLocationViewport = latLngBounds();
                    this.#geometryLocationViewport.union(result.geometry.viewport);
                }
            }
            if (isBoolean(result.partial_match)) {
                this.#partialMatch = result.partial_match;
            }
            if (isStringWithValue(result.place_id)) {
                this.#placeId = result.place_id;
            }
            if (isObjectWithValues(result.plus_code)) {
                if (isStringWithValue(result.plus_code.global_code)) {
                    this.#plusCode = result.plus_code.global_code;
                }
                if (isStringWithValue(result.plus_code.compound_code)) {
                    this.#plusCodeCompound = result.plus_code.compound_code;
                }
            }
            if (Array.isArray(result.postcode_localities)) {
                this.#postalCodeLocalities = result.postcode_localities;
            }
            if (Array.isArray(result.types)) {
                this.#types = new GeocodeAddressTypes(result.types);
            } else {
                this.#types = new GeocodeAddressTypes();
            }
        } else {
            this.#result = {};
            this.#types = new GeocodeAddressTypes();
        }
    }

    /**
     * Get the address component objects
     *
     * @returns {GeocodeAddressComponent[]}
     */
    getAddressComponents(): GeocodeAddressComponent[] {
        return this.#addressComponents;
    }

    /**
     * Get the precise bounds of the result, if available
     *
     * @returns {LatLngBounds|undefined}
     */
    getBounds(): LatLngBounds | undefined {
        return this.#geometryLocationBounds;
    }

    /**
     * Get the compound plus code associated with the location
     *
     * @returns {string}
     */
    getCompoundPlusCode(): string {
        return this.#plusCodeCompound;
    }

    /**
     * Gets the formatted address for the location.
     *
     * @returns {string}
     */
    getFormattedAddress(): string {
        return this.#formattedAddress;
    }

    /**
     * Get the latitude of the location.
     *
     * This is a shorcut to getting the geometry location latitude.
     *
     * @returns {number|undefined}
     */
    getLatitude(): number {
        let returnValue: number;
        if (typeof this.#geometryLocation !== 'undefined' && this.#geometryLocation.isValid()) {
            returnValue = this.#geometryLocation.lat;
        }
        return returnValue;
    }

    /**
     * Gets the LatLng object for the result
     *
     * @returns {LatLng|undefined}
     */
    getLocation(): LatLng | undefined {
        return this.#geometryLocation;
    }

    /**
     * Gets the location type
     *
     * @returns {string}
     */
    getLocationType(): string {
        return this.#geometryLocationType;
    }

    /**
     * Get the longitude of the location.
     *
     * This is a shorcut to getting the geometry location longitude.
     *
     * @returns {number|undefined}
     */
    getLongitude(): number {
        let returnValue: number;
        if (typeof this.#geometryLocation !== 'undefined' && this.#geometryLocation.isValid()) {
            returnValue = this.#geometryLocation.lng;
        }
        return returnValue;
    }

    /**
     * Get the place id for the location.
     *
     * @returns {string}
     */
    getPlaceId(): string {
        return this.#placeId;
    }

    /**
     * Get the plus code associated with the location
     *
     * @returns {string}
     */
    getPlusCode(): string {
        return this.#plusCode;
    }

    /**
     * Gets the postal code localities for the location.
     *
     * This is only populated when the result is a postal code that contains multiple localities.
     *
     * @returns {string[]}
     */
    getPostalCodeLocalities(): string[] {
        return this.#postalCodeLocalities;
    }

    /**
     * Gets the types object for the returned geocoded element.
     *
     * https://developers.google.com/maps/documentation/javascript/geocoding?hl=en#GeocodingAddressTypes
     *
     * @returns {GeocodeAddressTypes}
     */
    getTypes(): GeocodeAddressTypes {
        return this.#types;
    }

    /**
     * Gets the types for the returned geocoded element.
     *
     * https://developers.google.com/maps/documentation/javascript/geocoding?hl=en#GeocodingAddressTypes
     *
     * @returns {string[]}
     */
    getTypesArray(): string[] {
        return this.#types.getTypes();
    }

    /**
     * Returns if the location is an approximate location.
     *
     * @returns {boolean}
     */
    isLocationApproximate(): boolean {
        return this.#geometryLocationType === GeocoderLocationType.APPROXIMATE;
    }

    /**
     * Returns if the location is a geometic center of a result.
     *
     * @returns {boolean}
     */
    isLocationGeometricCenter(): boolean {
        return this.#geometryLocationType === GeocoderLocationType.GEOMETRIC_CENTER;
    }

    /**
     * Returns if the location is an approximation interpolated between two precise locations.
     *
     * @returns {boolean}
     */
    isLocationRangeInterpolated(): boolean {
        return this.#geometryLocationType === GeocoderLocationType.RANGE_INTERPOLATED;
    }

    /**
     * Returns if the location is a rooftop location, which is the most precise location available.
     *
     * @returns {boolean}
     */
    isLocationRooftop(): boolean {
        return this.#geometryLocationType === GeocoderLocationType.ROOFTOP;
    }

    /**
     * Returns if the location is a partial match for the original request.
     *
     * @returns {boolean}
     */
    isPartialMatch(): boolean {
        return this.#partialMatch;
    }

    /**
     * Get the original Google Maps GeocoderResult object
     *
     * If the result is empty, an empty object is returned.
     *
     * @returns {google.maps.GeocoderResult | object}
     */
    toGoogle(): google.maps.GeocoderResult | object {
        return this.#result;
    }
}

export default GeocodeResult;
