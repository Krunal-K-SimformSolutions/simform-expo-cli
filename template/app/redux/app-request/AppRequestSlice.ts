import { QuestionAnswer, AppConstant } from '../../../../src/index.js';

/**
 *
 */
export const AppRequestSliceTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const isSocket = variables.isSupportFeature(AppConstant.AddFeature.Socket);

  return `
    import { createSlice, type Draft${isSocket ? ',\ntype PayloadAction' : ''} } from '@reduxjs/toolkit';
    import { type AppRequestStateType, INITIAL_STATE, AppRequestSliceName } from './AppRequestInitial';
    ${isSocket ? "import type { ConnectPayloadType, WebSocketEmitPayloadType } from '../../configs';" : ''}
    
    /**
     * Creating a appRequest slice of the redux store
     * @param {AppRequestStateType} state - The current state of the appRequest reducer.
     * @param {Action} action - The action to handle.
     * @returns {AppRequestStateType} The new state of the appRequest reducer.
     */
    const appRequestSlice = createSlice({
      name: AppRequestSliceName,
      initialState: INITIAL_STATE,
      reducers: {
        ${
          isSocket
            ? `
                disconnectSocket: (_state: Draft<AppRequestStateType>) => {},
                connectSocket: (
                  _state: Draft<AppRequestStateType>,
                  _action: PayloadAction<ConnectPayloadType>
                ) => {},
                emitSocket: (
                  _state: Draft<AppRequestStateType>,
                  _action: PayloadAction<WebSocketEmitPayloadType>
                ) => {}
              `
            : ''
        }
      }
    });

    /* Exporting the reducer function that will be used in the root reducer. */
    export const AppRequestReducer = appRequestSlice.reducer;

    /**
     * Creates an object with all of the actions for the appRequest slice.
     * @returns {Object} - An object with all of the actions for the appRequest slice.
     */
    export const AppRequestActions = { ...appRequestSlice.actions };
  `;
};
