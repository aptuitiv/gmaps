/// <reference types="google.maps" />
type SizeObject = {
    height: number | string;
    width: number | string;
};
export type WidthSize = number | number[] | string | string[] | SizeObject;
/**
 * The Size class to set up and manage width and height values for an element
 */
export declare class Size {
    /**
     * Holds the Google maps size object
     */
    private sizeObject;
    /**
     * The width value
     */
    private width;
    /**
     * The height value
     */
    private height;
    /**
     * The type of object. For this class it will always be "size"
     *
     * You can use this in your logic to determine what type of object you're dealing with.
     * if (thing.objectType === 'size') {}
     */
    objectType: string;
    /**
     * Constructor
     *
     * @param {WidthSize} width The X value
     * @param {number|string} height The Y value
     */
    constructor(width: WidthSize, height?: number | string);
    /**
     * Returns the size object
     *
     * @link https://developers.google.com/maps/documentation/javascript/reference/coordinates#Size
     * @returns {google.maps.Size}
     */
    get(): google.maps.Size;
    /**
     * Get the height value
     *
     * @returns {number}
     */
    getHeight(): number;
    /**
     * Get the width value
     *
     * @returns {number}
     */
    getWidth(): number;
}
export type SizeValue = Size | number[] | string[] | SizeObject;
/**
 * Helper function to set up the size object
 *
 * @param {WidthSize} width The width value
 * @param {number|string }height The height value
 * @returns {Size}
 */
export declare const size: (width: SizeValue, height?: number | string) => Size;
export {};
