import { QuestionAnswer, AppConstant } from '../../../src/index.js';

export const AuthSagaTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const isAxios = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Axios);
  const isAWSAmplify = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.AWSAmplify);
  const isFetch = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Fetch);

  return `
    import { call, put, race, take, takeLatest } from 'redux-saga/effects';
    import {
      ${isAxios ? `type ApiAxiosResponse,` : ''}
      ${isAWSAmplify ? `type ApiAwsResponse,` : ''}
      ${isFetch ? `type ApiFetchResponse,` : ''}
      apiCallWithCallback,
      type APIOptionalArgs,
      ${isAxios ? `axiosApiWithCancelToken,` : ''}
      ${isAWSAmplify ? `awsApiWithCancelToken,` : ''}
      ${isFetch ? `fetchApiWithCancelToken,` : ''}
      type APICallEffect,
      type ErrorPayload,
      type SuccessPayload
    } from '../configs';
    import { APISuffixURLConst${isAxios ? `, AxiosMethodConst` : ''}${isAWSAmplify ? `, AwsMethodConst` : ''}${isFetch ? `, FetchMethodConst` : ''} } from '../constants';
    import { SignInRequest, UserResponse } from '../types';
    import { AuthActions } from '../redux';
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
      isAxios
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
      isAWSAmplify
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
      isFetch
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
