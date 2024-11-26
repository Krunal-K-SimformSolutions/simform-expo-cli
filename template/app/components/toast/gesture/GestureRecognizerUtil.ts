/**
 *
 */
export const GestureRecognizerUtilTemplate = (): string => {
  return `
    import {
      SwipeDirectionsEnum,
      type ConfigPropsType,
      type SwipeHandlerPropsType
    } from './GestureRecognizerTypes';
    import type { GestureResponderEvent, PanResponderGestureState } from 'react-native';

    export const swipeConfig: ConfigPropsType = Object.freeze({
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
      gestureIsClickThreshold: 5
    });

    let classSwipeConfig: ConfigPropsType = swipeConfig;

    /**
     * Sets the class swipe config to the given config.
     * @param {ConfigPropsType} config - the config to set the class swipe config to.
     * @returns None
     */
    export function setClassSwipeConfig(config: ConfigPropsType): void {
      classSwipeConfig = config;
    }

    /**
     * If the velocity is greater than the velocity threshold and the directional offset is less than the
     * directional offset threshold, then return true.
     * @param {number} velocity - The velocity of the gesture.
     * @param {number} velocityThreshold - The minimum velocity required to trigger a swipe.
     * @param {number} directionalOffset - How far the user has swiped in the direction of the swipe.
     * @param {number} directionalOffsetThreshold - The maximum distance from the start point the gesture
     * can finish at for it to be considered a swipe.
     * @returns A boolean value.
     */
    function isValidSwipe(
      velocity: number,
      velocityThreshold: number,
      directionalOffset: number,
      directionalOffsetThreshold: number
    ): boolean {
      return (
        Math.abs(velocity) > velocityThreshold &&
        Math.abs(directionalOffset) < directionalOffsetThreshold
      );
    }

    /**
     * If the distance the user has moved their finger is less than the threshold, then it's a click
     * @param {PanResponderGestureState} gestureState - PanResponderGestureState
     * @returns A boolean value.
     */
    function gestureIsClick(gestureState: PanResponderGestureState): boolean {
      return (
        Math.abs(gestureState.dx) < classSwipeConfig.gestureIsClickThreshold &&
        Math.abs(gestureState.dy) < classSwipeConfig.gestureIsClickThreshold
      );
    }

    /**
     * Determines whether the gesture is a click.
     * @param {PanResponderGestureState} gestureState - the gesture state object
     * @returns {boolean} - whether the gesture is a click.
     */
    export function handleShouldSetPanResponder(
      evt: GestureResponderEvent,
      gestureState: PanResponderGestureState
    ): boolean {
      return evt.nativeEvent.touches.length === 1 && !gestureIsClick(gestureState);
    }

    /**
     * Triggers the swipe handlers for the given swipe direction.
     * @param {SwipeHandlerPropsType} props - The swipe handler props.
     * @returns None
     */
    function triggerSwipeHandlers({
      swipeDirection,
      gestureState,
      onSwipe,
      onSwipeUp,
      onSwipeDown,
      onSwipeLeft,
      onSwipeRight
    }: SwipeHandlerPropsType): void {
      const { SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN } = SwipeDirectionsEnum;
      onSwipe?.(swipeDirection, gestureState);
      switch (swipeDirection) {
        case SWIPE_LEFT:
          onSwipeLeft?.(gestureState);
          break;
        case SWIPE_RIGHT:
          onSwipeRight?.(gestureState);
          break;
        case SWIPE_UP:
          onSwipeUp?.(gestureState);
          break;
        case SWIPE_DOWN:
          onSwipeDown?.(gestureState);
          break;
        default:
      }
    }

    /**
     * Determines if the gesture is a valid horizontal swipe.
     * @param {PanResponderGestureState} gestureState - the gesture state object
     * @returns {boolean} - true if the gesture is a valid horizontal swipe, false otherwise
     */
    function isValidHorizontalSwipe(gestureState: PanResponderGestureState): boolean {
      const { vx, dy } = gestureState;
      const { velocityThreshold, directionalOffsetThreshold } = classSwipeConfig;
      return isValidSwipe(vx, velocityThreshold, dy, directionalOffsetThreshold);
    }

    /**
     * Determines if the gesture is a valid vertical swipe.
     * @param {PanResponderGestureState} gestureState - the gesture state object
     * @returns {boolean} - true if the gesture is a valid vertical swipe, false otherwise
     */
    function isValidVerticalSwipe(gestureState: PanResponderGestureState): boolean {
      const { vy, dx } = gestureState;
      const { velocityThreshold, directionalOffsetThreshold } = classSwipeConfig;
      return isValidSwipe(vy, velocityThreshold, dx, directionalOffsetThreshold);
    }

    /**
     * Returns the direction of the swipe.
     * @param {PanResponderGestureState} gestureState - the gesture state object
     * @returns {SwipeDirectionsEnum | null} - the direction of the swipe
     */
    function getSwipeDirection(gestureState: PanResponderGestureState): SwipeDirectionsEnum | null {
      const { SWIPE_LEFT, SWIPE_RIGHT, SWIPE_UP, SWIPE_DOWN } = SwipeDirectionsEnum;
      const { dx, dy } = gestureState;
      if (isValidVerticalSwipe(gestureState)) {
        return dy > 0 ? SWIPE_DOWN : SWIPE_UP;
      }
      if (isValidHorizontalSwipe(gestureState)) {
        return dx > 0 ? SWIPE_RIGHT : SWIPE_LEFT;
      }
      return null;
    }

    /**
     * Handles the end of a swipe gesture.
     * @param {SwipeHandlerPropsType} props - The props to use to handle the swipe.
     * @returns None
     */
    export function handlePanResponderEnd({
      gestureState,
      onSwipe,
      onSwipeUp,
      onSwipeDown,
      onSwipeLeft,
      onSwipeRight
    }: SwipeHandlerPropsType): void {
      const swipeDirection: SwipeDirectionsEnum | null = getSwipeDirection(gestureState);
      triggerSwipeHandlers({
        swipeDirection,
        gestureState,
        onSwipe,
        onSwipeUp,
        onSwipeDown,
        onSwipeLeft,
        onSwipeRight
      });
    }
  `;
};
