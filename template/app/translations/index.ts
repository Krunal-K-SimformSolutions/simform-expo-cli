export * from './en.js';
export * from './nl.js';

export const TranslationTemplate = (): string => {
  return `
    /**
     * A dictionary of translations for the extension.
     * @type {Object}
     */
    export default Object.freeze({
      en: require('./en.json'),
      nl: require('./nl.json')
    });
  `;
};
