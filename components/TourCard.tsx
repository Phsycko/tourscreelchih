import Link from 'next/link'
import { Clock, Users, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export default function TourCard({ tour }: { tour: any }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all h-full flex flex-col">
      <Link href={`/tours/${tour.id}`} className="relative h-52 w-full block">
        <Image
          src={tour.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'}
          alt={tour.title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
        />
        {/* Overlay con título */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white drop-shadow-lg">{tour.title}</h3>
        </div>
      </Link>
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm flex-grow">{tour.description}</p>
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
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <Link
            href={`/tours/${tour.id}`}
            className="flex items-center text-slate-600 hover:text-slate-800 font-medium text-sm"
          >
            Ver detalles
            <ArrowRight size={16} className="ml-1" />
          </Link>
          <Link
            href={`/cotizar?tourId=${tour.id}`}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-primary-700 transition-colors"
          >
            Cotizar
          </Link>
        </div>
      </div>
    </div>
  )
}

