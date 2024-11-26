import { QuestionAnswer, AppConstant } from '../../../src/index.js';

export * from './api/index.js';
export * from './socket/index.js';
export * from './GraphQlConfig.js';
export * from './SentryConfig.js';
export * from './TranslationConfig.js';

/**
 *
 */
export const ConfigTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const isGraphQL = variables.isSupportStateManagement(AppConstant.StateManagement.GraphQL);

  const isSentry = variables.isSupportFeature(AppConstant.AddFeature.Sentry);
  const isTranslations = variables.isSupportFeature(AppConstant.AddFeature.Translations);
  const isSocket = variables.isSupportFeature(AppConstant.AddFeature.Socket);

  const isAxios = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Axios);
  const isAWSAmplify = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.AWSAmplify);
  const isFetch = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Fetch);

  return `
    ${isGraphQL ? "export * from './GraphQlConfig';" : ''}
    ${isSentry ? "export * from './SentryConfig';" : ''}
    ${isTranslations ? "export { default as i18n } from './TranslationConfig';" : ''}
    ${isAWSAmplify || isAxios || isFetch ? "export * from './api';" : ''}
    ${isSocket ? "export * from './socket';" : ''}
  `;
};
