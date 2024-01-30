/* ===========================================================================
    Base class to help with drawing overlays on the map.

    https://developers.google.com/maps/documentation/javascript/customoverlays
=========================================================================== */

/* eslint-disable max-classes-per-file */

import { isObject } from './helpers';
import { Map } from './Map';
import { Point, point, PointValue } from './Point';

/**
 * Base class to help with drawing overlays on the map.
 *
 * The methods are purposely left blank so you can override them in your own class.
 * The methods are called from the OverlayView class in the draw(), onAdd(), and onRemove() methods.
 */
export class Overlay {
    /**
     * Holds the offset for the overlay
     */
    private offset: Point;

    /**
     * Holds the overlay HTML element. This is the container element that the
     * content for the overlay will get displayed in.
     * That could be a tooltip, a custom info window, or a map overlay.
     *
     * @type {HTMLElement}
     */
    overlay: HTMLElement;

    /**
     * Holds the overlay view class instance
     *
     * @type {google.maps.OverlayView}
     */
    overlayView: google.maps.OverlayView;

    /**
     * Constructor
     */
    constructor() {
        // Get the overlay view class
        // eslint-disable-next-line no-use-before-define
        this.overlayView = getOverlayViewClass(this);

        // Initialize the overlay element
        this.overlay = document.createElement('div');
        this.overlay.style.position = 'absolute';

        // Stops click, tap, drag, and wheel events on the element from bubbling up to the map.
        // This prevents map dragging and zooming, as well as map "click" events.
        google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.overlay);

        // Set the default offset
        this.offset = point(0, 0);
    }

    /**
     * Hide the overlay
     * @internal Intended to be called only by internal classes
     */
    hide() {
        this.overlayView.setMap(null);
    }

    /**
     * Set the class name(s) for the overlay element
     *
     * If you need multiple class names then separate them with a space.
     *
     * @param className The class name(s) to add to the tooltip.
     *    This can be a space separated list of class names.
     */
    setClassName(className: string) {
        const classes = className.split(' ');
        classes.forEach((cn) => {
            this.overlay.classList.add(cn.trim());
        });
    }

    /**
     * Removes a class name from the overlay element
     *
     * @param className The class name to remove from the overlay element
     */
    removeClassName(className: string) {
        const classes = className.split(' ');
        classes.forEach((cn) => {
            this.overlay.classList.remove(cn.trim());
        });
    }

    /**
     * Set the map object to display the overlay in
     *
     * @param {Map | google.maps.Map} map The Google maps map object or the Map object
     */
    setMap(map: Map | google.maps.Map) {
        if (map instanceof Map) {
            this.overlayView.setMap(map.get());
        } else if (map instanceof google.maps.Map) {
            this.overlayView.setMap(map);
        }
    }

    /**
     * Get the offset value
     *
     * @returns {Point}
     */
    getOffset(): Point {
        return this.offset;
    }

    /**
     * Set the x,y offset for the overlay
     *
     * This lets you have the offset show a certain number of pixels from it's lat/lng position.
     *
     * @param offset The offset value
     */
    setOffset(offset: PointValue) {
        this.offset = point(offset);
    }

    /**
     * Add the overlay to the map. Called once after setMap() is called on the overlay with a valid map.
     *
     * @param panes The Google maps panes object
     */
    add(panes: google.maps.MapPanes) {} // eslint-disable-line class-methods-use-this, @typescript-eslint/no-unused-vars

    /**
     * Draw the overlay. Called when the overlay is being drawn or updated.
     *
     * @param projection The Google maps projection object
     */
    draw(projection: google.maps.MapCanvasProjection) {} // eslint-disable-line class-methods-use-this, @typescript-eslint/no-unused-vars

    /**
     * Remove the overlay from the map.
     * This method is called once following a call to setMap(null).
     */
    remove() {
        if (this.overlay.parentElement) {
            this.overlay.parentElement.removeChild(this.overlay);
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
 * @param classObject The overlay class object
 * @returns {OverlayView}
 */
export const getOverlayViewClass = (classObject: Overlay) => {
    if (!isObject(google) || !isObject(google.maps)) {
        throw new Error(
            'Google maps not loaded. You must wait to run the overlay code until the Google map library is loaded.'
        );
    }
    /**
     * Basic overlay class to handle displaying the overlay
     */
    class OverlayView extends google.maps.OverlayView {
        /**
         * Holds the class instance for this overlay
         *
         * @type {Overlay}
         */
        overlay: Overlay;

        /**
         * Constructor
         *
         * @param overlay The overlay class instance
         */
        constructor(overlay: Overlay) {
            super();
            this.overlay = overlay;
        }

        /**
         * Called when the overlay is being drawn or updated. Use the position
         * from projection.fromLatLngToDivPixel() to correctly position the overlay
         * relative to the MapPanes. This method is called after onAdd(), and is
         * called on change of zoom or center.
         */
        draw() {
            this.overlay.draw(this.getProjection());
        }

        /**
         * Called once after setMap() is called with a valid map. At this point,
         * panes and projection will have been initialized. Used to initialize the overlay DOM elements.
         */
        onAdd() {
            this.overlay.add(this.getPanes()!);
        }

        /**
         * This method is called once following a call to setMap(null).
         * Used to remove the overlay from the map.
         */
        onRemove() {
            this.overlay.remove();
        }
    }
    return new OverlayView(classObject);
};
