/* ===========================================================================
    Represents a set of x and y coordinates.

    The Point value is immutable. Adding, subtracting, or changing the x/y values will return
    a new Point object.

    All methods and options of other classes that take a Point object as a parameter
    also support the point value as an array of [x, y] pairs, or a {x, y} object.
    The following are equivalent:

    icon.origin([10, 32]);
    icon.origin({x: 10, y: 32});

    The following are valid ways to set up a point object:

    point(34, 6);
    point([34, 6]);
    point({x: 34, y: 6});
    point(pointClassInstance);
=========================================================================== */

/* global google */
/* eslint-disable no-use-before-define */

import Base from './Base';
import { checkForGoogleMaps, isNumber, isNumberOrNumberString, isNumberString, isObject } from './helpers';

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
    private pointObject: google.maps.Point;

    /**
     * The X value
     */
    private x: number;

    /**
     * The Y value
     */
    private y: number;

    /**
     * Constructor
     *
     * @param {XPoint} x The X value
     * @param {number|string} y The Y value
     */
    constructor(x: XPoint, y?: number | string) {
        super('point');
        if (Array.isArray(x)) {
            if ((isNumber(x[0]) || isNumberString(x[0])) && (isNumber(x[1]) || isNumberString(x[1]))) {
                if (isNumberString(x[0])) {
                    this.x = Number(x[0]);
                } else {
                    [this.x] = x;
                }
                if (isNumberString(x[1])) {
                    this.y = Number(x[1]);
                } else {
                    this.y = x.pop() as number;
                }
            } else {
                throw new Error('Invalid x/y pair');
            }
        } else if (isObject(x)) {
            const xObject: PointObject = x as unknown as PointObject;
            if (
                typeof xObject.x === 'undefined' ||
                !isNumberOrNumberString(xObject.x) ||
                typeof xObject.y === 'undefined' ||
                !isNumberOrNumberString(xObject.y)
            ) {
                throw new Error('Invalid x/y pair');
            }
            if (isNumberString(xObject.x)) {
                this.x = Number(xObject.x);
            } else {
                this.x = xObject.x;
            }
            if (isNumberString(xObject.y)) {
                this.y = Number(xObject.y);
            } else {
                this.y = xObject.y;
            }
        } else {
            if (isNumberString(x)) {
                this.x = Number(x);
            } else {
                this.x = x;
            }
            if (isNumberString(y)) {
                this.y = Number(y);
            } else {
                this.y = y;
            }
        }
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
     * Adds the x/y values to this point and returns the result as a new Point object.
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
        return new Point(this.x + p2.getX(), this.y + p2.getY());
    }

    /**
     * Returns a copy of the curent point with the x/y values rounded up to the nearest integer.
     * If the value is already an integer, it will return the same value.
     *
     * @returns {Point}
     */
    ceil(): Point {
        return new Point(Math.ceil(this.x), Math.ceil(this.y));
    }

    /**
     * Divides the x/y values by a number and returns the result as a new Point object.
     *
     * @param {number|string} num The number to divide the x and y values by
     * @returns {Point}
     */
    divide(num: number | string): Point {
        if (isNumber(num) && num !== 0) {
            return new Point(this.x / num, this.y / num);
        }
        if (isNumberString(num) && Number(num) !== 0) {
            const n = Number(num);
            return new Point(this.x / n, this.y / n);
        }
        return this.clone();
    }

    /**
     * This returns the cartesian distance between this point and the given point.
     *
     * @param {PointValue} p The point to compare to
     * @returns {number}
     */
    distanceTo(p: PointValue): number {
        const p2 = point(p);
        const dx = this.x - p2.getX();
        const dy = this.y - p2.getY();
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
        return this.x === p2.getX() && this.y === p2.getY();
    }

    /**
     * Returns a copy of the curent point with the x/y values rounded down to the nearest integer.
     * If the value is already an integer, it will return the same value.
     *
     * @returns {Point}
     */
    floor(): Point {
        return new Point(Math.floor(this.x), Math.floor(this.y));
    }

    /**
     * Returns the Google maps point object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/coordinates#Point
     *
     * @returns {google.maps.Point}
     */
    get(): google.maps.Point {
        if (checkForGoogleMaps('Point', 'Point')) {
            if (!isObject(this.pointObject)) {
                this.pointObject = new google.maps.Point(this.x, this.y);
            }
            return this.pointObject;
        }
        return null;
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
     * Multiplies the x/y values by a number and returns the result as a new Point object.
     *
     * @param {number|string} num The number to multiply the x and y values by
     * @returns {Point}
     */
    multipy(num: number | string): Point {
        if (isNumber(num) && num !== 0) {
            return new Point(this.x * num, this.y * num);
        }
        if (isNumberString(num) && Number(num) !== 0) {
            const n = Number(num);
            return new Point(this.x * n, this.y * n);
        }
        return this.clone();
    }

    /**
     * Returns a copy of the curent point with the x/y values rounded to the nearest integer.
     *
     * @returns {Point}
     */
    round(): Point {
        return new Point(Math.round(this.x), Math.round(this.y));
    }

    /**
     * Subtract the x/y values to this point and returns the result as a new Point object.
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
        return new Point(this.x - p2.getX(), this.y - p2.getY());
    }

    /**
     * Returns a copy of the curent point with the x/y values changed to the integer part of a number by removing any fractional digits.
     *
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/trunc
     *
     * @returns {Point}
     */
    trunc(): Point {
        return new Point(Math.trunc(this.x), Math.trunc(this.y));
    }
}

// Possible values for the point in other classes
export type PointValue = Point | number | number[] | string | string[] | PointObject;

/**
 * Helper function to set up the point object
 *
 * @param {PointValue} x The x value, or the Point object, or an array of [x, y] pairs, or a {x, y} object
 * @param {number|string} [y] The y value
 * @returns {Point}
 */
export const point = (x: PointValue, y?: number | string): Point => {
    if (x instanceof Point) {
        return x;
    }
    return new Point(x, y);
};
