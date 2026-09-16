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
        coverage: {
            include: ['src/**/*.ts'],
            reporter: ['text', 'html'],
        },
    },
});
