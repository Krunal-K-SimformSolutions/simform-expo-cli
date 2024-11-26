/**
 *
 */
export const RegexConstTemplate = (): string => {
  return `
    /**
     * A constant freezing object that contains the regex of the project.
     */
    export default Object.freeze({
      // For String Format
      stringClean: /\\s/g,
      stringArg: /{(\\w+(:\\w*)?)}/g,
      stringFormat: /{\\d+}/,
      // For Toast
      validToastTitleAndMessage: /(\\[.*\\])/g,
    });
  `;
};
