export * from './AwsAPIConfig.js';
export * from './AwsAPITypes.js';

/**
 *
 */
export const AwsTemplate = (): string => {
  return `
    export { awsApiConfig, awsApiWithCancelToken } from './AwsAPIConfig';
    export type { AwsMethod, ApiAwsResponse } from './AwsAPITypes';
  `;
};
