/* ===========================================================================
    Javascript for the Tooltip page
=========================================================================== */


/* global G */

/* TEST 1  */
G.loader().setApiKey(apiKey).load();

const map = G.map('map1', {
    latitude: 40.730610,
    longitude: -73.935242,
    zoom: 8
});
map.show();
const marker = G.marker({
    latitude: 41.2,
    longitude: -72.2,
    map: map,
    title: 'My Marker',
    tooltip: { content: 'Custom tooltip', className: 'MapTooltip' }
    // tooltip: { className: 'MapTooltip', offset: [0, 15] }
});

// marker.setTooltip({ content: 'This is a tooltip on a marker2' });

// const ttContent = document.createElement('div');
// ttContent.style.background = '#fff';
// ttContent.style.color = '#555';
// ttContent.style.padding = '1px';
// ttContent.style.transform = 'translate(-50%, 0)';
// ttContent.innerHTML = 'This is a tooltip on a map';

const tooltip = G.tooltip({
    className: 'my-tooltip',
    content: 'This is a tooltip',
    // content: ttContent,
    // position: { lat: 42.7, lng: -72.9 },
    // map
});
tooltip.style('backgroundColor', '#ff0000');
tooltip.style('color', '#fff');
// // tooltip.show(map);
// // console.log('Tooltip: ', tooltip);
// // tooltip.attachTo(map);
// tooltip.attachTo(marker);

map.on('click', (e) => {
    tooltip.position = e.latLng;
    tooltip.show(map);
    console.log('tooltip offset: ', tooltip.offset);
    console.log('tooltip position: ', tooltip.position);
});

function updateTooltip() {
    // tooltip.content = '<b style="background: #fff; display: block; padding: 10px;">Updated</b> tooltip';
    const div = document.createElement('div');
    div.style.background = '#fff';
    div.style.padding = '10px';
    div.style.border = '1px solid #ff0000';
    div.innerHTML = 'Updated tooltip';
    tooltip.content = div;
    // tooltip.position = { lat: 40.6, lng: -73.2 };
    tooltip.show(map);
}
