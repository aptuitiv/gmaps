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
});
