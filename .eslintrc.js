module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    rules: {
        "no-trailing-spaces": "warn",
        "import/order": [
            "error",
            {
                "groups": [
                    "builtin",
                    [
                        "external",
                        "internal",
                    ],
                    [
                        "parent",
                        "sibling",
                        "index"
                    ],
                    "unknown"
                ],
                "newlines-between": "always",
                "alphabetize": {
                    order: 'asc', /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */
                    caseInsensitive: true /* ignore case. Options: [true, false] */
                }
            }
        ]
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        "plugin:react/recommended",
        "plugin:jest/recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
    ],
    env: {
        "jest/globals": true
    }
};