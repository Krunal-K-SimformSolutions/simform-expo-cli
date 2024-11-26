import { QuestionAnswer, AppConstant } from '../../../../src/index.js';

/**
 *
 */
const getDoRequestTemplate = (
  isAWSAmplify: boolean,
  isAxios: boolean,
  isFetch: boolean
): string => {
  const awsAmplify: string = `
      const { method, apiName, path, init } = settings as AwsAmplifySettings;
      // @ts-expect-error but code working fine
      return instance[method](apiName, path, init);
    `;
  const axios: string = `
      // @ts-expect-error but code working fine
      return instance(settings as AxiosSettings);
    `;
  const fetch: string = `
      const { url, ...rest } = settings as FetchSettings;
      // @ts-expect-error but code working fine
      return instance(url, rest);
    `;

  if (isAWSAmplify && isAxios && isFetch) {
    return `
      if (isAwsAmplify) {
        ${awsAmplify}
      } else if (isAxios) {
        ${axios}
      } else if (isFetch) {
        ${fetch}
      }
    `;
  } else if (isAWSAmplify && isAxios) {
    return `
      if (isAwsAmplify) {
        ${awsAmplify}
      } else if (isAxios) {
        ${axios}
      }
    `;
  } else if (isAWSAmplify && isFetch) {
    return `
      if (isAwsAmplify) {
        ${awsAmplify}
      } else if (isFetch) {
        ${fetch}
      }
    `;
  } else if (isAxios && isFetch) {
    return `
      if (isAxios) {
        ${axios}
      } else if (isFetch) {
        ${fetch}
      }
    `;
  } else if (isAWSAmplify) {
    return `
      if (isAwsAmplify) {
        ${awsAmplify}
      }
    `;
  } else if (isAxios) {
    return `
      if (isAxios) {
        ${axios}
      }
    `;
  } else if (isFetch) {
    return `
      if (isFetch) {
        ${fetch}
      }
    `;
  } else {
    return '';
  }
};

/**
 *
 */
export const CommonTokenTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const isAxios = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Axios);
  const isAWSAmplify = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.AWSAmplify);
  const isFetch = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Fetch);

  return `
    import { jwtDecode, type JwtPayload } from 'jwt-decode';
    import { get, isNil, isEmpty } from 'lodash';
    import { StringConst } from '../../constants';
    import {
      formatString,
      setAuthTokens,
      getRefreshToken,
      setAccessToken,
      getAccessToken,
      clearAuthTokens,
      type AuthTokens,
      type Token
    } from '../../utils';
    import { DEFAULT_VALUE } from './CommonConst';
    import type {
      AccessTokenRefreshConfig,
      ${isAWSAmplify ? 'AwsAmplifySettings,' : ''}
      ${isAxios ? 'AxiosSettings,' : ''}
      ${isFetch ? 'FetchSettings,' : ''}
      APISettings,
      LogoutRequest,
      RequestAccessTokenRefresh,
      RequestQueue,
      RequestsQueue
    } from './CommonTypes';

    let isRefreshing = false;
    let queue: RequestsQueue = [];

    // a little time before expiration to try refresh (seconds)
    let expireFudgeSeconds: number = 10;

    /**
     * Update expiration fudge time
     *
     * @param {number} expireFudge
     */
    export function addQueue(item: RequestQueue): void {
      queue.push(item);
    }

    /**
     * Update expiration fudge time
     *
     * @param {number} expireFudge
     */
    export function setExpireFudgeSeconds(expireFudge: number): void {
      expireFudgeSeconds = expireFudge;
    }

    /**
     * Check if tokens are currently being refreshed
     *
     * @returns {boolean} True if the tokens are currently being refreshed, false is not
     */
    export function getIsRefreshing(): boolean {
      return isRefreshing;
    }

    /**
     * Update refresh state
     *
     * @param {boolean} newRefreshingState
     */
    export function setIsRefreshing(newRefreshingState: boolean): void {
      isRefreshing = newRefreshingState;
    }

    /**
     * Function that resolves all items in the queue with the provided token
     * @param token New access token
     */
    export const resolveQueue = (token?: string) => {
      queue.forEach((p) => {
        p.resolve(token);
      });

      queue = [];
    };

    /**
     * Function that declines all items in the queue with the provided error
     * @param error Error
     */
    export const declineQueue = (error: Error) => {
      queue.forEach((p) => {
        p.reject(error);
      });

      queue = [];
    };

    /**
     * Gets the unix timestamp from the JWT access token
     *
     * @param {string} token - Access token
     * @returns {string} Unix timestamp
     */
    export const getTimestampFromToken = (token: Token): number | undefined => {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(token);
      return decoded.exp;
    };

    /**
     * Returns the number of seconds before the access token expires or -1 if it already has
     *
     * @param {string} token - Access token
     * @returns {number} Number of seconds before the access token expires
     */
    export const getExpiresIn = (token: Token): number => {
      const expiration: number | undefined = getTimestampFromToken(token);
      if (!expiration) return -1;
      return expiration - Date.now() / 1000;
    };

    /**
     * Checks if the token is undefined, has expired or is about to expire
     *
     * @param {string} token - Access token
     * @returns {boolean} Whether or not the token is undefined, has expired or is about to expire
     */
    export const isTokenExpired = (token: Token): boolean => {
      if (!token) return true;
      const expiresIn: number = getExpiresIn(token);
      return (!expiresIn || expiresIn <= expireFudgeSeconds) && expiresIn !== -1;
    };

    /**
     * Refreshes the access token using the provided function
     * @async
     * @param {RequestAccessTokenRefresh} requestAccessTokenRefresh - Function that is used to get a new access token
     * @returns {Promise<string>} - Fresh access token
     */
    export const refreshToken = async (
      requestAccessTokenRefresh: RequestAccessTokenRefresh,
      doLogout: LogoutRequest,
      statusCodes: Array<number>,
      messageText: string
    ): Promise<Token> => {
      const actualRefreshToken: Token | undefined = await getRefreshToken();
      if (!actualRefreshToken) throw new Error(StringConst.ApiError.emptyRefreshToken);

      try {
        // Refresh and store access token using the supplied refresh function
        const newTokens: Token | AuthTokens = await requestAccessTokenRefresh(actualRefreshToken);
        if (typeof newTokens === 'object' && newTokens?.accessToken) {
          setAuthTokens(newTokens);
          return newTokens.accessToken;
        } else if (typeof newTokens === 'string') {
          setAccessToken(newTokens);
          return newTokens;
        }
      } catch (error: any) {
        // Failed to refresh token
        const status: number | undefined = error.response?.status;
        if ((status !== undefined && statusCodes.includes(status)) || error.body?.message === messageText) {
          // The refresh token is invalid so remove the stored tokens
          await clearAuthTokens();
          doLogout();
          throw new Error(formatString(StringConst.ApiError.failAuthToken, { status: status }));
        }

        if (error instanceof Error) {
          // A different error, probably network error
          throw new Error(formatString(StringConst.ApiError.failRefreshToken, { msg: error.message }));
        } else {
          throw new Error(StringConst.ApiError.failRefreshTokenParse);
        }
      }

      throw new Error(StringConst.ApiError.invalidRequestRefresh);
    };

    /**
     * Gets the current access token, exchanges it with a new one if it's expired and then returns the token.
     * @async
     * @param {RequestAccessTokenRefresh} requestAccessTokenRefresh - Function that is used to get a new access token
     * @returns {Promise<string>} Access token
     */
    export const refreshAccessTokenIfNeeded = async (
      requestAccessTokenRefresh: RequestAccessTokenRefresh,
      doLogout: LogoutRequest,
      statusCodes: Array<number>,
      messageText: string
    ): Promise<Token | undefined> => {
      // use access token (if we have it)
      let accessToken: Token | undefined = await getAccessToken();

      // check if access token is expired
      if (!accessToken || isTokenExpired(accessToken)) {
        // do refresh
        accessToken = await refreshToken(requestAccessTokenRefresh, doLogout, statusCodes, messageText);
      }

      return accessToken;
    };

    /**
     * Function that returns an new instance that:
     * - Applies that right auth header to requests
     * - Refreshes the access token when needed
     * - Puts subsequent requests in a queue and executes them in order after the access token has been refreshed.
     *
     * @param {AccessTokenRefreshConfig} config - Configuration for the refresh access token
     * @returns {Promise<Result} Promise that resolves in the supplied requestConfig
     */
    export const refreshAccessTokenResponse = async <Result>(
      {
        instance,
        type,
        header = DEFAULT_VALUE.header,
        headerPrefix = DEFAULT_VALUE.headerPrefix,
        statusCodes = DEFAULT_VALUE.statusCodes,
        messageText = DEFAULT_VALUE.messageText,
        requestAccessTokenRefresh,
        doLogout
      }: AccessTokenRefreshConfig,
      settings: APISettings & { _retry?: boolean },
      response: Result | undefined,
      error: any | undefined
    ) => {
      // In case of access token expire
      if (
        ((error.response?.status &&
        statusCodes.includes(error.response?.status)) || // Check if the error status is 401
        error.body?.message === messageText) && // Check if the message indicates authentication failure
        !settings._retry // Check if the request has not already been retried
      ) {
        ${isAWSAmplify ? "const isAwsAmplify: boolean = type === 'AwsAmplify';" : ''}
        ${isAxios ? "const isAxios: boolean = type === 'Axios';" : ''}
        ${isFetch ? "const isFetch: boolean = type === 'Fetch';" : ''}
        ${isAWSAmplify ? "const headersPath: string = isAwsAmplify ? 'init.headers' : 'headers';" : "const headersPath: string = 'headers';"}

        /**
         * do Unauthorize/Authorize api call
         * @returns
         */
        const doRequest = (): Promise<Result> => {
          ${getDoRequestTemplate(isAWSAmplify, isAxios, isFetch)}
          return Promise.reject();
        };

        /**
         * Update token in request
         * @param token
         * @returns
         */
        const authenticateRequest = (token: string | undefined): Promise<Result> => {
          if (token) {
            // @ts-expect-error but code working fine
            settings[\`\${headersPath}.\${header}\`] = \`\${headerPrefix}\${token}\`;
          }
          return doRequest();
        };

        // If another request is already in progress to refresh the access token
        if (getIsRefreshing()) {
          // Return a promise that resolves when the token is refreshed
          return new Promise(
            (resolve: (token?: string) => void, reject: (reason?: unknown) => void) => {
              addQueue({ resolve, reject }); // Add the request to the failed request queue
            }
          )
            .then(authenticateRequest)
            .catch((reason) => Promise.reject(reason)); // Handle any errors in the failed request queue
        }

        settings!._retry = true; // Mark the original request as retried

        // Do refresh if needed
        let accessToken: Token | undefined;
        try {
          setIsRefreshing(true); // Set the flag indicating that token refresh is in progress
          accessToken = await refreshAccessTokenIfNeeded(
            requestAccessTokenRefresh,
            doLogout,
            statusCodes,
            messageText
          );
        } catch (err) {
          declineQueue(err as Error);

          if (err instanceof Error) {
            err.message = formatString(StringConst.ApiError.refreshAccessToken, { msg: err.message });
          }

          throw err;
        } finally {
          setIsRefreshing(false);
        }
        resolveQueue(accessToken);

        // add token to headers
        return authenticateRequest(accessToken);
      } else if (response !== undefined) {
        return response;
      } else {
        // If the error does not match the conditions for token expiration, return the error
        return error;
      }
    };

    /**
     * Function that returns an new instance that:
     * - Applies that right auth header to requests
     * - Refreshes the access token when needed
     * - Puts subsequent requests in a queue and executes them in order after the access token has been refreshed.
     *
     * @param {AccessTokenRefreshConfig} config - Configuration for the refresh access token
     * @returns {Promise<Result} Promise that resolves in the supplied requestConfig
     */
    export const applyRefreshAccessToken = (config: AccessTokenRefreshConfig) => {
      return async <Result>(
        isAuthorized: boolean,
        settings: APISettings
      ): Promise<Result> => {
        const {
          instance,
          type,
          header = DEFAULT_VALUE.header,
          headerPrefix = DEFAULT_VALUE.headerPrefix,
          expireFudge = DEFAULT_VALUE.expireFudge,
          statusCodes = DEFAULT_VALUE.statusCodes,
          messageText = DEFAULT_VALUE.messageText,
          requestAccessTokenRefresh,
          doLogout
        } = config;
        setExpireFudgeSeconds(expireFudge);

        ${isAWSAmplify ? "const isAwsAmplify: boolean = type === 'AwsAmplify';" : ''}
        ${isAxios ? "const isAxios: boolean = type === 'Axios';" : ''}
        ${isFetch ? "const isFetch: boolean = type === 'Fetch';" : ''}
        ${isAWSAmplify ? "const headersPath: string = isAwsAmplify ? 'init.headers' : 'headers';" : "const headersPath: string = 'headers';"}

        // use access token (if we have it)
        const requestAccessToken: Token | undefined = get(
          settings,
          \`\${headersPath}.\${header}\`,
          undefined
        );
        let accessToken: Token | undefined =
          requestAccessToken || (isAuthorized ? await getAccessToken() : undefined);
        accessToken = accessToken?.replace(headerPrefix, '');

        // Waiting for a fix in axios types
        // We need refresh token to do any authenticated requests
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const refreshToken: Token | undefined = isAuthorized ? await getRefreshToken() : undefined;

        /**
         * do Unauthorize/Authorize api call
         * @returns
         */
        const doRequest = (): Promise<Result> => {
          ${getDoRequestTemplate(isAWSAmplify, isAxios, isFetch)}
          return Promise.reject();
        };

        //do Unauthorize api call or access token not expired then authorize api call
        if (!isAuthorized || ((isNil(accessToken) || isEmpty(accessToken)) && (isNil(refreshToken) || isEmpty(refreshToken)))) {
          return doRequest();
        } else if (!isNil(accessToken) && !isEmpty(accessToken) && accessToken && !isTokenExpired(accessToken)) {
          return doRequest()
            .then((result) => refreshAccessTokenResponse<Result>(config, settings, result, undefined))
            .catch((reason) => refreshAccessTokenResponse<Result>(config, settings, undefined, reason));
        }

        /**
         * Update token in request
         * @param token
         * @returns
         */
        const authenticateRequest = (token: string | undefined): Promise<Result> => {
          if (token) {
            // @ts-expect-error but code working fine
            settings[\`\${headersPath}.\${header}\`] = \`\${headerPrefix}\${token}\`;
          }
          return doRequest()
            .then((result) => refreshAccessTokenResponse<Result>(config, settings, result, undefined))
            .catch((reason) => refreshAccessTokenResponse<Result>(config, settings, undefined, reason));
        };

        // Queue the request if another refresh request is currently happening
        if (getIsRefreshing()) {
          return new Promise(
            (resolve: (token?: string) => void, reject: (reason?: unknown) => void) => {
              addQueue({ resolve, reject });
            }
          ).then(authenticateRequest);
        }

        // Do refresh if needed
        let newAccessToken: Token | undefined;
        try {
          setIsRefreshing(true);
          newAccessToken = await refreshAccessTokenIfNeeded(
            requestAccessTokenRefresh,
            doLogout,
            statusCodes,
            messageText
          );
        } catch (error: any) {
          declineQueue(error as Error);

          if (error instanceof Error) {
            error.message = formatString(StringConst.ApiError.refreshAccessToken, {
              msg: error.message
            });
          }

          throw error;
        } finally {
          setIsRefreshing(false);
        }
        resolveQueue(newAccessToken);

        // add token to headers
        return authenticateRequest(newAccessToken);
      };
    };
  `;
};
