/* ===========================================================================
    Tests for the Size class.

    Size is the smallest of the three primitives and the most consistent. The notable
    things locked in here are that it defaults to 0/0 where Point leaves its values
    undefined, and that its toGoogle() reuses one Google object and writes through to it,
    the same way Point does and unlike LatLng.
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { Size, size } from '../src/lib/Size';
import { installGoogleMaps, mapsStats, uninstallGoogleMaps } from './support/googleMaps';

describe('building a Size', () => {
    it('takes two numbers', () => {
        const s = size(10, 20);
        expect(s.width).toBe(10);
        expect(s.height).toBe(20);
        expect(s.getWidth()).toBe(10);
        expect(s.getHeight()).toBe(20);
    });

    it('takes an array, an object and another Size', () => {
        expect(size([10, 20]).width).toBe(10);
        expect(size({ width: 10, height: 20 }).height).toBe(20);
        expect(size(new Size(10, 20)).width).toBe(10);
    });

    it('takes number strings', () => {
        const s = size('10', '20');
        expect(s.width).toBe(10);
        expect(s.height).toBe(20);
    });

    // Unlike Point, which leaves x/y undefined, Size defaults both values to 0 in the
    // constructor. That also means a Size built with no values reports as valid.
    it('defaults to 0 and reports as valid when built with no values', () => {
        const s = new Size();
        expect(s.width).toBe(0);
        expect(s.height).toBe(0);
        expect(s.isValid()).toBe(true);
    });

    it('always returns a new object, even when given a Size (C-6)', () => {
        const original = new Size(1, 2);
        const copy = size(original);
        expect(copy).not.toBe(original);
        copy.width = 99;
        expect(original.width).toBe(1);
    });
});

describe('setters', () => {
    it('sets through the setters and the set* methods', () => {
        const s = new Size(1, 2);
        s.setWidth(10).setHeight(20);
        expect(s.width).toBe(10);
        expect(s.height).toBe(20);
    });

    it('set() replaces both values and returns itself', () => {
        const s = new Size(1, 2);
        expect(s.set(5, 6)).toBe(s);
        expect(s.width).toBe(5);
        expect(s.height).toBe(6);
    });

    it('ignores values that are not numbers', () => {
        const s = new Size(1, 2);
        s.width = 'nope' as unknown as number;
        expect(s.width).toBe(1);
    });

    it('clone makes an independent copy', () => {
        const s = new Size(1, 2);
        const c = s.clone();
        expect(c).not.toBe(s);
        c.width = 99;
        expect(s.width).toBe(1);
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
        const s = size(10, 20);
        expect(mapsStats.countOf('Size')).toBe(0);
        s.toGoogle();
        expect(mapsStats.countOf('Size')).toBe(1);
    });

    it('reuses the same Google object and writes changes through to it', () => {
        const s = size(10, 20);
        const first = s.toGoogle();
        s.width = 50;
        const second = s.toGoogle();
        expect(second).toBe(first);
        expect((first as unknown as { width: number }).width).toBe(50);
        expect(mapsStats.countOf('Size')).toBe(1);
    });

    // toGoogle() is typed as returning `google.maps.Size | null`, but the null branch is
    // unreachable: checkForGoogleMaps() throws by default, so it never returns false here.
    // Recorded so the dead branch is not mistaken for working error handling.
    it('throws rather than returning null when Google Maps has not loaded', () => {
        uninstallGoogleMaps();
        expect(() => size(10, 20).toGoogle()).toThrow(/Google Maps/);
    });
});
