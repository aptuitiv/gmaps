/* ===========================================================================
    Tests for the LatLngBounds class.

    This is Phase 0 priority 5, and it exists mainly to gate Phase 4.

    Phase 4 proposes dropping #boundValues - the array that keeps a {lat, lng} literal for
    every point ever passed to extend() - and building the Google bounds from the maintained
    corners instead. The class itself explains why that is risky (LatLngBounds.ts:94-99):
    extend() always picks the smaller box, so rebuilding from two corners can silently lose a
    bounds that crosses the 180 degree meridian or spans more than 180 degrees.

    So the corner arithmetic is characterised here in detail, with the meridian cases first.
    If Phase 4 changes any of these answers, it has changed behaviour rather than just
    memory use.

    Everything below runs without the Google Maps library, which is deliberate: it exercises
    the library's own manual arithmetic rather than Google's.
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LatLngBounds, latLngBounds } from '../src/lib/LatLngBounds';
import { LatLng } from '../src/lib/LatLng';
// Only the last describe in this file needs these. Everything above it runs without the Google
// Maps library on purpose, so that it exercises the library's own arithmetic.
import { installGoogleMaps, uninstallGoogleMaps } from './support/googleMaps';

describe('building a bounds', () => {
    it('starts empty', () => {
        const bounds = new LatLngBounds();
        expect(bounds.isEmpty()).toBe(true);
        expect(bounds.getNorthEast()).toBeUndefined();
        expect(bounds.getSouthWest()).toBeUndefined();
    });

    it('takes a single point', () => {
        const bounds = latLngBounds([1, 2]);
        expect(bounds.isEmpty()).toBe(false);
        expect(bounds.getNorthEast()!.lat).toBe(1);
        expect(bounds.getSouthWest()!.lng).toBe(2);
    });

    it('takes an array of points', () => {
        const bounds = latLngBounds([
            [1, 2],
            [5, 8],
            [3, 4],
        ]);
        expect(bounds.getNorthEast()!.lat).toBe(5);
        expect(bounds.getNorthEast()!.lng).toBe(8);
        expect(bounds.getSouthWest()!.lat).toBe(1);
        expect(bounds.getSouthWest()!.lng).toBe(2);
    });

    it('takes ne and sw corners', () => {
        const bounds = latLngBounds({ ne: [5, 8], sw: [1, 2] });
        expect(bounds.getNorthEast()!.lat).toBe(5);
        expect(bounds.getSouthWest()!.lng).toBe(2);
    });

    it('takes a north/south/east/west literal', () => {
        const bounds = latLngBounds({ north: 5, south: 1, east: 8, west: 2 });
        expect(bounds.getNorthEast()!.lat).toBe(5);
        expect(bounds.getNorthEast()!.lng).toBe(8);
        expect(bounds.getSouthWest()!.lat).toBe(1);
        expect(bounds.getSouthWest()!.lng).toBe(2);
    });

    it('returns the same object when the factory is given a LatLngBounds', () => {
        const bounds = latLngBounds([1, 2]);
        expect(latLngBounds(bounds)).toBe(bounds);
    });

    it('copies the corners rather than holding the objects it was given', () => {
        const ne = new LatLng(5, 8);
        const bounds = latLngBounds({ ne, sw: [1, 2] });
        ne.lat = 99;
        expect(bounds.getNorthEast()!.lat).toBe(5);
    });
});

describe('extend', () => {
    it('grows the box to include each point', () => {
        const bounds = new LatLngBounds();
        bounds.extend([1, 2]);
        bounds.extend([5, 8]);
        expect(bounds.getNorthEast()!.lat).toBe(5);
        expect(bounds.getSouthWest()!.lat).toBe(1);
    });

    it('is chainable and takes every LatLng form', () => {
        const bounds = new LatLngBounds();
        expect(bounds.extend([1, 2])).toBe(bounds);
        bounds.extend({ lat: 5, lng: 8 });
        bounds.extend(new LatLng(-3, -4));
        expect(bounds.getNorthEast()!.lat).toBe(5);
        expect(bounds.getSouthWest()!.lat).toBe(-3);
    });

    it('takes an array of points in one call', () => {
        const bounds = new LatLngBounds();
        bounds.extend([
            [1, 2],
            [5, 8],
        ]);
        expect(bounds.getNorthEast()!.lat).toBe(5);
    });

    it('throws on an invalid point', () => {
        expect(() => new LatLngBounds().extend(['a', 'b'] as never)).toThrow(/Invalid latitude\/longitude/);
    });

    it('warns rather than throwing on an empty array', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        expect(() => new LatLngBounds().extend([])).not.toThrow();
        expect(warn).toHaveBeenCalled();
        warn.mockRestore();
    });

    it('does not modify the LatLng it was given', () => {
        const point = new LatLng(1, 2);
        const bounds = new LatLngBounds();
        bounds.extend(point);
        bounds.extend([9, 9]);
        expect(point.lat).toBe(1);
        expect(point.lng).toBe(2);
    });
});

// The part that gates Phase 4. extend() moves whichever edge needs the smaller change, which
// is what keeps a bounds correct across the 180 degree meridian.
describe('crossing the 180 degree meridian', () => {
    it('wraps rather than spanning the long way round', () => {
        const bounds = new LatLngBounds();
        bounds.extend([0, 170]);
        bounds.extend([0, -170]);

        // West edge stays at 170 and the east edge moves to -170, a 20 degree span across the
        // meridian - not a 340 degree span the other way.
        expect(bounds.getSouthWest()!.lng).toBe(170);
        expect(bounds.getNorthEast()!.lng).toBe(-170);
    });

    it('knows what is inside a wrapped bounds', () => {
        const bounds = new LatLngBounds();
        bounds.extend([0, 170]);
        bounds.extend([0, -170]);

        expect(bounds.contains([0, 175])).toBe(true);
        expect(bounds.contains([0, -175])).toBe(true);
        expect(bounds.contains([0, 180])).toBe(true);
        // The far side of the globe is outside
        expect(bounds.contains([0, 0])).toBe(false);
        expect(bounds.contains([0, 100])).toBe(false);
    });

    it('keeps a wrapped bounds when it is built from corners directly', () => {
        // #setCorners stores the corners as given, so the wrap survives
        const bounds = latLngBounds({ ne: [10, -170], sw: [-10, 170] });
        expect(bounds.getSouthWest()!.lng).toBe(170);
        expect(bounds.getNorthEast()!.lng).toBe(-170);
        expect(bounds.contains([0, 175])).toBe(true);
        expect(bounds.contains([0, 0])).toBe(false);
    });

    it('extends a wrapped bounds on whichever side is closer', () => {
        const bounds = new LatLngBounds();
        bounds.extend([0, 170]);
        bounds.extend([0, -170]);

        // 160 is closer to the west edge, so the west edge moves
        bounds.extend([0, 160]);
        expect(bounds.getSouthWest()!.lng).toBe(160);
        expect(bounds.getNorthEast()!.lng).toBe(-170);
    });

    // Section 6.7, fixed in Phase 2.
    //
    // getCenter() used to average the two longitudes and normalise, without adding the missing
    // 360 for a wrapped bounds, so west 170 / east -170 gave 0 - the opposite side of the globe.
    // A full turn is now added to the east longitude before averaging.
    it('gets the centre of a wrapped bounds right', () => {
        const bounds = new LatLngBounds();
        bounds.extend([10, 170]);
        bounds.extend([-10, -170]);

        const center = bounds.getCenter();
        expect(center.lat).toBe(0);
        // The middle of a bounds running 170 east to -170 is the antimeridian
        expect(center.lng).toBe(180);
    });

    /*
        intersects() compared the longitudes as plain numbers, which is wrong for a bounds that
        crosses the meridian. A bounds running 170 east to -170 has a west edge that is
        numerically greater than its east edge, so it looked like it started to the east of
        anything near the meridian and missed it. The class already handles this wrap for a
        single longitude in #containsLongitude(), and for extend(); intersects() was the one
        place that didn't.

        Both directions are asserted everywhere below. The wrapped-against-normal case is
        written as two separate arms in the source, so a mistake in one of them would show up
        as the two bounds disagreeing about whether they touch.
    */
    it('a wrapped bounds intersects one that overlaps it across the meridian', async () => {
        const wrapped = latLngBounds({ ne: [10, -170], sw: [-10, 170] });
        const other = latLngBounds({ ne: [10, -160], sw: [-10, -175] });

        await expect(wrapped.intersects(other)).resolves.toBe(true);
        await expect(other.intersects(wrapped)).resolves.toBe(true);
    });

    it('a wrapped bounds intersects one on its eastern arm', async () => {
        const wrapped = latLngBounds({ ne: [10, -170], sw: [-10, 170] });
        const other = latLngBounds({ ne: [10, 179], sw: [-10, 175] });

        await expect(wrapped.intersects(other)).resolves.toBe(true);
        await expect(other.intersects(wrapped)).resolves.toBe(true);
    });

    it('a wrapped bounds does not intersect one on the far side of the globe', async () => {
        const wrapped = latLngBounds({ ne: [10, -170], sw: [-10, 170] });
        const other = latLngBounds({ ne: [10, 20], sw: [-10, 0] });

        await expect(wrapped.intersects(other)).resolves.toBe(false);
        await expect(other.intersects(wrapped)).resolves.toBe(false);
    });

    // Two wrapped bounds both contain the meridian, so they always share at least that
    it('two wrapped bounds always intersect', async () => {
        const first = latLngBounds({ ne: [10, -170], sw: [-10, 170] });
        const second = latLngBounds({ ne: [10, -150], sw: [-10, 160] });

        await expect(first.intersects(second)).resolves.toBe(true);
        await expect(second.intersects(first)).resolves.toBe(true);
    });

    // The longitudes overlap across the meridian but the latitudes are nowhere near each other
    it('still answers no when the longitudes wrap but the latitudes miss', async () => {
        const wrapped = latLngBounds({ ne: [10, -170], sw: [-10, 170] });
        const other = latLngBounds({ ne: [80, -160], sw: [70, -175] });

        await expect(wrapped.intersects(other)).resolves.toBe(false);
        await expect(other.intersects(wrapped)).resolves.toBe(false);
    });

    it('gets the centre right for a wrapped bounds that is not symmetrical', () => {
        const bounds = new LatLngBounds();
        bounds.extend([0, 170]);
        bounds.extend([0, -150]);

        // 170 east to -150 spans 40 degrees, so the middle is -170
        expect(bounds.getCenter().lng).toBe(-170);
    });

    it('gets the centre right for an ordinary bounds', () => {
        const bounds = new LatLngBounds();
        bounds.extend([0, 10]);
        bounds.extend([10, 20]);

        const center = bounds.getCenter();
        expect(center.lat).toBe(5);
        expect(center.lng).toBe(15);
    });
});

describe('contains', () => {
    it('includes the edges', () => {
        const bounds = latLngBounds({ ne: [10, 20], sw: [0, 10] });
        expect(bounds.contains([0, 10])).toBe(true);
        expect(bounds.contains([10, 20])).toBe(true);
        expect(bounds.contains([5, 15])).toBe(true);
    });

    it('excludes points outside', () => {
        const bounds = latLngBounds({ ne: [10, 20], sw: [0, 10] });
        expect(bounds.contains([11, 15])).toBe(false);
        expect(bounds.contains([5, 21])).toBe(false);
    });

    it('is false for an empty bounds', () => {
        expect(new LatLngBounds().contains([1, 2])).toBe(false);
    });

    it('throws on an invalid point', () => {
        expect(() => latLngBounds([1, 2]).contains(['a', 'b'] as never)).toThrow(/Invalid latitude\/longitude/);
    });
});

describe('equals and intersects', () => {
    it('two bounds with the same corners are equal', async () => {
        const a = latLngBounds({ ne: [10, 20], sw: [0, 10] });
        const b = latLngBounds({ ne: [10, 20], sw: [0, 10] });
        await expect(a.equals(b)).resolves.toBe(true);
    });

    it('different corners are not equal', async () => {
        const a = latLngBounds({ ne: [10, 20], sw: [0, 10] });
        const b = latLngBounds({ ne: [11, 20], sw: [0, 10] });
        await expect(a.equals(b)).resolves.toBe(false);
    });

    it('an empty bounds does not equal one with values', async () => {
        await expect(latLngBounds({ ne: [10, 20], sw: [0, 10] }).equals(new LatLngBounds())).resolves.toBe(false);
    });

    // equals() used to read this bounds' corners before checking whether it had any, and
    // #getCorners() throws for a bounds with none. So asking whether two empty bounds were
    // equal threw instead of answering. equals() returns a boolean, so it needs an answer
    // for an empty bounds - and it already had one for an empty bounds on the other side.
    it('two empty bounds are equal', async () => {
        await expect(new LatLngBounds().equals(new LatLngBounds())).resolves.toBe(true);
    });

    it('an empty bounds compared with one that has values is not equal, either way round', async () => {
        const empty = new LatLngBounds();
        const full = latLngBounds({ ne: [10, 20], sw: [0, 10] });

        await expect(empty.equals(full)).resolves.toBe(false);
        await expect(full.equals(empty)).resolves.toBe(false);
    });

    // intersects() has always read its corners through the getters, which return undefined for
    // an empty bounds, and answered false when any of them is missing. That is the shape
    // equals() now has too.
    it('an empty bounds does not intersect anything', async () => {
        const empty = new LatLngBounds();
        const full = latLngBounds({ ne: [10, 20], sw: [0, 10] });

        await expect(empty.intersects(full)).resolves.toBe(false);
        await expect(full.intersects(empty)).resolves.toBe(false);
        await expect(empty.intersects(new LatLngBounds())).resolves.toBe(false);
    });

    it('is false for anything that is not a LatLngBounds', async () => {
        await expect(latLngBounds([1, 2]).equals('nope' as never)).resolves.toBe(false);
    });

    it('overlapping bounds intersect', async () => {
        const a = latLngBounds({ ne: [10, 20], sw: [0, 10] });
        const b = latLngBounds({ ne: [15, 25], sw: [5, 15] });
        await expect(a.intersects(b)).resolves.toBe(true);
    });

    it('separate bounds do not intersect', async () => {
        const a = latLngBounds({ ne: [10, 20], sw: [0, 10] });
        const b = latLngBounds({ ne: [50, 60], sw: [40, 50] });
        await expect(a.intersects(b)).resolves.toBe(false);
    });

    it('an empty bounds intersects nothing', async () => {
        await expect(new LatLngBounds().intersects(latLngBounds([1, 2]))).resolves.toBe(false);
    });
});

describe('output formats', () => {
    it('toJson uses the compass names', () => {
        expect(latLngBounds({ ne: [10, 20], sw: [0, 5] }).toJson()).toEqual({
            north: 10,
            east: 20,
            south: 0,
            west: 5,
        });
    });

    it('toString puts south-west first', () => {
        expect(latLngBounds({ ne: [10, 20], sw: [0, 5] }).toString()).toBe('(0, 5) (10, 20)');
    });

    it('toUrlValue rounds to three decimals by default', () => {
        const bounds = latLngBounds({ ne: [10.123456, 20.123456], sw: [0.123456, 5.123456] });
        expect(bounds.toUrlValue()).toBe('0.123,5.123,10.123,20.123');
    });

    it('toUrlValue takes a precision', () => {
        const bounds = latLngBounds({ ne: [10.123456, 20.123456], sw: [0.123456, 5.123456] });
        expect(bounds.toUrlValue(1)).toBe('0.1,5.1,10.1,20.1');
    });

    // Fixed in Phase 2. `precision || 3` treated 0 as missing and silently used 3.
    it('toUrlValue accepts a precision of 0', () => {
        const bounds = latLngBounds({ ne: [10.123456, 20.123456], sw: [0.123456, 5.123456] });
        expect(bounds.toUrlValue(0)).toBe('0,5,10,20');
    });

    it('the output formats throw on an empty bounds', () => {
        const bounds = new LatLngBounds();
        expect(() => bounds.toJson()).toThrow(/empty/);
        expect(() => bounds.toString()).toThrow(/empty/);
        expect(() => bounds.getCenter()).toThrow(/empty/);
        expect(() => bounds.toUrlValue()).toThrow(/empty/);
    });

    it('the error says which method was called', () => {
        const bounds = new LatLngBounds();
        expect(() => bounds.getCenter()).toThrow(/getCenter/);
        expect(() => bounds.toJson()).toThrow(/toJson/);
    });
});

/* ===========================================================================
    The same four methods, once the Google bounds object exists.

    Each of them asks Google for the answer when the Google object has been built, and only
    works the corners out itself otherwise. Google answers for an empty bounds rather than
    complaining - its getCenter() hands back a position, its toJSON() a literal of zeros - so
    these used to throw before the Google library had loaded and return a meaningless value
    afterwards. The same call on the same empty bounds, with the answer depending on timing.

    They are checked for being empty before the Google object is used now, so both paths agree.
=========================================================================== */
describe('the output formats on an empty bounds that has a Google object', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
    });

    it('still throws once the Google bounds has been built', async () => {
        const bounds = new LatLngBounds();
        // Builds the Google object, which is what used to change the answer
        await bounds.toGoogle();

        expect(() => bounds.getCenter()).toThrow(/empty/);
        expect(() => bounds.toJson()).toThrow(/empty/);
        expect(() => bounds.toString()).toThrow(/empty/);
        expect(() => bounds.toUrlValue()).toThrow(/empty/);
    });

    it('still answers normally for a bounds that has points', async () => {
        const bounds = latLngBounds({ ne: [10, 20], sw: [0, 5] });
        await bounds.toGoogle();

        expect(() => bounds.getCenter()).not.toThrow();
        expect(bounds.getCenter().lat).toBe(5);
        expect(bounds.toJson()).toEqual({ east: 20, north: 10, south: 0, west: 5 });
    });
});
