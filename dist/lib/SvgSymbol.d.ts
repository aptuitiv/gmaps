/// <reference types="google.maps" />
import { PointValue } from './Point';
type SvgSymbolOptions = {
    anchor?: PointValue;
    fillColor?: string;
    fillOpacity?: number;
    labelOrigin?: PointValue;
    path: string;
    rotation?: number;
    scale?: number;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
};
/**
 * Class to set up an SVG icon for a marker
 */
export declare class SvgSymbol {
    /**
     * The type of object. For this class it will always be "svgsymbol"
     *
     * You can use this in your logic to determine what type of object you're dealing with.
     * if (thing.objectType === 'svgsymbol') {}
     */
    objectType: string;
    /**
     * Holds the icon options
     * @type {google.maps.Symbol}
     */
    private options;
    /**
     * Constructor
     *
     * @param {string | SvgSymbolOptions} [path] The SVG path for the icon or the icon options
     * @param {SvgSymbolOptions} [options] The options for the icon
     */
    constructor(path?: string | SvgSymbolOptions, options?: SvgSymbolOptions);
    /**
     * Get the icon options
     *
     * @returns {google.maps.Symbol}
     */
    get(): google.maps.Symbol;
    /**
     * Set the icon options
     *
     * @param {IconOptions} options The icon options
     * @return {SvgSymbol}
     */
    setOptions(options: SvgSymbolOptions): SvgSymbol;
    /**
     * Set the position at which to anchor an image in correspondence to the location of the marker on the map.
     * Use this if for some reason you didn't pass the anchor in the icon options.
     *
     * By default, the anchor is located along the center point of the bottom of the image.
     *
     * const icon = G.icon({
     *    url: 'https://mywebsite.com/images/marker.png',
     * });
     * icon.setAnchor([10, 32]);
     *
     * Valid values are:
     * icon.setAnchor([10, 32]);
     * icon.setAnchor({x: 10, y: 32});
     * icon.setAnchor(pointClassInstance);
     *
     * @param {PointValue} anchor The anchor point value
     * @returns {SvgSymbol}
     */
    setAnchor(anchor: PointValue): SvgSymbol;
    /**
     * Set the SVG fill color.
     *
     * @param {string} fillColor The SVG fill color.
     * @returns {SvgSymbol}
     */
    setFillColor(fillColor: string): SvgSymbol;
    /**
     * Set the opacity for the fill
     *
     * @param {number|string} fillOpacity The opacity for the fill
     * @returns {SvgSymbol}
     */
    setFillOpacity(fillOpacity: number | string): SvgSymbol;
    /**
     * Set the origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
     *
     * @param labelOrigin The origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
     * @returns {SvgSymbol}
     */
    setLabelOrigin(labelOrigin: PointValue): SvgSymbol;
    /**
     * Set the SVG path for the icon
     *
     * @param {path} path The SVG path for the icon
     * @returns {SvgSymbol}
     */
    setPath(path: string): SvgSymbol;
    /**
     * Set the rotation of the icon in degrees clockwise about the anchor point.
     *
     * @param {number|string} rotation The rotation of the icon in degrees clockwise about the anchor point.
     * @returns {SvgSymbol}
     */
    setRotation(rotation: number | string): SvgSymbol;
    /**
     * Set the amount by which the icon is scaled.
     *
     * @param {number|string} scale The amount by which the icon is scaled.
     * @returns {SvgSymbol}
     */
    setScale(scale: number | string): SvgSymbol;
    /**
     * Set the SVG stroke color.
     *
     * @param {string} strokeColor The SVG stroke color.
     * @returns {SvgSymbol}
     */
    setStrokeColor(strokeColor: string): SvgSymbol;
    /**
     * Set the opacity of the stroke.
     *
     * @param {number|string} strokeOpacity The opacity of the stroke.
     * @returns {SvgSymbol}
     */
    setStrokeOpacity(strokeOpacity: number | string): SvgSymbol;
    /**
     * Set the weight of the stroke.
     *
     * @param {number|string} strokeWeight The weight of the stroke.
     * @returns {SvgSymbol}
     */
    setStrokeWeight(strokeWeight: number | string): SvgSymbol;
}
export type SvgSymbolValue = SvgSymbol | string | SvgSymbolOptions;
/**
 * Helper function to set up the icon object
 *
 * @param {IconValue} [path] The SVG path for the icon, the icon object, or the icon options
 * @param {IconOptions} [options] The options for the icon
 * @returns {Icon}
 */
export declare const svgSymbol: (path: SvgSymbolValue, options?: SvgSymbolOptions) => SvgSymbol;
export {};
