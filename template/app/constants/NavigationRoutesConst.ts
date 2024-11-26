export const NavigationRoutesConstTemplate = (): string => {
  return `
    /**
     * An enum of the possible routes in the application.
     */
    export enum ROUTES {
      Launch = 'Launch',
      Auth = 'Auth',
      Home = 'Home',

      // Launch Stack
      Welcome = 'Welcome',

      // Auth Stack
      SignIn = 'SignIn',

      // Other Stack
      NotFound = 'NotFound'
    }
  `;
};
