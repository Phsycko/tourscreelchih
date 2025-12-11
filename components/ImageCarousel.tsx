'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const images = [
  {
    url: 'https://mexicorutamagica.mx/wp-content/uploads/2022/06/Barrancas-del-cobre-precios.jpg',
    title: 'Barrancas del Cobre',
    description: 'Sistema de cañones más profundos que el Gran Cañón'
  },
  {
    url: 'https://static.wixstatic.com/media/cf3297_80f2802fed6e432084200bba2a33c782~mv2.jpeg/v1/fill/w_1920,h_1280,al_c,q_90/cf3297_80f2802fed6e432084200bba2a33c782~mv2.jpeg',
    title: 'Valle de los Monjes',
    description: 'Impresionantes formaciones rocosas verticales'
  },
  {
    url: 'https://mexicorutamagica.mx/wp-content/uploads/2021/12/shutterstock_1978059989-1024x683.jpg',
    title: 'Cascada de Cusárare',
    description: 'Majestuosa caída de agua de 30 metros'
  },
  {
    url: 'https://www.mexicodesconocido.com.mx/wp-content/uploads/2019/02/CREEL-XV.jpg',
    title: 'Creel, Pueblo Mágico',
    description: 'Corazón de la Sierra Tarahumara'
  },
  {
    url: 'https://chihuahua.gob.mx/sites/default/atach2/noticias/imagen-destacada/2023-10/IMG-20231015-WA0004.jpg',
    title: 'Batopilas, Pueblo Mágico',
    description: 'Joya colonial en el fondo del cañón'
  },
  {
    url: 'https://www.mexicodesconocido.com.mx/wp-content/uploads/2022/06/kokoyome-chihuahua.jpg',
    title: 'Kokoyome',
    description: 'Formaciones rocosas únicas de la Sierra Tarahumara'
  },
  {
    url: 'https://static.wixstatic.com/media/cf3297_4c1c0856b16e47f1a6f1fc3872a6575e~mv2.jpg/v1/fill/w_1200,h_800,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/cf3297_4c1c0856b16e47f1a6f1fc3872a6575e~mv2.jpg',
    title: 'Aguas Termales de Recowata',
    description: 'Relájate en aguas termales naturales'
  },
  {
    url: 'https://static.wixstatic.com/media/240fe8_1a03fd6b7f3e416bbff8069afd4ce906~mv2.jpg/v1/fill/w_1480,h_986,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/240fe8_1a03fd6b7f3e416bbff8069afd4ce906~mv2.jpg',
    title: 'Mirador Cerro del Gallego',
    description: 'Vistas panorámicas impresionantes de la sierra'
  },
  {
    url: 'https://www.mexicodesconocido.com.mx/wp-content/uploads/2019/02/MENONITAS-XV.jpg',
    title: 'Campos Menonitas',
    description: 'Cultura y tradiciones menonitas de Chihuahua'
  },
  {
    url: 'https://escapadas.mexicodesconocido.com.mx/wp-content/uploads/2023/12/Mario-Alonso-Carrasco-Soto-1536x1152.jpeg',
    title: 'Valle de las Ranas',
    description: 'Formaciones rocosas con formas de ranas gigantes'
  },
  {
    url: 'https://cdn.unotv.com/images/2024/05/cascada-de-basaseachi-110108.jpg',
    title: 'Cascada de Basaseachi',
    description: 'Una de las cascadas más altas de México'
  },
  {
    url: 'https://static.wixstatic.com/media/969a80_43570240a269445faced04d5a9a77ac0~mv2.jpg/v1/fill/w_2048,h_1360,al_c,q_90/969a80_43570240a269445faced04d5a9a77ac0~mv2.webp',
    title: 'Misión San Ignacio',
    description: 'Histórica misión jesuita del siglo XVIII'
  },
  {
    url: 'https://www.mexicodesconocido.com.mx/wp-content/uploads/2025/07/Tony-Izaguirre3.webp',
    title: 'Cerocahui',
    description: 'Pintoresco pueblo en el corazón de la sierra'
  },
  {
    url: 'https://www.mexicodesconocido.com.mx/wp-content/uploads/2019/02/CREEL-XI.jpg',
    title: 'Lago de Arareko',
    description: 'Hermoso lago rodeado de bosques de pinos'
  },
]

export default function ImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Autoplay - siempre activo cada 5 segundos
  useEffect(() => {
    if (isPaused) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isPaused, currentIndex])

  // Reactivar autoplay después de 8 segundos de pausa
  useEffect(() => {
    if (!isPaused) return
    
    const timeout = setTimeout(() => {
      setIsPaused(false)
    }, 8000)

    return () => clearTimeout(timeout)
  }, [isPaused])

  const goToPrevious = () => {
    setIsPaused(true)
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setIsPaused(true)
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const goToSlide = (index: number) => {
    setIsPaused(true)
    setCurrentIndex(index)
  }

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl group">
      {/* Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <img
            src={images[currentIndex].url}
            alt={images[currentIndex].title}
            className="w-full h-full object-cover"
            style={{
              imageRendering: '-webkit-optimize-contrast',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
              willChange: 'transform',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            } as React.CSSProperties}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 drop-shadow-lg">
              {images[currentIndex].title}
            </h3>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 drop-shadow-md">
              {images[currentIndex].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 touch-manipulation active:scale-95"
        aria-label="Anterior"
      >
        <ChevronLeft size={20} className="sm:w-7 sm:h-7" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 touch-manipulation active:scale-95"
        aria-label="Siguiente"
      >
        <ChevronRight size={20} className="sm:w-7 sm:h-7" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 sm:h-3 rounded-full transition-all duration-300 touch-manipulation ${
              index === currentIndex
                ? 'bg-white w-6 sm:w-8'
                : 'bg-white/50 hover:bg-white/80 w-2 sm:w-3'
            }`}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/20">
        <motion.div
          key={currentIndex}
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 5, ease: 'linear' }}
          className="h-full bg-primary-500"
        />
      </div>
    </div>
  )
}

