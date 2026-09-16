/* ===========================================================================
    Configuration for the tsup command
    https://tsup.egoist.dev/#using-custom-configuration
=========================================================================== */

import { defineConfig } from 'tsup'
import eslint from 'esbuild-plugin-eslint';

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
    // ESM build for importing in other projects
    {
        dts: true, // Enable Typescript dts generation
        entry: ['src/index.ts'],
        esbuildPlugins: [
            eslint({
                fix: true
            })
        ],
        format: ['cjs', 'esm'],
        minify: false,
        outDir: 'dist',
        outExtension({ format }) {
            if (format === 'cjs') {
                return {
                    js: `.cjs`,
                }
            } else {
                return {
                    js: `.${format}.js`,
                }
            }
        },
        platform: 'node',
        splitting: false,
        // Set here as well as in tsconfig.json. See the note on the browser build above.
        target: 'es2022',
    }
])
