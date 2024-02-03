/* global google */
/*  eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types  */

/**
 * Returns if the thing is a function
 *
 * @param {any} thing The thing to test
 * @returns {boolean}
 */
export const isFunction = (thing: any): thing is Function => typeof thing === 'function';

/**
 * Returns if the value is a valid number
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
export const isNumber = (thing: any): thing is number =>
    !Number.isNaN(thing) && typeof thing === 'number' && thing !== Infinity;

/**
 * Returns if the given value is a string that represents a numerical value
 *   e.g. returns true for `"34"` and false for `"text34"` and `34`
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
export const isNumberString = (thing: any): thing is string =>
    typeof thing === 'string' && !Number.isNaN(Number(thing)) && thing !== 'Infinity';

/**
 * Returns if the given value is a number or string that represents a numerical value
 *   e.g. returns true for 34 or "34" and false for "text34" and "text"
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
export const isNumberOrNumberString = (thing: any): thing is number | string =>
    isNumber(thing) || isNumberString(thing);

/**
 * Returns if the value is a string
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
export const isString = (thing: any): thing is string => typeof thing === 'string';

/**
 * Returns if the value is string and has a length greater than 0
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
export const isStringWithValue = (thing: any): thing is string => isString(thing) && thing.trim().length > 0;

/**
 * Returns if the value is a valid string or number
 *
 * @param {unknown} thing The value to test against
 * @returns {boolean}
 */
export const isStringOrNumber = (thing: unknown): thing is string | number =>
    isStringWithValue(thing) || isNumber(thing);

/**
 * Get the number value for the given thing
 * If the thing is a number, return it
 * If the thing is a string that represents a number, return the number
 * Otherwise, return NaN
 *
 * @param {any} thing The value to convert to a number
 * @returns {number|typeof NaN}
 */
export const getNumber = (thing: any): number | typeof NaN => {
    if (isNumber(thing)) {
        return thing;
    }
    if (isNumberString(thing)) {
        return Number(thing);
    }
    return NaN;
};

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
export const getBoolean = (thing: any): boolean => {
    if (typeof thing === 'boolean') {
        return thing;
    }
    if (typeof thing === 'string') {
        const val = thing.toLowerCase();
        if (val === 'true' || val === 'yes' || val === '1') {
            return true;
        }
    }
    if (isNumber(thing)) {
        return thing === 1;
    }
    return false;
};
/**
 * Returns if the value is an object
 *
 * https://attacomsian.com/blog/javascript-check-variable-is-object
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
export const isObject = <T = object>(thing: any): thing is T =>
    Object.prototype.toString.call(thing) === '[object Object]';

/**
 * Returns if the value is an object
 *
 * https://attacomsian.com/blog/javascript-check-variable-is-object
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
export const isObjectWithValues = <T = object>(thing: any): thing is T =>
    Object.prototype.toString.call(thing) === '[object Object]' && Object.keys(thing).length > 0;

/**
 * Get the pixel location of the element from the LagLng value
 *
 * @param {google.maps.Map} map The Google map object
 * @param {google.maps.LatLng} position The Google maps LatLng object
 * @returns {google.maps.Point}
 */
export const getPixelsFromLatLng = (map: google.maps.Map, position: google.maps.LatLng): google.maps.Point => {
    const projection = map.getProjection();
    const bounds = map.getBounds();
    const topRight = projection.fromLatLngToPoint(bounds.getNorthEast());
    const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest());
    const scale = 2 ** map.getZoom();
    const worldPoint = projection.fromLatLngToPoint(position);
    return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
};

/**
 * Checks to see if Google maps has been loaded
 *
 * @param {string} object The object that needs Google maps
 * @param {string} [library] An optional Google maps library class to check for. This needs to be part of the google.maps object
 * @param {boolean} [throwError] An optional flag to throw an error if the Google maps library is not loaded
 * @returns {boolean}
 */
export const checkForGoogleMaps = (object: string, library?: string, throwError?: boolean): boolean => {
    let passed = false;
    const doError = typeof throwError === 'boolean' ? throwError : true;
    if (typeof google !== 'undefined' && isObject(google) && isObject(google.maps)) {
        if (library) {
            passed = typeof google.maps[library] !== 'undefined';
        } else {
            passed = true;
        }
    }
    if (!passed) {
        let msg = 'The Google Maps Javascript API library must be loaded.';
        if (library) {
            msg = ` The google.maps.${library} class is not available. Did you load the Google Maps Javascript API?`;
        }
        msg += ` You must wait to run the ${object} code until the Google map library is loaded.`;
        msg += ' See https://developers.google.com/maps/documentation/javascript for more information.';
        if (doError) {
            throw new Error(msg);
        }
    }
    return passed;
};
