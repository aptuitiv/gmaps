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

### What `include()` can and can't do

`include()` is `Object.assign()` onto the class prototype. That makes it good for adding methods and
not much else. Four things are worth knowing before you rely on it.

**Methods are fine.** This is what the library itself uses `include()` for — popups, tooltips and
InfoWindows all add their `attach*()` methods this way.

**A mutable property is shared by every instance.** A property in the mixin lands on the prototype,
not on each object, so every instance sees the same one until something assigns over it:

```js
G.Marker.include({ items: [] });

const a = G.marker();
const b = G.marker();
a.items.push('x');
b.items.length; // 1 - it's the same array
```

Give each object its own by assigning in a method (`this.items = []`) rather than relying on the
default.

**Getters and setters work.** They're copied with their descriptors, so an accessor in a mixin stays
an accessor:

```js
G.Marker.include({
    get half() { return this.getPosition().lat / 2; },
});
```

(Before v0.30 these were silently flattened to whatever the getter returned the first time it ran.
Leaflet's `include` still behaves that way, so a mixin written for Leaflet may be relying on it.)

**It overwrites without warning.** Two plugins adding the same method name means the last one
loaded wins, silently. Namespace your additions, as in the `MyPlugin` example above.

And one thing it cannot do at all: **reach private fields**. `#private` names are scoped to the class
body they are written in, so a mixin that mentions one is a syntax error, not a runtime failure.
Anything that needs private state, or that needs to run when an object is constructed, should use
`class MyThing extends G.Marker` instead. See
[Create a custom class that extends a `G` library class](#create-a-custom-class-that-extends-g-library-class)
below.

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

## Write a control

Anything positioned on the map — a button, a panel, a legend — should extend
[Control](/api-reference/map-controls/control), which owns the element's lifecycle on the map:
adding it, ordering it, moving it and taking it off again. The last of those can't be done from
outside the library at all.

```js
class MyControl extends G.Control {
    constructor(options) {
        super({ tag: 'button', ...options });
        this.element.addEventListener('click', () => {
            // ...
        });
    }
}
```

[Button](/api-reference/map-controls/button) is the worked example: it adds click handling, an
enabled state and an active state on top of `Control`, and decides nothing about how any of it
looks. A plugin that needs a clickable control can extend `Button` rather than starting from
`Control`.

## Attach a plugin to every map

`Map.addInitHook()` runs a function against every map as it's created, so a plugin can attach itself
without the site wiring it up for each map on the page.

```js
G.Map.addInitHook((map) => {
    // Runs for every map created from here on
    map.on('ready', () => {
        // The Google map object exists by now
    });
});
```

The hook runs at the end of the map's constructor, after its options have been applied and before it
has been rendered, with the map as both `this` and the first argument.

It only applies to maps created after the hook is added. A plugin therefore has to be loaded before
the maps it attaches to — with the standalone browser script, that means the plugin's `script` tag
comes before the code that creates the map. See
[the installation pages](/installation/browser) for script order.

Keep hooks cheap, and don't assume any particular option has been set: a hook runs for *every* map,
including ones the plugin has nothing to do with. A hook that throws is logged and the rest still
run, so one plugin can't stop a map from being created.

[See addInitHook in the Map reference](/api-reference/map#addinithook).

## Plugin options

A plugin takes its own options, through its own factory function:

```js
const myThing = G.myPlugin({ map: myMap, colour: 'red' });
```

**Not** by adding an option to the map:

```js
// Don't do this - the map ignores options it doesn't know about
const myMap = G.map('#map', { myPluginOption: true });
```

This differs from Leaflet, where the usual pattern is `L.Map.mergeOptions({ myOption: default })`
followed by an init hook that reads `this.options.myOption`. Leaflet keeps a plain `options` object on
each class prototype, which a plugin can merge defaults into.

This library doesn't work that way. `map.setOptions()` handles each option it knows about
explicitly — validating it, converting it, and applying it to a map that may already be on the
page — and anything it doesn't recognise is ignored. There's no shared options bag for a plugin to
add to.

That is a deliberate difference rather than a missing feature. Map options describe the map; a
plugin's options describe the plugin. Keeping them apart means the map's option surface doesn't
change depending on which plugins a page happens to load, and a plugin's options can be typed
properly by the plugin itself.

### If you really need an option on the map

Configure the plugin from an init hook instead, reading whatever you need from the plugin's own
setup rather than from the map:

```js
G.Map.addInitHook((map) => {
    G.myPlugin({ map });
});
```

If a genuine case for a map-level option comes up, raise it — supporting it properly means the map
keeping options it doesn't recognise and exposing them, which is a change to the core rather than
something a plugin can do on its own.

### Typescript

If you do add a member to one of the library's types, declare it with module augmentation so that
your plugin's users get the type:

```ts
declare module '@aptuitiv/gmaps' {
    interface MapOptions {
        myPluginOption?: boolean;
    }
}
```

Augmenting the type doesn't make the map do anything with the option — the note above still applies.
It's for the case where your plugin reads the value itself.
