/// <reference types="google.maps" />
import { Evented, EventCallbackData } from './Evented';
import { IconValue } from './Icon';
import { LatLng, LatLngValue } from './LatLng';
import { Map } from './Map';
import { SvgSymbolValue } from './SvgSymbol';
import { TooltipValue } from './Tooltip';
export type MarkerLabel = {
    className?: string;
    color?: string;
    fontFamily?: string;
    fontSize?: string | number;
    fontWeight?: string;
    text: string | number;
};
export type MarkerOptions = {
    cursor?: string;
    eventData?: EventCallbackData;
    icon?: IconValue;
    label?: string | number | MarkerLabel;
    lat: number | string;
    latitude: number | string;
    lng: number | string;
    longitude: number | string;
    map?: Map | google.maps.Map;
    svgIcon?: SvgSymbolValue;
    svgIconXml?: string;
    title?: string;
    tooltip?: TooltipValue;
};
/**
 * Marker class to set up a single marker and add it to the map
 */
export declare class Marker extends Evented {
    /**
     * Holds the latitude/longitude pair
     */
    private latLng;
    /**
     * Holds the Google maps marker object
     */
    private marker;
    /**
     * The type of object. For this class it will always be "marker"
     *
     *
     * You can use this in your logic to determine what type of object you're dealing with.
     * if (thing.objectType === 'marker') {}
     */
    objectType: string;
    /**
     * Constructor
     *
     * @param {LatLngValue|MarkerOptions} [latLngValue] The latitude longitude pair
     * @param {MarkerOptions} [options] The marker options
     */
    constructor(latLngValue?: LatLngValue | MarkerOptions, options?: MarkerOptions);
    /**
     * Set the marker options
     *
     * @param {MarkerOptions} options The marker options
     * @returns {Marker}
     */
    setOptions(options: MarkerOptions): Marker;
    /**
     * Set up a custom tooltip for the marker instead of relying on the default browser tooltip
     *
     * @param {string} containerSelector The selector for the parent element that tooltips are added to.
     * @param {string} title The tooltip title
     * @param {string} [tooltipClass] The class or classes for the tooltip element. If multiple classes are used then separate them with a space.
     * @returns
     */
    setTooltip(tooltipValue: TooltipValue, title: string): Marker;
    /**
     * Adds the marker to the Google map object
     *
     * @param {Map|google.maps.Map} map The map object
     */
    addTo(map: Map | google.maps.Map): void;
    /**
     * Get the LatLng object
     *
     * @link https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
     * @returns {LatLng}
     */
    getLatLng(): LatLng;
    /**
     * Add an event listener to the object
     *
     * @param {string} type The event type
     * @param {function} callback The event listener function
     * @param {object|boolean} [options] The options object or a boolean to indicate if the event should be captured
     */
    on(type: string, callback: EventListenerOrEventListenerObject): void;
    /**
     * Remove the marker from the map
     *
     * @returns {Marker}
     */
    remove(): Marker;
    /**
     * Set the latitude and longitude value for the marker
     *
     * @param {LatLngValue} latLngValue The latitude/longitude position for the marker
     * @returns {Marker}
     */
    setLatLng(latLngValue: LatLngValue): Marker;
    /**
     * Get the Google maps marker object
     *
     * @link https://developers.google.com/maps/documentation/javascript/reference/marker#Marker
     * @returns {google.maps.Marker}
     */
    get(): google.maps.Marker;
}
export type MarkerValue = Marker | MarkerOptions | LatLngValue;
/**
 * Helper function to set up the marker object
 *
 * @param {MarkerValue} [latLngValue] The latitude/longitude pair or the marker options
 * @param {MarkerOptions} [options] The marker options
 * @returns {Marker}
 */
export declare const marker: (latLngValue?: MarkerValue, options?: MarkerOptions) => Marker;
