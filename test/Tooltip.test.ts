// @vitest-environment jsdom

/* ===========================================================================
    Tests for the Tooltip class and the attachTooltip mixin.

    Two things make this file worth more than its size.

    O-2: the content is parsed into the DOM by the CONTENT SETTER, which the constructor
    calls. So a tooltip that is never shown has already done its innerHTML parse.

    M-1: importing this file applies the tooltip mixin to Layer, which is what gives Marker
    and Polyline their attachTooltip(). That finally makes M-1's real payoff testable -
    attaching a tooltip to a marker builds the Google marker, while attaching one to a
    polyline builds nothing. Same mixin, same call, opposite result.
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Tooltip, tooltip } from '../src/lib/Tooltip';
import { marker } from '../src/lib/Marker';
import { polyline } from '../src/lib/Polyline';
import { installGoogleMaps, mapsStats, uninstallGoogleMaps } from './support/googleMaps';
import { fakeMap } from './support/fakeMap';

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

describe('Tooltip', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
    });

    describe('building a tooltip', () => {
        it('takes a plain string as the content', () => {
            const t = tooltip('Trail 12');
            expect(t.content).toBe('Trail 12');
            expect(t.hasContent()).toBe(true);
        });

        it('takes an options object', () => {
            const t = tooltip({ content: 'Trail 12', center: false, theme: 'none' });
            expect(t.content).toBe('Trail 12');
            expect(t.center).toBe(false);
            expect(t.theme).toBe('none');
        });

        it('takes an HTMLElement', () => {
            const element = document.createElement('span');
            element.textContent = 'Trail 12';
            const t = tooltip(element);
            expect(t.content).toBe(element);
            expect(t.getOverlayElement().firstChild).toBe(element);
        });

        it('returns the same object when the factory is given a Tooltip', () => {
            const t = tooltip('x');
            expect(tooltip(t)).toBe(t);
        });

        it('centers by default and uses the default theme', () => {
            const t = tooltip('x');
            expect(t.center).toBe(true);
            expect(t.theme).toBe('default');
        });

        it('has no content when built with nothing', () => {
            expect(tooltip().hasContent()).toBe(false);
        });

        // O-11. The base Overlay constructor sets [0, 0] and Tooltip immediately replaces it.
        it('replaces the base offset with 0, 4', () => {
            const t = tooltip('x');
            expect(t.offset.x).toBe(0);
            expect(t.offset.y).toBe(4);
        });

        // An asymmetry worth pinning: the string form adds a "tooltip" class, the options form
        // does not. That is why setOptions() has to call removeClassName('tooltip').
        it('adds the tooltip class for the string form but not the options form', () => {
            expect(tooltip('x').className).toBe('tooltip');
            expect(tooltip({ content: 'x' }).className).toBe('');
        });

        it('replaces the tooltip class when a className option is given', () => {
            const t = tooltip({ content: 'x', className: 'custom' });
            expect(t.className).toBe('custom');
        });
    });

    // O-2. Nothing has been shown, and the DOM already holds the parsed content.
    describe('content is parsed into the DOM at construction (O-2)', () => {
        it('writes the content into the element before anything is shown', () => {
            const t = tooltip('<b>Trail 12</b>');
            expect(t.getOverlayElement().innerHTML).toBe('<b>Trail 12</b>');
            expect(t.isVisible).toBe(false);
        });

        it('does the same through setContent', () => {
            const t = tooltip();
            expect(t.getOverlayElement().innerHTML).toBe('');
            t.setContent('<i>later</i>');
            expect(t.getOverlayElement().innerHTML).toBe('<i>later</i>');
        });

        it('parses for every tooltip built, shown or not', () => {
            const tooltips: Tooltip[] = [];
            for (let i = 0; i < 100; i += 1) {
                tooltips.push(tooltip(`<b>Segment ${i}</b>`));
            }
            // 100 parses, 100 detached elements, none of them ever displayed
            tooltips.forEach((t, i) => {
                expect(t.getOverlayElement().innerHTML).toBe(`<b>Segment ${i}</b>`);
                expect(t.getOverlayElement().parentElement).toBeNull();
            });
        });

        it('replaces the content rather than appending to it', () => {
            const t = tooltip('first');
            t.setContent('second');
            expect(t.getOverlayElement().innerHTML).toBe('second');
        });

        it('ignores an empty string, keeping the old content', () => {
            const t = tooltip('first');
            t.setContent('');
            expect(t.content).toBe('first');
        });
    });

    describe('the event option', () => {
        it('defaults to hover and accepts the three allowed values', () => {
            expect(tooltip('x').event).toBe('hover');
            expect(tooltip({ content: 'x', event: 'click' }).event).toBe('click');
            expect(tooltip({ content: 'x', event: 'CLICKON' }).event).toBe('clickon');
        });

        it('throws on anything else', () => {
            expect(() => tooltip({ content: 'x', event: 'dblclick' })).toThrow(/Invalid event value/);
        });
    });

    describe('the theme', () => {
        it('marks the theme for reapplying when it is changed', () => {
            const t = tooltip('x');
            t.theme = 'none';
            expect(t.theme).toBe('none');
        });

        it('applies no theme styles until the tooltip is drawn', () => {
            const t = tooltip('x');
            // #applyTheme only runs from draw(), so nothing is set yet
            expect(t.styles).not.toHaveProperty('backgroundColor');
        });
    });

    describe('showing', () => {
        it('builds the overlay view and attaches it when shown', async () => {
            const t = tooltip('x');
            expect(mapsStats.countOf('OverlayView')).toBe(0);

            await t.show(fakeMap());

            expect(mapsStats.countOf('OverlayView')).toBe(1);
            expect(t.isVisible).toBe(true);
        });

        it('builds no overlay view for a tooltip that is never shown', () => {
            tooltip('x');
            tooltip('y');
            expect(mapsStats.countOf('OverlayView')).toBe(0);
        });
    });
});

// M-1's real payoff, and the clearest statement of the problem in the whole suite.
describe('attaching a tooltip (M-1)', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
    });

    it('attaching to a polyline builds nothing', async () => {
        const p = polyline({ path });
        p.attachTooltip('Trail 12');
        await tick();

        expect(mapsStats.countOf('Polyline')).toBe(0);
    });

    it('attaching to 100 polylines builds nothing', async () => {
        for (let i = 0; i < 100; i += 1) {
            polyline({ path }).attachTooltip(`Segment ${i}`);
        }
        await tick();

        expect(mapsStats.countOf('Polyline')).toBe(0);
    });

    // The same call on a marker builds the Google object, because Marker.init() sets up the
    // marker where Polyline.init() only dispatches ready. When M-1 lands this becomes 0.
    it('attaching to a marker builds the Google marker (the M-1 bug)', async () => {
        const m = marker({ position: [1, 2] });
        m.attachTooltip('Marker 1');
        await tick();

        expect(mapsStats.countOf('Marker')).toBe(1);
    });

    it('attaching to 100 markers builds 100 Google markers', async () => {
        for (let i = 0; i < 100; i += 1) {
            marker({ position: [i / 100, i / 100] }).attachTooltip(`Marker ${i}`);
        }
        await tick();

        expect(mapsStats.countOf('Marker')).toBe(100);
    });

    it('returns the Tooltip so the caller can keep changing it', () => {
        const t = marker({ position: [1, 2] }).attachTooltip('Marker 1');
        expect(t).toBeInstanceOf(Tooltip);
        expect(t.content).toBe('Marker 1');
    });

    it('records the config so that a clone can recreate it', () => {
        const p = polyline({ path });
        p.attachTooltip('Trail 12', 'click');
        expect(p.tooltipConfig).toMatchObject({ attachConfig: 'Trail 12', attachEvent: 'click' });
    });

    it('a callback tooltip starts with no content and is worked out when shown', async () => {
        const p = polyline({ path });
        const callback = vi.fn(() => 'worked out later');
        const t = p.attachTooltip(callback);
        await tick();

        // The mixin builds it with tooltip({ content: '' }), and setOptions guards with
        // `if (options.content)`, so an empty string never reaches the content setter and
        // the content stays undefined rather than becoming ''.
        expect(t.content).toBeUndefined();
        // The callback is only called when the tooltip is about to be shown
        expect(callback).not.toHaveBeenCalled();
        expect(mapsStats.countOf('Polyline')).toBe(0);
    });
});
