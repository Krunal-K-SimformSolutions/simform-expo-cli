/**
 *
 */
export const GestureRecognizerTemplate = (): string => {
  return `
    import React from 'react';
    import { View } from 'react-native';
    import useGestureRecognizer from './useGestureRecognizer';
    import type {
      GestureRecognizerPropsType,
      UseGestureRecognizerReturnType
    } from './GestureRecognizerTypes';

    /**
     * A React component that wraps a View and adds gesture recognition.
     * @param {GestureRecognizerPropsType} props - the props to pass to the GestureRecognizer component.
     * @returns {React.ReactElement} A React Element.
     */
    export default function GestureRecognizer({
      config,
      onSwipe,
      onSwipeUp,
      onSwipeDown,
      onSwipeLeft,
      onSwipeRight,
      ...viewProps
    }: GestureRecognizerPropsType): React.ReactElement {
      const { panResponder }: UseGestureRecognizerReturnType = useGestureRecognizer({
        config,
        onSwipe,
        onSwipeUp,
        onSwipeDown,
        onSwipeLeft,
        onSwipeRight
      });

      return <View {...viewProps} {...panResponder.panHandlers} />;
    }
  `;
};
