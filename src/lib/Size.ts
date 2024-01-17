/* ===========================================================================
    Represents a height and width size in pixels.
    Two-dimensional size, where width is the distance on the x-axis, and height is the distance on the y-axis.
=========================================================================== */

import { isNumber, isNumberString, isObject } from './test-types';

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
export class Size {
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
        if (Array.isArray(width)) {
            if ((isNumber(width[0]) || isNumberString(width[0])) && (isNumber(width[1]) || isNumberString(width[1]))) {
                if (isNumberString(width[0])) {
                    this.width = Number(width[0]);
                } else {
                    [this.width] = width;
                }
                if (isNumberString(width[1])) {
                    this.height = Number(width[1]);
                } else {
                    this.height = width.pop() as number;
                }
            } else {
                throw new Error('Invalid width/height pair');
            }
        } else if (isObject(width)) {
            const widthObject: SizeObject = width as unknown as SizeObject;
            if (
                typeof widthObject.width === 'undefined' ||
                !isNumber(widthObject.width) ||
                !isNumberString(widthObject.width) ||
                typeof widthObject.height === 'undefined' ||
                !isNumber(widthObject.height) ||
                !isNumberString(widthObject.height)
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
export type SizeValue = Size | number[] | string[] | SizeObject;

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
