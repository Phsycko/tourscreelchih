'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname()
  
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
    { href: '/', label: 'Inicio' },
    { href: '/tours', label: 'Tours' },
    { href: '/galeria', label: 'Galería' },
    { href: '/contacto', label: 'Contacto' },
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">Tours Creel Chih.</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/cotizar"
              className="bg-primary-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Cotizar
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setIsOpen(!isOpen)}
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
            <div className="px-4 py-2 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block py-2 text-gray-700 hover:text-primary-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/cotizar"
                className="block py-3 mt-2 bg-primary-600 text-white text-center rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Cotizar
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

