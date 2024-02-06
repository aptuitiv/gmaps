/* ===========================================================================
    Javascript for the Size page
=========================================================================== */


/* global G */


G.loader({ apiKey: apiKey, }).load().then(() => {


    const size = G.size(2, 4);
    console.log('size: ', size);
    console.log('clone: ', size.clone());
    console.log('set: ', size.set(10, 3));
    console.log('isvalid: ', size.isValid());
    console.log('isvalid: ', G.size().isValid());
    console.log('isvalid: ', G.size().setWidth(3).isValid());
    console.log('set: ', G.size().set(10, 3));
    console.log('set: ', G.size().setWidth(3).setHeight('150'));
    const size2 = G.size(10, 20);
    console.log('size2: ', size2);
    console.log('getter w: ', size2.width);
    console.log('getter h: ', size2.height);
    const size3 = G.size();
    size3.width = 100;
    console.log('size3: ', size3);
    size3.height = 200;
    console.log('size3: ', size3);


});
