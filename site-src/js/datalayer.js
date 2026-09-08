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

// Fit the map to everything in the layer
layer.fitBounds();

// Log everything that ends up in the layer
layer.getFeatures().then((features) => {
    console.log('layer.getFeatures(): ', features);
    console.log('polygons only: ', features.filter((feature) => feature.geometryType === 'Polygon'));
});
