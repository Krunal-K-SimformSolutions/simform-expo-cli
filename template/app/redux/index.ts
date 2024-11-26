import { QuestionAnswer, AppConstant } from '../../../src/index.js';

export * from './app-request/index.js';
export * from './auth/index.js';
export * from './middleware/index.js';
export * from './ReduxUtils.js';
export * from './Store.js';
export * from './useRedux.js';

/**
 *
 */
export const ReduxTemplate = (): string => {
  const variables = QuestionAnswer.instance;
  const isSocket = variables.isSupportFeature(AppConstant.AddFeature.Socket);

  return `
    ${isSocket ? "export * from './app-request';" : ''}
    export * from './auth';
    export * from './useRedux';
    export * from './ReduxUtils';
    export { default as Store, type RootStateType, type AppDispatchType } from './Store';
  `;
};
