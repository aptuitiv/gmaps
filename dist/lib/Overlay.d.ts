/// <reference types="google.maps" />
import { Map } from './Map';
/**
 * Base class to help with drawing overlays on the map.
 *
 * The methods are purposely left blank so you can override them in your own class.
 * The methods are called from the OverlayView class in the draw(), onAdd(), and onRemove() methods.
 */
export declare class Overlay {
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
    constructor();
    /**
     * Set the class name(s) for the overlay element
     *
     * If you need multiple class names then separate them with a space.
     *
     * @param className The class name(s) to add to the tooltip.
     *    This can be a space separated list of class names.
     */
    setClassName(className: string): void;
    /**
     * Removes a class name from the overlay element
     *
     * @param className The class name to remove from the overlay element
     */
    removeClassName(className: string): void;
    /**
     * Set the map object to display the overlay in
     *
     * @param {Map | google.maps.Map} map The Google maps map object or the Map object
     */
    setMap(map: Map | google.maps.Map): void;
    /**
     * Add the overlay to the map. Called once after setMap() is called on the overlay with a valid map.
     *
     * @param panes The Google maps panes object
     */
    add(panes: google.maps.MapPanes): void;
    /**
     * Draw the overlay. Called when the overlay is being drawn or updated.
     *
     * @param projection The Google maps projection object
     */
    draw(projection: google.maps.MapCanvasProjection): void;
    /**
     * Remove the overlay from the map.
     * This method is called once following a call to setMap(null).
     */
    remove(): void;
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
export declare const getOverlayViewClass: (classObject: Overlay) => {
    /**
     * Holds the class instance for this overlay
     *
     * @type {Overlay}
     */
    overlay: Overlay;
    /**
     * Called when the overlay is being drawn or updated. Use the position
     * from projection.fromLatLngToDivPixel() to correctly position the overlay
     * relative to the MapPanes. This method is called after onAdd(), and is
     * called on change of zoom or center.
     */
    draw(): void;
    /**
     * Called once after setMap() is called with a valid map. At this point,
     * panes and projection will have been initialized. Used to initialize the overlay DOM elements.
     */
    onAdd(): void;
    /**
     * This method is called once following a call to setMap(null).
     * Used to remove the overlay from the map.
     */
    onRemove(): void;
    getMap(): google.maps.Map | google.maps.StreetViewPanorama;
    getPanes(): google.maps.MapPanes;
    getProjection(): google.maps.MapCanvasProjection;
    setMap(map: google.maps.Map | google.maps.StreetViewPanorama): void;
    addListener(eventName: string, handler: Function): google.maps.MapsEventListener;
    bindTo(key: string, target: google.maps.MVCObject, targetKey?: string, noNotify?: boolean): void;
    get(key: string): any;
    notify(key: string): void;
    set(key: string, value: unknown): void;
    setValues(values?: object): void;
    unbind(key: string): void;
    unbindAll(): void;
};
