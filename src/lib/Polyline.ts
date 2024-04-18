/* ===========================================================================
    Enables building a polyline on a Google map.

    https://developers.google.com/maps/documentation/javascript/shapes
    https://developers.google.com/maps/documentation/javascript/reference/polygon#Polyline
=========================================================================== */

/* global google */

import { EventCallback, EventConfig } from './Evented';
import { latLng, LatLng, LatLngValue } from './LatLng';
import Layer from './Layer';
import { loader } from './Loader';
import { Map } from './Map';
import {
    checkForGoogleMaps,
    isNullOrUndefined,
    isNumber,
    isNumberOrNumberString,
    isNumberString,
    isObject,
    isStringWithValue,
} from './helpers';

export type PolylineOptions = {
    // Whether the polyline handles click events. Defaults to true.
    clickable?: boolean;
    // The polyline to show below the existing one to create a "highlight" effect when the mouse hovers over this polyline.
    highlightPolyline?: PolylineOptions | Polyline; // eslint-disable-line no-use-before-define
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
     * Holds a polyline to show below the existing one to create a "highlight" effect
     * when the mouse hovers over this polyline.
     *
     * @private
     * @type {Polyline}
     */
    #highlightPolyline: Polyline; // eslint-disable-line no-use-before-define

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
                this.#highlightPolyline.setMap(this.getMap());

                // Set the hover events on this polyline to show and hide the highlight polyline.
                // Use setupEventListener instead of "on" so that this isn't added to the highlight polyline.
                this.setupEventListener('mouseover', () => {
                    this.#highlightPolyline.visible = true;
                });
                this.setupEventListener('mousemove', () => {
                    this.#highlightPolyline.visible = true;
                });

                // Set the mouseout event on the highlight polyline so that it stays in place longer.
                this.#highlightPolyline.on('mouseout', () => {
                    this.#highlightPolyline.visible = false;
                });
                // });
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
        if (isNumber(value)) {
            this.#options.strokeOpacity = value;
        } else if (isNumberString(value)) {
            this.#options.strokeOpacity = Number(value);
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
        if (isNumber(value)) {
            this.#options.strokeWeight = value;
        } else if (isNumberString(value)) {
            this.#options.strokeWeight = Number(value);
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
        if (isNumber(value)) {
            this.#options.zIndex = value;
        } else if (isNumberString(value)) {
            this.#options.zIndex = Number(value);
        }
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
     * Add an event listener to the Google maps object
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener function
     * @param {EventConfig} [config] Configuration for the event.
     */
    on(type: string, callback: EventCallback, config?: EventConfig): void {
        if (this.#highlightPolyline) {
            // Add the event to the highlight polyline as well
            this.#highlightPolyline.on(type, callback, config);
        }
        this.setupEventListener(type, callback, config);
    }

    /**
     *S et the highlight polyline
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
     * Adds the polyline to the map object
     *
     * Alternate of show()
     *
     * @param {Map} value The map object. Set to null if you want to remove the polyline from the map.
     * @returns {Promise<Polyline>}
     */
    async setMap(value: Map | null): Promise<Polyline> {
        if (this.#highlightPolyline) {
            this.#highlightPolyline.setMap(value);
        }
        await this.#setupGooglePolyline(value);
        if (value instanceof Map) {
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

            // Set up the highlight polyline last so that it can use the options set above.
            if (options.highlightPolyline) {
                this.setHighlightPolyline(options.highlightPolyline);
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
     * Get the Google maps Polyline object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/info-window#Polyline
     *
     * @returns {google.maps.Polyline}
     */
    toGoogle(): google.maps.Polyline {
        this.#setupGooglePolyline();
        return this.#polyline;
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
                    loader().once('map_loaded', () => {
                        this.#createPolylineObject();
                        // Make sure that the map is still set.
                        // It's unlikely, but possible, that the developer could have removed the map
                        // from the polyline before the Google maps object was available.
                        const thisMap = this.getMap();
                        if (this.#polyline && thisMap) {
                            this.#polyline.setMap(thisMap.toGoogle());
                            // Add the map to the highlight polyline as well if it exists
                            if (this.#highlightPolyline) {
                                this.#highlightPolyline.setMap(thisMap);
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
                'stokeOpacity',
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

            this.#polyline = new google.maps.Polyline(polylineOptions);
            this.setEventGoogleObject(this.#polyline);
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
