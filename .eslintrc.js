module.exports = {
    "env": {
        "es6": true,
        "typescript": true,
        "node": true,
        "jest": true
    },
    "plugins": ["jest"],
    "extends": "eslint:recommended",
    "parser": "typescript-eslint",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": ["error", { "allow": ["warn", "error", "info"] }]
    }
};