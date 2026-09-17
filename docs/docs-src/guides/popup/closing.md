---
---

# Closing the popup

By default the popup will be closed when clicking again on the element that triggered opening the popup. There are a few ways to have control over closing a popup.

**1. Have an element outside of the popup that when clicked will call the popup's [close](/api-reference/popup#close) method.**

```js
const map = G.map('map1', { apiKey: apiKey, center: { latitude: 48.864716, longitude: 2.3522 } });
const marker = G.marker({
    latitude: 48.9,
    longitude: 2.4,
    map: map,
});
const popup = G.popup('Marker popup');
popup.attachTo(marker);

// Elsewhere on the page can be a button to close the popup
const closePopupBtn = document.createElement('button');
closePopupBtn.textContent = 'Close Popup';
closePopupBtn.addEventListener('click', () => {
    popup.close();
});
document.body.appendChild(closePopupBtn);
```

**2. More commonly, have an element inside the popup that closes the popup when clicked.**

The following creates a popup with a button in it to close the popup. The button is referenced with the `closeElement` [popup option](/api-reference/popup#popup-options).

```js
const map = G.map('map1', { apiKey: apiKey, center: { latitude: 48.864716, longitude: 2.3522 } });
const marker = G.marker({
    latitude: 48.9,
    longitude: 2.4,
    map: map,
    title: 'Marker 1',
});
const content = `
    <h1>My Popup</h1>
    <p>This is a popup on a marker. Isn't it great!</p>
    <p><button type="button" class="close">Close</button></p>
`;
marker.attachPopup({
    closeElement: 'button.close',
    content: content,
    styles: { maxWidth: '200px', textAlign: 'center', padding: '10px 20px' }
});
```

When you have an element in your popup that will close the popup when clicked there are a few ways that you can set it up.

**You can use the `closeElement` popup option.**

This is how it's done in the example above.

**You can set the close element with the `closeElement` property.**

```js
const popup = G.popup('<p>My popup</p><p><buttton>Close</button></p>');
popup.closeElement = 'button';
```

**You can set the close element with the [setCloseElement](/api-reference/popup#setcloseelement) method.**

```js
const popupContent = document.createElement('div');
popupContent.appendChild(document.createElement('h1')).textContent = 'My Popup';
const closeButton = document.createElement('button');
closeButton.textContent = 'Close popup';
popupContent.appendChild(closeButton);

const popup = G.popup(popupContent);
popup.setCloseElement(closeButton);
popup.attachTo(marker);
```

For each of the above methods you can set the close element as an HTMLElement or a string CSS selector.

The CSS selector can be for one element, or multiple elements. [`querySelectorAll()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) is used, which means your selector can match multiple elements in the popup, or,  you can use multiple selectors.
