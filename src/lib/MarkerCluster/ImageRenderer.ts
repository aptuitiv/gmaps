/* ===========================================================================
    A marker cluster renderer that uses images instead of SVGs to render the clusters.

    Usage:
    const cluster = G.markerCluster(trailListMap.map, {
        imageRendererOptions: {
            images: {
                0: {
                    url: 'https://mysite.com/markerSm.svg',
                    labelColor: '#fff',
                    labelFontSize: '15px',
                    labelFontWeight: 'bold',
                },
                10: {
                    url: 'https://mysite.com/markerMd.svg',
                    labelColor: '#fff',
                    labelFontSize: 10,
                    labelFontFamily: 'Times New Roman',
                    labelClassName: 'my-custom-class-for-label',
                },
                20: 'https://mysite.com/markerLg.svg',
            },
            labelFontFamily: 'roboto,arial,sans-serif',
            labelFontSize: '12px',
            showNumber: true,
        }
    });
    const marker = G.marker({
        position: G.latLng(0, 0),
    });
    marker.show(map);
    cluster.addMarker(marker);

    If you're only setting a single image, you can do this:
    const cluster = G.markerCluster(trailListMap.map, {
        imageRendererOptions: {
            image: 'https://mysite.com/marker.svg',
        }
    });
=========================================================================== */

/* global google */

import { Cluster, Renderer } from '@googlemaps/markerclusterer';
import { getBoolean, isObject, isStringOrNumber } from '../helpers';
import { marker, MarkerLabel } from '../Marker';
import { icon } from '../Icon';
import { SizeValue } from '../Size';
import { Map } from '../Map';

// The image object data
type ClusterImage = {
    // The height of the image. Use this or size.
    height?: number;
    // A CSS class name to be added to the label element
    labelClassName?: string;
    // The color of the label text. Default color is black.
    labelColor?: string;
    // The font family of the label text (equivalent to the CSS font-family property).
    labelFontFamily?: string;
    // The font size of the label text (equivalent to the CSS font-size property). Default size is 12px.
    // If it's set to a number then "px" will be added to the end of the number.
    labelFontSize?: string | number;
    // The font weight of the label text (equivalent to the CSS font-weight property).
    labelFontWeight?: string;
    // The height of the image after scaling, if any. Use this property to stretch/shrink an image or a sprite.
    // Use this or scaledSize.
    scaledHeight?: number;
    // The size of the entire image after scaling, if any. Use this property to stretch/shrink an image or a sprite.
    scaledSize?: SizeValue;
    // The width of the image after scaling, if any. Use this property to stretch/shrink an image or a sprite.
    // Use this or scaledSize.
    scaledWidth?: number;
    // The display size of the sprite or image. When using sprites, you must specify the sprite size. If the size is not provided, it will be set when the image loads.
    size?: SizeValue;
    // The url of the image to use for the cluster
    url: string;
    // The width of the image. Use this or size.
    width?: number;
};

// The image to use for the cluster
export type ClusterImageValue = string | ClusterImage;

// The images for the cluster
export type ClusterImages = {
    // The image to use for the cluster
    [key: number]: ClusterImageValue;
};

/**
 * The image renderer for the marker clusterer to render an image as the marker cluster
 */
export class ImageRenderer implements Renderer {
    /**
     * Holds the images that can be used for the marker cluster icons
     *
     * @private
     * @type {ClusterImages}
     */
    #images: ClusterImages = {};

    /**
     * A CSS class name to be added to the label element
     *
     * @private
     * @type {string}
     */
    #labelClassName: string;

    /**
     * The color of the label text. Default color is black.
     *
     * @private
     * @type {string}
     */
    #labelColor: string;

    /**
     * Holds the font family for the cluster marker label.
     *
     * @private
     * @type {string}
     */
    #labelFontFamily: string;

    /**
     * Holds the font size for the cluster marker
     *
     * @private
     * @type {number}
     */
    #labelFontSize: number | string = '12px';

    /**
     * The font weight of the label text (equivalent to the CSS font-weight property).
     *
     * @private
     * @type {string}
     */
    #labelFontWeight: string;

    /**
     * The map object
     *
     * @private
     * @type {Map}
     */
    #map: Map;

    /**
     * Holds if the number of markers in the cluster should be displayed
     *
     * @private
     * @type {boolean}
     */
    #showNumber: boolean = true;

    /**
     * Set the map object to use for the cluster marker
     *
     * @param {Map} map The map object
     */
    setMap(map: Map): void {
        this.#map = map;
    }

    /**
     * Set custom images to use for the cluster markers.
     *
     * @param {ClusterImages} images The custom images to use for the cluster markers.
     */
    setImages(images: ClusterImages): void {
        if (isObject(images)) {
            // Sort the images by the key and make sure that the key is a valid number >= 0.
            const sortedImages = Object.keys(images)
                .map((k) => parseInt(k, 10))
                .filter(
                    (k) =>
                        !Number.isNaN(k) &&
                        k >= 0 &&
                        (typeof images[k] === 'string' ||
                            (isObject(images[k]) && typeof (images[k] as ClusterImage).url === 'string'))
                )
                .sort((a, b) => a - b)
                .reduce((acc, k) => {
                    acc[k] = images[k];
                    return acc;
                }, {});
            if (Object.keys(sortedImages).length > 0) {
                this.#images = sortedImages;
            }
        }
    }

    /**
     * Set a single image to use for the cluster markers.
     * This will replace any existing images.
     * The image will be used for all clusters.
     * To set different images for different cluster sizes, use the setImages method.
     *
     * @param {ClusterImageValue} image The image URL or image object to use for the cluster markers.
     */
    setImage(image: ClusterImageValue): void {
        if (typeof image === 'string' || (isObject(image) && typeof image.url === 'string')) {
            this.#images = { 0: image };
        }
    }

    /**
     * Set the class name to use for the label
     *
     * @param {string} labelClassName The class name to use for the label
     */
    setLabelClassName(labelClassName: string): void {
        this.#labelClassName = labelClassName;
    }

    /**
     * Set the color of the label text
     *
     * @param {string} labelColor The color of the label text. Default color is black.
     */
    setLabelColor(labelColor: string): void {
        this.#labelColor = labelColor;
    }

    /**
     * Set the font family to use for the cluster marker
     *
     * @param {string} fontFamily The font family to use for the cluster marker
     */
    setLabelFontFamily(fontFamily: string): void {
        this.#labelFontFamily = fontFamily;
    }

    /**
     * Set the font size to use for the cluster marker
     *
     * @param {string|number} fontSize The font size to use for the cluster marker
     */
    setLabelFontSize(fontSize: string | number): void {
        if (isStringOrNumber(fontSize)) {
            this.#labelFontSize = fontSize;
        }
    }

    /**
     * Set the font weight to use for the cluster marker
     *
     * @param {string} labelFontWeight The font weight to use for the cluster marker
     */
    setLabelFontWeight(labelFontWeight: string): void {
        this.#labelFontWeight = labelFontWeight;
    }

    /**
     * Sets if the number of markers in the cluster should be displayed
     *
     * @param {boolean} showNumber Whether to show the number of markers in the cluster
     */
    setShowNumber(showNumber: boolean): void {
        this.#showNumber = getBoolean(showNumber);
    }

    /**
     * Get the image for the cluster.
     *
     * @param {number} count The number of markers in the cluster.
     * @returns {ClusterImage}
     */
    protected getImage(count: number): ClusterImage {
        const keys = Object.keys(this.#images);
        let image = this.#images[keys[0]];

        for (let i = 0; i < keys.length; i += 1) {
            const k = keys[i];
            if (count >= parseInt(k, 10)) {
                image = this.#images[k];
            } else {
                break;
            }
        }

        return image;
    }

    /**
     * Renders the cluster marker
     *
     * @param {Cluster} cluster The cluster information
     * @returns {google.maps.Marker}
     */
    public render(cluster: Cluster): google.maps.Marker {
        const { count, position } = cluster;
        // Get the image based on the number of markers in the cluster
        const image = this.getImage(count);

        // Set the marker image
        const markerImage = icon(typeof image === 'string' ? image : image.url);
        if (image.width && image.height) {
            markerImage.setSize([image.width, image.height]);
        } else if (image.size) {
            markerImage.setSize(image.size);
        }
        if (image.scaledWidth && image.scaledHeight) {
            markerImage.setScaledSize([image.scaledWidth, image.scaledHeight]);
        } else if (image.scaledSize) {
            markerImage.setScaledSize(image.scaledSize);
        }

        // Set the label
        const label: MarkerLabel = { text: count.toString() };
        if (this.#labelClassName) {
            label.className = this.#labelClassName;
        } else if (image.labelClassName) {
            label.className = image.labelClassName;
        }
        if (this.#labelColor) {
            label.color = this.#labelColor;
        } else if (image.labelColor) {
            label.color = image.labelColor;
        }
        if (this.#labelFontFamily) {
            label.fontFamily = this.#labelFontFamily;
        } else if (image.labelFontFamily) {
            label.fontFamily = image.labelFontFamily;
        }
        if (this.#labelFontSize) {
            label.fontSize = this.#labelFontSize.toString();
        } else if (image.labelFontSize) {
            label.fontSize = image.labelFontSize as string;
        }
        if (this.#labelFontWeight) {
            label.fontWeight = this.#labelFontWeight;
        } else if (image.labelFontWeight) {
            label.fontWeight = image.labelFontWeight;
        }

        // Create the marker
        const clusterMarker = marker({
            lat: position.lat(),
            lng: position.lng(),
            icon: markerImage,
            map: this.#map,
            label: this.#showNumber ? label : undefined,
        });
        return clusterMarker.toGoogle();
    }
}
