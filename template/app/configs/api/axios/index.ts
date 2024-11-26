export * from './AxiosAPIConfig.js';
export * from './AxiosAPITypes.js';

/**
 *
 */
export const AxiosTemplate = (): string => {
  return `
    export { axiosApiWithCancelToken } from './AxiosAPIConfig';
    export type { AxiosMethod, ApiAxiosResponse } from './AxiosAPITypes';
  `;
};
