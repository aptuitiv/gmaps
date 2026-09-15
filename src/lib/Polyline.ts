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
import { DEFAULT_SIMPLIFY_TOLERANCE, simplifyPath } from './simplifyPath';
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
    // the drawn line can be from the original path, or true to use 2 meters. The path property still holds every point.
    // Defaults to false.
    simplify?: boolean | number;
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
     * Holds how far, in meters, the line drawn on the map can be from the original path when it's simplified.
     *
     * 0 means that the path isn't simplified.
     *
     * @private
     * @type {number}
     */
    #simplifyTolerance: number = 0;

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
            const options: PolylineOptions = { ...this.#options, ...value };
            delete options.map;
            delete options.path;
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
     * The path is an array of LatLng values defining the path of the polyline.
     *
     * @returns {LatLngValue[]|undefined}
     */
    get path(): LatLngValue[] | undefined {
        return this.#options.path;
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
            const paths: LatLng[] = [];
            value.forEach((pathValue) => {
                const position = latLng(pathValue);
                if (position.isValid()) {
                    paths.push(position);
                }
            });
            this.#options.path = paths;
            if (this.#polyline) {
                this.#polyline.setPath(this.#getGooglePath());
            }
            // Keep the highlight polyline on the same path once it has one
            if (this.#highlightPolyline && this.#highlightSetup) {
                this.#highlightPolyline.path = paths;
            }
        }
    }

    /**
     * Get how far, in meters, the line drawn on the map can be from the original path when it's simplified.
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
     * @param {boolean|number|string} value How far, in meters, the drawn line can be from the original path.
     *      true uses 2 meters. false or 0 turns simplifying off.
     */
    set simplify(value: boolean | number | string) {
        let tolerance: number | undefined;
        if (value === true) {
            tolerance = DEFAULT_SIMPLIFY_TOLERANCE;
        } else if (value === false) {
            tolerance = 0;
        } else if (isNumberOrNumberString(value) && Number(value) >= 0) {
            tolerance = Number(value);
        }
        if (typeof tolerance === 'undefined' || tolerance === this.#simplifyTolerance) {
            return;
        }
        this.#simplifyTolerance = tolerance;
        // Add to the options object so that it can be used when cloning the polyline
        this.#options.simplify = tolerance;
        if (this.#polyline) {
            this.#polyline.setPath(this.#getGooglePath());
        }
        // Keep the highlight polyline drawing the same path once it has one
        if (this.#highlightPolyline && this.#highlightSetup) {
            this.#highlightPolyline.simplify = tolerance;
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
        // The highlight polyline only follows the map once it's been set up. Until then it gets the map when it's first shown.
        if (this.#highlightPolyline && this.#highlightSetup) {
            this.#highlightPolyline.setMap(value, false);
        }
        const googlePolyline = await this.#setupGooglePolyline(value ?? undefined);
        if (value instanceof Map) {
            this.visible = isVisible;
            // Set the map
            this.#options.map = value;
            super.setMap(value);
            googlePolyline.setMap(value.toGoogle() ?? null);
        } else if (isNullOrUndefined(value)) {
            // Remove the polyline from the map
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
            // Set this before the map and path so that the path is only simplified once
            if (isDefined<boolean | number>(options.simplify)) {
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
            if (options.map) {
                this.setMap(options.map);
            }
            if (options.path) {
                this.path = options.path;
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
            if (typeof options.visible === 'boolean') {
                this.visible = options.visible;
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
     * @param {boolean|number|string} value How far, in meters, the drawn line can be from the original path.
     *      true uses 2 meters. false or 0 turns simplifying off.
     * @returns {Polyline}
     */
    setSimplify(value: boolean | number | string): Polyline {
        this.simplify = value;
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
        const path = this.#options.path ?? [];
        const points =
            this.#simplifyTolerance > 0
                ? simplifyPath(path, this.#simplifyTolerance)
                : path.map((point) => (point instanceof LatLng ? point : latLng(point)));
        return points.map((point) => point.toGoogle()).filter((point): point is google.maps.LatLng => point !== null);
    }

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
            if (this.path) {
                highlight.path = this.path;
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
                    // Dispatch the event to say that the polyline is ready
                    this.dispatch(PolylineEvents.READY);
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
                        // Dispatch the event to say that the polyline is ready
                        this.dispatch(PolylineEvents.READY);
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
     * Create the polyline object if it doesn't already exist
     *
     * @private
     * @returns {google.maps.Polyline} The Google maps Polyline object
     */
    #createPolylineObject(): google.maps.Polyline {
        if (!this.#polyline) {
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
