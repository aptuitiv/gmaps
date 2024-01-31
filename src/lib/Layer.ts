/* ===========================================================================
    Base class to help with drawing stuff on the map.
=========================================================================== */

import { Evented } from './Evented';
import {} from './helpers';

/**
 * Base class to help with drawing stuff on the map.
 *
 * Other classes, like InfoWindow add functionality to this class with the include() method.
 */
class Layer extends Evented {
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
}

export default Layer;
