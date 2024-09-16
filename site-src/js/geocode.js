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
        address: '221 B Baker St, London, England',
        // bounds: bounds,
        // location: {
        //     lat: 44.7,
        //     lng: -69.8,
        // },
        // region: 'US',
    });
    geocoder.run().then((response) => {
        console.log('Response: ', response);
    })
        .catch((error) => {
            console.error('Error: ', error);
        });

    G.geocode().run({
        address: '04938',
    }).then((response) => {
        console.log('Response 2: ', response);
    });
});
