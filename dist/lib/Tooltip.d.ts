import { LatLngValue } from './LatLng';
import { Map } from './Map';
import { Marker } from './Marker';
import Overlay from './Overlay';
import { PointValue } from './Point';
type TooltipOptions = {
    className?: string;
    content?: string | HTMLElement | Text;
    map?: Map;
    offset?: PointValue;
    position?: LatLngValue;
};
/**
 * Tooltip class
 */
export declare class Tooltip extends Overlay {
    #private;
    /**
     * Constructor
     *
     * @param {TooltipOptions} [options] Tooltip options
     */
    constructor(options?: TooltipOptions);
    /**
     * Returns the content for the tooltip
     *
     * @returns {string|HTMLElement|Text}
     */
    get content(): string | HTMLElement | Text;
    /**
     * Set the content for the tooltip
     *
     * @param {string|HTMLElement|Text} content The content for the tooltip
     */
    set content(content: string | HTMLElement | Text);
    /**
     * Attach the tooltip to a map or marker
     *
     * The tooltip will be shown when hovering over the map or marker.
     *
     * @param {Map | Marker} element The element to attach the tooltip to
     * @returns {Tooltip}
     */
    attachTo(element: Map | Marker): Tooltip;
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
     * @param {string|HTMLElement} content The content for the tooltip
     * @returns {Tooltip}
     */
    setContent(content: string | HTMLElement): Tooltip;
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
