/* ===========================================================================
    Represents a height and width size in pixels.
    Two-dimensional size, where width is the distance on the x-axis, and height is the distance on the y-axis.

    All methods and options of other classes that take a Size object as a parameter
    also support the size value as an array of [x, y] pairs, or a {x, y} object.
    The following are equivalent:

    icon.origin([10, 32]);
    icon.origin({x: 10, y: 32});

    The following are valid ways to set up a size object:

    size(34, 6);
    size([34, 6]);
    size({x: 34, y: 6});
    size(sizeClassInstance);
=========================================================================== */

/* global google */

import Base from './Base';
import { isNumber, isNumberString, isObject } from './helpers';

// The object for the width and height
// Example: `{width: 34, height: 6}`
type SizeObject = {
    height: number | string;
    width: number | string;
};

// The possible types for the X value
export type WidthSize = number | number[] | string | string[] | SizeObject;

/**
 * The Size class to set up and manage width and height values for an element
 */
export class Size extends Base {
    /**
     * Holds the Google maps size object
     */
    private sizeObject: google.maps.Size;

    /**
     * The width value
     */
    private width: number;

    /**
     * The height value
     */
    private height: number;

    /**
     * Constructor
     *
     * @param {WidthSize} width The X value
     * @param {number|string} height The Y value
     */
    constructor(width: WidthSize, height?: number | string) {
        super('size');
        if (Array.isArray(width)) {
            const [w, h] = width;
            if ((isNumber(w) || isNumberString(w)) && (isNumber(h) || isNumberString(h))) {
                if (isNumberString(w)) {
                    this.width = Number(w);
                } else {
                    this.width = w;
                }
                if (isNumberString(h)) {
                    this.height = Number(h);
                } else {
                    this.height = h;
                }
            } else {
                throw new Error('Invalid width/height pair');
            }
        } else if (isObject(width)) {
            const widthObject: SizeObject = width as unknown as SizeObject;
            if (
                typeof widthObject.width === 'undefined' ||
                (!isNumber(widthObject.width) && !isNumberString(widthObject.width)) ||
                typeof widthObject.height === 'undefined' ||
                (!isNumber(widthObject.height) && !isNumberString(widthObject.height))
            ) {
                throw new Error('Invalid width/height pair');
            }
            if (isNumberString(widthObject.width)) {
                this.width = Number(widthObject.width);
            } else {
                this.width = widthObject.width;
            }
            if (isNumberString(widthObject.height)) {
                this.height = Number(widthObject.height);
            } else {
                this.height = widthObject.height;
            }
        } else {
            if (isNumberString(width)) {
                this.width = Number(width);
            } else {
                this.width = width;
            }
            if (isNumberString(height)) {
                this.height = Number(height);
            } else {
                this.height = height;
            }
        }
        this.sizeObject = new google.maps.Size(this.width, this.height);
    }

    /**
     * Returns the size object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/coordinates#Size
     *
     * @returns {google.maps.Size}
     */
    get(): google.maps.Size {
        return this.sizeObject;
    }

    /**
     * Get the height value
     *
     * @returns {number}
     */
    getHeight(): number {
        return this.height;
    }

    /**
     * Get the width value
     *
     * @returns {number}
     */
    getWidth(): number {
        return this.width;
    }
}

// Possible values for the size in other classes
export type SizeValue = Size | number | number[] | string | string[] | SizeObject;

/**
 * Helper function to set up the size object
 *
 * @param {WidthSize} width The width value
 * @param {number|string }height The height value
 * @returns {Size}
 */
export const size = (width: SizeValue, height?: number | string): Size => {
    if (width instanceof Size) {
        return width;
    }
    return new Size(width, height);
};
