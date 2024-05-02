/* ===========================================================================
    Base class to help with drawing stuff on the map.

    See https://aptuitiv.github.io/gmaps-docs/api-reference/base-classes/layer
    for documentation.
=========================================================================== */

import { Evented } from './Evented';
import { Map } from './Map';
import { TooltipValue } from './Tooltip';

/**
 * Base class to help with drawing stuff on the map.
 *
 * Other classes, like InfoWindow add functionality to this class with the include() method.
 */
class Layer extends Evented {
    /**
     * This is an index signature so that Typescript does't complain about adding properties
     * to the class via mixins.
     *
     * For example, this lets us use attachTooltip() in the Marker class even though attachTooltip()
     * is applied to the layer via the Tooltip mixin.
     */
    [x: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any

    /**
     * Holds if the layer is visible or not
     *
     * @private
     * @type {boolean}
     */
    #isVisible: boolean = false;

    /**
     * Holds the Map object that the layer is added to
     *
     * @private
     * @type {Map|null}
     */
    #map: Map | null = null;

    /**
     * Holds the tooltip object to show when hovering over the marker
     *
     * This is here so that the tooltip can be added to the map container when the marker is added to the map.
     *
     * @private
     * @type {TooltipValue}
     */
    #tooltip: TooltipValue;

    /**
     * Get if the layer is visible or not
     *
     * @returns {boolean}
     */
    get isVisible(): boolean {
        return this.#isVisible;
    }

    /**
     * Set if the layer is visible or not
     *
     * @param {boolean} value Whether the layer is visible or not
     */
    set isVisible(value: boolean) {
        if (typeof value === 'boolean') {
            this.#isVisible = value;
        } else {
            throw new Error('isVisible must be a boolean');
        }
    }

    /**
     * Return the Map object or null if the Map object is not set
     *
     * @returns {Map|null}
     */
    getMap(): Map | null {
        return this.#map;
    }

    /**
     * Return if the layer has a Map object set
     *
     * @returns {boolean}
     */
    hasMap(): boolean {
        return this.#map !== null;
    }

    /**
     * Initialize the layer
     *
     * This is intended to be overridden by subclasses to perform any initialization that is needed.
     * This is not intended to be called outside of this library.
     *
     * This is called by other objects that depend on the element being initialized before doing their thing.
     * For example, attaching a tooltip to a marker will wait for the marker to be initialized before attaching the tooltip.
     *
     * @internal
     * @returns {Promise<void>}
     */
    // eslint-disable-next-line class-methods-use-this -- This is intended to be overridden by subclasses
    init(): Promise<void> {
        return Promise.resolve();
    }

    /**
     * Clears the map object that the layer is added to
     *
     * Note, this does not remove the layer from the map, it just clears the map object from the layer.
     */
    removeMap() {
        this.#map = null;
    }

    /**
     * Sets the map object that the layer is added to
     *
     * This does not display the layer on the map, it only sets the map object for the layer.
     *
     * @param {Map} map The map object to add the layer to
     */
    setMap(map: Map | null) {
        this.#map = map;
        if (map) {
            this.isVisible = true;
            this.#setupTooltip();
        } else {
            this.isVisible = false;
        }
    }

    /**
     * Set the tooltip object to set up when the layer is added to the map
     *
     * This is intended to be used to hold on to the tooltip value so that it can be added
     * when the layer is added to the map. This is not intended to be called outside of this library.
     * This is useful when a marker isn't assigned to a map yet, or when the tooltip is set before the marker is added to the map.
     *
     * @internal
     * @param {TooltipValue} tooltip The tooltip object to show when hovering over the layer
     */
    setTooltip(tooltip: TooltipValue) {
        this.#tooltip = tooltip;
    }

    /**
     * Attach the tooltip to the layer
     *
     * @private
     */
    #setupTooltip() {
        if (this.#tooltip) {
            this.attachTooltip(this.#tooltip);
        }
    }
}

export default Layer;
