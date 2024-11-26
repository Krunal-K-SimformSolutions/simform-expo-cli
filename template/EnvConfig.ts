import { QuestionAnswer } from '@/questions';

export const EnvConfigTemplate = (env: string): string => {
  const variables = QuestionAnswer.instance;

  return `
API_URL=${variables.getApiBaseURL}
SENTRY_URL=${variables.getSentryDsnURL}
ENVIRONMENT=${env}
SENTRY_AUTH_TOKEN=${variables.getSentryAuthToken}
  `;
};
