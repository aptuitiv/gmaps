/// <reference types="google.maps" />
import Base from './Base';
type SizeObject = {
    height: number | string;
    width: number | string;
};
export type WidthSize = number | number[] | string | string[] | SizeObject;
/**
 * The Size class to set up and manage width and height values for an element
 */
export declare class Size extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {WidthSize|Size} [width] The X value
     * @param {number|string} [height] The Y value
     */
    constructor(width?: WidthSize | Size, height?: number | string);
    /**
     * Get the height value
     *
     * @returns {number}
     */
    get height(): number;
    /**
     * Set the height value
     *
     * @param {number|string} height The height value. Ideally it's a number but it could be a number string
     */
    set height(height: number | string);
    /**
     * Get the width value
     *
     * @returns {number}
     */
    get width(): number;
    /**
     * Set the width value
     *
     * @param {number|string} width The width value. Ideally it's a number but it could be a number string
     */
    set width(width: number | string);
    /**
     * Returns a new copy of the size
     *
     * @returns {Size}
     */
    clone(): Size;
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
    /**
     * Returns whether the width/height pair are valid values
     *
     * @returns {boolean}
     */
    isValid(): boolean;
    /**
     * Set the width/height values
     *
     * @param {WidthSize|Size} width The width value, or the Size object, or an arraheight of [width, height] pairs, or a {width, height} object
     * @param {number|string} height The height value
     * @returns {Size}
     */
    set(width: WidthSize | Size, height?: number | string): Size;
    /**
     * Set the height value
     *
     * @param {number|string} height The height value. Ideally it's a number but it could be a number string
     * @returns {Size}
     */
    setHeight(height: number | string): Size;
    /**
     * Set the width value
     *
     * @param {number|string} width The width value. Ideally it's a number but it could be a number string
     * @returns {Size}
     */
    setWidth(width: number | string): Size;
    /**
     * Returns the Google maps size object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/coordinates#Size
     *
     * @returns {google.maps.Size|null}
     */
    toGoogle(): google.maps.Size | null;
}
export type SizeValue = Size | number | number[] | string | string[] | SizeObject;
/**
 * Helper function to set up the size object
 *
 * @param {WidthSize} [width] The width value
 * @param {number|string} [height] The height value
 * @returns {Size}
 */
export declare const size: (width?: SizeValue, height?: number | string) => Size;
export {};
