// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    extends: ['eslint:recommended'],
    rules: {
      'no-unused-vars': 'error',
    },
    ignores: ['dist/*'],
  },
]);
