export * from './Tsconfig.js';
export * from './PrettierConfig.js';
export * from './Package.js';
export * from './MetroConfig.js';
export * from './LeftHookConfig.js';
export * from './Gitignore.js';
export * from './EslintConfig.js';
export * from './EasConfig.js';
export * from './CspellConfig.js';
export * from './BabelConfig.js';
export * from './AppConfig.js';
export * from './lefthook/index.js';
export * from './vscode/index.js';
export * from './@types/index.js';
export * from './EnvConfig.js';
export * from './app/index.js';

/**
 *
 */
export const MainIndexTemplate = (): string => {
  return `
    import 'react-native-gesture-handler';
    import 'react-native-reanimated';
    import './app/configs/TranslationConfig';
    // eslint-disable-next-line import/order
    import 'expo-router/entry';
  `;
};
