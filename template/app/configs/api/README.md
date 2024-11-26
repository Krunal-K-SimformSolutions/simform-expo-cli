# Centralized API Layer

First discuss existing API layer. As of now we all are implement different different api service method with redundant code. also we all are face root saga cause issue because of any one can miss to add safety rule(try & catch) in their api service method.

So resolved this kind of issue in feature development that why create new API layer with type safety(Typescript).

Create common api layer for everyone to easy access, minimum afford and well stable. In this layer we have cover AWS-Amplify & Axios for api call with redux saga.

# API Reference

### 1. awsApiConfig

- Used for set custom config in AWS Amplify
  ```js
  /**
   * @param {any} config - The amplify config json.
   * @returns {{}} - The empty object
   */
  awsApiConfig(<Config>);
  ```

### 2. awsApiWithCancelToken

- Makes a request to the API using AWS Amplify with the given config.
- A function that takes in an object with an method, apiName, path, isUnauthorized, params, data, paths, and setting property. It also takes in a source parameter.
  ```js
  /**
   * @property {AwsMethod} method - The HTTP method to use.
   * @property {string} apiName - The api name which you want to call from config object.
   * @property {string} path - The url of the endpoint you're trying to hit.
   * @property {boolean} isUnauthorized - if you call unauthorized api at that time pass true.
   * @property {Record<string, any>} data - The data to be sent to the server.
   * @property {Record<string, any>} params - The query parameters to be sent with the request.
   * @property {Record<string, any>} paths - The path query parameters to be set with the url.
   * @property { Record<string, any>} setting - The config parameters to be set when api call.
   * @returns {Promise<ApiResponse<T, U>>} - the response from the API
   */
  awsApiWithCancelToken(AwsMethodConst.post, 'login', 'api/login', {
    data: payload
  })();
  ```

### 3. axiosApiWithCancelToken

- Makes a request to the API using Axios with the given config.
- A function that takes in an object with an api, method, path, isUnauthorized, params, data, paths, and setting property. It also takes in a source parameter.

  ```js
  /**
   * @property {AxiosMethod} method - The HTTP method to use.
   * @property {string} path - The url of the endpoint you're trying to hit.
   * @property {boolean} isUnauthorized - if you call unauthorized api at that time pass true.
   * @property {Record<string, any>} data - The data to be sent to the server.
   * @property {Record<string, any>} params - The query parameters to be sent with the request.
   * @property {AxiosRequestConfig<any>} setting - This is an object that contains the following properties:
   * @property {Record<string, any>} paths - The path query parameters to be set with the url.
   * @returns {Promise<ApiResponse<Response>>} - the response from the API
   */
  axiosApiWithCancelToken(AxiosMethodConst.post, 'api/login', {
    data: payload
  })();
  ```

### 4. fetchApiWithCancelToken

- Makes a request to the API using Fetch with the given config.
- A function that takes in an object with an api, method, path, isUnauthorized, params, data, paths, and setting property. It also takes in a source parameter.

  ```js
  /**
   * @property {FetchMethod} method - The HTTP method to use.
   * @property {string} path - The url of the endpoint you're trying to hit.
   * @property {boolean} isUnauthorized - if you call unauthorized api at that time pass true.
   * @property {BodyInit_} data - The data to be sent to the server.
   * @property {BodyInit_} params - The query parameters to be sent with the request.
   * @property {Omit<RequestInit, 'body' | 'method' | 'signal'>} setting - This is an object that contains the following properties:
   * @property {Record<string, any>} paths - The path query parameters to be set with the url.
   * @returns {Promise<ApiResponse<Response>>} - the response from the API
   */
  fetchApiWithCancelToken(FetchMethodConst.post, 'api/login', {
    data: payload
  })();
  ```

### 5. createAsyncThunkWithCancelToken

- A async thunk function that calls the given API and handles the response.

  ```js
  /**
   * @param {string} typePrefix - The prefix for the thunk type.
   * @param {(
   *   request: Request,
   *   thunkApi: GetThunkAPI<AsyncThunkConfig<Request, Response>>
   * ) => (...args: any[]) => any} api - The API to call.
   * @param {ThunkAPIOptionalArgs} optionalArgs - {
   *  @property {Array<number>} successStatus - The status code of the success api call if you want to customize otherwise default is [200].
   *  @property {boolean} isShowFailureToast - The show failure toast message if you api got failure. default is true.
   *  @property {string} customFailureMessage - The api failure message to display if you want to customize otherwise default is ''.
   *  @property {(apiResult?:{% if 'AWS Amplify' in api_middleware %} ApiAwsResponse<Response> |{% endif %}{% if 'Axios' in api_middleware %} ApiAxiosResponse<Response> |{% endif %} null, error?: unknown | null) => string} parseFailureMessage - The api failure message parsing and return it as string, default is undefined.
   *  @property {string} toastShowParams - The custom toast show params if you want to customize otherwise default is {
   *    @param {ToastType} type - The toast type variant to display
   *    @param {string} message - string - The message to display
   *    @param {string} title - string - The title to display
   *    @param {number} [interval] - The time in milliseconds that the toast will be displayed.
   *  }
   * }
   * @returns {AsyncThunk<Response, undefined, ThunkApiConfig<Request, Response>>} - The async thunk action state.
   */
  const signInRequest = createAsyncThunkWithCancelToken('signIn', (request) => {
    return awsApiWithCancelToken(AwsMethodConst.post, 'signIn', 'api/signIn', {
      isUnauthorized: true,
      data: request
      // TODO: You can change content type like below
      // setting: {
      //   headers: { 'Content-Type': 'multipart/form-data', Accept: 'multipart/form-data' }
      // }
    });
  });
  ```

### 6. apiCallWithCallback

- A generator function that calls the given API and handles the response.

  ```js
  /**
   * @param {(...args: any[]) => any} api - The API to call.
   * @param {Request} request - The request payload to send to the API.
   * @param {(response?: Response | null, request?: Request | null) => any} onSuccess - The function to call when the API call succeeds.
   * @param {(error?: string | null, request?: Request | null) => any} onFailure - The function to call when the API call fails.
   * @param {APIOptionalArgs} optionalArgs - {
   *  @property {String} reduxActionName - The name of the redux action to execute when the API call succeeds or failure. default is ''.
   *  @property {Array<number>} successStatus - The status code of the success api call if you want to customize otherwise default is [200].
   *  @property {boolean} isShowFailureToast - The show failure toast message if you api got failure. default is true.
   *  @property {string} customFailureMessage - The api failure message to display if you want to customize otherwise default is ''.
   *  @property {(apiResult?: ApiResponse<Response> | null, error?: unknown | null) => string} parseFailureMessage - The api failure message parsing and return it as string, default is undefined.
   *  @property {string} toastShowParams - The custom toast show params if you want to customize otherwise default is {
   *    type: ToastType.error,
   *    message: undefined,
   *    title: undefined,
   *    image: undefined,
   *    imageTint: undefined,
   *    interval: 2000
   *  }
   * }
   * @returns {Generator<APICallEffect<Request, Response>, APIReturn<Request, Response>, any>}
   * The return API call with succeeds or fails response.
   */
  yield call(
      apiCallWithCallback,
      awsApiWithCancelToken(AwsMethodConst.post, 'login', 'api/login', {
          data: payload
      }),
      payload,
      () => {},
      () => {}
  );
  ```

### 7. apiCallWithReturn

- A generator function that calls the given api with the given payload and returns the response.

  ```js
  /**
   * @param {(...args: any[]) => any} api - The API to call.
   * @param {Request} request - The request payload to send to the API.
   * @param {APIOptionalArgs} optionalArgs - {
   *  @property {String} reduxActionName - The name of the redux action to execute when the API call succeeds or failure. default is ''.
   *  @property {Array<number>} successStatus - The status code of the success api call if you want to customize otherwise default is [200].
   *  @property {boolean} isShowFailureToast - The show failure toast message if you api got failure. default is true.
   *  @property {string} customFailureMessage - The api failure message to display if you want to customize otherwise default is ''.
   *  @property {(apiResult?: ApiResponse<Response> | null, error?: unknown | null) => string} parseFailureMessage - The api failure message parsing and return it as string, default is undefined.
   *  @property {string} toastShowParams - The custom toast show params if you want to customize otherwise default is {
   *    type: ToastType.error,
   *    message: undefined,
   *    title: undefined,
   *    image: undefined,
   *    imageTint: undefined,
   *    interval: 2000
   *  }
   * }
   * @returns {Generator<APICallEffect<Request, Response>, APIReturn<Request, Response>, any>}
   * The return API call with succeeds or fails response.
   */
  const response = yield call(
      apiCallWithReturn,
      awsApiWithCancelToken(AwsMethodConst.post, 'login', 'api/login', {
          data: payload
      }),
      payload
  );
  ```

### 8. parseError

- A generator function that call when we throw error before a api call.

  ```js
  /**
   * @param {Request} request - The request payload to send to the API.
   * @param {ApiResponse<Response>} response - The API response.
   * @param {unknown} catchError - The catch error when call API.
   * @param {APIOptionalArgs} optionalArgs - {
   *  @property {String} reduxActionName - The name of the redux action to execute when the API call succeeds or failure. default is ''.
   *  @property {Array<number>} successStatus - The status code of the success api call if you want to customize otherwise default is [200].
   *  @property {boolean} isShowFailureToast - The show failure toast message if you api got failure. default is true.
   *  @property {string} customFailureMessage - The api failure message to display if you want to customize otherwise default is ''.
   *  @property {(apiResult?: ApiResponse<Response> | null, error?: unknown | null) => string} parseFailureMessage - The api failure message parsing and return it as string, default is undefined.
   *  @property {string} toastShowParams - The custom toast show params if you want to customize otherwise default is {
   *    type: ToastType.error,
   *    message: undefined,
   *    title: undefined,
   *    image: undefined,
   *    imageTint: undefined,
   *    interval: 2000
   *  }
   * }
   * @param {(error?: string | null, request?: Request | null) => any} onFailure - The function to call when the API call fails.
   * @returns {Generator<any, ErrorPayload<Request> | undefined, any>}
   * The return API call with succeeds or fails response.
   */
  if(deviceId == null || deviceId == "null") {
      yield call(
          parseError,
          payload,
          null,
          new Error(I18n.t("Errors.something_went_wrong")),
          {},
          onFailure
      )
  } else {
      const response = yield call(
          apiCallWithReturn,
          awsApiWithCancelToken(AwsMethodConst.post, 'login', 'api/login', {
              data: payload
          }),
          payload
      );
   }
  ```

# Example

Here provided a list of example

1. [Api without middleware](#case-1---api-without-middleware)

2. [Simple api integration](#case-2---simple-api-integration)

3. [Post api with body](#case-3---post-api-with-body)

4. [Get api with query params](#case-4---get-api-with-query-params)

5. [Api with path query](#case-5---api-with-path-query)

6. [Api with extra setting](#case-6---api-with-extra-setting)

7. [Api with custom status code for successful](#case-7---api-with-custom-status-code-for-successful)

8. [Api with custom failure message](#case-8---api-with-custom-failure-message)

9. [Api with custom toast](#case-9---api-with-custom-toast)

10. [Api with disable failure toast](#case-10---api-with-disable-failure-toast)

11. [Api with saga callback](#case-11---api-with-saga-callback)

12. [Api with screen level callback without update redux state](#case-12---api-with-screen-level-callback-without-update-redux-state)

13. [Api with toolkit](#case-13---api-with-toolkit)

14. [Multiple api](#case-14---multiple-api)

15. [Api with spawn effect](#case-15---api-with-spawn-effect)

16. [Api with unauthorized call](#case-16---api-with-unauthorized-call)

17. [Api with parse failure message](#case-17---api-with-parse-failure-message)

18. [Api with axios config](#case-18---api-with-axios-config)

19. [Api with fetch config](#case-19---api-with-fetch-config)

## Case 1 - Api without middleware

Here provided a user detail api example for how to call api without middleware

**Request URL:** https://example.com/api/user_detail

**Request Method:** GET

**Request Payload:** NA

**Status Code:** 200

```js
async function userDetail({ payload }) {
  try {
    const response = await awsApiWithCancelToken(AwsMethodConst.get, 'user', 'api/user_detail')();
    // TODO: Do you business logic
  } catch (error) {
    // TODO: Do you business logic
  }
}
```

### Case 2 - Simple api integration

Here provided a user detail api example for how to call api with saga

**Request URL:** https://example.com/api/user_detail

**Request Method:** GET

**Request Payload:** NA

**Status Code:** 200

- **Step 1:** Create user detail reducer action type (UserDetailActionType.js)
  ```js
  export const USER_DETAIL = 'userDetail';
  ```
- **Step 2:** Create user detail reducer action (UserDetailAction.js)
  ```js
  export const userDetailRequest = () => ({
    type: USER_DETAIL
  });
  export const userDetailSuccess = (payload) => ({
    type: `${USER_DETAIL}${ReduxActionSuffixNameConst.success}`,
    payload
  });
  export const userDetailFailure = (payload) => ({
    type: `${USER_DETAIL}${ReduxActionSuffixNameConst.failure}`,
    payload
  });
  export const userDetailRequestCancel = () => ({
    type: `${USER_DETAIL}${ReduxActionSuffixNameConst.cancel}`
  });
  ```
- **Step 3:** Create user detail reducer using React-Redux (UserDetailReducer.js)

  ```js
  const INITIAL_STATE = {
    loading: false,
    response: undefined,
    error: undefined
  };

  export const UserDetailReducer = (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
      case USER_DETAIL:
        return { ...state, loading: true };
      case `${USER_DETAIL}${ReduxActionSuffixNameConst.success}`:
        return { ...state, loading: false, response: payload };
      case `${USER_DETAIL}${ReduxActionSuffixNameConst.failure}`:
        return { ...state, loading: false, error: payload };
      case `${USER_DETAIL}${ReduxActionSuffixNameConst.cancel}`:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  ```

- **Step 4:** Create user detail saga effect (UserDetailSaga.js)

  ```js
  function* userDetail({ payload }) {
    const response = yield call(
      apiCallWithReturn,
      awsApiWithCancelToken(AwsMethodConst.get, 'user', 'api/user_detail'),
      payload
    );
    if (has(response, 'response')) {
      yield put(userDetailSuccess(response.response));
    } else {
      yield put(userDetailFailure(response.error));
    }
  }

  function* watchUserDetail(action) {
    yield race([
      call(userDetail, action),
      take(`${USER_DETAIL}${ReduxActionSuffixNameConst.cancel}`)
    ]);
  }

  export default [takeLatest(USER_DETAIL, watchUserDetail)];
  ```

- **Step 5:** Create root saga (index.js)
  ```js
  export default function* rootSaga() {
    yield all([...UserDetailSaga]);
  }
  ```
- **Step 6:** Create redux store (Store.js)

  ```js
  const sagaMiddleware = createSagaMiddleware();

  const persistConfig = {
    key: 'Pentair',
    version: 1,
    storage: reduxStorage,
    whitelist: ['userDetailReducer'], // Whitelist (Save Specific Reducers)
    blacklist: [] // Blacklist (Don't Save Specific Reducers)
  };

  const rootReducer = combineReducers({
    userDetailReducer: UserDetailReducer
  });

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  export default { store, persistor };
  ```

- **Step 7:** How to dispatch user detail and cancel request in user detail screen (UserDetailScreen.js)

  ```js
  class Screen extends Component {
    componentDidMount() {
      const { userDetailRequest } = this.props;
      userDetailRequest?.();
    }

    componentWillUnmount() {
      const { userDetailRequestCancel } = this.props;
      userDetailRequestCancel?.();
    }
  }
  const mapStatesToProps = ({ userDetailReducer }) => ({
    response: userDetailReducer?.response || {},
    error: userDetailReducer?.error || {}
  });

  const mapDispatchToProps = (dispatch) => ({
    userDetailRequest: (payload) => dispatch(userDetailRequest(payload)),
    userDetailRequestCancel: () => dispatch(userDetailRequestCancel()),
    dispatch
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

### Case 3 - Post api with body

Here provided a sign in api example for how to call api with saga

**Request URL:** https://example.com/api/signIn

**Request Method:** POST

**Request Payload:** { email: "xyz@pentair.com", password: "Pentair@123" }

**Status Code:** 200

- **Step 1:** Create sign in reducer action type (SignInActionType.js)
  ```js
  export const SIGN_IN = 'signIn';
  ```
- **Step 2:** Create sign in reducer action (SignInAction.js)
  ```js
  export const signInRequest = () => ({
    type: SIGN_IN
  });
  export const signInRequestCancel = () => ({
    type: `${SIGN_IN}${ReduxActionSuffixNameConst.cancel}`
  });
  ```
- **Step 3:** Create sign in reducer using React-Redux (SignInReducer.js)

  ```js
  const INITIAL_STATE = {
    loading: false,
    response: undefined,
    error: undefined
  };

  export const SignInReducer = (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
      case SIGN_IN:
        return { ...state, loading: true };
      case `${SIGN_IN}${ReduxActionSuffixNameConst.success}`:
        return { ...state, loading: false, response: payload.response };
      case `${SIGN_IN}${ReduxActionSuffixNameConst.failure}`:
        return { ...state, loading: false, error: payload.error };
      case `${SIGN_IN}${ReduxActionSuffixNameConst.cancel}`:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  ```

- **Step 4:** Create sign in saga effect (SignInSaga.js)

  ```js
  function* signIn({ payload }) {
    yield call(
      apiCallWithReturn,
      awsApiWithCancelToken(AwsMethodConst.post, 'signIn', 'api/signIn', {
        data: payload
      }),
      payload,
      { reduxActionName: SIGN_IN }
    );
  }

  function* watchSignIn(action) {
    yield race([call(signIn, action), take(`${SIGN_IN}${ReduxActionSuffixNameConst.cancel}`)]);
  }

  export default [takeLatest(SIGN_IN, watchSignIn)];
  ```

- **Step 5:** Create root saga (index.js)
  ```js
  export default function* rootSaga() {
    yield all([...SignInSaga]);
  }
  ```
- **Step 6:** Create redux store (Store.js)

  ```js
  const sagaMiddleware = createSagaMiddleware();

  const persistConfig = {
    key: 'Pentair',
    version: 1,
    storage: reduxStorage,
    whitelist: ['signInReducer'], // Whitelist (Save Specific Reducers)
    blacklist: [] // Blacklist (Don't Save Specific Reducers)
  };

  const rootReducer = combineReducers({
    signInReducer: SignInReducer
  });

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  export default { store, persistor };
  ```

- **Step 7:** How to dispatch sign in and cancel request in sign-in screen (SignInScreen.js)

  ```js
  class Screen extends Component {
    handleSignIn() {
      const { signInRequest } = this.props;
      signInRequest?.({
        email: 'xyz@pentair.com',
        password: 'Pentair@123'
      });
    }

    componentWillUnmount() {
      const { signInRequestCancel } = this.props;
      signInRequestCancel?.();
    }
  }
  const mapStatesToProps = ({ signInReducer }) => ({
    response: signInReducer?.response || {},
    error: signInReducer?.error || {}
  });

  const mapDispatchToProps = (dispatch) => ({
    signInRequest: (payload) => dispatch(signInRequest(payload)),
    signInRequestCancel: () => dispatch(signInRequestCancel()),
    dispatch
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

## Case 4 - Get api with query params

Here provided a product overview api example for how to call api with saga

**Request URL:** https://example.com/api/product_overview?productId=ABC345787sgdfgsdf7qwe

**Request Method:** GET

**Request Payload:** { productId: "ABC345787sgdfgsdf7qwe" }

**Status Code:** 200

- **Step 1:** Create product overview reducer action type (ProductOverviewActionType.js)
  ```js
  export const PRODUCT_OVERVIEW = 'productOverview';
  ```
- **Step 2:** Create product overview reducer action (ProductOverviewAction.js)
  ```js
  export const productOverviewRequest = () => ({
    type: PRODUCT_OVERVIEW
  });
  export const productOverviewRequestCancel = () => ({
    type: `${PRODUCT_OVERVIEW}${ReduxActionSuffixNameConst.cancel}`
  });
  ```
- **Step 3:** Create product reducer using React-Redux (ProductOverviewReducer.js)

  ```js
  const INITIAL_STATE = {
    loading: false,
    response: undefined,
    error: undefined
  };

  export const ProductOverviewReducer = (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
      case PRODUCT_OVERVIEW:
        return { ...state, loading: true };
      case `${PRODUCT_OVERVIEW}${ReduxActionSuffixNameConst.success}`:
        return { ...state, loading: false, response: payload.response };
      case `${PRODUCT_OVERVIEW}${ReduxActionSuffixNameConst.failure}`:
        return { ...state, loading: false, error: payload.error };
      case `${PRODUCT_OVERVIEW}${ReduxActionSuffixNameConst.cancel}`:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  ```

- **Step 4:** Create product saga effect (ProductOverviewSaga.js)

  ```js
  function* productOverview({ payload }) {
    yield call(
      apiCallWithReturn,
      awsApiWithCancelToken(AwsMethodConst.get, 'product', 'api/product_overview', {
        params: payload
      }),
      payload,
      { reduxActionName: PRODUCT_OVERVIEW }
    );
  }

  function* watchProductOverview(action) {
    yield race([
      call(productOverview, action),
      take(`${PRODUCT_OVERVIEW}${ReduxActionSuffixNameConst.cancel}`)
    ]);
  }

  export default [takeLatest(PRODUCT_OVERVIEW, watchProductOverview)];
  ```

- **Step 5:** Create root saga (index.js)
  ```js
  export default function* rootSaga() {
    yield all([...ProductOverviewSaga]);
  }
  ```
- **Step 6:** Create redux store (Store.js)

  ```js
  const sagaMiddleware = createSagaMiddleware();

  const persistConfig = {
    key: 'Pentair',
    version: 1,
    storage: reduxStorage,
    whitelist: ['productOverviewReducer'], // Whitelist (Save Specific Reducers)
    blacklist: [] // Blacklist (Don't Save Specific Reducers)
  };

  const rootReducer = combineReducers({
    productOverviewReducer: ProductOverviewReducer
  });

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  export default { store, persistor };
  ```

- **Step 7:** How to dispatch product overview and cancel request in product-overview screen (ProductOverviewScreen.js)

  ```js
  class Screen extends Component {
    componentDidMount() {
      const { productOverviewRequest } = this.props;
      productOverviewRequest?.({
        productId: 'ABC345787sgdfgsdf7qwe'
      });
    }

    componentWillUnmount() {
      const { productOverviewRequestCancel } = this.props;
      productOverviewRequestCancel?.();
    }
  }
  const mapStatesToProps = ({ productOverviewReducer }) => ({
    response: productOverviewReducer?.response || {},
    error: productOverviewReducer?.error || {}
  });

  const mapDispatchToProps = (dispatch) => ({
    productOverviewRequest: (payload) => dispatch(productOverviewRequest(payload)),
    productOverviewRequestCancel: () => dispatch(productOverviewRequestCancel()),
    dispatch
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

## Case 5 - Api with path query

Here provided a new password api example after redirect from deep link

**Request URL:** https://example.com/api/newPassword/[User123]

**Request Method:** POST

**Request Payload:** { oldPassword: "Pentair@123", newPassword: "Pentair@123456" }

**Status Code:** 200

- **Step 1:** Create new password reducer action type (NewPasswordActionType.js)
  ```js
  export const NEW_PASSWORD = 'NewPassword';
  ```
- **Step 2:** Create new password reducer action (NewPasswordAction.js)
  ```js
  export const newPasswordRequest = () => ({
    type: NEW_PASSWORD
  });
  export const newPasswordRequestCancel = () => ({
    type: `${NEW_PASSWORD}${ReduxActionSuffixNameConst.cancel}`
  });
  ```
- **Step 3:** Create new password reducer using React-Redux (NewPasswordReducer.js)

  ```js
  const INITIAL_STATE = {
    loading: false,
    response: undefined,
    error: undefined
  };

  export const NewPasswordReducer = (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
      case NEW_PASSWORD:
        return { ...state, loading: true };
      case `${NEW_PASSWORD}${ReduxActionSuffixNameConst.success}`:
        return { ...state, loading: false, response: payload.response };
      case `${NEW_PASSWORD}${ReduxActionSuffixNameConst.failure}`:
        return { ...state, loading: false, error: payload.error };
      case `${NEW_PASSWORD}${ReduxActionSuffixNameConst.cancel}`:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  ```

- **Step 4:** Create new password saga effect (NewPasswordSaga.js)

  ```js
  function* newPassword({ payload }) {
    yield call(
      apiCallWithReturn,
      awsApiWithCancelToken(AwsMethodConst.post, 'password', 'api/newPassword/{id}', {
        data: payload.data,
        paths: payload.paths
      }),
      payload,
      { reduxActionName: NEW_PASSWORD }
    );
  }

  function* watchNewPassword(action) {
    yield race([
      call(newPassword, action),
      take(`${NEW_PASSWORD}${ReduxActionSuffixNameConst.cancel}`)
    ]);
  }

  export default [takeLatest(NEW_PASSWORD, watchNewPassword)];
  ```

- **Step 5:** Create root saga (index.js)
  ```js
  export default function* rootSaga() {
    yield all([...NewPasswordSaga]);
  }
  ```
- **Step 6:** Create redux store (Store.js)

  ```js
  const sagaMiddleware = createSagaMiddleware();

  const persistConfig = {
    key: 'Pentair',
    version: 1,
    storage: reduxStorage,
    whitelist: ['newPasswordReducer'], // Whitelist (Save Specific Reducers)
    blacklist: [] // Blacklist (Don't Save Specific Reducers)
  };

  const rootReducer = combineReducers({
    newPasswordReducer: NewPasswordReducer
  });

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  export default { store, persistor };
  ```

- **Step 7:** How to dispatch new password and cancel request in new-password screen (NewPasswordScreen.js)

  ```js
  class Screen extends Component {
    handleNewPassword() {
      const { newPasswordRequest } = this.props;
      newPasswordRequest?.({
        data: {
          oldPassword: 'Pentair@123',
          newPassword: 'Pentair@123456'
        },
        paths: {
          id: 'User123'
        }
      });
    }

    componentWillUnmount() {
      const { newPasswordRequestCancel } = this.props;
      newPasswordRequestCancel?.();
    }
  }
  const mapStatesToProps = ({ newPasswordReducer }) => ({
    response: newPasswordReducer?.response || {},
    error: newPasswordReducer?.error || {}
  });

  const mapDispatchToProps = (dispatch) => ({
    newPasswordRequest: (payload) => dispatch(newPasswordRequest(payload)),
    newPasswordRequestCancel: () => dispatch(newPasswordRequestCancel()),
    dispatch
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

## Case 6 - Api with extra setting

Here provided a create product api example for how to call api with saga

**Request URL:** https://example.com/api/create_product

**Request Method:** POST

**Request Payload:** { name: "Prowler" }

**Status Code:** 200

- **Step 1:** Create create product reducer action type (CreateProductActionType.js)
  ```js
  export const CREATE_PRODUCT = 'create product';
  ```
- **Step 2:** Create create product reducer action (CreateProductAction.js)
  ```js
  export const createProductRequest = () => ({
    type: CREATE_PRODUCT
  });
  export const createProductRequestCancel = () => ({
    type: `${CREATE_PRODUCT}${ReduxActionSuffixNameConst.cancel}`
  });
  ```
- **Step 3:** Create create product reducer using React-Redux (CreateProductReducer.js)

  ```js
  const INITIAL_STATE = {
    loading: false,
    response: undefined,
    error: undefined
  };

  export const CreateProductReducer = (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
      case CREATE_PRODUCT:
        return { ...state, loading: true };
      case `${CREATE_PRODUCT}${ReduxActionSuffixNameConst.success}`:
        return { ...state, loading: false, response: payload.response };
      case `${CREATE_PRODUCT}${ReduxActionSuffixNameConst.failure}`:
        return { ...state, loading: false, error: payload.error };
      case `${CREATE_PRODUCT}${ReduxActionSuffixNameConst.cancel}`:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  ```

- **Step 4:** Create create product saga effect (CreateProductSaga.js)

  ```js
  function* createProduct({ payload }) {
    yield call(
      apiCallWithReturn,
      awsApiWithCancelToken(AwsMethodConst.post, 'product', 'api/create_product', {
        data: payload.data,
        setting: payload.setting
      }),
      payload,
      { reduxActionName: CREATE_PRODUCT }
    );
  }

  function* watchCreateProduct(action) {
    yield race([
      call(createProduct, action),
      take(`${CREATE_PRODUCT}${ReduxActionSuffixNameConst.cancel}`)
    ]);
  }

  export default [takeLatest(CREATE_PRODUCT, watchCreateProduct)];
  ```

- **Step 5:** Create root saga (index.js)
  ```js
  export default function* rootSaga() {
    yield all([...CreateProductSaga]);
  }
  ```
- **Step 6:** Create redux store (Store.js)

  ```js
  const sagaMiddleware = createSagaMiddleware();

  const persistConfig = {
    key: 'Pentair',
    version: 1,
    storage: reduxStorage,
    whitelist: ['createProductReducer'], // Whitelist (Save Specific Reducers)
    blacklist: [] // Blacklist (Don't Save Specific Reducers)
  };

  const rootReducer = combineReducers({
    createProductReducer: CreateProductReducer
  });

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  export default { store, persistor };
  ```

- **Step 7:** How to dispatch create product and cancel request in create-product screen (CreateProductScreen.js)

  ```js
  class Screen extends Component {
    handleCreateProduct() {
      const { createProductRequest } = this.props;
      createProductRequest?.({
        data: {
          name: 'Prowler'
        },
        setting: {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      });
    }

    componentWillUnmount() {
      const { createProductRequestCancel } = this.props;
      createProductRequestCancel?.();
    }
  }
  const mapStatesToProps = ({ createProductReducer }) => ({
    response: createProductReducer?.response || {},
    error: createProductReducer?.error || {}
  });

  const mapDispatchToProps = (dispatch) => ({
    createProductRequest: (payload) => dispatch(createProductRequest(payload)),
    createProductRequestCancel: () => dispatch(createProductRequestCancel()),
    dispatch
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

## Case 7 - Api with custom status code for successful

Here provided a sign in api example for how to call api with saga

**Request URL:** https://example.com/api/signIn

**Request Method:** POST

**Request Payload:** { email: "xyz@pentair.com", password: "Pentair@123" }

**Status Code:** 200 or 202

- **Step 1:** Create sign in reducer action type (SignInActionType.js)
  ```js
  export const SIGN_IN = 'signIn';
  ```
- **Step 2:** Create sign in reducer action (SignInAction.js)
  ```js
  export const signInRequest = () => ({
    type: SIGN_IN
  });
  export const signInRequestCancel = () => ({
    type: `${SIGN_IN}${ReduxActionSuffixNameConst.cancel}`
  });
  ```
- **Step 3:** Create sign in reducer using React-Redux (SignInReducer.js)

  ```js
  const INITIAL_STATE = {
    loading: false,
    response: undefined,
    error: undefined
  };

  export const SignInReducer = (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
      case SIGN_IN:
        return { ...state, loading: true };
      case `${SIGN_IN}${ReduxActionSuffixNameConst.success}`:
        return { ...state, loading: false, response: payload.response };
      case `${SIGN_IN}${ReduxActionSuffixNameConst.failure}`:
        return { ...state, loading: false, error: payload.error };
      case `${SIGN_IN}${ReduxActionSuffixNameConst.cancel}`:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  ```

- **Step 4:** Create sign in saga effect (SignInSaga.js)

  ```js
  function* signIn({ payload }) {
    yield call(
      apiCallWithReturn,
      awsApiWithCancelToken(AwsMethodConst.post, 'signIn', 'api/signIn', {
        data: payload
      }),
      payload,
      { reduxActionName: SIGN_IN, successStatus: [200, 202] }
    );
  }

  function* watchSignIn(action) {
    yield race([call(signIn, action), take(`${SIGN_IN}${ReduxActionSuffixNameConst.cancel}`)]);
  }

  export default [takeLatest(SIGN_IN, watchSignIn)];
  ```

- **Step 5:** Create root saga (index.js)
  ```js
  export default function* rootSaga() {
    yield all([...SignInSaga]);
  }
  ```
- **Step 6:** Create redux store (Store.js)

  ```js
  const sagaMiddleware = createSagaMiddleware();

  const persistConfig = {
    key: 'Pentair',
    version: 1,
    storage: reduxStorage,
    whitelist: ['signInReducer'], // Whitelist (Save Specific Reducers)
    blacklist: [] // Blacklist (Don't Save Specific Reducers)
  };

  const rootReducer = combineReducers({
    signInReducer: SignInReducer
  });

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  export default { store, persistor };
  ```

- **Step 7:** How to dispatch sign in and cancel request in sign-in screen (SignInScreen.js)

  ```js
  class Screen extends Component {
    handleSignIn() {
      const { signInRequest } = this.props;
      signInRequest?.({
        email: 'xyz@pentair.com',
        password: 'Pentair@123'
      });
    }

    componentWillUnmount() {
      const { signInRequestCancel } = this.props;
      signInRequestCancel?.();
    }
  }
  const mapStatesToProps = ({ signInReducer }) => ({
    response: signInReducer?.response || {},
    error: signInReducer?.error || {}
  });

  const mapDispatchToProps = (dispatch) => ({
    signInRequest: (payload) => dispatch(signInRequest(payload)),
    signInRequestCancel: () => dispatch(signInRequestCancel()),
    dispatch
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

## Case 8 - Api with custom failure message

Here provided a user detail api example for how to call api with saga

**Request URL:** https://example.com/api/user_detail

**Request Method:** GET

**Request Payload:** NA

**Status Code:** 200

- **Step 1:** Create user detail reducer action type (UserDetailActionType.js)
  ```js
  export const USER_DETAIL = 'userDetail';
  ```
- **Step 2:** Create user detail reducer action (UserDetailAction.js)
  ```js
  export const userDetailRequest = () => ({
    type: USER_DETAIL
  });
  export const userDetailSuccess = (payload) => ({
    type: `${USER_DETAIL}${ReduxActionSuffixNameConst.success}`,
    payload
  });
  export const userDetailFailure = (payload) => ({
    type: `${USER_DETAIL}${ReduxActionSuffixNameConst.failure}`,
    payload
  });
  export const userDetailRequestCancel = () => ({
    type: `${USER_DETAIL}${ReduxActionSuffixNameConst.cancel}`
  });
  ```
- **Step 3:** Create user detail reducer using React-Redux (UserDetailReducer.js)

  ```js
  const INITIAL_STATE = {
    loading: false,
    response: undefined,
    error: undefined
  };

  export const UserDetailReducer = (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
      case USER_DETAIL:
        return { ...state, loading: true };
      case `${USER_DETAIL}${ReduxActionSuffixNameConst.success}`:
        return { ...state, loading: false, response: payload };
      case `${USER_DETAIL}${ReduxActionSuffixNameConst.failure}`:
        return { ...state, loading: false, error: payload };
      case `${USER_DETAIL}${ReduxActionSuffixNameConst.cancel}`:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  ```

- **Step 4:** Create user detail saga effect (UserDetailSaga.js)

  ```js
  function* userDetail({ payload }) {
    const response = yield call(
      apiCallWithReturn,
      awsApiWithCancelToken(AwsMethodConst.get, 'user', 'api/user_detail'),
      payload,
      { customFailureMessage: 'The user not found' }
    );
    if (has(response, 'response')) {
      yield put(userDetailSuccess(response.response));
    } else {
      yield put(userDetailFailure(response.error));
    }
  }

  function* watchUserDetail(action) {
    yield race([
      call(userDetail, action),
      take(`${USER_DETAIL}${ReduxActionSuffixNameConst.cancel}`)
    ]);
  }

  export default [takeLatest(USER_DETAIL, watchUserDetail)];
  ```

- **Step 5:** Create root saga (index.js)
  ```js
  export default function* rootSaga() {
    yield all([...UserDetailSaga]);
  }
  ```
- **Step 6:** Create redux store (Store.js)

  ```js
  const sagaMiddleware = createSagaMiddleware();

  const persistConfig = {
    key: 'Pentair',
    version: 1,
    storage: reduxStorage,
    whitelist: ['userDetailReducer'], // Whitelist (Save Specific Reducers)
    blacklist: [] // Blacklist (Don't Save Specific Reducers)
  };

  const rootReducer = combineReducers({
    userDetailReducer: UserDetailReducer
  });

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  export default { store, persistor };
  ```

- **Step 7:** How to dispatch user detail and cancel request in user detail screen (UserDetailScreen.js)

  ```js
  class Screen extends Component {
    componentDidMount() {
      const { userDetailRequest } = this.props;
      userDetailRequest?.();
    }

    componentWillUnmount() {
      const { userDetailRequestCancel } = this.props;
      userDetailRequestCancel?.();
    }
  }
  const mapStatesToProps = ({ userDetailReducer }) => ({
    response: userDetailReducer?.response || {},
    error: userDetailReducer?.error || {}
  });

  const mapDispatchToProps = (dispatch) => ({
    userDetailRequest: (payload) => dispatch(userDetailRequest(payload)),
    userDetailRequestCancel: () => dispatch(userDetailRequestCancel()),
    dispatch
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

## Case 9 - Api with custom toast

Here provided a new password api example after redirect from deep link

**Request URL:** https://example.com/api/newPassword/[User123]

**Request Method:** POST

**Request Payload:** { oldPassword: "Pentair@123", newPassword: "Pentair@123456" }

**Status Code:** 200

- **Step 1:** Create new password reducer action type (NewPasswordActionType.js)
  ```js
  export const NEW_PASSWORD = 'NewPassword';
  ```
- **Step 2:** Create new password reducer action (NewPasswordAction.js)
  ```js
  export const newPasswordRequest = () => ({
    type: NEW_PASSWORD
  });
  export const newPasswordRequestCancel = () => ({
    type: `${NEW_PASSWORD}${ReduxActionSuffixNameConst.cancel}`
  });
  ```
- **Step 3:** Create new password reducer using React-Redux (NewPasswordReducer.js)

  ```js
  const INITIAL_STATE = {
    loading: false,
    response: undefined,
    error: undefined
  };

  export const NewPasswordReducer = (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
      case NEW_PASSWORD:
        return { ...state, loading: true };
      case `${NEW_PASSWORD}${ReduxActionSuffixNameConst.success}`:
        return { ...state, loading: false, response: payload.response };
      case `${NEW_PASSWORD}${ReduxActionSuffixNameConst.failure}`:
        return { ...state, loading: false, error: payload.error };
      case `${NEW_PASSWORD}${ReduxActionSuffixNameConst.cancel}`:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  ```

- **Step 4:** Create new password saga effect (NewPasswordSaga.js)

  ```js
  function* newPassword({ payload }) {
    yield call(
      apiCallWithReturn,
      awsApiWithCancelToken(AwsMethodConst.post, 'password', 'api/newPassword/{id}', {
        data: payload.data,
        paths: payload.paths
      }),
      payload,
      {
        reduxActionName: NEW_PASSWORD,
        toastShowParams: {
          type: ToastType.warning
        }
      }
    );
  }

  function* watchNewPassword(action) {
    yield race([
      call(newPassword, action),
      take(`${NEW_PASSWORD}${ReduxActionSuffixNameConst.cancel}`)
    ]);
  }

  export default [takeLatest(NEW_PASSWORD, watchNewPassword)];
  ```

- **Step 5:** Create root saga (index.js)
  ```js
  export default function* rootSaga() {
    yield all([...NewPasswordSaga]);
  }
  ```
- **Step 6:** Create redux store (Store.js)

  ```js
  const sagaMiddleware = createSagaMiddleware();

  const persistConfig = {
    key: 'Pentair',
    version: 1,
    storage: reduxStorage,
    whitelist: ['newPasswordReducer'], // Whitelist (Save Specific Reducers)
    blacklist: [] // Blacklist (Don't Save Specific Reducers)
  };

  const rootReducer = combineReducers({
    newPasswordReducer: NewPasswordReducer
  });

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  export default { store, persistor };
  ```

- **Step 7:** How to dispatch new password and cancel request in new-password screen (NewPasswordScreen.js)

  ```js
  class Screen extends Component {
    handleNewPassword() {
      const { newPasswordRequest } = this.props;
      newPasswordRequest?.({
        data: {
          oldPassword: 'Pentair@123',
          newPassword: 'Pentair@123456'
        },
        paths: {
          id: 'User123'
        }
      });
    }

    componentWillUnmount() {
      const { newPasswordRequestCancel } = this.props;
      newPasswordRequestCancel?.();
    }
  }
  const mapStatesToProps = ({ newPasswordReducer }) => ({
    response: newPasswordReducer?.response || {},
    error: newPasswordReducer?.error || {}
  });

  const mapDispatchToProps = (dispatch) => ({
    newPasswordRequest: (payload) => dispatch(newPasswordRequest(payload)),
    newPasswordRequestCancel: () => dispatch(newPasswordRequestCancel()),
    dispatch
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

## Case 10 - Api with disable failure toast

Here provided a create product api example for how to call api with saga

**Request URL:** https://example.com/api/create_product

**Request Method:** POST

**Request Payload:** { name: "Prowler" }

**Status Code:** 200

- **Step 1:** Create create product reducer action type (CreateProductActionType.js)
  ```js
  export const CREATE_PRODUCT = 'create product';
  ```
- **Step 2:** Create create product reducer action (CreateProductAction.js)
  ```js
  export const createProductRequest = () => ({
    type: CREATE_PRODUCT
  });
  export const createProductRequestCancel = () => ({
    type: `${CREATE_PRODUCT}${ReduxActionSuffixNameConst.cancel}`
  });
  ```
- **Step 3:** Create create product reducer using React-Redux (CreateProductReducer.js)

  ```js
  const INITIAL_STATE = {
    loading: false,
    response: undefined,
    error: undefined
  };

  export const CreateProductReducer = (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
      case CREATE_PRODUCT:
        return { ...state, loading: true };
      case `${CREATE_PRODUCT}${ReduxActionSuffixNameConst.success}`:
        return { ...state, loading: false, response: payload.response };
      case `${CREATE_PRODUCT}${ReduxActionSuffixNameConst.failure}`:
        return { ...state, loading: false, error: payload.error };
      case `${CREATE_PRODUCT}${ReduxActionSuffixNameConst.cancel}`:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  ```

- **Step 4:** Create create product saga effect (CreateProductSaga.js)

  ```js
  function* createProduct({ payload }) {
    yield call(
      apiCallWithReturn,
      awsApiWithCancelToken(AwsMethodConst.post, 'product', 'api/create_product', {
        data: payload.data,
        setting: payload.setting
      }),
      payload,
      { reduxActionName: CREATE_PRODUCT, isShowFailureToast: false }
    );
  }

  function* watchCreateProduct(action) {
    yield race([
      call(createProduct, action),
      take(`${CREATE_PRODUCT}${ReduxActionSuffixNameConst.cancel}`)
    ]);
  }

  export default [takeLatest(CREATE_PRODUCT, watchCreateProduct)];
  ```

- **Step 5:** Create root saga (index.js)
  ```js
  export default function* rootSaga() {
    yield all([...CreateProductSaga]);
  }
  ```
- **Step 6:** Create redux store (Store.js)

  ```js
  const sagaMiddleware = createSagaMiddleware();

  const persistConfig = {
    key: 'Pentair',
    version: 1,
    storage: reduxStorage,
    whitelist: ['createProductReducer'], // Whitelist (Save Specific Reducers)
    blacklist: [] // Blacklist (Don't Save Specific Reducers)
  };

  const rootReducer = combineReducers({
    createProductReducer: CreateProductReducer
  });

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  export default { store, persistor };
  ```

- **Step 7:** How to dispatch create product and cancel request in create-product screen (CreateProductScreen.js)

  ```js
  class Screen extends Component {
    handleCreateProduct() {
      const { createProductRequest } = this.props;
      createProductRequest?.({
        data: {
          name: 'Prowler'
        },
        setting: {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      });
    }

    componentWillUnmount() {
      const { createProductRequestCancel } = this.props;
      createProductRequestCancel?.();
    }
  }
  const mapStatesToProps = ({ createProductReducer }) => ({
    response: createProductReducer?.response || {},
    error: createProductReducer?.error || {}
  });

  const mapDispatchToProps = (dispatch) => ({
    createProductRequest: (payload) => dispatch(createProductRequest(payload)),
    createProductRequestCancel: () => dispatch(createProductRequestCancel()),
    dispatch
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

## Case 11 - Api with saga callback

You can also used all above case with callback function

**Request URL:** https://example.com/api/product_overview?productId=ABC345787sgdfgsdf7qwe

**Request Method:** GET

**Request Payload:** { productId: "ABC345787sgdfgsdf7qwe" }

**Status Code:** 200

Here provided a product overview api example for how to call api with saga

- **Step 1:** Create product overview reducer action type (ProductOverviewActionType.js)
  ```js
  export const PRODUCT_OVERVIEW = 'productOverview';
  ```
- **Step 2:** Create product overview reducer action (ProductOverviewAction.js)
  ```js
  export const productOverviewRequest = () => ({
    type: PRODUCT_OVERVIEW
  });
  export const productOverviewSuccess = (payload) => ({
    type: `${PRODUCT_OVERVIEW}${ReduxActionSuffixNameConst.success}`,
    payload
  });
  export const productOverviewFailure = (payload) => ({
    type: `${PRODUCT_OVERVIEW}${ReduxActionSuffixNameConst.failure}`,
    payload
  });
  export const productOverviewRequestCancel = () => ({
    type: `${PRODUCT_OVERVIEW}${ReduxActionSuffixNameConst.cancel}`
  });
  ```
- **Step 3:** Create product reducer using React-Redux (ProductOverviewReducer.js)

  ```js
  const INITIAL_STATE = {
    loading: false,
    response: undefined,
    error: undefined
  };

  export const ProductOverviewReducer = (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
      case PRODUCT_OVERVIEW:
        return { ...state, loading: true };
      case `${PRODUCT_OVERVIEW}${ReduxActionSuffixNameConst.success}`:
        return { ...state, loading: false, response: payload.response };
      case `${PRODUCT_OVERVIEW}${ReduxActionSuffixNameConst.failure}`:
        return { ...state, loading: false, error: payload.error };
      case `${PRODUCT_OVERVIEW}${ReduxActionSuffixNameConst.cancel}`:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  ```

- **Step 4:** Create product saga effect (ProductOverviewSaga.js)

  ```js
  function* productRequestsSuccess(response, request) {
    yield put(productRequestSuccess({ response, request }));
  }

  function* productRequestsFailure(error, request) {
    yield put(productRequestFailure({ error, request }));
  }

  function* productOverview({ payload }) {
    yield call(
      apiCallWithCallback,
      awsApiWithCancelToken(AwsMethodConst.get, 'product', 'api/product_overview', {
        params: payload
      }),
      payload,
      productRequestsSuccess,
      productRequestsFailure
    );
  }

  function* watchProductOverview(action) {
    yield race([
      call(productOverview, action),
      take(`${PRODUCT_OVERVIEW}${ReduxActionSuffixNameConst.cancel}`)
    ]);
  }

  export default [takeLatest(PRODUCT_OVERVIEW, watchProductOverview)];
  ```

- **Step 5:** Create root saga (index.js)
  ```js
  export default function* rootSaga() {
    yield all([...ProductOverviewSaga]);
  }
  ```
- **Step 6:** Create redux store (Store.js)

  ```js
  const sagaMiddleware = createSagaMiddleware();

  const persistConfig = {
    key: 'Pentair',
    version: 1,
    storage: reduxStorage,
    whitelist: ['productOverviewReducer'], // Whitelist (Save Specific Reducers)
    blacklist: [] // Blacklist (Don't Save Specific Reducers)
  };

  const rootReducer = combineReducers({
    productOverviewReducer: ProductOverviewReducer
  });

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  export default { store, persistor };
  ```

- **Step 7:** How to dispatch product overview and cancel request in product-overview screen (ProductOverviewScreen.js)

  ```js
  class Screen extends Component {
    componentDidMount() {
      const { productOverviewRequest } = this.props;
      productOverviewRequest?.({
        productId: 'ABC345787sgdfgsdf7qwe'
      });
    }

    componentWillUnmount() {
      const { productOverviewRequestCancel } = this.props;
      productOverviewRequestCancel?.();
    }
  }
  const mapStatesToProps = ({ productOverviewReducer }) => ({
    response: productOverviewReducer?.response || {},
    error: productOverviewReducer?.error || {}
  });

  const mapDispatchToProps = (dispatch) => ({
    productOverviewRequest: (payload) => dispatch(productOverviewRequest(payload)),
    productOverviewRequestCancel: () => dispatch(productOverviewRequestCancel()),
    dispatch
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

## Case 12 - with screen level callback without update redux state

You can also used all above case with callback function

**Request URL:** https://example.com/api/user_detail

**Request Method:** GET

**Request Payload:** NA

**Status Code:** 200

Here provided a user detail api example for how to call api with saga

- **Step 1:** Create user detail reducer action type (UserDetailActionType.js)
  ```js
  export const USER_DETAIL = 'userDetail';
  ```
- **Step 2:** Create user detail reducer action (UserDetailAction.js)
  ```js
  export const userDetailRequest = () => ({
    type: USER_DETAIL
  });
  export const userDetailRequestCancel = () => ({
    type: `${USER_DETAIL}${ReduxActionSuffixNameConst.cancel}`
  });
  ```
- **Step 3:** Create user detail reducer using React-Redux (UserDetailReducer.js)

  ```js
  const INITIAL_STATE = {
    loading: false,
    response: undefined,
    error: undefined
  };

  export const UserDetailReducer = (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
      default:
        return state;
    }
  };
  ```

- **Step 4:** Create user detail saga effect (UserDetailSaga.js)

  ```js
  function* userDetail({ payload }) {
      yield call(
          apiCallWithCallback,
          awsApiWithCancelToken(AwsMethodConst.get, 'user', 'api/user_detail'),
          payload,
          payload.onSuccess
          payload.onFailure
      );
  }

  function* watchUserDetail(action) {
      yield race([call(userDetail, action), take(`${USER_DETAIL}${ReduxActionSuffixNameConst.cancel}`)]);
  }

  export default [
      takeLatest(USER_DETAIL, watchUserDetail)
  ];
  ```

- **Step 5:** Create root saga (index.js)
  ```js
  export default function* rootSaga() {
    yield all([...UserDetailSaga]);
  }
  ```
- **Step 6:** Create redux store (Store.js)

  ```js
  const sagaMiddleware = createSagaMiddleware();

  const persistConfig = {
    key: 'Pentair',
    version: 1,
    storage: reduxStorage,
    whitelist: ['userDetailReducer'], // Whitelist (Save Specific Reducers)
    blacklist: [] // Blacklist (Don't Save Specific Reducers)
  };

  const rootReducer = combineReducers({
    userDetailReducer: UserDetailReducer
  });

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  export default { store, persistor };
  ```

- **Step 7:** How to dispatch user detail and cancel request in user detail screen (UserDetailScreen.js)

  ```js
  class Screen extends Component {
    componentDidMount() {
      const { userDetailRequest } = this.props;
      userDetailRequest?.({
        onSuccess: (response /*, request*/) => {
          // TODO: Here your business logic which will be executed when success api
        },
        onFailure: (error /*, request*/) => {
          // TODO: Here your business logic which will be executed when fail api
        }
      });
    }

    componentWillUnmount() {
      const { userDetailRequestCancel } = this.props;
      userDetailRequestCancel?.();
    }
  }
  const mapStatesToProps = ({}) => ({});

  const mapDispatchToProps = (dispatch) => ({
    userDetailRequest: (payload) => dispatch(userDetailRequest(payload)),
    userDetailRequestCancel: () => dispatch(userDetailRequestCancel()),
    dispatch
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

## Case 13 - Api with toolkit

Here provided a user detail api example

**Request URL:** https://example.com/api/user_detail

**Request Method:** GET

**Request Payload:** NA

**Status Code:** 200

- **Step 1:** Create user detail reducer using toolkit (UserDetailSlice.js)

  ```js
  const INITIAL_STATE = {
    loading: false,
    response: undefined,
    error: undefined
  };

  const userDetailSlice = createSlice({
    name: 'userDetail',
    initialState: INITIAL_STATE,
    reducers: {
      userDetailRequest: (state, action) => {
        state.loading = true;
      },
      userDetailSuccess: (state, action) => {
        state.loading = false;
        state.response = action.payload;
      },
      userDetailFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
      userDetailRequestCancel: (state, action) => {
        state.loading = false;
      }
    }
  });

  export const UserDetailReducer = userDetailSlice.reducer;
  export const UserDetailActions = userDetailSlice.actions;
  export const UserDetailReducerName = userDetailSlice.name;
  ```

- **Step 2:** Create user detail saga effect (UserDetailSaga.js)

  ```js
  function* userDetail({ payload }) {
    yield call(
      apiCallWithReturn,
      awsApiWithCancelToken(AwsMethodConst.get, 'user', 'api/user_detail'),
      payload,
      { reduxActionName: `${UserDetailReducerName}/userDetail` }
    );
  }

  function* watchUserDetail(action) {
    yield race([
      call(userDetail, action),
      take(UserDetailActions.userDetailRequestCancel.toString())
    ]);
  }

  export default [takeLatest(UserDetailActions.userDetailRequest.toString(), watchUserDetail)];
  ```

- **Step 3:** Create root saga (index.js)
  ```js
  export default function* rootSaga() {
    yield all([...UserDetailSaga]);
  }
  ```
- **Step 4:** Create redux store (Store.js)

  ```js
  const sagaMiddleware = createSagaMiddleware();

  const persistConfig = {
    key: 'Pentair',
    version: 1,
    storage: reduxStorage,
    whitelist: [UserDetailReducerName], // Whitelist (Save Specific Reducers)
    blacklist: [] // Blacklist (Don't Save Specific Reducers)
  };

  const rootReducer = combineReducers({
    [UserDetailReducerName]: UserDetailReducer
  });

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = configureStore({
    reducer: persistedReducer,
    devTools: false,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: false
      }).concat([sagaMiddleware])
  });

  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  export default { store, persistor };
  ```

- **Step 5:** How to dispatch user detail and cancel request in user-detail screen (UserDetailScreen.js)

  ```js
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(UserDetailActions.userDetailRequest());

    return () => {
      dispatch(UserDetailActions.userDetailRequestCancel());
    };
  }, []);
  ```

## Case 14 - Multiple api

Here provided a product overview & product comment api example

**Request URL:** https://example.com/api/product_overview?productId=ABC345787sgdfgsdf7qwe | https://example.com/api/product_comment?productId=ABC345787sgdfgsdf7qwe

**Request Method:** GET | GET

**Request Payload:** { productId: "ABC345787sgdfgsdf7qwe" } | { productId: "ABC345787sgdfgsdf7qwe" }

**Status Code:** 200 | 200

- **Step 1:** Create product overview reducer action type (ProductOverviewActionType.js)
  ```js
  export const PRODUCT_OVERVIEW = 'productOverview';
  ```
- **Step 2:** Create product overview reducer action (ProductOverviewAction.js)
  ```js
  export const productOverviewRequest = () => ({
    type: PRODUCT_OVERVIEW
  });
  export const productOverviewSuccess = (payload) => ({
    type: `${PRODUCT_OVERVIEW}${ReduxActionSuffixNameConst.success}`,
    payload
  });
  export const productOverviewFailure = (payload) => ({
    type: `${PRODUCT_OVERVIEW}${ReduxActionSuffixNameConst.failure}`,
    payload
  });
  export const productOverviewRequestCancel = () => ({
    type: `${PRODUCT_OVERVIEW}${ReduxActionSuffixNameConst.cancel}`
  });
  ```
- **Step 3:** Create product reducer using React-Redux (ProductOverviewReducer.js)

  ```js
  const INITIAL_STATE = {
    loading: false,
    overviewResponse: undefined,
    overviewError: undefined,
    commentResponse: undefined,
    commentError: undefined
  };

  export const ProductOverviewReducer = (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
      case PRODUCT_OVERVIEW:
        return { ...state, loading: true };
      case `${PRODUCT_OVERVIEW}${ReduxActionSuffixNameConst.success}`:
        return {
          ...state,
          loading: false,
          overviewResponse: payload.overviewResponse,
          commentResponse: payload.commentResponse
        };
      case `${PRODUCT_OVERVIEW}${ReduxActionSuffixNameConst.failure}`:
        return {
          ...state,
          loading: false,
          overviewError: payload.overviewError,
          commentError: payload.commentError
        };
      case `${PRODUCT_OVERVIEW}${ReduxActionSuffixNameConst.cancel}`:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  ```

- **Step 4:** Create product saga effect (ProductOverviewSaga.js)

  ```js
  function* productOverview({ payload }) {
    const [overview, comment] = yield all([
      call(
        apiCallWithReturn,
        awsApiWithCancelToken(AwsMethodConst.get, 'product', 'api/product_overview', {
          params: payload
        }),
        payload
      ),
      call(
        apiCallWithReturn,
        awsApiWithCancelToken(AwsMethodConst.get, 'product', 'api/product_comment', {
          params: payload
        }),
        payload
      )
    ]);
    if (has(overview, 'response') && has(comment, 'response')) {
      yield put(
        productOverviewSuccess({
          overviewResponse: overview.response,
          commentResponse: comment.response
        })
      );
    } else {
      yield put(
        productOverviewFailure({
          overviewError: overview.error,
          commentError: comment.error
        })
      );
    }
  }

  function* watchProductOverview(action) {
    yield race([
      call(productOverview, action),
      take(`${PRODUCT_OVERVIEW}${ReduxActionSuffixNameConst.cancel}`)
    ]);
  }

  export default [takeLatest(PRODUCT_OVERVIEW, watchProductOverview)];
  ```

- **Step 5:** Create root saga (index.js)
  ```js
  export default function* rootSaga() {
    yield all([...ProductOverviewSaga]);
  }
  ```
- **Step 6:** Create redux store (Store.js)

  ```js
  const sagaMiddleware = createSagaMiddleware();

  const persistConfig = {
    key: 'Pentair',
    version: 1,
    storage: reduxStorage,
    whitelist: ['productOverviewReducer'], // Whitelist (Save Specific Reducers)
    blacklist: [] // Blacklist (Don't Save Specific Reducers)
  };

  const rootReducer = combineReducers({
    productOverviewReducer: ProductOverviewReducer
  });

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  export default { store, persistor };
  ```

- **Step 7:** How to dispatch product overview and cancel request in product-overview screen (ProductOverviewScreen.js)

  ```js
  class Screen extends Component {
    componentDidMount() {
      const { productOverviewRequest } = this.props;
      productOverviewRequest?.({
        productId: 'ABC345787sgdfgsdf7qwe'
      });
    }

    componentWillUnmount() {
      const { productOverviewRequestCancel } = this.props;
      productOverviewRequestCancel?.();
    }
  }
  const mapStatesToProps = ({ productOverviewReducer }) => ({
    response: productOverviewReducer?.response || {},
    error: productOverviewReducer?.error || {}
  });

  const mapDispatchToProps = (dispatch) => ({
    productOverviewRequest: (payload) => dispatch(productOverviewRequest(payload)),
    productOverviewRequestCancel: () => dispatch(productOverviewRequestCancel()),
    dispatch
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

## Case 15 - Api with spawn effect

Here provided a create product example with spawn effect because spawn provided a independent task and not affect to parent(root saga) in case any unhandled exception throws.

**Request URL:** https://example.com/api/create_product

**Request Method:** POST

**Request Payload:** { name: "Prowler" }

**Status Code:** 200

- **Step 1:** Create create product reducer action type (CreateProductActionType.js)
  ```js
  export const CREATE_PRODUCT = 'create product';
  ```
- **Step 2:** Create create product reducer action (CreateProductAction.js)
  ```js
  export const createProductRequest = () => ({
    type: CREATE_PRODUCT
  });
  export const createProductRequestCancel = () => ({
    type: `${CREATE_PRODUCT}${ReduxActionSuffixNameConst.cancel}`
  });
  ```
- **Step 3:** Create create product reducer using React-Redux (CreateProductReducer.js)

  ```js
  const INITIAL_STATE = {
    loading: false,
    response: undefined,
    error: undefined
  };

  export const CreateProductReducer = (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
      case CREATE_PRODUCT:
        return { ...state, loading: true };
      case `${CREATE_PRODUCT}${ReduxActionSuffixNameConst.success}`:
        return { ...state, loading: false, response: payload.response };
      case `${CREATE_PRODUCT}${ReduxActionSuffixNameConst.failure}`:
        return { ...state, loading: false, error: payload.error };
      case `${CREATE_PRODUCT}${ReduxActionSuffixNameConst.cancel}`:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  ```

- **Step 4:** Create create product saga effect (CreateProductSaga.js)

  ```js
  function* createProduct({ payload }) {
    yield call(
      apiCallWithReturn,
      awsApiWithCancelToken(AwsMethodConst.post, 'product', 'api/create_product', {
        data: payload.data,
        setting: payload.setting
      }),
      payload,
      { reduxActionName: CREATE_PRODUCT }
    );
  }

  function* watchCreateProduct() {
    while (true) {
      const action = yield take(CREATE_PRODUCT);
      yield race([
        call(createProduct, action),
        take(`${CREATE_PRODUCT}${ReduxActionSuffixNameConst.cancel}`)
      ]);
    }
  }

  export default [spawn(watchCreateProduct)];
  ```

- **Step 5:** Create root saga (index.js)
  ```js
  export default function* rootSaga() {
    yield all([...CreateProductSaga]);
  }
  ```
- **Step 6:** Create redux store (Store.js)

  ```js
  const sagaMiddleware = createSagaMiddleware();

  const persistConfig = {
    key: 'Pentair',
    version: 1,
    storage: reduxStorage,
    whitelist: ['createProductReducer'], // Whitelist (Save Specific Reducers)
    blacklist: [] // Blacklist (Don't Save Specific Reducers)
  };

  const rootReducer = combineReducers({
    createProductReducer: CreateProductReducer
  });

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  export default { store, persistor };
  ```

- **Step 7:** How to dispatch create product and cancel request in create-product screen (CreateProductScreen.js)

  ```js
  class Screen extends Component {
    handleCreateProduct() {
      const { createProductRequest } = this.props;
      createProductRequest?.({
        data: {
          name: 'Prowler'
        },
        setting: {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      });
    }

    componentWillUnmount() {
      const { createProductRequestCancel } = this.props;
      createProductRequestCancel?.();
    }
  }
  const mapStatesToProps = ({ createProductReducer }) => ({
    response: createProductReducer?.response || {},
    error: createProductReducer?.error || {}
  });

  const mapDispatchToProps = (dispatch) => ({
    createProductRequest: (payload) => dispatch(createProductRequest(payload)),
    createProductRequestCancel: () => dispatch(createProductRequestCancel()),
    dispatch
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

## Case 16 - Api with unauthorized call

You can also used all above case with un authorize call

Here provided a sign in api example

**Request URL:** https://example.com/api/signIn

**Request Method:** POST

**Request Payload:** { email: "xyz@pentair.com", password: "Pentair@123" }

**Status Code:** 200

- **Step 1:** Create sign in reducer action type (SignInActionType.js)
  ```js
  export const SIGN_IN = 'signIn';
  ```
- **Step 2:** Create sign in reducer action (SignInAction.js)
  ```js
  export const signInRequest = () => ({
    type: SIGN_IN
  });
  export const signInRequestCancel = () => ({
    type: `${SIGN_IN}${ReduxActionSuffixNameConst.cancel}`
  });
  ```
- **Step 3:** Create sign in reducer using React-Redux (SignInReducer.js)

  ```js
  const INITIAL_STATE = {
    loading: false,
    response: undefined,
    error: undefined
  };

  export const SignInReducer = (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
      case SIGN_IN:
        return { ...state, loading: true };
      case `${SIGN_IN}${ReduxActionSuffixNameConst.success}`:
        return { ...state, loading: false, response: payload.response };
      case `${SIGN_IN}${ReduxActionSuffixNameConst.failure}`:
        return { ...state, loading: false, error: payload.error };
      case `${SIGN_IN}${ReduxActionSuffixNameConst.cancel}`:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  ```

- **Step 4:** Create sign in saga effect (SignInSaga.js)

  ```js
  function* signIn({ payload }) {
    yield call(
      apiCallWithReturn,
      awsApiWithCancelToken(AwsMethodConst.post, 'signIn', 'api/signIn', {
        data: payload,
        isUnauthorized: true
      }),
      payload,
      { reduxActionName: SIGN_IN }
    );
  }

  function* watchSignIn(action) {
    yield race([call(signIn, action), take(`${SIGN_IN}${ReduxActionSuffixNameConst.cancel}`)]);
  }

  export default [takeLatest(SIGN_IN, watchSignIn)];
  ```

- **Step 5:** Create root saga (index.js)
  ```js
  export default function* rootSaga() {
    yield all([...SignInSaga]);
  }
  ```
- **Step 6:** Create redux store (Store.js)

  ```js
  const sagaMiddleware = createSagaMiddleware();

  const persistConfig = {
    key: 'Pentair',
    version: 1,
    storage: reduxStorage,
    whitelist: ['signInReducer'], // Whitelist (Save Specific Reducers)
    blacklist: [] // Blacklist (Don't Save Specific Reducers)
  };

  const rootReducer = combineReducers({
    signInReducer: SignInReducer
  });

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  export default { store, persistor };
  ```

- **Step 7:** How to dispatch sign in and cancel request in sign-in screen (SignInScreen.js)

  ```js
  class Screen extends Component {
    handleSignIn() {
      const { signInRequest } = this.props;
      signInRequest?.({
        email: 'xyz@pentair.com',
        password: 'Pentair@123'
      });
    }

    componentWillUnmount() {
      const { signInRequestCancel } = this.props;
      signInRequestCancel?.();
    }
  }
  const mapStatesToProps = ({ signInReducer }) => ({
    response: signInReducer?.response || {},
    error: signInReducer?.error || {}
  });

  const mapDispatchToProps = (dispatch) => ({
    signInRequest: (payload) => dispatch(signInRequest(payload)),
    signInRequestCancel: () => dispatch(signInRequestCancel()),
    dispatch
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

## Case 17 - Api with parse failure message

Here provided a user detail api example for how to parse error message

**Request URL:** https://example.com/api/user_detail

**Request Method:** GET

**Request Payload:** NA

**Status Code:** 200

- **Step 1:** Create user detail reducer action type (UserDetailActionType.js)
  ```js
  export const USER_DETAIL = 'userDetail';
  ```
- **Step 2:** Create user detail reducer action (UserDetailAction.js)
  ```js
  export const userDetailRequest = () => ({
    type: USER_DETAIL
  });
  export const userDetailSuccess = (payload) => ({
    type: `${USER_DETAIL}${ReduxActionSuffixNameConst.success}`,
    payload
  });
  export const userDetailFailure = (payload) => ({
    type: `${USER_DETAIL}${ReduxActionSuffixNameConst.failure}`,
    payload
  });
  export const userDetailRequestCancel = () => ({
    type: `${USER_DETAIL}${ReduxActionSuffixNameConst.cancel}`
  });
  ```
- **Step 3:** Create user detail reducer using React-Redux (UserDetailReducer.js)

  ```js
  const INITIAL_STATE = {
    loading: false,
    response: undefined,
    error: undefined
  };

  export const UserDetailReducer = (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
      case USER_DETAIL:
        return { ...state, loading: true };
      case `${USER_DETAIL}${ReduxActionSuffixNameConst.success}`:
        return { ...state, loading: false, response: payload };
      case `${USER_DETAIL}${ReduxActionSuffixNameConst.failure}`:
        return { ...state, loading: false, error: payload };
      case `${USER_DETAIL}${ReduxActionSuffixNameConst.cancel}`:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  ```

- **Step 4:** Create user detail saga effect (UserDetailSaga.js)

  ```js
  function* userDetail({ payload }) {
    const response = yield call(
      apiCallWithReturn,
      awsApiWithCancelToken(AwsMethodConst.get, 'user', 'api/user_detail'),
      payload,
      {
        parseFailureMessage: (apiResult, error) => {
          return apiResult?.data?.msgs?.[0]?.long_desc || error?.message || 'The user not found';
        }
      }
    );
    if (has(response, 'response')) {
      yield put(userDetailSuccess(response.response));
    } else {
      yield put(userDetailFailure(response.error));
    }
  }

  function* watchUserDetail(action) {
    yield race([
      call(userDetail, action),
      take(`${USER_DETAIL}${ReduxActionSuffixNameConst.cancel}`)
    ]);
  }

  export default [takeLatest(USER_DETAIL, watchUserDetail)];
  ```

- **Step 5:** Create root saga (index.js)
  ```js
  export default function* rootSaga() {
    yield all([...UserDetailSaga]);
  }
  ```
- **Step 6:** Create redux store (Store.js)

  ```js
  const sagaMiddleware = createSagaMiddleware();

  const persistConfig = {
    key: 'Pentair',
    version: 1,
    storage: reduxStorage,
    whitelist: ['userDetailReducer'], // Whitelist (Save Specific Reducers)
    blacklist: [] // Blacklist (Don't Save Specific Reducers)
  };

  const rootReducer = combineReducers({
    userDetailReducer: UserDetailReducer
  });

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  export default { store, persistor };
  ```

- **Step 7:** How to dispatch user detail and cancel request in user detail screen (UserDetailScreen.js)

  ```js
  class Screen extends Component {
    componentDidMount() {
      const { userDetailRequest } = this.props;
      userDetailRequest?.();
    }

    componentWillUnmount() {
      const { userDetailRequestCancel } = this.props;
      userDetailRequestCancel?.();
    }
  }
  const mapStatesToProps = ({ userDetailReducer }) => ({
    response: userDetailReducer?.response || {},
    error: userDetailReducer?.error || {}
  });

  const mapDispatchToProps = (dispatch) => ({
    userDetailRequest: (payload) => dispatch(userDetailRequest(payload)),
    userDetailRequestCancel: () => dispatch(userDetailRequestCancel()),
    dispatch
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

## Case 18 - Api with axios config

You can also used all above case with non callback or callback function

Here provided a sign in api example

**Request URL:** https://example.com/api/signIn

**Request Method:** POST

**Request Payload:** { email: "xyz@pentair.com", password: "Pentair@123" }

**Status Code:** 200

- **Step 1:** Create sign in reducer action type (SignInActionType.js)
  ```js
  export const SIGN_IN = 'signIn';
  ```
- **Step 2:** Create sign in reducer action (SignInAction.js)
  ```js
  export const signInRequest = () => ({
    type: SIGN_IN
  });
  export const signInRequestCancel = () => ({
    type: `${SIGN_IN}${ReduxActionSuffixNameConst.cancel}`
  });
  ```
- **Step 3:** Create sign in reducer using React-Redux (SignInReducer.js)

  ```js
  const INITIAL_STATE = {
    loading: false,
    response: undefined,
    error: undefined
  };

  export const SignInReducer = (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
      case SIGN_IN:
        return { ...state, loading: true };
      case `${SIGN_IN}${ReduxActionSuffixNameConst.success}`:
        return { ...state, loading: false, response: payload.response };
      case `${SIGN_IN}${ReduxActionSuffixNameConst.failure}`:
        return { ...state, loading: false, error: payload.error };
      case `${SIGN_IN}${ReduxActionSuffixNameConst.cancel}`:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  ```

- **Step 4:** Create sign in saga effect (SignInSaga.js)

  ```js
  function* signIn({ payload }) {
    yield call(
      apiCallWithReturn,
      axiosApiWithCancelToken(AxiosMethodConst.post, 'api/signIn', {
        data: payload
      }),
      payload,
      { reduxActionName: SIGN_IN }
    );
  }

  function* watchSignIn(action) {
    yield race([call(signIn, action), take(`${SIGN_IN}${ReduxActionSuffixNameConst.cancel}`)]);
  }

  export default [takeLatest(SIGN_IN, watchSignIn)];
  ```

- **Step 5:** Create root saga (index.js)
  ```js
  export default function* rootSaga() {
    yield all([...SignInSaga]);
  }
  ```
- **Step 6:** Create redux store (Store.js)

  ```js
  const sagaMiddleware = createSagaMiddleware();

  const persistConfig = {
    key: 'Pentair',
    version: 1,
    storage: reduxStorage,
    whitelist: ['signInReducer'], // Whitelist (Save Specific Reducers)
    blacklist: [] // Blacklist (Don't Save Specific Reducers)
  };

  const rootReducer = combineReducers({
    signInReducer: SignInReducer
  });

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  export default { store, persistor };
  ```

- **Step 7:** How to dispatch sign in and cancel request in sign-in screen (SignInScreen.js)

  ```js
  class Screen extends Component {
    handleSignIn() {
      const { signInRequest } = this.props;
      signInRequest?.({
        email: 'xyz@pentair.com',
        password: 'Pentair@123'
      });
    }

    componentWillUnmount() {
      const { signInRequestCancel } = this.props;
      signInRequestCancel?.();
    }
  }
  const mapStatesToProps = ({ signInReducer }) => ({
    response: signInReducer?.response || {},
    error: signInReducer?.error || {}
  });

  const mapDispatchToProps = (dispatch) => ({
    signInRequest: (payload) => dispatch(signInRequest(payload)),
    signInRequestCancel: () => dispatch(signInRequestCancel()),
    dispatch
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```

## Case 19 - Api with fetch config

You can also used all above case with non callback or callback function

Here provided a sign in api example

**Request URL:** https://example.com/api/signIn

**Request Method:** POST

**Request Payload:** { email: "xyz@pentair.com", password: "Pentair@123" }

**Status Code:** 200

- **Step 1:** Create sign in reducer action type (SignInActionType.js)
  ```js
  export const SIGN_IN = 'signIn';
  ```
- **Step 2:** Create sign in reducer action (SignInAction.js)
  ```js
  export const signInRequest = () => ({
    type: SIGN_IN
  });
  export const signInRequestCancel = () => ({
    type: `${SIGN_IN}${ReduxActionSuffixNameConst.cancel}`
  });
  ```
- **Step 3:** Create sign in reducer using React-Redux (SignInReducer.js)

  ```js
  const INITIAL_STATE = {
    loading: false,
    response: undefined,
    error: undefined
  };

  export const SignInReducer = (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
      case SIGN_IN:
        return { ...state, loading: true };
      case `${SIGN_IN}${ReduxActionSuffixNameConst.success}`:
        return { ...state, loading: false, response: payload.response };
      case `${SIGN_IN}${ReduxActionSuffixNameConst.failure}`:
        return { ...state, loading: false, error: payload.error };
      case `${SIGN_IN}${ReduxActionSuffixNameConst.cancel}`:
        return { ...state, loading: false };
      default:
        return state;
    }
  };
  ```

- **Step 4:** Create sign in saga effect (SignInSaga.js)

  ```js
  function* signIn({ payload }) {
    yield call(
      apiCallWithReturn,
      fetchApiWithCancelToken(FetchMethodConst.post, 'api/signIn', {
        data: payload
      }),
      payload,
      { reduxActionName: SIGN_IN }
    );
  }

  function* watchSignIn(action) {
    yield race([call(signIn, action), take(`${SIGN_IN}${ReduxActionSuffixNameConst.cancel}`)]);
  }

  export default [takeLatest(SIGN_IN, watchSignIn)];
  ```

- **Step 5:** Create root saga (index.js)
  ```js
  export default function* rootSaga() {
    yield all([...SignInSaga]);
  }
  ```
- **Step 6:** Create redux store (Store.js)

  ```js
  const sagaMiddleware = createSagaMiddleware();

  const persistConfig = {
    key: 'Pentair',
    version: 1,
    storage: reduxStorage,
    whitelist: ['signInReducer'], // Whitelist (Save Specific Reducers)
    blacklist: [] // Blacklist (Don't Save Specific Reducers)
  };

  const rootReducer = combineReducers({
    signInReducer: SignInReducer
  });

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(persistedReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));

  const persistor = persistStore(store);

  sagaMiddleware.run(rootSaga);

  export default { store, persistor };
  ```

- **Step 7:** How to dispatch sign in and cancel request in sign-in screen (SignInScreen.js)

  ```js
  class Screen extends Component {
    handleSignIn() {
      const { signInRequest } = this.props;
      signInRequest?.({
        email: 'xyz@pentair.com',
        password: 'Pentair@123'
      });
    }

    componentWillUnmount() {
      const { signInRequestCancel } = this.props;
      signInRequestCancel?.();
    }
  }
  const mapStatesToProps = ({ signInReducer }) => ({
    response: signInReducer?.response || {},
    error: signInReducer?.error || {}
  });

  const mapDispatchToProps = (dispatch) => ({
    signInRequest: (payload) => dispatch(signInRequest(payload)),
    signInRequestCancel: () => dispatch(signInRequestCancel()),
    dispatch
  });

  export default connect(mapStatesToProps, mapDispatchToProps)(Screen);
  ```
