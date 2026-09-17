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
import { LatLng } from '../src/lib/LatLng';
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

    describe('the shared tooltip (O-3)', () => {
        afterEach(() => {
            Tooltip.clearShared();
            Tooltip.useShared = true;
        });

        it('gives everything one Tooltip by default', () => {
            const first = polyline({ path }).attachTooltip('Segment 1');
            const second = polyline({ path }).attachTooltip('Segment 2');
            expect(second).toBe(first);
        });

        // The point of O-3. One Tooltip object instead of 100.
        //
        // The div count is 0 because of O-1, which landed afterwards: the overlay element is
        // built the first time it's needed rather than in the constructor, and a tooltip that
        // has never been hovered doesn't need one. So 100 polylines with a tooltip each build
        // one object and no elements at all.
        it('builds one Tooltip, and no elements, for 100 polylines', () => {
            const created = vi.spyOn(document, 'createElement');
            const tooltips = new Set();
            for (let i = 0; i < 100; i += 1) {
                tooltips.add(polyline({ path }).attachTooltip(`Segment ${i}`));
            }
            expect(tooltips.size).toBe(1);
            expect(created.mock.calls.filter((c) => c[0] === 'div')).toHaveLength(0);
        });

        // Markers and polylines share the same one. Only one tooltip is ever visible, so there
        // is nothing to be gained by keeping a separate one per type.
        it('shares one Tooltip between markers and polylines', () => {
            const onPolyline = polyline({ path }).attachTooltip('Segment');
            const onMarker = marker({ position: [1, 2] }).attachTooltip('Marker');
            expect(onMarker).toBe(onPolyline);
        });

        it('holds the value that was just attached', () => {
            const t = marker({ position: [1, 2] }).attachTooltip('Marker 1');
            expect(t.content).toBe('Marker 1');
        });

        // The guard that matters most. attachTo() used to have a single boolean, which would
        // have wired the listeners up for the first thing only.
        it('attaches its listeners for every object, not just the first', async () => {
            const first = polyline({ path });
            const second = polyline({ path });
            first.attachTooltip('First');
            second.attachTooltip('Second');
            await tick();

            const map = fakeMap();
            await first.setMap(map);
            await second.setMap(map);
            await tick();

            // Each polyline put its own value back when it was hovered
            second.dispatch('mouseover', { latLng: { lat: 48.85, lng: 2.35 } });
            expect(Tooltip.getShared().content).toBe('Second');

            first.dispatch('mouseover', { latLng: { lat: 48.85, lng: 2.35 } });
            expect(Tooltip.getShared().content).toBe('First');
        });

        /*
            setOptions() only applies what it's given, so the shared tooltip used to keep
            whatever the last object set on it. The class name was the worst of it: setOptions()
            takes the "tooltip" class off before adding its own, so once any object passed a
            className every object after it lost the default class permanently.
        */
        it('does not leave one object\'s options on the next one', async () => {
            const first = polyline({ path });
            const second = polyline({ path });
            first.attachTooltip({ content: 'First', className: 'special', theme: 'none', center: false });
            second.attachTooltip({ content: 'Second' });
            await tick();

            const map = fakeMap();
            await first.setMap(map);
            await second.setMap(map);
            await tick();

            const shared = Tooltip.getShared();
            first.dispatch('mouseover', { latLng: { lat: 48.85, lng: 2.35 } });
            expect(shared.className).toBe('special');
            expect(shared.theme).toBe('none');
            expect(shared.center).toBe(false);

            // The second polyline only asked for content, so everything else goes back to the
            // way the tooltip was built rather than staying as the first one left it.
            second.dispatch('mouseover', { latLng: { lat: 48.85, lng: 2.35 } });
            expect(shared.content).toBe('Second');
            expect(shared.className).toBe('tooltip');
            expect(shared.theme).toBe('default');
            expect(shared.center).toBe(true);
        });

        it('does not leave the previous content showing for an object that has none', async () => {
            const first = polyline({ path });
            const second = polyline({ path });
            first.attachTooltip('First');
            second.attachTooltip({ className: 'no-content' });
            await tick();

            const map = fakeMap();
            await first.setMap(map);
            await second.setMap(map);
            await tick();

            const shared = Tooltip.getShared();
            first.dispatch('mouseover', { latLng: { lat: 48.85, lng: 2.35 } });
            expect(shared.hasContent()).toBe(true);

            second.dispatch('mouseover', { latLng: { lat: 48.85, lng: 2.35 } });
            expect(shared.hasContent()).toBe(false);
            // The element is emptied too, not just the stored value
            expect(shared.getOverlayElement().innerHTML).toBe('');
        });

        it('gives an object its own Tooltip when the call opts out', () => {
            const shared = polyline({ path }).attachTooltip('Shared');
            const own = polyline({ path }).attachTooltip('Own', 'hover', { shared: false });
            expect(own).not.toBe(shared);
            expect(own.content).toBe('Own');
        });

        it('gives everything its own Tooltip when sharing is turned off', () => {
            Tooltip.useShared = false;
            const first = polyline({ path }).attachTooltip('Segment 1');
            const second = polyline({ path }).attachTooltip('Segment 2');
            expect(second).not.toBe(first);
        });

        it('shares one when a single call opts in while sharing is off', () => {
            Tooltip.useShared = false;
            const first = polyline({ path }).attachTooltip('One', 'hover', { shared: true });
            const second = polyline({ path }).attachTooltip('Two', 'hover', { shared: true });
            expect(second).toBe(first);
        });

        // Passing a Tooltip object means that object is wanted, whatever the default is.
        it('never replaces a Tooltip object that was passed in', () => {
            const own = tooltip('Mine');
            const returned = polyline({ path }).attachTooltip(own);
            expect(returned).toBe(own);
            expect(returned).not.toBe(Tooltip.getShared());
        });

        it('builds no shared tooltip until something attaches one', () => {
            Tooltip.clearShared();
            const created = vi.spyOn(document, 'createElement');
            polyline({ path });
            expect(created).not.toHaveBeenCalled();
        });

        it('clearShared lets the next attach build a fresh one', () => {
            const first = polyline({ path }).attachTooltip('First');
            Tooltip.clearShared();
            const second = polyline({ path }).attachTooltip('Second');
            expect(second).not.toBe(first);
        });
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

    // O-2, fixed in Phase 3 Slice D. The content setter used to write straight into the element,
    // so a tooltip attached to a layer that was never hovered had already paid for the innerHTML
    // parse. It now stores the value and writes it the first time the element is used.
    //
    // The public contract is unchanged: getOverlayElement() flushes what's waiting, so anything
    // reading the element still sees the content. That does mean most of the tests below can't
    // tell the difference - they go through the accessor and so trigger the flush. The one case
    // that CAN be observed without touching the overlay is element content: the node is only
    // appended during the flush, so its parentElement stays null until then.
    describe('content is not written into the DOM until the element is used (O-2)', () => {
        it('leaves element content unattached until the overlay element is read', () => {
            const element = document.createElement('span');
            element.textContent = 'Trail 12';
            const t = tooltip(element);

            // Checking the content node doesn't touch the overlay, so nothing is flushed
            expect(element.parentElement).toBeNull();
            expect(t.hasContent()).toBe(true);
            expect(t.content).toBe(element);

            // Reading the overlay element writes it in
            expect(t.getOverlayElement().firstChild).toBe(element);
            expect(element.parentElement).not.toBeNull();
        });

        it('leaves 100 tooltips worth of element content unattached', () => {
            const elements: HTMLElement[] = [];
            for (let i = 0; i < 100; i += 1) {
                const element = document.createElement('span');
                elements.push(element);
                tooltip(element);
            }
            elements.forEach((element) => {
                expect(element.parentElement).toBeNull();
            });
        });

        it('flushes only once, however many times the element is read', () => {
            const t = tooltip('<b>Trail 12</b>');
            expect(t.getOverlayElement().innerHTML).toBe('<b>Trail 12</b>');

            // A second read must not rewrite it, which would undo an edit made to the element
            t.getOverlayElement().innerHTML = '<i>changed by hand</i>';
            expect(t.getOverlayElement().innerHTML).toBe('<i>changed by hand</i>');
        });

        it('writes new content set after the first flush', () => {
            const t = tooltip('first');
            expect(t.getOverlayElement().innerHTML).toBe('first');
            t.setContent('second');
            expect(t.getOverlayElement().innerHTML).toBe('second');
        });
    });

    // These go through getOverlayElement(), so they verify the flush-on-access contract rather
    // than the deferral itself.
    describe('content reaches the DOM when the element is read (O-2)', () => {
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

    /* -----------------------------------------------------------------------
        draw() is called by Google on every frame while the map is moved, and it converts the
        tooltip's position to pixels with LatLng.toGoogle() - which throws for a position that
        isn't a real latitude/longitude pair.

        An empty LatLng is easy to end up with: Overlay.getContainerLatLngFromPixel() and
        getDivLatLngFromPixel() both hand one back when there is no projection to work with, and
        that value can be stored as a position. So draw() checks the position is valid, not just
        that it is set.
    ----------------------------------------------------------------------- */
    describe('drawing with a position that is not usable', () => {
        /**
         * A stand-in projection that converts a position to pixels
         *
         * @param {object|null} result What fromLatLngToDivPixel should return
         * @returns {any}
         */
        const projectionReturning = (result: { x: number; y: number } | null): any => ({
            fromLatLngToDivPixel: () => result,
        });

        it('does not throw when the position is an empty LatLng', () => {
            const t = tooltip('Content');
            // The shape Overlay hands back when it has no projection to convert with
            t.setPosition(new LatLng());

            expect(() => t.draw(projectionReturning({ x: 10, y: 20 }))).not.toThrow();
        });

        it('does not throw when the projection cannot convert the position', () => {
            const t = tooltip('Content');
            t.setPosition([1, 2]);

            // Google returns null when it can't work out the pixel position
            expect(() => t.draw(projectionReturning(null))).not.toThrow();
        });

        it('still places the tooltip for a real position', () => {
            const t = tooltip('Content');
            t.setPosition([1, 2]);

            t.draw(projectionReturning({ x: 10, y: 20 }));
            expect(t.getOverlayElement().style.left).toBe('10px');
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
        // The shared tooltip lives at module scope, so without this one test's content would
        // still be on it for the next one.
        Tooltip.clearShared();
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

    // M-1 fixed in Phase 3. Marker.init() used to set up the Google marker where
    // Polyline.init() only dispatches ready, so the same call had opposite results. Both now
    // build nothing, which is the whole point of the change.
    it('attaching to a marker builds nothing (M-1)', async () => {
        const m = marker({ position: [1, 2] });
        m.attachTooltip('Marker 1');
        await tick();

        expect(mapsStats.countOf('Marker')).toBe(0);
    });

    it('attaching to 100 markers builds nothing', async () => {
        for (let i = 0; i < 100; i += 1) {
            marker({ position: [i / 100, i / 100] }).attachTooltip(`Marker ${i}`);
        }
        await tick();

        expect(mapsStats.countOf('Marker')).toBe(0);
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
