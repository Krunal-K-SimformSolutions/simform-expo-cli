import { QuestionAnswer, AppConstant } from '../../../src/index.js';

export * from './hooks-utils/index.js';
export * from './useAppState.js';
export * from './useAsyncStorage.js';
export * from './useBackHandler.js';
export * from './useDeepCompareCallback.js';
export * from './useDeepCompareEffect.js';
export * from './useHeader.js';
export * from './useKeyboard.js';
export * from './useLazyQueryWithCancelToken.js';
export * from './useMutationWithCancelToken.js';
export * from './usePrevious.js';
export * from './useQueryWithCancelToken.js';
export * from './useSubscriptionWithCancelToken.js';
export * from './useTheme.js';
export * from './useTimeout.js';

/**
 *
 */
export const HookTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const isGraphQL = variables.isSupportStateManagement(AppConstant.StateManagement.GraphQL);

  return `
    export { default as useDeepCompareCallback } from './useDeepCompareCallback';
    export { default as useDeepCompareEffect } from './useDeepCompareEffect';
    export * from './useHeader';
    export { default as useTheme } from './useTheme';
    export { default as useAppState } from './useAppState';
    export { default as useAsyncStorage } from './useAsyncStorage';
    export { default as useBackHandler } from './useBackHandler';
    export { default as useKeyboard } from './useKeyboard';
    export { default as usePrevious } from './usePrevious';
    export { default as useTimeout } from './useTimeout';

    ${isGraphQL ? "export { default as useQueryWithCancelToken } from './useQueryWithCancelToken';" : ''}
    ${isGraphQL ? "export { default as useLazyQueryWithCancelToken } from './useLazyQueryWithCancelToken';" : ''}
    ${isGraphQL ? "export { default as useMutationWithCancelToken } from './useMutationWithCancelToken';" : ''}
    ${isGraphQL ? "export { default as useSubscriptionWithCancelToken } from './useSubscriptionWithCancelToken';" : ''}
  `;
};
