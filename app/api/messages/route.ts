import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createNotification } from '@/lib/notifications'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const isRead = searchParams.get('isRead')
    const channel = searchParams.get('channel')

    const messages = await prisma.message.findMany({
      where: {
        ...(isRead !== null ? { isRead: isRead === 'true' } : {}),
        ...(channel ? { channel: channel as any } : {}),
      },
      include: {
        client: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Error fetching messages' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { channel, from, to, subject, content, clientId } = body

    const message = await prisma.message.create({
      data: {
        channel: channel as any,
        from,
        to,
        subject,
        content,
        clientId,
      },
    })

    // Notify guides
    const guides = await prisma.user.findMany({
      where: { role: 'GUIDE' },
    })

    for (const guide of guides) {
      await createNotification(
        'MESSAGE_RECEIVED',
        `Nuevo mensaje de ${channel}`,
        content.substring(0, 100),
        guide.id,
        { messageId: message.id, channel }
      )
    }

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json(
      { error: 'Error creating message' },
      { status: 500 }
    )
  }
}

