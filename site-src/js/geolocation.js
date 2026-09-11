/* ===========================================================================
    Javascript for the Geolocation page

    The map starts hidden. The user's location is requested right away and a
    marker is shown at it. The toggle button shows and hides the map.
=========================================================================== */

/* global G */

G.loader({ apiKey: apiKey }).load();

const mapElement = document.getElementById('locateMap');
const toggleButton = document.getElementById('toggleMap');
const statusElement = document.getElementById('locateStatus');

// Start centered on the US until the user's location is found.
// show() waits until the hidden map element is visible before it renders the map.
const map = G.map(mapElement, { center: [39.8283, -98.5795], zoom: 4 });
map.show();

let marker = null;
let userPosition = null;

map.onLocationFound((position) => {
    userPosition = position.latLng;
    if (marker === null) {
        // The marker can be added while the map is still hidden. It shows up once the map is rendered.
        marker = G.marker({
            map: map,
            position: userPosition,
            svgIcon: {
                anchor: { x: 11, y: 11 }, // Move the svg marker to the center of the map marker. The icon is 22x22 pixels.
                fillColor: '#5284ed',
                fillOpacity: 1,
                path: 'M3 11a8 8 0 1 0 16 0a8 8 0 1 0 -16 0',
                strokeColor: '#ffffff',
                strokeWeight: 2,
            },
            title: 'You are here',
        });
        // Center on the user the first time only so that later updates don't undo the user panning the map
        map.setCenter(userPosition);
        map.zoom = 15;
    } else {
        marker.position = userPosition;
    }

    let status = `Your location: ${position.latitude.toFixed(5)}, ${position.longitude.toFixed(5)}`;
    if (typeof position.accuracy === 'number') {
        status += ` (accurate to about ${Math.round(position.accuracy)} meters)`;
    }
    statusElement.textContent = status;
});

map.onLocationError((error) => {
    // error.code is 1 (permission denied), 2 (position unavailable), or 3 (timeout)
    if (error.code === 1) {
        statusElement.textContent =
            'Location access was denied. Allow location access for this site to see your location.';
    } else {
        statusElement.textContent = `Unable to get your location: ${error.message}`;
    }
});

// Watch the user's location. watch is true by default, so the marker moves as the location changes.
map.locate({ enableHighAccuracy: true });

toggleButton.addEventListener('click', () => {
    const showMap = mapElement.hidden;
    mapElement.hidden = !showMap;
    toggleButton.textContent = showMap ? 'Hide map' : 'Show map';
    toggleButton.setAttribute('aria-expanded', String(showMap));

    // The first time the map is shown it's rendered by show(). After that, resize it in case
    // the marker moved while the map was hidden, and recenter on the user.
    if (showMap && map.getIsReady()) {
        map.resize();
        if (userPosition !== null) {
            map.setCenter(userPosition);
        }
    }
});
