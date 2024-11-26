import { QuestionAnswer, AppConstant } from '../../../src/index.js';

/**
 *
 */
export const StoreTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const isReduxThunk = variables.isSupportStateManagementMiddleware(
    AppConstant.StateManagementMiddleware.ReduxThunk
  );
  const isReduxSaga = variables.isSupportStateManagementMiddleware(
    AppConstant.StateManagementMiddleware.ReduxSaga
  );

  const isSocket = variables.isSupportFeature(AppConstant.AddFeature.Socket);

  return `
    import AsyncStorage from '@react-native-async-storage/async-storage';
    import { combineReducers, configureStore } from '@reduxjs/toolkit';
    import { persistReducer, persistStore } from 'redux-persist';
    ${isReduxSaga ? "import createSagaMiddleware from 'redux-saga';" : ''}
    import { StorageKeyConst } from '../constants';
    ${isReduxSaga ? "import rootSaga from '../saga';" : ''}
    ${isSocket ? "import { AppRequestReducer, AppRequestSliceName } from './app-request';" : ''}
    import { AuthReducer, AuthSliceName } from './auth';
    ${isSocket && isReduxThunk ? "import { socketMiddleware } from './middleware';" : ''}
    ${isReduxSaga ? 'const sagaMiddleware = createSagaMiddleware();' : ''}

    /**
     * The Configuring persistConfig object for ReduxStorage.
     * @type {object}
     * @property {string} key - The key to use for persisting the state.
     * @property {number} version - The version of the state to persist.
     * @property {object} storage - The storage object to use for persisting the state.
     * @property {string[]} whitelist - The list of reducers to persist.
     * @property {string[]} blacklist - The list of reducers to not persist.
     */
    const persistConfig = {
      key: StorageKeyConst.redux,
      version: 1,
      storage: AsyncStorage,
      whitelist: [AuthSliceName], // Whitelist (Save Specific Reducers)
      blacklist: [${isSocket ? 'AppRequestSliceName' : ''}] // Blacklist (Don't Save Specific Reducers)
    };

    /**
     * Combining all the reducers into one reducer.
     * @returns {Object} The new reducers of the application.
     */
    const rootReducer = combineReducers({
      ${isSocket ? 'appRequest: AppRequestReducer,' : ''}
      auth: AuthReducer
    });

    /**
     * Creates a persisted reducer that can be used in a Redux store.
     * @param {PersistConfig} persistConfig - The configuration object for the persisted reducer.
     * @param {Reducer} rootReducer - The reducer to be persisted.
     * @returns {Reducer} - The persisted reducer.
     */
    const persistedReducer = persistReducer(persistConfig, rootReducer);

    const middlewareList: Array<any> = [];
    ${isSocket && isReduxThunk ? 'middlewareList.push(socketMiddleware);' : ''}
    ${isReduxSaga ? 'middlewareList.push(sagaMiddleware);' : ''}

    /* Creating a store with the persisted reducer. */
    /**
     * Configure the redux store.
     * This is a function that takes in the default redux store and returns a new store.
     * It is used to configure the store with middleware and reducer.
     * The default store is configured with thunk, which allows for asynchronous actions.
     * The default store is configured with the serializableCheck middleware,
     * which allows for actions to be serialized and deserialized.
     */
    const store = configureStore({
      reducer: persistedReducer,
      devTools: false,
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          thunk: ${isReduxThunk ? 'true' : 'false'},
          immutableCheck: true,
          serializableCheck: false,
          actionCreatorCheck: true
        }).concat(middlewareList)
    });

    /**
     * Persists the store to local storage.
     * @param {Store} store - The redux store.
     * @returns None
     */
    const persistor = persistStore(store);

    ${
      isReduxSaga
        ? `
            /**
             * Runs the root saga.
             */
            sagaMiddleware.run(rootSaga);
          `
        : ''
    }

    // Infer the \`RootState\` and \`AppDispatch\` types from the store itself
    export type RootStateType = ReturnType<typeof store.getState> & {
      [key: string]: any; // Index signature
    };

    // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
    export type AppDispatchType = typeof store.dispatch;

    // Enable persistence
    export default { store, persistor };
  `;
};
