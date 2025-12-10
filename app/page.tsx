import Link from 'next/link'
import { Calendar, Users, Star, Shield, Globe, CheckCircle } from 'lucide-react'
import TourCard from '@/components/TourCard'
import TestimonialCard from '@/components/TestimonialCard'
import ImageCarousel from '@/components/ImageCarousel'
import { AnimatedSection, AnimatedDiv } from '@/components/AnimatedSection'

async function getTours() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/api/tours`, {
    cache: 'no-store',
  })
  if (!res.ok) return []
  return res.json()
}

async function getStats() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/api/stats`, {
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
      <section className="relative h-screen flex items-center justify-center text-white overflow-hidden">
        {/* Background Image - Barrancas del Cobre, Chihuahua */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://mexicorutamagica.mx/wp-content/uploads/2022/06/Barrancas-del-cobre-precios.jpg')",
          }}
        ></div>
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent"></div>
        {/* Bottom gradient transition to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-slate-300"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <AnimatedDiv className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-2xl">
            Descubre Experiencias Únicas
          </AnimatedDiv>
          <AnimatedDiv delay={0.2} className="text-xl md:text-2xl mb-8 drop-shadow-lg text-white/95">
            Tours personalizados con guías expertos que te mostrarán los mejores lugares
          </AnimatedDiv>
          <AnimatedDiv delay={0.4}>
            <Link
              href="/cotizar"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 hover:shadow-white/20"
            >
              Solicitar Cotización
            </Link>
          </AnimatedDiv>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/70 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Info Section with Carousel */}
      <section className="py-16 bg-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-block bg-primary-600/10 text-primary-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4 border border-primary-200">
              Tu Aventura Comienza Aquí
            </span>
            <h2 className="text-4xl font-bold mb-6 text-slate-800">Vive la Magia de la Sierra Tarahumara</h2>
            <div className="max-w-4xl mx-auto space-y-4">
              <p className="text-slate-700 text-lg leading-relaxed">
                Desde el corazón de <span className="font-bold text-primary-600">Creel, Pueblo Mágico</span>, 
                te llevamos a explorar uno de los tesoros naturales más impresionantes de México: 
                <span className="font-bold"> las Barrancas del Cobre</span>, un sistema de cañones 
                <span className="font-bold text-primary-600"> cuatro veces más grande que el Gran Cañón de Arizona</span>.
              </p>
              <p className="text-slate-600 text-base leading-relaxed">
                Sumérgete en paisajes que quitan el aliento, cascadas majestuosas, bosques de pino milenarios, 
                aguas termales naturales y la rica cultura del pueblo Rarámuri. Con más de 
                <span className="font-semibold"> 12 años de experiencia</span> y guías locales certificados, 
                te garantizamos una experiencia segura, auténtica e inolvidable.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-slate-700 font-medium">Guías certificados bilingües</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-slate-700 font-medium">Transporte seguro y cómodo</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-slate-700 font-medium">Tours personalizados</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-slate-700 font-medium">Grupos pequeños</span>
              </div>
            </div>
          </div>
          <ImageCarousel />
        </div>
      </section>

      {/* Featured Tours - Top 3 */}
      <section className="py-10 bg-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <span className="inline-block bg-primary-600 text-white text-sm font-semibold px-4 py-1 rounded-full mb-3">
              ⭐ Los más solicitados
            </span>
            <h2 className="text-3xl font-bold mb-2 text-slate-800">Top 3 Tours Destacados</h2>
            <p className="text-slate-600">Las experiencias favoritas de nuestros viajeros</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tours.slice(0, 3).map((tour: any, index: number) => (
              <AnimatedSection key={tour.id} delay={index * 0.15}>
                <div className="relative">
                  {index === 0 && (
                    <div className="absolute -top-3 -right-3 z-10 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      🏆 #1 Más Popular
                    </div>
                  )}
                  {index === 1 && (
                    <div className="absolute -top-3 -right-3 z-10 bg-slate-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      🥈 #2
                    </div>
                  )}
                  {index === 2 && (
                    <div className="absolute -top-3 -right-3 z-10 bg-amber-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      🥉 #3
                    </div>
                  )}
                  <TourCard tour={tour} />
                </div>
              </AnimatedSection>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/tours"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all hover:scale-105 shadow-lg"
            >
              Ver Todos los Tours
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-10 bg-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-slate-800">¿Por Qué Elegirnos?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: 'Guías Expertos', desc: 'Profesionales certificados y apasionados' },
              { icon: Shield, title: '100% Seguro', desc: 'Seguro de viaje incluido en todos los tours' },
              { icon: Globe, title: 'Múltiples Idiomas', desc: 'Español, Inglés, Francés y más' },
              { icon: CheckCircle, title: 'Garantía', desc: 'Satisfacción garantizada o reembolso' },
            ].map((benefit, index) => (
              <AnimatedSection
                key={benefit.title}
                delay={index * 0.1}
                className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <benefit.icon className="w-12 h-12 mx-auto mb-4 text-primary-600" />
                <h3 className="text-lg font-semibold mb-2 text-slate-800">{benefit.title}</h3>
                <p className="text-slate-600">{benefit.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 bg-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <AnimatedSection className="text-center">
              <div className="text-5xl font-bold text-primary-400 mb-2">{stats.toursCompleted}+</div>
              <div className="text-slate-300">Tours Realizados</div>
            </AnimatedSection>
            <AnimatedSection delay={0.1} className="text-center">
              <div className="text-5xl font-bold text-primary-400 mb-2">{stats.happyClients}+</div>
              <div className="text-slate-300">Clientes Satisfechos</div>
            </AnimatedSection>
            <AnimatedSection delay={0.2} className="text-center">
              <div className="text-5xl font-bold text-primary-400 mb-2">{stats.yearsExperience}+</div>
              <div className="text-slate-300">Años de Experiencia</div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-10 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2 text-white">Lo Que Dicen Nuestros Clientes</h2>
            <p className="text-slate-400">Experiencias reales de viajeros satisfechos</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Ana Martínez',
                rating: 5,
                comment: 'Una experiencia increíble. El guía fue muy profesional y conocía perfectamente cada lugar.',
                tour: 'Tour Kokoyome',
              },
              {
                name: 'John Smith',
                rating: 5,
                comment: 'Excelente servicio, puntualidad y atención. Definitivamente lo recomiendo.',
                tour: 'Tour de Montaña',
              },
              {
                name: 'Laura Hernández',
                rating: 5,
                comment: 'Superó todas mis expectativas. El vehículo estaba impecable y el tour fue perfecto.',
                tour: 'Barrancas del Cobre',
              },
            ].map((testimonial, index) => (
              <AnimatedSection key={index} delay={index * 0.1} className="h-full">
                <TestimonialCard testimonial={testimonial} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

