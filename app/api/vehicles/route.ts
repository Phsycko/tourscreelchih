import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(vehicles)
  } catch (error: any) {
    console.error('Error fetching vehicles:', error)
    
    // Si no hay conexión a la base de datos, devolver array vacío en lugar de error
    if (error.code === 'P1001' || error.message?.includes('connect')) {
      console.warn('Base de datos no disponible, devolviendo array vacío')
      return NextResponse.json([])
    }
    
    return NextResponse.json(
      { error: 'Error fetching vehicles' },
      { status: 500 }
    )
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

