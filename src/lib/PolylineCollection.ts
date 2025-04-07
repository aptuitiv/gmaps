/* ===========================================================================
    Class to hold a collection of polylines organized by tags.

    This allows some bulk operations to be done on polylines based on their tags.
=========================================================================== */

import { isString } from './helpers';
import { Map } from './Map';
import { Polyline, PolylineOptions } from './Polyline';

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
     * @param {string} tag The tag to assign the polyline to.
     */
    #add(p: Polyline, tag: string): void {
        if (!this.polylines[tag]) {
            this.polylines[tag] = new Set();
        }
        this.polylines[tag].add(p);
    }

    /**
     * Adds an Polyline to the collection
     *
     * @param {Polyline} p The Polyline object to add
     * @param {string|string[]} [tag] The tag(s) to assign the polyline to. Either a single tag or an array of tags can be passed.
     */
    add(p: Polyline, tag?: string|string[]): void {
        if (isString(tag)) {
            // A single tag string was passed
            this.#add(p, tag);
        } else if (Array.isArray(tag) && tag.length > 0) {
            // An array of tags was passed
            tag.forEach((t) => {
                if (isString(t)) {
                    this.#add(p, t);
                }
            });
        } else {
            // Add the polyline to a default tag
            this.#add(p, defaultTag);
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
     * Clones the collection
     *
     * @returns {PolylineCollection}
     */
    clone(): PolylineCollection {
        const clone = new PolylineCollection();
        Object.keys(this.polylines).forEach((tag) => {
            this.polylines[tag].forEach((p: Polyline) => {
                clone.add(p, tag);
            });
        });
        return clone;
    }

    /**
     * Returns true if the collection has any polylines
     *
     * @returns {boolean}
     */
    hasData(): boolean {
        return Object.keys(this.polylines).length > 0;
    }

    /**
     * Hide the Polylines in the collection that have the tag passed
     *
     * @param {string} tag The tag to hide polylines for.
     */
    #hide(tag: string): void {
        if (this.polylines[tag]) {
            this.polylines[tag].forEach((p: Polyline) => {
                p.hide();
            });
        }
    }

    /**
     * Hide the Polylines in the collection that have the tag(s) passed
     *
     * @param {string|string[]} tag The tag(s) to hide polylines for. Either a single tag string or an array of tag strings can be passed.
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
     * @param {string} tag The tag to highlight polylines for.
     * @param {PolylineOptions} [highlightOptions] The options to use for highlighting the polylines. This will override the current options for the highlight polyline.
     */
    #highlight(tag: string, highlightOptions?: PolylineOptions): void {
        if (this.polylines[tag]) {
            this.polylines[tag].forEach((p: Polyline) => {
                p.highlight(highlightOptions);
            });
        }
    }

    /**
     * Highlight the Polylines in the collection that have the tag(s) passed
     *
     * You can override the current highlight options by passing in the highlightOptions parameter.
     * This allows you to override one or more of the following options:
     * - clickable
     * - dashed
     * - dashGap
     * - icons
     * - strokeColor
     * - strokeOpacity
     * - strokeWeight
     * - zIndex
     *
     * When the polyline is unhighlighted, the original options will be restored.
     *
     * @param {string|string[]} tag The tag(s) to highlight polylines for. Either a single tag string or an array of tag strings can be passed.
     * @param {PolylineOptions} [highlightOptions] The options to use for highlighting the polylines. This will override the current options for the highlight polyline.
     */
    highlight(tag: string|string[], highlightOptions?: PolylineOptions): void {
        if (isString(tag)) {
            this.#highlight(tag, highlightOptions);
        } else if (Array.isArray(tag)) {
            tag.forEach((t) => {
                if (isString(t)) {
                    this.#highlight(t, highlightOptions);
                }
            });
        }
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
     * Returns true if the collection has no polylines
     *
     * @returns {boolean}
     */
    isEmtpy(): boolean {
        return Object.keys(this.polylines).length === 0;
    }

    /**
     * Remove the polyline from the collection by tag.
     *
     * @param {Polyline} p The polyline object to remove
     * @param {string} tag The tag to remove the polyline from.
     */
    #removeByTag(p: Polyline, tag: string): void {
        if (this.polylines[tag]) {
            this.polylines[tag].delete(p);
        }
    }

    /**
     * Remove the polyline from the collection, optionally by tag.
     *
     * @param {Polyline} p The polyline object to remove
     * @param {string|string[]} [tag] The tag(s) to remove the polyline from. If not set then the polyline is removed from all tags.
     *      Either a single tag string or an array of tag strings can be passed.
     */
    remove(p: Polyline, tag?: string|string[]): void {
        if (isString(tag)) {
            this.#removeByTag(p, tag);
        } else if (Array.isArray(tag) && tag.length > 0) {
            tag.forEach((t) => {
                if (isString(t)) {
                    this.#removeByTag(p, t);
                }
            });
        } else {
            // Remove the polyline from all tags
            Object.keys(this.polylines).forEach((t) => {
                this.polylines[t].delete(p);
            });
        }
    }

    /**
     * Set options for the Polylines in the collection that have the tag(s) passed
     *
     * @param {PolylineOptions} options The options to set for the polylines.
     * @param {string} tag The tag to show polylines for.
     */
    #setOptions(options: PolylineOptions, tag: string): void {
        if (this.polylines[tag]) {
            this.polylines[tag].forEach((p: Polyline) => {
                p.setOptions(options);
            });
        }
    }

    /**
     * Set options for either all polylines in the collection or for the polylines that have the tag(s) passed.
     *
     * @param {PolylineOptions} options The options to set for the polylines.
     * @param {string|string[]} [tag] The tag(s) to show polylines for. Either a single tag string or an array of tag strings can be passed.
     */
    setOptions(options: PolylineOptions, tag?: string|string[]): void {
        if (isString(tag)) {
            this.#setOptions(options, tag);
        } else if (Array.isArray(tag)) {
            tag.forEach((t) => {
                if (isString(t)) {
                    this.#setOptions(options, t);
                }
            });
        } else {
            // Set the options for all polylines
            Object.keys(this.polylines).forEach((t) => {
                this.polylines[t].forEach((p: Polyline) => {
                    p.setOptions(options);
                });
            });
        }
    }

    /**
     * Show the Polylines in the collection that have the tag(s) passed
     *
     * @param {string} tag The tag to show polylines for.
     * @param {Map} [map] The map object
     */
    #show(tag: string, map: Map): void {
        if (this.polylines[tag]) {
            this.polylines[tag].forEach((p: Polyline) => {
                p.show(map);
            });
        }
    }

    /**
     * Show the Polylines in the collection that have the tag(s) passed
     *
     * @param {string|string[]} tag The tag(s) to show polylines for. Either a single tag string or an array of tag strings can be passed.
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
     * Show all the Polylines in the collection
     *
     * @param {Map} [map] The map object
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
     * @param {string} tag The tag to hide the highlighted polylines.
     */
    #unhighlight(tag: string): void {
        if (this.polylines[tag]) {
            this.polylines[tag].forEach((p: Polyline) => {
                p.unhighlight();
            });
        }
    }

    /**
     * Hide the hightlight for the Polylines in the collection that have the tag(s) passed
     *
     * @param {string|string[]} tag The tag(s) to hide the highlighted polylines. Either a single tag string or an array of tag strings can be passed.
     */
    unhighlight(tag: string|string[]): void {
        if (isString(tag)) {
            this.#unhighlight(tag);
        } else if (Array.isArray(tag)) {
            tag.forEach((t) => {
                if (isString(t)) {
                    this.#unhighlight(t);
                }
            });
        }
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
