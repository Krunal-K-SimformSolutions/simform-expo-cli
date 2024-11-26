/**
 *
 */
export const TsConfigTemplate = (): string => {
  return `
    {
      "compilerOptions": {
        "target": "esnext",
        "lib": ["esnext"],
        "jsx": "react-native",
        "experimentalDecorators": true,
        "module": "esnext",
        "moduleResolution": "node",
        "typeRoots": ["@types", "node"],
        "resolveJsonModule": true,
        "allowJs": true,
        "noEmit": true,
        "importHelpers": true,
        "ignoreDeprecations": "5.0",
        "isolatedModules": true,
        "allowSyntheticDefaultImports": true,
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "strict": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "skipLibCheck": true
      },
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
      ],
      "extends": "expo/tsconfig.base"
    }
  `;
};
