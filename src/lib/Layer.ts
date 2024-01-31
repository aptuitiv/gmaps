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
     * @type {Map}
     */
    private map: Map;

    /**
     * Get the Google maps object that this layer represents.
     *
     * The classes that extend the layer should override this method and return the appropriate Google maps object.
     * For example, the Marker class should return a google.maps.Marker object.
     *
     * @returns {google.maps.MVCObject}
     */
    // eslint-disable-next-line class-methods-use-this
    get(): google.maps.MVCObject {
        return new google.maps.MVCObject();
    }

    /**
     * Sets the map object that the layer is added to
     * @param {Map} map The map object to add the layer to
     */
    setMap(map: Map) {
        this.map = map;
    }
}

export default Layer;
