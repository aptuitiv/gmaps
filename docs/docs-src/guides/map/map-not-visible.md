---
---

# When the map is hidden initially

If the map on your website isn't visible initially because it has a `display: none` style, then there are a few extra things to consider.

If you try to render a Google map into a hidden container, then the Google Maps library doesn't know what the size of the map should be, and weird things happen. Those weird things can include:

- tiles not loading
- components overlaying each other
- markers not displaying

This library has a built-in mechanism to help deal with this. When the map is rendered, it will check whether the element the map is supposed to be rendered into is hidden or has a height or width of zero. (The height and width test determines if a parent element is hidden.) If the element is hidden, has a height of 0, or a width of 0, then the map is not rendered. Instead, an IntersectionObserver is set up. When the element becomes visible, the map will be rendered.

Because the map may not be rendered and ready when your code expects it to be, it's recommended that you use the `G.loader` object to load the Google Maps library instead of using the `G.maps` `load` method.

Do this:

```js
G.loader({ apiKey: config.apiKey, libraries: ['places'] }).load().then(() => {
    // Run the rest of your map related stuff here
});
```

instead of this:

```js
G.map('selector', {apiKey: config.apiKey, libraries: ['places']}).load().then(() => {
    // This may not work as well depending on your code because the Google maps library
    // may not be loaded right away if the map element is initially hidden.
});
```

## What if I change elements on the map while it's hidden?

That built-in mechanism works great when you are only toggling the map's display. However, if you are also changing elements on the map (like markers) while the map is hidden, then you may need to take some extra steps to ensure that the map displays correctly once it's visible. (This is especially important if you run the map `fitBounds` method while it's hidden.)

When the map is visible again it will sometimes not look correct. The common solution is to force a resize with `google.maps.event.trigger(map, 'resize');`. However, as of Google maps version 3.32 in 2018 triggering 'resize' has no effect. ([Source](https://stackoverflow.com/a/2590049))

Since we can't trigger a resize in that way the other way to force a resize is to resize the container around the map. You can do this manually with something like this:

```js
const map = document.querySelector('.mapWrapperSelector');
const mapHeight = map.getBoundingClientRect().height;
map.style.height = `${mapHeight + 1}px`;
setTimeout(() => {
    map.style.height = `${mapHeight}px`;
}, 100);
```

The `setTimeout` code is to give a brief amount of time for Google maps to recognize the height change and to trigger a resize.

### Built-in solution

You can use the [resize](/api-reference/map#resize) method to do what the above code does. By default it will resize the element that the map is rendered in. You can pass a selector or an HTML element to resize instead if necessary. You may need to do this if another element around the map has a set height and the map container is set to be `100%` height.

Resize the map element.

```js
map.resize();
```

Resize another element around the map. You may need to do this if another element around the map has a set height and the map container is set to be `100%` height.

```js
map.resize(mapWrapperElement);
```

Resize another element by passing a selector instead of an HTML element.

```js
map.resize('#someSelector');
// or
map.resize('.someOtherSelector');
```

### Waiting until the map is ready

You can also wait until the map is ready with the [onReady](/api-reference/map#onready) method. The `ready` event is triggered when the Google Maps library is loaded and the map is displayed.

```js
G.loader({ apiKey: config.apiKey, libraries: ['places'] }).load().then(() => {
    // Set up the map
    map = $.map('selector');
    map.onReady(() => {
        // Do more stuff to set up the map components here.
    });
});
```
