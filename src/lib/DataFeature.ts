/* ===========================================================================
    A single feature within a data layer.

    This wraps the google.maps.Data.Feature object so that geometry and properties
    can be worked with using this library's objects instead of the Google objects.

    https://developers.google.com/maps/documentation/javascript/reference/data#Data.Feature

    See https://aptuitiv.github.io/gmaps/api-reference/datafeature for documentation.
=========================================================================== */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* global google */

import { GeometryType, GeometryTypeValue } from './constants';
import type { DataLayer, DataStyleOptions } from './DataLayer';
import { isNullOrUndefined, isStringOrNumber } from './helpers';
import Layer from './Layer';
import { LatLng, latLngConvert } from './LatLng';
import { LatLngBounds, latLngBounds } from './LatLngBounds';

// Custom data that can be attached to a feature as GeoJson properties
export type FeatureProperties = {
    [key: string]: any;
};

/**
 * A single feature within a data layer.
 *
 * This is not intended to be created directly. Features are returned by the DataLayer
 * methods that load or add data.
 */
export class DataFeature extends Layer {
    /**
     * Holds the Google maps Data.Feature object
     *
     * @private
     * @type {google.maps.Data.Feature}
     */
    #feature: google.maps.Data.Feature;

    /**
     * Holds the data layer that the feature belongs to
     *
     * @private
     * @type {DataLayer}
     */
    #layer: DataLayer;

    /**
     * Constructor
     *
     * @param {google.maps.Data.Feature} feature The Google maps Data.Feature object
     * @param {DataLayer} layer The data layer that the feature belongs to
     */
    constructor(feature: google.maps.Data.Feature, layer: DataLayer) {
        super('datafeature', 'Data');
        this.#feature = feature;
        this.#layer = layer;
    }

    /**
     * Get the feature id.
     *
     * The id is only set if the GeoJson data included one, or if it was set when the
     * feature was added to the data layer.
     *
     * @returns {string|number|undefined}
     */
    get id(): string | number | undefined {
        return this.#feature.getId();
    }

    /**
     * Get the data layer that the feature belongs to.
     *
     * @returns {DataLayer}
     */
    get layer(): DataLayer {
        return this.#layer;
    }

    /**
     * Get the geometry type for the feature.
     *
     * This is the GeoJson geometry type. For example "Point", "LineString" or "Polygon".
     *
     * @returns {GeometryTypeValue|undefined}
     */
    get geometryType(): GeometryTypeValue | undefined {
        const geometry = this.#feature.getGeometry();
        if (geometry) {
            return geometry.getType() as GeometryTypeValue;
        }
        return undefined;
    }

    /**
     * Get all of the properties for the feature as a plain object.
     *
     * The Google maps API only lets you get one property at a time, so this collects them all.
     *
     * @returns {FeatureProperties}
     */
    get properties(): FeatureProperties {
        const properties: FeatureProperties = {};
        this.#feature.forEachProperty((value, name) => {
            properties[name] = value;
        });
        return properties;
    }

    /**
     * Get the bounds of the feature.
     *
     * Every Google maps geometry object supports forEachLatLng(), which walks nested
     * geometries, so this works for every geometry type without needing to handle each one.
     *
     * @returns {LatLngBounds}
     */
    getBounds(): LatLngBounds {
        const bounds = latLngBounds();
        const geometry = this.#feature.getGeometry();
        if (geometry) {
            geometry.forEachLatLng((googleLatLng) => {
                bounds.extend(latLngConvert(googleLatLng));
            });
        }
        return bounds;
    }

    /**
     * Get the feature id.
     *
     * Alternate of the id getter.
     *
     * @returns {string|number|undefined}
     */
    getId(): string | number | undefined {
        return this.id;
    }

    /**
     * Get the geometry type for the feature.
     *
     * Alternate of the geometryType getter.
     *
     * @returns {GeometryTypeValue|undefined}
     */
    getGeometryType(): GeometryTypeValue | undefined {
        return this.geometryType;
    }

    /**
     * Get the data layer that the feature belongs to.
     *
     * Alternate of the layer getter.
     *
     * @returns {DataLayer}
     */
    getLayer(): DataLayer {
        return this.#layer;
    }

    /**
     * Get the first path of coordinates for the feature.
     *
     * For a LineString this is the line. For a Polygon this is the outer ring.
     * Use getPaths() to also get the holes in a polygon.
     *
     * @returns {LatLng[]}
     */
    getPath(): LatLng[] {
        const paths = this.getPaths();
        return paths.length > 0 ? paths[0] : [];
    }

    /**
     * Get all of the paths of coordinates for the feature.
     *
     * For a Polygon the first path is the outer ring and any additional paths are the
     * holes within it.
     *
     * @returns {LatLng[][]}
     */
    getPaths(): LatLng[][] {
        return DataFeature.#geometryPaths(this.#feature.getGeometry());
    }

    /**
     * Get the position of the feature if it's a Point geometry.
     *
     * @returns {LatLng|undefined}
     */
    getPosition(): LatLng | undefined {
        const geometry = this.#feature.getGeometry();
        if (geometry && geometry.getType() === GeometryType.POINT) {
            return latLngConvert((geometry as google.maps.Data.Point).get());
        }
        return undefined;
    }

    /**
     * Get a single property value for the feature.
     *
     * @param {string} key The property name to get the value for
     * @returns {any}
     */
    getProperty(key: string): any {
        return this.#feature.getProperty(key);
    }

    /**
     * Get all of the properties for the feature as a plain object.
     *
     * Alternate of the properties getter.
     *
     * @returns {FeatureProperties}
     */
    getProperties(): FeatureProperties {
        return this.properties;
    }

    /**
     * Returns whether the feature has the given property set.
     *
     * @param {string} key The property name to test for
     * @returns {boolean}
     */
    hasProperty(key: string): boolean {
        return !isNullOrUndefined(this.#feature.getProperty(key));
    }

    /**
     * Initialize the feature
     *
     * The feature always wraps an existing Google feature object, so there is nothing to
     * wait for. This exists so that objects that attach to a layer, like tooltips, work.
     *
     * @internal
     * @returns {Promise<void>}
     */
    // eslint-disable-next-line class-methods-use-this -- This overrides the Layer method
    init(): Promise<void> {
        return Promise.resolve();
    }

    /**
     * Remove the feature from the data layer that it belongs to.
     *
     * @returns {DataFeature}
     */
    remove(): DataFeature {
        this.#layer.remove(this);
        return this;
    }

    /**
     * Remove a property from the feature.
     *
     * @param {string} key The property name to remove
     * @returns {DataFeature}
     */
    removeProperty(key: string): DataFeature {
        this.#feature.removeProperty(key);
        return this;
    }

    /**
     * Reset the style for this feature back to the data layer style.
     *
     * This undoes setStyle().
     *
     * @returns {DataFeature}
     */
    resetStyle(): DataFeature {
        this.#layer.revertStyle(this);
        return this;
    }

    /**
     * Set the style for this one feature, overriding the data layer style.
     *
     * Use resetStyle() to go back to the data layer style.
     *
     * @param {DataStyleOptions} style The style to set on this feature
     * @returns {DataFeature}
     */
    setStyle(style: DataStyleOptions): DataFeature {
        this.#layer.overrideStyle(this, style);
        return this;
    }

    /**
     * Set a property value on the feature.
     *
     * @param {string} key The property name to set
     * @param {any} value The value to set
     * @returns {DataFeature}
     */
    setProperty(key: string, value: any): DataFeature {
        this.#feature.setProperty(key, value);
        return this;
    }

    /**
     * Set multiple property values on the feature.
     *
     * @param {FeatureProperties} properties The properties to set
     * @returns {DataFeature}
     */
    setProperties(properties: FeatureProperties): DataFeature {
        Object.keys(properties).forEach((key) => {
            this.#feature.setProperty(key, properties[key]);
        });
        return this;
    }

    /**
     * Export the feature as a GeoJson object.
     *
     * The Google maps API method is callback based. This returns a promise instead.
     *
     * @returns {Promise<object>}
     */
    toGeoJson(): Promise<object> {
        return new Promise((resolve) => {
            this.#feature.toGeoJson((geoJson) => {
                resolve(geoJson);
            });
        });
    }

    /**
     * Returns the Google maps Data.Feature object
     *
     * @returns {google.maps.Data.Feature}
     */
    toGoogle(): google.maps.Data.Feature {
        return this.#feature;
    }

    /**
     * Get the paths of coordinates for a Google maps geometry object.
     *
     * Each geometry type holds its coordinates differently so each one is handled separately.
     * Collections are walked so that all of their paths are returned.
     *
     * @private
     * @param {google.maps.Data.Geometry} geometry The geometry object to get the paths for
     * @returns {LatLng[][]}
     */
    static #geometryPaths(geometry: google.maps.Data.Geometry | null): LatLng[][] {
        if (!geometry) {
            return [];
        }
        switch (geometry.getType()) {
            case GeometryType.POINT:
                return [[latLngConvert((geometry as google.maps.Data.Point).get())]];
            case GeometryType.MULTI_POINT:
            case GeometryType.LINE_STRING:
            case GeometryType.LINEAR_RING:
                return [(geometry as google.maps.Data.LineString).getArray().map((value) => latLngConvert(value))];
            case GeometryType.POLYGON:
                return (geometry as google.maps.Data.Polygon)
                    .getArray()
                    .map((ring) => ring.getArray().map((value) => latLngConvert(value)));
            case GeometryType.MULTI_LINE_STRING:
                return (geometry as google.maps.Data.MultiLineString)
                    .getArray()
                    .map((line) => line.getArray().map((value) => latLngConvert(value)));
            case GeometryType.MULTI_POLYGON:
                return (geometry as google.maps.Data.MultiPolygon)
                    .getArray()
                    .reduce((paths: LatLng[][], polygon) => paths.concat(DataFeature.#geometryPaths(polygon)), []);
            case GeometryType.GEOMETRY_COLLECTION:
                return (geometry as google.maps.Data.GeometryCollection)
                    .getArray()
                    .reduce((paths: LatLng[][], value) => paths.concat(DataFeature.#geometryPaths(value)), []);
            default:
                return [];
        }
    }
}

// The possible values that can be used to reference a feature
export type DataFeatureValue = DataFeature | string | number;

/**
 * Helper function to test if a value can be used to reference a feature
 *
 * @param {DataFeatureValue} value The value to test
 * @returns {boolean}
 */
export const isDataFeatureValue = (value: any): value is DataFeatureValue =>
    value instanceof DataFeature || isStringOrNumber(value);
