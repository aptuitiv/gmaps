/**
 * ESLint configuration
 */

import aptuitivEslint from '@aptuitiv/eslint-config-aptuitiv';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
    aptuitivEslint,
    tseslint.configs.recommended,

    globalIgnores([
        'dist/',
        'scripts/',
        'test/',
        'ts-out'
    ]),
    {
        rules: {
            "import/extensions": [
                "error",
                "never",
                { "js": "always" }
            ],
            // specify the maximum length of a line in your program
            // Overriding airbnb styles
            // https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js
            // https://eslint.org/docs/rules/max-len
            "max-len": ["error", 150, 2, {
                comments: 200,
                ignoreUrls: true,
                ignoreComments: false,
                ignoreRegExpLiterals: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
            }],
            // Enforce a line break after the description
            // https://github.com/gajus/eslint-plugin-jsdoc/blob/main/docs/rules/tag-lines.md
            "jsdoc/tag-lines": ["warn", "never", {
                startLines: 1,
            }],
            // Don't require a description on @returns. Often the return type and function description is enough.
            "jsdoc/require-returns-description": "off",
        },
        "settings": {
            "import/resolver": {
                "node": {
                    "extensions": [
                        ".js",
                        ".ts"
                    ]
                }
            }
        }
    }
]);
