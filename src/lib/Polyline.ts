/* ===========================================================================
    Enables building a polyline on a Google map.

    https://developers.google.com/maps/documentation/javascript/shapes
    https://developers.google.com/maps/documentation/javascript/reference/polygon#Polyline
=========================================================================== */

/* global google */

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
    // Whether the polyline handles click events.
    clickable?: boolean;
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
    // The zIndex value compared to other polygons.
    zIndex?: number;
};

/**
 * Polyline class
 */
export class Polyline extends Layer {
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
     * Adds the polyline to the map object
     *
     * Alternate of show()
     *
     * @param {Map} value The map object. Set to null if you want to remove the polyline from the map.
     * @returns {Promise<Polyline>}
     */
    async setMap(value: Map | null): Promise<Polyline> {
        await this.#setupGooglePolyline();
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
            if (isNumberOrNumberString(options.zIndex)) {
                this.zIndex = options.zIndex;
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
     * @private
     */
    #setupGooglePolyline(): Promise<void> {
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
                        const map = this.getMap();
                        if (this.#polyline && map) {
                            this.#polyline.setMap(map.toGoogle());
                        }
                        resolve();
                    });
                }
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
            const optionsToSet = ['clickable', 'map', 'strokeColor', 'stokeOpacity', 'strokeWeight', 'zIndex'];
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
            console.log('Polyline created:', this.#polyline);
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
