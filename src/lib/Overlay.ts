/* ===========================================================================
    Base class to help with drawing overlays on the map.

    https://developers.google.com/maps/documentation/javascript/customoverlays
=========================================================================== */

/* global google, HTMLElement, OverlayView */
/* eslint-disable max-classes-per-file */

import { loader } from './Loader';
import { latLng, LatLng, LatLngValue } from './LatLng';
import Layer from './Layer';
import { Map } from './Map';
import { Point, point, PointValue } from './Point';
import { checkForGoogleMaps, isNullOrUndefined, isObject, isString } from './helpers';

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
     * That could be a tooltip, a custom info window (popup), or a map overlay.
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
     * Holds the position of the overlay
     *
     * @private
     * @type {LatLng}
     */
    #position: LatLng;

    /**
     * Constructor
     *
     * @param {string} objectType The object type for the class
     * @param {string} testObject The object that needs Google maps. This should be the name of the object that calls this method.
     * @param {string} [testLibrary] An optional Google maps library class to check for. This needs to be part of the google.maps object.
     */
    constructor(objectType: string, testObject: string, testLibrary?: string) {
        super(objectType, testObject, testLibrary || 'OverlayView');

        // Initialize the overlay element
        this.#overlay = document.createElement('div');
        this.#overlay.style.position = 'absolute';

        // Set the default offset
        this.setOffset([0, 0]);
    }

    /**
     * Get the class name for the overlay element
     *
     * @returns {string}
     */
    get className(): string {
        return this.#overlay.className;
    }

    /**
     * Set the class name(s) for the overlay element
     *
     * If you need multiple class names then separate them with a space.
     *
     * @param {string} className The class name(s) to add to the overlay.
     *    This can be a space separated list of class names.
     */
    set className(className: string) {
        if (isString(className)) {
            const classes = className.split(' ');
            classes.forEach((cn) => {
                this.#overlay.classList.add(cn.trim());
            });
        } else if (isNullOrUndefined(className)) {
            this.#overlay.className = '';
        }
    }

    /**
     * Returns the position of the overlay
     *
     * @returns {LatLng}
     */
    get position(): LatLng {
        return this.#position;
    }

    /**
     * Set the position of the overlay
     *
     * @param {LatLngValue} value The position of the overlay
     */
    set position(value: LatLngValue) {
        const position = latLng(value);
        if (position.isValid()) {
            this.#position = position;
        } else if (isNullOrUndefined(value)) {
            this.#position = undefined;
        }
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
     * Get the overlay HTML element
     *
     * @returns {HTMLElement}
     */
    getOverlayElement(): HTMLElement {
        return this.#overlay;
    }

    /**
     * Get the position of the overlay
     *
     * @returns {LatLng}
     */
    getPosition(): LatLng {
        return this.position;
    }

    /**
     * Returns whether the overlay has a position
     *
     * @returns {boolean}
     */
    hasPosition(): boolean {
        return this.#position instanceof LatLng;
    }

    /**
     * Hide the overlay
     *
     * @returns {Overlay}
     */
    hide(): Overlay {
        if (this.#overlayView) {
            this.#overlayView.setMap(null);
            this.removeMap();
        }
        return this;
    }

    /**
     * Removes a class name from the overlay element
     *
     * @param {string} className The class name to remove from the overlay element
     * @returns {Overlay}
     */
    removeClassName(className: string): Overlay {
        const classes = className.split(' ');
        classes.forEach((cn) => {
            this.#overlay.classList.remove(cn.trim());
        });
        return this;
    }

    /**
     * Set the class name(s) for the overlay element
     *
     * If you need multiple class names then separate them with a space.
     *
     * @param {string} className The class name(s) to add to the overlay.
     *    This can be a space separated list of class names.
     * @returns {Overlay}
     */
    setClassName(className: string): Overlay {
        this.className = className;
        return this;
    }

    /**
     * Set the map object to display the overlay in
     *
     * @param {Map} map The Map object
     * @returns {Overlay}
     */
    setMap(map: Map): Overlay {
        if (map instanceof Map) {
            this.#setupGoogleOverlay();
            if (this.#overlayView) {
                this.#overlayView.setMap(map.toGoogle());
            } else {
                // The Google maps library isn't loaded yet. Wait for it to load.
                loader().once('map_loaded', () => {
                    this.#setupGoogleOverlay();
                    if (this.#overlayView) {
                        this.#overlayView.setMap(map.toGoogle());
                    }
                });
            }
            super.setMap(map);
        }
        return this;
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
     * Set the position of the overlay
     *
     * @param {LatLngValue} position The latitude/longitude position of where the overlay should show
     * @returns {Overlay}
     */
    setPosition(position: LatLngValue): Overlay {
        this.position = position;
        return this;
    }

    /**
     * Add the overlay to the map.
     *
     * Alias for setMap()
     *
     * @param {Map} map The Map object
     * @returns {Overlay}
     */
    show(map: Map): Overlay {
        return this.setMap(map);
    }

    /**
     * Set up the Google maps overlay object if necessary
     *
     * @private
     */
    #setupGoogleOverlay() {
        if (!isObject(this.#overlayView)) {
            if (checkForGoogleMaps('Overlay', 'OverlayView', false)) {
                // Get the overlay view class
                // eslint-disable-next-line no-use-before-define
                this.#overlayView = getOverlayViewClass(this);

                // Stops click, tap, drag, and wheel events on the element from bubbling up to the map.
                // This prevents map dragging and zooming, as well as map "click" events.
                google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.#overlay);
            }
        }
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
