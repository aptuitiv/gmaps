/* ===========================================================================
    Base class to be extended by classes that need to emit events.

    If you don't need events then you can just extend from the Base class.

    This is a wrapper around the EventTarget class to provide a more
    succinct interface for emitting events.

    See https://aptuitiv.github.io/gmaps-docs/api-reference/base-classes/evented
    for documentation.
=========================================================================== */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* global google */

import { checkForGoogleMaps, isFunction, isObject, isObjectWithValues, isString, objectEquals } from './helpers';
import Base from './Base';
import { latLng, LatLng } from './LatLng';
import { Point } from './Point';

// Base event callback data type
export type Event = {
    // The corresponding native DOM event. This comes from the Google Maps event data
    domEvent?: MouseEvent | TouchEvent | PointerEvent | KeyboardEvent | Event;
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
type EventListenerData = {
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
    /**
     * Holds the events that have been called
     */
    #eventsCalled: object = {};

    /**
     * Holds the event listeners
     *
     * @private
     * @type {EventListeners}
     */
    #eventListeners: EventListeners = {};

    /**
     * Holds the event listeners that are set to only be called once
     *
     * @private
     * @type {string[]}
     */
    #onlyEventListeners: string[] = [];

    /**
     * Holds the Google maps object that events are set up on
     *
     * @private
     * @type {google.maps.MVCObject| google.maps.marker.AdvancedMarkerElement}
     */
    #googleObject: google.maps.MVCObject | google.maps.marker.AdvancedMarkerElement;

    /**
     * Holds whether the onload event was set on the Loader class to
     * set up the pending event listeners after the Google Maps API library is loaded.
     *
     * @private
     * @type {boolean}
     */
    #isOnLoadEventSet: boolean = false;

    /**
     * Holds the event listeners that are waiting to be added once the Google Maps API is loaded
     *
     * @private
     * @type {PendingEvents}
     */
    #pendingLoadEventListeners: PendingEvents = {};

    /**
     * Holds the event listeners that are waiting to be added once the Google Maps object is set
     *
     * @private
     * @type {PendingEvents}
     */
    #pendingMapObjectEventListeners: PendingEvents = {};

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
        this.#eventsCalled[event] = true;

        if (!this.hasListener(event)) {
            return this;
        }

        // Dispatch the event
        const listeners = this.#eventListeners[event];
        if (listeners) {
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
                    if (typeof googleData.latLng !== 'undefined') {
                        eventData.latLng = latLng(googleData.latLng.lat(), googleData.latLng.lng());
                    }
                    if (typeof (data as google.maps.IconMouseEvent).placeId !== 'undefined') {
                        eventData.placeId = (data as google.maps.IconMouseEvent).placeId;
                    }
                    if (typeof (data as any).pixel !== 'undefined') {
                        eventData.pixel = new Point((data as any).pixel.x, (data as any).pixel.y);
                    }
                } else {
                    // Merge the data with the event data
                    eventData = { ...eventData, ...(data as Event) };
                }
            }

            const listenersToRemove: EventListenerData[] = [];
            // Call the callback functions
            listeners.forEach((listener) => {
                listener.callback.call(listener.context || this, eventData);
                // If the event listener is set to be called once then add it to the list of listeners to remove
                if (
                    typeof listener.options !== 'undefined' &&
                    isObject(listener.options) &&
                    typeof listener.options.once === 'boolean' &&
                    listener.options.once === true
                ) {
                    listenersToRemove.push(listener);
                }
            });

            // Remove the listeners that are set to be called once
            listenersToRemove.forEach((listener) => {
                this.off(event, listener.callback, listener.options);
            });
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
        if (!this.#eventListeners[type]) {
            return false;
        }
        if (typeof callback === 'function') {
            return this.#eventListeners[type].filter((event) => event.callback === callback).length > 0;
        }
        return this.#eventListeners[type] && this.#eventListeners[type].length > 0;
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
            if (this.#eventListeners[type]) {
                if (isFunction(callback)) {
                    // Compare the callback function and possibly the options to see if
                    // The event listener should be removed.
                    this.#eventListeners[type] = this.#eventListeners[type].filter((listener) => {
                        let keep = true;
                        if (isObject(options)) {
                            keep = listener.callback !== callback || !objectEquals(options, listener.options);
                        } else {
                            keep = listener.callback !== callback;
                        }
                        return keep;
                    });
                } else {
                    this.#eventListeners[type] = [];
                }

                // Remove the event listener from the onlyEventListeners array
                const index = this.#onlyEventListeners.indexOf(type);
                if (index > -1) {
                    this.#onlyEventListeners.splice(index, 1);
                }
            }

            // If there are no more event listeners for the given type then remove the listener from the Google maps object
            if (this.#eventListeners[type].length === 0 && this.#isGoogleObjectSet()) {
                google.maps.event.clearListeners(this.#googleObject, type);
            }
        } else {
            this.offAll();
        }
    }

    /**
     * Removes all event listeners
     */
    offAll(): void {
        this.#eventListeners = {};
        this.#onlyEventListeners = [];

        // Remove all event listeners from the Google maps object
        if (this.#isGoogleObjectSet()) {
            google.maps.event.clearInstanceListeners(this.#googleObject);
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
        this.on(type, callback, eventConfig);
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
        this.on(type, callback, eventConfig);
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
            if (!Array.isArray(this.#eventListeners[type]) || this.#eventListeners[type].length === 0) {
                let setupPending = false;
                if (checkForGoogleMaps(this.#testObject, this.#testLibrary, false)) {
                    if (this.#isGoogleObjectSet()) {
                        // The Google maps object is set
                        // Make sure the event listener is not already set up
                        if (!google.maps.event.hasListeners(this.#googleObject, type)) {
                            this.#googleObject.addListener(type, (e: google.maps.MapMouseEvent) => {
                                this.dispatch(type, e);
                            });
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
                    if (!this.#pendingMapObjectEventListeners[type]) {
                        this.#pendingMapObjectEventListeners[type] = [];
                    }
                    this.#pendingMapObjectEventListeners[type].push({ callback, config });
                }
            }

            // Variable to hold if the listener should be added
            let addListener = true;
            // Options for the event listener
            const listenerOptions: EventListenerOptions = {};
            // The context to bind the callback function to
            let context: object;

            // If the event type is already in the list of onlyEventListeners then don't add the listener
            if (this.#onlyEventListeners.includes(type)) {
                addListener = false;
            }

            // If the config object set then process it.
            if (addListener && isObjectWithValues(config)) {
                // Set up the options for the event listener
                if (typeof config.once === 'boolean' && config.once === true) {
                    listenerOptions.once = true;
                }
                if (typeof config.only === 'boolean' && config.only === true) {
                    this.#onlyEventListeners.push(type);
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
                    if (typeof this.#eventsCalled[type] !== 'undefined') {
                        if (typeof config.once === 'boolean' && config.once === true) {
                            // This is an event that should only be called once so remove the listener.
                            // If the event is not a "once" event then it's ok to add the listener.
                            addListener = false;
                        }
                        if (isFunction(callback)) {
                            callback.call(context || this);
                        }
                    }
                }
            }

            if (addListener) {
                if (!this.#eventListeners[type]) {
                    this.#eventListeners[type] = [];
                }
                this.#eventListeners[type].push({ callback, context, options: listenerOptions });
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
        if (isObject(this.#pendingMapObjectEventListeners)) {
            Object.keys(this.#pendingMapObjectEventListeners).forEach((type) => {
                this.#pendingMapObjectEventListeners[type].forEach(() => {
                    this.#googleObject.addListener(type, (e: google.maps.MapMouseEvent) => {
                        this.dispatch(type, e);
                    });
                });
            });
            this.#pendingMapObjectEventListeners = {};
        }
    }

    /**
     * Returns if the Google object is set and ready to work with events
     *
     * @returns {boolean}
     */
    #isGoogleObjectSet(): boolean {
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
