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

    Paths are held as latitude/longitude pairs of plain numbers in a Float64Array
    rather than as LatLng objects. A path with a lot of points then uses a small
    fraction of the memory, and no objects are created for a path that is only drawn.
=========================================================================== */

import { isNumber, isObject } from './helpers';
import { latLng, LatLng, LatLngValue } from './LatLng';

// The tolerance, in meters, that is used when simplifying is turned on without a tolerance
export const DEFAULT_SIMPLIFY_TOLERANCE = 2;

/**
 * The default tolerances, in meters, for different zoom levels.
 *
 * Each key is a zoom level and its value is the tolerance to use at that zoom level and higher.
 * Below zoom 14, 10 meters is less than half a pixel on the map. Through zoom 17 the drawn line stays
 * within about 2 pixels of the original path. From zoom 18, 1 meter is smaller than the few meters
 * that GPS points are usually accurate to.
 */
export const DEFAULT_SIMPLIFY_ZOOM: { readonly [zoom: number]: number } = Object.freeze({ 0: 10, 14: 5, 16: 2, 18: 1 });

// The radius of the earth in meters. This is used to convert degrees to meters.
const EARTH_RADIUS = 6378137;

/**
 * Get a number from a value that should be a number or a number string
 *
 * @param {unknown} value The value to get the number from
 * @returns {number|undefined} Undefined if the value isn't a usable number
 */
const getNumberValue = (value: unknown): number | undefined => {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : undefined;
    }
    if (typeof value === 'string' && value.trim().length > 0) {
        const num = Number(value);
        return Number.isFinite(num) ? num : undefined;
    }
    return undefined;
};

/**
 * Convert a path to latitude/longitude pairs of plain numbers.
 *
 * Invalid points are left out. The returned array holds the latitude and longitude of each
 * point one after the other, so it has two values for every point.
 *
 * @param {LatLngValue[]} path The points to convert
 * @returns {Float64Array}
 */
export const coordsFromPath = (path: LatLngValue[]): Float64Array => {
    if (!Array.isArray(path)) {
        return new Float64Array(0);
    }
    const coords = new Float64Array(path.length * 2);
    let count = 0;
    path.forEach((value) => {
        let latitude: number | undefined;
        let longitude: number | undefined;
        if (value instanceof LatLng) {
            if (value.isValid()) {
                latitude = value.latitude;
                longitude = value.longitude;
            }
        } else if (Array.isArray(value)) {
            latitude = getNumberValue(value[0]);
            longitude = getNumberValue(value[1]);
        } else if (isObject(value)) {
            const object = value as { lat?: unknown; lng?: unknown; latitude?: unknown; longitude?: unknown };
            latitude = getNumberValue(object.lat) ?? getNumberValue(object.latitude);
            longitude = getNumberValue(object.lng) ?? getNumberValue(object.longitude);
            if (typeof latitude === 'undefined' || typeof longitude === 'undefined') {
                // This handles the Google maps LatLng object, which has lat() and lng() functions
                const point = latLng(value);
                if (point.isValid()) {
                    latitude = point.latitude;
                    longitude = point.longitude;
                }
            }
        }
        if (typeof latitude === 'number' && typeof longitude === 'number') {
            coords[count * 2] = latitude;
            coords[count * 2 + 1] = longitude;
            count += 1;
        }
    });
    // Trim the array if any of the points were invalid
    return count * 2 === coords.length ? coords : coords.slice(0, count * 2);
};

/**
 * Simplify latitude/longitude pairs of plain numbers so that there are fewer points
 * but the path keeps the same shape.
 *
 * The same array is returned if there is nothing to do, so the returned value shouldn't be changed.
 *
 * @param {Float64Array} coords The latitude/longitude pairs to simplify
 * @param {number} [tolerance] How far, in meters, the simplified line can be from the original line. Defaults to 2 meters.
 * @returns {Float64Array}
 */
export const simplifyCoords = (
    coords: Float64Array,
    tolerance: number = DEFAULT_SIMPLIFY_TOLERANCE,
): Float64Array => {
    const count = coords.length / 2;
    if (count <= 2 || !isNumber(tolerance) || tolerance <= 0) {
        return coords;
    }

    // Convert the points to x/y values in meters so that distances can be compared to the tolerance.
    // This flattens the earth around the average latitude of the path. That's accurate enough for the
    // distances of a few meters that are compared to the tolerance.
    let latitudeTotal = 0;
    for (let i = 0; i < count; i += 1) {
        latitudeTotal += coords[i * 2];
    }
    const metersPerLatDegree = (Math.PI / 180) * EARTH_RADIUS;
    const metersPerLngDegree = metersPerLatDegree * Math.cos(((latitudeTotal / count) * Math.PI) / 180);
    const xs = new Float64Array(count);
    const ys = new Float64Array(count);
    for (let i = 0; i < count; i += 1) {
        xs[i] = coords[i * 2 + 1] * metersPerLngDegree;
        ys[i] = coords[i * 2] * metersPerLatDegree;
    }

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

    // Build the path from the points that are kept
    let keptCount = 0;
    for (let i = 0; i < count; i += 1) {
        keptCount += keep[i];
    }
    const simplified = new Float64Array(keptCount * 2);
    let index = 0;
    for (let i = 0; i < count; i += 1) {
        if (keep[i] === 1) {
            simplified[index * 2] = coords[i * 2];
            simplified[index * 2 + 1] = coords[i * 2 + 1];
            index += 1;
        }
    }
    return simplified;
};

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
    const coords = simplifyCoords(coordsFromPath(path), tolerance);
    const points: LatLng[] = [];
    for (let i = 0; i < coords.length; i += 2) {
        points.push(latLng(coords[i], coords[i + 1]));
    }
    return points;
};
