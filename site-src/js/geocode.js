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
        // address: '221 B Baker St, London, England',
        address: 'no match'
        // bounds: bounds,
        // location: {
        //     // lat: 44.7,
        //     // lng: -69.8,
        //     lat: -75.290330,
        //     lng: 38.653861
        // },
        // region: 'US',
    });
    geocoder.fetch().then((response) => {
        console.log('Response: ', response);
        if (response.length > 0) {
            console.log('response[0].geometry.location: ', response[0].geometry.location.lat(), response[0].geometry.location.lng());
        }
    })
        .catch((error) => {
            console.error('Error: ', error);
        });

    // G.geocode().fetch({
    //     address: '04938',
    // }).then((response) => {
    //     console.log('Response 2: ', response);
    // });


    // (async () => {
    //     try {
    //         const result = await geocoder.fetch();
    //         console.log('Result: ', result);
    //     } catch (error) {
    //         console.error('Error: ', error);
    //     }
    // })();

});
