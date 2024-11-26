import { QuestionAnswer, AppConstant } from '../../../../../src/index.js';

/**
 *
 */
export const AwsAPIConfigTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const isReduxThunk = variables.isSupportStateManagementMiddleware(
    AppConstant.StateManagementMiddleware.ReduxThunk
  );
  const isReduxSaga = variables.isSupportStateManagementMiddleware(
    AppConstant.StateManagementMiddleware.ReduxSaga
  );

  return `
    import { Amplify, API } from 'aws-amplify';
    import { isAxiosError, isCancel } from 'axios';
    import { has, isEmpty } from 'lodash';
    ${isReduxSaga ? "import { CANCEL } from 'redux-saga';" : ''}
    import { StringConst, AppConst } from '../../../constants';
    import {
      formatString,
      toNumber,
      AWSAmplifyStorage,
      getProblemFromError,
      getProblemFromStatus,
      in200s,
      logger,
      clearAuthTokens,
      getAccessToken,
      type AuthTokens,
      type Token
    } from '../../../utils';
    import { DEFAULT_VALUE } from '../CommonConst';
    import { applyRefreshAccessToken } from '../CommonToken';
    import type { ApiErrorResponse, ApiOkResponse, ApiAwsResponse, AwsMethod } from './AwsAPITypes';
    import type { PROBLEM_CODE, RequestAccessTokenRefresh } from '../CommonTypes';
    import type {
      AxiosError,
      AxiosRequestConfig,
      AxiosResponse,
      AxiosResponseHeaders,
      RawAxiosResponseHeaders
    } from 'axios';

    /**
     * Configure aws amplify
     * @param {any} config - The amplify config json.
     * @returns {} - The empty object
     */
    export const awsApiConfig = (config?: any): object => {
      return Amplify.configure({
        ...config,
        storage: AWSAmplifyStorage
      });
    };

    /**
     * Converts an awsAmplify response/error into our response.
     */
    const convertAwsResponse = async <T, U = T>(
      startedAt?: number | null,
      awsAmplifyResult?: AxiosResponse | AxiosError | null
    ): Promise<ApiAwsResponse<T, U>> => {
      const end: number = toNumber(new Date());
      const duration: number = end - (startedAt ?? 0);

      // new in awsAmplify 0.13 -- some data could be buried 1 level now
      const isError: boolean =
        awsAmplifyResult instanceof Error ||
        API.isCancel(awsAmplifyResult) ||
        isCancel(awsAmplifyResult) ||
        isAxiosError(awsAmplifyResult);
      const awsAmplifyResponse: AxiosResponse<any, any> = awsAmplifyResult as AxiosResponse;
      let awsAmplifyError: AxiosError<unknown, any> = awsAmplifyResult as AxiosError;
      const response: AxiosResponse<any, any> | undefined = isError
        ? awsAmplifyError?.response
        : awsAmplifyResponse;
      const status: number | undefined = response?.status;
      const problem: PROBLEM_CODE | null = isError
        ? getProblemFromError(awsAmplifyResult)
        : getProblemFromStatus(status);
      let originalError: AxiosError<unknown, any> | null = awsAmplifyError;
      const originalResponse: AxiosResponse<any, any> | null = awsAmplifyResponse;
      const ok: boolean = in200s(status || 0);
      const config: AxiosRequestConfig<any> | undefined = awsAmplifyResult?.config;
      const headers: RawAxiosResponseHeaders | AxiosResponseHeaders | undefined = response?.headers;

      const result = response?.data;
      if (isError) {
        awsAmplifyError = { ...awsAmplifyError, message: result?.error ?? awsAmplifyError?.message };
        originalError = { ...originalError, message: result?.error ?? originalError?.message };
      }

      if (ok) {
        const data: T = result;
        return {
          duration,
          problem,
          originalError,
          ok,
          status,
          headers,
          config,
          data,
          originalResponse
        } as ApiOkResponse<T>;
      } else {
        const data: U = result;
        return {
          duration,
          problem,
          originalError,
          ok,
          status,
          headers,
          config,
          data,
          originalResponse
        } as ApiErrorResponse<U>;
      }
    };

    /**
     * It takes a promise and returns a function that cancels the promise
     * @param request - Promise<any> - The promise that was returned from the API call.
     * @returns A function that returns a boolean.
     */
    export const cancelAwsRequest = (request: Promise<any>) => (): boolean => {
      return API.cancel(request, StringConst.ApiError.cancel);
    };

    /**
     * Define token refresh function.
     * @param refreshToken
     * @returns
     */
    const requestAccessTokenRefresh: RequestAccessTokenRefresh = async (
      refreshToken: Token
    ): Promise<Token | AuthTokens> => {
      // Important! Do NOT use the axios instance that you supplied to applyAuthTokenFetch
      // because this will result in an infinite loop when trying to refresh the token.
      // Use the global fetch client or a different instance
      // const response: CognitoUserSession = await retry(
      //   () => Auth.currentSession(),
      //   {
      //     retries: 3,
      //     delay: 100,
      //     until: (result: CognitoUserSession) => true,
      //     timeout: 2 * 60 * 1000,
      //     backoff: 'FIXED',
      //     maxBackOff: 2 * 60 * 1000,
      //     retryIf: (error: any) => error.message !== DEFAULT_VALUE.messageText
      //   }
      // );
      // return response.getIdToken().getJwtToken();
      return refreshToken;
    };

    /**
     * Log out by clearing the auth tokens from AsyncStorage
     */
    const doLogout = () => {
      clearAuthTokens();
    };

    /**
     * Create refresh fetch instance
     */
    const awsAmplifyAPI = applyRefreshAccessToken({
      instance: API,
      type: 'AwsAmplify',
      doLogout, // function that navigate to auth flow
      requestAccessTokenRefresh, // async function that takes a refreshToken and returns a promise the resolves in a fresh accessToken
      header: DEFAULT_VALUE.header, // header name
      headerPrefix: DEFAULT_VALUE.headerPrefix, // header value prefix
      expireFudge: DEFAULT_VALUE.expireFudge, // a little time before expiration to try refresh
      statusCodes: DEFAULT_VALUE.statusCodes, // status code to consider unauthorize call
      messageText: DEFAULT_VALUE.messageText // message text to consider unauthorize call
    });

    /**
     * Makes a request to the API with the given config.
     * A function that takes in an object with an method, apiName, path, params, data, paths, and setting
     * property. It also takes in a source parameter.
     * @property {AwsMethod} method - The HTTP method to use.
     * @property {string} apiName - The api name which you want to call from config object.
     * @property {string} path - The url of the endpoint you're trying to hit.
     * @property {boolean} isUnauthorized - if you call unauthorized api at that time pass true.
     * @property {Record<string, any>} data - The data to be sent to the server.
     * @property {Record<string, any>} params - The query parameters to be sent with the request.
     * @property {Record<string, any>} paths - The path query parameters to be set with the url.
     * @property { Record<string, any>} setting - The config parameters to be set when api call.
     * @returns {Promise<ApiAwsResponse<T, U>>} - the response from the API
     */
    export const awsApiWithCancelToken =
      <T, U = T>(
        method: AwsMethod,
        apiName: string,
        path: string,
        args?: Partial<{
          isUnauthorized: boolean;
          data: Record<string, any>;
          params: Record<string, any>;
          paths: Record<string, any>;
          setting: Record<string, any>;
        }>
      ): ((${isReduxThunk ? 'signal: AbortSignal' : ''}) => Promise<ApiAwsResponse<T, U>>) =>
      async (${isReduxThunk ? 'signal: AbortSignal' : ''}): Promise<ApiAwsResponse<T, U>> => {
        const httpMethod: string = method.toLowerCase();
        const hasData: boolean = ['post', 'put', 'patch'].indexOf(httpMethod) >= 0;
        const isAuthorized: boolean =
          args?.isUnauthorized === undefined ||
          args?.isUnauthorized === null ||
          args?.isUnauthorized === false;
        const isParams: boolean = !hasData && !isEmpty(args?.params);
        const isData: boolean = !isEmpty(args?.data) || !isEmpty(args?.params);

        let settings = {
          ...(args?.setting || {}),
          headers: {
            ...(args?.setting?.headers ?? {})
          },
          response:
            args?.setting?.response !== undefined && args?.setting?.response !== null
              ? args?.setting?.response
              : true,
          ...(isData
            ? {
                [isParams ? 'queryStringParameters' : 'body']: isParams ? args?.params : args?.data
              }
            : {})
        };
        if (isAuthorized) {
          const token: Token | undefined = await getAccessToken();
          settings = {
            ...settings,
            headers: {
              [DEFAULT_VALUE.header]: \`\${DEFAULT_VALUE.headerPrefix}\${token}\`,
              ...settings.headers
            }
          };
        } else if (has(settings, \`headers.\${DEFAULT_VALUE.header}\`)) {
          delete settings.headers[DEFAULT_VALUE.header];
        }

        let finalPath = path;
        if (args?.paths) {
          finalPath = formatString(finalPath, args!.paths);
        }

        const request: Promise<any> = awsAmplifyAPI<any>(isAuthorized, {
          apiName: apiName,
          path: finalPath,
          init: settings,
          method: httpMethod
        });
        ${
          isReduxSaga
            ? `
                // @ts-expect-error but code working fine
                request[CANCEL] = cancelAwsRequest(request);
              `
            : ''
        }
        ${
          isReduxThunk
            ? `
                signal.addEventListener('abort', () => {
                  cancelAwsRequest(request);
                });
              `
            : ''
        }

        const startTime = toNumber(new Date());
        /**
         * after the call, convert the aws amplify response, then execute our monitors
         * @param response
         * @returns
         */
        const chain = async (response: AxiosResponse | AxiosError) => {
          const ourResponse = await convertAwsResponse<T, U>(startTime, response);
          if (AppConst.isDevelopment) {
            logger.v('AWS API - RESPONSE', {
              method,
              apiName,
              path: finalPath,
              args,
              settings,
              response,
              ourResponse
            });
          }
          return ourResponse;
        };

        if (AppConst.isDevelopment) {
          logger.i('AWS API - REQUEST', { method, apiName, path: finalPath, args, settings });
        }
        return request.then(chain).catch(chain);
      };
  `;
};
