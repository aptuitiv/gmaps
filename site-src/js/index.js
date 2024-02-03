/* ===========================================================================
    Javascript for the index page
=========================================================================== */

/* global G */

G.map('map2', { apiKey: 'AIzaSyCOQopRM-4Mrbi_E7_-BTEw7-cPqiDJ7UM', center: ['50.864716', 10.3522], zoom: 11 }).load().then(() => {
    // Do something after loading an displaying the map
});

// G.loader({ apiKey: 'AIzaSyCOQopRM-4Mrbi_E7_-BTEw7-cPqiDJ7UM', }).load().then(() => {
//     G.map('map1', { center: { latitude: 48.864716, longitude: 2.3522 } }).display();
// });
// load.on('load', () => { console.log('loaded event'); });
// load.load();

// const load = G.loader({ apiKey: 'AIzaSyCOQopRM-4Mrbi_E7_-BTEw7-cPqiDJ7UM', });
// load.on('load', () => { console.log('loaded event'); });


// const map = G.map('map1', {
//     // apiKey: 'AIzaSyCOQopRM-4Mrbi_E7_-BTEw7-cPqiDJ7UM',
//     center: { lat: 36.224, lng: -81.688 },
// }).load().then(() => { console.log('1 loaded') });
// load.load(() => {
//     console.log('Loaded in callback');
//     map.display();
// });

// await load.load();
// map.display();
// map.load().then(() => {
//     console.log('Map Loaded');
// });

// load.load().then(() => {
//     console.log('Loaded');
// }).catch((err) => {
//     console.log('error: ', err);
// });
// console.log('load: ', load);
// const map = G.map('map1', {
//     apiKey: 'AIzaSyCOQopRM-4Mrbi_E7_-BTEw7-cPqiDJ7UM',
//     center: { lat: 36.224, lng: -81.688 },
// }).load(() => {

// });

// load.on('load', () => {

// });


// G.loader({ apiKey: 'AIzaSyCOQopRM-4Mrbi_E7_-BTEw7-cPqiDJ7UM', }).load().then(() => {
//     console.log('Loaded 3');
//     const map2 = G.map('map2', {
//         // apiKey: 'AIzaSyCOQopRM-4Mrbi_E7_-BTEw7-cPqiDJ7UM',
//         // center: { lat: 10, lng: 0 },
//     }).display(() => {
//         console.log('Displayd xs 2')
//     });
// });

// const map2 = G.map('map2');

// map2.display(() => {
//     console.log('Displayd xs 2')
// }).then((m) => {
//     console.log('Map 2 loaded ', m);
// });
// map2.on('display', () => {
//     console.log('display event');
// });
