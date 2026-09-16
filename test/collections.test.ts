/* ===========================================================================
    Tests for MarkerCollection and PolylineCollection.

    The interesting part is the contrast between the two clear() methods. The polyline one
    was already fixed to detach from the map; the marker one still routes through hide(),
    which is M-2 at collection scale - clearing a collection of markers that were never
    shown builds a Google marker for every one of them.
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { marker, Marker } from '../src/lib/Marker';
import { markerCollection } from '../src/lib/MarkerCollection';
import { polyline, Polyline } from '../src/lib/Polyline';
import { polylineCollection } from '../src/lib/PolylineCollection';
import { installGoogleMaps, mapsStats, uninstallGoogleMaps } from './support/googleMaps';
import { fakeMap } from './support/fakeMap';

const path = [
    { lat: 48.85, lng: 2.35 },
    { lat: 48.86, lng: 2.36 },
];

describe('MarkerCollection', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
    });

    it('adds under a default tag when none is given', () => {
        const collection = markerCollection();
        expect(collection.isEmpty()).toBe(true);
        collection.add(marker({ position: [1, 2] }));
        expect(collection.isEmpty()).toBe(false);
        expect(collection.hasData()).toBe(true);
    });

    it('adds under one tag or several', () => {
        const collection = markerCollection();
        const m = marker({ position: [1, 2] });
        collection.add(m, 'trails');
        collection.add(m, ['parks', 'water']);
        expect(Object.keys(collection.markers).sort()).toEqual(['parks', 'trails', 'water']);
    });

    it('holds each marker once per tag', () => {
        const collection = markerCollection();
        const m = marker({ position: [1, 2] });
        collection.add(m, 'trails');
        collection.add(m, 'trails');
        expect(collection.markers.trails.size).toBe(1);
    });

    it('removes from one tag or from every tag', () => {
        const collection = markerCollection();
        const m = marker({ position: [1, 2] });
        collection.add(m, ['a', 'b']);
        collection.remove(m, 'a');
        expect(collection.markers.a.size).toBe(0);
        expect(collection.markers.b.size).toBe(1);

        collection.add(m, 'a');
        collection.remove(m);
        expect(collection.markers.a.size).toBe(0);
        expect(collection.markers.b.size).toBe(0);
    });

    it('clone shares the same markers', () => {
        const collection = markerCollection();
        const m = marker({ position: [1, 2] });
        collection.add(m, 'trails');
        const clone = collection.clone();
        expect(clone).not.toBe(collection);
        expect(clone.markers.trails.has(m)).toBe(true);
    });

    it('showAll puts every marker on the map', async () => {
        const collection = markerCollection();
        const map = fakeMap();
        collection.add(marker({ position: [1, 2] }));
        collection.add(marker({ position: [3, 4] }));
        collection.showAll(map);
        await Promise.resolve();
        expect(mapsStats.countOf('Marker')).toBe(2);
    });

    // M-2 at collection scale.
    describe('clear() builds Google markers for markers that were never shown (M-2)', () => {
        it('builds one per marker', () => {
            const collection = markerCollection();
            const markers: Marker[] = [];
            for (let i = 0; i < 50; i += 1) {
                const m = marker({ position: [i / 100, i / 100] });
                markers.push(m);
                collection.add(m);
            }
            expect(mapsStats.countOf('Marker')).toBe(0);

            collection.clear();

            // The bug: clear() calls hideAll(), which calls marker.hide(), which builds the
            // Google marker so that setMap(null) has something to call. When M-2 lands this
            // becomes 0.
            expect(mapsStats.countOf('Marker')).toBe(50);
            expect(collection.isEmpty()).toBe(true);
        });

        it('hideAll() on its own does the same', () => {
            const collection = markerCollection();
            collection.add(marker({ position: [1, 2] }));
            collection.add(marker({ position: [3, 4] }));
            collection.hideAll();
            expect(mapsStats.countOf('Marker')).toBe(2);
        });
    });
});

describe('PolylineCollection', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
    });

    it('adds under a default tag when none is given', () => {
        const collection = polylineCollection();
        expect(collection.isEmpty()).toBe(true);
        collection.add(polyline({ path }));
        expect(collection.isEmpty()).toBe(false);
        expect(collection.hasData()).toBe(true);
    });

    it('adds under one tag or several, and removes', () => {
        const collection = polylineCollection();
        const p = polyline({ path });
        collection.add(p, ['a', 'b']);
        expect(collection.polylines.a.has(p)).toBe(true);
        collection.remove(p);
        expect(collection.polylines.a.size).toBe(0);
        expect(collection.polylines.b.size).toBe(0);
    });

    it('clone shares the same polylines', () => {
        const collection = polylineCollection();
        const p = polyline({ path });
        collection.add(p, 'trails');
        expect(collection.clone().polylines.trails.has(p)).toBe(true);
    });

    // The counterpart to the marker bug above. This one was already fixed: clear() detaches
    // with setMap(null) rather than hide(), and setMap(null) on an undrawn polyline creates
    // nothing. This test is here so the fix cannot be undone quietly.
    it('clear() draws nothing for polylines that were never drawn', () => {
        const collection = polylineCollection();
        for (let i = 0; i < 50; i += 1) {
            collection.add(polyline({ path }));
        }
        expect(mapsStats.countOf('Polyline')).toBe(0);

        collection.clear();

        expect(mapsStats.countOf('Polyline')).toBe(0);
        expect(collection.isEmpty()).toBe(true);
    });

    it('clear() detaches the polylines that were drawn', async () => {
        const collection = polylineCollection();
        const map = fakeMap();
        const p = polyline({ path });
        await p.setMap(map);
        collection.add(p);
        expect(mapsStats.countOf('Polyline')).toBe(1);

        collection.clear();
        await Promise.resolve();

        const calls = mapsStats.callsTo('Polyline', 'setMap');
        expect(calls[calls.length - 1].args[0]).toBeNull();
    });

    it('hideAll() hides without detaching', () => {
        const collection = polylineCollection();
        const p = polyline({ path });
        collection.add(p);
        collection.hideAll();
        expect(p.visible).toBe(false);
    });

    it('showAll() draws the polylines', async () => {
        const collection = polylineCollection();
        const map = fakeMap();
        collection.add(polyline({ path }));
        collection.add(polyline({ path }));
        collection.showAll(map);
        await Promise.resolve();
        await Promise.resolve();
        expect(mapsStats.countOf('Polyline')).toBe(2);
    });

    it('setOptions applies to every polyline when no tag is given', () => {
        const collection = polylineCollection();
        const a = polyline({ path });
        const b = polyline({ path });
        collection.add(a, 'x');
        collection.add(b, 'y');
        collection.setOptions({ strokeColor: '#123456' });
        expect(a.strokeColor).toBe('#123456');
        expect(b.strokeColor).toBe('#123456');
    });

    it('setOptions applies only to the tag that was given', () => {
        const collection = polylineCollection();
        const a = polyline({ path, strokeColor: '#aaaaaa' });
        const b = polyline({ path, strokeColor: '#bbbbbb' });
        collection.add(a, 'x');
        collection.add(b, 'y');
        collection.setOptions({ strokeColor: '#123456' }, 'x');
        expect(a.strokeColor).toBe('#123456');
        expect(b.strokeColor).toBe('#bbbbbb');
    });

    it('hides and shows by tag', () => {
        const collection = polylineCollection();
        const a = polyline({ path });
        const b = polyline({ path });
        collection.add(a, 'x');
        collection.add(b, 'y');
        a.visible = true;
        b.visible = true;
        collection.hide('x');
        expect(a.visible).toBe(false);
        expect(b.visible).toBe(true);
    });
});
