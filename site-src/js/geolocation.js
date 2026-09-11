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

// Add the marker, or move it if it already exists.
// This waits until the map is ready because the map isn't rendered while it's hidden.
const updateMarker = () => {
    if (userPosition === null || !map.getIsReady()) {
        return;
    }
    if (marker === null) {
        marker = G.marker({ map: map, position: userPosition, title: 'You are here' });
    } else {
        marker.position = userPosition;
    }
};
map.onReady(updateMarker);

map.onLocationFound((position) => {
    const isFirstLocation = userPosition === null;
    userPosition = position.latLng;
    if (isFirstLocation) {
        // Center on the user the first time only so that later updates don't undo the user panning the map
        map.setCenter(userPosition);
        map.zoom = 15;
    }
    updateMarker();

    let status = `Your location: ${position.latitude.toFixed(5)}, ${position.longitude.toFixed(5)}`;
    if (typeof position.accuracy === 'number') {
        status += ` (accurate to about ${Math.round(position.accuracy)} meters)`;
    }
    statusElement.textContent = status;
});

map.onLocationError(() => {
    statusElement.textContent = 'Unable to get your location. Check that location access is allowed for this site.';
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
