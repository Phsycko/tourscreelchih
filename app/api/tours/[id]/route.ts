import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// TODOS los tours - NO MODIFICAR
const defaultTours = [
  {
    id: 'tour-kokoyome',
    title: 'Tour Kokoyome',
    description: 'Tour completo de 11 horas visitando los lugares más hermosos de Kokoyome.',
    price: 1400,
    duration: 11,
    maxCapacity: 20,
    difficulty: 'Moderado',
    image: '/images/kokoyome.jpg',
    itinerary: ['Mirador del Ángel', 'Parque Turístico de Kokoyome', 'Lago de las Garzas', 'El Salto'],
    includes: ['Guía profesional', 'Transporte', 'Seguro de viaje'],
    excludes: ['Alimentos', 'Propinas'],
  },
  {
    id: 'tour-creel',
    title: 'Creel Pueblo Mágico',
    description: 'Descubre la magia de Creel, un pueblo mágico lleno de cultura, historia y naturaleza. Duración aproximada de 3 a 5 horas.',
    price: 1200,
    duration: 4,
    maxCapacity: 15,
    difficulty: 'Fácil',
    image: 'https://www.mexicodesconocido.com.mx/wp-content/uploads/2019/02/CREEL-XV.jpg',
    itinerary: ['Museo Casa Tarahumara', 'Mirador Cristo Rey', 'Cueva de los Leones', 'Bosque Mágico'],
    includes: ['Guía profesional', 'Transporte', 'Seguro de viaje'],
    excludes: ['Alimentos', 'Entradas'],
  },
  {
    id: 'tour-campos-menonitas',
    title: 'Campos Menonitas',
    description: 'Conoce la cultura y tradiciones menonitas en un tour completo que incluye museo, quesería, corredor comercial y deliciosa comida. Duración aproximada de 9 a 10 horas.',
    price: 1500,
    duration: 9,
    maxCapacity: 20,
    difficulty: 'Fácil',
    image: 'https://www.mexicodesconocido.com.mx/wp-content/uploads/2019/02/MENONITAS-XV.jpg',
    itinerary: ['Museo Menonita', 'Casa de la Galleta', 'Quesería', 'Recorrido por Corredor Comercial Menonita', 'Restaurant con Especialidad en Pizzas Menonitas'],
    includes: ['Guía profesional', 'Transporte', 'Seguro de viaje'],
    excludes: ['Alimentos', 'Compras'],
  },
  {
    id: 'tour-region-tarahumara',
    title: 'Región Tarahumara',
    description: 'Te llevamos a vivir una experiencia inolvidable en la Región Tarahumara, descubriendo los lugares más emblemáticos de esta cultura ancestral.',
    price: 1800,
    duration: 10,
    maxCapacity: 18,
    difficulty: 'Moderado',
    image: 'https://static.wixstatic.com/media/969a80_43570240a269445faced04d5a9a77ac0~mv2.jpg/v1/fill/w_2048,h_1360,al_c,q_90/969a80_43570240a269445faced04d5a9a77ac0~mv2.webp',
    itinerary: ['Valle de las Ranas', 'Valle de los Hongos', 'Misión Jesuita', 'Cueva de Sebastián', 'Cascada de Cusarare', 'Lago de Arareko'],
    includes: ['Guía profesional', 'Transporte', 'Seguro de viaje'],
    excludes: ['Entradas', 'Servicios no especificados por el guía'],
  },
  {
    id: 'tour-batopilas',
    title: 'Batopilas',
    description: 'Descubre la historia y cultura de Batopilas, un pueblo mágico lleno de tradición y arquitectura colonial. Duración aproximada de 12 horas.',
    price: 2000,
    duration: 12,
    maxCapacity: 18,
    difficulty: 'Moderado',
    image: 'https://chihuahua.gob.mx/sites/default/atach2/noticias/imagen-destacada/2023-10/IMG-20231015-WA0004.jpg',
    itinerary: ['Mirador de la Bufa', 'Museo Batopilas', 'Misión Perdida de Satevo', 'Ruinas de Hacienda San Miguel', 'Letras Monumentales'],
    includes: ['Guía profesional', 'Transporte', 'Seguro de viaje'],
    excludes: ['Alimentos', 'Hospedaje'],
  },
  {
    id: 'tour-entre-canones',
    title: 'Entre Cañones',
    description: 'Vive una experiencia única entre los cañones más impresionantes, visitando miradores, misiones y cascadas. Duración aproximada de 10 horas.',
    price: 1700,
    duration: 10,
    maxCapacity: 18,
    difficulty: 'Moderado',
    image: 'https://static.wixstatic.com/media/240fe8_1a03fd6b7f3e416bbff8069afd4ce906~mv2.jpg/v1/fill/w_1480,h_986,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/240fe8_1a03fd6b7f3e416bbff8069afd4ce906~mv2.jpg',
    itinerary: ['Mirador Cerro del Gallego', 'Cerocahui', 'Misión Jesuita', 'Cascada Cerocahui', 'Hotel Valderrama (Viñedo)'],
    includes: ['Guía profesional', 'Transporte', 'Seguro de viaje'],
    excludes: ['Alimentos', 'Entradas'],
  },
  {
    id: 'tour-valle-monjes',
    title: 'Valle de los Monjes',
    description: 'Explora el impresionante Valle de los Monjes con sus formaciones rocosas únicas y paisajes naturales. Duración aproximada de 4 horas.',
    price: 1100,
    duration: 4,
    maxCapacity: 15,
    difficulty: 'Fácil',
    image: 'https://static.wixstatic.com/media/cf3297_80f2802fed6e432084200bba2a33c782~mv2.jpeg/v1/fill/w_1920,h_1280,al_c,q_90/cf3297_80f2802fed6e432084200bba2a33c782~mv2.jpeg',
    itinerary: ['Valle de los Monjes', 'Focotonal', 'Mirador de la División Continental', 'Valle de la Montura', 'Caminata entre el valle'],
    includes: ['Guía profesional', 'Transporte', 'Seguro de viaje'],
    excludes: ['Alimentos'],
  },
  {
    id: 'tour-recowata',
    title: 'Aguas Termales de Recowata',
    description: 'Relájate y disfruta de las aguas termales de Recowata, con visita al mirador y opción de caminata. Duración aproximada de 7 horas.',
    price: 1300,
    duration: 7,
    maxCapacity: 15,
    difficulty: 'Fácil',
    image: 'https://static.wixstatic.com/media/cf3297_4c1c0856b16e47f1a6f1fc3872a6575e~mv2.jpg/v1/fill/w_1200,h_800,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/cf3297_4c1c0856b16e47f1a6f1fc3872a6575e~mv2.jpg',
    itinerary: ['Mirador de Tararekua', 'Aguas Termales', 'Opción de Caminata'],
    includes: ['Guía profesional', 'Transporte', 'Seguro de viaje'],
    excludes: ['Entrada a aguas termales', 'Alimentos'],
  },
  {
    id: 'tour-basaseachi',
    title: 'Cascada de Basaseachi',
    description: 'Descubre una de las cascadas más impresionantes de México, con múltiples miradores y el poblado de Basaseachi. Duración aproximada de 10 horas.',
    price: 1600,
    duration: 10,
    maxCapacity: 18,
    difficulty: 'Moderado',
    image: 'https://cdn.unotv.com/images/2024/05/cascada-de-basaseachi-110108.jpg',
    itinerary: ['Nacimiento de la Cascada', '3 Miradores de la Cascada', 'Poblado de Basaseachi', 'Caminata al Fondo de la Cascada (Opcional)'],
    includes: ['Guía profesional', 'Transporte', 'Seguro de viaje'],
    excludes: ['Alimentos', 'Entradas'],
  },
  {
    id: 'tour-barrancas-cobre',
    title: 'Parque Aventura, Barrancas del Cobre',
    description: 'Vive una experiencia única en el Parque Aventura de Barrancas del Cobre, con teleférico, tirolesa y miradores espectaculares. Duración aproximada de 7 a 8 horas.',
    price: 1900,
    duration: 8,
    maxCapacity: 20,
    difficulty: 'Moderado',
    image: 'https://mexicorutamagica.mx/wp-content/uploads/2022/06/Barrancas-del-cobre-precios.jpg',
    itinerary: ['Teleférico', 'Tirolesa más Grande del Mundo', 'Restaurante Temple de Vidrio', 'Piedra Volada', 'Puente Colgante', 'Mirador Río Oteros', 'Estación Divisadero', 'Letras Monumentales'],
    includes: ['Guía profesional', 'Transporte', 'Seguro de viaje'],
    excludes: ['Entradas', 'Servicios no especificados por el guía'],
  },
]

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const tour = await prisma.tour.findUnique({
      where: { id: params.id },
      include: {
        availability: {
          where: {
            date: { gte: new Date() },
            available: true,
          },
          orderBy: { date: 'asc' },
        },
      },
    })

    if (!tour) {
      // Si no se encuentra en la BD, buscar en tours por defecto
      const defaultTour = defaultTours.find(t => t.id === params.id)
      if (defaultTour) {
        return NextResponse.json(defaultTour)
      }
      return NextResponse.json({ error: 'Tour not found' }, { status: 404 })
    }

    return NextResponse.json(tour)
  } catch (error) {
    console.error('Error fetching tour:', error)
    // En caso de error de BD, buscar en tours por defecto
    const defaultTour = defaultTours.find(t => t.id === params.id)
    if (defaultTour) {
      return NextResponse.json(defaultTour)
    }
    return NextResponse.json(
      { error: 'Error fetching tour' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const tour = await prisma.tour.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json(tour)
  } catch (error) {
    console.error('Error updating tour:', error)
    return NextResponse.json(
      { error: 'Error updating tour' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.tour.update({
      where: { id: params.id },
      data: { isActive: false },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tour:', error)
    return NextResponse.json(
      { error: 'Error deleting tour' },
      { status: 500 }
    )
  }
}

