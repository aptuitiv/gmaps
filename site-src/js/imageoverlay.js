/* ===========================================================================
    ImageOverlay example

    This example shows how to create an image overlay on the map.
=========================================================================== */

G.loader().setApiKey(apiKey).load();

// Initialize the map
const map = G.map('#map1', {
    center: { latitude: 44.3644077301405, longitude: -68.32022737144165 }, // Mt Desert Island, ME
    // center: { latitude: 40.7128, longitude: -74.0060 }, // New York City
    zoom: 16,
});
map.show();
// Use the click event to help get the lat/lng to set the bounds of the image overlay
map.on('click', (event) => {
    console.log('map click latLng: ', event.latLng.getLat(), ', ', event.latLng.getLng());
});

const marker = G.marker({
    latitude: 44.3644077301405,
    longitude: -68.32022737144165,
    map: map,
    title: 'My Marker',
});

// Create an image overlay
const imageOverlay = G.imageOverlay({
    imageUrl: 'https://bcms-files.s3.amazonaws.com/2ajn2d9Bq3-1851/images/Campground-Map.png',
    // image: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/talkeetna.png',
    bounds: {
        ne: [44.36877953646439, -68.31675122855835], // Northeast corner
        sw: [44.361063461552426, -68.32760881065063], // Southwest corner
    },
    // debug: true,
    opacity: 0.5,
    className: 'custom-image-overlay',
    // styles: {
    //     transform: 'rotate(-45deg)',
    // },
});

// Show the image overlay on the map
imageOverlay.show(map);

// Enable dragging and resizing
imageOverlay.enableDrag();
imageOverlay.enableResize();

// Listen for drag events
// imageOverlay.on('dragstart', (event) => {
//     console.log('Drag started:', event);
// });

// imageOverlay.on('drag', (event) => {
//     console.log('Dragging:', event);
// });

// imageOverlay.on('dragend', (event) => {
//     console.log('Drag ended:', event);
// });

// // Listen for resize events
// imageOverlay.on('resizestart', (event) => {
//     console.log('Resize started:', event);
// });

// imageOverlay.on('resize', (event) => {
//     console.log('Resizing:', event);
// });

// imageOverlay.on('resizeend', (event) => {
//     console.log('Resize ended:', event);
// });

// Example of toggling the image overlay
document.addEventListener('keydown', (event) => {
    if (event.key === 't' || event.key === 'T') {
        imageOverlay.toggle(map);
    }
});

// Example of changing the opacity
document.addEventListener('keydown', (event) => {
    if (event.key === 'o' || event.key === 'O') {
        const currentOpacity = imageOverlay.getOpacity();
        const newOpacity = currentOpacity > 0.5 ? 0.3 : 0.8;
        imageOverlay.setOpacity(newOpacity);
    }
});

// Example of changing the image
document.addEventListener('keydown', (event) => {
    if (event.key === 'i' || event.key === 'I') {
        const newImageUrl = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
        imageOverlay.setImageUrl(newImageUrl);
    }
});

// Example of toggling drag mode
document.addEventListener('keydown', (event) => {
    if (event.key === 'd' || event.key === 'D') {
        if (imageOverlay.draggable) {
            imageOverlay.disableDrag();
            console.log('Drag disabled');
        } else {
            imageOverlay.enableDrag();
            console.log('Drag enabled');
        }
    }
});

// Example of toggling resize mode
document.addEventListener('keydown', (event) => {
    if (event.key === 'r' || event.key === 'R') {
        if (imageOverlay.resizable) {
            imageOverlay.disableResize();
            console.log('Resize disabled');
        } else {
            imageOverlay.enableResize();
            console.log('Resize enabled');
        }
    }
});

// Add instructions to the page
const instructions = document.createElement('div');
instructions.innerHTML = `
    <div style=" background: white; padding: 10px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h3>ImageOverlay Controls:</h3>
        <p><strong>Mouse:</strong> Click and drag to move the image overlay</p>
        <p><strong>Corners:</strong> Drag the corner circles to resize</p>
        <p><strong>Keyboard:</strong></p>
        <ul>
            <li><strong>T:</strong> Toggle visibility</li>
            <li><strong>O:</strong> Toggle opacity</li>
            <li><strong>I:</strong> Change image</li>
            <li><strong>D:</strong> Toggle drag mode</li>
            <li><strong>R:</strong> Toggle resize mode</li>
        </ul>
        <p><strong>Console:</strong> Check browser console for bounds updates</p>
    </div>
`;
document.body.appendChild(instructions);
