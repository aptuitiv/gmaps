/* ===========================================================================
    Display a custom popup on the map

    See https://aptuitiv.github.io/gmaps-docs/api-reference/popup for documentation.
=========================================================================== */

/* global google, HTMLElement, Text */
/* eslint-disable no-use-before-define -- Done because the PopupCollection is referenced before it's created */

import { READY_EVENT } from './constants';
import { DataFeature } from './DataFeature';
import { DataLayer, DataLayerEventObject } from './DataLayer';
import Layer from './Layer';
import { LatLng } from './LatLng';
import { Map } from './Map';
import { Marker } from './Marker';
import { Overlay } from './Overlay';
import { point, Point, PointValue } from './Point';
import { Polyline } from './Polyline';
import { Size, size, SizeValue } from './Size';
import { isFunction, isNullOrUndefined, isObject, isString, isStringWithValue } from './helpers';

export type PopupOptions = {
    // Whether to automatically hide other open popups when opening this one
    autoClose?: boolean;
    // Whether to center the popup horizontally on the element. Useful if the popup is on a marker. Defaults to true.
    center?: boolean;
    // The popup wrapper class name
    className?: string;
    // The amount of space between teh popup and the map viewport edge. This is used when the map is panned to bring the popup into view.
    // Defaults to 0, 0.
    clearance?: SizeValue;
    // The element to close the popup. This can be a CSS selector or an HTMLElement.
    closeElement?: HTMLElement | string;
    // The popup content
    content: string | HTMLElement | Text;
    // The event to trigger the popup. Defaults to 'click'
    // Allowed values are: 'click',  'clickon', and 'hover'
    event?: string;
    // Whether to fit the popup within the map viewport when it's displayed. Defaults to true.
    fit?: boolean;
    // The amount to offset the popup from the element it is displayed at.
    // If the element is a marker, then this is added to the marker's anchorPoint value.
    // For example, if the marker is 40px tall and no anchorPoint value was set for the marker, then
    // by default the popup will be displayed at the top of the marker. If you set the offset to be
    // 0, -20 then the popup will be displayed 20px above the top of the marker.
    // If the element is a marker and this is not set, then the marker's anchorPoint value is used.
    offset?: PointValue;
    // Styles that will be set on the popup container div.
    styles?: object;
    // A build-in theme to assign to the popup. By default the popup has no styling. Set to 'default' to use the basic default theme.
    // 'default' | 'none'
    theme?: string;
};

/**
 * Popup class
 */
export class Popup extends Overlay {
    /**
     * Whether to automatically close other open popups when opening this one
     *
     * @private
     * @type {boolean}
     */
    #autoClose: boolean = true;

    /**
     * Whether to center the popup on the element. Useful if the popup is on a marker.
     *
     * @private
     * @type {boolean}
     */
    #center: boolean = true;

    /**
     * The amount of space between the popup and the map viewport edge
     *
     * This is used when the map is panned to bring the popup into view.
     *
     * @private
     * @type {Size}
     */
    #clearance: Size;

    /**
     * The element to close the popup. This can be a CSS selector or an HTMLElement.
     *
     * @private
     * @type {HTMLElement|string}
     */
    #closeElement: HTMLElement | string;

    /**
     * Holds the popup content.
     * This can be a simple string of text, string of HTML code, or an HTMLElement.
     *
     * @private
     * @type {string|HTMLElement}
     */
    #content: string | HTMLElement | Text;

    /**
     * The event to trigger the popup
     *
     * @private
     * @type {'click' | 'clickon' | 'hover'}
     */
    #event: string = 'click';

    /**
     * Whether the popup has been drawn on the map for the first time
     *
     * The popup overlay is redrawn anytime the map is moved or zoomed. This is used to determine if the popup
     * has been drawn on the map for the first time. This is used to determine if the popup should be fit within
     * the map viewport when it's displayed.
     *
     * @private
     * @type {boolean}
     */
    #firstDraw: boolean = false;

    /**
     * Whether to fit the popup within the map viewport when it's displayed
     *
     * @private
     * @type {boolean}
     */
    #fit: boolean = true;

    /**
     * Holds the popup that this one last showed for the object it's attached to.
     *
     * This is only used when a callback function returns a different Popup object for each
     * thing that the popup is shown for, so that the previous one can be hidden.
     *
     * @private
     * @type {Popup}
     */
    #activePopup: Popup;

    /**
     * Holds the callback function that works out what to show, if one was given.
     *
     * @private
     * @type {PopupCallback}
     */
    #callback: PopupCallback;

    /**
     * Whether the popup is attached to an element
     *
     * @private
     * @type {boolean}
     */
    #isAttached: boolean = false;

    /**
     * Holds if the Popup is open or not
     *
     * @private
     * @type {boolean}
     */
    #isOpen: boolean = false;

    /**
     * The total offset from the element that includes the anchor point of the element (if it exists) and the overlay offset.
     * Markers have an anchor point, but polygons and polylines do not.
     *
     * @private
     * @type {Point}
     */
    #popupOffset: Point;

    /**
     * The theme to use for the popup.
     *
     * @private
     * @type {string}
     */
    #theme: string = 'none';

    /**
     * Whether clicking the thing that triggered the popup to show should also hide the popup
     *
     * @private
     * @type {boolean}
     */
    #toggleDisplay: boolean = true;

    /**
     * Constructor
     *
     * @param {PopupOptions | string | HTMLElement | Text} [options] The Popup options or content
     */
    constructor(options: PopupOptions | string | HTMLElement | Text) {
        super('popup', 'Popup');

        this.#clearance = size(0, 0);
        this.#popupOffset = point(0, 0);

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
     * Get the autoClose value
     *
     * @returns {boolean}
     */
    get autoClose(): boolean {
        return this.#autoClose;
    }

    /**
     * Set the autoClose value
     *
     * @param {boolean} autoClose Whether to automatically hide other open popups when opening this one
     */
    set autoClose(autoClose: boolean) {
        if (typeof autoClose === 'boolean') {
            this.#autoClose = autoClose;
        }
    }

    /**
     * Returns whether to center the popup horizontally on the element.
     *
     * @returns {boolean}
     */
    get center(): boolean {
        return this.#center;
    }

    /**
     * Set whether to center the popup horizontally on the element. Useful if the popup is on a marker.
     *
     * @param {boolean} center Whether to center the popup on the element
     */
    set center(center: boolean) {
        if (typeof center === 'boolean') {
            this.#center = center;
        }
    }

    /**
     * Returns the amount of space between the popup and the map viewport edge.
     * This is used when the map is panned to bring the popup into view.
     *
     * @returns {Size}
     */
    get clearance(): Size {
        return this.#clearance;
    }

    /**
     * Set the amount of space between the popup and the map viewport edge
     * This is used when the map is panned to bring the popup into view.
     *
     * @param {SizeValue} clearance The amount of space between the popup and the map viewport edge
     */
    set clearance(clearance: SizeValue) {
        this.#clearance = size(clearance);
    }

    /**
     * Returns the element to close the popup. This can be a CSS selector or an HTMLElement.
     *
     * @returns {HTMLElement|string}
     */
    get closeElement(): HTMLElement | string {
        return this.#closeElement;
    }

    /**
     * Set the element to close the popup. This can be a CSS selector or an HTMLElement.
     *
     * @param {HTMLElement|string} closeElement The element to close the popup
     */
    set closeElement(closeElement: HTMLElement | string) {
        if (typeof closeElement === 'string' || closeElement instanceof HTMLElement) {
            this.#closeElement = closeElement;
        }
    }

    /**
     * Returns the content for the popup
     *
     * @returns {string|HTMLElement|Text}
     */
    get content(): string | HTMLElement | Text {
        return this.#content;
    }

    /**
     * Set the content for the popup
     *
     * @param {string|HTMLElement|Text} content The content for the popup
     */
    set content(content: string | HTMLElement | Text) {
        if (isStringWithValue(content)) {
            this.#content = content;
            this.getOverlayElement().innerHTML = content;
        } else if (content instanceof HTMLElement || content instanceof Text) {
            this.#content = content;
            // First clear all existing children and their events
            while (this.getOverlayElement().firstChild) {
                this.getOverlayElement().removeChild(this.getOverlayElement().firstChild);
            }
            // Append the content as the first child
            this.getOverlayElement().appendChild(content);
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
     * Returns whether to fit the popup within the map viewport when it's displayed
     *
     * @returns {boolean}
     */
    get fit(): boolean {
        return this.#fit;
    }

    /**
     * Set whether to fit the popup within the map viewport when it's displayed
     *
     * @param {boolean} fit Whether to fit the popup within the map viewport when it's displayed
     */
    set fit(fit: boolean) {
        if (typeof fit === 'boolean') {
            this.#fit = fit;
        }
    }

    /**
     * Returns the theme to use for the popup
     *
     * @returns {string}
     */
    get theme(): string {
        return this.#theme;
    }

    /**
     * Set the theme to use for the popup
     *
     * @param {string} theme The theme to use for the popup
     */
    set theme(theme: string) {
        this.#theme = theme;
    }

    /**
     * Attach the popup to a element
     *
     * By default the popup will be shown when the element is clicked on.
     *
     * @param {Map | Layer} element The element to attach the popup to
     * @param {'click'|'clickon'|'hover'} [event] The event to trigger the popup. Defaults to 'click'
     *   - 'click' - Toggle the display of the popup when clicking on the element
     *   - 'clickon' - Show the popup when clicking on the element. It will always be shown and can't be hidden once the element is clicked.
     *   - 'hover' - Show the popup when hovering over the element. Hide the popup when the element is no longer hovered.
     * @param {PopupCallback} [callback] A function that is called every time the popup is about to be shown.
     *      It's passed the element that the popup is attached to and returns the content for the popup,
     *      a PopupOptions object, or a Popup object to show instead.
     * @returns {Promise<Popup>}
     */
    async attachTo(
        element: Map | Layer,
        event?: 'click' | 'clickon' | 'hover',
        callback?: PopupCallback,
    ): Promise<Popup> {
        if (!this.#isAttached) {
            this.#isAttached = true;
            if (isFunction(callback)) {
                this.#callback = callback;
            }

            // Set the popup property on the element if it's a Layer
            if (element instanceof Layer) {
                element.setPopup(this);
            }

            await element.init().then(() => {
                element.onceImmediate(READY_EVENT, () => {
                    if (event === 'clickon' || event === 'hover') {
                        // Don't toggle the display of the InfoWindow for the clickon and hover events.
                        // If it's toggled for hover then it'll appear like it's flickering.
                        // If it's toggled with clickon then it will behave like "click" and hide on the second click.
                        this.#toggleDisplay = false;
                    }

                    const triggerEvent = event || this.#event;
                    // Make sure that the event type is updated.
                    this.event = triggerEvent;

                    // The map that the popup is shown on
                    const elementMap = () => (element instanceof Map ? element : element.getMap());

                    // Show the popup when hovering over the element
                    if (triggerEvent === 'hover') {
                        element.on('mouseover', (e) => {
                            this.#popupFor(element).move(e.latLng, elementMap());
                        });
                        if (element instanceof Map) {
                            element.on('mousemove', (e) => {
                                // The callback isn't called again while the mouse moves. The popup
                                // that's already showing just follows the cursor.
                                (this.#activePopup || this).move(e.latLng, element);
                            });
                        }
                        element.on('mouseout', () => {
                            (this.#activePopup || this).hide();
                        });
                    } else if (triggerEvent === 'clickon') {
                        // Show the popup when clicking on the element
                        element.on('click', (e) => {
                            const popupObject = this.#popupFor(element);
                            // Since the popup is not toggled, we need to set the firstDraw value to false
                            // so that the popup is fit within the map viewport when it's displayed.
                            popupObject.#firstDraw = false;
                            // Make sure that the popup is included in the popup collection so that
                            // it can be hidden if a different popup is opened.
                            const collection = PopupCollection.getInstance();
                            if (!collection.has(popupObject)) {
                                collection.add(popupObject);
                            }
                            // Hide other popups if necessary
                            if (popupObject.#autoClose) {
                                collection.hideOthers(popupObject);
                            }

                            popupObject.move(e.latLng, elementMap());
                        });
                    } else {
                        // Show the popup when clicking on the element
                        element.on('click', (e) => {
                            const popupObject = this.#popupFor(element);
                            if (element instanceof Map || element instanceof Polyline) {
                                popupObject.position = e.latLng;
                            }
                            popupObject.toggle(element);
                        });
                    }
                });
            });
        }

        return this;
    }

    /**
     * Hide the popup
     *
     * Alias to hide()
     *
     * @returns {Popup}
     */
    close(): Popup {
        return this.hide();
    }

    /**
     * Returns whether the popup already has content
     *
     * @returns {boolean}
     */
    hasContent(): boolean {
        return (
            isStringWithValue(this.#content) || this.#content instanceof HTMLElement || this.#content instanceof Text
        );
    }

    /**
     * Hide the popup
     *
     * @returns {Popup}
     */
    hide(): Popup {
        super.hide();
        this.#firstDraw = false;
        this.#isOpen = false;
        PopupCollection.getInstance().remove(this);
        return this;
    }

    /**
     * Returns whether the popup is open or not
     *
     * @returns {boolean}
     */
    isOpen(): boolean {
        return this.#isOpen;
    }

    /**
     * Open the popup
     *
     * Alias to show()
     *
     * @param {Map | Layer} element The anchor object or map object.
     * @returns {Promise<Popup>}
     */
    open(element: Map | Layer): Promise<Popup> {
        return this.show(element);
    }

    /**
     * Set the element to close the popup. This can be a CSS selector or an HTMLElement.
     * The popup will be hidden when this element is clicked on.
     *
     * @param {HTMLElement|string} element The element to close the popup. This can be a CSS selector or an HTMLElement.
     * @returns {Popup}
     */
    setCloseElement(element: HTMLElement | string): Popup {
        this.closeElement = element;
        return this;
    }

    /**
     * Set the Popup content
     *
     * @param {string | HTMLElement | Text} content The Popup content
     * @returns {Popup}
     */
    setContent(content: string | HTMLElement | Text): Popup {
        this.content = content;
        return this;
    }

    /**
     * Sets the options for the popup
     *
     * @param {PopupOptions} options Popup options
     * @returns {Popup}
     */
    setOptions(options: PopupOptions): Popup {
        if (typeof options.autoClose === 'boolean') {
            this.autoClose = options.autoClose;
        }
        if (typeof options.center === 'boolean') {
            this.center = options.center;
        }
        if (isString(options.className)) {
            this.setClassName(options.className);
        }
        if (options.clearance) {
            this.#clearance = size(options.clearance);
        }
        if (options.closeElement) {
            this.closeElement = options.closeElement;
        }
        if (options.content) {
            this.content = options.content;
        }
        if (options.event) {
            this.event = options.event;
        }
        if (typeof options.fit === 'boolean') {
            this.#fit = options.fit;
        }
        if (typeof options.offset !== 'undefined') {
            this.setOffset(options.offset);
        }
        if (options.styles) {
            this.styles = options.styles;
        }
        if (options.theme) {
            this.theme = options.theme;
        }

        return this;
    }

    /**
     * Open the popup
     *
     * You need to pass in either an anchor object or a map object.
     * If an anchor object is passed in then the popup will be displayed at the anchor's position.
     * If a map object is passed in then the popup will be displayed at the position of the popup.
     *
     * https://developers.google.com/maps/documentation/javascript/reference/info-window#Popup.open
     *
     * @param {Map | Layer} element The anchor object or map object.
     *      This should ideally be the Map or Marker object and not the Google maps object.
     *      If this is used internally then the Google maps object can be used.
     * @returns {Promise<Popup>}
     */
    show(element: Map | Layer): Promise<Popup> {
        return new Promise((resolve) => {
            const collection = PopupCollection.getInstance();
            if (collection.has(this) && this.#isOpen) {
                if (this.#toggleDisplay) {
                    this.hide();
                }
                resolve(this);
            } else {
                // Hide other open Popups if necessary
                if (this.#autoClose) {
                    collection.hideOthers(this);
                }

                this.#isOpen = true;
                collection.add(this);

                if (element instanceof Map) {
                    this.#popupOffset = this.getOffset().clone();
                    super.show(element).then(() => {
                        resolve(this);
                    });
                } else if (element instanceof Marker) {
                    // If the anchor is a marker then add the anchor's anchorPoint to the offset.
                    // The anchorPoint for the marker contains the x/y values to add to the marker's position that
                    // an InfoWindow should be displayed at. This can also be used with our Popup.
                    // We add the offset value for the Popup to the anchorPoint value.
                    element.toGoogle().then((marker) => {
                        /**
                         * Try to get the anchor point for the marker.
                         *
                         * If the marker was just rendered and it's anchorPoint is not set yet, then
                         * the anchorPoint will be undefined. This function will retry to get the anchorPoint
                         * until it's defined or the max number of attempts is reached. The anchorPoint will typically
                         * be defined shortly after the marker is rendered by the Google maps library.
                         *
                         * @param {number} [attempt] The number of attempts to get the anchor point. Defaults to 0.
                         * @returns {void}
                         */
                        const tryGetAnchorPoint = (attempt: number = 0): void => {
                            const anchorPoint = marker.get('anchorPoint');
                            this.position = element.getPosition();

                            // If anchorPoint is still undefined and we haven't exceeded max attempts, retry
                            if (anchorPoint === undefined && attempt < 5) {
                                const timeouts = [100, 200, 400, 600, 1000];
                                const timeout = timeouts[attempt];

                                setTimeout(() => {
                                    tryGetAnchorPoint(attempt + 1);
                                }, timeout);
                                return;
                            }

                            // Either anchorPoint is defined or we've exhausted retries - continue with displaying the popup
                            if (anchorPoint instanceof google.maps.Point) {
                                this.#popupOffset = this.getOffset().add(anchorPoint.x, anchorPoint.y);
                            } else {
                                this.#popupOffset = this.getOffset().clone();
                            }

                            // Set the element value to display the popup and call the add() and draw() functions.
                            super.show(element.getMap()).then(() => {
                                resolve(this);
                            });
                        };

                        // Start the retry mechanism
                        tryGetAnchorPoint();
                    });
                } else {
                    // If the anchor is a Layer then the position should be set on the Popup.
                    // This is useful for Polylines and Polygons.
                    this.#popupOffset = this.getOffset().clone();
                    super.show(element.getMap()).then(() => {
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
     */
    toggle(element: Map | Layer): void {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show(element);
        }
    }

    /**
     * Add the overlay to the element. Called once after setMap() is called on the overlay with a valid map.
     *
     * @internal
     * @param {google.maps.MapPanes} panes The Google maps panes object
     */
    add(panes: google.maps.MapPanes) {
        panes.floatPane.appendChild(this.getOverlayElement());
    }

    /**
     * Draw the overlay. Called when the overlay is being drawn or updated.
     *
     * @internal
     * @param {google.maps.MapCanvasProjection} projection The Google maps projection object
     */
    draw(projection: google.maps.MapCanvasProjection) {
        // projection could be undefined if this is being displayed on a hover event. Sometimes the initial
        // hover events are triggered faster than the overlay can be set up on the map. It'll eventually catch
        // up and the popup will be displayed.
        if (typeof projection !== 'undefined') {
            const divPosition = projection.fromLatLngToDivPixel(this.position.toGoogle());

            // Hide the popup when it is far out of view.
            const display = Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ? 'block' : 'none';

            if (display === 'block') {
                this.style('left', `${divPosition.x + this.#popupOffset.getX()}px`);
                this.style('top', `${divPosition.y + this.#popupOffset.getY()}px`);
            }

            if (this.center) {
                // Center the popup horizontally on the element.
                // The -100% Y value is to position the popup above the element.
                this.style('transform', 'translate(-50%, -100%)');
            } else {
                // Position the popup above the element.
                this.style('transform', 'translate(0, -100%)');
            }
            if (this.#theme === 'default') {
                const styles = this.styles || {};
                const themeStyles = {
                    backgroundColor: '#fff',
                    color: '#333',
                    padding: '3px 6px',
                    borderRadius: '4px',
                    boxShadow: '0 0 5px rgba(0,0,0,0.3)',
                };
                this.styles = { ...themeStyles, ...styles };
            }

            if (this.getOverlayElement().style.display !== display) {
                this.style('display', display);
            }

            if (this.#closeElement) {
                if (this.#closeElement instanceof HTMLElement) {
                    this.#setupCloseClick(this.#closeElement);
                } else if (isStringWithValue(this.#closeElement)) {
                    const matches = this.getOverlayElement().querySelectorAll(this.#closeElement);
                    matches.forEach((element) => {
                        this.#setupCloseClick(element as HTMLElement);
                    });
                }
            }

            if (!this.#firstDraw) {
                this.#firstDraw = true;
                // Fit the popup to the map viewport if necessary.
                // Ony do this the first time the popup is drawn on the map.
                // The popup is redrawn anytime the map is moved or zoomed and we don't want to keep fitting the popup.
                this.#fitPopup();
            }
        }
    }

    /**
     * Fit the popup within the map viewport when it's displayed
     *
     * @returns {void}
     */
    #fitPopup(): void {
        // Don't try to fit the popup within the map viewport if the event is hover because the map center could change, which
        // would then cause the element to no longer be hovered over, which would close the popup.
        if (this.#fit && this.event !== 'hover') {
            const map = this.getMap();

            let offsetY = 0;
            let offsetX = 0;
            // Get the map div position data
            const mapPosition = map.getDiv().getBoundingClientRect();
            // Get the popup element position data
            const popupPosition = this.getOverlayElement().getBoundingClientRect();

            // Check if the top of the popup is visible in the map viewport
            if (popupPosition.height < mapPosition.height) {
                if (
                    mapPosition.top > popupPosition.top ||
                    mapPosition.top > popupPosition.top - this.#clearance.height
                ) {
                    // The popup is above the map viewport. Move the map down and include the clearance value.
                    offsetY = popupPosition.top - mapPosition.top - this.#clearance.height;
                }
            } else if (popupPosition.bottom < mapPosition.bottom) {
                // The popup is taller than the map viewport. Move the map down but try to keep the
                // marker or the thing that was clicked on in view.
                offsetY = (mapPosition.bottom - popupPosition.bottom) * -1;
                if (this.#popupOffset.y !== 0) {
                    // Add the offset to the offsetY value
                    offsetY += Math.abs(this.#popupOffset.y);
                } else if (this.#clearance.height > 40) {
                    offsetY += this.#clearance.height;
                } else {
                    // Keep a small part of the map viewport in view
                    offsetY += 40;
                }
            }

            // Check if the left or right side of the popup is visible in the map viewport
            if (popupPosition.width < mapPosition.width) {
                if (
                    mapPosition.left > popupPosition.left ||
                    mapPosition.left > popupPosition.left - this.#clearance.width
                ) {
                    // The popup is to the left of the map viewport. Move the map right and include the clearance value.
                    offsetX = popupPosition.left - mapPosition.left - this.#clearance.width;
                } else if (
                    mapPosition.right < popupPosition.right ||
                    mapPosition.right < popupPosition.right + this.#clearance.width
                ) {
                    // The popup is to the right of the map viewport. Move the map left and include the clearance value.
                    offsetX = (mapPosition.right - popupPosition.right - this.#clearance.width) * -1;
                }
            } else {
                // The popup is wider than the map viewport. Move the map left but try to keep the
                // marker or the thing that was clicked on in view.
                // offsetX = (mapPosition.right - popupPosition.right) * -1;
                offsetX = popupPosition.left - mapPosition.left;
                if (this.#popupOffset.x !== 0) {
                    // Add the offset to the offsetX value
                    offsetX -= Math.abs(this.#popupOffset.x);
                } else if (this.#clearance.width > 40) {
                    offsetX -= this.#clearance.width;
                } else {
                    // Keep a small part of the map viewport in view
                    offsetX -= 40;
                }
            }

            // Pan the map to bring the popup into view if necessary
            if (offsetX !== 0 || offsetY !== 0) {
                map.panBy(offsetX, offsetY);
            }
        }
    }

    /**
     * Work out the popup to show for the thing that the event happened on.
     *
     * Without a callback function this is always the popup itself, which is how a popup with
     * fixed content works. With one, the callback is called every time the popup is about to be
     * shown so that the content, the options, or the whole popup can be different each time.
     *
     * @private
     * @param {Map|Layer} target The object that the popup is attached to
     * @returns {Popup}
     */
    #popupFor(target: Map | Layer): Popup {
        if (!isFunction(this.#callback)) {
            return this;
        }
        const popupObject = popupFromCallback(this, this.#callback(target));
        // If the callback returned a different popup than the one that's showing then the old
        // one is hidden. Otherwise it would be left open on the map with nothing referring to it.
        if (this.#activePopup && this.#activePopup !== popupObject) {
            this.#activePopup.hide();
        }
        this.#activePopup = popupObject;
        return popupObject;
    }

    /**
     * Handle the close click event
     *
     * This is here so that any previous click event listeners are removed before adding the new one.
     */
    #handleCloseClick = () => {
        this.hide();
    };

    /**
     * Set up the close click event listenter on the element
     *
     * @param {HTMLElement} element The element that will close the popup when clicked.
     */
    #setupCloseClick = (element: HTMLElement) => {
        // First, remove any existing click event listeners
        element.removeEventListener('click', this.#handleCloseClick);
        // Add the click event listener to hide the popup
        element.addEventListener('click', this.#handleCloseClick);
    };
}

export type PopupValue = Popup | PopupOptions | string | HTMLElement | Text;

/**
 * A function that works out what popup to show.
 *
 * It's called every time the popup is about to be shown and is passed the object that the popup
 * is attached to. It can return the content for the popup, a PopupOptions object, or a Popup
 * object to show instead.
 */
export type PopupCallback = (target?: Map | Layer) => PopupValue;

// The value that can be passed to attachPopup()
export type AttachPopupValue = PopupValue | PopupCallback;

/**
 * Apply the value that a popup callback returned and return the popup to show.
 *
 * - A Popup object is shown instead of the popup that the callback belongs to.
 * - A PopupOptions object is set on the popup.
 * - Anything else is set as the popup content.
 *
 * @param {Popup} basePopup The popup that the callback is attached to
 * @param {PopupValue} value The value that the callback returned
 * @returns {Popup} The popup to show
 */
const popupFromCallback = (basePopup: Popup, value: PopupValue): Popup => {
    if (value instanceof Popup) {
        return value;
    }
    if (isString(value) || value instanceof HTMLElement || value instanceof Text) {
        basePopup.setContent(value);
    } else if (isObject(value)) {
        basePopup.setOptions(value as PopupOptions);
    }
    return basePopup;
};

/**
 * Helper function to set up the Popup class
 *
 * @param {PopupValue} [options] The Popup options
 * @returns {Popup}
 */
export const popup = (options?: PopupValue): Popup => {
    if (options instanceof Popup) {
        return options;
    }
    return new Popup(options);
};

/**
 * Helper function to close all open popups
 *
 * Usage:
 * G.closeAllPopups();
 *
 * @returns {void}
 */
export const closeAllPopups = (): void => {
    PopupCollection.getInstance().hideAll();
};

// Set up the mixing for attaching the popup to other elements.
const popupMixin = {
    /**
     * Attach a popup to this object.
     *
     * A function can be passed instead of a fixed value. It's called every time the popup is
     * about to be shown, is passed this object, and returns the content for the popup, a
     * PopupOptions object, or a Popup object to show instead.
     *
     * @param {AttachPopupValue} popupValue The content for the Popup, or the Popup options object, or the Popup
     *      object, or a function that returns one of those.
     * @param {'click' | 'clickon' | 'hover'} [event] The event to trigger the popup. Defaults to 'hover'. See Popup.attachTo() for more information.
     * @returns {Popup}
     */
    attachPopup(popupValue: AttachPopupValue, event?: 'click' | 'clickon' | 'hover'): Popup {
        let p: Popup;
        let callback: PopupCallback;
        if (isFunction(popupValue)) {
            // The popup is worked out each time it's shown, so it starts out with no content
            callback = popupValue as PopupCallback;
            p = popup({ content: '' });
        } else {
            p = popup(popupValue as PopupValue);
        }
        p.attachTo(this, event, callback);
        return p;
    },
};

/**
 * To avoid circular dependencies we need to add the attachPopup method to the Layer and Map classes here
 */
Layer.include(popupMixin);
Map.include(popupMixin);

/* ===========================================================================
    Attaching a popup to a data layer or to one of its features.

    The data layer needs its own handling because the features aren't separate objects on the
    map. Google draws them all through the one data layer object, and the mouse events are
    fired on that layer with the feature that they happened on. So the listeners go on the
    layer and the right popup is worked out from the feature that comes with the event.
=========================================================================== */

/**
 * A function that works out the popup to show for a data layer feature.
 *
 * It's the data layer version of PopupCallback. It's called every time the popup is about to be
 * shown and is passed the feature that the event happened on. It can return the content for the
 * popup, a PopupOptions object, or a Popup object to show instead.
 */
export type DataPopupCallback = (feature: DataFeature) => PopupValue;

// The value that can be passed when attaching a popup to a data layer or a feature.
// A string, or the content in a PopupOptions object, can hold {property} placeholders, which are
// replaced with the properties of the feature that the popup is being shown for.
export type DataPopupValue = PopupValue | DataPopupCallback;

// The event that triggers a popup
type PopupEventValue = 'click' | 'clickon' | 'hover';

// The popup set up for a data layer, or for one feature within it
type DataPopupConfig = {
    // The function that works out the popup, if one was given
    callback?: DataPopupCallback;
    event: PopupEventValue;
    // The popup to show, and the one that content and options are set on
    popup: Popup;
    // The content holding {property} placeholders, if the content was a fixed string
    template?: string;
};

// Everything that one data layer needs to hold for its popups
type DataPopupState = {
    // The popups attached to individual features
    features: WeakMap<DataFeature, DataPopupConfig>;
    // The popup attached to the whole layer, used for any feature without its own
    layerConfig?: DataPopupConfig;
    // The event types that listeners have already been set up for
    listeners: { [key: string]: boolean };
    // The feature whose popup is currently open, so that clicking it again closes it
    openFeature?: DataFeature;
    // The popup that is currently open. A callback can return a different Popup object for each
    // feature, so this isn't always the popup on the config.
    openPopup?: Popup;
};

// The popup state for each data layer
const dataPopupState: WeakMap<DataLayer, DataPopupState> = new WeakMap();

/**
 * Get the popup state for a data layer, setting it up if this is the first popup on the layer
 *
 * @param {DataLayer} layer The data layer
 * @returns {DataPopupState}
 */
const getDataPopupState = (layer: DataLayer): DataPopupState => {
    let state = dataPopupState.get(layer);
    if (!state) {
        state = { features: new WeakMap(), listeners: {} };
        dataPopupState.set(layer, state);
    }
    return state;
};

/**
 * Replace the {property} placeholders in the content with the feature's property values.
 *
 * A property that the feature doesn't have is replaced with an empty string.
 *
 * @param {string} template The content with the placeholders in it
 * @param {DataFeature} feature The feature to get the property values from
 * @returns {string}
 */
const renderDataPopupTemplate = (template: string, feature: DataFeature): string =>
    template.replace(/\{\s*([^{}\s]+)\s*\}/g, (match, key) => {
        const value = feature.getProperty(key);
        return isNullOrUndefined(value) ? '' : String(value);
    });

/**
 * Work out the popup to show for a feature.
 *
 * A callback function is called with the feature and can return the content, a PopupOptions
 * object, or a different Popup object, the same as a callback on any other popup. Otherwise the
 * fixed content is used, with any {property} placeholders replaced for this feature.
 *
 * @param {DataPopupConfig} config The popup configuration
 * @param {DataFeature} feature The feature to get the popup for
 * @returns {Popup}
 */
const getDataPopup = (config: DataPopupConfig, feature: DataFeature): Popup => {
    if (isFunction(config.callback)) {
        return popupFromCallback(config.popup, config.callback(feature));
    }
    if (isString(config.template)) {
        config.popup.setContent(renderDataPopupTemplate(config.template, feature));
    }
    return config.popup;
};

/**
 * Set up the popup configuration from the value that was passed to attachPopup()
 *
 * @param {DataPopupValue} popupValue The content for the popup, the popup options, or the Popup object
 * @param {PopupEventValue} event The event that triggers the popup
 * @returns {DataPopupConfig}
 */
const buildDataPopupConfig = (popupValue: DataPopupValue, event: PopupEventValue): DataPopupConfig => {
    let callback: DataPopupCallback;
    let template: string;
    let popupObject: Popup;
    if (isFunction(popupValue)) {
        // The popup is worked out for each feature so it starts out with no content
        popupObject = popup({ content: '' });
        callback = popupValue as DataPopupCallback;
    } else {
        popupObject = popup(popupValue as PopupValue);
        // A string is kept so that any {property} placeholders in it can be replaced for each feature
        if (isString(popupObject.content)) {
            template = popupObject.content;
        }
    }
    // Let the popup know how it's triggered. The popup doesn't pan the map into view for
    // hover events because that would move the feature out from under the cursor.
    popupObject.event = event;
    return { callback, event, popup: popupObject, template };
};

/**
 * Show the popup for a feature
 *
 * @param {DataPopupConfig} config The popup configuration
 * @param {DataFeature} feature The feature to show the popup for
 * @param {LatLng} position The position to show the popup at
 * @param {Popup} [openPopup] The popup that is currently open, if there is one
 * @returns {Popup|undefined} The popup that was shown
 */
const showDataPopup = (
    config: DataPopupConfig,
    feature: DataFeature,
    position: LatLng,
    openPopup?: Popup,
): Popup | undefined => {
    const { map } = feature.getLayer();
    if (!(map instanceof Map) || !position) {
        return undefined;
    }
    const popupObject = getDataPopup(config, feature);
    // A callback can return a different Popup object for each feature. Hide the one that was
    // showing, otherwise it would be left open on the map with nothing referring to it.
    if (openPopup && openPopup !== popupObject) {
        openPopup.hide();
    }
    // Hide the popup first so that it's fit within the map viewport again when it's shown.
    // The map is only panned to bring the popup into view on the first draw after it's shown,
    // so without this only the first popup would be brought into view.
    popupObject.hide();
    popupObject.position = position;
    popupObject.show(map);
    return popupObject;
};

/**
 * Handle a mouse event on the data layer and show or hide the popup for the feature
 *
 * @param {DataLayer} layer The data layer that the event happened on
 * @param {string} type The event type
 * @param {DataLayerEventObject} event The event data
 * @returns {void}
 */
const handleDataPopupEvent = (layer: DataLayer, type: string, event: DataLayerEventObject): void => {
    const state = dataPopupState.get(layer);
    const { feature } = event;
    if (!state || !(feature instanceof DataFeature)) {
        return;
    }
    // A popup on the feature itself wins over one attached to the whole layer
    const config = state.features.get(feature) || state.layerConfig;
    if (!config) {
        return;
    }

    if (type === 'mouseover') {
        if (config.event === 'hover') {
            const shown = showDataPopup(config, feature, event.latLng, state.openPopup);
            if (shown) {
                state.openFeature = feature;
                state.openPopup = shown;
            }
        }
    } else if (type === 'mouseout') {
        if (config.event === 'hover' && state.openPopup) {
            state.openPopup.hide();
            state.openFeature = undefined;
            state.openPopup = undefined;
        }
    } else if (config.event !== 'hover') {
        // Clicking the same feature again closes the popup, unless it's a "clickon" popup,
        // which stays open once it's shown.
        if (config.event === 'click' && state.openPopup?.isOpen() && state.openFeature === feature) {
            state.openPopup.hide();
            state.openFeature = undefined;
            state.openPopup = undefined;
            return;
        }
        const shown = showDataPopup(config, feature, event.latLng, state.openPopup);
        if (shown) {
            state.openFeature = feature;
            state.openPopup = shown;
        }
    }
};

/**
 * Set up the event listeners on the data layer for showing popups.
 *
 * The listeners are only set up once for each event type however many popups are attached.
 *
 * @param {DataLayer} layer The data layer
 * @param {PopupEventValue} event The event that triggers the popup
 * @returns {void}
 */
const setupDataPopupListeners = (layer: DataLayer, event: PopupEventValue): void => {
    const state = getDataPopupState(layer);
    if (!state.listeners.click) {
        state.listeners.click = true;
        layer.onClick((e) => {
            handleDataPopupEvent(layer, 'click', e);
        });
    }
    if (event === 'hover' && !state.listeners.hover) {
        state.listeners.hover = true;
        layer.onMouseOver((e) => {
            handleDataPopupEvent(layer, 'mouseover', e);
        });
        layer.onMouseOut((e) => {
            handleDataPopupEvent(layer, 'mouseout', e);
        });
    }
};

// Set up the mixin for attaching a popup to every feature in a data layer
const dataLayerPopupMixin = {
    /**
     * Attach a popup to every feature in the data layer.
     *
     * The content can hold {property} placeholders, which are replaced with the properties of
     * whichever feature was clicked. It can also be a function that is called with the feature.
     *
     * @param {DataPopupValue} popupValue The content for the popup, or the Popup options object, or the Popup object
     * @param {'click' | 'clickon' | 'hover'} [event] The event to trigger the popup. Defaults to 'click'.
     * @returns {Popup}
     */
    attachPopup(popupValue: DataPopupValue, event?: PopupEventValue): Popup {
        const triggerEvent = event || 'click';
        const config = buildDataPopupConfig(popupValue, triggerEvent);
        getDataPopupState(this).layerConfig = config;
        setupDataPopupListeners(this, triggerEvent);
        return config.popup;
    },
};

// Set up the mixin for attaching a popup to one feature within a data layer
const dataFeaturePopupMixin = {
    /**
     * Attach a popup to this one feature.
     *
     * This takes precedence over a popup attached to the whole data layer.
     *
     * @param {DataPopupValue} popupValue The content for the popup, or the Popup options object, or the Popup object
     * @param {'click' | 'clickon' | 'hover'} [event] The event to trigger the popup. Defaults to 'click'.
     * @returns {Popup}
     */
    attachPopup(popupValue: DataPopupValue, event?: PopupEventValue): Popup {
        const triggerEvent = event || 'click';
        const config = buildDataPopupConfig(popupValue, triggerEvent);
        const layer = this.getLayer();
        getDataPopupState(layer).features.set(this, config);
        setupDataPopupListeners(layer, triggerEvent);
        return config.popup;
    },
};

/**
 * The data layer and its features need their own attachPopup, so they replace the one that
 * they would otherwise get from Layer.
 */
DataLayer.include(dataLayerPopupMixin);
DataFeature.include(dataFeaturePopupMixin);

type PopupCollectionObject = {
    popups: Popup[];
    add(p: Popup): void;
    clear(): void;
    hideAll(): void;
    hideOthers(p: Popup): void;
    has(p: Popup): boolean;
    remove(p: Popup): void;
};

/**
 * Singleton class to hold the open Popups.
 * Usage:
 * const collection = PopupCollection.getInstance();
 * collection.add(popup);
 * collection.hideAll();
 */
const PopupCollection = (() => {
    /**
     * The singleton instance of the object
     */
    let instance: PopupCollectionObject;

    /**
     * Create the object instance
     *
     * @private
     * @returns {PopupCollectionObject}
     */
    function createInstance(): PopupCollectionObject {
        return {
            /**
             * Holds the Popup objects
             */
            popups: [],
            /**
             * Adds an Popup to the collection
             *
             * @param {Popup} p The Popup object to add
             */
            add(p: Popup) {
                this.popups.push(p);
            },
            /**
             * Clears the collection
             */
            clear() {
                this.popups = [];
            },
            /**
             * Hides all the Popups in the collection
             */
            hideAll() {
                this.popups.forEach((p: Popup) => {
                    p.hide();
                });
            },
            /**
             * Hide all the Popups in the collection except for the one passed in
             *
             * @param {Popup} p The Popup object to keep open
             */
            hideOthers(p: Popup) {
                // Clone the popups to make sure that they are all looped through.
                // If the popup is closed it's removed from the popup array, which
                // can cause the loop to skip over the next popup and not test if it
                // should be removed.
                const popups = [...this.popups];
                popups.forEach((infoW: Popup) => {
                    if (infoW !== p) {
                        infoW.hide();
                    }
                });
            },
            /**
             * Returns whether the collection has the Popup object
             *
             * @param {Popup} p The Popup object to check for
             * @returns {boolean}
             */
            has(p: Popup): boolean {
                return this.popups.indexOf(p) > -1;
            },
            /**
             * Removes an Popup from the collection
             *
             * @param {Popup} p The Popup object to remove
             */
            remove(p: Popup) {
                const index = this.popups.indexOf(p);
                if (index > -1) {
                    this.popups.splice(index, 1);
                }
            },
        };
    }

    return {
        /**
         * Get the singleton instance of the object
         *
         * @returns {PopupCollectionObject}
         */
        getInstance(): PopupCollectionObject {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        },
    };
})();
