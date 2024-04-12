/* ===========================================================================
    Base class to help with drawing stuff on the map.
=========================================================================== */

import { Evented } from './Evented';
import { Map } from './Map';
import {} from './helpers';

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
    }
}

export default Layer;
