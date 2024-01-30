/// <reference types="google.maps" />
import { PointValue } from './Point';
import { SizeValue } from './Size';
type IconOptions = {
    anchor?: PointValue;
    labelOrigin?: PointValue;
    origin?: PointValue;
    scaledSize?: SizeValue;
    size?: SizeValue;
    url?: string;
};
/**
 * Icon class to set up an icon options for a marker
 */
export declare class Icon {
    /**
     * The type of object. For this class it will always be "icon"
     *
     * You can use this in your logic to determine what type of object you're dealing with.
     * if (thing.objectType === 'icon') {}
     */
    objectType: string;
    /**
     * Holds the Google maps icon options
     */
    private options;
    /**
     * Constructor
     *
     * @param {string | IconOptions} [url] The URL for the icon or the icon options
     * @param {IconOptions} [options] The icon options
     */
    constructor(url?: string | IconOptions, options?: IconOptions);
    /**
     * Get the icon options
     *
     * @returns {google.maps.Icon}
     */
    get(): google.maps.Icon;
    /**
     * Set the icon options
     *
     * @param {IconOptions} options The icon options
     * @returns {Icon}
     */
    setOptions(options: IconOptions): Icon;
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
    setAnchor(anchor: PointValue): Icon;
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
    setLabelOrigin(origin: PointValue): Icon;
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
    setOrigin(origin: PointValue): Icon;
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
    setScaledSize(sizeValue: SizeValue): Icon;
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
    setSize(sizeValue: SizeValue): Icon;
    /**
     * Set the icon URL
     *
     * @param {string} url The icon URL
     * @returns {Icon}
     */
    setUrl(url: string): Icon;
}
export type IconValue = Icon | string | IconOptions;
/**
 * Helper function to set up the icon object
 *
 * @param {IconValue} [url] The URL for the icon, the icon object, or the icon options
 * @param {IconOptions} [options] The options for the icon
 * @returns {Icon}
 */
export declare const icon: (url?: IconValue, options?: IconOptions) => Icon;
export {};
