export * from './SignInRequest.js';
export * from './UserResponse.js';
export * from './ToastType.js';

/**
 *
 */
export const TypeTemplate = (): string => {
  return `
    export * from './SignInRequest';
    export * from './UserResponse';
    export * from './ToastType';
  `;
};
