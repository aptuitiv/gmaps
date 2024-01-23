/* ===========================================================================
    Icon class - used to privide the icon information for a marker

    See: https://developers.google.com/maps/documentation/javascript/reference/marker#Icon

    Example usage:
    const icon = G.icon({
        url: 'https://mywebsite.com/images/marker.png',
        size: [20, 32]
    });
    const marker = G.marker({
        latitude: 40.730610,
        longitude: -73.935242,
        icon
    });
=========================================================================== */

import { isObject, isStringWithValue } from './helpers';
import { point, PointValue } from './Point';
import { size, SizeValue } from './Size';

type IconOptions = {
    // The position at which to anchor an image in correspondence to the location of the marker on the map.
    // By default, the anchor is located along the center point of the bottom of the image.
    anchor?: PointValue;
    // The origin of the label relative to the top-left corner of the icon image, if a label is supplied by the marker.
    // By default, the origin is located in the center point of the image.
    labelOrigin?: PointValue;
    // The position of the image within a sprite, if any. By default, the origin is located at the top left corner of the image (0, 0).
    origin?: PointValue;
    // The size of the entire image after scaling, if any. Use this property to stretch/shrink an image or a sprite.
    scaledSize?: SizeValue;
    // The display size of the sprite or image. When using sprites, you must specify the sprite size. If the size is not provided, it will be set when the image loads.
    size?: SizeValue;
    // The URL to the icon image (or sprite sheet) itself. All browsers support GIF, JPEG, SVG, and PNG formats.
    // If an SVG is used, the height and width attributtes in the SVG HTML are required. If they are not set then the
    // SVG will not display correctly.
    url?: string;
};

/**
 * Icon class to set up an icon options for a marker
 */
export class Icon {
    /**
     * Holds the Google maps icon options
     */
    private options: google.maps.Icon;

    /**
     * Constructor
     *
     * @param {string | IconOptions} [url] The URL for the icon or the icon options
     * @param {IconOptions} [options] The icon options
     */
    constructor(url?: string | IconOptions, options?: IconOptions) {
        this.options = { url: '' };
        if (typeof url === 'string') {
            this.options = {
                url,
            };
            this.setOptions(options);
        } else if (isObject(url)) {
            this.setOptions(url);
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

    /**
     * Set the icon options
     *
     * @param {IconOptions} options The icon options
     * @returns {Icon}
     */
    setOptions(options: IconOptions): Icon {
        if (isObject(options)) {
            const pointValues = ['anchor', 'labelOrigin', 'origin'];
            const sizeValues = ['scaledSize', 'size'];
            const stringValues = ['url'];
            pointValues.forEach((key) => {
                if (options[key]) {
                    this.options[key] = point(options[key]).get();
                }
            });
            sizeValues.forEach((key) => {
                if (options[key]) {
                    this.options[key] = size(options[key]).get();
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
     * @returns {Icon}
     */
    setAnchor(anchor: PointValue): Icon {
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
     * icon.setLabelOrigin([10, 32]);
     *
     * Valid values are:
     * icon.setLabelOrigin([10, 32]);
     * icon.setLabelOrigin({x: 10, y: 32});
     * icon.setLabelOrigin(pointClassInstance);
     *
     * @param {PointValue} origin The label origin point value
     * @returns {Icon}
     */
    setLabelOrigin(origin: PointValue): Icon {
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
     * icon.setOrigin([10, 32]);
     *
     * Valid values are:
     * icon.setOrigin([10, 32]);
     * icon.setOrigin({x: 10, y: 32});
     * icon.setOrigin(pointClassInstance);
     *
     * @param {PointValue} origin The origin point value
     * @returns {Icon}
     */
    setOrigin(origin: PointValue): Icon {
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
     * icon.setSize([40, 64]).setScaledSize([20, 32]));
     *
     * Valid values are:
     * icon.setScaledSize([10, 32]);
     * icon.setScaledSize({x: 10, y: 32});
     * icon.setScaledSize(sizeClassInstance);
     *
     * @param {SizeValue} sizeValue The size value
     * @returns {Icon}
     */
    setScaledSize(sizeValue: SizeValue): Icon {
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
     * icon.setSize([20, 32]);
     *
     * Valid values are:
     * icon.setSize([10, 32]);
     * icon.setSize({x: 10, y: 32});
     * icon.setSize(sizeClassInstance);
     *
     * If you're using an SVG you should set a size if the desired size is different from the height and width attributes of the SVG.
     *
     * @param {SizeValue} sizeValue The size value
     * @returns {Icon}
     */
    setSize(sizeValue: SizeValue): Icon {
        this.options.size = size(sizeValue).get();
        return this;
    }

    /**
     * Set the icon URL
     *
     * @param {string} url The icon URL
     * @returns {Icon}
     */
    setUrl(url: string): Icon {
        this.options.url = url;
        return this;
    }
}

// Possible values for the icon in other classes
export type IconValue = Icon | string | IconOptions;

/**
 * Helper function to set up the icon object
 *
 * @param {IconValue} [url] The URL for the icon, the icon object, or the icon options
 * @param {IconOptions} [options] The options for the icon
 * @returns {Icon}
 */
export const icon = (url?: IconValue, options?: IconOptions): Icon => {
    if (url instanceof Icon) {
        return url;
    }
    return new Icon(url, options);
};
