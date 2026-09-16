// @vitest-environment jsdom

/* ===========================================================================
    Tests for PlacesSearchBox, and for the init() race described in section 6.6.

    The race is narrower than the audit stated, and the two tests below pin down both
    halves of it.

    init() guards with `if (!isObject(this.#searchBox))`, then calls
    #createPlacesSearchBox(). That method has exactly one await before it assigns
    this.#searchBox:

        if (this.#options.bounds) { options.bounds = await this.#options.bounds.toGoogle(); }
        ...
        this.#searchBox = new google.maps.places.SearchBox(this.#input, options);

    So the outcome depends on whether a bounds option was set:

    - WITH bounds, the await yields. Two concurrent init() calls both pass the guard, both
      yield, and both then construct a SearchBox. Two widgets on one input, two sets of
      listeners, and duplicate billed Places requests.
    - WITHOUT bounds there is no await before the assignment, so the first call assigns
      synchronously and the second call's guard catches it.

    AutocompleteSearchBox has the same shape (it awaits its bounds the same way), so fixing
    one should fix both. The fix is to memoize the creation promise, which DataLayer already
    does correctly in #getGoogleData().
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { PlacesSearchBox, placesSearchBox } from '../src/lib/PlacesSearchBox';
import { LatLngBounds } from '../src/lib/LatLngBounds';
import { installGoogleMaps, mapsStats, uninstallGoogleMaps } from './support/googleMaps';

/**
 * Put an input on the page for the search box to attach to
 *
 * @param {string} id The element id
 * @returns {HTMLInputElement}
 */
const searchInput = (id = 'search'): HTMLInputElement => {
    const input = document.createElement('input');
    input.id = id;
    document.body.appendChild(input);
    return input;
};

const bounds: [number, number][] = [
    [48.8, 2.3],
    [48.9, 2.4],
];

describe('PlacesSearchBox', () => {
    beforeEach(() => {
        installGoogleMaps();
        document.body.innerHTML = '';
    });

    afterEach(() => {
        uninstallGoogleMaps();
        document.body.innerHTML = '';
    });

    describe('building one', () => {
        it('takes an input element', () => {
            const input = searchInput();
            expect(new PlacesSearchBox(input).input).toBe(input);
        });

        it('takes a selector for the input', () => {
            const input = searchInput('search');
            expect(new PlacesSearchBox('#search').input).toBe(input);
        });

        it('throws when the selector matches nothing', () => {
            expect(() => new PlacesSearchBox('#not-on-the-page')).toThrow(/was not found/);
        });

        it('takes an options object', () => {
            const input = searchInput();
            const box = new PlacesSearchBox({ input, bounds });
            expect(box.input).toBe(input);
            expect(box.getBounds()).toBeInstanceOf(LatLngBounds);
        });

        it('the factory builds one too', () => {
            const input = searchInput();
            expect(placesSearchBox(input)).toBeInstanceOf(PlacesSearchBox);
        });

        it('creates no Google object until init() is called', () => {
            const input = searchInput();
            const box = new PlacesSearchBox(input);
            expect(box.isInitialized()).toBe(false);
            expect(mapsStats.countOf('SearchBox')).toBe(0);
        });
    });

    describe('init', () => {
        it('creates one SearchBox', async () => {
            const box = new PlacesSearchBox(searchInput());
            await box.init();

            expect(box.isInitialized()).toBe(true);
            expect(mapsStats.countOf('SearchBox')).toBe(1);
        });

        it('creates nothing more when called again after it has finished', async () => {
            const box = new PlacesSearchBox(searchInput());
            await box.init();
            await box.init();
            await box.init();

            expect(mapsStats.countOf('SearchBox')).toBe(1);
        });

        it('passes the input to Google', async () => {
            const input = searchInput();
            const box = new PlacesSearchBox(input);
            await box.init();

            const created = mapsStats.callsTo('SearchBox', 'constructor')[0];
            expect(created.args[0]).toBe(input);
        });

        // Fixed in Phase 2. init() used to wrap its work in a promise with no reject path and
        // no .catch, so a failure escaped as an unhandled rejection and the promise never
        // settled - awaiting it hung forever rather than throwing.
        it('rejects when there is no input element', async () => {
            const box = new PlacesSearchBox();
            await expect(box.init()).rejects.toThrow(/input element must be set/);
        });
    });

    // Section 6.6, fixed in Phase 2. init() now memoizes its promise, so the work starts once
    // and every caller waits on the same promise however many times it is called.
    describe('two concurrent init() calls (6.6)', () => {
        it('build one SearchBox when a bounds option is set', async () => {
            const box = new PlacesSearchBox({ input: searchInput(), bounds });

            await Promise.all([box.init(), box.init()]);

            expect(mapsStats.countOf('SearchBox')).toBe(1);
        });

        it('build one when called three times', async () => {
            const box = new PlacesSearchBox({ input: searchInput(), bounds });

            await Promise.all([box.init(), box.init(), box.init()]);

            expect(mapsStats.countOf('SearchBox')).toBe(1);
        });

        it('build one when no bounds option is set', async () => {
            const box = new PlacesSearchBox(searchInput());

            await Promise.all([box.init(), box.init(), box.init()]);

            expect(mapsStats.countOf('SearchBox')).toBe(1);
        });

        // One widget means one set of listeners, which is what stops the duplicate billed
        // Places requests.
        it('register a single places_changed listener', async () => {
            const box = new PlacesSearchBox({ input: searchInput(), bounds });

            await Promise.all([box.init(), box.init()]);

            expect(mapsStats.callsTo('SearchBox', 'addListener')).toHaveLength(1);
        });

        // init() is declared async, so it wraps the memoized promise in a fresh one on every
        // call and the returned objects are never identical. What matters is that the work
        // behind them happens once, so that is what's asserted.
        it('start the work once however late the calls come in', async () => {
            const box = new PlacesSearchBox({ input: searchInput(), bounds });

            await box.init();
            expect(mapsStats.countOf('SearchBox')).toBe(1);

            // A call made well after the first one has finished still builds nothing more
            await box.init();
            await Promise.all([box.init(), box.init()]);
            expect(mapsStats.countOf('SearchBox')).toBe(1);
            expect(mapsStats.callsTo('SearchBox', 'addListener')).toHaveLength(1);
        });
    });

    describe('bounds', () => {
        it('is undefined until it is set', () => {
            expect(new PlacesSearchBox(searchInput()).getBounds()).toBeUndefined();
        });

        it('is stored as a LatLngBounds', () => {
            const box = new PlacesSearchBox(searchInput());
            box.bounds = bounds;
            expect(box.getBounds()).toBeInstanceOf(LatLngBounds);
        });
    });
});
