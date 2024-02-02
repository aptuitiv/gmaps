/* ===========================================================================
        Core functionality that all objects should have.
=========================================================================== */

const BaseMixin = {
    /**
     * Returns the object type
     *
     * @returns {string}
     */
    getObjectType(): string {
        return this.objectType;
    },

    /**
     * Returns if the object is an Icon object
     *
     * @returns {boolean}
     */
    isIcon(): boolean {
        return this.objectType === 'icon';
    },

    /**
     * Returns if the object is an InfoWindow object
     *
     * @returns {boolean}
     */
    isInfoWindow(): boolean {
        return this.objectType === 'infowindow';
    },

    /**
     * Returns if the object is an LatLng object
     *
     * @returns {boolean}
     */
    isLatLng(): boolean {
        return this.objectType === 'latlng';
    },

    /**
     * Returns if the object is an LatLngBounds object
     *
     * @returns {boolean}
     */
    isLatLngBounds(): boolean {
        return this.objectType === 'latlngbounds';
    },

    /**
     * Returns if the object is a Map object
     *
     * @returns {boolean}
     */
    isMap(): boolean {
        return this.objectType === 'map';
    },

    /**
     * Returns if the object is a Marker object
     *
     * @returns {boolean}
     */
    isMarker(): boolean {
        return this.objectType === 'marker';
    },

    /**
     * Returns if the object is a MarkerCluster object
     *
     * @returns {boolean}
     */
    isMarkerCluster(): boolean {
        return this.objectType === 'markercluster';
    },

    /**
     * Returns if the object is a Point object
     *
     * @returns {boolean}
     */
    isPoint(): boolean {
        return this.objectType === 'point';
    },

    /**
     * Returns if the object is a Popup object
     *
     * @returns {boolean}
     */
    isPopup(): boolean {
        return this.objectType === 'popup';
    },

    /**
     * Returns if the object is a Size object
     *
     * @returns {boolean}
     */
    isSize(): boolean {
        return this.objectType === 'size';
    },

    /**
     * Returns if the object is a SvgSymbol object
     *
     * @returns {boolean}
     */
    isSvgSymbol(): boolean {
        return this.objectType === 'svgsymbol';
    },
};

export default BaseMixin;
