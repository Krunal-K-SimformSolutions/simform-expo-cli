import { QuestionAnswer } from '../src/index.js';

/**
 *
 */
export const EnvConfigTemplate = (env: string): string => {
  const variables = QuestionAnswer.instance;

  return `
EXPO_PUBLIC_API_URL=${variables.getApiBaseURL}
EXPO_PUBLIC_SENTRY_URL=${variables.getSentryDsnURL}
EXPO_PUBLIC_ENVIRONMENT=${env}
SENTRY_AUTH_TOKEN=${variables.getSentryAuthToken}
  `;
};
