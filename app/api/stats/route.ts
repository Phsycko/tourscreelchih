import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Estadísticas por defecto
const defaultStats = {
  toursCompleted: 850,
  happyClients: 2400,
  yearsExperience: 12,
}

export async function GET() {
  // Devolver estadísticas directamente - página informativa
  return NextResponse.json(defaultStats)
}

