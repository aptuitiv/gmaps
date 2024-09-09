/* ===========================================================================
    Set up the Zoom control object to configure how the
    zoom control shows on the map
    https://developers.google.com/maps/documentation/javascript/controls
=========================================================================== */

/* global google */

import { loader } from '../Loader';
import { isBoolean, isObject } from '../helpers';
import { convertControlPosition, ControlPosition, ControlPositionValue } from '../constants';

export type ZoomControlOptions = {
    // Whether the ZoomControl object is enabled
    enabled?: boolean;
    // The initial display position of the control.
    // Default: ControlPosition.INLINE_END_BLOCK_END
    position?: ControlPositionValue;
};

/**
 * Zoom control class
 */
export class ZoomControl {
    /**
     * Holds whether the Zoom control is enabled or not
     *
     * @private
     * @type {boolean}
     */
    #enabled: boolean = true;

    /**
     * The position of the control on the map
     *
     * https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
     *
     * @private
     * @type {ControlPosition}
     */
    #position: ControlPositionValue = ControlPosition.INLINE_END_BLOCK_END;

    /**
     * Class constructor
     *
     * @param {ZoomControlOptions | boolean} [options] Either the ZoomControl options or a boolean value to disable the control.
     */
    constructor(options?: ZoomControlOptions | boolean) {
        // Set the enabled/disabled state of the control if necessary
        if (isBoolean(options)) {
            this.#enabled = options;
        }

        // If the options are set, then override the default values
        if (isObject(options)) {
            if (isBoolean(options.enabled)) {
                this.enabled = options.enabled;
            }
            if (options.position) {
                this.position = options.position;
            }
        }
    }

    /**
     * Get whether the Zoom control is enabled.
     *
     * @returns {boolean}
     */
    get enabled(): boolean {
        return this.#enabled;
    }

    /**
     * Set whether the Zoom control is enabled.
     *
     * @param {boolean} value The enabled/disabled state
     */
    set enabled(value: boolean) {
        if (isBoolean(value)) {
            this.#enabled = value;
        }
    }

    /**
     * Get the zoom control position
     *
     * @returns {ControlPosition}
     */
    get position(): ControlPositionValue {
        return this.#position;
    }

    /**
     * Set the zoom control position
     *
     * @param {ControlPosition} value The position of the control
     */
    set position(value: ControlPositionValue) {
        if (Object.values(ControlPosition).includes(value)) {
            this.#position = value;
        } else {
            // eslint-disable-next-line no-console
            console.warn('The Zoom position that you provided is not valid. You provided: ', value);
        }
    }

    /**
     * Disable the Zoom control
     *
     * @returns {ZoomControl}
     */
    disable(): ZoomControl {
        this.#enabled = false;
        return this;
    }

    /**
     * Enable the Zoom control
     *
     * @returns {ZoomControl}
     */
    enable(): ZoomControl {
        this.#enabled = true;
        return this;
    }

    /**
     * Set the position of the control
     * https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
     *
     * @param {ControlPositionValue} position The position of the control
     * @returns {ZoomControl}
     */
    setPosition(position: ControlPositionValue): ZoomControl {
        this.#position = position;
        return this;
    }

    /**
     * Get the Zoom Control options Google Maps object
     *
     * @returns {Promise<google.maps.ZoomControlOptions>}
     */
    toGoogle(): Promise<google.maps.ZoomControlOptions> {
        return new Promise((resolve) => {
            loader().on('load', () => {
                resolve({
                    position: convertControlPosition(this.#position),
                });
            });
        });
    }
}

export type ZoomControlValue = ZoomControlOptions | boolean | ZoomControl;

/**
 * Helper function to set up the ZoomControl object
 *
 * @param {ZoomControlValue} options The ZoomControl options, a boolean value to disable the control, or a ZoomControl object.
 * @returns {ZoomControl}
 */
export const zoomControl = (options?: ZoomControlValue): ZoomControl => {
    if (options instanceof ZoomControl) {
        return options;
    }
    return new ZoomControl(options);
};
