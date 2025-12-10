import Link from 'next/link'
import { Calendar, Users, Star, Shield, Globe, CheckCircle } from 'lucide-react'
import TourCard from '@/components/TourCard'
import TestimonialCard from '@/components/TestimonialCard'
import { AnimatedSection, AnimatedDiv } from '@/components/AnimatedSection'

async function getTours() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/tours`, {
    cache: 'no-store',
  })
  if (!res.ok) return []
  return res.json()
}

async function getStats() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/stats`, {
    cache: 'no-store',
  })
  if (!res.ok) return { toursCompleted: 0, happyClients: 0, yearsExperience: 0 }
  return res.json()
}

export default async function Home() {
  const tours = await getTours()
  const stats = await getStats()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920')",
          }}
        ></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <AnimatedDiv className="text-5xl md:text-7xl font-bold mb-6">
            Descubre Experiencias Únicas
          </AnimatedDiv>
          <AnimatedDiv delay={0.2} className="text-xl md:text-2xl mb-8">
            Tours personalizados con guías expertos que te mostrarán los mejores lugares
          </AnimatedDiv>
          <AnimatedDiv delay={0.4}>
            <Link
              href="/reservar"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Reservar Ahora
            </Link>
          </AnimatedDiv>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection className="text-center">
              <div className="text-5xl font-bold text-primary-600 mb-2">{stats.toursCompleted}+</div>
              <div className="text-gray-600">Tours Realizados</div>
            </AnimatedSection>
            <AnimatedSection delay={0.1} className="text-center">
              <div className="text-5xl font-bold text-primary-600 mb-2">{stats.happyClients}+</div>
              <div className="text-gray-600">Clientes Satisfechos</div>
            </AnimatedSection>
            <AnimatedSection delay={0.2} className="text-center">
              <div className="text-5xl font-bold text-primary-600 mb-2">{stats.yearsExperience}+</div>
              <div className="text-gray-600">Años de Experiencia</div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Tours Destacados</h2>
            <p className="text-gray-600 text-lg">Elige la experiencia perfecta para ti</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.slice(0, 6).map((tour: any, index: number) => (
              <AnimatedSection key={tour.id} delay={index * 0.1}>
                <TourCard tour={tour} />
              </AnimatedSection>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/tours"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              Ver Todos los Tours
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">¿Por Qué Elegirnos?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Users, title: 'Guías Expertos', desc: 'Profesionales certificados y apasionados' },
              { icon: Shield, title: '100% Seguro', desc: 'Seguro de viaje incluido en todos los tours' },
              { icon: Globe, title: 'Múltiples Idiomas', desc: 'Español, Inglés, Francés y más' },
              { icon: CheckCircle, title: 'Garantía', desc: 'Satisfacción garantizada o reembolso' },
            ].map((benefit, index) => (
              <AnimatedSection
                key={benefit.title}
                delay={index * 0.1}
                className="bg-white p-6 rounded-lg shadow-md text-center"
              >
                <benefit.icon className="w-12 h-12 mx-auto mb-4 text-primary-600" />
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Lo Que Dicen Nuestros Clientes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Ana Martínez',
                rating: 5,
                comment: 'Una experiencia increíble. El guía fue muy profesional y conocía perfectamente cada lugar.',
                tour: 'Tour de la Ciudad',
              },
              {
                name: 'John Smith',
                rating: 5,
                comment: 'Excelente servicio, puntualidad y atención. Definitivamente lo recomiendo.',
                tour: 'Tour de Montaña',
              },
              {
                name: 'María García',
                rating: 5,
                comment: 'Superó todas mis expectativas. El vehículo estaba impecable y el tour fue perfecto.',
                tour: 'Tour Privado',
              },
            ].map((testimonial, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <TestimonialCard testimonial={testimonial} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

