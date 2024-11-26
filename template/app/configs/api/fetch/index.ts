export * from './FetchAPIConfig.js';
export * from './FetchAPITypes.js';

/**
 *
 */
export const FetchTemplate = (): string => {
  return `
    export { fetchApiWithCancelToken } from './FetchAPIConfig';
    export type { FetchMethod, ApiFetchResponse } from './FetchAPITypes';
  `;
};
