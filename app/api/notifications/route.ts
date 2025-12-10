import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const isRead = searchParams.get('isRead')

    const notifications = await prisma.notification.findMany({
      where: {
        ...(userId ? { userId } : {}),
        ...(isRead !== null ? { isRead: isRead === 'true' } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Error fetching notifications' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, isRead } = await request.json()

    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead },
    })

    return NextResponse.json(notification)
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { error: 'Error updating notification' },
      { status: 500 }
    )
  }
}
