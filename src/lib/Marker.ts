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
        This, however, can be simplified with the svgIconXml option. It takes care of doing the base64 encoding.
        G.marker(this.map, {
            svgIconXml: svg,
            title: 'My location',
        });
=========================================================================== */

import { icon, IconValue } from './Icon';
import { svgSymbol, SvgSymbolValue } from './SvgSymbol';
import { latLng, LatLng, LatLngValue, LatLngLiteral, LatLngLiteralExpanded } from './LatLng';
import { Map } from './Map';
import { getPixelsFromLatLng, isNumber, isObject, isString, isStringOrNumber, isStringWithValue } from './helpers';

export type MarkerLabel = {
    // A CSS class name to be added to the label element
    className?: string;
    // The color of the label text. Default color is black.
    color?: string;
    // The font family of the label text (equivalent to the CSS font-family property).
    fontFamily?: string;
    // The font size of the label text (equivalent to the CSS font-size property). Default size is 14px.
    // If it's set to a number then "px" will be added to the end of the number.
    fontSize?: string | number;
    // The font weight of the label text (equivalent to the CSS font-weight property).
    fontWeight?: string;
    // The text to be displayed in the label.
    text: string | number;
};

// Marker options
export type MarkerOptions = {
    // The cursor type to show on hover. Defaults to "pointer" if not set.
    cursor?: string;
    // The icon value for the marker
    icon?: IconValue;
    // The label value for the marker
    label?: string | number | MarkerLabel;
    // The latitude for the marker. You can use "lat" or "latitude" as the property name.
    lat: number | string;
    latitude: number | string;
    // The longitude for the marker. You can use "lng" or "longitude" as the property name.
    lng: number | string;
    longitude: number | string;
    // The map to add the marker to.
    map?: Map | google.maps.Map;
    // The SVG icon value for the marker
    svgIcon?: SvgSymbolValue;
    // The XML code for an SVG icon
    svgIconXml?: string;
    // The title for the marker. If a custom tooltip is not used, this will show as a default tooltip on the marker
    // that shows when you hover over a link with a title.
    title?: string;
    // The selector for the parent element that tooltips are added to.
    // Ideally this is the map container, but it can be any element.
    tooltipContainer?: string;
    // The class name for the tooltip element. Defaults to "tooltip" if not set
    tooltipClass?: string;
};

/**
 * Marker class to set up a single marker and add it to the map
 */
export class Marker {
    /**
     * Holds the latitude/longitude pair
     */
    private latLng: LatLng;

    /**
     * Holds the Google maps marker object
     */
    private marker: google.maps.Marker;

    /**
     * The type of object. For this class it will always be "marker"
     *
     *
     * You can use this in your logic to determine what type of object you're dealing with.
     * if (thing.objectType === 'marker') {}
     */
    objectType: string = 'marker';

    /**
     * Constructor
     *
     * @param {LatLngValue|MarkerOptions} [latLngValue] The latitude longitude pair
     * @param {MarkerOptions} [options] The marker options
     */
    constructor(latLngValue?: LatLngValue | MarkerOptions, options?: MarkerOptions) {
        // Set the marker latitude and longitude value
        if (latLngValue instanceof LatLng) {
            // The value passed is a LatLng class object
            this.latLng = latLngValue;
        } else if (Array.isArray(latLngValue)) {
            // The value passed is likely an array of [lat, lng] pairs
            this.latLng = latLng(latLngValue);
        } else if (
            isObject(latLngValue) &&
            typeof (latLngValue as LatLngLiteral).lat !== 'undefined' &&
            typeof (latLngValue as LatLngLiteral).lng !== 'undefined'
        ) {
            // The value passed is an object with lat/lng properties
            this.latLng = latLng(latLngValue as LatLngLiteral);
        } else if (
            isObject(latLngValue) &&
            typeof (latLngValue as LatLngLiteralExpanded).latitude !== 'undefined' &&
            typeof (latLngValue as LatLngLiteralExpanded).longitude !== 'undefined'
        ) {
            // The value passed is an object with latitude/longitude properties or its
            // the marker options with latitude and longitude set
            this.latLng = latLng(latLngValue as LatLngLiteralExpanded);
        }

        // Create the Google marker object
        this.marker = new google.maps.Marker();

        // Set up the marker options
        if (isObject(latLngValue)) {
            this.setOptions(latLngValue as MarkerOptions);
        } else if (isObject(options)) {
            this.setOptions(options);
        }
    }

    /**
     * Set the marker options
     *
     * @param {MarkerOptions} options The marker options
     * @returns {Marker}
     */
    setOptions(options: MarkerOptions): Marker {
        const markerOptions: google.maps.MarkerOptions = {};

        if (this.latLng) {
            markerOptions.position = this.latLng.toJson();
        }
        if (options.title && options.tooltipContainer) {
            // The title will be a custom tooltip that is added to the map container
            const tooltipClass = options.tooltipClass || 'tooltip';
            this.setTooltip(options.tooltipContainer, options.title, tooltipClass);
        } else if (options.title) {
            markerOptions.title = options.title;
        }
        // Set the marker icon
        if (options.icon) {
            markerOptions.icon = icon(options.icon).get();
        } else if (options.svgIconXml) {
            markerOptions.icon = `data:image/svg+xml;base64,${btoa(options.svgIconXml)}`;
        } else if (options.svgIcon) {
            markerOptions.icon = svgSymbol(options.svgIcon).get();
        }
        // Set the marker label
        if (isStringWithValue(options.label)) {
            markerOptions.label = options.label;
        } else if (isObject(options.label) && isStringOrNumber(options.label.text)) {
            markerOptions.label = {
                text: options.label.text.toString(),
                className: isStringWithValue(options.label.className) ? options.label.className : undefined,
                color: isStringWithValue(options.label.color) ? options.label.color : undefined,
                fontFamily: isStringWithValue(options.label.fontFamily) ? options.label.fontFamily : undefined,
                fontWeight: isStringWithValue(options.label.fontWeight) ? options.label.fontWeight : undefined,
            };
            // The font size must be a string with a unit. If it's a number then add "px" to the end of it
            if (isStringWithValue(options.label.fontSize) || isNumber(options.label.fontSize)) {
                if (isNumber(options.label.fontSize)) {
                    markerOptions.label.fontSize = `${options.label.fontSize}px`;
                } else {
                    markerOptions.label.fontSize = options.label.fontSize.toString();
                }
            }
        }
        // Set simple options
        const stringOptions = ['cursor'];
        stringOptions.forEach((key) => {
            if (options[key] && isStringWithValue(options[key])) {
                markerOptions[key] = options[key];
            }
        });
        if (options.map) {
            if (options.map instanceof Map) {
                markerOptions.map = options.map.get();
            } else if (options.map instanceof google.maps.Map) {
                markerOptions.map = options.map as google.maps.Map;
            }
        }
        this.marker.setOptions(markerOptions);
        return this;
    }

    /**
     * Set up a custom tooltip for the marker instead of relying on the default browser tooltip
     *
     * @param {string} containerSelector The selector for the parent element that tooltips are added to.
     * @param {string} title The tooltip title
     * @param {string} [tooltipClass] The class or classes for the tooltip element. If multiple classes are used then separate them with a space.
     * @returns
     */
    setTooltip(containerSelector: string, title: string, tooltipClass?: string): Marker {
        // Get the tooltip container and make sure it exists
        const container = document.querySelector(containerSelector);
        if (container) {
            const tooltip = document.createElement('div');
            if (isString(tooltipClass)) {
                const classes = tooltipClass.split(' ');
                classes.forEach((className) => {
                    tooltip.classList.add(className.trim());
                });
            }
            tooltip.innerHTML = title;
            tooltip.style.position = 'absolute';
            this.marker.addListener('mouseover', () => {
                const pixels = getPixelsFromLatLng(this.marker.getMap() as google.maps.Map, this.marker.getPosition());
                tooltip.style.left = `${pixels.x}px`;
                tooltip.style.top = `${pixels.y}px`;
                container.appendChild(tooltip);
            });
            this.marker.addListener('mouseout', () => {
                container.removeChild(tooltip);
            });
        } else {
            throw new Error('Invalid tool tip container selector');
        }
        return this;
    }

    /**
     * Adds the marker to the Google map object
     *
     * @param {Map|google.maps.Map} map The map object
     */
    addTo(map: Map | google.maps.Map): void {
        if (map instanceof Map) {
            this.marker.setMap(map.get());
        } else if (map instanceof google.maps.Map) {
            this.marker.setMap(map);
        }
    }

    /**
     * Get the LatLng object
     *
     * @link https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
     * @returns {LatLng}
     */
    getLatLng(): LatLng {
        return this.latLng;
    }

    /**
     * Remove the marker from the map
     *
     * @returns {Marker}
     */
    remove(): Marker {
        this.marker.setMap(null);
        return this;
    }

    /**
     * Set the latitude and longitude value for the marker
     *
     * @param {LatLngValue} latLngValue The latitude/longitude position for the marker
     * @returns {Marker}
     */
    setLatLng(latLngValue: LatLngValue): Marker {
        this.latLng = latLng(latLngValue);
        this.marker.setPosition(this.latLng.get());
        return this;
    }

    /**
     * Get the Google maps marker object
     *
     * @link https://developers.google.com/maps/documentation/javascript/reference/marker#Marker
     * @returns {google.maps.Marker}
     */
    get(): google.maps.Marker {
        return this.marker;
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
