/* ===========================================================================
    Javascript for the index page
=========================================================================== */

/* global G */

// G.map('map2', { apiKey: 'AIzaSyCOQopRM-4Mrbi_E7_-BTEw7-cPqiDJ7UM', center: ['50.864716', 10.3522], zoom: 11 }).load().then(() => {
//     // Do something after loading an displaying the map
// });

G.loader({ apiKey: 'AIzaSyCOQopRM-4Mrbi_E7_-BTEw7-cPqiDJ7UM', }).load().then(() => {
    G.map('map1', { center: { latitude: 48.864716, longitude: 2.3522 } }).display();
    // const lat = G.latLng(48.864716, 2.3522);
    // const lat2 = G.latLng().set(lat);
    // console.log('lat2: ', lat2);
    // console.log(G.latLng(lat).setLat(10));
    // console.log(lat);
    // const point1 = G.point(2, 4);
    // console.log('point1: ', point1);
    // console.log('clone: ', point1.clone());
    // console.log('add: ', point1.add(2, 2));
    // console.log('sub: ', point1.subtract(10, 5));
    // console.log('mul2: ', point1.multiply(2));
    // console.log('divi: ', point1.divide(2));
    // console.log('ceil: ', G.point(2.5, 3.5).ceil());
    // console.log('floor: ', G.point(2.5, 3.5).floor());
    // console.log('round: ', G.point(2.5, 3.5).round());
    // console.log('distance: ', G.point(2, 4).distanceTo(G.point(4, 6)));
    // console.log('equals: ', G.point(2, 4).equals(G.point(2, 4)));
    // console.log('equals: ', G.point(2, 4).equals(G.point(4, 6)));
    // console.log('setX: ', G.point(2, 4).setX(10));
    // console.log('setY: ', G.point(2, 4).setY(10));
    // console.log('set: ', G.point(2, 4).set(10, 3));
    // console.log('truclate: ', G.point(2.5, 3.5).trunc());

    const size = G.size(2, 4);
    console.log('size: ', size);
    console.log('clone: ', size.clone());
    console.log('set: ', size.set(10, 3));
    console.log('isvalid: ', size.isValid());
    console.log('isvalid: ', G.size().isValid());
    console.log('isvalid: ', G.size().setWidth(3).isValid());
    console.log('set: ', G.size().set(10, 3));
    console.log('set: ', G.size().setWidth(3).setHeight('150'));
    const size2 = G.size(10, 20);
    console.log('size2: ', size2);
    console.log('getter w: ', size2.width);
    console.log('getter h: ', size2.height);
    const size3 = G.size();
    size3.width = 100;
    console.log('size3: ', size3);
    size3.height = 200;
    console.log('size3: ', size3);

});
// load.on('load', () => { console.log('loaded event'); });
// load.load();

// const load = G.loader({ apiKey: 'AIzaSyCOQopRM-4Mrbi_E7_-BTEw7-cPqiDJ7UM', });
// load.on('load', () => { console.log('loaded event'); });


const map = G.map('map1', {
    // apiKey: 'AIzaSyCOQopRM-4Mrbi_E7_-BTEw7-cPqiDJ7UM',
    center: { lat: 36.224, lng: -81.688 },
}).load().then(() => { console.log('1 loaded') });
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
