---
---

# Polygons with holes

The [data layer](/api-reference/data-layer) is how you draw polygons. A polygon can have holes cut out of it, which a [Polyline](/api-reference/polyline) can't do.

To add a polygon, pass its path to [addPolygon()](/api-reference/data-layer#addpolygon).

## A simple polygon

Pass one array of positions. You don't need to repeat the first position at the end to close the shape.

```js
map.data.addPolygon([
    { lat: -32.364, lng: 153.207 },
    { lat: -35.364, lng: 153.207 },
    { lat: -35.364, lng: 158.207 },
    { lat: -32.364, lng: 158.207 },
]);
```

Positions can be in any of the forms that [LatLngValue](/api-reference/utilities/latlng#latlngvalue-type) supports, so this works too.

```js
map.data.addPolygon([[-32.364, 153.207], [-35.364, 153.207], [-35.364, 158.207]]);
```

## A polygon with holes in it

Pass an array of paths instead. The first path is the outer edge of the polygon and every path after that is a hole cut out of it.

```js
// The outer edge
const outerCoords = [
    { lat: -32.364, lng: 153.207 }, // north west
    { lat: -35.364, lng: 153.207 }, // south west
    { lat: -35.364, lng: 158.207 }, // south east
    { lat: -32.364, lng: 158.207 }, // north east
];

// The first hole
const innerCoords1 = [
    { lat: -33.364, lng: 154.207 },
    { lat: -34.364, lng: 154.207 },
    { lat: -34.364, lng: 155.207 },
    { lat: -33.364, lng: 155.207 },
];

// The second hole
const innerCoords2 = [
    { lat: -33.364, lng: 156.207 },
    { lat: -34.364, lng: 156.207 },
    { lat: -34.364, lng: 157.207 },
    { lat: -33.364, lng: 157.207 },
];

map.data.addPolygon([outerCoords, innerCoords1, innerCoords2]);
```

## Closing positions

GeoJson repeats the first position of a path at the end to close it. Google's polygons close themselves, so a repeated position would give you a duplicate corner.

You don't have to think about this. If the last position of a path is the same as the first one then it's dropped for you, so data taken straight out of a GeoJson file works as it is.

## Styling the polygon

Set a style on the whole layer.

```js
map.data.setStyle({
    fillColor: '#4caf50',
    fillOpacity: 0.4,
    strokeColor: '#1b5e20',
    strokeWeight: 2,
});
```

Or set one on a single polygon as you add it.

```js
map.data.addPolygon([outerCoords, innerCoords1], {
    style: { fillColor: '#ff0000' },
});
```

## Getting the paths back

[addPolygon()](/api-reference/data-layer#addpolygon) resolves with the [DataFeature](/api-reference/data-feature) that was added.

```js
const feature = await map.data.addPolygon([outerCoords, innerCoords1, innerCoords2]);

console.log(feature.geometryType);        // "Polygon"
console.log(feature.getPaths().length);   // 3 - the outer edge and two holes
console.log(feature.getPath().length);    // 4 - the positions of the outer edge
```
