/* ===========================================================================
    Helps to set up the built-in Google InfoWindow

    See https://aptuitiv.github.io/gmaps-docs/api-reference/infowindow for documentation.
=========================================================================== */

/* global google, HTMLElement, Text */
/* eslint-disable no-use-before-define */

import { checkForGoogleMaps, isNumber, isNumberString, isObject, isStringWithValue } from './helpers';
import { EventCallback, EventConfig, EventListenerOptions } from './Evented';
import { latLng, LatLng, LatLngValue } from './LatLng';
import Layer from './Layer';
import { Map } from './Map';
import { Marker } from './Marker';
import { size, Size, SizeValue } from './Size';

type GMInfoWindowOptions = {
    // The aria label for the info window
    ariaLabel?: string;
    // The content to display in the InfoWindow. This can be an HTML element, a plain-text string, or a string containing HTML.
    // The InfoWindow will be sized according to the content. To set an explicit size for the content, set content to be a HTML element with that size,
    // or use maxWidth.
    content?: string | HTMLElement | Text;
    // Disable panning the map to make the InfoWindow fully visible when it opens.
    disableAutoPan?: boolean;
    // The event to trigger the InfoWindow. Defaults to 'click'
    // Allowed values are: 'click',  'clickon', and 'hover'
    event?: string;
    // Maximum width of the InfoWindow, regardless of content's width.
    maxWidth?: number;
    // Minimum width of the InfoWindow, regardless of the content's width.
    minWidth?: number;
    // The offset, in pixels, of the tip of the info window from the point on the map at whose geographical coordinates the info window is anchored.
    // If an InfoWindow is opened with an anchor, the pixelOffset will be calculated from the anchor's anchorPoint property.
    // Defaults to [0, -4]
    pixelOffset?: Size;
    // The position for the InfoWindow.
    position?: LatLng;
    // The zIndex of the InfoWindow.
    zIndex?: number;
};

export type InfoWindowOptions = GMInfoWindowOptions & {
    // Whether to automatically close other open InfoWindows when opening this one
    autoClose?: boolean;
    // Whether focus should be set on the info window when it is opened. Defaults to false.
    focus?: boolean;
    // The offset, in pixels, of the tip of the info window from the point on the map at whose geographical coordinates the info window is anchored.
    // If an InfoWindow is opened with an anchor, the pixelOffset will be calculated from the anchor's anchorPoint property.
    // Defaults to [0, -4]
    pixelOffset?: SizeValue;
    // The position for the InfoWindow.
    // You don't need to do this if you're attaching the InfoWindow to a Marker object.
    position?: LatLngValue;
    // Whether or not clicking the thing that triggered the info window to open should also close the info window.
    toggleDisplay?: boolean;
};

// Google Maps library infowindow events
type InfoWindowEvent =
    | 'close'
    | 'closeclick'
    | 'content_changed'
    | 'domready'
    | 'position_changed'
    | 'visible'
    | 'zindex_changed';

/**
 * InfoWindow class
 */
export class InfoWindow extends Layer {
    /**
     * Whether to automatically close other open InfoWindows when opening this one
     *
     * @private
     * @type {boolean}
     */
    #autoClose: boolean = true;

    /**
     * The event to trigger the popup
     *
     * @private
     * @type {'click' | 'clickon' | 'hover'}
     */
    #event: string = 'click';

    /**
     * Whether focus should be moved to the InfoWindow when it is opened
     *
     * @private
     * @type {boolean}
     */
    #focus: boolean = false;

    /**
     * Whether the InfoWindow is attached to an element
     *
     * @private
     * @type {boolean}
     */
    #isAttached: boolean = false;

    /**
     * Holds if the InfoWindow is open or not
     *
     * @private
     * @type {boolean}
     */
    #isOpen: boolean = false;

    /**
     * Holds the InfoWindow options
     *
     * @private
     * @type {InfoWindowOptions}
     */
    #options: InfoWindowOptions = {};

    /**
     * Whether clicking the thing that triggered the info window to open should also close the info window
     *
     * @private
     * @type {boolean}
     */
    #toggleDisplay: boolean = true;

    /**
     * Holds the Google maps InfoWindow object
     *
     * @private
     * @type {google.maps.InfoWindow}
     */
    #infoWindow: google.maps.InfoWindow;

    /**
     * Constructor
     *
     * @param {InfoWindowOptions | string | HTMLElement | Text} [options] The InfoWindow options
     */
    constructor(options?: InfoWindowOptions | string | HTMLElement | Text) {
        super('infowindow', 'InfoWindow');

        // Set the default pixel offset so that the info window is positioned a little off the element that opened it.
        this.#options.pixelOffset = size(0, -4);

        if (isObject(options)) {
            if (options instanceof HTMLElement || options instanceof Text) {
                // The popup contents were passed
                this.content = options;
            } else {
                this.setOptions(options);
            }
        } else {
            // The popup contents were passed
            this.content = options;
        }
    }

    /**
     * Get the aria label for the InfoWindow
     *
     * @returns {string}
     */
    get ariaLabel(): string {
        return this.#options.ariaLabel;
    }

    /**
     * Set the aria label for the InfoWindow
     *
     * @param {string|number} ariaLabel The aria label for the InfoWindow
     */
    set ariaLabel(ariaLabel: string | number) {
        if (isStringWithValue(ariaLabel) || isNumber(ariaLabel)) {
            this.#options.ariaLabel = ariaLabel.toString();
            this.#setupGoogleInfoWindow();
            if (this.#infoWindow) {
                this.#infoWindow.setOptions({ ariaLabel: this.#options.ariaLabel });
            }
        }
    }

    /**
     * Get the content for the InfoWindow
     *
     * @returns {string|HTMLElement|Text}
     */
    get content(): string | HTMLElement | Text {
        return this.#options.content;
    }

    /**
     * Set the content for the InfoWindow
     *
     * @param {string|HTMLElement|Text} content The content for the InfoWindow
     */
    set content(content: string | HTMLElement | Text) {
        if (isStringWithValue(content) || content instanceof HTMLElement || content instanceof Text) {
            this.#options.content = content;
            this.#setupGoogleInfoWindow();
            if (this.#infoWindow) {
                this.#infoWindow.setContent(content);
            }
        }
    }

    /**
     * Get the disableAutoPan option for the InfoWindow
     *
     * @returns {boolean}
     */
    get disableAutoPan(): boolean {
        return typeof this.#options.disableAutoPan === 'boolean' && this.#options.disableAutoPan === true;
    }

    /**
     * Set the disableAutoPan option for the InfoWindow
     *
     * @param {boolean} disableAutoPan The disableAutoPan option for the InfoWindow
     */
    set disableAutoPan(disableAutoPan: boolean) {
        if (typeof disableAutoPan !== 'boolean') {
            this.#options.disableAutoPan = disableAutoPan;
            this.#setupGoogleInfoWindow();
            if (this.#infoWindow) {
                this.#infoWindow.setOptions({ disableAutoPan: this.#options.disableAutoPan });
            }
        }
    }

    /**
     * Returns the event to trigger the popup
     *
     * @returns {string}
     */
    get event(): string {
        return this.#event;
    }

    /**
     * Set the event to trigger the popup
     *
     * @param {string} event The event to trigger the popup
     */
    set event(event: string) {
        if (isStringWithValue(event) && ['click', 'clickon', 'hover'].includes(event.toLowerCase())) {
            this.#event = event.toLowerCase();
        } else {
            throw new Error('Invalid event value. Allowed values are: "click", "clickon", and "hover"');
        }
    }

    /**
     * Get the maxWidth option for the InfoWindow
     *
     * @returns {number}
     */
    get maxWidth(): number {
        return this.#options.maxWidth;
    }

    /**
     * Set the maxWidth option for the InfoWindow
     *
     * @param {number|string} maxWidth The maxWidth option for the InfoWindow
     */
    set maxWidth(maxWidth: number | string) {
        if (isNumber(maxWidth) || isNumberString(maxWidth)) {
            let width = maxWidth;
            if (isNumberString(width)) {
                width = Number(width);
            }
            this.#options.maxWidth = width;
            this.#setupGoogleInfoWindow();
            if (this.#infoWindow) {
                this.#infoWindow.setOptions({ maxWidth: this.#options.maxWidth });
            }
        }
    }

    /**
     * Get the minWidth option for the InfoWindow
     *
     * @returns {number}
     */
    get minWidth(): number {
        return this.#options.minWidth;
    }

    /**
     * Set the minWidth option for the InfoWindow
     *
     * @param {number|string} minWidth The minWidth option for the InfoWindow
     */
    set minWidth(minWidth: number | string) {
        if (isNumber(minWidth) || isNumberString(minWidth)) {
            let width = minWidth;
            if (isNumberString(width)) {
                width = Number(width);
            }
            this.#options.minWidth = width;
            this.#setupGoogleInfoWindow();
            if (this.#infoWindow) {
                this.#infoWindow.setOptions({ minWidth: this.#options.minWidth });
            }
        }
    }

    /**
     * Get the pixelOffset option for the InfoWindow
     *
     * @returns {Size}
     */
    get pixelOffset(): Size {
        return this.#options.pixelOffset;
    }

    /**
     * Set the pixelOffset option for the InfoWindow
     *
     * @param {SizeValue} pixelOffset The pixelOffset option for the InfoWindow
     */
    set pixelOffset(pixelOffset: SizeValue) {
        const sizeValue = size(pixelOffset);
        if (sizeValue.isValid()) {
            this.#setupGoogleInfoWindow();
            this.#options.pixelOffset = sizeValue;
            if (this.#infoWindow) {
                this.#infoWindow.setOptions({ pixelOffset: this.#options.pixelOffset.toGoogle() });
            }
        }
    }

    /**
     * Get the position option for the InfoWindow
     *
     * @returns {LatLng}
     */
    get position(): LatLng {
        return this.#options.position;
    }

    /**
     * Set the position option for the InfoWindow
     *
     * @param {LatLngValue} position The position option for the InfoWindow
     */
    set position(position: LatLngValue) {
        const latLngValue = latLng(position);
        if (latLngValue.isValid()) {
            this.#setupGoogleInfoWindow();
            this.#options.position = latLngValue;
            if (this.#infoWindow) {
                this.#infoWindow.setPosition(this.#options.position.toGoogle());
            }
        }
    }

    /**
     * Get the zIndex option for the InfoWindow
     *
     * @returns {number}
     */
    get zIndex(): number {
        return this.#options.zIndex;
    }

    /**
     * Set the zIndex option for the InfoWindow
     *
     * @param {number|string} zIndex The zIndex option for the InfoWindow
     */
    set zIndex(zIndex: number | string) {
        if (isNumber(zIndex) || isNumberString(zIndex)) {
            let zIndexValue = zIndex;
            if (isNumberString(zIndexValue)) {
                zIndexValue = Number(zIndexValue);
            }
            this.#options.zIndex = zIndexValue;
            this.#setupGoogleInfoWindow();
            if (this.#infoWindow) {
                this.#infoWindow.setOptions({ zIndex: this.#options.zIndex });
            }
        }
    }

    /**
     * Attach the InfoWindow to a element
     *
     * By default the InfoWindow will be shown when the element is clicked on.
     *
     * @param {Map | Layer} element The element to attach the InfoWindow to
     * @param {'click'|'clickon'|'hover'} [event] The event to trigger the InfoWindow. Defaults to 'click'
     *   - 'click' - Toggle the display of the InfoWindow when clicking on the element
     *   - 'clickon' - Show the InfoWindow when clicking on the element. It will always be shown and can't be hidden once the element is clicked.
     *   - 'hover' - Show the InfoWindow when hovering over the element. Hide the InfoWindow when the element is no longer hovered.
     * @returns {Promise<InfoWindow>}
     */
    async attachTo(element: Map | Layer, event?: 'click' | 'clickon' | 'hover'): Promise<InfoWindow> {
        if (!this.#isAttached) {
            this.#isAttached = true;
            await element.init().then(() => {
                const triggerEvent = event || this.#event;

                if (triggerEvent === 'clickon' || triggerEvent === 'hover') {
                    // Don't toggle the display of the InfoWindow for the clickon and hover events.
                    // If it's toggled for hover then it'll appear like it's flickering.
                    // If it's toggled with clickon then it will behave like "click" and hide on the second click.
                    this.#toggleDisplay = false;
                }

                // Show the InfoWindow when hovering over the element
                if (triggerEvent === 'hover') {
                    element.on('mouseover', (e) => {
                        this.position = e.latLng;
                        this.show(element);
                    });
                    if (element instanceof Map) {
                        element.on('mousemove', (e) => {
                            this.position = e.latLng;
                            this.show(element);
                        });
                    }
                    element.on('mouseout', () => {
                        this.hide();
                    });
                } else if (triggerEvent === 'clickon') {
                    // Show the InfoWindow when clicking on the element
                    element.on('click', (e) => {
                        if (element instanceof Map) {
                            this.position = e.latLng;
                        }
                        this.show(element);
                    });
                } else {
                    // Show the InfoWindow when clicking on the element
                    element.on('click', (e) => {
                        if (element instanceof Map) {
                            this.position = e.latLng;
                        }
                        this.show(element);
                    });
                }
            });
        }

        return this;
    }

    /**
     * Hide the info window
     *
     * Alias to hide()
     *
     * @returns {InfoWindow}
     */
    close(): InfoWindow {
        return this.hide();
    }

    /**
     * Returns whether the InfoWindow already has content
     *
     * @returns {boolean}
     */
    hasContent(): boolean {
        return (
            typeof this.#options.content !== 'undefined' &&
            (isStringWithValue(this.#options.content) ||
                this.#options.content instanceof HTMLElement ||
                this.#options.content instanceof Text)
        );
    }

    /**
     * Hide the info window
     *
     * @returns {InfoWindow}
     */
    hide(): InfoWindow {
        if (this.#infoWindow) {
            this.#infoWindow.close();
        }
        this.#isOpen = false;
        InfoWindowCollection.getInstance().remove(this);
        return this;
    }

    /**
     * Returns whether the InfoWindow is open or not
     *
     * @returns {boolean}
     */
    isOpen(): boolean {
        return this.#isOpen;
    }

    /**
     * @inheritdoc
     */
    hasListener(type: InfoWindowEvent, callback?: EventCallback): boolean {
        return super.hasListener(type, callback);
    }

    /**
     * @inheritdoc
     */
    off(type?: InfoWindowEvent, callback?: EventCallback, options?: EventListenerOptions): void {
        super.off(type, callback, options);
    }

    /**
     * @inheritdoc
     */
    on(type: InfoWindowEvent, callback: EventCallback, config?: EventConfig): void {
        super.on(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    onImmediate(type: InfoWindowEvent, callback: EventCallback, config?: EventConfig): void {
        super.onImmediate(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    once(type: InfoWindowEvent, callback?: EventCallback, config?: EventConfig): void {
        super.once(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    onceImmediate(type: InfoWindowEvent, callback?: EventCallback, config?: EventConfig): void {
        super.onceImmediate(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    only(type: InfoWindowEvent, callback: EventCallback, config?: EventConfig): void {
        super.only(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    onlyOnce(type: InfoWindowEvent, callback: EventCallback, config?: EventConfig): void {
        super.onlyOnce(type, callback, config);
    }

    /**
     * Show the info window
     *
     * Alias to show()
     *
     * @param {Map | Layer} element The anchor object or map object.
     * @returns {Promise<InfoWindow>}
     */
    open(element: Map | Layer): Promise<InfoWindow> {
        return this.show(element);
    }

    /**
     * Set the InfoWindow options
     *
     * @param {InfoWindowOptions} options The InfoWindow options
     * @returns {InfoWindow}
     */
    setOptions(options: InfoWindowOptions): InfoWindow {
        // InfoWindow options
        if (options.ariaLabel) {
            this.ariaLabel = options.ariaLabel;
        }
        if (options.content) {
            this.content = options.content;
        }
        if (options.disableAutoPan) {
            this.disableAutoPan = options.disableAutoPan;
        }
        if (options.event) {
            this.event = options.event;
        }
        if (options.maxWidth) {
            this.maxWidth = options.maxWidth;
        }
        if (options.minWidth) {
            this.minWidth = options.minWidth;
        }
        if (options.pixelOffset) {
            this.pixelOffset = options.pixelOffset;
        }
        if (options.position) {
            this.position = options.position;
        }
        if (options.zIndex) {
            this.zIndex = options.zIndex;
        }

        // Other options
        if (typeof options.autoClose === 'boolean') {
            this.#autoClose = options.autoClose;
        }
        if (typeof options.focus === 'boolean') {
            this.#focus = options.focus;
        }
        if (typeof options.toggleDisplay === 'boolean') {
            this.#toggleDisplay = options.toggleDisplay;
        }
        return this;
    }

    /**
     * Set the InfoWindow content
     *
     * @param {string | HTMLElement | Text} content The InfoWindow content
     * @returns {InfoWindow}
     */
    setContent(content: string | HTMLElement | Text): InfoWindow {
        this.content = content;
        return this;
    }

    /**
     * Set the InfoWindow position
     *
     * @param {LatLngValue} position The position for the InfoWindow
     * @returns {InfoWindow}
     */
    setPosition(position: LatLngValue): InfoWindow {
        this.position = position;
        return this;
    }

    /**
     * Sets the zIndex value for the InfoWindow
     *
     * https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.setZIndex
     *
     * @param {number|string} zIndex The zindex value
     * @returns {InfoWindow}
     */
    setZIndex(zIndex: number | string): InfoWindow {
        this.zIndex = zIndex;
        return this;
    }

    /**
     * Show the info window
     *
     * You need to pass in either an anchor object or a map object.
     * If an anchor object is passed in then the info window will be displayed at the anchor's position.
     * If a map object is passed in then the info window will be displayed at the position of the info window.
     *
     * https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow.open
     *
     * @param {Map | Layer} element The anchor object or map object.
     *      This should ideally be the Map or Marker object.
     * @returns {Promise<InfoWindow>}
     */
    show(element: Map | Layer): Promise<InfoWindow> {
        return new Promise((resolve) => {
            this.#setupGoogleInfoWindow();
            const collection = InfoWindowCollection.getInstance();
            if (collection.has(this) && this.#isOpen) {
                if (this.#toggleDisplay) {
                    this.hide();
                }
                resolve(this);
            } else {
                // Close other open InfoWindows if necessary
                if (this.#autoClose) {
                    collection.hideOthers(this);
                }

                this.#isOpen = true;
                collection.add(this);

                if (element instanceof Map) {
                    this.#infoWindow.open({
                        map: element.toGoogle(),
                        shouldFocus: this.#focus,
                    });
                    this.setMap(element);
                    resolve(this);
                } else if (element instanceof Marker) {
                    element.toGoogle().then((marker) => {
                        this.#infoWindow.open({
                            anchor: marker,
                            shouldFocus: this.#focus,
                        });
                        this.setMap(element.getMap());
                        resolve(this);
                    });
                }
            }
        });
    }

    /**
     * Toggle the display of the overlay on the map
     *
     * @param {Map | Layer} element The anchor object or map object.
     * @returns {void}
     */
    toggle(element: Map | Layer): void {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show(element);
        }
    }

    /**
     * Get the Google maps InfoWindow object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/info-window#InfoWindow
     *
     * @returns {google.maps.InfoWindow}
     */
    toGoogle(): google.maps.InfoWindow {
        this.#setupGoogleInfoWindow();
        return this.#infoWindow;
    }

    /**
     * Set up the Google maps InfoWindow object if necessary
     *
     * @private
     */
    #setupGoogleInfoWindow() {
        if (!isObject(this.#infoWindow)) {
            if (checkForGoogleMaps('InfoWindow', 'InfoWindow', false)) {
                const infoWindowOptions: google.maps.InfoWindowOptions = {};
                // Options that can be set on the InfoWindow without any modification
                const optionsToSet = ['ariaLabel', 'content', 'disableAutoPan', 'maxWidth', 'minWidth', 'zIndex'];
                optionsToSet.forEach((key) => {
                    if (typeof this.#options[key] !== 'undefined') {
                        infoWindowOptions[key] = this.#options[key];
                    }
                });

                // Options that have to be converted to Google maps objects
                if (this.#options.pixelOffset) {
                    infoWindowOptions.pixelOffset = this.#options.pixelOffset.toGoogle();
                }
                if (this.#options.position) {
                    infoWindowOptions.position = this.#options.position.toGoogle();
                }

                this.#infoWindow = new google.maps.InfoWindow(infoWindowOptions);

                // Handle when the close button is clicked
                this.#infoWindow.addListener('closeclick', () => {
                    InfoWindowCollection.getInstance().remove(this);
                });
                // Handle when the map changes.
                // This is used to handle when the InfoWindow is closed programatically by another
                // Google InfoWindow. This can happen if one of our windows is open and then the
                // user clicks on a map location ang Google shows their own info window.
                // Without doing this, we can't track that our window was closed.
                this.#infoWindow.addListener('map_changed', () => {
                    // The getMap() function technically works, but it's not part of the public API
                    // so we don't use it. get('map') seems to work the same.
                    if (this.#infoWindow.get('map') === null) {
                        this.#isOpen = false;
                        InfoWindowCollection.getInstance().remove(this);
                    }
                });
            }
        }
    }
}

export type InfoWindowValue = InfoWindow | InfoWindowOptions | string | HTMLElement | Text;

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

const infoWindowMixin = {
    /**
     * Holds the InfoWindow object
     *
     * @type {InfoWindow}
     */
    layerInfoWindow: null,

    /**
     * Attach an InfoWindow to the layer
     *
     * @param {InfoWindowValue} infoWindowValue The content for the InfoWindow, or the InfoWindow options object, or the InfoWindow object
     * @param {'click' | 'clickon' | 'hover'} [event] The event to trigger the popup. Defaults to 'hover'. See Popup.attachTo() for more information.
     */
    attachInfoWindow(infoWindowValue: InfoWindowValue, event?: 'click' | 'clickon' | 'hover') {
        infoWindow(infoWindowValue).attachTo(this, event);
    },
};
/**
 * To avoid circular dependencies we need to add the attachInfoWindow method to the Layer and Map classes here
 */
Layer.include(infoWindowMixin);
Map.include(infoWindowMixin);

type InfoWindowCollectionObject = {
    infoWindows: InfoWindow[];
    add(iw: InfoWindow): void;
    clear(): void;
    hideAll(): void;
    hideOthers(iw: InfoWindow): void;
    has(iw: InfoWindow): boolean;
    remove(iw: InfoWindow): void;
};

/**
 * Singleton class to hold the open InfoWindows.
 * Usage:
 * const collection = InfoWindowCollection.getInstance();
 * collection.add(infoWindow);
 * collection.hideAll();
 */
const InfoWindowCollection = (() => {
    /**
     * The singleton instance of the object
     */
    let instance: InfoWindowCollectionObject;

    /**
     * Create the object instance
     *
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
             *
             * @param {InfoWindow} iw The InfoWindow object to add
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
            hideAll() {
                this.infoWindows.forEach((iw: InfoWindow) => {
                    iw.hide();
                });
            },
            /**
             * Close all the InfoWindows in the collection except for the one passed in
             *
             * @param {InfoWindow} iw The InfoWindow object to keep open
             */
            hideOthers(iw: InfoWindow) {
                this.infoWindows.forEach((infoW: InfoWindow) => {
                    if (infoW !== iw) {
                        infoW.hide();
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
             *
             * @param {InfoWindow} iw The InfoWindow object to remove
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
         *
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
