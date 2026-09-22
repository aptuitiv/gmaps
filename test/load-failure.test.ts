// @vitest-environment jsdom

/* ===========================================================================
    What happens to everything waiting on the map when the Google Maps library can't be loaded.

    These all used to wait on the loader's "map_load" event, which is only ever dispatched on
    success. A failed load left them waiting forever: no error, no rejection, nothing drawn, and
    nothing to say why.
=========================================================================== */

import { describe, expect, it, vi } from 'vitest';
import { Map } from '../src/lib/Map';
import { marker } from '../src/lib/Marker';
import { polyline } from '../src/lib/Polyline';
import { latLngBounds } from '../src/lib/LatLngBounds';

/**
 * Make a map on a real element, with no Google Maps library loaded and no API key, so that any
 * attempt to load fails
 *
 * @param {string} id The element id
 * @returns {Map}
 */
const unloadableMap = (id: string): Map => {
    const element = document.createElement('div');
    element.id = id;
    document.body.appendChild(element);
    return new Map(`#${id}`);
};

/**
 * Fail the test if the promise hasn't settled shortly
 *
 * @param {Promise<unknown>} promise The promise to watch
 * @returns {Promise<string>}
 */
const settlesQuickly = (promise: Promise<unknown>): Promise<string> =>
    Promise.race([
        promise.then(() => 'resolved').catch(() => 'rejected'),
        new Promise<string>((resolve) => {
            setTimeout(() => resolve('HUNG'), 300);
        }),
    ]);

describe('when the Google Maps library cannot be loaded', () => {
    it('tells a marker rather than leaving it waiting', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        const map = unloadableMap('map-marker');

        await expect(settlesQuickly(marker().show(map))).resolves.toBe('rejected');
    });

    it('tells a polyline rather than leaving it waiting', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        const map = unloadableMap('map-polyline');

        await expect(settlesQuickly(polyline({ path: [[1, 2]] }).show(map))).resolves.toBe('rejected');
    });

    it('tells latLngBounds rather than leaving it waiting', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        const map = unloadableMap('map-bounds');
        // Something has to be loading for the failure to reach the loader
        map.init().catch(() => {});

        await expect(settlesQuickly(latLngBounds([[1, 2]]).toGoogle())).resolves.toBe('rejected');
    });
});
