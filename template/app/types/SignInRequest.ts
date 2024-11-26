/**
 *
 */
export const SignInRequestTemplate = (): string => {
  return `
    /**
     * Represents the request of a sign in API.
     */
    export interface SignInRequest {
      email?: string;
      password?: string;
    }
  `;
};
