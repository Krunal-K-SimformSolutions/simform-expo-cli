/**
 *
 */
export const MetroConfigTemplate = (): string => {
  return `
    const { getSentryExpoConfig } = require('@sentry/react-native/metro');

    const config = getSentryExpoConfig(__dirname);

    module.exports = config;
  `;
};
