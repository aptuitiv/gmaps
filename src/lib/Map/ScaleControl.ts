/* ===========================================================================
    Set up the Scale control object to configure how the
    scale control shows on the map
    https://developers.google.com/maps/documentation/javascript/controls
=========================================================================== */

/* global google */

import { loader } from '../Loader';
import { isBoolean, isObject } from '../helpers';

export type ScaleControlOptions = {
    // Whether the ScaleControl object is enabled
    enabled?: boolean;
};

/**
 * Scale control class
 */
export class ScaleControl {
    /**
     * Holds whether the Scale control is enabled or not
     *
     * @private
     * @type {boolean}
     */
    #enabled: boolean = false;

    /**
     * Class constructor
     *
     * @param {ScaleControlOptions | boolean} [options] Either the ScaleControl options or a boolean value to disable the control.
     */
    constructor(options?: ScaleControlOptions | boolean) {
        // Set the enabled/disabled state of the control if necessary
        if (isBoolean(options)) {
            this.#enabled = options;
        }

        // If the options are set, then override the default values
        if (isObject(options)) {
            if (isBoolean(options.enabled)) {
                this.#enabled = options.enabled;
            }
        }
    }

    /**
     * Get whether the Scale control is enabled.
     *
     * @returns {boolean}
     */
    get enabled(): boolean {
        return this.#enabled;
    }

    /**
     * Set whether the Scale control is enabled.
     *
     * @param {boolean} value The enabled/disabled state
     */
    set enabled(value: boolean) {
        if (isBoolean(value)) {
            this.#enabled = value;
        }
    }

    /**
     * Disable the Scale control
     *
     * @returns {ScaleControl}
     */
    disable(): ScaleControl {
        this.#enabled = false;
        return this;
    }

    /**
     * Enable the Scale control
     *
     * @returns {ScaleControl}
     */
    enable(): ScaleControl {
        this.#enabled = true;
        return this;
    }

    /**
     * Get the Scale Control options Google Maps object
     *
     * @returns {Promise<google.maps.ScaleControlOptions>}
     */
    // eslint-disable-next-line class-methods-use-this
    toGoogle(): Promise<google.maps.ScaleControlOptions> {
        return new Promise((resolve) => {
            loader().on('load', () => {
                resolve({
                    style: google.maps.ScaleControlStyle.DEFAULT,
                });
            });
        });
    }
}

export type ScaleControlValue = ScaleControlOptions | boolean | ScaleControl;

/**
 * Helper function to set up the ScaleControl object
 *
 * @param {ScaleControlValue} options The ScaleControl options, a boolean value to disable the control, or a ScaleControl object.
 * @returns {ScaleControl}
 */
export const scaleControl = (options?: ScaleControlValue): ScaleControl => {
    if (options instanceof ScaleControl) {
        return options;
    }
    return new ScaleControl(options);
};
