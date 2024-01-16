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
