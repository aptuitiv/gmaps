/* ===========================================================================
    Base class to help with drawing stuff on the map.

    See https://aptuitiv.github.io/gmaps/api-reference/base-classes/layer
    for documentation.
=========================================================================== */

import { LayerEvents } from './constants';
import { missingFeatureMessage } from './missingFeature';
import { EventCallback, Evented } from './Evented';
import { Map } from './Map';
import { Popup } from './Popup';

/**
 * Base class to help with drawing stuff on the map.
 *
 * Other classes, like InfoWindow add functionality to this class with the include() method.
 */
class Layer extends Evented {
    /**
     * This is an index signature so that Typescript doesn't complain about adding properties
     * to the class via mixins.
     *
     * For example, this lets us use attachTooltip() in the Marker class even though attachTooltip()
     * is applied to the layer via the Tooltip mixin.
     */
    [x: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any

    /**
     * Placeholders for the methods that the optional feature modules add to this class.
     *
     * Importing the popup, tooltip or InfoWindow module runs an include() that replaces these with
     * the real methods. They only ever run when the matching module hasn't been imported, which is
     * possible when importing from '@aptuitiv/gmaps/core' rather than '@aptuitiv/gmaps'. Without
     * them the call fails with "attachPopup is not a function", which doesn't say what to do about
     * it.
     *
     * @param {...any} args Ignored. The signature is permissive so that it doesn't narrow the real
     *      method's signature for anyone calling it.
     * @returns {any}
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, class-methods-use-this
    attachPopup(...args: any[]): any {
        throw new Error(missingFeatureMessage('attachPopup', 'popup'));
    }

    /**
     * @inheritdoc
     * @param {...any} args Ignored. See attachPopup().
     * @returns {any}
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, class-methods-use-this
    attachTooltip(...args: any[]): any {
        throw new Error(missingFeatureMessage('attachTooltip', 'tooltip'));
    }

    /**
     * @inheritdoc
     * @param {...any} args Ignored. See attachPopup().
     * @returns {any}
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, class-methods-use-this
    attachInfoWindow(...args: any[]): any {
        throw new Error(missingFeatureMessage('attachInfoWindow', 'infowindow'));
    }

    /**
     * Holds if the layer is visible or not
     *
     * @private
     * @type {boolean}
     */
    #isVisible: boolean = false;

    /**
     * Holds the Map object that the layer is added to
     *
     * @private
     * @type {Map|null}
     */
    #map: Map | null = null;

    /**
     * Holds the Popup object that the layer is added to
     *
     * @private
     * @type {Popup|null}
     */
    #popup: Popup | undefined;

    /**
     * Get if the layer is visible or not
     *
     * @returns {boolean}
     */
    get isVisible(): boolean {
        return this.#isVisible;
    }

    /**
     * Set if the layer is visible or not
     *
     * @param {boolean} value Whether the layer is visible or not
     */
    set isVisible(value: boolean) {
        if (typeof value === 'boolean') {
            this.#isVisible = value;
        } else {
            throw new Error('isVisible must be a boolean');
        }
    }

    /**
     * Return the Map object or null if the Map object is not set
     *
     * @returns {Map|null}
     */
    getMap(): Map | null {
        return this.#map;
    }

    /**
     * Return if the layer has a Map object set
     *
     * @returns {boolean}
     */
    hasMap(): boolean {
        return this.#map !== null;
    }

    /**
     * Initialize the layer
     *
     * This is intended to be overridden by subclasses to perform any initialization that is needed.
     * This is not intended to be called outside of this library.
     *
     * This is called by other objects that depend on the element being initialized before doing their thing.
     * For example, attaching a tooltip to a marker will wait for the marker to be initialized before attaching the tooltip.
     *
     * @internal
     * @returns {Promise<void>}
     */
    // eslint-disable-next-line class-methods-use-this -- This is intended to be overridden by subclasses
    init(): Promise<void> {
        return Promise.resolve();
    }

    /**
     * Set the Popup object that the layer is added to
     *
     * @internal
     * @param {Popup} popup The Popup object to add the layer to
     */
    setPopup(popup: Popup | null): void {
        this.#popup = popup ?? undefined;
    }

    /**
     * Close the popup for the layer
     *
     * @returns {void}
     */
    closePopup(): void {
        if (this.#popup) {
            this.#popup.close();
        }
    }

    /**
     * Get the Popup object that the layer is added to
     *
     * @returns {Popup|undefined}
     */
    getPopup(): Popup | undefined {
        return this.#popup;
    }

    /**
     * Check if the layer has a Popup object set
     *
     * @returns {boolean}
     */
    hasPopup(): boolean {
        return this.#popup !== undefined;
    }

    /**
     * Add an event listener for when the layer is loaded and ready for use.
     *
     * @param {EventCallback} [callback] The callback function to call when the event is dispatched.
     */
    onReady(callback: EventCallback): void {
        this.on(LayerEvents.READY, callback);
    }

    /**
     * Open the popup for the layer
     *
     * @returns {void}
     */
    openPopup(): void {
        if (this.#popup) {
            this.#popup.show(this);
        }
    }

    /**
     * Toggle the popup for the layer
     *
     * @returns {void}
     */
    togglePopup(): void {
        if (this.#popup) {
            this.#popup.toggle(this);
        }
    }

    /**
     * Clears the map object that the layer is added to
     *
     * Note, this does not remove the layer from the map, it just clears the map object from the layer.
     */
    removeMap() {
        this.#map = null;
    }

    /**
     * Sets the map object that the layer is added to
     *
     * This does not display the layer on the map, it only sets the map object for the layer.
     *
     * @param {Map} map The map object to add the layer to
     */
    setMap(map: Map | null) {
        this.#map = map;
        if (map) {
            this.isVisible = true;
        } else {
            this.isVisible = false;
        }
    }
}

export default Layer;
