/* ===========================================================================
    A thing attached to the map.

    Anything positioned on a map through map.controls is a control: a button, a logo, a legend, a
    message that appears when a search finds nothing. What they have in common isn't that they're
    interactive - it's that each is an element whose lifecycle on the map has to be managed.

    Map.addCustomControl() puts an element on the map and that's all it does. It gives back no handle
    on what it added, so nothing can be moved or taken off again afterwards - and removing something
    can't be done from outside the library at all, because map.controls holds google.maps.MVCArray
    objects that have to be searched by index. This class owns that lifecycle, and is the base for
    controls with behaviour of their own.

    It decides nothing about how a control looks. Every class name, every piece of content and every
    attribute comes from the caller, and no stylesheet ships with the library.

    See https://aptuitiv.github.io/gmaps/api-reference/map-controls/control for documentation.
=========================================================================== */

import { ControlPosition, ControlPositionValue } from './constants';
import { Evented } from './Evented';
import { isFunction, isObject, isString, isStringWithValue } from './helpers';
import { Map } from './Map';

// Google orders the controls at a position by an "index" property that it reads off the element.
// It isn't part of HTMLElement, so it's described here rather than cast at every use.
type OrderedElement = HTMLElement & { index?: number };

export type ControlOptions = {
    // Attributes to set on the element when it's built
    attributes?: { [key: string]: string };
    // Class name(s) for the element when it's built
    className?: string;
    // The contents when the element is built. An HTML string, an element to append, or a function
    // returning either.
    content?: string | HTMLElement | (() => string | HTMLElement);
    // An existing element, or a selector for one. When this is set nothing is built and the element
    // is used exactly as it is.
    element?: HTMLElement | string;
    // The order among the controls at the same position. Lower numbers come first. Defaults to 0.
    index?: number;
    // The map to attach to. It can be attached later with addTo() instead.
    map?: Map;
    // Where the control goes on the map
    position?: ControlPositionValue;
    // The tag to build the element from. Defaults to 'div'.
    tag?: string;
};

/**
 * The control class
 */
export class Control extends Evented {
    /**
     * The element for the control
     *
     * @private
     * @type {OrderedElement}
     */
    #element: OrderedElement;

    /**
     * The map the control is attached to, if it is attached
     *
     * @private
     * @type {Map|undefined}
     */
    #map: Map | undefined;

    /**
     * The position the control is displayed at
     *
     * @private
     * @type {ControlPositionValue}
     */
    #position: ControlPositionValue = ControlPosition.BLOCK_START_INLINE_START;

    /**
     * Class constructor
     *
     * @param {ControlOptions} [options] The options for the control
     * @param {string} [objectType] The type of object for a subclass. Defaults to 'control'.
     * @param {string} [testObject] The name of the object for a subclass. Defaults to 'Control'.
     */
    constructor(options?: ControlOptions, objectType: string = 'control', testObject: string = 'Control') {
        super(objectType, testObject);

        this.#element = this.#resolveElement(options);
        // Set before the element is added to a map, so that the first render has the right order
        this.index = options?.index ?? 0;

        if (isObject(options)) {
            if (options.position) {
                this.position = options.position;
            }
            if (options.map instanceof Map) {
                this.addTo(options.map);
            }
        }
    }

    /**
     * Get the element for the control
     *
     * @returns {HTMLElement}
     */
    get element(): HTMLElement {
        return this.#element;
    }

    /**
     * Get the order among the controls at the same position
     *
     * @returns {number}
     */
    get index(): number {
        return this.#element.index ?? 0;
    }

    /**
     * Set the order among the controls at the same position.
     *
     * Google reads this off the element when it lays the controls out, so it only takes effect for a
     * control that hasn't been added yet, or after it's been removed and added again.
     *
     * @param {number} value The order. Lower numbers come first.
     */
    set index(value: number) {
        if (typeof value === 'number' && !Number.isNaN(value)) {
            this.#element.index = value;
        }
    }

    /**
     * Get whether the control is attached to a map
     *
     * @returns {boolean}
     */
    get isAttached(): boolean {
        return typeof this.#map !== 'undefined';
    }

    /**
     * Get the map the control is attached to, or undefined if it isn't attached
     *
     * @returns {Map|undefined}
     */
    get map(): Map | undefined {
        return this.#map;
    }

    /**
     * Get the position the control is displayed at
     *
     * @returns {ControlPositionValue}
     */
    get position(): ControlPositionValue {
        return this.#position;
    }

    /**
     * Set the position the control is displayed at.
     *
     * An attached control is moved to the new position.
     *
     * @param {ControlPositionValue} value The position for the control
     */
    set position(value: ControlPositionValue) {
        if (!Object.values(ControlPosition).includes(value)) {
            // eslint-disable-next-line no-console
            console.warn('The control position that you provided is not valid. You provided: ', value);
            return;
        }
        if (value === this.#position) {
            return;
        }
        const map = this.#map;
        if (map) {
            // Taken off the old position and put back at the new one. There's no way to move
            // something between the position arrays that Google keeps.
            map.removeCustomControl(this.#element);
            this.#position = value;
            map.addCustomControl(this.#position, this.#element);
        } else {
            this.#position = value;
        }
    }

    /**
     * Attach the control to a map.
     *
     * This works before the map has been rendered. The map holds the control until it renders and
     * then adds it.
     *
     * @param {Map} map The map to attach the control to
     * @returns {Control}
     */
    addTo(map: Map): Control {
        if (!(map instanceof Map)) {
            // eslint-disable-next-line no-console
            console.warn('You must pass a Map object to add a control to.', map);
            return this;
        }
        if (this.#map === map) {
            return this;
        }
        // Attached elsewhere, so take it off that map first. Otherwise the same element would be in
        // two maps' control arrays and only one of them would have it.
        if (this.#map) {
            this.remove();
        }
        this.#map = map;
        map.addCustomControl(this.#position, this.#element);
        this.dispatch('add', { control: this });
        return this;
    }

    /**
     * Take the control off the map.
     *
     * The element is left in place rather than destroyed, so the control can be added again, and so
     * that an element the caller supplied is still theirs afterwards.
     *
     * @returns {Control}
     */
    remove(): Control {
        const map = this.#map;
        if (map) {
            map.removeCustomControl(this.#element);
            this.#map = undefined;
            this.dispatch('remove', { control: this });
        }
        return this;
    }

    /**
     * Work out the element to use, either the one that was passed or a new one built from the options
     *
     * @private
     * @param {ControlOptions} [options] The options for the control
     * @returns {OrderedElement}
     */
    // eslint-disable-next-line class-methods-use-this
    #resolveElement(options?: ControlOptions): OrderedElement {
        const existing = options?.element;
        if (existing instanceof HTMLElement) {
            return existing;
        }
        if (isStringWithValue(existing)) {
            const found = document.querySelector(existing);
            if (found instanceof HTMLElement) {
                return found;
            }
            // eslint-disable-next-line no-console
            console.warn(`No element was found for the selector "${existing}". An element was built instead.`);
        }
        return Control.#buildElement(options);
    }

    /**
     * Build an element from the options
     *
     * Nothing here decides how the control looks. The tag, the class names, the contents and the
     * attributes all come from the caller.
     *
     * @private
     * @param {ControlOptions} [options] The options for the control
     * @returns {OrderedElement}
     */
    static #buildElement(options?: ControlOptions): OrderedElement {
        const element: OrderedElement = document.createElement(options?.tag ?? 'div');
        if (isStringWithValue(options?.className)) {
            element.className = options.className;
        }
        const content = isFunction(options?.content) ? options.content() : options?.content;
        if (isString(content)) {
            element.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            element.appendChild(content);
        }
        if (isObject(options?.attributes)) {
            Object.entries(options.attributes).forEach(([name, value]) => {
                element.setAttribute(name, value);
            });
        }
        return element;
    }
}

export type ControlValue = Control | ControlOptions;

/**
 * Helper function to set up a control object
 *
 * @param {ControlValue} [value] The control options or a Control object
 * @returns {Control}
 */
export const control = (value?: ControlValue): Control => {
    if (value instanceof Control) {
        return value;
    }
    return new Control(value);
};
