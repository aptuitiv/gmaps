/* ===========================================================================
    Set up the Rotate control object to configure how the
    rotate control shows on the map
    https://developers.google.com/maps/documentation/javascript/controls
=========================================================================== */

/* global google */

import { loader } from '../Loader';
import { isBoolean, isObject } from '../helpers';
import { convertControlPosition, ControlPosition, ControlPositionValue } from '../constants';

export type RotateControlOptions = {
    // Whether the RotateControl object is enabled
    enabled?: boolean;
    // The initial display position of the control.
    // Default: ControlPosition.INLINE_END_BLOCK_END
    position?: ControlPositionValue;
};

/**
 * Rotate control class
 */
export class RotateControl {
    /**
     * Holds whether the Rotate control is enabled or not
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
    #position: ControlPositionValue = ControlPosition.INLINE_END_BLOCK_START;

    /**
     * Class constructor
     *
     * @param {RotateControlOptions | boolean} [options] Either the RotateControl options or a boolean value to disable the control.
     */
    constructor(options?: RotateControlOptions | boolean) {
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
     * Get whether the Rotate control is enabled.
     *
     * @returns {boolean}
     */
    get enabled(): boolean {
        return this.#enabled;
    }

    /**
     * Set whether the Rotate control is enabled.
     *
     * @param {boolean} value The enabled/disabled state
     */
    set enabled(value: boolean) {
        if (isBoolean(value)) {
            this.#enabled = value;
        }
    }

    /**
     * Get the map type control position
     *
     * @returns {ControlPosition}
     */
    get position(): ControlPositionValue {
        return this.#position;
    }

    /**
     * Set the map type control position
     *
     * @param {ControlPosition} value The position of the control
     */
    set position(value: ControlPositionValue) {
        if (Object.values(ControlPosition).includes(value)) {
            this.#position = value;
        } else {
            // eslint-disable-next-line no-console
            console.warn('The Rotate position that you provided is not valid. You provided: ', value);
        }
    }

    /**
     * Disable the Rotate control
     *
     * @returns {RotateControl}
     */
    disable(): RotateControl {
        this.#enabled = false;
        return this;
    }

    /**
     * Enable the Rotate control
     *
     * @returns {RotateControl}
     */
    enable(): RotateControl {
        this.#enabled = true;
        return this;
    }

    /**
     * Set the position of the control
     * https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
     *
     * @param {ControlPositionValue} position The position of the control
     * @returns {RotateControl}
     */
    setPosition(position: ControlPositionValue): RotateControl {
        this.#position = position;
        return this;
    }

    /**
     * Get the Rotate Control options Google Maps object
     *
     * @returns {Promise<google.maps.RotateControlOptions>}
     */
    toGoogle(): Promise<google.maps.RotateControlOptions> {
        return new Promise((resolve) => {
            loader().on('load', () => {
                resolve({
                    position: convertControlPosition(this.#position),
                });
            });
        });
    }
}

export type RotateControlValue = RotateControlOptions | boolean | RotateControl;

/**
 * Helper function to set up the RotateControl object
 *
 * @param {RotateControlValue} options The RotateControl options, a boolean value to disable the control, or a RotateControl object.
 * @returns {RotateControl}
 */
export const rotateControl = (options?: RotateControlValue): RotateControl => {
    if (options instanceof RotateControl) {
        return options;
    }
    return new RotateControl(options);
};
