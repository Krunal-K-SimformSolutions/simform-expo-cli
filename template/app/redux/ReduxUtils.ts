export const ReduxUtilsTemplate = (): string => {
  return `
    import type { RootStateType } from './Store';

    /**
     * Returns the state of the Redux store.
     * @returns {RootStateType} The state of the Redux store.
     */
    export function getStorage(): RootStateType | undefined | null {
      return require('../redux/Store')?.default?.store?.getState?.();
    }
  `;
};
