/* ===========================================================================
    Helps to set up the built-in Google InfoWindow
=========================================================================== */

/* eslint-disable no-use-before-define */

import {
    checkForGoogleMaps,
    isNumber,
    isNumberString,
    isObject,
    isObjectWithValues,
    isString,
    isStringWithValue,
} from './helpers';
import Layer from './Layer';
import { Map } from './Map';
import { Marker } from './Marker';
import { size, SizeValue } from './Size';

export type InfoWindowOptions = {
    // The aria label for the info window
    ariaLabel?: string;
    // Whether to automatically close other open InfoWindows when opening this one
    autoClose?: boolean;
    // The content to display in the InfoWindow. This can be an HTML element, a plain-text string, or a string containing HTML.
    // The InfoWindow will be sized according to the content. To set an explicit size for the content, set content to be a HTML element with that size,
    // or use maxWidth.
    content?: string | Element | Text;
    // Disable panning the map to make the InfoWindow fully visible when it opens.
    disableAutoPan?: boolean;
    // Whether focus should be set on the info window when it is opened. Defaults to false.
    focus?: boolean;
    // Maximum width of the InfoWindow, regardless of content's width.
    maxWidth?: number;
    // Minimum width of the InfoWindow, regardless of the content's width.
    minWidth?: number;
    // The offset, in pixels, of the tip of the info window from the point on the map at whose geographical coordinates the info window is anchored.
    // If an InfoWindow is opened with an anchor, the pixelOffset will be calculated from the anchor's anchorPoint property.
    // Defaults to [0, -4]
    pixelOffset?: SizeValue;
    // Whether or not clicking the thing that triggered the info window to open should also close the info window.
    toggleDisplay?: boolean;
    // The zIndex of the InfoWindow.
    zIndex?: number;
};

/**
 * InfoWindow class
 */
export class InfoWindow extends Layer {
    /**
     * Whether to automatically close other open InfoWindows when opening this one
     *
     * @type {boolean}
     */
    private autoClose: boolean = true;

    /**
     * Whether focus should be moved to the InfoWindow when it is opened
     *
     * @type {boolean}
     */
    private focus: boolean = false;

    /**
     * Holds if the InfoWindow is open or not
     *
     * @type {boolean}
     */
    private isOpen: boolean = false;

    /**
     * Whether clicking the thing that triggered the info window to open should also close the info window
     *
     * @type {boolean}
     */
    private toggleDisplay: boolean = true;

    /**
     * Holds the Google maps InfoWindow object
     *
     * @type {google.maps.InfoWindow}
     */
    private infoWindow: google.maps.InfoWindow;

    /**
     * Constructor
     *
     * @param {InfoWindowOptions} [options] The InfoWindow options
     */
    constructor(options?: InfoWindowOptions) {
        super();
        // Make sure that the Google maps library is ready
        checkForGoogleMaps('InfoWindow', 'InfoWindow');

        // Create the InfoWindow object
        this.infoWindow = new google.maps.InfoWindow();
        // Handle when the close button is clicked
        this.infoWindow.addListener('closeclick', () => {
            InfoWindowCollection.getInstance().remove(this);
        });
        // Handle when the map changes.
        // This is used to handle when the InfoWindow is closed programatically by another
        // Google InfoWindow. This can happen if one of our windows is open and then the
        // user clicks on a map location ang Google shows their own info window.
        // Without doing this, we can't track that our window was closed.
        this.infoWindow.addListener('map_changed', () => {
            // The getMap() function technically works, but it's not part of the public API
            // so we don't use it. get('map') seems to work the same.
            if (this.infoWindow.get('map') === null) {
                this.isOpen = false;
                InfoWindowCollection.getInstance().remove(this);
            }
        });

        if (isObject(options)) {
            this.setOptions(options);
        }
    }

    /**
     * Set the InfoWindow options
     *
     * @param options The InfoWindow options
     */
    setOptions(options: InfoWindowOptions) {
        const iwOptions: google.maps.InfoWindowOptions = {
            pixelOffset: size(0, -4).get(),
        };
        if (isStringWithValue(options.ariaLabel)) {
            iwOptions.ariaLabel = options.ariaLabel;
        }
        if (options.content) {
            this.setContent(options.content);
        }
        if (typeof options.disableAutoPan === 'boolean') {
            iwOptions.disableAutoPan = options.disableAutoPan;
        }
        if (isNumber(options.maxWidth)) {
            iwOptions.maxWidth = options.maxWidth;
        } else if (isNumberString(options.maxWidth)) {
            iwOptions.maxWidth = Number(options.maxWidth);
        }
        if (isNumber(options.minWidth)) {
            iwOptions.minWidth = options.minWidth;
        } else if (isNumberString(options.minWidth)) {
            iwOptions.minWidth = Number(options.minWidth);
        }
        if (options.pixelOffset) {
            iwOptions.pixelOffset = size(options.pixelOffset).get();
        }
        if (options.zIndex) {
            this.setZIndex(options.zIndex);
        }

        this.infoWindow.setOptions(iwOptions);

        // Other options
        if (typeof options.autoClose === 'boolean') {
            this.autoClose = options.autoClose;
        }
        if (typeof options.focus === 'boolean') {
            this.focus = options.focus;
        }
        if (typeof options.toggleDisplay === 'boolean') {
            this.toggleDisplay = options.toggleDisplay;
        }
    }

    /**
     * Set the InfoWindow content
     * @param content The InfoWindow content
     */
    setContent(content: string | Element | Text) {
        if (isStringWithValue(content) || content instanceof Element || content instanceof Text) {
            this.infoWindow.setContent(content);
        }
    }

    /**
     * Sets the zIndex value for the InfoWindow
     * @link https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.setZIndex
     * @param {number|string} zIndex The zindex value
     */
    setZIndex(zIndex: number | string) {
        if (isNumber(zIndex)) {
            this.infoWindow.setZIndex(zIndex);
        } else if (isNumberString(zIndex)) {
            this.infoWindow.setZIndex(Number(zIndex));
        }
    }

    /**
     * Get the Google maps InfoWindow object
     *
     * @link https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow
     * @returns {google.maps.InfoWindow}
     */
    get(): google.maps.InfoWindow {
        return this.infoWindow;
    }

    /**
     * Open the info window
     *
     * You need to pass in either an anchor object or a map object.
     * If an anchor object is passed in then the info window will be displayed at the anchor's position.
     * If a map object is passed in then the info window will be displayed at the position of the info window.
     *
     * @link https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.open
     *
     * @param {Map | Marker} anchorOrMap The anchor object or map object.
     *      This should ideally be the Map or Marker object.
     */
    open(anchorOrMap: Map | Marker) {
        const collection = InfoWindowCollection.getInstance();
        if (collection.has(this) && this.isOpen) {
            if (this.toggleDisplay) {
                this.close();
            }
        } else {
            // Close other open InfoWindows if necessary
            if (this.autoClose) {
                collection.closeOthers(this);
            }

            if (anchorOrMap instanceof Map) {
                this.infoWindow.open({
                    map: anchorOrMap.get(),
                    shouldFocus: this.focus,
                });
                this.setMap(anchorOrMap);
            } else if (anchorOrMap instanceof Marker) {
                this.infoWindow.open({
                    anchor: anchorOrMap.get(),
                    shouldFocus: this.focus,
                });
                this.setMap(anchorOrMap.getMap());
            }
            this.isOpen = true;
            collection.add(this);
        }
    }

    /**
     * Close the info window
     */
    close() {
        this.infoWindow.close();
        this.isOpen = false;
        InfoWindowCollection.getInstance().remove(this);
    }
}

export type InfoWindowValue = InfoWindow | InfoWindowOptions;

/**
 * Helper function to set up the InfoWindow class
 *
 * @param {InfoWindowValue} [options] The InfoWindow options
 * @returns {InfoWindow}
 */
export const infoWindow = (options?: InfoWindowValue): InfoWindow => {
    if (options instanceof InfoWindow) {
        return options;
    }
    return new InfoWindow(options);
};

/**
 * To avoid circilar dependencies we need to add the bindInfoWindow method to the Layer class here
 */
Layer.include({
    /**
     * Holds the InfoWindow object
     * @type {InfoWindow}
     */
    layerInfoWindow: null,
    /**
     *
     * @param {string | Element | Text | InfoWindowValue} content The content for the InfoWindow, or the InfoWindow options object, or the InfoWindow object
     * @param {InfoWindowOptions} [options] The InfoWindow options object
     */
    bindInfoWindow(content: string | Element | Text | InfoWindowValue, options?: InfoWindowOptions) {
        if (content instanceof InfoWindow) {
            this.layerInfoWindow = content;
        } else if (isString(content) || content instanceof Element || content instanceof Text) {
            this.layerInfoWindow = infoWindow();
            this.layerInfoWindow.setContent(content);
        } else if (isObjectWithValues(content)) {
            this.layerInfoWindow = infoWindow(content);
        }
        if (isObjectWithValues(options)) {
            this.layerInfoWindow.setOptions(options);
        }
        this.on('click', () => {
            if (this.layerInfoWindow) {
                this.layerInfoWindow.open(this);
            }
        });
    },
});

type InfoWindowCollectionObject = {
    infoWindows: InfoWindow[];
    add(iw: InfoWindow): void;
    clear(): void;
    closeAll(): void;
    closeOthers(iw: InfoWindow): void;
    has(iw: InfoWindow): boolean;
    remove(iw: InfoWindow): void;
};

/**
 * Singleton class to hold the open InfoWindows.
 * Usage:
 * const collection = InfoWindowCollection.getInstance();
 * collection.add(infoWindow);
 * collection.closeAll();
 */
const InfoWindowCollection = (() => {
    /**
     * The singleton instance of the object
     */
    let instance: InfoWindowCollectionObject;

    /**
     * Create the object instance
     * @private
     * @returns {InfoWindowCollectionObject}
     */
    function createInstance(): InfoWindowCollectionObject {
        return {
            /**
             * Holds the InfoWindow objects
             */
            infoWindows: [],
            /**
             * Adds an InfoWindow to the collection
             * @param iw The InfoWindow object to add
             */
            add(iw: InfoWindow) {
                this.infoWindows.push(iw);
            },
            /**
             * Clears the collection
             */
            clear() {
                this.infoWindows = [];
            },
            /**
             * Closes all the InfoWindows in the collection
             */
            closeAll() {
                this.infoWindows.forEach((iw: InfoWindow) => {
                    iw.close();
                });
            },
            /**
             * Close all the InfoWindows in the collection except for the one passed in
             *
             * @param {InfoWindow} iw The InfoWindow object to keep open
             */
            closeOthers(iw: InfoWindow) {
                this.infoWindows.forEach((infoW: InfoWindow) => {
                    if (infoW !== iw) {
                        infoW.close();
                    }
                });
            },
            /**
             * Returns whether the collection has the InfoWindow object
             *
             * @param {InfoWindow} iw The InfoWindow object to check for
             * @returns {boolean}
             */
            has(iw: InfoWindow): boolean {
                return this.infoWindows.indexOf(iw) > -1;
            },
            /**
             * Removes an InfoWindow from the collection
             * @param iw The InfoWindow object to remove
             */
            remove(iw: InfoWindow) {
                const index = this.infoWindows.indexOf(iw);
                if (index > -1) {
                    this.infoWindows.splice(index, 1);
                }
            },
        };
    }

    return {
        /**
         * Get the singleton instance of the object
         * @returns {InfoWindowCollectionObject}
         */
        getInstance(): InfoWindowCollectionObject {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        },
    };
})();
