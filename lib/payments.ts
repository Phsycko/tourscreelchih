import Stripe from 'stripe'
import { MercadoPagoConfig, Preference } from 'mercadopago'
import { prisma } from './prisma'
import { createNotification } from './notifications'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
})

const mercadoPagoClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
})

export async function createStripePaymentIntent(
  amount: number,
  currency: string = 'usd',
  metadata?: Record<string, string>
) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency,
    metadata,
  })

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  }
}

export async function createMercadoPagoPreference(
  amount: number,
  title: string,
  reservationId: string,
  clientEmail: string
) {
  const preference = new Preference(mercadoPagoClient)

  const response = await preference.create({
    body: {
      items: [
        {
          id: `tour-${Date.now()}`,
          title,
          quantity: 1,
          unit_price: amount,
        },
      ],
      payer: {
        email: clientEmail,
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/reservas/confirmacion?reservationId=${reservationId}`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/reservas/error`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/reservas/pendiente`,
      },
      auto_return: 'approved',
      metadata: {
        reservationId,
      },
    },
  })

  return {
    preferenceId: response.id,
    initPoint: response.init_point,
  }
}

export async function verifyStripePayment(paymentIntentId: string) {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
  return paymentIntent.status === 'succeeded'
}

export async function verifyMercadoPagoPayment(paymentId: string) {
  // Implement Mercado Pago verification
  // This would typically involve checking the payment status via their API
  return true
}

export async function updatePaymentStatus(
  reservationId: string,
  status: 'PAID' | 'FAILED' | 'REFUNDED',
  transactionId?: string
) {
  const reservation = await prisma.reservation.update({
    where: { id: reservationId },
    data: {
      paymentStatus: status,
      payment: {
        update: {
          status: status,
          transactionId,
        },
      },
    },
    include: {
      tour: true,
      client: true,
    },
  })

  // Si el pago se completó, crear notificación para el guía
  if (status === 'PAID') {
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

  return reservation
}

