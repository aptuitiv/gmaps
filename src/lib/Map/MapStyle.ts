/* ===========================================================================
    Holds the styles and selectors for styling the map.

    Based on:
    https://developers.google.com/maps/documentation/javascript/reference/map#MapTypeStyle
    Google maps style reference:
    https://developers.google.com/maps/documentation/javascript/style-reference#stylers
=========================================================================== */

/* global google */

import { isDefined, isObject, isStringOrNumber, isStringWithValue } from '../helpers';

// An individual style to be applied to the map
type Style = {
    [key: string]: string | number;
};

export type MapStyleOptions = {
    // The element type to which the styles should be applied to. If not set then the styles are applied to all elements.
    // https://developers.google.com/maps/documentation/javascript/style-reference#style-elements
    elementType?: string;
    // The feature type to which the styles should be applied to. If not set then the styles are applied to all features.
    // https://developers.google.com/maps/documentation/javascript/style-reference#style-features
    featureType?: string;
    // The styles to apply to the map
    styles?: Style[];
};

/**
 * MapStyle class
 */
export class MapStyle {
    /**
     * he element type to which the styles should be applied to. If not set then the styles are applied to all elements.
     *
     * @private
     * @type {string}
     */
    #elementType: string = 'all';

    /**
     * The feature type to which the styles should be applied to. If not set then the styles are applied to all features.
     *
     * @private
     * @type {string}
     */
    #featureType: string = 'all';

    /**
     * The styles to apply to the map
     *
     * @private
     * @type {Style[]}
     */
    #styles: Style[] = [];

    /**
     * Class constructor
     *
     * @param {MapStyleOptions | Style | Style[]} [options] Either the MapStyle options, a single style, or an array of styles
     */
    constructor(options?: MapStyleOptions | Style | Style[]) {
        if (isObject(options)) {
            if (
                isDefined((options as MapStyleOptions).elementType) ||
                isDefined((options as MapStyleOptions).featureType) ||
                isDefined((options as MapStyleOptions).styles)
            ) {
                const opts = options as MapStyleOptions;
                if (opts.elementType) {
                    this.elementType = opts.elementType;
                }
                if (opts.featureType) {
                    this.featureType = opts.featureType;
                }
                if (opts.styles) {
                    this.#styles = opts.styles;
                }
            } else {
                this.styles = options as Style;
            }
        } else if (Array.isArray(options)) {
            this.styles = options;
        }
    }

    /**
     * Get the element type to apply styles to
     *
     * @returns {string}
     */
    get elementType(): string {
        return this.#elementType;
    }

    /**
     * Set the element type to apply styles to
     *
     * @param {string} value The element type to apply values to
     */
    set elementType(value: string) {
        if (isStringWithValue(value)) {
            this.#elementType = value;
        }
    }

    /**
     * Get the feature type to apply styles to
     *
     * @returns {string}
     */
    get featureType(): string {
        return this.#featureType;
    }

    /**
     * Set the feature type to apply styles to
     *
     * @param {string} value The feature type to apply values to
     */
    set featureType(value: string) {
        if (isStringWithValue(value)) {
            this.#featureType = value;
        }
    }

    /**
     * Get the styles to apply to the map
     *
     * @returns {Style[]}
     */
    get styles(): Style[] {
        return this.#styles;
    }

    /**
     * Set the styles to apply to the map
     *
     * @param {Style | Style[]} value The style or styles to apply to the map
     */
    set styles(value: Style | Style[]) {
        if (Array.isArray(value)) {
            this.#styles = value;
        } else if (isObject(value)) {
            this.#styles = [value];
        }
    }

    /**
     * Add a style to the list of styles to apply
     *
     * Example:
     * styles.addStyle('color', 'red');
     * styles.addStyle('weight', 2);
     *
     * @param {string} property The style property.
     * @param {string | number} value The style value.
     * @returns {MapStyle}
     */
    addStyle(property: string, value: string | number): MapStyle {
        if (isStringWithValue(property) && isStringOrNumber(value)) {
            this.#styles.push({ [property]: value });
        }
        return this;
    }

    /**
     * Set the element type to apply styles to
     *
     * @param {string} value The element type to apply values to
     * @returns {MapStyle}
     */
    setElementType(value: string): MapStyle {
        this.elementType = value;
        return this;
    }

    /**
     * Set the feature type to apply styles to
     *
     * @param {string} value The feature type to apply values to
     * @returns {MapStyle}
     */
    setFeatureType(value: string): MapStyle {
        this.featureType = value;
        return this;
    }

    /**
     * Set the styles to apply to the map
     *
     * @param { Style|Style[]} value The style or styles to apply to the map
     * @returns {MapStyle}
     */
    setStyles(value: Style | Style[]): MapStyle {
        this.styles = value;
        return this;
    }

    /**
     * Get the MapTypeStyle Google Maps object
     *
     * @returns {google.maps.MapTypeStyle}
     */
    toGoogle(): google.maps.MapTypeStyle {
        return {
            elementType: this.#elementType,
            featureType: this.#featureType,
            stylers: this.#styles,
        };
    }
}

export type MapStyleValue = MapStyleOptions | Style | Style[] | MapStyle;

/**
 * Helper function to set up the MapStyle object
 *
 * @param {MapStyleValue} options The MapStyle options, a single style object, an array of styles, or a MapStyle object.
 * @returns {MapStyle}
 */
export const mapStyle = (options?: MapStyleValue): MapStyle => {
    if (options instanceof MapStyle) {
        return options;
    }
    return new MapStyle(options);
};
