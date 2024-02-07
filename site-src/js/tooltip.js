/* ===========================================================================
    Javascript for the Tooltip page
=========================================================================== */


/* global G */

/* TEST 1  */
G.loader().setApiKey(apiKey).load();

const map = G.map('map1', {
    latitude: 40.730610,
    longitude: -73.935242,
    zoom: 8
});
map.display();
const marker = G.marker({
    latitude: 40.730610,
    longitude: -73.935242,
    map: map,
    title: 'My Marker',
    tooltip: 'This is a tooltip'
});
