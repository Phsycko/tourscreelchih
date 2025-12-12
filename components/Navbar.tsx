'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/lib/i18n/context'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()
  const { t } = useTranslation()
  
  // En inicio se oculta hasta scroll, en otras páginas siempre visible
  const isHomePage = pathname === '/'

  useEffect(() => {
    if (!isHomePage) {
      // En otras páginas, siempre visible
      setIsVisible(true)
      return
    }

    // Solo en inicio: ocultar/mostrar con scroll
    const handleScroll = () => {
      const scrollY = window.scrollY
      if (scrollY > 100) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    // Inicialmente oculto en inicio
    setIsVisible(false)
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHomePage])

  const menuItems = [
    { href: '/', label: t('nav.home') },
    { href: '/tours', label: t('nav.tours') },
    { href: '/galeria', label: t('nav.gallery') },
    { href: '/contacto', label: t('nav.contact') },
  ]

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : -100, 
        opacity: isVisible ? 1 : 0 
      }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18 md:h-20">
          <Link href="/" className="flex items-center min-w-0 flex-shrink hover:opacity-80 transition-opacity py-2">
            <img 
              src="https://chatgpt.com/backend-api/estuary/content?id=file_000000008d7871f5a48a82017ef890e0&ts=490437&p=fs&cid=1&sig=db6dbc0acfa5c72b18e849fa15416268ded8f7c5429b7bdc6d50b014913f29ca&v=0" 
              alt="Tours Creel Chih." 
              className="h-12 sm:h-14 md:h-16 w-auto object-contain"
              style={{ objectFit: 'contain', maxHeight: '64px' }}
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm lg:text-base text-gray-700 hover:text-primary-600 transition-colors font-medium whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/cotizar"
              className="bg-primary-600 text-white px-4 lg:px-5 py-2 rounded-lg text-sm lg:text-base font-semibold hover:bg-primary-700 transition-colors whitespace-nowrap"
            >
              {t('nav.quote')}
            </Link>
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2.5 text-gray-700 touch-manipulation active:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menú"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t"
          >
            <div className="px-4 py-3 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-3.5 px-2 text-base text-gray-700 hover:text-primary-600 hover:bg-gray-50 font-medium rounded-lg transition-colors touch-manipulation"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/cotizar"
                className="block py-3.5 mt-2 bg-primary-600 text-white text-center rounded-lg text-base font-semibold hover:bg-primary-700 transition-colors touch-manipulation active:bg-primary-800"
                onClick={() => setIsOpen(false)}
              >
                {t('nav.quote')}
              </Link>
              <div className="pt-2">
                <LanguageSwitcher />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

