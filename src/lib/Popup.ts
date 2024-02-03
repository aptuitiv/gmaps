/* ===========================================================================
    Display a custom popup on the map

    Usage:
    marker = G.marker({
        latitude: 40.730610,
        longitude: -73.935242,
    });
    marker.bindPopup('My Popup');
=========================================================================== */

/* global google, HTMLElement, Element, Text */
/* eslint-disable no-use-before-define */

import { LatLng } from './LatLng';
import Layer from './Layer';
import { Map } from './Map';
import { Marker } from './Marker';
import { Overlay } from './Overlay';
import { point, Point, PointValue } from './Point';
import { isObject, isObjectWithValues, isString, isStringWithValue } from './helpers';

export type PopupOptions = {
    // The popup wrapper class name
    className?: string;
    // The popup content
    content: string | Element | Text;
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
     * Whether to automatically close other open InfoWindows when opening this one
     *
     * @type {boolean}
     */
    private autoClose: boolean = true;

    /**
     * Holds if the Popup is open or not
     *
     * @type {boolean}
     */
    private isOpen: boolean = false;

    /**
     * The total offset from the element that includes the anchor point of the element (if it exists) and the overlay offset.
     * Markers have an anchor point, but polygons and polylines do not.
     *
     * @type {Point}
     */
    private popupOffset: Point;

    /**
     * Holds the position of the tooltip
     *
     * @type {LatLng}
     */
    private position: LatLng;

    /**
     * Whether clicking the thing that triggered the popup to open should also close the popup
     *
     * @type {boolean}
     */
    private toggleDisplay: boolean = true;

    /**
     * Constructor
     *
     * @param {PopupOptions} [options] The Popup options
     */
    constructor(options: PopupOptions) {
        super('popup');

        this.popupOffset = point(0, 0);
        if (isObject(options)) {
            this.setOptions(options);
        }
    }

    /**
     * Sets the options for the popup
     *
     * @param {PopupOptions} options Popup options
     */
    setOptions(options: PopupOptions) {
        if (isString(options.className)) {
            this.setClassName(options.className);
        }
        if (typeof options.offset !== 'undefined') {
            this.setOffset(options.offset);
        }

        this.setContent(options.content);
    }

    /**
     * Set the Popup content
     *
     * @param {string | HTMLElement | Element | Text} content The Popup content
     */
    setContent(content: string | HTMLElement | Element | Text) {
        if (isStringWithValue(content)) {
            this.overlay.innerHTML = content;
        } else if (content instanceof Element || content instanceof HTMLElement || content instanceof Text) {
            // First clear all existing children and their events
            while (this.overlay.firstChild) {
                this.overlay.removeChild(this.overlay.firstChild);
            }
            // Append the content as the first child
            this.overlay.appendChild(content);
        }
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
     * @param {Map | Marker} anchorOrMap The anchor object or map object.
     *      This should ideally be the Map or Marker object and not the Google maps object.
     *      If this is used internally then the Google maps object can be used.
     */
    open(anchorOrMap: Map | Marker) {
        const collection = PopupCollection.getInstance();
        if (collection.has(this) && this.isOpen) {
            if (this.toggleDisplay) {
                this.close();
            }
        } else {
            // Close other open Popups if necessary
            if (this.autoClose) {
                collection.closeOthers(this);
            }

            if (anchorOrMap instanceof Map) {
                this.popupOffset = this.getOffset().clone();
                this.setMap(anchorOrMap);
            } else if (anchorOrMap instanceof Marker) {
                this.position = anchorOrMap.getPosition();
                // If the anchor is a marker then add the anchor's anchorPoint to the offset.
                // The anchorPoint for the marker contains the x/y values to add to the marker's position that
                // an InfoWindow should be displayed at. This can also be used with our Popup.
                // We add the offset value for the Popup to the anchorPoint value.
                const m = anchorOrMap.get();
                const anchorPoint = m.get('anchorPoint');
                if (anchorPoint instanceof google.maps.Point) {
                    this.popupOffset = this.getOffset().add(anchorPoint.x, anchorPoint.y);
                } else {
                    this.popupOffset = this.getOffset().clone();
                }
                // Set the map value to display the popup and call the add() and draw() functions.
                this.setMap(anchorOrMap.getMap());
            }
            this.isOpen = true;
            collection.add(this);
        }
    }

    /**
     * Add the overlay to the map. Called once after setMap() is called on the overlay with a valid map.
     *
     * @param {google.maps.MapPanes} panes The Google maps panes object
     */
    add(panes: google.maps.MapPanes) {
        panes.floatPane.appendChild(this.overlay);
    }

    /**
     * Draw the overlay. Called when the overlay is being drawn or updated.
     *
     * @param {google.maps.MapCanvasProjection} projection The Google maps projection object
     */
    draw(projection: google.maps.MapCanvasProjection) {
        const divPosition = projection.fromLatLngToDivPixel(this.position.get())!;

        // Hide the tooltip when it is far out of view.
        const display = Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000 ? 'block' : 'none';

        if (display === 'block') {
            this.overlay.style.left = `${divPosition.x + this.popupOffset.getX()}px`;
            this.overlay.style.top = `${divPosition.y + this.popupOffset.getY()}px`;
        }

        if (this.overlay.style.display !== display) {
            this.overlay.style.display = display;
        }
    }

    /**
     * Close the popup
     */
    close() {
        this.hide();
        this.isOpen = false;
        PopupCollection.getInstance().remove(this);
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
 * To avoid circilar dependencies we need to add the bindPopup method to the Layer class here
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
     * @param {string | Element | Text | PopupValue} content The content for the Popup, or the Popup options object, or the Popup object
     * @param {PopupOptions} [options] The Popup options object
     */
    bindPopup(content: string | Element | Text | PopupValue, options?: PopupOptions) {
        if (content instanceof Popup) {
            this.layerPopup = content;
        } else if (isString(content) || content instanceof Element || content instanceof Text) {
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
                this.layerPopup.open(this);
            }
        });
    },
});

type PopupCollectionObject = {
    popups: Popup[];
    add(p: Popup): void;
    clear(): void;
    closeAll(): void;
    closeOthers(p: Popup): void;
    has(p: Popup): boolean;
    remove(p: Popup): void;
};

/**
 * Singleton class to hold the open Popups.
 * Usage:
 * const collection = PopupCollection.getInstance();
 * collection.add(popup);
 * collection.closeAll();
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
             * Closes all the Popups in the collection
             */
            closeAll() {
                this.popups.forEach((p: Popup) => {
                    p.close();
                });
            },
            /**
             * Close all the Popups in the collection except for the one passed in
             *
             * @param {Popup} p The Popup object to keep open
             */
            closeOthers(p: Popup) {
                this.popups.forEach((infoW: Popup) => {
                    if (infoW !== p) {
                        infoW.close();
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
