export * from './GestureRecognizer.js';
export * from './GestureRecognizerTypes.js';
export * from './GestureRecognizerUtil.js';
export * from './useGestureRecognizer.js';

/**
 *
 */
export const GestureTemplate = (): string => {
  return `
    export { default as GestureRecognizer } from './GestureRecognizer';
  `;
};
