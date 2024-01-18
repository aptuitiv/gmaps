/* ===========================================================================
    The default renderer for marker clusters.

    This is a customization of the DefaultRender from the @googlemaps/markerclusterer library
    to allow customization of the colors of the clusters based on the number of markers in the cluster.
=========================================================================== */

import { Cluster, ClusterStats, MarkerUtils, Renderer } from '@googlemaps/markerclusterer';
import { getNumber, isObject } from '../helpers';

export type ClusterColor = {
    bgColor: string;
    textColor: string;
};

export type ClusterColors = {
    [key: number]: string | ClusterColor;
};

export class DefaultRenderer implements Renderer {
    /**
     * The colors to use for the clusters.
     */
    private colors: ClusterColors = {
        0: '#0000ff',
    };

    /**
     * The color to use for the cluster if it has more than the average number of markers in a cluster.
     */
    private averageColor?: string = '#ff0000';

    /**
     * The opacity to use for the center of the marker
     *
     * @type {number}
     */
    private centerOpacity: number = 0.7;

    /**
     * The opacity to use for the middle ring of the marker
     *
     * @type {number}
     */
    private middleOpacity: number = 0.4;

    /**
     * The opacity to use for the outer ring of the marker
     *
     * @type {number}
     */
    private outerOpacity: number = 0.2;

    /**
     * Holds the font family for the cluster marker
     *
     * @type {string}
     */
    private fontFamily: string = 'roboto,arial,sans-serif';

    /**
     * Holds the font size for the cluster marker
     *
     * @type {number}
     */
    private fontSize: number = 50;

    /**
     * Set the color to use for the cluster if it has more than the average number of markers in a cluster,
     * and the fallback color to use if it has less than the average number of markers in a cluster.
     *
     * @param {string} color The color to use if the cluster has more than the average number of markers in a cluster.
     * @param {string} fallback The color to use if the cluster has less than the average number of markers in a cluster.
     */
    setAverageColor(color: string, fallback: string): void {
        this.averageColor = color;
        this.colors = { 0: fallback };
    }

    /**
     * Set custom colors to use for the cluster markers.
     *
     * @param {ClusterColors} colors The custom colors to use for the cluster markers.
     */
    setColors(colors: ClusterColors): void {
        if (isObject(colors)) {
            // Sort the colors by the key and make sure that the key is a valid number >= 0.
            const sortedColors = Object.keys(colors)
                .map((k) => parseInt(k, 10))
                .filter(
                    (k) =>
                        !Number.isNaN(k) &&
                        k >= 0 &&
                        (typeof colors[k] === 'string' ||
                            (isObject(colors[k]) && typeof (colors[k] as ClusterColor).bgColor === 'string'))
                )
                .sort((a, b) => a - b)
                .reduce((acc, k) => {
                    acc[k] = colors[k];
                    return acc;
                }, {});
            if (Object.keys(sortedColors).length > 0) {
                this.colors = sortedColors;
            }
        }
    }

    /**
     * Set the opacity for the center of the marker
     *
     * @param {number} center The opacity to use for the center of the marker
     */
    setCenterOpacity(center: number): void {
        const opacity = getNumber(center);
        if (!Number.isNaN(opacity) && opacity >= 0 && opacity <= 1) {
            this.centerOpacity = opacity;
        }
    }

    /**
     * Set the opacity for the middle ring of the marker
     *
     * @param {number} middle The opacity to use for the middle ring of the marker
     */
    setMiddleOpacity(middle: number): void {
        const opacity = getNumber(middle);
        if (!Number.isNaN(opacity) && opacity >= 0 && opacity <= 1) {
            this.middleOpacity = opacity;
        }
    }

    /**
     * Set the opacity for the outer ring of the marker
     *
     * @param {number} outer The opacity to use for the outer ring of the marker
     */
    setOuterOpacity(outer: number): void {
        const opacity = getNumber(outer);
        if (!Number.isNaN(opacity) && opacity >= 0 && opacity <= 1) {
            this.outerOpacity = opacity;
        }
    }

    /**
     * Set the font family to use for the cluster marker
     *
     * @param {string} fontFamily The font family to use for the cluster marker
     */
    setFontFamily(fontFamily: string): void {
        this.fontFamily = fontFamily;
    }

    /**
     * Set the font size to use for the cluster marker
     *
     * @param {number} fontSize The font size to use for the cluster marker
     */
    setFontSize(fontSize: number): void {
        const size = getNumber(fontSize);
        if (!Number.isNaN(size) && size > 0) {
            this.fontSize = size;
        }
    }

    /**
     * Get the color for the cluster.
     *
     * @param {number} count The number of markers in the cluster.
     * @returns {ClusterColor}
     */
    protected getColor(count: number, mean: number): ClusterColor {
        const keys = Object.keys(this.colors);
        let color = this.colors[keys[0]];
        let bgColor = typeof color === 'string' ? color : color.bgColor;
        let textColor = color.textColor ?? '#ffffff';

        if (typeof this.averageColor === 'string' && count >= Math.max(parseInt(keys[keys.length - 1], 10), mean)) {
            bgColor = this.averageColor;
        } else {
            for (let i = 0; i < keys.length; i += 1) {
                const k = keys[i];
                if (count >= parseInt(k, 10)) {
                    color = this.colors[k];
                    if (typeof color === 'string') {
                        bgColor = color;
                    } else {
                        bgColor = color.bgColor;
                        if (color.textColor) {
                            textColor = color.textColor;
                        }
                    }
                } else {
                    break;
                }
            }
        }

        return {
            bgColor,
            textColor,
        };
    }

    /**
     * Renders the cluster marker
     *
     * @param {Cluster} cluster The cluster information
     * @param {ClusterStatus} stats The status for all of the clusters
     * @param {google.maps.Map} map The map object
     * @returns {google.maps.Marker | google.maps.marker.AdvancedMarkerElement}
     */
    public render(
        cluster: Cluster,
        stats: ClusterStats,
        map: google.maps.Map
    ): google.maps.Marker | google.maps.marker.AdvancedMarkerElement {
        const { count, position } = cluster;
        // Get the color based on the number of markers in the cluster
        const color = this.getColor(count, stats.clusters.markers.mean);

        // create svg literal with fill color
        const svg = `<svg fill="${color.bgColor}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" width="50" height="50">
                <circle cx="120" cy="120" opacity="${this.centerOpacity}" r="70" />
                <circle cx="120" cy="120" opacity="${this.middleOpacity}" r="90" />
                <circle cx="120" cy="120" opacity="${this.outerOpacity}" r="110" />
                <text x="50%" y="50%" style="fill:${color.textColor}" text-anchor="middle" font-size="${this.fontSize}" dominant-baseline="middle" font-family="${this.fontFamily}">${count}</text>
            </svg>`;

        const title = `Cluster of ${count} markers`;
        // adjust zIndex to be above other markers
        const zIndex: number = Number(google.maps.Marker.MAX_ZINDEX) + count;

        if (MarkerUtils.isAdvancedMarkerAvailable(map)) {
            // create cluster SVG element
            const parser = new DOMParser();
            const svgEl = parser.parseFromString(svg, 'image/svg+xml').documentElement;
            svgEl.setAttribute('transform', 'translate(0 25)');

            const clusterOptions: google.maps.marker.AdvancedMarkerElementOptions = {
                map,
                position,
                zIndex,
                title,
                content: svgEl,
            };
            return new google.maps.marker.AdvancedMarkerElement(clusterOptions);
        }

        const clusterOptions: google.maps.MarkerOptions = {
            position,
            zIndex,
            title,
            icon: {
                url: `data:image/svg+xml;base64,${btoa(svg)}`,
                anchor: new google.maps.Point(25, 25),
            },
        };
        return new google.maps.Marker(clusterOptions);
    }
}
