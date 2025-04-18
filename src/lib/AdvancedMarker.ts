/* ===========================================================================
    Enables building and managing advanced markers on the map.

    This is here as a starting point for when AdvancedMarkers are better.
    This was a copy of the Marker.ts file with some updates to try and get the AdvancedMarker library working.
    It will display a marker on the map but there are issues with hover events.
    We also ahd to do some workarounds to try and get the click events to work.
    This is not complete and ready for production.

    Google has deprecated the regular marker class and has replaced it with the AdvancedMarker library.
    However, as of April, 2024 there are issues and roadblocks preventing us from completely
    replacing the regular marker class with the AdvancedMarker library.

    https://stackoverflow.com/questions/77044160/google-maps-javascript-api-draggable-markers-dont-trigger-neither-click-nor
    https://stackoverflow.com/questions/76860379/google-maps-advancedmarker-hover-listener-function-not-working

    https://developers.google.com/maps/documentation/javascript/advanced-markers/migration
    https://developers.google.com/maps/documentation/javascript/reference/advanced-markers

=========================================================================== */

/* global google */

import { EventCallback, EventConfig } from './Evented';
import { icon, Icon, IconValue } from './Icon';
import { latLng, LatLng, LatLngValue } from './LatLng';
import Layer from './Layer';
import { loader } from './Loader';
import { Map } from './Map';
import { point, Point, PointValue } from './Point';
import { svgSymbol, SvgSymbol, SvgSymbolValue } from './SvgSymbol';
import { TooltipValue } from './Tooltip';
import {
    checkForGoogleMaps,
    isNullOrUndefined,
    isNumber,
    isNumberOrNumberString,
    isObject,
    isPromise,
    isString,
    isStringOrNumber,
    isStringWithValue,
} from './helpers';

export type MarkerLabel = google.maps.MarkerLabel;

// Options that will be passed to the Google maps marker object
type GMMarkerOptions = {
    // The offset from the marker's position to the tip of an InfoWindow that has been opened with the marker as anchor.
    anchorPoint?: Point;
    // The cursor type to show on hover. Defaults to "pointer" if not set.
    cursor?: string;
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

// This is needed because the gmpClickable property is in beta so it's not in the type definitions
type AdvancedMarkerOptions = google.maps.marker.AdvancedMarkerElementOptions & {
    gmpClickable?: boolean;
};

/**
 * AdvancedMarker class to set up a single advanced marker and add it to the map
 */
export class AdvancedMarker extends Layer {
    /**
     * Holds if the map is initialized or not
     *
     * @private
     * @type {boolean}
     */
    #isInitialized: boolean = false;

    /**
     * Holds the Google maps marker object
     *
     * @private
     * @type {google.maps.marker.AdvancedMarkerElement}
     */
    #marker: google.maps.marker.AdvancedMarkerElement;

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
        super('marker', 'AdvancedMarker', 'marker');

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
     * @returns {AdvancedMarker}
     */
    display(map: Map): AdvancedMarker {
        this.setMap(map);
        return this;
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
     * @returns {AdvancedMarker}
     */
    hide(): AdvancedMarker {
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
     * Add an event listener to the Google maps object
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener function
     * @param {EventConfig} [config] Configuration for the event.
     */
    on(type: string, callback: EventCallback, config?: EventConfig): void {
        // This has a few tests for trying to get mouseenter events to work.
        // Tried following instructions on https://stackoverflow.com/questions/76860379/google-maps-advancedmarker-hover-listener-function-not-working
        // but it still didn't work.

        // let eventType = type;
        // if (eventType === 'click') {
        //     eventType = 'gmp-click';
        // }
        if (type === 'mouseenter') {
            // this.#marker.content.addEventListener('click', () => {
            //     console.log('click');
            // });
            this.#marker.addListener('mouseover', () => {
                console.log('mouseover');
            });
            this.#marker.content.addEventListener('mouseover', () => {
                console.log('content mouseover');
            });
        } else {
            super.on(type, callback, config);
        }
        // if (eventType === 'click') {
        //     if (this.#marker) {
        //         console.log('Marker on: ', eventType, callback);
        //         this.#marker.addListener(eventType, () => {
        //             console.log('marker event: ', eventType);
        //             callback.call(this);
        //         });
        //     }
        // } else {
        //     this.setupEventListener(eventType, callback, config);
        // }
    }

    /**
     * Set the anchor point for the marker
     *
     * @param {PointValue} value The anchor point for the marker
     * @returns {Promise<AdvancedMarker>}
     */
    async setAnchorPoint(value: PointValue): Promise<AdvancedMarker> {
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
     * @returns {AdvancedMarker}
     */
    setAnchorPointSync(value: PointValue): AdvancedMarker {
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
        // @todo Remove this as anchor point isn't used on AdvaneceMarkers
        // this.#marker.setOptions({ anchorPoint: this.#options.anchorPoint.toGoogle() });
    }

    /**
     * Set the cursor type to show on hover
     *
     * @param {string} value The cursor type to show on hover
     * @returns {Promise<AdvancedMarker>}
     */
    async setCursor(value: string): Promise<AdvancedMarker> {
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
     * @returns {AdvancedMarker}
     */
    setCursorSync(value: string): AdvancedMarker {
        this.#setupGoogleMarkerSync();
        this.#setCursor(value);
        return this;
    }

    /**
     * Set the anchor point for the marker
     *
     * @param {string} value The cursor type to show on hover
     */
    #setCursor(value: string) {
        if (isStringWithValue(value)) {
            this.#options.cursor = value;
        } else if (isNullOrUndefined(value)) {
            this.#options.cursor = undefined;
        }
        // @todo Remove this as cursors isn't used on AdvaneceMarkers
        // this.#marker.setCursor(this.#options.cursor);
    }

    /**
     * Set the icon value for the marker
     *
     * @param {Icon | SvgSymbol | string} value The icon for the marker
     * @returns {AdvancedMarker}
     */
    async setIcon(value: Icon | SvgSymbol | string): Promise<AdvancedMarker> {
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
     * @returns {AdvancedMarker}
     */
    setIconSync(value: Icon | SvgSymbol | string): AdvancedMarker {
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

        // @todo Need to get icons/images working on the AdvancedMarker library
        // if (isString(this.#options.icon)) {
        //     this.#marker.setIcon(this.#options.icon);
        // } else {
        //     this.#marker.setIcon(this.#options.icon.toGoogle());
        // }
    }

    /**
     * Set the label value for the marker
     *
     * @param {string | number | MarkerLabel} value The label for the marker
     * @returns {AdvancedMarker}
     */
    async setLabel(value: string | number | MarkerLabel): Promise<AdvancedMarker> {
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
     * @returns {AdvancedMarker}
     */
    setLabelSync(value: string | number | MarkerLabel): AdvancedMarker {
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
                text: value.text.toString(),
                className: isStringWithValue(value.className) ? value.className : undefined,
                color: isStringWithValue(value.color) ? value.color : undefined,
                fontFamily: isStringWithValue(value.fontFamily) ? value.fontFamily : undefined,
                fontWeight: isStringWithValue(value.fontWeight) ? value.fontWeight : undefined,
            };
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
        // @todo See how to get this to work with AdvancedMarkers
        // this.#marker.setLabel(this.#options.label);
    }

    /**
     * Adds the marker to the map object
     *
     * Alternate of show()
     *
     * @param {Map} map The map object. Set to null if you want to remove the marker from the map.
     * @returns {Promise<AdvancedMarker>}
     */
    async setMap(map: Map | null): Promise<AdvancedMarker> {
        await this.#setupGoogleMarker();
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
     * @returns {AdvancedMarker}
     */
    setMapSync(map: Map | null): AdvancedMarker {
        this.#setupGoogleMarkerSync();
        this.#setMap(map);
        return this;
    }

    /**
     * Set the map object
     *
     * @param {Map|null} value The map object. Set to null if you want to remove the marker from the map.
     */
    #setMap(value: Map | Promise<Map> | null) {
        if (value instanceof Map) {
            // Set the map
            this.#options.map = value;
            super.setMap(value);
            this.#marker.map = value.toGoogle();
        } else if (isNullOrUndefined(value)) {
            // Remove the marker from the map
            this.#options.map = null;
            super.setMap(null);
            if (this.#marker) {
                this.#marker.map = null;
            }
        } else if (isPromise(value)) {
            // The map value is a Promise. This could come from a situation like this:
            // const map = map({ options }).load();
            // In that case, the "map" variable is the promise returned from "load()".
            value.then((map) => {
                this.#options.map = map;
                super.setMap(map);
                this.#marker.map = map.toGoogle();
            });
        }
    }

    /**
     * Set the marker options
     *
     * @param {MarkerOptions} options The marker options
     * @returns {AdvancedMarker}
     */
    setOptions(options: MarkerOptions): AdvancedMarker {
        console.log('Marker setOptions: ', options);
        // Set the anchor point
        if (options.anchorPoint) {
            this.anchorPoint = options.anchorPoint;
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
            console.log('options position: ', latLngValue);
            this.position = latLngValue;
            console.log('this.position: ', this.position);
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

        // // Set the map. This must come last so that the opther options are set.
        if (options.map) {
            this.setMap(options.map);
        }

        return this;
    }

    /**
     * Set the latitude and longitude value for the marker
     *
     * @param {LatLngValue} value The latitude/longitude position for the marker
     * @returns {Promise<AdvancedMarker>}
     */
    async setPosition(value: LatLngValue): Promise<AdvancedMarker> {
        await this.#setupGoogleMarker();
        this.#setPosition(value);
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
     * @returns {AdvancedMarker}
     */
    setPositionSync(value: LatLngValue): AdvancedMarker {
        this.#setupGoogleMarkerSync();
        this.#setPosition(value);
        return this;
    }

    /**
     * Set the latitude and longitude value for the marker
     *
     * @param {LatLngValue} value The latitude/longitude position for the marker
     */
    #setPosition(value: LatLngValue) {
        const position = latLng(value);
        console.log('#setPosition: ', value, position);
        if (position.isValid()) {
            console.log('#setPosition: ', position);
            this.#options.position = position;
            this.#marker.position = this.#options.position.toGoogle();
        }
    }

    /**
     *Set the title for the marker
     *
     * @param {string} value The title to show on hover
     * @returns {Promise<AdvancedMarker>}
     */
    async setTitle(value: string): Promise<AdvancedMarker> {
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
     * @returns {AdvancedMarker}
     */
    setTitleSync(value: string): AdvancedMarker {
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
        this.#marker.title = this.#options.title;
    }

    /**
     * Adds the marker to the map object
     *
     * Alternate of setMap()
     *
     * @param {Map} map The map object
     * @returns {Promise<AdvancedMarker>}
     */
    show(map: Map): Promise<AdvancedMarker> {
        return this.setMap(map);
    }

    /**
     * Get the Google maps marker object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker
     *
     * @returns {Promise<google.maps.marker.AdvancedMarkerElement>}
     */
    toGoogle(): Promise<google.maps.marker.AdvancedMarkerElement> {
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
     * @returns {google.maps.marker.AdvancedMarkerElement}
     */
    toGoogleSync(): google.maps.marker.AdvancedMarkerElement {
        this.#setupGoogleMarkerSync();
        return this.#marker;
    }

    /**
     * Set up the Google maps marker object if necessary
     *
     * @private
     * @returns {Promise<void>}
     */
    #setupGoogleMarker(): Promise<void> {
        return new Promise((resolve) => {
            if (!isObject(this.#marker)) {
                // The lowercase "marker" refers to the AdvancedMarker library
                if (checkForGoogleMaps('Marker', 'marker', false)) {
                    this.#createMarkerObject();
                    resolve();
                } else if (!this.#isInitialized) {
                    // Only initialize the marker once.
                    // If this isn't done then the marker may be created multiple times.
                    this.#isInitialized = true;
                    // The Google maps object isn't available yet. Wait for it to load.
                    // The developer may have set the map on the marker before the Google maps object was available.
                    loader().onMapLoad(() => {
                        this.#createMarkerObject();
                        // Make sure that the map is still set.
                        // It's unlikely, but possible, that the developer could have removed the map
                        // from the marker before the Google maps object was available.
                        const map = this.getMap();
                        if (this.#marker && map) {
                            this.#marker.map = map.toGoogle();
                        }
                        resolve();
                    });
                } else {
                    this.onceImmediate('initialized', () => {
                        resolve();
                    });
                }
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
            // The lowercase "marker" refers to the AdvancedMarker library
            if (checkForGoogleMaps('Marker', 'marker', false)) {
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
     */
    #createMarkerObject() {
        if (!this.#marker) {
            const markerOptions: AdvancedMarkerOptions = {};
            // Options that can be set on the marker without any modification
            const optionsToSet = ['cursor', 'title'];
            optionsToSet.forEach((key) => {
                if (typeof this.#options[key] !== 'undefined') {
                    markerOptions[key] = this.#options[key];
                }
            });

            // @todo See how to get this to work with AdvancedMarkers
            // Options that have to be converted to Google maps objects
            // if (this.#options.anchorPoint) {
            //     markerOptions.anchorPoint = this.#options.anchorPoint.toGoogle();
            // }
            // if (this.#options.icon) {
            //     if (isString(this.#options.icon)) {
            //         markerOptions.icon = this.#options.icon;
            //     } else if (this.#options.icon instanceof Icon || this.#options.icon instanceof SvgSymbol) {
            //         markerOptions.icon = this.#options.icon.toGoogle();
            //     }
            // }
            if (this.#options.map) {
                markerOptions.map = this.#options.map.toGoogle();
            }
            if (this.#options.position) {
                markerOptions.position = this.#options.position.toGoogle();
            }
            markerOptions.gmpClickable = true;
            this.#marker = new google.maps.marker.AdvancedMarkerElement(markerOptions);
            this.dispatch('initialized');
            this.setEventGoogleObject(this.#marker);
        }
    }
}

// The possible values for the latLngValue parameter
export type MarkerValue = AdvancedMarker | MarkerOptions | LatLngValue;

/**
 * Helper function to set up the marker object
 *
 * @param {MarkerValue} [position] The latitude/longitude pair or the marker options
 * @param {MarkerOptions} [options] The marker options
 * @returns {AdvancedMarker}
 */
export const advancedMarker = (position?: MarkerValue, options?: MarkerOptions): AdvancedMarker => {
    if (position instanceof AdvancedMarker) {
        return position;
    }
    return new AdvancedMarker(position, options);
};
