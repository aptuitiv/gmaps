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

import { MapTypeId } from './constants';
import { loader } from './Loader';
import { LatLngBounds, latLngBounds, LatLngBoundsValue } from './LatLngBounds';
import {
    callCallback,
    checkForGoogleMaps,
    isBoolean,
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
import { GMMapOptions, LocationOnSuccess, LocateOptions, LocationPosition, MapOptions } from './Map/types';
import { mapTypeControl, MapTypeControl } from './Map/MapTypeControl';

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

/**
 * The map class
 */
export class Map extends Evented {
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
     * Holds the selector of the element that the map will be rendered in. Or the HTMLElement that the map will be rendered in.
     *
     * @private
     * @type {string|HTMLElement}
     */
    #selector: string | HTMLElement;

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
     *      The selector can be a class name, an id, or an HTML element. If you need something beyond an id or class name as the selector then pass the element itself.
     * @param {MapOptions} [options] The options object for the map
     */
    constructor(selector: string | HTMLElement, options?: MapOptions) {
        super('map', 'Map');

        // Set some default values
        this.#options.mapTypeId = MapTypeId.ROADMAP;
        this.#options.center = latLng(0, 0);
        this.#options.zoom = 6;
        this.#mapTypeControl = mapTypeControl();

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
        return this.#options.mapTypeId ?? MapTypeId.ROADMAP;
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
    fitBounds(bounds: LatLngBoundsValue): Map {
        if (bounds instanceof LatLngBounds) {
            this.#map.fitBounds(bounds.toGoogle());
        }
        this.#map.fitBounds(latLngBounds(bounds).toGoogle());
        return this;
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
            // Options that can be set on the marker without any modification
            const optionsToSet = ['mapId', 'mapTypeId', 'maxZoom', 'minZoom', 'zoom'];
            optionsToSet.forEach((key) => {
                if (typeof this.#options[key] !== 'undefined') {
                    mapOptions[key] = this.#options[key];
                }
            });

            // Options that have to be converted to Google Maps objects
            mapOptions.center = this.#options.center.toGoogle();
            mapOptions.mapTypeControl = this.#mapTypeControl.enabled;

            // Get async map options
            (async () => {
                const mapTypeControlOptions = await this.#mapTypeControl.toGoogle();
                mapOptions.mapTypeControlOptions = mapTypeControlOptions;
                resolve(mapOptions);
            })();
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
                    this.#showMap(callback);
                    resolve();
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
            if (isStringWithValue(options.mapId)) {
                // 'DEMO_MAP_ID' could be used in development, but it should be set to a real map id in production.
                this.#options.mapId = options.mapId;
            }
            if (typeof options.mapTypeControl !== 'undefined') {
                this.mapTypeControl = options.mapTypeControl;
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

            // Set the zoom level for the map
            if (options.zoom) {
                this.zoom = options.zoom;
            }

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
                this.#showMap(callback);
                resolve(this);
            } else {
                // Wait for the loader to dispatch it's "load" event
                loader().once('load', () => {
                    this.#showMap(callback);
                    resolve(this);
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
     * @param {Function} callback The callback function to call after the map loads
     */
    #showMap(callback?: () => void) {
        // Only set up the map if it hasn't been set up yet
        if (!this.#isVisible) {
            let element: HTMLElement = null;
            if (typeof this.#selector === 'string') {
                if (this.#selector.startsWith('.')) {
                    element = document.querySelector(this.#selector);
                } else {
                    element = document.getElementById(this.#selector.replace('#', ''));
                }
            } else if (this.#selector instanceof HTMLElement) {
                element = this.#selector;
            }
            if (element === null) {
                throw new Error(
                    'The map element could not be found. Make sure the map selector is correct and the element exists.'
                );
            }
            this.#getMapOptions().then((mapOptions) => {
                this.#map = new google.maps.Map(element, mapOptions);

                this.setEventGoogleObject(this.#map);
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
            });
        }

        // Call the callback function if necessary
        callCallback(callback);
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
