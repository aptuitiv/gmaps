---
---

# Address Component

The `GeocodeAddressComponent` object represents an individual address component from the [Geocode](/api-reference/geocoding/geocode) result.

You do not create an instance of this component. Rather, you can access the address component data from a geocode request through this object. This can easier than working directly with the raw object of address component data that Google provides.

## Example usage

Below is an example of how you could interact with this object when working with geocode results.

```js
const geocoder = G.geocode({
    address: '221 B Baker St, London, England'
});
geocoder.fetch()
    .then((response) => {
        if (response.hasResults()) {
            const result = response.getFirst();
            result.getAddressComponents().forEach((component) => {
                console.log('Long name: ', component.getLongName());
                console.log('Short name: ', component.getShortName());
                console.log('Types: ', component.getTypesArray());

                // Test the address type
                const types = component.getTypes();
                if (types.isStreetNumber()) {
                    console.log('This is a street number');
                }
            });
        }
    })
    .catch((error) => {
        console.error('Error: ', error);
    });
```

## Methods

- Methods inherited from [Base](/api-reference/base-classes/base#methods).

### getLongName

`getLongName(): string`

Get the full name of the address component.

```js
const name = component.getLongName();
```

### getShortName

`getShortName(): string`

Get the abbreviated name of the address component.

```js
const abbreviation = component.getShortName();
```

### getTypes

`getTypes(): GeocodeAddressTypes`

Get [GeocodeAddressTypes](/api-reference/geocoding/address-types) object for the address types.

```js
const types = component.getTypes();
```

### getTypesArray

`getTypesArray(): string[]`

Get the array of type values for the address component.

This is a shortcut to calling `component.getTypes().getTypes()`.

```js
const types = component.getTypesArray();
```

### toGoogle

`toGoogle(): google.maps.GeocoderAddressComponent`

Returns the original Google Maps GeocoderAddressComponent object.

```js
const googleObject = component.toGoogle();
```
