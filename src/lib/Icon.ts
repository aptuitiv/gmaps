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
     * Set the position at which to anchor an image in correspondence to the location of the marker on the map.
     * Use this if for some reason you didn't pass the anchor in the icon options.
     *
     * By default, the anchor is located along the center point of the bottom of the image.
     *
     * const icon = G.icon({
     *    url: 'https://mywebsite.com/images/marker.png',
     * });
     * icon.anchor([10, 32]);
     *
     * Valid values are:
     * icon.anchor([10, 32]);
     * icon.anchor({x: 10, y: 32});
     * icon.anchor(pointClassInstance);
     *
     * @param {PointValue} anchor The anchor point value
     * @returns {Icon}
     */
    anchor(anchor: PointValue): Icon {
        this.options.anchor = point(anchor).get();
        return this;
    }

    /**
     * Set the origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
     * Use this if for some reason you didn't pass the label origin in the icon options.
     *
     * By default, the origin is located in the center point of the image.
     *
     * const icon = G.icon({
     *    url: 'https://mywebsite.com/images/marker.png',
     * });
     * icon.labelOrigin([10, 32]);
     *
     * Valid values are:
     * icon.labelOrigin([10, 32]);
     * icon.labelOrigin({x: 10, y: 32});
     * icon.labelOrigin(pointClassInstance);
     *
     * @param {PointValue} origin The label origin point value
     * @returns {Icon}
     */
    labelOrigin(origin: PointValue): Icon {
        this.options.labelOrigin = point(origin).get();
        return this;
    }

    /**
     * Set the position of the image within a sprite, if any. By default, the origin is located at the top left corner of the image (0, 0).
     * Use this if for some reason you didn't pass the origin in the icon options.
     *
     * const icon = G.icon({
     *    url: 'https://mywebsite.com/images/marker.png',
     * });
     * icon.origin([10, 32]);
     *
     * Valid values are:
     * icon.origin([10, 32]);
     * icon.origin({x: 10, y: 32});
     * icon.origin(pointClassInstance);
     *
     * @param {PointValue} origin The origin point value
     * @returns {Icon}
     */
    origin(origin: PointValue): Icon {
        this.options.origin = point(origin).get();
        return this;
    }

    /**
     * Set the scaled size of the icon. Use this if for some reason you didn't pass the scaled size in the icon options.
     *
     * The size of the entire image after scaling, if any. Use this property to stretch/shrink an image or a sprite.
     *
     * const icon = G.icon({
     *    url: 'https://mywebsite.com/images/marker.png',
     * });
     * icon.size([40, 64]).scaledSize([20, 32]));
     *
     * @param {SizeValue} sizeValue The size value
     * @returns {Icon}
     */
    scaledSize(sizeValue: SizeValue): Icon {
        this.options.scaledSize = size(sizeValue).get();
        return this;
    }

    /**
     * Set the size of the icon. Use this if for some reason you didn't pass the size in the icon options.
     *
     * When using sprites, you must specify the sprite size. If the size is not provided, it will be set when the image loads.
     *
     * const icon = G.icon({
     *    url: 'https://mywebsite.com/images/marker.png',
     * });
     * icon.size([20, 32]);
     *
     * If you're using an SVG you should set a size if the desired size is different from the height and width attributes of the SVG.
     *
     * @param {SizeValue} sizeValue The size value
     * @returns {Icon}
     */
    size(sizeValue: SizeValue): Icon {
        this.options.size = size(sizeValue).get();
        return this;
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
