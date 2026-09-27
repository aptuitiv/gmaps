/* ===========================================================================
    Tests for what each published entry point pulls in.

    The library used to hand every consumer the whole bundle no matter what they imported,
    because the barrel re-exported Popup, Tooltip and InfoWindow, each of which registers itself
    on other classes at the top level. A bundler can't drop a module that has side effects, and
    keeping those kept Map, Layer and Overlay with them.

    These tests bundle a tiny consumer for real and check the size of the output, so that the
    same thing can't happen again without a test failing. They build from src rather than dist so
    that they don't need a build to have been run first.

    If a threshold fails after a deliberate change, re-measure and move it - but check first that
    the jump isn't a new side-effectful import being pulled into the core entry point.
=========================================================================== */

import { build } from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Bundle a snippet of consumer code and return the size of the output in bytes
 *
 * @param {string} code The consumer code to bundle
 * @returns {Promise<number>}
 */
const bundledSize = async (code: string): Promise<number> => {
    const result = await build({
        absWorkingDir: root,
        bundle: true,
        format: 'esm',
        minify: true,
        stdin: { contents: code, loader: 'ts', resolveDir: root, sourcefile: 'consumer.ts' },
        target: 'es2022',
        write: false,
    });
    return result.outputFiles[0].contents.byteLength;
};

const KB = 1024;

describe('entry points', () => {
    it('leaves nearly everything out when the core entry point is barely used', async () => {
        const size = await bundledSize("import { latLng } from './src/core'; console.log(latLng);");
        // Measured at about 3 KB. The whole library is about 110 KB, so anything near that means
        // something side-effectful is being pulled in again.
        expect(size).toBeLessThan(20 * KB);
    }, 30000);

    it('pulls in the map and marker code, and no more, when those are used', async () => {
        const size = await bundledSize(
            "import { map, marker } from './src/core'; console.log(map, marker);",
        );
        // Measured at about 68 KB.
        expect(size).toBeLessThan(90 * KB);
    }, 30000);

    it('costs more when the popup and tooltip entry points are added', async () => {
        const core = await bundledSize("import { map, marker } from './src/core'; console.log(map, marker);");
        const withFeatures = await bundledSize(
            "import { map, marker } from './src/core';" +
                "import { popup } from './src/popup';" +
                "import { tooltip } from './src/tooltip';" +
                'console.log(map, marker, popup, tooltip);',
        );
        // The point of the split: the features are only paid for when they're asked for.
        expect(withFeatures).toBeGreaterThan(core);
    }, 30000);

});
