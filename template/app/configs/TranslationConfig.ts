/**
 *
 */
export const TranslationConfigTemplate = (): string => {
  return `
    import { getLocales } from 'expo-localization';
    import i18n, { use } from 'i18next';
    import { initReactI18next } from 'react-i18next';
    import { StorageKeyConst } from '../constants';
    import translations from '../translations';
    import { getStorageItem, setStorageItem } from '../utils';

    const LANGUAGE_DETECTOR = {
      type: 'languageDetector',
      async: true,
      detect: async (callback: (language: string) => void) => {
        const deviceLang = getLocales()[0].languageCode;
        const language = await getStorageItem<string>(StorageKeyConst.appLanguage, '');
        callback(deviceLang ?? language);
      },
      init: () => {},
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
    // eslint-disable-next-line react-hooks/rules-of-hooks
    use<any>(LANGUAGE_DETECTOR)
      .use(initReactI18next)
      .init({
        compatibilityJSON: 'v4',
        fallbackLng: 'en',
        ns: ['common'],
        defaultNS: 'common',
        resources: {
          en: translations.en,
          nl: translations.nl
        }
      });

    export default i18n;
  `;
};
