/* ===========================================================================
    Javascript for the Marker page
=========================================================================== */

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

/* global G */

/* TEST 1  */
G.loader().setApiKey(apiKey).load();

// const map = G.map('#map1', {
//     latitude: 40.730610,
//     longitude: -73.935242,
//     zoom: 8
// });
// map.show();
// const marker = G.marker({
//     latitude: 40.730610,
//     longitude: -73.935242,
//     map: map,
//     title: 'My Marker'
// });

/* TEST 2 */
const map = G.map('#map1', { center: { latitude: 48.864716, longitude: 2.3522 } });
map.show().then(() => {
    // Dispatch a custom event
    marker.dispatch('custom', { data: 'test' });
});
const marker = G.marker({
    latitude: 48.9,
    longitude: 2.4,
    map: map,
    title: 'My Marker',
});
const callback = (e) => {
    console.log('Marker Clicked: ', e);
    e.stop();
};
const otherCallback = (e) => {
    console.log('Other Marker Clicked: ', e);
    e.stop();
}
marker.once('click', callback, { once: false });

// Set up a custom event listener
marker.on('custom', (e) => {
    console.log('custom event: ', e);
});


G.loader({ apiKey: apiKey }).load(() => {
    marker.label = 'New label';
});

marker.on('click', otherCallback);


/* TEST 3 */

// const loader = G.loader({ apiKey: apiKey, });
// loader.on('load', () => { console.log('loaded event'); });
// loader.on('map_loaded', () => { console.log('map loaded event'); });
// loader.load();
// const map = G.map('#map1', {
//     apiKey: apiKey,
//     center: { lat: 36.224, lng: -81.688 },
// });

// const marker = G.marker({
//     latitude: 36.224,
//     longitude: -81.688,
//     title: 'My Marker',
//     tooltipContainer: '#map',
//     tooltipClass: 'my-tooltip'
// });
// marker.show(map);
// // marker.on('click', (e) => {
// //     console.log('Marker Clicked: ', e);
// // });
// map.show().then(() => {
//     console.log('1 loaded')
//     // marker.show(map);
// });

// console.log('map: ', map);
// console.log('isMap: ', map.isMap());
// console.log('isMarker: ', map.isMarker());

function removeEvents() {
    // marker.off('click', callback);
    // marker.off();
    marker.offAll();
    console.log('Events removed');
}

// Marker collections
const lat = 48.9;
const lng = 2;
const markerCollection = G.markerCollection();
const tags = Array.from({ length: 10 }, (v, i) => `tag${i + 1}`);

const tagsUsed = new Set();
for (let i = 0; i < 20; i += 1) {
    const tag = tags[Math.floor(Math.random() * tags.length)];
    tagsUsed.add(tag);
    const marker = G.marker({
        latitude: lat + randomNumber(-2.5, 2.5),
        longitude: lng + randomNumber(-6, 6),
        map: map,
        tooltip: `Marker ${tag}`,
    });
    markerCollection.add(marker, tag);
}

// Buttons to do stuff
const grid = document.createElement('div');
grid.style.display = 'flex';
grid.style.flexDirection = 'row';
grid.style.flexWrap = 'wrap';
grid.style.gap = '10px';
grid.style.padding = '10px 0';
document.body.appendChild(grid);

const hideAllButton = document.createElement('button');
hideAllButton.textContent = 'Hide All';
hideAllButton.addEventListener('click', () => {
    markerCollection.hideAll();
});
grid.appendChild(hideAllButton);

const showAllButton = document.createElement('button');
showAllButton.textContent = 'Show All';
showAllButton.addEventListener('click', () => {
    markerCollection.showAll(map);
});
grid.appendChild(showAllButton);

// Tag buttons
const tagGrid = document.createElement('div');
tagGrid.style.display = 'flex';
tagGrid.style.flexDirection = 'row';
tagGrid.style.flexWrap = 'wrap';
tagGrid.style.gap = '10px';
tagGrid.style.padding = '10px 0';
document.body.appendChild(tagGrid);

Array.from(tagsUsed).sort().forEach((tag) => {
    const hideButton = document.createElement('button');
    hideButton.textContent = `Hide ${tag}`;
    hideButton.addEventListener('click', () => {
        markerCollection.hide(tag);
    });
    tagGrid.appendChild(hideButton);

    const showButton = document.createElement('button');
    showButton.textContent = `Show ${tag}`;
    showButton.addEventListener('click', () => {
        markerCollection.show(map, tag);
    });
    tagGrid.appendChild(showButton);
});

const hideTagsButton = document.createElement('button');
hideTagsButton.textContent = `Hide tags 1 - 3`;
hideTagsButton.addEventListener('click', () => {
    markerCollection.hide('tag1', 'tag2', 'tag3');
});
tagGrid.appendChild(hideTagsButton);

const showTagsButton = document.createElement('button');
showTagsButton.textContent = `Show tags 3 - 5`;
showTagsButton.addEventListener('click', () => {
    markerCollection.show(map, 'tag3', 'tag4', 'tag5');
});
tagGrid.appendChild(showTagsButton);
