import { QuestionAnswer, AppConstant } from '../../../../../src/index.js';

/**
 *
 */
export const FetchAPIConfigTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const isReduxThunk = variables.isSupportStateManagementMiddleware(
    AppConstant.StateManagementMiddleware.ReduxThunk
  );
  const isReduxSaga = variables.isSupportStateManagementMiddleware(
    AppConstant.StateManagementMiddleware.ReduxSaga
  );

  return `
    import { has, isEmpty } from 'lodash';
    ${isReduxSaga ? "import { CANCEL } from 'redux-saga';" : ''}
    import { AppConst } from '../../../constants';
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
      ApiFetchResponse,
      FetchMethod,
      BodyInit,
      RequestInit_
    } from './FetchAPITypes';
    import type { PROBLEM_CODE, RequestAccessTokenRefresh } from '../CommonTypes';

    /**
     * Converts an fetch response/error into our response.
     */
    const convertFetchResponse = async <T, U = T>(
      startedAt?: number | null,
      fetchResult?: Response | any | null
    ): Promise<ApiFetchResponse<T, U>> => {
      const end: number = toNumber(new Date());
      const duration: number = end - (startedAt ?? 0);

      const isError: boolean =
        fetchResult.name === 'AbortError' || fetchResult.type === 'error' || !fetchResult.ok;
      const fetchResponse: Response = fetchResult as Response;
      let fetchError: any = fetchResult as any;
      const response: Response | undefined = isError ? fetchError : fetchResponse;
      const status: number | undefined = response?.status;
      const problem: PROBLEM_CODE | null = isError
        ? getProblemFromError(fetchResult)
        : getProblemFromStatus(status);
      let originalError: any | null = fetchError;
      const originalResponse: Response | null = fetchResponse;
      const ok: boolean = in200s(status || 0);
      const config: never | undefined = undefined;
      const headers: Headers | undefined = response?.headers;

      const result = isError ? response?.body : await response?.json?.();
      if (isError) {
        fetchError = { ...fetchError, message: result?.error ?? fetchError?.message };
        originalError = { ...originalError, message: result?.error ?? originalError?.message };
      }

      if (ok) {
        const data: T = result as T;
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
        const data: U = result as U;
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
     * It takes a AbortController as an argument and returns a function that cancels the request
     * @param {AbortController} source - AbortController - this is the source of the cancel token that
     * we created in the previous step.
     * @returns A function that takes no arguments and returns void.
     */
    export const cancelFetchRequest = (source: AbortController) => (): void => {
      return source.abort();
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
      //   () => fetch(\`\${BASE_URL}/auth/refresh_token\`, { token: refreshToken }),
      //   {
      //     retries: 3,
      //     delay: 100,
      //     until: (result: Response) => in200s(result.status),
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
    const fetchAPI = applyRefreshAccessToken({
      instance: fetch,
      type: 'Fetch',
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
     * @property {FetchMethod} method - The HTTP method to use.
     * @property {string} path - The url of the endpoint you're trying to hit.
     * @property {boolean} isUnauthorized - if you call unauthorized api at that time pass true.
     * @property {BodyInit} data - The data to be sent to the server.
     * @property {BodyInit} params - The query parameters to be sent with the request.
     * @property {Omit<RequestInit, 'body' | 'method' | 'signal'>} setting - This is an object that contains the following properties:
     * @property {Record<string, any>} paths - The path query parameters to be set with the url.
     * @returns {Promise<ApiFetchResponse<Response>>} - the response from the API
     */
    export const fetchApiWithCancelToken =
      <T, U = T>(
        method: FetchMethod,
        path: string,
        args?: Partial<{
          isUnauthorized: boolean;
          data: BodyInit;
          params: BodyInit;
          setting: Omit<RequestInit, 'body' | 'method' | 'signal'>;
          paths: Record<string, any>;
        }>
      ): ((${isReduxThunk ? 'signal: AbortSignal' : ''}) => Promise<ApiFetchResponse<T, U>>) =>
      async (${isReduxThunk ? 'signal: AbortSignal' : ''}): Promise<ApiFetchResponse<T, U>> => {
        const httpMethod: string = method.toLowerCase();
        const hasData: boolean = ['post', 'put', 'patch'].indexOf(httpMethod) >= 0;
        const isAuthorized: boolean =
          args?.isUnauthorized === undefined ||
          args?.isUnauthorized === null ||
          args?.isUnauthorized === false;
        const isParams: boolean = !hasData && !isEmpty(args?.params);
        const isData: boolean = !isEmpty(args?.data) || !isEmpty(args?.params);

        let settings: RequestInit_ = {
          ...(args?.setting || {}),
          headers: {
            ...(args?.setting?.headers ?? {})
          },
          ...(isData ? { body: isParams ? args?.params : args?.data } : {})
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

        ${isReduxSaga ? 'const source: AbortController = new AbortController();' : ''}

        let finalPath: string = path;
        if (args?.paths) {
          finalPath = formatString(finalPath, args!.paths);
        }

        const request: Promise<Response> = fetchAPI<Response>(isAuthorized, {
          ...settings,
          url: \`\${AppConst.apiUrl}/\${finalPath}\`,
          method: httpMethod,
          signal: ${isReduxSaga ? 'source.signal' : 'signal'}
        });
        ${
          isReduxSaga
            ? `
                // @ts-expect-error but code working fine
                request[CANCEL] = cancelFetchRequest(source);
              `
            : ''
        }

        const startTime = toNumber(new Date());
        /**
         * after the call, convert the fetch response, then execute our monitors
         * @param response
         * @returns
         */
        const chain = async (response: Response | any) => {
          const ourResponse = await convertFetchResponse<T, U>(startTime, response);
          if (AppConst.isDevelopment) {
            logger.v('FETCH API - RESPONSE', {
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
          logger.i('FETCH API - REQUEST', { method, path: finalPath, args, settings });
        }
        return request.then(chain).catch(chain);
      };
  `;
};
