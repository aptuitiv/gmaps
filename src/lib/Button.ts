/* ===========================================================================
    A control that responds to clicks, and optionally remembers what state it is in.

    Two things in one class. An action button does something when clicked and has no state. A
    stateful button can be on or off and available or not, and the DOM has to show which - a layer
    toggle that is unavailable until its data loads, then off, then on.

    The second is why this exists. Written by hand it is four methods reimplemented per button, and
    it tends to go wrong the same two ways: the disabled state is styled to look gone while the click
    listener is still bound, so an invisible button is still clickable; and disabling sets a flag
    without clearing the active state, so the button and the thing it controls end up disagreeing.
    Both are unreachable when one object owns "enabled" and "active" and is the only thing writing
    them to the DOM.

    What each state looks like is the implementor's to decide. The library never picks an attribute
    or class name - it is given a mapping and decides only when to apply it.

    See https://aptuitiv.github.io/gmaps/api-reference/map-controls/button for documentation.
=========================================================================== */

import { Control, ControlOptions } from './Control';
import { Map } from './Map';
import { isBoolean, isFunction, isObject, isString, isStringWithValue } from './helpers';

// How one state shows up in the DOM. Everything here is the implementor's vocabulary.
export type ButtonStateStyle = {
    // Attributes to set while this state holds. A null value removes the attribute.
    attributes?: { [key: string]: string | null };
    // Class name(s) to add while this state holds, removed when it ends
    className?: string;
    // Text for the button, or for an element inside it
    text?: string | { selector: string; text: string };
    // Tooltip text, written to the attribute named by tooltipAttribute, or to title and aria-label.
    // A null value removes it.
    tooltip?: string | null;
};

export type ButtonStates = {
    // Applied while the button is active
    active?: ButtonStateStyle;
    // Applied while the button is disabled
    disabled?: ButtonStateStyle;
    // Applied while the button is enabled
    enabled?: ButtonStateStyle;
    // Applied while the button is not active
    inactive?: ButtonStateStyle;
};

export type ButtonOptions = ControlOptions & {
    // Whether the button starts active. Defaults to false.
    active?: boolean;
    // Whether the button starts enabled. Defaults to true.
    enabled?: boolean;
    // Called when the button is activated, only while it is enabled. Activation is a click, or
    // Enter or Space when the element isn't a native button.
    onClick?: (button: Button, event: MouseEvent | KeyboardEvent) => void;
    // How each state shows up in the DOM. Leave it out for a button with no state.
    states?: ButtonStates;
    // The attribute a state's tooltip is written to. Defaults to title and aria-label.
    tooltipAttribute?: string;
    // Whether a click flips the active state. Defaults to false.
    toggle?: boolean;
};

/**
 * The button class
 */
export class Button extends Control {
    /** Whether the button is active */
    #active: boolean = false;

    /** The class names the active or inactive state put on the element, so they can be taken off again */
    #activeClassName: string | undefined;

    /** Whether the button is enabled */
    #enabled: boolean = true;

    /** The class names the enabled or disabled state put on the element */
    #enabledClassName: string | undefined;

    /** The callback for an activation */
    #onClick: ((button: Button, event: MouseEvent | KeyboardEvent) => void) | undefined;

    /** How each state shows up in the DOM */
    #states: ButtonStates = {};

    /** The attribute a state's tooltip is written to */
    #tooltipAttribute: string | undefined;

    /** Whether a click flips the active state */
    #toggle: boolean = false;

    /**
     * Class constructor
     *
     * @param {ButtonOptions} [options] The options for the button
     */
    constructor(options?: ButtonOptions) {
        // A button unless the caller asks for something else. The map option is held back so that
        // the button isn't put on the map before its state has been applied.
        const { map, ...rest } = options ?? {};
        super({ tag: 'button', ...rest }, 'button', 'Button');

        if (isObject(options)) {
            if (isObject(options.states)) {
                this.#states = options.states;
            }
            if (isStringWithValue(options.tooltipAttribute)) {
                this.#tooltipAttribute = options.tooltipAttribute;
            }
            if (isBoolean(options.toggle)) {
                this.#toggle = options.toggle;
            }
            if (isFunction(options.onClick)) {
                this.#onClick = options.onClick;
            }
            if (isBoolean(options.enabled)) {
                this.#enabled = options.enabled;
            }
            if (isBoolean(options.active)) {
                this.#active = options.active;
            }
        }

        // A built <button> defaults to type="submit", which submits any form it happens to be
        // inside. Only set on an element the library built - one that was passed in is the
        // caller's and is left as it is.
        if (!options?.element && this.element instanceof HTMLButtonElement && !this.element.hasAttribute('type')) {
            this.element.setAttribute('type', 'button');
        }

        this.#listen();

        // Applied up front, not only on the first change, so the DOM matches the starting state
        this.#applyEnabledState();
        this.#applyActiveState();

        if (map) {
            this.addTo(map);
        }
    }

    /**
     * Get whether the button is active
     *
     * @returns {boolean}
     */
    get active(): boolean {
        return this.#active;
    }

    /**
     * Set whether the button is active
     *
     * @param {boolean} value Whether the button is active
     */
    set active(value: boolean) {
        if (!isBoolean(value) || value === this.#active) {
            return;
        }
        this.#active = value;
        this.#applyActiveState();
        this.dispatch('change', { active: value, button: this });
    }

    /**
     * Get whether the button is enabled
     *
     * @returns {boolean}
     */
    get enabled(): boolean {
        return this.#enabled;
    }

    /**
     * Set whether the button is enabled.
     *
     * A disabled button doesn't respond to clicks. Disabling also clears the active state, so that
     * the button can't be left looking active while the thing it controls is unavailable.
     *
     * @param {boolean} value Whether the button is enabled
     */
    set enabled(value: boolean) {
        if (!isBoolean(value) || value === this.#enabled) {
            return;
        }
        this.#enabled = value;
        this.#applyEnabledState();
        if (!value && this.#active) {
            this.active = false;
        }
        this.dispatch('enabledchange', { button: this, enabled: value });
    }

    /**
     * Make the button active
     *
     * @returns {Button}
     */
    activate(): Button {
        this.active = true;
        return this;
    }

    /**
     * Make the button inactive
     *
     * @returns {Button}
     */
    deactivate(): Button {
        this.active = false;
        return this;
    }

    /**
     * Disable the button
     *
     * @returns {Button}
     */
    disable(): Button {
        this.enabled = false;
        return this;
    }

    /**
     * Enable the button
     *
     * @returns {Button}
     */
    enable(): Button {
        this.enabled = true;
        return this;
    }

    /**
     * Add a callback for when the active state changes
     *
     * @param {(active: boolean, button: Button) => void} callback The function to call
     * @returns {Button}
     */
    onChange(callback: (active: boolean, button: Button) => void): Button {
        if (isFunction(callback)) {
            this.on('change', (event) => {
                callback(this.#active, this);
                return event;
            });
        }
        return this;
    }

    /**
     * Add a callback for when the button is clicked
     *
     * @param {(button: Button, event: MouseEvent | KeyboardEvent) => void} callback The function to call
     * @returns {Button}
     */
    onClick(callback: (button: Button, event: MouseEvent | KeyboardEvent) => void): Button {
        if (isFunction(callback)) {
            this.#onClick = callback;
        }
        return this;
    }

    /**
     * Flip the active state
     *
     * @returns {Button}
     */
    toggle(): Button {
        this.active = !this.#active;
        return this;
    }

    /**
     * Put the button on a map.
     *
     * The listeners are attached again here. remove() takes them off, and Control.addTo() calls
     * remove() when the control is already on another map - so without this, a button that had been
     * taken off a map, or moved from one map to another, stayed on the page but stopped responding.
     *
     * Attaching the same function twice does nothing, so re-adding a button that is already on a
     * map can't end up with it firing twice.
     *
     * @param {Map} map The map to add the button to
     * @returns {Button}
     */
    addTo(map: Map): Button {
        // Called first, because it is what takes the button off any map it was already on, and
        // that strips the listeners
        super.addTo(map);
        this.#listen();
        return this;
    }

    /**
     * Start listening for clicks, and for keys when the element isn't a native button
     *
     * @private
     */
    #listen(): void {
        this.element.addEventListener('click', this.#handleClick);
        this.#setUpKeyboard();
    }

    /**
     * Take the button off the map and stop listening for clicks
     *
     * @returns {Button}
     */
    remove(): Button {
        this.element.removeEventListener('click', this.#handleClick);
        this.element.removeEventListener('keydown', this.#handleKeyDown);
        super.remove();
        return this;
    }

    /**
     * Give the element button semantics and keyboard handling when it isn't already a button.
     *
     * A click listener is attached to whatever element this is given, so an element that wasn't
     * interactive before becomes interactive now. Something that can be clicked has to be reachable
     * and operable with a keyboard too, and a div or a span is neither: it can't be tabbed to, and
     * Enter and Space do nothing on it.
     *
     * Elements that already carry this are left alone - a real button, a link with an href, a form
     * control - as is anything where the caller has set a role or a tabindex themselves, since they
     * have said what they want it to be.
     *
     * @private
     */
    #setUpKeyboard(): void {
        const {element} = this;
        const nativelyInteractive =
            element instanceof HTMLButtonElement ||
            element instanceof HTMLInputElement ||
            element instanceof HTMLSelectElement ||
            element instanceof HTMLTextAreaElement ||
            (element instanceof HTMLAnchorElement && element.hasAttribute('href'));

        if (nativelyInteractive) {
            return;
        }

        if (!element.hasAttribute('role')) {
            element.setAttribute('role', 'button');
        }
        if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
        element.addEventListener('keydown', this.#handleKeyDown);
    }

    /**
     * Handle Enter and Space on an element that isn't a native button.
     *
     * Held as a field so that the same function can be removed again.
     *
     * @private
     * @param {KeyboardEvent} event The keydown event
     */
    #handleKeyDown = (event: KeyboardEvent) => {
        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }
        // Space scrolls the page and Enter can submit a form, neither of which is wanted from
        // something standing in for a button
        event.preventDefault();
        this.#handleClick(event);
    };

    /**
     * Handle a click on the button
     *
     * Held as a field so that the same function can be removed again.
     *
     * @private
     * @param {MouseEvent} event The click event
     */
    #handleClick = (event: MouseEvent | KeyboardEvent) => {
        // A disabled button is usually styled to look like it isn't there, but the listener is
        // still bound. Doing nothing here is what stops an invisible button from being clickable.
        if (!this.#enabled) {
            return;
        }
        if (this.#toggle) {
            this.toggle();
        }
        this.dispatch('click', { button: this, domEvent: event });
        if (this.#onClick) {
            this.#onClick(this, event);
        }
    };

    /**
     * Apply the style for the active or inactive state
     *
     * @private
     */
    #applyActiveState(): void {
        this.#activeClassName = this.#applyState(
            this.#active ? this.#states.active : this.#states.inactive,
            this.#activeClassName,
        );
        if (this.#toggle) {
            this.element.setAttribute('aria-pressed', String(this.#active));
        }
    }

    /**
     * Apply the style for the enabled or disabled state
     *
     * @private
     */
    #applyEnabledState(): void {
        this.#enabledClassName = this.#applyState(
            this.#enabled ? this.#states.enabled : this.#states.disabled,
            this.#enabledClassName,
        );
        // aria-disabled rather than the disabled property, because the element isn't necessarily a
        // <button>, and because a disabled button is often still meant to be focusable.
        this.element.setAttribute('aria-disabled', String(!this.#enabled));
    }

    /**
     * Apply one state's style, taking off the class names the previous state added
     *
     * @private
     * @param {ButtonStateStyle} [style] The style for the state being applied
     * @param {string} [previousClassName] The class names the previous state added
     * @returns {string|undefined} The class names this state added
     */
    #applyState(style?: ButtonStateStyle, previousClassName?: string): string | undefined {
        if (isStringWithValue(previousClassName)) {
            this.element.classList.remove(...previousClassName.split(' ').filter((name) => name.length > 0));
        }
        if (!isObject(style)) {
            return undefined;
        }

        if (isObject(style.attributes)) {
            Object.entries(style.attributes).forEach(([name, value]) => {
                if (value === null) {
                    this.element.removeAttribute(name);
                } else {
                    this.element.setAttribute(name, value);
                }
            });
        }

        if (typeof style.tooltip !== 'undefined') {
            this.#applyTooltip(style.tooltip);
        }

        if (isString(style.text)) {
            this.element.textContent = style.text;
        } else if (isObject(style.text)) {
            const target = this.element.querySelector(style.text.selector);
            if (target) {
                target.textContent = style.text.text;
            }
        }

        if (isStringWithValue(style.className)) {
            this.element.classList.add(...style.className.split(' ').filter((name) => name.length > 0));
            return style.className;
        }
        return undefined;
    }

    /**
     * Set or remove the tooltip for the current state
     *
     * @private
     * @param {string|null} value The tooltip text, or null to remove it
     */
    #applyTooltip(value: string | null): void {
        const attributes = this.#tooltipAttribute ? [this.#tooltipAttribute] : ['title', 'aria-label'];
        attributes.forEach((attribute) => {
            if (value === null) {
                this.element.removeAttribute(attribute);
            } else {
                this.element.setAttribute(attribute, value);
            }
        });
    }
}

export type ButtonValue = Button | ButtonOptions;

/**
 * Helper function to set up a button object
 *
 * @param {ButtonValue} [value] The button options or a Button object
 * @returns {Button}
 */
export const button = (value?: ButtonValue): Button => {
    if (value instanceof Button) {
        return value;
    }
    return new Button(value);
};
