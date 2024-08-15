/* ===========================================================================
    Javascript for the Popup page
=========================================================================== */


/* global G */

/* TEST 1  */
const map = G.map('#map1', { apiKey: apiKey, center: { latitude: 48.864716, longitude: 2.3522 } });
// map.load();
const marker = G.marker({
    latitude: 48.9,
    longitude: 2.4,
    map: map,
    title: 'Marker 1',
});
const content = `
    <h1>My Popup</h1>
    <p>This is a popup on a marker. Isn't it great!</p>
    <p>Here is another line.</p>
    <p><a href="https://www.google.com">Google</a></p>
    <p><button type="button" class="close">Close</button></p>
`;
marker.attachPopup({
    clearance: { width: 10, height: 10 },
    closeElement: 'button.close',
    content: content,
    styles: { maxWidth: '200px', textAlign: 'center', padding: '10px 20px' },
    theme: 'default'
});


const marker2 = G.marker({
    latitude: 48.9,
    longitude: 3.4,
    map: map,
    title: 'Marker 2',
});
// marker.attachPopup('My Popup');

const popupContent = document.createElement('div');
popupContent.appendChild(document.createElement('h1')).textContent = 'My Popup';
popupContent.appendChild(document.createElement('p')).textContent = 'Test content.';
const closeButton = document.createElement('button');
closeButton.textContent = 'Close popup';
popupContent.appendChild(closeButton);
// const popup = G.popup('This is a test with the content as the initial prop. <button>close</button> ');
const popup = G.popup(popupContent);
popup.center = false;
popup.clearance = [20, 40];
popup.closeElement = closeButton;
popup.theme = 'default';
popup.attachTo(marker2);


const mapPopup = G.popup({
    clearance: [100, 15],
    content: 'This is a test on the map <button class="close">close</button>',
    theme: 'default'
});
mapPopup.setCloseElement('.close');
map.attachPopup(mapPopup, 'clickon');

const closePopupBtn = document.createElement('button');
closePopupBtn.textContent = 'Close Map Popup';
closePopupBtn.addEventListener('click', () => {
    mapPopup.close();
});
document.body.appendChild(closePopupBtn);

const closeAllPopupBtn = document.createElement('button');
closeAllPopupBtn.textContent = 'Close All Popups';
closeAllPopupBtn.addEventListener('click', () => {
    G.closeAllPopups();
});
document.body.appendChild(closeAllPopupBtn);
