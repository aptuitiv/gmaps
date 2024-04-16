/* ===========================================================================
    Display a custom popup on the map

    See https://aptuitiv.github.io/gmaps-docs/api-reference/popup for documentation.
=========================================================================== */

/* global google, HTMLElement, Text */
/* eslint-disable no-use-before-define */

import Layer from './Layer';
import { Map } from './Map';
import { Marker } from './Marker';
import Overlay from './Overlay';
import { point, Point, PointValue } from './Point';
import { isObject, isObjectWithValues, isString, isStringWithValue } from './helpers';

export type PopupOptions = {
    // Whether to automatically hide other open popups when opening this one
    autoClose?: boolean;
    // The popup wrapper class name
    className?: string;
    // The popup content
    content: string | HTMLElement | Text;
    // The amount to offset the popup from the element it is displayed at.
    // If the element is a marker, then this is added to the marker's anchorPoint value.
    // For example, if the marker is 40px tall and no anchorPoint value was set for the marker, then
    // by default the popup will be displayed at the top of the marker. If you set the offset to be
    // 0, -20 then the popup will be displayed 20px above the top of the marker.
    // If the element is a marker and this is not set, then the marker's anchorPoint value is used.
    offset?: PointValue;
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
     * Holds the tooltip content.
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
     * Whether clicking the thing that triggered the popup to show should also hide the popup
     *
     * @private
     * @type {boolean}
     */
    #toggleDisplay: boolean = true;

    /**
     * Constructor
     *
     * @param {PopupOptions} [options] The Popup options
     */
    constructor(options: PopupOptions) {
        super('popup', 'Popup');

        this.#popupOffset = point(0, 0);
        if (isObject(options)) {
            this.setOptions(options);
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
     * Returns the content for the tooltip
     *
     * @returns {string|HTMLElement|Text}
     */
    get content(): string | HTMLElement | Text {
        return this.#content;
    }

    /**
     * Set the content for the tooltip
     *
     * @param {string|HTMLElement} content The content for the tooltip
     */
    set content(content: string | HTMLElement) {
        if (isStringWithValue(content)) {
            this.#content = content;
            this.getOverlayElement().innerHTML = content;
        } else if (content instanceof HTMLElement) {
            this.#content = content;
            this.getOverlayElement().innerHTML = '';
            this.getOverlayElement().appendChild(content);
        }
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
     * @param {Map | Marker} element The anchor object or map object.
     * @returns {Promise<Popup>}
     */
    open(element: Map | Marker): Promise<Popup> {
        return this.show(element);
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
        if (isString(options.className)) {
            this.setClassName(options.className);
        }
        if (typeof options.offset !== 'undefined') {
            this.setOffset(options.offset);
        }

        this.setContent(options.content);
        return this;
    }

    /**
     * Set the Popup content
     *
     * @param {string | HTMLElement | Text} content The Popup content
     * @returns {Popup}
     */
    setContent(content: string | HTMLElement | Text): Popup {
        if (isStringWithValue(content)) {
            this.getOverlayElement().innerHTML = content;
        } else if (content instanceof HTMLElement || content instanceof Text) {
            // First clear all existing children and their events
            while (this.getOverlayElement().firstChild) {
                this.getOverlayElement().removeChild(this.getOverlayElement().firstChild);
            }
            // Append the content as the first child
            this.getOverlayElement().appendChild(content);
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
     * @param {Map | Marker} element The anchor object or map object.
     *      This should ideally be the Map or Marker object and not the Google maps object.
     *      If this is used internally then the Google maps object can be used.
     * @returns {Promise<Popup>}
     */
    show(element: Map | Marker): Promise<Popup> {
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
                        // Set the map value to display the popup and call the add() and draw() functions.
                        super.show(element.getMap()).then(() => {
                            resolve(this);
                        });
                    });
                }
            }
        });
    }

    /**
     * Add the overlay to the map. Called once after setMap() is called on the overlay with a valid map.
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
        const divPosition = projection.fromLatLngToDivPixel(this.position.toGoogle())!;

        // Hide the tooltip when it is far out of view.
        const display = Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ? 'block' : 'none';

        if (display === 'block') {
            this.getOverlayElement().style.left = `${divPosition.x + this.#popupOffset.getX()}px`;
            this.getOverlayElement().style.top = `${divPosition.y + this.#popupOffset.getY()}px`;
        }

        if (this.getOverlayElement().style.display !== display) {
            this.getOverlayElement().style.display = display;
        }
    }
}

export type PopupValue = Popup | PopupOptions;

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
 * To avoid circular dependencies we need to add the attachPopup method to the Layer class here
 */
Layer.include({
    /**
     * Holds the Popup object
     *
     * @type {Popup}
     */
    layerPopup: null,
    /**
     *
     * @param {string | HTMLElement | Text | PopupValue} content The content for the Popup, or the Popup options object, or the Popup object
     * @param {PopupOptions} [options] The Popup options object
     */
    attachPopup(content: string | HTMLElement | Text | PopupValue, options?: PopupOptions) {
        if (content instanceof Popup) {
            this.layerPopup = content;
        } else if (isString(content) || content instanceof HTMLElement || content instanceof Text) {
            this.layerPopup = popup();
            this.layerPopup.setContent(content);
        } else if (isObjectWithValues(content)) {
            this.layerPopup = popup(content);
        }
        if (isObjectWithValues(options)) {
            this.layerPopup.setOptions(options);
        }
        this.on('click', () => {
            if (this.layerPopup) {
                this.layerPopup.show(this);
            }
        });
    },
});

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
