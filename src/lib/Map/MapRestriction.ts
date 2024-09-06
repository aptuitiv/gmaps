/* ===========================================================================
    Configures a restriction that can be applied to the map.
    https://developers.google.com/maps/documentation/javascript/reference/map#MapRestriction
=========================================================================== */

/* global google */

import { isBoolean, isObject } from '../helpers';
import { latLngBounds, LatLngBounds, LatLngBoundsValue } from '../LatLngBounds';

export type MapRestrictionOptions = {
    // Whether the MapRestriction object is enabled
    enabled?: boolean;
    // The latitude/longitude bounds that a user is restricted to.
    // They can only pan and zoom within the bounds.
    latLngBounds?: LatLngBoundsValue;
    // If true, anything outside of the latLngBounds will be hidden when zooming. This can restrict how much the user can zoom out.
    // Defaults to false.
    strictBounds?: boolean;
};

/**
 * MapRestriction class
 */
export class MapRestriction {
    /**
     * Whether the MapRestriction object is enabled
     *
     * @private
     * @type {boolean}
     */
    #enabled: boolean = true;

    /**
     * The latitude/longitude bounds that a user is restricted to.
     *
     * @private
     * @type {LatLngBounds}
     */
    #latLngBounds: LatLngBounds;

    /**
     * If true, anything outside of the latLngBounds will be hidden when zooming. This can restrict how much the user can zoom out.
     *
     * @private
     * @type {boolean}
     */
    #strictBounds: boolean = false;

    /**
     * Class constructor
     *
     * @param {MapRestrictionOptions | LatLngBoundsValue | boolean} [options] Either the MapRestriction options just the LatLng bounds value.
     */
    constructor(options?: MapRestrictionOptions | LatLngBoundsValue | boolean) {
        if (isBoolean(options)) {
            this.enabled = options;
        } else if (options instanceof LatLngBounds) {
            this.latLngBounds = options;
        } else if (isObject(options)) {
            const opts = options as MapRestrictionOptions;
            if (
                typeof opts.enabled !== 'undefined' ||
                typeof opts.latLngBounds !== 'undefined' ||
                typeof opts.strictBounds !== 'undefined'
            ) {
                if (isBoolean(opts.enabled)) {
                    this.enabled = opts.enabled;
                }
                if (typeof opts.latLngBounds !== 'undefined') {
                    this.latLngBounds = opts.latLngBounds;
                }
                if (isBoolean(opts.strictBounds)) {
                    this.strictBounds = opts.strictBounds;
                }
            } else {
                // This is likely a latLng bounds object
                this.latLngBounds = options as LatLngBoundsValue;
            }
        } else if (Array.isArray(options)) {
            this.latLngBounds = options;
        }
    }

    /**
     * Get whether the MapRestriction object is enabled
     *
     * @returns {boolean}
     */
    get enabled(): boolean {
        return this.#enabled;
    }

    /**
     * Set whether the MapRestriction object is enabled
     *
     * @param {boolean} value Whether the MapRestriction object is enabled
     */
    set enabled(value: boolean) {
        if (isBoolean(value)) {
            this.#enabled = value;
        }
    }

    /**
     * Get the existing latitude/longitude bounds
     *
     * @returns {LatLngBounds | undefined}
     */
    get latLngBounds(): LatLngBounds {
        return this.#latLngBounds;
    }

    /**
     * Set the latitude/longitude bounds
     *
     * @param {LatLngBoundsValue} value The lat/lng bounds value
     */
    set latLngBounds(value: LatLngBoundsValue) {
        this.#latLngBounds = latLngBounds(value);
    }

    /**
     * Get whether the bounds are strict
     *
     * @returns {boolean}
     */
    get strictBounds(): boolean {
        return this.#strictBounds;
    }

    /**
     * Set whether the bounds are strict
     *
     * @param {boolean} value Whether the bounds are strict
     */
    set strictBounds(value: boolean) {
        if (isBoolean(value)) {
            this.#strictBounds = value;
        }
    }

    /**
     * Disable the map restriction
     *
     * @returns {MapRestriction}
     */
    disable(): MapRestriction {
        this.#enabled = false;
        return this;
    }

    /**
     * Enable the map restriction
     *
     * @returns {MapRestriction}
     */
    enable(): MapRestriction {
        this.#enabled = true;
        return this;
    }

    /**
     * Returns whether the MapRestriction object is enabled
     *
     * @returns {boolean}
     */
    isEnabled(): boolean {
        return this.#enabled;
    }

    /**
     * Returns if the MapRestriction object is valid
     *
     * @returns {boolean}
     */
    isValid(): boolean {
        let valid = false;
        if (this.#latLngBounds) {
            const json = this.#latLngBounds.toJson();
            // The latlng bounds needs to have at least two latlng points. If so,
            // then the east and west, and north and south points should be different.
            if (json.east !== json.west && json.north !== json.south) {
                valid = true;
            } else {
                // eslint-disable-next-line no-console
                console.error('The MapRestrictions latLngBounds value must have at least two different LatLng values.');
            }
        }
        return valid;
    }

    /**
     * Set the latitude/longitude bounds
     *
     * @param {LatLngBoundsValue} value The lat/lng bounds value
     * @returns {MapRestriction}
     */
    setLatLngBounds(value: LatLngBoundsValue): MapRestriction {
        this.latLngBounds = value;
        return this;
    }

    /**
     * Set whether the bounds are strict
     *
     * @param {boolean} value Whether the bounds are strict
     * @returns {MapRestriction}
     */
    setStrictBounds(value: boolean): MapRestriction {
        this.strictBounds = value;
        return this;
    }

    /**
     * Get the MapRestriction Google Maps object
     *
     * @returns {Promise<google.maps.MapRestriction>}
     */
    toGoogle(): Promise<google.maps.MapRestriction> {
        return new Promise((resolve) => {
            this.#latLngBounds.toGoogle().then((bounds) => {
                resolve({
                    latLngBounds: bounds,
                    strictBounds: this.#strictBounds,
                });
            });
        });
    }
}

export type MapRestrictionValue = MapRestrictionOptions | LatLngBoundsValue | MapRestriction | boolean;

/**
 * Helper function to set up the MapRestriction object
 *
 * @param {MapRestrictionValue} options The MapRestriction options, a LatLngBounds value, or a MapRestriction object.
 * @returns {MapRestriction}
 */
export const mapRestriction = (options?: MapRestrictionValue): MapRestriction => {
    if (options instanceof MapRestriction) {
        return options;
    }
    return new MapRestriction(options);
};
