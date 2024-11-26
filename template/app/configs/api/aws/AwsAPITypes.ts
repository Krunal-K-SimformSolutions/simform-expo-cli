/**
 *
 */
export const AwsAPITypesTemplate = (): string => {
  return `
    import type { PROBLEM_CODE } from '../CommonTypes';
    import type { AxiosError, AxiosRequestConfig, AxiosResponse, AxiosResponseHeaders } from 'axios';

    /**
     * Type of method to support api call
     */
    export type AwsMethod =
      | 'get'
      | 'GET'
      | 'post'
      | 'POST'
      | 'put'
      | 'PUT'
      | 'patch'
      | 'PATCH'
      | 'del'
      | 'DEL'
      | 'head'
      | 'HEAD';

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

    export type ApiAwsResponse<T, U = T> = ApiErrorResponse<U> | ApiOkResponse<T>;
  `;
};
