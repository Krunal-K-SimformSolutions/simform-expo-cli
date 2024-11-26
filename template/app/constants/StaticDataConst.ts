export const StaticDataConstTemplate = (): string => {
  return `
    import { Svgs } from '../assets';
    import { ToastType, type ToastIconType } from '../components';

    const toastIcons: Record<ToastType, ToastIconType> = {
      [ToastType.fail]: {
        Close: Svgs.CloseWithCircleIcon,
        Type: Svgs.ToastWarningIcon
      },
      [ToastType.success]: {
        Close: Svgs.CloseWithCircleIcon,
        Type: Svgs.ToastSuccessIcon
      },
      [ToastType.warning]: {
        Close: Svgs.CloseWithCircleIcon,
        Type: Svgs.ToastWarningIcon
      },
      [ToastType.info]: {
        Close: Svgs.CloseWithCircleIcon,
        Type: Svgs.ToastWarningIcon
      },
      [ToastType.custom]: {
        Close: Svgs.CloseWithCircleIcon,
        Type: Svgs.ToastWarningIcon
      }
    };

    /**
     * A collection of static data used by the project.
     */
    export default Object.freeze({
      toastIcons
    });
  `;
};
