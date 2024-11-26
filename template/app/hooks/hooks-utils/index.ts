export * from './useDeepCompareMemoize.js';

/**
 *
 */
export const HooksUtilTemplate = (): string => {
  return `
    export { checkDeps, default as useDeepCompareMemoize } from './useDeepCompareMemoize';
  `;
};
