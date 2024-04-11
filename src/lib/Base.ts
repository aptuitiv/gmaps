/* ===========================================================================
    Base class that all other classes extend.
    This provides support for incorporating mixins into the class, as well
    as testing the object type.
=========================================================================== */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Base class that all other classes extend.
 */
class Base {
    /**
     * Holds the object type
     *
     * @private
     * @type {string}
     */
    #objectType: string;

    /**
     * Constructor
     *
     * @param {string} objectType The object type for the class
     */
    constructor(objectType: string) {
        this.#objectType = objectType;
    }

    /**
     * Returns the object type
     *
     * @returns {string}
     */
    getObjectType(): string {
        return this.#objectType;
    }

    /**
     * Include the mixin into the class
     *
     * https://javascript.info/mixins
     * https://www.digitalocean.com/community/tutorials/js-using-js-mixins
     *
     * @param {any} mixin The mixin to include
     */
    static include(mixin: any) {
        Object.assign(this.prototype, mixin);
    }

    /**
     * Returns if the object is an Icon object
     *
     * @returns {boolean}
     */
    isIcon(): boolean {
        return this.getObjectType() === 'icon';
    }

    /**
     * Returns if the object is an InfoWindow object
     *
     * @returns {boolean}
     */
    isInfoWindow(): boolean {
        return this.getObjectType() === 'infowindow';
    }

    /**
     * Returns if the object is an LatLng object
     *
     * @returns {boolean}
     */
    isLatLng(): boolean {
        return this.getObjectType() === 'latlng';
    }

    /**
     * Returns if the object is an LatLngBounds object
     *
     * @returns {boolean}
     */
    isLatLngBounds(): boolean {
        return this.getObjectType() === 'latlngbounds';
    }

    /**
     * Returns if the object is a Map object
     *
     * @returns {boolean}
     */
    isMap(): boolean {
        return this.getObjectType() === 'map';
    }

    /**
     * Returns if the object is a Marker object
     *
     * @returns {boolean}
     */
    isMarker(): boolean {
        return this.getObjectType() === 'marker';
    }

    /**
     * Returns if the object is a MarkerCluster object
     *
     * @returns {boolean}
     */
    isMarkerCluster(): boolean {
        return this.getObjectType() === 'markercluster';
    }

    /**
     * Returns if the object is a Point object
     *
     * @returns {boolean}
     */
    isPoint(): boolean {
        return this.getObjectType() === 'point';
    }

    /**
     * Returns if the object is a Popup object
     *
     * @returns {boolean}
     */
    isPopup(): boolean {
        return this.getObjectType() === 'popup';
    }

    /**
     * Returns if the object is a Size object
     *
     * @returns {boolean}
     */
    isSize(): boolean {
        return this.getObjectType() === 'size';
    }

    /**
     * Returns if the object is a SvgSymbol object
     *
     * @returns {boolean}
     */
    isSvgSymbol(): boolean {
        return this.getObjectType() === 'svgsymbol';
    }
}

export default Base;
