/* ===========================================================================
    ImageOverlay example

    This example shows how to create an image overlay on the map.

    You can also use this to find the exact positioning that you need for an image on your map.
=========================================================================== */

G.loader().setApiKey(apiKey).load();

// Set the the image URL and the bounds of the image overlay
const mapCenter = { latitude: 44.3644077301405, longitude: -68.32022737144165 };
const imageUrl = 'https://bcms-files.s3.amazonaws.com/2ajn2d9Bq3-1851/images/Campground-Map.png';
// const imageUrl = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/talkeetna.png';
const imageBounds = {
    ne: [44.36877953646439, -68.31675122855835], // Northeast corner
    sw: [44.361063461552426, -68.32760881065063], // Southwest corner
};
const debug = false;
const enableDrag = true;
const enableResize = true;
const enableRotation = true;
const imageRotation = 0;

// Initialize the map
const map = G.map('#map1', {
    center: mapCenter,
    zoom: 16,
});
map.show();




// Create an image overlay
const imageOverlay = G.imageOverlay({
    imageUrl: imageUrl,
    // image: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/talkeetna.png',
    bounds: imageBounds,
    debug: debug,
    drag: enableDrag,
    resize: enableResize,
    map: map,
    opacity: 0.7,
    rotation: imageRotation,
    rotate: enableRotation,
    // className: 'custom-image-overlay',
    // styles: {
    //     transform: 'rotate(45deg)',
    //     outline: '1px solid red',
    // },
});

console.log('image rotate: ', imageOverlay.rotate);
console.log('Image styles: ', imageOverlay.styles);

// Show the image overlay on the map
// imageOverlay.show(map);

// Enable dragging, resizing, and rotation
// imageOverlay.enableDrag();
// imageOverlay.enableResize();
// imageOverlay.enableRotation();

// Show the image overlay on the map
// imageOverlay.show(map);

// Add a marker to confirm if the overlay is above or below the marker
const marker = G.marker({
    latitude: mapCenter.latitude,
    longitude: mapCenter.longitude,
    map: map,
    title: 'My Marker',
});

// Use the click event to help get the lat/lng to set the bounds of the image overlay
map.on('click', (event) => {
    console.log('map click latLng: ', event.latLng.getLat(), ', ', event.latLng.getLng());
});

/**
 * Get the debug information for the image overlay
 *
 * @returns {object} The debug information
 */
const getDebugInfo = () => {
    const bounds = imageOverlay.getBounds();
    return {
        angle: imageOverlay.getRotation(),
        bounds: {
            ne: bounds.getNorthEast().toJson(),
            sw: bounds.getSouthWest().toJson(),
        }
    };
};

// Listen for drag events
// imageOverlay.on('dragstart', (event) => {
//     console.log('Drag started:', event);
// });

// imageOverlay.on('drag', (event) => {
//     console.log('Dragging:', event);
// });

imageOverlay.on('dragend', (event) => {
    console.log('Drag ended:', event);
    console.log('Drag End: ', getDebugInfo());
});

// Listen for resize events
// imageOverlay.on('resizestart', (event) => {
//     console.log('Resize started:', event);
// });

// imageOverlay.on('resize', (event) => {
//     console.log('Resizing:', event);
// });

imageOverlay.on('resizeend', (event) => {
    // console.log('Resize ended:', event);
    const bounds = imageOverlay.getBounds();

    console.log('Resize End: ', getDebugInfo());
});

// Listen for rotation events
// imageOverlay.on('rotatestart', (event) => {
//     console.log('Rotation started:', event);
// });

// imageOverlay.on('rotate', (event) => {
//     console.log('Rotating:', event);
// });

imageOverlay.on('rotateend', (event) => {
    console.log('Rotation End: ', event);
    console.log('Rotation End:', getDebugInfo());
});

// Example of toggling the image overlay
document.addEventListener('keydown', (event) => {
    if (event.key === 't' || event.key === 'T') {
        imageOverlay.toggle(map);
    }
});

// Example of changing the opacity
document.addEventListener('keydown', (event) => {
    if (event.key === 'p' || event.key === 'P') {
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
        if (imageOverlay.drag) {
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
        if (imageOverlay.resize) {
            imageOverlay.disableResize();
            console.log('Resize disabled');
        } else {
            imageOverlay.enableResize();
            console.log('Resize enabled');
        }
    }
});

// Example of toggling rotation mode
document.addEventListener('keydown', (event) => {
    if (event.key === 'o' || event.key === 'O') {
        if (imageOverlay.rotate) {
            imageOverlay.disableRotation();
            console.log('Rotation disabled');
        } else {
            imageOverlay.enableRotation();
            console.log('Rotation enabled');
        }
    }
});

// Example of setting rotation angle
document.addEventListener('keydown', (event) => {
    if (event.key === '0') {
        imageOverlay.setRotation(0);
        console.log('Rotation set to 0 degrees');
    } else if (event.key === '9') {
        imageOverlay.setRotation(90);
        console.log('Rotation set to 90 degrees');
    } else if (event.key === '8') {
        imageOverlay.setRotation(180);
        console.log('Rotation set to 180 degrees');
    } else if (event.key === '7') {
        imageOverlay.setRotation(270);
        console.log('Rotation set to 270 degrees');
    }
});

// Example of fitting to image
document.addEventListener('keydown', (event) => {
    if (event.key === 'f' || event.key === 'F') {
        imageOverlay.fitToImage().then(() => {
            console.log('Overlay fitted to image dimensions', getDebugInfo());
            console.log('Aspect ratio set to:', imageOverlay.getResizeAspectRatio());
            // console.log('Current bounds:', imageOverlay.getBounds().toJson());
        });
    }
});

// Add instructions to the page
const instructions = document.createElement('div');
instructions.innerHTML = `
    <div style="background: white; padding: 15px; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-top: 10px;">
        <h3>ImageOverlay Controls:</h3>
        <p><strong>Mouse:</strong> Click and drag to move the image overlay</p>
        <p><strong>Corners:</strong> Drag the corner circles to resize (NW, NE, SW, SE)</p>
        <p><strong>Rotation Handle:</strong> Drag the blue handle at the top to rotate the image</p>
        <p><strong>Keyboard:</strong></p>
        <ul>
            <li><strong>T:</strong> Toggle visibility</li>
            <li><strong>P:</strong> Toggle opacity</li>
            <li><strong>I:</strong> Change image</li>
            <li><strong>D:</strong> Toggle drag mode</li>
            <li><strong>R:</strong> Toggle resize mode</li>
            <li><strong>O:</strong> Toggle rotation mode</li>
            <li><strong>0:</strong> Set rotation to 0°</li>
            <li><strong>9:</strong> Set rotation to 90°</li>
            <li><strong>8:</strong> Set rotation to 180°</li>
            <li><strong>7:</strong> Set rotation to 270°</li>
            <li><strong>F:</strong> Fit overlay to image dimensions</li>
        </ul>
        <p><strong>Console:</strong> Check browser console for bounds updates, resize events, and rotation events</p>
        <p><strong>Testing:</strong> Try resizing from different corners and rotating the image to verify functionality</p>
        <p><strong>Aspect Ratio:</strong> After pressing F to fit to image, resizing will maintain the image's aspect ratio</p>
    </div>
`;
document.body.appendChild(instructions);
