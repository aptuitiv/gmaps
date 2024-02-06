/* ===========================================================================
    Javascript for the LatLng page
=========================================================================== */


/* global G */


G.loader({ apiKey: apiKey, }).load().then(() => {
    const lat = G.latLng(48.864716, 2.3522);
    const lat2 = G.latLng().set(lat);
    console.log('lat2: ', lat2);
    console.log(G.latLng(lat).setLat(10));
    console.log(lat);
    console.log('long: ', lat2.latitude, ' :: ', lat2.longitude);
    console.log('short: ', lat2.lat, ' :: ', lat2.longitude);
    console.log('google: ', lat2.toGoogle());
    lat2.lat = 10;
    lat2.lng = 20;
    console.log('lat2: ', lat2, ' :: ', lat2.lat, ' :: ', lat2.longitude);

});
