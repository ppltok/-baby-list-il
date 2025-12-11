import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import he from './locales/he.json'

export const defaultNS = 'translation'
export const resources = {
  en: { translation: en },
  he: { translation: he },
} as const

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    defaultNS,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  })

export default i18n

// Helper to check if current language is RTL
export const isRTL = () => i18n.language === 'he'

// Helper to get direction
export const getDirection = () => (isRTL() ? 'rtl' : 'ltr')
