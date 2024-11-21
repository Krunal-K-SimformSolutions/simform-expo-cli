export const EslintConfigTemplate = (): string => {
  return `
    import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
    import typescriptEslintParser from '@typescript-eslint/parser';
    import importPlugin from 'eslint-plugin-import';
    import jsdocPlugin from 'eslint-plugin-jsdoc';
    import globals from 'globals';

    const OFF = 'off';
    const WARN = 'warn';
    const ERROR = 'error';

    export default [
      // Base configuration
      {
        files: ['**/*.js', '**/*.jsx'], // Target JavaScript and JSX files
        ignores: ['node_modules/**', 'dist/**', 'build/**', 'eslint.config.js'], // Ignore common directories
        languageOptions: {
          ecmaVersion: 2023, // Enable modern ECMAScript features
          sourceType: 'module', // Use ES modules
          globals: globals.browser
        },
        plugins: {
          jsdoc: jsdocPlugin,
          import: importPlugin
        },
        rules: {
          // general
          'global-require': OFF,
          'no-plusplus': OFF,
          'no-cond-assign': OFF,
          'max-classes-per-file': [ERROR, 10],
          'no-shadow': OFF,
          'no-undef': OFF,
          'no-bitwise': OFF,
          'no-param-reassign': OFF,
          'no-use-before-define': OFF,
          'linebreak-style': [ERROR, 'unix'],
          semi: [ERROR, 'always'],
          'comma-dangle': [
            ERROR,
            {
              arrays: 'never',
              objects: 'never',
              imports: 'never',
              exports: 'never',
              functions: 'ignore'
            }
          ],
          'object-curly-spacing': [ERROR, 'always'],
          'eol-last': [ERROR, 'always'],
          'no-console': OFF,
          'no-restricted-syntax': [
            WARN,
            {
              selector:
                "CallExpression[callee.object.name='console'][callee.property.name!=/^(warn|error|info|trace|disableYellowBox|tron)$/]",
              message: 'Unexpected property on console object was called'
            }
          ],
          'jsdoc/require-jsdoc': [
            WARN,
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
          eqeqeq: [WARN, 'always'],
          quotes: [ERROR, 'single', { avoidEscape: true, allowTemplateLiterals: false }],

          // imports
          'import/extensions': OFF,
          'import/prefer-default-export': OFF,
          'import/no-cycle': OFF,
          'import/order': [
            ERROR,
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
          'import/no-unresolved': [ERROR, { commonjs: true, amd: true }],
          'import/named': ERROR,
          'import/namespace': ERROR,
          'import/default': ERROR,
          'import/export': ERROR,
          'import/no-extraneous-dependencies': [ERROR, { devDependencies: true }]
        }
      },

      // TypeScript-specific configuration
      {
        files: ['**/*.ts', '**/*.tsx'], // Target TypeScript files
        languageOptions: {
          parser: typescriptEslintParser, // Use TypeScript parser
          // tsconfigRootDir: __dirname, // Set root directory for TypeScript
          globals: globals.browser,
          parserOptions: {
            ecmaVersion: 2023,
            sourceType: 'module',
            ecmaFeatures: {
              jsx: true
            },
            project: './tsconfig.json' // Point to your TypeScript configuration
          }
        },
        plugins: {
          '@typescript-eslint': typescriptEslintPlugin
        },
        rules: {
          ...typescriptEslintPlugin.configs.recommended.rules,
          '@typescript-eslint/no-shadow': [ERROR],
          '@typescript-eslint/no-use-before-define': [ERROR],
          '@typescript-eslint/no-unused-vars': ERROR,
          '@typescript-eslint/consistent-type-definitions': [ERROR, 'interface']
        }
      },

      // React-specific configuration
      {
        files: ['**/*.jsx', '**/*.tsx'], // Target React files
        plugins: {
          react: 'eslint-plugin-react'
        },
        rules: {
          // react hooks
          'react-hooks/exhaustive-deps': ERROR,
          'react-hooks/rules-of-hooks': ERROR,

          // react
          'react/jsx-props-no-spreading': OFF,
          'react/jsx-filename-extension': [ERROR, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
          'react/no-unescaped-entities': [ERROR, { forbid: ['>', '"', '}'] }],
          'react/prop-types': [ERROR, { ignore: ['action', 'dispatch', 'nav', 'navigation'] }],
          'react/display-name': OFF,
          'react/jsx-boolean-value': ERROR,
          'react/jsx-no-undef': ERROR,
          'react/jsx-uses-react': ERROR,
          'react/jsx-sort-props': [
            ERROR,
            {
              callbacksLast: true,
              shorthandFirst: true,
              ignoreCase: true,
              noSortAlphabetically: true
            }
          ],
          'react/jsx-pascal-case': ERROR,
          'react/no-children-prop': OFF,

          // react-native specific rules
          'react-native/no-unused-styles': ERROR,
          'react-native/no-inline-styles': ERROR,
          'react-native/no-color-literals': ERROR,
          'react-native/no-raw-text': ERROR
        }
      }
    ];
  `;
};
