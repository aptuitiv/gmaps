// @vitest-environment jsdom

/* ===========================================================================
    Tests for the Map class.

    These deliberately stop short of rendering. Showing a map runs #showMap(), which needs a
    real google.maps.Map, an element with layout, and the loader fetching the Google script.
    What is covered here is everything up to that point: the constructor, the option
    defaults, the accessors, and the fact that building a Map creates no Google objects.

    Section 6.2 - #setMapAsReady() dispatching READY before setting #isReady - is NOT covered.
    It only runs from inside the render path, so reaching it needs a faked google.maps.Map
    rather than the lightweight double. See the note at the end of the file.
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Map, map as mapFactory } from '../src/lib/Map';
import { LatLng } from '../src/lib/LatLng';
import { MapTypeId } from '../src/lib/constants';
import { installGoogleMaps, mapsStats, uninstallGoogleMaps } from './support/googleMaps';

/**
 * Put an element on the page for the map to attach to
 *
 * @param {string} id The element id
 * @returns {HTMLElement}
 */
const mapElement = (id = 'map1'): HTMLElement => {
    const element = document.createElement('div');
    element.id = id;
    document.body.appendChild(element);
    return element;
};

describe('Map', () => {
    beforeEach(() => {
        installGoogleMaps();
        document.body.innerHTML = '';
    });

    afterEach(() => {
        uninstallGoogleMaps();
        document.body.innerHTML = '';
    });

    describe('building a map', () => {
        // Note on getDiv(): it returns the GOOGLE map's div, and undefined until the map has
        // been rendered (Map.ts:1363-1368). It is not a way to read back the element that was
        // passed to the constructor - #element has no public accessor at all. So the element
        // and selector forms are not distinguishable from outside before the map renders.
        it('takes an HTMLElement', () => {
            const element = mapElement();
            expect(() => new Map(element)).not.toThrow();
        });

        it('takes a selector string', () => {
            mapElement('map1');
            expect(() => new Map('#map1')).not.toThrow();
        });

        it('builds without complaint when the selector matches nothing', () => {
            expect(() => new Map('#not-on-the-page')).not.toThrow();
        });

        it('getDiv() is undefined until the map has been rendered', () => {
            const element = mapElement();
            expect(new Map(element).getDiv()).toBeUndefined();
            expect(new Map('#map1').getDiv()).toBeUndefined();
            expect(new Map('#not-on-the-page').getDiv()).toBeUndefined();
        });

        it('the factory builds one too', () => {
            mapElement();
            expect(mapFactory('#map1')).toBeInstanceOf(Map);
        });
    });

    // A Map is a plain object until it is rendered. This is the absence assertion for the
    // map itself, and the reason all the other tests can build maps freely.
    describe('building a map creates no Google objects', () => {
        it('creates nothing on its own', () => {
            mapElement();
            new Map('#map1');
            expect(mapsStats.countOf('Map')).toBe(0);
        });

        it('creates nothing when options are passed', () => {
            mapElement();
            new Map('#map1', { center: [48.85, 2.35], zoom: 12 });
            expect(mapsStats.countOf('Map')).toBe(0);
        });

        it('creates nothing for 100 maps', () => {
            mapElement();
            for (let i = 0; i < 100; i += 1) {
                new Map('#map1');
            }
            expect(mapsStats.countOf('Map')).toBe(0);
        });

        it('is not ready until it has been rendered', () => {
            mapElement();
            expect(new Map('#map1').getIsReady()).toBe(false);
        });

        it('has no Google map object yet', () => {
            mapElement();
            expect(new Map('#map1').toGoogle()).toBeUndefined();
        });
    });

    describe('defaults', () => {
        it('centers on 0, 0 at zoom 6 on the roadmap type', () => {
            mapElement();
            const m = new Map('#map1');
            expect(m.center).toBeInstanceOf(LatLng);
            expect(m.center.lat).toBe(0);
            expect(m.center.lng).toBe(0);
            expect(m.zoom).toBe(6);
            expect(m.mapTypeId).toBe(MapTypeId.ROADMAP);
        });
    });

    describe('the center', () => {
        it('takes any LatLng value', () => {
            mapElement();
            const m = new Map('#map1');
            m.center = [48.85, 2.35];
            expect(m.center.lat).toBeCloseTo(48.85);
            expect(m.center.lng).toBeCloseTo(2.35);

            m.center = { lat: 1, lng: 2 };
            expect(m.center.lat).toBe(1);
        });

        it('keeps the old value when an invalid one is passed', () => {
            mapElement();
            const m = new Map('#map1');
            m.center = [48.85, 2.35];
            m.center = 'nonsense' as never;
            expect(m.center.lat).toBeCloseTo(48.85);
        });

        it('takes the center from the options', () => {
            mapElement();
            const m = new Map('#map1', { center: [10, 20] });
            expect(m.center.lat).toBe(10);
            expect(m.center.lng).toBe(20);
        });

        it('builds no Google LatLng until something needs one', () => {
            mapElement();
            const m = new Map('#map1', { center: [10, 20] });
            void m.center;
            expect(mapsStats.countOf('LatLng')).toBe(0);
        });
    });

    describe('events before the map is ready', () => {
        it('can register a listener without a Google map', () => {
            mapElement();
            const m = new Map('#map1');
            const cb = vi.fn();
            expect(() => m.on('click', cb)).not.toThrow();
            expect(m.hasListener('click')).toBe(true);
        });

        it('does not call a ready listener while the map is not ready', () => {
            mapElement();
            const m = new Map('#map1');
            const cb = vi.fn();
            m.onReady(cb);
            expect(cb).not.toHaveBeenCalled();
        });
    });

    describe('zoom and map type', () => {
        it('sets the zoom and reads it back', () => {
            mapElement();
            const m = new Map('#map1');
            m.zoom = 14;
            expect(m.zoom).toBe(14);
        });

        it('sets the map type and ignores an empty value', () => {
            mapElement();
            const m = new Map('#map1');
            m.mapTypeId = MapTypeId.SATELLITE;
            expect(m.mapTypeId).toBe(MapTypeId.SATELLITE);

            m.mapTypeId = '' as never;
            expect(m.mapTypeId).toBe(MapTypeId.SATELLITE);
        });
    });

    describe('the zoom limits', () => {
        it('default to null', () => {
            mapElement();
            const m = new Map('#map1');
            expect(m.maxZoom).toBeNull();
            expect(m.minZoom).toBeNull();
            expect(m.maxFitBoundsZoom).toBeNull();
            expect(m.minFitBoundsZoom).toBeNull();
        });

        it('take a number and can be cleared with null', () => {
            mapElement();
            const m = new Map('#map1');
            m.maxZoom = 18;
            m.minZoom = 4;
            expect(m.maxZoom).toBe(18);
            expect(m.minZoom).toBe(4);

            m.maxZoom = null;
            expect(m.maxZoom).toBeNull();
        });

        it('ignore values that are neither a number nor null', () => {
            mapElement();
            const m = new Map('#map1');
            m.maxZoom = 18;
            m.maxZoom = 'nonsense' as never;
            expect(m.maxZoom).toBe(18);
        });

        it('keep the fit-bounds limits separate from the map limits', () => {
            mapElement();
            const m = new Map('#map1');
            m.maxFitBoundsZoom = 16;
            expect(m.maxFitBoundsZoom).toBe(16);
            // Setting the fit-bounds limit does not touch the map's own max zoom
            expect(m.maxZoom).toBeNull();
        });
    });

    describe('when the map element cannot be found', () => {
        it('rejects show() rather than hanging', async () => {
            // #showMap() throws when the selector matched nothing, which rejects its promise. That
            // rejection had nowhere to go: show() has no reject, so it was left unsettled and the
            // error surfaced as an unhandled rejection instead of reaching the caller.
            const m = new Map('#no-such-element');

            await expect(m.show()).rejects.toThrow(/map element could not be found/);
        });
    });

    describe('when the map cannot be loaded', () => {
        it('rejects init() instead of never settling', async () => {
            mapElement();
            // No API key is set, so the loader rejects. init() used to have no reject at all: the
            // failure escaped as an unhandled rejection and the promise was left unsettled, so
            // anything awaiting the map waited for one that was never coming.
            const m = new Map('#map1');

            await expect(m.init()).rejects.toThrow(/API key/);
        });

        it('settles a second caller that started waiting during the same load', async () => {
            mapElement();
            const m = new Map('#map1');

            const first = m.init();
            // Started while the first is still running, so it takes the "already initializing"
            // path and waits for the ready event - which is never dispatched when the load fails
            const second = m.init();

            await expect(first).rejects.toThrow(/API key/);
            await expect(second).rejects.toThrow(/API key/);
        });

        it('can try again after a failed load', async () => {
            mapElement();
            const m = new Map('#map1');

            await expect(m.init()).rejects.toThrow(/API key/);
            // A second attempt has to start a fresh load rather than waiting on a "ready" event
            // that will never be dispatched
            await expect(m.init()).rejects.toThrow(/API key/);
        });

        it('logs rather than leaking an unhandled rejection from panTo()', async () => {
            mapElement();
            const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
            const m = new Map('#map1');

            // panTo() returns nothing, so there is no promise for the caller to catch
            expect(() => m.panTo([40.73061, -73.935242])).not.toThrow();
            await vi.waitFor(() => expect(consoleError).toHaveBeenCalled());
            expect(consoleError.mock.calls[0][0]).toContain('panTo()');
        });

        it('rejects fitBounds() instead of leaving it unsettled', async () => {
            mapElement();
            const m = new Map('#map1');

            // This one hands back a promise, so the failure belongs to the caller
            await expect(m.fitBounds([[40.7, -74.0], [40.8, -73.9]])).rejects.toThrow(/API key/);
        });
    });

    // Every Map allocates all six control objects in its constructor, whether or not the
    // caller ever touches them. That is the allocation side of P-4.
    describe('the controls', () => {
        it('exist on a brand new map', () => {
            mapElement();
            const m = new Map('#map1');
            expect(m.mapTypeControl).toBeDefined();
            expect(m.rotateControl).toBeDefined();
            expect(m.scaleControl).toBeDefined();
            expect(m.streetViewControl).toBeDefined();
        });

        it('are toggled by assigning a boolean', () => {
            mapElement();
            const m = new Map('#map1');
            m.scaleControl = true;
            expect(m.scaleControl.enabled).toBe(true);
            m.scaleControl = false;
            expect(m.scaleControl.enabled).toBe(false);
        });

        it('convert nothing to Google while the map is not rendered', () => {
            mapElement();
            const m = new Map('#map1');
            m.scaleControl = true;
            m.rotateControl = true;
            // The toGoogle() conversions only run inside `if (map)`, so nothing happens yet
            expect(mapsStats.countOf('Map')).toBe(0);
        });
    });

    describe('preventPageZoom', () => {
        it('is on by default', () => {
            mapElement();
            expect(new Map('#map1').preventPageZoom).toBe(true);
        });
    });
});

/*
    Still to do for the map, and why it is harder than the rest.

    Section 6.2: #setMapAsReady() dispatches MapEvents.READY on its first line but sets
    #isInitialized and #isReady on its last two, so getIsReady() returns false inside a ready
    handler. Marker.#setMap() branches on exactly that, so markers created during the ready
    dispatch take the slow onReady path for nothing.

    Reaching it needs #showMap() to run, which needs a real google.maps.Map with layout and a
    working projection - more than the lightweight double provides. The options are to fake
    google.maps.Map far more thoroughly in the stub, or to verify 6.2 in the browser on the
    stress page. The fix itself is a two-line reorder, so it is cheap either way; it is only
    the automated proof that is expensive.

    Also not covered: P-4/P-5 (the six control conversions and setter batching) and P-9
    (the center/zoom getters calling into Google), all of which only do their work once
    this.#map exists.
*/
