'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, Users, Clock, DollarSign, CheckCircle, XCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import dynamic from 'next/dynamic'

const FullCalendarDynamic = dynamic(
  () => import('@fullcalendar/react').then((mod) => mod.default),
  { ssr: false }
)

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
}

interface Availability {
  id: string
  tourId: string
  date: string
  available: boolean
  capacity: number
  booked: number
}

interface TourModalProps {
  tour: Tour | null
  isOpen: boolean
  onClose: () => void
  vehicles: Vehicle[]
}

export default function TourModal({ tour, isOpen, onClose, vehicles }: TourModalProps) {
  const [activeStep, setActiveStep] = useState<'price' | 'availability' | 'reserve'>('price')
  const [availability, setAvailability] = useState<Availability[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedVehicle, setSelectedVehicle] = useState<string>('')
  const [participants, setParticipants] = useState<number>(1)
  const [paymentMethod, setPaymentMethod] = useState<string>('stripe')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    if (tour) {
      fetchAvailability()
    }
  }, [tour])

  const fetchAvailability = async () => {
    if (!tour) return
    try {
      const res = await fetch(`/api/availability?tourId=${tour.id}`)
      const data = await res.json()
      setAvailability(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching availability:', error)
    }
  }

  const events = availability.map((avail) => ({
    title: avail.available ? 'Disponible' : 'Lleno',
    date: avail.date,
    backgroundColor: avail.available ? '#10b981' : '#ef4444',
    borderColor: avail.available ? '#10b981' : '#ef4444',
    extendedProps: {
      capacity: avail.capacity,
      booked: avail.booked,
      available: avail.available,
    },
  }))

  const totalPrice = tour ? tour.price * participants : 0

  const onReserveSubmit = async (data: any) => {
    if (!tour) return

    setLoading(true)
    try {
      const reservationData = {
        tourId: tour.id,
        vehicleId: selectedVehicle || null,
        client: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          country: data.country,
        },
        date: selectedDate,
        time: selectedTime,
        participants,
        paymentMethod,
      }

      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData),
      })

      if (!res.ok) {
        throw new Error('Error al crear la reserva')
      }

      const result = await res.json()
      
      if (paymentMethod === 'stripe' && result.payment?.metadata?.clientSecret) {
        window.location.href = `/reservas/pago?clientSecret=${result.payment.metadata.clientSecret}&reservationId=${result.reservation.id}`
      } else if (paymentMethod === 'mercadopago' && result.payment?.metadata?.initPoint) {
        window.location.href = result.payment.metadata.initPoint
      } else {
        toast.success('Reserva creada exitosamente')
        onClose()
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al crear la reserva')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !tour) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-neutral-200 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header with Image */}
        <div className="relative">
          <div className="relative h-64 w-full bg-neutral-100">
            <img
              src={tour.image || tour.images?.[0] || 'https://lh3.googleusercontent.com/d/1oCcVps4HIu2A2B9S34bzonD1aWgIfHQ2'}
              alt={tour.title}
              className="w-full h-full object-cover"
              loading="eager"
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6">
              <h2 className="text-3xl font-bold text-white mb-2">{tour.title}</h2>
              <p className="text-white/90 text-sm line-clamp-2">{tour.description}</p>
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/95 hover:bg-white text-neutral-700 rounded-full p-2 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200 bg-neutral-50 px-6">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveStep('price')}
              className={`py-3 px-5 font-medium border-b-2 transition-all duration-200 ${
                activeStep === 'price'
                  ? 'border-neutral-900 text-neutral-900 bg-white'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
              }`}
            >
              Precio
            </button>
            <button
              onClick={() => setActiveStep('availability')}
              className={`py-3 px-5 font-medium border-b-2 transition-all duration-200 ${
                activeStep === 'availability'
                  ? 'border-neutral-900 text-neutral-900 bg-white'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
              }`}
            >
              Disponibilidad
            </button>
            <button
              onClick={() => setActiveStep('reserve')}
              className={`py-3 px-5 font-medium border-b-2 transition-all duration-200 ${
                activeStep === 'reserve'
                  ? 'border-neutral-900 text-neutral-900 bg-white'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
              }`}
            >
              Cotizar
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Tour Info Section - Always Visible */}
          <div className="mb-6 pb-6 border-b border-neutral-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-5 bg-neutral-50 rounded-xl border border-neutral-200">
                <Clock className="w-6 h-6 mx-auto mb-2.5 text-neutral-700" />
                <div className="font-medium text-xs text-neutral-600 uppercase tracking-wide mb-1">Duración</div>
                <div className="text-lg font-bold text-neutral-900">{tour.duration} horas</div>
              </div>
              <div className="text-center p-5 bg-neutral-50 rounded-xl border border-neutral-200">
                <Users className="w-6 h-6 mx-auto mb-2.5 text-neutral-700" />
                <div className="font-medium text-xs text-neutral-600 uppercase tracking-wide mb-1">Capacidad</div>
                <div className="text-lg font-bold text-neutral-900">Hasta {tour.maxCapacity} personas</div>
              </div>
              <div className="text-center p-5 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="font-medium text-xs text-neutral-600 uppercase tracking-wide mb-1">Dificultad</div>
                <div className="text-lg font-bold text-neutral-900">{tour.difficulty}</div>
              </div>
            </div>
            
            {/* Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-4 text-neutral-900">Itinerario</h3>
                <ul className="space-y-2.5">
                  {tour.itinerary.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-neutral-700 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-neutral-700 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Includes/Excludes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {tour.includes && tour.includes.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-neutral-900">Incluye:</h4>
                  <ul className="space-y-2">
                    {tour.includes.map((item, index) => (
                      <li key={index} className="flex items-start text-sm text-neutral-700">
                        <CheckCircle className="w-4 h-4 text-neutral-600 mr-2.5 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tour.excludes && tour.excludes.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-neutral-900">No Incluye:</h4>
                  <ul className="space-y-2">
                    {tour.excludes.map((item, index) => (
                      <li key={index} className="flex items-start text-sm text-neutral-700">
                        <XCircle className="w-4 h-4 text-neutral-600 mr-2.5 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Price Tab */}
          {activeStep === 'price' && (
            <div>
              <div className="text-center mb-8">
                <div className="text-2xl font-bold text-neutral-900 mb-2">
                  Información del Tour
                </div>
                <div className="text-neutral-600 text-sm">Solicita una cotización personalizada</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-5 bg-neutral-50 rounded-xl border border-neutral-200">
                  <Clock className="w-7 h-7 mx-auto mb-2.5 text-neutral-700" />
                  <div className="font-medium text-xs text-neutral-600 uppercase tracking-wide mb-1">Duración</div>
                  <div className="text-base font-semibold text-neutral-900">{tour.duration} horas</div>
                </div>
                <div className="text-center p-5 bg-neutral-50 rounded-xl border border-neutral-200">
                  <Users className="w-7 h-7 mx-auto mb-2.5 text-neutral-700" />
                  <div className="font-medium text-xs text-neutral-600 uppercase tracking-wide mb-1">Capacidad</div>
                  <div className="text-base font-semibold text-neutral-900">Hasta {tour.maxCapacity} personas</div>
                </div>
                <div className="text-center p-5 bg-primary-50 rounded-xl border border-primary-200">
                  <a
                    href={`/cotizar?tourId=${tour.id}`}
                    className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    Solicitar Cotización
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Availability Tab */}
          {activeStep === 'availability' && (
            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Selecciona Fecha
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Selecciona Hora
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                >
                  <option value="">Selecciona una hora</option>
                  <option value="08:00">08:00 AM</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Número de Participantes
                </label>
                <input
                  type="number"
                  min="1"
                  max={tour.maxCapacity}
                  value={participants}
                  onChange={(e) => setParticipants(parseInt(e.target.value) || 1)}
                  className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                />
              </div>
              <div className="mb-6">
                <h3 className="font-semibold mb-4">Calendario de Disponibilidad</h3>
                <div className="bg-white p-4 rounded-xl border border-neutral-200">
                  <FullCalendarDynamic
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    locale={esLocale}
                    events={events}
                    headerToolbar={{
                      left: 'prev,next today',
                      center: 'title',
                      right: 'dayGridMonth',
                    }}
                    eventContent={(eventInfo) => {
                      const { capacity, booked, available } = eventInfo.event.extendedProps
                      return (
                        <div className="p-1">
                          <div className="font-semibold text-xs">{eventInfo.event.title}</div>
                          {available && (
                            <div className="text-xs">
                              {booked}/{capacity}
                            </div>
                          )}
                        </div>
                      )
                    }}
                    height="auto"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                  <span className="text-sm">Disponible</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                  <span className="text-sm">No Disponible / Lleno</span>
                </div>
              </div>
            </div>
          )}

          {/* Reserve Tab */}
          {activeStep === 'reserve' && (
            <form onSubmit={handleSubmit(onReserveSubmit)}>
              <div className="space-y-6">
                <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Tour:</span>
                    <span>{tour.title}</span>
                  </div>
                  {selectedDate && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Fecha:</span>
                      <span>{selectedDate}</span>
                    </div>
                  )}
                  {selectedTime && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Hora:</span>
                      <span>{selectedTime}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Participantes:</span>
                    <span>{participants}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-lg font-bold">Participantes:</span>
                    <span className="text-xl font-bold text-neutral-900">{participants} persona(s)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      {...register('name', { required: true })}
                      className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      {...register('email', { required: true })}
                      className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      {...register('phone', { required: true })}
                      className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      País
                    </label>
                    <input
                      {...register('country')}
                      className="w-full border border-neutral-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Vehículo (Opcional)
                  </label>
                  <div className="space-y-2">
                    <div
                      onClick={() => setSelectedVehicle('')}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                        selectedVehicle === ''
                          ? 'border-neutral-900 bg-neutral-50'
                          : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      <span className="text-sm">Sin preferencia (Asignación automática)</span>
                    </div>
                    {vehicles
                      .filter((v) => v.capacity >= participants)
                      .map((vehicle) => (
                        <div
                          key={vehicle.id}
                          onClick={() => setSelectedVehicle(vehicle.id)}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                            selectedVehicle === vehicle.id
                              ? 'border-neutral-900 bg-neutral-50'
                              : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                          }`}
                        >
                          <div className="text-sm font-semibold">{vehicle.name}</div>
                          <div className="text-xs text-neutral-600">
                            {vehicle.type} - Capacidad: {vehicle.capacity}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Método de Pago *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      onClick={() => setPaymentMethod('stripe')}
                      className={`p-4 border-2 rounded-xl cursor-pointer text-center transition-all duration-200 ${
                        paymentMethod === 'stripe'
                          ? 'border-neutral-900 bg-neutral-50'
                          : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      <div className="font-semibold">Stripe</div>
                    </div>
                    <div
                      onClick={() => setPaymentMethod('mercadopago')}
                      className={`p-4 border-2 rounded-xl cursor-pointer text-center transition-all duration-200 ${
                        paymentMethod === 'mercadopago'
                          ? 'border-neutral-900 bg-neutral-50'
                          : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                      }`}
                    >
                      <div className="font-semibold">Mercado Pago</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2.5 border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-all duration-200 text-neutral-700 hover:text-neutral-900"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !selectedDate || !selectedTime}
                    className="px-8 py-3 bg-neutral-900 text-white rounded-xl font-semibold hover:bg-neutral-800 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-900"
                  >
                    {loading ? 'Procesando...' : 'Enviar Cotización'}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

