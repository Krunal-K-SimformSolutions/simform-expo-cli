import { QuestionAnswer, AppConstant } from '../../../../src/index.js';

export * from './WebSocketConst.js';
export * from './WebSocketManager.js';
export * from './WebSocketSaga.js';
export * from './WebSocketTypes.js';

/**
 *
 */
export const SocketTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const isReactRedux = variables.isSupportStateManagement(AppConstant.StateManagement.ReactRedux);
  const isReduxSaga = variables.isSupportStateManagementMiddleware(
    AppConstant.StateManagementMiddleware.ReduxSaga
  );

  return `
    export * from './WebSocketConst';
    export { default as WebSocketManager } from './WebSocketManager';
    ${isReactRedux && isReduxSaga ? "export { default as WebSocketManagerSaga } from './WebSocketSaga';" : ''}
    export * from './WebSocketTypes';
  `;
};
