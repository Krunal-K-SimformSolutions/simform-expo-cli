import { QuestionAnswer, AppConstant } from '../../../src/index.js';

export * from './APIConst.js';
export * from './AppConst.js';
export * from './MockDataConst.js';
export * from './NavigationRoutesConst.js';
export * from './RegexConst.js';
export * from './StaticDataConst.js';
export * from './StorageKeyConst.js';
export * from './StoreActionConst.js';

/**
 *
 */
export const ConstantsTemplate = (): string => {
  const variables = QuestionAnswer.instance;

  const isAxios = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Axios);
  const isAWSAmplify = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.AWSAmplify);
  const isFetch = variables.isSupportApiMiddleware(AppConstant.ApiMiddleware.Fetch);

  return `
    ${isAxios || isAWSAmplify || isFetch ? "export * from './APIConst';" : ''}
    export { default as AppConst } from './AppConst';
    export { default as MockDataConst } from './MockDataConst';
    export * from './NavigationRoutesConst';
    export { default as RegexConst } from './RegexConst';
    export { default as StaticDataConst } from './StaticDataConst';
    export { default as StorageKeyConst } from './StorageKeyConst';
    ${isAxios || isAWSAmplify || isFetch ? "export { default as StoreActionConst } from './StoreActionConst';" : ''}
    export { default as StringConst } from './StringConst';
  `;
};
