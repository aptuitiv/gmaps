/*  eslint-disable @typescript-eslint/no-explicit-any  */
/*  eslint-disable @typescript-eslint/ban-types  */

/**
 * Returns if the value is a valid number
 *
 * @param {mixed} thing The value to test
 * @returns {boolean}
 */
export const isNumber = (thing: any): thing is number =>
    !Number.isNaN(thing) && typeof thing === 'number' && thing !== Infinity;

/**
 * Returns if the given value is a string that represents a numerical value
 *   e.g. returns true for `"34"` and false for `"text34"` and `34`
 *
 * @param {mixed} thing The value to test
 * @returns {boolean}
 */
export const isNumberString = (thing: any): thing is string =>
    typeof thing === 'string' && !Number.isNaN(Number(thing)) && thing !== 'Infinity';

/**
 * Returns if the value is an object
 *
 * @link https://attacomsian.com/blog/javascript-check-variable-is-object
 *
 * @param {mixed} thing The value to test
 * @returns {boolean}
 */
export const isObject = <T = object>(thing: any): thing is T =>
    Object.prototype.toString.call(thing) === '[object Object]';

/**
 * Returns if the value is an object
 *
 * @link https://attacomsian.com/blog/javascript-check-variable-is-object
 *
 * @param {mixed} thing The value to test
 * @returns {boolean}
 */
export const isObjectWithValues = <T = object>(thing: any): thing is T =>
    Object.prototype.toString.call(thing) === '[object Object]' && Object.keys(thing).length > 0;
