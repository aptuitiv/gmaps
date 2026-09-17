// @vitest-environment jsdom

/* ===========================================================================
    Tests for AutocompleteSearchBox.

    This class had no tests. They were added alongside the fix for init() remembering a
    failure: init() memoizes its promise so that the widget is only built once however many
    times it's called, but it used to keep hold of that promise even when it rejected. Since
    initializing throws when there's no input element, a first failed call poisoned every
    later one - setInput() followed by init() could never succeed.

    The memoizing itself has to keep working, so the tests below cover both sides: one
    Autocomplete however many times init() is called, and a retry that works after a failure.
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AutocompleteSearchBox, autocompleteSearchBox } from '../src/lib/AutocompleteSearchBox';
import { installGoogleMaps, mapsStats, uninstallGoogleMaps } from './support/googleMaps';

/**
 * Build an input element for the search box to attach to
 *
 * @returns {HTMLInputElement}
 */
const searchInput = (): HTMLInputElement => {
    const input = document.createElement('input');
    input.type = 'text';
    document.body.appendChild(input);
    return input;
};

describe('AutocompleteSearchBox', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
        document.body.innerHTML = '';
    });

    describe('building one', () => {
        it('takes an input element', () => {
            const box = new AutocompleteSearchBox(searchInput());
            expect(box).toBeInstanceOf(AutocompleteSearchBox);
            expect(box.isInitialized()).toBe(false);
        });

        it('the factory builds one too', () => {
            expect(autocompleteSearchBox(searchInput())).toBeInstanceOf(AutocompleteSearchBox);
        });

        it('creates no Google object until init() is called', () => {
            const box = new AutocompleteSearchBox(searchInput());
            expect(mapsStats.countOf('Autocomplete')).toBe(0);
        });
    });

    describe('init', () => {
        it('creates one Autocomplete', async () => {
            const box = new AutocompleteSearchBox(searchInput());
            await box.init();

            expect(box.isInitialized()).toBe(true);
            expect(mapsStats.countOf('Autocomplete')).toBe(1);
        });

        it('creates nothing more when called again after it has finished', async () => {
            const box = new AutocompleteSearchBox(searchInput());
            await box.init();
            await box.init();
            await box.init();

            expect(mapsStats.countOf('Autocomplete')).toBe(1);
        });

        it('builds one for several calls made at the same time', async () => {
            const box = new AutocompleteSearchBox(searchInput());

            await Promise.all([box.init(), box.init(), box.init()]);

            expect(mapsStats.countOf('Autocomplete')).toBe(1);
            expect(mapsStats.callsTo('Autocomplete', 'addListener')).toHaveLength(1);
        });

        it('passes the input to Google', async () => {
            const input = searchInput();
            const box = new AutocompleteSearchBox(input);
            await box.init();

            expect(mapsStats.callsTo('Autocomplete', 'constructor')[0].args[0]).toBe(input);
        });

        it('rejects when there is no input element', async () => {
            const box = new AutocompleteSearchBox();
            await expect(box.init()).rejects.toThrow(/input element must be set/);
        });
    });

    // A failed init() is not remembered, so the search box can be set up properly and tried
    // again. The rejected promise used to be kept, so every later init() failed the same way
    // however the input was fixed in between.
    describe('trying again after init() failed', () => {
        it('works once the input has been set', async () => {
            const box = new AutocompleteSearchBox();
            await expect(box.init()).rejects.toThrow(/input element must be set/);

            box.setInput(searchInput());
            await expect(box.init()).resolves.toBeUndefined();

            expect(box.isInitialized()).toBe(true);
            expect(mapsStats.countOf('Autocomplete')).toBe(1);
        });

        it('fails the same way again while the input is still missing', async () => {
            const box = new AutocompleteSearchBox();
            await expect(box.init()).rejects.toThrow(/input element must be set/);
            await expect(box.init()).rejects.toThrow(/input element must be set/);

            expect(mapsStats.countOf('Autocomplete')).toBe(0);
        });

        it('builds nothing more when a call is made after a successful one', async () => {
            const box = new AutocompleteSearchBox();
            await expect(box.init()).rejects.toThrow(/input element must be set/);

            box.setInput(searchInput());
            await box.init();
            await box.init();

            // Clearing the remembered failure must not let a second widget be built
            expect(mapsStats.countOf('Autocomplete')).toBe(1);
            expect(mapsStats.callsTo('Autocomplete', 'addListener')).toHaveLength(1);
        });

        it('lets several calls made together fail without building anything', async () => {
            const box = new AutocompleteSearchBox();

            const results = await Promise.allSettled([box.init(), box.init(), box.init()]);
            results.forEach((result) => {
                expect(result.status).toBe('rejected');
            });

            expect(mapsStats.countOf('Autocomplete')).toBe(0);
        });
    });
});
