/// <reference types="google.maps" />
import { Cluster, ClusterStats, Renderer } from '@googlemaps/markerclusterer';
export type ClusterColor = {
    bgColor: string;
    textColor: string;
};
export type ClusterColors = {
    [key: number]: string | ClusterColor;
};
export declare class DefaultRenderer implements Renderer {
    /**
     * The colors to use for the clusters.
     */
    private colors;
    /**
     * The color to use for the cluster if it has more than the average number of markers in a cluster.
     */
    private averageColor?;
    /**
     * The opacity to use for the center of the marker
     *
     * @type {number}
     */
    private centerOpacity;
    /**
     * The opacity to use for the middle ring of the marker
     *
     * @type {number}
     */
    private middleOpacity;
    /**
     * The opacity to use for the outer ring of the marker
     *
     * @type {number}
     */
    private outerOpacity;
    /**
     * Holds the font family for the cluster marker label
     *
     * @type {string}
     */
    private labelFontFamily;
    /**
     * Holds the font size for the cluster marker
     *
     * @type {string}
     */
    private labelFontSize;
    /**
     * Holds if the number of markers in the cluster should be displayed
     *
     * @type {boolean}
     */
    private showNumber;
    /**
     * Set the color to use for the cluster if it has more than the average number of markers in a cluster,
     * and the fallback color to use if it has less than the average number of markers in a cluster.
     *
     * @param {string} color The color to use if the cluster has more than the average number of markers in a cluster.
     * @param {string} fallback The color to use if the cluster has less than the average number of markers in a cluster.
     */
    setAverageColor(color: string, fallback: string): void;
    /**
     * Set custom colors to use for the cluster markers.
     *
     * @param {ClusterColors} colors The custom colors to use for the cluster markers.
     */
    setColors(colors: ClusterColors): void;
    /**
     * Set the opacity for the center of the marker
     *
     * @param {number} center The opacity to use for the center of the marker
     */
    setCenterOpacity(center: number): void;
    /**
     * Set the opacity for the middle ring of the marker
     *
     * @param {number} middle The opacity to use for the middle ring of the marker
     */
    setMiddleOpacity(middle: number): void;
    /**
     * Set the opacity for the outer ring of the marker
     *
     * @param {number} outer The opacity to use for the outer ring of the marker
     */
    setOuterOpacity(outer: number): void;
    /**
     * Set the font family to use for the cluster marker
     *
     * @param {string} fontFamily The font family to use for the cluster marker
     */
    setFontFamily(fontFamily: string): void;
    /**
     * Set the font size to use for the cluster marker
     *
     * @param {number} fontSize The font size to use for the cluster marker
     */
    setFontSize(fontSize: string | number): void;
    /**
     * Sets if the number of markers in the cluster should be displayed
     *
     * @param {boolean} showNumber Whether to show the number of markers in the cluster
     */
    setShowNumber(showNumber: boolean): void;
    /**
     * Get the color for the cluster.
     *
     * @param {number} count The number of markers in the cluster.
     * @returns {ClusterColor}
     */
    protected getColor(count: number, mean: number): ClusterColor;
    /**
     * Renders the cluster marker
     *
     * @param {Cluster} cluster The cluster information
     * @param {ClusterStatus} stats The status for all of the clusters
     * @param {google.maps.Map} map The map object
     * @returns {google.maps.Marker | google.maps.marker.AdvancedMarkerElement}
     */
    render(cluster: Cluster, stats: ClusterStats, map: google.maps.Map): google.maps.Marker | google.maps.marker.AdvancedMarkerElement;
}
