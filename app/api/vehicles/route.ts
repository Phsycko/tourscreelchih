import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Vehículos existentes
const defaultVehicles = [
  {
    id: 'vehicle-1',
    name: 'Van Comfort',
    type: 'Van',
    capacity: 12,
    description: 'Van cómoda y espaciosa, ideal para grupos medianos.',
    images: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
    ],
    amenities: [
      'Aire acondicionado',
      'Asientos reclinables',
      'WiFi',
      'Sistema de sonido',
    ],
    isActive: true,
  },
  {
    id: 'vehicle-2',
    name: 'SUV Premium',
    type: 'SUV',
    capacity: 6,
    description: 'SUV de lujo con todas las comodidades para grupos pequeños.',
    images: [
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800',
    ],
    amenities: [
      'Aire acondicionado',
      'Asientos de cuero',
      'Pantalla de entretenimiento',
      'WiFi',
      'Cargador USB',
    ],
    isActive: true,
  },
]

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })

    if (vehicles.length > 0) {
      return NextResponse.json(vehicles)
    }
    
    return NextResponse.json(defaultVehicles)
  } catch (error: any) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(defaultVehicles)
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const vehicle = await prisma.vehicle.create({
      data: body,
    })

    return NextResponse.json(vehicle, { status: 201 })
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return NextResponse.json(
      { error: 'Error creating vehicle' },
      { status: 500 }
    )
  }
}

