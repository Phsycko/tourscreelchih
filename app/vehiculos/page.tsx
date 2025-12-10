import { Users, Car, CheckCircle } from 'lucide-react'
import Image from 'next/image'

async function getVehicles() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/vehicles`, {
    cache: 'no-store',
  })
  if (!res.ok) return []
  return res.json()
}

export default async function VehiclesPage() {
  const vehicles = await getVehicles()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestra Flota</h1>
          <p className="text-gray-600 text-lg">Vehículos cómodos y seguros para todos nuestros tours</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((vehicle: any) => (
            <div key={vehicle.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              {vehicle.images && vehicle.images.length > 0 && (
                <div className="relative h-64 w-full">
                  <Image
                    src={vehicle.images[0]}
                    alt={vehicle.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{vehicle.name}</h3>
                <p className="text-gray-600 mb-4">{vehicle.description}</p>
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Users size={16} className="mr-1" />
                    <span>Capacidad: {vehicle.capacity}</span>
                  </div>
                  <div className="flex items-center">
                    <Car size={16} className="mr-1" />
                    <span>{vehicle.type}</span>
                  </div>
                </div>
                {vehicle.amenities && vehicle.amenities.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Comodidades:</h4>
                    <div className="flex flex-wrap gap-2">
                      {vehicle.amenities.map((amenity: string, index: number) => (
                        <span
                          key={index}
                          className="flex items-center text-sm bg-gray-100 px-3 py-1 rounded-full"
                        >
                          <CheckCircle size={14} className="mr-1 text-green-600" />
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t">
                  <span className="text-sm text-gray-500">
                    {vehicle.isActive ? 'Disponible' : 'No disponible'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {vehicles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No hay vehículos disponibles en este momento.</p>
          </div>
        )}
      </div>
    </div>
  )
}

