/* ===========================================================================
    Base class to help with drawing overlays on the map.

    https://developers.google.com/maps/documentation/javascript/customoverlays
=========================================================================== */

/* global google, HTMLElement, OverlayView */
/* eslint-disable max-classes-per-file */

import Layer from './Layer';
import { Map } from './Map';
import { Point, point, PointValue } from './Point';
import { checkForGoogleMaps } from './helpers';

/**
 * Base class to help with drawing overlays on the map.
 *
 * The methods are purposely left blank so you can override them in your own class.
 * The methods are called from the OverlayView class in the draw(), onAdd(), and onRemove() methods.
 */
class Overlay extends Layer {
    /**
     * Holds the offset for the overlay
     *
     * @private
     * @type {Point}
     */
    #offset: Point;

    /**
     * Holds the overlay HTML element. This is the container element that the
     * content for the overlay will get displayed in.
     * That could be a tooltip, a custom info window, or a map overlay.
     *
     * private
     *
     * @type {HTMLElement}
     */
    #overlay: HTMLElement;

    /**
     * Holds the overlay view class instance
     *
     * @private
     * @type {google.maps.OverlayView}
     */
    #overlayView: google.maps.OverlayView;

    /**
     * Constructor
     *
     * @param {string} objectType The object type for the class
     * @param {string} testObject The object that needs Google maps. This should be the name of the object that calls this method.
     * @param {string} [testLibrary] An optional Google maps library class to check for. This needs to be part of the google.maps object.
     */
    constructor(objectType: string, testObject: string, testLibrary?: string) {
        super(objectType, testObject, testLibrary || 'OverlayView');
        // Get the overlay view class
        // eslint-disable-next-line no-use-before-define
        this.#overlayView = getOverlayViewClass(this);

        // Initialize the overlay element
        this.#overlay = document.createElement('div');
        this.#overlay.style.position = 'absolute';

        // Stops click, tap, drag, and wheel events on the element from bubbling up to the map.
        // This prevents map dragging and zooming, as well as map "click" events.
        google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.#overlay);

        // Set the default offset
        this.#offset = point(0, 0);
    }

    /**
     * Get the overlay HTML element
     *
     * @returns {HTMLElement}
     */
    getOverlayElement(): HTMLElement {
        return this.#overlay;
    }

    /**
     * Hide the overlay
     *
     * @internal
     */
    hide() {
        this.#overlayView.setMap(null);
        this.removeMap();
    }

    /**
     * Set the class name(s) for the overlay element
     *
     * If you need multiple class names then separate them with a space.
     *
     * @param {string} className The class name(s) to add to the tooltip.
     *    This can be a space separated list of class names.
     */
    setClassName(className: string) {
        const classes = className.split(' ');
        classes.forEach((cn) => {
            this.#overlay.classList.add(cn.trim());
        });
    }

    /**
     * Removes a class name from the overlay element
     *
     * @param {string} className The class name to remove from the overlay element
     */
    removeClassName(className: string) {
        const classes = className.split(' ');
        classes.forEach((cn) => {
            this.#overlay.classList.remove(cn.trim());
        });
    }

    /**
     * Set the map object to display the overlay in
     *
     * @param {Map} map The Map object
     */
    setMap(map: Map) {
        if (map instanceof Map) {
            this.#overlayView.setMap(map.toGoogle());
            super.setMap(map);
        }
    }

    /**
     * Add the overlay to the map.
     *
     * Alias for setMap()
     *
     * @param {Map} map The Map object
     */
    show(map: Map) {
        this.setMap(map);
    }

    /**
     * Get the offset value
     *
     * @returns {Point}
     */
    getOffset(): Point {
        return this.#offset;
    }

    /**
     * Set the x,y offset for the overlay
     *
     * This lets you have the offset show a certain number of pixels from it's lat/lng position.
     *
     * @param {PointValue} offset The offset value
     */
    setOffset(offset: PointValue) {
        this.#offset = point(offset);
    }

    /**
     * Add the overlay to the map. Called once after setMap() is called on the overlay with a valid map.
     *
     * This is called by the internal OverlayView class. It should not be called directly.
     *
     * @internal
     * @param {google.maps.MapPanes} panes The Google maps panes object
     */
    add(panes: google.maps.MapPanes) {} // eslint-disable-line class-methods-use-this, @typescript-eslint/no-unused-vars

    /**
     * Draw the overlay. Called when the overlay is being drawn or updated.
     *
     * This is called by the internal OverlayView class. It should not be called directly.
     *
     * @internal
     * @param {google.maps.MapCanvasProjection} projection The Google maps projection object
     */
    draw(projection: google.maps.MapCanvasProjection) {} // eslint-disable-line class-methods-use-this, @typescript-eslint/no-unused-vars

    /**
     * Remove the overlay from the map.
     * This method is called once following a call to setMap(null).
     *
     * This is called by the internal OverlayView class. It should not be called directly.
     *
     * @internal
     */
    remove() {
        if (this.#overlay.parentElement) {
            this.#overlay.parentElement.removeChild(this.#overlay);
        }
    }
}

/**
 * Gets the overlay view class object
 *
 * Because the Google maps library may not be loaded yet, we need to check for it.
 * We can't simply extend the google.maps.OverlayView class because it may not exist
 * when this code is loaded. This ensures that it exists.
 *
 * @param {Overlay} classObject The overlay class object
 * @returns {OverlayView}
 */
const getOverlayViewClass = (classObject: Overlay) => {
    checkForGoogleMaps('Overlay', 'OverlayView');
    /**
     * Basic overlay class to handle displaying the overlay
     */
    class OverlayView extends google.maps.OverlayView {
        /**
         * Holds the class instance for this overlay
         *
         * @private
         * @type {Overlay}
         */
        #overlay: Overlay;

        /**
         * Constructor
         *
         * @param {Overlay} overlay The overlay class instance
         */
        constructor(overlay: Overlay) {
            super();
            this.#overlay = overlay;
        }

        /**
         * Called when the overlay is being drawn or updated. Use the position
         * from projection.fromLatLngToDivPixel() to correctly position the overlay
         * relative to the MapPanes. This method is called after onAdd(), and is
         * called on change of zoom or center.
         */
        draw() {
            this.#overlay.draw(this.getProjection());
        }

        /**
         * Called once after setMap() is called with a valid map. At this point,
         * panes and projection will have been initialized. Used to initialize the overlay DOM elements.
         */
        onAdd() {
            this.#overlay.add(this.getPanes()!);
        }

        /**
         * This method is called once following a call to setMap(null).
         * Used to remove the overlay from the map.
         */
        onRemove() {
            this.#overlay.remove();
        }
    }
    return new OverlayView(classObject);
};

export default Overlay;
