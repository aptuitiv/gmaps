// @vitest-environment jsdom

/* ===========================================================================
    Tests for tooltips and popups shown on hover (WCAG 1.4.13).

    - Shown for keyboard focus as well as the pointer, where there's an element that takes
      focus. Only the advanced marker has one.
    - The pointer can move onto the overlay: leaving the thing that showed it waits 100ms before
      hiding, and reaching the overlay cancels that.
    - Escape hides it, and it isn't shown again until the pointer or focus leaves.
    - role="tooltip", a stable id, and aria-describedby on the focused marker.

    Covers Tooltip, Popup and the data layer, which all go through hoverOverlay.ts.
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { advancedMarker } from '../src/lib/AdvancedMarker';
import { HOVER_HIDE_DELAY } from '../src/lib/constants';
import { dataLayer } from '../src/lib/DataLayer';
import { polyline } from '../src/lib/Polyline';
import { closeAllPopups, popup } from '../src/lib/Popup';
import { Tooltip } from '../src/lib/Tooltip';
import { installGoogleMaps, uninstallGoogleMaps } from './support/googleMaps';
import { fakeMap } from './support/fakeMap';

/**
 * Let any pending promise callbacks run
 *
 * @returns {Promise<void>}
 */
const tick = async () => {
    for (let i = 0; i < 6; i += 1) {
        await Promise.resolve();
    }
};

/**
 * Press a key
 *
 * @param {EventTarget} target Where the key is pressed
 * @param {string} key The key
 * @returns {KeyboardEvent}
 */
const press = (target: EventTarget, key: string): KeyboardEvent => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
    target.dispatchEvent(event);
    return event;
};

/**
 * Move focus onto or off an element the way the browser reports it
 *
 * @param {HTMLElement} element The element
 * @param {'focusin'|'focusout'} type The event
 * @param {EventTarget|null} [relatedTarget] Where focus came from or went to
 */
const focusEvent = (element: HTMLElement, type: 'focusin' | 'focusout', relatedTarget: EventTarget | null = null) => {
    element.dispatchEvent(new FocusEvent(type, { bubbles: true, relatedTarget }));
};

const latLng = { lat: 48.85, lng: 2.35 };

const path = [
    { lat: 48.85, lng: 2.35 },
    { lat: 48.86, lng: 2.36 },
];

/**
 * An advanced marker on a map with a tooltip attached, and its element on the page
 *
 * @param {string} [content] The tooltip content
 * @returns {Promise<object>}
 */
const markerWithTooltip = async (content: string = 'Trail 12') => {
    const m = advancedMarker({ position: [48.85, 2.35] });
    await m.setMap(fakeMap());
    const t = m.attachTooltip(content);
    await tick();
    const element = m.toGoogleSync() as unknown as HTMLElement;
    document.body.appendChild(element);
    return { element, m, t };
};

describe('hover overlays', () => {
    beforeEach(() => {
        installGoogleMaps();
        vi.useFakeTimers();
    });

    afterEach(() => {
        // Anything left showing would answer the next test's Escape
        Tooltip.clearShared();
        closeAllPopups();
        press(document, 'Escape');
        document.body.innerHTML = '';
        vi.useRealTimers();
        uninstallGoogleMaps();
    });

    describe('keyboard focus', () => {
        it('shows the tooltip when the advanced marker takes focus', async () => {
            const { element, t } = await markerWithTooltip();
            focusEvent(element, 'focusin');
            expect(t.isVisible).toBe(true);
        });

        it('shows it at the marker position', async () => {
            const { element, t } = await markerWithTooltip();
            focusEvent(element, 'focusin');
            expect(t.getPosition()?.lat).toBe(48.85);
            expect(t.getPosition()?.lng).toBe(2.35);
        });

        it('hides it when focus leaves', async () => {
            const { element, t } = await markerWithTooltip();
            focusEvent(element, 'focusin');
            focusEvent(element, 'focusout');
            expect(t.isVisible).toBe(false);
        });

        it('keeps it while focus moves to something inside the marker', async () => {
            const { element, t } = await markerWithTooltip();
            const inner = document.createElement('span');
            element.appendChild(inner);
            focusEvent(element, 'focusin');
            focusEvent(element, 'focusout', inner);
            expect(t.isVisible).toBe(true);
        });

        it('shows a hover popup for focus too', async () => {
            const m = advancedMarker({ position: [48.85, 2.35] });
            await m.setMap(fakeMap());
            const p = m.attachPopup('Trail 12', 'hover');
            await tick();
            const element = m.toGoogleSync() as unknown as HTMLElement;
            focusEvent(element, 'focusin');
            expect(p.isVisible).toBe(true);
            // A hover popup never takes focus
            expect(document.activeElement).toBe(document.body);
        });
    });

    describe('semantics', () => {
        it("gives the tooltip role='tooltip'", async () => {
            const { element, t } = await markerWithTooltip();
            focusEvent(element, 'focusin');
            t.add({ floatPane: document.body } as unknown as google.maps.MapPanes);
            expect(t.getOverlayElement().getAttribute('role')).toBe('tooltip');
        });

        it('points aria-describedby at the tooltip while the marker has focus', async () => {
            const { element, t } = await markerWithTooltip();
            focusEvent(element, 'focusin');
            const id = t.getOverlayElement().id;
            expect(id).not.toBe('');
            expect(element.getAttribute('aria-describedby')).toBe(id);

            focusEvent(element, 'focusout');
            expect(element.hasAttribute('aria-describedby')).toBe(false);
        });

        it('keeps a description the marker already had', async () => {
            const { element, t } = await markerWithTooltip();
            element.setAttribute('aria-describedby', 'other');
            focusEvent(element, 'focusin');
            expect(element.getAttribute('aria-describedby')).toBe(`other ${t.getOverlayElement().id}`);
            focusEvent(element, 'focusout');
            expect(element.getAttribute('aria-describedby')).toBe('other');
        });

        // Otherwise screen readers read it twice
        it('does not describe the marker when the tooltip says the same as its name', async () => {
            const { element } = await markerWithTooltip('Trail 12');
            element.setAttribute('aria-label', 'Trail 12');
            focusEvent(element, 'focusin');
            expect(element.hasAttribute('aria-describedby')).toBe(false);
        });

        it('the shared tooltip keeps one id for everything that shares it', async () => {
            const first = await markerWithTooltip('First');
            const second = await markerWithTooltip('Second');
            expect(first.t).toBe(second.t);

            focusEvent(first.element, 'focusin');
            const id = first.t.getOverlayElement().id;
            focusEvent(first.element, 'focusout');
            focusEvent(second.element, 'focusin');
            expect(second.element.getAttribute('aria-describedby')).toBe(id);
        });
    });

    describe('the pointer can move onto it', () => {
        it('waits before hiding when the pointer leaves the marker', async () => {
            const { m, t } = await markerWithTooltip();
            m.dispatch('mouseover', { latLng });
            m.dispatch('mouseout', {});
            expect(t.isVisible).toBe(true);
            vi.advanceTimersByTime(HOVER_HIDE_DELAY);
            expect(t.isVisible).toBe(false);
        });

        it('stays while the pointer is on the tooltip', async () => {
            const { m, t } = await markerWithTooltip();
            m.dispatch('mouseover', { latLng });
            m.dispatch('mouseout', {});
            t.getOverlayElement().dispatchEvent(new MouseEvent('mouseenter'));
            vi.advanceTimersByTime(HOVER_HIDE_DELAY * 5);
            expect(t.isVisible).toBe(true);
        });

        it('hides once the pointer leaves the tooltip', async () => {
            const { m, t } = await markerWithTooltip();
            m.dispatch('mouseover', { latLng });
            m.dispatch('mouseout', {});
            t.getOverlayElement().dispatchEvent(new MouseEvent('mouseenter'));
            t.getOverlayElement().dispatchEvent(new MouseEvent('mouseleave'));
            vi.advanceTimersByTime(HOVER_HIDE_DELAY);
            expect(t.isVisible).toBe(false);
        });

        it('stays when the pointer comes back to the marker in time', async () => {
            const { m, t } = await markerWithTooltip();
            m.dispatch('mouseover', { latLng });
            m.dispatch('mouseout', {});
            vi.advanceTimersByTime(HOVER_HIDE_DELAY / 2);
            m.dispatch('mouseover', { latLng });
            vi.advanceTimersByTime(HOVER_HIDE_DELAY * 5);
            expect(t.isVisible).toBe(true);
        });

        it('a hover popup waits the same way', async () => {
            const line = polyline({ path });
            const p = line.attachPopup('Trail 12', 'hover');
            await line.setMap(fakeMap());
            await tick();
            line.dispatch('mouseover', { latLng });
            await tick();
            line.dispatch('mouseout', {});
            expect(p.isVisible).toBe(true);
            vi.advanceTimersByTime(HOVER_HIDE_DELAY);
            expect(p.isVisible).toBe(false);
        });

        it('leaving a tooltip shown by a click does not hide it', async () => {
            const line = polyline({ path });
            const t = line.attachTooltip('Trail 12', 'click', { shared: false });
            await line.setMap(fakeMap());
            await tick();
            line.dispatch('click', { latLng });
            t.getOverlayElement().dispatchEvent(new MouseEvent('mouseleave'));
            vi.advanceTimersByTime(HOVER_HIDE_DELAY * 5);
            expect(t.isVisible).toBe(true);
        });
    });

    describe('Escape', () => {
        it('hides the tooltip', async () => {
            const { m, t } = await markerWithTooltip();
            m.dispatch('mouseover', { latLng });
            const event = press(document.body, 'Escape');
            expect(t.isVisible).toBe(false);
            expect(event.defaultPrevented).toBe(true);
        });

        it('does not show it again until the pointer leaves the marker', async () => {
            const { m, t } = await markerWithTooltip();
            m.dispatch('mouseover', { latLng });
            press(document.body, 'Escape');
            m.dispatch('mouseover', { latLng });
            expect(t.isVisible).toBe(false);

            m.dispatch('mouseout', {});
            m.dispatch('mouseover', { latLng });
            expect(t.isVisible).toBe(true);
        });

        it('does not show it again until focus leaves the marker', async () => {
            const { element, t } = await markerWithTooltip();
            focusEvent(element, 'focusin');
            press(element, 'Escape');
            expect(t.isVisible).toBe(false);
            expect(element.hasAttribute('aria-describedby')).toBe(false);
            focusEvent(element, 'focusin');
            expect(t.isVisible).toBe(false);

            focusEvent(element, 'focusout');
            focusEvent(element, 'focusin');
            expect(t.isVisible).toBe(true);
        });

        it('a dismissed marker does not stop another one showing it', async () => {
            const first = await markerWithTooltip('First');
            const second = await markerWithTooltip('Second');
            first.m.dispatch('mouseover', { latLng });
            press(document.body, 'Escape');
            second.m.dispatch('mouseover', { latLng });
            expect(second.t.isVisible).toBe(true);
        });

        // One press takes the hover content away. The next reaches the popup.
        it('hides the tooltip before closing a popup opened by a click', async () => {
            const p = popup({ content: 'Details', fit: false });
            await p.show(fakeMap());
            const { m, t } = await markerWithTooltip();
            m.dispatch('mouseover', { latLng });

            press(document.body, 'Escape');
            expect(t.isVisible).toBe(false);
            expect(p.isOpen()).toBe(true);

            press(document.body, 'Escape');
            expect(p.isOpen()).toBe(false);
        });

        // The listener is in the capture phase, so it runs before anything on the page can stop
        // the key event. That's also what puts it ahead of Popup's own Escape listener.
        it('still works when something on the page stops Escape from bubbling', async () => {
            const { m, t } = await markerWithTooltip();
            const stopper = document.createElement('div');
            document.body.appendChild(stopper);
            stopper.addEventListener('keydown', (e) => e.stopPropagation());
            m.dispatch('mouseover', { latLng });
            press(stopper, 'Escape');
            expect(t.isVisible).toBe(false);
        });

        it('does nothing when no hover overlay is showing', async () => {
            const { m } = await markerWithTooltip();
            m.dispatch('mouseover', { latLng });
            m.dispatch('mouseout', {});
            vi.advanceTimersByTime(HOVER_HIDE_DELAY);
            const event = press(document.body, 'Escape');
            expect(event.defaultPrevented).toBe(false);
        });

        it('hides a hover popup', async () => {
            const line = polyline({ path });
            const p = line.attachPopup('Trail 12', 'hover');
            await line.setMap(fakeMap());
            await tick();
            line.dispatch('mouseover', { latLng });
            await tick();
            press(document.body, 'Escape');
            expect(p.isVisible).toBe(false);
        });

        // A map tooltip follows the cursor on mousemove. It mustn't come straight back.
        it('a map tooltip stays hidden while the pointer keeps moving', async () => {
            const map = fakeMap();
            const t = map.attachTooltip('Somewhere', 'hover', { shared: false });
            await tick();
            map.dispatch('mouseover', { latLng });
            press(document.body, 'Escape');
            map.dispatch('mousemove', { latLng });
            expect(t.isVisible).toBe(false);
        });
    });

    describe('data layer', () => {
        /**
         * A data layer on a map with a tooltip, and a feature to hover
         *
         * @returns {Promise<object>}
         */
        const layerWithTooltip = async () => {
            const map = fakeMap();
            const layer = dataLayer({ map });
            const t = layer.attachTooltip('Feature');
            await tick();
            const feature = new google.maps.Data.Feature({ id: 1 });
            const event = { feature, latLng: new google.maps.LatLng(48.85, 2.35), domEvent: {} };
            return { event, layer, t };
        };

        it('waits before hiding when the pointer leaves a feature', async () => {
            const { event, layer, t } = await layerWithTooltip();
            layer.dispatch('mouseover', event);
            layer.dispatch('mouseout', event);
            expect(t.isVisible).toBe(true);
            vi.advanceTimersByTime(HOVER_HIDE_DELAY);
            expect(t.isVisible).toBe(false);
        });

        it('Escape hides it until the pointer leaves the feature', async () => {
            const { event, layer, t } = await layerWithTooltip();
            layer.dispatch('mouseover', event);
            press(document.body, 'Escape');
            expect(t.isVisible).toBe(false);
            layer.dispatch('mouseover', event);
            expect(t.isVisible).toBe(false);

            layer.dispatch('mouseout', event);
            layer.dispatch('mouseover', event);
            expect(t.isVisible).toBe(true);
        });
    });
});
