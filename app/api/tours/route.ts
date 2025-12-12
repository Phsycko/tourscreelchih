import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tours = await prisma.tour.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
    
    // Reordenar para que Tour Kokoyome aparezca primero
    const sortedTours = [...tours].sort((a, b) => {
      if (a.title === 'Tour Kokoyome') return -1
      if (b.title === 'Tour Kokoyome') return 1
      return 0
    })

    return NextResponse.json(sortedTours)
  } catch (error: any) {
    console.error('Error fetching tours:', error)
    
    // Si no hay conexión a la base de datos, devolver array vacío en lugar de error
    if (error.code === 'P1001' || error.code === 'P2002' || error.message?.includes('connect') || error.message?.includes('Can\'t reach database') || error.message?.includes('does not exist')) {
      console.warn('Base de datos no disponible, devolviendo array vacío')
      return NextResponse.json([])
    }
    
    // Para otros errores, también devolver array vacío para que la página funcione
    console.warn('Error al obtener tours, devolviendo array vacío:', error.message)
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const tour = await prisma.tour.create({
      data: body,
    })

    return NextResponse.json(tour, { status: 201 })
  } catch (error) {
    console.error('Error creating tour:', error)
    return NextResponse.json(
      { error: 'Error creating tour' },
      { status: 500 }
    )
  }
}

