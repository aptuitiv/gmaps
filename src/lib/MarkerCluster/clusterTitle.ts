/* ===========================================================================
    The title for a cluster marker.

    Google uses a marker's title as its name for screen readers. A cluster marker can be clicked
    to zoom in, so it needs one, and it's the only thing that tells a screen reader user how many
    markers are in the cluster. Both renderers use this so that they say the same thing.
=========================================================================== */

import { isFunction, isStringWithValue } from '../helpers';

/**
 * The title for a cluster marker.
 *
 * Either a string where "{count}" is replaced with the number of markers in the cluster, or a
 * function that's passed the number and returns the title. Use it to translate the title.
 */
export type ClusterTitle = string | ((count: number) => string);

/**
 * The title that's used if one isn't set
 */
export const DEFAULT_CLUSTER_TITLE = 'Cluster of {count} markers';

/**
 * Whether a value can be used as a cluster title
 *
 * @param {unknown} value The value to check
 * @returns {boolean}
 */
export const isClusterTitle = (value: unknown): value is ClusterTitle => isStringWithValue(value) || isFunction(value);

/**
 * Get the title for a cluster marker
 *
 * @param {ClusterTitle} title The title, or the function that gives it
 * @param {number} count The number of markers in the cluster
 * @returns {string}
 */
export const getClusterTitle = (title: ClusterTitle, count: number): string =>
    (typeof title === 'function' ? title(count) : title.replace(/\{count\}/g, String(count)));
