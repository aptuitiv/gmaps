export type EventCallbackData = {
    [key: string]: string | number | boolean | object;
};
/**
 * Evented class to add syntatic sugar to handling events
 */
export declare class Evented extends EventTarget {
    /**
     * Holds the event callback data
     *
     * @type {object}
     */
    private eventCallbackData;
    /**
     * Holds the event listeners
     *
     * @type {object}
     */
    private eventListeners;
    /**
     * Gets the event callback data
     * This is the data that will be passed to the event callback function
     *
     * @returns {EventCallbackData}
     */
    getEventCallbackData(): EventCallbackData;
    /**
     * Sets the event callback data
     *
     * @param {EventCallbackData} data The event callback data
     */
    setEventCallbackData(data: EventCallbackData): void;
    /**
     * Dispatch an event
     *
     * @param {string} event The event to dispatch
     * @param {any} [data] The details to pass to the event. If set then a CustomEvent is created, otherwise a regular
     *      Event is created
     */
    dispatch(event: string, data?: any): void;
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
     * @param {function} [callback] The event listener function
     * @param {object|boolean} [options] The options object or a boolean to indicate if the event should be captured
     */
    off(type?: string, callback?: EventListenerOrEventListenerObject, options?: EventListenerOptions | boolean): void;
    /**
     * Removes all event listeners
     */
    offAll(): void;
    /**
     * Add an event listener to the object
     *
     * @param {string} type The event type
     * @param {function} callback The event listener function
     * @param {object|boolean} [options] The options object or a boolean to indicate if the event should be captured
     */
    on(type: string, callback: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean): void;
    /**
     * Sets up an event listener that will only be called once
     *
     * @param {string} type The event type
     * @param {function} callback The event listener function
     */
    once(type: string, callback: EventListenerOrEventListenerObject | null): void;
    /**
     * Registers an event listener.
     *
     * This is used internally to keep track of event listeners so that you can test if there are any listeners for a
     * given event type.
     * This is also used to remove event listeners.
     *
     * @param {string} type The event type
     * @param {function} callback The event listener function
     * @param {object|boolean} [options] The options object or a boolean to indicate if the event should be captured
     */
    registerListener(type: string, callback: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean): void;
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
    hasListener(type: string, callback?: EventListenerOrEventListenerObject, options?: AddEventListenerOptions | boolean): boolean;
}
