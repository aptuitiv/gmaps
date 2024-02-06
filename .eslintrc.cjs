module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        "airbnb-base", // https://github.com/airbnb/javascript
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        'prettier', // https://github.com/prettier/eslint-config-prettier
        'plugin:jsdoc/recommended' // https://www.npmjs.com/package/eslint-plugin-jsdoc
    ],
    plugins: [
        "@typescript-eslint"
    ],
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
