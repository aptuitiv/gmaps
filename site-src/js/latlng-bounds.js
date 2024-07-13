/* ===========================================================================
    Javascript for the LatLngBounds page
=========================================================================== */


/* global G */


G.loader({ apiKey: apiKey, }).load().then(() => {




    const bounds = G.latLngBounds([
        // [40.712, -74.227],
        [40.774, -74.125]
    ]);
    // bounds.init().then(async () => {
    bounds.extend([42.715, -76.227]);
    console.log('bounds: ', bounds);

    const bounds2 = G.latLngBounds([40.712, -75.227]);
    console.log('bounds2: ', bounds2);

    console.log('contains: ', bounds.contains(G.latLng(43.712, -74.227)));
    (async () => {
        console.log('equals: ', await bounds.equals(G.latLngBounds([40.712, -74.227])));
        console.log('equals: ', await bounds.equals(bounds2));
        console.log('intersects: ', await bounds.intersects(bounds2));
    })();

    console.log('center: ', bounds.getCenter());
    console.log('getNorthEast: ', bounds.getNorthEast());
    console.log('getSouthWest: ', bounds.getSouthWest());

    console.log('isEmpty: ', bounds.isEmpty());
    console.log('toJson: ', bounds.toJson());
    console.log('toString: ', bounds.toString());
    console.log('toUrlValue: ', bounds.toUrlValue());
    console.log('union: ', bounds.union(bounds2));
    console.log('center: ', bounds.getCenter());
    // });



});
