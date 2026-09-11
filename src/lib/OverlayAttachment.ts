/* ===========================================================================
    Shared machinery for attaching a Popup or a Tooltip to something.

    Two things live here.

    1. Working out what to show when a callback function was given instead of a fixed value.
       The callback can return the content, an options object, or a whole overlay object.

    2. Attaching an overlay to a data layer or to one of its features.
       The data layer needs its own handling because the features aren't separate objects on
       the map. Google draws them all through the one data layer object and fires the mouse
       events on that layer with the feature that they happened on. So the listeners go on the
       layer and the right overlay is worked out from the feature that comes with the event.

    Popup and Tooltip both extend Overlay and are attached in the same way, so both use this
    rather than each holding its own copy of it.
=========================================================================== */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { DataFeature } from './DataFeature';
import { DataLayer, DataLayerEventObject } from './DataLayer';
import { isFunction, isObject, isString, renderTemplate } from './helpers';
import { LatLng } from './LatLng';
import { Map } from './Map';
import { Overlay } from './Overlay';

// The events that can show an attached overlay
export type AttachEventValue = 'click' | 'clickon' | 'hover';

/**
 * What one kind of overlay needs to provide so that it can be attached.
 *
 * There is one of these for the Popup and one for the Tooltip.
 */
export type OverlayAttachmentAdapter = {
    // Build the overlay from a value that isn't already one. This is the popup() or tooltip() function.
    create: (value: any) => Overlay;
    // The event to use when none is given
    defaultEvent: AttachEventValue;
    // A name for this kind of overlay, so that a layer can have one of each attached
    kind: string;
    // Whether the value is already an overlay of this kind
    isOverlay: (value: any) => boolean;
    // Whether to hide the overlay before showing it.
    // The popup only pans the map to bring itself into view on the first draw after it's shown,
    // and hiding it resets that. Without it only the first popup would be brought into view.
    // A tooltip doesn't pan the map so it doesn't need this.
    resetBeforeShow: boolean;
};

// The overlay set up for a data layer, or for one feature within it
type AttachmentConfig = {
    // The function that works out the overlay, if one was given
    callback?: (feature: DataFeature) => any;
    event: AttachEventValue;
    // The overlay to show, and the one that content and options are set on
    overlay: Overlay;
    // The content holding {property} placeholders, if the content was a fixed string
    template?: string;
};

// Everything that one data layer needs to hold for one kind of overlay
type AttachmentState = {
    // The overlays attached to individual features
    features: WeakMap<DataFeature, AttachmentConfig>;
    // The overlay attached to the whole layer, used for any feature without its own
    layerConfig?: AttachmentConfig;
    // The event types that listeners have already been set up for
    listeners: { [key: string]: boolean };
    // The feature whose overlay is currently open, so that clicking it again closes it
    openFeature?: DataFeature;
    // The overlay that is currently open. A callback can return a different overlay object for
    // each feature, so this isn't always the overlay on the config.
    openOverlay?: Overlay;
};

// The state for each data layer, kept separately for each kind of overlay so that a layer can
// have both a popup and a tooltip attached to it
const attachmentStates: { [kind: string]: WeakMap<DataLayer, AttachmentState> } = {};

/**
 * Get the state for a data layer, setting it up if this is the first overlay of this kind on it
 *
 * @param {DataLayer} layer The data layer
 * @param {OverlayAttachmentAdapter} adapter The adapter for the kind of overlay being attached
 * @returns {AttachmentState}
 */
const getState = (layer: DataLayer, adapter: OverlayAttachmentAdapter): AttachmentState => {
    if (!attachmentStates[adapter.kind]) {
        attachmentStates[adapter.kind] = new WeakMap();
    }
    const states = attachmentStates[adapter.kind];
    let state = states.get(layer);
    if (!state) {
        state = { features: new WeakMap(), listeners: {} };
        states.set(layer, state);
    }
    return state;
};

/**
 * Apply the value that a callback returned and return the overlay to show.
 *
 * - An overlay object is shown instead of the one the callback belongs to.
 * - An options object is set on the overlay.
 * - Anything else is set as the overlay content.
 *
 * @param {Overlay} base The overlay that the callback is attached to
 * @param {any} value The value that the callback returned
 * @param {OverlayAttachmentAdapter} adapter The adapter for the kind of overlay
 * @returns {Overlay} The overlay to show
 */
export const overlayFromCallback = (base: Overlay, value: any, adapter: OverlayAttachmentAdapter): Overlay => {
    if (adapter.isOverlay(value)) {
        return value as Overlay;
    }
    if (isString(value) || value instanceof HTMLElement || value instanceof Text) {
        (base as any).setContent(value);
    } else if (isObject(value)) {
        (base as any).setOptions(value);
    }
    return base;
};

/**
 * Set up the configuration from the value that was passed to attachPopup() or attachTooltip()
 *
 * @param {any} value The content, the options, the overlay object, or a callback function
 * @param {AttachEventValue} event The event that shows the overlay
 * @param {OverlayAttachmentAdapter} adapter The adapter for the kind of overlay
 * @returns {AttachmentConfig}
 */
const buildConfig = (value: any, event: AttachEventValue, adapter: OverlayAttachmentAdapter): AttachmentConfig => {
    let callback: (feature: DataFeature) => any;
    let template: string;
    let overlay: Overlay;
    if (isFunction(value)) {
        // The overlay is worked out for each feature so it starts out with no content
        overlay = adapter.create({ content: '' });
        callback = value;
    } else {
        overlay = adapter.create(value);
        // A string is kept so that any {property} placeholders in it can be replaced for each feature
        const { content } = overlay as any;
        if (isString(content)) {
            template = content;
        }
    }
    // Let the overlay know how it's triggered. The popup doesn't pan the map into view for
    // hover events because that would move the feature out from under the cursor.
    (overlay as any).event = event;
    return { callback, event, overlay, template };
};

/**
 * Work out the overlay to show for a feature.
 *
 * A callback function is called with the feature and can return the content, an options object,
 * or a different overlay object. Otherwise the fixed content is used, with any {property}
 * placeholders replaced for this feature.
 *
 * @param {AttachmentConfig} config The configuration
 * @param {DataFeature} feature The feature to get the overlay for
 * @param {OverlayAttachmentAdapter} adapter The adapter for the kind of overlay
 * @returns {Overlay}
 */
const getOverlay = (
    config: AttachmentConfig,
    feature: DataFeature,
    adapter: OverlayAttachmentAdapter,
): Overlay => {
    if (isFunction(config.callback)) {
        return overlayFromCallback(config.overlay, config.callback(feature), adapter);
    }
    if (isString(config.template)) {
        (config.overlay as any).setContent(renderTemplate(config.template, (key) => feature.getProperty(key)));
    }
    return config.overlay;
};

/**
 * Show the overlay for a feature
 *
 * @param {AttachmentConfig} config The configuration
 * @param {DataFeature} feature The feature to show the overlay for
 * @param {LatLng} position The position to show the overlay at
 * @param {OverlayAttachmentAdapter} adapter The adapter for the kind of overlay
 * @param {Overlay} [openOverlay] The overlay that is currently open, if there is one
 * @returns {Overlay|undefined} The overlay that was shown
 */
const showOverlay = (
    config: AttachmentConfig,
    feature: DataFeature,
    position: LatLng,
    adapter: OverlayAttachmentAdapter,
    openOverlay?: Overlay,
): Overlay | undefined => {
    const { map } = feature.getLayer();
    if (!(map instanceof Map) || !position) {
        return undefined;
    }
    const overlay = getOverlay(config, feature, adapter);
    // A callback can return a different overlay object for each feature. Hide the one that was
    // showing, otherwise it would be left open on the map with nothing referring to it.
    if (openOverlay && openOverlay !== overlay) {
        openOverlay.hide();
    }
    if (adapter.resetBeforeShow) {
        overlay.hide();
    }
    overlay.setPosition(position);
    overlay.show(map);
    return overlay;
};

/**
 * Handle a mouse event on the data layer and show or hide the overlay for the feature
 *
 * @param {DataLayer} layer The data layer that the event happened on
 * @param {string} type The event type
 * @param {DataLayerEventObject} event The event data
 * @param {OverlayAttachmentAdapter} adapter The adapter for the kind of overlay
 * @returns {void}
 */
const handleEvent = (
    layer: DataLayer,
    type: string,
    event: DataLayerEventObject,
    adapter: OverlayAttachmentAdapter,
): void => {
    const state = attachmentStates[adapter.kind]?.get(layer);
    const { feature } = event;
    if (!state || !(feature instanceof DataFeature)) {
        return;
    }
    // An overlay on the feature itself wins over one attached to the whole layer
    const config = state.features.get(feature) || state.layerConfig;
    if (!config) {
        return;
    }

    if (type === 'mouseover') {
        if (config.event === 'hover') {
            const shown = showOverlay(config, feature, event.latLng, adapter, state.openOverlay);
            if (shown) {
                state.openFeature = feature;
                state.openOverlay = shown;
            }
        }
    } else if (type === 'mouseout') {
        if (config.event === 'hover' && state.openOverlay) {
            state.openOverlay.hide();
            state.openFeature = undefined;
            state.openOverlay = undefined;
        }
    } else if (config.event !== 'hover') {
        // Clicking the same feature again closes the overlay, unless it's a "clickon" overlay,
        // which stays open once it's shown.
        if (config.event === 'click' && state.openOverlay?.isVisible && state.openFeature === feature) {
            state.openOverlay.hide();
            state.openFeature = undefined;
            state.openOverlay = undefined;
            return;
        }
        const shown = showOverlay(config, feature, event.latLng, adapter, state.openOverlay);
        if (shown) {
            state.openFeature = feature;
            state.openOverlay = shown;
        }
    }
};

/**
 * Set up the event listeners on the data layer.
 *
 * The listeners are only set up once for each event type however many overlays are attached.
 *
 * @param {DataLayer} layer The data layer
 * @param {AttachEventValue} event The event that shows the overlay
 * @param {OverlayAttachmentAdapter} adapter The adapter for the kind of overlay
 * @returns {void}
 */
const setupListeners = (layer: DataLayer, event: AttachEventValue, adapter: OverlayAttachmentAdapter): void => {
    const state = getState(layer, adapter);
    if (event !== 'hover' && !state.listeners.click) {
        state.listeners.click = true;
        layer.onClick((e) => {
            handleEvent(layer, 'click', e, adapter);
        });
    }
    if (event === 'hover' && !state.listeners.hover) {
        state.listeners.hover = true;
        layer.onMouseOver((e) => {
            handleEvent(layer, 'mouseover', e, adapter);
        });
        layer.onMouseOut((e) => {
            handleEvent(layer, 'mouseout', e, adapter);
        });
    }
};

/**
 * Attach an overlay to every feature in a data layer
 *
 * @param {DataLayer} layer The data layer to attach the overlay to
 * @param {any} value The content, the options, the overlay object, or a callback function
 * @param {AttachEventValue} [event] The event that shows the overlay
 * @param {OverlayAttachmentAdapter} adapter The adapter for the kind of overlay
 * @returns {Overlay}
 */
export const attachToDataLayer = (
    layer: DataLayer,
    value: any,
    event: AttachEventValue,
    adapter: OverlayAttachmentAdapter,
): Overlay => {
    const triggerEvent = event || adapter.defaultEvent;
    const config = buildConfig(value, triggerEvent, adapter);
    getState(layer, adapter).layerConfig = config;
    setupListeners(layer, triggerEvent, adapter);
    return config.overlay;
};

/**
 * Attach an overlay to one feature within a data layer
 *
 * @param {DataFeature} feature The feature to attach the overlay to
 * @param {any} value The content, the options, the overlay object, or a callback function
 * @param {AttachEventValue} [event] The event that shows the overlay
 * @param {OverlayAttachmentAdapter} adapter The adapter for the kind of overlay
 * @returns {Overlay}
 */
export const attachToDataFeature = (
    feature: DataFeature,
    value: any,
    event: AttachEventValue,
    adapter: OverlayAttachmentAdapter,
): Overlay => {
    const triggerEvent = event || adapter.defaultEvent;
    const config = buildConfig(value, triggerEvent, adapter);
    const layer = feature.getLayer();
    getState(layer, adapter).features.set(feature, config);
    setupListeners(layer, triggerEvent, adapter);
    return config.overlay;
};
