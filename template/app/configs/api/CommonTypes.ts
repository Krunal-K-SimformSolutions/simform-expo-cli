import { QuestionAnswer, AppConstant } from '../../../../src/index.js';

/**
 *
 */
const getInstantTypeTemplate = (
  isAWSAmplify: boolean,
  isAxios: boolean,
  isFetch: boolean
): string => {
  const list: Array<string> = [];
  if (isAWSAmplify) {
    list.push('APIClass');
  }
  if (isAxios) {
    list.push('AxiosStatic');
  }
  if (isFetch) {
    list.push('((input: RequestInfo, init?: RequestInit) => Promise<Response>)');
  }

  if (list.length > 0) {
    return `export type InstanceType = ${list.join(' | ')};`;
  } else {
    return '';
  }
};

/**
 *
 */
const getAPITypeTemplate = (isAWSAmplify: boolean, isAxios: boolean, isFetch: boolean): string => {
  const list: Array<string> = [];
  if (isAWSAmplify) {
    list.push("'AwsAmplify'");
  }
  if (isAxios) {
    list.push("'Axios'");
  }
  if (isFetch) {
    list.push("'Fetch'");
  }

  if (list.length > 0) {
    return `export type APIType = ${list.join(' | ')};`;
  } else {
    return '';
  }
};

/**
 *
 */
const getAPISettingsTemplate = (
  isAWSAmplify: boolean,
  isAxios: boolean,
  isFetch: boolean
): string => {
  const list: Array<string> = [];
  if (isAWSAmplify) {
    list.push('AwsAmplifySettings');
  }
  if (isAxios) {
    list.push('AxiosSettings');
  }
  if (isFetch) {
    list.push('FetchSettings');
  }

  if (list.length > 0) {
    return `export type APISettings = ${list.join(' | ')};`;
  } else {
    return '';
  }
};

/**
 *
 */
export const CommonTypesTemplate = (): string => {
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
    ${
      isAWSAmplify
        ? `
            import { APIClass } from 'aws-amplify';
            import type { ApiAwsResponse } from './aws';
          `
        : ''
    }
    ${isAxios ? "import type { ApiAxiosResponse } from './axios';" : ''}
    import type { ToastType } from '../../types';
    ${isAxios ? "import type { AxiosRequestConfig, AxiosStatic } from 'axios';" : ''}
    ${
      isReduxThunk
        ? `
            import type { AppDispatchType, RootStateType } from '../../redux';
            import type { SafePromise } from '@reduxjs/toolkit';
            import type { Dispatch, UnknownAction } from 'redux';
          `
        : ''
    }
    ${isReduxSaga ? "import type { CallEffect, CancelledEffect, PutEffect } from 'redux-saga/effects';" : ''}
    ${isReduxThunk ? "import type { ThunkDispatch } from 'redux-thunk';" : ''}
    import type { AuthTokens, Token } from '../../utils';

    /**
     * What's the problem for this axios response?
     */
    export type PROBLEM_CODE =
      | null
      | 'CLIENT_ERROR'
      | 'SERVER_ERROR'
      | 'TIMEOUT_ERROR'
      | 'CONNECTION_ERROR'
      | 'NETWORK_ERROR'
      | 'UNKNOWN_ERROR'
      | 'CANCEL_ERROR';

    type ToastShowParams = Partial<{
      type: ToastType;
      message: string;
      title: string;
      interval: number;
    }>;

    /**
     * @property {String} reduxActionName - The name of the redux action to execute when the API call succeeds or failure. default is ''.
     * @property {Array<number>} successStatus - The status code of the success api call if you want to customize otherwise default is [200].
     * @property {boolean} isShowFailureToast - The show failure toast message if you api got failure. default is true.
     * @property {string} customFailureMessage - The api failure message to display if you want to customize otherwise default is ''.
     * @property {(apiResult?:${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null, error?: unknown | null) => string} parseFailureMessage - The api failure message parsing and return it as string, default is undefined.
     * @property {string} toastShowParams - The custom toast show params if you want to customize otherwise default is {
     *    @param {ToastType} type - The toast type variant to display
     *    @param {string} message - string - The message to display
     *    @param {string} title - string - The title to display
     *    @param {number} [interval] - The time in milliseconds that the toast will be displayed.
     * }
     */
    export type APIOptionalArgs<Response = any> = {
      reduxActionName: string;
      successStatus: Array<number>;
      isShowFailureToast: boolean;
      customFailureMessage: string;
      parseFailureMessage?: (
        apiResult?: ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null,
        error?: unknown | null
      ) => string;
      toastShowParams: ToastShowParams;
    };

    ${
      isReduxThunk
        ? `
            /**
             * @property {Array<number>} successStatus - The status code of the success api call if you want to customize otherwise default is [200].
             * @property {boolean} isShowFailureToast - The show failure toast message if you api got failure. default is true.
             * @property {string} customFailureMessage - The api failure message to display if you want to customize otherwise default is ''.
             * @property {(apiResult?:${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null, error?: unknown | null) => string} parseFailureMessage - The api failure message parsing and return it as string, default is undefined.
             * @property {string} toastShowParams - The custom toast show params if you want to customize otherwise default is {
             *    @param {ToastType} type - The toast type variant to display
             *    @param {string} message - string - The message to display
             *    @param {string} title - string - The title to display
             *    @param {number} [interval] - The time in milliseconds that the toast will be displayed.
             * }
             */
            export type ThunkAPIOptionalArgs<Response = any> = Omit<
              APIOptionalArgs<Response>,
              'reduxActionName'
            >;
          `
        : ''
    }

    export type FullResult<Response = any> = {
      result?: ${isAWSAmplify ? 'ApiAwsResponse<Response> |' : ''}${isAxios ? 'ApiAxiosResponse<Response> |' : ''} null;
      catch?: unknown | null;
    };

    export type SuccessPayload<Request = any, Response = any> = {
      response?: Response | null;
      request?: Request | null;
      fullResult?: FullResult<Response> | null;
    };

    export type ErrorPayload<Request = any, Response = any> = {
      error?: string | null;
      request?: Request | null;
      fullResult?: FullResult<Response> | null;
    };

    export type APIReturn<Request = any, Response = any> =
      | SuccessPayload<Request, Response>
      | ErrorPayload<Request, Response>;

    ${
      isReduxThunk
        ? `
            export type AsyncThunkConfig<Request = any, Response = any> = {
              state?: RootStateType;
              dispatch?: AppDispatchType;
              extra?: unknown;
              rejectValue: ErrorPayload<Request, Response> | null | undefined;
              serializedErrorType?: unknown;
              pendingMeta?: unknown;
              fulfilledMeta?: unknown;
              rejectedMeta?: unknown;
            };

            /**
             *
             */
            declare class RejectWithValue<Payload, RejectedMeta> {
              readonly payload: Payload;
              readonly meta: RejectedMeta;
              //private readonly _type;
              constructor(payload: Payload, meta: RejectedMeta);
            }

            /**
             *
             */
            declare class FulfillWithMeta<Payload, FulfilledMeta> {
              readonly payload: Payload;
              readonly meta: FulfilledMeta;
              //private readonly _type;
              constructor(payload: Payload, meta: FulfilledMeta);
            }

            export type IsAny<T, True, False = never> = true | false extends (T extends never ? true : false)
              ? True
              : False;

            export type IsUnknown<T, True, False = never> = unknown extends T ? IsAny<T, False, True> : False;

            export type FallbackIfUnknown<T, Fallback> = IsUnknown<T, Fallback, T>;

            export type BaseThunkAPI<
              S,
              E,
              D extends Dispatch = Dispatch,
              RejectedValue = ErrorPayload<Request, Response> | null,
              RejectedMeta = unknown,
              FulfilledMeta = unknown
            > = {
              dispatch: D;
              getState: () => S;
              extra: E;
              requestId: string;
              signal: AbortSignal;
              abort: (reason?: string) => void;
              rejectWithValue: IsUnknown<
                RejectedMeta,
                (value: RejectedValue) => RejectWithValue<RejectedValue, RejectedMeta>,
                (value: RejectedValue, meta: RejectedMeta) => RejectWithValue<RejectedValue, RejectedMeta>
              >;
              fulfillWithValue: IsUnknown<
                FulfilledMeta,
                <FulfilledValue>(value: FulfilledValue) => FulfilledValue,
                <FulfilledValue>(
                  value: FulfilledValue,
                  meta: FulfilledMeta
                ) => FulfillWithMeta<FulfilledValue, FulfilledMeta>
              >;
            };

            type GetState<ThunkApiConfig> = ThunkApiConfig extends {
              state: infer State;
            }
              ? State
              : unknown;
            type GetExtra<ThunkApiConfig> = ThunkApiConfig extends {
              extra: infer Extra;
            }
              ? Extra
              : unknown;
            type GetDispatch<ThunkApiConfig> = ThunkApiConfig extends {
              // eslint-disable-next-line @typescript-eslint/no-shadow
              dispatch: infer Dispatch;
            }
              ? FallbackIfUnknown<
                  Dispatch,
                  ThunkDispatch<GetState<ThunkApiConfig>, GetExtra<ThunkApiConfig>, UnknownAction>
                >
              : ThunkDispatch<GetState<ThunkApiConfig>, GetExtra<ThunkApiConfig>, UnknownAction>;

            type GetRejectValue<ThunkApiConfig> = ThunkApiConfig extends {
              rejectValue: infer RejectValue;
            }
              ? RejectValue
              : unknown;

            type GetFulfilledMeta<ThunkApiConfig> = ThunkApiConfig extends {
              fulfilledMeta: infer FulfilledMeta;
            }
              ? FulfilledMeta
              : unknown;

            type GetRejectedMeta<ThunkApiConfig> = ThunkApiConfig extends {
              rejectedMeta: infer RejectedMeta;
            }
              ? RejectedMeta
              : unknown;

            export type GetThunkAPI<ThunkApiConfig> = BaseThunkAPI<
              GetState<ThunkApiConfig>,
              GetExtra<ThunkApiConfig>,
              GetDispatch<ThunkApiConfig>,
              GetRejectValue<ThunkApiConfig>,
              GetRejectedMeta<ThunkApiConfig>,
              GetFulfilledMeta<ThunkApiConfig>
            >;

            /**
             * An action with a string type and an associated payload. This is the
             * type of action returned by \`createAction()\` action creators.
             *
             * @template P The type of the action's payload.
             * @template T the type used for the action type.
             * @template M The type of the action's meta (optional)
             * @template E The type of the action's error (optional)
             *
             * @public
             */
            export type PayloadAction<P = void, T extends string = string, M = never, E = never> = {
              payload: P;
              type: T;
            } & ([M] extends [never]
              ? // eslint-disable-next-line @typescript-eslint/no-empty-object-type
                {}
              : {
                  meta: M;
                }) &
              ([E] extends [never]
                ? // eslint-disable-next-line @typescript-eslint/no-empty-object-type
                  {}
                : {
                    error: E;
                  });

            /**
             * Basic type for all action creators.
             *
             * @inheritdoc {redux#ActionCreator}
             */
            export type BaseActionCreator<P, T extends string, M = never, E = never> = {
              type: T;
              match: (action: unknown) => action is PayloadAction<P, T, M, E>;
            };

            export type ActionCreatorWithPreparedPayload<
              Args extends unknown[],
              P,
              T extends string = string,
              E = never,
              M = never
            > = {
              /**
               * Calling this {@link redux#ActionCreator} with \`Args\` will return
               * an Action with a payload of type \`P\` and (depending on the \`PrepareAction\`
               * method used) a \`meta\`- and \`error\` property of types \`M\` and \`E\` respectively.
               */
              (...args: Args): PayloadAction<P, T, M, E>;
            } & BaseActionCreator<P, T, M, E>;

            export type SerializedError = {
              name?: string;
              message?: string;
              stack?: string;
              code?: string;
            };

            type GetSerializedErrorType<ThunkApiConfig> = ThunkApiConfig extends {
              // eslint-disable-next-line @typescript-eslint/no-shadow
              serializedErrorType: infer GetSerializedErrorType;
            }
              ? GetSerializedErrorType
              : SerializedError;

            export type AsyncThunkRejectedActionCreator<
              ThunkArg,
              // eslint-disable-next-line @typescript-eslint/no-empty-object-type
              ThunkApiConfig = {}
            > = ActionCreatorWithPreparedPayload<
              [
                Error | null,
                string,
                ThunkArg,
                GetRejectValue<ThunkApiConfig>?,
                GetRejectedMeta<ThunkApiConfig>?
              ],
              GetRejectValue<ThunkApiConfig> | undefined,
              string,
              GetSerializedErrorType<ThunkApiConfig>,
              {
                arg: ThunkArg;
                requestId: string;
                requestStatus: 'rejected';
                aborted: boolean;
                condition: boolean;
              } & (
                | ({
                    rejectedWithValue: false;
                  } & {
                    [K in keyof GetRejectedMeta<ThunkApiConfig>]?: undefined;
                  })
                | ({
                    rejectedWithValue: true;
                  } & GetRejectedMeta<ThunkApiConfig>)
              )
            >;

            export type AsyncThunkFulfilledActionCreator<
              Returned,
              ThunkArg,
              // eslint-disable-next-line @typescript-eslint/no-empty-object-type
              ThunkApiConfig = {}
            > = ActionCreatorWithPreparedPayload<
              [Returned, string, ThunkArg, GetFulfilledMeta<ThunkApiConfig>?],
              Returned,
              string,
              never,
              {
                arg: ThunkArg;
                requestId: string;
                requestStatus: 'fulfilled';
              } & GetFulfilledMeta<ThunkApiConfig>
            >;

            /**
             * A ThunkAction created by \`createAsyncThunk\`.
             * Dispatching it returns a Promise for either a
             * fulfilled or rejected action.
             * Also, the returned value contains an \`abort()\` method
             * that allows the asyncAction to be cancelled from the outside.
             *
             * @public
             */
            export type AsyncThunkAction<Returned, ThunkArg, ThunkApiConfig extends AsyncThunkConfig> = (
              dispatch: GetDispatch<ThunkApiConfig>,
              getState: () => GetState<ThunkApiConfig>,
              extra: GetExtra<ThunkApiConfig>
            ) => SafePromise<
              | ReturnType<AsyncThunkFulfilledActionCreator<Returned, ThunkArg>>
              | ReturnType<AsyncThunkRejectedActionCreator<ThunkArg, ThunkApiConfig>>
            > & {
              abort: (reason?: string) => void;
              requestId: string;
              arg: ThunkArg;
              unwrap: () => Promise<Returned>;
            };

            type WithStrictNullChecks<True, False> = undefined extends boolean ? False : True;

            type AsyncThunkActionCreator<Returned, ThunkArg, ThunkApiConfig extends AsyncThunkConfig> = IsAny<
              ThunkArg,
              (arg: ThunkArg) => AsyncThunkAction<Returned, ThunkArg, ThunkApiConfig>,
              unknown extends ThunkArg
                ? (arg: ThunkArg) => AsyncThunkAction<Returned, ThunkArg, ThunkApiConfig>
                : [ThunkArg] extends [void] | [undefined]
                  ? () => AsyncThunkAction<Returned, ThunkArg, ThunkApiConfig>
                  : [void] extends [ThunkArg]
                    ? (arg?: ThunkArg) => AsyncThunkAction<Returned, ThunkArg, ThunkApiConfig>
                    : [undefined] extends [ThunkArg]
                      ? WithStrictNullChecks<
                          (arg?: ThunkArg) => AsyncThunkAction<Returned, ThunkArg, ThunkApiConfig>,
                          (arg: ThunkArg) => AsyncThunkAction<Returned, ThunkArg, ThunkApiConfig>
                        >
                      : (arg: ThunkArg) => AsyncThunkAction<Returned, ThunkArg, ThunkApiConfig>
            >;

            type GetPendingMeta<ThunkApiConfig> = ThunkApiConfig extends {
              pendingMeta: infer PendingMeta;
            }
              ? PendingMeta
              : unknown;

            export type AsyncThunkPendingActionCreator<
              ThunkArg,
              // eslint-disable-next-line @typescript-eslint/no-empty-object-type
              ThunkApiConfig = {}
            > = ActionCreatorWithPreparedPayload<
              [string, ThunkArg, GetPendingMeta<ThunkApiConfig>?],
              undefined,
              string,
              never,
              {
                arg: ThunkArg;
                requestId: string;
                requestStatus: 'pending';
              } & GetPendingMeta<ThunkApiConfig>
            >;

            export type AsyncThunk<
              Returned,
              ThunkArg,
              ThunkApiConfig extends AsyncThunkConfig
            > = AsyncThunkActionCreator<Returned, ThunkArg, ThunkApiConfig> & {
              pending: AsyncThunkPendingActionCreator<ThunkArg, ThunkApiConfig>;
              rejected: AsyncThunkRejectedActionCreator<ThunkArg, ThunkApiConfig>;
              fulfilled: AsyncThunkFulfilledActionCreator<Returned, ThunkArg, ThunkApiConfig>;
              settled: (
                action: any
              ) => action is ReturnType<
                | AsyncThunkRejectedActionCreator<ThunkArg, ThunkApiConfig>
                | AsyncThunkFulfilledActionCreator<Returned, ThunkArg, ThunkApiConfig>
              >;
              typePrefix: string;
            };

            export type APIDispatch<Request = any, Response = any> = SafePromise<
              | ReturnType<AsyncThunkFulfilledActionCreator<SuccessPayload<Request, Response>, Request>>
              | ReturnType<AsyncThunkRejectedActionCreator<Request, AsyncThunkConfig<Request, Response>>>
            > & {
              abort: (reason?: string) => void;
              requestId: string;
              arg: Request;
              unwrap: () => Promise<SuccessPayload<Request, Response>>;
            };
          `
        : ''
    }

    ${
      isReduxSaga
        ? `
          export type APICallEffect<Request = any, Response = any> =
            | CallEffect<unknown>
            | CancelledEffect
            | PutEffect<{
                type: string;
                payload: SuccessPayload<Request, Response>;
              }>
            | PutEffect<{
                type: string;
                payload: ErrorPayload<Request, Response>;
              }>;
          `
        : ''
    }

    export type RequestQueue = {
      resolve: (token?: string) => void;
      reject: (reason?: unknown) => void;
    };
    export type RequestsQueue = RequestQueue[];

    export type RequestAccessTokenRefresh = (refreshToken: Token) => Promise<Token | AuthTokens>;

    export type LogoutRequest = () => void;

    ${getInstantTypeTemplate(isAWSAmplify, isAxios, isFetch)}

    ${getAPITypeTemplate(isAWSAmplify, isAxios, isFetch)}

    export type AccessTokenRefreshConfig = {
      instance: InstanceType;
      type: APIType;
      header?: string;
      headerPrefix?: string;
      requestAccessTokenRefresh: RequestAccessTokenRefresh;
      expireFudge?: number;
      doLogout: LogoutRequest;
      statusCodes?: Array<number>;
      messageText?: string;
    };

    ${isFetch ? 'export type FetchSettings = RequestInit & { url: RequestInfo };' : ''}
    ${isAxios ? 'export type AxiosSettings = AxiosRequestConfig<any>;' : ''}
    ${
      isAWSAmplify
        ? `
            export type AwsAmplifySettings = {
              apiName: string;
              path: string;
              method: string;
              init: {
                [key: string]: any;
              };
            };
          `
        : ''
    }
    
    ${getAPISettingsTemplate(isAWSAmplify, isAxios, isFetch)}
  `;
};
