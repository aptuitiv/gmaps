/* ===========================================================================
    Enables building and managing markers
=========================================================================== */

import { LatLng, LatLngValue } from './LatLng';
import { Map } from './Map';

export type MarkerConfig = {
  title?: string;
};

export class Marker {
  private latLng: LatLng;

  private marker: google.maps.Marker;

  constructor(latLng: LatLngValue, config?: MarkerConfig) {
    if (latLng instanceof LatLng) {
      this.latLng = latLng;
    } else {
      this.latLng = new LatLng(latLng);
    }

    this.marker = new google.maps.Marker({
      position: this.latLng.toJson(),
      title: config?.title,
    });
  }

  addTo(map: Map): void {
    this.marker.setMap(map.get());
  }
}

/**
 * Helper function to set up the marker object
 *
 * @param {LatLngValue} latLng The latitude/longitude pair
 * @param {MarkerConfig} config The marker configuration
 * @returns {Marker}
 */
export const marker = (latLng: LatLngValue, config: MarkerConfig): Marker => new Marker(latLng, config);
