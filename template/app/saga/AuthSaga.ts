import { QuestionAnswer, AppConstant } from '../../../src/index.js';

/**
 *
 */
const getApiFlag = (isAxios: boolean, isAWSAmplify: boolean, isFetch: boolean) => {
  let isOnlyAxios = false;
  let isOnlyAWSAmplify = false;
  let isOnlyFetch = false;

  if (isAxios && isAWSAmplify && isFetch) {
    isOnlyAxios = true;
  } else if (isAxios && isAWSAmplify) {
    isOnlyAxios = true;
  } else if (isAxios && isFetch) {
    isOnlyAxios = true;
  } else if (isAWSAmplify && isFetch) {
    isOnlyAWSAmplify = true;
  } else if (isAxios) {
    isOnlyAxios = true;
  } else if (isAWSAmplify) {
    isOnlyAWSAmplify = true;
  } else if (isFetch) {
    isOnlyFetch = true;
  }
  return { isOnlyAxios, isOnlyAWSAmplify, isOnlyFetch };
};

/**
 *
 */
export const AuthSagaTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const isAxios = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Axios);
  const isAWSAmplify = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.AWSAmplify);
  const isFetch = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Fetch);

  const { isOnlyAxios, isOnlyAWSAmplify, isOnlyFetch } = getApiFlag(isAxios, isAWSAmplify, isFetch);

  return `
    import { call, put, race, take, takeLatest } from 'redux-saga/effects';
    import {
      ${isOnlyAxios ? 'type ApiAxiosResponse,' : ''}
      ${isOnlyAWSAmplify ? 'type ApiAwsResponse,' : ''}
      ${isOnlyFetch ? 'type ApiFetchResponse,' : ''}
      apiCallWithCallback,
      type APIOptionalArgs,
      ${isOnlyAxios ? 'axiosApiWithCancelToken,' : ''}
      ${isOnlyAWSAmplify ? 'awsApiWithCancelToken,' : ''}
      ${isOnlyFetch ? 'fetchApiWithCancelToken,' : ''}
      type APICallEffect,
      type ErrorPayload,
      type SuccessPayload
    } from '../configs';
    import { APISuffixURLConst${isOnlyAxios ? ', AxiosMethodConst' : ''}${isOnlyAWSAmplify ? ', AwsMethodConst' : ''}${isOnlyFetch ? ', FetchMethodConst' : ''} } from '../constants';
    import { AuthActions } from '../redux';
    import type { SignInRequest, UserResponse } from '../types';
    import type { PayloadAction } from '@reduxjs/toolkit';

    // SignIn API Call
    /**
     * A generator function that handles the success case for the sign in request.
     * @param {SuccessPayload<SignInRequest, UserResponse> | null} response - the response from the server.
     * @returns None
     */
    function* signInSuccess(result?: SuccessPayload<SignInRequest, UserResponse> | null) {
      yield put(AuthActions.signInSuccess(result));
    }

    /**
     * A generator function that handles the failure of a sign in attempt.
     * @param {ErrorPayload<SignInRequest, UserResponse> | null} error - the error that occurred during the sign in attempt.
     * @returns None
     */
    function* signInFailure(error?: ErrorPayload<SignInRequest, UserResponse> | null) {
      yield put(AuthActions.signInFailure(error));
    }

    ${
      isOnlyAxios
        ? `
            /**
             * Sign in the user.
             * @param {AuthServiceType} api - The API service to use.
             * @param {PayloadAction<Record<string, any>>} action - The action to perform.
             * @returns None
             */
            function* signIn({ payload }: PayloadAction<SignInRequest>) {
              yield call<
                (
                  api: () => Promise<ApiAxiosResponse<UserResponse, string>>,
                  payload: SignInRequest,
                  onSuccess: (result?: SuccessPayload<SignInRequest, UserResponse> | null) => any,
                  onFailure: (error?: ErrorPayload<SignInRequest, UserResponse> | null) => any,
                  optionalArgs?: APIOptionalArgs<UserResponse>
                ) => Generator<APICallEffect<SignInRequest, UserResponse>, void, any>
              >(
                apiCallWithCallback,
                axiosApiWithCancelToken<UserResponse, string>(AxiosMethodConst.post, APISuffixURLConst.signIn, {
                  isUnauthorized: true,
                  data: payload
                  // TODO: You can change content type like below
                  // setting: {
                  //   headers: { 'Content-Type': 'multipart/form-data', Accept: 'multipart/form-data' }
                  // }
                }),
                payload,
                signInSuccess,
                signInFailure
              );
            }
          `
        : ''
    }

    ${
      isOnlyAWSAmplify
        ? `
            /**
             * Sign in the user.
             * @param {AuthServiceType} api - The API service to use.
             * @param {PayloadAction<Record<string, any>>} action - The action to perform.
             * @returns None
             */
            function* signIn({ payload }: PayloadAction<SignInRequest>) {
              yield call<
                (
                  api: () => Promise<ApiAwsResponse<UserResponse, string>>,
                  payload: SignInRequest,
                  onSuccess: (result?: SuccessPayload<SignInRequest, UserResponse> | null) => any,
                  onFailure: (error?: ErrorPayload<SignInRequest, UserResponse> | null) => any,
                  optionalArgs?: APIOptionalArgs<UserResponse>
                ) => Generator<APICallEffect<SignInRequest, UserResponse>, void, any>
              >(
                apiCallWithCallback,
                awsApiWithCancelToken<UserResponse, string>(AwsMethodConst.post, 'signIn', APISuffixURLConst.signIn, {
                  isUnauthorized: true,
                  data: payload
                  // TODO: You can change content type like below
                  // setting: {
                  //   headers: { 'Content-Type': 'multipart/form-data', Accept: 'multipart/form-data' }
                  // }
                }),
                payload,
                signInSuccess,
                signInFailure
              );
            }
          `
        : ''
    }

    ${
      isOnlyFetch
        ? `
            /**
             * Sign in the user.
             * @param {AuthServiceType} api - The API service to use.
             * @param {PayloadAction<Record<string, any>>} action - The action to perform.
             * @returns None
             */
            function* signIn({ payload }: PayloadAction<SignInRequest>) {
              yield call<
                (
                  api: () => Promise<ApiFetchResponse<UserResponse, string>>,
                  payload: SignInRequest,
                  onSuccess: (result?: SuccessPayload<SignInRequest, UserResponse> | null) => any,
                  onFailure: (error?: ErrorPayload<SignInRequest, UserResponse> | null) => any,
                  optionalArgs?: APIOptionalArgs<UserResponse>
                ) => Generator<APICallEffect<SignInRequest, UserResponse>, void, any>
              >(
                apiCallWithCallback,
                fetchApiWithCancelToken<UserResponse, string>(FetchMethodConst.post, APISuffixURLConst.signIn, {
                  isUnauthorized: true,
                  data: payload
                  // TODO: You can change content type like below
                  // setting: {
                  //   headers: { 'Content-Type': 'multipart/form-data', Accept: 'multipart/form-data' }
                  // }
                }),
                payload,
                signInSuccess,
                signInFailure
              );
            }
          `
        : ''
    }

    /**
     * A generator function that watches for a sign in request and either calls the sign in function, or cancels the request.
     * @param {PayloadAction<SignInRequest>} action - The action that triggered the generator.
     * @returns None
     */
    function* watchSignIn(action: PayloadAction<SignInRequest>) {
      yield race([call(signIn, action), take(AuthActions.signInRequestCancel.toString())]);
    }

    export default [takeLatest(AuthActions.signInRequest.toString(), watchSignIn)];
  `;
};
