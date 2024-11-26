/**
 *
 */
export const UseKeyboardTemplate = (): string => {
  return `
    import { useEffect, useState } from 'react';
    import { Keyboard, type KeyboardEvent, type KeyboardMetrics } from 'react-native';

    const emptyCoordinates: KeyboardMetrics = Object.freeze({
      screenX: 0,
      screenY: 0,
      width: 0,
      height: 0
    });

    const initialValue = {
      start: emptyCoordinates,
      end: emptyCoordinates
    };

    /**
     * A type that represents the coordinates of a selection.
     * @typedef {object} CoordinatesType
     * @property {KeyboardMetrics} [start] - The coordinates of the start of the selection.
     * @property {KeyboardMetrics} [end] - The coordinates of the end of the selection.
     */
    interface CoordinatesType {
      start?: KeyboardMetrics;
      end?: KeyboardMetrics;
    }

    /**
     * keyboard hook that returns the keyboard state.
     * @returns [boolean, CoordinatesType, number] - The keyboard state.
     */
    export default function useKeyboard(): [boolean, CoordinatesType, number] {
      const [shown, setShown] = useState(false);
      const [coordinates, setCoordinates] = useState<CoordinatesType>(initialValue);
      const [keyboardHeight, setKeyboardHeight] = useState(0);

      /**
       * Handles the keyboardWillShow event.
       * @param {KeyboardEvent} e - the keyboard event object
       * @returns None
       */
      function handleKeyboardWillShow(e: KeyboardEvent): void {
        setCoordinates({ start: e.startCoordinates, end: e.endCoordinates });
      }
      /**
       * Handles the keyboardDidShow event.
       * @param {KeyboardEvent} e - the keyboard event object
       * @returns None
       */
      function handleKeyboardDidShow(e: KeyboardEvent): void {
        setShown(true);
        setCoordinates({ start: e.startCoordinates, end: e.endCoordinates });
        setKeyboardHeight(e.endCoordinates.height);
      }
      /**
       * Handles the keyboardWillHide event.
       * @param {KeyboardEvent} e - the keyboard event object
       * @returns None
       */
      function handleKeyboardWillHide(e: KeyboardEvent): void {
        setCoordinates({ start: e.startCoordinates, end: e.endCoordinates });
      }
      /**
       * Handles the keyboard hiding event.
       * @param {KeyboardEvent} e - the keyboard event object
       * @returns None
       */
      function handleKeyboardDidHide(e: KeyboardEvent): void {
        setShown(false);
        if (e) {
          setCoordinates({ start: e.startCoordinates, end: e.endCoordinates });
        } else {
          setCoordinates(initialValue);
          setKeyboardHeight(0);
        }
      }

      useEffect(() => {
        const subscriptions = [
          Keyboard.addListener('keyboardWillShow', handleKeyboardWillShow),
          Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow),
          Keyboard.addListener('keyboardWillHide', handleKeyboardWillHide),
          Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide)
        ];
        return () => {
          subscriptions.forEach((subscription) => subscription.remove());
        };
      }, []);

      return [shown, coordinates, keyboardHeight];
    }
  `;
};
