'use client'

import Link from 'next/link'
import { Calendar, Users, Star, Shield, Globe, CheckCircle } from 'lucide-react'
import TourCard from '@/components/TourCard'
import TestimonialCard from '@/components/TestimonialCard'
import ImageCarousel from '@/components/ImageCarousel'
import TourModal from '@/components/TourModal'
import { AnimatedSection, AnimatedDiv } from '@/components/AnimatedSection'
import { useTranslation } from '@/lib/i18n/context'
import { useState, useEffect } from 'react'

export default function Home() {
  const { t, language } = useTranslation()
  const [tours, setTours] = useState<any[]>([])
  const [stats, setStats] = useState({ toursCompleted: 0, happyClients: 0, yearsExperience: 0 })
  const [selectedTour, setSelectedTour] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const toursRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/api/tours`)
        if (toursRes.ok) {
          const toursData = await toursRes.json()
          setTours(Array.isArray(toursData) ? toursData : [])
        }
        
        const statsRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/api/stats`)
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats(statsData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  const handleTourClick = (tour: any) => {
    setSelectedTour(tour)
    setIsModalOpen(true)
  }

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
        
        <div className="relative z-10 text-center px-4 sm:px-6 md:px-8 max-w-4xl mx-auto">
          <AnimatedDiv className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 drop-shadow-2xl leading-tight">
            {t('home.hero.title')}
          </AnimatedDiv>
          <AnimatedDiv delay={0.2} className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 drop-shadow-lg text-white/95 px-2">
            {t('home.hero.subtitle')}
          </AnimatedDiv>
          <AnimatedDiv delay={0.4}>
            <Link
              href="/cotizar"
              className="inline-block bg-white text-primary-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 hover:shadow-white/20 touch-manipulation active:scale-95"
            >
              {t('home.hero.cta')}
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
      <section className="py-8 sm:py-12 md:py-16 bg-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <span className="inline-block bg-primary-600/10 text-primary-700 text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full mb-3 sm:mb-4 border border-primary-200">
              {t('home.info.badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-slate-800 px-2">{t('home.info.title')}</h2>
            <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
              <p className="text-slate-700 text-sm sm:text-base md:text-lg leading-relaxed px-2">
                {t('home.info.description1')} <span className="font-bold text-primary-600">{t('home.info.creel')}</span>, 
                {t('home.info.description2')} 
                <span className="font-bold"> {t('home.info.copperCanyons')}</span>, {t('home.info.description3')} 
                <span className="font-bold text-primary-600"> {t('home.info.description4')}</span>.
              </p>
              <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed px-2">
                {t('home.info.description5')} 
                <span className="font-semibold"> {t('home.info.years')}</span> {t('home.info.description6')}
              </p>
            </div>
            <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm">
              <div className="flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-slate-700 font-medium">{t('home.info.features.certified')}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-slate-700 font-medium">{t('home.info.features.transport')}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-slate-700 font-medium">{t('home.info.features.custom')}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/70 px-4 py-2 rounded-full shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-slate-700 font-medium">{t('home.info.features.small')}</span>
              </div>
            </div>
          </div>
          <ImageCarousel />
        </div>
      </section>

      {/* Featured Tours - Top 3 */}
      <section className="py-8 sm:py-10 bg-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <span className="inline-block bg-primary-600 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1 rounded-full mb-2 sm:mb-3">
              {t('home.tours.badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-800">{t('home.tours.title')}</h2>
            <p className="text-sm sm:text-base text-slate-600">{t('home.tours.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {tours.slice(0, 3).map((tour: any, index: number) => (
              <AnimatedSection key={`${tour.id}-${language}`} delay={index * 0.15}>
                <div className="relative">
                  {index === 0 && (
                    <div className="absolute -top-3 -right-3 z-10 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      🏆 {t('home.tours.popular')}
                    </div>
                  )}
                  {index === 1 && (
                    <div className="absolute -top-3 -right-3 z-10 bg-slate-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      🥈 {t('home.tours.second')}
                    </div>
                  )}
                  {index === 2 && (
                    <div className="absolute -top-3 -right-3 z-10 bg-amber-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      🥉 {t('home.tours.third')}
                    </div>
                  )}
                  <div onClick={() => handleTourClick(tour)} className="cursor-pointer">
                    <TourCard tour={tour} />
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <div className="text-center mt-6 sm:mt-8">
            <Link
              href="/tours"
              className="inline-block bg-primary-600 text-white px-6 sm:px-8 py-3 rounded-xl text-sm sm:text-base font-semibold hover:bg-primary-700 transition-all hover:scale-105 shadow-lg touch-manipulation active:scale-95"
            >
              {t('home.tours.cta')}
            </Link>
          </div>
        </div>
      </section>

      {/* Tour Modal */}
      <TourModal
        tour={selectedTour}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedTour(null)
        }}
      />

      {/* Benefits Section */}
      <section className="py-8 sm:py-10 bg-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">{t('home.benefits.title')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Users, title: t('home.benefits.expert.title'), desc: t('home.benefits.expert.desc') },
              { icon: Shield, title: t('home.benefits.safe.title'), desc: t('home.benefits.safe.desc') },
              { icon: Globe, title: t('home.benefits.languages.title'), desc: t('home.benefits.languages.desc') },
              { icon: CheckCircle, title: t('home.benefits.guarantee.title'), desc: t('home.benefits.guarantee.desc') },
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
      <section className="py-8 sm:py-10 bg-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <AnimatedSection className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-primary-400 mb-2">{stats.toursCompleted}+</div>
              <div className="text-sm sm:text-base text-slate-300">{t('home.stats.tours')}</div>
            </AnimatedSection>
            <AnimatedSection delay={0.1} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-primary-400 mb-2">{stats.happyClients}+</div>
              <div className="text-sm sm:text-base text-slate-300">{t('home.stats.clients')}</div>
            </AnimatedSection>
            <AnimatedSection delay={0.2} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-primary-400 mb-2">{stats.yearsExperience}+</div>
              <div className="text-sm sm:text-base text-slate-300">{t('home.stats.experience')}</div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-8 sm:py-10 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">{t('home.testimonials.title')}</h2>
            <p className="text-sm sm:text-base text-slate-400">{t('home.testimonials.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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

