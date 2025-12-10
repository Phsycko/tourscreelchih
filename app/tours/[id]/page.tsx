import Link from 'next/link'
import { Clock, Users, CheckCircle, XCircle, ArrowLeft, Calendar } from 'lucide-react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import ReservationButton from '@/components/ReservationButton'

async function getTour(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/tours/${id}`, {
    cache: 'no-store',
  })
  if (!res.ok) return null
  return res.json()
}

export default async function TourDetailPage({ params }: { params: { id: string } }) {
  const tour = await getTour(params.id)

  if (!tour) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/tours"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Volver a Tours
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Hero Image */}
          <div className="relative h-96 w-full">
            <Image
              src={tour.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920'}
              alt={tour.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-4">{tour.title}</h1>
                <div className="flex items-center space-x-6 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Clock size={18} className="mr-2" />
                    <span>{tour.duration} horas</span>
                  </div>
                  <div className="flex items-center">
                    <Users size={18} className="mr-2" />
                    <span>Hasta {tour.maxCapacity} personas</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold">Dificultad: {tour.difficulty}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  ${tour.price}
                </div>
                <div className="text-gray-600">por persona</div>
              </div>
            </div>

            <div className="prose max-w-none mb-8">
              <p className="text-lg text-gray-700">{tour.description}</p>
            </div>

            {/* Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Itinerario</h2>
                <ul className="space-y-2">
                  {tour.itinerary.map((item: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <Calendar size={20} className="mr-3 text-primary-600 mt-1" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Includes / Excludes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle size={24} className="mr-2 text-green-600" />
                  Incluye
                </h3>
                <ul className="space-y-2">
                  {tour.includes && tour.includes.length > 0 ? (
                    tour.includes.map((item: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle size={18} className="mr-2 text-green-600 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No especificado</li>
                  )}
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <XCircle size={24} className="mr-2 text-red-600" />
                  No Incluye
                </h3>
                <ul className="space-y-2">
                  {tour.excludes && tour.excludes.length > 0 ? (
                    tour.excludes.map((item: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <XCircle size={18} className="mr-2 text-red-600 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No especificado</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Requirements */}
            {tour.requirements && tour.requirements.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Requisitos</h2>
                <ul className="list-disc list-inside space-y-2">
                  {tour.requirements.map((req: string, index: number) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Schedules */}
            {tour.schedules && tour.schedules.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Horarios Disponibles</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {tour.schedules.map((schedule: string, index: number) => (
                    <div key={index} className="bg-gray-100 p-3 rounded-lg text-center">
                      {schedule}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Policies */}
            {tour.policies && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Políticas</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="whitespace-pre-line">{tour.policies}</p>
                </div>
              </div>
            )}

            {/* Languages */}
            {tour.languages && tour.languages.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Idiomas Disponibles</h2>
                <div className="flex flex-wrap gap-2">
                  {tour.languages.map((lang: string, index: number) => (
                    <span
                      key={index}
                      className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Reservation Button */}
            <div className="mt-8 pt-8 border-t">
              <ReservationButton tour={tour} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

