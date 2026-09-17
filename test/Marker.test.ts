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
import { MarkerEvents } from '../src/lib/constants';
import { LatLng } from '../src/lib/LatLng';
import { installGoogleMaps, mapsStats, uninstallGoogleMaps } from './support/googleMaps';
import { asFakeMap, fakeMap } from './support/fakeMap';

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

        // M-1, fixed in Phase 3. init() is what Tooltip.attachTo() and Popup.attachTo() await,
        // and it used to build the Google marker, which is why attaching a tooltip created one.
        // It now matches Polyline.init(): it says the marker is ready without creating anything.
        it('init() creates nothing and dispatches ready (M-1)', async () => {
            const m = marker({ position: [1, 2] });
            const cb = vi.fn();
            m.onReady(cb);

            await m.init();

            expect(mapsStats.countOf('Marker')).toBe(0);
            expect(cb).toHaveBeenCalledTimes(1);
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

    // M-13, found by these tests rather than by the audits, and fixed in Phase 3.
    //
    // setOptions() documents itself as deliberately NOT setting up the Google marker, and that
    // held for every option except `title`, which assigned through the PUBLIC setter. That setter
    // awaits #setupGoogleMarker(), so it built the Google object - and because the value was
    // applied after the await, the marker was built WITHOUT the title and then patched with an
    // extra setTitle() call. The option is now held on the options object like its neighbours.
    describe('the title option no longer forces eager creation (M-13)', () => {
        it('builds nothing, with or without a title', () => {
            marker({ position: [1, 2], title: 'A title' });
            expect(mapsStats.countOf('Marker')).toBe(0);

            mapsStats.reset();
            marker({ position: [1, 2] });
            expect(mapsStats.countOf('Marker')).toBe(0);
        });

        it('builds nothing for 1,000 titled markers', () => {
            for (let i = 0; i < 1000; i += 1) {
                marker({ position: [i / 100, i / 100], title: `Marker ${i}` });
            }
            expect(mapsStats.countOf('Marker')).toBe(0);
        });

        it('makes the title readable straight away', () => {
            const m = marker({ position: [1, 2], title: 'A title' });
            expect(m.title).toBe('A title');
        });

        // The title is known up front, so it goes into the constructor options rather than being
        // applied afterwards with a second Google call.
        it('passes the title in the constructor options, with no extra setTitle call', () => {
            const m = marker({ position: [1, 2], title: 'A title' });
            m.toGoogleSync();

            const created = mapsStats.callsTo('Marker', 'constructor')[0];
            expect(created.args[0]).toMatchObject({ title: 'A title' });
            expect(mapsStats.callsTo('Marker', 'setTitle')).toHaveLength(0);
        });
    });

    // M-2, fixed in Phase 3. Hiding a marker that was never shown used to build one so that
    // setMap(null) had something to call.
    describe('hiding a marker that was never shown (M-2)', () => {
        it('builds nothing to detach it', () => {
            const m = marker({ position: [1, 2] });
            expect(mapsStats.countOf('Marker')).toBe(0);
            m.hide();
            expect(mapsStats.countOf('Marker')).toBe(0);
            expect(m.getMap()).toBeNull();
            expect(m.isVisible).toBe(false);
        });

        it('setMap(null) on a never-shown marker builds nothing', async () => {
            const m = marker({ position: [1, 2] });
            await m.setMap(null);
            expect(mapsStats.countOf('Marker')).toBe(0);
        });

        it('hiding 100 never-shown markers builds nothing', () => {
            const markers: Marker[] = [];
            for (let i = 0; i < 100; i += 1) {
                markers.push(marker({ position: [i / 100, i / 100] }));
            }
            markers.forEach((m) => m.hide());
            expect(mapsStats.countOf('Marker')).toBe(0);
        });
    });

    // M-4, fixed in Phase 3. Every read of .position used to call into Google and build a new
    // LatLng, whatever kind of marker it was, so any loop over markers - fitting bounds,
    // filtering, sorting by distance - allocated one object per marker per pass.
    //
    // Only a draggable marker can move without the library being told, so only that case still
    // asks Google. Everything else returns the stored position, which setPosition() keeps in
    // step with the Google marker.
    describe('the position getter no longer allocates on every read (M-4)', () => {
        it('returns the same object each time once the Google marker exists', () => {
            const m = marker({ position: [1, 2] });
            m.toGoogleSync();

            const first = m.position;
            const second = m.position;
            expect(first).toBe(second);
            expect(first.lat).toBe(1);
        });

        it('returns the stored object while there is no Google marker', () => {
            const m = marker({ position: [1, 2] });
            expect(m.position).toBe(m.position);
        });

        it('getPosition() goes through the same getter', () => {
            const m = marker({ position: [1, 2] });
            m.toGoogleSync();
            expect(m.getPosition()).toBe(m.getPosition());
        });

        it('reads back a position that was changed after the marker was created', () => {
            const m = marker({ position: [1, 2] });
            m.toGoogleSync();
            m.setPositionSync([5, 6]);

            expect(m.position.lat).toBe(5);
            expect(m.position.lng).toBe(6);
        });

        // The carve-out. A draggable marker CAN move behind the library's back, so it still has
        // to ask Google. Removing this would silently break dragging, so it is pinned here.
        it('still asks Google for the position of a draggable marker', () => {
            const m = marker({ position: [1, 2], drag: true });
            const google = m.toGoogleSync() as unknown as { setPosition(p: unknown): void };

            // Simulate Google moving the marker, the way a drag would
            google.setPosition({ lat: () => 9, lng: () => 9 });

            expect(m.position.lat).toBe(9);
            expect(m.position.lng).toBe(9);
        });
    });

    // M-3. The options used to start with a 0,0 LatLng that almost every marker replaced
    // immediately, so it was built and thrown away once per marker.
    describe('no position object is built until one is needed (M-3)', () => {
        it('still reports 0,0 for a marker that was given no position', () => {
            const m = marker({ title: 'no position' });
            expect(m.position.lat).toBe(0);
            expect(m.position.lng).toBe(0);
        });

        it('returns the same default object across reads', () => {
            const m = marker({ title: 'no position' });
            expect(m.position).toBe(m.position);
        });

        it('builds no Google LatLng for 1,000 markers', () => {
            for (let i = 0; i < 1000; i += 1) {
                marker({ position: [i / 100, i / 100] });
            }
            // The library's own LatLng objects aren't counted by the stub, but nothing should
            // have reached Google
            expect(mapsStats.countOf('LatLng')).toBe(0);
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

    /* -----------------------------------------------------------------------
        init() dispatches "ready" without creating a marker, which is what lets a tooltip or a
        popup attach to a marker that is never shown (M-1). Anything waiting for the marker
        itself therefore has to wait for the creation, not for that event.

        Setters used to wait on "ready" when a creation was already running. onceImmediate()
        fires straight away for an event that has already been dispatched, so after init() had
        dispatched it, such a setter resolved immediately and then used the Google marker while
        it was still undefined.
    ----------------------------------------------------------------------- */
    describe('setters that run while the marker is being created', () => {
        it('wait for the marker itself, not for the early ready event', async () => {
            const m = marker({ position: [1, 2] });
            // Dispatches "ready" and creates nothing, the same as attaching a tooltip does
            await m.init();
            expect(m.hasGoogleMarker()).toBe(false);

            // Several setters at once: the first starts the creation, the rest have to wait
            await Promise.all([m.setTitle('One'), m.setLabel('Two'), m.setCursor('pointer')]);

            expect(m.hasGoogleMarker()).toBe(true);
            expect(mapsStats.countOf('Marker')).toBe(1);
        });

        it('build one marker between them', async () => {
            const m = marker({ position: [1, 2] });
            await m.init();

            await Promise.all([m.setTitle('One'), m.setTitle('Two'), m.setTitle('Three')]);

            expect(mapsStats.countOf('Marker')).toBe(1);
        });

        it('all reach Google once the marker exists', async () => {
            const m = marker({ position: [1, 2] });
            await m.init();

            await Promise.all([m.setTitle('A title'), m.setLabel('A label')]);

            expect(mapsStats.callsTo('Marker', 'setLabel')).toHaveLength(1);
            expect(m.title).toBe('A title');
        });

        it('still works when nothing dispatched ready first', async () => {
            const m = marker({ position: [1, 2] });

            await Promise.all([m.setTitle('One'), m.setLabel('Two')]);

            expect(m.hasGoogleMarker()).toBe(true);
            expect(mapsStats.countOf('Marker')).toBe(1);
        });

        // The synchronous setup doesn't record that a creation is running, so this checks that
        // a synchronous call followed by an asynchronous one still only builds one marker. It
        // matters most when the map isn't ready yet, because then creating the marker waits for
        // the map and there is a window where neither call has a marker to work with.
        it('build one marker when a sync call is followed by an async one', async () => {
            const map = fakeMap({ ready: false });
            const m = marker({ position: [1, 2], map });

            m.toGoogleSync();
            const pending = m.setTitle('A title');
            asFakeMap(map).makeReady();
            await pending;
            await tick();

            expect(mapsStats.countOf('Marker')).toBe(1);
        });
    });
});

describe('Marker with a map', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
    });

    // Section 6.3, fixed in Phase 3. The decided rule is that passing `map` displays the marker
    // unless a hide option is passed with it. It used to do neither: setOptions stored the map
    // and marked the layer visible, but the guard was `if (this.#marker)`, which is never true
    // for a fresh marker, so nothing was created and nothing reached the map.
    describe('setOptions({ map }) displays the marker (6.3)', () => {
        it('creates the Google marker', async () => {
            const map = fakeMap();
            marker({ position: [1, 2], map });
            // setMap() is async, so creation lands on a later microtask
            await tick();
            expect(mapsStats.countOf('Marker')).toBe(1);
        });

        it('reports the map as set and the layer as visible', () => {
            const map = fakeMap();
            const m = marker({ position: [1, 2], map });
            expect(m.getMap()).toBe(map);
            expect(m.hasMap()).toBe(true);
            expect(m.isVisible).toBe(true);
        });

        it('attaches it to the map', async () => {
            const map = fakeMap();
            marker({ position: [1, 2], map });
            await tick();

            const created = mapsStats.callsTo('Marker', 'constructor')[0];
            expect(created.args[0].map).toEqual({ __fakeGoogleMap: true });
        });

        // The other half of the rule: a hide option passed with the map defers the work, which
        // is what makes a page that starts with markers filtered out cost nothing.
        it('creates nothing when visible is false', async () => {
            const map = fakeMap();
            const m = marker({ position: [1, 2], map, visible: false });
            await tick();

            expect(mapsStats.countOf('Marker')).toBe(0);
            expect(m.visible).toBe(false);
            expect(m.isVisible).toBe(false);
        });

        it('creates nothing for 100 markers that start hidden', async () => {
            const map = fakeMap();
            for (let i = 0; i < 100; i += 1) {
                marker({ position: [i / 100, i / 100], map, visible: false });
            }
            await tick();
            expect(mapsStats.countOf('Marker')).toBe(0);
        });

        it('draws a hidden marker when it is shown', async () => {
            const map = fakeMap();
            const m = marker({ position: [1, 2], map, visible: false });
            await tick();
            expect(mapsStats.countOf('Marker')).toBe(0);

            m.visible = true;
            await tick();

            expect(mapsStats.countOf('Marker')).toBe(1);
            expect(m.visible).toBe(true);
        });

        // ready is dispatched synchronously inside the marker() call for a hidden marker, so a
        // plain onReady() registered afterwards has already missed it - onReady uses on(), not
        // onceImmediate(). This is why Tooltip.attachTo() and Popup.attachTo() both use
        // onceImmediate(READY_EVENT, ...): it fires straight away when the event has already
        // happened, which is the whole reason they can attach to a marker that is never drawn.
        it('still dispatches ready for a marker that starts hidden', async () => {
            const map = fakeMap();
            const m = marker({ position: [1, 2], map, visible: false });
            const cb = vi.fn();
            m.onceImmediate(MarkerEvents.READY, cb);
            await tick();

            expect(cb).toHaveBeenCalledTimes(1);
            expect(mapsStats.countOf('Marker')).toBe(0);
        });
    });

    describe('setMap(map) on a ready map', () => {
        it('creates the Google marker and attaches it', async () => {
            const map = fakeMap();
            const m = marker({ position: [1, 2] });
            await m.setMap(map);

            expect(mapsStats.countOf('Marker')).toBe(1);
            const attached = mapsStats.callsTo('Marker', 'setMap');
            expect(attached).toHaveLength(1);
            expect(attached[0].args[0]).toEqual({ __fakeGoogleMap: true });
            expect(m.getMap()).toBe(map);
        });

        it('setMap(null) afterwards detaches it without creating another', async () => {
            const map = fakeMap();
            const m = marker({ position: [1, 2] });
            await m.setMap(map);
            await m.setMap(null);

            expect(mapsStats.countOf('Marker')).toBe(1);
            const calls = mapsStats.callsTo('Marker', 'setMap');
            expect(calls[calls.length - 1].args[0]).toBeNull();
            expect(m.getMap()).toBeNull();
            expect(m.isVisible).toBe(false);
        });

        it('show() is the same as setMap()', async () => {
            const map = fakeMap();
            const m = marker({ position: [1, 2] });
            await m.show(map);
            expect(mapsStats.countOf('Marker')).toBe(1);
        });
    });

    // A map whose element is hidden is not ready yet. The marker has to wait for it rather
    // than being created against a map that does not exist.
    describe('a map that is not ready yet', () => {
        it('waits for the map before creating the Google marker', async () => {
            const map = fakeMap({ ready: false });
            const m = marker({ position: [1, 2], map });

            // toGoogle() starts the work but cannot finish until the map is ready
            const pending = m.toGoogle();
            await tick();
            expect(mapsStats.countOf('Marker')).toBe(0);
            expect(asFakeMap(map).readyCallbackCount()).toBe(1);

            asFakeMap(map).makeReady();
            await pending;

            expect(mapsStats.countOf('Marker')).toBe(1);
        });

        it('passes the map into the constructor options once it is ready', async () => {
            const map = fakeMap({ ready: false });
            const m = marker({ position: [1, 2], map });
            const pending = m.toGoogle();
            asFakeMap(map).makeReady();
            await pending;

            const created = mapsStats.callsTo('Marker', 'constructor')[0];
            expect(created.args[0].map).toEqual({ __fakeGoogleMap: true });
        });

        it('dispatches ready only after the map is ready', async () => {
            const map = fakeMap({ ready: false });
            const m = marker({ position: [1, 2], map });
            const cb = vi.fn();
            m.onReady(cb);

            const pending = m.toGoogle();
            await tick();
            expect(cb).not.toHaveBeenCalled();

            asFakeMap(map).makeReady();
            await pending;
            await tick();
            expect(cb).toHaveBeenCalledTimes(1);
        });
    });

    /* -----------------------------------------------------------------------
        The synchronous methods have to hand back a marker, whatever the map is doing.

        Creating the marker used to wait for the map to be ready, so with a map that hadn't
        rendered yet #marker was still undefined when the synchronous methods returned.
        toGoogleSync() handed back undefined, and the Sync setters went straight on to call
        something on it - #setTitle, #setCursor, #setAnchorPoint, #setOptimized and
        #setGoogleMarkerPosition all use the marker without checking - so they threw.

        A synchronous call now builds the marker without a map and puts it on the map once the
        map is ready. The asynchronous path still waits, which is what the tests above check.
    ----------------------------------------------------------------------- */
    describe('the synchronous methods with a map that is not ready', () => {
        it('toGoogleSync returns a marker rather than undefined', () => {
            const map = fakeMap({ ready: false });
            const m = marker({ position: [1, 2], map });

            const google = m.toGoogleSync();
            expect(google).toBeDefined();
            expect(mapsStats.countOf('Marker')).toBe(1);
        });

        it('does not put it on the map until the map is ready', () => {
            const map = fakeMap({ ready: false });
            const m = marker({ position: [1, 2], map });

            m.toGoogleSync();
            const created = mapsStats.callsTo('Marker', 'constructor')[0];
            expect(created.args[0].map).toBeUndefined();
            expect(mapsStats.callsTo('Marker', 'setMap')).toHaveLength(0);
        });

        it('puts it on the map once the map is ready', () => {
            const map = fakeMap({ ready: false });
            const m = marker({ position: [1, 2], map });

            m.toGoogleSync();
            asFakeMap(map).makeReady();

            const attached = mapsStats.callsTo('Marker', 'setMap');
            expect(attached).toHaveLength(1);
            expect(attached[0].args[0]).toEqual({ __fakeGoogleMap: true });
        });

        it('the Sync setters reach Google instead of throwing', () => {
            const map = fakeMap({ ready: false });
            const m = marker({ position: [1, 2], map });

            expect(() => {
                m.setTitleSync('A title');
                m.setCursorSync('pointer');
                m.setLabelSync('A label');
                m.setOptimizedSync(true);
                m.setPositionSync([3, 4]);
            }).not.toThrow();

            expect(mapsStats.callsTo('Marker', 'setTitle')).toHaveLength(1);
            expect(mapsStats.callsTo('Marker', 'setLabel')).toHaveLength(1);
            expect(mapsStats.countOf('Marker')).toBe(1);
        });

        // The synchronous call builds the marker, so the asynchronous creation that was already
        // waiting has to use that one rather than building a second.
        it('builds one marker when an async call is already waiting for the map', async () => {
            const map = fakeMap({ ready: false });
            const m = marker({ position: [1, 2], map });

            const pending = m.toGoogle();
            m.toGoogleSync();
            asFakeMap(map).makeReady();
            await pending;
            await tick();

            expect(mapsStats.countOf('Marker')).toBe(1);
        });
    });
});

/*
    Still to do for markers:

    - attachTooltip/attachPopup not creating the Google marker, which is M-1's real payoff.
      Those mixins are added by importing Tooltip.ts and Popup.ts, and Overlay builds its DOM
      in the constructor, so that test needs the jsdom environment.
    - M-5's duplicate onReady registration. Both #createMarkerObject and #setMap register a
      wait, but they never queue at the same moment in the paths above, so showing the
      duplicate needs a more specific setup than a simple not-ready map.
*/
