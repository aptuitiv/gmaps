/* ===========================================================================
    The core entry point leaves the optional features out.

    In a file of its own for the reason given in test/entry-points-main.test.ts: importing a
    feature module anywhere in the file would register it and make this pass for the wrong reason.
=========================================================================== */

import { describe, expect, it } from 'vitest';
import { Map as GmapsMap, marker } from '../src/core';

describe('the core entry point', () => {
    it('explains what to import when a feature method is called without its module', () => {
        const m = marker({ lat: 40.73061, lng: -73.935242 });
        // The placeholder on Layer. Without it this would be "attachPopup is not a function",
        // which doesn't say what to do about it.
        expect(() => m.attachPopup('Some content')).toThrow(/import '@aptuitiv\/gmaps\/popup'/);
        expect(() => m.attachTooltip('A tooltip')).toThrow(/import '@aptuitiv\/gmaps\/tooltip'/);
        expect(() => m.attachInfoWindow('Info')).toThrow(/import '@aptuitiv\/gmaps\/infowindow'/);
    });

    it('does the same for the map, which gets the methods from the same modules', () => {
        // Built from the prototype so that the test doesn't need a DOM element to make a map with.
        // The placeholder throws before it touches anything on the object.
        const m = Object.create(GmapsMap.prototype);
        expect(() => m.attachPopup('Some content')).toThrow(/import '@aptuitiv\/gmaps\/popup'/);
        expect(() => m.attachTooltip('A tooltip')).toThrow(/import '@aptuitiv\/gmaps\/tooltip'/);
        expect(() => m.attachInfoWindow('Info')).toThrow(/import '@aptuitiv\/gmaps\/infowindow'/);
    });
});
