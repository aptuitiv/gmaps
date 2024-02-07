/* ===========================================================================
    Enables building and managing markers on the map.

    https://developers.google.com/maps/documentation/javascript/markers
    https://developers.google.com/maps/documentation/javascript/reference/marker

    Example usage:
    const marker = G.marker({
        latitude: 40.730610,
        longitude: -73.935242,
        title: 'My Marker'
    });
    marker.addTo(map);

    // Or, with a custom tooltip
    const marker = G.marker({
        latitude: 40.730610,
        longitude: -73.935242,
        title: 'My Marker',
        tooltipContainer: '#map',
        tooltipClass: 'my-tooltip'
    });
    marker.addTo(map);

    There are a few ways to set an icon for the marker.
    1. Pass the URL for the icon to the "icon" option.
    2. Pass an Icon class object to the "icon" option.
    3. Pass an SvgSymbol class object to the "svgIcon" option.

    There are a few ways to set an SVG icon for the marker.
    1. Use the path for an icon and set up an SvgSymbol class object. Then pass that value to the svgIcon option.
        const svg = G.svgSymbol({
            path: 'M-6,0a6,6 0 1,0 12,0a6,6 0 1,0 -12,0',
            fillColor: '#5284ed',
            fillOpacity: 1,
            scale: 1,
            strokeColor: '#5284ed',
            strokeOpacity: 0.5,
            strokeWeight: 4,
        });
        G.marker(this.map, {
            svgIcon: svg,
            title: 'My location',
        });
    2. Pass the URL for the SVG icon to the "icon" option.
        G.marker(this.map, {
            icon: 'https://site.com/url/to/svg-file.svg',
            title: 'My location',
        });
    3. Set up an Icon class object and pass that to the "icon" option.
        const svg = G.icon({
            url: 'https://site.com/url/to/svg-file.svg',
            size: [20, 32]
        });
        G.marker(this.map, {
            icon: svg,
            title: 'My location',
        });
    4. base64 encode the SVG HTML and pass that to the "icon" option.
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
                <circle opacity=".4" fill="#5284ed" cx="11" cy="11" r="11"/>
                <circle fill="#5284ed" stroke="#fff" stroke-width="1" cx="11" cy="11" r="7"/>
            </svg>`;
        G.marker(this.map, {
            icon: `data:image/svg+xml;base64,${btoa(svg)}`,
            title: 'My location',
        });
        This, however, can be simplified with the svgIcon option. It takes care of doing the base64 encoding.
        G.marker(this.map, {
            svgIcon: svg,
            title: 'My location',
        });

    If you want to pass custom data to events on the marker, you can use the eventData option.
    It should be an object of data.
    This will be passed to the event callback function in the "detail" property of the event.
    const marker = G.marker({
        latitude: 40.730610,
        longitude: -73.935242,
        eventData: {
            name: 'My Marker',
            image: 'https://site.com/url/to/image.jpg'
        }
    });
    marker.addEventListener('click', (e) => {
        console.log(e.detail.name); // 'My Marker'
        console.log(e.detail.image); // 'https://site.com/url/to/image.jpg'
    });
=========================================================================== */

/* global google */

import { EventCallback, EventOptions } from './Evented';
import { icon, Icon, IconValue } from './Icon';
import { latLng, LatLng, LatLngValue } from './LatLng';
import Layer from './Layer';
import { loader } from './Loader';
import { Map } from './Map';
import { point, Point, PointValue } from './Point';
import { svgSymbol, SvgSymbol, SvgSymbolValue } from './SvgSymbol';
import { tooltip, TooltipValue } from './Tooltip';
import {
    checkForGoogleMaps,
    isNumber,
    isNumberOrNumberString,
    isObject,
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
    // If it's a string then it's the XML code for the SVG icon.
    svgIcon?: SvgSymbolValue | string;
    // The tooltip for the marker. This will show when hovering over the tooltip.
    tooltip?: TooltipValue;
};

/**
 * Marker class to set up a single marker and add it to the map
 */
export class Marker extends Layer {
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
     * @param {LatLngValue|MarkerOptions} [latLngValue] The latitude longitude pair
     * @param {MarkerOptions} [options] The marker options
     */
    constructor(latLngValue?: LatLngValue | MarkerOptions, options?: MarkerOptions) {
        super('marker', 'Marker');

        // Set a default position
        this.#options.position = latLng([0, 0]);

        // Set the marker latitude and longitude value
        if (latLngValue instanceof LatLng || Array.isArray(latLngValue)) {
            // The value passed is a LatLng class object
            this.position = latLngValue;
            // Set up the marker options
            if (isObject(options)) {
                this.setOptions(options);
            }
        } else if (isObject(latLngValue)) {
            // The value passed is a marker options object
            this.setOptions(latLngValue as MarkerOptions);
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
        const anchor = point(value);
        if (anchor.isValid()) {
            this.#options.anchorPoint = anchor;
        }
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
        if (isStringWithValue(value)) {
            this.#options.cursor = value;
        }
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
        if (isString(value) || value instanceof Icon || value instanceof SvgSymbol) {
            this.#options.icon = value;
        }
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
        }
        this.#setupGoogleMarker();
        if (this.#marker) {
            this.#marker.setLabel(this.#options.label);
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
     * @param {Map|null} value The map object. Set to null if you want to remove the marker from the map.
     */
    set map(value: Map | null) {
        if (value instanceof Map) {
            // Set the map
            this.#options.map = value;
            super.setMap(value);
            this.#setupGoogleMarker();
            if (this.#marker) {
                this.#marker.setMap(value.toGoogle());
            } else {
                // The Google maps object isn't available yet. Wait for it to load.
                // The developer may have set the map on the marker before the Google maps object was available.
                loader().once('map_loaded', () => {
                    this.#setupGoogleMarker();
                    // Make sure that the map is still set.
                    // It's unlikely, but possible, that the developer could have removed the map
                    // from the marker before the Google maps object was available.
                    const map = this.getMap();
                    if (this.#marker && map) {
                        this.#marker.setMap(map.toGoogle());
                    }
                });
            }
        } else if (value === null) {
            // Remove the marker from the map
            this.#options.map = null;
            super.setMap(null);
            if (this.#marker) {
                this.#marker.setMap(null);
            }
        }
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
        const position = latLng(value);
        if (position.isValid()) {
            this.#options.position = position;
        }
        this.#setupGoogleMarker();
        if (this.#marker) {
            this.#marker.setPosition(this.#options.position.toGoogle());
        }
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
        if (isStringWithValue(value)) {
            this.#options.title = value;
        }
        this.#setupGoogleMarker();
        if (this.#marker) {
            this.#marker.setTitle(this.#options.title);
        }
    }

    /**
     * Adds the marker to the map object
     *
     * Alternate to setMap()
     *
     * @param {Map} map The map object
     */
    addTo(map: Map): void {
        this.map = map;
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
     * Add an event listener to the object
     *
     * @param {string} type The event type
     * @param {EventCallback} callback The event listener function
     * @param {EventOptions} [options] The event listener options
     * @param {object} [context] The context to bind the callback function to
     */
    on(type: string, callback: EventCallback, options?: EventOptions, context?: object): void {
        this.setupEventListener(type, callback, options, context);
    }

    /**
     * Remove the marker from the map
     *
     * @returns {Marker}
     */
    remove(): Marker {
        this.map = null;
        return this;
    }

    /**
     * Adds the marker to the map object
     *
     * Alternate of addTo()
     *
     * @param {Map} map The map object
     */
    setMap(map: Map): void {
        this.map = map;
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
        if (options.title && options.tooltip) {
            // The title will be a custom tooltip that is added to the map container
            this.setTooltip(options.tooltip, options.title);
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
            this.map = options.map;
        }

        return this;
    }

    /**
     * Set up a custom tooltip for the marker instead of relying on the default browser tooltip
     *
     * @param {TooltipValue} tooltipValue The tooltip value
     * @param {string} title The tooltip title
     * @returns {Marker}
     */
    setTooltip(tooltipValue: TooltipValue, title?: string): Marker {
        const tt = tooltip(tooltipValue);
        if (!tt.hasContent()) {
            tt.setContent(title);
        }
        if (tt.hasContent()) {
            this.#marker.addListener('mouseover', () => {
                tt.show(this.getMap(), this.#options.position);
            });
            this.#marker.addListener('mouseout', () => {
                tt.hide();
            });
        }
        return this;
    }

    /**
     * Set the latitude and longitude value for the marker
     *
     * @param {LatLngValue} value The latitude/longitude position for the marker
     * @returns {Marker}
     */
    setPosition(value: LatLngValue): Marker {
        this.position = value;
        return this;
    }

    /**
     * Get the Google maps marker object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker
     *
     * @returns {google.maps.Marker}
     */
    toGoogle(): google.maps.Marker {
        this.#setupGoogleMarker();
        return this.#marker;
    }

    /**
     * Set up the Google maps marker object if necessary and return it.
     *
     * @private
     */
    #setupGoogleMarker() {
        if (!isObject(this.#marker)) {
            if (checkForGoogleMaps('Marker', 'Marker', false)) {
                const markerOptions: google.maps.MarkerOptions = {};
                // Options that can be set on the marker without any modification
                const optionsToSet = ['cursor', 'title'];
                optionsToSet.forEach((key) => {
                    if (this.#options[key]) {
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
                        markerOptions.icon = this.#options.icon.toGoogle();
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
            }
        }
    }
}

// The possible values for the latLngValue parameter
export type MarkerValue = Marker | MarkerOptions | LatLngValue;

/**
 * Helper function to set up the marker object
 *
 * @param {MarkerValue} [latLngValue] The latitude/longitude pair or the marker options
 * @param {MarkerOptions} [options] The marker options
 * @returns {Marker}
 */
export const marker = (latLngValue?: MarkerValue, options?: MarkerOptions): Marker => {
    if (latLngValue instanceof Marker) {
        return latLngValue;
    }
    return new Marker(latLngValue, options);
};
