import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import unicornPlugin from 'eslint-plugin-unicorn'
import importPlugin from 'eslint-plugin-import'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),

  {
    files: ['src/**/*.{ts,js}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strict,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylistic,
      tseslint.configs.stylisticTypeChecked,
    ],
    plugins: {
      import: importPlugin,
      '@stylistic': stylistic,
      unicorn: unicornPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2023,
      },
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json'
        }
      }
    },
    rules: {
      'import/no-unresolved': 'error',
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          alphabetize: { order: 'asc', caseInsensitive: false },
          pathGroups: [
            { pattern: '@/**', group: 'internal', position: 'after' }
          ],
          'newlines-between': 'never',
        },
      ],
      'import/no-cycle': 'error',

      // We are using commonjs.
      'import/extensions': 'off',

      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/space-before-function-paren': ['error', 'never'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/block-spacing': ['error', 'always'],
      '@stylistic/comma-dangle': ['error', {
        'arrays': 'always-multiline',
        'objects': 'always-multiline',
        'imports': 'always-multiline',
        'exports': 'always-multiline',
        'functions': 'only-multiline',
        'importAttributes': 'always-multiline',
        'dynamicImports': 'always-multiline',
        'enums': 'always-multiline',
        'generics': 'always-multiline',
        'tuples': 'always-multiline'
      }],

      // Abbr is useful.
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/no-array-callback-reference': 'error',

      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
    },
  }
])
