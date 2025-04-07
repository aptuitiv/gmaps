/* ===========================================================================
    Class to hold a collection of markers organized by tags.

    This allows some bulk operations to be done on markers based on their tags.
=========================================================================== */

import { isString } from './helpers';
import { Map } from './Map';
import { Marker } from './Marker';

type MarkersByTag = { [key: string]: Set<Marker> };

const defaultTag = '__default__';

/**
 * The collection of markers that enable doing bulk actions on markers.
 * Some of the bulk actions can be filtered by the marker tag.
 */
export class MarkerCollection {
    /**
     * Holds the Marker objects by tag
     */
    markers: MarkersByTag = {};

    /**
     * Adds an Marker to the collection
     *
     * @param {Marker} marker The Marker object to add
     * @param {string} tag The tag to assign the marker to.
     */
    #add(marker: Marker, tag: string): void {
        if (!this.markers[tag]) {
            this.markers[tag] = new Set();
        }
        this.markers[tag].add(marker);
    }

    /**
     * Adds an Marker to the collection
     *
     * @param {Marker} marker The Marker object to add
     * @param {string|string[]} [tag] The tag(s) to assign the marker to. Either a single tag or an array of tags can be passed.
     */
    add(marker: Marker, tag?: string|string[]): void {
        if (isString(tag)) {
            // A single tag string was passed
            this.#add(marker, tag);
        } else if (Array.isArray(tag) && tag.length > 0) {
            // An array of tags was passed
            tag.forEach((t) => {
                if (isString(t)) {
                    this.#add(marker, t);
                }
            });
        } else {
            // Add the marker to a default tag
            this.#add(marker, defaultTag);
        }
    }

    /**
     * Clears the collection
     *
     * This also hides all the markers in the collection.
     */
    clear(): void {
        this.hideAll();
        this.markers = {};
    }

    /**
     * Clone the collection
     *
     * @returns {MarkerCollection}
     */
    clone(): MarkerCollection {
        const clone = new MarkerCollection();
        Object.keys(this.markers).forEach((tag) => {
            this.markers[tag].forEach((m: Marker) => {
                clone.add(m, tag);
            });
        });
        return clone;
    }

    /**
     * Returns true if the collection has any markers
     *
     * @returns {boolean}
     */
    hasData(): boolean {
        return Object.keys(this.markers).length > 0;
    }

    /**
     * Hide the Markers in the collection that have the tag passed
     *
     * @param {string} tag The tag to hide markers for.
     */
    #hide(tag: string): void {
        if (this.markers[tag]) {
            this.markers[tag].forEach((marker: Marker) => {
                marker.hide();
            });
        }
    }

    /**
     * Hide the Markers in the collection that have the tag(s) passed
     *
     * @param {string|string[]} tag The tag(s) to hide markers for. Either a single tag string or an array of tag strings can be passed.
     */
    hide(tag: string|string[]): void {
        if (isString(tag)) {
            // A single tag string was passed
            this.#hide(tag);
        } else if (Array.isArray(tag)) {
            // An array of tags was passed
            tag.forEach((t) => {
                if (isString(t)) {
                    this.#hide(t);
                }
            });
        }
    }

    /**
     * Hides all the Markers in the collection
     */
    hideAll(): void {
        Object.keys(this.markers).forEach((tag) => {
            this.markers[tag].forEach((marker: Marker) => {
                marker.hide();
            });
        });
    }

    /**
     * Returns true if the collection has no markers
     *
     * @returns {boolean}
     */
    isEmpty(): boolean {
        return Object.keys(this.markers).length === 0;
    }

    /**
     * Remove the marker from the collection by tag.
     *
     * @param {Marker} marker The marker object to remove
     * @param {string} tag The tag to remove the marker from.
     */
    #removeByTag(marker: Marker, tag: string): void {
        if (this.markers[tag]) {
            this.markers[tag].delete(marker);
        }
    }

    /**
     * Remove the marker from the collection, optionally by tag.
     *
     * @param {Marker} marker The marker object to remove
     * @param {string|string[]} [tag] The tag(s) to remove the marker from. If not set then the marker is removed from all tags.
     *      Either a single tag string or an array of tag strings can be passed.
     */
    remove(marker: Marker, tag?: string|string[]): void {
        if (isString(tag)) {
            this.#removeByTag(marker, tag);
        } else if (Array.isArray(tag) && tag.length > 0) {
            tag.forEach((t) => {
                if (isString(t)) {
                    this.#removeByTag(marker, t);
                }
            });
        } else {
            // Remove the marker from all tags
            Object.keys(this.markers).forEach((t) => {
                this.markers[t].delete(marker);
            });
        }
    }

    /**
     * Show the Markers in the collection that have the tag(s) passed
     *
     * @param {string} tag The tag to show markers for.
     * @param {Map} map The map object
     */
    #show(tag: string, map: Map, ): void {
        if (this.markers[tag]) {
            this.markers[tag].forEach((marker: Marker) => {
                marker.show(map);
            });
        }
    }

    /**
     * Show the Markers in the collection that have the tag(s) passed
     *
     * @param {string|string[]} tag The tag(s) to show markers for. Either a single tag string or an array of tag strings can be passed.
     * @param {Map} [map] The map object
     */
    show(tag: string|string[], map: Map): void {
        if (isString(tag)) {
            this.#show(tag, map);
        } else if (Array.isArray(tag)) {
            tag.forEach((t) => {
                if (isString(t)) {
                    this.#show(t, map);
                }
            });
        }
    }

    /**
     * Show all the Markers in the collection
     *
     * @param {Map} map The map object
     */
    showAll(map: Map): void {
        Object.keys(this.markers).forEach((tag) => {
            this.markers[tag].forEach((marker: Marker) => {
                marker.show(map);
            });
        });
    }
}

/**
 * Helper function to set up the marker collection object
 *
 * @returns {MarkerCollection}
 */
export const markerCollection = (): MarkerCollection => new MarkerCollection();
