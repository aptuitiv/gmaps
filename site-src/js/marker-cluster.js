/* ===========================================================================
    Javascript for the Marker Cluster page
=========================================================================== */


/* global G */



const map = G.map('map1', { apiKey: apiKey, center: { latitude: 48.864716, longitude: 2.3522 } });
map.load();

let clusterOptions = undefined;

// Default renderer options
clusterOptions = {
    defaultRenderOptions: {
        colorRangeTop: '#d62828', // Red
        // colorRangeBottom: '#14213d', // Blue
        colorRangeBottom: {
            bgColor: '#E5E5E5',
            textColor: '#000000',
        },
        // colors: {
        //     5: '#75A15D', // green
        //     10: '#00859E', // blue/green
        //     20: '#D97E31', // orange
        //     30: '#FF006E' // rose
        // },
        // colors: {
        //     0: '#75A15D', // green
        //     5: '#D97E31', // orange
        //     10: {
        //         bgColor: '#E5E5E5',
        //         textColor: '#000000',
        //     },
        // },
        centerOpacity: 0.7,
        middleOpacity: 0.4,
        outerOpacity: 0.2,
        labelFontFamily: 'roboto,arial,sans-serif',
        labelFontSize: '12px',
        // showNumber: true,
    },
    // onClusterClick: (event, cluster, map) => {
    //     console.log('Cluster clicked', event);
    //     console.log('Cluster clicked', cluster);
    // }
}


// Image renderer options
clusterOptions = {
    imageRendererOptions: {
        images: {
            5: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png',
            10: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m2.png',
            25: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m3.png',
            50: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m4.png',
            100: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m5.png',
        }
    }
};

// Create the cluster object
const cluster = G.markerCluster(map, clusterOptions);

// Marker positions
const markerPositions = [];

const latRange = [48, 50];
const lngRanage = [2, 10];
for (let i = 0; i < 300; i += 1) {
    markerPositions.push({
        latitude: latRange[0] + Math.random() * (latRange[1] - latRange[0]),
        longitude: lngRanage[0] + Math.random() * (lngRanage[1] - lngRanage[0]),
    });
}


const markers = [];
markerPositions.forEach((position) => {
    const marker = G.marker({
        latitude: position.latitude,
        longitude: position.longitude,
        map: map,
    });
    marker.show(map);
    markers.push(marker);
    // cluster.addMarker(marker);
});
cluster.addMarkers(markers);
