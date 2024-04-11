/* ===========================================================================
    Javascript for the Loader page
=========================================================================== */


/* global G */

// G.map('map2', { apiKey: apiKey, center: ['50.864716', 10.3522], zoom: 11 }).load().then(() => {
//     // Do something after loading an displaying the map
// });
const loader = G.loader({ apiKey: apiKey, });
console.log('loader: ', loader);
console.log('apiKey: ', loader.apiKey);
console.log('libraries: ', loader.libraries);
console.log('version: ', loader.version);
loader.version = 'monthly';
loader.setApiKey('Another one').setLibraries('places').setVersion('quarterly');
loader.libraries = 'geometry';

const load = G.loader({ apiKey: apiKey, });
load.on('load', () => { console.log('loaded event'); });


// load.load(() => {
//     console.log('Loaded in callback');
//     map.show();
// });

// await load.load();
// map.show();
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
//     apiKey: apiKey,
//     center: { lat: 36.224, lng: -81.688 },
// }).load(() => {

// });

// load.on('load', () => {

// });


// G.loader({ apiKey: apiKey, }).load().then(() => {
//     console.log('Loaded 3');
//     const map2 = G.map('map2', {
//         // apiKey: apiKey,
//         // center: { lat: 10, lng: 0 },
//     }).show(() => {
//         console.log('Displayd xs 2')
//     });
// });
