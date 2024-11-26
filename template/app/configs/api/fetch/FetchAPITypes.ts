/**
 *
 */
export const FetchAPITypesTemplate = (): string => {
  return `
    import type { PROBLEM_CODE } from '../CommonTypes';

    export type FetchMethod =
      | 'GET'
      | 'POST'
      | 'PUT'
      | 'PATCH'
      | 'HEAD'
      | 'DELETE'
      | 'OPTIONS'
      | 'PURGE'
      | 'LINK'
      | 'UNLINK';

    export interface BaseApiResponse<T> {
      problem: PROBLEM_CODE | null;
      originalError?: Response | null;
      originalResponse?: Response | null;

      data?: T;
      status?: number;
      headers?: Headers;
      config?: never;
      duration?: number;
    }

    export type ApiErrorResponse<T> = {
      ok: false;
    } & BaseApiResponse<T>;

    export type ApiOkResponse<T> = {
      ok: true;
    } & BaseApiResponse<T>;

    export type ApiFetchResponse<T, U = T> = ApiErrorResponse<U> | ApiOkResponse<T>;

    export type BodyInit = BodyInit_ | Omit<_SourceUri, 'uri'>;
    export type RequestInit_ = RequestInit | Omit<_SourceUri, 'uri'>;
  `;
};
