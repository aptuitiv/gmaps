/// <reference types="google.maps" />
import { EventCallback, EventOptions } from './Evented';
import { Icon, IconValue } from './Icon';
import { LatLng, LatLngValue } from './LatLng';
import Layer from './Layer';
import { Map } from './Map';
import { Point, PointValue } from './Point';
import { SvgSymbol, SvgSymbolValue } from './SvgSymbol';
import { TooltipValue } from './Tooltip';
export type MarkerLabel = google.maps.MarkerLabel;
type GMMarkerOptions = {
    anchorPoint?: Point;
    cursor?: string;
    icon?: Icon | SvgSymbol | string;
    label?: string | MarkerLabel;
    map?: Map;
    position?: LatLng;
    title?: string;
};
export type MarkerOptions = GMMarkerOptions & {
    anchorPoint?: PointValue;
    icon?: IconValue;
    lat?: number | string;
    latitude?: number | string;
    lng?: number | string;
    longitude?: number | string;
    position?: LatLngValue;
    svgIcon?: SvgSymbolValue | string;
    tooltip?: TooltipValue;
};
/**
 * Marker class to set up a single marker and add it to the map
 */
export declare class Marker extends Layer {
    #private;
    /**
     * Constructor
     *
     * @param {LatLngValue|MarkerOptions} [position] The latitude longitude pair
     * @param {MarkerOptions} [options] The marker options
     */
    constructor(position?: LatLngValue | MarkerOptions, options?: MarkerOptions);
    /**
     * Get the anchor point for the marker
     *
     * @returns {Point}
     */
    get anchorPoint(): Point;
    /**
     * Set the anchor point for the marker
     *
     * @param {PointValue} value The anchor point for the marker
     */
    set anchorPoint(value: PointValue);
    /**
     * Get the cursor type to show on hover
     *
     * @returns {string}
     */
    get cursor(): string;
    /**
     * Set the cursor type to show on hover
     *
     * @param {string} value The cursor type to show on hover
     */
    set cursor(value: string);
    /**
     * Get the icon for the marker
     *
     * @returns {Icon | SvgSymbol | string}
     */
    get icon(): Icon | SvgSymbol | string;
    /**
     * Set the icon for the marker
     *
     * @param {Icon | SvgSymbol | string} value The icon value for the marker
     */
    set icon(value: Icon | SvgSymbol | string);
    /**
     * Get the label for the marker
     *
     * @returns {string | number | MarkerLabel}
     */
    get label(): string | number | MarkerLabel;
    /**
     * Set the label for the marker
     *
     * @param {string | number | MarkerLabel} value The label value for the marker
     */
    set label(value: string | number | MarkerLabel);
    /**
     * Get the map object
     *
     * @returns {Map}
     */
    get map(): Map;
    /**
     * Set the map object
     *
     * @param {Map|null} value The map object. Set to null if you want to remove the marker from the map.
     */
    set map(value: Map | null);
    /**
     * Get the marker position
     *
     * @returns {LatLng}
     */
    get position(): LatLng;
    /**
     * Set the latitude and longitude value for the marker
     *
     * @param {LatLngValue} value The latitude/longitude position for the marker
     */
    set position(value: LatLngValue);
    /**
     * Get the title for the marker
     *
     * @returns {string}
     */
    get title(): string;
    /**
     * Set the title for the marker
     *
     * @param {string} value The title for the marker
     */
    set title(value: string);
    /**
     * Adds the marker to the map object
     *
     * Alternate of show()
     *
     * @param {Map} map The map object
     * @returns {Marker}
     */
    display(map: Map): Marker;
    /**
     * Get the marker position (i.e. the LatLng object)
     *
     * https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLng
     *
     * @returns {LatLng}
     */
    getPosition(): LatLng;
    /**
     * Hide the marker
     *
     * @returns {Marker}
     */
    hide(): Marker;
    /**
     * Add an event listener to the object
     *
     * @param {string} type The event type
     * @param {EventCallback} callback The event listener function
     * @param {EventOptions} [options] The event listener options
     * @param {object} [context] The context to bind the callback function to
     */
    on(type: string, callback: EventCallback, options?: EventOptions, context?: object): void;
    /**
     * Adds the marker to the map object
     *
     * Alternate of show()
     *
     * @param {Map} map The map object
     * @returns {Marker}
     */
    setMap(map: Map): Marker;
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
     * @param {TooltipValue} tooltipValue The tooltip value
     * @param {string} title The tooltip title
     * @returns {Marker}
     */
    setTooltip(tooltipValue: TooltipValue, title?: string): Marker;
    /**
     * Set the latitude and longitude value for the marker
     *
     * @param {LatLngValue} value The latitude/longitude position for the marker
     * @returns {Marker}
     */
    setPosition(value: LatLngValue): Marker;
    /**
     * Adds the marker to the map object
     *
     * Alternate of setMap()
     *
     * @param {Map} map The map object
     * @returns {Marker}
     */
    show(map: Map): Marker;
    /**
     * Get the Google maps marker object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/marker#Marker
     *
     * @returns {google.maps.Marker}
     */
    toGoogle(): google.maps.Marker;
}
export type MarkerValue = Marker | MarkerOptions | LatLngValue;
/**
 * Helper function to set up the marker object
 *
 * @param {MarkerValue} [position] The latitude/longitude pair or the marker options
 * @param {MarkerOptions} [options] The marker options
 * @returns {Marker}
 */
export declare const marker: (position?: MarkerValue, options?: MarkerOptions) => Marker;
export {};
