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
const content = `
    <h1>My Polyline</h1>
    <p>This is a popup on a marker. Isn't it great!</p>
    <p>Here is another line.</p>
    <p><a href="https://www.google.com">Google</a></p>
`;
marker.attachPopup({ content: content, styles: { maxWidth: '200px', textAlign: 'center', padding: '10px 20px' } });


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
popup.attachTo(marker2);


const mapPopup = G.popup({
    content: 'This is a test on the map',
});
map.attachPopup(mapPopup, 'clickon');
