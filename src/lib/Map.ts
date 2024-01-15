/* ===========================================================================
    Main class to hold the map object and set it up
=========================================================================== */

import { Loader, Libraries } from '@googlemaps/js-api-loader';

export type InitConfig = {
  apiKey: string;
  latitude: number;
  libraries?: Libraries;
  longitude: number;
  version?: string;
  zoom?: number;
};

/**
 * The map class
 */
export class Map {
  /**
   * Holds the Google Maps API key
   */
  private apiKey: string;

  /**
   * Holds the id of the element that the map will be rendered in
   */
  private id: string;

  /**
   * Holds the libraries to load with Google maps
   */
  private libraries: Libraries;

  /**
   * Holds the Google map object
   */
  private map: google.maps.Map;

  /**
   * Holds the configuration object for the Google maps object
   */
  private mapConfig: google.maps.MapOptions;

  /**
   * Holds the version of the Google Maps API to load
   */
  private version: string;

  /**
   * Class constructor
   *
   * @param {string} id The id of the element that the map will be rendered in
   * @param {InitConfig} configuration The configuration object for the map
   */
  constructor(id: string, configuration: InitConfig) {
    this.id = id;
    this.apiKey = configuration.apiKey;
    this.libraries = configuration.libraries ?? ['places'];
    this.version = configuration.version ?? 'weekly';

    // Default map configuration
    const defaultConfig = {
      zoom: 8,
    };
    const config = { ...defaultConfig, ...configuration };
    delete config.apiKey;
    delete config.libraries;
    delete config.version;

    this.mapConfig = {
      center: {
        lat: config.latitude,
        lng: config.longitude,
      },
      rotateControl: true,
      zoom: config.zoom,
    };
  }

  /**
   * Load and display the map
   */
  load(callback?: () => void) {
    // Set up the Google maps loader
    // https://www.npmjs.com/package/@googlemaps/js-api-loader
    const loader = new Loader({
      apiKey: this.apiKey,
      libraries: this.libraries,
      version: this.version,
    });

    loader
      .importLibrary('maps')
      .then((google) => {
        this.map = new google.Map(
          document.getElementById(this.id) as HTMLElement,
          this.mapConfig,
        );
        if (typeof callback === 'function') {
          callback();
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
      });
  }
}
