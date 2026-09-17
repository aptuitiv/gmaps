---
---

# PolylineCollection

The PolylineCollection object enables you to apply bulk actions to a collection of polylines. The polylines can be organized by tags so that you can apply the bulk actions to a subset of the polylines.

## Example usage

```js
const polylineCollection = G.polylineCollection();
polylineCollection.add(polyline1, 'tag1');
polylineCollection.add(polyline2, ['tag2']);
polylineCollection.add(polyline3, ['tag1', 'tag2']);
polylineCollection.add(polyline4, 'tag2');
polylineCollection.add(polyline5, 'tag3');
polylineCollection.add(polyline6, ['tag4']);
polylineCollection.add(polyline7, ['tag1', 'tag3', 'tag4']);
polylineCollection.add(polyline8);
polylineCollection.add(polyline9);
```

As you can see, you can assign one tag, multiple tags, or no tags.

You can pass a single tag as a string, a single tag as an array, or an array of tags. **Tags must be a string value**.

If you assign no tag then an internal default tag is applied. This is intended to allow you to use a polyline collection with no tags if desired. Typically you would not mix polylines with tags and those with no tags in the same collection. There is no way to target only those polylines with the internal default tag.

## Creating the PolylineCollection object

`G.polylineCollection(): PolylineCollection`

The PolylineCollection object does not take any parameters.

```js
const polylineCollection = G.polylineCollection();
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| polylines | object | The polylines in the collection organized by tag. Each key is a tag and each value is a `Set` of [Polyline](/api-reference/polyline) objects. Polylines added without a tag are stored under an internal default tag. |

## Methods

### add

`add(p: Polyline, tag?: string|string[]): void`

Add a polyline to the collection with zero or more tags.

| Parameter | Type | Required | Description |
|:-----------|:------|:----------:|:-------------|
| polyline | [Polyline](/api-reference/polyline) | ![svg file](../../static/img/check.svg) | The polyline object to add. |
| tag | string\|string[] | | One or more string tags. This allows you to pass multiple tags as strings to the method. |

No tags:

```js
polylineCollection.add(polyline);
```

One tag:

```js
polylineCollection.add(polyline, 'tag1');
polylineCollection.add(polyline, ['tag1']);
```

Multiple tags:

```js
polylineCollection.add(polyline, ['tag1', 'tag2', 'anotherTag', 'andAnotherTag']);
```

### clear

`clear(): void`

Remove all polylines and tags from the collection. Each polyline is also removed from the map.

```js
polylineCollection.clear();
```

### clone

`clone(): PolylineCollection`

Create a new collection with the same polylines and tags. The polylines themselves are not cloned. The new collection holds the same `Polyline` objects.

```js
const copy = polylineCollection.clone();
```

### hasData

`hasData(): boolean`

Return whether the collection has at least one polyline.

```js
if (polylineCollection.hasData()) {
    // There is at least one polyline in the collection
}
```

### hide

`hide(tag: string|string[]): void`

Hide the polylines that are assigned to the passed tag(s).

| Parameter | Type | Required | Description |
|:-----------|:------|:----------:|:-------------|
| tags | string\|string[] | ![svg file](../../static/img/check.svg) | One or more string tags. This allows you to pass multiple tags as strings to the method. |

If multiple tags are passed then any polyline that is assigned to one of the passed tags is hidden. Multiple tags does not mean that a polyline has to be assigned to all of the passed tags.

If no tags are passed then nothing happens.

Hide polylines that are assigned to the passed tag:

```js
polylineCollection.hide('tag1');
polylineCollection.hide(['tag1']);
```

Hide polylines that are assigned to the passed tags:

```js
polylineCollection.hide(['tag1', 'tag2', 'anotherTag']);
```

### hideAll

`hideAll(): void`

Hide all the polylines in the collection.

```js
polylineCollection.hideAll();
```

### highlight

`highlight(tag: string|string[], highlightOptions?: PolylineOptions): void`

Highlight the polylines that are assigned to the passed tag(s).

| Parameter | Type | Required | Description |
|:-----------|:------|:----------:|:-------------|
| tags | string\|string[] | ![svg file](../../static/img/check.svg) | One or more string tags. This allows you to pass multiple tags as strings to the method. |
| highlightOptions | [PolylineOptions](/api-reference/polyline/#polyline-options) | | The polyline options to override the existing highlight polyline options. |

If multiple tags are passed then any polyline that is assigned to one of the passed tags is highlighted. Multiple tags does not mean that a polyline has to be assigned to all of the passed tags.

If no tags are passed then nothing happens.

Highlight polylines that are assigned to the passed tag:

```js
polylineCollection.highlight('tag1');
polylineCollection.highlight(['tag1']);
```

Highlight polylines that are assigned to the passed tags:

```js
polylineCollection.highlight(['tag1', 'tag2', 'anotherTag']);
```

You can override the current highlight options by passing in the options parameter.
This allows you to override one or more of the following options:

- clickable
- dashed
- dashGap
- icons
- strokeColor
- strokeOpacity
- strokeWeight
- zIndex

When the polyline is unhighlighted, the original options will be restored.

```js
polylineCollection.highlight('tag1', {strokeColor: 'blue'});
```

### highlightAll

`highlightAll(): void`

Highlight all the polylines in the collection.

```js
polylineCollection.highlightAll();
```

### isEmpty

`isEmpty(): boolean`

Return whether the collection has no polylines.

```js
if (polylineCollection.isEmpty()) {
    // There are no polylines in the collection
}
```

### remove

`remove(p: Polyline, tag?: string|string[]): void`

Remove a polyline from the collection. Optionally only remove it from the passed tags.

| Parameter | Type | Required | Description |
|:-----------|:------|:----------:|:-------------|
| polyline | [Polyline](/api-reference/polyline) | ![svg file](../../static/img/check.svg) | The polyline object to remove. |
| tags | string\|string[] | | One or more string tags. This allows you to pass multiple tags as strings to the method. |

Remove the polyline from all tags:

```js
polylineCollection.remove(polyline);
```

Remove the polyline from one tag:

```js
polylineCollection.remove(polyline, 'tag1');
polylineCollection.remove(polyline, ['tag1']);
```

Remove the polyline from multiple tag:

```js
polylineCollection.remove(polyline, ['tag1', 'tag2', 'anotherTag', 'andAnotherTag']);
```

### setOptions

`setOptions(options: PolylineOptions, tag?: string|string[]): void`

Set options for either all polylines in the collection or for the polylines that have the tag(s) passed.

| Parameter | Type | Required | Description |
|:-----------|:------|:----------:|:-------------|
| options | [PolylineOptions](/api-reference/polyline/#polyline-options) | ![svg file](../../static/img/check.svg) | The polyline options to set. |
| tags | string\|string[] |  | One or more string tags. This allows you to pass multiple tags as strings to the method. |

Set options on all polylines:

```js
polylineCollection.setOptions({strokeColor: '#1b7fbb'});
```

Set options for one tag:

```js
polylineCollection.setOptions({strokeColor: '#1b7fbb'}, 'tag1');
polylineCollection.setOptions({strokeColor: '#1b7fbb'}, ['tag1']);
```

Set options for multiple tag:

```js
polylineCollection.setOptions({strokeColor: '#1b7fbb'}, ['tag1', 'tag2', 'anotherTag', 'andAnotherTag']);
```

### show

`show(tag: string|string[], map: Map): void`

Show the polylines that are assigned to the passed tag(s).

| Parameter | Type | Required | Description |
|:-----------|:------|:----------:|:-------------|
| tags | string\|string[] | ![svg file](../../static/img/check.svg) | One or more string tags. This allows you to pass multiple tags as strings to the method. |
| map | [Map](/api-reference/map) |  | The map object |

If multiple tags are passed then any polyline that is assigned to one of the passed tags is shown. Multiple tags does not mean that a polyline has to be assigned to all of the passed tags.

If you have not yet assigned the `map` value to the polyline then you should pass the `map` value. However, if you've already assigned the `map` value then you don't have to pass it.

If no tags are passed then nothing happens.

Show polylines that are assigned to the passed tag:

```js
polylineCollection.show('tag1', map);
polylineCollection.show(['tag1'], map);
```

Show polylines that are assigned to the passed tags:

```js
polylineCollection.show(['tag1', 'tag2', 'anotherTag'], map);
```

### showAll

`showAll(map: Map): void`

Show all the polylines in the collection.

| Parameter | Type | Required | Description |
|:-----------|:------|:----------:|:-------------|
| map | [Map](/api-reference/map) |  | The map object |

If you have not yet assigned the `map` value to the polylines then you should pass the `map` value. However, if you've already assigned the `map` value then you don't have to pass it.

```js
polylineCollection.showAll();
polylineCollection.showAll(map);
```

### unhighlight

`unhighlight(tag: string|string[]): void`

Hide the highlight polylines that are assigned to the passed tag(s).

| Parameter | Type | Required | Description |
|:-----------|:------|:----------:|:-------------|
| tags | string\|string[] | ![svg file](../../static/img/check.svg) | One or more string tags. This allows you to pass multiple tags as strings to the method. |

If multiple tags are passed then any polyline that is assigned to one of the passed tags is hidden. Multiple tags does not mean that a polyline has to be assigned to all of the passed tags.

If no tags are passed then nothing happens.

Hide the highlight polylines that are assigned to the passed tag:

```js
polylineCollection.unhighlight('tag1');
polylineCollection.unhighlight(['tag1']);
```

Hide the highlight polylines that are assigned to the passed tags:

```js
polylineCollection.unhighlight(['tag1', 'tag2', 'anotherTag']);
```

### unhighlightAll

`unhighlightAll(): void`

Hide all the highlight polylines in the collection.

```js
polylineCollection.unhighlightAll();
```
