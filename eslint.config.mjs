// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['dist', 'bin', 'build', 'node_modules'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  eslintPluginPrettierRecommended,

  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {},
    settings: {},
    rules: {},
  }
);