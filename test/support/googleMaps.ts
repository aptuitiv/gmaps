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
 * Read the latitude from either shape a corner can be in.
 *
 * A corner can be a LatLngStub, which has lat() and lng() methods, or a plain {lat, lng}
 * literal, because the constructor stores whatever it was handed and extend() accepts both.
 * Reading it the wrong way gives "lat is not a function" rather than a number.
 *
 * @param {any} value The corner
 * @returns {number}
 */
const latOf = (value: any): number => (typeof value.lat === 'function' ? value.lat() : Number(value.lat));

/**
 * Read the longitude from either shape a corner can be in
 *
 * @param {any} value The corner
 * @returns {number}
 */
const lngOf = (value: any): number => (typeof value.lng === 'function' ? value.lng() : Number(value.lng));

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

    /**
     * The middle of the bounds.
     *
     * Google answers for an empty bounds rather than complaining about it, and so does this.
     * That difference is the point: the library throws for an empty bounds when it works the
     * corners out itself, so without this the two paths couldn't be compared.
     *
     * @returns {LatLngStub}
     */
    getCenter(): LatLngStub {
        if (!this.#sw || !this.#ne) {
            return new LatLngStub(0, 0);
        }
        return new LatLngStub(
            (latOf(this.#sw) + latOf(this.#ne)) / 2,
            (lngOf(this.#sw) + lngOf(this.#ne)) / 2,
        );
    }

    /**
     * The bounds as a literal, using the compass names that Google uses
     *
     * @returns {object}
     */
    toJSON(): { east: number; north: number; south: number; west: number } {
        if (!this.#sw || !this.#ne) {
            return { east: 0, north: 0, south: 0, west: 0 };
        }
        return {
            east: lngOf(this.#ne),
            north: latOf(this.#ne),
            south: latOf(this.#sw),
            west: lngOf(this.#sw),
        };
    }

    /**
     * The bounds as a string
     *
     * @returns {string}
     */
    toString(): string {
        if (!this.#sw || !this.#ne) {
            return '((0, 0), (0, 0))';
        }
        return `((${latOf(this.#sw)}, ${lngOf(this.#sw)}), (${latOf(this.#ne)}, ${lngOf(this.#ne)}))`;
    }

    /**
     * The bounds as a string for a url
     *
     * @param {number} [precision] How many decimal places to use
     * @returns {string}
     */
    toUrlValue(precision?: number): string {
        const prec = typeof precision === 'number' ? precision : 6;
        if (!this.#sw || !this.#ne) {
            return `${(0).toFixed(prec)},${(0).toFixed(prec)},${(0).toFixed(prec)},${(0).toFixed(prec)}`;
        }
        return `${latOf(this.#sw).toFixed(prec)},${lngOf(this.#sw).toFixed(prec)},${latOf(this.#ne).toFixed(
            prec,
        )},${lngOf(this.#ne).toFixed(prec)}`;
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
 * A feature in the data layer.
 *
 * DataFeature wraps one of these, so it needs the property and geometry methods rather than
 * just recording that it was constructed.
 */
class DataFeatureStub {
    #geometry: any;

    #id: string | number | undefined;

    #properties: Record<string, any> = {};

    /**
     * Constructor
     *
     * @param {object} [options] The feature options - geometry, id and properties
     */
    constructor(options?: any) {
        mapsStats.construct('Data.Feature');
        mapsStats.call('Data.Feature', 'constructor', [options]);
        this.#geometry = options?.geometry;
        this.#id = options?.id;
        this.#properties = { ...(options?.properties ?? {}) };
    }

    /**
     * The feature id
     *
     * @returns {string|number|undefined}
     */
    getId(): string | number | undefined {
        return this.#id;
    }

    /**
     * The geometry object
     *
     * @returns {any}
     */
    getGeometry(): any {
        return this.#geometry ?? null;
    }

    /**
     * Get one property
     *
     * @param {string} key The property name
     * @returns {any}
     */
    getProperty(key: string): any {
        return this.#properties[key];
    }

    /**
     * Set one property
     *
     * @param {string} key The property name
     * @param {any} value The value
     */
    setProperty(key: string, value: any): void {
        this.#properties[key] = value;
    }

    /**
     * Remove one property
     *
     * @param {string} key The property name
     */
    removeProperty(key: string): void {
        delete this.#properties[key];
    }

    /**
     * Walk every property
     *
     * @param {Function} fn Called with the value and the name
     */
    forEachProperty(fn: (value: any, name: string) => void): void {
        Object.keys(this.#properties).forEach((name) => fn(this.#properties[name], name));
    }
}

/**
 * The google.maps.Data layer.
 *
 * This extends MVCObject because DataLayer hands it to setEventGoogleObject(), which needs a
 * real Google map object to attach listeners to.
 *
 * The geometry classes hang off this as statics, the way Google's do, so that the library's
 * `new google.maps.Data.LineString(...)` resolves. They record their constructor arguments,
 * which is what the D-2 tests read to check whether Google was handed LatLng objects or plain
 * {lat, lng} literals.
 */
class DataStub extends MVCObject {
    static Point = recorded('Data.Point');

    static LineString = recorded('Data.LineString');

    static LinearRing = recorded('Data.LinearRing');

    static Polygon = recorded('Data.Polygon');

    static Feature = DataFeatureStub;

    /** The features that have been added */
    __features: DataFeatureStub[] = [];

    /**
     * Constructor
     *
     * @param {object} [options] The data layer options
     */
    constructor(options?: any) {
        super();
        this.__recordedName = 'Data';
        mapsStats.construct('Data');
        mapsStats.call('Data', 'constructor', [options]);
    }

    /**
     * Add a feature
     *
     * @param {object} featureOptions The feature options
     * @returns {DataFeatureStub}
     */
    add(featureOptions: any): DataFeatureStub {
        mapsStats.call('Data', 'add', [featureOptions]);
        const feature = new DataFeatureStub(featureOptions);
        this.__features.push(feature);
        return feature;
    }

    /**
     * Remove a feature
     *
     * @param {DataFeatureStub} feature The feature
     */
    remove(feature: DataFeatureStub): void {
        mapsStats.call('Data', 'remove', [feature]);
        this.__features = this.__features.filter((f) => f !== feature);
    }

    /**
     * Whether the layer holds a feature
     *
     * @param {DataFeatureStub} feature The feature
     * @returns {boolean}
     */
    contains(feature: DataFeatureStub): boolean {
        return this.__features.includes(feature);
    }

    /**
     * Walk every feature
     *
     * @param {Function} fn Called with each feature
     */
    forEach(fn: (feature: DataFeatureStub) => void): void {
        this.__features.slice().forEach(fn);
    }

    /**
     * Find a feature by its id
     *
     * @param {string|number} id The feature id
     * @returns {DataFeatureStub|undefined}
     */
    getFeatureById(id: string | number): DataFeatureStub | undefined {
        return this.__features.find((f) => f.getId() === id);
    }

    /**
     * Record and store the map
     *
     * @param {any} map The map or null
     */
    setMap(map: any): void {
        mapsStats.call('Data', 'setMap', [map]);
        this.__values.map = map;
    }

    /**
     * Record the style
     *
     * @param {any} style The style, a function, or null
     */
    setStyle(style: any): void {
        mapsStats.call('Data', 'setStyle', [style]);
    }

    /**
     * Record a style override for one feature
     *
     * @param {DataFeatureStub} feature The feature
     * @param {any} style The style
     */
    overrideStyle(feature: DataFeatureStub, style: any): void {
        mapsStats.call('Data', 'overrideStyle', [feature, style]);
    }

    /**
     * Record reverting the style
     *
     * @param {DataFeatureStub} [feature] The feature, or every feature when not set
     */
    revertStyle(feature?: DataFeatureStub): void {
        mapsStats.call('Data', 'revertStyle', [feature]);
    }

    /**
     * Add GeoJson. The stub does not parse it, so no features are produced.
     *
     * @param {object} geoJson The GeoJson
     * @param {any} [options] The options
     * @returns {DataFeatureStub[]}
     */
    addGeoJson(geoJson: any, options?: any): DataFeatureStub[] {
        mapsStats.call('Data', 'addGeoJson', [geoJson, options]);
        return [];
    }

    /**
     * Load GeoJson from a url. The stub does not fetch, so it calls back with no features.
     *
     * @param {string} url The url
     * @param {any} options The options
     * @param {Function} [callback] Called with the features
     */
    loadGeoJson(url: string, options: any, callback?: (features: DataFeatureStub[]) => void): void {
        mapsStats.call('Data', 'loadGeoJson', [url, options]);
        if (typeof callback === 'function') {
            callback([]);
        }
    }

    /**
     * Hand back an empty feature collection
     *
     * @param {Function} callback Called with the GeoJson
     */
    toGeoJson(callback: (geoJson: any) => void): void {
        mapsStats.call('Data', 'toGeoJson', []);
        callback({ type: 'FeatureCollection', features: [] });
    }
}

/**
 * What the stub Geocoder answers with. Replaced by tests with setGeocoderHandler().
 *
 * The default answers one result for anything, so that a test that only cares about how many
 * calls were made doesn't have to set one up.
 */
const defaultGeocoderHandler = (): { results?: any[]; status: string } => ({
    results: [{ formatted_address: 'Somewhere', address_components: [], geometry: {}, place_id: 'test' }],
    status: 'OK',
});

let geocoderHandler: (request: any) => { results?: any[]; status: string } = defaultGeocoderHandler;

/**
 * Decide what the stub Geocoder answers with.
 *
 * @param {Function} fn Called with the request, returns { results, status }
 */
export const setGeocoderHandler = (fn: (request: any) => { results?: any[]; status: string }): void => {
    geocoderHandler = fn;
};

/**
 * The geocoding service.
 *
 * geocode() answers on a microtask rather than synchronously, because Google's is asynchronous
 * and because two identical requests made before the first answers is exactly the case the
 * in-flight dedupe has to handle.
 */
class GeocoderStub {
    /**
     * Constructor
     */
    constructor() {
        mapsStats.construct('Geocoder');
    }

    /**
     * Run a geocode request
     *
     * @param {object} request The request
     * @param {Function} callback Called with the results and the status
     */
    geocode(request: any, callback: (results: any[] | null, status: string) => void): void {
        mapsStats.call('Geocoder', 'geocode', [request]);
        const answer = geocoderHandler(request);
        Promise.resolve().then(() => {
            callback(answer.results ?? null, answer.status);
        });
    }
}

/**
 * How many pixels the stand-in projection puts in one degree.
 *
 * Exported so that a test can work out the pixels it expects from a latitude and longitude, or
 * the other way round, instead of copying a magic number.
 */
export const PIXELS_PER_DEGREE = 10;

/**
 * A stand-in for google.maps.MapCanvasProjection.
 *
 * The mapping is linear and has no notion of the map's centre or zoom: x is longitude times
 * PIXELS_PER_DEGREE, and y is latitude times the same, negated so that moving up the screen
 * increases the latitude the way it does on a real map. That makes every conversion reversible,
 * which is what lets a test assert on the numbers that come back.
 *
 * Container pixels and div pixels are the same thing here. Google distinguishes them, but
 * nothing in this library depends on the difference.
 */
const fakeProjection = {
    /**
     * Convert a latitude/longitude to a pixel position
     *
     * @param {any} latLngValue The Google LatLng object
     * @returns {object} The pixel position
     */
    fromLatLngToContainerPixel(latLngValue: any) {
        return new PointStub(latLngValue.lng() * PIXELS_PER_DEGREE, -latLngValue.lat() * PIXELS_PER_DEGREE);
    },

    /**
     * Convert a pixel position to a latitude/longitude
     *
     * @param {any} pixel The Google Point object
     * @returns {object} The latitude/longitude
     */
    fromContainerPixelToLatLng(pixel: any) {
        return new LatLngStub(-pixel.y / PIXELS_PER_DEGREE, pixel.x / PIXELS_PER_DEGREE);
    },

    /**
     * Convert a latitude/longitude to a pixel position within the map div
     *
     * @param {any} latLngValue The Google LatLng object
     * @returns {object} The pixel position
     */
    fromLatLngToDivPixel(latLngValue: any) {
        return new PointStub(latLngValue.lng() * PIXELS_PER_DEGREE, -latLngValue.lat() * PIXELS_PER_DEGREE);
    },

    /**
     * Convert a pixel position within the map div to a latitude/longitude
     *
     * @param {any} pixel The Google Point object
     * @returns {object} The latitude/longitude
     */
    fromDivPixelToLatLng(pixel: any) {
        return new LatLngStub(-pixel.y / PIXELS_PER_DEGREE, pixel.x / PIXELS_PER_DEGREE);
    },
};

/**
 * A stand-in for google.maps.marker.AdvancedMarkerElement.
 *
 * Only the four things the real one actually has are here - map, position, title and
 * gmpClickable are plain properties on it, not setters. AdvancedMarker.ts has commented-out
 * calls to setIcon(), setLabel(), setCursor() and setOptions(), each marked with a "@todo",
 * which are left over from it being a copy of Marker.ts. Those methods don't exist on the real
 * AdvancedMarkerElement, so they're deliberately not provided here either: if one of those
 * todos is ever uncommented, the tests should fail rather than pass against an invented API.
 *
 * It's a real class so that the instanceof check in Evented.#isGoogleObjectSet() succeeds and
 * events get wired up the way they do for other objects.
 */
class AdvancedMarkerElementStub {
    map: any = null;

    position: any = null;

    title: string = '';

    gmpClickable: boolean | undefined;

    /** Listeners added through addListener(), keyed by event type */
    __listeners: Record<string, ((...args: any[]) => void)[]> = {};

    /**
     * Constructor
     *
     * @param {object} [options] The options the marker was built with
     */
    constructor(options?: any) {
        mapsStats.construct('AdvancedMarkerElement');
        mapsStats.call('AdvancedMarkerElement', 'constructor', [options]);
        if (options) {
            if (typeof options.map !== 'undefined') {
                this.map = options.map;
            }
            if (typeof options.position !== 'undefined') {
                this.position = options.position;
            }
            if (typeof options.title !== 'undefined') {
                this.title = options.title;
            }
            if (typeof options.gmpClickable !== 'undefined') {
                this.gmpClickable = options.gmpClickable;
            }
        }
    }

    /**
     * Add an event listener
     *
     * @param {string} type The event type
     * @param {Function} fn The listener
     * @returns {object} A handle with a remove() method, like Google's
     */
    addListener(type: string, fn: (...args: any[]) => void): { remove: () => void } {
        mapsStats.call('AdvancedMarkerElement', 'addListener', [type]);
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
    // A stand-in for google.maps.MapCanvasProjection.
    //
    // Overlay reaches this through getProjection(), and without it the whole of #handleResize
    // is skipped (Overlay.ts:1080) - so a resize test would pass without running any of the
    // code it claims to test. The mapping is deliberately trivial and linear so that a test can
    // work out what it expects: one degree of latitude or longitude is PIXELS_PER_DEGREE pixels,
    // latitude increases upwards and longitude to the right, both measured from the map's
    // top-left corner.
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
         * The projection that converts between pixels and latitude/longitude.
         *
         * Returned for every overlay view, so that the drag and resize code that asks for one
         * finds it. Google only has a projection once the overlay has been drawn; the stub
         * doesn't model that, because every test that wants a projection wants it straight away.
         *
         * @returns {object} A stand-in for google.maps.MapCanvasProjection
         */
        getProjection(): any {
            return fakeProjection;
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
    // The advanced marker library. AdvancedMarker passes "marker" as its library name, so
    // checkForGoogleMaps('Marker', 'marker', false) looks for this key.
    marker: {
        AdvancedMarkerElement: AdvancedMarkerElementStub,
    },
    // The geocoding service. checkForGoogleMaps('Geocoder', 'Geocoder', false) looks for this key.
    Geocoder: GeocoderStub,
    GeocoderStatus: {
        ERROR: 'ERROR',
        INVALID_REQUEST: 'INVALID_REQUEST',
        OK: 'OK',
        OVER_QUERY_LIMIT: 'OVER_QUERY_LIMIT',
        REQUEST_DENIED: 'REQUEST_DENIED',
        UNKNOWN_ERROR: 'UNKNOWN_ERROR',
        ZERO_RESULTS: 'ZERO_RESULTS',
    },
    // The data layer. checkForGoogleMaps('DataLayer', 'Data', false) looks for this key, and
    // finding it is what lets DataLayer build its Data object without waiting on the loader.
    Data: DataStub,
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
    // Otherwise a handler set by one test answers the next one's requests
    geocoderHandler = defaultGeocoderHandler;
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
