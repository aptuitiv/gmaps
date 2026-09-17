/* ===========================================================================
    Tests for the Loader class.

    These use `new Loader()` rather than the loader() factory wherever state matters,
    because the factory is a module-level singleton that would leak between tests.

    The bug described in section 6.6 - on() always re-dispatching LOAD rather than the
    event type that was asked for, so an onMapLoad() registered after the map has loaded
    never fires - can only be reached once #isLoaded is true, which needs a real API key
    and a network call. What is testable without that is recorded here, and the untestable
    half is described in the comment on the last block.
=========================================================================== */

import { describe, expect, it, vi } from 'vitest';
import { Loader, loader } from '../src/lib/Loader';
import { LoaderEvents } from '../src/lib/constants';

describe('options', () => {
    it('takes the options in the constructor', () => {
        const l = new Loader({ apiKey: 'test-key', version: '3.55', libraries: ['places'] });
        expect(l.apiKey).toBe('test-key');
        expect(l.version).toBe('3.55');
        expect(l.libraries).toEqual(['places']);
    });

    it('defaults the version to weekly and the libraries to none', () => {
        const l = new Loader();
        expect(l.version).toBe('weekly');
        expect(l.libraries).toEqual([]);
    });

    it('sets options through setOptions and the set* methods', () => {
        const l = new Loader();
        l.setOptions({ apiKey: 'a', version: 'quarterly' });
        expect(l.apiKey).toBe('a');
        expect(l.version).toBe('quarterly');

        l.setApiKey('b').setLibraries(['marker']).setVersion('beta');
        expect(l.apiKey).toBe('b');
        expect(l.libraries).toEqual(['marker']);
        expect(l.version).toBe('beta');
    });

    it('turns a single library string into an array', () => {
        const l = new Loader();
        l.libraries = 'places' as never;
        expect(l.libraries).toEqual(['places']);
    });

    it('ignores values of the wrong type', () => {
        const l = new Loader({ apiKey: 'keep' });
        l.apiKey = 42 as never;
        l.version = 42 as never;
        expect(l.apiKey).toBe('keep');
        expect(l.version).toBe('weekly');
    });
});

describe('load', () => {
    it('rejects when no API key is set', async () => {
        const l = new Loader();
        await expect(l.load()).rejects.toThrow(/API key is not set/);
    });
});

describe('events', () => {
    it('throws when the callback is not a function', () => {
        const l = new Loader();
        expect(() => l.on(LoaderEvents.LOAD, null)).toThrow(/needs a callback function/);
    });

    it('calls a load listener when the event is dispatched', () => {
        const l = new Loader();
        const cb = vi.fn();
        l.onLoad(cb);
        l.dispatch(LoaderEvents.LOAD);
        expect(cb).toHaveBeenCalledTimes(1);
    });

    it('calls a map_load listener when that event is dispatched', () => {
        const l = new Loader();
        const cb = vi.fn();
        l.onMapLoad(cb);
        l.dispatch(LoaderEvents.MAP_LOAD);
        expect(cb).toHaveBeenCalledTimes(1);
    });

    // Every listener is registered with { once: true }, because the load events only ever
    // happen once.
    it('only calls each listener once, however many times the event is dispatched', () => {
        const l = new Loader();
        const cb = vi.fn();
        l.onLoad(cb);
        l.dispatch(LoaderEvents.LOAD);
        l.dispatch(LoaderEvents.LOAD);
        l.dispatch(LoaderEvents.LOAD);
        expect(cb).toHaveBeenCalledTimes(1);
    });

    it('does not call a listener registered after the event was dispatched', () => {
        const l = new Loader();
        l.dispatch(LoaderEvents.LOAD);
        const cb = vi.fn();
        l.onLoad(cb);
        expect(cb).not.toHaveBeenCalled();
    });

    it('keeps load and map_load listeners separate', () => {
        const l = new Loader();
        const onLoad = vi.fn();
        const onMapLoad = vi.fn();
        l.onLoad(onLoad);
        l.onMapLoad(onMapLoad);

        l.dispatch(LoaderEvents.LOAD);
        expect(onLoad).toHaveBeenCalledTimes(1);
        expect(onMapLoad).not.toHaveBeenCalled();

        l.dispatch(LoaderEvents.MAP_LOAD);
        expect(onMapLoad).toHaveBeenCalledTimes(1);
    });

    it('once and onceLoad behave the same as on and onLoad', () => {
        const l = new Loader();
        const a = vi.fn();
        const b = vi.fn();
        l.once(LoaderEvents.LOAD, a);
        l.onceLoad(b);
        l.dispatch(LoaderEvents.LOAD);
        expect(a).toHaveBeenCalledTimes(1);
        expect(b).toHaveBeenCalledTimes(1);
    });
});

describe('the loader() factory', () => {
    it('returns the same instance every time', () => {
        expect(loader()).toBe(loader());
    });

    it('applies options to the existing instance', () => {
        loader({ apiKey: 'singleton-key' });
        expect(loader().apiKey).toBe('singleton-key');
    });
});

/*
    Not covered here, and why.

    Section 6.6: Loader.on() always dispatches LoaderEvents.LOAD when #isLoaded is true,
    never the event type that was actually asked for:

        on(type, callback) {
            this.addEventListener(type, callback, { once: true });
            if (this.#isLoaded) { this.dispatch(LoaderEvents.LOAD); }
        }

    So a MAP_LOAD listener added after the library has loaded is registered and then never
    called, and any promise waiting on it never settles. Marker.#setupGoogleMarker,
    Polyline.#setupGooglePolyline and MarkerCluster all reach this path.

    #isLoaded is only set inside load(), which needs a real API key and a network request to
    Google, so it cannot be reached from a unit test without faking the underlying
    @googlemaps/js-api-loader. Worth doing when 6.6 is fixed - the fix (a shared load promise,
    plus dispatching the requested type) is what makes it testable.
*/
