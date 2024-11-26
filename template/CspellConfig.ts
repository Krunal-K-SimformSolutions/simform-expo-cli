import { QuestionAnswer } from '../src/index.js';

/**
 *
 */
export const CspellConfigTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  return `
    {
      "version": "0.2",
      "language": "en",
      "words": [
        "ReactNative",
        "NodeJS",
        "cspell",
        "eslint",
        "lefthook",
        "Simform",
        "prettytable",
        "ansicolor",
        "EDITMSG",
        "Asana",
        "mobileprovision",
        "hprof",
        "jsbundle",
        "Podfile",
        "codegen",
        "xcconfig",
        "${variables.getProjectName}",
        "${variables.getProjectNameWithLowerCase}",
        "Svgs",
        "persistor",
        "pressable"
      ],
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
          "language": "hi",
          "ignorePaths": ["*.lock"],
          "ignoreWords": ["अंग्रेज़", "जाएं", "डार्क", "मौजूद", "लाइट", "स्क्रीन"]
        }
      ],
      "enableFiletypes": [".js", ".ts", ".tsx", ".jsx", ".json", ".md"],
      "disableFiletypes": [".log", ".txt"]
    }
  `;
};
