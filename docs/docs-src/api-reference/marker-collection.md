---
---

# MarkerCollection

The MarkerCollection object enables you to apply bulk actions to a collection of markers. The markers can be organized by tags so that you can apply the bulk actions to a subset of the markers.

## Example usage

```js
const markerCollection = G.markerCollection();
markerCollection.add(marker1, 'tag1');
markerCollection.add(marker2, ['tag2']);
markerCollection.add(marker3, ['tag1', 'tag2']);
markerCollection.add(marker4, 'tag2');
markerCollection.add(marker5, 'tag3');
markerCollection.add(marker6, 'tag4');
markerCollection.add(marker7, ['tag1', 'tag3', 'tag4']);
markerCollection.add(marker8);
markerCollection.add(marker9);
```

As you can see, you can assign one tag, multiple tags, or no tags.

You can pass a single tag as a string, a single tag as an array, or an array of tags. **Tags must be a string value**.

If you assign no tag then an internal default tag is applied. This is intended to allow you to use a marker collection with no tags if desired. Typically you would not mix markers with tags and those with no tags in the same collection. There is no way to target only those markers with the internal default tag.

## Creating the MarkerCollection object

`G.markerCollection(): MarkerCollection`

The MarkerCollection object does not take any parameters.

```js
const markerCollection = G.markerCollection();
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| markers | object | The markers in the collection, grouped by tag. Each key is a tag and each value is a `Set` of the [Marker](/api-reference/marker) objects assigned to that tag. Markers added without a tag are stored under an internal default tag. |

## Methods

### add

`add(marker: Marker, tag?: string|string[]): void`

Add a marker to the collection with zero or more tags.

| Parameter | Type | Required | Description |
|:-----------|:------|:----------:|:-------------|
| marker | [Marker](/api-reference/marker) | ![svg file](../../static/img/check.svg) | The marker object to add. |
| tag | string\|string[] | | A single tag string or an array of tag strings. If not set, the marker is assigned to an internal default tag. |

No tags:

```js
markerCollection.add(marker);
```

One tag:

```js
markerCollection.add(marker, 'tag1');
markerCollection.add(marker, ['tag1']);
```

Multiple tags:

```js
markerCollection.add(marker, ['tag1', 'tag2', 'anotherTag', 'andAnotherTag']);
```

### clear

`clear(): void`

Hide all the markers in the collection, then remove all markers and tags from the collection.

```js
markerCollection.clear();
```

### clone

`clone(): MarkerCollection`

Return a new MarkerCollection with the same markers and tags. The Marker objects themselves are not copied, so both collections hold the same markers.

```js
const copy = markerCollection.clone();
```

### hasData

`hasData(): boolean`

Return whether the collection has at least one marker.

```js
if (markerCollection.hasData()) {
    // There is at least one marker in the collection
}
```

### hide

`hide(tag: string|string[]): void`

Hide the markers that are assigned to the passed tag(s).

| Parameter | Type | Required | Description |
|:-----------|:------|:----------:|:-------------|
| tag | string\|string[] | ![svg file](../../static/img/check.svg) | A single tag string or an array of tag strings. |

If multiple tags are passed then any marker that is assigned to one of the passed tags is hidden. Multiple tags does not mean that a marker has to be assigned to all of the passed tags.

If no tags are passed then nothing happens.

Hide markers that are assigned to the passed tag:

```js
markerCollection.hide('tag1');
markerCollection.hide(['tag1']);
```

Hide markers that are assigned to the passed tags:

```js
markerCollection.hide(['tag1', 'tag2', 'anotherTag']);
```

### hideAll

`hideAll(): void`

Hide all the markers in the collection.

```js
markerCollection.hideAll();
```

### isEmpty

`isEmpty(): boolean`

Return whether the collection has no markers.

```js
if (markerCollection.isEmpty()) {
    // There are no markers in the collection
}
```

### remove

`remove(marker: Marker, tag?: string|string[]): void`

Remove a marker from the collection. Optionally only remove it from the passed tags.

| Parameter | Type | Required | Description |
|:-----------|:------|:----------:|:-------------|
| marker | [Marker](/api-reference/marker) | ![svg file](../../static/img/check.svg) | The marker object to remove. |
| tag | string\|string[] | | A single tag string or an array of tag strings. If not set, the marker is removed from all tags. |

Removing a marker from the collection does not hide it on the map.

Remove the marker from all tags:

```js
markerCollection.remove(marker);
```

Remove the marker from one tag:

```js
markerCollection.remove(marker, 'tag1');
markerCollection.remove(marker, ['tag1']);
```

Remove the marker from multiple tag:

```js
markerCollection.remove(marker, ['tag1', 'tag2', 'anotherTag', 'andAnotherTag']);
```

### show

`show(tag: string|string[], map: Map): void`

Show the markers that are assigned to the passed tag(s).

| Parameter | Type | Required | Description |
|:-----------|:------|:----------:|:-------------|
| tag | string\|string[] | ![svg file](../../static/img/check.svg) | A single tag string or an array of tag strings. |
| map | [Map](/api-reference/map) | ![svg file](../../static/img/check.svg) | The map object |

If multiple tags are passed then any marker that is assigned to one of the passed tags is shown. Multiple tags does not mean that a marker has to be assigned to all of the passed tags.

If no tags are passed then nothing happens.

Show markers that are assigned to the passed tag:

```js
markerCollection.show('tag1', map);
markerCollection.show(['tag1'], map);
```

Show markers that are assigned to the passed tags:

```js
markerCollection.show(['tag1', 'tag2', 'anotherTag'], map);
```

### showAll

`showAll(map: Map): void`

Show all the markers in the collection.

| Parameter | Type | Required | Description |
|:-----------|:------|:----------:|:-------------|
| map | [Map](/api-reference/map) | ![svg file](../../static/img/check.svg) | The map object |

```js
markerCollection.showAll(map);
```
