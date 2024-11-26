import { QuestionAnswer, AppConstant } from '../src/index.js';

/**
 * This function will return an object that contains arrays of dependencies and devDependencies
 *              based on the values of the QuestionAnswer class.
 * @returns {{ dependencies: Array<string>, devDependencies: Array<string> }}
 */
export const getDependencies = (): {
  dependencies: Array<string>;
  devDependencies: Array<string>;
} => {
  const devDependencies: Array<string> = [];
  const dependencies: Array<string> = [];

  const variables = QuestionAnswer.instance;

  const isSentry = variables.isSupportFeature(AppConstant.AddFeature.Sentry);
  const isTranslations = variables.isSupportFeature(AppConstant.AddFeature.Translations);
  const isEsLint = variables.isSupportFeature(AppConstant.AddFeature.EsLint);
  const isPrettier = variables.isSupportFeature(AppConstant.AddFeature.Prettier);
  const isCSpell = variables.isSupportFeature(AppConstant.AddFeature.CSpell);
  const isLeftHook = variables.isSupportFeature(AppConstant.AddFeature.LeftHook);
  const isSocket = variables.isSupportFeature(AppConstant.AddFeature.Socket);

  const isReactRedux = variables.isSupportStateManagement(AppConstant.StateManagement.ReactRedux);
  const isGraphQL = variables.isSupportStateManagement(AppConstant.StateManagement.GraphQL);

  const isReduxSaga = variables.isSupportStateManagementMiddleware(
    AppConstant.StateManagementMiddleware.ReduxSaga
  );

  const isAxios = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Axios);
  const isAWSAmplify = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.AWSAmplify);
  const isFetch = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Fetch);

  if (isSentry) {
    dependencies.push('@sentry/react-native');
  }
  if (isReactRedux) {
    dependencies.push('@reduxjs/toolkit');
    dependencies.push('react-redux');
    dependencies.push('redux-persist');
  }
  if (isGraphQL) {
    dependencies.push('@apollo/client');
    dependencies.push('graphql');
    dependencies.push('apollo3-cache-persist');
  }
  if (isReduxSaga) {
    dependencies.push('redux-saga');
  }
  if (isAxios) {
    dependencies.push('axios');
  }
  if (isAWSAmplify) {
    dependencies.push('aws-amplify@5.3.25');
    dependencies.push('@aws-amplify/react-native');
    dependencies.push('react-native-get-random-values');
    dependencies.push('@react-native-community/netinfo');
  }
  if (isAxios || isAWSAmplify || isFetch) {
    dependencies.push('jwt-decode');
  }
  if (isTranslations) {
    dependencies.push('i18next');
    dependencies.push('react-i18next');
    dependencies.push('expo-localization');
  }
  if (isSocket) {
    dependencies.push('uuid');
  }
  dependencies.push(
    ...[
      '@react-native-async-storage/async-storage',
      '@expo/vector-icons',
      '@react-navigation/bottom-tabs',
      '@react-navigation/native',
      'expo',
      'expo-blur',
      'expo-font',
      'expo-haptics',
      'expo-linking',
      'expo-network',
      'expo-router',
      'expo-splash-screen',
      'expo-status-bar',
      'expo-symbols',
      'expo-system-ui',
      'expo-web-browser',
      'lodash',
      'react',
      'react-dom',
      'react-native',
      'react-native-gesture-handler',
      'react-native-reanimated',
      'react-native-safe-area-context',
      'react-native-screens',
      'react-native-web',
      'react-native-webview',
      'expo-build-properties',
      'react-native-svg'
    ]
  );

  if (isAxios || isAWSAmplify || isFetch) {
    devDependencies.push('@types/jwt-decode');
  }
  if (isSocket) {
    devDependencies.push('@types/uuid');
  }
  if (isCSpell) {
    devDependencies.push('cspell');
  }
  if (isEsLint) {
    devDependencies.push('@eslint/compat');
    devDependencies.push('@eslint/eslintrc');
    devDependencies.push('@eslint/js');
    devDependencies.push('eslint-config-prettier');
    devDependencies.push('eslint-plugin-eslint-comments');
    devDependencies.push('eslint-plugin-jest');
    devDependencies.push('eslint-plugin-prettier');
    devDependencies.push('eslint');
    devDependencies.push('eslint-plugin-import');
    devDependencies.push('eslint-plugin-jsdoc');
    devDependencies.push('eslint-plugin-react');
    devDependencies.push('eslint-plugin-react-hooks');
    devDependencies.push('eslint-plugin-react-native');
    devDependencies.push('globals');
    devDependencies.push('@typescript-eslint/eslint-plugin');
    devDependencies.push('@typescript-eslint/parser');
  }
  if (isLeftHook) {
    devDependencies.push('lefthook');
    devDependencies.push('lint-staged');
  }
  if (isPrettier) {
    devDependencies.push('prettier');
  }
  devDependencies.push(
    ...[
      '@babel/core',
      '@types/jest',
      '@types/lodash',
      '@types/react',
      '@types/react-test-renderer',
      'babel-plugin-transform-remove-console',
      'jest',
      'jest-expo',
      'react-test-renderer',
      'typescript'
    ]
  );

  return { dependencies, devDependencies };
};

/**
 *
 */
export const PackageTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const name = variables.getProjectNameWithLowerCase;

  return `
    {
      "name": "${name}",
      "version": "1.0.0",
      "private": true,
      "scripts": {
        "start": "expo start",
        "reset-project": "node ./scripts/reset-project.js",
        "android": "expo start --android",
        "ios": "expo start --ios",
        "web": "expo start --web",
        "test": "jest --watchAll",
        "postinstall": "npx lefthook install",
        "lint": "eslint",
        "eslint-fix": "eslint --fix",
        "pretty": "prettier --write './app/**/*.{js,jsx,ts,tsx}'",
        "types": "tsc --noEmit",
        "spelling": "cspell lint './app/**/*.{js,jsx,ts,tsx}'",
        "local-check": "yarn lint && yarn eslint-fix && yarn pretty && yarn types && yarn spelling"
      },
      "jest": {
        "preset": "jest-expo"
      },
      "expo": {
        "doctor": {
          "reactNativeDirectoryCheck": {
            "enabled": false
          }
        }
      },
      "dependencies": {},
      "devDependencies": {}
    }
  `;
};
