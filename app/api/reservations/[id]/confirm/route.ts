import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { notifyReservationConfirmed } from '@/lib/notifications'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    const { vehicleId } = await request.json()

    const reservation = await prisma.reservation.update({
      where: { id: params.id },
      data: {
        status: 'CONFIRMED',
        userId: payload.userId,
        vehicleId: vehicleId || undefined,
      },
      include: {
        tour: true,
        client: true,
        vehicle: true,
      },
    })

    await notifyReservationConfirmed(reservation.id)

    return NextResponse.json(reservation)
  } catch (error: any) {
    console.error('Error confirming reservation:', error)
    return NextResponse.json(
      { error: error.message || 'Error confirming reservation' },
      { status: 500 }
    )
  }
}

