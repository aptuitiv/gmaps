// @vitest-environment jsdom

/* ===========================================================================
    Tests for the Button class.

    The two behaviours worth guarding are the ones hand-rolled buttons get wrong: a disabled button
    that is still clickable, and disabling that leaves the active state behind.
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { button, Button } from '../src/lib/Button';
import { ControlPosition } from '../src/lib/constants';
import { Map } from '../src/lib/Map';
import { installGoogleMaps, uninstallGoogleMaps } from './support/googleMaps';

/**
 * The state mapping a layer toggle would use, in the site's own vocabulary
 */
const layerStates = {
    active: { attributes: { 'data-visible': 'yes' }, tooltip: 'Hide the layer' },
    disabled: { attributes: { 'data-loaded': 'no' }, tooltip: null },
    enabled: { attributes: { 'data-loaded': 'yes' } },
    inactive: { attributes: { 'data-visible': 'no' }, tooltip: 'Show the layer' },
};

describe('Button', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
        document.body.innerHTML = '';
        vi.restoreAllMocks();
    });

    describe('an action button', () => {
        it('builds a button element that will not submit a form', () => {
            const b = button({ className: 'MyBtn' });
            expect(b.element.tagName).toBe('BUTTON');
            expect(b.element.getAttribute('type')).toBe('button');
        });

        it('calls onClick and dispatches click', () => {
            const onClick = vi.fn();
            const listener = vi.fn();
            const b = button({ onClick });
            b.on('click', listener);
            b.element.click();

            expect(onClick).toHaveBeenCalledTimes(1);
            expect(onClick.mock.calls[0][0]).toBe(b);
            expect(listener).toHaveBeenCalledTimes(1);
        });

        it('does not flip active unless it is a toggle', () => {
            const b = button();
            b.element.click();
            expect(b.active).toBe(false);
            expect(b.element.hasAttribute('aria-pressed')).toBe(false);
        });

        it('works with no states at all', () => {
            const b = button();
            expect(() => b.activate()).not.toThrow();
            expect(b.active).toBe(true);
        });
    });

    describe('a stateful toggle', () => {
        it('applies the starting state when it is created, not just on the first change', () => {
            const b = button({ enabled: false, states: layerStates, toggle: true });

            expect(b.element.getAttribute('data-loaded')).toBe('no');
            expect(b.element.getAttribute('data-visible')).toBe('no');
            expect(b.element.getAttribute('aria-pressed')).toBe('false');
            expect(b.element.getAttribute('aria-disabled')).toBe('true');
        });

        it('flips active on click and applies the active style', () => {
            const changed = vi.fn();
            const b = button({ states: layerStates, toggle: true });
            b.onChange(changed);
            b.element.click();

            expect(b.active).toBe(true);
            expect(b.element.getAttribute('data-visible')).toBe('yes');
            expect(b.element.getAttribute('title')).toBe('Hide the layer');
            expect(b.element.getAttribute('aria-pressed')).toBe('true');
            expect(changed).toHaveBeenCalledWith(true, b);
        });

        it('does not fire click while disabled', () => {
            const onClick = vi.fn();
            const b = button({ enabled: false, onClick, states: layerStates, toggle: true });
            b.element.click();

            // The usual bug: the disabled state is styled to look like the button is gone, but the
            // listener is still bound, so an invisible button still does something.
            expect(onClick).not.toHaveBeenCalled();
            expect(b.active).toBe(false);
        });

        it('clears the active state when it is disabled', () => {
            const b = button({ states: layerStates, toggle: true });
            b.activate();
            expect(b.element.getAttribute('data-visible')).toBe('yes');

            b.disable();

            // The other usual bug: disabling sets a flag but leaves the button looking active while
            // the thing it controls has gone.
            expect(b.active).toBe(false);
            expect(b.element.getAttribute('data-visible')).toBe('no');
            expect(b.element.getAttribute('data-loaded')).toBe('no');
        });

        it('removes a tooltip when the state sets it to null', () => {
            const b = button({ states: layerStates, toggle: true });
            expect(b.element.getAttribute('title')).toBe('Show the layer');
            b.disable();
            expect(b.element.hasAttribute('title')).toBe(false);
        });

        it('writes the tooltip to a custom attribute when asked', () => {
            const b = button({ states: layerStates, toggle: true, tooltipAttribute: 'data-tip-right' });
            expect(b.element.getAttribute('data-tip-right')).toBe('Show the layer');
            expect(b.element.hasAttribute('title')).toBe(false);
        });

        it('swaps class names rather than accumulating them', () => {
            const b = button({
                states: { active: { className: 'is-on' }, inactive: { className: 'is-off' } },
                toggle: true,
            });
            expect(b.element.classList.contains('is-off')).toBe(true);

            b.element.click();
            expect(b.element.classList.contains('is-on')).toBe(true);
            expect(b.element.classList.contains('is-off')).toBe(false);
        });

        it('sets the text of a child element', () => {
            const element = document.createElement('button');
            element.innerHTML = '<span class="js-text">Show</span>';
            const b = button({
                element,
                states: {
                    active: { text: { selector: '.js-text', text: 'Hide' } },
                    inactive: { text: { selector: '.js-text', text: 'Show' } },
                },
                toggle: true,
            });

            b.activate();
            expect(b.element.querySelector('.js-text')?.textContent).toBe('Hide');
            b.deactivate();
            expect(b.element.querySelector('.js-text')?.textContent).toBe('Show');
        });

        it('does not dispatch change when set to the state it is already in', () => {
            const changed = vi.fn();
            const b = button({ toggle: true });
            b.onChange(changed);
            b.deactivate();

            expect(changed).not.toHaveBeenCalled();
        });
    });

    describe('wrapping an element the site rendered', () => {
        it('uses it as it is and still applies state to it', () => {
            const element = document.createElement('a');
            element.className = 'TheSitesClass';
            document.body.appendChild(element);

            const b = button({ element, states: { inactive: { className: 'is-off' } }, toggle: true });

            expect(b.element).toBe(element);
            expect(b.element.className).toBe('TheSitesClass is-off');
            // Not a <button>, so no type attribute is invented for it
            expect(b.element.hasAttribute('type')).toBe(false);
        });
    });

    describe('what it inherits from Control', () => {
        it('attaches to a map and comes off again', () => {
            const element = document.createElement('div');
            element.id = 'map1';
            document.body.appendChild(element);
            const m = new Map('#map1');
            const b = button({ map: m, position: ControlPosition.LEFT_BOTTOM });

            expect(b.isAttached).toBe(true);
            expect(b.position).toBe(ControlPosition.LEFT_BOTTOM);

            b.remove();
            expect(b.isAttached).toBe(false);
        });

        it('stops listening for clicks once it is removed', () => {
            const element = document.createElement('div');
            element.id = 'map1';
            document.body.appendChild(element);
            const onClick = vi.fn();
            const b = button({ map: new Map('#map1'), onClick });

            b.remove();
            b.element.click();

            expect(onClick).not.toHaveBeenCalled();
        });
    });

    describe('the factory', () => {
        it('gives back a Button that was passed to it', () => {
            const b = new Button();
            expect(button(b)).toBe(b);
        });
    });
});
