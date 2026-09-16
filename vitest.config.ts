/* ===========================================================================
    Configuration for vitest
    https://vitest.dev/config/
=========================================================================== */

import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Most tests don't need a DOM. The ones that do (overlays, tooltips, popups) opt in
        // with a "@vitest-environment jsdom" docblock at the top of the file.
        environment: 'node',
        // Use explicit imports from vitest rather than globals so that it's obvious where
        // describe/it/expect come from.
        globals: false,
        include: ['test/**/*.test.ts'],
        // Transforming the source was taking about 42% of each run and being redone every time.
        // This keeps the transformed modules on disk between runs.
        fsModuleCache: true,
        coverage: {
            include: ['src/**/*.ts'],
            reporter: ['text', 'html'],
        },
    },
});
