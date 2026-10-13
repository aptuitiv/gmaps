/* ===========================================================================
    Tooltips and popups shown on hover.

    WCAG 1.4.13 (content on hover or focus) asks three things of them:

    1. Dismissible. Escape hides it without moving the pointer, and it stays hidden until the
       pointer or focus leaves the thing that showed it. Otherwise it would come straight back
       on the next mousemove.
    2. Hoverable. The pointer can move onto it without it disappearing. That part is
       Overlay.hideSoon().
    3. Persistent. It stays until one of those things happens.

    It also has to show for keyboard focus, not only for the pointer. That only works where the
    thing has an element on the page that takes focus - see Layer.getFocusTarget().

    Tooltip, Popup and the data layer attachment all show overlays on hover, so they all use this
    rather than each keeping its own copy.
=========================================================================== */

import type { Overlay } from './Overlay';
import type { FocusTarget } from './Layer';
import type { EventCallback } from './Evented';
import type { LatLngValue } from './LatLng';

// What an overlay is showing for. Map, Layer or DataFeature - only used as a key.
type Trigger = object;

type HoverEntry = {
    // The element whose aria-describedby points at the overlay, when it was shown for focus
    describes?: HTMLElement;
    trigger: Trigger;
};

/**
 * The overlays currently shown on hover or focus, and what each is showing for.
 *
 * It's a Map rather than a WeakMap because Escape has to go through them. Entries for overlays
 * that are no longer visible are dropped every time one is added, so it only ever holds the few
 * that are showing.
 */
const shown: globalThis.Map<Overlay, HoverEntry> = new globalThis.Map();

/**
 * The things whose overlay was dismissed with Escape, and mustn't show it again until the
 * pointer or focus leaves them.
 */
const dismissed: WeakSet<Trigger> = new WeakSet();

/**
 * Whether the document listener for Escape has been added
 */
let isListening = false;

/**
 * Take the aria-describedby that points at an overlay off an element
 *
 * Only the overlay's own id is taken off, so anything else the element is described by stays.
 *
 * @param {HTMLElement} element The element that's described by the overlay
 * @param {Overlay} overlay The overlay
 */
const removeDescription = (element: HTMLElement, overlay: Overlay): void => {
    const id = overlay.getOverlayId();
    const ids = (element.getAttribute('aria-describedby') ?? '').split(/\s+/).filter((value) => value && value !== id);
    if (ids.length > 0) {
        element.setAttribute('aria-describedby', ids.join(' '));
    } else {
        element.removeAttribute('aria-describedby');
    }
};

/**
 * Point an element's aria-describedby at the overlay, so that screen readers read the tooltip
 * when the element is focused.
 *
 * Not when the overlay says the same thing as the element's name. A marker whose title is also
 * its tooltip would otherwise have it read out twice.
 *
 * @param {HTMLElement} element The element that's described by the overlay
 * @param {Overlay} overlay The overlay
 */
const addDescription = (element: HTMLElement, overlay: Overlay): void => {
    const text = (overlay.getOverlayElement().textContent ?? '').trim();
    const name = (element.getAttribute('aria-label') || element.getAttribute('title') || element.title || '').trim();
    if (text.length === 0 || text === name) {
        return;
    }
    const id = overlay.getOverlayId();
    const ids = (element.getAttribute('aria-describedby') ?? '').split(/\s+/).filter((value) => value);
    if (!ids.includes(id)) {
        ids.push(id);
        element.setAttribute('aria-describedby', ids.join(' '));
    }
};

/**
 * Hide every overlay shown on hover or focus when Escape is pressed.
 *
 * It listens in the capture phase so that it runs before Popup's own Escape listener, and it
 * marks the event as handled. One press takes the hover content away first. The next one
 * reaches a popup that was opened by a click.
 *
 * @param {KeyboardEvent} event The keydown event
 */
const handleEscape = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || event.isComposing) {
        return;
    }
    let isHandled = false;
    shown.forEach((entry, overlay) => {
        if (entry.describes) {
            removeDescription(entry.describes, overlay);
        }
        if (overlay.isVisible) {
            dismissed.add(entry.trigger);
            overlay.hide();
            isHandled = true;
        }
    });
    shown.clear();
    if (isHandled) {
        event.preventDefault();
    }
};

/**
 * Whether the overlay for a thing was dismissed with Escape and mustn't be shown again yet
 *
 * @param {Trigger} trigger The thing that's hovered or focused
 * @returns {boolean}
 */
export const isHoverDismissed = (trigger: Trigger): boolean => dismissed.has(trigger);

/**
 * Record that an overlay is showing because something was hovered or focused.
 *
 * @param {Overlay} overlay The overlay that's showing
 * @param {Trigger} trigger The thing that's hovered or focused
 * @param {HTMLElement} [describes] The focused element, which is then described by the overlay
 */
export const hoverShown = (overlay: Overlay, trigger: Trigger, describes?: HTMLElement): void => {
    overlay.markHoverShown();
    shown.forEach((entry, other) => {
        if (!other.isVisible) {
            shown.delete(other);
        }
    });
    shown.set(overlay, { describes, trigger });
    if (describes) {
        addDescription(describes, overlay);
    }
    if (!isListening && typeof document !== 'undefined') {
        isListening = true;
        document.addEventListener('keydown', handleEscape, true);
    }
};

/**
 * Record that the pointer or focus has left a thing, so its overlay can be shown again.
 *
 * @param {Trigger} trigger The thing that was hovered or focused
 */
export const hoverEnded = (trigger: Trigger): void => {
    dismissed.delete(trigger);
};

/**
 * How one kind of overlay is shown and hidden on hover. Tooltip and Popup each provide one.
 */
export type HoverHandlers = {
    // Work out the overlay for the thing and show it at the position. Returns the overlay shown.
    show: (position: LatLngValue | undefined) => Overlay | undefined;
    // Move the overlay that's showing to follow the pointer. Only used for a map.
    follow?: (position: LatLngValue | undefined) => void;
    // The overlay that's currently showing for the thing
    current: () => Overlay;
};

/**
 * The parts of a Map or Layer that are needed to listen to it
 */
type HoverElement = {
    // Method syntax rather than a property, so that Map's on(), which only takes its own event
    // names, still fits.
    on(type: string, callback: EventCallback): void;
    getFocusTarget?: () => FocusTarget | undefined;
    hideNativeTitle?: (isHidden: boolean) => void;
};

/**
 * Show an overlay while a map or layer is hovered or focused.
 *
 * Called once the map or layer is ready, so that an advanced marker's element exists.
 *
 * @param {HoverElement} element The map or layer
 * @param {HoverHandlers} handlers How the overlay is shown
 */
export const attachHover = (element: HoverElement, handlers: HoverHandlers): void => {
    element.on('mouseover', (e) => {
        // A marker keeps its title so that it has a name for screen readers, but the browser
        // would show the title as its own tooltip on top of this one. It's taken off while the
        // pointer is on the marker, even after Escape, and put back when the pointer leaves.
        element.hideNativeTitle?.(true);
        if (isHoverDismissed(element)) {
            return;
        }
        const overlay = handlers.show(e.latLng);
        if (overlay) {
            hoverShown(overlay, element);
        }
    });
    if (handlers.follow) {
        const { follow } = handlers;
        element.on('mousemove', (e) => {
            if (!isHoverDismissed(element)) {
                follow(e.latLng);
            }
        });
    }
    element.on('mouseout', () => {
        element.hideNativeTitle?.(false);
        hoverEnded(element);
        handlers.current().hideSoon();
    });

    const target = element.getFocusTarget?.();
    if (!target) {
        return;
    }
    // The overlay the element is described by. A callback can give a different overlay each
    // time, so it's the one that was shown for focus that has its description taken off.
    let described: Overlay | undefined;
    target.element.addEventListener('focusin', () => {
        if (isHoverDismissed(element)) {
            return;
        }
        // Asked again rather than using the one from above, because the marker can have moved
        const overlay = handlers.show(element.getFocusTarget?.()?.position);
        if (overlay) {
            described = overlay;
            hoverShown(overlay, element, target.element);
        }
    });
    target.element.addEventListener('focusout', (e: FocusEvent) => {
        // Focus moving between things inside the marker hasn't left it
        if (e.relatedTarget instanceof Node && target.element.contains(e.relatedTarget)) {
            return;
        }
        hoverEnded(element);
        if (described) {
            removeDescription(target.element, described);
            described = undefined;
        }
        handlers.current().hide();
    });
};
