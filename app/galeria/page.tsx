'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const galleryImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200',
    title: 'Tour de la Ciudad',
    category: 'Ciudad',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
    title: 'Tour de Montaña',
    category: 'Naturaleza',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200',
    title: 'Tour de Naturaleza',
    category: 'Naturaleza',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200',
    title: 'Tour Cultural',
    category: 'Cultura',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200',
    title: 'Tour de Aventura',
    category: 'Aventura',
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
    title: 'Tour Panorámico',
    category: 'Ciudad',
  },
]

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todos')

  const categories = ['Todos', 'Ciudad', 'Naturaleza', 'Cultura', 'Aventura']

  const filteredImages =
    selectedCategory === 'Todos'
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Galería</h1>
          <p className="text-gray-600 text-lg">Momentos capturados de nuestros tours</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Main Carousel */}
        <div className="mb-12">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            className="h-96 rounded-lg"
          >
            {filteredImages.slice(0, 5).map((image) => (
              <SwiperSlide key={image.id}>
                <div className="relative h-full w-full">
                  <Image
                    src={image.url}
                    alt={image.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                    <h3 className="text-white text-2xl font-bold">{image.title}</h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="relative h-64 rounded-lg overflow-hidden group cursor-pointer"
            >
              <Image
                src={image.url}
                alt={image.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <h3 className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xl">
                  {image.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

