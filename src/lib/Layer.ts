/* ===========================================================================
    Base class to help with drawing stuff on the map.
=========================================================================== */

/* global google */

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
        return this.map;
    }

    /**
     * Returns the Google maps object that this layer is assigned to.
     *
     * If it's not assigned to a map, it returns null.
     *
     * @returns {google.maps.Map|null}
     */
    getGoogleMap(): google.maps.Map | null {
        if (this.map instanceof Map) {
            return this.map.get();
        }
        return null;
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
