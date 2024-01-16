import { LatLngValue } from './LatLng';
import { Map } from './Map';
export type MarkerConfig = {
    title?: string;
};
export declare class Marker {
    private latLng;
    private marker;
    constructor(latLng: LatLngValue, config?: MarkerConfig);
    addTo(map: Map): void;
}
/**
 * Helper function to set up the marker object
 *
 * @param {LatLngValue} latLng The latitude/longitude pair
 * @param {MarkerConfig} config The marker configuration
 * @returns {Marker}
 */
export declare const marker: (latLng: LatLngValue, config: MarkerConfig) => Marker;
