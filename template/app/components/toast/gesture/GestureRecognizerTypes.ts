/**
 *
 */
export const GestureRecognizerTypesTemplate = (): string => {
  return `
    import type {
      PanResponderGestureState,
      PanResponderInstance,
      StyleProp,
      ViewStyle
    } from 'react-native';

    /**
     * An enum that represents the four directions that a swipe can be.
     */
    export enum SwipeDirectionsEnum {
      SWIPE_UP,
      SWIPE_DOWN,
      SWIPE_LEFT,
      SWIPE_RIGHT
    }

    /**
     * The type of the config object.
     * @typedef {object} ConfigPropsType
     * @property {number} velocityThreshold - The velocity threshold for a swipe to be considered a swipe.
     * @property {number} directionalOffsetThreshold - The directional offset threshold for a swipe to be considered a swipe.
     * @property {number} gestureIsClickThreshold - The threshold for a gesture to be considered a click.
     */
    export type ConfigPropsType = Required<{
      velocityThreshold: number;
      directionalOffsetThreshold: number;
      gestureIsClickThreshold: number;
    }>;

    /**
     * A gesture recognizer that detects swipes.
     * @param {GestureRecognizerPropsType} props - The props for the gesture recognizer.
     * @returns None
     */
    export type GestureRecognizerPropsType = Partial<{
      config: ConfigPropsType;
      style: StyleProp<ViewStyle>;
      onSwipe: (
        swipeDirection: SwipeDirectionsEnum | null | undefined,
        gestureState: PanResponderGestureState
      ) => void;
      onSwipeUp: (gestureState: PanResponderGestureState) => void;
      onSwipeDown: (gestureState: PanResponderGestureState) => void;
      onSwipeLeft: (gestureState: PanResponderGestureState) => void;
      onSwipeRight: (gestureState: PanResponderGestureState) => void;
    }>;

    /**
     * A React component that handles swiping gestures.
     * @param {SwipeHandlerPropsType} props - The props for the SwipeHandler component.
     * @returns None
     */
    export type SwipeHandlerPropsType = {
      swipeDirection?: SwipeDirectionsEnum | null;
      gestureState: PanResponderGestureState;
      onSwipe?: (
        swipeDirection: SwipeDirectionsEnum | null | undefined,
        gestureState: PanResponderGestureState
      ) => void;
      onSwipeUp?: (gestureState: PanResponderGestureState) => void;
      onSwipeDown?: (gestureState: PanResponderGestureState) => void;
      onSwipeLeft?: (gestureState: PanResponderGestureState) => void;
      onSwipeRight?: (gestureState: PanResponderGestureState) => void;
    };

    /**
     * Returns a PanResponder instance that can be used to handle gestures on a component.
     * @returns {UseGestureRecognizerReturnType}
     */
    export type UseGestureRecognizerReturnType = Required<{
      panResponder: PanResponderInstance;
    }>;
  `;
};
