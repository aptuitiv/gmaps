import { Evented } from './Evented';
import { Map } from './Map';
/**
 * Base class to help with drawing stuff on the map.
 *
 * Other classes, like InfoWindow add functionality to this class with the include() method.
 */
declare class Layer extends Evented {
    #private;
    /**
     * Return the Map object or null if the Map object is not set
     *
     * @returns {Map|null}
     */
    getMap(): Map | null;
    /**
     * Clears the map object that the layer is added to
     *
     * Note, this does not remove the layer from the map, it just clears the map object from the layer.
     */
    removeMap(): void;
    /**
     * Sets the map object that the layer is added to
     *
     * This does not display the layer on the map, it only sets the map object for the layer.
     *
     * @param {Map} map The map object to add the layer to
     */
    setMap(map: Map | null): void;
}
export default Layer;
