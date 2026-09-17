/* ===========================================================================
    Tests for the AdvancedMarker class.

    This class had no tests at all. It is also explicitly unfinished - the file header says so,
    and several of its methods have commented-out "@todo" calls where the Marker equivalent
    would set something on the Google object. These tests are written so that the work already
    done is locked in before the rest of the class is built out.

    Two things about the harness are worth knowing before adding to this file.

    1. The stand-in for google.maps.marker.AdvancedMarkerElement only has the four things the
       real one has: map, position, title and gmpClickable. Those are plain properties, not
       setters. The real element has no setIcon(), setLabel(), setCursor() or setOptions(), so
       the stub doesn't either. If one of the "@todo" lines in AdvancedMarker.ts is uncommented,
       these tests should fail rather than pass against an API that doesn't exist.
    2. The class uses "marker" as its Google library name, so checkForGoogleMaps() looks for
       google.maps.marker. Uninstalling the stub is what simulates the library not being loaded.
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdvancedMarker, advancedMarker } from '../src/lib/AdvancedMarker';
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

describe('AdvancedMarker', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
    });

    describe('building one', () => {
        it('takes a lat/lng pair', async () => {
            const m = advancedMarker([1, 2]);
            await tick();
            expect(m).toBeInstanceOf(AdvancedMarker);
            expect(m.position.lat).toBe(1);
            expect(m.position.lng).toBe(2);
        });

        it('takes a LatLng object', async () => {
            const m = advancedMarker(new LatLng(3, 4));
            await tick();
            expect(m.position.lat).toBe(3);
            expect(m.position.lng).toBe(4);
        });

        it('takes an options object', async () => {
            const m = advancedMarker({ position: [5, 6], title: 'A marker' });
            await tick();
            expect(m.position.lat).toBe(5);
            expect(m.title).toBe('A marker');
        });

        it('takes lat/lng and latitude/longitude option names', async () => {
            const a = advancedMarker({ lat: 1, lng: 2 });
            const b = advancedMarker({ latitude: 3, longitude: 4 });
            await tick();
            expect(a.position.lat).toBe(1);
            expect(b.position.lng).toBe(4);
        });

        it('defaults the position to 0,0', () => {
            const m = advancedMarker();
            expect(m.position.lat).toBe(0);
            expect(m.position.lng).toBe(0);
        });

        it('returns the same object when the factory is given an AdvancedMarker', () => {
            const m = advancedMarker([1, 2]);
            expect(advancedMarker(m)).toBe(m);
        });
    });

    /* -----------------------------------------------------------------------
        AdvancedMarker is NOT lazy, and these record that rather than asking it to be.

        Marker was changed in the performance work so that nothing is built until something
        needs it - see M-1 in ai-plans/active/performance-improvements.md. AdvancedMarker was
        copied from Marker before that and hasn't had the same treatment: every public setter
        starts with #setupGoogleMarker(), and the constructor calls setPosition(), so building
        one builds the Google element straight away.

        Two consequences are pinned below, so that if AdvancedMarker is ever given the same
        laziness these tests fail and have to be rewritten deliberately:

          - building a marker builds a Google element
          - the position and title setters are async, so reading them back straight after
            construction gives the default rather than the value passed in
    ----------------------------------------------------------------------- */
    describe('when the Google element gets built (not lazy, unlike Marker)', () => {
        it('building a marker builds one straight away', () => {
            advancedMarker([1, 2]);
            expect(mapsStats.countOf('AdvancedMarkerElement')).toBe(1);
        });

        it('100 markers build 100 of them', () => {
            for (let i = 0; i < 100; i += 1) {
                advancedMarker([i / 100, i / 100]);
            }
            expect(mapsStats.countOf('AdvancedMarkerElement')).toBe(100);
        });

        // The setters are async - they await #setupGoogleMarker() before recording the value -
        // so the options aren't written until a later microtask.
        it('the position is not readable until the microtask queue drains', async () => {
            const m = advancedMarker([1, 2]);
            expect(m.position.lat).toBe(0);

            await tick();
            expect(m.position.lat).toBe(1);
        });
    });

    describe('what does build it', () => {
        it('toGoogleSync builds it', () => {
            const m = advancedMarker([1, 2]);
            const google = m.toGoogleSync();

            expect(google).toBeDefined();
            expect(mapsStats.countOf('AdvancedMarkerElement')).toBe(1);
        });

        it('toGoogle builds it', async () => {
            const m = advancedMarker([1, 2]);
            const google = await m.toGoogle();

            expect(google).toBeDefined();
            expect(mapsStats.countOf('AdvancedMarkerElement')).toBe(1);
        });

        it('builds it only once across repeated calls', async () => {
            const m = advancedMarker([1, 2]);
            m.toGoogleSync();
            await m.toGoogle();
            m.toGoogleSync();

            expect(mapsStats.countOf('AdvancedMarkerElement')).toBe(1);
        });

        it('passes the position through when it is built', () => {
            const m = advancedMarker([1, 2]);
            m.toGoogleSync();

            const built = mapsStats.callsTo('AdvancedMarkerElement', 'constructor')[0];
            expect(built.args[0].position).toBeDefined();
            expect(built.args[0].gmpClickable).toBe(true);
        });

        // The title is set after the element has been built, because setTitle() awaits the
        // setup first, so it reaches the element through a property rather than the options
        // it was constructed with.
        it('the title reaches the element rather than the constructor options', async () => {
            const m = advancedMarker({ position: [1, 2], title: 'A marker' });
            await tick();

            expect(m.toGoogleSync().title).toBe('A marker');
        });
    });

    describe('adding it to a map', () => {
        it('builds it and attaches it', async () => {
            const map = fakeMap();
            const m = advancedMarker([1, 2]);
            await m.show(map);
            await tick();

            expect(mapsStats.countOf('AdvancedMarkerElement')).toBe(1);
            expect(m.getMap()).toBe(map);
        });

        it('setMapSync attaches it straight away', () => {
            const map = fakeMap();
            const m = advancedMarker([1, 2]);
            m.setMapSync(map);

            expect(m.toGoogleSync().map).toEqual({ __fakeGoogleMap: true });
        });

        // hide() sets the map property, which goes through the async setMap(), so the map isn't
        // cleared until a later microtask.
        it('hide takes it off the map once the microtask queue drains', async () => {
            const map = fakeMap();
            const m = advancedMarker([1, 2]);
            await m.show(map);

            m.hide();
            await tick();

            expect(m.getMap()).toBeNull();
        });
    });

    /* -----------------------------------------------------------------------
        The setters used to write to the Google marker without checking that there was one.
        The marker is only built when something needs it, so setting a value on a marker that
        hasn't been built yet - which is the normal way to configure one - went straight at an
        object that didn't exist.

        The value has to be kept either way, so that it reaches the marker when it is built.
        That is what these check: no error now, and the right value later.
    ----------------------------------------------------------------------- */
    describe('setting values before the Google marker exists', () => {
        it('setting the title does not throw and is kept', () => {
            const m = advancedMarker([1, 2]);

            expect(() => m.setTitleSync('A title')).not.toThrow();
            expect(m.title).toBe('A title');
        });

        it('setting the position does not throw and is kept', () => {
            const m = advancedMarker([1, 2]);

            expect(() => m.setPositionSync([7, 8])).not.toThrow();
            expect(m.position.lat).toBe(7);
            expect(m.position.lng).toBe(8);
        });

        it('a title set through the property reaches the element', async () => {
            const m = advancedMarker([1, 2]);
            m.title = 'Set first';
            await tick();

            expect(m.toGoogleSync().title).toBe('Set first');
            expect(m.title).toBe('Set first');
        });

        it('a position set through the property reaches the element', async () => {
            const m = advancedMarker([1, 2]);
            m.position = [9, 10];
            await tick();

            expect(m.position.lat).toBe(9);
            expect(m.position.lng).toBe(10);
        });

        it('a title set afterwards reaches the existing marker', () => {
            const m = advancedMarker([1, 2]);
            const google = m.toGoogleSync();

            m.setTitleSync('Set after');
            expect(google.title).toBe('Set after');
        });

        // Marker got an early return so that taking a marker off the map doesn't build one just
        // to remove it. AdvancedMarker hasn't had that change - setMap(null) awaits the setup
        // first, so it builds one. Recorded rather than fixed, because making this class lazy is
        // a bigger piece of work than guarding these setters.
        //
        // advancedMarker() with no position doesn't call setPosition(), so nothing is built by
        // the constructor and setMap(null) is the only thing that could build one.
        it('removing it from the map builds one, unlike Marker', async () => {
            const m = advancedMarker();
            expect(mapsStats.countOf('AdvancedMarkerElement')).toBe(0);

            await m.setMap(null);
            expect(mapsStats.countOf('AdvancedMarkerElement')).toBe(1);
        });
    });

    describe('events', () => {
        it('wires a listener up to the Google marker once it exists', () => {
            const m = advancedMarker([1, 2]);
            m.on('click', vi.fn());
            m.toGoogleSync();

            expect(mapsStats.callsTo('AdvancedMarkerElement', 'addListener').length).toBeGreaterThan(0);
        });

        it('a Google event reaches the listener', () => {
            const m = advancedMarker([1, 2]);
            const cb = vi.fn();
            m.on('click', cb);
            const google = m.toGoogleSync() as unknown as { __fire(type: string): void };

            google.__fire('click');
            expect(cb).toHaveBeenCalledTimes(1);
        });
    });
});
