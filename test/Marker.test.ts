/* ===========================================================================
    Tests for the Marker class.

    The point of most of these is what does NOT happen. The plan's marker work (M-1 to
    M-6) is about not building a google.maps.Marker until something actually needs it, so
    the assertions here are mostly "countOf('Marker') is 0".

    These tests cannot use a real Map object. Building one needs a DOM element and the
    loader, which pulls in the real Google Maps script. Anything that needs a map is
    listed at the bottom as still to do.
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Marker, marker } from '../src/lib/Marker';
import { LatLng } from '../src/lib/LatLng';
import { installGoogleMaps, mapsStats, uninstallGoogleMaps } from './support/googleMaps';

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

describe('Marker', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
    });

    describe('building a marker', () => {
        it('takes an options object and reads the position back', () => {
            const m = marker({ position: [1, 2] });
            expect(m.position.lat).toBe(1);
            expect(m.position.lng).toBe(2);
        });

        it('takes lat/lng and latitude/longitude option names', () => {
            expect(marker({ lat: 1, lng: 2 }).position.lat).toBe(1);
            expect(marker({ latitude: 3, longitude: 4 }).position.lng).toBe(4);
        });

        it('defaults the position to 0,0', () => {
            const m = marker({ title: 'no position' });
            expect(m.position.lat).toBe(0);
            expect(m.position.lng).toBe(0);
        });

        it('returns the same object when the factory is given a Marker', () => {
            const m = marker({ position: [1, 2] });
            expect(marker(m)).toBe(m);
        });

        // `title` is deliberately not in this list - it forces eager creation. See the M-13
        // block below.
        it('stores simple options without touching Google', () => {
            const m = marker({ position: [1, 2], cursor: 'crosshair', optimized: true });
            expect(m.cursor).toBe('crosshair');
            expect(m.optimized).toBe(true);
            expect(mapsStats.countOf('Marker')).toBe(0);
        });

        it('turns a number label into a string', () => {
            const m = marker({ position: [1, 2], label: 5 });
            expect(m.label).toBe('5');
        });

        it('holds custom data', () => {
            const m = marker({ position: [1, 2], data: { trailId: 7 } });
            expect(m.getData('trailId')).toBe(7);
            expect(m.getData('nope')).toBeNull();
            expect(m.getData()).toEqual({ trailId: 7 });
        });
    });

    // This is the behavior the whole marker section of the plan depends on.
    describe('what does NOT create a google.maps.Marker', () => {
        it('the options form creates nothing', () => {
            marker({ position: [1, 2], cursor: 'pointer', optimized: true });
            expect(mapsStats.countOf('Marker')).toBe(0);
        });

        it('creates nothing even after the microtask queue drains', async () => {
            marker({ position: [1, 2] });
            await tick();
            expect(mapsStats.countOf('Marker')).toBe(0);
        });

        it('reading properties creates nothing', () => {
            const m = marker({ position: [1, 2], cursor: 'pointer' });
            void m.position;
            void m.title;
            void m.optimized;
            void m.data;
            expect(mapsStats.countOf('Marker')).toBe(0);
        });

        it('adding an event listener creates nothing', () => {
            const m = marker({ position: [1, 2] });
            m.on('click', vi.fn());
            expect(mapsStats.countOf('Marker')).toBe(0);
        });

        it('1,000 markers create nothing', () => {
            for (let i = 0; i < 1000; i += 1) {
                marker({ position: [i / 100, i / 100] });
            }
            expect(mapsStats.countOf('Marker')).toBe(0);
        });
    });

    // The two constructor forms do NOT behave the same way, which is easy to miss.
    describe('the array/LatLng constructor form creates eagerly', () => {
        it('an array position builds the Google marker synchronously', () => {
            marker([1, 2]);
            expect(mapsStats.countOf('Marker')).toBe(1);
        });

        it('a LatLng position builds the Google marker synchronously', () => {
            marker(new LatLng(1, 2));
            expect(mapsStats.countOf('Marker')).toBe(1);
        });

        it('the options form with the same position builds nothing', () => {
            marker({ position: [1, 2] });
            expect(mapsStats.countOf('Marker')).toBe(0);
        });
    });

    describe('what DOES create a google.maps.Marker', () => {
        it('toGoogleSync creates it', () => {
            const m = marker({ position: [1, 2] });
            expect(mapsStats.countOf('Marker')).toBe(0);
            const google = m.toGoogleSync();
            expect(google).toBeDefined();
            expect(mapsStats.countOf('Marker')).toBe(1);
        });

        it('toGoogle creates it', async () => {
            const m = marker({ position: [1, 2] });
            await m.toGoogle();
            expect(mapsStats.countOf('Marker')).toBe(1);
        });

        it('creates it only once across repeated calls', async () => {
            const m = marker({ position: [1, 2] });
            m.toGoogleSync();
            m.toGoogleSync();
            await m.toGoogle();
            expect(mapsStats.countOf('Marker')).toBe(1);
        });

        // M-1 in the plan. init() is what Tooltip.attachTo() and Popup.attachTo() await, so
        // this is why attaching a tooltip to a marker builds the Google object today.
        // Polyline.init() already avoids this. When M-1 lands, this expectation becomes 0.
        it('init() creates it, which is what M-1 is about', async () => {
            const m = marker({ position: [1, 2] });
            await m.init();
            expect(mapsStats.countOf('Marker')).toBe(1);
        });

        it('passes the position through to Google when it is created', () => {
            const m = marker({ position: [1.5, -2.5] });
            const google = m.toGoogleSync() as unknown as { getPosition(): { lat(): number; lng(): number } };
            expect(google.getPosition().lat()).toBe(1.5);
            expect(google.getPosition().lng()).toBe(-2.5);
        });

        it('passes optimized through in the constructor options', () => {
            const m = marker({ position: [1, 2], optimized: false });
            m.toGoogleSync();
            const created = mapsStats.callsTo('Marker', 'constructor')[0];
            expect(created.args[0]).toMatchObject({ optimized: false });
        });

        it('leaves optimized out of the Google options when it is not set, so Google decides', () => {
            const m = marker({ position: [1, 2] });
            m.toGoogleSync();
            const created = mapsStats.callsTo('Marker', 'constructor')[0];
            expect(created.args[0]).not.toHaveProperty('optimized');
        });
    });

    // M-13, found by these tests rather than by the audits.
    //
    // setOptions() documents itself as deliberately NOT setting up the Google marker, and that
    // holds for every option except two. `title` (Marker.ts:1197) assigns through the PUBLIC
    // setter, which awaits #setupGoogleMarker() and builds the Google object. `tooltip`
    // (Marker.ts:1195) does the same through attachTooltip(), which is M-1.
    //
    // When M-13 is fixed, the counts below become 0 and the title becomes readable
    // synchronously, so these expectations all change deliberately.
    describe('the title option forces eager creation (M-13)', () => {
        it('builds a Google marker that the same call without a title does not', () => {
            marker({ position: [1, 2], title: 'A title' });
            expect(mapsStats.countOf('Marker')).toBe(1);

            mapsStats.reset();
            marker({ position: [1, 2] });
            expect(mapsStats.countOf('Marker')).toBe(0);
        });

        it('builds 1,000 Google markers for 1,000 titled markers', () => {
            for (let i = 0; i < 1000; i += 1) {
                marker({ position: [i / 100, i / 100], title: `Marker ${i}` });
            }
            expect(mapsStats.countOf('Marker')).toBe(1000);
        });

        // Second-order effect: #setTitle() runs after the await, so the value that was passed
        // in is not readable until the microtask queue drains.
        it('leaves the title unreadable until the microtask queue drains', async () => {
            const m = marker({ position: [1, 2], title: 'A title' });
            expect(m.title).toBeUndefined();
            await tick();
            expect(m.title).toBe('A title');
        });

        // ...and the Google marker is built without a title it already knew about, then
        // patched with an extra setTitle() call.
        it('constructs the Google marker without the title, then patches it with setTitle', async () => {
            marker({ position: [1, 2], title: 'A title' });
            await tick();
            const created = mapsStats.callsTo('Marker', 'constructor')[0];
            expect(created.args[0]).not.toHaveProperty('title');
            expect(mapsStats.callsTo('Marker', 'setTitle')).toHaveLength(1);
        });
    });

    // M-2 in the plan. Hiding a marker that was never shown should not have to build one.
    describe('hiding a marker that was never shown (M-2)', () => {
        it('currently builds a google.maps.Marker just to detach it', () => {
            const m = marker({ position: [1, 2] });
            expect(mapsStats.countOf('Marker')).toBe(0);
            m.hide();
            // The bug: a marker is created so that setMap(null) has something to call.
            // When M-2 lands this becomes 0.
            expect(mapsStats.countOf('Marker')).toBe(1);
        });

        it('setMap(null) on a never-shown marker does the same', () => {
            const m = marker({ position: [1, 2] });
            m.setMap(null);
            expect(mapsStats.countOf('Marker')).toBe(1);
        });

        it('hiding 100 never-shown markers builds 100 Google markers', () => {
            const markers: Marker[] = [];
            for (let i = 0; i < 100; i += 1) {
                markers.push(marker({ position: [i / 100, i / 100] }));
            }
            expect(mapsStats.countOf('Marker')).toBe(0);
            markers.forEach((m) => m.hide());
            expect(mapsStats.countOf('Marker')).toBe(100);
        });
    });

    // M-4 in the plan. Once the Google marker exists, every read of .position allocates a
    // new LatLng and calls into Google.
    describe('the position getter allocates on every read (M-4)', () => {
        it('builds a new LatLng each time once the Google marker exists', () => {
            const m = marker({ position: [1, 2] });
            m.toGoogleSync();

            const first = m.position;
            const second = m.position;
            expect(first).not.toBe(second);
            expect(first.lat).toBe(second.lat);
        });

        it('returns the stored object while there is no Google marker', () => {
            const m = marker({ position: [1, 2] });
            expect(m.position).toBe(m.position);
        });

        it('getPosition() goes through the same getter', () => {
            const m = marker({ position: [1, 2] });
            m.toGoogleSync();
            expect(m.getPosition()).not.toBe(m.getPosition());
        });
    });

    describe('setters after the Google marker exists', () => {
        it('setTitleSync updates the marker and the Google object', () => {
            const m = marker({ position: [1, 2] });
            m.setTitleSync('New title');
            expect(m.title).toBe('New title');
            expect(mapsStats.callsTo('Marker', 'setTitle')).toHaveLength(1);
        });

        it('setOptimizedSync pushes an options change to Google', () => {
            const m = marker({ position: [1, 2] });
            m.setOptimizedSync(true);
            expect(m.optimized).toBe(true);
            expect(mapsStats.callsTo('Marker', 'setOptions')).toHaveLength(1);
        });

        it('setPositionSync updates both sides', () => {
            const m = marker({ position: [1, 2] });
            m.setPositionSync([5, 6]);
            expect(m.position.lat).toBe(5);
            expect(mapsStats.callsTo('Marker', 'setPosition')).toHaveLength(1);
        });
    });

    describe('the ready event', () => {
        it('is dispatched once when the Google marker is created', async () => {
            const m = marker({ position: [1, 2] });
            const cb = vi.fn();
            m.onReady(cb);
            await m.toGoogle();
            await tick();
            expect(cb).toHaveBeenCalledTimes(1);
        });

        it('is not dispatched while nothing has created the marker', async () => {
            const m = marker({ position: [1, 2] });
            const cb = vi.fn();
            m.onReady(cb);
            await tick();
            expect(cb).not.toHaveBeenCalled();
        });
    });
});

/*
    Still to do for markers, blocked on being able to build a Map in tests:

    - setOptions({ map }) not creating or displaying the marker (section 6.3). This is the
      decided behavior change: passing `map` should display the marker unless a hide option
      is also passed. It needs a real Map to assert against.
    - setMap(map) attaching to the map, and the onReady path when the map is not ready yet.
    - The duplicate onReady registration in #createMarkerObject and #setMap (M-5).
    - attachTooltip/attachPopup not creating the Google marker (M-1's real payoff). Those
      mixins are added by importing Tooltip.ts and Popup.ts, and Overlay builds DOM in its
      constructor, so that test needs the jsdom environment.
*/
