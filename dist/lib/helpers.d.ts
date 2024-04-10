/// <reference types="google.maps" />
/**
 * Returns if the thing is a function
 *
 * @param {any} thing The thing to test
 * @returns {boolean}
 */
export declare const isFunction: (thing: any) => thing is Function;
/**
 * Returns if the value is null.
 *
 * @param {any} thing The thing to test
 * @returns {boolean}
 */
export declare const isNull: (thing: any) => thing is null;
/**
 * Returns if the value is a valid number
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
export declare const isNumber: (thing: any) => thing is number;
/**
 * Returns if the given value is a string that represents a numerical value
 *   e.g. returns true for `"34"` and false for `"text34"` and `34`
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
export declare const isNumberString: (thing: any) => thing is string;
/**
 * Returns if the given value is a number or string that represents a numerical value
 *   e.g. returns true for 34 or "34" and false for "text34" and "text"
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
export declare const isNumberOrNumberString: (thing: any) => thing is string | number;
/**
 * Returns if the value is a string
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
export declare const isString: (thing: any) => thing is string;
/**
 * Returns if the value is string and has a length greater than 0
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
export declare const isStringWithValue: (thing: any) => thing is string;
/**
 * Returns if the value is a valid string or number
 *
 * @param {unknown} thing The value to test against
 * @returns {boolean}
 */
export declare const isStringOrNumber: (thing: unknown) => thing is string | number;
/**
 * Returns if the value is undefined
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
export declare const isUndefined: (thing: any) => thing is undefined;
/**
 * Returns if the value is null or undefined
 *
 * @param {any} thing The thing to test
 * @returns {boolean}
 */
export declare const isNullOrUndefined: (thing: any) => thing is null;
/**
 * Get the number value for the given thing
 * If the thing is a number, return it
 * If the thing is a string that represents a number, return the number
 * Otherwise, return NaN
 *
 * @param {any} thing The value to convert to a number
 * @returns {number|typeof NaN}
 */
export declare const getNumber: (thing: any) => number | typeof NaN;
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
export declare const getBoolean: (thing: any) => boolean;
/**
 * Returns if the value is an object
 *
 * https://attacomsian.com/blog/javascript-check-variable-is-object
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
export declare const isObject: <T = object>(thing: any) => thing is T;
/**
 * Returns if the value is an object
 *
 * https://attacomsian.com/blog/javascript-check-variable-is-object
 *
 * @param {any} thing The value to test
 * @returns {boolean}
 */
export declare const isObjectWithValues: <T = object>(thing: any) => thing is T;
/**
 * Get the pixel location of the element from the LagLng value
 *
 * @param {google.maps.Map} map The Google map object
 * @param {google.maps.LatLng} position The Google maps LatLng object
 * @returns {google.maps.Point}
 */
export declare const getPixelsFromLatLng: (map: google.maps.Map, position: google.maps.LatLng) => google.maps.Point;
/**
 * Checks to see if Google maps has been loaded
 *
 * @param {string} object The object that needs Google maps
 * @param {string} [library] An optional Google maps library class to check for. This needs to be part of the google.maps object
 * @param {boolean} [throwError] An optional flag to throw an error if the Google maps library is not loaded
 * @returns {boolean}
 */
export declare const checkForGoogleMaps: (object: string, library?: string, throwError?: boolean) => boolean;
/**
 * Compare two objects to see if they are equal
 *
 * @param {any} a The first object to compare
 * @param {any} b The second object to compare
 * @returns {boolean}
 */
export declare const objectEquals: (a: any, b: any) => boolean;
