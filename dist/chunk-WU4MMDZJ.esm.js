import {
  Marker,
  marker
} from "./chunk-YLGNAECT.esm.js";
import {
  Overlay
} from "./chunk-H6HOEBQR.esm.js";
import {
  AutocompleteSearchBoxEvents,
  Base_default,
  Evented,
  GeocoderLocationType,
  ImageOverlayEvents,
  LatLngBounds,
  Map as Map2,
  PlacesSearchBoxEvents,
  calculateDimensions,
  checkForGoogleMaps,
  getBoolean,
  getNumber,
  icon,
  isBoolean,
  isFunction,
  isNullOrUndefined,
  isNumber,
  isNumberString,
  isObject,
  isObjectWithValues,
  isString,
  isStringOrNumber,
  isStringWithValue,
  latLng,
  latLngBounds,
  loader,
  point
} from "./chunk-IDBS76XJ.esm.js";

// src/lib/Geocode/AddressTypes.ts
var GeocodeAddressTypes = class {
  /**
   * Holds the types for the address
   *
   * @private
   * @type {string[]}
   */
  #types = [];
  /**
   * Constructor
   *
   * @param {string[]} [types] The types for the address
   */
  constructor(types) {
    if (Array.isArray(types)) {
      this.#types = types;
    }
  }
  /**
   * Gets the address types
   *
   * @returns {string[]}
   */
  getTypes() {
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
  isAdministrativeAreaLevel1() {
    return this.#types.includes("administrative_area_level_1");
  }
  /**
   * Returns if the address is an administrative area level 2.
   *
   * Within the United States this would be a county.
   *
   * @returns {boolean}
   */
  isAdministrativeAreaLevel2() {
    return this.#types.includes("administrative_area_level_2");
  }
  /**
   * Returns if the address is an administrative area level 3.
   *
   * This is a minor civil division.
   *
   * @returns {boolean}
   */
  isAdministrativeAreaLevel3() {
    return this.#types.includes("administrative_area_level_3");
  }
  /**
   * Returns if the address is an administrative area level 4.
   *
   * This is a minor civil division.
   *
   * @returns {boolean}
   */
  isAdministrativeAreaLevel4() {
    return this.#types.includes("administrative_area_level_4");
  }
  /**
   * Returns if the address is an administrative area level 5.
   *
   * This is a minor civil division.
   *
   * @returns {boolean}
   */
  isAdministrativeAreaLevel5() {
    return this.#types.includes("administrative_area_level_5");
  }
  /**
   * Returns if the address is an administrative area level 6.
   *
   * This is a minor civil division.
   *
   * @returns {boolean}
   */
  isAdministrativeAreaLevel6() {
    return this.#types.includes("administrative_area_level_6");
  }
  /**
   * Returns if the address is an administrative area level 7.
   *
   * This is a minor civil division.
   *
   * @returns {boolean}
   */
  isAdministrativeAreaLevel7() {
    return this.#types.includes("administrative_area_level_7");
  }
  /**
   * Returns if the address is an airport.
   *
   * @returns {boolean}
   */
  isAirport() {
    return this.#types.includes("airport");
  }
  /**
   * Returns if the address is a bus station or bus stop.
   *
   * @returns {boolean}
   */
  isBusStation() {
    return this.#types.includes("bus_station");
  }
  /**
   * Returns if the address is a city.
   *
   * This is an alias for isLocality()
   *
   * @returns {boolean}
   */
  isCity() {
    return this.isLocality();
  }
  /**
   * Returns if the address is a commonly used alternative name for the entity.
   *
   * @returns {boolean}
   */
  isColloquialArea() {
    return this.#types.includes("colloquial_area");
  }
  /**
   * Returns if the address is a country.
   *
   * @returns {boolean}
   */
  isCountry() {
    return this.#types.includes("country");
  }
  /**
   * Returns if the address is a county.
   *
   * This is an alias for isAdministrativeAreaLevel2()
   *
   * @returns {boolean}
   */
  isCounty() {
    return this.#types.includes("administrative_area_level_2");
  }
  /**
   * Returns if the address is a place that hasn't yet been categorized.
   *
   * @returns {boolean}
   */
  isEstablishment() {
    return this.#types.includes("establishment");
  }
  /**
   * Returns if the address is a floor in a building.
   *
   * @returns {boolean}
   */
  isFloor() {
    return this.#types.includes("floor");
  }
  /**
   * Returns if the address is a major intersection, usually of two major roads.
   *
   * @returns {boolean}
   */
  isIntersection() {
    return this.#types.includes("intersection");
  }
  /**
   * Returns if the address is a landmark.
   *
   * @returns {boolean}
   */
  isLandmark() {
    return this.#types.includes("landmark");
  }
  /**
   * Returns if the address is a locality.
   *
   * @returns {boolean}
   */
  isLocality() {
    return this.#types.includes("locality");
  }
  /**
   * Returns if the address is a prominent natural feature.
   *
   * @returns {boolean}
   */
  isNaturalFeature() {
    return this.#types.includes("natural_feature");
  }
  /**
   * Returns if the address is a neighborhood.
   *
   * @returns {boolean}
   */
  isNeighborhood() {
    return this.#types.includes("neighborhood");
  }
  /**
   * Returns if the address is a plus code.
   *
   * See https://plus.codes/ for more information.
   *
   * @returns {boolean}
   */
  isPlusCode() {
    return this.#types.includes("plus_code");
  }
  /**
   * Returns if the address is a named park.
   *
   * @returns {boolean}
   */
  isPark() {
    return this.#types.includes("park");
  }
  /**
   * Returns if the address is a parking lot.
   *
   * @returns {boolean}
   */
  isParking() {
    return this.#types.includes("parking");
  }
  /**
   * Returns if the address is a point of interest.
   *
   * @returns {boolean}
   */
  isPointOfInterest() {
    return this.#types.includes("point_of_interest");
  }
  /**
   * Returns if the address is a political entity. This would usually be some type of civil administration.
   *
   * @returns {boolean}
   */
  isPolitical() {
    return this.#types.includes("political");
  }
  /**
   * Returns if the address is a specific post box.
   *
   * @returns {boolean}
   */
  isPostBox() {
    return this.#types.includes("post_box");
  }
  /**
   * Returns if the address is a postal code.
   *
   * @returns {boolean}
   */
  isPostalCode() {
    return this.#types.includes("postal_code");
  }
  /**
   * Returns if the address is a grouping of geographic areas.
   *
   * @returns {boolean}
   */
  isPostalTown() {
    return this.#types.includes("postal_town");
  }
  /**
   * Returns if the location is a named location, usually a building or collection of buildings with a common name.
   *
   * @returns {boolean}
   */
  isPremise() {
    return this.#types.includes("premise");
  }
  /**
   * Returns if the address is a room of a building.
   *
   * @returns {boolean}
   */
  isRoom() {
    return this.#types.includes("room");
  }
  /**
   * Returns if the address is a named route (such as "US 101").
   *
   * @returns {boolean}
   */
  isRoute() {
    return this.#types.includes("route");
  }
  /**
   * Returns if the address is a state or province.
   *
   * This is an alias for isAdministrativeAreaLevel1()
   *
   * @returns {boolean}
   */
  isState() {
    return this.isAdministrativeAreaLevel1();
  }
  /**
   * Returns if the address is a street address
   *
   * @returns {boolean}
   */
  isStreetAddress() {
    return this.#types.includes("street_address");
  }
  /**
   * Returns if the address indicates a precise street number.
   *
   * @returns {boolean}
   */
  isStreetNumber() {
    return this.#types.includes("street_number");
  }
  /**
   * Returns if the address is a sublocality.
   *
   * @returns {boolean}
   */
  isSubLocality() {
    return this.#types.includes("sublocality");
  }
  /**
   * Returns if the address is a sublocality level 1.
   *
   * @returns {boolean}
   */
  isSubLocalityLevel1() {
    return this.#types.includes("sublocality_level_1");
  }
  /**
   * Returns if the address is a sublocality level 2.
   *
   * @returns {boolean}
   */
  isSubLocalityLevel2() {
    return this.#types.includes("sublocality_level_2");
  }
  /**
   * Returns if the address is a sublocality level 3.
   *
   * @returns {boolean}
   */
  isSubLocalityLevel3() {
    return this.#types.includes("sublocality_level_3");
  }
  /**
   * Returns if the address is a sublocality level 4.
   *
   * @returns {boolean}
   */
  isSubLocalityLevel4() {
    return this.#types.includes("sublocality_level_4");
  }
  /**
   * Returns if the address is a sublocality level 5.
   *
   * @returns {boolean}
   */
  isSubLocalityLevel5() {
    return this.#types.includes("sublocality_level_5");
  }
  /**
   * Returns if the location is a subpremise.
   *
   * This is the next level below a premise, usually a single building in a collection of buildings with a common name.
   *
   * @returns {boolean}
   */
  isSubPremise() {
    return this.#types.includes("subpremise");
  }
  /**
   * Returns if the address is a town.
   *
   * This is an alias for isLocality()
   *
   * @returns {boolean}
   */
  isTown() {
    return this.isLocality();
  }
  /**
   * Returns if the address is a train station.
   *
   * @returns {boolean}
   */
  isTrainStation() {
    return this.#types.includes("train_station");
  }
  /**
   * Returns if the address is a transit station.
   *
   * @returns {boolean}
   */
  isTransitStation() {
    return this.#types.includes("transit_station");
  }
};
var AddressTypes_default = GeocodeAddressTypes;

// src/lib/Geocode/AddressComponent.ts
var GeocodeAddressComponent = class extends Base_default {
  /**
   * Holds the original GeocoderAddressComponent object
   *
   * @private
   * @type {google.maps.GeocoderAddressComponent}
   */
  #component;
  /**
   * Holds the types for the address component
   *
   * @private
   * @type {GeocodeAddressTypes}
   */
  #types;
  /**
   * Constructor
   *
   * @param {google.maps.GeocoderAddressComponent} component The Google Maps GeocoderAddressComponent object
   */
  constructor(component) {
    super("addressComponent");
    this.#component = component;
    if (isObjectWithValues(component) && Array.isArray(component.types)) {
      this.#types = new AddressTypes_default(component.types);
    } else {
      this.#types = new AddressTypes_default();
    }
  }
  /**
   * Gets the full name of the address component
   *
   * @returns {string}
   */
  getLongName() {
    return this.#component.long_name;
  }
  /**
   * Gets the abbreviated name of the address component
   *
   * @returns {string}
   */
  getShortName() {
    return this.#component.short_name;
  }
  /**
   * Gets the array of types objects for the address component
   *
   * @returns {GeocodeAddressTypes}
   */
  getTypes() {
    return this.#types;
  }
  /**
   * Gets the array of types for the address component
   *
   * https://developers.google.com/maps/documentation/javascript/geocoding?hl=en#GeocodingAddressTypes
   *
   * @returns {string[]}
   */
  getTypesArray() {
    return this.#types.getTypes();
  }
  /**
   * Get the original Google Maps GeocoderAddressComponent object
   *
   * @returns {google.maps.GeocoderAddressComponent}
   */
  toGoogle() {
    return this.#component;
  }
};
var AddressComponent_default = GeocodeAddressComponent;

// src/lib/Geocode/Result.ts
var GeocodeResult = class extends Base_default {
  /**
   * Holds the address components
   *
   * @private
   * @type {GeocodeAddressComponent[]}
   */
  #addressComponents = [];
  /**
   * Holds the formatted address
   *
   * @private
   * @type {string}
   */
  #formattedAddress = "";
  /**
   * Holds the bounds of the location
   *
   * @private
   * @type {LatLngBounds | undefined}
   */
  #geometryLocationBounds;
  /**
   * Holds the latitude and longitude of the location
   *
   * @private
   * @type {LatLng | undefined}
   */
  #geometryLocation;
  /**
   * Holds the type of location
   *
   * @private
   * @type {string}
   */
  #geometryLocationType = "";
  /**
   * Holds the bounds of the recommended viewport for displaying the returned result
   *
   * @private
   * @type {LatLngBounds | undefined}
   */
  #geometryLocationViewport;
  /**
   * Holds whether the geocode result is a partial match
   *
   * @private
   * @type {boolean}
   */
  #partialMatch = false;
  /**
   * Holds the place id associated with the location
   *
   * @private
   * @type {string}
   */
  #placeId = "";
  /**
   * Holds the plus code associated with the location
   *
   * https://developers.google.com/maps/documentation/javascript/reference/3.56/places-service?hl=en#PlacePlusCode
   *
   * @private
   * @type {string}
   */
  #plusCode = "";
  /**
   * Holds the compund plus code associated with the location
   *
   * https://developers.google.com/maps/documentation/javascript/reference/3.56/places-service?hl=en#PlacePlusCode
   *
   * @private
   * @type {string}
   */
  #plusCodeCompound = "";
  /**
   * Holds the postcode localities for the location. This is only populated when the result is a postal code
   * that contains multiple localities.
   *
   * @private
   * @type {string[]}
   */
  #postalCodeLocalities = [];
  /**
   * Holds the original GeocoderResult object
   *
   * @private
   * @type {google.maps.GeocoderResult | object}
   */
  #result;
  /**
   * Holds the types for the returned geocoded element
   *
   * https://developers.google.com/maps/documentation/javascript/geocoding?hl=en#GeocodingAddressTypes
   *
   * @private
   * @type {GeocodeAddressTypes}
   */
  #types;
  /**
   * Constructor
   *
   * @param {google.maps.GeocoderResult} [result] The Google Maps GeocoderResult object
   */
  constructor(result) {
    super("geocodeResult");
    if (isObjectWithValues(result)) {
      this.#result = result;
      if (Array.isArray(result.address_components)) {
        result.address_components.forEach((component) => {
          this.#addressComponents.push(new AddressComponent_default(component));
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
        this.#types = new AddressTypes_default(result.types);
      } else {
        this.#types = new AddressTypes_default();
      }
    } else {
      this.#result = {};
      this.#types = new AddressTypes_default();
    }
  }
  /**
   * Get the address component objects
   *
   * @returns {GeocodeAddressComponent[]}
   */
  getAddressComponents() {
    return this.#addressComponents;
  }
  /**
   * Get the precise bounds of the result, if available
   *
   * @returns {LatLngBounds|undefined}
   */
  getBounds() {
    return this.#geometryLocationBounds;
  }
  /**
   * Get the compound plus code associated with the location
   *
   * @returns {string}
   */
  getCompoundPlusCode() {
    return this.#plusCodeCompound;
  }
  /**
   * Gets the formatted address for the location.
   *
   * @returns {string}
   */
  getFormattedAddress() {
    return this.#formattedAddress;
  }
  /**
   * Get the latitude of the location.
   *
   * This is a shorcut to getting the geometry location latitude.
   *
   * @returns {number|undefined}
   */
  getLatitude() {
    let returnValue;
    if (typeof this.#geometryLocation !== "undefined" && this.#geometryLocation.isValid()) {
      returnValue = this.#geometryLocation.lat;
    }
    return returnValue;
  }
  /**
   * Gets the LatLng object for the result
   *
   * @returns {LatLng|undefined}
   */
  getLocation() {
    return this.#geometryLocation;
  }
  /**
   * Gets the location type
   *
   * @returns {string}
   */
  getLocationType() {
    return this.#geometryLocationType;
  }
  /**
   * Get the longitude of the location.
   *
   * This is a shorcut to getting the geometry location longitude.
   *
   * @returns {number|undefined}
   */
  getLongitude() {
    let returnValue;
    if (typeof this.#geometryLocation !== "undefined" && this.#geometryLocation.isValid()) {
      returnValue = this.#geometryLocation.lng;
    }
    return returnValue;
  }
  /**
   * Get the place id for the location.
   *
   * @returns {string}
   */
  getPlaceId() {
    return this.#placeId;
  }
  /**
   * Get the plus code associated with the location
   *
   * @returns {string}
   */
  getPlusCode() {
    return this.#plusCode;
  }
  /**
   * Gets the postal code localities for the location.
   *
   * This is only populated when the result is a postal code that contains multiple localities.
   *
   * @returns {string[]}
   */
  getPostalCodeLocalities() {
    return this.#postalCodeLocalities;
  }
  /**
   * Gets the types object for the returned geocoded element.
   *
   * https://developers.google.com/maps/documentation/javascript/geocoding?hl=en#GeocodingAddressTypes
   *
   * @returns {GeocodeAddressTypes}
   */
  getTypes() {
    return this.#types;
  }
  /**
   * Gets the types for the returned geocoded element.
   *
   * https://developers.google.com/maps/documentation/javascript/geocoding?hl=en#GeocodingAddressTypes
   *
   * @returns {string[]}
   */
  getTypesArray() {
    return this.#types.getTypes();
  }
  /**
   * Returns if the location is an approximate location.
   *
   * @returns {boolean}
   */
  isLocationApproximate() {
    return this.#geometryLocationType === GeocoderLocationType.APPROXIMATE;
  }
  /**
   * Returns if the location is a geometic center of a result.
   *
   * @returns {boolean}
   */
  isLocationGeometricCenter() {
    return this.#geometryLocationType === GeocoderLocationType.GEOMETRIC_CENTER;
  }
  /**
   * Returns if the location is an approximation interpolated between two precise locations.
   *
   * @returns {boolean}
   */
  isLocationRangeInterpolated() {
    return this.#geometryLocationType === GeocoderLocationType.RANGE_INTERPOLATED;
  }
  /**
   * Returns if the location is a rooftop location, which is the most precise location available.
   *
   * @returns {boolean}
   */
  isLocationRooftop() {
    return this.#geometryLocationType === GeocoderLocationType.ROOFTOP;
  }
  /**
   * Returns if the location is a partial match for the original request.
   *
   * @returns {boolean}
   */
  isPartialMatch() {
    return this.#partialMatch;
  }
  /**
   * Get the original Google Maps GeocoderResult object
   *
   * If the result is empty, an empty object is returned.
   *
   * @returns {google.maps.GeocoderResult | object}
   */
  toGoogle() {
    return this.#result;
  }
};
var Result_default = GeocodeResult;

// src/lib/Geocode/Results.ts
var GeocodeResults = class extends Base_default {
  /**
   * Holds the original GeocoderResult objects
   *
   * @private
   * @type {GeocodeResult[]}
   */
  #results = [];
  /**
   * Constructor
   *
   * @param {google.maps.GeocoderResult[]} [results] The Google Maps GeocoderResult objects
   */
  constructor(results) {
    super("geocodeResults");
    if (Array.isArray(results)) {
      results.forEach((result) => {
        this.#results.push(new Result_default(result));
      });
    }
  }
  /**
   * Gets the first result
   *
   * @returns {GeocodeResult}
   */
  getFirst() {
    let returnValue;
    if (this.#results.length > 0) {
      [returnValue] = this.#results;
    } else {
      returnValue = new Result_default();
    }
    return returnValue;
  }
  /**
   * Returns the results
   *
   * @returns {GeocodeResult[]}
   */
  getResults() {
    return this.#results;
  }
  /**
   * Returns whether any results were found
   *
   * @returns {boolean}
   */
  hasResults() {
    return this.#results.length > 0;
  }
};
var Results_default = GeocodeResults;

// src/lib/Geocode.ts
var sharedGeocoder;
var geocodeCache = /* @__PURE__ */ new Map();
var geocodeCacheSize = 50;
var trimGeocodeCache = () => {
  while (geocodeCache.size > geocodeCacheSize) {
    const oldest = geocodeCache.keys().next();
    if (oldest.done) {
      return;
    }
    geocodeCache.delete(oldest.value);
  }
};
var Geocode = class extends Base_default {
  /**
   * The address to geocode
   *
   * @type {string}
   * @private
   */
  #address;
  /**
   * The bounds within which to bias geocode results more prominently
   *
   * @type {LatLngBounds}
   * @private
   */
  #bounds;
  /**
   * Whether this object uses the shared cache of results
   *
   * @type {boolean}
   * @private
   */
  #cache = true;
  /**
   * Holds the component restrictions
   *
   * @type {GeocodeComponentRestrictions}
   * @private
   */
  #componentRestrictions;
  /**
   * The language to use for the geocode
   *
   * See https://developers.google.com/maps/faq#languagesupport for the list of supported languages
   *
   * @type {string}
   * @private
   */
  #language;
  /**
   * The location to geocode
   *
   * @type {LatLng}
   * @private
   */
  #location;
  /**
   * Holds the id of the place to geocode
   *
   * @type {string}
   * @private
   */
  #placeId;
  /**
   * The region code to influence the geocoding
   *
   * @type {string}
   * @private
   */
  #region;
  /**
   * Constructor
   *
   * @param {GeocodeOptions} [options] The Geocode options
   */
  constructor(options) {
    super("geocode");
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
  static clearCache() {
    geocodeCache.clear();
    sharedGeocoder = void 0;
  }
  /**
   * How many results the cache holds before the oldest is dropped
   *
   * @returns {number}
   */
  static get cacheSize() {
    return geocodeCacheSize;
  }
  /**
   * Set how many results the cache holds. Set it to 0 to turn caching off everywhere.
   *
   * @param {number} size The number of results to hold
   */
  static set cacheSize(size2) {
    if (typeof size2 === "number" && Number.isFinite(size2) && size2 >= 0) {
      geocodeCacheSize = Math.floor(size2);
      trimGeocodeCache();
    }
  }
  /**
   * Returns the address
   *
   * @returns {string|undefined}
   */
  get address() {
    return this.#address;
  }
  /**
   * Sets the address to geocode
   *
   * @param {string} address The address to geocode
   */
  set address(address) {
    if (isString(address)) {
      this.#address = address;
    }
  }
  /**
   * Returns the bounds
   *
   * @returns {LatLngBounds|undefined}
   */
  get bounds() {
    return this.#bounds;
  }
  /**
   * Sets the bounds within which to bias geocode results more prominently
   *
   * @param {LatLngBoundsValue} bounds The bounds within which to bias geocode results more prominently
   */
  set bounds(bounds) {
    this.#bounds = latLngBounds(bounds);
  }
  /**
   * Get the component restrictions
   *
   * @returns {GeocodeComponentRestrictions|undefined}
   */
  get componentRestrictions() {
    return this.#componentRestrictions;
  }
  /**
   * Set the component restrictions
   *
   * @param {GeocodeComponentRestrictions} componentRestrictions The component restrictions
   */
  set componentRestrictions(componentRestrictions) {
    if (isObjectWithValues(componentRestrictions)) {
      const restrictions = {};
      const keys = [
        "administrativeArea",
        "country",
        "locality",
        "postalCode",
        "route"
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
  get language() {
    return this.#language;
  }
  /**
   * Set the language to use for the geocode
   *
   * See https://developers.google.com/maps/faq#languagesupport for the list of supported languages
   *
   * @param {string} language The language to use for the geocode
   */
  set language(language) {
    if (isStringWithValue(language)) {
      this.#language = language;
    }
  }
  /**
   * Get the location to geocode
   *
   * @returns {LatLng|undefined}
   */
  get location() {
    return this.#location;
  }
  /**
   * Set the location to geocode
   *
   * @param {LatLngValue} location The location to geocode
   */
  set location(location) {
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
  get placeId() {
    return this.#placeId;
  }
  /**
   * Set the place id
   *
   * @param {string} placeId The place id
   */
  set placeId(placeId) {
    if (isStringWithValue(placeId)) {
      this.#placeId = placeId;
    }
  }
  /**
   * Get the region code
   *
   * @returns {string|undefined}
   */
  get region() {
    return this.#region;
  }
  /**
   * Set the region code
   *
   * @param {string} region The region code
   */
  set region(region) {
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
  fetch(options) {
    return this.geocode(options);
  }
  /**
   * Call the Google Maps Geocoder service
   *
   * @param {GeocodeOptions} [options] The Geocode options
   * @returns {Promise<GeocodeResults>}
   */
  geocode(options) {
    if (isObject(options)) {
      this.setOptions(options);
    }
    const useCache = this.#cache && geocodeCacheSize > 0;
    const key = useCache ? this.#cacheKey() : "";
    if (useCache) {
      const cached = geocodeCache.get(key);
      if (cached) {
        return cached;
      }
    }
    const request = this.#requestResults();
    if (useCache) {
      geocodeCache.set(key, request);
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
  #cacheKey() {
    const ne = this.#bounds?.getNorthEast();
    const sw = this.#bounds?.getSouthWest();
    return JSON.stringify({
      address: this.#address,
      bounds: ne && sw ? [ne.latitude, ne.longitude, sw.latitude, sw.longitude] : void 0,
      componentRestrictions: this.#componentRestrictions,
      language: this.#language,
      location: this.#location ? [this.#location.latitude, this.#location.longitude] : void 0,
      placeId: this.#placeId,
      region: this.#region
    });
  }
  /**
   * Send the request, waiting for the Google library first if it isn't loaded yet
   *
   * @private
   * @returns {Promise<GeocodeResults>}
   */
  #requestResults() {
    return new Promise((resolve, reject) => {
      if (checkForGoogleMaps("Geocoder", "Geocoder", false)) {
        this.#runGeocode().then((results) => {
          resolve(results);
        }).catch((status) => {
          if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
            resolve(new Results_default());
          } else {
            reject(status);
          }
        });
      } else {
        loader().onMapLoad(() => {
          this.#runGeocode().then((results) => {
            resolve(results);
          }).catch((status) => {
            if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
              resolve(new Results_default());
            } else {
              reject(status);
            }
          });
        });
      }
    });
  }
  /**
   * Runs the geocode request
   *
   * @returns {Promise<GeocodeResults>}
   */
  #runGeocode = async () => {
    const options = {};
    if (this.#address) {
      options.address = this.#address;
    } else if (this.#location) {
      options.location = this.#location.toGoogle();
    } else if (this.#placeId) {
      options.placeId = this.#placeId;
    }
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
      sharedGeocoder ??= new google.maps.Geocoder();
      sharedGeocoder.geocode(options, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          const resultsObj = new Results_default(results ?? void 0);
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
  setAddress(address) {
    this.address = address;
    return this;
  }
  /**
   * Set the bounds within which to bias geocode results more prominently
   *
   * @param {LatLngBoundsValue} bounds The bounds within which to bias geocode results more prominently
   * @returns {Geocode}
   */
  setBounds(bounds) {
    this.bounds = bounds;
    return this;
  }
  /**
   * Set the component restrictions
   *
   * @param {GeocodeComponentRestrictions} componentRestrictions The component restrictions
   * @returns {Geocode}
   */
  setComponentRestrictions(componentRestrictions) {
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
  setLanguage(language) {
    this.language = language;
    return this;
  }
  /**
   * Set the location to geocode
   *
   * @param {LatLngValue} location The location to geocode
   * @returns {Geocode}
   */
  setLocation(location) {
    this.location = location;
    return this;
  }
  /**
   * Set the place id
   *
   * @param {string} placeId The place id
   * @returns {Geocode}
   */
  setPlaceId(placeId) {
    this.placeId = placeId;
    return this;
  }
  /**
   * Set the region code
   *
   * @param {string} region The region code
   * @returns {Geocode}
   */
  setRegion(region) {
    this.region = region;
    return this;
  }
  /**
   * Sets the options for the popup
   *
   * @param {GeocodeOptions} options Geocode options
   * @returns {Geocode}
   */
  setOptions(options) {
    if (options.address) {
      this.address = options.address;
    }
    if (options.bounds) {
      this.bounds = options.bounds;
    }
    if (typeof options.cache === "boolean") {
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
};
var geocode = (options) => {
  if (options instanceof Geocode) {
    return options;
  }
  return new Geocode(options);
};

// src/lib/AutocompleteSearchBox.ts
var AutocompleteSearchBox = class extends Evented {
  /**
   * Holds the bounds to restrict the search to
   *
   * @private
   * @type {LatLngBounds | undefined}
   */
  #bounds;
  /**
   * Holds the region to use for biasing query predictions.
   *
   * https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#ComponentRestrictions
   *
   * @private
   * @type {string|Array<string>|null}
   */
  #countryRestriction = null;
  /**
   * Holds the fields to be included for the Place in the details response when the details are successfully retrieved.
   *
   * @private
   * @type {string[]}
   */
  #fields = ["ALL"];
  /**
   * Holds the reference to the input element
   *
   * @private
   * @type {HTMLInputElement | undefined}
   */
  #input;
  /**
   * Holds the promise for setting up the search box.
   *
   * Every call to init() waits on this same promise so that the search box is only built once,
   * however many times init() is called and whenever those calls are made.
   *
   * @private
   * @type {Promise<void>|undefined}
   */
  #initPromise;
  /**
   * Holds the place that has been found.
   *
   * @private
   * @type {google.maps.places.PlaceResult | undefined}
   */
  #place;
  /**
   * Holds the map bounds based on the place that has been found
   *
   * @private
   * @type {LatLngBounds | undefined}
   */
  #placeBounds;
  /**
   * Holds the reference to the Google Maps SearchBox object
   *
   * @private
   * @type {google.maps.places.Autocomplete | undefined}
   */
  #searchBox;
  /**
   * Sets whether the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.
   *
   * @private
   * @type {boolean}
   */
  #strictBounds = false;
  /**
   * Holds the types of predictions to be returned.
   *
   * @private
   * @type {string[] | undefined}
   */
  #types;
  /**
   * Constructor
   *
   * @param {string | HTMLInputElement | AutocompleteSearchBoxOptions} [input] The input reference or the options
   * @param {AutocompleteSearchBoxOptions} [options] The places autocomplete search box options if the input is reference to the input element
   */
  constructor(input, options) {
    super("placesSearchBox", "places");
    if (input instanceof HTMLInputElement) {
      this.#input = input;
      if (options) {
        this.setOptions(options);
      }
    } else if (isString(input)) {
      this.#input = document.querySelector(input) ?? void 0;
      if (!this.#input) {
        throw new Error(`The input element with the selector "${input}" was not found.`);
      }
      if (options) {
        this.setOptions(options);
      }
    } else if (isObjectWithValues(input)) {
      this.setOptions(input);
    }
  }
  /**
   * Get the bounds to which query predictions are biased.
   *
   * @returns {LatLngBounds | undefined}
   */
  get bounds() {
    return this.#bounds ?? void 0;
  }
  /**
   * Sets the region to use for biasing query predictions.
   *
   * Results will only be biased towards this area and not be completely restricted to it.
   *
   * @param {LatLngBoundsValue} value The bounds to set
   */
  set bounds(value) {
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
  set countryRestriction(value) {
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
  get countryRestriction() {
    return this.#countryRestriction;
  }
  /**
   * Set the fields to be included for the Place in the details response when the details are successfully retrieved.
   *
   * @param {string | string[]} value The fields to set
   */
  set fields(value) {
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
  get fields() {
    return this.#fields;
  }
  /**
   * Get the input reference
   *
   * @returns {HTMLInputElement | undefined}
   */
  get input() {
    return this.#input;
  }
  /**
   * Set the input reference
   *
   * @param {string | HTMLInputElement} value The input HTMLInputElement or the selector for the input element
   */
  set input(value) {
    if (value instanceof HTMLInputElement) {
      this.#input = value;
    } else if (isString(value)) {
      this.#input = document.querySelector(value) ?? void 0;
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
  get strictBounds() {
    return this.#strictBounds;
  }
  /**
   * Set that the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.
   *
   * Setting strictBounds to false (which is the default) will make the results biased towards, but not restricted to, places contained within the bounds.
   *
   * @param {boolean} value The value to set
   */
  set strictBounds(value) {
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
  get types() {
    return this.#types;
  }
  /**
   * Set the types of predictions to be returned.
   *
   * To clear the types set it to null.
   *
   * @param {string | string[] | null} value The types to set
   */
  set types(value) {
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
  getBounds() {
    return this.bounds;
  }
  /**
   * Get the country or countries to use for biasing query predictions.
   *
   * @returns {string | string[] | null}
   */
  getCountryRestriction() {
    return this.#countryRestriction;
  }
  /**
   * Get the fields to be included for the Place in the details response when the details are successfully retrieved.
   *
   * @returns {string[]}
   */
  getFields() {
    return this.fields;
  }
  /**
   * Get the HTML input element reference
   *
   * @returns {HTMLInputElement | undefined}
   */
  getInput() {
    return this.#input;
  }
  /**
   * Gets the place that has been found
   *
   * The results from the place_changed event is one place and it's the place that the user clicked on.
   *
   * @returns {google.maps.places.PlaceResult | undefined}
   */
  getPlace() {
    return this.#place;
  }
  /**
   * Get the map bounds based on the place that has been found.
   *
   * @returns {LatLngBounds|undefined}
   */
  getPlaceBounds() {
    return this.#placeBounds;
  }
  /**
   * Get whether the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.
   *
   * @returns {boolean}
   */
  getStrictBounds() {
    return this.strictBounds;
  }
  /**
   * Get the types of predictions to be returned.
   *
   * @returns {string[] | undefined}
   */
  getTypes() {
    return this.#types;
  }
  /**
   * Initialize the places search box object
   *
   * This must be called in order for the places search box to work.
   *
   * @returns {Promise<void>}
   */
  async init() {
    if (!this.#initPromise) {
      const initPromise = new Promise((resolve, reject) => {
        if (checkForGoogleMaps("AutocompleteSearchBox", "places", false)) {
          this.#createAutocompleteSearchBox().then(resolve).catch(reject);
        } else {
          loader().onMapLoad(() => {
            this.#createAutocompleteSearchBox().then(resolve).catch(reject);
          });
        }
      });
      const tracked = initPromise.catch((error) => {
        if (this.#initPromise === tracked) {
          this.#initPromise = void 0;
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
      const options = {
        strictBounds: this.#strictBounds
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
        throw new Error("The input element must be set before the autocomplete search box can be initialized.");
      }
      const searchBox = new google.maps.places.Autocomplete(this.#input, options);
      this.#searchBox = searchBox;
      searchBox.addListener(AutocompleteSearchBoxEvents.PLACE_CHANGED, () => {
        const place = searchBox.getPlace();
        const bounds = latLngBounds();
        if (place.geometry) {
          if (place.geometry.viewport) {
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
  isInitialized() {
    return isObject(this.#searchBox);
  }
  /**
   * @inheritdoc
   */
  hasListener(type, callback) {
    return super.hasListener(type, callback);
  }
  /**
   * @inheritdoc
   */
  off(type, callback, options) {
    super.off(type, callback, options);
  }
  /**
   * @inheritdoc
   */
  on(type, callback, config) {
    super.on(type, callback, config);
  }
  /**
   * @inheritdoc
   */
  onImmediate(type, callback, config) {
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
  onPlaceChanged(callback) {
    this.on(AutocompleteSearchBoxEvents.PLACE_CHANGED, (data) => {
      callback(data.place, data.bounds);
    });
  }
  /**
   * @inheritdoc
   */
  once(type, callback, config) {
    super.once(type, callback, config);
  }
  /**
   * @inheritdoc
   */
  onceImmediate(type, callback, config) {
    super.onceImmediate(type, callback, config);
  }
  /**
   * @inheritdoc
   */
  only(type, callback, config) {
    super.only(type, callback, config);
  }
  /**
   * @inheritdoc
   */
  onlyOnce(type, callback, config) {
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
  setBounds(value) {
    this.bounds = value;
    return this;
  }
  /**
   * Sets the country or countries to use for biasing query predictions.
   *
   * @param {string|string[]|null} value The country restriction to set
   * @returns {AutocompleteSearchBox}
   */
  setCountryRestriction(value) {
    this.countryRestriction = value;
    return this;
  }
  /**
   * Set the fields to be included for the Place in the details response when the details are successfully retrieved.
   *
   * @param {string|string[]} value The fields to set
   * @returns {AutocompleteSearchBox}
   */
  setFields(value) {
    this.fields = value;
    return this;
  }
  /**
   * Set the input reference
   *
   * @param {string|HTMLInputElement} input The input HTMLInputElement or the selector for the input element
   * @returns {AutocompleteSearchBox}
   */
  setInput(input) {
    this.input = input;
    return this;
  }
  /**
   * Set the places search box options
   *
   * @param {AutocompleteSearchBoxOptions} options The options to set
   * @returns {AutocompleteSearchBox}
   */
  setOptions(options) {
    if (isObjectWithValues(options)) {
      if (options.bounds) {
        this.bounds = options.bounds;
      }
      if (typeof options.input !== "undefined") {
        if (options.input instanceof HTMLInputElement) {
          this.#input = options.input;
        } else if (isString(options.input)) {
          this.#input = document.querySelector(options.input) ?? void 0;
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
  setStrictBounds(value) {
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
  setTypes(value) {
    this.types = value;
    return this;
  }
};
var autocompleteSearchBox = (input, options) => {
  if (input instanceof AutocompleteSearchBox) {
    return input;
  }
  return new AutocompleteSearchBox(input, options);
};

// src/lib/MarkerCluster.ts
import {
  GridAlgorithm,
  MarkerClusterer,
  NoopAlgorithm,
  SuperClusterAlgorithm
} from "@googlemaps/markerclusterer";

// src/lib/MarkerCluster/DefaultRender.ts
import { MarkerUtils } from "@googlemaps/markerclusterer";
var DefaultRenderer = class {
  /**
   * The colors to use for the clusters.
   */
  #colors = {};
  /**
   * The color to use for the cluster if it has less than the average number of markers in a cluster.
   *
   * @type {string|ClusterColor}
   */
  #colorRangeBottom = "#ff0000";
  /**
   * The color to use for the cluster if it has more than the average number of markers in a cluster.
   *
   * @type {string|ClusterColor}
   */
  #colorRangeTop = "#0000ff";
  /**
   * The opacity to use for the center of the marker
   *
   * @type {number}
   */
  #centerOpacity = 0.7;
  /**
   * The opacity to use for the middle ring of the marker
   *
   * @type {number}
   */
  #middleOpacity = 0.4;
  /**
   * The opacity to use for the outer ring of the marker
   *
   * @type {number}
   */
  #outerOpacity = 0.2;
  /**
   * Holds the font family for the cluster marker label
   *
   * @type {string}
   */
  #labelFontFamily = "roboto,arial,sans-serif";
  /**
   * Holds the font size for the cluster marker
   *
   * @type {string}
   */
  #labelFontSize = "12px";
  /**
   * Holds if the number of markers in the cluster should be displayed
   *
   * @type {boolean}
   */
  #showNumber = true;
  /**
   * Set the color to use for the cluster if it has less than the average number of markers in a cluster.
   *
   * @param {string|ClusterColor} color The color to use if the cluster has less than the average number of markers in a cluster.
   */
  setColorRangeBottom(color) {
    if (isStringWithValue(color)) {
      this.#colorRangeBottom = color;
    } else if (isObject(color) && isStringWithValue(color.bgColor)) {
      this.#colorRangeBottom = color;
    }
  }
  /**
   * Set the color to use for the cluster if it has more than the average number of markers in a cluster.
   *
   * @param {string|ClusterColor} color The color to use if the cluster has more than the average number of markers in a cluster.
   */
  setColorRangeTop(color) {
    if (isStringWithValue(color)) {
      this.#colorRangeTop = color;
    } else if (isObject(color) && isStringWithValue(color.bgColor)) {
      this.#colorRangeTop = color;
    }
  }
  /**
   * Set custom colors to use for the cluster markers.
   *
   * @param {ClusterColors} colors The custom colors to use for the cluster markers.
   */
  setColors(colors) {
    if (isObject(colors)) {
      const sortedColors = Object.keys(colors).map((k) => parseInt(k, 10)).filter(
        (k) => !Number.isNaN(k) && k >= 0 && (typeof colors[k] === "string" || isObject(colors[k]) && typeof colors[k].bgColor === "string")
      ).sort((a, b) => a - b).reduce((acc, k) => {
        acc[k] = colors[k];
        return acc;
      }, {});
      if (Object.keys(sortedColors).length > 0) {
        this.#colors = sortedColors;
      }
    }
  }
  /**
   * Set the opacity for the center of the marker
   *
   * @param {number} center The opacity to use for the center of the marker
   */
  setCenterOpacity(center) {
    const opacity = getNumber(center);
    if (!Number.isNaN(opacity) && opacity >= 0 && opacity <= 1) {
      this.#centerOpacity = opacity;
    }
  }
  /**
   * Set the opacity for the middle ring of the marker
   *
   * @param {number} middle The opacity to use for the middle ring of the marker
   */
  setMiddleOpacity(middle) {
    const opacity = getNumber(middle);
    if (!Number.isNaN(opacity) && opacity >= 0 && opacity <= 1) {
      this.#middleOpacity = opacity;
    }
  }
  /**
   * Set the opacity for the outer ring of the marker
   *
   * @param {number} outer The opacity to use for the outer ring of the marker
   */
  setOuterOpacity(outer) {
    const opacity = getNumber(outer);
    if (!Number.isNaN(opacity) && opacity >= 0 && opacity <= 1) {
      this.#outerOpacity = opacity;
    }
  }
  /**
   * Set the font family to use for the cluster marker
   *
   * @param {string} fontFamily The font family to use for the cluster marker
   */
  setFontFamily(fontFamily) {
    this.#labelFontFamily = fontFamily;
  }
  /**
   * Set the font size to use for the cluster marker
   *
   * @param {number} fontSize The font size to use for the cluster marker
   */
  setFontSize(fontSize) {
    if (isString(fontSize)) {
      this.#labelFontSize = fontSize;
    } else if (isNumber(fontSize)) {
      this.#labelFontSize = `${fontSize}px`;
    }
  }
  /**
   * Sets if the number of markers in the cluster should be displayed
   *
   * @param {boolean} showNumber Whether to show the number of markers in the cluster
   */
  setShowNumber(showNumber) {
    this.#showNumber = getBoolean(showNumber);
  }
  /**
   * Get the color for the cluster.
   *
   * @param {number} count The number of markers in the cluster.
   * @param {number} mean The average number of markers in a cluster.
   * @returns {ClusterColor}
   */
  #getColor(count, mean) {
    const keys = Object.keys(this.#colors);
    let color = this.#colorRangeBottom;
    if (Object.keys(this.#colors).length > 0) {
      for (let i = 0; i < keys.length; i += 1) {
        const k = parseInt(keys[i], 10);
        if (count >= k) {
          color = this.#colors[k];
        } else {
          break;
        }
      }
    } else {
      color = count > mean ? this.#colorRangeTop : this.#colorRangeBottom;
    }
    let bgColor = "";
    let textColor = "#ffffff";
    if (typeof color === "string") {
      bgColor = color;
    } else if (isObject(color)) {
      const colorObject = color;
      if (isStringWithValue(colorObject.bgColor)) {
        bgColor = colorObject.bgColor;
        if (isStringWithValue(colorObject.textColor)) {
          textColor = colorObject.textColor;
        }
      }
    }
    return {
      bgColor,
      textColor
    };
  }
  /**
   * Renders the cluster marker
   *
   * @param {Cluster} cluster The cluster information
   * @param {ClusterStats} stats The status for all of the clusters
   * @param {google.maps.Map} map The map object
   * @returns {google.maps.Marker | google.maps.marker.AdvancedMarkerElement}
   */
  render(cluster, stats, map2) {
    const { count, position } = cluster;
    const color = this.#getColor(count, stats.clusters.markers.mean);
    const svg = `<svg fill="${color.bgColor}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50" height="50">
                <circle cx="25" cy="25" opacity="${this.#centerOpacity}" r="16" />
                <circle cx="25" cy="25" opacity="${this.#middleOpacity}" r="22" />
                <circle cx="25" cy="25" opacity="${this.#outerOpacity}" r="25" />
                <text x="50%" y="50%" style="fill:${color.textColor}" text-anchor="middle" font-size="${this.#labelFontSize}" dominant-baseline="middle" font-family="${this.#labelFontFamily}">${this.#showNumber ? count : ""}</text>
            </svg>`;
    const title = `Cluster of ${count} markers`;
    const zIndex = Number(google.maps.Marker.MAX_ZINDEX) + count;
    if (MarkerUtils.isAdvancedMarkerAvailable(map2)) {
      const parser = new DOMParser();
      const svgEl = parser.parseFromString(svg, "image/svg+xml").documentElement;
      svgEl.setAttribute("transform", "translate(0 25)");
      const clusterOptions2 = {
        map: map2,
        position,
        zIndex,
        title,
        content: svgEl
      };
      return new google.maps.marker.AdvancedMarkerElement(clusterOptions2);
    }
    const clusterOptions = {
      position,
      zIndex,
      title,
      icon: {
        url: `data:image/svg+xml;base64,${btoa(svg)}`,
        anchor: new google.maps.Point(25, 25)
      }
    };
    return new google.maps.Marker(clusterOptions);
  }
};

// src/lib/MarkerCluster/ImageRenderer.ts
var ImageRenderer = class {
  /**
   * Holds the renderer that's used if no valid images were set.
   *
   * This is created the first time that a cluster is rendered without an image.
   *
   * @private
   * @type {DefaultRenderer|undefined}
   */
  #fallbackRenderer;
  /**
   * Holds the images that can be used for the marker cluster icons
   *
   * @private
   * @type {ClusterImages}
   */
  #images = {};
  /**
   * A CSS class name to be added to the label element
   *
   * @private
   * @type {string|undefined}
   */
  #labelClassName;
  /**
   * The color of the label text. Default color is black.
   *
   * @private
   * @type {string|undefined}
   */
  #labelColor;
  /**
   * Holds the font family for the cluster marker label.
   *
   * @private
   * @type {string|undefined}
   */
  #labelFontFamily;
  /**
   * Holds the font size for the cluster marker
   *
   * @private
   * @type {number}
   */
  #labelFontSize = "12px";
  /**
   * The font weight of the label text (equivalent to the CSS font-weight property).
   *
   * @private
   * @type {string|undefined}
   */
  #labelFontWeight;
  /**
   * The map object
   *
   * @private
   * @type {Map|undefined}
   */
  #map;
  /**
   * Holds if the number of markers in the cluster should be displayed
   *
   * @private
   * @type {boolean}
   */
  #showNumber = true;
  /**
   * Set the map object to use for the cluster marker
   *
   * @param {Map} map The map object
   */
  setMap(map2) {
    this.#map = map2;
  }
  /**
   * Set custom images to use for the cluster markers.
   *
   * @param {ClusterImages} images The custom images to use for the cluster markers.
   */
  setImages(images) {
    if (isObject(images)) {
      const sortedImages = Object.keys(images).map((k) => parseInt(k, 10)).filter(
        (k) => !Number.isNaN(k) && k >= 0 && (typeof images[k] === "string" || isObject(images[k]) && typeof images[k].url === "string")
      ).sort((a, b) => a - b).reduce((acc, k) => {
        acc[k] = images[k];
        return acc;
      }, {});
      if (Object.keys(sortedImages).length > 0) {
        this.#images = sortedImages;
      }
    }
  }
  /**
   * Set a single image to use for the cluster markers.
   * This will replace any existing images.
   * The image will be used for all clusters.
   * To set different images for different cluster sizes, use the setImages method.
   *
   * @param {ClusterImageValue} image The image URL or image object to use for the cluster markers.
   */
  setImage(image) {
    if (typeof image === "string" || isObject(image) && typeof image.url === "string") {
      this.#images = { 0: image };
    }
  }
  /**
   * Set the class name to use for the label
   *
   * @param {string} labelClassName The class name to use for the label
   */
  setLabelClassName(labelClassName) {
    this.#labelClassName = labelClassName;
  }
  /**
   * Set the color of the label text
   *
   * @param {string} labelColor The color of the label text. Default color is black.
   */
  setLabelColor(labelColor) {
    this.#labelColor = labelColor;
  }
  /**
   * Set the font family to use for the cluster marker
   *
   * @param {string} fontFamily The font family to use for the cluster marker
   */
  setLabelFontFamily(fontFamily) {
    this.#labelFontFamily = fontFamily;
  }
  /**
   * Set the font size to use for the cluster marker
   *
   * @param {string|number} fontSize The font size to use for the cluster marker
   */
  setLabelFontSize(fontSize) {
    if (isStringOrNumber(fontSize)) {
      this.#labelFontSize = fontSize;
    }
  }
  /**
   * Set the font weight to use for the cluster marker
   *
   * @param {string} labelFontWeight The font weight to use for the cluster marker
   */
  setLabelFontWeight(labelFontWeight) {
    this.#labelFontWeight = labelFontWeight;
  }
  /**
   * Sets if the number of markers in the cluster should be displayed
   *
   * @param {boolean} showNumber Whether to show the number of markers in the cluster
   */
  setShowNumber(showNumber) {
    this.#showNumber = getBoolean(showNumber);
  }
  /**
   * Get the image for the cluster.
   *
   * This returns undefined if no valid images were set.
   *
   * @param {number} count The number of markers in the cluster.
   * @returns {ClusterImageValue|undefined}
   */
  getImage(count) {
    const keys = Object.keys(this.#images).map((k) => parseInt(k, 10));
    let image = this.#images[keys[0]];
    for (let i = 0; i < keys.length; i += 1) {
      const k = keys[i];
      if (count >= k) {
        image = this.#images[k];
      } else {
        break;
      }
    }
    return image;
  }
  /**
   * Renders the cluster marker
   *
   * If no valid images were set then the cluster is rendered with the default renderer instead.
   *
   * @param {Cluster} cluster The cluster information
   * @param {ClusterStats} stats The stats for all of the clusters
   * @param {google.maps.Map} map The map object
   * @returns {google.maps.Marker | google.maps.marker.AdvancedMarkerElement}
   */
  render(cluster, stats, map2) {
    const { count, position } = cluster;
    const imageValue = this.getImage(count);
    if (!imageValue) {
      return this.#getFallbackRenderer().render(cluster, stats, map2);
    }
    const image = typeof imageValue === "string" ? { url: imageValue } : imageValue;
    const markerImage = icon(image.url);
    if (image.width && image.height) {
      markerImage.setSize([image.width, image.height]);
    } else if (image.size) {
      markerImage.setSize(image.size);
    }
    if (image.scaledWidth && image.scaledHeight) {
      markerImage.setScaledSize([image.scaledWidth, image.scaledHeight]);
    } else if (image.scaledSize) {
      markerImage.setScaledSize(image.scaledSize);
    }
    const label = { text: count.toString() };
    if (image.labelClassName) {
      label.className = image.labelClassName;
    } else if (this.#labelClassName) {
      label.className = this.#labelClassName;
    }
    if (image.labelColor) {
      label.color = image.labelColor;
    } else if (this.#labelColor) {
      label.color = this.#labelColor;
    }
    if (image.labelFontFamily) {
      label.fontFamily = image.labelFontFamily;
    } else if (this.#labelFontFamily) {
      label.fontFamily = this.#labelFontFamily;
    }
    if (image.labelFontSize) {
      label.fontSize = image.labelFontSize;
    } else if (this.#labelFontSize) {
      label.fontSize = this.#labelFontSize.toString();
    }
    if (image.labelFontWeight) {
      label.fontWeight = image.labelFontWeight;
    } else if (this.#labelFontWeight) {
      label.fontWeight = this.#labelFontWeight;
    }
    const clusterMarker = marker();
    clusterMarker.setPositionSync({ lat: position.lat(), lng: position.lng() });
    clusterMarker.setIconSync(markerImage);
    if (this.#showNumber) {
      clusterMarker.setLabelSync(label);
    }
    return clusterMarker.toGoogleSync();
  }
  /**
   * Get the renderer to use when no valid images were set.
   *
   * The label settings that apply to both renderers are passed on to it.
   *
   * @private
   * @returns {DefaultRenderer}
   */
  #getFallbackRenderer() {
    if (!this.#fallbackRenderer) {
      console.warn(
        "No valid images were set for the marker cluster image renderer. The default cluster marker is being used instead."
      );
      const renderer = new DefaultRenderer();
      renderer.setShowNumber(this.#showNumber);
      if (this.#labelFontFamily) {
        renderer.setFontFamily(this.#labelFontFamily);
      }
      renderer.setFontSize(this.#labelFontSize);
      this.#fallbackRenderer = renderer;
    }
    return this.#fallbackRenderer;
  }
};

// src/lib/MarkerCluster.ts
var MarkerCluster = class extends Base_default {
  /**
   * The MarkerClusterer object
   *
   * This is undefined until the cluster is set up, which may be delayed until the map is loaded.
   *
   * @private
   * @type {MarkerClusterer|undefined}
   */
  #clusterer;
  /**
   * Holds any markers to add to the cluster once the map is loaded
   *
   * @private
   * @type {Marker[]}
   */
  #pendingMarkers = [];
  /**
   * The constructor for the MarkerCluster class
   *
   * @param {Map} map The map object
   * @param {Marker[]|MarkerClusterOptions} [markers] Markers to cluster. You can also use addMarker() instead of adding the markers here.
   * @param {MarkerClusterOptions} [options] Options for the marker clusterer
   */
  constructor(map2, markers, options) {
    super("markercluster");
    if (!(map2 instanceof Map2)) {
      throw new Error("You must pass a valid map object to the MarkerCluster object.");
    }
    if (checkForGoogleMaps("MarkerCluster", "Marker", false)) {
      this.#setupCluster(map2, markers, options);
    } else {
      loader().onMapLoad(() => {
        this.#setupCluster(map2, markers, options);
      });
    }
  }
  /**
   * Set up the marker cluster
   *
   * @param {Map} map The map object
   * @param {Marker[]|MarkerClusterOptions} [markers] Markers to cluster. You can also use addMarker() instead of adding the markers here.
   * @param {MarkerClusterOptions} [options] Options for the marker clusterer
   */
  #setupCluster(map2, markers, options) {
    const clusterOptions = {
      map: map2.toGoogle()
    };
    let optionsToUse = options;
    if (isObject(markers) && typeof options === "undefined") {
      optionsToUse = markers;
    }
    if (isObject(optionsToUse)) {
      const algorithmOptions = isObject(optionsToUse.algorithmOptions) ? optionsToUse.algorithmOptions : {};
      if (isNumber(optionsToUse.maxZoom) || isNumberString(optionsToUse.maxZoom)) {
        algorithmOptions.maxZoom = getNumber(optionsToUse.maxZoom);
      }
      if (typeof algorithmOptions.maxZoom === "undefined") {
        algorithmOptions.maxZoom = 13;
      }
      if (isNumber(optionsToUse.radius) || isNumberString(optionsToUse.radius)) {
        algorithmOptions.radius = getNumber(optionsToUse.radius);
      }
      if (isNumber(optionsToUse.minPoints) || isNumberString(optionsToUse.minPoints)) {
        algorithmOptions.minPoints = getNumber(optionsToUse.minPoints);
      }
      if (typeof algorithmOptions.minPoints === "undefined") {
        algorithmOptions.minPoints = 3;
      }
      if (typeof optionsToUse.algorithm === "string") {
        switch (optionsToUse.algorithm) {
          case "grid":
            clusterOptions.algorithm = new GridAlgorithm(algorithmOptions);
            break;
          case "supercluster":
            clusterOptions.algorithm = new SuperClusterAlgorithm(algorithmOptions);
            break;
          case "noop":
            clusterOptions.algorithm = new NoopAlgorithm(algorithmOptions);
            break;
          default:
            if (Object.keys(algorithmOptions).length > 0) {
              clusterOptions.algorithm = new SuperClusterAlgorithm(algorithmOptions);
            }
            break;
        }
      } else if (typeof optionsToUse.algorithmClass !== "undefined") {
        clusterOptions.algorithm = optionsToUse.algorithmClass;
      }
      if (Object.keys(algorithmOptions).length > 0) {
        clusterOptions.algorithmOptions = algorithmOptions;
      }
      if (isFunction(optionsToUse.onClusterClick)) {
        clusterOptions.onClusterClick = optionsToUse.onClusterClick;
      }
      if (typeof optionsToUse.renderer !== "undefined") {
        clusterOptions.renderer = optionsToUse.renderer;
      } else if (isObject(optionsToUse.defaultRenderOptions)) {
        const renderer = new DefaultRenderer();
        const renderOptions = optionsToUse.defaultRenderOptions;
        if (isObject(renderOptions.colors)) {
          renderer.setColors(renderOptions.colors);
        }
        if (renderOptions.colorRangeTop) {
          renderer.setColorRangeTop(renderOptions.colorRangeTop);
        }
        if (renderOptions.colorRangeBottom) {
          renderer.setColorRangeBottom(renderOptions.colorRangeBottom);
        }
        if (typeof renderOptions.labelFontFamily === "string") {
          renderer.setFontFamily(renderOptions.labelFontFamily);
        }
        if (typeof renderOptions.labelFontSize !== "undefined") {
          renderer.setFontSize(renderOptions.labelFontSize);
        }
        if (typeof renderOptions.centerOpacity !== "undefined") {
          renderer.setCenterOpacity(renderOptions.centerOpacity);
        }
        if (typeof renderOptions.middleOpacity !== "undefined") {
          renderer.setMiddleOpacity(renderOptions.middleOpacity);
        }
        if (typeof renderOptions.outerOpacity !== "undefined") {
          renderer.setOuterOpacity(renderOptions.outerOpacity);
        }
        if (typeof renderOptions.showNumber !== "undefined") {
          renderer.setShowNumber(renderOptions.showNumber);
        }
        clusterOptions.renderer = renderer;
      } else if (isObject(optionsToUse.imageRendererOptions)) {
        const renderer = new ImageRenderer();
        renderer.setMap(map2);
        const renderOptions = optionsToUse.imageRendererOptions;
        if (typeof renderOptions.images !== "undefined") {
          renderer.setImages(renderOptions.images);
        } else if (typeof renderOptions.image !== "undefined") {
          renderer.setImage(renderOptions.image);
        }
        if (typeof renderOptions.labelClassName === "string") {
          renderer.setLabelClassName(renderOptions.labelClassName);
        }
        if (typeof renderOptions.labelColor === "string") {
          renderer.setLabelColor(renderOptions.labelColor);
        }
        if (typeof renderOptions.labelFontFamily === "string") {
          renderer.setLabelFontFamily(renderOptions.labelFontFamily);
        }
        if (typeof renderOptions.labelFontSize !== "undefined") {
          renderer.setLabelFontSize(renderOptions.labelFontSize);
        }
        if (typeof renderOptions.labelFontWeight === "string") {
          renderer.setLabelFontWeight(renderOptions.labelFontWeight);
        }
        if (typeof renderOptions.showNumber !== "undefined") {
          renderer.setShowNumber(renderOptions.showNumber);
        }
        clusterOptions.renderer = renderer;
      }
    } else {
      clusterOptions.renderer = new DefaultRenderer();
    }
    const clusterer = new MarkerClusterer(clusterOptions);
    this.#clusterer = clusterer;
    if (Array.isArray(markers)) {
      markers.forEach((marker2) => {
        if (marker2 instanceof Marker) {
          clusterer.addMarker(marker2.toGoogleSync(), true);
        }
      });
    }
  }
  /**
   * Adds a marker to the cluster
   *
   * @param {Marker} marker The marker to add to the cluster
   * @param {boolean} draw Whether to redraw the clusters after adding the marker.
   *      Default is true. Note, this is opposite of the MarkerClusterer library.
   * @returns {MarkerCluster}
   */
  addMarker(marker2, draw = true) {
    if (checkForGoogleMaps("MarkerCluster", "Marker", false)) {
      marker2.toGoogle().then((m) => {
        this.#clusterer?.addMarker(m, !draw);
      });
    } else {
      this.#pendingMarkers.push(marker2);
      loader().onMapLoad(() => {
        this.addMarkers(this.#pendingMarkers, draw);
        this.#pendingMarkers = [];
      });
    }
    return this;
  }
  /**
   * Add multiple markers to the cluster
   *
   * @param {Marker[]} markers The array of markers to add
   * @param {boolean} draw Whether to redraw the clusters after adding the marker.
   *      Default is true. Note, this is opposite of the MarkerClusterer library.
   * @returns {MarkerCluster}
   */
  addMarkers(markers, draw = true) {
    const add = (mks, drw = true) => {
      const markerPromises = [];
      mks.forEach((marker2) => {
        if (marker2 instanceof Marker) {
          markerPromises.push(marker2.toGoogle());
        }
      });
      Promise.all(markerPromises).then((googleMarkerObjects) => {
        this.#clusterer?.addMarkers(googleMarkerObjects, !drw);
      });
    };
    if (checkForGoogleMaps("MarkerCluster", "Marker", false)) {
      add(markers, draw);
    } else {
      markers.forEach((marker2) => {
        this.#pendingMarkers.push(marker2);
      });
      loader().onMapLoad(() => {
        add(this.#pendingMarkers, draw);
        this.#pendingMarkers = [];
      });
    }
    return this;
  }
  /**
   * Clears all of the markers
   *
   * @param {boolean} draw Whether to redraw the clusters after removing all the markers.
   *      Default is true. Note, this is opposite of the MarkerClusterer library.
   * @returns {MarkerCluster}
   */
  clearMarkers(draw = true) {
    this.#clusterer?.clearMarkers(!draw);
    return this;
  }
  /**
   * Removes a single marker from the cluster.
   *
   * @param {Marker} marker The marker to remove
   * @param {boolean} draw Whether to redraw the clusters after removing the marker.
   *      Default is true. Note, this is opposite of the MarkerClusterer library.
   * @returns {MarkerCluster}
   */
  removeMarker(marker2, draw = false) {
    if (!marker2.hasGoogleMarker()) {
      return this;
    }
    this.#clusterer?.removeMarker(marker2.toGoogleSync(), !draw);
    return this;
  }
  /**
   * Force a recalculation and redraw of all the marker clusters.
   *
   * @returns {MarkerCluster}
   */
  render() {
    this.#clusterer?.render();
    return this;
  }
};
var markerCluster = (map2, markers, options) => new MarkerCluster(map2, markers, options);

// src/lib/MarkerCollection.ts
var defaultTag = "__default__";
var MarkerCollection = class _MarkerCollection {
  constructor() {
    /**
     * Holds the Marker objects by tag
     */
    this.markers = {};
  }
  /**
   * Adds an Marker to the collection
   *
   * @param {Marker} marker The Marker object to add
   * @param {string} tag The tag to assign the marker to.
   */
  #add(marker2, tag) {
    if (!this.markers[tag]) {
      this.markers[tag] = /* @__PURE__ */ new Set();
    }
    this.markers[tag].add(marker2);
  }
  /**
   * Adds an Marker to the collection
   *
   * @param {Marker} marker The Marker object to add
   * @param {string|string[]} [tag] The tag(s) to assign the marker to. Either a single tag or an array of tags can be passed.
   */
  add(marker2, tag) {
    if (isString(tag)) {
      this.#add(marker2, tag);
    } else if (Array.isArray(tag) && tag.length > 0) {
      tag.forEach((t) => {
        if (isString(t)) {
          this.#add(marker2, t);
        }
      });
    } else {
      this.#add(marker2, defaultTag);
    }
  }
  /**
   * Clears the collection
   *
   * This also hides all the markers in the collection.
   */
  clear() {
    this.hideAll();
    this.markers = {};
  }
  /**
   * Clone the collection
   *
   * @returns {MarkerCollection}
   */
  clone() {
    const clone = new _MarkerCollection();
    Object.keys(this.markers).forEach((tag) => {
      this.markers[tag].forEach((m) => {
        clone.add(m, tag);
      });
    });
    return clone;
  }
  /**
   * Returns true if the collection has any markers
   *
   * @returns {boolean}
   */
  hasData() {
    return Object.keys(this.markers).length > 0;
  }
  /**
   * Hide the Markers in the collection that have the tag passed
   *
   * @param {string} tag The tag to hide markers for.
   */
  #hide(tag) {
    if (this.markers[tag]) {
      this.markers[tag].forEach((marker2) => {
        marker2.hide();
      });
    }
  }
  /**
   * Hide the Markers in the collection that have the tag(s) passed
   *
   * @param {string|string[]} tag The tag(s) to hide markers for. Either a single tag string or an array of tag strings can be passed.
   */
  hide(tag) {
    if (isString(tag)) {
      this.#hide(tag);
    } else if (Array.isArray(tag)) {
      tag.forEach((t) => {
        if (isString(t)) {
          this.#hide(t);
        }
      });
    }
  }
  /**
   * Hides all the Markers in the collection
   */
  hideAll() {
    Object.keys(this.markers).forEach((tag) => {
      this.markers[tag].forEach((marker2) => {
        marker2.hide();
      });
    });
  }
  /**
   * Returns true if the collection has no markers
   *
   * @returns {boolean}
   */
  isEmpty() {
    return Object.keys(this.markers).length === 0;
  }
  /**
   * Remove the marker from the collection by tag.
   *
   * @param {Marker} marker The marker object to remove
   * @param {string} tag The tag to remove the marker from.
   */
  #removeByTag(marker2, tag) {
    if (this.markers[tag]) {
      this.markers[tag].delete(marker2);
    }
  }
  /**
   * Remove the marker from the collection, optionally by tag.
   *
   * @param {Marker} marker The marker object to remove
   * @param {string|string[]} [tag] The tag(s) to remove the marker from. If not set then the marker is removed from all tags.
   *      Either a single tag string or an array of tag strings can be passed.
   */
  remove(marker2, tag) {
    if (isString(tag)) {
      this.#removeByTag(marker2, tag);
    } else if (Array.isArray(tag) && tag.length > 0) {
      tag.forEach((t) => {
        if (isString(t)) {
          this.#removeByTag(marker2, t);
        }
      });
    } else {
      Object.keys(this.markers).forEach((t) => {
        this.markers[t].delete(marker2);
      });
    }
  }
  /**
   * Show the Markers in the collection that have the tag(s) passed
   *
   * @param {string} tag The tag to show markers for.
   * @param {Map} map The map object
   */
  #show(tag, map2) {
    if (this.markers[tag]) {
      this.markers[tag].forEach((marker2) => {
        marker2.show(map2);
      });
    }
  }
  /**
   * Show the Markers in the collection that have the tag(s) passed
   *
   * @param {string|string[]} tag The tag(s) to show markers for. Either a single tag string or an array of tag strings can be passed.
   * @param {Map} [map] The map object
   */
  show(tag, map2) {
    if (isString(tag)) {
      this.#show(tag, map2);
    } else if (Array.isArray(tag)) {
      tag.forEach((t) => {
        if (isString(t)) {
          this.#show(t, map2);
        }
      });
    }
  }
  /**
   * Show all the Markers in the collection
   *
   * @param {Map} map The map object
   */
  showAll(map2) {
    Object.keys(this.markers).forEach((tag) => {
      this.markers[tag].forEach((marker2) => {
        marker2.show(map2);
      });
    });
  }
};
var markerCollection = () => new MarkerCollection();

// src/lib/ImageOverlay.ts
var ImageOverlay = class extends Overlay {
  /**
   * Holds the bounds where the image should be displayed
   *
   * @private
   * @type {LatLngBounds|undefined}
   */
  #bounds;
  /**
   * Holds the image element
   *
   * @private
   * @type {HTMLImageElement}
   */
  #imageElement;
  /**
   * Holds the image URL
   *
   * @private
   * @type {string|undefined}
   */
  #imageUrl;
  /**
   * Whether the overlay is currently being rotated
   *
   * @private
   * @type {boolean}
   */
  #isRotating = false;
  /**
   * Holds the opacity of the image
   *
   * @private
   * @type {number}
   */
  #opacity = 1;
  /**
   * Whether rotation is enabled
   *
   * @private
   * @type {boolean}
   */
  #rotate = false;
  /**
   * Holds the rotation angle in degrees
   *
   * @private
   * @type {number}
   */
  #rotation = 0;
  /**
   * The starting center point when rotation begins
   *
   * @private
   * @type {Point}
   */
  #rotationCenter;
  /**
   * The rotation container element (wraps the image when rotation is enabled)
   *
   * @private
   * @type {HTMLElement|null}
   */
  #rotationContainer = null;
  /**
   * The rotation handle element
   *
   * @private
   * @type {HTMLElement|null}
   */
  #rotationHandle = null;
  /**
   * Holds the styles for the image element
   *
   * This overrides the styles property of the Overlay class.
   *
   * @private
   * @type {object}
   */
  #styles = {};
  /**
   * Constructor
   *
   * @param {ImageOverlayOptions | string} [options] The ImageOverlay options or image URL
   * @param {LatLngBoundsValue} [bounds] The bounds where the image should be displayed (if options is a string)
   */
  constructor(options, bounds) {
    super("imageoverlay", "ImageOverlay");
    this.#imageElement = document.createElement("img");
    this.styles = {
      height: "100%",
      width: "100%"
    };
    if (isObject(options)) {
      this.setOptions(options);
    } else {
      if (isString(options)) {
        this.imageUrl = options;
      }
      if (bounds) {
        this.bounds = bounds;
      }
    }
  }
  /**
   * Returns the bounds where the image should be displayed
   *
   * @returns {LatLngBounds|undefined}
   */
  get bounds() {
    return this.#bounds;
  }
  /**
   * Set the bounds where the image should be displayed
   *
   * @param {LatLngBoundsValue} bounds The bounds where the image should be displayed
   */
  set bounds(bounds) {
    if (bounds) {
      if (bounds instanceof LatLngBounds) {
        this.#bounds = bounds;
      } else {
        this.#bounds = new LatLngBounds(bounds);
      }
    }
  }
  /**
   * Get the class name for the image element
   *
   * This overrides the className property of the Overlay class.
   *
   * @returns {string}
   */
  get className() {
    return this.#imageElement.className;
  }
  /**
   * Set the class name(s) for the image element
   *
   * This overrides the className property of the Overlay class.
   *
   * If you need multiple class names then separate them with a space.
   *
   * @param {string} className The class name(s) to add to the image element.
   *    This can be a space separated list of class names.
   */
  set className(className) {
    if (isString(className)) {
      const classes = className.split(" ");
      classes.forEach((cn) => {
        this.#imageElement.classList.add(cn.trim());
      });
    } else if (isNullOrUndefined(className)) {
      this.#imageElement.className = "";
    }
  }
  /**
   * Returns the image URL
   *
   * @returns {string|undefined}
   */
  get imageUrl() {
    return this.#imageUrl;
  }
  /**
   * Set the image URL
   *
   * @param {string} imageUrl The image URL to display
   */
  set imageUrl(imageUrl) {
    if (isStringWithValue(imageUrl)) {
      this.#imageUrl = imageUrl;
      this.#imageElement.src = imageUrl;
    }
  }
  /**
   * Returns the opacity of the image
   *
   * @returns {number}
   */
  get opacity() {
    return this.#opacity;
  }
  /**
   * Set the opacity of the image
   *
   * @param {number} opacity The opacity value (0.0 to 1.0)
   */
  set opacity(opacity) {
    if (isNumber(opacity) && opacity >= 0 && opacity <= 1) {
      this.#opacity = opacity;
      this.style("opacity", opacity.toString());
    }
  }
  /**
   * Returns whether rotation is enabled
   *
   * @returns {boolean}
   */
  get rotate() {
    return this.#rotate;
  }
  /**
   * Set whether rotation is enabled
   *
   * @param {boolean} rotate Whether rotation is enabled
   */
  set rotate(rotate) {
    if (isBoolean(rotate)) {
      this.#rotate = rotate;
      this.#setupRotationHandlers();
    }
  }
  /**
   * Returns the rotation angle in degrees
   *
   * @returns {number}
   */
  get rotation() {
    return this.#rotation;
  }
  /**
   * Set the rotation angle in degrees
   *
   * @param {number} rotation The rotation angle in degrees (0 to 360)
   */
  set rotation(rotation) {
    if (isNumber(rotation)) {
      this.#rotation = rotation;
      this.#updateImageRotation();
    }
  }
  /**
   * Returns the styles for the overlay element
   *
   * @returns {object}
   */
  get styles() {
    return this.#styles;
  }
  /**
   * Set multiple styles for the image overlay element
   *
   * @param {object} styles The styles to apply to the image overlay element
   */
  set styles(styles) {
    if (isObject(styles)) {
      Object.keys(styles).forEach((key) => {
        this.style(key, styles[key]);
      });
    }
  }
  /**
   * Disable rotation for this overlay
   *
   * @returns {ImageOverlay}
   */
  disableRotation() {
    this.rotate = false;
    return this;
  }
  /**
   * Display the image overlay on the map
   *
   * Alias to show()
   *
   * @param {Map} map The Map object
   * @returns {Promise<ImageOverlay>}
   */
  display(map2) {
    return this.show(map2);
  }
  /**
   * Enable rotation for this overlay
   *
   * @returns {ImageOverlay}
   */
  enableRotation() {
    this.rotate = true;
    return this;
  }
  /**
   * Get the rotation angle in degrees
   *
   * @returns {number}
   */
  getRotation() {
    return this.#rotation;
  }
  /**
   * Fit the overlay to the exact dimensions of the image
   *
   * @returns {Promise<ImageOverlay>}
   */
  fitToImage() {
    return new Promise((resolve) => {
      if (!this.#imageElement.complete) {
        this.#imageElement.onload = () => {
          this.#performFitToImage();
          resolve(this);
        };
      } else {
        this.#performFitToImage();
        resolve(this);
      }
    });
  }
  /**
   * Get the bounds where the image should be displayed
   *
   * @returns {LatLngBounds|undefined}
   */
  getBounds() {
    return this.#bounds;
  }
  /**
   * Get the image URL
   *
   * @returns {string|undefined}
   */
  getImageUrl() {
    return this.#imageUrl;
  }
  /**
   * Get the opacity of the image
   *
   * @returns {number}
   */
  getOpacity() {
    return this.#opacity;
  }
  /**
   * Add an event listener for when rotating ends
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onRotateEnd(callback) {
    this.on(ImageOverlayEvents.ROTATE_END, callback);
  }
  /**
   * Add an event listener for when rotating updates the overlay rotation
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onRotate(callback) {
    this.on(ImageOverlayEvents.ROTATE, callback);
  }
  /**
   * Add an event listener for when rotating the overlay starts
   *
   * @param {EventCallback} callback The callback function to call when the event is dispatched.
   */
  onRotateStart(callback) {
    this.on(ImageOverlayEvents.ROTATE_START, callback);
  }
  /**
   * Removes a class name from the overlay element
   *
   * @param {string} className The class name to remove from the overlay element
   * @returns {Overlay}
   */
  removeClassName(className) {
    const classes = className.split(" ");
    classes.forEach((cn) => {
      this.#imageElement.classList.remove(cn.trim());
    });
    return this;
  }
  /**
   * Set the bounds where the image should be displayed
   *
   * @param {LatLngBoundsValue} bounds The bounds where the image should be displayed
   * @returns {ImageOverlay}
   */
  setBounds(bounds) {
    this.bounds = bounds;
    return this;
  }
  /**
   * Update bounds from resize
   *
   * @protected
   * @param {LatLng} neLatLng The new lat/lng position for the northeast corner
   * @param {LatLng} swLatLng The new lat/lng position for the southwest corner
   */
  setBoundsFromResize(neLatLng, swLatLng) {
    this.#bounds = new LatLngBounds({
      ne: neLatLng,
      sw: swLatLng
    });
  }
  /**
   * Set the class name(s) for the image element
   *
   * If you need multiple class names then separate them with a space.
   *
   * @param {string} className The class name(s) to add to the image element.
   *    This can be a space separated list of class names.
   * @returns {Overlay}
   */
  setClassName(className) {
    this.className = className;
    return this;
  }
  /**
   * Set the image URL
   *
   * @param {string} imageUrl The image URL to display
   * @returns {ImageOverlay}
   */
  setImageUrl(imageUrl) {
    this.imageUrl = imageUrl;
    return this;
  }
  /**
   * Set the opacity of the image
   *
   * @param {number} opacity The opacity value (0.0 to 1.0)
   * @returns {ImageOverlay}
   */
  setOpacity(opacity) {
    this.opacity = opacity;
    return this;
  }
  /**
   * Sets the options for the image overlay
   *
   * @param {ImageOverlayOptions} options ImageOverlay options
   * @returns {ImageOverlay}
   */
  setOptions(options) {
    if (options.bounds) {
      this.bounds = options.bounds;
    }
    if (isBoolean(options.debug) && options.debug) {
      super.style("background-color", "#ff000080");
      super.style("outline", "2px solid #ff0000");
    }
    if (options.className) {
      this.setClassName(options.className);
    }
    if (isBoolean(options.drag)) {
      this.drag = options.drag;
    }
    if (options.imageUrl) {
      this.imageUrl = options.imageUrl;
    }
    if (options.opacity !== void 0) {
      this.opacity = options.opacity;
    }
    if (isBoolean(options.resize)) {
      this.resize = options.resize;
    }
    if (options.rotation !== void 0) {
      this.rotation = options.rotation;
    }
    if (options.rotate !== void 0) {
      this.rotate = options.rotate;
    }
    if (options.styles) {
      this.styles = options.styles;
    }
    if (options.map) {
      this.setMap(options.map);
    }
    return this;
  }
  /**
   * Set the rotation angle in degrees
   *
   * @param {number} rotation The rotation angle in degrees (0 to 360)
   * @returns {ImageOverlay}
   */
  setRotation(rotation) {
    this.rotation = rotation;
    return this;
  }
  /**
   * Set one more styles for the image overlay element. This will merge styles with an existing ones.
   *
   * @param {object} styles The styles to apply to the overlay element
   * @returns {Overlay}
   */
  setStyles(styles) {
    this.styles = styles;
    return this;
  }
  /**
   * Set a single style on the image element
   *
   * @param {string} name The style name
   * @param {string} value The style value
   * @returns {Overlay}
   */
  style(name, value) {
    if (isString(name) && isString(value)) {
      this.#styles[name] = value;
      this.#imageElement.style[name] = value;
    }
    return this;
  }
  /**
   * Toggle the display of the image overlay on the map
   *
   * @param {Map} map The map object
   * @returns {void}
   */
  toggle(map2) {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show(map2);
    }
  }
  /**
   * Override the updateBoundsFromPosition method to handle dragging
   *
   * @protected
   */
  updateBoundsFromPosition() {
    if (!this.#bounds) return;
    const projection = this.getProjection();
    if (!projection) return;
    const overlayRect = this.getOverlayElement().getBoundingClientRect();
    const mapDiv = this.getMap()?.getDiv();
    if (!mapDiv) return;
    const mapRect = mapDiv.getBoundingClientRect();
    const overlayLeft = overlayRect.left - mapRect.left;
    const overlayTop = overlayRect.top - mapRect.top;
    const nePixel = point(overlayLeft + overlayRect.width, overlayTop);
    const swPixel = point(overlayLeft, overlayTop + overlayRect.height);
    const neLatLng = this.getContainerLatLngFromPixel(nePixel.getX(), nePixel.getY());
    const swLatLng = this.getContainerLatLngFromPixel(swPixel.getX(), swPixel.getY());
    this.#bounds = new LatLngBounds({
      ne: neLatLng,
      sw: swLatLng
    });
  }
  /**
   * Override the updateBoundsFromResize method to handle resizing
   *
   * @protected
   * @param {LatLng} newLatLng The new lat/lng position
   */
  updateBoundsFromResize(newLatLng) {
    if (!this.#bounds || !this.resizeStart) return;
    let newNe = this.resizeStart.neBounds;
    let newSw = this.resizeStart.swBounds;
    switch (this.resizeCorner) {
      case "nw":
        newNe = latLng(newLatLng.latitude, newNe.longitude);
        newSw = latLng(newSw.latitude, newLatLng.longitude);
        break;
      case "ne":
        newNe = latLng(newLatLng.latitude, newLatLng.longitude);
        newSw = latLng(newSw.latitude, newSw.longitude);
        break;
      case "sw":
        newNe = latLng(newNe.latitude, newNe.longitude);
        newSw = latLng(newLatLng.latitude, newLatLng.longitude);
        break;
      case "se":
        newNe = latLng(newNe.latitude, newLatLng.longitude);
        newSw = latLng(newLatLng.latitude, newSw.longitude);
        break;
      default:
        break;
    }
    const north = Math.max(newNe.latitude, newSw.latitude);
    const south = Math.min(newNe.latitude, newSw.latitude);
    const east = Math.max(newNe.longitude, newSw.longitude);
    const west = Math.min(newNe.longitude, newSw.longitude);
    this.#bounds = new LatLngBounds({
      ne: latLng(north, east),
      sw: latLng(south, west)
    });
  }
  /**
   * Perform the fit to image operation
   *
   * @private
   */
  #performFitToImage() {
    const imageWidth = this.#imageElement.naturalWidth;
    const imageHeight = this.#imageElement.naturalHeight;
    if (imageWidth === 0 || imageHeight === 0) {
      console.warn("Image dimensions are not available");
      return;
    }
    const aspectRatio = imageWidth / imageHeight;
    const overlayElement = this.getOverlayElement();
    const containerRect = overlayElement.getBoundingClientRect();
    const { width: newContainerWidth, height: newContainerHeight } = calculateDimensions(
      aspectRatio,
      containerRect.width,
      containerRect.height
    );
    super.style("width", `${newContainerWidth}px`);
    super.style("height", `${newContainerHeight}px`);
    const leftDelta = (containerRect.width - newContainerWidth) / 2;
    const topDelta = (containerRect.height - newContainerHeight) / 2;
    const currentLeft = parseInt(overlayElement.style.left, 10) || 0;
    const currentTop = parseInt(overlayElement.style.top, 10) || 0;
    super.style("left", `${currentLeft + leftDelta}px`);
    super.style("top", `${currentTop + topDelta}px`);
    this.setResizeAspectRatio(aspectRatio);
    const mapDiv = this.getMap()?.getDiv();
    if (!mapDiv) return;
    const newContainerRect = overlayElement.getBoundingClientRect();
    const mapContainerRect = mapDiv.getBoundingClientRect();
    const nePos = {
      x: newContainerRect.right - mapContainerRect.left,
      y: newContainerRect.top - mapContainerRect.top
    };
    const swPos = {
      x: newContainerRect.left - mapContainerRect.left,
      y: newContainerRect.bottom - mapContainerRect.top
    };
    const neLatLng = this.getContainerLatLngFromPixel(nePos.x, nePos.y);
    const swLatLng = this.getContainerLatLngFromPixel(swPos.x, swPos.y);
    this.bounds = new LatLngBounds({
      ne: neLatLng,
      sw: swLatLng
    });
  }
  /**
   * Update the image rotation transform
   *
   * @private
   */
  #updateImageRotation() {
    if (this.#rotationContainer) {
      this.#rotationContainer.style.transform = `rotate(${this.#rotation}deg)`;
    } else {
      if (this.#rotation !== 0) {
        this.style("transform", `rotate(${this.#rotation}deg)`);
      } else {
        this.style("transform", "");
      }
    }
  }
  /**
   * Set up rotation event handlers
   *
   * @private
   */
  #setupRotationHandlers() {
    if (this.rotate) {
      this.#createRotationContainer();
      this.#createRotationHandle();
    } else {
      this.#removeRotationHandle();
      this.#removeRotationContainer();
    }
  }
  /**
   * Create rotation container
   *
   * @private
   */
  #createRotationContainer() {
    this.#removeRotationContainer();
    this.#rotationContainer = document.createElement("div");
    this.#rotationContainer.className = "rotation-container";
    this.#rotationContainer.style.cssText = `
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: rotate(${this.#rotation}deg);
        `;
    this.style("transform", "");
    if (this.#imageElement.parentNode) {
      this.#imageElement.parentNode.insertBefore(this.#rotationContainer, this.#imageElement);
    }
    this.#rotationContainer.appendChild(this.#imageElement);
    this.#updateImageRotation();
  }
  /**
   * Remove rotation container
   *
   * @private
   */
  #removeRotationContainer() {
    if (this.#rotationContainer) {
      this.getOverlayElement().appendChild(this.#imageElement);
      if (this.#rotationContainer.parentNode) {
        this.#rotationContainer.parentNode.removeChild(this.#rotationContainer);
      }
      this.#rotationContainer = null;
    }
  }
  /**
   * Create rotation handle
   *
   * @private
   */
  #createRotationHandle() {
    this.#removeRotationHandle();
    this.#rotationHandle = document.createElement("div");
    this.#rotationHandle.className = "rotation-handle";
    this.#rotationHandle.style.cssText = `
            position: absolute;
            top: -40px;
            left: 50%;
            transform: translateX(-50%);
            width: 4px;
            height: 40px;
            background: #007bff;
            border-radius: 2px;
            cursor: grab;
            z-index: 1001;
            pointer-events: auto;
        `;
    const handleCircle = document.createElement("div");
    handleCircle.style.cssText = `
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 16px;
            height: 16px;
            background: #007bff;
            border: 2px solid #fff;
            border-radius: 50%;
            cursor: grab;
        `;
    this.#rotationHandle.appendChild(handleCircle);
    this.#rotationHandle.addEventListener("mousedown", this.#handleRotationStart);
    this.#rotationHandle.addEventListener("touchstart", this.#handleRotationStart);
    if (checkForGoogleMaps("ImageOverlay", "OverlayView", false)) {
      google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.#rotationHandle);
    }
    const parentElement = this.#rotationContainer || this.getOverlayElement();
    parentElement.appendChild(this.#rotationHandle);
  }
  /**
   * Remove rotation handle
   *
   * @private
   */
  #removeRotationHandle() {
    if (this.#rotationHandle && this.#rotationHandle.parentNode) {
      this.#rotationHandle.parentNode.removeChild(this.#rotationHandle);
      this.#rotationHandle = null;
    }
  }
  /**
   * Handle rotation start
   *
   * @private
   * @param {MouseEvent | TouchEvent} e The event
   */
  #handleRotationStart = (e) => {
    if (!this.rotate || this.#isRotating) return;
    e.preventDefault();
    e.stopPropagation();
    this.#isRotating = true;
    const overlayRect = this.getOverlayElement().getBoundingClientRect();
    this.#rotationCenter = point(
      overlayRect.left + overlayRect.width / 2,
      overlayRect.top + overlayRect.height / 2
    );
    document.addEventListener("mousemove", this.#handleRotation);
    document.addEventListener("mouseup", this.#handleRotationEnd);
    document.addEventListener("touchmove", this.#handleRotation);
    document.addEventListener("touchend", this.#handleRotationEnd);
    this.dispatch(ImageOverlayEvents.ROTATE_START, { event: e });
  };
  /**
   * Handle rotation
   *
   * @private
   * @param {MouseEvent | TouchEvent} e The event
   */
  #handleRotation = (e) => {
    if (!this.#isRotating) return;
    e.preventDefault();
    const currentPos = point(
      e instanceof MouseEvent ? [e.clientX, e.clientY] : [e.touches[0].clientX, e.touches[0].clientY]
    );
    const deltaX = currentPos.getX() - this.#rotationCenter.getX();
    const deltaY = currentPos.getY() - this.#rotationCenter.getY();
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    let newRotation = (angle + 90) % 360;
    if (newRotation < 0) newRotation += 360;
    this.#rotation = newRotation;
    this.#updateImageRotation();
    this.dispatch(ImageOverlayEvents.ROTATE, { event: e, angle: newRotation });
  };
  /**
   * Handle rotation end
   *
   * @private
   * @param {MouseEvent | TouchEvent} e The event
   */
  #handleRotationEnd = (e) => {
    if (!this.#isRotating) return;
    this.#isRotating = false;
    document.removeEventListener("mousemove", this.#handleRotation);
    document.removeEventListener("mouseup", this.#handleRotationEnd);
    document.removeEventListener("touchmove", this.#handleRotation);
    document.removeEventListener("touchend", this.#handleRotationEnd);
    this.dispatch(ImageOverlayEvents.ROTATE_END, { event: e, angle: this.#rotation });
  };
  /**
   * Add the overlay to the element. Called once after setMap() is called on the overlay with a valid map.
   *
   * @internal
   * @param {google.maps.MapPanes} panes The Google maps panes object
   */
  add(panes) {
    if (this.rotate) {
      this.#setupRotationHandlers();
    }
    if (this.#rotationContainer) {
      this.getOverlayElement().appendChild(this.#rotationContainer);
    } else {
      this.getOverlayElement().appendChild(this.#imageElement);
    }
    if (this.resize || this.drag || this.rotate) {
      panes.floatPane.appendChild(this.getOverlayElement());
    } else {
      panes.overlayLayer.appendChild(this.getOverlayElement());
    }
  }
  /**
   * Draw the overlay. Called when the overlay is being drawn or updated.
   *
   * @internal
   * @param {google.maps.MapCanvasProjection} projection The Google maps projection object
   */
  draw(projection) {
    if (this.#bounds && projection) {
      const ne = this.#bounds.getNorthEast();
      const sw = this.#bounds.getSouthWest();
      if (ne && sw && ne.isValid() && sw.isValid()) {
        const nePixel = projection.fromLatLngToDivPixel(ne.toGoogle());
        const swPixel = projection.fromLatLngToDivPixel(sw.toGoogle());
        if (nePixel && swPixel) {
          const left = swPixel.x;
          const top = nePixel.y;
          const width = nePixel.x - swPixel.x;
          const height = swPixel.y - nePixel.y;
          super.style("left", `${left}px`);
          super.style("top", `${top}px`);
          super.style("width", `${width}px`);
          super.style("height", `${height}px`);
          super.style("display", "block");
        }
      }
    }
  }
};
var imageOverlay = (options, bounds) => {
  if (options instanceof ImageOverlay) {
    return options;
  }
  return new ImageOverlay(options, bounds);
};

// src/lib/PlacesSearchBox.ts
var PlacesSearchBox = class extends Evented {
  /**
   * Holds the reference to the input element
   *
   * @private
   * @type {HTMLInputElement | undefined}
   */
  #input;
  /**
   * Holds the array of places that have been found.
   *
   * This is typically one place and it's the place that the user clicked on.
   *
   * @private
   * @type {google.maps.places.PlaceResult[]}
   */
  #places = [];
  /**
   * Holds the map bounds based on the places that have been found
   *
   * @private
   * @type {LatLngBounds | undefined}
   */
  #placesBounds;
  /**
   * Holds the reference to the Google Maps SearchBox object
   *
   * @private
   * @type {google.maps.places.SearchBox | undefined}
   */
  #searchBox;
  /**
   * Holds the promise for setting up the search box.
   *
   * Every call to init() waits on this same promise so that the search box is only built once,
   * however many times init() is called and whenever those calls are made.
   *
   * @private
   * @type {Promise<void>|undefined}
   */
  #initPromise;
  /**
   * Holds the options for the places search box
   *
   * @private
   * @type {GMPlacesSearchBoxOptions}
   */
  #options = {};
  /**
   * Constructor
   *
   * @param {string | HTMLInputElement | PlacesSearchBoxOptions} [input] The input reference or the options
   * @param {PlacesSearchBoxOptions} [options] The places search box options if the input is reference to the input element
   */
  constructor(input, options) {
    super("placesSearchBox", "places");
    if (input instanceof HTMLInputElement) {
      this.#input = input;
      if (options) {
        this.setOptions(options);
      }
    } else if (isString(input)) {
      this.#input = document.querySelector(input) ?? void 0;
      if (!this.#input) {
        throw new Error(`The input element with the selector "${input}" was not found.`);
      }
      if (options) {
        this.setOptions(options);
      }
    } else if (isObjectWithValues(input)) {
      this.setOptions(input);
    }
  }
  /**
   * Get the bounds to which query predictions are biased.
   *
   * @returns {LatLngBounds | undefined}
   */
  get bounds() {
    return this.#options.bounds ?? void 0;
  }
  /**
   * Sets the region to use for biasing query predictions.
   *
   * Results will only be biased towards this area and not be completely restricted to it.
   *
   * @param {LatLngBoundsValue} value The bounds to set
   */
  set bounds(value) {
    const boundsValue = latLngBounds(value);
    this.#options.bounds = boundsValue;
    const searchBox = this.#searchBox;
    if (searchBox) {
      boundsValue.toGoogle().then((bounds) => {
        searchBox.setBounds(bounds);
      });
    }
  }
  /**
   * Get the input reference
   *
   * @returns {HTMLInputElement | undefined}
   */
  get input() {
    return this.#input;
  }
  /**
   * Set the input reference
   *
   * @param {string | HTMLInputElement} value The input HTMLInputElement or the selector for the input element
   */
  set input(value) {
    if (value instanceof HTMLInputElement) {
      this.#input = value;
    } else if (isString(value)) {
      this.#input = document.querySelector(value) ?? void 0;
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
  getBounds() {
    return this.bounds;
  }
  /**
   * Gets the first place that has been found
   *
   * The results from the places_changed event is typically one place and it's the place that the user clicked on.
   *
   * @returns {google.maps.places.PlaceResult | undefined}
   */
  getPlace() {
    return this.#places[0];
  }
  /**
   * Get the places that have been found
   *
   * This is typically one place and it's the place that the user clicked on.
   *
   * @returns {google.maps.places.PlaceResult[]}
   */
  getPlaces() {
    return this.#places;
  }
  /**
   * Get the map bounds based on the places that have been found.
   *
   * @returns {LatLngBounds|undefined}
   */
  getPlacesBounds() {
    return this.#placesBounds;
  }
  /**
   * Initialize the places search box object
   *
   * This must be called in order for the places search box to work.
   *
   * @returns {Promise<void>}
   */
  async init() {
    if (!this.#initPromise) {
      const initPromise = new Promise((resolve, reject) => {
        if (checkForGoogleMaps("PlacesSearchBox", "places", false)) {
          this.#createPlacesSearchBox().then(resolve).catch(reject);
        } else {
          loader().onMapLoad(() => {
            this.#createPlacesSearchBox().then(resolve).catch(reject);
          });
        }
      });
      const tracked = initPromise.catch((error) => {
        if (this.#initPromise === tracked) {
          this.#initPromise = void 0;
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
  #createPlacesSearchBox = async () => {
    if (!this.#searchBox) {
      const options = {};
      if (this.#options.bounds) {
        options.bounds = await this.#options.bounds.toGoogle();
      }
      if (!this.#input) {
        throw new Error("The input element must be set before the places search box can be initialized.");
      }
      const searchBox = new google.maps.places.SearchBox(this.#input, options);
      this.#searchBox = searchBox;
      searchBox.addListener(PlacesSearchBoxEvents.PLACES_CHANGED, () => {
        const found = searchBox.getPlaces();
        const places = Array.isArray(found) ? found : [];
        const bounds = latLngBounds();
        places.forEach((place) => {
          if (place.geometry) {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport);
            } else if (place.geometry.location) {
              bounds.extend(latLng(place.geometry.location));
            }
          }
        });
        this.#places = places;
        this.#placesBounds = bounds;
        this.dispatch(PlacesSearchBoxEvents.PLACES_CHANGED, { places, bounds });
      });
    }
  };
  /**
   * Returns whether the places search box object has been initialized
   *
   * @returns {boolean}
   */
  isInitialized() {
    return isObject(this.#searchBox);
  }
  /**
   * @inheritdoc
   */
  hasListener(type, callback) {
    return super.hasListener(type, callback);
  }
  /**
   * @inheritdoc
   */
  off(type, callback, options) {
    super.off(type, callback, options);
  }
  /**
   * @inheritdoc
   */
  on(type, callback, config) {
    super.on(type, callback, config);
  }
  /**
   * @inheritdoc
   */
  onImmediate(type, callback, config) {
    super.onImmediate(type, callback, config);
  }
  /**
   * Listen for the place changed event
   *
   * @example
   * placesSearchBox.onPlacesChanged((places, bounds) => {
   *    console.log('Places: ', places);
   *   console.log('Bounds: ', bounds);
   * });
   * @param {(place: google.maps.places.PlaceResult, bounds: LatLngBounds) => void} callback The callback function
   * @returns {void}
   */
  onPlacesChanged(callback) {
    this.on(PlacesSearchBoxEvents.PLACES_CHANGED, (data) => {
      callback(data.places, data.bounds);
    });
  }
  /**
   * @inheritdoc
   */
  once(type, callback, config) {
    super.once(type, callback, config);
  }
  /**
   * @inheritdoc
   */
  onceImmediate(type, callback, config) {
    super.onceImmediate(type, callback, config);
  }
  /**
   * @inheritdoc
   */
  only(type, callback, config) {
    super.only(type, callback, config);
  }
  /**
   * @inheritdoc
   */
  onlyOnce(type, callback, config) {
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
  setBounds(value) {
    this.bounds = value;
    return this;
  }
  /**
   * Set the input reference
   *
   * @param {string|HTMLInputElement} input The input HTMLInputElement or the selector for the input element
   * @returns {PlacesSearchBox}
   */
  setInput(input) {
    this.input = input;
    return this;
  }
  /**
   * Set the places search box options
   *
   * @param {PlacesSearchBoxOptions} options The options to set
   * @returns {PlacesSearchBox}
   */
  setOptions(options) {
    if (isObjectWithValues(options)) {
      if (options.bounds) {
        this.bounds = options.bounds;
      }
      if (typeof options.input !== "undefined") {
        if (options.input instanceof HTMLInputElement) {
          this.#input = options.input;
        } else if (isString(options.input)) {
          this.#input = document.querySelector(options.input) ?? void 0;
          if (!this.#input) {
            throw new Error(`The input element with the selector "${options.input}" was not found.`);
          }
        }
      }
    }
    return this;
  }
};
var placesSearchBox = (input, options) => {
  if (input instanceof PlacesSearchBox) {
    return input;
  }
  return new PlacesSearchBox(input, options);
};

// src/lib/PolylineCollection.ts
var defaultTag2 = "__default__";
var PolylineCollection = class _PolylineCollection {
  constructor() {
    /**
     * Holds the Polyline objects by tag
     */
    this.polylines = {};
  }
  /**
   * Adds an Polyline to the collection
   *
   * @param {Polyline} p The Polyline object to add
   * @param {string} tag The tag to assign the polyline to.
   */
  #add(p, tag) {
    if (!this.polylines[tag]) {
      this.polylines[tag] = /* @__PURE__ */ new Set();
    }
    this.polylines[tag].add(p);
  }
  /**
   * Adds an Polyline to the collection
   *
   * @param {Polyline} p The Polyline object to add
   * @param {string|string[]} [tag] The tag(s) to assign the polyline to. Either a single tag or an array of tags can be passed.
   */
  add(p, tag) {
    if (isString(tag)) {
      this.#add(p, tag);
    } else if (Array.isArray(tag) && tag.length > 0) {
      tag.forEach((t) => {
        if (isString(t)) {
          this.#add(p, t);
        }
      });
    } else {
      this.#add(p, defaultTag2);
    }
  }
  /**
   * Clears the collection
   *
   * This also hides all the polylines in the collection.
   */
  clear() {
    Object.keys(this.polylines).forEach((tag) => {
      this.polylines[tag].forEach((p) => {
        p.setMap(null);
      });
    });
    this.polylines = {};
  }
  /**
   * Clones the collection
   *
   * @returns {PolylineCollection}
   */
  clone() {
    const clone = new _PolylineCollection();
    Object.keys(this.polylines).forEach((tag) => {
      this.polylines[tag].forEach((p) => {
        clone.add(p, tag);
      });
    });
    return clone;
  }
  /**
   * Returns true if the collection has any polylines
   *
   * @returns {boolean}
   */
  hasData() {
    return Object.keys(this.polylines).length > 0;
  }
  /**
   * Hide the Polylines in the collection that have the tag passed
   *
   * @param {string} tag The tag to hide polylines for.
   */
  #hide(tag) {
    if (this.polylines[tag]) {
      this.polylines[tag].forEach((p) => {
        p.hide();
      });
    }
  }
  /**
   * Hide the Polylines in the collection that have the tag(s) passed
   *
   * @param {string|string[]} tag The tag(s) to hide polylines for. Either a single tag string or an array of tag strings can be passed.
   */
  hide(tag) {
    if (isString(tag)) {
      this.#hide(tag);
    } else if (Array.isArray(tag)) {
      tag.forEach((t) => {
        if (isString(t)) {
          this.#hide(t);
        }
      });
    }
  }
  /**
   * Hides all the Polylines in the collection
   */
  hideAll() {
    Object.keys(this.polylines).forEach((tag) => {
      this.polylines[tag].forEach((p) => {
        p.hide();
      });
    });
  }
  /**
   * Highlight the Polylines in the collection that have the tag(s) passed
   *
   * @param {string} tag The tag to highlight polylines for.
   * @param {PolylineOptions} [highlightOptions] The options to use for highlighting the polylines. This will override the current options for the highlight polyline.
   */
  #highlight(tag, highlightOptions) {
    if (this.polylines[tag]) {
      this.polylines[tag].forEach((p) => {
        p.highlight(highlightOptions);
      });
    }
  }
  /**
   * Highlight the Polylines in the collection that have the tag(s) passed
   *
   * You can override the current highlight options by passing in the highlightOptions parameter.
   * This allows you to override one or more of the following options:
   * - clickable
   * - dashed
   * - dashGap
   * - icons
   * - strokeColor
   * - strokeOpacity
   * - strokeWeight
   * - zIndex
   *
   * When the polyline is unhighlighted, the original options will be restored.
   *
   * @param {string|string[]} tag The tag(s) to highlight polylines for. Either a single tag string or an array of tag strings can be passed.
   * @param {PolylineOptions} [highlightOptions] The options to use for highlighting the polylines. This will override the current options for the highlight polyline.
   */
  highlight(tag, highlightOptions) {
    if (isString(tag)) {
      this.#highlight(tag, highlightOptions);
    } else if (Array.isArray(tag)) {
      tag.forEach((t) => {
        if (isString(t)) {
          this.#highlight(t, highlightOptions);
        }
      });
    }
  }
  /**
   * Highlight all the Polylines in the collection
   */
  highlightAll() {
    Object.keys(this.polylines).forEach((tag) => {
      this.polylines[tag].forEach((p) => {
        p.highlight();
      });
    });
  }
  /**
   * Returns true if the collection has no polylines
   *
   * @returns {boolean}
   */
  isEmpty() {
    return Object.keys(this.polylines).length === 0;
  }
  /**
   * Remove the polyline from the collection by tag.
   *
   * @param {Polyline} p The polyline object to remove
   * @param {string} tag The tag to remove the polyline from.
   */
  #removeByTag(p, tag) {
    if (this.polylines[tag]) {
      this.polylines[tag].delete(p);
    }
  }
  /**
   * Remove the polyline from the collection, optionally by tag.
   *
   * @param {Polyline} p The polyline object to remove
   * @param {string|string[]} [tag] The tag(s) to remove the polyline from. If not set then the polyline is removed from all tags.
   *      Either a single tag string or an array of tag strings can be passed.
   */
  remove(p, tag) {
    if (isString(tag)) {
      this.#removeByTag(p, tag);
    } else if (Array.isArray(tag) && tag.length > 0) {
      tag.forEach((t) => {
        if (isString(t)) {
          this.#removeByTag(p, t);
        }
      });
    } else {
      Object.keys(this.polylines).forEach((t) => {
        this.polylines[t].delete(p);
      });
    }
  }
  /**
   * Set options for the Polylines in the collection that have the tag(s) passed
   *
   * @param {PolylineOptions} options The options to set for the polylines.
   * @param {string} tag The tag to show polylines for.
   */
  #setOptions(options, tag) {
    if (this.polylines[tag]) {
      this.polylines[tag].forEach((p) => {
        p.setOptions(options);
      });
    }
  }
  /**
   * Set options for either all polylines in the collection or for the polylines that have the tag(s) passed.
   *
   * @param {PolylineOptions} options The options to set for the polylines.
   * @param {string|string[]} [tag] The tag(s) to show polylines for. Either a single tag string or an array of tag strings can be passed.
   */
  setOptions(options, tag) {
    if (isString(tag)) {
      this.#setOptions(options, tag);
    } else if (Array.isArray(tag)) {
      tag.forEach((t) => {
        if (isString(t)) {
          this.#setOptions(options, t);
        }
      });
    } else {
      Object.keys(this.polylines).forEach((t) => {
        this.polylines[t].forEach((p) => {
          p.setOptions(options);
        });
      });
    }
  }
  /**
   * Show the Polylines in the collection that have the tag(s) passed
   *
   * @param {string} tag The tag to show polylines for.
   * @param {Map} [map] The map object
   */
  #show(tag, map2) {
    if (this.polylines[tag]) {
      this.polylines[tag].forEach((p) => {
        p.show(map2);
      });
    }
  }
  /**
   * Show the Polylines in the collection that have the tag(s) passed
   *
   * @param {string|string[]} tag The tag(s) to show polylines for. Either a single tag string or an array of tag strings can be passed.
   * @param {Map} [map] The map object
   */
  show(tag, map2) {
    if (isString(tag)) {
      this.#show(tag, map2);
    } else if (Array.isArray(tag)) {
      tag.forEach((t) => {
        if (isString(t)) {
          this.#show(t, map2);
        }
      });
    }
  }
  /**
   * Show all the Polylines in the collection
   *
   * @param {Map} [map] The map object
   */
  showAll(map2) {
    Object.keys(this.polylines).forEach((tag) => {
      this.polylines[tag].forEach((p) => {
        p.show(map2);
      });
    });
  }
  /**
   * Hide the hightlight for the Polylines in the collection that have the tag(s) passed
   *
   * @param {string} tag The tag to hide the highlighted polylines.
   */
  #unhighlight(tag) {
    if (this.polylines[tag]) {
      this.polylines[tag].forEach((p) => {
        p.unhighlight();
      });
    }
  }
  /**
   * Hide the hightlight for the Polylines in the collection that have the tag(s) passed
   *
   * @param {string|string[]} tag The tag(s) to hide the highlighted polylines. Either a single tag string or an array of tag strings can be passed.
   */
  unhighlight(tag) {
    if (isString(tag)) {
      this.#unhighlight(tag);
    } else if (Array.isArray(tag)) {
      tag.forEach((t) => {
        if (isString(t)) {
          this.#unhighlight(t);
        }
      });
    }
  }
  /**
   * Hide the hightlight for all the Polylines in the collection
   */
  unhighlightAll() {
    Object.keys(this.polylines).forEach((tag) => {
      this.polylines[tag].forEach((p) => {
        p.unhighlight();
      });
    });
  }
};
var polylineCollection = () => new PolylineCollection();

export {
  Result_default,
  Results_default,
  Geocode,
  geocode,
  AutocompleteSearchBox,
  autocompleteSearchBox,
  MarkerCluster,
  markerCluster,
  MarkerCollection,
  markerCollection,
  ImageOverlay,
  imageOverlay,
  PlacesSearchBox,
  placesSearchBox,
  PolylineCollection,
  polylineCollection
};
