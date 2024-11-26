/**
 *
 */
export const AppRequestInitialTemplate = (): string => {
  return `
    /**
     * The state of the app request process.
     * @typedef {Object} AppRequestStateType
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    export interface AppRequestStateType {}

    /**
     * Defining the initial state of the app request reducer.
     * @returns {AppRequestStateType} The initial state of the app request reducer.
     */
    export const INITIAL_STATE: AppRequestStateType = {};

    export const AppRequestSliceName: string = 'appRequest';
  `;
};
