// @vitest-environment jsdom

/* ===========================================================================
    Tests for the Overlay base class.

    This is the first file that needs a DOM, because Overlay builds its element in the
    constructor - which is O-1 in the plan, and the thing those tests are here to pin down.

    Tooltip, Popup, InfoWindow and ImageOverlay all extend this, so at the 2,595-segment
    scale in the plan every one of them pays the constructor cost below.
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Overlay, overlay } from '../src/lib/Overlay';
import { LatLng } from '../src/lib/LatLng';
import { installGoogleMaps, mapsStats, uninstallGoogleMaps } from './support/googleMaps';
import { fakeMap } from './support/fakeMap';

describe('Overlay', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
        vi.restoreAllMocks();
    });

    // O-1. The element is built in the constructor, whether or not the overlay is ever shown.
    describe('the DOM element is built in the constructor (O-1)', () => {
        it('creates a div before anything is shown', () => {
            const created = vi.spyOn(document, 'createElement');
            const o = overlay();
            expect(created).toHaveBeenCalledWith('div');
            expect(o.getOverlayElement()).toBeInstanceOf(HTMLElement);
            expect(o.getOverlayElement().tagName).toBe('DIV');
        });

        it('builds one element per overlay, none of them attached to the page', () => {
            const created = vi.spyOn(document, 'createElement');
            const overlays: Overlay[] = [];
            for (let i = 0; i < 100; i += 1) {
                overlays.push(overlay());
            }
            expect(created).toHaveBeenCalledTimes(100);
            // All 100 are detached, held only by their overlay object
            overlays.forEach((o) => {
                expect(o.getOverlayElement().parentElement).toBeNull();
            });
        });

        it('writes the three base styles up front', () => {
            const element = overlay().getOverlayElement();
            expect(element.style.position).toBe('absolute');
            expect(element.style.pointerEvents).toBe('auto');
            expect(element.style.zIndex).toBe('1000');
        });

        it('returns the same element every time', () => {
            const o = overlay();
            expect(o.getOverlayElement()).toBe(o.getOverlayElement());
        });

        it('creates no Google objects', () => {
            overlay();
            expect(mapsStats.countOf('OverlayView')).toBe(0);
        });
    });

    // O-11. The base constructor sets a [0, 0] offset, which allocates a Point that
    // subclasses (Tooltip, Popup) immediately replace with their own.
    describe('the default offset (O-11)', () => {
        it('defaults to 0, 0', () => {
            const o = overlay();
            expect(o.offset.x).toBe(0);
            expect(o.offset.y).toBe(0);
            expect(o.getOffset()).toBe(o.offset);
        });

        it('can be replaced, and ignores an invalid value', () => {
            const o = overlay();
            o.setOffset([4, 8]);
            expect(o.offset.x).toBe(4);
            expect(o.offset.y).toBe(8);

            o.setOffset('nonsense' as never);
            expect(o.offset.x).toBe(4);
        });
    });

    describe('class names', () => {
        it('adds one class or several separated by spaces', () => {
            const o = overlay();
            o.setClassName('tooltip');
            expect(o.className).toBe('tooltip');

            o.setClassName('a b');
            expect(o.getOverlayElement().classList.contains('a')).toBe(true);
            expect(o.getOverlayElement().classList.contains('b')).toBe(true);
        });

        it('removes class names', () => {
            const o = overlay();
            o.setClassName('a b');
            o.removeClassName('a');
            expect(o.getOverlayElement().classList.contains('a')).toBe(false);
            expect(o.getOverlayElement().classList.contains('b')).toBe(true);
        });

        it('clears the class name when set to null', () => {
            const o = overlay();
            o.setClassName('a');
            o.className = null as never;
            expect(o.className).toBe('');
        });
    });

    describe('styles', () => {
        it('writes a single style to the element and records it', () => {
            const o = overlay();
            o.style('color', 'red');
            expect(o.getOverlayElement().style.color).toBe('red');
            expect(o.styles).toMatchObject({ color: 'red' });
        });

        it('merges several styles', () => {
            const o = overlay();
            o.setStyles({ color: 'red', backgroundColor: 'blue' });
            expect(o.getOverlayElement().style.color).toBe('red');
            expect(o.getOverlayElement().style.backgroundColor).toBe('blue');
        });

        it('ignores a non-string value', () => {
            const o = overlay();
            o.style('color', 5 as never);
            expect(o.styles).not.toHaveProperty('color');
        });

        // O-8. style() has no dirty check, so writing the same value again still writes to the
        // DOM. That is why draw() call sites have had to add their own guards. When the dirty
        // check lands, repeated writes become no-ops - the recorded value here stays the same
        // either way, so this test documents the current shape rather than the cost.
        it('records the same value again when it has not changed (O-8)', () => {
            const o = overlay();
            o.style('color', 'red');
            o.style('color', 'red');
            expect(o.styles).toMatchObject({ color: 'red' });
        });
    });

    describe('position', () => {
        it('is undefined until it is set', () => {
            const o = overlay();
            expect(o.position).toBeUndefined();
            expect(o.hasPosition()).toBe(false);
        });

        it('takes any LatLng value', () => {
            const o = overlay();
            o.setPosition([1, 2]);
            expect(o.position).toBeInstanceOf(LatLng);
            expect(o.position!.lat).toBe(1);
            expect(o.hasPosition()).toBe(true);
        });

        it('clears when set to undefined', () => {
            const o = overlay();
            o.setPosition([1, 2]);
            o.setPosition(undefined);
            expect(o.position).toBeUndefined();
            expect(o.hasPosition()).toBe(false);
        });

        it('keeps the old position when an invalid value is passed', () => {
            const o = overlay();
            o.setPosition([1, 2]);
            o.setPosition([NaN, NaN] as never);
            expect(o.position!.lat).toBe(1);
        });

        // M2 in the overlay audit: the setter builds a new LatLng even when it was handed one.
        it('copies a LatLng that was passed in rather than holding on to it', () => {
            const o = overlay();
            const original = new LatLng(1, 2);
            o.setPosition(original);
            expect(o.position).not.toBe(original);
            expect(o.position!.lat).toBe(1);
        });
    });

    describe('showing and hiding', () => {
        it('hide() does nothing when the overlay was never shown', () => {
            const o = overlay();
            expect(() => o.hide()).not.toThrow();
            expect(o.isVisible).toBe(false);
        });

        it('show() builds the Google overlay view and attaches it to the map', async () => {
            const o = overlay();
            const map = fakeMap();
            await o.show(map);

            expect(o.isVisible).toBe(true);
            expect(o.getMap()).toBe(map);
            const attached = mapsStats.callsTo('OverlayView', 'setMap');
            expect(attached).toHaveLength(1);
            expect(attached[0].args[0]).toEqual({ __fakeGoogleMap: true });
        });

        it('show() dispatches the open event', async () => {
            const o = overlay();
            const cb = vi.fn();
            o.onOpen(cb);
            await o.show(fakeMap());
            expect(cb).toHaveBeenCalledTimes(1);
        });

        it('hide() detaches it once it has been shown', async () => {
            const o = overlay();
            await o.show(fakeMap());
            o.hide();

            expect(o.isVisible).toBe(false);
            expect(o.getMap()).toBeNull();
            const calls = mapsStats.callsTo('OverlayView', 'setMap');
            expect(calls[calls.length - 1].args[0]).toBeNull();
        });

        it('toggle() flips between the two', async () => {
            const o = overlay();
            const map = fakeMap();
            await o.show(map);
            expect(o.isVisible).toBe(true);

            o.toggle(map);
            expect(o.isVisible).toBe(false);
        });

        it('builds the overlay view only once across repeated shows', async () => {
            const o = overlay();
            const map = fakeMap();
            await o.show(map);
            await o.show(map);
            await o.show(map);
            // One view, attached three times
            expect(mapsStats.callsTo('OverlayView', 'setMap')).toHaveLength(3);
        });
    });

    describe('remove', () => {
        it('takes the element out of its parent', () => {
            const o = overlay();
            const parent = document.createElement('div');
            parent.appendChild(o.getOverlayElement());
            expect(o.getOverlayElement().parentElement).toBe(parent);

            o.remove();
            expect(o.getOverlayElement().parentElement).toBeNull();
        });

        it('is safe when the element has no parent', () => {
            expect(() => overlay().remove()).not.toThrow();
        });
    });
});

/*
    Not covered here.

    O-4: getOverlayViewClass() declares `class OverlayView extends google.maps.OverlayView`
    INSIDE the factory, so every overlay that is ever shown gets its own class object and its
    own prototype, which makes draw() megamorphic. The overlay view is held in a #private
    field with no accessor, so the distinct classes cannot be compared from outside. Hoisting
    the class to module scope is still worth doing - it just needs a different kind of check
    than a unit test, or a small internal accessor added alongside the fix.
*/
