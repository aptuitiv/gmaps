/* ===========================================================================
    Javascript for the Marker Cluster page
=========================================================================== */

/* global G */

const map = G.map('#map1', { apiKey: apiKey, center: { latitude: 48.864716, longitude: 2.3522 } });
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
};

// Image renderer options
clusterOptions = {
    imageRendererOptions: {
        images: {
            5: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png',
            10: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m2.png',
            25: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m3.png',
            50: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m4.png',
            100: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m5.png',
        },
    },
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
markerPositions.forEach((position, index) => {
    const markerNumber = index + 1;
    const marker = G.marker({
        latitude: position.latitude,
        longitude: position.longitude,
        title: 'Marker ' + markerNumber,
        // A custom tooltip, shown on hover. It's styled here rather than with a class so that
        // this page doesn't need any CSS of its own.
        tooltip: {
            className: 'my-tooltip',
            content: 'Marker ' + markerNumber,
            offset: [0, 15],
            styles: {
                backgroundColor: '#14213d',
                borderRadius: '3px',
                color: '#ffffff',
                fontSize: '12px',
                padding: '3px 8px',
            },
            theme: 'none',
        },
    });

    // A popup, shown on click. The content is built the first time it's opened rather than for
    // all 300 markers up front.
    marker.attachPopup(() => ({
        closeElement: 'button.close',
        content: `
            <h2 style="margin: 0 0 6px; font-size: 14px;">Marker ${markerNumber}</h2>
            <p style="margin: 0 0 4px;">Latitude: ${position.latitude.toFixed(4)}</p>
            <p style="margin: 0 0 8px;">Longitude: ${position.longitude.toFixed(4)}</p>
            <button type="button" class="close">Close</button>
        `,
        styles: { maxWidth: '220px', padding: '10px 14px' },
        theme: 'default',
    }), 'click');

    // Neither the tooltip nor the popup is given a map, and neither is the marker. The cluster
    // records which map the marker is on when it draws it, and that recorded map is what they
    // both use to work out where to show themselves. Setting the map here as well would be
    // redundant - the cluster overrides it when it draws - and would leave the markers on the
    // map unclustered until that first draw.
    markers.push(marker);
    // cluster.addMarker(marker);
});
cluster.addMarkers(markers);
