---
---

# MarkerCluster

The `MarkerCluster` object displays a group of markers under a single "cluster" marker.

`MarkerCluster` extends [Base](/api-reference/base-classes/base).

The clustering functionality uses the [Google Maps MarkerClusterer](https://www.npmjs.com/package/@googlemaps/markerclusterer) library.

## Example usage

```js
const cluster = G.markerCluster(map);
const marker = G.marker({
    position: G.latLng(0, 0),
});
marker.show(map);
cluster.addMarker(marker);
```

## Creating the MarkerCluster object

```js
G.markerCluster(
    map: Map,
    markers?: Marker[] | MarkerClusterOptions,
    options?: MarkerClusterOptions
): MarkerCluster
```

There are a few ways that you can set up the `MarkerCluster` object.

The `map` parameter must be a [Map](/api-reference/map) object. An error is thrown if it's not. If the Google Maps library hasn't loaded yet, the cluster is set up once it loads.

### Only pass the Map object

`G.markerCluster(map: Map): MarkerCluster`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| map | [Map](/api-reference/map) | Yes | The map that the cluster will display on. |

```js
const cluster = G.markerCluster(map);
```

### Pass the Map object and markers

You can add the markers in the cluster at the same time that you create the cluster object. You can also add additional markers with the [addMarker](#addmarker) or [addMarkers](#addmarkers) methods.

`G.markerCluster(map: Map, markers: Marker[]): MarkerCluster`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| map | [Map](/api-reference/map) | Yes | The map that the cluster will display on. |
| markers | [Marker[]](/api-reference/marker) | Yes | The array of markers to add to the cluster. |

```js
const markers = [];
markers.push(G.marker({
    latitude: 48.2,
    longitude: 2.3,
    map: map,
}));
markers.push(G.marker({
    latitude: 48.3,
    longitude: 2.2,
    map: map,
}));
const cluster = G.markerCluster(map, markers);
```

### Pass the Map object, markers, and cluster options

`G.markerCluster(map: Map, markers: Marker[], options: MarkerClusterOptions): MarkerCluster`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| map | [Map](/api-reference/map) | Yes | The map that the cluster will display on. |
| markers | [Marker[]](/api-reference/marker) | Yes | The array of markers to add to the cluster. |
| options | [MarkerClusterOptions](#markercluster-options) | Yes | The options for the cluster. |

```js
const markers = [];
markers.push(G.marker({
    latitude: 48.2,
    longitude: 2.3,
    map: map,
}));
markers.push(G.marker({
    latitude: 48.3,
    longitude: 2.2,
    map: map,
}));
const clusterOptions = {
    defaultRenderOptions: {
        colorRangeTop: '#d62828',
        colorRangeBottom: {
            bgColor: '#E5E5E5',
            textColor: '#000000',
        },
        centerOpacity: 0.7,
        middleOpacity: 0.4,
        outerOpacity: 0.2,
        labelFontFamily: 'roboto,arial,sans-serif',
        labelFontSize: '12px',
    },
}
const cluster = G.markerCluster(map, markers, clusterOptions);
```

### Pass the Map object and cluster options

`G.markerCluster(map: Map, options: MarkerClusterOptions): MarkerCluster`

If you aren't passing an array of markers then you can pass the cluster options as the second parameter in place of the markers.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| map | [Map](/api-reference/map) | Yes | The map that the cluster will display on. |
| options | [MarkerClusterOptions](#markercluster-options) | Yes | The options for the cluster. |

```js
const clusterOptions = {
    defaultRenderOptions: {
        colorRangeTop: '#d62828',
        colorRangeBottom: {
            bgColor: '#E5E5E5',
            textColor: '#000000',
        },
        centerOpacity: 0.7,
        middleOpacity: 0.4,
        outerOpacity: 0.2,
        labelFontFamily: 'roboto,arial,sans-serif',
        labelFontSize: '12px',
    },
}
const cluster = G.markerCluster(map, clusterOptions);
```

You could also pass an empty array or null as the second parameter.

```js
const cluster = G.markerCluster(map, [], clusterOptions);

// or

const cluster = G.markerCluster(map, null, clusterOptions);
```

## MarkerCluster options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| algorithm | string | 'supercluster' | A simple string to set the cluster algorithm. Accepted values are `grid`, `supercluster`, and `noop`. If `noop` is set then no clustering happens. This is an alternate way to set the algorithm if you don't want to use the algorithmClass. If both are set, `algorithm` is used. You can still set algorithmOptions if you use this method.|
| algorithmClass | [Algorithm](https://googlemaps.github.io/js-markerclusterer/classes/GridAlgorithm.html) | | The algorithm to cluster markers. This determines how many markers are clustered together. It must provide a `calculate` method. |
| algorithmOptions | object | | The options for the algorithm. See [AlgorithmOptions](https://googlemaps.github.io/js-markerclusterer/interfaces/AlgorithmOptions.html), [GridOptions](https://googlemaps.github.io/js-markerclusterer/interfaces/GridOptions.html), and [SuperCluster](https://www.npmjs.com/package/supercluster) for more information. The `maxZoom`, `minPoints`, and `radius` options override the matching values in this object. |
| defaultRenderOptions | [DefaultRenderOptions](#default-renderer-options) | | The options for the [default renderer](#default-renderer). If this and `imageRendererOptions` are both set, this is used. It's ignored if `renderer` is set. |
| imageRendererOptions | [ImageRendererOptions](#image-renderer-options) | | The options for the image renderer. If this is set then the [image renderer](#image-renderer) will be used instead of the [default renderer](#default-renderer). It's ignored if `renderer` or `defaultRenderOptions` is set. |
| onClusterClick | [onClusterClickHandler](#markercluster-click-handler) | | A callback function to handle when the marker is clicked. |
| maxZoom | number | 13 | The maxium zoom level to cluster markers. Higher numbers means more zoomed in. This is used by the SuperClusterAlgorithm and the GridAlgorithm. If set, this will override the maxZoom option in the `algorithmOptions`. |
| minPoints | number | 3 | Minimum number of points to form a cluster. If set, this will override the `minPoints` option in the `algorithmOptions`.  |
| radius | number | 40 | The radius to use to determine which markers to cluster. The larger the number the more markers to include in a cluster and fewer clusters. The lower the number the more clusters there may be. This is used by the SuperClusterAlgorithm. If set, this will override the `radius` option in the `algorithmOptions`. |
| renderer | [Renderer](https://googlemaps.github.io/js-markerclusterer/interfaces/Renderer.html) | [DefaultRenderer](#default-renderer) | A custom renderer that converts a cluster into a Google Maps marker. It must provide a `render` method that accepts the cluster, the cluster stats, and the Google Maps map object, and returns a `google.maps.Marker`. If this is set then `defaultRenderOptions` and `imageRendererOptions` are ignored. |

## MarkerCluster click handler

`onClusterClickHandler = (event: google.maps.MapMouseEvent, cluster: Cluster, map: google.maps.Map) => void`

You can set up custom click handler for when the cluster marker is clicked. By default the map will zoom in to view the markers in the cluster.

## Marker cluster rendering

There are two types of renderers for the marker clusters.

1. [Default renderer](#default-renderer) - Display a circle marker with different colors depending on how many markers are in the cluster.
2. [Image renderer](#image-renderer) - Display images for the cluster markers. A different image can be used depending on how many markers are in the cluster.

The renderer uses the specified algorithm in the [MarkerCluster options](#markercluster-options) to determine how many markers to show in the cluster.

## Default renderer

The default renderer displays a marker in the shape of a circle with an outer ring that has some opacity. The number of markers in the cluster shows in the middle of the cluster marker.

**Example usage.**

```js
const cluster = G.markerCluster(map, {
    defaultRenderOptions: {
        colors: {
            0: '#0000ff',
            10: '#00ff00',
            20: {
                bgColor: '#ff00ff',
                textColor: '#000000',
            },
        },
        centerOpacity: 0.7,
        middleOpacity: 0.4,
        outerOpacity: 0.2,
        labelFontFamily: 'roboto,arial,sans-serif',
        labelFontSize: '12px',
        showNumber: true,
    }
});
const marker = G.marker({
    position: G.latLng(0, 0),
});
marker.show(map);
cluster.addMarker(marker);
```

## Cluster colors object

Type `ClusterColor`.

When specifying colors to the cluster markers, you can either pass a color string value, or pass an object that contains the background color and the text color.

| Option | Type |  Description |
|--------|------|--------------|
| bgColor| string | The background color for the marker. |
| textColor | string | The text color for the marker. Defaults to `'#ffffff'`. |

Type `ClusterColors`.

This represensts an object of colors.

```js
ClusterColors: {
    [key: number]: string | ClusterColor;
}
```

The `key` value is the marker count to match the color to. If the marker count is greater or equal to the `key` value and this is the greatest match, then this color will be used.

The first color should have a key of 0 or 1 to handle clusters with 1 or more markers.

The value can either be a color string or a `ClusterColor`.

### Setting the marker colors

There are two ways to set the colors of the markers.

**Use `defaultRenderOptions.colorRangeBottom` and `defaultRenderOptions.colorRangeTop` to set the two colors that could be used.**

If the cluster count is greater than the average number of markers in all clusters, then the `defaultRenderOptions.colorRangeTop` color is used. Otherwise the `defaultRenderOptions.colorRangeBottom` color is used.

```js
G.markerCluster(map, {
    defaultRenderOptions: {
        colorRangeBottom: '#d62828',
        colorRangeTop: {
            bgColor: '#ff00ff',
            textColor: '#000000',
        }
    }
});
```

**Specify the colors to use with the `defaultRenderOptions.colors` object.**

The object key is the marker count to match and the value is the color to use. If the number of markers in the cluster is greater or equal to the marker count then that color is used.

```js
G.markerCluster(map, {
    defaultRenderOptions: {
        colors: {
            0: '#75A15D',
            10: '#D97E31',
            20: {
                bgColor: '#E5E5E5',
                textColor: '#000000',
            },
        }
    }
});
```

## Default renderer options

Type `DefaultRenderOptions`.

These are the options for the default renderer.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| centerOpacity | number | 0.7 | The opacity to use for the center of the marker. Must be between 0 and 1. |
| colorRangeBottom | string or [ClusterColor](#cluster-colors-object) | '#ff0000' | The color to use for the cluster if it has less than or equal to the average number of markers in all clusters. |
| colorRangeTop | string or [ClusterColor](#cluster-colors-object) | '#0000ff' | The color to use for the cluster if it has more than the average number of markers in all clusters. |
| colors | [ClusterColors](#cluster-colors-object) | | An object that holds the colors for the clusters. If this is set then `colorRangeBottom` and `colorRangeTop` are not used. |
| labelFontFamily | string | 'roboto,arial,sans-serif' | The font family for the cluster marker label. |
| labelFontSize | number or string | '12px' | The font size of the label text (equivalent to the CSS font-size property). If it's set to a number then "px" will be added to the end of the number. |
| middleOpacity | number | 0.4 | The opacity to use for the middle ring of the marker. Must be between 0 and 1. |
| outerOpacity | number | 0.2 | The opacity to use for the outer ring of the marker. Must be between 0 and 1. |
| showNumber | boolean | true | Whether to show the number of markers in the cluster. |

## Image renderer

The image renderer displays an image for the cluster marker. The number of markers in the cluster shows in the middle of the cluster marker.

If no valid images are set with the `image` or `images` option, the clusters are drawn with the [default renderer](#default-renderer) instead and a warning is logged to the console. The `showNumber`, `labelFontFamily`, and `labelFontSize` options are passed on to the default renderer.

**Example usage.**

```js
const cluster = G.markerCluster(map, {
    imageRendererOptions: {
        images: {
            5: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png',
            10: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m2.png',
            15: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m3.png',
            20: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m4.png',
            30: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m5.png',
        }
    }
});
const marker = G.marker({
    position: G.latLng(0, 0),
});
marker.show(map);
cluster.addMarker(marker);
```

## Cluster image object type

Type `ClusterImage`.

The cluster image can be a string containing the URL for the image file, or it can be an object of image data.  The `ClusterImage` type represents the image object.

These values are used to set up the [Icon](/api-reference/utilities/icon) object for the [Marker](/api-reference/marker) and the [marker label](/api-reference/marker#markerlabel-type).

| Option | Type | Default | Description |
|--------|------|---------| ------------|
| height | number | | The height of the image. Use this with `width`, or use `size`. |
| labelClassName | string | | A CSS class name to be added to the label element. Overrides the `labelClassName` [image renderer option](#image-renderer-options). |
| labelColor | string | 'black' | The color of the label text. Overrides the `labelColor` image renderer option. |
| labelFontFamily | string | | The font family of the label text (equivalent to the CSS font-family property). Overrides the `labelFontFamily` image renderer option. |
| labelFontSize | number or string | '12px' | The font size of the label text (equivalent to the CSS font-size property). Use a string with a unit, like `'14px'`. Overrides the `labelFontSize` image renderer option. |
| labelFontWeight | string | | The font weight of the label text (equivalent to the CSS font-weight property). Overrides the `labelFontWeight` image renderer option. |
| scaledHeight | number | | The height of the image after scaling, if any. Use this property to stretch/shrink an image or a sprite. Use this with `scaledWidth`, or use `scaledSize`. |
| scaledSize | [SizeValue](/api-reference/utilities/size#sizevalue-type) |  | The size of the entire image after scaling, if any. Use this property to stretch/shrink an image or a sprite. |
| scaledWidth | number | | The width of the image after scaling, if any. Use this property to stretch/shrink an image or a sprite. Use this with `scaledHeight`, or use `scaledSize`. |
| size | [SizeValue](/api-reference/utilities/size#sizevalue-type) | | The display size of the sprite or image. When using sprites, you must specify the sprite size. If the size is not provided, it will be set when the image loads. |
| url | string | | Required. The url of the image to use for the cluster. |
| width | number | | The width of the image. Use this with `height`, or use `size`. |

## Cluster images type

Type `ClusterImages`.

```js
ClusterImages = {
    // The image to use for the cluster
    [key: number]: string | ClusterImage;
}
```

The `key` value is the marker count to match the image to. If the marker count is greater or equal to the `key` value and this is the greatest match, then this image will be used. If the marker count is less than every key, the image with the lowest key is used.

The first image should have a key of 0 or 1 to handle clusters with 1 or more markers.

The value can be the image URL string or a [ClusterImage](#cluster-image-object-type) object.

```js
{
    0: {
        url: 'https://mysite.com/markerSm.svg',
        labelColor: '#fff',
        labelFontSize: '15px',
        labelFontWeight: 'bold',
    },
    10: {
        url: 'https://mysite.com/markerMd.svg',
        labelColor: '#fff',
        labelFontSize: 10,
        labelFontFamily: 'Times New Roman',
        labelClassName: 'my-custom-class-for-label',
    },
    20: 'https://mysite.com/markerLg.svg',
}
```

## Image renderer options

Type `ImageRendererOptions`.

These are the options for the image renderer.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| image | string or [ClusterImage](#cluster-image-object-type) | | A single image for the cluster. It can be the image URL or an image object. Use this instead of "images" if you only need one image for the cluster. It's ignored if `images` is set. |
| images | [ClusterImages](#cluster-images-type) | | An object that holds the images for the clusters. |
| labelClassName | string | | A CSS class name to be added to the label element. |
| labelColor | string | 'black' | The color of the label text. |
| labelFontFamily | string | | The font family of the label text (equivalent to the CSS font-family property). |
| labelFontSize | number or string | '12px' | The font size of the label text (equivalent to the CSS font-size property). Use a string with a unit, like `'14px'`. |
| labelFontWeight | string | | The font weight of the label text (equivalent to the CSS font-weight property). |
| showNumber | boolean | true | Whether to show the number of markers in the cluster. |

## Styling the label text

This section applies to the [image renderer](#image-renderer). The [default renderer](#default-renderer) draws the number inside its SVG image, and only the `labelFontFamily` and `labelFontSize` options, plus the text color from the [cluster colors](#cluster-colors-object), change how it looks.

While you can set a class name with `labelClassName` for the label text, you can only style the label color, font family, font size, and font weight by passing those values in the cluster configuration.

The image renderer creates a [Marker](/api-reference/marker) object for each cluster marker, which ultimately uses the Google Maps Javascript API to create the marker. Google Maps only lets you set the color, font family, font size, and font weight by passing those as properties to the marker object.

Even if you don't configure a value for the color, font family, font size, or font weight, the Google Maps library will output inline styles on the label div tag that it outputs. Below is an example of the default style values.

```html
<div aria-hidden="true" style="color: rgb(0, 0, 0); font-size: 14px; font-family: Roboto, Arial, sans-serif;">3</div>
```

Because the styles are inline and there is no way to not have them output, it's advisable to not use a custom CSS class to style those values. (Technically you can use `!important` with your custom CSS, but that's not best-practice.)

Below is an example of setting up the default renderer with some font styles.

```js
const clusterOptions = {
    defaultRenderOptions: {
        colorRangeTop: '#d62828',
        colorRangeBottom: {
            bgColor: '#E5E5E5',
            textColor: '#000000',
        },
        centerOpacity: 0.7,
        middleOpacity: 0.4,
        outerOpacity: 0.2,
        labelFontFamily: 'Georgia, serif',
        labelFontSize: '12px',
    },
}
```

Below is an example of setting up an image renderer with some font styles

```js
const clusterOptions = {
    imageRendererOptions: {
        images: {
            0: {
                url: 'https://mysite.com/markerSm.svg',
                labelColor: '#fff',
                labelFontSize: '15px',
                labelFontWeight: 'bold',
            },
            10: {
                url: 'https://mysite.com/markerMd.svg',
                labelColor: '#fff',
                labelFontSize: '10px',
                labelFontFamily: 'Times New Roman',
                labelClassName: 'my-custom-class-for-label',
            },
            20: 'https://mysite.com/markerLg.svg',
        },
        labelFontFamily: 'Georgia, serif',
    },
}
```

## Methods

- Methods inherited from [Base](/api-reference/base-classes/base#methods).

### addMarker

`addMarker(marker: Marker, draw: boolean = true): MarkerCluster`

Add a marker to the cluster. If the Google Maps library hasn't loaded yet, the marker is added once it loads.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| marker | [Marker](/api-reference/marker) | Yes  | The marker to add to the cluster. |
| draw | boolean | | Whether to redraw the clusters after adding the marker. Defaults to `true`. |

```js
const cluster = G.markerCluster(map);
const marker = G.marker({
    position: G.latLng(0, 0),
    map: map
});
cluster.addMarker(marker);
```

### addMarkers

`addMarkers(markers: Marker[], draw: boolean = true): MarkerCluster`

Add one or more markers to the cluster. If the Google Maps library hasn't loaded yet, the markers are added once it loads.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| markers | [Marker](/api-reference/marker)[] | Yes  | The markers to add to the cluster. |
| draw | boolean | | Whether to redraw the clusters after adding the markers. Defaults to `true`. |

```js
const cluster = G.markerCluster(map);
const markers = [
    G.marker({
        position: G.latLng(0, 0),
        map: map
    }),
    G.marker({
        position: G.latLng(1, 2),
        map: map
    })
];
cluster.addMarkers(markers);
```

### clearMarkers

`clearMarkers(draw: boolean = true): MarkerCluster`

Clears all the markers in the marker cluster. This does not remove the markers from the map.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| draw | boolean | | Whether to redraw the clusters after removing the markers. Defaults to `true`. |

```js
cluster.clearMarkers();
```

### removeMarker

`removeMarker(marker: Marker, draw: boolean = false): MarkerCluster`

Removes a single marker from the cluster.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| marker | [Marker](/api-reference/marker) | Yes  | The marker to remove from the cluster. |
| draw | boolean | | Whether to redraw the clusters after removing the marker. Defaults to `false`. |

```js
cluster.removeMarker(marker);
```

### render

`render(): MarkerCluster`

Force a recalculation and redraw of all the marker clusters.

You will almost never need to call this.

```js
cluster.render();
```
