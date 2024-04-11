/* ===========================================================================
    Configuration for the tsup command
    https://tsup.egoist.dev/#using-custom-configuration
=========================================================================== */


import { defineConfig } from 'tsup'
import eslint from 'esbuild-plugin-eslint';

// Most of these options are pushed to esbuild.
export default defineConfig({
    // Clean the output directory before building
    clean: true,
    // Enable dts generation
    dts: true,
    // Entry point file to build
    entry: ['src/index.ts'],
    // Esbuild plugins to include
    esbuildPlugins: [
        eslint({
            fix: true
        })
    ],
    // Output format. We chose ESM so that it's easier to import in other projects and can be used in the browser.
    format: ['esm'],
    // Minify the output
    minify: true,
    // Mark matching packages as "not external" so that they are included in the bundle.
    // This is necessary for using the output in the browser.
    noExternal: [
        /@googlemaps\/*/
    ],
    // Set the platform to browser
    platform: 'browser',
    // Disable code splitting
    splitting: false,
})
