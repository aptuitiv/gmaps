/// <reference types="google.maps" />
import Base from './Base';
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
export declare class SvgSymbol extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {string | SvgSymbolOptions} [path] The SVG path for the icon or the icon options
     * @param {SvgSymbolOptions} [options] The options for the icon
     */
    constructor(path?: string | SvgSymbolOptions, options?: SvgSymbolOptions);
    /**
     * Get the anchor point
     *
     * @returns {PointValue}
     */
    get anchor(): PointValue;
    /**
     * Set the position at which to anchor an image in correspondence to the location of the marker on the map.
     *
     * @param {PointValue} anchor The anchor point value
     */
    set anchor(anchor: PointValue);
    /**
     * Get the SVG fill color
     *
     * @returns {string}
     */
    get fillColor(): string;
    /**
     * Set the SVG fill color.
     *
     * @param {string} fillColor The SVG fill color.
     */
    set fillColor(fillColor: string);
    /**
     * Get the opacity for the fill
     *
     * @returns {number}
     */
    get fillOpacity(): number;
    /**
     * Set the opacity for the fill
     *
     * @param {number|string} fillOpacity The opacity for the fill
     */
    set fillOpacity(fillOpacity: number | string);
    /**
     * Get the origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
     *
     * @returns {PointValue}
     */
    get labelOrigin(): PointValue;
    /**
     * Set the origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
     *
     * @param {PointValue} labelOrigin The origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
     */
    set labelOrigin(labelOrigin: PointValue);
    /**
     * Get the SVG path for the icon
     *
     * @returns {string}
     */
    get path(): string;
    /**
     * Set the SVG path for the icon
     *
     * @param {path} path The SVG path for the icon
     */
    set path(path: string);
    /**
     * Get the rotation of the icon in degrees clockwise about the anchor point.
     *
     * @returns {number}
     */
    get rotation(): number;
    /**
     * Set the rotation of the icon in degrees clockwise about the anchor point.
     *
     * @param {number|string} rotation The rotation of the icon in degrees clockwise about the anchor point.
     */
    set rotation(rotation: number | string);
    /**
     * Get the amount by which the icon is scaled.
     *
     * @returns {number}
     */
    get scale(): number;
    /**
     * Set the amount by which the icon is scaled.
     *
     * @param {number|string} scale The amount by which the icon is scaled.
     */
    set scale(scale: number | string);
    /**
     * Get the SVG stroke color
     *
     * @returns {string}
     */
    get strokeColor(): string;
    /**
     * Set the SVG stroke color.
     *
     * @param {string} strokeColor The SVG stroke color.
     */
    set strokeColor(strokeColor: string);
    /**
     * Get the opacity of the stroke.
     * The opacity of the stroke, where 0 is fully transparent and 1 is fully opaque.
     *
     * @returns {number}
     */
    get strokeOpacity(): number;
    /**
     * Set the opacity of the stroke.
     *
     * @param {number|string} strokeOpacity The opacity of the stroke.
     */
    set strokeOpacity(strokeOpacity: number | string);
    /**
     * Get the weight of the stroke in pixels.
     *
     * @returns {number}
     */
    get strokeWeight(): number;
    /**
     * Set the weight of the stroke.
     *
     * @param {number|string} strokeWeight The weight of the stroke.
     */
    set strokeWeight(strokeWeight: number | string);
    /**
     * Set the icon options
     *
     * @param {SvgSymbolOptions} options The icon options
     * @returns {SvgSymbol}
     */
    setOptions(options: SvgSymbolOptions): SvgSymbol;
    /**
     * Set the position at which to anchor an image in correspondence to the location of the marker on the map.
     * Use this if for some reason you didn't pass the anchor in the icon options.
     *
     * By default, the anchor is located along the center point of the bottom of the image.
     *
     * const symbol = G.icon({
     *    url: 'https://mywebsite.com/images/marker.png',
     * });
     * symbol.setAnchor([10, 32]);
     *
     * Valid values are:
     * symbol.setAnchor([10, 32]);
     * symbol.setAnchor({x: 10, y: 32});
     * symbol.setAnchor(pointClassInstance);
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
     * @param {PointValue} labelOrigin The origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
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
    /**
     * Get the icon options
     *
     * @returns {google.maps.Symbol}
     */
    toGoogle(): google.maps.Symbol;
}
export type SvgSymbolValue = SvgSymbol | string | SvgSymbolOptions;
/**
 * Helper function to set up the icon object
 *
 * @param {SvgSymbolValue} [path] The SVG path for the icon, the icon object, or the icon options
 * @param {SvgSymbolOptions} [options] The options for the icon
 * @returns {SvgSymbol}
 */
export declare const svgSymbol: (path?: SvgSymbolValue, options?: SvgSymbolOptions) => SvgSymbol;
export {};
