export * from './CloseWithCircleIcon.js';
export * from './ToastSuccessIcon.js';
export * from './ToastWarningIcon.js';

/**
 *
 */
export const SvgTemplate = (): string => {
  return `
    import CloseWithCircleIcon from './CloseWithCircleIcon';
    import ToastSuccessIcon from './ToastSuccessIcon';
    import ToastWarningIcon from './ToastWarningIcon';

    /**
     * A collection of svg images used by the project.
     */
    export default Object.freeze({
      CloseWithCircleIcon,
      ToastSuccessIcon,
      ToastWarningIcon
    });
  `;
};
