// @vitest-environment jsdom

/* ===========================================================================
    Tests for the Control class and Map.removeCustomControl().

    These cover the lifecycle that map.addCustomControl() on its own doesn't provide: taking a
    control off again, moving it between positions, and doing either before the map has rendered,
    while the controls are still queued.
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { control, Control } from '../src/lib/Control';
import { ControlPosition } from '../src/lib/constants';
import { Map } from '../src/lib/Map';
import { installGoogleMaps, uninstallGoogleMaps } from './support/googleMaps';

/**
 * Put an element on the page for a map to attach to
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

describe('Control', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    describe('the element', () => {
        it('builds one from the options, deciding nothing itself', () => {
            const c = control({
                attributes: { 'data-tip': 'Go home' },
                className: 'MyBtn MyBtn-home',
                content: '<svg></svg>',
                tag: 'button',
            });

            expect(c.element.tagName).toBe('BUTTON');
            expect(c.element.className).toBe('MyBtn MyBtn-home');
            expect(c.element.innerHTML).toBe('<svg></svg>');
            expect(c.element.getAttribute('data-tip')).toBe('Go home');
        });

        it('defaults to a div with nothing on it', () => {
            const c = control();
            expect(c.element.tagName).toBe('DIV');
            expect(c.element.className).toBe('');
            expect(c.element.innerHTML).toBe('');
        });

        it('takes content from a function, for markup worked out at build time', () => {
            const c = control({ content: () => '<span>built</span>' });
            expect(c.element.innerHTML).toBe('<span>built</span>');
        });

        it('appends an element that was passed as the content', () => {
            const icon = document.createElement('i');
            const c = control({ content: icon });
            expect(c.element.firstChild).toBe(icon);
        });

        it('uses an element that was passed, untouched', () => {
            const existing = document.createElement('aside');
            existing.className = 'TheSitesOwnClass';
            const c = control({ element: existing, className: 'ignored' });

            expect(c.element).toBe(existing);
            expect(c.element.className).toBe('TheSitesOwnClass');
        });

        it('finds an element from a selector', () => {
            const existing = document.createElement('div');
            existing.id = 'legend';
            document.body.appendChild(existing);

            expect(control({ element: '#legend' }).element).toBe(existing);
        });

        it('builds one instead when the selector matches nothing', () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const c = control({ element: '#not-on-the-page', className: 'Fallback' });

            expect(c.element.className).toBe('Fallback');
            expect(warn).toHaveBeenCalled();
        });
    });

    describe('attaching and removing', () => {
        it('is not attached until it is added', () => {
            const c = control();
            expect(c.isAttached).toBe(false);
            expect(c.map).toBeUndefined();
        });

        it('attaches through the map option', () => {
            mapElement();
            const m = new Map('#map1');
            const c = control({ map: m });

            expect(c.isAttached).toBe(true);
            expect(c.map).toBe(m);
        });

        it('removes itself from a map that has not rendered yet', () => {
            mapElement();
            const m = new Map('#map1');
            const c = control({ map: m });
            c.remove();

            expect(c.isAttached).toBe(false);
            // The queue is flushed when the map renders. Something left in it would appear on a map
            // it had already been taken off.
            expect(m.toGoogle()).toBeUndefined();
        });

        it('moves to another map rather than being on both', () => {
            mapElement('map1');
            mapElement('map2');
            const first = new Map('#map1');
            const second = new Map('#map2');
            const c = control({ map: first });
            c.addTo(second);

            expect(c.map).toBe(second);
        });

        it('dispatches add and remove', () => {
            mapElement();
            const m = new Map('#map1');
            const added = vi.fn();
            const removed = vi.fn();
            const c = control();
            c.on('add', added);
            c.on('remove', removed);

            c.addTo(m);
            c.remove();

            expect(added).toHaveBeenCalledTimes(1);
            expect(removed).toHaveBeenCalledTimes(1);
        });

        it('does nothing when removed twice', () => {
            mapElement();
            const m = new Map('#map1');
            const c = control({ map: m });
            c.remove();

            expect(() => c.remove()).not.toThrow();
            expect(c.isAttached).toBe(false);
        });

        it('warns rather than throwing when something that is not a map is passed', () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const c = control();
            // @ts-expect-error - deliberately passing the wrong type
            c.addTo({});

            expect(c.isAttached).toBe(false);
            expect(warn).toHaveBeenCalled();
        });
    });

    describe('position and order', () => {
        it('defaults to the top start corner', () => {
            expect(control().position).toBe(ControlPosition.BLOCK_START_INLINE_START);
        });

        it('takes the position from the options', () => {
            expect(control({ position: ControlPosition.LEFT_BOTTOM }).position).toBe(ControlPosition.LEFT_BOTTOM);
        });

        it('changes position while attached', () => {
            mapElement();
            const m = new Map('#map1');
            const c = control({ map: m, position: ControlPosition.LEFT_BOTTOM });
            c.position = ControlPosition.RIGHT_TOP;

            expect(c.position).toBe(ControlPosition.RIGHT_TOP);
            expect(c.isAttached).toBe(true);
        });

        it('warns and keeps the old position when given an invalid one', () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const c = control({ position: ControlPosition.LEFT_BOTTOM });
            // @ts-expect-error - deliberately passing an invalid value
            c.position = 'not a position';

            expect(c.position).toBe(ControlPosition.LEFT_BOTTOM);
            expect(warn).toHaveBeenCalled();
        });

        it('puts the order on the element, which is where Google reads it from', () => {
            const c = control({ index: 3 });
            expect((c.element as HTMLElement & { index?: number }).index).toBe(3);
            expect(c.index).toBe(3);

            c.index = -1;
            expect(c.index).toBe(-1);
        });

        it('defaults the order to 0', () => {
            expect(control().index).toBe(0);
        });
    });

    describe('the factory', () => {
        it('gives back a Control that was passed to it', () => {
            const c = new Control();
            expect(control(c)).toBe(c);
        });
    });
});
