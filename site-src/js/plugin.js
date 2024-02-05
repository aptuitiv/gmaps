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
    tooltipContainer: '#map',
    tooltipClass: 'my-tooltip'
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
