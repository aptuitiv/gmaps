/* ===========================================================================
    The message for a method that one of the optional feature modules adds.

    Popups, tooltips and InfoWindows add methods like attachPopup() to other classes when they are
    imported. Importing from '@aptuitiv/gmaps/core' leaves them out, so those classes carry
    placeholder methods that throw this message instead of failing with "attachPopup is not a
    function", which doesn't say what to do about it.
=========================================================================== */

/**
 * Build the error message for a method that one of the optional feature modules adds
 *
 * @param {string} method The method that was called
 * @param {string} entryPoint The entry point that adds it
 * @returns {string}
 */
// eslint-disable-next-line import/prefer-default-export
export const missingFeatureMessage = (method: string, entryPoint: string): string =>
    `${method}() is added by the "${entryPoint}" module, which hasn't been imported. ` +
    `Import it once, anywhere in your code, to add ${method}() to this object:\n` +
    `    import '@aptuitiv/gmaps/${entryPoint}';\n` +
    `Importing from '@aptuitiv/gmaps' instead of '@aptuitiv/gmaps/core' includes it as well.`;
