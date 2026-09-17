---
---

# PlacesSearchBox

The PlacesSearchBox is used to tie in a Google Maps Places search into a text input field using the [Google Maps Places SearchBox widget](https://developers.google.com/maps/documentation/javascript/examples/places-searchbox).

:::info
It's recommended to use the [AutocompleteSearchBox](autocomplete-search-box) over PlacesSearchBox because the AutocompleteSearchBox gives you more options to configure the search box. See the [Places widgets page "Summary of classes"](https://developers.google.com/maps/documentation/javascript/place-autocomplete#summary-of-classes) for more information on the differences.
:::

`PlacesSearchBox` extends [Evented](/api-reference/base-classes/evented).

## Example usage

```js
const placesSearchBox = G.placesSearchBox('.inputSelector');
placesSearchBox.init().then(() => {
    placesSearchBox.on('places_changed', () => {
        const place = placesSearchBox.getPlace();
        G.marker({
            map: map,
            position: place.geometry.location,
            tooltip: place.name,
        });
        map.fitBounds(placesSearchBox.getPlacesBounds());
    });
});
```

## Creating the PlacesSearchBox object

`G.placesSearchBox(input?: PlacesSearchBoxValue, options?: PlacesSearchBoxOptions): PlacesSearchBox`

If a string selector is passed and no element matches it then an error is thrown.

There are a few ways that you can setup the `PlacesSearchBox` object.

**No parameters.**

`G.placesSearchBox(): PlacesSearchBox`

```js
const placesSearchBox = G.placesSearchBox();
```

**Pass the options.**

`G.placesSearchBox(options: PlacesSearchBoxOptions): PlacesSearchBox`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [PlacesSearchBoxOptions](#placessearchbox-options) | Yes | The options. |

```js
const placesSearchBox = G.placesSearchBox({
    input: '#inputId'
});
```

**Pass the input selector.**

`G.placesSearchBox(input: HTMLInputElement | string): PlacesSearchBox`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| input | [HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement) \| string | Yes | The input selector. |

```js
const placesSearchBox = G.placesSearchBox('#inputId');
```

**Pass the input selector and the options.**

`G.placesSearchBox(input: HTMLInputElement | string, options: PlacesSearchBoxOptions): PlacesSearchBox`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| input | [HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement) \| string | Yes | The input selector. |
| options | [PlacesSearchBoxOptions](#placessearchbox-options) | Yes | The options. |

```js
const myTextField = document.querySelector('.myInput');
const placesSearchBox = G.placesSearchBox(myTextField, {bounds: myLatLngBoundsObject});
```

**Pass an existing PlacesSearchBox object.**

`G.placesSearchBox(object: PlacesSearchBox): PlacesSearchBox`

In this case the `PlacesSearchBox` object is simply returned.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| object | PlacesSearchBox | Yes | A PlacesSearchBox object. |

```js
const placesSearchBox = G.placesSearchBox(placesSearchBoxObject);
```

## PlacesSearchBox value type

The `PlacesSearchBoxValue` can be one of the following values:

- `PlacesSearchBox` object
- [PlacesSearchBoxOptions](#placessearchbox-options) object
- An [HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement) object that is the text input to associate the search box with.
- A string CSS selector for the text input to associate the search box with. Any valid selector for `document.querySelector` can be used.

## PlacesSearchBox options

Type `PlacesSearchBoxOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| bounds | [LatLngBoundsValue](/api-reference/utilities/latlng-bounds#latlngbounds-value-type) |  | A [LatLngBounds](/api-reference/utilities/latlng-bounds) value type. |
| input | [HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement) \| string |  | The text input element, or a CSS selector for it. This is required when the options object is the only value passed to [G.placesSearchBox()](#creating-the-placessearchbox-object). |

## Events

Below are the events that the PlacesSearchBox will emit.

You can use the plain text name for the event, or you can use the [event constant](/api-reference/constants#placessearchboxevents).

| Event    | Description |
|----------|-------------|
| places_changed | Called when the user selects a Place. |

### places_changed

The event object passed to the callback has these extra properties.

| Property | Type | Description |
|----------|------|-------------|
| bounds | [LatLngBounds](/api-reference/utilities/latlng-bounds) | The map bounds based on the places that were found. |
| places | [google.maps.places.PlaceResult](https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceResult)[] | The places that were found. This is typically one place and it's the place that the user clicked on. |

```js
placesSearchBox.on('places_changed', (event) => {
    // Handle the event
    console.log('Places: ', event.places);
    console.log('Bounds: ', event.bounds);
});

// Or, you can destructure the Event object
placesSearchBox.on('places_changed', ({places, bounds}) => {
    // Handle the event
    console.log('Places: ', places);
    console.log('Bounds: ', bounds);
});

// Or you can call methods to get the data
placesSearchBox.on('places_changed', () => {
    // Handle the event
    console.log('Place: ', placesSearchBox.getPlace());
    console.log('Bounds: ', placesSearchBox.getPlacesBounds());
});

// You can use the constant for the event name
placesSearchBox.on(G.PlacesSearchBoxEvents.PLACES_CHANGED, () => {
    // Handle the event
    console.log('Place: ', placesSearchBox.getPlace());
    console.log('Bounds: ', placesSearchBox.getPlacesBounds());
});

// Or you can can use the event function
placesSearchBox.onPlacesChanged(() => {
    // Handle the event
    console.log('Place: ', placesSearchBox.getPlace());
    console.log('Bounds: ', placesSearchBox.getPlacesBounds());
});
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| bounds | [LatLngBounds](/api-reference/utilities/latlng-bounds) \| undefined | The region to use for biasing query predictions. It can be set with any [LatLngBoundsValue](/api-reference/utilities/latlng-bounds#latlngbounds-value-type). |
| input | [HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement) \| undefined | The text input element. It can be set with an HTMLInputElement or a CSS selector string. |

### bounds

Get and set the region to use for biasing query predictions. The value returned is the same as [getBounds](#getbounds).

Get the bounds. A [LatLngBounds](/api-reference/utilities/latlng-bounds) object is returned if the bounds exist, otherwise `undefined` is returned.

```js
const bounds = placesSearchBox.bounds;
```

Set the bounds. This does the same thing as the [setBounds](#setbounds) method.

```js
placesSearchBox.bounds = myLatLngBoundsObject;
```

### input

Get and set the selector for the text input to associate the search box with.

Get the input. The HTMLInputElement is returned if it's set, otherwise `undefined` is returned.

```js
const input = placesSearchBox.input;
```

Set the input. This does the same thing as the [setInput](#setinput) method. If a string selector is used and no element matches it then an error is thrown.

```js
placesSearchBox.input = document.querySelector('.inputClass');
// Or
placesSearchBox.input = '.inputClass';
```

## Methods

- Methods inherited from [Evented](/api-reference/base-classes/evented#methods).
- Methods inherited from [Base](/api-reference/base-classes/base#methods).

### getBounds

`getBounds(): LatLngBounds | undefined`

Get the bounds to which query predictions are biased.

```js
const bounds = placesSearchBox.getBounds();
```

### getPlace

`getPlace(): google.maps.places.PlaceResult | undefined`

Gets the first place that has been found. The results from the `places_changed` event is typically one place and it's the place that the user clicked on. `undefined` is returned if no place has been found yet.

```js
const place = placesSearchBox.getPlace();
```

### getPlaces

`getPlaces(): google.maps.places.PlaceResult[]`

Get the places that have been found. An array is returned, but typically the array has just one value and that's the place that the user clicked on. An empty array is returned if no places have been found yet.

```js
const places = placesSearchBox.getPlaces();
```

### getPlacesBounds

`getPlacesBounds(): LatLngBounds | undefined`

Get the map bounds based on the places that have been found. This value is available after the user selected a place.

This is often used to update the map bounds to show the selected place.

```js
myMap.fitBounds(placesSearchBox.getPlacesBounds());
```

### init

`init(): Promise<void>`

Initialize the places search box object. Call this after you've set the input selector.

:::important
This must be called in order for the places search box to work.
:::

```js
const placesSearchBox = G.placesSearchBox('.inputSelector');
placesSearchBox.init().then(() => {
    placesSearchBox.on('places_changed', () => {
        const place = placesSearchBox.getPlace();
        G.marker({
            map: map,
            position: place.geometry.location,
            tooltip: place.name,
        });
        map.fitBounds(placesSearchBox.getPlacesBounds());
    });
});
```

### isInitialized

 `isInitialized(): boolean`

Returns whether the places search box object has been initialized.

```js
if (placesSearchBox.isInitialized()) {
    // Do something
}
```

### onPlacesChanged

`onPlacesChanged(callback: (places: google.maps.places.PlaceResult[], bounds: LatLngBounds) => void): void`

Event handler for when the user selects a place.

This is an alternate option to doing:

```js
placesSearchBox.on('places_changed', (event) => {
    // Handle the event
    console.log('Places: ', event.places)
});
```

Instead, you can do this:

```js
placesSearchBox.onPlacesChanged((places, bounds) => {
    const place = places[0];
    G.marker({
        map: map,
        position: place.geometry.location,
        tooltip: place.name,
    });
    map.fitBounds(bounds);
});

// Or you can call methods to get the data
placesSearchBox.onPlacesChanged(() => {
    // Handle the event
    console.log('Place: ', placesSearchBox.getPlace());
    console.log('Bounds: ', placesSearchBox.getPlacesBounds());
});
```

### setBounds

`setBounds(value: LatLngBoundsValue): PlacesSearchBox`

Sets the region to use for biasing query predictions. Results will only be biased towards this area and not be completely restricted to it.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | [LatLngBoundsValue](/api-reference/utilities/latlng-bounds#latlngbounds-value-type) | Yes | A [LatLngBounds](/api-reference/utilities/latlng-bounds) value type. |

```js
placesSearchBox.setBounds(myLatLngBoundsObject);
```

### setInput

`setInput(input: string | HTMLInputElement): PlacesSearchBox`

Set the selector for the text input to associate the search box with. If a string selector is used and no element matches it then an error is thrown.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| input | [HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement) \| string | Yes | The input selector. |

```js
placesSearchBox.setInput('.myInputSelector');
```

### setOptions

`setOptions(options: PlacesSearchBoxOptions): PlacesSearchBox`

Set the options for the places search box.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [PlacesSearchBoxOptions](#placessearchbox-options) | Yes | The places search box options. |

```js
placesSearchBox = G.placesSearchBox();
placesSearchBox.setOptions({
    input: '#inputId'
});
```
