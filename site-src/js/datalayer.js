/* ===========================================================================
    Javascript for the Data layer page
=========================================================================== */

/* global G, apiKey */

/* ---------------------------------------------------------------------------
    The map's own data layer.
    This is the example from the Google documentation:
    https://developers.google.com/maps/documentation/javascript/datalayer#polygon
--------------------------------------------------------------------------- */
const map = G.map('#map1', { apiKey, center: { lat: -33.872, lng: 151.252 }, zoom: 6 });

// The outer edge of the polygon
const outerCoords = [
    { lat: -32.364, lng: 153.207 }, // north west
    { lat: -35.364, lng: 153.207 }, // south west
    { lat: -35.364, lng: 158.207 }, // south east
    { lat: -32.364, lng: 158.207 }, // north east
];

// The first hole
const innerCoords1 = [
    { lat: -33.364, lng: 154.207 },
    { lat: -34.364, lng: 154.207 },
    { lat: -34.364, lng: 155.207 },
    { lat: -33.364, lng: 155.207 },
];

// The second hole
const innerCoords2 = [
    { lat: -33.364, lng: 156.207 },
    { lat: -34.364, lng: 156.207 },
    { lat: -34.364, lng: 157.207 },
    { lat: -33.364, lng: 157.207 },
];

map.data.setStyle({ fillColor: '#4caf50', fillOpacity: 0.4, strokeColor: '#1b5e20', strokeWeight: 2 });

map.data.addPolygon([outerCoords, innerCoords1, innerCoords2], {
    id: 'rectangle',
    properties: { name: 'A rectangle with two holes' },
}).then((feature) => {
    console.log('feature: ', feature);
    console.log('feature.geometryType: ', feature.geometryType);
    console.log('feature.getPaths().length: ', feature.getPaths().length);
    console.log('feature.properties: ', feature.properties);
});

// A single path without any holes in it
map.data.addPolygon([
    { lat: -30, lng: 150 },
    { lat: -31, lng: 150 },
    { lat: -31, lng: 151 },
]);

// A line and a point
map.data.addPolyline([{ lat: -36, lng: 150 }, { lat: -37, lng: 152 }, { lat: -36, lng: 154 }]);
map.data.addPoint({ lat: -34, lng: 149 }, { properties: { name: 'A point' } });

map.data.onClick((event) => {
    console.log('map.data click: ', event.feature.getProperty('name'), event.latLng);
});

// Attach one popup to every feature in the layer.
// The {name} placeholder is replaced with each feature's "name" property.
map.data.attachPopup('<h3>{name}</h3>', 'click');

/* ---------------------------------------------------------------------------
    A separate data layer, styled by a property on each feature
--------------------------------------------------------------------------- */
const map2 = G.map('#map2', { apiKey, center: { lat: 48.864716, lng: 2.3522 }, zoom: 12 });

const geoJson = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            id: 'park',
            properties: { name: 'A park', type: 'park' },
            geometry: {
                type: 'Polygon',
                coordinates: [[[2.32, 48.87], [2.35, 48.87], [2.35, 48.85], [2.32, 48.85], [2.32, 48.87]]],
            },
        },
        {
            type: 'Feature',
            id: 'water',
            properties: { name: 'A lake', type: 'water' },
            geometry: {
                type: 'Polygon',
                coordinates: [[[2.36, 48.87], [2.39, 48.87], [2.39, 48.85], [2.36, 48.85], [2.36, 48.87]]],
            },
        },
    ],
};

const colors = { park: '#4caf50', water: '#2196f3' };

// The layer can be set up and have data loaded into it before there's a map to show it on
const layer = G.dataLayer({
    style: (feature) => ({
        fillColor: colors[feature.getProperty('type')] || '#999999',
        fillOpacity: 0.6,
        strokeColor: '#333333',
        strokeWeight: 1,
    }),
});

layer.addGeoJson(geoJson).then((features) => {
    console.log('loaded features: ', features);
    console.log('feature ids: ', features.map((feature) => feature.id));
});

// Attach the populated layer to the map
layer.setMap(map2);

// Highlight the feature that the mouse is over, and put it back afterwards
layer.onMouseOver((event) => {
    event.feature.setStyle({ fillOpacity: 1, strokeWeight: 3 });
});
layer.onMouseOut((event) => {
    event.feature.resetStyle();
});

layer.onClick((event) => {
    console.log('layer click: ', event.feature.getProperty('name'));
    console.log('feature bounds: ', event.feature.getBounds());
});

/*
    There are three ways to show a popup for a feature.

    1. Attach one popup to the whole layer, as map1 does above. Every feature gets it.
    2. Attach a popup to a single feature.
    3. Show a popup yourself from the layer's click event, for full control.
*/

// 2. A popup on one feature only. This wins over a popup attached to the whole layer.
// The function can return the content, a PopupOptions object, or a whole Popup object.
layer.getFeature('water').then((feature) => {
    feature.attachPopup((f) => ({
        className: 'waterPopup',
        content: `<h3>${f.getProperty('name')}</h3><p>This one has its own popup.</p>`,
        theme: 'default',
    }));
});

// A popup on the whole layer, which the "water" feature above overrides
layer.attachPopup('<h3>{name}</h3><p>Type: {type}</p>');

// 3. Doing it by hand. This is what you'd use if you need to do more than set the content,
// such as loading the content from somewhere before showing the popup.
const manualPopup = G.popup({ autoClose: true, theme: 'default', clearance: [20, 20] });
const manualMap = G.map('#map3', { apiKey, center: { lat: 48.864716, lng: 2.3522 }, zoom: 12 });
const manualLayer = G.dataLayer({
    map: manualMap,
    style: { fillColor: '#9c27b0', fillOpacity: 0.5, strokeColor: '#4a148c', strokeWeight: 1 },
});

// fitBounds zooms the map to the data. Without it the map stays at the zoom it was set up with.
manualLayer.addGeoJson(geoJson, { fitBounds: true });

manualLayer.onClick((event) => {
    manualPopup.setContent(`<h3>${event.feature.getProperty('name')}</h3>`);

    /*
        Hide the popup before showing it again.

        The map is only panned to bring the popup into view on the first draw after the popup
        is shown. Hiding it resets that, so every popup gets scrolled into view and not just
        the first one. attachPopup() does this for you.
    */
    manualPopup.hide();
    manualPopup.position = event.latLng;
    manualPopup.show(manualMap);
});

// Fit the map to everything in the layer
layer.fitBounds();

// Log everything that ends up in the layer
layer.getFeatures().then((features) => {
    console.log('layer.getFeatures(): ', features);
    console.log('polygons only: ', features.filter((feature) => feature.geometryType === 'Polygon'));
});
