'use client'

import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es'

interface Availability {
  id: string
  tourId: string
  date: string
  available: boolean
  capacity: number
  booked: number
  tour: {
    id: string
    title: string
  }
}

export default function AvailabilityPage() {
  const [availability, setAvailability] = useState<Availability[]>([])
  const [selectedTour, setSelectedTour] = useState<string>('all')
  const [tours, setTours] = useState<any[]>([])

  useEffect(() => {
    fetchTours()
    fetchAvailability()
  }, [selectedTour])

  const fetchTours = async () => {
    const res = await fetch('/api/tours')
    const data = await res.json()
    setTours(data)
  }

  const fetchAvailability = async () => {
    const url = selectedTour === 'all' 
      ? '/api/availability'
      : `/api/availability?tourId=${selectedTour}`
    const res = await fetch(url)
    const data = await res.json()
    setAvailability(Array.isArray(data) ? data : [])
  }

  const events = (availability || []).map((avail) => ({
    title: avail.tour.title,
    date: avail.date,
    backgroundColor: avail.available ? '#10b981' : '#ef4444',
    borderColor: avail.available ? '#10b981' : '#ef4444',
    extendedProps: {
      capacity: avail.capacity,
      booked: avail.booked,
      available: avail.available,
    },
  }))

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Disponibilidad</h1>
          <p className="text-gray-600 text-lg">Consulta las fechas disponibles para nuestros tours</p>
        </div>

        {/* Tour Filter */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por Tour
          </label>
          <select
            value={selectedTour}
            onChange={(e) => setSelectedTour(e.target.value)}
            className="w-full md:w-auto border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="all">Todos los Tours</option>
            {tours.map((tour) => (
              <option key={tour.id} value={tour.id}>
                {tour.title}
              </option>
            ))}
          </select>
        </div>

        {/* Legend */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="font-semibold mb-4">Leyenda</h3>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
              <span>Disponible</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
              <span>No Disponible / Lleno</span>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale={esLocale}
            events={events}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
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
    </div>
  )
}

