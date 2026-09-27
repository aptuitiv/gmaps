/* ===========================================================================
    Javascript for the Geolocation page

    The map starts hidden. The user's location is requested right away, and the location control
    shows it once there is something to show.

    The control does the marker, the button and the panning. What's left here is the page's own
    business: the status line, and the toggle that shows and hides the map.
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

// The whole feature: a marker that follows the user, and a button that takes the map back to it.
// The button only appears once a location has been found, so a denied permission leaves nothing
// behind. centerOnFirstFind moves the map to the user the first time and then leaves it alone.
const control = G.locationControl({
    centerOnFirstFind: true,
    className: 'TestBtn',
    content: 'My location',
    locateOptions: { enableHighAccuracy: true },
    map: map,
    // The dot has no tooltip unless one is asked for, so that the library invents no wording
    marker: { title: 'My location' },
    position: G.ControlPosition.LEFT_BOTTOM,
    zoom: 15,
});

// Everything below is the page's own, not the control's.

control.on('located', () => {
    const { accuracy, latitude, longitude } = control.location;
    let status = `Your location: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
    if (typeof accuracy === 'number') {
        status += ` (accurate to about ${Math.round(accuracy)} meters)`;
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

toggleButton.addEventListener('click', () => {
    const showMap = mapElement.hidden;
    mapElement.hidden = !showMap;
    toggleButton.textContent = showMap ? 'Hide map' : 'Show map';
    toggleButton.setAttribute('aria-expanded', String(showMap));

    // The first time the map is shown it's rendered by show(). After that, resize it in case the
    // marker moved while the map was hidden, and recenter on the user.
    if (showMap && map.getIsReady()) {
        map.resize();
        if (control.isLocated) {
            map.setCenter(control.location.latLng);
        }
    }
});
