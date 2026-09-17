/* ===========================================================================
    Javascript for the Stress Test page

    Builds a lot of polylines and a lot of markers at the same time, each with
    its own tooltip and popup, so that the combination can be measured. This is
    the shape of a real trail map: many short segments plus many points of
    interest, all with something attached to them.

    The other test pages each measure one thing. This one exists because the
    expensive part is the combination, and because nothing else creates N
    polylines that each carry a tooltip and a popup.

    Everything is generated from a seed so that two runs with the same settings
    build the same geometry. Without that, a before/after comparison is
    measuring different data as well as different code.
=========================================================================== */

/* global G */

const map = G.map('#map1', { apiKey: apiKey, center: { latitude: 48.85, longitude: 2.35 }, zoom: 11 });

const form = document.getElementById('controls');
const zoomTestButton = document.getElementById('zoomTest');
const showHiddenButton = document.getElementById('showHidden');
const resultsBody = document.getElementById('results');
const stat = (id) => document.getElementById(id);

// The area that everything is generated inside. Used for fitting the map as well, so that
// fitBounds() doesn't have to walk every point. Fitting over 400,000 points would make this
// page mostly a measurement of fitBounds().
const area = { minLat: 48.6, maxLat: 49.1, minLng: 2.0, maxLng: 2.7 };

// A simple SVG icon to compare against the default Google pin
const svgIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">' +
    '<circle cx="10" cy="10" r="8" fill="#d62828" stroke="#fff" stroke-width="2"/></svg>';

// What's on the map
let polylines = [];
let markers = [];

// The one tooltip and popup used for everything with the "shared" option.
// They're created the first time they're needed.
let sharedTooltip = null;
let sharedPopup = null;

// The current test run. Each time things are built a new run is added to the results table.
let currentRun = null;

// Frame rate tracking
let frames = 0;
let windowStart = performance.now();
let movedInWindow = false;
let lowestFps = null;
let isZoomTestRunning = false;

/**
 * Make a seeded random number generator so that the same seed builds the same geometry.
 *
 * This is mulberry32. It's small, fast and good enough for test data.
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

// The generator for the current run. Replaced each time things are built.
let random = makeRandom(1);

/**
 * Get a random position inside the generation area
 *
 * @returns {object}
 */
const randomPosition = () => ({
    latitude: area.minLat + random() * (area.maxLat - area.minLat),
    longitude: area.minLng + random() * (area.maxLng - area.minLng),
});

/**
 * Make a GPS-like track: steps of about 4 meters with gradual turns and a little GPS noise.
 *
 * This is the same shape of data as the polyline simplify page, so that the simplify option
 * behaves the same way here.
 *
 * @param {number} count The number of points
 * @returns {object[]}
 */
const gpsTrack = (count) => {
    const points = [];
    const start = randomPosition();
    let lat = start.latitude;
    let lng = start.longitude;
    let heading = random() * Math.PI * 2;
    for (let i = 0; i < count; i += 1) {
        heading += (random() - 0.5) * 0.3;
        const step = 4 / 111320;
        lat += Math.cos(heading) * step + (random() - 0.5) * 0.00002;
        lng += (Math.sin(heading) * step) / Math.cos((lat * Math.PI) / 180) + (random() - 0.5) * 0.00002;
        points.push({ latitude: lat, longitude: lng });
    }
    return points;
};

/**
 * Get the used JS memory in MB. This is only available in Chrome.
 *
 * @returns {string}
 */
const heapMb = () => (performance.memory ? (performance.memory.usedJSHeapSize / 1048576).toFixed(1) : 'n/a');

/**
 * Get the value for the polyline simplify option from the form
 *
 * @returns {number|string} A tolerance in meters, or 'zoom' for the default zoom levels
 */
const simplifyValue = () => (form.simplify.value === 'zoom' ? 'zoom' : Number(form.simplify.value));

/**
 * Make sure the shared tooltip and popup exist
 */
const setUpSharedOverlays = () => {
    if (!sharedTooltip) {
        sharedTooltip = G.tooltip({ content: ' ' });
        sharedPopup = G.popup({ content: ' ' });
    }
};

/**
 * Give an object the shared tooltip and popup, with its own content.
 *
 * This is the "one tooltip and one popup for everything" comparison. Only one of them can be
 * visible at a time anyway, so this is what the per-object version is measured against.
 *
 * @param {object} item The marker or polyline
 * @param {string} tooltipText The tooltip content
 * @param {string} popupHtml The popup content
 * @param {object} fallbackPosition The position to use when the event has no position
 */
const useSharedOverlays = (item, tooltipText, popupHtml, fallbackPosition) => {
    setUpSharedOverlays();
    item.on('mouseover', (e) => {
        sharedTooltip.setContent(tooltipText);
        sharedTooltip.setPosition(e && e.latLng ? e.latLng : fallbackPosition);
        sharedTooltip.show(map);
    });
    item.on('mouseout', () => {
        sharedTooltip.hide();
    });
    item.on('click', (e) => {
        sharedPopup.setContent(popupHtml);
        sharedPopup.setPosition(e && e.latLng ? e.latLng : fallbackPosition);
        sharedPopup.show(map);
    });
};

/**
 * Show the results table
 */
const renderResults = () => {
    if (!currentRun) {
        return;
    }
    const cells = [
        currentRun.polylines,
        currentRun.points,
        currentRun.simplify,
        currentRun.markers,
        currentRun.optimized,
        currentRun.overlays,
        currentRun.overlayCount,
        currentRun.hidden,
        currentRun.polylineMs,
        currentRun.markerMs,
        currentRun.totalMs,
        currentRun.showMs ?? '-',
        currentRun.elements ?? '-',
        currentRun.canvases ?? '-',
        currentRun.images ?? '-',
        currentRun.heap ?? '-',
        currentRun.zoomTestFps ?? '-',
    ];
    currentRun.row.innerHTML = cells.map((value) => `<td>${value}</td>`).join('');
};

/**
 * Count the elements that Google has added to the map
 */
const updateElementCounts = () => {
    const div = map.getDiv();
    if (!div) {
        return;
    }
    const elements = div.querySelectorAll('*').length;
    const canvases = div.querySelectorAll('canvas').length;
    const images = div.querySelectorAll('img').length;
    const heap = heapMb();
    stat('statElements').textContent = elements.toLocaleString();
    stat('statCanvases').textContent = canvases.toLocaleString();
    stat('statImages').textContent = images.toLocaleString();
    stat('statHeap').textContent = heap === 'n/a' ? heap : `${heap} MB`;
    if (currentRun) {
        currentRun.elements = elements.toLocaleString();
        currentRun.canvases = canvases.toLocaleString();
        currentRun.images = images.toLocaleString();
        currentRun.heap = heap;
        renderResults();
    }
};

/**
 * Remove everything that's on the map
 */
const clearAll = () => {
    G.closeAllPopups();
    if (sharedTooltip) {
        sharedTooltip.hide();
    }
    polylines.forEach((p) => p.setMap(null));
    markers.forEach((m) => m.setMapSync(null));
    polylines = [];
    markers = [];
};

/**
 * Build the polylines
 *
 * @param {number} count The number of polylines
 * @param {number} pointsPer The number of points in each one
 * @param {string} overlays "none", "each" or "shared"
 * @param {boolean} startHidden Whether the polylines start hidden
 * @returns {number} The number of points created
 */
const buildPolylines = (count, pointsPer, overlays, startHidden) => {
    let totalPoints = 0;
    for (let i = 0; i < count; i += 1) {
        const number = i + 1;
        const path = gpsTrack(pointsPer);
        totalPoints += path.length;

        const options = {
            path,
            simplify: simplifyValue(),
            strokeColor: '#d62828',
            strokeOpacity: 0.8,
            strokeWeight: 3,
        };
        // A hidden polyline isn't drawn, so nothing is created on the Google map for it until
        // it's shown. This is the setting to use to see what that saves.
        if (startHidden) {
            options.visible = false;
        }
        const p = G.polyline(options);
        p.setMap(map);

        if (overlays === 'each') {
            // A separate tooltip and popup object for each polyline
            p.attachTooltip(`Segment ${number}`);
            p.attachPopup(`<strong>Segment ${number}</strong><br>${path.length.toLocaleString()} points`);
        } else if (overlays === 'shared') {
            useSharedOverlays(
                p,
                `Segment ${number}`,
                `<strong>Segment ${number}</strong><br>${path.length.toLocaleString()} points`,
                path[0],
            );
        }
        polylines.push(p);
    }
    return totalPoints;
};

/**
 * Build the markers
 *
 * @param {number} count The number of markers
 * @param {string} optimized "unset", "true" or "false"
 * @param {string} iconType "default" or "svg"
 * @param {string} overlays "none", "each" or "shared"
 */
const buildMarkers = (count, optimized, iconType, overlays) => {
    for (let i = 0; i < count; i += 1) {
        const number = i + 1;
        const position = randomPosition();
        const options = { position };
        // Only pass the option when it's set so that Google decides otherwise
        if (optimized !== 'unset') {
            options.optimized = optimized === 'true';
        }
        if (iconType === 'svg') {
            options.svgIcon = svgIcon;
        }
        const m = G.marker(options);
        m.setMapSync(map);

        const popupHtml =
            `<strong>Marker ${number}</strong><br>` +
            `${position.latitude.toFixed(4)}, ${position.longitude.toFixed(4)}`;
        if (overlays === 'each') {
            // A separate tooltip and popup object for each marker
            m.attachTooltip(`Marker ${number}`);
            m.attachPopup(popupHtml);
        } else if (overlays === 'shared') {
            useSharedOverlays(m, `Marker ${number}`, popupHtml, position);
        }
        markers.push(m);
    }
};

/**
 * Remove everything and build it again with the selected options
 */
const build = () => {
    clearAll();

    const seed = Number(form.seed.value) || 1;
    random = makeRandom(seed);

    const polylineCount = Number(form.polylineCount.value);
    const pointsPer = Number(form.pointsPer.value);
    const polylineOverlays = form.polylineOverlays.value;
    const startHidden = form.startHidden.checked;
    const markerCount = Number(form.markerCount.value);
    const optimized = form.optimized.value;
    const iconType = form.markerIcon.value;
    const markerOverlays = form.markerOverlays.value;

    stat('statStatus').textContent = 'Building...';

    const polylineStart = performance.now();
    const totalPoints = buildPolylines(polylineCount, pointsPer, polylineOverlays, startHidden);
    const polylineMs = Math.round(performance.now() - polylineStart);

    const markerStart = performance.now();
    buildMarkers(markerCount, optimized, iconType, markerOverlays);
    const markerMs = Math.round(performance.now() - markerStart);

    const totalMs = polylineMs + markerMs;

    // Count the tooltip and popup objects that were created
    let overlayCount = 0;
    if (polylineOverlays === 'each') {
        overlayCount += polylineCount * 2;
    } else if (polylineOverlays === 'shared') {
        overlayCount += 2;
    }
    if (markerOverlays === 'each') {
        overlayCount += markerCount * 2;
    } else if (markerOverlays === 'shared' && polylineOverlays !== 'shared') {
        overlayCount += 2;
    }

    // Fit to the generation area rather than to the points. Extending the bounds over every
    // point would take longer than building the polylines.
    map.fitBounds(
        G.latLngBounds([
            { latitude: area.minLat, longitude: area.minLng },
            { latitude: area.maxLat, longitude: area.maxLng },
        ]),
    );

    stat('statPolylines').textContent = polylineCount.toLocaleString();
    stat('statPoints').textContent = totalPoints.toLocaleString();
    stat('statMarkers').textContent = markerCount.toLocaleString();
    stat('statOverlays').textContent = overlayCount.toLocaleString();
    stat('statPolylineMs').textContent = `${polylineMs}ms`;
    stat('statMarkerMs').textContent = `${markerMs}ms`;
    stat('statTotalMs').textContent = `${totalMs}ms`;
    stat('statShowMs').textContent = '-';
    lowestFps = null;
    stat('statLowestFps').textContent = '-';
    stat('statStatus').textContent = startHidden ? 'Built. Polylines are hidden - use "Show hidden polylines".' : 'Built.';

    showHiddenButton.disabled = !startHidden;

    // Start a new row in the results table
    const row = document.createElement('tr');
    resultsBody.prepend(row);
    const overlayLabels = { none: 'None', each: 'Separate', shared: 'Shared' };
    currentRun = {
        polylines: polylineCount.toLocaleString(),
        points: totalPoints.toLocaleString(),
        simplify: form.simplify.value === 'zoom' ? 'zoom' : `${form.simplify.value} m`,
        markers: markerCount.toLocaleString(),
        optimized: optimized === 'unset' ? 'not set' : optimized,
        overlays: `P: ${overlayLabels[polylineOverlays]} / M: ${overlayLabels[markerOverlays]}`,
        overlayCount: overlayCount.toLocaleString(),
        hidden: startHidden ? 'Yes' : 'No',
        polylineMs,
        markerMs,
        totalMs,
        row,
    };
    renderResults();

    // Count the elements once Google has had a moment to draw everything
    setTimeout(updateElementCounts, 1000);
};

/**
 * Show the polylines that were built hidden, and time how long it takes.
 *
 * This is the measurement for what deferring the drawing saves. Nothing was created on the
 * Google map for these until now.
 */
const showHidden = () => {
    const start = performance.now();
    polylines.forEach((p) => {
        p.visible = true;
    });
    const showMs = Math.round(performance.now() - start);
    stat('statShowMs').textContent = `${showMs}ms`;
    stat('statStatus').textContent = `Showed ${polylines.length.toLocaleString()} polylines in ${showMs}ms`;
    showHiddenButton.disabled = true;
    if (currentRun) {
        currentRun.showMs = showMs;
        renderResults();
    }
    setTimeout(updateElementCounts, 1000);
};

/**
 * Zoom in and out a few levels, one step at a time, and record the lowest frame rate
 */
const runZoomTest = () => {
    if (isZoomTestRunning || (polylines.length === 0 && markers.length === 0)) {
        return;
    }
    isZoomTestRunning = true;
    zoomTestButton.disabled = true;
    lowestFps = null;
    stat('statLowestFps').textContent = '-';
    stat('statStatus').textContent = 'Running zoom test...';

    const startZoom = map.zoom;
    const steps = [1, 2, 3, 4, 3, 2, 1, 0, -1, 0].map((offset) => startZoom + offset);
    let index = 0;
    const next = () => {
        if (index < steps.length) {
            map.setZoom(steps[index]);
            index += 1;
            setTimeout(next, 800);
        } else {
            isZoomTestRunning = false;
            zoomTestButton.disabled = false;
            const fps = lowestFps === null ? '-' : Math.round(lowestFps);
            stat('statStatus').textContent = `Zoom test done. Lowest frame rate: ${fps} fps`;
            if (currentRun) {
                currentRun.zoomTestFps = fps;
                renderResults();
            }
            updateElementCounts();
        }
    };
    next();
};

/**
 * Measure the frame rate over half second windows.
 * The lowest frame rate is only recorded for windows where the map moved.
 *
 * @param {number} now The current time
 */
const tick = (now) => {
    frames += 1;
    const elapsed = now - windowStart;
    if (elapsed >= 500) {
        const fps = (frames * 1000) / elapsed;
        stat('statFps').textContent = `${Math.round(fps)} fps`;
        if (movedInWindow && (lowestFps === null || fps < lowestFps)) {
            lowestFps = fps;
            stat('statLowestFps').textContent = `${Math.round(lowestFps)} fps`;
        }
        frames = 0;
        windowStart = now;
        movedInWindow = false;
    }
    requestAnimationFrame(tick);
};
requestAnimationFrame(tick);

// Set up the page once the map is ready
map.load().then(() => {
    map.on('bounds_changed', () => {
        movedInWindow = true;
    });
    // Update the element counts after the map has finished moving
    map.onIdle(() => {
        setTimeout(updateElementCounts, 300);
    });
    build();
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    build();
});
zoomTestButton.addEventListener('click', runZoomTest);
showHiddenButton.addEventListener('click', showHidden);
