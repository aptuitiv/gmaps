/* ===========================================================================
    Base class to be extended by classes that need to emit events.

    If you don't need events then you can just extend from the Base class.

    This is a wrapper around the EventTarget class to provide a more
    succinct interface for emitting events.

    See https://aptuitiv.github.io/gmaps/api-reference/base-classes/evented
    for documentation.
=========================================================================== */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* global google */

import { INTERNAL_EVENTS } from './constants';
import { checkForGoogleMaps, isFunction, isObject, isObjectWithValues, isString, objectEquals } from './helpers';
import Base from './Base';
import { latLng, LatLng } from './LatLng';
import { Point } from './Point';

// Base event callback data type
export type Event = {
    // The corresponding native DOM event. This comes from the Google Maps event data
    domEvent?: MouseEvent | TouchEvent | PointerEvent | KeyboardEvent | Event;
    // The data layer feature that the event occurred on.
    // This is only set for events dispatched by the DataLayer class, where it holds a DataFeature object.
    // It's typed loosely to avoid a circular dependency between this file and the DataFeature class.
    feature?: any;
    // The latitude/longitude that was below the cursor when the event occurred.
    latLng?: LatLng;
    // The placeId of the place that was below the cursor when the event occurred.
    // This is only set when the user clicks on an icon on the map.
    placeId?: string;
    // The pixel coordinates where the event occurred.
    pixel?: Point;
    // Call this function to stop the event from propagating further.
    // This comes from the Google Maps event data.
    stop?: () => void;
    // The event type.
    type: string;
};

// Type for the callback function
export type EventCallback = (event: Event) => void;

// Configuration for the event listener
export type EventConfig = {
    // If true then the event listener will be called immediately if the event has already been dispatched.
    // If the event is a "once" event then the listener will not be set up for future events.
    callImmediate?: boolean;
    // The context to bind the callback function to
    context?: object;
    // If true then the event listener callback will only be called once
    once?: boolean;
    // If true then only one listener will be added for this event type.
    // If the event has already been dispatched then the callback will be called immediately.
    only?: boolean;
};

// The actual options set for the event listener
export type EventListenerOptions = {
    once?: boolean;
};

// The data to hold for each event listener
export type EventListenerData = {
    callback: EventCallback;
    context?: object;
    options: EventListenerOptions;
};

// The collection of event listeners
type EventListeners = { [key: string]: EventListenerData[] };

// The data for each pending event listener
type PendingEventData = {
    callback: EventCallback;
    config?: EventConfig;
};
// The collection of pending event listeners
type PendingEvents = { [key: string]: PendingEventData[] };

/**
 * Evented class to add syntatic sugar to handling events
 */
export class Evented extends Base {
    /*
     * The containers below are only created when something is actually put in them.
     *
     * Every Marker, Polyline, Overlay, Popup, Tooltip, InfoWindow, DataFeature, Map and
     * DataLayer extends this class. Creating these up front meant four objects per instance
     * whether or not it ever had a listener, which is around 80,000 objects for a map with
     * 20,000 markers, most of them empty for the life of the page.
     *
     * Reads use optional chaining and writes create the container first, so an object that
     * never has a listener never allocates any of them.
     */

    /**
     * Holds the events that have been called
     *
     * @private
     * @type {object|undefined}
     */
    #eventsCalled: { [key: string]: boolean } | undefined;

    /**
     * Holds the event listeners
     *
     * @private
     * @type {EventListeners|undefined}
     */
    #eventListeners: EventListeners | undefined;

    /**
     * Holds the event listeners that are set to only be called once
     *
     * @private
     * @type {string[]|undefined}
     */
    #onlyEventListeners: string[] | undefined;

    /**
     * Holds the Google maps object that events are set up on
     *
     * @private
     * @type {google.maps.MVCObject| google.maps.marker.AdvancedMarkerElement}
     */
    // Definitely assigned because it's only used after #isGoogleObjectSet() confirms that it's set.
    #googleObject: google.maps.MVCObject | google.maps.marker.AdvancedMarkerElement | undefined;

    /**
     * Holds the listeners that this object added to the Google maps object, by event type.
     *
     * They're held so that only the listeners this object added are removed. Removing them with
     * google.maps.event.clearListeners() takes away every listener of that type on the object,
     * including ones added by other libraries - the marker clusterer listens for "idle" on the
     * map, for example, and would stop re-clustering.
     *
     * @private
     * @type {object}
     */
    #googleListeners: { [key: string]: google.maps.MapsEventListener } | undefined;

    /**
     * Holds the event listeners that are waiting to be added once the Google Maps object is set
     *
     * @private
     * @type {PendingEvents}
     */
    #pendingMapObjectEventListeners: PendingEvents | undefined;

    /**
     * The object that needs Google maps. This should be the name of the object that extends this class.
     *
     * This is used with checkForGoogleMaps() to check if the Google Maps library is loaded.
     *
     * @private
     * @type {string}
     */
    #testObject: string;

    /**
     * An optional Google maps library class to check for. This needs to be part of the google.maps object.
     *
     * This is used with checkForGoogleMaps() to check if the Google Maps library is loaded.
     *
     * @private
     * @type {string}
     */
    #testLibrary: string;

    /**
     * Constructor
     *
     * @param {string} objectType The object type for the class
     * @param {string} testObject The object that needs Google maps. This should be the name of the object that calls this method.
     * @param {string} [testLibrary] An optional Google maps library class to check for. This needs to be part of the google.maps object.
     */
    constructor(objectType: string, testObject: string, testLibrary?: string) {
        super(objectType);
        this.#testObject = testObject;
        if (isString(testLibrary)) {
            this.#testLibrary = testLibrary;
        } else {
            this.#testLibrary = testObject;
        }
    }

    /**
     * Dispatch an event
     *
     * @param {string} event The event to dispatch
     * @param {Event} [data] The data to pass to the event listener callback function.
     * @returns {Evented}
     */
    dispatch(event: string, data?: any): Evented {
        // Record that the event happened even when nothing is listening, because a listener
        // added later with callImmediate needs to know that it already fired.
        (this.#eventsCalled ??= {})[event] = true;

        // One lookup, held in a local. This used to call hasListener(), which looked the list up
        // twice more, and then look it up again here. dispatch() runs for every event on every
        // object, including per-frame ones like bounds_changed.
        const listeners = this.#eventListeners?.[event];
        if (listeners && listeners.length > 0) {
            // Set up the data to pass to the callback function
            let eventData: Event = {
                type: event,
            };
            if (isObject(data)) {
                // Test to see if this is a Google Maps event.
                // The MapMouseEvent, which other Google events extend from, has a domEvent property.
                if (typeof (data as google.maps.MapMouseEvent).domEvent !== 'undefined') {
                    const googleData = data as google.maps.MapMouseEvent;
                    eventData.domEvent = googleData.domEvent;
                    if (isFunction(googleData.stop)) {
                        eventData.stop = googleData.stop;
                    }
                    if (googleData.latLng) {
                        eventData.latLng = latLng(googleData.latLng.lat(), googleData.latLng.lng());
                    }
                    const { placeId } = data as google.maps.IconMouseEvent;
                    if (isString(placeId)) {
                        eventData.placeId = placeId;
                    }
                    // The data layer sets the feature that the event occurred on.
                    // The DataLayer class replaces the Google feature with a DataFeature object before dispatching.
                    if (typeof (data as any).feature !== 'undefined') {
                        eventData.feature = (data as any).feature;
                    }
                    if (typeof (data as any).pixel !== 'undefined') {
                        eventData.pixel = new Point((data as any).pixel.x, (data as any).pixel.y);
                    }
                } else {
                    // Merge the data with the event data
                    eventData = { ...eventData, ...(data as Event) };
                }
            }

            // Only created if a "once" listener is actually found. Most events don't have any,
            // and dispatch runs for every event on every object, so the array isn't worth
            // allocating up front.
            let listenersToRemove: EventListenerData[] | undefined;
            // Call the callback functions
            listeners.forEach((listener) => {
                listener.callback.call(listener.context || this, eventData);
                // If the event listener is set to be called once then add it to the list of listeners to remove.
                // #on() always sets the options object, so it's never undefined and never a non-object.
                if (listener.options.once === true) {
                    if (!listenersToRemove) {
                        listenersToRemove = [];
                    }
                    listenersToRemove.push(listener);
                }
            });

            // Remove the listeners that are set to be called once
            if (listenersToRemove) {
                this.removeCalledOnceListeners(event, listenersToRemove);
            }
        }
        return this;
    }

    /**
     * Test if there are any listeners for the given event type
     *
     * Optionally you can test if there are any listeners for the given event type and callback
     *
     * @param {string} type The event type to test for
     * @param {EventCallback} callback Optional callback function to include in the test
     * @returns {boolean}
     */
    hasListener(type: string, callback?: EventCallback): boolean {
        // One lookup held in a local, rather than up to three
        const listeners = this.#eventListeners?.[type];
        if (!listeners || listeners.length === 0) {
            return false;
        }
        if (typeof callback === 'function') {
            // some() stops at the first match and doesn't build an array to answer a boolean
            return listeners.some((event) => event.callback === callback);
        }
        return true;
    }

    /**
     * Removes the event listener
     *
     * There are three ways to remove event listeners:
     * 1. Remove a specific event listener
     *      this.off('click', onClickFunction);
     *      this.off('click', onClickFunction, options);
     * 2. Remove all listeners for a given event type
     *      this.off('click');
     * 3. Remove all listeners for all event types
     *     this.off();
     *     this.offAll();
     *
     * @param {string} [type] The event type
     * @param {EventCallback} [callback] The callback function to include when finding the event to remove
     * @param {EventListenerOptions} [options] The options to use when finding the event to remove
     */
    off(type?: string, callback?: EventCallback, options?: EventListenerOptions): void {
        if (isString(type)) {
            const eventListeners = this.#eventListeners;
            if (eventListeners && eventListeners[type]) {
                if (isFunction(callback)) {
                    // Compare the callback function and possibly the options to see if
                    // The event listener should be removed.
                    eventListeners[type] = eventListeners[type].filter((listener) => {
                        let keep = true;
                        if (isObject(options)) {
                            keep = listener.callback !== callback || !objectEquals(options, listener.options);
                        } else {
                            keep = listener.callback !== callback;
                        }
                        return keep;
                    });
                } else {
                    eventListeners[type] = [];
                }
                this.#afterListenersRemoved(type);
            }
        } else {
            this.offAll();
        }
    }

    /**
     * Clean up after event listeners for an event type have been removed
     *
     * @private
     * @param {string} type The event type
     */
    #afterListenersRemoved(type: string): void {
        // Remove the event listener from the onlyEventListeners array
        const onlyEventListeners = this.#onlyEventListeners;
        if (onlyEventListeners) {
            const index = onlyEventListeners.indexOf(type);
            if (index > -1) {
                onlyEventListeners.splice(index, 1);
            }
        }

        // If there are no more event listeners for the given type then remove the listener that
        // this object added to the Google maps object. Only that one is removed - see the comment
        // on #googleListeners for why. This also no longer needs #isGoogleObjectSet(), so it's
        // safe to call before the Google Maps library has loaded.
        if ((this.#eventListeners?.[type]?.length ?? 0) === 0) {
            const googleListeners = this.#googleListeners;
            if (googleListeners && googleListeners[type]) {
                googleListeners[type].remove();
                delete googleListeners[type];
            }
        }
    }

    /**
     * Remove the "once" event listeners that were just called for an event.
     *
     * They're all removed in a single pass. Calling off() for each one would search the whole
     * list of listeners each time, which gets slow when there are a lot of them. For example,
     * every marker that is added before the map is ready waits for the map's "ready" event.
     *
     * Subclasses can override this to remove the listeners from other objects as well.
     * This is not intended to be called outside of this library.
     *
     * @internal
     * @param {string} type The event type
     * @param {EventListenerData[]} listeners The listeners that were called
     */
    removeCalledOnceListeners(type: string, listeners: EventListenerData[]): void {
        const eventListeners = this.#eventListeners;
        if (eventListeners && eventListeners[type]) {
            const toRemove = new Set(listeners);
            eventListeners[type] = eventListeners[type].filter((listener) => !toRemove.has(listener));
            this.#afterListenersRemoved(type);
        }
    }

    /**
     * Removes all event listeners
     */
    offAll(): void {
        // Cleared rather than set to empty containers, so that an object that has had all of its
        // listeners removed holds no more than one that never had any
        this.#eventListeners = undefined;
        this.#onlyEventListeners = undefined;
        // Listeners that were waiting for the Google object aren't wanted any more either.
        // They used to be left behind and would be added when the Google object was set.
        this.#pendingMapObjectEventListeners = undefined;

        // Remove only the listeners that this object added to the Google maps object.
        // clearInstanceListeners() would remove every listener on the object, including ones
        // added by other libraries.
        const googleListeners = this.#googleListeners;
        if (googleListeners) {
            Object.keys(googleListeners).forEach((type) => {
                googleListeners[type].remove();
            });
            this.#googleListeners = undefined;
        }
    }

    /**
     * Add an event listener to the object
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener callback function
     * @param {EventConfig} [config] Configuration for the event.
     */
    on(type: string, callback: EventCallback, config?: EventConfig): void {
        this.#on(type, callback, config);
    }

    /**
     * Add an event listener to the object. It will be called immediately if the event has already been dispatched.
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener callback function
     * @param {EventConfig} [config] Configuration for the event.
     */
    onImmediate(type: string, callback: EventCallback, config?: EventConfig): void {
        const eventConfig = isObject(config) ? config : {};
        eventConfig.callImmediate = true;
        this.on(type, callback, eventConfig);
    }

    /**
     * Sets up an event listener that will only be called once
     *
     * @param {string} type The event type
     * @param {EventCallback} [callback] The event listener callback function
     * @param {EventConfig} [config] Configuration for the event.
     */
    once(type: string, callback?: EventCallback, config?: EventConfig): void {
        const eventConfig = isObject(config) ? config : {};
        eventConfig.once = true;
        // #on() throws an error if the callback isn't a function
        this.on(type, callback as EventCallback, eventConfig);
    }

    /**
     * Sets up an event listener that will only be called once. It will be called immediately if the event has already been dispatched.
     *
     * @param {string} type The event type
     * @param {EventCallback} [callback] The event listener callback function
     * @param {EventConfig} [config] Configuration for the event.
     */
    onceImmediate(type: string, callback?: EventCallback, config?: EventConfig): void {
        const eventConfig = isObject(config) ? config : {};
        eventConfig.once = true;
        eventConfig.callImmediate = true;
        // #on() throws an error if the callback isn't a function
        this.on(type, callback as EventCallback, eventConfig);
    }

    /**
     * Sets up an event listener that will have only one event listener for this type.
     *
     * It will be called immediately if the event has already been dispatched.
     *
     * The difference between this and on() is that only() will only set up one event listener for this type.
     *
     * @param {string} type The event type
     * @param {EventCallback} [callback] The event listener callback function
     * @param {EventConfig} [config] Configuration for the event.
     */
    only(type: string, callback: EventCallback, config?: EventConfig): void {
        const eventConfig = isObject(config) ? config : {};
        eventConfig.only = true;
        eventConfig.callImmediate = true;
        this.on(type, callback, eventConfig);
    }

    /**
     * Sets up an event listener that will only be called once and only one event listener for this type will be set up.
     *
     * It will be called immediately if the event has already been dispatched.
     *
     * The difference between this and once() is that onlyOnce() will only set up one event listener for this type.
     *
     * @param {string} type The event type
     * @param {EventCallback} [callback] The event listener callback function
     * @param {EventConfig} [config] Configuration for the event.
     */
    onlyOnce(type: string, callback: EventCallback, config?: EventConfig): void {
        const eventConfig = isObject(config) ? config : {};
        eventConfig.once = true;
        eventConfig.only = true;
        eventConfig.callImmediate = true;
        this.on(type, callback, eventConfig);
    }

    /**
     * Add an event listener to the object
     *
     * config:
     * - context: object - The context to bind the callback function to
     * - once: boolean - If true then the event listener will only be called once
     * - onlyOnce: boolean - If true then the event listener will only be called once and only one listener will be added for this event type.
     * - callImmediate: boolean - If true then the event listener will be called immediately if the event has already been dispatched
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener callback function
     * @param {EventConfig} [config] Configuration for the event.
     */
    #on(type: string, callback: EventCallback, config?: EventConfig): void {
        if (isFunction(callback)) {
            // If the event listener was not already set up then set it up on the Google maps object.
            // We only want to add the event listener to the Google maps object once. We can have multiple
            // internal event listeners, but because we are handling the event listener internally,
            // we only need to add it to the Google Maps object once.
            const existingListeners = this.#eventListeners?.[type];
            // Only wire the type through to the Google object if Google can actually fire it.
            // The library's own events (INTERNAL_EVENTS) are dispatched from this code, so a
            // native listener for one can never be called. Skipping them also keeps them out of
            // #pendingMapObjectEventListeners, which is where they ended up most of the time:
            // objects listen for "ready" before the Google object exists, so every one of them
            // queued an entry that setEventGoogleObject() then turned into a dead listener.
            if ((!existingListeners || existingListeners.length === 0) && !INTERNAL_EVENTS.includes(type)) {
                let setupPending = false;
                if (checkForGoogleMaps(this.#testObject, this.#testLibrary, false)) {
                    if (this.#isGoogleObjectSet()) {
                        // The Google maps object is set. Add a listener if this object hasn't
                        // already added one for this type, and keep hold of it so that it can be
                        // removed on its own later.
                        //
                        // This used to ask the Google object whether it had any listeners of this
                        // type, which meant a listener added by another library stopped this one
                        // from being added at all. That needed a special case for
                        // "bounds_changed" and "zoom_changed" to work around it. Tracking each
                        // listener separately removes the need for both.
                        const googleListeners = (this.#googleListeners ??= {});
                        // Read into a local so that it's checked rather than assumed. The check
                        // above proves there's an object, but only to a reader - the field is
                        // optional, so it has to be tested here for the compiler to agree.
                        const googleObject = this.#googleObject;
                        if (googleObject && !googleListeners[type]) {
                            googleListeners[type] = googleObject.addListener(
                                type,
                                (e: google.maps.MapMouseEvent) => {
                                    this.dispatch(type, e);
                                },
                            );
                        }
                    } else {
                        // The Google maps object is not set yet so so save the event listener so that it
                        // can be added to the Google map object once it's set up
                        setupPending = true;
                    }
                } else {
                    // The Google Maps library hasn't been loaded yet so save the event listener so that it
                    // can be added to the Google map object once the library is loaded and the Google maps object is set up.
                    setupPending = true;
                }

                // Set up the pending event listener if needed
                if (setupPending) {
                    const pending = (this.#pendingMapObjectEventListeners ??= {});
                    pending[type] ??= [];
                    pending[type].push({ callback, config });
                }
            }

            // Variable to hold if the listener should be added
            let addListener = true;
            // Options for the event listener
            const listenerOptions: EventListenerOptions = {};
            // The context to bind the callback function to
            let context: object | undefined;

            // If the event type is already in the list of onlyEventListeners then don't add the listener
            if (this.#onlyEventListeners?.includes(type)) {
                addListener = false;
            }

            // If the config object set then process it.
            if (addListener && isObjectWithValues(config)) {
                // Set up the options for the event listener
                if (typeof config.once === 'boolean' && config.once === true) {
                    listenerOptions.once = true;
                }
                if (typeof config.only === 'boolean' && config.only === true) {
                    (this.#onlyEventListeners ??= []).push(type);
                    if (this.hasListener(type)) {
                        // This is an event that should only be called once and only one listener should be added.
                        // If the event has already been dispatched then call the callback immediately.
                        addListener = false;
                    }
                }

                // Set up the context to bind the callback function to
                if (config.context) {
                    context = config.context;
                    if (context === this) {
                        // If the context is the same as the object, then set it to undefined to reduce memory footprint.
                        context = undefined;
                    }
                }

                // Check if the event should be called immediately if the even type has already been dispatched
                if (typeof config.callImmediate === 'boolean' && config.callImmediate === true) {
                    if (typeof this.#eventsCalled?.[type] !== 'undefined') {
                        if (typeof config.once === 'boolean' && config.once === true) {
                            // This is an event that should only be called once so remove the listener.
                            // If the event is not a "once" event then it's ok to add the listener.
                            addListener = false;
                        }
                        if (isFunction(callback)) {
                            callback.call(context || this, { type });
                        }
                    }
                }
            }

            if (addListener) {
                const eventListeners = (this.#eventListeners ??= {});
                eventListeners[type] ??= [];
                eventListeners[type].push({ callback, context, options: listenerOptions });
            }
        } else {
            throw new Error(`The "${type}" event handler needs a callback function`);
        }
    }

    /**
     * Set the Google maps MVC object
     *
     * This is the Google object that the object represents. Event listeners will be added to it.
     *
     * This should only be called from the class that extends this class.
     * This is not intended to be called from outside of this library.
     *
     * @internal
     * @param {google.maps.MVCObject| google.maps.marker.AdvancedMarkerElement} googleObject The Google maps MVC object
     */
    setEventGoogleObject(googleObject: google.maps.MVCObject | google.maps.marker.AdvancedMarkerElement): void {
        this.#googleObject = googleObject;

        // Set up the pending event listeners if there are any.
        // This handles siguations where the event was set up before the
        // Google maps object was set up.
        const pending = this.#pendingMapObjectEventListeners;
        if (pending) {
            const googleListeners = (this.#googleListeners ??= {});
            Object.keys(pending).forEach((type) => {
                // One Google listener per event type, not one per pending entry. The inner list
                // was only ever walked for its length, so several listeners registered before the
                // Google object existed each added their own Google listener, and every one of
                // them then dispatched to all of the callbacks.
                if (googleObject && !googleListeners[type]) {
                    googleListeners[type] = googleObject.addListener(
                        type,
                        (e: google.maps.MapMouseEvent) => {
                            this.dispatch(type, e);
                        },
                    );
                }
            });
            this.#pendingMapObjectEventListeners = undefined;
        }
    }

    /**
     * Returns if the Google object is set and ready to work with events
     *
     * @returns {boolean}
     */
    #isGoogleObjectSet(): boolean {
        // The Google Maps library may not have loaded yet. "google" is a bare global, so reading
        // google.maps without checking first throws a ReferenceError instead of returning false.
        // Objects can be created and have listeners added before the library loads, so this is
        // reached in normal use.
        if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
            return false;
        }
        let isSet = this.#googleObject instanceof google.maps.MVCObject;
        if (
            !isSet &&
            typeof google.maps.marker !== 'undefined' &&
            typeof google.maps.marker.AdvancedMarkerElement !== 'undefined'
        ) {
            isSet = this.#googleObject instanceof google.maps.marker.AdvancedMarkerElement;
        }
        return isSet;
    }

    /**
     * Triggers an event
     *
     * Alias to dispatch()
     *
     * @param {string} event The event to dispatch
     * @param {Event} [data] The data to pass to the event listener callback function.
     * @returns {Evented}
     */
    trigger(event: string, data?: any): Evented {
        return this.dispatch(event, data);
    }
}
