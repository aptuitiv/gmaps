---
---

# Geocoding

The Geocode object is based on the [Google maps geocoding API](https://developers.google.com/maps/documentation/javascript/geocoding).

There are three things that you can do with the Geocode object, which is the same as the Google maps geocoding API.

1. Convert an address into latitude and longitude coordinates.
2. Reverse geocode, which converts latitude and longitude coordinates into an address.
3. Find the address for a given Google maps place ID.

You can also restrict to a specific area, region, or latitude/longitude bounds.

## Example usage

```js
const geocoder = G.geocode({
    address: '221 B Baker St, London, England'
});
geocoder.geocode()
    .then((results) => {
        console.log('Response: ', results);
    })
    .catch((error) => {
        console.error('Error: ', error);
    });
```

Here is an alternate call. This one doesn't pass options to the constructor. Instead the options are passed to the [fetch](#fetch) method, which is an alias to the [geocode](#geocode) method.

```js
G.geocode().fetch({
    address: '221 B Baker St, London, England'
}).then((results) => {
    console.log('Response: ', results);
})
.catch((error) => {
    console.error('Error: ', error);
});
```

## Creating the Geocode object

`G.geocode(options?: GeocodeValue): Geocode`

There are a few ways to setup the `Geocode` object.

**Pass no value.**

`G.geocode(): Geocode`

```js
const geocoder = G.geocode();
geocoder.address = '221 B Baker St, London, England';
```

**Pass an object of options.**

`G.geocode(options: GeocodeOptions): Geocode`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [GeocodeOptions](#geocode-options) | Yes | The configuration options. |

```js
const geocode = G.geocode({
    address: '221 B Baker St, London, England'
});
```

**Pass an existing Geocode object.**

`G.geocode(value: Geocode): Geocode`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| value | Geocode | Yes | The existing Geocode object. |

In this case the `Geocode` object is simply returned.

```js
const geocoder = G.geocode(existingGeocodeObject);
```

## Geocode value type

The `GeocodeValue` can be one of the following values:

- `Geocode` object
- [GeocodeOptions](#geocode-options) object

## Geocode options

Type `GeocodeOptions`.

GeocodeOptions is an object containing the configuration options for the Geocode object.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| address | string | | The address to geocode. |
| bounds | [LatLngBoundsValue](/api-reference/utilities/latlng-bounds#latlngbounds-value-type) | | The latitude/longitude bounds within which to search. |
| componentRestrictions | [GeocodeComponentRestrictions](#geocode-component-restrictions) | | Used to restrict results to a specific area. |
| language | string | | The language identifier in which the results should be returned. See the [list of supported languages](https://developers.google.com/maps/faq#languagesupport). |
| location | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) | | The latitude/longitude value to do a reverse geocode lookup and get a human-friendly address with. |
| placeId | string | | The Google maps place id to get a human-friendly address for. |
| region | string | | The country code used to bias a search. It should be a two-character (non-numeric) Unicode region subtag or CLDR identifier. See the [Country/region coverage](https://developers.google.com/maps/coverage#countryregion-coverage-for-core-mapping-features) for the list of region codes. |

## Geocode component restrictions

Type `GeocodeComponentRestrictions`

These are the filters that resolve to a specific area. They set the Google Maps Geocoding Service to return address results restricted to a specific area. See [Geocoding Component Filtering](https://developers.google.com/maps/documentation/javascript/geocoding#ComponentFiltering) for more information.

| Option | Type | Description |
|--------|------|-------------|
| administrativeArea | string | Matches all the administrative_area levels. Optional. |
| country | string | Matches a country name or a two letter ISO 3166-1 country code. Optional. |
| locality | string | Matches against both locality and sublocality types. Optional. |
| postalCode | string | Matches postal_code and postal_code_prefix. Optional. |
| route | string | Matches the long or short name of a route. Optional. |

## Properties

| Property  | Type   | Description                             |
|-----------|--------|-----------------------------------------|
| address | string | The address to geocode. |
| bounds | [LatLngBounds](/api-reference/utilities/latlng-bounds) \| undefined | The latitude/longitude bounds within which to search. |
| componentRestrictions | [GeocodeComponentRestrictions](#geocode-component-restrictions) | Used to restrict results to a specific area. |
| language | string | The language identifier in which the results should be returned. See the [list of supported languages](https://developers.google.com/maps/faq#languagesupport). |
| location | [LatLng](/api-reference/utilities/latlng) \| undefined | The latitude/longitude value to do a reverse geocode lookup and get a human-friendly address with. |
| placeId | string | The Google maps place id to get a human-friendly address for. |
| region | string | The country code used to bias a search. It should be a two-character (non-numeric) Unicode region subtag or CLDR identifier. See the [Country/region coverage](https://developers.google.com/maps/coverage#countryregion-coverage-for-core-mapping-features) for the list of region codes. |

### address

Get the address to geocode.

```js
const address = geocode.address;
```

Set the address to geocode

```js
geocode.address = '221 B Baker St, London, England';
```

### bounds

Get the bounds within which to search. A [LatLngBounds](/api-reference/utilities/latlng-bounds) object is returned if the bounds are set, otherwise `undefined` is returned.

```js
const bounds = geocode.bounds;
```

Set the bounds. Any [LatLngBoundsValue](/api-reference/utilities/latlng-bounds#latlngbounds-value-type) can be used.

```js
geocode.bounds = [[51.533767, -0.1485557], [51.513767, -0.2085557]];
```

### componentRestrictions

Get the component restrictions.

```js
const componentRestrictions = geocode.componentRestrictions;
```

Set the component restrictions.

```js
geocode.componentRestrictions = {country: 'US'};
```

### language

Get the language.

```js
const language = geocode.language;
```

Set the language.

```js
geocode.language = 'fr';
```

### location

Get the location. A [LatLng](/api-reference/utilities/latlng) object is returned if the location is set, otherwise `undefined` is returned.

```js
const location = geocode.location;
```

Set the location. Any [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) can be used. The value is ignored if it's not a valid latitude/longitude value.

```js
geocode.location = {lat: 44.7, lng: -70.8};
```

### placeId

Get the placeId.

```js
const placeId = geocode.placeId;
```

Set the placeId.

```js
geocode.placeId = 'GhIJDcNHxJTSUsARn5Cdt7FTQ0A';
```

### region

Get the region.

```js
const region = geocode.region;
```

Set the region.

```js
geocode.region = 'AT';
```

## Making a geocode request

The geocoding request is asyncronous, which is why a promise is returned. You can use [await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) to make the call or use [try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) to make the calls.

An error can be returned if invalid paramaters are passed or required parameters are missing.

You make the request by doing the following:

1. Getting the Geocode object.
2. Passing one of the required parameters.
3. Using [fetch](#fetch) or [geocode](#geocode) to make the geocode request.

### Using await

```js
const geocoder = G.geocode({
    address: '221 B Baker St, London, England'
});
(async () => {
    try {
        const result = await geocoder.fetch();
        console.log('Result: ', result);
    } catch (error) {
        console.error('Error getting geocode: ', error);
    }
})();
```

In the above example we make our own immediately invoked function so that an async call can be made with `await`. You can do this differently within an `async` method in your own code if you want.

### Using `try...catch`

```js
const geocoder = G.geocode({
    address: '221 B Baker St, London, England'
});
geocoder.geocode()
    .then((results) => {
        console.log('Response: ', results);
    })
    .catch((error) => {
        console.error('Error: ', error);
    });
```

### Setting parameters

You can set parameters in a few different ways. The examples below will set the `address` parameter but you can use the different approaches to set any of the parameters.

**Pass options to the constructor.**

```js
const geocode = G.geocode({
    address: '221 B Baker St, London, England'
});
```

**Set a property value.**

```js
const geocode = G.geocode();
geocode.address = '221 B Baker St, London, England';
```

**Use a method to set a property value.**

```js
const geocode = G.geocode();
geocode.setAddress('221 B Baker St, London, England');
```

**Pass the parameter to the [fetch](#fetch) or [geocode](#geocode) methods.**

```js
const geocode = G.geocode();
geocode.geocode({address: '221 B Baker St, London, England'});

// or

geocode.fetch({address: '221 B Baker St, London, England'});
```

### Required parameters

When making a geocode request you must set one, and only one, of the following parameters:

- *address* - The address to geocode
- *location* - The [LatLng](/api-reference/utilities/latlng) to obtain the closest human-readable address. This is used for a reverse geocode request.
- *placeId* - The Google Maps place id to get the closest human-readable address.

When making the request the Geocode object will look for one of the above values in alphabetical order. The first one that is set will be used. If another of the required parameters is set then it will be ignored.

## Geocode result

If the geocode request is successful then a [GeocodeResults](/api-reference/geocoding/results) object is returned.

The [GeocodeResults](/api-reference/geocoding/results) object holds the [individual geocode result objects](/api-reference/geocoding/result).

:::info
The Geocode object will always return GeocodeResults object for a successful response, even if no results are found.
:::

Here is an example where the latitude and longitude are retrieved from an address.

```js
G.geocode().setAddress('no match').fetch()
    .then((response) => {
        if (response.hasResults()) {
            const result = response.getFirst();
            const lat = result.getLatitude();
            const lng = result.getLongitude();
        } else {
            console.log('no match was found');
        }
    });
```

## Handling no results

The Google Maps geocoding API will return an `ZERO_RESULTS` error if there are no matching results. This library will return an empty [GeocodeResults](/api-reference/geocoding/results) object for the results value if there are no results.

You can test for if there are any matching results by using the [GeocodeResults hasResults](/api-reference/geocoding/results#hasresults) method.

```js
let latitude;
let longitude;
G.geocode({address: '221 B Baker St, London, England'}).fetch()
    .then((response) => {
        if (response.hasResults()) {
            // Do something
        }  else {
            console.log('no match was found');
        }
    });
```

## Request errors

An error can be thrown if the request is invalid, the request limits have been reached, the web page can't access the geocoder API, or an unknown error was returned.

The returned error will be a [GeocoderErrorStatus](/api-reference/constants#geocodererrorstatus) value.

Here is an example with handling certain error types.

```js
G.geocode().setAddress('1 main st, New York').fetch()
    .then((results) => {
        if (results.hasResults()) {
            console.log('A match was found: ', results);
        } else {
            console.log('no match was found');
        }
    })
    .catch((error) => {
        if (error === G.GeocoderErrorStatus.ERROR) {
            console.error('There was an error contacting Google.');
        } else if (error === G.GeocoderErrorStatus.INVALID_REQUEST) {
            console.error('The request was invalid.');
        } else if (error === G.GeocoderErrorStatus.OVER_QUERY_LIMIT) {
            console.error('The API query limit has been exceeded.');
        } else if (error === G.GeocoderErrorStatus.REQUEST_DENIED) {
            console.error('This site cannot use the Geocoder API.');
        } else if (error === G.GeocoderErrorStatus.UNKNOWN_ERROR) {
            console.error('There was an unknown error. Try again in a moment.');
        }
    });
```

## Methods

- Methods inherited from [Base](/api-reference/base-classes/base#methods).

### fetch

`fetch(options?: GeocodeOptions): Promise<GeocodeResults>`

This calls the Google maps geocoder service to get the geocode value.

`fetch` is an alias for [geocode](#geocode).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [GeocodeOptions](#geocode-options)  |  | The options for the geocode call. |

The promise resolves with a [GeocodeResults](/api-reference/geocoding/results) object. If there are no matching results then an empty `GeocodeResults` object is returned. For any other error the promise is rejected with a [GeocoderErrorStatus](/api-reference/constants#geocodererrorstatus) value.

```js
const geocoder = G.geocode({address: '221 B Baker St, London, England'});
geocoder.fetch()
    .then((result) => {
        console.log('result: ', result);
    })
    .catch((error) => {
        console.log('Error: ', error);
    });
```

You can also pass options to the geocode request. The options can be everything needed for the geocode request or additional options not already set.

```js
const geocoder = G.geocode({address: '221 B Baker St, London, England'});
geocoder.fetch({language: 'fr', 'bounds': [[51.533767, -0.1485557], [51.513767, -0.2085557]]})
    .then((result) => {
        console.log('result: ', result);
    })
    .catch((error) => {
        console.log('Error: ', error);
    });
```

### geocode

`geocode(options?: GeocodeOptions): Promise<GeocodeResults>`

This calls the Google maps geocoder service to get the geocode value.

You can also call [fetch](#fetch) as it's an alias for `geocode()`.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [GeocodeOptions](#geocode-options)  |  | The options for the geocode call. |

The promise resolves with a [GeocodeResults](/api-reference/geocoding/results) object. If there are no matching results then an empty `GeocodeResults` object is returned. For any other error the promise is rejected with a [GeocoderErrorStatus](/api-reference/constants#geocodererrorstatus) value.

```js
const geocoder = G.geocode({address: '221 B Baker St, London, England'});
geocoder.geocode()
    .then((result) => {
        console.log('result: ', result);
    })
    .catch((error) => {
        console.log('Error: ', error);
    });
```

You can also pass options to the geocode request. The options can be everything needed for the geocode request or additional options not already set.

```js
const geocoder = G.geocode({address: '221 B Baker St, London, England'});
geocoder.geocode({language: 'fr', 'bounds': [[51.533767, -0.1485557], [51.513767, -0.2085557]]})
    .then((result) => {
        console.log('result: ', result);
    })
    .catch((error) => {
        console.log('Error: ', error);
    });
```

### setAddress

`setAddress(address: string): Geocode`

Sets the address to geocode. This is an alternate method to setting the [address](#address) property, passing the `address` option to the `geocode` object, or passing the `address` to the [fetch](#fetch) or [geocode](#geocode) methods.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| address | string | Yes | The address to geocode. |

```js
geocoder.setAddress('221 B Baker St, London, England');
```

### setBounds

`setBounds(bounds: LatLngBoundsValue): Geocode`

Set the bounds within which to bias geocode results more prominently. This is an alternate method to setting the [bounds](#bounds) property, passing the `bounds` option to the `geocode` object, or passing the `bounds` to the [fetch](#fetch) or [geocode](#geocode) methods.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| bounds | [LatLngBoundsValue](/api-reference/utilities/latlng-bounds#latlngbounds-value-type) | Yes | The latitude/longitude bounds within which to search. |

```js
geocoder.setBounds({
    sw: G.latLng(44, -68),
    ne: G.latLng(44.7, -70.8),
});
```

### setComponentRestrictions

`setComponentRestrictions(componentRestrictions: GeocodeComponentRestrictions): Geocode`

Set the component restrictions. This is an alternate method to setting the [componentRestrictions](#componentrestrictions) property, passing the `componentRestrictions` option to the `geocode` object, or passing the `componentRestrictions` to the [fetch](#fetch) or [geocode](#geocode) methods.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| componentRestrictions | [GeocodeComponentRestrictions](#geocode-component-restrictions) | Yes | The component restrictions to set. |

```js
geocoder.setComponentRestrictions({
    country: 'US',
});
```

### setLanguage

`setLanguage(language: string): Geocode`

Set the language for the response. This is an alternate method to setting the [language](#language) property, passing the `language` option to the `geocode` object, or passing the `language` to the [fetch](#fetch) or [geocode](#geocode) methods.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| language | string | Yes | The language for the response. See the [list of supported languages](https://developers.google.com/maps/faq#languagesupport). |

```js
geocoder.setLanguage('fr');
```

### setLocation

`setLocation(location: LatLngValue): Geocode`

Set the location to reverse geocode. This is an alternate method to setting the [location](#location) property, passing the `location` option to the `geocode` object, or passing the `location` to the [fetch](#fetch) or [geocode](#geocode) methods.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| location | [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) | Yes | The latitude/longitude value to do a reverse geocode lookup and get a human-friendly address with. |

```js
geocoder.setLocation({lat: 44.7, lng: -70.8});
```

### setOptions

`setOptions(options: GeocodeOptions): Geocode`

Set the options for the Geocode object. Only the options that are passed are changed.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [GeocodeOptions](#geocode-options) | Yes | The options for the Geocode object. |

```js
geocoder.setOptions({
    address: '221 B Baker St, London, England',
    language: 'es'
});
```

### setPlaceId

`setPlaceId(placeId: string): Geocode`

Set the place id to geocode. This is an alternate method to setting the [placeId](#placeid) property, passing the `placeId` option to the `geocode` object, or passing the `placeId` to the [fetch](#fetch) or [geocode](#geocode) methods.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| placeId | string | Yes | The Google maps place id to get a human-friendly address for. |

```js
geocoder.setPlaceId('GhIJDcNHxJTSUsARn5Cdt7FTQ0A');
```

### setRegion

`setRegion(region: string): Geocode`

Set the country code used to bias a search. This is an alternate method to setting the [region](#region) property, passing the `region` option to the `geocode` object, or passing the `region` to the [fetch](#fetch) or [geocode](#geocode) methods.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| region | string | Yes | The country code used to bias a search. It should be a two-character (non-numeric) Unicode region subtag or CLDR identifier. See the [Country/region coverage](https://developers.google.com/maps/coverage#countryregion-coverage-for-core-mapping-features) for the list of region codes. |

```js
geocoder.setRegion('CL');
```
