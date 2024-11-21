import path from 'path';
import _ from 'lodash';
import fs from 'fs';
import readline from 'readline';
import prettier, { Options } from 'prettier';
import { ESLint } from 'eslint';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';
// @ts-expect-error - ESLint plugins are not typed
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import jsdocPlugin from 'eslint-plugin-jsdoc';
import globals from 'globals';

const OFF = 'off';
const WARN = 'warn';
const ERROR = 'error';

/**
 * Helper function to convert string to PascalCase using Lodash
 */
export const toPascalCase = (str: string): string => {
  return _.startCase(_.camelCase(str)).replace(/ /g, '');
};

/**
 * Helper function to convert string to camelCase using Lodash
 */
export const toCamelCase = (str: string): string => {
  return _.camelCase(str);
};

/**
 * Helper function to convert string to kebab-case using Lodash
 */
export const toKebabCase = (str: string): string => {
  return _.kebabCase(str);
};

/**
 * Helper function to capitalize the first letter of a string using Lodash
 */
export const toUpperFirst = (str: string): string => {
  return _.upperFirst(str);
};

/**
 * Helper function to lower the first letter of a string using Lodash
 */
export const toLowerFirst = (str: string): string => {
  return _.lowerFirst(str);
};

/**
 * Function to calculate how many ../ needed
 */
export const getRelativePath = (currentDir: string, targetDir: string): string => {
  const dirs = currentDir.split('/');
  const index = dirs.indexOf('app');
  const finalCurrentDir = dirs.slice(index).join('/');
  // Get the relative path between the current and target directory
  const relativePath = path.relative(finalCurrentDir, targetDir);

  // If the relative path starts with "..", we need to add ../ to go up directories
  return relativePath;
};

/**
 * Formats a string of JSX code.
 * @param {string} jsx - The JSX code string to format.
 * @returns {Promise<string>} - The formatted JSX code string.
 */
export const formateJsxWithPrettier = (jsx: string): Promise<string> => {
  // Load Prettier configuration
  const prettierConfig: Options = {
    useTabs: false,
    printWidth: 100,
    tabWidth: 2,
    singleQuote: true,
    trailingComma: 'none',
    semi: true,
    quoteProps: 'as-needed',
    bracketSpacing: true,
    arrowParens: 'always',
    bracketSameLine: false
  };

  // Format the code string synchronously
  const jsxCode = prettier.format(jsx, {
    ...prettierConfig,
    parser: 'babel-ts' // Use Babel parser for JavaScript/JSX
  });

  return jsxCode;
};

export const formatJsxWithEslint = async (jsx: string): Promise<string> => {
  // Create an ESLint instance
  const eslint = new ESLint({
    fix: true, // Automatically fix problems where possible
    baseConfig: [
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
          // @ts-expect-error - TypeScript ESLint plugin
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
          // @ts-expect-error - React ESLint plugin
          react: reactPlugin
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
    ]
  });

  // Lint and fix the JSX content
  const results = await eslint.lintText(jsx);

  // Apply the fixes and return the formatted code
  await ESLint.outputFixes(results);

  // Return the formatted JSX
  return results[0].output || jsx; // Return the fixed output or the original if no fixes
};

export const formateJsxWithJsonFormatter = (json: string): string => {
  return JSON.stringify(JSON.parse(json), null, 2);
};

export const checkLineExists = async (filePath: string, targetLine: string): Promise<boolean> => {
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let lineExists = false;

  for await (const line of rl) {
    if (line === targetLine) {
      lineExists = true;
      break;
    }
  }

  return lineExists;
};

export const getDirectorPath = (filePath?: string): string | undefined => {
  return (filePath?.length ?? 0) > 0 ? path.dirname(filePath ?? '') : undefined;
};

/**
 * Write a JSX string to a file after formatting it with ESLint and Prettier.
 *
 * @param filePath - The path to write the file to.
 * @param jsx - The JSX string to write to the file.
 * @returns A Promise that resolves when the file has been written.
 */
export const writeJsxToTsFile = async (filePath: string, jsx: string): Promise<void> => {
  const esLintContents = await formatJsxWithEslint(jsx);
  const prettierContents = await formateJsxWithPrettier(esLintContents);
  fs.writeFileSync(filePath, prettierContents.trim());
};

/**
 * Write a JSX string to a JSON file after formatting it with a JSON formatter.
 *
 * @param filePath - The path to write the file to.
 * @param jsx - The JSX string to write to the file.
 * @returns A Promise that resolves when the file has been written.
 */
export const writeJsxToJsonFile = async (filePath: string, jsx: string): Promise<void> => {
  const jsonContents = formateJsxWithJsonFormatter(jsx);
  fs.writeFileSync(filePath, jsonContents.trim());
};
