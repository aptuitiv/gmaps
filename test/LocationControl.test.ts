// @vitest-environment jsdom

/* ===========================================================================
    Tests for the LocationControl class, and for the two locate() bugs it depends on being fixed.

    The Geolocation API is stubbed rather than mocked at the module level, so that the control goes
    through the same map.locate() path a browser would.
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { locationControl, LocationControl } from '../src/lib/LocationControl';
import { ControlPosition } from '../src/lib/constants';
import { Map } from '../src/lib/Map';
import { marker } from '../src/lib/Marker';
import { installGoogleMaps, uninstallGoogleMaps } from './support/googleMaps';

/** The success callback the stub was given, so a test can deliver a fix whenever it likes */
let deliverPosition: ((position: unknown) => void) | undefined;
/** The error callback the stub was given */
let deliverError: ((error: unknown) => void) | undefined;
/** How many watches were started */
let watchCount = 0;
/** The watch ids that were cleared */
let clearedWatches: number[] = [];

/**
 * Stand in for the browser's Geolocation API
 */
const installGeolocation = () => {
    watchCount = 0;
    clearedWatches = [];
    deliverPosition = undefined;
    deliverError = undefined;
    Object.defineProperty(globalThis.navigator, 'geolocation', {
        configurable: true,
        value: {
            clearWatch: (id: number) => {
                clearedWatches.push(id);
            },
            getCurrentPosition: (success: (position: unknown) => void) => {
                deliverPosition = success;
            },
            watchPosition: (success: (position: unknown) => void, error: (err: unknown) => void) => {
                deliverPosition = success;
                deliverError = error;
                watchCount += 1;
                return watchCount;
            },
        },
    });
};

/**
 * Deliver a location fix to whatever asked for one
 *
 * @param {number} latitude The latitude
 * @param {number} longitude The longitude
 */
const findLocation = (latitude = 40.73061, longitude = -73.935242) => {
    deliverPosition?.({ coords: { accuracy: 10, latitude, longitude }, timestamp: Date.now() });
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

describe('LocationControl', () => {
    beforeEach(() => {
        installGoogleMaps();
        installGeolocation();
    });

    afterEach(() => {
        uninstallGoogleMaps();
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    describe('before a location is found', () => {
        it('puts nothing on the map', () => {
            const map = testMap();
            const c = locationControl({ map, className: 'MyBtn' });

            // Nothing is shown until there is something to show. A denied permission then leaves no
            // dead button behind.
            expect(c.isAttached).toBe(false);
            expect(c.isLocated).toBe(false);
            expect(c.location).toBeUndefined();
        });

        it('goes on the map straight away when asked to', () => {
            const map = testMap();
            const c = locationControl({ map, showWhenLocated: false });

            expect(c.isAttached).toBe(true);
        });

        it('does nothing when clicked, because there is nowhere to go', () => {
            const map = testMap();
            const c = locationControl({ map, showWhenLocated: false });
            const panTo = vi.spyOn(map, 'panTo').mockImplementation(() => {});
            c.element.click();

            expect(panTo).not.toHaveBeenCalled();
        });
    });

    describe('when a location is found', () => {
        it('goes on the map and remembers the position', () => {
            const map = testMap();
            const c = locationControl({ map });
            findLocation();

            expect(c.isAttached).toBe(true);
            expect(c.isLocated).toBe(true);
            expect(c.location?.latitude).toBe(40.73061);
        });

        it('shows the marker at the position', () => {
            const map = testMap();
            const c = locationControl({ map });
            findLocation();

            expect(c.marker?.position.lat).toBe(40.73061);
            expect(c.marker?.position.lng).toBe(-73.935242);
        });

        it('dispatches located', () => {
            const map = testMap();
            const located = vi.fn();
            const c = locationControl({ map });
            c.on('located', located);
            findLocation();

            expect(located).toHaveBeenCalledTimes(1);
        });

        it('leaves the map where it is by default', () => {
            const map = testMap();
            const panTo = vi.spyOn(map, 'panTo').mockImplementation(() => {});
            locationControl({ map });
            findLocation();

            expect(panTo).not.toHaveBeenCalled();
        });

        it('moves the map on the first fix when asked to', () => {
            const map = testMap();
            const panTo = vi.spyOn(map, 'panTo').mockImplementation(() => {});
            locationControl({ map, centerOnFirstFind: true });
            findLocation();

            expect(panTo).toHaveBeenCalledTimes(1);
        });
    });

    describe('on later fixes', () => {
        it('moves the marker but not the map', () => {
            const map = testMap();
            const panTo = vi.spyOn(map, 'panTo').mockImplementation(() => {});
            const c = locationControl({ map, centerOnFirstFind: true });
            findLocation();
            findLocation(41.5, -74.5);

            // Moving the map on every fix would yank it back while the user is panning
            expect(panTo).toHaveBeenCalledTimes(1);
            expect(c.marker?.position.lat).toBe(41.5);
        });

        it('does not add itself to the map a second time', () => {
            const map = testMap();
            const c = locationControl({ map });
            const added = vi.fn();
            c.on('add', added);
            findLocation();
            findLocation(41.5, -74.5);

            expect(added).toHaveBeenCalledTimes(1);
        });
    });

    describe('when the location cannot be found', () => {
        it('puts nothing on the map', () => {
            const map = testMap();
            const c = locationControl({ map });
            vi.spyOn(console, 'error').mockImplementation(() => {});
            deliverError?.({ code: 1, message: 'Permission denied' });

            expect(c.isAttached).toBe(false);
            expect(c.isLocated).toBe(false);
        });
    });

    describe('clicking', () => {
        it('pans to the location', () => {
            const map = testMap();
            const panTo = vi.spyOn(map, 'panTo').mockImplementation(() => {});
            const c = locationControl({ map });
            findLocation();
            c.element.click();

            expect(panTo).toHaveBeenCalledTimes(1);
        });

        it('centres instead when the action says so, and applies the zoom', () => {
            const map = testMap();
            const setCenter = vi.spyOn(map, 'setCenter').mockImplementation(() => {});
            const c = locationControl({ action: 'center', map, zoom: 15 });
            findLocation();
            c.element.click();

            expect(setCenter).toHaveBeenCalledTimes(1);
            expect(map.zoom).toBe(15);
        });
    });

    describe('when a fix arrives before the Google Maps library has loaded', () => {
        it('does not throw', () => {
            // The page asks for the location as soon as it loads, so a fix regularly arrives while
            // the Maps script is still being fetched. Setting the marker position synchronously
            // throws in that window - "The Google maps library is not available".
            uninstallGoogleMaps();

            const map = testMap();
            const c = locationControl({ map });

            expect(() => findLocation()).not.toThrow();
            expect(c.isLocated).toBe(true);
            expect(c.location?.latitude).toBe(40.73061);
        });
    });

    describe('the marker', () => {
        it('can be left out', () => {
            const map = testMap();
            const c = locationControl({ map, marker: false });
            findLocation();

            expect(c.marker).toBeUndefined();
            expect(c.isAttached).toBe(true);
        });

        it('uses one that was passed in, and does not own it', () => {
            const map = testMap();
            const mine = marker({ title: 'Mine' });
            const c = locationControl({ map, marker: mine });

            expect(c.marker).toBe(mine);
            expect(c.ownsMarker).toBe(false);
        });

        it('has no hover title unless one is asked for', () => {
            // A marker title shows as a tooltip on hover. The library inventing that wording would
            // make it the only user-visible text it supplies.
            expect(locationControl().marker?.title).toBeUndefined();
            expect(locationControl({ marker: { title: 'My location' } }).marker?.title).toBe('My location');
        });

        it('merges options over the default blue dot', () => {
            const c = locationControl({ marker: { title: 'You are here' } });
            expect(c.marker?.title).toBe('You are here');
            expect(c.ownsMarker).toBe(true);
        });
    });

    describe('locating', () => {
        it('starts watching by default', () => {
            locationControl({ map: testMap() });
            expect(watchCount).toBe(1);
        });

        it('does not start watching when autoLocate is off, but still reacts', () => {
            const map = testMap();
            const c = locationControl({ autoLocate: false, map });
            expect(watchCount).toBe(0);

            // Something else on the page starts locating
            map.locate();
            findLocation();

            expect(c.isLocated).toBe(true);
        });

        it('stops the watch it started when it is removed', () => {
            const map = testMap();
            const c = locationControl({ map });
            findLocation();
            c.remove();

            expect(clearedWatches).toHaveLength(1);
            expect(c.isAttached).toBe(false);
        });

        it('leaves a watch it did not start alone', () => {
            const map = testMap();
            map.locate();
            const c = locationControl({ map });
            findLocation();
            c.remove();

            // The rest of the page is still relying on those updates
            expect(clearedWatches).toHaveLength(0);
        });
    });

    describe('the map locate() fixes it depends on', () => {
        it('only starts one watch however many times locate() is called', () => {
            const map = testMap();
            map.locate();
            map.locate();
            map.locate();

            // Each call used to start another watch and lose the id of the one before
            expect(watchCount).toBe(1);
            expect(map.isLocating).toBe(true);
        });

        it('can start watching again after stopping', () => {
            const map = testMap();
            map.locate();
            map.stopLocate();
            expect(map.isLocating).toBe(false);

            map.locate();
            expect(watchCount).toBe(2);
        });

        it('is safe to stop twice', () => {
            const map = testMap();
            map.locate();
            map.stopLocate();
            map.stopLocate();

            // The second call used to hand a dead id to clearWatch()
            expect(clearedWatches).toHaveLength(1);
        });
    });

    describe('the factory', () => {
        it('gives back a LocationControl that was passed to it', () => {
            const c = new LocationControl();
            expect(locationControl(c)).toBe(c);
        });

        it('takes a position like any other control', () => {
            const c = locationControl({ position: ControlPosition.LEFT_BOTTOM });
            expect(c.position).toBe(ControlPosition.LEFT_BOTTOM);
        });
    });
});
