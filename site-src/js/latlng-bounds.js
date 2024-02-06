/* ===========================================================================
    Javascript for the LatLngBounds page
=========================================================================== */


/* global G */


G.loader({ apiKey: apiKey, }).load().then(() => {




    const bounds = G.latLngBounds([
        // [40.712, -74.227],
        [40.774, -74.125]
    ]);
    bounds.extend([40.715, -75.227]);
    console.log('bounds: ', bounds);

    const bounds2 = G.latLngBounds([40.712, -75.227]);
    console.log('bounds2: ', bounds2);

    console.log('contains: ', bounds.contains(G.latLng(43.712, -74.227)));
    console.log('equals: ', bounds.equals(G.latLngBounds([40.712, -74.227])));
    console.log('equals: ', bounds.equals(bounds2));
    console.log('center: ', bounds.getCenter());
    console.log('getNorthEast: ', bounds.getNorthEast());
    console.log('getSouthWest: ', bounds.getSouthWest());
    console.log('intersects: ', bounds.intersects(bounds2));
    console.log('isEmpty: ', bounds.isEmpty());
    console.log('toJson: ', bounds.toJson());
    console.log('toSpan: ', bounds.toSpan());
    console.log('toString: ', bounds.toString());
    console.log('toUrlValue: ', bounds.toUrlValue());
    console.log('union: ', bounds.union(bounds2));
    console.log('center: ', bounds.getCenter());


});
