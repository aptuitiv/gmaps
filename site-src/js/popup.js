/* ===========================================================================
    Javascript for the Popup page
=========================================================================== */


/* global G */

/* TEST 1  */
const map = G.map('map1', { apiKey: apiKey, center: { latitude: 48.864716, longitude: 2.3522 } });
map.load();
const marker = G.marker({
    latitude: 48.9,
    longitude: 2.4,
    map: map,
    title: 'Marker 1',
});
marker.attachPopup('My Popup');


const marker2 = G.marker({
    latitude: 48.9,
    longitude: 3.4,
    map: map,
    title: 'Marker 2',
});
// marker.attachPopup('My Popup');

const popup = G.popup({
    content: 'This is a test',
});
popup.attachTo(marker2, 'hover');


const mapPopup = G.popup({
    content: 'This is a test on the map',
});
map.attachPopup(mapPopup, 'clickon');
