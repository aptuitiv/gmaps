/// <reference types="google.maps" />
import { LatLng, LatLngValue } from './LatLng';
import Layer from './Layer';
import { Map } from './Map';
import { Marker } from './Marker';
import { Size, SizeValue } from './Size';
type GMInfoWindowOptions = {
    ariaLabel?: string;
    content?: string | HTMLElement | Text;
    disableAutoPan?: boolean;
    maxWidth?: number;
    minWidth?: number;
    pixelOffset?: Size;
    position?: LatLng;
    zIndex?: number;
};
export type InfoWindowOptions = GMInfoWindowOptions & {
    autoClose?: boolean;
    focus?: boolean;
    pixelOffset?: SizeValue;
    position?: LatLngValue;
    toggleDisplay?: boolean;
};
/**
 * InfoWindow class
 */
export declare class InfoWindow extends Layer {
    #private;
    /**
     * Constructor
     *
     * @param {InfoWindowOptions} [options] The InfoWindow options
     */
    constructor(options?: InfoWindowOptions);
    /**
     * Get the aria label for the InfoWindow
     *
     * @returns {string}
     */
    get ariaLabel(): string;
    /**
     * Set the aria label for the InfoWindow
     *
     * @param {string|number} ariaLabel The aria label for the InfoWindow
     */
    set ariaLabel(ariaLabel: string | number);
    /**
     * Get the content for the InfoWindow
     *
     * @returns {string|HTMLElement|Text}
     */
    get content(): string | HTMLElement | Text;
    /**
     * Set the content for the InfoWindow
     *
     * @param {string|HTMLElement|Text} content The content for the InfoWindow
     */
    set content(content: string | HTMLElement | Text);
    /**
     * Get the disableAutoPan option for the InfoWindow
     *
     * @returns {boolean}
     */
    get disableAutoPan(): boolean;
    /**
     * Set the disableAutoPan option for the InfoWindow
     *
     * @param {boolean} disableAutoPan The disableAutoPan option for the InfoWindow
     */
    set disableAutoPan(disableAutoPan: boolean);
    /**
     * Get the maxWidth option for the InfoWindow
     *
     * @returns {number}
     */
    get maxWidth(): number;
    /**
     * Set the maxWidth option for the InfoWindow
     *
     * @param {number|string} maxWidth The maxWidth option for the InfoWindow
     */
    set maxWidth(maxWidth: number | string);
    /**
     * Get the minWidth option for the InfoWindow
     *
     * @returns {number}
     */
    get minWidth(): number;
    /**
     * Set the minWidth option for the InfoWindow
     *
     * @param {number|string} minWidth The minWidth option for the InfoWindow
     */
    set minWidth(minWidth: number | string);
    /**
     * Get the pixelOffset option for the InfoWindow
     *
     * @returns {Size}
     */
    get pixelOffset(): Size;
    /**
     * Set the pixelOffset option for the InfoWindow
     *
     * @param {SizeValue} pixelOffset The pixelOffset option for the InfoWindow
     */
    set pixelOffset(pixelOffset: SizeValue);
    /**
     * Get the position option for the InfoWindow
     *
     * @returns {LatLng}
     */
    get position(): LatLng;
    /**
     * Set the position option for the InfoWindow
     *
     * @param {LatLngValue} position The position option for the InfoWindow
     */
    set position(position: LatLngValue);
    /**
     * Get the zIndex option for the InfoWindow
     *
     * @returns {number}
     */
    get zIndex(): number;
    /**
     * Set the zIndex option for the InfoWindow
     *
     * @param {number|string} zIndex The zIndex option for the InfoWindow
     */
    set zIndex(zIndex: number | string);
    /**
     * Hide the info window
     *
     * Alias to hide()
     */
    close(): void;
    /**
     * Hide the info window
     */
    hide(): void;
    /**
     * Returns whether the InfoWindow is open or not
     *
     * @returns {boolean}
     */
    isOpen(): boolean;
    /**
     * Show the info window
     *
     * Alias to show()
     *
     * @param {Map | Marker} element The anchor object or map object.
     * @returns {InfoWindow}
     */
    open(element: Map | Marker): InfoWindow;
    /**
     * Set the InfoWindow options
     *
     * @param {InfoWindowOptions} options The InfoWindow options
     * @returns {InfoWindow}
     */
    setOptions(options: InfoWindowOptions): InfoWindow;
    /**
     * Set the InfoWindow content
     *
     * @param {string | HTMLElement | Text} content The InfoWindow content
     * @returns {InfoWindow}
     */
    setContent(content: string | HTMLElement | Text): InfoWindow;
    /**
     * Set the InfoWindow position
     *
     * @param {LatLngValue} position The position for the InfoWindow
     * @returns {InfoWindow}
     */
    setPosition(position: LatLngValue): InfoWindow;
    /**
     * Sets the zIndex value for the InfoWindow
     *
     * https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.setZIndex
     *
     * @param {number|string} zIndex The zindex value
     * @returns {InfoWindow}
     */
    setZIndex(zIndex: number | string): InfoWindow;
    /**
     * Show the info window
     *
     * You need to pass in either an anchor object or a map object.
     * If an anchor object is passed in then the info window will be displayed at the anchor's position.
     * If a map object is passed in then the info window will be displayed at the position of the info window.
     *
     * https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.open
     *
     * @param {Map | Marker} element The anchor object or map object.
     *      This should ideally be the Map or Marker object.
     * @returns {InfoWindow}
     */
    show(element: Map | Marker): InfoWindow;
    /**
     * Get the Google maps InfoWindow object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow
     *
     * @returns {google.maps.InfoWindow}
     */
    toGoogle(): google.maps.InfoWindow;
}
export type InfoWindowValue = InfoWindow | InfoWindowOptions;
/**
 * Helper function to set up the InfoWindow class
 *
 * @param {InfoWindowValue} [options] The InfoWindow options
 * @returns {InfoWindow}
 */
export declare const infoWindow: (options?: InfoWindowValue) => InfoWindow;
export {};
