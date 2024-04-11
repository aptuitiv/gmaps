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
        format: ['cjs'], // CJS output works in the browser
        legacyOutput: true, // Force the cjs output to us ".js" instead of ".cjs" as the file extension
        minify: true,
        outDir: 'dist',
        // Mark matching packages as "not external" so that they are included in the bundle.
        // This is necessary for using the output in the browser.
        noExternal: [
            /@googlemaps\/*/
        ],
        platform: 'browser',
        splitting: false,
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
        minify: true,
        outDir: 'dist',
        outExtension({ format }) {
            return {
                js: `.${format}.js`,
            }
        },
        platform: 'node',
        splitting: false,
    }
])
