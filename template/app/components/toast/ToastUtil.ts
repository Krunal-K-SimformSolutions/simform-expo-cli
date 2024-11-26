/**
 *
 */
export const ToastUtilTemplate = (): string => {
  return `
    import { runOnJS } from 'react-native-reanimated';
    import type { InternalDataPropsType } from './ToastTypes';
    import type React from 'react';

    /**
     * A callback function that is called when the worklet finishes.
     * @param {boolean | undefined} isFinished - whether the worklet finished or not.
     * @param {React.Dispatch<React.SetStateAction<InternalDataPropsType | null>>} setData - a dispatch function that sets the internal data props.
     * @returns None
     */
    export function callback(
      isFinished: boolean | undefined,
      setData: React.Dispatch<React.SetStateAction<InternalDataPropsType | null>>
    ): void {
      'worklet';

      if (isFinished) {
        runOnJS(setData)(null);
      }
    }
  `;
};
