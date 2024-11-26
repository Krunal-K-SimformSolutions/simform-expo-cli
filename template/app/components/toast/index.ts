export * from './gesture/index.js';
export * from './Toast.js';
export * from './ToastHolder.js';
export * from './ToastStyle.js';
export * from './ToastTypes.js';
export * from './ToastUtil.js';
export * from './useToast.js';

/**
 *
 */
export const ToastIndexTemplate = (): string => {
  return `
    export { default as Toast } from './Toast';
    export { default as ToastHolder } from './ToastHolder';
    export {
      type ToastHandleType,
      type InternalDataPropsType,
      type ToastIconType
    } from './ToastTypes';
  `;
};
