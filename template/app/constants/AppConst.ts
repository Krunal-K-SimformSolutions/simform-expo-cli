/**
 *
 */
export const AppConstTemplate = (): string => {
  return `
    /**
     * A constant freezing object that contains the paths to the API endpoint url.
     */
    export default Object.freeze({
      mobile: 'Mobile',
      isDevelopment: __DEV__ || (process.env.EXPO_PUBLIC_ENVIRONMENT ?? 'development') === 'development',
      environment: process.env.EXPO_PUBLIC_ENVIRONMENT ?? 'development',
      sentryUrl: process.env.EXPO_PUBLIC_SENTRY_URL ?? '',
      apiUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
    });
  `;
};
