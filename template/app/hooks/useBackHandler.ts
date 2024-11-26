/**
 *
 */
export const UseBackHandlerTemplate = (): string => {
  return `
    import { useEffect } from 'react';
    import { BackHandler } from 'react-native';

    /**
     * Back handler hook that adds a back button listener to the application.
     * @param {() => boolean} handler - the function to call when the back button is pressed.
     * @returns None
     */
    export default function useBackHandler(handler: () => boolean): void {
      useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handler);

        return () => {
          BackHandler.removeEventListener('hardwareBackPress', handler);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    }
  `;
};
