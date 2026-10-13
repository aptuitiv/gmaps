/* ===========================================================================
    Tests for the MarkerCluster class.

    The point of these is the map reference. The cluster draws the markers itself, through their
    Google marker objects, so the Marker objects are never told which map they ended up on. A
    popup or a tooltip attached to a clustered marker works out where to show itself from
    getMap(), so with nothing there neither of them shows at all.

    @googlemaps/markerclusterer is mocked here for two reasons. The real MarkerClusterer extends
    OverlayViewSafe, which copies google.maps.OverlayView.prototype with a for...in loop - class
    methods aren't enumerable, so nothing is copied off the stub and it can't be constructed.
    Mocking it also keeps these tests on what this library does rather than on what the clusterer
    does with what it's handed.
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { markerCluster } from '../src/lib/MarkerCluster';
import { marker } from '../src/lib/Marker';
import { DefaultRenderer } from '../src/lib/MarkerCluster/DefaultRender';
import { ImageRenderer } from '../src/lib/MarkerCluster/ImageRenderer';
import { installGoogleMaps, mapsStats, uninstallGoogleMaps } from './support/googleMaps';
import { fakeMap } from './support/fakeMap';

vi.mock('@googlemaps/markerclusterer', () => {
    /**
     * A stand-in for the clusterer that records the Google markers it was given
     */
    class MarkerClusterer {
        /** Every clusterer that has been constructed, so that a test can reach the last one */
        static instances: MarkerClusterer[] = [];

        /** The Google marker objects that have been added */
        markers: unknown[] = [];

        /** How many times the clusters have been drawn */
        renderCount: number = 0;

        /** The options it was constructed with */
        options: Record<string, unknown>;

        /**
         * Constructor
         *
         * @param {object} options The clusterer options
         */
        constructor(options: Record<string, unknown>) {
            this.options = options;
            MarkerClusterer.instances.push(this);
        }

        /**
         * Add a marker
         *
         * @param {unknown} googleMarker The Google marker
         */
        addMarker(googleMarker: unknown): void {
            this.markers.push(googleMarker);
        }

        /**
         * Add several markers
         *
         * @param {unknown[]} googleMarkers The Google markers
         */
        addMarkers(googleMarkers: unknown[]): void {
            this.markers.push(...googleMarkers);
        }

        /**
         * Remove a marker
         *
         * @param {unknown} googleMarker The Google marker
         */
        removeMarker(googleMarker: unknown): void {
            this.markers = this.markers.filter((m) => m !== googleMarker);
        }

        /**
         * Remove every marker
         */
        clearMarkers(): void {
            this.markers.length = 0;
        }

        /**
         * Redraw the clusters
         */
        render(): void {
            this.renderCount += 1;
        }
    }

    /**
     * A stand-in for an algorithm, which the library only ever constructs
     */
    class StubAlgorithm {
        /** The options it was constructed with */
        options: unknown;

        /**
         * Constructor
         *
         * @param {unknown} options The algorithm options
         */
        constructor(options: unknown) {
            this.options = options;
        }
    }

    return {
        MarkerClusterer,
        // The default renderer asks this. The fake map has no map ID, so advanced markers aren't available.
        MarkerUtils: { isAdvancedMarkerAvailable: () => false },
        GridAlgorithm: class GridAlgorithm extends StubAlgorithm {},
        NoopAlgorithm: class NoopAlgorithm extends StubAlgorithm {},
        SuperClusterAlgorithm: class SuperClusterAlgorithm extends StubAlgorithm {},
    };
});

/**
 * Let any pending promise callbacks run
 *
 * @returns {Promise<void>}
 */
const tick = async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
};

describe('MarkerCluster', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
    });

    describe('the map reference on clustered markers', () => {
        it('tells a marker which map it is on when it is added', async () => {
            const map = fakeMap();
            const cluster = markerCluster(map);
            const m = marker({ lat: 1, lng: 2 });

            expect(m.getMap()).toBeNull();
            cluster.addMarker(m);
            await tick();

            // This is what a popup or a tooltip on a clustered marker asks for
            expect(m.getMap()).toBe(map);
            expect(m.hasMap()).toBe(true);
        });

        it('does not put the marker on the map itself', async () => {
            const map = fakeMap();
            const cluster = markerCluster(map);
            const m = marker({ lat: 1, lng: 2 });

            cluster.addMarker(m);
            await tick();

            // Drawing the marker is the cluster's job. Doing it here as well is what puts the
            // marker on the map outside of the cluster, on top of the cluster icons.
            expect(mapsStats.callsTo('Marker', 'setMap')).toHaveLength(0);
        });

        it('tells every marker added through addMarkers()', async () => {
            const map = fakeMap();
            const cluster = markerCluster(map);
            const markers = [marker({ lat: 1, lng: 2 }), marker({ lat: 3, lng: 4 })];

            cluster.addMarkers(markers);
            await tick();

            markers.forEach((m) => {
                expect(m.getMap()).toBe(map);
            });
        });

        it('tells the markers passed to the constructor', async () => {
            const map = fakeMap();
            const markers = [marker({ lat: 1, lng: 2 }), marker({ lat: 3, lng: 4 })];

            markerCluster(map, markers);
            await tick();

            markers.forEach((m) => {
                expect(m.getMap()).toBe(map);
            });
        });

        it('draws the markers that were passed to the constructor', async () => {
            const map = fakeMap();
            const markers = [marker({ lat: 1, lng: 2 }), marker({ lat: 3, lng: 4 })];

            markerCluster(map, markers);
            await tick();

            // Each one is added without drawing so that the cluster is only drawn once. Nothing
            // else puts them on the map now that the cluster is what draws them, so without that
            // one draw they don't appear until the map's next idle event.
            const { instances } = MarkerClusterer as unknown as {
                instances: { renderCount: number }[];
            };
            expect(instances[instances.length - 1].renderCount).toBeGreaterThan(0);
        });

        it('takes the map back off a marker that is removed', async () => {
            const map = fakeMap();
            const cluster = markerCluster(map);
            const m = marker({ lat: 1, lng: 2 });

            cluster.addMarker(m);
            await tick();
            expect(m.getMap()).toBe(map);

            cluster.removeMarker(m);
            expect(m.getMap()).toBeNull();
            expect(m.hasMap()).toBe(false);
        });

        it('takes the map back off a marker that was never drawn', async () => {
            const map = fakeMap();
            const cluster = markerCluster(map);
            const m = marker({ lat: 1, lng: 2 });

            cluster.addMarker(m);
            await tick();

            // removeMarker() returns early when there's no Google marker to hand over, and the
            // map still has to come off the Marker object.
            cluster.removeMarker(m);
            expect(m.getMap()).toBeNull();
        });

        it('takes the map back off every marker when the cluster is cleared', async () => {
            const map = fakeMap();
            const cluster = markerCluster(map);
            const markers = [marker({ lat: 1, lng: 2 }), marker({ lat: 3, lng: 4 })];

            cluster.addMarkers(markers);
            await tick();

            cluster.clearMarkers();
            markers.forEach((m) => {
                expect(m.getMap()).toBeNull();
            });
        });

        it('gives the map back to a marker that is added again after a clear', async () => {
            const map = fakeMap();
            const cluster = markerCluster(map);
            const m = marker({ lat: 1, lng: 2 });

            cluster.addMarker(m);
            await tick();
            cluster.clearMarkers(false);
            expect(m.getMap()).toBeNull();

            // This is what the list pages do when a search filters the markers that are shown
            cluster.addMarkers([m]);
            await tick();
            expect(m.getMap()).toBe(map);
        });
    });

    // Google uses a marker's title as its name for screen readers. A cluster marker can be clicked
    // to zoom in, so it needs one, and when the number isn't shown it's the only thing that says
    // how many markers are in the cluster.
    describe('the cluster marker title', () => {
        /**
         * Render a cluster with a renderer and get the options its Google marker was built with
         *
         * @param {DefaultRenderer|ImageRenderer} renderer The renderer
         * @param {number} count The number of markers in the cluster
         * @returns {string|undefined} The title the Google marker was built or updated with
         */
        const renderTitle = (renderer: DefaultRenderer | ImageRenderer, count: number = 12): string | undefined => {
            const cluster = { count, position: new google.maps.LatLng(48.85, 2.35) };
            const stats = { clusters: { markers: { mean: 5 } } };
            const before = mapsStats.calls.length;
            renderer.render(cluster as any, stats as any, {} as any);
            // The default renderer passes it to the constructor, the image renderer calls setTitle()
            const titles = mapsStats.calls
                .slice(before)
                .filter((c) => c.target === 'Marker' && (c.method === 'setTitle' || c.method === 'constructor'))
                .map((c) => (c.method === 'setTitle' ? c.args[0] : c.args[0]?.title))
                .filter((title) => typeof title !== 'undefined');
            return titles.at(-1);
        };

        /**
         * An image renderer with an image set
         *
         * @returns {ImageRenderer}
         */
        const imageRenderer = (): ImageRenderer => {
            const renderer = new ImageRenderer();
            renderer.setImage('https://example.com/cluster.png');
            return renderer;
        };

        it('the default renderer says how many markers there are', () => {
            expect(renderTitle(new DefaultRenderer())).toBe('Cluster of 12 markers');
        });

        it('the image renderer says how many markers there are', () => {
            expect(renderTitle(imageRenderer())).toBe('Cluster of 12 markers');
        });

        it('the image renderer has the title when the number is not shown', () => {
            const renderer = imageRenderer();
            renderer.setShowNumber(false);
            expect(renderTitle(renderer)).toBe('Cluster of 12 markers');
        });

        it('the image renderer has the title when the number is shown', () => {
            const renderer = imageRenderer();
            renderer.setShowNumber(true);
            expect(renderTitle(renderer, 3)).toBe('Cluster of 3 markers');
        });

        it('a template replaces {count} for both renderers', () => {
            const renderers = [new DefaultRenderer(), imageRenderer()];
            renderers.forEach((renderer) => {
                renderer.setTitle('Groupe de {count} marqueurs');
                expect(renderTitle(renderer, 7)).toBe('Groupe de 7 marqueurs');
            });
        });

        it('a function is passed the count for both renderers', () => {
            const renderers = [new DefaultRenderer(), imageRenderer()];
            renderers.forEach((renderer) => {
                renderer.setTitle((count) => `${count} trails`);
                expect(renderTitle(renderer, 4)).toBe('4 trails');
            });
        });

        it('ignores an empty title', () => {
            const renderer = new DefaultRenderer();
            renderer.setTitle('');
            expect(renderTitle(renderer)).toBe('Cluster of 12 markers');
        });

        it('the image renderer passes its title to the fallback renderer', () => {
            vi.spyOn(console, 'warn').mockImplementation(() => {});
            const renderer = new ImageRenderer();
            renderer.setTitle('{count} places');
            expect(renderTitle(renderer, 9)).toBe('9 places');
        });

        it('is set from the cluster options', async () => {
            const map = fakeMap();
            markerCluster(map, { imageRendererOptions: { image: 'https://example.com/cluster.png', title: '{count} stops' } });
            markerCluster(map, { defaultRenderOptions: { title: (count) => `${count} trails` } });
            await tick();
            const [imageCluster, defaultCluster] = (MarkerClusterer as any).instances.slice(-2);
            expect(renderTitle(imageCluster.options.renderer, 5)).toBe('5 stops');
            expect(renderTitle(defaultCluster.options.renderer, 6)).toBe('6 trails');
        });
    });

    // The number on the default cluster marker is text, so it needs 4.5:1 contrast against the
    // centre circle as it's drawn: the cluster color at the centre opacity, over the map. White
    // is the lightest the map can be, so that's what it's checked against.
    describe('the default cluster colors', () => {
        /**
         * The relative luminance of a color (WCAG)
         *
         * @param {number[]} rgb The red, green and blue values, 0-255
         * @returns {number}
         */
        const luminance = (rgb: number[]): number => {
            const [r, g, b] = rgb.map((value) => {
                const c = value / 255;
                return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
            });
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        };

        /**
         * The contrast ratio between two colors (WCAG)
         *
         * @param {number[]} a The first color
         * @param {number[]} b The second color
         * @returns {number}
         */
        const contrast = (a: number[], b: number[]): number => {
            const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
            return (light + 0.05) / (dark + 0.05);
        };

        /**
         * Turn a "#rrggbb" color into its red, green and blue values
         *
         * @param {string} hex The color
         * @returns {number[]}
         */
        const rgb = (hex: string): number[] => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

        /**
         * Render a cluster with the default renderer and read the colors out of its SVG icon
         *
         * @param {number} count The number of markers in the cluster
         * @param {number} mean The average number of markers in a cluster
         * @returns {{ fill: string, opacity: number, text: string }}
         */
        const renderColors = (count: number, mean: number) => {
            new DefaultRenderer().render(
                { count, position: new google.maps.LatLng(48.85, 2.35) } as any,
                { clusters: { markers: { mean } } } as any,
                {} as any,
            );
            const options = mapsStats.callsTo('Marker', 'constructor').at(-1)?.args[0];
            const svg = atob(options.icon.url.split(',')[1]);
            return {
                fill: /<svg fill="([^"]+)"/.exec(svg)![1],
                opacity: Number(/<circle[^>]*opacity="([^"]+)"[^>]*r="16"/.exec(svg)![1]),
                text: /style="fill:([^"]+)"/.exec(svg)![1],
            };
        };

        /**
         * The contrast of the label against the centre circle, blended over a white map
         *
         * @param {object} colors The colors from renderColors()
         * @returns {number}
         */
        const labelContrast = (colors: ReturnType<typeof renderColors>): number => {
            const circle = rgb(colors.fill).map((c) => colors.opacity * c + (1 - colors.opacity) * 255);
            return contrast(rgb(colors.text), circle);
        };

        it('uses #b00000 for a cluster at or below the average', () => {
            expect(renderColors(2, 5)).toEqual({ fill: '#b00000', opacity: 0.7, text: '#ffffff' });
        });

        it('uses #0000ff for a cluster above the average', () => {
            expect(renderColors(12, 5)).toEqual({ fill: '#0000ff', opacity: 0.7, text: '#ffffff' });
        });

        it('gives the label at least 4.5:1 contrast on both colors', () => {
            expect(labelContrast(renderColors(2, 5))).toBeGreaterThanOrEqual(4.5);
            expect(labelContrast(renderColors(12, 5))).toBeGreaterThanOrEqual(4.5);
        });

        it('the contrast check fails the old red', () => {
            expect(labelContrast({ fill: '#ff0000', opacity: 0.7, text: '#ffffff' })).toBeLessThan(4.5);
        });
    });
});
