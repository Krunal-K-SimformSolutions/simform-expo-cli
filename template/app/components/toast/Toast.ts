/**
 *
 */
export const ToastTemplate = (): string => {
  return `
    import { isEmpty } from 'lodash';
    import React, { forwardRef } from 'react';
    import { StyleSheet, View, Pressable } from 'react-native';
    import Animated from 'react-native-reanimated';
    import { useTheme } from '../../hooks';
    import { Colors, scale } from '../../themes';
    import { ToastType } from '../../types';
    import { CustomText } from '../custom-text';
    import { GestureRecognizer } from './gesture';
    import styles from './ToastStyle';
    import {
      defaultProps,
      type ToastHandleType,
      type ToastPropsType,
      type UseToastReturnType
    } from './ToastTypes';
    import useToast from './useToast';

    /**
     * A custom toast component that can be used to display messages to the user.
     * @param {ToastPropsType} props - The props for the toast component.
     * @param {React.Ref<ToastHandleType>} ref - The ref for the toast component.
     * @returns {React.ReactElement} A React Element.
     */
    const CustomToast = forwardRef<ToastHandleType, ToastPropsType>(
      (
        { translucent = defaultProps.translucent, numberOfLines, toastPosition },
        ref
      ): React.ReactElement => {
        const { theme } = useTheme();
        const {
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
        }: UseToastReturnType = useToast(translucent, theme, toastPosition, ref);

        return (
          <Animated.View style={customSpringStyles}>
            {isShowView && (
              <View style={containerStyle}>
                <View
                  style={StyleSheet.flatten([
                    styles.contentContainerStyle,
                    {
                      borderTopColor: selectedColor.primary,
                      backgroundColor: selectedColor.secondary
                    }
                  ])}
                  onLayout={handleLayout}
                >
                  <View style={data?.type === ToastType.fail && styles.failIcon}>
                    <SelectedIcon.Type
                      height={scale(20)}
                      width={scale(20)}
                      color={selectedColor.primary}
                    />
                  </View>
                  <View style={styles.contentStyle}>
                    {!isEmpty(data?.title) && (
                      <CustomText variant="semiBold16" numberOfLines={1} color={selectedColor.primary}>
                        {data?.title}
                      </CustomText>
                    )}
                    {!isEmpty(data?.message) && (
                      <CustomText
                        variant="medium14"
                        numberOfLines={numberOfLines}
                        color={Colors[theme]?.text?.textPrimary}
                      >
                        {data?.message}
                      </CustomText>
                    )}
                  </View>
                  {!isNoInternet && (
                    <Pressable style={styles.removeCenter} onPress={handleHideToast}>
                      <SelectedIcon.Close
                        height={scale(20)}
                        width={scale(20)}
                        color={Colors[theme]?.text?.textSecondary}
                      />
                    </Pressable>
                  )}
                </View>
                <GestureRecognizer
                  style={StyleSheet.flatten([styles.absoluteView, containerStyle])}
                  onSwipeUp={handlerSwipeUp}
                />
              </View>
            )}
          </Animated.View>
        );
      }
    );

    export default CustomToast;
  `;
};
