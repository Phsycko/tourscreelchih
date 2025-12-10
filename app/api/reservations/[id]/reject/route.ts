import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { createNotification } from '@/lib/notifications'

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

    const { reason } = await request.json()

    const reservation = await prisma.reservation.update({
      where: { id: params.id },
      data: {
        status: 'CANCELLED',
        notes: reason || 'Reserva rechazada por el guía',
      },
      include: {
        tour: true,
        client: true,
        vehicle: true,
      },
    })

    // Liberar disponibilidad
    const availability = await prisma.availability.findUnique({
      where: {
        tourId_date: {
          tourId: reservation.tourId,
          date: reservation.date,
        },
      },
    })

    if (availability) {
      await prisma.availability.update({
        where: { id: availability.id },
        data: {
          booked: Math.max(0, availability.booked - reservation.participants),
          available: true,
        },
      })
    }

    // Crear notificación para el cliente
    await createNotification(
      'RESERVATION_CANCELLED',
      'Reserva Rechazada',
      `Tu reserva para el tour "${reservation.tour.title}" ha sido rechazada.${reason ? ` Motivo: ${reason}` : ''}`,
      undefined,
      { reservationId: reservation.id, clientId: reservation.clientId }
    )

    return NextResponse.json(reservation)
  } catch (error: any) {
    console.error('Error rejecting reservation:', error)
    return NextResponse.json(
      { error: error.message || 'Error rejecting reservation' },
      { status: 500 }
    )
  }
}

