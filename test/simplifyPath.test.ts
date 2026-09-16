/* ===========================================================================
    Tests for the path simplifying helpers.

    These matter more than most. L-3 in the plan replaces the algorithm with a
    precomputed per-point significance array, which is NOT guaranteed to pick the same
    points as running Ramer-Douglas-Peucker fresh at each tolerance. What it must keep is
    the guarantee the option actually makes: the drawn line stays within the tolerance of
    the original path, and the end points are never dropped.

    So the tolerance check below is written as a real geometric property rather than a
    fixed expected point count. A count assertion would break on a correct reimplementation.
=========================================================================== */

import { describe, expect, it } from 'vitest';
import {
    coordsFromPath,
    DEFAULT_SIMPLIFY_TOLERANCE,
    DEFAULT_SIMPLIFY_ZOOM,
    simplifyCoords,
    simplifyPath,
} from '../src/lib/simplifyPath';
import { LatLng } from '../src/lib/LatLng';

const EARTH_RADIUS = 6378137;

/**
 * Project latitude/longitude pairs to x/y metres, the same way simplifyCoords does.
 *
 * @param {Float64Array} coords The latitude/longitude pairs
 * @param {number} meanLat The mean latitude of the original path
 * @returns {{x: number[], y: number[]}}
 */
const project = (coords: Float64Array, meanLat: number) => {
    const metersPerLat = (Math.PI / 180) * EARTH_RADIUS;
    const metersPerLng = metersPerLat * Math.cos((meanLat * Math.PI) / 180);
    const x: number[] = [];
    const y: number[] = [];
    for (let i = 0; i < coords.length; i += 2) {
        x.push(coords[i + 1] * metersPerLng);
        y.push(coords[i] * metersPerLat);
    }
    return { x, y };
};

/**
 * The distance, in metres, from a point to a line segment
 *
 * @param {number} px The point x
 * @param {number} py The point y
 * @param {number} ax The segment start x
 * @param {number} ay The segment start y
 * @param {number} bx The segment end x
 * @param {number} by The segment end y
 * @returns {number}
 */
const distanceToSegment = (px: number, py: number, ax: number, ay: number, bx: number, by: number): number => {
    const dx = bx - ax;
    const dy = by - ay;
    let cx = ax;
    let cy = ay;
    if (dx !== 0 || dy !== 0) {
        const t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy);
        if (t > 1) {
            cx = bx;
            cy = by;
        } else if (t > 0) {
            cx = ax + dx * t;
            cy = ay + dy * t;
        }
    }
    return Math.hypot(px - cx, py - cy);
};

/**
 * The furthest any point of the original path is from the simplified line, in metres.
 *
 * This is the guarantee the simplify option makes, so it is what a reimplementation has to keep.
 *
 * @param {Float64Array} original The original latitude/longitude pairs
 * @param {Float64Array} simplified The simplified latitude/longitude pairs
 * @returns {number}
 */
const maxDeviation = (original: Float64Array, simplified: Float64Array): number => {
    let latTotal = 0;
    const count = original.length / 2;
    for (let i = 0; i < count; i += 1) {
        latTotal += original[i * 2];
    }
    const meanLat = latTotal / count;
    const from = project(original, meanLat);
    const to = project(simplified, meanLat);

    let worst = 0;
    for (let i = 0; i < from.x.length; i += 1) {
        let best = Infinity;
        for (let j = 0; j < to.x.length - 1; j += 1) {
            best = Math.min(best, distanceToSegment(from.x[i], from.y[i], to.x[j], to.y[j], to.x[j + 1], to.y[j + 1]));
        }
        worst = Math.max(worst, best);
    }
    return worst;
};

/**
 * Build a wobbly track that has points worth dropping
 *
 * @param {number} count The number of points
 * @returns {object[]}
 */
const track = (count: number) => {
    const points = [];
    for (let i = 0; i < count; i += 1) {
        points.push({
            lat: 48.85 + i * 0.00003 + Math.sin(i / 3) * 0.000004,
            lng: 2.35 + i * 0.00003 + Math.cos(i / 5) * 0.000004,
        });
    }
    return points;
};

describe('constants', () => {
    it('the default tolerance is 2 metres', () => {
        expect(DEFAULT_SIMPLIFY_TOLERANCE).toBe(2);
    });

    it('the default zoom tolerances are frozen and cover the documented levels', () => {
        expect(DEFAULT_SIMPLIFY_ZOOM).toEqual({ 0: 10, 14: 5, 16: 2, 18: 1 });
        expect(Object.isFrozen(DEFAULT_SIMPLIFY_ZOOM)).toBe(true);
    });
});

describe('coordsFromPath', () => {
    it('returns an empty array for a non-array', () => {
        expect(coordsFromPath(undefined as never)).toHaveLength(0);
    });

    it('flattens {lat, lng} objects into pairs of numbers', () => {
        const coords = coordsFromPath([
            { lat: 1, lng: 2 },
            { lat: 3, lng: 4 },
        ]);
        expect(coords).toBeInstanceOf(Float64Array);
        expect(Array.from(coords)).toEqual([1, 2, 3, 4]);
    });

    it('accepts [lat, lng] arrays', () => {
        expect(Array.from(coordsFromPath([[1, 2]]))).toEqual([1, 2]);
    });

    it('accepts {latitude, longitude} objects', () => {
        expect(Array.from(coordsFromPath([{ latitude: 1, longitude: 2 }]))).toEqual([1, 2]);
    });

    it('accepts LatLng objects', () => {
        expect(Array.from(coordsFromPath([new LatLng(1, 2)]))).toEqual([1, 2]);
    });

    it('accepts number strings', () => {
        expect(Array.from(coordsFromPath([{ lat: '1', lng: '2' }] as never))).toEqual([1, 2]);
    });

    it('leaves out invalid points and trims the array', () => {
        const coords = coordsFromPath([{ lat: 1, lng: 2 }, { lat: 'nope' }, null, { lat: 5, lng: 6 }] as never);
        expect(Array.from(coords)).toEqual([1, 2, 5, 6]);
    });

    it('creates no LatLng objects for plain input', () => {
        // The whole point of holding the path as numbers
        const coords = coordsFromPath(track(500));
        expect(coords).toBeInstanceOf(Float64Array);
        expect(coords).toHaveLength(1000);
    });
});

describe('simplifyCoords', () => {
    it('returns the same array when there is nothing to do', () => {
        const coords = coordsFromPath(track(2));
        expect(simplifyCoords(coords, 5)).toBe(coords);
    });

    it('returns the same array for a tolerance of 0 or less', () => {
        const coords = coordsFromPath(track(50));
        expect(simplifyCoords(coords, 0)).toBe(coords);
        expect(simplifyCoords(coords, -1)).toBe(coords);
    });

    it('removes points', () => {
        const coords = coordsFromPath(track(400));
        const simplified = simplifyCoords(coords, 10);
        expect(simplified.length).toBeLessThan(coords.length);
        expect(simplified.length).toBeGreaterThanOrEqual(4);
    });

    it('always keeps the first and last points', () => {
        const coords = coordsFromPath(track(400));
        const simplified = simplifyCoords(coords, 25);
        expect(simplified[0]).toBe(coords[0]);
        expect(simplified[1]).toBe(coords[1]);
        expect(simplified[simplified.length - 2]).toBe(coords[coords.length - 2]);
        expect(simplified[simplified.length - 1]).toBe(coords[coords.length - 1]);
    });

    it('a bigger tolerance never keeps more points', () => {
        const coords = coordsFromPath(track(400));
        const counts = [1, 2, 5, 10, 25].map((t) => simplifyCoords(coords, t).length);
        for (let i = 1; i < counts.length; i += 1) {
            expect(counts[i]).toBeLessThanOrEqual(counts[i - 1]);
        }
    });

    // THE guarantee. A reimplementation (L-3) may pick different points, but it must not
    // let the drawn line wander further than the tolerance from the original path.
    it.each([1, 2, 5, 10, 25])('stays within a %i metre tolerance of the original path', (tolerance) => {
        const coords = coordsFromPath(track(400));
        const simplified = simplifyCoords(coords, tolerance);
        // A small epsilon for floating point and the flat-earth projection
        expect(maxDeviation(coords, simplified)).toBeLessThanOrEqual(tolerance + 0.001);
    });

    it('does not change the array it was given', () => {
        const coords = coordsFromPath(track(100));
        const before = Array.from(coords);
        simplifyCoords(coords, 10);
        expect(Array.from(coords)).toEqual(before);
    });
});

describe('simplifyPath', () => {
    it('returns LatLng objects', () => {
        const result = simplifyPath(track(100), 10);
        expect(result[0]).toBeInstanceOf(LatLng);
        expect(result.length).toBeLessThan(100);
    });

    it('always returns new LatLng objects, never the ones it was given', () => {
        const input = [new LatLng(48.85, 2.35), new LatLng(48.86, 2.36)];
        const result = simplifyPath(input, 2);
        expect(result).toHaveLength(2);
        expect(result[0]).not.toBe(input[0]);
        expect(result[0].lat).toBeCloseTo(input[0].lat);
    });

    it('returns every valid point when the tolerance is not usable', () => {
        expect(simplifyPath(track(20), 0)).toHaveLength(20);
    });

    it('uses the default tolerance when none is given', () => {
        const withDefault = simplifyPath(track(400));
        const explicit = simplifyPath(track(400), DEFAULT_SIMPLIFY_TOLERANCE);
        expect(withDefault).toHaveLength(explicit.length);
    });

    it('returns an empty array for an empty path', () => {
        expect(simplifyPath([], 5)).toEqual([]);
    });
});
