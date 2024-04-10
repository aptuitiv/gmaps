import Base from './Base';
import { LatLng } from './LatLng';
import { Point } from './Point';
export type Event = {
    domEvent?: MouseEvent | TouchEvent | PointerEvent | KeyboardEvent | Event;
    latLng?: LatLng;
    placeId?: string;
    pixel?: Point;
    stop?: () => void;
    type: string;
};
export type EventCallback = (event: Event) => void;
export type EventOptions = {
    once?: boolean;
};
/**
 * Evented class to add syntatic sugar to handling events
 */
export declare class Evented extends Base {
    #private;
    /**
     * Constructor
     *
     * @param {string} objectType The object type for the class
     * @param {string} testObject The object that needs Google maps. This should be the name of the object that calls this method.
     * @param {string} [testLibrary] An optional Google maps library class to check for. This needs to be part of the google.maps object.
     */
    constructor(objectType: string, testObject: string, testLibrary?: string);
    /**
     * Dispatch an event
     *
     * @param {string} event The event to dispatch
     * @param {Event} [data] The data to pass to the event listener callback function.
     * @returns {Evented}
     */
    dispatch(event: string, data?: any): Evented;
    /**
     * Test if there are any listeners for the given event type
     *
     * Optionally you can test if there are any listeners for the given event type and callback
     *
     * @param {string} type The event type to test for
     * @param {EventCallback} callback Optional callback function to include in the test
     * @returns {boolean}
     */
    hasListener(type: string, callback?: EventCallback): boolean;
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
     * @param {EventOptions} [options] The options to use when finding the event to remove
     */
    off(type?: string, callback?: EventCallback, options?: EventOptions): void;
    /**
     * Removes all event listeners
     */
    offAll(): void;
    /**
     * Add an event listener to the object
     *
     * @param {string} type The event type
     * @param {Function} callback The event listener callback function
     * @param {EventOptions} [options] The options object
     * @param {object} [context] The context to bind the callback function to
     */
    on(type: string, callback: EventCallback, options?: EventOptions, context?: object): void;
    /**
     * Sets up an event listener that will only be called once
     *
     * @param {string} type The event type
     * @param {EventCallback} [callback] The event listener callback function
     * @param {object} [context] The context to bind the callback function to
     */
    once(type: string, callback?: EventCallback, context?: object): void;
    /**
     * Triggers an event
     *
     * Alias to dispatch()
     *
     * @param {string} event The event to dispatch
     * @param {Event} [data] The data to pass to the event listener callback function.
     * @returns {Evented}
     */
    trigger(event: string, data?: any): Evented;
}
