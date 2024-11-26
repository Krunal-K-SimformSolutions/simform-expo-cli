/**
 *
 */
export const ToastTypesTemplate = (): string => {
  return `
    import type { FC } from 'react';
    import type { PanResponderGestureState, LayoutChangeEvent, ViewStyle } from 'react-native';
    import type { SvgProps } from 'react-native-svg';
    import { ToastType } from '../../types';

    /**
     * The internal data properties for the extension.
     * @typedef {Object} InternalDataPropsType
     * @property {ToastType} type - The toast type variant to display
     * @property {string} [message] - The message to display in the popup.
     * @property {string} [title] - The title to display in the popup.
     * @property {number} [interval] - The interval to use for the popup.
     */
    export type InternalDataPropsType = {
      type: ToastType;
      title?: string;
      message: string;
      interval?: number;
    };

    /**
     * The position of the toast.
     */
    export type ToastPosition = 'top' | 'bottom';
    /**
     * The props for the Toast component.
     * @typedef {Object} ToastPropsType
     * @property {boolean} [translucent=false] - Whether the toast should be translucent.
     * @property {number} [numberOfLines=1] - The number of lines to show in the toast.
     * @property {ToastPosition} toastPosition - The position of the toast.
     */
    export type ToastPropsType = {
      translucent?: boolean;
      numberOfLines?: number;
      toastPosition: ToastPosition;
    };

    export const defaultProps = {
      translucent: true
    };

    /**
     * A type that represents the ToastHandle object.
     * @typedef {object} ToastHandleType
     * @property {function} clearToast - A function that clears the toast.
     * @property {function} toastWithType - A function that displays a toast.
     * @property {function} toastLifecycle - A function that allows you to observe the lifecycle of the toast.
     */
    export type ToastHandleType = Required<{
      clearToast: () => void;
      toastWithType: (newData: InternalDataPropsType) => void;
      toastLifecycle: (callback: (isOpen: boolean) => void) => void;
    }>;

    /**
     * A hook that returns the data and offset values needed to create a toast.
     * @returns {UseToastReturnType}
     */
    export type UseToastReturnType = {
      data: InternalDataPropsType | null;
      handlerSwipeUp: (gestureState: PanResponderGestureState) => void | undefined | null;
      handleLayout: (event: LayoutChangeEvent) => void;
      handleHideToast: () => void;
      containerStyle: ViewStyle;
      customSpringStyles: ViewStyle;
      isShowView: boolean;
      isNoInternet: boolean;
      selectedColor: ColorType;
      SelectedIcon: ToastIconType;
    };

    export type ColorType = {
      primary?: string;
      secondary?: string;
    };

    export type ToastIconType = {
      Close: FC<SvgProps>;
      Type: FC<SvgProps>;
    };
  `;
};
