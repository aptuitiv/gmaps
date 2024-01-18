/* ===========================================================================
    Configiration for esbuild
=========================================================================== */

import eslint from 'esbuild-plugin-eslint';

const config = {
    bundle: true,
    entryPoints: ['src/index.ts'],
    logLevel: 'info',
    minify: false,
    outdir: 'dist',
    plugins: [
        eslint({
            fix: true
        })
    ]
};

export default config;
