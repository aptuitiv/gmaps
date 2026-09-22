/* ===========================================================================
    Base class that all other classes extend.
    This provides support for incorporating mixins into the class, as well
    as testing the object type.
    See https://aptuitiv.github.io/gmaps/api-reference/base-classes/base
    for documentation.
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
     * The mixin's own properties are copied onto the class prototype with their descriptors, so
     * that getters and setters arrive as getters and setters. Object.assign() was used here before,
     * which reads the value a getter returns and copies that instead, leaving a static value on the
     * prototype and no accessor - and it did so silently, so a mixin written with a getter appeared
     * to work until the value needed to change.
     *
     * Note that a property holding a mutable value is still shared by every instance, because it
     * lives on the prototype rather than on each object. That is how prototypes work and isn't
     * something this can fix. Assign in a method (this.thing = []) to give each object its own.
     *
     * https://javascript.info/mixins
     * https://www.digitalocean.com/community/tutorials/js-using-js-mixins
     *
     * @param {any} mixin The mixin to include
     */
    static include(mixin: any) {
        Object.defineProperties(this.prototype, Object.getOwnPropertyDescriptors(mixin));
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
     * Returns if the object is a Polyline object
     *
     * @returns {boolean}
     */
    isPolyline(): boolean {
        return this.getObjectType() === 'polyline';
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
