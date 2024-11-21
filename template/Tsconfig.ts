export const TsConfigTemplate = (): string => {
  return `
    {
      "extends": "expo/tsconfig.base",
      "compilerOptions": {
        "experimentalDecorators": true,
        "types": [],
        "baseUrl": "./",
        "strict": true,
        "paths": {
          "@/*": [
            "./*"
          ],
          "@types/*": ["@types/*"]
        },
        "skipDefaultLibCheck": true,
        "skipLibCheck": true
      },
      "moduleSuffixes": [".d", ""],
      "include": [
        "**/*.ts",
        "**/*.tsx",
        ".expo/types/**/*.ts",
        "expo-env.d.ts",
        "app/**/*",
        "@types/**/*.d.ts"
      ],
      "filesGlob": ["typings/index.d.ts", "**/*.ts", "**/*.tsx"],
      "exclude": [
        "node_modules",
        "./node_modules/*",
        "babel.config.js",
        "metro.config.js",
        "jest.config.js"
      ]
    }
  `;
};
