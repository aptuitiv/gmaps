/* ===========================================================================
    Configuration file for Eleventy
    https://www.11ty.dev/docs/config/
=========================================================================== */


module.exports = function (eleventyConfig) {
    // Support the CSS files
    eleventyConfig.addPassthroughCopy("./site-src/css/");
    eleventyConfig.addWatchTarget("./site-src/css/");

    // Support the JS files
    eleventyConfig.addPassthroughCopy("./site-src/js/");
    eleventyConfig.addWatchTarget("./site-src/js/");

    // Support the map JS file
    eleventyConfig.addWatchTarget("./dist/index.js");
    eleventyConfig.addPassthroughCopy({ './dist/index.js': 'map/index.js' });

    eleventyConfig.setServerOptions({
        // Whether DOM diffing updates are applied where possible instead of page reloads
        // Disabling this because it caused weird issues with inline Javascript variables
        // and errors getting thrown because the variable already exists.
        domDiff: false,
    });

    // Return your Object options:
    return {
        dir: {
            input: "site-src",
            output: "site-dist"
        }
    }
};
