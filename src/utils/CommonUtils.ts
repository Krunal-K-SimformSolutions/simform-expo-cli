import path from 'path';
import _ from 'lodash';
import fs from 'fs-extra';
import readline from 'readline';
import prettier from 'prettier';
import { ESLint } from 'eslint';
import { AppConstant, ColorType } from '../constants/index.js';
import chalk from 'chalk';
import { Indicators } from './IndicatorUtils.js';

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
export const formateJsxWithPrettier = async (jsx: string): Promise<string> => {
  // Load Prettier config from the specified file
  const config = await prettier.resolveConfig(
    path.resolve(import.meta.dirname, '../../prettier.config.cjs'),
    {
      config: path.resolve(import.meta.dirname, '../../prettier.config.cjs')
    }
  );

  if (!config) {
    throw new Error('Could not find or load Prettier config file.');
  }

  // Format the code string synchronously
  const jsxCode = prettier.format(jsx, {
    ...config,
    parser: 'babel-ts' // Use Babel parser for JavaScript/JSX
  });

  return jsxCode;
};

export const formatJsxWithEslint = async (jsx: string): Promise<string> => {
  // Create an ESLint instance
  const eslint = new ESLint({
    fix: true, // Automatically fix problems where possible
    overrideConfigFile: path.resolve(import.meta.dirname, '../../eslint.config.cjs')
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
  return fs.writeFile(filePath, prettierContents.trim());
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
  return fs.writeFile(filePath, jsonContents.trim());
};

export const showError = (error: unknown, spinner: Indicators, colors: ColorType): void => {
  spinner.changeMessage(
    {
      text: AppConstant.StringConstants.msgProjectError((error as Error).message),
      color: colors.error,
      modifiers: chalk.bold
    },
    'fail'
  );

  process.exit(1);
};
