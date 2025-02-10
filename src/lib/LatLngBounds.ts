/* ===========================================================================
    A LatLngBounds instance represents a rectangle in geographical coordinates,
    including one that crosses the 180 degrees longitudinal meridian.
    https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds

    See https://aptuitiv.github.io/gmaps-docs/api-reference/utilities/latlng-bounds for documentation.
=========================================================================== */

/* global google */

import Base from './Base';
import { checkForGoogleMaps, isNumber, isObject, isObjectWithValues } from './helpers';
import { latLng, latLngConvert, LatLng, LatLngValue } from './LatLng';
import { loader } from './Loader';

// This is the same as the Google Maps LatLngBoundsLiteral type
export type LatLngBoundsLiteral = {
    /**
     * East longitude in degrees. Values outside the range [-180, 180] will be
     * wrapped to the range [-180, 180). For example, a value of -190 will be
     * converted to 170. A value of 190 will be converted to -170. This reflects
     * the fact that longitudes wrap around the globe.
     */
    east: number;
    /**
     * North latitude in degrees. Values will be clamped to the range [-90, 90].
     * This means that if the value specified is less than -90, it will be set
     * to -90. And if the value is greater than 90, it will be set to 90.
     */
    north: number;
    /**
     * South latitude in degrees. Values will be clamped to the range [-90, 90].
     * This means that if the value specified is less than -90, it will be set
     * to -90. And if the value is greater than 90, it will be set to 90.
     */
    south: number;
    /**
     * West longitude in degrees. Values outside the range [-180, 180] will be
     * wrapped to the range [-180, 180). For example, a value of -190 will be
     * converted to 170. A value of 190 will be converted to -170. This reflects
     * the fact that longitudes wrap around the globe.
     */
    west: number;
};

// This lets you set a LatLng bounds object using the north-east and south-west corners
export type LatLngBoundsEdges = {
    ne: LatLngValue;
    sw: LatLngValue;
};

/**
 * The LatLngBounds class to set up and manage latitude/longitude bounds
 */
export class LatLngBounds extends Base {
    /**
     * Holds the Google maps LatLngBounds object
     */
    #bounds: google.maps.LatLngBounds;

    /**
     * Holds the values to extend the bounds with
     *
     * This is used to set up the Google Maps LatLngBounds object when the Google Maps object is loaded.
     *
     * @private
     * @type {LatLng[]}
     */
    #boundValues: LatLng[] = [];

    /**
     * Holds the north-east corner of the LatLngBounds
     *
     * @private
     * @type {LatLng}
     */
    #northEast: LatLng;

    /**
     * Holds the south-west corner of the LatLngBounds
     *
     * @private
     * @type {LatLng}
     */
    #southWest: LatLng;

    /**
     * Constructor
     *
     * @param {LatLngValue | LatLngValue[]} [latLngValue] The latitude/longitude value(s). If not set then add points with the extend method.
     *      See comments on the extended method for the types of values that latLngValue can be.
     */
    constructor(latLngValue?: LatLngValue | LatLngValue[] | LatLngBoundsEdges | LatLngBoundsLiteral) {
        super('latlngbounds');
        if (latLngValue) {
            if (isObjectWithValues(latLngValue)) {
                if (
                    typeof (latLngValue as LatLngBoundsEdges).ne !== 'undefined' &&
                    typeof (latLngValue as LatLngBoundsEdges).sw !== 'undefined'
                ) {
                    const ne = latLng((latLngValue as LatLngBoundsEdges).ne);
                    if (ne.isValid()) {
                        this.#northEast = ne;
                    }
                    const sw = latLng((latLngValue as LatLngBoundsEdges).sw);
                    if (sw.isValid()) {
                        this.#southWest = sw;
                    }
                } else if (
                    typeof (latLngValue as LatLngBoundsLiteral).north !== 'undefined' &&
                    typeof (latLngValue as LatLngBoundsLiteral).south !== 'undefined' &&
                    typeof (latLngValue as LatLngBoundsLiteral).east !== 'undefined' &&
                    typeof (latLngValue as LatLngBoundsLiteral).west !== 'undefined'
                ) {
                    const ne = latLng([
                        (latLngValue as LatLngBoundsLiteral).north,
                        (latLngValue as LatLngBoundsLiteral).east,
                    ]);
                    const sw = latLng([
                        (latLngValue as LatLngBoundsLiteral).south,
                        (latLngValue as LatLngBoundsLiteral).west,
                    ]);
                    if (ne.isValid()) {
                        this.#northEast = ne;
                    }
                    if (sw.isValid()) {
                        this.#southWest = sw;
                    }
                } else {
                    this.extend(latLngValue as LatLngValue);
                }
            } else {
                this.extend(latLngValue);
            }
        }
    }

    /**
     * Returns whether the the given LatLng value is within this bounds
     *
     * @param {LatLngValue} latLngValue The LatLng value to test
     * @returns {boolean}
     */
    contains(latLngValue: LatLngValue): boolean {
        const latLngObject = latLng(latLngValue);
        if (!latLngObject.isValid()) {
            throw new Error(
                `Invalid latitude/longitude data passed to LatLngBounds.contains. You passed: ${JSON.stringify(
                    latLngValue
                )}`
            );
        }
        if (this.#bounds) {
            return this.#bounds.contains(latLngObject.toGoogle());
        }
        // Calculate the containment manually
        if (this.#southWest && this.#northEast) {
            return (
                latLngObject.latitude >= this.#southWest.latitude &&
                latLngObject.latitude <= this.#northEast.latitude &&
                latLngObject.longitude >= this.#southWest.longitude &&
                latLngObject.longitude <= this.#northEast.longitude
            );
        }
        return false;
    }

    /**
     * Returns whether this bounds approximately equals the given bounds
     *
     * @param {LatLngBounds} other The LatLngBounds object to compare
     * @returns {Promise<boolean>}
     */
    equals(other: LatLngBounds): Promise<boolean> {
        return new Promise((resolve) => {
            if (other instanceof LatLngBounds) {
                if (this.#bounds) {
                    other.toGoogle().then((googleLatLngBounds) => {
                        resolve(this.#bounds.equals(googleLatLngBounds));
                    });
                } else {
                    // Calculate the equality manually
                    resolve(
                        this.#northEast.latitude === other.getNorthEast().latitude &&
                            this.#northEast.longitude === other.getNorthEast().longitude &&
                            this.#southWest.latitude === other.getSouthWest().latitude &&
                            this.#southWest.longitude === other.getSouthWest().longitude
                    );
                }
            } else {
                resolve(false);
            }
        });
    }

    /**
     * Extends this bounds to contain the given point
     *
     * https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds.extend
     *
     * The latLngValue parameter can be:
     * - an array of [lat, lng] pairs: [[lat, lng], [lat, lng], ...]
     * - an array of {lat, lng} objects (LatLngLiteral[]): [{lat, lng}, {lat, lng}, ...]
     * - an array of LatLng objects: [LatLng, LatLng, ...]
     * - a [lat, lng] pair
     * - a {lat, lng} object (LatLngLiteral)
     *
     * @param {LatLngValue | LatLngValue[]} latLngValue The latitude/longitude value(s)
     * @returns {LatLngBounds}
     */
    extend(latLngValue: LatLngValue | LatLngValue[]): LatLngBounds {
        if (Array.isArray(latLngValue)) {
            // Don't throw an error if the array is empty
            if (latLngValue.length > 0) {
                if (latLng(latLngValue[0]).isValid()) {
                    // The value is likely an array of LatLngValues.
                    const value = latLngValue as LatLngValue[];
                    value.forEach((latLngVal: LatLngValue) => {
                        this.extend(latLngVal);
                    });
                } else {
                    // This is likely the array version of a LatLngValue.
                    const latLngObject = latLng(latLngValue as LatLngValue);
                    if (latLngObject.isValid()) {
                        this.extend(latLngObject);
                    } else {
                        throw new Error(
                            `Invalid latitude/longitude data passed to LatLngBounds. You passed: ${JSON.stringify(
                                latLngValue
                            )}`
                        );
                    }
                }
            } else {
                // eslint-disable-next-line no-console
                console.warn('The array passed to LatLngBounds.extend is empty. Nothing to extend.');
            }
        } else {
            // This is likely a LatLngValue.
            const latLngObject = latLng(latLngValue);
            if (latLngObject.isValid()) {
                if (this.#bounds) {
                    this.#extendGoogle(latLngObject);
                } else {
                    this.#extend(latLngObject);
                }
            } else {
                throw new Error(
                    `Invalid latitude/longitude data passed to LatLngBounds. You passed: ${JSON.stringify(latLngValue)}`
                );
            }
        }

        return this;
    }

    /**
     * Extends this bounds using the Google Maps LatLngBounds object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds.extend
     *
     * @param {LatLng} latLngObject The LatLng object
     * @returns {void}
     */
    #extendGoogle(latLngObject: LatLng): void {
        this.#bounds.extend(latLngObject.toGoogle());
    }

    /**
     * Extends this bounds using the internal method
     *
     * Based on the Leaflet library
     *
     * @param {LatLng} latLngObject The LatLng object
     * @returns {void}
     */
    #extend(latLngObject: LatLng): void {
        this.#boundValues.push(latLngObject.clone());

        if (this.#northEast && this.#southWest) {
            // Set the north-east corner to the most north-east point
            this.#northEast.latitude = Math.max(latLngObject.latitude, this.#northEast.latitude);
            this.#northEast.longitude = Math.max(latLngObject.longitude, this.#northEast.longitude);

            // Set the south-west corner to the most south-west point
            this.#southWest.latitude = Math.min(latLngObject.latitude, this.#southWest.latitude);
            this.#southWest.longitude = Math.min(latLngObject.longitude, this.#southWest.longitude);
        } else {
            // Set the north-east and south-west corners to the first point
            // We clone the LatLng object so that it's not associated with the original object.
            // We were getting some odd errors where the original object was being modified.
            this.#northEast = latLngObject.clone();
            this.#southWest = latLngObject.clone();
        }
    }

    /**
     * Get the center of the LatLngBounds
     *
     * @returns {LatLng}
     */
    getCenter(): LatLng {
        if (this.#bounds) {
            // Get the center from the Google Maps object
            // Convert the center to a LatLngValue
            return latLngConvert(this.#bounds.getCenter());
        }
        // Calculate the center manually
        const lat = (this.#northEast.latitude + this.#southWest.latitude) / 2;
        let lng = (this.#northEast.longitude + this.#southWest.longitude) / 2;

        // If the bounds crosses the 180 degree meridian, adjust the longitude
        if (this.#northEast.longitude < this.#southWest.longitude) {
            lng = ((lng + 180) % 360) - 180;
        }

        return latLng([lat, lng]);
    }

    /**
     * Get the north-east corner of the LatLngBounds
     *
     * @returns {LatLng}
     */
    getNorthEast(): LatLng {
        if (this.#bounds) {
            return latLngConvert(this.#bounds.getNorthEast());
        }
        return this.#northEast;
    }

    /**
     * Get the south-west corner of the LatLngBounds
     *
     * @returns {LatLng}
     */
    getSouthWest(): LatLng {
        if (this.#bounds) {
            return latLngConvert(this.#bounds.getSouthWest());
        }
        return this.#southWest;
    }

    /**
     * Initialize the lat/lng bounds object so that the Google maps library is available
     *
     * This is not intended to be called outside of this library.
     *
     * @internal
     * @returns {Promise<void>}
     */
    init(): Promise<void> {
        return new Promise((resolve) => {
            this.#setupGoogleLatLngBounds().then(() => {
                resolve();
            });
        });
    }

    /**
     * Returns whether this bounds shares any points with the other bounds
     *
     * @param {LatLngBounds} other The LatLngBounds object to compare
     * @returns {Promise<boolean>}
     */
    intersects(other: LatLngBounds): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (other instanceof LatLngBounds) {
                if (this.#bounds) {
                    other.toGoogle().then((googleLatLngBounds) => {
                        resolve(this.#bounds.intersects(googleLatLngBounds));
                    });
                } else {
                    // Calculate the intersection manually
                    const sw = this.getSouthWest();
                    const ne = this.getNorthEast();
                    const otherSw = other.getSouthWest();
                    const otherNe = other.getNorthEast();
                    resolve(
                        sw.latitude <= otherNe.latitude &&
                            ne.latitude >= otherSw.latitude &&
                            sw.longitude <= otherNe.longitude &&
                            ne.longitude >= otherSw.longitude
                    );
                }
            } else {
                reject(
                    new Error(
                        `Invalid LatLngBounds object passed to LatLngBounds.intersects. You passed: ${JSON.stringify(
                            other
                        )}`
                    )
                );
            }
        });
    }

    /**
     * Returns whether this bounds is empty
     *
     * @returns {boolean}
     */
    isEmpty(): boolean {
        if (this.#bounds) {
            return this.#bounds.isEmpty();
        }
        return !this.#northEast || !this.#southWest;
    }

    /**
     * Get the Google maps LatLngBounds object
     *
     * https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds
     *
     * @returns {Promise<google.maps.LatLngBounds>}
     */
    toGoogle(): Promise<google.maps.LatLngBounds> {
        return new Promise((resolve) => {
            this.#setupGoogleLatLngBounds().then(() => {
                resolve(this.#bounds);
            });
        });
    }

    /**
     * Set up the Google maps LatLngBounds object if necessary
     *
     * @private
     * @returns {Promise<void>}
     */
    #setupGoogleLatLngBounds(): Promise<void> {
        return new Promise((resolve) => {
            if (!isObject(this.#bounds)) {
                if (checkForGoogleMaps('LatLngBounds', 'LatLngBounds', false)) {
                    this.#createLatLngBoundsObject();
                    resolve();
                } else {
                    // The Google maps object isn't available yet. Wait for it to load.
                    // The developer may have set the map on the marker before the Google maps object was available.
                    loader().onMapLoad(() => {
                        this.#createLatLngBoundsObject();
                        resolve();
                    });
                }
            } else {
                resolve();
            }
        });
    }

    /**
     * Create the LatLngBounds object
     *
     * @private
     */
    #createLatLngBoundsObject() {
        if (!this.#bounds) {
            this.#bounds = new google.maps.LatLngBounds();
            if (this.#boundValues) {
                this.#boundValues.forEach((latLngObject) => {
                    this.#bounds.extend(latLngObject.toGoogle());
                });
            }
        }
    }

    /**
     * Converts the LatLngBounds object to a JSON object
     *
     * @returns {google.maps.LatLngBoundsLiteral}
     */
    toJson(): google.maps.LatLngBoundsLiteral {
        if (this.#bounds) {
            return this.#bounds.toJSON();
        }
        return {
            east: this.#northEast.longitude,
            north: this.#northEast.latitude,
            south: this.#southWest.latitude,
            west: this.#southWest.longitude,
        };
    }

    /**
     * Converts the LatLngBounds object to a string
     *
     * @returns {string}
     */
    toString(): string {
        if (this.#bounds) {
            return this.#bounds.toString();
        }
        return `(${this.#southWest.latitude}, ${this.#southWest.longitude}) (${this.#northEast.latitude}, ${
            this.#northEast.longitude
        })`;
    }

    /**
     * Returns the LatLngBounds object as a string that can be used in a URL
     *
     * @param {number} [precision] The number of decimal places to round the lat/lng values to
     * @returns {string}
     */
    toUrlValue(precision?: number): string {
        let prec = precision || 3;
        if (!isNumber(prec)) {
            prec = 3;
        }
        if (this.#bounds) {
            return this.#bounds.toUrlValue(prec);
        }

        return `${this.#southWest.latitude.toFixed(prec)},${this.#southWest.longitude.toFixed(
            prec
        )},${this.#northEast.latitude.toFixed(prec)},${this.#northEast.longitude.toFixed(prec)}`;
    }

    /**
     * Extends this bounds to contain the union of this and the given bounds
     *
     * @param {LatLngBounds} other The LatLngBounds object to join with
     * @returns {Promise<void>}
     */
    union(other: LatLngBounds | google.maps.LatLngBounds): Promise<void> {
        return new Promise((resolve) => {
            if (this.#bounds) {
                this.#union(other).then(() => {
                    resolve();
                });
            } else {
                this.#setupGoogleLatLngBounds().then(() => {
                    this.#union(other).then(() => {
                        resolve();
                    });
                });
            }
        });
    }

    /**
     * Extends this bounds to contain the union of this and the given bounds
     *
     * @param {LatLngBounds} other The LatLngBounds object to join with
     * @returns {Promise<void>}
     */
    #union(other: LatLngBounds | google.maps.LatLngBounds): Promise<void> {
        return new Promise((resolve) => {
            if (other instanceof LatLngBounds) {
                other.toGoogle().then((googleLatLngBounds) => {
                    this.#bounds.union(googleLatLngBounds);
                    resolve();
                });
            } else {
                // Assume it's a Google Maps LatLngBounds object
                this.#bounds.union(other);
                resolve();
            }
        });
    }
}

export type LatLngBoundsValue = LatLngValue | LatLngValue[] | LatLngBoundsEdges | LatLngBoundsLiteral | LatLngBounds;

/**
 * Helper function to set up the LatLngBounds object
 *
 * See comments on the extended method in the LatLngBounds class for the types of values
 * that latLngValue can be.
 *
 * @param {LatLngBoundsValue} [latLngValue] The latitude/longitude bounds value
 * @returns {LatLngBounds}
 */
export const latLngBounds = (latLngValue?: LatLngBoundsValue): LatLngBounds => {
    if (latLngValue instanceof LatLngBounds) {
        return latLngValue;
    }
    return new LatLngBounds(latLngValue as LatLngValue);
};
