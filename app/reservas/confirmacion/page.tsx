'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function ConfirmacionPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const reservationId = searchParams.get('reservationId')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (reservationId) {
      // Llamar al webhook para actualizar el estado del pago
      fetch('/api/payments/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservationId,
          paymentStatus: 'PAID',
          transactionId: searchParams.get('payment_id') || searchParams.get('preference_id'),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setLoading(false)
          } else {
            setError(data.error || 'Error al procesar el pago')
            setLoading(false)
          }
        })
        .catch((err) => {
          console.error('Error:', err)
          setError('Error al procesar el pago')
          setLoading(false)
        })
    } else {
      setError('No se encontró el ID de reserva')
      setLoading(false)
    }
  }, [reservationId, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Procesando pago...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/tours"
            className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700"
          >
            Volver a Tours
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Pago Completado!</h2>
        <p className="text-gray-600 mb-6">
          Tu pago ha sido procesado exitosamente. Tu reserva está pendiente de aprobación por parte del guía.
          Te notificaremos cuando sea confirmada.
        </p>
        <div className="space-y-3">
          <Link
            href="/tours"
            className="block w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Volver a Tours
          </Link>
          <Link
            href="/"
            className="block w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Ir al Inicio
          </Link>
        </div>
      </div>
    </div>
  )
}

