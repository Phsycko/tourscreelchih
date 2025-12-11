import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

// Webhook para actualizar el estado del pago cuando se complete
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { reservationId, paymentStatus, transactionId } = body

    if (!reservationId || !paymentStatus) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Actualizar el estado del pago
    const reservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        paymentStatus: paymentStatus as any,
        payment: {
          update: {
            status: paymentStatus as any,
            transactionId: transactionId || undefined,
          },
        },
      },
      include: {
        tour: true,
        client: true,
        payment: true,
      },
    })

    // Si el pago se completó, crear notificación para el guía
    if (paymentStatus === 'PAID') {
      // Obtener el primer usuario guía para notificar
      const guide = await prisma.user.findFirst({
        where: { role: 'GUIDE' },
      })

      if (guide) {
        await createNotification(
          'PAYMENT_RECEIVED',
          'Pago Recibido - Pendiente de Aprobación',
          `Se recibió el pago de $${reservation.totalPrice} para la reserva del tour "${reservation.tour.title}" por ${reservation.client.name}. La reserva está pendiente de tu aprobación.`,
          guide.id,
          { reservationId: reservation.id }
        )
      }
    }

    return NextResponse.json({ success: true, reservation })
  } catch (error: any) {
    console.error('Error updating payment status:', error)
    return NextResponse.json(
      { error: error.message || 'Error updating payment status' },
      { status: 500 }
    )
  }
}


