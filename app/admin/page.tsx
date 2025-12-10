'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, DollarSign, Users, TrendingUp, Car } from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  todayReservations: number
  monthReservations: number
  totalRevenue: number
  topTours: any[]
  vehiclesInUse: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      const [reservationsRes, toursRes, vehiclesRes] = await Promise.all([
        fetch('/api/reservations', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/tours'),
        fetch('/api/vehicles'),
      ])

      const reservations = await reservationsRes.json()
      const tours = await toursRes.json()
      const vehicles = await vehiclesRes.json()

      const today = new Date().toISOString().split('T')[0]
      const todayReservations = reservations.filter(
        (r: any) => r.date === today && r.status === 'CONFIRMED'
      ).length

      const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      const monthReservations = reservations.filter(
        (r: any) => new Date(r.date) >= monthStart && r.status === 'CONFIRMED'
      )

      const totalRevenue = monthReservations.reduce(
        (sum: number, r: any) => sum + (r.totalPrice || 0),
        0
      )

      const tourCounts: Record<string, number> = {}
      reservations.forEach((r: any) => {
        if (r.tour?.title) {
          tourCounts[r.tour.title] = (tourCounts[r.tour.title] || 0) + 1
        }
      })

      const topTours = Object.entries(tourCounts)
        .map(([title, count]) => ({ title, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      const vehiclesInUse = reservations.filter(
        (r: any) => r.status === 'CONFIRMED' && r.vehicleId
      ).length

      setStats({
        todayReservations,
        monthReservations: monthReservations.length,
        totalRevenue,
        topTours,
        vehiclesInUse,
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Resumen de tu actividad</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Reservas Hoy</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.todayReservations || 0}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-primary-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Reservas del Mes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.monthReservations || 0}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Ingresos del Mes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${stats?.totalRevenue.toFixed(2) || '0.00'}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Vehículos en Uso</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.vehiclesInUse || 0}
                </p>
              </div>
              <Car className="w-12 h-12 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Top Tours */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Tours Más Vendidos</h2>
          <div className="space-y-3">
            {stats?.topTours && stats.topTours.length > 0 ? (
              stats.topTours.map((tour, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center mr-3 font-bold">
                      {index + 1}
                    </div>
                    <span className="font-semibold">{tour.title}</span>
                  </div>
                  <span className="text-primary-600 font-bold">{tour.count} reservas</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No hay datos disponibles</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/admin/reservations"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-lg font-bold mb-2">Gestionar Reservas</h3>
            <p className="text-gray-600 text-sm">Ver y confirmar reservas pendientes</p>
          </Link>
          <Link
            href="/admin/tours"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-lg font-bold mb-2">Gestionar Tours</h3>
            <p className="text-gray-600 text-sm">Crear y editar tours</p>
          </Link>
          <Link
            href="/admin/messages"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
          >
            <h3 className="text-lg font-bold mb-2">Mensajes</h3>
            <p className="text-gray-600 text-sm">Ver mensajes de todos los canales</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

