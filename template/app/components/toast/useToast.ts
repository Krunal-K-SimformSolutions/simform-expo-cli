/**
 *
 */
export const UseToastTemplate = (): string => {
  return `
    import { isEmpty } from 'lodash';
    import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
    import {
      Easing,
      useAnimatedStyle,
      useSharedValue,
      withSpring,
      withTiming
    } from 'react-native-reanimated';
    import { useSafeAreaInsets } from 'react-native-safe-area-context';
    import { StaticDataConst } from '../../constants';
    import { useHeaderHeight, useKeyboard, useStatusBarHeight, useTimeout } from '../../hooks';
    import { Colors, globalMetrics, scale } from '../../themes';
    import { ToastType } from '../../types';
    import {
      type ToastHandleType,
      type InternalDataPropsType,
      type UseToastReturnType,
      type ToastPosition,
      type ColorType,
      type ToastIconType
    } from './ToastTypes';
    import { callback } from './ToastUtil';
    import type { ThemeMode } from '../../themes';
    import type React from 'react';
    import type {
      LayoutChangeEvent,
      LayoutRectangle,
      PanResponderGestureState,
      ViewStyle
    } from 'react-native';
    import type { EdgeInsets } from 'react-native-safe-area-context';

    /**
     * Gets the minimum height of the toast based on the position of the toast.
     * @param {ToastPosition} toastPosition - the position of the toast
     * @param {number} headerHeight - the height of the header
     * @param {number} statusBarHeight - the height of the status bar
     * @param {number} keyboardHeight - the height of the keyboard
     * @param {LayoutRectangle} layout - the layout of the view
     * @param {boolean} shown - whether the toast is shown
     * @param {boolean} translucent - whether the status bar is translucent
     * @returns {number} the minimum height of the
     */
    function getMinHeight(
      toastPosition: ToastPosition,
      headerHeight: number,
      statusBarHeight: number,
      keyboardHeight: number,
      layout: LayoutRectangle,
      shown: boolean,
      translucent: boolean,
      verticalScale: (size: number) => number,
      insets: EdgeInsets
    ): number {
      let minHeight = 0;
      if (toastPosition === 'top') {
        minHeight = headerHeight + (translucent ? statusBarHeight : 0);
      } else {
        const viewHeight = layout.height + statusBarHeight;
        minHeight = shown ? keyboardHeight + statusBarHeight : viewHeight;
      }
      minHeight += globalMetrics.isAndroid ? verticalScale(50) : 0;
      const safeAreaSize = insets.top + insets.bottom;
      return minHeight + safeAreaSize;
    }

    /**
     * A custom toast hook that returns the data and offset values for the toast.
     * @param {boolean} translucent - Whether the toast is translucent or not.
     * @param {ToastPosition} toastPosition - The position of the toast.
     * @param {React.Ref<ToastHandleType>} ref - The ref to the toast.
     * @returns {UseToastReturnType} - The data and offset values for the toast.
     */
    export default function useToast(
      translucent: boolean,
      theme: ThemeMode,
      toastPosition: ToastPosition,
      ref: React.Ref<ToastHandleType>
    ): UseToastReturnType {
      const statusBarHeight: number = useStatusBarHeight();
      const insets: EdgeInsets = useSafeAreaInsets();
      const headerHeight: number = useHeaderHeight();
      const [data, setData] = useState<InternalDataPropsType | null>(null);
      const toastLifecycleRef = useRef<(isOpen: boolean) => void>();
      const [shown, , keyboardHeight] = useKeyboard();
      const [layout, setLayout] = useState<LayoutRectangle>({ x: 0, y: 0, height: 0, width: 0 });
      const [minHeight, setMinHeight] = useState(
        getMinHeight(
          toastPosition,
          headerHeight,
          statusBarHeight,
          keyboardHeight,
          layout,
          shown,
          translucent,
          scale,
          insets
        )
      );
      const offset = useSharedValue(toastPosition === 'top' ? -minHeight : minHeight);
      const opacity = useSharedValue(0);

      const toastHide = useCallback<(duration: number) => void>(
        (duration: number) => {
          offset.value = withTiming(
            toastPosition === 'top' ? -minHeight : minHeight,
            {
              duration: duration,
              easing: Easing.out(Easing.exp)
            },
            (isFinished?: boolean) => callback(isFinished, setData)
          );
          opacity.value = withTiming(0, {
            duration: duration,
            easing: Easing.out(Easing.linear)
          });
        },
        [minHeight, offset, opacity, toastPosition]
      );

      const toastShow = useCallback<(duration: number, height?: number) => void>(
        (duration: number, height?: number) => {
          offset.value = withTiming(toastPosition === 'top' ? 0 : -(height ?? minHeight), {
            duration: duration,
            easing: Easing.out(Easing.exp)
          });
          opacity.value = withTiming(1, {
            duration: duration / 2,
            easing: Easing.out(Easing.linear)
          });
        },
        [minHeight, offset, opacity, toastPosition]
      );

      const handlerSwipeUp = useCallback<
        (gestureState: PanResponderGestureState) => void | undefined | null
      >(() => {
        if (data?.interval !== 0) {
          toastHide(0);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [data?.interval, minHeight, offset, opacity, toastPosition]);

      const handleHideToast = useCallback<() => void>(() => {
        toastHide(700);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [minHeight, offset, opacity, toastPosition]);

      const handleLayout = useCallback<(event: LayoutChangeEvent) => void>(
        (event: LayoutChangeEvent) => {
          setLayout(event.nativeEvent.layout);
        },
        []
      );

      useEffect(() => {
        const localMinHeight = getMinHeight(
          toastPosition,
          headerHeight,
          statusBarHeight,
          keyboardHeight,
          layout,
          shown,
          translucent,
          scale,
          insets
        );
        if (isEmpty(data)) {
          setMinHeight(localMinHeight);
          offset.value = toastPosition === 'top' ? -localMinHeight : localMinHeight;
        } else {
          toastShow(50, localMinHeight);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [toastPosition, shown, layout, keyboardHeight, translucent, data]);

      useTimeout(() => toastLifecycleRef.current?.(false), isEmpty(data) ? 1000 : undefined);

      useTimeout(handleHideToast, data?.interval !== 0 ? data?.interval : undefined);

      useImperativeHandle(ref, () => ({
        /**
         * Displays a toast with the specified data.
         * @param {InternalDataPropsType} newData - The data for the new toast.
         */
        toastWithType: (newData: InternalDataPropsType): void => {
          if (data === null || data === undefined || newData?.interval !== 0) {
            setData(newData);
            toastShow(700);
          }
        },
        /**
         * Allows observation of the toast's lifecycle by setting a callback function.
         * The callback receives a boolean indicating whether the toast is open.
         * Initializes the callback with \`false\` to signal that the toast is initially closed.
         * @param {Function} argCallback - A callback function that takes a boolean parameter \`isOpen\`.
         */
        toastLifecycle: (argCallback: (isOpen: boolean) => void): void => {
          toastLifecycleRef.current = argCallback;
          argCallback(false);
        },
        /**
         * Clears the toast.
         */
        clearToast: (): void => {
          toastHide(0);
        }
      }));

      const customSpringStyles = useAnimatedStyle<ViewStyle>(() => {
        return {
          position: 'absolute',
          left: 0,
          right: 0,
          ...(toastPosition ? { [toastPosition]: 0 } : {}),
          transform: [
            {
              translateY: withSpring(offset.value, {
                damping: 20,
                stiffness: 90
              })
            }
          ],
          opacity: opacity.value
        };
      });

      const containerStyle: ViewStyle = useMemo(
        () => ({
          height: minHeight,
          justifyContent: 'flex-end'
        }),
        [minHeight]
      );

      const isShowView: boolean = !isEmpty(data?.message);
      const isNoInternet: boolean = data?.interval === 0;
      const selectedColor: ColorType = Colors[theme]?.toast[data?.type ?? ToastType.success];
      const SelectedIcon: ToastIconType = StaticDataConst.toastIcons[data?.type ?? ToastType.success];

      return {
        data,
        handlerSwipeUp,
        handleLayout,
        handleHideToast,
        containerStyle,
        customSpringStyles,
        isShowView,
        isNoInternet,
        selectedColor,
        SelectedIcon
      };
    }
  `;
};
