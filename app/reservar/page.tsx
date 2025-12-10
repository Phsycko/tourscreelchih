'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Calendar, Users, CreditCard, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface Tour {
  id: string
  title: string
  price: number
  maxCapacity: number
}

interface Vehicle {
  id: string
  name: string
  capacity: number
  type: string
}

export default function ReservarPage() {
  const searchParams = useSearchParams()
  const tourId = searchParams.get('tourId')
  
  const [step, setStep] = useState(1)
  const [tours, setTours] = useState<Tour[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedTour, setSelectedTour] = useState<string>(tourId || '')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedVehicle, setSelectedVehicle] = useState<string>('')
  const [participants, setParticipants] = useState<number>(1)
  const [paymentMethod, setPaymentMethod] = useState<string>('stripe')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    fetchTours()
    fetchVehicles()
  }, [])

  const fetchTours = async () => {
    try {
      const res = await fetch('/api/tours')
      const data = await res.json()
      setTours(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching tours:', error)
      setTours([])
    }
  }

  const fetchVehicles = async () => {
    try {
      const res = await fetch('/api/vehicles')
      const data = await res.json()
      setVehicles(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      setVehicles([])
    }
  }

  const selectedTourData = Array.isArray(tours) ? tours.find((t) => t.id === selectedTour) : null
  const totalPrice = selectedTourData ? selectedTourData.price * participants : 0

  const onSubmit = async (data: any) => {
    if (step < 4) {
      setStep(step + 1)
      return
    }

    setLoading(true)
    try {
      const reservationData = {
        tourId: selectedTour,
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
        // Redirect to Stripe payment
        window.location.href = `/reservas/pago?clientSecret=${result.payment.metadata.clientSecret}&reservationId=${result.reservation.id}`
      } else if (paymentMethod === 'mercadopago' && result.payment?.metadata?.initPoint) {
        // Redirect to Mercado Pago
        window.location.href = result.payment.metadata.initPoint
      } else {
        toast.success('Reserva creada exitosamente')
        setStep(5)
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al crear la reserva')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Reservar Tour</h1>
          <p className="text-gray-600">Completa los siguientes pasos para realizar tu reserva</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step >= s ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > s ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Tour</span>
            <span>Fecha</span>
            <span>Vehículo</span>
            <span>Datos</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-8">
          {/* Step 1: Select Tour */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Selecciona un Tour</h2>
              <div className="space-y-4">
                {Array.isArray(tours) && tours.length > 0 ? tours.map((tour) => (
                  <div
                    key={tour.id}
                    onClick={() => setSelectedTour(tour.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedTour === tour.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">{tour.title}</h3>
                        <p className="text-gray-600">Capacidad: {tour.maxCapacity} personas</p>
                      </div>
                      <div className="text-2xl font-bold text-primary-600">${tour.price}</div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No hay tours disponibles en este momento.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Selecciona Fecha y Hora</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Participantes
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedTourData?.maxCapacity || 10}
                    value={participants}
                    onChange={(e) => setParticipants(parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Select Vehicle */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Selecciona un Vehículo (Opcional)</h2>
              <div className="space-y-4">
                <div
                  onClick={() => setSelectedVehicle('')}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedVehicle === ''
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-300'
                  }`}
                >
                  <span className="font-semibold">Sin preferencia (Asignación automática)</span>
                </div>
                {Array.isArray(vehicles) && vehicles
                  .filter((v) => v.capacity >= participants)
                  .map((vehicle) => (
                    <div
                      key={vehicle.id}
                      onClick={() => setSelectedVehicle(vehicle.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedVehicle === vehicle.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold">{vehicle.name}</h3>
                          <p className="text-sm text-gray-600">
                            {vehicle.type} - Capacidad: {vehicle.capacity}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Step 4: Client Data & Payment */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Datos del Cliente y Pago</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      {...register('name', { required: true })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      {...register('email', { required: true })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      {...register('phone', { required: true })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      País
                    </label>
                    <input
                      {...register('country')}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de Pago *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      onClick={() => setPaymentMethod('stripe')}
                      className={`p-4 border-2 rounded-lg cursor-pointer ${
                        paymentMethod === 'stripe'
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <CreditCard className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-center font-semibold">Stripe</div>
                    </div>
                    <div
                      onClick={() => setPaymentMethod('mercadopago')}
                      className={`p-4 border-2 rounded-lg cursor-pointer ${
                        paymentMethod === 'mercadopago'
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <CreditCard className="w-8 h-8 mx-auto mb-2" />
                      <div className="text-center font-semibold">Mercado Pago</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold">Total a Pagar:</span>
                    <span className="text-3xl font-bold text-primary-600">${totalPrice}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {participants} persona(s) × ${selectedTourData?.price} = ${totalPrice}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && (
            <div className="text-center py-12">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">¡Reserva Creada Exitosamente!</h2>
              <p className="text-gray-600 mb-8">
                Te hemos enviado un email de confirmación. Revisaremos tu reserva y te notificaremos cuando sea confirmada.
              </p>
              <a
                href="/"
                className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700"
              >
                Volver al Inicio
              </a>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 5 && (
            <div className="flex justify-between mt-8 pt-8 border-t">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Anterior
                </button>
              )}
              <button
                type="submit"
                disabled={loading || (step === 1 && !selectedTour)}
                className="ml-auto px-8 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Procesando...' : step === 4 ? 'Reservar y Pagar' : 'Siguiente'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

