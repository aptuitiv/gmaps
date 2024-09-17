/* ===========================================================================
    Helper functions to get the geocode address types

    https://developers.google.com/maps/documentation/javascript/geocoding#GeocodingAddressTypes
=========================================================================== */

class GeocodeAddressTypes {
    /**
     * Holds the types for the address
     *
     * @private
     * @type {string[]}
     */
    #types: string[] = [];

    /**
     * Constructor
     *
     * @param {string[]} [types] The types for the address
     */
    constructor(types?: string[]) {
        if (Array.isArray(types)) {
            this.#types = types;
        }
    }

    /**
     * Gets the address types
     *
     * @returns {string[]}
     */
    getTypes(): string[] {
        return this.#types;
    }

    /**
     * Returns if the address is an administrative area level 1.
     *
     * This is the highest level of administrative area below the country level.
     * In the United States, these administrative levels are states.
     *
     * @returns {boolean}
     */
    isAdministrativeAreaLevel1(): boolean {
        return this.#types.includes('administrative_area_level_1');
    }

    /**
     * Returns if the address is an administrative area level 2.
     *
     * Within the United States this would be a county.
     *
     * @returns {boolean}
     */
    isAdministrativeAreaLevel2(): boolean {
        return this.#types.includes('administrative_area_level_2');
    }

    /**
     * Returns if the address is an administrative area level 3.
     *
     * This is a minor civil division.
     *
     * @returns {boolean}
     */
    isAdministrativeAreaLevel3(): boolean {
        return this.#types.includes('administrative_area_level_3');
    }

    /**
     * Returns if the address is an administrative area level 4.
     *
     * This is a minor civil division.
     *
     * @returns {boolean}
     */
    isAdministrativeAreaLevel4(): boolean {
        return this.#types.includes('administrative_area_level_4');
    }

    /**
     * Returns if the address is an administrative area level 5.
     *
     * This is a minor civil division.
     *
     * @returns {boolean}
     */
    isAdministrativeAreaLevel5(): boolean {
        return this.#types.includes('administrative_area_level_5');
    }

    /**
     * Returns if the address is an administrative area level 6.
     *
     * This is a minor civil division.
     *
     * @returns {boolean}
     */
    isAdministrativeAreaLevel6(): boolean {
        return this.#types.includes('administrative_area_level_6');
    }

    /**
     * Returns if the address is an administrative area level 7.
     *
     * This is a minor civil division.
     *
     * @returns {boolean}
     */
    isAdministrativeAreaLevel7(): boolean {
        return this.#types.includes('administrative_area_level_7');
    }

    /**
     * Returns if the address is an airport.
     *
     * @returns {boolean}
     */
    isAirport(): boolean {
        return this.#types.includes('airport');
    }

    /**
     * Returns if the address is a bus station or bus stop.
     *
     * @returns {boolean}
     */
    isBusStation(): boolean {
        return this.#types.includes('bus_station');
    }

    /**
     * Returns if the address is a city.
     *
     * This is an alias for isLocality()
     *
     * @returns {boolean}
     */
    isCity(): boolean {
        return this.isLocality();
    }

    /**
     * Returns if the address is a commonly used alternative name for the entity.
     *
     * @returns {boolean}
     */
    isColloquialArea(): boolean {
        return this.#types.includes('colloquial_area');
    }

    /**
     * Returns if the address is a country.
     *
     * @returns {boolean}
     */
    isCountry(): boolean {
        return this.#types.includes('country');
    }

    /**
     * Returns if the address is a county.
     *
     * This is an alias for isAdministrativeAreaLevel2()
     *
     * @returns {boolean}
     */
    isCounty(): boolean {
        return this.#types.includes('administrative_area_level_2');
    }

    /**
     * Returns if the address is a place that hasn't yet been categorized.
     *
     * @returns {boolean}
     */
    isEstablishment(): boolean {
        return this.#types.includes('establishment');
    }

    /**
     * Returns if the address is a floor in a building.
     *
     * @returns {boolean}
     */
    isFloor(): boolean {
        return this.#types.includes('floor');
    }

    /**
     * Returns if the address is a major intersection, usually of two major roads.
     *
     * @returns {boolean}
     */
    isIntersection(): boolean {
        return this.#types.includes('intersection');
    }

    /**
     * Returns if the address is a landmark.
     *
     * @returns {boolean}
     */
    isLandmark(): boolean {
        return this.#types.includes('landmark');
    }

    /**
     * Returns if the address is a locality.
     *
     * @returns {boolean}
     */
    isLocality(): boolean {
        return this.#types.includes('locality');
    }

    /**
     * Returns if the address is a prominent natural feature.
     *
     * @returns {boolean}
     */
    isNaturalFeature(): boolean {
        return this.#types.includes('natural_feature');
    }

    /**
     * Returns if the address is a neighborhood.
     *
     * @returns {boolean}
     */
    isNeighborhood(): boolean {
        return this.#types.includes('neighborhood');
    }

    /**
     * Returns if the address is a plus code.
     *
     * See https://plus.codes/ for more information.
     *
     * @returns {boolean}
     */
    isPlusCode(): boolean {
        return this.#types.includes('plus_code');
    }

    /**
     * Returns if the address is a named park.
     *
     * @returns {boolean}
     */
    isPark(): boolean {
        return this.#types.includes('park');
    }

    /**
     * Returns if the address is a parking lot.
     *
     * @returns {boolean}
     */
    isParking(): boolean {
        return this.#types.includes('parking');
    }

    /**
     * Returns if the address is a point of interest.
     *
     * @returns {boolean}
     */
    isPointOfInterest(): boolean {
        return this.#types.includes('point_of_interest');
    }

    /**
     * Returns if the address is a political entity. This would usually be some type of civil administration.
     *
     * @returns {boolean}
     */
    isPolitical(): boolean {
        return this.#types.includes('political');
    }

    /**
     * Returns if the address is a specific post box.
     *
     * @returns {boolean}
     */
    isPostBox(): boolean {
        return this.#types.includes('post_box');
    }

    /**
     * Returns if the address is a postal code.
     *
     * @returns {boolean}
     */
    isPostalCode(): boolean {
        return this.#types.includes('postal_code');
    }

    /**
     * Returns if the address is a grouping of geographic areas.
     *
     * @returns {boolean}
     */
    isPostalTown(): boolean {
        return this.#types.includes('postal_town');
    }

    /**
     * Returns if the location is a named location, usually a building or collection of buildings with a common name.
     *
     * @returns {boolean}
     */
    isPremise(): boolean {
        return this.#types.includes('premise');
    }

    /**
     * Returns if the address is a room of a building.
     *
     * @returns {boolean}
     */
    isRoom(): boolean {
        return this.#types.includes('room');
    }

    /**
     * Returns if the address is a named route (such as "US 101").
     *
     * @returns {boolean}
     */
    isRoute(): boolean {
        return this.#types.includes('route');
    }

    /**
     * Returns if the address is a state or province.
     *
     * This is an alias for isAdministrativeAreaLevel1()
     *
     * @returns {boolean}
     */
    isState(): boolean {
        return this.isAdministrativeAreaLevel1();
    }

    /**
     * Returns if the address is a street address
     *
     * @returns {boolean}
     */
    isStreetAddress(): boolean {
        return this.#types.includes('street_address');
    }

    /**
     * Returns if the address indicates a precise street number.
     *
     * @returns {boolean}
     */
    isStreetNumber(): boolean {
        return this.#types.includes('street_number');
    }

    /**
     * Returns if the address is a sublocality.
     *
     * @returns {boolean}
     */
    isSubLocality(): boolean {
        return this.#types.includes('sublocality');
    }

    /**
     * Returns if the address is a sublocality level 1.
     *
     * @returns {boolean}
     */
    isSubLocalityLevel1(): boolean {
        return this.#types.includes('sublocality_level_1');
    }

    /**
     * Returns if the address is a sublocality level 2.
     *
     * @returns {boolean}
     */
    isSubLocalityLevel2(): boolean {
        return this.#types.includes('sublocality_level_2');
    }

    /**
     * Returns if the address is a sublocality level 3.
     *
     * @returns {boolean}
     */
    isSubLocalityLevel3(): boolean {
        return this.#types.includes('sublocality_level_3');
    }

    /**
     * Returns if the address is a sublocality level 4.
     *
     * @returns {boolean}
     */
    isSubLocalityLevel4(): boolean {
        return this.#types.includes('sublocality_level_4');
    }

    /**
     * Returns if the address is a sublocality level 5.
     *
     * @returns {boolean}
     */
    isSubLocalityLevel5(): boolean {
        return this.#types.includes('sublocality_level_5');
    }

    /**
     * Returns if the location is a subpremise.
     *
     * This is the next level below a premise, usually a single building in a collection of buildings with a common name.
     *
     * @returns {boolean}
     */
    isSubPremise(): boolean {
        return this.#types.includes('subpremise');
    }

    /**
     * Returns if the address is a town.
     *
     * This is an alias for isLocality()
     *
     * @returns {boolean}
     */
    isTown(): boolean {
        return this.isLocality();
    }

    /**
     * Returns if the address is a train station.
     *
     * @returns {boolean}
     */
    isTrainStation(): boolean {
        return this.#types.includes('train_station');
    }

    /**
     * Returns if the address is a transit station.
     *
     * @returns {boolean}
     */
    isTransitStation(): boolean {
        return this.#types.includes('transit_station');
    }
}

export default GeocodeAddressTypes;
