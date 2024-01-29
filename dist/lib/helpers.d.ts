/// <reference types="google.maps" />
/**
 * Returns if the thing is a function
 *
 * @param {mixed} thing The thing to test
 * @returns {boolean}
 */
export declare const isFunction: (thing: any) => thing is Function;
/**
 * Returns if the value is a valid number
 *
 * @param {mixed} thing The value to test
 * @returns {boolean}
 */
export declare const isNumber: (thing: any) => thing is number;
/**
 * Returns if the given value is a string that represents a numerical value
 *   e.g. returns true for `"34"` and false for `"text34"` and `34`
 *
 * @param {mixed} thing The value to test
 * @returns {boolean}
 */
export declare const isNumberString: (thing: any) => thing is string;
/**
 * Returns if the value is a string
 *
 * @param {mixed} thing The value to test
 * @returns {boolean}
 */
export declare const isString: (thing: any) => thing is string;
/**
 * Returns if the value is string and has a length greater than 0
 *
 * @param {mixed} thing The value to test
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
 * @param thing The value to convert to a boolean
 * @returns {boolean}
 */
export declare const getBoolean: (thing: any) => boolean;
/**
 * Returns if the value is an object
 *
 * @link https://attacomsian.com/blog/javascript-check-variable-is-object
 *
 * @param {mixed} thing The value to test
 * @returns {boolean}
 */
export declare const isObject: <T = object>(thing: any) => thing is T;
/**
 * Returns if the value is an object
 *
 * @link https://attacomsian.com/blog/javascript-check-variable-is-object
 *
 * @param {mixed} thing The value to test
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
export declare const keyClassKeys: (source: any) => string[];
/**
 * Simulator for extending multiple classes, which Javascript doesn't allow.
 *
 * @link https://medium.com/@thevirtuoid/extending-multiple-classes-in-javascript-2f4752574e65
 *
 * @param parts The classes to extend
 * @returns {any} The bundled class
 */
export declare const extender: (...parts: any) => any;
