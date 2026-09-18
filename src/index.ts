/* ===========================================================================
    Main file for the Google Map Display library for importing into other projects.

    This entry point includes everything: the core library plus popups, tooltips and
    InfoWindows. It's the one to use unless you want to keep the features you don't use out of
    your bundle, in which case import from '@aptuitiv/gmaps/core' and add the feature entry
    points you need. See the installation documentation.
=========================================================================== */

export * from './core';
export { infoWindow, InfoWindow, InfoWindowOptions, InfoWindowValue } from './lib/InfoWindow';
export {
    AttachPopupValue,
    closeAllPopups,
    DataPopupCallback,
    DataPopupValue,
    popup,
    Popup,
    PopupCallback,
    PopupOptions,
    PopupValue,
} from './lib/Popup';
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
