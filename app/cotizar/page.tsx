'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Plus, X, Users } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

interface Tour {
  id: string
  title: string
  duration: number
  maxCapacity: number
  image?: string
}

interface Vehicle {
  id: string
  name: string
  capacity: number
  type: string
}

interface SelectedTourItem {
  tourId: string
  tourTitle: string
  date: string
  time: string
  participants: number
}

// Componente de confirmación con plantilla WhatsApp
function ConfirmationStep({ 
  selectedTours,
  selectedVehicle, 
  vehicles,
  clientData
}: {
  selectedTours: SelectedTourItem[]
  selectedVehicle: string
  vehicles: Vehicle[]
  clientData: { name: string; email: string; phone: string; country: string }
}) {
  const vehicleData = vehicles.find(v => v.id === selectedVehicle)
  const vehicleName = vehicleData ? vehicleData.name : 'Sin preferencia (asignacion automatica)'
  
  const formData = clientData

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Por definir'
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('es-MX', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Generar lista de tours para el mensaje
  const toursListMessage = selectedTours.map((tour, index) => 
    `${index + 1}. ${tour.tourTitle}
   - Fecha: ${formatDate(tour.date)}
   - Hora: ${tour.time || 'Por definir'}
   - Personas: ${tour.participants}`
  ).join('\n\n')

  const whatsappMessage = `*NUEVA SOLICITUD DE COTIZACION*
------------------------------

*DATOS DEL CLIENTE*
- Nombre: ${formData.name || '_________________'}
- Telefono: ${formData.phone || '_________________'}
- Email: ${formData.email || '_________________'}
- Pais: ${formData.country || 'Mexico'}

*TOURS SOLICITADOS*
${toursListMessage}

*TRANSPORTE*
- Preferencia: ${vehicleName}

------------------------------
Quedo a la espera de su cotizacion.
Gracias.`

  const whatsappUrl = `https://wa.me/526351200217?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <div className="py-6">
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">¡Cotización Lista!</h2>
        <p className="text-slate-600 mt-2">Envía tu solicitud al guía por WhatsApp</p>
      </div>

      {/* Resumen de tours */}
      <div className="bg-slate-50 rounded-xl p-5 mb-6 border border-slate-200">
        <h3 className="font-semibold text-slate-800 mb-4">Tours solicitados ({selectedTours.length})</h3>
        <div className="space-y-3">
          {selectedTours.map((tour, index) => (
            <div key={index} className="bg-white p-3 rounded-lg border border-slate-200">
              <p className="font-medium text-slate-800">{tour.tourTitle}</p>
              <div className="flex gap-4 text-sm text-slate-600 mt-1">
                <span>{formatDate(tour.date)}</span>
                <span>{tour.time || 'Hora por definir'}</span>
                <span>{tour.participants} persona(s)</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200">
          <p className="text-slate-600 text-sm">
            <strong>Transporte:</strong> {vehicleName}
          </p>
        </div>
      </div>

      {/* Instrucciones */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
        <p className="text-green-800 text-center">
          <span className="font-semibold">¡Ya casi está!</span> Presiona el botón de abajo para enviar 
          tu solicitud de cotización por WhatsApp. Un guía te contactará con los precios y disponibilidad.
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
          Enviar Cotización por WhatsApp
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

function CotizarContent() {
  const searchParams = useSearchParams()
  const tourIdParam = searchParams.get('tourId')
  
  const [step, setStep] = useState(1)
  const [tours, setTours] = useState<Tour[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedTours, setSelectedTours] = useState<SelectedTourItem[]>([])
  const [currentTour, setCurrentTour] = useState<string>(tourIdParam || '')
  const [currentDate, setCurrentDate] = useState<string>('')
  const [currentTime, setCurrentTime] = useState<string>('')
  const [currentParticipants, setCurrentParticipants] = useState<number>(1)
  const [selectedVehicle, setSelectedVehicle] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm()

  useEffect(() => {
    fetchTours()
    fetchVehicles()
  }, [])

  // Si viene con tourId, agregarlo automáticamente
  useEffect(() => {
    if (tourIdParam && tours.length > 0 && selectedTours.length === 0) {
      const tour = tours.find(t => t.id === tourIdParam)
      if (tour) {
        setCurrentTour(tourIdParam)
      }
    }
  }, [tourIdParam, tours])

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

  const addTourToList = () => {
    if (!currentTour) {
      toast.error('Selecciona un tour')
      return
    }
    const tourData = tours.find(t => t.id === currentTour)
    if (!tourData) return

    setSelectedTours([...selectedTours, {
      tourId: currentTour,
      tourTitle: tourData.title,
      date: currentDate,
      time: currentTime,
      participants: currentParticipants
    }])

    // Resetear para agregar otro
    setCurrentTour('')
    setCurrentDate('')
    setCurrentTime('')
    setCurrentParticipants(1)
    toast.success(`${tourData.title} agregado a tu cotización`)
  }

  const removeTour = (index: number) => {
    setSelectedTours(selectedTours.filter((_, i) => i !== index))
  }

  const [clientData, setClientData] = useState({ name: '', email: '', phone: '', country: '' })

  const onSubmit = async (data: any) => {
    if (step === 1) {
      if (selectedTours.length === 0) {
        // Si no hay tours agregados pero hay uno seleccionado, agregarlo
        if (currentTour) {
          addTourToList()
        } else {
          toast.error('Agrega al menos un tour a tu cotización')
          return
        }
      }
      setStep(2)
      return
    }

    if (step === 2) {
      setStep(3)
      return
    }

    // Step 3 - Guardar datos y mostrar confirmación
    const clientInfo = {
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      country: data.country || 'México'
    }
    setClientData(clientInfo)

    setLoading(true)
    toast.success('¡Listo! Ahora envía tu cotización por WhatsApp')
    setStep(4)
    setLoading(false)
  }

  const totalParticipants = selectedTours.reduce((acc, t) => acc + t.participants, 0)

  return (
    <div className="min-h-screen bg-slate-100 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 text-slate-800">Solicitar Cotización</h1>
          <p className="text-slate-600">Selecciona los tours que te interesan y te enviaremos una cotización personalizada</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${
                    step >= s ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
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
            <span className={step >= 1 ? 'text-primary-600' : ''}>Tours</span>
            <span className={step >= 2 ? 'text-primary-600' : ''}>Transporte</span>
            <span className={step >= 3 ? 'text-primary-600' : ''}>Datos</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl shadow-lg p-8">
          {/* Step 1: Select Tours */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-slate-800">Selecciona tus Tours</h2>
              
              {/* Tours ya agregados */}
              {selectedTours.length > 0 && (
                <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-3">Tours en tu cotización ({selectedTours.length})</h3>
                  <div className="space-y-2">
                    {selectedTours.map((tour, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-800">{tour.tourTitle}</p>
                          <p className="text-sm text-slate-600">
                            {tour.date || 'Fecha por definir'} • {tour.time || 'Hora por definir'} • {tour.participants} persona(s)
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTour(index)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agregar nuevo tour */}
              <div className="space-y-4 p-4 bg-slate-50 rounded-xl">
                <h3 className="font-semibold text-slate-700">Agregar tour</h3>
                
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Tour</label>
                  <select
                    value={currentTour}
                    onChange={(e) => setCurrentTour(e.target.value)}
                    className="w-full border-2 border-slate-300 bg-white rounded-lg px-4 py-3 text-slate-800"
                  >
                    <option value="">Selecciona un tour</option>
                    {tours.map((tour) => (
                      <option key={tour.id} value={tour.id}>{tour.title} ({tour.duration}h)</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Fecha preferida</label>
                    <input
                      type="date"
                      value={currentDate}
                      onChange={(e) => setCurrentDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border-2 border-slate-300 bg-white rounded-lg px-4 py-3 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Hora preferida</label>
                    <select
                      value={currentTime}
                      onChange={(e) => setCurrentTime(e.target.value)}
                      className="w-full border-2 border-slate-300 bg-white rounded-lg px-4 py-3 text-slate-800"
                    >
                      <option value="">Por definir</option>
                      <option value="06:00">06:00 AM</option>
                      <option value="07:00">07:00 AM</option>
                      <option value="08:00">08:00 AM</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Personas</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={currentParticipants}
                      onChange={(e) => setCurrentParticipants(parseInt(e.target.value) || 1)}
                      className="w-full border-2 border-slate-300 bg-white rounded-lg px-4 py-3 text-slate-800"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addTourToList}
                  disabled={!currentTour}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={20} />
                  Agregar a cotización
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Select Vehicle */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-slate-800">Preferencia de Transporte (Opcional)</h2>
              <div className="space-y-4">
                <div
                  onClick={() => setSelectedVehicle('')}
                  className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedVehicle === ''
                      ? 'border-primary-600 bg-primary-50 shadow-md'
                      : 'border-slate-200 bg-slate-50 hover:border-primary-300'
                  }`}
                >
                  <span className={`font-semibold ${selectedVehicle === '' ? 'text-primary-700' : 'text-slate-700'}`}>
                    Sin preferencia (El guía asignará el mejor vehículo)
                  </span>
                </div>
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle.id)}
                    className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedVehicle === vehicle.id
                        ? 'border-primary-600 bg-primary-50 shadow-md'
                        : 'border-slate-200 bg-slate-50 hover:border-primary-300'
                    }`}
                  >
                    <h3 className={`font-bold ${selectedVehicle === vehicle.id ? 'text-primary-700' : 'text-slate-800'}`}>
                      {vehicle.name}
                    </h3>
                    <p className="text-sm text-slate-600">{vehicle.type} - Capacidad: {vehicle.capacity}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Client Data */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-slate-800">Tus Datos de Contacto</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nombre Completo *</label>
                    <input
                      {...register('name', { required: true })}
                      placeholder="Tu nombre completo"
                      className="w-full border-2 border-slate-300 bg-slate-50 rounded-lg px-4 py-3 text-slate-800 placeholder-slate-400"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                    <input
                      type="email"
                      {...register('email', { required: true })}
                      placeholder="tu@email.com"
                      className="w-full border-2 border-slate-300 bg-slate-50 rounded-lg px-4 py-3 text-slate-800 placeholder-slate-400"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      {...register('phone', { required: true })}
                      placeholder="+52 123 456 7890"
                      className="w-full border-2 border-slate-300 bg-slate-50 rounded-lg px-4 py-3 text-slate-800 placeholder-slate-400"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">Este campo es requerido</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">País</label>
                    <input
                      {...register('country')}
                      placeholder="México"
                      className="w-full border-2 border-slate-300 bg-slate-50 rounded-lg px-4 py-3 text-slate-800 placeholder-slate-400"
                    />
                  </div>
                </div>

                {/* Resumen */}
                <div className="bg-slate-100 p-5 rounded-lg border border-slate-200">
                  <h3 className="font-semibold text-slate-800 mb-3">Resumen de tu solicitud</h3>
                  <div className="space-y-2 text-sm text-slate-600">
                    <p><strong>Tours:</strong> {selectedTours.length}</p>
                    <p><strong>Total personas:</strong> {totalParticipants}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <ConfirmationStep 
              selectedTours={selectedTours}
              selectedVehicle={selectedVehicle}
              vehicles={vehicles}
              clientData={clientData}
            />
          )}

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="flex justify-between mt-8 pt-8 border-t border-slate-200">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50"
                >
                  Anterior
                </button>
              )}
              <button
                type="submit"
                disabled={loading || (step === 1 && selectedTours.length === 0 && !currentTour)}
                className="ml-auto px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? 'Procesando...' : step === 3 ? 'Enviar Cotización' : 'Siguiente'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default function CotizarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-100 pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    }>
      <CotizarContent />
    </Suspense>
  )
}

