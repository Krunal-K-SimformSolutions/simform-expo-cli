import { QuestionAnswer, AppConstant } from '../../../../src/index.js';

export * from './aws/index.js';
export * from './axios/index.js';
export * from './fetch/index.js';
export * from './CommonAPIConfig.js';
export * from './CommonConst.js';
export * from './CommonToken.js';
export * from './CommonTypes.js';

/**
 *
 */
export const ApiTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const isReduxThunk = variables.isSupportStateManagementMiddleware(
    AppConstant.StateManagementMiddleware.ReduxThunk
  );
  const isReduxSaga = variables.isSupportStateManagementMiddleware(
    AppConstant.StateManagementMiddleware.ReduxSaga
  );

  const isAxios = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Axios);
  const isAWSAmplify = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.AWSAmplify);
  const isFetch = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Fetch);

  return `
    ${isAWSAmplify ? "export * from './aws';" : ''}
    ${isAxios ? "export * from './axios';" : ''}
    ${isFetch ? "export * from './fetch';" : ''}
    ${isReduxThunk ? "export { createAsyncThunkWithCancelToken } from './CommonAPIConfig';" : ''}
    ${isReduxSaga ? "export { apiCallWithCallback, apiCallWithReturn } from './CommonAPIConfig';" : ''}
    export type {
      ${isReduxThunk ? 'APIDispatch,' : ''}
      ErrorPayload,
      SuccessPayload,
      ${isReduxThunk ? 'ThunkAPIOptionalArgs,' : ''}
      PROBLEM_CODE,
      APIOptionalArgs${isReduxSaga ? ',\nAPICallEffect' : ''}
    } from './CommonTypes';
    export * from './CommonToken';
  `;
};
