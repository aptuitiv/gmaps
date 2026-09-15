---
---

# Geocode Results

The `GeocodeResults` object holds the results from a geocode request. It is used when there are zero or more matching results with no errors.

The purpose of the `GeocodeResults` is to provide programatic access to the geocode results instead of working with the array of object data that Google provides.

## Example usage

Below is an example of how you could interact with this object when working with geocode results.

```js
const geocoder = G.geocode({
    address: '221 B Baker St, London, England'
});
geocoder.fetch()
    .then((response) => {
        if (response.hasResults()) {
            response.getResults().forEach((result) => {
                // Do something with each individual result
            });
        }
    })
    .catch((error) => {
        console.error('Error: ', error);
    });
```

## Methods

- Methods inherited from [Base](/api-reference/base-classes/base#methods).

### getFirst

`getFirst(): GeocodeResult`

Get the first result from the array of geocode results. The returned value is a [GeocodeResult](/api-reference/geocoding/result) object. If no results were returned then this will still return a [GeocodeResult](/api-reference/geocoding/result) object, it just won't have any data.

```js
const result = response.getFirst();
```

### getResults

`getResults(): GeocodeResult[]`

Return the array of [GeocodeResult](/api-reference/geocoding/result) objects. This is useful if you want to loop through the objects. If there are no results then an empty array is returned.

```js
response.getResults().forEach((result) => {
    // Do something
});
```

### hasResults

`hasResults(): boolean`

Returns whether any results were found.

```js
if (response.hasResults()) {
    const result = response.getFirst();
}
```
