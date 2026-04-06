'use client'

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'
import { translations, type Locale, type TranslationKeys } from './translations'

type NestedKeyOf<T> = T extends object
  ? { [K in keyof T]: K extends string
      ? T[K] extends object
        ? `${K}.${NestedKeyOf<T[K]>}` | K
        : K
      : never
    }[keyof T]
  : never

type TranslationKey = NestedKeyOf<TranslationKeys>

interface LanguageContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Helper function to get nested translation value - outside component to prevent recreation
function getTranslation(locale: Locale, key: string): string {
  const keys = key.split('.')
  let value: unknown = translations[locale]
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k]
    } else {
      // Fallback to English if key not found
      value = translations.en
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = (value as Record<string, unknown>)[fallbackKey]
        } else {
          return key // Return key if translation not found
        }
      }
      break
    }
  }
  
  return typeof value === 'string' ? value : key
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === 'undefined') return 'en'
    try {
      const saved = localStorage.getItem('simu-jiji-locale') as Locale | null
      if (saved === 'en' || saved === 'sw') return saved
    } catch {
      // localStorage unavailable
    }
    return 'en'
  })

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    try {
      localStorage.setItem('simu-jiji-locale', newLocale)
    } catch {
      // localStorage not available
    }
  }, [])

  const toggleLocale = useCallback(() => {
    setLocaleState(prev => {
      const newLocale = prev === 'en' ? 'sw' : 'en'
      try {
        localStorage.setItem('simu-jiji-locale', newLocale)
      } catch {
        // localStorage not available
      }
      return newLocale
    })
  }, [])

  const t = useCallback((key: string): string => {
    return getTranslation(locale, key)
  }, [locale])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    locale,
    setLocale,
    toggleLocale,
    t
  }), [locale, setLocale, toggleLocale, t])

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
