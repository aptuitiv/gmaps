/* ===========================================================================
        Core functionality that all objects should have.
=========================================================================== */

const BaseMixin = {
    /**
     * Returns if the object is an Icon object
     *
     * @returns {boolean}
     */
    isIcon(): boolean {
        return this.getObjectType() === 'icon';
    },

    /**
     * Returns if the object is an InfoWindow object
     *
     * @returns {boolean}
     */
    isInfoWindow(): boolean {
        return this.getObjectType() === 'infowindow';
    },

    /**
     * Returns if the object is an LatLng object
     *
     * @returns {boolean}
     */
    isLatLng(): boolean {
        return this.getObjectType() === 'latlng';
    },

    /**
     * Returns if the object is an LatLngBounds object
     *
     * @returns {boolean}
     */
    isLatLngBounds(): boolean {
        return this.getObjectType() === 'latlngbounds';
    },

    /**
     * Returns if the object is a Map object
     *
     * @returns {boolean}
     */
    isMap(): boolean {
        return this.getObjectType() === 'map';
    },

    /**
     * Returns if the object is a Marker object
     *
     * @returns {boolean}
     */
    isMarker(): boolean {
        return this.getObjectType() === 'marker';
    },

    /**
     * Returns if the object is a MarkerCluster object
     *
     * @returns {boolean}
     */
    isMarkerCluster(): boolean {
        return this.getObjectType() === 'markercluster';
    },

    /**
     * Returns if the object is a Point object
     *
     * @returns {boolean}
     */
    isPoint(): boolean {
        return this.getObjectType() === 'point';
    },

    /**
     * Returns if the object is a Popup object
     *
     * @returns {boolean}
     */
    isPopup(): boolean {
        return this.getObjectType() === 'popup';
    },

    /**
     * Returns if the object is a Size object
     *
     * @returns {boolean}
     */
    isSize(): boolean {
        return this.getObjectType() === 'size';
    },

    /**
     * Returns if the object is a SvgSymbol object
     *
     * @returns {boolean}
     */
    isSvgSymbol(): boolean {
        return this.getObjectType() === 'svgsymbol';
    },
};

export default BaseMixin;
