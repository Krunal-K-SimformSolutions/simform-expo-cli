/**
 *
 */
export const ReduxUtilsTemplate = (): string => {
  return `
    import type { RootStateType } from './Store';

    /**
     * Returns the state of the Redux store.
     * @returns {RootStateType} The state of the Redux store.
     */
    export function getStorage(): RootStateType | undefined | null {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      return require('../redux/Store')?.default?.store?.getState?.();
    }
  `;
};
