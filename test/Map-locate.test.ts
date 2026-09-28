// @vitest-environment jsdom

/* ===========================================================================
    Tests for Map.locate() and the two events it dispatches.

    "locationfound" and "locationerror" are dispatched by this library rather than by Google,
    so nothing in the Google stub is involved in getting them to a listener. They are in
    INTERNAL_EVENTS, which means Evented deliberately does NOT register a Google listener for
    them - if that list or that branch ever stops matching the names used here, these tests
    are what notices.

    The Geolocation API is stubbed rather than mocked at the module level, so that everything
    goes through the same path a browser would. This is the same stub shape as
    LocationControl.test.ts, which covers locate() from the control's side.
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LatLng } from '../src/lib/LatLng';
import { Map } from '../src/lib/Map';
import { installGoogleMaps, uninstallGoogleMaps } from './support/googleMaps';

/** The success callback the stub was given, so a test can deliver a fix whenever it likes */
let deliverPosition: ((position: unknown) => void) | undefined;
/** The error callback the stub was given */
let deliverError: ((error: unknown) => void) | undefined;
/** How many watches were started */
let watchCount = 0;
/** How many one-off position requests were made */
let currentPositionCount = 0;
/** The watch ids that were cleared */
let clearedWatches: number[] = [];
/** The options the stub was last given */
let lastOptions: PositionOptions | undefined;

/**
 * Stand in for the browser's Geolocation API
 */
const installGeolocation = () => {
    watchCount = 0;
    currentPositionCount = 0;
    clearedWatches = [];
    lastOptions = undefined;
    deliverPosition = undefined;
    deliverError = undefined;
    Object.defineProperty(globalThis.navigator, 'geolocation', {
        configurable: true,
        value: {
            clearWatch: (id: number) => {
                clearedWatches.push(id);
                // Behave like the browser: a cleared watch reports nothing more. Without this
                // the stub would keep the success callback alive and "stopped watching" could
                // not be told apart from "still watching".
                if (id === watchCount) {
                    deliverPosition = undefined;
                    deliverError = undefined;
                }
            },
            getCurrentPosition: (
                success: (position: unknown) => void,
                error: (err: unknown) => void,
                options: PositionOptions,
            ) => {
                deliverPosition = success;
                deliverError = error;
                lastOptions = options;
                currentPositionCount += 1;
            },
            watchPosition: (
                success: (position: unknown) => void,
                error: (err: unknown) => void,
                options: PositionOptions,
            ) => {
                deliverPosition = success;
                deliverError = error;
                lastOptions = options;
                watchCount += 1;
                return watchCount;
            },
        },
    });
};

/**
 * Take the Geolocation API away again, for the branch that has to cope without it
 */
const uninstallGeolocation = () => {
    Object.defineProperty(globalThis.navigator, 'geolocation', {
        configurable: true,
        value: undefined,
    });
};

/**
 * Deliver a location fix to whatever asked for one
 *
 * @param {object} [coords] The coordinate values to report
 * @param {number} [timestamp] The time of the fix
 */
const findLocation = (
    coords: Record<string, number> = { accuracy: 10, latitude: 40.73061, longitude: -73.935242 },
    timestamp = 1700000000000,
) => {
    // The real GeolocationCoordinates holds these as getters on its prototype, which is why
    // Map.locate() copies them out by name instead of spreading them.
    const proto = {};
    Object.keys(coords).forEach((key) => {
        Object.defineProperty(proto, key, { get: () => coords[key] });
    });
    deliverPosition?.({ coords: Object.create(proto), timestamp });
};

/**
 * Deliver a failure to whatever asked for a location
 *
 * @param {number} code The GeolocationPositionError code
 * @param {string} message The error message
 */
const failLocation = (code = 1, message = 'User denied Geolocation') => {
    // Same story as the coordinates: the real error holds these on its prototype
    const proto = {};
    Object.defineProperty(proto, 'code', { get: () => code });
    Object.defineProperty(proto, 'message', { get: () => message });
    deliverError?.(Object.create(proto));
};

/**
 * Put an element on the page for a map to attach to
 *
 * @returns {Map}
 */
const testMap = (): Map => {
    const element = document.createElement('div');
    element.id = 'map1';
    document.body.appendChild(element);
    return new Map('#map1');
};

describe('Map.locate()', () => {
    beforeEach(() => {
        installGoogleMaps();
        installGeolocation();
    });

    afterEach(() => {
        uninstallGoogleMaps();
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    describe('the locationfound event', () => {
        it('is dispatched to a listener added with on()', () => {
            const map = testMap();
            const found = vi.fn();
            map.on('locationfound', found);
            map.locate();
            findLocation();

            expect(found).toHaveBeenCalledTimes(1);
        });

        it('is dispatched to a listener added with onLocationFound()', () => {
            const map = testMap();
            const found = vi.fn();
            map.onLocationFound(found);
            map.locate();
            findLocation();

            expect(found).toHaveBeenCalledTimes(1);
        });

        it('is dispatched to a listener added after locate() was called', () => {
            const map = testMap();
            const found = vi.fn();
            map.locate();
            map.on('locationfound', found);
            findLocation();

            expect(found).toHaveBeenCalledTimes(1);
        });

        it('carries the position data merged onto the event', () => {
            const map = testMap();
            const found = vi.fn();
            map.onLocationFound(found);
            map.locate();
            findLocation({ accuracy: 12, latitude: 40.73061, longitude: -73.935242 }, 1700000000000);

            const event = found.mock.calls[0][0];
            expect(event.type).toBe('locationfound');
            expect(event.latitude).toBe(40.73061);
            expect(event.longitude).toBe(-73.935242);
            expect(event.accuracy).toBe(12);
            expect(event.timestamp).toBe(1700000000000);
            expect(event.latLng).toBeInstanceOf(LatLng);
            expect(event.latLng.lat).toBe(40.73061);
            expect(event.latLng.lng).toBe(-73.935242);
        });

        it('copies the optional coordinates that are present and leaves out the ones that are not', () => {
            const map = testMap();
            const found = vi.fn();
            map.onLocationFound(found);
            map.locate();
            // A browser reports null for the values it has nothing for. Those must not come
            // through as properties at all.
            findLocation({
                accuracy: 5,
                altitude: 100,
                altitudeAccuracy: 3,
                heading: 90,
                latitude: 1,
                longitude: 2,
                speed: 4,
            });

            const event = found.mock.calls[0][0];
            expect(event.altitude).toBe(100);
            expect(event.altitudeAccuracy).toBe(3);
            expect(event.heading).toBe(90);
            expect(event.speed).toBe(4);

            const second = vi.fn();
            const map2 = testMap();
            map2.onLocationFound(second);
            map2.locate();
            findLocation({ latitude: 1, longitude: 2 });

            const bare = second.mock.calls[0][0];
            expect('accuracy' in bare).toBe(false);
            expect('altitude' in bare).toBe(false);
            expect('heading' in bare).toBe(false);
            expect('speed' in bare).toBe(false);
        });

        it('is dispatched again every time the watch reports a new position', () => {
            const map = testMap();
            const found = vi.fn();
            map.onLocationFound(found);
            map.locate();
            findLocation({ latitude: 1, longitude: 2 });
            findLocation({ latitude: 3, longitude: 4 });

            expect(found).toHaveBeenCalledTimes(2);
            expect(found.mock.calls[1][0].latitude).toBe(3);
        });

        it('reaches every listener', () => {
            const map = testMap();
            const first = vi.fn();
            const second = vi.fn();
            map.onLocationFound(first);
            map.on('locationfound', second);
            map.locate();
            findLocation();

            expect(first).toHaveBeenCalledTimes(1);
            expect(second).toHaveBeenCalledTimes(1);
        });

        it('is not dispatched to a listener that was removed', () => {
            const map = testMap();
            const found = vi.fn();
            map.on('locationfound', found);
            map.locate();
            map.off('locationfound', found);
            findLocation();

            expect(found).not.toHaveBeenCalled();
        });

        it('registers no Google listener for it, because Google never fires it', () => {
            const map = testMap();
            // The name is in INTERNAL_EVENTS, so Evented must not try to wire it to the Google
            // object. Before that list existed this queued a pending listener that could only
            // ever become a dead one.
            expect(() => map.on('locationfound', vi.fn())).not.toThrow();
            map.locate();
            findLocation();

            expect(map.hasListener('locationfound')).toBe(true);
        });
    });

    describe('the callback form', () => {
        it('calls a callback passed as the only argument', () => {
            const map = testMap();
            const onSuccess = vi.fn();
            map.locate(onSuccess);
            findLocation();

            expect(onSuccess).toHaveBeenCalledTimes(1);
            expect(onSuccess.mock.calls[0][0].latitude).toBe(40.73061);
        });

        it('calls a callback passed after the options', () => {
            const map = testMap();
            const onSuccess = vi.fn();
            map.locate({ enableHighAccuracy: true }, onSuccess);
            findLocation();

            expect(onSuccess).toHaveBeenCalledTimes(1);
        });

        it('dispatches the event as well as calling the callback', () => {
            const map = testMap();
            const onSuccess = vi.fn();
            const found = vi.fn();
            map.onLocationFound(found);
            map.locate({}, onSuccess);
            findLocation();

            expect(found).toHaveBeenCalledTimes(1);
            expect(onSuccess).toHaveBeenCalledTimes(1);
        });
    });

    describe('the locationerror event', () => {
        it('is dispatched with the code and message as plain values', () => {
            const map = testMap();
            vi.spyOn(console, 'error').mockImplementation(() => {});
            const locationError = vi.fn();
            map.onLocationError(locationError);
            map.locate();
            failLocation(1, 'User denied Geolocation');

            expect(locationError).toHaveBeenCalledTimes(1);
            const event = locationError.mock.calls[0][0];
            expect(event.type).toBe('locationerror');
            // These are getters on the real GeolocationPositionError prototype, so they would be
            // lost if the error object itself were passed through as the event data.
            expect(event.code).toBe(1);
            expect(event.message).toBe('User denied Geolocation');
        });

        it('does not dispatch locationfound when locating fails', () => {
            const map = testMap();
            vi.spyOn(console, 'error').mockImplementation(() => {});
            const found = vi.fn();
            map.onLocationFound(found);
            map.locate();
            failLocation(2, 'Position unavailable');

            expect(found).not.toHaveBeenCalled();
        });
    });

    describe('watching', () => {
        it('watches by default', () => {
            const map = testMap();
            map.locate();

            expect(watchCount).toBe(1);
            expect(currentPositionCount).toBe(0);
            expect(map.isLocating).toBe(true);
        });

        it('asks once when watch is off', () => {
            const map = testMap();
            map.locate({ watch: false });

            expect(watchCount).toBe(0);
            expect(currentPositionCount).toBe(1);
            // Nothing is watching, so there is nothing to stop
            expect(map.isLocating).toBe(false);
        });

        it('still dispatches locationfound when watch is off', () => {
            const map = testMap();
            const found = vi.fn();
            map.onLocationFound(found);
            map.locate({ watch: false });
            findLocation();

            expect(found).toHaveBeenCalledTimes(1);
        });

        it('passes the position options through', () => {
            const map = testMap();
            map.locate({ enableHighAccuracy: true, maximumAge: 5000 });

            expect(lastOptions?.enableHighAccuracy).toBe(true);
            expect(lastOptions?.maximumAge).toBe(5000);
            expect(lastOptions?.timeout).toBe(Infinity);
        });

        it('stops dispatching once the watch is stopped', () => {
            const map = testMap();
            const found = vi.fn();
            map.onLocationFound(found);
            map.locate();
            findLocation();
            map.stopLocate();
            // The watch was cleared, so the browser sends nothing more
            findLocation();

            expect(clearedWatches).toEqual([1]);
            expect(map.isLocating).toBe(false);
            expect(found).toHaveBeenCalledTimes(1);
        });

        it('returns the map so that it can be chained', () => {
            const map = testMap();
            expect(map.locate()).toBe(map);
            expect(map.stopLocate()).toBe(map);
        });
    });

    describe('when the browser has no Geolocation API', () => {
        it('says so and dispatches nothing', () => {
            const map = testMap();
            uninstallGeolocation();
            const error = vi.spyOn(console, 'error').mockImplementation(() => {});
            const found = vi.fn();
            map.onLocationFound(found);
            map.locate();

            expect(found).not.toHaveBeenCalled();
            expect(error).toHaveBeenCalledWith('Geolocation is not supported by this browser.');
            installGeolocation();
        });
    });
});
