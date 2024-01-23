/* ===========================================================================
    Base class to be extended by classes that need to emit events.

    This is a wrapper around the EventTarget class to provide a more
    succinct interface for emitting events.
=========================================================================== */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Evented class to add syntatic sugar to handling events
 */
class Evented extends EventTarget {
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
        }
        super.dispatchEvent(new Event(event));
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
}

export default Evented;
