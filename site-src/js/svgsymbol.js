/* ===========================================================================
    Javascript for the SvgSymbol page
=========================================================================== */


/* global G */


G.loader({ apiKey: apiKey, }).load().then(() => {
    const symbol = G.svgSymbol('M0,6a6,6 0 1,0 12,0a6,6 0 1,0 -12,0', {
        fillColor: '#5284ed',
        fillOpacity: 1,
        scale: 1,
        strokeColor: '#5284ed',
        strokeOpacity: 0.5,
        strokeWeight: 4,
    });
    console.log('symbol: ', symbol);
    console.log('anchor: ', symbol.anchor);
    console.log('fillColor: ', symbol.fillColor);
    console.log('fillOpacity: ', symbol.fillOpacity);
    console.log('labelOrigin: ', symbol.labelOrigin);
    console.log('path: ', symbol.path);
    console.log('rotation: ', symbol.rotation);
    console.log('scale: ', symbol.scale);
    console.log('strokeColor: ', symbol.strokeColor);
    console.log('strokeOpacity: ', symbol.strokeOpacity);
    console.log('strokeWeight: ', symbol.strokeWeight);
    console.log('toGoogle: ', symbol.toGoogle());
});
