/* ===========================================================================
    Javascript for the Bounds Benchmark page

    This page decides whether the remaining Phase 4 items (C-5, C-15, C-17, D-3)
    are worth implementing. They are all "build fewer objects while working out a
    bounds", and they all share one unanswered question: does anything build a
    bounds over enough points for it to matter?

    Two rules shaped this file.

    1. Measure library operations, not primitives. Timing bounds.extend() in a
       tight loop over two million points would produce a big number and justify
       the work whether or not any real code path does that. dataLayer.getBounds()
       and map.addToBounds() are what an application actually calls.

    2. There is nothing to compare against, because the optimizations have not
       been written. So each scenario also runs a numeric floor over the same
       coordinates - plain min/max on a Float64Array, allocating nothing - and
       the gap between the two is the CEILING on what the change could recover.
       The real change will fall short of it: for the data layer, Google's own
       forEachLatLng() hands back a google.maps.LatLng per coordinate regardless
       of anything this library does.
=========================================================================== */

/* global G, apiKey */

// A small map. It exists to load the Google Maps library and to draw the data when that is
// asked for. Scenario A's layer is deliberately not attached to it by default.
const map = G.map('#map1', { apiKey, center: { lat: 48.85, lng: 2.35 }, zoom: 9 });

const resultsBody = document.getElementById('results');
const stat = (id) => document.getElementById(id);

// The area that test data is generated inside
const area = { minLat: 48.6, maxLat: 49.1, minLng: 2.0, maxLng: 2.7 };

// The layer built by the last scenario A run, so that it can be cleared before the next one
let layerA = null;

/**
 * Make a seeded random number generator so that two runs with the same settings build the
 * same data. Without that, a before/after comparison measures different data as well as
 * different code. This is mulberry32, the same generator the stress page uses.
 *
 * @param {number} seed The seed value
 * @returns {Function} A function that returns a number from 0 up to but not including 1
 */
const makeRandom = (seed) => {
    let a = seed >>> 0;
    return () => {
        a += 0x6d2b79f5;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};

/**
 * Get the used JS memory in MB. Only available in Chrome.
 *
 * @returns {string}
 */
const heapMb = () => (performance.memory ? (performance.memory.usedJSHeapSize / 1048576).toFixed(1) : 'n/a');

/**
 * The median of a list of numbers.
 *
 * The median rather than the mean, because the first run pays for lazy compilation and a
 * mean lets that one outlier move the answer.
 *
 * @param {number[]} values The values
 * @returns {number}
 */
const median = (values) => {
    const sorted = values.slice().sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
};

/**
 * Time a synchronous function a number of times and return the median in milliseconds
 *
 * @param {number} runs How many times to run it
 * @param {Function} fn The function to time
 * @returns {number}
 */
const timeSync = (runs, fn) => {
    const times = [];
    for (let i = 0; i < runs; i += 1) {
        const start = performance.now();
        fn();
        times.push(performance.now() - start);
    }
    return median(times);
};

/**
 * Time an async function a number of times and return the median in milliseconds
 *
 * @param {number} runs How many times to run it
 * @param {Function} fn The function to time
 * @returns {Promise<number>}
 */
const timeAsync = async (runs, fn) => {
    const times = [];
    for (let i = 0; i < runs; i += 1) {
        const start = performance.now();
        // eslint-disable-next-line no-await-in-loop
        await fn();
        times.push(performance.now() - start);
    }
    return median(times);
};

/**
 * Reduce a flat [lat, lng, lat, lng, ...] array to its corners with no allocation at all.
 *
 * This is the floor: the least work any implementation could possibly do for the same answer.
 * Nothing can beat it, and the real optimization will not reach it.
 *
 * @param {Float64Array} coords The flat coordinates
 * @returns {object} The corners
 */
const numericFloor = (coords) => {
    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLng = Infinity;
    let maxLng = -Infinity;
    for (let i = 0; i < coords.length; i += 2) {
        const lat = coords[i];
        const lng = coords[i + 1];
        if (lat < minLat) { minLat = lat; }
        if (lat > maxLat) { maxLat = lat; }
        if (lng < minLng) { minLng = lng; }
        if (lng > maxLng) { maxLng = lng; }
    }
    return { minLat, maxLat, minLng, maxLng };
};

/**
 * Work out the verdict for a saving, using the rule stated on the page
 *
 * @param {number} savingMs The ceiling on the saving, in milliseconds
 * @returns {object} The verdict text and the class name
 */
const verdictFor = (savingMs) => {
    if (savingMs < 5) {
        return {
            text: `Not worth doing. The most this change could ever recover is ${savingMs.toFixed(1)} ms, `
                + 'and the real change recovers less than that. Leave the item struck.',
            className: 'is-not-worth',
            short: 'Not worth it',
        };
    }
    if (savingMs < 50) {
        return {
            text: `Borderline. The ceiling is ${savingMs.toFixed(1)} ms, so do this only if it also `
                + 'makes the code simpler. Judge it on the code, not on the clock.',
            className: '',
            short: 'Borderline',
        };
    }
    return {
        text: `Worth doing. The ceiling is ${savingMs.toFixed(1)} ms, which is a cost a user can feel `
            + 'on a page load. Confirm it on the slowest device you support before writing the code.',
        className: 'is-worth',
        short: 'Worth doing',
    };
};

/**
 * Add a row to the results table
 *
 * @param {object} run The run values
 */
const addResult = (run) => {
    const row = document.createElement('tr');
    const percent = run.operationMs > 0 ? ((run.savingMs / run.operationMs) * 100).toFixed(0) : '0';
    const cells = [
        run.scenario,
        run.size,
        run.coords,
        run.operationMs.toFixed(1),
        run.floorMs.toFixed(1),
        run.savingMs.toFixed(1),
        `${percent}%`,
        run.heap,
        run.verdict,
    ];
    row.innerHTML = cells.map((value) => `<td>${value}</td>`).join('');
    resultsBody.prepend(row);
};

/**
 * Show a verdict in one of the verdict boxes
 *
 * @param {string} id The element id
 * @param {object} verdict The verdict from verdictFor()
 */
const showVerdict = (id, verdict) => {
    const element = stat(id);
    element.textContent = verdict.text;
    element.className = `BenchVerdict ${verdict.className}`;
};

/* ---------------------------------------------------------------------------
    Scenario A - data layer bounds (D-3, and C-5 underneath it)

    DataLayer.#bounds() walks every coordinate of every feature, calling
    latLngConvert() and then extend() on each one. getBounds() is that walk on
    its own; fitBounds() would also move the Google viewport and swamp it.
--------------------------------------------------------------------------- */

/**
 * Build a FeatureCollection of LineStrings, and the same coordinates as a flat array
 *
 * @param {number} featureCount How many features
 * @param {number} pointsPer How many points in each one
 * @param {number} seed The random seed
 * @returns {object} The GeoJson and the flat coordinates
 */
const buildGeoJson = (featureCount, pointsPer, seed) => {
    const random = makeRandom(seed);
    const features = [];
    const coords = new Float64Array(featureCount * pointsPer * 2);
    let at = 0;
    for (let f = 0; f < featureCount; f += 1) {
        // Start each track somewhere in the area and walk it, so that the shape is like a
        // real GPS track rather than random noise
        let lat = area.minLat + random() * (area.maxLat - area.minLat);
        let lng = area.minLng + random() * (area.maxLng - area.minLng);
        let heading = random() * Math.PI * 2;
        const points = [];
        for (let p = 0; p < pointsPer; p += 1) {
            heading += (random() - 0.5) * 0.3;
            lat += Math.sin(heading) * 0.00004;
            lng += Math.cos(heading) * 0.00004;
            // GeoJson is [lng, lat], which is the opposite order from everything else here
            points.push([lng, lat]);
            coords[at] = lat;
            coords[at + 1] = lng;
            at += 2;
        }
        features.push({
            type: 'Feature',
            properties: { name: `Track ${f + 1}` },
            geometry: { type: 'LineString', coordinates: points },
        });
    }
    return { geoJson: { type: 'FeatureCollection', features }, coords };
};

document.getElementById('controlsA').addEventListener('submit', async (event) => {
    event.preventDefault();
    const featureCount = Number(stat('features').value);
    const pointsPer = Number(stat('pointsPer').value);
    const runs = Number(stat('runsA').value);
    const seed = Number(stat('seedA').value);
    const attach = stat('attach').checked;
    const coordCount = featureCount * pointsPer;

    stat('verdictA').textContent = 'Building the data...';
    stat('verdictA').className = 'BenchVerdict';
    // Let the browser paint that before the work starts
    await new Promise((resolve) => { setTimeout(resolve, 0); });

    if (layerA) {
        await layerA.setMap(null);
        layerA = null;
    }

    const { geoJson, coords } = buildGeoJson(featureCount, pointsPer, seed);

    layerA = G.dataLayer();
    if (attach) {
        await layerA.setMap(map);
    }

    const loadStart = performance.now();
    await layerA.addGeoJson(geoJson, { fitBounds: false });
    const loadMs = performance.now() - loadStart;

    // The measurement. getBounds() is DataLayer.#bounds() with nothing else in it.
    const getBoundsMs = await timeAsync(runs, () => layerA.getBounds());
    const floorMs = timeSync(runs, () => numericFloor(coords));
    const savingMs = getBoundsMs - floorMs;
    const verdict = verdictFor(savingMs);

    stat('statFeatures').textContent = featureCount.toLocaleString();
    stat('statCoords').textContent = coordCount.toLocaleString();
    stat('statLoadMs').textContent = `${loadMs.toFixed(1)} ms`;
    stat('statGetBoundsMs').textContent = `${getBoundsMs.toFixed(1)} ms`;
    stat('statFloorAMs').textContent = `${floorMs.toFixed(1)} ms`;
    stat('statSaveAMs').textContent = `${savingMs.toFixed(1)} ms`;
    showVerdict('verdictA', verdict);

    addResult({
        scenario: 'A - dataLayer.getBounds() (D-3, C-5)',
        size: `${featureCount.toLocaleString()} features x ${pointsPer.toLocaleString()}`,
        coords: coordCount.toLocaleString(),
        operationMs: getBoundsMs,
        floorMs,
        savingMs,
        heap: heapMb(),
        verdict: verdict.short,
    });
});

/* ---------------------------------------------------------------------------
    Scenario B - map.addToBounds() (C-5)

    Public API that takes an array. LatLngBounds.extend() builds a LatLng per
    entry, which is exactly what C-5 would remove.
--------------------------------------------------------------------------- */

document.getElementById('controlsB').addEventListener('submit', async (event) => {
    event.preventDefault();
    const count = Number(stat('positions').value);
    const runs = Number(stat('runsB').value);
    const seed = Number(stat('seedB').value);

    stat('verdictB').textContent = 'Building the data...';
    stat('verdictB').className = 'BenchVerdict';
    await new Promise((resolve) => { setTimeout(resolve, 0); });

    const random = makeRandom(seed);
    const positions = [];
    const coords = new Float64Array(count * 2);
    for (let i = 0; i < count; i += 1) {
        const lat = area.minLat + random() * (area.maxLat - area.minLat);
        const lng = area.minLng + random() * (area.maxLng - area.minLng);
        positions.push([lat, lng]);
        coords[i * 2] = lat;
        coords[i * 2 + 1] = lng;
    }

    // clearBounds() before each run so that every run does the same work
    const addMs = timeSync(runs, () => {
        map.clearBounds();
        map.addToBounds(positions);
    });
    const floorMs = timeSync(runs, () => numericFloor(coords));
    const savingMs = addMs - floorMs;
    const verdict = verdictFor(savingMs);

    map.clearBounds();

    stat('statPositions').textContent = count.toLocaleString();
    stat('statAddMs').textContent = `${addMs.toFixed(1)} ms`;
    stat('statFloorBMs').textContent = `${floorMs.toFixed(1)} ms`;
    stat('statSaveBMs').textContent = `${savingMs.toFixed(1)} ms`;
    showVerdict('verdictB', verdict);

    addResult({
        scenario: 'B - map.addToBounds() (C-5)',
        size: `${count.toLocaleString()} positions`,
        coords: count.toLocaleString(),
        operationMs: addMs,
        floorMs,
        savingMs,
        heap: heapMb(),
        verdict: verdict.short,
    });
});

/* ---------------------------------------------------------------------------
    Scenario C - contains() in a loop (C-17)

    Nothing in the library does this any more. It is here only so that an
    application that calls contains() over many points can measure its own case.
--------------------------------------------------------------------------- */

document.getElementById('controlsC').addEventListener('submit', async (event) => {
    event.preventDefault();
    const count = Number(stat('checks').value);
    const runs = Number(stat('runsC').value);

    stat('verdictC').textContent = 'Building the data...';
    stat('verdictC').className = 'BenchVerdict';
    await new Promise((resolve) => { setTimeout(resolve, 0); });

    const random = makeRandom(1);
    const positions = [];
    const coords = new Float64Array(count * 2);
    for (let i = 0; i < count; i += 1) {
        const lat = area.minLat + random() * (area.maxLat - area.minLat);
        const lng = area.minLng + random() * (area.maxLng - area.minLng);
        positions.push([lat, lng]);
        coords[i * 2] = lat;
        coords[i * 2 + 1] = lng;
    }

    const bounds = G.latLngBounds([
        [area.minLat + 0.1, area.minLng + 0.1],
        [area.maxLat - 0.1, area.maxLng - 0.1],
    ]);
    // Make sure the Google bounds object exists before timing, so that the first run is not
    // measuring the library building it
    await bounds.toGoogle();

    const containsMs = timeSync(runs, () => {
        let inside = 0;
        for (let i = 0; i < positions.length; i += 1) {
            if (bounds.contains(positions[i])) { inside += 1; }
        }
        return inside;
    });

    // The floor for contains() is four numeric comparisons per point
    const floorMs = timeSync(runs, () => {
        let inside = 0;
        const sw = { lat: area.minLat + 0.1, lng: area.minLng + 0.1 };
        const ne = { lat: area.maxLat - 0.1, lng: area.maxLng - 0.1 };
        for (let i = 0; i < coords.length; i += 2) {
            const lat = coords[i];
            const lng = coords[i + 1];
            if (lat >= sw.lat && lat <= ne.lat && lng >= sw.lng && lng <= ne.lng) { inside += 1; }
        }
        return inside;
    });
    const savingMs = containsMs - floorMs;
    const verdict = verdictFor(savingMs);

    stat('statChecks').textContent = count.toLocaleString();
    stat('statContainsMs').textContent = `${containsMs.toFixed(1)} ms`;
    stat('statFloorCMs').textContent = `${floorMs.toFixed(1)} ms`;
    stat('statSaveCMs').textContent = `${savingMs.toFixed(1)} ms`;
    showVerdict('verdictC', verdict);

    addResult({
        scenario: 'C - bounds.contains() loop (C-17)',
        size: `${count.toLocaleString()} calls`,
        coords: count.toLocaleString(),
        operationMs: containsMs,
        floorMs,
        savingMs,
        heap: heapMb(),
        verdict: verdict.short,
    });
});
