/* ===========================================================================
    Enables building and managing markers on the map.

    https://developers.google.com/maps/documentation/javascript/markers
    https://developers.google.com/maps/documentation/javascript/reference/marker

    See https://aptuitiv.github.io/gmaps-docs/api-reference/marker for documentation.
=========================================================================== */

/* global google */
/* eslint-disable @typescript-eslint/no-explicit-any -- Custom data could be anything within an obect */

import { EventCallback, EventConfig, EventListenerOptions } from './Evented';
import { icon, Icon, IconValue } from './Icon';
import { latLng, LatLng, LatLngValue } from './LatLng';
import Layer from './Layer';
import { loader } from './Loader';
import { Map } from './Map';
import { point, Point, PointValue } from './Point';
import { svgSymbol, SvgSymbol, SvgSymbolValue } from './SvgSymbol';
import { TooltipValue } from './Tooltip';
import { MarkerEvents } from './constants';
import {
    checkForGoogleMaps,
    isBoolean,
    isNullOrUndefined,
    isNumber,
    isNumberOrNumberString,
    isObject,
    isString,
    isStringOrNumber,
    isStringWithValue,
    objectHasValue,
} from './helpers';

export type MarkerLabel = google.maps.MarkerLabel;

// Custom data to attach to the marker object
type CustomData = {
    [key: string]: any;
};

// Options that will be passed to the Google maps marker object
type GMMarkerOptions = {
    // The offset from the marker's position to the tip of an InfoWindow that has been opened with the marker as anchor.
    anchorPoint?: Point;
    // The cursor type to show on hover. Defaults to "pointer" if not set.
    cursor?: string;
    // Whether the marker can be dragged on the map. Defaults to false.
    draggable?: boolean;
    // The icon value for the marker
    icon?: Icon | SvgSymbol | string;
    // The label value for the marker
    label?: string | MarkerLabel;
    // The map to add the marker to.
    map?: Map;
    // The position for the marker.
    position?: LatLng;
    // The title for the marker. If a custom tooltip is not used, this will show as a default tooltip on the marker
    // that shows when you hover over a link with a title.
    title?: string;
};

// Marker options that aren't part of the options used to set up the Google maps marker
export type MarkerOptions = GMMarkerOptions & {
    // The offset from the marker's position to the tip of an InfoWindow that has been opened with the marker as anchor.
    anchorPoint?: PointValue;
    // An object containing custom data to attach to the marker object
    data?: CustomData;
    // The icon value for the marker
    icon?: IconValue;
    // The latitude for the marker. You can use "lat" or "latitude" as the property name.
    lat?: number | string;
    latitude?: number | string;
    // The longitude for the marker. You can use "lng" or "longitude" as the property name.
    lng?: number | string;
    longitude?: number | string;
    // The position for the marker.
    // This is an alternate to setting the latitude and longitude separately.
    position?: LatLngValue;
    // The SVG icon value for the marker
    // If it's a string then it's the path code for the SVG icon.
    svgIcon?: SvgSymbolValue | string;
    // The tooltip for the marker. This will show when hovering over the marker.
    tooltip?: TooltipValue;
};

// Google Maps library marker events
type MarkerEvent =
    | 'animation_changed'
    | 'click'
    | 'clickable_changed'
    | 'contextmenu'
    | 'cursor_changed'
    | 'dblclick'
    | 'drag'
    | 'dragend'
    | 'draggable_changed'
    | 'dragstart'
    | 'flat_changed'
    | 'icon_changed'
    | 'mousedown'
    | 'mouseout'
    | 'mouseover'
    | 'mouseup'
    | 'position_changed'
    | 'ready'
    | 'shape_changed'
    | 'title_changed'
    | 'visible_changed'
    | 'zindex_changed';

/**
 * Marker class to set up a single marker and add it to the map
 */
export class Marker extends Layer {
    /**
     * Holds any custom data to attach to the marker object
     *
     * @private
     * @type {CustomData}
     */
    #customData: CustomData = {};

    /**
     * Holds if the marker is setting up
     *
     * @private
     * @type {boolean}
     */
    #isSettingUp: boolean = false;

    /**
     * Holds the Google maps marker object
     *
     * @private
     * @type {google.maps.Marker}
     */
    #marker: google.maps.Marker;

    /**
     * Holds the marker options
     *
     * @private
     * @type {GMMarkerOptions}
     */
    #options: GMMarkerOptions = {};

    /**
     * Constructor
     *
     * @param {LatLngValue|MarkerOptions} [position] The latitude longitude pair
     * @param {MarkerOptions} [options] The marker options
     */
    constructor(position?: LatLngValue | MarkerOptions, options?: MarkerOptions) {
        super('marker', 'Marker');

        // Set a default position
        this.#options.position = latLng([0, 0]);

        // Set the marker latitude and longitude value
        if (position instanceof LatLng || Array.isArray(position)) {
            // The value passed is a LatLng class object
            this.setPosition(position);
            // Set up the marker options
            if (isObject(options)) {
                this.setOptions(options);
            }
        } else if (isObject(position)) {
            // The value passed is a marker options object
            this.setOptions(position as MarkerOptions);
        }
    }

    /**
     * Get the anchor point for the marker
     *
     * @returns {Point}
     */
    get anchorPoint(): Point {
        return this.#options.anchorPoint;
    }

    /**
     * Set the anchor point for the marker
     *
     * @param {PointValue} value The anchor point for the marker
     */
    set anchorPoint(value: PointValue) {
        this.setAnchorPoint(value);
    }

    /**
     * Get the cursor type to show on hover
     *
     * @returns {string}
     */
    get cursor(): string {
        return this.#options.cursor;
    }

    /**
     * Set the cursor type to show on hover
     *
     * @param {string} value The cursor type to show on hover
     */
    set cursor(value: string) {
        this.setCursor(value);
    }

    /**
     * Get the custom data attached to the marker object
     *
     * @returns {CustomData}
     */
    get data(): CustomData {
        return this.#customData;
    }

    /**
     * Set custom data to attach to the marker object
     *
     * @param {CustomData} value The custom data to attach to the marker object
     */
    set data(value: CustomData) {
        if (isObject(value)) {
            this.#customData = value;
        }
    }

    /**
     * Get whether the marker can be dragged on the map
     *
     * @returns {boolean}
     */
    get draggable(): boolean {
        return this.#options.draggable ?? false;
    }

    /**
     * Set whether the marker can be dragged on the map
     *
     * @param {boolean} value Whether the marker can be dragged on the map
     */
    set draggable(value: boolean) {
        this.setDraggable(value);
    }

    /**
     * Get the icon for the marker
     *
     * @returns {Icon | SvgSymbol | string}
     */
    get icon(): Icon | SvgSymbol | string {
        return this.#options.icon;
    }

    /**
     * Set the icon for the marker
     *
     * @param {Icon | SvgSymbol | string} value The icon value for the marker
     */
    set icon(value: Icon | SvgSymbol | string) {
        this.setIcon(value);
    }

    /**
     * Get the label for the marker
     *
     * @returns {string | number | MarkerLabel}
     */
    get label(): string | number | MarkerLabel {
        return this.#options.label;
    }

    /**
     * Set the label for the marker
     *
     * @param {string | number | MarkerLabel} value The label value for the marker
     */
    set label(value: string | number | MarkerLabel) {
        this.setLabel(value);
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
     * @param {Map|null} value The map object. Set to null if you want to remove the marker from the map.
     */
    set map(value: Map | null) {
        this.setMap(value);
    }

    /**
     * Get the marker position
     *
     * @returns {LatLng}
     */
    get position(): LatLng {
        return this.#options.position;
    }

    /**
     * Set the latitude and longitude value for the marker
     *
     * @param {LatLngValue} value The latitude/longitude position for the marker
     */
    set position(value: LatLngValue) {
        this.setPosition(value);
    }

    /**
     * Get the title for the marker
     *
     * @returns {string}
     */
    get title(): string {
        return this.#options.title;
    }

    /**
     * Set the title for the marker
     *
     * @param {string} value The title for the marker
     */
    set title(value: string) {
        this.setTitle(value);
    }

    /**
     * Adds the marker to the map object
     *
     * Alternate of show()
     *
     * @param {Map} map The map object
     * @returns {Marker}
     */
    display(map: Map): Marker {
        this.setMap(map);
        return this;
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
     * Returns whether the marker can be dragged on the map
     *
     * @returns {boolean}
     */
    getDraggable(): boolean {
        return this.draggable;
    }

    /**
     * Get the marker position (i.e. the LatLng object)
     *
     * https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
     *
     * @returns {LatLng}
     */
    getPosition(): LatLng {
        return this.position;
    }

    /**
     * Hide the marker
     *
     * @returns {Marker}
     */
    hide(): Marker {
        this.map = null;
        return this;
    }

    /**
     * Initialize the marker
     *
     * This is used when another element (like a tooltip) needs to be attached to the marker,
     * but needs to make sure that the marker exists first.
     *
     * This is not intended to be called outside of this library.
     *
     * @internal
     * @returns {Promise<void>}
     */
    init(): Promise<void> {
        return new Promise((resolve) => {
            this.#setupGoogleMarker().then(() => {
                resolve();
            });
        });
    }

    /**
     * @inheritdoc
     */
    hasListener(type: MarkerEvent, callback?: EventCallback): boolean {
        return super.hasListener(type, callback);
    }

    /**
     * @inheritdoc
     */
    off(type?: MarkerEvent, callback?: EventCallback, options?: EventListenerOptions): void {
        super.off(type, callback, options);
    }

    /**
     * @inheritdoc
     */
    on(type: MarkerEvent, callback: EventCallback, config?: EventConfig): void {
        super.on(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    onImmediate(type: MarkerEvent, callback: EventCallback, config?: EventConfig): void {
        super.onImmediate(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    once(type: MarkerEvent, callback?: EventCallback, config?: EventConfig): void {
        super.once(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    onceImmediate(type: MarkerEvent, callback?: EventCallback, config?: EventConfig): void {
        super.onceImmediate(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    only(type: MarkerEvent, callback: EventCallback, config?: EventConfig): void {
        super.only(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    onlyOnce(type: MarkerEvent, callback: EventCallback, config?: EventConfig): void {
        super.onlyOnce(type, callback, config);
    }

    /**
     * Add an event listener for when the marker's animation changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onAnimationChanged(callback: EventCallback): void {
        this.on(MarkerEvents.ANIMATION_CHANGED, callback);
    }

    /**
     * Add an event listener for when the marker icon is clicked.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onClick(callback: EventCallback): void {
        this.on(MarkerEvents.CLICK, callback);
    }

    /**
     * Add an event listener for when the marker clickable property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onClickableChanged(callback: EventCallback): void {
        this.on(MarkerEvents.CLICKABLE_CHANGED, callback);
    }

    /**
     * Add an event listener for when the DOM context menu is triggered on the marker.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onContextMenu(callback: EventCallback): void {
        this.on(MarkerEvents.CONTEXT_MENU, callback);
    }

    /**
     * Add an event listener for when the marker cursor property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onCursorChanged(callback: EventCallback): void {
        this.on(MarkerEvents.CURSOR_CHANGED, callback);
    }

    /**
     * Add an event listener for when the marker is double clicked.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDblClick(callback: EventCallback): void {
        this.on(MarkerEvents.DBLCLICK, callback);
    }

    /**
     * Add an event listener for when the user drags the marker.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDrag(callback: EventCallback): void {
        this.on(MarkerEvents.DRAG, callback);
    }

    /**
     * Add an event listener for when the user stops dragging the marker.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDragEnd(callback: EventCallback): void {
        this.on(MarkerEvents.DRAG_END, callback);
    }

    /**
     * Add an event listener for when the marker draggable property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDraggableChanged(callback: EventCallback): void {
        this.on(MarkerEvents.DRAGGABLE_CHANGED, callback);
    }

    /**
     * Add an event listener for when the user starts dragging the marker.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDragStart(callback: EventCallback): void {
        this.on(MarkerEvents.DRAG_START, callback);
    }

    /**
     * Add an event listener for when the marker flat property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onFlatChanged(callback: EventCallback): void {
        this.on(MarkerEvents.FLAT_CHANGED, callback);
    }

    /**
     * Add an event listener for when the marker icon property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onIconChanged(callback: EventCallback): void {
        this.on(MarkerEvents.ICON_CHANGED, callback);
    }

    /**
     * Add an event listener for when the user's mouse is pressed down on the marker.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onMouseDown(callback: EventCallback): void {
        this.on(MarkerEvents.MOUSE_DOWN, callback);
    }

    /**
     * Add an event listener for when the user's mouse leaves the marker icon.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onMouseOut(callback: EventCallback): void {
        this.on(MarkerEvents.MOUSE_OUT, callback);
    }

    /**
     * Add an event listener for when the user's mouse enters the marker icon.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onMouseOver(callback: EventCallback): void {
        this.on(MarkerEvents.MOUSE_OVER, callback);
    }

    /**
     * Add an event listener for the mouseup event on the marker.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onMouseUp(callback: EventCallback): void {
        this.on(MarkerEvents.MOUSE_UP, callback);
    }

    /**
     * Add an event listener for when the marker's position property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onPositionChanged(callback: EventCallback): void {
        this.on(MarkerEvents.POSITION_CHANGED, callback);
    }

    /**
     * Add an event listener for when the marker is loaded and ready for use.
     *
     * @param {EventCallback} [callback] The callback function to call when the event is dispatched.
     */
    onReady(callback: EventCallback): void {
        this.on(MarkerEvents.READY, callback);
    }

    /**
     * Add an event listener for when the marker's shape property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onShapeChanged(callback: EventCallback): void {
        this.on(MarkerEvents.SHAPE_CHANGED, callback);
    }

    /**
     * Add an event listener for when the marker's title property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onTitleChanged(callback: EventCallback): void {
        this.on(MarkerEvents.TITLE_CHANGED, callback);
    }

    /**
     * Add an event listener for when the marker's visible property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onVisibleChanged(callback: EventCallback): void {
        this.on(MarkerEvents.VISIBLE_CHANGED, callback);
    }

    /**
     * Add an event listener for when the marker's zindex property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onZIndexChanged(callback: EventCallback): void {
        this.on(MarkerEvents.ZINDEX_CHANGED, callback);
    }

    /**
     * Set the anchor point for the marker
     *
     * @param {PointValue} value The anchor point for the marker
     * @returns {Promise<Marker>}
     */
    async setAnchorPoint(value: PointValue): Promise<Marker> {
        await this.#setupGoogleMarker();
        this.#setAnchorPoint(value);
        return this;
    }

    /**
     * Set the anchor point for the marker syncronously.
     *
     * Only use this if you know that the Google Maps library is already loaded and you have to set up the marker
     * syncronously. If you don't have to set up the marker syncronously, then use setAnchorPoint() instead or pass the
     * anchor point to the constructor or setOptions().
     *
     * @param {PointValue} value The anchor point for the marker
     * @returns {Marker}
     */
    setAnchorPointSync(value: PointValue): Marker {
        this.#setupGoogleMarkerSync();
        this.#setAnchorPoint(value);
        return this;
    }

    /**
     * Set the anchor point for the marker
     *
     * @param {PointValue} value The anchor point for the marker
     */
    #setAnchorPoint(value: PointValue) {
        const anchor = point(value);
        if (anchor.isValid()) {
            this.#options.anchorPoint = anchor;
        } else {
            this.#options.anchorPoint = undefined;
        }
        this.#marker.setOptions({ anchorPoint: this.#options.anchorPoint.toGoogle() });
    }

    /**
     * Set the cursor type to show on hover
     *
     * @param {string} value The cursor type to show on hover
     * @returns {Promise<Marker>}
     */
    async setCursor(value: string): Promise<Marker> {
        await this.#setupGoogleMarker();
        this.#setCursor(value);
        return this;
    }

    /**
     *  Set the cursor type to show on hover
     *
     * Only use this if you know that the Google Maps library is already loaded and you have to set up the marker
     * syncronously. If you don't have to set up the marker syncronously, then use setCursor() instead or pass the
     * cursor to the constructor or setOptions().
     *
     * @param {string} value The cursor type to show on hover
     * @returns {Marker}
     */
    setCursorSync(value: string): Marker {
        this.#setupGoogleMarkerSync();
        this.#setCursor(value);
        return this;
    }

    /**
     * Set the cursor for the marker
     *
     * @param {string} value The cursor type to show on hover
     */
    #setCursor(value: string) {
        if (isStringWithValue(value)) {
            this.#options.cursor = value;
        } else if (isNullOrUndefined(value)) {
            this.#options.cursor = undefined;
        }
        this.#marker.setCursor(this.#options.cursor);
    }

    /**
     * Set whether the marker can be dragged on the map
     *
     * @param {boolean} value Whether the marker can be dragged on the map
     * @returns {Promise<Marker>}
     */
    async setDraggable(value: boolean): Promise<Marker> {
        await this.#setupGoogleMarker();
        this.#setDraggable(value);
        return this;
    }

    /**
     * Set whether the marker can be dragged on the map
     *
     * Only use this if you know that the Google Maps library is already loaded and you have to set up the marker
     * syncronously. If you don't have to set up the marker syncronously, then use setDraggable() instead or pass the
     * draggable option to the constructor or setOptions().
     *
     * @param {boolean} value Whether the marker can be dragged on the map
     * @returns {Marker}
     */
    setDraggableSync(value: boolean): Marker {
        this.#setupGoogleMarkerSync();
        this.#setDraggable(value);
        return this;
    }

    /**
     * Set whether the marker can be dragged on the map
     *
     * @param {boolean} value Whether the marker can be dragged on the map
     */
    #setDraggable(value: boolean) {
        if (isBoolean(value)) {
            this.#options.draggable = value;
            this.#marker.setDraggable(value);
        }
    }

    /**
     * Set the icon value for the marker
     *
     * @param {Icon | SvgSymbol | string} value The icon for the marker
     * @returns {Marker}
     */
    async setIcon(value: Icon | SvgSymbol | string): Promise<Marker> {
        await this.#setupGoogleMarker();
        this.#setIcon(value);
        return this;
    }

    /**
     * Set the icon value for the marker syncronously.
     *
     * Only use this if you know that the Google Maps library is already loaded and you have to set up the marker
     * syncronously. If you don't have to set up the marker syncronously, then use setIcon() instead or pass the
     * icon to the constructor or setOptions().
     *
     * @param {Icon | SvgSymbol | string} value The icon for the marker
     * @returns {Marker}
     */
    setIconSync(value: Icon | SvgSymbol | string): Marker {
        this.#setupGoogleMarkerSync();
        this.#setIcon(value);
        return this;
    }

    /**
     * Set the latitude and longitude value for the marker
     *
     * @param {Icon | SvgSymbol | string} value The icon for the marker
     */
    #setIcon(value: Icon | SvgSymbol | string) {
        if (isString(value) || value instanceof Icon || value instanceof SvgSymbol) {
            this.#options.icon = value;
        } else if (isNullOrUndefined(value)) {
            this.#options.icon = undefined;
        }

        if (isString(this.#options.icon)) {
            this.#marker.setIcon(this.#options.icon);
        } else {
            if (this.#options.icon instanceof SvgSymbol) {
                this.#options.icon.toGoogle().then((markerIcon) => {
                    this.#marker.setIcon(markerIcon);
                });
            } else {
                this.#marker.setIcon(this.#options.icon.toGoogle());
            }
        }
    }

    /**
     * Set the label value for the marker
     *
     * @param {string | number | MarkerLabel} value The label for the marker
     * @returns {Marker}
     */
    async setLabel(value: string | number | MarkerLabel): Promise<Marker> {
        await this.#setupGoogleMarker();
        this.#setLabel(value);
        return this;
    }

    /**
     * Set the label value for the marker syncronously.
     *
     * Only use this if you know that the Google Maps library is already loaded and you have to set up the marker
     * syncronously. If you don't have to set up the marker syncronously, then use setLabel() instead or pass the
     * label to the constructor or setOptions().
     *
     * @param {string | number | MarkerLabel} value The label for the marker
     * @returns {Marker}
     */
    setLabelSync(value: string | number | MarkerLabel): Marker {
        this.#setupGoogleMarkerSync();
        this.#setLabel(value);
        return this;
    }

    /**
     * Set the latitude and longitude value for the marker
     *
     * @param {string | number | MarkerLabel} value The latitude/longitude position for the marker
     */
    #setLabel(value: string | number | MarkerLabel) {
        if (isStringWithValue(value)) {
            this.#options.label = value;
        } else if (isObject(value) && isStringOrNumber(value.text)) {
            this.#options.label = {
                text: value.text.toString()
            };
            if (isStringWithValue(value.className)) {
                this.#options.label.className = value.className;
            }
            if (isStringWithValue(value.color)) {
                this.#options.label.color = value.color;
            }
            if (isStringWithValue(value.fontFamily)) {
                this.#options.label.fontFamily = value.fontFamily;
            }
            if (isStringWithValue(value.fontWeight)) {
                this.#options.label.fontWeight = value.fontWeight;
            }
            // The font size must be a string with a unit. If it's a number then add "px" to the end of it
            if (isStringWithValue(value.fontSize) || isNumber(value.fontSize)) {
                if (isNumber(value.fontSize)) {
                    this.#options.label.fontSize = `${value.fontSize}px`;
                } else {
                    this.#options.label.fontSize = value.fontSize.toString();
                }
            }
        } else if (isNullOrUndefined(value)) {
            this.#options.label = undefined;
        }
        this.#marker.setLabel(this.#options.label);
    }

    /**
     * Adds the marker to the map object
     *
     * Alternate of show()
     *
     * @param {Map} map The map object. Set to null if you want to remove the marker from the map.
     * @returns {Promise<Marker>}
     */
    async setMap(map: Map | null): Promise<Marker> {
        await this.#setupGoogleMarker(map);
        this.#setMap(map);
        return this;
    }

    /**
     * Set the map object
     *
     * Only use this if you know that the Google Maps library is already loaded and you have to set up the marker
     * syncronously. If you don't have to set up the marker syncronously, then use setMap() instead or pass the
     * map to the constructor or setOptions().
     *
     * @param {Map|null} map The map object. Set to null if you want to remove the marker from the map.
     * @returns {Marker}
     */
    setMapSync(map: Map | null): Marker {
        this.#setupGoogleMarkerSync();
        this.#setMap(map);
        return this;
    }

    /**
     * Set the map object
     *
     * @param {Map|null} value The map object. Set to null if you want to remove the marker from the map.
     */
    #setMap(value: Map | null) {
        if (value instanceof Map) {
            // Set the map
            this.#options.map = value;
            super.setMap(value);
            this.#marker.setMap(value.toGoogle());
        } else if (isNullOrUndefined(value)) {
            // Remove the marker from the map
            this.#options.map = null;
            super.setMap(null);
            if (this.#marker) {
                this.#marker.setMap(null);
            }
        }
    }

    /**
     * Set the marker options
     *
     * @param {MarkerOptions} options The marker options
     * @returns {Marker}
     */
    setOptions(options: MarkerOptions): Marker {
        // Set the anchor point
        if (options.anchorPoint) {
            this.anchorPoint = options.anchorPoint;
        }

        // Set if the marker can be dragged
        if (typeof options.draggable === 'boolean') {
            this.draggable = options.draggable;
        }

        // Set the icon
        if (options.icon) {
            this.icon = icon(options.icon);
        } else if (options.svgIcon) {
            if (isString(options.svgIcon)) {
                this.icon = `data:image/svg+xml;base64,${btoa(options.svgIcon)}`;
            } else {
                this.icon = svgSymbol(options.svgIcon);
            }
        }

        // Set the label
        if (isStringWithValue(options.label) || (isObject(options.label) && isStringOrNumber(options.label.text))) {
            this.label = options.label;
        }

        // Set up the position
        if (
            isNumberOrNumberString(options.lat) ||
            isNumberOrNumberString(options.latitude) ||
            isNumberOrNumberString(options.lng) ||
            isNumberOrNumberString(options.longitude)
        ) {
            const latLngValue = latLng();
            if (isNumberOrNumberString(options.lat)) {
                latLngValue.lat = options.lat;
            } else if (isNumberOrNumberString(options.latitude)) {
                latLngValue.lat = options.latitude;
            }
            if (isNumberOrNumberString(options.lng)) {
                latLngValue.lng = options.lng;
            } else if (isNumberOrNumberString(options.longitude)) {
                latLngValue.lng = options.longitude;
            }
            this.position = latLngValue;
        } else if (options.position) {
            this.position = options.position;
        }

        // Set the title and tooltip
        if (options.tooltip) {
            let { tooltip } = options;
            if (options.title && isObject(tooltip) && !(tooltip instanceof HTMLElement || tooltip instanceof Text)) {
                // The title will be a custom tooltip that is added to the map container if the tooltip content isn't already set
                tooltip = { ...{ content: options.title }, ...tooltip };
            }
            this.attachTooltip(tooltip);
        } else if (options.title) {
            this.title = options.title;
        }

        // Set simple options
        const stringOptions = ['cursor'];
        stringOptions.forEach((key) => {
            if (options[key] && isStringWithValue(options[key])) {
                this.#options[key] = options[key];
            }
        });

        // Set the map. This must come last so that the other options are set.
        if (options.map) {
            this.setMap(options.map);
        }

        // Custom data
        if (options.data) {
            this.data = options.data;
        }

        return this;
    }

    /**
     * Set the latitude and longitude value for the marker
     *
     * @param {LatLngValue} value The latitude/longitude position for the marker
     * @returns {Promise<Marker>}
     */
    async setPosition(value: LatLngValue): Promise<Marker> {
        this.#setPosition(value);
        await this.#setupGoogleMarker();
        this.#setGoogleMarkerPosition();
        return this;
    }

    /**
     * Set the latitude and longitude value for the marker syncronously.
     *
     * Only use this if you know that the Google Maps library is already loaded and you have to set up the marker
     * syncronously. If you don't have to set up the marker syncronously, then use setPosition() instead or pass the
     * position to the constructor or setOptions().
     *
     * @param {LatLngValue} value The latitude/longitude position for the marker
     * @returns {Marker}
     */
    setPositionSync(value: LatLngValue): Marker {
        this.#setPosition(value);
        this.#setupGoogleMarkerSync();
        this.#setGoogleMarkerPosition();
        return this;
    }

    /**
     * Set the latitude and longitude value for the marker
     *
     * @param {LatLngValue} value The latitude/longitude position for the marker
     */
    #setPosition(value: LatLngValue) {
        const position = latLng(value);
        if (position.isValid()) {
            this.#options.position = position;
        }
    }

    /**
     * Set the position for the marker on the Google marker object
     */
    #setGoogleMarkerPosition() {
        this.#marker.setPosition(this.#options.position.toGoogle());
    }

    /**
     *Set the title for the marker
     *
     * @param {string} value The title to show on hover
     * @returns {Promise<Marker>}
     */
    async setTitle(value: string): Promise<Marker> {
        await this.#setupGoogleMarker();
        this.#setTitle(value);
        return this;
    }

    /**
     * Set the title for the marker
     *
     * Only use this if you know that the Google Maps library is already loaded and you have to set up the marker
     * syncronously. If you don't have to set up the marker syncronously, then use setTitle() instead or pass the
     * title to the constructor or setOptions().
     *
     * @param {string} value The title to show on hover
     * @returns {Marker}
     */
    setTitleSync(value: string): Marker {
        this.#setupGoogleMarkerSync();
        this.#setTitle(value);
        return this;
    }

    /**
     * Set the title for the marker
     *
     * @param {string} value The title to show on hover
     */
    #setTitle(value: string) {
        if (isStringWithValue(value)) {
            this.#options.title = value;
        } else if (isNullOrUndefined(value)) {
            this.#options.title = undefined;
        }
        this.#marker.setTitle(this.#options.title);
    }

    /**
     * Adds the marker to the map object
     *
     * Alternate of setMap()
     *
     * @param {Map} map The map object
     * @returns {Promise<Marker>}
     */
    show(map: Map): Promise<Marker> {
        return this.setMap(map);
    }

    /**
     * Get the Google maps marker object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker
     *
     * @returns {Promise<google.maps.Marker>}
     */
    toGoogle(): Promise<google.maps.Marker> {
        return new Promise((resolve) => {
            this.#setupGoogleMarker().then(() => {
                resolve(this.#marker);
            });
        });
    }

    /**
     * Get the Google maps marker object synchronously. Throw an error if the Google Maps library is not available.
     *
     * This is different from toGoogle() because it will throw an error if the Google Maps library is not available,
     * whereas toGoogle() will wait for the Google Maps library to load.
     *
     * Only use this when you have to get the Google Maps object synchronously and you know that the Google Maps library is already loaded.
     * If you don't have to get the Google Maps object synchronously, then use toGoogle() instead.
     *
     * @returns {google.maps.Marker}
     */
    toGoogleSync(): google.maps.Marker {
        this.#setupGoogleMarkerSync();
        return this.#marker;
    }

    /**
     * Set up the Google maps marker object if necessary
     *
     * @private
     * @param {Map} [map] The map object. If it's set then it will be initialized if the Google maps object isn't available yet.
     * @returns {Promise<void>}
     */
    #setupGoogleMarker(map?: Map): Promise<void> {
        return new Promise((resolve) => {
            if (!this.#isSettingUp && !isObject(this.#marker)) {
                this.#isSettingUp = true;
                if (checkForGoogleMaps('Marker', 'Marker', false)) {
                    this.#createMarkerObject().then(() => {
                        // Dispatch the event to say that the marker is ready
                        this.dispatch(MarkerEvents.READY);
                        resolve();
                    });
                } else {
                    // The Google maps object isn't available yet. Wait for it to load.
                    // The developer may have set the map on the marker before the Google maps object was available.
                    loader().onMapLoad(() => {
                        this.#createMarkerObject().then(() => {
                            // Make sure that the map is still set.
                            // It's unlikely, but possible, that the developer could have removed the map
                            // from the marker before the Google maps object was available.
                            const thisMap = this.getMap();
                            if (this.#marker && thisMap) {
                                this.#marker.setMap(thisMap.toGoogle());
                            } else if (this.#marker && map) {
                                this.#marker.setMap(map.toGoogle());
                            }
                            // Dispatch the event to say that the marker is ready
                            this.dispatch(MarkerEvents.READY);
                            resolve();
                        });
                    });

                    // Trigger the map to load if it's set.
                    if (map instanceof Map) {
                        map.init();
                    }
                }
            } else if (this.#isSettingUp && !isObject(this.#marker)) {
                // The marker is already being set up. Wait for it to finish.
                this.onceImmediate(MarkerEvents.READY, () => {
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    /**
     * Set up the Google maps marker object syncronously.
     */
    #setupGoogleMarkerSync(): void {
        if (!isObject(this.#marker)) {
            if (checkForGoogleMaps('Marker', 'Marker', false)) {
                this.#createMarkerObject();
            } else {
                throw new Error(
                    'The Google maps libray is not available so the marker object cannot be created. Load the Google maps library first.'
                );
            }
        }
    }

    /**
     * Create the marker object
     *
     * @private
     * @returns {Promise<void>}
     */
    #createMarkerObject(): Promise<void> {
        return new Promise((resolve) => {
            if (!this.#marker) {
                (async () => {
                    const markerOptions: google.maps.MarkerOptions = {};
                    // Options that can be set on the marker without any modification
                    const optionsToSet = ['cursor', 'title'];
                    optionsToSet.forEach((key) => {
                        if (typeof this.#options[key] !== 'undefined') {
                            markerOptions[key] = this.#options[key];
                        }
                    });

                    // Options that have to be converted to Google maps objects
                    if (this.#options.anchorPoint) {
                        markerOptions.anchorPoint = this.#options.anchorPoint.toGoogle();
                    }
                    if (this.#options.icon) {
                        if (isString(this.#options.icon)) {
                            markerOptions.icon = this.#options.icon;
                        } else if (this.#options.icon instanceof Icon || this.#options.icon instanceof SvgSymbol) {
                            markerOptions.icon = await this.#options.icon.toGoogle();
                        }
                    }
                    if (this.#options.map) {
                        markerOptions.map = this.#options.map.toGoogle();
                    }
                    if (this.#options.position) {
                        markerOptions.position = this.#options.position.toGoogle();
                    }

                    this.#marker = new google.maps.Marker(markerOptions);
                    this.setEventGoogleObject(this.#marker);
                    resolve();
                })();
            } else {
                resolve();
            }
        });
    }
}

// The possible values for the position parameter
export type MarkerValue = Marker | MarkerOptions | LatLngValue;

/**
 * Helper function to set up the marker object
 *
 * @param {MarkerValue} [position] The latitude/longitude pair or the marker options
 * @param {MarkerOptions} [options] The marker options
 * @returns {Marker}
 */
export const marker = (position?: MarkerValue, options?: MarkerOptions): Marker => {
    if (position instanceof Marker) {
        return position;
    }
    return new Marker(position, options);
};
