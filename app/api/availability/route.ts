import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const tourId = searchParams.get('tourId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {}
    if (tourId) where.tourId = tourId
    if (startDate || endDate) {
      where.date = {}
      if (startDate) where.date.gte = new Date(startDate)
      if (endDate) where.date.lte = new Date(endDate)
    }

    const availability = await prisma.availability.findMany({
      where,
      include: {
        tour: true,
      },
      orderBy: { date: 'asc' },
    })

    return NextResponse.json(availability)
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json(
      { error: 'Error fetching availability' },
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
    const { tourId, dates, capacity } = body

    const availabilityRecords = await Promise.all(
      dates.map((date: string) =>
        prisma.availability.upsert({
          where: {
            tourId_date: {
              tourId,
              date: new Date(date),
            },
          },
          update: {
            available: body.available !== undefined ? body.available : true,
            capacity: capacity || undefined,
          },
          create: {
            tourId,
            date: new Date(date),
            available: body.available !== undefined ? body.available : true,
            capacity: capacity || undefined,
            booked: 0,
          },
        })
      )
    )

    return NextResponse.json(availabilityRecords, { status: 201 })
  } catch (error) {
    console.error('Error updating availability:', error)
    return NextResponse.json(
      { error: 'Error updating availability' },
      { status: 500 }
    )
  }
}

