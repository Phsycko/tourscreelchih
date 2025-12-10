import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifyNewReservation } from '@/lib/notifications'
import { createStripePaymentIntent, createMercadoPagoPreference } from '@/lib/payments'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const reservations = await prisma.reservation.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        tour: true,
        client: true,
        vehicle: true,
        user: true,
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // Incluir información del pago en la respuesta
    const reservationsWithPayment = reservations.map((reservation) => ({
      ...reservation,
      payment: reservation.payment ? {
        status: reservation.payment.status,
        provider: reservation.payment.provider,
        transactionId: reservation.payment.transactionId,
      } : null,
    }))

    return NextResponse.json(reservationsWithPayment)
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return NextResponse.json(
      { error: 'Error fetching reservations' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tourId, vehicleId, client, date, time, participants, paymentMethod } = body

    // Get tour to calculate price
    const tour = await prisma.tour.findUnique({
      where: { id: tourId },
    })

    if (!tour) {
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
    }

    // Check availability
    const availability = await prisma.availability.findUnique({
      where: {
        tourId_date: {
          tourId,
          date: new Date(date),
        },
      },
    })

    if (!availability || !availability.available) {
      return NextResponse.json(
        { error: 'Date not available' },
        { status: 400 }
      )
    }

    if (availability.booked + participants > availability.capacity) {
      return NextResponse.json(
        { error: 'Not enough capacity' },
        { status: 400 }
      )
    }

    // Create or get client
    let clientRecord = await prisma.client.findUnique({
      where: { email: client.email },
    })

    if (!clientRecord) {
      clientRecord = await prisma.client.create({
        data: {
          name: client.name,
          email: client.email,
          phone: client.phone,
          country: client.country,
        },
      })
    }

    // Calculate total price
    const totalPrice = tour.price * participants

    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        tourId,
        vehicleId,
        clientId: clientRecord.id,
        date: new Date(date),
        time,
        participants,
        totalPrice,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod,
      },
    })

    // Update availability
    await prisma.availability.update({
      where: { id: availability.id },
      data: {
        booked: availability.booked + participants,
        available: availability.booked + participants < availability.capacity,
      },
    })

    // Create payment record
    let paymentData: any = {
      reservationId: reservation.id,
      amount: totalPrice,
      status: 'PENDING',
      provider: paymentMethod === 'stripe' ? 'STRIPE' : 'MERCADOPAGO',
    }

    if (paymentMethod === 'stripe') {
      const { clientSecret, paymentIntentId } = await createStripePaymentIntent(
        totalPrice,
        'usd',
        { reservationId: reservation.id }
      )
      paymentData.providerId = paymentIntentId
      paymentData.metadata = { clientSecret }
    } else if (paymentMethod === 'mercadopago') {
      const { preferenceId, initPoint } = await createMercadoPagoPreference(
        totalPrice,
        tour.title,
        reservation.id,
        client.email
      )
      paymentData.providerId = preferenceId
      paymentData.metadata = { initPoint }
    }

    await prisma.payment.create({
      data: paymentData,
    })

    // Send notifications
    await notifyNewReservation(reservation.id)

    return NextResponse.json(
      {
        reservation,
        payment: paymentData,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating reservation:', error)
    return NextResponse.json(
      { error: error.message || 'Error creating reservation' },
      { status: 500 }
    )
  }
}

