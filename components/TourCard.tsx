'use client'

import { Clock, Users, ArrowRight } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

export default function TourCard({ tour }: { tour: any }) {
  const { t } = useTranslation()
  
  const getImageUrl = () => {
    if (tour.id === 'tour-kokoyome' || tour.title === 'Tour Kokoyome') {
      return '/images/kokoyome.jpg'
    }
    return tour.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800'
  }
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all h-full flex flex-col">
      <div className="relative h-52 w-full block">
        <img
          src={getImageUrl()}
          alt={tour.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            if (tour.id === 'tour-kokoyome' || tour.title === 'Tour Kokoyome') {
              e.currentTarget.src = '/images/kokoyome.jpg'
            }
          }}
        />
        {/* Overlay con título */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-xl font-bold text-white drop-shadow-lg">
            {(() => {
              const translatedTitle = t(`tours.tourTitles.${tour.id}`)
              return translatedTitle && translatedTitle !== `tours.tourTitles.${tour.id}` ? translatedTitle : tour.title
            })()}
          </h3>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm flex-grow">
          {(() => {
            const translated = t(`tours.tourDescriptions.${tour.id}`)
            return translated && translated !== `tours.tourDescriptions.${tour.id}` ? translated : tour.description
          })()}
        </p>
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{tour.duration}{t('tours.duration')}</span>
          </div>
          <div className="flex items-center">
            <Users size={16} className="mr-1" />
            <span>{t('tours.capacity')} {tour.maxCapacity}</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center text-slate-600 font-medium text-sm">
            {t('tours.detail')}
            <ArrowRight size={16} className="ml-1" />
          </div>
          <div className="bg-primary-600 text-white px-4 py-2 rounded-lg font-semibold text-sm">
            {t('tours.quote')}
          </div>
        </div>
      </div>
    </div>
  )
}

