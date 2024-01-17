/* ===========================================================================
    Icon class - used to privide the icon information for a marker
=========================================================================== */

import { isObject } from './test-types';
import { point, PointValue } from './Point';
import { size, SizeValue } from './Size';

type IconOptions = {
    anchor?: PointValue;
    labelOrigin?: PointValue;
    origin?: PointValue;
    scaledSize?: SizeValue;
    size?: SizeValue;
    url?: string;
};

/**
 * Icon class to set up an icon for a marker
 */
export class Icon {
    /**
     * Holds the Google maps icon options
     */
    private options: google.maps.Icon;

    /**
     * Constructor
     *
     * @param {string} url The icon URl
     * @param {IconOptions} options The icon options
     */
    constructor(url: string | IconOptions, options?: IconOptions) {
        if (typeof url === 'string') {
            this.options = {
                url,
            };
            if (isObject(options)) {
                this.setOptions(options);
            }
        } else if (isObject(url) && typeof url.url === 'string') {
            this.options = { url: url.url };
            this.setOptions(url);
        }
        console.log('Icon options', this.options);
    }

    /**
     * Set the icon options
     *
     * @param {IconOptions} options The icon options
     */
    private setOptions(options: IconOptions): void {
        if (options?.anchor) {
            this.options.anchor = point(options.anchor).get();
        }
        if (options?.labelOrigin) {
            this.options.labelOrigin = point(options.labelOrigin).get();
        }
        if (options?.origin) {
            this.options.origin = point(options.origin).get();
        }
        if (options?.scaledSize) {
            this.options.scaledSize = size(options.scaledSize).get();
        }
        if (options?.size) {
            this.options.size = size(options.size).get();
        }
    }

    /**
     * Get the icon options
     *
     * @returns {google.maps.Icon}
     */
    get(): google.maps.Icon {
        return this.options;
    }
}

// Possible values for the icon in other classes
export type IconValue = Icon | string | IconOptions;

/**
 * Helper function to set up the icon object
 *
 * @param {IconValue} url The URL for the icon
 * @param {IconOptions} options The options for the icon
 * @returns {Icon}
 */
export const icon = (url: IconValue, options?: IconOptions): Icon => {
    if (url instanceof Icon) {
        return url;
    }
    return new Icon(url, options);
};
