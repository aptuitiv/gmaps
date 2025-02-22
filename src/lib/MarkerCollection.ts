/* ===========================================================================
    Class to hold a collection of markers organized by tags.

    This allows some bulk operations to be done on markers based on their tags.
=========================================================================== */

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
     * @param {string[]} tags The tag(s) to assign the marker to
     */
    add(marker: Marker, ...tags: string[]): void {
        if (tags.length > 0) {
            tags.forEach((tag) => {
                if (!this.markers[tag]) {
                    this.markers[tag] = new Set();
                }
                this.markers[tag].add(marker);
            });
        } else {
            // Add the marker to a default tag
            if (!this.markers[defaultTag]) {
                this.markers[defaultTag] = new Set();
            }
            this.markers[defaultTag].add(marker);
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
     * Hide the Markers in the collection that have the tag(s) passed
     *
     * @param {string[]} tags The tag(s) to hide markers for
     */
    hide(...tags: string[]): void {
        tags.forEach((tag) => {
            if (this.markers[tag]) {
                this.markers[tag].forEach((marker: Marker) => {
                    marker.hide();
                });
            }
        });
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
     * Remove the marker from the collection, optionally by tag.
     *
     * @param {Marker} marker The marker object to remove
     * @param {string[]} [tags] The tag(s) to remove the marker from. If not set then the marker is removed from all tags.
     */
    remove(marker: Marker, ...tags: string[]): void {
        if (tags.length > 0) {
            tags.forEach((tag) => {
                if (this.markers[tag]) {
                    this.markers[tag].delete(marker);
                }
            });
        } else {
            // Remove the marker from all tags
            Object.keys(this.markers).forEach((tag) => {
                this.markers[tag].delete(marker);
            });
        }
    }

    /**
     * Show the Markers in the collection that have the tag(s) passed
     *
     * @param {Map} map The map object
     * @param {string[]} tags The tag(s) to show markers for
     */
    show(map: Map, ...tags: string[]): void {
        tags.forEach((tag) => {
            if (this.markers[tag]) {
                this.markers[tag].forEach((marker: Marker) => {
                    marker.show(map);
                });
            }
        });
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
