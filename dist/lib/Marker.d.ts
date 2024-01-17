import { LatLngValue } from './LatLng';
import { Map } from './Map';
export type MarkerOptions = {
    title?: string;
};
export declare class Marker {
    private latLng;
    private marker;
    constructor(latLng: LatLngValue, config?: MarkerOptions);
    addTo(map: Map): void;
}
/**
 * Helper function to set up the marker object
 *
 * @param {LatLngValue} latLng The latitude/longitude pair
 * @param {MarkerOptions} config The marker configuration
 * @returns {Marker}
 */
export declare const marker: (latLng: LatLngValue, config: MarkerOptions) => Marker;
