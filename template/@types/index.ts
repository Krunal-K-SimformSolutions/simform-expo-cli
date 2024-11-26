export * from './ReactNativeSVG.js';

/**
 *
 */
export const TypesIndexTemplate = () => {
  return `
    declare let process: {
      env: {
        EXPO_PUBLIC_ENVIRONMENT?: string;
        EXPO_PUBLIC_SENTRY_URL?: string;
        EXPO_PUBLIC_API_URL?: string;
        SENTRY_AUTH_TOKEN?: string;
      };
    };
  `;
};
