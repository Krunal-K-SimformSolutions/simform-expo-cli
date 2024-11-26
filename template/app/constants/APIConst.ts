import { QuestionAnswer, AppConstant } from '../../../src/index.js';

/**
 *
 */
export const ApiConstTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const isReduxSaga = variables.isSupportStateManagementMiddleware(
    AppConstant.StateManagementMiddleware.ReduxSaga
  );
  const isReduxThunk = variables.isSupportStateManagementMiddleware(
    AppConstant.StateManagementMiddleware.ReduxThunk
  );

  const isAxios = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Axios);
  const isAWSAmplify = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.AWSAmplify);
  const isFetch = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Fetch);

  return `
    import { ToastType } from '../types';
    ${isReduxSaga ? "import type { APIOptionalArgs } from '../configs';" : ''}
    ${isReduxThunk ? "import type { ThunkAPIOptionalArgs } from '../configs';" : ''}

    export const NONE = null;

    export const CLIENT_ERROR = 'CLIENT_ERROR';

    export const SERVER_ERROR = 'SERVER_ERROR';

    export const TIMEOUT_ERROR = 'TIMEOUT_ERROR';

    export const CONNECTION_ERROR = 'CONNECTION_ERROR';

    export const NETWORK_ERROR = 'NETWORK_ERROR';

    export const UNKNOWN_ERROR = 'UNKNOWN_ERROR';

    export const CANCEL_ERROR = 'CANCEL_ERROR';

    export const TIMEOUT_ERROR_CODES = ['ECONNABORTED'];

    export const NODEJS_CONNECTION_ERROR_CODES = ['ENOTFOUND', 'ECONNREFUSED', 'ECONNRESET'];

    ${
      isAWSAmplify
        ? `
            export const AwsMethodConst = Object.freeze({
              get: 'get',
              post: 'post',
              put: 'put',
              patch: 'patch',
              del: 'del',
              head: 'head'
            });
          `
        : ''
    }

    ${
      isAxios
        ? `
            export const AxiosMethodConst = Object.freeze({
              get: 'get',
              post: 'post',
              put: 'put',
              patch: 'patch',
              head: 'head',
              delete: 'delete',
              options: 'options',
              purge: 'purge',
              link: 'link',
              unlink: 'unlink'
            });
          `
        : ''
    }

    ${
      isFetch
        ? `
            export const FetchMethodConst = Object.freeze({
              get: 'GET',
              post: 'POST',
              put: 'PUT',
              patch: 'PATCH',
              head: 'HEAD',
              delete: 'DELETE',
              options: 'OPTIONS',
              purge: 'PURGE',
              link: 'LINK',
              unlink: 'UNLINK'
            });
          `
        : ''
    }

    ${
      isReduxSaga
        ? `
            export const ReduxActionSuffixNameConst = Object.freeze({
              cancel: 'Cancel',
              success: 'Success',
              failure: 'Failure'
            });
          `
        : ''
    }

    ${
      isReduxSaga
        ? `
            export const OptionalArgsConst: APIOptionalArgs = Object.freeze({
              reduxActionName: '',
              successStatus: [200],
              isShowFailureToast: true,
              customFailureMessage: '',
              parseFailureMessage: undefined,
              toastShowParams: {
                type: ToastType.fail,
                message: undefined,
                title: undefined,
                image: undefined,
                imageTint: undefined,
                interval: 2000
              }
            });
          `
        : ''
    }

    ${
      isReduxThunk
        ? `
            export const OptionalArgsConst: ThunkAPIOptionalArgs = Object.freeze({
              successStatus: [200],
              isShowFailureToast: true,
              customFailureMessage: '',
              parseFailureMessage: undefined,
              toastShowParams: {
                type: ToastType.fail,
                message: undefined,
                title: undefined,
                image: undefined,
                imageTint: undefined,
                interval: 2000
              }
            });
          `
        : ''
    }

    ${
      isAWSAmplify || isAxios || isFetch
        ? `
            /**
             * A constant freezing object that contains the paths to the API endpoint url.
             */
            export const APISuffixURLConst = Object.freeze({
              signIn: 'api/login'
            });
          `
        : ''
    }
  `;
};
