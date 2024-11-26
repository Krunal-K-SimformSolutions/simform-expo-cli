/**
 *
 */
export const UseGestureRecognizerTemplate = (): string => {
  return `
    import { useCallback, useMemo, useState } from 'react';
    import {
      type GestureResponderEvent,
      PanResponder,
      type PanResponderGestureState,
      type PanResponderInstance
    } from 'react-native';
    import { useDeepCompareEffect, usePrevious } from '../../../hooks';
    import {
      swipeConfig,
      setClassSwipeConfig,
      handlePanResponderEnd,
      handleShouldSetPanResponder
    } from './GestureRecognizerUtil';
    import type {
      ConfigPropsType,
      GestureRecognizerPropsType,
      UseGestureRecognizerReturnType
    } from './GestureRecognizerTypes';

    /**
     * A hook that returns a PanResponder instance that can be used to handle swipe gestures.
     * @param {GestureRecognizerPropsType} props - The props that are passed to the hook.
     * @returns {UseGestureRecognizerReturnType} - The PanResponder instance.
     */
    export default function useGestureRecognizer({
      config,
      onSwipe,
      onSwipeUp,
      onSwipeDown,
      onSwipeLeft,
      onSwipeRight
    }: GestureRecognizerPropsType): UseGestureRecognizerReturnType {
      const [gestureData, setGestureData] = useState<{
        evt: GestureResponderEvent;
        gestureState: PanResponderGestureState;
      } | null>(null);

      const prevConfig: ConfigPropsType | undefined = usePrevious<ConfigPropsType | undefined>(config);

      const shouldSetResponder = useCallback<
        (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => boolean
      >((evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        return handleShouldSetPanResponder(evt, gestureState);
      }, []);

      const responderEnd = useCallback<
        (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => void
      >((evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        setGestureData({ evt, gestureState });
      }, []);

      const panResponder = useMemo<PanResponderInstance>(
        () =>
          PanResponder.create({
            onStartShouldSetPanResponder: shouldSetResponder,
            onMoveShouldSetPanResponder: shouldSetResponder,
            onPanResponderRelease: responderEnd,
            onPanResponderTerminate: responderEnd
          }),
        [shouldSetResponder, responderEnd]
      );

      useDeepCompareEffect(() => {
        if (gestureData) {
          const { gestureState } = gestureData;
          handlePanResponderEnd({
            gestureState,
            onSwipe,
            onSwipeUp,
            onSwipeDown,
            onSwipeLeft,
            onSwipeRight
          });
          setGestureData(null);
        }
      }, [gestureData, onSwipe, onSwipeDown, onSwipeLeft, onSwipeRight, onSwipeUp]);

      useDeepCompareEffect(() => {
        if (config !== prevConfig) {
          setClassSwipeConfig(Object.assign(swipeConfig, config));
        }
      }, [config, prevConfig]);

      useDeepCompareEffect(() => {
        setClassSwipeConfig(Object.assign(swipeConfig, config));
      }, [config]);

      return { panResponder };
    }
  `;
};
