'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import esTranslations from './translations/es.json'
import enTranslations from './translations/en.json'

type Language = 'es' | 'en'

type Translations = typeof esTranslations

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined)

const translations: Record<Language, Translations> = {
  es: esTranslations,
  en: enTranslations,
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedLang = localStorage.getItem('language')
        if (savedLang === 'es' || savedLang === 'en') {
          setLanguageState(savedLang as Language)
        }
      } catch (e) {
        // Ignore
      }
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('language', lang)
      } catch (e) {
        // Ignore
      }
    }
  }

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[language] || translations.es
    
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) {
        value = translations.es
        for (const fk of keys) {
          value = value?.[fk]
        }
        return value || key
      }
    }
    
    return value || key
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useTranslation must be used within I18nProvider')
  }
  return context
}

