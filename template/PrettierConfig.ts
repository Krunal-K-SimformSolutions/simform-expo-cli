/**
 *
 */
export const PrettierConfigTemplate = (): string => {
  return `
    {
      "useTabs": false,
      "printWidth": 100,
      "tabWidth": 2,
      "singleQuote": true,
      "trailingComma": "none",
      "semi": true,
      "quoteProps": "as-needed",
      "bracketSpacing": true,
      "arrowParens": "always",
      "bracketSameLine": false
    }
  `;
};
