'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Clock, Eye, Car } from 'lucide-react'
import toast from 'react-hot-toast'

interface Reservation {
  id: string
  date: string
  time: string
  participants: number
  totalPrice: number
  status: string
  paymentStatus: string
  tour: { title: string }
  client: { name: string; email: string; phone: string }
  vehicle: { name: string } | null
  payment?: {
    status: string
    provider: string
    transactionId?: string
  }
}

export default function ReservationsPage() {
  const router = useRouter()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('pending_approval')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchReservations()
  }, [filter])

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token')
      let url = '/api/reservations'
      
      if (filter === 'pending_approval') {
        // Filtrar reservas con pago completado pero pendientes de aprobación
        const allReservations = await fetch('/api/reservations', {
          headers: { Authorization: `Bearer ${token}` },
        }).then(res => res.json())
        
        const filtered = allReservations.filter(
          (r: Reservation) => r.paymentStatus === 'PAID' && r.status === 'PENDING'
        )
        setReservations(filtered)
        setLoading(false)
        return
      } else if (filter !== 'all') {
        url = `/api/reservations?status=${filter}`
      }
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setReservations(data)
    } catch (error) {
      console.error('Error fetching reservations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async (id: string, vehicleId?: string) => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/reservations/${id}/confirm`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vehicleId }),
      })

      if (!res.ok) {
        throw new Error('Error al confirmar la reserva')
      }

      toast.success('Reserva confirmada exitosamente')
      fetchReservations()
    } catch (error: any) {
      toast.error(error.message || 'Error al confirmar la reserva')
    }
  }

  const handleReject = async (id: string, reason?: string) => {
    if (!confirm('¿Estás seguro de que deseas rechazar esta reserva?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/reservations/${id}/reject`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      })

      if (!res.ok) {
        throw new Error('Error al rechazar la reserva')
      }

      toast.success('Reserva rechazada')
      fetchReservations()
    } catch (error: any) {
      toast.error(error.message || 'Error al rechazar la reserva')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reservas</h1>
          <p className="text-gray-600 mt-2">Gestiona todas las reservas y aprueba las que tengan pago completado</p>
          {filter === 'pending_approval' && (
            <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Clock className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Reservas Pendientes de Aprobación:</strong> Estas reservas tienen el pago completado y están esperando tu aprobación. 
                    Revisa los detalles y aprueba o rechaza según corresponda.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'pending_approval', label: 'Pendientes de Aprobación', badge: true },
              { key: 'all', label: 'Todas' },
              { key: 'PENDING', label: 'Pendientes' },
              { key: 'CONFIRMED', label: 'Confirmadas' },
              { key: 'CANCELLED', label: 'Canceladas' },
            ].map((status) => (
              <button
                key={status.key}
                onClick={() => setFilter(status.key)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors relative ${
                  filter === status.key
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.label}
                {status.badge && filter === 'pending_approval' && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    {reservations.filter(r => r.paymentStatus === 'PAID' && r.status === 'PENDING').length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Reservations Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tour
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participantes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehículo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pago
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {reservation.client.name}
                        </div>
                        <div className="text-sm text-gray-500">{reservation.client.email}</div>
                        <div className="text-sm text-gray-500">{reservation.client.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{reservation.tour.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(reservation.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">{reservation.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reservation.participants}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {reservation.vehicle ? (
                        <div className="flex items-center text-sm text-gray-900">
                          <Car size={16} className="mr-1" />
                          {reservation.vehicle.name}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Sin asignar</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ${reservation.totalPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          reservation.status
                        )}`}
                      >
                        {reservation.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          reservation.paymentStatus === 'PAID'
                            ? 'bg-green-100 text-green-800'
                            : reservation.paymentStatus === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {reservation.paymentStatus}
                      </span>
                      {reservation.payment?.transactionId && (
                        <div className="text-xs text-gray-500 mt-1">
                          ID: {reservation.payment.transactionId.substring(0, 8)}...
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {reservation.status === 'PENDING' && reservation.paymentStatus === 'PAID' && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleConfirm(reservation.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Aprobar Reserva"
                          >
                            <CheckCircle size={20} />
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Motivo del rechazo (opcional):')
                              handleReject(reservation.id, reason || undefined)
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Rechazar Reserva"
                          >
                            <XCircle size={20} />
                          </button>
                        </div>
                      )}
                      {reservation.status === 'PENDING' && reservation.paymentStatus !== 'PAID' && (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Esperando pago</span>
                        </div>
                      )}
                      {reservation.status === 'CONFIRMED' && (
                        <span className="text-xs text-green-600">✓ Confirmada</span>
                      )}
                      <button className="text-primary-600 hover:text-primary-900 ml-2">
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {reservations.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600">No hay reservas disponibles</p>
          </div>
        )}
      </div>
    </div>
  )
}

