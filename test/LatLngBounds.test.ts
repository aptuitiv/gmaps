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

import { describe, expect, it, vi } from 'vitest';
import { LatLngBounds, latLngBounds } from '../src/lib/LatLngBounds';
import { LatLng } from '../src/lib/LatLng';

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
    });
});
