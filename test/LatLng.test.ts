/* ===========================================================================
    Tests for the LatLng class.

    LatLng is created in enormous numbers, so several changes are planned for it:
    a fast path for the (number, number) case (C-7), removing #valuesChanged (C-12),
    and a cheaper equals() (C-13). These tests lock in what it does now so that those
    changes have to keep the behavior.
=========================================================================== */

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { LatLng, latLng, latLngConvert } from '../src/lib/LatLng';
import { installGoogleMaps, mapsStats, uninstallGoogleMaps } from './support/googleMaps';

describe('building a LatLng', () => {
    it('takes two numbers', () => {
        const ll = latLng(1.5, -2.5);
        expect(ll.lat).toBe(1.5);
        expect(ll.lng).toBe(-2.5);
        expect(ll.latitude).toBe(1.5);
        expect(ll.longitude).toBe(-2.5);
    });

    it('takes an array', () => {
        const ll = latLng([1.5, -2.5]);
        expect(ll.lat).toBe(1.5);
        expect(ll.lng).toBe(-2.5);
    });

    it('takes a {lat, lng} literal', () => {
        const ll = latLng({ lat: 1.5, lng: -2.5 });
        expect(ll.lat).toBe(1.5);
        expect(ll.lng).toBe(-2.5);
    });

    it('takes a {latitude, longitude} literal', () => {
        const ll = latLng({ latitude: 1.5, longitude: -2.5 });
        expect(ll.lat).toBe(1.5);
        expect(ll.lng).toBe(-2.5);
    });

    it('takes number strings', () => {
        const ll = latLng('1.5', '-2.5');
        expect(ll.lat).toBe(1.5);
        expect(ll.lng).toBe(-2.5);
    });

    it('takes another LatLng', () => {
        const ll = latLng(new LatLng(1.5, -2.5));
        expect(ll.lat).toBe(1.5);
        expect(ll.lng).toBe(-2.5);
    });

    // C-6 in the plan proposes returning the argument unchanged when it is already a LatLng.
    // That would be an aliasing change, so the current copying behavior is locked in here.
    // If C-6 is ever applied to the exported factory, this test must be changed deliberately.
    it('always returns a new object, even when given a LatLng (C-6)', () => {
        const original = new LatLng(1, 2);
        const copy = latLng(original);
        expect(copy).not.toBe(original);
        copy.lat = 99;
        expect(original.lat).toBe(1);
    });

    it('defaults to 0 for values that were never set', () => {
        const ll = new LatLng();
        expect(ll.lat).toBe(0);
        expect(ll.lng).toBe(0);
        expect(ll.isValid()).toBe(false);
    });

    it('ignores values that are not numbers', () => {
        const ll = new LatLng();
        ll.latitude = 'not a number' as unknown as number;
        expect(ll.lat).toBe(0);
        expect(ll.isValid()).toBe(false);
    });
});

describe('isValid', () => {
    it('needs both values', () => {
        expect(new LatLng(1, 2).isValid()).toBe(true);
        expect(new LatLng(1).isValid()).toBe(false);
        expect(new LatLng().isValid()).toBe(false);
    });
});

describe('changing values', () => {
    it('sets through the setters and the set* methods', () => {
        const ll = new LatLng(1, 2);
        ll.setLat(10).setLng(20);
        expect(ll.getLat()).toBe(10);
        expect(ll.getLng()).toBe(20);

        ll.lat = 30;
        ll.lng = 40;
        expect(ll.lat).toBe(30);
        expect(ll.lng).toBe(40);
    });

    it('set() replaces both values and returns itself', () => {
        const ll = new LatLng(1, 2);
        expect(ll.set(5, 6)).toBe(ll);
        expect(ll.lat).toBe(5);
        expect(ll.lng).toBe(6);
    });
});

describe('equals, clone and toJson', () => {
    it('equals compares values, not identity', () => {
        const a = new LatLng(1, 2);
        expect(a.equals(new LatLng(1, 2))).toBe(true);
        expect(a.equals([1, 2])).toBe(true);
        expect(a.equals({ lat: 1, lng: 2 })).toBe(true);
        expect(a.equals(new LatLng(9, 9))).toBe(false);
    });

    it('clone makes an independent copy', () => {
        const a = new LatLng(1, 2);
        const b = a.clone();
        expect(b).not.toBe(a);
        expect(b.lat).toBe(1);
        b.lat = 99;
        expect(a.lat).toBe(1);
    });

    it('toJson returns a plain literal', () => {
        expect(new LatLng(1, 2).toJson()).toEqual({ lat: 1, lng: 2 });
    });
});

describe('toGoogle', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
    });

    it('builds a google.maps.LatLng with the right values', () => {
        const google = (globalThis as { google?: { maps: { LatLng: unknown } } }).google!;
        const result = new LatLng(1.5, -2.5).toGoogle();
        expect(result).toBeInstanceOf(google.maps.LatLng as never);
        expect((result as unknown as { lat(): number }).lat()).toBe(1.5);
        expect((result as unknown as { lng(): number }).lng()).toBe(-2.5);
    });

    // The Google object is built lazily and cached. This is already correct and the
    // #valuesChanged removal in C-12 must keep both halves of it working.
    it('creates the Google object only once while the values are unchanged', () => {
        const ll = new LatLng(1, 2);
        const first = ll.toGoogle();
        const second = ll.toGoogle();
        expect(second).toBe(first);
        expect(mapsStats.countOf('LatLng')).toBe(1);
    });

    it('builds a new Google object after a value changes', () => {
        const ll = new LatLng(1, 2);
        const first = ll.toGoogle();
        ll.lat = 5;
        const second = ll.toGoogle();
        expect(second).not.toBe(first);
        expect((second as unknown as { lat(): number }).lat()).toBe(5);
        expect(mapsStats.countOf('LatLng')).toBe(2);
    });

    it('does not build anything until toGoogle is called', () => {
        const ll = new LatLng(1, 2);
        expect(mapsStats.countOf('LatLng')).toBe(0);
        ll.toGoogle();
        expect(mapsStats.countOf('LatLng')).toBe(1);
    });

    it('throws when the pair is not valid', () => {
        expect(() => new LatLng().toGoogle()).toThrow(/Invalid latitude\/longitude pair/);
    });
});

describe('latLngConvert', () => {
    beforeEach(() => {
        installGoogleMaps();
    });

    afterEach(() => {
        uninstallGoogleMaps();
    });

    it('turns a Google LatLng into a library LatLng', () => {
        const google = (globalThis as { google?: { maps: { LatLng: new (a: number, b: number) => never } } }).google!;
        const converted = latLngConvert(new google.maps.LatLng(3, 4));
        expect(converted).toBeInstanceOf(LatLng);
        expect(converted.lat).toBe(3);
        expect(converted.lng).toBe(4);
    });
});
