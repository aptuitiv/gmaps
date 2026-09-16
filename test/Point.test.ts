/* ===========================================================================
    Tests for the Point class.

    Point is created in large numbers (overlay offsets, anchors, pixel positions), so
    the plan proposes a (number, number) fast path (C-7), cheaper cache checks (M11) and
    a cheaper equals (C-13).

    Point is also the class whose header comment does not match its behavior - see the
    QUIRK block below. Those tests exist so that making it genuinely immutable is a
    deliberate, breaking change rather than an accident.
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Point, point } from '../src/lib/Point';
import { installGoogleMaps, mapsStats, uninstallGoogleMaps } from './support/googleMaps';

describe('building a Point', () => {
    it('takes two numbers', () => {
        const p = point(3, 4);
        expect(p.x).toBe(3);
        expect(p.y).toBe(4);
        expect(p.getX()).toBe(3);
        expect(p.getY()).toBe(4);
    });

    it('takes an array, an object and another Point', () => {
        expect(point([3, 4]).x).toBe(3);
        expect(point({ x: 3, y: 4 }).y).toBe(4);
        expect(point(new Point(3, 4)).x).toBe(3);
    });

    it('takes number strings', () => {
        const p = point('3', '4');
        expect(p.x).toBe(3);
        expect(p.y).toBe(4);
    });

    // Note the difference from LatLng and Size: LatLng returns 0 for unset values and Size
    // defaults to 0 in its constructor, but Point leaves x/y undefined.
    it('leaves x and y undefined when built with no values', () => {
        const p = new Point();
        expect(p.x).toBeUndefined();
        expect(p.y).toBeUndefined();
        expect(p.isValid()).toBe(false);
    });

    it('isValid needs both values to be numbers', () => {
        expect(point(3, 4).isValid()).toBe(true);
        expect(new Point(3).isValid()).toBe(false);
    });

    it('always returns a new object, even when given a Point (C-6)', () => {
        const original = new Point(1, 2);
        const copy = point(original);
        expect(copy).not.toBe(original);
        copy.x = 99;
        expect(original.x).toBe(1);
    });
});

describe('setters', () => {
    it('sets through the setters and the set* methods', () => {
        const p = new Point(1, 2);
        p.setX(10).setY(20);
        expect(p.x).toBe(10);
        expect(p.y).toBe(20);
    });

    it('set() replaces both values and returns itself', () => {
        const p = new Point(1, 2);
        expect(p.set(5, 6)).toBe(p);
        expect(p.x).toBe(5);
        expect(p.y).toBe(6);
    });

    it('ignores values that are not numbers', () => {
        const p = new Point(1, 2);
        p.x = 'nope' as unknown as number;
        expect(p.x).toBe(1);
    });
});

describe('maths', () => {
    it('add returns a NEW point and leaves the original alone', () => {
        const p = new Point(1, 2);
        const result = p.add(10, 20);
        expect(result).not.toBe(p);
        expect(result.x).toBe(11);
        expect(result.y).toBe(22);
        expect(p.x).toBe(1);
    });

    it('distanceTo measures the cartesian distance', () => {
        expect(new Point(0, 0).distanceTo([3, 4])).toBe(5);
    });

    it('equals compares values, not identity', () => {
        const p = new Point(1, 2);
        expect(p.equals(new Point(1, 2))).toBe(true);
        expect(p.equals([1, 2])).toBe(true);
        expect(p.equals({ x: 9, y: 9 })).toBe(false);
    });

    it('clone makes an independent copy', () => {
        const p = new Point(1, 2);
        const c = p.clone();
        expect(c).not.toBe(p);
        c.x = 99;
        expect(p.x).toBe(1);
    });
});

// QUIRK, and a real inconsistency.
//
// The file header says "The Point value is immutable. Adding, subtracting, or changing the
// x/y values will return a new Point object." That is only true of add(). Every other
// operation mutates in place and returns `this`.
//
// This is L9/C-18 territory in ai-plans/active/performance-improvements.md, and it is what
// blocks interning or pooling Points. Making these return new objects would be a breaking
// change for anyone calling them for their side effect, so it is parked for a major version.
// These tests record the behavior as it actually is.
describe('mutating operations (contradict the "immutable" header comment)', () => {
    it('subtract mutates and returns itself', () => {
        const p = new Point(10, 20);
        const result = p.subtract(1, 2);
        expect(result).toBe(p);
        expect(p.x).toBe(9);
        expect(p.y).toBe(18);
    });

    it('ceil, floor, round and trunc all mutate and return themselves', () => {
        const ceil = new Point(1.2, 1.2);
        expect(ceil.ceil()).toBe(ceil);
        expect(ceil.x).toBe(2);

        const floor = new Point(1.8, 1.8);
        expect(floor.floor()).toBe(floor);
        expect(floor.x).toBe(1);

        const round = new Point(1.5, 1.4);
        expect(round.round()).toBe(round);
        expect(round.x).toBe(2);
        expect(round.y).toBe(1);

        const trunc = new Point(1.9, -1.9);
        expect(trunc.trunc()).toBe(trunc);
        expect(trunc.x).toBe(1);
        expect(trunc.y).toBe(-1);
    });

    it('divide mutates, and does nothing when dividing by zero', () => {
        const p = new Point(10, 20);
        expect(p.divide(2)).toBe(p);
        expect(p.x).toBe(5);
        p.divide(0);
        expect(p.x).toBe(5);
    });

    it('multiply mutates, and does nothing when multiplying by zero', () => {
        const p = new Point(10, 20);
        expect(p.multiply(3)).toBe(p);
        expect(p.x).toBe(30);
        // Guarded by `num !== 0`, so multiplying by zero is silently ignored
        p.multiply(0);
        expect(p.x).toBe(30);
    });
});

describe('toGoogle', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
    });

    it('does not build anything until toGoogle is called', () => {
        const p = point(1, 2);
        expect(mapsStats.countOf('Point')).toBe(0);
        p.toGoogle();
        expect(mapsStats.countOf('Point')).toBe(1);
    });

    // Point differs from LatLng here. LatLng rebuilds the Google object when the values
    // change; Point keeps one object and writes the new values into it through the setters.
    it('reuses the same Google object and writes changes through to it', () => {
        const p = point(1, 2);
        const first = p.toGoogle();
        p.x = 50;
        const second = p.toGoogle();
        expect(second).toBe(first);
        expect((first as unknown as { x: number }).x).toBe(50);
        expect(mapsStats.countOf('Point')).toBe(1);
    });

    it('throws when Google Maps has not loaded', () => {
        uninstallGoogleMaps();
        expect(() => point(1, 2).toGoogle()).toThrow(/Google Maps/);
    });
});
