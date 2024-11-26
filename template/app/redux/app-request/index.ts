export * from './AppRequestInitial.js';
export * from './AppRequestSlice.js';
export * from './AppRequestSelector.js';

/**
 *
 */
export const AppRequestTemplate = (): string => {
  return `
    export { AppRequestReducer, AppRequestActions } from './AppRequestSlice';
    export { default as AppRequestSelectors } from './AppRequestSelector';
    export { AppRequestSliceName } from './AppRequestInitial';
  `;
};
