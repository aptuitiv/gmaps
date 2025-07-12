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

// Create an image overlay
const imageOverlay = G.imageOverlay({
    imageUrl: 'https://bcms-files.s3.amazonaws.com/2ajn2d9Bq3-1851/images/Campground-Map.png',
    // image: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/talkeetna.png',
    bounds: {
        ne: [44.36864148441174, -68.32181523917846], // Northeast corner
        sw: [44.361063461552426, -68.32760881065063], // Southwest corner
    },
    debug: true,
    opacity: 0.5,
    className: 'custom-image-overlay',
    // styles: {
    //     transform: 'rotate(-45deg)',
    // },
});
console.log('imageOverlay: ', imageOverlay);

// Show the image overlay on the map
imageOverlay.show(map);

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
        imageOverlay.setImage(newImageUrl);
    }
});
