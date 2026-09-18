/* ===========================================================================
    Configuration for the tsup command
    https://tsup.egoist.dev/#using-custom-configuration
=========================================================================== */

import { defineConfig } from 'tsup'
import eslint from 'esbuild-plugin-eslint';

// The entry points that are published. "index" includes everything. "core" is everything except
// the features that register themselves on other classes when imported, and those features get
// an entry point each, so that a bundler can leave out the ones a project doesn't use.
// See ai-plans/active/tree-shaking.md and the installation documentation.
const entry = [
    'src/index.ts',
    'src/core.ts',
    'src/infowindow.ts',
    'src/popup.ts',
    'src/tooltip.ts',
];

// Most of these options are pushed to esbuild.
export default defineConfig([
    // Browser build for using in the browser as a standalone script
    {
        entry: ['src/browser.ts'],
        esbuildPlugins: [
            eslint({
                fix: true
            })
        ],
        format: ['iife'], // iife works best for the the browser
        minify: true,
        outDir: 'dist',
        // Mark matching packages as "not external" so that they are included in the bundle.
        // This is necessary for using the output in the browser.
        noExternal: [
            /@googlemaps\/*/
        ],
        // tsup would output this as browser.global.js without this function.
        // We want it as browser.js.
        outExtension(data) {
            return {
                js: `.js`,
            }
        },
        platform: 'browser',
        splitting: false,
        // Set here as well as in tsconfig.json. Tsup picks up the Typescript target on its own,
        // but falls back to a Node target if it can't find one. That would quietly downlevel the
        // private class fields, which is what the ES2022 target is for. See tsconfig.json.
        target: 'es2022',
    },
    // ESM build for importing in other projects.
    //
    // Splitting is on so that the code shared by the entry points is emitted once as a chunk that
    // they all import, rather than copied into each of them. Without it every entry point would
    // carry its own copy of Map, Layer and Overlay, which would mean a project that imported two
    // of them got two of every class - and "instanceof Map" checks would start failing.
    // Splitting only works for the ESM format, which is why the CommonJS build is separate.
    {
        dts: true, // Enable Typescript dts generation
        entry,
        // No eslint plugin here. It ran on both builds, so every file was linted twice, which
        // took about four times as long as the build itself and slowed down every watch
        // rebuild. Linting now runs in CI (.github/workflows/test.yml) and with "npm run lint".
        format: ['esm'],
        minify: false,
        outDir: 'dist',
        outExtension() {
            return {
                js: `.esm.js`,
            }
        },
        esbuildOptions(options) {
            // Put the shared chunks in their own folder so that the top level of dist is just the
            // entry points. The hash can't be dropped: esbuild names every shared chunk "chunk", so
            // without it they all collide on one filename. It's content-based, so a chunk keeps its
            // name until the code in it changes.
            options.chunkNames = 'chunks/[name]-[hash]';
        },
        platform: 'node',
        splitting: true,
        // Set here as well as in tsconfig.json. See the note on the browser build above.
        target: 'es2022',
    },
    // CommonJS build.
    //
    // Only the main entry point is built for CommonJS. Code splitting isn't available for this
    // format, so separate CommonJS entry points would each carry their own copy of the library.
    // CommonJS can't be tree-shaken usefully anyway, so the subpath exports point their "require"
    // condition at this one file: the named exports are all there and nothing is duplicated.
    {
        dts: true,
        entry: ['src/index.ts'],
        format: ['cjs'],
        minify: false,
        outDir: 'dist',
        outExtension() {
            return {
                js: `.cjs`,
            }
        },
        platform: 'node',
        splitting: false,
        target: 'es2022',
    }
])
