import { QuestionAnswer, AppConstant } from '../../../../src/index.js';

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
export const AuthSliceTemplate = (): string => {
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

  const { isOnlyAxios, isOnlyAWSAmplify, isOnlyFetch } = getApiFlag(isAxios, isAWSAmplify, isFetch);

  return `
    import {
      createSlice,
      type ActionReducerMapBuilder,
      type Draft,
      type PayloadAction
    } from '@reduxjs/toolkit';
    ${
      isReduxThunk
        ? `
            import {
              type ErrorPayload,
              type SuccessPayload,
              ${isOnlyAxios ? 'axiosApiWithCancelToken,' : ''}
              ${isOnlyAWSAmplify ? 'awsApiWithCancelToken,' : ''}
              ${isOnlyFetch ? 'fetchApiWithCancelToken,' : ''}
              createAsyncThunkWithCancelToken
            } from '../../configs';
            import { APISuffixURLConst${isReduxSaga ? ', ReduxActionSuffixNameConst' : ''}, StoreActionConst${isOnlyAxios ? ', AxiosMethodConst' : ''}${isOnlyAWSAmplify ? ', AwsMethodConst' : ''}${isOnlyFetch ? ', FetchMethodConst' : ''} } from '../../constants';
          `
        : ''
    }
    import { type AuthStateType, INITIAL_STATE, AuthSliceName } from './AuthInitial';
    import type { UserResponse, SignInRequest } from '../../types';
    ${isReduxSaga ? "import type { ErrorPayload, SuccessPayload } from '../../configs';" : ''}

    ${
      isReduxThunk && isOnlyAxios
        ? `
            /**
             * Creates an async thunk action creator that will dispatch actions to the reducer and will sign in the user.
             * @param {string} [typePrefix='auth/signIn'] - The prefix for the thunk type.
             * @param {Method} [method='post'] - Method - the HTTP method to use POST.
             * @param {string} [url='/login'] - The url of the signIn endpoint.
             * @returns {UserResponse} - the response from the server.
             */
            const signInRequest = createAsyncThunkWithCancelToken<SignInRequest, UserResponse>(
              \`\${AuthSliceName}/\${StoreActionConst.signIn}\`,
              (request) => {
                return axiosApiWithCancelToken(AxiosMethodConst.post, APISuffixURLConst.signIn, {
                  isUnauthorized: true,
                  data: request
                  // TODO: You can change content type like below
                  // setting: {
                  //   headers: { 'Content-Type': 'multipart/form-data', Accept: 'multipart/form-data' }
                  // }
                });
              }
            );
          `
        : ''
    }

    ${
      isReduxThunk && isOnlyAWSAmplify
        ? `
            /**
             * Creates an async thunk action creator that will dispatch actions to the reducer and will sign in the user.
             * @param {string} [typePrefix='auth/signIn'] - The prefix for the thunk type.
             * @param {Method} [method='post'] - Method - the HTTP method to use POST.
             * @param {string} [url='/login'] - The url of the signIn endpoint.
             * @returns {UserResponse} - the response from the server.
             */
            const signInRequest = createAsyncThunkWithCancelToken<SignInRequest, UserResponse>(
              \`\${AuthSliceName}/\${StoreActionConst.signIn}\`,
              (request) => {
                return awsApiWithCancelToken(AwsMethodConst.post, 'signIn', APISuffixURLConst.signIn, {
                  isUnauthorized: true,
                  data: request
                  // TODO: You can change content type like below
                  // setting: {
                  //   headers: { 'Content-Type': 'multipart/form-data', Accept: 'multipart/form-data' }
                  // }
                });
              }
            );
          `
        : ''
    }

    ${
      isReduxThunk && isOnlyFetch
        ? `
            /**
             * Creates an async thunk action creator that will dispatch actions to the reducer and will sign in the user.
             * @param {string} [typePrefix='auth/signIn'] - The prefix for the thunk type.
             * @param {Method} [method='post'] - Method - the HTTP method to use POST.
             * @param {string} [url='/login'] - The url of the signIn endpoint.
             * @returns {UserResponse} - the response from the server.
             */
            const signInRequest = createAsyncThunkWithCancelToken<SignInRequest, UserResponse>(
              \`\${AuthSliceName}/\${StoreActionConst.signIn}\`,
              (request) => {
                return fetchApiWithCancelToken(FetchMethodConst.post, APISuffixURLConst.signIn, {
                  isUnauthorized: true,
                  data: request
                  // TODO: You can change content type like below
                  // setting: {
                  //   headers: { 'Content-Type': 'multipart/form-data', Accept: 'multipart/form-data' }
                  // }
                });
              }
            );
          `
        : ''
    }

    /**
     * Creating a auth slice of the redux store
     * @param {AuthStateType} state - The current state of the auth reducer.
     * @param {Action} action - The action to handle.
     * @returns {AuthStateType} The new state of the auth reducer.
     */
    const authSlice = createSlice({
      name: AuthSliceName,
      initialState: INITIAL_STATE,
      reducers: {
        ${
          isReduxSaga
            ? `
                signInRequest: (
                  state: Draft<AuthStateType>,
                  _action: PayloadAction<SignInRequest | null | undefined>
                ) => {
                  state.loading = true;
                },
                signInRequestCancel: () => {},
                signInSuccess: (
                  state: Draft<AuthStateType>,
                  action: PayloadAction<SuccessPayload<SignInRequest, UserResponse> | null | undefined>
                ) => {
                  state.loading = false;
                  state.user = action.payload?.response;
                },
                signInFailure: (
                  state: Draft<AuthStateType>,
                  _action: PayloadAction<ErrorPayload<SignInRequest, UserResponse> | null | undefined>
                ) => {
                  state.loading = false;
                }
              `
            : ''
        }
      },
      /**
      * The extra reducers for the auth slice.
      */
      extraReducers: (${isReduxSaga ? '_' : ''}builder: ActionReducerMapBuilder<AuthStateType>) => {
        ${
          isReduxThunk
            ? `
                builder
                  .addCase(signInRequest.pending, (state: Draft<AuthStateType>) => {
                    state.loading = true;
                  })
                  .addCase(
                    signInRequest.fulfilled,
                    (
                      state: Draft<AuthStateType>,
                      action: PayloadAction<SuccessPayload<SignInRequest, UserResponse> | null | undefined>
                    ) => {
                      state.loading = false;
                      state.user = action.payload?.response;
                    }
                  )
                  .addCase(signInRequest.rejected, 
                    (
                      state: Draft<AuthStateType>,
                      _action: PayloadAction<ErrorPayload<SignInRequest, UserResponse> | null | undefined>
                    ) => {
                      state.loading = false;
                    }
                  );
              `
            : ''
        }
      }     
    });

    /* Exporting the reducer function that will be used in the root reducer. */
    export const AuthReducer = authSlice.reducer;

    /**
     * Creates an object with all of the actions for the auth slice.
     * @returns {Object} - An object with all of the actions for the auth slice.
     */
    export const AuthActions = { ...authSlice.actions${isReduxThunk ? ', signInRequest' : ''} };
  `;
};
