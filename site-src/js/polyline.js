/* ===========================================================================
    Javascript for the Polyline page
=========================================================================== */

/* global G */

const map = G.map('map1', { apiKey: apiKey, center: { latitude: 48.864716, longitude: 2.3522 } });
map.load();

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}
const path = [];
const lat = 48;
const lng = 2;
// for (let i = 0; i < 10; i++) {
//     path.push({ latitude: 48.864716 + (i * 0.1), longitude: 2.3522 + (i * 0.1) });
// }
for (let i = 0; i < 10; i += 1) {
    path.push({
        latitude: lat + (randomNumber(0, 0.2) * i),
        longitude: lng + (randomNumber(0, .2) * i),
    });
}

const polyline = G.polyline({
    path: path,
    map: map,
    // strokeColor: 'red',
    // strokeOpacity: 0.5,
    // strokeWeight: 5
});
