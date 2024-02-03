/* ===========================================================================
    Helps to set up an inline SVG icon for a marker

    https://developers.google.com/maps/documentation/javascript/reference/marker#Symbol
    https://developers.google.com/maps/documentation/javascript/examples/marker-modern

    You can convert a circle to an SVG path using this tool:
    https://complexdan.com/svg-circleellipse-to-path-converter/
    Or create the circle path yourself with
    https://www.smashingmagazine.com/2019/03/svg-circle-decomposition-paths/

    Example usage:
    const icon = G.svgSymbol({
        path: 'M0,6a6,6 0 1,0 12,0a6,6 0 1,0 -12,0',
        fillColor: '#5284ed',
        fillOpacity: 1,
        scale: 1,
        strokeColor: '#5284ed',
        strokeOpacity: 0.5,
        strokeWeight: 4,
    });
=========================================================================== */

/* global google */

import Base from './Base';
import { point, PointValue } from './Point';
import { isNumber, isNumberString, isObject, isStringWithValue } from './helpers';

type SvgSymbolOptions = {
    // The position at which to anchor an image in correspondence to the location of the marker on the map.
    // By default, the anchor is located along the center point of the bottom of the image.
    anchor?: PointValue;
    // The SVG fill color.
    fillColor?: string;
    // The opacity of the fill.
    fillOpacity?: number;
    // The origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
    // By default, the origin is located in the center point of the image.
    labelOrigin?: PointValue;
    // The SVG path for the icon. You cannot set the entire SVG code. Only the path.
    path: string;
    // The rotation of the icon in degrees clockwise about the anchor point.
    rotation?: number;
    // The amount by which the icon is scaled.
    scale?: number;
    // The SVG stroke color.
    strokeColor?: string;
    // The opacity of the stroke.
    strokeOpacity?: number;
    // The weight of the stroke.
    strokeWeight?: number;
};

/**
 * Class to set up an SVG icon for a marker
 */
export class SvgSymbol extends Base {
    /**
     * Holds the icon options
     *
     * @type {google.maps.Symbol}
     */
    private options: google.maps.Symbol;

    /**
     * Constructor
     *
     * @param {string | SvgSymbolOptions} [path] The SVG path for the icon or the icon options
     * @param {SvgSymbolOptions} [options] The options for the icon
     */
    constructor(path?: string | SvgSymbolOptions, options?: SvgSymbolOptions) {
        super('svgsymbol');
        this.options = { path: '' };
        if (typeof path === 'string') {
            this.options = {
                path,
            };
            this.setOptions(options);
        } else if (isObject(path)) {
            this.setOptions(path);
        }
    }

    /**
     * Get the icon options
     *
     * @returns {google.maps.Symbol}
     */
    get(): google.maps.Symbol {
        return this.options;
    }

    /**
     * Set the icon options
     *
     * @param {SvgSymbolOptions} options The icon options
     * @returns {SvgSymbol}
     */
    setOptions(options: SvgSymbolOptions): SvgSymbol {
        if (isObject(options)) {
            const numberValues = ['fillOpacity', 'rotation', 'scale', 'strokeOpacity', 'strokeWeight'];
            const pointValues = ['anchor', 'labelOrigin'];
            const stringValues = ['fillColor', 'path', 'strokeColor'];
            numberValues.forEach((key) => {
                if ((options[key] && isNumber(options[key])) || isNumberString(options[key])) {
                    if (isNumberString(options[key])) {
                        this.options[key] = Number(options[key]);
                    } else {
                        this.options[key] = options[key];
                    }
                }
            });
            pointValues.forEach((key) => {
                if (options[key]) {
                    this.options[key] = point(options[key]).get();
                }
            });
            stringValues.forEach((key) => {
                if (options[key] && isStringWithValue(options[key])) {
                    this.options[key] = options[key];
                }
            });
        }
        return this;
    }

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
    setAnchor(anchor: PointValue): SvgSymbol {
        this.options.anchor = point(anchor).get();
        return this;
    }

    /**
     * Set the SVG fill color.
     *
     * @param {string} fillColor The SVG fill color.
     * @returns {SvgSymbol}
     */
    setFillColor(fillColor: string): SvgSymbol {
        if (isStringWithValue(fillColor)) {
            this.options.fillColor = fillColor;
        }
        return this;
    }

    /**
     * Set the opacity for the fill
     *
     * @param {number|string} fillOpacity The opacity for the fill
     * @returns {SvgSymbol}
     */
    setFillOpacity(fillOpacity: number | string): SvgSymbol {
        if (isNumber(fillOpacity)) {
            this.options.fillOpacity = fillOpacity;
        } else if (isNumberString(fillOpacity)) {
            this.options.fillOpacity = Number(fillOpacity);
        }
        return this;
    }

    /**
     * Set the origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
     *
     * @param {PointValue} labelOrigin The origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
     * @returns {SvgSymbol}
     */
    setLabelOrigin(labelOrigin: PointValue): SvgSymbol {
        this.options.labelOrigin = point(labelOrigin).get();
        return this;
    }

    /**
     * Set the SVG path for the icon
     *
     * @param {path} path The SVG path for the icon
     * @returns {SvgSymbol}
     */
    setPath(path: string): SvgSymbol {
        if (isStringWithValue(path)) {
            this.options.path = path;
        }
        return this;
    }

    /**
     * Set the rotation of the icon in degrees clockwise about the anchor point.
     *
     * @param {number|string} rotation The rotation of the icon in degrees clockwise about the anchor point.
     * @returns {SvgSymbol}
     */
    setRotation(rotation: number | string): SvgSymbol {
        if (isNumber(rotation)) {
            this.options.rotation = rotation;
        } else if (isNumberString(rotation)) {
            this.options.rotation = Number(rotation);
        }
        return this;
    }

    /**
     * Set the amount by which the icon is scaled.
     *
     * @param {number|string} scale The amount by which the icon is scaled.
     * @returns {SvgSymbol}
     */
    setScale(scale: number | string): SvgSymbol {
        if (isNumber(scale)) {
            this.options.scale = scale;
        } else if (isNumberString(scale)) {
            this.options.scale = Number(scale);
        }
        return this;
    }

    /**
     * Set the SVG stroke color.
     *
     * @param {string} strokeColor The SVG stroke color.
     * @returns {SvgSymbol}
     */
    setStrokeColor(strokeColor: string): SvgSymbol {
        if (isStringWithValue(strokeColor)) {
            this.options.strokeColor = strokeColor;
        }
        return this;
    }

    /**
     * Set the opacity of the stroke.
     *
     * @param {number|string} strokeOpacity The opacity of the stroke.
     * @returns {SvgSymbol}
     */
    setStrokeOpacity(strokeOpacity: number | string): SvgSymbol {
        if (isNumber(strokeOpacity)) {
            this.options.strokeOpacity = strokeOpacity;
        } else if (isNumberString(strokeOpacity)) {
            this.options.strokeOpacity = Number(strokeOpacity);
        }
        return this;
    }

    /**
     * Set the weight of the stroke.
     *
     * @param {number|string} strokeWeight The weight of the stroke.
     * @returns {SvgSymbol}
     */
    setStrokeWeight(strokeWeight: number | string): SvgSymbol {
        if (isNumber(strokeWeight)) {
            this.options.strokeWeight = strokeWeight;
        } else if (isNumberString(strokeWeight)) {
            this.options.strokeWeight = Number(strokeWeight);
        }
        return this;
    }
}

// Possible values for the icon in other classes
export type SvgSymbolValue = SvgSymbol | string | SvgSymbolOptions;

/**
 * Helper function to set up the icon object
 *
 * @param {SvgSymbolValue} [path] The SVG path for the icon, the icon object, or the icon options
 * @param {SvgSymbolOptions} [options] The options for the icon
 * @returns {SvgSymbol}
 */
export const svgSymbol = (path: SvgSymbolValue, options?: SvgSymbolOptions): SvgSymbol => {
    if (path instanceof SvgSymbol) {
        return path;
    }
    return new SvgSymbol(path, options);
};
