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

    // BUG, found while writing these tests.
    //
    // Removing the last listener for a type runs #afterListenersRemoved(), which calls
    // #isGoogleObjectSet(). That does `this.#googleObject instanceof google.maps.MVCObject`
    // against the bare `google` global, so it throws a ReferenceError when the Google Maps
    // library has not loaded.
    //
    // This matters because the library deliberately supports creating objects and attaching
    // listeners before Google Maps loads - that is what the pending listener mechanism is for.
    // Anything that empties a listener list before the library loads will crash:
    //   - dispatching a "once" listener (it is removed straight after being called)
    //   - off() / offAll()
    //
    // These use it.fails(), so they PASS while the bug exists and FAIL once it is fixed,
    // which is the signal to turn them into ordinary expectations.
    it.fails('dispatching a "once" listener before Google Maps loads should not throw', () => {
        const e = makeEvented();
        e.once('click', vi.fn());
        e.dispatch('click');
    });

    it.fails('off() before Google Maps loads should not throw', () => {
        const e = makeEvented();
        e.on('click', vi.fn());
        e.off('click');
    });

    // Same root cause as the two above: offAll() calls #isGoogleObjectSet() unconditionally.
    // Locked in as "currently throws" rather than it.fails() so that the assertion is explicit.
    // When the ReferenceError is fixed this becomes .not.toThrow().
    it('offAll() also throws before Google Maps loads, for the same reason', () => {
        const e = makeEvented();
        e.on('click', vi.fn());
        expect(() => e.offAll()).toThrow();
    });
});
