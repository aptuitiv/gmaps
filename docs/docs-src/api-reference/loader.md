---
---

# Loader

The `Loader` object is used to load the Google Maps API. See the [Load the Google Maps Javascript API](/guides/load) page for more information.

## Example usage

```js
G.loader({ apiKey: 'MY-API-KEY', libraries: ['places']}).load().then(() => {
    G.map('map', { center: [48.864716, 2.3522] }).show();
});
```

## Creating the Loader object

`G.loader(options?: LoaderOptions): Loader`

There are a few ways to setup the `Loader` object.

Only one `Loader` object is created on a page. Calling `G.loader()` again returns the same object. If options are passed, they are applied to the existing object with [setOptions](#setoptions).

**No parameters.**

`G.loader()`

In this case you should either use [setOptions](#setoptions), one of the other `set...` methods, or the properties to set the configuration.

```js
const loader = G.loader();
loader.setOptions({apiKey: 'my-api-key', libraries: ['places']});
// OR
loader.setApiKey('my-api-key')
    .setLibraries(['places']);
// OR
loader.apiKey = 'my-api-key';
```

**Pass the loader options.**

`G.loader(options: LoaderOptions)`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [LoaderOptions](#loader-options) | Yes | The configuration options. |

```js
const loader = G.loader({apiKey: 'my-api-key', libraries: ['places']});
```

:::warning
You must at a minimum set the API key value before calling the `load()` function.
:::

## Loader options

Type `LoaderOptions`.

LoaderOptions is an object containing the configuration options for the Loader object.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| apiKey | string |  | The Google Maps API key |
| libraries | Array | `[]` | An array of [Google Maps libraries](https://developers.google.com/maps/documentation/javascript/libraries#libraries-for-dynamic-library-import) to load. A string value is ignored here. Use the [libraries](#properties) property or [setLibraries](#setlibraries) to set a single library as a string. |
| version | string | weekly | The [version](https://developers.google.com/maps/documentation/javascript/versions) of the Google Maps library to load. |

## Events

Below are the available loader events.

You can use the plain text name for the event, or you can use the [event constant](/api-reference/constants#loaderevents).

| Event    | Description |
|----------|-------------|
| load | The API library is loaded. |
| map_load | The API library is loaded and the map is loaded and visible. |

## Properties

| Property  | Type   | Description                                   |
|-----------|--------|-----------------------------------------------|
| apiKey  | string | Your API key for the Google Maps API |
| libraries| Array | An array of [Google Maps libraries](https://developers.google.com/maps/documentation/javascript/libraries#libraries-for-dynamic-library-import) to load. When setting it you can also use a single string value for one library. |
| version | string | The [version](https://developers.google.com/maps/documentation/javascript/versions) of the Google Maps library to load. Defaults to "weekly". |

## Methods

### dispatch

`dispatch(event: string): void`

Dispatch an event on the loader. It's used internally to dispatch one of the [loader events](#events). You can also dispatch custom events.

```js
loader.dispatch('myEvent');
```

### load

`load(callback?: () => void): Promise<void>`

Loads the Google maps API library.

The `load` event is triggered after the library is loaded. If the library has already loaded then the callback is called and the promise resolves right away.

If the API key is not set then the promise is rejected with an error.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | Function |  | A function to call after the API library is loaded. |

No parameters are passed to the callback function.

#### Usage

Just load the library:

```js
loader.load();
```

Use the Promise:

```js
loader.load().then(() => {
    // Do something
});
```

Await the promise:

```js
async loadTheMap() {
    await loader.load();
    // Do something after loading
}
```

Use the callback:

```js
loader.load(() => {
    // Do something
});
```

While it's an odd choice, you can do both the callback and handle the promise. They will be executed at the same time.

```js
loader.load(() => {
    // Do something
}).then(() => {
    // Also do something
});
```

### on

`on(type: string, callback: Function): void`

Add an event listener to the Loader object. This is different from the [Evented on() method](/api-reference/base-classes/evented#on). The differences are:

- Event listeners are only triggered once. They are treated as a "once" event that gets removed after it's triggered. This is because the load event only happens once. Therefore, using `on` or `once` have the same effect.
- Events use [EventTarget](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget) to handle setting and dispatching the event. While we don't pass any data to the callback function, you'll get the usual Event data from the [EventTarget dispatchEvent function](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent).
- You can't pass a context to the callback. If you need the `this` variable to reference the object this callback is called in then use an [arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) for your callback.
- If the Google Maps API has already loaded when the listener is added then the `load` event is dispatched again right away so that `load` listeners are still called.
- An error is thrown if the callback is not a function.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | Yes | The event type. |
| callback | function | Yes | The callback function. |

```js
loader.on('load', () => {
    // Do something after the loader loads
});
// Use the event constant
loader.on(G.LoaderEvents.LOAD, () => {
    // Do something after the loader loads
});
```

### once

`once(type: string, callback: Function): void`

Since the [on](#on) listener sets events up to only be called once, this function is just syntatic sugar on top of that to make it clear in your code that the event is only called once.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | Yes | The event type. |
| callback | function | Yes | The callback function. |

```js
loader.once('load', () => {
    // Same as calling loader.on()
    // Do something.
});
// Use the event constant
loader.once(G.LoaderEvents.LOAD, () => {
    // Do something after the loader loads
});
```

### onceLoad

`onceLoad(callback: Function): void`

Convenience function to set up a `once` event callback for the `load` event.

Since the [on](#on) listener sets events up to only be called once, this function is just syntatic sugar on top of `onLoad` to make it clear in your code that the event is only called once.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | function | Yes | The callback function. |

```js
loader.onceLoad(() => {
    // Same as calling loader.onLoad()
    // Do something.
});
```

### onceMapLoad

`onceMapLoad(callback: Function): void`

Convenience function to set up a `once` event callback for the `map_load` event.

Since the [on](#on) listener sets events up to only be called once, this function is just syntatic sugar on top of `onMapLoad` to make it clear in your code that the event is only called once.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | function | Yes | The callback function. |

```js
loader.onceMapLoad(() => {
    // Same as calling loader.onMapLoad()
    // Do something.
});
```

### onLoad

`onLoad(callback: Function): void`

Add an event listener to the Loader object for the `load` event.

This is a convenience function for setting up `loader.on('load', () => {});`.

See the [on](#on) method for more information.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | function | Yes | The callback function. |

```js
loader.onLoad(() => {
    // Do something after the loader loads
});
```

### onMapLoad

`onMapLoad(callback: Function): void`

Add an event listener to the Loader object for the `map_load` event.

This is a convenience function for setting up `loader.on('map_load', () => {});`.

See the [on](#on) method for more information.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| callback | function | Yes | The callback function. |

```js
loader.onMapLoad(() => {
    // Do something after the loader loads
});
```

### setApiKey

`setApiKey(apiKey: string): Loader`

Set the Google Maps API key.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| apiKey | string | Yes | The API key |

```js
loader.setApiKey('my-api-key');
```

### setLibraries

`setLibraries(libraries: Libraries): Loader`

Set the [libraries](https://developers.google.com/maps/documentation/javascript/libraries) to load with Google maps.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| libraries | Array or string | Yes | An array or libraries, or a single library as a string |

Set a single library to load as an array:

```js
loader.setLibraries(['places']);
```

Set a single library to load as a string:

```js
loader.setLibraries('places');
```

Set multiple libraries to load:

```js
loader.setLibraries(['geocoding', 'places']);
```

### setOptions

`setOptions(options: LoaderOptions): Loader`

Set the loader object options. Only the options that are passed are changed.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| options | [LoaderOptions](#loader-options) | Yes | The loader options. |

```js
loader.setOptions({apiKey: 'my-api-key', libraries: ['places', 'geocoding'], version: 'quarterly'});
```

### setVersion

`setVersion(version: string): Loader`

Set the [version](https://developers.google.com/maps/documentation/javascript/versions) of the Google Maps API to load. You only need to call this if you don't want the weekly version to be used.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| version | string | Yes | The API version |

```js
loader.setVersion('quarterly');
```
