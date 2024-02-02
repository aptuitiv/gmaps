/* ===========================================================================
    Configuration file for Eleventy
    https://www.11ty.dev/docs/config/
=========================================================================== */


module.exports = function (eleventyConfig) {
    // Support the CSS files
    eleventyConfig.addPassthroughCopy("./site-src/css/");
    eleventyConfig.addWatchTarget("./site-src/css/");

    // Support the map JS file
    eleventyConfig.addWatchTarget("./dist/index.js");
    eleventyConfig.addPassthroughCopy('./dist/index.js');

    // Return your Object options:
    return {
        dir: {
            input: "site-src",
            output: "site-dist"
        }
    }
};
