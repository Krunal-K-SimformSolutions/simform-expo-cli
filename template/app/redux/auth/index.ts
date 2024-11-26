export * from './AuthInitial.js';
export * from './AuthSelector.js';
export * from './AuthSlice.js';

/**
 *
 */
export const AuthTemplate = (): string => {
  return `
    export { AuthReducer, AuthActions } from './AuthSlice';
    export { default as AuthSelectors } from './AuthSelector';
    export { AuthSliceName } from './AuthInitial';
  `;
};
