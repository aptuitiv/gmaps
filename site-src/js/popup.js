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
    title: 'My Marker',
});
marker.bindPopup('My Popup');
