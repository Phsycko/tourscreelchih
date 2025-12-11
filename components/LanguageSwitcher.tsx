'use client'

import { useTranslation } from '@/lib/i18n/context'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation()

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es')
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-900 transition-colors font-medium text-sm sm:text-base touch-manipulation active:scale-95"
      aria-label="Cambiar idioma / Change language"
    >
      <Globe size={16} className="sm:w-5 sm:h-5" />
      <span className="font-semibold">{language.toUpperCase()}</span>
    </button>
  )
}

