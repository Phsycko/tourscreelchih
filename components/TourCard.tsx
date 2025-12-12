import Link from 'next/link'
import { Clock, Users, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function TourCard({ tour }: { tour: any }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      <div className="relative h-48 w-full">
        <Image
          src={tour.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'}
          alt={tour.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{tour.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{tour.description}</p>
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{tour.duration}h</span>
          </div>
          <div className="flex items-center">
            <Users size={16} className="mr-1" />
            <span>Hasta {tour.maxCapacity}</span>
          </div>

        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary-600">${tour.price}</span>
          <Link
            href={`/tours/${tour.id}`}
            className="flex items-center text-primary-600 hover:text-primary-700 font-semibold"
          >
            Ver Detalle
            <ArrowRight size={18} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  )
}

