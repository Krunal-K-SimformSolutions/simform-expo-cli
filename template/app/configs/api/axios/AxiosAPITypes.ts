/**
 *
 */
export const AxiosAPITypesTemplate = (): string => {
  return `
    import type { PROBLEM_CODE } from '../CommonTypes';
    import type { AxiosError, AxiosRequestConfig, AxiosResponse, AxiosResponseHeaders } from 'axios';

    export type AxiosMethod =
      | 'get'
      | 'GET'
      | 'post'
      | 'POST'
      | 'put'
      | 'PUT'
      | 'patch'
      | 'PATCH'
      | 'head'
      | 'HEAD'
      | 'delete'
      | 'DELETE'
      | 'options'
      | 'OPTIONS'
      | 'purge'
      | 'PURGE'
      | 'link'
      | 'LINK'
      | 'unlink'
      | 'UNLINK';

    export interface BaseApiResponse<T> {
      problem: PROBLEM_CODE | null;
      originalError?: AxiosError | null;
      originalResponse?: AxiosResponse | null;

      data?: T;
      status?: number;
      headers?:
        | AxiosResponseHeaders
        | Partial<
            Record<string, string> & {
              'set-cookie'?: string[] | undefined;
            }
          >;
      config?: AxiosRequestConfig;
      duration?: number;
    }

    export type ApiErrorResponse<T> = {
      ok: false;
    } & BaseApiResponse<T>;

    export type ApiOkResponse<T> = {
      ok: true;
    } & BaseApiResponse<T>;

    export type ApiAxiosResponse<T, U = T> = ApiErrorResponse<U> | ApiOkResponse<T>;
  `;
};
