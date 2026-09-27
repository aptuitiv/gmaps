---
---

# Plugin Guide

A plugin extends the library from outside it. Anything from a single extra method on a marker to a
control with behaviour of its own can be a plugin, and the library's own popups, tooltips and
InfoWindows are built the same way as one.

This page covers what belongs in a plugin, the ways to extend the library, and the conventions to
follow if you publish one.

## What belongs in a plugin

The library keeps to primitives, Google Maps integration, and behaviour that decides nothing about
appearance. Anything with an opinion about how things look belongs in a plugin.

> **The library owns *when*. You own what it looks like.**

| The library owns | You own |
|---|---|
| Lifecycle: attach, detach, reposition, reorder | The element, or the tag, class names and content used to build one |
| State: what state a thing is in, and when it changes | What each state looks like |
| Integration: map render timing, events, Google Maps API calls | Every side effect of an interaction |
| State-reflecting ARIA, like `aria-pressed` and `aria-disabled` | Roles, labels and other semantics on an element you supply |
| Nothing else | CSS. **The library ships no stylesheet, ever.** |

Two questions decide whether something could go in the library itself rather than a plugin. Both have
to be yes:

1. **Does it wrap a Google Maps capability**, or UI that happens to sit on a map?
2. **Is it headless** by the rule above?

A styled replacement for a control Google won't let you style fails the first question — the
capability is already there in `mapTypeId`, and what's left is markup. A legend fails both.

### State that shows in the DOM

When a plugin's state has to be visible, take the vocabulary from the caller rather than inventing
it. [Button](/api-reference/map-controls/button) does this:

```js
states: {
    active: { attributes: { 'data-visible': 'yes' } },
    inactive: { attributes: { 'data-visible': 'no' } },
}
```

The plugin decides *when* a state applies. The caller decides what it's called, and their CSS matches
it. That keeps the state machine in one place without the plugin choosing class names.

## Ways to extend the library

Four, in rough order of how often you'll want them.

### Extend a class

The right choice for anything holding state of its own, and the only one that can use private fields
or run code when an object is constructed.

```js
class MyMarker extends G.Marker {
    #clickCount = 0;

    constructor(options) {
        super(options);
        this.on('click', () => {
            this.#clickCount += 1;
        });
    }

    get clickCount() {
        return this.#clickCount;
    }
}

// Put it on the G namespace so browser users can reach it
G.MyMarker = MyMarker;

const marker = new G.MyMarker({ latitude: 40.730610, longitude: -73.935242 });
```

:::info
Load or include the `G` library before this runs. With the standalone browser script that means your
script tag comes after the library's. See [installation](/installation/browser).
:::

### Add methods to an existing class

`include()` is a [mixin](https://javascript.info/mixins): it copies what you give it onto the class
prototype. Use it to add methods to a class you don't control.

```js
G.Marker.include({
    MyPlugin: {
        doSomething: function () {
            console.log('plugin test');
        },
    },
});

const marker = G.marker({ latitude: 40.730610, longitude: -73.935242 });
marker.MyPlugin.doSomething();
```

Namespacing under `MyPlugin` like that is worth doing — see "It overwrites without warning" below.

#### What `include()` can and can't do

It's `Object.defineProperties()` onto the prototype, which makes it good for methods and accessors
and not much else. Four things to know before relying on it.

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

**It overwrites without warning.** Two plugins adding the same method name means the last one loaded
wins, silently. Namespace your additions.

And one thing it cannot do at all: **reach private fields**. `#private` names are scoped to the class
body they're written in, so a mixin that mentions one is a syntax error, not a runtime failure.
Anything needing private state, or code that runs at construction, should
[extend a class](#extend-a-class) instead.

### Attach to every map

`Map.addInitHook()` runs a function against every map as it's created, so a plugin can attach itself
without the site wiring it up for each map on the page.

```js
G.Map.addInitHook((map) => {
    map.on('ready', () => {
        // The Google map object exists by now
    });
});
```

The hook runs at the end of the map's constructor, after its options have been applied and before
it's rendered, with the map as both `this` and the first argument.

It only applies to maps created after the hook is added, so a plugin has to load before the maps it
attaches to. Keep hooks cheap, and don't assume any particular option is set — a hook runs for
*every* map, including ones the plugin has nothing to do with. A hook that throws is logged and the
rest still run, so one plugin can't stop a map from being created.

[See addInitHook in the Map reference](/api-reference/map#addinithook).

### Add to the `G` namespace

For a plugin that isn't extending anything, put your own class or function on `G` so browser users
can reach it the same way they reach the rest of the library.

```js
G.MyPlugin = class {
    constructor(options) {
        this.options = options;
    }

    test() {
        console.log('MyPlugin test ', this.options);
    }
};

const myPlugin = new G.MyPlugin({ test: 'test' });
myPlugin.test();
```

## Writing a control

Anything positioned on the map — a button, a panel, a legend — should extend
[Control](/api-reference/map-controls/control), which owns the element's lifecycle: adding it,
ordering it, moving it and taking it off again. The last of those can't be done from outside the
library at all.

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

For anything clickable, extend [Button](/api-reference/map-controls/button) instead and get the
click handling, the enabled state and the active state with it:

```js
class ResetButton extends G.Button {
    constructor(options) {
        super({
            className: 'MapBtn MapBtn-reset',
            content: '<svg class="Icon"><use xlink:href="#icon-repeat" /></svg>',
            ...options,
        });
    }
}
```

[LocationControl](/api-reference/map-controls/location-control) is the library's own worked example
of this: it extends `Button`, adds geolocation behaviour, and decides nothing about how any of it
looks.

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
followed by an init hook reading `this.options.myOption`. Leaflet keeps a plain `options` object on
each class prototype for plugins to merge defaults into.

This library doesn't work that way. `map.setOptions()` handles each option it knows about explicitly
— validating it, converting it, and applying it to a map that may already be on the page — and
anything it doesn't recognise is ignored. There's no shared options bag to add to.

That's a deliberate difference rather than a missing feature. Map options describe the map; a
plugin's options describe the plugin. Keeping them apart means the map's option surface doesn't
change depending on which plugins a page happens to load, and a plugin can type its own options
properly.

Configure from an init hook if you want a plugin to set itself up for every map:

```js
G.Map.addInitHook((map) => {
    G.myPlugin({ map });
});
```

### Typescript

Publish your types. If you do add a member to one of the library's types, declare it with module
augmentation so your users get it:

```ts
declare module '@aptuitiv/gmaps' {
    interface MapOptions {
        myPluginOption?: boolean;
    }
}
```

Augmenting the type doesn't make the map do anything with the option — the note above still applies.
It's for the case where your plugin reads the value itself.

## A worked example: how popups and tooltips do it

Popups, tooltips and InfoWindows are plugins in everything but where they live. Each one adds methods
to classes it doesn't own, and between them they show every part of the pattern. The source is worth
reading: `src/lib/Popup.ts`, `src/lib/Tooltip.ts` and `src/lib/InfoWindow.ts`.

**They register with `include()`, at the bottom of the module:**

```js
Layer.include(popupMixin);
Map.include(popupMixin);
```

Importing the module is what adds `attachPopup()` to every marker, polyline and map. Nothing else has
to happen.

**They have their own entry point.** `@aptuitiv/gmaps/popup` exists so that a project not using
popups doesn't carry them. A registering plugin can never be dropped by a bundler — the whole point
is that it attaches itself to something else — so being separately importable is the only way to make
it optional.

**They're listed in `sideEffects`.** A plugin that registers something has to be, in the
`package.json` of whatever ships it, or a bundler may drop a bare
`import 'your-plugin'` and leave a method your documentation promises and the runtime doesn't have.
Watch that the patterns match the *shipped* file names — patterns written for source files stop
matching once a build renames them.

**The classes they attach to carry a placeholder.** `Layer` and `Map` declare `attachPopup()`
themselves, with the same signature the real one has, throwing an error that names the import to add:

```text
attachPopup() is added by the "popup" module, which hasn't been imported. Import it once,
anywhere in your code, to add attachPopup() to this object:
    import '@aptuitiv/gmaps/popup';
```

Without it the call fails with "attachPopup is not a function", which doesn't tell anyone what to do.
Declaring the placeholder with the real signature means the types are the same either way, and the
type it needs comes in through `import type`, so it costs nothing at runtime.

If your plugin adds a method to a class that isn't yours, you can't add a placeholder to it — so say
clearly in your documentation that the import is what creates the method.

## Conventions

Follow these and a plugin will feel like part of the library rather than something bolted on.

**Naming.** Name the package `gmaps-<plugin name>`, so it's findable. Use `camelCase` for functions
and methods and `CapitalizedCamelCase` for classes.

**A factory beside the class.** Export a lowercase factory function next to the class, as the library
does with `marker()` / `Marker` and `button()` / `Button`. The factory is what people use; the class
is there for `instanceof` and for extending.

**One options object.** Take a single object rather than positional arguments, so options can be
added later without breaking anyone.

**Events through `Evented`.** Extend [Evented](/api-reference/base-classes/evented) — or a class that
does — and dispatch rather than taking callbacks for everything. Callers then get `on()`, `once()`
and the rest for free.

**No globals but `G`.** Register on the `G` namespace and nothing else.

**`@aptuitiv/gmaps` as a `peerDependency`**, not a dependency. Two copies of the library in one
project breaks every `instanceof` check, and the library relies on those.

**Ship ESM and a browser build.** The ESM build is what bundler users import. The browser build is a
separate file that reads what it needs off `globalThis.G` at load time — it must *not* bundle its own
copy of the library, for the same reason as the peer dependency. Script order then matters, so say so:
the library's tag comes first.

**Don't commit build output.** Build on publish instead, with a `prepare` script.

## Accessibility

A plugin that renders UI is the only one who can get this right, and it's the part most often skipped.

- **Keyboard.** Everything interactive must be reachable and operable with a keyboard. A `div` with a
  click handler is neither — use a real `button`, which is what [Button](/api-reference/map-controls/button)
  builds by default.
- **State in ARIA.** `aria-pressed` for a toggle, `aria-expanded` for something that opens,
  `aria-disabled` when unavailable. `Button` sets these because they *are* the state.
- **Names.** Anything icon-only needs an accessible name, through `aria-label` or visually hidden
  text.
- **Test it.** Lighthouse or axe will catch a lot. Tabbing through it yourself catches more.

## Publishing

Once it's published, [open a pull request](https://github.com/aptuitiv/gmaps) to add it to the
[plugin list](/plugins) so other people can find it.
