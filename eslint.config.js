import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import unicorn from 'eslint-plugin-unicorn'
import importPlugin from 'eslint-plugin-import'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettierConfig from 'eslint-config-prettier'

export default defineConfig([
  globalIgnores([
    'dist',
    'node_modules',
    'lsp-server/node_modules',
    'lsp-server/out',
  ]),

  {
    files: [
      'vite.config.ts',
      'vitest.config.ts',
      'src/**/*.{ts,js}',
      'lsp-server/src/**/*.{ts,js}',
    ],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      unicorn.configs.recommended,
    ],
    plugins: {
      import: importPlugin,
      '@stylistic': stylistic,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2023,
      },
      parserOptions: {
        project: ['./tsconfig.json', './lsp-server/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
    rules: {
      'import/no-unresolved': ['error'],
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'type',
          ],
          alphabetize: { order: 'asc', caseInsensitive: false },
          pathGroups: [
            { pattern: '@/**', group: 'internal', position: 'after' },
          ],
          'newlines-between': 'never',
        },
      ],
      'import/no-cycle': 'error',
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          ts: 'never',
        },
      ],

      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/space-before-function-paren': ['error', 'never'],
      '@stylistic/object-curly-spacing': ['error', 'always'],

      // Abbr is useful.
      'unicorn/prevent-abbreviations': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      '@typescript-eslint/no-unnecessary-condition': [
        'error',
        {
          allowConstantLoopConditions: 'only-allowed-literals',
        },
      ],
    },
  },

  // Disable conflict rules.
  prettierConfig,
])
