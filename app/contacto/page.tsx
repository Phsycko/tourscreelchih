'use client'

import { Phone, MapPin, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/context'

export default function ContactPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-slate-100 pt-20 sm:pt-24 pb-8 sm:pb-12">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 text-slate-800 px-2">{t('contact.title')}</h1>
          <p className="text-slate-600 text-sm sm:text-base md:text-lg px-2">{t('contact.subtitle')}</p>
        </div>

        {/* Contact Info */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-slate-800">{t('contact.info.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <a
              href="tel:+526351200217"
              className="flex items-start p-4 sm:p-5 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors touch-manipulation active:bg-slate-200"
            >
              <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-base sm:text-lg text-slate-800">{t('contact.info.phone')}</h3>
                <p className="text-primary-600 font-medium text-lg sm:text-xl">+52 635 120 0217</p>
                <p className="text-sm text-slate-500">{t('contact.info.call')}</p>
              </div>
            </a>
            <a
              href="https://wa.me/526351200217"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start p-4 sm:p-5 bg-green-50 rounded-lg hover:bg-green-100 transition-colors touch-manipulation active:bg-green-200"
            >
              <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-base sm:text-lg text-slate-800">{t('contact.info.whatsapp')}</h3>
                <p className="text-green-600 font-medium text-lg sm:text-xl">+52 635 120 0217</p>
                <p className="text-sm text-slate-500">{t('contact.info.chat')}</p>
              </div>
            </a>
            <a
              href="https://www.facebook.com/share/19zfRSrGJS/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start p-4 sm:p-5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors touch-manipulation active:bg-blue-200"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mr-4 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <div>
                <h3 className="font-semibold text-base sm:text-lg text-slate-800">{t('contact.info.facebook')}</h3>
                <p className="text-blue-600 font-medium text-lg sm:text-xl">Tours Creel Chih.</p>
                <p className="text-sm text-slate-500">{t('contact.info.follow')}</p>
              </div>
            </a>
            <div className="flex items-start p-4 sm:p-5 bg-slate-50 rounded-lg">
              <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 mr-4 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-base sm:text-lg text-slate-800">{t('contact.info.location')}</h3>
                <p className="text-base sm:text-lg text-slate-600">{t('contact.info.address')}</p>
                <p className="text-sm text-slate-500">{t('contact.info.region')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-lg">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-slate-800">{t('contact.actions.title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <a
              href="https://wa.me/526351200217?text=Hola,%20me%20interesa%20información%20sobre%20los%20tours"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full bg-green-500 text-white px-6 py-4 sm:py-5 rounded-lg text-base font-semibold hover:bg-green-600 transition-colors touch-manipulation active:bg-green-700"
            >
              <MessageCircle className="mr-2" size={20} />
              {t('contact.actions.whatsapp')}
            </a>
            <Link
              href="/cotizar"
              className="flex items-center justify-center w-full bg-primary-600 text-white px-6 py-4 sm:py-5 rounded-lg text-base font-semibold hover:bg-primary-700 transition-colors touch-manipulation active:bg-primary-800"
            >
              {t('contact.actions.quote')}
            </Link>
            <Link
              href="/tours"
              className="flex items-center justify-center w-full bg-slate-700 text-white px-6 py-4 sm:py-5 rounded-lg text-base font-semibold hover:bg-slate-800 transition-colors touch-manipulation active:bg-slate-900"
            >
              {t('contact.actions.tours')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
