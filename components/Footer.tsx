'use client'

import Link from 'next/link'
import { Facebook, MapPin, MessageCircle } from 'lucide-react'
import PhonePopup from './PhonePopup'
import { useTranslation } from '@/lib/i18n/context'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Tours Creel Chih.</h3>
            <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4">
              {t('footer.description')}
            </p>
            <Link
              href="/cotizar"
              className="inline-block bg-primary-600 text-white px-5 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-primary-700 transition-colors touch-manipulation active:bg-primary-800"
            >
              {t('footer.quote')}
            </Link>
          </div>

          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">{t('footer.tours')}</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
              <li><Link href="/tours" className="hover:text-white transition-colors touch-manipulation block py-1">{t('footer.viewTours')}</Link></li>
              <li><Link href="/galeria" className="hover:text-white transition-colors touch-manipulation block py-1">{t('footer.gallery')}</Link></li>
              <li><Link href="/cotizar" className="hover:text-white transition-colors touch-manipulation block py-1">{t('footer.quoteLink')}</Link></li>
              <li><Link href="/disponibilidad" className="hover:text-white transition-colors touch-manipulation block py-1">{t('footer.availability')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">{t('footer.info')}</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
              <li><Link href="/cotizar" className="hover:text-white transition-colors touch-manipulation block py-1">{t('footer.quoteLink')}</Link></li>
              <li><Link href="/contacto" className="hover:text-white transition-colors touch-manipulation block py-1">{t('footer.contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">{t('footer.contactTitle')}</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-400">
              <li>
                <PhonePopup phoneNumber="+526351200217" displayNumber="+52 635 120 0217" />
              </li>
              <li>
                <a 
                  href="https://wa.me/526351200217?text=Hola,%20me%20interesa%20información%20sobre%20los%20tours"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 hover:text-green-400 transition-colors touch-manipulation py-1"
                >
                  <MessageCircle size={14} className="sm:w-4 sm:h-4" />
                  <span>{t('footer.whatsapp')}</span>
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                <span>{t('footer.location')}</span>
              </li>
            </ul>
            <div className="flex space-x-3 sm:space-x-4 mt-3 sm:mt-4">
              <a 
                href="https://www.facebook.com/share/19zfRSrGJS/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-blue-600 p-2 rounded-lg hover:bg-blue-700 transition-colors touch-manipulation active:scale-95"
                aria-label="Facebook"
              >
                <Facebook size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a 
                href="https://wa.me/526351200217"
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-green-500 p-2 rounded-lg hover:bg-green-600 transition-colors touch-manipulation active:scale-95"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} className="sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Tours Creel Chih. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  )
}

