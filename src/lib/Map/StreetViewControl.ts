/* ===========================================================================
    Set up the StreetView control object to configure how the
    street view control shows on the map
    https://developers.google.com/maps/documentation/javascript/controls
=========================================================================== */

/* global google */

import { loader } from '../Loader';
import { isBoolean, isObject } from '../helpers';
import {
    convertControlPosition,
    ControlPosition,
    ControlPositionValue,
    StreetViewSource,
    StreetViewSourceValue,
} from '../constants';

export type StreetViewControlOptions = {
    // Whether the StreetViewControl object is enabled
    enabled?: boolean;
    // The initial display position of the control.
    // Default: ControlPosition.INLINE_END_BLOCK_END
    position?: ControlPositionValue;
    // The sources for the street view control
    sources?: StreetViewSourceValue | StreetViewSourceValue[];
};

/**
 * StreetView control class
 */
export class StreetViewControl {
    /**
     * Holds whether the StreetView control is enabled or not
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
     * The sources of the street view control
     *
     * @private
     * @type {StreetViewSourceValue[]}
     */
    #sources?: StreetViewSourceValue[] = [StreetViewSource.DEFAULT];

    /**
     * Class constructor
     *
     * @param {StreetViewControlOptions | boolean} [options] Either the StreetViewControl options or a boolean value to disable the control.
     */
    constructor(options?: StreetViewControlOptions | boolean) {
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
            if (options.sources) {
                this.sources = options.sources;
            }
        }
    }

    /**
     * Get whether the StreetView control is enabled.
     *
     * @returns {boolean}
     */
    get enabled(): boolean {
        return this.#enabled;
    }

    /**
     * Set whether the StreetView control is enabled.
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
            console.warn('The Street View position that you provided is not valid. You provided: ', value);
        }
    }

    /**
     * Get the sources of the street view control
     *
     * @returns {StreetViewSourceValue[]}
     */
    get sources(): StreetViewSourceValue[] {
        return this.#sources;
    }

    /**
     * Set the sources of the street view control
     *
     * @param {StreetViewSourceValue | StreetViewSourceValue[]} value The source or sources of the street view control
     */
    set sources(value: StreetViewSourceValue | StreetViewSourceValue[]) {
        const sources = Array.isArray(value) ? value : [value];
        const validSources = sources.filter((source) => Object.values(StreetViewSource).includes(source));
        if (validSources.length > 0) {
            this.#sources = validSources;
        } else {
            // eslint-disable-next-line no-console
            console.warn('The Street View sources that you provided are not valid. You provided: ', value);
        }
    }

    /**
     * Disable the StreetView control
     *
     * @returns {StreetViewControl}
     */
    disable(): StreetViewControl {
        this.#enabled = false;
        return this;
    }

    /**
     * Enable the StreetView control
     *
     * @returns {StreetViewControl}
     */
    enable(): StreetViewControl {
        this.#enabled = true;
        return this;
    }

    /**
     * Set the position of the control
     * https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
     *
     * @param {ControlPositionValue} position The position of the control
     * @returns {StreetViewControl}
     */
    setPosition(position: ControlPositionValue): StreetViewControl {
        this.position = position;
        return this;
    }

    /**
     * Set the sources of the street view control
     *
     * @param {StreetViewSourceValue | StreetViewSourceValue[]} sources The source or sources of the street view control
     * @returns {StreetViewControl}
     */
    setSources(sources: StreetViewSourceValue | StreetViewSourceValue[]): StreetViewControl {
        this.sources = sources;
        return this;
    }

    /**
     * Get the StreetView Control options Google Maps object
     *
     * @returns {Promise<google.maps.StreetViewControlOptions>}
     */
    toGoogle(): Promise<google.maps.StreetViewControlOptions> {
        return new Promise((resolve) => {
            loader().on('load', () => {
                resolve({
                    position: convertControlPosition(this.#position),
                });
            });
        });
    }
}

export type StreetViewControlValue = StreetViewControlOptions | boolean | StreetViewControl;

/**
 * Helper function to set up the StreetViewControl object
 *
 * @param {StreetViewControlValue} options The StreetViewControl options, a boolean value to disable the control, or a StreetViewControl object.
 * @returns {StreetViewControl}
 */
export const streetViewControl = (options?: StreetViewControlValue): StreetViewControl => {
    if (options instanceof StreetViewControl) {
        return options;
    }
    return new StreetViewControl(options);
};
