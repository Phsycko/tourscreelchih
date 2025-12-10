'use client'

import { MessageCircle, Phone, Facebook, MapPin } from 'lucide-react'
import Link from 'next/link'

export default function CanalesPage() {
  const channels = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500',
      description: 'Chatea con nosotros directamente por WhatsApp',
      action: 'Abrir WhatsApp',
      href: 'https://wa.me/526351200217?text=Hola,%20me%20interesa%20información%20sobre%20los%20tours',
    },
    {
      id: 'phone',
      name: 'Llamada Directa',
      icon: Phone,
      color: 'bg-blue-600',
      description: 'Llámanos al +52 635 120 0217',
      action: 'Llamar Ahora',
      href: 'tel:+526351200217',
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-500',
      description: 'Síguenos y envíanos un mensaje',
      action: 'Ir a Facebook',
      href: 'https://www.facebook.com/share/19zfRSrGJS/?mibextid=wwXIfr',
    },
    {
      id: 'location',
      name: 'Ubicación',
      icon: MapPin,
      color: 'bg-red-500',
      description: 'Encuéntranos en Creel, Chihuahua',
      action: 'Ver en Mapa',
      href: 'https://maps.google.com/?q=Creel,Chihuahua,Mexico',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Canales de Venta</h1>
          <p className="text-gray-600 text-lg">
            Elige el canal que prefieras para contactarnos y hacer tu reserva
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channels.map((channel) => (
            <a
              key={channel.id}
              href={channel.href}
              target={channel.id !== 'phone' && channel.id !== 'email' ? '_blank' : undefined}
              rel={channel.id !== 'phone' && channel.id !== 'email' ? 'noopener noreferrer' : undefined}
              className="bg-white rounded-lg shadow-md p-8 hover:shadow-xl transition-shadow group"
            >
              <div className={`${channel.color} w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <channel.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{channel.name}</h3>
              <p className="text-gray-600 mb-4">{channel.description}</p>
              <div className="text-primary-600 font-semibold group-hover:text-primary-700">
                {channel.action} →
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 bg-primary-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Todos los Mensajes Llegan al Panel del Guía</h2>
          <p className="text-gray-700 mb-6">
            No importa por qué canal nos contactes, todos los mensajes se centralizan
            en el panel del guía para una respuesta rápida y eficiente.
          </p>
          <Link
            href="/reservar"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700"
          >
            O Reserva Directamente Aquí
          </Link>
        </div>
      </div>
    </div>
  )
}

