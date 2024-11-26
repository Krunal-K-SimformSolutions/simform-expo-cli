/**
 *
 */
export const AppRequestSelectorTemplate = (): string => {
  return `
    import { type AppRequestStateType, AppRequestSliceName } from './AppRequestInitial';
    import type { RootStateType } from '../Store';

    /**
     * The selector for the app request state.
     */
    const getAppRequest = (state: RootStateType): AppRequestStateType => state[AppRequestSliceName];

    /**
     * A type that contains the selectors for the AppRequest reducer.
     * @typedef {Object} AppRequestSelectorsType
     * @property {(state: RootStateType) => AppRequestStateType} getAppRequest - The selector for the AppRequest reducer.
     */
    interface AppRequestSelectorsType {
      getAppRequest: (state: RootStateType) => AppRequestStateType;
    }

    /**
     * A type that contains the selectors for the AppRequest reducer.
     * @type {AppRequestSelectorsType}
     */
    const AppRequestSelectors: AppRequestSelectorsType = {
      getAppRequest
    };

    export default AppRequestSelectors;
  `;
};
