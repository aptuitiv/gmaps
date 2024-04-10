import { Map } from './Map';
import { Marker } from './Marker';
import Overlay from './Overlay';
import { PointValue } from './Point';
export type PopupOptions = {
    autoHide?: boolean;
    className?: string;
    content: string | HTMLElement | Text;
    offset?: PointValue;
};
/**
 * Popup class
 */
export declare class Popup extends Overlay {
    #private;
    /**
     * Constructor
     *
     * @param {PopupOptions} [options] The Popup options
     */
    constructor(options: PopupOptions);
    /**
     * Get the autoHide value
     *
     * @returns {boolean}
     */
    get autoHide(): boolean;
    /**
     * Set the autoHide value
     *
     * @param {boolean} autoHide Whether to automatically hide other open InfoWindows when opening this one
     */
    set autoHide(autoHide: boolean);
    /**
     * Returns the content for the tooltip
     *
     * @returns {string|HTMLElement|Text}
     */
    get content(): string | HTMLElement | Text;
    /**
     * Set the content for the tooltip
     *
     * @param {string|HTMLElement} content The content for the tooltip
     */
    set content(content: string | HTMLElement);
    /**
     * Hide the popup
     *
     * Alias to hide()
     *
     * @returns {Popup}
     */
    close(): Popup;
    /**
     * Hide the popup
     *
     * @returns {Popup}
     */
    hide(): Popup;
    /**
     * Open the popup
     *
     * Alias to show()
     *
     * @param {Map | Marker} element The anchor object or map object.
     * @returns {Popup}
     */
    open(element: Map | Marker): Popup;
    /**
     * Sets the options for the popup
     *
     * @param {PopupOptions} options Popup options
     * @returns {Popup}
     */
    setOptions(options: PopupOptions): Popup;
    /**
     * Set the Popup content
     *
     * @param {string | HTMLElement | Text} content The Popup content
     * @returns {Popup}
     */
    setContent(content: string | HTMLElement | Text): Popup;
    /**
     * Open the popup
     *
     * You need to pass in either an anchor object or a map object.
     * If an anchor object is passed in then the popup will be displayed at the anchor's position.
     * If a map object is passed in then the popup will be displayed at the position of the popup.
     *
     * https://developers.google.com/maps/documentation/javascript/reference/info-window#Popup.open
     *
     * @param {Map | Marker} element The anchor object or map object.
     *      This should ideally be the Map or Marker object and not the Google maps object.
     *      If this is used internally then the Google maps object can be used.
     * @returns {Popup}
     */
    show(element: Map | Marker): Popup;
}
export type PopupValue = Popup | PopupOptions;
/**
 * Helper function to set up the Popup class
 *
 * @param {PopupValue} [options] The Popup options
 * @returns {Popup}
 */
export declare const popup: (options?: PopupValue) => Popup;
