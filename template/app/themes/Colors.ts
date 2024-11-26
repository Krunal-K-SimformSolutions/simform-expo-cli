/**
 *
 */
export const ColorsTemplate = (): string => {
  return `
    // Define all app colors
    const blueColors = Object.freeze({
      blue50: '#e7eef3',
      blue500: '#0c5587',
      blue900: '#0e141a'
    });

    const orangeColors = Object.freeze({
      orange50: '#fcf1e9',
      orange500: '#dc6f27',
      orange700: '#9c4f1c'
    });

    const neutralsColors = Object.freeze({
      white: '#ffffff',
      gray300: '#b7b7b7',
      gray500: '#949494',
      black: '#161a1d'
    });

    const darkGreenColors = Object.freeze({
      darkGreen100: '#e6f5d3',
      darkGreen500: '#639144'
    });

    const redColors = Object.freeze({
      red100: '#fff0f1',
      red500: '#b81f28'
    });

    // Define text variant colors
    const textLightTheme = Object.freeze({
      textPrimary: neutralsColors.black,
      textSecondary: neutralsColors.gray500,
      textBrand: blueColors.blue500
    });

    const textDarkTheme = Object.freeze({
      textPrimary: neutralsColors.white,
      textSecondary: neutralsColors.gray300,
      textBrand: blueColors.blue500
    });

    // Define toast variant colors
    const toastLightTheme = Object.freeze({
      success: {
        primary: darkGreenColors.darkGreen500,
        secondary: darkGreenColors.darkGreen100
      },
      warning: {
        primary: orangeColors.orange500,
        secondary: orangeColors.orange50
      },
      fail: {
        primary: redColors.red500,
        secondary: redColors.red100
      },
      info: {
        primary: blueColors.blue500,
        secondary: blueColors.blue50
      },
      custom: {
        primary: blueColors.blue500,
        secondary: blueColors.blue50
      }
    });

    const toastDarkTheme = Object.freeze({
      success: {
        primary: darkGreenColors.darkGreen100,
        secondary: darkGreenColors.darkGreen500
      },
      warning: {
        primary: orangeColors.orange500,
        secondary: orangeColors.orange700
      },
      fail: {
        primary: redColors.red100,
        secondary: redColors.red500
      },
      info: {
        primary: blueColors.blue500,
        secondary: blueColors.blue900
      },
      custom: {
        primary: blueColors.blue500,
        secondary: blueColors.blue900
      }
    });

    const common = Object.freeze({
      transparent: 'transparent',
      semiTransparent: '#00000050',
      shadow: '#636363'
    });

    /**
     * A light theme object.
     * @returns {ThemeColors}
     */
    const light = Object.freeze({
      common,
      text: textLightTheme,
      toast: toastLightTheme
    });

    /**
     * A dark theme object.
     * @returns {ThemeColors}
     */
    const dark = Object.freeze({
      common,
      text: textDarkTheme,
      toast: toastDarkTheme
    });

    export enum ThemeModeEnum {
      'light' = 'light',
      'dark' = 'dark',
      'system' = 'system'
    }

    export type ThemeMode = ThemeModeEnum.light | ThemeModeEnum.dark;

    export default { light, dark };
  `;
};
