/* ===========================================================================
    Represents a set of x and y coordinates.

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

import { isNumber, isNumberString, isObject } from './helpers';

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
export class Point {
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
                !isNumber(xObject.x) ||
                !isNumberString(xObject.x) ||
                typeof xObject.y === 'undefined' ||
                !isNumber(xObject.y) ||
                !isNumberString(xObject.y)
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
        this.pointObject = new google.maps.Point(this.x, this.y);
    }

    /**
     * Returns the Google maps point object
     *
     * @link https://developers.google.com/maps/documentation/javascript/reference/coordinates#Point
     * @returns {google.maps.Point}
     */
    get(): google.maps.Point {
        return this.pointObject;
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
}

// Possible values for the point in other classes
export type PointValue = Point | number[] | string[] | PointObject;

/**
 * Helper function to set up the point object
 *
 * @param {XPoint} x The x value
 * @param {number|string }y The y value
 * @returns {Point}
 */
export const point = (x: PointValue, y?: number | string): Point => {
    if (x instanceof Point) {
        return x;
    }
    return new Point(x, y);
};
