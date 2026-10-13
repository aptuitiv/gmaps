// @vitest-environment jsdom

/* ===========================================================================
    Tests for InfoWindow focus.

    Google moves focus into the info window itself when open() is given shouldFocus: true, so
    what's tested is what the library passes to open(). It defaults to true, and is never true
    for an info window shown on hover.
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { infoWindow } from '../src/lib/InfoWindow';
import { marker } from '../src/lib/Marker';
import { installGoogleMaps, mapsStats, uninstallGoogleMaps } from './support/googleMaps';
import { fakeMap } from './support/fakeMap';

/**
 * Let any pending promise callbacks run
 *
 * @returns {Promise<void>}
 */
const tick = async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
};

/**
 * The shouldFocus value passed to the last open() call
 *
 * @returns {boolean|undefined}
 */
const lastShouldFocus = (): boolean | undefined => {
    const calls = mapsStats.callsTo('InfoWindow', 'open');
    return calls[calls.length - 1]?.args[0]?.shouldFocus;
};

describe('InfoWindow focus', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
    });

    it('moves focus into the info window by default', async () => {
        await infoWindow('Trail 12').show(fakeMap());
        expect(lastShouldFocus()).toBe(true);
    });

    it('leaves focus alone with focus: false', async () => {
        await infoWindow({ content: 'Trail 12', focus: false }).show(fakeMap());
        expect(lastShouldFocus()).toBe(false);
    });

    it('never moves focus when shown on hover', async () => {
        const m = marker({ position: { lat: 48.85, lng: 2.35 } });
        m.attachInfoWindow('Trail 12', 'hover');
        await m.setMap(fakeMap());
        await tick();

        m.dispatch('mouseover', { latLng: { lat: 48.85, lng: 2.35 } });
        await tick();

        expect(mapsStats.callsTo('InfoWindow', 'open').length).toBeGreaterThan(0);
        expect(lastShouldFocus()).toBe(false);
    });

    it('moves focus when shown on click', async () => {
        const m = marker({ position: { lat: 48.85, lng: 2.35 } });
        m.attachInfoWindow('Trail 12', 'click');
        await m.setMap(fakeMap());
        await tick();

        m.dispatch('click', { latLng: { lat: 48.85, lng: 2.35 } });
        await tick();

        expect(lastShouldFocus()).toBe(true);
    });
});
