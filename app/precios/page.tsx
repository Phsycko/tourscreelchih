import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

async function getTours() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/tours`, {
    cache: 'no-store',
  })
  if (!res.ok) return []
  return res.json()
}

export default async function PricesPage() {
  const tours = await getTours()

  const pricePlans = [
    {
      name: 'Individual',
      description: 'Perfecto para viajeros solos',
      price: 'Desde $50',
      features: [
        'Tour guiado personalizado',
        'Transporte incluido',
        'Guía experto',
        'Seguro de viaje',
      ],
    },
    {
      name: 'Pareja',
      description: 'Ideal para dos personas',
      price: 'Desde $90',
      features: [
        'Tour guiado personalizado',
        'Transporte privado',
        'Guía experto',
        'Seguro de viaje',
        'Descuento por pareja',
      ],
    },
    {
      name: 'Familiar',
      description: 'Para toda la familia',
      price: 'Desde $150',
      features: [
        'Tour guiado personalizado',
        'Transporte privado',
        'Guía experto',
        'Seguro de viaje',
        'Descuento familiar',
        'Actividades para niños',
      ],
    },
    {
      name: 'Privado',
      description: 'Experiencia exclusiva',
      price: 'Desde $200',
      features: [
        'Tour completamente privado',
        'Transporte de lujo',
        'Guía experto dedicado',
        'Seguro de viaje premium',
        'Itinerario personalizado',
        'Comidas incluidas',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Precios y Planes</h1>
          <p className="text-gray-600 text-lg">Elige el plan que mejor se adapte a tus necesidades</p>
        </div>

        {/* Price Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {pricePlans.map((plan, index) => (
            <div
              key={plan.name}
              className={`bg-white rounded-lg shadow-md p-8 ${
                index === 3 ? 'border-2 border-primary-600 transform scale-105' : ''
              }`}
            >
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-600 mb-4">{plan.description}</p>
              <div className="text-3xl font-bold text-primary-600 mb-6">{plan.price}</div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle size={20} className="mr-2 text-green-600 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/reservar"
                className="block w-full text-center bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Reservar
              </Link>
            </div>
          ))}
        </div>

        {/* Tours Prices */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold mb-6">Precios por Tour</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour: any) => (
              <div key={tour.id} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-2">{tour.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{tour.description.substring(0, 100)}...</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary-600">${tour.price}</span>
                  <Link
                    href={`/tours/${tour.id}`}
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Ver Detalle →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-primary-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Información Importante</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• Todos los precios incluyen impuestos</li>
            <li>• Cancelación gratuita hasta 24 horas antes</li>
            <li>• Pago seguro con Stripe o Mercado Pago</li>
            <li>• Descuentos disponibles para grupos grandes</li>
            <li>• Precios pueden variar según temporada</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

