/* ===========================================================================
    Javascript for the Geolocation page

    The map starts hidden. The user's location is requested right away, and the location control
    shows it once there is something to show.

    The control does the marker, the button and the panning. What's left here is the page's own
    business: the readouts, and the toggle that shows and hides the map.

    Two events are used, and the page shows both so that the difference is visible:
      - map 'locationfound' is the raw Geolocation fix. It carries the position data and fires
        every time the browser reports a new one, whether or not a control is on the map.
      - control 'located' says the control has something to show. It carries no position data;
        the position is read back off the control.
=========================================================================== */

/* global G */

G.loader({ apiKey: apiKey }).load();

const mapElement = document.getElementById('locateMap');
const toggleButton = document.getElementById('toggleMap');
const statusElement = document.getElementById('locateStatus');
const rawElement = document.getElementById('locateRaw');
const controlElement = document.getElementById('locateControlStatus');

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

// The raw Geolocation fix. This is the event to use for anything that isn't about the control -
// filling in a "search near me" field, logging, showing the accuracy. The position data is merged
// onto the event object, so position.latitude, position.longitude and position.latLng are all
// there. It fires again every time the browser reports a new position, because locate() watches
// by default.
let foundCount = 0;
map.onLocationFound((position) => {
    foundCount += 1;

    let status = `Your location: ${position.latitude.toFixed(5)}, ${position.longitude.toFixed(5)}`;
    if (typeof position.accuracy === 'number') {
        status += ` (accurate to about ${Math.round(position.accuracy)} meters)`;
    }
    statusElement.textContent = status;

    // Everything the event carried. The optional values are only set when the device reports
    // them, so a desktop browser usually shows just accuracy.
    const fields = ['accuracy', 'altitude', 'altitudeAccuracy', 'heading', 'speed'];
    const reported = fields
        .filter((field) => typeof position[field] === 'number')
        .map((field) => `${field}: ${position[field]}`);
    // latLng is a LatLng object, not a plain pair, so it's ready to hand to any other method
    reported.unshift(`latLng: ${position.latLng.lat}, ${position.latLng.lng}`);
    reported.push(`timestamp: ${new Date(position.timestamp).toLocaleTimeString()}`);
    rawElement.textContent = `locationfound fired ${foundCount} time(s) - ${reported.join(', ')}`;
});

map.onLocationError((error) => {
    // error.code is 1 (permission denied), 2 (position unavailable), or 3 (timeout)
    if (error.code === 1) {
        statusElement.textContent =
            'Location access was denied. Allow location access for this site to see your location.';
    } else {
        statusElement.textContent = `Unable to get your location: ${error.message}`;
    }
    rawElement.textContent = `locationerror fired - code ${error.code}`;
});

// The control's own event. It says "there is now something on the map", which is a different
// question from "the browser reported a position".
control.on('located', () => {
    const { latitude, longitude } = control.location;
    controlElement.textContent = `Control is showing ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
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
