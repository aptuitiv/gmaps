/* ===========================================================================
    Javascript for the Point page
=========================================================================== */


/* global G */


G.loader({ apiKey: apiKey, }).load().then(() => {
    const point1 = G.point(2, 4);
    console.log('point1: ', point1);
    console.log('clone: ', point1.clone());
    console.log('add: ', point1.add(2, 2));
    console.log('sub: ', point1.subtract(10, 5));
    console.log('mul2: ', point1.multiply(2));
    console.log('divi: ', point1.divide(2));
    console.log('ceil: ', G.point(2.5, 3.5).ceil());
    console.log('floor: ', G.point(2.5, 3.5).floor());
    console.log('round: ', G.point(2.5, 3.5).round());
    console.log('distance: ', G.point(2, 4).distanceTo(G.point(4, 6)));
    console.log('equals: ', G.point(2, 4).equals(G.point(2, 4)));
    console.log('equals: ', G.point(2, 4).equals(G.point(4, 6)));
    console.log('setX: ', G.point(2, 4).setX(10));
    console.log('setY: ', G.point(2, 4).setY(10));
    console.log('set: ', G.point(2, 4).set(10, 3));
    console.log('truclate: ', G.point(2.5, 3.5).trunc());
});
