import { prisma } from './prisma'
import nodemailer from 'nodemailer'
import twilio from 'twilio'

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const emailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendWhatsAppMessage(to: string, message: string) {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID) {
      console.log('WhatsApp not configured, skipping:', message)
      return
    }

    await twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${to}`,
      body: message,
    })
  } catch (error) {
    console.error('Error sending WhatsApp:', error)
  }
}

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    if (!process.env.SMTP_USER) {
      console.log('Email not configured, skipping:', subject)
      return
    }

    await emailTransporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    })
  } catch (error) {
    console.error('Error sending email:', error)
  }
}

export async function createNotification(
  type: string,
  title: string,
  message: string,
  userId?: string,
  metadata?: any
) {
  await prisma.notification.create({
    data: {
      type: type as any,
      title,
      message,
      userId,
      metadata,
    },
  })
}

export async function notifyNewReservation(reservationId: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      tour: true,
      client: true,
      vehicle: true,
    },
  })

  if (!reservation) return

  // Notify guide
  const guides = await prisma.user.findMany({
    where: { role: 'GUIDE' },
  })

  for (const guide of guides) {
    await createNotification(
      'NEW_RESERVATION',
      'Nueva Reserva',
      `Nueva reserva de ${reservation.client.name} para el tour ${reservation.tour.title}`,
      guide.id,
      { reservationId }
    )

    // WhatsApp to guide
    await sendWhatsAppMessage(
      process.env.TWILIO_WHATSAPP_TO || '',
      `🔔 Nueva Reserva\n\nCliente: ${reservation.client.name}\nTour: ${reservation.tour.title}\nFecha: ${reservation.date}\nParticipantes: ${reservation.participants}`
    )
  }

  // Notify client
  const confirmationMessage = `
✅ Reserva Recibida

Hola ${reservation.client.name},

Tu reserva ha sido recibida:
- Tour: ${reservation.tour.title}
- Fecha: ${reservation.date}
- Participantes: ${reservation.participants}
- Total: $${reservation.totalPrice}

Te notificaremos cuando sea confirmada.

Gracias por elegirnos!
  `.trim()

  await sendWhatsAppMessage(reservation.client.phone, confirmationMessage)

  const emailHtml = `
    <h2>Reserva Recibida</h2>
    <p>Hola ${reservation.client.name},</p>
    <p>Tu reserva ha sido recibida:</p>
    <ul>
      <li>Tour: ${reservation.tour.title}</li>
      <li>Fecha: ${reservation.date}</li>
      <li>Participantes: ${reservation.participants}</li>
      <li>Total: $${reservation.totalPrice}</li>
    </ul>
    <p>Te notificaremos cuando sea confirmada.</p>
    <p>Gracias por elegirnos!</p>
  `

  await sendEmail(reservation.client.email, 'Reserva Recibida', emailHtml)
}

export async function notifyReservationConfirmed(reservationId: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      tour: true,
      client: true,
      vehicle: true,
    },
  })

  if (!reservation) return

  const confirmationMessage = `
🎉 Reserva Confirmada

Hola ${reservation.client.name},

Tu reserva ha sido confirmada:
- Tour: ${reservation.tour.title}
- Fecha: ${reservation.date}
- Hora: ${reservation.time}
- Participantes: ${reservation.participants}
${reservation.vehicle ? `- Vehículo: ${reservation.vehicle.name}` : ''}

¡Nos vemos pronto!
  `.trim()

  await sendWhatsAppMessage(reservation.client.phone, confirmationMessage)

  const emailHtml = `
    <h2>Reserva Confirmada</h2>
    <p>Hola ${reservation.client.name},</p>
    <p>Tu reserva ha sido confirmada:</p>
    <ul>
      <li>Tour: ${reservation.tour.title}</li>
      <li>Fecha: ${reservation.date}</li>
      <li>Hora: ${reservation.time}</li>
      <li>Participantes: ${reservation.participants}</li>
      ${reservation.vehicle ? `<li>Vehículo: ${reservation.vehicle.name}</li>` : ''}
    </ul>
    <p>¡Nos vemos pronto!</p>
  `

  await sendEmail(reservation.client.email, 'Reserva Confirmada', emailHtml)
}

export async function scheduleReminder(reservationId: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      tour: true,
      client: true,
    },
  })

  if (!reservation || reservation.status !== 'CONFIRMED') return

  const reminderMessage = `
⏰ Recordatorio de Tour

Hola ${reservation.client.name},

Te recordamos que mañana tienes el tour:
- Tour: ${reservation.tour.title}
- Fecha: ${reservation.date}
- Hora: ${reservation.time}

¡Nos vemos mañana!
  `.trim()

  await sendWhatsAppMessage(reservation.client.phone, reminderMessage)
}

