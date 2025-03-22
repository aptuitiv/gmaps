/* ===========================================================================
    Enables building a polyline on a Google map.

    https://developers.google.com/maps/documentation/javascript/shapes
    https://developers.google.com/maps/documentation/javascript/reference/polygon#Polyline
=========================================================================== */

/* global google */
/* eslint-disable no-use-before-define -- Done because the PolylineCollection is referenced before it's created */
/* eslint-disable @typescript-eslint/no-explicit-any -- Custom data could be anything within an obect */

import { EventCallback, EventConfig, EventListenerOptions } from './Evented';
import { latLng, LatLng, LatLngValue } from './LatLng';
import Layer from './Layer';
import { loader } from './Loader';
import { Map } from './Map';
import { polylineIcon, PolylineIcon, PolylineIconValue } from './PolylineIcon';
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
    | 'mouseup';

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
    dashGap?: string|number;
    // The polyline to show below the existing one to create a "highlight" effect when the mouse hovers over this polyline.
    highlightPolyline?: PolylineOptions | Polyline;
    // An array of polyline icons to display on the polyline.
    icons?: PolylineIcon[];
    // The map to add the polyline to.
    map?: Map;
    // Array of LatLng values defining the path of the polyline.
    path?: LatLngValue[];
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
     * Holds a polyline to show below the existing one to create a "highlight" effect
     * when the mouse hovers over this polyline.
     *
     * @private
     * @type {Polyline}
     */
    #highlightPolyline: Polyline;

    /**
     * Holds whether the polyline is manually highlighted (i.e. if the highlightPolyline is displayed)
     *
     * @private
     * @type {boolean}
     */
    #isHighlighted: boolean = false;

    /**
     * Holds the Polyline options
     *
     * @private
     * @type {PolylineOptions}
     */
    #options: PolylineOptions = {};

    /**
     * Holds the Google maps Polyline object
     *
     * @private
     * @type {google.maps.Polyline}
     */
    #polyline: google.maps.Polyline;

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
     * @returns {boolean}
     */
    get clickable(): boolean {
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
                this.#polyline.setOptions(opts);
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
    set dashGap(value: string|number) {
        const gap = getSizeWithUnit(value);
        if (isStringWithValue(gap)) {
            this.#dashGap = gap;
            // Add to the options object so that it can be used when cloning the polyline
            this.#options.dashGap = gap;

            if (this.#polyline) {
                this.#setupIconsAndDashedPolylineOptions().then((opts) => {
                    this.#polyline.setOptions(opts);
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
     * @returns {Polyline}
     */
    get highlightPolyline(): Polyline {
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
        if (value instanceof Polyline) {
            this.#highlightPolyline = value;
        } else if (isObject(value)) {
            // Create the highlight polyline by merging the options with the existing options.
            // This allows the developer to only set the options that are different from the existing polyline,
            // which is typically the stroke color, opacity, and weight.
            this.#highlightPolyline = new Polyline({ ...this.#options, ...value });
        }

        // Make sure that necessary values are set
        this.#highlightPolyline.clickable = true;
        this.#highlightPolyline.path = this.path;
        this.#highlightPolyline.visible = false;

        // Initialize the highlight polyline and this polyline so that events
        // can be assigned to them and so that the map can be set.
        this.#highlightPolyline.init().then(() => {
            this.init().then(() => {
                this.#highlightPolyline.setMap(this.getMap(), false);

                // Set the hover events on this polyline to show and hide the highlight polyline.
                // Use super.on instead of "on" so that this isn't added to the highlight polyline.
                super.on('mouseover', () => {
                    if (!this.#isHighlighted) {
                        this.#highlightPolyline.visible = true;
                    }
                });
                super.on('mousemove', () => {
                    if (!this.#isHighlighted) {
                        this.#highlightPolyline.visible = true;
                    }
                });
                super.on('mouseout', () => {
                    if (!this.#isHighlighted) {
                        this.#highlightPolyline.visible = false;
                    }
                });
            });
        });

        // Set the zIndex of the polylines
        if (this.#highlightPolyline.hasZIndex() && this.hasZIndex()) {
            // Both the polyline and the highlight polyline have a zIndex set.
            // Make sure that the highlight one is below the existing one.
            const highlightZIndex = this.#highlightPolyline.zIndex;
            const thisZIndex = this.zIndex;
            if (highlightZIndex >= thisZIndex) {
                this.#highlightPolyline.zIndex = thisZIndex - 1;
            }
        } else if (this.hasZIndex()) {
            // Only this polyline has a zIndex set.
            // Set the zIndex of the highlight polyline to be below the existing one.
            this.#highlightPolyline.zIndex = this.zIndex - 1;
        } else if (this.#highlightPolyline.hasZIndex()) {
            // Only the highlight polyline has a zIndex set.
            // Set the zIndex of this polyline to be above the highlight one.
            this.zIndex = this.#highlightPolyline.zIndex + 1;
        } else {
            // Neither the polyline nor the highlight polyline have a zIndex set.
            // Set the zIndex of the highlight polyline to be below the existing one.
            this.#highlightPolyline.zIndex = 1;
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
    set icons(value: PolylineIconValue|PolylineIconValue[]) {
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
            this.#polyline.set('icons', this.#options.icons.map((icon) => icon.toGoogle()));
        }
    }

    /**
     * Get the map object
     *
     * @returns {Map}
     */
    get map(): Map {
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
     * @returns {LatLngValue[]}
     */
    get path(): LatLngValue[] {
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
                this.#polyline.setPath(paths.map((path) => path.toGoogle()));
            }
        }
    }

    /**
     * Get the SVG stroke color
     *
     * @returns {string}
     */
    get strokeColor(): string {
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
     * @returns {number}
     */
    get strokeOpacity(): number {
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
                        this.#polyline.setOptions(opts);
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
     * @returns {number}
     */
    get strokeWeight(): number {
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
                        this.#polyline.setOptions(opts);
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
     * @returns {boolean}
     */
    get visible(): boolean {
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
     * @returns {number}
     */
    get zIndex(): number {
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
        // Set the highlight polyline first so that any options that if the map object
        // is set with the setOptions() method then it'll be set on the highlight polyline.
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
    getData(key?: string): CustomData {
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
     * @returns {Polyline}
     */
    highlight(): Polyline {
        if (this.visible !== false && this.#highlightPolyline) {
            this.#isHighlighted = true;
            this.#highlightPolyline.visible = true;
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
        super.off(type, callback, options);
    }

    /**
     * @inheritdoc
     */
    on(type: PolylineEvent, callback: EventCallback, config?: EventConfig): void {
        if (this.#highlightPolyline) {
            // Add the event to the highlight polyline as well
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
     * Sets the polyline to be drawn as a dashed line
     *
     * @param {boolean} dashed Whether the polyline is drawn as a dashed line
     * @param {string|number} [dashGap] The gap between the dashes in pixels or percentage.
     * @returns {Polyline} The polyline object
     */
    setDashed(dashed: boolean, dashGap?: string|number): Polyline {
        this.dashed = dashed;
        if (dashed) {
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
    setDashGap(gap: string|number): Polyline {
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
    setIcons(value: PolylineIconValue|PolylineIconValue[]): Polyline {
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
        if (this.#highlightPolyline) {
            this.#highlightPolyline.setMap(value, false);
        }
        await this.#setupGooglePolyline(value);
        if (value instanceof Map) {
            this.visible = isVisible;
            // Set the map
            this.#options.map = value;
            super.setMap(value);
            this.#polyline.setMap(value.toGoogle());
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
            if (typeof options.clickable === 'boolean') {
                this.clickable = options.clickable;
            }
            if (isBoolean(options.dashed)) {
                this.dashed = options.dashed;
            }
            if (isDefined(options.dashGap)) {
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
            this.#setupGooglePolyline().then(() => {
                resolve(this.#polyline);
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
            this.#highlightPolyline.visible = false;
        }
        return this;
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
                    if (isDefined(this.#options.strokeOpacity)) {
                        lineSymbol.strokeOpacity = this.#options.strokeOpacity;
                    }
                    if (isDefined(this.#options.strokeWeight)) {
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
                        const additionalIcons = await Promise.all(this.#options.icons.map((icn) => {
                            const returnIcon = polylineIcon(icn);
                            // Need to set the strokeOpacity on the PolyIcon icon otherwise it won't be visible;
                            const iconIcn = returnIcon.icon;
                            if (isDefined(this.#options.strokeOpacity)) {
                                iconIcn.strokeOpacity = this.#options.strokeOpacity;
                            } else {
                                iconIcn.strokeOpacity = 1;
                            }
                            return returnIcon.toGoogle();
                        }));
                        options.icons = options.icons.concat(additionalIcons);
                    }
                } else {
                    options.strokeOpacity = isNumberOrNumberString(this.#options.strokeOpacity) ? this.#options.strokeOpacity : 1;
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
     */
    #setupGooglePolyline(map?: Map): Promise<void> {
        return new Promise((resolve) => {
            if (!isObject(this.#polyline)) {
                if (checkForGoogleMaps('Polyline', 'Polyline', false)) {
                    this.#createPolylineObject();
                    resolve();
                } else {
                    // The Google maps object isn't available yet. Wait for it to load.
                    // The developer may have set the map on the polyline before the Google maps object was available.
                    loader().onMapLoad(() => {
                        this.#createPolylineObject();
                        // Make sure that the map is still set.
                        // It's unlikely, but possible, that the developer could have removed the map
                        // from the polyline before the Google maps object was available.
                        const thisMap = this.getMap();
                        if (this.#polyline && thisMap) {
                            this.#polyline.setMap(thisMap.toGoogle());
                            // Add the map to the highlight polyline as well if it exists
                            if (this.#highlightPolyline) {
                                this.#highlightPolyline.setMap(thisMap, false);
                            }
                        }
                        resolve();
                    });

                    // Trigger the map to load if it's set.
                    if (map instanceof Map) {
                        map.init();
                    }
                }
            } else {
                // The polyline object is already set up
                resolve();
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
                    'The Google maps libray is not available so the polyline object cannot be created. Load the Google maps library first.'
                );
            }
        }
    }

    /**
     * Create the polyline object
     *
     * @private
     */
    #createPolylineObject() {
        if (!this.#polyline) {
            const polylineOptions: google.maps.PolylineOptions = {};

            // Options that can be set on the Polyline without any modification
            const optionsToSet = [
                'clickable',
                'map',
                'strokeColor',
                'strokeOpacity',
                'strokeWeight',
                'visible',
                'zIndex',
            ];
            optionsToSet.forEach((key) => {
                if (typeof this.#options[key] !== 'undefined') {
                    polylineOptions[key] = this.#options[key];
                }
            });

            // Set the path
            if (Array.isArray(this.#options.path)) {
                polylineOptions.path = this.#options.path.map((path) => latLng(path).toGoogle());
            }

            // Create the polyine object
            this.#polyline = new google.maps.Polyline(polylineOptions);

            // Handle dashed polylines if necessary
            this.#setupIconsAndDashedPolylineOptions().then((opts) => {
                this.#polyline.setOptions(opts);
                this.setEventGoogleObject(this.#polyline);
            });
        }
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
