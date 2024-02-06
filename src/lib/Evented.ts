/* ===========================================================================
    Base class to be extended by classes that need to emit events.

    If you don't need events then you can just extend from the Base class.

    This is a wrapper around the EventTarget class to provide a more
    succinct interface for emitting events.
=========================================================================== */

/* global AddEventListenerOptions, EventListenerOrEventListenerObject */

import { isFunction, isObject, isString } from './helpers';
import BaseMixin from './BaseMixin';

/* eslint-disable @typescript-eslint/no-explicit-any */

type EventData = {
    callback: EventListenerOrEventListenerObject;
    options: AddEventListenerOptions | boolean;
};
type Events = { [key: string]: EventData[] };

/**
 * Evented class to add syntatic sugar to handling events
 */
class Evented extends EventTarget {
    /**
     * Holds the event listeners
     *
     * @private
     * @type {Events}
     */
    #eventListeners: Events = {};

    /**
     * Holds the object type
     *
     * @private
     * @type {string}
     */
    #objectType: string;

    /**
     * Holds the event listeners that are waiting to be added once the Google Maps API is loaded
     *
     * @private
     * @type {Events}
     */
    #pendingEventListeners: Events = {};

    /**
     * Constructor
     *
     * @param {string} objectType The object type for the class
     */
    constructor(objectType: string) {
        super();
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
     * Add an event listener that will be set up after the Google Maps API is loaded
     *
     * @param {string} [type] The event type
     * @param {Function} [callback] The event listener function
     * @param {object|boolean} [options] The options object or a boolean to indicate if the event should be captured
     */
    addPendingEventListener(
        type: string,
        callback: EventListenerOrEventListenerObject,
        options?: AddEventListenerOptions | boolean
    ) {
        if (!this.#pendingEventListeners[type]) {
            this.#pendingEventListeners[type] = [];
        }
        this.#pendingEventListeners[type].push({ callback, options });
    }

    /**
     * Sets up the pending event listeners so that they run now that the Google Maps API is loaded
     */
    setupPendingEventListeners() {
        Object.keys(this.#pendingEventListeners).forEach((type) => {
            this.#pendingEventListeners[type].forEach((event) => {
                this.on(type, event.callback, event.options);
            });
        });
        this.#pendingEventListeners = {};
    }

    /**
     * Dispatch an event
     *
     * @param {string} event The event to dispatch
     * @param {any} [data] The details to pass to the event. If set then a CustomEvent is created, otherwise a regular
     *      Event is created
     */
    dispatch(event: string, data?: any) {
        let eventData = {};
        if (isObject(data)) {
            eventData = { ...data, ...eventData };
        }
        if (Object.keys(eventData).length > 0) {
            super.dispatchEvent(new CustomEvent(event, { detail: eventData }));
        } else {
            super.dispatchEvent(new Event(event));
        }
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
     * @param {Function} [callback] The event listener function
     * @param {object|boolean} [options] The options object or a boolean to indicate if the event should be captured
     */
    off(type?: string, callback?: EventListenerOrEventListenerObject, options?: EventListenerOptions | boolean): void {
        if (isString(type) && isFunction(callback)) {
            // Remove the specific event listener
            this.removeEventListener(type, callback, options);
        } else if (isString(type)) {
            // Remove all listeners for the given event type
            if (this.#eventListeners[type]) {
                this.#eventListeners[type].forEach((event) => {
                    this.removeEventListener(type, event.callback, event.options);
                });
            }
        } else {
            this.offAll();
        }

        if (this.#eventListeners[type]) {
            this.#eventListeners[type] = this.#eventListeners[type].filter(
                (event) => event.callback !== callback && event.options !== options
            );
        }
    }

    /**
     * Removes all event listeners
     */
    offAll(): void {
        Object.keys(this.#eventListeners).forEach((type) => {
            this.#eventListeners[type].forEach((event) => {
                this.removeEventListener(type, event.callback, event.options);
            });
        });
        this.#eventListeners = {};
    }

    /**
     * Add an event listener to the object
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener function
     * @param {object|boolean} [options] The options object or a boolean to indicate if the event should be captured
     */
    on(type: string, callback: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean): void {
        this.addEventListener(type, callback, options);
        this.registerListener(type, callback, options);
    }

    /**
     * Sets up an event listener that will only be called once
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener function
     */
    once(type: string, callback: EventListenerOrEventListenerObject | null): void {
        this.on(type, callback, { once: true });
    }

    /**
     * Registers an event listener.
     *
     * This is used internally to keep track of event listeners so that you can test if there are any listeners for a
     * given event type.
     * This is also used to remove event listeners.
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener function
     * @param {object|boolean} [options] The options object or a boolean to indicate if the event should be captured
     */
    registerListener(
        type: string,
        callback: EventListenerOrEventListenerObject,
        options?: AddEventListenerOptions | boolean
    ): void {
        if (!this.#eventListeners[type]) {
            this.#eventListeners[type] = [];
        }
        this.#eventListeners[type].push({ callback, options });
    }

    /**
     * Test if there are any listeners for the given event type
     * Optionally you can test if there are any listeners for the given event type and callback
     * Optionally you can test if there are any listeners for the given event type, callback, and options
     *
     * @param {string} type The event type to test form
     * @param {EventListenerOrEventListenerObject} callback Optional callback function to include in the test
     * @param {AddEventListenerOptions | boolean} options Option options object to include in the test
     * @returns {boolean}
     */
    hasListener(
        type: string,
        callback?: EventListenerOrEventListenerObject,
        options?: AddEventListenerOptions | boolean
    ): boolean {
        if (!this.#eventListeners[type]) {
            return false;
        }
        if (typeof callback === 'function') {
            if (options) {
                return (
                    this.#eventListeners[type].filter(
                        (event) => event.callback === callback && event.options === options
                    ).length > 0
                );
            }
            return this.#eventListeners[type].filter((event) => event.callback === callback).length > 0;
        }
        return this.#eventListeners[type] && this.#eventListeners[type].length > 0;
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
}

Evented.include(BaseMixin);

export default Evented;
