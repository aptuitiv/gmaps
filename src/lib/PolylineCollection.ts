/* ===========================================================================
    Class to hold a collection of polylines organized by tags.

    This allows some bulk operations to be done on polylines based on their tags.
=========================================================================== */

import { Map } from './Map';
import { Polyline } from './Polyline';

type PolylinesByTag = { [key: string]: Set<Polyline> };

const defaultTag = '__default__';

/**
 * The collection of polylines that enable doing bulk actions on polylines.
 * Some of the bulk actions can be filtered by the polyline tag.
 */
export class PolylineCollection {
    /**
     * Holds the Polyline objects by tag
     */
    polylines: PolylinesByTag = {};

    /**
     * Adds an Polyline to the collection
     *
     * @param {Polyline} p The Polyline object to add
     * @param {string[]} tags The tag(s) to assign the polyline to
     */
    add(p: Polyline, ...tags: string[]): void {
        if (tags.length > 0) {
            tags.forEach((tag) => {
                if (!this.polylines[tag]) {
                    this.polylines[tag] = new Set();
                }
                this.polylines[tag].add(p);
            });
        } else {
            // Add the polyline to a default tag
            if (!this.polylines[defaultTag]) {
                this.polylines[defaultTag] = new Set();
            }
            this.polylines[defaultTag].add(p);
        }
    }

    /**
     * Clears the collection
     *
     * This also hides all the polylines in the collection.
     */
    clear(): void {
        this.hideAll();
        this.polylines = {};
    }

    /**
     * Hide the Polylines in the collection that have the tag(s) passed
     *
     * @param {string[]} tags The tag(s) to hide polylines for
     */
    hide(...tags: string[]): void {
        tags.forEach((tag) => {
            if (this.polylines[tag]) {
                this.polylines[tag].forEach((p: Polyline) => {
                    p.hide();
                });
            }
        });
    }

    /**
     * Hides all the Polylines in the collection
     */
    hideAll(): void {
        Object.keys(this.polylines).forEach((tag) => {
            this.polylines[tag].forEach((p: Polyline) => {
                p.hide();
            });
        });
    }

    /**
     * Highlight the Polylines in the collection that have the tag(s) passed
     *
     * @param {string[]} tags The tag(s) to highlight polylines for
     */
    highlight(...tags: string[]): void {
        tags.forEach((tag) => {
            if (this.polylines[tag]) {
                this.polylines[tag].forEach((p: Polyline) => {
                    p.highlight();
                });
            }
        });
    }

    /**
     * Highlight all the Polylines in the collection
     */
    highlightAll(): void {
        Object.keys(this.polylines).forEach((tag) => {
            this.polylines[tag].forEach((p: Polyline) => {
                p.highlight();
            });
        });
    }

    /**
     * Remove the polyline from the collection, optionally by tag.
     *
     * @param {Polyline} p The polyline object to remove
     * @param {string[]} [tags] The tag(s) to remove the polyline from. If not set then the polyline is removed from all tags.
     */
    remove(p: Polyline, ...tags: string[]): void {
        if (tags.length > 0) {
            tags.forEach((tag) => {
                if (this.polylines[tag]) {
                    this.polylines[tag].delete(p);
                }
            });
        } else {
            // Remove the polyline from all tags
            Object.keys(this.polylines).forEach((tag) => {
                this.polylines[tag].delete(p);
            });
        }
    }

    /**
     * Show the Polylines in the collection that have the tag(s) passed
     *
     * @param {Map} map The map object
     * @param {string[]} tags The tag(s) to show polylines for
     */
    show(map: Map, ...tags: string[]): void {
        tags.forEach((tag) => {
            if (this.polylines[tag]) {
                this.polylines[tag].forEach((p: Polyline) => {
                    p.show(map);
                });
            }
        });
    }

    /**
     * Show all the Polylines in the collection
     *
     * @param {Map} map The map object
     */
    showAll(map: Map): void {
        Object.keys(this.polylines).forEach((tag) => {
            this.polylines[tag].forEach((p: Polyline) => {
                p.show(map);
            });
        });
    }

    /**
     * Hide the hightlight for the Polylines in the collection that have the tag(s) passed
     *
     * @param {string[]} tags The tag(s) to hide the highlighted polylines
     */
    unhighlight(...tags: string[]): void {
        tags.forEach((tag) => {
            if (this.polylines[tag]) {
                this.polylines[tag].forEach((p: Polyline) => {
                    p.unhighlight();
                });
            }
        });
    }

    /**
     * Hide the hightlight for all the Polylines in the collection
     */
    unhighlightAll(): void {
        Object.keys(this.polylines).forEach((tag) => {
            this.polylines[tag].forEach((p: Polyline) => {
                p.unhighlight();
            });
        });
    }
}

/**
 * Helper function to set up the polyline collection object
 *
 * @returns {PolylineCollection}
 */
export const polylineCollection = (): PolylineCollection => new PolylineCollection();
