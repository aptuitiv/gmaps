/* ===========================================================================
    Sets up an icon to be displayed on a polyline.

    https://developers.google.com/maps/documentation/javascript/symbols#add_to_polyline
    https://developers.google.com/maps/documentation/javascript/reference/polygon#IconSequence
=========================================================================== */

import Base from './Base';
import { getSizeWithUnit, isBoolean, isDefined, isObject, isStringWithValue } from './helpers';
import { svgSymbol, SvgSymbol, SvgSymbolValue } from './SvgSymbol';

export type PolylineIconOptions = {
    fixedRotation?: boolean; // Default is false
    icon?: SvgSymbolValue; // The icon to render on the line
    offset?: string; // Default is '0%'
    repeat?: string; // Default is '20px'
}

type PolylineGoogleOptions = Omit<PolylineIconOptions, 'icon'> & {
    icon?: SvgSymbol; // The icon to render on the line
}

export class PolylineIcon extends Base {
    /**
     * Holds the options for the Google maps polyline icon
     *
     * @private
     * @type {PolylineGoogleOptions}
     */
    #options: PolylineGoogleOptions;

    /**
     * Constructor
     *
     * @param {PolylineIconOptions} [options] The polyline icon options
     */
    constructor(options?: PolylineIconOptions) {
        super('polylineIcon');

        this.#options = {};

        if (isObject(options)) {
            this.setOptions(options);
        }
    }

    /**
     * Get the fixed rotation setting for the icon
     *
     * @returns {boolean} True if the icon has a fixed rotation, false otherwise
     */
    get fixedRotation(): boolean {
        return !!this.#options.fixedRotation;
    }

    /**
     * Set the fixed rotation setting for the icon
     *
     * @param {boolean} fixedRotation If true, each icon in the sequence has the same fixed rotation
     *      regardless of the angle of the edge on which it lies. If false, case each icon in the
     *      sequence is rotated to align with its edge.
     */
    set fixedRotation(fixedRotation: boolean) {
        if (isBoolean(fixedRotation)) {
            this.#options.fixedRotation = fixedRotation;
        }
    }

    /**
     * Get the icon value
     *
     * @returns {SvgSymbol|undefined} The icon value or undefined if not set
     */
    get icon(): SvgSymbol|undefined {
        return this.#options.icon;
    }

    /**
     * Set the icon value
     *
     * @param {SvgSymbolValue} icon The icon value to set. It can be a string, an object, or an instance of SvgSymbol.
     * @see {@link SvgSymbol} for more details on the icon value
     */
    set icon(icon: SvgSymbolValue) {
        this.#options.icon = svgSymbol(icon);
    }

    /**
     * Get the offset value
     *
     * @returns {string|undefined} The offset value or undefined if not set
     */
    get offset(): string|undefined {
        return this.#options.offset;
    }

    /**
     * Set the distance from the start of the line at which an icon is to be rendered.
     *
     * @param {number|string} value The distance from the start of the line at which an icon is to be rendered.
     *      is distance may be expressed as a percentage of line's length (e.g. '50%') or in pixels (e.g. '50px').
     */
    set offset(value: number|string) {
        const val = getSizeWithUnit(value);
        if (isStringWithValue(val)) {
            this.#options.offset = val;
        }
    }

    /**
     * Get the repeat value
     *
     * @returns {string|undefined} The repeat value or undefined if not set
     */
    get repeat(): string|undefined {
        return this.#options.repeat;
    }

    /**
     * Set the repeat value. This sets the distance between consecutive icons along the polyline.
     * The repeat value can be expressed in pixels (e.g. '20px') or as a percentage of the polyline's length (e.g. '10%').
     * If the value is a number, it is treated as pixels (e.g. 20 becomes '20px').
     * To disable repeating icons, set the repeat value to 0, '0px' or '0%'.
     *
     * @param {number|string} value The repeat value. It can be a number, a number string, or a string with 'px' or '%' suffix.
     */
    set repeat(value: number|string) {
        const val = getSizeWithUnit(value);
        if (isStringWithValue(val)) {
            this.#options.repeat = val;
        }
    }

    /**
     * Set the fixed rotation value
     *
     * @param {boolean} fixedRotation If true, each icon in the sequence has the same fixed rotation
     *      regardless of the angle of the edge on which it lies. If false, case each icon in the
     *      sequence is rotated to align with its edge.
     * @returns {PolylineIcon}
     */
    setFixedRotation(fixedRotation: boolean): PolylineIcon {
        this.fixedRotation = fixedRotation;
        return this;
    }

    /**
     * Set the icon value
     *
     * @param {SvgSymbolValue} icon The icon value to set. It can be a string, an object, or an instance of SvgSymbol.
     * @returns {PolylineIcon} The PolylineIcon instance for method chaining
     */
    setIcon(icon: SvgSymbolValue): PolylineIcon {
        this.icon = icon;
        return this;
    }

    /**
     * Set the distance from the start of the line at which an icon is to be rendered.
     *
     * @param {number|string} value The distance from the start of the line at which an icon is to be rendered. This distance may be expressed as a percentage of line's length (e.g. '50%') or in pixels (e.g. '50px').
     */
    setOffset(value: number|string): PolylineIcon {
        this.offset = value;
        return this;
    }

    /**
     * Set the repeat value. This sets the distance between consecutive icons along the polyline.
     * The repeat value can be expressed in pixels (e.g. '20px') or as a percentage of the polyline's length (e.g. '10%').
     * If the value is a number, it is treated as pixels (e.g. 20 becomes '20px').
     * To disable repeating icons, set the repeat value to 0, '0px' or '0%'.
     *
     * @param {number|string} value The repeat value. It can be a number, a number string, or a string with 'px' or '%' suffix.
     */
    setRepeat(value: number|string): PolylineIcon {
        this.repeat = value;
        return this;
    }

    /**
     * Set the icon options
     *
     * @param {PolylineIconOptions} options The polyline icon options
     * @returns {PolylineIcon}
     */
    setOptions(options: PolylineIconOptions): PolylineIcon {
        if (isObject(options)) {
            if (isDefined(options.fixedRotation)) {
                this.fixedRotation = options.fixedRotation;
            }
            if (isDefined(options.icon)) {
                this.icon = options.icon;
            }
            if (isDefined(options.offset)) {
                this.offset = options.offset;
            }
            if (isDefined(options.repeat)) {
                this.repeat = options.repeat;
            }
        }
        return this;
    }

    /**
     * Get the polyline icon options
     *
     * @returns {google.maps.IconSequence}
     */
    toGoogle(): google.maps.IconSequence {
        const returnValue: google.maps.IconSequence = {};
        if (isDefined(this.#options.fixedRotation)) {
            returnValue.fixedRotation = this.#options.fixedRotation;
        }
        if (isDefined(this.#options.offset)) {
            returnValue.offset = this.#options.offset;
        }
        if (isDefined(this.#options.repeat)) {
            returnValue.repeat = this.#options.repeat;
        }
        if (this.#options.icon) {
            returnValue.icon = this.#options.icon.toGoogle();
        }
        return returnValue;
    }
}

// Possible values for the polyline icon in other classes
export type PolylineIconValue = PolylineIcon | PolylineIconOptions;

/**
 * Helper function to set up the polyline icon object
 *
 * @param {PolylineIconValue} options The polyline icon options or the icon object
 * @returns {PolylineIcon} A PolylineIcon instance
 */
export const polylineIcon = (options: PolylineIconValue): PolylineIcon => {
    if (options instanceof PolylineIcon) {
        return options;
    }
    return new PolylineIcon(options);
}
