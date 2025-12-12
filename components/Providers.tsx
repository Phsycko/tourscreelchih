'use client'

import { ReactNode } from 'react'
import { I18nProvider } from '@/lib/i18n/context'
import { Toaster } from 'react-hot-toast'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      {children}
      <Toaster position="top-right" />
    </I18nProvider>
  )
}
