// @vitest-environment jsdom

/* ===========================================================================
    Tests for Map.addInitHook().

    In a file of its own because the hooks are held statically and there is no way to remove one.
    A hook added by a test stays for the rest of the file, so keeping them here stops them from
    running against the maps that other test files build.
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Map } from '../src/lib/Map';
import { installGoogleMaps, uninstallGoogleMaps } from './support/googleMaps';

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

describe('Map.addInitHook()', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    it('runs for a map created after the hook was added', () => {
        mapElement();
        const hook = vi.fn();
        Map.addInitHook(hook);
        const m = new Map('#map1');

        expect(hook).toHaveBeenCalledTimes(1);
        // The map is passed as the argument and is also "this", so both styles of hook work
        expect(hook.mock.calls[0][0]).toBe(m);
        expect(hook.mock.instances[0]).toBe(m);
    });

    it('does not run for maps that already exist', () => {
        mapElement();
        const before = new Map('#map1');
        const hook = vi.fn();
        Map.addInitHook(hook);

        expect(hook).not.toHaveBeenCalled();
        expect(before).toBeDefined();
    });

    it('sees a map that has had its options applied', () => {
        mapElement();
        let zoomInsideHook: number | undefined;
        Map.addInitHook((m) => {
            zoomInsideHook = m.zoom;
        });
        new Map('#map1', { zoom: 14 });

        // The hook runs at the end of the constructor, so the options are already set
        expect(zoomInsideHook).toBe(14);
    });

    it('runs every hook, in the order they were added', () => {
        mapElement();
        const order: string[] = [];
        Map.addInitHook(() => order.push('first'));
        Map.addInitHook(() => order.push('second'));
        new Map('#map1');

        expect(order).toEqual(['first', 'second']);
    });

    it('keeps going when a hook throws, and still builds the map', () => {
        mapElement();
        const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
        const afterTheBadOne = vi.fn();
        Map.addInitHook(() => {
            throw new Error('plugin is broken');
        });
        Map.addInitHook(afterTheBadOne);

        const m = new Map('#map1');

        // One plugin failing must not stop the map being created or the other hooks running
        expect(m).toBeInstanceOf(Map);
        expect(afterTheBadOne).toHaveBeenCalledTimes(1);
        expect(consoleError).toHaveBeenCalled();
    });

    it('ignores anything that is not a function', () => {
        mapElement();
        // @ts-expect-error - deliberately passing the wrong type
        Map.addInitHook('not a function');
        expect(() => new Map('#map1')).not.toThrow();
    });
});
