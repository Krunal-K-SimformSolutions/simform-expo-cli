/**
 *
 */
export const UsePreviousTemplate = (): string => {
  return `
    import { useEffect, useRef } from 'react';
    import type React from 'react';

    /**
     * previous hook to get the previous value of a state variable.
     * @param {T} value - the value to get the previous value of.
     * @returns {T | undefined} - the previous value of the state variable.
     */
    export default function usePrevious<T>(value: T): T | undefined {
      const ref: React.MutableRefObject<T | undefined> = useRef<T>();

      useEffect(() => {
        ref.current = value;
      });

      return ref.current;
    }
  `;
};
