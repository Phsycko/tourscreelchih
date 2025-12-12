'use client'

import { useState } from 'react'
import { Phone, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface PhonePopupProps {
  phoneNumber: string
  displayNumber: string
}

export default function PhonePopup({ phoneNumber, displayNumber }: PhonePopupProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`
    setIsOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 hover:text-white transition-colors"
      >
        <Phone size={16} />
        <span>{displayNumber}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />

            {/* Popup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-sm"
            >
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="bg-primary-600 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-white font-semibold text-lg">Llamar</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-primary-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone size={32} className="text-primary-400" />
                  </div>
                  <p className="text-gray-300 mb-2">¿Deseas llamar a</p>
                  <p className="text-2xl font-bold text-white mb-6">{displayNumber}</p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors font-medium"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleCall}
                      className="flex-1 px-4 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <Phone size={18} />
                      Llamar
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

