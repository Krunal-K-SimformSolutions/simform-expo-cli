/**
 *
 */
export const CustomTextTemplate = (): string => {
  return `
    import React from 'react';
    import { useTranslation } from 'react-i18next';
    import { StyleSheet, Text } from 'react-native';
    import { useTheme } from '../../hooks';
    import { customTextVariants } from './CustomTextStyles';
    import type { CustomTextProps } from './CustomTextTypes';

    /**
     * It returns a text component
     */
    const CustomText = ({
      style = {},
      children,
      variant,
      color,
      ...rest
    }: CustomTextProps): React.ReactElement => {
      const { t } = useTranslation();
      const { styles } = useTheme(customTextVariants);

      return (
        <Text style={StyleSheet.flatten([styles[variant], style, !!color && { color }])} {...rest}>
          {typeof children === 'string' ? t(children, { defaultValue: children }) : children}
        </Text>
      );
    };

    export default CustomText;
  `;
};
