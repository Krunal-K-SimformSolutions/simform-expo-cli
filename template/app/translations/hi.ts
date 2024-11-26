/**
 *
 */
export const HITemplate = (): string => {
  return `
    {
      "common": {
        "dark": "डार्क थीम",
        "light": "लाइट थीम",
        "en": "अंग्रेज़ी",
        "hi": "हिंदी"
      },
      "modules": {
        "notFound": {
          "title": "उफ़!",
          "message": "यह स्क्रीन मौजूद नहीं है.",
          "home": "होम स्क्रीन पर जाएं!"
        },
        "home": {
          "title": "घर"
        }
      }
    }
  `;
};
