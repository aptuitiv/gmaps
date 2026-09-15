/* ===========================================================================
    A LatLngBounds instance represents a rectangle in geographical coordinates,
    including one that crosses the 180 degrees longitudinal meridian.
    https://developers.google.com/maps/documentation/javascript/reference/coordinates#LatLngBounds

    See https://aptuitiv.github.io/gmaps/api-reference/utilities/latlng-bounds for documentation.
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
     * Holds the Google maps LatLngBounds object.
     *
     * This is created when the Google Maps library is available and the Google object is needed.
     */
    #bounds: google.maps.LatLngBounds | undefined;

    /**
     * Holds the values to extend the bounds with
     *
     * This is used to set up the Google Maps LatLngBounds object when the Google Maps object is loaded.
     *
     * @private
     * @type {LatLng[]}
     */
    #boundValues: google.maps.LatLngLiteral[] = [];

    /**
     * Holds the north-east corner of the LatLngBounds.
     *
     * This is undefined until a point is added to the bounds.
     *
     * @private
     * @type {LatLng|undefined}
     */
    #northEast: LatLng | undefined;

    /**
     * Holds the south-west corner of the LatLngBounds.
     *
     * This is undefined until a point is added to the bounds.
     *
     * @private
     * @type {LatLng|undefined}
     */
    #southWest: LatLng | undefined;

    /**
     * Holds the corners that the bounds was created with, if it was created from corner values.
     *
     * The Google Maps LatLngBounds object is created from these corners. Extending from the two
     * corner points instead would lose a bounds that crosses the 180 degree meridian or is more
     * than 180 degrees wide, because extend() always picks the smaller box.
     *
     * @private
     * @type {{ne: google.maps.LatLngLiteral, sw: google.maps.LatLngLiteral}|undefined}
     */
    #initialCorners: { ne: google.maps.LatLngLiteral; sw: google.maps.LatLngLiteral } | undefined;

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
                    this.#setCorners(
                        latLng((latLngValue as LatLngBoundsEdges).ne),
                        latLng((latLngValue as LatLngBoundsEdges).sw),
                    );
                } else if (
                    typeof (latLngValue as LatLngBoundsLiteral).north !== 'undefined' &&
                    typeof (latLngValue as LatLngBoundsLiteral).south !== 'undefined' &&
                    typeof (latLngValue as LatLngBoundsLiteral).east !== 'undefined' &&
                    typeof (latLngValue as LatLngBoundsLiteral).west !== 'undefined'
                ) {
                    this.#setCorners(
                        latLng([(latLngValue as LatLngBoundsLiteral).north, (latLngValue as LatLngBoundsLiteral).east]),
                        latLng([(latLngValue as LatLngBoundsLiteral).south, (latLngValue as LatLngBoundsLiteral).west]),
                    );
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
                    latLngValue,
                )}`,
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
                this.#containsLongitude(latLngObject.longitude, this.#southWest, this.#northEast)
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
                const bounds = this.#bounds;
                if (bounds) {
                    other.toGoogle().then((googleLatLngBounds) => {
                        resolve(bounds.equals(googleLatLngBounds));
                    });
                } else {
                    // Calculate the equality manually
                    const { northEast, southWest } = this.#getCorners();
                    resolve(
                        northEast.latitude === other.getNorthEast().latitude &&
                            northEast.longitude === other.getNorthEast().longitude &&
                            southWest.latitude === other.getSouthWest().latitude &&
                            southWest.longitude === other.getSouthWest().longitude,
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
                                latLngValue,
                            )}`,
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
                    // Extend the Google Maps LatLngBounds object
                    this.#bounds.extend(latLngObject.toGoogle());
                } else {
                    this.#extend(latLngObject);
                }
            } else {
                throw new Error(
                    `Invalid latitude/longitude data passed to LatLngBounds. You passed: ${JSON.stringify(latLngValue)}`,
                );
            }
        }

        return this;
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
        /**
         * Stored as a plain literal rather than a cloned LatLng.
         *
         * Every coordinate passed to extend() is kept until the Google bounds object is built, so
         * this array is as long as the data - a polyline path can be tens of thousands of points.
         * A literal is a fraction of the size of a LatLng instance, and it is what
         * #createLatLngBoundsObject() hands to Google anyway, so nothing has to be converted again
         * later either.
         */
        this.#boundValues.push({ lat: latLngObject.latitude, lng: latLngObject.longitude });

        if (this.#northEast && this.#southWest) {
            const { latitude, longitude } = latLngObject;
            this.#northEast.latitude = Math.max(latitude, this.#northEast.latitude);
            this.#southWest.latitude = Math.min(latitude, this.#southWest.latitude);

            if (!this.#containsLongitude(longitude, this.#southWest, this.#northEast)) {
                // Move whichever side needs the smaller change to include the longitude.
                // This is what Google Maps does, and it keeps the bounds correct when it
                // crosses the 180 degree meridian.
                const westDistance = (this.#southWest.longitude - longitude + 360) % 360;
                const eastDistance = (longitude - this.#northEast.longitude + 360) % 360;
                if (westDistance < eastDistance) {
                    this.#southWest.longitude = longitude;
                } else {
                    this.#northEast.longitude = longitude;
                }
            }
        } else {
            // Set the north-east and south-west corners to the first point
            // We clone the LatLng object so that it's not associated with the original object.
            // We were getting some odd errors where the original object was being modified.
            this.#northEast = latLngObject.clone();
            this.#southWest = latLngObject.clone();
        }
    }

    /**
     * Returns whether the longitude is within the longitude span of the corners.
     *
     * If the west longitude is greater than the east longitude then the bounds crosses the
     * 180 degree meridian, and the span wraps around it.
     *
     * @private
     * @param {number} longitude The longitude to test
     * @param {LatLng} southWest The south-west corner
     * @param {LatLng} northEast The north-east corner
     * @returns {boolean}
     */
    // eslint-disable-next-line class-methods-use-this -- Kept with the other bounds calculations
    #containsLongitude(longitude: number, southWest: LatLng, northEast: LatLng): boolean {
        if (southWest.longitude <= northEast.longitude) {
            return longitude >= southWest.longitude && longitude <= northEast.longitude;
        }
        return longitude >= southWest.longitude || longitude <= northEast.longitude;
    }

    /**
     * Set the bounds from its north-east and south-west corners.
     *
     * Nothing is set unless both corners are valid.
     *
     * @private
     * @param {LatLng} northEast The north-east corner
     * @param {LatLng} southWest The south-west corner
     */
    #setCorners(northEast: LatLng, southWest: LatLng): void {
        if (northEast.isValid() && southWest.isValid()) {
            // Clone the corners so that changes made by extend() don't modify the values that were passed in.
            this.#northEast = northEast.clone();
            this.#southWest = southWest.clone();
            this.#initialCorners = {
                ne: { lat: northEast.latitude, lng: northEast.longitude },
                sw: { lat: southWest.latitude, lng: southWest.longitude },
            };
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
        const { northEast, southWest } = this.#getCorners();
        const lat = (northEast.latitude + southWest.latitude) / 2;
        let lng = (northEast.longitude + southWest.longitude) / 2;

        // If the bounds crosses the 180 degree meridian, adjust the longitude
        if (northEast.longitude < southWest.longitude) {
            lng = ((lng + 180) % 360) - 180;
        }

        return latLng([lat, lng]);
    }

    /**
     * Get the north-east corner of the LatLngBounds.
     *
     * If the bounds is empty then this returns undefined. Use isEmpty() to check first.
     *
     * @returns {LatLng}
     */
    getNorthEast(): LatLng {
        if (this.#bounds) {
            return latLngConvert(this.#bounds.getNorthEast());
        }
        // The return type is kept as LatLng for backwards compatibility, even though the value
        // is undefined for an empty bounds.
        return this.#northEast as LatLng;
    }

    /**
     * Get the south-west corner of the LatLngBounds.
     *
     * If the bounds is empty then this returns undefined. Use isEmpty() to check first.
     *
     * @returns {LatLng}
     */
    getSouthWest(): LatLng {
        if (this.#bounds) {
            return latLngConvert(this.#bounds.getSouthWest());
        }
        // The return type is kept as LatLng for backwards compatibility, even though the value
        // is undefined for an empty bounds.
        return this.#southWest as LatLng;
    }

    /**
     * Get the north-east and south-west corners for calculating values manually
     * when the Google Maps LatLngBounds object isn't set up.
     *
     * This throws an error if either corner is not set, which happens if the bounds is empty.
     *
     * @private
     * @returns {{northEast: LatLng, southWest: LatLng}}
     */
    #getCorners(): { northEast: LatLng; southWest: LatLng } {
        if (!this.#northEast || !this.#southWest) {
            throw new Error('The LatLngBounds object is empty. Add a latitude/longitude value to it first.');
        }
        return { northEast: this.#northEast, southWest: this.#southWest };
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
                const bounds = this.#bounds;
                if (bounds) {
                    other.toGoogle().then((googleLatLngBounds) => {
                        resolve(bounds.intersects(googleLatLngBounds));
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
                            ne.longitude >= otherSw.longitude,
                    );
                }
            } else {
                reject(
                    new Error(
                        `Invalid LatLngBounds object passed to LatLngBounds.intersects. You passed: ${JSON.stringify(
                            other,
                        )}`,
                    ),
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
            this.#setupGoogleLatLngBounds().then((bounds) => {
                resolve(bounds);
            });
        });
    }

    /**
     * Set up the Google maps LatLngBounds object if necessary
     *
     * @private
     * @returns {Promise<google.maps.LatLngBounds>}
     */
    #setupGoogleLatLngBounds(): Promise<google.maps.LatLngBounds> {
        return new Promise((resolve) => {
            if (!isObject(this.#bounds)) {
                if (checkForGoogleMaps('LatLngBounds', 'LatLngBounds', false)) {
                    resolve(this.#createLatLngBoundsObject());
                } else {
                    // The Google maps object isn't available yet. Wait for it to load.
                    // The developer may have set the map on the marker before the Google maps object was available.
                    loader().onMapLoad(() => {
                        resolve(this.#createLatLngBoundsObject());
                    });
                }
            } else {
                resolve(this.#bounds);
            }
        });
    }

    /**
     * Create the LatLngBounds object if it hasn't been created yet
     *
     * @private
     * @returns {google.maps.LatLngBounds}
     */
    #createLatLngBoundsObject(): google.maps.LatLngBounds {
        if (!this.#bounds) {
            // Start from the corners if the bounds was created with them. Any values added
            // with extend() after that are in #boundValues.
            const bounds = this.#initialCorners
                ? new google.maps.LatLngBounds(this.#initialCorners.sw, this.#initialCorners.ne)
                : new google.maps.LatLngBounds();
            this.#bounds = bounds;
            this.#initialCorners = undefined;
            if (this.#boundValues) {
                this.#boundValues.forEach((latLngLiteral) => {
                    bounds.extend(latLngLiteral);
                });
                // The values have been handed to Google, so stop holding on to them
                this.#boundValues = [];
            }
        }
        return this.#bounds;
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
        const { northEast, southWest } = this.#getCorners();
        return {
            east: northEast.longitude,
            north: northEast.latitude,
            south: southWest.latitude,
            west: southWest.longitude,
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
        const { northEast, southWest } = this.#getCorners();
        return `(${southWest.latitude}, ${southWest.longitude}) (${northEast.latitude}, ${northEast.longitude})`;
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

        const { northEast, southWest } = this.#getCorners();
        return `${southWest.latitude.toFixed(prec)},${southWest.longitude.toFixed(
            prec,
        )},${northEast.latitude.toFixed(prec)},${northEast.longitude.toFixed(prec)}`;
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
     * This is only called after the Google Maps LatLngBounds object is set up.
     *
     * @param {LatLngBounds} other The LatLngBounds object to join with
     * @returns {Promise<void>}
     */
    #union(other: LatLngBounds | google.maps.LatLngBounds): Promise<void> {
        return new Promise((resolve) => {
            // The Google object is already set up at this point, so this returns the existing object.
            const bounds = this.#createLatLngBoundsObject();
            if (other instanceof LatLngBounds) {
                other.toGoogle().then((googleLatLngBounds) => {
                    bounds.union(googleLatLngBounds);
                    resolve();
                });
            } else {
                // Assume it's a Google Maps LatLngBounds object
                bounds.union(other);
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
