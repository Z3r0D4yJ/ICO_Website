import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import HttpBackend from 'i18next-http-backend'

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Ondersteunde talen
    supportedLngs: ['nl', 'en'],
    fallbackLng: 'nl',
    defaultNS: 'translation',

    // Taaldetectie instellingen
    detection: {
      order: ['localStorage', 'cookie', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'ico-lang',
      lookupCookie: 'ico-lang',
    },

    // Backend: laad vertaalbestanden uit /public/locales/
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    interpolation: {
      escapeValue: false, // React escapet al XSS
    },

    // Geen taal prefix in URLs (NL is standaard)
    load: 'languageOnly',

    react: {
      useSuspense: true,
    },
  })

export default i18n
