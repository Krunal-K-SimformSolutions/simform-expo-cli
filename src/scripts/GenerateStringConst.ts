import { toPascalCase, writeJsxToTsFile } from '../utils/index.js';

/**
 *
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
        // Static strings
        output += `  ${key.trim()}: '${isTranslations ? fullKey : value}',\n`;
      } else if (value instanceof Array) {
        output += `  ${key.trim()}: '${isTranslations ? fullKey : value}',\n`;
      } else if (typeof value === 'object') {
        const pascalKey = toPascalCase(key);
        output += '/**\n';
        output += ` * Contains translated strings for the ${pascalKey} module.\n`;
        output += ' */\n';
        output += `const ${pascalKey} = Object.freeze({\n`;
        output += `${generateTSFromJSON(value, fullKey).slice(0, -2)}\n`;
        output += '});\n\n';
      }
    });
    return output;
  };

  // Start generating the TypeScript code
  result += generateTSFromJSON(jsonData);

  const pascalKeys = Object.keys(jsonData).map(toPascalCase);
  result += '// Export all the generated modules\n';
  result += 'export default Object.freeze({\n';
  result += `  ${pascalKeys.join(',\n  ').trimEnd()}\n`;
  result += '});';

  // Write the result to the output file
  return writeJsxToTsFile(targetFilePath, result);
};
