/**
 *
 */
export const SessionUtilsTemplate = (): string => {
  return `
    import { AppConst, StringConst } from '../constants';
    import { getStorageItem, setStorageItem, removeStorageItem } from './AsyncStorageUtils';
    import { formatString } from './StringUtils';

    export type Token = string;

    export type AuthTokens = {
      accessToken: Token;
      refreshToken: Token;
    };

    const STORAGE_KEY: string = \`auth-tokens-\${AppConst.environment}\`;

    /**
     *  Returns the refresh and access tokens
     * @returns {AuthTokens | undefined} Object containing refresh and access tokens
     */
    export const getAuthTokens = async (): Promise<AuthTokens | undefined> => {
      const rawTokens: string | undefined = await getStorageItem<string>(STORAGE_KEY, '{}');
      if (!rawTokens) return;

      try {
        // parse stored tokens JSON
        return JSON.parse(rawTokens);
      } catch {
        throw new Error(formatString(StringConst.ApiError.invalidAuthToken, { token: rawTokens }));
      }
    };

    /**
     * Returns the stored refresh token
     * @returns {Token | undefined} Refresh token
     */
    export const getRefreshToken = async (): Promise<Token | undefined> => {
      const tokens: AuthTokens | undefined = await getAuthTokens();
      return tokens ? tokens.refreshToken : undefined;
    };

    /**
     * Returns the stored access token
     * @returns {Token | undefined} Access token
     */
    export const getAccessToken = async (): Promise<Token | undefined> => {
      const tokens: AuthTokens | undefined = await getAuthTokens();
      return tokens ? tokens.accessToken : undefined;
    };

    /**
     * Checks if refresh tokens are stored
     * @returns {boolean} Whether the user is logged in or not
     */
    export const isLoggedIn = async (): Promise<boolean> => {
      const token: Token | undefined = await getRefreshToken();
      return !!token;
    };

    /**
     * Sets the access and refresh tokens
     * @param {AuthTokens} tokens - Access and Refresh tokens
     * @returns {void}
     */
    export const setAuthTokens = (tokens: AuthTokens): Promise<void> =>
      setStorageItem(STORAGE_KEY, JSON.stringify(tokens));

    /**
     * Sets the access token
     * @param {Token} token - Access token
     * @returns {void}
     */
    export const setAccessToken = async (token: Token): Promise<void> => {
      let tokens: AuthTokens | undefined = await getAuthTokens();
      if (!tokens) {
        tokens = {
          accessToken: '',
          refreshToken: ''
        };
      }

      tokens.accessToken = token;
      return setAuthTokens(tokens);
    };

    /**
     * Sets the refresh token
     * @param {Token} token - Access token
     * @returns {void}
     */
    export const setRefreshToken = async (token: Token): Promise<void> => {
      let tokens: AuthTokens | undefined = await getAuthTokens();
      if (!tokens) {
        tokens = {
          accessToken: '',
          refreshToken: ''
        };
      }

      tokens.refreshToken = token;
      return setAuthTokens(tokens);
    };

    /**
     * Clears both tokens
     * @returns {void}
     */
    export const clearAuthTokens = (): Promise<void> => removeStorageItem(STORAGE_KEY);
  `;
};
