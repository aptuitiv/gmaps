/* ===========================================================================
    Tests for the Evented class.

    Evented is the highest leverage file in the library - every Marker, Polyline,
    Overlay, Popup, Tooltip, InfoWindow, DataFeature, Map and DataLayer extends it.
    The plan rewrites it (C-1 dead fields, C-2 lazy containers, C-8 to C-11 dispatch
    hot path), so everything it does now is locked in here first.
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Evented } from '../src/lib/Evented';
import { installGoogleMaps, uninstallGoogleMaps } from './support/googleMaps';

/**
 * Make a plain Evented object to test against.
 *
 * The third argument is the google.maps class that checkForGoogleMaps() looks for, and it
 * has to be a class the stub actually provides. With a made-up name the check fails, every
 * listener silently goes to the pending queue instead of being attached to the Google
 * object, and the Google wiring tests below would pass or fail for the wrong reason.
 *
 * @returns {Evented}
 */
const makeEvented = () => new Evented('test', 'Test', 'Map');

describe('Evented', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
    });

    describe('on and dispatch', () => {
        it('calls the listener with the event type', () => {
            const e = makeEvented();
            const cb = vi.fn();
            e.on('click', cb);
            e.dispatch('click');
            expect(cb).toHaveBeenCalledTimes(1);
            expect(cb.mock.calls[0][0]).toMatchObject({ type: 'click' });
        });

        it('calls every listener for the type, in order', () => {
            const e = makeEvented();
            const order: string[] = [];
            e.on('click', () => order.push('first'));
            e.on('click', () => order.push('second'));
            e.dispatch('click');
            expect(order).toEqual(['first', 'second']);
        });

        it('does not call listeners for a different type', () => {
            const e = makeEvented();
            const cb = vi.fn();
            e.on('click', cb);
            e.dispatch('mouseover');
            expect(cb).not.toHaveBeenCalled();
        });

        it('dispatching with no listeners is safe and chainable', () => {
            const e = makeEvented();
            expect(e.dispatch('nothing')).toBe(e);
        });

        it('merges plain data into the event object', () => {
            const e = makeEvented();
            const cb = vi.fn();
            e.on('custom', cb);
            e.dispatch('custom', { value: 42 });
            expect(cb.mock.calls[0][0]).toMatchObject({ type: 'custom', value: 42 });
        });

        it('trigger is an alias for dispatch', () => {
            const e = makeEvented();
            const cb = vi.fn();
            e.on('click', cb);
            e.trigger('click');
            expect(cb).toHaveBeenCalledTimes(1);
        });

        it('throws when the callback is not a function', () => {
            const e = makeEvented();
            expect(() => e.on('click', undefined as never)).toThrow(/needs a callback function/);
        });

        it('binds the context when one is given', () => {
            const e = makeEvented();
            const context = { name: 'ctx' };
            let seen: unknown;
            e.on(
                'click',
                function handler(this: unknown) {
                    seen = this;
                },
                { context },
            );
            e.dispatch('click');
            expect(seen).toBe(context);
        });
    });

    // C-2. The containers are only built when something is put in them. Every Marker, Polyline,
    // Overlay, Popup, Tooltip, InfoWindow, DataFeature, Map and DataLayer extends this class, so
    // at 20,000 markers these were about 80,000 objects that stayed empty for the life of the
    // page.
    //
    // Being straight about what these can and cannot check: the containers are #private, so a
    // test cannot read them from outside and cannot count allocations directly. What these do is
    // exercise every path that touches a container on an object that has never had a listener,
    // so that a missed lazy-init would show up as a TypeError rather than passing silently.
    // The real proof that the allocation is gone is a heap snapshot in a browser - see section
    // 10 of the plan.
    describe('every container path is safe before anything is added (C-2)', () => {
        it('answers hasListener without building anything', () => {
            const e = makeEvented();
            expect(e.hasListener('click')).toBe(false);
            expect(e.hasListener('click', vi.fn())).toBe(false);
        });

        it('dispatches to nothing without throwing', () => {
            const e = makeEvented();
            expect(() => e.dispatch('click')).not.toThrow();
            expect(() => e.dispatch('click', { some: 'data' })).not.toThrow();
        });

        it('removes listeners that were never added without throwing', () => {
            const e = makeEvented();
            expect(() => e.off('click')).not.toThrow();
            expect(() => e.off('click', vi.fn())).not.toThrow();
            expect(() => e.offAll()).not.toThrow();
        });

        it('builds the containers once a listener is added, and works normally after', () => {
            const e = makeEvented();
            const cb = vi.fn();
            e.on('click', cb);
            e.dispatch('click');
            expect(cb).toHaveBeenCalledTimes(1);
        });

        it('still records that an event happened when nothing is listening', () => {
            const e = makeEvented();
            // No listeners at all, so the early-out in dispatch() is taken
            e.dispatch('ready');

            // A callImmediate listener added afterwards must still be called, which only works
            // if dispatch() recorded the event despite having nothing to call
            const cb = vi.fn();
            e.onceImmediate('ready', cb);
            expect(cb).toHaveBeenCalledTimes(1);
        });

        it('goes back to holding nothing after offAll()', () => {
            const e = makeEvented();
            e.on('click', vi.fn());
            e.on('mouseover', vi.fn());
            e.offAll();

            // The containers are cleared rather than left as empty objects, so a fully cleaned up
            // object holds no more than one that never had a listener
            expect(e.hasListener('click')).toBe(false);
            expect(e.hasListener('mouseover')).toBe(false);
            expect(() => e.dispatch('click')).not.toThrow();

            // And it still works if listeners are added again
            const cb = vi.fn();
            e.on('click', cb);
            e.dispatch('click');
            expect(cb).toHaveBeenCalledTimes(1);
        });

        it('handles 1,000 objects that never get a listener', () => {
            const objects: Evented[] = [];
            for (let i = 0; i < 1000; i += 1) {
                objects.push(makeEvented());
            }
            objects.forEach((e) => {
                expect(e.hasListener('click')).toBe(false);
            });
        });
    });

    describe('hasListener', () => {
        it('reports by type and by callback', () => {
            const e = makeEvented();
            const cb = vi.fn();
            const other = vi.fn();
            expect(e.hasListener('click')).toBe(false);
            e.on('click', cb);
            expect(e.hasListener('click')).toBe(true);
            expect(e.hasListener('click', cb)).toBe(true);
            expect(e.hasListener('click', other)).toBe(false);
            expect(e.hasListener('never')).toBe(false);
        });
    });

    describe('off', () => {
        it('removes one listener by callback', () => {
            const e = makeEvented();
            const keep = vi.fn();
            const drop = vi.fn();
            e.on('click', keep);
            e.on('click', drop);
            e.off('click', drop);
            e.dispatch('click');
            expect(keep).toHaveBeenCalledTimes(1);
            expect(drop).not.toHaveBeenCalled();
        });

        it('removes every listener for a type when no callback is given', () => {
            const e = makeEvented();
            const cb = vi.fn();
            e.on('click', cb);
            e.on('click', vi.fn());
            e.off('click');
            expect(e.hasListener('click')).toBe(false);
            e.dispatch('click');
            expect(cb).not.toHaveBeenCalled();
        });

        it('removes everything when called with no arguments', () => {
            const e = makeEvented();
            e.on('click', vi.fn());
            e.on('mouseover', vi.fn());
            e.off();
            expect(e.hasListener('click')).toBe(false);
            expect(e.hasListener('mouseover')).toBe(false);
        });

        it('offAll removes everything', () => {
            const e = makeEvented();
            e.on('click', vi.fn());
            e.on('mouseover', vi.fn());
            e.offAll();
            expect(e.hasListener('click')).toBe(false);
            expect(e.hasListener('mouseover')).toBe(false);
        });

        it('removing a type that was never added is safe', () => {
            const e = makeEvented();
            expect(() => e.off('never')).not.toThrow();
        });
    });

    describe('once', () => {
        it('calls the listener only for the first dispatch', () => {
            const e = makeEvented();
            const cb = vi.fn();
            e.once('click', cb);
            e.dispatch('click');
            e.dispatch('click');
            e.dispatch('click');
            expect(cb).toHaveBeenCalledTimes(1);
            expect(e.hasListener('click')).toBe(false);
        });

        it('removes several once listeners in a single dispatch', () => {
            const e = makeEvented();
            const first = vi.fn();
            const second = vi.fn();
            e.once('click', first);
            e.once('click', second);
            e.dispatch('click');
            expect(first).toHaveBeenCalledTimes(1);
            expect(second).toHaveBeenCalledTimes(1);
            expect(e.hasListener('click')).toBe(false);
        });

        it('keeps normal listeners when removing the once ones', () => {
            const e = makeEvented();
            const normal = vi.fn();
            const onceCb = vi.fn();
            e.on('click', normal);
            e.once('click', onceCb);
            e.dispatch('click');
            e.dispatch('click');
            expect(normal).toHaveBeenCalledTimes(2);
            expect(onceCb).toHaveBeenCalledTimes(1);
        });
    });

    describe('onImmediate and onceImmediate', () => {
        it('onceImmediate calls back right away when the event already happened', () => {
            const e = makeEvented();
            e.dispatch('ready');
            const cb = vi.fn();
            e.onceImmediate('ready', cb);
            expect(cb).toHaveBeenCalledTimes(1);
            // It was called immediately, so it is not kept for a future dispatch
            expect(e.hasListener('ready')).toBe(false);
            e.dispatch('ready');
            expect(cb).toHaveBeenCalledTimes(1);
        });

        it('onceImmediate waits when the event has not happened yet', () => {
            const e = makeEvented();
            const cb = vi.fn();
            e.onceImmediate('ready', cb);
            expect(cb).not.toHaveBeenCalled();
            e.dispatch('ready');
            expect(cb).toHaveBeenCalledTimes(1);
            e.dispatch('ready');
            expect(cb).toHaveBeenCalledTimes(1);
        });

        it('onImmediate calls back right away and stays for later dispatches', () => {
            const e = makeEvented();
            e.dispatch('ready');
            const cb = vi.fn();
            e.onImmediate('ready', cb);
            expect(cb).toHaveBeenCalledTimes(1);
            e.dispatch('ready');
            expect(cb).toHaveBeenCalledTimes(2);
        });
    });

    describe('only and onlyOnce', () => {
        it('only keeps a single listener for the type', () => {
            const e = makeEvented();
            const first = vi.fn();
            const second = vi.fn();
            e.only('click', first);
            e.on('click', second);
            e.dispatch('click');
            expect(first).toHaveBeenCalledTimes(1);
            expect(second).not.toHaveBeenCalled();
        });

        it('onlyOnce keeps a single listener and drops it after the first dispatch', () => {
            const e = makeEvented();
            const cb = vi.fn();
            e.onlyOnce('click', cb);
            e.dispatch('click');
            e.dispatch('click');
            expect(cb).toHaveBeenCalledTimes(1);
        });

        /*
            The type is marked as "spoken for" while an only() listener is registered, and that
            marker is what makes a later on() for the same type do nothing. Removing listeners
            used to clear the marker whatever happened, including when the removal matched
            nothing - so off() with an unrelated callback left the only() listener in place but
            took the marker away, and the next on() was accepted. The type then had the two
            listeners that only() exists to prevent.

            The three tests after the first one are the other half of it: the marker still has to
            be cleared when the listener really has gone, or only() could never be used again for
            that type.
        */
        it('keeps the only() listener alone when a different callback is removed', () => {
            const e = makeEvented();
            const first = vi.fn();
            const second = vi.fn();
            e.only('click', first);

            // Matches nothing, so the only() listener is still there afterwards
            e.off('click', () => {});
            e.on('click', second);
            e.dispatch('click');

            expect(first).toHaveBeenCalledTimes(1);
            expect(second).not.toHaveBeenCalled();
        });

        it('frees the type once the only() listener is removed by name', () => {
            const e = makeEvented();
            const first = vi.fn();
            const second = vi.fn();
            e.only('click', first);

            e.off('click', first);
            e.on('click', second);
            e.dispatch('click');

            expect(first).not.toHaveBeenCalled();
            expect(second).toHaveBeenCalledTimes(1);
        });

        it('frees the type when every listener for it is removed', () => {
            const e = makeEvented();
            const first = vi.fn();
            const second = vi.fn();
            e.only('click', first);

            e.off('click');
            e.on('click', second);
            e.dispatch('click');

            expect(first).not.toHaveBeenCalled();
            expect(second).toHaveBeenCalledTimes(1);
        });

        // The onlyOnce listener is removed by removeCalledOnceListeners() after it fires, which
        // leaves the type with none - so the marker has to go as well.
        it('frees the type after an onlyOnce listener has fired', () => {
            const e = makeEvented();
            const first = vi.fn();
            const second = vi.fn();
            e.onlyOnce('click', first);
            e.dispatch('click');

            e.on('click', second);
            e.dispatch('click');

            expect(first).toHaveBeenCalledTimes(1);
            expect(second).toHaveBeenCalledTimes(1);
        });
    });

    describe('Google event wiring', () => {
        it('adds a Google listener when the Google object is set first', () => {
            const google = (globalThis as { google?: { maps: { MVCObject: new () => never } } }).google!;
            const e = makeEvented();
            const googleObject = new google.maps.MVCObject();
            e.setEventGoogleObject(googleObject);

            const cb = vi.fn();
            e.on('click', cb);
            expect((googleObject as unknown as { __listeners: Record<string, unknown[]> }).__listeners.click).toHaveLength(1);
        });

        it('holds listeners registered before the Google object exists, then attaches them', () => {
            const google = (globalThis as { google?: { maps: { MVCObject: new () => never } } }).google!;
            const e = makeEvented();
            const cb = vi.fn();

            // Registered with no Google object yet - this is the case that lets a tooltip attach
            // to a polyline that has not been drawn.
            e.on('click', cb);

            const googleObject = new google.maps.MVCObject();
            e.setEventGoogleObject(googleObject);
            expect((googleObject as unknown as { __listeners: Record<string, unknown[]> }).__listeners.click).toHaveLength(1);

            // Firing the Google event reaches the library listener
            (googleObject as unknown as { __fire(type: string): void }).__fire('click');
            expect(cb).toHaveBeenCalledTimes(1);
        });
    });

    // P-1. Every event type used to be wired through to the Google object, including the ones
    // this library dispatches itself. Google never fires "ready", so that listener could never
    // be called - and because objects listen for "ready" before their Google object exists, it
    // was usually queued as a pending listener first and turned into a dead one later.
    describe("the library's own events are not wired to Google (P-1)", () => {
        /**
         * The listeners of a type that were added to a stub Google object
         *
         * @param {unknown} googleObject The stub Google object
         * @param {string} type The event type
         * @returns {unknown[]|undefined}
         */
        const listenersOn = (googleObject: unknown, type: string): unknown[] | undefined =>
            (googleObject as { __listeners: Record<string, unknown[]> }).__listeners[type];

        /**
         * Make a stub Google object
         *
         * @returns {object}
         */
        const makeGoogleObject = () => {
            const google = (globalThis as { google?: { maps: { MVCObject: new () => never } } }).google!;
            return new google.maps.MVCObject();
        };

        it('adds no Google listener for ready when the Google object is already set', () => {
            const e = makeEvented();
            const googleObject = makeGoogleObject();
            e.setEventGoogleObject(googleObject);

            e.on('ready', vi.fn());
            expect(listenersOn(googleObject, 'ready')).toBeUndefined();
        });

        // The common case: an object waits for "ready" long before it has a Google object.
        it('queues nothing pending for ready, so none appears when the Google object arrives', () => {
            const e = makeEvented();
            e.on('ready', vi.fn());

            const googleObject = makeGoogleObject();
            e.setEventGoogleObject(googleObject);
            expect(listenersOn(googleObject, 'ready')).toBeUndefined();
        });

        // The load-bearing check. Skipping the wiring must not stop the event working, because
        // "ready" is dispatched by this library rather than by Google.
        it('still calls a ready listener when the event is dispatched', () => {
            const e = makeEvented();
            const cb = vi.fn();
            e.on('ready', cb);
            e.dispatch('ready');
            expect(cb).toHaveBeenCalledTimes(1);
        });

        it('skips every one of the library\'s own event types', () => {
            const e = makeEvented();
            const googleObject = makeGoogleObject();
            e.setEventGoogleObject(googleObject);

            ['ready', 'locationfound', 'locationerror', 'initialized'].forEach((type) => {
                e.on(type, vi.fn());
                expect(listenersOn(googleObject, type)).toBeUndefined();
            });
        });

        it('still dispatches those types to their listeners', () => {
            const e = makeEvented();
            const cb = vi.fn();
            e.on('locationfound', cb);
            e.dispatch('locationfound');
            expect(cb).toHaveBeenCalledTimes(1);
        });

        // The guard must not be greedy. These are real Google event names, and "dragstart" is the
        // one that matters most: the overlay dispatches its own "dragstart", so it was tempting to
        // treat it as internal - but Marker and Map get theirs from Google, and this list can't
        // tell which kind of object it belongs to. Excluding it here would stop markers dragging.
        it('still wires real Google events, including the drag events an overlay also uses', () => {
            const e = makeEvented();
            const googleObject = makeGoogleObject();
            e.setEventGoogleObject(googleObject);

            ['click', 'dragstart', 'drag', 'dragend', 'bounds_changed'].forEach((type) => {
                e.on(type, vi.fn());
                expect(listenersOn(googleObject, type)).toHaveLength(1);
            });
        });

        it('a Google event still reaches its listener after the guard', () => {
            const e = makeEvented();
            const googleObject = makeGoogleObject();
            e.setEventGoogleObject(googleObject);

            const cb = vi.fn();
            e.on('dragstart', cb);
            (googleObject as unknown as { __fire(type: string): void }).__fire('dragstart');
            expect(cb).toHaveBeenCalledTimes(1);
        });
    });
});

describe('Evented without the Google Maps library loaded', () => {
    beforeEach(() => {
        uninstallGoogleMaps();
    });

    it('can add a listener before Google Maps has loaded', () => {
        const e = makeEvented();
        expect(() => e.on('click', vi.fn())).not.toThrow();
        expect(e.hasListener('click')).toBe(true);
    });

    it('can dispatch to a normal listener before Google Maps has loaded', () => {
        const e = makeEvented();
        const cb = vi.fn();
        e.on('click', cb);
        expect(() => e.dispatch('click')).not.toThrow();
        expect(cb).toHaveBeenCalledTimes(1);
    });

    // Section 6.5, fixed in Phase 2.
    //
    // Removing the last listener for a type used to throw a ReferenceError when the Google Maps
    // library had not loaded, because #isGoogleObjectSet() read the bare `google` global.
    // #afterListenersRemoved() no longer calls it at all - it removes the listener this object
    // added, by its own handle - and #isGoogleObjectSet() now checks that `google` exists first.
    //
    // This matters because the library deliberately supports creating objects and attaching
    // listeners before Google Maps loads; that is what the pending listener mechanism is for.
    it('dispatching a "once" listener before Google Maps loads does not throw', () => {
        const e = makeEvented();
        e.once('click', vi.fn());
        expect(() => e.dispatch('click')).not.toThrow();
        expect(e.hasListener('click')).toBe(false);
    });

    it('off() before Google Maps loads does not throw', () => {
        const e = makeEvented();
        e.on('click', vi.fn());
        expect(() => e.off('click')).not.toThrow();
        expect(e.hasListener('click')).toBe(false);
    });

    it('offAll() before Google Maps loads does not throw', () => {
        const e = makeEvented();
        e.on('click', vi.fn());
        e.on('mouseover', vi.fn());
        expect(() => e.offAll()).not.toThrow();
        expect(e.hasListener('click')).toBe(false);
        expect(e.hasListener('mouseover')).toBe(false);
    });
});

// Section 6.1, fixed in Phase 2. This was the most damaging bug in the plan.
//
// #afterListenersRemoved() used to call google.maps.event.clearListeners(googleObject, type) as
// soon as the library's own listener list for that type became empty. clearListeners removes
// EVERY listener of that type on the object, including ones the library never added.
//
// Two live paths reach it: Map.fitBounds registers this.once(BOUNDS_CHANGED, ...), and
// Polyline.#updateZoomListener calls map.off('idle', ...). @googlemaps/markerclusterer drives
// its re-clustering off "idle", so a polyline leaving a map could stop clustering working.
//
// Each listener this library adds to a Google object is now kept by its handle and removed on
// its own, so listeners added by anything else are left alone.
describe('removing listeners leaves listeners this library did not add (6.1)', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
    });

    /**
     * Get the raw listener list off a stub Google object
     *
     * @param {unknown} googleObject The stub object
     * @param {string} type The event type
     * @returns {unknown[]}
     */
    const listenersFor = (googleObject: unknown, type: string): unknown[] =>
        (googleObject as { __listeners: Record<string, unknown[]> }).__listeners[type] ?? [];

    /*
        A listener added before the Google object exists is queued, and setEventGoogleObject()
        walks that queue by event type when the object arrives. It never looked at whether the
        type still had any listeners, so one that was added and then removed while the object was
        still being set up came back as a live Google listener with nothing behind it.

        That is worse than a wasted listener. dispatch() records a type as having happened
        whether or not anything is listening, and that record is what callImmediate and
        onceImmediate read to decide whether to fire straight away - so the resurrected listener
        would mark an event as fired, and a later onceImmediate() for that type would be called
        for an event this object had stopped listening to. The second test below is that part.

        The ordering is ordinary rather than exotic: Marker, Polyline, Map, DataLayer and
        AdvancedMarker all call setEventGoogleObject() well after their listeners are set up.
    */
    it('adds no Google listener for a type whose listener was removed before the object arrived', () => {
        const google = (globalThis as { google?: { maps: { MVCObject: new () => never } } }).google!;
        const e = makeEvented();
        const cb = vi.fn();

        // No Google object yet, so this is queued rather than attached
        e.on('idle', cb);
        e.off('idle', cb);

        const googleObject = new google.maps.MVCObject();
        e.setEventGoogleObject(googleObject);

        expect(listenersFor(googleObject, 'idle')).toHaveLength(0);
    });

    it('does not record the event as fired for a listener that was removed first', () => {
        const google = (globalThis as { google?: { maps: { MVCObject: new () => never } } }).google!;
        const e = makeEvented();
        const cb = vi.fn();
        e.on('idle', cb);
        e.off('idle', cb);

        const googleObject = new google.maps.MVCObject();
        e.setEventGoogleObject(googleObject);
        // Nothing should be attached, so firing on the Google object reaches nothing
        (googleObject as unknown as { __fire(type: string): void }).__fire('idle');

        // onceImmediate fires straight away for an event that has already been dispatched
        const immediate = vi.fn();
        e.onceImmediate('idle', immediate);
        expect(immediate).not.toHaveBeenCalled();
    });

    it('still wires up a type that has a listener left', () => {
        const google = (globalThis as { google?: { maps: { MVCObject: new () => never } } }).google!;
        const e = makeEvented();
        const gone = vi.fn();
        const kept = vi.fn();
        e.on('idle', gone);
        e.on('idle', kept);
        e.off('idle', gone);

        const googleObject = new google.maps.MVCObject();
        e.setEventGoogleObject(googleObject);

        expect(listenersFor(googleObject, 'idle')).toHaveLength(1);
    });

    it('leaves the other pending types alone', () => {
        const google = (globalThis as { google?: { maps: { MVCObject: new () => never } } }).google!;
        const e = makeEvented();
        const idle = vi.fn();
        const click = vi.fn();
        e.on('idle', idle);
        e.on('click', click);
        e.off('idle', idle);

        const googleObject = new google.maps.MVCObject();
        e.setEventGoogleObject(googleObject);

        expect(listenersFor(googleObject, 'idle')).toHaveLength(0);
        expect(listenersFor(googleObject, 'click')).toHaveLength(1);
    });

    it('off() leaves a third-party listener in place while removing its own', () => {
        const google = (globalThis as { google?: { maps: { MVCObject: new () => never } } }).google!;
        const googleObject = new google.maps.MVCObject();

        const e = makeEvented();
        e.setEventGoogleObject(googleObject);

        // Something else on the page - a clusterer, another library - listens to the same event
        const thirdParty = vi.fn();
        (googleObject as unknown as { addListener(t: string, f: () => void): void }).addListener('idle', thirdParty);
        expect(listenersFor(googleObject, 'idle')).toHaveLength(1);

        // The library adds and then removes its own listener for that type
        const mine = vi.fn();
        e.on('idle', mine);
        e.off('idle', mine);

        // The third-party listener survives; only this library's own is gone
        expect(listenersFor(googleObject, 'idle')).toHaveLength(1);
        expect(listenersFor(googleObject, 'idle')[0]).toBe(thirdParty);
        expect(e.hasListener('idle')).toBe(false);
    });

    it('a once listener firing does not wipe them', () => {
        const google = (globalThis as { google?: { maps: { MVCObject: new () => never } } }).google!;
        const googleObject = new google.maps.MVCObject();

        const e = makeEvented();
        e.setEventGoogleObject(googleObject);

        const thirdParty = vi.fn();
        (googleObject as unknown as { addListener(t: string, f: () => void): void }).addListener(
            'bounds_changed',
            thirdParty,
        );

        // This is the shape of Map.fitBounds: a single once listener that empties the list
        // as soon as it fires. It used to take the third-party listener with it.
        e.once('bounds_changed', vi.fn());
        e.dispatch('bounds_changed');

        expect(listenersFor(googleObject, 'bounds_changed')).toHaveLength(1);
        expect(listenersFor(googleObject, 'bounds_changed')[0]).toBe(thirdParty);
    });

    it('leaves them alone while the library still has a listener of that type', () => {
        const google = (globalThis as { google?: { maps: { MVCObject: new () => never } } }).google!;
        const googleObject = new google.maps.MVCObject();

        const e = makeEvented();
        e.setEventGoogleObject(googleObject);

        const thirdParty = vi.fn();
        (googleObject as unknown as { addListener(t: string, f: () => void): void }).addListener('idle', thirdParty);

        const first = vi.fn();
        const second = vi.fn();
        e.on('idle', first);
        e.on('idle', second);
        e.off('idle', first);

        // The third-party one, plus the single listener this library adds per type
        expect(listenersFor(googleObject, 'idle')).toHaveLength(2);
    });

    it('offAll() leaves every third-party listener in place', () => {
        const google = (globalThis as { google?: { maps: { MVCObject: new () => never } } }).google!;
        const googleObject = new google.maps.MVCObject();

        const e = makeEvented();
        e.setEventGoogleObject(googleObject);

        const thirdPartyIdle = vi.fn();
        const thirdPartyClick = vi.fn();
        (googleObject as unknown as { addListener(t: string, f: () => void): void }).addListener(
            'idle',
            thirdPartyIdle,
        );
        (googleObject as unknown as { addListener(t: string, f: () => void): void }).addListener(
            'click',
            thirdPartyClick,
        );

        // Give this library its own listeners for the same types, then remove them all
        e.on('idle', vi.fn());
        e.on('click', vi.fn());
        e.offAll();

        // clearInstanceListeners() used to take everything on the object with it
        expect(listenersFor(googleObject, 'idle')).toHaveLength(1);
        expect(listenersFor(googleObject, 'click')).toHaveLength(1);
        expect(e.hasListener('idle')).toBe(false);
    });
});
