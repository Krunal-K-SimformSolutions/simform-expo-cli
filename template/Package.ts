import { QuestionAnswer } from '@/questions';

export const PackageTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const name = variables.getProjectNameWithLowerCase;
  const isSentry = variables.isSupportFeature('Sentry');
  const isTranslations = variables.isSupportFeature('Translations');
  const isEsLint = variables.isSupportFeature('EsLint');
  const isPrettier = variables.isSupportFeature('Prettier');
  const isCSpell = variables.isSupportFeature('CSpell');
  const isLeftHook = variables.isSupportFeature('LeftHook');

  const isReactRedux = variables.isReactReduxStateManagement;
  const isReduxSaga = variables.isReduxSagaStateManagementMiddleware;

  const isAxios = variables.isSupportApiMiddleware('Axios');
  const isAWSAmplify = variables.isSupportApiMiddleware('AWSAmplify');

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
        "lint": "expo lint",
        "postinstall": "lefthook install",
        "lint": "eslint './app/**/*.{js,jsx,ts,tsx}'",
        "eslint-fix": "eslint --fix './app/**/*.{js,jsx,ts,tsx}'",
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
        ${isAWSAmplify ? `"@react-native-async-storage/async-storage": "^1.23.1",` : ''}
        ${isTranslations ? `"i18next": "^23.10.0",` : ''}
        ${isTranslations ? `"react-i18next": "^14.0.5",` : ''}
        ${isTranslations ? `"expo-localization": "15.0.3",` : ''}
        "@expo/vector-icons": "^14.0.2",
        "@react-navigation/bottom-tabs": "^7.0.0",
        "@react-navigation/native": "^7.0.0",
        "expo": "~52.0.10",
        "expo-blur": "~14.0.1",
        "expo-constants": "~17.0.3",
        "expo-font": "~13.0.1",
        "expo-haptics": "~14.0.0",
        "expo-linking": "~7.0.3",
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
        "expo-build-properties": "0.12.5"
      },
      "devDependencies": {
        "@babel/core": "^7.25.2",
        "@types/jest": "^29.5.12",
        "@types/react": "~18.3.12",
        "@types/react-test-renderer": "^18.3.0",
        ${isCSpell ? `"cspell": "^8.16.0",` : ''}
        ${isEsLint ? `"eslint": "^9.15.0",` : ''}
        ${isEsLint ? `"eslint-plugin-import": "^2.31.0",` : ''}
        ${isEsLint ? `"eslint-plugin-jsdoc": "^50.5.0",` : ''}
        ${isEsLint ? `"globals": "^15.12.0",` : ''}
        ${isLeftHook ? `"lefthook": "^1.8.4",` : ''}
        ${isLeftHook ? `"lint-staged": "^15.2.10",` : ''}
        ${isPrettier ? `"prettier": "^3.3.3",` : ''}
        "jest": "^29.2.1",
        "jest-expo": "~52.0.2",
        "react-test-renderer": "18.3.1",
        "typescript": "^5.3.3"
      },
      "private": true
    }
  `;
};
