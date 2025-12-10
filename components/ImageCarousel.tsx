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
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80',
    title: 'Batopilas, Pueblo Mágico',
    description: 'Joya colonial en el fondo del cañón'
  },
  {
    url: 'https://images.unsplash.com/photo-1609788063095-d71bf3c1f01f?w=1920&q=90',
    title: 'Kokoyome',
    description: 'Formaciones rocosas únicas de la Sierra Tarahumara'
  },
  {
    url: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=1200&q=80',
    title: 'Aguas Termales de Recowata',
    description: 'Relájate en aguas termales naturales'
  },
  {
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80',
    title: 'Mirador Cerro del Gallego',
    description: 'Vistas panorámicas impresionantes de la sierra'
  },
  {
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
    title: 'Campos Menonitas',
    description: 'Cultura y tradiciones menonitas de Chihuahua'
  },
  {
    url: 'https://images.unsplash.com/photo-1444930694458-01babf71870c?w=1200&q=80',
    title: 'Valle de las Ranas',
    description: 'Formaciones rocosas con formas de ranas gigantes'
  },
  {
    url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1200&q=80',
    title: 'Cascada de Basaseachi',
    description: 'Una de las cascadas más altas de México'
  },
  {
    url: 'https://images.unsplash.com/photo-1548769905-5d0614a8c4e4?w=1200&q=80',
    title: 'Misión San Ignacio',
    description: 'Histórica misión jesuita del siglo XVIII'
  },
  {
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80',
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
    <div className="relative w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl group">
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
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url('${images[currentIndex].url}')`,
              imageRendering: 'auto',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)'
            }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
              {images[currentIndex].title}
            </h3>
            <p className="text-lg md:text-xl text-white/90 drop-shadow-md">
              {images[currentIndex].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        aria-label="Anterior"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
        aria-label="Siguiente"
      >
        <ChevronRight size={28} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/80'
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

