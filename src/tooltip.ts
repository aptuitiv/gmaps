/* ===========================================================================
    Tooltip entry point for the Google Map Display library.

    Importing this adds the tooltip methods to the Map, Layer, DataLayer and DataFeature
    classes. That registration is why this is a separate entry point: a bundler can't drop code
    that attaches itself to something else, so it would otherwise be included whether or not it
    was used.

    Everything here is also available from the main '@aptuitiv/gmaps' entry point.
=========================================================================== */

export {
    AttachTooltipValue,
    DataTooltipCallback,
    DataTooltipValue,
    tooltip,
    Tooltip,
    TooltipCallback,
    TooltipOptions,
    TooltipValue,
} from './lib/Tooltip';
