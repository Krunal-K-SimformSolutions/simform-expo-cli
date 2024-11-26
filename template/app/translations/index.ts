export * from './en.js';
export * from './hi.js';

/**
 *
 */
export const TranslationTemplate = (): string => {
  return `
    /**
     * A dictionary of translations for the extension.
     * @type {Object}
     */
    export default Object.freeze({
      en: require('./en.json'),
      hi: require('./hi.json')
    });
  `;
};
