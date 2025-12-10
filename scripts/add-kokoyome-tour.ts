import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Crear o actualizar el tour Kokoyome
  const tourKokoyome = await prisma.tour.upsert({
    where: { id: 'tour-kokoyome' },
    update: {
      title: 'Tour Kokoyome',
      description: 'Descubre los lugares más hermosos de Kokoyome en un tour completo de 11 horas. Visita el mirador del ángel, el parque turístico de Kokoyome, el lago de las garzas y el salto. Una experiencia inolvidable llena de naturaleza y paisajes espectaculares.',
      duration: 11,
      difficulty: 'Moderado',
      price: 120,
      maxCapacity: 20,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
        'https://images.unsplash.com/photo-1511497584788-876760111969?w=800',
      ],
      itinerary: [
        'Mirador del Ángel',
        'Parque Turístico de Kokoyome',
        'Lago de las Garzas',
        'El Salto',
      ],
      includes: [
        'Guía profesional bilingüe',
        'Transporte ida y vuelta',
        'Almuerzo típico',
        'Agua embotellada',
        'Seguro de viaje',
        'Entradas a los lugares turísticos',
      ],
      excludes: [
        'Bebidas alcohólicas',
        'Propinas',
        'Gastos personales',
        'Snacks adicionales',
      ],
      requirements: [
        'Calzado cómodo para caminar',
        'Ropa adecuada al clima',
        'Protector solar',
        'Cámara fotográfica (opcional)',
        'Repelente de insectos',
      ],
      schedules: ['06:00'],
      policies: 'Cancelación gratuita hasta 48 horas antes del tour. En caso de mal tiempo, se reprogramará la fecha. El tour requiere buen estado físico debido a la duración y caminatas incluidas.',
      languages: ['Español', 'Inglés'],
      isActive: true,
    },
    create: {
      id: 'tour-kokoyome',
      title: 'Tour Kokoyome',
      description: 'Descubre los lugares más hermosos de Kokoyome en un tour completo de 11 horas. Visita el mirador del ángel, el parque turístico de Kokoyome, el lago de las garzas y el salto. Una experiencia inolvidable llena de naturaleza y paisajes espectaculares.',
      duration: 11,
      difficulty: 'Moderado',
      price: 120,
      maxCapacity: 20,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
        'https://images.unsplash.com/photo-1511497584788-876760111969?w=800',
      ],
      itinerary: [
        'Mirador del Ángel',
        'Parque Turístico de Kokoyome',
        'Lago de las Garzas',
        'El Salto',
      ],
      includes: [
        'Guía profesional bilingüe',
        'Transporte ida y vuelta',
        'Almuerzo típico',
        'Agua embotellada',
        'Seguro de viaje',
        'Entradas a los lugares turísticos',
      ],
      excludes: [
        'Bebidas alcohólicas',
        'Propinas',
        'Gastos personales',
        'Snacks adicionales',
      ],
      requirements: [
        'Calzado cómodo para caminar',
        'Ropa adecuada al clima',
        'Protector solar',
        'Cámara fotográfica (opcional)',
        'Repelente de insectos',
      ],
      schedules: ['06:00'],
      policies: 'Cancelación gratuita hasta 48 horas antes del tour. En caso de mal tiempo, se reprogramará la fecha. El tour requiere buen estado físico debido a la duración y caminatas incluidas.',
      languages: ['Español', 'Inglés'],
      isActive: true,
    },
  })

  // Crear disponibilidad para los próximos 30 días
  const today = new Date()
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    
    await prisma.availability.upsert({
      where: {
        tourId_date: {
          tourId: tourKokoyome.id,
          date: date,
        },
      },
      update: {},
      create: {
        tourId: tourKokoyome.id,
        date: date,
        available: true,
        capacity: 20,
        booked: 0,
      },
    })
  }

  console.log('✅ Tour Kokoyome creado exitosamente!')
  console.log(`   ID: ${tourKokoyome.id}`)
  console.log(`   Título: ${tourKokoyome.title}`)
  console.log(`   Duración: ${tourKokoyome.duration} horas`)
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

