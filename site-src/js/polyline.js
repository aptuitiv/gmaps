/* ===========================================================================
    Javascript for the Polyline page
=========================================================================== */

/* global G */

function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

// Set up the map
const map = G.map('#map1', { apiKey: apiKey, center: { latitude: 48.864716, longitude: 2.3522 } });
// map.load();

const polylineCollection = G.polylineCollection();

const path = [];
const lat = 48;
const lng = 2;
for (let i = 0; i < 10; i += 1) {
    path.push({
        latitude: lat + (randomNumber(0, 0.2) * i),
        longitude: lng + (randomNumber(0, .2) * i),
    });
}

const polyline = G.polyline({
    clickable: true,
    path: path,
    map: map,
    strokeColor: 'red',
    strokeWeight: 3,
    zIndex: 2,
    highlightPolyline: {
        strokeColor: 'purple',
        strokeOpacity: 1,
        strokeWeight: 25,
    },
    data: { custom: 'value' }
});
console.log('polyline: ', polyline);
console.log('polyline.data: ', polyline.data);
console.log('polyline.getData: ', polyline.getData());
polyline.data = { custom: 'new value', custom2: 'new value 2' };
console.log('polyline.data: ', polyline.data);
console.log('polyline.getData: ', polyline.getData());
console.log('polyline.getData(custom2): ', polyline.getData('custom2'));
polylineCollection.add(polyline);

// const highlight = G.polyline({
//     // clickable: true,
//     // path: path,
//     // map: map,
//     strokeColor: 'blue',
//     strokeOpacity: 0.5,
//     strokeWeight: 20,
//     // visible: false,
//     // zIndex: 1
// });
// polyline.highlightPolyline = highlight;


polyline.attachTooltip('This is a polyline tooltip');
const content = `
    <h1>My Polyline</h1>
    <p><button type="button">Close 1</button></p>
    <p>This is a polyline <a href="#" class="closeP">close</a></p>
    <p><button type="button">Close</button></p>
`;
polyline.attachPopup({ content: content, offset: [0, -4], closeElement: 'button,.closeP' }, 'clickon');

// Set up multiple polylines
// const tags = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'];
const tags = Array.from({ length: 10 }, (v, i) => `tag${i + 1}`);
const tagsUsed = new Set();
for (let i = 0; i < 10; i += 1) {
    const path = [];
    const thisLat = lat + (0.1 * i);
    const thisLng = lng + i;
    for (let i = 0; i < 10; i += 1) {
        path.push({
            latitude: thisLat + (0.1 * i),
            longitude: thisLng + (0.1 * i),
        });
    }

    const tag = tags[Math.floor(Math.random() * tags.length)];
    tagsUsed.add(tag);
    const polyline = G.polyline({
        clickable: true,
        path: path,
        map: map,
        strokeColor: 'blue',
        strokeWeight: 3,
        zIndex: 1,
        highlightPolyline: {
            strokeColor: 'blue',
            strokeOpacity: 1,
            strokeWeight: 10,
        }
    });
    polylineCollection.add(polyline, tag);
}


// Buttons to show/hide the polyline
const hideButton = document.createElement('button');
hideButton.textContent = 'Hide Polyline';
hideButton.addEventListener('click', () => {
    polyline.hide();
});

const showButton = document.createElement('button');
showButton.textContent = 'Show Polyline';
showButton.addEventListener('click', () => {
    polyline.show();
});

// Buttons to do stuff
const grid = document.createElement('div');
grid.style.display = 'flex';
grid.style.flexDirection = 'row';
grid.style.flexWrap = 'wrap';
grid.style.gap = '10px';
grid.style.padding = '10px 0';
document.body.appendChild(grid);
grid.appendChild(hideButton);
grid.appendChild(showButton);

const hideAllButton = document.createElement('button');
hideAllButton.textContent = 'Hide All';
hideAllButton.addEventListener('click', () => {
    polylineCollection.hideAll();
});
grid.appendChild(hideAllButton);

const showAllButton = document.createElement('button');
showAllButton.textContent = 'Show All';
showAllButton.addEventListener('click', () => {
    polylineCollection.showAll();
});
grid.appendChild(showAllButton);

const highlightAllButton = document.createElement('button');
highlightAllButton.textContent = 'Highlight All';
highlightAllButton.addEventListener('click', () => {
    polylineCollection.highlightAll();
});
grid.appendChild(highlightAllButton);

const unhighlightAllButton = document.createElement('button');
unhighlightAllButton.textContent = 'Unhighlight All';
unhighlightAllButton.addEventListener('click', () => {
    polylineCollection.unhighlightAll();
});
grid.appendChild(unhighlightAllButton);

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
        polylineCollection.hide(tag);
    });
    tagGrid.appendChild(hideButton);

    const showButton = document.createElement('button');
    showButton.textContent = `Show ${tag}`;
    showButton.addEventListener('click', () => {
        polylineCollection.show(tag);
    });
    tagGrid.appendChild(showButton);

    const highlightButton = document.createElement('button');
    highlightButton.textContent = `Highlight ${tag}`;
    highlightButton.addEventListener('click', () => {
        polylineCollection.highlight(tag);
    });
    tagGrid.appendChild(highlightButton);

    const unhighlightButton = document.createElement('button');
    unhighlightButton.textContent = `Unhighlight ${tag}`;
    unhighlightButton.addEventListener('click', () => {
        polylineCollection.unhighlight(tag);
    });
    tagGrid.appendChild(unhighlightButton);
});

const hideTagsButton = document.createElement('button');
hideTagsButton.textContent = `Hide tags 1 - 3`;
hideTagsButton.addEventListener('click', () => {
    polylineCollection.hide('tag1', 'tag2', 'tag3');
});
tagGrid.appendChild(hideTagsButton);

const showTagsButton = document.createElement('button');
showTagsButton.textContent = `Show tags 3 - 5`;
showTagsButton.addEventListener('click', () => {
    polylineCollection.show('tag3', 'tag4', 'tag5');
});
tagGrid.appendChild(showTagsButton);

console.log(polylineCollection);
