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

    const bounds3 = G.latLngBounds({
        sw: G.latLng(44, -68),
        ne: G.latLng(44.7, -70.8),
    });
    console.log('bounds3: ', bounds3.toJson());

    const bounds4 = G.latLngBounds({
        north: 23.7,
        east: -10.8,
        south: -15.3,
        west: -45.3,
    });
    console.log('bounds4: ', bounds4.toJson());

});
