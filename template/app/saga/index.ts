import { QuestionAnswer, AppConstant } from '../../../src/index.js';

export * from './AuthSaga.js';

/**
 *
 */
export const SagaTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const isSocket = variables.isSupportFeature(AppConstant.AddFeature.Socket);

  return `
    import { all } from 'redux-saga/effects';
    ${isSocket ? "import { WebSocketManagerSaga } from '../configs';" : ''}
    import AuthSaga from './AuthSaga';

    /**
     * The root saga for the application.
     * @returns None
     */
    export default function* rootSaga() {
      yield all([...AuthSaga${isSocket ? ', ...WebSocketManagerSaga' : ''}]);
    }
  `;
};
