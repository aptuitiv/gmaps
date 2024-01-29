/// <reference types="google.maps" />
import { Cluster, ClusterStats, Renderer } from '@googlemaps/markerclusterer';
import { SizeValue } from '../Size';
type ClusterImage = {
    height?: number;
    labelClassName?: string;
    labelColor?: string;
    labelFontFamily?: string;
    labelFontSize?: string | number;
    labelFontWeight?: string;
    scaledHeight?: number;
    scaledSize?: SizeValue;
    scaledWidth?: number;
    size?: SizeValue;
    url: string;
    width?: number;
};
export type ClusterImageValue = string | ClusterImage;
export type ClusterImages = {
    [key: number]: ClusterImageValue;
};
/**
 * The image renderer for the marker clusterer to render an image as the marker cluster
 */
export declare class ImageRenderer implements Renderer {
    /**
     * Holds the images that can be used for the marker cluster icons
     *
     * @type {ClusterImages}
     */
    private images;
    /**
     * A CSS class name to be added to the label element
     *
     * @type {string}
     */
    private labelClassName;
    /**
     * The color of the label text. Default color is black.
     *
     * @type {string}
     */
    private labelColor;
    /**
     * Holds the font family for the cluster marker label.
     *
     * @type {string}
     */
    private labelFontFamily;
    /**
     * Holds the font size for the cluster marker
     *
     * @type {number}
     */
    private labelFontSize;
    /**
     * The font weight of the label text (equivalent to the CSS font-weight property).
     *
     * @type {string}
     */
    private labelFontWeight;
    /**
     * Holds if the number of markers in the cluster should be displayed
     *
     * @type {boolean}
     */
    private showNumber;
    /**
     * Set custom images to use for the cluster markers.
     *
     * @param {ClusterImages} images The custom images to use for the cluster markers.
     */
    setImages(images: ClusterImages): void;
    /**
     * Set a single image to use for the cluster markers.
     * This will replace any existing images.
     * The image will be used for all clusters.
     * To set different images for different cluster sizes, use the setImages method.
     *
     * @param {ClusterImageValue} image The image URL or image object to use for the cluster markers.
     */
    setImage(image: ClusterImageValue): void;
    /**
     * Set the class name to use for the label
     *
     * @param {string} labelClassName The class name to use for the label
     */
    setLabelClassName(labelClassName: string): void;
    /**
     * Set the color of the label text
     *
     * @param {string} labelColor The color of the label text. Default color is black.
     */
    setLabelColor(labelColor: string): void;
    /**
     * Set the font family to use for the cluster marker
     *
     * @param {string} fontFamily The font family to use for the cluster marker
     */
    setLabelFontFamily(fontFamily: string): void;
    /**
     * Set the font size to use for the cluster marker
     *
     * @param {string|number} fontSize The font size to use for the cluster marker
     */
    setLabelFontSize(fontSize: string | number): void;
    /**
     * Set the font weight to use for the cluster marker
     *
     * @param {string} labelFontWeight The font weight to use for the cluster marker
     */
    setLabelFontWeight(labelFontWeight: string): void;
    /**
     * Sets if the number of markers in the cluster should be displayed
     *
     * @param {boolean} showNumber Whether to show the number of markers in the cluster
     */
    setShowNumber(showNumber: boolean): void;
    /**
     * Get the image for the cluster.
     *
     * @param {number} count The number of markers in the cluster.
     * @returns {ClusterImage}
     */
    protected getImage(count: number): ClusterImage;
    /**
     * Renders the cluster marker
     *
     * @param {Cluster} cluster The cluster information
     * @param {ClusterStatus} stats The status for all of the clusters
     * @param {google.maps.Map} map The map object
     * @returns {google.maps.Marker}
     */
    render(cluster: Cluster, stats: ClusterStats, map: google.maps.Map): google.maps.Marker;
}
export {};
