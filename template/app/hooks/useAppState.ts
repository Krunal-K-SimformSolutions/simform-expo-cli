/**
 *
 */
export const UseAppStateTemplate = (): string => {
  return `
    import { useEffect, useState } from 'react';
    import { AppState, type AppStateStatus } from 'react-native';
    import { globalMetrics } from '../themes';

    /**
     * A app state hook prop type.
     * @param {UseAppStatePropsType} props - the props to pass to the hook
     */
    interface UseAppStatePropsType {
      onChange?: (status: AppStateStatus) => void;
      onForeground?: () => void;
      onBackground?: () => void;
    }

    /**
     * A app state hook that returns the current app state.
     * @param {UseAppStatePropsType} [settings] - the settings for the hook
     * @returns {AppStateStatus} - the current app state
     */
    export default function useAppState(settings?: UseAppStatePropsType): AppStateStatus {
      const { onChange, onForeground, onBackground }: UseAppStatePropsType = settings ?? {};
      const [firstTime, setFirstTime] = useState(globalMetrics.isAndroid);
      const [appState, setAppState] = useState(AppState.currentState);

      useEffect(() => {
        const subscription = AppState.addEventListener(
          'change',
          (nextAppState: AppStateStatus): void => {
            if (nextAppState === 'active' && appState !== 'active') {
              onForeground?.();
            } else if (appState === 'active' && nextAppState.match(/inactive|background/)) {
              onBackground?.();
            }
            setAppState(nextAppState);
            onChange?.(nextAppState);
          }
        );
        return () => subscription.remove();
      }, [onChange, onForeground, onBackground, appState]);

      useEffect(() => {
        if (firstTime) {
          setFirstTime(false);
          onForeground?.();
        }
      }, [firstTime, onForeground]);

      return appState;
    }  
  `;
};
