/* ===========================================================================
    Simplifies a path of latitude/longitude points so that it has fewer points
    but keeps the same shape.

    This uses the Ramer-Douglas-Peucker algorithm. It draws a straight line from
    the first point to the last and finds the point that is furthest from it. If
    that point is within the tolerance then all the points in between are dropped.
    Otherwise that point is kept, the path is split there, and each half is checked
    the same way. The first and last points are always kept.

    This is useful for paths with a lot of points, like GPS tracks, which often
    have far more points than can be seen on the map.
=========================================================================== */

import { isNumber } from './helpers';
import { latLng, LatLng, LatLngValue } from './LatLng';

// The tolerance, in meters, that is used when simplifying is turned on without a tolerance
export const DEFAULT_SIMPLIFY_TOLERANCE = 2;

// The radius of the earth in meters. This is used to convert degrees to meters.
const EARTH_RADIUS = 6378137;

/**
 * Simplify a path of latitude/longitude points so that it has fewer points but keeps the same shape.
 *
 * The simplified line stays within the tolerance of the original line. Invalid points are ignored.
 * If the tolerance isn't a number greater than 0 then all the valid points are returned.
 *
 * @param {LatLngValue[]} path The points to simplify
 * @param {number} [tolerance] How far, in meters, the simplified line can be from the original line. Defaults to 2 meters.
 * @returns {LatLng[]}
 */
export const simplifyPath = (path: LatLngValue[], tolerance: number = DEFAULT_SIMPLIFY_TOLERANCE): LatLng[] => {
    const points: LatLng[] = [];
    if (Array.isArray(path)) {
        path.forEach((value) => {
            // Use existing LatLng objects as they are so that they aren't copied
            const point = value instanceof LatLng ? value : latLng(value);
            if (point.isValid()) {
                points.push(point);
            }
        });
    }
    const count = points.length;
    if (count <= 2 || !isNumber(tolerance) || tolerance <= 0) {
        return points;
    }

    // Convert the points to x/y values in meters so that distances can be compared to the tolerance.
    // This flattens the earth around the average latitude of the path. That's accurate enough for the
    // distances of a few meters that are compared to the tolerance.
    const averageLatitude = points.reduce((sum, point) => sum + point.latitude, 0) / count;
    const metersPerLatDegree = (Math.PI / 180) * EARTH_RADIUS;
    const metersPerLngDegree = metersPerLatDegree * Math.cos((averageLatitude * Math.PI) / 180);
    const xs = new Float64Array(count);
    const ys = new Float64Array(count);
    points.forEach((point, index) => {
        xs[index] = point.longitude * metersPerLngDegree;
        ys[index] = point.latitude * metersPerLatDegree;
    });

    /**
     * Get the squared distance from a point to the line segment between two other points
     *
     * @param {number} index The index of the point
     * @param {number} first The index of the point at the start of the line segment
     * @param {number} last The index of the point at the end of the line segment
     * @returns {number}
     */
    const segmentDistanceSquared = (index: number, first: number, last: number): number => {
        let x = xs[first];
        let y = ys[first];
        let dx = xs[last] - x;
        let dy = ys[last] - y;
        if (dx !== 0 || dy !== 0) {
            // Find the closest spot on the line segment to the point
            const t = ((xs[index] - x) * dx + (ys[index] - y) * dy) / (dx * dx + dy * dy);
            if (t > 1) {
                x = xs[last];
                y = ys[last];
            } else if (t > 0) {
                x += dx * t;
                y += dy * t;
            }
        }
        dx = xs[index] - x;
        dy = ys[index] - y;
        return dx * dx + dy * dy;
    };

    // Holds which points to keep. The first and last points are always kept.
    const keep = new Uint8Array(count);
    keep[0] = 1;
    keep[count - 1] = 1;
    const toleranceSquared = tolerance * tolerance;

    // Use a stack of [first, last] index pairs instead of recursion so that long paths can't overflow the call stack
    const stack: number[] = [0, count - 1];
    while (stack.length > 0) {
        const last = stack.pop() as number;
        const first = stack.pop() as number;
        let maxDistance = 0;
        let furthest = -1;
        for (let i = first + 1; i < last; i += 1) {
            const distance = segmentDistanceSquared(i, first, last);
            if (distance > maxDistance) {
                maxDistance = distance;
                furthest = i;
            }
        }
        if (furthest !== -1 && maxDistance > toleranceSquared) {
            // The furthest point is outside the tolerance so keep it and check each side of it
            keep[furthest] = 1;
            stack.push(first, furthest, furthest, last);
        }
    }

    return points.filter((point, index) => keep[index] === 1);
};
