export const CspellConfigTemplate = (): string => {
  return `
    {
      "version": "0.2",
      "language": "en",
      "words": ["ReactNative", "NodeJS", "cspell", "eslint", "lefthook", "Simform"],
      "ignorePaths": [
        "node_modules/**",
        "dist/**",
        "build/**",
        "**/*.min.js",
        "**/*.map",
        "**/vendor/**",
        "coverage/**"
      ],
      "ignoreWords": ["todo", "tempfile"],
      "dictionaries": ["typescript", "node", "javascript", "html", "css"],
      "overrides": [
        {
          "filename": "**/*.md",
          "language": "en-GB",
          "ignoreWords": ["colour", "favourite"]
        },
        {
          "filename": "**/*.json",
          "ignorePaths": ["*.lock"]
        }
      ],
      "enableFiletypes": [".js", ".ts", ".tsx", ".jsx", ".json", ".md"],
      "disableFiletypes": [".log", ".txt"]
    }
  `;
};
