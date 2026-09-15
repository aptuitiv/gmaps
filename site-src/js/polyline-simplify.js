/* ===========================================================================
    Javascript for the Polyline Simplify page

    Draws a GPS-like track with a lot of points so that the polyline "simplify"
    option can be compared with different tolerances.
=========================================================================== */

/* global G */

const map = G.map('#map1', { apiKey: apiKey, center: { latitude: 48.85, longitude: 2.35 }, zoom: 13 });

const form = document.getElementById('controls');
const zoomTestButton = document.getElementById('zoomTest');
const resultsBody = document.getElementById('results');
const stat = (id) => document.getElementById(id);

// The generated track
let track = [];

// The red line that uses the simplify option
let simplifiedLine = null;

// The blue line under it that draws every point
let originalLine = null;

// The current test run. A new run is added to the results table each time the track or tolerance changes.
let currentRun = null;

// Frame rate tracking
let frames = 0;
let windowStart = performance.now();
let movedInWindow = false;
let lowestFps = null;
let isZoomTestRunning = false;

/**
 * Make a GPS-like track: steps of about 4 meters with gradual turns and a little GPS noise
 *
 * @param {number} count The number of points
 * @returns {object[]}
 */
const gpsTrack = (count) => {
    const points = [];
    let lat = 48.85;
    let lng = 2.35;
    let heading = Math.random() * Math.PI * 2;
    for (let i = 0; i < count; i += 1) {
        heading += (Math.random() - 0.5) * 0.3;
        const step = 4 / 111320;
        lat += Math.cos(heading) * step + (Math.random() - 0.5) * 0.00002;
        lng += (Math.sin(heading) * step) / Math.cos((lat * Math.PI) / 180) + (Math.random() - 0.5) * 0.00002;
        points.push({ latitude: lat, longitude: lng });
    }
    return points;
};

/**
 * Show the results table
 */
const renderResults = () => {
    if (!currentRun) {
        return;
    }
    const cells = [
        currentRun.tolerance,
        currentRun.pathCount,
        currentRun.drawnCount,
        currentRun.reduction,
        currentRun.ms,
        currentRun.original,
        currentRun.zoomTestFps ?? '-',
    ];
    currentRun.row.innerHTML = cells.map((value) => `<td>${value}</td>`).join('');
};

/**
 * Show the point counts for the simplified line and start a new row in the results table
 *
 * @param {number} ms The time it took to simplify the path
 */
const updateStats = async (ms) => {
    const googleLine = await simplifiedLine.toGoogle();
    const pathCount = simplifiedLine.path.length;
    const drawnCount = googleLine.getPath().getLength();
    const reduction = `${(100 - (drawnCount / pathCount) * 100).toFixed(1)}%`;
    stat('statPath').textContent = pathCount.toLocaleString();
    stat('statDrawn').textContent = drawnCount.toLocaleString();
    stat('statReduction').textContent = reduction;
    stat('statTime').textContent = `${ms.toFixed(1)}ms`;
    lowestFps = null;
    stat('statLowestFps').textContent = '-';

    const row = document.createElement('tr');
    resultsBody.prepend(row);
    const tolerance = simplifiedLine.simplify;
    currentRun = {
        tolerance: tolerance === 0 ? 'Off' : `${tolerance} m`,
        pathCount: pathCount.toLocaleString(),
        drawnCount: drawnCount.toLocaleString(),
        reduction,
        ms: ms.toFixed(1),
        original: form.showOriginal.checked ? 'Yes' : 'No',
        row,
    };
    renderResults();
};

/**
 * Show or hide the blue line that draws every point
 */
const updateOriginalLine = () => {
    if (form.showOriginal.checked) {
        if (!originalLine) {
            originalLine = G.polyline({
                path: track,
                strokeColor: '#1e88e5',
                strokeOpacity: 0.6,
                strokeWeight: 6,
                zIndex: 1,
            });
        }
        originalLine.setMap(map);
    } else if (originalLine) {
        originalLine.setMap(null);
    }
};

/**
 * Make a new track and draw it
 */
const drawTrack = async () => {
    if (simplifiedLine) {
        simplifiedLine.setMap(null);
    }
    if (originalLine) {
        originalLine.setMap(null);
        originalLine = null;
    }

    track = gpsTrack(Number(form.count.value));
    const tolerance = Number(form.tolerance.value);

    // Time how long it takes to make the Google polyline with the simplified path
    const start = performance.now();
    simplifiedLine = G.polyline({
        path: track,
        simplify: tolerance,
        strokeColor: '#d62828',
        strokeWeight: 3,
        zIndex: 2,
    });
    await simplifiedLine.toGoogle();
    const ms = performance.now() - start;

    simplifiedLine.setMap(map);
    updateOriginalLine();
    map.fitBounds(G.latLngBounds().extend(track));
    updateStats(ms);
};

/**
 * Change the tolerance on the existing line
 */
const changeTolerance = () => {
    if (!simplifiedLine) {
        return;
    }
    const start = performance.now();
    simplifiedLine.setSimplify(Number(form.tolerance.value));
    updateStats(performance.now() - start);
};

/**
 * Zoom in and out a few levels, one step at a time, and record the lowest frame rate
 */
const runZoomTest = () => {
    if (isZoomTestRunning || !simplifiedLine) {
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
    drawTrack();
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    drawTrack();
});
form.tolerance.addEventListener('change', changeTolerance);
form.showOriginal.addEventListener('change', updateOriginalLine);
zoomTestButton.addEventListener('click', runZoomTest);
