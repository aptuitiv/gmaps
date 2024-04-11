/* ===========================================================================
    Configuration file for Eleventy
    https://www.11ty.dev/docs/config/
=========================================================================== */

require('dotenv').config();

module.exports = function (eleventyConfig) {
    // Support the CSS files
    eleventyConfig.addPassthroughCopy("./site-src/css/");
    eleventyConfig.addWatchTarget("./site-src/css/");

    // Support the JS files
    eleventyConfig.addPassthroughCopy("./site-src/js/");
    eleventyConfig.addWatchTarget("./site-src/js/");

    // Support the map JS file
    eleventyConfig.addWatchTarget("./dist/browser.js");
    eleventyConfig.addPassthroughCopy({ './dist/browser.js': 'map/browser.js' });

    eleventyConfig.setServerOptions({
        // Whether DOM diffing updates are applied where possible instead of page reloads
        // Disabling this because it caused weird issues with inline Javascript variables
        // and errors getting thrown because the variable already exists.
        domDiff: false,
    });

    // Add the Google Maps API key to the global data
    eleventyConfig.addGlobalData('apiKey', process.env.GOOGLE_MAPS_API_KEY);

    // Return your Object options:
    return {
        dir: {
            input: "site-src",
            output: "site-dist"
        }
    }
};
