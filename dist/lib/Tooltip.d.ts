/// <reference types="google.maps" />
import { Overlay } from './Overlay';
type TooltipOptions = {
    className?: string;
    container?: HTMLElement | string;
    content?: string;
};
/**
 * Tooltip class
 */
declare class Tooltip extends Overlay {
    /**
     * Holds the tooltip content.
     * This can be a simple string of text, or string of HTML code.
     *
     * @type {string}
     */
    private content;
    /**
     * Holds the position of the tooltip
     *
     * @type {google.maps.LatLng}
     */
    private position;
    /**
     * Holds the tooltip HTML element
     *
     * @type {HTMLElement}
     */
    private tooltip;
    /**
     * Constructor
     *
     * @param {TooltipOptions} [options] Tooltip options
     */
    constructor(options?: TooltipOptions);
    /**
     * Sets the options for the tooltip
     *
     * @param {TooltipOptions} options Tooltip options
     */
    setOptions(options: TooltipOptions): void;
    /**
     * Returns whether the tooltip already has content
     *
     * @returns {boolean}
     */
    hasContent(): boolean;
    /**
     * Set the content for the tooltip
     *
     * @param content The content for the tooltip
     */
    setContent(content: string): void;
    /**
     * Hide the tooltip
     */
    hide(): void;
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
export type TooltipValue = Tooltip | TooltipOptions;
/**
 * Helper function to set up the tooltip object
 *
 * @param {TooltipOptions} [options] The tooltip options or the tooltip class
 * @returns {Tooltip}
 */
export declare const tooltip: (options?: TooltipValue) => Tooltip;
export {};
