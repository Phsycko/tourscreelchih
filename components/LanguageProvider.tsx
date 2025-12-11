'use client'

import { useEffect, useContext } from 'react'
import { I18nContext } from '@/lib/i18n/context'

export default function LanguageProvider() {
  const context = useContext(I18nContext)
  
  useEffect(() => {
    if (context?.language && typeof document !== 'undefined') {
      document.documentElement.lang = context.language
    }
  }, [context?.language])

  return null
}

