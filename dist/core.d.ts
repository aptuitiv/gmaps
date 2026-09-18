import { B as Base, L as LatLngBounds, a as LatLng, b as LatLngBoundsValue, c as LatLngValue, E as Evented, d as Event, e as EventListenerOptions, f as EventConfig, g as Layer, P as Point, I as Icon, S as SvgSymbol, M as Map, h as PointValue, i as IconValue, j as SvgSymbolValue, T as TooltipValue, k as EventCallback, l as SizeValue, O as Overlay, m as EventListenerData } from './tooltip-DcYsmJ4-.js';
export { at as AutocompleteSearchBoxEvents, au as ControlPosition, av as ControlPositionValue, D as DataFeature, n as DataFeatureValue, p as DataLayer, q as DataLayerEventCallback, r as DataLayerEventObject, ax as DataLayerEvents, s as DataLayerOptions, t as DataLayerValue, u as DataStyleOptions, v as DataStyleValue, w as FeatureOptions, F as FeatureProperties, U as FullscreenControl, V as FullscreenControlOptions, aA as GeocoderErrorStatus, aB as GeocoderErrorStatusValue, aC as GeocoderLocationType, aD as GeocoderLocationTypeValue, ay as GeometryType, az as GeometryTypeValue, as as INTERNAL_EVENTS, z as IconOptions, aE as ImageOverlayEvents, aF as InfoWindowEvents, J as LatLngBoundsEdges, K as LatLngBoundsLiteral, C as LatLngLiteral, G as LatLngLiteralExpanded, aG as LayerEvents, x as LoadOptions, aH as LoaderEvents, ag as LocateOptions, af as LocationOnSuccess, ah as LocationPosition, aI as MapEvents, ai as MapOptions, X as MapRestriction, Y as MapRestrictionOptions, _ as MapStyle, $ as MapStyleOptions, Q as MapType, a1 as MapTypeControl, a2 as MapTypeControlOptions, aJ as MapTypeControlStyle, aK as MapTypeControlStyleValue, aM as MapTypeId, aN as MapTypeIdValue, aO as MarkerEvents, aP as OverlayEvents, aQ as PlacesSearchBoxEvents, al as PointObject, aR as PolylineEvents, aS as PopupEvents, ar as READY_EVENT, aT as RenderingType, aU as RenderingTypeValue, a4 as RotateControl, a5 as RotateControlOptions, a7 as ScaleControl, a8 as ScaleControlOptions, an as Size, ao as SizeObject, aa as StreetViewControl, ab as StreetViewControlOptions, aV as StreetViewSource, aW as StreetViewSourceValue, aq as SvgSymbolOptions, aX as SymbolPath, aY as SymbolPathValue, ad as ZoomControl, ae as ZoomControlOptions, aw as convertControlPosition, aL as convertMapTypeControlStyle, aZ as convertSymbolPath, o as dataLayer, R as fullscreenControl, y as icon, A as latLng, H as latLngBounds, N as map, W as mapRestriction, Z as mapStyle, a0 as mapTypeControl, aj as overlay, ak as point, a3 as rotateControl, a6 as scaleControl, am as size, a9 as streetViewControl, ap as svgSymbol, ac as zoomControl } from './tooltip-DcYsmJ4-.js';
import { Libraries } from '@googlemaps/js-api-loader';
import { Algorithm, SuperClusterOptions, onClusterClickHandler, Renderer } from '@googlemaps/markerclusterer';

declare class GeocodeAddressTypes {
    #private;
    /**
     * Constructor
     *
     * @param {string[]} [types] The types for the address
     */
    constructor(types?: string[]);
    /**
     * Gets the address types
     *
     * @returns {string[]}
     */
    getTypes(): string[];
    /**
     * Returns if the address is an administrative area level 1.
     *
     * This is the highest level of administrative area below the country level.
     * In the United States, these administrative levels are states.
     *
     * @returns {boolean}
     */
    isAdministrativeAreaLevel1(): boolean;
    /**
     * Returns if the address is an administrative area level 2.
     *
     * Within the United States this would be a county.
     *
     * @returns {boolean}
     */
    isAdministrativeAreaLevel2(): boolean;
    /**
     * Returns if the address is an administrative area level 3.
     *
     * This is a minor civil division.
     *
     * @returns {boolean}
     */
    isAdministrativeAreaLevel3(): boolean;
    /**
     * Returns if the address is an administrative area level 4.
     *
     * This is a minor civil division.
     *
     * @returns {boolean}
     */
    isAdministrativeAreaLevel4(): boolean;
    /**
     * Returns if the address is an administrative area level 5.
     *
     * This is a minor civil division.
     *
     * @returns {boolean}
     */
    isAdministrativeAreaLevel5(): boolean;
    /**
     * Returns if the address is an administrative area level 6.
     *
     * This is a minor civil division.
     *
     * @returns {boolean}
     */
    isAdministrativeAreaLevel6(): boolean;
    /**
     * Returns if the address is an administrative area level 7.
     *
     * This is a minor civil division.
     *
     * @returns {boolean}
     */
    isAdministrativeAreaLevel7(): boolean;
    /**
     * Returns if the address is an airport.
     *
     * @returns {boolean}
     */
    isAirport(): boolean;
    /**
     * Returns if the address is a bus station or bus stop.
     *
     * @returns {boolean}
     */
    isBusStation(): boolean;
    /**
     * Returns if the address is a city.
     *
     * This is an alias for isLocality()
     *
     * @returns {boolean}
     */
    isCity(): boolean;
    /**
     * Returns if the address is a commonly used alternative name for the entity.
     *
     * @returns {boolean}
     */
    isColloquialArea(): boolean;
    /**
     * Returns if the address is a country.
     *
     * @returns {boolean}
     */
    isCountry(): boolean;
    /**
     * Returns if the address is a county.
     *
     * This is an alias for isAdministrativeAreaLevel2()
     *
     * @returns {boolean}
     */
    isCounty(): boolean;
    /**
     * Returns if the address is a place that hasn't yet been categorized.
     *
     * @returns {boolean}
     */
    isEstablishment(): boolean;
    /**
     * Returns if the address is a floor in a building.
     *
     * @returns {boolean}
     */
    isFloor(): boolean;
    /**
     * Returns if the address is a major intersection, usually of two major roads.
     *
     * @returns {boolean}
     */
    isIntersection(): boolean;
    /**
     * Returns if the address is a landmark.
     *
     * @returns {boolean}
     */
    isLandmark(): boolean;
    /**
     * Returns if the address is a locality.
     *
     * @returns {boolean}
     */
    isLocality(): boolean;
    /**
     * Returns if the address is a prominent natural feature.
     *
     * @returns {boolean}
     */
    isNaturalFeature(): boolean;
    /**
     * Returns if the address is a neighborhood.
     *
     * @returns {boolean}
     */
    isNeighborhood(): boolean;
    /**
     * Returns if the address is a plus code.
     *
     * See https://plus.codes/ for more information.
     *
     * @returns {boolean}
     */
    isPlusCode(): boolean;
    /**
     * Returns if the address is a named park.
     *
     * @returns {boolean}
     */
    isPark(): boolean;
    /**
     * Returns if the address is a parking lot.
     *
     * @returns {boolean}
     */
    isParking(): boolean;
    /**
     * Returns if the address is a point of interest.
     *
     * @returns {boolean}
     */
    isPointOfInterest(): boolean;
    /**
     * Returns if the address is a political entity. This would usually be some type of civil administration.
     *
     * @returns {boolean}
     */
    isPolitical(): boolean;
    /**
     * Returns if the address is a specific post box.
     *
     * @returns {boolean}
     */
    isPostBox(): boolean;
    /**
     * Returns if the address is a postal code.
     *
     * @returns {boolean}
     */
    isPostalCode(): boolean;
    /**
     * Returns if the address is a grouping of geographic areas.
     *
     * @returns {boolean}
     */
    isPostalTown(): boolean;
    /**
     * Returns if the location is a named location, usually a building or collection of buildings with a common name.
     *
     * @returns {boolean}
     */
    isPremise(): boolean;
    /**
     * Returns if the address is a room of a building.
     *
     * @returns {boolean}
     */
    isRoom(): boolean;
    /**
     * Returns if the address is a named route (such as "US 101").
     *
     * @returns {boolean}
     */
    isRoute(): boolean;
    /**
     * Returns if the address is a state or province.
     *
     * This is an alias for isAdministrativeAreaLevel1()
     *
     * @returns {boolean}
     */
    isState(): boolean;
    /**
     * Returns if the address is a street address
     *
     * @returns {boolean}
     */
    isStreetAddress(): boolean;
    /**
     * Returns if the address indicates a precise street number.
     *
     * @returns {boolean}
     */
    isStreetNumber(): boolean;
    /**
     * Returns if the address is a sublocality.
     *
     * @returns {boolean}
     */
    isSubLocality(): boolean;
    /**
     * Returns if the address is a sublocality level 1.
     *
     * @returns {boolean}
     */
    isSubLocalityLevel1(): boolean;
    /**
     * Returns if the address is a sublocality level 2.
     *
     * @returns {boolean}
     */
    isSubLocalityLevel2(): boolean;
    /**
     * Returns if the address is a sublocality level 3.
     *
     * @returns {boolean}
     */
    isSubLocalityLevel3(): boolean;
    /**
     * Returns if the address is a sublocality level 4.
     *
     * @returns {boolean}
     */
    isSubLocalityLevel4(): boolean;
    /**
     * Returns if the address is a sublocality level 5.
     *
     * @returns {boolean}
     */
    isSubLocalityLevel5(): boolean;
    /**
     * Returns if the location is a subpremise.
     *
     * This is the next level below a premise, usually a single building in a collection of buildings with a common name.
     *
     * @returns {boolean}
     */
    isSubPremise(): boolean;
    /**
     * Returns if the address is a town.
     *
     * This is an alias for isLocality()
     *
     * @returns {boolean}
     */
    isTown(): boolean;
    /**
     * Returns if the address is a train station.
     *
     * @returns {boolean}
     */
    isTrainStation(): boolean;
    /**
     * Returns if the address is a transit station.
     *
     * @returns {boolean}
     */
    isTransitStation(): boolean;
}

/**
 * The geocode address component class
 */
declare class GeocodeAddressComponent extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {google.maps.GeocoderAddressComponent} component The Google Maps GeocoderAddressComponent object
     */
    constructor(component: google.maps.GeocoderAddressComponent);
    /**
     * Gets the full name of the address component
     *
     * @returns {string}
     */
    getLongName(): string;
    /**
     * Gets the abbreviated name of the address component
     *
     * @returns {string}
     */
    getShortName(): string;
    /**
     * Gets the array of types objects for the address component
     *
     * @returns {GeocodeAddressTypes}
     */
    getTypes(): GeocodeAddressTypes;
    /**
     * Gets the array of types for the address component
     *
     * https://developers.google.com/maps/documentation/javascript/geocoding?hl=en#GeocodingAddressTypes
     *
     * @returns {string[]}
     */
    getTypesArray(): string[];
    /**
     * Get the original Google Maps GeocoderAddressComponent object
     *
     * @returns {google.maps.GeocoderAddressComponent}
     */
    toGoogle(): google.maps.GeocoderAddressComponent;
}

/**
 * The geocode result class
 *
 * This is intended to be an internal class and not instantiated directly outside this library.
 * It is used to wrap the Google Maps GeocoderResult object.
 */
declare class GeocodeResult extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {google.maps.GeocoderResult} [result] The Google Maps GeocoderResult object
     */
    constructor(result?: google.maps.GeocoderResult);
    /**
     * Get the address component objects
     *
     * @returns {GeocodeAddressComponent[]}
     */
    getAddressComponents(): GeocodeAddressComponent[];
    /**
     * Get the precise bounds of the result, if available
     *
     * @returns {LatLngBounds|undefined}
     */
    getBounds(): LatLngBounds | undefined;
    /**
     * Get the compound plus code associated with the location
     *
     * @returns {string}
     */
    getCompoundPlusCode(): string;
    /**
     * Gets the formatted address for the location.
     *
     * @returns {string}
     */
    getFormattedAddress(): string;
    /**
     * Get the latitude of the location.
     *
     * This is a shorcut to getting the geometry location latitude.
     *
     * @returns {number|undefined}
     */
    getLatitude(): number | undefined;
    /**
     * Gets the LatLng object for the result
     *
     * @returns {LatLng|undefined}
     */
    getLocation(): LatLng | undefined;
    /**
     * Gets the location type
     *
     * @returns {string}
     */
    getLocationType(): string;
    /**
     * Get the longitude of the location.
     *
     * This is a shorcut to getting the geometry location longitude.
     *
     * @returns {number|undefined}
     */
    getLongitude(): number | undefined;
    /**
     * Get the place id for the location.
     *
     * @returns {string}
     */
    getPlaceId(): string;
    /**
     * Get the plus code associated with the location
     *
     * @returns {string}
     */
    getPlusCode(): string;
    /**
     * Gets the postal code localities for the location.
     *
     * This is only populated when the result is a postal code that contains multiple localities.
     *
     * @returns {string[]}
     */
    getPostalCodeLocalities(): string[];
    /**
     * Gets the types object for the returned geocoded element.
     *
     * https://developers.google.com/maps/documentation/javascript/geocoding?hl=en#GeocodingAddressTypes
     *
     * @returns {GeocodeAddressTypes}
     */
    getTypes(): GeocodeAddressTypes;
    /**
     * Gets the types for the returned geocoded element.
     *
     * https://developers.google.com/maps/documentation/javascript/geocoding?hl=en#GeocodingAddressTypes
     *
     * @returns {string[]}
     */
    getTypesArray(): string[];
    /**
     * Returns if the location is an approximate location.
     *
     * @returns {boolean}
     */
    isLocationApproximate(): boolean;
    /**
     * Returns if the location is a geometic center of a result.
     *
     * @returns {boolean}
     */
    isLocationGeometricCenter(): boolean;
    /**
     * Returns if the location is an approximation interpolated between two precise locations.
     *
     * @returns {boolean}
     */
    isLocationRangeInterpolated(): boolean;
    /**
     * Returns if the location is a rooftop location, which is the most precise location available.
     *
     * @returns {boolean}
     */
    isLocationRooftop(): boolean;
    /**
     * Returns if the location is a partial match for the original request.
     *
     * @returns {boolean}
     */
    isPartialMatch(): boolean;
    /**
     * Get the original Google Maps GeocoderResult object
     *
     * If the result is empty, an empty object is returned.
     *
     * @returns {google.maps.GeocoderResult | object}
     */
    toGoogle(): google.maps.GeocoderResult | object;
}

/**
 * The geocode result class
 *
 * This is intended to be an internal class and not instantiated directly outside this library.
 * It is used to wrap the array of Google Maps GeocoderResult objects and hold them as GeocodeResult objects.
 */
declare class GeocodeResults extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {google.maps.GeocoderResult[]} [results] The Google Maps GeocoderResult objects
     */
    constructor(results?: google.maps.GeocoderResult[]);
    /**
     * Gets the first result
     *
     * @returns {GeocodeResult}
     */
    getFirst(): GeocodeResult;
    /**
     * Returns the results
     *
     * @returns {GeocodeResult[]}
     */
    getResults(): GeocodeResult[];
    /**
     * Returns whether any results were found
     *
     * @returns {boolean}
     */
    hasResults(): boolean;
}

type GeocodeComponentRestrictions = {
    administrativeArea?: string;
    country?: string;
    locality?: string;
    postalCode?: string;
    route?: string;
};
type GeocodeOptions = {
    address?: string;
    bounds?: LatLngBoundsValue;
    cache?: boolean;
    componentRestrictions?: GeocodeComponentRestrictions;
    language?: string;
    location?: LatLngValue;
    placeId?: string;
    region?: string;
};
/**
 * The Geocode class
 */
declare class Geocode extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {GeocodeOptions} [options] The Geocode options
     */
    constructor(options?: GeocodeOptions);
    /**
     * Empty the cache of geocode results.
     *
     * The shared Geocoder is dropped as well, so the next request builds a new one. Call this if
     * the results for an address may have changed.
     */
    static clearCache(): void;
    /**
     * How many results the cache holds before the oldest is dropped
     *
     * @returns {number}
     */
    static get cacheSize(): number;
    /**
     * Set how many results the cache holds. Set it to 0 to turn caching off everywhere.
     *
     * @param {number} size The number of results to hold
     */
    static set cacheSize(size: number);
    /**
     * Returns the address
     *
     * @returns {string|undefined}
     */
    get address(): string | undefined;
    /**
     * Sets the address to geocode
     *
     * @param {string} address The address to geocode
     */
    set address(address: string);
    /**
     * Returns the bounds
     *
     * @returns {LatLngBounds|undefined}
     */
    get bounds(): LatLngBounds | undefined;
    /**
     * Sets the bounds within which to bias geocode results more prominently
     *
     * @param {LatLngBoundsValue} bounds The bounds within which to bias geocode results more prominently
     */
    set bounds(bounds: LatLngBoundsValue);
    /**
     * Get the component restrictions
     *
     * @returns {GeocodeComponentRestrictions|undefined}
     */
    get componentRestrictions(): GeocodeComponentRestrictions | undefined;
    /**
     * Set the component restrictions
     *
     * @param {GeocodeComponentRestrictions} componentRestrictions The component restrictions
     */
    set componentRestrictions(componentRestrictions: GeocodeComponentRestrictions);
    /**
     * Get the language to use for the geocode
     *
     * @returns {string|undefined}
     */
    get language(): string | undefined;
    /**
     * Set the language to use for the geocode
     *
     * See https://developers.google.com/maps/faq#languagesupport for the list of supported languages
     *
     * @param {string} language The language to use for the geocode
     */
    set language(language: string);
    /**
     * Get the location to geocode
     *
     * @returns {LatLng|undefined}
     */
    get location(): LatLng | undefined;
    /**
     * Set the location to geocode
     *
     * @param {LatLngValue} location The location to geocode
     */
    set location(location: LatLngValue);
    /**
     * Get the place id
     *
     * @returns {string|undefined}
     */
    get placeId(): string | undefined;
    /**
     * Set the place id
     *
     * @param {string} placeId The place id
     */
    set placeId(placeId: string);
    /**
     * Get the region code
     *
     * @returns {string|undefined}
     */
    get region(): string | undefined;
    /**
     * Set the region code
     *
     * @param {string} region The region code
     */
    set region(region: string);
    /**
     * Call the Google Maps Geocoder service
     *
     * Alias for the geocode method
     *
     * @param {GeocodeOptions} [options] The Geocode options
     * @returns {Promise<GeocodeResults>}
     */
    fetch(options?: GeocodeOptions): Promise<GeocodeResults>;
    /**
     * Call the Google Maps Geocoder service
     *
     * @param {GeocodeOptions} [options] The Geocode options
     * @returns {Promise<GeocodeResults>}
     */
    geocode(options?: GeocodeOptions): Promise<GeocodeResults>;
    /**
     * Set the address to geocode
     *
     * @param {string} address The address to geocode
     * @returns {Geocode}
     */
    setAddress(address: string): Geocode;
    /**
     * Set the bounds within which to bias geocode results more prominently
     *
     * @param {LatLngBoundsValue} bounds The bounds within which to bias geocode results more prominently
     * @returns {Geocode}
     */
    setBounds(bounds: LatLngBoundsValue): Geocode;
    /**
     * Set the component restrictions
     *
     * @param {GeocodeComponentRestrictions} componentRestrictions The component restrictions
     * @returns {Geocode}
     */
    setComponentRestrictions(componentRestrictions: GeocodeComponentRestrictions): Geocode;
    /**
     * Set the language to use for the geocode
     * See https://developers.google.com/maps/faq#languagesupport for the list of supported languages
     *
     * @param {string} language The language to use for the geocode
     * @returns {Geocode}
     */
    setLanguage(language: string): Geocode;
    /**
     * Set the location to geocode
     *
     * @param {LatLngValue} location The location to geocode
     * @returns {Geocode}
     */
    setLocation(location: LatLngValue): Geocode;
    /**
     * Set the place id
     *
     * @param {string} placeId The place id
     * @returns {Geocode}
     */
    setPlaceId(placeId: string): Geocode;
    /**
     * Set the region code
     *
     * @param {string} region The region code
     * @returns {Geocode}
     */
    setRegion(region: string): Geocode;
    /**
     * Sets the options for the popup
     *
     * @param {GeocodeOptions} options Geocode options
     * @returns {Geocode}
     */
    setOptions(options: GeocodeOptions): Geocode;
}
type GeocodeValue = Geocode | GeocodeOptions;
/**
 * Helper function to set up a new Geocode object value
 *
 * @param {GeocodeValue} [options] The options for the Geocode object
 * @returns {Geocode}
 */
declare const geocode: (options?: GeocodeValue) => Geocode;

/**
 * Returns if the value is boolean
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
declare const isBoolean: (thing: any) => thing is boolean;
/**
 * Tests to see if the value is defined
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
declare const isDefined: <T>(thing: any) => thing is T;
/**
 * Returns if the thing is a function
 *
 * @param {any} thing The thing to test
 * @returns {boolean}
 */
declare const isFunction: (thing: any) => thing is Function;
/**
 * Returns if the value is null.
 *
 * @param {any} thing The thing to test
 * @returns {boolean}
 */
declare const isNull: (thing: any) => thing is null;
/**
 * Returns if the value is a valid number
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
declare const isNumber: (thing: any) => thing is number;
/**
 * Returns if the given value is a string that represents a numerical value
 *   e.g. returns true for `"34"` and false for `"text34"` and `34`
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
declare const isNumberString: (thing: any) => thing is string;
/**
 * Returns if the given value is a number or string that represents a numerical value
 *   e.g. returns true for 34 or "34" and false for "text34" and "text"
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
declare const isNumberOrNumberString: (thing: any) => thing is number | string;
/**
 * Returns if the value is a string
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
declare const isString: (thing: any) => thing is string;
/**
 * Returns if the value is string and has a length greater than 0
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
declare const isStringWithValue: (thing: any) => thing is string;
/**
 * Returns if the value is a valid string or number
 *
 * @param {unknown} thing The value to test against
 * @returns {boolean}
 */
declare const isStringOrNumber: (thing: unknown) => thing is string | number;
/**
 * Returns if the value is undefined
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
declare const isUndefined: (thing: any) => thing is undefined;
/**
 * Returns if the value is null or undefined
 *
 * @param {any} thing The thing to test
 * @returns {boolean}
 */
declare const isNullOrUndefined: (thing: any) => thing is null | undefined;
/**
 * Get the number value for the given thing
 * If the thing is a number, return it
 * If the thing is a string that represents a number, return the number
 * Otherwise, return NaN
 *
 * @param {any} thing The value to convert to a number
 * @returns {number|typeof NaN}
 */
declare const getNumber: (thing: any) => number | typeof NaN;
/**
 * Converts a value to a boolean
 *
 * The following values are considered true:
 * - true (boolean)
 * - 'true' (string)
 * - 'yes'
 * - 1 (number)
 * - '1' (string)
 *
 * @param {any} thing The value to convert to a boolean
 * @returns {boolean}
 */
declare const getBoolean: (thing: any) => boolean;
/**
 * Returns if the value is an object
 *
 * https://attacomsian.com/blog/javascript-check-variable-is-object
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
declare const isObject: <T = object>(thing: any) => thing is T;
/**
 * Returns if the value is an object
 *
 * https://attacomsian.com/blog/javascript-check-variable-is-object
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
declare const isObjectWithValues: <T = object>(thing: any) => thing is T;
/**
 * Returns if the thing is a Promise function
 *
 * It's assumed to be a promise if the thing exists and "thing.then" is a function
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
declare const isPromise: <T = any>(thing: any) => thing is Promise<T>;
/**
 * Get the pixel location of the element from the LagLng value
 *
 * @param {google.maps.Map} map The Google map object
 * @param {google.maps.LatLng} position The Google maps LatLng object
 * @returns {google.maps.Point}
 */
declare const getPixelsFromLatLng: (map: google.maps.Map, position: google.maps.LatLng) => google.maps.Point;
/**
 * Checks to see if Google maps has been loaded
 *
 * @param {string} object The object that needs Google maps
 * @param {string} [library] An optional Google maps library class to check for. This needs to be part of the google.maps object
 * @param {boolean} [throwError] An optional flag to throw an error if the Google maps library is not loaded
 * @returns {boolean}
 */
declare const checkForGoogleMaps: (object: string, library?: string, throwError?: boolean) => boolean;
/**
 * Get the size value with a unit
 *
 * @param {number|string} value The value to check
 * @param {string} defaultUnit The unit to use if the value is a number or a string that does not have a unit
 * @param {string[]} allowedUnits The allowed unites.
 * @param {boolean} allowNegative If the number can be negative
 * @returns {string|boolean} The value with the unit or false if the value is invalid
 */
declare const getSizeWithUnit: (value: string | number, defaultUnit?: string, allowedUnits?: string[], allowNegative?: boolean) => boolean | string;
/**
 * Compare two objects to see if they are equal
 *
 * @param {any} a The first object to compare
 * @param {any} b The second object to compare
 * @returns {boolean}
 */
declare const objectEquals: (a: any, b: any) => boolean;
/**
 * Tests to see if the object is a valid object and if the key is a valid key
 *
 * @param {any} obj The object to test
 * @param {string} key The object key to test
 * @returns {boolean}
 */
declare const objectHasValue: (obj: any, key: string) => boolean;
/**
 * Call the callback function if it is a function
 *
 * @param {Function|undefined} callback The callback function to call
 * @param {any[]} args The arguments to pass to the callback function
 */
/**
 * Replace the {placeholder} values in a string with values looked up for each one.
 *
 * A placeholder that the lookup has no value for is replaced with an empty string so that
 * "undefined" doesn't end up in the output.
 *
 * @param {string} template The string holding the placeholders
 * @param {Function} getValue Called with each placeholder name and returns the value for it
 * @returns {string}
 */
declare const renderTemplate: (template: string, getValue: (key: string) => any) => string;
declare const callCallback: (callback: Function | undefined, ...args: any[]) => void;
/**
 * Calculate the dimensions of the container based on the image aspect ratio
 *
 * @param {number} aspectRatio The aspect ratio of the image
 * @param {number} width The width of the container
 * @param {number} height The height of the container
 * @returns {object} The new width and height of the container
 */
declare const calculateDimensions: (aspectRatio: number, width: number, height: number) => {
    width: number;
    height: number;
};

type AutocompleteSearchBoxOptions = {
    bounds?: LatLngBoundsValue;
    input: string | HTMLInputElement;
    countryRestriction?: string | string[];
    fields?: string[];
    strictBounds?: boolean;
    types?: string[];
};
type AutocompleteSearchBoxEvent = 'place_changed';
type AutocompleteSearchBoxEventObject = Event & {
    place: google.maps.places.PlaceResult;
    bounds: LatLngBounds;
};
type AutocompleteSearchBoxEventCallback = (event: AutocompleteSearchBoxEventObject) => void;
/**
 * The AutocompleteSearchBox class
 */
declare class AutocompleteSearchBox extends Evented {
    #private;
    /**
     * Constructor
     *
     * @param {string | HTMLInputElement | AutocompleteSearchBoxOptions} [input] The input reference or the options
     * @param {AutocompleteSearchBoxOptions} [options] The places autocomplete search box options if the input is reference to the input element
     */
    constructor(input?: string | HTMLInputElement | AutocompleteSearchBoxOptions, options?: AutocompleteSearchBoxOptions);
    /**
     * Get the bounds to which query predictions are biased.
     *
     * @returns {LatLngBounds | undefined}
     */
    get bounds(): LatLngBounds | undefined;
    /**
     * Sets the region to use for biasing query predictions.
     *
     * Results will only be biased towards this area and not be completely restricted to it.
     *
     * @param {LatLngBoundsValue} value The bounds to set
     */
    set bounds(value: LatLngBoundsValue);
    /**
     * Sets the country or countries to use for biasing query predictions.
     *
     * @param {string | string[] | null} value The country restriction to set
     */
    set countryRestriction(value: string | string[] | null);
    /**
     * Get the country or countries to use for biasing query predictions.
     *
     * @returns {string | string[] | null}
     */
    get countryRestriction(): string | string[] | null;
    /**
     * Set the fields to be included for the Place in the details response when the details are successfully retrieved.
     *
     * @param {string | string[]} value The fields to set
     */
    set fields(value: string | string[]);
    /**
     * Get the fields to be included for the Place in the details response when the details are successfully retrieved.
     *
     * @returns {string[]}
     */
    get fields(): string[];
    /**
     * Get the input reference
     *
     * @returns {HTMLInputElement | undefined}
     */
    get input(): HTMLInputElement | undefined;
    /**
     * Set the input reference
     *
     * @param {string | HTMLInputElement} value The input HTMLInputElement or the selector for the input element
     */
    set input(value: string | HTMLInputElement);
    /**
     * Get whether the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.
     *
     * @returns {boolean}
     */
    get strictBounds(): boolean;
    /**
     * Set that the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.
     *
     * Setting strictBounds to false (which is the default) will make the results biased towards, but not restricted to, places contained within the bounds.
     *
     * @param {boolean} value The value to set
     */
    set strictBounds(value: boolean);
    /**
     * Get the types of predictions to be returned.
     *
     * @returns {string[] | undefined}
     */
    get types(): string[] | undefined;
    /**
     * Set the types of predictions to be returned.
     *
     * To clear the types set it to null.
     *
     * @param {string | string[] | null} value The types to set
     */
    set types(value: null | string | string[]);
    /**
     * Get the bounds to which query predictions are biased.
     *
     * @returns {LatLngBounds | undefined}
     */
    getBounds(): LatLngBounds | undefined;
    /**
     * Get the country or countries to use for biasing query predictions.
     *
     * @returns {string | string[] | null}
     */
    getCountryRestriction(): string | string[] | null;
    /**
     * Get the fields to be included for the Place in the details response when the details are successfully retrieved.
     *
     * @returns {string[]}
     */
    getFields(): string[];
    /**
     * Get the HTML input element reference
     *
     * @returns {HTMLInputElement | undefined}
     */
    getInput(): HTMLInputElement | undefined;
    /**
     * Gets the place that has been found
     *
     * The results from the place_changed event is one place and it's the place that the user clicked on.
     *
     * @returns {google.maps.places.PlaceResult | undefined}
     */
    getPlace(): google.maps.places.PlaceResult | undefined;
    /**
     * Get the map bounds based on the place that has been found.
     *
     * @returns {LatLngBounds|undefined}
     */
    getPlaceBounds(): LatLngBounds | undefined;
    /**
     * Get whether the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.
     *
     * @returns {boolean}
     */
    getStrictBounds(): boolean;
    /**
     * Get the types of predictions to be returned.
     *
     * @returns {string[] | undefined}
     */
    getTypes(): string[] | undefined;
    /**
     * Initialize the places search box object
     *
     * This must be called in order for the places search box to work.
     *
     * @returns {Promise<void>}
     */
    init(): Promise<void>;
    /**
     * Returns whether the places search box object has been initialized
     *
     * @returns {boolean}
     */
    isInitialized(): boolean;
    /**
     * @inheritdoc
     */
    hasListener(type: AutocompleteSearchBoxEvent, callback?: AutocompleteSearchBoxEventCallback): boolean;
    /**
     * @inheritdoc
     */
    off(type?: AutocompleteSearchBoxEvent, callback?: AutocompleteSearchBoxEventCallback, options?: EventListenerOptions): void;
    /**
     * @inheritdoc
     */
    on(type: AutocompleteSearchBoxEvent, callback: AutocompleteSearchBoxEventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onImmediate(type: AutocompleteSearchBoxEvent, callback: AutocompleteSearchBoxEventCallback, config?: EventConfig): void;
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
    onPlaceChanged(callback: (place: google.maps.places.PlaceResult, bounds: LatLngBounds) => void): void;
    /**
     * @inheritdoc
     */
    once(type: AutocompleteSearchBoxEvent, callback?: AutocompleteSearchBoxEventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onceImmediate(type: AutocompleteSearchBoxEvent, callback?: AutocompleteSearchBoxEventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    only(type: AutocompleteSearchBoxEvent, callback: AutocompleteSearchBoxEventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onlyOnce(type: AutocompleteSearchBoxEvent, callback: AutocompleteSearchBoxEventCallback, config?: EventConfig): void;
    /**
     * Sets the region to use for biasing query predictions.
     *
     * Results will only be biased towards this area and not be completely restricted to it.
     *
     * @param {LatLngBoundsValue} value The bounds to set
     * @returns {AutocompleteSearchBox}
     */
    setBounds(value: LatLngBoundsValue): AutocompleteSearchBox;
    /**
     * Sets the country or countries to use for biasing query predictions.
     *
     * @param {string|string[]|null} value The country restriction to set
     * @returns {AutocompleteSearchBox}
     */
    setCountryRestriction(value: string | string[] | null): AutocompleteSearchBox;
    /**
     * Set the fields to be included for the Place in the details response when the details are successfully retrieved.
     *
     * @param {string|string[]} value The fields to set
     * @returns {AutocompleteSearchBox}
     */
    setFields(value: string | string[]): AutocompleteSearchBox;
    /**
     * Set the input reference
     *
     * @param {string|HTMLInputElement} input The input HTMLInputElement or the selector for the input element
     * @returns {AutocompleteSearchBox}
     */
    setInput(input: string | HTMLInputElement): AutocompleteSearchBox;
    /**
     * Set the places search box options
     *
     * @param {AutocompleteSearchBoxOptions} options The options to set
     * @returns {AutocompleteSearchBox}
     */
    setOptions(options: AutocompleteSearchBoxOptions): AutocompleteSearchBox;
    /**
     * Set whether the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.
     *
     * Setting strictBounds to false (which is the default) will make the results biased towards, but not restricted to, places contained within the bounds.
     *
     * @param {boolean} value The value to set
     * @returns {AutocompleteSearchBox}
     */
    setStrictBounds(value: boolean): AutocompleteSearchBox;
    /**
     * Set the types of predictions to be returned.
     *
     * To clear the types set it to null.
     *
     * @param {string | string[] | null} value The types to set
     * @returns {AutocompleteSearchBox}
     */
    setTypes(value: null | string | string[]): AutocompleteSearchBox;
}
type AutocompleteSearchBoxValue = HTMLInputElement | string | AutocompleteSearchBox | AutocompleteSearchBoxOptions;
/**
 * Helper function to set up the places search box object
 *
 * @param {AutocompleteSearchBoxValue} [input] The input reference or the options
 * @param {AutocompleteSearchBoxOptions} [options] The places search box options
 * @returns {AutocompleteSearchBox}
 */
declare const autocompleteSearchBox: (input?: AutocompleteSearchBoxValue, options?: AutocompleteSearchBoxOptions) => AutocompleteSearchBox;

type LoaderOptions = {
    apiKey?: string;
    libraries?: Libraries;
    version?: string;
};
/**
 * Class to load the Google maps API
 *
 * This should be a singleton object and prevent multiple loader objects on the page.
 */
declare class Loader extends EventTarget {
    #private;
    /**
     * Class constructor
     *
     * @param {LoaderOptions} [options] The loader options object
     */
    constructor(options?: LoaderOptions);
    /**
     * Get the Google Maps API key
     *
     * @returns {string | undefined}
     */
    get apiKey(): string | undefined;
    /**
     * Set the Google Maps API key
     *
     * @param {string} apiKey The Google Maps API key
     */
    set apiKey(apiKey: string);
    /**
     * Get the libraries to load with Google maps
     *
     * @returns {Libraries}
     */
    get libraries(): Libraries;
    /**
     * Set the libraries to load with Google maps
     * The "places" library is a common one to load.
     * https://developers.google.com/maps/documentation/javascript/places
     *
     * @param {Libraries} libraries The libraries to load with Google maps
     */
    set libraries(libraries: Libraries);
    /**
     * Get the version of the Google Maps API to load
     *
     * @returns {string}
     */
    get version(): string;
    /**
     * Set the version of the Google Maps API to load
     * https://developers.google.com/maps/documentation/javascript/versions
     *
     * @param {string} version The version of the Google Maps API to load
     */
    set version(version: string);
    /**
     * Set the loader options
     *
     * @param {LoaderOptions} options The loader options object
     * @returns {Loader}
     */
    setOptions(options: LoaderOptions): Loader;
    /**
     * Set the Google Maps API key
     *
     * @param {string} apiKey The Google Maps API key
     * @returns {Loader}
     */
    setApiKey(apiKey: string): Loader;
    /**
     * Set the libraries to load with Google maps
     * The "places" library is a common one to load.
     * https://developers.google.com/maps/documentation/javascript/places
     *
     * @param {Libraries} libraries The libraries to load with Google maps
     * @returns {Loader}
     */
    setLibraries(libraries: Libraries): Loader;
    /**
     * Set the version of the Google Maps API to load
     * https://developers.google.com/maps/documentation/javascript/versions
     *
     * @param {string} version The version of the Google Maps API to load
     * @returns {Loader}
     */
    setVersion(version: string): Loader;
    /**
     * Load the Google maps API
     *
     * @param {Function} callback A callback function to run when the Google maps API has loaded
     * @returns {Promise<void>}
     */
    load(callback?: () => void): Promise<void>;
    /**
     * Dispatch an event
     *
     * @param {string} event The event to dispatch
     */
    dispatch(event: string): void;
    /**
     * Add an event listener to the object.
     *
     * All events on the loader object are set up as "once" events because the
     * load event is only dispatched one time when the Google maps API is loaded.
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener function. An error is thrown if this isn't a function.
     */
    on(type: string, callback: EventListenerOrEventListenerObject | null): void;
    /**
     * Sets up an event listener for the "load" event.
     *
     * All events on the loader object are set up as "once" events because the
     * load event is only dispatched one time when the Google maps API is loaded.
     *
     * @param {Function} callback A callback function to run when the Google maps API has loaded
     */
    onLoad(callback: EventListenerOrEventListenerObject): void;
    /**
     * Sets up an event listener for the "map_load" event.
     *
     * All events on the loader object are set up as "once" events because the
     * load event is only dispatched one time when the Google maps API is loaded.
     *
     * @param {Function} callback A callback function to run when the Google maps API has loaded
     */
    onMapLoad(callback: EventListenerOrEventListenerObject): void;
    /**
     * Sets up an event listener that will only be called once
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener function
     */
    once(type: string, callback: EventListenerOrEventListenerObject | null): void;
    /**
     * Sets up an event listener for the "load" event that will only be called once.
     *
     * @param {Function} callback A callback function to run when the Google maps API has loaded
     */
    onceLoad(callback: EventListenerOrEventListenerObject | null): void;
    /**
     * Sets up an event listener for the "map_load" event that will only be called once.
     *
     * @param {Function} callback A callback function to run when the Google maps API has loaded
     */
    onceMapLoad(callback: EventListenerOrEventListenerObject | null): void;
}
/**
 * Helper function to set up the loader object.
 *
 * Only one loader object can be created on a page.
 * This prevents trying to load the Google maps library multiple times.
 * It also allows us to internally handle when the Google maps library is loaded.
 *
 * @param {LoaderOptions} [config] The loader options
 * @returns {Loader}
 */
declare const loader: (config?: LoaderOptions) => Loader;

type MarkerLabel = google.maps.MarkerLabel;
type CustomData$1 = {
    [key: string]: any;
};
type GMMarkerOptions = {
    anchorPoint?: Point;
    cursor?: string;
    draggable?: boolean;
    icon?: Icon | SvgSymbol | string;
    label?: string | MarkerLabel;
    map?: Map | null;
    optimized?: boolean;
    position?: LatLng;
    title?: string;
    visible?: boolean;
};
type MarkerOptions = GMMarkerOptions & {
    anchorPoint?: PointValue;
    data?: CustomData$1;
    drag?: boolean;
    icon?: IconValue;
    lat?: number | string;
    latitude?: number | string;
    lng?: number | string;
    longitude?: number | string;
    position?: LatLngValue;
    svgIcon?: SvgSymbolValue | string;
    tooltip?: TooltipValue;
};
type MarkerEvent = 'animation_changed' | 'click' | 'clickable_changed' | 'contextmenu' | 'cursor_changed' | 'dblclick' | 'drag' | 'dragend' | 'draggable_changed' | 'dragstart' | 'flat_changed' | 'icon_changed' | 'mousedown' | 'mouseout' | 'mouseover' | 'mouseup' | 'position_changed' | 'ready' | 'shape_changed' | 'title_changed' | 'visible_changed' | 'zindex_changed';
/**
 * Marker class to set up a single marker and add it to the map
 */
declare class Marker extends Layer {
    #private;
    /**
     * Constructor
     *
     * @param {LatLngValue|MarkerOptions} [position] The latitude longitude pair
     * @param {MarkerOptions} [options] The marker options
     */
    constructor(position?: LatLngValue | MarkerOptions, options?: MarkerOptions);
    /**
     * Get the anchor point for the marker
     *
     * @returns {Point | undefined}
     */
    get anchorPoint(): Point | undefined;
    /**
     * Set the anchor point for the marker
     *
     * @param {PointValue} value The anchor point for the marker
     */
    set anchorPoint(value: PointValue);
    /**
     * Get the cursor type to show on hover
     *
     * @returns {string | undefined}
     */
    get cursor(): string | undefined;
    /**
     * Set the cursor type to show on hover
     *
     * @param {string} value The cursor type to show on hover
     */
    set cursor(value: string);
    /**
     * Get the custom data attached to the marker object
     *
     * @returns {CustomData}
     */
    get data(): CustomData$1;
    /**
     * Set custom data to attach to the marker object
     *
     * @param {CustomData} value The custom data to attach to the marker object
     */
    set data(value: CustomData$1);
    /**
     * Returns whether dragging is enabled
     *
     * @returns {boolean}
     */
    get drag(): boolean;
    /**
     * Set whether the marker can be dragged on the map.
     *
     * @param {boolean} value Whether the marker can be dragged on the map
     */
    set drag(value: boolean);
    /**
     * Get the icon for the marker
     *
     * @returns {Icon | SvgSymbol | string | undefined}
     */
    get icon(): Icon | SvgSymbol | string | undefined;
    /**
     * Set the icon for the marker
     *
     * @param {Icon | SvgSymbol | string} value The icon value for the marker
     */
    set icon(value: Icon | SvgSymbol | string);
    /**
     * Get the label for the marker
     *
     * @returns {string | number | MarkerLabel | undefined}
     */
    get label(): string | number | MarkerLabel | undefined;
    /**
     * Set the label for the marker
     *
     * @param {string | number | MarkerLabel} value The label value for the marker
     */
    set label(value: string | number | MarkerLabel);
    /**
     * Get the map object
     *
     * @returns {Map | null | undefined}
     */
    get map(): Map | null | undefined;
    /**
     * Set the map object
     *
     * @param {Map|null} value The map object. Set to null if you want to remove the marker from the map.
     */
    set map(value: Map | null);
    /**
     * Get whether the marker rendering is optimized
     *
     * @returns {boolean | undefined} Undefined if it's not set, in which case Google decides.
     */
    get optimized(): boolean | undefined;
    /**
     * Set whether the marker rendering is optimized
     *
     * @param {boolean} value Whether the marker rendering is optimized
     */
    set optimized(value: boolean);
    /**
     * Get the marker position
     *
     * @returns {LatLng}
     */
    get position(): LatLng;
    /**
     * Set the latitude and longitude value for the marker
     *
     * @param {LatLngValue} value The latitude/longitude position for the marker
     */
    set position(value: LatLngValue);
    /**
     * Get the title for the marker
     *
     * @returns {string | undefined}
     */
    get title(): string | undefined;
    /**
     * Set the title for the marker
     *
     * @param {string} value The title for the marker
     */
    set title(value: string);
    /**
     * Get whether the marker is visible on the map
     *
     * @returns {boolean | undefined} Undefined if it hasn't been set, which means visible
     */
    get visible(): boolean | undefined;
    /**
     * Set whether the marker is visible on the map
     *
     * @param {boolean} value Whether the marker is visible on the map
     */
    set visible(value: boolean);
    /**
     * Disable dragging for this marker
     *
     * @returns {Promise<Marker>}
     */
    disableDrag(): Promise<Marker>;
    /**
     * Adds the marker to the map object
     *
     * Alternate of show()
     *
     * @param {Map} map The map object
     * @returns {Marker}
     */
    display(map: Map): Marker;
    /**
     * Enable dragging for this marker
     *
     * @returns {Promise<Marker>}
     */
    enableDrag(): Promise<Marker>;
    /**
     * Get any custom data attached to the marker object.
     *
     * Optionally pass a data key to get the value for that key.
     *
     * @param {string} [key] The object key to get data for. If not set then all data is returned.
     * @returns {any}
     */
    getData(key?: string): any;
    /**
     * Get the marker position (i.e. the LatLng object)
     *
     * https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
     *
     * @returns {LatLng}
     */
    getPosition(): LatLng;
    /**
     * Hide the marker
     *
     * @returns {Marker}
     */
    hide(): Marker;
    /**
     * Returns whether the Google maps marker object has been created yet.
     *
     * This lets other parts of the library avoid building the Google marker just to find out
     * that there isn't one, which toGoogleSync() would otherwise do.
     *
     * This is not intended to be called outside of this library.
     *
     * @internal
     * @returns {boolean}
     */
    hasGoogleMarker(): boolean;
    /**
     * Initialize the marker
     *
     * This is used when another element (like a tooltip) needs to be attached to the marker,
     * but needs to make sure that the marker exists first.
     *
     * This is not intended to be called outside of this library.
     *
     * @internal
     * @returns {Promise<void>}
     */
    init(): Promise<void>;
    /**
     * Returns whether the marker is draggable
     *
     * @returns {boolean}
     */
    isDraggable(): boolean;
    /**
     * @inheritdoc
     */
    hasListener(type: MarkerEvent, callback?: EventCallback): boolean;
    /**
     * @inheritdoc
     */
    off(type?: MarkerEvent, callback?: EventCallback, options?: EventListenerOptions): void;
    /**
     * @inheritdoc
     */
    on(type: MarkerEvent, callback: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onImmediate(type: MarkerEvent, callback: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    once(type: MarkerEvent, callback?: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onceImmediate(type: MarkerEvent, callback?: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    only(type: MarkerEvent, callback: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onlyOnce(type: MarkerEvent, callback: EventCallback, config?: EventConfig): void;
    /**
     * Add an event listener for when the marker's animation changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onAnimationChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the marker icon is clicked.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onClick(callback: EventCallback): void;
    /**
     * Add an event listener for when the marker clickable property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onClickableChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the DOM context menu is triggered on the marker.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onContextMenu(callback: EventCallback): void;
    /**
     * Add an event listener for when the marker cursor property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onCursorChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the marker is double clicked.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDblClick(callback: EventCallback): void;
    /**
     * Add an event listener for when the user drags the marker.
     *
     * This uses the Google Maps marker drag event
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDrag(callback: EventCallback): void;
    /**
     * Add an event listener for when the user stops dragging the marker.
     *
     * This uses the Google Maps marker dragend event
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDragEnd(callback: EventCallback): void;
    /**
     * Add an event listener for when the marker draggable property changes.
     *
     * This uses the Google Maps marker draggable_changed event
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDraggableChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the user starts dragging the marker.
     *
     * This uses the Google Maps marker dragstart event
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDragStart(callback: EventCallback): void;
    /**
     * Add an event listener for when the marker flat property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onFlatChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the marker icon property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onIconChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the user's mouse is pressed down on the marker.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onMouseDown(callback: EventCallback): void;
    /**
     * Add an event listener for when the user's mouse leaves the marker icon.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onMouseOut(callback: EventCallback): void;
    /**
     * Add an event listener for when the user's mouse enters the marker icon.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onMouseOver(callback: EventCallback): void;
    /**
     * Add an event listener for the mouseup event on the marker.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onMouseUp(callback: EventCallback): void;
    /**
     * Add an event listener for when the marker's position property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onPositionChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the marker is loaded and ready for use.
     *
     * @param {EventCallback} [callback] The callback function to call when the event is dispatched.
     */
    onReady(callback: EventCallback): void;
    /**
     * Add an event listener for when the marker's shape property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onShapeChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the marker's title property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onTitleChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the marker's visible property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onVisibleChanged(callback: EventCallback): void;
    /**
     * Add an event listener for when the marker's zindex property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onZIndexChanged(callback: EventCallback): void;
    /**
     * Set the anchor point for the marker
     *
     * @param {PointValue} value The anchor point for the marker
     * @returns {Promise<Marker>}
     */
    setAnchorPoint(value: PointValue): Promise<Marker>;
    /**
     * Set the anchor point for the marker syncronously.
     *
     * Only use this if you know that the Google Maps library is already loaded and you have to set up the marker
     * syncronously. If you don't have to set up the marker syncronously, then use setAnchorPoint() instead or pass the
     * anchor point to the constructor or setOptions().
     *
     * @param {PointValue} value The anchor point for the marker
     * @returns {Marker}
     */
    setAnchorPointSync(value: PointValue): Marker;
    /**
     * Set the cursor type to show on hover
     *
     * @param {string} value The cursor type to show on hover
     * @returns {Promise<Marker>}
     */
    setCursor(value: string): Promise<Marker>;
    /**
     *  Set the cursor type to show on hover
     *
     * Only use this if you know that the Google Maps library is already loaded and you have to set up the marker
     * syncronously. If you don't have to set up the marker syncronously, then use setCursor() instead or pass the
     * cursor to the constructor or setOptions().
     *
     * @param {string} value The cursor type to show on hover
     * @returns {Marker}
     */
    setCursorSync(value: string): Marker;
    /**
     * Set the icon value for the marker
     *
     * @param {Icon | SvgSymbol | string} value The icon for the marker
     * @returns {Marker}
     */
    setIcon(value: Icon | SvgSymbol | string): Promise<Marker>;
    /**
     * Set the icon value for the marker syncronously.
     *
     * Only use this if you know that the Google Maps library is already loaded and you have to set up the marker
     * syncronously. If you don't have to set up the marker syncronously, then use setIcon() instead or pass the
     * icon to the constructor or setOptions().
     *
     * @param {Icon | SvgSymbol | string} value The icon for the marker
     * @returns {Marker}
     */
    setIconSync(value: Icon | SvgSymbol | string): Marker;
    /**
     * Set the label value for the marker
     *
     * @param {string | number | MarkerLabel} value The label for the marker
     * @returns {Marker}
     */
    setLabel(value: string | number | MarkerLabel): Promise<Marker>;
    /**
     * Set the label value for the marker syncronously.
     *
     * Only use this if you know that the Google Maps library is already loaded and you have to set up the marker
     * syncronously. If you don't have to set up the marker syncronously, then use setLabel() instead or pass the
     * label to the constructor or setOptions().
     *
     * @param {string | number | MarkerLabel} value The label for the marker
     * @returns {Marker}
     */
    setLabelSync(value: string | number | MarkerLabel): Marker;
    /**
     * Adds the marker to the map object
     *
     * Alternate of show()
     *
     * @param {Map} map The map object. Set to null if you want to remove the marker from the map.
     * @returns {Promise<Marker>}
     */
    setMap(map: Map | null): Promise<Marker>;
    /**
     * Set the map object
     *
     * Only use this if you know that the Google Maps library is already loaded and you have to set up the marker
     * syncronously. If you don't have to set up the marker syncronously, then use setMap() instead or pass the
     * map to the constructor or setOptions().
     *
     * @param {Map|null} map The map object. Set to null if you want to remove the marker from the map.
     * @returns {Marker}
     */
    setMapSync(map: Map | null): Marker;
    /**
     * Set whether the marker rendering is optimized
     *
     * Optimization renders many markers as a single static element, which helps when there are a large
     * number of markers. If it's not set then Google decides. Optimization has no effect on vector maps.
     *
     * It's best to set this in the marker options so that it's used when the marker is created.
     *
     * @param {boolean} value Whether the marker rendering is optimized. Pass undefined to let Google decide.
     * @returns {Promise<Marker>}
     */
    setOptimized(value: boolean): Promise<Marker>;
    /**
     * Set whether the marker rendering is optimized syncronously.
     *
     * Only use this if you know that the Google Maps library is already loaded and you have to set up the marker
     * syncronously. If you don't have to set up the marker syncronously, then use setOptimized() instead or pass the
     * optimized value to the constructor or setOptions().
     *
     * @param {boolean} value Whether the marker rendering is optimized. Pass undefined to let Google decide.
     * @returns {Marker}
     */
    setOptimizedSync(value: boolean): Marker;
    /**
     * Set the marker options
     *
     * This intentionally does not set up the Google Maps marker object. This is so that when the
     * marker option is created all the options are set one time.
     *
     * @param {MarkerOptions} options The marker options
     * @returns {Marker}
     */
    setOptions(options: MarkerOptions): Marker;
    /**
     * Set the latitude and longitude value for the marker
     *
     * @param {LatLngValue} value The latitude/longitude position for the marker
     * @returns {Promise<Marker>}
     */
    setPosition(value: LatLngValue): Promise<Marker>;
    /**
     * Set the latitude and longitude value for the marker syncronously.
     *
     * Only use this if you know that the Google Maps library is already loaded and you have to set up the marker
     * syncronously. If you don't have to set up the marker syncronously, then use setPosition() instead or pass the
     * position to the constructor or setOptions().
     *
     * @param {LatLngValue} value The latitude/longitude position for the marker
     * @returns {Marker}
     */
    setPositionSync(value: LatLngValue): Marker;
    /**
     *Set the title for the marker
     *
     * @param {string} value The title to show on hover
     * @returns {Promise<Marker>}
     */
    setTitle(value: string): Promise<Marker>;
    /**
     * Set the title for the marker
     *
     * Only use this if you know that the Google Maps library is already loaded and you have to set up the marker
     * syncronously. If you don't have to set up the marker syncronously, then use setTitle() instead or pass the
     * title to the constructor or setOptions().
     *
     * @param {string} value The title to show on hover
     * @returns {Marker}
     */
    setTitleSync(value: string): Marker;
    /**
     * Set whether the marker is visible on the map.
     *
     * A marker that isn't visible isn't drawn, so nothing is created on the Google map for it
     * until it's shown. Setting it to visible draws it if it was waiting to be drawn.
     *
     * @param {boolean} visible Whether the marker is visible on the map
     * @returns {Marker}
     */
    setVisible(visible: boolean): Marker;
    /**
     * Adds the marker to the map object
     *
     * Alternate of setMap()
     *
     * @param {Map} map The map object
     * @returns {Promise<Marker>}
     */
    show(map: Map): Promise<Marker>;
    /**
     * Get the Google maps marker object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker
     *
     * @returns {Promise<google.maps.Marker>}
     */
    toGoogle(): Promise<google.maps.Marker>;
    /**
     * Get the Google maps marker object synchronously. Throw an error if the Google Maps library is not available.
     *
     * This is different from toGoogle() because it will throw an error if the Google Maps library is not available,
     * whereas toGoogle() will wait for the Google Maps library to load.
     *
     * Only use this when you have to get the Google Maps object synchronously and you know that the Google Maps library is already loaded.
     * If you don't have to get the Google Maps object synchronously, then use toGoogle() instead.
     *
     * @returns {google.maps.Marker}
     */
    toGoogleSync(): google.maps.Marker;
}
type MarkerValue = Marker | MarkerOptions | LatLngValue;
/**
 * Helper function to set up the marker object
 *
 * @param {MarkerValue} [position] The latitude/longitude pair or the marker options
 * @param {MarkerOptions} [options] The marker options
 * @returns {Marker}
 */
declare const marker: (position?: MarkerValue, options?: MarkerOptions) => Marker;

type ClusterColor = {
    bgColor: string;
    textColor: string;
};
type ClusterColors = {
    [key: number]: string | ClusterColor;
};

type ClusterImage = {
    height?: number;
    labelClassName?: string;
    labelColor?: string;
    labelFontFamily?: string;
    labelFontSize?: string | number;
    labelFontWeight?: string;
    scaledHeight?: number;
    scaledSize?: SizeValue;
    scaledWidth?: number;
    size?: SizeValue;
    url: string;
    width?: number;
};
type ClusterImageValue = string | ClusterImage;
type ClusterImages = {
    [key: number]: ClusterImageValue;
};

type DefaultRenderOptions = {
    colorRangeBottom?: string | ClusterColor;
    colorRangeTop?: string | ClusterColor;
    /**
     * An object that holds the colors for the clusters. This is used to configure the default renderer for the clusters.
     * Use this instead of the greaterThanAverageColor and lessThanAverageColor options if you want more control over the colors.
     * The key should either be a number and the value should be a string color.
     * If the number of markers in the clsuter is greater or equal to the than the key, the color will be used.
     * The first color should have a key of 0 or 1 to handle clusters with 1 or more markers.
     */
    colors?: ClusterColors;
    labelFontFamily?: string;
    labelFontSize?: string | number;
    centerOpacity?: number;
    middleOpacity?: number;
    outerOpacity?: number;
    showNumber?: boolean;
};
type ImageRendererOptions = {
    /**
     * An object that holds the images for the clusters. This is used to configure the image renderer for the clusters.
     * The key should either be a number and the value should be an object containing the image URL, the width, and height of the image.
     * If the number of markers in the clsuter is greater or equal to the than the key, the image will be used.
     * The first image should have a key of 0 or 1 to handle clusters with 1 or more markers.
     */
    images?: ClusterImages;
    image?: ClusterImageValue;
    labelClassName?: string;
    labelColor?: string;
    labelFontFamily?: string;
    labelFontSize?: string | number;
    labelFontWeight?: string;
    showNumber?: boolean;
};
type MarkerClusterOptions = {
    /**
     * A simple string to set the algorithm. Default is "supercluster" for SuperClusterAlgorithm.
     * This is an alternate way to set the algorithm if you don't want to use the algorithmClass.
     * You can still set algorithmOptions if you use this method.
     */
    algorithm?: 'grid' | 'supercluster' | 'noop';
    /**
     * An algorithm to cluster markers. This determines how many markers are clustered together.
     * Default is SuperClusterAlgorithm. Must provide a `calculate` method accepting AlgorithmInput and returning
     * an array of Cluster.
     *
     * https://googlemaps.github.io/js-markerclusterer/classes/GridAlgorithm.html
     */
    algorithmClass?: Algorithm;
    /**
     * The options for the different algorithms.
     * You can set them in this object, or you can set the individual options with the radius and maxZoom options.
     * - radius
     * - maxZoom
     * - minPoints
     *
     * https://googlemaps.github.io/js-markerclusterer/interfaces/AlgorithmOptions.html
     * https://googlemaps.github.io/js-markerclusterer/interfaces/GridOptions.html
     * https://www.npmjs.com/package/supercluster - This is what the SueprClusterAlgorithm uses
     */
    algorithmOptions?: SuperClusterOptions;
    /**
     * The options for the default renderer.
     */
    defaultRenderOptions?: DefaultRenderOptions;
    /**
     * The options for the image renderer.
     */
    imageRendererOptions?: ImageRendererOptions;
    /**
     * The callback function for when a cluster is clicked.
     * The function will be passed the event, the cluster, and the map.
     */
    onClusterClick?: onClusterClickHandler;
    maxZoom?: number;
    minPoints?: number;
    radius?: number;
    /**
     * An object that converts a cluster into a `google.maps.Marker`.
     * Default is DefaultRenderer.
     * It must provide a `render` method accepting Cluster, ClusterStatus, and `google.maps.Map` and returning a `google.maps.Marker`.
     *
     * https://github.com/googlemaps/js-markerclusterer/blob/main/src/renderer.ts
     * https://googlemaps.github.io/js-markerclusterer/classes/DefaultRenderer.html
     */
    renderer?: Renderer;
};
/**
 * The MarkerCluster class to handle clusting of markers on a map
 */
declare class MarkerCluster extends Base {
    #private;
    /**
     * The constructor for the MarkerCluster class
     *
     * @param {Map} map The map object
     * @param {Marker[]|MarkerClusterOptions} [markers] Markers to cluster. You can also use addMarker() instead of adding the markers here.
     * @param {MarkerClusterOptions} [options] Options for the marker clusterer
     */
    constructor(map: Map, markers?: Marker[] | MarkerClusterOptions, options?: MarkerClusterOptions);
    /**
     * Adds a marker to the cluster
     *
     * @param {Marker} marker The marker to add to the cluster
     * @param {boolean} draw Whether to redraw the clusters after adding the marker.
     *      Default is true. Note, this is opposite of the MarkerClusterer library.
     * @returns {MarkerCluster}
     */
    addMarker(marker: Marker, draw?: boolean): MarkerCluster;
    /**
     * Add multiple markers to the cluster
     *
     * @param {Marker[]} markers The array of markers to add
     * @param {boolean} draw Whether to redraw the clusters after adding the marker.
     *      Default is true. Note, this is opposite of the MarkerClusterer library.
     * @returns {MarkerCluster}
     */
    addMarkers(markers: Marker[], draw?: boolean): MarkerCluster;
    /**
     * Clears all of the markers
     *
     * @param {boolean} draw Whether to redraw the clusters after removing all the markers.
     *      Default is true. Note, this is opposite of the MarkerClusterer library.
     * @returns {MarkerCluster}
     */
    clearMarkers(draw?: boolean): MarkerCluster;
    /**
     * Removes a single marker from the cluster.
     *
     * @param {Marker} marker The marker to remove
     * @param {boolean} draw Whether to redraw the clusters after removing the marker.
     *      Default is true. Note, this is opposite of the MarkerClusterer library.
     * @returns {MarkerCluster}
     */
    removeMarker(marker: Marker, draw?: boolean): MarkerCluster;
    /**
     * Force a recalculation and redraw of all the marker clusters.
     *
     * @returns {MarkerCluster}
     */
    render(): MarkerCluster;
}
/**
 * Helper function to set up the marker cluster object
 *
 * @param {Map} map The map object
 * @param {Marker[]|MarkerClusterOptions} [markers] Markers to cluster. You can also use addMarker() instead of adding the markers here.
 *      Alternately, you can pass the cluster options here.
 * @param {MarkerClusterOptions} [options] Options for the marker clusterer
 * @returns {MarkerCluster}
 */
declare const markerCluster: (map: Map, markers?: MarkerClusterOptions | Marker[], options?: MarkerClusterOptions) => MarkerCluster;

type MarkersByTag = {
    [key: string]: Set<Marker>;
};
/**
 * The collection of markers that enable doing bulk actions on markers.
 * Some of the bulk actions can be filtered by the marker tag.
 */
declare class MarkerCollection {
    #private;
    /**
     * Holds the Marker objects by tag
     */
    markers: MarkersByTag;
    /**
     * Adds an Marker to the collection
     *
     * @param {Marker} marker The Marker object to add
     * @param {string|string[]} [tag] The tag(s) to assign the marker to. Either a single tag or an array of tags can be passed.
     */
    add(marker: Marker, tag?: string | string[]): void;
    /**
     * Clears the collection
     *
     * This also hides all the markers in the collection.
     */
    clear(): void;
    /**
     * Clone the collection
     *
     * @returns {MarkerCollection}
     */
    clone(): MarkerCollection;
    /**
     * Returns true if the collection has any markers
     *
     * @returns {boolean}
     */
    hasData(): boolean;
    /**
     * Hide the Markers in the collection that have the tag(s) passed
     *
     * @param {string|string[]} tag The tag(s) to hide markers for. Either a single tag string or an array of tag strings can be passed.
     */
    hide(tag: string | string[]): void;
    /**
     * Hides all the Markers in the collection
     */
    hideAll(): void;
    /**
     * Returns true if the collection has no markers
     *
     * @returns {boolean}
     */
    isEmpty(): boolean;
    /**
     * Remove the marker from the collection, optionally by tag.
     *
     * @param {Marker} marker The marker object to remove
     * @param {string|string[]} [tag] The tag(s) to remove the marker from. If not set then the marker is removed from all tags.
     *      Either a single tag string or an array of tag strings can be passed.
     */
    remove(marker: Marker, tag?: string | string[]): void;
    /**
     * Show the Markers in the collection that have the tag(s) passed
     *
     * @param {string|string[]} tag The tag(s) to show markers for. Either a single tag string or an array of tag strings can be passed.
     * @param {Map} [map] The map object
     */
    show(tag: string | string[], map: Map): void;
    /**
     * Show all the Markers in the collection
     *
     * @param {Map} map The map object
     */
    showAll(map: Map): void;
}
/**
 * Helper function to set up the marker collection object
 *
 * @returns {MarkerCollection}
 */
declare const markerCollection: () => MarkerCollection;

type AttachEventValue = 'click' | 'clickon' | 'hover';

type ImageOverlayOptions = {
    bounds: LatLngBoundsValue;
    className?: string;
    debug?: boolean;
    drag?: boolean;
    imageUrl: string;
    map?: Map;
    opacity?: number;
    resize?: boolean;
    rotation?: number;
    rotate?: boolean;
    styles?: object;
};
/**
 * ImageOverlay class
 */
declare class ImageOverlay extends Overlay {
    #private;
    /**
     * Constructor
     *
     * @param {ImageOverlayOptions | string} [options] The ImageOverlay options or image URL
     * @param {LatLngBoundsValue} [bounds] The bounds where the image should be displayed (if options is a string)
     */
    constructor(options?: ImageOverlayOptions | string, bounds?: LatLngBoundsValue);
    /**
     * Returns the bounds where the image should be displayed
     *
     * @returns {LatLngBounds|undefined}
     */
    get bounds(): LatLngBounds | undefined;
    /**
     * Set the bounds where the image should be displayed
     *
     * @param {LatLngBoundsValue} bounds The bounds where the image should be displayed
     */
    set bounds(bounds: LatLngBoundsValue);
    /**
     * Get the class name for the image element
     *
     * This overrides the className property of the Overlay class.
     *
     * @returns {string}
     */
    get className(): string;
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
    set className(className: string);
    /**
     * Returns the image URL
     *
     * @returns {string|undefined}
     */
    get imageUrl(): string | undefined;
    /**
     * Set the image URL
     *
     * @param {string} imageUrl The image URL to display
     */
    set imageUrl(imageUrl: string);
    /**
     * Returns the opacity of the image
     *
     * @returns {number}
     */
    get opacity(): number;
    /**
     * Set the opacity of the image
     *
     * @param {number} opacity The opacity value (0.0 to 1.0)
     */
    set opacity(opacity: number);
    /**
     * Returns whether rotation is enabled
     *
     * @returns {boolean}
     */
    get rotate(): boolean;
    /**
     * Set whether rotation is enabled
     *
     * @param {boolean} rotate Whether rotation is enabled
     */
    set rotate(rotate: boolean);
    /**
     * Returns the rotation angle in degrees
     *
     * @returns {number}
     */
    get rotation(): number;
    /**
     * Set the rotation angle in degrees
     *
     * @param {number} rotation The rotation angle in degrees (0 to 360)
     */
    set rotation(rotation: number);
    /**
     * Returns the styles for the overlay element
     *
     * @returns {object}
     */
    get styles(): object;
    /**
     * Set multiple styles for the image overlay element
     *
     * @param {object} styles The styles to apply to the image overlay element
     */
    set styles(styles: object);
    /**
     * Disable rotation for this overlay
     *
     * @returns {ImageOverlay}
     */
    disableRotation(): ImageOverlay;
    /**
     * Display the image overlay on the map
     *
     * Alias to show()
     *
     * @param {Map} map The Map object
     * @returns {Promise<ImageOverlay>}
     */
    display(map: Map): Promise<ImageOverlay>;
    /**
     * Enable rotation for this overlay
     *
     * @returns {ImageOverlay}
     */
    enableRotation(): ImageOverlay;
    /**
     * Get the rotation angle in degrees
     *
     * @returns {number}
     */
    getRotation(): number;
    /**
     * Fit the overlay to the exact dimensions of the image
     *
     * @returns {Promise<ImageOverlay>}
     */
    fitToImage(): Promise<ImageOverlay>;
    /**
     * Get the bounds where the image should be displayed
     *
     * @returns {LatLngBounds|undefined}
     */
    getBounds(): LatLngBounds | undefined;
    /**
     * Get the image URL
     *
     * @returns {string|undefined}
     */
    getImageUrl(): string | undefined;
    /**
     * Get the opacity of the image
     *
     * @returns {number}
     */
    getOpacity(): number;
    /**
     * Add an event listener for when rotating ends
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onRotateEnd(callback: EventCallback): void;
    /**
     * Add an event listener for when rotating updates the overlay rotation
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onRotate(callback: EventCallback): void;
    /**
     * Add an event listener for when rotating the overlay starts
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onRotateStart(callback: EventCallback): void;
    /**
     * Removes a class name from the overlay element
     *
     * @param {string} className The class name to remove from the overlay element
     * @returns {Overlay}
     */
    removeClassName(className: string): Overlay;
    /**
     * Set the bounds where the image should be displayed
     *
     * @param {LatLngBoundsValue} bounds The bounds where the image should be displayed
     * @returns {ImageOverlay}
     */
    setBounds(bounds: LatLngBoundsValue): ImageOverlay;
    /**
     * Update bounds from resize
     *
     * @protected
     * @param {LatLng} neLatLng The new lat/lng position for the northeast corner
     * @param {LatLng} swLatLng The new lat/lng position for the southwest corner
     */
    setBoundsFromResize(neLatLng: LatLng, swLatLng: LatLng): void;
    /**
     * Set the class name(s) for the image element
     *
     * If you need multiple class names then separate them with a space.
     *
     * @param {string} className The class name(s) to add to the image element.
     *    This can be a space separated list of class names.
     * @returns {Overlay}
     */
    setClassName(className: string): Overlay;
    /**
     * Set the image URL
     *
     * @param {string} imageUrl The image URL to display
     * @returns {ImageOverlay}
     */
    setImageUrl(imageUrl: string): ImageOverlay;
    /**
     * Set the opacity of the image
     *
     * @param {number} opacity The opacity value (0.0 to 1.0)
     * @returns {ImageOverlay}
     */
    setOpacity(opacity: number): ImageOverlay;
    /**
     * Sets the options for the image overlay
     *
     * @param {ImageOverlayOptions} options ImageOverlay options
     * @returns {ImageOverlay}
     */
    setOptions(options: ImageOverlayOptions): ImageOverlay;
    /**
     * Set the rotation angle in degrees
     *
     * @param {number} rotation The rotation angle in degrees (0 to 360)
     * @returns {ImageOverlay}
     */
    setRotation(rotation: number): ImageOverlay;
    /**
     * Set one more styles for the image overlay element. This will merge styles with an existing ones.
     *
     * @param {object} styles The styles to apply to the overlay element
     * @returns {Overlay}
     */
    setStyles(styles: object): Overlay;
    /**
     * Set a single style on the image element
     *
     * @param {string} name The style name
     * @param {string} value The style value
     * @returns {Overlay}
     */
    style(name: string, value: string): Overlay;
    /**
     * Toggle the display of the image overlay on the map
     *
     * @param {Map} map The map object
     * @returns {void}
     */
    toggle(map: Map): void;
    /**
     * Override the updateBoundsFromPosition method to handle dragging
     *
     * @protected
     */
    updateBoundsFromPosition(): void;
    /**
     * Override the updateBoundsFromResize method to handle resizing
     *
     * @protected
     * @param {LatLng} newLatLng The new lat/lng position
     */
    updateBoundsFromResize(newLatLng: LatLng): void;
    /**
     * Add the overlay to the element. Called once after setMap() is called on the overlay with a valid map.
     *
     * @internal
     * @param {google.maps.MapPanes} panes The Google maps panes object
     */
    add(panes: google.maps.MapPanes): void;
    /**
     * Draw the overlay. Called when the overlay is being drawn or updated.
     *
     * @internal
     * @param {google.maps.MapCanvasProjection} projection The Google maps projection object
     */
    draw(projection: google.maps.MapCanvasProjection): void;
}
type ImageOverlayValue = ImageOverlay | ImageOverlayOptions | string;
/**
 * Helper function to set up the ImageOverlay class
 *
 * @param {ImageOverlayValue} [options] The ImageOverlay options or image URL
 * @param {LatLngBoundsValue} [bounds] The bounds where the image should be displayed (if options is a string)
 * @returns {ImageOverlay}
 */
declare const imageOverlay: (options?: ImageOverlayValue, bounds?: LatLngBoundsValue) => ImageOverlay;

type PlacesSearchBoxOptions = {
    bounds?: LatLngBoundsValue;
    input: HTMLInputElement;
};
type PlacesSearchBoxEvent = 'places_changed';
type PlacesSearchBoxEventObject = Event & {
    places: google.maps.places.PlaceResult[];
    bounds: LatLngBounds;
};
type PlacesSearchBoxEventCallback = (event: PlacesSearchBoxEventObject) => void;
/**
 * The PlacesSearchBox class
 */
declare class PlacesSearchBox extends Evented {
    #private;
    /**
     * Constructor
     *
     * @param {string | HTMLInputElement | PlacesSearchBoxOptions} [input] The input reference or the options
     * @param {PlacesSearchBoxOptions} [options] The places search box options if the input is reference to the input element
     */
    constructor(input?: string | HTMLInputElement | PlacesSearchBoxOptions, options?: PlacesSearchBoxOptions);
    /**
     * Get the bounds to which query predictions are biased.
     *
     * @returns {LatLngBounds | undefined}
     */
    get bounds(): LatLngBounds | undefined;
    /**
     * Sets the region to use for biasing query predictions.
     *
     * Results will only be biased towards this area and not be completely restricted to it.
     *
     * @param {LatLngBoundsValue} value The bounds to set
     */
    set bounds(value: LatLngBoundsValue);
    /**
     * Get the input reference
     *
     * @returns {HTMLInputElement | undefined}
     */
    get input(): HTMLInputElement | undefined;
    /**
     * Set the input reference
     *
     * @param {string | HTMLInputElement} value The input HTMLInputElement or the selector for the input element
     */
    set input(value: string | HTMLInputElement);
    /**
     * Get the bounds to which query predictions are biased.
     *
     * @returns {LatLngBounds | undefined}
     */
    getBounds(): LatLngBounds | undefined;
    /**
     * Gets the first place that has been found
     *
     * The results from the places_changed event is typically one place and it's the place that the user clicked on.
     *
     * @returns {google.maps.places.PlaceResult | undefined}
     */
    getPlace(): google.maps.places.PlaceResult | undefined;
    /**
     * Get the places that have been found
     *
     * This is typically one place and it's the place that the user clicked on.
     *
     * @returns {google.maps.places.PlaceResult[]}
     */
    getPlaces(): google.maps.places.PlaceResult[];
    /**
     * Get the map bounds based on the places that have been found.
     *
     * @returns {LatLngBounds|undefined}
     */
    getPlacesBounds(): LatLngBounds | undefined;
    /**
     * Initialize the places search box object
     *
     * This must be called in order for the places search box to work.
     *
     * @returns {Promise<void>}
     */
    init(): Promise<void>;
    /**
     * Returns whether the places search box object has been initialized
     *
     * @returns {boolean}
     */
    isInitialized(): boolean;
    /**
     * @inheritdoc
     */
    hasListener(type: PlacesSearchBoxEvent, callback?: PlacesSearchBoxEventCallback): boolean;
    /**
     * @inheritdoc
     */
    off(type?: PlacesSearchBoxEvent, callback?: PlacesSearchBoxEventCallback, options?: EventListenerOptions): void;
    /**
     * @inheritdoc
     */
    on(type: PlacesSearchBoxEvent, callback: PlacesSearchBoxEventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onImmediate(type: PlacesSearchBoxEvent, callback: PlacesSearchBoxEventCallback, config?: EventConfig): void;
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
    onPlacesChanged(callback: (places: google.maps.places.PlaceResult[], bounds: LatLngBounds) => void): void;
    /**
     * @inheritdoc
     */
    once(type: PlacesSearchBoxEvent, callback?: PlacesSearchBoxEventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onceImmediate(type: PlacesSearchBoxEvent, callback?: PlacesSearchBoxEventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    only(type: PlacesSearchBoxEvent, callback: PlacesSearchBoxEventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onlyOnce(type: PlacesSearchBoxEvent, callback: PlacesSearchBoxEventCallback, config?: EventConfig): void;
    /**
     * Sets the region to use for biasing query predictions.
     *
     * Results will only be biased towards this area and not be completely restricted to it.
     *
     * @param {LatLngBoundsValue} value The bounds to set
     * @returns {PlacesSearchBox}
     */
    setBounds(value: LatLngBoundsValue): PlacesSearchBox;
    /**
     * Set the input reference
     *
     * @param {string|HTMLInputElement} input The input HTMLInputElement or the selector for the input element
     * @returns {PlacesSearchBox}
     */
    setInput(input: string | HTMLInputElement): PlacesSearchBox;
    /**
     * Set the places search box options
     *
     * @param {PlacesSearchBoxOptions} options The options to set
     * @returns {PlacesSearchBox}
     */
    setOptions(options: PlacesSearchBoxOptions): PlacesSearchBox;
}
type PlacesSearchBoxValue = HTMLInputElement | string | PlacesSearchBox | PlacesSearchBoxOptions;
/**
 * Helper function to set up the places search box object
 *
 * @param {PlacesSearchBoxValue} [input] The input reference or the options
 * @param {PlacesSearchBoxOptions} [options] The places search box options
 * @returns {PlacesSearchBox}
 */
declare const placesSearchBox: (input?: PlacesSearchBoxValue, options?: PlacesSearchBoxOptions) => PlacesSearchBox;

type PolylineIconOptions = {
    fixedRotation?: boolean;
    icon?: SvgSymbolValue;
    offset?: string;
    repeat?: string;
};
declare class PolylineIcon extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {PolylineIconOptions} [options] The polyline icon options
     */
    constructor(options?: PolylineIconOptions);
    /**
     * Get the fixed rotation setting for the icon
     *
     * @returns {boolean} True if the icon has a fixed rotation, false otherwise
     */
    get fixedRotation(): boolean;
    /**
     * Set the fixed rotation setting for the icon
     *
     * @param {boolean} fixedRotation If true, each icon in the sequence has the same fixed rotation
     *      regardless of the angle of the edge on which it lies. If false, case each icon in the
     *      sequence is rotated to align with its edge.
     */
    set fixedRotation(fixedRotation: boolean);
    /**
     * Get the icon value
     *
     * @returns {SvgSymbol|undefined} The icon value or undefined if not set
     */
    get icon(): SvgSymbol | undefined;
    /**
     * Set the icon value
     *
     * @param {SvgSymbolValue} icon The icon value to set. It can be a string, an object, or an instance of SvgSymbol.
     * @see {@link SvgSymbol} for more details on the icon value
     */
    set icon(icon: SvgSymbolValue);
    /**
     * Get the offset value
     *
     * @returns {string|undefined} The offset value or undefined if not set
     */
    get offset(): string | undefined;
    /**
     * Set the distance from the start of the line at which an icon is to be rendered.
     *
     * @param {number|string} value The distance from the start of the line at which an icon is to be rendered.
     *      is distance may be expressed as a percentage of line's length (e.g. '50%') or in pixels (e.g. '50px').
     */
    set offset(value: number | string);
    /**
     * Get the repeat value
     *
     * @returns {string|undefined} The repeat value or undefined if not set
     */
    get repeat(): string | undefined;
    /**
     * Set the repeat value. This sets the distance between consecutive icons along the polyline.
     * The repeat value can be expressed in pixels (e.g. '20px') or as a percentage of the polyline's length (e.g. '10%').
     * If the value is a number, it is treated as pixels (e.g. 20 becomes '20px').
     * To disable repeating icons, set the repeat value to 0, '0px' or '0%'.
     *
     * @param {number|string} value The repeat value. It can be a number, a number string, or a string with 'px' or '%' suffix.
     */
    set repeat(value: number | string);
    /**
     * Set the fixed rotation value
     *
     * @param {boolean} fixedRotation If true, each icon in the sequence has the same fixed rotation
     *      regardless of the angle of the edge on which it lies. If false, case each icon in the
     *      sequence is rotated to align with its edge.
     * @returns {PolylineIcon}
     */
    setFixedRotation(fixedRotation: boolean): PolylineIcon;
    /**
     * Set the icon value
     *
     * @param {SvgSymbolValue} icon The icon value to set. It can be a string, an object, or an instance of SvgSymbol.
     * @returns {PolylineIcon} The PolylineIcon instance for method chaining
     */
    setIcon(icon: SvgSymbolValue): PolylineIcon;
    /**
     * Set the distance from the start of the line at which an icon is to be rendered.
     *
     * @param {number|string} value The distance from the start of the line at which an icon is to be rendered.
     *      This distance may be expressed as a percentage of line's length (e.g. '50%') or in pixels (e.g. '50px').
     * @returns {PolylineIcon} The PolylineIcon instance for method chaining
     */
    setOffset(value: number | string): PolylineIcon;
    /**
     * Set the repeat value. This sets the distance between consecutive icons along the polyline.
     * The repeat value can be expressed in pixels (e.g. '20px') or as a percentage of the polyline's length (e.g. '10%').
     * If the value is a number, it is treated as pixels (e.g. 20 becomes '20px').
     * To disable repeating icons, set the repeat value to 0, '0px' or '0%'.
     *
     * @param {number|string} value The repeat value. It can be a number, a number string, or a string with 'px' or '%' suffix.
     * @returns {PolylineIcon} The PolylineIcon instance for method chaining
     */
    setRepeat(value: number | string): PolylineIcon;
    /**
     * Set the icon options
     *
     * @param {PolylineIconOptions} options The polyline icon options
     * @returns {PolylineIcon}
     */
    setOptions(options: PolylineIconOptions): PolylineIcon;
    /**
     * Get the polyline icon options
     *
     * @returns {Promise<google.maps.IconSequence>}
     */
    toGoogle(): Promise<google.maps.IconSequence>;
}
type PolylineIconValue = PolylineIcon | PolylineIconOptions;
/**
 * Helper function to set up the polyline icon object
 *
 * @param {PolylineIconValue} options The polyline icon options or the icon object
 * @returns {PolylineIcon} A PolylineIcon instance
 */
declare const polylineIcon: (options: PolylineIconValue) => PolylineIcon;

type PolylineEvent = 'click' | 'contextmenu' | 'dblclick' | 'drag' | 'dragend' | 'dragstart' | 'mousedown' | 'mousemove' | 'mouseout' | 'mouseover' | 'mouseup' | 'ready';
type CustomData = {
    [key: string]: any;
};
type PolylineSimplifyOptions = {
    debug?: boolean;
    tolerance?: number;
    zoom?: boolean | {
        [zoom: number]: number;
    };
};
type PolylineOptions = {
    clickable?: boolean;
    data?: CustomData;
    dashed?: boolean;
    dashGap?: string | number;
    highlightPolyline?: PolylineOptions | Polyline;
    icons?: PolylineIcon[];
    map?: Map | null;
    path?: LatLngValue[];
    simplify?: boolean | number | 'zoom' | PolylineSimplifyOptions;
    simplifyDebug?: boolean;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
    tooltip?: TooltipValue;
    visible?: boolean;
    zIndex?: number;
};
/**
 * Polyline class
 */
declare class Polyline extends Layer {
    #private;
    /**
     * Constructor
     *
     * @param {PolylineOptions} [options] The polyline options
     */
    constructor(options?: PolylineOptions);
    /**
     * Get whether the polyline handles click events.
     *
     * @returns {boolean|undefined}
     */
    get clickable(): boolean | undefined;
    /**
     * Set whether the polyline handles click events.
     *
     * @param {boolean} value Whether the polyline handles click events.
     */
    set clickable(value: boolean);
    /**
     * Get whether the polyline is drawn as a dashed line.
     *
     * @returns {boolean}
     */
    get dashed(): boolean;
    /**
     * Set whether the polyline is drawn as a dashed line.
     *
     * @param {boolean} value Whether the polyline is drawn as a dashed line.
     */
    set dashed(value: boolean);
    /**
     * Get the gap between the dashes in pixels or percentage.
     *
     * @returns {string}
     */
    get dashGap(): string;
    /**
     * Set the gap between the dashes in pixels or percentage.
     *
     * If a number is set them it will be converted to a string with "px" appended.
     *
     * @param {string|number} value The gap between the dashes in pixels.
     */
    set dashGap(value: string | number);
    /**
     * Get the custom data attached to the polyline object
     *
     * @returns {CustomData}
     */
    get data(): CustomData;
    /**
     * Set custom data to attach to the polyline object
     *
     * @param {CustomData} value The custom data to attach to the polyline object
     */
    set data(value: CustomData);
    /**
     * Get the highlight polyline
     *
     * @returns {Polyline|undefined}
     */
    get highlightPolyline(): Polyline | undefined;
    /**
     * Set the highlight polyline
     *
     * The highlight polyline is a polyline that is shown below the existing polyline to create a "highlight" effect.
     * This is useful when you want to show a highlight effect when the mouse hovers over the polyline.
     *
     * @param {PolylineOptions|Polyline} value The highlight polyline options or the highlight polyline class.
     */
    set highlightPolyline(value: PolylineOptions | Polyline);
    /**
     * Get the icons for the polyline
     *
     * @returns {PolylineIcon[]}
     */
    get icons(): PolylineIcon[];
    /**
     * Set the icons for the polyline
     *
     * You can pass a single icon value or an array of icon values.
     * Each icon value can be an object containing the icon options or a SvgSymbol object.
     *
     * @param {PolylineIconValue|PolylineIconValue[]} value The icon value or an array of icon values.
     */
    set icons(value: PolylineIconValue | PolylineIconValue[]);
    /**
     * Get the map object
     *
     * @returns {Map|null|undefined}
     */
    get map(): Map | null | undefined;
    /**
     * Set the map object
     *
     * @param {Map|null} value The map object. Set to null if you want to remove the polyline from the map.
     */
    set map(value: Map | null);
    /**
     * Get the path of the polyline.
     *
     * The path is an array of LatLng objects defining the path of the polyline.
     *
     * The path is held as plain numbers, so the LatLng objects are created the first time that this
     * is read. Changing the returned array doesn't change the polyline. Use the path property or
     * setPath() to change the path.
     *
     * @returns {LatLngValue[]|undefined}
     */
    get path(): LatLngValue[] | undefined;
    /**
     * Set the path of the polyline.
     * The path is an array of LatLng values defining the path of the polyline.
     * You can pass an array of LatLng objects or an array of LatLngLiteral objects.
     *
     * @param {LatLngValue[]} value The path of the polyline.
     */
    set path(value: LatLngValue[]);
    /**
     * Get how far, in meters, the line drawn on the map is allowed to be from the original path.
     *
     * If the tolerance changes with the zoom level, this is the tolerance for the current zoom level.
     *
     * @returns {number} 0 if the path isn't simplified.
     */
    get simplify(): number;
    /**
     * Set whether to simplify the path that is drawn on the map.
     *
     * Simplifying gives the map fewer points to draw but keeps the same shape.
     * The path property still holds every point.
     *
     * @param {boolean|number|string|PolylineSimplifyOptions} value How far, in meters, the drawn line can be from the
     *      original path. true uses 2 meters. 'zoom' uses the default tolerances for different zoom levels. false or 0
     *      turns simplifying off. Use an object to set your own tolerances for different zoom levels or to log debug information.
     */
    set simplify(value: boolean | number | string | PolylineSimplifyOptions);
    /**
     * Get whether debug information is logged to the console each time the path is simplified
     *
     * @returns {boolean}
     */
    get simplifyDebug(): boolean;
    /**
     * Set whether to log debug information to the console each time the path is simplified.
     *
     * This is the same as the "debug" simplify option. If it's set, it's used instead of the "debug" simplify option.
     *
     * @param {boolean} value Whether to log debug information
     */
    set simplifyDebug(value: boolean);
    /**
     * Get the SVG stroke color
     *
     * @returns {string|undefined}
     */
    get strokeColor(): string | undefined;
    /**
     * Set the SVG stroke color.
     *
     * @param {string} value The SVG stroke color.
     */
    set strokeColor(value: string);
    /**
     * Get the opacity of the stroke.
     * The opacity of the stroke, where 0 is fully transparent and 1 is fully opaque.
     *
     * @returns {number|undefined}
     */
    get strokeOpacity(): number | undefined;
    /**
     * Set the opacity of the stroke.
     *
     * @param {number|string} value The opacity of the stroke.
     */
    set strokeOpacity(value: number | string);
    /**
     * Get the weight of the stroke in pixels.
     *
     * @returns {number|undefined}
     */
    get strokeWeight(): number | undefined;
    /**
     * Set the weight of the stroke.
     *
     * @param {number|string} value The weight of the stroke.
     */
    set strokeWeight(value: number | string);
    /**
     * Get whether the polyline is visible on the map.
     *
     * @returns {boolean|undefined}
     */
    get visible(): boolean | undefined;
    /**
     * Set whether the polyline is visible on the map.
     *
     * @param {boolean} value Whether the polyline is visible on the map.
     */
    set visible(value: boolean);
    /**
     * Get the zIndex of the polyline.
     *
     * @returns {number|undefined}
     */
    get zIndex(): number | undefined;
    /**
     * Set the zIndex of the polyline.
     *
     * @param {number|string} value The zIndex of the polyline.
     */
    set zIndex(value: number | string);
    /**
     * Clones the polyline
     *
     * @returns {Polyline}
     */
    clone(): Polyline;
    /**
     * Get any custom data attached to the marker object.
     *
     * Optionally pass a data key to get the value for that key.
     *
     * @param {string} [key] The object key to get data for. If not set then all data is returned.
     * @returns {any}
     */
    getData(key?: string): any;
    /**
     * Returns whether the polyline has a zIndex set.
     *
     * @returns {boolean}
     */
    hasZIndex(): boolean;
    /**
     * Hide the polyline
     *
     * @returns {Polyline}
     */
    hide(): Polyline;
    /**
     * Display the highlight polyline if it exists
     *
     * You can override the current highlight options by passing in the options parameter.
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
     * @param {PolylineOptions} [options] The polyline options to override the existing highlight polyline options.
     * @returns {Polyline}
     */
    highlight(options?: PolylineOptions): Polyline;
    /**
     * Initialize the polyline
     *
     * This is used when another element (like a tooltip) needs to be attached to the polyline,
     * but needs to make sure that the polyline exists first.
     *
     * This is not intended to be called outside of this library.
     *
     * @internal
     * @returns {Promise<void>}
     */
    init(): Promise<void>;
    /**
     * @inheritdoc
     */
    hasListener(type: PolylineEvent, callback?: EventCallback): boolean;
    /**
     * @inheritdoc
     */
    off(type?: PolylineEvent, callback?: EventCallback, options?: EventListenerOptions): void;
    /**
     * @inheritdoc
     */
    removeCalledOnceListeners(type: string, listeners: EventListenerData[]): void;
    /**
     * @inheritdoc
     */
    on(type: PolylineEvent, callback: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onImmediate(type: PolylineEvent, callback: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    once(type: PolylineEvent, callback?: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onceImmediate(type: PolylineEvent, callback?: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    only(type: PolylineEvent, callback: EventCallback, config?: EventConfig): void;
    /**
     * @inheritdoc
     */
    onlyOnce(type: PolylineEvent, callback: EventCallback, config?: EventConfig): void;
    /**
     * Add an event listener for when the polyline is loaded and ready for use.
     *
     * @param {EventCallback} [callback] The callback function to call when the event is dispatched.
     */
    onReady(callback: EventCallback): void;
    /**
     * Sets the polyline to be drawn as a dashed line
     *
     * @param {boolean} dashed Whether the polyline is drawn as a dashed line
     * @param {string|number} [dashGap] The gap between the dashes in pixels or percentage.
     * @returns {Polyline} The polyline object
     */
    setDashed(dashed: boolean, dashGap?: string | number): Polyline;
    /**
     * Set the gap between the dashes in pixels.
     *
     * @param {string|number} gap The gap between the dashes in pixels or percentage. This is only used if the polyline is drawn as a dashed line.
     * @returns {Polyline} The polyline object
     */
    setDashGap(gap: string | number): Polyline;
    /**
     * Set the highlight polyline
     *
     * The highlight polyline is a polyline that is shown below the existing polyline to create a "highlight" effect.
     * This is useful when you want to show a highlight effect when the mouse hovers over the polyline.
     *
     * @param {PolylineOptions|Polyline} value The highlight polyline options or the highlight polyline class.
     * @returns {Polyline}
     */
    setHighlightPolyline(value: PolylineOptions | Polyline): Polyline;
    /**
     * Set the icons for the polyline
     *
     * You can pass a single icon value or an array of icon values.
     * Each icon value can be an object containing the icon options or a SvgSymbol object.
     *
     * @param {PolylineIconValue|PolylineIconValue[]} value The icon value or an array of icon values.
     * @returns {Polyline} The polyline object
     */
    setIcons(value: PolylineIconValue | PolylineIconValue[]): Polyline;
    /**
     * Adds the polyline to the map object
     *
     * Alternate of show()
     *
     * @param {Map} value The map object. Set to null if you want to remove the polyline from the map.
     * @param {boolean} [isVisible] Whether the polyline as visible on the map.
     * @returns {Promise<Polyline>}
     */
    setMap(value: Map | null, isVisible?: boolean): Promise<Polyline>;
    /**
     * Set the Polyline options
     *
     * @param {PolylineOptions} options The Polyline options
     * @returns {Polyline}
     */
    setOptions(options: PolylineOptions): Polyline;
    /**
     * Set whether to simplify the path that is drawn on the map.
     *
     * Simplifying gives the map fewer points to draw but keeps the same shape.
     * The path property still holds every point.
     *
     * @param {boolean|number|string|PolylineSimplifyOptions} value How far, in meters, the drawn line can be from the
     *      original path. true uses 2 meters. 'zoom' uses the default tolerances for different zoom levels. false or 0
     *      turns simplifying off. Use an object to set your own tolerances for different zoom levels or to log debug information.
     * @returns {Polyline}
     */
    setSimplify(value: boolean | number | string | PolylineSimplifyOptions): Polyline;
    /**
     * Set whether to log debug information to the console each time the path is simplified.
     *
     * This is the same as the "debug" simplify option. If it's set, it's used instead of the "debug" simplify option.
     *
     * @param {boolean} value Whether to log debug information
     * @returns {Polyline}
     */
    setSimplifyDebug(value: boolean): Polyline;
    /**
     * Se the path of the polyline.
     *
     * @param {LatLngValue[]} path The path of the polyline.
     * @returns {Polyline}
     */
    setPath(path: LatLngValue[]): Polyline;
    /**
     * Set the SVG stroke color.
     *
     * @param {string} strokeColor The SVG stroke color.
     * @returns {Polyline}
     */
    setStrokeColor(strokeColor: string): Polyline;
    /**
     * Set the opacity of the stroke.
     *
     * @param {number|string} strokeOpacity The opacity of the stroke.
     * @returns {Polyline}
     */
    setStrokeOpacity(strokeOpacity: number | string): Polyline;
    /**
     * Set the weight of the stroke.
     *
     * @param {number|string} strokeWeight The weight of the stroke.
     * @returns {Polyline}
     */
    setStrokeWeight(strokeWeight: number | string): Polyline;
    /**
     * Set whether the polyline is visible on the map.
     *
     * @param {boolean} visible Whether the polyline is visible on the map.
     * @returns {Polyline}
     */
    setVisible(visible: boolean): Polyline;
    /**
     * Show the polyline on the map
     *
     * This will also set the map object if it's passed
     *
     * @param {Map} [map] The map object. Don't need to pass this if the map is already set on the polyline.
     * @returns {Promise<Polyline>}
     */
    show(map?: Map): Promise<Polyline>;
    /**
     * Get the Google maps Polyline object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/info-window#Polyline
     *
     * @returns {Promise<google.maps.Polyline>}
     */
    toGoogle(): Promise<google.maps.Polyline>;
    /**
     * Hide the highlight polyline if it exists
     *
     * @returns {Polyline}
     */
    unhighlight(): Polyline;
}
type PolylineValue = Polyline | PolylineOptions;
/**
 * Helper function to set up the polyline object
 *
 * @param {PolylineValue} [options] The polyline options or the polyline class
 * @returns {Polyline}
 */
declare const polyline: (options?: PolylineValue) => Polyline;

type PolylinesByTag = {
    [key: string]: Set<Polyline>;
};
/**
 * The collection of polylines that enable doing bulk actions on polylines.
 * Some of the bulk actions can be filtered by the polyline tag.
 */
declare class PolylineCollection {
    #private;
    /**
     * Holds the Polyline objects by tag
     */
    polylines: PolylinesByTag;
    /**
     * Adds an Polyline to the collection
     *
     * @param {Polyline} p The Polyline object to add
     * @param {string|string[]} [tag] The tag(s) to assign the polyline to. Either a single tag or an array of tags can be passed.
     */
    add(p: Polyline, tag?: string | string[]): void;
    /**
     * Clears the collection
     *
     * This also hides all the polylines in the collection.
     */
    clear(): void;
    /**
     * Clones the collection
     *
     * @returns {PolylineCollection}
     */
    clone(): PolylineCollection;
    /**
     * Returns true if the collection has any polylines
     *
     * @returns {boolean}
     */
    hasData(): boolean;
    /**
     * Hide the Polylines in the collection that have the tag(s) passed
     *
     * @param {string|string[]} tag The tag(s) to hide polylines for. Either a single tag string or an array of tag strings can be passed.
     */
    hide(tag: string | string[]): void;
    /**
     * Hides all the Polylines in the collection
     */
    hideAll(): void;
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
    highlight(tag: string | string[], highlightOptions?: PolylineOptions): void;
    /**
     * Highlight all the Polylines in the collection
     */
    highlightAll(): void;
    /**
     * Returns true if the collection has no polylines
     *
     * @returns {boolean}
     */
    isEmpty(): boolean;
    /**
     * Remove the polyline from the collection, optionally by tag.
     *
     * @param {Polyline} p The polyline object to remove
     * @param {string|string[]} [tag] The tag(s) to remove the polyline from. If not set then the polyline is removed from all tags.
     *      Either a single tag string or an array of tag strings can be passed.
     */
    remove(p: Polyline, tag?: string | string[]): void;
    /**
     * Set options for either all polylines in the collection or for the polylines that have the tag(s) passed.
     *
     * @param {PolylineOptions} options The options to set for the polylines.
     * @param {string|string[]} [tag] The tag(s) to show polylines for. Either a single tag string or an array of tag strings can be passed.
     */
    setOptions(options: PolylineOptions, tag?: string | string[]): void;
    /**
     * Show the Polylines in the collection that have the tag(s) passed
     *
     * @param {string|string[]} tag The tag(s) to show polylines for. Either a single tag string or an array of tag strings can be passed.
     * @param {Map} [map] The map object
     */
    show(tag: string | string[], map: Map): void;
    /**
     * Show all the Polylines in the collection
     *
     * @param {Map} [map] The map object
     */
    showAll(map: Map): void;
    /**
     * Hide the hightlight for the Polylines in the collection that have the tag(s) passed
     *
     * @param {string|string[]} tag The tag(s) to hide the highlighted polylines. Either a single tag string or an array of tag strings can be passed.
     */
    unhighlight(tag: string | string[]): void;
    /**
     * Hide the hightlight for all the Polylines in the collection
     */
    unhighlightAll(): void;
}
/**
 * Helper function to set up the polyline collection object
 *
 * @returns {PolylineCollection}
 */
declare const polylineCollection: () => PolylineCollection;

declare const DEFAULT_SIMPLIFY_TOLERANCE = 2;
/**
 * The default tolerances, in meters, for different zoom levels.
 *
 * Each key is a zoom level and its value is the tolerance to use at that zoom level and higher.
 * Below zoom 14, 10 meters is less than half a pixel on the map. Through zoom 17 the drawn line stays
 * within about 2 pixels of the original path. From zoom 18, 1 meter is smaller than the few meters
 * that GPS points are usually accurate to.
 */
declare const DEFAULT_SIMPLIFY_ZOOM: {
    readonly [zoom: number]: number;
};
/**
 * Simplify a path of latitude/longitude points so that it has fewer points but keeps the same shape.
 *
 * The simplified line stays within the tolerance of the original line. Invalid points are ignored.
 * If the tolerance isn't a number greater than 0 then all the valid points are returned.
 *
 * @param {LatLngValue[]} path The points to simplify
 * @param {number} [tolerance] How far, in meters, the simplified line can be from the original line. Defaults to 2 meters.
 * @returns {LatLng[]}
 */
declare const simplifyPath: (path: LatLngValue[], tolerance?: number) => LatLng[];

export { type AttachEventValue, AutocompleteSearchBox, type AutocompleteSearchBoxOptions, type AutocompleteSearchBoxValue, Base, DEFAULT_SIMPLIFY_TOLERANCE, DEFAULT_SIMPLIFY_ZOOM, type DefaultRenderOptions, Event, EventCallback, EventConfig, EventListenerOptions, Evented, Geocode, type GeocodeComponentRestrictions, type GeocodeOptions, GeocodeResult, GeocodeResults, Icon, IconValue, ImageOverlay, type ImageOverlayOptions, type ImageOverlayValue, type ImageRendererOptions, LatLng, LatLngBounds, LatLngBoundsValue, LatLngValue, Layer, Loader, type LoaderOptions, Map, Marker, MarkerCluster, type MarkerClusterOptions, MarkerCollection, type MarkerLabel, type MarkerOptions, type MarkerValue, Overlay, PlacesSearchBox, type PlacesSearchBoxOptions, type PlacesSearchBoxValue, Point, PointValue, Polyline, PolylineCollection, PolylineIcon, type PolylineIconOptions, type PolylineIconValue, type PolylineOptions, type PolylineSimplifyOptions, type PolylineValue, SizeValue, SvgSymbol, SvgSymbolValue, autocompleteSearchBox, calculateDimensions, callCallback, checkForGoogleMaps, geocode, getBoolean, getNumber, getPixelsFromLatLng, getSizeWithUnit, imageOverlay, isBoolean, isDefined, isFunction, isNull, isNullOrUndefined, isNumber, isNumberOrNumberString, isNumberString, isObject, isObjectWithValues, isPromise, isString, isStringOrNumber, isStringWithValue, isUndefined, loader, marker, markerCluster, markerCollection, objectEquals, objectHasValue, placesSearchBox, polyline, polylineCollection, polylineIcon, renderTemplate, simplifyPath };
