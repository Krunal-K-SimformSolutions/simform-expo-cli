/**
 *
 */
export const ToastStyleTemplate = (): string => {
  return `
    import { StyleSheet } from 'react-native';
    import { ApplicationStyles, scale } from '../../themes';

    /**
     * A StyleSheet object that contains all of the toast component styles.
     * @param {ThemeMode} theme - The theme to use for the styles.
     * @returns {StyleSheet} A StyleSheet object containing all of the toast component styles.
     */
    export default StyleSheet.create({
      ...ApplicationStyles.viewStyle,
      absoluteView: {
        ...StyleSheet.absoluteFillObject,
        right: scale(50)
      },
      contentContainerStyle: {
        borderRadius: scale(8),
        borderTopWidth: scale(4),
        flexDirection: 'row',
        gap: scale(12),
        marginHorizontal: scale(15),
        paddingHorizontal: scale(16),
        paddingVertical: scale(16)
      },
      contentStyle: {
        flex: 1,
        gap: scale(4)
      },
      failIcon: {
        transform: [{ rotate: '180deg' }]
      },
      removeCenter: {
        alignItems: undefined,
        justifyContent: undefined
      }
    });
  `;
};
