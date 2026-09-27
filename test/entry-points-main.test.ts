/* ===========================================================================
    The main entry point includes the optional features.

    This is in a file of its own because importing a feature module registers it on the Layer and
    Map classes for the rest of the process. A test that checks what the core entry point does
    *not* have would see whatever another test in the same file had already imported.

    See test/entry-points-core.test.ts for the other half of this.
=========================================================================== */

import { describe, expect, it } from 'vitest';
import { Map as GmapsMap, marker } from '../src/index';

describe('the main entry point', () => {
    it('brings the popup, tooltip and InfoWindow methods with it', () => {
        const m = marker({ lat: 40.73061, lng: -73.935242 });
        // The real methods replace the placeholders on Layer when those modules are imported, so
        // calling one must not throw the "hasn't been imported" error.
        expect(() => m.attachTooltip('A tooltip')).not.toThrow();
        expect(typeof m.attachPopup).toBe('function');
        expect(typeof m.attachInfoWindow).toBe('function');
    });

    it('replaces the map placeholders with the real methods', () => {
        const isPlaceholder = (fn: unknown) => /hasn't been imported/.test(String(fn));
        expect(isPlaceholder(GmapsMap.prototype.attachPopup)).toBe(false);
        expect(isPlaceholder(GmapsMap.prototype.attachTooltip)).toBe(false);
        expect(isPlaceholder(GmapsMap.prototype.attachInfoWindow)).toBe(false);
    });
});
