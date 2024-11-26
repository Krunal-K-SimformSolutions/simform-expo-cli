/**
 *
 */
export const TranslationConfigTemplate = (): string => {
  return `
    import { getLocales } from 'expo-localization';
    import i18n from 'i18next';
    import { initReactI18next } from 'react-i18next';
    import { StorageKeyConst } from '../constants';
    import translations from '../translations';
    import { getStorageItem, setStorageItem } from '../utils';

    const LANGUAGE_DETECTOR = {
      type: 'languageDetector',
      async: true,
      /**
       * Detects the language.
       * @param {function(string): void} callback a callback function that takes the language as an argument.
       * @returns {Promise<void>}
       */
      detect: async (callback: (language: string) => void) => {
        const deviceLang = getLocales()[0].languageCode;
        const language = await getStorageItem<string>(StorageKeyConst.appLanguage, 'en');
        callback(language ?? deviceLang);
      },
      /**
       * Initializes the language detector. Currently, this function does not
       * perform any operations, but is provided to comply with the detector's
       * interface.
       */
      init: () => {},
      /**
       * Caches the user's language preference.
       * @param {string} language - The language code to be stored as the user's preference.
       */
      cacheUserLanguage: (language: string) => {
        setStorageItem<string>(StorageKeyConst.appLanguage, language);
      }
    };

    /**
     * Initializes the i18n library.
     * @param {object} - The key pair value to initialize the library. An object with the following properties:
     * - init: Function.prototype - proto type of function to initialize
     * - type: 'languageDetector' - A custom language detector
     * - async: true | false - lags below detect function to be async or not
     * - detect: async (callback: any) => void - A phone language detector
     * @returns None
     */
    // eslint-disable-next-line import/no-named-as-default-member
    i18n
      .use<any>(LANGUAGE_DETECTOR)
      .use(initReactI18next)
      .init({
        compatibilityJSON: 'v4',
        resources: translations,
        react: {
          useSuspense: false
        }
      });

    export default i18n;
  `;
};
