export const ColorsTemplate = (): string => {
  return `
    // Define all app colors
    const blueColors = Object.freeze({
      blue50: '#e7eef3',
      blue100: '#b4cada',
      blue200: '#8fb1c8',
      blue300: '#5c8daf',
      blue400: '#3d779f',
      blue500: '#0c5587',
      blue600: '#0b4d7b',
      blue700: '#093c60',
      blue800: '#0f1d2d',
      blue900: '#0e141a'
    });

    const orangeColors = Object.freeze({
      orange50: '#fcf1e9',
      orange100: '#f4d2bc',
      orange200: '#efbd9c',
      orange300: '#e89f6e',
      orange400: '#e38c52',
      orange500: '#dc6f27',
      orange600: '#c86523',
      orange700: '#9c4f1c',
      orange800: '#793d15',
      orange900: '#5c2f10'
    });

    const neutralsColors = Object.freeze({
      white: '#ffffff',
      gray50: '#f4f4f4',
      gray100: '#eeeded',
      gray200: '#cecece',
      gray300: '#b7b7b7',
      gray400: '#a9a9a9',
      gray500: '#949494',
      gray600: '#878787',
      gray700: '#696969',
      gray800: '#515151',
      gray900: '#3e3e3e',
      black: '#161a1d',
      shadow: '#626060'
    });

    const other = Object.freeze({
      blueDark: '#14355b',
      orangeLight: '#f59522',
      green: '#b4cf5f',
      gray: '#d9d5d4'
    });

    const blueGreyColors = Object.freeze({
      blueGrey500: '#4d749d',
      blueGrey700: '#37485c',
      blueGrey900: '#242a32'
    });

    const darkGreenColors = Object.freeze({
      darkGreen100: '#e6f5d3',
      darkGreen300: '#add581',
      darkGreen500: '#639144',
      darkGreen900: '#476e30'
    });

    const redColors = Object.freeze({
      red100: '#fff0f1',
      red300: '#e8646c',
      red500: '#b81f28',
      red900: '#4a0c10'
    });

    // Define text variant colors
    const textLightTheme = Object.freeze({
      textPrimary: neutralsColors.black,
      textSecondary: neutralsColors.gray500,
      textPositive: darkGreenColors.darkGreen500,
      textPositiveLight: darkGreenColors.darkGreen100,
      textWarning: orangeColors.orange500,
      textWarningLight: orangeColors.orange50,
      textCritical: redColors.red500,
      textCriticalLight: redColors.red100,
      textBrand: blueColors.blue500,
      textBrandLight: blueColors.blue50,
      textWhite: neutralsColors.white
    });

    const textDarkTheme = Object.freeze({
      textPrimary: neutralsColors.white,
      textSecondary: neutralsColors.gray300,
      textPositive: darkGreenColors.darkGreen100,
      textPositiveLight: darkGreenColors.darkGreen500,
      textWarning: orangeColors.orange500,
      textWarningLight: orangeColors.orange50,
      textCritical: redColors.red500,
      textCriticalLight: redColors.red100,
      textBrand: blueColors.blue500,
      textBrandLight: blueColors.blue800,
      textWhite: neutralsColors.white
    });

    // Define border variant colors
    const borderLightTheme = Object.freeze({
      borderBrand: blueColors.blue500,
      borderGrayLight: neutralsColors.gray50,
      borderGrayDark: neutralsColors.gray300,
      borderPositive: darkGreenColors.darkGreen500,
      borderWarning: orangeColors.orange500,
      borderCritical: redColors.red500,
      borderBrandLight: blueColors.blue100,
      borderBlack: neutralsColors.black
    });

    const borderDarkTheme = Object.freeze({
      borderBrand: blueColors.blue500,
      borderGrayLight: neutralsColors.gray900,
      borderGrayDark: neutralsColors.gray700,
      borderPositive: darkGreenColors.darkGreen100,
      borderWarning: orangeColors.orange500,
      borderCritical: redColors.red100,
      borderBrandLight: blueColors.blue600,
      borderBlack: neutralsColors.white
    });

    // Define background variant colors
    const backgroundLightTheme = Object.freeze({
      bgPrimary: blueColors.blue50,
      bgSecondary: orangeColors.orange50,
      bgBrand: blueColors.blue500,
      bgBrandSecondary: orangeColors.orange500,
      bgWhite: neutralsColors.white,
      bgGrayLight: neutralsColors.gray50,
      bgGrayDark: neutralsColors.gray300,
      bgPositive: darkGreenColors.darkGreen500,
      bgPositiveLight: darkGreenColors.darkGreen100,
      bgCritical: redColors.red500,
      bgCriticalLight: redColors.red100,
      bgBlack: neutralsColors.black
    });

    const backgroundDarkTheme = Object.freeze({
      bgPrimary: blueColors.blue900,
      bgSecondary: orangeColors.orange700,
      bgBrand: blueColors.blue500,
      bgBrandSecondary: orangeColors.orange500,
      bgWhite: blueColors.blue800,
      bgGrayLight: neutralsColors.gray900,
      bgGrayDark: neutralsColors.gray700,
      bgPositive: darkGreenColors.darkGreen100,
      bgPositiveLight: darkGreenColors.darkGreen500,
      bgCritical: redColors.red100,
      bgCriticalLight: redColors.red500,
      bgBlack: neutralsColors.white
    });

    // Define button variant colors
    const buttonLightTheme = Object.freeze({
      textPrimary: neutralsColors.white,
      textBrand: blueColors.blue500,
      textFocused: blueColors.blue700,
      textDisabled: blueColors.blue300,
      textBlack: neutralsColors.black,
      textDisabledSecondary: neutralsColors.gray400,
      textCritical: redColors.red500,
      bgPrimary: blueColors.blue500,
      bgPrimaryOrange: orangeColors.orange500,
      bgPrimaryFocused: blueColors.blue700,
      bgPrimaryDisabled: blueColors.blue50,
      bgSecondary: blueColors.blue800,
      bgSecondaryFocused: blueColors.blue900,
      bgSecondaryDisabled: neutralsColors.gray50,
      bgWhite: neutralsColors.white,
      bgCritical: redColors.red500,
      borderPrimary: blueColors.blue500,
      borderPrimaryLight: blueColors.blue50,
      borderFocused: blueColors.blue700,
      borderDisabled: blueColors.blue300,
      borderCritical: redColors.red500
    });

    const buttonDarkTheme = Object.freeze({
      textPrimary: neutralsColors.white,
      textBrand: blueColors.blue50,
      textFocused: blueColors.blue500,
      textDisabled: blueColors.blue400,
      textBlack: neutralsColors.white,
      textDisabledSecondary: neutralsColors.gray800,
      textCritical: redColors.red300,
      bgPrimary: blueColors.blue500,
      bgPrimaryOrange: orangeColors.orange500,
      bgPrimaryFocused: blueColors.blue500,
      bgPrimaryDisabled: blueColors.blue700,
      bgSecondary: blueColors.blue50,
      bgSecondaryFocused: blueColors.blue50,
      bgSecondaryDisabled: neutralsColors.gray900,
      bgWhite: blueColors.blue900,
      bgCritical: redColors.red300,
      borderPrimary: blueColors.blue50,
      borderPrimaryLight: blueColors.blue900,
      borderFocused: blueColors.blue200,
      borderDisabled: blueColors.blue700,
      borderCritical: redColors.red300
    });

    // Define input field variant colors
    const inputFieldLightTheme = Object.freeze({
      textPlaceholder: neutralsColors.gray400,
      textLabel: neutralsColors.gray500,
      textEnabled: neutralsColors.black,
      textBrand: blueColors.blue500,
      textDisabled: neutralsColors.gray300,
      textHelper: neutralsColors.gray400,
      textCritical: redColors.red500,
      bgPrimary: neutralsColors.white,
      bgDisabled: neutralsColors.gray50,
      borderEnabled: blueColors.blue50,
      borderSelected: blueColors.blue500,
      borderCritical: redColors.red500,
      borderDisabled: neutralsColors.gray100,
      dropShadow: neutralsColors.shadow
    });

    const inputFieldDarkTheme = Object.freeze({
      textPlaceholder: neutralsColors.gray600,
      textLabel: neutralsColors.gray400,
      textEnabled: neutralsColors.white,
      textBrand: blueColors.blue500,
      textDisabled: neutralsColors.gray700,
      textHelper: neutralsColors.gray600,
      textCritical: redColors.red300,
      bgPrimary: blueColors.blue900,
      bgDisabled: neutralsColors.gray900,
      borderEnabled: blueGreyColors.blueGrey900,
      borderSelected: blueColors.blue50,
      borderCritical: redColors.red300,
      borderDisabled: neutralsColors.gray900,
      dropShadow: neutralsColors.shadow
    });

    // Define image field variant colors
    const imageFieldLightTheme = Object.freeze({
      tint: blueColors.blue500
    });

    const imageFieldDarkTheme = Object.freeze({
      tint: neutralsColors.white
    });

    // Define skeleton field variant colors
    const skeletonFieldLightTheme = Object.freeze({
      primaryBackground: blueColors.blue50,
      primaryForeground: blueColors.blue100,
      secondaryBackground: blueColors.blue600,
      secondaryForeground: blueColors.blue800
    });

    const skeletonFieldDarkTheme = Object.freeze({
      primaryBackground: blueColors.blue600,
      primaryForeground: blueColors.blue800,
      secondaryBackground: blueColors.blue600,
      secondaryForeground: blueColors.blue800
    });

    // Define toast variant colors
    const toastLightTheme = Object.freeze({
      success: {
        primary: borderLightTheme.borderPositive,
        secondary: backgroundLightTheme.bgPositiveLight
      },
      warning: {
        primary: borderLightTheme.borderWarning,
        secondary: backgroundLightTheme.bgSecondary
      },
      fail: {
        primary: borderLightTheme.borderCritical,
        secondary: backgroundLightTheme.bgCriticalLight
      },
      info: {
        primary: borderLightTheme.borderBrand,
        secondary: backgroundLightTheme.bgPrimary
      },
      custom: {
        primary: borderLightTheme.borderBrand,
        secondary: backgroundLightTheme.bgPrimary
      }
    });

    const toastDarkTheme = Object.freeze({
      success: {
        primary: borderDarkTheme.borderPositive,
        secondary: backgroundDarkTheme.bgPositiveLight
      },
      warning: {
        primary: borderDarkTheme.borderWarning,
        secondary: backgroundDarkTheme.bgSecondary
      },
      fail: {
        primary: borderDarkTheme.borderCritical,
        secondary: backgroundDarkTheme.bgCriticalLight
      },
      info: {
        primary: borderDarkTheme.borderBrand,
        secondary: backgroundDarkTheme.bgPrimary
      },
      custom: {
        primary: borderDarkTheme.borderBrand,
        secondary: backgroundDarkTheme.bgPrimary
      }
    });

    // Define loan variant colors
    const loanStatusLightTheme = Object.freeze({
      EP: '#4d545d',
      P: '#4d545d',
      D: neutralsColors.black,
      A: '#1874d2',
      AD: '#00a2ff',
      ETS: neutralsColors.black,
      S: other.orangeLight,
      C: '#2a8d0b',
      UW: '#9ea716',
      PC: '#7ed61e',
      TC: neutralsColors.black,
      PO: '#2e5687',
      R: '#b76a09',
      F: '#dc000d',
      H: neutralsColors.black
    });

    const loanStatusDarkTheme = Object.freeze({
      EP: '#4d545d',
      P: '#4d545d',
      D: neutralsColors.white,
      A: '#1874d2',
      AD: '#00a2ff',
      ETS: neutralsColors.white,
      S: other.orangeLight,
      C: '#2a8d0b',
      UW: '#9ea716',
      PC: '#7ed61e',
      TC: neutralsColors.white,
      PO: '#2e5687',
      R: '#b76a09',
      F: '#dc000d',
      H: neutralsColors.white
    });

    // Define chart colors
    const chartLightTheme = Object.freeze({
      pending: '#DE833C',
      pendingGradient: '#FF9440',
      issued: '#54ECA3',
      issuedGradient: '#45C185',
      closed: '#9358C2',
      closedGradient: '#B174E2',
      deadOrDeclined: '#FF7272',
      deadOrDeclinedGradient: '#D04E4E',
      total: '#43b0f1',
      totalGradient: '#057dcd'
    });

    const chartDarkTheme = Object.freeze({
      pending: '#DE833C',
      pendingGradient: '#FF9440',
      issued: '#54ECA3',
      issuedGradient: '#45C185',
      closed: '#9358C2',
      closedGradient: '#B174E2',
      deadOrDeclined: '#FF7272',
      deadOrDeclinedGradient: '#D04E4E',
      total: '#43b0f1',
      totalGradient: '#057dcd'
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
      border: borderLightTheme,
      background: backgroundLightTheme,
      button: buttonLightTheme,
      inputField: inputFieldLightTheme,
      toast: toastLightTheme,
      image: imageFieldLightTheme,
      skeleton: skeletonFieldLightTheme,
      loanStatus: loanStatusLightTheme,
      chart: chartLightTheme
    });

    /**
     * A dark theme object.
     * @returns {ThemeColors}
     */
    const dark = Object.freeze({
      common,
      text: textDarkTheme,
      border: borderDarkTheme,
      background: backgroundDarkTheme,
      button: buttonDarkTheme,
      inputField: inputFieldDarkTheme,
      toast: toastDarkTheme,
      image: imageFieldDarkTheme,
      skeleton: skeletonFieldDarkTheme,
      loanStatus: loanStatusDarkTheme,
      chart: chartDarkTheme
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
