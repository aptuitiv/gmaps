/* ===========================================================================
    Set up the Fullscreen control object to configure how the
    fullscreen control shows on the map
    https://developers.google.com/maps/documentation/javascript/controls
=========================================================================== */

/* global google */

import { loader } from '../Loader';
import { isBoolean, isObject } from '../helpers';
import { convertControlPosition, ControlPosition, ControlPositionValue } from '../constants';

export type FullscreenControlOptions = {
    // Whether the FullscreenControl object is enabled
    enabled?: boolean;
    // The initial display position of the control.
    // Default: ControlPosition.INLINE_END_BLOCK_START
    position?: ControlPositionValue;
};

/**
 * Fullscreen control class
 */
export class FullscreenControl {
    /**
     * Holds whether the Fullscreen control is enabled or not
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
    #position: ControlPositionValue;

    /**
     * Class constructor
     *
     * @param {FullscreenControlOptions | boolean} [options] Either the FullscreenControl options or a boolean value to disable the control.
     */
    constructor(options?: FullscreenControlOptions | boolean) {
        // Set the enabled/disabled state of the control if necessary
        if (isBoolean(options)) {
            this.#enabled = options;
        }

        // Set the default position
        this.#position = ControlPosition.INLINE_END_BLOCK_START;

        // If the options are set, then override the default values
        if (isObject(options)) {
            if (isBoolean(options.enabled)) {
                this.#enabled = options.enabled;
            }
            if (options.position) {
                this.setPosition(options.position);
            }
        }
    }

    /**
     * Get whether the Fullscreen control is enabled.
     *
     * @returns {boolean}
     */
    get enabled(): boolean {
        return this.#enabled;
    }

    /**
     * Set whether the Fullscreen control is enabled.
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
        this.#position = value;
    }

    /**
     * Disable the Fullscreen control
     *
     * @returns {FullscreenControl}
     */
    disable(): FullscreenControl {
        this.#enabled = false;
        return this;
    }

    /**
     * Enable the Fullscreen control
     *
     * @returns {FullscreenControl}
     */
    enable(): FullscreenControl {
        this.#enabled = true;
        return this;
    }

    /**
     * Set the position of the control
     * https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
     *
     * @param {ControlPositionValue} position The position of the control
     * @returns {FullscreenControl}
     */
    setPosition(position: ControlPositionValue): FullscreenControl {
        this.#position = position;
        return this;
    }

    /**
     * Get the Fullscreen Control options Google Maps object
     *
     * @returns {Promise<google.maps.FullscreenControlOptions>}
     */
    toGoogle(): Promise<google.maps.FullscreenControlOptions> {
        return new Promise((resolve) => {
            loader().on('load', () => {
                resolve({
                    position: convertControlPosition(this.#position),
                });
            });
        });
    }
}

export type FullscreenControlValue = FullscreenControlOptions | boolean | FullscreenControl;

/**
 * Helper function to set up the FullscreenControl object
 *
 * @param {FullscreenControlValue} options The FullscreenControl options, a boolean value to disable the control, or a FullscreenControl object.
 * @returns {FullscreenControl}
 */
export const fullscreenControl = (options?: FullscreenControlValue): FullscreenControl => {
    if (options instanceof FullscreenControl) {
        return options;
    }
    return new FullscreenControl(options);
};
