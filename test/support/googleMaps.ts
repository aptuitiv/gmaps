/* ===========================================================================
    An instrumented stand-in for the Google Maps Javascript API.

    The library reads `google` as a bare global, so this sets globalThis.google.
    Install it in beforeEach() and remove it in afterEach().

    Every constructor and every method that matters records what it was called with, so
    that tests can assert things like "no google.maps.Polyline was constructed" or
    "setPath was not called". Most of the performance work in ai-plans/active is about
    *not* doing something, and that is what this records.

    !! IMPORTANT !!
    This CANNOT measure performance. Every class here is trivial, so setMap(), setPath()
    and drawing all cost effectively nothing. A green test proves work was avoided. It
    does not prove anything got faster. Speed is measured in a real browser and on a real
    device - see section 10 of ai-plans/active/performance-improvements.md.
=========================================================================== */

/* eslint-disable @typescript-eslint/no-explicit-any */

type CallRecord = { target: string; method: string; args: any[] };

/**
 * Records what the stub was asked to do.
 */
class MapsStats {
    /** How many of each class were constructed, keyed by class name */
    constructed: Record<string, number> = {};

    /** Every recorded method call, in order */
    calls: CallRecord[] = [];

    /**
     * Forget everything. Call this between tests.
     */
    reset(): void {
        this.constructed = {};
        this.calls = [];
    }

    /**
     * Record that a class was constructed
     *
     * @param {string} name The class name
     */
    construct(name: string): void {
        this.constructed[name] = (this.constructed[name] ?? 0) + 1;
    }

    /**
     * Record a method call
     *
     * @param {string} target The class name
     * @param {string} method The method name
     * @param {any[]} args The arguments
     */
    call(target: string, method: string, args: any[]): void {
        this.calls.push({ target, method, args });
    }

    /**
     * How many of the given class were constructed
     *
     * @param {string} name The class name
     * @returns {number}
     */
    countOf(name: string): number {
        return this.constructed[name] ?? 0;
    }

    /**
     * The calls made to the given class and method
     *
     * @param {string} target The class name
     * @param {string} [method] The method name. All methods for the class if not set.
     * @returns {CallRecord[]}
     */
    callsTo(target: string, method?: string): CallRecord[] {
        return this.calls.filter((c) => c.target === target && (typeof method === 'undefined' || c.method === method));
    }
}

export const mapsStats = new MapsStats();

/**
 * The base class that Google's map objects extend. The library uses `instanceof` against
 * this to decide whether events can be attached, so it has to be a real class.
 */
class MVCObject {
    /** Listeners added through addListener(), keyed by event type */
    __listeners: Record<string, ((...args: any[]) => void)[]> = {};

    /** The values set through set() */
    __values: Record<string, any> = {};

    /**
     * The name to record calls under.
     *
     * recorded() builds anonymous class expressions, so their `.name` is not the class name
     * we want in the stats. Each recorded class sets this so that addListener() and friends
     * are filed under the right key.
     */
    __recordedName: string = '';

    /**
     * Add an event listener
     *
     * @param {string} type The event type
     * @param {Function} fn The listener
     * @returns {object} A handle with a remove() method, like Google's
     */
    addListener(type: string, fn: (...args: any[]) => void): { remove: () => void } {
        mapsStats.call(this.__recordedName || this.constructor.name, 'addListener', [type]);
        if (!this.__listeners[type]) {
            this.__listeners[type] = [];
        }
        this.__listeners[type].push(fn);
        return {
            remove: () => {
                this.__listeners[type] = (this.__listeners[type] || []).filter((f) => f !== fn);
            },
        };
    }

    /**
     * Set a value
     *
     * @param {string} key The key
     * @param {any} value The value
     */
    set(key: string, value: any): void {
        this.__values[key] = value;
    }

    /**
     * Get a value
     *
     * @param {string} key The key
     * @returns {any}
     */
    get(key: string): any {
        return this.__values[key];
    }

    /**
     * Fire the listeners for an event type
     *
     * @param {string} type The event type
     * @param {any} [data] The event data
     */
    __fire(type: string, data?: any): void {
        (this.__listeners[type] || []).slice().forEach((fn) => fn(data));
    }
}

/**
 * Make a class that records how many times it was constructed.
 *
 * @param {string} name The class name to record under
 * @returns {any} The class
 */
const recorded = (name: string) =>
    class extends MVCObject {
        constructor(...args: any[]) {
            super();
            // So that inherited methods like addListener() are recorded under this class's
            // name rather than the empty name of this anonymous class expression.
            this.__recordedName = name;
            mapsStats.construct(name);
            mapsStats.call(name, 'constructor', args);
            if (args[0]) {
                this.__values = { ...args[0] };
            }
        }

        /**
         * Record and store an options change
         *
         * @param {object} options The options
         */
        setOptions(options: any): void {
            mapsStats.call(name, 'setOptions', [options]);
            this.__values = { ...this.__values, ...options };
        }

        /**
         * Record and store the map
         *
         * @param {any} map The map or null
         */
        setMap(map: any): void {
            mapsStats.call(name, 'setMap', [map]);
            this.__values.map = map;
        }

        /**
         * Get the map
         *
         * @returns {any}
         */
        getMap(): any {
            return this.__values.map ?? null;
        }

        /**
         * Record and store the position
         *
         * @param {any} position The position
         */
        setPosition(position: any): void {
            mapsStats.call(name, 'setPosition', [position]);
            this.__values.position = position;
        }

        /**
         * Get the position
         *
         * @returns {any}
         */
        getPosition(): any {
            return this.__values.position ?? null;
        }

        /**
         * Record and store the path. This is the expensive call on a real polyline.
         *
         * @param {any} path The path
         */
        setPath(path: any): void {
            mapsStats.call(name, 'setPath', [path]);
            this.__values.path = path;
        }

        /**
         * Get the path
         *
         * @returns {any}
         */
        getPath(): any {
            return this.__values.path ?? null;
        }

        /**
         * Record and store the title
         *
         * @param {any} title The title
         */
        setTitle(title: any): void {
            mapsStats.call(name, 'setTitle', [title]);
            this.__values.title = title;
        }

        /**
         * Record and store the label
         *
         * @param {any} label The label
         */
        setLabel(label: any): void {
            mapsStats.call(name, 'setLabel', [label]);
            this.__values.label = label;
        }

        /**
         * Record and store the icon
         *
         * @param {any} icon The icon
         */
        setIcon(icon: any): void {
            mapsStats.call(name, 'setIcon', [icon]);
            this.__values.icon = icon;
        }

        /**
         * Record and store the cursor
         *
         * @param {any} cursor The cursor
         */
        setCursor(cursor: any): void {
            mapsStats.call(name, 'setCursor', [cursor]);
            this.__values.cursor = cursor;
        }

        /**
         * Record and store whether it is draggable
         *
         * @param {any} value Whether it is draggable
         */
        setDraggable(value: any): void {
            mapsStats.call(name, 'setDraggable', [value]);
            this.__values.draggable = value;
        }

        /**
         * Record and store whether it is visible
         *
         * @param {any} value Whether it is visible
         */
        setVisible(value: any): void {
            mapsStats.call(name, 'setVisible', [value]);
            this.__values.visible = value;
        }
    };

/**
 * A latitude/longitude pair
 */
class LatLngStub {
    #lat: number;

    #lng: number;

    /**
     * Constructor
     *
     * @param {number|object} lat The latitude, or a literal
     * @param {number} [lng] The longitude
     */
    constructor(lat: number | { lat: number; lng: number }, lng?: number) {
        mapsStats.construct('LatLng');
        if (typeof lat === 'object' && lat !== null) {
            this.#lat = Number(lat.lat);
            this.#lng = Number(lat.lng);
        } else {
            this.#lat = Number(lat);
            this.#lng = Number(lng);
        }
    }

    /**
     * The latitude
     *
     * @returns {number}
     */
    lat(): number {
        return this.#lat;
    }

    /**
     * The longitude
     *
     * @returns {number}
     */
    lng(): number {
        return this.#lng;
    }

    /**
     * Whether this equals another pair
     *
     * @param {LatLngStub} other The other pair
     * @returns {boolean}
     */
    equals(other: LatLngStub): boolean {
        return !!other && this.#lat === other.lat() && this.#lng === other.lng();
    }

    /**
     * As a literal
     *
     * @returns {object}
     */
    toJSON(): { lat: number; lng: number } {
        return { lat: this.#lat, lng: this.#lng };
    }
}

/**
 * A bounding box
 */
class LatLngBoundsStub {
    #ne: LatLngStub | undefined;

    #sw: LatLngStub | undefined;

    /**
     * Constructor
     *
     * @param {LatLngStub} [sw] The south west corner
     * @param {LatLngStub} [ne] The north east corner
     */
    constructor(sw?: LatLngStub, ne?: LatLngStub) {
        mapsStats.construct('LatLngBounds');
        this.#sw = sw;
        this.#ne = ne;
    }

    /**
     * Grow the bounds to include a point.
     *
     * Google's extend() takes either a LatLng, which has lat()/lng() methods, or a plain
     * {lat, lng} literal. Both shapes have to be handled here: LatLngBounds holds its points
     * as literals in #boundValues and replays them through extend() when it builds the Google
     * object, so the literal form is the one the library actually uses most.
     *
     * @param {LatLngStub|object} value The point, as a LatLng or a {lat, lng} literal
     * @returns {LatLngBoundsStub}
     */
    extend(value: LatLngStub | { lat: number; lng: number }): LatLngBoundsStub {
        mapsStats.call('LatLngBounds', 'extend', [value]);
        const source = value as { lat: unknown; lng: unknown };
        const lat = typeof source.lat === 'function' ? (value as LatLngStub).lat() : Number(source.lat);
        const lng = typeof source.lng === 'function' ? (value as LatLngStub).lng() : Number(source.lng);
        if (!this.#sw || !this.#ne) {
            this.#sw = new LatLngStub(lat, lng);
            this.#ne = new LatLngStub(lat, lng);
        } else {
            this.#sw = new LatLngStub(Math.min(this.#sw.lat(), lat), Math.min(this.#sw.lng(), lng));
            this.#ne = new LatLngStub(Math.max(this.#ne.lat(), lat), Math.max(this.#ne.lng(), lng));
        }
        return this;
    }

    /**
     * The north east corner
     *
     * @returns {LatLngStub|undefined}
     */
    getNorthEast(): LatLngStub | undefined {
        return this.#ne;
    }

    /**
     * The south west corner
     *
     * @returns {LatLngStub|undefined}
     */
    getSouthWest(): LatLngStub | undefined {
        return this.#sw;
    }

    /**
     * Whether the bounds has no points
     *
     * @returns {boolean}
     */
    isEmpty(): boolean {
        return !this.#sw || !this.#ne;
    }
}

/**
 * A pixel coordinate
 */
class PointStub {
    x: number;

    y: number;

    /**
     * Constructor
     *
     * @param {number} x The x value
     * @param {number} y The y value
     */
    constructor(x: number, y: number) {
        mapsStats.construct('Point');
        this.x = x;
        this.y = y;
    }
}

/**
 * A width and height
 */
class SizeStub {
    width: number;

    height: number;

    /**
     * Constructor
     *
     * @param {number} width The width
     * @param {number} height The height
     */
    constructor(width: number, height: number) {
        mapsStats.construct('Size');
        this.width = width;
        this.height = height;
    }
}

/**
 * The google.maps.event namespace
 */
const event = {
    /**
     * Add a listener
     *
     * @param {any} instance The object
     * @param {string} type The event type
     * @param {Function} fn The listener
     * @returns {object}
     */
    addListener(instance: any, type: string, fn: (...args: any[]) => void) {
        return instance.addListener(type, fn);
    },

    /**
     * Remove every listener of a type from an object.
     *
     * Note for anyone reading: this removes ALL listeners of the type, including ones this
     * library did not add. That is the behavior described in section 6.1 of the plan.
     *
     * @param {any} instance The object
     * @param {string} type The event type
     */
    clearListeners(instance: any, type: string): void {
        mapsStats.call('event', 'clearListeners', [type]);
        if (instance && instance.__listeners) {
            instance.__listeners[type] = [];
        }
    },

    /**
     * Remove every listener from an object
     *
     * @param {any} instance The object
     */
    clearInstanceListeners(instance: any): void {
        mapsStats.call('event', 'clearInstanceListeners', []);
        if (instance && instance.__listeners) {
            instance.__listeners = {};
        }
    },

    /**
     * Whether the object has any listeners of a type
     *
     * @param {any} instance The object
     * @param {string} type The event type
     * @returns {boolean}
     */
    hasListeners(instance: any, type: string): boolean {
        return !!(instance && instance.__listeners && instance.__listeners[type] && instance.__listeners[type].length);
    },

    /**
     * Fire an event
     *
     * @param {any} instance The object
     * @param {string} type The event type
     * @param {any} [data] The event data
     */
    trigger(instance: any, type: string, data?: any): void {
        if (instance && typeof instance.__fire === 'function') {
            instance.__fire(type, data);
        }
    },
};

/**
 * Build the google.maps object
 *
 * @returns {any}
 */
const buildMaps = () => ({
    LatLng: LatLngStub,
    LatLngBounds: LatLngBoundsStub,
    Point: PointStub,
    Size: SizeStub,
    MVCObject,
    Map: recorded('Map'),
    Marker: recorded('Marker'),
    Polyline: recorded('Polyline'),
    Polygon: recorded('Polygon'),
    InfoWindow: recorded('InfoWindow'),
    OverlayView: class OverlayView extends MVCObject {
        constructor(...args: any[]) {
            super();
            // Recorded so that tests can assert how many overlay views were built. Note that
            // getOverlayViewClass() declares a NEW subclass per overlay (O-4), so each of these
            // is an instance of a different class.
            mapsStats.construct('OverlayView');
            mapsStats.call('OverlayView', 'constructor', args);
        }

        static preventMapHitsAndGesturesFrom(): void {
            // Nothing to do in the stub
        }

        /**
         * Record and store the map
         *
         * @param {any} map The map or null
         */
        setMap(map: any): void {
            mapsStats.call('OverlayView', 'setMap', [map]);
            this.__values.map = map;
        }
    },
    event,
    // The places library. checkForGoogleMaps('PlacesSearchBox', 'places') looks for this key,
    // so it has to exist for the search box classes to get past their library check.
    // Note: getPlaces() is not provided, because it is only called from inside the
    // places_changed listener, which these tests never fire.
    places: {
        SearchBox: recorded('SearchBox'),
        Autocomplete: recorded('Autocomplete'),
    },
    SymbolPath: {
        BACKWARD_CLOSED_ARROW: 3,
        BACKWARD_OPEN_ARROW: 4,
        CIRCLE: 0,
        FORWARD_CLOSED_ARROW: 1,
        FORWARD_OPEN_ARROW: 2,
    },
    MapTypeId: {
        HYBRID: 'hybrid',
        ROADMAP: 'roadmap',
        SATELLITE: 'satellite',
        TERRAIN: 'terrain',
    },
    ControlPosition: {
        BLOCK_START_INLINE_START: 1,
        BLOCK_END_INLINE_END: 2,
    },
});

/**
 * Put the stub on globalThis so that the library's `google` references resolve.
 *
 * @returns {any} The google.maps object, so that tests can reach into it
 */
export const installGoogleMaps = () => {
    mapsStats.reset();
    const maps = buildMaps();
    (globalThis as any).google = { maps };
    return maps;
};

/**
 * Remove the stub.
 *
 * Use this to test what the library does when the Google Maps library has not loaded.
 */
export const uninstallGoogleMaps = (): void => {
    delete (globalThis as any).google;
};
