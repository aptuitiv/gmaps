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
import { checkForGoogleMaps, isNumber, isNumberString, isObject } from './helpers';

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
     *
     * @private
     * @type {google.maps.Size}
     */
    #sizeObject: google.maps.Size;

    /**
     * The width value
     *
     * @private
     * @type {number}
     */
    #width: number;

    /**
     * The height value
     *
     * @type {number}
     */
    #height: number;

    /**
     * Constructor
     *
     * @param {WidthSize|Size} [width] The X value
     * @param {number|string} [height] The Y value
     */
    constructor(width?: WidthSize | Size, height?: number | string) {
        super('size');
        if (width) {
            this.set(width, height);
        }
    }

    /**
     * Get the height value
     *
     * @returns {number}
     */
    get height(): number {
        return this.#height;
    }

    /**
     * Set the height value
     *
     * @param {number|string} height The height value. Ideally it's a number but it could be a number string
     */
    set height(height: number | string) {
        if (isNumberString(height)) {
            this.#height = Number(height);
        } else if (isNumber(height)) {
            this.#height = height;
        }
        if (isObject(this.#sizeObject)) {
            this.#sizeObject.height = this.#height;
        }
    }

    /**
     * Get the width value
     *
     * @returns {number}
     */
    get width(): number {
        return this.#width;
    }

    /**
     * Set the width value
     *
     * @param {number|string} width The width value. Ideally it's a number but it could be a number string
     */
    set width(width: number | string) {
        if (isNumberString(width)) {
            this.#width = Number(width);
        } else if (isNumber(width)) {
            this.#width = width;
        }
        if (isObject(this.#sizeObject)) {
            this.#sizeObject.width = this.#width;
        }
    }

    /**
     * Returns a new copy of the size
     *
     * @returns {Size}
     */
    clone(): Size {
        return new Size(this.#width, this.#height);
    }

    /**
     * Get the height value
     *
     * @returns {number}
     */
    getHeight(): number {
        return this.#height;
    }

    /**
     * Get the width value
     *
     * @returns {number}
     */
    getWidth(): number {
        return this.#width;
    }

    /**
     * Returns whether the width/height pair are valid values
     *
     * @returns {boolean}
     */
    isValid(): boolean {
        return isNumber(this.#width) && isNumber(this.#height);
    }

    /**
     * Set the width/height values
     *
     * @param {WidthSize|Size} width The width value, or the Size object, or an arraheight of [width, height] pairs, or a {width, height} object
     * @param {number|string} height The height value
     * @returns {Size}
     */
    set(width: WidthSize | Size, height?: number | string): Size {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        if (Array.isArray(width)) {
            const [widthValue, heightValue] = width;
            this.width = widthValue;
            this.height = heightValue;
        } else if (isObject(width)) {
            const widthObject: SizeObject = width as unknown as SizeObject;
            if (typeof widthObject.width !== 'undefined') {
                this.width = widthObject.width;
            }
            if (typeof widthObject.height !== 'undefined') {
                this.height = widthObject.height;
            }
        } else if ((width as any) instanceof Size) {
            this.width = (width as any).getWidth();
            this.height = (width as any).getHeight();
        } else {
            this.width = width;
            this.height = height;
        }
        /* eslint-enable @typescript-eslint/no-explicit-any */
        return this;
    }

    /**
     * Set the height value
     *
     * @param {number|string} height The height value. Ideally it's a number but it could be a number string
     * @returns {Size}
     */
    setHeight(height: number | string): Size {
        this.height = height;
        return this;
    }

    /**
     * Set the width value
     *
     * @param {number|string} width The width value. Ideally it's a number but it could be a number string
     * @returns {Size}
     */
    setWidth(width: number | string): Size {
        this.width = width;
        return this;
    }

    /**
     * Returns the Google maps size object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/coordinates#Size
     *
     * @returns {google.maps.Size|null}
     */
    toGoogle(): google.maps.Size | null {
        if (checkForGoogleMaps('Size', 'Size')) {
            if (!isObject(this.#sizeObject)) {
                this.#sizeObject = new google.maps.Size(this.#width, this.#height);
            }
            return this.#sizeObject;
        }
        return null;
    }
}

// Possible values for the size in other classes
export type SizeValue = Size | number | number[] | string | string[] | SizeObject;

/**
 * Helper function to set up the size object
 *
 * @param {WidthSize} [width] The width value
 * @param {number|string} [height] The height value
 * @returns {Size}
 */
export const size = (width?: SizeValue, height?: number | string): Size => new Size(width, height);
