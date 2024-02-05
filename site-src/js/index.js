/* ===========================================================================
    Javascript for the index page
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
// loader.version = 'monthly';
// loader.setApiKey('Another one').setLibraries('places').setVersion('quarterly');
// loader.libraries = 'geometry';

// G.loader({ apiKey: apiKey, }).load().then(() => {
//     G.map('map1', { center: { latitude: 48.864716, longitude: 2.3522 } }).display();
// const lat = G.latLng(48.864716, 2.3522);
// const lat2 = G.latLng().set(lat);
// console.log('lat2: ', lat2);
// console.log(G.latLng(lat).setLat(10));
// console.log(lat);
// console.log('long: ', lat2.latitude, ' :: ', lat2.longitude);
// console.log('short: ', lat2.lat, ' :: ', lat2.longitude);
// console.log('google: ', lat2.toGoogle());
// lat2.lat = 10;
// lat2.lng = 20;
// console.log('lat2: ', lat2, ' :: ', lat2.lat, ' :: ', lat2.longitude);

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

// const size = G.size(2, 4);
// console.log('size: ', size);
// console.log('clone: ', size.clone());
// console.log('set: ', size.set(10, 3));
// console.log('isvalid: ', size.isValid());
// console.log('isvalid: ', G.size().isValid());
// console.log('isvalid: ', G.size().setWidth(3).isValid());
// console.log('set: ', G.size().set(10, 3));
// console.log('set: ', G.size().setWidth(3).setHeight('150'));
// const size2 = G.size(10, 20);
// console.log('size2: ', size2);
// console.log('getter w: ', size2.width);
// console.log('getter h: ', size2.height);
// const size3 = G.size();
// size3.width = 100;
// console.log('size3: ', size3);
// size3.height = 200;
// console.log('size3: ', size3);

// const bounds = G.latLngBounds([
//     // [40.712, -74.227],
//     [40.774, -74.125]
// ]);
// bounds.extend([40.715, -75.227]);
// console.log('bounds: ', bounds);

// const bounds2 = G.latLngBounds([40.712, -75.227]);
// console.log('bounds2: ', bounds2);

// console.log('contains: ', bounds.contains(G.latLng(43.712, -74.227)));
// console.log('equals: ', bounds.equals(G.latLngBounds([40.712, -74.227])));
// console.log('equals: ', bounds.equals(bounds2));
// console.log('center: ', bounds.getCenter());
// console.log('getNorthEast: ', bounds.getNorthEast());
// console.log('getSouthWest: ', bounds.getSouthWest());
// console.log('intersects: ', bounds.intersects(bounds2));
// console.log('isEmpty: ', bounds.isEmpty());
// console.log('toJson: ', bounds.toJson());
// console.log('toSpan: ', bounds.toSpan());
// console.log('toString: ', bounds.toString());
// console.log('toUrlValue: ', bounds.toUrlValue());
// console.log('union: ', bounds.union(bounds2));
// console.log('center: ', bounds.getCenter());

//     const symbol = G.svgSymbol('M0,6a6,6 0 1,0 12,0a6,6 0 1,0 -12,0', {
//         fillColor: '#5284ed',
//         fillOpacity: 1,
//         scale: 1,
//         strokeColor: '#5284ed',
//         strokeOpacity: 0.5,
//         strokeWeight: 4,
//     });
//     console.log('symbol: ', symbol);
//     console.log('anchor: ', symbol.anchor);
//     console.log('fillColor: ', symbol.fillColor);
//     console.log('fillOpacity: ', symbol.fillOpacity);
//     console.log('labelOrigin: ', symbol.labelOrigin);
//     console.log('path: ', symbol.path);
//     console.log('rotation: ', symbol.rotation);
//     console.log('scale: ', symbol.scale);
//     console.log('strokeColor: ', symbol.strokeColor);
//     console.log('strokeOpacity: ', symbol.strokeOpacity);
//     console.log('strokeWeight: ', symbol.strokeWeight);
//     console.log('toGoogle: ', symbol.toGoogle());
// });

// load.on('load', () => { console.log('loaded event'); });
// load.load();

// const load = G.loader({ apiKey: apiKey, });
// load.on('load', () => { console.log('loaded event'); });


const map = G.map('map1', {
    // apiKey: apiKey,
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
