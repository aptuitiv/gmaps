/* ===========================================================================
    Represents a set of x and y coordinates.

    The Point value is immutable. Adding, subtracting, or changing the x/y values will return
    a new Point object.

    All methods and options of other classes that take a Point object as a parameter
    also support the point value as an array of [x, y] pairs, or a {x, y} object.
    The following are equivalent:

    See https://aptuitiv.github.io/gmaps-docs/api-reference/utilities/point for documentation.
=========================================================================== */

/* global google */
/* eslint-disable no-use-before-define */

import Base from './Base';
import { checkForGoogleMaps, isNumber, isNumberString, isObject } from './helpers';

// The object for the x and y coordinates
// Example: `{x: 34, y: 6}`
type PointObject = {
    x: number | string;
    y: number | string;
};

// The possible types for the X value
export type XPoint = number | number[] | string | string[] | PointObject;

/**
 * The Point class to set up and manage x/y coordinates
 */
export class Point extends Base {
    /**
     * Holds the Google maps point object
     */
    #pointObject: google.maps.Point;

    /**
     * The X value
     */
    #x: number;

    /**
     * The Y value
     */
    #y: number;

    /**
     * Constructor
     *
     * @param {XPoint|Point} [x] The X value
     * @param {number|string} [y] The Y value
     */
    constructor(x?: XPoint | Point, y?: number | string) {
        super('point');
        if (typeof x !== 'undefined') {
            this.set(x, y);
        }
    }

    /**
     * Get the x value
     *
     * @returns {number}
     */
    get x(): number {
        return this.#x;
    }

    /**
     * Set the x value
     *
     * @param {number|string} x The x value. Ideally it's a number but it could be a number string
     */
    set x(x: number | string) {
        if (isNumberString(x)) {
            this.#x = Number(x);
        } else if (isNumber(x)) {
            this.#x = x;
        }
        if (isObject(this.#pointObject)) {
            this.#pointObject.x = this.#x;
        }
    }

    /**
     * Get the y value
     *
     * @returns {number}
     */
    get y(): number {
        return this.#y;
    }

    /**
     * Set the y value
     *
     * @param {number|string} y The y value. Ideally it's a number but it could be a number string
     */
    set y(y: number | string) {
        if (isNumberString(y)) {
            this.#y = Number(y);
        } else if (isNumber(y)) {
            this.#y = y;
        }
        if (isObject(this.#pointObject)) {
            this.#pointObject.y = this.#y;
        }
    }

    /**
     * Adds the x/y values to this point.
     *
     * This is the best way to either explicitly add an absolute x/y position, or to combine
     * two points together. The other point could include negative values.
     *
     * @param {PointValue} x The x value, or the Point object, or an array of [x, y] pairs, or a {x, y} object
     * @param {number|string} [y] The y value
     * @returns {Point}
     */
    add(x: PointValue, y?: number | string): Point {
        const p2 = point(x, y);
        return new Point(this.x + p2.x, this.y + p2.y);
    }

    /**
     * Rounds the x/y values up to the nearest integer.
     * If the value is already an integer, it will return the same value.
     *
     * @returns {Point}
     */
    ceil(): Point {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    }

    /**
     * Returns a new copy of the point
     *
     * @returns {Point}
     */
    clone(): Point {
        return new Point(this.x, this.y);
    }

    /**
     * Divides the x/y values by a number.
     *
     * @param {number|string} num The number to divide the x and y values by
     * @returns {Point}
     */
    divide(num: number | string): Point {
        if (isNumber(num) && num !== 0) {
            this.x /= num;
            this.y /= num;
        }
        if (isNumberString(num) && Number(num) !== 0) {
            const n = Number(num);
            this.x /= n;
            this.y /= n;
        }
        return this;
    }

    /**
     * This returns the cartesian distance between this point and the given point.
     *
     * @param {PointValue} p The point to compare to
     * @returns {number}
     */
    distanceTo(p: PointValue): number {
        const p2 = point(p);
        const dx = this.x - p2.x;
        const dy = this.y - p2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Returns whether the current point is equal to the given point
     *
     * @param {PointValue} p The point value to compare
     * @returns {boolean}
     */
    equals(p: PointValue): boolean {
        const p2 = point(p);
        return this.x === p2.x && this.y === p2.y;
    }

    /**
     * Returns a copy of the curent point with the x/y values rounded down to the nearest integer.
     * If the value is already an integer, it will return the same value.
     *
     * @returns {Point}
     */
    floor(): Point {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    }

    /**
     * Get the x value
     *
     * @returns {number}
     */
    getX(): number {
        return this.x;
    }

    /**
     * Get the y value
     *
     * @returns {number}
     */
    getY(): number {
        return this.y;
    }

    /**
     * Returns whether the x/y pair are valid values
     *
     * @returns {boolean}
     */
    isValid(): boolean {
        return isNumber(this.x) && isNumber(this.y);
    }

    /**
     * Multiplies the x/y values by a number
     *
     * @param {number|string} num The number to multiply the x and y values by
     * @returns {Point}
     */
    multiply(num: number | string): Point {
        if (isNumber(num) && num !== 0) {
            this.x *= num;
            this.y *= num;
        }
        if (isNumberString(num) && Number(num) !== 0) {
            const n = Number(num);
            this.x *= n;
            this.y *= n;
        }
        return this;
    }

    /**
     * Rounds the x/y values to the nearest integer.
     *
     * @returns {Point}
     */
    round(): Point {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    }

    /**
     * Set the x/y values
     *
     * @param {XPoint|Point} x The x value, or the Point object, or an array of [x, y] pairs, or a {x, y} object
     * @param {number|string} y The y value
     * @returns {Point}
     */
    set(x: XPoint | Point, y?: number | string): Point {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        if (Array.isArray(x)) {
            const [xValue, yValue] = x;
            this.x = xValue;
            this.y = yValue;
        } else if (isObject(x)) {
            const xObject: PointObject = x as unknown as PointObject;
            if (typeof xObject.x !== 'undefined') {
                this.x = xObject.x;
            }
            if (typeof xObject.y !== 'undefined') {
                this.y = xObject.y;
            }
        } else if ((x as any) instanceof Point) {
            this.x = (x as any).x;
            this.y = (x as any).y;
        } else {
            this.x = x;
            this.y = y;
        }
        /* eslint-enable @typescript-eslint/no-explicit-any */
        return this;
    }

    /**
     * Set the x value
     *
     * @param {number|string} x The x value. Ideally it's a number but it could be a number string
     * @returns {Point}
     */
    setX(x: number | string): Point {
        this.x = x;
        return this;
    }

    /**
     * Set the y value
     *
     * @param {number|string} y The y value. Ideally it's a number but it could be a number string
     * @returns {Point}
     */
    setY(y: number | string): Point {
        this.y = y;
        return this;
    }

    /**
     * Subtract the x/y values to this point.
     *
     * The x/y values to subtract should ideally be absolute values to avoid confusion.
     * While they can include negative numbers, that may return unexpected results.
     *
     * @param {PointValue} x The x value, or the Point object, or an array of [x, y] pairs, or a {x, y} object
     * @param {number|string} [y] The y value
     * @returns {Point}
     */
    subtract(x: PointValue, y?: number | string): Point {
        const p2 = point(x, y);
        this.x -= p2.x;
        this.y -= p2.y;
        return this;
    }

    /**
     * Returns the Google maps point object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/coordinates#Point
     *
     * @returns {google.maps.Point}
     */
    toGoogle(): google.maps.Point {
        if (checkForGoogleMaps('Point', 'Point')) {
            if (!isObject(this.#pointObject)) {
                this.#pointObject = new google.maps.Point(this.x, this.y);
            }
            return this.#pointObject;
        }
        return null;
    }

    /**
     * Change the x/y values to the integer part of a number by removing any fractional digits.
     *
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc
     *
     * @returns {Point}
     */
    trunc(): Point {
        this.x = Math.trunc(this.x);
        this.y = Math.trunc(this.y);
        return this;
    }
}

// Possible values for the point in other classes
export type PointValue = Point | number | number[] | string | string[] | PointObject;

/**
 * Helper function to set up the point object
 *
 * @param {PointValue} [x] The x value, or the Point object, or an array of [x, y] pairs, or a {x, y} object
 * @param {number|string} [y] The y value
 * @returns {Point}
 */
export const point = (x?: PointValue, y?: number | string): Point => new Point(x, y);
