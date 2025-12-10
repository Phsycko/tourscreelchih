import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tour = await prisma.tour.findUnique({
      where: { id: params.id },
      include: {
        availability: {
          where: {
            date: { gte: new Date() },
            available: true,
          },
          orderBy: { date: 'asc' },
        },
      },
    })

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
    }

    return NextResponse.json(tour)
  } catch (error) {
    console.error('Error fetching tour:', error)
    return NextResponse.json(
      { error: 'Error fetching tour' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const tour = await prisma.tour.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json(tour)
  } catch (error) {
    console.error('Error updating tour:', error)
    return NextResponse.json(
      { error: 'Error updating tour' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.tour.update({
      where: { id: params.id },
      data: { isActive: false },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tour:', error)
    return NextResponse.json(
      { error: 'Error deleting tour' },
      { status: 500 }
    )
  }
}

