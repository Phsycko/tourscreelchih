'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, Users, Clock, DollarSign, CheckCircle, ExternalLink } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Link from 'next/link'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'
import enLocale from '@fullcalendar/core/locales/en-gb'
import dynamic from 'next/dynamic'
import { useTranslation } from '@/lib/i18n/context'

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
}

export default function TourModal({ tour, isOpen, onClose }: TourModalProps) {
  const { t, language } = useTranslation()
  const [activeStep, setActiveStep] = useState<'price' | 'availability' | 'reserve'>('price')
  const [availability, setAvailability] = useState<Availability[]>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [participants, setParticipants] = useState<number>(1)
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
    title: avail.available ? t('tourModal.availability.available') : t('tourModal.availability.unavailable'),
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
        vehicleId: null,
        client: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          country: data.country,
        },
        date: selectedDate,
        time: selectedTime,
        participants,
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
      
      toast.success(t('contact.success'))
      onClose()
    } catch (error: any) {
      toast.error(error.message || 'Error al crear la reserva')
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = () => {
    if (tour && (tour.id === 'tour-kokoyome' || tour.title === 'Tour Kokoyome')) {
      return 'https://lh3.googleusercontent.com/d/1oCcVps4HIu2A2B9S34bzonD1aWgIfHQ2'
    }
    if (tour) {
      return tour.image || tour.images?.[0] || 'https://lh3.googleusercontent.com/d/1oCcVps4HIu2A2B9S34bzonD1aWgIfHQ2'
    }
    return 'https://lh3.googleusercontent.com/d/1oCcVps4HIu2A2B9S34bzonD1aWgIfHQ2'
  }

  if (!isOpen || !tour) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl border border-neutral-200 max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header with Image */}
        <div className="relative">
          <div className="relative h-40 sm:h-56 md:h-64 w-full bg-neutral-100">
            <img
              src={getImageUrl()}
              alt={tour.title}
              className="w-full h-full object-cover"
              loading="eager"
              onError={(e) => {
                // Si falla, intentar formato alternativo de Google Drive
                const currentSrc = e.currentTarget.src
                if (tour.id === 'tour-kokoyome' || tour.title === 'Tour Kokoyome') {
                  e.currentTarget.src = 'https://lh3.googleusercontent.com/d/1oCcVps4HIu2A2B9S34bzonD1aWgIfHQ2'
                } else if (currentSrc.includes('lh3.googleusercontent.com')) {
                  e.currentTarget.src = 'https://drive.google.com/uc?export=view&id=1oCcVps4HIu2A2B9S34bzonD1aWgIfHQ2'
                } else if (currentSrc.includes('drive.google.com')) {
                  e.currentTarget.src = 'https://lh3.googleusercontent.com/d/1oCcVps4HIu2A2B9S34bzonD1aWgIfHQ2'
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 md:left-6 right-3 sm:right-4 md:right-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                {(() => {
                  const translatedTitle = t(`tours.tourTitles.${tour.id}`)
                  return translatedTitle && translatedTitle !== `tours.tourTitles.${tour.id}` ? translatedTitle : tour.title
                })()}
              </h2>
              <p className="text-white/90 text-xs sm:text-sm line-clamp-2">
                {(() => {
                  const translated = t(`tours.tourDescriptions.${tour.id}`)
                  return translated && translated !== `tours.tourDescriptions.${tour.id}` ? translated : tour.description
                })()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-white/95 hover:bg-white text-neutral-700 rounded-full p-2 sm:p-2.5 transition-all duration-200 shadow-sm hover:shadow-md touch-manipulation active:scale-95"
              aria-label="Cerrar"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200 bg-neutral-50 px-2 sm:px-4 md:px-6 overflow-x-auto">
          <div className="flex space-x-1 min-w-max sm:min-w-0">
            <button
              onClick={() => setActiveStep('price')}
              className={`py-2.5 sm:py-3 px-3 sm:px-4 md:px-5 font-medium border-b-2 transition-all duration-200 text-sm sm:text-base whitespace-nowrap touch-manipulation ${
                activeStep === 'price'
                  ? 'border-neutral-900 text-neutral-900 bg-white'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
              }`}
            >
              {t('tourModal.tabs.info')}
            </button>
            <button
              onClick={() => setActiveStep('availability')}
              className={`py-2.5 sm:py-3 px-3 sm:px-4 md:px-5 font-medium border-b-2 transition-all duration-200 text-sm sm:text-base whitespace-nowrap touch-manipulation ${
                activeStep === 'availability'
                  ? 'border-neutral-900 text-neutral-900 bg-white'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
              }`}
            >
              {t('tourModal.tabs.availability')}
            </button>
            <button
              onClick={() => setActiveStep('reserve')}
              className={`py-2.5 sm:py-3 px-3 sm:px-4 md:px-5 font-medium border-b-2 transition-all duration-200 text-sm sm:text-base whitespace-nowrap touch-manipulation ${
                activeStep === 'reserve'
                  ? 'border-neutral-900 text-neutral-900 bg-white'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
              }`}
            >
              {t('tourModal.tabs.reserve')}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 md:p-6">
          {/* Price Tab */}
          {activeStep === 'price' && (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="text-center p-4 sm:p-5 bg-white rounded-xl border-2 border-neutral-300 shadow-sm">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 sm:mb-2.5 text-neutral-900" />
                  <div className="font-semibold text-xs text-neutral-800 uppercase tracking-wide mb-1">{t('tourModal.info.duration')}</div>
                  <div className="text-base sm:text-lg font-bold text-neutral-900">{tour.duration} {t('tourModal.info.hours')}</div>
                </div>
                <div className="text-center p-4 sm:p-5 bg-white rounded-xl border-2 border-neutral-300 shadow-sm">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 sm:mb-2.5 text-neutral-900" />
                  <div className="font-semibold text-xs text-neutral-800 uppercase tracking-wide mb-1">{t('tourModal.info.capacity')}</div>
                  <div className="text-base sm:text-lg font-bold text-neutral-900">{t('tours.capacity')} {tour.maxCapacity} {t('tourModal.info.people')}</div>
                </div>
                <div className="text-center p-4 sm:p-5 bg-white rounded-xl border-2 border-neutral-300 shadow-sm">
                  <div className="font-semibold text-xs text-neutral-800 uppercase tracking-wide mb-1">{t('tourModal.info.difficulty')}</div>
                  <div className="text-base sm:text-lg font-bold text-neutral-900">{tour.difficulty}</div>
                </div>
              </div>
              
              {/* Itinerary */}
              {tour.itinerary && tour.itinerary.length > 0 && (
                <div className="mt-4 sm:mt-6 mb-4 sm:mb-6">
                  <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-neutral-900">{t('tourModal.info.itinerary')}</h3>
                  <ul className="space-y-2 sm:space-y-2.5">
                    {tour.itinerary.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-700 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-neutral-700 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Includes */}
              {tour.includes && tour.includes.length > 0 && (
                <div className="mt-4 sm:mt-6">
                  <h4 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base text-neutral-900">{t('tourModal.info.includes')}</h4>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {tour.includes.map((item, index) => (
                      <li key={index} className="flex items-start text-xs sm:text-sm text-neutral-700">
                        <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-600 mr-2 sm:mr-2.5 mt-0.5 flex-shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Availability Tab */}
          {activeStep === 'availability' && (
            <div>
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  {t('tourModal.availability.selectDate')}
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border-2 border-neutral-300 rounded-xl px-4 py-3 sm:py-2.5 text-base sm:text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all touch-manipulation"
                />
              </div>
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  {t('tourModal.availability.selectTime')}
                </label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full border-2 border-neutral-300 rounded-xl px-4 py-3 sm:py-2.5 text-base sm:text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all touch-manipulation"
                >
                  <option value="">{t('tourModal.availability.selectHour')}</option>
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
              <div className="mb-4 sm:mb-6">
                <label className="block text-sm font-medium text-neutral-900 mb-2">
                  {t('tourModal.availability.participants')}
                </label>
                <input
                  type="number"
                  min="1"
                  max={tour.maxCapacity}
                  value={participants}
                  onChange={(e) => setParticipants(parseInt(e.target.value) || 1)}
                  className="w-full border-2 border-neutral-300 rounded-xl px-4 py-3 sm:py-2.5 text-base sm:text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all touch-manipulation"
                />
              </div>
              <div className="mb-4 sm:mb-6">
                <h3 className="font-semibold mb-3 sm:mb-4 text-neutral-900 text-base sm:text-lg">{t('tourModal.availability.calendar')}</h3>
                <div className="bg-white p-2 sm:p-4 rounded-xl border-2 border-neutral-300 shadow-sm overflow-x-auto">
                  <FullCalendarDynamic
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    locale={language === 'es' ? esLocale : enLocale}
                    events={events}
                    headerToolbar={{
                      left: 'prev,next',
                      center: 'title',
                      right: '',
                    }}
                    height="auto"
                    aspectRatio={1.8}
                    eventContent={(eventInfo) => {
                      const { capacity, booked, available } = eventInfo.event.extendedProps
                      return (
                        <div className="p-1">
                          <div className="font-semibold text-xs text-white">{eventInfo.event.title}</div>
                          {available && (
                            <div className="text-xs text-white">
                              {booked}/{capacity}
                            </div>
                          )}
                        </div>
                      )
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded mr-2 flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm text-neutral-900 font-medium">{t('tourModal.availability.available')}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded mr-2 flex-shrink-0"></div>
                  <span className="text-xs sm:text-sm text-neutral-900 font-medium">{t('tourModal.availability.unavailable')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Reserve Tab */}
          {activeStep === 'reserve' && (
            <form onSubmit={handleSubmit(onReserveSubmit)}>
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white p-4 sm:p-5 rounded-xl border-2 border-neutral-300 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 mb-2">
                    <span className="font-semibold text-sm sm:text-base text-neutral-900">{t('tourModal.reserve.tour')}</span>
                    <span className="text-sm sm:text-base text-neutral-900 font-medium break-words">
                      {(() => {
                        const translatedTitle = t(`tours.tourTitles.${tour.id}`)
                        return translatedTitle && translatedTitle !== `tours.tourTitles.${tour.id}` ? translatedTitle : tour.title
                      })()}
                    </span>
                  </div>
                  {selectedDate && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 mb-2">
                      <span className="font-semibold text-sm sm:text-base text-neutral-900">{t('tourModal.reserve.date')}</span>
                      <span className="text-sm sm:text-base text-neutral-900 font-medium">{selectedDate}</span>
                    </div>
                  )}
                  {selectedTime && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 mb-2">
                      <span className="font-semibold text-sm sm:text-base text-neutral-900">{t('tourModal.reserve.time')}</span>
                      <span className="text-sm sm:text-base text-neutral-900 font-medium">{selectedTime}</span>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0 pt-2 border-t border-neutral-300">
                    <span className="text-base sm:text-lg font-bold text-neutral-900">{t('tourModal.reserve.participants')}</span>
                    <span className="text-lg sm:text-xl font-bold text-neutral-900">{participants} {t('tourModal.reserve.persons')}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">
                      {t('tourModal.reserve.name')}
                    </label>
                    <input
                      {...register('name', { required: true })}
                      className="w-full border-2 border-neutral-300 rounded-xl px-4 py-3 sm:py-2.5 text-base sm:text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all touch-manipulation"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{t('tourModal.reserve.required')}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">
                      {t('tourModal.reserve.email')}
                    </label>
                    <input
                      type="email"
                      {...register('email', { required: true })}
                      className="w-full border-2 border-neutral-300 rounded-xl px-4 py-3 sm:py-2.5 text-base sm:text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all touch-manipulation"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{t('tourModal.reserve.required')}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">
                      {t('tourModal.reserve.phone')}
                    </label>
                    <input
                      type="tel"
                      {...register('phone', { required: true })}
                      className="w-full border-2 border-neutral-300 rounded-xl px-4 py-3 sm:py-2.5 text-base sm:text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all touch-manipulation"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{t('tourModal.reserve.required')}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-900 mb-2">
                      {t('tourModal.reserve.country')}
                    </label>
                    <input
                      {...register('country')}
                      className="w-full border-2 border-neutral-300 rounded-xl px-4 py-3 sm:py-2.5 text-base sm:text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all touch-manipulation"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 pt-4 border-t">
                  <Link
                    href="/tours"
                    onClick={onClose}
                    className="flex items-center gap-2 px-6 py-3 sm:py-2.5 border-2 border-primary-600 text-primary-600 rounded-xl hover:bg-primary-50 transition-all duration-200 touch-manipulation active:bg-primary-100 text-sm sm:text-base font-medium"
                  >
                    <ExternalLink size={18} />
                    {t('nav.tours')}
                  </Link>
                  <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full sm:w-auto px-6 py-3 sm:py-2.5 border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-all duration-200 text-neutral-700 hover:text-neutral-900 touch-manipulation active:bg-neutral-100 text-sm sm:text-base font-medium"
                    >
                      {t('tourModal.reserve.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !selectedDate || !selectedTime}
                      className="w-full sm:w-auto px-8 py-3 bg-neutral-900 text-white rounded-xl font-semibold hover:bg-neutral-800 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-900 touch-manipulation active:bg-neutral-700 text-sm sm:text-base"
                    >
                      {loading ? t('tourModal.reserve.processing') : t('tourModal.reserve.submit')}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

