/**
 *
 */
export const UseThemeTemplate = (): string => {
  return `
    import { isEqual } from 'lodash';
    import { useCallback, useMemo } from 'react';
    import { useColorScheme, type ColorSchemeName } from 'react-native';
    import { StorageKeyConst } from '../constants';
    import { ThemeModeEnum, type ThemeMode } from '../themes';
    import useAsyncStorage from './useAsyncStorage';

    /**
     * A theme hook that returns the current theme and whether it is dark.
     * @param {(theme: ThemeMode) => T} styleSheetFn? - A function that returns a style sheet for the theme.
     * @returns An object with the following properties:
     * - isDark: boolean - flag for whether the theme is dark or not.
     * - theme: ThemeMode - current theme mode.
     * - styles?: T - current theme mode based styles.
     * - changeTheme: (value: ThemeMode) => void - if do you want to need to change current theme mode.
     */
    const useTheme = <T>(
      styleSheetFn?: (theme: ThemeMode, isDark?: boolean) => T
    ): {
      isDark: boolean;
      theme: ThemeMode;
      styles: T;
      changeTheme: (value: ThemeMode) => void;
    } => {
      const theme: ColorSchemeName = useColorScheme();
      const { item, setItem } = useAsyncStorage<string>(StorageKeyConst.appTheme, ThemeModeEnum.system);

      const currentThemeMode = useMemo<ThemeMode>(
        () =>
          (isEqual(item ?? ThemeModeEnum.system, ThemeModeEnum.system)
            ? (theme ?? ThemeModeEnum.light)
            : item) as ThemeMode,
        [theme, item]
      );

      const isDark = useMemo<boolean>(
        () => currentThemeMode === ThemeModeEnum.dark,
        [currentThemeMode]
      );

      const styles = useMemo<T>(
        () => (styleSheetFn?.(currentThemeMode, isDark) ?? {}) as T,
        [styleSheetFn, currentThemeMode, isDark]
      );

      const changeTheme = useCallback<(value: ThemeMode) => void>(
        (value: ThemeMode) => {
          setItem(String(value));
        },
        [setItem]
      );
      
      return { isDark, theme: currentThemeMode, styles, changeTheme };
    };

    export default useTheme;
  `;
};
