/**
 *
 */
export const EslintConfigTemplate = (): string => {
  return `
    import path from 'node:path';
    import { fileURLToPath } from 'node:url';
    import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
    import { FlatCompat } from '@eslint/eslintrc';
    import js from '@eslint/js';
    import typescriptEslint from '@typescript-eslint/eslint-plugin';
    import tsParser from '@typescript-eslint/parser';
    import eslintComments from 'eslint-plugin-eslint-comments';
    import _import from 'eslint-plugin-import';
    import jest from 'eslint-plugin-jest';
    import jsDoc from 'eslint-plugin-jsdoc';
    import prettier from 'eslint-plugin-prettier';
    import react from 'eslint-plugin-react';
    import reactHooks from 'eslint-plugin-react-hooks';
    import reactNative from 'eslint-plugin-react-native';
    import globals from 'globals';

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const compat = new FlatCompat({
      baseDirectory: __dirname,
      recommendedConfig: js.configs.recommended,
      allConfig: js.configs.all
    });

    export default [
      {
        ignores: [
          '**/node_modules',
          '**/coverage',
          '**/babel.config.js',
          '**/metro.config.js',
          '**/jest.config.js',
          '**/eslint.config.mjs'
        ]
      },
      ...fixupConfigRules(
        compat.extends(
          // 'expo',
          'plugin:react-native/all',
          'eslint:recommended',
          'prettier',
          'plugin:prettier/recommended',
          'plugin:react/recommended',
          'plugin:react-hooks/recommended',
          'plugin:import/typescript',
          'plugin:import/errors',
          'plugin:import/warnings',
          'eslint-config-prettier',
          'plugin:@typescript-eslint/recommended'
        )
      ),
      {
        plugins: {
          '@typescript-eslint': fixupPluginRules(typescriptEslint),
          'eslint-comments': eslintComments,
          react: fixupPluginRules(react),
          'react-hooks': fixupPluginRules(reactHooks),
          'react-native': fixupPluginRules(reactNative),
          prettier: fixupPluginRules(prettier),
          jest,
          import: fixupPluginRules(_import),
          jsd: fixupPluginRules(jsDoc)
        },
        languageOptions: {
          globals: {
            ...globals.browser,
            ...globals.jest,
            ...jest.environments.globals.globals,
            ...reactNative.environments['react-native']['react-native'],
            __DEV__: true,
            __dirname: false,
            __fbBatchedBridgeConfig: false,
            alert: false,
            cancelAnimationFrame: false,
            cancelIdleCallback: false,
            clearImmediate: true,
            clearInterval: false,
            clearTimeout: false,
            console: false,
            document: false,
            escape: false,
            Event: false,
            EventTarget: false,
            exports: false,
            fetch: false,
            FormData: false,
            global: false,
            Map: true,
            module: false,
            navigator: false,
            process: false,
            Promise: true,
            requestAnimationFrame: true,
            requestIdleCallback: true,
            require: false,
            Set: true,
            setImmediate: true,
            setInterval: false,
            setTimeout: false,
            window: false,
            XMLHttpRequest: false
          },

          parser: tsParser,
          ecmaVersion: 'latest',
          sourceType: 'module'
        },
        settings: {
          react: {
            version: 'detect'
          },
          'import/ignore': ['react-native']
        },
        rules: {
          'prettier/prettier': [
            'error',
            {},
            {
              usePrettierrc: true
            }
          ],

          indent: 'off',
          'global-require': 'off',
          'no-plusplus': 'off',
          'no-cond-assign': 'off',
          'max-classes-per-file': ['error', 10],
          'no-shadow': 'off',
          'no-undef': 'off',
          'no-bitwise': 'off',
          'no-param-reassign': 'off',
          'no-use-before-define': 'off',
          'linebreak-style': ['error', 'unix'],
          semi: ['error', 'always'],

          'comma-dangle': [
            'error',
            {
              arrays: 'never',
              objects: 'never',
              imports: 'never',
              exports: 'never',
              functions: 'ignore'
            }
          ],

          'object-curly-spacing': ['error', 'always'],
          'eol-last': ['error', 'always'],
          'no-console': 'off',

          'no-restricted-syntax': [
            'warn',
            {
              selector:
                "CallExpression[callee.object.name='console'][callee.property.name!=/^(warn|error|info|trace|disableYellowBox|tron)$/]",
              message: 'Unexpected property on console object was called'
            }
          ],

          'jsd/require-jsdoc': [
            'warn',
            {
              require: {
                FunctionDeclaration: true,
                MethodDefinition: true,
                ClassDeclaration: true,
                ArrowFunctionExpression: true,
                FunctionExpression: true
              }
            }
          ],

          eqeqeq: ['warn', 'always'],

          quotes: [
            'error',
            'single',
            {
              avoidEscape: true,
              allowTemplateLiterals: false
            }
          ],

          '@typescript-eslint/no-shadow': 'error',
          '@typescript-eslint/no-use-before-define': 'error',
          '@typescript-eslint/no-unused-vars': [
            'error',
            {
              args: 'all',
              argsIgnorePattern: '^_',
              caughtErrors: 'all',
              caughtErrorsIgnorePattern: '^_',
              destructuredArrayIgnorePattern: '^_',
              varsIgnorePattern: '^_',
              ignoreRestSiblings: true
            }
          ],
          '@typescript-eslint/ban-ts-ignore': 'off',
          '@typescript-eslint/no-explicit-any': 'off',
          '@typescript-eslint/no-require-imports': 'off',
          '@typescript-eslint/no-var-requires': 'warn',
          '@typescript-eslint/consistent-type-imports': 'error',
          '@typescript-eslint/consistent-type-definitions': ['error', 'type'],

          '@typescript-eslint/no-this-alias': [
            'error',
            {
              allowDestructuring: true,
              allowedNames: ['that']
            }
          ],

          '@typescript-eslint/indent': 'off',
          'import/extensions': 'off',
          'import/prefer-default-export': 'off',
          'import/no-cycle': 'off',

          'import/order': [
            'error',
            {
              groups: [
                'builtin',
                'external',
                'internal',
                'parent',
                'sibling',
                'index',
                'object',
                'type'
              ],
              alphabetize: {
                order: 'asc',
                caseInsensitive: true
              },
              warnOnUnassignedImports: true
            }
          ],

          'import/no-unresolved': [
            'error',
            {
              commonjs: true,
              amd: true
            }
          ],

          'import/named': 'error',
          'import/namespace': 'error',
          'import/default': 'error',
          'import/export': 'error',

          'import/no-extraneous-dependencies': [
            'error',
            {
              devDependencies: true
            }
          ],

          'react-hooks/exhaustive-deps': 'error',
          'react-hooks/rules-of-hooks': 'error',
          'react/jsx-props-no-spreading': 'off',

          'react/jsx-filename-extension': [
            'error',
            {
              extensions: ['.js', '.jsx', '.ts', '.tsx']
            }
          ],

          'react/no-unescaped-entities': [
            'error',
            {
              forbid: ['>', '"', '}']
            }
          ],

          'react/prop-types': [
            'error',
            {
              ignore: ['action', 'dispatch', 'nav', 'navigation']
            }
          ],

          'react/display-name': 'off',
          'react/jsx-boolean-value': 'error',
          'react/jsx-no-undef': 'error',
          'react/jsx-uses-react': 'error',

          'react/jsx-sort-props': [
            'error',
            {
              callbacksLast: true,
              shorthandFirst: true,
              ignoreCase: true,
              noSortAlphabetically: true
            }
          ],

          'react/jsx-pascal-case': 'error',
          'react/no-children-prop': 'off',
          'react-native/no-unused-styles': 'error',
          'react-native/no-inline-styles': 'error',
          'react-native/no-color-literals': 'error',

          'react-native/no-raw-text': [
            'error',
            {
              skip: ['CustomText', 'Text']
            }
          ]
        }
      }
    ];
  `;
};
