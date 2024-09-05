/* ===========================================================================
    Javascript for the Map page
=========================================================================== */


/* global G */

const mapObject = {
    apiKey: apiKey,
    center: { latitude: 48.864716, longitude: 2.3522 },
    zoom: 11,
    mapContainer: '#map1',
    init: function () {
        this.map = G.map(this.mapContainer, { center: this.center, zoom: this.zoom, apiKey: this.apiKey });
        this.map.load();
    },
    setupEvents: function () {
        // A regular function is used here to test setting the context of the event handler
        this.map.on('click', function (e) {
            console.log('click: ', e);
            console.log('regular function this: ', this);
            // e.stop();
        }, null, this);

        // An arrow function is used here to test setting the context of the event handler
        this.map.on('click', (e) => {
            console.log('Another click: ', e);
            console.log('arrow function this: ', this);
            // e.stop();
        });

        // Set up a named arrow function to test event context
        const zoomCallback = (e) => {
            console.log('Zoom: ', e);
            console.log('named arrow function this: ', this);
        }
        this.map.on('zoom_changed', zoomCallback);

        function zoomCallback2(e) {
            console.log('Zoom 2: ', e);
            console.log('regular named function this: ', this);
            this.setCenter({ latitude: 36.224, longitude: 2.3522 });
        }
        this.map.on('zoom_changed', zoomCallback2, null, null);
    }
}
// mapObject.init();
// mapObject.setupEvents();

G.loader({ apiKey: apiKey, libraries: ['places'] }).load();

const mapTypeControl = G.mapTypeControl({
    // mapTypeIds: [G.MapTypeId.ROADMAP, G.MapTypeId.TERRAIN],
    // position: G.ControlPosition.RIGHT_CENTER,
    style: G.MapTypeControlStyle.DROPDOWN_MENU,
});
// mapTypeControl.setMapTypeIds([G.MapTypeId.ROADMAP, G.MapTypeId.TERRAIN]);

const fullscreenControl = G.fullscreenControl({
    position: G.ControlPosition.RIGHT_BOTTOM,
});
const map1 = G.map('#map1', {
    center: [40.7128, -74.0060],
    // fullscreenControl: fullscreenControl,
    fullscreenControl: false,
    // mapTypeControl: false,
    mapTypeControl: mapTypeControl,
    maxZoom: 12,
    minZoom: 10,
});
map1.show().then(() => {
    console.log('Map 1 shown');
    // map1.fullscreenControl = false;
    map1.fullscreenControl = fullscreenControl;
});
const customBtn = document.createElement('button');
customBtn.textContent = 'Custom Control 2';
customBtn.className = 'customButton';
customBtn.style.backgroundColor = '#fff';
customBtn.style.border = '2px solid #ff0000';
customBtn.style.padding = '5px';
customBtn.style.display = 'inline-block';
customBtn.addEventListener('click', () => {
    console.log('Custom Control clicked');
});
map1.addCustomControl(G.ControlPosition.BLOCK_START_INLINE_CENTER, customBtn);
map1.on('click', (e) => {
    console.log(`The event type is ${e.type}`);

    map1.setCenter(36.224, 2.3522);

    console.log('map 1 control: ', map1.mapTypeControl);

    if (e.latLng) {
        console.log(`You clicked at ${e.latLng.lat}/${e.latLng.lng}`);
    }

    // Stop the event from propogating to other elements on the page.
    if (e.stop) {
        e.stop();
    }
});

// Set up places search for map 1
// const input = document.getElementById('placesSearch');
const placesSearchBox = G.placesSearchBox();
placesSearchBox.input = '#placesSearch';
placesSearchBox.init().then(() => {
    placesSearchBox.on('places_changed', () => {
        const place = placesSearchBox.getPlace();
        G.marker({
            map: map1,
            position: place.geometry.location,
            tooltip: place.name,
        });
        map1.fitBounds(placesSearchBox.getPlacesBounds());
    });
    placesSearchBox.onPlacesChanged((places, bounds) => {
        console.log('places: ', places);
        console.log('bounds: ', bounds);
    });
});

// Set up the autocomplete for map 1
const autocomplete = G.autocompleteSearchBox({
    // countryRestriction: ['es', 'fr'],
    fields: ['address_components', 'formatted_address', 'geometry', 'name'],
    types: ['(cities)'],
});
autocomplete.setInput('#autocompleteSearch');
// autocomplete.input = '#autocompleteSearch';
// autocomplete.types = ['zoo', 'country'];
autocomplete.init().then(() => {
    autocomplete.onPlaceChanged((place, bounds) => {
        console.log('Place: ', place);
        G.marker({
            map: map1,
            position: place.geometry.location,
            tooltip: place.name,
        });
        map1.fitBounds(bounds);
    });
    // autocomplete.on('place_changed', ({ place, bounds }) => {
    //     console.log('Place: ', place);
    //     G.marker({
    //         map: map1,
    //         position: place.geometry.location,
    //         tooltip: place.name,
    //     });
    //     map1.fitBounds(bounds);
    // });
    // autocomplete.on('place_changed', () => {
    //     const place = autocomplete.getPlace();
    //     console.log('Box place: ', place);
    //     G.marker({
    //         map: map1,
    //         position: place.geometry.location,
    //         tooltip: place.name,
    //     });
    //     map1.fitBounds(autocomplete.getPlaceBounds());
    // });
});
const autocompleteTypeReset = document.getElementById('autocompleteResetType');
autocompleteTypeReset.addEventListener('click', () => {
    autocomplete.types = [];
});
const disableUI = document.getElementById('disableUI');
disableUI.addEventListener('click', () => {
    map1.disableDefaultUI = true;
});
const enableUI = document.getElementById('enableUI');
enableUI.addEventListener('click', () => {
    map1.disableDefaultUI = false;
});


// const map2 = G.map('#map2', { center: [35.6764, 139.6500] });
// map2.show();
// map2.setMapTypeId(G.MapTypeId.SATELLITE);

// const map3 = G.map('.map3Selector', { center: [51.5074, -0.1278] });
// map3.show();
// map3.mapTypeId = G.MapTypeId.HYBRID;

// const map4Element = document.getElementById('map4');
// const map4 = G.map(map4Element, { center: [34.0522, -118.2437] });
// map4.show();

function changeMapOptions() {
    map1.setOptions({ center: [36.224, -81.688], zoom: 8 });
}

function getMapData() {
    console.log('Map 1 zoom: ', map1.zoom);
    console.log('Map 1 getZoom(): ', map1.getZoom());
    console.log('Map 1 center: ', map1.getCenter());
}

// const map = G.map('#map1', {
//     apiKey: apiKey,
//     center: { lat: 36.224, lng: -81.688 },
//     zoom: 11
// });
// map.on('click', (e) => {
//     console.log('click: ', e);
//     console.log('this: ', this);
//     // e.stop();
// });
// map.load().then(() => { console.log('1 loaded') });

// console.log('map: ', map);
// console.log('isMap: ', map.isMap());
// console.log('isMarker: ', map.isMarker());

// map.on('click', (e) => {
//     console.log('click: ', e);
//     // e.stop();
// });


// const map2 = G.map('#map2');

// map2.show(() => {
//     console.log('Displayd xs 2')
// }).then((m) => {
//     console.log('Map 2 loaded ', m);
// });
// map2.on('display', () => {
//     console.log('display event');
// });
