'use client'

import { useState, useEffect } from 'react'
import { MapPin, Car, Users, Clock, ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatedSection } from '@/components/AnimatedSection'
import TourModal from '@/components/TourModal'

interface Tour {
  id: string
  title: string
  description: string
  price: number
  duration: number
  maxCapacity: number
  difficulty: string
  image?: string
  images?: string[]
  itinerary?: string[]
  includes?: string[]
  excludes?: string[]
  requirements?: string[]
}

interface Vehicle {
  id: string
  name: string
  capacity: number
  type: string
  description: string
  images: string[]
  amenities: string[]
}


export default function ToursPage() {
  const [activeTab, setActiveTab] = useState<'tours' | 'vehicles'>('tours')
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tours, setTours] = useState<Tour[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  // Tours por defecto
  const defaultTours: Tour[] = [
    {
      id: 'tour-kokoyome',
      title: 'Tour Kokoyome',
      description: 'Tour completo de 11 horas visitando los lugares más hermosos de Kokoyome.',
      price: 1400,
      duration: 11,
      maxCapacity: 20,
      difficulty: 'Moderado',
      image: 'https://lh3.googleusercontent.com/d/1oCcVps4HIu2A2B9S34bzonD1aWgIfHQ2',
      images: [
        'https://lh3.googleusercontent.com/d/1oCcVps4HIu2A2B9S34bzonD1aWgIfHQ2',
        'https://lh3.googleusercontent.com/d/1oCcVps4HIu2A2B9S34bzonD1aWgIfHQ2',
      ],
      itinerary: [
        'Mirador del Ángel',
        'Parque Turístico de Kokoyome',
        'Lago de las Garzas',
        'El Salto',
      ],
    },
    {
      id: 'tour-creel',
      title: 'Creel Pueblo Mágico',
      description: 'Descubre la magia de Creel, un pueblo mágico lleno de cultura, historia y naturaleza. Duración aproximada de 3 a 5 horas.',
      price: 1200,
      duration: 4,
      maxCapacity: 15,
      difficulty: 'Fácil',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      ],
      itinerary: [
        'Museo Casa Tarahumara',
        'Mirador Cristo Rey',
        'Cueva de los Leones',
        'Bosque Mágico',
      ],
    },
    {
      id: 'tour-campos-menonitas',
      title: 'Campos Menonitas',
      description: 'Conoce la cultura y tradiciones menonitas en un tour completo que incluye museo, quesería, corredor comercial y deliciosa comida. Duración aproximada de 9 a 10 horas.',
      price: 1500,
      duration: 9,
      maxCapacity: 20,
      difficulty: 'Fácil',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      ],
      itinerary: [
        'Museo Menonita',
        'Casa de la Galleta',
        'Quesería',
        'Recorrido por Corredor Comercial Menonita',
        'Restaurant con Especialidad en Pizzas Menonitas',
      ],
    },
    {
      id: 'tour-region-tarahumara',
      title: 'Región Tarahumara',
      description: 'Te llevamos a vivir una experiencia inolvidable en la Región Tarahumara, descubriendo los lugares más emblemáticos de esta cultura ancestral.',
      price: 1800,
      duration: 10,
      maxCapacity: 18,
      difficulty: 'Moderado',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      ],
      itinerary: [
        'Valle de las Ranas',
        'Valle de los Hongos',
        'Misión Jesuita',
        'Cueva de Sebastián',
        'Cascada de Cusarare',
        'Lago de Arareko',
      ],
      excludes: [
        'Entradas',
        'Servicios no especificados por el guía',
      ],
    },
    {
      id: 'tour-batopilas',
      title: 'Batopilas',
      description: 'Descubre la historia y cultura de Batopilas, un pueblo mágico lleno de tradición y arquitectura colonial. Duración aproximada de 12 horas.',
      price: 2000,
      duration: 12,
      maxCapacity: 18,
      difficulty: 'Moderado',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      ],
      itinerary: [
        'Mirador de la Bufa',
        'Museo Batopilas',
        'Misión Perdida de Satevo',
        'Ruinas de Hacienda San Miguel',
        'Letras Monumentales',
      ],
    },
    {
      id: 'tour-entre-canones',
      title: 'Entre Cañones',
      description: 'Vive una experiencia única entre los cañones más impresionantes, visitando miradores, misiones y cascadas. Duración aproximada de 10 horas.',
      price: 1700,
      duration: 10,
      maxCapacity: 18,
      difficulty: 'Moderado',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      ],
      itinerary: [
        'Mirador Cerro del Gallego',
        'Cerocahui',
        'Misión Jesuita',
        'Cascada Cerocahui',
        'Hotel Valderrama (Viñedo)',
      ],
    },
    {
      id: 'tour-valle-monjes',
      title: 'Valle de los Monjes',
      description: 'Explora el impresionante Valle de los Monjes con sus formaciones rocosas únicas y paisajes naturales. Duración aproximada de 4 horas.',
      price: 1100,
      duration: 4,
      maxCapacity: 15,
      difficulty: 'Fácil',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      ],
      itinerary: [
        'Valle de los Monjes',
        'Focotonal',
        'Mirador de la División Continental',
        'Valle de la Montura',
        'Caminata entre el valle',
      ],
    },
    {
      id: 'tour-recowata',
      title: 'Aguas Termales de Recowata',
      description: 'Relájate y disfruta de las aguas termales de Recowata, con visita al mirador y opción de caminata. Duración aproximada de 7 horas.',
      price: 1300,
      duration: 7,
      maxCapacity: 15,
      difficulty: 'Fácil',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      ],
      itinerary: [
        'Mirador de Tararekua',
        'Aguas Termales',
        'Opción de Caminata',
      ],
    },
    {
      id: 'tour-basaseachi',
      title: 'Cascada de Basaseachi',
      description: 'Descubre una de las cascadas más impresionantes de México, con múltiples miradores y el poblado de Basaseachi. Duración aproximada de 10 horas.',
      price: 1600,
      duration: 10,
      maxCapacity: 18,
      difficulty: 'Moderado',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      ],
      itinerary: [
        'Nacimiento de la Cascada',
        '3 Miradores de la Cascada',
        'Poblado de Basaseachi',
        'Caminata al Fondo de la Cascada (Opcional)',
      ],
    },
    {
      id: 'tour-barrancas-cobre',
      title: 'Parque Aventura, Barrancas del Cobre',
      description: 'Vive una experiencia única en el Parque Aventura de Barrancas del Cobre, con teleférico, tirolesa y miradores espectaculares. Duración aproximada de 7 a 8 horas.',
      price: 1900,
      duration: 8,
      maxCapacity: 20,
      difficulty: 'Moderado',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      ],
      itinerary: [
        'Teleférico',
        'Tirolesa más Grande del Mundo',
        'Restaurante Temple de Vidrio',
        'Piedra Volada',
        'Puente Colgante',
        'Mirador Río Oteros',
        'Estación Divisadero',
        'Letras Monumentales',
      ],
      excludes: [
        'Entradas',
        'Servicios no especificados por el guía',
      ],
    },
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [toursRes, vehiclesRes] = await Promise.all([
        fetch('/api/tours'),
        fetch('/api/vehicles')
      ])
      
      if (!toursRes.ok) {
        throw new Error('Error al cargar tours')
      }
      
      if (!vehiclesRes.ok) {
        throw new Error('Error al cargar vehículos')
      }
      
      const toursData = await toursRes.json()
      const vehiclesData = await vehiclesRes.json()
      
      // Verificar si hay error en la respuesta
      if (toursData.error) {
        console.error('Error en API tours:', toursData.error)
        // Si hay error, usar los tours por defecto
        setTours(defaultTours)
      } else {
        const toursArray = Array.isArray(toursData) ? toursData : []
        // Si no hay tours, usar los tours por defecto
        if (toursArray.length === 0) {
          setTours(defaultTours)
        } else {
          // Asegurar que Kokoyome esté primero
          const sorted = [...toursArray].sort((a, b) => {
            if (a.title === 'Tour Kokoyome') return -1
            if (b.title === 'Tour Kokoyome') return 1
            return 0
          })
          setTours(sorted)
        }
      }
      
      if (vehiclesData.error) {
        console.error('Error en API vehicles:', vehiclesData.error)
        setVehicles([])
      } else {
        setVehicles(Array.isArray(vehiclesData) ? vehiclesData : [])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      // Si hay error, usar los tours por defecto
      setTours(defaultTours)
      setVehicles([])
    } finally {
      setLoading(false)
    }
  }



  const tabs = [
    { id: 'tours', label: 'Tours', icon: MapPin },
    { id: 'vehicles', label: 'Vehículos', icon: Car },
  ]

  const handleTourClick = (tour: Tour) => {
    setSelectedTour(tour)
    setIsModalOpen(true)
  }

  if (loading && tours.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-neutral-200 border-t-neutral-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-neutral-900">Tours y Reservas</h1>
          <p className="text-neutral-600 text-lg font-light">Todo lo que necesitas para planificar tu experiencia</p>
        </div>

        {/* Tabs */}
        <div className="mb-10 bg-white rounded-xl shadow-sm border border-neutral-200 p-1.5">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2.5 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-neutral-900 text-white shadow-sm'
                      : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tours Tab */}
        {activeTab === 'tours' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.isArray(tours) && tours.length > 0 ? tours.map((tour) => (
                <AnimatedSection key={tour.id}>
                  <div 
                    onClick={() => handleTourClick(tour)}
                    className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md hover:border-neutral-300 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="relative h-56 w-full overflow-hidden bg-neutral-100">
                      <img
                        src={tour.image || 'https://lh3.googleusercontent.com/d/1oCcVps4HIu2A2B9S34bzonD1aWgIfHQ2'}
                        alt={tour.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          // Si falla, intentar formato alternativo de Google Drive
                          const currentSrc = e.currentTarget.src
                          if (currentSrc.includes('lh3.googleusercontent.com')) {
                            e.currentTarget.src = 'https://drive.google.com/uc?export=view&id=1oCcVps4HIu2A2B9S34bzonD1aWgIfHQ2'
                          } else if (currentSrc.includes('drive.google.com')) {
                            e.currentTarget.src = 'https://lh3.googleusercontent.com/d/1oCcVps4HIu2A2B9S34bzonD1aWgIfHQ2'
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2.5 text-neutral-900">{tour.title}</h3>
                      <p className="text-neutral-600 mb-5 line-clamp-2 text-sm leading-relaxed">{tour.description}</p>
                      <div className="flex items-center space-x-5 mb-5 text-xs text-neutral-500">
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1.5 text-neutral-400" />
                          <span>{tour.duration}h</span>
                        </div>
                        <div className="flex items-center">
                          <Users size={14} className="mr-1.5 text-neutral-400" />
                          <span>Hasta {tour.maxCapacity}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                        <span className="text-2xl font-bold text-neutral-900">${tour.price.toLocaleString()} MXN</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleTourClick(tour)
                          }}
                          className="flex items-center text-neutral-700 hover:text-neutral-900 font-medium text-sm group/btn"
                        >
                          Ver Detalle
                          <ArrowRight size={16} className="ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              )) : (
                <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
                  <p className="text-neutral-600 text-lg mb-3 font-medium">No hay tours disponibles en este momento.</p>
                  <p className="text-sm text-neutral-500">
                    Si acabas de configurar la base de datos, ejecuta: <code className="bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-md text-xs font-mono">npm run db:seed</code>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vehicles Tab */}
        {activeTab === 'vehicles' && (
            <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicles.map((vehicle) => (
                <AnimatedSection key={vehicle.id}>
                  <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md hover:border-neutral-300 transition-all duration-300 group">
                    {vehicle.images && vehicle.images.length > 0 && (
                      <div className="relative h-64 w-full overflow-hidden">
                        <Image
                          src={vehicle.images[0]}
                          alt={vehicle.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2.5 text-neutral-900">{vehicle.name}</h3>
                      <p className="text-neutral-600 mb-5 text-sm leading-relaxed">{vehicle.description}</p>
                      <div className="flex items-center space-x-5 mb-5 text-xs text-neutral-500">
                        <div className="flex items-center">
                          <Users size={14} className="mr-1.5 text-neutral-400" />
                          <span>Capacidad: {vehicle.capacity}</span>
                        </div>
                        <div className="flex items-center">
                          <Car size={14} className="mr-1.5 text-neutral-400" />
                          <span>{vehicle.type}</span>
                        </div>
                      </div>
                      {vehicle.amenities && vehicle.amenities.length > 0 && (
                        <div className="mb-4 pt-4 border-t border-neutral-100">
                          <h4 className="font-medium mb-3 text-sm text-neutral-700">Comodidades:</h4>
                          <div className="flex flex-wrap gap-2">
                            {vehicle.amenities.map((amenity: string, index: number) => (
                              <span
                                key={index}
                                className="flex items-center text-xs bg-neutral-100 text-neutral-700 px-3 py-1.5 rounded-md border border-neutral-200"
                              >
                                <CheckCircle size={12} className="mr-1.5 text-neutral-600" />
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tour Modal */}
      <TourModal
        tour={selectedTour}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedTour(null)
        }}
        vehicles={vehicles}
      />
    </div>
  )
}
