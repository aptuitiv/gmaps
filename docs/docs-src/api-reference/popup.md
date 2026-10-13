---
---

# Popup

The Popup object displays a custom popup on the map.

`Popup` extends [Overlay](/api-reference/overlay).

This is an alternate option to displaying an [InfoWindow](/api-reference/infowindow). You have full style control over a popup.

The easiest way to display a popup is to use the [attachPopup()](/api-reference/base-classes/layer#attachpopup) method.

## Example usage

```js
 marker = G.marker({
    latitude: 40.730610,
    longitude: -73.935242,
});
marker.attachPopup('My Popup');
```

## Creating the Popup object

`G.popup(options?: PopupValue): Popup`

There are a few ways that you can setup the `Popup` object.

**No parameters.**

`G.popup(): Popup`

```js
const popup = G.popup();
```

**Pass the popup options.**

`G.popup(options: PopupOptions): Popup`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [PopupOptions](#popup-options) | Yes | The options. |

```js
const popup = G.popup({
    className: 'my-popup',
    content: 'This is a popup on a marker',
});
```

**Pass an existing Popup object.**

`G.popup(object: Popup): Popup`

In this case the `Popup` object is simply returned.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| object | Popup | Yes | A Popup object. |

```js
const popup = G.popup(popupObject);
```

**Pass the popup content.**

`G.popup(content: string|HTMLElement|Text): Popup`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| content | string, HTMLElement, or Text | Yes | The popup content. |

```js
const popup = G.popup('My popup content');
```

```js
const content = document.createElement('div');
content.classList.add('myPopupClass');
content.innerHTML = 'This is my popup';
const popup = G.popup(content);
```

## Popup type

The [`attachPopup()`](/api-reference/base-classes/layer#attachpopup) function and other methods that accept a popup value accept `PopupValue` as the value type.

The `PopupValue` can be one of the following values:

- `Popup` object
- [PopupOptions](#popup-options) object
- A string containing the content for the popup
- An HTMLElement that will be the content for the popup.
- A [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) node that will be the content for the popup.

## Popup callback type

Type `PopupCallback`

Anywhere a popup value is accepted you can pass a function instead of a fixed value. It's called every time the popup is about to be shown and is passed the object that the popup is attached to.

`(target?: Map | Layer) => PopupValue`

It returns a [PopupValue](#popup-type), so it can return any of the following.

- A string, `HTMLElement` or `Text` node, which becomes the content of the popup.
- A [PopupOptions](#popup-options) object, which is set on the popup. Use this when more than the content changes.
- A [Popup](#popup-type) object, which is shown instead. Use this when you want a completely different popup.

```js
// Build the content when the marker is clicked rather than up front
marker.attachPopup((marker) => `<h3>${marker.getData('name')}</h3>`);

// Return options when more than the content changes
marker.attachPopup((marker) => ({
    className: marker.getData('type'),
    content: marker.getData('name'),
}));

// Return a different popup entirely
marker.attachPopup(() => somePopup);
```

The type that combines the two is `AttachPopupValue`, which is `PopupValue | PopupCallback`. That's what [attachPopup()](/api-reference/base-classes/layer#attachpopup) accepts.

:::note

When the callback returns a `Popup` object, that popup is the one shown and the popup that `attachPopup()` returned is never displayed. If the callback returns a different popup than the one currently showing, the one showing is hidden first so that it isn't left on the map.

:::

When a `hover` popup is attached to the map, the callback is called when the mouse moves over the map. It isn't called again as the mouse moves around. The popup that is showing just follows the cursor.

A data layer uses its own version of the callback, [DataPopupCallback](/api-reference/data-layer#popup-callback-type), which is passed the [DataFeature](/api-reference/data-feature) that was clicked. See [Attaching to a data layer](#attaching-to-a-data-layer).

## Attach event type

Type `AttachEventValue`

The events that can show an attached popup or tooltip. It's used by [attachTo()](#attachto), [attachPopup()](/api-reference/base-classes/layer#attachpopup), and the data layer [attachPopup()](/api-reference/data-layer#attachpopup) methods.

`'click' | 'clickon' | 'hover'`

- `click` - Toggle the display of the popup when clicking on the element.
- `clickon` - Show the popup when clicking on the element. It stays shown, and clicking the element again doesn't hide it.
- `hover` - Show the popup when hovering over the element. Hide the popup when the element is no longer hovered.

The default for a popup is `click`.

## Attaching to a data layer

A popup can be attached to every feature in a [DataLayer](/api-reference/data-layer#attachpopup), or to a single [DataFeature](/api-reference/data-feature#attachpopup). The value is a `DataPopupValue`, which accepts the same things as a [PopupValue](#popup-type) plus a [DataPopupCallback](/api-reference/data-layer#popup-callback-type) function. A string of content can hold `{property}` placeholders, which are replaced with the properties of the feature that the popup is shown for. See [Popup value type](/api-reference/data-layer#popup-value-type) for more details.

```js
map.data.attachPopup('<h3>{name}</h3><p>{description}</p>');
```

A popup attached to a single feature takes precedence over one attached to the whole layer.

## Popup options

Type `PopupOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| ariaLabel | string | | The accessible name for the popup, written to its `aria-label` attribute. Screen readers announce it when focus moves into the popup. Set this for any popup that has a role, which is every popup except a hover one by default. See [Accessibility](#accessibility). |
| autoClose | boolean | true | Whether to automatically close other open popups when opening this one. |
| center | boolean | true | Whether to center the popup horizontally on the element. Useful if the popup is on a marker. If this is `true` then `transform: translate(-50%, -100%)` is added to the popup container `div`. If it's `false` then `transform: translate(0, -100%)` is added. Either way the popup is positioned above the element. |
| className | string | | The popup wrapper class name. |
| clearance | [SizeValue](/api-reference/utilities/size#sizevalue-type) | 0, 0 | The amount of space between the popup and the map viewport edge. This is used when the map is panned to bring the popup into view. |
| closeElement | string or [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) | | The string CSS selector or an HTMLElement representing the element that will close the popup when clicked. See [Closing the popup](/guides/popup/closing) for more information. |
| content | string, [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement), or [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text)  | | The popup content |
| event | string | 'click' | The event to trigger the display of the popup. Allowed values are `click`, `clickon`, and `hover`. This is an alternate way of setting the trigger event than passing the event to [attachTo](#attachto) or [attachPopup](/api-reference/base-classes/layer#attachpopup). |
| fit | boolean | true | Whether to fit the popup within the map bounds when it's displayed. If this is `true` then the map may pan to bring the full popup into view. This will not happen if `event` is `hover` as that can be a jarring experience. |
| focus | boolean | true | Whether focus is moved into the popup when it's opened, and given back to where it was when it's closed. A popup shown on hover never takes focus. See [Accessibility](#accessibility). |
| offset | [PointValue](/api-reference/utilities/point#pointvalue-type) | | The amount to offset the popup from the element it is displayed at. If the element is a [Marker](/api-reference/marker), then this is added to the marker's anchorPoint value. For example, if the marker is 40px tall and no anchorPoint value was set for the marker, then by default the popup will be displayed at the top of the marker. If you set the offset to be 0, -20 then the popup will be displayed 20px above the top of the marker. If the element is a marker and this is not set, then the marker's anchorPoint value is used.|
| role | string | 'dialog' | The [ARIA role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles) for the popup element. Defaults to `dialog`, or `tooltip` for a popup shown on hover. |
| styles | object | | An object of styles to apply to the popup. |
| theme | string | 'none' | The theme to use for the popup. By default the popup does not have any default styles and you have to use your own. Set to `default` to use the basic default theme. Note, if `center` is `true` then `transform: translate(-50%, -100%)` will still be set to horizontally center the popup on the element. |

## Accessibility

A popup opened by `click` or `clickon` behaves as a non-modal dialog.

- **Role and name.** The popup element gets `role="dialog"`, which you can change with the `role` [option](#popup-options). Give it a name with the `ariaLabel` option, such as the name of the place the popup is about, so that screen readers announce what opened.
- **Focus moves in.** When the popup opens, focus moves to the first thing in it that can take focus, such as a link or a button. If there's nothing like that, the popup itself is focused. Set `focus: false` to leave focus where it is. Note that this applies to popups opened from code too, so if you open a popup when the page loads you probably want `focus: false`.
- **Focus comes back.** When the popup closes, focus goes back to wherever it was before the popup opened. That only happens if focus was still inside the popup, so it's never pulled back from somewhere the user has moved it to.
- **Escape closes it.** Pressing Escape closes the most recently opened popup, wherever focus is on the page. If something inside the popup handles Escape itself and calls `preventDefault()`, the popup stays open.
- **Focus isn't trapped.** The map behind the popup is still usable, so Tab can move focus out of the popup.

A popup shown on `hover` works like a [tooltip](/api-reference/tooltip#accessibility) instead. It never takes focus, has `role="tooltip"`, the pointer can move onto it, and Escape hides it. Like a tooltip, it isn't shown for keyboard focus.

Use a real `<button>` as the [close element](/guides/popup/closing). If you use something else, like a `<div>` or a `<span>`, it's given `role="button"` and `tabindex="0"`, and Enter and Space close the popup. A role or a tabindex you set yourself is kept.

## Events

Below are the available popup events.

You can use the plain text name for the event, or you can use the [event constant](/api-reference/constants#popupevents).

| Event    | Description |
|----------|-------------|
| open | Called when the popup is opened. |

### open event

Called when the popup is opened.

```js
popup.on('open', () => {
    // Do something here
});

// You can also use the event constant
popup.on(G.PopupEvents.OPEN, () => {
    // Do something here
});

// Or, use the onOpen method
popup.onOpen(() => {
    // Do something here
});
```

## Properties

- Properties inherited from [Overlay](/api-reference/overlay#properties).
- Properties inherited from [Layer](/api-reference/base-classes/layer#properties).

| Property  | Type   | Description                             |
|-----------|--------|-----------------------------------------|
| ariaLabel | string | The accessible name for the popup. This does the same as the `ariaLabel` [option](#popup-options). Setting an empty string removes it. |
| autoClose | boolean | Whether to automatically close other open popups when opening this one |
| center | boolean | Whether to center the popup horizontally on the element. This does the same as the `center` [option](#popup-options). |
| clearance | [Size](/api-reference/utilities/size) | The amount of space between the popup and the map viewport edge. This is used when the map is panned to bring the popup into view. It can be set with a [SizeValue](/api-reference/utilities/size#sizevalue-type). |
| closeElement | string or [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) | The string CSS selector or an HTMLElement representing the element that will close the popup when clicked. See [Closing the popup](/guides/popup/closing) for more information. |
| content | string, [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement), or [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) | The popup content. |
| event | string | The event to trigger the display of the popup. Allowed values are `click`, `clickon`, and `hover`. This is an alternate way of setting the trigger event than passing the event to [attachTo](#attachto) or [attachPopup](/api-reference/base-classes/layer#attachpopup). An error is thrown if any other value is set. |
| fit | boolean | Whether to fit the popup within the map bounds when it's displayed. If this is `true` then the map may pan to bring the full popup into view. This is ignored if `event` is `hover` as that can be a jarring experience. |
| focus | boolean | Whether focus is moved into the popup when it's opened. This does the same as the `focus` [option](#popup-options). |
| role | string | The ARIA role used for the popup element. This is the role actually in use, so if one wasn't set it's `dialog`, or `tooltip` for a popup shown on hover. Setting an empty string goes back to the default. |
| theme | string | The theme to use for the popup. This does the same as the `theme` [option](#popup-options). |

## Methods

- Methods inherited from [Overlay](/api-reference/overlay#methods).
- Methods inherited from [Layer](/api-reference/base-classes/layer#methods).
- Methods inherited from [Evented](/api-reference/base-classes/evented#methods).
- Methods inherited from [Base](/api-reference/base-classes/base#methods).

### attachTo

`attachTo(element: Map | Layer, event?: 'click' | 'clickon' | 'hover', callback?: PopupCallback): Promise<Popup>`

Attach the Popup to a map or an element that extends the [Layer object](/api-reference/base-classes/layer). By default the Popup is shown when the element is clicked.

Elements that extend [Layer](/api-reference/base-classes/layer) include [Marker](/api-reference/marker), [Polyline](/api-reference/polyline), [InfoWindow](/api-reference/infowindow), and [Popup](/api-reference/popup).

A Popup can only be attached once. Calling `attachTo()` again on the same Popup does nothing.

| Parameter | Type | Default | Required | Description |
|-----------|------|---------|----------|-------------|
| element | [Map](/api-reference/map) or [Layer](/api-reference/base-classes/layer) | | Yes | The element to attach the Popup to. |
| event | [AttachEventValue](#attach-event-type) | 'click' | | The event to trigger the Popup. If it's not set then the `event` [option](#popup-options) is used. |
| callback | [PopupCallback](#popup-callback-type) | | | A function that works out what to show each time the Popup is displayed. Usually you'd pass the function to [attachPopup()](/api-reference/base-classes/layer#attachpopup) instead of using this directly. |

Allowed `event` values include:

- `click` - Toggle the display of the Popup when clicking on the element.
- `clickon` - Show the Popup when clicking on the element. It will always be shown and can't be hidden once the element is clicked. This may be useful if you want to show a Popup each time you click on the map.
- `hover` - Show the Popup when hovering over the element. Hide the Popup when the element is no longer hovered.

```js
const popup = G.popup({
    className: 'my-popup',
    content: 'This is a popup on a marker',
});
popup.attachTo(marker);
```

```js
const popup = G.popup({
    className: 'my-popup',
    content: 'This is a popup on a map',
});
popup.attachTo(map, 'clickon');
```

### close

`close(): Popup`

Close the popup. Alias to [hide()](#hide).

```js
popup.close();
```

### hasContent

`hasContent(): boolean`

Returns whether the popup has any content set.

```js
if (popup.hasContent()) {
    // Do something
}
```

### hide

`hide(): Popup`

Close the popup. Alias to [close()](#close).

```js
popup.hide();
```

### isOpen

`isOpen(): boolean`

Returns whether the popup is open.

```js
if (popup.isOpen()) {
    // Do something
}
```

### open

`open(element: Map | Layer): Promise<Popup>`

Open the popup attached to the element. Alias to [show()](#show).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| element | [Map](/api-reference/map) or [Layer](/api-reference/base-classes/layer) | Yes | The element to attach the Popup to. |

```js
popup.open(marker);
```

### setCloseElement

`setCloseElement(element: HTMLElement | string): Popup`

Set the element to close the popup. This can be a CSS selector or an HTMLElement. The popup will be closed when this element is clicked.

See [Closing the popup](/guides/popup/closing) for more information.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| element | string or [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) | Yes  | The element to close the popup. This can be a CSS selector or an HTMLElement. |

```js
const popup = G.popup('<p>My popup</p><p><button>Close</button></p>');
popup.setCloseElement('button');
```

### setContent

`setContent(content: string | HTMLElement | Text): Popup`

Set the popup content.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| content | string or [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) or [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) | Yes  | The popup content. |

```js
popup.setContent('This is the content');
```

### setOptions

`setOptions(options: PopupOptions): Popup`

Set the options for the popup.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [PopupOptions](#popup-options) | Yes  | The popup options. |

```js
popup.setOptions({content: 'Hi!'});
```

### show

`show(element: Map | Layer): Promise<Popup>`

Open the popup attached to the element. Alias to [open()](#open).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| element | [Map](/api-reference/map) or [Layer](/api-reference/base-classes/layer) | Yes | The element to attach the Popup to. |

```js
popup.show(marker);
```

### toggle

`toggle(element: Map | Layer): void`

Toggle the display of the popup on the map.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| element | [Map](/api-reference/map) or [Layer](/api-reference/base-classes/layer) | Yes | The element to attach the Popup to. |

```js
popup.toggle(marker);
```

## Close all popups

There is a helper function to close all open popups. This is useful if you need to change what is on the map and there is a possibility that a popup may be open.

`G.closeAllPopups(): void`

Example usage:

```js
G.closeAllPopups();
```
