'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Calendar, Users, CreditCard, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface Tour {
  id: string
  title: string
  price: number
  maxCapacity: number
  image?: string
}

interface Vehicle {
  id: string
  name: string
  capacity: number
  type: string
}

// Componente de confirmación con plantilla WhatsApp
function ConfirmationStep({ 
  selectedTourData, 
  selectedDate, 
  selectedTime, 
  participants, 
  paymentMethod, 
  selectedVehicle, 
  vehicles,
  totalPrice,
  clientData
}: {
  selectedTourData: Tour | null | undefined
  selectedDate: string
  selectedTime: string
  participants: number
  paymentMethod: string
  selectedVehicle: string
  vehicles: Vehicle[]
  totalPrice: number
  clientData: { name: string; email: string; phone: string; country: string }
}) {
  const vehicleData = vehicles.find(v => v.id === selectedVehicle)
  const vehicleName = vehicleData ? vehicleData.name : 'Sin preferencia (asignación automática)'
  
  // Usar datos del cliente pasados como prop
  const formData = clientData

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'No seleccionada'
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('es-MX', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const whatsappMessage = `*NUEVA SOLICITUD DE RESERVA*
------------------------------

*DATOS DEL CLIENTE*
- Nombre: ${formData.name || '_________________'}
- Telefono: ${formData.phone || '_________________'}
- Email: ${formData.email || '_________________'}
- Pais: ${formData.country || 'Mexico'}

*DETALLES DEL TOUR*
- Tour: ${selectedTourData?.title || 'No seleccionado'}
- Fecha: ${formatDate(selectedDate)}
- Hora: ${selectedTime || 'No seleccionada'}
- Personas: ${participants}
- Transporte: ${vehicleName}

*PAGO*
- Metodo: ${paymentMethod === 'transferencia' ? 'Transferencia Bancaria' : 'Deposito en Banco'}
- Total: $${totalPrice.toLocaleString()} MXN
------------------------------`

  const whatsappUrl = `https://wa.me/526351200217?text=${encodeURIComponent(whatsappMessage)}`

  // Obtener imagen del tour
  const tourImage = (selectedTourData as any)?.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'

  return (
    <div className="py-6">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">¡Reserva Lista!</h2>
        <p className="text-slate-600 mt-2">Envía esta información al guía por WhatsApp</p>
      </div>

      {/* Imagen del tour */}
      <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
        <img 
          src={tourImage} 
          alt={selectedTourData?.title || 'Tour'} 
          className="w-full h-48 object-cover"
        />
        <div className="bg-primary-600 text-white p-3 text-center">
          <p className="font-bold text-lg">{selectedTourData?.title}</p>
        </div>
      </div>

      {/* Resumen de datos */}
      <div className="bg-slate-50 rounded-xl p-5 mb-6 border border-slate-200">
        <h3 className="font-semibold text-slate-800 mb-4">Resumen de tu reserva</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-500">Tour:</span>
            <p className="font-medium text-slate-800">{selectedTourData?.title || '-'}</p>
          </div>
          <div>
            <span className="text-slate-500">Fecha:</span>
            <p className="font-medium text-slate-800">{formatDate(selectedDate)}</p>
          </div>
          <div>
            <span className="text-slate-500">Hora:</span>
            <p className="font-medium text-slate-800">{selectedTime || '-'}</p>
          </div>
          <div>
            <span className="text-slate-500">Personas:</span>
            <p className="font-medium text-slate-800">{participants}</p>
          </div>
          <div>
            <span className="text-slate-500">Transporte:</span>
            <p className="font-medium text-slate-800">{vehicleName}</p>
          </div>
          <div>
            <span className="text-slate-500">Pago:</span>
            <p className="font-medium text-slate-800">{paymentMethod === 'transferencia' ? 'Transferencia' : 'Deposito'}</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
          <span className="text-slate-600 font-medium">Total a pagar:</span>
          <span className="text-2xl font-bold text-primary-600">${totalPrice.toLocaleString()} MXN</span>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
        <p className="text-green-800 text-center">
          <span className="font-semibold">¡Ya casi está!</span> Presiona el botón de abajo para enviar 
          tu solicitud por WhatsApp y uno de nuestros guías te contactará para confirmar tu aventura.
        </p>
      </div>

      {/* Botones de acción */}
      <div className="space-y-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full bg-green-500 text-white px-6 py-4 rounded-xl font-semibold hover:bg-green-600 shadow-lg transition-all text-lg"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Enviar Solicitud por WhatsApp
        </a>
        <a
          href="/"
          className="flex items-center justify-center w-full bg-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-300 transition-all"
        >
          Volver al Inicio
        </a>
      </div>
    </div>
  )
}

function ReservarContent() {
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
  const [paymentMethod, setPaymentMethod] = useState<string>('transferencia')
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

  const [clientData, setClientData] = useState({ name: '', email: '', phone: '', country: '' })

  const onSubmit = async (data: any) => {
    if (step < 4) {
      setStep(step + 1)
      return
    }

    // Guardar datos del cliente para la plantilla
    const clientInfo = {
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      country: data.country || 'México'
    }
    setClientData(clientInfo)
    sessionStorage.setItem('reservationData', JSON.stringify(clientInfo))

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

      // Intentar guardar en la API (puede fallar si no hay BD)
      try {
        const res = await fetch('/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reservationData),
        })
      } catch (apiError) {
        console.log('API no disponible, continuando con WhatsApp')
      }
      
      // Siempre mostrar confirmación para enviar por WhatsApp
      toast.success('¡Listo! Ahora envía los datos al guía por WhatsApp')
      setStep(5)
    } catch (error: any) {
      toast.error(error.message || 'Error al crear la reserva')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-slate-800">Reservar Tour</h1>
          <p className="text-slate-600">Completa los siguientes pasos para realizar tu reserva</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${
                    step >= s ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {s}
                </div>
                {s < 4 && (
                  <div
                    className={`flex-1 h-1.5 mx-3 rounded-full ${
                      step > s ? 'bg-primary-600' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-sm font-medium text-slate-600">
            <span className={step >= 1 ? 'text-primary-600' : ''}>Tour</span>
            <span className={step >= 2 ? 'text-primary-600' : ''}>Fecha</span>
            <span className={step >= 3 ? 'text-primary-600' : ''}>Vehículo</span>
            <span className={step >= 4 ? 'text-primary-600' : ''}>Datos</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg p-8">
          {/* Step 1: Select Tour */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-slate-800">Selecciona un Tour</h2>
              <div className="space-y-4">
                {Array.isArray(tours) && tours.length > 0 ? tours.map((tour) => (
                  <div
                    key={tour.id}
                    onClick={() => setSelectedTour(tour.id)}
                    className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedTour === tour.id
                        ? 'border-primary-600 bg-primary-50 shadow-md'
                        : 'border-slate-200 bg-slate-50 hover:border-primary-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className={`font-bold text-lg ${selectedTour === tour.id ? 'text-primary-700' : 'text-slate-800'}`}>{tour.title}</h3>
                        <p className="text-slate-600">Capacidad: {tour.maxCapacity} personas</p>
                      </div>
                      <div className="text-2xl font-bold text-primary-600">${tour.price}</div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 bg-slate-50 rounded-xl">
                    <p className="text-slate-600">No hay tours disponibles en este momento.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-slate-800">Selecciona Fecha y Hora</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border-2 border-slate-300 bg-slate-50 rounded-lg px-4 py-3 text-slate-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Hora
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full border-2 border-slate-300 bg-slate-50 rounded-lg px-4 py-3 text-slate-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-colors"
                    required
                  >
                    <option value="" className="text-slate-500">Selecciona una hora</option>
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
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Número de Participantes
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedTourData?.maxCapacity || 10}
                    value={participants}
                    onChange={(e) => setParticipants(parseInt(e.target.value))}
                    className="w-full border-2 border-slate-300 bg-slate-50 rounded-lg px-4 py-3 text-slate-800 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Select Vehicle */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-slate-800">Selecciona un Vehículo (Opcional)</h2>
              <div className="space-y-4">
                <div
                  onClick={() => setSelectedVehicle('')}
                  className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedVehicle === ''
                      ? 'border-primary-600 bg-primary-50 shadow-md'
                      : 'border-slate-200 bg-slate-50 hover:border-primary-300 hover:shadow-sm'
                  }`}
                >
                  <span className={`font-semibold ${selectedVehicle === '' ? 'text-primary-700' : 'text-slate-700'}`}>Sin preferencia (Asignación automática)</span>
                </div>
                {Array.isArray(vehicles) && vehicles
                  .filter((v) => v.capacity >= participants)
                  .map((vehicle) => (
                    <div
                      key={vehicle.id}
                      onClick={() => setSelectedVehicle(vehicle.id)}
                      className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedVehicle === vehicle.id
                          ? 'border-primary-600 bg-primary-50 shadow-md'
                          : 'border-slate-200 bg-slate-50 hover:border-primary-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className={`font-bold ${selectedVehicle === vehicle.id ? 'text-primary-700' : 'text-slate-800'}`}>{vehicle.name}</h3>
                          <p className="text-sm text-slate-600">
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
              <h2 className="text-2xl font-bold mb-6 text-slate-800">Datos del Cliente y Pago</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      {...register('name', { required: true })}
                      placeholder="Tu nombre completo"
                      className="w-full border-2 border-slate-300 bg-slate-50 rounded-lg px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-colors"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      {...register('email', { required: true })}
                      placeholder="tu@email.com"
                      className="w-full border-2 border-slate-300 bg-slate-50 rounded-lg px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-colors"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      {...register('phone', { required: true })}
                      placeholder="+52 123 456 7890"
                      className="w-full border-2 border-slate-300 bg-slate-50 rounded-lg px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-colors"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      País
                    </label>
                    <input
                      {...register('country')}
                      placeholder="México"
                      className="w-full border-2 border-slate-300 bg-slate-50 rounded-lg px-4 py-3 text-slate-800 placeholder-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Método de Pago *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div
                      onClick={() => setPaymentMethod('transferencia')}
                      className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === 'transferencia'
                          ? 'border-primary-600 bg-primary-50 shadow-md'
                          : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                      }`}
                    >
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${paymentMethod === 'transferencia' ? 'bg-primary-100' : 'bg-slate-200'}`}>
                        <CreditCard className={`w-6 h-6 ${paymentMethod === 'transferencia' ? 'text-primary-600' : 'text-slate-600'}`} />
                      </div>
                      <div className={`text-center font-semibold mb-1 ${paymentMethod === 'transferencia' ? 'text-primary-700' : 'text-slate-700'}`}>Transferencia Bancaria</div>
                      <p className="text-xs text-center text-slate-500">SPEI / Transferencia electrónica</p>
                    </div>
                    <div
                      onClick={() => setPaymentMethod('deposito')}
                      className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === 'deposito'
                          ? 'border-primary-600 bg-primary-50 shadow-md'
                          : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                      }`}
                    >
                      <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${paymentMethod === 'deposito' ? 'bg-primary-100' : 'bg-slate-200'}`}>
                        <CreditCard className={`w-6 h-6 ${paymentMethod === 'deposito' ? 'text-primary-600' : 'text-slate-600'}`} />
                      </div>
                      <div className={`text-center font-semibold mb-1 ${paymentMethod === 'deposito' ? 'text-primary-700' : 'text-slate-700'}`}>Depósito en Banco</div>
                      <p className="text-xs text-center text-slate-500">Efectivo en ventanilla</p>
                    </div>
                  </div>
                  
                  {/* Datos bancarios */}
                  {(paymentMethod === 'transferencia' || paymentMethod === 'deposito') && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                      <h4 className="font-semibold text-blue-800 mb-3">📋 Datos para {paymentMethod === 'transferencia' ? 'transferencia' : 'depósito'}:</h4>
                      <div className="space-y-2 text-sm text-blue-900">
                        <p><span className="font-medium">Banco:</span> Por configurar por el guía</p>
                        <p><span className="font-medium">Titular:</span> Por configurar por el guía</p>
                        <p><span className="font-medium">CLABE:</span> Por configurar por el guía</p>
                        <p><span className="font-medium">No. Cuenta:</span> Por configurar por el guía</p>
                      </div>
                      <p className="text-xs text-blue-600 mt-3">
                        * Envía tu comprobante de pago por WhatsApp al confirmar tu reserva
                      </p>
                    </div>
                  )}
                </div>
                <div className="bg-slate-100 p-6 rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-semibold text-slate-700">Total a Pagar:</span>
                    <span className="text-3xl font-bold text-primary-600">${totalPrice}</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {participants} persona(s) × ${selectedTourData?.price} = ${totalPrice}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && (
            <ConfirmationStep 
              selectedTourData={selectedTourData}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              participants={participants}
              paymentMethod={paymentMethod}
              selectedVehicle={selectedVehicle}
              vehicles={vehicles}
              totalPrice={totalPrice}
              clientData={clientData}
            />
          )}

          {/* Navigation Buttons */}
          {step < 5 && (
            <div className="flex justify-between mt-8 pt-8 border-t border-slate-200">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all"
                >
                  Anterior
                </button>
              )}
              <button
                type="submit"
                disabled={loading || (step === 1 && !selectedTour)}
                className="ml-auto px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all"
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

export default function ReservarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-100 pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    }>
      <ReservarContent />
    </Suspense>
  )
}

