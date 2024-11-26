/**
 *
 */
export const UseTimeoutTemplate = (): string => {
  return `
    import { isNil } from 'lodash';
    import { useEffect, useRef } from 'react';
    import type React from 'react';

    /**
     * A timeout hook that calls a function after a specified delay.
     * @param {() => void} callback - the function to call after the delay
     * @param {number | undefined} delay - the delay in milliseconds
     * @returns None
     */
    export default function useTimeout(callback: () => void, delay?: number): void {
      const savedCallback: React.MutableRefObject<(() => void) | undefined> = useRef<() => void>();

      useEffect(() => {
        savedCallback.current = callback;
      }, [callback]);

      useEffect(() => {
        /**
         * A function that is called every time the timeout is updated.
         * @returns None
         */
        function tick() {
          savedCallback.current?.();
        }
        if (!isNil(delay) && delay >= 0) {
          const id = setTimeout(tick, delay);
          return () => clearTimeout(id);
        }
      }, [delay]);
    }
  `;
};
