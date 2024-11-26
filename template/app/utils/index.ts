import { QuestionAnswer, AppConstant } from '../../../src/index.js';

export * from './APIUtils.js';
export * from './LoggerUtils.js';
export * from './AsyncStorageUtils.js';
export * from './NavigatorUtils.js';
export * from './NetworkUtils.js';
export * from './SessionUtils.js';
export * from './StringUtils.js';
export * from './ValidationSchemaUtils.js';

/**
 *
 */
export const UtilTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const isAxios = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Axios);
  const isAWSAmplify = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.AWSAmplify);
  const isFetch = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Fetch);

  return `
    export * from './AsyncStorageUtils';
    // export * from './NavigatorUtils';
    export * from './NetworkUtils';
    export * from './SessionUtils';
    export * from './StringUtils';
    ${isAWSAmplify || isAxios || isFetch ? "export * from './APIUtils';" : ''}
    export * from './LoggerUtils';
    // export * from './ValidationSchemaUtils';
  `;
};
