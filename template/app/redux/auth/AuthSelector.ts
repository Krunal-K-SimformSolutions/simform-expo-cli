/**
 *
 */
export const AuthSelectorTemplate = (): string => {
  return `
    import { createDraftSafeSelector } from '@reduxjs/toolkit';
    import { UserResponse } from '../../types';
    import { type AuthStateType, AuthSliceName } from './AuthInitial';
    import type { RootStateType } from '../Store';

    /**
     * The selector for the auth state.
     */
    const getAuth = (state: RootStateType): AuthStateType => state[AuthSliceName];

    /**
     * A type that contains all the selectors for the auth state.
     * @typedef {Object} AuthSelectorsType
     * @property {(state: RootStateType) => boolean} getLoading - The selector for the loading state.
     * @property {(state: RootStateType) => UserResponse} getUser - The selector for the user.
     */
    interface AuthSelectorsType {
      getLoading: (state: RootStateType) => boolean;
      getUser: (state: RootStateType) => UserResponse;
    }

    /**
     * A type that contains the selectors for the auth state.
     * @type {AuthSelectorsType}
     */
    const AuthSelectors: AuthSelectorsType = {
      getLoading: createDraftSafeSelector(getAuth, (auth) => auth.loading),
      getUser: createDraftSafeSelector(getAuth, (auth) => auth.user ?? ({} as UserResponse))
    };

    export default AuthSelectors;
  `;
};
