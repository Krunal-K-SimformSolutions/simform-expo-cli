export const FontTemplate = (): string => {
  return `
    /**
     * A collection of font weights for the different font families.
     * @type {Object}
     */
    export default Object.freeze({
      bold: undefined,
      medium: undefined,
      black: undefined,
      regular: undefined,
      semiBold: undefined
    });
  `;
};
