/* ===========================================================================
    A data layer to display GeoJson data, polygons, lines and points on the map.

    This wraps the google.maps.Data object.
    https://developers.google.com/maps/documentation/javascript/datalayer
    https://developers.google.com/maps/documentation/javascript/reference/data

    A data layer can either be the map's own data layer, which is available as map.data,
    or it can be a separate layer created with the dataLayer() function.

    A layer that isn't the map's own layer only needs the Google maps library to be loaded,
    not a map. Because of that data can be loaded into it before there is a map to show it on
    and then the whole layer is attached to the map later with setMap().

    See https://aptuitiv.github.io/gmaps-docs/api-reference/datalayer for documentation.
=========================================================================== */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* global google */

import { DataLayerEvents } from './constants';
import { DataFeature, DataFeatureValue, FeatureProperties } from './DataFeature';
import { Event, EventCallback, EventConfig, EventListenerOptions, Evented } from './Evented';
import {
    isBoolean,
    isFunction,
    isNullOrUndefined,
    isNumberOrNumberString,
    isObject,
    isString,
    isStringOrNumber,
    isStringWithValue,
    checkForGoogleMaps,
} from './helpers';
import { Icon } from './Icon';
import Layer from './Layer';
import { latLng, LatLngValue, latLngConvert } from './LatLng';
import { LatLngBounds, latLngBounds } from './LatLngBounds';
import { loader } from './Loader';
import { Map } from './Map';
import { SvgSymbol } from './SvgSymbol';

// The events that the data layer can dispatch
type DataLayerEvent =
    | 'addfeature'
    | 'click'
    | 'contextmenu'
    | 'dblclick'
    | 'load'
    | 'mousedown'
    | 'mouseout'
    | 'mouseover'
    | 'mouseup'
    | 'ready'
    | 'removefeature'
    | 'removeproperty'
    | 'rightclick'
    | 'setgeometry'
    | 'setproperty';

// The event object passed to a data layer event callback.
// It's the standard event object with the feature that the event happened on.
export type DataLayerEventObject = Event & {
    feature?: DataFeature;
};

// The callback function for a data layer event
export type DataLayerEventCallback = (event: DataLayerEventObject) => void;

/**
 * The style to apply to a feature.
 *
 * These use this library's option names, which match the Polyline options, rather than the
 * Google maps names.
 */
export type DataStyleOptions = {
    // Whether the feature handles mouse events. Defaults to true.
    clickable?: boolean;
    // The CSS cursor to show when hovering over the feature.
    cursor?: string;
    // Whether the feature can be dragged. Defaults to false.
    draggable?: boolean;
    // Whether the feature's geometry can be edited. Defaults to false.
    editable?: boolean;
    // The fill color for polygons. All CSS3 colors are supported except for extended named colors.
    fillColor?: string;
    // The fill opacity for polygons, between 0.0 and 1.0.
    fillOpacity?: number | string;
    // The icon to use for point geometry. This can be an Icon object, a SvgSymbol object, or a URL.
    icon?: Icon | SvgSymbol | string | google.maps.Icon | google.maps.Symbol;
    // The stroke color. All CSS3 colors are supported except for extended named colors.
    strokeColor?: string;
    // The stroke opacity between 0.0 and 1.0.
    strokeOpacity?: number | string;
    // The stroke width in pixels.
    strokeWeight?: number | string;
    // The hover text for point geometry.
    title?: string;
    // Whether the feature is visible. Defaults to true.
    visible?: boolean;
    // The zIndex value compared to other features.
    zIndex?: number | string;
};

// The style for the layer. Either one style for every feature, or a function that returns
// the style for each feature.
export type DataStyleValue = DataStyleOptions | ((feature: DataFeature) => DataStyleOptions);

// The options for loading GeoJson data
export type LoadOptions = {
    // Fit the map to the bounds of the data once it's loaded.
    fitBounds?: boolean;
    // The name of the GeoJson property to use as the feature id.
    idProperty?: string;
    // Remove the existing features before loading the new ones.
    // Take care with this on the map's own data layer (map.data) as it removes every feature
    // on that layer, including any that another part of the application added.
    replace?: boolean;
};

// The options for adding a single feature
export type FeatureOptions = {
    // The id to give the feature.
    id?: string | number;
    // The GeoJson properties to attach to the feature.
    properties?: FeatureProperties;
    // The style to set on this one feature, overriding the layer style.
    style?: DataStyleOptions;
};

export type DataLayerOptions = {
    // Fit the map to the bounds of the data once it's loaded.
    fitBounds?: boolean;
    // GeoJson to load into the layer. This can be a url, an array of urls, or a GeoJson object.
    geoJson?: string | string[] | object;
    // The name of the GeoJson property to use as the feature id.
    idProperty?: string;
    // The map to add the data layer to.
    map?: Map;
    // The style to apply to the features in the layer.
    style?: DataStyleValue;
    // Whether the layer is visible on the map. Defaults to true.
    visible?: boolean;
};

/**
 * The data layer class
 */
export class DataLayer extends Layer {
    /**
     * Holds the Google maps Data object
     *
     * @private
     * @type {google.maps.Data}
     */
    #data: google.maps.Data;

    /**
     * Holds the map that this layer is the default data layer for.
     *
     * This is only set when the layer wraps a map's own data layer (map.data).
     * It's kept separate from the Layer map value so that the layer can still be
     * shown again after hide() sets the map to null.
     *
     * @private
     * @type {Map}
     */
    #defaultLayerMap: Map;

    /**
     * Holds the DataFeature object for each Google maps feature.
     *
     * This makes sure that the same Google feature always gets the same DataFeature
     * object back, which matters for things like attached tooltips and style overrides.
     *
     * @private
     * @type {WeakMap}
     */
    #features: WeakMap<google.maps.Data.Feature, DataFeature> = new WeakMap();

    /**
     * Holds the data layer options
     *
     * @private
     * @type {DataLayerOptions}
     */
    #options: DataLayerOptions = {};

    /**
     * Holds the chain of calls that are waiting for the Google maps Data object.
     *
     * Every public call is added to the end of this chain so that calls are always run in
     * the order that they were made, however long the map takes to be ready.
     *
     * @private
     * @type {Promise<void>}
     */
    #pendingChain: Promise<void> = Promise.resolve();

    /**
     * Holds the promise for setting up the Google maps Data object.
     *
     * This is memoized so that the Data object is only ever created once.
     *
     * @private
     * @type {Promise<google.maps.Data>}
     */
    #setupPromise: Promise<google.maps.Data>;

    /**
     * Holds the style for the layer
     *
     * @private
     * @type {DataStyleValue}
     */
    #style: DataStyleValue;

    /**
     * Holds the Google symbol for each SvgSymbol used in a style.
     *
     * The Google maps API calls the style function for each feature and uses the value that
     * it returns straight away, so the style function has to be synchronous. SvgSymbol.toGoogle()
     * is not, so resolved symbols are cached here and the style is applied again once one resolves.
     *
     * @private
     * @type {WeakMap}
     */
    #svgSymbols: WeakMap<SvgSymbol, google.maps.Symbol> = new WeakMap();

    /**
     * Constructor
     *
     * @param {DataLayerOptions} [options] The data layer options
     * @param {Map} [defaultLayerMap] The map to wrap the default data layer for.
     *      This is only used within this library by the Map class for the map.data value.
     * @internal
     */
    constructor(options?: DataLayerOptions, defaultLayerMap?: Map) {
        super('datalayer', 'Data');

        if (defaultLayerMap instanceof Map) {
            this.#defaultLayerMap = defaultLayerMap;
            super.setMap(defaultLayerMap);
        }
        if (isObject(options)) {
            this.setOptions(options);
        }
    }

    /**
     * Get the map that the layer is attached to
     *
     * @returns {Map|null}
     */
    get map(): Map | null {
        return this.#mapObject();
    }

    /**
     * Set the map that the layer is attached to
     *
     * @param {Map|null} value The map object. Set to null to remove the layer from the map.
     */
    set map(value: Map | null) {
        this.setMap(value);
    }

    /**
     * Get the style for the layer
     *
     * @returns {DataStyleValue}
     */
    get style(): DataStyleValue {
        return this.#style;
    }

    /**
     * Set the style for the layer
     *
     * @param {DataStyleValue} value The style to apply to the features in the layer
     */
    set style(value: DataStyleValue) {
        this.setStyle(value);
    }

    /**
     * Get whether the layer is visible on the map
     *
     * @returns {boolean}
     */
    get visible(): boolean {
        return this.isVisible;
    }

    /**
     * Set whether the layer is visible on the map
     *
     * @param {boolean} value Whether the layer is visible on the map
     */
    set visible(value: boolean) {
        if (isBoolean(value)) {
            if (value) {
                this.show();
            } else {
                this.hide();
            }
        }
    }

    /**
     * Add GeoJson data to the layer.
     *
     * https://developers.google.com/maps/documentation/javascript/reference/data#Data.addGeoJson
     *
     * @param {object} geoJson The GeoJson object to add
     * @param {LoadOptions} [options] The options for adding the data
     * @returns {Promise<DataFeature[]>}
     */
    addGeoJson(geoJson: object, options?: LoadOptions): Promise<DataFeature[]> {
        return this.#enqueue((data) => {
            this.#handleReplace(data, options);
            const features = data.addGeoJson(geoJson, this.#geoJsonOptions(options));
            return this.#afterLoad(data, features, options);
        });
    }

    /**
     * Add a single point to the layer.
     *
     * @param {LatLngValue} position The position for the point
     * @param {FeatureOptions} [options] The options for the feature
     * @returns {Promise<DataFeature>}
     */
    addPoint(position: LatLngValue, options?: FeatureOptions): Promise<DataFeature> {
        return this.#enqueue((data) => {
            const point = latLng(position);
            if (!point.isValid()) {
                throw new Error(
                    `Invalid latitude/longitude data passed to DataLayer.addPoint. You passed: ${JSON.stringify(position)}`,
                );
            }
            return this.#addFeature(data, new google.maps.Data.Point(point.toGoogle()), options);
        });
    }

    /**
     * Add a polygon to the layer.
     *
     * The paths value can either be a single array of positions for a polygon without any
     * holes in it, or an array of arrays of positions. When it's an array of arrays the first
     * one is the outer edge of the polygon and each one after that is a hole within it.
     *
     * A ring doesn't need to repeat its first position at the end to close it. If it does,
     * as GeoJson data does, then the repeated position is dropped.
     *
     * @param {LatLngValue[]|LatLngValue[][]} paths The path for the polygon, or an array of paths
     * @param {FeatureOptions} [options] The options for the feature
     * @returns {Promise<DataFeature>}
     */
    addPolygon(paths: LatLngValue[] | LatLngValue[][], options?: FeatureOptions): Promise<DataFeature> {
        return this.#enqueue((data) => {
            const rings = DataLayer.#toRings(paths).map((ring) => DataLayer.#toRingPositions(ring));
            if (rings.length === 0 || rings[0].length < 3) {
                throw new Error('A polygon needs at least three positions in its first path');
            }
            return this.#addFeature(data, new google.maps.Data.Polygon(rings), options);
        });
    }

    /**
     * Add a line to the layer.
     *
     * @param {LatLngValue[]} path The path for the line
     * @param {FeatureOptions} [options] The options for the feature
     * @returns {Promise<DataFeature>}
     */
    addPolyline(path: LatLngValue[], options?: FeatureOptions): Promise<DataFeature> {
        return this.#enqueue((data) => {
            const positions = DataLayer.#toPositions(path);
            if (positions.length < 2) {
                throw new Error('A line needs at least two positions in its path');
            }
            return this.#addFeature(data, new google.maps.Data.LineString(positions), options);
        });
    }

    /**
     * Remove every feature from the layer.
     *
     * The Google maps API doesn't have a way to do this so each feature is removed in turn.
     *
     * Take care when calling this on the map's own data layer (map.data). Google gives each map
     * one shared data layer, so this removes every feature on it, including any that another part
     * of the application added. Use dataLayer() to create a layer that only holds your own data.
     *
     * @returns {DataLayer}
     */
    clear(): DataLayer {
        return this.#queue((data) => {
            DataLayer.#googleFeatures(data).forEach((feature) => {
                data.remove(feature);
            });
        });
    }

    /**
     * Returns whether the feature is in this layer.
     *
     * @param {DataFeature} feature The feature to test for
     * @returns {Promise<boolean>}
     */
    contains(feature: DataFeature): Promise<boolean> {
        return this.#enqueue((data) => feature instanceof DataFeature && data.contains(feature.toGoogle()));
    }

    /**
     * @inheritdoc
     */
    dispatch(event: string, data?: any): Evented {
        // Replace the Google feature with the DataFeature object so that a Google object is
        // never handed to an event callback.
        if (isObject(data) && !isNullOrUndefined((data as google.maps.Data.MouseEvent).feature)) {
            const googleEvent = data as google.maps.Data.MouseEvent;
            const eventData: any = { feature: this.#featureFor(googleEvent.feature) };
            if (typeof googleEvent.domEvent !== 'undefined') {
                eventData.domEvent = googleEvent.domEvent;
                eventData.latLng = googleEvent.latLng;
                eventData.stop = googleEvent.stop;
            }
            return super.dispatch(event, eventData);
        }
        return super.dispatch(event, data);
    }

    /**
     * Fit the map to the bounds of the data in the layer.
     *
     * Nothing happens if the layer has no features, or if it isn't attached to a map.
     *
     * @returns {Promise<DataLayer>}
     */
    fitBounds(): Promise<DataLayer> {
        return this.#enqueue((data) => this.#fitBounds(data));
    }

    /**
     * Call the callback function for each feature in the layer.
     *
     * @param {Function} callback The function to call for each feature
     * @returns {Promise<DataLayer>}
     */
    forEach(callback: (feature: DataFeature) => void): Promise<DataLayer> {
        return this.#enqueue((data) => {
            DataLayer.#googleFeatures(data).forEach((feature) => {
                callback(this.#featureFor(feature));
            });
            return this;
        });
    }

    /**
     * Get the bounds of all of the features in the layer.
     *
     * @returns {Promise<LatLngBounds>}
     */
    getBounds(): Promise<LatLngBounds> {
        return this.#enqueue((data) => DataLayer.#bounds(data).bounds);
    }

    /**
     * Get a feature by its id.
     *
     * https://developers.google.com/maps/documentation/javascript/reference/data#Data.getFeatureById
     *
     * @param {string|number} id The feature id
     * @returns {Promise<DataFeature|undefined>}
     */
    getFeature(id: string | number): Promise<DataFeature | undefined> {
        return this.#enqueue((data) => {
            const feature = data.getFeatureById(id);
            return feature ? this.#featureFor(feature) : undefined;
        });
    }

    /**
     * Get every feature in the layer.
     *
     * The Google maps API only provides forEach() so this collects the features into an array.
     * That gives you the array methods, so filtering is done with filter():
     *
     * const parks = (await layer.getFeatures()).filter((feature) => feature.getProperty('type') === 'park');
     *
     * @returns {Promise<DataFeature[]>}
     */
    getFeatures(): Promise<DataFeature[]> {
        return this.#enqueue((data) =>
            DataLayer.#googleFeatures(data).map((feature) => this.#featureFor(feature)),
        );
    }

    /**
     * Hide the layer on the map.
     *
     * The features stay in the layer. Use show() to display them again.
     *
     * @returns {DataLayer}
     */
    hide(): DataLayer {
        this.isVisible = false;
        return this.#queue((data) => {
            data.setMap(null);
        });
    }

    /**
     * Initialize the data layer
     *
     * This is used when another element, like a tooltip, needs to be attached to the layer
     * but needs to make sure that the layer exists first.
     *
     * This is not intended to be called outside of this library.
     *
     * @internal
     * @returns {Promise<void>}
     */
    init(): Promise<void> {
        return this.#getGoogleData().then(() => {});
    }

    /**
     * @inheritdoc
     */
    hasListener(type: DataLayerEvent, callback?: EventCallback): boolean {
        return super.hasListener(type, callback);
    }

    /**
     * Load GeoJson data into the layer from a url.
     *
     * The Google maps API method is callback based. This returns a promise that resolves with
     * the features that were loaded.
     *
     * More than one url can be passed. The promise then resolves once every file has loaded,
     * with all of the features from all of the files.
     *
     * https://developers.google.com/maps/documentation/javascript/reference/data#Data.loadGeoJson
     *
     * @param {string|string[]} url The url to load the GeoJson from, or an array of urls
     * @param {LoadOptions} [options] The options for loading the data
     * @returns {Promise<DataFeature[]>}
     */
    loadGeoJson(url: string | string[], options?: LoadOptions): Promise<DataFeature[]> {
        return this.#enqueue((data) => {
            const urls = (Array.isArray(url) ? url : [url]).filter((value) => isStringWithValue(value));
            if (urls.length === 0) {
                throw new Error('A url is required to load GeoJson data');
            }
            this.#handleReplace(data, options);
            const geoJsonOptions = this.#geoJsonOptions(options);
            return Promise.all(
                urls.map(
                    (value) =>
                        new Promise<google.maps.Data.Feature[]>((resolve) => {
                            data.loadGeoJson(value, geoJsonOptions, (features) => {
                                resolve(features);
                            });
                        }),
                ),
            ).then((results) => {
                const features: google.maps.Data.Feature[] = [];
                results.forEach((value) => {
                    features.push(...value);
                });
                return this.#afterLoad(data, features, options);
            });
        });
    }

    /**
     * @inheritdoc
     */
    off(type?: DataLayerEvent, callback?: EventCallback, options?: EventListenerOptions): void {
        super.off(type, callback, options);
    }

    /**
     * @inheritdoc
     */
    on(type: DataLayerEvent, callback: DataLayerEventCallback, config?: EventConfig): void {
        // Make sure that the Google Data object gets set up so that the event can be added to it
        this.#setup();
        super.on(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    onImmediate(type: DataLayerEvent, callback: DataLayerEventCallback, config?: EventConfig): void {
        this.#setup();
        super.onImmediate(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    once(type: DataLayerEvent, callback?: DataLayerEventCallback, config?: EventConfig): void {
        this.#setup();
        super.once(type, callback, config);
    }

    /**
     * @inheritdoc
     */
    onceImmediate(type: DataLayerEvent, callback?: DataLayerEventCallback, config?: EventConfig): void {
        this.#setup();
        super.onceImmediate(type, callback, config);
    }

    /**
     * Add an event listener for when a feature is added to the layer.
     *
     * @param {DataLayerEventCallback} callback The callback function to call when the event is dispatched.
     */
    onAddFeature(callback: DataLayerEventCallback): void {
        this.on(DataLayerEvents.ADD_FEATURE as DataLayerEvent, callback);
    }

    /**
     * Add an event listener for when a feature is clicked.
     *
     * The feature that was clicked is on the event object.
     *
     * layer.onClick((event) => { console.log(event.feature.getProperty('name')); });
     *
     * @param {DataLayerEventCallback} callback The callback function to call when the event is dispatched.
     */
    onClick(callback: DataLayerEventCallback): void {
        this.on(DataLayerEvents.CLICK as DataLayerEvent, callback);
    }

    /**
     * Add an event listener for when a feature is double clicked.
     *
     * @param {DataLayerEventCallback} callback The callback function to call when the event is dispatched.
     */
    onDblClick(callback: DataLayerEventCallback): void {
        this.on(DataLayerEvents.DBLCLICK as DataLayerEvent, callback);
    }

    /**
     * Add an event listener for when GeoJson data has finished loading.
     *
     * This is dispatched by loadGeoJson() and addGeoJson().
     *
     * @param {DataLayerEventCallback} callback The callback function to call when the event is dispatched.
     */
    onLoad(callback: DataLayerEventCallback): void {
        this.on(DataLayerEvents.LOAD as DataLayerEvent, callback);
    }

    /**
     * Add an event listener for when the mouse leaves a feature.
     *
     * @param {DataLayerEventCallback} callback The callback function to call when the event is dispatched.
     */
    onMouseOut(callback: DataLayerEventCallback): void {
        this.on(DataLayerEvents.MOUSE_OUT as DataLayerEvent, callback);
    }

    /**
     * Add an event listener for when the mouse moves over a feature.
     *
     * @param {DataLayerEventCallback} callback The callback function to call when the event is dispatched.
     */
    onMouseOver(callback: DataLayerEventCallback): void {
        this.on(DataLayerEvents.MOUSE_OVER as DataLayerEvent, callback);
    }

    /**
     * Add an event listener for when a feature is removed from the layer.
     *
     * @param {DataLayerEventCallback} callback The callback function to call when the event is dispatched.
     */
    onRemoveFeature(callback: DataLayerEventCallback): void {
        this.on(DataLayerEvents.REMOVE_FEATURE as DataLayerEvent, callback);
    }

    /**
     * Add an event listener for when a feature is right clicked.
     *
     * @param {DataLayerEventCallback} callback The callback function to call when the event is dispatched.
     */
    onRightClick(callback: DataLayerEventCallback): void {
        this.on(DataLayerEvents.RIGHT_CLICK as DataLayerEvent, callback);
    }

    /**
     * Set the style for one feature, overriding the layer style.
     *
     * https://developers.google.com/maps/documentation/javascript/reference/data#Data.overrideStyle
     *
     * @param {DataFeatureValue} feature The feature, or the feature id, to set the style on
     * @param {DataStyleOptions} style The style to set on the feature
     * @returns {DataLayer}
     */
    overrideStyle(feature: DataFeatureValue, style: DataStyleOptions): DataLayer {
        return this.#queue((data) => {
            const googleFeature = this.#googleFeatureFor(data, feature);
            if (googleFeature) {
                data.overrideStyle(googleFeature, this.#convertStyle(style));
            }
        });
    }

    /**
     * Remove a feature from the layer.
     *
     * @param {DataFeatureValue} feature The feature, or the feature id, to remove
     * @returns {DataLayer}
     */
    remove(feature: DataFeatureValue): DataLayer {
        return this.#queue((data) => {
            const googleFeature = this.#googleFeatureFor(data, feature);
            if (googleFeature) {
                data.remove(googleFeature);
            }
        });
    }

    /**
     * Remove the style override for a feature so that it uses the layer style again.
     *
     * If no feature is passed then the override is removed from every feature.
     *
     * @param {DataFeatureValue} [feature] The feature, or the feature id, to revert the style for
     * @returns {DataLayer}
     */
    revertStyle(feature?: DataFeatureValue): DataLayer {
        return this.#queue((data) => {
            if (isNullOrUndefined(feature)) {
                data.revertStyle();
            } else {
                const googleFeature = this.#googleFeatureFor(data, feature);
                if (googleFeature) {
                    data.revertStyle(googleFeature);
                }
            }
        });
    }

    /**
     * Add the data layer to the map object.
     *
     * @param {Map|null} value The map object. Set to null to remove the layer from the map.
     * @returns {Promise<DataLayer>}
     */
    async setMap(value: Map | null): Promise<DataLayer> {
        if (value instanceof Map) {
            super.setMap(value);
            this.#options.map = value;
            // Start the map loading. The layer is waiting for the Google maps library to load
            // and this makes sure that something is actually loading it.
            value.init();
            await this.#enqueue((data) => {
                data.setMap(value.toGoogle());
            });
        } else if (isNullOrUndefined(value)) {
            super.setMap(null);
            this.#options.map = null;
            await this.#enqueue((data) => {
                data.setMap(null);
            });
        }
        return this;
    }

    /**
     * Set the data layer options
     *
     * @param {DataLayerOptions} options The data layer options
     * @returns {DataLayer}
     */
    setOptions(options: DataLayerOptions): DataLayer {
        if (isObject(options)) {
            if (isStringWithValue(options.idProperty)) {
                this.#options.idProperty = options.idProperty;
            }
            if (isBoolean(options.fitBounds)) {
                this.#options.fitBounds = options.fitBounds;
            }
            if (options.style) {
                this.setStyle(options.style);
            }
            if (options.map) {
                this.setMap(options.map);
            }
            if (options.geoJson) {
                if (isString(options.geoJson) || Array.isArray(options.geoJson)) {
                    this.loadGeoJson(options.geoJson as string | string[]);
                } else {
                    this.addGeoJson(options.geoJson);
                }
            }
            if (isBoolean(options.visible)) {
                this.visible = options.visible;
            }
        }
        return this;
    }

    /**
     * Set the style to apply to the features in the layer.
     *
     * The style can either be a single style object that is applied to every feature, or a
     * function that is called for each feature and returns the style for it.
     *
     * This replaces the existing style rather than merging with it, which matches the
     * Google maps API. Set every value that you need each time.
     *
     * layer.setStyle({ fillColor: '#4caf50' });
     * layer.setStyle((feature) => ({ fillColor: feature.getProperty('color') }));
     *
     * https://developers.google.com/maps/documentation/javascript/reference/data#Data.setStyle
     *
     * @param {DataStyleValue} style The style to apply to the features in the layer
     * @returns {DataLayer}
     */
    setStyle(style: DataStyleValue): DataLayer {
        this.#style = style;
        return this.#queue(() => {
            this.#applyStyle();
        });
    }

    /**
     * Show the layer on the map.
     *
     * This will also set the map object if it's passed.
     *
     * @param {Map} [map] The map object to add the layer to
     * @returns {Promise<DataLayer>}
     */
    async show(map?: Map): Promise<DataLayer> {
        this.isVisible = true;
        if (map instanceof Map) {
            return this.setMap(map);
        }
        const mapObject = this.#mapObject();
        await this.#enqueue((data) => {
            if (mapObject) {
                data.setMap(mapObject.toGoogle());
            }
        });
        return this;
    }

    /**
     * Export every feature in the layer as a GeoJson object.
     *
     * The Google maps API method is callback based. This returns a promise instead.
     *
     * @returns {Promise<object>}
     */
    toGeoJson(): Promise<object> {
        return this.#enqueue(
            (data) =>
                new Promise<object>((resolve) => {
                    data.toGeoJson((geoJson) => {
                        resolve(geoJson);
                    });
                }),
        );
    }

    /**
     * Returns the Google maps Data object.
     *
     * The Data object may not exist yet so this returns a promise that resolves once it does.
     *
     * This waits for any calls that were already made on the layer, so the Data object that it
     * resolves with has had all of them applied to it.
     *
     * @returns {Promise<google.maps.Data>}
     */
    toGoogle(): Promise<google.maps.Data> {
        return this.#enqueue((data) => data);
    }

    /**
     * Add a feature with the given geometry to the layer
     *
     * @private
     * @param {google.maps.Data} data The Google maps Data object
     * @param {google.maps.Data.Geometry} geometry The geometry for the feature
     * @param {FeatureOptions} [options] The options for the feature
     * @returns {DataFeature}
     */
    #addFeature(
        data: google.maps.Data,
        geometry: google.maps.Data.Geometry,
        options?: FeatureOptions,
    ): DataFeature {
        const featureOptions: google.maps.Data.FeatureOptions = { geometry };
        if (isObject(options)) {
            if (isStringOrNumber(options.id)) {
                featureOptions.id = options.id;
            }
            if (isObject(options.properties)) {
                featureOptions.properties = options.properties;
            }
        }
        const googleFeature = data.add(featureOptions);
        if (isObject(options) && isObject(options.style)) {
            data.overrideStyle(googleFeature, this.#convertStyle(options.style));
        }
        return this.#featureFor(googleFeature);
    }

    /**
     * Handle the work that needs to happen after GeoJson data has been loaded
     *
     * @private
     * @param {google.maps.Data} data The Google maps Data object
     * @param {google.maps.Data.Feature[]} googleFeatures The features that were loaded
     * @param {LoadOptions} [options] The options that the data was loaded with
     * @returns {Promise<DataFeature[]>}
     */
    #afterLoad(
        data: google.maps.Data,
        googleFeatures: google.maps.Data.Feature[],
        options?: LoadOptions,
    ): Promise<DataFeature[]> {
        const features = googleFeatures.map((feature) => this.#featureFor(feature));
        this.dispatch(DataLayerEvents.LOAD);

        const fit = isObject(options) && isBoolean(options.fitBounds) ? options.fitBounds : this.#options.fitBounds;
        if (fit === true) {
            return this.#fitBounds(data).then(() => features);
        }
        return Promise.resolve(features);
    }

    /**
     * Apply the layer style to the Google maps Data object
     *
     * @private
     */
    #applyStyle(): void {
        if (!this.#data) {
            return;
        }
        const style = this.#style;
        if (isFunction(style)) {
            this.#data.setStyle((googleFeature) =>
                this.#convertStyle((style as (feature: DataFeature) => DataStyleOptions)(this.#featureFor(googleFeature))),
            );
        } else if (isObject(style)) {
            this.#data.setStyle(this.#convertStyle(style as DataStyleOptions));
        } else {
            this.#data.setStyle(null);
        }
    }

    /**
     * Convert an icon value to the value that the Google maps API needs.
     *
     * This has to be synchronous because the Google maps API uses the value that the style
     * function returns straight away. SvgSymbol.toGoogle() returns a promise, so a symbol that
     * hasn't resolved yet is left off the style and the style is applied again once it resolves.
     *
     * @private
     * @param {any} value The icon value from the style
     * @returns {any}
     */
    #convertIcon(value: any): any {
        if (value instanceof Icon) {
            return value.toGoogle();
        }
        if (value instanceof SvgSymbol) {
            const symbol = this.#svgSymbols.get(value);
            if (symbol) {
                return symbol;
            }
            value.toGoogle().then((resolved) => {
                this.#svgSymbols.set(value, resolved);
                // Setting the style again makes the Google maps API ask for the style of every
                // feature again, which is what gets the symbol onto the map.
                this.#applyStyle();
            });
            return undefined;
        }
        // A string url, or a Google icon or symbol object, is passed through as-is
        return value;
    }

    /**
     * Convert this library's style options to the Google maps style options
     *
     * @private
     * @param {DataStyleOptions} style The style options
     * @returns {google.maps.Data.StyleOptions}
     */
    #convertStyle(style: DataStyleOptions): google.maps.Data.StyleOptions {
        const styleOptions: google.maps.Data.StyleOptions = {};
        if (!isObject(style)) {
            return styleOptions;
        }
        ['cursor', 'fillColor', 'strokeColor', 'title'].forEach((key) => {
            if (isStringWithValue(style[key])) {
                styleOptions[key] = style[key];
            }
        });
        ['clickable', 'draggable', 'editable', 'visible'].forEach((key) => {
            if (isBoolean(style[key])) {
                styleOptions[key] = style[key];
            }
        });
        ['fillOpacity', 'strokeOpacity', 'strokeWeight', 'zIndex'].forEach((key) => {
            if (isNumberOrNumberString(style[key])) {
                styleOptions[key] = Number(style[key]);
            }
        });
        if (!isNullOrUndefined(style.icon)) {
            const icon = this.#convertIcon(style.icon);
            if (!isNullOrUndefined(icon)) {
                styleOptions.icon = icon;
            }
        }
        return styleOptions;
    }

    /**
     * Add a call to the end of the chain of calls waiting for the Google maps Data object.
     *
     * Calls are always run in the order that they were made, however long the map takes to
     * be ready. A call that fails doesn't stop the calls after it from running.
     *
     * @private
     * @param {Function} callback The function to call with the Google maps Data object
     * @returns {Promise}
     */
    #enqueue<T>(callback: (data: google.maps.Data) => T | Promise<T>): Promise<T> {
        const result = this.#pendingChain.then(() => this.#getGoogleData()).then((data) => callback(data));
        this.#pendingChain = result.then(
            () => undefined,
            () => undefined,
        );
        return result;
    }

    /**
     * Get the DataFeature object for a Google maps feature.
     *
     * The same Google feature always gets the same DataFeature object back.
     *
     * @private
     * @param {google.maps.Data.Feature} googleFeature The Google maps feature
     * @returns {DataFeature}
     */
    #featureFor(googleFeature: google.maps.Data.Feature): DataFeature {
        if (!googleFeature) {
            return undefined;
        }
        let feature = this.#features.get(googleFeature);
        if (!feature) {
            feature = new DataFeature(googleFeature, this);
            this.#features.set(googleFeature, feature);
        }
        return feature;
    }

    /**
     * Fit the map to the bounds of the data in the layer.
     *
     * This is the internal version that already has the Google maps Data object, so that it
     * can be called from within a queued call without waiting on the queue again.
     *
     * @private
     * @param {google.maps.Data} data The Google maps Data object
     * @returns {Promise<DataLayer>}
     */
    #fitBounds(data: google.maps.Data): Promise<DataLayer> {
        const mapObject = this.#mapObject();
        const { bounds, hasPositions } = DataLayer.#bounds(data);
        if (mapObject && hasPositions) {
            return mapObject.fitBounds(bounds).then(() => this);
        }
        return Promise.resolve(this);
    }

    /**
     * Get the GeoJson options to pass to the Google maps API
     *
     * @private
     * @param {LoadOptions} [options] The load options
     * @returns {google.maps.Data.GeoJsonOptions}
     */
    #geoJsonOptions(options?: LoadOptions): google.maps.Data.GeoJsonOptions {
        const idProperty = isObject(options) && isStringWithValue(options.idProperty)
            ? options.idProperty
            : this.#options.idProperty;
        if (isStringWithValue(idProperty)) {
            return { idPropertyName: idProperty };
        }
        return null;
    }

    /**
     * Set up the Google maps Data object if necessary.
     *
     * The map's own data layer needs the map to be set up first. Any other layer only needs the
     * Google maps library to be loaded, so data can be loaded into it before there's a map.
     *
     * The promise is held so that the Data object is only ever created once.
     *
     * @private
     * @returns {Promise<google.maps.Data>}
     */
    #getGoogleData(): Promise<google.maps.Data> {
        if (!this.#setupPromise) {
            this.#setupPromise = new Promise((resolve) => {
                if (this.#defaultLayerMap instanceof Map) {
                    // This is the map's own data layer so wait for the map to be ready
                    this.#defaultLayerMap.init().then(() => {
                        this.#setDataObject(this.#defaultLayerMap.toGoogle().data);
                        resolve(this.#data);
                    });
                } else if (checkForGoogleMaps('DataLayer', 'Data', false)) {
                    this.#setDataObject(new google.maps.Data());
                    resolve(this.#data);
                } else {
                    // The Google maps library hasn't loaded yet. Wait for it.
                    loader().onLoad(() => {
                        this.#setDataObject(new google.maps.Data());
                        // The map may have been set while waiting for the library to load
                        const mapObject = this.#mapObject();
                        if (mapObject && this.isVisible !== false) {
                            this.#data.setMap(mapObject.toGoogle());
                        }
                        resolve(this.#data);
                    });
                }
            });
        }
        return this.#setupPromise;
    }

    /**
     * Get the Google maps feature for a feature value
     *
     * @private
     * @param {google.maps.Data} data The Google maps Data object
     * @param {DataFeatureValue} feature The feature, or the feature id
     * @returns {google.maps.Data.Feature|undefined}
     */
    // eslint-disable-next-line class-methods-use-this -- This is grouped with the other private methods
    #googleFeatureFor(data: google.maps.Data, feature: DataFeatureValue): google.maps.Data.Feature | undefined {
        if (feature instanceof DataFeature) {
            return feature.toGoogle();
        }
        if (isStringOrNumber(feature)) {
            return data.getFeatureById(feature);
        }
        return undefined;
    }

    /**
     * Remove the existing features if the load options ask for it
     *
     * @private
     * @param {google.maps.Data} data The Google maps Data object
     * @param {LoadOptions} [options] The load options
     */
    // eslint-disable-next-line class-methods-use-this -- This is grouped with the other private methods
    #handleReplace(data: google.maps.Data, options?: LoadOptions): void {
        if (isObject(options) && options.replace === true) {
            DataLayer.#googleFeatures(data).forEach((feature) => {
                data.remove(feature);
            });
        }
    }

    /**
     * Get the map that the layer belongs to.
     *
     * For the map's own data layer this is still the map even after hide() has set the map
     * on the Google object to null.
     *
     * @private
     * @returns {Map|null}
     */
    #mapObject(): Map | null {
        const map = this.getMap();
        if (map instanceof Map) {
            return map;
        }
        return this.#defaultLayerMap ?? null;
    }

    /**
     * Add a call that doesn't return a value to the queue and return the layer so that
     * calls can be chained.
     *
     * @private
     * @param {Function} callback The function to call with the Google maps Data object
     * @returns {DataLayer}
     */
    #queue(callback: (data: google.maps.Data) => void): DataLayer {
        this.#enqueue(callback).catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
        });
        return this;
    }

    /**
     * Set the Google maps Data object and everything that depends on it
     *
     * @private
     * @param {google.maps.Data} data The Google maps Data object
     */
    #setDataObject(data: google.maps.Data): void {
        this.#data = data;
        this.setEventGoogleObject(data);
        this.#applyStyle();
        // Dispatch the event to say that the data layer is ready
        this.dispatch(DataLayerEvents.READY);
    }

    /**
     * Start setting up the Google maps Data object without waiting for it
     *
     * @private
     */
    #setup(): void {
        this.#getGoogleData().catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error);
        });
    }

    /**
     * Get the bounds of every feature in the Google maps Data object.
     *
     * Every Google geometry object supports forEachLatLng(), which walks nested geometries,
     * so this works for every geometry type without needing to handle each one.
     *
     * @private
     * @param {google.maps.Data} data The Google maps Data object
     * @returns {object} The bounds and whether any positions were found
     */
    static #bounds(data: google.maps.Data): { bounds: LatLngBounds; hasPositions: boolean } {
        const bounds = latLngBounds();
        let hasPositions = false;
        data.forEach((feature) => {
            const geometry = feature.getGeometry();
            if (geometry) {
                geometry.forEachLatLng((googleLatLng) => {
                    hasPositions = true;
                    bounds.extend(latLngConvert(googleLatLng));
                });
            }
        });
        return { bounds, hasPositions };
    }

    /**
     * Get every feature in the Google maps Data object as an array.
     *
     * The features are collected before they're worked on so that the collection isn't
     * being changed while forEach() is walking it.
     *
     * @private
     * @param {google.maps.Data} data The Google maps Data object
     * @returns {google.maps.Data.Feature[]}
     */
    static #googleFeatures(data: google.maps.Data): google.maps.Data.Feature[] {
        const features: google.maps.Data.Feature[] = [];
        data.forEach((feature) => {
            features.push(feature);
        });
        return features;
    }

    /**
     * Convert an array of positions to Google maps LatLng objects
     *
     * @private
     * @param {LatLngValue[]} path The positions to convert
     * @returns {google.maps.LatLng[]}
     */
    static #toPositions(path: LatLngValue[]): google.maps.LatLng[] {
        if (!Array.isArray(path)) {
            return [];
        }
        return path
            .map((value) => latLng(value))
            .filter((value) => value.isValid())
            .map((value) => value.toGoogle());
    }

    /**
     * Convert the positions for one ring of a polygon to Google maps LatLng objects.
     *
     * GeoJson repeats the first position at the end of a ring to close it. Google's LinearRing
     * closes itself, so the repeated position is dropped to avoid a duplicate corner.
     *
     * @private
     * @param {LatLngValue[]} ring The positions for the ring
     * @returns {google.maps.LatLng[]}
     */
    static #toRingPositions(ring: LatLngValue[]): google.maps.LatLng[] {
        const positions = Array.isArray(ring) ? ring.map((value) => latLng(value)).filter((value) => value.isValid()) : [];
        if (positions.length > 2 && positions[0].equals(positions[positions.length - 1])) {
            positions.pop();
        }
        return positions.map((value) => value.toGoogle());
    }

    /**
     * Work out whether the paths value is one ring of positions or an array of rings.
     *
     * A single position can itself be an array ([lat, lng]) so the first value is tested to
     * see if it's a valid position. If it is then this is one ring of positions.
     *
     * @private
     * @param {LatLngValue[]|LatLngValue[][]} paths The path, or array of paths, for a polygon
     * @returns {LatLngValue[][]}
     */
    static #toRings(paths: LatLngValue[] | LatLngValue[][]): LatLngValue[][] {
        if (!Array.isArray(paths) || paths.length === 0) {
            return [];
        }
        if (latLng(paths[0] as LatLngValue).isValid()) {
            return [paths as LatLngValue[]];
        }
        return paths as LatLngValue[][];
    }
}

// The possible types of values for the dataLayer function
export type DataLayerValue = DataLayer | DataLayerOptions;

/**
 * Helper function to set up the data layer object
 *
 * @param {DataLayerValue} [options] The data layer options or the data layer class
 * @returns {DataLayer}
 */
export const dataLayer = (options?: DataLayerValue): DataLayer => {
    if (options instanceof DataLayer) {
        return options;
    }
    return new DataLayer(options);
};
