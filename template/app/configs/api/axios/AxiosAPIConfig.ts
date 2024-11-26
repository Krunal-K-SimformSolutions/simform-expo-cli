import { QuestionAnswer, AppConstant } from '../../../../../src/index.js';

/**
 *
 */
export const AxiosAPIConfigTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const isReduxThunk = variables.isSupportStateManagementMiddleware(
    AppConstant.StateManagementMiddleware.ReduxThunk
  );
  const isReduxSaga = variables.isSupportStateManagementMiddleware(
    AppConstant.StateManagementMiddleware.ReduxSaga
  );

  return `
    import axios, {
      isCancel,
      isAxiosError,
      type CancelTokenSource,
      type RawAxiosResponseHeaders,
      type AxiosError,
      type AxiosRequestConfig,
      type AxiosResponse,
      type AxiosResponseHeaders
    } from 'axios';
    import { has, isEmpty } from 'lodash';
    ${isReduxSaga ? "import { CANCEL } from 'redux-saga';" : ''}
    import { StringConst, AppConst } from '../../../constants';
    import {
      formatString,
      getProblemFromError,
      getProblemFromStatus,
      in200s,
      logger,
      toNumber,
      clearAuthTokens,
      getAccessToken,
      type AuthTokens,
      type Token
    } from '../../../utils';
    import { DEFAULT_VALUE } from '../CommonConst';
    import { applyRefreshAccessToken } from '../CommonToken';
    import type {
      ApiErrorResponse,
      ApiOkResponse,
      ApiAxiosResponse,
      AxiosMethod
    } from './AxiosAPITypes';
    import type { PROBLEM_CODE, RequestAccessTokenRefresh } from '../CommonTypes';

    /**
     * Converts an axios response/error into our response.
     */
    const convertAxiosResponse = async <T, U = T>(
      startedAt?: number | null,
      axiosResult?: AxiosResponse | AxiosError | null
    ): Promise<ApiAxiosResponse<T, U>> => {
      const end: number = toNumber(new Date());
      const duration: number = end - (startedAt ?? 0);

      // new in Axios 0.13 -- some data could be buried 1 level now
      const isError: boolean =
        axiosResult instanceof Error || isCancel(axiosResult) || isAxiosError(axiosResult);
      const axiosResponse: AxiosResponse<any, any> = axiosResult as AxiosResponse;
      let axiosError: AxiosError<unknown, any> = axiosResult as AxiosError;
      const response: AxiosResponse<any, any> | undefined = isError
        ? axiosError?.response
        : axiosResponse;
      const status: number | undefined = response?.status;
      const problem: PROBLEM_CODE | null = isError
        ? getProblemFromError(axiosResult)
        : getProblemFromStatus(status);
      let originalError: AxiosError<unknown, any> | null = axiosError;
      const originalResponse: AxiosResponse<any, any> | null = axiosResponse;
      const ok: boolean = in200s(status || 0);
      const config: AxiosRequestConfig<any> | undefined = axiosResult?.config;
      const headers: RawAxiosResponseHeaders | AxiosResponseHeaders | undefined = response?.headers;

      const result = response?.data;
      if (isError) {
        axiosError = { ...axiosError, message: result?.error ?? axiosError?.message };
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
     * It takes a CancelTokenSource as an argument and returns a function that cancels the request
     * @param {CancelTokenSource} source - CancelTokenSource - this is the source of the cancel token that
     * we created in the previous step.
     * @returns A function that takes no arguments and returns void.
     */
    export const cancelAxiosRequest = (source: CancelTokenSource) => (): void => {
      return source.cancel?.(StringConst.ApiError.cancel);
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
      // const response = await retry(
      //   () => axios.post(\`\${BASE_URL}/auth/refresh_token\`, { token: refreshToken }),
      //   {
      //     retries: 3,
      //     delay: 100,
      //     until: (result: AxiosResponse<any, any>) => in200s(result.status),
      //     timeout: 2 * 60 * 1000,
      //     backoff: 'FIXED',
      //     maxBackOff: 2 * 60 * 1000,
      //     retryIf: (error: any) => error.message !== DEFAULT_VALUE.messageText
      //   }
      // );
      // return response.data.access_token;
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
    const axiosAPI = applyRefreshAccessToken({
      instance: axios,
      type: 'Axios',
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
     * A function that takes in an object with an api, method, url, params, data, and setting
     * property. It also takes in a source parameter.
     * @property {AxiosMethod} method - The HTTP method to use.
     * @property {string} path - The url of the endpoint you're trying to hit.
     * @property {boolean} isUnauthorized - if you call unauthorized api at that time pass true.
     * @property {Record<string, any>} data - The data to be sent to the server.
     * @property {Record<string, any>} params - The query parameters to be sent with the request.
     * @property {AxiosRequestConfig<any>} setting - This is an object that contains the following properties:
     * @property {Record<string, any>} paths - The path query parameters to be set with the url.
     * @returns {Promise<ApiAxiosResponse<Response>>} - the response from the API
     */
    export const axiosApiWithCancelToken =
      <T, U = T>(
        method: AxiosMethod,
        path: string,
        args?: Partial<{
          isUnauthorized: boolean;
          data: Record<string, any>;
          params: Record<string, any>;
          setting: AxiosRequestConfig<any>;
          paths: Record<string, any>;
        }>
      ): ((${isReduxThunk ? 'signal: AbortSignal' : ''}) => Promise<ApiAxiosResponse<T, U>>) =>
      async (${isReduxThunk ? 'signal: AbortSignal' : ''}): Promise<ApiAxiosResponse<T, U>> => {
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
          ...(isData ? { [isParams ? 'params' : 'data']: isParams ? args?.params : args?.data } : {})
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

        // eslint-disable-next-line import/no-named-as-default-member
        const source: CancelTokenSource = axios.CancelToken.source();
        let finalPath: string = path;
        if (args?.paths) {
          finalPath = formatString(finalPath, args!.paths);
        }

        const request: Promise<AxiosResponse<T, U>> = axiosAPI<AxiosResponse<T, U>>(isAuthorized, {
          ...settings,
          url: finalPath,
          baseURL: AppConst.apiUrl,
          timeout: 120000,
          method: httpMethod,
          cancelToken: source.token
        });
        ${
          isReduxSaga
            ? `
                // @ts-expect-error but code working fine
                request[CANCEL] = cancelAxiosRequest(source);
              `
            : ''
        }
        ${
          isReduxThunk
            ? `
                signal.addEventListener('abort', () => {
                  cancelAxiosRequest(source);
                });
              `
            : ''
        }

        const startTime = toNumber(new Date());
        /**
         * after the call, convert the axios response, then execute our monitors
         * @param response
         * @returns
         */
        const chain = async (response: AxiosResponse<T, U> | AxiosError<T, U>) => {
          const ourResponse = await convertAxiosResponse<T, U>(startTime, response);
          if (AppConst.isDevelopment) {
            logger.v('AXIOS API - RESPONSE', {
              method,
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
          logger.i('AXIOS API - REQUEST', { method, path: finalPath, args, settings });
        }
        return request.then(chain).catch(chain);
      };
  `;
};
