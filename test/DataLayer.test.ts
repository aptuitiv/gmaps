/* ===========================================================================
    Tests for the DataLayer coordinate conversion (D-2).

    These are the first tests this class has had, and they were written because D-2 changes what
    reaches Google: the geometry is now handed plain {lat, lng} literals instead of
    google.maps.LatLng objects. Google accepts either - Data.LineString and Data.LinearRing both
    take (LatLng | LatLngLiteral)[], and Data.Polygon takes (LinearRing | (LatLng |
    LatLngLiteral)[])[] - so this is safe, but it is exactly the kind of change that fails
    silently. The shape of what is passed is asserted here rather than assumed.

    A layer built with dataLayer() and no options has no map, so #getGoogleData() takes the
    checkForGoogleMaps('DataLayer', 'Data', false) branch and builds its Data object straight
    away. Nothing here waits on the loader or on a map.
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { dataLayer } from '../src/lib/DataLayer';
import { LatLng } from '../src/lib/LatLng';
import { installGoogleMaps, mapsStats, uninstallGoogleMaps } from './support/googleMaps';

/**
 * The coordinates handed to a Google geometry class
 *
 * @param {string} name The recorded class name
 * @returns {any[]} The first constructor argument
 */
const geometryArgs = (name: string): any[] => {
    const calls = mapsStats.callsTo(name, 'constructor');
    return calls.length > 0 ? (calls[0].args[0] as any[]) : [];
};

describe('DataLayer coordinate conversion (D-2)', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
    });

    describe('addPolyline', () => {
        it('hands Google plain lat/lng literals rather than LatLng objects', async () => {
            const layer = dataLayer();
            await layer.addPolyline([
                [1, 2],
                [3, 4],
            ]);

            const positions = geometryArgs('Data.LineString');
            expect(positions).toHaveLength(2);
            expect(positions[0]).toEqual({ lat: 1, lng: 2 });
            // A literal, not something with lat()/lng() methods
            expect(typeof positions[0].lat).toBe('number');
            expect(positions[0]).not.toBeInstanceOf(LatLng);
        });

        // The point of D-2. This used to build one LatLng wrapper and one google.maps.LatLng
        // for every position in the path.
        it('builds no google.maps.LatLng objects for the path', async () => {
            const layer = dataLayer();
            const path: [number, number][] = [];
            for (let i = 0; i < 500; i += 1) {
                path.push([i / 100, i / 100]);
            }
            await layer.addPolyline(path);

            expect(mapsStats.countOf('LatLng')).toBe(0);
            expect(geometryArgs('Data.LineString')).toHaveLength(500);
        });

        it('accepts every position form', async () => {
            const layer = dataLayer();
            await layer.addPolyline([
                [1, 2],
                { lat: 3, lng: 4 },
                { latitude: 5, longitude: 6 },
                new LatLng(7, 8),
            ]);

            expect(geometryArgs('Data.LineString')).toEqual([
                { lat: 1, lng: 2 },
                { lat: 3, lng: 4 },
                { lat: 5, lng: 6 },
                { lat: 7, lng: 8 },
            ]);
        });

        it('leaves out positions that are not valid', async () => {
            const layer = dataLayer();
            await layer.addPolyline([[1, 2], ['nope', 'nope'], [3, 4]] as never);

            expect(geometryArgs('Data.LineString')).toEqual([
                { lat: 1, lng: 2 },
                { lat: 3, lng: 4 },
            ]);
        });

        it('needs at least two positions', async () => {
            const layer = dataLayer();
            await expect(layer.addPolyline([[1, 2]])).rejects.toThrow('A line needs at least two positions in its path');
        });
    });

    describe('addPolygon', () => {
        it('takes one ring given as an array of positions', async () => {
            const layer = dataLayer();
            await layer.addPolygon([
                [0, 0],
                [0, 10],
                [10, 10],
            ]);

            const rings = geometryArgs('Data.Polygon');
            expect(rings).toHaveLength(1);
            expect(rings[0]).toEqual([
                { lat: 0, lng: 0 },
                { lat: 0, lng: 10 },
                { lat: 10, lng: 10 },
            ]);
        });

        it('takes an outer ring plus holes', async () => {
            const layer = dataLayer();
            await layer.addPolygon([
                [
                    [0, 0],
                    [0, 10],
                    [10, 10],
                ],
                [
                    [2, 2],
                    [2, 4],
                    [4, 4],
                ],
            ]);

            const rings = geometryArgs('Data.Polygon');
            expect(rings).toHaveLength(2);
            expect(rings[0][0]).toEqual({ lat: 0, lng: 0 });
            expect(rings[1][0]).toEqual({ lat: 2, lng: 2 });
        });

        // #toRings has to tell one ring of positions from an array of rings. A position can
        // itself be an array, which is what makes it awkward.
        it('takes one ring given as {lat, lng} objects', async () => {
            const layer = dataLayer();
            await layer.addPolygon([
                { lat: 0, lng: 0 },
                { lat: 0, lng: 10 },
                { lat: 10, lng: 10 },
            ]);

            const rings = geometryArgs('Data.Polygon');
            expect(rings).toHaveLength(1);
            expect(rings[0]).toHaveLength(3);
        });

        it('takes one ring given as LatLng objects', async () => {
            const layer = dataLayer();
            await layer.addPolygon([new LatLng(0, 0), new LatLng(0, 10), new LatLng(10, 10)]);

            expect(geometryArgs('Data.Polygon')[0]).toEqual([
                { lat: 0, lng: 0 },
                { lat: 0, lng: 10 },
                { lat: 10, lng: 10 },
            ]);
        });

        // GeoJson closes a ring by repeating the first position. Google's LinearRing closes
        // itself, so the repeat has to go or the polygon gets a duplicate corner.
        it('drops the repeated closing position that GeoJson uses', async () => {
            const layer = dataLayer();
            await layer.addPolygon([
                [0, 0],
                [0, 10],
                [10, 10],
                [0, 0],
            ]);

            const rings = geometryArgs('Data.Polygon');
            expect(rings[0]).toHaveLength(3);
            expect(rings[0][rings[0].length - 1]).toEqual({ lat: 10, lng: 10 });
        });

        it('keeps a ring that does not repeat its first position', async () => {
            const layer = dataLayer();
            await layer.addPolygon([
                [0, 0],
                [0, 10],
                [10, 10],
                [10, 0],
            ]);

            expect(geometryArgs('Data.Polygon')[0]).toHaveLength(4);
        });

        it('builds no google.maps.LatLng objects for the rings', async () => {
            const layer = dataLayer();
            const ring: [number, number][] = [];
            for (let i = 0; i < 300; i += 1) {
                ring.push([i / 100, i / 100]);
            }
            await layer.addPolygon(ring);

            expect(mapsStats.countOf('LatLng')).toBe(0);
        });

        it('needs at least three positions in the first ring', async () => {
            const layer = dataLayer();
            await expect(
                layer.addPolygon([
                    [0, 0],
                    [0, 10],
                ]),
            ).rejects.toThrow('A polygon needs at least three positions in its first path');
        });
    });

    // addPoint still converts through toGoogle(). It handles one position per call, so there is
    // nothing to save by changing it, and leaving it alone keeps the change small.
    describe('addPoint', () => {
        it('builds a Data.Point', async () => {
            const layer = dataLayer();
            await layer.addPoint([1, 2]);

            expect(mapsStats.callsTo('Data.Point', 'constructor')).toHaveLength(1);
        });

        it('rejects an invalid position', async () => {
            const layer = dataLayer();
            await expect(layer.addPoint(['nope', 'nope'] as never)).rejects.toThrow(
                /Invalid latitude\/longitude data/,
            );
        });
    });
});
