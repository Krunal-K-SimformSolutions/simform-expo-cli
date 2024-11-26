/**
 *
 */
export const ToastTypeTemplate = (): string => {
  return `
    export enum ToastType {
      fail = 'fail',
      success = 'success',
      warning = 'warning',
      info = 'info',
      custom = 'custom'
    }
  `;
};
