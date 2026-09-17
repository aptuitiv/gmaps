// @vitest-environment jsdom

/* ===========================================================================
    Tests for the ImageOverlay class, and for overlay resizing through it.

    ImageOverlay had no tests at all before this file.

    It's also the only sensible way to test resizing. Overlay.#handleResizeStart gives up
    unless the overlay has a map div and valid bounds (Overlay.ts:1025), and the base
    Overlay.getBounds() builds its bounds from two empty latLng() values, so a plain
    overlay() can never get past that check. ImageOverlay overrides getBounds() to return
    the bounds it was given, and it's the only class that overrides setBoundsFromResize()
    and updateBoundsFromResize(), so it's where the resize code actually does something.

    Two things about the harness are worth knowing before changing anything here.

    1. The projection is a stand-in (test/support/googleMaps.ts). It maps one degree to
       PIXELS_PER_DEGREE pixels, with latitude increasing upwards, so the numbers below are
       worked out from that rather than copied from a run.
    2. jsdom's getBoundingClientRect() returns zeros for everything. #handleResizeStart
       measures the overlay and the map div with it, so both are stubbed here. Without that
       the resize maths still runs, but every input is 0 and the assertions would prove
       nothing.
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { imageOverlay, ImageOverlay } from '../src/lib/ImageOverlay';
import { latLng } from '../src/lib/LatLng';
import { installGoogleMaps, uninstallGoogleMaps } from './support/googleMaps';
import { asFakeMap, fakeMap } from './support/fakeMap';

const imageUrl = 'https://example.com/overlay.png';

// A 10 by 10 degree square. With the stand-in projection that's 100 by 100 pixels.
const bounds = {
    sw: { lat: 0, lng: 0 },
    ne: { lat: 10, lng: 10 },
};

/**
 * Give an element a size and position, because jsdom reports zeros for everything
 *
 * @param {HTMLElement} element The element
 * @param {object} rect The values to report
 */
const setRect = (element: HTMLElement, rect: { left: number; top: number; width: number; height: number }): void => {
    vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
        left: rect.left,
        top: rect.top,
        right: rect.left + rect.width,
        bottom: rect.top + rect.height,
        width: rect.width,
        height: rect.height,
        x: rect.left,
        y: rect.top,
        toJSON: () => ({}),
    } as DOMRect);
};

/**
 * Dispatch a mouse event at a position
 *
 * @param {EventTarget} target The element or document to dispatch on
 * @param {string} type The event type
 * @param {number} x The clientX value
 * @param {number} y The clientY value
 */
const mouse = (target: EventTarget, type: string, x: number, y: number): void => {
    target.dispatchEvent(new MouseEvent(type, { clientX: x, clientY: y, bubbles: true, cancelable: true }));
};

describe('ImageOverlay', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
        vi.restoreAllMocks();
    });

    describe('building one', () => {
        it('takes the image url and the bounds as options', () => {
            const o = imageOverlay({ imageUrl, bounds });
            expect(o.getImageUrl()).toBe(imageUrl);
            expect(o.getBounds()?.getNorthEast()?.latitude).toBe(10);
            expect(o.getBounds()?.getSouthWest()?.longitude).toBe(0);
        });

        it('takes the image url and bounds as two arguments', () => {
            const o = imageOverlay(imageUrl, bounds);
            expect(o.getImageUrl()).toBe(imageUrl);
            expect(o.getBounds()?.getNorthEast()?.latitude).toBe(10);
        });

        it('returns the same object when the factory is given an ImageOverlay', () => {
            const o = imageOverlay({ imageUrl, bounds });
            expect(imageOverlay(o)).toBe(o);
        });

        it('is an Overlay, so it has the overlay element', () => {
            const o = imageOverlay({ imageUrl, bounds });
            expect(o).toBeInstanceOf(ImageOverlay);
            expect(o.getOverlayElement().tagName).toBe('DIV');
        });

        it('sizes the image to fill the overlay', () => {
            const o = imageOverlay({ imageUrl, bounds });
            expect(o.styles).toMatchObject({ height: '100%', width: '100%' });
        });

        it('takes an opacity', () => {
            const o = imageOverlay({ imageUrl, bounds, opacity: 0.5 });
            expect(o.getOpacity()).toBe(0.5);
        });
    });

    describe('resizing', () => {
        /**
         * Build an image overlay that is on a map and ready to be resized.
         *
         * The overlay is 100 by 100 pixels at the top left of a map div that fills the window,
         * which matches the 10 degree square in `bounds` under the stand-in projection.
         *
         * @returns {Promise<ImageOverlay>}
         */
        const showOverlay = async (): Promise<ImageOverlay> => {
            const map = fakeMap();
            const o = imageOverlay({ imageUrl, bounds });
            await o.setMap(map);

            setRect(asFakeMap(map).getDiv(), { left: 0, top: 0, width: 500, height: 500 });
            setRect(o.getOverlayElement(), { left: 0, top: 0, width: 100, height: 100 });
            o.enableResize();
            return o;
        };

        it('has a projection and a map div once it is on a map', async () => {
            const o = await showOverlay();
            // Both of these are what #handleResizeStart gives up without
            expect(o.getProjection()).toBeDefined();
            expect(o.getMap()?.getDiv()).toBeInstanceOf(HTMLElement);
        });

        it('starts a resize when a handle is pressed', async () => {
            const o = await showOverlay();
            const cb = vi.fn();
            o.onResizeStart(cb);

            const handle = o.getOverlayElement().querySelector('.resize-se') as HTMLElement;
            mouse(handle, 'mousedown', 100, 100);

            expect(cb).toHaveBeenCalledTimes(1);
            expect(o.resizeCorner).toBe('se');
        });

        it('remembers the corner and the size it started from', async () => {
            const o = await showOverlay();
            const handle = o.getOverlayElement().querySelector('.resize-se') as HTMLElement;
            mouse(handle, 'mousedown', 100, 100);

            expect(o.resizeStart.width).toBe(100);
            expect(o.resizeStart.height).toBe(100);
            expect(o.resizeStart.sePos).toEqual({ x: 100, y: 100 });
        });

        it('resizes the element when the mouse moves', async () => {
            const o = await showOverlay();
            const element = o.getOverlayElement();
            const handle = element.querySelector('.resize-se') as HTMLElement;

            mouse(handle, 'mousedown', 100, 100);
            // Drag the bottom right corner 20 pixels in, so the overlay loses 20 of each side
            mouse(document, 'mousemove', 80, 80);

            expect(element.style.width).toBe('80px');
            expect(element.style.height).toBe('80px');
        });

        it('says that it is being resized', async () => {
            const o = await showOverlay();
            const cb = vi.fn();
            o.onResize(cb);
            const handle = o.getOverlayElement().querySelector('.resize-se') as HTMLElement;

            mouse(handle, 'mousedown', 100, 100);
            mouse(document, 'mousemove', 90, 90);
            mouse(document, 'mousemove', 80, 80);

            expect(cb).toHaveBeenCalledTimes(2);
        });

        it('updates the bounds while it is resized', async () => {
            const o = await showOverlay();
            const before = o.getBounds()?.getSouthWest()?.latitude;
            const handle = o.getOverlayElement().querySelector('.resize-se') as HTMLElement;

            mouse(handle, 'mousedown', 100, 100);
            mouse(document, 'mousemove', 80, 80);

            // Dragging the bottom right corner up moves the southern edge north
            expect(o.getBounds()?.getSouthWest()?.latitude).not.toBe(before);
        });

        it('stops when the mouse is let go, and ignores anything after that', async () => {
            const o = await showOverlay();
            const end = vi.fn();
            o.onResizeEnd(end);
            const element = o.getOverlayElement();
            const handle = element.querySelector('.resize-se') as HTMLElement;

            mouse(handle, 'mousedown', 100, 100);
            mouse(document, 'mousemove', 80, 80);
            mouse(document, 'mouseup', 80, 80);

            expect(end).toHaveBeenCalledTimes(1);
            expect(o.resizeCorner).toBe('');

            // The document listeners are gone, so this resizes nothing
            mouse(document, 'mousemove', 20, 20);
            expect(element.style.width).toBe('80px');
        });

        it('does not resize while it is being dragged', async () => {
            const o = await showOverlay();
            const cb = vi.fn();
            o.onResizeStart(cb);
            o.enableDrag();

            // Start a drag, then press a resize handle without letting go
            mouse(o.getOverlayElement(), 'mousedown', 50, 50);
            const handle = o.getOverlayElement().querySelector('.resize-se') as HTMLElement;
            mouse(handle, 'mousedown', 100, 100);

            expect(cb).not.toHaveBeenCalled();
        });
    });

    /* -----------------------------------------------------------------------
        updateBoundsFromResize() on its own.

        resizeStart and resizeCorner are public, so each corner can be checked directly
        instead of staging a mouse sequence four times over. The method ends by sorting the
        corners so that north is north of south and east is east of west, which is what these
        assert - not the raw recombination it does first.
    ----------------------------------------------------------------------- */
    describe('working out the new bounds for each corner', () => {
        /**
         * Build an overlay with a resize already in progress from the 0,0 to 10,10 square
         *
         * @param {string} corner The corner being dragged
         * @returns {ImageOverlay}
         */
        const resizingFrom = (corner: string): ImageOverlay => {
            const o = imageOverlay({ imageUrl, bounds });
            o.resizeCorner = corner;
            o.resizeStart = {
                neBounds: latLng(10, 10),
                swBounds: latLng(0, 0),
                nwPos: { x: 0, y: 0 },
                sePos: { x: 100, y: 100 },
                left: 0,
                top: 0,
                width: 100,
                height: 100,
            };
            return o;
        };

        it('moves the north and west edges for the nw corner', () => {
            const o = resizingFrom('nw');
            o.updateBoundsFromResize(latLng(8, 2));

            expect(o.getBounds()?.getNorthEast()?.latitude).toBe(8);
            expect(o.getBounds()?.getNorthEast()?.longitude).toBe(10);
            expect(o.getBounds()?.getSouthWest()?.latitude).toBe(0);
            expect(o.getBounds()?.getSouthWest()?.longitude).toBe(2);
        });

        it('moves the north and east edges for the ne corner', () => {
            const o = resizingFrom('ne');
            o.updateBoundsFromResize(latLng(8, 12));

            expect(o.getBounds()?.getNorthEast()?.latitude).toBe(8);
            expect(o.getBounds()?.getNorthEast()?.longitude).toBe(12);
            expect(o.getBounds()?.getSouthWest()?.latitude).toBe(0);
            expect(o.getBounds()?.getSouthWest()?.longitude).toBe(0);
        });

        it('moves the south and west edges for the sw corner', () => {
            const o = resizingFrom('sw');
            o.updateBoundsFromResize(latLng(2, 3));

            expect(o.getBounds()?.getNorthEast()?.latitude).toBe(10);
            expect(o.getBounds()?.getNorthEast()?.longitude).toBe(10);
            expect(o.getBounds()?.getSouthWest()?.latitude).toBe(2);
            expect(o.getBounds()?.getSouthWest()?.longitude).toBe(3);
        });

        it('moves the south and east edges for the se corner', () => {
            const o = resizingFrom('se');
            o.updateBoundsFromResize(latLng(3, 7));

            expect(o.getBounds()?.getNorthEast()?.latitude).toBe(10);
            expect(o.getBounds()?.getNorthEast()?.longitude).toBe(7);
            expect(o.getBounds()?.getSouthWest()?.latitude).toBe(3);
            expect(o.getBounds()?.getSouthWest()?.longitude).toBe(0);
        });

        // The corners are sorted at the end, so dragging a corner past its opposite gives a
        // bounds the right way round rather than an inside out one.
        it('keeps north above south when a corner is dragged past the other side', () => {
            const o = resizingFrom('se');
            o.updateBoundsFromResize(latLng(15, 7));

            const north = o.getBounds()?.getNorthEast()?.latitude;
            const south = o.getBounds()?.getSouthWest()?.latitude;
            expect(north).toBeGreaterThan(south as number);
        });

        it('leaves the bounds alone for a corner it does not know', () => {
            const o = resizingFrom('middle');
            o.updateBoundsFromResize(latLng(5, 5));

            expect(o.getBounds()?.getNorthEast()?.latitude).toBe(10);
            expect(o.getBounds()?.getSouthWest()?.latitude).toBe(0);
        });
    });
});
