/* ===========================================================================
    Main class to hold the map object and set it up.

    https://developers.google.com/maps/documentation/javascript/reference/map
    https://developers.google.com/maps/documentation/javascript/load-maps-js-api

    If we want to use google.maps.marker.AdvancedMarkerElementOptions, we need to load the "marker" library.
    When we add support for Advanced Markers, make sure that "marker" in included in the libraries array.
    If there are code examples that use await google.maps.importLibrary(), the library that is loaded
    should be included in the libraries array to properly load.
    https://developers.google.com/maps/documentation/javascript/places

    See https://aptuitiv.github.io/gmaps/api-reference/map for documentation.
=========================================================================== */

/* global google, HTMLElement */

import {
    convertControlPosition,
    ControlPositionValue,
    LoaderEvents,
    MapEvents,
    MapTypeId,
    MapTypeIdValue,
} from './constants';
import { DataFeature } from './DataFeature';
import { DataLayer, LoadOptions } from './DataLayer';
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
import { missingFeatureMessage } from './missingFeature';
import { fullscreenControl, FullscreenControl } from './Map/FullscreenControl';
import { mapRestriction, MapRestriction, MapRestrictionValue } from './Map/MapRestriction';
import { mapTypeControl, MapTypeControl } from './Map/MapTypeControl';
import { mapStyle, MapStyle } from './Map/MapStyle';
import { GMMapOptions, LocationOnSuccess, LocateOptions, LocationPosition, MapOptions } from './Map/types';
import { rotateControl, RotateControl } from './Map/RotateControl';
import { scaleControl, ScaleControl } from './Map/ScaleControl';
import { streetViewControl, StreetViewControl } from './Map/StreetViewControl';
import { zoomControl, ZoomControl } from './Map/ZoomControl';
import type { AttachPopupValue, Popup } from './Popup';
import type { AttachTooltipValue, Tooltip, TooltipConfig } from './Tooltip';
import type { InfoWindow, InfoWindowValue } from './InfoWindow';

// Based on google.maps.MapTypeId
export type MapType = 'hybrid' | 'roadmap' | 'satellite' | 'terrain';

// Map events that are not part of the Google Maps API
type InternalEvent = 'locationerror' | 'locationfound' | 'ready';

// A function registered with Map.addInitHook(), run against every map as it is created
export type InitHook = (map: Map) => void;
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

// The feature types that are hidden by the shortcut options, like hideBusinesses.
// https://developers.google.com/maps/documentation/javascript/style-reference#style-features
const hideFeatureTypes = {
    hideBusinesses: 'poi.business',
    hidePointsOfInterest: 'poi',
    hideTransit: 'transit',
};

// The shortcut options to hide features on the map
type HideFeatureOption = keyof typeof hideFeatureTypes;

// The map options that are held internally. The center, mapTypeId, and zoom options
// are always set because they have default values.
type MapOptionsWithDefaults = GMMapOptions & Required<Pick<GMMapOptions, 'center' | 'mapTypeId' | 'zoom'>>;

/**
 * The map class
 */
export class Map extends Evented {
    /* eslint-disable jsdoc/require-returns-check -- These placeholders throw rather than return. See below. */
    /**
     * Placeholders for the methods that the optional feature modules add to this class.
     *
     * Importing the popup, tooltip or InfoWindow module runs an include() that replaces each of
     * these with the real method. The signatures here match the ones those modules install, so the
     * types are the same either way. Only the body differs, and it only ever runs when the matching
     * module hasn't been imported - which is possible when importing from '@aptuitiv/gmaps/core'
     * rather than '@aptuitiv/gmaps'. Without these the call fails with "attachPopup is not a
     * function", which doesn't say what to do about it.
     *
     * @param {AttachPopupValue} popupValue The content for the Popup, or the Popup options object, or
     *      the Popup object, or a function that returns one of those.
     * @param {'click' | 'clickon' | 'hover'} [event] The event to trigger the popup.
     * @returns {Popup}
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
    attachPopup(popupValue: AttachPopupValue, event?: 'click' | 'clickon' | 'hover'): Popup {
        throw new Error(missingFeatureMessage('attachPopup', 'popup'));
    }

    /**
     * @inheritdoc
     * @param {AttachTooltipValue|TooltipConfig} tooltipValue The content for the Tooltip, or the
     *      Tooltip options object, or the Tooltip object, or a function that returns one of those.
     * @param {'click' | 'clickon' | 'hover'} [event] The event to trigger the tooltip.
     * @returns {Tooltip}
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
    attachTooltip(tooltipValue: AttachTooltipValue | TooltipConfig, event?: 'click' | 'clickon' | 'hover'): Tooltip {
        throw new Error(missingFeatureMessage('attachTooltip', 'tooltip'));
    }

    /**
     * @inheritdoc
     * @param {InfoWindowValue} infoWindowValue The content for the InfoWindow, or the InfoWindow
     *      options object, or the InfoWindow object.
     * @param {'click' | 'clickon' | 'hover'} [event] The event to trigger the InfoWindow.
     * @returns {InfoWindow}
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
    attachInfoWindow(infoWindowValue: InfoWindowValue, event?: 'click' | 'clickon' | 'hover'): InfoWindow {
        throw new Error(missingFeatureMessage('attachInfoWindow', 'infowindow'));
    }
    /* eslint-enable jsdoc/require-returns-check */

    /**
     * The bounds to fit the map to
     *
     * @private
     * @type {LatLngBounds|undefined}
     */
    #bounds: LatLngBounds | undefined;

    /**
     * Holds the custom controls that need to be added to the map
     *
     * @private
     * @type {CustomControl[]}
     */
    #customControls: CustomControl[] = [];

    /**
     * Holds the data layer for the map.
     *
     * This is created the first time that the data getter is used so that maps that don't
     * use the data layer don't pay for it. It's then held so that map.data is always the
     * same object.
     *
     * @private
     * @type {DataLayer|undefined}
     */
    #data: DataLayer | undefined;

    /**
     * Holds the HTML element that the map will be rendered in.
     *
     * @private
     * @type {null|HTMLElement}
     */
    #element: null | HTMLElement = null;

    /**
     * Holds the fullscreen control object
     *
     * @private
     * @type {FullscreenControl}
     */
    #fullscreenControl: FullscreenControl;

    /**
     * Holds whether each of the shortcut options to hide features on the map is enabled
     *
     * @private
     * @type {Record<HideFeatureOption, boolean>}
     */
    #hiddenFeatures: Record<HideFeatureOption, boolean> = {
        hideBusinesses: false,
        hidePointsOfInterest: false,
        hideTransit: false,
    };

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
     * Holds if the map is loaded and ready for use
     *
     * @private
     * @type {boolean}
     */
    #isReady: boolean = false;

    /**
     * Holds the Google map object.
     *
     * This is undefined until the map is set up when it's shown.
     *
     * @private
     * @type {google.maps.Map|undefined}
     */
    #map: google.maps.Map | undefined;

    /**
     * Holds the map type control object
     *
     * @private
     * @type {MapTypeControl}
     */
    #mapTypeControl: MapTypeControl;

    /**
     * Holds the maximum zoom level for the map when fitting to bounds
     *
     * @private
     * @type {number|null}
     */
    #maxFitBoundsZoom: number | null = null;

    /**
     * Holds the minimum zoom level for the map when fitting to bounds
     *
     * @private
     * @type {number|null}
     */
    #minFitBoundsZoom: number | null = null;

    /**
     * Holds the map options
     *
     * The center, mapTypeId, and zoom options are set to their default values.
     *
     * @private
     * @type {MapOptionsWithDefaults}
     */
    #options: MapOptionsWithDefaults = {
        center: latLng(0, 0),
        mapTypeId: MapTypeId.ROADMAP,
        zoom: 6,
    };

    /**
     * Holds the listener that cancels the gesture events, or null if it hasn't been added.
     * It's held so that it can be removed if the preventPageZoom option is turned off.
     *
     * @private
     * @type {null|((event: Event) => void)}
     */
    #pageZoomHandler: null | ((event: Event) => void) = null;

    /**
     * Holds whether a pinch on the map is kept from zooming the whole page on iOS
     *
     * @private
     * @type {boolean}
     */
    #preventPageZoom: boolean = true;

    /**
     * Holds the map restriction object to restrict the map to a certain area
     *
     * @private
     * @type {MapRestriction|undefined}
     */
    #restriction: MapRestriction | undefined;

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
    #styles: MapStyle[] = [];

    /**
     * Holds the watchId for the watchPosition() function
     *
     * This is undefined until locate() starts watching the user's location.
     *
     * @private
     * @type {number|undefined}
     */
    #watchId: number | undefined;

    /**
     * Holds the zoom control object
     *
     * @private
     * @type {ZoomControl}
     */
    #zoomControl: ZoomControl;

    /**
     * Class constructor
     *
     * @param {string|HTMLElement} selector The selector of the element that the map will be rendered in. Or the HTMLElement that the map will be rendered in.
     *      The selector can be any valid selector for document.querySelector() can be used. Or, it can be an HTML element
     * @param {MapOptions} [options] The options object for the map
     */
    /**
     * Holds the functions to run against every map as it is created.
     *
     * Static, so that a plugin can add one without a reference to any particular map.
     *
     * @private
     * @type {InitHook[]}
     */
    static #initHooks: InitHook[] = [];

    /**
     * Add a function to run against every map that is created from now on.
     *
     * This is how a plugin attaches itself to every map on a page without the site having to call
     * it for each one. The function is called as the map is constructed, after its options have
     * been set and before it has been rendered, with the map as both "this" and its first argument.
     *
     * Two things to know about it:
     *
     * 1. It only applies to maps created after the hook is added, not to ones that already exist.
     *    A plugin therefore has to be loaded before the maps it means to attach to. In the browser
     *    that means its script tag comes before the code that creates the map.
     * 2. The map isn't rendered yet when the hook runs, so toGoogle() returns undefined. Anything
     *    that needs the Google map object should wait for the "ready" event.
     *
     * A hook that throws is logged and the rest still run, so that one plugin can't stop a map
     * from being created.
     *
     * @param {InitHook} callback The function to call for each new map
     */
    static addInitHook(callback: InitHook): void {
        if (isFunction(callback)) {
            Map.#initHooks.push(callback);
        }
    }

    constructor(selector: string | HTMLElement, options?: MapOptions) {
        super('map', 'Map');

        // Set some default values
        this.#fullscreenControl = fullscreenControl();
        this.#mapTypeControl = mapTypeControl();
        this.#rotateControl = rotateControl();
        this.#scaleControl = scaleControl();
        this.#streetViewControl = streetViewControl();
        this.#zoomControl = zoomControl();

        if (typeof selector === 'string') {
            this.#element = document.querySelector(selector);
        } else if (selector instanceof HTMLElement) {
            this.#element = selector;
        }
        if (isObject(options)) {
            this.setOptions(options);
        }

        // Run last, so that a hook sees a map that has had its options applied
        this.#runInitHooks();
    }

    /**
     * Run the functions that were registered with addInitHook()
     *
     * @private
     */
    #runInitHooks(): void {
        Map.#initHooks.forEach((hook) => {
            try {
                hook.call(this, this);
            } catch (error) {
                // One plugin's hook failing shouldn't stop the map from being created, or keep the
                // other hooks from running. It's logged rather than swallowed so that it's findable.
                // eslint-disable-next-line no-console
                console.error('A map init hook threw an error. The map was still created.', error);
            }
        });
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
            if (mapCenter) {
                center = latLng(mapCenter.lat(), mapCenter.lng());
            }
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
     * Get the data layer for the map.
     *
     * This is the map's own data layer, which every map has. Use the dataLayer() function if
     * you need a separate layer that only holds your own data.
     *
     * The layer is created the first time that this is used, and the same layer object is
     * returned after that.
     *
     * https://developers.google.com/maps/documentation/javascript/datalayer
     *
     * @returns {DataLayer}
     */
    get data(): DataLayer {
        if (!this.#data) {
            this.#data = new DataLayer(undefined, this);
        }
        return this.#data;
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

        const map = this.#map;
        if (map) {
            this.#fullscreenControl.toGoogle().then((fullscreenControlOptions) => {
                map.setOptions({
                    fullscreenControl: this.#fullscreenControl.enabled,
                    fullscreenControlOptions,
                });
            });
        }
    }

    /**
     * Get whether businesses are hidden on the map
     *
     * @returns {boolean}
     */
    get hideBusinesses(): boolean {
        return this.#hiddenFeatures.hideBusinesses;
    }

    /**
     * Set whether to hide businesses on the map.
     *
     * This hides the "poi.business" feature type, which includes things like stores, restaurants, and hotels.
     * If the map has already been rendered then it's updated right away.
     *
     * @param {boolean} value Whether to hide businesses
     */
    set hideBusinesses(value: boolean) {
        this.#setHideFeature('hideBusinesses', value);
    }

    /**
     * Get whether all points of interest are hidden on the map
     *
     * @returns {boolean}
     */
    get hidePointsOfInterest(): boolean {
        return this.#hiddenFeatures.hidePointsOfInterest;
    }

    /**
     * Set whether to hide all points of interest on the map.
     *
     * This hides the "poi" feature type, which includes businesses, parks, schools, attractions, and places of worship.
     * If the map has already been rendered then it's updated right away.
     *
     * @param {boolean} value Whether to hide all points of interest
     */
    set hidePointsOfInterest(value: boolean) {
        this.#setHideFeature('hidePointsOfInterest', value);
    }

    /**
     * Get whether transit lines and stations are hidden on the map
     *
     * @returns {boolean}
     */
    get hideTransit(): boolean {
        return this.#hiddenFeatures.hideTransit;
    }

    /**
     * Set whether to hide transit lines and stations on the map.
     *
     * This hides the "transit" feature type, which includes things like bus stops, train stations, and rail lines.
     * If the map has already been rendered then it's updated right away.
     *
     * @param {boolean} value Whether to hide transit lines and stations
     */
    set hideTransit(value: boolean) {
        this.#setHideFeature('hideTransit', value);
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

        const map = this.#map;
        if (map) {
            this.#mapTypeControl.toGoogle().then((mapTypeControlOptions) => {
                map.setOptions({
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
        const mapTypeId = this.#map ? this.#map.getMapTypeId() : this.#options.mapTypeId;
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
     * Get the maximum zoom level for the map when fitting to bounds
     *
     * @returns {null|number}
     */
    get maxFitBoundsZoom(): null | number {
        return this.#maxFitBoundsZoom ?? null;
    }

    /**
     * Set the maximum zoom level for the map when fitting to bounds
     *
     * @param {null|number} value The maximum zoom level
     */
    set maxFitBoundsZoom(value: null | number) {
        if (isNumber(value) || isNull(value)) {
            this.#maxFitBoundsZoom = value;
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
            // Null is stored as undefined in the options. Both mean that there is no max zoom.
            this.#options.maxZoom = value ?? undefined;
            if (this.#map) {
                this.#map.setOptions({ maxZoom: value });
            }
        }
    }

    /**
     * Get the minimum zoom level for the map when fitting to bounds
     *
     * @returns {null|number}
     */
    get minFitBoundsZoom(): null | number {
        return this.#minFitBoundsZoom ?? null;
    }

    /**
     * Set the minimum zoom level for the map when fitting to bounds
     *
     * @param {null|number} value The minimum zoom level
     */
    set minFitBoundsZoom(value: null | number) {
        if (isNumber(value) || isNull(value)) {
            this.#minFitBoundsZoom = value;
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
            // Null is stored as undefined in the options. Both mean that there is no min zoom.
            this.#options.minZoom = value ?? undefined;
            if (this.#map) {
                this.#map.setOptions({ minZoom: value });
            }
        }
    }

    /**
     * Get whether a pinch on the map is kept from zooming the whole page on iOS
     *
     * @returns {boolean}
     */
    get preventPageZoom(): boolean {
        return this.#preventPageZoom;
    }

    /**
     * Set whether a pinch on the map is kept from zooming the whole page on iOS
     *
     * @param {boolean} value Whether to keep a pinch on the map from zooming the page
     */
    set preventPageZoom(value: boolean) {
        if (isBoolean(value)) {
            this.#preventPageZoom = value;
            if (value) {
                this.#setupPreventPageZoom();
            } else {
                this.#removePreventPageZoom();
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
        const map = this.#map;
        if (map && this.#restriction.isValid() && this.#restriction.isEnabled()) {
            this.#restriction.toGoogle().then((restriction) => {
                map.setOptions({ restriction });
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

        const map = this.#map;
        if (map) {
            this.#rotateControl.toGoogle().then((rotateControlOptions) => {
                map.setOptions({
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

        const map = this.#map;
        if (map) {
            this.#scaleControl.toGoogle().then((scaleControlOptions) => {
                map.setOptions({
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

        const map = this.#map;
        if (map) {
            this.#streetViewControl.toGoogle().then((streetViewControlOptions) => {
                map.setOptions({
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
        const zoom = this.#map ? this.#map.getZoom() : this.#options.zoom;
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
     * Get the zoom control object
     *
     * @returns {ZoomControl}
     */
    get zoomControl(): ZoomControl {
        return this.#zoomControl;
    }

    /**
     * Set the zoom control object, or whether to display the zoom control
     *
     * @param {boolean|ZoomControl} value The zoom control option
     */
    set zoomControl(value: boolean | ZoomControl) {
        if (isBoolean(value)) {
            this.#zoomControl.enabled = value;
        } else if (value instanceof ZoomControl) {
            this.#zoomControl = value;
        }

        const map = this.#map;
        if (map) {
            this.#zoomControl.toGoogle().then((zoomControlOptions) => {
                map.setOptions({
                    zoomControl: this.#zoomControl.enabled,
                    zoomControlOptions,
                });
            });
        }
    }

    /**
     * Removes a custom control from the map
     *
     * This is the counterpart to addCustomControl(). It can't be done from outside the library:
     * map.controls is an array of google.maps.MVCArray, so removing something means finding its
     * index and calling removeAt() on the right one.
     *
     * The element is removed whether the map has been rendered or not. Before the map is rendered
     * the controls are held in a queue, and an element taken out of that queue is never added.
     *
     * @param {HTMLElement} element The HTML element for the custom control to remove
     * @returns {Map}
     */
    removeCustomControl(element: HTMLElement): Map {
        if (this.#map) {
            // Every position has to be searched. Nothing records which one an element went into,
            // and the position could have been changed since it was added.
            this.#map.controls.forEach((controls) => {
                const items = controls.getArray();
                // Walked backwards so that removing an item doesn't shift the ones still to check
                for (let i = items.length - 1; i >= 0; i -= 1) {
                    if (items[i] === element) {
                        controls.removeAt(i);
                    }
                }
            });
        }
        // Also drop it from the queue. The queue is flushed when the map renders, so an element
        // left in it would be added to a map it had already been removed from.
        this.#customControls = this.#customControls.filter((control) => control.element !== element);
        return this;
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
     * Add GeoJson data to the map's data layer.
     *
     * This is the same as calling map.data.addGeoJson().
     *
     * @param {object} geoJson The GeoJson object to add
     * @param {LoadOptions} [options] The options for adding the data
     * @returns {Promise<DataFeature[]>}
     */
    addGeoJson(geoJson: object, options?: LoadOptions): Promise<DataFeature[]> {
        return this.data.addGeoJson(geoJson, options);
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
     * @param {number} [maxZoom] The maximum zoom level to zoom to when fitting the bounds. Higher numbers will zoom in more.
     * @param {number} [minZoom] The minimum zoom level to zoom to when fitting the bounds. Lower numbers will zoom out more.
     * @returns {Promise<Map>}
     */
    fitBounds(bounds?: LatLngBoundsValue, maxZoom?: number, minZoom?: number): Promise<Map> {
        return new Promise((resolve) => {
            if (this.#map) {
                this.#fitBounds(bounds, maxZoom, minZoom).then(() => {
                    resolve(this);
                });
            } else {
                this.init().then(() => {
                    this.#fitBounds(bounds, maxZoom, minZoom).then(() => {
                        resolve(this);
                    });
                });
            }
        });
    }

    /**
     * Do the actual fitting of the bounds
     *
     * @param {LatLngBoundsValue} bounds The bounds to fit
     * @param {number} [maxZoom] The maximum zoom level to zoom to when fitting the bounds. Higher numbers will zoom in more.
     * @param {number} [minZoom] The minimum zoom level to zoom to when fitting the bounds. Lower numbers will zoom out more.
     * @returns {Promise<void>}
     */
    #fitBounds(bounds?: LatLngBoundsValue, maxZoom?: number, minZoom?: number): Promise<void> {
        // This is only called after the map has been set up, so the Google map object exists.
        // The non-null assertions below rely on that.
        return new Promise((resolve) => {
            if (bounds) {
                latLngBounds(bounds)
                    .toGoogle()
                    .then((googleBounds) => {
                        this.#handleZoomAfterFitBounds(maxZoom, minZoom);
                        this.#map!.fitBounds(googleBounds);
                        resolve();
                    });
            } else if (this.#bounds) {
                this.#bounds.toGoogle().then((googleBounds) => {
                    this.#handleZoomAfterFitBounds(maxZoom, minZoom);
                    this.#map!.fitBounds(googleBounds);
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    /**
     * Alias to fitBounds
     *
     * @param {LatLngBoundsValue} bounds The bounds to fit
     * @param {number} [maxZoom] The maximum zoom level to zoom to when fitting the bounds. Higher numbers will zoom in more.
     * @param {number} [minZoom] The minimum zoom level to zoom to when fitting the bounds. Lower numbers will zoom out more.
     * @returns {Promise<Map>}
     */
    fitToBounds(bounds?: LatLngBoundsValue, maxZoom?: number, minZoom?: number): Promise<Map> {
        return this.fitBounds(bounds, maxZoom, minZoom);
    }

    /**
     * Make sure that the zoom level doesn't exceed the maxZoom value
     *
     * @param {number} [maxZoom] The maximum zoom level to zoom to when fitting the bounds. Higher numbers will zoom in more.
     * @param {number} [minZoom] The minimum zoom level to zoom to when fitting the bounds. Lower numbers will zoom out more.
     */
    #handleZoomAfterFitBounds(maxZoom?: number, minZoom?: number): void {
        let max = this.maxFitBoundsZoom ?? this.maxZoom;
        let min = this.minFitBoundsZoom ?? this.minZoom;
        if (isNumberOrNumberString(maxZoom)) {
            max = Number(maxZoom);
        }
        if (isNumberOrNumberString(minZoom)) {
            min = Number(minZoom);
        }
        if (isNumber(max) && max >= 0) {
            this.once(MapEvents.BOUNDS_CHANGED, () => {
                let { zoom } = this;
                if (isNumber(min) && min >= 0) {
                    if (zoom < min) {
                        zoom = min;
                    }
                }
                this.zoom = Math.min(zoom, max);
            });
        }
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
            if (!this.#isInitialized && !this.#isReady) {
                // The map has not been initialized or displayed
                if (!this.#isInitializing) {
                    // The map is not initializing, so start the initialization process
                    this.#isInitializing = true;
                    this.#load().then(() => {
                        callCallback(callback);
                        resolve(this);
                    });
                } else {
                    // The map is initializing, so wait for it to finish
                    this.onceImmediate(MapEvents.READY, () => {
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
            // The option keys below are copied as-is, so index both objects by the key name.
            const options = this.#options as Record<string, unknown>;
            const googleOptions = mapOptions as Record<string, unknown>;
            booleanOptions.forEach((key) => {
                if (isBoolean(options[key])) {
                    googleOptions[key] = options[key];
                }
            });
            // Number options that can be set on the map without any modification
            const numberOptions = ['controlSize', 'heading', 'maxZoom', 'minZoom', 'tilt', 'zoom'];
            numberOptions.forEach((key) => {
                if (isNumberOrNumberString(options[key])) {
                    googleOptions[key] = options[key];
                }
            });
            // String options that can be set on the map without any modification
            const stringOptions = ['backgroundColor', 'draggableCursor', 'draggingCursor', 'gestureHandling', 'mapId'];
            stringOptions.forEach((key) => {
                if (isStringWithValue(options[key])) {
                    googleOptions[key] = options[key];
                }
            });
            // Other options that can be set on the map without any modification
            const optionsToSet = ['renderingType', 'streetView'];
            optionsToSet.forEach((key) => {
                if (typeof options[key] !== 'undefined') {
                    googleOptions[key] = options[key];
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
                        this.#options.mapTypeId,
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
                // Zoom control
                mapOptions.zoomControl = this.#zoomControl.enabled;
                const zoomControlOptions = await this.#zoomControl.toGoogle();
                mapOptions.zoomControlOptions = zoomControlOptions;
                // Map styles, including the styles for the shortcut options to hide features
                const styles = this.#getGoogleStyles();
                if (styles.length > 0) {
                    mapOptions.styles = styles;
                }
                resolve(mapOptions);
            })();
        });
    }

    /**
     * Get the styles to send to Google Maps.
     *
     * This combines the styles set with the "styles" option with the styles for the shortcut options
     * to hide features, like hideBusinesses. The shortcut styles are added last so that they take
     * precedence over any other styles for the same feature type.
     *
     * @private
     * @returns {google.maps.MapTypeStyle[]}
     */
    #getGoogleStyles(): google.maps.MapTypeStyle[] {
        const styles = this.#styles.map((style) => style.toGoogle());
        (Object.keys(hideFeatureTypes) as HideFeatureOption[]).forEach((key) => {
            if (this.#hiddenFeatures[key]) {
                styles.push(
                    mapStyle({ featureType: hideFeatureTypes[key], stylers: [{ visibility: 'off' }] }).toGoogle(),
                );
            }
        });
        return styles;
    }

    /**
     * Set whether a feature type is hidden by one of the shortcut options, like hideBusinesses.
     *
     * If the map has already been rendered then the styles are updated on it right away.
     *
     * @private
     * @param {HideFeatureOption} key The shortcut option
     * @param {boolean} value Whether to hide the feature type
     */
    #setHideFeature(key: HideFeatureOption, value: boolean): void {
        if (isBoolean(value)) {
            this.#hiddenFeatures[key] = value;
            if (this.#map) {
                // Always set the styles, even if the array is empty, so that turning an option off removes its style.
                this.#map.setOptions({ styles: this.#getGoogleStyles() });
            }
        }
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
            const googleBounds = this.#map?.getBounds();
            if (googleBounds) {
                const bounds = new LatLngBounds();
                bounds.union(googleBounds).then(() => {
                    resolve(bounds);
                });
            } else {
                // The map isn't set up yet, or it doesn't have bounds yet
                // (Google returns undefined for the bounds until the map has been sized and positioned).
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
     * Gets whether the map is ready for use. This also means that the map library is loaded and the map is visible.
     *
     * @returns {boolean}
     */
    getIsReady(): boolean {
        return this.#isReady;
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
     * Load GeoJson data into the map's data layer from a url.
     *
     * This is the same as calling map.data.loadGeoJson(). More than one url can be passed.
     *
     * @param {string|string[]} url The url to load the GeoJson from, or an array of urls
     * @param {LoadOptions} [options] The options for loading the data
     * @returns {Promise<DataFeature[]>}
     */
    loadGeoJson(url: string | string[], options?: LoadOptions): Promise<DataFeature[]> {
        return this.data.loadGeoJson(url, options);
    }

    /**
     * Load and show the map
     *
     * There are two ways to respond when the map loads:
     * 1. Pass a callback function to the load() function
     *   map.load(() => {
     *     // Do something after the map loads
     *   });
     * 2. Listen for the 'ready' event
     *   map.on('ready', () => {
     *      // Do something after the map loads
     *   });
     * 2a. Use the once() function to listen for the 'ready' event only once. The event
     *     listener will be removed after the event is dispatched.
     *   map.once('ready', () => {
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
                // Copy the other coordinate values by name. They are getters on the GeolocationCoordinates
                // prototype, so Object.keys(position.coords) would not find them.
                const coordinateKeys = ['accuracy', 'altitude', 'altitudeAccuracy', 'heading', 'speed'] as const;
                coordinateKeys.forEach((key) => {
                    const value = position.coords[key];
                    if (typeof value === 'number') {
                        data[key] = value;
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
                // Pass the values as a plain object. The GeolocationPositionError values are getters on
                // its prototype so they would be lost when the event data is merged.
                this.dispatch('locationerror', { code: err.code, message: err.message });
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
     * Add event listener for when the viewport bounds have changed.
     *
     * @param {EventCallback} callback The callback function to call when the map bounds change
     */
    onBoundsChanged(callback: EventCallback): void {
        this.on(MapEvents.BOUNDS_CHANGED, callback);
    }

    /**
     * Add event listener for when the map center property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onCenterChanged(callback: EventCallback): void {
        this.on(MapEvents.CENTER_CHANGED, callback);
    }

    /**
     * Add an event listener for when the map is clicked.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onClick(callback: EventCallback): void {
        this.on(MapEvents.CLICK, callback);
    }

    /**
     * Add an event listener for when the DOM contextmenu is fired on the map container.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onContextMenu(callback: EventCallback): void {
        this.on(MapEvents.CONTEXT_MENU, callback);
    }

    /**
     * Add an event listener for when the map is double clicked.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDblClick(callback: EventCallback): void {
        this.on(MapEvents.DBLCLICK, callback);
    }

    /**
     * Add an event listener for when the user drags the map.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDrag(callback: EventCallback): void {
        this.on(MapEvents.DRAG, callback);
    }

    /**
     * Add an event listener for when the user stops dragging the map.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDragEnd(callback: EventCallback): void {
        this.on(MapEvents.DRAG_END, callback);
    }

    /**
     * Add an event listener for when the user starts draging the map.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onDragStart(callback: EventCallback): void {
        this.on(MapEvents.DRAG_START, callback);
    }

    /**
     * Add an event listener for when the map heading value changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onHeadingChanged(callback: EventCallback): void {
        this.on(MapEvents.HEADING_CHANGED, callback);
    }

    /**
     * Add an event listener for when the map becomes idle after panning or zooming.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onIdle(callback: EventCallback): void {
        this.on(MapEvents.IDLE, callback);
    }

    /**
     * Add an event listener for when the isFractionalZoomEnabled property has changed.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onIsFractionalZoomEnabledChanged(callback: EventCallback): void {
        this.on(MapEvents.IS_FRACTIONAL_ZOOM_ENABLED_CHANGED, callback);
    }

    /**
     * Add an event listener for when there is an error getting the user's location.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onLocationError(callback: EventCallback): void {
        this.on(MapEvents.LOCATION_ERROR, callback);
    }

    /**
     * Add an event listener for when the user's location has been found.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onLocationFound(callback: EventCallback): void {
        this.on(MapEvents.LOCATION_FOUND, callback);
    }

    /**
     * Add an event listener for when the map capabilities change.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onMapCapabilitiesChanged(callback: EventCallback): void {
        this.on(MapEvents.MAP_CAPABILITIES_CHANGED, callback);
    }

    /**
     * Add an event listener for when the mapTypeId property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onMapTypeIdChanged(callback: EventCallback): void {
        this.on(MapEvents.MAP_TYPE_ID_CHANGED, callback);
    }

    /**
     * Add an event listener for when the user's mouse moves over the map container.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onMouseMove(callback: EventCallback): void {
        this.on(MapEvents.MOUSE_MOVE, callback);
    }

    /**
     * Add an event listener for when the user's mouse exits the map container.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onMouseOut(callback: EventCallback): void {
        this.on(MapEvents.MOUSE_OUT, callback);
    }

    /**
     * Add an event listener for when the user's mouse enters the map container.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onMouseOver(callback: EventCallback): void {
        this.on(MapEvents.MOUSE_OVER, callback);
    }

    /**
     * Add an event listener for when the map projection has changed.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onProjectionChanged(callback: EventCallback): void {
        this.on(MapEvents.PROJECTION_CHANGED, callback);
    }

    /**
     * Add an event listener for when the map is ready and visible
     *
     * This is a "shortcut" to "on('ready', callback)"
     *
     * @param {EventCallback} [callback] The callback function to call when the event is dispatched.
     */
    onReady(callback: EventCallback): void {
        this.onceImmediate(MapEvents.READY, callback);
    }

    /**
     * Add an event listener for when the map renderingType has changed.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onRenderingTypeChanged(callback: EventCallback): void {
        this.on(MapEvents.RENDERING_TYPE_CHANGED, callback);
    }

    /**
     * Add an event listener for when the visible tiles have finished loading.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onTilesLoaded(callback: EventCallback): void {
        this.on(MapEvents.TILES_LOADED, callback);
    }

    /**
     * Add an event listener for when the map tilt property changes.
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onTiltChanged(callback: EventCallback): void {
        this.on(MapEvents.TILT_CHANGED, callback);
    }

    /**
     * Add an event listener for when the map zoom property changes
     *
     * @param {EventCallback} callback The callback function to call when the event is dispatched.
     */
    onZoomChanged(callback: EventCallback): void {
        this.on(MapEvents.ZOOM_CHANGED, callback);
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
                // init() resolves after the Google map object is set up
                this.#map!.panBy(x, y);
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
                // init() resolves after the Google map object is set up
                this.#map!.panTo(latLng(value).toGoogle());
            });
        }
    }

    /**
     * Resize the the map container to force the map to redraw itself.
     *
     * This is useful when the map is not displaying correctly, such as when the map is hidden and then shown.
     *
     * This will resize the element that the map is rendered in by default. If you need to resize a different element,
     * pass that element as the first argument.
     *
     * @param {HTMLElement|string} [element] The HTML element to resize if it needs to be different from the map element. This can be an HTMLElement or a CSS selector.
     */
    resize = (element?: HTMLElement | string): void => {
        let el: HTMLElement | null;
        if (typeof element === 'string') {
            el = document.querySelector(element);
        } else if (element instanceof HTMLElement) {
            el = element;
        } else {
            el = this.#element;
        }

        if (el) {
            const currentHeight = el.getBoundingClientRect().height;
            el.style.height = `${currentHeight + 1}px`;
            // Wait a brief period before setting the height back to the original height.
            // This will trigger the Google map to resize itself to fit the new height and thus
            // fix any layout issues.
            setTimeout(() => {
                el.style.height = `${currentHeight}px`;
            }, 100);
        }
    };

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
     * Set whether to hide businesses on the map.
     *
     * This can be called after the map has been rendered.
     *
     * @param {boolean} [value] Whether to hide businesses. Defaults to true.
     * @returns {Map}
     */
    setHideBusinesses(value: boolean = true): Map {
        this.hideBusinesses = value;
        return this;
    }

    /**
     * Set whether to hide all points of interest on the map.
     *
     * This can be called after the map has been rendered.
     *
     * @param {boolean} [value] Whether to hide all points of interest. Defaults to true.
     * @returns {Map}
     */
    setHidePointsOfInterest(value: boolean = true): Map {
        this.hidePointsOfInterest = value;
        return this;
    }

    /**
     * Set whether to hide transit lines and stations on the map.
     *
     * This can be called after the map has been rendered.
     *
     * @param {boolean} [value] Whether to hide transit lines and stations. Defaults to true.
     * @returns {Map}
     */
    setHideTransit(value: boolean = true): Map {
        this.hideTransit = value;
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
            if (typeof options.maxFitBoundsZoom !== 'undefined') {
                this.maxFitBoundsZoom = options.maxFitBoundsZoom;
            }
            if (typeof options.minFitBoundsZoom !== 'undefined') {
                this.minFitBoundsZoom = options.minFitBoundsZoom;
            }
            if (typeof options.maxZoom !== 'undefined') {
                this.maxZoom = options.maxZoom;
            }
            if (typeof options.minZoom !== 'undefined') {
                this.minZoom = options.minZoom;
            }

            if (isBoolean(options.preventPageZoom)) {
                this.preventPageZoom = options.preventPageZoom;
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

            if (isDefined(options.zoomControl)) {
                if (isBoolean(options.zoomControl)) {
                    this.#zoomControl.enabled = options.zoomControl;
                } else if (options.zoomControl instanceof ZoomControl) {
                    this.#zoomControl = options.zoomControl;
                }
            }

            // Set the styles for the map
            if (Array.isArray(options.styles)) {
                this.#styles = options.styles.map((style) => mapStyle(style));
            } else if (options.styles instanceof MapStyle) {
                this.#styles = [options.styles];
            }

            // Set the shortcut options to hide features on the map
            (Object.keys(hideFeatureTypes) as HideFeatureOption[]).forEach((key) => {
                if (isBoolean(options[key])) {
                    this.#setHideFeature(key, options[key]);
                }
            });

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
            // The option keys below are copied as-is, so index both objects by the key name.
            const newOptions = options as Record<string, unknown>;
            const currentOptions = this.#options as Record<string, unknown>;
            booleanOptions.forEach((key) => {
                if (isBoolean(newOptions[key])) {
                    currentOptions[key] = newOptions[key];
                }
            });
            const numberOptions = ['controlSize', 'heading', 'tilt'];
            numberOptions.forEach((key) => {
                if (isNumberOrNumberString(newOptions[key])) {
                    currentOptions[key] = newOptions[key];
                }
            });
            const stringOptions = ['backgroundColor', 'draggableCursor', 'draggingCursor', 'gestureHandling'];
            stringOptions.forEach((key) => {
                if (isStringWithValue(newOptions[key])) {
                    currentOptions[key] = newOptions[key];
                }
            });
            const otherOptions = ['mapTypeId', 'renderingType', 'streetView'];
            otherOptions.forEach((key) => {
                if (typeof newOptions[key] !== 'undefined') {
                    currentOptions[key] = newOptions[key];
                }
            });

            const map = this.#map;
            if (map) {
                this.#getMapOptions().then((mapOptions) => {
                    map.setOptions(mapOptions);
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
                loader().onceLoad(() => {
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
     * This also dispatches the "visible" and "map_load" events,
     * and calls the callback function.
     *
     * @returns {Promise<void>}
     */
    #showMap(): Promise<void> {
        return new Promise((resolve) => {
            // Only set up the map if it hasn't been set up yet or isn't in the process of being set up.
            if (!this.#isReady && !this.#isGettingMapOptions) {
                this.#isGettingMapOptions = true;

                // Get the DOM element to attach the map to
                const element = this.#element;
                if (element === null) {
                    throw new Error(
                        'The map element could not be found. Make sure the map selector is correct and the element exists.',
                    );
                }

                // If the element is not visible then wait for it to be visible before setting up the map.
                // This is intended to prevent issue where the map does not render correctly when it's first hidden.
                // https://davidwalsh.name/offsetheight-visibility
                // Issues that can happen if the element is hidden include:
                // - tiles won't load
                // - map controls don't display
                // - markers don't display.
                // The solution is to wait until the map is visible. Then it's set up and displayed.
                const elementDisplay = getComputedStyle(element).getPropertyValue('display');
                if (elementDisplay === 'none' || element.offsetHeight === 1 || element.offsetWidth === 0) {
                    const observer = new IntersectionObserver(
                        (entries) => {
                            entries.forEach((entry) => {
                                if (entry.isIntersecting) {
                                    observer.disconnect();
                                    this.#setupMapObject(element).then(() => {
                                        // Set a brief timeout to make sure the map is fully set up before resolving the promise
                                        // and dispatching the "ready" event.
                                        // This ensures that the tiles properly load and that the map is fully set up.
                                        setTimeout(() => {
                                            this.#setMapAsReady();
                                            resolve();
                                        }, 100);
                                    });
                                }
                            });
                        },
                        {
                            root: document.documentElement,
                        },
                    );

                    observer.observe(element);
                } else {
                    this.#setupMapObject(element).then(() => {
                        this.#setMapAsReady();
                        resolve();
                    });
                }
            } else if (!this.#isReady) {
                // Wait for the map options to be set up and the map to be ready
                this.onceImmediate(MapEvents.READY, () => {
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }

    /**
     * Keep a pinch on the map from zooming the whole page on iOS.
     *
     * iOS ignores "user-scalable=no" in the viewport tag, so the gesture events that Safari fires
     * are canceled instead. The map still zooms because the Google Maps API handles the pinch
     * itself. Only the map element is covered so that the rest of the page can still be zoomed by
     * people who need to. Other browsers don't fire these events, so this does nothing in them.
     *
     * @private
     */
    #setupPreventPageZoom = () => {
        const element = this.#element;
        // Don't add the listener if it's turned off, if there's no element to add it to,
        // or if it has already been added.
        if (!this.#preventPageZoom || !element || this.#pageZoomHandler) {
            return;
        }
        const handler = (event: Event) => {
            event.preventDefault();
        };
        this.#pageZoomHandler = handler;
        ['gesturestart', 'gesturechange', 'gestureend'].forEach((eventName) => {
            element.addEventListener(eventName, handler, { passive: false });
        });
    };

    /**
     * Stop keeping a pinch on the map from zooming the whole page
     *
     * @private
     */
    #removePreventPageZoom = () => {
        const element = this.#element;
        const handler = this.#pageZoomHandler;
        if (!element || !handler) {
            return;
        }
        ['gesturestart', 'gesturechange', 'gestureend'].forEach((eventName) => {
            element.removeEventListener(eventName, handler);
        });
        this.#pageZoomHandler = null;
    };

    /**
     * Set up the map object
     *
     * @param {HTMLElement} element THe HTML elemen to attach the map to
     * @returns {Promise<void>}
     */
    #setupMapObject = (element: HTMLElement): Promise<void> =>
        new Promise((resolve) => {
            // Get the map options
            this.#getMapOptions().then((mapOptions) => {
                const map = new google.maps.Map(element, mapOptions);
                this.#map = map;
                this.setEventGoogleObject(map);

                // Keep a pinch on the map from zooming the whole page on iOS
                this.#setupPreventPageZoom();

                // Add any custom controls to the map
                if (this.#customControls.length > 0) {
                    this.#customControls.forEach((control) => {
                        map.controls[convertControlPosition(control.position)].push(control.element);
                    });
                }
                this.#customControls = [];

                resolve();
            });
        });

    /**
     * Set the map as ready
     */
    #setMapAsReady = () => {
        // Set the flags before dispatching, not after. Anything running inside a "ready" handler
        // asks the map whether it's ready - Marker.#setMap() branches on getIsReady() - and used
        // to be told that it wasn't, so it took the slow path of waiting for a ready event that
        // had already been dispatched.
        this.#isInitialized = true;
        this.#isReady = true;
        // The map is set up, so it's no longer being set up. This was never cleared, which left
        // the flag true for the life of the map.
        this.#isGettingMapOptions = false;

        // Dispatch the event to say that the map is visible and ready
        this.dispatch(MapEvents.READY);
        // Dispatch the event on the loader to say that the map is fully loaded.
        // This is done because the map is loaded after the loader's "load" event is dispatched
        // and some objects depend on the map being loaded before they can be set up.
        loader().dispatch(LoaderEvents.MAP_LOAD);
    };

    /**
     * Stop watching for the user's location
     *
     * @returns {Map}
     */
    stopLocate(): Map {
        // There is only a watch to clear if locate() started watching the user's location
        if (navigator.geolocation && typeof this.#watchId !== 'undefined') {
            navigator.geolocation.clearWatch(this.#watchId);
        }
        return this;
    }

    /**
     * Returns the Google map object.
     *
     * The Google map object is set up when the map is shown. Before that this returns undefined.
     * Use init(), load(), or show() and wait for them to resolve before calling this.
     *
     * @returns {google.maps.Map|undefined}
     */
    toGoogle(): google.maps.Map | undefined {
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
