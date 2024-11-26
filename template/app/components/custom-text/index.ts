export * from './CustomText.js';
export * from './CustomTextTypes.js';
export * from './CustomTextStyles.js';

/**
 *
 */
export const CustomTextIndexTemplate = (): string => {
  return `
    export { default as CustomText } from './CustomText';
    export * from './CustomTextTypes';
  `;
};
