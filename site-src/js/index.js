/* ===========================================================================
    Javascript for the index page
=========================================================================== */

const map = G.map('map1', {
    apiKey: 'AIzaSyCOQopRM-4Mrbi_E7_-BTEw7-cPqiDJ7UM',
    center: { lat: 36.224, lng: -81.688 },
}).load(() => {

});

console.log('map1: ', map1);

const map2 = G.map('map2', {
    apiKey: 'AIzaSyCOQopRM-4Mrbi_E7_-BTEw7-cPqiDJ7UM',
    center: { lat: 10, lng: 0 },
}).load(() => {

});
console.log('map 2 object', map2);
