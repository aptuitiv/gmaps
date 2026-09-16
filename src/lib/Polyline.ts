/* ===========================================================================
    Enables building a polyline on a Google map.

    https://developers.google.com/maps/documentation/javascript/shapes
    https://developers.google.com/maps/documentation/javascript/reference/polygon#Polyline
=========================================================================== */

/* global google */

/* eslint-disable @typescript-eslint/no-explicit-any -- Custom data could be anything within an obect */

import { PolylineEvents } from './constants';
import { EventCallback, EventConfig, EventListenerData, EventListenerOptions } from './Evented';
import { latLng, LatLng, LatLngValue } from './LatLng';
import Layer from './Layer';
import { loader } from './Loader';
import { Map } from './Map';
import { polylineIcon, PolylineIcon, PolylineIconValue } from './PolylineIcon';
import { coordsFromPath, DEFAULT_SIMPLIFY_TOLERANCE, DEFAULT_SIMPLIFY_ZOOM, simplifyCoords } from './simplifyPath';
import { svgSymbol } from './SvgSymbol';
import { TooltipValue } from './Tooltip';
import {
    checkForGoogleMaps,
    getSizeWithUnit,
    isBoolean,
    isDefined,
    isNullOrUndefined,
    isNumber,
    isNumberOrNumberString,
    isNumberString,
    isObject,
    isObjectWithValues,
    isStringWithValue,
    objectHasValue,
} from './helpers';

// Google Maps library polyline events
type PolylineEvent =
    | 'click'
    | 'contextmenu'
    | 'dblclick'
    | 'drag'
    | 'dragend'
    | 'dragstart'
    | 'mousedown'
    | 'mousemove'
    | 'mouseout'
    | 'mouseover'
    | 'mouseup'
    | 'ready';

// Custom data to attach to the polyline object
type CustomData = {
    [key: string]: any;
};

// The options for simplifying the path that is drawn on the map
export type PolylineSimplifyOptions = {
    // Log to the console how many points are drawn each time the path is simplified. Defaults to false.
    debug?: boolean;
    // How far, in meters, the drawn line can be from the original path. Defaults to 2.
    // This is used at zoom levels that don't have their own tolerance in the "zoom" option.
    tolerance?: number;
    // A tolerance for different zoom levels. The key is the zoom level and the value is the tolerance, in meters,
    // to use at that zoom level and higher, up to the next zoom level that is set. 0 means every point is drawn.
    // For example: { 0: 10, 14: 5, 16: 2, 18: 1 }
    // Set to true to use the default zoom levels, which are the ones in the example.
    // The tolerance is updated after the map finishes zooming.
    zoom?: boolean | { [zoom: number]: number };
};

export type PolylineOptions = {
    // Whether the polyline handles click events. Defaults to true.
    clickable?: boolean;
    // An object containing custom data to attach to the polyline object
    data?: CustomData;
    // Whether the polyline is drawn as a dashed line. Defaults to false.
    dashed?: boolean;
    // The gap between the dashes in pixels or percentage. Defaults to 15px.
    dashGap?: string | number;
    // The polyline to show below the existing one to create a "highlight" effect when the mouse hovers over this polyline.
    highlightPolyline?: PolylineOptions | Polyline;
    // An array of polyline icons to display on the polyline.
    icons?: PolylineIcon[];
    // The map to add the polyline to.
    map?: Map | null;
    // Array of LatLng values defining the path of the polyline.
    path?: LatLngValue[];
    // Simplify the path that is drawn on the map so that it has fewer points but keeps the same shape.
    // This is useful for paths with a lot of points, like GPS tracks. Set a number for how far, in meters,
    // the drawn line can be from the original path, true to use 2 meters, or 'zoom' to use the default
    // tolerances for different zoom levels. Use an object to set your own tolerances for different zoom levels
    // or to log debug information. The path property still holds every point.
    // Defaults to false.
    simplify?: boolean | number | 'zoom' | PolylineSimplifyOptions;
    // Log to the console how many points are drawn each time the path is simplified. This is the same as the
    // "debug" simplify option. If it's set, it's used instead of the "debug" simplify option.
    simplifyDebug?: boolean;
    // The stroke color. All CSS3 colors are supported except for extended named colors.
    strokeColor?: string;
    // The stroke opacity between 0.0 and 1.0.
    strokeOpacity?: number;
    // The stroke width in pixels.
    strokeWeight?: number;
    // The tooltip for the polyline. This will show when hovering over the polyline.
    tooltip?: TooltipValue;
    // Whether the polyline is visible on the map. Defaults to true.
    visible?: boolean;
    // The zIndex value compared to other polygons.
    zIndex?: number;
};

// The simplify settings after the value passed to the simplify option has been checked
type SimplifyConfig = {
    debug: boolean;
    tolerance: number;
    // The zoom levels that have their own tolerance, lowest zoom level first
    zoom: { level: number; tolerance: number }[];
};

/**
 * Get the simplify settings from the value passed to the simplify option
 *
 * @param {unknown} value The simplify option value
 * @returns {SimplifyConfig|undefined} Undefined if simplifying is off or the value isn't valid
 */
const getSimplifyConfig = (value: unknown): SimplifyConfig | undefined => {
    // Get the valid zoom level tolerances, lowest zoom level first
    const getZoomTolerances = (zoom: { readonly [zoom: number]: number }): SimplifyConfig['zoom'] =>
        Object.entries(zoom)
            .map(([level, zoomTolerance]) => ({ level: Number(level), tolerance: Number(zoomTolerance) }))
            .filter((z) => Number.isFinite(z.level) && Number.isFinite(z.tolerance) && z.tolerance >= 0)
            .sort((a, b) => a.level - b.level);

    if (value === true) {
        return { debug: false, tolerance: DEFAULT_SIMPLIFY_TOLERANCE, zoom: [] };
    }
    if (value === 'zoom') {
        return { debug: false, tolerance: DEFAULT_SIMPLIFY_TOLERANCE, zoom: getZoomTolerances(DEFAULT_SIMPLIFY_ZOOM) };
    }
    if (isNumberOrNumberString(value)) {
        const tolerance = Number(value);
        return tolerance > 0 ? { debug: false, tolerance, zoom: [] } : undefined;
    }
    if (isObject(value)) {
        const options = value as PolylineSimplifyOptions;
        const tolerance =
            isNumberOrNumberString(options.tolerance) && Number(options.tolerance) >= 0
                ? Number(options.tolerance)
                : DEFAULT_SIMPLIFY_TOLERANCE;
        let zoom: SimplifyConfig['zoom'] = [];
        if (options.zoom === true) {
            zoom = getZoomTolerances(DEFAULT_SIMPLIFY_ZOOM);
        } else if (isObject(options.zoom)) {
            zoom = getZoomTolerances(options.zoom);
        }
        return { debug: options.debug === true, tolerance, zoom };
    }
    return undefined;
};

/**
 * Polyline class
 */
export class Polyline extends Layer {
    /**
     * Holds any custom data to attach to the polyline object
     *
     * @private
     * @type {CustomData}
     */
    #customData: CustomData = {};

    /**
     * Holds whether the polyline is drawn as a dashed line
     *
     * @private
     * @type {boolean}
     */
    #dashed: boolean = false;

    /**
     * Holds the gap between the dashes in pixels or percentage
     *
     * https://developers.google.com/maps/documentation/javascript/symbols#add_to_polyline
     *
     * @private
     * @type {string}
     */
    #dashGap: string = '15px';

    /**
     * Holds the original polyline options for the highlight polyline
     * before they were overriden by custom options.
     *
     * The custom options are set in the highlight() method.
     *
     * @private
     * @type {PolylineOptions}
     */
    #highlightOriginalOptions: PolylineOptions = {};

    /**
     * Holds a polyline to show below the existing one to create a "highlight" effect
     * when the mouse hovers over this polyline.
     *
     * @private
     * @type {Polyline|undefined}
     */
    #highlightPolyline: Polyline | undefined;

    /**
     * Holds the promise for setting up the highlight polyline on the map.
     *
     * The highlight polyline isn't given the path or added to the map until it's first shown.
     * On a touch screen there is no hover, so most polylines are never highlighted and this
     * saves holding a second copy of every path on the map.
     * This is undefined until the highlight polyline is first shown.
     *
     * @private
     * @type {Promise<void>|undefined}
     */
    #highlightSetup: Promise<void> | undefined;

    /**
     * Holds whether the hover events that show and hide the highlight polyline have been set up
     *
     * @private
     * @type {boolean}
     */
    #hasHighlightListeners: boolean = false;

    /**
     * Holds whether the polyline is manually highlighted (i.e. if the highlightPolyline is displayed)
     *
     * @private
     * @type {boolean}
     */
    #isHighlighted: boolean = false;

    /**
     * Holds whether the highlight polyline has finished being set up on the map
     *
     * @private
     * @type {boolean}
     */
    #isHighlightReady: boolean = false;

    /**
     * Holds whether the mouse is over the polyline
     *
     * @private
     * @type {boolean}
     */
    #isHovered: boolean = false;

    /**
     * Holds the Polyline options
     *
     * @private
     * @type {PolylineOptions}
     */
    #options: PolylineOptions = {};

    /**
     * Holds the path as the latitude and longitude of each point, one after the other.
     *
     * Plain numbers are held instead of LatLng objects because a path can have a lot of points.
     * Two numbers use a small fraction of the memory that a LatLng object does, and the points that
     * are drawn are created straight from these numbers.
     *
     * This array is never changed once it's set. It's replaced when the path changes, so it can be
     * shared with the highlight polyline and with clones.
     *
     * @private
     * @type {Float64Array|undefined}
     */
    #pathCoords: Float64Array | undefined;

    /**
     * Holds the LatLng objects for the path.
     *
     * These are only created if the path property is read, and they're thrown away when the path changes.
     *
     * @private
     * @type {LatLng[]|undefined}
     */
    #pathObjects: LatLng[] | undefined;

    /**
     * Holds how far, in meters, the line drawn on the map can be from the original path when it's simplified.
     *
     * 0 means that the path isn't simplified.
     *
     * @private
     * @type {number}
     */
    #simplifyTolerance: number = 0;

    /**
     * Holds the simplify settings. This is undefined if the path isn't simplified.
     *
     * @private
     * @type {SimplifyConfig|undefined}
     */
    #simplifyConfig: SimplifyConfig | undefined;

    /**
     * Holds the simplifyDebug option. If it's set, it's used instead of the "debug" simplify option.
     *
     * @private
     * @type {boolean|undefined}
     */
    #simplifyDebug: boolean | undefined;

    /**
     * Holds whether the simplify tolerance changed while the polyline was hidden.
     *
     * Hidden polylines don't update the path drawn on the map until they're shown again.
     *
     * @private
     * @type {boolean}
     */
    #isSimplifyOutOfDate: boolean = false;

    /**
     * Holds whether the polyline was hidden when it was added to the map, so the Google polyline
     * hasn't been created yet.
     *
     * A polyline that is hidden isn't drawn, so nothing is created for it until it's first shown.
     * This saves the work for polylines that start out hidden, like ones that a filter leaves out.
     *
     * @private
     * @type {boolean}
     */
    #isCreationDeferred: boolean = false;

    /**
     * Holds whether the "ready" event has been dispatched
     *
     * @private
     * @type {boolean}
     */
    #isReadyDispatched: boolean = false;

    /**
     * Holds the simplified Google Maps path for each tolerance when the tolerance changes with the zoom level.
     * They're kept so that the path doesn't have to be simplified again when zooming back to the same zoom levels.
     *
     * @private
     * @type {object}
     */
    #simplifiedPaths: { [tolerance: number]: google.maps.LatLng[] } = {};

    /**
     * Holds the map most recently passed to setMap().
     *
     * It's set right away, before the Google polyline is set up, so that the tolerance
     * for the map's zoom level can be used when the polyline is first drawn.
     *
     * @private
     * @type {Map|null}
     */
    #requestedMap: Map | null = null;

    /**
     * Holds the map that has the "idle" event listener to update the tolerance for the zoom level
     *
     * @private
     * @type {Map|null}
     */
    #zoomListenerMap: Map | null = null;

    /**
     * Holds the Google maps Polyline object
     *
     * This is undefined until the Google Maps library is loaded and the polyline object is created.
     *
     * @private
     * @type {google.maps.Polyline|undefined}
     */
    #polyline: google.maps.Polyline | undefined;

    /**
     * Constructor
     *
     * @param {PolylineOptions} [options] The polyline options
     */
    constructor(options?: PolylineOptions) {
        super('polyline', 'Polyline');

        if (isObject(options)) {
            this.setOptions(options);
        }
    }

    /**
     * Get whether the polyline handles click events.
     *
     * @returns {boolean|undefined}
     */
    get clickable(): boolean | undefined {
        return this.#options.clickable;
    }

    /**
     * Set whether the polyline handles click events.
     *
     * @param {boolean} value Whether the polyline handles click events.
     */
    set clickable(value: boolean) {
        if (typeof value === 'boolean') {
            this.#options.clickable = value;
            if (this.#polyline) {
                this.#polyline.setOptions({ clickable: value });
            }
        }
    }

    /**
     * Get whether the polyline is drawn as a dashed line.
     *
     * @returns {boolean}
     */
    get dashed(): boolean {
        return this.#dashed;
    }

    /**
     * Set whether the polyline is drawn as a dashed line.
     *
     * @param {boolean} value Whether the polyline is drawn as a dashed line.
     */
    set dashed(value: boolean) {
        if (isBoolean(value)) {
            this.#dashed = value;
            // Add to the options object so that it can be used when cloning the polyline
            this.#options.dashed = value;
        }
        if (this.#polyline) {
            this.#setupIconsAndDashedPolylineOptions().then((opts) => {
                this.#polyline?.setOptions(opts);
            });
        }
    }

    /**
     * Get the gap between the dashes in pixels or percentage.
     *
     * @returns {string}
     */
    get dashGap(): string {
        return this.#dashGap;
    }

    /**
     * Set the gap between the dashes in pixels or percentage.
     *
     * If a number is set them it will be converted to a string with "px" appended.
     *
     * @param {string|number} value The gap between the dashes in pixels.
     */
    set dashGap(value: string | number) {
        const gap = getSizeWithUnit(value);
        if (isStringWithValue(gap)) {
            this.#dashGap = gap;
            // Add to the options object so that it can be used when cloning the polyline
            this.#options.dashGap = gap;

            if (this.#polyline) {
                this.#setupIconsAndDashedPolylineOptions().then((opts) => {
                    this.#polyline?.setOptions(opts);
                });
            }
        }
    }

    /**
     * Get the custom data attached to the polyline object
     *
     * @returns {CustomData}
     */
    get data(): CustomData {
        return this.#customData;
    }

    /**
     * Set custom data to attach to the polyline object
     *
     * @param {CustomData} value The custom data to attach to the polyline object
     */
    set data(value: CustomData) {
        if (isObject(value)) {
            this.#customData = value;
        }
    }

    /**
     * Get the highlight polyline
     *
     * @returns {Polyline|undefined}
     */
    get highlightPolyline(): Polyline | undefined {
        return this.#highlightPolyline;
    }

    /**
     * Set the highlight polyline
     *
     * The highlight polyline is a polyline that is shown below the existing polyline to create a "highlight" effect.
     * This is useful when you want to show a highlight effect when the mouse hovers over the polyline.
     *
     * @param {PolylineOptions|Polyline} value The highlight polyline options or the highlight polyline class.
     */
    set highlightPolyline(value: PolylineOptions | Polyline) {
        let highlight: Polyline | undefined;
        if (value instanceof Polyline) {
            highlight = value;
        } else if (isObject(value)) {
            // Create the highlight polyline by merging the options with the existing options.
            // This allows the developer to only set the options that are different from the existing polyline,
            // which is typically the stroke color, opacity, and weight.
            // The map and path are left out. They're set when the highlight polyline is first shown.
            // See #setupHighlightPolyline().
            // The simplify option is left out too. This polyline gives the highlight polyline its current tolerance.
            const options: PolylineOptions = { ...this.#options, ...value };
            delete options.map;
            delete options.path;
            delete options.simplify;
            delete options.simplifyDebug;
            highlight = new Polyline(options);
        }

        if (!highlight) {
            // An invalid value was passed. Any existing highlight polyline is left as it is.
            return;
        }

        if (highlight !== this.#highlightPolyline) {
            // Take the old highlight polyline off the map if it was added to it
            if (this.#highlightPolyline && this.#highlightSetup) {
                this.#highlightPolyline.setMap(null);
            }
            this.#highlightPolyline = highlight;
            this.#highlightSetup = undefined;
            this.#isHighlightReady = false;
        }

        // Make sure that necessary values are set
        highlight.clickable = true;
        highlight.visible = false;

        // Set the hover events on this polyline to show and hide the highlight polyline.
        // They're only set up once because they always use the current highlight polyline.
        // Use super.on instead of "on" so that this isn't added to the highlight polyline.
        if (!this.#hasHighlightListeners) {
            this.#hasHighlightListeners = true;
            const showOnHover = () => {
                this.#isHovered = true;
                if (!this.#isHighlighted && this.#highlightPolyline && !this.#highlightPolyline.visible) {
                    // The mouse may leave the polyline while the highlight polyline is being set up
                    this.#showHighlightPolyline(() => this.#isHovered && !this.#isHighlighted);
                }
            };
            super.on('mouseover', showOnHover);
            super.on('mousemove', showOnHover);
            super.on('mouseout', () => {
                this.#isHovered = false;
                if (!this.#isHighlighted && this.#highlightPolyline) {
                    this.#highlightPolyline.visible = false;
                }
            });
        }

        // Set the zIndex of the polylines.
        // The zIndex values are undefined if they are not set. (See hasZIndex())
        const highlightZIndex = highlight.zIndex;
        const thisZIndex = this.zIndex;
        if (typeof highlightZIndex !== 'undefined' && typeof thisZIndex !== 'undefined') {
            // Both the polyline and the highlight polyline have a zIndex set.
            // Make sure that the highlight one is below the existing one.
            if (highlightZIndex >= thisZIndex) {
                highlight.zIndex = thisZIndex - 1;
            }
        } else if (typeof thisZIndex !== 'undefined') {
            // Only this polyline has a zIndex set.
            // Set the zIndex of the highlight polyline to be below the existing one.
            highlight.zIndex = thisZIndex - 1;
        } else if (typeof highlightZIndex !== 'undefined') {
            // Only the highlight polyline has a zIndex set.
            // Set the zIndex of this polyline to be above the highlight one.
            this.zIndex = highlightZIndex + 1;
        } else {
            // Neither the polyline nor the highlight polyline have a zIndex set.
            // Set the zIndex of the highlight polyline to be below the existing one.
            highlight.zIndex = 1;
            this.zIndex = 2;
        }
    }

    /**
     * Get the icons for the polyline
     *
     * @returns {PolylineIcon[]}
     */
    get icons(): PolylineIcon[] {
        return this.#options.icons || [];
    }

    /**
     * Set the icons for the polyline
     *
     * You can pass a single icon value or an array of icon values.
     * Each icon value can be an object containing the icon options or a SvgSymbol object.
     *
     * @param {PolylineIconValue|PolylineIconValue[]} value The icon value or an array of icon values.
     */
    set icons(value: PolylineIconValue | PolylineIconValue[]) {
        let setValue = false;
        if (Array.isArray(value)) {
            setValue = true;
            this.#options.icons = value.map((iconValue) => polylineIcon(iconValue));
        } else {
            // If it's not an array then assume it's a single icon value
            this.#options.icons = [polylineIcon(value)];
            setValue = true;
        }
        if (setValue && this.#polyline) {
            this.#polyline.set(
                'icons',
                this.#options.icons.map((icon) => icon.toGoogle()),
            );
        }
    }

    /**
     * Get the map object
     *
     * @returns {Map|null|undefined}
     */
    get map(): Map | null | undefined {
        return this.#options.map;
    }

    /**
     * Set the map object
     *
     * @param {Map|null} value The map object. Set to null if you want to remove the polyline from the map.
     */
    set map(value: Map | null) {
        this.setMap(value);
    }

    /**
     * Get the path of the polyline.
     *
     * The path is an array of LatLng objects defining the path of the polyline.
     *
     * The path is held as plain numbers, so the LatLng objects are created the first time that this
     * is read. Changing the returned array doesn't change the polyline. Use the path property or
     * setPath() to change the path.
     *
     * @returns {LatLngValue[]|undefined}
     */
    get path(): LatLngValue[] | undefined {
        if (!this.#pathCoords) {
            return undefined;
        }
        if (!this.#pathObjects) {
            const coords = this.#pathCoords;
            const points: LatLng[] = [];
            for (let i = 0; i < coords.length; i += 2) {
                points.push(latLng(coords[i], coords[i + 1]));
            }
            this.#pathObjects = points;
        }
        return this.#pathObjects;
    }

    /**
     * Set the path of the polyline.
     * The path is an array of LatLng values defining the path of the polyline.
     * You can pass an array of LatLng objects or an array of LatLngLiteral objects.
     *
     * @param {LatLngValue[]} value The path of the polyline.
     */
    set path(value: LatLngValue[]) {
        if (Array.isArray(value)) {
            this.#setPathCoords(coordsFromPath(value));
        }
    }

    /**
     * Get how far, in meters, the line drawn on the map is allowed to be from the original path.
     *
     * If the tolerance changes with the zoom level, this is the tolerance for the current zoom level.
     *
     * @returns {number} 0 if the path isn't simplified.
     */
    get simplify(): number {
        return this.#simplifyTolerance;
    }

    /**
     * Set whether to simplify the path that is drawn on the map.
     *
     * Simplifying gives the map fewer points to draw but keeps the same shape.
     * The path property still holds every point.
     *
     * @param {boolean|number|string|PolylineSimplifyOptions} value How far, in meters, the drawn line can be from the
     *      original path. true uses 2 meters. 'zoom' uses the default tolerances for different zoom levels. false or 0
     *      turns simplifying off. Use an object to set your own tolerances for different zoom levels or to log debug information.
     */
    set simplify(value: boolean | number | string | PolylineSimplifyOptions) {
        const config = getSimplifyConfig(value);
        const isOff = value === false || (isNumberOrNumberString(value) && Number(value) === 0);
        if (!config && !isOff) {
            // An invalid value was passed so the current setting is kept
            return;
        }
        const wasDebug = this.#isSimplifyDebug();
        this.#simplifyConfig = config;
        // Add to the options object so that it can be used when cloning the polyline
        if (!config) {
            this.#options.simplify = false;
        } else if (value === 'zoom') {
            this.#options.simplify = 'zoom';
        } else {
            this.#options.simplify = isObject(value) ? (value as PolylineSimplifyOptions) : config.tolerance;
        }
        // The simplified paths that were kept may be for different tolerances
        this.#simplifiedPaths = {};
        this.#updateZoomListener();
        const hasChanged = this.#applySimplify();
        // If debug was just turned on but the drawn path didn't change, log what's drawn now
        if (!hasChanged && !wasDebug) {
            this.#logCurrentSimplify();
        }
    }

    /**
     * Get whether debug information is logged to the console each time the path is simplified
     *
     * @returns {boolean}
     */
    get simplifyDebug(): boolean {
        return this.#isSimplifyDebug();
    }

    /**
     * Set whether to log debug information to the console each time the path is simplified.
     *
     * This is the same as the "debug" simplify option. If it's set, it's used instead of the "debug" simplify option.
     *
     * @param {boolean} value Whether to log debug information
     */
    set simplifyDebug(value: boolean) {
        if (isBoolean(value)) {
            const wasDebug = this.#isSimplifyDebug();
            this.#simplifyDebug = value;
            // Add to the options object so that it can be used when cloning the polyline
            this.#options.simplifyDebug = value;
            // Log what's drawn now so that turning debug on shows something right away
            if (!wasDebug) {
                this.#logCurrentSimplify();
            }
        }
    }

    /**
     * Get the SVG stroke color
     *
     * @returns {string|undefined}
     */
    get strokeColor(): string | undefined {
        return this.#options.strokeColor;
    }

    /**
     * Set the SVG stroke color.
     *
     * @param {string} value The SVG stroke color.
     */
    set strokeColor(value: string) {
        if (isStringWithValue(value)) {
            this.#options.strokeColor = value;
            if (this.#polyline) {
                this.#polyline.setOptions({ strokeColor: value });
            }
        }
    }

    /**
     * Get the opacity of the stroke.
     * The opacity of the stroke, where 0 is fully transparent and 1 is fully opaque.
     *
     * @returns {number|undefined}
     */
    get strokeOpacity(): number | undefined {
        return this.#options.strokeOpacity;
    }

    /**
     * Set the opacity of the stroke.
     *
     * @param {number|string} value The opacity of the stroke.
     */
    set strokeOpacity(value: number | string) {
        if (isNumberOrNumberString(value)) {
            if (isNumber(value)) {
                this.#options.strokeOpacity = value;
            } else if (isNumberString(value)) {
                this.#options.strokeOpacity = Number(value);
            }
            if (this.#polyline) {
                if (this.#dashed) {
                    // Change the opacity of the dashes
                    this.#setupIconsAndDashedPolylineOptions().then((opts) => {
                        this.#polyline?.setOptions(opts);
                    });
                } else {
                    // Set the opacity of the stroke
                    this.#polyline.setOptions({ strokeOpacity: this.#options.strokeOpacity });
                }
            }
        }
    }

    /**
     * Get the weight of the stroke in pixels.
     *
     * @returns {number|undefined}
     */
    get strokeWeight(): number | undefined {
        return this.#options.strokeWeight;
    }

    /**
     * Set the weight of the stroke.
     *
     * @param {number|string} value The weight of the stroke.
     */
    set strokeWeight(value: number | string) {
        if (isNumberOrNumberString(value)) {
            if (isNumber(value)) {
                this.#options.strokeWeight = value;
            } else if (isNumberString(value)) {
                this.#options.strokeWeight = Number(value);
            }
            if (this.#polyline) {
                if (this.#dashed) {
                    // Change the opacity of the dashes
                    this.#setupIconsAndDashedPolylineOptions().then((opts) => {
                        this.#polyline?.setOptions(opts);
                    });
                } else {
                    this.#polyline.setOptions({ strokeWeight: Number(value) });
                }
            }
        }
    }

    /**
     * Get whether the polyline is visible on the map.
     *
     * @returns {boolean|undefined}
     */
    get visible(): boolean | undefined {
        return this.#options.visible;
    }

    /**
     * Set whether the polyline is visible on the map.
     *
     * @param {boolean} value Whether the polyline is visible on the map.
     */
    set visible(value: boolean) {
        if (typeof value === 'boolean') {
            this.#options.visible = value;
            this.isVisible = value;
            // If the simplify tolerance changed while the polyline was hidden, update the path before it's shown
            if (value && this.#isSimplifyOutOfDate) {
                this.#applySimplify();
            }
            if (value && this.#isCreationDeferred) {
                // The polyline was hidden when it was added to the map, so it wasn't drawn. Draw it now.
                this.#isCreationDeferred = false;
                const map = this.#requestedMap;
                this.#setupGooglePolyline(map ?? undefined).then((googlePolyline) => {
                    // Make sure the polyline is still on the same map
                    if (map && this.#options.map === map) {
                        googlePolyline.setMap(map.toGoogle() ?? null);
                    }
                });
            }
            if (this.#polyline) {
                this.#polyline.setVisible(value);
            }
        }
    }

    /**
     * Get the zIndex of the polyline.
     *
     * @returns {number|undefined}
     */
    get zIndex(): number | undefined {
        return this.#options.zIndex;
    }

    /**
     * Set the zIndex of the polyline.
     *
     * @param {number|string} value The zIndex of the polyline.
     */
    set zIndex(value: number | string) {
        if (isNumberOrNumberString(value)) {
            if (isNumber(value)) {
                this.#options.zIndex = value;
            } else if (isNumberString(value)) {
                this.#options.zIndex = Number(value);
            }
            if (this.#polyline) {
                this.#polyline.setOptions({ zIndex: Number(value) });
            }
        }
    }

    /**
     * Clones the polyline
     *
     * @returns {Polyline}
     */
    clone(): Polyline {
        const clone = new Polyline();
        // Set the highlight polyline first. It gets the clone's map and path when it's first shown.
        if (this.#highlightPolyline) {
            clone.setHighlightPolyline(this.#highlightPolyline.clone());
        }

        clone.setOptions(this.#options);
        // The path is shared as plain numbers so that LatLng objects aren't created for it
        if (this.#pathCoords) {
            clone.#setPathCoords(this.#pathCoords);
        }
        clone.data = this.#customData;
        // The map may have been set in the options, or later with setMap(), or it may have been removed.
        // Make sure that the clone has the most recent map value.
        clone.setMap(this.getMap());

        // If there is an attached tooltip then add it
        if (isObjectWithValues(this.tooltipConfig)) {
            clone.attachTooltip(this.tooltipConfig);
        }

        return clone;
    }

    /**
     * Get any custom data attached to the marker object.
     *
     * Optionally pass a data key to get the value for that key.
     *
     * @param {string} [key] The object key to get data for. If not set then all data is returned.
     * @returns {any}
     */
    getData(key?: string): any {
        if (isStringWithValue(key)) {
            if (objectHasValue(this.#customData, key)) {
                return this.#customData[key];
            }
            return null;
        }
        return this.#customData;
    }

    /**
     * Returns whether the polyline has a zIndex set.
     *
     * @returns {boolean}
     */
    hasZIndex(): boolean {
        return typeof this.#options.zIndex !== 'undefined';
    }

    /**
     * Hide the polyline
     *
     * @returns {Polyline}
     */
    hide(): Polyline {
        this.visible = false;
        if (this.#highlightPolyline) {
            this.#highlightPolyline.visible = false;
        }
        return this;
    }

    /**
     * Display the highlight polyline if it exists
     *
     * You can override the current highlight options by passing in the options parameter.
     * This allows you to override one or more of the following options:
     * - clickable
     * - dashed
     * - dashGap
     * - icons
     * - strokeColor
     * - strokeOpacity
     * - strokeWeight
     * - zIndex
     *
     * When the polyline is unhighlighted, the original options will be restored.
     *
     * @param {PolylineOptions} [options] The polyline options to override the existing highlight polyline options.
     * @returns {Polyline}
     */
    highlight(options?: PolylineOptions): Polyline {
        if (this.visible !== false && this.#highlightPolyline) {
            if (isObject(options)) {
                // Some custom options are being set. Get the original options
                // so that they can be set on the highlight polyline when it's hidden.
                // That will essentially reset the highlight polyline to the original options.
                this.#highlightOriginalOptions = {
                    clickable: this.#highlightPolyline.clickable,
                    dashed: this.#highlightPolyline.dashed,
                    dashGap: this.#highlightPolyline.dashGap,
                    icons: this.#highlightPolyline.icons,
                    strokeColor: this.#highlightPolyline.strokeColor,
                    strokeOpacity: this.#highlightPolyline.strokeOpacity,
                    strokeWeight: this.#highlightPolyline.strokeWeight,
                    zIndex: this.#highlightPolyline.zIndex,
                };
                const allowedOptions: (keyof PolylineOptions)[] = [
                    'clickable',
                    'dashed',
                    'dashGap',
                    'icons',
                    'strokeColor',
                    'strokeOpacity',
                    'strokeWeight',
                    'zIndex',
                ];
                const highlightOptions: PolylineOptions = {};
                allowedOptions.forEach((option) => {
                    if (isDefined(options[option])) {
                        (highlightOptions as Record<string, unknown>)[option] = options[option];
                    }
                });
                // Set the options on the highlight polyline
                if (Object.keys(highlightOptions).length > 0) {
                    this.#highlightPolyline.setOptions(highlightOptions);
                }
            }
            this.#isHighlighted = true;
            // The polyline may be unhighlighted while the highlight polyline is being set up
            this.#showHighlightPolyline(() => this.#isHighlighted);
        }
        return this;
    }

    /**
     * Initialize the polyline
     *
     * This is used when another element (like a tooltip) needs to be attached to the polyline,
     * but needs to make sure that the polyline exists first.
     *
     * This is not intended to be called outside of this library.
     *
     * @internal
     * @returns {Promise<void>}
     */
    init(): Promise<void> {
        return new Promise((resolve) => {
            if (this.#isCreationDeferred) {
                // The polyline is hidden so it isn't drawn yet. The "ready" event has already been
                // dispatched, so a tooltip or popup can set up its events now. They're added to the
                // Google polyline when the polyline is shown and the Google polyline is created.
                resolve();
                return;
            }
            this.#setupGooglePolyline().then(() => {
                resolve();
            });
        });
    }

    /**
     * @inheritdoc
     */
    hasListener(type: PolylineEvent, callback?: EventCallback): boolean {
        return super.hasListener(type, callback);
    }

    /**
     * @inheritdoc
     */
    off(type?: PolylineEvent, callback?: EventCallback, options?: EventListenerOptions): void {
        // Remove the event from the highlight polyline as well since on() adds it there.
        if (this.#highlightPolyline && type !== PolylineEvents.READY) {
            this.#highlightPolyline.off(type, callback, options);
        }
        super.off(type, callback, options);
    }

    /**
     * @inheritdoc
     */
    removeCalledOnceListeners(type: string, listeners: EventListenerData[]): void {
        // Remove the listeners from the highlight polyline as well since on() adds them there.
        if (this.#highlightPolyline && type !== PolylineEvents.READY) {
            listeners.forEach((listener) => {
                this.#highlightPolyline?.off(type as PolylineEvent, listener.callback, listener.options);
            });
        }
        super.removeCalledOnceListeners(type, listeners);
    }

    /**
     * @inheritdoc
     */
    on(type: PolylineEvent, callback: EventCallback, config?: EventConfig): void {
        // Add the event to the highlight polyline as well so that mouse events on it behave the same as this polyline.
        // The "ready" event is not added because the highlight polyline has already dispatched its own ready event.
        // Adding it would call "immediate" callbacks, like the one in Popup.attachTo(), a second time.
        if (this.#highlightPolyline && type !== PolylineEvents.READY) {
            this.#highlightPolyline.on(type, callback, config);
        }
        super.on(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    onImmediate(type: PolylineEvent, callback: EventCallback, config?: EventConfig): void {
        super.onImmediate(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    once(type: PolylineEvent, callback?: EventCallback, config?: EventConfig): void {
        super.once(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    onceImmediate(type: PolylineEvent, callback?: EventCallback, config?: EventConfig): void {
        super.onceImmediate(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    only(type: PolylineEvent, callback: EventCallback, config?: EventConfig): void {
        super.only(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    onlyOnce(type: PolylineEvent, callback: EventCallback, config?: EventConfig): void {
        super.onlyOnce(type, callback, config);
    }

    /**
     * Add an event listener for when the polyline is loaded and ready for use.
     *
     * @param {EventCallback} [callback] The callback function to call when the event is dispatched.
     */
    onReady(callback: EventCallback): void {
        this.on(PolylineEvents.READY, callback);
    }

    /**
     * Sets the polyline to be drawn as a dashed line
     *
     * @param {boolean} dashed Whether the polyline is drawn as a dashed line
     * @param {string|number} [dashGap] The gap between the dashes in pixels or percentage.
     * @returns {Polyline} The polyline object
     */
    setDashed(dashed: boolean, dashGap?: string | number): Polyline {
        this.dashed = dashed;
        if (dashed && isDefined<string | number>(dashGap)) {
            this.dashGap = dashGap;
        }
        return this;
    }

    /**
     * Set the gap between the dashes in pixels.
     *
     * @param {string|number} gap The gap between the dashes in pixels or percentage. This is only used if the polyline is drawn as a dashed line.
     * @returns {Polyline} The polyline object
     */
    setDashGap(gap: string | number): Polyline {
        this.dashGap = gap;
        return this;
    }

    /**
     * Set the highlight polyline
     *
     * The highlight polyline is a polyline that is shown below the existing polyline to create a "highlight" effect.
     * This is useful when you want to show a highlight effect when the mouse hovers over the polyline.
     *
     * @param {PolylineOptions|Polyline} value The highlight polyline options or the highlight polyline class.
     * @returns {Polyline}
     */
    setHighlightPolyline(value: PolylineOptions | Polyline): Polyline {
        this.highlightPolyline = value;
        return this;
    }

    /**
     * Set the icons for the polyline
     *
     * You can pass a single icon value or an array of icon values.
     * Each icon value can be an object containing the icon options or a SvgSymbol object.
     *
     * @param {PolylineIconValue|PolylineIconValue[]} value The icon value or an array of icon values.
     * @returns {Polyline} The polyline object
     */
    setIcons(value: PolylineIconValue | PolylineIconValue[]): Polyline {
        this.icons = value;
        return this;
    }

    /**
     * Adds the polyline to the map object
     *
     * Alternate of show()
     *
     * @param {Map} value The map object. Set to null if you want to remove the polyline from the map.
     * @param {boolean} [isVisible] Whether the polyline as visible on the map.
     * @returns {Promise<Polyline>}
     */
    async setMap(value: Map | null, isVisible: boolean = true): Promise<Polyline> {
        // Use the simplify tolerance for this map's zoom level, before the Google polyline is drawn
        this.#requestedMap = value instanceof Map ? value : null;
        this.#updateZoomListener();
        this.#applySimplify();

        // The highlight polyline only follows the map once it's been set up. Until then it gets the map when it's first shown.
        if (this.#highlightPolyline && this.#highlightSetup) {
            this.#highlightPolyline.setMap(value, false);
        }
        if (value instanceof Map) {
            if (!this.#polyline && isVisible === false) {
                // A hidden polyline isn't drawn, so nothing is created for it yet. The visible setter
                // creates it when the polyline is shown.
                this.visible = isVisible;
                this.#options.map = value;
                super.setMap(value);
                this.#isCreationDeferred = true;
                // Say that the polyline is ready so that a tooltip or popup can set up its events.
                // They're added to the Google polyline when it's created.
                this.#dispatchReady();
                return this;
            }
            const googlePolyline = await this.#setupGooglePolyline(value);
            this.visible = isVisible;
            // Set the map
            this.#options.map = value;
            super.setMap(value);
            googlePolyline.setMap(value.toGoogle() ?? null);
        } else if (isNullOrUndefined(value)) {
            // Remove the polyline from the map
            this.#isCreationDeferred = false;
            this.#options.map = null;
            super.setMap(null);
            if (this.#polyline) {
                this.#polyline.setMap(null);
            }
        }
        return this;
    }

    /**
     * Set the Polyline options
     *
     * @param {PolylineOptions} options The Polyline options
     * @returns {Polyline}
     */
    setOptions(options: PolylineOptions): Polyline {
        if (isObject(options)) {
            // Set these before the map and path so that the path is only simplified once
            if (isBoolean(options.simplifyDebug)) {
                this.simplifyDebug = options.simplifyDebug;
            }
            if (isDefined<boolean | number | string | PolylineSimplifyOptions>(options.simplify)) {
                this.simplify = options.simplify;
            }
            if (typeof options.clickable === 'boolean') {
                this.clickable = options.clickable;
            }
            if (isBoolean(options.dashed)) {
                this.dashed = options.dashed;
            }
            if (isDefined<string | number>(options.dashGap)) {
                this.dashGap = options.dashGap;
            }
            if (options.icons) {
                this.icons = options.icons;
            }
            // Set the path before the map so that the Google polyline is drawn with the whole path at once
            if (options.path) {
                this.path = options.path;
            }
            // Set whether the polyline is visible before the map so that a polyline that starts out
            // hidden isn't drawn on the map until it's shown
            if (typeof options.visible === 'boolean') {
                this.visible = options.visible;
            }
            if (options.map) {
                this.setMap(options.map, this.#options.visible !== false);
            }
            if (isStringWithValue(options.strokeColor)) {
                this.strokeColor = options.strokeColor;
            }
            if (isNumberOrNumberString(options.strokeOpacity)) {
                this.strokeOpacity = options.strokeOpacity;
            }
            if (isNumberOrNumberString(options.strokeWeight)) {
                this.strokeWeight = options.strokeWeight;
            }
            if (isNumberOrNumberString(options.zIndex)) {
                this.zIndex = options.zIndex;
            }

            // Attach a tooltip value
            if (options.tooltip) {
                this.attachTooltip(options.tooltip);
            }

            // Set up the highlight polyline last so that it can use the options set above.
            if (options.highlightPolyline) {
                this.setHighlightPolyline(options.highlightPolyline);
            }

            // Custom data
            if (options.data) {
                this.data = options.data;
            }
        }
        return this;
    }

    /**
     * Set whether to simplify the path that is drawn on the map.
     *
     * Simplifying gives the map fewer points to draw but keeps the same shape.
     * The path property still holds every point.
     *
     * @param {boolean|number|string|PolylineSimplifyOptions} value How far, in meters, the drawn line can be from the
     *      original path. true uses 2 meters. 'zoom' uses the default tolerances for different zoom levels. false or 0
     *      turns simplifying off. Use an object to set your own tolerances for different zoom levels or to log debug information.
     * @returns {Polyline}
     */
    setSimplify(value: boolean | number | string | PolylineSimplifyOptions): Polyline {
        this.simplify = value;
        return this;
    }

    /**
     * Set whether to log debug information to the console each time the path is simplified.
     *
     * This is the same as the "debug" simplify option. If it's set, it's used instead of the "debug" simplify option.
     *
     * @param {boolean} value Whether to log debug information
     * @returns {Polyline}
     */
    setSimplifyDebug(value: boolean): Polyline {
        this.simplifyDebug = value;
        return this;
    }

    /**
     * Se the path of the polyline.
     *
     * @param {LatLngValue[]} path The path of the polyline.
     * @returns {Polyline}
     */
    setPath(path: LatLngValue[]): Polyline {
        this.path = path;
        return this;
    }

    /**
     * Set the SVG stroke color.
     *
     * @param {string} strokeColor The SVG stroke color.
     * @returns {Polyline}
     */
    setStrokeColor(strokeColor: string): Polyline {
        this.strokeColor = strokeColor;
        return this;
    }

    /**
     * Set the opacity of the stroke.
     *
     * @param {number|string} strokeOpacity The opacity of the stroke.
     * @returns {Polyline}
     */
    setStrokeOpacity(strokeOpacity: number | string): Polyline {
        this.strokeOpacity = strokeOpacity;
        return this;
    }

    /**
     * Set the weight of the stroke.
     *
     * @param {number|string} strokeWeight The weight of the stroke.
     * @returns {Polyline}
     */
    setStrokeWeight(strokeWeight: number | string): Polyline {
        this.strokeWeight = strokeWeight;
        return this;
    }

    /**
     * Set whether the polyline is visible on the map.
     *
     * @param {boolean} visible Whether the polyline is visible on the map.
     * @returns {Polyline}
     */
    setVisible(visible: boolean): Polyline {
        this.visible = visible;
        return this;
    }

    /**
     * Show the polyline on the map
     *
     * This will also set the map object if it's passed
     *
     * @param {Map} [map] The map object. Don't need to pass this if the map is already set on the polyline.
     * @returns {Promise<Polyline>}
     */
    show(map?: Map): Promise<Polyline> {
        return new Promise((resolve) => {
            this.visible = true;
            if (map) {
                this.setMap(map).then(() => {
                    resolve(this);
                });
            } else {
                resolve(this);
            }
        });
    }

    /**
     * Get the Google maps Polyline object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/info-window#Polyline
     *
     * @returns {Promise<google.maps.Polyline>}
     */
    toGoogle(): Promise<google.maps.Polyline> {
        return new Promise((resolve) => {
            this.#setupGooglePolyline().then((googlePolyline) => {
                resolve(googlePolyline);
            });
        });
    }

    /**
     * Hide the highlight polyline if it exists
     *
     * @returns {Polyline}
     */
    unhighlight(): Polyline {
        if (this.#highlightPolyline) {
            this.#isHighlighted = false;
            if (Object.keys(this.#highlightOriginalOptions).length > 0) {
                // Reset the highlight polyline to the original options
                this.#highlightPolyline.setOptions(this.#highlightOriginalOptions);
                // Reset the original options so that they don't get set again
                this.#highlightOriginalOptions = {};
            }
            this.#highlightPolyline.visible = false;
        }
        return this;
    }

    /**
     * Get the path to give to the Google Maps polyline.
     *
     * The path is simplified if a simplify tolerance is set. Otherwise it has every point.
     *
     * @private
     * @returns {google.maps.LatLng[]}
     */
    #getGooglePath(): google.maps.LatLng[] {
        const start = performance.now();
        const coords = this.#pathCoords ?? new Float64Array(0);
        const tolerance = this.#simplifyTolerance;
        // When the tolerance changes with the zoom level, keep each simplified path so that it isn't worked out again
        const useKeptPaths = tolerance > 0 && (this.#simplifyConfig?.zoom.length ?? 0) > 0;
        let googlePath = useKeptPaths ? this.#simplifiedPaths[tolerance] : undefined;
        const isKeptPath = typeof googlePath !== 'undefined';
        if (!googlePath) {
            // The path is held as plain numbers so the Google points are the only objects created for it
            const drawCoords = tolerance > 0 ? simplifyCoords(coords, tolerance) : coords;
            googlePath = [];
            for (let i = 0; i < drawCoords.length; i += 2) {
                googlePath.push(new google.maps.LatLng(drawCoords[i], drawCoords[i + 1]));
            }
            if (useKeptPaths) {
                this.#simplifiedPaths[tolerance] = googlePath;
            }
        }

        // Log how many points are drawn so that developers can see if simplifying helps
        if (this.#isSimplifyDebug()) {
            let detail = '';
            if (isKeptPath) {
                detail = 'Used the path that was already simplified.';
            } else if (tolerance > 0) {
                detail = `Took ${(performance.now() - start).toFixed(1)} ms.`;
            }
            this.#logSimplify(googlePath.length, detail);
        }

        // Give Google a copy of a kept path so that the kept path can't be changed
        return isKeptPath || useKeptPaths ? googlePath.slice() : googlePath;
    }

    /**
     * Set the path from the latitude and longitude of each point, one after the other.
     *
     * The array is used as it is and is never changed, so it can be shared with the highlight
     * polyline and with clones.
     *
     * @private
     * @param {Float64Array} coords The path as the latitude and longitude of each point
     */
    #setPathCoords(coords: Float64Array): void {
        this.#pathCoords = coords;
        // The LatLng objects and the simplified paths that were kept are for the old path
        this.#pathObjects = undefined;
        this.#simplifiedPaths = {};
        if (this.#polyline) {
            this.#polyline.setPath(this.#getGooglePath());
        }
        // Keep the highlight polyline on the same path once it has one
        if (this.#highlightPolyline && this.#highlightSetup) {
            this.#highlightPolyline.#setPathCoords(coords);
        }
    }

    /**
     * Returns whether debug information about simplifying is logged to the console.
     *
     * The simplifyDebug option is used if it's set. Otherwise the "debug" simplify option is used.
     *
     * @private
     * @returns {boolean}
     */
    #isSimplifyDebug(): boolean {
        return this.#simplifyDebug ?? this.#simplifyConfig?.debug ?? false;
    }

    /**
     * Log to the console how many points are drawn, if debug is on.
     *
     * @private
     * @param {number} drawnCount The number of points in the path drawn on the map
     * @param {string} detail Extra information to add to the end of the message
     */
    #logSimplify(drawnCount: number, detail: string): void {
        const pathCount = this.#pathCoords ? this.#pathCoords.length / 2 : 0;
        if (!this.#isSimplifyDebug() || pathCount === 0) {
            return;
        }
        const tolerance = this.#simplifyTolerance;
        const zoomText =
            (this.#simplifyConfig?.zoom.length ?? 0) > 0 && this.#requestedMap
                ? ` at zoom ${this.#requestedMap.zoom}`
                : '';
        let message = `[Polyline simplify] ${pathCount.toLocaleString()} points in the path, `;
        if (tolerance > 0) {
            const fewer = (100 - (drawnCount / pathCount) * 100).toFixed(1);
            message += `${drawnCount.toLocaleString()} drawn (${fewer}% fewer) with a ${tolerance} m tolerance${zoomText}.`;
        } else {
            message += `all drawn (not simplified${zoomText}).`;
        }
        if (detail) {
            message += ` ${detail}`;
        }
        // eslint-disable-next-line no-console
        console.log(message, this);
    }

    /**
     * Log what is drawn on the map now, if debug is on and the Google polyline exists.
     *
     * @private
     */
    #logCurrentSimplify(): void {
        if (this.#polyline) {
            this.#logSimplify(this.#polyline.getPath().getLength(), '');
        }
    }

    /**
     * Get the simplify tolerance to use now.
     *
     * If there are tolerances for different zoom levels then the one for the map's current zoom level is used.
     *
     * @private
     * @returns {number} 0 if the path shouldn't be simplified
     */
    #getCurrentTolerance(): number {
        const config = this.#simplifyConfig;
        if (!config) {
            return 0;
        }
        if (config.zoom.length > 0 && this.#requestedMap) {
            const { zoom } = this.#requestedMap;
            let tolerance: number | undefined;
            config.zoom.forEach((z) => {
                if (zoom >= z.level) {
                    tolerance = z.tolerance;
                }
            });
            if (typeof tolerance !== 'undefined') {
                return tolerance;
            }
        }
        return config.tolerance;
    }

    /**
     * Update the path drawn on the map if the simplify tolerance to use has changed.
     *
     * If the polyline is hidden then the path isn't updated until the polyline is shown again.
     * This saves simplifying the paths of hidden polylines, for example ones hidden with PolylineCollection.hide(),
     * each time the zoom level changes.
     *
     * @private
     * @returns {boolean} Whether the path drawn on the map was updated
     */
    #applySimplify(): boolean {
        const tolerance = this.#getCurrentTolerance();
        if (tolerance === this.#simplifyTolerance) {
            this.#isSimplifyOutOfDate = false;
            return false;
        }
        if (this.#polyline && this.#options.visible === false) {
            // Wait until the polyline is shown. See the visible setter.
            this.#isSimplifyOutOfDate = true;
            return false;
        }
        this.#isSimplifyOutOfDate = false;
        this.#simplifyTolerance = tolerance;
        if (this.#polyline) {
            this.#polyline.setPath(this.#getGooglePath());
        }
        // Keep the highlight polyline drawing the same path once it has one
        if (this.#highlightPolyline && this.#highlightSetup) {
            this.#highlightPolyline.simplify = tolerance;
        }
        return true;
    }

    /**
     * Listen for the map to finish moving so that the tolerance can be updated for the zoom level.
     *
     * The listener is only needed when there are tolerances for different zoom levels and the polyline is on a map.
     * It's removed otherwise so that the map doesn't hold on to the polyline.
     *
     * @private
     */
    #updateZoomListener(): void {
        const map = this.#simplifyConfig && this.#simplifyConfig.zoom.length > 0 ? this.#requestedMap : null;
        if (map === this.#zoomListenerMap) {
            return;
        }
        if (this.#zoomListenerMap) {
            this.#zoomListenerMap.off('idle', this.#handleMapIdle);
        }
        if (map) {
            map.on('idle', this.#handleMapIdle);
        }
        this.#zoomListenerMap = map;
    }

    /**
     * Update the tolerance after the map finishes moving, in case the zoom level changed.
     *
     * This uses the "idle" event instead of "zoom_changed" so that the path isn't simplified
     * while the map is still zooming.
     *
     * @private
     */
    #handleMapIdle = (): void => {
        this.#applySimplify();
    };

    /**
     * Set up the highlight polyline on the map if it hasn't been already.
     *
     * This gives the highlight polyline this polyline's path and adds it to the map, hidden.
     * It's done the first time the highlight polyline is shown rather than when it's set.
     *
     * @private
     * @returns {Promise<void>}
     */
    #setupHighlightPolyline(): Promise<void> {
        const highlight = this.#highlightPolyline;
        if (!highlight) {
            return Promise.resolve();
        }
        if (!this.#highlightSetup) {
            // Draw the same simplified path as this polyline
            highlight.simplify = this.#simplifyTolerance;
            if (this.#pathCoords) {
                // The path is shared as plain numbers so that a second set of objects isn't created for it
                highlight.#setPathCoords(this.#pathCoords);
            }
            const map = this.getMap();
            const setup: Promise<unknown> = map ? highlight.setMap(map, false) : Promise.resolve();
            this.#highlightSetup = setup.then(() => {
                // The highlight polyline may have been replaced while this one was being set up
                if (this.#highlightPolyline === highlight) {
                    this.#isHighlightReady = true;
                }
            });
        }
        return this.#highlightSetup;
    }

    /**
     * Show the highlight polyline, setting it up first if necessary.
     *
     * The highlight polyline is shown right away if it's already set up. Otherwise it's shown
     * once it's set up, as long as it should still be shown.
     *
     * @private
     * @param {() => boolean} shouldShow Returns whether the highlight polyline should still be shown
     */
    #showHighlightPolyline(shouldShow: () => boolean): void {
        const show = () => {
            if (this.#highlightPolyline && shouldShow()) {
                this.#highlightPolyline.visible = true;
            }
        };
        if (this.#isHighlightReady) {
            show();
        } else {
            this.#setupHighlightPolyline().then(show);
        }
    }

    /**
     * Set up the options for a dashed polyline and icons
     *
     * See https://developers.google.com/maps/documentation/javascript/examples/overlay-symbol-dashed for details
     *
     * @returns {Promise<google.maps.PolylineOptions>} The Google maps Polyline options
     */
    #setupIconsAndDashedPolylineOptions(): Promise<google.maps.PolylineOptions> {
        return new Promise((resolve) => {
            (async () => {
                const options: google.maps.PolylineOptions = {};
                if (this.#dashed) {
                    // Set up the icon symbol that will be displayed as a dash
                    const lineSymbol = svgSymbol({
                        path: 'M 0,-1 0,1',
                        strokeOpacity: 1,
                        scale: 3,
                    });
                    if (isDefined<number>(this.#options.strokeOpacity)) {
                        lineSymbol.strokeOpacity = this.#options.strokeOpacity;
                    }
                    if (isDefined<number>(this.#options.strokeWeight)) {
                        lineSymbol.scale = this.#options.strokeWeight;
                    }
                    options.strokeOpacity = 0;

                    // Set the icon to be used for the dashes
                    const icon = polylineIcon({
                        icon: lineSymbol,
                        offset: '0',
                        repeat: this.#dashGap,
                    });
                    options.icons = [await icon.toGoogle()];

                    // Include any other icons if there are any
                    if (Array.isArray(this.#options.icons) && this.#options.icons.length > 0) {
                        // Merge any additional icons with the dash icon
                        const additionalIcons = await Promise.all(
                            this.#options.icons.map((icn) => {
                                const returnIcon = polylineIcon(icn);
                                // Need to set the strokeOpacity on the PolyIcon icon otherwise it won't be visible;
                                const iconIcn = returnIcon.icon;
                                if (iconIcn) {
                                    if (isDefined<number>(this.#options.strokeOpacity)) {
                                        iconIcn.strokeOpacity = this.#options.strokeOpacity;
                                    } else {
                                        iconIcn.strokeOpacity = 1;
                                    }
                                }
                                return returnIcon.toGoogle();
                            }),
                        );
                        options.icons = options.icons.concat(additionalIcons);
                    }
                } else {
                    options.strokeOpacity = isNumberOrNumberString(this.#options.strokeOpacity)
                        ? this.#options.strokeOpacity
                        : 1;
                    options.icons = []; // Remove any icons if the polyline is not dashed
                    if (Array.isArray(this.#options.icons) && this.#options.icons.length > 0) {
                        // Set any icons if necessary
                        options.icons = await Promise.all(this.#options.icons.map((icn) => icn.toGoogle()));
                    }
                }
                resolve(options);
            })();
        });
    }

    /**
     * Set up the Google maps Polyline object if necessary
     *
     * @param {Map} [map] The map object. If it's set then it will be initialized if the Google maps object isn't available yet.
     * @private
     * @returns {Promise<google.maps.Polyline>} The Google maps Polyline object once it's set up
     */
    #setupGooglePolyline(map?: Map): Promise<google.maps.Polyline> {
        return new Promise((resolve) => {
            if (!isObject(this.#polyline)) {
                if (checkForGoogleMaps('Polyline', 'Polyline', false)) {
                    const googlePolyline = this.#createPolylineObject();
                    this.#dispatchReady();
                    resolve(googlePolyline);
                } else {
                    // The Google maps object isn't available yet. Wait for it to load.
                    // The developer may have set the map on the polyline before the Google maps object was available.
                    loader().onMapLoad(() => {
                        const googlePolyline = this.#createPolylineObject();
                        // Make sure that the map is still set.
                        // It's unlikely, but possible, that the developer could have removed the map
                        // from the polyline before the Google maps object was available.
                        const thisMap = this.getMap();
                        if (thisMap) {
                            googlePolyline.setMap(thisMap.toGoogle() ?? null);
                            // Add the map to the highlight polyline as well if it's been set up
                            if (this.#highlightPolyline && this.#highlightSetup) {
                                this.#highlightPolyline.setMap(thisMap, false);
                            }
                        }
                        this.#dispatchReady();
                        resolve(googlePolyline);
                    });

                    // Trigger the map to load if it's set.
                    if (map instanceof Map) {
                        map.init();
                    }
                }
            } else {
                // The polyline object is already set up
                resolve(this.#polyline);
            }
        });
    }

    /**
     * Set up the Google maps polyline object syncronously.
     */
    #setupGooglePolylineSync(): void {
        if (!isObject(this.#polyline)) {
            if (checkForGoogleMaps('Polyline', 'Polyline', false)) {
                this.#createPolylineObject();
            } else {
                throw new Error(
                    'The Google maps libray is not available so the polyline object cannot be created. Load the Google maps library first.',
                );
            }
        }
    }

    /**
     * Dispatch the event to say that the polyline is ready.
     *
     * It's only dispatched once. A polyline that is hidden when it's added to the map says that it's
     * ready before the Google polyline is created, so that tooltips and popups can set up their events.
     *
     * @private
     */
    #dispatchReady(): void {
        if (!this.#isReadyDispatched) {
            this.#isReadyDispatched = true;
            this.dispatch(PolylineEvents.READY);
        }
    }

    /**
     * Create the polyline object if it doesn't already exist
     *
     * @private
     * @returns {google.maps.Polyline} The Google maps Polyline object
     */
    #createPolylineObject(): google.maps.Polyline {
        if (!this.#polyline) {
            // The polyline is being drawn now, so nothing is waiting to be created
            this.#isCreationDeferred = false;
            const polylineOptions: google.maps.PolylineOptions = {};

            // Options that can be set on the Polyline without any modification
            const optionsToSet: (keyof PolylineOptions & keyof google.maps.PolylineOptions)[] = [
                'clickable',
                'strokeColor',
                'strokeOpacity',
                'strokeWeight',
                'visible',
                'zIndex',
            ];
            optionsToSet.forEach((key) => {
                if (typeof this.#options[key] !== 'undefined') {
                    (polylineOptions as Record<string, unknown>)[key] = this.#options[key];
                }
            });
            // The map needs to be converted to the Google maps object
            if (this.#options.map) {
                polylineOptions.map = this.#options.map.toGoogle();
            }

            // Set the path, simplified if necessary
            polylineOptions.path = this.#getGooglePath();

            // Create the polyine object
            const googlePolyline = new google.maps.Polyline(polylineOptions);
            this.#polyline = googlePolyline;

            // Handle dashed polylines if necessary
            this.#setupIconsAndDashedPolylineOptions().then((opts) => {
                googlePolyline.setOptions(opts);
                this.setEventGoogleObject(googlePolyline);
            });
            return googlePolyline;
        }
        return this.#polyline;
    }
}

// The possible values for the options parameter of the polyline function
export type PolylineValue = Polyline | PolylineOptions;

/**
 * Helper function to set up the polyline object
 *
 * @param {PolylineValue} [options] The polyline options or the polyline class
 * @returns {Polyline}
 */
export const polyline = (options?: PolylineValue): Polyline => {
    if (options instanceof Polyline) {
        return options;
    }
    return new Polyline(options);
};
