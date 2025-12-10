import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Estadísticas por defecto
const defaultStats = {
  toursCompleted: 850,
  happyClients: 2400,
  yearsExperience: 12,
}

export async function GET() {
  try {
    const [toursCompleted, happyClients] = await Promise.all([
      prisma.reservation.count({
        where: { status: 'COMPLETED' },
      }),
      prisma.client.count(),
    ])

    // Si hay datos reales, usarlos
    if (toursCompleted > 0 || happyClients > 0) {
      return NextResponse.json({
        toursCompleted,
        happyClients,
        yearsExperience: 12,
      })
    }

    return NextResponse.json(defaultStats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(defaultStats)
  }
}

