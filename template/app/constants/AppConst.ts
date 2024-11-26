export const AppConstTemplate = (): string => {
  return `
    import Constants from 'expo-constants';
    
    const ENV = Constants.expoConfig?.extra

    /**
     * A constant freezing object that contains the paths to the API endpoint url.
     */
    export default Object.freeze({
      mobile: 'Mobile',
      isDevelopment: __DEV__ || (ENV?.ENVIRONMENT ?? 'development') === 'development',
      environment: ENV?.ENVIRONMENT ?? 'development',
      sentryUrl: ENV?.SENTRY_URL ?? '',
      apiUrl: ENV?.API_URL ?? '',
    });
  `;
};
