/* ===========================================================================
    Main class to hold the map object and set it up
=========================================================================== */

import { Loader } from '@googlemaps/js-api-loader';

export type InitConfig = {
  apiKey: string;
  latitude: number;
  longitude: number;
  version?: string;
  zoom?: number;
};

/**
 * The map class
 */
export class Map {
  private map: google.maps.Map;

  constructor(id: string, configuration: InitConfig) {
    // Default map configuration
    const defaultConfig = {
      zoom: 8,
    };
    const config = { ...defaultConfig, ...configuration };

    // Set up the Google maps loader
    // https://www.npmjs.com/package/@googlemaps/js-api-loader
    const loader = new Loader({
      apiKey: config.apiKey,
      libraries: ['places'],
      version: config.version ?? 'weekly',
    });

    loader
      .importLibrary('maps')
      .then((google) => {
        this.map = new google.Map(document.getElementById(id) as HTMLElement, {
          center: {
            lat: config.latitude,
            lng: config.longitude,
          },
          zoom: config.zoom,
        });
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
      });
  }
}
