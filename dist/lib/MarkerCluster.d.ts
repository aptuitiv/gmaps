import { Algorithm, onClusterClickHandler, Renderer, SuperClusterOptions } from '@googlemaps/markerclusterer';
import { Map } from './Map';
import { Marker } from './Marker';
import { ClusterColor, ClusterColors } from './MarkerCluster/DefaultRender';
import { ClusterImages, ClusterImageValue } from './MarkerCluster/ImageRenderer';
import Base from './Base';
type DefaultRenderOptions = {
    colorRangeBottom?: string | ClusterColor;
    colorRangeTop?: string | ClusterColor;
    /**
     * An object that holds the colors for the clusters. This is used to configure the default renderer for the clusters.
     * Use this instead of the greaterThanAverageColor and lessThanAverageColor options if you want more control over the colors.
     * The key should either be a number and the value should be a string color.
     * If the number of markers in the clsuter is greater or equal to the than the key, the color will be used.
     * The first color should have a key of 0 or 1 to handle clusters with 1 or more markers.
     */
    colors?: ClusterColors;
    labelFontFamily?: string;
    labelFontSize?: string | number;
    centerOpacity?: number;
    middleOpacity?: number;
    outerOpacity?: number;
    showNumber?: boolean;
};
type ImageRendererOptions = {
    /**
     * An object that holds the images for the clusters. This is used to configure the image renderer for the clusters.
     * The key should either be a number and the value should be an object containing the image URL, the width, and height of the image.
     * If the number of markers in the clsuter is greater or equal to the than the key, the image will be used.
     * The first image should have a key of 0 or 1 to handle clusters with 1 or more markers.
     */
    images?: ClusterImages;
    image?: ClusterImageValue;
    labelClassName?: string;
    labelColor?: string;
    labelFontFamily?: string;
    labelFontSize?: string | number;
    labelFontWeight?: string;
    showNumber?: boolean;
};
type MarkerClusterOptions = {
    /**
     * A simple string to set the algorithm. Default is "supercluster" for SuperClusterAlgorithm.
     * This is an alternate way to set the algorithm if you don't want to use the algorithmClass.
     * You can still set algorithmOptions if you use this method.
     */
    algorithm?: 'grid' | 'supercluster' | 'noop';
    /**
     * An algorithm to cluster markers. This determines how many markers are clustered together.
     * Default is SuperClusterAlgorithm. Must provide a `calculate` method accepting AlgorithmInput and returning
     * an array of Cluster.
     *
     * https://googlemaps.github.io/js-markerclusterer/classes/GridAlgorithm.html
     */
    algorithmClass?: Algorithm;
    /**
     * The options for the different algorithms.
     * You can set them in this object, or you can set the individual options with the radius and maxZoom options.
     * - radius
     * - maxZoom
     * - minPoints
     *
     * https://googlemaps.github.io/js-markerclusterer/interfaces/AlgorithmOptions.html
     * https://googlemaps.github.io/js-markerclusterer/interfaces/GridOptions.html
     * https://www.npmjs.com/package/supercluster - This is what the SueprClusterAlgorithm uses
     */
    algorithmOptions?: SuperClusterOptions;
    /**
     * The options for the default renderer.
     */
    defaultRenderOptions?: DefaultRenderOptions;
    /**
     * The options for the image renderer.
     */
    imageRendererOptions?: ImageRendererOptions;
    /**
     * The callback function for when a cluster is clicked.
     * The function will be passed the event, the cluster, and the map.
     */
    onClusterClick?: onClusterClickHandler;
    maxZoom?: number;
    minPoints?: number;
    radius?: number;
    /**
     * An object that converts a cluster into a `google.maps.Marker`.
     * Default is DefaultRenderer.
     * It must provide a `render` method accepting Cluster, ClusterStatus, and `google.maps.Map` and returning a `google.maps.Marker`.
     *
     * https://github.com/googlemaps/js-markerclusterer/blob/main/src/renderer.ts
     * https://googlemaps.github.io/js-markerclusterer/classes/DefaultRenderer.html
     */
    renderer?: Renderer;
};
/**
 * The MarkerCluster class to handle clusting of markers on a map
 */
export declare class MarkerCluster extends Base {
    #private;
    /**
     * The constructor for the MarkerCluster class
     *
     * @param {Map} map The map object
     * @param {Marker[]|MarkerClusterOptions} [markers] Markers to cluster. You can also use addMarker() instead of adding the markers here.
     * @param {MarkerClusterOptions} [options] Options for the marker clusterer
     */
    constructor(map: Map, markers?: Marker[] | MarkerClusterOptions, options?: MarkerClusterOptions);
    /**
     * Adds a marker to the cluster
     *
     * @param {Marker} marker The marker to add to the cluster
     * @param {boolean} draw Whether to redraw the clusters after adding the marker.
     *      Default is true. Note, this is opposite of the MarkerClusterer library.
     * @returns {MarkerCluster}
     */
    addMarker(marker: Marker, draw?: boolean): MarkerCluster;
    /**
     * Add multiple markers to the cluster
     *
     * @param {Marker[]} markers The array of markers to add
     * @param {boolean} draw Whether to redraw the clusters after adding the marker.
     *      Default is true. Note, this is opposite of the MarkerClusterer library.
     * @returns {MarkerCluster}
     */
    addMarkers(markers: Marker[], draw?: boolean): MarkerCluster;
    /**
     * Clears all of the markers
     *
     * @param {boolean} draw Whether to redraw the clusters after removing all the markers.
     *      Default is true. Note, this is opposite of the MarkerClusterer library.
     * @returns {MarkerCluster}
     */
    clearMarkers(draw?: boolean): MarkerCluster;
    /**
     * Removes a single marker from the cluster.
     *
     * @param {Marker} marker The marker to remove
     * @param {boolean} draw Whether to redraw the clusters after removing the marker.
     *      Default is true. Note, this is opposite of the MarkerClusterer library.
     * @returns {MarkerCluster}
     */
    removeMarker(marker: Marker, draw?: boolean): MarkerCluster;
    /**
     * Force a recalculation and redraw of all the marker clusters.
     *
     * @returns {MarkerCluster}
     */
    render(): MarkerCluster;
}
/**
 * Helper function to set up the marker cluster object
 *
 * @param {Map} map The map object
 * @param {Marker[]|MarkerClusterOptions} [markers] Markers to cluster. You can also use addMarker() instead of adding the markers here.
 *      Alternately, you can pass the cluster options here.
 * @param {MarkerClusterOptions} [options] Options for the marker clusterer
 * @returns {MarkerCluster}
 */
export declare const markerCluster: (map: Map, markers?: MarkerClusterOptions | Marker[], options?: MarkerClusterOptions) => MarkerCluster;
export {};
