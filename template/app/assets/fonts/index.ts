/**
 *
 */
export const FontTemplate = (): string => {
  return `
    export const fontNames = Object.freeze({
      bold: 'Poppins-Bold',
      medium: 'Poppins-Medium',
      regular: 'Poppins-Regular',
      semiBold: 'Poppins-SemiBold'
    });

    /**
     * A collection of font weights for the different font families.
     * @type {Object}
     */
    export const fonts = Object.freeze({
      [fontNames.bold]: require('./Poppins-Bold.ttf'),
      [fontNames.medium]: require('./Poppins-Medium.ttf'),
      [fontNames.regular]: require('./Poppins-Regular.ttf'),
      [fontNames.semiBold]: require('./Poppins-SemiBold.ttf')
    });
  `;
};
