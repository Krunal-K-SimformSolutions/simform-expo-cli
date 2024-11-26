/**
 *
 */
export const CustomTextStylesTemplate = (): string => {
  return `
    import { StyleSheet } from 'react-native';
    import { Colors, scale, type ThemeMode } from '../../themes';
    import { FontNames } from '../../assets';

    /**
     * Create text component style with different variant
     * @param theme is provided current color schema
     * @returns text component style
     */
    export const customTextVariants = (theme: ThemeMode) =>
      StyleSheet.create({
        semiBold16: {
          alignItems: 'center',
          justifyContent: 'center',
          color: Colors[theme]?.text?.textBrand,
          fontFamily: FontNames.semiBold,
          fontSize: scale(16),
          fontWeight: '600',
          padding: scale(5)
        },
        medium14: {
          alignItems: 'center',
          justifyContent: 'center',
          color: Colors[theme]?.text?.textSecondary,
          fontFamily: FontNames.medium,
          fontSize: scale(14),
          fontWeight: '500',
          padding: scale(5)
        }
      });
  `;
};
