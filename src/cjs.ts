/* ===========================================================================
    The CommonJS entry point.

    Everything the library has, in one file: the core, the features that register themselves
    (popups, tooltips, InfoWindows) and the controls that have their own entry points in ESM.

    It is one bundle rather than several because code splitting isn't available for CommonJS. Built
    separately, each entry point would carry its own copy of Map, Layer and Overlay - and two copies
    of a class means "value instanceof Map" is false for an object made by the other one, which the
    library relies on internally.

    So every subpath's "require" condition in package.json resolves here. Requiring
    '@aptuitiv/gmaps/button' gives you the whole library with `button` on it, rather than a smaller
    module. CommonJS can't be tree-shaken usefully anyway, so there is nothing lost by it.
=========================================================================== */

export * from './index';
export * from './button';
export * from './location-control';
