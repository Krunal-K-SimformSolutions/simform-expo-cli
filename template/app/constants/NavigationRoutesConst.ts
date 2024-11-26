/**
 *
 */
export const NavigationRoutesConstTemplate = (): string => {
  return `
    /**
     * An enum of the possible routes in the application.
     */
    export enum ROUTES {
      Modules = '/modules',
      NotFound = '/+not-found'
    }
  `;
};
