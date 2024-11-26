/**
 *
 */
export const CustomTextTypesTemplate = (): string => {
  return `
    import type { ColorValue, TextProps } from 'react-native';

    type CustomTextVariantsProps = {
      variant: 'semiBold16' | 'medium14';
      color?: ColorValue;
    };

    export type CustomTextProps = TextProps & CustomTextVariantsProps;
  `;
};
