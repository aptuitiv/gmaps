/* ===========================================================================
    Javascript for the Marker page
=========================================================================== */


/* global G */

const map = G.map('map1', {
    apiKey: apiKey,
    center: { lat: 36.224, lng: -81.688 },
});

const marker = G.marker({
    latitude: 40.730610,
    longitude: -73.935242,
    title: 'My Marker',
    tooltipContainer: '#map',
    tooltipClass: 'my-tooltip'
});
marker.addTo(map);
map.load().then(() => { console.log('1 loaded') });

console.log('map: ', map);
console.log('isMap: ', map.isMap());
console.log('isMarker: ', map.isMarker());

