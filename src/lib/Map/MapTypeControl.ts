/* ===========================================================================
    Set up the MapTypeControl object to configure how the
    Map Type control shows on the map
    https://developers.google.com/maps/documentation/javascript/controls
=========================================================================== */

/* global google */

import { loader } from '../Loader';
import { isBoolean, isObject } from '../helpers';
import {
    convertControlPosition,
    convertMapTypeControlStyle,
    ControlPosition,
    ControlPositionValue,
    MapTypeControlStyle,
    MapTypeControlStyleValue,
    MapTypeId,
    MapTypeIdValue,
} from '../constants';

export type MapTypeControlOptions = {
    // IDs of map types to show in the control.
    // Default: [ROADMAP, SATELLITE, HYBRID, TERRAIN]
    mapTypeIds?: MapTypeIdValue[];
    // The initial display position of the control.
    // Default: ControlPosition.BLOCK_START_INLINE_START
    position?: ControlPositionValue;
    // The style of the control.
    // Default: MapTypeControlStyle.DEFAULT
    style?: MapTypeControlStyleValue;
};

/**
 * Map Type control class
 */
export class MapTypeControl {
    /**
     * Holds whether the Map Type control is enabled or not
     *
     * @private
     * @type {boolean}
     */
    #enabled: boolean = true;

    /**
     * The map type ids to include in the control
     *
     * https://developers.google.com/maps/documentation/javascript/reference/map#MapTypeId
     *
     * @private
     * @type {MapTypeId[]}
     */
    #mapTypeIds: MapTypeIdValue[];

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
     * The style of the control
     *
     * https://developers.google.com/maps/documentation/javascript/reference/control#MapTypeControlStyle
     *
     * @private
     * @type {MapTypeControlStyle}
     */
    #style: MapTypeControlStyleValue;

    /**
     * Holds whether the hybrid map type is enabled
     *
     * @private
     * @type {boolean}
     */
    #typeHybrid: boolean = true;

    /**
     * Holds whether the roadmap map type is enabled
     *
     * @private
     * @type {boolean}
     */
    #typeRoadmap: boolean = true;

    /**
     * Holds whether the satellite map type is enabled
     *
     * @private
     * @type {boolean}
     */
    #typeSatellite: boolean = true;

    /**
     * Holds whether the terrain map type is enabled
     *
     * @private
     * @type {boolean}
     */
    #typeTerrain: boolean = true;

    /**
     * Class constructor
     *
     * @param {MapTypeControlOptions | boolean} [options] Either the MapTypeControl options or a boolean value to disable the control.
     */
    constructor(options?: MapTypeControlOptions | boolean) {
        // Set the enabled/disabled state of the control if necessary
        if (isBoolean(options)) {
            this.#enabled = options;
        }

        // If the map type IDs are not already set, then set the default values based on the enabled types.
        // This allows the developer to configure the types to show on the map before the map is loaded.
        if (!this.#mapTypeIds) {
            this.#mapTypeIds = [];
            if (this.#typeHybrid) {
                this.#mapTypeIds.push(MapTypeId.HYBRID);
            }
            if (this.#typeRoadmap) {
                this.#mapTypeIds.push(MapTypeId.ROADMAP);
            }
            if (this.#typeSatellite) {
                this.#mapTypeIds.push(MapTypeId.SATELLITE);
            }
            if (this.#typeTerrain) {
                this.#mapTypeIds.push(MapTypeId.TERRAIN);
            }
        }
        // If the position is not already set, then set the default value
        if (!this.#position) {
            this.#position = ControlPosition.BLOCK_START_INLINE_START;
        }
        // If the style is not already set, then set the default value
        if (!this.#style) {
            this.#style = MapTypeControlStyle.DEFAULT;
        }

        // If the options are set, then override the default values
        if (isObject(options)) {
            if (options.mapTypeIds) {
                this.setMapTypeIds(options.mapTypeIds);
            }
            if (options.position) {
                this.setPosition(options.position);
            }
            if (options.style) {
                this.setStyle(options.style);
            }
        }
    }

    /**
     * Get whether the Map Type control is enabled.
     *
     * @returns {boolean}
     */
    get enabled(): boolean {
        return this.#enabled;
    }

    /**
     * Set whether the Map Type control is enabled.
     *
     * @param {boolean} value The enabled/disabled state
     */
    set enabled(value: boolean) {
        if (isBoolean(value)) {
            this.#enabled = value;
        }
    }

    /**
     * Get whether the hybrid map type is enabled
     *
     * @returns {boolean}
     */
    get hybrid(): boolean {
        return this.#typeHybrid;
    }

    /**
     * Set whether the hybrid map type is enabled
     *
     * @param {boolean} value The enabled/disabled state
     */
    set hybrid(value: boolean) {
        if (isBoolean(value)) {
            this.#typeHybrid = value;
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
     * Get whether the roadmap map type is enabled
     *
     * @returns {boolean}
     */
    get roadmap(): boolean {
        return this.#typeRoadmap;
    }

    /**
     * Set whether the roadmap map type is enabled
     *
     * @param {boolean} value The enabled/disabled state
     */
    set roadmap(value: boolean) {
        if (isBoolean(value)) {
            this.#typeRoadmap = value;
        }
    }

    /**
     * Get whether the satellite map type is enabled
     *
     * @returns {boolean}
     */
    get satellite(): boolean {
        return this.#typeSatellite;
    }

    /**
     * Set whether the satellite map type is enabled
     *
     * @param {boolean} value The enabled/disabled state
     */
    set satellite(value: boolean) {
        if (isBoolean(value)) {
            this.#typeSatellite = value;
        }
    }

    /**
     * Get the map type control style
     *
     * @returns {MapTypeControlStyle}
     */
    get style(): MapTypeControlStyleValue {
        return this.#style;
    }

    /**
     * Set the map type control style
     *
     * @param {MapTypeControlStyleValue} value The style of the control
     */
    set style(value: MapTypeControlStyleValue) {
        this.#style = value;
    }

    /**
     * Get whether the terrain map type is enabled
     *
     * @returns {boolean}
     */
    get terrain(): boolean {
        return this.#typeTerrain;
    }

    /**
     * Set whether the terrain map type is enabled
     *
     * @param {boolean} value The enabled/disabled state
     */
    set terrain(value: boolean) {
        if (isBoolean(value)) {
            this.#typeTerrain = value;
        }
    }

    /**
     * Disable the Map Type control
     *
     * @returns {MapTypeControl}
     */
    disable(): MapTypeControl {
        this.#enabled = false;
        return this;
    }

    /**
     * Enable the Map Type control
     *
     * @returns {MapTypeControl}
     */
    enable(): MapTypeControl {
        this.#enabled = true;
        return this;
    }

    /**
     * Set the map type ids to include in the control
     *
     * @param {MapTypeIdValue[]} mapTypeIds The map type ids to include in the control
     * @returns {MapTypeControl}
     */
    setMapTypeIds(mapTypeIds: MapTypeIdValue[]): MapTypeControl {
        if (Array.isArray(mapTypeIds) && mapTypeIds.length > 0) {
            const validMapTypeIds = mapTypeIds.filter((mapTypeId) => Object.values(MapTypeId).includes(mapTypeId));
            if (validMapTypeIds.length > 0) {
                this.#mapTypeIds = validMapTypeIds;
                this.#typeHybrid = validMapTypeIds.includes(MapTypeId.HYBRID);
                this.#typeRoadmap = validMapTypeIds.includes(MapTypeId.ROADMAP);
                this.#typeSatellite = validMapTypeIds.includes(MapTypeId.SATELLITE);
                this.#typeTerrain = validMapTypeIds.includes(MapTypeId.TERRAIN);
            }
        }
        return this;
    }

    /**
     * Set the position of the control
     * https://developers.google.com/maps/documentation/javascript/reference/control#ControlPosition
     *
     * @param {ControlPositionValue} position The position of the control
     * @returns {MapTypeControl}
     */
    setPosition(position: ControlPositionValue): MapTypeControl {
        this.#position = position;
        return this;
    }

    /**
     * Set the style of the control
     * https://developers.google.com/maps/documentation/javascript/reference/control#MapTypeControlStyle
     *
     * @param {MapTypeControlStyleValue} style The style of the control
     * @returns {MapTypeControl}
     */
    setStyle(style: MapTypeControlStyleValue): MapTypeControl {
        this.#style = style;
        return this;
    }

    /**
     * Get the MapTypeControl options Google Maps object
     *
     * @returns {Promise<google.maps.MapTypeControlOptions>}
     */
    toGoogle(): Promise<google.maps.MapTypeControlOptions> {
        return new Promise((resolve) => {
            loader().on('load', () => {
                resolve({
                    mapTypeIds: this.#mapTypeIds,
                    position: convertControlPosition(this.#position),
                    // position: 21,
                    // style: this.#style,
                    // style: 2,
                    style: convertMapTypeControlStyle(this.#style),
                });
            });
        });
    }
}

export type MapTypeControlValue = MapTypeControlOptions | boolean | MapTypeControl;

/**
 * Helper function to set up the MapTypeControl object
 *
 * @param {MapTypeControlValue} options The MapTypeControl options, a boolean value to disable the control, or a MapTypeControl object.
 * @returns {MapTypeControl}
 */
export const mapTypeControl = (options?: MapTypeControlValue): MapTypeControl => {
    if (options instanceof MapTypeControl) {
        return options;
    }
    return new MapTypeControl(options);
};
