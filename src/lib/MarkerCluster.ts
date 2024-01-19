/* ===========================================================================
    Handles clustering of markers on a map.
    This is helpful for maps that have a lot of markers.

    Usage:
    const cluster = G.markerCluster(trailListMap.map);
    const marker = G.marker({
        position: G.latLng(0, 0),
    });
    marker.addTo(map);
    cluster.addMarker(marker);
=========================================================================== */

import {
    Algorithm,
    AlgorithmOptions,
    GridAlgorithm,
    MarkerClusterer,
    MarkerClustererOptions,
    NoopAlgorithm,
    onClusterClickHandler,
    Renderer,
    SuperClusterAlgorithm,
} from '@googlemaps/markerclusterer';
import { Map } from './Map';
import { Marker } from './Marker';
import { isObject } from './helpers';
import { ClusterColors, DefaultRenderer } from './MarkerCluster/DefaultRender';

// Options for the default renderer
type DefaultRenderOptions = {
    // The color to use for the cluster if it has more than the average number of markers in a cluster.
    averageColor?: string;
    // The color to use for the cluster if it has less than the average number of markers in a cluster.
    averageFallbackColor?: string;
    /**
     * An object that holds the colors for the clusters. This is used to configure the default renderer for the clusters.
     * Use this instead of the averageColor and averageFallbackColor options if you want more control over the colors.
     * The key should either be a number and the value should be a string color.
     * If the number of markers in the clsuter is greater or equal to the than the key, the color will be used.
     * The first color should have a key of 0 or 1 to handle clusters with 1 or more markers.
     * Use
     */
    colors?: ClusterColors;
    // The font family for the cluster marker
    fontFamily?: string;
    // The font size for the cluster marker
    fontSize?: number;
    // The opacity to use for the center of the marker
    centerOpacity?: number;
    // The opacity to use for the middle ring of the marker
    middleOpacity?: number;
    // The opacity to use for the outer ring of the marker
    outerOpacity?: number;
    // Whether to show the number of markers in the cluster
    showNumber?: boolean;
};

// Options for the marker cluster
type MarkerClusterOptions = {
    /**
     * A simple string to set the algorithm. Default is "supercluster" for SuperClusterAlgorithm.
     * This is an alternate way to set the algorithm if you don't want to use the algorithmClass.
     * You can still set algorithmOptions if you use this method.
     */
    algorithm?: 'grid' | 'supercluster' | 'noop';
    /**
     * An algorithm to cluster markers. Default is SuperClusterAlgorithm. Must
     * provide a `calculate` method accepting AlgorithmInput and returning
     * an array of Cluster.
     * @link https://googlemaps.github.io/js-markerclusterer/classes/GridAlgorithm.html
     */
    algorithmClass?: Algorithm;
    /**
     * The options for the different algorithms.
     * @link https://googlemaps.github.io/js-markerclusterer/interfaces/GridOptions.html
     */
    algorithmOptions?: AlgorithmOptions;
    defaultRenderOptions?: DefaultRenderOptions;
    /**
     * The callback function for when a cluster is clicked.
     * The function will be passed the event, the cluster, and the map.
     */
    onClusterClick?: onClusterClickHandler;
    /**
     * An object that converts a cluster into a `google.maps.Marker`.
     * Default is DefaultRenderer.
     * It must provide a `render` method accepting Cluster, ClusterStatus, and `google.maps.Map` and returning a `google.maps.Marker`.
     * @link https://github.com/googlemaps/js-markerclusterer/blob/main/src/renderer.ts
     * @link https://googlemaps.github.io/js-markerclusterer/classes/DefaultRenderer.html
     */
    renderer?: Renderer;
};

/**
 * The MarkerCluster class to handle clusting of markers on a map
 */
export class MarkerCluster {
    /**
     * The MarkerClusterer object
     */
    private clusterer: MarkerClusterer;

    /**
     * The constructor for the MarkerCluster class
     *
     * @param {Map} map The map object
     * @param {Marker[]|MarkerClusterOptions} [markers] Markers to cluster. You can also use addMarker() instead of adding the markers here.
     * @param {MarkerClusterOptions} [options] Options for the marker clusterer
     */
    constructor(map: Map, markers?: Marker[] | MarkerClusterOptions, options?: MarkerClusterOptions) {
        const clusterOptions: MarkerClustererOptions = {
            map: map.get(),
        };

        // Set up the default renderer
        const renderer = new DefaultRenderer();

        // Set the options
        let optionsToUse: MarkerClusterOptions = options;
        if (isObject(markers) && typeof options === 'undefined') {
            // The markers were not passed in, but the options were
            optionsToUse = markers as MarkerClusterOptions;
        }

        if (isObject(optionsToUse)) {
            // Set the algorithm if it was passed in
            if (typeof optionsToUse.algorithm === 'string') {
                switch (optionsToUse.algorithm) {
                    case 'grid':
                        clusterOptions.algorithm = new GridAlgorithm(optionsToUse.algorithmOptions);
                        break;
                    case 'supercluster':
                        clusterOptions.algorithm = new SuperClusterAlgorithm(optionsToUse.algorithmOptions);
                        break;
                    case 'noop':
                        clusterOptions.algorithm = new NoopAlgorithm(optionsToUse.algorithmOptions);
                        break;
                    default:
                        if (typeof optionsToUse.algorithmOptions !== 'undefined') {
                            clusterOptions.algorithm = new SuperClusterAlgorithm(optionsToUse.algorithmOptions);
                        }
                        break;
                }
            } else if (typeof optionsToUse.algorithmClass !== 'undefined') {
                clusterOptions.algorithm = optionsToUse.algorithmClass;
            }
            if (typeof optionsToUse.algorithmOptions !== 'undefined') {
                clusterOptions.algorithmOptions = optionsToUse.algorithmOptions;
            }
            if (typeof optionsToUse.onClusterClick !== 'undefined') {
                clusterOptions.onClusterClick = optionsToUse.onClusterClick;
            }
            if (typeof optionsToUse.renderer !== 'undefined') {
                clusterOptions.renderer = optionsToUse.renderer;
            } else {
                // Set up the default renderer
                if (isObject(optionsToUse.defaultRenderOptions)) {
                    if (isObject(optionsToUse.defaultRenderOptions.colors)) {
                        renderer.setColors(optionsToUse.defaultRenderOptions.colors);
                    } else if (
                        typeof optionsToUse.defaultRenderOptions.averageColor === 'string' &&
                        typeof optionsToUse.defaultRenderOptions.averageFallbackColor === 'string'
                    ) {
                        renderer.setAverageColor(
                            optionsToUse.defaultRenderOptions.averageColor,
                            optionsToUse.defaultRenderOptions.averageFallbackColor
                        );
                    }
                    if (typeof optionsToUse.defaultRenderOptions.fontFamily === 'string') {
                        renderer.setFontFamily(optionsToUse.defaultRenderOptions.fontFamily);
                    }
                    if (typeof optionsToUse.defaultRenderOptions.fontSize !== 'undefined') {
                        renderer.setFontSize(optionsToUse.defaultRenderOptions.fontSize);
                    }
                    if (typeof optionsToUse.defaultRenderOptions.centerOpacity !== 'undefined') {
                        renderer.setCenterOpacity(optionsToUse.defaultRenderOptions.centerOpacity);
                    }
                    if (typeof optionsToUse.defaultRenderOptions.middleOpacity !== 'undefined') {
                        renderer.setMiddleOpacity(optionsToUse.defaultRenderOptions.middleOpacity);
                    }
                    if (typeof optionsToUse.defaultRenderOptions.outerOpacity !== 'undefined') {
                        renderer.setOuterOpacity(optionsToUse.defaultRenderOptions.outerOpacity);
                    }
                    if (typeof optionsToUse.defaultRenderOptions.showNumber !== 'undefined') {
                        renderer.setShowNumber(optionsToUse.defaultRenderOptions.showNumber);
                    }
                }

                clusterOptions.renderer = renderer;
            }
        } else {
            // No options were set. Set the default renderer
            clusterOptions.renderer = renderer;
        }

        // Set the marker cluster object
        this.clusterer = new MarkerClusterer(clusterOptions);

        // Set the markers if they were passed in
        if (Array.isArray(markers)) {
            markers.forEach((marker) => {
                if (marker instanceof Marker) {
                    this.clusterer.addMarker(marker.get(), true);
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
     */
    addMarker(marker: Marker, draw: boolean = true) {
        this.clusterer.addMarker(marker.get(), !draw);
    }

    /**
     * Add multiple markers to the cluster
     *
     * @param {Marker[]} markers The array of markers to add
     * @param {boolean} draw Whether to redraw the clusters after adding the marker.
     *      Default is true. Note, this is opposite of the MarkerClusterer library.
     */
    addMarkers(markers: Marker[], draw: boolean = true) {
        const markersToAdd: google.maps.Marker[] = [];
        markers.forEach((marker) => {
            if (marker instanceof Marker) {
                markersToAdd.push(marker.get());
            }
        });
        this.clusterer.addMarkers(markersToAdd, !draw);
    }

    /**
     *
     * @param marker The marker to remove
     * @param {boolean} draw Whether to redraw the clusters after removing the marker.
     *      Default is true. Note, this is opposite of the MarkerClusterer library.
     */
    removeMarker(marker: Marker, draw: boolean = false) {
        this.clusterer.removeMarker(marker.get(), !draw);
    }

    /**
     * Clears all of the markers
     *
     * @param {boolean} draw Whether to redraw the clusters after removing all the markers.
     *      Default is true. Note, this is opposite of the MarkerClusterer library.
     */
    clearMarkers(draw: boolean = true) {
        this.clusterer.clearMarkers(!draw);
    }

    /**
     * Force a recalculation and redraw of all the marker clusters.
     */
    render() {
        this.clusterer.render();
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
