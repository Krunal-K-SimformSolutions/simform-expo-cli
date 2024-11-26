import { QuestionAnswer, AppConstant } from '../src/index.js';

export const PackageTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const name = variables.getProjectNameWithLowerCase;
  const isSentry = variables.isSupportFeature(AppConstant.AddFeature.Sentry);
  const isTranslations = variables.isSupportFeature(AppConstant.AddFeature.Translations);
  const isEsLint = variables.isSupportFeature(AppConstant.AddFeature.EsLint);
  const isPrettier = variables.isSupportFeature(AppConstant.AddFeature.Prettier);
  const isCSpell = variables.isSupportFeature(AppConstant.AddFeature.CSpell);
  const isLeftHook = variables.isSupportFeature(AppConstant.AddFeature.LeftHook);
  const isSocket = variables.isSupportFeature(AppConstant.AddFeature.Socket);

  const isReactRedux = variables.isSupportStateManagement(AppConstant.StateManagement.ReactRedux);
  const isReduxSaga = variables.isSupportStateManagementMiddleware(
    AppConstant.StateManagementMiddleware.ReduxSaga
  );

  const isAxios = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Axios);
  const isAWSAmplify = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.AWSAmplify);
  const isFetch = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Fetch);

  return `
    {
      "name": "${name}",
      "main": "expo-router/entry",
      "version": "1.0.0",
      "scripts": {
        "start": "expo start",
        "reset-project": "node ./scripts/reset-project.js",
        "android": "expo start --android",
        "ios": "expo start --ios",
        "web": "expo start --web",
        "test": "jest --watchAll",
        "postinstall": "npx lefthook install",
        "lint": "eslint --debug",
        "eslint-fix": "eslint --fix",
        "pretty": "prettier --write './app/**/*.{js,jsx,ts,tsx}'",
        "types": "tsc --noEmit",
        "spelling": "cspell lint './app/**/*.{js,jsx,ts,tsx}'",
        "local-check": "yarn lint && yarn eslint-fix && yarn pretty && yarn types && yarn spelling"
      },
      "jest": {
        "preset": "jest-expo"
      },
      "dependencies": {
        ${isSentry ? `"@sentry/react-native": "^6.2.0",` : ''}
        ${isReactRedux ? `"@reduxjs/toolkit": "^2.3.0",` : `"@apollo/client": "^3.11.4",`}
        ${isReactRedux ? `"react-redux": "^9.1.2",` : `"graphql": "^16.9.0",`}
        ${isReactRedux ? `"redux-persist": "^6.0.0",` : `"apollo3-cache-persist": "^0.15.0",`}
        ${isReduxSaga ? `"redux-saga": "^1.3.0",` : ''}
        ${isAxios ? `"axios": "^1.6.7",` : ''}
        ${isAWSAmplify ? `"aws-amplify": "^5.3.12",` : ''}
        ${isAWSAmplify ? `"aws-amplify-react-native": "^7.0.8",` : ''}
        ${isAWSAmplify ? `"react-native-get-random-values": "^1.11.0",` : ''}
        ${isAWSAmplify ? `"@react-native-community/netinfo": "^11.4.1",` : ''}
        ${isAxios || isAWSAmplify || isFetch ? `"jwt-decode": "^4.0.0",` : ''}
        ${isTranslations ? `"i18next": "^23.10.0",` : ''}
        ${isTranslations ? `"react-i18next": "^14.0.5",` : ''}
        ${isTranslations ? `"expo-localization": "15.0.3",` : ''}
        ${isSocket ? `"uuid": "^9.0.1",` : ''}
        "@react-native-async-storage/async-storage": "^1.23.1",
        "@expo/vector-icons": "^14.0.2",
        "@react-navigation/bottom-tabs": "^7.0.0",
        "@react-navigation/native": "^7.0.0",
        "expo": "~52.0.10",
        "expo-blur": "~14.0.1",
        "expo-constants": "~17.0.3",
        "expo-font": "~13.0.1",
        "expo-haptics": "~14.0.0",
        "expo-linking": "~7.0.3",
        "expo-network": "~7.0.3",
        "expo-router": "~4.0.7",
        "expo-splash-screen": "~0.29.13",
        "expo-status-bar": "~2.0.0",
        "expo-symbols": "~0.2.0",
        "expo-system-ui": "~4.0.3",
        "expo-web-browser": "~14.0.1",
        "react": "18.3.1",
        "react-dom": "18.3.1",
        "react-native": "0.76.2",
        "react-native-gesture-handler": "~2.20.2",
        "react-native-reanimated": "~3.16.1",
        "react-native-safe-area-context": "4.12.0",
        "react-native-screens": "~4.1.0",
        "react-native-web": "~0.19.13",
        "react-native-webview": "13.12.2",
        "expo-build-properties": "0.12.5",
        "react-native-svg": "^15.1.0"
      },
      "devDependencies": {
        "@babel/core": "^7.25.2",
        "@types/jest": "^29.5.12",
        ${isAxios || isAWSAmplify || isFetch ? `"@types/jwt-decode": "^3.1.0",` : ''}
        "@types/lodash": "^4.17.0",
        "@types/react": "~18.3.12",
        "@types/react-test-renderer": "^18.3.0",
        ${isSocket ? `"@types/uuid": "^9.0.8",` : ''}
        ${isCSpell ? `"cspell": "^8.16.0",` : ''}
        ${isEsLint ? `"eslint": "^9.15.0",` : ''}
        ${isEsLint ? `"eslint-plugin-import": "^2.31.0",` : ''}
        ${isEsLint ? `"eslint-plugin-jsdoc": "^50.5.0",` : ''}
        ${isEsLint ? `"eslint-plugin-react": "^7.37.2",` : ''}
        ${isEsLint ? `"eslint-plugin-react-hooks": "^5.0.0",` : ''}
        ${isEsLint ? `"eslint-plugin-react-native": "^4.1.0",` : ''}
        ${isEsLint ? `"globals": "^15.12.0",` : ''}
        ${isEsLint ? `"@typescript-eslint/eslint-plugin": "^8.17.0",` : ''}
        ${isEsLint ? `"@typescript-eslint/parser": "^8.17.0",` : ''}
        ${isLeftHook ? `"lefthook": "^1.8.4",` : ''}
        ${isLeftHook ? `"lint-staged": "^15.2.10",` : ''}
        ${isPrettier ? `"prettier": "^3.3.3",` : ''}
        "babel-plugin-transform-remove-console": "^6.9.4",
        "jest": "^29.2.1",
        "jest-expo": "~52.0.2",
        "react-test-renderer": "18.3.1",
        "typescript": "^5.3.3"
      },
      "private": true
    }
  `;
};
