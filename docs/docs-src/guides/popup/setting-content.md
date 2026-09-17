---
---

# Setting the popup content

There are two ways to set the content for a popup.

## Pass a string of content

If you pass a string of content then it's set in the overlay container div using `innerHTML`.

You can pass a string of text, or a string of HTML. If you pass HTML then they'll get displayed as actual HTML elements.

The following are equivalent.

```js
const popup = G.popup({
    content: 'Test content'
});
```

```js
const popup = G.popup('Test content');
```

```js
const popup = G.popup({
    content: '<p>Test content</p><p><button>Close</button><p>',
    closeElement: 'button'
});
```

```js
const popup = G.popup('<p>Test content</p><p><button>Close</button><p>');
popup.closeElement = 'button';
```

```js
const content = `<p>Test content</p>
    <p><button>Close</button></p>
`;
const popup = G.popup(content);
popup.closeElement = 'button';
```

## Pass an [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement), or [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) object

Instead of passing a string of HTML, you can create the DOM elements and pass that as the content.

The following are equivalent.

```js
const popupContent = document.createElement('div');
popupContent.appendChild(document.createElement('h1')).textContent = 'My Popup';
popupContent.appendChild(document.createElement('p')).textContent = 'Test content.';
popupContent.appendChild(document.createElement('button')).textContent = 'close';

const popup = G.popup({content: popupContent, closeElement: 'button'});
```

```js
const popupContent = document.createElement('div');
popupContent.appendChild(document.createElement('h1')).textContent = 'My Popup';
popupContent.appendChild(document.createElement('p')).textContent = 'Test content.';
popupContent.appendChild(document.createElement('button')).textContent = 'close';

const popup = G.popup(popupContent);
popup.closeElement = 'button';
```
