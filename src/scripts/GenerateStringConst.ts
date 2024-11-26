import { toPascalCase, writeJsxToTsFile } from '../utils/index.js';

/**
 * Generates TypeScript constants from a JSON structure, optionally supporting translations.
 * @param {string} sourceJson - The input JSON as a string.
 * @param {string} targetFilePath - The file path to write the generated TypeScript.
 * @param {boolean} isTranslations - Whether to generate translation keys.
 * @returns {Promise<void>} - A promise that resolves once the file is written.
 */
export const generateStringConst = async (
  sourceJson: string,
  targetFilePath: string,
  isTranslations: boolean
): Promise<void> => {
  let result = '';

  const jsonData = JSON.parse(sourceJson);

  /**
   * Recursively generates TypeScript code from the JSON structure.
   * @param {Record<string, any>} obj - The current JSON object.
   * @param {string} parentKey - The parent key to prefix nested keys.
   * @returns {string} - The TypeScript code generated for the object.
   */
  const generateTSFromJSON = (obj: Record<string, any>, parentKey: string = '') => {
    let output = '';

    Object.keys(obj).forEach((key) => {
      const fullKey = parentKey ? `${parentKey}:${key}` : key;
      const value = obj[key];

      if (typeof value === 'string') {
        // Handle static strings
        output += `  ${key.trim()}: '${isTranslations ? fullKey : value}',\n`;
      } else if (Array.isArray(value)) {
        // Handle arrays
        output += `  ${key.trim()}: '${isTranslations ? fullKey : value.join(', ')}',\n`;
      } else if (typeof value === 'object' && value !== null) {
        output += `  ${key.trim()}: {
`;
        output += `${generateTSFromJSON(value, fullKey)}`;
        output += '  },\n';
      }
    });

    return output;
  };

  // Generate TypeScript code for the input JSON
  Object.keys(jsonData).forEach((key) => {
    const pascalKey = toPascalCase(key);

    result += '/**\n';
    result += ` * Contains translated strings for the ${pascalKey} module.\n`;
    result += ' */\n';
    result += `const ${pascalKey} = Object.freeze({\n`;
    result += generateTSFromJSON(jsonData[key], key).slice(0, -2); // Remove trailing comma and newline
    result += '\n});\n\n';
  });

  // Generate the export block
  const pascalKeys = Object.keys(jsonData).map(toPascalCase);
  result += '// Export all the generated modules\n';
  result += 'export default Object.freeze({\n';
  result += `  ${pascalKeys.join(',\n  ').trimEnd()}\n`;
  result += '});\n';

  // Write the result to the output file
  await writeJsxToTsFile(targetFilePath, result);
};
