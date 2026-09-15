/* ===========================================================================
    Javascript for the Marker Optimized page

    Adds a large number of markers so that the marker "optimized" option can be
    compared when it's set to true, false, or not set (Google decides).
=========================================================================== */

/* global G */

const map = G.map('#map1', { apiKey: apiKey, center: { latitude: 48.85, longitude: 2.35 }, zoom: 9 });

const form = document.getElementById('controls');
const zoomTestButton = document.getElementById('zoomTest');
const resultsBody = document.getElementById('results');
const stat = (id) => document.getElementById(id);

// A simple SVG icon to compare against the default Google pin
const svgIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">'
    + '<circle cx="10" cy="10" r="8" fill="#d62828" stroke="#fff" stroke-width="2"/></svg>';

// The markers that are on the map
let markers = [];

// The current test run. Each time the markers are built a new run is added to the results table.
let currentRun = null;

// Frame rate tracking
let frames = 0;
let windowStart = performance.now();
let movedInWindow = false;
let lowestFps = null;
let isZoomTestRunning = false;

/**
 * Get a random position in the area around Paris
 *
 * @returns {object}
 */
const randomPosition = () => ({
    latitude: 48.4 + Math.random() * 0.9,
    longitude: 1.6 + Math.random() * 1.5,
});

/**
 * Show the results table
 */
const renderResults = () => {
    if (!currentRun) {
        return;
    }
    const cells = [
        currentRun.optimized,
        currentRun.icon,
        currentRun.count.toLocaleString(),
        currentRun.createMs,
        currentRun.elements ?? '-',
        currentRun.canvases ?? '-',
        currentRun.images ?? '-',
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
    stat('statElements').textContent = elements.toLocaleString();
    stat('statCanvases').textContent = canvases.toLocaleString();
    stat('statImages').textContent = images.toLocaleString();
    if (currentRun) {
        currentRun.elements = elements.toLocaleString();
        currentRun.canvases = canvases.toLocaleString();
        currentRun.images = images.toLocaleString();
        renderResults();
    }
};

/**
 * Remove the existing markers and add new ones with the selected options
 */
const buildMarkers = () => {
    markers.forEach((m) => m.setMapSync(null));
    markers = [];

    const count = Number(form.count.value);
    const optimized = form.optimized.value;
    const iconType = form.icon.value;

    const start = performance.now();
    for (let i = 0; i < count; i += 1) {
        const options = { position: randomPosition() };
        // Only pass the option when it's set so that Google decides otherwise
        if (optimized !== 'unset') {
            options.optimized = optimized === 'true';
        }
        if (iconType === 'svg') {
            options.svgIcon = svgIcon;
        }
        const m = G.marker(options);
        m.setMapSync(map);
        markers.push(m);
    }
    const createMs = Math.round(performance.now() - start);

    stat('statMarkers').textContent = count.toLocaleString();
    stat('statCreate').textContent = `${createMs}ms`;
    lowestFps = null;
    stat('statLowestFps').textContent = '-';

    // Start a new row in the results table
    const row = document.createElement('tr');
    resultsBody.prepend(row);
    currentRun = {
        optimized: optimized === 'unset' ? 'not set' : optimized,
        icon: iconType === 'svg' ? 'SVG' : 'Default pin',
        count,
        createMs,
        row,
    };
    renderResults();

    // Count the elements once Google has had a moment to draw the markers
    setTimeout(updateElementCounts, 1000);
};

/**
 * Zoom in and out a few levels, one step at a time, and record the lowest frame rate
 */
const runZoomTest = () => {
    if (isZoomTestRunning || markers.length === 0) {
        return;
    }
    isZoomTestRunning = true;
    zoomTestButton.disabled = true;
    lowestFps = null;
    stat('statLowestFps').textContent = '-';
    stat('statStatus').textContent = 'Running zoom test...';

    const startZoom = map.zoom;
    const steps = [1, 2, 3, 2, 1, 0, -1, -2, -1, 0].map((offset) => startZoom + offset);
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
    buildMarkers();
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    buildMarkers();
});
zoomTestButton.addEventListener('click', runZoomTest);
