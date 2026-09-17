---
---

# Geocode Result

The `GeocodeResult` object holds the individual geocode response. It is accessed through the [GeocodeResults](/api-reference/geocoding/results) object.

The purpose of this object is to provide programmatic access to the response data instead of having to work with a json-like object.

## Example usage

Below is an example of how you could interact with this object when working with geocode results.

```js
const geocoder = G.geocode({
    address: '221 B Baker St, London, England'
});
geocoder.fetch()
    .then((response) => {
        response.getResults().forEach((result) => {
            const lat = result.getLatitude();
            const lng = result.getLongitude();
        });
    })
    .catch((error) => {
        console.error('Error: ', error);
    });
```

## Methods

- Methods inherited from [Base](/api-reference/base-classes/base#methods).

### getAddressComponents

`getAddressComponents(): GeocodeAddressComponent[]`

Get the array of [GeocodeAddressComponent](/api-reference/geocoding/address-component) objects. If none are available then an empty array is returned.

```js
const addressComponents = result.getAddressComponents();
```

### getBounds

`getBounds(): LatLngBounds | undefined`

Get the precise bounds of the result. If the bounds are not avaiable then `undefined` is returned.

```js
const bounds = result.getBounds();
```

### getCompoundPlusCode

`getCompoundPlusCode(): string`

Get the compound plus code associated with the location.

The compound plus code is a plus code where the first four characters (the area code) are dropped and replaced with a locality description. For example, "9G8F+5W Zurich, Switzerland". If no suitable locality that can be found to shorten the code then this will return an empty string.

```js
const compoundPlusCode = result.getCompoundPlusCode();
```

### getFormattedAddress

`getFormattedAddress(): string`

Get the formatted address for the location. If it is not available then an empty string is returned.

```js
const address = result.getFormattedAddress();
```

### getLatitude

`getLatitude(): number | undefined`

Get the latitude for the location. If no latitude is available then `undefined` is returned.

```js
const lat = result.getLatitude();
```

### getLocation

`getLocation(): LatLng | undefined`

Get the [LatLng](/api-reference/utilities/latlng) object that holds the latitude and longitude for the location. If no LatLng is available then `undefined` is returned.

```js
const latLng = result.getLocation();
```

### getLocationType

`getLocationType(): string`

Get the location type value. This will be one of the [GeocoderLocationType](/api-reference/constants#geocoderlocationtype) values. If it is not available then an empty string is returned.

```js
const locationType = result.getLocationType();
```

### getLongitude

`getLongitude(): number | undefined`

Get the longitude for the location. If no longitude is available then `undefined` is returned.

```js
const lng = result.getLongitude();
```

### getPlaceId

`getPlaceId(): string`

Get the Google Maps place id value for the location. If it is not available then an empty string is returned.

```js
const placeId = result.getPlaceId();
```

### getPlusCode

`getPlusCode(): string`

Get the plus code for the location. If it is not available then an empty string is returned.

See [the Plus Codes website](https://plus.codes/) for more information about plus codes.

```js
const plusCode = result.getPlusCode();
```

### getPostalCodeLocalities

`getPostalCodeLocalities(): string[]`

Gets the postal code localities for the location. If none are available then an empty array is returned.

This is only populated when the result is a postal code that contains multiple localities.

```js
const localities = result.getPostalCodeLocalities();
```

### getTypes

`getTypes(): GeocodeAddressTypes`

Get [GeocodeAddressTypes](/api-reference/geocoding/address-types) object for the result address types.

```js
const types = result.getTypes();
```

### getTypesArray

`getTypesArray(): string[]`

Get the array of type values for the result.

This is a shortcut to calling `result.getTypes().getTypes()`.

```js
const types = result.getTypesArray();
```

### isLocationApproximate

`isLocationApproximate(): boolean`

Returns if the location is an approximate location.

```js
if (result.isLocationApproximate()) {
    // Do something
}
```

### isLocationGeometricCenter

`isLocationGeometricCenter(): boolean`

Returns if the location is a geometic center of a result.

```js
if (result.isLocationGeometricCenter()) {
    // Do something
}
```

### isLocationRangeInterpolated

`isLocationRangeInterpolated(): boolean`

Returns if the location is an approximation interpolated between two precise locations.

```js
if (result.isLocationRangeInterpolated()) {
    // Do something
}
```

### isLocationRooftop

`isLocationRooftop(): boolean`

Returns if the location is a rooftop location, which is the most precise location available.

```js
if (result.isLocationRooftop()) {
    // Do something
}
```

### isPartialMatch

`isPartialMatch(): boolean`

Returns if the location is a partial match for the original request.

```js
if (result.isPartialMatch()) {
    // Do something
}
```

### toGoogle

`toGoogle(): google.maps.GeocoderResult | object`

Get the original Google Maps GeocoderResult object. If the result is empty, an empty object is returned.

```js
const object = result.toGoogle();
```
