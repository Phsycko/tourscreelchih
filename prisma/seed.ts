import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ulisestours.com' },
    update: {},
    create: {
      email: 'admin@ulisestours.com',
      password: hashedPassword,
      name: 'Admin Ulises',
      role: 'ADMIN',
    },
  })

  // Create guide user
  const guide = await prisma.user.upsert({
    where: { email: 'guia@ulisestours.com' },
    update: {},
    create: {
      email: 'guia@ulisestours.com',
      password: hashedPassword,
      name: 'Guía Principal',
      role: 'GUIDE',
    },
  })

  // Create sample tours
  const tour1 = await prisma.tour.upsert({
    where: { id: 'tour-1' },
    update: {},
    create: {
      id: 'tour-1',
      title: 'Tour Kokoyome',
      description: 'Tour completo de 11 horas visitando los lugares más hermosos de Kokoyome.',
      duration: 11,
      difficulty: 'Moderado',
      price: 1400,
      maxCapacity: 20,
      image: 'https://lh3.googleusercontent.com/d/1oCcVps4HIu2A2B9S34bzonD1aWgIfHQ2',
      images: [
        'https://lh3.googleusercontent.com/d/1oCcVps4HIu2A2B9S34bzonD1aWgIfHQ2',
        'https://lh3.googleusercontent.com/d/1oCcVps4HIu2A2B9S34bzonD1aWgIfHQ2',
      ],
      itinerary: [
        'Mirador del Ángel',
        'Parque Turístico de Kokoyome',
        'Lago de las Garzas',
        'El Salto',
      ],
      includes: [],
      excludes: [],
      requirements: [],
      schedules: [],
      policies: '',
      languages: [],
      isActive: true,
    },
  })

  const tour2 = await prisma.tour.upsert({
    where: { id: 'tour-2' },
    update: {},
    create: {
      id: 'tour-2',
      title: 'Tour de Montaña',
      description: 'Aventura en las montañas con vistas espectaculares. Ideal para amantes de la naturaleza y el senderismo.',
      duration: 8,
      difficulty: 'Moderado',
      price: 80,
      maxCapacity: 10,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      images: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
      ],
      itinerary: [
        'Salida temprano',
        'Ascenso a montaña',
        'Almuerzo en ruta',
        'Vistas panorámicas',
        'Descenso y regreso',
      ],
      includes: [
        'Guía experto',
        'Transporte 4x4',
        'Almuerzo',
        'Equipo de seguridad',
        'Seguro de viaje',
      ],
      excludes: [
        'Bebidas alcohólicas',
        'Propinas',
      ],
      requirements: [
        'Buen estado físico',
        'Calzado de montaña',
        'Ropa abrigada',
        'Mochila pequeña',
      ],
      schedules: ['06:00'],
      policies: 'Tour sujeto a condiciones climáticas. Se requiere buen estado físico.',
      languages: ['Español', 'Inglés'],
      isActive: true,
    },
  })

  // Create sample vehicles
  const vehicle1 = await prisma.vehicle.upsert({
    where: { id: 'vehicle-1' },
    update: {},
    create: {
      id: 'vehicle-1',
      name: 'Van Comfort',
      type: 'Van',
      capacity: 12,
      description: 'Van cómoda y espaciosa, ideal para grupos medianos.',
      images: [
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
      ],
      amenities: [
        'Aire acondicionado',
        'Asientos reclinables',
        'WiFi',
        'Sistema de sonido',
      ],
      isActive: true,
    },
  })

  const vehicle2 = await prisma.vehicle.upsert({
    where: { id: 'vehicle-2' },
    update: {},
    create: {
      id: 'vehicle-2',
      name: 'SUV Premium',
      type: 'SUV',
      capacity: 6,
      description: 'SUV de lujo con todas las comodidades para grupos pequeños.',
      images: [
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800',
      ],
      amenities: [
        'Aire acondicionado',
        'Asientos de cuero',
        'Pantalla de entretenimiento',
        'WiFi',
        'Cargador USB',
      ],
      isActive: true,
    },
  })

  // Create sample availability
  const today = new Date()
  const dates = []
  for (let i = 1; i <= 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    dates.push(date)
  }

  for (const date of dates) {
    await prisma.availability.upsert({
      where: {
        tourId_date: {
          tourId: tour1.id,
          date: date,
        },
      },
      update: {},
      create: {
        tourId: tour1.id,
        date: date,
        available: true,
        capacity: 15,
        booked: 0,
      },
    })

    await prisma.availability.upsert({
      where: {
        tourId_date: {
          tourId: tour2.id,
          date: date,
        },
      },
      update: {},
      create: {
        tourId: tour2.id,
        date: date,
        available: true,
        capacity: 10,
        booked: 0,
      },
    })
  }

  console.log('Seed completed successfully!')
  console.log('Admin user: admin@ulisestours.com / admin123')
  console.log('Guide user: guia@ulisestours.com / admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

