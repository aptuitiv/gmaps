---
---

# Evented

The `Evented` class is used with objects like Map and Marker that need event handling.

`Evented` extends [Base](/api-reference/base-classes/base).

```js
class MyThing extends Evented {}
```

:::info
This is used internally and in plugins. It is not intended to be used to display objects on the map.
:::

The event handling allows you to do something when an event occurs.

For example:

```js
map.on('click', () => {
    // Do something when the map is clicked
})
```

## Supported events

The events that are supported are the same ones that the Google Maps API supports.

## Custom events

You can also add listeners and dispatch custom events.

```js
// Add a custom event listener
marker.on('custom', (e) => {
    console.log('A custom event happened: ', e);
});

// Dispatch the event later when something else happens
marker.dispatch('custom', {data: 'Custom data'});
```

## Event return data

The returned value from the event is different from the [Google Maps event data](https://developers.google.com/maps/documentation/javascript/reference/map#MapMouseEvent). It'll include similar information, but the data uses `G` library objects instead of Google Map objects.

This data is passed to an event listener for events that are supported by Google Maps or this library.

If you dispatch your own custom event then you can pass any data you want and that is what will be returned. (Or, don't pass any event data if you don't need to.)

Type `Event`

:::info
Not all properties are guaranteed to be available. Please test for them before trying to use them.
:::

| Name   | Type | Description |
|--------|------|-------------|
| domEvent |  [MouseEvent](https://developer.mozilla.org/docs/Web/API/MouseEvent), [TouchEvent](https://developer.mozilla.org/docs/Web/API/TouchEvent), [PointerEvent](https://developer.mozilla.org/docs/Web/API/PointerEvent), [KeyboardEvent](https://developer.mozilla.org/docs/Web/API/KeyboardEvent), or [Event](https://developer.mozilla.org/docs/Web/API/Event) | The corresponding native DOM event |
| feature | [DataFeature](/api-reference/data-feature) | The data layer feature that the event occurred on. This is only set for events dispatched by a [DataLayer](/api-reference/data-layer#events). |
| latLng | [LatLng](/api-reference/utilities/latlng) | The latitude/longitude that was below the cursor when the event occurred. |
| placeId | string | The placeId of the place that was below the cursor when the event occurred. This is only set when the user clicks on an icon on the map. |
| pixel | [Point](/api-reference/utilities/point) | The pixel coordinates where the event occurred. |
| stop | Function | Call this function to stop the event from propagating further on the map. This comes from the Google Maps event data. |
| type | string | The event type. This is guaranteed to be set. |

### Example usage

```js
map.on('click', (e) => {
    console.log(`The event type is ${e.type}`);

    if (e.latLng) {
        console.log(`You clicked at ${e.latLng.lat}/${e.latLng.lng}`);
    }

    // Stop the event from propogating to other elements on the page.
    if (e.stop) {
        e.stop();
    }
});
```

## Event callback function

Type `EventCallback`

The method signature for the event callback function is:

`function(e: Event): void`

## Event Configuration Type

Some of the methods accept a `config` parameter. This is used to pass configuration data to set up the event listener.

The `config` parameter is an `EventConfig` type.

`EventConfig` has the following object values:

| Object value | Description |
|--------------|-------------|
| `callImmediate?: boolean` | If true then the event listener will be called immediately if the event has already been dispatched. If the event is a "once" event then the listener will not be set up for future events. |
| `context?: object` | The context to bind the callback function to. |
| `once?: boolean` | If true then the event listener callback will only be called once. |
| `only?: boolean` | If true then only one listener will be added for this event type. Any later listeners for the event type are ignored. See [only()](#only). |

## Event Listener Options Type

The [off](#off) event accepts an `options` parameter with the `EventListenerOptions` type.

`EventListenerOptions` has the following object values:

| Object value | Description |
|--------------|-------------|
| `once?: boolean` | If true then the event listener callback will only be called once. |

## Methods

- Methods inherited from [Base](/api-reference/base-classes/base#methods).

### constructor

`constructor(objectType: string, testObject: string, testLibrary?: string)`

The class object constructor.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| objectType | string | Yes | The object type. i.e. "map", "marker", "tooltip". Used with the object type tests in [Base](base). |
| testObject | string | Yes | The camel case object name that is used when testing for the existance of the Google Map library. This should be the name of the object that calls this method. |
| testLibrary | string | | An optional Google maps library class to check for. This needs to be part of the google.maps object. If not set then it's set to `testObject`. |

### dispatch

`dispatch(event: string, data?: object): Evented`

Dispatches/triggers the event, which will call any event listeners for that event type.

You can optionally pass an object of data to be passed to the event.

If the data is a Google Maps event object then it's converted to an [Event](#event-return-data) object. Otherwise the data is merged with the `type` value and passed to the event listeners.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| event | string | Yes | The event to dispatch |
| data | object | | The data to pass to the event listener callback function. |

```js
marker.dispatch('click');
marker.dispatch('customEvent', {data: 'my data'});
```

### hasListener

`hasListener(type: string, callback?: EventCallback): boolean`

Returns whether there is an event listener set up for the event type. If you pass the callback function then another check will be done to see if the event type's callback function matches.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | Yes | The event to test for |
| callback | Function | | The callback function to include in the test |

```js
if (!marker.hasListener('click')) {
    // Do something
}
```

### off

`off(type?: string, callback?: EventCallback, options?: EventListenerOptions): void`

Removes the event listener(s) on the object.

There are three ways to remove event listeners:

Remove a specific event listener by passing the callback function and optionally the options object.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string |  | The event to remove. (If not set then all events on the object are removed. That is the same behavior as [offAll](#offall)) |
| callback | Function | | The callback function to use when finding the event to remove. |
| options | [EventListenerOptions](#event-listener-options-type) | | The options to use when finding the event to remove. |

```js
marker.off('click', onClickFunction);
marker.off('click', onClickFunction, options);
```

 Remove all listeners for a given event type by only passing the event type.

 ```js
marker.off('click');
 ```

 Remove all listeners for all event types.

 ```js
marker.off();
marker.offAll();
 ```

### offAll

`offAll(): void`

Removes all of the event listeners on the object.

```js
marker.offAll();
```

### on

`on(type: string, callback: EventCallback, config?: EventConfig): void`

Add an event listener to the object.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | Yes | The event to add a listener to. |
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |
| config | [EventConfig](#event-configuration-type) | | Configuration for setting up the event listener. |

```js
marker.on('click', () => {
    // Do something when the marker is clicked
})
```

Set an event to only be called once. Alternately, you can use the [once](#once) function.

```js
marker.on('click', () => {
    // Do something once when the marker is clicked.
    // This event will be removed after it's first dispatched.
}, {once: true});
```

If you are using [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) like in the examples above, then you don't have to worry about the context for `this` in your callback function.

But, if your code is within an object and you're using a traditional [function expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function) for a callback, then you may need to set the event context. This value will be used within your function for the `this` variable.

```js
const myObject = {
    setupMarker() {
        function callback() {
            // Doign some else
            this.anotherMethod();
        }
        marker = G.marker({});
        marker.on('click', callback, {context: this});

        // You'd also need to set the content in this scenario:
        marker.on('dblclick', function() {
            this.anotherMethod();
        }, {context: this})

        // You don't need to set the context with arrow functions
        marker.on('mouseover', () => {
            this.anotherMethod();
        })
    },
    anotherMethod() {
        // Doing something else
    }
}
```

### onImmediate

`onImmediate(type: string, callback: EventCallback, config?: EventConfig): void`

Add an event listener to the object. It will be called immediately if the event has already been dispatched.

When the callback is called immediately, it's called without an event object.

This is an alternate to callling [on()](#on) and passing the `callImmediate` configuration value.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | Yes | The event to add a listener to. |
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |
| config | [EventConfig](#event-configuration-type) | | Configuration for setting up the event listener. |

```js
marker.onImmediate('click', () => {
    // Do something when the click event is dispatched or if it's already dispatched
});
```

### once

`once(type: string, callback?: EventCallback, config?: EventConfig): void`

Sets up an event listener that will only be called once.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | Yes | The event to add a listener to. |
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |
| config | [EventConfig](#event-configuration-type) | | Configuration for setting up the event listener. |

```js
marker.once('click', () => {
    // This will only run once
});
```

### onceImmediate

`onceImmediate(type: string, callback?: EventCallback, config?: EventConfig): void`

Sets up an event listener that will only be called once. It will be called immediately if the event has already been dispatched.

This is an alternate to callling [once()](#once) and passing the `callImmediate` configuration value.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | Yes | The event to add a listener to. |
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |
| config | [EventConfig](#event-configuration-type) | | Configuration for setting up the event listener. |

```js
map.onceImmediate('visible', () => {
    // Do something once when the visible event is dispatched or if it's already dispatched
});
```

### only

`only(type: string, callback: EventCallback, config?: EventConfig): void`

Sets up the only event listener for this type of event. It will be called immediately if the event has already been dispatched.

The difference between this and [on()](#on) is that `only()` will only set up one event listener for this type.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | Yes | The event to add a listener to. |
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |
| config | [EventConfig](#event-configuration-type) | | Configuration for setting up the event listener. |

```js
map.only('click', () => {
    // Do something
});
```

### onlyOnce

`onlyOnce(type: string, callback: EventCallback, config?: EventConfig): void`

Sets up an event listener that will only be called once. This will be the only event listener for this type will be set up. It will be called immediately if the event has already been dispatched.

The difference between this and [once()](#once) is that `onlyOnce()` will only set up one event listener for this type.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| type | string | Yes | The event to add a listener to. |
| callback | Function | Yes | The callback function that will be called when the event is dispatched. |
| config | [EventConfig](#event-configuration-type) | | Configuration for setting up the event listener. |

```js
map.onlyOnce('visible', () => {
    // Do something
});
```

### setEventGoogleObject

`setEventGoogleObject(googleObject: google.maps.MVCObject | google.maps.marker.AdvancedMarkerElement): void`

Set the Google Maps object for the object. This is the Google object that the object represents. Event listeners will be added to it.

Any event listeners that were added before the Google Maps object was set are set up on it at this point.

:::info
This should only be called from the class that extends this class.
 This is not intended to be called from outside of this library.
:::

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| googleObject | google.maps.MVCObject \| google.maps.marker.AdvancedMarkerElement | Yes | The Google Maps object that the object represents. |

### trigger

`trigger(event: string, data?: object): Evented`

Dispatches/triggers the event, which will call any event listeners for that event type.

:::info
This is an alias to [dispatch](#dispatch).
:::

```js
marker.trigger('click');
marker.trigger('customEvent', {data: 'my data'});
```
