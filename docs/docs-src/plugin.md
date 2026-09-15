---
---

# Plugin Guide

Plugins allow you to extend or add functionality to the Google Maps Display library.

There are a few ways to write a plugin.

## Extend an existing `G` object

Use the `include` function that is part of the [Base](/api-reference/base-classes/base) or [Evented](/api-reference/base-classes/base) classes.

This essentially lets you include a [mixin](https://javascript.info/mixins) into one of the existing classes.

For example, to extend the [Marker](/api-reference/marker) class you could do something like this:

```js
G.Marker.include({
    MyPlugin: {
        doSomething: function () {
            console.log('plugin test');
        }
    }
});
```

(You need to make sure that you load or include the `G` library before you run this code.)

You can then setup your marker object and call this function.

```js
const marker = G.marker({
    latitude: 40.730610,
    longitude: -73.935242,
    title: 'My Marker',
});

marker.MyPlugin.doSomething();
```

You can also do a nested object like this:

```js
G.Marker.include({
    MyPlugin: {
        doSomething: function () {
            console.log('plugin test');
        }
    }
});
```

## Create a custom class on the `G` namespace

:::info
You need to make sure that you load or include the `G` library before you run this code.
:::

```js
G.MyPlugin = class {
    options = {};

    constructor(options) {
        this.options = options;
    }

    test() {
        console.log('MyPlugin test ', this.options);
    }
}

const myPlugin = new G.MyPlugin({ test: 'test' });
myPlugin.test();
```

## Create a custom class that extends `G` library class

:::info
You need to make sure that you load or include the `G` library before you run this code.
:::

```js
// Create the custom class
class MyMarker extends G.Marker {
    constructor(options) {
        super(options);
    }

    test() {
        this.dispatch('my_event', { test: 'test' });
        console.log('MyMarker test');
    }
}

// Assign the class to the "G" namespace
G.MyMarker = MyMarker;

// Set up the class object
const myMarker = new G.MyMarker({
    latitude: 40.730610,
    longitude: -73.935242,
    title: 'My Marker',
});
// Add an event listener
myMarker.on('my_event', (e) => {
    console.log('my_event: ', e);
});
// Call a function on the object
myMarker.test();
```
