import pluginJs from "@eslint/js";
import comments from "@eslint-community/eslint-plugin-eslint-comments/configs";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{ts,tsx}"]},
  {files: ["**/*.ts"], languageOptions: {sourceType: "script"}},
  {languageOptions: { globals: globals.node }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  comments.recommended,
  {
    rules: {
      "@eslint-community/eslint-comments/no-unused-disable": "error"
    }
  },
  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  {
    rules: {
      "no-console": "error",
      "no-duplicate-imports": "error",
      "max-depth": ["error", 2],
      "max-nested-callbacks": ["error", 2],
      "max-lines-per-function": ["error", 56],
      "max-statements": ["error", 22],
      "max-params": ["error", 3],
    }
  }
];