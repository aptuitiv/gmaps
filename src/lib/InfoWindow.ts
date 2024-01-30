/* ===========================================================================
    Helps to set up the built-in Google InfoWindow
=========================================================================== */

import { isNumber, isNumberString, isObject, isObjectWithValues, isString, isStringWithValue } from './helpers';
import Layer from './Layer';
import { Map } from './Map';
import { Marker } from './Marker';
import { size, SizeValue } from './Size';

export type InfoWindowOptions = {
    ariaLabel?: string;
    content?: string | Element | Text;
    disableAutoPan?: boolean;
    focus?: boolean;
    maxWidth?: number;
    minWidth?: number;
    pixelOffset?: SizeValue;
    zIndex?: number;
};

/**
 * InfoWindow class
 */
export class InfoWindow extends Layer {
    /**
     * Whether focus should be moved to the InfoWindow when it is opened
     *
     * @type {boolean}
     */
    private focus: boolean = false;

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
        this.infoWindow = new google.maps.InfoWindow();
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
        const iwOptions: google.maps.InfoWindowOptions = {};
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
        if (typeof options.focus === 'boolean') {
            this.focus = options.focus;
        }
        if (options.zIndex) {
            this.setZIndex(options.zIndex);
        }

        this.infoWindow.setOptions(iwOptions);
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
     * @param {Map | Marker | google.maps.MVCObject | google.maps.marker.AdvancedMarkerElement | google.maps.MaP} anchorOrMap The anchor object or map object.
     *      This should ideally be the Map or Marker object and not the Google maps object.
     *      If this is used internally then the Google maps object can be used.
     */
    open(
        anchorOrMap: Map | Marker | google.maps.MVCObject | google.maps.marker.AdvancedMarkerElement | google.maps.Map
    ) {
        if (anchorOrMap instanceof Map) {
            this.infoWindow.open({
                map: anchorOrMap.get(),
                shouldFocus: this.focus,
            });
        } else if (anchorOrMap instanceof google.maps.Map) {
            this.infoWindow.open({
                map: anchorOrMap,
                shouldFocus: this.focus,
            });
        } else if (anchorOrMap instanceof Marker) {
            this.infoWindow.open({
                anchor: anchorOrMap.get(),
                shouldFocus: this.focus,
            });
        } else {
            this.infoWindow.open({
                anchor: anchorOrMap,
                shouldFocus: this.focus,
            });
        }
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
 * To avoid circilar dependencies we need to add the bindInfoWindow method to the Marker class here
 */
Marker.include({
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
                this.layerInfoWindow.open(this.get());
            }
        });
    },
});
