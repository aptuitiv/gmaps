/* ===========================================================================
    A lightweight stand-in for the library's Map class.

    Building a real Map needs a DOM element and the loader, which reaches for the actual
    Google Maps script. Markers and polylines only need a handful of things from a map, so
    this provides those and nothing else.

    How it satisfies `instanceof Map`:

    Marker.#setMap() and Polyline.setMap() both branch on `value instanceof Map`, so the
    double has to pass that check. It does NOT extend Map - that would run the real
    constructor. Instead its prototype is pointed at Map.prototype after the class is
    defined. That makes `instanceof` true while every method defined here shadows the real
    one, so none of Map's #private fields are ever touched.

    The trade-off is deliberate: if a test reaches a Map method that isn't defined here, it
    falls through to the real one and throws on a private field. That failure is useful - it
    says exactly which method needs adding, rather than silently doing the wrong thing.
=========================================================================== */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { Map as GmapsMap } from '../../src/lib/Map';

type Listener = (...args: any[]) => void;

export type FakeMapOptions = {
    // Whether the map reports itself as ready. Defaults to true.
    ready?: boolean;
    // The zoom level the map reports. Defaults to 10.
    zoom?: number;
    // Whether toGoogle() has a stand-in Google map to hand back. Defaults to true. Set it to
    // false to model a map that hasn't been initialized yet: the real Map only builds its
    // Google map object while it's being rendered, and test/Map.test.ts pins toGoogle() as
    // undefined before that. makeReady() builds it, the way initializing the real map does.
    googleMap?: boolean;
};

/**
 * A stand-in for the Map class
 */
export class FakeMap {
    /** Whether the map is ready */
    #isReady: boolean;

    /** The object handed back by toGoogle(). Undefined until the map has been initialized. */
    #google: Record<string, unknown> | undefined;

    /** Event listeners added through on() */
    #listeners: Record<string, Listener[]> = {};

    /** Callbacks waiting for the map to become ready */
    #readyCallbacks: Listener[] = [];

    /** The zoom level */
    #zoom: number;

    /** The element the map is drawn in, built the first time getDiv() is asked for it */
    #div: HTMLElement | undefined;

    /**
     * Constructor
     *
     * @param {FakeMapOptions} [options] The options
     */
    constructor(options: FakeMapOptions = {}) {
        this.#isReady = options.ready !== false;
        this.#zoom = typeof options.zoom === 'number' ? options.zoom : 10;
        this.#google = options.googleMap === false ? undefined : { __fakeGoogleMap: true };
    }

    /**
     * Get the zoom level
     *
     * @returns {number}
     */
    get zoom(): number {
        return this.#zoom;
    }

    /**
     * Set the zoom level
     *
     * @param {number} value The zoom level
     */
    set zoom(value: number) {
        this.#zoom = value;
    }

    /**
     * Whether the map is ready
     *
     * @returns {boolean}
     */
    getIsReady(): boolean {
        return this.#isReady;
    }

    /**
     * The element the map is drawn in.
     *
     * Overlay needs this for dragging and resizing - #handleResizeStart gives up without it -
     * and it measures the element with getBoundingClientRect(), which returns zeros in jsdom.
     * A test that cares about the geometry should replace that on the element this returns.
     *
     * The element is built on first use rather than in the constructor because most test files
     * run without a DOM, and building it up front would break them.
     *
     * @returns {HTMLElement}
     */
    getDiv(): HTMLElement {
        if (!this.#div) {
            this.#div = document.createElement('div');
        }
        return this.#div;
    }

    /**
     * The stand-in for the Google map object
     *
     * @returns {object|undefined}
     */
    toGoogle(): Record<string, unknown> | undefined {
        return this.#google;
    }

    /**
     * Initialize the map
     *
     * @returns {Promise<FakeMap>}
     */
    init(): Promise<FakeMap> {
        return Promise.resolve(this);
    }

    /**
     * Call back when the map is ready, immediately if it already is
     *
     * @param {Listener} callback The callback
     */
    onReady(callback: Listener): void {
        if (this.#isReady) {
            callback({ type: 'ready' });
        } else {
            this.#readyCallbacks.push(callback);
        }
    }

    /**
     * Make a map that started out not ready become ready, and flush the waiting callbacks.
     *
     * This is how a test simulates a map whose element was hidden when objects were added to it.
     */
    makeReady(): void {
        this.#isReady = true;
        // Initializing the real map is what builds its Google map object, so a map that was
        // made with googleMap: false gets one here.
        this.#google ??= { __fakeGoogleMap: true };
        const callbacks = this.#readyCallbacks;
        this.#readyCallbacks = [];
        callbacks.forEach((callback) => callback({ type: 'ready' }));
    }

    /**
     * How many callbacks are waiting for the map to be ready.
     *
     * Used to show how many objects each register their own wait (M-5).
     *
     * @returns {number}
     */
    readyCallbackCount(): number {
        return this.#readyCallbacks.length;
    }

    /**
     * Add an event listener
     *
     * @param {string} type The event type
     * @param {Listener} callback The callback
     */
    on(type: string, callback: Listener): void {
        if (!this.#listeners[type]) {
            this.#listeners[type] = [];
        }
        this.#listeners[type].push(callback);
    }

    /**
     * Remove an event listener, or every listener for the type when no callback is given
     *
     * @param {string} type The event type
     * @param {Listener} [callback] The callback
     */
    off(type: string, callback?: Listener): void {
        if (!this.#listeners[type]) {
            return;
        }
        if (callback) {
            this.#listeners[type] = this.#listeners[type].filter((fn) => fn !== callback);
        } else {
            this.#listeners[type] = [];
        }
    }

    /**
     * Fire an event
     *
     * @param {string} type The event type
     * @param {any} [data] The event data
     */
    dispatch(type: string, data?: any): void {
        (this.#listeners[type] || []).slice().forEach((fn) => fn(data ?? { type }));
    }

    /**
     * How many listeners are registered for an event type.
     *
     * Used to show that each polyline registers its own "idle" listener (L-5).
     *
     * @param {string} type The event type
     * @returns {number}
     */
    listenerCount(type: string): number {
        return this.#listeners[type] ? this.#listeners[type].length : 0;
    }

    /**
     * Change the zoom level and fire "idle", the way the real map does once it stops moving
     *
     * @param {number} zoom The new zoom level
     */
    zoomTo(zoom: number): void {
        this.#zoom = zoom;
        this.dispatch('idle');
    }
}

// Make `fakeMap() instanceof Map` true without running Map's constructor.
Object.setPrototypeOf(FakeMap.prototype, GmapsMap.prototype);

/**
 * Build a stand-in map, typed as the real Map so it can be passed straight to setMap()
 *
 * @param {FakeMapOptions} [options] The options
 * @returns {GmapsMap}
 */
export const fakeMap = (options?: FakeMapOptions): GmapsMap => new FakeMap(options) as unknown as GmapsMap;

/**
 * Get the FakeMap behind a map that was handed to the library
 *
 * @param {GmapsMap} map The map
 * @returns {FakeMap}
 */
export const asFakeMap = (map: GmapsMap): FakeMap => map as unknown as FakeMap;
