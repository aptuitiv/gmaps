// @vitest-environment jsdom

/* ===========================================================================
    Tests for the Popup class and the attachPopup mixin.

    The centrepiece is section 6.4, fixed in Phase 1. Tooltip had an #isThemeApplied guard so
    that its theme styles are written once instead of on every frame; Popup did not, so its
    draw() rebuilt the theme object and re-applied all five styles every time it ran - on every
    frame of every pan and zoom while a popup was open. Popup now has the same guard, and these
    tests hold it in place.

    draw() takes the projection as a parameter, so it can be called directly with a fake one.
    That makes the per-frame work observable rather than something to take on trust.

    One thing that tempers 6.4: Popup's theme defaults to 'none', not 'default'. The rebuild
    only happens for callers who opt into the default theme.
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Popup, popup } from '../src/lib/Popup';
import { Tooltip, tooltip } from '../src/lib/Tooltip';
import { marker } from '../src/lib/Marker';
import { polyline } from '../src/lib/Polyline';
import { installGoogleMaps, mapsStats, uninstallGoogleMaps } from './support/googleMaps';

/**
 * Let any pending promise callbacks run
 *
 * @returns {Promise<void>}
 */
const tick = async () => {
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
};

const path = [
    { lat: 48.85, lng: 2.35 },
    { lat: 48.86, lng: 2.36 },
];

/**
 * A stand-in for the Google projection, which is all draw() needs
 *
 * @returns {object}
 */
const fakeProjection = () =>
    ({
        fromLatLngToDivPixel: () => ({ x: 10, y: 20 }),
    }) as unknown as google.maps.MapCanvasProjection;

describe('Popup', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
        vi.restoreAllMocks();
    });

    describe('building a popup', () => {
        it('takes a plain string as the content', () => {
            const p = popup('Trail 12');
            expect(p.content).toBe('Trail 12');
            expect(p.hasContent()).toBe(true);
        });

        it('takes an options object', () => {
            const p = popup({ content: 'Trail 12', center: false, autoClose: false });
            expect(p.content).toBe('Trail 12');
            expect(p.center).toBe(false);
            expect(p.autoClose).toBe(false);
        });

        it('takes an HTMLElement', () => {
            const element = document.createElement('span');
            const p = popup(element);
            expect(p.content).toBe(element);
            expect(p.getOverlayElement().firstChild).toBe(element);
        });

        it('returns the same object when the factory is given a Popup', () => {
            const p = popup('x');
            expect(popup(p)).toBe(p);
        });

        it('centers and auto-closes by default', () => {
            const p = popup('x');
            expect(p.center).toBe(true);
            expect(p.autoClose).toBe(true);
        });

        // Unlike Tooltip, whose theme is 'default'.
        it("defaults the theme to 'none'", () => {
            expect(popup('x').theme).toBe('none');
            expect(tooltip('x').theme).toBe('default');
        });
    });

    // O-2, the same as Tooltip: the content setter parses into the DOM, and the constructor
    // calls it.
    describe('content is parsed into the DOM at construction (O-2)', () => {
        it('writes the content into the element before anything is shown', () => {
            const p = popup('<b>Trail 12</b>');
            expect(p.getOverlayElement().innerHTML).toBe('<b>Trail 12</b>');
            expect(p.isVisible).toBe(false);
        });

        it('parses for every popup built, shown or not', () => {
            const popups: Popup[] = [];
            for (let i = 0; i < 100; i += 1) {
                popups.push(popup(`<b>Segment ${i}</b>`));
            }
            popups.forEach((p, i) => {
                expect(p.getOverlayElement().innerHTML).toBe(`<b>Segment ${i}</b>`);
                expect(p.getOverlayElement().parentElement).toBeNull();
            });
        });

        it('clears the old children when an element replaces the content', () => {
            const first = document.createElement('span');
            const second = document.createElement('div');
            const p = popup(first);
            p.setContent(second);
            expect(p.getOverlayElement().childNodes).toHaveLength(1);
            expect(p.getOverlayElement().firstChild).toBe(second);
        });
    });

    describe('the event option', () => {
        it('accepts the three allowed values', () => {
            expect(popup({ content: 'x', event: 'click' }).event).toBe('click');
            expect(popup({ content: 'x', event: 'HOVER' }).event).toBe('hover');
        });

        it('throws on anything else', () => {
            expect(() => popup({ content: 'x', event: 'dblclick' })).toThrow(/Invalid event value/);
        });
    });

    // Section 6.4, now fixed in Phase 1. Popup was given the same #isThemeApplied guard that
    // Tooltip already had, so the theme styles are written once instead of on every frame.
    describe('the theme is applied once, not on every draw (6.4)', () => {
        /**
         * Record the style names written during one draw
         *
         * @param {Popup|Tooltip} overlayObject The overlay to draw
         * @returns {string[]}
         */
        const styleNamesForOneDraw = (overlayObject: Popup | Tooltip): string[] => {
            const spy = vi.spyOn(overlayObject, 'style');
            overlayObject.draw(fakeProjection());
            const names = spy.mock.calls.map((call) => call[0] as string);
            spy.mockRestore();
            return names;
        };

        it('writes the theme styles on the first draw', () => {
            const p = popup({ content: 'x', theme: 'default' });
            p.setPosition([1, 2]);

            const first = styleNamesForOneDraw(p);

            expect(first).toEqual(expect.arrayContaining(['backgroundColor', 'color', 'padding', 'borderRadius']));
        });

        it('does not write them again on the second draw', () => {
            const p = popup({ content: 'x', theme: 'default' });
            p.setPosition([1, 2]);

            styleNamesForOneDraw(p);
            const second = styleNamesForOneDraw(p);

            // Only the position and transform are left, which is the point of the fix
            expect(second).not.toContain('backgroundColor');
        });

        it('stops writing them on every draw after that', () => {
            const p = popup({ content: 'x', theme: 'default' });
            p.setPosition([1, 2]);

            p.draw(fakeProjection());
            p.draw(fakeProjection());
            const fifth = styleNamesForOneDraw(p);

            expect(fifth).not.toContain('backgroundColor');
        });

        // Applying once does not mean the styles go away. They stay on the element, so a later
        // draw has nothing to do - #applyTheme() only writes keys that aren't set yet, and
        // style() now skips a write when the value hasn't changed.
        it('leaves the theme styles on the element after later draws', () => {
            const p = popup({ content: 'x', theme: 'default' });
            p.setPosition([1, 2]);

            p.draw(fakeProjection());
            p.draw(fakeProjection());
            p.draw(fakeProjection());

            expect(p.getOverlayElement().style.backgroundColor).toBe('rgb(255, 255, 255)');
            expect(p.styles).toMatchObject({ backgroundColor: '#fff', padding: '3px 6px' });
        });

        // The precedence rule that #applyTheme() has to keep: a style the caller set explicitly
        // is never overwritten by the theme.
        it('lets a custom style win over the theme', () => {
            const p = popup({ content: 'x', theme: 'default', styles: { backgroundColor: 'red' } });
            p.setPosition([1, 2]);

            p.draw(fakeProjection());

            expect(p.styles).toMatchObject({ backgroundColor: 'red' });
            // The rest of the theme is still applied around it
            expect(p.styles).toMatchObject({ padding: '3px 6px' });
        });

        // Tooltip had this guard first; Popup now matches it.
        it('Tooltip writes them on the first draw only', () => {
            const t = tooltip('x');
            t.setPosition([1, 2]);

            const first = styleNamesForOneDraw(t);
            const second = styleNamesForOneDraw(t);

            expect(first).toContain('backgroundColor');
            expect(second).not.toContain('backgroundColor');
        });

        it('a popup with no theme writes no theme styles at all', () => {
            const p = popup({ content: 'x' });
            p.setPosition([1, 2]);

            expect(styleNamesForOneDraw(p)).not.toContain('backgroundColor');
        });

        // The transform is written on every draw too, with no comparison against the current
        // value. Tooltip guards this one; Popup does not.
        it('writes the transform on every draw', () => {
            const p = popup({ content: 'x' });
            p.setPosition([1, 2]);

            styleNamesForOneDraw(p);
            expect(styleNamesForOneDraw(p)).toContain('transform');
        });
    });

    describe('draw positions the element', () => {
        it('sets left and top from the projection', () => {
            const p = popup('x');
            p.setPosition([1, 2]);
            p.draw(fakeProjection());

            expect(p.getOverlayElement().style.left).toBe('10px');
            expect(p.getOverlayElement().style.top).toBe('20px');
        });

        it('does nothing without a position', () => {
            const p = popup('x');
            expect(() => p.draw(fakeProjection())).not.toThrow();
            expect(p.getOverlayElement().style.left).toBe('');
        });

        it('does nothing without a projection', () => {
            const p = popup('x');
            p.setPosition([1, 2]);
            expect(() => p.draw(undefined as never)).not.toThrow();
            expect(p.getOverlayElement().style.left).toBe('');
        });
    });
});

// The popup half of M-1, and the Layer popup accessors.
describe('attaching a popup (M-1)', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
    });

    it('attaching to a polyline builds nothing', async () => {
        const p = polyline({ path });
        p.attachPopup('Trail 12');
        await tick();

        expect(mapsStats.countOf('Polyline')).toBe(0);
    });

    it('attaching to 100 polylines builds nothing', async () => {
        for (let i = 0; i < 100; i += 1) {
            polyline({ path }).attachPopup(`Segment ${i}`);
        }
        await tick();

        expect(mapsStats.countOf('Polyline')).toBe(0);
    });

    it('attaching to a marker builds the Google marker (the M-1 bug)', async () => {
        const m = marker({ position: [1, 2] });
        m.attachPopup('Marker 1');
        await tick();

        expect(mapsStats.countOf('Marker')).toBe(1);
    });

    it('a tooltip and a popup on the same polyline still build nothing', async () => {
        const p = polyline({ path });
        p.attachTooltip('Trail 12');
        p.attachPopup('Trail 12 details');
        await tick();

        expect(mapsStats.countOf('Polyline')).toBe(0);
    });

    it('sets the popup on the layer so the accessors find it', async () => {
        const p = polyline({ path });
        const attached = p.attachPopup('Trail 12');
        await tick();

        expect(attached).toBeInstanceOf(Popup);
        expect(p.hasPopup()).toBe(true);
        expect(p.getPopup()).toBe(attached);
    });

    it('closePopup is safe when nothing is open', async () => {
        const p = polyline({ path });
        p.attachPopup('Trail 12');
        await tick();
        expect(() => p.closePopup()).not.toThrow();
    });

    it('a layer with no popup reports none', () => {
        const p = polyline({ path });
        expect(p.hasPopup()).toBe(false);
        expect(p.getPopup()).toBeUndefined();
    });
});
