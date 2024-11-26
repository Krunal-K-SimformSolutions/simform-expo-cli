import { QuestionAnswer, AppConstant } from '../../../../src/index.js';

/**
 *
 */
const getCatchErrorTemplate = (isAxios: boolean, isAWSAmplify: boolean): string => {
  if ((isAWSAmplify && isAxios) || isAWSAmplify) {
    return `
      if (isCancel(error) || API.isCancel(error)) {
        // @ts-expect-error but code working fine
        return error?.message || StringConst.ApiError.cancelSaga;
      } else if (isAxiosError(error)) {
        return error?.message || '';
      }
      // @ts-expect-error but code working fine
      return error?.message || StringConst.ApiError.unexpected;
    `;
  } else if (isAxios) {
    return `
      if (isCancel(error)) {
        return error?.message || StringConst.ApiError.cancelSaga;
      } else if (isAxiosError(error)) {
        return error?.message || '';
      }
      // @ts-expect-error but code working fine
      return error?.message || StringConst.ApiError.unexpected;
    `;
  } else {
    return `
      // @ts-expect-error but code working fine
      return error?.message || StringConst.ApiError.unexpected;
    `;
  }
};

/**
 *
 */
export const CommonAPIConfigTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const isReduxThunk = variables.isSupportStateManagementMiddleware(
    AppConstant.StateManagementMiddleware.ReduxThunk
  );
  const isReduxSaga = variables.isSupportStateManagementMiddleware(
    AppConstant.StateManagementMiddleware.ReduxSaga
  );

  const isAxios = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Axios);
  const isAWSAmplify = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.AWSAmplify);

  return `
    ${isReduxThunk ? "import { createAsyncThunk } from '@reduxjs/toolkit';" : ''}
    ${isAWSAmplify ? "import { API } from 'aws-amplify';" : ''}
    ${isAxios || isAWSAmplify ? "import { isAxiosError, isCancel } from 'axios';" : ''}
    import { indexOf, isEmpty, isEqual } from 'lodash';
    ${isReduxSaga ? "import { call, put, cancelled } from 'redux-saga/effects';" : ''}
    import { ToastHolder } from '../../components';
    import {
      CANCEL_ERROR,
      CLIENT_ERROR,
      CONNECTION_ERROR,
      NETWORK_ERROR,
      SERVER_ERROR,
      TIMEOUT_ERROR,
      OptionalArgsConst,
      StringConst${isReduxSaga ? ',\nReduxActionSuffixNameConst' : ''}
    } from '../../constants';
    import { ToastType } from '../../types';
    import { NetworkThread } from '../../utils';
    ${isAWSAmplify ? "import type { ApiAwsResponse } from './aws';" : ''}
    ${isAxios ? "import type { ApiAxiosResponse } from './axios';" : ''}
    import type {
      ${isReduxThunk ? 'ThunkAPIOptionalArgs,' : ''}
      ErrorPayload,
      SuccessPayload,
      ${
        isReduxThunk
          ? `
              AsyncThunkConfig,
              GetThunkAPI,
              AsyncThunk
            `
          : ''
      }
      ${
        isReduxSaga
          ? `
              APIOptionalArgs,
              APICallEffect,
              APIReturn
            `
          : ''
      }
    } from './CommonTypes';

    /**
     * Handles the error response from the API.
     * @param { ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null } response - the error response from the API.
     * @returns {string} - the error response to be displayed.
     */
    export const getFailureMessageFromResponse = <Response = any>(
      response?: ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null
    ) => {
      // TODO: if required then based on api response change your error message passing
      return (
        // @ts-expect-error but code working fine
        response?.data?.msgs?.[0]?.long_desc ||
        // @ts-expect-error but code working fine
        response?.data?.msgs?.[0]?.short_desc ||
        // @ts-expect-error but code working fine
        response?.data?.message ||
        // @ts-expect-error but code working fine
        response?.message ||
        response?.originalError?.message ||
        ''
      );
    };

    /**
     * Handles the error response from the API.
     * @param { ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null } response - the error response from the API.
     * @param {string} defaultMessage - the default message to display if the response does not
     * contain a message.
     * @returns {string} - the error response to be displayed.
     */
    export const handleClientError = <Response = any>(
      response?: ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null,
      defaultMessage?: string | null
    ): string => {
      return getFailureMessageFromResponse(response) || defaultMessage || '';
    };

    /**
     * Handles the error response from the API.
     * @param { ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null } response - the error response from the API.
     * @param {string} defaultMessage - the default message to display if the error response is
     * not handled.
     * @returns {string} - the error response to display.
     */
    export const handleResponseError = <Response = any>(
      response?:  ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null
    ): string => {
      switch (response?.problem) {
        case CLIENT_ERROR:
          return handleClientError<Response>(response, StringConst.ApiError.client);
        case SERVER_ERROR:
          return handleClientError<Response>(response, StringConst.ApiError.server);
        case TIMEOUT_ERROR:
          return handleClientError<Response>(response, StringConst.ApiError.timeout);
        case CONNECTION_ERROR:
          return handleClientError<Response>(response, StringConst.ApiError.connection);
        case NETWORK_ERROR:
          return handleClientError<Response>(response, StringConst.ApiError.network);
        case CANCEL_ERROR:
          return handleClientError<Response>(response, StringConst.ApiError.cancel);
        default:
          return handleClientError<Response>(response, StringConst.ApiError.somethingWentWrong);
      }
    };

    /**
     * Handles errors that occur when making API calls.
     * @param {unknown} error - unknown - This is the error that is thrown by the API.
     * @returns {string} - the error response to display.
     */
    export const handleCatchError = (error?: unknown | null): string => {
      ${getCatchErrorTemplate(isAxios, isAWSAmplify)}
    };

    ${
      isReduxSaga
        ? `
            /**
             * A generator function that takes in a redux action name, a payload, and an optional callback. It then
             * dispatches a redux action with the payload and the action name. If the callback is provided, it will
             * yield the callback with the payload. Otherwise, it will return the payload.
             * @param {APIOptionalArgs} optionalArgs - {
             *  @property {String} reduxActionName - The name of the redux action to execute when the API call succeeds or failure. default is ''.
             *  @property {Array<number>} successStatus - The status code of the success api call if you want to customize otherwise default is [200].
             *  @property {boolean} isShowFailureToast - The show failure toast message if you api got failure. default is true.
             *  @property {string} customFailureMessage - The api failure message to display if you want to customize otherwise default is ''.
             *  @property {(apiResult?: ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null, error?: unknown | null) => string} parseFailureMessage - The api failure message parsing and return it as string, default is undefined.
             *  @property {string} toastShowParams - The custom toast show params if you want to customize otherwise default is {
             *    @param {ToastType} type - The toast type variant to display
             *    @param {string} message - string - The message to display
             *    @param {string} title - string - The title to display
             *    @param {number} [interval] - The time in milliseconds that the toast will be displayed.
             *  }
             * }
             * @param {SuccessPayload<Request, Response>} payload - The success payload.
             * @param {(SuccessPayload<Request, Response> | null)} onSuccess - The function to call when the API call succeeds.
             * @returns {Generator<any, SuccessPayload<Request, Response> | undefined, any>}
             * The return API call with succeeds response.
             */
            export function* successEvent<Request = any, Response = any>(
              optionalArgs?: APIOptionalArgs<Response> | null,
              payload?: SuccessPayload<Request, Response> | null,
              onSuccess?: ((result?: SuccessPayload<Request, Response> | null) => any) | null
            ): Generator<any, SuccessPayload<Request, Response> | undefined | null, any> {
              const { reduxActionName = '' } = optionalArgs ?? {};
              if (reduxActionName && !isEmpty(reduxActionName)) {
                yield put({
                  type: \`\${reduxActionName}\${ReduxActionSuffixNameConst.success}\`,
                  payload: payload
                });
              }
              if (onSuccess) {
                yield call(onSuccess, payload);
              } else {
                return payload;
              }
            }

            /**
             * A generator function that takes in a redux action name, a payload, and an optional callback. It then
             * dispatches a redux action with the payload and the action name. If the callback is provided, it will
             * yield the callback with the payload. Otherwise, it will return the payload.
             * @param {APIOptionalArgs} optionalArgs - {
             *  @property {String} reduxActionName - The name of the redux action to execute when the API call succeeds or failure. default is ''.
             *  @property {Array<number>} successStatus - The status code of the success api call if you want to customize otherwise default is [200].
             *  @property {boolean} isShowFailureToast - The show failure toast message if you api got failure. default is true.
             *  @property {string} customFailureMessage - The api failure message to display if you want to customize otherwise default is ''.
             *  @property {(apiResult?: ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null, error?: unknown | null) => string} parseFailureMessage - The api failure message parsing and return it as string, default is undefined.
             *  @property {string} toastShowParams - The custom toast show params if you want to customize otherwise default is {
             *    @param {ToastType} type - The toast type variant to display
             *    @param {string} message - string - The message to display
             *    @param {string} title - string - The title to display
             *    @param {number} [interval] - The time in milliseconds that the toast will be displayed.
             *  }
             * }
             * @param {ErrorPayload<Request, Response>} payload - The failure payload.
             * @param {(ErrorPayload<Request, Response> | null) => any} onFailure - The function to call when the API call fails.
             * @returns {Generator<any, ErrorPayload<Request, Response> | undefined, any>}
             * The return API call with fails response.
             */
            export function* failEvent<Request = any, Response = any>(
              optionalArgs?: APIOptionalArgs<Response> | null,
              payload?: ErrorPayload<Request, Response> | null,
              onFailure?: ((error?: ErrorPayload<Request, Response> | null) => any) | null
            ): Generator<any, ErrorPayload<Request, Response> | undefined | null, any> {
              const {
                reduxActionName = '',
                isShowFailureToast = true,
                customFailureMessage = '',
                toastShowParams
              } = optionalArgs ?? {};
              const finalError: string | null | undefined = customFailureMessage || payload?.error;
              const isToastNotShow: boolean =
                isEqual(finalError, StringConst.ApiError.cancel) ||
                isEqual(finalError, StringConst.ApiError.cancelSaga);

              if (isShowFailureToast && !isEmpty(finalError) && !isToastNotShow) {
                ToastHolder.toastMessage({
                  type: toastShowParams?.type ?? ToastType.fail,
                  message: toastShowParams?.message ?? finalError ?? '',
                  title: toastShowParams?.title,
                  interval: toastShowParams?.interval
                });
              }
              if (reduxActionName && !isEmpty(reduxActionName)) {
                yield put({
                  type: \`\${reduxActionName}\${ReduxActionSuffixNameConst.failure}\`,
                  payload: { ...payload, error: finalError }
                });
              }
              if (onFailure) {
                yield call(onFailure, { ...payload, error: finalError });
              } else {
                return { ...payload, error: finalError };
              }
            }

            /**
             * A generator function that takes in a redux action name, a payload, and an optional callback. It then
             * dispatches a redux action with the payload and the action name. If the callback is provided, it will
             * yield the callback with the payload. Otherwise, it will return the payload.
             * @param {Request} request - The request payload to send to the API.
             * @param { ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null } response - The API response.
             * @param {unknown} catchError - The catch error when call API.
             * @param {APIOptionalArgs} optionalArgs - {
             *  @property {String} reduxActionName - The name of the redux action to execute when the API call succeeds or failure. default is ''.
             *  @property {Array<number>} successStatus - The status code of the success api call if you want to customize otherwise default is [200].
             *  @property {boolean} isShowFailureToast - The show failure toast message if you api got failure. default is true.
             *  @property {string} customFailureMessage - The api failure message to display if you want to customize otherwise default is ''.
             *  @property {(apiResult?: ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null, error?: unknown | null) => string} parseFailureMessage - The api failure message parsing and return it as string, default is undefined.
             *  @property {string} toastShowParams - The custom toast show params if you want to customize otherwise default is {
             *    @param {ToastType} type - The toast type variant to display
             *    @param {string} message - string - The message to display
             *    @param {string} title - string - The title to display
             *    @param {number} [interval] - The time in milliseconds that the toast will be displayed.
             *  }
             * }
             * @param {(error?: ErrorPayload<Request, Response> | null) => any} onFailure - The function to call when the API call fails.
             * @returns {Generator<any, ErrorPayload<Request, Response> | undefined, any>}
             * The return API call with fails response.
             */
            export function* parseError<Request = any, Response = any>(
              request?: Request | null,
              response?: ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null,
              catchError?: unknown | null,
              optionalArgs?: APIOptionalArgs<Response> | null,
              onFailure?: ((error?: ErrorPayload<Request, Response> | null) => any) | null
            ): Generator<any, ErrorPayload<Request, Response> | undefined | null, any> {
              const { parseFailureMessage } = optionalArgs ?? {};
              const error: string =
                parseFailureMessage?.(response, catchError) ||
                (catchError ? handleCatchError(catchError) : handleResponseError<Response>(response));
              if (onFailure) {
                yield call<
                  (
                    optionalArgs?: APIOptionalArgs<Response> | null,
                    payload?: ErrorPayload<Request, Response> | null,
                    onFailure?: ((error?: ErrorPayload<Request, Response> | null) => any) | null
                  ) => Generator<any, ErrorPayload<Request, Response> | undefined | null, any>
                >(
                  failEvent,
                  optionalArgs,
                  { error, request, fullResult: { result: response, catch: catchError } },
                  onFailure
                );
              } else {
                return yield call<
                  (
                    optionalArgs?: APIOptionalArgs<Response> | null,
                    payload?: ErrorPayload<Request, Response> | null,
                    onFailure?: ((error?: ErrorPayload<Request, Response> | null) => any) | null
                  ) => Generator<any, ErrorPayload<Request, Response> | undefined | null, any>
                >(failEvent, optionalArgs, {
                  error,
                  request,
                  fullResult: { result: response, catch: catchError }
                });
              }
            }

            /**
             * A generator function that calls the given API and handles the response.
             * @param {(...args: any[]) => any} api - The API to call.
             * @param {Request} request - The request payload to send to the API.
             * @param {(response?: Response | null, request?: Request | null, fullResult?: FullResult<Response> | null) => any} onSuccess - The function to call when the API call succeeds.
             * @param {(error?: string | null, request?: Request | null, fullResult?: FullResult<Response> | null) => any} onFailure - The function to call when the API call fails.
             * @param {APIOptionalArgs} optionalArgs - {
             *  @property {String} reduxActionName - The name of the redux action to execute when the API call succeeds or failure. default is ''.
             *  @property {Array<number>} successStatus - The status code of the success api call if you want to customize otherwise default is [200].
             *  @property {boolean} isShowFailureToast - The show failure toast message if you api got failure. default is true.
             *  @property {string} customFailureMessage - The api failure message to display if you want to customize otherwise default is ''.
             *  @property {(apiResult?: ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null, error?: unknown | null) => string} parseFailureMessage - The api failure message parsing and return it as string, default is undefined.
             *  @property {string} toastShowParams - The custom toast show params if you want to customize otherwise default is {
             *    @param {ToastType} type - The toast type variant to display
             *    @param {string} message - string - The message to display
             *    @param {string} title - string - The title to display
             *    @param {number} [interval] - The time in milliseconds that the toast will be displayed.
             *  }
             * }
             * @returns {Generator<APICallEffect<Request, Response>, APIReturn<Request, Response>, any>}
             * The return API call with succeeds or fails response.
             */
            export function* apiCallWithCallback<Request = any, Response = any>(
              api: (...args: any[]) => any,
              request: Request,
              onSuccess: (result?: SuccessPayload<Request, Response> | null) => any,
              onFailure: (error?: ErrorPayload<Request, Response> | null) => any,
              optionalArgs: APIOptionalArgs<Response> = OptionalArgsConst
            ): Generator<APICallEffect<Request, Response>, void, any> {
              const { successStatus = [200] } = optionalArgs;
              let apiResult: ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null | undefined = null;
              try {
                if (!NetworkThread.instance.connected) {
                  const error: string = StringConst.ApiError.network;
                  yield call<
                    (
                      optionalArgs?: APIOptionalArgs<Response> | null,
                      payload?: ErrorPayload<Request, Response> | null,
                      onFailure?: ((error?: ErrorPayload<Request, Response> | null) => any) | null
                    ) => Generator<any, ErrorPayload<Request, Response> | undefined | null, any>
                  >(
                    failEvent,
                    optionalArgs,
                    { error, request, fullResult: { result: apiResult, catch: new Error(error) } },
                    onFailure
                  );
                } else {
                  apiResult = yield call(api);
                  if (apiResult?.ok) {
                    if (indexOf(successStatus, apiResult.status) > -1) {
                      const response: Response | undefined = apiResult.data;
                      yield call<
                        (
                          optionalArgs?: APIOptionalArgs<Response> | null,
                          payload?: SuccessPayload<Request, Response> | null,
                          onSuccess?: ((result?: SuccessPayload<Request, Response> | null) => any) | null
                        ) => Generator<any, SuccessPayload<Request, Response> | undefined | null, any>
                      >(
                        successEvent,
                        optionalArgs,
                        { response, request, fullResult: { result: apiResult, catch: null } },
                        onSuccess
                      );
                    } else {
                      yield call<
                        (
                          request?: Request | null,
                          response?: ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null,
                          catchError?: unknown | null,
                          optionalArgs?: APIOptionalArgs<Response> | null,
                          onFailure?: ((error?: ErrorPayload<Request, Response> | null) => any) | null
                        ) => Generator<any, ErrorPayload<Request, Response> | undefined | null, any>
                      >(parseError, request, apiResult, null, optionalArgs, onFailure);
                    }
                  } else {
                    yield call<
                      (
                        request?: Request | null,
                        response?: ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null,
                        catchError?: unknown | null,
                        optionalArgs?: APIOptionalArgs<Response> | null,
                        onFailure?: ((error?: ErrorPayload<Request, Response> | null) => any) | null
                      ) => Generator<any, ErrorPayload<Request, Response> | undefined | null, any>
                    >(parseError, request, apiResult, null, optionalArgs, onFailure);
                  }
                }
              } catch (e: unknown) {
                yield call<
                  (
                    request?: Request | null,
                    response?: ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null,
                    catchError?: unknown | null,
                    optionalArgs?: APIOptionalArgs<Response> | null,
                    onFailure?: ((error?: ErrorPayload<Request, Response> | null) => any) | null
                  ) => Generator<any, ErrorPayload<Request, Response> | undefined | null, any>
                >(parseError, request, apiResult, e, optionalArgs, onFailure);
              } finally {
                const error: string = StringConst.ApiError.cancelSaga;
                if (yield cancelled()) {
                  yield call<
                    (
                      optionalArgs?: APIOptionalArgs<Response> | null,
                      payload?: ErrorPayload<Request, Response> | null,
                      onFailure?: ((error?: ErrorPayload<Request, Response> | null) => any) | null
                    ) => Generator<any, ErrorPayload<Request, Response> | undefined | null, any>
                  >(
                    failEvent,
                    optionalArgs,
                    { error, request, fullResult: { result: apiResult, catch: new Error(error) } },
                    onFailure
                  );
                }
              }
            }

            /**
             * A generator function that calls the given api with the given payload and returns the response.
             * @param {(...args: any[]) => any} api - The API to call.
             * @param {Request} request - The request payload to send to the API.
             * @param {APIOptionalArgs} optionalArgs - {
             *  @property {String} reduxActionName - The name of the redux action to execute when the API call succeeds or failure. default is ''.
             *  @property {Array<number>} successStatus - The status code of the success api call if you want to customize otherwise default is [200].
             *  @property {boolean} isShowFailureToast - The show failure toast message if you api got failure. default is true.
             *  @property {string} customFailureMessage - The api failure message to display if you want to customize otherwise default is ''.
             *  @property {(apiResult?: ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null, error?: unknown | null) => string} parseFailureMessage - The api failure message parsing and return it as string, default is undefined.
             *  @property {string} toastShowParams - The custom toast show params if you want to customize otherwise default is {
             *    @param {ToastType} type - The toast type variant to display
             *    @param {string} message - string - The message to display
             *    @param {string} title - string - The title to display
             *    @param {number} [interval] - The time in milliseconds that the toast will be displayed.
             *  }
             * }
             * @returns {Generator<APICallEffect<Request, Response>, APIReturn<Request, Response>, any>}
             * The return API call with succeeds or fails response.
             */
            export function* apiCallWithReturn<Request = any, Response = any>(
              api: (...args: any[]) => any,
              request: Request,
              optionalArgs: APIOptionalArgs<Response> = OptionalArgsConst
            ): Generator<APICallEffect<Request, Response>, APIReturn<Request, Response>, any> {
              const { successStatus = [200] } = optionalArgs;
              let apiResult: ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null | undefined = null;
              try {
                if (!NetworkThread.instance.connected) {
                  const error: string = StringConst.ApiError.network;
                  return yield call<
                    (
                      optionalArgs?: APIOptionalArgs<Response> | null,
                      payload?: ErrorPayload<Request, Response> | null,
                      onFailure?: ((error?: ErrorPayload<Request, Response> | null) => any) | null
                    ) => Generator<any, ErrorPayload<Request, Response> | undefined | null, any>
                  >(failEvent, optionalArgs, {
                    error,
                    request,
                    fullResult: { result: apiResult, catch: new Error(error) }
                  });
                }
                apiResult = yield call(api);
                if (apiResult?.ok) {
                  if (indexOf(successStatus, apiResult.status) > -1) {
                    const response: Response | undefined = apiResult.data;
                    return yield call<
                      (
                        optionalArgs?: APIOptionalArgs<Response> | null,
                        payload?: SuccessPayload<Request, Response> | null,
                        onSuccess?: ((result?: SuccessPayload<Request, Response> | null) => any) | null
                      ) => Generator<any, SuccessPayload<Request, Response> | undefined | null, any>
                    >(successEvent, optionalArgs, {
                      response,
                      request,
                      fullResult: { result: apiResult, catch: null }
                    });
                  } else {
                    return yield call<
                      (
                        request?: Request | null,
                        response?: ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null,
                        catchError?: unknown | null,
                        optionalArgs?: APIOptionalArgs<Response> | null,
                        onFailure?: ((error?: ErrorPayload<Request, Response> | null) => any) | null
                      ) => Generator<any, ErrorPayload<Request, Response> | undefined | null, any>
                    >(parseError, request, apiResult, null, optionalArgs);
                  }
                } else {
                  return yield call<
                    (
                      request?: Request | null,
                      response?: ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null,
                      catchError?: unknown | null,
                      optionalArgs?: APIOptionalArgs<Response> | null,
                      onFailure?: ((error?: ErrorPayload<Request, Response> | null) => any) | null
                    ) => Generator<any, ErrorPayload<Request, Response> | undefined | null, any>
                  >(parseError, request, apiResult, null, optionalArgs);
                }
              } catch (e: unknown) {
                return yield call<
                  (
                    request?: Request | null,
                    response?: ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null,
                    catchError?: unknown | null,
                    optionalArgs?: APIOptionalArgs<Response> | null,
                    onFailure?: ((error?: ErrorPayload<Request, Response> | null) => any) | null
                  ) => Generator<any, ErrorPayload<Request, Response> | undefined | null, any>
                >(parseError, request, apiResult, e, optionalArgs);
              } finally {
                if (yield cancelled()) {
                  const error: string = StringConst.ApiError.cancelSaga;
                  // eslint-disable-next-line no-unsafe-finally
                  return yield call<
                    (
                      optionalArgs?: APIOptionalArgs<Response> | null,
                      payload?: ErrorPayload<Request, Response> | null,
                      onFailure?: ((error?: ErrorPayload<Request, Response> | null) => any) | null
                    ) => Generator<any, ErrorPayload<Request, Response> | undefined | null, any>
                  >(failEvent, optionalArgs, {
                    error,
                    request,
                    fullResult: { result: apiResult, catch: new Error(error) }
                  });
                }
              }
            }
          `
        : ''
    }

    ${
      isReduxThunk
        ? `
            /**
             * it will return the payload.
             * @param {Request} request - The request payload to send to the API.
             * @param { ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null } response - The API response.
             * @param {unknown} catchError - The catch error when call API.
             * @param {ThunkAPIOptionalArgs} optionalArgs - {
             *  @property {Array<number>} successStatus - The status code of the success api call if you want to customize otherwise default is [200].
             *  @property {boolean} isShowFailureToast - The show failure toast message if you api got failure. default is true.
             *  @property {string} customFailureMessage - The api failure message to display if you want to customize otherwise default is ''.
             *  @property {(apiResult?: ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null, error?: unknown | null) => string} parseFailureMessage - The api failure message parsing and return it as string, default is undefined.
             *  @property {string} toastShowParams - The custom toast show params if you want to customize otherwise default is {
             *    @param {ToastType} type - The toast type variant to display
             *    @param {string} message - string - The message to display
             *    @param {string} title - string - The title to display
             *    @param {number} [interval] - The time in milliseconds that the toast will be displayed.
             *  }
             * }
             * @returns ErrorPayload<Request, Response> | undefined
             * The return API call with fails response.
             */
            export function parseError<Request = any, Response = any>(
              request?: Request | null,
              response?: ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null,
              catchError?: unknown | null,
              optionalArgs?: ThunkAPIOptionalArgs<Response> | null
            ): ErrorPayload<Request, Response> | undefined | null {
              const {
                parseFailureMessage,
                isShowFailureToast = true,
                customFailureMessage = '',
                toastShowParams
              } = optionalArgs ?? {};
              const error: string =
                parseFailureMessage?.(response, catchError) ||
                (catchError ? handleCatchError(catchError) : handleResponseError<Response>(response));
              const finalError: string | null | undefined = customFailureMessage || error;
              const isToastNotShow: boolean =
                isEqual(finalError, StringConst.ApiError.cancel) ||
                isEqual(finalError, StringConst.ApiError.cancelSaga);

              if (isShowFailureToast && !isEmpty(finalError) && !isToastNotShow) {
                ToastHolder.toastMessage({
                  type: toastShowParams?.type ?? ToastType.fail,
                  message: toastShowParams?.message ?? finalError ?? '',
                  title: toastShowParams?.title,
                  interval: toastShowParams?.interval
                });
              }
              return { error: finalError, request, fullResult: { result: response, catch: catchError } };
            }

            /**
             * It creates an async thunk that uses a cancel token to cancel the request if the user navigates away
             * from the page
             * @param {string} typePrefix - The prefix for the thunk type.
             * @param {(
             *   request: Request,
             *   thunkApi: GetThunkAPI<AsyncThunkConfig<Request, Response>>
             * ) => (...args: any[]) => any} api - The API to call.
             * @param {ThunkAPIOptionalArgs} optionalArgs - {
             *  @property {Array<number>} successStatus - The status code of the success api call if you want to customize otherwise default is [200].
             *  @property {boolean} isShowFailureToast - The show failure toast message if you api got failure. default is true.
             *  @property {string} customFailureMessage - The api failure message to display if you want to customize otherwise default is ''.
             *  @property {(apiResult?: ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null, error?: unknown | null) => string} parseFailureMessage - The api failure message parsing and return it as string, default is undefined.
             *  @property {string} toastShowParams - The custom toast show params if you want to customize otherwise default is {
             *    @param {ToastType} type - The toast type variant to display
             *    @param {string} message - string - The message to display
             *    @param {string} title - string - The title to display
             *    @param {number} [interval] - The time in milliseconds that the toast will be displayed.
             *  }
             * }
             * @returns {AsyncThunk<Response, undefined, ThunkApiConfig<Request, Response>>} - The async thunk action state.
             */
            export function createAsyncThunkWithCancelToken<Request = any, Response = any>(
              typePrefix: string,
              api: (
                request: Request,
                thunkApi: GetThunkAPI<AsyncThunkConfig<Request, Response>>
              ) => (...args: any[]) => any,
              optionalArgs: ThunkAPIOptionalArgs<Response> = OptionalArgsConst
            ): AsyncThunk<
              SuccessPayload<Request, Response> | null | undefined,
              Request,
              AsyncThunkConfig<Request, Response>
            > {
              return createAsyncThunk<
                SuccessPayload<Request, Response> | null | undefined,
                Request,
                AsyncThunkConfig<Request, Response>
              >(typePrefix, async (request, thunkApi) => {
                const { successStatus = [200] } = optionalArgs;
                let apiResult: ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null | undefined = null;

                try {
                  if (!NetworkThread.instance.connected) {
                    return thunkApi.rejectWithValue(
                      parseError<Request, Response>(
                        request,
                        null,
                        new Error(StringConst.ApiError.network),
                        optionalArgs
                      )
                    );
                  }
                  apiResult = await api(request, thunkApi)(thunkApi.signal);
                  if (apiResult?.ok) {
                    if (indexOf(successStatus, apiResult.status) > -1) {
                      const response: Response | undefined = apiResult.data;
                      return { response, request, fullResult: { result: apiResult, catch: null } };
                    } else {
                      return thunkApi.rejectWithValue(
                        parseError<Request, Response>(request, apiResult, null, optionalArgs)
                      );
                    }
                  } else {
                    return thunkApi.rejectWithValue(
                      parseError<Request, Response>(request, apiResult, null, optionalArgs)
                    );
                  }
                } catch (e: unknown) {
                  return thunkApi.rejectWithValue(
                    parseError<Request, Response>(request, apiResult, e, optionalArgs)
                  );
                }
              });
            }
          `
        : ''
    }
  `;
};
