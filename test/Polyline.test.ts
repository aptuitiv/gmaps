/* ===========================================================================
    Tests for the Polyline class.

    Polyline has already had its performance pass, so most of these lock in wins that are
    already shipped and must not regress: a hidden polyline is not drawn, init() does not
    draw, and the path is held as plain numbers.

    L-4 (setPath called when the drawn path did not change) and L-7 (a redundant setOptions
    call on every plain polyline) have since been fixed, and the tests below lock in those
    skips - including the cases that must still send, so that the skips can't get greedy.

    L-5 (one "idle" listener per polyline) is still outstanding, and is documented rather
    than fixed.
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Polyline, polyline } from '../src/lib/Polyline';
import { LatLng } from '../src/lib/LatLng';
import { installGoogleMaps, mapsStats, uninstallGoogleMaps } from './support/googleMaps';
import { asFakeMap, fakeMap } from './support/fakeMap';

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

// A short path. Any tolerance keeps both end points, so simplifying never changes it.
const shortPath = [
    { lat: 48.85, lng: 2.35 },
    { lat: 48.86, lng: 2.36 },
];

/**
 * Build a path with a lot of points so that simplifying actually removes some
 *
 * @param {number} count The number of points
 * @returns {object[]}
 */
const longPath = (count: number) => {
    const points = [];
    for (let i = 0; i < count; i += 1) {
        // A gentle curve with small wobbles, so some points are droppable
        points.push({
            lat: 48.85 + i * 0.00002 + (i % 3) * 0.0000015,
            lng: 2.35 + i * 0.00002,
        });
    }
    return points;
};

/**
 * Build a path that zigzags about 4 metres either side of a straight line.
 *
 * The size of the wobble is the point. It's bigger than the 1m tolerance used from zoom 18, so
 * those points are kept, and smaller than the 10m tolerance used below zoom 14, so they're
 * dropped there. That makes the two zoom buckets draw genuinely different paths.
 *
 * longPath() can't be used for this: its wobble is about 0.17m, which is under both tolerances,
 * so every bucket simplifies it to the same two end points.
 *
 * @param {number} count The number of points
 * @returns {object[]}
 */
const wobblyPath = (count: number) => {
    const points = [];
    for (let i = 0; i < count; i += 1) {
        points.push({
            lat: 48.85 + (i % 2 === 0 ? 0.00004 : -0.00004),
            lng: 2.35 + i * 0.0002,
        });
    }
    return points;
};

describe('Polyline', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
    });

    describe('building a polyline', () => {
        it('takes a path and reads it back as LatLng objects', () => {
            const p = polyline({ path: shortPath });
            const path = p.path as LatLng[];
            expect(path).toHaveLength(2);
            expect(path[0]).toBeInstanceOf(LatLng);
            expect(path[0].lat).toBeCloseTo(48.85);
            expect(path[1].lng).toBeCloseTo(2.36);
        });

        it('has an undefined path when none was set', () => {
            expect(polyline({}).path).toBeUndefined();
        });

        it('returns the same object when the factory is given a Polyline', () => {
            const p = polyline({ path: shortPath });
            expect(polyline(p)).toBe(p);
        });

        it('stores the simple options', () => {
            const p = polyline({
                path: shortPath,
                strokeColor: '#d62828',
                strokeOpacity: 0.5,
                strokeWeight: 3,
                zIndex: 7,
                clickable: false,
            });
            expect(p.strokeColor).toBe('#d62828');
            expect(p.strokeOpacity).toBe(0.5);
            expect(p.strokeWeight).toBe(3);
            expect(p.zIndex).toBe(7);
            expect(p.clickable).toBe(false);
            expect(p.hasZIndex()).toBe(true);
        });

        it('holds custom data', () => {
            const p = polyline({ path: shortPath, data: { segmentId: 12 } });
            expect(p.getData('segmentId')).toBe(12);
            expect(p.getData('nope')).toBeNull();
        });
    });

    // The path is a Float64Array of plain numbers. The LatLng objects are only built when
    // the path property is read, and they are thrown away when the path changes.
    describe('the path is held as plain numbers', () => {
        it('builds no google.maps.LatLng objects until the polyline is drawn', () => {
            polyline({ path: longPath(500) });
            expect(mapsStats.countOf('LatLng')).toBe(0);
        });

        it('caches the LatLng objects across reads', () => {
            const p = polyline({ path: shortPath });
            expect(p.path).toBe(p.path);
        });

        it('throws the cached objects away when the path changes', () => {
            const p = polyline({ path: shortPath });
            const first = p.path;
            p.setPath(longPath(10));
            expect(p.path).not.toBe(first);
            expect(p.path).toHaveLength(10);
        });

        it('changing the returned array does not change the polyline', () => {
            const p = polyline({ path: shortPath });
            (p.path as LatLng[]).push(new LatLng(0, 0));
            // The polyline still has its own two points once the cache is rebuilt
            p.setPath(shortPath);
            expect(p.path).toHaveLength(2);
        });
    });

    // These are the already-shipped wins. They must not regress.
    describe('what does NOT draw the polyline', () => {
        it('building one with a path draws nothing', () => {
            polyline({ path: longPath(100) });
            expect(mapsStats.countOf('Polyline')).toBe(0);
        });

        it('init() draws nothing, unlike Marker.init()', async () => {
            const p = polyline({ path: shortPath });
            await p.init();
            expect(mapsStats.countOf('Polyline')).toBe(0);
        });

        it('init() still dispatches ready so a tooltip can attach', async () => {
            const p = polyline({ path: shortPath });
            const cb = vi.fn();
            p.onReady(cb);
            await p.init();
            expect(cb).toHaveBeenCalledTimes(1);
            expect(mapsStats.countOf('Polyline')).toBe(0);
        });

        it('adding an event listener draws nothing', () => {
            const p = polyline({ path: shortPath });
            p.on('click', vi.fn());
            expect(mapsStats.countOf('Polyline')).toBe(0);
        });

        it('a polyline added to a map while hidden draws nothing', async () => {
            const map = fakeMap();
            polyline({ path: longPath(100), map, visible: false });
            await tick();
            expect(mapsStats.countOf('Polyline')).toBe(0);
        });

        it('1,000 hidden polylines draw nothing', async () => {
            const map = fakeMap();
            for (let i = 0; i < 1000; i += 1) {
                polyline({ path: shortPath, map, visible: false });
            }
            await tick();
            expect(mapsStats.countOf('Polyline')).toBe(0);
        });

        it('a hidden polyline still dispatches ready', async () => {
            const map = fakeMap();
            const p = polyline({ path: shortPath, visible: false });
            const cb = vi.fn();
            p.onReady(cb);
            await p.setMap(map, false);
            expect(cb).toHaveBeenCalledTimes(1);
            expect(mapsStats.countOf('Polyline')).toBe(0);
        });
    });

    describe('what DOES draw the polyline', () => {
        it('toGoogle() draws it', async () => {
            const p = polyline({ path: shortPath });
            await p.toGoogle();
            expect(mapsStats.countOf('Polyline')).toBe(1);
        });

        it('adding it to a map while visible draws it', async () => {
            const p = polyline({ path: shortPath });
            await p.setMap(fakeMap());
            expect(mapsStats.countOf('Polyline')).toBe(1);
        });

        it('showing a polyline that was added hidden draws it then', async () => {
            const map = fakeMap();
            const p = polyline({ path: shortPath, map, visible: false });
            await tick();
            expect(mapsStats.countOf('Polyline')).toBe(0);

            p.visible = true;
            await tick();
            expect(mapsStats.countOf('Polyline')).toBe(1);
        });

        it('draws it only once across repeated calls', async () => {
            const p = polyline({ path: shortPath });
            await p.toGoogle();
            await p.toGoogle();
            await p.setMap(fakeMap());
            expect(mapsStats.countOf('Polyline')).toBe(1);
        });

        it('passes the simple options through to Google', async () => {
            const p = polyline({ path: shortPath, strokeColor: '#fff', zIndex: 4, clickable: false });
            await p.toGoogle();
            const created = mapsStats.callsTo('Polyline', 'constructor')[0];
            expect(created.args[0]).toMatchObject({ strokeColor: '#fff', zIndex: 4, clickable: false });
            expect(created.args[0].path).toHaveLength(2);
        });
    });

    describe('simplify', () => {
        it('is off by default', () => {
            expect(polyline({ path: shortPath }).simplify).toBe(0);
        });

        it('takes a number of meters', () => {
            expect(polyline({ path: shortPath, simplify: 5 }).simplify).toBe(5);
        });

        it('true uses the default tolerance', () => {
            expect(polyline({ path: shortPath, simplify: true }).simplify).toBe(2);
        });

        it('false and 0 turn it off', () => {
            expect(polyline({ path: shortPath, simplify: false }).simplify).toBe(0);
            expect(polyline({ path: shortPath, simplify: 0 }).simplify).toBe(0);
        });

        it('keeps the current setting when an invalid value is passed', () => {
            const p = polyline({ path: shortPath, simplify: 5 });
            p.simplify = 'not a tolerance' as unknown as number;
            expect(p.simplify).toBe(5);
        });

        it('actually removes points from the drawn path', async () => {
            const plain = polyline({ path: longPath(400) });
            await plain.toGoogle();
            const drawnPlain = mapsStats.callsTo('Polyline', 'constructor')[0].args[0].path.length;

            mapsStats.reset();
            const simplified = polyline({ path: longPath(400), simplify: 25 });
            await simplified.toGoogle();
            const drawnSimplified = mapsStats.callsTo('Polyline', 'constructor')[0].args[0].path.length;

            expect(drawnPlain).toBe(400);
            expect(drawnSimplified).toBeLessThan(drawnPlain);
            // Both ends are always kept
            expect(drawnSimplified).toBeGreaterThanOrEqual(2);
        });

        it('keeps every point in the path property even when the drawn path is simplified', async () => {
            const p = polyline({ path: longPath(400), simplify: 25 });
            await p.toGoogle();
            expect(p.path).toHaveLength(400);
        });

        it("'zoom' picks the tolerance for the map's zoom level", async () => {
            // The default zoom buckets are 10m below 14, 5m from 14, 2m from 16, 1m from 18
            const map = fakeMap({ zoom: 10 });
            const p = polyline({ path: longPath(50), simplify: 'zoom' });
            await p.setMap(map);
            expect(p.simplify).toBe(10);

            asFakeMap(map).zoomTo(16);
            expect(p.simplify).toBe(2);

            asFakeMap(map).zoomTo(18);
            expect(p.simplify).toBe(1);
        });

        it('does nothing when the zoom stays inside the same bucket', async () => {
            const map = fakeMap({ zoom: 16 });
            const p = polyline({ path: longPath(50), simplify: 'zoom' });
            await p.setMap(map);
            await tick();

            const before = mapsStats.callsTo('Polyline', 'setPath').length;
            asFakeMap(map).zoomTo(17); // still the 2m bucket
            expect(p.simplify).toBe(2);
            expect(mapsStats.callsTo('Polyline', 'setPath')).toHaveLength(before);
        });
    });

    // L-5: every polyline registers its own "idle" listener on the map.
    describe('the zoom listener (L-5)', () => {
        it('registers one idle listener per polyline when zoom buckets are used', async () => {
            const map = fakeMap();
            await polyline({ path: shortPath, simplify: 'zoom' }).setMap(map);
            expect(asFakeMap(map).listenerCount('idle')).toBe(1);

            await polyline({ path: shortPath, simplify: 'zoom' }).setMap(map);
            await polyline({ path: shortPath, simplify: 'zoom' }).setMap(map);
            expect(asFakeMap(map).listenerCount('idle')).toBe(3);
        });

        it('registers nothing when the tolerance does not change with zoom', async () => {
            const map = fakeMap();
            await polyline({ path: shortPath, simplify: 5 }).setMap(map);
            expect(asFakeMap(map).listenerCount('idle')).toBe(0);
        });

        it('removes the listener when the polyline leaves the map', async () => {
            const map = fakeMap();
            const p = polyline({ path: shortPath, simplify: 'zoom' });
            await p.setMap(map);
            expect(asFakeMap(map).listenerCount('idle')).toBe(1);

            await p.setMap(null);
            expect(asFakeMap(map).listenerCount('idle')).toBe(0);
        });
    });

    // L-4: setPath used to be called whenever the tolerance changed, with no check on whether
    // the resulting path was any different. shortPath has two points, so every tolerance draws
    // exactly the same thing, and the path is no longer sent for those bucket changes.
    describe('redundant setPath when the drawn path is unchanged (L-4)', () => {
        it('does not call setPath when the new tolerance draws the same points', async () => {
            const map = fakeMap({ zoom: 10 });
            const p = polyline({ path: shortPath, simplify: 'zoom' });
            await p.setMap(map);
            await tick();

            const before = mapsStats.callsTo('Polyline', 'setPath').length;
            asFakeMap(map).zoomTo(16);
            asFakeMap(map).zoomTo(18);

            const after = mapsStats.callsTo('Polyline', 'setPath').length;
            // Two bucket changes, both drawing the same two points, so nothing was sent
            expect(after - before).toBe(0);
        });

        // Skipping the send must not skip the tolerance itself, or the next change would be
        // compared against the wrong one.
        it('still applies the new tolerance even though nothing was sent', async () => {
            const map = fakeMap({ zoom: 10 });
            const p = polyline({ path: shortPath, simplify: 'zoom' });
            await p.setMap(map);
            await tick();
            expect(p.simplify).toBe(10);

            asFakeMap(map).zoomTo(16);
            expect(p.simplify).toBe(2);

            asFakeMap(map).zoomTo(18);
            expect(p.simplify).toBe(1);
        });

        // The skip must not get greedy. A path long enough for the tolerance to matter draws
        // different points in different buckets, and those still have to reach Google.
        it('still calls setPath when the new tolerance draws different points', async () => {
            const map = fakeMap({ zoom: 10 });
            const p = polyline({ path: wobblyPath(200), simplify: 'zoom' });
            await p.setMap(map);
            await tick();

            // What was drawn at the 10m bucket, from the constructor options. The 4m wobbles are
            // under that tolerance, so they're dropped here.
            const drawnAt10 = mapsStats.callsTo('Polyline', 'constructor')[0].args[0].path.length;
            const before = mapsStats.callsTo('Polyline', 'setPath').length;

            asFakeMap(map).zoomTo(18); // the 1m bucket keeps the wobbles
            const sent = mapsStats.callsTo('Polyline', 'setPath');

            expect(sent.length - before).toBe(1);
            expect(sent[sent.length - 1].args[0].length).toBeGreaterThan(drawnAt10);
        });

        // Changing the path throws the kept paths away, so there is nothing to compare against
        // and the new path is always sent.
        it('sends the path when the path itself changes', async () => {
            const p = polyline({ path: shortPath, simplify: 'zoom' });
            await p.toGoogle();

            const before = mapsStats.callsTo('Polyline', 'setPath').length;
            p.path = longPath(50);
            expect(mapsStats.callsTo('Polyline', 'setPath').length).toBeGreaterThan(before);
        });
    });

    // L-7: a plain polyline used to go through the dashed/icon setup, which resolved to options
    // that changed nothing and then called setOptions on the Google polyline. It now skips it.
    describe('the dashed/icon pass is skipped for a plain polyline (L-7)', () => {
        it('does not call setOptions on a plain polyline', async () => {
            const p = polyline({ path: shortPath, strokeOpacity: 0.5 });
            await p.toGoogle();
            await tick();

            expect(mapsStats.callsTo('Polyline', 'setOptions')).toHaveLength(0);
        });

        // The constructor options already carry strokeOpacity, which is the only thing the
        // skipped pass would have set for a plain polyline.
        it('still passes strokeOpacity to Google through the constructor', async () => {
            const p = polyline({ path: shortPath, strokeOpacity: 0.5 });
            await p.toGoogle();

            const built = mapsStats.callsTo('Polyline', 'constructor');
            expect(built[0].args[0]).toMatchObject({ strokeOpacity: 0.5 });
        });

        // The pass used to hold up setEventGoogleObject for a microtask. There is no tick()
        // here on purpose: the listener has to be attached by the time toGoogle() resolves.
        it('wires the Google listeners up without waiting for a microtask', async () => {
            const p = polyline({ path: shortPath });
            p.on('click', vi.fn());
            await p.toGoogle();

            expect(mapsStats.callsTo('Polyline', 'addListener')).toHaveLength(1);
        });

        // The skip must not get greedy. A polyline with icons still needs the pass, so it still
        // gets one setOptions call.
        //
        // The icon here has no symbol of its own on purpose. PolylineIcon.toGoogle() only awaits
        // when it has one, so this resolves - see the dashed test below for why that matters.
        it('still runs the pass for a polyline with icons', async () => {
            const p = polyline({ path: shortPath, icons: [{ offset: '50%', repeat: '100px' }] });
            await p.toGoogle();
            await tick();

            expect(mapsStats.callsTo('Polyline', 'setOptions')).toHaveLength(1);
        });

        // A dashed polyline also still needs the pass, but this checks the branch that was taken
        // rather than the setOptions call that follows it.
        //
        // The dashed pass can't finish under the test stub: it builds an SvgSymbol, and
        // SvgSymbol.toGoogle() (SvgSymbol.ts:471) waits on loader().onLoad(), which nothing
        // drives here, so the promise never settles. That was true before this change too - it
        // is a gap in the harness, not something this change introduced. What can be checked is
        // that a dashed polyline takes the deferred branch instead of the new immediate one.
        it('still defers a dashed polyline instead of wiring its events up at once', async () => {
            const p = polyline({ path: shortPath, dashed: true });
            p.on('click', vi.fn());
            await p.toGoogle();
            await tick();

            // The plain polyline above has its listener by this point. This one is still waiting.
            expect(mapsStats.callsTo('Polyline', 'addListener')).toHaveLength(0);
        });
    });

    describe('visibility', () => {
        it('hide() and show() flip the visible flag', async () => {
            const p = polyline({ path: shortPath });
            p.visible = true;
            expect(p.visible).toBe(true);
            p.hide();
            expect(p.visible).toBe(false);
            await p.show();
            expect(p.visible).toBe(true);
        });

        it('pushes the change to Google once the polyline is drawn', async () => {
            const p = polyline({ path: shortPath });
            await p.toGoogle();
            p.visible = false;
            expect(mapsStats.callsTo('Polyline', 'setVisible')).toHaveLength(1);
        });
    });

    describe('setters after the polyline is drawn', () => {
        it('strokeColor, strokeWeight and zIndex push to Google', async () => {
            const p = polyline({ path: shortPath });
            await p.toGoogle();
            await tick();
            const before = mapsStats.callsTo('Polyline', 'setOptions').length;

            p.strokeColor = '#000';
            p.strokeWeight = 8;
            p.zIndex = 3;

            expect(mapsStats.callsTo('Polyline', 'setOptions').length - before).toBe(3);
            expect(p.strokeColor).toBe('#000');
            expect(p.strokeWeight).toBe(8);
            expect(p.zIndex).toBe(3);
        });

        it('changing the path pushes it to Google', async () => {
            const p = polyline({ path: shortPath });
            await p.toGoogle();
            const before = mapsStats.callsTo('Polyline', 'setPath').length;
            p.setPath(longPath(20));
            expect(mapsStats.callsTo('Polyline', 'setPath').length - before).toBe(1);
        });

        it('setters do nothing to Google while the polyline is not drawn', () => {
            const p = polyline({ path: shortPath });
            p.strokeColor = '#000';
            p.zIndex = 3;
            p.setPath(longPath(20));
            expect(mapsStats.callsTo('Polyline', 'setOptions')).toHaveLength(0);
            expect(mapsStats.callsTo('Polyline', 'setPath')).toHaveLength(0);
        });
    });

    describe('clone', () => {
        it('copies the path and the data without drawing anything', () => {
            const p = polyline({ path: longPath(20), strokeColor: '#abc', data: { id: 1 } });
            const clone = p.clone();
            expect(clone).not.toBe(p);
            expect(clone.path).toHaveLength(20);
            expect(clone.strokeColor).toBe('#abc');
            expect(clone.getData('id')).toBe(1);
            expect(mapsStats.countOf('Polyline')).toBe(0);
        });
    });
});
