/// <reference types="google.maps" />
type PointObject = {
    x: number | string;
    y: number | string;
};
export type XPoint = number | number[] | string | string[] | PointObject;
/**
 * The Point class to set up and manage x/y coordinates
 */
export declare class Point {
    /**
     * The type of object. For this class it will always be "point"
     *
     * You can use this in your logic to determine what type of object you're dealing with.
     * if (thing.objectType === 'point') {}
     */
    objectType: string;
    /**
     * Holds the Google maps point object
     */
    private pointObject;
    /**
     * The X value
     */
    private x;
    /**
     * The Y value
     */
    private y;
    /**
     * Constructor
     *
     * @param {XPoint} x The X value
     * @param {number|string} y The Y value
     */
    constructor(x: XPoint, y?: number | string);
    /**
     * Returns the Google maps point object
     *
     * @link https://developers.google.com/maps/documentation/javascript/reference/coordinates#Point
     * @returns {google.maps.Point}
     */
    get(): google.maps.Point;
    /**
     * Get the x value
     *
     * @returns {number}
     */
    getX(): number;
    /**
     * Get the y value
     *
     * @returns {number}
     */
    getY(): number;
}
export type PointValue = Point | number[] | string[] | PointObject;
/**
 * Helper function to set up the point object
 *
 * @param {XPoint} x The x value
 * @param {number|string }y The y value
 * @returns {Point}
 */
export declare const point: (x: PointValue, y?: number | string) => Point;
export {};
