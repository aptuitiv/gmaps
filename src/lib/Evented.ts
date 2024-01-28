/* ===========================================================================
    Base class to be extended by classes that need to emit events.

    This is a wrapper around the EventTarget class to provide a more
    succinct interface for emitting events.
=========================================================================== */

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
     * @type {object}
     */
    private eventListeners: Events = {};

    /**
     * Dispatch an event
     *
     * @param {string} event The event to dispatch
     * @param {any} [details] The details to pass to the event. If set then a CustomEvent is created, otherwise a regular
     *      Event is created
     */
    dispatch(event: string, details?: any) {
        if (details) {
            super.dispatchEvent(new CustomEvent(event, { detail: details }));
        } else {
            super.dispatchEvent(new Event(event));
        }
    }

    /**
     * Removes the event listener
     *
     * @param {string} type The event type
     * @param {function} callback The event listener function
     * @param {object|boolean} [options] The options object or a boolean to indicate if the event should be captured
     */
    off(type: string, callback: EventListenerOrEventListenerObject, options?: EventListenerOptions | boolean): void {
        this.removeEventListener(type, callback, options);
        if (this.eventListeners[type]) {
            this.eventListeners[type] = this.eventListeners[type].filter(
                (event) => event.callback !== callback && event.options !== options
            );
        }
    }

    /**
     * Add an event listener to the object
     *
     * @param {string} type The event type
     * @param {function} callback The event listener function
     * @param {object|boolean} [options] The options object or a boolean to indicate if the event should be captured
     */
    on(type: string, callback: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean): void {
        this.addEventListener(type, callback, options);
        // Add the event type to the events object so that you can test if there are any listeners for a given event
        if (!this.eventListeners[type]) {
            this.eventListeners[type] = [];
        }
        this.eventListeners[type].push({ callback, options });
    }

    /**
     * Sets up an event listener that will only be called once
     *
     * @param {string} type The event type
     * @param {function} callback The event listener function
     */
    once(type: string, callback: EventListenerOrEventListenerObject | null): void {
        this.on(type, callback, { once: true });
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
        if (!this.eventListeners[type]) {
            return false;
        }
        if (typeof callback === 'function') {
            if (options) {
                return (
                    this.eventListeners[type].filter(
                        (event) => event.callback === callback && event.options === options
                    ).length > 0
                );
            }
            return this.eventListeners[type].filter((event) => event.callback === callback).length > 0;
        }
        return this.eventListeners[type] && this.eventListeners[type].length > 0;
    }
}

export default Evented;
