/* ===========================================================================
    Display a custom popup on the map

    See https://aptuitiv.github.io/gmaps-docs/api-reference/popup for documentation.
=========================================================================== */

/* global google, HTMLElement, Text */
/* eslint-disable no-use-before-define -- Done because the PopupCollection is referenced before it's created */

import Layer from './Layer';
import { Map } from './Map';
import { Marker } from './Marker';
import { Overlay } from './Overlay';
import { point, Point, PointValue } from './Point';
import { Polyline } from './Polyline';
import { isObject, isString, isStringWithValue } from './helpers';

export type PopupOptions = {
    // Whether to automatically hide other open popups when opening this one
    autoClose?: boolean;
    // Whether to center the popup horizontally on the element. Useful if the popup is on a marker. Defaults to true.
    center?: boolean;
    // The popup wrapper class name
    className?: string;
    // The element to close the popup. This can be a CSS selector or an HTMLElement.
    closeElement?: HTMLElement | string;
    // The popup content
    content: string | HTMLElement | Text;
    // The amount to offset the popup from the element it is displayed at.
    // If the element is a marker, then this is added to the marker's anchorPoint value.
    // For example, if the marker is 40px tall and no anchorPoint value was set for the marker, then
    // by default the popup will be displayed at the top of the marker. If you set the offset to be
    // 0, -20 then the popup will be displayed 20px above the top of the marker.
    // If the element is a marker and this is not set, then the marker's anchorPoint value is used.
    offset?: PointValue;
    // Styles that will be set on the popup container div.
    styles?: object;
    // A build-in theme to assign to the popup. By default the popup has a default theme. Set to 'none' to remove the theme.
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
    #theme: string = 'default';

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
     * @returns {Promise<Popup>}
     */
    async attachTo(element: Map | Layer, event: 'click' | 'clickon' | 'hover' = 'click'): Promise<Popup> {
        await element.init().then(() => {
            if (event === 'clickon' || event === 'hover') {
                // Don't toggle the display of the InfoWindow for the clickon and hover events.
                // If it's toggled for hover then it'll appear like it's flickering.
                // If it's toggled with clickon then it will behave like "click" and hide on the second click.
                this.#toggleDisplay = false;
            }

            // Show the popup when hovering over the element
            if (event === 'hover') {
                element.on('mouseover', (e) => {
                    if (element instanceof Map) {
                        this.move(e.latLng, element);
                    } else {
                        this.move(e.latLng, element.getMap());
                    }
                });
                if (element instanceof Map) {
                    element.on('mousemove', (e) => {
                        this.move(e.latLng, element);
                    });
                }
                element.on('mouseout', () => {
                    this.hide();
                });
            } else if (event === 'clickon') {
                // Show the popup when clicking on the element
                element.on('click', (e) => {
                    if (element instanceof Map) {
                        this.move(e.latLng, element);
                    } else {
                        this.move(e.latLng, element.getMap());
                    }
                });
            } else {
                // Show the popup when clicking on the element
                element.on('click', (e) => {
                    if (element instanceof Map || element instanceof Polyline) {
                        this.position = e.latLng;
                    }
                    this.toggle(element);
                });
            }
        });

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
        if (options.closeElement) {
            this.closeElement = options.closeElement;
        }
        if (options.content) {
            this.content = options.content;
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
                    this.position = element.getPosition();
                    // If the anchor is a marker then add the anchor's anchorPoint to the offset.
                    // The anchorPoint for the marker contains the x/y values to add to the marker's position that
                    // an InfoWindow should be displayed at. This can also be used with our Popup.
                    // We add the offset value for the Popup to the anchorPoint value.
                    element.toGoogle().then((marker) => {
                        const anchorPoint = marker.get('anchorPoint');
                        if (anchorPoint instanceof google.maps.Point) {
                            this.#popupOffset = this.getOffset().add(anchorPoint.x, anchorPoint.y);
                        } else {
                            this.#popupOffset = this.getOffset().clone();
                        }
                        // Set the element value to display the popup and call the add() and draw() functions.
                        super.show(element.getMap()).then(() => {
                            resolve(this);
                        });
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
            const divPosition = projection.fromLatLngToDivPixel(this.position.toGoogle())!;

            // Hide the popup when it is far out of view.
            const display = Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ? 'block' : 'none';

            if (display === 'block') {
                this.style('left', `${divPosition.x + this.#popupOffset.getX()}px`);
                this.style('top', `${divPosition.y + this.#popupOffset.getY()}px`);
            }

            if (this.center) {
                // Center the tooltip horizontally on the element.
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
        }
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

// Set up the mixing for attaching the popup to other elements.
const popupMixin = {
    /**
     *
     * @param { PopupValue} popupValue The content for the Popup, or the Popup options object, or the Popup object
     * @param {'click' | 'clickon' | 'hover'} event The event to trigger the popup. Defaults to 'hover'. See Popup.attachTo() for more information.
     */
    attachPopup(popupValue: PopupValue, event: 'click' | 'clickon' | 'hover' = 'click') {
        popup(popupValue).attachTo(this, event);
    },
};

/**
 * To avoid circular dependencies we need to add the attachPopup method to the Layer and Map classes here
 */
Layer.include(popupMixin);
Map.include(popupMixin);

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
                this.popups.forEach((infoW: Popup) => {
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
