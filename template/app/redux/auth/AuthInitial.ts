/**
 *
 */
export const AuthInitialTemplate = (): string => {
  return `
    import { UserResponse } from '../../types';

    /**
     * The state of the authentication process.
     * @typedef {Object} AuthStateType
     * @property {UserResponse | undefined} user - The user object if the user is authenticated.
     */
    export interface AuthStateType {
      loading: boolean;
      user?: UserResponse | null;
    }

    /**
     * Defining the initial state of the auth reducer.
     * @returns {AuthStateType} The initial state of the auth reducer.
     */
    export const INITIAL_STATE: AuthStateType = {
      loading: false,
      user: undefined
    };

    export const AuthSliceName: string = 'auth';
  `;
};
