---
---

# Address Types

The `GeocodeAddressTypes` object is a helper object to test the geocode address component address types.

Instead of testing the `types` array against string values, you can call a method in the `GeocodeAddressTypes` class to test the address type.

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
                const types = component.getTypes();
                if (types.isStreetNumber()) {
                    console.log('This is a street number');
                } else if (types.isCity()) {
                    console.log('This is a city, town, or locality');
                }
            });
        }
    })
    .catch((error) => {
        console.error('Error: ', error);
    });
```

## Methods

### getTypes

`getTypes(): string[]`

Get the array of address types. This allows you to access the raw data returned from Google.

```js
const typeValues = types.getTypes();
```

### isAdministrativeAreaLevel1

`isAdministrativeAreaLevel1(): boolean`

Returns if the address is an administrative area level 1. This is the highest level of administrative area below the country level. In the United States, these administrative levels are states.

```js
if (types.isAdministrativeAreaLevel1()) {
    // Do something
}
```

### isAdministrativeAreaLevel2

`isAdministrativeAreaLevel2(): boolean`

Returns if the address is an administrative area level 2. Within the United States this would be a county.

```js
if (types.isAdministrativeAreaLevel2()) {
    // Do something
}
```

### isAdministrativeAreaLevel3

`isAdministrativeAreaLevel3(): boolean`

Returns if the address is an administrative area level 3. This is a minor civil division.

```js
if (types.isAdministrativeAreaLevel3()) {
    // Do something
}
```

### isAdministrativeAreaLevel4

`isAdministrativeAreaLevel4(): boolean`

Returns if the address is an administrative area level 4. This is a minor civil division.

```js
if (types.isAdministrativeAreaLevel4()) {
    // Do something
}
```

### isAdministrativeAreaLevel5

`isAdministrativeAreaLevel5(): boolean`

Returns if the address is an administrative area level 5. This is a minor civil division.

```js
if (types.isAdministrativeAreaLevel5()) {
    // Do something
}
```

### isAdministrativeAreaLevel6

`isAdministrativeAreaLevel6(): boolean`

Returns if the address is an administrative area level 6. This is a minor civil division.

```js
if (types.isAdministrativeAreaLevel6()) {
    // Do something
}
```

### isAdministrativeAreaLevel7

`isAdministrativeAreaLevel7(): boolean`

Returns if the address is an administrative area level 7. This is a minor civil division.

```js
if (types.isAdministrativeAreaLevel7()) {
    // Do something
}
```

### isAirport

`isAirport(): boolean`

Returns if the address is an airport.

```js
if (types.isAirport()) {
    // Do something
}
```

### isBusStation

`isBusStation(): boolean`

Returns if the address is a bus station or bus stop.

```js
if (types.isBusStation()) {
    // Do something
}
```

### isCity

`isCity(): boolean`

Returns if the address is a town or city. This is an alias for [isLocality](#islocality).

```js
if (types.isCity()) {
    // Do something
}
```

### isColloquialArea

`isColloquialArea(): boolean`

Returns if the address is a commonly used alternative name for the entity.

```js
if (types.isColloquialArea()) {
    // Do something
}
```

### isCountry

`isCountry(): boolean`

Returns if the address is a country.

```js
if (types.isCountry()) {
    // Do something
}
```

### isCounty

`isCounty(): boolean`

Returns if the address is a county. This is an alias for [isAdministrativeAreaLevel2](#isadministrativearealevel2).

```js
if (types.isCounty()) {
    // Do something
}
```

### isEstablishment

`isEstablishment(): boolean`

Returns if the address is a place that hasn't yet been categorized.

```js
if (types.isEstablishment()) {
    // Do something
}
```

### isFloor

`isFloor(): boolean`

Returns if the address is a floor of a building.

```js
if (types.isFloor()) {
    // Do something
}
```

### isIntersection

`isIntersection(): boolean`

Returns if the address is a major intersection, usually of two major roads.

```js
if (types.isIntersection()) {
    // Do something
}
```

### isLandmark

`isLandmark(): boolean`

Returns if the address is a landmark.

```js
if (types.isLandmark()) {
    // Do something
}
```

### isLocality

`isLocality(): boolean`

Returns if the address is a locality (i.e. town or city).

```js
if (types.isLocality()) {
    // Do something
}
```

### isNaturalFeature

`isNaturalFeature(): boolean`

Returns if the address is a prominent natural feature.

```js
if (types.isNaturalFeature()) {
    // Do something
}
```

### isNeighborhood

`isNeighborhood(): boolean`

Returns if the address is a neighborhood.

```js
if (types.isNeighborhood()) {
    // Do something
}
```

### isPark

`isPark(): boolean`

Returns if the address is a park.

```js
if (types.isPark()) {
    // Do something
}
```

### isParking

`isParking(): boolean`

Returns if the address is a parking lot.

```js
if (types.isParking()) {
    // Do something
}
```

### isPlusCode

`isPlusCode(): boolean`

Returns if the address is a plus code. See [the Plus Codes website](https://plus.codes/) for more information about plus codes.

```js
if (types.isPlusCode()) {
    // Do something
}
```

### isPointOfInterest

`isPointOfInterest(): boolean`

Returns if the address is a point of interest.

```js
if (types.isPointOfInterest()) {
    // Do something
}
```

### isPolitical

`isPolitical(): boolean`

Returns if the address is a political entity. This would usually be some type of civil administration.

```js
if (types.isPolitical()) {
    // Do something
}
```

### isPostBox

`isPostBox(): boolean`

Returns if the address is a specific post office box.

```js
if (types.isPostBox()) {
    // Do something
}
```

### isPostalCode

`isPostalCode(): boolean`

Returns if the address is a postal code.

```js
if (types.isPostalCode()) {
    // Do something
}
```

### isPostalTown

`isPostalTown(): boolean`

Returns if the address is a grouping of geographic areas.

```js
if (types.isPostalTown()) {
    // Do something
}
```

### isPremise

`isPremise(): boolean`

Returns if the address is a named location, usually a building or collection of buildings with a common name.

```js
if (types.isPremise()) {
    // Do something
}
```

### isRoom

`isRoom(): boolean`

Returns if the address is a room of a building.

```js
if (types.isRoom()) {
    // Do something
}
```

### isRoute

`isRoute(): boolean`

Returns if the address is a named route (such as "US 101").

```js
if (types.isRoute()) {
    // Do something
}
```

### isState

`isState(): boolean`

Returns if the address is a state or province. This is an alias for [isAdministrativeAreaLevel1](#isadministrativearealevel1).

```js
if (types.isState()) {
    // Do something
}
```

### isStreetAddress

`isStreetAddress(): boolean`

Returns if the address is a street address.

```js
if (types.isStreetAddress()) {
    // Do something
}
```

### isStreetNumber

`isStreetNumber(): boolean`

Returns if the address is a precise street number.

```js
if (types.isStreetNumber()) {
    // Do something
}
```

### isSubLocality

`isSubLocality(): boolean`

Returns if the address is a sublocality.

```js
if (types.isSubLocality()) {
    // Do something
}
```

### isSubLocalityLevel1

`isSubLocalityLevel1(): boolean`

Returns if the address is a sublocality level 1.

```js
if (types.isSubLocalityLevel1()) {
    // Do something
}
```

### isSubLocalityLevel2

`isSubLocalityLevel2(): boolean`

Returns if the address is a sublocality level 2.

```js
if (types.isSubLocalityLevel2()) {
    // Do something
}
```

### isSubLocalityLevel3

`isSubLocalityLevel3(): boolean`

Returns if the address is a sublocality level 3.

```js
if (types.isSubLocalityLevel3()) {
    // Do something
}
```

### isSubLocalityLevel4

`isSubLocalityLevel4(): boolean`

Returns if the address is a sublocality level 4.

```js
if (types.isSubLocalityLevel4()) {
    // Do something
}
```

### isSubLocalityLevel5

`isSubLocalityLevel5(): boolean`

Returns if the address is a sublocality level 5.

```js
if (types.isSubLocalityLevel5()) {
    // Do something
}
```

### isSubPremise

`isSubPremise(): boolean`

Returns if the address is a subpremise. This is the next level below a premise, usually a single building in a collection of buildings with a common name.

```js
if (types.isSubPremise()) {
    // Do something
}
```

### isTown

`isTown(): boolean`

Returns if the address is a town or city. This is an alias for [isLocality](#islocality).

```js
if (types.isTown()) {
    // Do something
}
```

### isTrainStation

`isTrainStation(): boolean`

Returns if the address is a train station.

```js
if (types.isTrainStation()) {
    // Do something
}
```

### isTransitStation

`isTransitStation(): boolean`

Returns if the address is a transit station.

```js
if (types.isTransitStation()) {
    // Do something
}
```
