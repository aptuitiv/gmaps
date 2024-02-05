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
     * Holds the Map object that the layer is added to
     *
     * @type {Map|null}
     */
    private map: Map | null = null;

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
     */
    removeMap(): void {
        this.map = null;
    }

    /**
     * Sets the map object that the layer is added to
     *
     * @param {Map} map The map object to add the layer to
     */
    setMap(map: Map | null) {
        this.map = map;
    }
}

export default Layer;
