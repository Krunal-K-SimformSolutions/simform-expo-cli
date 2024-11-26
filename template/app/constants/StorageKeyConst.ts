import { QuestionAnswer, AppConstant } from '../../../src/index.js';

/**
 *
 */
export const StorageKeyConstTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const name = variables.getProjectNameWithLowerCase;

  const isReactRedux = variables.isSupportStateManagement(AppConstant.StateManagement.ReactRedux);
  const isGraphQL = variables.isSupportStateManagement(AppConstant.StateManagement.GraphQL);

  return `
    /**
     * A collection of static data used by the project.
     */
    export default Object.freeze({
      appTheme: 'appTheme',
      appLanguage: 'app-language',
      ${isReactRedux ? `redux: '${name}-redux',` : ''}
      ${isGraphQL ? `graphql: '${name}-graphql',` : ''}
      ${isGraphQL ? `graphqlClient: '${name}-graphql-client',` : ''}
      storageKeyPrefix: '${name}'
    });
  `;
};
