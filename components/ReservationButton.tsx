'use client'

import Link from 'next/link'
import { Calendar } from 'lucide-react'

export default function ReservationButton({ tour }: { tour: any }) {
  return (
    <Link
      href={`/reservar?tourId=${tour.id}`}
      className="inline-flex items-center justify-center w-full md:w-auto bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-700 transition-colors shadow-lg"
    >
      <Calendar size={20} className="mr-2" />
      Reservar Ahora
    </Link>
  )
}

