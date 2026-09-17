/* ===========================================================================
    Tests for the Geocode cache and dedupe (D-8).

    This is the only part of the performance plan that costs money rather than milliseconds, so
    these tests are about how many times Google is called, not how long anything takes. Every
    assertion on callsTo('Geocoder', 'geocode') is an assertion about a bill.

    The cache lives at module scope and is shared by every Geocode object, which is the point -
    two different objects asking for the same address should cost one lookup. It also means the
    cache survives between tests, so Geocode.clearCache() runs before each one.
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Geocode, geocode } from '../src/lib/Geocode';
import { installGoogleMaps, mapsStats, setGeocoderHandler, uninstallGoogleMaps } from './support/googleMaps';

/**
 * How many times Google was asked to geocode something
 *
 * @returns {number}
 */
const googleCalls = (): number => mapsStats.callsTo('Geocoder', 'geocode').length;

describe('Geocode caching and dedupe (D-8)', () => {
    beforeEach(() => {
        installGoogleMaps();
        Geocode.clearCache();
    });

    afterEach(() => {
        Geocode.clearCache();
        Geocode.cacheSize = 50;
        uninstallGoogleMaps();
    });

    describe('the shared Geocoder', () => {
        it('builds one Geocoder however many requests are made', async () => {
            await geocode({ address: 'One' }).geocode();
            await geocode({ address: 'Two' }).geocode();
            await geocode({ address: 'Three' }).geocode();

            expect(googleCalls()).toBe(3);
            expect(mapsStats.countOf('Geocoder')).toBe(1);
        });

        it('builds no Geocoder until something is geocoded', () => {
            geocode({ address: 'Nothing asked for yet' });
            expect(mapsStats.countOf('Geocoder')).toBe(0);
        });
    });

    describe('repeat requests', () => {
        it('calls Google once for the same address asked for twice', async () => {
            const first = await geocode({ address: 'Same place' }).geocode();
            const second = await geocode({ address: 'Same place' }).geocode();

            expect(googleCalls()).toBe(1);
            expect(second).toBe(first);
        });

        it('calls Google again for a different address', async () => {
            await geocode({ address: 'One place' }).geocode();
            await geocode({ address: 'Another place' }).geocode();

            expect(googleCalls()).toBe(2);
        });

        // The cache is shared, so two separate objects asking the same question cost one lookup.
        it('shares results between separate Geocode objects', async () => {
            const a = geocode({ address: 'Shared' });
            const b = geocode({ address: 'Shared' });

            const first = await a.geocode();
            const second = await b.geocode();

            expect(googleCalls()).toBe(1);
            expect(second).toBe(first);
        });

        it('treats fetch() the same way', async () => {
            await geocode({ address: 'Via fetch' }).fetch();
            await geocode({ address: 'Via fetch' }).fetch();

            expect(googleCalls()).toBe(1);
        });
    });

    // The case the promise-valued cache exists for: both requests are made before either answers.
    describe('concurrent requests', () => {
        it('calls Google once when the same address is asked for twice at the same time', async () => {
            const [first, second] = await Promise.all([
                geocode({ address: 'At once' }).geocode(),
                geocode({ address: 'At once' }).geocode(),
            ]);

            expect(googleCalls()).toBe(1);
            expect(second).toBe(first);
        });

        it('still calls Google once per distinct address', async () => {
            await Promise.all([
                geocode({ address: 'A' }).geocode(),
                geocode({ address: 'A' }).geocode(),
                geocode({ address: 'B' }).geocode(),
                geocode({ address: 'B' }).geocode(),
            ]);

            expect(googleCalls()).toBe(2);
        });
    });

    describe('what counts as the same request', () => {
        it('tells addresses apart from place ids and locations', async () => {
            await geocode({ address: 'Somewhere' }).geocode();
            await geocode({ placeId: 'Somewhere' }).geocode();
            await geocode({ location: [1, 2] }).geocode();

            expect(googleCalls()).toBe(3);
        });

        it('tells the same address apart by language and region', async () => {
            await geocode({ address: 'Paris' }).geocode();
            await geocode({ address: 'Paris', language: 'fr' }).geocode();
            await geocode({ address: 'Paris', region: 'fr' }).geocode();

            expect(googleCalls()).toBe(3);
        });

        it('tells the same address apart by component restrictions', async () => {
            await geocode({ address: 'Springfield' }).geocode();
            await geocode({ address: 'Springfield', componentRestrictions: { country: 'US' } }).geocode();

            expect(googleCalls()).toBe(2);
        });

        it('tells the same address apart by bounds', async () => {
            await geocode({ address: 'Bounded' }).geocode();
            await geocode({
                address: 'Bounded',
                bounds: [
                    [0, 0],
                    [1, 1],
                ],
            }).geocode();

            expect(googleCalls()).toBe(2);
        });

        it('treats the same location given in different forms as one request', async () => {
            await geocode({ location: [1, 2] }).geocode();
            await geocode({ location: { lat: 1, lng: 2 } }).geocode();

            expect(googleCalls()).toBe(1);
        });
    });

    describe('turning the cache off', () => {
        it('calls Google every time when cache is false', async () => {
            await geocode({ address: 'No cache', cache: false }).geocode();
            await geocode({ address: 'No cache', cache: false }).geocode();

            expect(googleCalls()).toBe(2);
        });

        // An object that opts out still shouldn't poison the cache for everyone else, but it
        // also shouldn't read from it.
        it('reads nothing from the cache when cache is false', async () => {
            await geocode({ address: 'Mixed' }).geocode();
            await geocode({ address: 'Mixed', cache: false }).geocode();

            expect(googleCalls()).toBe(2);
        });

        it('turns caching off everywhere when the size is 0', async () => {
            Geocode.cacheSize = 0;
            await geocode({ address: 'Off' }).geocode();
            await geocode({ address: 'Off' }).geocode();

            expect(googleCalls()).toBe(2);
        });
    });

    describe('the size cap', () => {
        it('drops the oldest entry once the cap is passed', async () => {
            Geocode.cacheSize = 2;

            await geocode({ address: 'First' }).geocode();
            await geocode({ address: 'Second' }).geocode();
            await geocode({ address: 'Third' }).geocode();
            expect(googleCalls()).toBe(3);

            // "First" was pushed out, so it has to be looked up again
            await geocode({ address: 'First' }).geocode();
            expect(googleCalls()).toBe(4);

            // "Third" is still held
            await geocode({ address: 'Third' }).geocode();
            expect(googleCalls()).toBe(4);
        });

        it('trims what is already held when the cap is lowered', async () => {
            await geocode({ address: 'One' }).geocode();
            await geocode({ address: 'Two' }).geocode();
            expect(googleCalls()).toBe(2);

            Geocode.cacheSize = 1;
            await geocode({ address: 'One' }).geocode();
            expect(googleCalls()).toBe(3);
        });

        it('ignores a nonsense size', () => {
            Geocode.cacheSize = 25;
            Geocode.cacheSize = -1;
            expect(Geocode.cacheSize).toBe(25);
            Geocode.cacheSize = Number.NaN;
            expect(Geocode.cacheSize).toBe(25);
        });
    });

    describe('clearCache', () => {
        it('empties the cache so the next request reaches Google', async () => {
            await geocode({ address: 'Cleared' }).geocode();
            expect(googleCalls()).toBe(1);

            Geocode.clearCache();
            await geocode({ address: 'Cleared' }).geocode();
            expect(googleCalls()).toBe(2);
        });
    });

    describe('failures', () => {
        // A failed lookup must not stay cached, or one bad response would be remembered for the
        // life of the page.
        it('does not keep a rejected lookup in the cache', async () => {
            setGeocoderHandler(() => ({ status: 'REQUEST_DENIED' }));
            await expect(geocode({ address: 'Denied' }).geocode()).rejects.toBe('REQUEST_DENIED');
            expect(googleCalls()).toBe(1);

            setGeocoderHandler(() => ({
                results: [{ formatted_address: 'Now it works', address_components: [], geometry: {} }],
                status: 'OK',
            }));
            const results = await geocode({ address: 'Denied' }).geocode();
            expect(googleCalls()).toBe(2);
            expect(results.hasResults()).toBe(true);
        });

        // Zero results is a real answer rather than a failure, so it is cached like any other.
        it('caches a zero-results answer', async () => {
            setGeocoderHandler(() => ({ status: 'ZERO_RESULTS' }));

            const first = await geocode({ address: 'Nowhere' }).geocode();
            expect(first.hasResults()).toBe(false);

            await geocode({ address: 'Nowhere' }).geocode();
            expect(googleCalls()).toBe(1);
        });
    });
});
