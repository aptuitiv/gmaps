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

    eleventyConfig.setServerOptions({
        // Default values are shown:

        // Whether the live reload snippet is used
        liveReload: true,

        // Whether DOM diffing updates are applied where possible instead of page reloads
        domDiff: true,

        // The starting port number
        // Will increment up to (configurable) 10 times if a port is already in use.
        port: 8080,

        // Additional files to watch that will trigger server updates
        // Accepts an Array of file paths or globs (passed to `chokidar.watch`).
        // Works great with a separate bundler writing files to your output folder.
        // e.g. `watch: ["_site/**/*.css"]`
        watch: [
            "./site-dist/**/*.css",
            "./site-dist/**/*.js",
        ],

        // Show local network IP addresses for device testing
        showAllHosts: false,

        // Use a local key/certificate to opt-in to local HTTP/2 with https
        https: {
            // key: "./localhost.key",
            // cert: "./localhost.cert",
        },

        // Change the default file encoding for reading/serving files
        encoding: "utf-8",

        // Show the dev server version number on the command line
        showVersion: false,
    });

    // Return your Object options:
    return {
        dir: {
            input: "site-src",
            output: "site-dist"
        }
    }
};
