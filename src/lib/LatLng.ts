/* ===========================================================================
    LatLng - A class for representing a latitude/longitude pair
=========================================================================== */

import { isNumber, isNumberString, isObject } from './test-types';

// The object literal for a latitude/longitude pair.
// Example: `{lat: 32.33, lng: -64.45}`
type LatLngLiteral = {
  lat: number;
  lng: number;
};

// The possible types of latitude values
export type Latitude = number | number[] | LatLngLiteral;

/**
 * The LatLng class to set up and manage latitude/longitude pairs
 */
export class LatLng {
  /**
   * Holds the latitude
   */
  latitude: number;

  /**
   * Holds the longitude
   */
  longitude: number;

  /**
   * Constructor
   *
   * @param {Latitude} latitude The latitude value or the latitude/longitude pair
   * @param {number} [longitude] The longitude value
   */
  constructor(latitude: Latitude, longitude?: number) {
    if (Array.isArray(latitude)) {
      if (
        (isNumber(latitude[0]) || isNumberString(latitude[0]))
        && (isNumber(latitude[1]) || isNumberString(latitude[1]))
      ) {
        if (isNumberString(latitude[0])) {
          this.latitude = Number(latitude[0]);
        } else {
          [this.latitude] = latitude;
        }
        if (isNumberString(latitude[1])) {
          this.longitude = Number(latitude[1]);
        } else {
          this.longitude = latitude.pop();
        }
      } else {
        throw new Error('Invalid latitude/longitude pair');
      }
    } else if (isObject(latitude)) {
      const latObject: LatLngLiteral = latitude as unknown as LatLngLiteral;
      if (
        typeof latObject.lat === 'undefined'
        || !isNumber(latObject.lat)
        || !isNumberString(latObject.lat)
        || typeof latObject.lng === 'undefined'
        || !isNumber(latObject.lng)
        || !isNumberString(latObject.lng)
      ) {
        throw new Error('Invalid latitude/longitude pair');
      }
      if (isNumberString(latObject.lat)) {
        this.latitude = Number(latObject.lat);
      } else {
        this.latitude = latObject.lat;
      }
      if (isNumberString(latObject.lng)) {
        this.longitude = Number(latObject.lng);
      } else {
        this.longitude = latObject.lng;
      }
    } else {
      if (isNumberString(latitude)) {
        this.latitude = Number(latitude);
      } else {
        this.latitude = latitude;
      }
      if (isNumberString(longitude)) {
        this.longitude = Number(longitude);
      } else {
        this.longitude = longitude;
      }
    }
  }

  /**
   * Returns the longitude value
   *
   * @returns {number}
   */
  lat(): number {
    return this.latitude;
  }

  /**
   * Returns the latitude value
   *
   * @returns {number}
   */
  lng(): number {
    return this.longitude;
  }

  /**
   * Converts the latitude/longitude pair to a JSON object
   *
   * @returns {LatLngLiteral}
   */
  toJson(): LatLngLiteral {
    return {
      lat: this.latitude,
      lng: this.longitude,
    };
  }
}

// The possible types of latitude/longitude pair values
export type LatLngValue = number[] | LatLngLiteral | LatLng;

/**
 * Helper function to set up a new LatLng object value
 *
 * @param {Latitude} latitude The latitude value or the latitude/longitude pair
 * @param {number} [longitude] The longitude value
 * @returns {LatLng}
 */
export const latLng = (latitude: Latitude, longitude?: number): LatLng => new LatLng(latitude, longitude);
