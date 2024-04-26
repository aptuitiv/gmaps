/* ===========================================================================
    Handles clustering of markers on a map.
    This is helpful for maps that have a lot of markers.

    https://developers.google.com/maps/documentation/javascript/marker-clustering
    https://www.npmjs.com/package/@googlemaps/markerclusterer

    See https://aptuitiv.github.io/gmaps-docs/api-reference/marker-cluster for documentation.
=========================================================================== */

import {
    Algorithm,
    GridAlgorithm,
    Marker as MarkerClustererMarker,
    MarkerClusterer,
    MarkerClustererOptions,
    NoopAlgorithm,
    onClusterClickHandler,
    Renderer,
    SuperClusterAlgorithm,
    SuperClusterOptions,
} from '@googlemaps/markerclusterer';
import { Map } from './Map';
import { Marker } from './Marker';
import { checkForGoogleMaps, getNumber, isFunction, isNumber, isNumberString, isObject } from './helpers';
import { ClusterColor, ClusterColors, DefaultRenderer } from './MarkerCluster/DefaultRender';
import { ClusterImages, ClusterImageValue, ImageRenderer } from './MarkerCluster/ImageRenderer';
import Base from './Base';
import { loader } from './Loader';

// Options for the default renderer
export type DefaultRenderOptions = {
    // The color to use for the cluster if it has less than the average number of markers in a cluster.
    colorRangeBottom?: string | ClusterColor;
    // The color to use for the cluster if it has more than the average number of markers in a cluster.
    colorRangeTop?: string | ClusterColor;
    /**
     * An object that holds the colors for the clusters. This is used to configure the default renderer for the clusters.
     * Use this instead of the greaterThanAverageColor and lessThanAverageColor options if you want more control over the colors.
     * The key should either be a number and the value should be a string color.
     * If the number of markers in the clsuter is greater or equal to the than the key, the color will be used.
     * The first color should have a key of 0 or 1 to handle clusters with 1 or more markers.
     */
    colors?: ClusterColors;
    // The font family of the label text (equivalent to the CSS font-family property).
    labelFontFamily?: string;
    // The font size of the label text (equivalent to the CSS font-size property). Default size is 12px.
    // If it's set to a number then "px" will be added to the end of the number.
    labelFontSize?: string | number;
    // The opacity to use for the center of the marker
    centerOpacity?: number;
    // The opacity to use for the middle ring of the marker
    middleOpacity?: number;
    // The opacity to use for the outer ring of the marker
    outerOpacity?: number;
    // Whether to show the number of markers in the cluster
    showNumber?: boolean;
};

export type ImageRendererOptions = {
    /**
     * An object that holds the images for the clusters. This is used to configure the image renderer for the clusters.
     * The key should either be a number and the value should be an object containing the image URL, the width, and height of the image.
     * If the number of markers in the clsuter is greater or equal to the than the key, the image will be used.
     * The first image should have a key of 0 or 1 to handle clusters with 1 or more markers.
     */
    images?: ClusterImages;
    // A single image for the cluster.
    // Use this instead of "images" if you only need one image for the cluster.
    image?: ClusterImageValue;
    // A CSS class name to be added to the label element
    labelClassName?: string;
    // The color of the label text. Default color is black.
    labelColor?: string;
    // The font family of the label text (equivalent to the CSS font-family property).
    labelFontFamily?: string;
    // The font size of the label text (equivalent to the CSS font-size property). Default size is 14px.
    // If it's set to a number then "px" will be added to the end of the number.
    labelFontSize?: string | number;
    // The font weight of the label text (equivalent to the CSS font-weight property).
    labelFontWeight?: string;
    // Whether to show the number of markers in the cluster
    showNumber?: boolean;
};

// Options for the marker cluster
export type MarkerClusterOptions = {
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
    // The maxium zoom level to cluster markers. Higher numbers means more zoomed in.
    // Defaults to 13.
    // This is used by the SuperClusterAlgorithm and the GridAlgorithm.
    // If set, this will override the maxZoom option in the algorithmOptions.
    maxZoom?: number;
    // Minimum number of points to form a cluster. Default is 3.
    minPoints?: number;
    // The radius to use to determine which markers to cluster. Default is 40.
    // The larger the number the more markers to include in a cluster and fewer clusters.
    // The lower the number the more clusters there may be.
    // This is used by the SuperClusterAlgorithm.
    // If set, this will override the radius option in the algorithmOptions.
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
export class MarkerCluster extends Base {
    /**
     * The MarkerClusterer object
     *
     * @private
     * @type {MarkerClusterer}
     */
    #clusterer: MarkerClusterer;

    /**
     * Holds any markers to add to the cluster once the map is loaded
     *
     * @private
     * @type {Marker[]}
     */
    #pendingMarkers: Marker[] = [];

    /**
     * The constructor for the MarkerCluster class
     *
     * @param {Map} map The map object
     * @param {Marker[]|MarkerClusterOptions} [markers] Markers to cluster. You can also use addMarker() instead of adding the markers here.
     * @param {MarkerClusterOptions} [options] Options for the marker clusterer
     */
    constructor(map: Map, markers?: Marker[] | MarkerClusterOptions, options?: MarkerClusterOptions) {
        super('markercluster');
        if (!(map instanceof Map)) {
            throw new Error('You must pass a valid map object to the MarkerCluster object.');
        }
        if (checkForGoogleMaps('MarkerCluster', 'Marker', false)) {
            this.#setupCluster(map, markers, options);
        } else {
            loader().on('map_loaded', () => {
                this.#setupCluster(map, markers, options);
            });
        }
    }

    /**
     * Set up the marker cluster
     *
     * @param {Map} map The map object
     * @param {Marker[]|MarkerClusterOptions} [markers] Markers to cluster. You can also use addMarker() instead of adding the markers here.
     * @param {MarkerClusterOptions} [options] Options for the marker clusterer
     */
    #setupCluster(map: Map, markers?: Marker[] | MarkerClusterOptions, options?: MarkerClusterOptions) {
        const clusterOptions: MarkerClustererOptions = {
            map: map.toGoogle(),
        };

        // Set the options
        let optionsToUse: MarkerClusterOptions = options;
        if (isObject(markers) && typeof options === 'undefined') {
            // The markers were not passed in, but the options were
            optionsToUse = markers as MarkerClusterOptions;
        }

        if (isObject(optionsToUse)) {
            // Set the algorithm that determines the clustering
            const algorithmOptions: SuperClusterOptions = isObject(optionsToUse.algorithmOptions)
                ? optionsToUse.algorithmOptions
                : {};
            if (isNumber(optionsToUse.maxZoom) || isNumberString(optionsToUse.maxZoom)) {
                algorithmOptions.maxZoom = getNumber(optionsToUse.maxZoom);
            }
            // Set the minimum zoom level to cluster markers if it's not already set
            if (typeof algorithmOptions.maxZoom === 'undefined') {
                algorithmOptions.maxZoom = 13;
            }
            // Set the cluster radius if necessary
            if (isNumber(optionsToUse.radius) || isNumberString(optionsToUse.radius)) {
                algorithmOptions.radius = getNumber(optionsToUse.radius);
            }
            // Set the minimum number of points to form a cluster
            if (isNumber(optionsToUse.minPoints) || isNumberString(optionsToUse.minPoints)) {
                algorithmOptions.minPoints = getNumber(optionsToUse.minPoints);
            }
            if (typeof algorithmOptions.minPoints === 'undefined') {
                algorithmOptions.minPoints = 3;
            }
            if (typeof optionsToUse.algorithm === 'string') {
                switch (optionsToUse.algorithm) {
                    case 'grid':
                        clusterOptions.algorithm = new GridAlgorithm(algorithmOptions);
                        break;
                    case 'supercluster':
                        clusterOptions.algorithm = new SuperClusterAlgorithm(algorithmOptions);
                        break;
                    case 'noop':
                        clusterOptions.algorithm = new NoopAlgorithm(algorithmOptions);
                        break;
                    default:
                        // Default to SuperClusterAlgorithm
                        if (Object.keys(algorithmOptions).length > 0) {
                            clusterOptions.algorithm = new SuperClusterAlgorithm(algorithmOptions);
                        }
                        break;
                }
            } else if (typeof optionsToUse.algorithmClass !== 'undefined') {
                clusterOptions.algorithm = optionsToUse.algorithmClass;
            }
            if (Object.keys(algorithmOptions).length > 0) {
                clusterOptions.algorithmOptions = algorithmOptions;
            }
            if (isFunction(optionsToUse.onClusterClick)) {
                clusterOptions.onClusterClick = optionsToUse.onClusterClick;
            }
            // Set the renderer
            if (typeof optionsToUse.renderer !== 'undefined') {
                // Set the renderer to the passed custom renderer
                clusterOptions.renderer = optionsToUse.renderer;
            } else if (isObject(optionsToUse.defaultRenderOptions)) {
                // Set up the default renderer
                const renderer = new DefaultRenderer();
                const renderOptions: DefaultRenderOptions = optionsToUse.defaultRenderOptions;
                // The default renderer is being used. Set it up.
                if (isObject(renderOptions.colors)) {
                    renderer.setColors(renderOptions.colors);
                }
                if (renderOptions.colorRangeTop) {
                    renderer.setColorRangeTop(renderOptions.colorRangeTop);
                }
                if (renderOptions.colorRangeBottom) {
                    renderer.setColorRangeBottom(renderOptions.colorRangeBottom);
                }

                if (typeof renderOptions.labelFontFamily === 'string') {
                    renderer.setFontFamily(renderOptions.labelFontFamily);
                }
                if (typeof renderOptions.labelFontSize !== 'undefined') {
                    renderer.setFontSize(renderOptions.labelFontSize);
                }
                if (typeof renderOptions.centerOpacity !== 'undefined') {
                    renderer.setCenterOpacity(renderOptions.centerOpacity);
                }
                if (typeof renderOptions.middleOpacity !== 'undefined') {
                    renderer.setMiddleOpacity(renderOptions.middleOpacity);
                }
                if (typeof renderOptions.outerOpacity !== 'undefined') {
                    renderer.setOuterOpacity(renderOptions.outerOpacity);
                }
                if (typeof renderOptions.showNumber !== 'undefined') {
                    renderer.setShowNumber(renderOptions.showNumber);
                }
                clusterOptions.renderer = renderer;
            } else if (isObject(optionsToUse.imageRendererOptions)) {
                const renderer = new ImageRenderer();
                renderer.setMap(map);
                const renderOptions: ImageRendererOptions = optionsToUse.imageRendererOptions;
                if (typeof renderOptions.images !== 'undefined') {
                    renderer.setImages(renderOptions.images);
                } else if (typeof renderOptions.image !== 'undefined') {
                    renderer.setImage(renderOptions.image);
                }
                if (typeof renderOptions.labelClassName === 'string') {
                    renderer.setLabelClassName(renderOptions.labelClassName);
                }
                if (typeof renderOptions.labelColor === 'string') {
                    renderer.setLabelColor(renderOptions.labelColor);
                }
                if (typeof renderOptions.labelFontFamily === 'string') {
                    renderer.setLabelFontFamily(renderOptions.labelFontFamily);
                }
                if (typeof renderOptions.labelFontSize !== 'undefined') {
                    renderer.setLabelFontSize(renderOptions.labelFontSize);
                }
                if (typeof renderOptions.labelFontWeight === 'string') {
                    renderer.setLabelFontWeight(renderOptions.labelFontWeight);
                }
                if (typeof renderOptions.showNumber !== 'undefined') {
                    renderer.setShowNumber(renderOptions.showNumber);
                }
                clusterOptions.renderer = renderer;
            }
        } else {
            // No options were set. Set the default renderer
            clusterOptions.renderer = new DefaultRenderer();
        }

        // Set the marker cluster object
        this.#clusterer = new MarkerClusterer(clusterOptions);

        // Set the markers if they were passed in
        if (Array.isArray(markers)) {
            markers.forEach((marker) => {
                if (marker instanceof Marker) {
                    this.#clusterer.addMarker(marker.toGoogleSync(), true);
                }
            });
        }
    }

    /**
     * Adds a marker to the cluster
     *
     * @param {Marker} marker The marker to add to the cluster
     * @param {boolean} draw Whether to redraw the clusters after adding the marker.
     *      Default is true. Note, this is opposite of the MarkerClusterer library.
     * @returns {MarkerCluster}
     */
    addMarker(marker: Marker, draw: boolean = true): MarkerCluster {
        // Check to see if the Google Maps library is loaded.
        // If it is, add the marker. If not, delay adding the marker.
        if (checkForGoogleMaps('MarkerCluster', 'Marker', false)) {
            this.#clusterer.addMarker(marker.toGoogleSync(), !draw);
        } else {
            this.#pendingMarkers.push(marker);
            loader().on('map_loaded', () => {
                this.addMarkers(this.#pendingMarkers, draw);
                this.#pendingMarkers = [];
            });
        }
        return this;
    }

    /**
     * Add multiple markers to the cluster
     *
     * @param {Marker[]} markers The array of markers to add
     * @param {boolean} draw Whether to redraw the clusters after adding the marker.
     *      Default is true. Note, this is opposite of the MarkerClusterer library.
     * @returns {MarkerCluster}
     */
    addMarkers(markers: Marker[], draw: boolean = true): MarkerCluster {
        // Inline function to add the markers
        const add = (mks: Marker[], drw: boolean = true) => {
            const markersToAdd: MarkerClustererMarker[] = [];
            mks.forEach((marker) => {
                if (marker instanceof Marker) {
                    markersToAdd.push(marker.toGoogleSync());
                }
            });
            this.#clusterer.addMarkers(markersToAdd, !drw);
        };

        // Check to see if the Google Maps library is loaded.
        // If it is, add the markers. If not, delay adding the markers.
        if (checkForGoogleMaps('MarkerCluster', 'Marker', false)) {
            add(markers, draw);
        } else {
            markers.forEach((marker) => {
                this.#pendingMarkers.push(marker);
            });
            loader().on('map_loaded', () => {
                add(this.#pendingMarkers, draw);
                this.#pendingMarkers = [];
            });
        }
        return this;
    }

    /**
     * Clears all of the markers
     *
     * @param {boolean} draw Whether to redraw the clusters after removing all the markers.
     *      Default is true. Note, this is opposite of the MarkerClusterer library.
     * @returns {MarkerCluster}
     */
    clearMarkers(draw: boolean = true): MarkerCluster {
        this.#clusterer.clearMarkers(!draw);
        return this;
    }

    /**
     * Removes a single marker from the cluster.
     *
     * @param {Marker} marker The marker to remove
     * @param {boolean} draw Whether to redraw the clusters after removing the marker.
     *      Default is true. Note, this is opposite of the MarkerClusterer library.
     * @returns {MarkerCluster}
     */
    removeMarker(marker: Marker, draw: boolean = false): MarkerCluster {
        this.#clusterer.removeMarker(marker.toGoogleSync(), !draw);
        return this;
    }

    /**
     * Force a recalculation and redraw of all the marker clusters.
     *
     * @returns {MarkerCluster}
     */
    render(): MarkerCluster {
        this.#clusterer.render();
        return this;
    }
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
export const markerCluster = (
    map: Map,
    markers?: MarkerClusterOptions | Marker[],
    options?: MarkerClusterOptions
): MarkerCluster => new MarkerCluster(map, markers, options);
