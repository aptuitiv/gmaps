/* ===========================================================================
    Javascript for the Map page
=========================================================================== */


/* global G */

const map = G.map('map1', {
    apiKey: apiKey,
    center: { lat: 36.224, lng: -81.688 },
});
map.load().then(() => { console.log('1 loaded') });

console.log('map: ', map);
console.log('isMap: ', map.isMap());
console.log('isMarker: ', map.isMarker());

map.once('click', (e) => {
    console.log('click: ', e);
});


// const map2 = G.map('map2');

// map2.display(() => {
//     console.log('Displayd xs 2')
// }).then((m) => {
//     console.log('Map 2 loaded ', m);
// });
// map2.on('display', () => {
//     console.log('display event');
// });
