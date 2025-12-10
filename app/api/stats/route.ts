import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [toursCompleted, happyClients, yearsExperience] = await Promise.all([
      prisma.reservation.count({
        where: { status: 'COMPLETED' },
      }),
      prisma.client.count(),
      Promise.resolve(5), // Puedes calcular esto basado en la fecha de creación del primer tour
    ])

    return NextResponse.json({
      toursCompleted,
      happyClients,
      yearsExperience,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { toursCompleted: 0, happyClients: 0, yearsExperience: 0 },
      { status: 500 }
    )
  }
}

