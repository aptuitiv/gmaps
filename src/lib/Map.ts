/* ===========================================================================
    Main class to hold the map object and set it up.

    https://developers.google.com/maps/documentation/javascript/reference/map
    https://developers.google.com/maps/documentation/javascript/load-maps-js-api

    If we want to use google.maps.marker.AdvancedMarkerElementOptions, we need to load the "marker" library.
    When we add support for Advanced Markers, make sure that "marker" in included in the libraries array.
    If there are code examples that use await google.maps.importLibrary(), the library that is loaded
    should be included in the libraries array to properly load.
    https://developers.google.com/maps/documentation/javascript/places

    See https://aptuitiv.github.io/gmaps-docs/api-reference/map for documentation.
=========================================================================== */

/* global google, HTMLElement */

import { convertControlPosition, ControlPositionValue, MapTypeId, MapTypeIdValue } from './constants';
import { loader } from './Loader';
import { LatLngBounds, latLngBounds, LatLngBoundsValue } from './LatLngBounds';
import {
    callCallback,
    checkForGoogleMaps,
    isBoolean,
    isDefined,
    isFunction,
    isNull,
    isNumber,
    isNumberOrNumberString,
    isNumberString,
    isObject,
    isStringWithValue,
} from './helpers';
import { LatLng, latLng, LatLngValue } from './LatLng';
import { Evented, EventCallback, EventConfig, EventListenerOptions } from './Evented';
import { fullscreenControl, FullscreenControl } from './Map/FullscreenControl';
import { mapRestriction, MapRestriction, MapRestrictionValue } from './Map/MapRestriction';
import { mapTypeControl, MapTypeControl } from './Map/MapTypeControl';
import { mapStyle, MapStyle } from './Map/MapStyle';
import { GMMapOptions, LocationOnSuccess, LocateOptions, LocationPosition, MapOptions } from './Map/types';
import { rotateControl, RotateControl } from './Map/RotateControl';
import { scaleControl, ScaleControl } from './Map/ScaleControl';
import { streetViewControl, StreetViewControl } from './Map/StreetViewControl';

// Based on google.maps.MapTypeId
export type MapType = 'hybrid' | 'roadmap' | 'satellite' | 'terrain';

// Map events that are not part of the Google Maps API
type InternalEvent = 'locationerror' | 'locationfound' | 'visible';
// Google Maps library map events
type GMEvent =
    | 'bounds_changed'
    | 'center_changed'
    | 'click'
    | 'contextmenu'
    | 'dblclick'
    | 'drag'
    | 'dragend'
    | 'dragstart'
    | 'heading_changed'
    | 'idle'
    | 'isfractionalzoomenabled_changed'
    | 'mapcapabilities_changed'
    | 'maptypeid_changed'
    | 'mousemove'
    | 'mouseout'
    | 'mouseover'
    | 'projection_changed'
    | 'renderingtype_changed'
    | 'tilesloaded'
    | 'tilt_changed'
    | 'zoom_changed';

// All possible map events
type MapEvent = GMEvent | InternalEvent;

type CustomControl = {
    position: ControlPositionValue;
    element: HTMLElement;
};

/**
 * The map class
 */
export class Map extends Evented {
    /**
     * The bounds to fit the map to
     *
     * @private
     * @type {LatLngBounds}
     */
    #bounds: LatLngBounds;

    /**
     * Holds the custom controls that need to be added to the map
     *
     * @private
     * @type {CustomControl[]}
     */
    #customControls: CustomControl[] = [];

    /**
     * Holds the fullscreen control object
     *
     * @private
     * @type {FullscreenControl}
     */
    #fullscreenControl: FullscreenControl;

    /**
     * Holds the latitude portion of the center point for the map
     *
     * @private
     * @type {number}
     */
    #latitude: number = 0;

    /**
     * Holds the longitude portion of the center point for the map
     *
     * @private
     * @type {number}
     */
    #longitude: number = 0;

    /**
     * Holds if the map is getting the map options
     *
     * @private
     * @type {boolean}
     */
    #isGettingMapOptions: boolean = false;

    /**
     * Holds if the map is initialized or not
     *
     * @private
     * @type {boolean}
     */
    #isInitialized: boolean = false;

    /**
     * Holds if the map is initializing
     *
     * @private
     * @type {boolean}
     */
    #isInitializing: boolean = false;

    /**
     * Holds if the layer is visible or not
     *
     * @private
     * @type {boolean}
     */
    #isVisible: boolean = false;

    /**
     * Holds the Google map object
     *
     * @private
     * @type {google.maps.Map}
     */
    #map: google.maps.Map;

    /**
     * Holds the map type control object
     *
     * @private
     * @type {MapTypeControl}
     */
    #mapTypeControl: MapTypeControl;

    /**
     * Holds the map options
     *
     * @private
     * @type {GMMapOptions}
     */
    #options: GMMapOptions = {};

    /**
     * Holds the map restriction object to restrict the map to a certain area
     *
     * @private
     * @type {MapRestriction}
     */
    #restriction: MapRestriction;

    /**
     * Holds the rotate control object
     *
     * @private
     * @type {RotateControl}
     */
    #rotateControl: RotateControl;

    /**
     * Holds the scale control object
     *
     * @private
     * @type {ScaleControl}
     */
    #scaleControl: ScaleControl;

    /**
     * Holds the selector of the element that the map will be rendered in. Or the HTMLElement that the map will be rendered in.
     *
     * @private
     * @type {string|HTMLElement}
     */
    #selector: string | HTMLElement;

    /**
     * Holds the street view control object
     *
     * @private
     * @type {StreetViewControl}
     */
    #streetViewControl: StreetViewControl;

    /**
     * Holds the styles to apply to the map
     *
     * @private
     * @type {MapStyle[]}
     */
    #styles?: MapStyle[] = [];

    /**
     * Holds the watchId for the watchPosition() function
     *
     * @private
     * @type {number}
     */
    #watchId: number;

    /**
     * Class constructor
     *
     * @param {string|HTMLElement} selector The selector of the element that the map will be rendered in. Or the HTMLElement that the map will be rendered in.
     *      The selector can be any valid selector for document.querySelector() can be used. Or, it can be an HTML element
     * @param {MapOptions} [options] The options object for the map
     */
    constructor(selector: string | HTMLElement, options?: MapOptions) {
        super('map', 'Map');

        // Set some default values
        this.#options.mapTypeId = MapTypeId.ROADMAP;
        this.#options.center = latLng(0, 0);
        this.#options.zoom = 6;
        this.#fullscreenControl = fullscreenControl();
        this.#mapTypeControl = mapTypeControl();
        this.#rotateControl = rotateControl();
        this.#scaleControl = scaleControl();
        this.#streetViewControl = streetViewControl();

        this.#selector = selector;
        if (isObject(options)) {
            this.setOptions(options);
        }
    }

    /**
     * Get the center point for the map
     *
     * @returns {LatLng}
     */
    get center(): LatLng {
        let { center } = this.#options;
        if (this.#map) {
            const mapCenter = this.#map.getCenter();
            center = latLng(mapCenter.lat(), mapCenter.lng());
        }
        if (!center.equals(this.#options.center)) {
            this.#options.center = center;
        }
        return this.#options.center;
    }

    /**
     * Set the center point for the map
     *
     * @param {LatLngValue} value The center point for the map
     */
    set center(value: LatLngValue) {
        const center = latLng(value);
        if (center.isValid()) {
            this.#options.center = center;
            this.#latitude = center.lat;
            this.#longitude = center.lng;
            if (isObject(this.#map)) {
                this.#map.setCenter(this.#options.center.toGoogle());
            }
        }
    }

    /**
     * Get whether the default UI is disabled
     *
     * @returns {boolean}
     */
    get disableDefaultUI(): boolean {
        return this.#options.disableDefaultUI ?? false;
    }

    /**
     * Set whether the default UI is disabled
     *
     * @param {boolean} value Whether the default UI is disabled
     */
    set disableDefaultUI(value: boolean) {
        if (isBoolean(value)) {
            this.#options.disableDefaultUI = value;
            if (this.#map) {
                this.#map.setOptions({ disableDefaultUI: value });
            }
        }
    }

    /**
     * Get the fullscreen control object
     *
     * @returns {FullscreenControl}
     */
    get fullscreenControl(): FullscreenControl {
        return this.#fullscreenControl;
    }

    /**
     * Set the fullscreen control object, or whether to display the fullscreen control
     *
     * @param {boolean|FullscreenControl} value The fullscreen control option
     */
    set fullscreenControl(value: boolean | FullscreenControl) {
        if (isBoolean(value)) {
            this.#fullscreenControl.enabled = value;
        } else if (value instanceof FullscreenControl) {
            this.#fullscreenControl = value;
        }

        if (this.#map) {
            this.#fullscreenControl.toGoogle().then((fullscreenControlOptions) => {
                this.#map.setOptions({
                    fullscreenControl: this.#fullscreenControl.enabled,
                    fullscreenControlOptions,
                });
            });
        }
    }

    /**
     * Get the latitude value for the center point
     *
     * @returns {number}
     */
    get latitude(): number {
        return this.#latitude;
    }

    /**
     * Set the latitude value for the center point
     *
     * @param {string|number} value The latitude value
     */
    set latitude(value: string | number) {
        if (isNumberOrNumberString(value)) {
            if (isNumber(value)) {
                this.#latitude = value;
            } else {
                this.#latitude = Number(value);
            }
            this.center = { lat: this.#latitude, lng: this.#longitude };
        }
    }

    /**
     * Get the longitude value for the center point
     *
     * @returns {number}
     */
    get longitude(): number {
        return this.#longitude;
    }

    /**
     * Set the longitude value for the center point
     *
     * @param {string|number} value The longitude value
     */
    set longitude(value: string | number) {
        if (isNumberOrNumberString(value)) {
            if (isNumber(value)) {
                this.#longitude = value;
            } else {
                this.#longitude = Number(value);
            }
            this.center = { lat: this.#latitude, lng: this.#longitude };
        }
    }

    /**
     * Get the map type control object
     *
     * @returns {MapTypeControl}
     */
    get mapTypeControl(): MapTypeControl {
        return this.#mapTypeControl;
    }

    /**
     * Set the map type control object, or whether to display the map type control
     *
     * @param {boolean|MapTypeControl} value The map type control option
     */
    set mapTypeControl(value: boolean | MapTypeControl) {
        if (isBoolean(value)) {
            this.#mapTypeControl.enabled = value;
        } else if (value instanceof MapTypeControl) {
            this.#mapTypeControl = value;
        }

        if (this.#map) {
            this.#mapTypeControl.toGoogle().then((mapTypeControlOptions) => {
                this.#map.setOptions({
                    mapTypeControl: this.#mapTypeControl.enabled,
                    mapTypeControlOptions,
                });
            });
        }
    }

    /**
     * Get the map type ID
     *
     * @returns {string}
     */
    get mapTypeId(): string {
        let { mapTypeId } = this.#options;
        if (this.#map) {
            mapTypeId = this.#map.getMapTypeId();
        }
        if (isStringWithValue(mapTypeId) && mapTypeId !== this.#options.mapTypeId) {
            this.#options.mapTypeId = mapTypeId;
        }
        return this.#options.mapTypeId;
    }

    /**
     * Set the map type ID
     *
     * @param {string} value The map type ID
     */
    set mapTypeId(value: string) {
        if (isStringWithValue(value)) {
            this.#options.mapTypeId = value;
            if (this.#map) {
                this.#map.setMapTypeId(value);
            }
        }
    }

    /**
     * Get the maximum zoom level for the map
     *
     * @returns {null|number}
     */
    get maxZoom(): null | number {
        return this.#options.maxZoom ?? null;
    }

    /**
     * Set the maximum zoom level for the map
     *
     * @param {null|number} value The maximum zoom level
     */
    set maxZoom(value: null | number) {
        if (isNumber(value) || isNull(value)) {
            this.#options.maxZoom = value;
            if (this.#map) {
                this.#map.setOptions({ maxZoom: value });
            }
        }
    }

    /**
     * Get the minimum zoom level for the map
     *
     * @returns {null|number}
     */
    get minZoom(): null | number {
        return this.#options.minZoom ?? null;
    }

    /**
     * Set the minimum zoom level for the map
     *
     * @param {null|number} value The minimum zoom level
     */
    set minZoom(value: null | number) {
        if (isNumber(value) || isNull(value)) {
            this.#options.minZoom = value;
            if (this.#map) {
                this.#map.setOptions({ minZoom: value });
            }
        }
    }

    /**
     * Get the MapRestriction object if it's been set
     *
     * @returns {MapRestriction|undefined}
     */
    get restriction(): MapRestriction | undefined {
        return this.#restriction;
    }

    /**
     * Set the MapRestriction value
     *
     * @param {MapRestrictionValue} value The MapRestriction value
     */
    set restriction(value: MapRestrictionValue) {
        this.#restriction = mapRestriction(value);
        if (this.#map && this.#restriction.isValid() && this.#restriction.isEnabled()) {
            this.#restriction.toGoogle().then((restriction) => {
                this.#map.setOptions({ restriction });
            });
        }
    }

    /**
     * Get the rotate control object
     *
     * @returns {RotateControl}
     */
    get rotateControl(): RotateControl {
        return this.#rotateControl;
    }

    /**
     * Set the rotate control object, or whether to display the rotate control
     *
     * @param {boolean|RotateControl} value The rotate control option
     */
    set rotateControl(value: boolean | RotateControl) {
        if (isBoolean(value)) {
            this.#rotateControl.enabled = value;
        } else if (value instanceof RotateControl) {
            this.#rotateControl = value;
        }

        if (this.#map) {
            this.#rotateControl.toGoogle().then((rotateControlOptions) => {
                this.#map.setOptions({
                    rotateControl: this.#rotateControl.enabled,
                    rotateControlOptions,
                });
            });
        }
    }

    /**
     * Get the scale control object
     *
     * @returns {ScaleControl}
     */
    get scaleControl(): ScaleControl {
        return this.#scaleControl;
    }

    /**
     * Set the scale control object, or whether to display the scale control
     *
     * @param {boolean|ScaleControl} value The scale control option
     */
    set scaleControl(value: boolean | ScaleControl) {
        if (isBoolean(value)) {
            this.#scaleControl.enabled = value;
        } else if (value instanceof ScaleControl) {
            this.#scaleControl = value;
        }

        if (this.#map) {
            this.#scaleControl.toGoogle().then((scaleControlOptions) => {
                this.#map.setOptions({
                    scaleControl: this.#scaleControl.enabled,
                    scaleControlOptions,
                });
            });
        }
    }

    /**
     * Get the street view control object
     *
     * @returns {StreetViewControl}
     */
    get streetViewControl(): StreetViewControl {
        return this.#streetViewControl;
    }

    /**
     * Set the street view control object, or whether to display the scale control
     *
     * @param {boolean|StreetViewControl} value The scale control option
     */
    set streetViewControl(value: boolean | StreetViewControl) {
        if (isBoolean(value)) {
            this.#streetViewControl.enabled = value;
        } else if (value instanceof StreetViewControl) {
            this.#streetViewControl = value;
        }

        if (this.#map) {
            this.#streetViewControl.toGoogle().then((streetViewControlOptions) => {
                this.#map.setOptions({
                    streetViewControl: this.#streetViewControl.enabled,
                    streetViewControlOptions,
                });
            });
        }
    }

    /**
     * Get the zoom level for the map
     *
     * @returns {number}
     */
    get zoom(): number {
        let { zoom } = this.#options;
        if (this.#map) {
            zoom = this.#map.getZoom();
        }
        if (isNumber(zoom) && zoom !== this.#options.zoom) {
            this.#options.zoom = zoom;
        }
        return this.#options.zoom;
    }

    /**
     * Set the zoom level for the map
     *
     * @param {number|string} value The zoom level
     */
    set zoom(value: number | string) {
        if (isNumber(value)) {
            this.#options.zoom = value;
        } else if (isNumberString(value)) {
            this.#options.zoom = Number(value);
        }

        if (this.#map) {
            this.#map.setZoom(Number(value));
        }
    }

    /**
     * Adds a custom control to the map
     *
     * @param {ControlPositionValue} position The position to add the custom control
     * @param {HTMLElement} element The HTML element for the custom control
     * @returns {Map}
     */
    addCustomControl(position: ControlPositionValue, element: HTMLElement): Map {
        if (this.#map) {
            this.#map.controls[convertControlPosition(position)].push(element);
        } else {
            this.#customControls.push({ position, element });
        }
        return this;
    }

    /**
     * Add a value to the map bounds
     *
     * @param {LatLngValue | LatLngValue[]} value The latitude/longitude value to add to the bounds
     * @returns {Map}
     */
    addToBounds(value: LatLngValue | LatLngValue[]): Map {
        if (!this.#bounds) {
            this.#bounds = latLngBounds();
        }
        this.#bounds.extend(value);
        return this;
    }

    /**
     * Clear the existing bounds
     *
     * @returns {Map}
     */
    clearBounds(): Map {
        this.#bounds = latLngBounds();
        return this;
    }

    /**
     * Enable the default UI
     *
     * @returns {Map}
     */
    enableDefaultUI(): Map {
        this.disableDefaultUI = false;
        return this;
    }

    /**
     * Disable the default UI
     *
     * @returns {Map}
     */
    doDisableDefaultUI(): Map {
        this.disableDefaultUI = true;
        return this;
    }

    /**
     * Show the map
     *
     * Alias to show()
     *
     * @param {Function} callback The callback function to call after the map loads
     * @returns {Promise<Map>}
     */
    display(callback?: () => void): Promise<Map> {
        return this.show(callback);
    }

    /**
     * Sets the viewport to contain the given bounds.
     *
     * The bounds parameter can be:
     * - a LatLngBounds object
     * - an array of [lat, lng] pairs: [[lat, lng], [lat, lng], ...]
     * - an array of {lat, lng} objects (LatLngLiteral[]): [{lat, lng}, {lat, lng}, ...]
     * - an array of LatLng objects: [LatLng, LatLng, ...]
     * - a LatLng object
     * - a [lat, lng] pair
     * - a {lat, lng} object (LatLngLiteral)
     *
     * @see https://developers.google.com/maps/documentation/javascript/reference/map#Map.fitBounds
     *
     * Usage:
     * Add marks to the map.
     * Then call map.fitBounds() to set the viewport to contain the markers.
     * @param {LatLngBoundsValue} bounds The bounds to fit
     * @returns {Map}
     */
    fitBounds(bounds?: LatLngBoundsValue): Map {
        if (bounds) {
            latLngBounds(bounds)
                .toGoogle()
                .then((googleBounds) => {
                    this.#map.fitBounds(googleBounds);
                });
        } else if (this.#bounds) {
            this.#bounds.toGoogle().then((googleBounds) => {
                this.#map.fitBounds(googleBounds);
            });
        }
        return this;
    }

    /**
     * Alias to fitBounds
     *
     * @param {LatLngBoundsValue} bounds The bounds to fit
     * @returns {Map}
     */
    fitToBounds(bounds?: LatLngBoundsValue): Map {
        return this.fitBounds(bounds);
    }

    /**
     * Initialize the map if necessary
     *
     * This is not intended to be called outside of this library.
     *
     * This is called by other objects that depend on the map being initialized before doing their thing.
     * For example, attaching a tooltip to a map will wait for the map to be initialized before attaching the tooltip.
     *
     * @internal
     * @param {Function} callback The callback function to call after the map loads
     * @returns {Promise<void>}
     */
    init(callback?: () => void): Promise<Map> {
        return new Promise((resolve) => {
            if (!this.#isInitialized && !this.#isVisible) {
                // The map has not been initialized or displayed
                if (!this.#isInitializing) {
                    // The map is not initializing, so start the initialization process
                    this.#isInitializing = true;
                    this.#load(() => {
                        callCallback(callback);
                        resolve(this);
                    });
                } else {
                    // The map is initializing, so wait for it to finish
                    this.onceImmediate('visible', () => {
                        callCallback(callback);
                        resolve(this);
                    });
                }
            } else {
                callCallback(callback);
                resolve(this);
            }
        });
    }

    /**
     * Get the map options for showing the map
     *
     * @private
     * @returns {google.maps.MapOptions}
     */
    #getMapOptions(): Promise<google.maps.MapOptions> {
        return new Promise((resolve) => {
            const mapOptions: google.maps.MapOptions = {};
            // Boolean options that can be set on the map without any modification
            const booleanOptions = [
                'clickableIcons',
                'disableDefaultUI',
                'headingInteractionEnabled',
                'isFractionalZoomEnabled',
                'keyboardShortcuts',
                'noClear',
                'scrollwheel',
                'tiltInteractionEnabled',
            ];
            booleanOptions.forEach((key) => {
                if (isBoolean(this.#options[key])) {
                    mapOptions[key] = this.#options[key];
                }
            });
            // Number options that can be set on the map without any modification
            const numberOptions = ['controlSize', 'heading', 'maxZoom', 'minZoom', 'tilt', 'zoom'];
            numberOptions.forEach((key) => {
                if (isNumberOrNumberString(this.#options[key])) {
                    mapOptions[key] = this.#options[key];
                }
            });
            // String options that can be set on the map without any modification
            const stringOptions = ['backgroundColor', 'draggableCursor', 'draggingCursor', 'gestureHandling', 'mapId'];
            stringOptions.forEach((key) => {
                if (isStringWithValue(this.#options[key])) {
                    mapOptions[key] = this.#options[key];
                }
            });
            // Other options that can be set on the map without any modification
            const optionsToSet = ['renderingType', 'streetView'];
            optionsToSet.forEach((key) => {
                if (typeof this.#options[key] !== 'undefined') {
                    mapOptions[key] = this.#options[key];
                }
            });

            // If the mapTypeId is set then make sure that it's one of the map types supported
            // in the MapTypeControl object
            if (isStringWithValue(this.#options.mapTypeId)) {
                if (this.#mapTypeControl.hasMapType(this.#options.mapTypeId as MapTypeIdValue)) {
                    mapOptions.mapTypeId = this.#options.mapTypeId;
                } else {
                    // eslint-disable-next-line no-console
                    console.warn(
                        'The selected mapTypeId is not one of the allowed types set for the MapType Control.',
                        this.#options.mapTypeId
                    );
                }
            }

            // Options that have to be converted to Google Maps objects but are not async
            mapOptions.center = this.#options.center.toGoogle();

            // Get async map options
            (async () => {
                // Full screen control
                mapOptions.fullscreenControl = this.#fullscreenControl.enabled;
                const fullscreenControlOptions = await this.#fullscreenControl.toGoogle();
                mapOptions.fullscreenControlOptions = fullscreenControlOptions;
                // Map type control
                mapOptions.mapTypeControl = this.#mapTypeControl.enabled;
                const mapTypeControlOptions = await this.#mapTypeControl.toGoogle();
                mapOptions.mapTypeControlOptions = mapTypeControlOptions;
                // Restrictions
                if (this.#restriction && this.#restriction.isValid() && this.#restriction.isEnabled()) {
                    const restriction = await this.#restriction.toGoogle();
                    mapOptions.restriction = restriction;
                }
                // Rotate control
                mapOptions.rotateControl = this.#rotateControl.enabled;
                const rotateControlOptions = await this.#rotateControl.toGoogle();
                mapOptions.rotateControlOptions = rotateControlOptions;
                // Scale control
                mapOptions.scaleControl = this.#scaleControl.enabled;
                const scaleControlOptions = await this.#scaleControl.toGoogle();
                mapOptions.scaleControlOptions = scaleControlOptions;
                // Street view control
                mapOptions.streetViewControl = this.#streetViewControl.enabled;
                const streetViewControlOptions = await this.#streetViewControl.toGoogle();
                mapOptions.streetViewControlOptions = streetViewControlOptions;
                // Map styles
                if (this.#styles.length > 0) {
                    mapOptions.styles = this.#styles.map((style) => style.toGoogle());
                }
                resolve(mapOptions);
            })();
        });
    }

    /**
     * Gets the lat/lng bounds of the current map viewport
     *
     * If the map is not yet initialized, this will return undefined.
     *
     * @returns {Promise<LatLngBounds | undefined>}
     */
    getBounds(): Promise<LatLngBounds | undefined> {
        return new Promise((resolve) => {
            if (this.#map) {
                const bounds = new LatLngBounds();
                bounds.union(this.#map.getBounds()).then(() => {
                    resolve(bounds);
                });
            } else {
                resolve(undefined);
            }
        });
    }

    /**
     * Get the center point for the map
     *
     * @returns {LatLng}
     */
    getCenter(): LatLng {
        return this.center;
    }

    /**
     * Get the div element that the map is rendered in.
     * If the map is not yet initialized, this will return undefined.
     *
     * @returns {HTMLElement|undefined}
     */
    getDiv(): HTMLElement | undefined {
        if (this.#map) {
            return this.#map.getDiv();
        }
        return undefined;
    }

    /**
     * Gets whether the map is visible. This also means that the map library is loaded.
     *
     * @returns {boolean}
     */
    getIsVisible(): boolean {
        return this.#isVisible;
    }

    /**
     * Gets the current projection for the map.
     *
     * If the map is not yet initialized, this will return undefined.
     *
     * @returns {google.maps.Projection|undefined}
     */
    getProjection(): google.maps.Projection | undefined {
        if (this.#map) {
            return this.#map.getProjection();
        }
        return undefined;
    }

    /**
     * Get the zoom level
     *
     * @returns {number}
     */
    getZoom(): number {
        return this.zoom;
    }

    /**
     * Load and show the map
     *
     * There are two ways to respond when the map loads:
     * 1. Pass a callback function to the load() function
     *   map.load(() => {
     *     // Do something after the map loads
     *   });
     * 2. Listen for the 'visible' event
     *   map.on('visible', () => {
     *      // Do something after the map loads
     *   });
     * 2a. Use the once() function to listen for the 'visible' event only once. The event
     *     listener will be removed after the event is dispatched.
     *   map.once('visible', () => {
     *     // Do something after the map loads
     *   });
     *
     * This is different from show() in that it loads the Google Maps API if it hasn't been loaded yet,
     * and then it will show the map. The show() function depends on G.loader to load the map first.
     *
     * @param {Function} callback The callback function to call after the map loads
     * @returns {Promise<void>}
     */
    load(callback?: () => void): Promise<Map> {
        return this.init(callback);
    }

    /**
     * Load and show the map
     *
     * @param {Function} callback The callback function to call after the map loads
     * @returns {Promise<void>}
     */
    #load(callback?: () => void): Promise<void> {
        return new Promise((resolve, reject) => {
            loader()
                .load()
                .then(() => {
                    this.#showMap().then(() => {
                        callCallback(callback);
                        resolve();
                    });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * Try to locate the user using the GeoLocation API
     *
     * There are two ways to handle when the user's location is found:
     * 1. Pass a callback function to the locate() function
     *  map.locate({}, (position) => {
     *    // Do something with the position
     *  });
     * 2. Listen for the 'locationfound' event
     *  map.on('locationfound', (event) => {
     *   // Do something with the position
     *   // event is an instance of CustomEvent.
     *   // event.detail contains the position data
     *  });
     *
     * @param {LocateOptions|LocationOnSuccess} [options] The options for the locate() function. Or the callback function.
     * @param {Function} [onSuccess] The callback function for when the user's location is found.
     * @returns {Map}
     */
    locate(options?: LocateOptions | LocationOnSuccess, onSuccess?: LocationOnSuccess): Map {
        if (navigator.geolocation) {
            const defaultOptions = {
                watch: true,
            };
            let config = defaultOptions;
            if (isObject(options)) {
                config = { ...defaultOptions, ...options };
            }
            const positionOptions: PositionOptions = {
                enableHighAccuracy: false,
                maximumAge: 0,
                timeout: Infinity,
                ...config,
            };
            const success = (position: GeolocationPosition) => {
                const { latitude, longitude } = position.coords;
                const data: LocationPosition = {
                    latitude,
                    longitude,
                    latLng: latLng(latitude, longitude),
                    timestamp: position.timestamp,
                };
                Object.keys(position.coords).forEach((key) => {
                    if (typeof position.coords[key] === 'number') {
                        data[key] = position.coords[key];
                    }
                });
                this.dispatch('locationfound', data);
                if (isFunction(onSuccess)) {
                    onSuccess(data);
                } else if (isFunction(options)) {
                    options(data);
                }
            };
            const error = (err: GeolocationPositionError) => {
                this.dispatch('locationerror', err);
                // eslint-disable-next-line no-console
                console.error(err);
            };
            if (config.watch) {
                this.#watchId = navigator.geolocation.watchPosition(success, error, positionOptions);
            } else {
                navigator.geolocation.getCurrentPosition(success, error, positionOptions);
            }
        } else {
            // eslint-disable-next-line no-console
            console.error('Geolocation is not supported by this browser.');
        }
        return this;
    }

    /**
     * @inheritdoc
     */
    hasListener(type: MapEvent, callback?: EventCallback): boolean {
        return super.hasListener(type, callback);
    }

    /**
     * @inheritdoc
     */
    off(type?: MapEvent, callback?: EventCallback, options?: EventListenerOptions): void {
        super.off(type, callback, options);
    }

    /**
     * @inheritdoc
     */
    on(type: MapEvent, callback: EventCallback, config?: EventConfig): void {
        super.on(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    onImmediate(type: MapEvent, callback: EventCallback, config?: EventConfig): void {
        super.onImmediate(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    once(type: MapEvent, callback?: EventCallback, config?: EventConfig): void {
        super.once(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    onceImmediate(type: MapEvent, callback?: EventCallback, config?: EventConfig): void {
        super.onceImmediate(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    only(type: MapEvent, callback: EventCallback, config?: EventConfig): void {
        super.only(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    onlyOnce(type: MapEvent, callback: EventCallback, config?: EventConfig): void {
        super.onlyOnce(type, callback, config);
    }

    /**
     * Changes the center of the map by the given distance in pixels.
     *
     * @param {number} x The number of pixels to move the map in the x direction
     * @param {number} y The number of pixels to move the map in the y direction
     */
    panBy(x: number, y: number): void {
        if (this.#map) {
            this.#map.panBy(x, y);
        } else {
            this.init().then(() => {
                this.#map.panBy(x, y);
            });
        }
    }

    /**
     * Changes the center of the map to the lat/lng value.
     *
     * If the change is less than both the width and height of the map, the transition will be smoothly animated.
     *
     * @param {LatLngValue} value The latitude/longitude value to pan to
     */
    panTo(value: LatLngValue): void {
        if (this.#map) {
            this.#map.panTo(latLng(value).toGoogle());
        } else {
            this.init().then(() => {
                this.#map.panTo(latLng(value).toGoogle());
            });
        }
    }

    /**
     * Set the API key
     *
     * @param {string} key The API key
     * @returns {Map}
     */
    setApiKey(key: string): Map {
        if (isStringWithValue(key)) {
            loader().apiKey = key;
        } else {
            throw new Error('You must pass a valid API key');
        }
        return this;
    }

    /**
     * Set the center point for the map
     *
     * @param {number|LatLngValue} latitude The latitude value or the latitude/longitude pair
     * @param {number} [longitude] The longitude value
     * @returns {Map}
     */
    setCenter(latitude: number | LatLngValue, longitude?: number): Map {
        const center = latLng(latitude, longitude);
        if (center.isValid()) {
            this.#options.center = center;
            this.#latitude = center.lat;
            this.#longitude = center.lng;
            if (isObject(this.#map)) {
                this.#map.setCenter(this.#options.center.toGoogle());
            }
        }
        return this;
    }

    /**
     * Set the latitude and longitude values and optionally update the center point.
     *
     * The times when you would not want to update the center point are when you are setting the latitude and longitude
     * and you don't want to recenter the map, but you want the latitude and longitude values to be available for future
     * times when the map may be centered.
     *
     * @param {number|string} latitude The latitude value
     * @param {number|string} longitude The longitude value
     * @param {boolean} [updateCenter] Whether to update the map center point. Defaults to true.
     * @returns {Map}
     */
    setLatitudeLongitude(latitude: number | string, longitude: number | string, updateCenter: boolean = true): Map {
        if (isNumberOrNumberString(latitude) && isNumberOrNumberString(longitude)) {
            this.#latitude = Number(latitude);
            this.#longitude = Number(longitude);
            if (updateCenter) {
                this.setCenter(this.#latitude, this.#longitude);
            }
        }
        return this;
    }

    /**
     * Set the map type ID
     *
     * @param {string} mapTypeId The map type ID to use for the map.
     * @returns {Map}
     */
    setMapTypeId(mapTypeId: string): Map {
        this.mapTypeId = mapTypeId;
        return this;
    }

    /**
     * Set the map options
     *
     * @param {MapOptions} options The map options
     * @returns {Map}
     */
    setOptions(options: MapOptions): Map {
        if (isObject(options)) {
            // Set the loader options if necessary
            if (options.apiKey || options.libraries || options.version) {
                loader(options);
            }

            // Set the center point for the map
            let center = latLng();
            if (options.center) {
                center = latLng(options.center);
            } else {
                if (isNumberOrNumberString(options.lat)) {
                    center.setLat(options.lat);
                    this.latitude = options.lat;
                } else if (isNumberOrNumberString(options.latitude)) {
                    center.setLat(options.latitude);
                    this.latitude = options.latitude;
                }
                if (isNumberOrNumberString(options.lng)) {
                    center.setLng(options.lng);
                    this.longitude = options.lng;
                } else if (isNumberOrNumberString(options.longitude)) {
                    center.setLng(options.longitude);
                    this.longitude = options.longitude;
                }
            }
            if (center.isValid()) {
                this.#options.center = center;
            }
            if (isBoolean(options.disableDefaultUI)) {
                this.disableDefaultUI = options.disableDefaultUI;
            }
            if (typeof options.fullscreenControl !== 'undefined') {
                if (isBoolean(options.fullscreenControl)) {
                    this.#fullscreenControl.enabled = options.fullscreenControl;
                } else if (options.fullscreenControl instanceof FullscreenControl) {
                    this.#fullscreenControl = options.fullscreenControl;
                }
            }
            if (isStringWithValue(options.mapId)) {
                // 'DEMO_MAP_ID' could be used in development, but it should be set to a real map id in production.
                this.#options.mapId = options.mapId;
            }
            if (typeof options.mapTypeControl !== 'undefined') {
                if (isBoolean(options.mapTypeControl)) {
                    this.#mapTypeControl.enabled = options.mapTypeControl;
                } else if (options.mapTypeControl instanceof MapTypeControl) {
                    this.#mapTypeControl = options.mapTypeControl;
                }
            }
            if (options.mapTypeId) {
                this.mapTypeId = options.mapTypeId;
            }
            if (typeof options.maxZoom !== 'undefined') {
                this.maxZoom = options.maxZoom;
            }
            if (typeof options.minZoom !== 'undefined') {
                this.minZoom = options.minZoom;
            }

            if (typeof options.restriction !== 'undefined') {
                this.restriction = options.restriction;
            }

            if (isDefined(options.rotateControl)) {
                if (isBoolean(options.rotateControl)) {
                    this.#rotateControl.enabled = options.rotateControl;
                } else if (options.rotateControl instanceof RotateControl) {
                    this.#rotateControl = options.rotateControl;
                }
            }

            if (isDefined(options.scaleControl)) {
                if (isBoolean(options.scaleControl)) {
                    this.#scaleControl.enabled = options.scaleControl;
                } else if (options.scaleControl instanceof ScaleControl) {
                    this.#scaleControl = options.scaleControl;
                }
            }

            if (isDefined(options.streetViewControl)) {
                if (isBoolean(options.streetViewControl)) {
                    this.#streetViewControl.enabled = options.streetViewControl;
                } else if (options.streetViewControl instanceof StreetViewControl) {
                    this.#streetViewControl = options.streetViewControl;
                }
            }

            // Set the styles for the map
            if (Array.isArray(options.styles)) {
                this.#styles = options.styles.map((style) => mapStyle(style));
            } else if (options.styles instanceof MapStyle) {
                this.#styles = [options.styles];
            }

            // Set the zoom level for the map
            if (options.zoom) {
                this.zoom = options.zoom;
            }

            // Set options that correspond to a property on the map object.
            const booleanOptions = [
                'clickableIcons',
                'headingInteractionEnabled',
                'isFractionalZoomEnabled',
                'keyboardShortcuts',
                'noClear',
                'scrollwheel',
                'tiltInteractionEnabled',
            ];
            booleanOptions.forEach((key) => {
                if (isBoolean(options[key])) {
                    this.#options[key] = options[key];
                }
            });
            const numberOptions = ['controlSize', 'heading', 'tilt'];
            numberOptions.forEach((key) => {
                if (isNumberOrNumberString(options[key])) {
                    this.#options[key] = options[key];
                }
            });
            const stringOptions = ['backgroundColor', 'draggableCursor', 'draggingCursor', 'gestureHandling'];
            stringOptions.forEach((key) => {
                if (isStringWithValue(options[key])) {
                    this.#options[key] = options[key];
                }
            });
            const otherOptions = ['mapTypeId', 'renderingType', 'streetView'];
            otherOptions.forEach((key) => {
                if (typeof options[key] !== 'undefined') {
                    this.#options[key] = options[key];
                }
            });

            if (this.#map) {
                this.#getMapOptions().then((mapOptions) => {
                    this.#map.setOptions(mapOptions);
                });
            }
        }
        return this;
    }

    /**
     * Set the zoom value
     *
     * @param {number|string} zoom The zoom value
     * @returns {Map}
     */
    setZoom(zoom: number | string): Map {
        this.zoom = zoom;
        return this;
    }

    /**
     * Show the map
     *
     * If the Google Maps API hasn't loaded yet then this will wait for the "load" event to be dispatched.
     *
     * Unlike load(), this does not load the Google Maps API, it only shows the map.
     * You must load the map with G.loader before calling this function.
     *
     * @param {Function} callback The callback function to call after the map loads
     * @returns {Promise<void>}
     */
    show(callback?: () => void): Promise<Map> {
        return new Promise((resolve) => {
            if (checkForGoogleMaps('Map', 'Map', false)) {
                // The map library is loaded and this can be shown
                this.#showMap().then(() => {
                    // Call the callback function if necessary
                    callCallback(callback);
                    resolve(this);
                });
            } else {
                // Wait for the loader to dispatch it's "load" event
                loader().once('load', () => {
                    this.#showMap().then(() => {
                        // Call the callback function if necessary
                        callCallback(callback);
                        resolve(this);
                    });
                });
            }
        });
    }

    /**
     * Show the map
     *
     * This also dispatches the "visible" and "map_loaded" events,
     * and calls the callback function.
     *
     * @returns {Promise<void>}
     */
    #showMap(): Promise<void> {
        return new Promise((resolve) => {
            // Only set up the map if it hasn't been set up yet or isn't in the process of being set up.
            if (!this.#isVisible && !this.#isGettingMapOptions) {
                this.#isGettingMapOptions = true;

                // Get the DOM element to attach the map to
                let element: HTMLElement = null;
                if (typeof this.#selector === 'string') {
                    element = document.querySelector(this.#selector);
                } else if (this.#selector instanceof HTMLElement) {
                    element = this.#selector;
                }
                if (element === null) {
                    throw new Error(
                        'The map element could not be found. Make sure the map selector is correct and the element exists.'
                    );
                }

                // Get the map options
                this.#getMapOptions().then((mapOptions) => {
                    this.#map = new google.maps.Map(element, mapOptions);
                    this.setEventGoogleObject(this.#map);

                    // Add any custom controls to the map
                    if (this.#customControls.length > 0) {
                        this.#customControls.forEach((control) => {
                            this.#map.controls[convertControlPosition(control.position)].push(control.element);
                        });
                    }
                    this.#customControls = [];

                    // Dispatch the event to say that the map is visible
                    this.dispatch('visible');
                    // Dispatch the event on the loader to say that the map is fully loaded.
                    // This is done because the map is loaded after the loader's "load" event is dispatched
                    // and some objects depend on the map being loaded before they can be set up.
                    loader().dispatch('map_loaded');

                    // Set that the map is initialized
                    this.#isInitialized = true;

                    // Set that the map is visible
                    this.#isVisible = true;

                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    /**
     * Stop watching for the user's location
     *
     * @returns {Map}
     */
    stopLocate(): Map {
        if (navigator.geolocation) {
            navigator.geolocation.clearWatch(this.#watchId);
        }
        return this;
    }

    /**
     * Returns the Google map object
     *
     * @returns {google.maps.Map}
     */
    toGoogle(): google.maps.Map {
        return this.#map;
    }
}

/**
 * Helper function to set up the map object
 *
 * @param {string|HTMLElement} selector The selector of the element that the map will be rendered in. Or the HTMLElement that the map will be rendered in.
 *      The selector can be a class name, an id, or an HTML element. If you need something beyond an id or class name as the selector then pass the element itself.
 * @param {MapOptions} [config] The map options
 * @returns {Map}
 */
export const map = (selector: string | HTMLElement, config?: MapOptions): Map => new Map(selector, config);
