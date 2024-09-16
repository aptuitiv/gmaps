/* ===========================================================================
    Javascript for the Geocode page
=========================================================================== */


/* global G */

const bounds = G.latLngBounds({
    sw: G.latLng(44, -68),
    ne: G.latLng(44.7, -70.8),
});
console.log('Bounds: ', bounds.toJson());

G.loader({ apiKey: apiKey, }).load().then(() => {
    const geocoder = G.geocode({
        // componentRestrictions: {
        //     postalCode: '04938',
        // },
        // componentRestrictions: {
        //     country: 'US',
        // },
        // address: '04938',
        address: '1398 N. "E" Street, San Bernardino, CA 92405',
        // bounds: bounds,
        // location: {
        //     lat: 44.7,
        //     lng: -69.8,
        // },
        // region: 'US',
    });
    geocoder.geocode().then((response) => {
        console.log('Response: ', response);
    })
        .catch((error) => {
            console.error('Error: ', error);
        });
});
