export * from './SignInRequest.js';
export * from './UserResponse.js';

export const TypeTemplate = (): string => {
  return `
    export * from './SignInRequest';
    export * from './UserResponse';
  `;
};
