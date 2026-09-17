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

    // O-1, done. The element is built the first time something needs it, not in the constructor.
    // These tests used to say the opposite - they were written to pin down what O-1 cost.
    describe('the DOM element is built when it is first needed (O-1)', () => {
        it('creates nothing when the overlay is built', () => {
            const created = vi.spyOn(document, 'createElement');
            overlay();
            expect(created).not.toHaveBeenCalled();
        });

        it('builds no elements for 100 overlays that are never used', () => {
            const created = vi.spyOn(document, 'createElement');
            const overlays: Overlay[] = [];
            for (let i = 0; i < 100; i += 1) {
                overlays.push(overlay());
            }
            expect(overlays).toHaveLength(100);
            expect(created.mock.calls.filter((c) => c[0] === 'div')).toHaveLength(0);
        });

        it('builds one, and only one, when the element is read', () => {
            const created = vi.spyOn(document, 'createElement');
            const o = overlay();
            expect(o.getOverlayElement()).toBeInstanceOf(HTMLElement);
            expect(o.getOverlayElement().tagName).toBe('DIV');
            expect(created.mock.calls.filter((c) => c[0] === 'div')).toHaveLength(1);
        });

        it('writes the three base styles when it builds it', () => {
            const element = overlay().getOverlayElement();
            expect(element.style.position).toBe('absolute');
            expect(element.style.pointerEvents).toBe('auto');
            expect(element.style.zIndex).toBe('1000');
        });

        it('returns the same element every time', () => {
            const o = overlay();
            expect(o.getOverlayElement()).toBe(o.getOverlayElement());
        });

        it('is not attached to the page when it is built', () => {
            expect(overlay().getOverlayElement().parentElement).toBeNull();
        });

        it('creates no Google objects', () => {
            overlay();
            expect(mapsStats.countOf('OverlayView')).toBe(0);
        });
    });

    /* -----------------------------------------------------------------------
        Anything set before the element exists has to end up on it once it's built, or a lazy
        overlay would look different from an eager one. Class names and styles are both kept
        on the overlay itself and replayed by #element().
    ----------------------------------------------------------------------- */
    describe('what was set before the element existed (O-1)', () => {
        it('reads the class name back without building an element', () => {
            const created = vi.spyOn(document, 'createElement');
            const o = overlay();
            o.setClassName('tooltip');
            expect(o.className).toBe('tooltip');
            expect(created.mock.calls.filter((c) => c[0] === 'div')).toHaveLength(0);
        });

        it('puts the class names on the element when it is built', () => {
            const o = overlay();
            o.setClassName('a b');
            const element = o.getOverlayElement();
            expect(element.classList.contains('a')).toBe(true);
            expect(element.classList.contains('b')).toBe(true);
        });

        it('adds to the class names rather than replacing them, the same as before', () => {
            const o = overlay();
            o.setClassName('a');
            o.setClassName('b');
            expect(o.className).toBe('a b');

            const element = o.getOverlayElement();
            expect(element.classList.contains('a')).toBe(true);
            expect(element.classList.contains('b')).toBe(true);
        });

        it('leaves out a class name that was removed before the element was built', () => {
            const created = vi.spyOn(document, 'createElement');
            const o = overlay();
            o.setClassName('a b');
            o.removeClassName('a');
            expect(created.mock.calls.filter((c) => c[0] === 'div')).toHaveLength(0);

            const element = o.getOverlayElement();
            expect(element.classList.contains('a')).toBe(false);
            expect(element.classList.contains('b')).toBe(true);
        });

        it('puts the styles on the element when it is built', () => {
            const o = overlay();
            o.style('color', 'red');
            o.setStyles({ backgroundColor: 'blue' });
            const element = o.getOverlayElement();
            expect(element.style.color).toBe('red');
            expect(element.style.backgroundColor).toBe('blue');
        });

        it('records styles without building an element', () => {
            const created = vi.spyOn(document, 'createElement');
            const o = overlay();
            o.style('color', 'red');
            expect(o.styles).toMatchObject({ color: 'red' });
            expect(created.mock.calls.filter((c) => c[0] === 'div')).toHaveLength(0);
        });

        it('still writes styles straight to the element once it exists', () => {
            const o = overlay();
            const element = o.getOverlayElement();
            o.style('color', 'green');
            expect(element.style.color).toBe('green');
        });

        it('clears the class names when set to null, before the element is built', () => {
            const o = overlay();
            o.setClassName('a b');
            o.className = null as never;
            expect(o.className).toBe('');
            expect(o.getOverlayElement().className).toBe('');
        });

        it('removes nothing, and builds nothing, for a class that was never added', () => {
            const created = vi.spyOn(document, 'createElement');
            const o = overlay();
            expect(() => o.removeClassName('nope')).not.toThrow();
            expect(created.mock.calls.filter((c) => c[0] === 'div')).toHaveLength(0);
        });

        // remove() is called by Google through onRemove(), so it has to be safe for an overlay
        // that never drew anything.
        it('removing an overlay that was never built does nothing', () => {
            const created = vi.spyOn(document, 'createElement');
            const o = overlay();
            expect(() => o.remove()).not.toThrow();
            expect(created.mock.calls.filter((c) => c[0] === 'div')).toHaveLength(0);
        });
    });

    // O-11, fixed in Phase 3 Slice D. The base constructor used to set a [0, 0] offset, which
    // allocated a Point for every overlay - and Tooltip and Popup both replace it with their own
    // straight afterwards, so it was thrown away immediately. getOffset() now builds it on first
    // read instead.
    //
    // It is deliberately NOT a shared instance: Point is mutable through its setters, and
    // Object.freeze can't prevent that because the values live in #private fields rather than
    // properties. Two overlays must never end up sharing one offset.
    describe('the default offset (O-11)', () => {
        it('defaults to 0, 0 on first read', () => {
            const o = overlay();
            expect(o.offset.x).toBe(0);
            expect(o.offset.y).toBe(0);
            expect(o.getOffset()).toBe(o.offset);
        });

        it('gives each overlay its own offset object', () => {
            const first = overlay();
            const second = overlay();
            expect(first.getOffset()).not.toBe(second.getOffset());

            // Changing one must not move the other
            first.setOffset([10, 20]);
            expect(second.offset.x).toBe(0);
            expect(second.offset.y).toBe(0);
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

    /* -----------------------------------------------------------------------
        Dragging and resizing.

        These had no test cover at all before. They matter because between them they hold
        about 28 of the 42 `this.#overlay` references in Overlay.ts, which is most of the
        work in making the element lazy (O-1).

        Only the mouse paths are covered. jsdom doesn't implement TouchEvent, so the
        `e.touches[0]` branches can't be driven from here.
    ----------------------------------------------------------------------- */

    describe('dragging', () => {
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

        it('is off until it is turned on', () => {
            const o = overlay();
            expect(o.drag).toBe(false);
            o.enableDrag();
            expect(o.drag).toBe(true);
            o.disableDrag();
            expect(o.drag).toBe(false);
        });

        it('sets the cursor and pointer events on the element when enabled', () => {
            const o = overlay();
            o.enableDrag();
            const element = o.getOverlayElement();
            expect(element.style.cursor).toBe('move');
            expect(element.style.pointerEvents).toBe('auto');
        });

        it('clears the cursor and pointer events when disabled', () => {
            const o = overlay();
            o.enableDrag();
            o.disableDrag();
            const element = o.getOverlayElement();
            expect(element.style.cursor).toBe('');
            expect(element.style.pointerEvents).toBe('');
        });

        // Enabling drag draws a blue outline around the overlay, and disabling it takes the
        // outline away again. The outline used to be left behind, because #setupDragHandlers
        // set the border when enabling but never cleared it when disabling.
        it('draws an outline while it can be dragged, and takes it away again', () => {
            const o = overlay();
            o.enableDrag();
            const element = o.getOverlayElement();
            // borderStyle rather than border, because jsdom serialises the border shorthand
            // back as "medium" once it is cleared, which makes "not none" true either way.
            expect(element.style.borderStyle).toBe('solid');

            o.disableDrag();
            expect(element.style.borderStyle).toBe('none');
        });

        // Dragging and resizing draw the same outline, so whichever is turned off second is the
        // one that removes it. Getting this wrong either leaves an outline on an overlay that
        // can't be moved, or takes the outline off one that can still be resized.
        it('keeps the outline when dragging is turned off but resizing is still on', () => {
            const o = overlay();
            o.enableDrag();
            o.enableResize();

            o.disableDrag();
            expect(o.getOverlayElement().style.borderStyle).toBe('solid');

            o.disableResize();
            expect(o.getOverlayElement().style.borderStyle).toBe('none');
        });

        it('keeps the outline when resizing is turned off but dragging is still on', () => {
            const o = overlay();
            o.enableDrag();
            o.enableResize();

            o.disableResize();
            expect(o.getOverlayElement().style.borderStyle).toBe('solid');

            o.disableDrag();
            expect(o.getOverlayElement().style.borderStyle).toBe('none');
        });

        it('says when the draggable state changed', () => {
            const o = overlay();
            const cb = vi.fn();
            o.onDraggableChanged(cb);

            o.enableDrag();
            o.disableDrag();
            expect(cb).toHaveBeenCalledTimes(2);
        });

        it('starts a drag when the element is pressed', () => {
            const o = overlay();
            const cb = vi.fn();
            o.onDragStart(cb);
            o.enableDrag();

            mouse(o.getOverlayElement(), 'mousedown', 100, 50);
            expect(cb).toHaveBeenCalledTimes(1);
        });

        it('starts nothing when dragging is off', () => {
            const o = overlay();
            const cb = vi.fn();
            o.onDragStart(cb);

            mouse(o.getOverlayElement(), 'mousedown', 100, 50);
            expect(cb).not.toHaveBeenCalled();
        });

        it('moves the element by however far the mouse moved', () => {
            const o = overlay();
            o.enableDrag();
            const element = o.getOverlayElement();

            mouse(element, 'mousedown', 100, 50);
            mouse(document, 'mousemove', 130, 70);

            // 30 right and 20 down from a starting position of 0, 0
            expect(element.style.left).toBe('30px');
            expect(element.style.top).toBe('20px');
        });

        it('moves from wherever the element already was', () => {
            const o = overlay();
            o.enableDrag();
            const element = o.getOverlayElement();
            element.style.left = '10px';
            element.style.top = '5px';

            mouse(element, 'mousedown', 100, 50);
            mouse(document, 'mousemove', 130, 70);

            expect(element.style.left).toBe('40px');
            expect(element.style.top).toBe('25px');
        });

        it('says that it is being dragged', () => {
            const o = overlay();
            const cb = vi.fn();
            o.onDrag(cb);
            o.enableDrag();

            mouse(o.getOverlayElement(), 'mousedown', 100, 50);
            mouse(document, 'mousemove', 110, 60);
            mouse(document, 'mousemove', 120, 70);
            expect(cb).toHaveBeenCalledTimes(2);
        });

        it('stops when the mouse is let go, and ignores anything after that', () => {
            const o = overlay();
            const end = vi.fn();
            o.onDragEnd(end);
            o.enableDrag();
            const element = o.getOverlayElement();

            mouse(element, 'mousedown', 100, 50);
            mouse(document, 'mousemove', 130, 70);
            mouse(document, 'mouseup', 130, 70);
            expect(end).toHaveBeenCalledTimes(1);

            // The document listeners are gone, so this moves nothing
            mouse(document, 'mousemove', 300, 300);
            expect(element.style.left).toBe('30px');
        });

        it('does not move anything when the mouse moves without a press first', () => {
            const o = overlay();
            o.enableDrag();
            const element = o.getOverlayElement();

            mouse(document, 'mousemove', 300, 300);
            expect(element.style.left).toBe('');
        });
    });

    describe('resizing', () => {
        it('is off until it is turned on', () => {
            const o = overlay();
            expect(o.resize).toBe(false);
            o.enableResize();
            expect(o.resize).toBe(true);
            o.disableResize();
            expect(o.resize).toBe(false);
        });

        it('adds one handle for each corner', () => {
            const o = overlay();
            o.enableResize();

            const handles = o.getOverlayElement().querySelectorAll('.resize-handle');
            expect(handles).toHaveLength(4);
            ['nw', 'ne', 'sw', 'se'].forEach((corner) => {
                expect(o.getOverlayElement().querySelectorAll(`.resize-${corner}`)).toHaveLength(1);
            });
        });

        it('gives each corner the cursor for its direction', () => {
            const o = overlay();
            o.enableResize();
            const element = o.getOverlayElement();

            const cursorFor = (corner: string) =>
                (element.querySelector(`.resize-${corner}`) as HTMLElement).style.cursor;
            expect(cursorFor('nw')).toBe('nwse-resize');
            expect(cursorFor('se')).toBe('nwse-resize');
            expect(cursorFor('ne')).toBe('nesw-resize');
            expect(cursorFor('sw')).toBe('nesw-resize');
        });

        it('outlines the element while it can be resized', () => {
            const o = overlay();
            o.enableResize();
            expect(o.getOverlayElement().style.borderStyle).toBe('solid');
        });

        it('takes the handles and the outline away again', () => {
            const o = overlay();
            o.enableResize();
            o.disableResize();

            expect(o.getOverlayElement().querySelectorAll('.resize-handle')).toHaveLength(0);
            expect(o.getOverlayElement().style.borderStyle).toBe('none');
        });

        // #createResizeHandles removes the old handles before building new ones, so turning
        // resizing on twice must not leave eight handles behind.
        it('does not build a second set of handles when turned on twice', () => {
            const o = overlay();
            o.enableResize();
            o.enableResize();
            expect(o.getOverlayElement().querySelectorAll('.resize-handle')).toHaveLength(4);
        });

        // Resizing needs the map div and the overlay's bounds, so pressing a handle on an
        // overlay that isn't on a map does nothing at all. This is worth pinning down because
        // it's also the reason the resize *movement* isn't covered here - see the note at the
        // end of this file.
        it('starts no resize when the overlay is not on a map', () => {
            const o = overlay();
            const cb = vi.fn();
            o.onResizeStart(cb);
            o.enableResize();

            const handle = o.getOverlayElement().querySelector('.resize-nw') as HTMLElement;
            handle.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));

            expect(cb).not.toHaveBeenCalled();
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

    Touch dragging and touch resizing. jsdom doesn't implement TouchEvent, so the
    `e.touches[0]` branches of #handleDragStart, #handleDrag, #handleResizeStart and
    #handleResize can't be driven from a test. They are the same shape as the mouse branches
    that are covered.

    Resize MOVEMENT is covered in test/ImageOverlay.test.ts rather than here, because it can't
    be reached from a plain overlay(). #handleResizeStart gives up unless the overlay has a map
    div and valid bounds (Overlay.ts:1025), and base Overlay.getBounds() builds its bounds from
    two empty latLng() values, so it never gets past that check. ImageOverlay overrides
    getBounds() to return the bounds it was given, and is the only class that overrides
    setBoundsFromResize() and updateBoundsFromResize(). The "starts no resize when the overlay
    is not on a map" test above pins that early return from this side.

    Reaching it needed two additions to the harness, both made on 2026-09-16: getDiv() on
    fakeMap, and getProjection() on the stub OverlayView returning a stand-in
    MapCanvasProjection. Before those, a resize-drag test would have passed without executing
    any of the code it claimed to test - a green test that proves nothing, which is worse than
    no test at all.

    A bug found while writing these tests, since fixed:

      #setupDragHandlers set cursor, pointerEvents and a `2px solid #007bff` border when
      dragging was enabled (Overlay.ts:815-817), but the disabled branch only reset the first
      two, so an overlay kept its blue outline after disableDrag(). Fixing it needed two
      changes rather than one, because resizing draws the same outline: each side now clears
      the border only when the other isn't using it. The mirror of the bug was real as well -
      disableResize() used to take the outline off an overlay that could still be dragged.
      Both directions are covered by the tests above.
*/
