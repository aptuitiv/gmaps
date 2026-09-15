---
---

# AutocompleteSearchBox

The AutocompleteSearchBox is used to tie in a Google Maps Places search into a text input field using the [Google Maps Places Autocomplete widget](https://developers.google.com/maps/documentation/javascript/examples/places-autocomplete).

:::info
It's recommended to use the AutocompleteSearchBox over [PlacesSearchBox](places-search-box) because you have more options to configure the search box. See the [Places widgets page "Summary of classes"](https://developers.google.com/maps/documentation/javascript/place-autocomplete#summary-of-classes) for more information on the differences.
:::

`AutocompleteSearchBox` extends [Evented](/api-reference/base-classes/evented).

## Example usage

The search box is tied to an HTML text input field.

```html
<label>Search for an address:
    <input class="inputSelector">
</label>

<script>
const autocompleteSearchBox = G.autocompleteSearchBox('.inputSelector');
autocompleteSearchBox.init().then(() => {
    autocompleteSearchBox.onPlaceChanged((place, bounds) => {
        G.marker({
            map: map,
            position: place.geometry.location,
            tooltip: place.name,
        });
        map.fitBounds(bounds);
    });
});
</script>
```

## Creating the AutocompleteSearchBox object

`G.autocompleteSearchBox(input?: AutocompleteSearchBoxValue, options?: AutocompleteSearchBoxOptions): AutocompleteSearchBox`

If a string selector is passed and no element matches it then an error is thrown.

There are a few ways that you can setup the `AutocompleteSearchBox` object.

**No parameters.**

`G.autocompleteSearchBox(): AutocompleteSearchBox`

```js
const autocompleteSearchBox = G.autocompleteSearchBox();
```

**Pass the options.**

`G.autocompleteSearchBox(options: AutocompleteSearchBoxOptions): AutocompleteSearchBox`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [AutocompleteSearchBoxOptions](#autocompletesearchbox-options) | Yes | The options. |

```js
const autocompleteSearchBox = G.autocompleteSearchBox({
    input: '#inputId'
});
```

**Pass the input selector.**

`G.autocompleteSearchBox(input: HTMLInputElement | string): AutocompleteSearchBox`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| input | [HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement) \| string | Yes | The input selector. |

```js
const autocompleteSearchBox = G.autocompleteSearchBox('#inputId');
```

**Pass the input selector and the options.**

`G.autocompleteSearchBox(input: HTMLInputElement | string, options: AutocompleteSearchBoxOptions): AutocompleteSearchBox`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| input | [HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement) \| string | Yes | The input selector. |
| options | [AutocompleteSearchBoxOptions](#autocompletesearchbox-options) | Yes | The options. |

```js
const myTextField = document.querySelector('.myInput');
const autocompleteSearchBox = G.autocompleteSearchBox(myTextField, {bounds: myLatLngBoundsObject});
```

**Pass an existing AutocompleteSearchBox object.**

`G.autocompleteSearchBox(object: AutocompleteSearchBox): AutocompleteSearchBox`

In this case the `AutocompleteSearchBox` object is simply returned.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| object | AutocompleteSearchBox | Yes | A AutocompleteSearchBox object. |

```js
const autocompleteSearchBox = G.autocompleteSearchBox(autocompleteSearchBoxObject);
```

## AutocompleteSearchBox value type

The `AutocompleteSearchBoxValue` can be one of the following values:

- `AutocompleteSearchBox` object
- [AutocompleteSearchBoxOptions](#autocompletesearchbox-options) object
- An [HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement) object that is the text input to associate the search box with.
- A string CSS selector for the text input to associate the search box with. Any valid selector for `document.querySelector` can be used.

## AutocompleteSearchBox options

Type `AutocompleteSearchBoxOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| bounds | [LatLngBoundsValue](/api-reference/utilities/latlng-bounds#latlngbounds-value-type) |  | A [LatLngBounds](/api-reference/utilities/latlng-bounds) value type. |
| countryRestriction | string \| string[] | null | The country or countries to restrict the search to. The value should be a single two letter country code or an array of up to five two letter country codes. |
| fields | string \| string[] | ['ALL'] | The fields to be returned from Google when a Place is found. By default all fields are returned. |
| input | [HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement) \| string |  | The text input element, or a CSS selector for it. This is required when the options object is the only value passed to [G.autocompleteSearchBox()](#creating-the-autocompletesearchbox-object). |
| strictBounds | boolean | false | Whether the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent. |
| types | string \| string[] | | The types of predictions to be returned. For example, you can restrict to certain business types or location types. See [setTypes](#settypes) for more information. |

:::tip
You can lower your Google billing by only returning the actual fields that you need for each place.
:::

## Events

Below are the events that the AutocompleteSearchBox will emit.

You can use the plain text name for the event, or you can use the [event constant](/api-reference/constants#autocompletesearchboxevents).

| Event    | Description |
|----------|-------------|
| place_changed | Called when the user selects a Place. |

### place_changed

The event object passed to the callback has these extra properties.

| Property | Type | Description |
|----------|------|-------------|
| bounds | [LatLngBounds](/api-reference/utilities/latlng-bounds) | The map bounds based on the selected place. |
| place | [google.maps.places.PlaceResult](https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceResult) | The place that the user selected. |

```js
autocompleteSearchBox.on('place_changed', (event) => {
    // Handle the event
    console.log('Place: ', event.place);
    console.log('Bounds: ', event.bounds);
});

// Or, you can destructure the Event object
autocompleteSearchBox.on('place_changed', ({place, bounds}) => {
    // Handle the event
    console.log('Place: ', place);
    console.log('Bounds: ', bounds);
});

// Or you can call methods to get the data
autocompleteSearchBox.on('place_changed', () => {
    // Handle the event
    console.log('Place: ', autocompleteSearchBox.getPlace());
    console.log('Bounds: ', autocompleteSearchBox.getPlaceBounds());
});

// You can also use the event constant
autocompleteSearchBox.on(G.AutocompleteSearchBoxEvents.PLACE_CHANGED, () => {
    // Handle the event
    console.log('Place: ', autocompleteSearchBox.getPlace());
    console.log('Bounds: ', autocompleteSearchBox.getPlaceBounds());
});

// Or, use the onPlaceChanged() method
autocompleteSearchBox.onPlaceChanged(() => {
    // Handle the event
    console.log('Place: ', autocompleteSearchBox.getPlace());
    console.log('Bounds: ', autocompleteSearchBox.getPlaceBounds());
});
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| bounds | [LatLngBounds](/api-reference/utilities/latlng-bounds) \| undefined | The region to use for biasing query predictions. It can be set with any [LatLngBoundsValue](/api-reference/utilities/latlng-bounds#latlngbounds-value-type). |
| countryRestriction | string \| string[] \| null | The country or countries to restrict the search to. The value should be a single two letter country code or an array of two letter country codes. |
| fields | string[] | The fields to be returned from Google when a Place is found. By default all fields are returned. It can be set with a string or an array of strings. |
| input | [HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement) \| undefined | The text input element. It can be set with an HTMLInputElement or a CSS selector string. |
| strictBounds | boolean | Whether the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent. |
| types | string[] \| undefined | The types of predictions to be returned. For example, you can restrict to certain business types or location types. It can be set with `null`, a string, or an array of strings. See [setTypes](#settypes) for more information. |

### bounds

Get and set the region to use for biasing query predictions. The value returned is the same as [getBounds](#getbounds).

Get the bounds. A [LatLngBounds](/api-reference/utilities/latlng-bounds) object is returned if the bounds exist, otherwise `undefined` is returned.

```js
const bounds = autocompleteSearchBox.bounds;
```

Set the bounds. This does the same thing as the [setBounds](#setbounds) method.

```js
autocompleteSearchBox.bounds = myLatLngBoundsObject;
```

### countryRestriction

Get and set the country restriction(s) for the search.

Get the country restriction(s). The value returned is the same as [getCountryRestriction](#getcountryrestriction). `null` is returned if no restriction is set.

```js
const countries = autocompleteSearchBox.countryRestriction;
```

Set the country restriction. The value should be a single two letter country code or an array of two letter country codes. **You can only set up to five country code strings.** [See the IBAN ISO codes](https://www.iban.com/country-codes) for a list. (Only use the Alpha-2 codes).

This does the same thing as the [setCountryRestriction](#setcountryrestriction) method.

```js
// Set a single value
autocompleteSearchBox.countryRestriction = 'us';

// Set mulitple country codes
autocompleteSearchBox.countryRestriction = ['es', 'fr'];
```

### fields

Get and set the fields to return for a matched Place.

Get the fields. The value returned is the same as [getFields](#getfields).

```js
const fields = autocompleteSearchBox.fields;
```

Set the fields to be included for the Place response when a Place is successfully retrieved. If ['ALL'] is passed in, all available fields will be returned and billed for (this is not recommended for production deployments).
For a list of fields see the [Google PlaceResult documentation](https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceResult). Nested fields can be specified with dot-paths (for example, "geometry.location"). The default is ['ALL'].

This does the same thing as calling the [setFields](#setfields) method.

```js
// Set a single field to return
autocompleteSearchBox.fields = 'geometry';
autocompleteSearchBox.fields = ['geometry'];

// Set multiple fields to return
autocompleteSearchBox.fields = ['address_components', 'geometry'];

// Retrieve all fields
autocompleteSearchBox.fields = ['ALL'];
```

### input

Get and set the selector for the text input to associate the search box with.

Get the input. The value returned is the same as [getInput](#getinput).

```js
const input = autocompleteSearchBox.input;
```

Set the input. This does the same thing as the [setInput](#setinput) method. If a string selector is used and no element matches it then an error is thrown.

```js
autocompleteSearchBox.input = document.querySelector('.inputClass');
// Or
autocompleteSearchBox.input = '.inputClass';
```

### strictBounds

Get and set whether the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.

Get the value. The value returned is the same as [getStrictBounds](#getstrictbounds).

```js
const strictBounds = autocompleteSearchBox.strictBounds;
```

Set the value. This does the same thing as calling the [setStrictBounds](#setstrictbounds) method.

Setting `strictBounds` to `false` (which is the default) will make the results biased towards, but not restricted to, places contained within the bounds.

Setting `strictBounds` to `true` will tell the Autocomplete service to only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.

```js
autocompleteSearchBox.strictBounds = true;
```

### types

Get and set the types of predictions to return.

Get the value. The value returned is the same as [getTypes](#gettypes).

```js
const types = autocompleteSearchBox.types;
```

Set the value. This does the same thing as calling the [setTypes](#settypes) method.

:::info
See [setTypes](#settypes) for more information as there are restrictions on the values that you can set.
:::

```js
// Clear existing types
autocompleteSearchBox.types = null;

// Set a single type
autocompleteSearchBox.types = '(regions)';

// Set multiple types
autocompleteSearchBox.types = ['electrician', 'electronics_store', 'hardware_store'];
```

## Methods

- Methods inherited from [Evented](/api-reference/base-classes/evented#methods).
- Methods inherited from [Base](/api-reference/base-classes/base#methods).

### getBounds

`getBounds(): LatLngBounds | undefined`

Get the bounds to which query predictions are biased.

```js
const bounds = autocompleteSearchBox.getBounds();
```

### getCountryRestriction

`getCountryRestriction(): string | string[] | null`

Get the country or countries to restrict the search to. `null` is returned if no restriction is set.

```js
const countries = autocompleteSearchBox.getCountryRestriction();
```

### getFields

`getFields(): string[]`

Get the fields to be included for the Place in the details response when the details are successfully retrieved.

```js
const fields = autocompleteSearchBox.getFields();
```

### getInput

`getInput(): HTMLInputElement | undefined`

Get the HTML input reference that the autocomplete is associated with, if it's set.

```js
const input = autocompleteSearchBox.getInput();
```

### getPlace

`getPlace(): google.maps.places.PlaceResult | undefined`

Gets the place that has been found. The result from the `place_changed` event is one place and it's the place that the user clicked on. `undefined` is returned if the user hasn't selected a place yet.

```js
const place = autocompleteSearchBox.getPlace();
```

### getPlaceBounds

`getPlaceBounds(): LatLngBounds | undefined`

Get the map bounds based on the place that has been found. This value is available after the user selected a place.

This is often used to update the map bounds to show the selected place.

```js
myMap.fitBounds(autocompleteSearchBox.getPlaceBounds());
```

### getStrictBounds

`getStrictBounds(): boolean`

Get whether the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.

```js
const strictBounds = autocompleteSearchBox.getStrictBounds();
```

### getTypes

`getTypes(): string[] | undefined`

Get the types of predictions to be returned.

```js
const types = autocompleteSearchBox.getTypes();
```

### init

`init(): Promise<void>`

Initialize the places search box object. Call this after you've set the input selector.

:::important
This must be called in order for the places search box to work.
:::

```html
<label>Search for an address:
    <input class="inputSelector">
</label>

<script>
const autocompleteSearchBox = G.autocompleteSearchBox('.inputSelector');
autocompleteSearchBox.init().then(() => {
    autocompleteSearchBox.on('place_changed', () => {
        const place = autocompleteSearchBox.getPlace();
        G.marker({
            map: map,
            position: place.geometry.location,
            tooltip: place.name,
        });
        map.fitBounds(autocompleteSearchBox.getPlaceBounds());
    });
});
</script>
```

### isInitialized

 `isInitialized(): boolean`

Returns whether the places search box object has been initialized.

```js
if (autocompleteSearchBox.isInitialized()) {
    // Do something
}
```

### onPlaceChanged

`onPlaceChanged(callback: (place: google.maps.places.PlaceResult, bounds: LatLngBounds) => void): void`

Event handler for when the user selects a place.

This is an alternate option to doing:

```js
autocompleteSearchBox.on('place_changed', (event) => {
    // Handle the event
    console.log('Place: ', event.place)
});
```

Instead, you can do this:

```js
autocompleteSearchBox.onPlaceChanged((place, bounds) => {
    G.marker({
        map: map,
        position: place.geometry.location,
        tooltip: place.name,
    });
    map.fitBounds(bounds);
});

// Or you can call methods to get the data
autocompleteSearchBox.onPlaceChanged(() => {
    // Handle the event
    console.log('Place: ', autocompleteSearchBox.getPlace());
    console.log('Bounds: ', autocompleteSearchBox.getPlaceBounds());
});
```

### setBounds

`setBounds(value: LatLngBoundsValue): AutocompleteSearchBox`

Sets the region to use for biasing query predictions. Results will only be biased towards this area and not be completely restricted to it.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | [LatLngBoundsValue](/api-reference/utilities/latlng-bounds#latlngbounds-value-type) | Yes | A [LatLngBounds](/api-reference/utilities/latlng-bounds) value type. |

```js
autocompleteSearchBox.setBounds(myLatLngBoundsObject);
```

### setCountryRestriction

`setCountryRestriction(value: string | string[] | null): AutocompleteSearchBox`

Set the country or countries to restrict the search to. Set it to `null` to remove the restriction.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | string \| string[] \| null | Yes | The value should be a single two letter country code or an array of two letter country codes. **You can only set up to five country code strings.** [See the IBAN ISO codes](https://www.iban.com/country-codes) for a list. (Only use the Alpha-2 codes). |

```js
// Set a single value
autocompleteSearchBox.setCountryRestriction('us');

// Set mulitple country codes
autocompleteSearchBox.setCountryRestriction(['es', 'fr']);
```

### setFields

`setFields(value: string | string[]): AutocompleteSearchBox`

Set the fields to be included for the Place response when a Place is successfully retrieved. If ['ALL'] is passed in, all available fields will be returned and billed for (this is not recommended for production deployments).
For a list of fields see the [Google PlaceResult documentation](https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceResult). Nested fields can be specified with dot-paths (for example, "geometry.location"). The default is ['ALL'].

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | string \|string[] | Yes | The field(s) to return for the retrieved place. For a list of fields see the [Google PlaceResult documentation](https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceResult). Nested fields can be specified with dot-paths (for example, "geometry.location").   |

```js
// Only return a single field
autocompleteSearchBox.setFields('geometry');

// Retrieve multiple fields
autocompleteSearchBox.setFields(['address_components', 'geometry']);

// Retrieve all fields
autocompleteSearchBox.setFields(['ALL']);
```

### setInput

`setInput(input: string | HTMLInputElement): AutocompleteSearchBox`

Set the selector for the text input to associate the search box with. If a string selector is used and no element matches it then an error is thrown.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| input | [HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement) \| string | Yes | The input selector. |

```js
autocompleteSearchBox.setInput('.myInputSelector');
```

### setOptions

`setOptions(options: AutocompleteSearchBoxOptions): AutocompleteSearchBox`

Set the options for the places search box.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [AutocompleteSearchBoxOptions](#autocompletesearchbox-options) | Yes | The places search box options. |

```js
autocompleteSearchBox = G.autocompleteSearchBox();
autocompleteSearchBox.setOptions({
    input: '#inputId'
});
```

### setStrictBounds

`setStrictBounds(value: boolean): AutocompleteSearchBox`

Set whether the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | boolean | Yes | Whether the Autocomplete widget should only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent. |

Setting `strictBounds` to `false` (which is the default) will make the results biased towards, but not restricted to, places contained within the bounds.

Setting `strictBounds` to `true` will tell the Autocomplete service to only return those places that are inside the bounds of the Autocomplete widget at the time the query is sent.

```js
autocompleteSearchBox.setStrictBounds(true);
```

### setTypes

`setTypes(value: null | string | string[]): AutocompleteSearchBox`

Set the types of predictions to be returned. For example, you can restrict to certain business types or location types.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | null \| string \| string[] | Yes | The types to set. |

To clear the types set it to `null` or an empty array `[]`.

:::info
You can only set either up to five values from [Table 1](https://developers.google.com/maps/documentation/javascript/supported_types#table1) or [Table 2](https://developers.google.com/maps/documentation/javascript/supported_types#table2), or a single type from [Table 3](https://developers.google.com/maps/documentation/javascript/supported_types#table3).

The request will be rejected if:

- You specify more than five types.
- You specify any unrecognized types.
- You mix any types from [Table 1](https://developers.google.com/maps/documentation/javascript/supported_types#table1) or [Table 2](https://developers.google.com/maps/documentation/javascript/supported_types#table2) with any filter from [Table 3](https://developers.google.com/maps/documentation/javascript/supported_types#table3).

:::

```js
// Clear existing types
autocompleteSearchBox.setTypes(null);

// Set a single type
autocompleteSearchBox.setTypes('(regions)');

// Set multiple types
autocompleteSearchBox.setTypes(['electrician', 'electronics_store', 'hardware_store']);
```
