/* ===========================================================================
    Javascript for the plugin test page
=========================================================================== */


/* global G */

// Add a custom function to the marker object
G.Marker.include({
    pluginTest: function () {
        console.log('plugin test');
    }
});

const marker = G.marker({
    latitude: 40.730610,
    longitude: -73.935242,
    title: 'My Marker',
});

marker.pluginTest();

// Create a custom plugin on the "G" namespace
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


// Create a class that extends a library class

class MyMarker extends G.Marker {
    constructor(options) {
        super(options);
    }

    test() {
        this.dispatch('my_event', { test: 'test' });
        console.log('MyMarker test');
    }
}

G.MyMarker = MyMarker;

const myMarker = new G.MyMarker({
    latitude: 40.730610,
    longitude: -73.935242,
    title: 'My Marker',
});
myMarker.on('my_event', (e) => {
    console.log('my_event: ', e);
});
myMarker.test();
