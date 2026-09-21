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

    describe('an element that is not a native button', () => {
        it('is given button semantics and made focusable', () => {
            const element = document.createElement('div');
            const b = button({ element });

            // A click listener is attached to whatever it is given, so a div that was inert before
            // is interactive now and has to be reachable and operable with a keyboard.
            expect(b.element.getAttribute('role')).toBe('button');
            expect(b.element.getAttribute('tabindex')).toBe('0');
        });

        it('activates on Enter and on Space', () => {
            const onClick = vi.fn();
            const b = button({ element: document.createElement('div'), onClick, toggle: true });

            b.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            expect(onClick).toHaveBeenCalledTimes(1);
            expect(b.active).toBe(true);

            b.element.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
            expect(onClick).toHaveBeenCalledTimes(2);
            expect(b.active).toBe(false);
        });

        it('stops Space scrolling the page', () => {
            const b = button({ element: document.createElement('div') });
            const event = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true });
            b.element.dispatchEvent(event);

            expect(event.defaultPrevented).toBe(true);
        });

        it('ignores other keys', () => {
            const onClick = vi.fn();
            const b = button({ element: document.createElement('div'), onClick });
            b.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));

            expect(onClick).not.toHaveBeenCalled();
        });

        it('does not activate on a key while disabled', () => {
            const onClick = vi.fn();
            const b = button({ element: document.createElement('div'), enabled: false, onClick });
            b.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

            expect(onClick).not.toHaveBeenCalled();
        });

        it('leaves a native button alone', () => {
            const b = button({ className: 'MyBtn' });

            // It is already focusable and already activates on Enter and Space
            expect(b.element.hasAttribute('role')).toBe(false);
            expect(b.element.hasAttribute('tabindex')).toBe(false);
        });

        it('leaves a link with an href alone', () => {
            const element = document.createElement('a');
            element.setAttribute('href', '/somewhere');
            const b = button({ element });

            expect(b.element.hasAttribute('role')).toBe(false);
            expect(b.element.hasAttribute('tabindex')).toBe(false);
        });

        it('keeps a role and tabindex the caller set', () => {
            const element = document.createElement('div');
            element.setAttribute('role', 'switch');
            element.setAttribute('tabindex', '-1');
            const b = button({ element });

            // They have said what they want it to be
            expect(b.element.getAttribute('role')).toBe('switch');
            expect(b.element.getAttribute('tabindex')).toBe('-1');
        });

        it('stops listening for keys once it is removed', () => {
            const element = document.createElement('div');
            const mapElement = document.createElement('div');
            mapElement.id = 'map1';
            document.body.appendChild(mapElement);
            const onClick = vi.fn();
            const b = button({ element, map: new Map('#map1'), onClick });

            b.remove();
            b.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

            expect(onClick).not.toHaveBeenCalled();
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

    describe('being taken off a map and put back', () => {
        it('still responds to clicks after being re-added', () => {
            const element = document.createElement('div');
            element.id = 'map1';
            document.body.appendChild(element);
            const map = new Map('#map1');
            const onClick = vi.fn();
            const b = button({ map, onClick });

            b.remove();
            b.addTo(map);
            b.element.click();

            expect(onClick).toHaveBeenCalledTimes(1);
        });

        it('still responds after being moved to another map', () => {
            ['map1', 'map2'].forEach((id) => {
                const el = document.createElement('div');
                el.id = id;
                document.body.appendChild(el);
            });
            const first = new Map('#map1');
            const second = new Map('#map2');
            const onClick = vi.fn();
            const b = button({ map: first, onClick });

            // Moving between maps goes through remove() internally
            b.addTo(second);
            b.element.click();

            expect(onClick).toHaveBeenCalledTimes(1);
        });

        it('still responds to the keyboard after being re-added', () => {
            const mapEl = document.createElement('div');
            mapEl.id = 'map1';
            document.body.appendChild(mapEl);
            const map = new Map('#map1');
            const onClick = vi.fn();
            const b = button({ element: document.createElement('div'), map, onClick });

            b.remove();
            b.addTo(map);
            b.element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

            expect(onClick).toHaveBeenCalledTimes(1);
        });

        it('does not end up firing twice', () => {
            const mapEl = document.createElement('div');
            mapEl.id = 'map1';
            document.body.appendChild(mapEl);
            const map = new Map('#map1');
            const onClick = vi.fn();
            const b = button({ map, onClick });

            // Re-adding must not stack a second listener on the same element
            b.addTo(map);
            b.remove();
            b.addTo(map);
            b.addTo(map);
            b.element.click();

            expect(onClick).toHaveBeenCalledTimes(1);
        });
    });

    describe('the factory', () => {
        it('gives back a Button that was passed to it', () => {
            const b = new Button();
            expect(button(b)).toBe(b);
        });
    });
});
