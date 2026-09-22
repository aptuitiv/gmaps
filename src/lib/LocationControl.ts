/* ===========================================================================
    Show the user where they are, and give them a control that takes the map back to it.

    The library already does the hard half of this: map.locate() watches the Geolocation API,
    normalises what it gets back and dispatches "locationfound". What it doesn't do is show
    anything, so every project that wants the familiar blue dot writes the same twenty lines - make
    a marker, move it on each fix, add a button, pan to the marker when it's clicked, and only show
    the button once a fix has actually arrived.

    The control extends Button, so clicking, the enabled state and the lifecycle on the map all come
    from there. "Enabled" turns out to be the right mechanism for "there is no location yet".

    See https://aptuitiv.github.io/gmaps/api-reference/map-controls/location-control for documentation.
=========================================================================== */

import { Button, ButtonOptions } from './Button';
import { EventCallback } from './Evented';
import { isBoolean, isNumber, isObject } from './helpers';
import { Map } from './Map';
import { LocateOptions, LocationPosition } from './Map/types';
import { marker as markerFactory, Marker, MarkerOptions } from './Marker';
import { SvgSymbol, SvgSymbolOptions } from './SvgSymbol';

// The blue dot. It's the convention on every map that shows the user's position, and it's built
// from a Marker and an SvgSymbol, both of which the library already owns - so it isn't the library
// deciding how a control looks. Pass marker options to change any of it, or marker: false for none.
//
// Deliberately no title. A marker title shows as a tooltip when the dot is hovered, which would
// make it the only user-visible wording the library invents - everything else a visitor can read
// is supplied by the caller. Pass marker: { title: 'My location' } to have one.
const defaultMarkerOptions: MarkerOptions = {
    svgIcon: {
        // Moves the dot to the centre of the marker. The icon is 22x22 pixels.
        anchor: { x: 11, y: 11 },
        fillColor: '#5284ed',
        fillOpacity: 1,
        path: 'M3 11a8 8 0 1 0 16 0a8 8 0 1 0 -16 0',
        strokeColor: '#ffffff',
        strokeWeight: 2,
    },
};

export type LocationControlOptions = ButtonOptions & {
    // What clicking the control does with the map. Defaults to 'pan'.
    action?: 'pan' | 'center';
    // Whether the control calls map.locate() itself. Defaults to true.
    autoLocate?: boolean;
    // Whether to move the map to the user the first time a location is found. Defaults to false, so
    // that later updates never fight the user panning the map.
    centerOnFirstFind?: boolean;
    // Options passed through to map.locate()
    locateOptions?: LocateOptions;
    // false for no marker, a Marker to use as it is, or options merged over the default blue dot
    marker?: boolean | Marker | MarkerOptions;
    // Whether the control is only put on the map once a location has been found. Defaults to true,
    // so that a denied permission leaves no dead button behind.
    showWhenLocated?: boolean;
    // The zoom level to set when the control is clicked. Not set by default, so zoom is left alone.
    zoom?: number;
};

/**
 * The location control class
 */
export class LocationControl extends Button {
    /** What clicking does with the map */
    #action: 'pan' | 'center' = 'pan';

    /** Whether the control calls locate() itself */
    #autoLocate: boolean = true;

    /** Whether to move the map to the user on the first fix */
    #centerOnFirstFind: boolean = false;

    /** Whether this control was the one that started the map watching */
    #startedLocating: boolean = false;

    /** The last position that was found */
    #location: LocationPosition | undefined;

    /**
     * The map being watched, and the listener watching it.
     *
     * Held separately from Control's map, which is only set while the control is actually on the
     * map. With the default showWhenLocated it isn't, until a location has been found - so there
     * was no way to reach the map to stop the watch, or to take the listener off again.
     */
    #locationMap: Map | undefined;

    /** The locationfound listener, kept so that it can be removed */
    #locationFoundListener: EventCallback | undefined;

    /** Options for map.locate() */
    #locateOptions: LocateOptions | undefined;

    /** The marker showing where the user is */
    #marker: Marker | undefined;

    /** Whether the marker belongs to this control, and so should be torn down with it */
    #ownsMarker: boolean = false;

    /** Whether the control waits for a location before going on the map */
    #showWhenLocated: boolean = true;

    /** The zoom level to set when clicked */
    #zoom: number | undefined;

    /**
     * Class constructor
     *
     * @param {LocationControlOptions} [options] The options for the control
     */
    constructor(options?: LocationControlOptions) {
        // The map is held back. Whether the control goes on it straight away depends on
        // showWhenLocated, which isn't known until the options below have been read.
        const { map, ...rest } = options ?? {};
        super(rest);

        if (isObject(options)) {
            if (options.action === 'center' || options.action === 'pan') {
                this.#action = options.action;
            }
            if (isBoolean(options.autoLocate)) {
                this.#autoLocate = options.autoLocate;
            }
            if (isBoolean(options.centerOnFirstFind)) {
                this.#centerOnFirstFind = options.centerOnFirstFind;
            }
            if (isObject(options.locateOptions)) {
                this.#locateOptions = options.locateOptions;
            }
            if (isBoolean(options.showWhenLocated)) {
                this.#showWhenLocated = options.showWhenLocated;
            }
            if (isNumber(options.zoom)) {
                this.#zoom = options.zoom;
            }
            this.#setUpMarker(options.marker);
        } else {
            this.#setUpMarker(undefined);
        }

        this.onClick(() => this.panToLocation());

        if (map instanceof Map) {
            this.setMap(map);
        }
    }

    /**
     * Get whether a location has been found yet
     *
     * @returns {boolean}
     */
    get isLocated(): boolean {
        return typeof this.#location !== 'undefined';
    }

    /**
     * Get the last location that was found, or undefined if there hasn't been one
     *
     * @returns {LocationPosition|undefined}
     */
    get location(): LocationPosition | undefined {
        return this.#location;
    }

    /**
     * Get the marker showing where the user is, or undefined if the control was set up without one
     *
     * @returns {Marker|undefined}
     */
    get marker(): Marker | undefined {
        return this.#marker;
    }

    /**
     * Start watching for the user's location on a map, and show the control on it.
     *
     * This is used instead of addTo() because the control has to listen to the map before it can
     * decide whether to go on it. With the default showWhenLocated it isn't added until a location
     * has been found.
     *
     * @param {Map} map The map to use
     * @returns {LocationControl}
     */
    setMap(map: Map): LocationControl {
        if (!(map instanceof Map)) {
            // eslint-disable-next-line no-console
            console.warn('You must pass a Map object to a location control.', map);
            return this;
        }

        // Let go of any map this control was already watching, so that moving it doesn't leave a
        // listener running on the one it came from
        this.#detach();

        const listener: EventCallback = (event) => {
            // dispatch() merges the data it is given onto the event object, so the position's
            // fields are on the event itself rather than under a "detail" property
            this.#handleLocationFound(map, event as unknown as LocationPosition);
        };
        map.on('locationfound', listener);
        this.#locationMap = map;
        this.#locationFoundListener = listener;

        if (!this.#showWhenLocated) {
            this.addTo(map);
        }

        if (this.#autoLocate) {
            // isLocating tells us whether something else already started the watch. Starting a
            // second one would leak the first.
            this.#startedLocating = !map.isLocating;
            map.locate(this.#locateOptions);
        }
        return this;
    }

    /**
     * Move the map to the last known location.
     *
     * This is what clicking the control does. It's public so that a page can put the same behaviour
     * on its own UI.
     *
     * @returns {LocationControl}
     */
    panToLocation(): LocationControl {
        const {map} = this;
        const position = this.#location?.latLng;
        if (!map || !position) {
            return this;
        }
        if (this.#action === 'center') {
            map.setCenter(position);
        } else {
            map.panTo(position);
        }
        if (isNumber(this.#zoom)) {
            map.zoom = this.#zoom;
        }
        return this;
    }

    /**
     * Take the control off the map, hide the marker and stop watching.
     *
     * A marker that was passed in is hidden rather than destroyed - it belongs to whoever made it.
     *
     * @returns {LocationControl}
     */
    remove(): LocationControl {
        this.#detach();
        if (this.#marker) {
            this.#marker.hide();
        }
        super.remove();
        return this;
    }

    /**
     * Stop watching and let go of the map.
     *
     * Taking the listener off matters as much as stopping the watch: a location found after the
     * control was removed used to run the handler anyway, and with the default showWhenLocated -
     * where the control isn't on the map until the first fix - that put a removed control back on
     * the map. Something else on the page locating is enough to trigger it.
     *
     * Call setMap() again to start watching a map after this.
     *
     * @private
     */
    #detach(): void {
        this.stop();
        if (this.#locationMap && this.#locationFoundListener) {
            this.#locationMap.off('locationfound', this.#locationFoundListener);
        }
        this.#locationMap = undefined;
        this.#locationFoundListener = undefined;
    }

    /**
     * Stop watching for the user's location, leaving the control and marker where they are.
     *
     * The watch is only stopped if this control was the one that started it, so that a control
     * being removed doesn't stop location updates the rest of the page is relying on.
     *
     * @returns {LocationControl}
     */
    stop(): LocationControl {
        if (this.#startedLocating) {
            // The stored map, not Control's. With the default showWhenLocated the control isn't on
            // a map until a location has been found, so Control's is undefined in exactly the case
            // where the watch most needs stopping.
            this.#locationMap?.stopLocate();
            this.#startedLocating = false;
        }
        return this;
    }

    /**
     * Handle a location being found
     *
     * @private
     * @param {Map} map The map the location was found on
     * @param {LocationPosition} position The position that was found
     */
    #handleLocationFound(map: Map, position: LocationPosition): void {
        const isFirst = !this.isLocated;
        this.#location = position;

        if (this.#marker) {
            // setPosition() rather than setPositionSync(). The sync version needs the Google Maps
            // library to have loaded already and throws if it hasn't, and a location fix can easily
            // arrive first - the page asks for the location as soon as it loads, while the Maps
            // script is still being fetched. This one waits for the library instead.
            //
            // Out-of-order fixes aren't a problem: each call records the position synchronously and
            // then writes whatever the latest one is to the Google marker.
            this.#marker.setPosition(position.latLng);
            if (isFirst) {
                this.#marker.show(map);
            }
        }

        if (isFirst) {
            if (this.#showWhenLocated && !this.isAttached) {
                this.addTo(map);
            }
            if (this.#centerOnFirstFind) {
                this.panToLocation();
            }
        }
        // Only the first fix moves the map. Later ones would yank it back while the user is panning.

        this.dispatch('located', { control: this, position });
    }

    /**
     * Work out the marker to use, if there is one
     *
     * @private
     * @param {boolean|Marker|MarkerOptions} [value] The marker option
     */
    #setUpMarker(value?: boolean | Marker | MarkerOptions): void {
        if (value === false) {
            return;
        }
        if (value instanceof Marker) {
            this.#marker = value;
            this.#ownsMarker = false;
            return;
        }
        const overrides: MarkerOptions = isObject(value) ? (value as MarkerOptions) : {};
        const options: MarkerOptions = { ...defaultMarkerOptions, ...overrides };

        // svgIcon is merged a level deeper than the rest. It is the one default made of parts, and
        // a plain overwrite would drop the path that draws the dot when someone sets only the
        // colour - leaving a marker with a colour and no shape.
        //
        // Only a plain options object is merged. A string is a whole SVG and an SvgSymbol is
        // already built, so either is taken as given.
        if (
            isObject(overrides.svgIcon) &&
            !(overrides.svgIcon instanceof SvgSymbol) &&
            isObject(defaultMarkerOptions.svgIcon)
        ) {
            options.svgIcon = {
                ...(defaultMarkerOptions.svgIcon as SvgSymbolOptions),
                ...(overrides.svgIcon as SvgSymbolOptions),
            };
        }
        this.#marker = markerFactory(options);
        this.#ownsMarker = true;
    }

    /**
     * Get whether the marker belongs to this control
     *
     * @returns {boolean}
     */
    get ownsMarker(): boolean {
        return this.#ownsMarker;
    }
}

export type LocationControlValue = LocationControl | LocationControlOptions;

/**
 * Helper function to set up a location control object
 *
 * @param {LocationControlValue} [value] The location control options or a LocationControl object
 * @returns {LocationControl}
 */
export const locationControl = (value?: LocationControlValue): LocationControl => {
    if (value instanceof LocationControl) {
        return value;
    }
    return new LocationControl(value);
};
