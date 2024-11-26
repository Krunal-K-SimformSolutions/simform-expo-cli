/**
 *
 */
export const ApplicationStylesTemplate = (): string => {
  return `
    import { StyleSheet } from 'react-native';
    import { globalMetrics, scale } from './Metrics';

    const viewStyle = StyleSheet.create({
      centerAlign: {
        alignItems: 'center',
        justifyContent: 'center'
      },
      containerGap: {
        gap: scale(globalMetrics.isAndroid ? 3 : 4)
      },
      flexColumn: {
        flexDirection: 'column'
      },
      flexRow: {
        flexDirection: 'row'
      },
      hitSlot: {
        bottom: scale(10),
        left: scale(16),
        right: scale(16),
        top: scale(10)
      },
      pressableTopMargin: {
        marginTop: -scale(3)
      },
      screen: {
        flex: 1
      },
      wrap: {
        flexWrap: 'wrap'
      }
    });

    /**
     * A StyleSheet object that contains all of the application's styles.
     * @param {ThemeMode} theme - The theme of the application.
     * @returns {StyleSheet} - A StyleSheet object containing all of the application's styles.
     */
    export default {
      viewStyle
    };
  `;
};
