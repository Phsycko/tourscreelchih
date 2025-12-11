'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

// Lista de imágenes con IDs reales de Google Drive
const galleryImages = [
  { id: '10FXC37VJH-LoPzRDwjHLI43fucdtzPs9', name: 'Imagen 1' },
  { id: '1ynQ_lYIeGgTzQiOhKOMh8Vo8Bx64OALu', name: 'Imagen 2' },
  { id: '14YvGj_a54YXlGIfmfWmZGCZl4160MJtU', name: 'Imagen 3' },
  { id: '1zVVtHyXfYE8AYX9j6b5G-F3TgKUUkTe6', name: 'Imagen 4' },
  { id: '19iuqk8lYLAIz67T81_Mr-GaY65vYlz-A', name: 'Imagen 5' },
  { id: '1D8q0UHnAFHjyOJivUVlxUuRLrlNFwWYy', name: 'Imagen 6' },
  { id: '1e6sgC8vglLtqHzoULQyQGEhu2FZMhsQO', name: 'Imagen 7' },
  { id: '1Tg6pgt-NS-Yq3JA7Fv5ea3QFpGck9w4v', name: 'Imagen 8' },
  { id: '18VlUOaXstXM0IM4kQLZK-BF3tKheULdl', name: 'Imagen 9' },
  { id: '1Nc3_a7QdDytWNYZDgGNfxapOBzLgB_3-', name: 'Imagen 10' },
  { id: '1mkV0yFMqzqU2plX-1wN2Q-IIRJF0PPvB', name: 'Imagen 11' },
  { id: '1fs3p0urq9TQbDlM1d2urM0BfzQztCHDf', name: 'Imagen 12' },
  { id: '1uKuumUaSFfgdPf1CDJcev-JWVN1Dotsq', name: 'Imagen 13' },
  { id: '1LL0DSVSbM1ZcPTHcRdTHhYo-dtwWDx4j', name: 'Imagen 14' },
  { id: '1O4_YBKQbZ5YurcWZ9FetJKMtg_IG1s5M', name: 'Imagen 15' },
  { id: '175FO1zNr64VmO0xfvS58cRI6uCTzBnkV', name: 'Imagen 16' },
  { id: '1cgoBBxUF6eVJWOF5_bbkwMYJCndv4URZ', name: 'Imagen 17' },
  { id: '14XaZw3JC1K5bQAfnSnpkW2Shvo5JA8Uk', name: 'Imagen 18' },
  { id: '1VyifjwxF1AYEwQm7qIbTMu9jUYrQcQ5s', name: 'Imagen 19' },
  { id: '1WSDugHR0gtXZjNkdrOGHjFTF9fn_0_b-', name: 'Imagen 20' },
  { id: '1D8yvd0PdMVnKSie4J-X_mtXCfGnLF8_C', name: 'Imagen 21' },
  { id: '1U1xZeEglluNKK4dwfmEte37BwbKgiYcZ', name: 'Imagen 22' },
  { id: '1pqo0Kg_0nJ0_hyxIaDU1jsxZCQlIawfD', name: 'Imagen 23' },
  { id: '1rels0I8CkxFzXv_Wr8JlmkkALtHWE57h', name: 'Imagen 24' },
  { id: '1VBipNWH8OpVPdQ380P21ZBep3aRKGycq', name: 'Imagen 25' },
  { id: '16bY4lK95sRn9x2sBE47TB8c_M6nIc-Fx', name: 'Imagen 26' },
  { id: '1e3o-3oT20R7uFizOuveJg91_qRAwin9U', name: 'Imagen 27' },
  { id: '1Xsd-kSJvoZKgCmnan84CrSADCiUI_Hup', name: 'Imagen 28' },
  { id: '1fiG-ilh22sy159Drx1gLnBbFRys5qqgX', name: 'Imagen 29' },
  { id: '1GQAC4BSKNVJqan-Bf6Cw1VuCTAqIOjhc', name: 'Imagen 30' },
  { id: '1iSSfHGYz9ZZESC0c_eze7Pk0g2l5sYBD', name: 'Imagen 31' },
  { id: '1b6M1WrJar6gFFYRS0mspq_OFvlPq3Hq1', name: 'Imagen 32' },
  { id: '1Nfm-CCKKvOhQrfMMeS8hdDOlx0JW6NRr', name: 'Imagen 33' },
  { id: '1Bg40d5SJGKlVZ01GIbThnMH5bp6n_atA', name: 'Imagen 34' },
  { id: '11MUR9y-13GQbKQ3gP7aLsw7IqW5Ei6nA', name: 'Imagen 35' },
  { id: '1F9X7hp1kAZbQd1PkXF4g7cnb4W3xZSG3', name: 'Imagen 36' },
  { id: '1AcKfL7MuySyDBpWFUDB-FlIp0_XAWXz6', name: 'Imagen 37' },
  { id: '1Lr0jifxNxmPT0xJyKCcK09VSzlfbUpef', name: 'Imagen 38' },
  { id: '1wT7jG20WZb1he_5zRvOB73deaXxDLbNH', name: 'Imagen 39' },
  { id: '1eKOOR4El0E9qFzW-vgVLDf6m15Y8WD2f', name: 'Imagen 40' },
  { id: '1N9eSvHkSkjqLc2oFVR4BAMHr8BZd4Iht', name: 'Imagen 41' },
  { id: '16vcVpAIq4nuc1Bbuhkd4SE63tgSy4PRD', name: 'Imagen 42' },
  { id: '1K1h3eyqgl2uz2xJf7OTc1R6BSbMAuYhE', name: 'Imagen 43' },
  { id: '1rWav98Wz2kKcjy5t4jupzybpN0jFqzUl', name: 'Imagen 44' },
  { id: '1UfWpy3ktFYACbJyJ1yMiMnEVM4QwX7Ns', name: 'Imagen 45' },
  { id: '1438NRRl8qmtLcUWYoyGS_3LurAg1cvf1', name: 'Imagen 46' },
]

// Función para obtener la URL de la imagen usando el formato de Google Drive
const getImageUrl = (fileId: string, attempt: number = 0): string => {
  // Intento 0: Formato thumbnail de Google Drive
  if (attempt === 0) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`
  }
  // Intento 1: Formato uc?export=view
  if (attempt === 1) {
    return `https://drive.google.com/uc?export=view&id=${fileId}`
  }
  // Intento 2: Formato lh3.googleusercontent.com
  if (attempt === 2) {
    return `https://lh3.googleusercontent.com/d/${fileId}`
  }
  // Fallback
  return `https://drive.google.com/file/d/${fileId}/preview`
}

export default function GalleryPage() {
  const { t } = useTranslation()
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<number, number>>({})

  const openLightbox = (index: number) => {
    setSelectedImage(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return
    
    if (direction === 'prev') {
      setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1)
    } else {
      setSelectedImage(selectedImage === galleryImages.length - 1 ? 0 : selectedImage + 1)
    }
  }

  // Manejar navegación con teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (selectedImage === null) return
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowLeft') navigateImage('prev')
    if (e.key === 'ArrowRight') navigateImage('next')
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-20 sm:pt-24 pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 text-neutral-900 px-2">{t('gallery.title')}</h1>
          <p className="text-neutral-600 text-sm sm:text-base md:text-lg font-light px-2">{t('gallery.subtitle')}</p>
        </div>

        {/* Grid de Imágenes */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {galleryImages.map((image, index) => {
            const attempt = imageErrors[index] || 0
            const imageUrl = getImageUrl(image.id, attempt)
            
            return (
              <div
                key={`${image.id}-${index}`}
                onClick={() => openLightbox(index)}
                className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100 cursor-pointer group hover:shadow-lg transition-all duration-300"
              >
                <Image
                  src={imageUrl}
                  alt={image.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  unoptimized
                  onError={() => {
                    const currentAttempt = imageErrors[index] || 0
                    if (currentAttempt < 3) {
                      setImageErrors({ ...imageErrors, [index]: currentAttempt + 1 })
                    }
                  }}
                />
            </div>
            )
          })}
        </div>

        {/* Lightbox */}
        {selectedImage !== null && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                closeLightbox()
              }}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 text-white hover:text-neutral-300 transition-colors z-10 bg-black/50 rounded-full p-2 sm:p-2.5 touch-manipulation active:scale-95"
              aria-label="Cerrar"
            >
              <X size={24} className="sm:w-8 sm:h-8" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                navigateImage('prev')
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:text-neutral-300 transition-colors z-10 bg-black/50 rounded-full p-2 sm:p-3 touch-manipulation active:scale-95"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={24} className="sm:w-8 sm:h-8" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                navigateImage('next')
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:text-neutral-300 transition-colors z-10 bg-black/50 rounded-full p-2 sm:p-3 touch-manipulation active:scale-95"
              aria-label="Imagen siguiente"
            >
              <ChevronRight size={24} className="sm:w-8 sm:h-8" />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center"
            >
              {(() => {
                const attempt = imageErrors[selectedImage] || 0
                const imageUrl = getImageUrl(galleryImages[selectedImage].id, attempt)
                return (
                  <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
                    <Image
                      src={imageUrl}
                      alt={galleryImages[selectedImage].name}
                      fill
                      className="object-contain rounded-lg"
                      referrerPolicy="no-referrer"
                      unoptimized
                      onError={() => {
                        const currentAttempt = imageErrors[selectedImage] || 0
                        if (currentAttempt < 3) {
                          setImageErrors({ ...imageErrors, [selectedImage]: currentAttempt + 1 })
                        }
                      }}
                    />
                  </div>
                )
              })()}
              <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
                <p className="text-xs sm:text-sm font-medium">
                  {selectedImage + 1} / {galleryImages.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
